// ==UserScript==
// @name         新泰坦素材下载辅助器 wlc_elements_downloader
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  新泰坦素材下载辅助器未来车专用版
// @author       未来车
// @match        https://elements.envato.com/*
// @match        https://data.katamao.com:8008/*
// @match        http://localhost:8888/*
// @match        https://cmfv.katamao.com/*
// @icon         https://yt3.ggpht.com/ytc/AKedOLTGihIhNtDEzL8mdLPXEf2wQOpvkjucvu5eHXTvyw=s900-c-k-c0x00ffffff-no-rj
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435565/%E6%96%B0%E6%B3%B0%E5%9D%A6%E7%B4%A0%E6%9D%90%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9%E5%99%A8%20wlc_elements_downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435565/%E6%96%B0%E6%B3%B0%E5%9D%A6%E7%B4%A0%E6%9D%90%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9%E5%99%A8%20wlc_elements_downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var token = '';
    var footage_id = 0;
    var apihost = 'https://4006.katamao.com:7007';


    $(document).ready(() => {
        if (top.location == self.location) {
            // 注入变量
            waitUtil('body', () => {
                $('body').append(`<script>var wlc_elements_downloader=true;</script>`);
            });
            return;
        }
        token = getQueryParam('token');
        footage_id = getQueryParam('footage_id');
        if (getQueryParam('apihost')) {
            apihost = getQueryParam('apihost');
        }
        if (window.location.href.indexOf('envato.com') > -1) {
            waitUtil('body', () => {
                $('body').css({opacity: 0});
            });
            init_envato();
        }
    });

    function loadScript(script_url) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = chrome.extension.getURL('mySuperScript.js');
        head.appendChild(script);
        someFunctionFromMySuperScript(request.widgetFrame);// ReferenceError: someFunctionFromMySuperScript is not defined
    }

    function waitUtil(ele, cb) {
        if ($(ele).length > 0) {
            cb();
        } else {
            setTimeout(() => {
                waitUtil(ele, cb);
            }, 100);
        }
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function getQueryParam(name) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == name) {
                return pair[1];
            }
        }
        return (false);
    }


// 要注入的css
    var inject_css = `
<style>
main header,
[data-test-selector="collection-popup-button"],
 [data-test-selector="item-card-download-button"]{
    display: none !important;
}
.req-download {
    text-align: center;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
    background: #888;
    color: #fff;
}
.req-download.downloading {
    background: #fff1f1;
    color: #ff5722;
}
.req-download.downloaded {
    background: green;
    color: #fff;
}
li[data-footage-url] {
    flex-basis: 23% !important;
    margin-right: 2% !important;
}
li[data-footage-url]:nth-child(4) {
    margin-top: 0 !important;
}
#countDisplay {
    max-width: 95%;
    width: 1370px;
    margin: 0 auto;
    font-size: 18px;
}
#countDisplay .total-items {
    font-size: 24px;
}
</style>
`;
    let downloadBtn = `<div class="req-download">下载该素材</div>`;
    let downloadingBtn = `<div class="req-download downloading">下载中...</div>`;
    let downloadedBtn = `<div class="req-download downloaded">已下载</div>`;
    let countDisplayHtml = `<div id="countDisplay"> 总计 <span class="total-items">0</span> 记录</div>`;

    var init_envato = () => {
        $('body').append(inject_css);
        // 移除左侧筛选器
        $(getElementByXpath("//*[@id=\"app\"]/div[1]/main/div/section/div/div[2]")).hide();
        $(getElementByXpath("//*[@id=\"app\"]/div[1]/nav/div/div/div[2]")).hide();
        $(getElementByXpath("//*[@id=\"app\"]/div[1]/main/div/section/div/div[1]")).hide();
        // $(getElementByXpath("//*[@id=\"app\"]/div[1]/nav/div/div/div[1]")).hide();
        // 移除footer
        $('footer').hide();

        $(getElementByXpath("//*[@id=\"app\"]/div[1]/nav/div/div/div[2]/div")).hide();


        $('[data-test-selector="header-search-box"]').next().next().remove();
        $('[data-test-selector="header-search-box"]').next().remove();
        $(countDisplayHtml).insertAfter('nav');
        $('[aria-label="Open navigation menu"]').remove();
        $('[aria-label="Envato Elements"]').parent().parent().remove();
        $('[aria-label="Open search"]').click();
        // $(inject_search_btn).insertAfter('.UnsupportedBrowserBanner_banner');

        $('body').css({opacity: 1});

        // 启动observer监听
        var observer = new MutationObserver((l, o) => {
            // 点词表格编辑input消失时判断词汇是否为空 为空则恢复默认值
            l.forEach(d => {
                try {
                    if (d.type == 'childList' && d.addedNodes.length && $(d.target).parent().parent().parent().is('main')) {
                        $('[data-test-selector="item-card"]').remove();
                        waitUtil('[data-test-selector="item-card"]', envatoReady);
                    }
                } catch (e) {
                }
            });
        });
        observer.observe($('#app main')[0], {attributes: true, childList: true, subtree: true});
        envatoReady();
        $('#app').on('click', '.req-download', reqDownload);
    };

// 页面加载完毕后要做的操作
    var envatoReady = () => {
        // 屏蔽所有a链接
        $('[data-test-selector="item-card"] a').each((i, item) => {
            if (item.hasAttribute('title')) {
                $(item).closest('li').attr('data-footage-url', $(item).attr('href'));
            }
        });
        // 修改标题padding
        $('[data-test-selector="item-card"]').each((i, item) => {
            $(item).find('a').remove();
            $(item).find('div').next().css({padding: '4px'});
            if ($(item).find('.req-download').length == 0) {
                $(item).append(downloadBtn);
            }
        });
        // 调整样式

        $(getElementByXpath("//*[@id=\"app\"]/div[1]/main/div/section/div")).css({display: 'block'});
        // 发送批量检查请求
        batchCheckFiles();
        parent.postMessage({msg: 'loaded'}, '*');

        // 读取查询总记录数量
        $('#countDisplay').hide();
        let body = $('header h1').html();
        let countPreg = /You found\s*<span [^>]+>([\d,]+)</gi;
        let pregRes = countPreg.exec(body);
        if (!!pregRes && pregRes.length > 1) {
            $('.total-items').html(pregRes[1]);
            $('#countDisplay').show();
        }
    };

// 素材加载完毕之后批量检查当前页素材文件状态(未开始下载、下载中、已下载)
    var batchCheckFiles = () => {
        let urls = [];
        $('li[data-footage-url]').each((i, item) => {
            urls.push('https://elements.envato.com' + $(item).attr('data-footage-url'));
        });
        $.ajax({
            type: "post",
            data: {footage_id: footage_id, urls: urls, a: 'checkEnvatoElements'},
            dataType: 'json',
            url: apihost + '/newtitan/footage/elements',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('x-token', token);
            },
            success: res => {
                res.data.forEach(item => {
                    try {
                        $(`li[data-footage-url="${item.url.replace('https://elements.envato.com', '')}"] .req-download`)[0].outerHTML = item.status == 'downloading' ? downloadingBtn : downloadedBtn;
                    } catch (e) {
                    }
                });
            }
        });
    };

    // 发送或取消下载请求/绑定
    var reqDownload = (e) => {
        let liele = $(e.target).closest('li');
        // 如果按钮已经包含downloading或downloaded类 则为取消绑定操作
        let is_bind = ($(e.target).hasClass('downloading') || $(e.target).hasClass('downloaded')) ? 0 : 1;
        let url = 'https://elements.envato.com' + liele.attr('data-footage-url');
        $.ajax({
            type: "post",
            data: {footage_id: footage_id, url: url, is_bind: is_bind, a: 'bindPlatformClipOrCancelBind'},
            dataType: 'json',
            url: apihost + '/newtitan/footage/elements',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('x-token', token);
            },
            success: res => {
                if (res.code == 0) {
                    if (is_bind) {
                        if (res.status == 'downloading') $(e.target)[0].outerHTML = downloadingBtn;
                        else $(e.target)[0].outerHTML = downloadedBtn;
                    } else {
                        // 取绑后 清空所有下载中已下载标记
                        $(e.target)[0].outerHTML = downloadBtn;
                        $(e.target).removeClass('downloading');
                        $(e.target).removeClass('downloaded');
                    }
                }
            }
        });

    };

})();

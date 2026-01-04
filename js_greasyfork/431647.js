// ==UserScript==
// @name         幻月字幕复制资源链接
// @namespace    http://tampermonkey.net/
// @version      0.8.4
// @description  幻月字幕官网复制资源链接
// @author       imzhi <yxz_blue@126.com>
// @match        https://www.huanyuezmz.site/*
// @match        https://www.huanyuezmz.xyz/*
// @match        https://huanyuexyz.wordpress.com/*
// @match        https://docs.qq.com/sheet/*
// @match        https://www.google.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @connect      mgnet.me
// @connect      docs.qq.com
// @run-at       document-end
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/clipboard.js/2.0.10/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/431647/%E5%B9%BB%E6%9C%88%E5%AD%97%E5%B9%95%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/431647/%E5%B9%BB%E6%9C%88%E5%AD%97%E5%B9%95%E5%A4%8D%E5%88%B6%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 恢复console
    // http://www.xushanxiang.com/disable-restore-console-log.html
    function setConsole() {
        var iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
        const console_v2 = iframe.contentWindow.console
        window.console_v2 = console_v2
    }

    function waitTime(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }

    await waitTime(3e3)
    alert(location.host)
    setConsole()
    if (location.host === 'docs.qq.com') {
        const title_this = document.querySelector('.index-module_fake-title__9DKHK')
        if (title_this && !title_this.innerHTML.contains('幻月字幕')) {
            alert(1)
            return;
        }
    }
    alert(2)

    function xmlget(url) {
        GM_xmlhttpRequest({
            url,
            onload: function(response) {
                console.log('zimuLink', response.finalUrl, response.response);
            }
        });
    }

    function getTitle() {
        const title_raw = $('h1.post-title').text().trim();
        // 通过正则去掉最后一个【】
        // 举例：
        // 【幻月字幕组】如果合您的耳朵的话【1080P】【27/8更新至EP07】
        // 调用正则后变成：
        // 【幻月字幕组】如果合您的耳朵的话【1080P】
        const title = title_raw.replace(/(^.+?【\d+?P】)(.+?)$/i, '$1')
        return title;
    }

    function getLinkAll() {
        return $('.post-content').find('a');
    }

    const arr_115 = ['115网盘下载(幻月字幕)：'];
    const arr_weiyun = ['微云网盘下载(幻月字幕)：'];
    const arr_magnet = ['磁力下载(幻月字幕)：'];
    let arr_ed2k = ['电驴下载(幻月字幕)：'];
    const arr_baidu = ['百度网盘下载(幻月字幕)：'];
    const arr_bt = ['BT种子下载(幻月字幕)：'];
    const arr_aliyun = ['阿里云网盘下载(幻月字幕)：'];
    const arr_kuake = ['夸克网盘下载(幻月字幕)：'];

    getLinkAll().each(async function(i, link) {
        const $link = $(link);
        const href = $link.prop('href');
        const text = $link.text().trim();
        if (!text) {
            return;
        }
        if (href.includes('115.com')) {
            arr_115.push(await pickUrl($link));
        } else if (href.includes('weiyun.com')) {
            arr_weiyun.push(await pickUrl($link));
        } else if (href.includes('aliyundrive.com')) {
            arr_aliyun.push(await pickUrl($link));
        } else if (href.includes('quark.cn')) {
            arr_kuake.push(await pickUrl($link));
        } else if (href.includes('mgnet.me') || href.includes('magnet:')) {
            const u = await pickUrl($link);
            // console.log('await pickUrl($link)', u);
            arr_magnet.push(u);
        } else if (href.includes('ed2k://')) {
            arr_ed2k.push(await pickUrl($link));
        } else if (href.includes('pan.baidu.com')) {
            if (text.includes('BT种子')) {
                arr_bt.push(await pickUrl($link));
            } else {
                arr_baidu.push(await pickUrl($link));
            }
        }
    });

    // 必须要延时执行，否则会返回含有[object Promise]的内容
    setTimeout(function() {
        // xmlget(location.href)
        xmlget('https://docs.qq.com/sheet/DZEZLWk56dHlzSGdi')
        arr_ed2k = textPickEd2k(arr_ed2k);

        let arr_magnet_done;
        arr_magnet_done = removeLink(arr_magnet);
        // console.log('arr_magnet_done', arr_magnet_done);
        // const arr_magnet_sort = sortLink(arr_magnet);

        const all_link = combineArr([arr_baidu, arr_ed2k, arr_magnet_done, arr_bt, arr_weiyun, arr_kuake, arr_aliyun, arr_115]);
        if (!all_link.length) {
            return;
        }
        const $button_copy_all = $('<button class="imzhi_wanwansub_copy_url" style="background-color: #d2216b; width: 100px; height: 50px; color: #fff; font-weight: bold;">复制所有地址</button>');
        $button_copy_all.attr('data-clipboard-text', all_link.join("\n"));
        $('.post-content').before($button_copy_all);
        new ClipboardJS('.imzhi_wanwansub_copy_url');
    }, 2e3);

    async function pickUrl($link) {
        let href = decodeURI($link.prop('href')).replace(/(?:访问|提取)码.+$/, '');
        let text = decodeURI($link.text().trim()).replace('ed2k://', '');
        const html = $link.closest('p').html();
        const ret = html.match(/(?:访问|提取)码\s*[:：]\s*(?<code>[a-z0-9]{4})/i);
        const code = ret ? ret.groups.code : '';
        const code_text = code ? `，提取码：${code}` : '';

        // 磁力链接获取上个邻近元素的文字作为集数！
        if (href.includes('mgnet.me') || href.includes('magnet:')) {
            const prev = $link[0].previousSibling;
            if (prev.nodeType === Node.TEXT_NODE) {
                text = prev.textContent.trim();
                text = text.replace(/[:：]/, '');
            }
        }

        if (href.includes('mgnet.me')) {
            href = await rawMagnet(href);
        }
        return new Promise((resolve) => {
            resolve(`<a href="${href}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${text}</a>${code_text}`);
        });
    }

    // 将几个数组合并，并从第二个数组开始增加空行（来自 FIX字幕侠复制链接）
    function combineArr(list_arr) {
        let result = [];
        list_arr.forEach(function(list_item) {
            const the_item = $.extend([], list_item);
            if (the_item.length <= 1) {
                return;
            }
            if (result.length) {
                the_item.unshift('')
            }
            result = result.concat(the_item);
        });
        return result;
    }

    function rawMagnet(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                url: url,
                onload: function(response) {
                    resolve(uriMagnet(response));
                }
            });
        });
    }

    function uriMagnet(response) {
        const headers = response.responseHeaders;
        const ret = headers.match(/magnet-uri:\s+(?<raw>.+)/);
        const raw = ret ? ret.groups.raw : '';
        return raw;
    }

    // 去重
    function removeLink(link_arr) {
        const link_first = link_arr.slice(0, 1);
        const arr_item = [];
        const arr_href = [];
        const link_last = link_arr.slice(1).filter(function(item) {
            const href = $(item).prop('href');
            const text = $(item).text();
            const arr_index = arr_href.indexOf(href);
            // console.log('arr222', arr_index, href, text);
            if (arr_index === -1) {
                arr_href.push(href);
                arr_item.push(item);
                return true;
            }
            // console.log('arr_href', href, text, arr_index, arr_href, arr_item);
            const the_item = arr_item[arr_index];
            const $the_item = $(the_item);
            $the_item.text(($the_item.text() + text));
            arr_item[arr_index] = $the_item.html();
            return false;
        });
        return link_first.concat(link_last);
    }

    function sortLink(link_arr) {
        const link_first = link_arr.slice(0, 1);
        const link_last = link_arr.slice(1, -1);
        const link_res = link_last.sort(function(linka, linkb) {
            const stra = $(linka).text().trim();
            const strb = $(linka).text().trim();
            const inta = +stra.match(/\d+/);
            const intb = +strb.match(/\d+/);
            if (!inta || !intb) {
                return 0;
            }
            return inta - intb;
        });
        return link_first.concat(link_res);
    }

    // 从text里匹配ed2k地址（2022-09幻月官网页面有所变动）
    function textPickEd2k(arr_ed2k) {
        console.log('arr_ed2k', arr_ed2k);
        if (arr_ed2k.length > 1) {
            return arr_ed2k;
        }

        const content = $('.post-content').text();
        // 多个子组匹配有问题
        const link_arr = content.matchAll(/(EP\d+|.+?(?:篇|话))[：:\s\S]+?(ed2k:\/\/.+?\|\/)/ig);
        const result_arr = [];
        for (let link_item of [...link_arr]) {
            const link_str = decodeURIComponent(link_item[2]);
            arr_ed2k.push(`<a href="${link_str}" rel="noopener noreferrer" target="_blank" style="word-break: break-all;">${link_item[1]}</a>`);
        }

        return arr_ed2k;
    }

    // GM_xmlhttpRequest({
    //     url: `http://mgnet.me/epUGepe`,
    //     onload: function(response) {
    //         const headers = response.responseHeaders;
    //         const ret = headers.match(/magnet-uri:\s+(?<raw>.+)/);
    //         const raw = ret ? ret.groups.raw : '';
    //     }
    // });
})();
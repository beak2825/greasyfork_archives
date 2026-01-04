// ==UserScript==
// @name         百度文库文档免费下载
// @namespace    https://greasyfork.org/zh-CN/users/269998-hu71e
// @version      1.0.3.1
// @description  下载百度文库免费文档和需要下载券（除付费文档外）的文档。
// @author       broom

// @include      *://wenku.baidu.com/view/*
// @include      *://api.ebuymed.cn/ext/*
// @include      *://www.ebuymed.cn/

// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle

// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js

// @run-at       document-end
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Edge
// @compatible	 Safari
// @compatible	 Opera
// @compatible	 UC
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/380485/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/380485/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var $ = $ || window.$;
    var window_url = window.location.href;
    var website_host = window.location.host;

    var analysis = {};
    analysis.judge = function () {
        if (website_host.indexOf("wenku.baidu.com") != -1) {
            return true;
        }
        return false;
    };
    analysis.addHtml = function () {
        if (analysis.judge()) {
            //左边图标
            var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>" +
                "<div id='crack_vip_document_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>下载</div>" +
                "<div id='crack_vip_search_wenku_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#DD5A57;'>搜索</div>" +
                "<div id='crack_vip_copy_box' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#FE8A23;'>复制</div>" +
                "</div>";
            $("body").append(topBox);
            var searchWord = "";
            if ("wenku.baidu.com" === website_host) {
                if ($("#doc-tittle-0").length != 0) {
                    searchWord = $("#doc-tittle-0").text();
                } else if ($("#doc-tittle-1").length != 0) {
                    searchWord = $("#doc-tittle-1").text();
                } else if ($("#doc-tittle-2").length != 0) {
                    searchWord = $("#doc-tittle-2").text();
                } else if ($("#doc-tittle-3").length != 0) {
                    searchWord = $("#doc-tittle-3").text();
                }
            }
            //为每一页添加复制按钮
            var onePageCopyContentHtml = '<div class="copy-one-page-text" style="float:left;padding:3px 10px;background:green;z-index:999;position:relative;top:60px;color:#fff;background-color:#FE8A23;font-size:14px;cursor:pointer;">获取此页面内容</div>';
            $('.mod.reader-page.complex, .ppt-page-item, .mod.reader-page-mod.complex').each(function () {
                $(this).prepend(onePageCopyContentHtml);
            });

            var defaultCrackVipUrl = "https://api.ebuymed.cn/ext/1/";
            $("body").on("click", "#crack_vip_document_box", function () {
                window.open(defaultCrackVipUrl, "_blank");
            });

            var defaultSearchWenkuUrl = "https://www.baidu.com/s?wd=@&currentPage=1";
            $("body").on("click", "#crack_vip_search_wenku_box", function () {
                defaultSearchWenkuUrl = defaultSearchWenkuUrl.replace(/@/g, encodeURIComponent(searchWord));
                window.open(defaultSearchWenkuUrl, "_blank");
            });

            $("body").on("click", "#crack_vip_copy_box", function () {
                analysis.copybaiduWenkuAll();
            });

            $("body").on("click", ".copy-one-page-text", function () {
                var $inner = $(this).parent(".mod").find(".inner")
                analysis.copybaiduWenkuOne($inner);
            });

            //暂存文档网址
            GM_setValue("document_url", window_url);
        }
    };

    analysis.showBaiduCopyTextBox = function (str) {
        var ua = navigator.userAgent;
        var opacity = '0.95';
        if (ua.indexOf("Edge") >= 0) {
            opacity = '0.6';
        } else {
            opacity = '0.95';
        }
        var copyTextBox = '<div id="copy-text-box" style="width:100%;height:100%;position: fixed;z-index: 9999;display: block;top: 0px;left: 0px;background:rgba(255,255,255,' + opacity + ');-webkit-backdrop-filter: blur(20px);display: flex;justify-content:center;align-items:center;">' +
            '<div id="copy-text-box-close" style="width:100%;height:100%;position:fixed;top:0px;left:0px;"></div>' +
            '<pre id="copy-text-content" style="width:60%;font-size:16px;line-height:22px;z-index:10000;white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;word-break:break-all;max-height:70%;overflow:auto;"></pre>' +
            '</div>"';
        $('#copy-text-box').remove();
        $('body').append(copyTextBox);
        $('#copy-text-content').text(str);
        $('#copy-text-box-close').click(function () {
            $('#copy-text-box').remove();
        });
    };

    analysis.showDialog = function (str) {
        var dialogHtml = '<div id="hint-dialog" style="margin:0px auto;opacity:0.8;padding:5px 10px;position:fixed;z-index: 10001;display: block;bottom:30px;left:44%;color:#fff;background-color:#CE480F;font-size:13px;border-radius:3px;">' + str + '</div>';
        $('#hint-dialog').remove();
        $('body').append(dialogHtml);
        var timeoutId = setTimeout(function () {
            $('#hint-dialog').remove();
        }, 1500);
    }

    analysis.copybaiduWenkuAll = function () {
        if (analysis.judge()) {
            var str = "";
            $(".inner").find('.reader-word-layer').each(function () {
                str += this.innerText.replace(/\u2002/g, ' ');
                console.log(str);
            });
            str = str.replace(/。\s/g, '。\r\n');
            if (!!str && str.length > 0) {
                analysis.showBaiduCopyTextBox(str);
            } else {
                analysis.showDialog("提取文档内容失败了");
            }
        }
    };

    analysis.copybaiduWenkuOne = function ($inner) {
        if (analysis.judge()) {
            var str = "";
            $inner.find('.reader-word-layer').each(function () {
                str += this.innerText.replace(/\u2002/g, ' ');
            });
            str = str.replace(/。\s/g, '。\r\n');
            if (!!str && str.length > 0) {
                analysis.showBaiduCopyTextBox(str);
            } else {
                analysis.showDialog("提取文档内容失败了");
            }
        }
    };

    analysis.download = function () {
        if ("api.ebuymed.cn" === website_host) {
            var sendUrl = GM_getValue("document_url");
            if (!!sendUrl) {
                GM_setValue("document_url", "");
                $("#downurl").val(sendUrl);
                $("#buttondown").click();
            }
        }
    };
    analysis.init = function () {
        analysis.addHtml();
        analysis.download();
    }

    analysis.init();

    //如果于文档相关，则执行至此
    if (website_host.indexOf("api.ebuymed.cn") != -1
        || website_host.indexOf("www.ebuymed.cn") != -1
        || website_host.indexOf("wenku.baidu.com") != -1) {
        return false;
    }

    init();
})();
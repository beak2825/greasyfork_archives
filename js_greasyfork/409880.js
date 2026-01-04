/* jshint esversion: 6 */
// ==UserScript==
// @name         remove_baijiahao
// @icon         https://bjhstatic.cdn.bcebos.com/favicon.ico
// @namespace    http://tampermonkey.net/
// @description  删除百度搜索中的百家号结果
// @version      1.15
// @match        *://www.baidu.com/*
// @author       Greyh4t
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @connect      www.baidu.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/409880/remove_baijiahao.user.js
// @updateURL https://update.greasyfork.org/scripts/409880/remove_baijiahao.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let blockList = ["baijiahao.baidu.com"];

    deal_content();
    bind_change();

    function bind_change() {
        let titleEl = document.getElementsByTagName("title")[0];
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
            let MutationObserverConfig = {
                childList: true,
                subtree: true,
                characterData: true
            };
            let observer = new MutationObserver(function (mutations) {
                deal_content();
            });
            observer.observe(titleEl, MutationObserverConfig);
        } else if (titleEl.addEventListener) {
            titleEl.addEventListener("DOMSubtreeModified", function (evt) {
                deal_content();
            }, false);
        }
    }

    function deal_content() {
        let content = $('#content_left');
        let containers = content.find('.c-container.new-pmd');

        for (let i = 0; i < containers.length; i++) {
            let container = containers[i];
            let tpl = container.getAttribute('tpl');
            let top;
            let divs;
            switch (tpl) {
                case "se_com_default":
                case "realtime_weak":
                case "rel-timeline":
                case "wenda_abstract_pc":
                case "news-normal":
                case "rel-head":
                case "news-realtime-weak":
                case "rel-common-head":
                    top = $(container);
                    divs = [container];
                    break;
                case "timeliness_news2":
                    top = $(container);
                    divs = top.children('div');
                    break;
                case "news-realtime":
                    top = $(container).children('div').children('div').children('div');
                    divs = top.children('div');
                    break;
                case "sp_realtime_bigpic5":
                    top = $(container).children('div');
                    divs = top.children('div');
                    break;
                case "short_video_pc":
                    top = $(container).children('div.op-short-video-pc').children('div');
                    divs = top.children('div');
                    break;
                case "short_video":
                    top = $(container).children('div').children('div').children('div').children('div.c-row');
                    divs = top.children('div');
                    break;
                case "bjh_addressing":
                    container.remove();
                    continue;
                default:
                    continue;
            }
            handle_divs(container, top, divs);
        }
    }

    // container 为要移除的最外层容器
    // top 用来判断top是否还有子元素，如果没有，则移除container
    // divs 本次要检查的div列表，应当是top的直接子元素或是container本身
    function handle_divs(container, top, divs) {
        for (let i = 0; i < divs.length; i++) {
            let div = divs[i];
            handle_div(container, top, div);
        }
    }

    function handle_div(container, top, div) {
        let as = $(div).find('a');
        for (let i = 0; i < as.length; i++) {
            let a = as[i];
            if (is_block(a.hostname)) {
                check_remove(container, top, div);
                return;
            }

            if (a.href.indexOf("www.baidu.com/link?url=") > -1) {
                handle_fake_url(container, top, div, a);
            }
        }
    }

    function is_block(hostname) {
        for (let i = 0; i < blockList.length; i++) {
            if (hostname.endsWith(blockList[i])) {
                return true;
            }
        }
        return false;
    }

    function handle_fake_url(container, top, div, a) {
        let tmpURL = a.href.indexOf("eqid") < 0 ? a.href + "&wd=&eqid=" : a.href;
        GM.xmlHttpRequest({
            method: "GET",
            url: tmpURL,
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
                "Host": "www.baidu.com",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive"
            },
            onload: function (response) {
                let reg = /URL=['|"]([^'|"]+)/;

                if (reg.test(response.responseText)) {
                    let realURL = response.responseText.match(reg)[1];
                    let o = new URL(realURL);

                    if (is_block(o.hostname)) {
                        check_remove(container, top, div);
                    } else {
                        // 还原真实地址
                        $(container).find('a[href="' + a.href + '"]').attr('href', realURL);
                    }
                }
            }
        });
    }

    function check_remove(container, top, div) {
        div.remove();
        if (top.children('div').length == 0) {
            container.remove();
        }
    }
})()
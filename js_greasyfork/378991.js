// ==UserScript==
// @name         Searcher Beautify
// @namespace    bear@fish.cat
// @version      0.1
// @description  谷歌百度搜索结果页优化
// @author       Gallen
// @include      *://*.google*/search*
// @include      *://www.baidu.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/378991/Searcher%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/378991/Searcher%20Beautify.meta.js
// ==/UserScript==

(function() {
    var url = window.location.origin;
    var TITLE_SELECTOR = {
        google: '',
        baidu: 'h3.t>a, #results .c-container>.c-blocka'
    };

    function GM_addStyle (cssStr) {
        var D               = document;
        var newNode         = D.createElement ('style');
        newNode.textContent = cssStr;

        var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
        targ.appendChild (newNode);
    }

    function getRealLinkByResponseText(responseText) {
        if (!responseText) return '';
        return /URL='([^']+)'/.exec(responseText)[1];
    }

    // GOOGLE
    function googleBeautify() {
        GM_addStyle(`
            .mw { margin: 0 auto; }
            .g:not(#imagebox_bigimages):not(.mod) {
                border: 1px solid #ddd;
                padding: 0;
                width: 644px;
                margin: 0 auto 30px;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                border-radius: 2px;
            }
            #res .r {
                background: rgba(238,238,238,.5);
                padding: 10px 20px;
            }
            #res .s {
                padding: 0 20px;
            }
            #res a {
                color: #3b73af;
            }
            #res a:visited {
                color: #609;
            }
            #res a>h3 {
                font-weight: 700;
            }
        `);
    }

    // BAIDU
    function baiduBeautify() {
        console.info('clean baidu init');

        GM_addStyle(`
            #content_left .result {
                border: 1px solid #ddd;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
                border-radius: 2px;
                padding: 0 10px 10px;
            }
            .c-container .t:not(.c-gap-bottom-small) {
                background: rgba(238,238,238,.5);
                margin: 0 -10px;
                padding: 4px 10px;
                font-weight: 700;
            }
        `);

        // 关闭重定向
        var titles = document.querySelectorAll(TITLE_SELECTOR.baidu);
        [...titles].forEach(($title) => {
            if ($title.getAttribute('data-no-redirect') == '1') return; // 已处理

            var curHref = $title.href;
            if (curHref.includes('www.baidu.com/link')) {
                if (!curHref.includes('eqid')) curHref += '&wd=&eqid=';

                curHref = curHref.replace(/^http:/, "https:");

                GM_xmlhttpRequest({
                    extData: curHref,
                    url: curHref,
                    headers: {"Accept": "*/*", "Referer": curHref},
                    method: "GET",
                    timeout: 5000,
                    onreadystatechange: function (response) {
                        if (response.readyState == 4) {
                            if (response.responseText) {
                                var realLink = getRealLinkByResponseText(response.responseText);
                                if (realLink) {
                                    $title.setAttribute('href', realLink);
                                    $title.setAttribute('data-no-redirect', '1');
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    (function () {
        if (url.includes('google')) {
            googleBeautify()
        }

        if (url.includes('baidu')) {
            baiduBeautify()

            function check(e) {
                if (typeof e.target.getAttribute === 'function') {
                    var domID = e.target.getAttribute('id');
                    if (domID === 'container') {
                        baiduBeautify();
                    }
                }
            }

            document.addEventListener('DOMNodeInserted', check, false);
            document.addEventListener('keyup', check, false);
        }

    })();

})();
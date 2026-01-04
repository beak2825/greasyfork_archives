// ==UserScript==
// @name         Markdown Fetcher
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  fetch raw markdown contents of some OJs
// @author       You
// @match        https://www.luogu.com/*
// @match        https://www.luogu.com.cn/*
// @match        https://oier.team/*
// @match        https://mna.wang/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503416/Markdown%20Fetcher.user.js
// @updateURL https://update.greasyfork.org/scripts/503416/Markdown%20Fetcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var href, title;

    setInterval (() => {
        if (href && href == location.href) return;
        href = location.href;

        // luogu.com.cn
        if (/luogu/.test (href)) {
            if (/discuss/.test (href)) {
                console.log (_feInstance.currentData.post.content);
                return;
            }
            if (/\/article\//.test (href) && !/mine/.test (href)) {
                console.log (JSON.parse(document.getElementById('lentille-context').innerText).data.article.content);
                return;
            }
        }

        // oier.team
        if (/oier\.team/.test (href)) {
            if (/problems/.test (href)) {
                var interval = setInterval (() => {
                    if (document.querySelector (".prose.min-w-0")) {
                        var str = "";
                        for (var e of document.querySelector (".prose.min-w-0").childNodes) {
                            if (e.tagName == 'H3') {
                                if (str) console.log (str);
                                str = e.innerText + "：\n";
                            }
                            if (e.tagName == 'P') {
                                if (!str) return;
                                var s = e.innerHTML;
                                s = s.replace (/<semantics>[^]*<\/semantics>/, "");
                                s = s.replace (/<span class="mord mathnormal">[^<]*<\/span>/g, "");
                                s = s.replace (/<[^>]*>/g, "");
                                str += s + "\n";
                            }
                        }
                        clearInterval (interval);
                    }
                }, 10);
                return;
            }
        }

        // mna.wang
        if (/mna\.wang/.test (href)) {
            if (/problem/.test (href)) {
                var cnt = 0;
                title = ["题面描述", "输入格式", "输出格式", "样例", "数据范围与提示"];
                document.querySelectorAll ('.ui.bottom.attached.segment.font-content').forEach (e => {
                    console.log (title[cnt++] + "：\n" + e.innerHTML.replace (/<[^>]*>/g, ""));
                });
                return;
            }
        }
    }, 1000);

})();
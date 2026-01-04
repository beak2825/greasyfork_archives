// ==UserScript==
// @name         leetcode 增加英文讨论区按钮
// @namespace    ljybill
// @version      1.0.4
// @description  学算法要博众家之长,增加跳转到英文评论区按钮并阻止英文区自动跳转到国内站点 - 基于 @Aloxaf 大佬作品修改
// @author       ljybill
// @match        https://leetcode-cn.com/problems/*
// @match        https://leetcode.com/*
// @grant window.onurlchange
// @grant        GM_webRequest
// @downloadURL https://update.greasyfork.org/scripts/419812/leetcode%20%E5%A2%9E%E5%8A%A0%E8%8B%B1%E6%96%87%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/419812/leetcode%20%E5%A2%9E%E5%8A%A0%E8%8B%B1%E6%96%87%E8%AE%A8%E8%AE%BA%E5%8C%BA%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    'use strict';

    preventAutoJump2cn();

    /**
     * @link https://stackoverflow.com/questions/22125865/wait-until-flag-true
     */
    function waitFor(condition, callback) {
        if (!condition()) {
            window.setTimeout(waitFor.bind(null, condition, callback), 500); /* this checks the flag every 100 milliseconds*/
        } else {
            callback();
        }
    }

    function add_button() {
        // single
        if (document.querySelector('#btn__jump2eng')) {
            return
        }

        function htmlToElement(html) {
            let template = document.createElement('template');
            html = html.trim(); // Never return a text node of whitespace as the result
            template.innerHTML = html;
            return template.content.firstChild;
        }

        const problem_name = location.href.match(/problems\/([^\/]+)/)[1];
        const button = `<button id="btn__jump2eng" onclick="window.open('https://leetcode.com/problems/${problem_name}/discuss/?currentPage=1&orderBy=most_votes&query=','_blank')">
<svg viewBox="0 0 24 24" width="1em" height="1em">
<path fill-rule="evenodd" d="M8.995 22a.955.955 0 0 1-.704-.282.955.955 0 0 1-.282-.704V18.01H3.972c-.564 0-1.033-.195-1.409-.586A1.99 1.99 0 0 1 2 15.99V3.97c0-.563.188-1.032.563-1.408C2.94 2.188 3.408 2 3.972 2h16.056c.564 0 1.033.188 1.409.563.375.376.563.845.563 1.409V15.99a1.99 1.99 0 0 1-.563 1.432c-.376.39-.845.586-1.409.586h-6.103l-3.709 3.71c-.22.187-.454.281-.704.281h-.517zm.986-6.01v3.1l3.099-3.1h6.948V3.973H3.972V15.99h6.01zm-3.99-9.013h12.018v2.018H5.991V6.977zm0 4.037h9.014v1.972H5.99v-1.972z"></path>
</svg>
<span>英文版讨论区</span>
</button>`;
        document.querySelector('h4[class*="-Title"]').append(htmlToElement(button));
    }

    function isCNSite() {
        return location.hostname === 'leetcode-cn.com'
    }

    if (isCNSite()) {
        waitFor(() => {
            let node = document.querySelector('div[class*="-Tools"]');
            return (node && node.childElementCount > 0);
        }, add_button);
        // watch url change
        if (window.onurlchange === null) {
            // feature is supported
            window.addEventListener('urlchange', function (evt) {
                if (evt.url) {
                    waitFor(() => {
                        let node = document.querySelector('div[class*="-Tools"]');
                        return (node && node.childElementCount > 0);
                    }, add_button);
                }
            });
        }
    }

    function preventAutoJump2cn() {
        GM_webRequest([
            {selector: 'https://assets.leetcode-cn.com/lccn-resources/cn.js', action: 'cancel'},
        ], function (info, message, details) {
            console.log(info, message, details);
        });
    }
})();

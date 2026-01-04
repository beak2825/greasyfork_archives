// ==UserScript==
// @name         LeetCode OneInput
// @namespace    https://leetcode-cn.com/
// @version      1.1
// @description  一键复制所有样例输入
// @author       Mcginn
// @match        https://leetcode-cn.com/problems/*
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     notycss https://cdn.jsdelivr.net/npm/noty@3.1.4/lib/noty.min.css
// @require      https://cdn.jsdelivr.net/npm/noty@3.1.4/lib/noty.min.js
// @require      https://cdn.jsdelivr.net/npm/jquery@v3.4.1/dist/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/420201/LeetCode%20OneInput.user.js
// @updateURL https://update.greasyfork.org/scripts/420201/LeetCode%20OneInput.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(GM_getResourceText('notycss'));

    function isDidit(character) {
        return '0' <= character && character <= '9';
    }

    function parseInput(problemDescription) {
        var idx = 0, inputs = new Array();
        while (idx < problemDescription.length) {
            if ('[' == problemDescription[idx]) {
                var cnt = 0, indexStart = idx;
                while (idx < problemDescription.length) {
                    switch (problemDescription[idx++]) {
                        case '[':
                            ++cnt;
                            break;
                        case ']':
                            --cnt;
                            break;
                        default:
                            break;
                    }
                    if (0 == cnt)
                        break;
                }
                inputs.push(problemDescription.substring(indexStart, idx));
            } else if ('\"' == problemDescription[idx]) {
                var indexStart = idx++;
                while (idx < problemDescription.length && problemDescription[idx] != '\"') {
                    ++idx;
                }
                inputs.push(problemDescription.substring(indexStart, ++idx));
            } else if ('0' <= problemDescription[idx] && problemDescription[idx] <= '9') {
                var indexStart = idx;
                while (idx < problemDescription.length && isDidit(problemDescription[idx])) {
                    ++idx;
                }
                var indexEnd = idx;
                var strInput = problemDescription.substring(indexStart, indexEnd);
                inputs.push(strInput);
            } else {
                ++idx;
            }
        }
        return inputs
    }


    function parseExampleInput(problemDescription) {
        var arrayInput = new Array();
        var regexpInput = /输入[：:]((.|\n)+?)输出/g
        var ret;
        while (ret = regexpInput.exec(problemDescription)) {
            var inputs = ret[1];
            console.log('inputs = ' + inputs);
            arrayInput = arrayInput.concat(parseInput(inputs));
        }
        var strInput = arrayInput.join('\n');
        return strInput;
    }

    function copyAllTestCases() {
        new Noty({
            type: 'info',
            layout: 'topRight',
            text: 'Trying to find and copy all testcases',
            timeout: 2000
        }).show();

        var selector = 'div.description__2b0C';
        if ($(selector) && $(selector).text().length > 0) {
            var exampleInputStr = parseExampleInput($(selector).text());
            GM_setClipboard(exampleInputStr);
            new Noty({
                type: "success",
                layout: "topRight",
                text: "Have copy all testcases: \n" + exampleInputStr,
                timeout: 5000
            }).show();
            return true;
        } else {
            return false;
        }
    }

    var checkExist = setInterval(
        function() {
            if (copyAllTestCases()) {
                clearInterval(checkExist);
            }
        }, 2000);

    GM_registerMenuCommand("一键复制", copyAllTestCases);
})();
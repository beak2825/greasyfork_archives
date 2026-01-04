// ==UserScript==
// @license       MIT
// @name         自动完成 Weekly Quiz
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成 Rewards Weekly Quiz
// @author       Xiong,Cheng-Qing
// @match        https://www.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463973/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20Weekly%20Quiz.user.js
// @updateURL https://update.greasyfork.org/scripts/463973/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20Weekly%20Quiz.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wkCanvas = document.querySelector('#wkCanvas');
    const options = document.querySelectorAll('.wk_OptionClickClass');
    const submit = document.querySelector('input[name="submit"]');

    if (wkCanvas) {
        if (options.length >= 3) {
            for(const option of options) {
                option.click();
            }
        }

        if (submit) {
            submit.click();
        }
    }

})();
// ==UserScript==
// @name         Steam 两步验证关闭输入法
// @namespace    https://greasyfork.org/users/101223
// @version      0.1
// @description  在Steam两步验证时尝试关闭输入法
// @author       Splash
// @match        https://store.steampowered.com/login*
// @match        https://steamcommunity.com/login*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      GPLv3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/465937/Steam%20%E4%B8%A4%E6%AD%A5%E9%AA%8C%E8%AF%81%E5%85%B3%E9%97%AD%E8%BE%93%E5%85%A5%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/465937/Steam%20%E4%B8%A4%E6%AD%A5%E9%AA%8C%E8%AF%81%E5%85%B3%E9%97%AD%E8%BE%93%E5%85%A5%E6%B3%95.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let observer = new MutationObserver(function (mutations) {
        let inputDiv;
        for (let i = 0; i < mutations.length; i++) {
            for (let j = 0; j < mutations[i].addedNodes.length; j++) {
                if (mutations[i].addedNodes[j].querySelector && (inputDiv = mutations[i].addedNodes[j].querySelector('[class^="newlogindialog_SegmentedCharacterInput_"]'))) {
                    let inputEls = inputDiv.querySelectorAll('input');
                    for (let m = 0; m < inputEls.length; m++) {
                        ((index, count) => {
                            inputEls[index].setAttribute('type', 'password');
                            inputEls[index].onfocus = function () {
                                for (let n = 0; n < count; n++) {
                                    inputEls[n].setAttribute('type', (index == n || inputEls[n].value == '') ? 'password' : 'text');
                                }
                            };
                            inputEls[index].onblur = function () {
                                this.setAttribute('type', this.value == '' ? 'password' : 'text');
                            }
                        })(m, inputEls.length);
                    }
                    break;
                }
            }
        }
    });
    observer.observe(document.querySelector('div.page_content'), {
        childList: true,
        subtree: true
    });
})();
// ==UserScript==
// @name         Better GitHub
// @namespace    https://greasyfork.org/zh-CN/scripts/515684
// @version      0.2.1
// @description  去除“更新付款方式”错误；在 PR 界面添加快进式合并按钮。
// @author       ketikai
// @license      MIT
// @match        https://github.com/*
// @icon         https://github.com/fluidicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/515684/Better%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/515684/Better%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // <section aria-label="Error" class="flash flash-full js-notice flash-error">...</section>
    function RemoveUpdateYourPaymentMethodError() {
        let sections = document.getElementsByTagName('section');
        if (!sections) {
            return;
        }
        for (let i = 0; i < sections.length; i++) {
            let section = sections[i];
            if (!section) {
                continue;
            }
            if (section.ariaLabel != 'Error') {
                continue;
            }
            if (section.className != 'flash flash-full js-notice flash-error') {
                continue;
            }
            let text = section.innerText;
            if (!text || !text.startsWith("We are having a problem billing your account. Please update your payment method or call your payment provider for details on why the transaction failed.")) {
                continue;
            }
            section.remove();
            console.log('Removed Error: UpdateYourPaymentMethod.');
            break;
        }
    }

    function insertFastForwardButton() {
        let state = document.getElementsByClassName('State State--open');
        if (state.length < 1) {
            return;
        }
        if (state[0].getAttribute('reviewable_state') !== 'ready') {
            return;
        }
        let commentDiv = document.getElementsByClassName('color-bg-subtle ml-1')[0];
        if (commentDiv.textContent.trim() === 'Comment') {
            let parent = commentDiv.parentElement;
            let fastForwardDiv = commentDiv.cloneNode(true);
            let fastForwardButton = fastForwardDiv.getElementsByTagName('button')[0];
            fastForwardButton.textContent = 'Fast forward';
            fastForwardButton.getAttributeNames().forEach(function(name) {
                if (name !== 'class') {
                    fastForwardButton.removeAttribute(name);
                }
            });
            fastForwardButton.setAttribute('type', 'button');
            let textArea = document.getElementById('new_comment_field');
            let commentButton = commentDiv.getElementsByTagName('button')[0];
            fastForwardButton.onclick = function(event) {
                if (event.button == 0) {
                    if (textArea.textContent === '/fast-forward') {
                        commentButton.disabled = false;
                        commentButton.click();
                        commentButton.disabled = true;
                        textArea.textContent = '';
                    } else {
                        textArea.textContent = '/fast-forward';
                        commentButton.disabled = true;
                    }
                }
            };
            parent.insertBefore(fastForwardDiv, commentDiv);
        }
    }

    insertFastForwardButton();
    RemoveUpdateYourPaymentMethodError();
    document.addEventListener("DOMContentLoaded", function(event) {
        insertFastForwardButton();
        RemoveUpdateYourPaymentMethodError();
    });
})();
// ==UserScript==
// @name         CodeMatirx MR Title Input Validation
// @license MIT
// @namespace    https://git.woa.com/
// @version      1.0
// @description  Validate CodeMatirx MR input field content with regex pattern ^(fix|feat|docs|doc|refactor|test|style|ci|chore|revert)(\(.*\))?!?: .+
// @author       kerwinpeng
// @match        https://git.woa.com/CodeMatrix/CodeMatrix/merge_requests/new?*
// @match        http://git.woa.com/CodeMatrix/CodeMatrix/merge_requests/new?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475283/CodeMatirx%20MR%20Title%20Input%20Validation.user.js
// @updateURL https://update.greasyfork.org/scripts/475283/CodeMatirx%20MR%20Title%20Input%20Validation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
        const pattern = /^(fix|feat|docs|doc|refactor|test|style|ci|chore|revert)(\(.*\))?!?: .+/;
        const inputField = document.querySelector('.tg-input__input');
        if(!pattern.test(inputField.value)) {
           inputField.value='feat(qta): '+inputField.value
        }

        inputField.addEventListener('input', (event) => {
            const inputValue = event.target.value.trim();
            //console.log(inputValue)
            const isValid = pattern.test(inputValue);
            if (!isValid) {
                inputField.setCustomValidity('MR标题不符合正则  pattern:'+pattern);
                inputField.reportValidity();
                inputField.value='feat(qta): '+inputField.value
            } else {
                inputField.setCustomValidity('符合标准');
            }
        });
   }, 3000);
})();
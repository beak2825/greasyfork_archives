// ==UserScript==
// @name         Redcap每週問卷自動填寫
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  按F2後，全部填「滿意」+下一頁
// @author       Steven Lu
// @match        https://redcap.mc.ntu.edu.tw/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476884/Redcap%E6%AF%8F%E9%80%B1%E5%95%8F%E5%8D%B7%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/476884/Redcap%E6%AF%8F%E9%80%B1%E5%95%8F%E5%8D%B7%E8%87%AA%E5%8B%95%E5%A1%AB%E5%AF%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add event listener for keypress(等到按下F2)
    document.addEventListener('keydown', function(event) {
        // Replace 'F2' with the key you want to use
        if (event.key === 'F2') {
            // Click all input tags with value="3"(滿意)
            let inputs = document.querySelectorAll('input[value="3"]');
            inputs.forEach(input => input.click());
            // Click the button with name="submit-btn-saverecord"(送出/下一頁)
            let button = document.querySelector('button[name="submit-btn-saverecord"]');
            if (button) {
                button.click();
            }
        }
    });
})();

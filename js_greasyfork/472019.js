
// ==UserScript==
// @name         Hotpot.ai Unlimited1
// @namespace    https://leaked.wiki
// @version      1.1
// @description  Removes the local cooldowns for Hotpot.ai allowing you to generate multiple images at once! + max
// @author       wolftdb
// @match        *://hotpot.ai/art-generator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472019/Hotpotai%20Unlimited1.user.js
// @updateURL https://update.greasyfork.org/scripts/472019/Hotpotai%20Unlimited1.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var css = ".disabled { pointer-events: all; opacity: 1; }";
    var js = "localStorage.setItem('ai.hotpot.helpers.requestCounter.8', '{\"lastRequestTime\":\"2023-03-12T03:24:37.586Z\",\"numRequests\":-69420}');";

    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);

    setInterval(function() {
        const MaxPromptLength = 1000;
        const ControlBox = document.querySelector('#controlBox');
        let textarea = ControlBox.querySelector('textarea[tabindex="1"]');

        if(textarea) {
            textarea.maxLength = MaxPromptLength;

            let characterCounterBox = ControlBox.querySelector('.characterCounterBox');

            if(characterCounterBox) {
                characterCounterBox.innerText = MaxPromptLength;
                characterCounterBox.title = MaxPromptLength + ' Characters left';
            }
        }

        window.setCharsLeftLabel = function() {
            const textarea =  ControlBox.querySelector('.seedTextBox textarea');
            let text = textarea.value;
            let charsLeft = MaxPromptLength - text.length;
            ControlBox.querySelector('.characterCounterBox').textContent = charsLeft >= 0 ? charsLeft : '0';
            ControlBox.querySelector('.characterCounterBox').classList.toggle('error', charsLeft < 0);
        }

        window.validateForm = function(user) {
            let errorText = null;
            return errorText;
        }
    }, 1000);
})();
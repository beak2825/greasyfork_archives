// ==UserScript==
// @name         stackoverflow make markdown link for question and answers automatically
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description    stackoverflow make markdown link for question and answers automatically :)
// @author        批小将
// @match         https://*.stackexchange.com/*
// @match         https://stackoverflow.com/*
// @match         https://serverfault.com/*
// @grant         none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/393591/stackoverflow%20make%20markdown%20link%20for%20question%20and%20answers%20automatically.user.js
// @updateURL https://update.greasyfork.org/scripts/393591/stackoverflow%20make%20markdown%20link%20for%20question%20and%20answers%20automatically.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function makeShareMDLink(){
        let shareBtnTemplate = `<button class="js-copy-link-btn s-btn s-btn__link">Copy MD link</button>`;
        let shareTags = document.querySelectorAll('div.my8');
        for(let i = 0; i < shareTags.length; i++){
            let shareTag = shareTags[i];
            let shareLink = shareTag.firstChild.value;
            let shareBtn = shareTag.nextSibling.firstChild;
            shareBtn.insertAdjacentHTML('afterend', shareBtnTemplate);
            shareBtn.nextSibling.addEventListener('click', function(){
                //Define the MD link as you like, here it's `[answer](https://stackoverflow.com/answerlink)`
                let shareText = "answer";
                let shareMDText = '[' + shareText + '](' + shareLink + ')';
                navigator.clipboard.writeText(shareMDText);
            })

        }
    }

    function makeQuestionMDlink(){
        let btnTemplate = `<button class="ws-nowrap s-btn s-btn__primary" id="makeMDbtn" style="margin-top: 5px;">make MD link</button>`;
        let askQuestionTag = document.querySelector('div.aside-cta');
        askQuestionTag.insertAdjacentHTML('beforeend', btnTemplate);
        let btn = document.getElementById('makeMDbtn');

        let shareBtnTemplate = '<button class="js-copy-link-btn s-btn s-btn__link">Copy MD link</button>';

        btn.addEventListener('click', function(){
            let qTag = document.querySelector('#question-header .question-hyperlink');
            let link = qTag.href;
            let text = qTag.innerText;

            let markdownText = '[' + text + '](' + link + ')';
            navigator.clipboard.writeText(markdownText);
        });
    }

   let timeout = 1000;

    makeQuestionMDlink();
    setTimeout(function(){
        makeShareMDLink();
    }, timeout);

})();
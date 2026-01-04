// ==UserScript==
// @name         Imgur taobao link fixer
// @namespace    english
// @version      0.41
// @description  converts "https://item . taobao . com/" to "https://item.taobao.com/"
// @author       eight
// @include      http*://*imgur.com/*
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383132/Imgur%20taobao%20link%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/383132/Imgur%20taobao%20link%20fixer.meta.js
// ==/UserScript==

var fixLinks = function (when) {
    if (event.srcElement.classList) {
        var newContainerClassList = event.srcElement.classList[0];
    }

    if (when === 'DOMContentLoaded' || newContainerClassList === 'post-image-container') {
        var postImageDescriptions = document.querySelectorAll('.post-image-description');
        Array.prototype.forEach.call(postImageDescriptions, function(el, i){
            var descriptionText = el.innerText;
            descriptionText = descriptionText.split('\n')[0];
            var taobaoText = 'taobao';

            if (descriptionText.indexOf(taobaoText) !== -1) {
                descriptionText = descriptionText.replace(/\s+/g, '').substring(descriptionText.lastIndexOf("://") + 1);
                el.outerHTML = '<a target="_blank" href="https:/' + descriptionText + '">https:/' + descriptionText + '</a>';
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', function(event) {
    fixLinks('DOMContentLoaded');
});

document.addEventListener('DOMNodeInserted', function(event) {
    fixLinks('DOMNodeInserted');
});
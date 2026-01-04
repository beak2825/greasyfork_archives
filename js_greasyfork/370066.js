// ==UserScript==
// @name         Instagram unprotect
// @namespace    http://lbreda.com/
// @version      2.6
// @description  Unprotects Instagram images in the single-image pages
// @author       Lorenzo Breda
// @license      MIT
// @match        https://*.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370066/Instagram%20unprotect.user.js
// @updateURL https://update.greasyfork.org/scripts/370066/Instagram%20unprotect.meta.js
// ==/UserScript==

function unprotectImage(root) {
    let waitForImage = setInterval(() => {
        if([...root.querySelectorAll('._aagv img')].length) {
            [...root.querySelectorAll('._aagv img')].forEach((image) => {
                (new MutationObserver(removeSrcset)).observe(image, { attributes: true, childList: false, subtree: false });
                let imgContainer = image?.parentNode.parentNode;
                if(imgContainer?.getElementsByTagName('div')[1]) imgContainer?.removeChild(imgContainer?.getElementsByTagName('div')[1]);
            });
            clearInterval(waitForImage);
        }
    }, 20);
}

function unprotectImageOnEachArticle(mutationList, observer) {
    mutationList.forEach((mutation) => {
        if(mutation.type == 'childList') {
            mutation.addedNodes.forEach((node) => {
                if(node.tagName.toLowerCase() == 'article') {
                    unprotectImage(node);
                }
            });
        }
    });
}

function unprotectImageOnEachLi(mutationList, observer) {
    mutationList.forEach((mutation) => {
        if(mutation.type == 'childList') {
            mutation.addedNodes.forEach((node) => {
                if(node.tagName.toLowerCase() == 'li') {
                    unprotectImage(node);
                }
            });
        }
    });
}

function removeSrcset(mutationList, observer) {
    mutationList.forEach((mutation) => {
        if(mutation.type == 'attributes' && mutation.attributeName == 'srcset' && mutation.target.srcset) {
            mutation.target.removeAttribute('srcset');
        }
    });
}

function observeNewArticles() {
    (new MutationObserver(unprotectImageOnEachArticle)).observe(document.querySelector('body'), { attributes: false, childList: true, subtree: true });
}

function observeNewLi() {
    let waitForImage = setInterval(() => {
        if(document.querySelectorAll('._aagv img').length){
            clearInterval(waitForImage)
            let ul = [...document.querySelectorAll('._aagv img')].reduce((acc, curr) => curr.closest('ul'));
            if (ul) {
                (new MutationObserver(unprotectImageOnEachLi).observe(ul, { attributes: false, childList: true, subtree: true }));
            }
        }
    }, 20);
}

(function() {
    'use strict';

    let currentURL = location.href;
    let firstCycle = true;

    let mainCycle = setInterval(() => {
        if(currentURL != location.href || firstCycle) {
            currentURL = location.href;
            firstCycle = false;
            if(currentURL.startsWith("https://www.instagram.com/p/")) {
               unprotectImage(document);
               observeNewLi();
            } else if (currentURL == "https://www.instagram.com/") {
                unprotectImage(document.getElementsByTagName('body')[0]);
                observeNewArticles();
            }
        }
    }, 20)
})();
// ==UserScript==
// @name        SPAM
// @version     3.7
// @description So Pictures A Many! ... Shh, it's a perfect acronym. This script will hide a comment when it contains more than 3 images / embeds, with the option to show it anyway. With 6 images or more, it gets deleted.
// @author      Valognir (https://www.deviantart.com/valognir)
// @namespace   https://greasyfork.org/en/scripts/417286-spam
// @run-at      document-start
// @match       *://*.deviantart.com/*
// @exclude     *://*.deviantart.com/*realEstateId*
// @downloadURL https://update.greasyfork.org/scripts/417286/SPAM.user.js
// @updateURL https://update.greasyfork.org/scripts/417286/SPAM.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // looking to change the numbers or somethin? here you go.
    // number of images / embeds within a comment before its content...

    // ...gets hidden, with the option to show it anyway.
    let hides = 3;

    // ...gets deleted.
    let yeets = 10;

    // that's all, better don't touch the stuff below.

    let css = `
.yeeted {
    display: flex;
    flex-wrap: wrap;
}
.heya, .toggle {
    text-align: center;
    opacity: .6;
    font-size: 12px;
}

.heya {
    font-family: "Comic Sans MS";
    flex-grow: 1;
    padding: 8px;
}

.toggle {
    width: 45px;
    color: var(--g-typography-primary);
    border: 2px solid currentColor;
    background: none;
    font-weight: bold;
}

.toggle:hover {
    color: var(--green4);
}

.toggle + div {
    height: 0;
    width: 100%;
}

.heya i {
    font-style: italic;
}
`;


    function waitForBody() {
        if (document.body) {
            const styleNode = document.createElement('style');
            const headElement = document.head;
            console.log("[SPAM]", headElement);
            styleNode.appendChild(document.createTextNode(css));
            headElement.appendChild(styleNode);

            const observer = new MutationObserver(function(mutations) {
                const comments = document.querySelectorAll('div[data-commentid] .ds-surface-secondary>div:last-child:not(.yeeted)');
                comments.forEach(function (element){
                    console.log(element);
                    const imgs = element.querySelectorAll('div[data-editor-viewer] img[srcset]');
                    if (imgs.length >= yeets) {
                        element.classList.add('yeeted');
                        element.innerHTML = '<span class="heya">spam identified.<br>yeet!</span>';
                    } else if (imgs.length >= hides) {
                        element.classList.add('yeeted');
                        element.insertAdjacentHTML('afterbegin', '<span class="heya more">can\'t <i>picture</i> what\'s in here. wanna check?</span><button class="toggle">Yes</button>');
                    }
                });

                const toggleButtons = document.querySelectorAll('.heya+.toggle');

                if (toggleButtons.length > 0) {
                    toggleButtons.forEach(function(element) {
                        if (!element.classList.contains('click')) {
                            element.classList.add('click');
                            element.addEventListener('click', function () {
                                if (element.nextElementSibling.style.height !== 'auto') {
                                    element.nextElementSibling.style.height = 'auto';
                                    element.previousElementSibling.innerHTML = 'huh, so that\'s what\'s in here. wanna hide it again?';
                                } else {
                                    element.nextElementSibling.style.height = '0px';
                                    element.previousElementSibling.innerHTML = 'can\'t <i>picture</i> what\'s in here. wanna check?';
                                }
                            });
                        }
                    });
                }
            });
            observer.observe(document, { childList: true, subtree: true });
            console.log("[SPAM] Loading screen added.");
        } else {
            setTimeout(waitForBody, 100);
            console.log("[SPAM] Body not found. Retrying.");
        }
    }
    waitForBody();
})();
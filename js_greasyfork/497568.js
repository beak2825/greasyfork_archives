// ==UserScript==
// @name         Rule34 AI Detector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlight AI generated images and add a toggle button to show/hide AI images
// @author       Librake
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @icon         https://goo.su/Hiqi7
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497568/Rule34%20AI%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/497568/Rule34%20AI%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let scriptWorked = false;

    function highlightAIGeneratedImages() {
        console.log(scriptWorked);
        if(!scriptWorked) {
            scriptWorked = true;
            const imageListDivs = document.querySelectorAll('div.image-list');

            imageListDivs.forEach(imageListDiv => {
                const thumbs = imageListDiv.querySelectorAll('span.thumb');

                thumbs.forEach(thumb => {
                    const images = thumb.querySelectorAll('img');

                    images.forEach(img => {
                        if (img.alt.includes('ai_generated')) {
                            img.style.border = '3px solid #e5c100';
                        }
                    });
                });
            });
        }
    }

    window.addEventListener('load', highlightAIGeneratedImages);
    setTimeout(highlightAIGeneratedImages, 1000);

    addCustomButton();


    function addCustomButton() {
        let searchButton = document.getElementsByName("commit")[0];
        const container = document.querySelector('div.awesomplete');
        if (container) {
            const input = container.querySelector('input[name="tags"]');
            if (input) {
                const button = document.createElement('button');

                function checkAiGenerated() {
                    return input.value.includes('-ai_generated');
                }

                function updateButtonState() {
                    if (checkAiGenerated()) {
                        button.textContent = 'Show AI';
                        button.style.backgroundColor = '#A6F4FF';
                        button.style.color = '#000000';
                        button.dataset.state = 'visible';
                    } else {
                        button.textContent = 'Hide AI';
                        button.style.backgroundColor = '#F2F2F2';
                        button.style.color = '#000000';
                        button.dataset.state = 'hidden';
                    }
                }

                function toggleAiGenerated() {
                    if (checkAiGenerated()) {
                        input.value = input.value.replace(/\s*-ai_generated/g, '');
                        updateButtonState();
                    } else {
                        input.value = input.value + ' -ai_generated';
                        updateButtonState();
                    }
                }

                updateButtonState();

                button.style.cursor = 'pointer';
                button.style.display = 'block';
                button.style.margin = '3px 0';
                button.style.width = '50vw';
                button.style.maxWidth = '100px';
                button.style.padding = '2px 10px';
                button.style.border = '1px solid #636363';
                button.style.borderRadius = '5px';
                button.style.transition = 'background-color 0.3s';
                button.style.marginLeft = '0px';

                button.addEventListener('mouseenter', () => {
                    if (button.dataset.state === 'visible') {
                        button.style.backgroundColor = '#90D2DB';
                    } else {
                        button.style.backgroundColor = '#A6F4FF';
                    }
                });
                button.addEventListener('mouseleave', () => {
                    if (checkAiGenerated()) {
                        button.style.backgroundColor = '#A6F4FF';
                    } else {
                        button.style.backgroundColor = '#F2F2F2';
                    }
                });

                button.addEventListener('click', (event) => {
                    event.preventDefault();
                    toggleAiGenerated();
                    searchButton.click();
                });

                input.insertAdjacentElement('afterend', button);
            }
        }
    }
})();

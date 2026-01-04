// ==UserScript==
// @name         Page Checker Helper
// @namespace    page-checker-helper
// @description  This script helps the QA team during the tests
// @version      0.5.2
// @author       Roberto Pegoraro
// @require      https://greasyfork.org/scripts/470000/code/GM%20Requests.js
// @match        *://*.ring.com/*support*
// @match        *://*.ring.com/support*
// @match        *://*.ring.com/*support*
// @match        *://*.ring.com/support*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472124/Page%20Checker%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/472124/Page%20Checker%20Helper.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var hasError = false;
    var hasLinks = true;

    createStatusBox();

    async function validateLinks() {
        const links = document.querySelectorAll('article a');
        const promises = [];

        if (links.length === 0) {
            hasLinks = false;
            return;
        }

        links.forEach(element => {
            const href = element.getAttribute('href');
            const promise = new Promise((resolveLink, rejectLink) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: href,
                    onload: function(response) {
                        setBackgroundColor(element, response, href);
                        const tempElement = document.createElement('html');
                        tempElement.innerHTML = response.responseText;

                        if (!href.endsWith('.pdf') && isInternalLink(href)) {
                            const titleElement = tempElement.querySelector('head title');
                            if (!titleElement) {
                                element.style.backgroundColor = 'red';
                                hasError = true;
                            }
                        }
                        resolveLink();
                    },
                    onerror: function(error) {
                        console.error("Error fetching link:", error);
                        rejectLink(error);
                    }
                });
            });
            promises.push(promise);
        });

        await Promise.all(promises);
    }

    async function createStatusBox() {
        await waitForElement('.PageWrapper_article-content__zPCi0');
        const statusBox = document.createElement('div');

        setTimeout(function() {
            statusBox.id = 'status-box';
            statusBox.className = 'toastify-toast';
            statusBox.innerHTML = `
                <span id="status-text">Checking links...</span>
                <span id="close-button" class="toastify-close-button">&times;</span>
            `;

            const targetElement = document.querySelector('.rcl__page.PageWrapper_page___wp64');
            targetElement.appendChild(statusBox);

            statusBox.style.position = 'fixed';
            statusBox.style.top = '20px';
            statusBox.style.right = '20px';
            statusBox.style.backgroundColor = '#323232';
            statusBox.style.color = '#fff';
            statusBox.style.padding = '15px 20px';
            statusBox.style.borderRadius = '4px';
            statusBox.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
            statusBox.style.zIndex = '9999';
            statusBox.style.fontFamily = 'Arial, sans-serif';
            statusBox.style.fontSize = '14px';
            statusBox.style.lineHeight = '1.4';
            statusBox.style.opacity = '1';
            statusBox.style.transition = 'opacity 0.3s ease';

            const closeButton = document.getElementById('close-button');
            closeButton.style.position = 'absolute';
            closeButton.style.top = '-10px';
            closeButton.style.right = '-8px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.color = '#fff';
            closeButton.style.fontSize = '19px';
            closeButton.style.lineHeight = '1';
            closeButton.style.width = '20px';
            closeButton.style.height = '20px';
            closeButton.style.textAlign = 'center';
            closeButton.style.borderRadius = '50%';
            closeButton.style.backgroundColor = '#000';
            closeButton.addEventListener('click', function() {
                statusBox.remove();
            });

            statusBox.style.display = 'block';
        }, 1200);

        await validateLinks();
        const statusText = await waitForElement('#status-text');
        const closeButton = document.getElementById('close-button');
        const hasConsoleError = checkConsoleErrors();

        if(!hasError && !hasConsoleError && hasLinks) {
            statusText.textContent = 'All links are okay!';
            statusBox.style.backgroundColor = '#5cb85c';
            closeButton.style.backgroundColor = '#5cb85c';
        } else if(!hasLinks) {
            const statusText = document.getElementById('status-text');
            statusText.textContent = 'No links found inside the article.';
        } else {
            statusText.textContent = 'Error occurred during link validation!';
            statusBox.style.backgroundColor = '#d9534f';
            closeButton.style.backgroundColor = '#d9534f';
        }

        setTimeout(function() {
            statusBox.style.display = 'none';
        }, 10000);
    }

    function checkConsoleErrors() {
        let hasConsoleError = false;

        window.onerror = function(message, source, lineno, colno, error) {
            console.error('Error occurred on the console:', message);
            hasConsoleError = true;
        };

        return hasConsoleError;
    }

    function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

    const elementErrorBorder = '2px solid red';
    const elementOkBorder = '2px solid green';
    const elementAlertBorder = '2px solid yellow';

    function setBackgroundColor(element, response, link) {
        let color;

        const statusCode = response.status;

        if (statusCode >= 200 && statusCode < 300) {
            color = isInternalLink(link) ? '#15a512' : '#61ed5e';
        } else if (statusCode >= 300 && statusCode < 400) {
            color = isInternalLink(link) ? '#cfb317' : '#eed963';
            hasError = true;
        } else {
            color = isInternalLink(link) ? '#a91919' : '#e24040';
            hasError = true;
        }

        if(isOldRHLink(link)){
            createAlertBox(element, 'Old link for support.ring.com', false, elementErrorBorder)
        }

        element.style.backgroundColor = color;
    }

    function createAlertBox(element, text, isImage, border) {
        let box = document.createElement('div');
        box.style.background = 'white';
        box.style.border = border;
        box.style.padding = '4px';
        box.style.maxWidth = '600px';
        box.style.display = 'inherit';
        box.innerHTML = text;
        if (isImage) {
            element.parentNode.append(box);
        } else {
            element.append(box);
        }
    }

    function isInternalLink(link) {
        return link.includes('ring.com/support');
    }

    function isOldRHLink(link) {
        return link.includes('support.ring.com');
    }
})();
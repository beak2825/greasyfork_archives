// ==UserScript==
// @name         Amazon ShoptheLook Enhancer
// @namespace    Violentmonkey Scripts
// @match        https://www.amazon.com/shopthelook?q=*
// @grant        GM_xmlhttpRequest
// @version      1.1
// @license MIT
// @description  Enhances the Amazon ShoptheLook page by adding product titles to each item.
// @downloadURL https://update.greasyfork.org/scripts/505960/Amazon%20ShoptheLook%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/505960/Amazon%20ShoptheLook%20Enhancer.meta.js
// ==/UserScript==

function enhanceShoptheLook() {
    const sectionElement = document.querySelector('#product_grid_container > div > section');
    if (!sectionElement) return;

    const articleElements = sectionElement.querySelectorAll('article');
    let newHtml = '';
    articleElements.forEach(article => {
        const imageContainerLink = article.querySelector('section.item-image-container > div > div > a');
        if (!imageContainerLink) return;

        const href = imageContainerLink.getAttribute('href');
        if (!href) return;

        GM_xmlhttpRequest({
            method: 'GET',
            url: href,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const productTitleElement = doc.querySelector('#productTitle');
                if (productTitleElement) {
                    const originalArticleHtml = article.outerHTML;
                    const titleHtml = productTitleElement.outerHTML;
                    newHtml += originalArticleHtml.replace('</article>', titleHtml + '</article>');
                } else {
                    newHtml += article.outerHTML;
                }
            }
        });
    });

    const originalSection = document.querySelector('#product_grid_container > div > section');
    originalSection.innerHTML = newHtml;
}

enhanceShoptheLook();
window.addEventListener('load', enhanceShoptheLook);
window.addEventListener('hashchange', enhanceShoptheLook);
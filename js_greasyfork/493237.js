
// ==UserScript==
// @name         House of Rare
// @namespace    https://live2ai.com/
// @version      1.1
// @description  Embed Live2AI sections on websites
// @author       Akash Dutta Ultra Pro Max
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493237/House%20of%20Rare.user.js
// @updateURL https://update.greasyfork.org/scripts/493237/House%20of%20Rare.meta.js
// ==/UserScript==

'use strict';
const insertEmbed = (containerId, embedId) => {
    const targetElements = document.getElementById(containerId);
    if (!targetElements) return;
    // Create a new div element
    const newDiv = document.createElement('div');

    newDiv.setAttribute("data-live2-embed", "1")
    newDiv.setAttribute("data-live2-embed-id", embedId)
    newDiv.setAttribute("data-live2-picked-up", "0")
    newDiv.setAttribute("data-live2-loaded", "0")
    newDiv.setAttribute("data-live2-team-id", "65f293dfa76602c36b7ea529")
    newDiv.setAttribute("data-live2-layout-type", "STORY")


    // Insert the new div after the current element
    targetElements.parentNode.insertBefore(newDiv, targetElements);


    var live2script = document.createElement('script');

    live2script.setAttribute('src', 'https://cdn.live2.ai/assets/sdk/latest/live2ai-embed-sdk.js');

    document.head.appendChild(live2script);
}

insertEmbed("shopify-section-template--15544028921995__16369747417be2647d", "84jwn6c67m");
insertEmbed("shopify-section-template--14611589791815__rabbit-top-banner", "84jwn6c67m");
insertEmbed("shopify-section-template--14611589791815__full-banner-image", "xakalu1t8e");
insertEmbed("shopify-section-template--14611588448327__collection-template", "c:rare-rr");
insertEmbed("shopify-section-template--14611589791815__full-banner-image-top", "wp736aybxo");
insertEmbed("shopify-section-template--14611588448327__collection-template", "c:rr-tshirts-all");
insertEmbed("shopify-section-template--14611590316103__argoid-pdp-similar-products", "p:6858349314119");

var live2Font = document.createElement('link');

live2Font.setAttribute('href', 'https://fonts.googleapis.com/css?family=Inter');
live2Font.setAttribute('rel', 'stylesheet');
window.live2 = {
        addToCart: async (product_id, variant_id) => {
            // Dispatch existing event when add to cart is triggered
            const addToCartEvent = new Event('Flits:AjaxCart:ProductAdded');
            document.dispatchEvent(addToCartEvent);
            console.log("event triggered",addToCartEvent)
        }
    };
    const addToCartEvent = new Event('Flits:AjaxCart:ProductAdded');
            document.dispatchEvent(addToCartEvent);
            console.log("event triggered",addToCartEvent)
    document.addEventListener('addToCartTriggered', addToCartEvent)












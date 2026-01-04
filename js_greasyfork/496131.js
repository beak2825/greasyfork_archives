// ==UserScript==
// @name        Replace eBay description iframe with xmlhttpRequest
// @namespace   dd
// @match       https://www.ebay.com/itm/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      DD3R
// @license     MIT
// @description Removes the iframe under "Item description from the seller" and Replaces it with html from xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/496131/Replace%20eBay%20description%20iframe%20with%20xmlhttpRequest.user.js
// @updateURL https://update.greasyfork.org/scripts/496131/Replace%20eBay%20description%20iframe%20with%20xmlhttpRequest.meta.js
// ==/UserScript==

let iframe = document.querySelector("#desc_ifr");

let descriptionDiv = document.createElement("div");
descriptionDiv.id = "itemDescription";
descriptionDiv.setAttribute("original-url", iframe.src);

GM_xmlhttpRequest({
    method: 'GET',
    url: iframe.src,
    onload: function (response) {
        if (response.status >= 200 && response.status < 400) {
            let htmlString = response.responseText;
            let parser = new DOMParser();
            let doc = parser.parseFromString(htmlString, 'text/html');
            descriptionDiv.innerHTML = doc.documentElement.querySelector(".x-item-description-child").outerHTML;
        } else {
            console.error('Failed to fetch the document');
        }
    },
    onerror: function (error) {
        console.error('Error fetching the document:', error);
    }
});

iframe.parentNode.replaceChild(descriptionDiv, iframe);
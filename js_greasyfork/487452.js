// ==UserScript==
// @name         Buyee Item Page Enhancements
// @license      MIT
// @version      0.22
// @description  Fix up item page on mobile with: larger images; cruft remove; description pasted into item page
// @author       rhgg2
// @match        https://buyee.jp/item/yahoo/*
// @icon         https://www.google.com/s2/favicons?domain=buyee.jp
// @require      https://unpkg.com/smartphoto@1.1.0/js/smartphoto.min.js
// @namespace https://greasyfork.org/users/1243343
// @downloadURL https://update.greasyfork.org/scripts/487452/Buyee%20Item%20Page%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/487452/Buyee%20Item%20Page%20Enhancements.meta.js
// ==/UserScript==
 
// stuff to handle loading stage of page
if (document.readyState === 'complete') {
    buyeeItemPageEnhance();
} else {
    window.addEventListener('load', () => buyeeItemPageEnhance());
}
 
// are we on the mobile site?
var isMobile = (navigator.userAgent.match(/Android/i)
         || navigator.userAgent.match(/webOS/i)
         || navigator.userAgent.match(/iPhone/i)
         || navigator.userAgent.match(/iPad/i)
         || navigator.userAgent.match(/iPod/i)
         || navigator.userAgent.match(/BlackBerry/i)
         || navigator.userAgent.match(/Windows Phone/i));
 
// fetch a URL and return a document containing it
function fetchURL(url) {
    return fetch(url)
    .then((response) => {
        return response.text()
    })
    .then((html) => {
        // Parse the text
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        return doc;
    });
}
 
// the main function
function buyeeItemPageEnhance () {
    var script = document.createElement("script");
    script.innerText = `
$('#js-item-images').slick('slickSetOption','speed',100,false);
$('#js-item-images').slick('slickSetOption','waitForAnimate',false,false);
$('#js-item-images').slick('slickSetOption','touchThreshold',15,false);`
    document.head.appendChild(script);
 
    if (isMobile) {
        document.querySelectorAll("img.image").forEach( (card) => {
            card.style["max-height"] = "400px";
            card.style.height = "auto";
        });
 
        ["div.detail_toShopping", "div.banner-outer", "div.directDelivery", "div.itemInformation__txtLink", "p.guide"].forEach( (text) => {
            let element = document.querySelector(text);
            if (element) {
                element.remove();
            }
        });
 
        let infoBox = document.querySelector("div.itemInformation__detailLink");
        if (infoBox) {
            infoBox.style["text-align"] = "left";
            fetchURL(infoBox.querySelector("a").href).then( doc => {
                var text = doc.querySelector("div.inner");
                text.querySelectorAll(".googleTranslate, #google_translate_element, h1").forEach( (node) => node.remove() );
                infoBox.appendChild(text);
                infoBox.querySelector("a").remove();
            });
        }
    }
};
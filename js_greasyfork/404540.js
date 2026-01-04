// ==UserScript==
// @name         השוטר של ניב
// @namespace    http://fxp.co.il/
// @version      0.5
// @description  FXPהדרך הפשוטה ביותר לבדוק גודל של חתימה ב
// @author       Muffin24
// @match        https://www.fxp.co.il/showthread.php*
// @match        https://www.fxp.co.il/member.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404540/%D7%94%D7%A9%D7%95%D7%98%D7%A8%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/404540/%D7%94%D7%A9%D7%95%D7%98%D7%A8%20%D7%A9%D7%9C%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==
if (!window.IntersectionObserver) {
    console.info('browser not supported')
}
let imagesLoaded = 0;
console.clear();
function signatureColor(element, height = 295, color = 'red') {
    if (element.clientHeight > height) {
        element.closest('.signature.restore, .signature_holder').style.backgroundColor = color;
    }
}

const observer = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            imagesLoaded++;
            console.log(entry.target);
            signatureColor(entry.target);
            observer.unobserve(entry.target);
        }
    });

    if (imagesLoaded == images.length) {
        console.log('All images have finished loading');
    }

});

const selector = location.pathname == '/member.php' ? '#view-aboutme .signature_holder' : '.signaturecontainer img';
const images = document.querySelectorAll(selector);

images.forEach(function(image) {
    observer.observe(image);
});
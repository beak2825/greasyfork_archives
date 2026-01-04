// ==UserScript==
// @name         Paging
// @namespace    undefined
// @version      0.0.8
// @description  Use keyboard to navigate to previous/next page. Currently only support sites that URL ends with page number.
// @author       Xiang Yang
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33618/Paging.user.js
// @updateURL https://update.greasyfork.org/scripts/33618/Paging.meta.js
// ==/UserScript==

var prevKeys = [
    109, // - num pad
    173, // - Firefox
    189, // - Chrome
    219  // [
];

var nextKeys = [
    107, // + num pad
    61,  // + Firefox
    187, // + Chrome
    221  // ]
];

function page(step) {
    var url = location.href;
    var reg = /\d+/g;
    if (!reg.exec(url)) {
        console.log("Unsupport url " + url);
        return;
    }
    location.href = url.replace(reg, function(n){ return parseInt(n)+step; });
}

document.addEventListener('keydown', (e) => {
    if (nextKeys.includes(e.which)) {
        page(1);
    } else if (prevKeys.includes(e.which)) {
        page(-1);
    }
});

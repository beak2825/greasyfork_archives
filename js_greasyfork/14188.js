// ==UserScript==
// @name         sh.st - Lite
// @namespace    x4_shst
// @version      0.1
// @description  Helps to deal with sh.st easier
// @author       x4fab
// @match        http://sh.st/*
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/14188/shst%20-%20Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/14188/shst%20-%20Lite.meta.js
// ==/UserScript==

var _setInterval = setInterval;
setInterval = function (a, b){
    return _setInterval(a, b == 1000 ? 600 : b);
};

/*var _c = 0;
_setInterval(() => {
    _c || console.log(document.querySelectorAll('.skip-btn.show')) || [].forEach.call(document.querySelectorAll('.skip-btn.show'), x => { console.log(x, x.click); x.click(); _c = 1; });
}, 500);*/

document.__defineGetter__('hidden', () => false);
document.__defineGetter__('mozHidden', () => false);
document.__defineGetter__('webkitHidden', () => false);

document.body.appendChild(document.createElement('style')).innerHTML = `
iframe, #footer, .advert, .skip-advert, .skip-logo { display: none !important }
#skip-top-bar { height: 100%; z-index: 1000 }
#timer { display: block; top:10%; left:50%; width: 200px; margin-left: -100px; color: black; font-weight: 400; }
#skip_button { top:10%; left:50%; width: 200px; margin-left: -100px; float: none; position: absolute; z-index:100; background: #57f; color: white; }
.skip-add .skip-top-bar .skip-add-container .skip-btn:after{ border-left-color: white; }
.skip-add .skip-top-bar .skip-add-container { background: white; z-index: 1000; position: fixed; height: auto; top:0;left:0;right:0;bottom:0; }`;

new MutationObserver(() => {
	[].forEach.call(document.querySelectorAll('iframe, #footer, .skip-advert'), x => x.parentNode.removeChild(x));
}).observe(document.body, {
	childList: true
});

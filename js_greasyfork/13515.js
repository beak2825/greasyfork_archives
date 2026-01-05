// ==UserScript==
// @name         JCB YOYO (Captcha)
// @namespace    http://your.homepage/
// @version      0.2
// @description  enter something useful
// @author       Rophy Tsai
// @match        https://ezweb.easycard.com.tw/Event01/captcha_A
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13515/JCB%20YOYO%20%28Captcha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/13515/JCB%20YOYO%20%28Captcha%29.meta.js
// ==/UserScript==

var img = document.querySelector('img[src^="captcha"]');
if (img) {
    var src = img.src;
    var paths = src.split('/');
    var path = paths[paths.length-1];
    try {
        var captcha = path.match(/cp_(\d+)\./)[1];
        window.parent.postMessage({
            type: 'captcha',
            value: captcha
		}, '*');
        console.log('posted message to parent');
    } catch (ex) {
        console.log(ex);
    }
    
}
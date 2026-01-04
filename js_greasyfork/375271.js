// ==UserScript==
// @name         Dom image downloader
// @namespace    http://sharlock.me/
// @version      0.1.1
// @description  download dom node as image.
// @author       74Sharlock
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375271/Dom%20image%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/375271/Dom%20image%20downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let s = document.createElement('script');
    s.src= '//cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.js'
    document.body.appendChild(s);
    window.downloadNode = async function(node, name){
        node = typeof node === 'string' ? document.querySelector(node) : node;
        let canvas = await html2canvas(node);
        canvas.toBlob(function(blob){
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = name || 'node.png';
            a.click();
        })
    };
})();
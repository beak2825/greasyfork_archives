// ==UserScript==
// @name         Olx full view gallery
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  full view gallery preview and nothing else
// @author       You
// @match        https://www.olx.ua/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=olx.ua
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/446967/Olx%20full%20view%20gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/446967/Olx%20full%20view%20gallery.meta.js
// ==/UserScript==

(function() {
    'use strict';
//ad-gallery-view


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
setTimeout(()=>{

console.log('done');



addGlobalStyle(`
.css-1bmvjcs{
height: calc(100vh - 150px);
}

.css-18f2q5x{
padding:0;
}
.css-atnlfi{
    position: absolute;
	top: 50px;
    right: 50px;
}
.css-15d33fd{
display: none;
}
.css-xg7zwc { display:none; }
.css-tma80q{
grid-column: 1/-1;
}

`);


},1000);



    // Your code here...
})();
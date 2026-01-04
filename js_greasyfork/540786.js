// ==UserScript==
// @name        Flirb Mobile Modern
// @namespace   Violentmonkey Scripts
// @match       https://web.flirb.net/*
// @grant       none
// @version     1.4
// @author      -
// @description A userscript to make web.flirb.net suitable for mobile.
// @liscense    MIT
// @downloadURL https://update.greasyfork.org/scripts/540786/Flirb%20Mobile%20Modern.user.js
// @updateURL https://update.greasyfork.org/scripts/540786/Flirb%20Mobile%20Modern.meta.js
// ==/UserScript==

document.querySelector('head').insertAdjacentHTML('beforeend', '<meta name="viewport" content="width=device-width, initial-scale=1">');
document.querySelector('head').insertAdjacentHTML('beforeend', `

    <style>
html {
    width:100%;
    height:100%;
}

body {
    scale:1;
    width:100%;
    height:calc(100% + 1px);
    overflow:scroll;
}

.sidebar {
    display:none;
}

.container {
    display:flex;
    flex-direction:column;
    height:calc(100% - 84px);
    width:100%;
    overflow:scroll;
    padding:42px 0;
    background:white;
}

.nav-container {
    position:fixed!important;
    top:calc(100% - 46px);
    height:46px;
    left:0;
    width:100%;
    background:linear-gradient(to bottom, #111,#000);
}

.nav-logo {
    position:fixed;
    top:0;
    left:0;
    height:46px;
    z-index:1000;
}

.nav-right-items {
    position:fixed;
    top:0;
    right:0;
    width:100%;
    display:flex;
    justify-content:right;
    padding:2px 10px;
}

.container .main-content .module:has(.new-post-module) {
    display:none;
}

.container .main-content {
    margin:0!important;
    width:100%;
}

.container .main-content .module {
    border-radius:0;
}

[style="display: block;"] {
    margin:46px 0;
    height:calc(100% - 92px);
    padding:0;
}

.post-modal-content {
    max-width:100%;
    height:100%!important;
    border-radius:0;
    margin:0;
    border:0;
    margin-left:0;
}

.new-post-module .new-post-avatar {
    display:none;
}

.new-post-input-container {
    flex-direction:column-reverse;
    gap:10px;
}

.new-post-input-container textarea {
    height:400px;
    
}
    </style>
    
`);
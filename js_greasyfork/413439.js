// ==UserScript==
// @name						Genshin Impact Map Fix
// @name:es					Genshin Impact Map Fix
// @author					Beto Vickers
// @description			Fix weird stuffs in the menus of https://genshin-impact-map.appsample.com/.
// @description:es  Arregla cosas extrañas en los menús de https://genshin-impact-map.appsample.com/.
// @match       		https://genshin-impact-map.appsample.com/*
// @version  				1.0
// @namespace 			https://greasyfork.org/users/695502
// @grant    				none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/413439/Genshin%20Impact%20Map%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/413439/Genshin%20Impact%20Map%20Fix.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.fixed-top { display: none !important; }'); // Optional (remove donations bar)
addGlobalStyle('#sidebar { padding-bottom: 0px !important; }');
addGlobalStyle('#sidebar .sidebar-footer { display: none !important; }');
addGlobalStyle('.tab-content[data-v-6196efa4] { scrollbar-width: thin !important; }');
addGlobalStyle('.tab-content[data-v-6196efa4] { padding-top: 10px !important; margin-top: 10px !important; }'); // Add a "/*" from the start of this line if you are using English
addGlobalStyle('.ml-3, .mx-3 { margin-left: 0.3rem !important; }');
addGlobalStyle('.mb-3, .my-3 { margin-bottom: 0rem !important; }');
addGlobalStyle('.mr-3, .mx-3 { margin-right: 0.3rem !important; }');
addGlobalStyle('.mt-3, .my-3 { margin-top: 0.3rem !important; }');
// ==UserScript==
// @name         1stAprilFix
// @version      1.0
// @description  1stAprilFix for zelenka.guru
// @author       custie
// @match        *://*.lolz.guru/*
// @match        *://*.lolz.live/*
// @match        *://*.zelenka.guru/*
// @match        *://*.lzt.market/*
// @match        *://*.lolz.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @namespace https://greasyfork.org/users/1051447
// @downloadURL https://update.greasyfork.org/scripts/463053/1stAprilFix.user.js
// @updateURL https://update.greasyfork.org/scripts/463053/1stAprilFix.meta.js
// ==/UserScript==

function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

GM_addStyle ( `
    html {
        filter: hue-rotate(0deg) !important;
    }

    img:not(.avatar img[src^="data:image/png;base64,"], .avatarScaler img[src^="data:image/png;base64,"]), video, .img:not([style^="background-image: url('data:image/png;base64"]), .categoryIcon, .mceSmilie {
        filter: hue-rotate(0deg) !important;
    }
` );
// ==UserScript==
// @name Japanize.mod
// @namespace net.mylingual.japanze
// @author mod by nsmr0604 (Cybozu Labs, Inc.)
// @include http*://*/*
// @exclude http*://*.jp/*
// @exclude http*://jp.*/*
// @exclude http*://*/ja/*
// @exclude http*://*/ja-JP/*
// @exclude http*://*/*lang=ja*

// @description Web Application UI Translation Infrastracture
// @version 0.0 d

// @downloadURL https://update.greasyfork.org/scripts/23971/Japanizemod.user.js
// @updateURL https://update.greasyfork.org/scripts/23971/Japanizemod.meta.js
// ==/UserScript==

(function () {
    var elem = document.createElement('script');
    //elem.src = 'http://japanize.31tools.com/userjs/core.js';
    //elem.src = 'http://japanize.mylingual.net/userjs/core.js';
    elem.src = 'https://greasyfork.org/scripts/24109-japanize-mod-core/code/Japanizemodcore.js';
    document.body.appendChild(elem);
})();

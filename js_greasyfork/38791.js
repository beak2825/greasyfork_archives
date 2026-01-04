// ==UserScript==
// @name         Github New Tab Open
// @namespace    http://tampermonkey.net/
// @icon         https://favicon.yandex.net/favicon/github.com
// @version      0.2-20180226
// @description  try to take over the world!
// @author       zhuzhuyule
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38791/Github%20New%20Tab%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/38791/Github%20New%20Tab%20Open.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var base = document.createElement('base');
    base.setAttribute('target','_blank');
    document.querySelector('html>head').append(base);
})();
// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  description
// @author       Anton Lazarau
// @include      https://*keengamer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427172/test.user.js
// @updateURL https://update.greasyfork.org/scripts/427172/test.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let parent = document.querySelector('#gp-page-wrapper');
    let div = document.createElement('div');
    div.style.width = '500px';
    div.style.left = '500px';
    div.style.color = 'red';
    document.body.append(div);
    console.log(div);
})();
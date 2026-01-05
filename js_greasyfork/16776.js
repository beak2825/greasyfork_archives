// ==UserScript==
// @name         Dizilab skip ad remover
// @namespace    omeryagmurlu.github.io
// @version      0.1
// @description  try to take over the world and hate ads
// @author       MindlessRanger
// @match        dizilab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16776/Dizilab%20skip%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/16776/Dizilab%20skip%20ad%20remover.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
if (document.getElementsByClassName('skip')) {
    document.getElementsByClassName('skip')[0].click();
}
// ==UserScript==
// @name         YT - Restore red favicon
// @namespace    https://github.com/Procyon-b
// @version      1.1.2
// @description  Replace the pink icons with the real red icons
// @author       Achernar
// @match        https://www.youtube.com/*
// @grant        none
// @run-at  document-start
// @downloadURL https://update.greasyfork.org/scripts/513768/YT%20-%20Restore%20red%20favicon.user.js
// @updateURL https://update.greasyfork.org/scripts/513768/YT%20-%20Restore%20red%20favicon.meta.js
// ==/UserScript==

(function() {
"use strict";

if (document.readyState != 'loading') init();
else {
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  }
var inited=0;
var validId =
   ['30100020', '58889478', 'e2b2f4b9', '8da5389f', 'e6b89e3b',
    '3279da7c', 'fc303b88', '8b0677e9', 'ca553d13', '4981804c',
    '422e7d54', 'cbfd6f42', '72b8c307', 'daa4e47c', 'b9bfb983',
    '6b6081dd', '711fd789', 'd96517c3', '591b93bf', '9fa451de',
    'e6683cb8', '08f2775a', 'fed3a7a0', '1520a82c', 'e1590144',
    '2ed914a0', '606e092f', '9fda8632', '54e547bd', 'bfe4b043',
    '9fd1b038', 'd2d9e732', '5565b4e1', 'd36f30a8', '03ea48a4',
    'f048a476', '45ea6c88', 'aba54451', 'fba944d3', '6d463d26',
    'e1f1fadb', '00d073cd', '7c4c8f55', '77bb79f2', 'b2f97639',
    '8666f415', '1218a75e', '2aa462d0', '2253fa3d', '1aed4864',
    'cb2483b8', 'cd5cb204', '7b155292', 'f717390d', '299f48a9',
    '8a664e3f', '493698c2', '2aca1891', '33ae93e9', 'ad18d4a4',
    'fb317ea9', '36f70448', '477ecd89', 'f788da0a', '5f57c66e',
    'ba3a814f', '3ad23781', 'c81c827c', 'daa21ba0', 'be7304fd',
    '78bc1359', '0df452f7', '4151fd0f', 'c497a562', 'f893a131'];

function init() {
  if (inited++) return;
  var f=document.querySelectorAll('html > head > link[rel*="icon"]');
  for (let i=0, e; e=f[i]; i++) {
    //href=e.href.replace( /(\/desktop\/........\/img\/)logos\//, '$1');
    //e.href=e.href.replace( /(\/desktop\/........\/img\/)logos\//, '/desktop/'+validId[0]+'/img/');
    e.href=e.href.replace( /(\/desktop\/........\/img\/)(?:logos\/)?/, '/desktop/'+validId[0]+'/img/');
    }
  }

})();
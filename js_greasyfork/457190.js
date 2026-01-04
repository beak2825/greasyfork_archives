// ==UserScript==
// @name                IMPK Redirector
// @description         IMPK老域名重定向到bbs.impk.cc
// @namespace           https://chaizi.cc/
// @version             1.2
// @author              chai
// @license             LGPLv3
// @run-at              document-start
// @match               *://impk.blizzard.cn/*
// @downloadURL https://update.greasyfork.org/scripts/457190/IMPK%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/457190/IMPK%20Redirector.meta.js
// ==/UserScript==
 
"use strict";
 
window.location.replace(location.href.replace(location.hostname, "bbs.impk.cc"));
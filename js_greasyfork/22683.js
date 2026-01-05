// ==UserScript==
// @name         mirrorcreator2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  mirrorcreator skip 2
// @author       You
// @match        www.mirrorcreator.com/show*.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22683/mirrorcreator2.user.js
// @updateURL https://update.greasyfork.org/scripts/22683/mirrorcreator2.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
document.location = document.getElementById('redirectlink').getElementsByTagName('a')[0].href;
// Your code here...
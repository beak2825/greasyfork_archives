// ==UserScript==
// @name         Xenforo invisitext fork
// @version      0.0.2
// @description  Make invisible text explicitly visible, without hovering
// @author       NemoMarx
// @match        https://forums.sufficientvelocity.com/*
// @match        https://forums.spacebattles.com/*
// @match        https://forums.questionablequesting.com/*
// @match        https://xenforo.com/community/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/158749
// @downloadURL https://update.greasyfork.org/scripts/35002/Xenforo%20invisitext%20fork.user.js
// @updateURL https://update.greasyfork.org/scripts/35002/Xenforo%20invisitext%20fork.meta.js
// ==/UserScript==
'use strict';

GM_addStyle('span[style*="Transparent"], span[style*="transparent"], span[style*="TRANSPARENT"] { background: #000000; color: #FF748C !important; }');

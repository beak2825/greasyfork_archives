// ==UserScript==
// @name         AFFTW Chatbox Inject
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds the chatango chat back to the sidebar of animefansftw website.
// @author       Nightsanity
// @match        http://www.animefansftw.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13541/AFFTW%20Chatbox%20Inject.user.js
// @updateURL https://update.greasyfork.org/scripts/13541/AFFTW%20Chatbox%20Inject.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
$('#sidebar').prepend('<div class="widget"><h3>Chat</h3><embed width="300" height="450" src="http://animefansftw-chat.chatango.com"></div>');
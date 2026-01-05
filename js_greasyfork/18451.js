// ==UserScript==
// @name         Abandon Bot
// @namespace    https://www.reddit.com/u/AbandonBot
// @version      0.1
// @description  Automatically vote STAY
// @author       /u/AbandonBot
// @match        https://www.reddit.com/robin/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18451/Abandon%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/18451/Abandon%20Bot.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

document.querySelector(".robin--vote-class--abandon").click();
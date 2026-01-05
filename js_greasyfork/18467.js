// ==UserScript==
// @name         Spam bot
// @namespace    https://www.reddit.com/u/Supervarken_
// @version      0.2
// @description  Automatically vote STAY
// @author       /u/Supervarken_
// @match        https://www.reddit.com/robin/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18467/Spam%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/18467/Spam%20bot.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function sendMessage(message){
    $("#robinSendMessage > input[type='text']").val(message);
    $("#robinSendMessage > input[type='submit']").click();
}


for (i = 1000; i < 100000000; i += 5000){
setTimeout(function(){sendMessage("Join the spam army! Install https://greasyfork.org/nl/scripts/18467-spam-bot as a userscript!") }, i);
}

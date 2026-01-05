// ==UserScript==
// @name         Chat
// @namespace    xAsk
// @version      1.0
// @description  Da Chat
// @author       xAsk
// @match        http://agar.io/*
// @match        https://agar.io/*
// @downloadURL https://update.greasyfork.org/scripts/14833/Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/14833/Chat.meta.js
// ==/UserScript==

var interval = setInterval(function () {
    if(unsafeWindow.jQuery) {
        $("head").append('<script type="text/javascript" src="http://enterspace.dyndns.org/agar/chat/sc"></script>');
        clearInterval(interval);
    } else {
        console.log("jQuery not loaded!");
    }
}, 500);
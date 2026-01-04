// ==UserScript==
// @name         Copy Steam Code from Twitch Chat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically copy a steam code from the Twitch chat you are in
// @author       jaceob
// @match        https://www.twitch.tv/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/444374/Copy%20Steam%20Code%20from%20Twitch%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/444374/Copy%20Steam%20Code%20from%20Twitch%20Chat.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    var foundKeys = [];
    
    setInterval(function() {
        $(".chat-line__message").each(function(_, msg) {
            var regex = "((?![^0-9]{12,}|[^A-z]{12,})([A-z0-9]{4,5}-?[A-z0-9]{4,5}-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5}(-?[A-z0-9]{4,5})?)?))";
            try {
                var found = msg.innerText.match(regex);
                if (found) {
                    if (!foundKeys.includes(found[0])){
                        console.log("FOUND KEY");
                        var elem = document.createElement('textarea');
                        elem.value = found[0];
                        document.body.appendChild(elem);
                        elem.select();
                        document.execCommand('copy');
                        document.body.removeChild(elem);
                        foundKeys.push(found[0]);
                        var url = `https://store.steampowered.com/account/registerkey?key=${found[0]}`;
                        window.open(url, '_blank').focus();
                    }
                }
            } catch (error) {
                return
            }
        });
    }, 500);
})();
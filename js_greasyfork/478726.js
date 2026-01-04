// ==UserScript==
// @name        Copy to discord
// @namespace   Violentmonkey Scripts
// @match       https://www.twitch.tv/*
// @match       https://7tv.app/emotes/*
// @grant       none
// @version     1.0
// @run-at      document-end
// @author      Pipos https://discord.com/users/375407448795774976
// @description Copy emotes from twitch(7tv) and 7tv(website) convert to post on discord
// @downloadURL https://update.greasyfork.org/scripts/478726/Copy%20to%20discord.user.js
// @updateURL https://update.greasyfork.org/scripts/478726/Copy%20to%20discord.meta.js
// ==/UserScript==

(function() {
    function checkClipboard() {
        navigator.clipboard.readText().then(function(text) {
            let regex = /https:\/\/cdn\.7tv\.app\/emote\/([a-f0-9]+)\/(1|2|3|4)x\.(avif|webp)/g;
            let modifiedText = text.replace(regex, 'https://cdn.7tv.app/emote/$1/2x.gif');

            if (modifiedText !== text) {
                navigator.clipboard.writeText(modifiedText).then(function() {
                    return
                });
            }
        });
    }
    setInterval(checkClipboard, 200);
})();
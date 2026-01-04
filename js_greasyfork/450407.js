// ==UserScript==
// @name        Link to "friends who play" on the deleted games' pages
// @match       https://steamcommunity.com/app/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @author      rdavydov
// @description Adds a link to "friends who play" page on the deleted games' pages. Works only when your Steam is in English.
// @license MIT
// @version 0.0.1.20220916191430
// @namespace https://greasyfork.org/users/952134
// @downloadURL https://update.greasyfork.org/scripts/450407/Link%20to%20%22friends%20who%20play%22%20on%20the%20deleted%20games%27%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/450407/Link%20to%20%22friends%20who%20play%22%20on%20the%20deleted%20games%27%20pages.meta.js
// ==/UserScript==

var appID = document.URL.match('/\/.+\/app/([0-9]+)')[1];

var reviews = '<span>Reviews</span>';
var anchors = document.getElementsByClassName('apphub_sectionTab');

for (i = 0; i < anchors.length; i++)
{
    if (anchors[i].innerHTML == reviews)
    { 
        var friends = document.createElement('a');
        friends.href      = 'https://steamcommunity.com/id/me/friendsthatplay/' + appID;
        friends.innerHTML = 'Friends';
        friends.className = 'apphub_sectionTab';
        anchors[i].parentNode.insertBefore(friends, anchors[i].nextSibling);

    }
}
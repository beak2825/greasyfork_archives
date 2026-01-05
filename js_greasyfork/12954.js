// ==UserScript==
// @name         Username Empinkener
// @version      0.1
// @description  Empinkens uncoloured usernames at the xkcd forums
// @author       faubi
// @include      http://forums.xkcd.com/*
// @include      http://forums3.xkcd.com/*
// @include      http://fora.xkcd.com/*
// @include      http://echochamber.me/*
// @namespace    FaubiScripts
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12954/Username%20Empinkener.user.js
// @updateURL https://update.greasyfork.org/scripts/12954/Username%20Empinkener.meta.js
// ==/UserScript==

links = document.getElementsByTagName('a');
for(var i=0;i<links.length;i++){
    link = links[i];
    if(link.href.indexOf('memberlist.php?mode=viewprofile') !== -1 && !link.classList.contains('username-coloured') && !link.classList.contains('postlink')){
        link.style.color = '#FF00BF';
        link.classList.add('username-coloured');
    }
}
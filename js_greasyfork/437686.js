// ==UserScript==
// @name          Steam: add HowLongToBeat link
// @include       http://store.steampowered.com/app/*
// @include       https://store.steampowered.com/app/*
// @description   Adds a link to search for the game's playtime on HowLongToBeat
// @version       1.0.0
// @author        vonRaven
// @namespace     vonRaven
// @license       MIT License
// @grant         none
// @run-at        document-start
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/437686/Steam%3A%20add%20HowLongToBeat%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/437686/Steam%3A%20add%20HowLongToBeat%20link.meta.js
// ==/UserScript==

setMutationHandler(document, '.apphub_AppName', function(nodes) {
  var yt = document.createElement('div');
  var link = 'https://howlongtobeat.com/?q=' + nodes[0].textContent.replace(' ','+') + '#search';
  nodes[0].parentNode.insertBefore(yt, nodes[0]);
  yt.outerHTML =
    '<div class="apphub_OtherSiteInfo" style="margin-right:1em">\
        <a class="btnv6_blue_hoverfade btn_medium" href="' + link + '">\
            <span>HowLongToBeat</span>\
        </a>\
     </div>';
  this.disconnect();
});

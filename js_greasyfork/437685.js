// ==UserScript==
// @name          Steam: add Youtube trailer link
// @include       http://store.steampowered.com/app/*
// @include       https://store.steampowered.com/app/*
// @description   Adds a link to search for the game's trailer on Youtube
// @version       1.0.1
// @author        vonRaven
// @namespace     vonRaven
// @license       MIT License
// @grant         none
// @run-at        document-start
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/437685/Steam%3A%20add%20Youtube%20trailer%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/437685/Steam%3A%20add%20Youtube%20trailer%20link.meta.js
// ==/UserScript==

setMutationHandler(document, '.apphub_AppName', function(nodes) {
  var yt = document.createElement('div');
  var link = 'https://www.youtube.com/results?search_query=' + nodes[0].textContent.replace(' ','+') + '+game+trailer';
  nodes[0].parentNode.insertBefore(yt, nodes[0]);
  yt.outerHTML =
    '<div class="apphub_OtherSiteInfo" style="margin-right:1em">\
        <a class="btnv6_blue_hoverfade btn_medium" href="' + link + '">\
            <span>Youtube</span>\
        </a>\
     </div>';
  this.disconnect();
});

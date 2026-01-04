// ==UserScript==
// @name         steam-workshop-subscribe-all
// @namespace    savagecore.uk
// @version      0.1.0
// @author       SavageCore
// @description  Restore the missing subscribe to all button for Steam Workshop.
// @license      Unlicense
// @icon         https://savagecore.uk/img/userscript_icon.png
// @homepageURL  https://github.com/SavageCore/steam-workshop-subscribe-all
// @supportURL   https://github.com/SavageCore/steam-workshop-subscribe-all/issues
// @match        https://steamcommunity.com/sharedfiles/filedetails/?id=*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/493550/steam-workshop-subscribe-all.user.js
// @updateURL https://update.greasyfork.org/scripts/493550/steam-workshop-subscribe-all.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const main = async () => {
    const workshopItemDescriptionTitle = document.querySelector(".workshopItemDescriptionTitle");
    if (!workshopItemDescriptionTitle) {
      return;
    }
    const collectionChildren = document.querySelector(".collectionChildren");
    if (!collectionChildren) {
      return;
    }
    const subscribeCollection = document.querySelector(".subscribeCollection");
    if (subscribeCollection) {
      return;
    }
    const url = window.location.href;
    let collectionId = url.split("/").pop();
    if (!collectionId) {
      return;
    }
    collectionId = collectionId.replace("?id=", "");
    const breadcrumbs = document.querySelector(".breadcrumbs");
    if (!breadcrumbs) {
      return;
    }
    const breadcrumbsLinks = breadcrumbs.querySelectorAll("a");
    const appLink = breadcrumbsLinks[0];
    const appHref = appLink.getAttribute("href");
    if (!appHref) {
      return;
    }
    const appId = appHref.split("/").pop();
    const html = `
    <div class="subscribeCollection">
        <a class="general_btn subscribe" title="Unofficial - userscript!" onclick="SubscribeCollection( '${collectionId}', '${appId}' );">
            <div class="subscribeIcon"></div>
            <span class="subscribeText">Subscribe to all</span>
        </a>
        <span class="general_btn subscribe" title="Unofficial - userscript!" onclick="UnsubscribeCollection( '${collectionId}' )">
            <div class="unsubscribeIcon"></div>
            <span>Unsubscribe from all</span>
        </span>
        <div style="clear: right"></div>
    </div>`;
    collectionChildren.insertAdjacentHTML("beforebegin", html);
  };
  main();

})();
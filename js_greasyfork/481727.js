// ==UserScript==
// @name         Boop / SGDBoop button on Steam Store
// @namespace    MNM
// @author       MNM
// @version      0.1
// @description  Simply adds a Boop / SGDBoop button to all games on the steam store
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        http*://store.steampowered.com/app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481727/Boop%20%20SGDBoop%20button%20on%20Steam%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/481727/Boop%20%20SGDBoop%20button%20on%20Steam%20Store.meta.js
// ==/UserScript==
var appId = decodeURIComponent(window.location.pathname.split("/")[2]),
    comBut = document.querySelector("div.apphub_OtherSiteInfo"),
    storeurl = 'sgdb://boop/steam,steam,steam,steam,steam/'+appId+'-header-en,'+appId+'-capsule-en,'+appId+'-hero-en,'+appId+'-logo-en,'+appId+'-clienticon-en/nonsteam',
    boop = document.createElement("a");
boop.setAttribute('href',storeurl);
boop.className ="btnv6_blue_hoverfade btn_medium";
boop.innerHTML ='<span>Boop</span>';
comBut.appendChild(boop);
// ==UserScript==
// @name        Real Hyperlins for edit-buttons- ebay-kleinanzeigen.de
// @namespace   Violentmonkey Scripts
// @match       https://www.ebay-kleinanzeigen.de/m-meine-anzeigen.html
// @grant       none
// @version     1.0
// @author      -
// @description 25.3.2023, 10:40:27
// @require     https://code.jquery.com/jquery-3.6.4.slim.min.js
// @grant  unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462637/Real%20Hyperlins%20for%20edit-buttons-%20ebay-kleinanzeigende.user.js
// @updateURL https://update.greasyfork.org/scripts/462637/Real%20Hyperlins%20for%20edit-buttons-%20ebay-kleinanzeigende.meta.js
// ==/UserScript==




$( document ).ready(function() {

    $(".manageaditem").each(function( index ) {
    var adUrl = $(this).find("a").first().attr("href");
    var first = adUrl.lastIndexOf("/");
    var last = adUrl.substr(first);
    var last = last.indexOf("-");
    var adId= adUrl.substr(first+1,last-1);
    var link = '<a href="https://www.ebay-kleinanzeigen.de/p-anzeige-bearbeiten.html?adId='+adId+'" style="height:43px;text-align:center;display:block;border:1px solid #508200;border-radius:10px;font-weight:bold"><div style="margin-top:10px;margin-left:10px;width:120px;"><div style="float:left;margin-right:10px;"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.80545 1.88383C10.8794 0.809884 12.6206 0.809883 13.6945 1.88383L14.1161 2.3054C15.1901 3.37934 15.1901 5.12054 14.1161 6.19448L5.82322 14.4874C5.49503 14.8156 5.04992 14.9999 4.58579 14.9999H2.25C1.55964 14.9999 1 14.4403 1 13.7499V11.4142C1 10.95 1.18437 10.5049 1.51256 10.1767L9.80545 1.88383ZM12.6339 2.94449C12.1457 2.45633 11.3543 2.45633 10.8661 2.94449L10.7724 3.03821C11.1686 3.26478 11.6384 3.57771 12.0303 3.96961C12.4222 4.36151 12.7352 4.83137 12.9617 5.22755L13.0555 5.13382C13.5436 4.64567 13.5436 3.85421 13.0555 3.36606L12.6339 2.94449ZM11.8535 6.33579C11.8238 6.27602 11.791 6.21207 11.7552 6.14514C11.555 5.77052 11.2833 5.34395 10.9697 5.03027C10.656 4.7166 10.2294 4.44495 9.8548 4.24472C9.78787 4.20895 9.72392 4.17615 9.66415 4.14645L2.57322 11.2374C2.52634 11.2843 2.5 11.3479 2.5 11.4142V13.4999H4.58579C4.65209 13.4999 4.71568 13.4736 4.76256 13.4267L11.8535 6.33579Z" fill="currentColor"></path></svg></div><div style="float:left;">Bearbeiten</div></div></a>';
    $(".linklist--item", this).first().html(link);
    });
});

// ==UserScript==
// @namespace  https://greasyfork.org/zh-TW/users/142344-jasn-hr
// @name  AutoConvert40WordsSeedHashToMagnetLink
// @description  Auto convert 40 words seed hash to magnet link.
// @copyright  2019, HrJasn (https://greasyfork.org/zh-TW/users/142344-jasn-hr)
// @license  GPL-3.0-or-later
// @version  1.0
// @icon  https://www.google.com/s2/favicons?domain=llss.app
// @include  http*://llss.app/wp/all/anime/*
// @include  http*://www.hacg.cat/wp/*
// @include  http*://www.eyny.com/forum.php?*tid=*
// @exclude  http*://www.liuli.*/
// @exclude  http*://www.liuli.*/wp/?*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/438070/AutoConvert40WordsSeedHashToMagnetLink.user.js
// @updateURL https://update.greasyfork.org/scripts/438070/AutoConvert40WordsSeedHashToMagnetLink.meta.js
// ==/UserScript==

window.onload = function(){
  document.body.innerHTML = document.body.innerHTML.replace(/([^A-Za-z0-9])([A-Za-z0-9]{40,40})([^A-Za-z0-9\.])/g,'$1<a href="magnet:?xt=urn:btih:$2">$2</a>$3');
}
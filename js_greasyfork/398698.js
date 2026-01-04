// ==UserScript==
// @name         Query Builder
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  comma delimitator
// @author       Marian Danilencu
// @include        *partners.wayfair.com/v/product_addition/catalog_query_builder*
// @grant        none
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/398698/Query%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/398698/Query%20Builder.meta.js
// ==/UserScript==
var x = document.createElement("IFRAME");
x.setAttribute("src", "https://convert.town/column-to-comma-separated-list");
var zoom = Math.round(window.devicePixelRatio * 100);
if(zoom=="100"){x.style.cssText="border-radius:4px;position:absolute;width:290px;height:260px;left:20px;top:290px";}
else if(zoom=="110"){x.style.cssText="border-radius:4px;position:absolute;width:210px;height:260px;left:0px;top:290px";}
else if(zoom=="125"){x.style.cssText="border-radius:4px;position:absolute;width:150px;height:260px;left:0px;top:290px";}
document.body.appendChild(x);
document.querySelectorAll("a")[14].style.display="none";
document.querySelectorAll("a")[15].style.display="none";



// ==UserScript==
// @name        Thingiverse zip download
// @namespace   Nickel
// @description Restores zip file download button on Thingiverse
// @icon        https://cdn.thingiverse.com/site/img/favicons/favicon-32x32.png
// @version     0.1.1
// @license     GNU General Public License v3
// @copyright   2022, Nickel
// @author      Nickel
// @grant       none
// @include     https://www.thingiverse.com/thing:*
// @downloadURL https://update.greasyfork.org/scripts/440679/Thingiverse%20zip%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/440679/Thingiverse%20zip%20download.meta.js
// ==/UserScript==

var no = location.pathname.match( /[0-9]+/ );
var zip = "/thing:" + no + "/zip";

var elm = document.createElement("a");
elm.innerText = "Download zip";
elm.href = zip;
elm.title = "Zip file download";
elm.setAttribute("style", "font-weight: bold; color: black; margin-left: 20px; margin-top: 10px;");


sidebar = document.getElementsByClassName("SidebarMenu__sidebarMenu--3uBjd");
sidebar[0].appendChild( elm );
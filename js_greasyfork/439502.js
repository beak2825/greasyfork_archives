// ==UserScript==
// @name         EmuParadise Download Workaround
// @version      1.1.4
// @description  Replaces the download button link with a working one; Now without JQuery slowdown!
// @author       Eptun, PencilAmazing, pumpkinlink
// @match        https://*.emuparadise.me/*/*/*
// @grant        none
// @namespace https://greasyfork.org/users/872099
// @downloadURL https://update.greasyfork.org/scripts/439502/EmuParadise%20Download%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/439502/EmuParadise%20Download%20Workaround.meta.js
// ==/UserScript==

var id = document.URL.split("/")[5];
id = id.split("#")[0]
var newLink = document.createElement("a");
var container = document.getElementsByClassName("download-link")[0];

newLink.setAttribute("target", "_blank");
newLink.setAttribute("href", "/roms/get-download.php?gid="+id+"&test=true");
newLink.setAttribute("title", "Download using the workaround script");
newLink.appendChild(document.createTextNode("Download using the workaround script (Right click -> Save link as..."));

container.insertBefore(newLink, container.childNodes[0]);
container.insertBefore(document.createElement("br"), newLink.nextSibling);
container.insertBefore(document.createElement("br"), newLink.nextSibling);
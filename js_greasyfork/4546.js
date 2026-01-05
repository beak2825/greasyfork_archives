// ==UserScript==
// @name       Better FileStream
// @namespace  http://mcimino.reaktix.com/
// @version    0.1.2
// @description  fixes some annoyances on FileStream
// @match      http*://members.filestream.me/*
// @copyright  2012+, You
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/4546/Better%20FileStream.user.js
// @updateURL https://update.greasyfork.org/scripts/4546/Better%20FileStream.meta.js
// ==/UserScript==

document.getElementById("fileCatTableScroll").style.maxHeight="2000px";

a = document.getElementsByClassName("infoDiv")[0];
a.style.height="12px";
a.style.overflow="hidden";
a.nextElementSibling.style.marginTop="70px";

document.getElementsByClassName("folderName")[0].style.marginTop="40px";
document.getElementsByClassName("button_container")[0].style.marginTop="40px";

document.getElementsByClassName("footerFS")[0].style.height="0px";

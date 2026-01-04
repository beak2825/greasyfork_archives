// ==UserScript==
// @name         Luogu Code Printer
// @namespace    http://tampermonkey.net/
// @version      v1.0
// @description  Add a "print" button to print the code in submissions
// @author       limesarine
// @match        *://www.luogu.com.cn/record/*
// @license      © 2024 Limesarine. All rights reserved.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503936/Luogu%20Code%20Printer.user.js
// @updateURL https://update.greasyfork.org/scripts/503936/Luogu%20Code%20Printer.meta.js
// ==/UserScript==
function insertLockIcon()
{
    let dialog=document.createElement("div");
    dialog.setAttribute("id","limesarine_lock_icon");
    dialog.style.position="fixed";
    dialog.style.bottom="5px";
    dialog.style.right="5px";
    dialog.style.width="45px";
    dialog.style.height="45px";
    dialog.style.background="#fff";
    dialog.style.borderRadius="8px";
    dialog.style.boxShadow="0 1px 6px rgba(0, 0, 0, .2)";
    dialog.style.borderColor="aliceblue";
    dialog.style.backgroundColor="white";
    dialog.style.fontSize="90%";
    dialog.style.padding="5px";
    dialog.style.justifyContent="center";
    dialog.style.align="center";
    dialog.innerHTML=`
<a unselectable="on" onclick="printCode();">
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 8H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h4v2h6v-2h4c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 8h-8v-2h8v2zm0-4H5v-2h12v2zm2-4c-.55 0-1 .45-1 1v1H4V9c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v1h1v2h-1v-1c0-.55-.45-1-1-1z" fill="#000"/>
  </svg>
</a>
`;
    document.body.appendChild(dialog);
}
function insertJS()
{
    let newScript=document.createElement("script");
    newScript.innerHTML=`
function printCode()
{
	let originalContents = document.body.innerHTML;
	let divToPrint = document.getElementsByClassName('card padding-default')[1];
	document.getElementsByTagName('h3')[0].parentElement.childNodes[0].style.display="none";
	document.getElementsByTagName('h3')[0].parentElement.childNodes[2].style.display="none";
	document.body.innerHTML = divToPrint.innerHTML;
	setTimeout(window.print,500);
}
`;
    document.head.appendChild(newScript);
}
(function() {
    'use strict';
    insertJS();
    insertLockIcon();
    // Your code here...
})();
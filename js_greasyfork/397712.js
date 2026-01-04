// ==UserScript==
// @name         FastGitCode
// @namespace    https://github.com/holleworldabc/browser-tools
// @version      1.0.4
// @description  fast show git ccode!
// @author       wm
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397712/FastGitCode.user.js
// @updateURL https://update.greasyfork.org/scripts/397712/FastGitCode.meta.js
// ==/UserScript==

(function () {
  const version = '1.0';
  const updateDate = '20200311';
  //-------------------------------------------
  const fileNav = document.getElementsByClassName('file-navigation')[0];
  const btn = document.createElement("span");
  btn.className = "btn btn-sm btn-blue";
  btn.innerText = "Source Graph";
  btn.style.marginLeft = '8px';
  btn.onclick = function () {
    const url = window.location.href;
    const sourceGraph = 'https://sourcegraph.com/'
    const last = url.split('://')[1];
    window.open(sourceGraph + last);
  }
  fileNav.appendChild(btn);
  //------------------------------------
  console.log("load FastGitCode ok!");
  console.log("version:" + version);
  console.log("lastUpdateDate:" + updateDate);
})()
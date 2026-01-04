// ==UserScript==
// @name        DownloadCV
// @namespace   Violentmonkey Scripts
// @match       https://app.cvmaker.ru/#/oplata/
// @grant       none
// @version     1.0
// @author      Pidor
// @description 24.01.2023, 16:03:40
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458862/DownloadCV.user.js
// @updateURL https://update.greasyfork.org/scripts/458862/DownloadCV.meta.js
// ==/UserScript==

(function() {
  'use strict';

function run(){
  let pdf_d = document.getElementById("app")
  let contentIn = pdf_d.getElementsByClassName("loaded")[0]

  let ifrm = document.getElementsByTagName('iframe')

  const newWin = window.open(ifrm[0].getAttribute('src'), 'cv', 'width=900, height=1200');

  newWin.onload=()=>{
    let div = newWin.document.createElement('div');
    let body = newWin.document.body;
    div.style.fontSize = '300px';
    body.insertBefore(div, body.firstChild);
  };
}

let btn = document.createElement("button")
btn.innerHTML = "Download Free"

document.body.appendChild(btn)

btn.addEventListener('click',run)

})();
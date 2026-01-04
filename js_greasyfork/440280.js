// ==UserScript==
// @name            Google Play APK Download
// @description     Uses Evozi's API to download APK on a Google Play page
// @author          Mattwmaster58 <mattwmaster58@gmail.com>
// @namespace       Mattwmaster58 Scripts
// @match           https://play.google.com/store/apps/details*
// @version         0.1
// @downloadURL https://update.greasyfork.org/scripts/440280/Google%20Play%20APK%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/440280/Google%20Play%20APK%20Download.meta.js
// ==/UserScript==

const downloadBtnSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" style=\"height: 70%;filter: invert(180);\" viewBox=\"0 0 512 512\"><!--! Font Awesome Pro 6.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d=\"M480 352h-133.5l-45.25 45.25C289.2 409.3 273.1 416 256 416s-33.16-6.656-45.25-18.75L165.5 352H32c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h448c17.67 0 32-14.33 32-32v-96C512 366.3 497.7 352 480 352zM432 456c-13.2 0-24-10.8-24-24c0-13.2 10.8-24 24-24s24 10.8 24 24C456 445.2 445.2 456 432 456zM233.4 374.6C239.6 380.9 247.8 384 256 384s16.38-3.125 22.62-9.375l128-128c12.49-12.5 12.49-32.75 0-45.25c-12.5-12.5-32.76-12.5-45.25 0L288 274.8V32c0-17.67-14.33-32-32-32C238.3 0 224 14.33 224 32v242.8L150.6 201.4c-12.49-12.5-32.75-12.5-45.25 0c-12.49 12.5-12.49 32.75 0 45.25L233.4 374.6z\"/></svg>";
const installBtn = document.querySelector("button.LkLjZd.ScJHi.HPiPcc.IfEcue");
const parent = installBtn.parentNode;
parent.style.display = "flex";

const downloadBtn = document.createElement("button");
downloadBtn.className = installBtn.className;
downloadBtn.innerHTML = downloadBtnSvg;
downloadBtn.style.display = 'flex';
downloadBtn.style.alignItems = 'center';
downloadBtn.style.marginLeft = '0.3em';
downloadBtn.onclick = openEvozi;
parent.insertBefore(downloadBtn, installBtn.nextSibling);

function openEvozi() {
  const appId = new URLSearchParams(location.search).get("id");
  if (!appId) {
    console.warn(`failed to parsed app ID: ${location.href}`);
  } else {
    window.open(`https://apps.evozi.com/apk-downloader/?id=${appId}`, '_blank').focus();
  }
}

// ==UserScript==
// @name         Misskey share button for AtCoder
// @namespace    http://kaminarinet.com/
// @version      0.4.1
// @description  Add misskey share button
// @author       KA37RI
// @match        https://atcoder.jp/users/*
// @match        https://atcoder.jp/contests/
// @match        https://atcoder.jp/contests/*
// @match        https://atcoder.jp/contests/*/submissions/*
// @match        https://atcoder.jp/users/*/history/share/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470028/Misskey%20share%20button%20for%20AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/470028/Misskey%20share%20button%20for%20AtCoder.meta.js
// ==/UserScript==

(function() {
  let a2a = document.getElementsByClassName("a2a_kit")[0];

  function makeicon(img_url, server_name) {
    let im = document.createElement("img");
    im.setAttribute("src", img_url);
    im.setAttribute("width", "20px");
    im.setAttribute("height", "20px");

    let lk = document.createElement("a");
    lk.appendChild(im);
    lk.addEventListener("click", function() {
      let mesURL = a2a.getAttribute("data-a2a-url");
      let mesContent = a2a.getAttribute("data-a2a-title");
      if(mesContent.slice(-1) != "\n") {
        mesContent += "\n";
      }
      let message = encodeURIComponent(mesContent + mesURL);
      let share = `https://${server_name}/share?text=${message}`;
      window.open(share);
    });

    a2a.appendChild(lk);
  }

  makeicon("https://media.misskeyusercontent.jp/misskey/webpublic-0c66b1ca-b8c0-4eaa-9827-47674f4a1580.png", "misskey.io");
  makeicon("https://s3.isk01.sakurastorage.jp/misskey-kyoupro/misskey/757ffa6b-17ea-4bb6-b390-9b586f454eff.webp", "misskey.kyoupro.com");

}());

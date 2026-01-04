// ==UserScript==
// @name         youtube別ウィンドウで開く
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  てきとー
// @author       つ
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453575/youtube%E5%88%A5%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E3%81%A7%E9%96%8B%E3%81%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453575/youtube%E5%88%A5%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E3%81%A7%E9%96%8B%E3%81%8F.meta.js
// ==/UserScript==
(function () {
  window.addEventListener("load", setTimeout(a, 2300));

  function a() {
    const b = document.createElement("input");
    b.type = 'button';
    b.id = 'aiueo';
    b.style.width = '3em';
    b.style.height = '3em';
    b.style.borderRadius = '50px';
    b.style.opacity = '48%';
    b.style.backgroundColor = "rgb(202, 192, 255)";
    document.getElementsByClassName("ytp-right-controls")[0].appendChild(b);
   
    b.onclick = function () {
    let naga = location.href.indexOf("?") + 3
    let ID = location.href.substr(naga,11);
        window.open("https://www.youtube.com/embed/"+ ID, "window_name","width=1024,height=576");

    };}



})
();
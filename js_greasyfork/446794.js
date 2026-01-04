// ==UserScript==
// @name         動画スクロール
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @license MIT
// @description  てきとー
// @author       つ
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446794/%E5%8B%95%E7%94%BB%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/446794/%E5%8B%95%E7%94%BB%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==
(function () {
  window.addEventListener("load", Tien1);
  window.addEventListener('resize', Tien2, );

  function Tien1() {
    setTimeout(a, 2300);
  };

  function Tien2() {
    setTimeout(C, 1000);
  };
  let ICHI = document.querySelector('[class="video-stream html5-main-video"]');
  let Px = window.getComputedStyle(ICHI);
  let Left = Px.getPropertyValue('left');
  let Top = Px.getPropertyValue('top');

  function a() {
    const douga = document.getElementById("player");
    const hai = douga.cloneNode(true);
    hai.id = 'player1';
    douga.after(hai);
    douga.style.position = 'fixed';
    douga.style.zIndex = '1000';
    douga.style.width = document.getElementById("player1").offsetWidth + "px";
    douga.style.height = document.getElementById("player1").offsetHeight + "px";
    const tai = document.querySelector('[class="title style-scope ytd-video-primary-info-renderer"]');
    tai.style.color = '#ffcccc';
    hai.querySelector('[id="player-container"]').remove();
    const kya = document.createElement("input");
    kya.type = 'button';
    kya.id = 'aiueo';
    kya.style.width = '3em';
    kya.style.height = '3em';
    kya.style.borderRadius = '50px';
    kya.style.opacity = '48%';
    kya.style.backgroundColor = "rgb(202, 192, 255)";
    kya.onclick = function () {
      const tai = document.querySelector('[class="title style-scope ytd-video-primary-info-renderer"]');
      let zi = document.getElementById("player");
      let Sty = window.getComputedStyle(zi);
      let Inde = Sty.getPropertyValue('z-index');
      if (Inde === '1000') {
        document.getElementById("player").style.position = 'static';
        document.getElementById("player").style.zIndex = '2';
        document.getElementById("player1").hidden = true;
        tai.style.color = '#ffffff';
      } else if (Inde === '2') {
        document.getElementById("player").style.position = 'fixed';
        document.getElementById("player").style.zIndex = '1000';
        document.getElementById("player1").hidden = false;
        tai.style.color = '#ffcccc';
      };
    };
    document.getElementsByClassName("ytp-right-controls")[0].appendChild(kya);
    if (document.querySelectorAll('[id="player1"]').length > 1) {
      document.getElementById("player1").remove();
    }
  }

  function C() {
    document.getElementById("player").querySelector('[id="container"]').style.width = document.getElementById("player1").offsetWidth + "px";
    document.getElementById("player").querySelector('[id="container"]').style.height = document.getElementById("player1").offsetHeight + "px";
    document.getElementById("player").style.width = document.getElementById("player1").offsetWidth + "px";
    document.getElementById("player").style.height = document.getElementById("player1").offsetHeight + "px";
  };
  document.getElementsByClassName("ytp-size-button ytp-button")[0].addEventListener('click', Hidden)
  document.getElementsByClassName("ytp-fullscreen-button ytp-button")[0].addEventListener('click', Hidden)
  document.addEventListener('keypress', ab);

  function ab(t) {
    if (t.code === 'KeyF') {
      Hidden();
    }
    if (t.code === 'KeyT') {
      Hidden();
    }
  };

  function Hidden() {
    if (document.getElementById("player-theater-container").offsetHeight === '0') {
      document.getElementById("player1").hidden = false;
    } else {
      document.getElementById("player1").hidden = true;
    };
  };
})
();
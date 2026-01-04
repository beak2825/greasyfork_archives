// ==UserScript==
// @name         flocabulary
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hello
// @match        https://www.flocabulary.com/subjects/?sso_success=True&backend=google-oauth2
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509260/flocabulary.user.js
// @updateURL https://update.greasyfork.org/scripts/509260/flocabulary.meta.js
// ==/UserScript==

javascript: (function () {
  var audio = new Audio(
    "https://dm0qx8t0i9gc9.cloudfront.net/previews/audio/BsTwCwBHBjzwub4i4/cartoon-laughter-nasty-idiot_z14zEH4__NWM.mp3"
  );
  audio.play();

  var audioTwo = new Audio(
    "https://dm0qx8t0i9gc9.cloudfront.net/previews/audio/HNxwBHlArk43bm5tw/audioblocks-chris-mason_lets-go-full-105bpm-cm_r3vpkU9Yj_NWM.mp3"
  );
  audioTwo.play();

  for (let i = 1; i < 10000; i++) {
    setTimeout(() => {
      var audio = new Audio(
        "https://dm0qx8t0i9gc9.cloudfront.net/previews/audio/BsTwCwBHBjzwub4i4/cartoon-laughter-nasty-idiot_z14zEH4__NWM.mp3"
      );
      audio.play();
      var container = document.createElement("div");
      container.style.position = "fixed";
      container.style.top = `${Math.floor(Math.random() * (100 - 0 + 1) + 0)}%`;
      container.style.left = `${Math.floor(
        Math.random() * (100 - 0 + 1) + 0
      )}%`;
      container.style.transform = "translate(-50%, -50%)";
      var window = document.createElement("div");
      window.style.background = "white";
      window.style.border = "2px solid black";
      window.style.width = "300px";
      window.style.height = "200px";
      window.style.display = "flex";
      window.style.flexDirection = "column";
      window.style.alignItems = "center";
      window.style.justifyContent = "center";
      var text = document.createElement("div");
      text.style.fontSize = "24px";
      text.style.fontWeight = "bold";
      text.style.marginBottom = "20px";
      text.innerText = "You are an idiot";
      var smiley = document.createElement("img");
      smiley.src = "http://youareanidiot.cc/images/idiot.png";
      smiley.style.width = "100px";
      smiley.style.height = "100px";
      var close = document.createElement("button");
      close.style.position = "absolute";
      close.style.top = "0";
      close.style.right = "0";
      close.style.background = "transparent";
      close.style.border = "none";
      close.style.fontSize = "20px";
      close.style.fontWeight = "bold";
      close.style.cursor = "pointer";
      close.innerText = "X";
      close.addEventListener("click", function () {
        document.body.removeChild(container);
      });
      window.appendChild(text);
      window.appendChild(smiley);
      window.appendChild(close);
      container.appendChild(window);
      document.body.appendChild(container);
    }, 300);
  }
})();
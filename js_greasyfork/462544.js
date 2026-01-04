// ==UserScript==
// @name         博山庐论坛插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  博山庐论坛插件，提供新功能预览，待稳定后或许会整合到正式版。
// @author       You
// @match        *://boshanlu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462544/%E5%8D%9A%E5%B1%B1%E5%BA%90%E8%AE%BA%E5%9D%9B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/462544/%E5%8D%9A%E5%B1%B1%E5%BA%90%E8%AE%BA%E5%9D%9B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
let initClockBlock = () => {
    // let url = document.querySelectorAll("li:has(.fa-glide) a")[0].href;
    let aList = document.querySelectorAll(".elecom_navigate a");
    let url = "";
    aList.forEach((v) => {
      if (v.href.indexOf("clock.letianjixian.com") > 0)
        // return v.href;
        url = v.href;
    });

    const searchParams = new URLSearchParams(url.split("?")[1]);
    const query = Object.fromEntries(searchParams.entries());
    const username = query.username;
    const uid = query.uid;
    const div = document.createElement("div");
    const button1 = document.createElement("button");
    button1.innerText = "禁用金句展示";
    const button2 = document.createElement("button");
    button2.innerText = "启用金句展示";
    const iframe = document.createElement("iframe");
    //   allow="camera *; microphone *"
    iframe.allow =
      "camera *; microphone * ; autoplay * ; encrypted-media * ; fullscreen * ; geolocation * ; gyroscope * ; magnetometer * ; midi * ; payment * ; picture-in-picture * ; speaker * ; sync-xhr * ; usb * ; vr * ; xr-spatial-tracking * ; xr *    ;";
    iframe.src = `https://clock.letianjixian.com/?username=${username}&uid=${uid}`;
    iframe.style.width = "100%";
    iframe.style.height = "800px";
    iframe.style.border = "none";
    iframe.scrolling = "no";
    iframe.style.display = localStorage.getItem("clockDisplay") || "none";
    button1.onclick = () => {
      localStorage.setItem("clockDisplay", "none");
      iframe.style.display = "none";
    };
    button2.onclick = () => {
      localStorage.setItem("clockDisplay", "block");
      iframe.style.display = "block";
    };
    button1.style.color = "black";
    button2.style.color = "black";
    button1.style.backgroundColor = "aliceblue";
    button2.style.backgroundColor = "aliceblue";
    button1.style.borderRadius = "5px";
    button2.style.borderRadius = "5px";
    button1.style.fontSize = "15px";
    button2.style.fontSize = "15px";
    button1.style.margin = "5px 5px 5px 5px";
    button2.style.margin = "5px 5px 5px 5px";
    div.appendChild(button1);
    div.appendChild(button2);
    div.appendChild(iframe);
    const father = document.querySelector("#diy2");

    let maydiv = document.querySelector("#frameIyI7ir");
    if (maydiv) {
      const parentElement = maydiv.parentElement;
      parentElement.insertBefore(div, maydiv);
    } else {
      father.appendChild(div);
    }

  };
  initClockBlock();
  


})();
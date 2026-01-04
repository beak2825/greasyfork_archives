// ==UserScript==
// @name         Pixiv Download
// @namespace    http://tampermonkey.net/
// @version      2.4.4
// @description  Pixiv下载脚本器，批量下载图片
// @author       kanostar
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        GM_cookie
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/533224/Pixiv%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/533224/Pixiv%20Download.meta.js
// ==/UserScript==
let session = "";

(function () {
    'use strict';
    GM_cookie('list', {
        domain: "pixiv.net",
        name: "PHPSESSID"
    }, function (result) {
        for (let cookie of result) {
            session = "PHPSESSID=" + cookie.value;
        }
    });

})();

let isArtwork = false;
let isUser = false;
let isCreate = false;
let uri = "";

function create_window() {
    if (isCreate){
        return;
    }
    isCreate = true;
    // 创建悬浮窗元素
    let floatingWindow = document.createElement('div');

    floatingWindow.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 40 40" enable-background="new 0 0 40 40" xml:space="preserve">  <image id="image0" width="40" height="40" x="0" y="0" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAAAIGNIUk0AAHomAACAhAAA+gAAAIDo AAB1MAAA6mAAADqYAAAXcJy6UTwAAAHCUExURQAAAACq/wCV+gCW+ACW+QCX+gCW+QCX+QCU9gCW +QCW+gCW/gCW+QCW+QCV+QCX+QCq/wCX+gB//wCL5wCW+QCZ/wCW+QB//wCW+ACX+gSZ+iio+0i0 +1m8/F29/FK5/Diu+w+d+iGk+3bH/L/l/vb7//////7+/8/s/n7K/Byi+0az+7nj/vX7/7Xh/nvJ /FS5/ECx+0Gy+1q8/I3Q/dzx/vn9/5HS/Q6d+jOs+8Lm/t3x/mTA/Ayc+gGY+lO5/OLz/iyp+wma +o7R/fz+/+Pz/gia+hOf+sbo/u34/y2p+yWm+9Hs/vj8/9nw/hCe+trw/j+x++74/87r/la6/D6w +43R/ff8/8/r/hCd+juv+77l/hKe+kGx+/7///H5/x+k+2XA/GO//J3X/b7k/iqo+6DY/X/L/Aqb +gSY+szq/hSf+rzk/kKy+5DS/RWg+tfv/gKY+gGX+qvd/Um1+4/R/YnP/ef1/yCk+yGl+7fi/v3+ /8Tn/oDL/U23/Aub+iSm+1i7/Kjc/fr9/+n2/1e7/Oj2/5XU/d/y/nnI/Cam+4jP/bvj/rTh/prW /W/E/DKr+0Sz+97x/gOY+t7y/g2c+jDHJG0AAAAZdFJOUwADOnyw1vD9H4nmFpj6XO4GmwYLugrm Av1vbA9iAAAAAWJLR0QmWgiYtQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAAAd0SU1FB+gLAQoNHSKQ 8nkAAAIXSURBVDjLlZV3WxQxEMbDljuWWw5BuCMWsMCAoliwnFhAQbArWFCEAxXsopy9UywUFQt+ X+dms7vZI7vP+f6TSfb3zGSSySxjsko03TBj8XjMNHSthIWp1CrjksqsUiWWsMt5gcrtxEouWcEV qkgWYKsqeYgqq2RudTUPVXWN5C+CQ9L3GYi7Zu269XX1GzZK0b08/LVNmxsagdTUvGWruyoySnj5 tmxrgu2tO3bu2t22Zy/Avv0ZkbtzSrbADrQDHDx0WMyOdHTi9Kgzsek+nHM+1tUNcLxH2mzvCYCT p5yTz9+RRebpM3AW4Fwg3fMX0KcT3cI6oPvt64eLlwpBfhmTukJWKs00ymIArl4bXAHy6wCNQ2Rp TM8Pw9mRUa4Ab6DLm2TpzKDx1hhXgeMI3ibLYCaNQ3eU4F0E28kyWcxbVYD3sgD3yYqx2ijwAXp8 SFYti0eBjxCcICseHXoCwRYR2owAH48APJkUyRjhYO4pQPYZF8ejh4KTzzHwCzHRnSt0wZevfO71 G+S6cmKmiaIQILx99/7DeG/Px6npmVmAT5/db1gUoswc8MvXTvA0N5/x3Ft+4bp7XKhbnPnW8P3H 0s+cvw0qXO8pKM7RlR14XOGgeFzuc/0F8PuPEkwGGkAbpgnLfxWc1wBYVb6lZBZQUwpOaimspsgm hT6LbHvFN9L/aM3U7FMylgpp9nml5d9HOvDpHxRrq/yhSCA/AAAAJXRFWHRkYXRlOmNyZWF0ZQAy MDI0LTExLTAxVDEwOjEzOjI5KzAwOjAwLNsYZgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyNC0xMS0w MVQxMDoxMzoyOSswMDowMF2GoNoAAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjQtMTEtMDFUMTA6 MTM6MjkrMDA6MDAKk4EFAAAAAElFTkSuQmCC"/>
</svg>`
    floatingWindow.style.cssText = `
  position: fixed;
  bottom: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position:center;
  z-index: 9999;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
`;
    // 添加内容到悬浮窗
    // floatingWindow.innerText = document.documentURI
    let offsetX = 0;
    let offsetY = 0;
    let isMouseDown = false;

    floatingWindow.addEventListener("dblclick", function () {

        let cookie = "/-cookie/" + session.replaceAll(" ", "").trim() + "/";

        const baseUri = uri.split("/").pop();
        const prefix = isArtwork ? "-a" : "-w";
        const url = `pixivdownload://${prefix}/${baseUri}${cookie}-sn/-ef`;

        window.open(url);

    })

    floatingWindow.addEventListener("mousedown", function (e) {
        e.preventDefault();
        offsetX = e.clientX - floatingWindow.getBoundingClientRect().left;
        offsetY = e.clientY - floatingWindow.getBoundingClientRect().top;
        isMouseDown = true;
    });

    document.addEventListener("mousemove", function (e) {
        if (!isMouseDown) return;
        e.preventDefault();
        let x = e.clientX - offsetX;
        x = Math.max(x, 0);
        x = Math.min(x, document.documentElement.clientWidth - floatingWindow.offsetWidth);
        let y = e.clientY - offsetY;
        y = Math.max(y, 0);
        y = Math.min(y, document.documentElement.clientHeight - floatingWindow.offsetHeight);
        floatingWindow.style.left = x + "px";
        floatingWindow.style.top = y + "px";
    });

    document.addEventListener("mouseup", function () {
        isMouseDown = false;
    });
    // 将悬浮窗添加到页面中
    document.body.appendChild(floatingWindow);
}

setInterval(handleRouteChange, 500)
function handleRouteChange() {
    uri = document.URL

    if (uri.includes("www.pixiv.net/artworks/")) {
        isUser = false;
        isArtwork = true;
        create_window();
    }

    if (uri.includes("www.pixiv.net/users/")) {
        isArtwork = false;
        isUser = true;
        create_window();
    }
}
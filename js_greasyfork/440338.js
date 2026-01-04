// ==UserScript==
// @name         更改通行码为绿码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更改校园通行码为绿码
// @author       小羊人
// @match        http://ykt.fzu.edu.cn:9001/ThirdWeb/PayCode
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440338/%E6%9B%B4%E6%94%B9%E9%80%9A%E8%A1%8C%E7%A0%81%E4%B8%BA%E7%BB%BF%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/440338/%E6%9B%B4%E6%94%B9%E9%80%9A%E8%A1%8C%E7%A0%81%E4%B8%BA%E7%BB%BF%E7%A0%81.meta.js
// ==/UserScript==
setInterval(document.getElementById("currentTime").setAttribute('style','cfont-size: large; margin: 10px; color: rgb(29, 149, 63);'),50)

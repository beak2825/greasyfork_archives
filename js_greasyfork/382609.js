// ==UserScript==
// @name         gbf 弹窗定位补全
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://game.granbluefantasy.jp/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382609/gbf%20%E5%BC%B9%E7%AA%97%E5%AE%9A%E4%BD%8D%E8%A1%A5%E5%85%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/382609/gbf%20%E5%BC%B9%E7%AA%97%E5%AE%9A%E4%BD%8D%E8%A1%A5%E5%85%A8.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function() {
    'use strict';

    // Your code here...
    if (document.body.className !== "jssdk") {return;}
    const style = document.createElement("style");
    style.innerHTML = `
.element-1 {
display: flex;
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}

.element-2 {
overflow-x: hidden;
}
`;

    const element1 = document.createElement("div");
    element1.className = "element-1";

    const element2 = document.createElement("div");
    element2.className = "element-2";

    document.querySelector("head").appendChild(style);
    document.body.appendChild(element1);
    element1.appendChild(element2);
    element2.appendChild(document.querySelector("#mobage-game-container"));

})();
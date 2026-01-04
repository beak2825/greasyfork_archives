// ==UserScript==
// @name         随机二次元壁纸
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  一个按了就能随机获得二次元壁纸的按钮
// @author       dzdfox
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544487/%E9%9A%8F%E6%9C%BA%E4%BA%8C%E6%AC%A1%E5%85%83%E5%A3%81%E7%BA%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/544487/%E9%9A%8F%E6%9C%BA%E4%BA%8C%E6%AC%A1%E5%85%83%E5%A3%81%E7%BA%B8.meta.js
// ==/UserScript==

(function() {
const jumpBtn = document.createElement("Button");
    jumpBtn.innerText=("获得壁纸");
    jumpBtn.id="jump-button";
jumpBtn.style = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    padding: 10px 15px;
    background: #3b84f9ff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    z-index: 9999;
`;

jumpBtn.addEventListener("click", function(){
    window.open("https://www.dmoe.cc/random.php", "_blank");
});
document.body.appendChild(jumpBtn)


})();
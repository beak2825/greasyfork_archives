// ==UserScript==
// @name 二维码
// @namespace what.ever
// @description 点击油猴图标里的菜单选项生成二维码
// @match *://*/*
// @grant        GM_registerMenuCommand
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/390339/%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/390339/%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==
GM_registerMenuCommand('生成二维码', genQRCode);
function genQRCode(){
    var url = 'https://cli.im/api/qrcode/code?text='+location.href;
    window.open(url);
}
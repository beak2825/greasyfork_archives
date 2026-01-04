// ==UserScript==
// @name        VPS Smartpro Script - vps.com.vn
// @namespace   Violentmonkey Scripts
// @match       https://smartpro.vps.com.vn/v1/
// @grant       none
// @version     1.1
// @author      Hiraism
// @description 15:49:24, 31/5/2021
// @downloadURL https://update.greasyfork.org/scripts/426904/VPS%20Smartpro%20Script%20-%20vpscomvn.user.js
// @updateURL https://update.greasyfork.org/scripts/426904/VPS%20Smartpro%20Script%20-%20vpscomvn.meta.js
// ==/UserScript==

function setPin() {
    global.AccountPinCD = "" // Nhập mật khẩu tại đây
}

// Canh trái số hợp đồng
function setTextAlign() {
  document.getElementById("right_price").style.textAlign = "left"
  document.getElementById("sohopdong").style.textAlign = "left"
}

console.stdlog = console.log.bind(console);
console.log = function(){
  console.stdlog.apply(console, arguments);
  if(arguments[0] === "Reg Success!") {
    setPin();
    setTextAlign();
    shownotification('VPS Smartpro Script', "Khởi tạo thành công", 'info');
  }
}

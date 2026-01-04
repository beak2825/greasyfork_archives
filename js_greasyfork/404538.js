// ==UserScript==
// @name         贪婪洞窟H5-解放双手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://1106965026.urlshare.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404538/%E8%B4%AA%E5%A9%AA%E6%B4%9E%E7%AA%9FH5-%E8%A7%A3%E6%94%BE%E5%8F%8C%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/404538/%E8%B4%AA%E5%A9%AA%E6%B4%9E%E7%AA%9FH5-%E8%A7%A3%E6%94%BE%E5%8F%8C%E6%89%8B.meta.js
// ==/UserScript==

(function() {


window.setInterval(showalert, 1000);
function showalert()
{
AutoGameManager.start();
 if (ShengWuChoosePanel.instance.visible == true) {
      ShengWuChoosePanel.instance.setVisible(false)
    }
}

window.setInterval(showalert2, 1200);
function showalert2()
{
	if (Monster.isBossDeadAct)setTimeout("Msg.CG_CAVE_LEAVE()",8000);
else Msg.CG_SHOP_SELL_QUICK();
}

window.setInterval(showalert3, 1800);
function showalert3()
{
if(UIManager.isCity)setTimeout("Msg.CG_CAVE_ENTER(431)",15000);
}
    // Your code here...
})();
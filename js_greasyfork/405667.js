// ==UserScript==
// @name         贪婪洞窟H5-熔炼模式
// @namespace    http://tampermonkey.net/
// @version      1.51
// @description  刷熔炼等级模式
// @author       You
// @match        *://1106965026.urlshare.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405667/%E8%B4%AA%E5%A9%AA%E6%B4%9E%E7%AA%9FH5-%E7%86%94%E7%82%BC%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/405667/%E8%B4%AA%E5%A9%AA%E6%B4%9E%E7%AA%9FH5-%E7%86%94%E7%82%BC%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {


window.setInterval(showalert, 200);
function showalert()
{
AutoTask.findBox2();
 if (ShengWuChoosePanel.instance.visible == true) {
      ShengWuChoosePanel.instance.setVisible(false)
    };
    if (MapManager.isNormalCave() && MapManager.mapLv == - 1) {
            AutoGameManager.start()
     }
}
window.setInterval(showalert2, 200);
function showalert2()
{
AutoTask.findTreasure();
  if (MapManager.isNormalCave() && MapManager.mapLv == - 2) {
             AutoTask.autoHunt()
      }
}
window.setInterval(showalert3, 1800);
function showalert3()
{
AutoTask.autoNext();
}
window.setInterval(showalert4, 800);
function showalert4()
{
	if (Monster.isBossDeadAct){
        setTimeout("Msg.CG_CAVE_LEAVE()",6000)
        }
}

window.setInterval(showalert5, 1800);
function showalert5()
{
if(UIManager.isCity)setTimeout("Msg.CG_CAVE_ENTER(431)",15000);else Msg.CG_SHOP_SELL_QUICK();
}
    // Your code here...
})();
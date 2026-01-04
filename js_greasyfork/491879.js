// ==UserScript==
// @name         U77驰援英雄自动
// @namespace    http://tampermonkey.net/
// @version      20240407
// @description  没得介绍!
// @author       没得名字
// @match        https://file.u77.games/zh-cn/*/Abqu-Heroes/PixelItem/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=u77.games
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491879/U77%E9%A9%B0%E6%8F%B4%E8%8B%B1%E9%9B%84%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/491879/U77%E9%A9%B0%E6%8F%B4%E8%8B%B1%E9%9B%84%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
//仓库最大保留数
var maxnum=player.inventoryCap-1;
//计时器毫秒数
var maxtimes1=300;
var maxtimes2=1500;

function autosell(){
    $("#inventory").find(".inventoryCount").each(
        function(e){
            if(this.innerHTML.match(/\d+/)>maxnum){
              $("#inventory").find("a")[e].click();
              console.log("自动卖出"+ $("#inventory").find("a")[e].innerText);
            }
        })
}

function automax(){
    player.皮革=player.皮革Cap;player.矿石=player.矿石Cap;player.木材=player.木材Cap;player.药草=player.药草Cap;
    player.money=99999999999;

}

//setInterval(autosell,maxtimes1)
setInterval(automax,maxtimes2)
})();
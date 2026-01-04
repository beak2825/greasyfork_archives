// ==UserScript==
// @name         咪咪貓貓三國志 小工具
// @match      https://game.sanguomeow.com/*
// @match      https://game.sanguomeow.com/layabrowser/laya.js
// @version      1.5.2
// @description	 咪咪貓貓三國志小工具
// @author       鯊鯊
// @icon         https://quick.sanguomeow.com//data/images/202208/202208301824457170408.png
// @grant        none
// @namespace    https://greasyfork.org/users/220876
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452057/%E5%92%AA%E5%92%AA%E8%B2%93%E8%B2%93%E4%B8%89%E5%9C%8B%E5%BF%97%20%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/452057/%E5%92%AA%E5%92%AA%E8%B2%93%E8%B2%93%E4%B8%89%E5%9C%8B%E5%BF%97%20%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

/*
  * v1.5.2：內政開啟角色格
  * v1.5.0：新增奪寶刷新不用錢
  * v1.4.1：修正世界Boss結束後繼續打的問題
  * v1.4.0：修正世界Boss不會自動打，造化加速放置
  * v1.3.5：修正世界Boss參數及錯誤
  * v1.3.4：修正世界Boss報錯
  * v1.3.4：新增關卡跳過Flag
  * v1.3.2：修正自動造化找不到物品報錯
  * v1.3.1：修正自動造化顯示數量問題
*/

/**
 * 2022/09/26：新增自動VIP等級2功能
 * 2022/09/27：新增自動打世界Boss功能
 * 2022/09/28：新增自動放入造化物品功能
 *
 */


var vipLevel = 2; // 需要的VIP等級
var checkTime = 1000; // 檢查刷新時間 單位 毫秒
var checkBossTime = 500; // 世界Boss檢查時間 單位 毫秒

(function() {
    console.log("Started! 咪咪貓貓三國志小工具");
    var game = document.getElementById("gameFrame");
    if (game){
        game = document.getElementById("gameFrame").contentWindow;
        setInterval(function(){ runChangeVip(game);}, checkTime);
        setInterval(function(){ runFightWBoss(game);}, checkBossTime);
        setInterval(function(){ runItemAutoMix(game);}, checkTime);
        setInterval(function(){ runFreeDaily(game);}, checkTime);
        setInterval(function(){ runInteriortaskNum(game);}, checkTime);
    }
})();

function runChangeVip(game) {
    var client = game.client
    if (!client) {
        return
    }

    var userVipLevel = client.data.query('role.vip');
    if (userVipLevel < 2 && userVipLevel){
        game.client.data.query('role.flags.78').val = 1;
        game.client.data.set('role.vip', vipLevel);
    }
}


var chooseteamId = 0; // 隊伍1
function runFightWBoss(game) {
    var client = game.client
    if (!client) {
        return
    }

    // 介面有沒有開啟
    var logic = client.logic
    if (!logic || !logic.guide.isUIOpen('newWorldboss')){
        return
    }


    var cd = game.client.data.query('cd.24');
    if (cd == null || cd.disable == 1) {
        return
    }

    var date = new Date();
    if ( date.getHours() >= 19 && date.getMinutes() >= 15) {
        cd = null;
        return
    }

    if (cd && cd.cd <= 0) {
        console.log("BOSS CD OK");
        game.client.data.set('balancebackui', 'worldboss');
        game.uimgr.close('newWorldboss', function(){
           game.client.io.send('hitwboss',1,chooseteamId);
       });
       game.client.data.set('nowTeamId', chooseteamId);
       setTimeout(game.client.logic.fight.skip(), 2000);
       setTimeout(function(){
          if (typeof game.ui_fightend_btn_ok_onclick === 'function') {
              game.ui_fightend_btn_ok_onclick();
          }
       }, 3000);
    }
}

// 自動放入造化第一格
// 使用方法：左邊格子放入碎片，接下來每秒都會自動放入上一次放入的物品
function runItemAutoMix(game) {
    var client = game.client
    if (!client) {
        return
    }

     // 介面有沒有開啟
    var logic = client.logic
    if (!logic || !logic.guide.isUIOpen('itemMix')){
        return
    }

    //自動關閉獎勵視窗
   // if (game.ui_msgaward_close_onclick) {
   //     game.ui_msgaward_close_onclick();
    //}

    if(game.laya.$('ui_itemMix_area_item1').icon.data() !== null){
        window.tempObj = game.laya.$('ui_itemMix_area_item1').icon.data();
    }
    else{
        setTimeout(function(){ putObj_1(game);}, 500);
    }
}
function putObj_1(game) {
    if(window.tempObj){
        var defID = window.tempObj.defId
        window.tempObj = game.client.logic.item.getItemByDefId(defID)
        if (window.tempObj === null) {
            return
        }
        game.laya.$('ui_itemMix_area_item1').icon.data(window.tempObj)
        game.laya.$('ui_itemMix_area_item1').icon.setCandrag(true);
    }
}


//奪寶刷新不用錢
function runFreeDaily(game) {
   var client = game.client
   if (!client) {
       return
   }

   if (!client.data.query('daily')) {
       return
   }

   var targetNum = client.data.query('daily').targetCount;
   if (targetNum <= 0) {
       return
   }

   var freeTime = client.data.query('daily').freeTime
   if (freeTime <= 0) {
       client.data.query('daily').freeTime=10;
   }
}

//內政開啟角色格
var resetInterior = 0;
function runInteriortaskNum(game) {
   var client = game.client
   if (!client) {
       return
   }

   if (!client.data.query('analysisTaskDataAll')) {
       return
   }

   // 介面有沒有開啟
   var logic = client.logic
   if (!logic || !logic.guide.isUIOpen('newInteriortask')){
       resetInterior = 0;
       return
   }
   if (!resetInterior) {
       game.ui_interiortask_reset(5);
       resetInterior = 1;
   }
}


// ==UserScript==
// @name        Sunflower Land Farmer
// @namespace   https://sunflower-land.com
// @match       https://sunflower-land.com/play/
// @grant       none
// @version     3.3
// @author      -
// @description Sunflower Land Farmer 自动收菜种菜(防封升级版)
// @license MIT
// 
// 本次更新：修复不能收菜
// 
// 防封版本启动
// 如果觉得好用，欢迎打赏 matic:0xB1e78f75C169E70761CE086e28a1dBEC0d01e27b
// 半自动脚本(自己购买好种子,然后选定)
// 
// 功能:
// 1. 自动种植(防封版升级:仅在土地为空的时候种植)
// 2. 连接错误自动重启
// 3. 重启后自动登录
// 4. 随机延时
// 5. 自动购买种子 （待更新，看心情）
// 6. 没种子自动停止 （待更新，看心情）
// 
// 注意:
// 1. 有宝箱的时候不要操作商店
// 2. 记住剩余种子消耗完成的时间,及时补充种子,
// 
// 不全自动的目的是,为了安全(懂自懂),仅提供分享学习使用,请勿大规模使用
// 代码中 land_nums 为土地坑的数量,有几个坑就写几个，注意按顺序从0开始
// 5个坑  [0,1,2,3,4]
// 10个坑 [0,1,2,3,4,5,6,7,8,9]
// 16个坑 [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
// 22个坑 [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
// @downloadURL https://update.greasyfork.org/scripts/443104/Sunflower%20Land%20Farmer.user.js
// @updateURL https://update.greasyfork.org/scripts/443104/Sunflower%20Land%20Farmer.meta.js
// ==/UserScript==


(async function () {
    console.log("[Script]", "Script loading.");
    var land_nums = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]; // 这里更改自己的土地数量,从0开始
    var land_time = [1, 3];  // 种菜延时，比如[1, 3] 代表1秒-3秒间随机
    var gift_delay = [1, 3]; // 盲盒延时，同上
  
    function sleep(min, max = min) {
      var sleep_time = parseInt(Math.random()*(max - min)*1000 + min*1000);
      return new Promise((resolve) => setTimeout(resolve, sleep_time));
    }
  
    async function land_task () {
        let step = 0;
        let clock = 0;
      
        // 
        var lands = document.getElementsByClassName("relative group");
        
        if(lands.length > 0){
          for (let x in land_nums) {
            land_nums[x];
            var land_hole = lands[land_nums[x]].getElementsByTagName('span');
            if(land_hole.length == 0){
              lands[land_nums[x]].childNodes[3].click();
              await sleep(land_time[0], land_time[1]);
            }else{
              try{
                if(lands[land_nums[x]].getElementsByTagName('span')[0].innerHTML == '-1'){
                  lands[land_nums[x]].childNodes[3].click();
                  await sleep(land_time[0], land_time[1]);
                }else if(lands[land_nums[x]].getElementsByTagName('span')[0].innerHTML == '+1'){
                  lands[land_nums[x]].childNodes[3].click();
                  await sleep(land_time[0], land_time[1]);
                }
              }catch(err) {
                
              }
            }
          }
        }
    }

    async function gift_task () {
        var gift = document.getElementsByClassName('modal-content');
        if(gift.length >0 && gift[0].getElementsByTagName('span').length >0 && gift[0].getElementsByTagName('span')[0].innerHTML == 'Woohoo! You found a reward'){
          try {
            document.getElementsByClassName('modal-content')[0].getElementsByTagName('img')[0].click();
          }
          catch(err) {
          }
          try {
            document.getElementsByClassName('modal-content')[0].getElementsByTagName('img')[1].click();
          }
          catch(err) {
          }
          try {
            document.getElementsByClassName('modal-content')[0].getElementsByTagName('img')[2].click();
          }
          catch(err) {
          }
          try {
            document.getElementsByClassName('modal-content')[0].getElementsByTagName('img')[3].click();
          }
          catch(err) {
          }
          try {
            await sleep(gift_delay[0], gift_delay[1]);
            var close_btn = document.getElementsByClassName('modal-content')[0].getElementsByTagName('button')[0]
            if(close_btn.innerHTML == 'Close') close_btn.click();
          }
          catch(err) {
          }
        }
    }
    async function rebot_task () {
      var rebot = document.getElementsByClassName('modal-content');
      for(let index = 0; index < rebot.length; index++){
            if(rebot[index].getElementsByTagName('span')[0].innerHTML == 'Something went wrong!') window.location.reload();
        }
    }
    async function autologin_task () {
      try {
        var login_btn = document.getElementsByTagName('button');
        for(let index = 0; index < login_btn.length; index++){
            if(login_btn[index].innerHTML == 'Lets farm!') login_btn[index].click();
        }
      }
      catch(err){}
       
    }
    setInterval(() => { rebot_task() }, 5*1000);
    setInterval(() => { autologin_task() }, 5*1000);
    setInterval(() => { land_task() }, 15*1000);
  
    setInterval(() => { gift_task() }, 2*1000);

    console.log("[Script]", "Script loaded.");
})();
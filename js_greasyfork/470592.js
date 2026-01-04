// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.huya.com/*
// @match        https://zt.huya.com/*
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant      GM_getResourceText
// @grant      GM_addStyle
// @license      GPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/470592/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/470592/New%20Userscript.meta.js
// ==/UserScript==

  // 日志
GM_addStyle(GM_getResourceText("CSS"));

  function log(msg) {
    console.info(`【原神直播活动抢码助手】${msg}`)
  }


var Xs=[680, 800, 910, 1025, 1140, 1250] //当button不可用时

var yuanshi=[1,2,3,4,5,6,7,8,9,10,11,12,13]


 if (!GM_getValue('gh_reward_progress')) {
    GM_setValue('gh_reward_progress', 1)
  }
if (!GM_getValue('gh_start_time')) {
    GM_setValue('gh_start_time', '00:59:59')
  }

  // 注册菜单
  GM_registerMenuCommand(`目标游戏：${GM_getValue('gh_game_id')}（点击修改）`, set_game_id)
  GM_registerMenuCommand(`设定里程碑进度：${GM_getValue('gh_reward_progress')}（点击修改）`, set_reward_progress)
  GM_registerMenuCommand(`设定抢码时间：${GM_getValue('gh_start_time')}（点击修改）`, set_start_time)


function set_game_id() {
    let temp = prompt('请输入游戏对应的ID，1为原神，2为崩铁', GM_getValue('gh_game_id'))
    if (temp == null) return
    if (parseInt(temp) > 0 || parseInt(temp) < 3) {
      GM_setValue('gh_game_id', temp)
      alert(GM_getValue('gh_game_id')+'设置成功，即将刷新页面使之生效')
      location.reload()
    } else {
      alert(GM_getValue('gh_game_id')+'格式错误，请重新输入')
    }
  }




function set_reward_progress() {
    let temp = prompt('请输入里程碑进度，输入范围原神为1~13，崩铁则为1~4，天数从小到大对应相关奖励', GM_getValue('gh_reward_progress'))
    if (temp == null) return
    if (parseInt(temp) > 0 || parseInt(temp) < 14) {
      GM_setValue('gh_reward_progress', temp)
      alert(GM_getValue('gh_reward_progress')+'设置成功，即将刷新页面使之生效')
      location.reload()
    } else {
      alert(GM_getValue('gh_reward_progress')+'格式错误，请重新输入')
    }
  }


function set_start_time() {
    let temp = prompt('请输入抢码时间，格式示例：01:59:59', GM_getValue('gh_start_time'))
    if (temp == null) return
    if (/^(\d{2}):(\d{2}):(\d{2})$/.test(temp)) {
      GM_setValue('gh_start_time', temp)
      alert('设置成功，即将刷新页面使之生效')
      location.reload()
    } else {
      alert('格式错误，请重新输入')
    }
  }





    // 变量初始化
    let level = parseInt(GM_getValue('gh_reward_progress'))
    let start_time = GM_getValue('gh_start_time').split(':')
    let hour = parseInt(start_time[0])
    let min = parseInt(start_time[1])
    let sec = parseInt(start_time[2])
    log(`助手计划于${parseInt(start_time[0])}点${parseInt(start_time[1])}分${parseInt(start_time[2])}秒开始领取第${level}档的里程碑奖励（如有误请自行通过菜单修改配置）`)


var currenttime
var delaytime = 304
function Delay() {currenttime+=delaytime;}
function HalfDelay() {currenttime+=delaytime/2}
function Reflash(){document.getElementsByClassName('reload J_reload')[1].click()}
function Ensure() {document.getElementsByTagName('button')[29].click()}
function Unsure() {document.getElementsByTagName('button')[29].click()}
function FirstTask(){document.getElementsByTagName('button')[24].click()}
function SecondTask(){document.getElementsByTagName('button')[25].click()}
function LastTask(){document.getElementsByTagName('button')[28].click()}
function YuanShi(){document.getElementsByTagName('button')[level+10].click()}
function Icon() {document.getElementsByClassName('img-w J_showImg')[1].click()}


function Reflash_x(){document.getElementsByClassName('reload J_reload')[1].click()}
function Ensure_x() {document.getElementsByTagName('button')[22].click()}
function Unsure_x() {document.getElementsByTagName('button')[22].click()}
function FirstTask_x(){document.getElementsByTagName('button')[15].click()}
function SecondTask_x(){document.getElementsByTagName('button')[16].click()}
function LastTask_x(){document.getElementsByTagName('button')[21].click()}
function XingQiong(){document.getElementsByTagName('button')[level+10].click()}


function start() {currenttime = 0;
setTimeout(Reflash,currenttime);Delay();
setTimeout(LastTask,currenttime);Delay();
setTimeout(Unsure,currenttime);HalfDelay();setTimeout(Ensure,currenttime);Delay();
setTimeout(YuanShi,currenttime);Delay();
setTimeout(Unsure,currenttime);HalfDelay();setTimeout(Ensure,currenttime);Delay();
                 }
function start_X() {currenttime = 0;
setTimeout(Reflash_x,currenttime);Delay();
setTimeout(LastTask_x,currenttime);Delay();
setTimeout(Unsure_x,currenttime);HalfDelay();setTimeout(Ensure_x,currenttime);Delay();
setTimeout(XingQiong,currenttime);Delay();
setTimeout(Unsure_x,currenttime);HalfDelay();setTimeout(Ensure_x,currenttime);Delay();
                 }


function setStartInterval() {setInterval(start,delaytime*6);}
function setStartInterval_x() {setInterval(start_X,delaytime*6);}

document.addEventListener("keydown",keydown);

function keydown(event)
{
   if (event.keyCode == 72)   //原神虎牙H
   {

       document.onclick=function(e)
       {
           var x=e.pageX;
           var y=e.pageY;
           log(x+":"+y);
       }

       var nowtime=new Date()
       var Timer=(hour*3600+min*60+sec+6)-(nowtime.getHours()*60*60+nowtime.getMinutes()*60+nowtime.getSeconds());
       setTimeout(setStartInterval,Timer*1000);
       alert(GM_getValue('gh_reward_progress')+"原神:hy>"+hour+":"+min+":"+sec)
   }

   if (event.keyCode == 68 )//原神斗鱼D
   {

       var d = document.querySelectorAll('.wmTaskV3GiftBtn-btn');
       function f(){setInterval(()=>{d[level-1].click()},70)}
       var d1=new Date()
       var time1=(hour*3600+min*60+sec)-(d1.getHours()*3600+d1.getSeconds()+d1.getMinutes()*60)
      setTimeout(f,time1*1000-350);
       alert(GM_getValue('gh_reward_progress')+"原神:dy>"+hour+":"+min+":"+sec)
   }

    if (event.keyCode == 77 )
   {

        document.onclick=function(e)//崩铁虎牙M
       {
           var x=e.pageX;
           var y=e.pageY;
           log(x+":"+y);
       }

       var nowtime1=new Date()
       var Timer1=(hour*3600+min*60+sec+6)-(nowtime1.getHours()*60*60+nowtime1.getMinutes()*60+nowtime1.getSeconds());
       setTimeout(setStartInterval_x,Timer1*1000);
       alert(GM_getValue('gh_reward_progress')+"崩铁:hy>"+hour+":"+min+":"+sec)
   }

    if (event.keyCode == 78 )//崩铁斗鱼N
   {

       var n = document.querySelectorAll('geetest_commit_tip');
       function f1(){setInterval(()=>{n.click()},5000)} // level+4
       var d3=new Date()
       var time3=(hour*3600+min*60+sec)-(d3.getHours()*3600+d3.getSeconds()+d3.getMinutes()*60)
      setTimeout(f1,time3*1000);
       alert(GM_getValue('gh_reward_progress')+"崩铁:dy>"+hour+":"+min+":"+sec)
   }
    if (event.keyCode == 76 )
    {

    }
}

//setTimeout(setStartInterval,Timer*1000); 主函数

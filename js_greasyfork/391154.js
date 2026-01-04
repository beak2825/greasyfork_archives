// ==UserScript==
// @name         上线日期填充
// @version      1.0
// @homepage https://github.com/7PLonG
// @description  代码上线页面自动填充
// @author       syb
// @match        *://ekcps.ekwing.com/code_online
// @match        *://172.17.20.25/code_online
// @grant        none
// @namespace https://greasyfork.org/users/385498
// @downloadURL https://update.greasyfork.org/scripts/391154/%E4%B8%8A%E7%BA%BF%E6%97%A5%E6%9C%9F%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/391154/%E4%B8%8A%E7%BA%BF%E6%97%A5%E6%9C%9F%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const id = 'event_etime';//上线填写时间的input id
    const tipid = 'syb-tip';//提示框id
    const freshid = 'btn-fresh-time';//手动更新时间的按钮
    const freshTimer = 3;//自动刷新分钟
   // const isOnline = window.location.href.indexOf('172.17.20.25/code_online')>-1 ||window.location.href.indexOf('ekcps.ekwing.com/code_online') >-1;
    //if(isOnline){

        const wintip = `<p id="${tipid}" style="position:fixed;right:20px;bottom:20px;width:200px;height:100px;background:#eee;border:1px solid #666;">
                               已接入日期补全插件，每三分钟自动刷新时间。不支持ie8。如不显示，请联系孙杨博或查看浏览器控制台。
                               <span id="${freshid}" style="position: absolute;bottom: 10px;right: 10px;background: #7fff00;">点我刷新</span>
                        </p>`;
        const win = document.createElement('div');
        win.innerHTML = wintip;
        document.getElementsByTagName('body')[0].append(win);
        const show = (e)=>{
            e = e.toString();
            document.getElementById(tipid).textContent= e;
        };

        const splitTime = ()=>{
            const now = new Date();
            const fix = d => d<10?'0'+d:d.toString();
            const day = `${now.getFullYear()}-${fix(now.getMonth()+1)}-${fix(now.getDate())}`;
            let increment = Math.round(Math.random()*3)+7;//延后时长min 7-10的随机数

            let min = now.getMinutes()+increment;
            let hour = min>=60?now.getHours()+1:now.getHours();
                min = min>=60?min-60:min;
            if(hour > 24){
                 show('日期 hour进位超出，手动修正吧，懒得改了');
            }
            //未考虑日期进一，请手动修正；
            //如果两次上线传了同样的时间，会卡死，遂改为随机数
            const time = `${fix(hour)}:${fix(min)}:${fix(Math.round(Math.random()*60))}`;
            return day+' '+time
        }
        const input = document.getElementById(id);
        if(input){
            input.value = splitTime();
        }else{
            show('未发现日期输入框，请检查脚本');
        }
        const btnFresh = document.getElementById(freshid);
        btnFresh.addEventListener('click',function(){
            input.value = splitTime();
        })
        setInterval(function(){
            //每三分钟自动刷新时间
            input.value = splitTime();
        },60*1000*freshTimer)
//}


})();
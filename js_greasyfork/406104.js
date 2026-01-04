// ==UserScript==
// @name         签到
// @namespace    https://www.yge.me/
// @version      0.1
// @description  签到!
// @author       Y.A.K.E
// @include			http://*
// @include			https://*
// @include			ftp://*
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/406104/%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/406104/%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //1,设置定时器.
    var localTimerId = setInterval(function(){

        //  当前定时器是否为主任务进程
        var isWorkTimer = false;



        //1.1读本地存储
        var testTimer = GM_getValue('localTestTimer');
        if (typeof(testTimer) != undefined){
            if (typeof(testTimer.timerId) != undefined){console.log(testTimer.timerId);}//存储的主任务的定时器Id
            if (typeof(testTimer.time) != undefined){console.log(testTimer.time);}//存储的主任务最后记录的unix时间
        }



        //1.2读当前unix时间戳
        var localDate = new Date();
        var unixTime = Math.round(localDate.getTime()/1000);



        //1.3 组合一个写入对象
        var inVal = {
            'timerId' : localTimerId,
            'time' : unixTime
        }

        //1.4
        //如果当前定时器Id和存储的不是同一个,表示自己不是主任务
        //超过20秒,可能主任务进程翻车了.需要顶上去

        //完全没有记录的情况
        if(typeof(testTimer) == undefined){
                GM_setValue('localTestTimer', inVal);
                isWorkTimer = true;
                console.log("原来是空,现在变成主进程:");
                console.log(inVal);
        }else{

            //有记录的情况

            if (testTimer.timerId == localTimerId){
                //工作timer进程
                GM_setValue('localTestTimer', inVal);
                isWorkTimer = true;

                console.log("是主进程:");
                console.log(inVal);

            }else if(unixTime - testTimer.time > 20 ){
                //非工作timer进程,但是检测工作主任务最后一次工作时间为20秒前,怀疑翻车了.

                GM_setValue('localTestTimer', inVal);
                isWorkTimer = true;

                console.log("非主进程,顶上去:");
                console.log(inVal);
            }else{
                //其他情况,只需要保持定时器工作即可,以备接盘
            }
        }


        //1.5
        //如果是工作进程
        if (isWorkTimer){
          //todo,调用签到函数
        }








    }, 5000);


    // Your code here...
})();
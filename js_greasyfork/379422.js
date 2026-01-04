// ==UserScript==
// @name         xin
// @namespace    http://tampermonkey.net/
// @version      11.3
// @description  try to take over the world!
// @author       You
// @match        http://ndpdk.cn/user*
// @match        http://macworksdc.com/user*
// @match        http://cs.8818s.cn/user/*
// @match        http://tjh.xmaylt.cc/user/*
// @match        http://jx.xmaylt.cc/user/*
// @match        http://3mf23v38w.cn/user/*
// @match        http://taomimi8.com/user/*
// @match        http://yc.xmaylt.cc/user/*
// @match        http://lvyuanfengdu.cn/user/*
// @match        http://qualityprice.cn/user/*
// @match        http://xtg.tenggang.net/user/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/379422/xin.user.js
// @updateURL https://update.greasyfork.org/scripts/379422/xin.meta.js
// ==/UserScript==

(function() {
    console.log(window.location.href.split('/'))
    //网址
    //            http://jx.xmaylt.cc/user/#/Task
    //            http://ndpdk.cn/user/#/Login
    //            http://cs.8818s.cn/user/#/login
    //            http://tjh.xmaylt.cc/user/#/Mission
    //            http://macworksdc.com/user/#/Login
    //            http://3mf23v38w.cn/user/#/Mission
    //已接任务
    //url: 'http://ndpdk.cn:8080/chaoshua/app/user/mission/getListByUserId',
    //url: 'http://cs.8818s.cn:8080/chaoshua/app/user/mission/getListByUserId',
    //url: 'http://tjh.xmaylt.cc:8080/chaoshua/app/user/mission/getListByUserId',
    //url: 'http://macworksdc.com:8080/chaoshua/app/user/mission/getListByUserId',
    //url: 'http://3mf23v38w.cn:8080/chaoshua/app/user/mission/getListByUserId',




    var urls = window.location.href.split('/')[2]
    function setData(urls,tail,paramsData){
        var data = {
            config: {
                url: 'http://'+urls+':8080/chaoshua/app/user/'+tail+'',
                method: 'POST',
                token: getCookie('chaoshua_token')
            },
            params: paramsData
        }
        return data
    }

    var number = window.location.href.split('/')
    console.log(number[number.length-1])
    if(number[number.length-1]==='Task'){
        //1秒查一次有没有单
        setInterval(function(){
            //任务大厅
            //http://jx.xmaylt.cc:8080/chaoshua/app/user/task/getList
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "data": JSON.stringify(setData(urls,'task/getList',{"orderStyle":2,"taskStyle":0,"page":1,"size":10,"taskId":""}))
                },
                url: "http://47.106.197.91:3111/api/proxy",
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        var json = JSON.parse(text);
                        console.log(json.data)
                        console.log(json.data.pages)
                        if(json.data.pages != 0){

                            var taskIdData = json.data.data[0].taskId
                            window.location.replace(window.location.href.split('#')[0]+'#/TaskDetail/'+taskIdData);
                            setInterval(function(){window.location.reload()},1000)
                        }
                    }
                }
            });
        },3000)
    }


    if(!isNaN(number[number.length-1]) === true && number[number.length-2] === 'TaskDetail'){
        console.log(number[number.length-2])
        //抢单
        //http://jx.xmaylt.cc:8080/chaoshua/app/user/
        setInterval(function(){
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "data": JSON.stringify(setData(urls,'mission/submit/'+number[number.length-1]+'',null))
                },
                url: "http://47.106.197.91:3111/api/proxy",
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        var json = JSON.parse(text);
                        console.log(json.data.code === 0)
                        if(json.data.code === 0){
                            console.log(json.data.data)
                            let taskIdData = json.data.data.missionId
                            console.log(json.data.data.missionId)
                            //http://jx.xmaylt.cc/user/#/Taskauthentication/988180
                            //http://jx.xmaylt.cc/user/#/TaskDetail/207412
                            window.location.replace(window.location.href.split('#')[0]+'#/Taskauthentication/'+taskIdData);
                            setInterval(function(){window.location.reload()},1000)
                        }
                        //http://jx.xmaylt.cc/user/#/Taskauthentication/987964
                    }
                }
            });
        },2000)
        setInterval(function(){
            window.location.replace(window.location.href.split('#')[0]+'#/Task');
            location.reload();
        },5000)
    }










    //获取tocken
    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null
    }

})();

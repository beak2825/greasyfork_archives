// ==UserScript==
// @name         ssss
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  try to take over the world!
// @author       You
// @match        http://ndpdk.cn/user*
// @match        http://macworksdc.com/user*
// @match        http://cs.8818s.cn/user/*
// @match        http://tjh.xmaylt.cc/user/*
// @match        http://jx.xmaylt.cc/user/*
// @match        http://fjsmkj.cn/user/*
// @match        http://taomimi8.com/user/*
// @match        http://yc.xmaylt.cc/user/*
// @match        http://lvyuanfengdu.cn/user/*
// @match        http://qualityprice.cn/user/*
// @match        http://xtg.tenggang.net/user/*
// @match        http://xijiashangye.com/user/*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/385218/ssss.user.js
// @updateURL https://update.greasyfork.org/scripts/385218/ssss.meta.js
// ==/UserScript==

(function() {
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
    if(number[number.length-1]==='Task'){
        setInterval(function(){
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "data": JSON.stringify(setData(urls,'task/getList',{
                        'orderStyle': 2,
                        'page': 1,
                        'size': 10,
                        'taskId': "",
                        'taskStyleMode': '0',
                        'type': "iphone"
                    }))
                },
                url: "http://47.106.197.91:3111/api/proxy",
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        var json = JSON.parse(text);
                        if(json.data.pages === 1){
                            var taskIdData = json.data.data[0].taskId
                            GM_xmlhttpRequest({
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    "data": JSON.stringify(setData(urls,'mission/submit/'+taskIdData+'/iphone',null))
                                },
                                url: "http://47.106.197.91:3111/api/proxy",
                                onload: function(res) {
                                    if (res.status == 200) {
                                        var text = res.responseText;
                                        var json = JSON.parse(text);
                                        console.log(json.data.code === 0)
                                        if(json.data.code === 0){
                                            alert("来单子了哥")
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        },10000)
    }



        

    function getCookie(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]);
        return null
    }

})();

// ==UserScript==
// @name         获取淘宝推广链接（需要后台支持）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.alimama.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378016/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E6%8E%A8%E5%B9%BF%E9%93%BE%E6%8E%A5%EF%BC%88%E9%9C%80%E8%A6%81%E5%90%8E%E5%8F%B0%E6%94%AF%E6%8C%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/378016/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E6%8E%A8%E5%B9%BF%E9%93%BE%E6%8E%A5%EF%BC%88%E9%9C%80%E8%A6%81%E5%90%8E%E5%8F%B0%E6%94%AF%E6%8C%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getUrl(ws,itemId){
        var timespan=Date.parse(new Date())
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://pub.alimama.com/common/code/getAuctionCode.json?auctionid="+itemId+"&siteid=4134983&adzoneid=96305800254&scenes=1&t="+timespan,
            dataType: "json",
            contentType: "application/json",
            onload: function(response) {

                try{
                    JSON.parse(response.response)
                    ws.send(response.response)
                }
                catch(ex){
                    window.lyk_conn.close()
                    alert("被限制了！罢工")

                }
                finally{
                    window.lyk_working=false
                }


            }
        });
    }
    var inData=Date.parse(new Date())
    function checkReset(){
        var nowDate=Date.parse(new Date())

        if((nowDate-inData)>=1000*1000){
            console.log("该刷新页面了")
            resetPage()
        }
        else{
            window.setTimeout(function(){
                checkReset()
            },1000)
        }
    }
    function resetPage(){
        console.log("准备重连："+window.lyk_working)
        if(window.lyk_working){
            window.setTimeout(function(){
                resetPage()
            },1000)
        }
        else{
            document.querySelector('#newHeader > div > ul > li.active > a').click()
        }
    }


    window.setTimeout(function(){


        if(window.WebSocket){

            var ws = new WebSocket('ws://127.0.0.1:8001');
            window.lyk_conn=ws
            window.lyk_working=false
            checkReset()
            ws.onopen = function(e){
                console.log("连接服务器成功");


            }
            ws.onclose = function(e){
                console.log("服务器关闭,3秒后重连");
                window.setTimeout(function(){
                    resetPage()
                },3000)
            }
            ws.onerror = function(){
                console.log("连接出错,3秒后重连");
                window.setTimeout(function(){
                    resetPage()
                },3000)
            }

            ws.onmessage = function(e){
                window.lyk_working=true
                getUrl(ws,e.data)
            }
        }
        else{
            alert("不支持WebSocket")
        }

    },2000)
    // Your code here...
})();
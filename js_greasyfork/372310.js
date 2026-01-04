// ==UserScript==
// @name         b站直播自动抢辣条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       kooro@github
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372310/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/372310/b%E7%AB%99%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E6%8A%A2%E8%BE%A3%E6%9D%A1.meta.js
// ==/UserScript==


(function () {
    'use strict'
    var search,index,nowIndex;
    try {
         search=location.search;
     index = location.search.indexOf("index=")+6
     nowIndex = parseInt(search.substring(index,index.length))+1
     if(nowIndex==9){
         nowIndex = 0
     }
    if(isNaN(nowIndex))nowIndex=0;
    } catch (error) {
        nowIndex = 0

    }


    var LIVE_PLAYER_STATUS = window.localStorage["LIVE_PLAYER_STATUS"]
    if (LIVE_PLAYER_STATUS.indexOf("html5")>0) {
        window.localStorage["LIVE_PLAYER_STATUS"]=window.localStorage["LIVE_PLAYER_STATUS"].replace("html5",'flash')
    window.location.reload()
    }
    setInterval(function () {
        if ($(".main").length > 0) {
            $(".popup-content-ctnr button").click()
            $(".main").click()
            //$('.small-tv-icon-ctnr').click()
            setTimeout(function () {
                $(".popup-content-ctnr button").click()
                console.log('+1')
            }, 30)
        }
    }, 200)
    setInterval(function () {
        goTop(nowIndex)
    },10000)

   function goTop(index){
        $.get("https://api.live.bilibili.com/rankdb/v1/Rank2018/getTop?type=master_realtime_hour&type_id=areaid_realtime_hour",function(data){
            var list = data.data.list;// [{id: ,link:}]

            var href=location.href.replace(/\/\d+/,list[nowIndex].link)
            if(href.indexOf('index')>0){
                href = href.replace(/index=\d+/,'index='+nowIndex)
            }else{
                href+='?index='+nowIndex
            }
                href = href.replace(/index=\d+/,'index='+nowIndex)
                location.href = href

        })

    }

})();
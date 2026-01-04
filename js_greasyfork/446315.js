// ==UserScript==
// @name         Bili直播数据爬虫
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取多少人看过、弹幕信息，发送给后台
// @author       kakasearch
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @connect      localhost
// @connect      127.0.0.1
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446315/Bili%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E7%88%AC%E8%99%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/446315/Bili%E7%9B%B4%E6%92%AD%E6%95%B0%E6%8D%AE%E7%88%AC%E8%99%AB.meta.js
// ==/UserScript==

var api = "http://localhost:1775/submit"   
function submit(data){
GM_xmlhttpRequest({
            method: 'POST',
            url: api,
            data:JSON.stringify(data),
            headers: {
                'referer':location.href,
                'Content-type': 'application/json',
            },
            timeout: 5000,
            onload: function(xhr) {
                if (xhr.status == 200) {
                    var obj = JSON.parse(xhr.responseText) || {};
                    console.log(obj);
                    if(obj.code==0){
                     new ElegantAlertBox("上传成功")
                    }
                }
            },
            ontimeout: function() {
               //
            },
            onerror:function(){
             new ElegantAlertBox("上传失败，服务器错误！！")
            }
        });
}
function get(class_name){
let e = unsafeWindow.document.querySelector(class_name)
   if (e){
    return e.innerText
    }else{
    return "none"
    }
}

function get_data(){
// 爬取看过数，弹幕
    let watched = get(".watched-text")
    let chat_datas = []
    let title = get(".live-title")
    let up = get(".room-owner-username")

   let chats = unsafeWindow.document.querySelectorAll(".chat-item.danmaku-item")
   if(chats){
      for(let i of chats){
      chat_datas.push(i.getAttribute("data-danmaku"))
      }
   }
    return{
        "title":title,
        "up":up,
    "watched":watched,
        "chats":chat_datas
    }
}

function init(){
    new ElegantAlertBox("开始运行爬虫")
 let main = setInterval(function(){
      let data = get_data()

      if(data.title == "none"){
        //
      }else{
      console.log(data)
      submit(data)
      }
    },5*1000)

}




GM_registerMenuCommand(`【🕸开始爬取直播信息】`,init)










// ==UserScript==
// @name         查找Ta的网易云音乐评论
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  看看这首歌里有没有Ta的评论
// @author       kakasearch
// @match        https://music.163.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @license      GPL V3
// @downloadURL https://update.greasyfork.org/scripts/476613/%E6%9F%A5%E6%89%BETa%E7%9A%84%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/476613/%E6%9F%A5%E6%89%BETa%E7%9A%84%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //let user_name ="xxxxxxxxxxxxxxx" //弃用
    let song_id = /=(\d+)/.exec(window.location.href)[1]

    function get_data(init,user_id){
        // 检查是否有ta的评论，记录查找过的页码，下次直接跳过去
        let document = window.document.querySelector("#g_iframe").contentDocument
        let comments = document.querySelector("div.cmmts").innerHTML //评论区的元素
        let now_page = parseInt(document.querySelector(".zpgi.js-selected").innerText)
        let done_page = GM_getValue(song_id)

        if(comments.indexOf(user_id)!= -1){//算了，不验证用户昵称了，验证id就够了 || comments.indexOf(user_name)!= -1){
            alert("找到Ta的评论了，就在这一页！！")
            clearInterval(init)
        }else{
            if(now_page<done_page - 5){
                new ElegantAlertBox("跳转至中断页码:"+String(done_page));
                document.querySelector(".zpg8").click()//只能这样间隔几页的跳转过去
                return
            }else{
                new ElegantAlertBox("正在检查当期页面是否有Ta的评论");
                GM_setValue(song_id,now_page)
                document.querySelectorAll(".cnt >a").forEach(function(a){console.log(now_page,"页评论用户：",a.href)})
                document.querySelector(".znxt").click()
            }
        }
        if(document.querySelector(".znxt.js-disabled")){
            clearInterval(init)
            alert("查找结束")
        }
    }

    function main(){
        //检查当前页面是否加载完评论，加载完就调用get_data检查
        let user_id = GM_getValue("user_id")
        if(!user_id){
            user_id = prompt("请输入Ta的id")
            if(confirm("是否记住此id？")){
                GM_setValue("user_id",user_id)
            }
            if(!user_id){new ElegantAlertBox("无效输入,已终止程序");return}
        }
        if(!GM_getValue(song_id)){
            GM_setValue(song_id,parseInt(prompt("当前歌曲无查找记录，本次从哪页开始查找？",1)))
        }
        get_data()
        let init = setInterval(function(){
            let document = window.document.querySelector("#g_iframe").contentDocument
            if(document.querySelector(".itm")&& document.querySelector(".zpgi.js-selected")){
                get_data(init,user_id)
            }
        },3000+Math.random()*3000)
        }
    GM_registerMenuCommand(`【start】`,main)
})();
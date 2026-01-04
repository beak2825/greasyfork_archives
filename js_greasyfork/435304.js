// ==UserScript==
// @name         B站视频动态评论转发显示楼层数
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  叔叔我啊，能不能别老是改没有意义的css样式名啊我服了
// @author       Hanayo
// @match        https://www.bilibili.com/video*
// @match        https://t.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435304/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E8%BD%AC%E5%8F%91%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/435304/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8A%A8%E6%80%81%E8%AF%84%E8%AE%BA%E8%BD%AC%E5%8F%91%E6%98%BE%E7%A4%BA%E6%A5%BC%E5%B1%82%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const btn = `<button style='width: 30px;
    height: 130px;
    margin: 0 auto;
    line-height: 20px;
    background-color: #FB7299;
    position: fixed;
    top: 50%;
    right: 10px;
    color: white;
    font-size: 14px;
    border: 2px solid #FB7299;
    border-radius: 5px;
    cursor:pointer'
    id="getFloor">获取评论楼层</button>`
    const btn2 = `<button style='width: 30px;
    height: 130px;
    margin: 0 auto;
    line-height: 20px;
    background-color: #FB7299;
    position: fixed;
    top: 50%;
    right: 45px;
    color: white;
    font-size: 14px;
    border: 2px solid #FB7299;
    border-radius: 5px;
    cursor:pointer'
    id="getForwFloor">获取转发楼层</button>`
    const addBtn = $("body")
    $(addBtn).append(btn)
    $(addBtn).append(btn2)
    $("#getFloor").click(function(){
        getAll("comment")
    });
    $("#getForwFloor").click(function(){
        getAll("forw")
    });
    function getAll(type){
        let get = setInterval(()=>{
            const ele_height = document.getElementById("app").offsetHeight
            let loading
            if(type=="comment"){
                loading = $(".loading-state").text()
            }else{
                loading = $(".bili-dyn-forward__more").text().replace(/\s*/g,"");
            }
            $('html, body').animate({ scrollTop: $(document).height() }, 500)
            //window.scrollTo(0, ele_height);
            //scrollBy(0,ele_height);
            if(type=="comment"){
                if(loading){
                    if(type=="comment"){
                        $(window).scrollTop($('.bili-dyn-item__header').offset().top-50)
                        printFloor()
                        clearInterval(get)
                    }
                }
            }else{
                if(loading!="查看更多转发"){
                    $(window).scrollTop($('.bili-dyn-item__header').offset().top-50)
                    printForwFloor()
                    clearInterval(get)
                }
            }

        },1000)
        }
    function printFloor(){
        const length = $(".comment-list").children().length
        const list = $(".comment-list").children().each(function(index,element){
            const temp = `<span style='margin-left: 20px; color: #FB7299;'>${length-index}楼</span>`
            $(this).children(".con").children(".user").append(temp)
        })
        }
    function printForwFloor(){
        const length = $(".bili-dyn-forward__list").children().length
        const list = $(".bili-dyn-forward__list").children().each(function(index,element){
            const temp = `<span style='margin-left: 20px; color: #FB7299;'>${length-index}楼</span>`
            $(this).children(".bili-dyn-forward-item").children(".bili-dyn-forward-item__uname").append(temp)
        })
        }
})();
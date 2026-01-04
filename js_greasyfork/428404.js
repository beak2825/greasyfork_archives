// ==UserScript==
// @name         steam快速打开steamdb
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @namespace    akari
// @license      =P
// @description  在steam软件页面自动显示史低价格。在steam页面对着一个商品按ctrl+右键，即可快速打开该商品的steamdb链接，用于查看其价格曲线等。
// @author       Pikaqian
// @match        https://store.steampowered.com/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      https://steamdb.info/
// @downloadURL https://update.greasyfork.org/scripts/428404/steam%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80steamdb.user.js
// @updateURL https://update.greasyfork.org/scripts/428404/steam%E5%BF%AB%E9%80%9F%E6%89%93%E5%BC%80steamdb.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let styleE = document.createElement('style'),button,failbutton
    document.body.appendChild(styleE);
    styleE.textContent=`
    #price{
    color:#c1e0f7;
    font-size:20px;
    height:32px;
    width:40px;
    text-align:center;
    line-height:32px;
    opacity:.0;
    background: linear-gradient(to right, #3da2f1, #2561d1)
    }
    #button{
    height:16px;
    width:18px;
    border-bottom-right-radius:21px;
    border-top-right-radius:21px;
    color:#fff;
    padding:6px;
    opacity:.5;
    left:-22px;
    cursor:pointer;
    position:fixed;
    z-index:10;
    font-size:14px;
    top:38%;
    background:#fff;
    transition: 0.3s
    }
    #failbutton{
    height:30px;
    width:30px;
    background:#fff;
    left:10px;
    top:10px;
    position:fixed;
    z-index:1000
    }
    `
    var match_bundle=/bundle\/\d{3,7}\//
    var match_app=/app\/\d{3,7}\//
    var match_sub=/sub\/\d{3,7}\//
    var page_url=window.location.href,img
    function openUrl(type,img){
        var page_substr=img.match(/\d{3,7}/)
        var last_id=page_substr[0]
        window.open("https://steamdb.info/"+type+"/"+last_id+"/")
        event.preventDefault()
    }
    function getA(event){
        var elemA=event.target
        for(var o=0;o<4;o++){
            if(event.target.localName=="a"){
                img=event.target.href
                break
            }
            else{
                elemA=elemA.parentNode
                if(elemA.localName=="a"){
                    img=elemA.href
                    break
                }
            }
        }
    }
    function checkImg(){
        var elemA=event.target
        if(elemA.className=="similar_recent_apps_container"||elemA.id=="recommended_block"){
            return true
        }
        else{
            for(var u=0;u<5;u++){
                elemA=elemA.parentNode
                if(elemA.className=="similar_recent_apps_container"||elemA.id=="recommended_block"){
                    return true
                }
            }
            return false
        }
    }
    window.addEventListener('contextmenu',function (event){
        if(event.ctrlKey==true){
            if(page_url.match(match_bundle)!=null){
                openUrl("bundle",page_url)
            }
            else if(page_url.match(match_app)!=null){
                var count=0
                elemA=event.target
                if(checkImg()==true){
                    getA(event)
                    var page_substr=img.match(/\d{3,7}/)
                    var last_id=page_substr[0]
                    window.open("https://steamdb.info/app/"+last_id+"/")
                    event.preventDefault()
                }
                else{
                    openUrl("app",page_url)
                }
            }
            else if(page_url.match(match_sub)!=null){
                openUrl("sub",page_url)
            }
            else{
                var lala=event.target
                var elemA=event.target
                for(var i=0;i<10;i++){
                    if(event.target.localName=="a"){
                        img=event.target.href
                    }
                    else{
                        elemA=elemA.parentNode
                        if(elemA.localName=="a"){
                            img=elemA.href
                            break
                        }
                        else if(elemA.className=="wishlist_row"){
                            for(var m=0;m<elemA.parentNode.childNodes.length;m++){
                                if(elemA.childNodes[m].localName=="a"){
                                    img=elemA.childNodes[m].href
                                    var num=0
                                    break
                                }
                            }
                            if(num==0){
                                break
                            }
                        }
                    }
                }
                page_substr=img.match(/\d{3,7}/)
                last_id=page_substr[0]
                for(var k=0;k<img.split("/").length;k++){
                    if(img.split("/")[k]=="store.steampowered.com"){
                        var type=img.split("/")[k+1]
                        break
                    }
                }
                window.open("https://steamdb.info/"+type+"/"+last_id+"/")
                event.preventDefault()
            }
        }
    })
})();
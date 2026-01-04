
// ==UserScript==
// @name         魅族云相册加载脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  魅族云相册加载全选
// @author       You
// @match        https://photos.flyme.cn/*
// @icon         https://www.google.com/s2/favicons?domain=flyme.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431893/%E9%AD%85%E6%97%8F%E4%BA%91%E7%9B%B8%E5%86%8C%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/431893/%E9%AD%85%E6%97%8F%E4%BA%91%E7%9B%B8%E5%86%8C%E5%8A%A0%E8%BD%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
var btn = document.createElement("input");
var observer = new MutationObserver(put);
(function() {
    'use strict';
    let config = {
        childList: true,
        subtree: true
    };
    observer.observe(document,config);
    // Your code here...
})();
function put()
{
    let bar = document.querySelector("#root > div > div > div.mainContent > div > div.fillH.clearfix.album > div.rightWrap > div.r-hd");
    if(bar!= null ||bar!=undefined)
    {
        setTimeout(function () {
            console.log("ok")
            btn.type = "button";
            btn.style.height = "30px";
            btn.style.marginLeft = "150px";
            btn.style.marginTop = "20px";
            btn.style.border = "black solid 1px";
            btn.style.borderRadius = "10px";
            btn.style.backgroundColor = "green";
            btn.value = "加载全选";
            bar.append(btn);
            btn.onclick = download;
        }, 3000);
        observer.disconnect();
    }

}

function download(event){
    btn.style.backgroundColor = "red";
    loading();
}

function loading(){
    let loadArray = Array.from(document.getElementsByClassName("p-item loadmore"));
    let loadingImgs = Array.from(document.getElementsByClassName("icon i-selected"));
    btn.value = "加载中（"+loadingImgs.length+"张）";
    if(loadArray.length>0){
        loadArray[0].click();
        setTimeout(function(){
            loading();
        },1000)
    }else{
        btn.style.backgroundColor = "green";
        let imgs = Array.from(document.getElementsByClassName("icon i-selected"));
        let select = document.getElementsByClassName("a-item active");
        btn.value = "加载全选";
        if(select[0].children[0].children[1].children[1].textContent==imgs.length+"张"){
            imgs.forEach(item=>item.click());
        }
    }
}
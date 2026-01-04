// ==UserScript==
// @name         chaoxing-download
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  超星慕课资源下载提取
// @author       NL
// @match        https://*.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404869/chaoxing-download.user.js
// @updateURL https://update.greasyfork.org/scripts/404869/chaoxing-download.meta.js
// ==/UserScript==
let gotoDL = (e,url)=>{console.log(url)
                      window.open(url, "_blank");
                      }
function setDl(){
    //console.log('set dl was called')
var iframes = document.getElementById("iframe").contentWindow.document.querySelectorAll("iframe")
for(let i=0;i<iframes.length;i++){
    if(iframes[i].getAttribute("objectId")==null){
        continue
    }
    let url = "https://cs-ans.chaoxing.com/download/"+iframes[i].getAttribute("objectId")
    iframes[i].previousSibling.innerText = "________________________↓下载课件"
    iframes[i].previousSibling.style.overflow = "visible"
    iframes[i].previousSibling.style.width = "400px"
    iframes[i].previousSibling.addEventListener("click",(e)=>{gotoDL(e,url)},false)
}
}
(function() {
    'use strict';
    var old_text = "";
    console.log("download script running:");
    setTimeout(function (){
        old_text = document.getElementsByTagName("h1")[0].innerHTML;
        document.getElementsByTagName("h1")[0].innerHTML += "--->Waiting";
    },500);
    setTimeout(function(){

        var parent_node = document.getElementsByClassName("goback")[0]
        var bt = document.createElement("button")
        bt.innerHTML = "刷新下载"
        bt.onclick = function(){setDl()}
        parent_node.appendChild(bt)
    },500);
    setTimeout(function(){
        document.getElementsByTagName("h1")[0].innerHTML = old_text
        //setDl()       // DEBUG
        setInterval(setDl,2000)
    },1500);
    // Your code here...
})();
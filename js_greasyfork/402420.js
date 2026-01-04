// ==UserScript==
// @name         lexiangvideo
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  自动学习腾讯乐享的视频及文档
// @author       chalkit
// @match        https://lexiangla.com/classes/*/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402420/lexiangvideo.user.js
// @updateURL https://update.greasyfork.org/scripts/402420/lexiangvideo.meta.js
// ==/UserScript==

function GetUrlRelativePath(){
　　　　var url = document.location.toString();
　　　　var arrUrl = url.split("//");

　　　　var start = arrUrl[1].indexOf("/");
　　　　var relUrl = arrUrl[1].substring(start);//stop省略，截取从start开始到结尾的所有字符

　　　　if(relUrl.indexOf("?") != -1){
　　　　　　relUrl = relUrl.split("?")[0];
　　　　}
　　　　return relUrl;
　　}

var existCondition = setInterval(function() {
 if (document.getElementsByTagName('video').duration ){
    console.log("Exists!");
    clearInterval(existCondition);
     var learn_time = document.getElementsByTagName('video')[0].duration+1;
 //    learn_time = 999999
     console.log(learn_time);
                    var relUrl = GetUrlRelativePath()
                    axios.put("/api/v1" + relUrl + "/study", {
                        learn_time: Math.floor(learn_time),
                        is_finished: true
                    })
     alert("学习完成，请刷新页面或点击下一课");

 }
     if (document.getElementsByClassName("doc-preview block-container")) {
    console.log("Exists!");
    clearInterval(existCondition);
 var learn_time = 999999
     console.log(learn_time);
                    var relUrl = GetUrlRelativePath()
                    axios.put("/api/v1" + relUrl + "/study", {
                        learn_time: Math.floor(learn_time),
                        is_finished: true
                    })
     alert("学习完成，请刷新页面或点击下一课");

 }
}, 500); // check every 500ms
// ==UserScript==
// @name         2022年普通高中三科统编教材国家级示范培训
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description   autoplay
// @author       hui
// @match        https://wp.pep.com.cn/web/index.php?px/index/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/449043/2022%E5%B9%B4%E6%99%AE%E9%80%9A%E9%AB%98%E4%B8%AD%E4%B8%89%E7%A7%91%E7%BB%9F%E7%BC%96%E6%95%99%E6%9D%90%E5%9B%BD%E5%AE%B6%E7%BA%A7%E7%A4%BA%E8%8C%83%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/449043/2022%E5%B9%B4%E6%99%AE%E9%80%9A%E9%AB%98%E4%B8%AD%E4%B8%89%E7%A7%91%E7%BB%9F%E7%BC%96%E6%95%99%E6%9D%90%E5%9B%BD%E5%AE%B6%E7%BA%A7%E7%A4%BA%E8%8C%83%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

window.onload = function () {
    //let hre = location.href;
    var SeeTime=0
    var t=0
    var num=[]
    var list=[12,13,14,15,16,17,18,19,20,21,22,23]
    //if(hre.includes('https://wp.pep.com.cn/web/index.php?/px/index/')){
        var id=setInterval(function(){
            if(document.getElementsByClassName('btn_close_tzgg')[0]!=null){document.getElementsByClassName('btn_close_tzgg')[0].click()
            for (var i = 0; i < list.length; i++){
                num[i]=document.getElementsByTagName('a')[list[i]].href;
            }
            if(num[1]!=null){
                clearInterval(id);
                SeeVideo();
            };
            }
        }, 5 * 1000);//5秒检测一次
        function SeeVideo(){
            //var id2=setInterval(function() {
                 var win = window.open(num[t], "_blank");//打开新标签并等待关闭
                 //if(hre.includes('http://bjpep.gensee.com/webcast/site/vod/' || 'https://wp.pep.com.cn/web/index.php?/px/entryRoom/')){
                 //}
               // clearInterval(id2);
                 var timer = setInterval(function() {
                     if (win.closed) {
                         clearInterval(timer);
                         t++;
                         if(t<list.length){SeeVideo()}
                         if(t>list.length){alert("已完成7个专题，请手动点击【直播】专题")}
                     }
                 }, 10*1000);
             //},10*1000);
         //}
    }
}
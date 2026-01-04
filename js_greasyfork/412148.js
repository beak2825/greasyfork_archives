// ==UserScript==
// @name         职培云刷课_仅限章节课程-视频
// @namespace    http://hello.world.net/
// @version      3.4
// @description  自动播放课程从选中的视频到结尾的所有视频，并提示所需播放总时长。Ps：打开的浏览器需要是在职培云页面，并且不最小化，然后可以自行使用其他软件，就算遮住也不影响。
// @author       TBC
// @match        *://px.class.com.cn/player/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/412148/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%88%B7%E8%AF%BE_%E4%BB%85%E9%99%90%E7%AB%A0%E8%8A%82%E8%AF%BE%E7%A8%8B-%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412148/%E8%81%8C%E5%9F%B9%E4%BA%91%E5%88%B7%E8%AF%BE_%E4%BB%85%E9%99%90%E7%AB%A0%E8%8A%82%E8%AF%BE%E7%A8%8B-%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    var current
    var nav
    var watchstatus = 1
    var watchmode = 1 //查看模式：0代表未看完的方式，1代表已看完重刷一次，默认1即可刷所有视频，0只能刷未看完的视频。
    setTimeout(function() {
        var allwatchtime = 0
        nav = document.getElementsByClassName("list")[0]
        for(var i = 0; i < nav.getElementsByTagName("div").length; i++) {
            //定位到当前任务
            if(nav.getElementsByTagName("div")[i].className.indexOf("active")!=-1) {
                current = i;
                allwatchtime = 1;
            }
            if(allwatchtime > 0){
                try {
                    allwatchtime += parseInt(nav.getElementsByTagName("div")[i].getElementsByClassName("time")[0].innerHTML.split(":")[0]) + 1;
                }
                catch(err) {
                    continue;
                }
            }
        }
        alert("视频总共需要"+allwatchtime+"分钟，请确认开始！");//因为有些浏览器不允许自动播放
        nav.getElementsByTagName("div")[1].click();
    }, 6000);
    function watchover(){
        watchstatus = 0;
        var watchtime = parseInt(nav.getElementsByTagName("div")[current].getElementsByClassName("time")[0].innerHTML.split(":")[0]) + 1;
        nav.getElementsByTagName("div")[current].innerHTML += " 播放"+watchtime+"分钟";
        setTimeout(function() {
            while (nav.getElementsByTagName("div")[current+1].className.indexOf("section")==-1){
                current += 1;
            }
            current += 1;
            nav.getElementsByTagName("div")[current].click();
            watchstatus = 1
            //nav.getElementsByTagName("div")[current].innerHTML += "2.时"+watchtime+",状"+watchstatus;
        }, watchtime*60*1000);
    }
    function watchnew(){
        var test = nav.getElementsByTagName("div")[current].getElementsByClassName("status-done")[0];
        //判断是否播放完成
        if(typeof(test) != "undefined") {
            //console.log("视频已播放完成"+test);
            while (nav.getElementsByTagName("div")[current+1].className.indexOf("section")==-1){
                current += 1;
            }
            current += 1;
            nav.getElementsByTagName("div")[current].click();
        }
    }
    setInterval(function() {
        if (watchmode == 1){
            if (watchstatus == 1){
                watchover();
            }
        }
        else{
            watchnew();
        }
    },8000)
})();
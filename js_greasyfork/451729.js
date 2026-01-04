// ==UserScript==
// @name         enetedu
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  enetedu助手
// @author       torwe
// @license      AGPL License
// @match        *://onlinenew.enetedu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451729/enetedu.user.js
// @updateURL https://update.greasyfork.org/scripts/451729/enetedu.meta.js
// ==/UserScript==

(function() {
    var urlInfos = window.location.href.split("/");
    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    console.log("当前地址:"+urlTip)
    if (urlTip == "VideoPlayHFive" || urlTip == "VideoPlaySchoolHFive" || urlTip == "OnlineCourse" || urlTip == "VideoPlayChoiceHFive") { //视频页面
        console.log("当前任务: 看视频")
        watchVideo();
    } else if (urlTip == "course.aspx" ||  urlTip == "cme.aspx") { //课程列表页面
        console.log("当前任务: 课程播放列表")
        OnlineCourse();
    } else {
        console.log("当前任务: 未知")
    }

    function watchVideo(){
        setTimeout(function(){ //这是速率调整部分
            h5_player.setVolume(0.1);
            h5_player.setPlaybackRate(1);//设置速率
            if($("li.ellipsis:not(.class-green)",window.parent.document).length==0){alert("这个课程系列应该都听完了，请确认");}
        }, 5000);
        setInterval(function(){
            ClosePopup();
            if(h5_player.isEnded){
                if ($("li.ellipsis:not(.class-green)",window.parent.document).css("background-color")=="rgb(204, 197, 197)"){
                    console.log("第一个是灰色")
                    if($("li.ellipsis:not(.class-green)",window.parent.document).length==1){alert("刚刚最后一个课程已经听完");}
                    $("li.ellipsis:not(.class-green)",window.parent.document)[1].click();
                }else{
                    console.log("第一个不是灰色")
                    $("li.ellipsis:not(.class-green)",window.parent.document)[0].click();
                }
            }

        }, 3000);
        //
    }

    function OnlineCourse(){
        //这个代码段暂时什么也不做
        //addSkipbtn();
        function addSkipbtn(){//插入按钮快进视频按钮
            let alink=document.createElement("a");
            alink.innerHTML='快进视频';
            alink.onclick=function(event){

                //skipVideo();
            };
            document.getElementsByClassName("nav25")[0].children[0].append(alink);

        }
    }

})();
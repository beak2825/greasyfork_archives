// ==UserScript==
// @name         高校教师培训中心加速连续播放-DrS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  随手搞搞，能用则用。
// @author       DrS
// @license      AGPL License
// @match        https://onlinenew.enetedu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enetedu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444769/%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83%E5%8A%A0%E9%80%9F%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE-DrS.user.js
// @updateURL https://update.greasyfork.org/scripts/444769/%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83%E5%8A%A0%E9%80%9F%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE-DrS.meta.js
// ==/UserScript==

(function() {
    var urlInfos = window.location.href.split("/");

    var urlTip = urlInfos[urlInfos.length - 1].split("?")[0];
    console.log("当前地址:"+urlTip)
    if (urlTip == "VideoPlayHFive" || urlTip == "VideoPlaySchoolHFive" || urlTip == "ChoiceCourse" ) { //视频页面
        console.log("当前任务: 看视频")
        seeVideo();
    } else if (urlTip == "course.aspx" ||  urlTip == "cme.aspx") { //课程列表页面
        console.log("当前任务: 课程播放列表")
        OnlineCourse();
    } else {
        console.log("其它情况")
    }

    function randomNum(minNum, maxNum) {
        return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }

    function seeVideo(){

        let iframeA=document.querySelector("iframe").contentWindow

        window.onload = function() {
            let pppplay = setInterval(function() {
                let iframe = $(".classcenter-chapter1 iframe").contents();
                if (iframe.find(".layui-layer-content iframe").length > 0) {
                    setTimeout(function() {
                        iframe.find(".layui-layer-content iframe").contents().find("#questionid~div button").trigger("click");
                    }, randomNum(15, 40) * 100);
                } else {
                    iframe.find("video").trigger("play");
                }
                //console.log(new Date().getTime(), iframe.length, iframe.find(".layui-layer-content iframe").length);
            }, 5000);

            setTimeout(function() {
                let iframe = $(".classcenter-chapter1 iframe").contents();
                iframe.find("video").on("timeupdate", function() {
                    if (Math.ceil(this.currentTime) >= Math.ceil(this.duration)) {
                        let flag = false;
                        $(".classcenter-chapter2 ul li").each(function() {
                            if ($(this).css("background-color") !== "rgb(204, 197, 197)") {
                                if ($(this).find("span").text() !== "[100%]") {
                                    flag = true;
                                    $(this).trigger("click");
                                    return false;
                                }
                            }
                        });
                        if (!flag) {
                            clearInterval(pppplay);
                        }
                    }
                });
            }, 8000);
        }
        setTimeout(function(){ 
            if($("li.ellipsis:not(.class-green)",window.parent.document).length==0){alert("这个课程系列应该都听完了，请确认");}
        }, 5000);


        setInterval(function(){
            //let iframe = $(".classcenter-chapter1 iframe").contents();
            if (iframeA.h5_player._status!="playing"){
                //console.log(iframeA.h5_player);
                iframeA.h5_player._player.play();
                //iframeA.$('.prism-big-play-btn').click()
                //iframe.$('.prism-big-play-btn').click()
                iframeA.h5_player.setVolume(0.1);
                // 2. 确保iframe已加载完成，并且可以访问其内容

            }

            //ClosePopup();
            if(iframeA.h5_player.played){
                if ($("li.ellipsis:not(.class-green)",window.parent.document).css("background-color")=="rgb(204, 197, 197)"){
                    console.log("第一个是灰色")
                    if($("li.ellipsis:not(.class-green)",window.parent.document).length==1){alert("刚刚最后一个课程已经听完");}
                    $("li.ellipsis:not(.class-green)",window.parent.document)[1].click();
                }else{
                    console.log("第一个不是灰色")
                    $("li.ellipsis:not(.class-green)",window.parent.document)[0].click();
                }
            }

        }, 6000);
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
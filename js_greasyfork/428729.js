// ==UserScript==
// @name         B站小工具
// @namespace    https://greasyfork.org/zh-CN/scripts/428729
// @version      0.13
// @description  默认倍速播放，首页添加推荐模块
// @author       Hugo16
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require      http://code.jquery.com/jquery-1.7.2.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/428729/B%E7%AB%99%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/428729/B%E7%AB%99%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 初始化设置界面
    $("body").append(`
        <div class='settings-wrap'>
            <ul>
                <li class="set-yes">✅</li>
                <li class="set-no set-hide">❌</li>
                <li class="set-speed">⏩</li>
            </ul>
        </div>
        <div class='settings-wrap speed-wrap set-hide'>
            <ul>
                <li>2.0x</li>
                <li>1.5x</li>
                <li>1.25x</li>
                <li>1.0x</li>
                <li>0.75x</li>
                <li>0.5x</li>
            </ul>
        </div>
    `)

    function toggleRcmd(){
        $(".set-yes").toggleClass("set-hide");
        $(".set-no").toggleClass("set-hide");
        $(".rcmd-wrap").toggleClass("set-hide");
    }

    $(".set-yes").click(function(){
        toggleRcmd();
        window.localStorage.setItem('isShowRcmd',0);
    });

    $(".set-no").click(function(){
        toggleRcmd();
        window.localStorage.setItem('isShowRcmd',1);
        if($(".rcmd-wrap").length==0){
            recommend();
        }
    });

    $(".set-speed").click(function(){
        $(".speed-wrap").toggleClass("set-hide");
    });

    $(".speed-wrap ul li").click(
        function(){
            speed = $(this).index();
            window.localStorage.setItem('bspeed',speed);
            $(this).addClass("selected").siblings().removeClass("selected");
            $(".speed-wrap").toggleClass("set-hide");
        }
    )

    // 读取推荐设置
    var isShowRcmd = localStorage.getItem("isShowRcmd");
    if (isShowRcmd!=null&&isShowRcmd!="") {
        if (isShowRcmd == 1) {
            recommend();
        }
        else {
            $(".set-yes").toggleClass("set-hide");
            $(".set-no").toggleClass("set-hide");
        }
    }
    else {
        window.localStorage.setItem('isShowRcmd',1);
        isShowRcmd = 1;
        recommend();
    };
    // 读取播放速度
    var speed = localStorage.getItem("bspeed");
    if (speed!=null&&speed!="") {
        $(".speed-wrap ul li").eq(speed).toggleClass("selected");
    }
    else {
        window.localStorage.setItem('bspeed',3);
        speed = 3;
        $(".speed-wrap ul li").eq(speed).toggleClass("selected");
    }

    const callback = function(mutationsList) {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                if(mutation.attributeName == "src"){
                    setPlayRate();
                }
            }
        }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 播放速度
    let counts = 0;
    function setPlayRate(){
        var video = document.getElementsByTagName("video")[0];
        if(video == undefined){
            console.log("非视频页面");
            counts++;
            if(counts == 10){return};
            setTimeout(function(){
                setPlayRate();
            },1000)
            return;
        }
        else{
            observer.observe(video, { attributes: true});
            var temp = video.play;
            video.play = function(){
                let li = document.getElementsByClassName('bilibili-player-video-btn-speed-menu-list')[speed];
                li.click();
                temp.call(this);
                video.play = temp;
                //video.pause();
            }
        }
    }

    // 视频推荐
    function recommend(){
        if(window.location.href!="https://www.bilibili.com/"){
            return;
        }
        var spm_id_from = $(".rcmd-box .info-box a").eq(0)[0].href.split("=")[1];
        spm_id_from = spm_id_from.slice(0,spm_id_from.length-2);
        var csrf = document.cookie.indexOf('bili_jct=');
        csrf = document.cookie.slice(csrf + 9, csrf + 41);//9+32
        $(".first-screen .space-between").eq(0).after("<div class='rcmd-wrap'><div class='rcmd-1'><div id='waitrcmd' style='height:100px'>加载中。。。</div></div></div>");
        var isFirst = true;
        var xmlhttp;
        if (window.XMLHttpRequest)
        {
            xmlhttp=new XMLHttpRequest();
        }
        else
        {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange=function()
        {
            if(this.responseURL!="https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3"){
                return;
            }
            // 添加推荐列表
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                var item = JSON.parse(xmlhttp.responseText).data.item;
                for(let i =0;i<item.length;i++){
                    var fater = $(
                        `<div class="video-card-reco" style="width:280px;height:170px;margin-bottom:20px">
                             <div class="info-box">
                                 <a href="//www.bilibili.com/video/${item[i].bvid}?spm_id_from=${spm_id_from}.${(i%6)+1}" target="_blank">
                                 <img src="${item[i].pic}@400w_242h_1c.jpg" alt="${item[i].title}">
                                 <div class="info" style="padding-top:80px">
                                     <p title="${item[i].title}" class="title">${item[i].title}</p>
                                     <p class="up"><i class="bilifont bili-icon_xinxi_UPzhu"></i>${item[i].owner.name}</p>
                                     <p class="play">${(item[i].stat.view/1000).toFixed(1)}万播放</p>
                                 </div>
                                 </a>
                             </div>
                         </div>`
                    );
                    //稍后再看
                    var addLater = $(`
                        <div class="watch-later-video van-watchlater black">
                            <span class="wl-tips set-hide" style="left: -21px;">稍后再看</span>
                        </div>
                    `);
                    var delLater = $(`
                        <div class="watch-later-video van-watchlater black added set-hide">
                            <span class="wl-tips set-hide" style="left: -9px;">移除</span>
                        </div>
                    `)
                    addLater.hover(
                        function(){
                            $(this).children().toggleClass("set-hide");
                        }
                    );
                    addLater.click(
                        function(){
                            $(this).toggleClass("set-hide");
                            $(this).next().toggleClass("set-hide");
                            xmlhttp.open("POST","https://api.bilibili.com/x/v2/history/toview/add?aid="+item[i].id+"&csrf="+csrf,true);
                            xmlhttp.send();
                        }
                    );
                    delLater.hover(
                        function(){
                            $(this).children().toggleClass("set-hide");
                        }
                    );
                    delLater.click(
                        function(){
                            $(this).toggleClass("set-hide");
                            $(this).prev().toggleClass("set-hide");
                            xmlhttp.open("POST","https://api.bilibili.com/x/v2/history/toview/del?aid="+item[i].id+"&csrf="+csrf,true);
                            xmlhttp.send();
                        }
                    );
                    fater.append(addLater);
                    fater.append(delLater);
                    $(".rcmd-1").append(fater);
                }
                $("#waitrcmd").remove();

                // 第一次加载两页
                if(isFirst){
                    isFirst = false;
                    xmlhttp.open("GET","https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",true);
                    xmlhttp.send();
                }
            }
        }
        xmlhttp.open("GET","https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",true);
        xmlhttp.withCredentials = true;
        xmlhttp.send();

        // 滚动自动加载
        var timer = null;
        $(".rcmd-wrap").scroll(function(){
            clearTimeout(timer);
            timer = setTimeout(function(){
                var scrollHeight = document.querySelector(".rcmd-wrap").scrollHeight;
                var scrollTop = document.querySelector(".rcmd-wrap").scrollTop;
                var clientHeight = document.querySelector(".rcmd-wrap").clientHeight;
                if (scrollHeight - clientHeight <= (scrollTop+200)) {
                    xmlhttp.open("GET","https://api.bilibili.com/x/web-interface/index/top/rcmd?fresh_type=3",true);
                    xmlhttp.withCredentials = true;
                    xmlhttp.send();
                }
            },300);
        });
    }

    setPlayRate();
})();

GM_addStyle(`
.settings-wrap{
    height:auto;
    top:600px;
    cursor: pointer;
    padding:2px 0;
    position: fixed;
    z-index: 101;
    left: 0;
    margin-top: -36px;
    transition: all .3s;
    font-size: 12px;
    color: #505050;
    background: #fff;
    border: 1px solid #e7e7e7;
    box-shadow: 0 6px 10px 0 #e7e7e7;
    border-radius: 0 2px 2px 0;
    line-height: 14px;
}
.settings-wrap ul li{
    width: 26px;
    height: 26px;
    line-height: 26px;
    text-align: center;
}
.settings-wrap ul li:hover{
    background: rgba(0,0,0,.1);
}

.speed-wrap{
    height:auto;
    top:478px;
    left:35px !important;
    cursor: pointer;
    padding:2px 0;
}
.speed-wrap ul li{
    width: 39px;
    height: 30px;
    line-height: 30px;
    text-align: center;
}
.speed-wrap ul li:hover{
    background: rgba(0,0,0,.1);
}
.speed-wrap ul .selected{
    color:#fff;
    background-color: #73c9e5;
}

.set-hide{
    display:none;
}

.rcmd-wrap{
    width:100%;
    height:500px;
    overflow-y:scroll;
    margin-bottom:30px;
    padding:10px;
    border:1px solid #e7e7e7;
    border-radius:2px;
    background: #f4f4f4;
}
.rcmd-1{
    width:100%;
    display:flex;
    flex-wrap:wrap;
    justify-content:space-between
}
.rcmd-wrap::-webkit-scrollbar {
    /*滚动条整体样式*/
    width :10px;
    height:1px;
}
.rcmd-wrap::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius:10px;
    background:#ccc;
}
.rcmd-wrap::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow:inset 0 0 5px rgba(0,0,0,0.1);
    border-radius:10px;
    background:#ededed;
}
`)
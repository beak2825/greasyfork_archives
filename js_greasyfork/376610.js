// ==UserScript==
// @name         虎牙去除全屏礼物
// @namespace     none
// @version      1.0
// @description  none
// @author       none
// @include      *://*.huya.com/*
// @include      *://*.douyu.com/*
// @include      *://live.bilibili.com/*
// @include      *://live.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376610/%E8%99%8E%E7%89%99%E5%8E%BB%E9%99%A4%E5%85%A8%E5%B1%8F%E7%A4%BC%E7%89%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/376610/%E8%99%8E%E7%89%99%E5%8E%BB%E9%99%A4%E5%85%A8%E5%B1%8F%E7%A4%BC%E7%89%A9.meta.js
// ==/UserScript==


(function () {
    var domain = location.hostname;
    // huya.com
    if (['www.huya.com'].includes(domain)) {
        function videoType() {
            console.log("切换清晰度 -> ready");
            var time_num = 0;
            var t1 = setInterval(function () {
                time_num+=5
                $(".player-videotype-list li:nth-child(2)").click();
                if (time_num==240) {
                    clearInterval(t1);
                    console.log("结束");
                }
            }, 35);
        }

        let open_box = setInterval(function () {
            console.log("自动领取礼包 -> ready");
            let box = $(".player-box-stat3");
            if ($(box[5]).parent().children("p")[3].innerHTML == "") {
                box.each(function () {
                    if (this.style.visibility == "visible") {
                        this.click();
                        $("#player-box")[0].style.display = "none";
                    }
                });
            } else {
                console.log("自动领取礼包 -> over");
                clearInterval(open_box);
            }
        }, 30000);

        function loadStyle(css) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.appendChild(document.createTextNode(css));
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
        }
        let css = '#player-gift-wrap{display:none !important;height:0 !important}';//底部礼物
        css += '.player-wrap{height:100% !important}';//视频播放高度修正
        css += '#player-ctrl-wrap{bottom:0px !important }';//视频播放高度修正
        css += '#chatRoom{height:80% !important;}';//修正评论高度
        css += '#chatRoom > div{height:100% !important;}';//修正评论高度
        css += '.room-footer{display:none !important;}';//修正评论高度

        //鼠标移入移出显示播放器控制条
        function displayMode() {
            $("#J_playerMain").mouseover(function () {
                $(".mode-page-full #player-ctrl-wrap").show();
                $(".mode-page-full #player-wrap").css("height", "100%");
            }).mouseout(function () {
                $(".mode-page-full #player-ctrl-wrap").hide();
                $(".mode-page-full #player-wrap").css("height", "100%");
            });
        }
        loadStyle(css);
        displayMode();
        videoType();
    }

    // douyu.com
    if (['www.douyu.com'].includes(domain)) {
        console.log("检测到");
        let choose_time = setInterval(() => {
                if (document.getElementsByClassName("wfs-2a8e83").length > 0) {
                    clearInterval(choose_time);
                    //document.querySelector('div.wfs-2a8e83').click();
					document.querySelectorAll(".tipItem-898596 > ul > li")[0].click();
                    console.log("切换成功");
                }
            }, 1000);
    }
    // bilibili.com
    if (['live.bilibili.com'].includes(domain)) {

        function loadStyle(css) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.appendChild(document.createTextNode(css));
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
        }
        let css = '#gift-control-vm{display:none !important;height:0 !important}';//底部礼物
        css += '#web-player__bottom-bar__container{display:none !important;height:0 !important}';//底部礼物,最大化

        loadStyle(css);
    }
        // douyin.com
    if (['live.douyin.com'].includes(domain)) {

        function loadStyle(css) {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.appendChild(document.createTextNode(css));
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
        }
        let css = '.aqK_4_5U{display:none !important;height:0 !important}';//底部礼物
        css += '#aqK_4_5U{display:none !important;height:0 !important}';//底部礼物,最大化
        loadStyle(css);
    }
})();
// ==UserScript==
// @name         百度网盘视频倍速
// @namespace    http://www.skji.net/
// @version      1.1
// @description  自由调整百度网盘在线播放视频倍速
// @author       E6ther
// @homepage     https://github.com/E6ther/BaiduPan-VideoRate
// @supportURL   https://github.com/E6ther/BaiduPan-VideoRate/issues
// @match        *://pan.baidu.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399131/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/399131/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let platRateCSS = {
        "playRateMainCSS": {
            "background-color": "rgba(0, 70, 128, 0.1)",
            "border": "1px solid rgba(0, 70, 128, 0.12)",
            "width": "25px",
            "height": "25px",
            "border-radius": "13px",

            "transition": "all 0.2s",

            "position": "absolute",
            "top": "18%",
            "right": "2px",
            "z-index": "999999"
        },
        "playRateMainHCSS": {
            "background-color": "rgba(0, 70, 128, 0.5)",
            "border": "1px solid rgba(0, 70, 128, 0.52)",
            "width": "120px",
            "height": "100px",
            "border-radius": "13px",

            "transition": "all 0.1s",

            "position": "absolute",
            "top": "18%",
            "right": "2px",
            "z-index": "999999"
        },
        "playRateJiCSS": {
            "color": "rgba(0, 70, 128, 0.3)",
            "font-weight": "bold",
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%,-50%)"
        },
        "playRateContentCSS": {
            "position": "absolute",
            "top": "50%",
            "left": "50%",
            "transform": "translate(-50%,-50%)"
        },
        "playRateTextCSS": {
            "color": "rgba(255, 255, 255, 1)",
            "font-size": "16px",
            "text-align": "center",
            "-webkit-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none"

        },
        "playRateInputRangeCSS": {
            "width": "100px",
            "margin": "5px 0 0 0"
        },
        "playRateInputContentCSS": {
            "display": "flex",
            "align-items": "center",
            "justify-content": "space-between"
        },
        "playRateInputCSS": {
            "border": "1px solid rgba(0, 70, 128, 0.57)",
            "outline": "none",
            "border-radius": "3px",
            "padding": "1px",
            "width": "48px",
            "height": "23px",
            "box-sizing": "border-box"
        },
        "playRateInputInitCSS": {
            "border": "1px solid rgba(0, 70, 128, 0.57)",
            "background-color": "rgba(0, 70, 128, 0.1)",
            "color": "rgba(255, 255, 255, 1)",
            "border-radius": "3px",
            "padding": "0 7px",
            "height": "23px",
            "box-sizing": "border-box"
        }
    }


    let Rate = localStorage.getItem("Rate");  // 播放速度
    if (!Rate) {
        Rate = 1;
    }

    let RateLevel;


    let video_main = $(".video-main");

    let video_content_list;

    if (video_main[0]) {
        console.log("百度网盘视频倍速 - 已获取到视频");

        let myVar = setInterval(function () {
            if (window.videojs) {
                let video = window.videojs.getPlayers("video-player").html5player;

                if (video) {

                    videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(Rate);
                    clearInterval(myVar);
                    console.log("百度网盘视频倍速 - 调整倍速成功");

                    video_content_list = $(".video-list-thumbnail");

                    playRateControl();
                }
            }
        }, 1000);


    } else {
        console.log("百度网盘视频倍速 - 未获取到视频");
    }

    function playRateControl() {

        let body = $("body");
        let playRateMain = $("<div></div>");
        let playRateJi = $("<div>及</div>");
        let playRateContent = $("<div></div>");
        let palyRateText = $("<div></div>");
        let playRateInput = $("<input />");
        let playRateInputContent = $("<div></div>");
        let playRateInputRange = $("<input />");
        let playRateInputInit = $("<input />");

        SetCSS();

        SetAttr();

        AddElements();

        EventListen();

        ContolHide();

        judgeRate();

        function SetCSS() {
            playRateJi.css(platRateCSS.playRateJiCSS);
            playRateContent.css(platRateCSS.playRateContentCSS);
            palyRateText.css(platRateCSS.playRateTextCSS);
            playRateInputRange.css(platRateCSS.playRateInputRangeCSS);
            playRateInputContent.css(platRateCSS.playRateInputContentCSS)
            playRateInput.css(platRateCSS.playRateInputCSS);
            playRateInputInit.css(platRateCSS.playRateInputInitCSS);
        };

        function SetAttr() {
            playRateMain.attr({"id": "playRateMain"});
            playRateContent.attr({"id": "playRateContent"});
            playRateInput.attr({"type": "number", "step": 0.1, "min": 0, "max": 4, "value": Rate});
            playRateInputRange.attr({"type": "range", "step": 0.1, "min": 0.5, "max": 2.5, "value": Rate});
            playRateInputInit.attr({"type": "button"});

            palyRateText.html("请选择速率");
        };

        function AddElements() {
            playRateContent.append(palyRateText);
            playRateContent.append(playRateInputRange);
            playRateContent.append(playRateInputContent);
            playRateInputContent.append(playRateInput);
            playRateInputContent.append(playRateInputInit);

            playRateMain.append(playRateJi);
            playRateMain.append(playRateContent);
            body.append(playRateMain);
        }

        function EventListen() {
            playRateInputRange.bind("input propertychange", function () {
                Rate = playRateInputRange.val();
                ChangeRate();
            });

            playRateInput.bind("input propertychange", function () {
                Rate = playRateInput.val();
                ChangeRate();
            });

            playRateInputInit.click(function () {
                Rate = RateLevel;
                ChangeRate();
            });


            playRateMain.hover(function () {
                ContolShow();
            }, function () {
                ContolHide();
            });

            video_content_list.click(function () {
                let flag = false;
                let myVar2 = setInterval(function () {
                    if (videojs.getPlayers("video-player").html5player && flag) {
                        ChangeRate();
                    } else {
                        flag = true;
                    }
                }, 100);
                console.log("百度网盘视频倍速 - 调整倍速成功");
            });
        };

        function ChangeRate() {
            judgeRate();
            playRateInputRange.val(Rate);
            playRateInput.val(Rate);
            videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(Rate);
            window.localStorage.setItem("Rate", Rate);
        };

        function judgeRate() {
            if (Rate == 1) {
                playRateInputInit.val("x1.5");
                RateLevel = 1.5;
            } else if (Rate == 1.5) {
                playRateInputInit.val("x2");
                RateLevel = 2;
            } else {
                playRateInputInit.val("默认");
                RateLevel = 1;
            }
        }

        function ContolShow() {
            playRateJi.hide();
            playRateContent.show();
            playRateMain.css(platRateCSS.playRateMainHCSS);
        };

        function ContolHide() {
            playRateJi.show();
            playRateContent.hide();
            playRateMain.css(platRateCSS.playRateMainCSS);
        };
    }

})();

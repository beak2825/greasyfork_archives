// ==UserScript==
// @name         B站视频同传弹幕提取
// @version      0.0.3
// @description  用于提取在B站视频里的同传弹幕，主要针对直播回放
// @author       yellowko
// @namespace    www.yellowko.com
// @supportURL   https://github.com/yellowko/bilibili-video-danmaku-translation-extract/issues
// @homepage     https://github.com/yellowko/bilibili-video-danmaku-translation-extract
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429385/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%90%8C%E4%BC%A0%E5%BC%B9%E5%B9%95%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429385/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%90%8C%E4%BC%A0%E5%BC%B9%E5%B9%95%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let url = $(location).attr('href');
    let retBV = /[\s\S]*(BV[a-z|A-Z|0-9]{10})[?p=]*([0-9]*)[\s\S]*/;
    let retTranslation = /(.*)【(.*)】|(.*)【(.*)/;
    let retTime = /([0-9]*\.[0-9]*)/;
    let BVresult = url.match(retBV);
    let bvid = BVresult[1];
    let page = 1;
    if (BVresult.length > 2 && !(BVresult[2] == "" || BVresult[2] == null))
        page = BVresult[2];
    let cid;
    let danmakuTranslation = [];
    let delay = 9000;
    let index = 0;
    let timeout = 1000;
    let lastTime = 0;
    let currentTime = 0;
    let init = 0;

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.bilibili.com/x/player/pagelist?bvid=" + bvid + "&jsonp=jsonp",
        onload: function (res) {
            if (res.status == 200) {
                let text = res.responseText;
                let json = JSON.parse(text);
                cid = json.data[page - 1].cid;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://api.bilibili.com/x/v1/dm/list.so?oid=" + cid,
                    onload: function (res) {
                        if (res.status == 200) {
                            let text = res.responseText;
                            $(text).find("d").each(function (i) {
                                let danmaku = $(this).text();
                                if (retTranslation.test(danmaku)) {
                                    let time = parseInt($(this)[0].outerHTML.match(retTime)[0] * 1000);
                                    let tanslation = "";
                                    let j = 1;
                                    let matchres = danmaku.match(retTranslation);
                                    if (matchres[1] != null) {
                                        if (matchres[1] != "")
                                            tanslation = matchres[1] + "：";
                                        tanslation += matchres[2];
                                    }
                                    else {
                                        if (matchres[3] != "")
                                            tanslation = matchres[3] + "：";
                                        tanslation += matchres[4];
                                    }

                                    let danmakuObj = new Object();
                                    danmakuObj.time = time;
                                    danmakuObj.tanslation = tanslation;
                                    danmakuTranslation.push(danmakuObj);
                                }
                            });

                            //本视频有同传弹幕，开始初始化
                            if (danmakuTranslation.length > 0) {
                                //生成同传弹幕
                                $(".bilibili-player-video").before(`
                                    <div id="danmaku-warp" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;">
                                        <div class="SubtitleBody Fullscreen ui-resizable">
                                            <div style="height:100%;position:relative;">
                                                <div class="SubtitleTextBodyFrame">
                                                    <div class="SubtitleTextBody"></div>
                                                </div>
                                            </div>
                                            <div class="ui-resizable-handle ui-resizable-e" style="z-index: 90;"></div>
                                            <div class="ui-resizable-handle ui-resizable-s" style="z-index: 90;"></div>
                                            <div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90;">
                                            </div>
                                        </div>
                                    </div>
                                `);
                                $(".SubtitleBody.Fullscreen").draggable({
                                    stop: function (event, ui) {
                                        ui.helper.removeAttr("style");
                                        let leftper = ((ui.position.left + ui.helper.width() / 2) / $("#danmaku-warp").width() * 100).toFixed(2) + "%";
                                        let topper = ((ui.position.top + ui.helper.height() / 2) / $("#danmaku-warp").height() * 100).toFixed(2) + "%";
                                        $(".SubtitleBody.Fullscreen").css({ "left": leftper, "top": topper, "transform": "translate(-50%, -50%)" })

                                    },
                                    start: function (event, ui) {
                                        $(".SubtitleBody.Fullscreen").css("transform", "translate(0, 0)")

                                    }
                                });
                                danmakuTranslation.sort(sortBy('time', true));
                                danmakuTranslation.forEach((v, i) => {
                                    $(".SubtitleTextBody").append("<p data-index=" + i + ">" + v.tanslation + "</p>");
                                });

                                //同传字幕显示
                                setTimeout(function showTranslation() {
                                    if (danmakuTranslation.length > 0) {
                                        lastTime = currentTime;
                                        currentTime = time2sec($(".bilibili-player-video-time-now").text()) + delay;

                                        if (currentTime > delay && init == 0) {

                                            //同传弹幕延迟输入框，值为0时会关闭。（由于b站播放器是异步加载的，需要在播放器加载完毕后才能把同传弹幕绑定上去）
                                            init = 1;
                                            $(".SubtitleBody").show();
                                            $(".bilibili-player-video-time").after(`
                                                <div>
                                                    <input id="danmakuTranslation-delay" type="number" value="` + delay + `"
                                                        style="width: 60px;padding: 0 5px;height: 20px;font-size: 12px;
                                                        color: hsla(0,0%,100%,.9);line-height: 20px;text-align: center;
                                                        top: 0;left: 76px;background: hsla(0,0%,100%,.2);
                                                        border: 1px solid transparent;">
                                                </div>
                                            `)
                                            $("#danmakuTranslation-delay").on("change", () => {
                                                delay = parseInt($("#danmakuTranslation-delay").val());
                                                if (delay == 0) {
                                                    $(".SubtitleBody").hide();
                                                    clearTimeout(showTranslation);
                                                }
                                                else {
                                                    $(".SubtitleBody").show();
                                                    showTranslation();
                                                }
                                            })

                                            //处理在同传弹幕上的双击
                                            $(".SubtitleTextBody").on("dblclick", "p", (event) => {
                                                index = event.currentTarget.dataset.index;
                                                let playerTime = time2sec($(".bilibili-player-video-time-now").text());
                                                delay = danmakuTranslation[index].time - playerTime;
                                                $("#danmakuTranslation-delay").val(delay);
                                                $(".currentdanmaku").removeClass("currentdanmaku");
                                                $(".SubtitleTextBodyFrame").scrollTop((index - 1) * 18.6);
                                                index++;
                                                $(".SubtitleTextBody p:nth-child(" + index + ")").addClass("currentdanmaku")

                                            });

                                            //处理在同传弹幕上的右键
                                            $(".SubtitleTextBody").on("contextmenu", function () {
                                                return false;
                                            })
                                            $(".SubtitleTextBody").on("mouseup", (function (event) {
                                                if (3 == event.which) {
                                                    $(".SubtitleTextBodyFrame").scrollTop((index - 2) * 18.6);
                                                }
                                            }));

                                            //滚动查看同传弹幕时拦截b站播放器的音量变化
                                            $(".SubtitleTextBodyFrame").on('mousewheel', function (event) {
                                                event.stopPropagation();
                                            });
                                        }

                                        //当前同传弹幕更新
                                        if (currentTime < lastTime) {
                                            index = 0;
                                        }
                                        while (danmakuTranslation[index].time < currentTime && index < danmakuTranslation.length) {
                                            index++;
                                        }
                                        while (currentTime <= danmakuTranslation[index].time && (currentTime + timeout + 100) > danmakuTranslation[index].time) {
                                            $(".currentdanmaku").removeClass("currentdanmaku");
                                            $(".SubtitleTextBodyFrame").scrollTop((index - 1) * 18.6);
                                            index++;
                                            $(".SubtitleTextBody p:nth-child(" + index + ")").addClass("currentdanmaku")
                                        }

                                    }
                                    setTimeout(showTranslation, timeout);

                                }, timeout);

                            }
                        }
                    }
                });

            }
        }
    });

    //去掉input="number"时的小箭头
    $("head").append('<style type="text/css">\n' +
        ' input[type=number]::-webkit-inner-spin-button,\n' +
        ' input[type=number]::-webkit-outer-spin-button {-webkit-appearance: none;margin: 0;}\n' +
        ' input[type=number] {-moz-appearance:textfield;}\n' +
        ' </style>');

    // 以下CSS以及字幕框元素修改自SOW社团的自动字幕组件
    // 发布帖链接：http://nga.178.com/read.php?tid=17180967
    $("head").append('<style type="text/css">\n' +
        '    .SubtitleBody{height:80px;background-color:rgba(0, 0, 0, 0.8);color:#fff;}\n' +
        '    .SubtitleBody.mobile{position:relative;top:5.626666666666667rem;}\n' +
        '    .SubtitleBody .title{padding:10px;font-size:14px;color:#ccc;}\n' +
        '    .SubtitleBody.mobile .title{font-size:12px;}\n' +
        '    .SubtitleBody .SubtitleTextBodyFrame{padding:0 10px;overflow-y:auto;position:absolute;top:8px;bottom:8px;width:100%;text-align: center;}\n' +
        '    .SubtitleBody .SubtitleTextBody{min-height:110px;font-size:14px;color:#ccc;}\n' +
        '    .SubtitleBody.mobile .SubtitleTextBody{font-size:12px;}\n' +
        '    .SubtitleBody .SubtitleTextBody p{margin-block-start:5px;margin-block-end:5px;}\n' +
        '    .SubtitleBody .SubtitleTextBody .currentdanmaku{color:#fff;font-size:23px;font-weight:bold;}\n' +
        '    .SubtitleBody.mobile .SubtitleTextBody p:first-of-type{font-size:18px;}\n' +
        '    .SubtitleBody.Fullscreen{position:absolute;left:50%;bottom:6%;transform: translate(-50%, 0);z-index:50;background-color:rgba(0, 0, 0, 0.6);width:700px;}\n' +
        '    .SubtitleBody.mobile.Fullscreen{width:300px;}\n' +
        '    .player-fullscreen-fix .SubtitleBody.Fullscreen{display:block;}\n' +
        '    .SubtitleTextBodyFrame::-webkit-scrollbar {display: none;}' +
        '    .invisibleDanmaku{opacity:0 !important;}\n' +
        '    </style>');


})();

function sortBy(attr, rev) {
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

// 将格式 "min:sec" 或者 "hour:min:sec" 转换成秒
function time2sec(time) {
    if (time == "")
        return 0;
    let timeSplit = time.split(':');
    switch (timeSplit.length) {
        case 2:
            return timeSplit[0] * 60000 + timeSplit[1] * 1000;
        case 3:
            return timeSplit[0] * 3600000 + timeSplit[1] * 60000 + timeSplit[2] * 1000;
        default:
            console.log("BDT:时间格式错误");
    }
}
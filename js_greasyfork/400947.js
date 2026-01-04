// ==UserScript==
// @name         hbpu 课程中心自动刷课
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  看说明看说明
// @author       jiaxiaoyu B站： 假前端up主
// @match        http://course.hbpu.edu.cn/G2S/Learning/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400947/hbpu%20%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/400947/hbpu%20%E8%AF%BE%E7%A8%8B%E4%B8%AD%E5%BF%83%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const jq = document.createElement("script");
    jq.src = "https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js";
    document.body.appendChild(jq);

    // 视频当前播放时间
    var currentTime;
    // 视频持续时间
    var durationTime;
    // var timer = setInterval(function () {
    //     init();
    // }, 1000);
    // tabwidget();
    var timer;


    function init() {
        currentTime = getNoteTime();
        durationTime = getTotalTime();
        // console.log(currentTime);
        // console.log(durationTime);
        if (currentTime == durationTime) {
            setTimeout(function () {
                window.location.reload();
                // tabwidget();
                // $("#panel button:last").click();
            }, 1000);

        }
    }
    //禁止搬运，复制以上任何一行代码
    /**
     * 面板
     */
    GM_addStyle("#panel{width: 150px;height: 150px;background-color: aquamarine;border: 1px solid transparent;position: absolute;top:20px;left:30px}");
    GM_addStyle("#panel button{display: block;margin: 12px auto;}");
    GM_addStyle("#panel .text{width: 100%;background-color: violet;text-align: center;}");
    panel();
    tabwidget();
    $("#panel button:last").click();

    // function init() {
    //     currentTime = getNoteTime();
    //     durationTime = getTotalTime();
    //     console.log(currentTime);
    //     console.log(durationTime);
    //     popup();
    //     if (currentTime == durationTime) {
    //         setTimeout(function () {
    //             window.location.reload();
    //             tabwidget();
    //             $("#panel button:last").click();
    //         }, 1000);

    //     }
    // }
    var pop;
//禁止copy idea
    function panel() {
        $('<div id="panel"><button>暂停刷课</button><button>开始刷课</button><p class="text">peach</p></div>').appendTo($("body"));
        const panelM = document.getElementById("panel");
        drag(panelM);
        $("#panel button:first").click(function () {
            clearInterval(timer);
            $("#panel .text").html("刷课暂停...");

        });
        $("#panel button:last").click(function () {
            clearInterval(timer);
            timer = setInterval(function () {
                init();
                // clearTimeout(t1);
                // clearTimeout(t2);
            }, 1000);

            pop = setInterval(function () {
                popup();
            }, 1000);
            tabwidget();

            $("#panel .text").html("正在刷课...");
        });
    }
    /**
     * 弹出框自动回答
     */
    //禁止搬运，复制以上任何一行代码

    function popup() {
        var ans = Questions[0].fVideoAnswer;
        if ($("textarea").not(".box_lcommpost").length) {
            clearInterval(pop);
            var t1, t2;
            // clearTimeout(t1);
            // clearTimeout(t2);
            console.log("1");
            console.log($("textarea").not(".box_lcommpost"));
            t1 = setTimeout(function () {
                if (ans) {
                    console.log("2");

                    $("textarea").not(".box_lcommpost").val(Questions[0].fVideoAnswer);
                    t2 = setTimeout(function () {
                        $("input[value='关闭']").filter(".btn_lsubmit").click();
                        console.log($("input[value='关闭']").filter(".btn_lsubmit"));
                    }, 1200);
                }

            }, 2000);

        }
    }
    /**
     * 拖拽
     */
    //禁止搬运，复制以上任何一行代码

    function drag(dv) {
        // let dv = document.getElementById('dv');
        let x = 0;
        let y = 0;
        let l = 0;
        let t = 0;
        let isDown = false;
        //鼠标按下事件
        dv.onmousedown = function (e) {
            //获取x坐标和y坐标
            x = e.clientX;
            y = e.clientY;

            //获取左部和顶部的偏移量
            l = dv.offsetLeft;
            t = dv.offsetTop;
            //开关打开
            isDown = true;
            //设置样式
            dv.style.cursor = 'move';
        }
        //鼠标移动
        window.onmousemove = function (e) {
            if (isDown == false) {
                return;
            }
            //获取x和y
            let nx = e.clientX;
            let ny = e.clientY;
            //计算移动后的左偏移量和顶部的偏移量
            let nl = nx - (x - l);
            let nt = ny - (y - t);

            dv.style.left = nl + 'px';
            dv.style.top = nt + 'px';
        }
        //鼠标抬起事件
        dv.onmouseup = function () {
            //开关关闭
            isDown = false;
            dv.style.cursor = 'default';
        }
    }
    /**
     * 获取当前播放时间
     */
    function getNoteTime() {
        let noteTime = parseInt(jwplayer("div_play").getPosition());
        return noteTime;
    }

    /**
     * 获取总时间
     */
    function getTotalTime() {
        let totalTime = parseInt(jwplayer("div_play").getDuration());
        return totalTime;
    }

    /**
     * 切换选项卡
     */
    function tabwidget() {
        let tabUl = document.getElementById("chapterList");
        let tablis = tabUl.getElementsByTagName("li");
        for (let j = 0; j < tablis.length; j++) {
            if (tablis[j].getAttribute("study") == 1) {
                if (tablis[j].getAttribute("videotime") != tablis[j].getAttribute("send")) {
                    tablis[j].click();
                    console.log("当前第"+j+"个");
                    break;
                }
            }

        }
        // tablis[i].click();
    }

    /**
     * 显示所有选项
     */
    showAlltabs();

    function showAlltabs() {
        if ($("#chapterList li").attr("videotime")) {
            $("#chapterList li").css("display", "list-item");
        }
    }
})();
// ==UserScript==
// @name         数字人才
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  恢复因换域名而导致失效的蓝奏云链接
// @author       大事深
// @match        http://69.234.236.42:37501/examinationTest?id=*
// @grant        GM_xmlhttpRequest
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/445168/%E6%95%B0%E5%AD%97%E4%BA%BA%E6%89%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445168/%E6%95%B0%E5%AD%97%E4%BA%BA%E6%89%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var Arr = []
    $(() => {

        function ajax2() {
            GM_xmlhttpRequest({
                method: "get",
                url: "http://47.97.34.77:8070/testGet",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                onload: function (response) {
                    Arr = response.responseText;
                    Arr = JSON.parse(Arr);
                    console.log(Arr)
                },
                onerror: function (response) {
                    console.log("请求失败");
                }
            });
        }
        ajax2()
        // 下一页
        // function downPage() {
        //     $(".operate-group button")[1].click()
        // }
        // function getTitle() {
        //     let title = $(".el-card__body h3")[0]
        //     title=title.innerText.split(".")[1]
        //     console.log(title.slice(0,8));
        //     downPage()
        // }
        function start() {
            const input = `
            <div id="boxxx" style='width:200px;position: absolute;z-index:999;top: 50px;right: 30px;background-color: red;'>
            <div class="answer1111" style="'color: blue;">题目</div>
            <div class="answer2222" style="'color: blue;">答案</div>
            <input style="width:200px;height:100px ;" value="ergh;odfhgja" id='seach-text'><button id='search'>搜索
            </button></div>
            `
            $("#df-practice").append(input)
            $(document).on('click', '#search', searchAnswer)
            MMM()
            console.log("完成");
            // for (let index = 0; index < 60; index++) {
            //     setTimeout(getTitle, 500)
            // }
        }
        setTimeout(start, 1000)

        function searchAnswer() {
            var value = $("#seach-text").val()
            $(".answer1111").html("无答案")
            $(".answer2222").html("无答案")
            for (const item of Arr) {
                if (item.Title.search(value) !== -1) {
                    $(".answer1111").html(item.Title)
                    $(".answer2222").html(item.Answer)
                    console.log(item);
                }

            }
        }
        function MMM() {
            $("#boxxx").mousedown(function (event) {

                // 指针相对于小盒子的偏移量,鼠标相对于窗口的坐标-小盒子相对于窗口的偏移量
                var xbox = event.pageX - $("#boxxx").offset().left;
                var ybox = event.pageY - $("#boxxx").offset().top;

                console.log(xbox, ybox);
                // 鼠标移动事件
                $(document).mousemove(function (eve) {
                    // 鼠标相对于窗口的坐标
                    var x = eve.pageX;
                    var y = eve.pageY;

                    // 大盒子相对于窗口的偏移量
                    var wrapx = $("#df-practice").offset().left;
                    var wrapy = $("#df-practice").offset().top;

                    // 大盒子的宽高，小盒子的宽高
                    var wrapw = $("#df-practice").width();
                    var wraph = $("#df-practice").height();
                    var boxw = $("#boxxx").width();
                    var boxh = $("#boxxx").height();

                    // 小盒子移动
                    var movex = x - xbox - wrapx;
                    var movey = y - ybox - wrapy;
                    // 临界值判断
                    // 小盒子不能超过大盒子左侧
                    if (movex <= 0) {
                        movex = 0;
                    }
                    // 不能超过右侧
                    if (movex >= wrapw - boxw) {
                        movex = wrapw - boxw;
                    }
                    // 不能超过上面
                    if (movey <= 0) {
                        movey = 0;
                    }
                    // 不能超过下面
                    if (movey >= wraph - boxh) {
                        movey = wraph - boxh;
                    }
                    // 检测值是否正确
                    console.log(movex, movey);

                    // 移动效果，改变left和top值
                    $("#boxxx").css({
                        "left": movex + "px",
                        "top": movey + "px"
                    });

                });
            });

            // 鼠标松开时，小盒子不移动
            $(document).mouseup(function () {
                // 使用off事件取消绑定事件
                $(document).off("mousemove");
            });
            $("#boxxx").mousedown(function (event) {

                // 指针相对于小盒子的偏移量,鼠标相对于窗口的坐标-小盒子相对于窗口的偏移量
                var xbox = event.pageX - $("#boxxx").offset().left;
                var ybox = event.pageY - $("#boxxx").offset().top;

                console.log(xbox, ybox);
                // 鼠标移动事件
                $(document).mousemove(function (eve) {
                    // 鼠标相对于窗口的坐标
                    var x = eve.pageX;
                    var y = eve.pageY;

                    // 大盒子相对于窗口的偏移量
                    var wrapx = $("#df-practice").offset().left;
                    var wrapy = $("#df-practice").offset().top;

                    // 大盒子的宽高，小盒子的宽高
                    var wrapw = $("#df-practice").width();
                    var wraph = $("#df-practice").height();
                    var boxw = $("#boxxx").width();
                    var boxh = $("#boxxx").height();

                    // 小盒子移动
                    var movex = x - xbox - wrapx;
                    var movey = y - ybox - wrapy;
                    // 临界值判断
                    // 小盒子不能超过大盒子左侧
                    if (movex <= 0) {
                        movex = 0;
                    }
                    // 不能超过右侧
                    if (movex >= wrapw - boxw) {
                        movex = wrapw - boxw;
                    }
                    // 不能超过上面
                    if (movey <= 0) {
                        movey = 0;
                    }
                    // 不能超过下面
                    if (movey >= wraph - boxh) {
                        movey = wraph - boxh;
                    }
                    // 检测值是否正确
                    console.log(movex, movey);

                    // 移动效果，改变left和top值
                    $("#boxxx").css({
                        "left": movex + "px",
                        "top": movey + "px"
                    });

                });
            });

            // 鼠标松开时，小盒子不移动
            $(document).mouseup(function () {
                // 使用off事件取消绑定事件
                $(document).off("mousemove");
            });
        }

    })

})();
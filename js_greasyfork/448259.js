// ==UserScript==
// @name         金种子辅助脚本
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  1.固定缩放方便VimiumC使用 2.自动答题 3.admin自动登录
// @author       whr
// @match        *://*/efg/*
// @match        *://*/yzkj/*
// @match        *://*/testMachine/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACECAYAAABYryPdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAa+aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA2LjAtYzAwMyA3OS4xNjQ1MjcsIDIwMjAvMTAvMTUtMTc6NDg6MzIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjEtMDQtMjBUMTg6MjA6NTMrMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMDUtMTFUMTc6MTE6NDIrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIxLTA1LTExVDE3OjExOjQyKzA4OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU3MTE2Zjc3LTM2NTUtMGU0My04Zjc0LTgwOThiYTNkMjk0YSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjc3OWFiZDNkLTViYWUtMWQ0OC05M2U5LWFlYTY1NTcwZmIyNSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOmRhYzAwMDIzLWU0ODAtNTc0My1iMzMyLTc1NDNiZmVhZTI2MiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGFjMDAwMjMtZTQ4MC01NzQzLWIzMzItNzU0M2JmZWFlMjYyIiBzdEV2dDp3aGVuPSIyMDIxLTA0LTIwVDE4OjIwOjUzKzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMSAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmY3NWViYzE0LWNkYmUtOWI0Ny05MmI3LWU3ZjhjNWU3OWY1MCIgc3RFdnQ6d2hlbj0iMjAyMS0wNC0yMFQxODoyMDo1MyswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIyLjEgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NzExNmY3Ny0zNjU1LTBlNDMtOGY3NC04MDk4YmEzZDI5NGEiIHN0RXZ0OndoZW49IjIwMjEtMDUtMTFUMTc6MTE6NDIrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4xIChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/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
// @require      https://lib.baomitu.com/tesseract.js/0.2.0/tesseract.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license       Apache-2.0 license

// @downloadURL https://update.greasyfork.org/scripts/448259/%E9%87%91%E7%A7%8D%E5%AD%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448259/%E9%87%91%E7%A7%8D%E5%AD%90%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {
    /* ==================== yzkj ==================== */
    //管理员自动登录
    if (location.search == '?TYPE=ADMIN') {
        $('#codeImg').on('load', inputCode)
        $("body").append(
            `<div id="efg-help">
                <canvas id="canvas_ocr"></canvas>
            </div>`)
        $("#loginname").val('admin')
        $("#password").val('Woke83647290.')
        return false;
    }
    function inputCode() {
        var canvas_ocr = document.querySelector('#canvas_ocr');
        canvas_ocr.width = 75;
        canvas_ocr.height = 25;
        let url = 'http://www.fjwoke.com/yzkj/code.do'
        var image = new Image();
        image.setAttribute('crossOrigin', 'anonymous') // 解决跨域问题
        image.src = url + "?v=" + Math.random()
        image.onload = function () {
            var ctx = canvas_ocr.getContext('2d');
            ctx.drawImage(image, 0, 0);
            //进行OCR!
            Tesseract.recognize(ctx).then(function (result) {
                var resultText = result.text ? result.text.trim() : '';
                // 删除字母和数字以外的字符
                resultText = resultText.replace(/[^\d^\w]/g, '')
                // 输入验证码
                $("#code").val(resultText.substring(0, 4))
                // 点击确定
                $("#login").click()
                console.log('结果', resultText);
            });
        }

    }
    // yzkj其他页面不启用任何功能
    if (window.location.href.match('/yzkj/')) {
        return false;
    }



    /* ==================== efg ==================== */
    // 固定缩放比例
    $('meta:eq(0)').attr('name', 'viewport').attr('content', 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0')
    // 添加UI
    $("body").append(
        `<div id="efg-help">
        <!--<div id="fold">收起</div>-->
        <p>
            <span>正确率:</span>
            <input id="correct-rate" value="100"></input>%
        </p>
        <p>
            <span>答题间隔:</span>
            <input id="delay" value="750"></input>ms
        </p>
        <p>
            <span>最后一题暂停:</span>
            <input id="stop-before-end" type="checkbox">
        </p>
        <p>
            <input type="button" id="start-answer" value="开始答题">
        </p>
    </div>`
    )

    // 自动答配置
    let answer_info = {
        correct_percentage: 100, // 正确率
        delay: 750, // 答题间隔时长
        stop_befor_end: false // 在最后后一题时提交
    }

    let list = [{
        name: "小程序阅读任务、阅读自主",
        //flag函数返回true时会执行answer函数
        flag: function () {
            let flag_a_1 = window.location.href.match('readingTest/toSelfReading')
            let flag_a_2 = window.location.href.match('readingTest/toTaskBookDetail')
            let flag_b = $(".exam_num:visible").length

            if ((flag_a_1 || flag_a_2) && flag_b) {
                return true;
            }
            return false
        },
        answer: function () {
            let answering = setInterval(() => {

                // 点击选项
                if (randomByPercentage()) {
                    $(".exam_question label[rightorwrong=1]").click();
                } else {
                    $(".exam_question label[rightorwrong=0]").click();
                }

                // // 判断是否是最后一题, 最后一题暂停, 不点击提交按钮
                let exam_number = $(".exam_num:visible").text().split('/')
                if (exam_number[0] == exam_number[1]) {
                    if (answer_info.stop_befor_end) {
                        clearInterval(answering)
                        return
                    } else {
                        $(".exam_button").click();
                        clearInterval(answering)
                        return
                    }
                }

                // 点击下一题
                $(".exam_button").click();
            }, answer_info.delay);
        }
    }, {
        name: "小程序阅读不放假活动考级",
        flag: function () {
            let flag_a_2 = window.location.href.match('mobileStudentTalentPlay/goTalentPlayTest')
            let flag_b = $(".exam_num:visible").length
            if (flag_a_2 && flag_b) {
                return true
            }
            return false
        },
        answer: function () {
            let answering = setInterval(() => {
                // 获取正确答案
                let correct_text = $(".exam_content:visible input:eq(0)").val()
                //按设置正确率选择选项
                if (randomByPercentage()) {
                    $(".exam_content:visible input[value='" + correct_text + "']").click()
                } else {
                    $(".exam_content:visible input[value='" + correct_text + "']").click()
                    $(".exam_content:visible .r_off").click()
                }
                let exam_number = $(".exam_num:visible").text().split('/')
                if (exam_number[0] == exam_number[1]) {
                    if (answer_info.stop_befor_end) {
                        // 最后一题暂停, 不点击提交按钮
                        clearInterval(answering)
                        return
                    } else {
                        $(".exam_button:visible").click();
                        clearInterval(answering)
                        return
                    }
                }
                // 点击下一题
                $(".exam_button:visible").click();
            }, answer_info.delay);
        }
    }, {
        name: "PC阅读任务",
        flag: function () {
            let flag_a_2 = window.location.href.match('studengtPCPersonal/personinfo')
            let flag_b = $(".number:visible").length
            if (flag_a_2 && flag_b) {
                return true
            }
            return false
        },
        answer: function () {
            let answering = setInterval(() => {
                //按设置正确率选择选项
                if (randomByPercentage()) {
                    $("#pcReadingTest li[rightorwrong=1]").click();
                } else {
                    $("#pcReadingTest li[rightorwrong=0]").click();
                }
                // let exam_number = $(".exam_num:visible").text().split('/')
                if ($(".number .num").text() == $(".number .total").text()) {
                    if (answer_info.stop_befor_end) {
                        // 最后一题暂停, 不点击提交按钮
                        clearInterval(answering)
                        return
                    } else {
                        $(".next_button:visible").click();
                        clearInterval(answering)
                        return
                    }
                }
                // 点击下一题
                $(".next_button:visible").click();
            }, answer_info.delay);
        }
    }, {
        name: "PC阅读自主",
        flag: function () {
            let flag_a_2 = window.location.href.match('readingTestPC/goindependentTopic')
            let flag_b = $(".number:visible").length
            if (flag_a_2 && flag_b) {
                return true
            }
            return false
        },
        answer: function () {
            let answering = setInterval(() => {
                //按设置正确率选择选项
                if (randomByPercentage()) {
                    $(".content_right li[rightorwrong=1]").click();
                } else {
                    $(".content_right li[rightorwrong=0]").click();
                }
                // let exam_number = $(".exam_num:visible").text().split('/')
                if ($(".number .num").text() == $(".number .total").text()) {
                    if (answer_info.stop_befor_end) {
                        // 最后一题暂停, 不点击提交按钮
                        clearInterval(answering)
                        return
                    } else {
                        $(".next_button:visible").click();
                        clearInterval(answering)
                        return
                    }
                }
                // 点击下一题
                $(".next_button:visible").click();
            }, answer_info.delay);
        }
    }]

    $("#efg-help").on("DOMCharacterDataModified", function () {
        $("#efg-help").show()
    })
    $("#efg-help").on("DOMSubtreeModified", function () {
        //alert("st be modify")
    })

    $("#start-answer").click(function () {
        answer_info.correct_percentage = $("#correct-rate").val()
        answer_info.delay = $("#delay").val()
        answer_info.stop_befor_end = $("#stop-before-end").prop('checked')
        console.log("startAnswer");
        // 遍历寻找到符合条件的方法并执行
        list.forEach(item => {
            if (item.flag()) {
                item.answer()
                return false
            }
        })
    })


    function randomByPercentage(percentage) {
        if (typeof (percentage) == 'undefined' || percentage == null) {
            percentage = answer_info.correct_percentage
        }
        if (Math.random() * 100 < percentage) {
            return true
        }
        return false
    }

    // UI拖动
    var $el = $('#efg-help');
    $el.on('mousedown touchstart', function (e) {
        var positionDiv = $(this).offset();
        var distenceX = e.pageX - positionDiv.left;
        var distenceY = e.pageY - positionDiv.top;
        var scrollLeft = $(window).scrollLeft();
        var scrollTop = $(window).scrollTop();
        console.log("start")
        $(document).on('mousemove touchmove', function (e) {
            console.log("move")
            var x = e.pageX - distenceX - scrollLeft;
            var y = e.pageY - distenceY - scrollTop;
            if (x < 0) {
                x = 0;
            } else if (x > $(window).width() - $el.outerWidth(true)) {
                x = $(window).width() - $el.outerWidth(true);
            }
            if (y < 0) {
                y = 0;
            } else if (y > $(window).height() - $el.outerHeight(true)) {
                y = $(window).height() - $el.outerHeight(true);
            }
            $el.css({
                'left': x + 'px',
                'top': y + 'px',
                'right': 'auto',
                'bottom': 'auto'
            });
            return false;
        });
        $(document).mouseup(function (e) {
            $(document).off('mousemove touchmove');
        })
    });

    // UI的样式
    GM_addStyle(`
    #efg-help {
        touch-action: none;
        cursor: move;
        padding-top: 16px;
        padding: 8px;
        background: rgba(255, 255, 255, 0.3);
        position: fixed;
        top: 0;
        left: 0;
        font-size: 16px;z-index: 99999
    }
    #efg-help * {
        margin: 0;
        padding: 0;
    }

    #efg-help-icon {
        position: relative;
        top: 100px;
    }

    #efg-help-icon img {
        width: 48px;
    }

    #efg-help #fold {
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
        color: blue;
    }

    #efg-help input {
        box-sizing: content-box;
        margin: 4px 4px;
        padding: 0 8px;
        width: 32px;
    }

    #efg-help #start-answer {
        width: 80px !important;
    }


    `)
})();
// ==UserScript==
// @name         杭电选课助手
// @icon         https://bkimg.cdn.bcebos.com/pic/7aec54e736d12f2e307562024fc2d56285356864?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       RecLusIve_F
// @match        *://jxgl.hdu.edu.cn/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @exclude      http://jxgl.hdu.edu.cn/CheckCode.aspx
// @exclude      http://jxgl.hdu.edu.cn/xsxjs.aspx?*
// @resource     toastrCss https://cdn.bootcdn.net/ajax/libs/toastr.js/2.1.4/toastr.min.css
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/405127/%E6%9D%AD%E7%94%B5%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405127/%E6%9D%AD%E7%94%B5%E9%80%89%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const $ = window.jQuery;
    const toastr = window.toastr;

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "1500",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    GM_addStyle(GM_getResourceText('toastrCss'));

    $("#iframeautoheight").attr("sandbox", "allow-same-origin allow-top-navigation allow-forms allow-scripts allow-downloads allow-popups");

    var classInfos = GM_getValue("classInfos", []);
    var isHideClass = GM_getValue("isHideClass", false);
    var isRunning = GM_getValue("isRunning", false);
    var taskID = GM_getValue("taskID", null);

    class ClassInfo {
        constructor(className, classTeacher, classCredit, classPerWeekTime, classStartEnd, classTime, classClassroom, classCategory, classType, classAreaCode) {
            this.className = className;
            this.classTeacher = classTeacher;
            this.classCredit = classCredit;
            this.classPerWeekTime = classPerWeekTime;
            this.classStartEnd = classStartEnd;
            this.classTime = classTime;
            this.classClassroom = classClassroom;
            this.classCategory = classCategory;
            this.classType = classType;
            this.classAreaCode = classAreaCode;
        }
    }

    function captchaRecognition() {
        let image;
        if ($('img').length != 0) {
            image = $('img')[0];
        }
        var canvas = document.createElement('canvas');
        var canvasContext = canvas.getContext("2d");
        var digitalFeatures = ["110001110000000001100001110000111000011100001110000111000011100001110010000011100001",
                               "111101111100111000011000001100100111110001111000111100111110011111001111100111110011",
                               "110000100000000011100001110011111001111000111000111000111000111000111100000000000000",
                               "110000100000010011000111100111100011100001111100011111000011100001100000000011100011",
                               "111100111100011110001110000111000011001001001100100110010000000000000011110011111001",
                               "100000010000001001111100111110000010000000001110011111000011100000110010000001100001",
                               "110000110000000011100001111100100010000000001110000111000011100000110010000001100001",
                               "000000000000001111100111100111100111110011110001111001111100111100011110011111001111",
                               "110001110000000001100001110000010001000001100000100111000011100001110000000001100011"
                              ];
        var captcha = "";
        canvas.width = image.width;
        canvas.height = image.height;
        canvasContext.drawImage(image, 0, 0);
        for (var i = 0; i < 5; i++) {
            var pixels = canvasContext.getImageData(9 * i + 6, 5, 7, 12).data;
            var digitalString = "";
            for (var j = 0, length = pixels.length; j < length; j += 4) {
                digitalString = digitalString + (+(pixels[j] * 0.3 + pixels[j + 1] * 0.59 + pixels[j + 2] * 0.11 >= 140));
            }
            var result = digitalFeatures.map(function(value) {
                return digitalString.split("").filter(function(v, index) {
                    return value[index] === v
                }).length
            });
            captcha += result.indexOf(Math.max.apply(null, result));
        }
        $("#txtYz").val(captcha);
    }

    function hideClass() {
        let tr = $("#kcmcGrid > tbody > tr");
        for (let i = 1; i < tr.length; i++) {
            let td = $(tr[i]).children("td");
            if (!classInfos.some(c=>{
                if ($(td[2]).text() === c.className && $(td[5]).text() === c.classTime && $(td[4]).text().includes(c.classTeacher)) {
                    return true;
                }
            })) {
                $(tr[i]).hide();
            }
        }
    }

    function checkResult() {
        let tr = $("#DataGrid2 > tbody > tr");
        let isFinished = false;
        for (let i = 1; i < tr.length; i++) {
            let td = $(tr[i]).children("td");
            for (let j = 0; j < classInfos.length; j++) {
                if ($(td[0]).text() === classInfos[j].className && $(td[1]).text() === classInfos[j].classTeacher && $(td[6]).text() ===
                    classInfos[j].classTime) {
                    isFinished = true;
                    var temp_obj = classInfos.splice(j, 1);
                    toastr.success("<b>" + temp_obj.name + "已经抢到！</b>");
                    GM_setValue("classInfos", classInfos);
                    break;
                }
            }
        }
        if (isFinished) {
            window.location.reload();
        }
    }

    function startToApply() {
        checkResult();
        if (classInfos.length == 0) {
            isRunning = false;
            GM_setValue("isRunning", isRunning);
            clearTimeout(GM_getValue("taskID", null));
            GM_setValue("taskID", null);
            toastr.error("<b>选择课程为空！</b>");
        } else {
            toastr.success("<b>正在抢课.....</b>");
            GM_setValue("isRunning", true);
            GM_setValue("taskID", setTimeout(apply, 3000));
        }
    }

    function stopToApply() {
        isRunning = false;
        GM_setValue("isRunning", false);
        clearTimeout(GM_getValue("taskID", null));
        GM_setValue("taskID", null);
        toastr.warning("<b>停止抢课.....</b>");
        location.reload();
    }

    function apply() {
        $("#Button1").click();
        startToApply();
    }

    function initUI() {
        $("#xsyxxxk_form > div.toolbox > div:nth-child(4)").hide();
        $("#xsyxxxk_form > div.main_box > div > span > fieldset:nth-child(3)").hide();
        $("#xsyxxxk_form > div.toolbox > div:nth-child(5)").after(`<div style="WIDTH: 780px; CLEAR: both" class="searchbox"><p class="search_con">仅展示抢课列表中的课程：<input type="checkbox" id="isHideClass">&nbsp<input type="${isRunning ? 'hidden' : 'button'}" value="开始抢课" id="startBtn" class="button" style="width:66px;"><input type="${!isRunning ? 'hidden' : 'button'}" value="停止抢课" id="stopBtn" class="button" style="width:66px;"></p><p class="search_title"><em></em></p></div>`);
        $("#isHideClass").attr("checked", isHideClass);
        $("#startBtn").on("click", startToApply);
        $("#stopBtn").on("click", stopToApply);
        if (isHideClass) {
            hideClass();
        }
        $("#isHideClass").change(function() {
            isHideClass = !isHideClass
            GM_setValue("isHideClass", isHideClass);
            if (isHideClass) {
                hideClass();
            } else {
                window.location.reload();
            }
        });
        let nodeList = $("#kcmcGrid > tbody > tr");
        $(`#kcmcGrid > tbody > tr:nth-child(1) > td:nth-child(17)`).after(`<td>添加到抢课列表</td>`);
        $(`#xsyxxxk_form > div.main_box > div > span > fieldset:nth-child(1)`).before(`<fieldset><legend>抢课列表</legend><table class="datelist" cellspacing="0" cellpadding="3" border="0" id="DataGrid3" style="width:100%;border-collapse:collapse;"><tbody><tr class="datelisthead"><td>课程名称</td><td>教师姓名</td><td>学分</td><td>周学时</td><td>起始结束周</td><td>上课时间</td><td>上课地点</td><td>课程归属</td><td>课程性质</td><td>校区代码</td><td>移除</td></tr></tbody></table></fieldset>`);
        if (classInfos.length != 0) {
            for (let i = 0; i < classInfos.length; i ++) {
                $(`#DataGrid3 > tbody > tr.datelisthead`).after(`<tr><td>${classInfos[i].className}</td><td>${classInfos[i].classTeacher}</td><td>${classInfos[i].classCredit}</td><td>${classInfos[i].classPerWeekTime}</td><td>${classInfos[i].classStartEnd}</td><td>${classInfos[i].classTime}</td><td>${classInfos[i].classClassroom}</td><td>${classInfos[i].classCategory}</td><td>${classInfos[i].classType}</td><td>${classInfos[i].classAreaCode}</td><td><a id="delete${i}">移除</a></td></tr>`);
                $(`#delete${i}`).on("click", function() {
                    classInfos.splice(i,1);
                    GM_setValue("classInfos", classInfos);
                    window.location.reload();
                });
                let tr = $("#kcmcGrid > tbody > tr");
                for (let j = 1; j < tr.length; j++) {
                    let td = $(tr[j]).children("td");
                    if ($(td[2]).text() === classInfos[i].className && $(td[5]).text() === classInfos[i].classTime && $(td[4]).text().includes(classInfos[i].classTeacher)) {
                        for (let k = 0; k < 2; k++) {
                            if (!$(td[k]).children("input").is(':checked') && Number($(td[11]).text()) > 0) {
                                $(td[k]).children("input").click();
                            }
                        }
                    }
                }
            }
        }
        for (let i = 2; i < nodeList.length + 1; i ++) {
            $(`#kcmcGrid > tbody > tr:nth-child(${i}) > td:nth-child(17)`).after(`<td><a id="add${i-2}">添加</a></td>`);
            $(`#add${i-2}`).on("click", function() {
                let idx = [3, 5, 8, 9, 10, 6, 7, 13, 14, 15];
                let text = [];
                for (let j in idx) {
                    text.push($(`#kcmcGrid > tbody > tr:nth-child(${i}) > td:nth-child(${idx[j]})`).text());
                }
                let selected_class = new ClassInfo(text[0], text[1], text[2], text[3], text[4], text[5], text[6], text[7], text[8], text[9]);
                if (!classInfos.some(c=> {
                    if (c.className === selected_class.className && c.classTeacher === selected_class.classTeacher && c.StartEnd === selected_class.StartEnd && c.classTime === selected_class.classTime) {
                        toastr.error("<b>请勿重复添加！</b>");
                        return true;
                    }
                })) {
                    classInfos.push(selected_class);
                    GM_setValue("classInfos", classInfos);
                    window.location.reload();
                }
            });
        }
    }

    if ($("#xsyxxxk_form > div.toolbox > div:nth-child(3)").length != 0) {
        initUI();

        if (isRunning) {
            captchaRecognition();
            startToApply();
        }

    } else {
        let ID = GM_getValue("taskID", null);
        let isR = GM_getValue("isRunning", false);
        if (isR) {
            GM_setValue("taskID", null);
            GM_setValue("isRunning", false);
        }
    }


})();

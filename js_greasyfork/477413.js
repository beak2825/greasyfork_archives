// ==UserScript==
// @name         汽车易购网-自用 Workflow JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.02.28.111428
// @description  I try to take over the world!
// @author       Kay
// @match        https://www.qipeiyigou.com/
// @match        http://admin.qipeiyigou.com/*
// @match        https://product.360che.com/contrast/*
// @match        https://car.autohome.com.cn/duibi/chexing/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477413/%E6%B1%BD%E8%BD%A6%E6%98%93%E8%B4%AD%E7%BD%91-%E8%87%AA%E7%94%A8%20Workflow%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/477413/%E6%B1%BD%E8%BD%A6%E6%98%93%E8%B4%AD%E7%BD%91-%E8%87%AA%E7%94%A8%20Workflow%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    const url = location.href;
    function R(a) {
        let ona = "on" + a;
        if (window.addEventListener) {
            window.addEventListener(a, function (e) {
                for (var n = e.originalTarget; n; n = n.parentNode) {
                    n[ona] = null;
                }
            }, true);
        }
        window[ona] = null;
        document[ona] = null;
        if (document.body) {
            document.body[ona] = null;
        }
    }
    if (url.indexOf("autohome") != -1) {
        R("contextmenu");
        R("click");
        R("mousedown");
        R("mouseup");
        R("selectstart");
        $("body").append("<style>tr[id*='tr_'] th,tr[id*='tr_'] td,.cell-con{user-select: all !important;}</style>");
    }
    function add() {
        let gettype = 0;
        if (url.indexOf("autohome") != -1) {
            if (gettype == 0) {
                $("#jsFixedHeaderTop .title-cell").text(function (n, v) {
                    if ($(this).text().indexOf("@") == -1) {
                        return $(this).parents(".compare-content__box").children(".compare-content__tit").text() + "@" + $.trim(v);
                    }
                });
                let a = $("#jsFixedHeaderTop .compare-content__box .title-cell").length;
                let list = "";
                for (let i = 0; i < a; i++) {
                    let b = $("#jsFixedHeaderTop .compare-content__box .title-cell:eq(" + i + ")").text() + "\n";
                    list += b;
                }
                $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;'><textarea>");
                $("#listx").html(list);
            }
            else {
                $(".icons-standard").text("●");
                $(".icons-select").text("○");
                $(".icons-standard,.icons-select").css("color", "green");
                $(".icons-standard,.icons-select").css("border", "0");
                $(".icons-standard,.icons-select").css("background-color", "white");
                let a = $("#jsFixedHeaderTop .title-cell").length;
                let list = "";
                for (let i = 0; i < a; i++) {
                    $("#jsFixedHeaderTop .title-cell:eq(" + i + ")").text(function (n, v) {
                        return v + "@" + $(this).next(".content-cell").text();
                    });

                    let b = $("#jsFixedHeaderTop .title-cell:eq(" + i + ")").text() + "\n";
                    list += b;
                }
                $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;'><textarea>");
                $("#listx").html(list);
            }
        }
        else if (url.indexOf("360che") != -1) {
            if (gettype == 1) {

            }
            else {
                let a = $("#newparma tr").length;
                let list = "";
                for (let i = 0; i < a; i++) {
                    let b = $("#newparma tr:eq(" + i + ") td:first").text() + "\n";
                    list += b;
                }
                for (let i = 0; i < a; i++) {
                    let b = $("#newparma tr:eq(" + i + ") th:first").text() + "\n";
                    if ($.trim(b) != "") {
                        list += b;
                    }
                }
                $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;'><textarea>");
                $("#listx").html(list);
            }
        }
    }
    function calcxy() {
        let a = "#" + $("#evMoKeyWord_uufoF").val();
        let b = "W: " + (parseInt($(a).css("width"))).toString() + " H: " + (parseInt($(a).css("height"))).toString() + " X: " + (parseInt($(a).css("left")) - 0).toString() + " Y: " + (parseInt($(a).css("top")) - 70).toString() + " 字号: " + $(a).css("font-size") + " 颜色: " + $(a).css("color");
        $("#evMoKeyWord_uufoF").val(b);
    }
    if (url.indexOf("qipeiyigou") != -1) {
        $("#field_type").attr("value", 1);
        $("#addBtn").attr("accessKey", "a");
        $("th:contains('添加时间')").attr("accessKey", "b");
        $("th:contains('排序')").attr("accessKey", "c");
        $(".footerTable input").attr("accessKey", "g");
        $(".option-list dd[title='单选']").attr("accessKey", "h");
        $("th:contains('添加时间')").click(function () {
            let a = $("input[name='channel_id']").attr("value");
            let b = $("input[name='type']").attr("value");
            let c = $("#parentid").attr("value");
            let d = "http://admin.qipeiyigou.com/autoPartsParamSet.php?channel_id=" + a + "&type=" + b + "&parentid=" + c + "&pagerows=100";
            let e = "http://admin.qipeiyigou.com/autoPartsParamSet.php?channel_id=" + a + "&type=" + b + "&parentid=" + $(".option-list .active+dd").attr("data-value") + "&pagerows=100";
            localStorage.setItem("url", e);
            location.href = d;
        });
        $("th:contains('排序')").click(function () {
            let a = $("input[name*='sort[']").length;
            let b = prompt("请输入起始值或增量：", "1");
            //全升序，输入起始值：1a
            if (b.indexOf("a") != -1) {
                for (let i = 0; i < a; i++) {
                    if ($("input[name*='sort[']:eq(" + i + ")").val() != "-1") {
                        $("input[name*='sort[']:eq(" + i + ")").val(function (n, v) { return parseInt(b) + i; });
                    }
                    else { break; }
                }
            }
            //全降序，输入起始值：10z
            else if (b.indexOf("z") != -1) {
                for (let i = 0; i < a; i++) {
                    if ($("input[name*='sort[']:eq(" + i + ")").val() != "-1") {
                        $("input[name*='sort[']:eq(" + i + ")").val(function (n, v) { return parseInt(b) - i; });
                    }
                    else { break; }
                }
            }
            //增量，输入增量值
            else {
                for (let i = 0; i < a; i++) {
                    if ($("input[name*='sort[']:eq(" + i + ")").val() != "-1") {
                        $("input[name*='sort[']:eq(" + i + ")").val(function (n, v) { return parseInt(v) + parseInt(b); });
                    }
                    else { break; }
                }
            }
        });
        $(document).keyup(function (event) {
            switch (event.keyCode) {
                case 27:
                    if ($("#popupIframe_1").contents().find(".b-26-red").length) {
                        $("#popupIframe_1").contents().find(".b-26-red").click();
                    }
                    else {
                        calcxy();
                    }
                    break;
                case 113:
                    location.href = localStorage.getItem("url");
                    break;
            }
        });
    }
    else if (url.indexOf("autohome") != -1 || url.indexOf("360che") != -1) {
        $(document).keyup(function (event) {
            switch (event.keyCode) {
                case 27:
                    add();
                    break;
            }
        });
    }
})();
/*2024.02.28.111428 - Line : 182*/

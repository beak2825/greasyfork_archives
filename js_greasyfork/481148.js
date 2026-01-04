// ==UserScript==
// @name         车型库参数填写-获取车型库参数模板专用-Latest
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.03.18.080000
// @description  I try to take over the world!
// @author       Kay
// @match        http://admin.qipeiyigou.com/*
// @match        https://product.360che.com/contrast/*
// @match        https://car.autohome.com.cn/duibi/chexing/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481148/%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%8F%82%E6%95%B0%E5%A1%AB%E5%86%99-%E8%8E%B7%E5%8F%96%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%8F%82%E6%95%B0%E6%A8%A1%E6%9D%BF%E4%B8%93%E7%94%A8-Latest.user.js
// @updateURL https://update.greasyfork.org/scripts/481148/%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%8F%82%E6%95%B0%E5%A1%AB%E5%86%99-%E8%8E%B7%E5%8F%96%E8%BD%A6%E5%9E%8B%E5%BA%93%E5%8F%82%E6%95%B0%E6%A8%A1%E6%9D%BF%E4%B8%93%E7%94%A8-Latest.meta.js
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
    function gettemplate() {
        let a = $(".panel").length;
        let list = "";
        for (let i = 0; i < a; i++) {
            $(".panel:eq(" + i + ") .item-label").text(function (n, v) {
                let b = $(".panel:eq(" + i + ") .panel-title").text() + "@";
                return b + v.split("：")[0];
            });
        }
        let c = $(".option-list .active").text();
        $(".item-label:eq(0)").text(() => { return c; });
        for (let i = 0; i < $(".item-label").length; i++) {
            list += $(".item-label:eq(" + i + ")").text() + "\n";
        }
        list = list + $(".item-label").length.toString();
        $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;'><textarea>");
        $("#listx").html(list);
    }
    function fillin() {
        if (url.indexOf("carModelAlert.php?isAlert=") != -1) {
            let totalcount = 0;
            let falsecount = 0;
            let successcount = 0;
            let falseobj = "";
            $(".item-label").attr("data-title", function () { return $(this).text().split("：")[0]; });
            if ($("#inputx").length == 0) {
                $("body").append("<div id='divx'><label>Value：</label><input id='inputx'><button id='buttonx1'>Fill</button><button id='buttonx2'>Check</button></div>");
                let style = `
            #divx {
                width: 1200px;
                height: 48px;
                display: inline-block;
                position: absolute;
                top: 30px;
                right: 190px;
                z-index: 10000;
            }

            #divx label {
                width: 100px;
                height: 36px;
                display: inline-block;
                position: absolute;
                top: 0px;
                font-size: 14px;
                color: rgb(102, 102, 102);
            }

            #divx input {
                width: 160px;
                height: 36px;
                margin: 0 30px 0 60px;
                display: inline-block;
                position: relative;
                top: -10px;
                font-size: 14px;
                color: rgb(102, 102, 102);
                border: 1px solid #0090ff;
            }

            #divx button {
                width: 100px;
                height: 36px;
                margin-left:20px;
                display: inline-block;
                position: relative;
                top: -10px;
                font-size: 14px;
                border: 0;
                color: white;
                background-color:#0090FF;
            }
            #divx2 {
                width: 800px;
                height: 600px;
                border: 0;
                padding:30px 0 30px 30px;
                border-radius: 20px;
                background: white;
                box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
                position: fixed;
                top: 130px;
                left: 600px;
                overflow:auto;
            }
            #buttonx3 {
                width: 60px;
                height: 30px;
                display: inline-block;
                position: absolute;
                top: 0;
                right:10px;
                font-size: 12px;
                border: 0;
                color: white;
                background-color:#0090FF;
            }
            `;
                $("body").append("<style id='stylex'>" + style + "<style>");
            }
            $("#buttonx1").click(function () {
                if ($("#inputx").val() != "") {
                    let a = $("#inputx").val().split("|PN|");
                    let b = a.length - 1;
                    totalcount = b;
                    for (let i = 0; i < b; i++) {
                        let c = $.trim(a[i].split("|@|")[0]);
                        let d = $.trim(a[i].split("|@|")[1]);
                        if (d == "-") { d = ""; }
                        let e = $(".item-label[data-title='" + c + "']").length;
                        if (e && $(".item-label[data-title='" + c + "']+.item-con input[type='text']").length) {
                            $(".item-label[data-title='" + c + "']+.item-con input[type='text']").val(d);
                            successcount++;
                            $("#buttonx1").css("background-color", "green");
                        }
                        else if (e && $(".item-label[data-title='" + c + "']").next().find("input[value = '" + d + "']").length) {
                            $(".item-label[data-title='" + c + "']").next().find("input[value = '" + d + "']").attr("checked", "true");
                            successcount++;
                            $("#buttonx1").css("background-color", "green");
                        }
                        else {
                            falsecount++;
                            let f = "<span style='font-size:20px;display:inline-block;width:30%;margin-right:10px;border-right:1px solid black;'>" + c + "：" + d + "</span>";
                            falseobj += f;
                            $("#buttonx1").css("background-color", "red");
                        }
                    }
                }
            });
            $("#buttonx2").click(function () {
                $("body").append("<div id='divx2' style='display:none;'><button id='buttonx3'>关闭</button></div>");
                let tips = "<h2>总项目数：" + totalcount + "</h2><br><h2>已填项目数：" + successcount + "</h2><br><h2>未填项目数：" + falsecount + "</h2><br>" + falseobj;
                if ($("#divx2").html().indexOf("项目") == -1) {
                    $("#divx2").html(function (n, v) { return v + tips; });
                }
                $("#divx2").css("display", "block");
                $("#buttonx3").click(function () {
                    $("#divx2").css("display", "none");
                });
            });
        }
    }
    function getparas() {
        if (!$("#listx").length) {
            $("body").append("<textarea id='listx' style='width:100px;height:100vh;position:fixed;top:0;right:0;'><textarea>");
        }
        if (url.indexOf("autohome") != -1) {
            let type = prompt("输入0或1", "1");
            if (type == "0") {
                $(".bg-same .title-cell").text(function (n, v) {
                    if ($(this).text().indexOf("@") == -1) {
                        return $(this).parents(".compare-content__box").children(".compare-content__tit").text() + "@" + v;
                    }
                });
                let a = $(".bg-same").length;
                let list = "";
                for (let i = 0; i < a; i++) {
                    let b = $(".bg-same:eq(" + i + ") .title-cell").text() + "\n";
                    list += b;
                }
                //$("#listx").html(list.replace(/\s+/g, " "));
                $("#listx").html(list);
            }
            else {
                $(".icons-standard").text("●");
                $(".icons-select").text("○");
                $(".icons-standard,.icons-select").css("color", "green");
                $(".icons-standard,.icons-select").css("border", "0");
                $(".icons-standard,.icons-select").css("background-color", "white");
                let a = $(".bg-same").length;
                for (let i = 0; i < a; i++) {
                    $(".bg-same:eq(" + i + ") .content-cell:first").text(function (n, v) { return $(this).prev().text() + "|@|" + v + "|PN|"; });
                }
                let list = "";
                for (let i = 0; i < a; i++) {
                    let b = $(".bg-same:eq(" + i + ") .content-cell:first").text() + "\n";
                    list += b;
                }
                $("#listx").html(list.replace(/\s+/g, " "));
            }
        }
        else if (url.indexOf("360che") != -1) {
            let type = prompt("输入0或1", "1");
            if (type == "0") {
                $("#newparma th").parent().next(".param-row").attr("title", function () { return $(this).prev().find("th").text(); });
                $("#newparma .param-row:not(.param-row[title])").attr("title", function () { return $(this).prev().attr("title"); });
                let a = $("#newparma .param-row").length;
                for (let i = 0; i < a; i++) {
                    $("#newparma .param-row:eq(" + i + ") td:first").text(function (n, v) { return $(this).parent().attr("title") + "@" + v; });
                }
                let list = "";
                for (let i = 0; i < a; i++) {
                    let b = $("#newparma .param-row:eq(" + i + ") td:first").text() + "\n";
                    list += b;
                }
                //$("#listx").html(list.replace(/\s+/g, " "));
                $("#listx").html(list);
            }
            else {
                let a = $(".param-row").length;
                for (let i = 0; i < a; i++) {
                    $(".param-row:eq(" + i + ") td:first + td").attr("class", "tdx");
                    $(".tdx:eq(" + i + ")").text(function (n, v) { return $(this).prev().text() + "|@|" + v + "|PN|"; });
                }
                let list = "";
                for (let i = 0; i < a; i++) {
                    let b = $(".tdx:eq(" + i + ")").text() + "\n";
                    list += b;
                }
                $("#listx").html(list.replace(/\s+/g, " "));
            }
        }
    }
    if (url.indexOf("qipeiyigou") != -1) {
        $(document).keyup(function (event) {
            switch (event.keyCode) {
                case 27:
                    fillin();
                    break;
                case 113:
                    gettemplate();
                    break;
            }
        });
    }
    else if (url.indexOf("autohome") != -1 || url.indexOf("360che") != -1) {
        R("contextmenu");
        R("click");
        R("mousedown");
        R("mouseup");
        R("selectstart");
        $("body").append("<style>tr[id*='tr_'] th,tr[id*='tr_'] td,.cell-con{user-select: text !important;}</style>");
        $(document).keyup(function (event) {
            switch (event.keyCode) {
                case 27:
                    getparas();
                    break;
            }
        });
    }
})();
/*2024.03.18.080000 - Line : 276*/

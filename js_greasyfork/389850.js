// ==UserScript==
// @name         知道精选审核助手
// @namespace    https://sakata.ml/
// @version      6.0
// @description  为精选审核平台添加快捷功能
// @author       坂田银串
// @match        *://zhidao.baidu.com/review/excellentreview*
// @require      https://cdn.jsdelivr.net/npm/jquery@1.11.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert@2.1.2/dist/sweetalert.min.js
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/389850/%E7%9F%A5%E9%81%93%E7%B2%BE%E9%80%89%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/389850/%E7%9F%A5%E9%81%93%E7%B2%BE%E9%80%89%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //Value Part
    let version = 6.0;
    let interval_id1;
    let interval_id2;
    let left = "<div class=\"sakata-leftbox sakata\">\
    <li>更改完后点击任意空白处生效</li>\
    <li>跳过键：<select class=\"key-option\" id = \"sk-opt\"></select></li>\
    <li>打回键：<select class=\"key-option\" id = \"bk-opt\"></select></li>\
    <li>通过键：<select class=\"key-option\" id = \"sm-opt\"></select></li>\
    <br>\
    <li><button class=\"sakata-lbtns\" id=\"ssearch\">查询该题</button></li>\
    <li><button class='sakata-lbtns' id='clear-cnt'>计数清空</button></li>\
    <li><button class='sakata-lbtns' id='set-bkbtn'>设置模版</button></li>\
    <li><button class='sakata-lbtns' id='syncBtn'>云同步</button></li>\
    <li>模版按钮：<span id='bkBtnStat'></span><a href='javascript:void(0)' id='bkBtnSwitch'>  切换</a></li>\
    <li>参考资料检测：<span id='refBoxStat'></span><a href='javascript:void(0)' id='refBoxSwitch'>  切换</a></li>\
    <li>标点检测：<span id='errCodeStat'></span><a href='javascript:void(0)' id='errCodeSwitch'>  切换</a></li>\
    <li><a href='javascript:void(0)' id='closeAddon'>暂时隐藏插件</a></li>\
    <li><font color='blue'>按Alt键统计选中内容字数</font></li>\
    <li>选中字数：<span id='word-count'></span></li>\
    </div>";
    let btns = "<div class=\"sakata-tips sakata\"><a id=\"stip\">点击完按钮后请按一下空格 否则无法打回</a></div>\
    <div class=\"input-box sakata\">\
    </div>";
    let codeTrans = {
        112: "F1",
        113: "F2",
        114: "F3",
        115: "F4",
        116: "F5",
        117: "F6",
        118: "F7",
        119: "F8",
        120: "F9",
        121: "F10",
        122: "F11",
        123: "F12",
        144: "NumLock",
        106: "小键盘*",
        107: "小键盘+",
        108: "小键盘Enter",
        109: "小键盘-",
        110: "小键盘.",
        111: "小键盘/",
        186: ";",
        187: "= +",
        189: "-",
        190: ". >",
        191: "/ ?",
        192: "` ~",
        219: "[{",
        220: "\\ |",
        221: "] }",
        103: "小键盘7",
        104: "小键盘8",
        105: "小键盘9",
        8: "BackSpace",
        9: "Tab",
        12: "Clear",
        13: "Enter",
        16: "Shift",
        17: "Control",
        18: "Alt",
        20: "CapsLock",
        27: "Esc",
        32: "Spacebar",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "LeftArrow",
        38: "UpArrow",
        39: "RightArrow",
        40: "DownArrow",
        45: "Insert",
        46: "Delete",
        48: "0",
        49: "1",
        50: "2",
        51: "3",
        52: "4",
        53: "5",
        54: "6",
        55: "7",
        56: "8",
        57: "9",
        65: "A",
        66: "B",
        67: "C",
        68: "D",
        69: "E",
        70: "F",
        71: "G",
        72: "H",
        73: "I",
        74: "J",
        75: "K",
        76: "L",
        77: "M",
        78: "N",
        79: "O",
        80: "P",
        81: "Q",
        82: "R",
        83: "S",
        84: "T",
        85: "U",
        86: "V",
        87: "W",
        88: "X",
        89: "Y",
        90: "Z",
        96: "小键盘0",
        97: "小键盘1",
        98: "小键盘2",
        99: "小键盘3",
        100: "小键盘4",
        101: "小键盘5",
        102: "小键盘6"
    };
    let re = /([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}(\/)/;
    let uid = $(".u-username")[0].innerText;
    //Local Storage Part
    if (!localStorage.getItem("SkipCode"))
        localStorage.setItem("SkipCode", 192);
    if (!localStorage.getItem("BackCode"))
        localStorage.setItem("BackCode", 112);
    if (!localStorage.getItem("SubmitCode"))
        localStorage.setItem("SubmitCode", 113);
    if (!localStorage.getItem("BackCount"))
        localStorage.setItem("BackCount", 0);
    if (!localStorage.getItem("SubmitCount"))
        localStorage.setItem("SubmitCount", 0);
    if (!localStorage.getItem("sbtn")) { //Template content
        var obj = [];
        //Migrate Old template content
        for (var i = 1; i <= 6; ++i) {
            var name = "sbtn" + i;
            obj.push(localStorage.getItem(name));
            localStorage.removeItem(name);
        }
        localStorage.setItem("sbtn", JSON.stringify(obj));
    }
    if (!localStorage.getItem("txbtn")) { //Template button text
        obj = [];
        //Migrate Old template content
        for (var i = 1; i <= 6; ++i) {
            var name = "txbtn" + i;
            obj.push(localStorage.getItem(name));
            localStorage.removeItem(name);
        }
        localStorage.setItem("txbtn", JSON.stringify(obj));
    }
    if (!localStorage.getItem("btnOn"))
        localStorage.setItem("btnOn", 1);
    if (!localStorage.getItem("refOn"))
        localStorage.setItem("refOn", 1);
    if (!localStorage.getItem("errOn"))
        localStorage.setItem("errOn", 1);
    //Function Part
    //Input box move to end
    function moveEnd(obj) {
        obj.focus();
        let len = obj.value.length;
        if (document.selection) {
            let sel = obj.createTextRange();
            sel.moveStart('character', len);
            sel.collapse();
            sel.select();
        } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
            obj.selectionStart = obj.selectionEnd = len;
        }
    }
    //Instert content to introBack-box
    function introBackInsert(appendText) {
        document.getElementById("intro-back").value += appendText + '\n';
        moveEnd(document.getElementById('intro-back'));
    }
    //Create shortcut keys option
    function createOption() {
        for (let kcode in codeTrans) {
            let opt = "<option value = " + kcode + ">" + codeTrans[kcode] + "</option>";
            $(".key-option").append(opt);
        }
    }
    //Get References
    function getRef() {
        let refs = $(".audit-detail-full :contains('参考资料') a");
        let surls = "";
        if (refs.length > 0) {
            for (let i = 0; i < refs.length; ++i) {
                let lurl = refs[i].href;
                surls += "<a href='" + lurl + "' target='view_window'>" + re.exec(lurl)[0] + "</a>  "
            }
            $(".ref-box")[0].innerHTML = "<b>参考资料网站：</b>" + surls;
        };
        if (refs.length == 0) $(".ref-box")[0].innerHTML = "<b>参考资料网站：无</b>";
    }
    //Count the amount of '?'(ErrCode)
    function errCodeCount() {
        let cnt = 0;
        let obj = $('.audit-detail-full p');
        for (let i = 0; i < obj.length; ++i) {
            let half = obj[i].innerText.split(',').length;
            //let full = obj[i].innerText.split('？').length;
            cnt += half > 1 ? half - 1 : 0;
            //cnt += full > 1 ? full - 1 : 0;
        }
        let tip = "<div class='sakata-bad-reason sakata' style='\
        line-height:40px; font-size:14px; padding:0 21px;background:#fcf5b0;border:1px solid #E8ECEE;border-radius:4px;color:#272727'>\
        <span> *【脚本检测到非中文标点】：</span> 回答内容中含有 " + cnt + " 个半角逗号 </div>";
        if (cnt > 0) $('.audit-reply-question').after(tip);
    }
    //Calculate Percent
    function toPercent(point) {
        let str = Number(point * 100).toFixed(1);
        str += "%";
        return str;
    }
    //Create Back-Button
    function createBkbtn() {
        let txbtns = JSON.parse(localStorage.txbtn);
        for (let i = 1; i <= 6; ++i) {
            $(".input-box").append("<button class='input-btn' id='txbtn" + i + "'>" + txbtns[i - 1] + "</button>");
        }
        $(".input-box").append("<br><br>");
    }
    //Back Button Switch
    function btnSwitch() {
        if (localStorage.btnOn == 0) localStorage.btnOn = 1;
        else localStorage.btnOn = 0;
        location.reload();
    }

    function refBoxSwitch() {
        if (localStorage.refOn == 0) localStorage.refOn = 1;
        else localStorage.refOn = 0;
        location.reload();
    }

    function errCodeSwitch() {
        if (localStorage.errOn == 0) localStorage.errOn = 1;
        else localStorage.errOn = 0;
        location.reload();
    }
    //Close Addon
    function closeAddon() {
        let s = $(".sakata");
        for (let i = 0; i < s.length; ++i) {
            s[i].remove();
        }
        clearInterval(interval_id1);
        clearInterval(interval_id2);
    }
    //Database Operation
    function cloudSync() {
        let syncData = {
            id: uid,
            pass: localStorage.SubmitCount,
            back: localStorage.BackCount
        }

        $.ajax({
            type: "POST",
            url: "https://api.jmsu.xyz/zhidao/php/syncStat.php",
            data: syncData,
            dataType: "JSON",
            success: function (response) {
                alert(response);
            }
        });
    }
    //Update Statistic spans
    function updateSpans() {
        let $Scount = $("#Scount span");
        $Scount[0].innerText = localStorage.BackCount;
        $Scount[1].innerText = localStorage.SubmitCount;
        let percent = parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount));
        if (percent * 100 >= 70) {
            $Scount[2].innerHTML = "<font color='red'>" + toPercent(percent) + "</font>";
        } else {
            $Scount[2].innerHTML = "<font color='green'>" + toPercent(percent) + "</font>";

        }
    }
    //Word count
    function word_count() {
        var cnt = window.getSelection().toString().length;
        $('#word-count').html("<font color='blue'>" + cnt + "</font>")
    }
    //Check Update From Server
    function checkUpdate() {
        let server_ver = 0;
        let log;
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "https://api.jmsu.xyz/zhidao/php/checkUpdate.php",
            async: false,
            success: function (response) {
                server_ver = response.version;
                log = response.log;
            }
        });
        if (server_ver > version) {
            swal({
                title: "发现新版本 V" + server_ver,
                text: log,
                icon: "info",
                buttons: {
                    cancel: "忽略",
                    confirm: {
                        text: "更新",
                        value: true
                    }

                }
            }).then((value) => {
                if (value) {
                    window.open("https://greasyfork.org/scripts/389850-知道精选审核助手/code/知道精选审核助手.user.js")
                }
            })
        }
    }
    // Get surplus
    function getSurplus() {
        $.ajax({
            type: "GET",
            dataType: "JSON",
            url: "https://zhidao.baidu.com/review/ajax/getexcellentsurplus",
            success: function(response) {
                $('#surplus')[0].innerText = response.data.replySurplus;
            }
        })
    }
    // function
    //Element Append Part
    if (localStorage.refOn == 1) $(".audit-reply-question").before("<div class='ref-box sakata'><b>参考资料网站：正在获取</b></div>");
    $(".audit-left-box").append(left);
    $(".audit-left-box").append("<div class='sakata-counter sakata' id='Scount'>今日打回：<b><span id='backCount'>" + localStorage.BackCount +
        "</span></b><br>今日通过：<b><span id='submitCount'>" + localStorage.SubmitCount +
        "</span></b><br>通过率: <b><span id='passPercent'>" + toPercent(parseInt(localStorage.SubmitCount) / (parseInt(localStorage.BackCount) + parseInt(localStorage.SubmitCount))) + "</span></b><br/>分类余量：<b><span id='surplus'></span></b></div>");
    if (localStorage.btnOn == 1) {
        $(".list-overflow").after(btns);
        createBkbtn();
    }
    //Styles Part
    $(".sakata-leftbox").css({
        "text-align": "center",
        "color": "#979797",
        "text-align": "left"
    });
    $(".sakata-lbtns").css({
        "width": "80%",
        "padding": "10",
        "cursor": "pointer",
        "border-radius": "20px",
        "background": "white",
        "color": "#1a97f0",
        "border": "2px solid #1a97f0",
        "margin": "5px"
    });
    $(".input-btn").css({
        "padding": "6px",
        "cursor": "pointer",
        "border-radius": "15px",
        "background": "#f4f7f9",
        "color": "#1a97f0",
        "border": "2px solid #1a97f0",
        "margin-top": "5px",
        "margin-right": "4px"
    });
    $("#stip").css({
        "color": "red",
        "font-size": "12px",
        "cursor": "point"
    });
    $(".sakata-counter").css({
        "line-height": "40px",
        "font-size": "14px",
        "padding": "0 21px",
        "background": "#f5f8fa",
        "border": "1px solid #E8ECEE",
        "border-radius": "4px",
        "color": "#7a8f9a",
        "margin-top": "10px"
    });
    //Activities Part
    //Listening shortcut keys
    $(document).keydown(function (event) {
        if (event.keyCode == localStorage.SkipCode) { //～跳过
            $('.active')[0].click();
        } else if (event.keyCode == localStorage.BackCode) { //F1/F7打回
            $('.audit-back-btn')[0].click();
        } else if (event.keyCode == localStorage.SubmitCode) { //F2/F8通过
            $('.audit-submit-btn')[0].click();
        } else if (event.keyCode == 18) {
            word_count();
        }
    });
    //READY PART
    $(document).ready(function () {
        //Hover Part
        $(".audit-back-btn").click(function () {
            let cnt1 = parseInt(localStorage.BackCount);
            cnt1 += 1;
            localStorage.BackCount = cnt1;
            updateSpans();
            cloudSync();
        });
        $(".audit-submit-btn").click(function () {
            let cnt2 = parseInt(localStorage.SubmitCount);
            cnt2 += 1;
            localStorage.SubmitCount = cnt2;
            updateSpans();
            cloudSync();
        });
        $(".sakata-lbtns").hover(function () {
            $(this).css({
                "background-color": "#1a97f0",
                "color": "white"
            });
        }, function () {
            $(this).css({
                "background": "white",
                "color": "#1a97f0"
            });
        });
        $(".input-btn").hover(function () {
            $(this).css({
                "background-color": "#1a97f0",
                "color": "white"
            });
        }, function () {
            $(this).css({
                "background": "#f4f7f9",
                "color": "#1a97f0"
            });
        });
        //Listening Part
        //When title changed - Change references' href & statistic '?'
        $(".ref-box").css({
            "color": "#01024e"
        });
        if (localStorage.refOn == 1) {
            interval_id1 = setInterval(function () {
                getRef();
            }, 1500);
        }
        if (localStorage.errOn == 1) {
            interval_id2 = setInterval(function () {
                $('.sakata-bad-reason').remove();
                errCodeCount();
            }, 1500);
        }
        // Listen surplus
        setInterval(() => {
            getSurplus();
        }, 1500);
        //Create options and load & save settings
        createOption();
        $(".key-option")[0].value = localStorage.SkipCode;
        $(".key-option")[1].value = localStorage.BackCode;
        $(".key-option")[2].value = localStorage.SubmitCode;
        $("#sk-opt").change(function () {
            localStorage.SkipCode = $("#sk-opt option:selected").val();
        });
        $("#bk-opt").change(function () {
            localStorage.BackCode = $("#bk-opt option:selected").val();
        });
        $("#sm-opt").change(function () {
            localStorage.SubmitCode = $("#sm-opt option:selected").val();
        });
        $("#clear-cnt").click(function () {
            localStorage.SubmitCount = 0;
            localStorage.BackCount = 0;
            updateSpans();
            swal({
                title: '清空成功',
                text: '统计数据已清零',
                icon: 'success',
                buttons: false,
                timer: 800,
            });
            checkUpdate();
        });
        $("#ssearch").click(function () {
            let adr = "https://www.baidu.com/s?wd=" + $(".q-tit")[0].innerText;
            window.open(adr, 'target', '');
        });
        //Set Back buttons
        $("#set-bkbtn").click(function () {
            let btnid = prompt("请输入要更改的按钮编号（1～6）： [留空取消]");
            if (btnid != null && btnid != "") {
                let btnst = prompt("按钮名称更改为：");
                let btntx = prompt("模版内容：");
                document.getElementById("txbtn" + btnid).innerText = btnst;
                var sbtns = JSON.parse(localStorage.sbtn);
                var txbtns = JSON.parse(localStorage.txbtn);
                sbtns[btnid - 1] = btntx;
                txbtns[btnid - 1] = btnst;
                localStorage.setItem("sbtn", JSON.stringify(sbtns));
                localStorage.setItem("txbtn", JSON.stringify(txbtns));
                //localStorage.setItem("sbtn" + btnid, btntx);
                //localStorage.setItem("txbtn" + btnid, btnst);
            }
        })
        //Insert back texts
        $(".input-btn").click(function () {
            //introBackInsert(localStorage.getItem("sbtn" + this.id[5]));
            introBackInsert(JSON.parse(localStorage.sbtn)[this.id[5] - 1]);
        });
        //Functions Switch
        $("#bkBtnSwitch").click(btnSwitch);
        $("#refBoxSwitch").click(refBoxSwitch);
        $("#errCodeSwitch").click(errCodeSwitch);
        //Update status tips if switch changed
        if (localStorage.btnOn == 1) {
            $("#bkBtnStat").html("<font color='green'>开启</font>");
        } else {
            $("#bkBtnStat").html("<font color='red'>关闭</font>");
        }
        if (localStorage.refOn == 1) {
            $("#refBoxStat").html("<font color='green'>开启</font>");
        } else {
            $("#refBoxStat").html("<font color='red'>关闭</font>");
        }
        if (localStorage.errOn == 1) {
            $("#errCodeStat").html("<font color='green'>开启</font>");
        } else {
            $("#errCodeStat").html("<font color='red'>关闭</font>");
        }
        //Close Addon
        $("#closeAddon").click(closeAddon);
        //All Data Cloud Sync
        $("#syncBtn").click(function () {
            cloudSync();
            swal({
                title: '同步成功',
                text: '数据已成功同步至服务器',
                icon: 'success',
                buttons: false,
                timer: 800,
            });
        })
        checkUpdate();
        updateSpans();
    });
})();
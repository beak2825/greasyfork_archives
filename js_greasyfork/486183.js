// ==UserScript==
// @name         抖音直播 JS
// @namespace    https://www.1024net.tech/
// @namespace    https://www.lovemake.love/
// @version      2024.08.08.080000
// @description  I try to take over the world!
// @author       Kay
// @match        https://127.0.0.1:8080/*
// @icon         https://aimg8.dlssyht.cn/u/1533835/ueditor/image/767/1533835/1633159205592221.png
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/486183/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/486183/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%20JS.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    /*————————————————————函数定义区 Start————————————————————*/
    function initialization() {
        //初始化
        $(".fa-file-o").parent().attr("accesskey", "n");
        $(".fa-file-o").parent().click(() => {
            let date = new Date();
            let time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            if (localStorage.getItem("history") == null) {
                let a = location.href + "#" + time;
                localStorage.setItem("history", a);
            }
            else {
                let a = localStorage.getItem("history");
                let b = location.href + "#" + time;
                if (replaystatus == 0) {
                    localStorage.setItem("history", a + "@" + b);
                }
                else {
                    localStorage.setItem("history", a + "@" + b + "-复盘");
                }
            }
            location.href = location.href.split("/#/")[0];
            setTimeout(() => { location.reload(); }, 100);
        });
    }
    function drawAChessboard() {
        //画棋盘
        let add_html = `
        <div id="wrapperx">
            <div id="divx">
                <div id="countdownx" accesskey="j"></div>
                <div id="turnx"><span></span><span></span></div>
                <div id="boardx"></div>
                <div id="piecex"></div>
                <div id="tipx">很抱歉，您已超时判负！</div>
                <div id="prevx" accesskey="k">上一步</div>
                <div id="nextx" accesskey="l">下一步</div>
                <div id="hidex" accesskey="h">隐藏序号</div>
                <div id="exportx" accesskey="g">导出记录</div>
                <div id="clearx" accesskey="c">清空数据</div>
                <div id="rulex"></div>
                <div id="qrcodex"></div>
                <div id="lefttipx">欢迎来到本直播间<br><br>每晚8点开播<br><br>一个粉丝团灯牌连麦<br><br>一朵鲜花复盘<br><br>可索取超清复盘动态图</div>
                <audio id="audiox" src="https://aimg8.dlssyht.cn/u/2232350/ueditor/video/1117/2232350/1707092109930354.mp3"></audio>
                <style id="hide"></style>
            </div>
        </div>
        <div id="setx">
            <div id="settimex"><label>步时设置：</label><input><button>设置</button></div>
            <div id="modex"><label>对战模式：</label><input><button accesskey="y">切换</button></div>
            <div id="teamx"><label>团战模式：</label><input><button>设置</button><button>交换</button></div>
            <div id="movex">
                <label>移动棋盘：</label><button>左移</button><button>右移</button><button>上移</button><button>下移</button><button>还原</button>
            </div>
            <div id="scalex"><label>界面缩放：</label><input><button>缩小</button><button>放大</button><button>还原</button></div>
        </div>
        `;
        $("body").append(add_html);
        $("#countdownx").css("background-image", "url(../img/vip.png)");
        $("#modex input").val("有禁手");
        let ratio = localStorage.getItem("scale");
        if (ratio == null) { ratio = 1; }
        $("#wrapperx").css("transform", "scale(" + ratio + ")");
        $("#scalex input").val(ratio);
        $("#settimex input").val(function () { let a = localStorage.getItem("steptime"); if (a == null) { a = 45; } localStorage.setItem("steptime", a); return a; });
        for (let i = 0; i < 225; i++) {
            $("#boardx").prepend("<div class='coord'></div>");
            $("#piecex").prepend("<div class='piece'></div>");
        }
        $(".coord").css("line-height", () => { return $(".coord:first").height() + "px"; });
        let a = [211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225,
            210, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
            209, 156, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 171,
            208, 155, 110, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 123, 172,
            207, 154, 109, 72, 43, 44, 45, 46, 47, 48, 49, 50, 83, 124, 173,
            206, 153, 108, 71, 42, 21, 22, 23, 24, 25, 26, 51, 84, 125, 174,
            205, 152, 107, 70, 41, 20, 7, 8, 9, 10, 27, 52, 85, 126, 175,
            204, 151, 106, 69, 40, 19, 6, 1, 2, 11, 28, 53, 86, 127, 176,
            203, 150, 105, 68, 39, 18, 5, 4, 3, 12, 29, 54, 87, 128, 177,
            202, 149, 104, 67, 38, 17, 16, 15, 14, 13, 30, 55, 88, 129, 178,
            201, 148, 103, 66, 37, 36, 35, 34, 33, 32, 31, 56, 89, 130, 179,
            200, 147, 102, 65, 64, 63, 62, 61, 60, 59, 58, 57, 90, 131, 180,
            199, 146, 101, 100, 99, 98, 97, 96, 95, 94, 93, 92, 91, 132, 181,
            198, 145, 144, 143, 142, 141, 140, 139, 138, 137, 136, 135, 134, 133, 182,
            197, 196, 195, 194, 193, 192, 191, 190, 189, 188, 187, 186, 185, 184, 183];
        let b = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o"];
        let c = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        let d = [];
        for (let i = 0; i < c.length; i++) {
            for (let j = 0; j < b.length; j++) {
                let e = b[j] + c[i];
                d.push(e);
            }
        }
        $(".coord").html(function (n, v) { return a[n]; });
        $(".piece").attr("data-coord", function (n, v) { return d[n]; });
    }
    function cleartime() {
        let count = setInterval(() => { }, 1000);
        for (let i = 0; i < count; i++) {
            clearInterval(i);
        }
    }
    function timedown_mode() {
        //计时模式切换
        if (vip == 0) {
            cleartime();
            vip = 1;
            $("#countdownx").html("");
            $("#countdownx").css("background-image", origin_image);
            $("#stylex").remove();
            $("#tipx").css("display", "none");
        }
        else if (vip == 1) {
            vip = 0;
            origin_image = $("#countdownx").css("background-image");
            $("#countdownx").css("background-image", "none");
            let a = localStorage.getItem("steptime");
            $("#countdownx").html("剩余步时：" + a + "秒");
            timedown_start();
        }
    }
    function timedown_start() {
        //计时开始
        let a = Number(localStorage.getItem("steptime")) - 1;
        $("#countdownx").html("剩余步时：" + (a + 1) + "秒");
        let timedown = setInterval(() => {
            if (a >= 0) {
                if (a < 10) { a = "0" + a; }
                let b = "剩余步时：" + a + "秒";
                $("#countdownx").html(b);
                if (a == 10) {
                    let b = `
                            @keyframes borderx {
                                from {
                                    border: 5px solid red;
                                }

                                to {
                                    border: 5px solid yellow;
                                }
                            }
                            #piecex {
                                animation: borderx 1s;
                                animation-iteration-count: infinite;
                                left: -5px;
                                top: 45px !important;
                            }
                            `;
                    $("body").append("<style id='stylex'>" + b + "</style>");
                }
                a--;
            }
            else {
                clearInterval(timedown);
                $("#tipx").css("display", "block");
                let a = "-" + ($("#boardx").height() / 2 + 50) + "px";
                $("#tipx").css("top", a);
                setTimeout(() => { $("#tipx").css("display", "none"); if ($("#countdownx").text().indexOf("秒") > 0) { $(".fa-file-o").parent().click(); } }, 2000);
            }
        }, 1000);
    }
    function clickEvent() {
        //点击事件
        $("#countdownx").click(() => {
            cleartime();
            let a = $("#countdownx").css("background-image");
            if (a.indexOf("vip") != -1) {
                $("#countdownx").css("background-image", "url(../img/23.png)");
                sanse = 1;
            }
            else if (a.indexOf("23") != -1) {
                $("#countdownx").css("background-image", "url(../img/33.png)");
                sanse = 2;
            }
            else if (a.indexOf("33") != -1 || a.indexOf("tz") != -1) {
                $("#countdownx").css("background-image", "url(../img/vip.png)");
                sanse = 0;
            }
        });
        $(".piece").mouseup(() => {
            popped = [];
        });
        $("#prevx").click(function () {
            let a = step.pop();
            location.href = location.href.split(a)[0];
            let b = $(".piece[data-coord=" + a + "] div").attr("data-color");
            if (b == "black") {
                color = 0;
                wturn--;
            }
            else if (b == "white") {
                color = 1;
                bturn--;
            }
            $(".piece[data-coord=" + a + "] div").remove();
            popped.push(a);
            let c = step[step.length - 1];
            $(".piece[data-coord=" + c + "]").addClass("last-move");
        });
        $("#nextx").click(function () {
            let a = popped.pop();
            if (luping == 1) { $("#audiox")[0].play(); }
            $(".piece[data-coord=" + a + "]").click();
        });
        $("#hidex").click(() => {
            let a = $("#hide").html();
            if (a.indexOf("1") != -1 || a == "") {
                $("#hide").html("div[data-color]:not(.last-move div[data-color]) div {opacity: 0;}");
            }
            else {
                $("#hide").html("div[data-color] div {opacity: 1;}");
            }
        });
        $("#settimex button").click(() => {
            let a = $("#settimex input").val();
            localStorage.setItem("steptime", a);
        });
        $("#modex button").click(() => {
            let a = $("#modex input").val();
            if (a == "有禁手") {
                $("#modex input").val("无禁手");
                $("#iframex").attr("src", function (n, v) { return v.replace("8080", "8081"); });
            }
            else {
                $("#modex input").val("有禁手");
                $("#iframex").attr("src", function (n, v) { return v.replace("8081", "8080"); });
            }
        });
        $("#teamx button:first").click(() => {
            vip = 1;
            $("#turnx").css("display", "inline-block");
            $("#countdownx").html("");
            $("#countdownx").css("background-image", "url(../img/tz.png)");
            let a = $("#teamx input").val();
            bteam = a.split(".")[0];
            wteam = a.split(".")[1];
            $("#turnx span:first").text(a[0]);
            bturn += 1;
        });
        $("#teamx button:last").click(() => {
            $("#teamx input").val(wteam + "." + bteam);
            bturn = 0;
            $("#teamx button:first").click();
        });
        $("#exportx").click(() => {
            if (localStorage.getItem("history") == null) { alert("无记录"); }
            else {
                let a = localStorage.getItem("history").split("@");
                let b = "";
                for (let i = 0; i < a.length; i++) {
                    b += a[i] + "\n";
                }
                let blob = new Blob([b], { type: "text/csv;charset=utf-8" });
                saveAs(blob, "对局记录.csv");
            }
        });
        $("#clearx").click(() => {
            localStorage.clear();
            alert("已清空数据\n" + "localStorage: " + localStorage.getItem("history"));
        });
    }
    function playChess() {
        //行棋
        $(".piece").mousedown(() => {
            $("#audiox")[0].play();
        });
        $(".piece").click(() => {
            cleartime();
            $("#stylex").remove();
            $("#tipx").css("display", "none");
            if (vip == 0) {
                timedown_start();
            }
        });
    }
    function calc_turn() {
        //计算轮走方
        let allsteps = url.split("/#/")[1];
        while (allsteps.length) {
            let a = allsteps[0];
            let b = parseInt(allsteps.split(allsteps[0])[1]);
            let c = a + b;
            step.push(c);
            allsteps = allsteps.replace(c, "");
        }
        return step.length % 2;
    }
    function redChess() {
        //下一手落红子
        if (sanse == 1) {
            red = 1;
            $(".last-move").removeClass("last-move");
        }
    }
    function replay() {
        //Esc 复盘
        let a = localStorage.getItem("history").split("@");
        if (location.href == "https://127.0.0.1:8080/#/") {
            location.href = a[a.length - 1];
            localStorage.setItem("temp", a[a.length - 1]);
        }
        else {
            let b = localStorage.getItem("temp");
            let c = a.indexOf(b);
            if (c == 0) { alert("无更多记录！"); }
            else {
                location.href = a[c - 1];
                localStorage.setItem("temp", a[c - 1]);
            }
        }
        setTimeout(() => { location.reload(); }, 100);
    }
    function replaying() {
        //复盘中
        if (url.split("/#/")[1] != "") {
            let total_step = calc_turn();
            if (total_step == 1) {
                color = 1;
            }
            else if (total_step == 0) {
                color = 0;
            }
            let step_len = step.length;
            for (let i = 0; i < step_len; i++) {
                let total_piece = $("div[data-color]").length + 1;
                if (i % 2 == 0) {
                    $(".piece[data-coord=" + step[i] + "]").append("<div data-color='black'><div>" + total_piece + "</div></div>");
                }
                else if (i % 2 == 1) {
                    $(".piece[data-coord=" + step[i] + "]").append("<div data-color='white'><div>" + total_piece + "</div></div>");
                }
                if (i == step_len - 1) {
                    let j = step[i];
                    $(".piece[data-coord=" + j + "]").addClass("last-move");
                }
            }
        }
    }
    function displayQRCode() {
        //显示、隐藏付款二维码
        let a = $("#qrcodex").css("display");
        if (a == "none") {
            $("#qrcodex").css("display", "inline-block");
        }
        else {
            $("#qrcodex").css("display", "none");
        }
    }
    function moveZoom(direction) {
        //移动、缩放棋盘
        if (direction == "top" || direction == "bottom") {
            let a = $("#wrapperx").css("top");
            $("#wrapperx").css("top", function () {
                if (direction == "top") {
                    return (parseInt(a) - 45) + "px";
                }
                else {
                    return (parseInt(a) + 45) + "px";
                }
            });
        }
        else if (direction == "left" || direction == "right") {
            let a = $("#wrapperx").css("left");
            $("#wrapperx").css("left", function () {
                if (direction == "left") {
                    return (parseInt(a) - 45) + "px";
                }
                else {
                    return (parseInt(a) + 45) + "px";
                }
            });
        }
        else if (direction == "coord0") {
            $("#wrapperx").css("top", "0");
            $("#wrapperx").css("left", "0");
        }
        else if (direction == "zoom-" || direction == "zoom+") {
            let a = parseFloat($("#wrapperx").attr("style").split("(")[1]);
            let b = "";
            if (direction == "zoom-") {
                b = (a - 0.01).toFixed(2);
            }
            else {
                b = (a + 0.01).toFixed(2);
            }
            $("#wrapperx").css("transform", "scale(" + b + ")");
            localStorage.setItem("scale", b);
            $("#scalex input").val(localStorage.getItem("scale"));
        }
        else if (direction == "zoom0") {
            $("#wrapperx").css("transform", "scale(1)");
            localStorage.setItem("scale", 1);
            $("#scalex input").val(localStorage.getItem("scale"));
        }
    }
    function ifWin() {
        //行棋+判断胜负
        $(".piece").click(function (n, v) {
            if ($(this).find("div[data-color]").length == 0) {
                let total_piece = $("div[data-color]").length + 1;
                total_piece -= $("div[data-color=red]").length;
                $(".last-move").removeClass("last-move");
                if (sanse == 1 && red == 1) {
                    //2人三色五子棋插入红子
                    $(this).append("<div data-color='red'><div>" + total_piece + "</div></div>");
                    $(this).attr("data-piececolor", "r");
                    red = 0;
                }
                else if (sanse != 2) {
                    //普通模式或2人三色五子棋
                    if (color == 0) {
                        let a = $("div[data-color=black]").length + $("div[data-color=white]").length;
                        if (sanse == 0 && a == 4 && luping == 0) {
                            let b = $("div[data-color]").length + 1;
                            $(this).append("<div data-color='red'><div>" + b + "</div></div>");
                            $(this).attr("data-piececolor", "r");
                        }
                        else {
                            $(this).append("<div data-color='black'><div>" + total_piece + "</div></div>");
                            $(this).attr("data-piececolor", "b");
                            color = 1;
                        }
                        $("#turnx span:first").text("");
                        if (wturn == wteam.length) { wturn = 0; }
                        $("#turnx span:last").text(wteam[wturn]);
                        wturn++;
                    }
                    else if (color == 1) {
                        $(this).append("<div data-color='white'><div>" + total_piece + "</div></div>");
                        $(this).attr("data-piececolor", "w");
                        color = 0;
                        $("#turnx span:last").text("");
                        if (bturn == bteam.length) { bturn = 0; }
                        $("#turnx span:first").text(bteam[bturn]);
                        bturn++;
                    }
                }
                else if (sanse == 2) {
                    //3人三色五子棋
                    total_piece = $("div[data-color]").length + 1;
                    let a = total_piece % 3;
                    let color = "";
                    if (a == 1) {
                        color = "black";
                    }
                    else if (a == 2) {
                        color = "white";
                    }
                    else if (a == 0) {
                        color = "red";
                    }
                    $(this).append("<div data-color=" + color + "><div>" + total_piece + "</div></div>");
                    $(this).attr("data-piececolor", function () { return color[0]; });
                }
                $(this).addClass("last-move");
                let last_move_color = $(".last-move>div").attr("data-color");
                step.push($(this).attr("data-coord"));
                if (last_move_color != "red") {
                    location.href += $(this).attr("data-coord");
                }
            }
            else if ($(this).attr("data-piececolor") == "r" && sanse == 0) {
                //普通模式五手多打选子
                $(this).attr("data-piececolor", "b");
                $(this).find("div[data-color]").attr("data-color", "black");
                $("div[data-color=red]").remove();
                $(this).find("div[data-color] div").text("5");
                location.href += $(this).attr("data-coord");
                step.push($(this).attr("data-coord"));
                step.splice(4, step.length - 5);
                color = 1;
            }
            if ($("#iframex").length) {
                let a = "https://127.0.0.1:8080?" + $(".last-move>div").attr("data-color") + "/#/" + location.href.split("/#/")[1];
                $("#iframex").attr("src", a);
                let autoplay = setInterval(() => {
                    let b = $("#iframex").contents().find(".fa-play").css("color");
                    if (b == "rgb(34, 153, 84)") {
                        if (a.indexOf("white") != -1 && $("#iframex").contents().find("h1").text().indexOf("黑") != -1) {
                            $("#iframex").contents().find(".fa-play").click();
                        }
                        else if (a.indexOf("black") != -1 && $("#iframex").contents().find("h1").text().indexOf("白") != -1) {
                            $("#iframex").contents().find(".fa-play").click();
                        }
                        clearInterval(autoplay);
                    }
                }, 100);
            }
        });
    }
    function ai() {
        $("#iframex").contents().find(".fa-play").click();
    }
    /*————————————————————函数定义区 End————————————————————*/
    /*————————————————————主体代码区 Start————————————————————*/
    let url = location.href;
    let luping = 0;
    let vip = 1;
    let sanse = 0;//0:普通模式,1:2人三色五子棋模式，2:3人三色五子棋模式
    let red = 0;
    let color = 0;
    let step = [];
    let popped = [];
    let replaystatus = 0;
    let bteam = "";
    let wteam = "";
    let bturn = 0;
    let wturn = 0;
    let origin_image = "";
    if (url != "https://127.0.0.1:8080/#/") {
        replaystatus = 1;
    }
    if (url.indexOf("https://127.0.0.1:8080/#/") != -1) {
        initialization();
        drawAChessboard();
        cleartime();
        clickEvent();
        playChess();
        ifWin();
        replaying();
    }
    $(document).keyup(function (event) {
        switch (event.keyCode) {
            case 27://Esc 复盘
                replay();
                break;
            case 73://i 下一手红子
                redChess();
                break;
            case 80://p 计时模式切换
                timedown_mode();
                break;
            case 112://F1 显示、隐藏收款二维码
                displayQRCode();
                break;
            case 38://向上箭头 棋盘上移
                moveZoom("top");
                break;
            case 40://向下箭头 棋盘下移
                moveZoom("bottom");
                break;
            case 37://向左箭头 棋盘左移
                moveZoom("left");
                break;
            case 39://向右箭头 棋盘右移
                moveZoom("right");
                break;
            case 79://o 棋盘坐标归0
                moveZoom("coord0");
                break;
            case 109://- 棋盘缩小
                moveZoom("zoom-");
                break;
            case 107://+ 棋盘放大
                moveZoom("zoom+");
                break;
            case 96://0 棋盘缩放归1
                moveZoom("zoom0");
                break;
            case 85://u AI打点
                ai();
                break;
        }
    });
    /*————————————————————主体代码区 End————————————————————*/
})();
/*2024.08.08.080000 - Line : 584*/

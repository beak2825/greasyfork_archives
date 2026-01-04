/* jshint esversion: 6 */
// ==UserScript==
// @name         umidai
// @namespace    https://liangz98.github.io/p/945231d4/
// @version      0.2.6
// @description  有米贷自动投标助手
// @author       LiangZ
// @match        *://www.umidai.com/financing/sbtz/*/*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376941/umidai.user.js
// @updateURL https://update.greasyfork.org/scripts/376941/umidai.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = window.jQuery;

    Date.prototype.Format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,
            "d+" : this.getDate(),
            "h+" : this.getHours(),
            "m+" : this.getMinutes(),
            "s+" : this.getSeconds(),
            "q+" : Math.floor((this.getMonth()+3)/3),
            "S"  : this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if (new RegExp("("+ k +")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    var $controlDiv = $('<div></div>'),
        isShow = GM_getValue("isControlDivShow", true),
        earlierTime = GM_getValue('earlierTime', 1630);

    $controlDiv.append('<input type="text" id="earlierTimeInput" placeholder="提前量" value="' + earlierTime + '">&nbsp;&nbsp;ms&nbsp;&nbsp;<button type="button" id="setEarlierTime">设置</button>&nbsp;&nbsp;<button type="button" id="cleanInfo">清空信息</button><br>');
    $controlDiv.append('<input type="text" id="bidTimeInput" placeholder="输入投标时间" value="">&nbsp;&nbsp;<button type="button" id="setBidTime">设置</button><br>');
    $controlDiv.append('<span class="countdownShow countDownMs">倒计时(ms):&nbsp;<span id="tiktock">0:00</span></span><br>');
    $controlDiv.append('<div id="controlInfoDiv"></div>');

    $("body").append($controlDiv);
    if (isShow) {
        $controlDiv.show();
        $("body").append('<button type="button" id="minimize" data-type="minimize"> - </button>');
    } else {
        $("body").append('<button type="button" id="minimize" data-type="maxmize"> 口 </button>');
        $controlDiv.hide();
    }

    var $controlInfoDiv = $("#controlInfoDiv"),
        $cleanInfo = $("#cleanInfo"),
        $minimize = $("#minimize"),
        $setEarlierTime = $("#setEarlierTime"),
        $earlierTimeInput = $("#earlierTimeInput"),
        $bidTimeInput = $("#bidTimeInput"),
        $setBidTime = $("#setBidTime");

    $("#earlierTimeInput, #bidTimeInput").css({
        "margin-left": "5px",
        "width": "40px",
        "padding": "6px 12px",
        "color": "#555",
        "background-color": "#fff",
        "border": "1px solid #ccc",
        "border-radius": "4px"
    });

    $bidTimeInput.css({
        "width": "100px"
    });

    $controlDiv.css({
        "width": "270px",
        "minHeight": "400px",
        "position": "absolute",
        "top": "220px",
        "right": "0",
        "border": "1px solid #ddd",
        "background": "#fff",
        "margin-right": "10px",
        "opacity": "0.2"
    });

    $("#cleanInfo, #setEarlierTime, #setBidTime").css({
        "margin-left": "5px",
        "margin-top": "5px",
        "margin-bottom": "5px",
        "padding": "6px 12px",
        "cursor": "pointer",
        "border": "1px solid transparent",
        "border-radius": "4px",
        "color": "#666",
        "background-color": "#f0ad4e",
        "background-image": "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)",
        "opacity": "0.8"
    });

    $("#cleanInfo, #setEarlierTime, #setBidTime").mouseenter(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#F5F5F5 0,#ccc 100%)"
        });
    });
    $("#cleanInfo, #setEarlierTime, #setBidTime").mouseleave(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)"
        });
    });

    $("#cleanInfo, #setEarlierTime, #setBidTime").mousedown(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom, #ccc 0, #ccc 100%)"
        });
    });
    $("#cleanInfo, #setEarlierTime, #setBidTime").mouseup(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)"
        });
    });

    $minimize.css({
        "width": "25px",
        "position": "absolute",
        "top": "200px",
        "right": "11px",
        "cursor": "pointer",
        "border": "1px solid transparent",
        //"border-radius": "4px",
        "color": "#666",
        "background-color": "#f0ad4e",
        "background-image": "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)",
        "opacity": "0.2"
    });

    $minimize.mouseenter(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#fff 0,#ccc 100%)"
        });
    });
    $minimize.mouseleave(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)"
        });
    });

    $minimize.mousedown(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#fff 0,#666 100%)"
        });
    });
    $minimize.mouseup(function() {
        $(this).css({
            "background-image": "linear-gradient(to bottom,#fff 0,#e0e0e0 100%)"
        });
    });

    $controlInfoDiv.css({
        "width": "93%",
        "border": "1px solid #ddd",
        "height": "320px",
        "margin-left": "5px",
        "padding-left": "5px",
        "background": "#eee",
        "color": "#666",
        "overflow-y": "auto"
    });

    $(".countdownShow").css({
        "margin-left": "5px",
    });

    var time = parseInt(unsafeWindow.endTime / 1000);
    var pageEndTime = unsafeWindow.endTime;
    //pageEndTime = 40000;
    var tiktock = document.getElementById('tiktock');
    var myDate = new Date();
    var bidTime = null;
    var hasBidTime = false;

    $("#yfbDiv").show();
    $("#divtb").show();

    if (time > 0) {
        GM_deleteValue('controlInfo');
        $controlInfoDiv.html("");
        $("#yfbDiv").show();
        //$("#tbzDiv").show();
    } else {
        $controlInfoDiv.append(GM_getValue('controlInfo', '')).scrollTop($controlInfoDiv.prop('scrollHeight'));
    }

    $minimize.bind("click", function() {
        var type = $(this).attr("data-type");
        if (type === 'minimize') {
            $controlDiv.hide();
            $(this).attr("data-type", "maxmize");
            $(this).html(" 口 ");
            GM_setValue("isControlDivShow", false);
        } else {
            $controlDiv.show();
            $(this).attr("data-type", "minimize");
            $(this).html(" - ");
            GM_setValue("isControlDivShow", true);
        }
    });

    $setBidTime.bind("click", function() {
        hasBidTime = true;
        bidTime = myDate.getFullYear() + '-' + (myDate.getMonth() + 1) + '-' + myDate.getDate() + ' ' + $bidTimeInput.val();
        console.log(bidTime);
    });

    // 毫秒(新的)
    countDown4ms();

    function countDown4ms() {
        var setTime,
            endTime = new Date().getTime() + pageEndTime - earlierTime;

        if (pageEndTime > 0) {
            pushInfo('提前' + earlierTime / 1000 + '秒投标...', 'ms');
            pushInfo('预计投标时间:<br>' + new Date(endTime).Format("hh:mm:ss.S"), 'ms');
            pushInfo('开始...', 'ms');

            setTime = setInterval(function(){
                if (hasBidTime) {
                    if (endTime < new Date(bidTime).getTime()) {
                        //var addedMs = new Date(bidTime).getTime() - endTime;
                        //pushInfo('补时: ' + addedMs + ' ms', 'ms');
                        //endTime += addedMs;
                        //endTime += 80;

                        endTime = new Date(bidTime).getTime() + 80;
                        pushInfo('新的预计投标时间:<br>' + new Date(endTime).Format("hh:mm:ss.S"), 'ms');
                        hasBidTime = false;
                    }
                }
                var nMSS = endTime - new Date().getTime();
                var nD = leftPad(Math.floor(nMSS / (1000 * 60 * 60 * 24)));
                var nH = leftPad(Math.floor(nMSS / (1000 * 60 * 60)) % 24);
                var nM = leftPad(Math.floor(nMSS / (1000 * 60)) % 60);
                var nS = leftPad(Math.floor(nMSS / 1000) % 60);
                var nMS = leftPad(Math.floor(nMSS / 100) % 10);
                var nnMS = leftPad(Math.floor(nMSS % 1000), '0');

                tiktock.innerHTML = nH + ":" + nM + ":" + nS + "." + nnMS + " ms " + parseInt(nMSS / 1000);

                if (nMSS <= 0){
                    pushInfo('投标完成, 等待结果...', 'ms');
                    pushInfo('完成时间:<br>' + new Date().Format("hh:mm:ss.S"), 'ms');
                    GM_setValue('controlInfo', $controlInfoDiv.html());
                    $("#tbRateButton").click();	// 投标
                    // 结束定时器
                    clearInterval(setTime);
                }

                // 投标按钮出现, 提前投标
                if ($("#tbzDiv").is(':visible')) {
                    pushInfo('投标按钮显示时间:<br>' + new Date().Format("hh:mm:ss.S"), 'ms');
                    pushInfo('投标完成, 等待结果...', 'ms');
                    pushInfo('完成时间:<br>' + new Date().Format("hh:mm:ss.S"), 'ms');
                    GM_setValue('controlInfo', $controlInfoDiv.html());
                    $("#tbRateButton").click();	// 投标
                    // 结束定时器
                    clearInterval(setTime);
                }
            }, 1);
        }
    }

    // 清空信息框内容
    $cleanInfo.bind("click", function() {
        $controlInfoDiv.html("");
        GM_setValue('controlInfo', $controlInfoDiv.html());
    });

    // 设置投标提前量
    $setEarlierTime.bind("click", function() {
        GM_setValue('earlierTime', $earlierTimeInput.val());
        window.location.reload();
    });

    function pushInfo(infoStr, type='') {
        var typeInfo = '';
        if (type === 'ms') {
            typeInfo = '[毫秒] ';
        } else if (type === 's') {
            typeInfo = '[秒] ';
        }
        $controlInfoDiv.append('<span>' + typeInfo + infoStr + '</span><br>').scrollTop($controlInfoDiv.prop('scrollHeight'));
    }

    // 对返回值类型做了转换，同时补0
    function leftPad(n, addZero=''){
        return n > 0 ? n <= 9 ? ('0'+ n) : (n + '') : '00' + addZero;
    }
})();
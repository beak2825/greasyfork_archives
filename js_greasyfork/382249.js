// ==UserScript==
// @name         VIP8（全能打码）
// @namespace    Anubis Ja
// @version      1.0.3
// @description  支持页面：[为保障您的账号安全，请输入验证码]，[您的操作异常，请输入验证码]，[课后习题提交频繁]，[进入考试] 必须配合【超星网课助手】使用
// @author       Anubis Ja
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @match        *://*.edu.cn/mycourse/studentstudy*
// @match        *://*.chaoxing.com/exam/test?*
// @match        *://*.chaoxing.com/html/processVerify.ac?ucode*
// @require      https://cdn.staticfile.org/jquery/1.7.2/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/382249/VIP8%EF%BC%88%E5%85%A8%E8%83%BD%E6%89%93%E7%A0%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/382249/VIP8%EF%BC%88%E5%85%A8%E8%83%BD%E6%89%93%E7%A0%81%EF%BC%89.meta.js
// ==/UserScript==
// 以下代码均不需要修改
var useline = GM_getValue('useline', '2');
var userkey = GM_getValue('userkey', '');
var timeout = GM_getValue('timeout', '8000');
var retry = GM_getValue('retry', '3');
var timeflag = GM_getValue('timeflag', '10');
var maxdamafrequency = GM_getValue('maxdamafrequency', '3');
var damafrequency = 0;
$('body').append('<div style="border: 2px dashed rgb(0, 85, 68); width: 300px; position: fixed; top: 100px; left: 0; z-index: 9999999; font-size: 15px; background-color: rgba(70, 196, 38, 0.8); color: white;">' + '<div style="text-align:center;color:black;font-size:20px">' + '<div>全能打码</div>' + '</div><hr><div id="info" style="margin-left:5px;font-size:15px ">' + '</div><hr>' + '<div style="margin-left:5px;">' + '接口：<input type="radio" name="useline" value="2">Anubis <input type="radio" name="useline" value="1">打码狗 <br>' + 'key：<input id="userkey" name="userkey" placeholder="" type="text"/> <button id="save">保存</button><button id="clean">清空日志</button><br>' + '打码超时：<input id="timeout" name="timeout" style="width:35px;text-align:center" type="text"/> 毫秒&nbsp&nbsp&nbsp重试：<input id="retry" name="retry" style="width:15px;text-align:center" type="text"/> 次<br>' + '<input id="timeflag" name="timeflag" style="width:20px;text-align:center" type="text"/> 秒内最多打码 <input id="maxdamafrequency" name="maxdamafrequency" style="width:15px;text-align:center" type="text"/> 次' + '</div><hr><div id="msg"></div>' + '</div>');
$("input:radio[value=" + useline + "]").attr('checked', 'true');
$("#userkey").val(userkey);
$("#timeout").val(timeout);
$("#retry").val(retry);
$("#timeflag").val(timeflag);
$("#maxdamafrequency").val(maxdamafrequency);
$.ajax({
    url: 'http://dama.52wfy.cn/',
    type: 'GET',
    dataType: "text",
    success: function(result) {
        $("#info").html(result);
    }
});
//为保障您的账号安全，请输入验证码
$("[name='chapterNumVerCode']").load(function() {
    if ($('#chapterVerificationCode:visible').length) {
        $('#identifyCodeRandom').val('').attr('placeholder', '正在打码中');
        var img = new Image();
        img.src = $("[name='chapterNumVerCode']").attr('src');
        msg('为保障您的账号安全', 'black');
        getCode(img, 1);
    }
});
//您的操作异常，请输入验证码
$("#ccc").load(function() {
    $('#identifyCodeRandom').val('').attr('placeholder', '正在打码中');
    var img = new Image();
    img.src = $("#ccc").attr('src');
    msg('您的操作异常，请输入验证码', 'black');
    getCode(img, 2);
});
//课后习题提交频繁验证码
$('#imgVerCode').load(function() {
    if ($('#validate:visible').length) {
        $('#code').val('').attr('placeholder', '正在打码中');
        var img = new Image();
        img.src = $('#imgVerCode').attr('src');
        msg('课后习题提交频繁', 'black');
        getCode(img, 3);
    }
});
//考试
stuExamVerifyCode = function() {
    $("#identifyCodeRandom").val("");
    $("[name='examNumVerCode']").attr("src", "/verifyCode/stuExam?" + new Date().getTime()).one('load', function(event) {
        event.originalEvent.path.length == 13 && getCode($(this), 4);
    });
}
var $a = $('<a class="bluebtn" href="javascript:void(0)">打码</a>').prependTo('#startTestDiv').click(function() {
    if ($(this).css('background-color') == 'rgb(140, 184, 51)') {
        var img = new Image();
        img.src = $('[name=examNumVerCode]').attr('src');
        $a.css('background-color', '#c2c2c2').text('打码中');
        $img.prev().attr('placeholder', '正在打码中...');
        msg('进入考试', 'black');
        getCode(img, 4);
    }
});

function getCode(img, page) {
    if (damafrequency >= maxdamafrequency) {
        msg('打码频率超限', 'red');
        return;
    }
    if (useline == 1) {
        $.ajax({
            url: 'https://www.damagou.top/apiv1/recognize.html',
            type: 'POST',
            data: {
                'image': imageBase64(img),
                'type': '1003',
                'userkey': userkey
            },
            tryCount: 0,
            retryLimit: retry,
            timeout: timeout,
            success: function(result) {
                if (result == 'userkey错误') {
                    msg('打码狗：userkey错误', 'red');
                } else {
                    msg('打码狗：' + result, 'black');
                    damafrequency++;
                    dama(page, result);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        msg('打码狗：连接超时重试', 'red');
                        $.ajax(this);
                        return;
                    } else {
                        msg('打码狗：重试次数上限', 'red');
                    }
                    return;
                }
                if (xhr.status != 200) {
                    msg('打码狗：服务器错误', 'red');
                }
            }
        });
    } else {
        $.ajax({
            url: 'http://dama.52wfy.cn/dama.php',
            type: 'POST',
            data: {
                'img': imageBase64(img),
                'userkey': userkey
            },
            tryCount: 0,
            retryLimit: retry,
            timeout: timeout,
            success: function(result) {
                console.log(result);
                if (result.code != 1) {
                    msg('Anubis打码错误：' + result.msg, 'red');
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        msg('Anubis打码重试', 'red');
                        $.ajax(this);
                        return;
                    } else {
                        msg('Anubis打码：重试次数上限', 'red');
                    }
                    return;
                } else {
                    msg('Anubis打码：' + result.data + ' ' + result.msg, 'black');
                    damafrequency++;
                    dama(page, result.data);
                }
            },
            error: function(xhr, textStatus, errorThrown) {
                if (textStatus == 'timeout') {
                    this.tryCount++;
                    if (this.tryCount <= this.retryLimit) {
                        msg('Anubis打码：连接超时重试', 'red');
                        $.ajax(this);
                        return;
                    } else {
                        msg('Anubis打码：重试次数上限', 'red');
                    }
                    return;
                }
                if (xhr.status != 200) {
                    msg('Anubis打码：服务器错误', 'red');
                }
            }
        });
    }
}

function dama(page, result) {
    if (page == 1) {
        $('#identifyCodeRandom').val(result);
        continueGetTeacherAjax();
        check();
    }
    if (page == 2) {
        if (result.length != 4) location.reload();
        $('#ucode').val(result);
        $('.submit').click();
    }
    if (page == 3) {
        $('#code').val(result);
        $('#sub:visible')[0].click();
    }
    if (page == 4) {
        $('#identifyCodeRandom').val(result);
        $a.css('background-color', '').text('打码');
        $img.prev().attr('placeholder', '请输入验证码');
        $('#startTestDiv a')[1].click();
    }
}

function msg(msg, color) {
    var d = new Date();
    var t = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    msg = t + '  ' + msg;
    $('#msg').append('<div style="color:' + color + '">' + msg + '</div>');
}

function check() {
    if ($('#chapterVerificationCodeTip').css('display') != 'none') {
        WAY.box.hide();
        $('#chapterVerificationCodeTip').css('display', 'none');
        showChapterVerificationCode();
    }
    setTimeout(check, 2000);
}

function toHttp() {
    if (location.protocol == 'https:') {
        location.href = location.href.replace('https', 'http');
    }
}

function timeflagfun() {
    if (timeflagrun == 0) {
        damafrequency = 0;
        timeflagrun = timeflag;
    } else {
        timeflagrun--;
    }
    //$('#tdinfo').html(timeflag);
    //console.log(damafrequency);
    //console.log(timeflagrun);
}

function imageBase64(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    return canvas.toDataURL('image/png').substr(22);
}
$("#save").click(function(event) {
    GM_setValue('useline', $("input[name='useline']:checked").val());
    GM_setValue('userkey', $("#userkey").val());
    GM_setValue('timeout', $("#timeout").val());
    GM_setValue('retry', $("#retry").val());
    GM_setValue('timeflag', $("#timeflag").val());
    GM_setValue('maxdamafrequency', $("#maxdamafrequency").val());
    useline = $("input[name='useline']:checked").val();
    userkey = $("#userkey").val();
    timeout = $("#timeout").val();
    retry = $("#retry").val();
    timeflag = $("#timeflag").val();
    maxdamafrequency = $("#maxdamafrequency").val();
    msg('配置保存成功，即时生效', 'black');
});
$("#clean").click(function(event) {
    $('#msg').html('');
});
setTimeout(toHttp, 2000);
if (userkey == '') {
    msg('打码key不能为空，请详细阅读<a href="https://greasyfork.org/zh-CN/scripts/380572" target="_blank">【脚本描述】</a>！', 'red');
    return;
}
var timeflagrun = timeflag;
setInterval(timeflagfun, 1000);
msg('脚本正在运行', 'black');
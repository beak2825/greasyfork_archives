// ==UserScript==
// @name         SVIP4（全能打码）
// @namespace    Anubis Ja
// @version      1.0.2
// @description  支持页面：[为保障您的账号安全，请输入验证码]，[您的操作异常，请输入验证码]，[课后习题提交频繁]，[超星进入考试]，[智慧树进入考试]，[超星登录]
// @author       Anubis Ja
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @match        *://*.chaoxing.com/exam/test*
// @match        *://*.chaoxing.com/antispiderShowVerify.ac*
// @match        *://*.chaoxing.com/html/processVerify.ac*
// @match        *://passport2.chaoxing.com/*删除此文字开启登录打码
// @match        *://*.edu.cn/mycourse/studentstudy*
// @match        *://*.edu.cn/exam/test*
// @match        *://*.edu.cn/antispiderShowVerify.ac*
// @match        *://*.edu.cn/html/processVerify.ac*
// @match        *://passport2.*.edu.cn/*
// @match        *://onlineexamh5new.zhihuishu.com/stuExamWeb.html*
// @require      https://cdn.staticfile.org/jquery/1.7.2/jquery.min.js
// @connect      52wfy.cn
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @supportURL   https://greasyfork.org/zh-CN/scripts/380572/feedback
// @downloadURL https://update.greasyfork.org/scripts/391199/SVIP4%EF%BC%88%E5%85%A8%E8%83%BD%E6%89%93%E7%A0%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/391199/SVIP4%EF%BC%88%E5%85%A8%E8%83%BD%E6%89%93%E7%A0%81%EF%BC%89.meta.js
// ==/UserScript==
var url = window.location.href;
if (url.indexOf("webExamList?recruitId") < 0 && url.indexOf("zhihuishu.com") > 0) return;
// 设置修改后，需要刷新或重新打开页面才会生效
var config = [
        // 1代表开启，0代表关闭
        1, // 为保障您的账号安全，请输入验证码
        1, // 您的操作异常，请输入验证码
        1, // 课后习题提交频繁验证码
        1, // 超星考试
        1, // 登录
        1, // 智慧树考试
    ],

    // 以下代码均不需要修改
    _self = unsafeWindow,
    $ = _self.jQuery || window.jQuery,
    setting = {
        'uselist': '0',
        'userkey': '',
        'timeout': '8000',
        'retry': '3',
        'rate': '3000',
        'show': '1'
    },
    none = '打码key不能为空，请详细阅读<a href="https://greasyfork.org/zh-CN/scripts/380572" target="_blank">【脚本描述】</a>！';

Number.prototype.format = function() {
    return this < 10 ? '0' + this : this;
};

$.each(setting, function(key, value) {
    setting[key] = GM_getValue(key, value);
});

var $div = $(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 300px; position: fixed; top: 100px; left: 0; z-index: 999999; font-size: 15px; background-color: rgba(70, 196, 38, 0.8); color: white;">' +
    '<div style="text-align: center; color: black; font-size: 20px;">全能打码  <button name="show">隐藏</button></div>' +
    '<hr>' +
    '<div style="" id="div1">' +
    '<div style="margin: 0 5px; font-size: 15px;" id="info"></div>' +
    '<hr>' +
    '<form style="margin: 0 5px;">' +
    '<div style="text-align: center; color: red;">参数修改后自动保存</div>' +
    '<div>' +
    '<label for="userkey">key：</label>' +
    '<input id="userkey" name="userkey" placeholder="请输入有效的key">' +
    '</div>' +
    '<div>' +
    '<label for="timeout">打码超时：</label>' +
    '<input id="timeout" name="timeout" type="number" min="8000" style="width: 55px; text-align: center;">' +
    '<label for="timeout" style="margin-right: 15px;"> 毫秒</label>' +
    '<label for="retry">重试：</label>' +
    '<input id="retry" name="retry" type="number" min="0" style="width: 35px; text-align: center;">' +
    '<label for="retry"> 次</label>' +
    '</div>' +
    '<div>' +
    '<label for="rate">打码延迟：</label>' +
    '<input id="rate" name="rate" type="number" min="3000"  style="width: 55px; text-align: center;">' +
    '<label for="rate" style="margin-right: 15px;"> 毫秒</label>' +
    '<button name="clean" type="button">清空日志</button>' +
    '</div>' +
    '</form>' +
    '<hr>' +
    '<div style="margin-left: 5px; max-height: 300px; overflow-y: auto;" id="log"></div>' +
    '</div>'
).appendTo('body').on('input change', 'input', function(event) {
    // if (this.value.match(/^\*+$/)) return;
    var name = $(this).attr('name');
    GM_setValue(name, this.value);
    setting[name] = this.value;
    if (event.type == 'change') msg('配置保存成功，即时生效');
}).on('focus blur', '[name=userkey]', function(event) {
    this.value = setting.userkey.replace(/(\S)/g, event.type == 'focusin' ? '$1' : '*');
}).on('click', 'button', function() {
     var name = $(this).attr('name');
     if (name == 'clean') $('#log').html('');
     if (name == 'show') {
     setting.show = GM_getValue('show');
     $(this).html(setting.show ? '显示' : '隐藏');
     setting.show ? GM_setValue('show', 0) : GM_setValue('show', 1);
     $div.find('#div1').toggle();
     }
}).find('input').each(function() {
    var type = $(this).attr('type'),
        name = $(this).attr('name');
    if (type == 'radio') {
        this.checked = setting[name] == this.value;
    } else if (name == 'userkey') {
        this.value = setting[name].replace(/\S/g, '*');
    } else {
        this.value = setting[name];
    }
}).end();
if(!setting.show){$div.find('#div1').toggle();$div.find('button').eq(0).html('显示');}
GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://删除dama.52wfy.cn/info.php?v=' + GM_info.script.version,
    timeout: 2E4,
    onload: function(xhr) {
        if (xhr.status != 200) return;
        $('#info').html(xhr.responseText);
    }
});

// 为保障您的账号安全，请输入验证码
$('[name=chapterNumVerCode]').load(function() {
    if (!$('#chapterVerificationCode:visible').length) return;
    beforeGet(this, 1, '#identifyCodeRandom', '为保障您的账号安全');
});
// 您的操作异常，请输入验证码
$('#ccc').load(function() {
    beforeGet(this, 2, '#identifyCodeRandom', '您的操作异常，请输入验证码');
});
// 课后习题提交频繁验证码
$('#imgVerCode').load(function() {
    if (!$('#validate:visible').length) return;
    beforeGet(this, 3, '#code', '课后习题提交频繁');
});
// 超星考试，重考
$('[name=examNumVerCode]').load(function() {
    if ($(this).is(':hidden')) return;
    beforeGet(this, 4, $(this).prev(), '超星考试');
});
// 登录
$('#numVerCode').load(function() {
    beforeGet(this, 5, '#numcode', '登录');
});
// 智慧树考试

window.jnfwnef = setTimeout(function() {
    $("[class='themeBg']").click();
}, 3000);


window.checkcodeisshow = setInterval(function() {
    if ($("#loginStuCodeCheckCodeImg").length > 0) {
        clearInterval(window.checkcodeisshow);
        $('#loginStuCodeCheckCodeImg').load(function() {
            beforeGet(this, 6, '#loginStuCodeCheckCode', '智慧树考试');
            checkerrorisshowF();
        });
        beforeGet(this, 6, '#loginStuCodeCheckCode', '智慧树考试');
        checkerrorisshowF();
    }
}, 1000);

function checkerrorisshowF() {
    window.checkerrorisshow = setInterval(function() {
        if ($("#loginStuCheckCodeError").length > 0) {
            clearInterval(window.checkerrorisshow);
            $("#loginStuCheckCodeError").remove();
            $("#changImage").click();
        }
    }, 1000);
}

function beforeGet(dom, page, sel, text, color) {
    if (!config[page - 1]) return msg('未开启此验证码的打码：' + text, 'red');
    if (!setting.userkey) return msg(none, 'red');
    if (page != 6) $(sel).val('').attr('placeholder', '正在打码中');
    msg(text, color);
    setting.count = setting.error = 1;
    if (page == 6) {
        getCode(page, $('#loginStuCodeCheckCodeImg').attr('src').substr(22));
    } else {
        getCode(page, imageBase64(dom));
    }

}

function getCode(page, img) {
    if (setting.uselist == '0') {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://dama.52wfy.cn/dama.php',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            timeout: setting.timeout,
            data: 'img=' + encodeURIComponent(img) + '&userkey=' + setting.userkey,
            onload: function(xhr) {
                if (xhr.status != 200) return;
                var obj = $.parseJSON(xhr.responseText);
                if (obj.code != 1) {
                    msg('Anubis打码错误：' + obj.msg, 'red');
                    if (++setting.count > setting.retry) {
                        msg('Anubis打码：重试次数上限', 'red');
                    } else {
                        setTimeout(getCode, 3E3, page, img);
                        msg('Anubis打码重试', 'red');
                    }
                } else if (++setting.error <= setting.retry) {
                    if (page == 5) obj.data = obj.data.replace(/o/g, '0');
                    msg('Anubis打码：' + obj.data + ' ' + obj.msg);
                    setTimeout(dama, setting.rate, page, obj.data);
                } else {
                    msg('Anubis打码：重试次数上限', 'red');
                }
            },
            ontimeout: function() {
                if (++setting.count > setting.retry) {
                    msg('Anubis打码：超时重试次数上限', 'red');
                } else {
                    setTimeout(getCode, 3E3, page, img);
                    msg('Anubis打码：连接超时重试', 'red');
                }
            },
            onerror: function() {
                msg('Anubis打码：服务器错误', 'red');
            }
        });
    }
}

function dama(page, result) {
    if (page == 1) {
        $('#identifyCodeRandom').val(result);
        _self.continueGetTeacherAjax();
        setTimeout(check1, 2E3);
    } else if (page == 2) {
        if (result.length != 4) location.reload();
        $('#ucode').val(result);
        $('.submit').click();
    } else if (page == 3) {
        $('#code').val(result);
        $('#sub:visible')[0].click();
    } else if (page == 4) {
        $('[id$=identifyCodeRandom]:visible').val(result);
        $('[id$=startTestDiv] > a:visible')[0].click();
        setTimeout(check4, 2E3);
    } else if (page == 5) {
        $('#numcode').val(result);
    } else if (page == 6) {
        $('#loginStuCodeCheckCode').val(result)[0].dispatchEvent(new Event('input'));
        setTimeout(function() {
            $("#confirmTest").click();
        }, 5000);
    }
}

function check1() {
    if ($('#chapterVerificationCodeTip:hidden').length) return;
    _self.WAY.box.hide();
    $('#chapterVerificationCodeTip').hide();
    _self.showChapterVerificationCode();
}

function check4() {
    $('[id$=tipIdentifyCode]:visible').next().find('a')[0].click();
    $('[name=examNumVerCode]:visible').click();
}

function imageBase64(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    return canvas.toDataURL('image/png').substr(22);
}

function msg(msg, color) {
    var d = new Date(),
        t = d.getHours().format() + ':' + d.getMinutes().format() + ':' + d.getSeconds().format();
    msg = t + '  ' + msg;
    $('#log').append('<p style="color: ' + (color || 'black') + '">' + msg + '</p>');
}

if (setting.userkey) {
    msg('脚本正在运行');
} else {
    msg(none, 'red');
}
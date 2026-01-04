// ==UserScript==
// @name            修改2-cx考试助手（可以解除粘贴限制）
// @namespace       166771
// @version         1.4.0
// @description     修改了参数自动隐藏搜题框（按↓可显示），搜到题可以自动后台复制| 1089直呼内涵| 解除各类功能限制，开放自定义参数 | 原作者wyn
// @author          qackqi&Stars
// @match           *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @match           *://*.edu.cn/exam/test/reVersionTestStartNew*
// @match           *://*.nbdlib.cn/exam/test/reVersionTestStartNew*
// @match           *://*.hnsyu.net/exam/test/reVersionTestStartNew*
// @connect         qs.nnarea.cn
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/405806/%E4%BF%AE%E6%94%B92-cx%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E4%BB%A5%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/405806/%E4%BF%AE%E6%94%B92-cx%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%EF%BC%88%E5%8F%AF%E4%BB%A5%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%EF%BC%89.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 7E3 == 7000，科学记数法，表示毫秒数
    time: 7E3 // 默认响应速度为7秒，不建议小于5秒
    ,token: '' // 捐助用户可以使用定制功能，更精准的匹配答案，此处填写捐助后获取的识别码

    // 1代表开启，0代表关闭
    ,none: 0 // 未找到答案或无匹配答案时执行默认操作，默认关闭
    ,jump: 0 // 答题完成后自动切换，默认开启
    ,copy: 0 // 自动复制答案到剪贴板，也可以通过手动点击按钮或答案进行复制，默认关闭

    // 非自动化操作
    ,hide: 1 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
},
_self = unsafeWindow,
$ = _self.jQuery,
UE = _self.UE;

String.prototype.toCDB = function() {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};

// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
setting.TiMu = [
    filterImg('.Cy_TItle .clearfix').replace(/\s*（\d+\.\d+分）$/, ''),
    $('[name^=type]:not([id])').val() || '-1',
    $('.cur a').text().trim() || '无',
    $('li .clearfix').map(function() {
        return filterImg(this);
    })
];

setting.div = $(
    '<div style="border: 0px dashed rgb(149, 252, 251); width: 330px; position: fixed; top:55%; right:80%; z-index: 99999; background-color: rgba(184, 247, 255, 0); overflow-x: auto;">' +
        '<span style="font-size: medium; color: rgba(184, 247, 255, 0);"></span>' +
        '<div style="font-size: medium;color: rgba(205, 206, 207, 0.8);">搜索中...</div>' +
        '<button style="margin-right: 10px;"></button>' +
        //隐藏'<button style="margin-right: 10px;">暂停答题</button>' +

        //隐藏'<button style="margin-right: 10px;' + (setting.jump ? '' : ' display: none;') + '">点击停止本次切换</button>' +

        '<button style="margin-right: 1px;background-color: rgba(206, 206, 206, 0); ">.</button>' +

        //隐藏'<button style="margin-right: 10px; display: none;">复制答案</button>' +
        //隐藏'<button>答题详情</button>' +
        '<div style="max-height: 200px; overflow-y: auto;">' +
            '<table border="0" style="font-size: 13px; color: rgba(205, 206, 207, 0.9);">' +
                '<thead>' +
                    '<tr>' +
                        '<th colspan="2">' + ($('#randomOptions').val() == 'false' ? '' : '<font color="rgba(205, 206, 207, 0.8)">本次考试的选项为乱序 脚本会选择正确的选项</font>') + '</th>' +
                    '</tr>' +
                    '<tr>' +
                        '<th style="width: 60%; min-width: 130px;"></th>' +
                        '<th style="min-width: 130px;"></th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="' + (setting.jump ? ' display: none;' : '') + '">' +
                    '<tr>' +
                        '<th colspan="2"></th>' +
                    '</tr>' +
                '</tfoot>' +
                '<tbody>' +
                    '<tr>' +
                        '<td colspan="2" style="display: none;"></td>' +
                    '</tr>' +
                '</tbody>' +
            '</table>' +
        '</div>' +
    '</div>'
).appendTo('body').on('click', 'button, td', function() {
    var num = setting.$btn.index(this);
    if (num == -1) {
        GM_setClipboard($(this).text());
    } else if (num === 0) {
        if (setting.loop) {
            clearInterval(setting.loop);
            delete setting.loop;
            num = ['', ''];
        } else {
            setting.loop = setInterval(findTiMu, setting.time);
            num = ['.', ''];
        }
        setting.$div.html(function() {
            return $(this).data('html') || num[0];
        }).removeData('html');
        $(this).html(num[1]);
    } else if (num == 1) {
        setting.jump = 0;
        setting.$div.html(function() {
            return arguments[1].replace('即将切换下一题', '未开启自动切换');
        });
        setting.div.find('tfoot').add(this).toggle();
    } else if (num == 2) {
        location.reload();
    } else if (num == 3) {
        GM_setClipboard(setting.div.find('td:last').text());
    } else if (num == 4) {
        ($('.leftCard .saveYl')[0] || $()).click();
    }
}).detach(setting.hide ? '*' : 'html');
setting.$btn = setting.div.children('button');
setting.$div = setting.div.children('div:eq(0)');

$(document).keydown(function(event) {
    if (event.keyCode == 38) {
        setting.div.detach();
    } else if (event.keyCode == 40) {
        setting.div.appendTo('body');
    }
});

if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
$.each(UE.instants, function() {
    var key = this.key;
    this.ready(function() {
        this.destroy();
        UE.getEditor(key);
    });
});
setting.loop = setInterval(findTiMu, setting.time);

function findTiMu() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://qs.nnarea.cn/OnlineCourseBot/topic',
        data: 'q=' + encodeURIComponent(setting.TiMu[0]),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText.replace(/^操作数据失败！/,'')) || {};
                if (obj.success == "true") {
                    var answer = String(obj.answer).replace(/&/g, '&amp;').replace(/<(?!img)/g, '&lt;'),
                    que = setting.TiMu[0].match('<img') ? setting.TiMu[0] : setting.TiMu[0].replace(/&/g, '&amp;').replace(/</g, '&lt');
                    obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                    setting.div.find('tbody').append(
                        '<tr>' +
                            //隐藏问题 '<td title="点击可复制">' + que + '</td>' +
                            '<td title="点击可复制">' + (/^http/.test(answer) ? obj.answer : '') + answer + '</td>' +
                        '</tr>'
                    );
                    setting.copy && GM_setClipboard(obj.answer);
                    setting.$btn.eq(3).show();
                    fillAnswer(obj);
                } else {
                    setting.$div.html(obj.answer || '服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                var html = xhr.responseText.indexOf('{') ? '请求过于频繁，建议稍后再试' : $.parseJSON(xhr.responseText).data;
                setting.$div.data('html', html).siblings('button:eq(0)').click();
            } else {
                setting.$div.text('服务器异常，正在重试...');
            }
        },
        ontimeout: function() {
            setting.loop && setting.$div.text('服务器超时，正在重试...');
        }
    });
}

function fillAnswer(obj, tip) {
    var $input = $(':radio, :checkbox', '.Cy_ulBottom'),
    str = String(obj.answer).toCDB() || new Date().toString(),
    data = str.split(/#|\x01|\|/),
    opt = obj.opt || str,
    btn = $('.saveYl:contains(下一题)').offset();
    // $input.filter(':radio:checked').prop('checked', false);
    obj.success == "true" && $input.each(function(index) {
        if (this.value == 'true') {
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/);
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/);
        } else {
            index = setting.TiMu[3][index].toCDB() || new Date().toString();
            index = $.inArray(index, data) + 1 || (setting.TiMu[1] == '1');
            Boolean(index) == this || this;
        }
    }).each(function() {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this;
    });
    if (setting.TiMu[1].match(/^[013]$/)) {
        tip = $input.is(':checked') || setting.none && (($input[Math.floor(Math.random() * $input.length)] || $()).click(), ' ');
    } else if (setting.TiMu[1].match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.answer).split(/#|\x01|\|/);
        tip = $('.Cy_ulTk textarea').each(function(index) {
            index = (obj.success == "true" && data[index]) || '';

        }).length;
        tip = (obj.success == "true" && data.length == tip) || setting.none && ' ';
        setting.len = str.length * setting.time / 10;
    }
    if (tip == ' ') {
        tip = '已执行默认操作';
    } else if (tip) {
        tip = '答题完成';
    } else if (tip === undefined) {
        tip = '该题型不支持自动答题';
    } else {
        tip = '未找到有效答案';
    }
    if (btn) {
        tip += setting.jump ? '，即将切换下一题' : '，';
        setInterval(function() {
            if (!setting.jump) return;
            var mouse = document.createEvent('MouseEvents'),
            arr = [btn.left + Math.ceil(Math.random() * 80), btn.top + Math.ceil(Math.random() * 26)];
            mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, arr[0], arr[1], false, false, false, false, 0, null);
            _self.event = $.extend(true, {}, mouse);
            delete _self.event.isTrusted;
            _self.getTheNextQuestion(1);
        }, setting.len || Math.ceil(setting.time * Math.random()) * 2);
    } else {
        setting.$btn.eq(1).hide();
        tip = '';
    }
    setting.$div.data('html', tip).siblings('button:eq(0)').hide().click();
}

function filterImg(dom) {
    return $(dom).clone().find('img[src]').replaceWith(function() {
        return $('<p></p>').text('');
    }).end().find('iframe[src]').replaceWith(function() {
        return $('<p></p>').text('');
    }).end().text().trim();
}
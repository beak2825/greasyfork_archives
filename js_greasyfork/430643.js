// ==UserScript==
// @name         超星网课助手[考试专版-高准确率]
// @namespace    Astra@163.com
// @version      1.5
// @description  支持考试自动答题、自动切换题目、隐藏答案搜索提示框等，解除各类功能限制，开放自定义参数
// @author       Astra
// @match        *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @match        *://*.edu.cn/exam/test/reVersionTestStartNew*
// @connect      onlinecoursekiller.online
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @original-script https://greasyfork.org/zh-CN/scripts/373131
// @original-author wyn665817
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/430643/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%5B%E8%80%83%E8%AF%95%E4%B8%93%E7%89%88-%E9%AB%98%E5%87%86%E7%A1%AE%E7%8E%87%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/430643/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%5B%E8%80%83%E8%AF%95%E4%B8%93%E7%89%88-%E9%AB%98%E5%87%86%E7%A1%AE%E7%8E%87%5D.meta.js
// ==/UserScript==
 
// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒
 
    // 1代表开启，0代表关闭
    ,none: 0 // 未找到答案或无匹配答案时执行默认操作，默认关闭
    ,jump: 1 // 答题完成后自动切换，默认关闭
    ,copy: 0 // 自动复制答案到剪贴板，也可以通过手动点击按钮或答案进行复制，默认关闭
 
    // 非自动化操作
    ,hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
    ,over: 0 // 延长答题时间，避免超时自动交卷，默认关闭
    ,log: 0 // 屏蔽答题日志上传，教师端监考无痕，可用于配合over参数，默认关闭
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
    '<div style="border: 2px dashed rgb(190 ,231 ,233); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(190 ,231 ,233, 0.6); overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="font-size: medium;">正在搜索答案...</div>' +
        '<button style="margin-right: 10px;">暂停答题</button>' +
        '<button style="margin-right: 10px;' + (setting.jump ? '' : ' display: none;') + '">点击停止本次切换</button>' +
        '<button style="margin-right: 10px;">重新查询</button>' +
        '<button style="margin-right: 10px; display: none;">复制答案</button>' +
        '<button>答题详情</button>' +
        '<div style="max-height: 200px; overflow-y: auto;">' +
            '<table border="1" style="font-size: 12px;">' +
                '<thead>' +
                    '<tr>' +
                        '<th colspan="2">' + ($('#randomOptions').val() == 'true' ? '<font color="red">本次考试的选项为乱序 脚本已将选项重新标注</font>' : '') + '</th>' +
                    '</tr>' +
                    '<tr>' +
                        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
                        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="' + (setting.jump ? 'display: none;' : '') + '">' +
                    '<tr>' +
                        '<th colspan="2">已关闭 本次自动切换</th>' +
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
            num = ['已暂停搜索', '继续答题'];
        } else {
            setting.loop = setInterval(findTiMu, setting.time);
            num = ['正在搜索答案...', '暂停答题'];
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
 
if (setting.over) _self.maxtime = 36E3;
if (setting.log) _self.pushExamMonitorLog = $.noop;
if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
$.each(UE.instants, function() {
    var key = this.key;
    this.ready(function() {
        this.destroy();
        UE.getEditor(key);
    });
});
$('.Cy_ulBottom input').each(function(index) {
    if (setting.TiMu[1] > 1) return;
    $(this).parent().contents().eq(1).replaceWith(' &nbsp;&nbsp; ' + this.value);
    $('.Cy_ulTop i').eq(index).text(this.value + '、');
});
setting.loop = setInterval(findTiMu, setting.time);
 
function findTiMu() {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://onlinecoursekiller.online/OnlineCourseKiller/killer',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'q=' + encodeURIComponent(setting.TiMu[0]),
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
                            '<td title="点击可复制">' + que + '</td>' +
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
            data.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && this.click();
        } else if (this.value == 'false') {
            data.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && this.click();
        } else {
            index = setting.TiMu[3][index].toCDB() || new Date().toString();
            index = $.inArray(index, data) + 1 || (setting.TiMu[1] == '1' && str.indexOf(index) + 1);
            Boolean(index) == this.checked || this.click();
        }
    }).each(function() {
        if (!/^A?B?C?D?E?F?G?$/.test(opt)) return false;
        Boolean(opt.match(this.value)) == this.checked || this.click();
    });
    if (setting.TiMu[1].match(/^[013]$/)) {
        tip = $input.is(':checked') || setting.none && (($input[Math.floor(Math.random() * $input.length)] || $()).click(), ' ');
    } else if (setting.TiMu[1].match(/^(2|[4-9]|1[08])$/)) {
        data = String(obj.answer).split(/#|\x01|\|/);
        tip = $('.Cy_ulTk textarea').each(function(index) {
            index = (obj.success == "true" && data[index]) || '';
            UE.getEditor(this.name).setContent(index.trim());
        }).length;
        tip = (obj.success == "true" && data.length == tip) || setting.none && ' ';
        setting.len = str.length * setting.time / 10;
    }
    if (tip == ' ') {
        tip = '已执行默认操作';
    } else if (tip) {
        tip = '自动答题已完成';
    } else if (tip === undefined) {
        tip = '该题型不支持自动答题';
    } else {
        tip = '未找到有效答案';
    }
    if (btn) {
        tip += setting.jump ? '，即将切换下一题' : '，未开启自动切换';
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
        tip = '答题已完成，请自行查看答题详情';
    }
    setting.$div.data('html', tip).siblings('button:eq(0)').hide().click();
}
function filterImg(dom) {
    return $(dom).clone().find('img[src]').replaceWith(function() {
        return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
    }).end().find('iframe[src]').replaceWith(function() {
        return $('<p></p>').text('<iframe src="' + $(this).attr('src') + '"></irame>');
    }).end().text().trim();
}
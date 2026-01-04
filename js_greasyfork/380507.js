// ==UserScript==
// @name         VIP6（考试专版）
// @namespace    soospai@163.com
// @version      1.0.4
// @description  自动搜索尔雅MOOC考试答案，支持自动答题、自动切换题目、隐藏答案搜索提示框，支持自定义每个功能的开启或关闭
// @author       wyn
// @match        *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @match        *://*.edu.cn/exam/test/reVersionTestStartNew*
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/380507/VIP6%EF%BC%88%E8%80%83%E8%AF%95%E4%B8%93%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/380507/VIP6%EF%BC%88%E8%80%83%E8%AF%95%E4%B8%93%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒
    ,token: '' // 捐助用户可以使用上传选项功能，更精准的匹配答案，此处填写捐助后获取的识别码

    // 1代表开启，0代表关闭
    ,none: 0 // 未找到答案或无匹配答案时执行默认操作，默认关闭
    ,jump: 1 // 答题完成后自动切换，默认开启
    ,copy: 0 // 自动复制答案到剪贴板，也可以通过手动点击按钮或答案进行复制，默认关闭

    // 非自动化操作
    ,hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
    ,paste: 1 // 文本编辑器允许粘贴，用于解除文本类题目的粘贴限制，默认开启
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭
},
_self = unsafeWindow,
$ = _self.jQuery,
UE = _self.UE;

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
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
        '<span style="font-size: medium;"></span>' +
        '<div style="font-size: medium;">正在搜索答案...</div>' +
        '<button style="margin-right: 10px;">暂停答题</button>' +
        '<button style="margin-right: 10px;' + (setting.jump ? '' : ' display: none;') + '">点击停止本次切换</button>' +
        '<button style="margin-right: 10px;">重新查询</button>' +
        '<button style="margin-right: 10px; display: none;">复制答案</button>' +
        '<button>答题详情</button>' +
        '<div style="max-height: 300px; overflow-y: auto;">' +
            '<table border="1" style="font-size: 12px;">' +
                '<thead>' +
                    '<tr>' +
                        '<th colspan="2">' + ($('#randomOptions').val() == 'false' ? '' : '<font color="red">本次考试的选项为乱序 脚本会选择正确的选项</font>') + '</th>' +
                    '</tr>' +
                    '<tr>' +
                        '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
                        '<th style="min-width: 130px;">答案（点击可复制）</th>' +
                    '</tr>' +
                '</thead>' +
                '<tfoot style="' + (setting.jump ? ' display: none;' : '') + '">' +
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

if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
$('script').prev('textarea').each(function(index, value) {
    UE.getEditor(this.name).ready(function() {
        this.destroy();
        UE.getEditor(value.name).addListener('beforepaste', setting.paste ? $.noop : _self.myEditor_paste);
    });
});
setting.paste && $('input[onpaste]').removeAttr('onpaste');
setting.loop = setInterval(findTiMu, setting.time);

function findTiMu() {
    var option = setting.token && setting.TiMu[3].filter(function() {
        return this.length;
    }).get().join('#');
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://mooc.forestpolice.org/cx/' + (setting.token || 0) + '/' + encodeURIComponent(setting.TiMu[0]),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'exam=' + encodeURIComponent(setting.TiMu[2]) + '&type=' + setting.TiMu[1] + '&option=' + encodeURIComponent(option),
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText) || {};
                if (obj.code) {
                    obj.data = filterImg($('<p></p>').append(obj.data).not('script'));
                    setting.div.find('tbody').append(
                        '<tr>' +
                            '<td title="点击可复制">' + setting.TiMu[0] + '</td>' +
                            '<td title="点击可复制">' + (/^http/.test(obj.data) ? '<img src="' + obj.data + '">' : '') + obj.data + '</td>' +
                        '</tr>'
                    );
                    setting.copy && GM_setClipboard(obj.data);
                    setting.$btn.eq(3).show();
                    fillAnswer(obj);
                } else {
                    setting.$div.html(obj.data || '服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                setting.$btn.eq(0).click();
                setting.$div.text('请求过于频繁，建议稍后再试');
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
    data = String(obj.data).split(/#|\s*\x01\s*|\|/),
    btn = $('.saveYl:contains("下一题")').offset();
    // $input.filter(':radio:checked').prop('checked', false);
    obj.code > 0 && $input.each(function(index) {
        if (this.value == 'true') {
            /(^|#)(正确|是|对|√)(#|$)/.test(obj.data) && this.click();
        } else if (this.value == 'false') {
            /(^|#)(错误|否|错|×)(#|$)/.test(obj.data) && this.click();
        } else {
            index = setting.TiMu[3][index] || new Date().toString();
            index = $.inArray(index, data) + 1 || (setting.TiMu[1] == '1' && String(obj.data).match(index));
            Boolean(index) == this.checked || this.click();
        }
    }).each(function() {
        if (!/^[A]?[B]?[C]?[D]?[E]?[F]?[G]?$/.test(obj.data)) return false;
        Boolean(String(obj.data).match(this.value)) == this.checked || this.click();
    });
    if (setting.TiMu[1].match(/^[013]$/)) {
        tip = $input.is(':checked') || setting.none && (($input[Math.floor(Math.random() * $input.length)] || $()).click(), '不会');
    } else if (setting.TiMu[1].match(/^(2|[4-9]|1[08])$/)) {
        var $li = $('.Cy_ulTk li');
        tip = (obj.code > 0 && data.length == $li.length) || setting.none && '不会';
        tip && $li.each(function(index, dom) {
            data[index] = (obj.code > 0 && data[index]) || '不会';
            dom = $('.inp', this).filter(':visible').val(data[index]).end().is(':hidden') ? $(this).next() : dom;
            $('.edui-default + textarea', dom).each(function() {
                UE.getEditor(this.name).setContent(data[index]);
            });
        });
        setting.len = String(obj.data).length * setting.time / 10;
    }
    if (tip == '不会') {
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
    }).end().text().trim();
}
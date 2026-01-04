// ==UserScript==
// @name         超星网课助手2.0(考试专版)
// @namespace    wyn665817@163.com
// @version      2.0.0
// @description  自动搜索尔雅MOOC考试答案，支持自动答题、自动切换题目、隐藏答案搜索提示框，支持自定义每个功能的开启或关闭
// @author       wyn665817
// @match        *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @supportURL   https://greasyfork.org/zh-CN/scripts/373131/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/379862/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B20%28%E8%80%83%E8%AF%95%E4%B8%93%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/379862/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B20%28%E8%80%83%E8%AF%95%E4%B8%93%E7%89%88%29.meta.js
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
    ,hide: 0 // 隐藏答案搜索提示框，默认关闭
    ,paste: 1 // 文本编辑器允许粘贴，用于解除简答题题目的粘贴限制，默认开启
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于简答题题目，答题框根据内容自动调整大小，默认关闭
},
_self = unsafeWindow,
$ = _self.$,
UE = _self.UE;

setting.TiMu = [
    $('.Cy_TItle .clearfix').text().trim(),
    $('[name^=type]:not([id])').val(),
    $('.cur a').text().trim(),
    $('li .clearfix').map(function() {
        return $(this).text().trim();
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
                        '<th style="width: 60%; min-width: 130px;">题目</th>' +
                        '<th style="min-width: 130px;">答案</th>' +
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
).appendTo('body').toggle(!setting.hide).on('click', 'button, td', function() {
    var num = setting.$btn.index(this);
    if (num == -1) {
        GM_setClipboard($(this).text());
    } else if (num == 0) {
        if (setting.out) {
            clearInterval(setting.out);
            delete setting.out;
            setting.$div.text('已暂停搜索');
            $(this).text('继续答题');
        } else {
            setting.out = setInterval(findTiMu, setting.time);
            setting.$div.text('正在搜索答案...');
            $(this).text('暂停答题');
        }
    } else if (num == 1) {
        setting.jump = 0;
        setting.$div.text(function(index, text) {
            return text.replace('即将切换下一题', '未开启自动切换');
        });
        $(this).add(setting.div.find('tfoot')).toggle();
    } else if (num == 2) {
        location.reload();
    } else if (num == 3) {
        GM_setClipboard(setting.div.find('td:last').text());
    } else if (num == 4) {
        $('.leftCard .saveYl')[0].click();
    }
});
setting.$div = setting.div.children('div:eq(0)');
setting.$btn = setting.div.children('button');

$(document).keydown(function(event) {
    if (event.keyCode == 38) {
        setting.div.hide();
    } else if (event.keyCode == 40) {
        setting.div.show();
    }
});

setTimeout(relieveLimit, setting.time / 2);
setting.out = setInterval(findTiMu, setting.time);

function relieveLimit() {
    UE && setting.scale && (_self.UEDITOR_CONFIG.scaleEnabled = false);
    UE && $('.edui-default + textarea').each(function() {
        UE.getEditor($(this).attr('name')).ready(function() {
            this.autoHeightEnabled = true;
            setting.scale && this.enableAutoHeight();
            setting.paste && this.removeListener('beforepaste', _self.myEditor_paste);
        });
    });
    if (!setting.paste) return;
    $('input[onpaste]').removeAttr('onpaste');
    _self.myEditor_paste = function() {};
    // _self.pasteText = function() {return true};
}

function findTiMu() {
    if (setting.$next) return setting.jump && setting.$next[0].click();
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
            if (!setting.out) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText);
                if (obj.code) {
                    setting.$btn.eq(0).hide();
                    setting.$btn.eq(3).show();
                    setting.div.find('tbody').append(
                        '<tr>' +
                            '<td>' + setting.TiMu[0] + '</td>' +
                            '<td>' + obj.data + '</td>' +
                        '</tr>'
                    );
                    setting.copy && GM_setClipboard(obj.data);
                    fillAnswer(obj);
                } else {
                    setting.$div.text(obj.data || '服务器繁忙，正在重试...');
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
            setting.out && setting.$div.text('服务器超时，正在重试...');
        }
    });
}

function fillAnswer(obj, tip) {
    var $input = $('.Cy_ulBottom input'),
    data = String(obj.data).split('#');
    // $input.filter(':radio:checked').prop('checked', false);
    obj.code == 1 && $input.each(function(index) {
        if (this.value == 'true') {
            ($.inArray('正确', data) + 1 || $.inArray('是', data) + 1) && this.click();
        } else if (this.value == 'false') {
            ($.inArray('错误', data) + 1 || $.inArray('否', data) + 1) && this.click();
        } else {
            tip = $.inArray(setting.TiMu[3][index], data) + 1 || (setting.TiMu[1] == '1' && obj.data.indexOf(setting.TiMu[3][index]) + 1);
            this.checked == tip || this.click();
        }
    });
    if (setting.TiMu[1].match(/^(0|1|3)$/)) {
        tip = $input.filter(':checked').length || setting.none && ($input[0].click(), '不会');
    } else if (Number(setting.TiMu[1]) > 7) {
    } else if ($('#submitTest textarea').length) {
        var $li = $('.Cy_ulTk li');
        tip = (obj.code == 1 && data.length == $li.length) || setting.none && '不会';
        UE && $li.each(function(index, dom) {
            data[index] = tip ? (obj.code == 1 && data[index]) || '不会' : '';
            var $input = $(this).find('.inp');
            $input.is(':hidden') ? (dom = $(this).next()) : $input.val(data[index]);
            var $edit = $(dom).find('.edui-default + textarea');
            $edit.length && UE.getEditor($edit.attr('name')).setContent(data[index]);
        });
    }
    if (tip == '不会') {
        tip = '已执行默认操作';
    } else if (tip) {
        tip = '自动答题已完成';
    } else if (tip == undefined) {
        tip = '该题型不支持自动答题';
    } else {
        tip = '未找到有效答案';
    }
    setting.$next = $('.saveYl:contains("下一题")');
    if (setting.$next.length) {
        var text = '，即将切换下一题';
        if (!setting.jump) {
            clearInterval(setting.out);
            text = '，未开启自动切换';
        }
        setting.$div.text(tip + text);
    } else {
        setting.$btn.eq(1).hide();
        setting.$div.text('考试已完成');
        clearInterval(setting.out);
    }
}
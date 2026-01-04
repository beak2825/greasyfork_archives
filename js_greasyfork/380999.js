// ==UserScript==
// @name         智慧树自动答题
// @namespace    wyn665817@163.com
// @version      1.2.1
// @description  修改为仅支持自动答题，原内容为（自动挂机看知到MOOC，支持屏蔽弹窗题目、自动切换视频，在线搜索题目答案，支持自动倍速播放、线路选择、默认静音）原作者wyn665817@163.com
// @icon        http://assets.zhihuishu.com/icon/favicon.ico
// @author       wyn665817
// @match        *://examh5.zhihuishu.com/stuExamWeb.html*
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @supportURL   https://greasyfork.org/zh-CN/scripts/380506/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/380999/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/380999/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
var setting = {
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒
    ,work: 1 // 自动答题功能，支持章测试、考试，高准确率，默认开启
    ,none: 0 // 无匹配答案时执行默认操作，默认关闭
},
_self = unsafeWindow,
url = location.pathname,
$ = _self.jQuery;
if (!$) {
}  else if (url.match('/stuExamWeb.html') && location.hash != '#/') {
    setting.work && beforeFind();
}
function beforeFind() {
    setting.div = $(
        '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; left: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
            '<span style="font-size: medium;"></span>' +
            '<div style="font-size: medium;">正在搜索答案...</div>' +
            '<button style="margin-right: 10px;">暂停答题</button>' +
            '<button style="margin-right: 10px;">重新查询</button>' +
            '<button style="margin-right: 10px;">折叠面板</button>' +
            '<button style="display: none;">未作答题目</button>' +
            '<div style="max-height: 300px; overflow-y: auto;">' +
                '<table border="1" style="font-size: 12px;">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 30px; min-width: 30px; font-weight: bold; text-align: center;">题号</th>' +
                            '<th style="width: 60%; min-width: 130px; font-weight: bold; text-align: center;">题目（点击可复制）</th>' +
                            '<th style="min-width: 130px; font-weight: bold; text-align: center;">答案（点击可复制）</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tfoot style="display: none;">' +
                        '<tr>' +
                            '<th colspan="3" style="font-weight: bold; text-align: center;">答案提示框 已折叠</th>' +
                        '</tr>' +
                    '</tfoot>' +
                    '<tbody>' +
                        '<tr>' +
                            '<td colspan="3" style="display: none;"></td>' +
                        '</tr>' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>'
    ).appendTo('body').on('click', 'button, td', function() {
        var len = $(this).prevAll('button').length;
        if (this.tagName == 'TD') {
            $(this).prev().length && GM_setClipboard($(this).text());
        } else if (len == 0) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                setting.div.children('div:eq(0)').text('已暂停搜索');
                $(this).text('继续答题');
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                setting.div.children('div:eq(0)').text('正在搜索答案...');
                $(this).text('暂停答题');
            }
        } else if (len == 1) {
            location.reload();
        } else if (len == 2) {
            setting.div.find('tbody, tfoot').toggle();
        } else if (len == 3) {
            var $white = $('.el-scrollbar__wrap .white');
            $white.length ? $white.eq(0).click() : $(this).hide();
        }
    });
    setting.lose = setting.num = 0;
    setting.loop = setInterval(findAnswer, setting.time);
}
function findAnswer() {
    if (!setting.num) {
        setting.curs = $('.infoList span').map(function(index) {
            return $(this).text().trim();
        }).get();
        if (!setting.curs.length) {
            return;
        } else if (setting.limit) {
            var doc = document;
            doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
        }
    } else if (setting.num >= $('.examPaper_subject').length) {
        clearInterval(setting.loop);
        setting.div.children('button:eq(0)').hide();
        setting.div.children('button:eq(3)').toggle(!!setting.lose);
        var text = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
        return setting.div.children('div:eq(0)').html(text);
    }
    var $TiMu = $('.examPaper_subject').eq(setting.num),
    question = $TiMu.find('.subject_describe').map(function() {
        return $(this).find('img').length ? $(this).html() : $(this).text().trim();
    })[0] || '',
    type = $TiMu.find('.subject_type').text().trim().match(/【(.+)】/),
    option = setting.token && $TiMu.find('.node_detail').map(function() {
        return $(this).text().trim();
    }).filter(function() {
        return this.length;
    }).get().join('#');
    type = type ? {'单选题': 1, '多选题': 2, '判断题': 14}[type[1]] || 0 : -1;
    option = $.inArray(type, [1, 2]) + 1 ? option : '';
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://mooc.forestpolice.org/zhs/' + (setting.token || 0) + '/' + encodeURIComponent(question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(setting.curs[0]) + '&chapter=' + encodeURIComponent(setting.curs[1]) + '&type=' + type + '&option=' + encodeURIComponent(option),
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText);
                if (obj.code) {
                    setting.div.children('div:eq(0)').text('正在搜索答案...');
                    $(
                        '<tr>' +
                            '<td style="text-align: center;">' + $TiMu.find('.subject_num').text().trim() + '</td>' +
                            '<td title="点击可复制">' + question + '</td>' +
                            '<td title="点击可复制">' + obj.data + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', fillAnswer($TiMu, obj, type) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.num++;
                } else {
                    setting.div.children('div:eq(0)').text(obj.data || '服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                setting.div.children('button').eq(0).click();
                setting.div.children('div:eq(0)').text('请求过于频繁，建议稍后再试');
            } else {
                setting.div.children('div:eq(0)').text('服务器异常，正在重试...');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div:eq(0)').text('服务器超时，正在重试...');
        }
    });
}

function fillAnswer($TiMu, obj, type) {
    var $div = $TiMu.find('.nodeLab'),
    data = String(obj.data).split('#'),
    state = setting.lose;
    // $div.find(':radio:checked').prop('checked', false);
    obj.code == 1 && $div.each(function() {
        var $input = $(this).find('input')[0] || $(),
        tip = $(this).find('.node_detail').text().trim() || new Date();
        Boolean($.inArray(tip, data) + 1 || (type == 2 && String(obj.data).indexOf(tip) + 1)) == $input.checked || $input.click();
    });
    if ($.inArray(type, [1, 2, 14]) + 1) {
        var $input = $div.find('input');
        $input.filter(':checked').length || (setting.none ? ($div.find('input')[Math.floor(Math.random() * $input.length)] || $()).click() : setting.lose++);
    } else if (!$div.length) {
        (obj.code == 1 && data.length == $div.length) || setting.none || setting.lose++;
        data[0] = state == setting.lose ? (obj.code == 1 && data[0]) || '不会' : '';
        _self.UE.getEditor('editor' + $TiMu.find('.subject_node input:hidden').val()).setContent(data[0]);
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}
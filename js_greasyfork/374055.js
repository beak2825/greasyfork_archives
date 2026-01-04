// ==UserScript==
// @name         半度微凉助手2
// @namespace    http://www.yunhot.cn/
// @version      1.1
// @description  123
// @author       QQ：523293660
// @match        *://*.chaoxing.com/exam/test/reVersionTestStartNew*
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/374055/%E5%8D%8A%E5%BA%A6%E5%BE%AE%E5%87%89%E5%8A%A9%E6%89%8B2.user.js
// @updateURL https://update.greasyfork.org/scripts/374055/%E5%8D%8A%E5%BA%A6%E5%BE%AE%E5%87%89%E5%8A%A9%E6%89%8B2.meta.js
// ==/UserScript==


// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 3E3 == 3000，表示毫秒数
    time: 3E3 // 默认响应速度为3秒，不建议小于2秒

    // 1代表开启，0代表关闭
    ,auto: 1 // 自动答题功能，默认开启
    ,retry: 1 // 服务器异常时进行重试，默认关闭
    ,hide: 0 // 隐藏答案搜索提示框，默认关闭
    ,copy: 1 // 文本编辑器允许粘贴，用于解除简答题题目的粘贴限制，默认开启
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于简答题题目，答题框根据内容自动调整大小，默认关闭

    // 仅开启auto时，修改此处才会生效
    ,jump: 1 // 答题完成后自动切换，默认开启
    ,none: 0 // 未找到答案时选择默认选项，默认关闭

    // 仅开启jump时，修改此处才会生效
    ,other: 0 // 对不支持自动答题的题目进行跳转，默认关闭
},
_self = unsafeWindow,
$ = _self.$,
UE = _self.UE;

setting.text = ['自动答题已完成，', '已选择默认选项，', '未找到匹配的答案，', '该题型不支持自动答题，', '已选择答案，'];
setting.type = $('.current').parent().prev().text();
setting['单选题'] = function(event) {
    $('#submitTest ul:eq(0) .clearfix').each(function() {
        if ($(this).text().trim() == event) {
            setting.check = $(this).click();
            return false;
        }
    });
    checkDef();
};
setting['多选题'] = function(event) {
    var index = 0,
    arr = event.split('#'),
    $check = $('#submitTest ul:eq(0) .clearfix'),
    timeId = setInterval(function() {
        if (index >= $check.length) {
            clearInterval(timeId);
            checkDef();
        } else {
            var tip = $.inArray($check.eq(index).text().trim(), arr) >= 0;
            $('#submitTest :checkbox').eq(index).prop('checked') == tip || $check.eq(index).click();
            setting.check = tip ? [1] : setting.check;
        }
        index++;
    }, setting.time);
};
setting['判断题'] = function(event) {
    var $input = $('#submitTest ul input');
    if (event == '正确' || event == '是') {
        setting.check = $input.eq(0).click();
    } else if (event == '错误' || event == '否') {
        setting.check = $input.eq(1).click();
    }
    checkDef();
};
setting.div = setting.hide ? $() : $(
    '<div style="border: 2px dashed rgb(0, 85, 68); width: 350px; position: fixed; top: 0; right: 0; z-index: 9999; background-color: rgba(70, 196, 38, 0.6); overflow: auto;">' +
        '<div style="font-size: medium;">正在搜索答案...</div>' +
        '<button style="margin-right: 10px;">暂停答题</button>' +
        '<button style="margin-right: 10px;' + (setting.auto && setting.jump ? '' : ' display: none;') + '">点击停止本次切换</button>' +
        '<button>重新查询</button>' +
        '<table border="1" style="font-size: 12px;">' +
            '<tr>' +
                '<td width="60%">题目</td>' +
                '<td width="40%">答案</td>' +
            '</tr>' +
        '</table>' +
    '</div>'
).appendTo('body');

setting.div.children('button').on('click', function() {
    var len = $(this).prevAll('button').length;
    if (len == 0) {
        if (setting.out) {
            clearTimeout(setting.out);
            delete setting.out;
            setting.div.children('div').text('已暂停搜索');
            $(this).text('继续答题');
        } else {
            setting.out = setTimeout(findTiMu, setting.time);
            setting.div.children('div').text('正在搜索答案...');
            $(this).text('暂停答题');
        }
    } else if (len == 1) {
        clearTimeout(setting.timeid);
        setting.jump = 0;
        setting.div.children('div').text((setting.tip == undefined ? '' : setting.text[setting.tip]) + '已关闭本次自动切换');
        $(this).hide();
    } else if (len == 2) {
        $('.current')[0].click();
    }
});

setting.copy && $('input[onpaste]').removeProp('onpaste');
UE && $('textarea').each(function() {
    var editor = $(this).attr('name');
    setting.copy && UE.getEditor(editor).removeListener('beforepaste', _self.myEditor_paste);
    setting.scale && UE.getEditor(editor).ready(function() {
        var $hide = $('textarea').parent(':hidden').show();
        this.destroy();
        $hide.hide();
        UE.getEditor(editor, {
            scaleEnabled: false
        });
    });
});
if (!setting.other || setting[setting.type]) {
    setting.out = setTimeout(findTiMu, setting.time);
} else {
    jumpTimu(3);
}

function findTiMu() {
    var TiMu = $('.TiMu .Cy_TItle .clearfix').text().trim();
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://www.forestpolice.org/php/unify.php',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'question=' + encodeURIComponent(TiMu) + '&username=test00&password=123456',
        timeout: setting.time * 2,
        onload: function(xhr) {
            if (!setting.out) {
            } else if (xhr.status == 200) {
                var obj = JSON.parse(xhr.responseText);
                if (obj.code) {
                    setting.div.children('button').eq(0).hide();
                    setting.div.children('table').append('<tr><td>' + TiMu + '</td><td>' + obj.data + '</td></tr>');
                    if (!setting[setting.type]) {
                        setting.div.children('div').text('该题型不支持自动答题，请手动完成');
                        setting.div.children('button').eq(1).hide();
                    } else if (setting.auto) {
                        setting.div.children('div').text('答案搜索已完成，正在自动答题...');
                        setting[setting.type](obj.data);
                    } else {
                        setting.div.children('div').text('答案搜索已完成，未开启自动答题');
                    }
                } else {
                    errorGo('错误');
                }
            } else {
                errorGo('异常');
            }
        },
        ontimeout: function() {
            setting.out && errorGo('超时');
        }
    });
}

function errorGo(err) {
    if (setting.retry) {
        setting.div.children('div').text('服务器' + err + '，正在重新搜索答案');
        setting.out = setTimeout(findTiMu, setting.time * 2);
    } else {
        setting.div.children('div').text('服务器' + err + '，未开启自动重试');
    }
}

function checkDef() {
    var id = 0;
    if (!$('#submitTest :checked').length) {
        if (setting.none) {
            $(':radio, :checkbox', '#submitTest').eq(0).click();
            id = 1;
        } else if (setting.other) {
            id = 2;
        } else {
            setting.div.children('div').text('无正确答案，未开启选择默认选项');
            setting.div.children('button').eq(1).hide();
            return;
        }
    } else if (setting.check && setting.check.length) {
        id = 4;
    }
    jumpTimu(id);
}

function jumpTimu(id) {
    var $next = $('.leftBottom a:contains("下一题")');
    if ($next.hasClass('saveYl01')) {
        setting.div.children('div').text('考试已完成');
    } else {
        var text = '未开启自动切换';
        if (setting.jump) {
            text = '即将切换下一题';
            setting.tip = id;
            setting.timeid = setTimeout(function() {
                $next[0].click();
            }, setting.time);
        }
        setting.div.children('div').text(setting.text[id] + text);
    }
}
// ==UserScript==
// @name         智慧树网课助手(个人题库)(可答题)
// @namespace    冷月长空
// @version      3.0.3
// @description  自动挂机看知到MOOC，支持屏蔽弹窗题目、自动切换下一节，章测试和考试支持自动答题，视频自动倍速播放、线路选择、默认静音等，解除各类功能限制，开放自定义参数
// @author       冷月长空
// @match        *://*.zhihuishu.com/*
// @connect      lysq.shop
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/401783/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%28%E4%B8%AA%E4%BA%BA%E9%A2%98%E5%BA%93%29%28%E5%8F%AF%E7%AD%94%E9%A2%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/401783/%E6%99%BA%E6%85%A7%E6%A0%91%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%28%E4%B8%AA%E4%BA%BA%E9%A2%98%E5%BA%93%29%28%E5%8F%AF%E7%AD%94%E9%A2%98%29.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 8E3 == 8000，科学记数法，表示毫秒数
    time: 8E3 // 默认响应速度为8秒，不建议小于5s

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持课程、见面课，默认开启
    ,work: 1 // 自动答题功能，支持章测试、考试，高准确率，默认开启
    ,jump: 1 // 自动切换视频，支持课程、见面课，默认开启

    // 仅开启video时，修改此处才会生效
    ,line: '流畅' // 视频播放的默认线路，可选参数：['高清', '流畅', '校内']，默认'流畅'
    ,vol: '0' // 默认音量的百分数，设定范围：[0,100]，'0'为静音，默认'0'
    ,speed: '1.5' // 进度统计速率，高倍率可以快速完成任务点，设定范围：(0,+∞)，默认'1.5'倍
    // 上方参数支持在页面改动，下方参数仅支持代码处修改
    ,que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
    ,danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭
    ,habit: '0' // 限制视频挂机时长，单位是分钟，如需挂机习惯分，可以修改参数为'30'，默认不限制

    // 仅开启work时，修改此处才会生效
    ,none: 0 // 无匹配答案时执行默认操作，默认关闭
    ,hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
},
_self = unsafeWindow,
url = location.pathname,
$ = _self.jQuery,
xhr = _self.XMLHttpRequest;

String.prototype.toCDB = function() {
    return this.replace(/\s/g, '').replace(/[\uff01-\uff5e]/g, function(str) {
        return String.fromCharCode(str.charCodeAt(0) - 65248);
    }).replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/。/g, '.');
};

setting.queue = setting.curs = [];

if (!$) {
} else if (url.match('/videoList')) {
    $.tmDialog.alert({content: '2.X版本已取消支持旧版界面', title: '智慧树网课助手提示'});
} else if (url == '/videoStudy.html') {
    setting.habit *= 6E4;
    setting.video && hookVideo(_self.vjsComponent, 1);
    setting.jump && setInterval(checkToNext, setting.time);
} else if (url == '/portals_h5/2clearning.html') {
    setting.video && hookVideo(_self.vjsComponent, 2);
    setting.jump && setInterval(checkToNext, setting.time);
} else if (url == '/live/vod_room.html') {
    setting.video && hookVideo(_self.vjsComponent);
    setting.jump && setInterval(checkToNext, setting.time, 1);
} else if (location.hostname.match('examh5')) {
    setTimeout(relieveLimit, 100, document);
    if (location.hash.match(/dohomework|doexamination/) && setting.work) beforeFind();
    $(window).on('hashchange', function() {
        setting.work && location.reload();
    });
} else if (url.match('/sourceLearning')) {
    setting.video && hookVideo(_self.vjsComponent, 3);
    setting.jump && setInterval(checkToNext, setting.time, $('.source-file-item'));
} else if (url == '/shareCourse/questionDetailPage') {
    setTimeout(relieveLimit, 100, document);
    $('textarea[oncut]').each(function() {
        setTimeout(relieveLimit, 100, this);
    });
} else if (url.match('exerciseList') && setting.work) {
    _self.XMLHttpRequest = hookHiexam;
    setInterval(function() {
        $(setting.queue.shift()).parent().click();
    }, 1E3);
    setting.jump && setInterval(function() {
        setting.queue.length || $('.Topicswitchingbtn:contains(下一题)').click();
    }, setting.time);
}

function hookVideo(Hooks, tip) {
    _self.vjsComponent = function() {
        var config = arguments[0],
        options = config.options,
        line = $.map(options.sourceSrc.lines, function(value) {
            return value.lineName.replace('标准', '高清');
        }),
        vol = setting.vol > 100 ? 100 : setting.vol,
        rate = tip == 3 ? [1, 1.25, 1.5, 2, 2.5, 3] : [1, 1.25, 1.5];
        vol = Math.round(vol) / 100;
        options.volume = vol > 0 ? vol : 0;
        options.autostart = true;
        setting.speed = setting.speed > 0 ? +setting.speed : 1;
        options.rate = $.inArray(setting.speed, rate) < 0 ? options.rate : setting.speed;
        tip && config.callback.playbackRate(setting.speed);
        options.chooseLine = $.inArray(setting.line, line) + 1 || options.chooseLine + 1;
        options.src = options.sourceSrc.lines[--options.chooseLine].lineUrl || options.src;
        if (!setting.danmu) {
            config.defOptions.control.danmuBtn = false;
            delete options.control.danmuBtn;
        }
        Hooks.apply(this, arguments);
        config.player.on('loadstart', function() {
            this.loop(true);
            this.play();
            $('.speedBox span').text('X ' + setting.speed);
        });
    };
    $(document).on('click', '.definiLines b', function() {
        setting.line = ({xiaonei: '校内', line1gq: '高清', line1bq: '流畅'})[this.classList[0]];
    }).on('mouseup click', function() {
        setting.vol = _self.PlayerStarter.playerArray[0].player.cache_.volume * 100;
    }).on('click', '.speedList div', function() {
        setting.speed = $(this).attr('rate');
    });
    if (tip != 1) return;
    setting.tip = setting.habit && setInterval(totalTime, setting.time);
    setInterval(doTest, 1E3);
    _self.XMLHttpRequest = setting.que ? function() {
        var ajax = new xhr(),
        open = ajax.open;
        ajax.open = function(method, url) {
            if (url.match('/loadVideoPointerInfo')) method = 'OPTIONS';
            return open.apply(this, arguments);
        };
        return ajax;
    } : xhr;
}

function totalTime() {
    var player = _self.PlayerStarter.playerArray[0].player;
    setting.habit -= player.paused() ? 0 : setting.time;
    if (setting.habit >= 0) return;
    clearInterval(setting.tip);
    player.pause();
    $.getScript('//cdn.jsdelivr.net/gh/sentsin/layer/dist/layer.js', function() {
        _self.layer.open({content: '已达到挂机限制时间', title: '智慧树网课助手提示', end: function() {
            setting.habit = 0;
        }});
    });
}

function checkToNext(tip) {
    if (setting.habit < 0) return;
    var $tip = $('.video, .lessonItem');
    if ($('.current_play .time_icofinish').length) {
        $tip.slice($tip.index($('.current_play')) + 1).not(':has(.time_icofinish)').eq(0).click();
    } else if ($('.lessonItemActive .finish').length) {
        $tip.slice($tip.index($('.lessonItemActive')) + 1).not(':has(.finish)').eq(0).click();
    } else if (tip == 1) {
        $('.current_player:contains("100%") + li').click();
    } else if ($('.settleOn .finish').length) {
        tip.slice(tip.index($('.settleOn')) + 1).not(':has(.finish)').eq(0).find('.file-name').click();
    }
}
function doTest() {
    if (!$('.dialog-test').length) {
    } else if (setting.queue.length) {
        $(setting.queue.shift()).parent().click();
    } else if (!$('.answer').length) {
        $('.topic-item').eq(0).click();
    } else if (!$('.right').length) {
        var tip = $('.answer span').text().match(/[A-Z]/g) || [];
        if (tip.length == 1) return $('.topic-option-item:contains(' + tip[0] + ')').click();
        $('.topic-option-item').each(function() {
            $.inArray($(this).text().slice(0, 1), tip) < 0 == $(this).hasClass('active') && setting.queue.push(this);
        });
    } else if ($('.btn-next:enabled').length) {
        $('.btn-next:enabled').click();
    } else {
        $('.dialog-test .btn').click();
        _self.PlayerStarter.playerArray[0].player.play();
    }
}

function relieveLimit(doc) {
    if (!doc.oncut && !doc.onselectstart) return setTimeout(relieveLimit, 100, doc);
    doc.oncontextmenu = doc.onpaste = doc.oncopy = doc.oncut = doc.onselectstart = null;
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
            '<form style="margin: 2px 0;">' +
                '<label style="font-weight: bold; color: red;">自定义答题范围：</label>' +
                '<input name="num" type="number" min="1" placeholder="开始" style="width: 60px;" disabled>' +
                '<span> ~ </span>' +
                '<input name="max" type="number" min="1" placeholder="结束" style="width: 60px;" disabled>' +
            '</form>' +
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
        if (this.nodeName == 'TD') {
            $(this).prev().length && GM_setClipboard($(this).text());
        } else if (len === 0) {
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                len = [false, '已暂停搜索', '继续答题'];
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                len = [true, '正在搜索答案...', '暂停答题'];
            }
            setting.div.find('input').attr('disabled', len[0]);
            setting.div.children('div:eq(0)').html(function() {
                return $(this).data('html') || len[1];
            }).removeData('html');
            $(this).html(len[2]);
        } else if (len == 1) {
            location.reload();
        } else if (len == 2) {
            setting.div.find('tbody, tfoot').toggle();
        } else if (len == 3) {
            var $li = $('.el-scrollbar__wrap li'),
            $tip = $li.filter('.white, .yellow').eq(0);
            $tip.click().length ? setting.div.children('div:last').scrollTop(function() {
                var $tr = $('tbody tr', this).has('td:nth-child(1):contains(' + $tip.text() + ')');
                if (!$tr.length) return arguments[1];
                return $tr.offset().top - $tr.parents('table').offset().top; // $tr[0].offsetTop
            }) : $(this).hide();
        }
    }).on('change', 'input', function() {
        setting[this.name] = this.value.match(/^\d+$/) ? parseInt(this.value) - 1 : -1;
        if (!this.value) setting[this.name] = this.name == 'num' ? 0 : undefined;
    }).detach(setting.hide ? '*' : 'html');
    setting.type = {
        单选题: 1,
        多选题: 2,
        填空题: 3,
        问答题: 4,
        '分析题/解答题/计算题/证明题': 5,
        '阅读理解（选择）/完型填空': 9,
        判断题: 14
    };
    setting.lose = setting.num = setting.small = 0;
    $(document).keydown(function(event) {
        if (event.keyCode == 38) {
            setting.div.detach();
        } else if (event.keyCode == 40) {
            setting.div.appendTo('body');
        }
    });
    setting.loop = setInterval(findAnswer, setting.time, true);
    setInterval(function() {
        $(setting.queue.shift()).parent().click();
    }, 1E3);
}
function findAnswer(tip) {
    if (setting.queue.length) {
        return;
    } else if (tip && !$('.answerCard').length) {
        return setting.div.children('div:eq(0)').data('html', '非自动答题页面').siblings('button:eq(0)').click();
    } else if (setting.max < 0 || setting.num < 0) {
        return setting.div.children('div:eq(0)').data('html', '范围参数应为 <font color="red">正整数</font>').siblings('button:eq(0)').click();
    } else if (setting.num >= $('.subject_stem').length || setting.num > setting.max) {
        tip = setting.lose ? '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）' : '答题已完成';
        return setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(0), form').hide().click();
    } else if (!setting.curs.length) {
        setting.curs = $('.infoList span').map(function() {
            return $(this).text().trim();
        });
        if (!setting.curs.length) return;
    }
    var $TiMu = $('.subject_stem').eq(setting.num).parent(),
    $dom = $TiMu.find('.smallStem_describe').eq(setting.small).children('div').slice(1, -1),
    question = filterStyle($dom) || filterStyle($TiMu.find('.subject_describe')),
    type = $TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1];
    type = type ? setting.type[type] || 0 : -1;
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'http://lysq.shop/zhihuishu.php?t=' + encodeURIComponent(question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                console.log(xhr.responseText);
                var obj = $.parseJSON(xhr.responseText) || {};
                if (obj.code == 1) {
                    setting.div.children('div:eq(0)').text('正在搜索答案...');
                    var answer = obj.answer.replace(/&/g, '&amp;').replace(/<([^i])/g, '&lt;$1');
                    obj.answer = /^http/.test(answer) ? '<img src="' + obj.answer + '">' : obj.answer;
                    $(
                        '<tr>' +
                            '<td style="text-align: center;">' + $TiMu.find('.subject_num').text().trim().replace('.', '') + '</td>' +
                            '<td title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                            '<td title="点击可复制">' + (/^http/.test(answer) ? obj.answer : '') + answer + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', function() {
                        $dom = $dom.length ? $dom.closest('.examPaper_subject') : $TiMu;
                        if (fillAnswer($dom, obj, type)) return '';
                        setting.div.children('button:eq(3)').show();
                        return 'rgba(0, 150, 136, 0.6)';
                    });
                    setting.small = ++setting.small < $TiMu.find('.smallStem_describe').length ? setting.small : (setting.num++, 0);
                } else {
                    setting.div.children('div:eq(0)').html(obj.answer || '服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                var html = xhr.responseText.indexOf('{') ? '请求过于频繁，建议稍后再试' : $.parseJSON(xhr.responseText).answer;
                setting.div.children('div:eq(0)').data('html', html).siblings('button:eq(0)').click();
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
    str = String(obj.answer).toCDB() || new Date().toString(),
    answer = str.split(/#|\x01|\|/),
    state = setting.lose;
    obj.code > 0 && $div.each(function() {
        var $input = $('input', this)[0],
        tip = filterStyle('.node_detail', this).toCDB() || new Date().toString();
        if (tip.match(/^(正确|是|对|√|T|ri)$/)) {
            answer.join().match(/(^|,)(正确|是|对|√|T|ri)(,|$)/) && setting.queue.push($input);
        } else if (tip.match(/^(错误|否|错|×|F|wr)$/)) {
            answer.join().match(/(^|,)(错误|否|错|×|F|wr)(,|$)/) && setting.queue.push($input);
        } else if (type == 2) {
            Boolean($.inArray(tip, answer) + 1 || str.indexOf(tip) + 1) == $input.checked || setting.queue.push($input);
        } else {
            $.inArray(tip, answer) + 1 && setting.queue.push($input);
        }
    });
    if (setting.queue.length) {
    } else if (/^(1|2|14)$/.test(type)) {
        var $input = $div.find('input');
        $input.is(':checked') || (setting.none ? setting.queue.push($input[Math.floor(Math.random() * $input.length)]) : setting.lose++);
    } else if (/^[3-5]$/.test(type)) {
        answer = String(obj.answer).split(/#|\x01|\|/);
        str = $TiMu.find('textarea').each(function(index) {
            index = (obj.code > 0 && answer[index]) || '';
            this.value = index.trim();
            this.dispatchEvent(new Event('input'));
            this.dispatchEvent(new Event('blur'));
        }).length;
        (obj.code > 0 && answer.length == str) || setting.none || setting.lose++;
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}

function hookHiexam() {
    var ajax = new xhr();
    ajax.onload = function() {
        if (this.status != 200 || !this.responseURL.match('getDoQuestSingle')) return;
        var obj = JSON.parse(this.responseText).rt;
        $.each(obj.questionOptionList || [], function(index) {
            var $input = $('.TitleOptions-div input')[index];
            if (obj.questionTypeId == 1) {
                this.isCorrect && setting.queue.push($input);
            } else if (obj.questionTypeId == 2) {
                this.isCorrect == $input.checked || setting.queue.push($input);
            }
        });
    };
    return ajax;
}

function filterStyle(dom, that) {
    var $dom = $(dom, that).clone().find('style').remove().end();
    return $dom.find('img[src]').replaceWith(function() {
        return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
    }).end().text().trim();
}
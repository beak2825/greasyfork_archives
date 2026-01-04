// ==UserScript==
// @name         智慧树答题助手
// @namespace    youthlook@live.com
// @version      1.6.3
// @description  自动挂机看知到MOOC，支持屏蔽弹窗题目、自动切换下一节，章测试和考试支持自动答题，视频自动倍速播放、线路选择、默认静音等，解除各类功能限制，开放自定义参数
// @author       lbxxzmy
// @match        *://*.zhihuishu.com/*
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/393166/%E6%99%BA%E6%85%A7%E6%A0%91%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393166/%E6%99%BA%E6%85%A7%E6%A0%91%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒
    ,token: '' // 捐助用户可以使用上传选项功能，更精准的匹配答案，此处填写捐助后获取的识别码

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持课程、见面课，默认开启
    ,work: 1 // 自动答题功能，支持章测试、考试，高准确率，默认开启
    ,jump: 1 // 自动切换视频，支持课程、见面课，默认开启

    // 仅开启video时，修改此处才会生效
    ,line: '流畅' // 视频播放的默认线路，可选参数：['高清', '流畅', '校内']，默认'流畅'
    ,vol: 0 // 默认音量的百分数，设定范围：0 ~ 100，0为静音，默认0
    ,rate: 1.5 // 默认播放速率，可选参数：[1.0, 1.25, 1.5]，默认1.5
    // 上方参数支持在页面改动，下方参数仅支持代码处修改
    ,que: 1 // 屏蔽视频时间点对应的节试题，取消屏蔽则自动切换为模拟点击关闭弹题，默认开启
    ,pic: 1 // 屏蔽视频时间点对应的节图，默认开启
    ,danmu: 0 // 见面课弹幕，关闭后在网页中无法手动开启，默认关闭

    // 仅开启work时，修改此处才会生效
    ,none: 0 // 无匹配答案时执行默认操作，默认关闭
    ,limit: 1 // 解除选择、右键、复制、剪切、粘贴的限制，用于在答题页面复制题目和选项，默认开启
    ,hide: 0 // 不加载答案搜索提示框，键盘↑和↓可以临时移除和加载，默认关闭
},
_self = unsafeWindow,
url = location.pathname,
$ = _self.jQuery;

// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;

if (!$) {
} else if (url.match(/video(List|Study)/)) {
    setting.video && hookVideo(_self.vjsComponent);
    setting.jump && setInterval(checkToNext, setting.time);
} else if (url.match('/live/vod_room.html')) {
    setting.video && hookVideo(_self.vjsComponent, 1);
    setting.jump && setInterval(checkToNext, setting.time, 1);
} else if (url.match('/lessonPopupExam')) {
    setting.video && setInterval(doTest, setting.time);
} else if (location.hostname.match('examh5')) {
    setting.limit && setTimeout(relieveLimit, 100, document);
    if (location.hash.match(/(dohomework|doexamination)/) && setting.work) beforeFind();
    $(window).on('hashchange', function() {
        setting.work && location.reload();
    });
}

function hookVideo(Hooks, tip) {
    // _self.PlayerUtil.debugMode = true;
    tip || $.ajaxPrefilter(function(options) {
        if (options.url.indexOf('loadVideoPointerInfo') < 0) return;
        var oldSuccess = options.success;
        options.success = function() {
            var dto = arguments[0].lessonDtoMap;
            if (setting.que) dto.lessonTestQuestionDtos = null;
            if (setting.pic) dto.popupPictureDtos = {};
            // dto.videoThemeDtos = null;
            // dto.knowledgeCardDtos = null;
            return oldSuccess.apply(this, arguments);
        };
    });
    _self.vjsComponent = function() {
        var config = arguments[0],
        options = config.options,
        line = $.map(options.sourceSrc.lines, function(value) {
            return value.lineName.replace('标准', '高清');
        });
        options.autostart = true;
        options.rate = $.inArray(setting.rate, [1.0, 1.25, 1.5]) < 0 ? options.rate : setting.rate;
        tip || config.callback.playbackRate(options.rate);
        options.chooseLine = $.inArray(setting.line, line) + 1 || options.chooseLine + 1;
        options.src = options.sourceSrc.lines[--options.chooseLine].lineUrl || options.src;
        if (setting.vol > 100) {
            options.volume = 1;
        } else if (setting.vol < 0) {
            options.volume = 0;
        } else if (Number(setting.vol) >= 0) {
            options.volume = Math.round(setting.vol) / 100;
        }
        if (!setting.danmu) {
            config.defOptions.control.danmuBtn = false;
            delete options.control.danmuBtn;
        }
        Hooks.apply(this, arguments);
        config.player.on('loadstart', function() {
            this.loop(true);
            this.play();
        });
    };
    $(document).on('click', '.definiLines b', function() {
        setting.line = ({'xiaonei': '校内', 'line1gq': '高清', 'line1bq': '流畅'})[this.classList[0]];
    }).on('mouseup click', function() {
        setting.vol = _self.PlayerStarter.playerArray[0].player.cache_.volume * 100;
    }).on('click', '.speedList div', function() {
        setting.rate = Number($(this).attr('rate'));
    });
    if (!url.match('/videoStudy')) return;
    setting.queue = [];
    setInterval(function() {
        $(setting.queue.shift()).click();
    }, 1E3);
    setInterval(newTest, setting.time);
}

function checkToNext(tip) {
    if (tip) return $('.current_player:contains(100%) + li').click();
    var $cur = $('.current_play'),
    sel = '.time_icofinish:visible, .progressbar[style*=100], .time_ico3';
    if (!$cur.find(sel).length) return;
    var $tip = $('.video');
    $tip.slice($tip.index($cur) + 1).not(':has(' + sel + ')').eq(0).click();
}

function newTest() {
    var $div = $('[aria-label=弹题测验]');
    if (setting.queue.length || !$div.length) {
    } else if ($div.find('.right').length) {
        $div.find('[aria-label=Close]').click();
        _self.PlayerStarter.playerArray[0].player.play();
    } else if ($div.find('.error').length) {
        var text = $div.find('.answer span').text();
        $('.topic-item').each(function(index) {
            var tip = !text.match(String.fromCharCode(index + 65));
            tip = $div.find('.title-tit').text().match('多选') ? !$('.active', this).length == tip : tip;
            tip || setting.queue.push(this);
        });
    } else {
        $div.find('.topic-item').eq(0).click();
    }
}

function doTest() {
    if ($('.answerOption :checked').length) {
        $('.popboxes_btn span', parent.document).click();
        // _self.PlayerStarter.playerArray[0].player.play();
    } else {
        var $input = $(':radio, :checkbox', '.answerOption');
        ($input[Math.floor(Math.random() * $input.length)] || $()).click();
    }
}

function relieveLimit(doc) {
    if (!doc.oncut) return setTimeout(relieveLimit, 100, doc);
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
        '单选题': 1,
        '多选题': 2,
        '填空题': 3,
        '问答题': 4,
        '分析题/解答题/计算题/证明题': 5,
        '阅读理解（选择）/完型填空': 9,
        '判断题': 14
    };
    setting.lose = setting.num = setting.small = 0;
    setting.queue = setting.curs = [];
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
        // setting.div.children('button:eq(3)').toggle(!!setting.lose);
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
    type = $TiMu.find('.subject_type').text().match(/【(.+)】|$/)[1],
    option = setting.token && $TiMu.find('.node_detail').map(function() {
        return filterStyle(this);
    }).filter(function() {
        return this.length;
    }).get().join('#');
    type = type ? setting.type[type] || 0 : -1;
    option = /^[12]$/.test(type) ? option : '';
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
                var obj = $.parseJSON(xhr.responseText) || {};
                if (obj.code) {
                    setting.div.children('div:eq(0)').text('正在搜索答案...');
                    var data = obj.data.replace(/&/g, '&amp;').replace(/<([^i])/g, '&lt;$1');
                    $(
                        '<tr>' +
                            '<td style="text-align: center;">' + $TiMu.find('.subject_num').text().trim().replace('.', '') + '</td>' +
                            '<td title="点击可复制">' + (question.match('<img') ? question : question.replace(/&/g, '&amp;').replace(/</g, '&lt')) + '</td>' +
                            '<td title="点击可复制">' + (/^http/.test(data) ? '<img src="' + obj.data + '">' : '') + data + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', function() {
                        $TiMu = $dom.length ? $dom.closest('.examPaper_subject') : $TiMu;
                        if (fillAnswer($TiMu, obj, type)) return '';
                        setting.div.children('button:eq(3)').show();
                        return 'rgba(0, 150, 136, 0.6)';
                    });
                    setting.small = ++setting.small < $dom.length ? setting.small : (setting.num++, 0);
                } else {
                    setting.div.children('div:eq(0)').html(obj.data || '服务器繁忙，正在重试...');
                }
            } else if (xhr.status == 403) {
                setting.div.children('div:eq(0)').data('html', '请求过于频繁，建议稍后再试').siblings('button:eq(0)').click();
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
    data = String(obj.data).split(/#|\s*\x01\s*|\|/),
    state = setting.lose;
    // $div.find(':radio:checked').prop('checked', false);
    obj.code > 0 && $div.each(function() {
        var $input = $('input', this)[0],
        tip = filterStyle('.node_detail', this) || new Date().toString();
        if (tip.match(/^(正确|是|对|√)$/)) {
            /(^|#)(正确|是|对|√)(#|$)/.test(obj.data) && setting.queue.push($input);
        } else if (tip.match(/^(错误|否|错|×)$/)) {
            /(^|#)(错误|否|错|×)(#|$)/.test(obj.data) && setting.queue.push($input);
        } else if (type == 2) {
            Boolean($.inArray(tip, data) + 1 || String(obj.data).match(tip)) == $input.checked || setting.queue.push($input);
        } else {
            $.inArray(tip, data) + 1 && setting.queue.push($input);
        }
    });
    if (setting.queue.length) {
    } else if (/^(1|2|14)$/.test(type)) {
        var $input = $div.find('input');
        $input.is(':checked') || (setting.none ? setting.queue.push($input[Math.floor(Math.random() * $input.length)]) : setting.lose++);
    } else if (/^[3-5]$/.test(type)) {
        var $text = $TiMu.find('textarea');
        (obj.code > 0 && data.length == $text.length) || setting.none || setting.lose++;
        state == setting.lose && $text.each(function(index) {
            this.value = (obj.code > 0 && data[index]) || '不会';
            // if (this.value == this._value) return true;
            this.dispatchEvent(new Event('input'));
            this.dispatchEvent(new Event('blur'));
        });
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}

function filterStyle(dom, that) {
    return ($(dom, that).clone().find('style').remove().end().map(function() {
        return $('img', this).length ? $(this).html() : $(this).text();
    })[0] || '').trim();
}
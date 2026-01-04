// ==UserScript==
// @name         超星网课助手
// @namespace    wyn665817@163.com
// @version      2.1.0
// @description  自动挂机看尔雅MOOC，支持后台、切换窗口不暂停，视频自动切换，屏蔽视频内的题目，倍速播放、进度条拖动、快进快退
// @author       wyn665817
// @match        *://*.chaoxing.com/*
// @require      https://greasyfork.org/scripts/18715/code/Hooks.js?version=661566
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @supportURL   https://greasyfork.org/zh-CN/scripts/369625/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/384733/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/384733/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒
    ,token: '' // 捐助用户可以使用上传选项功能，更精准的匹配答案，此处填写捐助后获取的识别码

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    ,work: 1 // 自动答题功能(章节测验)，高准确率，默认开启
    ,jump: 1 // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    ,face: 0 // 解除面部识别，此功能仅为临时解除，可能会导致不良记录(慎用)，默认关闭
    ,login: 0 // 自动登录，支持监测掉线并自动重连，需要配置详细参数，默认关闭

    // 仅开启video时，修改此处才会生效
    ,line: '公网1' // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    ,http: '极速' // 视频播放的默认清晰度，可以设置'标清'等，无参数则使用系统默认清晰度，默认''
    ,muted: 1 // 视频静音播放，此功能在视频开始播放时调整音量至静音，默认关闭
    ,drag: 0 // 倍速播放、进度条拖动、快进快退，使用此功能会出现不良记录(慎用)，默认关闭
    ,player: '' // 指定播放器的类型，支持'html5'和'flash'两种参数，其他参数代表系统默认播放器，默认''

    // 仅开启work时，修改此处才会生效
    ,auto: 1 // 答题完成后自动提交，默认开启
    ,none: 1 // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会停止本次自动提交，默认开启
    ,wait: 5E3 // 自动提交前的等待时间，用于更改自动答题的提交间隔，默认5秒
    ,paste: 1 // 文本编辑器允许粘贴，用于解除文本类题目的粘贴限制，默认开启
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭

    // 仅开启jump时，修改此处才会生效
    ,check: 1 // 任务点无法自动完成时暂停切换，如果网课已全部解锁的建议关闭，默认开启
    ,course: 0 // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，建议同时配置check参数为0，默认关闭

    // 仅开启login时，修改此处才会生效，且必须设置以下参数
    ,school: '' // 学校名称，要求完整有效可查询，例如'清华大学'，默认''
    ,username: '' // 学号/工号/借书证号(邮箱/手机号/账号)，例如'2018010101'，默认''
    ,password: '' // 密码，例如'123456'，默认''
},
_self = unsafeWindow,
top = _self.top,
$ = _self.$ || top.$,
Hooks = Hooks || window.Hooks,
UE = _self.UE,
url = location.pathname;

if (url == '/ananas/modules/video/index.html') {
    if (setting.video) {
        jobSort();
        checkPlayer();
    } else {
        getIframe(0).remove();
    }
} else if (url == '/work/doHomeWorkNew') {
    if (!_self.$) {
    } else if (setting.work && $('.Btn_blue_1').length) {
        jobSort();
        setTimeout(relieveLimit, setting.time / 2);
        beforeFind();
    } else {
        getIframe(0).remove();
    }
} else if (url == '/knowledge/cards') {
    checkToNext();
} else if (url == '/mycourse/studentcourse') {
    goCourse();
} else if (url == '/visit/courses') {
    setting.face && DisplayURL();
} else if (location.host.indexOf('passport2') == 0) {
    setting.login && getSchoolId();
}

function getIframe(tip, win, job) {
    do {
        win = win ? win.parent : _self;
        job = $(win.frameElement).prev('.ans-job-icon');
    } while (!job.length && win.parent.frameElement);
    return tip ? win : job;
}

function jobSort() {
    var win = getIframe(1),
    $job = $('.ans-job-icon', win.parent.document).next('iframe[src*="/video/index.html"], iframe[src*="/work/index.html"]').not('.ans-job-finished > iframe');
    setting.tip = false;
    if (!$job.length) {
    } else if ($job[0] == win.frameElement) {
        setting.tip = true;
    } else {
        setInterval(function() {
            if ($job.filter('.ans-job-icon + iframe').not('.ans-job-finished > iframe')[0] == win.frameElement) {
                location.reload();
            }
        }, setting.time);
    }
}

function checkPlayer() {
    var data = $.parseJSON($(frameElement).attr('data')),
    danmaku = data && data.danmaku ? data.danmaku : 0;
    if (setting.player == 'flash') {
        _self.showHTML5Player = _self.showMoocPlayer;
        danmaku = 1;
    } else if (setting.player == 'html5') {
        _self.showMoocPlayer = _self.showHTML5Player;
        danmaku = 0;
    }
    if (!danmaku && _self.supportH5Video() && !navigator.userAgent.match(/metasr/i)) {
        hookVideo(_self.videojs, _self.videojs.xhr);
    } else if (_self.flashChecker().hasFlash) {
        hookJQuery();
    } else {
        alert("此浏览器不支持flash，请修改脚本player参数为'html5'，或者更换浏览器");
    }
}

function hookVideo(Hooks, xhr) {
    _self.videojs = function () {
        var config = arguments[1],
        line = $.grep($.map(config.playlines, function(value, index) {
            return value.label == setting.line && index;
        }), function(value) {
            return $.isNumeric(value);
        })[0] || 0,
        http = $.grep(config.sources, function(value) {
            return value.label == setting.http;
        })[0];
        config.playlines.unshift(config.playlines[line]);
        config.playlines.splice(line + 1, 1);
        config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
        config.plugins.studyControl.enableSwitchWindow = 1;
        config.plugins.timelineObjects.url = '/richvideo/initdatawithviewer?';
        if (setting.drag) {
            config.plugins.seekBarControl.enableFastForward = 1;
            config.playbackRates = [1, 1.25, 1.5, 2];
        }
        var player = Hooks.apply(this, arguments);
        player.children_[0].muted = setting.muted;
        player.on('loadstart', function() {
            setting.tip && this.play().catch(function() {});
        });
        _self.videojs = Hooks;
        _self.videojs.xhr = setting.login ? function(options, callback) {
            return xhr.call(this, options, function(error, response) {
                response.statusCode || top.location.reload();
                return callback.apply(this, arguments);
            });
        } : xhr;
        return player;
    };
}

function hookJQuery() {
    Hooks.set(_self, 'jQuery', function(target, propertyName, ignored, jQuery) {
        Hooks.method(jQuery.fn, 'cxplayer', function(target, methodName, method, thisArg, args) {
            var config = args[0];
            config.datas.isDefaultPlay = setting.tip;
            config.enableSwitchWindow = 1;
            config.datas.currVideoInfo.resourceUrl = '/richvideo/initdatawithviewer?';
            config.datas.currVideoInfo.dftLineIndex = $.grep($.map(decodeURIComponent(config.datas.currVideoInfo.getVideoUrl).match(/{.+?}/g) || [], function(value, index) {
                return value.indexOf(setting.line + setting.http) > -1 && index;
            }), function(value) {
                return $.isNumeric(value);
            })[0] || 0;
            setting.drag && (config.datas.currVideoInfo.getVideoUrl = config.datas.currVideoInfo.getVideoUrl.replace(/&drag=false&/, '&drag=true&'));
            var $player = Hooks.Reply.method(arguments);
            setting.muted && $player.one('onStart', function() {
                for (var i = 0; i < 16; i++) {
                    $player.addVolNum(false);
                }
            });
            return $player;
        });
        return Hooks.Reply.set(arguments);
    });
}

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

function beforeFind() {
    setting.div = $(
        '<div style="border: 2px dashed rgb(0, 85, 68); width: 330px; position: fixed; top: 0; right: 0; z-index: 99999; background-color: rgba(70, 196, 38, 0.6); overflow-x: auto;">' +
            '<span style="font-size: medium;"></span>' +
            '<div style="font-size: medium;">正在搜索答案...</div>' +
            '<button style="margin-right: 10px;">暂停答题</button>' +
            '<button style="margin-right: 10px;">' + (setting.auto ? '取消本次自动提交' : '开启本次自动提交') + '</button>' +
            '<button style="margin-right: 10px;">重新查询</button>' +
            '<button>折叠面板</button>' +
            '<div style="max-height: 300px; overflow-y: auto;">' +
                '<table border="1" style="font-size: 12px;">' +
                    '<thead>' +
                        '<tr>' +
                            '<th style="width: 60%; min-width: 130px;">题目</th>' +
                            '<th style="min-width: 130px;">答案</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tfoot style="display: none;">' +
                        '<tr>' +
                            '<th colspan="2">答案提示框 已折叠</th>' +
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
        var len = $(this).prevAll('button').length;
        if (this.tagName == 'TD') {
            GM_setClipboard($(this).text());
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
            setting.auto = 1 ^ setting.auto;
            $(this).text(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 2) {
            location.reload();
        } else if (len == 3) {
            setting.div.find('tbody, tfoot').toggle();
        }
    });
    setting.lose = setting.num = 0;
    setting.curs = $('h1').text().trim() || $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'/)[1];
    setting.loop = setInterval(findAnswer, setting.time);
    setting.tip || setting.div.children('button').eq(0).click();
}

function findAnswer() {
    if (setting.num >= $('.TiMu').length) {
        clearInterval(setting.loop);
        var text = '答题已完成';
        if (setting.lose) {
            setting.div.children('button').eq(1).hide();
            text = '共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）';
        } else {
            setTimeout(submitThis, setting.wait);
        }
        setting.div.children('button').eq(0).hide();
        setting.div.children('div:eq(0)').html(text);
        return;
    }
    var $TiMu = $('.TiMu').eq(setting.num),
    question = $TiMu.find('.Zy_TItle .clearfix:eq(0)').text().trim(),
    type = $TiMu.find('input[name^=answertype]:eq(0)').val(),
    option = setting.token && $TiMu.find('.clearfix ul:eq(0) li .after').map(function() {
        return $(this).text().trim();
    }).filter(function() {
        return this.length;
    }).get().join('#');
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://mooc.forestpolice.org/cx/' + (setting.token || 0) + '/' + encodeURIComponent(question),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&type=' + type + '&option=' + encodeURIComponent(option),
        timeout: setting.time,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = $.parseJSON(xhr.responseText);
                if (obj.code) {
                    setting.div.children('div:eq(0)').text('正在搜索答案...');
                    $(
                        '<tr>' +
                            '<td>' + question + '</td>' +
                            '<td>' + obj.data + '</td>' +
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
    var $li = $TiMu.find('ul:eq(0) li'),
    data = String(obj.data).split('#'),
    state = setting.lose;
    // $li.find(':radio:checked').prop('checked', false);
    obj.code == 1 && $li.each(function() {
        var $input = $(this).find('input')[0];
        if (!$input) {
        } else if ($input.value == 'true') {
            ($.inArray('正确', data) + 1 || $.inArray('是', data) + 1) && $input.click();
        } else if ($input.value == 'false') {
            ($.inArray('错误', data) + 1 || $.inArray('否', data) + 1) && $input.click();
        } else {
            var tip = $(this).find('.after').text().trim() || new Date();
            ($.inArray(tip, data) + 1 || (type == '1' && obj.data.indexOf(tip) + 1)) == $input.checked || $input.click();
        }
    });
    if (type.match(/^(0|1|3)$/)) {
        $li.find('input:checked').length || (setting.none ? $li.find('input')[0].click() : setting.lose++);
    } else if ($TiMu.find('ul:eq(0) textarea').length) {
        (obj.code == 1 && data.length == $li.length) || setting.none || setting.lose++;
        UE && $li.each(function(index, dom) {
            data[index] = state == setting.lose ? (obj.code == 1 && data[index]) || '不会' : '';
            var $input = $(this).find('.inp');
            $input.is(':hidden') ? (dom = $(this).next()) : $input.val(data[index]);
            var $edit = $(dom).find('.edui-default + textarea');
            $edit.length && UE.getEditor($edit.attr('name')).setContent(data[index]);
        });
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}

function submitThis() {
    if (setting.auto && $('#validate', top.document).is(':hidden')) {
        if ($('#confirmSubWin').is(':hidden')) {
            $('.Btn_blue_1')[0].click();
        } else {
            var $btn = $('#tipContent').next().children(':first'),
            position = $btn.offset(),
            mouse = document.createEvent('MouseEvents');
            position = [position.left + Math.floor(46 * Math.random() + 1), position.top + Math.floor(26 * Math.random() + 1)];
            mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, position[0], position[1], false, false, false, false, 0, null);
            $btn[0].dispatchEvent(mouse);
        }
    }
    setTimeout(submitThis, setting.time);
}

function checkToNext() {
    var $tip = $('.ans-job-icon', document);
    if (!setting.check) {
        $tip = $tip.next('iframe[src*="/video/index.html"], iframe[src*="/work/index.html"]').prev();
    }
    setInterval(function() {
        if (!$tip.parent(':not(.ans-job-finished)').length) {
            toNext();
        }
    }, setting.time);
}

function toNext() {
    var $tip = $('span.currents ~ span');
    if (!setting.jump) {
    } else if ($('.lock, .blue', '.currents:header').length || !$tip.length) {
        $tip = $('.roundpointStudent, .roundpoint').parent();
        var index = $tip.index($tip.filter('.currents:header'));
        $tip.slice(index + 1).not(':has(.lock, .blue)').eq(0).click().length || setting.course && switchCourse();
    } else {
        $tip.eq(0).click();
    }
}

function switchCourse() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: '/visit/courses/study?isAjax=true&fileId=0&debug=',
        headers: {
            'Referer': location.origin + '/visit/courses',
            'X-Requested-With': 'XMLHttpRequest'
        },
        onload: function(xhr) {
            var list = $(xhr.responseText).find('li[style] a:has(img)').map(function() {
                return $(this).attr('href');
            }),
            index = list.map(function(index) {
                return this.indexOf(top.courseId) > -1 && index;
            }).filter(function() {
                return $.isNumeric(this);
            })[0] + 1 || 0;
            setting.course = list[index] ? $.globalEval('location.replace("' + list[index] + '")') : 0;
        }
    });
}

function goCourse() {
    var jump = setting.course && document.referrer.match(/\/knowledge\/cards|\/mycourse\/studentstudy/);
    jump && setTimeout(function() {
        $('.articlename a[href]:not([class])')[0].click();
    }, setting.time);
}

function DisplayURL() {
    $('.zmodel').on('click', '[onclick^=openFaceTip]', function() {
        _self.WAY.box.hide();
        var $li = $(this).closest('li');
        $.get('/visit/goToCourseByFace', {
            courseId: $li.find('input[name=courseId]').val(),
            clazzId: $li.find('input[name=classId]').val()
        }, function(data) {
            $li.find('[onclick^=openFaceTip]').removeAttr('onclick').attr({
                href: $(data).filter('script:last').text().match(/n\("(.+?)"/)[1],
                target: '_blank'
            });
            alert('本课程已临时解除面部识别');
        }, 'html');
    });
}

function getSchoolId() {
    $.getJSON('/org/searchUnis?filter=' + encodeURI(setting.school) + '&product=44', function(data) {
        if (data.result) {
            var msg = $.grep(data.froms, function(value) {
                return value.name == setting.school;
            })[0];
            msg ? setTimeout(toLogin, setting.time, msg.schoolid) : alert('学校名称不完整');
        } else {
            alert('学校查询错误');
        }
    });
}

function toLogin(fid) {
    var ref = $('#ref, #refer_0x001').val();
    $.post('/login6?refer=' + ref, {
        fid: fid,
        uname: setting.username,
        password: setting.password,
        logintype: 1
    }).always(function(data, event) {
        event == 'success' ? alert($(data).find('#show_error').text()) : location.href = decodeURIComponent(ref);
    });
}
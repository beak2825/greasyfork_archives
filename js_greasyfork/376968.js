// ==UserScript==
// @name         VIP5（超星专用）
// @namespace    soospai@163.com
// @version      1.0.6
// @description  自动挂机看尔雅MOOC，支持后台、切换窗口不暂停，视频自动切换，屏蔽视频内的题目，倍速播放、进度条拖动、快进快退
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @require      https://greasyfork.org/scripts/18715/code/Hooks.js?version=661566
// @connect      forestpolice.org
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/376968/VIP5%EF%BC%88%E8%B6%85%E6%98%9F%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/376968/VIP5%EF%BC%88%E8%B6%85%E6%98%9F%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，科学记数法，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒
    ,token: '' // 捐助用户可以使用上传选项功能，更精准的匹配答案，此处填写捐助后获取的识别码
    ,safe: 1 // 安全模式，不加载答案提示框、统计数据等，尽可能提升脚本安全性，默认关闭
    ,review: 0 // 复习模式，完整挂机视频(音频)时长，支持挂机任务点已完成的视频和音频，默认关闭

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    ,work: 1 // 自动答题功能(章节测验)，作业需要手动开启查询，高准确率，默认开启
    ,audio: 1 // 音频自动播放，与视频功能共享muted和drag参数，默认开启
    ,book: 1 // 图书阅读任务点，非课程阅读任务点，默认开启
    ,docs: 1 // 文档阅读任务点，PPT类任务点自动完成阅读任务，默认开启
    // 本区域参数，上方为任务点功能，下方为独立功能
    ,jump: 1 // 自动切换任务点、章节、课程(需要配置course参数)，默认开启
    ,read: 0 // 挂机课程阅读时间，支持自定义挂机时长，需要手动打开阅读页面，默认关闭
    ,face: 0 // 解除面部识别，此功能仅为临时解除，可能会导致不良记录(慎用)，默认关闭
    ,login: 0 // 自动登录，支持监测掉线并自动重连，需要配置详细参数，默认关闭
    ,total: 1 // 显示课程进度的统计数据，在学习进度页面的上方展示，默认开启

    // 仅开启video(audio)时，修改此处才会生效
    ,line: '公网1' // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    ,http: '' // 视频播放的默认清晰度，可以设置'标清'等，无参数则使用系统默认清晰度，默认''
    ,player: '' // 指定播放器的类型，支持'html5'和'flash'两种参数，其他参数代表系统默认播放器，默认''
    ,phone: 1 // 解除手机浏览器限制(手机端专用)，不建议使用手机浏览器挂机视频，默认开启
    // 本区域参数，上方为video功能独享，下方为audio功能共享
    ,muted: 1 // 视频(音频)静音播放，此功能在视频(音频)开始播放时调整音量至静音，默认关闭
    ,drag: 0 // 倍速播放、进度条拖动、快进快退，使用此功能会出现不良记录(慎用)，默认关闭

    // 仅开启work时，修改此处才会生效
    ,auto: 1 // 答题完成后自动提交，默认开启
    ,none: 1 // 无匹配答案时执行默认操作，关闭后若题目无匹配答案则会暂时保存已作答的题目，默认开启
    ,wait: 5E3 // 自动提交前的等待时间，用于更改自动答题的提交间隔，默认5秒
    ,paste: 1 // 文本编辑器允许粘贴，用于解除文本类题目的粘贴限制，默认开启
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于文本类题目，答题框根据内容自动调整大小，默认关闭

    // 仅开启jump时，修改此处才会生效
    ,check: 0 // 任务点无法自动完成时暂停切换，如果网课是闯关模式的建议开启，默认关闭
    ,course: 0 // 当前课程完成后自动切换课程，仅支持按照根目录课程顺序切换，建议同时配置check参数为0，默认关闭

    // 仅开启read时，修改此处才会生效
    ,goal: 65 // 需要挂机阅读的时间，参数的单位是分钟，实际累计时间会小于此参数，默认65

    // 仅开启login时，修改此处才会生效，且必须设置以下参数
    ,school: '账号为手机号可以不修改此参数' // 学校/单位/机构码，要求完整有效可查询，例如'清华大学'
    ,username: '' // 学号/工号/借书证号(邮箱/手机号/账号)，例如'2018010101'，默认''
    ,password: '' // 密码，例如'123456'，默认''
},
_self = unsafeWindow,
url = location.pathname,
top = _self;

if (frameElement) document.domain = location.host.replace(/.+?\./, '');

try {
    while (top != _self.top) top = top.parent.document ? top.parent : _self.top;
} catch (err) {
    // console.log(err);
    top = _self;
}

var $ = _self.jQuery || top.jQuery,
parent = _self == top ? self : _self.parent,
Ext = _self.Ext || parent.Ext || {},
UE = _self.UE,
Hooks = Hooks || window.Hooks;

setting.normal = ''; // ':visible'
// setting.time += Math.ceil(setting.time * Math.random()) - setting.time / 2;
// setting.wait += Math.ceil(setting.wait * Math.random()) - setting.time / 2;

setting.job = [
    ':not(*)'
    ,'iframe[src*="/video/index.html"]'
    ,'iframe[src*="/work/index.html"]'
    ,'iframe[src*="/audio/index.html"]'
    ,'iframe[src*="/innerbook/index.html"]'
    ,'iframe[src*="/ppt/index.html"]'
    ,'iframe[src*="/pdf/index.html"]'
];
setting.tip = top != _self && jobSort($ || Ext.query);

if (url == '/ananas/modules/video/index.html') {
    if (setting.video) {
        if (setting.review) _self.greenligth = Ext.emptyFn;
        checkPlayer();
    } else {
        getIframe().remove();
    }
} else if (url == '/work/doHomeWorkNew' || url == '/api/work' || url == '/work/addStudentWorkNewWeb') {
    if (!UE) {
        errorHandling();
    } else if (setting.work) {
        setTimeout(relieveLimit, 0);
        beforeFind();
    } else {
        getIframe().remove();
    }
} else if (url == '/ananas/modules/audio/index.html') {
    if (setting.audio) {
        if (setting.review) _self.greenligth = Ext.emptyFn;
        hookAudio(_self.videojs, _self.videojs.xhr);
    } else {
        getIframe().remove();
    }
} else if (url == '/ananas/modules/innerbook/index.html') {
    setting.book ? setTimeout(bookRead, setting.time) : getIframe().remove();
} else if (url.match(/^\/ananas\/modules\/(ppt|pdf)\/index\.html$/)) {
    setting.docs ? setTimeout(docsRead, setting.time) : getIframe().remove();
} else if (url == '/knowledge/cards') {
    $ && checkToNext();
} else if (url.match(/^\/(course|zt)\/\d+\.html$/)) {
    setTimeout(function() {
        setting.read && _self.sendLogs && $('.course_section:eq(0) .chapterText').click();
    }, setting.time);
} else if (url == '/ztnodedetailcontroller/visitnodedetail') {
    setting.read && _self.sendLogs && autoRead();
} else if (url == '/mycourse/studentcourse') {
    var gv = location.search.match(/d=\d+&/g);
    setting.total && $('<a>', {
        href: '/moocAnalysis/chapterStatisticByUser?classI' + gv[1] + 'courseI' + gv[0] + 'userId=' + _self.getCookie('_uid') + '&ut=s',
        target: '_blank',
        title: '点击查看章节统计',
        style: 'margin: 0 25px;',
        html: '本课程共' + $('.icon').length + '节，剩余' + $('em:not(.openlock)').length + '节未完成'
    }).appendTo('.zt_logo').detach(setting.safe ? '*' : 'html').parent().width('auto');
    setting.course && setTimeout(goCourse, setting.time);
} else if (url.match(/^\/visit\/(courses|interaction)$/)) {
    setting.face && DisplayURL();
} else if (location.host.match(/^passport2/)) {
    setting.login && getSchoolId();
} else if (url == '/work/selectWorkQuestionYiPiYue') {
    submitAnswer(getIframe().parent(), $.extend(true, [], parent._data));
}

function getIframe(tip, win, job) {
    if (!$) return Ext.get(frameElement || []).parent().child('.ans-job-icon') || Ext.get([]);
    do {
        win = win ? win.parent : _self;
        job = $(win.frameElement).prevAll('.ans-job-icon');
    } while (!job.length && win.parent.frameElement);
    return tip ? win : job;
}

function jobSort($) {
    var fn = $.fn ? [getIframe(1), 'length'] : [self, 'dom'],
    sel = setting.job.join(', :not(.ans-job-finished) > .ans-job-icon' + setting.normal + ' ~ ');
    if ($(sel, fn[0].parent.document)[0] == fn[0].frameElement) return true;
    if (!getIframe()[fn[1]] || getIframe().parent().is('.ans-job-finished')) return null;
    setInterval(function() {
        $(sel, fn[0].parent.document)[0] == fn[0].frameElement && location.reload();
    }, setting.time);
}

function checkPlayer() {
    var data = Ext.decode(_self.config('data')),
    danmaku = data && data.danmaku ? data.danmaku : 0;
    if (setting.player == 'flash') {
        _self.showHTML5Player = _self.showMoocPlayer;
        danmaku = 1;
    } else if (setting.player == 'html5') {
        _self.showMoocPlayer = _self.showHTML5Player;
        danmaku = 0;
    }
    if (!danmaku && _self.supportH5Video() && !navigator.userAgent.match(/metasr/i)) {
        if (setting.phone) Ext.isIos = Ext.isAndroid = false;
        hookVideo(_self.videojs, _self.videojs.xhr);
    } else if (_self.flashChecker().hasFlash) {
        hookJQuery();
    } else {
        alert("此浏览器不支持flash，请修改脚本player参数为'html5'，或者更换浏览器");
    }
}

function hookVideo(Hooks, xhr) {
    _self.videojs = function() {
        _self.videojs = Hooks;
        var config = arguments[1],
        line = Ext.Array.filter(Ext.Array.map(config.playlines, function(value, index) {
            return value.label == setting.line && index;
        }), function(value) {
            return Ext.isNumber(value);
        })[0] || 0,
        http = Ext.Array.filter(config.sources, function(value) {
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
        // config.preload = setting.tip ? 'auto' : 'none';
        var player = Hooks.apply(this, arguments);
        player.children_[0].muted = setting.muted;
        player.on('loadstart', function() {
            setting.tip && this.play().catch(Ext.emptyFn);
        });
        player.on('ended', function() {
            Ext.fly(frameElement).parent().addCls('ans-job-finished');
        });
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
            var that = this,
            // events = Ext.clone(config.events),
            config = args[0];
            config.events.onStart = function() {
                for (var i = 0; i < 16; i++) setting.muted && that.addVolNum(false);
                // events.onStart();
            };
            config.events.onEnd = function() {
                Ext.fly(frameElement).parent().addCls('ans-job-finished');
                // events.onEnd();
            };
            config.datas.isDefaultPlay = setting.tip || false;
            config.enableSwitchWindow = 1;
            config.datas.currVideoInfo.resourceUrl = '/richvideo/initdatawithviewer?';
            config.datas.currVideoInfo.dftLineIndex = Ext.Array.filter(Ext.Array.map(decodeURIComponent(config.datas.currVideoInfo.getVideoUrl).match(/{.+?}/g) || [], function(value, index) {
                return value.match(setting.line + setting.http) && index;
            }), function(value) {
                return Ext.isNumber(value);
            })[0] || 0;
            if (setting.drag) config.datas.currVideoInfo.getVideoUrl = config.datas.currVideoInfo.getVideoUrl.replace(/&drag=false&/, '&drag=true&');
            return Hooks.Reply.method(arguments);
        });
        return Hooks.Reply.set(arguments);
    });
}

function hookAudio(Hooks, xhr) {
    _self.videojs = function() {
        _self.videojs = Hooks;
        var config = arguments[1];
        config.plugins.studyControl.enableSwitchWindow = 1;
        if (setting.drag) config.plugins.seekBarControl.enableFastForward = 1;
        var player = Hooks.apply(this, arguments);
        player.children_[0].muted = setting.muted;
        player.on('loadeddata', function() {
            setting.tip && this.play().catch(Ext.emptyFn);
        });
        player.on('ended', function() {
            Ext.fly(frameElement).parent().addCls('ans-job-finished');
        });
        _self.videojs.xhr = setting.login ? function(options, callback) {
            return xhr.call(this, options, function(error, response) {
                response.statusCode || top.location.reload();
                return callback.apply(this, arguments);
            });
        } : xhr;
        return player;
    };
}

function bookRead() {
    if (_self.setting) return setting.tip && top.onchangepage(_self.getFrameAttr('end'));
    setting.tip && Ext.fly(frameElement).parent().addCls('ans-job-finished');
}

function docsRead() {
    if (_self.setting) return setting.tip && _self.finishJob();
    setting.tip && Ext.fly(frameElement).parent().addCls('ans-job-finished');
}

function relieveLimit() {
    if (setting.scale) _self.UEDITOR_CONFIG.scaleEnabled = false;
    $('script').prev('textarea').each(function(index, value) {
        UE.getEditor(this.name).ready(function() {
            this.destroy();
            UE.getEditor(value.name).addListener('beforepaste', _self.myEditor_paste);
        });
    });
    if (!setting.paste && _self.allowPaste == '1') return;
    $('input[onpaste]').removeAttr('onpaste');
    _self.myEditor_paste = $.noop;
    // _self.pasteText = function() {return true};
}

function beforeFind() {
    if ($.type(parent._data) == 'array') return getIframe().remove();
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
                            '<th style="width: 25px; min-width: 25px;">题号</th>' +
                            '<th style="width: 60%; min-width: 130px;">题目（点击可复制）</th>' +
                            '<th style="min-width: 130px;">答案（点击可复制）</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tfoot style="display: none;">' +
                        '<tr>' +
                            '<th colspan="3">答案提示框 已折叠</th>' +
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
                len = ['已暂停搜索', '继续答题'];
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                len = ['正在搜索答案...', '暂停答题'];
            }
            setting.div.children('div:eq(0)').html(function() {
                return $(this).data('html') || len[0];
            }).removeData('html');
            $(this).html(len[1]);
        } else if (len == 1) {
            setting.auto = 1 ^ setting.auto;
            $(this).html(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 2) {
            parent.location.reload();
        } else if (len == 3) {
            setting.div.find('tbody, tfoot').toggle();
        }
    }).detach(setting.safe ? '*' : 'html');
    setting.lose = setting.num = 0;
    setting.data = parent._data = [];
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    setting.loop = setInterval(findAnswer, setting.time);
    var tip = ({'undefined': '任务点排队中', 'null': '等待切换中'})[setting.tip];
    tip && setting.div.children('div:eq(0)').data('html', tip).siblings('button:eq(0)').click();
}

function findAnswer() {
    if (setting.num >= $('.TiMu').length) {
        var arr = setting.lose ? ['共有 <font color="red">' + setting.lose + '</font> 道题目待完善（已深色标注）', saveThis] : ['答题已完成', submitThis];
        setting.div.children('div:eq(0)').data('html', arr[0]).siblings('button:eq(0)').hide().click();
        return setTimeout(arr[1], setting.wait);
    }
    var $TiMu = $('.TiMu').eq(setting.num),
    question = filterImg($TiMu.find('.Zy_TItle:eq(0) .clearfix')).replace(/^【.*?】\s*/, ''),
    type = $TiMu.find('input[name^=answertype]:eq(0)').val() || '-1',
    option = setting.token && $TiMu.find('.clearfix ul:eq(0) li .after').map(function() {
        return filterImg(this);
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
                var obj = $.parseJSON(xhr.responseText) || {};
                if (obj.code) {
                    setting.div.children('div:eq(0)').text('正在搜索答案...');
                    obj.data = filterImg($('<p></p>').append(obj.data).not('script'));
                    $(
                        '<tr>' +
                            '<td style="text-align: center;">' + $TiMu.find('.Zy_TItle:eq(0) i').text().trim() + '</td>' +
                            '<td title="点击可复制">' + question + '</td>' +
                            '<td title="点击可复制">' + (/^http/.test(obj.data) ? '<img src="' + obj.data + '">' : '') + obj.data + '</td>' +
                        '</tr>'
                    ).appendTo(setting.div.find('tbody')).css('background-color', fillAnswer($TiMu.find('ul:eq(0) li'), obj, type) ? '' : 'rgba(0, 150, 136, 0.6)');
                    setting.data[setting.num++] = {
                        code: obj.code > 0 ? 1 : 0,
                        question: question,
                        option: obj.data,
                        type: Number(type)
                    };
                } else {
                    setting.div.children('div:eq(0)').html(obj.data || '服务器繁忙，正在重试...');
                }
                setting.div.children('span').html(obj.msg || '');
            } else if (xhr.status == 403) {
                setting.div.children('button:eq(0)').click();
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

function fillAnswer($li, obj, type) {
    var $input = $li.find(':radio, :checkbox'),
    data = String(obj.data).split(/#|\s*\x01\s*|\|/),
    state = setting.lose;
    // $li.find(':radio:checked').prop('checked', false);
    obj.code > 0 && $input.each(function(index) {
        if (this.value == 'true') {
            /(^|#)(正确|是|对|√)(#|$)/.test(obj.data) && this.click();
        } else if (this.value == 'false') {
            /(^|#)(错误|否|错|×)(#|$)/.test(obj.data) && this.click();
        } else {
            var tip = filterImg($li.eq(index).find('.after')) || new Date().toString();
            Boolean($.inArray(tip, data) + 1 || (type == '1' && String(obj.data).match(tip))) == this.checked || this.click();
        }
    }).each(function() {
        if (!/^[A]?[B]?[C]?[D]?[E]?[F]?[G]?$/.test(obj.data)) return false;
        Boolean(String(obj.data).match(this.value)) == this.checked || this.click();
    });
    if (type.match(/^[013]$/)) {
        $input.is(':checked') || (setting.none ? ($input[Math.floor(Math.random() * $input.length)] || $()).click() : setting.lose++);
    } else if (type.match(/^(2|[4-9]|1[08])$/)) {
        (obj.code > 0 && data.length == $li.length) || setting.none || setting.lose++;
        state == setting.lose && $li.each(function(index, dom) {
            data[index] = (obj.code > 0 && data[index]) || '不会';
            dom = $('.inp', this).filter(':visible').val(data[index]).end().is(':hidden') ? $(this).next() : dom;
            $('.edui-default + textarea', dom).each(function() {
                UE.getEditor(this.name).setContent(data[index]);
            });
        });
    } else {
        setting.none || setting.lose++;
    }
    return state == setting.lose;
}

function saveThis() {
    if (!setting.auto) return setTimeout(saveThis, setting.time);
    setting.div.children('button:lt(3)').hide().eq(1).click();
    _self.alert = console.log;
    $('#tempsave').click();
    getIframe().parent().addClass('ans-job-finished');
}

function submitThis() {
    if (!setting.auto) {
    } else if (!$('.Btn_blue_1:visible').length) {
        setting.div.children('button:lt(3)').hide().eq(1).click();
        return getIframe().parent().addClass('ans-job-finished');
    } else if ($('#validate:visible', top.document).length) {
    } else if ($('#confirmSubWin:visible').length) {
        var btn = $('#tipContent + * > a').offset() || {top: 0, left: 0},
        mouse = document.createEvent('MouseEvents');
        btn = [btn.left + Math.ceil(Math.random() * 46), btn.top + Math.ceil(Math.random() * 26)];
        mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, btn[0], btn[1], false, false, false, false, 0, null);
        _self.event = $.extend(true, {}, mouse);
        delete _self.event.isTrusted;
        _self.form1submit();
    } else {
        $('.Btn_blue_1')[0].click();
    }
    setTimeout(submitThis, Math.ceil(setting.time * Math.random()) * 2);
}

function errorHandling() {
    var tip = Ext ? Ext.query('font:contains(未登录)', document) : [];
    setTimeout(tip.length ? top.location.reload : parent.greenligth, setting.time);
}

function checkToNext() {
    var $tip = $('.ans-job-icon' + setting.normal, document);
    $tip = setting.check ? $tip : $tip.nextAll(setting.job.join(', ')).prevAll('.ans-job-icon');
    setInterval(function() {
        $tip.parent(':not(.ans-job-finished)').length || setting.jump && toNext();
    }, setting.time);
}

function toNext() {
    var $cur = $('#cur' + $('#chapterIdid').val()),
    $tip = $('span.currents ~ span'),
    sel = setting.review ? 'html' : '.blue';
    if (!$cur.has(sel).length && $tip.length) return $tip.eq(0).click();
    $tip = $('.roundpointStudent, .roundpoint').parent();
    $tip = $tip.slice($tip.index($cur) + 1).not(':has(' + sel + ')');
    $tip.not(':has(.lock)').find('span:last').eq(0).click();
    $tip.length || setting.course && switchCourse();
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
                return this.match(top.courseId) && index;
            }).filter(function() {
                return $.isNumeric(this);
            })[0] + 1 || 0;
            setting.course = list[index] ? $.globalEval('location.replace("' + list[index] + '")') : 0;
        }
    });
}

function goCourse() {
    if (!document.referrer.match(/\/knowledge\/cards|\/mycourse\/studentstudy/)) return;
    ($('.articlename a[href]:not([class])')[0] || $()).click();
}

function autoRead() {
    if (!/^\d+(\.\d+)?$/.test(setting.goal)) return;
    var time = setting.goal * 60 / $('.course_section').length;
    $('html, body').animate({
        scrollTop: $(document).height() - $(window).height()
    }, Math.round(time) * 1E3, function() {
        $('.nodeItem.r i').click();
    }).one('click', '#top', function(event) {
        $(event.delegateTarget).stop();
    });
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
    var school = /^1\d{10}$/.test(setting.username) ? '' : setting.school;
    if (!isNaN(school)) return setTimeout(toLogin, setting.time, school);
    if (school == '账号为手机号可以不修改此参数') return alert('请修改school参数');
    $.getJSON('/org/searchUnis?filter=' + encodeURI(school) + '&product=44', function(data) {
        if (!data.result) return alert('学校查询错误');
        var msg = $.grep(data.froms, function(value) {
            return value.name == school;
        })[0];
        msg ? setTimeout(toLogin, setting.time, msg.schoolid) : alert('学校名称不完整');
    });
}

function toLogin(fid) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: '/api/login?name=' + setting.username + '&pwd=' + setting.password + '&schoolid=' + fid + '&verify=0',
        onload: function(xhr) {
            var obj = $.parseJSON(xhr.responseText) || {};
            obj.result ? location.href = decodeURIComponent($('#ref, #refer_0x001').val()) : alert(obj.errorMsg || 'Error');
        }
    });
}

function submitAnswer($job, data) {
    $job.removeClass('ans-job-finished');
    data = data.length ? $(data) : $('.TiMu').map(function() {
        var title = filterImg($('.Zy_TItle .clearfix', this));
        return {
            question: title.replace(/^【.*?】\s*/, ''),
            type: ({'单选题': 0, '多选题': 1, '填空题': 2, '判断题': 3})[title.match(/^【(.*?)】|$/)[1]]
        };
    });
    data = $.grep(data.map(function(index) {
        var $TiMu = $('.TiMu').eq(index);
        if (!($.isPlainObject(this) && this.type < 4 && $TiMu.find('.fr').length)) {
            return false;
        } else if (this.type == 2) {
            var $ans = $TiMu.find('.Py_tk, .Py_answer').eq(0);
            if (!$TiMu.find('.cuo').length && this.code) {
                return false;
            } else if (!$ans.find('.cuo').length) {
                this.option = $ans.find('.clearfix').map(function() {
                    return $(this).text().trim();
                }).get().join('#') || '无';
            } else if (this.code) {
                this.code = -1;
            } else {
                return false;
            }
        } else if (this.type == 3) {
            var ans = $TiMu.find('.font20:last').text();
            if ($TiMu.find('.cuo').length) {
                this.option = ({'√': '错误', '×': '正确'})[ans] || '无';
            } else if (!this.code) {
                this.option = ({'√': '正确', '×': '错误'})[ans] || '无';
            } else {
                return false;
            }
        } else {
            var text = $TiMu.find('.Py_answer > span:eq(0)').text();
            if ($TiMu.find('.dui').length && this.code && !/^[A]?[B]?[C]?[D]?[E]?[F]?[G]?$/.test(this.option)) {
                return false;
            } else if ($TiMu.find('.dui').length || text.match('正确答案')) {
                this.option = $.map(text.match(/[A-G]/gi) || [], function(value) {
                    return filterImg($TiMu.find('.fl:contains(' + value + ') + a'));
                }).join('#') || '无';
            } else if (this.code) {
                this.code = -1;
            } else {
                return false;
            }
        }
        return this;
    }), function(value) {
        return value;
    });
    setting.curs = $('script:contains(courseName)', top.document).text().match(/courseName:\'(.+?)\'|$/)[1] || $('h1').text().trim() || '无';
    data.length && GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://mooc.forestpolice.org/upload/cx/' + (setting.token || 0),
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'course=' + encodeURIComponent(setting.curs) + '&data=' + encodeURIComponent((Ext.encode || JSON.stringify)(data))
    });
    $job.addClass('ans-job-finished');
}

function filterImg(dom) {
    return $(dom).clone().find('img[src]').replaceWith(function() {
        return $('<p></p>').text('<img src="' + $(this).attr('src') + '">');
    }).end().text().trim();
}
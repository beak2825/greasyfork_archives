// ==UserScript==
// @name         超星网课助手
// @namespace    wyn665817@163.com
// @version      9.9.9
// @description  自动挂机看尔雅MOOC，支持后台、切换窗口不暂停，视频自动切换，屏蔽视频内的题目，倍速播放、进度条拖动、快进快退
// @author       wyn665817
// @match        *://*.chaoxing.com/*
// @match        *://mooc1.xzit.edu.cn/*
// @connect      forestpolice.org
// @connect 52wfy.cn
// @connect      cx.52wfy.cn
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @supportURL   https://greasyfork.org/zh-CN/scripts/369625/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/374492/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/374492/%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    ,work: 1 // 自动答题功能(章节测验)，高准确率，默认开启
    ,jump: 1 // 自动切换任务点、章节，默认开启

    // 仅开启video时，修改此处才会生效
    ,line: '公网1' // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    ,http: '' // 视频播放的默认清晰度，可以设置'标清'等，无参数则使用系统默认清晰度，默认''
    ,muted: 0 // 视频静音播放，此功能在视频开始播放时调整音量至静音，默认关闭
    ,drag: 0 // 倍速播放、进度条拖动、快进快退，使用此功能会出现不良记录(慎用)，默认关闭
    ,player: '' // 指定播放器的类型，支持'html5'和'flash'两种参数，其他参数代表系统默认播放器，默认''

    // 仅开启work时，修改此处才会生效
    ,auto: 1 // 答题完成后自动提交，默认开启
    ,none: 2 // 未找到答案时选择默认选项，关闭后会自动屏蔽auto功能，默认开启
    ,wait: 5E3 // 自动提交前的等待时间，用于更改自动答题的提交间隔，默认5秒
    ,copy: 1 // 文本编辑器允许粘贴，用于解除简答题题目的粘贴限制，默认开启
    ,scale: 0 // 富文本编辑器高度自动拉伸，用于简答题题目，答题框根据内容自动调整大小，默认关闭

    // 仅开启jump时，修改此处才会生效
    ,check: 1 // 任务点无法自动完成时暂停切换，如果网课已全部解锁的建议关闭，默认开启
},
_self = unsafeWindow,
$ = _self.$ || top.$,
UE = _self.UE,
url = location.pathname;

if (url.startsWith('/ananas/modules/video/index.html')) {
    if (setting.video) {
        jobSort();
        checkPlayer();
    } else {
        getIframe(0).remove();
    }
} else if (url.startsWith('/work/doHomeWorkNew')) {
    if (setting.work && $('.Btn_blue_1').length) {
        jobSort();
        relieveLimit();
        setting.tip && beforeFind();
    } else {
        getIframe(0).remove();
    }
} else if (url.startsWith('/knowledge/cards')) {
    checkToNext();
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
            if ($job.not('.ans-job-finished > iframe')[0] == win.frameElement) {
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
    if (!danmaku && _self.supportH5Video()) {
        hookVideo();
    } else if (_self.flashChecker().hasFlash) {
        hookJQuery();
    }
}

function hookVideo() {
    var Hooks = _self.videojs;
    _self.videojs = function () {
        var config = arguments[1],
        line = config.playlines.findIndex(function(currentValue) {
            return currentValue.label == setting.line;
        }),
        http = config.sources.find(function(currentValue) {
            return currentValue.label == setting.http;
        });
        config.playlines.unshift(config.playlines[line]);
        config.playlines.splice(line + 1, 1);
        config.plugins.videoJsResolutionSwitcher.default = http ? http.res : 360;
        config.plugins.studyControl.enableSwitchWindow = 1;
        config.plugins.timelineObjects.url = '/richvideo/initdatawithviewer?';
        setting.tip && (config.autoplay = true);
        setting.muted && (config.muted = true);
        if (setting.drag) {
            config.plugins.seekBarControl.enableFastForward = 1;
            config.playbackRates = [1, 1.25, 1.5, 2];
        }
        var player = Hooks.apply(this, arguments);
        player.on('loadstart', function() {
            setting.tip && this.play().catch(function() {});
        });
        _self.videojs = Hooks;
        return player;
    };
}

function hookJQuery() {
    var Hooks = varHooks();
    Hooks.set(_self, 'jQuery', function(target, propertyName, ignored, jQuery) {
        Hooks.set(jQuery.fn, 'cxplayer', function(target, propertyName, oldValue, newValue) {
            return Hooks.apply(newValue, function(target, thisArg, args) {
                var config = args[0];
                config.datas.isDefaultPlay = setting.tip;
                config.enableSwitchWindow = 1;
                config.datas.currVideoInfo.resourceUrl = '/richvideo/initdatawithviewer?';
                config.datas.currVideoInfo.dftLineIndex = decodeURIComponent(config.datas.currVideoInfo.getVideoUrl).match(/{.+?}/g).findIndex(function(currentValue) {
                    return currentValue.includes(setting.line + setting.http);
                });
                setting.drag && (config.datas.currVideoInfo.getVideoUrl = config.datas.currVideoInfo.getVideoUrl.replace(/&drag=false&/, '&drag=true&'));
                var $player = setting.muted ? Hooks.Reply.apply(arguments) : $();
                $player.on('onStart', function() {
                    for (var i = 0; i < 16; i++) {
                        $player.addVolNum(false);
                    }
                });
                return Hooks.Reply.apply(arguments);
            });
        });
        return Hooks.Reply.set(arguments);
    });
}

function varHooks() {
/**
 * Hooks.js v1.1.3 | xymopen
 * xuyiming.open@outlook.com
 * https://github.com/xymopen/JS_Utilities/blob/master/Hooks.js
 */
    var Hooks = {
        apply: function apply(target, onApply) {
            if ('function' === typeof target && 'function' === typeof onApply) {
                return function() {
                    return onApply.call(this, target, this, arguments);
                };
            } else {
                throw new TypeError();
            }
        },
        property: function property(target, propertyName, onGet, onSet) {
            var descriptor, oldValue;
            if (Object.prototype.hasOwnProperty.call(target, propertyName)) {
                descriptor = Object.getOwnPropertyDescriptor(target, propertyName);
                if (Object.prototype.hasOwnProperty.call(descriptor, 'value')) {
                    oldValue = descriptor.value;
                    delete descriptor.value;
                    delete descriptor.writable;
                } else if (Object.prototype.hasOwnProperty.call(descriptor, 'get')) {
                    oldValue = descriptor.get.call(target);
                } else {
                    oldValue = undefined;
                }
            } else {
                descriptor = {
                    'configurable': true,
                    'enumerable': true
                };
                oldValue = undefined;
            }
            descriptor.get = function get() {
                return onGet.call(this, target, propertyName, oldValue);
            };
            descriptor.set = function set(newValue) {
                oldValue = onSet.call(this, target, propertyName, oldValue, newValue);
                return oldValue;
            };
            Object.defineProperty(target, propertyName, descriptor);
        },
        set: function set(target, propertyName, onSet) {
            return Hooks.property(target, propertyName, function(target, propertyName, oldValue) {
                return Hooks.Reply.set(arguments);
            }, onSet);
        }
    };
    Hooks.Reply = {
        apply: function apply(param) {
            return param[0].apply(param[1], param[2]);
        },
        set: function(param) {
            return param[param.length - 1];
        }
    };
    return Hooks;
}

function relieveLimit() {
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
}

function beforeFind() {
    setting.div = $(
        '<div style="border: 2px dashed rgb(0, 85, 68); width: 320px; position: fixed; top: 0; right: 0; z-index: 9999; background-color: rgba(70, 196, 38, 0.6); overflow: auto;">' +
            '<div style="font-size: medium;">正在搜索答案...</div>' +
            '<button style="margin-right: 10px;">暂停答题</button>' +
            '<button style="margin-right: 10px;">' + (setting.auto ? '取消本次自动提交' : '开启本次自动提交') + '</button>' +
            '<button style="margin-right: 10px;">重新查询</button>' +
            '<button>折叠面板</button>' +
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
            if (setting.loop) {
                clearInterval(setting.loop);
                delete setting.loop;
                setting.div.children('div').text('已暂停搜索');
                $(this).text('继续答题');
            } else {
                setting.loop = setInterval(findAnswer, setting.time);
                setting.div.children('div').text('正在搜索答案...');
                $(this).text('暂停答题');
            }
        } else if (len == 1) {
            setting.auto = 1 ^ setting.auto;
            $(this).text(setting.auto ? '取消本次自动提交' : '开启本次自动提交');
        } else if (len == 2) {
            location.reload();
        } else if (len == 3) {
            $(this).siblings('table').toggle();
        }
    });
    setting.lose = setting.num = 0;
    setting.loop = setInterval(findAnswer, setting.time);
}

function findAnswer() {
    if (setting.num >= $('.TiMu').length) {
        clearInterval(setting.loop);
        var text = '答题已完成';
        if (setting.lose) {
            setting.div.children('button').eq(1).hide();
            text = '共有 <font color="red">' + setting.lose + '</font> 道题目待完善';
        } else {
            setTimeout(submitThis, setting.wait);
        }
        setting.div.children('button').eq(0).hide();
        setting.div.children('div').html(text);
        return;
    }
    var $TiMu = $('.TiMu').eq(setting.num),
    question = $TiMu.find('.Zy_TItle .clearfix:eq(0)').text().trim();
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://test.cx.52wfy.cn/post.php?key=LHhl77jbIMATVyTy',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        data: 'question=' + encodeURIComponent(question) + '&username=test00&password=123456',
        timeout: 10E3,
        onload: function(xhr) {
            if (!setting.loop) {
            } else if (xhr.status == 200) {
                var obj = JSON.parse(xhr.responseText);
                if (obj.code) {
                    setting.div.children('div').text('正在搜索答案...');
                    setting.div.children('table').append(
                        '<tr>' +
                            '<td>' + question + '</td>' +
                            '<td>' + obj.data + '</td>' +
                        '</tr>'
                    );
                    fillAnswer($TiMu, obj);
                    setting.num++;
                } else {
                    setting.div.children('div').text(obj.data + '，重试中...');
                }
            } else {
                setting.div.children('div').text('服务器异常，正在重试...');
            }
        },
        ontimeout: function() {
            setting.loop && setting.div.children('div').text('服务器超时，正在重试...');
        }
    });
}

function fillAnswer($TiMu, obj) {
    var $li = $TiMu.find('ul:eq(0) li'),
    data = obj.data,
    arr = data.split('#');
    obj.code == 1 && $li.each(function() {
        var $input = $(this).find('input')[0];
        if (!$input) {
        } else if ($input.value == 'true') {
            (data == '正确' || data == '是') && $input.click();
        } else if ($input.value == 'false') {
            (data == '错误' || data == '否') && $input.click();
        } else {
            var tip = $.inArray($(this).find('a').text().trim(), arr) >= 0;
            $input.checked == tip || $input.click();
        }
    });
    if (UE && $li.length == 1 && obj.code == 1) {
        UE.getEditor($li.find('textarea').attr('name')).setContent(data);
    } else if (!$li.find('input:checked').length) {
        if (setting.none) {
            $li.find('input')[0].click();
        } else {
            setting.lose++;
        }
    }
}

function submitThis() {
    if (setting.auto && $('#validate', top.document).is(':hidden')) {
        if ($('#confirmSubWin').is(':hidden')) {
            $('.Btn_blue_1')[0].click();
        } else {
            var $btn = $('#tipContent').next().children(':first'),
            position = $btn.offset(),
            mouse = document.createEvent('MouseEvents');
            mouse.initMouseEvent('click', true, true, document.defaultView, 0, 0, 0, position.left + Math.floor(46 * Math.random() + 1), position.top + Math.floor(26 * Math.random() + 1));
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
        $tip.slice(index + 1).not(':has(.lock, .blue)').eq(0).click();
    } else {
        $tip.eq(0).click();
    }
}
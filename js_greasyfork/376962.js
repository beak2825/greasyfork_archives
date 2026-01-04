// ==UserScript==
// @name         VIP1
// @namespace    https://shua.ccking.top/
// @version      1.0.0
// @description  try to take over the world!
// @author       代看联系QQ群：246363653
// @match        *://*.chaoxing.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @supportURL   https://greasyfork.org/zh-CN/scripts/369625-%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B/feedback
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/376962/VIP1.user.js
// @updateURL https://update.greasyfork.org/scripts/376962/VIP1.meta.js
// ==/UserScript==

// 设置修改后，需要刷新或重新打开网课页面才会生效
var setting = {
    // 5E3 == 5000，表示毫秒数
    time: 5E3 // 默认响应速度为5秒，不建议小于3秒

    // 1代表开启，0代表关闭
    ,video: 1 // 视频支持后台、切换窗口不暂停，支持多视频，默认开启
    ,work: 1 // 自动答题功能(章节测验)，高准确率，默认开启
    ,jump: 1 // 自动切换任务点、章节，默认开启
    ,test: 1 // 自动答题功能(考试)，高准确率，默认开启
    ,proxy: 0 // 自动答题功能的代理服务器，建议仅在自动答题功能无法加载时开启，默认关闭
    ,other: 0 // 兼容其他自动答题脚本，开启此功能会自动屏蔽work功能，默认关闭

    // 仅开启video时，修改此处才会生效
    ,line: '公网1' // 视频播放的默认资源线路，此功能适用于系统默认线路无资源，默认'公网1'
    ,http: '' // 视频播放的默认清晰度，可以设置'标清'等，无参数则使用系统默认清晰度，默认''
    ,muted: 1 // 视频静音播放，此功能在视频开始播放时调整音量至静音，默认关闭
    ,drag: 0 // 倍速播放、进度条拖动、快进快退，使用此功能会出现不良记录(慎用)，默认关闭
    ,player: '' // 指定播放器的类型，支持'html5'和'flash'两种参数，其他参数代表系统默认播放器，默认''

    // 仅开启work时，修改此处才会生效
    ,retry: 1 // 自动答题失败后进行重试，如果网课是需要每章解锁的建议开启，默认关闭

    // 仅开启jump时，修改此处才会生效
    ,check: 1 // 任务点无法自动完成时暂停切换，如果网课已全部解锁的建议关闭，默认开启
},
    _self = unsafeWindow,
    $ = _self.$ || top.$,
    url = location.pathname;

if (url.startsWith('/ananas/modules/video/index.html')) {
    if (setting.video) {
        checkPlayer();
    } else {
        reviseTip();
    }
} else if (url.startsWith('/work/doHomeWorkNew')) {
    if (setting.other) {
    } else if (setting.work && $('.Btn_blue_1').length) {
        addStyle();
    } else {
        reviseTip();
    }
} else if (url.startsWith('/exam/test/reVersionTestStartNew') && setting.test) {
    setting.parm = 1;
    addStyle();
} else if (url.startsWith('/knowledge/cards')) {
    checkToNext();
}

function toNext() {
    var $tip = $('.currents ~ span');
    if (!setting.jump) {
    } else if ($('.lock, .blue', '.currents').length || !$tip.length) {
        $tip = $('.roundpointStudent, .roundpoint').parent();
        var index = $tip.index($tip.filter('.currents'));
        $tip.slice(index + 1).not(':has(.lock, .blue)').eq(0).click();
    } else {
        $tip.eq(0).click();
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
    var $video = $('.ans-job-icon + iframe[src*="/video/index.html"]', parent.document),
        $job = $video.not('.ans-job-finished > iframe');
    setting.tip = false;
    if (!$job.length) {
    } else if ($job[0] == frameElement) {
        setting.tip = true;
    } else {
        setInterval(function() {
            if ($video.not('.ans-job-finished > iframe')[0] == frameElement) {
                location.reload();
            }
        }, setting.time);
    }
    if (!danmaku && _self.supportH5Video()) {
        hookVideo();
    } else if (_self.flashChecker().hasFlash) {
        hookJQuery();
    }
}

function hookVideo() {
    var vj = _self.ans.VideoJs.prototype,
        Hooks = vj.params2VideoOpt;
    vj.params2VideoOpt = function () {
        var config = Hooks.apply(this, arguments),
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
        vj.params2VideoOpt = Hooks;
        return config;
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
                config.datas.currVideoInfo.dftLineIndex = config.datas.currVideoInfo.getVideoUrl.match(/{.+?}/g).findIndex(function(currentValue) {
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

function addStyle() {
    $('head').append(
        '<style>' +
        '#toNext1, #toNext1+button, #toNext1~a[target=_blank], .TiMu>a{display: none !important;}' +
        'body>div[style]:not([class]){height: auto !important; min-height: 0 !important;}' +
        'body>div[style]:not([class]):before{content:"正在查找答案...";}' +
        '</style>'
    );
    addNanayun();
}

function addNanayun() {
    /**
 * api | nanayun.com
 * https://freejs19.nanayun.com/
 */
    var date = new Date(),
        xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://' + (setting.proxy ? 'proxy.forestpolice.org' : 'freejs19.nanayun.com') + '/allcontroller.min.js?refer=ext.qq.com/tampermonkey&version=1.9&t=' + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + (date.getMinutes() > 30 ? 1 : 0));
    xhr.timeout = setting.time;
    xhr.onloadend = function() {
        if (xhr.status == 200) {
            try {
                $('<script>' + atob(xhr.responseText.match(/base64,(.+?)';/)[1]) + '</script>').appendTo('head').remove();
                if (!setting.parm) {
                    setInterval(subAnswer, 20000);
                }
            } catch(err) {
                reviseTip();
            }
        } else if (setting.parm || setting.retry) {
            setTimeout(addNanayun, setting.time);
        } else {
            reviseTip();
        }
    };
    xhr.send();
}

function subAnswer() {
    if ($('#antable tr').length <= $('.TiMu').length) {
    } else if (!setting.finish) {
        setting.finish = 1;
        $('head').append(
            '<style>' +
            'body>div[style]:not([class]):before{content:"答案搜索已完成";}' +
            '</style>'
        );
    } else if ($('#validate', top.document).is(':hidden')) {
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

function reviseTip(win, num) {
    do {
        win = win ? win.parent : _self;
        num = $(win.frameElement).prev('.ans-job-icon').remove().length;
    } while (!num && win.parent.frameElement);
}
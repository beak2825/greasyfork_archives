// ==UserScript==
// @name            时间管理大师（小寒版）
// @name:en         小寒版时间管理
// @version         1.5
// @description     网页变速
// @description:en  web page variable speed
// @include         *
// @require         https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=881251
// @author          小寒    
// @namespace https://greasyfork.org/users/1002652
// @downloadURL https://update.greasyfork.org/scripts/457133/%E6%97%B6%E9%97%B4%E7%AE%A1%E7%90%86%E5%A4%A7%E5%B8%88%EF%BC%88%E5%B0%8F%E5%AF%92%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/457133/%E6%97%B6%E9%97%B4%E7%AE%A1%E7%90%86%E5%A4%A7%E5%B8%88%EF%BC%88%E5%B0%8F%E5%AF%92%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
/**
 * ---------------------------
 * Time: 2022/12/25
 * Author: 小寒
 * 抖音：90602277369
 * ---------------------------
 */

window.isDOMLoaded = false;
window.isDOMRendered = false;

document.addEventListener('readystatechange', function () {
    if (document.readyState === "interactive" || document.readyState === "complete") {
        window.isDOMLoaded = true;
    }
});

~function (global) {

    var workerURLs = [];
    var extraElements = [];
    var suppressEvents = {};

    var helper = function (eHookContext, timerContext, util) {
        return {
            applyUI: function () {
                var style = '._th-container ._th-item{margin-bottom:3px;position:relative;width:0;height:0;cursor:pointer;opacity:.3;background-color:aquamarine;border-radius:100%;text-align:center;line-height:30px;-webkit-transition:all .35s;-o-transition:all .35s;transition:all .35s;right:30px}._th-container ._th-item,._th-container ._th-click-hover,._th_cover-all-show-times ._th_times{-webkit-box-shadow:-3px 4px 12px -5px black;box-shadow:-3px 4px 12px -5px black}._th-container:hover ._th-item._item-x2{margin-left:18px;width:40px;height:40px;line-height:40px}._th-container:hover ._th-item._item-x-2{margin-left:17px;width:38px;height:38px;line-height:38px}._th-container:hover ._th-item._item-xx2{width:36px;height:36px;margin-left:16px;line-height:36px}._th-container:hover ._th-item._item-xx-2{width:32px;height:32px;line-height:32px;margin-left:14px}._th-container:hover ._th-item._item-reset{width:30px;line-height:30px;height:30px;margin-left:10px}._th-click-hover{position:relative;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;height:45px;width:45px;cursor:pointer;opacity:.3;border-radius:100%;background-color:aquamarine;text-align:center;line-height:45px;right:0}._th-container:hover{left:-5px}._th-container{font-size:12px;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;left:-35px;top:20%;position:fixed;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:100000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._th-container ._th-item:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th-container ._th-item:active{opacity:.9;background-color:#1b3a26;color:aliceblue}._th-container:hover ._th-click-hover{opacity:.8}._th-container:hover ._th-item{opacity:.6;right:0}._th-container ._th-click-hover:hover{opacity:.8;background-color:#5fb492;color:aliceblue}._th_cover-all-show-times{position:fixed;top:0;right:0;width:100%;height:100%;z-index:99999;opacity:1;font-weight:900;font-size:30px;color:#4f4f4f;background-color:rgba(0,0,0,0.1)}._th_cover-all-show-times._th_hidden{z-index:-99999;opacity:0;-webkit-transition:1s all;-o-transition:1s all;transition:1s all}._th_cover-all-show-times ._th_times{width:300px;height:300px;border-radius:50%;background-color:rgba(127,255,212,0.51);text-align:center;line-height:300px;position:absolute;top:50%;right:50%;margin-top:-150px;margin-right:-150px}';

                var displayNum = (1 / timerContext._percentage).toFixed(2);

                // 在页面左边添加一个半圆便于修改
                var html = '<div class="_th-container">\n' +
                    '    <div class="_th-click-hover _item-input">\n' +
                    '        x' + displayNum + '\n' +
                    '    </div>\n' +
                    '    <div class="_th-item _item-x2">&gt;</div>\n' +
                    '    <div class="_th-item _item-x-2">&lt;</div>\n' +
                    '    <div class="_th-item _item-xx2">&gt;&gt;</div>\n' +
                    '    <div class="_th-item _item-xx-2">&lt;&lt;</div>\n' +
                    '    <div class="_th-item _item-reset">O</div>\n' +
                    '</div>\n' +
                    '<div class="_th_cover-all-show-times _th_hidden">\n' +
                    '    <div class="_th_times">x' + displayNum + '</div>\n' +
                    '</div>' +
                    '';
                var stylenode = document.createElement('style');
                stylenode.setAttribute("type", "text/css");
                if (stylenode.styleSheet) {// IE
                    stylenode.styleSheet.cssText = style;
                } else {// w3c
                    var cssText = document.createTextNode(style);
                    stylenode.appendChild(cssText);
                }
                var node = document.createElement('div');
                node.innerHTML = html;

                var clickMapper = {
                    '_item-input': function () {
                        changeTime();
                    },
                    '_item-x2': function () {
                        changeTime(2, 0, true);
                    },
                    '_item-x-2': function () {
                        changeTime(-2, 0, true);
                    },
                    '_item-xx2': function () {
                        changeTime(0, 2);
                    },
                    '_item-xx-2': function () {
                        changeTime(0, -2);
                    },
                    '_item-reset': function () {
                        changeTime(0, 0, false, true);
                    }
                };

                Object.keys(clickMapper).forEach(function (className) {
                    var exec = clickMapper[className];
                    var targetEle = node.getElementsByClassName(className)[0];
                    if (targetEle) {
                        targetEle.onclick = exec;
                    }
                });

                if (!global.isDOMLoaded) {
                    document.addEventListener('readystatechange', function () {
                        if ((document.readyState === "interactive" || document.readyState === "complete") && !global.isDOMRendered) {
                            document.head.appendChild(stylenode);
                            document.body.appendChild(node);
                            global.isDOMRendered = true;
                            console.log('Time Hooker Works!');
                        }
                    });
                } else {
                    document.head.appendChild(stylenode);
                    document.body.appendChild(node);
                    global.isDOMRendered = true;
                    console.log('Time Hooker Works!');
                }
            },
            applyGlobalAction: function (timer) {
                // 界面半圆按钮点击的方法
                timer.changeTime = function (anum, cnum, isa, isr) {
                    if (isr) {
                        global.timer.change(1);
                        return;
                    }
                    if (!global.timer) {
                        return;
                    }
                    var result;
                    if (!anum && !cnum) {
                        var t = prompt("输入欲改变计时器变化倍率（当前：" + 1 / timerContext._percentage + "）");
                        if (t == null) {
                            return;
                        }
                        if (isNaN(parseFloat(t))) {
                            alert("请输入正确的数字");
                            timer.changeTime();
                            return;
                        }
                        if (parseFloat(t) <= 0) {
                            alert("倍率不能小于等于0");
                            timer.changeTime();
                            return;
                        }
                        result = 1 / parseFloat(t);
                    } else {
                        if (isa && anum) {
                            if (1 / timerContext._percentage <= 1 && anum < 0) {
                                return;
                            }
                            result = 1 / (1 / timerContext._percentage + anum);
                        } else {
                            if (cnum <= 0) {
                                cnum = 1 / -cnum
                            }
                            result = 1 / ((1 / timerContext._percentage) * cnum);
                        }
                    }
                    timer.change(result);
                };
                global.changeTime = timer.changeTime;
            },
            applyHooking: function () {
                var _this = this;
                // 劫持循环计时器
                eHookContext.hookReplace(window, 'setInterval', function (setInterval) {
                    return _this.getHookedTimerFunction('interval', setInterval);
                });
                // 劫持单次计时
                eHookContext.hookReplace(window, 'setTimeout', function (setTimeout) {
                    return _this.getHookedTimerFunction('timeout', setTimeout)
                });
                // 劫持循环计时器的清除方法
                eHookContext.hookBefore(window, 'clearInterval', function (method, args) {
                    _this.redirectNewestId(args);
                });
                // 劫持循环计时器的清除方法
                eHookContext.hookBefore(window, 'clearTimeout', function (method, args) {
                    _this.redirectNewestId(args);
                });
                var newFunc = this.getHookedDateConstructor();
                eHookContext.hookClass(window, 'Date', newFunc, '_innerDate', ['now']);
                Date.now = function () {
                    return new Date().getTime();
                };
                eHookContext.hookedToString(timerContext._Date.now, Date.now);
                var objToString = Object.prototype.toString;

                Object.prototype.toString = function toString() {
                    'use strict';
                    if (this instanceof timerContext._mDate) {
                        return '[object Date]';
                    } else {
                        return objToString.call(this);
                    }
                };

                eHookContext.hookedToString(objToString, Object.prototype.toString);
                eHookContext.hookedToString(timerContext._setInterval, setInterval);
                eHookContext.hookedToString(timerContext._setTimeout, setTimeout);
                eHookContext.hookedToString(timerContext._clearInterval, clearInterval);
                timerContext._mDate = window.Date;
                this.hookShadowRoot();
            },
            getHookedDateConstructor: function () {
                return function () {
                    if (arguments.length === 1) {
                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: new timerContext._Date(arguments[0]),
                            writable: false
                        });
                        return;
                    } else if (arguments.length > 1) {
                        var definedValue;
                        switch (arguments.length) {
                            case 2:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1]
                                );
                                break;
                            case 3:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                );
                                break;
                            case 4:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                );
                                break;
                            case 5:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4]
                                );
                                break;
                            case 6:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4],
                                    arguments[5]
                                );
                                break;
                            default:
                            case 7:
                                definedValue = new timerContext._Date(
                                    arguments[0],
                                    arguments[1],
                                    arguments[2],
                                    arguments[3],
                                    arguments[4],
                                    arguments[5],
                                    arguments[6]
                                );
                                break;
                        }

                        Object.defineProperty(this, '_innerDate', {
                            configurable: false,
                            enumerable: false,
                            value: definedValue,
                            writable: false
                        });
                        return;
                    }
                    var now = timerContext._Date.now();
                    var passTime = now - timerContext.__lastDatetime;
                    var hookPassTime = passTime * (1 / timerContext._percentage);
                    // console.log(__this.__lastDatetime + hookPassTime, now,__this.__lastDatetime + hookPassTime - now);
                    Object.defineProperty(this, '_innerDate', {
                        configurable: false,
                        enumerable: false,
                        value: new timerContext._Date(timerContext.__lastMDatetime + hookPassTime),
                        writable: false
                    });
                };
            },
            getHookedTimerFunction: function (type, timer) {
                var property = '_' + type + 'Ids';
                return function () {
                    var uniqueId = timerContext.genUniqueId();
                    var callback = arguments[0];
                    if (typeof callback === 'string') {
                        callback += ';timer.notifyExec(' + uniqueId + ')';
                        arguments[0] = callback;
                    }
                    if (typeof callback === 'function') {
                        arguments[0] = function () {
                            var returnValue = callback.apply(this, arguments);
                            timerContext.notifyExec(uniqueId);
                            return returnValue;
                        }
                    }
                    // 储存原始时间间隔
                    var originMS = arguments[1];
                    // 获取变速时间间隔
                    arguments[1] *= timerContext._percentage;
                    var resultId = timer.apply(window, arguments);
                    // 保存每次使用计时器得到的id以及参数等
                    timerContext[property][resultId] = {
                        args: arguments,
                        originMS: originMS,
                        originId: resultId,
                        nowId: resultId,
                        uniqueId: uniqueId,
                        oldPercentage: timerContext._percentage,
                        exceptNextFireTime: timerContext._Date.now() + originMS
                    };
                    return resultId;
                };
            },
            redirectNewestId: function (args) {
                var id = args[0];
                if (timerContext._intervalIds[id]) {
                    args[0] = timerContext._intervalIds[id].nowId;
                    // 清除该记录id
                    delete timerContext._intervalIds[id];
                }
                if (timerContext._timeoutIds[id]) {
                    args[0] = timerContext._timeoutIds[id].nowId;
                    // 清除该记录id
                    delete timerContext._timeoutIds[id];
                }
            },
            registerShortcutKeys: function (timer) {
                // 快捷键注册
                addEventListener('keydown', function (e) {
                    switch (e.keyCode) {
                        case 57:
                            if (e.ctrlKey || e.altKey) {
                                // custom
                                timer.changeTime();
                            }
                            break;
                        // [=]
                        case 190:
                        case 187: {
                            if (e.ctrlKey) {
                                // console.log('+2');
                                timer.changeTime(2, 0, true);
                            } else if (e.altKey) {
                                // console.log('xx2');
                                timer.changeTime(0, 2);
                            }
                            break;
                        }
                        // [-]
                        case 188:
                        case 189: {
                            if (e.ctrlKey) {
                                // console.log('-2');
                                timer.changeTime(-2, 0, true);
                            } else if (e.altKey) {
                                // console.log('xx-2');
                                timer.changeTime(0, -2);
                            }
                            break;
                        }
                        // [0]
                        case 48: {
                            if (e.ctrlKey || e.altKey) {
                                // console.log('reset');
                                timer.changeTime(0, 0, false, true);
                            }
                            break;
                        }
                        default:
                        // console.log(e);
                    }
                });
            },
            /**
             * 当计时器速率被改变时调用的回调方法
             * @param percentage
             * @private
             */
            percentageChangeHandler: function (percentage) {
                // 改变所有的循环计时
                util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
                    idObj.args[1] = Math.floor((idObj.originMS || 1) * percentage);
                    // 结束原来的计时器
                    this._clearInterval.call(window, idObj.nowId);
                    // 新开一个计时器
                    idObj.nowId = this._setInterval.apply(window, idObj.args);
                });
                // 改变所有的延时计时
                util.ergodicObject(timerContext, timerContext._timeoutIds, function (idObj, id) {
                    var now = this._Date.now();
                    var exceptTime = idObj.exceptNextFireTime;
                    var oldPercentage = idObj.oldPercentage;
                    var time = exceptTime - now;
                    if (time < 0) {
                        time = 0;
                    }
                    var changedTime = Math.floor(percentage / oldPercentage * time);
                    idObj.args[1] = changedTime;
                    // 重定下次执行时间
                    idObj.exceptNextFireTime = now + changedTime;
                    idObj.oldPercentage = percentage;
                    // 结束原来的计时器
                    this._clearTimeout.call(window, idObj.nowId);
                    // 新开一个计时器
                    idObj.nowId = this._setTimeout.apply(window, idObj.args);
                });
            },
            hookShadowRoot: function () {
                var origin = Element.prototype.attachShadow;
                eHookContext.hookAfter(Element.prototype, 'attachShadow',
                    function (m, args, result) {
                        extraElements.push(result);
                        return result;
                    }, false);
                eHookContext.hookedToString(origin, Element.prototype.attachShadow);
            },
            hookDefine: function () {
                const _this = this;
                eHookContext.hookBefore(Object, 'defineProperty', function (m, args) {
                    var option = args[2];
                    var ele = args[0];
                    var key = args[1];
                    var afterArgs = _this.hookDefineDetails(ele, key, option);
                    afterArgs.forEach((arg, i) => {
                        args[i] = arg;
                    })
                });
                eHookContext.hookBefore(Object, 'defineProperties', function (m, args) {
                    var option = args[1];
                    var ele = args[0];
                    if (ele && ele instanceof Element) {
                        Object.keys(option).forEach(key => {
                            var o = option[key];
                            var afterArgs = _this.hookDefineDetails(ele, key, o);
                            args[0] = afterArgs[0];
                            delete option[key];
                            option[afterArgs[1]] = afterArgs[2]
                        })
                    }
                })
            },
            hookDefineDetails: function (target, key, option) {
                if (option && target && target instanceof Element && typeof key === 'string' && key.indexOf('on') >= 0) {
                    option.configurable = true;
                }
                if (target instanceof HTMLVideoElement && key === 'playbackRate') {
                    option.configurable = true;
                    console.warn('[Timer Hook]', '已阻止默认操作视频倍率');
                    key = 'playbackRate_hooked'
                }
                return [target, key, option];
            },
            suppressEvent: function (ele, eventName) {
                if (ele) {
                    delete ele['on' + eventName];
                    delete ele['on' + eventName];
                    delete ele['on' + eventName];
                    ele['on' + eventName] = undefined;
                }
                if (!suppressEvents[eventName]) {
                    eHookContext.hookBefore(EventTarget.prototype, 'addEventListener',
                        function (m, args) {
                            var eName = args[0];
                            if (eventName === eName) {
                                console.warn(eventName, 'event suppressed.')
                                args[0] += 'suppressed';
                            }
                        }, false);
                    suppressEvents[eventName] = true;
                }
            },
            changePlaybackRate: function (ele, rate) {
                delete ele.playbackRate;
                delete ele.playbackRate;
                delete ele.playbackRate;
                ele.playbackRate = rate
                if (rate !== 1) {
                    timerContext.defineProperty.call(Object, ele, 'playbackRate', {
                        configurable: true,
                        get: function () {
                            return 1;
                        },
                        set: function () {
                        }
                    });
                }
            }
        }
    };

    var normalUtil = {
        isInIframe: function () {
            let is = global.parent !== global;
            try {
                is = is && global.parent.document.body.tagName !== 'FRAMESET'
            } catch (e) {
                // ignore
            }
            return is;
        },
        listenParentEvent: function (handler) {
            global.addEventListener('message', function (e) {
                var data = e.data;
                var type = data.type || '';
                if (type === 'changePercentage') {
                    handler(data.percentage || 0);
                }
            })
        },
        sentChangesToIframe: function (percentage) {
            var iframes = document.querySelectorAll('iframe') || [];
            var frames = document.querySelectorAll('frame');
            if (iframes.length) {
                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].contentWindow.postMessage(
                        {type: 'changePercentage', percentage: percentage}, '*');
                }
            }
            if (frames.length) {
                for (var j = 0; j < frames.length; j++) {
                    frames[j].contentWindow.postMessage(
                        {type: 'changePercentage', percentage: percentage}, '*');
                }
            }
        }
    };

    var querySelectorAll = function (ele, selector, includeExtra) {
        var elements = ele.querySelectorAll(selector);
        elements = Array.prototype.slice.call(elements || []);
        if (includeExtra) {
            extraElements.forEach(function (element) {
                elements = elements.concat(querySelectorAll(element, selector, false));
            })
        }
        return elements;
    };

    var generate = function () {
        return function (util) {
            // disable worker
            workerURLs.forEach(function (url) {
                if (util.urlMatching(location.href, 'http.*://.*' + url + '.*')) {
                    window['Worker'] = undefined;
                    console.log('Worker disabled');
                }
            });
            var eHookContext = this;
            var timerHooker = {
                // 用于储存计时器的id和参数
                _intervalIds: {},
                _timeoutIds: {},
                _auoUniqueId: 1,
                // 计时器速率
                __percentage: 1.0,
                // 劫持前的原始的方法
                _setInterval: window['setInterval'],
                _clearInterval: window['clearInterval'],
                _clearTimeout: window['clearTimeout'],
                _setTimeout: window['setTimeout'],
                _Date: window['Date'],
                __lastDatetime: new Date().getTime(),
                __lastMDatetime: new Date().getTime(),
                videoSpeedInterval: 1000,
                defineProperty: Object.defineProperty,
                defineProperties: Object.defineProperties,
                genUniqueId: function () {
                    return this._auoUniqueId++;
                },
                notifyExec: function (uniqueId) {
                    var _this = this;
                    if (uniqueId) {
                        // 清除 timeout 所储存的记录
                        var timeoutInfos = Object.values(this._timeoutIds).filter(
                            function (info) {
                                return info.uniqueId === uniqueId;
                            }
                        );
                        timeoutInfos.forEach(function (info) {
                            _this._clearTimeout.call(window, info.nowId);
                            delete _this._timeoutIds[info.originId]
                        })
                    }
                    // console.log(uniqueId, 'called')
                },
                /**
                 * 初始化方法
                 */
                init: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);

                    h.hookDefine();
                    h.applyHooking();

                    // 设定百分比属性被修改的回调
                    Object.defineProperty(timerContext, '_percentage', {
                        get: function () {
                            return timerContext.__percentage;
                        },
                        set: function (percentage) {
                            if (percentage === timerContext.__percentage) {
                                return percentage;
                            }
                            h.percentageChangeHandler(percentage);
                            timerContext.__percentage = percentage;
                            return percentage;
                        }
                    });

                    if (!normalUtil.isInIframe()) {
                        console.log('[TimeHooker]', 'loading outer window...');
                        h.applyUI();
                        h.applyGlobalAction(timerContext);
                        h.registerShortcutKeys(timerContext);
                    } else {
                        console.log('[TimeHooker]', 'loading inner window...');
                        normalUtil.listenParentEvent((function (percentage) {
                            console.log('[TimeHooker]', 'Inner Changed', percentage)
                            this.change(percentage);
                        }).bind(this))
                    }
                },
                /**
                 * 调用该方法改变计时器速率
                 * @param percentage
                 */
                change: function (percentage) {
                    this.__lastMDatetime = this._mDate.now();
                    this.__lastDatetime = this._Date.now();
                    this._percentage = percentage;
                    var oldNode = document.getElementsByClassName('_th-click-hover');
                    var oldNode1 = document.getElementsByClassName('_th_times');
                    var displayNum = (1 / this._percentage).toFixed(2);
                    (oldNode[0] || {}).innerHTML = 'x' + displayNum;
                    (oldNode1[0] || {}).innerHTML = 'x' + displayNum;
                    var a = document.getElementsByClassName('_th_cover-all-show-times')[0] || {};
                    a.className = '_th_cover-all-show-times';
                    this._setTimeout.bind(window)(function () {
                        a.className = '_th_cover-all-show-times _th_hidden';
                    }, 100);
                    this.changeVideoSpeed();
                    normalUtil.sentChangesToIframe(percentage);
                },
                changeVideoSpeed: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);
                    var rate = 1 / this._percentage;
                    rate > 16 && (rate = 16);
                    rate < 0.065 && (rate = 0.065);
                    var videos = querySelectorAll(document, 'video', true) || [];
                    if (videos.length) {
                        for (var i = 0; i < videos.length; i++) {
                            h.changePlaybackRate(videos[i], rate);
                        }
                    }
                }
            };
            // 默认初始化
            timerHooker.init();
            return timerHooker;
        }
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: 'timer',
            /**
             * 插件装载
             * @param util
             */
            mount: generate()
        });
    }
}(window);

(function () {
    'use strict';

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        include(str, arr) {
            str = str.replace(/[-_]/ig, '');
            for (let i = 0, l = arr.length; i < l; i++) {
                let val = arr[i];
                if (val !== '' && str.toLowerCase().indexOf(val.toLowerCase()) > -1) {
                    return true;
                }
            }
            return false;
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },

        reg: {
            chrome: /^https?:\/\/chrome.google.com\/webstore\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
            edge: /^https?:\/\/microsoftedge.microsoft.com\/addons\/.+?\/([a-z]{32})(?=[\/#?]|$)/,
            firefox: /^https?:\/\/(reviewers\.)?(addons\.mozilla\.org|addons(?:-dev)?\.allizom\.org)\/.*?(?:addon|review)\/([^/<>"'?#]+)/,
            microsoft: /^https?:\/\/(?:apps|www).microsoft.com\/(?:store|p)\/.+?\/([a-zA-Z\d]{10,})(?=[\/#?]|$)/,
        }
    };

    let main = {
        initValue() {
            let value = [{
                name: 'setting_success_times',
                value: 0
            }, {
                name: 'allow_external_links',
                value: true
            }, {
                name: 'allow_query_links',
                value: true
            }, {
                name: 'enable_store_link',
                value: true
            }, {
                name: 'enable_target_self',
                value: false
            }, {
                name: 'enable_animation',
                value: false
            }, {
                name: 'delay_on_hover',
                value: 65
            }, {
                name: 'exclude_list',
                value: ''
            }, {
                name: 'exclude_keyword',
                value: 'login\nlogout\nregister\nsignin\nsignup\nsignout\npay\ncreate\nedit\ndownload\ndel\nreset\nsubmit\ndoubleclick\ngoogleads\nexit'
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        registerMenuCommand() {
            GM_registerMenuCommand('🚀 已加速：' + util.getValue('setting_success_times') + '次', () => {
                Swal.fire({
                    showCancelButton: true,
                    title: '确定要重置加速次数吗？',
                    icon: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass: {
                        popup: 'instant-popup',
                    },
                }).then((res) => {
                    if (res.isConfirmed) {
                        util.setValue('setting_success_times', 0);
                        history.go(0);
                    }
                });
            });
            GM_registerMenuCommand('⚙️ 设置', () => {
                let dom = `<div style="font-size: 1em;">
                              <label class="instant-setting-label">加速外部链接<input type="checkbox" id="S-External" ${util.getValue('allow_external_links') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label"><span>加速含参数链接 <a href="https://www.youxiaohou.com/tool/install-instantpage.html#%E9%85%8D%E7%BD%AE%E8%AF%B4%E6%98%8E">详见</a></span><input type="checkbox" id="S-Query" ${util.getValue('allow_query_links') ? 'checked' : ''}
                              class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速扩展/应用商店链接<input type="checkbox" id="S-Store" ${util.getValue('enable_store_link') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速链接在当前页打开<input type="checkbox" id="S-Target" ${util.getValue('enable_target_self') ? 'checked' : ''} class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">加速动画效果<input type="checkbox" id="S-Animate" ${util.getValue('enable_animation') ? 'checked' : ''}
                              class="instant-setting-checkbox"></label>
                              <label class="instant-setting-label">链接预读延时（毫秒）<input type="number" min="65" id="S-Delay" value="${util.getValue('delay_on_hover')}"
                              class="instant-setting-input"></label>
                              <label class="instant-setting-label-col">排除下列网址 <textarea placeholder="列表中的域名将不开启加速器，一行一个，例如：www.baidu.com" id="S-Exclude" class="instant-setting-textarea">${util.getValue('exclude_list')}</textarea></label>
                              <label class="instant-setting-label-col">排除下列关键词 <textarea placeholder="链接中含关键词将不开启加速器，一行一个，例如：logout" id="S-Exclude-Word" class="instant-setting-textarea">${util.getValue('exclude_keyword')}</textarea></label>
                            </div>`;
                Swal.fire({
                    title: '加速器配置',
                    html: dom,
                    showCloseButton: true,
                    confirmButtonText: '保存',
                    footer: '<div style="text-align: center;font-size: 1em;">点击查看 <a href="https://www.youxiaohou.com/tool/install-instantpage.html" target="_blank">使用说明</a>，助手免费开源，Powered by <a href="https://www.youxiaohou.com">油小猴</a></div>',
                    customClass: {
                        popup: 'instant-popup',
                    },
                }).then((res) => {
                    if (res.isConfirmed) {
                        history.go(0);
                    }
                });

                document.getElementById('S-External').addEventListener('change', (e) => {
                    util.setValue('allow_external_links', e.currentTarget.checked);
                });
                document.getElementById('S-Query').addEventListener('change', (e) => {
                    util.setValue('allow_query_links', e.currentTarget.checked);
                });
                document.getElementById('S-Store').addEventListener('change', (e) => {
                    util.setValue('enable_store_link', e.currentTarget.checked);
                });
                document.getElementById('S-Target').addEventListener('change', (e) => {
                    util.setValue('enable_target_self', e.currentTarget.checked);
                });
                document.getElementById('S-Animate').addEventListener('change', (e) => {
                    util.setValue('enable_animation', e.currentTarget.checked);
                });
                document.getElementById('S-Delay').addEventListener('change', (e) => {
                    util.setValue('delay_on_hover', e.currentTarget.value);
                });
                document.getElementById('S-Exclude').addEventListener('change', (e) => {
                    util.setValue('exclude_list', e.currentTarget.value);
                });
                document.getElementById('S-Exclude-Word').addEventListener('change', (e) => {
                    util.setValue('exclude_keyword', e.currentTarget.value);
                });
            });
        },

        //在排除名单里
        inExcludeList() {
            let exclude = util.getValue('exclude_list').split('\n');
            let host = location.host;
            return exclude.includes(host);
        },

        //加速主代码
        instantPage() {
            if (window.instantLoaded) return;
            let mouseoverTimer;
            let lastTouchTimestamp;
            const prefetches = new Set();
            const prefetchElement = document.createElement('link');
            const isSupported = prefetchElement.relList && prefetchElement.relList.supports && prefetchElement.relList.supports('prefetch')
                && window.IntersectionObserver && 'isIntersecting' in IntersectionObserverEntry.prototype;
            const isOnline = () => window.navigator.onLine;
            const allowQueryString = 'instantAllowQueryString' in document.body.dataset || util.getValue('allow_query_links');
            const allowExternalLinks = 'instantAllowExternalLinks' in document.body.dataset || util.getValue('allow_external_links');
            const useWhitelist = 'instantWhitelist' in document.body.dataset;
            const mousedownShortcut = 'instantMousedownShortcut' in document.body.dataset;
            const DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION = 1111;
            const enableAnimation = util.getValue('enable_animation');
            const enableTargetSelf = util.getValue('enable_target_self');
            const enableStoreLink = util.getValue('enable_store_link');
            window.instantLoaded = true;
            const excludeKeyword = util.getValue('exclude_keyword').split('\n');

            let delayOnHover = util.getValue('delay_on_hover');
            let useMousedown = false;
            let useMousedownOnly = false;
            let useViewport = false;

            if ('instantIntensity' in document.body.dataset) {
                const intensity = document.body.dataset.instantIntensity;

                if (intensity.substr(0, 'mousedown'.length) === 'mousedown') {
                    useMousedown = true;
                    if (intensity === 'mousedown-only') {
                        useMousedownOnly = true;
                    }
                } else if (intensity.substr(0, 'viewport'.length) === 'viewport') {
                    if (!(navigator.connection && (navigator.connection.saveData || (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g'))))) {
                        if (intensity === "viewport") {
                            if (document.documentElement.clientWidth * document.documentElement.clientHeight < 450000) {
                                useViewport = true;
                            }
                        } else if (intensity === "viewport-all") {
                            useViewport = true;
                        }
                    }
                } else {
                    const milliseconds = parseInt(intensity);
                    if (!Number.isNaN(milliseconds)) {
                        delayOnHover = milliseconds;
                    }
                }
            }

            if (isSupported) {
                const eventListenersOptions = {
                    capture: true,
                    passive: true,
                };

                if (!useMousedownOnly) {
                    document.addEventListener('touchstart', touchstartListener, eventListenersOptions);
                }

                if (!useMousedown) {
                    document.addEventListener('mouseover', mouseoverListener, eventListenersOptions);
                } else if (!mousedownShortcut) {
                    document.addEventListener('mousedown', mousedownListener, eventListenersOptions);
                }

                if (mousedownShortcut) {
                    document.addEventListener('mousedown', mousedownShortcutListener, eventListenersOptions);
                }


                if (useViewport) {
                    let triggeringFunction;
                    if (window.requestIdleCallback) {
                        triggeringFunction = (callback) => {
                            requestIdleCallback(callback, {
                                timeout: 1500,
                            });
                        };
                    } else {
                        triggeringFunction = (callback) => {
                            callback();
                        };
                    }

                    triggeringFunction(() => {
                        const intersectionObserver = new IntersectionObserver((entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    const linkElement = entry.target;
                                    intersectionObserver.unobserve(linkElement);
                                    preload(linkElement);
                                }
                            });
                        });

                        document.querySelectorAll('a').forEach((linkElement) => {
                            if (isPreloadable(linkElement)) {
                                intersectionObserver.observe(linkElement);
                            }
                        });
                    });
                }
            }

            function touchstartListener(event) {
                /* Chrome on Android calls mouseover before touchcancel so `lastTouchTimestamp`
                 * must be assigned on touchstart to be measured on mouseover. */
                lastTouchTimestamp = performance.now();

                const linkElement = event.target.closest('a');

                if (!isPreloadable(linkElement)) {
                    return;
                }

                preload(linkElement);
            }

            function mouseoverListener(event) {
                if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
                    return;
                }

                if (!('closest' in event.target)) {
                    // Without this check sometimes an error “event.target.closest is not a function” is thrown, for unknown reasons
                    // That error denotes that `event.target` isn’t undefined. My best guess is that it’s the Document.

                    // Details could be gleaned from throwing such an error:
                    //throw new TypeError(`instant.page non-element event target: timeStamp=${~~event.timeStamp}, type=${event.type}, typeof=${typeof event.target}, nodeType=${event.target.nodeType}, nodeName=${event.target.nodeName}, viewport=${innerWidth}x${innerHeight}, coords=${event.clientX}x${event.clientY}, scroll=${scrollX}x${scrollY}`)
                    return
                }

                const linkElement = event.target.closest('a');

                if (!isPreloadable(linkElement)) {
                    return;
                }

                linkElement.addEventListener('mouseout', mouseoutListener, {passive: true});

                mouseoverTimer = setTimeout(() => {
                    preload(linkElement);
                    mouseoverTimer = undefined;
                }, delayOnHover);
            }

            function mousedownListener(event) {
                const linkElement = event.target.closest('a');

                if (!isPreloadable(linkElement)) {
                    return;
                }

                preload(linkElement);
            }

            function mouseoutListener(event) {
                if (event.relatedTarget && event.target.closest('a') === event.relatedTarget.closest('a')) {
                    return;
                }

                if (mouseoverTimer) {
                    clearTimeout(mouseoverTimer);
                    mouseoverTimer = undefined;
                }
            }

            function mousedownShortcutListener(event) {
                if (performance.now() - lastTouchTimestamp < DELAY_TO_NOT_BE_CONSIDERED_A_TOUCH_INITIATED_ACTION) {
                    return;
                }

                const linkElement = event.target.closest('a');

                if (event.which > 1 || event.metaKey || event.ctrlKey) {
                    return;
                }

                if (!linkElement) {
                    return;
                }

                linkElement.addEventListener('click', function (event) {
                    if (event.detail === 1337) {
                        return;
                    }

                    event.preventDefault();
                }, {capture: true, passive: false, once: true});

                const customEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    detail: 1337
                });
                linkElement.dispatchEvent(customEvent);
            }

            function isPreloadable(linkElement) {
                if (!linkElement || !linkElement.href) {
                    return;
                }

                if (util.include(linkElement.href, excludeKeyword)) {
                    if (!util.reg.chrome.test(linkElement.href) &&
                        !util.reg.edge.test(linkElement.href) &&
                        !util.reg.edge.test(linkElement.href) &&
                        !util.reg.microsoft.test(linkElement.href)) {
                        return;
                    }
                }

                if (useWhitelist && !('instant' in linkElement.dataset)) {
                    return;
                }

                if (!allowExternalLinks && linkElement.origin !== location.origin && !('instant' in linkElement.dataset)) {
                    return;
                }

                if (!['http:', 'https:'].includes(linkElement.protocol)) {
                    return;
                }

                if (linkElement.protocol === 'http:' && location.protocol === 'https:') {
                    if (linkElement.href.indexOf('http://www.baidu.com/link?url') === 0) {
                        linkElement.href = linkElement.href.replace('http', 'https');
                    } else {
                        return;
                    }
                }
                //下载文件不加速
                if (/\.[a-zA-Z0-9]{0,5}$/i.test(linkElement.href)) {
                    //排除域名，网站扩展名
                    if (!/(com|cn|top|ltd|net|tech|shop|vip|xyz|wang|cloud|online|site|love|art|xin|store|fun|cc|website|press|space|beer|luxe|video|ren|group|fit|yoga|org|pro|ink|biz|info|design|link|work|mobi|kim|pub|name|tv|co|asia|red|live|wiki|gov|life|world|run|show|city|gold|today|plus|cool|icu|company|chat|zone|fans|law|host|center|club|email|fund|social|team|guru|htm|html|php|asp|jsp)$/i.test(linkElement.href)) {
                        return;
                    }
                }

                if (!allowQueryString && linkElement.search && !('instant' in linkElement.dataset)) {
                    return;
                }

                if (linkElement.hash && linkElement.pathname + linkElement.search === location.pathname + location.search) {
                    return;
                }

                if (linkElement.dataset.filename || linkElement.dataset.noInstant) {
                    return;
                }

                return true;
            }

            function preload(linkElement) {
                let url = linkElement.href;

                if (!isOnline()) {
                    return;
                }

                if (prefetches.has(url)) {
                    return;
                }

                if (enableStoreLink) {
                    if (util.reg.chrome.test(url)) {
                        linkElement.href = url.replace("chrome.google.com", "chrome.crxsoso.com");
                    }
                    if (util.reg.edge.test(url)) {
                        linkElement.href = url.replace("microsoftedge.microsoft.com", "microsoftedge.crxsoso.com");
                    }
                    if (util.reg.firefox.test(url)) {
                        linkElement.href = url.replace("addons.mozilla.org", "addons.crxsoso.com");
                    }
                    if (util.reg.microsoft.test(url)) {
                        linkElement.href = url.replace(/(www|apps)\.microsoft\.com/, "apps.crxsoso.com");
                    }
                }

                const prefetcher = document.createElement('link');
                prefetcher.rel = 'prefetch';
                prefetcher.href = url;
                document.head.appendChild(prefetcher);

                prefetches.add(url);

                if (enableAnimation) {
                    linkElement.classList.add("link-instanted");
                }
                if (enableTargetSelf) {
                    linkElement.target = '_self';
                }

                util.setValue('setting_success_times', util.getValue('setting_success_times') + 1);
            }
        },

        addPluginStyle() {
            let style = `
                .instant-popup { font-size: 14px !important; }
                .instant-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                .instant-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                .instant-setting-checkbox { width: 16px;height: 16px; }
                .instant-setting-textarea { width: 100%; margin: 14px 0 0; height: 60px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                .instant-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                 @keyframes instantAnminate { from { opacity: 1; } 50% { opacity: 0.4 } to { opacity: 0.9; }}
                .link-instanted { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
                .link-instanted * { animation: instantAnminate 0.6s 1; animation-fill-mode:forwards }
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('instant-style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('instant-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        init() {
            this.initValue();
            this.addPluginStyle();
            this.registerMenuCommand();
            if (this.inExcludeList()) return;
            this.instantPage();
        }
    };
    main.init();
})();

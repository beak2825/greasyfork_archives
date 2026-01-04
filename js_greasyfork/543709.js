// ==UserScript==
// @name            TSun TimerHooker
// @name:en         TSun TimerHooker
// @version         1.2.6
// @description     Control page timer speed | Speed up to skip page timing ads | Video fast forward (slow play) | Skip ads | Support almost all web pages.
// @description:en  it can hook the timer speed to change.
// @include         *
// @require         https://greasyfork.org/scripts/372672-everything-hook/code/Everything-Hook.js?version=881251
// @author          ༯𝙎คAEED✘🫀
// @icon            https://img.icons8.com/?size=200&id=kYqbEzjS6EBh&format=png
// @match           http://*/*
// @run-at          document-start
// @grant           none
// @license         GPL-3.0-or-later
// @namespace       https://github.com/SaeedX302
// @downloadURL https://update.greasyfork.org/scripts/543709/TSun%20TimerHooker.user.js
// @updateURL https://update.greasyfork.org/scripts/543709/TSun%20TimerHooker.meta.js
// ==/UserScript==
/**
 * ---------------------------
 * TSun TimerHooker
 *
 * Changelog v1.2.6:
 * - Replaced the full-screen pop-up with a sleek, modern toast notification
 * that appears at the bottom of the screen.
 * - The new notification has a glass blur effect and smooth animations.
 *
 * Author: ༯𝙎คAEED✘🫀
 * Made With 🫀 By ༯𝙎คAEED✘🫀
 * ---------------------------
 */

/**
 * 1. hook Object.defineProperty | Object.defineProperties
 * 2. set configurable: true
 * 3. delete property
 * 4. can set property for onxx event method
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
                var style = '._th-container ._th-item{margin-bottom:3px;position:relative;width:0;height:0;cursor:pointer;opacity:.7;background-color:rgba(255, 100, 130, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius:100%;text-align:center;line-height:30px;-webkit-transition:all .35s;-o-transition:all .35s;transition:all .35s;right:30px; display: flex; justify-content: center; align-items: center;}._th-container ._th-item img{height: 65%; width: auto; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.4));}._th-container ._th-item,._th-container ._th-click-hover{-webkit-box-shadow:-3px 4px 12px -5px black;box-shadow:-3px 4px 12px -5px black}._th-container:hover ._th-item._item-x2{margin-left:18px;width:40px;height:40px;line-height:40px}._th-container:hover ._th-item._item-x-2{margin-left:17px;width:38px;height:38px;line-height:38px}._th-container:hover ._th-item._item-xx2{width:36px;height:36px;margin-left:16px;line-height:36px}._th-container:hover ._th-item._item-xx-2{width:32px;height:32px;line-height:32px;margin-left:14px}._th-container:hover ._th-item._item-reset{width:30px;line-height:30px;height:30px;margin-left:10px}._th-click-hover{position:relative;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;height:45px;width:45px;cursor:pointer;opacity:.7;border-radius:100%;background-color:rgba(255, 100, 130, 0.3); border: 1px solid rgba(255, 255, 255, 0.15); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); text-align:center;line-height:45px;right:0; color: #fff; font-weight: bold; text-shadow: 0 1px 4px rgba(0,0,0,0.5);}._th-container:hover{left:-5px}._th-container{font-size:12px;-webkit-transition:all .5s;-o-transition:all .5s;transition:all .5s;left:-35px;top:20%;position:fixed;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:100000;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}._th-container ._th-item:hover{opacity:1;background-color:rgba(255, 100, 100, 0.6);}._th-container ._th-item:active{opacity:1;background-color:rgba(220, 50, 50, 0.8); transform: scale(0.95);}._th-container:hover ._th-click-hover{opacity:1}._th-container:hover ._th-item{opacity:.8;right:0}._th-container ._th-click-hover:hover{opacity:1;background-color:rgba(255, 100, 100, 0.6);}' +
                '._th-toast{position:fixed;bottom:-100px;left:50%;transform:translateX(-50%);padding:10px 20px;border-radius:12px;background-color:rgba(255, 100, 130, 0.7);color:#fff;font-size:16px;font-weight:bold;text-shadow:0 1px 2px rgba(0,0,0,0.3);z-index:9999999;box-shadow:0 4px 15px rgba(0,0,0,0.2);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255, 255, 255, 0.2);transition:bottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);visibility:hidden;}' +
                '._th-toast.show{bottom:30px;visibility:visible;}';

                var displayNum = (1 / timerContext._percentage).toFixed(2);

                // Add a semicircle on the left side of the page for easy modification
                var html = '<div class="_th-container">\n' +
                    '    <div class="_th-click-hover _item-input">\n' +
                    '        x' + displayNum + '\n' +
                    '    </div>\n' +
                    '    <div class="_th-item _item-x2" title="Add 2x"><img src="https://img.icons8.com/?size=100&id=sbqXVNJw3XXP&format=png&color=000000" alt="+2"/></div>\n' +
                    '    <div class="_th-item _item-x-2" title="Subtract 2x"><img src="https://img.icons8.com/?size=100&id=4wIFhFUf35lz&format=png&color=000000" alt="-2"/></div>\n' +
                    '    <div class="_th-item _item-xx2" title="Multiply by 2"><img src="https://img.icons8.com/?size=100&id=as4wAkWJZrIK&format=png&color=000000" alt="x2"/></div>\n' +
                    '    <div class="_th-item _item-xx-2" title="Divide by 2"><img src="https://img.icons8.com/?size=100&id=4wIFhFUf35lz&format=png&color=000000" alt="/2"/></div>\n' +
                    '    <div class="_th-item _item-reset" title="Reset to 1x"><img src="https://img.icons8.com/?size=100&id=JzBXDDA2kACA&format=png&color=000000" alt="Reset"/></div>\n' +
                    '</div>\n';

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

                const onReady = () => {
                    if (!document.body) return;
                    document.head.appendChild(stylenode);
                    document.body.appendChild(node);
                    // Create and append toast element
                    var toastNode = document.createElement('div');
                    toastNode.className = '_th-toast';
                    document.body.appendChild(toastNode);
                    global.isDOMRendered = true;
                    console.log('Time Hooker Works!');
                };

                if (document.body) {
                    onReady();
                } else {
                    new MutationObserver((mutations, observer) => {
                        if (document.body) {
                            observer.disconnect();
                            onReady();
                        }
                    }).observe(document.documentElement, {childList: true});
                }
            },
            applyGlobalAction: function (timer) {
                // Method of clicking the semicircle button on the interface
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
                        var t = prompt("Enter the desired change rate of the timer change（current：" + 1 / timerContext._percentage + "）");
                        if (t == null) {
                            return;
                        }
                        if (isNaN(parseFloat(t))) {
                            alert("Please enter the correct number");
                            timer.changeTime();
                            return;
                        }
                        if (parseFloat(t) <= 0) {
                            alert("The magnification cannot be less than or equal to 0");
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
                // Hijack the loop timer
                eHookContext.hookReplace(window, 'setInterval', function (setInterval) {
                    return _this.getHookedTimerFunction('interval', setInterval);
                });
                // Hijack a single timer
                eHookContext.hookReplace(window, 'setTimeout', function (setTimeout) {
                    return _this.getHookedTimerFunction('timeout', setTimeout)
                });
                // Hijack the clear method of the loop timer
                eHookContext.hookBefore(window, 'clearInterval', function (method, args) {
                    _this.redirectNewestId(args);
                });
                // Hijack the clear method of the loop timer
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
                    // save the original time interval
                    var originMS = arguments[1];
                    // Get variable speed interval
                    arguments[1] *= timerContext._percentage;
                    var resultId = timer.apply(window, arguments);
                    // Save the id and parameters obtained each time the timer is used
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
                    // clear this recordid
                    delete timerContext._intervalIds[id];
                }
                if (timerContext._timeoutIds[id]) {
                    args[0] = timerContext._timeoutIds[id].nowId;
                    // clear this recordid
                    delete timerContext._timeoutIds[id];
                }
            },
            registerShortcutKeys: function (timer) {
                // Shortcut key registration
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
             * Callback method called when the timer rate is changed
             * @param percentage
             * @private
             */
            percentageChangeHandler: function (percentage) {
                // Change all loop timings
                util.ergodicObject(timerContext, timerContext._intervalIds, function (idObj, id) {
                    idObj.args[1] = Math.floor((idObj.originMS || 1) * percentage);
                    // End the original timer
                    this._clearInterval.call(window, idObj.nowId);
                    // start a new timer
                    idObj.nowId = this._setInterval.apply(window, idObj.args);
                });
                // Change all delay timings
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
                    // Reschedule the next execution time
                    idObj.exceptNextFireTime = now + changedTime;
                    idObj.oldPercentage = percentage;
                    // end the original timer
                    this._clearTimeout.call(window, idObj.nowId);
                    // start a new timer
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
                    console.warn('[Timer Hook]', 'Default action video magnification blocked');
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
                // Used to store the id and parameters of the timer
                _intervalIds: {},
                _timeoutIds: {},
                _auoUniqueId: 1,
                // timer rate
                __percentage: 1.0,
                // Original method before hijacking
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
                        // clear timeout stored records
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
                },
                /**
                 * initialization method
                 */
                init: function () {
                    var timerContext = this;
                    var h = helper(eHookContext, timerContext, util);

                    h.hookDefine();
                    h.applyHooking();

                    // Set the callback when the percentage property is modified
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
                 * Call this method to change the timer rate
                 * @param percentage
                 */
                change: function (percentage) {
                    this.__lastMDatetime = this._mDate.now();
                    this.__lastDatetime = this._Date.now();
                    this._percentage = percentage;
                    var mainBubble = document.getElementsByClassName('_th-click-hover')[0];
                    var displayNum = (1 / this._percentage).toFixed(2);
                    if(mainBubble) {
                        mainBubble.innerHTML = 'x' + displayNum;
                    }

                    // Show toast notification
                    var toast = document.getElementsByClassName('_th-toast')[0];
                    if (toast) {
                        toast.innerHTML = 'Speed: ' + displayNum + 'x';
                        toast.classList.add('show');
                        this._setTimeout.call(window, function () {
                            toast.classList.remove('show');
                        }, 2000); // Show for 2 seconds
                    }

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
            // default initialization
            timerHooker.init();
            return timerHooker;
        }
    };

    if (global.eHook) {
        global.eHook.plugins({
            name: 'timer',
            /**
             * Plugin loading
             * @param util
             */
            mount: generate()
        });
    }
}(window);

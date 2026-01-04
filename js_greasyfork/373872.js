// ==UserScript==
// @name         xspace-copyID
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  help copy loginId or go to green channel
// @author       You
// @match        https://x-space.taobao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373872/xspace-copyID.user.js
// @updateURL https://update.greasyfork.org/scripts/373872/xspace-copyID.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //--------
    //--------
    //--------
    //--------
    var cssAnimation = (function(){
        //----Event----
        var Event = (function() {

            "use strict";
            var EVENT_NAME_MAP = {
                transitionend: {
                    transition: 'transitionend',
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'mozTransitionEnd',
                    OTransition: 'oTransitionEnd',
                    msTransition: 'MSTransitionEnd'
                },

                animationend: {
                    animation: 'animationend',
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    OAnimation: 'oAnimationEnd',
                    msAnimation: 'MSAnimationEnd'
                }
            };

            var endEvents = [];

            function detectEvents() {
                var testEl = document.createElement('div');
                var style = testEl.style;

                if (!('AnimationEvent' in window)) {
                    delete EVENT_NAME_MAP.animationend.animation;
                }

                if (!('TransitionEvent' in window)) {
                    delete EVENT_NAME_MAP.transitionend.transition;
                }

                for (var baseEventName in EVENT_NAME_MAP) {
                    if (EVENT_NAME_MAP.hasOwnProperty(baseEventName)) {
                        var baseEvents = EVENT_NAME_MAP[baseEventName];
                        for (var styleName in baseEvents) {
                            if (styleName in style) {
                                endEvents.push(baseEvents[styleName]);
                                break;
                            }
                        }
                    }
                }
            }

            if (typeof window !== 'undefined' && typeof document !== 'undefined') {
                detectEvents();
            }

            function addEventListener(node, eventName, eventListener) {
                node.addEventListener(eventName, eventListener, false);
            }

            function removeEventListener(node, eventName, eventListener) {
                node.removeEventListener(eventName, eventListener, false);
            }

            var TransitionEvents = {
                addEndEventListener: function addEndEventListener(node, eventListener) {
                    if (endEvents.length === 0) {
                        window.setTimeout(eventListener, 0);
                        return;
                    }
                    endEvents.forEach(function (endEvent) {
                        addEventListener(node, endEvent, eventListener);
                    });
                },


                endEvents: endEvents,

                removeEndEventListener: function removeEndEventListener(node, eventListener) {
                    if (endEvents.length === 0) {
                        return;
                    }
                    endEvents.forEach(function (endEvent) {
                        removeEventListener(node, endEvent, eventListener);
                    });
                }
            };

            return TransitionEvents;

            })();

        var Css = (function() {

            'use strict';

            var SPACE = ' ';
            var RE_CLASS = /[\n\t\r]/g;

            function norm(elemClass) {
                return (SPACE + elemClass + SPACE).replace(RE_CLASS, SPACE);
            }

            return {
                addClass: function addClass(elem, className) {
                    elem.className += ' ' + className;
                },

                removeClass: function removeClass(elem, n) {
                    var elemClass = elem.className.trim();
                    var className = norm(elemClass);
                    var needle = n.trim();
                    needle = SPACE + needle + SPACE;
                    // 一个 cls 有可能多次出现：'link link2 link link3 link'
                    while (className.indexOf(needle) >= 0) {
                        className = className.replace(needle, SPACE);
                    }
                    elem.className = className.trim();
                }
            };

        })();

        var cssAnimation =(function(){

            'use strict';
            var isCssAnimationSupported = Event.endEvents.length !== 0;

            function getDuration(node, name) {
                var style = window.getComputedStyle(node);
                var prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];
                var ret = '';
                for (var i = 0; i < prefixes.length; i++) {
                    ret = style.getPropertyValue(prefixes[i] + name);
                    if (ret) {
                        break;
                    }
                }
                return ret;
            }

            function fixBrowserByTimeout(node) {
                if (isCssAnimationSupported) {
                    var transitionDuration = parseFloat(getDuration(node, 'transition-duration')) || 0;
                    var animationDuration = parseFloat(getDuration(node, 'animation-duration')) || 0;
                    var time = Math.max(transitionDuration, animationDuration);
                    // sometimes, browser bug
                    node.rcEndAnimTimeout = setTimeout(function () {
                        node.rcEndAnimTimeout = null;
                        if (node.rcEndListener) {
                            node.rcEndListener();
                        }
                    }, time * 1000 + 200);
                }
            }

            function clearBrowserBugTimeout(node) {
                if (node.rcEndAnimTimeout) {
                    clearTimeout(node.rcEndAnimTimeout);
                    node.rcEndAnimTimeout = null;
                }
            }

            var cssAnimation = function cssAnimation(node, transitionName, callback) {
                var className = transitionName;
                var activeClassName = className + '-active';

                if (node.rcEndListener) {
                    node.rcEndListener();
                }

                node.rcEndListener = function (e) {
                    if (e && e.target !== node) {
                        return;
                    }

                    if (node.rcAnimTimeout) {
                        clearTimeout(node.rcAnimTimeout);
                        node.rcAnimTimeout = null;
                    }

                    clearBrowserBugTimeout(node);

                    Css.removeClass(node, className);
                    Css.removeClass(node, activeClassName);

                    Event.removeEndEventListener(node, node.rcEndListener);
                    node.rcEndListener = null;

                    // Usually this optional callback is used for informing an owner of
                    // a leave animation and telling it to remove the child.
                    if (callback) {
                        callback();
                    }
                };

                Event.addEndEventListener(node, node.rcEndListener);

                Css.addClass(node, className);

                node.rcAnimTimeout = setTimeout(function () {
                    node.rcAnimTimeout = null;
                    Css.addClass(node, activeClassName);
                    fixBrowserByTimeout(node);
                }, 0);

                return {
                    stop: function stop() {
                        if (node.rcEndListener) {
                            node.rcEndListener();
                        }
                    }
                };
            };

            cssAnimation.style = function (node, style, callback) {
                if (node.rcEndListener) {
                    node.rcEndListener();
                }

                node.rcEndListener = function (e) {
                    if (e && e.target !== node) {
                        return;
                    }

                    if (node.rcAnimTimeout) {
                        clearTimeout(node.rcAnimTimeout);
                        node.rcAnimTimeout = null;
                    }

                    clearBrowserBugTimeout(node);

                    Event.removeEndEventListener(node, node.rcEndListener);
                    node.rcEndListener = null;

                    // Usually this optional callback is used for informing an owner of
                    // a leave animation and telling it to remove the child.
                    if (callback) {
                        callback();
                    }
                };

                Event.addEndEventListener(node, node.rcEndListener);

                node.rcAnimTimeout = setTimeout(function () {
                    for (var s in style) {
                        if (style.hasOwnProperty(s)) {
                            node.style[s] = style[s];
                        }
                    }
                    node.rcAnimTimeout = null;
                    fixBrowserByTimeout(node);
                }, 0);
            };

            cssAnimation.setTransition = function (node, p, value) {
                var property = p;
                var v = value;
                if (value === undefined) {
                    v = property;
                    property = '';
                }
                property = property || '';
                ['Webkit', 'Moz', 'O',
                 // ms is special .... !
                 'ms'].forEach(function (prefix) {
                    node.style[prefix + 'Transition' + property] = v;
                });
            };

            cssAnimation.addClass = Css.addClass;
            cssAnimation.removeClass = Css.removeClass;
            cssAnimation.isCssAnimationSupported = isCssAnimationSupported;

            return cssAnimation;
        })();

        return cssAnimation;
    })();
    //--------
    //--------
    //--------

    function getLoginIDLabel(){
        var nodes = document.querySelectorAll(".member-info-card .member-card-label");
        if(nodes && nodes.length) {
            return Array.prototype.slice.call(nodes).filter(function (el) {
                return el.textContent === "LoginID " && !el.hasAttribute('p-cp');
            });
        }
    }

    function appendAll(){
        var all = getLoginIDLabel();
        if(all && all.length){
            for(var i=0;i<all.length;i++) {
                var x = all[i];
                appendOne(x);
            }
        }
    }

    function appendOne(loginIDLabel){
        if(loginIDLabel){
            //get id and node
            var idNode = loginIDLabel.nextSibling;
            idNode.style.width = '40%';
            var id = idNode.childNodes[0].textContent;
            //console.log(id);
            var addBtn = function(text, clickFn, icon){
                var btn = document.createElement("button");
                var iconHtml = icon ? '<svg class="icon-svg"><use xlink:href="#'+icon+'"></use></svg>' : '';
                btn.innerHTML = iconHtml + '<span>'+text+'</span>';
                btn.className="ant-btn ant-tooltip-open";
                btn.style="margin-left: 2px;padding: 2px;"+(text==='绿通'?'background-color: #47b433;border-color: #47b433;color:#fff;':'');
                btn.setAttribute('type','button');
                btn.addEventListener('click',clickFn);
                loginIDLabel.parentNode.appendChild(btn);
            }
            //add green btn
            addBtn('绿通',function(){greenChannel(id);});
            //add copy btn
            addBtn('复制',function(){copy(id);showMsg('复制成功');},'icon-file');
            loginIDLabel.setAttribute('p-cp',1);
        }
    }

    function showMsg(text){
        var antMsgContainer = document.querySelector('.ant-message');
        antMsgContainer.innerHTML = '<span><div class="ant-message-notice"><div class="ant-message-notice-content"><div class="ant-message-custom-content ant-message-success"><i class="anticon anticon-check-circle"></i><span>'+text+'</span></div></div></div></span>';
        var animationNode = antMsgContainer.querySelector('.ant-message-notice');
        cssAnimation(animationNode,'move-up-enter',function(){});
        setTimeout(function(){
            cssAnimation(animationNode,'move-up-leave',function(){
                antMsgContainer.innerHTML = '';
            });
        },1500);
    }

    function greenChannel(id){
        window.open("http://member-bops.b2b.alibaba-inc.com/member/green_channel.htm?_input_charset=UTF-8&loginId="+encodeURIComponent(id));
    }

    function copy(input){
        var el = document.createElement('textarea');

        el.value = input;

        // Prevent keyboard from showing on mobile
        el.setAttribute('readonly', '');

        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        var selection = document.getSelection();
        var originalRange = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }

        document.body.appendChild(el);
        el.select();

        // Explicit selection workaround for iOS
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) {}

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        return success;
    }

    setInterval(function(){
        appendAll();
    },1000);
})();
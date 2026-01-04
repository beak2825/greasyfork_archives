// ==UserScript==
// @name           Medium Unlocker (2023-12-06 updated)
// @name:zh-CN     Medium解锁 (2023-12-06更新）
// @namespace      https://github.com/blacksev
// @version        1.1.3
// @description:zh-CN    自动检测Medium文章（包括子域名和自定义域名），替换URL为readmedium.com来解锁Medium付费文章
// @description Automatically detect Medium articles (including subdomains and custom domains) and replace the URL with readmedium.com to unlock Medium Posts.
// @author         blacksev
// @match          *://*/*
// @grant          none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/489713/Medium%20Unlocker%20%282023-12-06%20updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489713/Medium%20Unlocker%20%282023-12-06%20updated%29.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
    if (!document.scripts.length) {
        return;
    }
    if (document.body.outerHTML.lastIndexOf("cdn-client.medium.com") < 0) {
        return;
    }
    const key = encodeURIComponent('blacksev:Medium Unlock:Start');
    if (window[key]) {
        return;
    }
    window[key] = true;
 
    console.log("Here is Medium!!!!");
 
    const DragButton = function () {
    };
    DragButton.prototype = {
        //window对象
        win: window,
        //拖拽dom
        ele: null,
        //默认配置
        options: {
            edge: true, //是否吸附边缘，默认吸附
            extRoute: null,//标签Ext的路由，进行跳转的
            elemId: 'medium-unlock-button',//组件要加载的节点位置ID，默认加在body下
            instance: 'readmedium.com'
        },
        //系统变量集
        data: {
            distanceX: 0,
            distanceY: 0
        },
 
        /**
         * @method 初始化
         * @param opts 由@method config() 提供的配置参数
         */
        init: function (opts) {
            const _this = this;
            const option = _this.config(opts, _this.options);//用户配置
            const _elem = document.getElementById(option.elemId) ? document.getElementById(option.elemId) : document.body;
            if (!_elem) {
                console.log("not find nodeId!!");
                return;
            }
            //初始拖拽按钮，加载到_elem内
            _this.initEle(_elem);
            //注册点击事件
            _this.ele.addEventListener('click', function () {
                _this.click();
            });
            //注册拖拽开始事件
            _this.ele.addEventListener('touchstart', function (event) {
                _this.touchstart(event);
            });
            //注册拖拽移动事件
            document.addEventListener(
                'touchmove',
                function (event) {
                    _this.touchmove(event);
                }, {// fix #3 #5
                    passive: false
                });
            //注册拖拽完成事件
            document.addEventListener('touchend', function () {
                _this.touchend();
            });
        },
        /**
         * @method 配置
         * @param opts { object } 用户提供的参数，在没有提供参数的情况下使用默认参数
         * @param options { object } 默认参数
         * @return options { object } 返回一个配置对象
         */
        config: function (opts, options) {
            //默认参数
            if (!opts) {
                return options;
            }
            for (const key in opts) {
                if (!!opts[key]) {
                    options[key] = opts[key];
                }
            }
            return options;
        },
 
        /**
         * @method 初始拖拽按钮，加载到_elem内
         * @param _elem { object } 指定挂载的节点
         * @return options { object } 返回一个拖拽按钮
         */
        initEle: function (_elem) {
            const _this = this;
            //创建一个div
            const ele = document.createElement('div');
            //通过createElementNS创建svg元素并设置属性
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
            svg.setAttribute("class", "unlock-svg");
            svg.setAttribute("style", "width:100%;height:100%;vertical-align:unset;transition: color .1s;");
            svg.setAttribute("viewBox", "0 0 32 32");
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute("d", "M24 14H12V8a4 4 0 0 1 8 0h2a6 6 0 0 0-12 0v6H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V16a2 2 0 0 0-2-2zm0 14H8V16h16z");
            path.setAttribute("fill", "currentColor");
 
            svg.appendChild(path);
 
            //SVG元素添加到页面内显示
            ele.appendChild(svg);
 
            ele.id = "drag_button_id";
            ele.className = "drag-button-div";
 
            //样式
            ele.style.position = "fixed";
            ele.style.lineHeight = "4rem";
            ele.style.width = "4rem";
            ele.style.height = "4rem";
            ele.style.padding = "0.5rem";
            ele.style.textAlign = "center";
            ele.style.border = "5px solid #27ae60";
            ele.style.borderRadius = "99px";
            ele.style.color = "#fff";
            ele.style.opacity = "0.5";
            ele.style.backgroundColor = "#2ecc71";
            ele.style.backgroundClip = "padding-box";
            ele.style.textDecoration = "none";
            ele.style.top = "13em";
            ele.style.right = "0px";
            ele.style.zIndex = "1";
            ele.style.transition = "box-shadow .2s";
 
            //js控制css的黑魔法
            const head = document.getElementsByTagName('head')[0];
            const style = document.createElement('style');
            const declarations = document.createTextNode('.drag-button-div:hover{ box-shadow: 0px 0 0 11px #FFF,  0px 0 0 10px #27ae60, 0px 0 0 50px #FFF inset;}.drag-button-div:active{ box-shadow: 0px 0 0 11px #27ae60,  0px 0 0 10px #27ae60, 0px 0 0 50px #FFF inset;}.drag-button-div:hover .unlock-svg{color:blue;}');
            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = declarations.nodeValue;
            } else {
                style.appendChild(declarations);
            }
            head.appendChild(style);
 
            //动态插入到body中
            _elem.insertBefore(ele, _elem.lastChild);
            //赋值到全局变量
            _this.ele = ele;
            //初始化位置
            let strStoreDistance = '';
            // 居然有android机子不支持localStorage
            if (_this.ele.id && _this.win.localStorage && (strStoreDistance = localStorage['Inertia_' + _this.ele.id])) {
                const arrStoreDistance = strStoreDistance.split(',');
                _this.ele.distanceX = +arrStoreDistance[0];
                _this.ele.distanceY = +arrStoreDistance[1];
                _this.ele = _this.fnTranslate(_this.ele, _this.ele.distanceX, _this.ele.distanceY);
            }
            // 显示拖拽元素
            _this.ele.style.visibility = 'visible';
            // 如果元素在屏幕之外，位置使用初始值
            const initBound = _this.ele.getBoundingClientRect();
            if (initBound.left < -0.5 * initBound.width ||
                initBound.top < -0.5 * initBound.height ||
                initBound.right > _this.win.innerWidth + 0.5 * initBound.width ||
                initBound.bottom > _this.win.innerHeight + 0.5 * initBound.height
            ) {
                _this.ele.distanceX = 0;
                _this.ele.distanceY = 0;
                _this.ele = _this.fnTranslate(_this.ele, 0, 0);
            }
        },
        /**
         * easeOutBounce算法
         * t: current time（当前时间）；
         * b: beginning value（初始值）；
         * c: change in value（变化量）；
         * d: duration（持续时间）。
         */
        easeOutBounce: function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            } else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            } else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            } else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
 
        // 设置transform坐标等方法
        fnTranslate: function (_ele, x, y) {
            x = Math.round(1000 * x) / 1000;
            y = Math.round(1000 * y) / 1000;
 
            _ele.style.webkitTransform = 'translate(' + [x + 'px', y + 'px'].join(',') + ')';
            _ele.style.transform = 'translate3d(' + [x + 'px', y + 'px', 0].join(',') + ')';
 
            return _ele
        },
 
        /**
         * 拖拽按钮开始事件
         */
        touchstart: function (event) {
            const _this = this;
            const events = event.touches[0] || event;
 
            _this.data.posX = events.pageX;
            _this.data.posY = events.pageY;
 
            _this.data.touching = true;
 
            if (_this.ele.distanceX) {
                _this.data.distanceX = _this.ele.distanceX;
            }
            if (_this.ele.distanceY) {
                _this.data.distanceY = _this.ele.distanceY;
            }
 
            // 元素的位置数据
            _this.data.bound = _this.ele.getBoundingClientRect();
 
            _this.data.timerready = true;
        },
 
        /**
         * 拖拽按钮移动事件
         */
        touchmove: function (event) {
            const _this = this;
            if (_this.data.touching !== true) {
                return;
            }
 
            // 当移动开始的时候开始记录时间
            if (_this.data.timerready === true) {
                _this.data.timerstart = +new Date();
                _this.data.timerready = false;
            }
 
            event.preventDefault();
 
            const events = event.touches[0] || event;
 
            _this.data.nowX = events.pageX;
            _this.data.nowY = events.pageY;
 
            let distanceX = _this.data.nowX - _this.data.posX,
                distanceY = _this.data.nowY - _this.data.posY;
 
            // 此时元素的位置
            const absLeft = distanceX + _this.data.bound.left,
                absTop = distanceY + _this.data.bound.top,
                absRight = absLeft + _this.data.bound.width,
                absBottom = absTop + _this.data.bound.height;
 
            // 边缘检测
            if (absLeft < 0) {
                distanceX = distanceX - absLeft;
            }
            if (absTop < 0) {
                distanceY = distanceY - absTop;
            }
            if (absRight > _this.win.innerWidth) {
                distanceX = distanceX - (absRight - _this.win.innerWidth);
            }
            if (absBottom > _this.win.innerHeight) {
                distanceY = distanceY - (absBottom - _this.win.innerHeight);
            }
 
            // 元素位置跟随
            const x = _this.data.distanceX + distanceX,
                y = _this.data.distanceY + distanceY;
            _this.ele = _this.fnTranslate(_this.ele, x, y);
 
            // 缓存移动位置
            _this.ele.distanceX = x;
            _this.ele.distanceY = y;
        },
 
        /**
         * 拖拽按钮移动完成事件
         */
        touchend: function () {
            const edge = function () {
                // 时间
                let start = 0, during = 25;
                // 初始值和变化量
                let init = _this.ele.distanceX, y = _this.ele.distanceY, change = 0;
                // 判断元素现在在哪个半区
                const bound = _this.ele.getBoundingClientRect();
                if (bound.left + bound.width / 2 < _this.win.innerWidth / 2) {
                    change = -1 * bound.left;
                } else {
                    change = _this.win.innerWidth - bound.right;
                }
 
                const run = function () {
                    // 如果用户触摸元素，停止继续动画
                    if (_this.data.touching === true) {
                        _this.data.inertiaing = false;
                        return;
                    }
 
                    start++;
                    const x = _this.easeOutBounce(start, init, change, during);
                    _this.ele = _this.fnTranslate(_this.ele, x, y);
 
                    if (start < during) {
                        requestAnimationFrame(run);
                    } else {
                        _this.ele.distanceX = x;
                        _this.ele.distanceY = y;
                        _this.data.inertiaing = false;
                        if (_this.win.localStorage) {
                            localStorage['Inertia_' + _this.ele.id] = [x, y].join();
                        }
                    }
                };
                run();
            };
            const _this = this;
            if (_this.data.touching === false) {
                // fix iOS fixed bug
                return;
            }
            _this.data.touching = false;
 
            // 计算速度
            _this.data.timerend = +new Date();
 
            if (!_this.data.nowX || !_this.data.nowY) {
                return;
            }
 
            // 移动的水平和垂直距离
            const distanceX = _this.data.nowX - _this.data.posX,
                distanceY = _this.data.nowY - _this.data.posY;
 
            if (Math.abs(distanceX) < 5 && Math.abs(distanceY) < 5) {
                return;
            }
 
            // 距离和时间
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY),
                time = _this.data.timerend - _this.data.timerstart;
 
            // 速度，每一个自然刷新此时移动的距离
            let speed = distance / time * 16.666;
 
            // 经测试，2~60多px不等
            // 设置衰减速率
            // 数值越小，衰减越快
            const rate = Math.min(10, speed);
 
            // 开始惯性缓动
            _this.data.inertiaing = true;
 
            // 反弹的参数
            let reverseX = 1, reverseY = 1;
 
            // 速度计算法
            const step = function () {
                if (_this.data.touching === true) {
                    _this.data.inertiaing = false;
                    return;
                }
                speed = speed - speed / rate;
 
                // 根据运动角度，分配给x, y方向
                let moveX = reverseX * speed * distanceX / distance, moveY = reverseY * speed * distanceY / distance;
 
                // 此时元素的各个数值
                const bound = _this.ele.getBoundingClientRect();
 
                if (moveX < 0 && bound.left + moveX < 0) {
                    moveX = 0 - bound.left;
                    // 碰触边缘方向反转
                    reverseX = reverseX * -1;
                } else if (moveX > 0 && bound.right + moveX > _this.win.innerWidth) {
                    moveX = _this.win.innerWidth - bound.right;
                    reverseX = reverseX * -1;
                }
 
                if (moveY < 0 && bound.top + moveY < 0) {
                    moveY = -1 * bound.top;
                    reverseY = -1 * reverseY;
                } else if (moveY > 0 && bound.bottom + moveY > _this.win.innerHeight) {
                    moveY = _this.win.innerHeight - bound.bottom;
                    reverseY = -1 * reverseY;
                }
 
                const x = _this.ele.distanceX + moveX, y = _this.ele.distanceY + moveY;
                // 位置变化
                _this.ele = _this.fnTranslate(_this.ele, x, y);
 
                _this.ele.distanceX = x;
                _this.ele.distanceY = y;
 
                if (speed < 0.1) {
                    speed = 0;
                    if (_this.options.edge === false) {
                        _this.data.inertiaing = false;
 
                        if (_this.win.localStorage) {
                            localStorage['Inertia_' + _this.ele.id] = [x, y].join();
                        }
                    } else {
                        // 边缘吸附
                        edge();
                    }
                } else {
                    requestAnimationFrame(step);
                }
            };
            step();
        },
        /**
         * 拖拽按钮点击事件
         */
        click: function () {
            const _this = this;
            window.location.hostname = _this.options.instance;
        }
    };
    new DragButton().init();
}());
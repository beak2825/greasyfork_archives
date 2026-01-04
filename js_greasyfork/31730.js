// ==UserScript==
// @name         BFC Cost Calculator
// @namespace    https://osu.ppy.sh/users/6230892
// @version      3.2.0
// @description  基于pp+的osu炸翔杯cost计算器
// @author       muto
// @match        *://syrin.me/pp+/u/*
// @match        *://osu.ppy.sh/u/*
// @match        *://osu.ppy.sh/users/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.5/require.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      syrin.me
// @downloadURL https://update.greasyfork.org/scripts/31730/BFC%20Cost%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/31730/BFC%20Cost%20Calculator.meta.js
// ==/UserScript==

unsafeWindow.module = {};
unsafeWindow.require = require;
unsafeWindow.define = define;

require.config({
    baseUrl: "https://gitcdn.xyz/repo",

    paths: {
        text: "requirejs/text/master/text",

        "glob-to-regexp": "fitzgen/glob-to-regexp/0.4.0/index",
        mathjs: "josdejong/mathjs/v4.4.2/dist/math.min"
    },

    config: {
        text: {
            // use xhr
            useXhr: _ => true
        }
    }
});

define("node", {
    load: function (name, req, onload, config) {
        let url = req.toUrl(name + ".js");
        req([`text!${url}`], function (text) {
            onload.fromText(`define((require, exports, module) => {${text}});`);
        });
    }
});

require(["node!glob-to-regexp", "mathjs"], function (globToRegExp, math) {

    'use strict';

    String.prototype.glob = function (callback) {
        return globToRegExp(this).test(window.location.href)
            ? async(callback)
        : _Promise.reject(`glob ${this} not matched`);
    };

    String.prototype.toInt = function () {
        return parseInt(this.replace(/,/g, ""));
    };

    // 数字（货币）千分位，例如 12,345.67
    String.prototype.toThousands = function () {
        return this.replace(/\B(?=(?:\d{3})+\b)/g, ",");
    };

    /*
     * thisArg[,argsArray] Object,Array
     * 和 bind 方法一样，用于支持参数与 apply 相同的操作
     */
    Function.prototype.proxy = function (thisArg, argsArray) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.proxy - what is trying to be bound is not callable");
        }

        let aArgs = Array.prototype.slice.call(argsArray || []),
            fToBind = this,
            fNOP = function () {
                // e.g: new Function();
            },
            fBound = function () {
                // A bound function may also be constructed using the new operator:
                // doing so acts as though the target function had instead been constructed.
                // The provided this value is ignored, while prepended arguments are
                // provided to the emulated function.
                return fToBind.apply(this instanceof fNOP
                                     ? this
                                     : thisArg,
                                     // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                                     aArgs.concat(Array.prototype.slice.call(arguments))
                                    );
            };

        // 维护原型关系
        if (this.prototype) {
            // Function.prototype doesn't have a prototype property
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };

    Promise.deferred = function () {
        let d = {},
            p = new Promise((resolve, reject) => {
                d.resolve = resolve;
                d.reject = reject;
            });
        d.promise = p;
        // 在函数内部，this的值取决于函数被调用的方式。
        d.then = p.then.bind(p);
        d.catch = p.catch.bind(p);
        return d;
    };

    function async(callback, delay) {
        let p = new _Promise(),
            f = function () {
                try {
                    p.resolve(callback());
                } catch (e) {
                    p.reject(e);
                }
            };
        setTimeout(f, delay);// 模拟异步操作
        return p;
    }

    $.extend({
        getUrlParam: function (key) {
            let reg = new RegExp(`(^|&)${key}=([^&]*)(&|$)`),
                map = window.location.search.substr(1).match(reg);
            return map && decodeURI(map[2]);
        },

        /*
         * 从数组中移除指定的元素
         * --------------------------------------
         * array,index[,count] Array,Number,Number
         * index 需要移除的元素下标
         * --------------------------------------
         * array,callback[,thisArg] Array,Function,Object
         * array.findIndex(callback, thisArg);
         * --------------------------------------
         * array,searchElement[,fromIndex] Array,Object,Number
         * array.indexOf(searchElement, fromIndex);
         */
        remove: function (array, index, count) {
            if (!$.isNumeric(index)) {
                index = $.isFunction(index)
                    ? array.findIndex(index, count)
                : array.indexOf(index, count);
            }
            count = $.isNumeric(count) ? count : 1;// count || 1 不支持 count = 0
            return array.splice(index, index > -1 ? count : 0);
        },

        // 数组去重，不会改变原数组中的内容
        unique: function (src) {
            let cnt = {}, des = [];
            for (let i = 0, j = 0; i < src.length; i++) {
                if (cnt[src[i]]) {
                    continue;// 跳过重复
                }
                cnt[src[i]] = true;
                des[j++] = src[i];
            }
            return des;
        },

        pass: function () {
            return arguments[0];
        },

        through: function () {
            throw arguments[0];
        },

        /*
         * min,max[,rc] Number,Number,Boolean
         * rc 可选，为true时，范围在[min,max]
         *
         * 返回一个浮点，伪随机数在范围[min,max)，也就是说，从min（包括min）往上，但是不包括max（排除max）
         * Using Math.round() will give you a non-uniform distribution!
         */
        random: function (min, max, rc) {
            return Math.random() * (max - min + (rc ? 1 : 0)) + min;
        },

        randomInt: function () {
            return Math.floor($.random.apply(this, arguments));
        },

        /*
         * array Array
         * 随机获取数组中的元素
         */
        randomArray: function (array) {
            return array[$.randomInt(0, array.length)];
        },

        http: function (details) {
            let onload = details.onload || $.noop,
                d = Promise.deferred();

            // 绑定处理事件
            details.onload = function (data) {
                onload(data);// super();

                // 200: "OK"
                // 4: 请求已完成，且响应已就绪
                if (data.status === 200 && data.readyState === 4) {
                    d.resolve(data.responseText);
                } else {
                    // eg: Url 404 Not Found
                    d.reject(`${data.finalUrl} ${data.status} ${data.statusText}`);
                }
            };

            GM_xmlhttpRequest(details);
            return d.promise;
        }
    });

    // 通用缓存
    function Buffer() {
        let t = this,// 对象本身用于存放数据
            f = function (key, val) {
                // getter
                if (arguments.length === 1) {
                    return t[key];
                }
                // setter
                if (arguments.length === 2) {
                    t[key] = val;
                    return;
                }
                return t;
            },
            fn = {
                // 观察者模式
                topic: function (id, flags) {
                    let c, m = t[id];
                    if (!m) {
                        c = $.Callbacks(flags);
                        // 引用的函数中只有 return this 用于链式调用
                        m = {
                            publish: c.fire,
                            subscribe: c.add,
                            unsubscribe: c.remove
                        };
                        t[id] = m;
                    }
                    return m;
                }
            };

        return $.extend(f, fn);
    }

    // Promises/A+
    // see also: https://promisesaplus.com
    function _Promise(executor) {
        let b = new Buffer(),
            f = function (status, data) {
                // 2.1
                if (this.status === "pending") {
                    this.status = status;
                    this.data = data;
                    b.topic(status).publish(data);// 2.2.6

                    // 遇到 rejected 就将问题打印到控制台
                    status === 'rejected' && console.warn(data);
                }
            };

        this.status = "pending";
        this.resolve = f.bind(this, "fulfilled");
        this.reject = f.bind(this, "rejected");
        this.callback = b();
        this.callback.add = function (status, c) {
            b.topic(status, "once memory").subscribe(c);
        };

        try {
            // deferred
            if ($.isFunction(executor)) {
                executor(this.resolve, this.reject);
            }
        } catch (e) {
            this.reject(e);
        }
    }

    _Promise.resolve = function (value) {
        return new _Promise(r => r(value));
    };

    _Promise.reject = function (reason) {
        return new _Promise((ignore, r) => r(reason));
    };

    _Promise.prototype.then = function (onFulfilled, onRejected) {
        onFulfilled = $.isFunction(onFulfilled) ? onFulfilled : $.pass;// 2.2.7.3
        onRejected = $.isFunction(onRejected) ? onRejected : $.through;// 2.2.7.4

        let promise2 = new _Promise(),
            executor = function (c, data) {
                // 2.2.4
                setTimeout(_ => {
                    try {
                        let x = c(data || this.data);// 2.2.5
                        resolve(promise2, x);// 2.2.7.1
                    } catch (e) {
                        promise2.reject(e);// 2.2.7.2
                    }
                });
            };

        if (this.status === "fulfilled") {
            executor.call(this, onFulfilled);
        } else if (this.status === "rejected") {
            executor.call(this, onRejected);
        } else if (this.status === "pending") {
            this.callback.add("fulfilled", executor.bind(this, onFulfilled));
            this.callback.add("rejected", executor.bind(this, onRejected));
        }
        return promise2;
    };

    _Promise.prototype.catch = function (onRejected) {
        return this.then(null, onRejected);
    };

    function resolve(promise, x) {
        // 2.3.1
        if (promise === x) {
            throw new TypeError("Chaining cycle detected for promise!");
        }

        // 2.3.2
        if (x instanceof _Promise) {
            x.then(promise.resolve, promise.reject);
            return;
        }

        if ($.isPlainObject(x) || $.isFunction(x)) {
            let then, isThenCalled = false;

            // 2.3.3
            try {
                then = x.then;// 2.3.3.1
                if ($.isFunction(then)) {
                    // 2.3.3.3
                    then.call(x, y => {
                        if (isThenCalled) {
                            return;// 2.3.3.3.3
                        }
                        isThenCalled = true;

                        resolve(promise, y);// 2.3.3.3.1
                    }, r => {
                        if (isThenCalled) {
                            return;
                        }
                        isThenCalled = true;

                        promise.reject(r);// 2.3.3.3.2
                    });
                } else {
                    promise.resolve(x);// 2.3.3.4
                }
            } catch (e) {
                if (isThenCalled) {
                    return;// 2.3.3.3.4.1
                }

                promise.reject(e);// 2.3.3.2
            }

        } else {
            promise.resolve(x);// 2.3.4
        }
    }

    // Algorithm
    //---------------------------------------------------------------------------------------------

    function Cost(p) {
        this.jump = math.pow(p.Jump / 1200 - 0.5, 0.8);
        this.flow = Math.pow(1 + p.Flow / 3000, 0.8);
        this.precision = Math.pow(1 + p.Precision / 3000, 0.8);
        this.aim = this.jump * this.flow * this.precision;
        this.spd = ((p.Speed + p.Stamina) / 1500 - 0.5) * 0.8;
        this.acc = Math.pow(1 + p.Accuracy / 5000, 0.8) / 1.4;
        this.total = (this.aim + this.spd) * this.acc;
    }

    Cost.prototype.toFixed = function () {
        return this.total < 0 ? 0 : this.total.toFixed(2);
    };

    $.fn.extend({
        cost: function () {
            let pp = {};
            // 构造数据
            $(".performance-table tbody tr", this).each(function () {
                let child = $(this).children(),
                    name = child.first().text().slice(0, -1);

                if (name.includes("Aim")) {
                    name = name.match("\\((.+?)\\)")[1];// 获取括号内的文本
                }
                pp[name] = child.last().text().toInt();
            });
            return new Cost(pp).toFixed();// deploy algorithm
        }
    });

    // match
    //---------------------------------------------------------------------------------------------

    "*/pp+/u/*".glob(_ => {
        $(".performance-table tbody").append(
            $(".performance-table .perform-acc").clone().attr("class", "perform-cost")
        );
        $(".perform-cost td:first")
            .text("Cost v2:")
            .next()
            .text(
            $(document).cost() + " 円/次"
        );
    });

    "*://osu.ppy.sh/u/*".glob(_ => {
        $.http({
            method: "GET",
            url: `https://syrin.me/pp+/u/${userId}`
        }).then(data => {
            $(".profile-username").after("Cost v2: " + $(data).cost());
        });

        // 彩蛋 (๑•̀ㅂ•́)و✧
        // ================================================================
        // 71014486   〖osu!播放器〗音游电子狂欢•精整更新曲库
        // 616677063  『东方』幻想写景，来首纯音乐吧♡
        // 884190460   日推Collection
        let id = $.randomArray([71014486, 616677063, 884190460]);
        $(".footer_columns").append("<iframe id='player'></iframe>");
        $("#player").attr({
            frameborder: "no",
            border: "0",
            marginwidth: "0",
            marginheight: "0",
            width: 330,
            height: 450,

            // type 播放器类型 0.歌单 2.单曲
            // auto 自动播放 1.true 0.false
            src: `//music.163.com/outchain/player?type=0&id=${id}&auto=0&height=430`
        });
    });

    "*://osu.ppy.sh/users/*".glob(_ => {
        let userId = location.pathname.split("/");
        $.http({
            method: "GET",
            url: `https://syrin.me/pp+/u/${userId[2]}`
        }).then(data => {
            $(".profile-header-extra__rank-box:last").append(` ${$(data).cost()}cost`);
        });
    });

});

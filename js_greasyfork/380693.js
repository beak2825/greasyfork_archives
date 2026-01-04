// ==UserScript==
// @name         xuexi_fast
// @namespace    day_day_up
// @version      1.7.0
// @description  好好学习 快速积分
// @author       9day
// @match        *://*.xuexi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380693/xuexi_fast.user.js
// @updateURL https://update.greasyfork.org/scripts/380693/xuexi_fast.meta.js
// ==/UserScript==
//20190318 0:35将xuexi网站的js以字符串完全无误的以阻塞方式注入，可以实现换行，在本脚本中显示出来，增加可读性
//学习牛人后，进行了适当改进，增加了停留在xuexi.cn的时间和提示，本注入代码的可读性更强，对核心部分进行了备注，且后期修改十分方便
//本操作仅用于探索前端趣味编程的朋友
//0.4版本美化了停留提示界面，同时当在xuexi网站上停留时间超过1分钟强制回到用户积分页面
//0.5修正了xuexi网站一个页面内嵌多个body导致注入多次的bug（感谢Demcorazy）,修正了积分页面还未注入成功时就开始计时显示的bug，增加了注入等候时间的提示
//0.6用户可以直接修改speed_num数字来调整速度，只要能被300整除即可，速度太快会被检测出来，建议设置为10
(function () {

    const speed_num = 60; //如学习倍速为10，即5分钟300秒只是本地30s，系统记录学习时间为5分钟。强国原始是1000毫秒执行一次，现在相当于200毫秒相当于0.2秒就执行一次
    if (!document.getElementById('myblockedflag') && !!window.Aliplayer) {
        var ele = document.createElement('div');
        ele.id = "myblockedflag";
        document.body.appendChild(ele);
        var script = document.createElement('script');


        //下列加载的脚本字符串myblockedfun.timer=setInterval(myblockedfun,1e3/times);//核心：强国原始是this.timer = setInterval(function(){},1e3);这里直接除去times，是注入js文头定义的初始变量
        var command = `
    var times = ` + speed_num + `;
    var myblockedfun = null;

    ;!function() {
    "use strict";
    var e = window.layui && layui.define
      , t = {
        getPath: function() {
            var e = document.currentScript ? document.currentScript.src : function() {
                for (var e, t = document.scripts, n = t.length - 1, a = n; a > 0; a--)
                    if ("interactive" === t[a].readyState) {
                        e = t[a].src;
                        break
                    }
                return e || t[n].src
            }();
            return e.substring(0, e.lastIndexOf("/") + 1)
        }(),
        getStyle: function(e, t) {
            var n = e.currentStyle ? e.currentStyle : window.getComputedStyle(e, null);
            return n[n.getPropertyValue ? "getPropertyValue" : "getAttribute"](t)
        },
        link: function(e, a, i) {
            if (n.path) {
                var r = document.getElementsByTagName("head")[0]
                  , o = document.createElement("link");
                "string" == typeof a && (i = a);
                var s = (i || e).replace(/\\.|\\\/\/g, "")
                  , l = "layuicss-" + s
                  , d = 0;
                o.rel = "stylesheet",
                o.href = n.path + e,
                o.id = l,
                document.getElementById(l) || r.appendChild(o),
                "function" == typeof a && !function c() {
                    return ++d > 80 ? window.console && console.error("laydate.css: Invalid") : void (1989 === parseInt(t.getStyle(document.getElementById(l), "width")) ? a() : setTimeout(c, 100))
                }()
            }
        }
    }
      , n = {
        v: "5.0.9",
        config: {},
        index: window.laydate && window.laydate.v ? 1e5 : 0,
        path: t.getPath,
        set: function(e) {
            var t = this;
            return t.config = w.extend({}, t.config, e),
            t
        },
        ready: function(a) {
            var i = "laydate"
              , r = ""
              , o = (e ? "modules/laydate/" : "theme/") + "default/laydate.css?v=" + n.v + r;
            return e ? layui.addcss(o, a, i) : t.link(o, a, i),
            this
        }
    }
      , a = function() {
        var e = this;
        return {
            hint: function(t) {
                e.hint.call(e, t)
            },
            config: e.config
        }
    }
      , i = "laydate"
      , r = ".layui-laydate"
      , o = "layui-this"
      , s = "laydate-disabled"
      , l = "开始日期超出了结束日期<br>建议重新选择"
      , d = [100, 2e5]
      , c = "layui-laydate-static"
      , m = "layui-laydate-list"
      , u = "laydate-selected"
      , h = "layui-laydate-hint"
      , y = "laydate-day-prev"
      , f = "laydate-day-next"
      , p = "layui-laydate-footer"
      , g = ".laydate-btns-confirm"
      , v = "laydate-time-text"
      , D = ".laydate-btns-time"
      , T = function(e) {
        var t = this;
        t.index = ++n.index,
        t.config = w.extend({}, t.config, n.config, e),
        n.ready(function() {
            t.init()
        })
    }
      , w = function(e) {
        return new C(e)
    }
      , C = function(e) {
        for (var t = 0, n = "object" == typeof e ? [e] : (this.selector = e,
        document.querySelectorAll(e || null)); t < n.length; t++)
            this.push(n[t])
    };
    C.prototype = [],
    C.prototype.constructor = C,
    w.extend = function() {
        var e = 1
          , t = arguments
          , n = function(e, t) {
            e = e || (t.constructor === Array ? [] : {});
            for (var a in t)
                e[a] = t[a] && t[a].constructor === Object ? n(e[a], t[a]) : t[a];
            return e
        };
        for (t[0] = "object" == typeof t[0] ? t[0] : {}; e < t.length; e++)
            "object" == typeof t[e] && n(t[0], t[e]);
        return t[0]
    }
    ,
    w.ie = function() {
        var e = navigator.userAgent.toLowerCase();
        return !!(window.ActiveXObject || "ActiveXObject"in window) && ((e.match(/msie\\s(\\d+)/) || [])[1] || "11")
    }(),
    w.stope = function(e) {
        e = e || window.event,
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
    }
    ,
    w.each = function(e, t) {
        var n, a = this;
        if ("function" != typeof t)
            return a;
        if (e = e || [],
        e.constructor === Object) {
            for (n in e)
                if (t.call(e[n], n, e[n]))
                    break
        } else
            for (n = 0; n < e.length && !t.call(e[n], n, e[n]); n++)
                ;
        return a
    }
    ,
    w.digit = function(e, t, n) {
        var a = "";
        e = String(e),
        t = t || 2;
        for (var i = e.length; i < t; i++)
            a += "0";
        return e < Math.pow(10, t) ? a + (0 | e) : e
    }
    ,
    w.elem = function(e, t) {
        var n = document.createElement(e);
        return w.each(t || {}, function(e, t) {
            n.setAttribute(e, t)
        }),
        n
    }
    ,
    C.addStr = function(e, t) {
        return e = e.replace(/\\s+/, " "),
        t = t.replace(/\\s+/, " ").split(" "),
        w.each(t, function(t, n) {
            new RegExp("\\\\b" + n + "\\\\b").test(e) || (e = e + " " + n)
        }),
        e.replace(/^\\s|\\s$/, "")
    }
    ,
    C.removeStr = function(e, t) {
        return e = e.replace(/\\s+/, " "),
        t = t.replace(/\\s+/, " ").split(" "),
        w.each(t, function(t, n) {
            var a = new RegExp("\\\\b" + n + "\\\\b");
            a.test(e) && (e = e.replace(a, ""))
        }),
        e.replace(/\\s+/, " ").replace(/^\\s|\\s$/, "")
    }
    ,
    C.prototype.find = function(e) {
        var t = this
          , n = 0
          , a = []
          , i = "object" == typeof e;
        return this.each(function(r, o) {
            for (var s = i ? [e] : o.querySelectorAll(e || null); n < s.length; n++)
                a.push(s[n]);
            t.shift()
        }),
        i || (t.selector = (t.selector ? t.selector + " " : "") + e),
        w.each(a, function(e, n) {
            t.push(n)
        }),
        t
    }
    ,
    C.prototype.each = function(e) {
        return w.each.call(this, this, e)
    }
    ,
    C.prototype.addClass = function(e, t) {
        return this.each(function(n, a) {
            a.className = C[t ? "removeStr" : "addStr"](a.className, e)
        })
    }
    ,
    C.prototype.removeClass = function(e) {
        return this.addClass(e, !0)
    }
    ,
    C.prototype.hasClass = function(e) {
        var t = !1;
        return this.each(function(n, a) {
            new RegExp("\\\\b" + e + "\\\\b").test(a.className) && (t = !0)
        }),
        t
    }
    ,
    C.prototype.attr = function(e, t) {
        var n = this;
        return void 0 === t ? function() {
            if (n.length > 0)
                return n[0].getAttribute(e)
        }() : n.each(function(n, a) {
            a.setAttribute(e, t)
        })
    }
    ,
    C.prototype.removeAttr = function(e) {
        return this.each(function(t, n) {
            n.removeAttribute(e)
        })
    }
    ,
    C.prototype.html = function(e) {
        return this.each(function(t, n) {
            n.innerHTML = e
        })
    }
    ,
    C.prototype.val = function(e) {
        return this.each(function(t, n) {
            n.value = e
        })
    }
    ,
    C.prototype.append = function(e) {
        return this.each(function(t, n) {
            "object" == typeof e ? n.appendChild(e) : n.innerHTML = n.innerHTML + e
        })
    }
    ,
    C.prototype.remove = function(e) {
        return this.each(function(t, n) {
            e ? n.removeChild(e) : n.parentNode.removeChild(n)
        })
    }
    ,
    C.prototype.on = function(e, t) {
        return this.each(function(n, a) {
            a.attachEvent ? a.attachEvent("on" + e, function(e) {
                e.target = e.srcElement,
                t.call(a, e)
            }) : a.addEventListener(e, t, !1)
        })
    }
    ,
    C.prototype.off = function(e, t) {
        return this.each(function(n, a) {
            a.detachEvent ? a.detachEvent("on" + e, t) : a.removeEventListener(e, t, !1)
        })
    }
    ,
    T.isLeapYear = function(e) {
        return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0
    }
    ,
    T.prototype.config = {
        type: "date",
        range: !1,
        format: "yyyy-MM-dd",
        value: null,
        min: "1900-1-1",
        max: "2099-12-31",
        trigger: "focus",
        show: !1,
        showBottom: !0,
        btns: ["clear", "now", "confirm"],
        lang: "cn",
        theme: "default",
        position: null,
        calendar: !1,
        mark: {},
        zIndex: null,
        done: null,
        change: null
    },
    T.prototype.lang = function() {
        var e = this
          , t = e.config
          , n = {
            cn: {
                weeks: ["日", "一", "二", "三", "四", "五", "六"],
                time: ["时", "分", "秒"],
                timeTips: "选择时间",
                startTime: "开始时间",
                endTime: "结束时间",
                dateTips: "返回日期",
                month: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
                tools: {
                    confirm: "确定",
                    clear: "清空",
                    now: "现在"
                }
            },
            en: {
                weeks: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                time: ["Hours", "Minutes", "Seconds"],
                timeTips: "Select Time",
                startTime: "Start Time",
                endTime: "End Time",
                dateTips: "Select Date",
                month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                tools: {
                    confirm: "Confirm",
                    clear: "Clear",
                    now: "Now"
                }
            }
        };
        return n[t.lang] || n.cn
    }
    ,
    T.prototype.init = function() {
        var e = this
          , t = e.config
          , n = "yyyy|y|MM|M|dd|d|HH|H|mm|m|ss|s"
          , a = "static" === t.position
          , i = {
            year: "yyyy",
            month: "yyyy-MM",
            date: "yyyy-MM-dd",
            time: "HH:mm:ss",
            datetime: "yyyy-MM-dd HH:mm:ss"
        };
        t.elem = w(t.elem),
        t.eventElem = w(t.eventElem),
        t.elem[0] && (t.range === !0 && (t.range = "-"),
        t.format === i.date && (t.format = i[t.type]),
        e.format = t.format.match(new RegExp(n + "|.","g")) || [],
        e.EXP_IF = "",
        e.EXP_SPLIT = "",
        w.each(e.format, function(t, a) {
            var i = new RegExp(n).test(a) ? "\\\\d{" + function() {
                return new RegExp(n).test(e.format[0 === t ? t + 1 : t - 1] || "") ? /^yyyy|y$/.test(a) ? 4 : a.length : /^yyyy$/.test(a) ? "1,4" : /^y$/.test(a) ? "1,308" : "1,2"
            }() + "}" : "\\\\" + a;
            e.EXP_IF = e.EXP_IF + i,
            e.EXP_SPLIT = e.EXP_SPLIT + "(" + i + ")"
        }),
        e.EXP_IF = new RegExp("^" + (t.range ? e.EXP_IF + "\\\\s\\\\" + t.range + "\\\\s" + e.EXP_IF : e.EXP_IF) + "$"),
        e.EXP_SPLIT = new RegExp("^" + e.EXP_SPLIT + "$",""),
        e.isInput(t.elem[0]) || "focus" === t.trigger && (t.trigger = "click"),
        t.elem.attr("lay-key") || (t.elem.attr("lay-key", e.index),
        t.eventElem.attr("lay-key", e.index)),
        t.mark = w.extend({}, t.calendar && "cn" === t.lang ? {
            "0-1-1": "元旦",
            "0-2-14": "情人",
            "0-3-8": "妇女",
            "0-3-12": "植树",
            "0-4-1": "愚人",
            "0-5-1": "劳动",
            "0-5-4": "青年",
            "0-6-1": "儿童",
            "0-9-10": "教师",
            "0-9-18": "国耻",
            "0-10-1": "国庆",
            "0-12-25": "圣诞"
        } : {}, t.mark),
        w.each(["min", "max"], function(e, n) {
            var a = []
              , i = [];
            if ("number" == typeof t[n]) {
                var r = t[n]
                  , o = (new Date).getTime()
                  , s = 864e5
                  , l = new Date(r ? r < s ? o + r * s : r : o);
                a = [l.getFullYear(), l.getMonth() + 1, l.getDate()],
                r < s || (i = [l.getHours(), l.getMinutes(), l.getSeconds()])
            } else
                a = (t[n].match(/\\d+-\\d+-\\d+/) || [""])[0].split("-"),
                i = (t[n].match(/\\d+:\\d+:\\d+/) || [""])[0].split(":");
            t[n] = {
                year: 0 | a[0] || (new Date).getFullYear(),
                month: a[1] ? (0 | a[1]) - 1 : (new Date).getMonth(),
                date: 0 | a[2] || (new Date).getDate(),
                hours: 0 | i[0],
                minutes: 0 | i[1],
                seconds: 0 | i[2]
            }
        }),
        e.elemID = "layui-laydate" + t.elem.attr("lay-key"),
        (t.show || a) && e.render(),
        a || e.events(),
        t.value && (t.value.constructor === Date ? e.setValue(e.parse(0, e.systemDate(t.value))) : e.setValue(t.value)))
    }
    ,
    T.prototype.render = function() {
        var e = this
          , t = e.config
          , n = e.lang()
          , a = "static" === t.position
          , i = e.elem = w.elem("div", {
            id: e.elemID,
            "class": ["layui-laydate", t.range ? " layui-laydate-range" : "", a ? " " + c : "", t.theme && "default" !== t.theme && !/^#/.test(t.theme) ? " laydate-theme-" + t.theme : ""].join("")
        })
          , r = e.elemMain = []
          , o = e.elemHeader = []
          , s = e.elemCont = []
          , l = e.table = []
          , d = e.footer = w.elem("div", {
            "class": p
        });
        if (t.zIndex && (i.style.zIndex = t.zIndex),
        w.each(new Array(2), function(e) {
            if (!t.range && e > 0)
                return !0;
            var a = w.elem("div", {
                "class": "layui-laydate-header"
            })
              , i = [function() {
                var e = w.elem("i", {
                    "class": "layui-icon laydate-icon laydate-prev-y"
                });
                return e.innerHTML = "&#xe65a;",
                e
            }(), function() {
                var e = w.elem("i", {
                    "class": "layui-icon laydate-icon laydate-prev-m"
                });
                return e.innerHTML = "&#xe603;",
                e
            }(), function() {
                var e = w.elem("div", {
                    "class": "laydate-set-ym"
                })
                  , t = w.elem("span")
                  , n = w.elem("span");
                return e.appendChild(t),
                e.appendChild(n),
                e
            }(), function() {
                var e = w.elem("i", {
                    "class": "layui-icon laydate-icon laydate-next-m"
                });
                return e.innerHTML = "&#xe602;",
                e
            }(), function() {
                var e = w.elem("i", {
                    "class": "layui-icon laydate-icon laydate-next-y"
                });
                return e.innerHTML = "&#xe65b;",
                e
            }()]
              , d = w.elem("div", {
                "class": "layui-laydate-content"
            })
              , c = w.elem("table")
              , m = w.elem("thead")
              , u = w.elem("tr");
            w.each(i, function(e, t) {
                a.appendChild(t)
            }),
            m.appendChild(u),
            w.each(new Array(6), function(e) {
                var t = c.insertRow(0);
                w.each(new Array(7), function(a) {
                    if (0 === e) {
                        var i = w.elem("th");
                        i.innerHTML = n.weeks[a],
                        u.appendChild(i)
                    }
                    t.insertCell(a)
                })
            }),
            c.insertBefore(m, c.children[0]),
            d.appendChild(c),
            r[e] = w.elem("div", {
                "class": "layui-laydate-main laydate-main-list-" + e
            }),
            r[e].appendChild(a),
            r[e].appendChild(d),
            o.push(i),
            s.push(d),
            l.push(c)
        }),
        w(d).html(function() {
            var e = []
              , i = [];
            return "datetime" === t.type && e.push('<span lay-type="datetime" class="laydate-btns-time">' + n.timeTips + "</span>"),
            w.each(t.btns, function(e, r) {
                var o = n.tools[r] || "btn";
                t.range && "now" === r || (a && "clear" === r && (o = "cn" === t.lang ? "重置" : "Reset"),
                i.push('<span lay-type="' + r + '" class="laydate-btns-' + r + '">' + o + "</span>"))
            }),
            e.push('<div class="laydate-footer-btns">' + i.join("") + "</div>"),
            e.join("")
        }()),
        w.each(r, function(e, t) {
            i.appendChild(t)
        }),
        t.showBottom && i.appendChild(d),
        /^#/.test(t.theme)) {
            var m = w.elem("style")
              , u = ["#{{id}} .layui-laydate-header{background-color:{{theme}};}", "#{{id}} .layui-this{background-color:{{theme}} !important;}"].join("").replace(/{{id}}/g, e.elemID).replace(/{{theme}}/g, t.theme);
            "styleSheet"in m ? (m.setAttribute("type", "text/css"),
            m.styleSheet.cssText = u) : m.innerHTML = u,
            w(i).addClass("laydate-theme-molv"),
            i.appendChild(m)
        }
        e.remove(T.thisElemDate),
        a ? t.elem.append(i) : (document.body.appendChild(i),
        e.position()),
        e.checkDate().calendar(),
        e.changeEvent(),
        T.thisElemDate = e.elemID,
        "function" == typeof t.ready && t.ready(w.extend({}, t.dateTime, {
            month: t.dateTime.month + 1
        }))
    }
    ,
    T.prototype.remove = function(e) {
        var t = this
          , n = (t.config,
        w("#" + (e || t.elemID)));
        return n.hasClass(c) || t.checkDate(function() {
            n.remove()
        }),
        t
    }
    ,
    T.prototype.position = function() {
        var e = this
          , t = e.config
          , n = e.bindElem || t.elem[0]
          , a = n.getBoundingClientRect()
          , i = e.elem.offsetWidth
          , r = e.elem.offsetHeight
          , o = function(e) {
            return e = e ? "scrollLeft" : "scrollTop",
            document.body[e] | document.documentElement[e]
        }
          , s = function(e) {
            return document.documentElement[e ? "clientWidth" : "clientHeight"]
        }
          , l = 5
          , d = a.left
          , c = a.bottom;
        d + i + l > s("width") && (d = s("width") - i - l),
        c + r + l > s() && (c = a.top > r ? a.top - r : s() - r,
        c -= 2 * l),
        t.position && (e.elem.style.position = t.position),
        e.elem.style.left = d + ("fixed" === t.position ? 0 : o(1)) + "px",
        e.elem.style.top = c + ("fixed" === t.position ? 0 : o()) + "px"
    }
    ,
    T.prototype.hint = function(e) {
        var t = this
          , n = (t.config,
        w.elem("div", {
            "class": h
        }));
        n.innerHTML = e || "",
        w(t.elem).find("." + h).remove(),
        t.elem.appendChild(n),
        clearTimeout(t.hinTimer),
        t.hinTimer = setTimeout(function() {
            w(t.elem).find("." + h).remove()
        }, 3e3)
    }
    ,
    T.prototype.getAsYM = function(e, t, n) {
        return n ? t-- : t++,
        t < 0 && (t = 11,
        e--),
        t > 11 && (t = 0,
        e++),
        [e, t]
    }
    ,
    T.prototype.systemDate = function(e) {
        var t = e || new Date;
        return {
            year: t.getFullYear(),
            month: t.getMonth(),
            date: t.getDate(),
            hours: e ? e.getHours() : 0,
            minutes: e ? e.getMinutes() : 0,
            seconds: e ? e.getSeconds() : 0
        }
    }
    ,
    T.prototype.checkDate = function(e) {
        var t, a, i = this, r = (new Date,
        i.config), o = r.dateTime = r.dateTime || i.systemDate(), s = i.bindElem || r.elem[0], l = (i.isInput(s) ? "val" : "html",
        i.isInput(s) ? s.value : "static" === r.position ? "" : s.innerHTML), c = function(e) {
            e.year > d[1] && (e.year = d[1],
            a = !0),
            e.month > 11 && (e.month = 11,
            a = !0),
            e.hours > 23 && (e.hours = 0,
            a = !0),
            e.minutes > 59 && (e.minutes = 0,
            e.hours++,
            a = !0),
            e.seconds > 59 && (e.seconds = 0,
            e.minutes++,
            a = !0),
            t = n.getEndDate(e.month + 1, e.year),
            e.date > t && (e.date = t,
            a = !0)
        }, m = function(e, t, n) {
            var o = ["startTime", "endTime"];
            t = (t.match(i.EXP_SPLIT) || []).slice(1),
            n = n || 0,
            r.range && (i[o[n]] = i[o[n]] || {}),
            w.each(i.format, function(s, l) {
                var c = parseFloat(t[s]);
                t[s].length < l.length && (a = !0),
                /yyyy|y/.test(l) ? (c < d[0] && (c = d[0],
                a = !0),
                e.year = c) : /MM|M/.test(l) ? (c < 1 && (c = 1,
                a = !0),
                e.month = c - 1) : /dd|d/.test(l) ? (c < 1 && (c = 1,
                a = !0),
                e.date = c) : /HH|H/.test(l) ? (c < 1 && (c = 0,
                a = !0),
                e.hours = c,
                r.range && (i[o[n]].hours = c)) : /mm|m/.test(l) ? (c < 1 && (c = 0,
                a = !0),
                e.minutes = c,
                r.range && (i[o[n]].minutes = c)) : /ss|s/.test(l) && (c < 1 && (c = 0,
                a = !0),
                e.seconds = c,
                r.range && (i[o[n]].seconds = c))
            }),
            c(e)
        };
        return "limit" === e ? (c(o),
        i) : (l = l || r.value,
        "string" == typeof l && (l = l.replace(/\\s+/g, " ").replace(/^\\s|\\s$/g, "")),
        i.startState && !i.endState && (delete i.startState,
        i.endState = !0),
        "string" == typeof l && l ? i.EXP_IF.test(l) ? r.range ? (l = l.split(" " + r.range + " "),
        i.startDate = i.startDate || i.systemDate(),
        i.endDate = i.endDate || i.systemDate(),
        r.dateTime = w.extend({}, i.startDate),
        w.each([i.startDate, i.endDate], function(e, t) {
            m(t, l[e], e)
        })) : m(o, l) : (i.hint("日期格式不合法<br>必须遵循下述格式：<br>" + (r.range ? r.format + " " + r.range + " " + r.format : r.format) + "<br>已为你重置"),
        a = !0) : l && l.constructor === Date ? r.dateTime = i.systemDate(l) : (r.dateTime = i.systemDate(),
        delete i.startState,
        delete i.endState,
        delete i.startDate,
        delete i.endDate,
        delete i.startTime,
        delete i.endTime),
        c(o),
        a && l && i.setValue(r.range ? i.endDate ? i.parse() : "" : i.parse()),
        e && e(),
        i)
    }
    ,
    T.prototype.mark = function(e, t) {
        var n, a = this, i = a.config;
        return w.each(i.mark, function(e, a) {
            var i = e.split("-");
            i[0] != t[0] && 0 != i[0] || i[1] != t[1] && 0 != i[1] || i[2] != t[2] || (n = a || t[2])
        }),
        n && e.html('<span class="laydate-day-mark">' + n + "</span>"),
        a
    }
    ,
    T.prototype.limit = function(e, t, n, a) {
        var i, r = this, o = r.config, l = {}, d = o[n > 41 ? "endDate" : "dateTime"], c = w.extend({}, d, t || {});
        return w.each({
            now: c,
            min: o.min,
            max: o.max
        }, function(e, t) {
            l[e] = r.newDate(w.extend({
                year: t.year,
                month: t.month,
                date: t.date
            }, function() {
                var e = {};
                return w.each(a, function(n, a) {
                    e[a] = t[a]
                }),
                e
            }())).getTime()
        }),
        i = l.now < l.min || l.now > l.max,
        e && e[i ? "addClass" : "removeClass"](s),
        i
    }
    ,
    T.prototype.calendar = function(e) {
        var t, a, i, r = this, s = r.config, l = e || s.dateTime, c = new Date, m = r.lang(), u = "date" !== s.type && "datetime" !== s.type, h = e ? 1 : 0, y = w(r.table[h]).find("td"), f = w(r.elemHeader[h][2]).find("span");
        if (l.year < d[0] && (l.year = d[0],
        r.hint("最低只能支持到公元" + d[0] + "年")),
        l.year > d[1] && (l.year = d[1],
        r.hint("最高只能支持到公元" + d[1] + "年")),
        r.firstDate || (r.firstDate = w.extend({}, l)),
        c.setFullYear(l.year, l.month, 1),
        t = c.getDay(),
        a = n.getEndDate(l.month || 12, l.year),
        i = n.getEndDate(l.month + 1, l.year),
        w.each(y, function(e, n) {
            var d = [l.year, l.month]
              , c = 0;
            n = w(n),
            n.removeAttr("class"),
            e < t ? (c = a - t + e,
            n.addClass("laydate-day-prev"),
            d = r.getAsYM(l.year, l.month, "sub")) : e >= t && e < i + t ? (c = e - t,
            s.range || c + 1 === l.date && n.addClass(o)) : (c = e - i - t,
            n.addClass("laydate-day-next"),
            d = r.getAsYM(l.year, l.month)),
            d[1]++,
            d[2] = c + 1,
            n.attr("lay-ymd", d.join("-")).html(d[2]),
            r.mark(n, d).limit(n, {
                year: d[0],
                month: d[1] - 1,
                date: d[2]
            }, e)
        }),
        w(f[0]).attr("lay-ym", l.year + "-" + (l.month + 1)),
        w(f[1]).attr("lay-ym", l.year + "-" + (l.month + 1)),
        "cn" === s.lang ? (w(f[0]).attr("lay-type", "year").html(l.year + "年"),
        w(f[1]).attr("lay-type", "month").html(l.month + 1 + "月")) : (w(f[0]).attr("lay-type", "month").html(m.month[l.month]),
        w(f[1]).attr("lay-type", "year").html(l.year)),
        u && (s.range && (e ? r.endDate = r.endDate || {
            year: l.year + ("year" === s.type ? 1 : 0),
            month: l.month + ("month" === s.type ? 0 : -1)
        } : r.startDate = r.startDate || {
            year: l.year,
            month: l.month
        },
        e && (r.listYM = [[r.startDate.year, r.startDate.month + 1], [r.endDate.year, r.endDate.month + 1]],
        r.list(s.type, 0).list(s.type, 1),
        "time" === s.type ? r.setBtnStatus("时间", w.extend({}, r.systemDate(), r.startTime), w.extend({}, r.systemDate(), r.endTime)) : r.setBtnStatus(!0))),
        s.range || (r.listYM = [[l.year, l.month + 1]],
        r.list(s.type, 0))),
        s.range && !e) {
            var p = r.getAsYM(l.year, l.month);
            r.calendar(w.extend({}, l, {
                year: p[0],
                month: p[1]
            }))
        }
        return s.range || r.limit(w(r.footer).find(g), null, 0, ["hours", "minutes", "seconds"]),
        s.range && e && !u && r.stampRange(),
        r
    }
    ,
    T.prototype.list = function(e, t) {
        var n = this
          , a = n.config
          , i = a.dateTime
          , r = n.lang()
          , l = a.range && "date" !== a.type && "datetime" !== a.type
          , d = w.elem("ul", {
            "class": m + " " + {
                year: "laydate-year-list",
                month: "laydate-month-list",
                time: "laydate-time-list"
            }[e]
        })
          , c = n.elemHeader[t]
          , u = w(c[2]).find("span")
          , h = n.elemCont[t || 0]
          , y = w(h).find("." + m)[0]
          , f = "cn" === a.lang
          , p = f ? "年" : ""
          , T = n.listYM[t] || {}
          , C = ["hours", "minutes", "seconds"]
          , x = ["startTime", "endTime"][t];
        if (T[0] < 1 && (T[0] = 1),
        "year" === e) {
            var M, b = M = T[0] - 7;
            b < 1 && (b = M = 1),
            w.each(new Array(15), function(e) {
                var i = w.elem("li", {
                    "lay-ym": M
                })
                  , r = {
                    year: M
                };
                M == T[0] && w(i).addClass(o),
                i.innerHTML = M + p,
                d.appendChild(i),
                M < n.firstDate.year ? (r.month = a.min.month,
                r.date = a.min.date) : M >= n.firstDate.year && (r.month = a.max.month,
                r.date = a.max.date),
                n.limit(w(i), r, t),
                M++
            }),
            w(u[f ? 0 : 1]).attr("lay-ym", M - 8 + "-" + T[1]).html(b + p + " - " + (M - 1 + p))
        } else if ("month" === e)
            w.each(new Array(12), function(e) {
                var i = w.elem("li", {
                    "lay-ym": e
                })
                  , s = {
                    year: T[0],
                    month: e
                };
                e + 1 == T[1] && w(i).addClass(o),
                i.innerHTML = r.month[e] + (f ? "月" : ""),
                d.appendChild(i),
                T[0] < n.firstDate.year ? s.date = a.min.date : T[0] >= n.firstDate.year && (s.date = a.max.date),
                n.limit(w(i), s, t)
            }),
            w(u[f ? 0 : 1]).attr("lay-ym", T[0] + "-" + T[1]).html(T[0] + p);
        else if ("time" === e) {
            var E = function() {
                w(d).find("ol").each(function(e, a) {
                    w(a).find("li").each(function(a, i) {
                        n.limit(w(i), [{
                            hours: a
                        }, {
                            hours: n[x].hours,
                            minutes: a
                        }, {
                            hours: n[x].hours,
                            minutes: n[x].minutes,
                            seconds: a
                        }][e], t, [["hours"], ["hours", "minutes"], ["hours", "minutes", "seconds"]][e])
                    })
                }),
                a.range || n.limit(w(n.footer).find(g), n[x], 0, ["hours", "minutes", "seconds"])
            };
            a.range ? n[x] || (n[x] = {
                hours: 0,
                minutes: 0,
                seconds: 0
            }) : n[x] = i,
            w.each([24, 60, 60], function(e, t) {
                var a = w.elem("li")
                  , i = ["<p>" + r.time[e] + "</p><ol>"];
                w.each(new Array(t), function(t) {
                    i.push("<li" + (n[x][C[e]] === t ? ' class="' + o + '"' : "") + ">" + w.digit(t, 2) + "</li>")
                }),
                a.innerHTML = i.join("") + "</ol>",
                d.appendChild(a)
            }),
            E()
        }
        if (y && h.removeChild(y),
        h.appendChild(d),
        "year" === e || "month" === e)
            w(n.elemMain[t]).addClass("laydate-ym-show"),
            w(d).find("li").on("click", function() {
                var r = 0 | w(this).attr("lay-ym");
                if (!w(this).hasClass(s)) {
                    if (0 === t)
                        i[e] = r,
                        l && (n.startDate[e] = r),
                        n.limit(w(n.footer).find(g), null, 0);
                    else if (l)
                        n.endDate[e] = r;
                    else {
                        var c = "year" === e ? n.getAsYM(r, T[1] - 1, "sub") : n.getAsYM(T[0], r, "sub");
                        w.extend(i, {
                            year: c[0],
                            month: c[1]
                        })
                    }
                    "year" === a.type || "month" === a.type ? (w(d).find("." + o).removeClass(o),
                    w(this).addClass(o),
                    "month" === a.type && "year" === e && (n.listYM[t][0] = r,
                    l && (n[["startDate", "endDate"][t]].year = r),
                    n.list("month", t))) : (n.checkDate("limit").calendar(),
                    n.closeList()),
                    n.setBtnStatus(),
                    a.range || n.done(null, "change"),
                    w(n.footer).find(D).removeClass(s)
                }
            });
        else {
            var S = w.elem("span", {
                "class": v
            })
              , k = function() {
                w(d).find("ol").each(function(e) {
                    var t = this
                      , a = w(t).find("li");
                    t.scrollTop = 30 * (n[x][C[e]] - 2),
                    t.scrollTop <= 0 && a.each(function(e, n) {
                        if (!w(this).hasClass(s))
                            return t.scrollTop = 30 * (e - 2),
                            !0
                    })
                })
            }
              , H = w(c[2]).find("." + v);
            k(),
            S.innerHTML = a.range ? [r.startTime, r.endTime][t] : r.timeTips,
            w(n.elemMain[t]).addClass("laydate-time-show"),
            H[0] && H.remove(),
            c[2].appendChild(S),
            w(d).find("ol").each(function(e) {
                var t = this;
                w(t).find("li").on("click", function() {
                    var r = 0 | this.innerHTML;
                    w(this).hasClass(s) || (a.range ? n[x][C[e]] = r : i[C[e]] = r,
                    w(t).find("." + o).removeClass(o),
                    w(this).addClass(o),
                    E(),
                    k(),
                    (n.endDate || "time" === a.type) && n.done(null, "change"),
                    n.setBtnStatus())
                })
            })
        }
        return n
    }
    ,
    T.prototype.listYM = [],
    T.prototype.closeList = function() {
        var e = this;
        e.config;
        w.each(e.elemCont, function(t, n) {
            w(this).find("." + m).remove(),
            w(e.elemMain[t]).removeClass("laydate-ym-show laydate-time-show")
        }),
        w(e.elem).find("." + v).remove()
    }
    ,
    T.prototype.setBtnStatus = function(e, t, n) {
        var a, i = this, r = i.config, o = w(i.footer).find(g), d = r.range && "date" !== r.type && "time" !== r.type;
        d && (t = t || i.startDate,
        n = n || i.endDate,
        a = i.newDate(t).getTime() > i.newDate(n).getTime(),
        i.limit(null, t) || i.limit(null, n) ? o.addClass(s) : o[a ? "addClass" : "removeClass"](s),
        e && a && i.hint("string" == typeof e ? l.replace(/日期/g, e) : l))
    }
    ,
    T.prototype.parse = function(e, t) {
        var n = this
          , a = n.config
          , i = t || (e ? w.extend({}, n.endDate, n.endTime) : a.range ? w.extend({}, n.startDate, n.startTime) : a.dateTime)
          , r = n.format.concat();
        return w.each(r, function(e, t) {
            /yyyy|y/.test(t) ? r[e] = w.digit(i.year, t.length) : /MM|M/.test(t) ? r[e] = w.digit(i.month + 1, t.length) : /dd|d/.test(t) ? r[e] = w.digit(i.date, t.length) : /HH|H/.test(t) ? r[e] = w.digit(i.hours, t.length) : /mm|m/.test(t) ? r[e] = w.digit(i.minutes, t.length) : /ss|s/.test(t) && (r[e] = w.digit(i.seconds, t.length))
        }),
        a.range && !e ? r.join("") + " " + a.range + " " + n.parse(1) : r.join("")
    }
    ,
    T.prototype.newDate = function(e) {
        return e = e || {},
        new Date(e.year || 1,e.month || 0,e.date || 1,e.hours || 0,e.minutes || 0,e.seconds || 0)
    }
    ,
    T.prototype.setValue = function(e) {
        var t = this
          , n = t.config
          , a = t.bindElem || n.elem[0]
          , i = t.isInput(a) ? "val" : "html";
        return "static" === n.position || w(a)[i](e || ""),
        this
    }
    ,
    T.prototype.stampRange = function() {
        var e, t, n = this, a = n.config, i = w(n.elem).find("td");
        if (a.range && !n.endDate && w(n.footer).find(g).addClass(s),
        n.endDate)
            return e = n.newDate({
                year: n.startDate.year,
                month: n.startDate.month,
                date: n.startDate.date
            }).getTime(),
            t = n.newDate({
                year: n.endDate.year,
                month: n.endDate.month,
                date: n.endDate.date
            }).getTime(),
            e > t ? n.hint(l) : void w.each(i, function(a, i) {
                var r = w(i).attr("lay-ymd").split("-")
                  , s = n.newDate({
                    year: r[0],
                    month: r[1] - 1,
                    date: r[2]
                }).getTime();
                w(i).removeClass(u + " " + o),
                s !== e && s !== t || w(i).addClass(w(i).hasClass(y) || w(i).hasClass(f) ? u : o),
                s > e && s < t && w(i).addClass(u)
            })
    }
    ,
    T.prototype.done = function(e, t) {
        var n = this
          , a = n.config
          , i = w.extend({}, n.startDate ? w.extend(n.startDate, n.startTime) : a.dateTime)
          , r = w.extend({}, w.extend(n.endDate, n.endTime));
        return w.each([i, r], function(e, t) {
            "month"in t && w.extend(t, {
                month: t.month + 1
            })
        }),
        e = e || [n.parse(), i, r],
        "function" == typeof a[t || "done"] && a[t || "done"].apply(a, e),
        n
    }
    ,
    T.prototype.choose = function(e) {
        var t = this
          , n = t.config
          , a = n.dateTime
          , i = w(t.elem).find("td")
          , r = e.attr("lay-ymd").split("-")
          , l = function(e) {
            new Date;
            e && w.extend(a, r),
            n.range && (t.startDate ? w.extend(t.startDate, r) : t.startDate = w.extend({}, r, t.startTime),
            t.startYMD = r)
        };
        if (r = {
            year: 0 | r[0],
            month: (0 | r[1]) - 1,
            date: 0 | r[2]
        },
        !e.hasClass(s))
            if (n.range) {
                if (w.each(["startTime", "endTime"], function(e, n) {
                    t[n] = t[n] || {
                        hours: 0,
                        minutes: 0,
                        seconds: 0
                    }
                }),
                t.endState)
                    l(),
                    delete t.endState,
                    delete t.endDate,
                    t.startState = !0,
                    i.removeClass(o + " " + u),
                    e.addClass(o);
                else if (t.startState) {
                    if (e.addClass(o),
                    t.endDate ? w.extend(t.endDate, r) : t.endDate = w.extend({}, r, t.endTime),
                    t.newDate(r).getTime() < t.newDate(t.startYMD).getTime()) {
                        var d = w.extend({}, t.endDate, {
                            hours: t.startDate.hours,
                            minutes: t.startDate.minutes,
                            seconds: t.startDate.seconds
                        });
                        w.extend(t.endDate, t.startDate, {
                            hours: t.endDate.hours,
                            minutes: t.endDate.minutes,
                            seconds: t.endDate.seconds
                        }),
                        t.startDate = d
                    }
                    n.showBottom || t.done(),
                    t.stampRange(),
                    t.endState = !0,
                    t.done(null, "change")
                } else
                    e.addClass(o),
                    l(),
                    t.startState = !0;
                w(t.footer).find(g)[t.endDate ? "removeClass" : "addClass"](s)
            } else
                "static" === n.position ? (l(!0),
                t.calendar().done().done(null, "change")) : "date" === n.type ? (l(!0),
                t.setValue(t.parse()).remove().done()) : "datetime" === n.type && (l(!0),
                t.calendar().done(null, "change"))
    }
    ,
    T.prototype.tool = function(e, t) {
        var n = this
          , a = n.config
          , i = a.dateTime
          , r = "static" === a.position
          , o = {
            datetime: function() {
                w(e).hasClass(s) || (n.list("time", 0),
                a.range && n.list("time", 1),
                w(e).attr("lay-type", "date").html(n.lang().dateTips))
            },
            date: function() {
                n.closeList(),
                w(e).attr("lay-type", "datetime").html(n.lang().timeTips)
            },
            clear: function() {
                n.setValue("").remove(),
                r && (w.extend(i, n.firstDate),
                n.calendar()),
                a.range && (delete n.startState,
                delete n.endState,
                delete n.endDate,
                delete n.startTime,
                delete n.endTime),
                n.done(["", {}, {}])
            },
            now: function() {
                var e = new Date;
                w.extend(i, n.systemDate(), {
                    hours: e.getHours(),
                    minutes: e.getMinutes(),
                    seconds: e.getSeconds()
                }),
                n.setValue(n.parse()).remove(),
                r && n.calendar(),
                n.done()
            },
            confirm: function() {
                if (a.range) {
                    if (!n.endDate)
                        return n.hint("请先选择日期范围");
                    if (w(e).hasClass(s))
                        return n.hint("time" === a.type ? l.replace(/日期/g, "时间") : l)
                } else if (w(e).hasClass(s))
                    return n.hint("不在有效日期或时间范围内");
                n.done(),
                n.setValue(n.parse()).remove()
            }
        };
        o[t] && o[t]()
    }
    ,
    T.prototype.change = function(e) {
        var t = this
          , n = t.config
          , a = n.dateTime
          , i = n.range && ("year" === n.type || "month" === n.type)
          , r = t.elemCont[e || 0]
          , o = t.listYM[e]
          , s = function(s) {
            var l = ["startDate", "endDate"][e]
              , d = w(r).find(".laydate-year-list")[0]
              , c = w(r).find(".laydate-month-list")[0];
            return d && (o[0] = s ? o[0] - 15 : o[0] + 15,
            t.list("year", e)),
            c && (s ? o[0]-- : o[0]++,
            t.list("month", e)),
            (d || c) && (w.extend(a, {
                year: o[0]
            }),
            i && (t[l].year = o[0]),
            n.range || t.done(null, "change"),
            t.setBtnStatus(),
            n.range || t.limit(w(t.footer).find(g), {
                year: o[0]
            })),
            d || c
        };
        return {
            prevYear: function() {
                s("sub") || (a.year--,
                t.checkDate("limit").calendar(),
                n.range || t.done(null, "change"))
            },
            prevMonth: function() {
                var e = t.getAsYM(a.year, a.month, "sub");
                w.extend(a, {
                    year: e[0],
                    month: e[1]
                }),
                t.checkDate("limit").calendar(),
                n.range || t.done(null, "change")
            },
            nextMonth: function() {
                var e = t.getAsYM(a.year, a.month);
                w.extend(a, {
                    year: e[0],
                    month: e[1]
                }),
                t.checkDate("limit").calendar(),
                n.range || t.done(null, "change")
            },
            nextYear: function() {
                s() || (a.year++,
                t.checkDate("limit").calendar(),
                n.range || t.done(null, "change"))
            }
        }
    }
    ,
    T.prototype.changeEvent = function() {
        var e = this;
        e.config;
        w(e.elem).on("click", function(e) {
            w.stope(e)
        }),
        w.each(e.elemHeader, function(t, n) {
            w(n[0]).on("click", function(n) {
                e.change(t).prevYear()
            }),
            w(n[1]).on("click", function(n) {
                e.change(t).prevMonth()
            }),
            w(n[2]).find("span").on("click", function(n) {
                var a = w(this)
                  , i = a.attr("lay-ym")
                  , r = a.attr("lay-type");
                i && (i = i.split("-"),
                e.listYM[t] = [0 | i[0], 0 | i[1]],
                e.list(r, t),
                w(e.footer).find(D).addClass(s))
            }),
            w(n[3]).on("click", function(n) {
                e.change(t).nextMonth()
            }),
            w(n[4]).on("click", function(n) {
                e.change(t).nextYear()
            })
        }),
        w.each(e.table, function(t, n) {
            var a = w(n).find("td");
            a.on("click", function() {
                e.choose(w(this))
            })
        }),
        w(e.footer).find("span").on("click", function() {
            var t = w(this).attr("lay-type");
            e.tool(this, t)
        })
    }
    ,
    T.prototype.isInput = function(e) {
        return /input|textarea/.test(e.tagName.toLocaleLowerCase())
    }
    ,
    T.prototype.events = function() {
        var e = this
          , t = e.config
          , n = function(n, a) {
            n.on(t.trigger, function() {
                a && (e.bindElem = this),
                e.render()
            })
        };
        t.elem[0] && !t.elem[0].eventHandler && (n(t.elem, "bind"),
        n(t.eventElem),
        w(document).on("click", function(n) {
            n.target !== t.elem[0] && n.target !== t.eventElem[0] && n.target !== w(t.closeStop)[0] && e.remove()
        }).on("keydown", function(t) {
            13 === t.keyCode && w("#" + e.elemID)[0] && e.elemID === T.thisElem && (t.preventDefault(),
            w(e.footer).find(g)[0].click())
        }),
        w(window).on("resize", function() {
            return !(!e.elem || !w(r)[0]) && void e.position()
        }),
        t.elem[0].eventHandler = !0)
    }
    ,
    n.render = function(e) {
        var t = new T(e);
        return a.call(t)
    }
    ,
    n.getEndDate = function(e, t) {
        var n = new Date;
        return n.setFullYear(t || n.getFullYear(), e || n.getMonth() + 1, 1),
        new Date(n.getTime() - 864e5).getDate()
    }
    ,
    window.lay = window.lay || w,
    e ? (n.ready(),
    layui.define(function(e) {
        n.path = layui.cache.dir,
        e(i, n)
    })) : "function" == typeof define && define.amd ? define(function() {
        return n
    }) : function() {
        n.ready(),
        window.laydate = n
    }()
}();

try {
    $(".iframe_wrap_dcw8v5jwzdc00").css("height", '380px');
    $(".iframe_wrap_dcw8v5jwzdc00").parent().parent().css('height', '334px');
} catch (err) {}

$(function() {
    $('audio').attr('controlsList', 'nodownload');
    $('audio').attr('oncontextmenu', 'return false');
});

try {
    var alertId = 'xuexi_alert';
    var alertHtml = '#title {color:#b8261a !important;}#btn {background:white !important;border:1px solid #b8261a !important;color:#b8261a !important;}#btn:active {border: 2px solid #b8261a !important;}'
    var style = $('#' + alertId);
    if (style.length == 0) {
        $('<style></style>').attr('id', alertId).html(alertHtml).appendTo('head')
    }
} catch (err) {}

window.console.log = function() {}
;

!function(t) {
    var e = {};
    function n(r) {
        if (e[r])
            return e[r].exports;
        var i = e[r] = {
            i: r,
            l: !1,
            exports: {}
        };
        return t[r].call(i.exports, i, i.exports, n),
        i.l = !0,
        i.exports
    }
    n.m = t,
    n.c = e,
    n.d = function(t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, {
            enumerable: !0,
            get: r
        })
    }
    ,
    n.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }),
        Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }
    ,
    n.t = function(t, e) {
        if (1 & e && (t = n(t)),
        8 & e)
            return t;
        if (4 & e && "object" == typeof t && t && t.__esModule)
            return t;
        var r = Object.create(null);
        if (n.r(r),
        Object.defineProperty(r, "default", {
            enumerable: !0,
            value: t
        }),
        2 & e && "string" != typeof t)
            for (var i in t)
                n.d(r, i, function(e) {
                    return t[e]
                }
                .bind(null, i));
        return r
    }
    ,
    n.n = function(t) {
        var e = t && t.__esModule ? function() {
            return t.default
        }
        : function() {
            return t
        }
        ;
        return n.d(e, "a", e),
        e
    }
    ,
    n.o = function(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    ,
    n.p = "",
    n(n.s = 109)
}([function(t, e, n) {
    var r;
    t.exports = (r = r || function(t, e) {
        var n = Object.create || function() {
            function t() {}
            return function(e) {
                var n;
                return t.prototype = e,
                n = new t,
                t.prototype = null,
                n
            }
        }()
          , r = {}
          , i = r.lib = {}
          , o = i.Base = {
            extend: function(t) {
                var e = n(this);
                return t && e.mixIn(t),
                e.hasOwnProperty("init") && this.init !== e.init || (e.init = function() {
                    e.$super.init.apply(this, arguments)
                }
                ),
                e.init.prototype = e,
                e.$super = this,
                e
            },
            create: function() {
                var t = this.extend();
                return t.init.apply(t, arguments),
                t
            },
            init: function() {},
            mixIn: function(t) {
                for (var e in t)
                    t.hasOwnProperty(e) && (this[e] = t[e]);
                t.hasOwnProperty("toString") && (this.toString = t.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        }
          , a = i.WordArray = o.extend({
            init: function(t, e) {
                t = this.words = t || [],
                this.sigBytes = null != e ? e : 4 * t.length
            },
            toString: function(t) {
                return (t || s).stringify(this)
            },
            concat: function(t) {
                var e = this.words
                  , n = t.words
                  , r = this.sigBytes
                  , i = t.sigBytes;
                if (this.clamp(),
                r % 4)
                    for (var o = 0; o < i; o++) {
                        var a = n[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                        e[r + o >>> 2] |= a << 24 - (r + o) % 4 * 8
                    }
                else
                    for (var o = 0; o < i; o += 4)
                        e[r + o >>> 2] = n[o >>> 2];
                return this.sigBytes += i,
                this
            },
            clamp: function() {
                var e = this.words
                  , n = this.sigBytes;
                e[n >>> 2] &= 4294967295 << 32 - n % 4 * 8,
                e.length = t.ceil(n / 4)
            },
            clone: function() {
                var t = o.clone.call(this);
                return t.words = this.words.slice(0),
                t
            },
            random: function(e) {
                for (var n, r = [], i = function(e) {
                    var e = e
                      , n = 987654321
                      , r = 4294967295;
                    return function() {
                        var i = ((n = 36969 * (65535 & n) + (n >> 16) & r) << 16) + (e = 18e3 * (65535 & e) + (e >> 16) & r) & r;
                        return i /= 4294967296,
                        (i += .5) * (t.random() > .5 ? 1 : -1)
                    }
                }, o = 0; o < e; o += 4) {
                    var c = i(4294967296 * (n || t.random()));
                    n = 987654071 * c(),
                    r.push(4294967296 * c() | 0)
                }
                return new a.init(r,e)
            }
        })
          , c = r.enc = {}
          , s = c.Hex = {
            stringify: function(t) {
                for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i++) {
                    var o = e[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                    r.push((o >>> 4).toString(16)),
                    r.push((15 & o).toString(16))
                }
                return r.join("")
            },
            parse: function(t) {
                for (var e = t.length, n = [], r = 0; r < e; r += 2)
                    n[r >>> 3] |= parseInt(t.substr(r, 2), 16) << 24 - r % 8 * 4;
                return new a.init(n,e / 2)
            }
        }
          , u = c.Latin1 = {
            stringify: function(t) {
                for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i++) {
                    var o = e[i >>> 2] >>> 24 - i % 4 * 8 & 255;
                    r.push(String.fromCharCode(o))
                }
                return r.join("")
            },
            parse: function(t) {
                for (var e = t.length, n = [], r = 0; r < e; r++)
                    n[r >>> 2] |= (255 & t.charCodeAt(r)) << 24 - r % 4 * 8;
                return new a.init(n,e)
            }
        }
          , f = c.Utf8 = {
            stringify: function(t) {
                try {
                    return decodeURIComponent(escape(u.stringify(t)))
                } catch (t) {
                    throw new Error("Malformed UTF-8 data")
                }
            },
            parse: function(t) {
                return u.parse(unescape(encodeURIComponent(t)))
            }
        }
          , l = i.BufferedBlockAlgorithm = o.extend({
            reset: function() {
                this._data = new a.init,
                this._nDataBytes = 0
            },
            _append: function(t) {
                "string" == typeof t && (t = f.parse(t)),
                this._data.concat(t),
                this._nDataBytes += t.sigBytes
            },
            _process: function(e) {
                var n = this._data
                  , r = n.words
                  , i = n.sigBytes
                  , o = this.blockSize
                  , c = 4 * o
                  , s = i / c
                  , u = (s = e ? t.ceil(s) : t.max((0 | s) - this._minBufferSize, 0)) * o
                  , f = t.min(4 * u, i);
                if (u) {
                    for (var l = 0; l < u; l += o)
                        this._doProcessBlock(r, l);
                    var h = r.splice(0, u);
                    n.sigBytes -= f
                }
                return new a.init(h,f)
            },
            clone: function() {
                var t = o.clone.call(this);
                return t._data = this._data.clone(),
                t
            },
            _minBufferSize: 0
        })
          , h = (i.Hasher = l.extend({
            cfg: o.extend(),
            init: function(t) {
                this.cfg = this.cfg.extend(t),
                this.reset()
            },
            reset: function() {
                l.reset.call(this),
                this._doReset()
            },
            update: function(t) {
                return this._append(t),
                this._process(),
                this
            },
            finalize: function(t) {
                t && this._append(t);
                var e = this._doFinalize();
                return e
            },
            blockSize: 16,
            _createHelper: function(t) {
                return function(e, n) {
                    return new t.init(n).finalize(e)
                }
            },
            _createHmacHelper: function(t) {
                return function(e, n) {
                    return new h.HMAC.init(t,n).finalize(e)
                }
            }
        }),
        r.algo = {});
        return r
    }(Math),
    r)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(4),
    void (r.lib.Cipher || function(t) {
        var e = r
          , n = e.lib
          , i = n.Base
          , o = n.WordArray
          , a = n.BufferedBlockAlgorithm
          , c = e.enc
          , s = (c.Utf8,
        c.Base64)
          , u = e.algo
          , f = u.EvpKDF
          , l = n.Cipher = a.extend({
            cfg: i.extend(),
            createEncryptor: function(t, e) {
                return this.create(this._ENC_XFORM_MODE, t, e)
            },
            createDecryptor: function(t, e) {
                return this.create(this._DEC_XFORM_MODE, t, e)
            },
            init: function(t, e, n) {
                this.cfg = this.cfg.extend(n),
                this._xformMode = t,
                this._key = e,
                this.reset()
            },
            reset: function() {
                a.reset.call(this),
                this._doReset()
            },
            process: function(t) {
                return this._append(t),
                this._process()
            },
            finalize: function(t) {
                t && this._append(t);
                var e = this._doFinalize();
                return e
            },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function() {
                function t(t) {
                    return "string" == typeof t ? k : w
                }
                return function(e) {
                    return {
                        encrypt: function(n, r, i) {
                            return t(r).encrypt(e, n, r, i)
                        },
                        decrypt: function(n, r, i) {
                            return t(r).decrypt(e, n, r, i)
                        }
                    }
                }
            }()
        })
          , h = (n.StreamCipher = l.extend({
            _doFinalize: function() {
                var t = this._process(!0);
                return t
            },
            blockSize: 1
        }),
        e.mode = {})
          , d = n.BlockCipherMode = i.extend({
            createEncryptor: function(t, e) {
                return this.Encryptor.create(t, e)
            },
            createDecryptor: function(t, e) {
                return this.Decryptor.create(t, e)
            },
            init: function(t, e) {
                this._cipher = t,
                this._iv = e
            }
        })
          , p = h.CBC = function() {
            var e = d.extend();
            function n(e, n, r) {
                var i = this._iv;
                if (i) {
                    var o = i;
                    this._iv = t
                } else
                    var o = this._prevBlock;
                for (var a = 0; a < r; a++)
                    e[n + a] ^= o[a]
            }
            return e.Encryptor = e.extend({
                processBlock: function(t, e) {
                    var r = this._cipher
                      , i = r.blockSize;
                    n.call(this, t, e, i),
                    r.encryptBlock(t, e),
                    this._prevBlock = t.slice(e, e + i)
                }
            }),
            e.Decryptor = e.extend({
                processBlock: function(t, e) {
                    var r = this._cipher
                      , i = r.blockSize
                      , o = t.slice(e, e + i);
                    r.decryptBlock(t, e),
                    n.call(this, t, e, i),
                    this._prevBlock = o
                }
            }),
            e
        }()
          , v = e.pad = {}
          , y = v.Pkcs7 = {
            pad: function(t, e) {
                for (var n = 4 * e, r = n - t.sigBytes % n, i = r << 24 | r << 16 | r << 8 | r, a = [], c = 0; c < r; c += 4)
                    a.push(i);
                var s = o.create(a, r);
                t.concat(s)
            },
            unpad: function(t) {
                var e = 255 & t.words[t.sigBytes - 1 >>> 2];
                t.sigBytes -= e
            }
        }
          , _ = (n.BlockCipher = l.extend({
            cfg: l.cfg.extend({
                mode: p,
                padding: y
            }),
            reset: function() {
                l.reset.call(this);
                var t = this.cfg
                  , e = t.iv
                  , n = t.mode;
                if (this._xformMode == this._ENC_XFORM_MODE)
                    var r = n.createEncryptor;
                else {
                    var r = n.createDecryptor;
                    this._minBufferSize = 1
                }
                this._mode && this._mode.__creator == r ? this._mode.init(this, e && e.words) : (this._mode = r.call(n, this, e && e.words),
                this._mode.__creator = r)
            },
            _doProcessBlock: function(t, e) {
                this._mode.processBlock(t, e)
            },
            _doFinalize: function() {
                var t = this.cfg.padding;
                if (this._xformMode == this._ENC_XFORM_MODE) {
                    t.pad(this._data, this.blockSize);
                    var e = this._process(!0)
                } else {
                    var e = this._process(!0);
                    t.unpad(e)
                }
                return e
            },
            blockSize: 4
        }),
        n.CipherParams = i.extend({
            init: function(t) {
                this.mixIn(t)
            },
            toString: function(t) {
                return (t || this.formatter).stringify(this)
            }
        }))
          , g = e.format = {}
          , m = g.OpenSSL = {
            stringify: function(t) {
                var e = t.ciphertext
                  , n = t.salt;
                if (n)
                    var r = o.create([1398893684, 1701076831]).concat(n).concat(e);
                else
                    var r = e;
                return r.toString(s)
            },
            parse: function(t) {
                var e = s.parse(t)
                  , n = e.words;
                if (1398893684 == n[0] && 1701076831 == n[1]) {
                    var r = o.create(n.slice(2, 4));
                    n.splice(0, 4),
                    e.sigBytes -= 16
                }
                return _.create({
                    ciphertext: e,
                    salt: r
                })
            }
        }
          , w = n.SerializableCipher = i.extend({
            cfg: i.extend({
                format: m
            }),
            encrypt: function(t, e, n, r) {
                r = this.cfg.extend(r);
                var i = t.createEncryptor(n, r)
                  , o = i.finalize(e)
                  , a = i.cfg;
                return _.create({
                    ciphertext: o,
                    key: n,
                    iv: a.iv,
                    algorithm: t,
                    mode: a.mode,
                    padding: a.padding,
                    blockSize: t.blockSize,
                    formatter: r.format
                })
            },
            decrypt: function(t, e, n, r) {
                r = this.cfg.extend(r),
                e = this._parse(e, r.format);
                var i = t.createDecryptor(n, r).finalize(e.ciphertext);
                return i
            },
            _parse: function(t, e) {
                return "string" == typeof t ? e.parse(t, this) : t
            }
        })
          , b = e.kdf = {}
          , x = b.OpenSSL = {
            execute: function(t, e, n, r) {
                r || (r = o.random(8));
                var i = f.create({
                    keySize: e + n
                }).compute(t, r)
                  , a = o.create(i.words.slice(e), 4 * n);
                return i.sigBytes = 4 * e,
                _.create({
                    key: i,
                    iv: a,
                    salt: r
                })
            }
        }
          , k = n.PasswordBasedCipher = w.extend({
            cfg: w.cfg.extend({
                kdf: x
            }),
            encrypt: function(t, e, n, r) {
                var i = (r = this.cfg.extend(r)).kdf.execute(n, t.keySize, t.ivSize);
                r.iv = i.iv;
                var o = w.encrypt.call(this, t, e, i.key, r);
                return o.mixIn(i),
                o
            },
            decrypt: function(t, e, n, r) {
                r = this.cfg.extend(r),
                e = this._parse(e, r.format);
                var i = r.kdf.execute(n, t.keySize, t.ivSize, e.salt);
                r.iv = i.iv;
                var o = w.decrypt.call(this, t, e, i.key, r);
                return o
            }
        })
    }()))
}
, function(t, e) {
    var n = t.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();
    "number" == typeof __g && (__g = n)
}
, function(t, e, n) {
    var r = n(17)("wks")
      , i = n(18)
      , o = n(2).Symbol
      , a = "function" == typeof o;
    (t.exports = function(t) {
        return r[t] || (r[t] = a && o[t] || (a ? o : i)("Symbol." + t))
    }
    ).store = r
}
, function(t, e, n) {
    var r, i, o, a, c, s, u, f;
    t.exports = (r = n(0),
    n(23),
    n(24),
    o = (i = r).lib,
    a = o.Base,
    c = o.WordArray,
    s = i.algo,
    u = s.MD5,
    f = s.EvpKDF = a.extend({
        cfg: a.extend({
            keySize: 4,
            hasher: u,
            iterations: 1
        }),
        init: function(t) {
            this.cfg = this.cfg.extend(t)
        },
        compute: function(t, e) {
            for (var n = this.cfg, r = n.hasher.create(), i = c.create(), o = i.words, a = n.keySize, s = n.iterations; o.length < a; ) {
                u && r.update(u);
                var u = r.update(t).finalize(e);
                r.reset();
                for (var f = 1; f < s; f++)
                    u = r.finalize(u),
                    r.reset();
                i.concat(u)
            }
            return i.sigBytes = 4 * a,
            i
        }
    }),
    i.EvpKDF = function(t, e, n) {
        return f.create(n).compute(t, e)
    }
    ,
    r.EvpKDF)
}
, function(t, e) {
    t.exports = function(t) {
        return "object" == typeof t ? null !== t : "function" == typeof t
    }
}
, function(t, e, n) {
    var r, i, o;
    t.exports = (r = n(0),
    o = (i = r).lib.WordArray,
    i.enc.Base64 = {
        stringify: function(t) {
            var e = t.words
              , n = t.sigBytes
              , r = this._map;
            t.clamp();
            for (var i = [], o = 0; o < n; o += 3)
                for (var a = (e[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (e[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | e[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, c = 0; c < 4 && o + .75 * c < n; c++)
                    i.push(r.charAt(a >>> 6 * (3 - c) & 63));
            var s = r.charAt(64);
            if (s)
                for (; i.length % 4; )
                    i.push(s);
            return i.join("")
        },
        parse: function(t) {
            var e = t.length
              , n = this._map
              , r = this._reverseMap;
            if (!r) {
                r = this._reverseMap = [];
                for (var i = 0; i < n.length; i++)
                    r[n.charCodeAt(i)] = i
            }
            var a = n.charAt(64);
            if (a) {
                var c = t.indexOf(a);
                -1 !== c && (e = c)
            }
            return function(t, e, n) {
                for (var r = [], i = 0, a = 0; a < e; a++)
                    if (a % 4) {
                        var c = n[t.charCodeAt(a - 1)] << a % 4 * 2
                          , s = n[t.charCodeAt(a)] >>> 6 - a % 4 * 2;
                        r[i >>> 2] |= (c | s) << 24 - i % 4 * 8,
                        i++
                    }
                return o.create(r, i)
            }(t, e, r)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    },
    r.enc.Base64)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    function(t) {
        var e = r
          , n = e.lib
          , i = n.WordArray
          , o = n.Hasher
          , a = e.algo
          , c = [];
        !function() {
            for (var e = 0; e < 64; e++)
                c[e] = 4294967296 * t.abs(t.sin(e + 1)) | 0
        }();
        var s = a.MD5 = o.extend({
            _doReset: function() {
                this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878])
            },
            _doProcessBlock: function(t, e) {
                for (var n = 0; n < 16; n++) {
                    var r = e + n
                      , i = t[r];
                    t[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
                }
                var o = this._hash.words
                  , a = t[e + 0]
                  , s = t[e + 1]
                  , d = t[e + 2]
                  , p = t[e + 3]
                  , v = t[e + 4]
                  , y = t[e + 5]
                  , _ = t[e + 6]
                  , g = t[e + 7]
                  , m = t[e + 8]
                  , w = t[e + 9]
                  , b = t[e + 10]
                  , x = t[e + 11]
                  , k = t[e + 12]
                  , S = t[e + 13]
                  , B = t[e + 14]
                  , C = t[e + 15]
                  , A = o[0]
                  , E = o[1]
                  , H = o[2]
                  , M = o[3];
                A = u(A, E, H, M, a, 7, c[0]),
                M = u(M, A, E, H, s, 12, c[1]),
                H = u(H, M, A, E, d, 17, c[2]),
                E = u(E, H, M, A, p, 22, c[3]),
                A = u(A, E, H, M, v, 7, c[4]),
                M = u(M, A, E, H, y, 12, c[5]),
                H = u(H, M, A, E, _, 17, c[6]),
                E = u(E, H, M, A, g, 22, c[7]),
                A = u(A, E, H, M, m, 7, c[8]),
                M = u(M, A, E, H, w, 12, c[9]),
                H = u(H, M, A, E, b, 17, c[10]),
                E = u(E, H, M, A, x, 22, c[11]),
                A = u(A, E, H, M, k, 7, c[12]),
                M = u(M, A, E, H, S, 12, c[13]),
                H = u(H, M, A, E, B, 17, c[14]),
                A = f(A, E = u(E, H, M, A, C, 22, c[15]), H, M, s, 5, c[16]),
                M = f(M, A, E, H, _, 9, c[17]),
                H = f(H, M, A, E, x, 14, c[18]),
                E = f(E, H, M, A, a, 20, c[19]),
                A = f(A, E, H, M, y, 5, c[20]),
                M = f(M, A, E, H, b, 9, c[21]),
                H = f(H, M, A, E, C, 14, c[22]),
                E = f(E, H, M, A, v, 20, c[23]),
                A = f(A, E, H, M, w, 5, c[24]),
                M = f(M, A, E, H, B, 9, c[25]),
                H = f(H, M, A, E, p, 14, c[26]),
                E = f(E, H, M, A, m, 20, c[27]),
                A = f(A, E, H, M, S, 5, c[28]),
                M = f(M, A, E, H, d, 9, c[29]),
                H = f(H, M, A, E, g, 14, c[30]),
                A = l(A, E = f(E, H, M, A, k, 20, c[31]), H, M, y, 4, c[32]),
                M = l(M, A, E, H, m, 11, c[33]),
                H = l(H, M, A, E, x, 16, c[34]),
                E = l(E, H, M, A, B, 23, c[35]),
                A = l(A, E, H, M, s, 4, c[36]),
                M = l(M, A, E, H, v, 11, c[37]),
                H = l(H, M, A, E, g, 16, c[38]),
                E = l(E, H, M, A, b, 23, c[39]),
                A = l(A, E, H, M, S, 4, c[40]),
                M = l(M, A, E, H, a, 11, c[41]),
                H = l(H, M, A, E, p, 16, c[42]),
                E = l(E, H, M, A, _, 23, c[43]),
                A = l(A, E, H, M, w, 4, c[44]),
                M = l(M, A, E, H, k, 11, c[45]),
                H = l(H, M, A, E, C, 16, c[46]),
                A = h(A, E = l(E, H, M, A, d, 23, c[47]), H, M, a, 6, c[48]),
                M = h(M, A, E, H, g, 10, c[49]),
                H = h(H, M, A, E, B, 15, c[50]),
                E = h(E, H, M, A, y, 21, c[51]),
                A = h(A, E, H, M, k, 6, c[52]),
                M = h(M, A, E, H, p, 10, c[53]),
                H = h(H, M, A, E, b, 15, c[54]),
                E = h(E, H, M, A, s, 21, c[55]),
                A = h(A, E, H, M, m, 6, c[56]),
                M = h(M, A, E, H, C, 10, c[57]),
                H = h(H, M, A, E, _, 15, c[58]),
                E = h(E, H, M, A, S, 21, c[59]),
                A = h(A, E, H, M, v, 6, c[60]),
                M = h(M, A, E, H, x, 10, c[61]),
                H = h(H, M, A, E, d, 15, c[62]),
                E = h(E, H, M, A, w, 21, c[63]),
                o[0] = o[0] + A | 0,
                o[1] = o[1] + E | 0,
                o[2] = o[2] + H | 0,
                o[3] = o[3] + M | 0
            },
            _doFinalize: function() {
                var e = this._data
                  , n = e.words
                  , r = 8 * this._nDataBytes
                  , i = 8 * e.sigBytes;
                n[i >>> 5] |= 128 << 24 - i % 32;
                var o = t.floor(r / 4294967296)
                  , a = r;
                n[15 + (i + 64 >>> 9 << 4)] = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                n[14 + (i + 64 >>> 9 << 4)] = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
                e.sigBytes = 4 * (n.length + 1),
                this._process();
                for (var c = this._hash, s = c.words, u = 0; u < 4; u++) {
                    var f = s[u];
                    s[u] = 16711935 & (f << 8 | f >>> 24) | 4278255360 & (f << 24 | f >>> 8)
                }
                return c
            },
            clone: function() {
                var t = o.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        });
        function u(t, e, n, r, i, o, a) {
            var c = t + (e & n | ~e & r) + i + a;
            return (c << o | c >>> 32 - o) + e
        }
        function f(t, e, n, r, i, o, a) {
            var c = t + (e & r | n & ~r) + i + a;
            return (c << o | c >>> 32 - o) + e
        }
        function l(t, e, n, r, i, o, a) {
            var c = t + (e ^ n ^ r) + i + a;
            return (c << o | c >>> 32 - o) + e
        }
        function h(t, e, n, r, i, o, a) {
            var c = t + (n ^ (e | ~r)) + i + a;
            return (c << o | c >>> 32 - o) + e
        }
        e.MD5 = o._createHelper(s),
        e.HmacMD5 = o._createHmacHelper(s)
    }(Math),
    r.MD5)
}
, function(t, e, n) {
    var r = n(12);
    t.exports = function(t, e, n) {
        if (r(t),
        void 0 === e)
            return t;
        switch (n) {
        case 1:
            return function(n) {
                return t.call(e, n)
            }
            ;
        case 2:
            return function(n, r) {
                return t.call(e, n, r)
            }
            ;
        case 3:
            return function(n, r, i) {
                return t.call(e, n, r, i)
            }
        }
        return function() {
            return t.apply(e, arguments)
        }
    }
}
, function(t, e) {
    var n = {}.toString;
    t.exports = function(t) {
        return n.call(t).slice(8, -1)
    }
}
, function(t, e) {
    var n = t.exports = {
        version: "2.6.5"
    };
    "number" == typeof __e && (__e = n)
}
, function(t, e, n) {
    var r = n(5);
    t.exports = function(t) {
        if (!r(t))
            throw TypeError(t + " is not an object!");
        return t
    }
}
, function(t, e) {
    t.exports = function(t) {
        if ("function" != typeof t)
            throw TypeError(t + " is not a function!");
        return t
    }
}
, function(t, e, n) {
    var r = n(2)
      , i = n(10)
      , o = n(27)
      , a = n(29)
      , c = n(8)
      , s = function(t, e, n) {
        var u, f, l, h, d = t & s.F, p = t & s.G, v = t & s.S, y = t & s.P, _ = t & s.B, g = p ? r : v ? r[e] || (r[e] = {}) : (r[e] || {}).prototype, m = p ? i : i[e] || (i[e] = {}), w = m.prototype || (m.prototype = {});
        for (u in p && (n = e),
        n)
            l = ((f = !d && g && void 0 !== g[u]) ? g : n)[u],
            h = _ && f ? c(l, r) : y && "function" == typeof l ? c(Function.call, l) : l,
            g && a(g, u, l, t & s.U),
            m[u] != l && o(m, u, h),
            y && w[u] != l && (w[u] = l)
    };
    r.core = i,
    s.F = 1,
    s.G = 2,
    s.S = 4,
    s.P = 8,
    s.B = 16,
    s.W = 32,
    s.U = 64,
    s.R = 128,
    t.exports = s
}
, function(t, e, n) {
    t.exports = !n(15)(function() {
        return 7 != Object.defineProperty({}, "a", {
            get: function() {
                return 7
            }
        }).a
    })
}
, function(t, e) {
    t.exports = function(t) {
        try {
            return !!t()
        } catch (t) {
            return !0
        }
    }
}
, function(t, e, n) {
    var r, i, o, a, c, s;
    t.exports = (r = n(0),
    o = (i = r).lib,
    a = o.Base,
    c = o.WordArray,
    (s = i.x64 = {}).Word = a.extend({
        init: function(t, e) {
            this.high = t,
            this.low = e
        }
    }),
    s.WordArray = a.extend({
        init: function(t, e) {
            t = this.words = t || [],
            this.sigBytes = null != e ? e : 8 * t.length
        },
        toX32: function() {
            for (var t = this.words, e = t.length, n = [], r = 0; r < e; r++) {
                var i = t[r];
                n.push(i.high),
                n.push(i.low)
            }
            return c.create(n, this.sigBytes)
        },
        clone: function() {
            for (var t = a.clone.call(this), e = t.words = this.words.slice(0), n = e.length, r = 0; r < n; r++)
                e[r] = e[r].clone();
            return t
        }
    }),
    r)
}
, function(t, e, n) {
    var r = n(10)
      , i = n(2)
      , o = i["__core-js_shared__"] || (i["__core-js_shared__"] = {});
    (t.exports = function(t, e) {
        return o[t] || (o[t] = void 0 !== e ? e : {})
    }
    )("versions", []).push({
        version: r.version,
        mode: n(25) ? "pure" : "global",
        copyright: "? 2019 Denis Pushkarev (zloirock.ru)"
    })
}
, function(t, e) {
    var n = 0
      , r = Math.random();
    t.exports = function(t) {
        return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++n + r).toString(36))
    }
}
, function(t, e, n) {
    var r = n(11)
      , i = n(47)
      , o = n(48)
      , a = Object.defineProperty;
    e.f = n(14) ? Object.defineProperty : function(t, e, n) {
        if (r(t),
        e = o(e, !0),
        r(n),
        i)
            try {
                return a(t, e, n)
            } catch (t) {}
        if ("get"in n || "set"in n)
            throw TypeError("Accessors not supported!");
        return "value"in n && (t[e] = n.value),
        t
    }
}
, function(t, e) {
    var n = {}.hasOwnProperty;
    t.exports = function(t, e) {
        return n.call(t, e)
    }
}
, function(t, e, n) {
    var r = n(31)
      , i = Math.min;
    t.exports = function(t) {
        return t > 0 ? i(r(t), 9007199254740991) : 0
    }
}
, function(t, e, n) {
    var r = n(9);
    t.exports = Object("z").propertyIsEnumerable(0) ? Object : function(t) {
        return "String" == r(t) ? t.split("") : Object(t)
    }
}
, function(t, e, n) {
    var r, i, o, a, c, s, u, f;
    t.exports = (r = n(0),
    o = (i = r).lib,
    a = o.WordArray,
    c = o.Hasher,
    s = i.algo,
    u = [],
    f = s.SHA1 = c.extend({
        _doReset: function() {
            this._hash = new a.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        },
        _doProcessBlock: function(t, e) {
            for (var n = this._hash.words, r = n[0], i = n[1], o = n[2], a = n[3], c = n[4], s = 0; s < 80; s++) {
                if (s < 16)
                    u[s] = 0 | t[e + s];
                else {
                    var f = u[s - 3] ^ u[s - 8] ^ u[s - 14] ^ u[s - 16];
                    u[s] = f << 1 | f >>> 31
                }
                var l = (r << 5 | r >>> 27) + c + u[s];
                l += s < 20 ? 1518500249 + (i & o | ~i & a) : s < 40 ? 1859775393 + (i ^ o ^ a) : s < 60 ? (i & o | i & a | o & a) - 1894007588 : (i ^ o ^ a) - 899497514,
                c = a,
                a = o,
                o = i << 30 | i >>> 2,
                i = r,
                r = l
            }
            n[0] = n[0] + r | 0,
            n[1] = n[1] + i | 0,
            n[2] = n[2] + o | 0,
            n[3] = n[3] + a | 0,
            n[4] = n[4] + c | 0
        },
        _doFinalize: function() {
            var t = this._data
              , e = t.words
              , n = 8 * this._nDataBytes
              , r = 8 * t.sigBytes;
            return e[r >>> 5] |= 128 << 24 - r % 32,
            e[14 + (r + 64 >>> 9 << 4)] = Math.floor(n / 4294967296),
            e[15 + (r + 64 >>> 9 << 4)] = n,
            t.sigBytes = 4 * e.length,
            this._process(),
            this._hash
        },
        clone: function() {
            var t = c.clone.call(this);
            return t._hash = this._hash.clone(),
            t
        }
    }),
    i.SHA1 = c._createHelper(f),
    i.HmacSHA1 = c._createHmacHelper(f),
    r.SHA1)
}
, function(t, e, n) {
    var r, i, o, a, c, s, u;
    t.exports = (r = n(0),
    o = (i = r).lib,
    a = o.Base,
    c = i.enc,
    s = c.Utf8,
    u = i.algo,
    void (u.HMAC = a.extend({
        init: function(t, e) {
            t = this._hasher = new t.init,
            "string" == typeof e && (e = s.parse(e));
            var n = t.blockSize
              , r = 4 * n;
            e.sigBytes > r && (e = t.finalize(e)),
            e.clamp();
            for (var i = this._oKey = e.clone(), o = this._iKey = e.clone(), a = i.words, c = o.words, u = 0; u < n; u++)
                a[u] ^= 1549556828,
                c[u] ^= 909522486;
            i.sigBytes = o.sigBytes = r,
            this.reset()
        },
        reset: function() {
            var t = this._hasher;
            t.reset(),
            t.update(this._iKey)
        },
        update: function(t) {
            return this._hasher.update(t),
            this
        },
        finalize: function(t) {
            var e = this._hasher
              , n = e.finalize(t);
            e.reset();
            var r = e.finalize(this._oKey.clone().concat(n));
            return r
        }
    })))
}
, function(t, e) {
    t.exports = !1
}
, function(t, e, n) {
    var r = n(9)
      , i = n(3)("toStringTag")
      , o = "Arguments" == r(function() {
        return arguments
    }());
    t.exports = function(t) {
        var e, n, a;
        return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (n = function(t, e) {
            try {
                return t[e]
            } catch (t) {}
        }(e = Object(t), i)) ? n : o ? r(e) : "Object" == (a = r(e)) && "function" == typeof e.callee ? "Arguments" : a
    }
}
, function(t, e, n) {
    var r = n(19)
      , i = n(49);
    t.exports = n(14) ? function(t, e, n) {
        return r.f(t, e, i(1, n))
    }
    : function(t, e, n) {
        return t[e] = n,
        t
    }
}
, function(t, e, n) {
    var r = n(5)
      , i = n(2).document
      , o = r(i) && r(i.createElement);
    t.exports = function(t) {
        return o ? i.createElement(t) : {}
    }
}
, function(t, e, n) {
    var r = n(2)
      , i = n(27)
      , o = n(20)
      , a = n(18)("src")
      , c = n(50)
      , s = ("" + c).split("toString");
    n(10).inspectSource = function(t) {
        return c.call(t)
    }
    ,
    (t.exports = function(t, e, n, c) {
        var u = "function" == typeof n;
        u && (o(n, "name") || i(n, "name", e)),
        t[e] !== n && (u && (o(n, a) || i(n, a, t[e] ? "" + t[e] : s.join(String(e)))),
        t === r ? t[e] = n : c ? t[e] ? t[e] = n : i(t, e, n) : (delete t[e],
        i(t, e, n)))
    }
    )(Function.prototype, "toString", function() {
        return "function" == typeof this && this[a] || c.call(this)
    })
}
, function(t, e) {
    t.exports = {}
}
, function(t, e) {
    var n = Math.ceil
      , r = Math.floor;
    t.exports = function(t) {
        return isNaN(t = +t) ? 0 : (t > 0 ? r : n)(t)
    }
}
, function(t, e, n) {
    var r, i, o, a = n(8), c = n(57), s = n(58), u = n(28), f = n(2), l = f.process, h = f.setImmediate, d = f.clearImmediate, p = f.MessageChannel, v = f.Dispatch, y = 0, _ = {}, g = function() {
        var t = +this;
        if (_.hasOwnProperty(t)) {
            var e = _[t];
            delete _[t],
            e()
        }
    }, m = function(t) {
        g.call(t.data)
    };
    h && d || (h = function(t) {
        for (var e = [], n = 1; arguments.length > n; )
            e.push(arguments[n++]);
        return _[++y] = function() {
            c("function" == typeof t ? t : Function(t), e)
        }
        ,
        r(y),
        y
    }
    ,
    d = function(t) {
        delete _[t]
    }
    ,
    "process" == n(9)(l) ? r = function(t) {
        l.nextTick(a(g, t, 1))
    }
    : v && v.now ? r = function(t) {
        v.now(a(g, t, 1))
    }
    : p ? (o = (i = new p).port2,
    i.port1.onmessage = m,
    r = a(o.postMessage, o, 1)) : f.addEventListener && "function" == typeof postMessage && !f.importScripts ? (r = function(t) {
        f.postMessage(t + "", "*")
    }
    ,
    f.addEventListener("message", m, !1)) : r = "onreadystatechange"in u("script") ? function(t) {
        s.appendChild(u("script")).onreadystatechange = function() {
            s.removeChild(this),
            g.call(t)
        }
    }
    : function(t) {
        setTimeout(a(g, t, 1), 0)
    }
    ),
    t.exports = {
        set: h,
        clear: d
    }
}
, function(t, e, n) {
    "use strict";
    var r = n(12);
    function i(t) {
        var e, n;
        this.promise = new t(function(t, r) {
            if (void 0 !== e || void 0 !== n)
                throw TypeError("Bad Promise constructor");
            e = t,
            n = r
        }
        ),
        this.resolve = r(e),
        this.reject = r(n)
    }
    t.exports.f = function(t) {
        return new i(t)
    }
}
, function(t, e, n) {
    var r = n(22)
      , i = n(35);
    t.exports = function(t) {
        return r(i(t))
    }
}
, function(t, e) {
    t.exports = function(t) {
        if (null == t)
            throw TypeError("Can't call method on  " + t);
        return t
    }
}
, function(t, e, n) {
    var r = n(35);
    t.exports = function(t) {
        return Object(r(t))
    }
}
, function(t, e, n) {
    var r = n(8)
      , i = n(22)
      , o = n(36)
      , a = n(21)
      , c = n(78);
    t.exports = function(t, e) {
        var n = 1 == t
          , s = 2 == t
          , u = 3 == t
          , f = 4 == t
          , l = 6 == t
          , h = 5 == t || l
          , d = e || c;
        return function(e, c, p) {
            for (var v, y, _ = o(e), g = i(_), m = r(c, p, 3), w = a(g.length), b = 0, x = n ? d(e, w) : s ? d(e, 0) : void 0; w > b; b++)
                if ((h || b in g) && (y = m(v = g[b], b, _),
                t))
                    if (n)
                        x[b] = y;
                    else if (y)
                        switch (t) {
                        case 3:
                            return !0;
                        case 5:
                            return v;
                        case 6:
                            return b;
                        case 2:
                            x.push(v)
                        }
                    else if (f)
                        return !1;
            return l ? -1 : u || f ? f : x
        }
    }
}
, function(t, e, n) {
    "use strict";
    var r = n(15);
    t.exports = function(t, e) {
        return !!t && r(function() {
            e ? t.call(null, function() {}, 1) : t.call(null)
        })
    }
}
, function(t, e) {
    var n = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof window.msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto);
    if (n) {
        var r = new Uint8Array(16);
        t.exports = function() {
            return n(r),
            r
        }
    } else {
        var i = new Array(16);
        t.exports = function() {
            for (var t, e = 0; e < 16; e++)
                0 == (3 & e) && (t = 4294967296 * Math.random()),
                i[e] = t >>> ((3 & e) << 3) & 255;
            return i
        }
    }
}
, function(t, e) {
    for (var n = [], r = 0; r < 256; ++r)
        n[r] = (r + 256).toString(16).substr(1);
    t.exports = function(t, e) {
        var r = e || 0
          , i = n;
        return [i[t[r++]], i[t[r++]], i[t[r++]], i[t[r++]], "-", i[t[r++]], i[t[r++]], "-", i[t[r++]], i[t[r++]], "-", i[t[r++]], i[t[r++]], "-", i[t[r++]], i[t[r++]], i[t[r++]], i[t[r++]], i[t[r++]], i[t[r++]]].join("")
    }
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(16),
    n(83),
    n(84),
    n(6),
    n(7),
    n(23),
    n(42),
    n(85),
    n(43),
    n(86),
    n(87),
    n(88),
    n(24),
    n(89),
    n(4),
    n(1),
    n(90),
    n(91),
    n(92),
    n(93),
    n(94),
    n(95),
    n(96),
    n(97),
    n(98),
    n(99),
    n(100),
    n(101),
    n(102),
    n(103),
    n(104),
    n(105),
    r)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    function(t) {
        var e = r
          , n = e.lib
          , i = n.WordArray
          , o = n.Hasher
          , a = e.algo
          , c = []
          , s = [];
        !function() {
            function e(e) {
                for (var n = t.sqrt(e), r = 2; r <= n; r++)
                    if (!(e % r))
                        return !1;
                return !0
            }
            function n(t) {
                return 4294967296 * (t - (0 | t)) | 0
            }
            for (var r = 2, i = 0; i < 64; )
                e(r) && (i < 8 && (c[i] = n(t.pow(r, .5))),
                s[i] = n(t.pow(r, 1 / 3)),
                i++),
                r++
        }();
        var u = []
          , f = a.SHA256 = o.extend({
            _doReset: function() {
                this._hash = new i.init(c.slice(0))
            },
            _doProcessBlock: function(t, e) {
                for (var n = this._hash.words, r = n[0], i = n[1], o = n[2], a = n[3], c = n[4], f = n[5], l = n[6], h = n[7], d = 0; d < 64; d++) {
                    if (d < 16)
                        u[d] = 0 | t[e + d];
                    else {
                        var p = u[d - 15]
                          , v = (p << 25 | p >>> 7) ^ (p << 14 | p >>> 18) ^ p >>> 3
                          , y = u[d - 2]
                          , _ = (y << 15 | y >>> 17) ^ (y << 13 | y >>> 19) ^ y >>> 10;
                        u[d] = v + u[d - 7] + _ + u[d - 16]
                    }
                    var g = r & i ^ r & o ^ i & o
                      , m = (r << 30 | r >>> 2) ^ (r << 19 | r >>> 13) ^ (r << 10 | r >>> 22)
                      , w = h + ((c << 26 | c >>> 6) ^ (c << 21 | c >>> 11) ^ (c << 7 | c >>> 25)) + (c & f ^ ~c & l) + s[d] + u[d];
                    h = l,
                    l = f,
                    f = c,
                    c = a + w | 0,
                    a = o,
                    o = i,
                    i = r,
                    r = w + (m + g) | 0
                }
                n[0] = n[0] + r | 0,
                n[1] = n[1] + i | 0,
                n[2] = n[2] + o | 0,
                n[3] = n[3] + a | 0,
                n[4] = n[4] + c | 0,
                n[5] = n[5] + f | 0,
                n[6] = n[6] + l | 0,
                n[7] = n[7] + h | 0
            },
            _doFinalize: function() {
                var e = this._data
                  , n = e.words
                  , r = 8 * this._nDataBytes
                  , i = 8 * e.sigBytes;
                return n[i >>> 5] |= 128 << 24 - i % 32,
                n[14 + (i + 64 >>> 9 << 4)] = t.floor(r / 4294967296),
                n[15 + (i + 64 >>> 9 << 4)] = r,
                e.sigBytes = 4 * n.length,
                this._process(),
                this._hash
            },
            clone: function() {
                var t = o.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        });
        e.SHA256 = o._createHelper(f),
        e.HmacSHA256 = o._createHmacHelper(f)
    }(Math),
    r.SHA256)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(16),
    function() {
        var t = r
          , e = t.lib.Hasher
          , n = t.x64
          , i = n.Word
          , o = n.WordArray
          , a = t.algo;
        function c() {
            return i.create.apply(i, arguments)
        }
        var s = [c(1116352408, 3609767458), c(1899447441, 602891725), c(3049323471, 3964484399), c(3921009573, 2173295548), c(961987163, 4081628472), c(1508970993, 3053834265), c(2453635748, 2937671579), c(2870763221, 3664609560), c(3624381080, 2734883394), c(310598401, 1164996542), c(607225278, 1323610764), c(1426881987, 3590304994), c(1925078388, 4068182383), c(2162078206, 991336113), c(2614888103, 633803317), c(3248222580, 3479774868), c(3835390401, 2666613458), c(4022224774, 944711139), c(264347078, 2341262773), c(604807628, 2007800933), c(770255983, 1495990901), c(1249150122, 1856431235), c(1555081692, 3175218132), c(1996064986, 2198950837), c(2554220882, 3999719339), c(2821834349, 766784016), c(2952996808, 2566594879), c(3210313671, 3203337956), c(3336571891, 1034457026), c(3584528711, 2466948901), c(113926993, 3758326383), c(338241895, 168717936), c(666307205, 1188179964), c(773529912, 1546045734), c(1294757372, 1522805485), c(1396182291, 2643833823), c(1695183700, 2343527390), c(1986661051, 1014477480), c(2177026350, 1206759142), c(2456956037, 344077627), c(2730485921, 1290863460), c(2820302411, 3158454273), c(3259730800, 3505952657), c(3345764771, 106217008), c(3516065817, 3606008344), c(3600352804, 1432725776), c(4094571909, 1467031594), c(275423344, 851169720), c(430227734, 3100823752), c(506948616, 1363258195), c(659060556, 3750685593), c(883997877, 3785050280), c(958139571, 3318307427), c(1322822218, 3812723403), c(1537002063, 2003034995), c(1747873779, 3602036899), c(1955562222, 1575990012), c(2024104815, 1125592928), c(2227730452, 2716904306), c(2361852424, 442776044), c(2428436474, 593698344), c(2756734187, 3733110249), c(3204031479, 2999351573), c(3329325298, 3815920427), c(3391569614, 3928383900), c(3515267271, 566280711), c(3940187606, 3454069534), c(4118630271, 4000239992), c(116418474, 1914138554), c(174292421, 2731055270), c(289380356, 3203993006), c(460393269, 320620315), c(685471733, 587496836), c(852142971, 1086792851), c(1017036298, 365543100), c(1126000580, 2618297676), c(1288033470, 3409855158), c(1501505948, 4234509866), c(1607167915, 987167468), c(1816402316, 1246189591)]
          , u = [];
        !function() {
            for (var t = 0; t < 80; t++)
                u[t] = c()
        }();
        var f = a.SHA512 = e.extend({
            _doReset: function() {
                this._hash = new o.init([new i.init(1779033703,4089235720), new i.init(3144134277,2227873595), new i.init(1013904242,4271175723), new i.init(2773480762,1595750129), new i.init(1359893119,2917565137), new i.init(2600822924,725511199), new i.init(528734635,4215389547), new i.init(1541459225,327033209)])
            },
            _doProcessBlock: function(t, e) {
                for (var n = this._hash.words, r = n[0], i = n[1], o = n[2], a = n[3], c = n[4], f = n[5], l = n[6], h = n[7], d = r.high, p = r.low, v = i.high, y = i.low, _ = o.high, g = o.low, m = a.high, w = a.low, b = c.high, x = c.low, k = f.high, S = f.low, B = l.high, C = l.low, A = h.high, E = h.low, H = d, M = p, O = v, j = y, P = _, z = g, R = m, D = w, T = b, L = x, I = k, F = S, U = B, N = C, W = A, X = E, K = 0; K < 80; K++) {
                    var V = u[K];
                    if (K < 16)
                        var G = V.high = 0 | t[e + 2 * K]
                          , q = V.low = 0 | t[e + 2 * K + 1];
                    else {
                        var J = u[K - 15]
                          , Z = J.high
                          , Q = J.low
                          , $ = (Z >>> 1 | Q << 31) ^ (Z >>> 8 | Q << 24) ^ Z >>> 7
                          , Y = (Q >>> 1 | Z << 31) ^ (Q >>> 8 | Z << 24) ^ (Q >>> 7 | Z << 25)
                          , tt = u[K - 2]
                          , et = tt.high
                          , nt = tt.low
                          , rt = (et >>> 19 | nt << 13) ^ (et << 3 | nt >>> 29) ^ et >>> 6
                          , it = (nt >>> 19 | et << 13) ^ (nt << 3 | et >>> 29) ^ (nt >>> 6 | et << 26)
                          , ot = u[K - 7]
                          , at = ot.high
                          , ct = ot.low
                          , st = u[K - 16]
                          , ut = st.high
                          , ft = st.low;
                        G = (G = (G = $ + at + ((q = Y + ct) >>> 0 < Y >>> 0 ? 1 : 0)) + rt + ((q += it) >>> 0 < it >>> 0 ? 1 : 0)) + ut + ((q += ft) >>> 0 < ft >>> 0 ? 1 : 0),
                        V.high = G,
                        V.low = q
                    }
                    var lt, ht = T & I ^ ~T & U, dt = L & F ^ ~L & N, pt = H & O ^ H & P ^ O & P, vt = M & j ^ M & z ^ j & z, yt = (H >>> 28 | M << 4) ^ (H << 30 | M >>> 2) ^ (H << 25 | M >>> 7), _t = (M >>> 28 | H << 4) ^ (M << 30 | H >>> 2) ^ (M << 25 | H >>> 7), gt = (T >>> 14 | L << 18) ^ (T >>> 18 | L << 14) ^ (T << 23 | L >>> 9), mt = (L >>> 14 | T << 18) ^ (L >>> 18 | T << 14) ^ (L << 23 | T >>> 9), wt = s[K], bt = wt.high, xt = wt.low, kt = W + gt + ((lt = X + mt) >>> 0 < X >>> 0 ? 1 : 0), St = _t + vt;
                    W = U,
                    X = N,
                    U = I,
                    N = F,
                    I = T,
                    F = L,
                    T = R + (kt = (kt = (kt = kt + ht + ((lt += dt) >>> 0 < dt >>> 0 ? 1 : 0)) + bt + ((lt += xt) >>> 0 < xt >>> 0 ? 1 : 0)) + G + ((lt += q) >>> 0 < q >>> 0 ? 1 : 0)) + ((L = D + lt | 0) >>> 0 < D >>> 0 ? 1 : 0) | 0,
                    R = P,
                    D = z,
                    P = O,
                    z = j,
                    O = H,
                    j = M,
                    H = kt + (yt + pt + (St >>> 0 < _t >>> 0 ? 1 : 0)) + ((M = lt + St | 0) >>> 0 < lt >>> 0 ? 1 : 0) | 0
                }
                p = r.low = p + M,
                r.high = d + H + (p >>> 0 < M >>> 0 ? 1 : 0),
                y = i.low = y + j,
                i.high = v + O + (y >>> 0 < j >>> 0 ? 1 : 0),
                g = o.low = g + z,
                o.high = _ + P + (g >>> 0 < z >>> 0 ? 1 : 0),
                w = a.low = w + D,
                a.high = m + R + (w >>> 0 < D >>> 0 ? 1 : 0),
                x = c.low = x + L,
                c.high = b + T + (x >>> 0 < L >>> 0 ? 1 : 0),
                S = f.low = S + F,
                f.high = k + I + (S >>> 0 < F >>> 0 ? 1 : 0),
                C = l.low = C + N,
                l.high = B + U + (C >>> 0 < N >>> 0 ? 1 : 0),
                E = h.low = E + X,
                h.high = A + W + (E >>> 0 < X >>> 0 ? 1 : 0)
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , n = 8 * this._nDataBytes
                  , r = 8 * t.sigBytes;
                return e[r >>> 5] |= 128 << 24 - r % 32,
                e[30 + (r + 128 >>> 10 << 5)] = Math.floor(n / 4294967296),
                e[31 + (r + 128 >>> 10 << 5)] = n,
                t.sigBytes = 4 * e.length,
                this._process(),
                this._hash.toX32()
            },
            clone: function() {
                var t = e.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            },
            blockSize: 32
        });
        t.SHA512 = e._createHelper(f),
        t.HmacSHA512 = e._createHmacHelper(f)
    }(),
    r.SHA512)
}
, function(t, e, n) {
    var r, i, o = n(39), a = n(40), c = 0, s = 0;
    t.exports = function(t, e, n) {
        var u = e && n || 0
          , f = e || []
          , l = (t = t || {}).node || r
          , h = void 0 !== t.clockseq ? t.clockseq : i;
        if (null == l || null == h) {
            var d = o();
            null == l && (l = r = [1 | d[0], d[1], d[2], d[3], d[4], d[5]]),
            null == h && (h = i = 16383 & (d[6] << 8 | d[7]))
        }
        var p = void 0 !== t.msecs ? t.msecs : (new Date).getTime()
          , v = void 0 !== t.nsecs ? t.nsecs : s + 1
          , y = p - c + (v - s) / 1e4;
        if (y < 0 && void 0 === t.clockseq && (h = h + 1 & 16383),
        (y < 0 || p > c) && void 0 === t.nsecs && (v = 0),
        v >= 1e4)
            throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
        c = p,
        s = v,
        i = h;
        var _ = (1e4 * (268435455 & (p += 122192928e5)) + v) % 4294967296;
        f[u++] = _ >>> 24 & 255,
        f[u++] = _ >>> 16 & 255,
        f[u++] = _ >>> 8 & 255,
        f[u++] = 255 & _;
        var g = p / 4294967296 * 1e4 & 268435455;
        f[u++] = g >>> 8 & 255,
        f[u++] = 255 & g,
        f[u++] = g >>> 24 & 15 | 16,
        f[u++] = g >>> 16 & 255,
        f[u++] = h >>> 8 | 128,
        f[u++] = 255 & h;
        for (var m = 0; m < 6; ++m)
            f[u + m] = l[m];
        return e || a(f)
    }
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    });
    var r = function() {
        function t(t, e) {
            for (var n, r = 0; r < e.length; r++)
                (n = e[r]).enumerable = n.enumerable || !1,
                n.configurable = !0,
                "value"in n && (n.writable = !0),
                Object.defineProperty(t, n.key, n)
        }
        return function(e, n, r) {
            return n && t(e.prototype, n),
            r && t(e, r),
            e
        }
    }()
      , i = n(82)
      , o = n(106)
      , a = s(n(41))
      , c = s(n(108));
    function s(t) {
        return t && t.__esModule ? t : {
            default: t
        }
    }
    function u(t, e, n) {
        return e in t ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }) : t[e] = n,
        t
    }
    function f(t, e) {
        if (t !== e)
            throw new TypeError("Cannot instantiate an arrow function")
    }
    var l = function() {
        function t(e) {
            var n = e.url
              , r = e.interval
              , i = void 0 === r ? 5e3 : r
              , o = e.type
              , a = void 0 === o ? "POST" : o
              , c = e.tickName
              , s = void 0 === c ? "tick" : c
              , u = e.durationName
              , f = void 0 === u ? "duration" : u
              , l = e.key
              , h = e.uid;
            (function(t, e) {
                if (!(t instanceof e))
                    throw new TypeError("Cannot call a class as a function")
            }
            )(this, t),
            this.tick = 0,
            this.tickName = s,
            this.durationName = f,
            this.interval = i,
            this.dot_url = n,
            this.dot_type = a,
            this.timer = null,
            this.focusType = "visibilityState",
            this.logs = [],
            this.key = l,
            this.uid = h
        }
        return r(t, [{
            key: "_focusTypeSettler",
            value: function() {
                var t = this;
                if ("normal" === this.focusType && ((0,
                i.addEvent)(window, "focus", function() {
                    f(this, t),
                    this._start()
                }
                .bind(this)),
                (0,
                i.addEvent)(window, "blur", function() {
                    f(this, t),
                    this._pause()
                }
                .bind(this))),
                "visibilityState" === this.focusType) {
                    var e = this;
                    (0,
                    i.pageVisibility)().visibilitychange(function() {
                        this.hidden ? e._pause() : e._start()
                    })
                }
            }
        }, {
            key: "_genLog",
            value: function() {
                var t, e = this, n = (this.interval,
                {});
                return this.logs.forEach(function(t) {
                    f(this, e),
                    "function" == typeof t && Object.assign(n, t())
                }
                .bind(this)),
                Object.assign(n, (u(t = {}, this.durationName, this._calcDuration()),
                u(t, "et", 0 === this.tick ? 1 : 2),
                u(t, "track_id", (0,
                c.default)()),
                u(t, "tm", (new Date).getTime()),
                t)),
                n
            }
        }, {
            key: "_calcDuration",
            value: function() {
                var t = this.interval / 1e3;
                return 0 === this.tick ? 0 : 0 == this.tick % t ? t : this.tick % t
            }
        }, {
            key: "_genSid",
            value: function(t) {
                return a.default.MD5(JSON.stringify(t), "utf-8").toString()
            }
        }, {
            key: "_dot",
            value: function(t) {
                var e = this;
                return window.AWSC ? (0,
                i.ajax)({
                    url: this.dot_url,
                    type: this.dot_type,
                    data: {
                        logs: JSON.stringify(t),
                        uid: this.uid,
                        token: (0,
                        i.getCookie)("token"),
                        sid: this._genSid(t),
                        uaToken: this.uabModule && this.uabModule.getUA(),
                        webUmidToken: this.webUmidToken
                    }
                }) : new Promise(function(n) {
                    f(this, e),
                    (0,
                    i.loadAwsc)(function(r, o) {
                        f(this, e),
                        this.uabModule = r,
                        this.webUmidToken = o,
                        (0,
                        i.ajax)({
                            url: this.dot_url,
                            type: this.dot_type,
                            data: {
                                logs: JSON.stringify(t),
                                uid: this.uid,
                                token: (0,
                                i.getCookie)("token"),
                                sid: this._genSid(t),
                                uaToken: this.uabModule && this.uabModule.getUA(),
                                webUmidToken: this.webUmidToken
                            }
                        }).then(function(t) {
                            f(this, e),
                            n(t)
                        }
                        .bind(this))
                    }
                    .bind(this))
                }
                .bind(this))
            }
        }, {
            key: "_start",
            value: function() {
                var t = this;
                if(!myblockedfun)//函数指针已经有了，就不在构造下列函数体
                {
                    myblockedfun=function()
                    {//3以下部分全部复制强国原函数体
                        f(this,t);
                        var e=this.interval/1e3,
                        n=(0,o.getLog)(this.key);
                        n||(this.tick=0),
                        n=this._genLog(),
                        (0,	o.setLog)(this.key,n),
                        0==this.tick%e&&0!==this.tick&&this._dot((0,
                        o.getLog)()).then(function()
                        {
                            f(this,t),
                            (0,
                            o.clearLog)()
                        }//myblockedfun函数体结束
                        .bind(this)),
                        this.tick++
                    }
                    .bind(this);//强国原始的是，在这里还有第2个参数，直接将定时器间隔秒传入，而这里目前只是单独把定时器需要执行的函数分离出来单独写成函数

                    myblockedfun.pointer=this;
                    myblockedfun.log=o;
                    myblockedfun.timer=setInterval(myblockedfun,1e3/times);//核心：强国原始是this.timer = setInterval(function(){},1e3);这里直接除去times，是注入js文头定义的初始变量
                    myblockedfun.stop=function()
                    {
                        clearInterval(timer);

                    }
                } //myblockedfun函数指针判断结束
            }//value: function()结束
        }, {
            key: "_pause",
            value: function() {
                clearInterval(this.timer)
            }
        }, {
            key: "addLog",
            value: function(t) {
                t && this.logs.push(t)
            }
        }, {
            key: "setType",
            value: function(t) {
                t && (this.focusType = t)
            }
        }, {
            key: "init",
            value: function() {
                var t = this;
                if (this.key) {
                    var e = this._genLog();
                    this.tick = 0,
                    e[this.durationName] = this._calcDuration(),
                    (0,
                    o.setLog)(this.key, e);
                    var n = function() {
                        f(this, t),
                        (0,
                        i.removeEvent)(document, "mousemove", n),
                        (0,
                        i.removeEvent)(document, "click", n),
                        (0,
                        i.removeEvent)(document, "scroll", n),
                        this._dot((0,
                        o.getLog)()).then(function() {
                            f(this, t),
                            (0,
                            o.clearLog)()
                        }
                        .bind(this)),
                        this.tick = 0,
                        this._start(),
                        this._focusTypeSettler()
                    }
                    .bind(this);
                    (0,
                    i.addEvent)(document, "mousemove", n),
                    (0,
                    i.addEvent)(document, "click", n),
                    (0,
                    i.addEvent)(document, "scroll", n)
                }
            }
        }, {
            key: "run",
            value: function() {
                var t = this
                  , e = 0
                  , n = setInterval(function() {
                    e++,
                    !window.globalCache || (clearInterval(n),
                    t.init()),
                    10 === e && clearInterval(n)
                }, 500)
            }
        }, {
            key: "reset",
            value: function() {
                clearInterval(this.timer),
                this.tick = 0,
                this.duration = 0,
                this.init()
            }
        }]),
        t
    }();
    e.default = l,
    t.exports = e.default
}
, function(t, e, n) {
    "use strict";
    var r, i, o, a, c = n(25), s = n(2), u = n(8), f = n(26), l = n(13), h = n(5), d = n(12), p = n(51), v = n(52), y = n(56), _ = n(32).set, g = n(59)(), m = n(33), w = n(60), b = n(61), x = n(62), k = s.TypeError, S = s.process, B = S && S.versions, C = B && B.v8 || "", A = s.Promise, E = "process" == f(S), H = function() {}, M = i = m.f, O = !!function() {
        try {
            var t = A.resolve(1)
              , e = (t.constructor = {})[n(3)("species")] = function(t) {
                t(H, H)
            }
            ;
            return (E || "function" == typeof PromiseRejectionEvent) && t.then(H)instanceof e && 0 !== C.indexOf("6.6") && -1 === b.indexOf("Chrome/66")
        } catch (t) {}
    }(), j = function(t) {
        var e;
        return !(!h(t) || "function" != typeof (e = t.then)) && e
    }, P = function(t, e) {
        if (!t._n) {
            t._n = !0;
            var n = t._c;
            g(function() {
                for (var r = t._v, i = 1 == t._s, o = 0, a = function(e) {
                    var n, o, a, c = i ? e.ok : e.fail, s = e.resolve, u = e.reject, f = e.domain;
                    try {
                        c ? (i || (2 == t._h && D(t),
                        t._h = 1),
                        !0 === c ? n = r : (f && f.enter(),
                        n = c(r),
                        f && (f.exit(),
                        a = !0)),
                        n === e.promise ? u(k("Promise-chain cycle")) : (o = j(n)) ? o.call(n, s, u) : s(n)) : u(r)
                    } catch (t) {
                        f && !a && f.exit(),
                        u(t)
                    }
                }; n.length > o; )
                    a(n[o++]);
                t._c = [],
                t._n = !1,
                e && !t._h && z(t)
            })
        }
    }, z = function(t) {
        _.call(s, function() {
            var e, n, r, i = t._v, o = R(t);
            if (o && (e = w(function() {
                E ? S.emit("unhandledRejection", i, t) : (n = s.onunhandledrejection) ? n({
                    promise: t,
                    reason: i
                }) : (r = s.console) && r.error && r.error("Unhandled promise rejection", i)
            }),
            t._h = E || R(t) ? 2 : 1),
            t._a = void 0,
            o && e.e)
                throw e.v
        })
    }, R = function(t) {
        return 1 !== t._h && 0 === (t._a || t._c).length
    }, D = function(t) {
        _.call(s, function() {
            var e;
            E ? S.emit("rejectionHandled", t) : (e = s.onrejectionhandled) && e({
                promise: t,
                reason: t._v
            })
        })
    }, T = function(t) {
        var e = this;
        e._d || (e._d = !0,
        (e = e._w || e)._v = t,
        e._s = 2,
        e._a || (e._a = e._c.slice()),
        P(e, !0))
    }, L = function(t) {
        var e, n = this;
        if (!n._d) {
            n._d = !0,
            n = n._w || n;
            try {
                if (n === t)
                    throw k("Promise can't be resolved itself");
                (e = j(t)) ? g(function() {
                    var r = {
                        _w: n,
                        _d: !1
                    };
                    try {
                        e.call(t, u(L, r, 1), u(T, r, 1))
                    } catch (t) {
                        T.call(r, t)
                    }
                }) : (n._v = t,
                n._s = 1,
                P(n, !1))
            } catch (t) {
                T.call({
                    _w: n,
                    _d: !1
                }, t)
            }
        }
    };
    O || (A = function(t) {
        p(this, A, "Promise", "_h"),
        d(t),
        r.call(this);
        try {
            t(u(L, this, 1), u(T, this, 1))
        } catch (t) {
            T.call(this, t)
        }
    }
    ,
    (r = function(t) {
        this._c = [],
        this._a = void 0,
        this._s = 0,
        this._d = !1,
        this._v = void 0,
        this._h = 0,
        this._n = !1
    }
    ).prototype = n(63)(A.prototype, {
        then: function(t, e) {
            var n = M(y(this, A));
            return n.ok = "function" != typeof t || t,
            n.fail = "function" == typeof e && e,
            n.domain = E ? S.domain : void 0,
            this._c.push(n),
            this._a && this._a.push(n),
            this._s && P(this, !1),
            n.promise
        },
        catch: function(t) {
            return this.then(void 0, t)
        }
    }),
    o = function() {
        var t = new r;
        this.promise = t,
        this.resolve = u(L, t, 1),
        this.reject = u(T, t, 1)
    }
    ,
    m.f = M = function(t) {
        return t === A || t === a ? new o(t) : i(t)
    }
    ),
    l(l.G + l.W + l.F * !O, {
        Promise: A
    }),
    n(64)(A, "Promise"),
    n(65)("Promise"),
    a = n(10).Promise,
    l(l.S + l.F * !O, "Promise", {
        reject: function(t) {
            var e = M(this);
            return (0,
            e.reject)(t),
            e.promise
        }
    }),
    l(l.S + l.F * (c || !O), "Promise", {
        resolve: function(t) {
            return x(c && this === a ? A : this, t)
        }
    }),
    l(l.S + l.F * !(O && n(66)(function(t) {
        A.all(t).catch(H)
    })), "Promise", {
        all: function(t) {
            var e = this
              , n = M(e)
              , r = n.resolve
              , i = n.reject
              , o = w(function() {
                var n = []
                  , o = 0
                  , a = 1;
                v(t, !1, function(t) {
                    var c = o++
                      , s = !1;
                    n.push(void 0),
                    a++,
                    e.resolve(t).then(function(t) {
                        s || (s = !0,
                        n[c] = t,
                        --a || r(n))
                    }, i)
                }),
                --a || r(n)
            });
            return o.e && i(o.v),
            n.promise
        },
        race: function(t) {
            var e = this
              , n = M(e)
              , r = n.reject
              , i = w(function() {
                v(t, !1, function(t) {
                    e.resolve(t).then(n.resolve, r)
                })
            });
            return i.e && r(i.v),
            n.promise
        }
    })
}
, function(t, e, n) {
    t.exports = !n(14) && !n(15)(function() {
        return 7 != Object.defineProperty(n(28)("div"), "a", {
            get: function() {
                return 7
            }
        }).a
    })
}
, function(t, e, n) {
    var r = n(5);
    t.exports = function(t, e) {
        if (!r(t))
            return t;
        var n, i;
        if (e && "function" == typeof (n = t.toString) && !r(i = n.call(t)))
            return i;
        if ("function" == typeof (n = t.valueOf) && !r(i = n.call(t)))
            return i;
        if (!e && "function" == typeof (n = t.toString) && !r(i = n.call(t)))
            return i;
        throw TypeError("Can't convert object to primitive value")
    }
}
, function(t, e) {
    t.exports = function(t, e) {
        return {
            enumerable: !(1 & t),
            configurable: !(2 & t),
            writable: !(4 & t),
            value: e
        }
    }
}
, function(t, e, n) {
    t.exports = n(17)("native-function-to-string", Function.toString)
}
, function(t, e) {
    t.exports = function(t, e, n, r) {
        if (!(t instanceof e) || void 0 !== r && r in t)
            throw TypeError(n + ": incorrect invocation!");
        return t
    }
}
, function(t, e, n) {
    var r = n(8)
      , i = n(53)
      , o = n(54)
      , a = n(11)
      , c = n(21)
      , s = n(55)
      , u = {}
      , f = {};
    (e = t.exports = function(t, e, n, l, h) {
        var d, p, v, y, _ = h ? function() {
            return t
        }
        : s(t), g = r(n, l, e ? 2 : 1), m = 0;
        if ("function" != typeof _)
            throw TypeError(t + " is not iterable!");
        if (o(_)) {
            for (d = c(t.length); d > m; m++)
                if ((y = e ? g(a(p = t[m])[0], p[1]) : g(t[m])) === u || y === f)
                    return y
        } else
            for (v = _.call(t); !(p = v.next()).done; )
                if ((y = i(v, g, p.value, e)) === u || y === f)
                    return y
    }
    ).BREAK = u,
    e.RETURN = f
}
, function(t, e, n) {
    var r = n(11);
    t.exports = function(t, e, n, i) {
        try {
            return i ? e(r(n)[0], n[1]) : e(n)
        } catch (e) {
            var o = t.return;
            throw void 0 !== o && r(o.call(t)),
            e
        }
    }
}
, function(t, e, n) {
    var r = n(30)
      , i = n(3)("iterator")
      , o = Array.prototype;
    t.exports = function(t) {
        return void 0 !== t && (r.Array === t || o[i] === t)
    }
}
, function(t, e, n) {
    var r = n(26)
      , i = n(3)("iterator")
      , o = n(30);
    t.exports = n(10).getIteratorMethod = function(t) {
        if (null != t)
            return t[i] || t["@@iterator"] || o[r(t)]
    }
}
, function(t, e, n) {
    var r = n(11)
      , i = n(12)
      , o = n(3)("species");
    t.exports = function(t, e) {
        var n, a = r(t).constructor;
        return void 0 === a || null == (n = r(a)[o]) ? e : i(n)
    }
}
, function(t, e) {
    t.exports = function(t, e, n) {
        var r = void 0 === n;
        switch (e.length) {
        case 0:
            return r ? t() : t.call(n);
        case 1:
            return r ? t(e[0]) : t.call(n, e[0]);
        case 2:
            return r ? t(e[0], e[1]) : t.call(n, e[0], e[1]);
        case 3:
            return r ? t(e[0], e[1], e[2]) : t.call(n, e[0], e[1], e[2]);
        case 4:
            return r ? t(e[0], e[1], e[2], e[3]) : t.call(n, e[0], e[1], e[2], e[3])
        }
        return t.apply(n, e)
    }
}
, function(t, e, n) {
    var r = n(2).document;
    t.exports = r && r.documentElement
}
, function(t, e, n) {
    var r = n(2)
      , i = n(32).set
      , o = r.MutationObserver || r.WebKitMutationObserver
      , a = r.process
      , c = r.Promise
      , s = "process" == n(9)(a);
    t.exports = function() {
        var t, e, n, u = function() {
            var r, i;
            for (s && (r = a.domain) && r.exit(); t; ) {
                i = t.fn,
                t = t.next;
                try {
                    i()
                } catch (r) {
                    throw t ? n() : e = void 0,
                    r
                }
            }
            e = void 0,
            r && r.enter()
        };
        if (s)
            n = function() {
                a.nextTick(u)
            }
            ;
        else if (!o || r.navigator && r.navigator.standalone)
            if (c && c.resolve) {
                var f = c.resolve(void 0);
                n = function() {
                    f.then(u)
                }
            } else
                n = function() {
                    i.call(r, u)
                }
                ;
        else {
            var l = !0
              , h = document.createTextNode("");
            new o(u).observe(h, {
                characterData: !0
            }),
            n = function() {
                h.data = l = !l
            }
        }
        return function(r) {
            var i = {
                fn: r,
                next: void 0
            };
            e && (e.next = i),
            t || (t = i,
            n()),
            e = i
        }
    }
}
, function(t, e) {
    t.exports = function(t) {
        try {
            return {
                e: !1,
                v: t()
            }
        } catch (t) {
            return {
                e: !0,
                v: t
            }
        }
    }
}
, function(t, e, n) {
    var r = n(2).navigator;
    t.exports = r && r.userAgent || ""
}
, function(t, e, n) {
    var r = n(11)
      , i = n(5)
      , o = n(33);
    t.exports = function(t, e) {
        if (r(t),
        i(e) && e.constructor === t)
            return e;
        var n = o.f(t);
        return (0,
        n.resolve)(e),
        n.promise
    }
}
, function(t, e, n) {
    var r = n(29);
    t.exports = function(t, e, n) {
        for (var i in e)
            r(t, i, e[i], n);
        return t
    }
}
, function(t, e, n) {
    var r = n(19).f
      , i = n(20)
      , o = n(3)("toStringTag");
    t.exports = function(t, e, n) {
        t && !i(t = n ? t : t.prototype, o) && r(t, o, {
            configurable: !0,
            value: e
        })
    }
}
, function(t, e, n) {
    "use strict";
    var r = n(2)
      , i = n(19)
      , o = n(14)
      , a = n(3)("species");
    t.exports = function(t) {
        var e = r[t];
        o && e && !e[a] && i.f(e, a, {
            configurable: !0,
            get: function() {
                return this
            }
        })
    }
}
, function(t, e, n) {
    var r = n(3)("iterator")
      , i = !1;
    try {
        var o = [7][r]();
        o.return = function() {
            i = !0
        }
        ,
        Array.from(o, function() {
            throw 2
        })
    } catch (t) {}
    t.exports = function(t, e) {
        if (!e && !i)
            return !1;
        var n = !1;
        try {
            var o = [7]
              , a = o[r]();
            a.next = function() {
                return {
                    done: n = !0
                }
            }
            ,
            o[r] = function() {
                return a
            }
            ,
            t(o)
        } catch (t) {}
        return n
    }
}
, function(t, e, n) {
    var r = n(13);
    r(r.S + r.F, "Object", {
        assign: n(68)
    })
}
, function(t, e, n) {
    "use strict";
    var r = n(69)
      , i = n(75)
      , o = n(76)
      , a = n(36)
      , c = n(22)
      , s = Object.assign;
    t.exports = !s || n(15)(function() {
        var t = {}
          , e = {}
          , n = Symbol()
          , r = "abcdefghijklmnopqrst";
        return t[n] = 7,
        r.split("").forEach(function(t) {
            e[t] = t
        }),
        7 != s({}, t)[n] || Object.keys(s({}, e)).join("") != r
    }) ? function(t, e) {
        for (var n = a(t), s = arguments.length, u = 1, f = i.f, l = o.f; s > u; )
            for (var h, d = c(arguments[u++]), p = f ? r(d).concat(f(d)) : r(d), v = p.length, y = 0; v > y; )
                l.call(d, h = p[y++]) && (n[h] = d[h]);
        return n
    }
    : s
}
, function(t, e, n) {
    var r = n(70)
      , i = n(74);
    t.exports = Object.keys || function(t) {
        return r(t, i)
    }
}
, function(t, e, n) {
    var r = n(20)
      , i = n(34)
      , o = n(71)(!1)
      , a = n(73)("IE_PROTO");
    t.exports = function(t, e) {
        var n, c = i(t), s = 0, u = [];
        for (n in c)
            n != a && r(c, n) && u.push(n);
        for (; e.length > s; )
            r(c, n = e[s++]) && (~o(u, n) || u.push(n));
        return u
    }
}
, function(t, e, n) {
    var r = n(34)
      , i = n(21)
      , o = n(72);
    t.exports = function(t) {
        return function(e, n, a) {
            var c, s = r(e), u = i(s.length), f = o(a, u);
            if (t && n != n) {
                for (; u > f; )
                    if ((c = s[f++]) != c)
                        return !0
            } else
                for (; u > f; f++)
                    if ((t || f in s) && s[f] === n)
                        return t || f || 0;
            return !t && -1
        }
    }
}
, function(t, e, n) {
    var r = n(31)
      , i = Math.max
      , o = Math.min;
    t.exports = function(t, e) {
        return (t = r(t)) < 0 ? i(t + e, 0) : o(t, e)
    }
}
, function(t, e, n) {
    var r = n(17)("keys")
      , i = n(18);
    t.exports = function(t) {
        return r[t] || (r[t] = i(t))
    }
}
, function(t, e) {
    t.exports = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")
}
, function(t, e) {
    e.f = Object.getOwnPropertySymbols
}
, function(t, e) {
    e.f = {}.propertyIsEnumerable
}
, function(t, e, n) {
    "use strict";
    var r = n(13)
      , i = n(37)(0)
      , o = n(38)([].forEach, !0);
    r(r.P + r.F * !o, "Array", {
        forEach: function(t) {
            return i(this, t, arguments[1])
        }
    })
}
, function(t, e, n) {
    var r = n(79);
    t.exports = function(t, e) {
        return new (r(t))(e)
    }
}
, function(t, e, n) {
    var r = n(5)
      , i = n(80)
      , o = n(3)("species");
    t.exports = function(t) {
        var e;
        return i(t) && ("function" != typeof (e = t.constructor) || e !== Array && !i(e.prototype) || (e = void 0),
        r(e) && null === (e = e[o]) && (e = void 0)),
        void 0 === e ? Array : e
    }
}
, function(t, e, n) {
    var r = n(9);
    t.exports = Array.isArray || function(t) {
        return "Array" == r(t)
    }
}
, function(t, e, n) {
    "use strict";
    var r = n(13)
      , i = n(37)(1);
    r(r.P + r.F * !n(38)([].map, !0), "Array", {
        map: function(t) {
            return i(this, t, arguments[1])
        }
    })
}
, function(t, e, n) {
    "use strict";
    var r = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    }
    : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }
    ;
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    e.addEvent = function(t, e, n) {
        t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent("on" + e, n)
    }
    ,
    e.removeEvent = function(t, e, n) {
        t.removeEventListener ? t.removeEventListener(e, n, !1) : t.detachEvent("on" + e, n)
    }
    ,
    e.getKey = function t(e, n) {
        var r = "";
        if (n[e])
            return n[e];
        for (var i in n) {
            var o = n[i];
            if (c(o) && (r = t(e, o)),
            r)
                break
        }
        return r
    }
    ,
    e.getRefId = function(t) {
        var e = /\\/([^.|^\\/]+).html/gim.exec(t);
        return e ? e[1] : ""
    }
    ,
    e.getUrlIds = function(t) {
        var e = /http(?:s)?:\\/\\/.+\\.xuexi\\.cn\\/(\\w+)\\/(\\w+)\\.html/g.exec(t) || [];
        return {
            page_uuid: "https://www.xuexi.cn/" === t || "https://boot-www-pctest.xuexi.cn/index.html" === t ? "index" : e[1] || "",
            ref_id: e[2] || ""
        }
    }
    ,
    e.json2url = s,
    e.ajax = u,
    e.pageVisibility = function() {
        var t, e = function(t, e) {
            return "" === t ? e : t + e.slice(0, 1).toUpperCase() + e.slice(1)
        }, n = function() {
            var n = !1;
            return "number" == typeof window.screenX && ["webkit", "moz", "ms", "o", ""].forEach(function(r) {
                0 == n && null != document[e(r, "hidden")] && (t = r,
                n = !0)
            }),
            n
        }(), r = function() {
            return n ? document[e(t, "hidden")] : void 0
        }, i = function() {
            return n ? document[e(t, "visibilityState")] : void 0
        };
        return {
            isHidden: r,
            hidden: r(),
            visibilityState: i(),
            visibilitychange: function(e, o) {
                return !1,
                n && "function" == typeof e ? document.addEventListener(t + "visibilitychange", function(t) {
                    this.hidden = r(),
                    this.visibilityState = i(),
                    e.call(this, t)
                }
                .bind(this), !1) : void 0
            }
        }
    }
    ,
    e.getCookie = f,
    e.dot = function(t) {
        var e = t.url
          , n = t.type
          , r = void 0 === n ? "POST" : n
          , i = t.params
          , o = t.key
          , c = t.uid
          , s = function(t, e, n) {
            return e in t ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : t[e] = n,
            t
        }({}, o, i);
        return u({
            url: e,
            type: r,
            data: {
                logs: JSON.stringify(s),
                uid: c || f("__UID__"),
                token: f("token"),
                sid: a.default.MD5(JSON.stringify(s), "utf-8").toString()
            }
        })
    }
    ,
    e.loadAwsc = function(t) {
        !function(t, e) {
            var n = document.createElement("script");
            n.onload = e,
            n.src = t,
            document.body.appendChild(n)
        }(l, function() {
            var e, n;
            AWSC.use("uab", function(r, i) {
                "loaded" === r && (e = i,
                n && t(e, n))
            }),
            AWSC.use("um", function(r, i) {
                "loaded" === r && i.init({
                    appName: "saf-aliyun-com"
                }, function(r, i) {
                    "success" === r && (n = i.tn,
                    e && t(e, n))
                })
            })
        })
    }
    ;
    var i, o = n(41), a = (i = o) && i.__esModule ? i : {
        default: i
    };
    function c(t) {
        return null !== t && "object" === (void 0 === t ? "undefined" : r(t))
    }
    function s(t) {
        var e = [];
        for (var n in t.t = Math.random(),
        t)
            e.push(n + "=" + t[n]);
        return e.join("&")
    }
    function u(t) {
        var e = this;
        return new Promise(function(n, r) {
            if (function(t, e) {
                if (t !== e)
                    throw new TypeError("Cannot instantiate an arrow function")
            }(this, e),
            (t = t || {}).url) {
                var i;
                switch (t.type = t.type || "get",
                t.data = t.data || {},
                i = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
                t.type.toLowerCase()) {
                case "get":
                    i.open("GET", t.url + "?" + s(t.data), !0),
                    i.withCredentials = !0,
                    i.send();
                    break;
                case "post":
                    i.open("POST", t.url, !0),
                    i.withCredentials = !0,
                    i.setRequestHeader("Content-type", "application/json;charset=utf-8"),
                    i.send(JSON.stringify(t.data))
                }
                i.onreadystatechange = function() {
                    4 == i.readyState && (200 <= i.status && 300 > i.status || 304 == i.status ? n(JSON.parse(i.responseText)) : r(i.status))
                }
            }
        }
        .bind(this))
    }
    function f(t) {
        var e, n = new RegExp("(^| )" + t + "=([^;]*)(;|$)");
        return (e = document.cookie.match(n)) ? unescape(e[2]) : ""
    }
    var l = "//source.xuexi.cn/AWSC/AWSC/awsc.js"
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    function() {
        if ("function" == typeof ArrayBuffer) {
            var t = r.lib.WordArray
              , e = t.init;
            (t.init = function(t) {
                if (t instanceof ArrayBuffer && (t = new Uint8Array(t)),
                (t instanceof Int8Array || "undefined" != typeof Uint8ClampedArray && t instanceof Uint8ClampedArray || t instanceof Int16Array || t instanceof Uint16Array || t instanceof Int32Array || t instanceof Uint32Array || t instanceof Float32Array || t instanceof Float64Array) && (t = new Uint8Array(t.buffer,t.byteOffset,t.byteLength)),
                t instanceof Uint8Array) {
                    for (var n = t.byteLength, r = [], i = 0; i < n; i++)
                        r[i >>> 2] |= t[i] << 24 - i % 4 * 8;
                    e.call(this, r, n)
                } else
                    e.apply(this, arguments)
            }
            ).prototype = t
        }
    }(),
    r.lib.WordArray)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    function() {
        var t = r
          , e = t.lib.WordArray
          , n = t.enc;
        function i(t) {
            return t << 8 & 4278255360 | t >>> 8 & 16711935
        }
        n.Utf16 = n.Utf16BE = {
            stringify: function(t) {
                for (var e = t.words, n = t.sigBytes, r = [], i = 0; i < n; i += 2) {
                    var o = e[i >>> 2] >>> 16 - i % 4 * 8 & 65535;
                    r.push(String.fromCharCode(o))
                }
                return r.join("")
            },
            parse: function(t) {
                for (var n = t.length, r = [], i = 0; i < n; i++)
                    r[i >>> 1] |= t.charCodeAt(i) << 16 - i % 2 * 16;
                return e.create(r, 2 * n)
            }
        },
        n.Utf16LE = {
            stringify: function(t) {
                for (var e = t.words, n = t.sigBytes, r = [], o = 0; o < n; o += 2) {
                    var a = i(e[o >>> 2] >>> 16 - o % 4 * 8 & 65535);
                    r.push(String.fromCharCode(a))
                }
                return r.join("")
            },
            parse: function(t) {
                for (var n = t.length, r = [], o = 0; o < n; o++)
                    r[o >>> 1] |= i(t.charCodeAt(o) << 16 - o % 2 * 16);
                return e.create(r, 2 * n)
            }
        }
    }(),
    r.enc.Utf16)
}
, function(t, e, n) {
    var r, i, o, a, c, s;
    t.exports = (r = n(0),
    n(42),
    o = (i = r).lib.WordArray,
    a = i.algo,
    c = a.SHA256,
    s = a.SHA224 = c.extend({
        _doReset: function() {
            this._hash = new o.init([3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428])
        },
        _doFinalize: function() {
            var t = c._doFinalize.call(this);
            return t.sigBytes -= 4,
            t
        }
    }),
    i.SHA224 = c._createHelper(s),
    i.HmacSHA224 = c._createHmacHelper(s),
    r.SHA224)
}
, function(t, e, n) {
    var r, i, o, a, c, s, u, f;
    t.exports = (r = n(0),
    n(16),
    n(43),
    o = (i = r).x64,
    a = o.Word,
    c = o.WordArray,
    s = i.algo,
    u = s.SHA512,
    f = s.SHA384 = u.extend({
        _doReset: function() {
            this._hash = new c.init([new a.init(3418070365,3238371032), new a.init(1654270250,914150663), new a.init(2438529370,812702999), new a.init(355462360,4144912697), new a.init(1731405415,4290775857), new a.init(2394180231,1750603025), new a.init(3675008525,1694076839), new a.init(1203062813,3204075428)])
        },
        _doFinalize: function() {
            var t = u._doFinalize.call(this);
            return t.sigBytes -= 16,
            t
        }
    }),
    i.SHA384 = u._createHelper(f),
    i.HmacSHA384 = u._createHmacHelper(f),
    r.SHA384)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(16),
    function(t) {
        var e = r
          , n = e.lib
          , i = n.WordArray
          , o = n.Hasher
          , a = e.x64.Word
          , c = e.algo
          , s = []
          , u = []
          , f = [];
        !function() {
            for (var t = 1, e = 0, n = 0; n < 24; n++) {
                s[t + 5 * e] = (n + 1) * (n + 2) / 2 % 64;
                var r = (2 * t + 3 * e) % 5;
                t = e % 5,
                e = r
            }
            for (t = 0; t < 5; t++)
                for (e = 0; e < 5; e++)
                    u[t + 5 * e] = e + (2 * t + 3 * e) % 5 * 5;
            for (var i = 1, o = 0; o < 24; o++) {
                for (var c = 0, l = 0, h = 0; h < 7; h++) {
                    if (1 & i) {
                        var d = (1 << h) - 1;
                        d < 32 ? l ^= 1 << d : c ^= 1 << d - 32
                    }
                    128 & i ? i = i << 1 ^ 113 : i <<= 1
                }
                f[o] = a.create(c, l)
            }
        }();
        var l = [];
        !function() {
            for (var t = 0; t < 25; t++)
                l[t] = a.create()
        }();
        var h = c.SHA3 = o.extend({
            cfg: o.cfg.extend({
                outputLength: 512
            }),
            _doReset: function() {
                for (var t = this._state = [], e = 0; e < 25; e++)
                    t[e] = new a.init;
                this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32
            },
            _doProcessBlock: function(t, e) {
                for (var n = this._state, r = this.blockSize / 2, i = 0; i < r; i++) {
                    var o = t[e + 2 * i]
                      , a = t[e + 2 * i + 1];
                    o = 16711935 & (o << 8 | o >>> 24) | 4278255360 & (o << 24 | o >>> 8),
                    a = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8),
                    (E = n[i]).high ^= a,
                    E.low ^= o
                }
                for (var c = 0; c < 24; c++) {
                    for (var h = 0; h < 5; h++) {
                        for (var d = 0, p = 0, v = 0; v < 5; v++)
                            d ^= (E = n[h + 5 * v]).high,
                            p ^= E.low;
                        var y = l[h];
                        y.high = d,
                        y.low = p
                    }
                    for (h = 0; h < 5; h++) {
                        var _ = l[(h + 4) % 5]
                          , g = l[(h + 1) % 5]
                          , m = g.high
                          , w = g.low;
                        for (d = _.high ^ (m << 1 | w >>> 31),
                        p = _.low ^ (w << 1 | m >>> 31),
                        v = 0; v < 5; v++)
                            (E = n[h + 5 * v]).high ^= d,
                            E.low ^= p
                    }
                    for (var b = 1; b < 25; b++) {
                        var x = (E = n[b]).high
                          , k = E.low
                          , S = s[b];
                        S < 32 ? (d = x << S | k >>> 32 - S,
                        p = k << S | x >>> 32 - S) : (d = k << S - 32 | x >>> 64 - S,
                        p = x << S - 32 | k >>> 64 - S);
                        var B = l[u[b]];
                        B.high = d,
                        B.low = p
                    }
                    var C = l[0]
                      , A = n[0];
                    for (C.high = A.high,
                    C.low = A.low,
                    h = 0; h < 5; h++)
                        for (v = 0; v < 5; v++) {
                            var E = n[b = h + 5 * v]
                              , H = l[b]
                              , M = l[(h + 1) % 5 + 5 * v]
                              , O = l[(h + 2) % 5 + 5 * v];
                            E.high = H.high ^ ~M.high & O.high,
                            E.low = H.low ^ ~M.low & O.low
                        }
                    E = n[0];
                    var j = f[c];
                    E.high ^= j.high,
                    E.low ^= j.low
                }
            },
            _doFinalize: function() {
                var e = this._data
                  , n = e.words
                  , r = (this._nDataBytes,
                8 * e.sigBytes)
                  , o = 32 * this.blockSize;
                n[r >>> 5] |= 1 << 24 - r % 32,
                n[(t.ceil((r + 1) / o) * o >>> 5) - 1] |= 128,
                e.sigBytes = 4 * n.length,
                this._process();
                for (var a = this._state, c = this.cfg.outputLength / 8, s = c / 8, u = [], f = 0; f < s; f++) {
                    var l = a[f]
                      , h = l.high
                      , d = l.low;
                    h = 16711935 & (h << 8 | h >>> 24) | 4278255360 & (h << 24 | h >>> 8),
                    d = 16711935 & (d << 8 | d >>> 24) | 4278255360 & (d << 24 | d >>> 8),
                    u.push(d),
                    u.push(h)
                }
                return new i.init(u,c)
            },
            clone: function() {
                for (var t = o.clone.call(this), e = t._state = this._state.slice(0), n = 0; n < 25; n++)
                    e[n] = e[n].clone();
                return t
            }
        });
        e.SHA3 = o._createHelper(h),
        e.HmacSHA3 = o._createHmacHelper(h)
    }(Math),
    r.SHA3)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    /** @preserve
	(c) 2012 by Cédric Mesnil. All rights reserved.

	Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

	    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
	    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
    function(t) {
        var e = r
          , n = e.lib
          , i = n.WordArray
          , o = n.Hasher
          , a = e.algo
          , c = i.create([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13])
          , s = i.create([5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11])
          , u = i.create([11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6])
          , f = i.create([8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11])
          , l = i.create([0, 1518500249, 1859775393, 2400959708, 2840853838])
          , h = i.create([1352829926, 1548603684, 1836072691, 2053994217, 0])
          , d = a.RIPEMD160 = o.extend({
            _doReset: function() {
                this._hash = i.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
            },
            _doProcessBlock: function(t, e) {
                for (var n = 0; n < 16; n++) {
                    var r = e + n
                      , i = t[r];
                    t[r] = 16711935 & (i << 8 | i >>> 24) | 4278255360 & (i << 24 | i >>> 8)
                }
                var o, a, d, w, b, x, k, S, B, C, A, E = this._hash.words, H = l.words, M = h.words, O = c.words, j = s.words, P = u.words, z = f.words;
                for (x = o = E[0],
                k = a = E[1],
                S = d = E[2],
                B = w = E[3],
                C = b = E[4],
                n = 0; n < 80; n += 1)
                    A = o + t[e + O[n]] | 0,
                    A += n < 16 ? p(a, d, w) + H[0] : n < 32 ? v(a, d, w) + H[1] : n < 48 ? y(a, d, w) + H[2] : n < 64 ? _(a, d, w) + H[3] : g(a, d, w) + H[4],
                    A = (A = m(A |= 0, P[n])) + b | 0,
                    o = b,
                    b = w,
                    w = m(d, 10),
                    d = a,
                    a = A,
                    A = x + t[e + j[n]] | 0,
                    A += n < 16 ? g(k, S, B) + M[0] : n < 32 ? _(k, S, B) + M[1] : n < 48 ? y(k, S, B) + M[2] : n < 64 ? v(k, S, B) + M[3] : p(k, S, B) + M[4],
                    A = (A = m(A |= 0, z[n])) + C | 0,
                    x = C,
                    C = B,
                    B = m(S, 10),
                    S = k,
                    k = A;
                A = E[1] + d + B | 0,
                E[1] = E[2] + w + C | 0,
                E[2] = E[3] + b + x | 0,
                E[3] = E[4] + o + k | 0,
                E[4] = E[0] + a + S | 0,
                E[0] = A
            },
            _doFinalize: function() {
                var t = this._data
                  , e = t.words
                  , n = 8 * this._nDataBytes
                  , r = 8 * t.sigBytes;
                e[r >>> 5] |= 128 << 24 - r % 32,
                e[14 + (r + 64 >>> 9 << 4)] = 16711935 & (n << 8 | n >>> 24) | 4278255360 & (n << 24 | n >>> 8),
                t.sigBytes = 4 * (e.length + 1),
                this._process();
                for (var i = this._hash, o = i.words, a = 0; a < 5; a++) {
                    var c = o[a];
                    o[a] = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                }
                return i
            },
            clone: function() {
                var t = o.clone.call(this);
                return t._hash = this._hash.clone(),
                t
            }
        });
        function p(t, e, n) {
            return t ^ e ^ n
        }
        function v(t, e, n) {
            return t & e | ~t & n
        }
        function y(t, e, n) {
            return (t | ~e) ^ n
        }
        function _(t, e, n) {
            return t & n | e & ~n
        }
        function g(t, e, n) {
            return t ^ (e | ~n)
        }
        function m(t, e) {
            return t << e | t >>> 32 - e
        }
        e.RIPEMD160 = o._createHelper(d),
        e.HmacRIPEMD160 = o._createHmacHelper(d)
    }(Math),
    r.RIPEMD160)
}
, function(t, e, n) {
    var r, i, o, a, c, s, u, f, l;
    t.exports = (r = n(0),
    n(23),
    n(24),
    o = (i = r).lib,
    a = o.Base,
    c = o.WordArray,
    s = i.algo,
    u = s.SHA1,
    f = s.HMAC,
    l = s.PBKDF2 = a.extend({
        cfg: a.extend({
            keySize: 4,
            hasher: u,
            iterations: 1
        }),
        init: function(t) {
            this.cfg = this.cfg.extend(t)
        },
        compute: function(t, e) {
            for (var n = this.cfg, r = f.create(n.hasher, t), i = c.create(), o = c.create([1]), a = i.words, s = o.words, u = n.keySize, l = n.iterations; a.length < u; ) {
                var h = r.update(e).finalize(o);
                r.reset();
                for (var d = h.words, p = d.length, v = h, y = 1; y < l; y++) {
                    v = r.finalize(v),
                    r.reset();
                    for (var _ = v.words, g = 0; g < p; g++)
                        d[g] ^= _[g]
                }
                i.concat(h),
                s[0]++
            }
            return i.sigBytes = 4 * u,
            i
        }
    }),
    i.PBKDF2 = function(t, e, n) {
        return l.create(n).compute(t, e)
    }
    ,
    r.PBKDF2)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    r.mode.CFB = function() {
        var t = r.lib.BlockCipherMode.extend();
        function e(t, e, n, r) {
            var i = this._iv;
            if (i) {
                var o = i.slice(0);
                this._iv = void 0
            } else
                o = this._prevBlock;
            r.encryptBlock(o, 0);
            for (var a = 0; a < n; a++)
                t[e + a] ^= o[a]
        }
        return t.Encryptor = t.extend({
            processBlock: function(t, n) {
                var r = this._cipher
                  , i = r.blockSize;
                e.call(this, t, n, i, r),
                this._prevBlock = t.slice(n, n + i)
            }
        }),
        t.Decryptor = t.extend({
            processBlock: function(t, n) {
                var r = this._cipher
                  , i = r.blockSize
                  , o = t.slice(n, n + i);
                e.call(this, t, n, i, r),
                this._prevBlock = o
            }
        }),
        t
    }(),
    r.mode.CFB)
}
, function(t, e, n) {
    var r, i, o;
    t.exports = (r = n(0),
    n(1),
    r.mode.CTR = (i = r.lib.BlockCipherMode.extend(),
    o = i.Encryptor = i.extend({
        processBlock: function(t, e) {
            var n = this._cipher
              , r = n.blockSize
              , i = this._iv
              , o = this._counter;
            i && (o = this._counter = i.slice(0),
            this._iv = void 0);
            var a = o.slice(0);
            n.encryptBlock(a, 0),
            o[r - 1] = o[r - 1] + 1 | 0;
            for (var c = 0; c < r; c++)
                t[e + c] ^= a[c]
        }
    }),
    i.Decryptor = o,
    i),
    r.mode.CTR)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    /** @preserve
	 * Counter block mode compatible with  Dr Brian Gladman fileenc.c
	 * derived from CryptoJS.mode.CTR
	 * Jan Hruby jhruby.web@gmail.com
	 */
    r.mode.CTRGladman = function() {
        var t = r.lib.BlockCipherMode.extend();
        function e(t) {
            if (255 == (t >> 24 & 255)) {
                var e = t >> 16 & 255
                  , n = t >> 8 & 255
                  , r = 255 & t;
                255 === e ? (e = 0,
                255 === n ? (n = 0,
                255 === r ? r = 0 : ++r) : ++n) : ++e,
                t = 0,
                t += e << 16,
                t += n << 8,
                t += r
            } else
                t += 1 << 24;
            return t
        }
        var n = t.Encryptor = t.extend({
            processBlock: function(t, n) {
                var r = this._cipher
                  , i = r.blockSize
                  , o = this._iv
                  , a = this._counter;
                o && (a = this._counter = o.slice(0),
                this._iv = void 0),
                function(t) {
                    0 === (t[0] = e(t[0])) && (t[1] = e(t[1]))
                }(a);
                var c = a.slice(0);
                r.encryptBlock(c, 0);
                for (var s = 0; s < i; s++)
                    t[n + s] ^= c[s]
            }
        });
        return t.Decryptor = n,
        t
    }(),
    r.mode.CTRGladman)
}
, function(t, e, n) {
    var r, i, o;
    t.exports = (r = n(0),
    n(1),
    r.mode.OFB = (i = r.lib.BlockCipherMode.extend(),
    o = i.Encryptor = i.extend({
        processBlock: function(t, e) {
            var n = this._cipher
              , r = n.blockSize
              , i = this._iv
              , o = this._keystream;
            i && (o = this._keystream = i.slice(0),
            this._iv = void 0),
            n.encryptBlock(o, 0);
            for (var a = 0; a < r; a++)
                t[e + a] ^= o[a]
        }
    }),
    i.Decryptor = o,
    i),
    r.mode.OFB)
}
, function(t, e, n) {
    var r, i;
    t.exports = (r = n(0),
    n(1),
    r.mode.ECB = ((i = r.lib.BlockCipherMode.extend()).Encryptor = i.extend({
        processBlock: function(t, e) {
            this._cipher.encryptBlock(t, e)
        }
    }),
    i.Decryptor = i.extend({
        processBlock: function(t, e) {
            this._cipher.decryptBlock(t, e)
        }
    }),
    i),
    r.mode.ECB)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    r.pad.AnsiX923 = {
        pad: function(t, e) {
            var n = t.sigBytes
              , r = 4 * e
              , i = r - n % r
              , o = n + i - 1;
            t.clamp(),
            t.words[o >>> 2] |= i << 24 - o % 4 * 8,
            t.sigBytes += i
        },
        unpad: function(t) {
            var e = 255 & t.words[t.sigBytes - 1 >>> 2];
            t.sigBytes -= e
        }
    },
    r.pad.Ansix923)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    r.pad.Iso10126 = {
        pad: function(t, e) {
            var n = 4 * e
              , i = n - t.sigBytes % n;
            t.concat(r.lib.WordArray.random(i - 1)).concat(r.lib.WordArray.create([i << 24], 1))
        },
        unpad: function(t) {
            var e = 255 & t.words[t.sigBytes - 1 >>> 2];
            t.sigBytes -= e
        }
    },
    r.pad.Iso10126)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    r.pad.Iso97971 = {
        pad: function(t, e) {
            t.concat(r.lib.WordArray.create([2147483648], 1)),
            r.pad.ZeroPadding.pad(t, e)
        },
        unpad: function(t) {
            r.pad.ZeroPadding.unpad(t),
            t.sigBytes--
        }
    },
    r.pad.Iso97971)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    r.pad.ZeroPadding = {
        pad: function(t, e) {
            var n = 4 * e;
            t.clamp(),
            t.sigBytes += n - (t.sigBytes % n || n)
        },
        unpad: function(t) {
            for (var e = t.words, n = t.sigBytes - 1; !(e[n >>> 2] >>> 24 - n % 4 * 8 & 255); )
                n--;
            t.sigBytes = n + 1
        }
    },
    r.pad.ZeroPadding)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(1),
    r.pad.NoPadding = {
        pad: function() {},
        unpad: function() {}
    },
    r.pad.NoPadding)
}
, function(t, e, n) {
    var r, i, o, a;
    t.exports = (r = n(0),
    n(1),
    o = (i = r).lib.CipherParams,
    a = i.enc.Hex,
    i.format.Hex = {
        stringify: function(t) {
            return t.ciphertext.toString(a)
        },
        parse: function(t) {
            var e = a.parse(t);
            return o.create({
                ciphertext: e
            })
        }
    },
    r.format.Hex)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(6),
    n(7),
    n(4),
    n(1),
    function() {
        var t = r
          , e = t.lib.BlockCipher
          , n = t.algo
          , i = []
          , o = []
          , a = []
          , c = []
          , s = []
          , u = []
          , f = []
          , l = []
          , h = []
          , d = [];
        !function() {
            for (var t = [], e = 0; e < 256; e++)
                t[e] = e < 128 ? e << 1 : e << 1 ^ 283;
            var n = 0
              , r = 0;
            for (e = 0; e < 256; e++) {
                var p = r ^ r << 1 ^ r << 2 ^ r << 3 ^ r << 4;
                p = p >>> 8 ^ 255 & p ^ 99,
                i[n] = p,
                o[p] = n;
                var v = t[n]
                  , y = t[v]
                  , _ = t[y]
                  , g = 257 * t[p] ^ 16843008 * p;
                a[n] = g << 24 | g >>> 8,
                c[n] = g << 16 | g >>> 16,
                s[n] = g << 8 | g >>> 24,
                u[n] = g,
                g = 16843009 * _ ^ 65537 * y ^ 257 * v ^ 16843008 * n,
                f[p] = g << 24 | g >>> 8,
                l[p] = g << 16 | g >>> 16,
                h[p] = g << 8 | g >>> 24,
                d[p] = g,
                n ? (n = v ^ t[t[t[_ ^ v]]],
                r ^= t[t[r]]) : n = r = 1
            }
        }();
        var p = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54]
          , v = n.AES = e.extend({
            _doReset: function() {
                if (!this._nRounds || this._keyPriorReset !== this._key) {
                    for (var t = this._keyPriorReset = this._key, e = t.words, n = t.sigBytes / 4, r = 4 * ((this._nRounds = n + 6) + 1), o = this._keySchedule = [], a = 0; a < r; a++)
                        if (a < n)
                            o[a] = e[a];
                        else {
                            var c = o[a - 1];
                            a % n ? n > 6 && a % n == 4 && (c = i[c >>> 24] << 24 | i[c >>> 16 & 255] << 16 | i[c >>> 8 & 255] << 8 | i[255 & c]) : (c = i[(c = c << 8 | c >>> 24) >>> 24] << 24 | i[c >>> 16 & 255] << 16 | i[c >>> 8 & 255] << 8 | i[255 & c],
                            c ^= p[a / n | 0] << 24),
                            o[a] = o[a - n] ^ c
                        }
                    for (var s = this._invKeySchedule = [], u = 0; u < r; u++)
                        a = r - u,
                        c = u % 4 ? o[a] : o[a - 4],
                        s[u] = u < 4 || a <= 4 ? c : f[i[c >>> 24]] ^ l[i[c >>> 16 & 255]] ^ h[i[c >>> 8 & 255]] ^ d[i[255 & c]]
                }
            },
            encryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._keySchedule, a, c, s, u, i)
            },
            decryptBlock: function(t, e) {
                var n = t[e + 1];
                t[e + 1] = t[e + 3],
                t[e + 3] = n,
                this._doCryptBlock(t, e, this._invKeySchedule, f, l, h, d, o),
                n = t[e + 1],
                t[e + 1] = t[e + 3],
                t[e + 3] = n
            },
            _doCryptBlock: function(t, e, n, r, i, o, a, c) {
                for (var s = this._nRounds, u = t[e] ^ n[0], f = t[e + 1] ^ n[1], l = t[e + 2] ^ n[2], h = t[e + 3] ^ n[3], d = 4, p = 1; p < s; p++) {
                    var v = r[u >>> 24] ^ i[f >>> 16 & 255] ^ o[l >>> 8 & 255] ^ a[255 & h] ^ n[d++]
                      , y = r[f >>> 24] ^ i[l >>> 16 & 255] ^ o[h >>> 8 & 255] ^ a[255 & u] ^ n[d++]
                      , _ = r[l >>> 24] ^ i[h >>> 16 & 255] ^ o[u >>> 8 & 255] ^ a[255 & f] ^ n[d++]
                      , g = r[h >>> 24] ^ i[u >>> 16 & 255] ^ o[f >>> 8 & 255] ^ a[255 & l] ^ n[d++];
                    u = v,
                    f = y,
                    l = _,
                    h = g
                }
                v = (c[u >>> 24] << 24 | c[f >>> 16 & 255] << 16 | c[l >>> 8 & 255] << 8 | c[255 & h]) ^ n[d++],
                y = (c[f >>> 24] << 24 | c[l >>> 16 & 255] << 16 | c[h >>> 8 & 255] << 8 | c[255 & u]) ^ n[d++],
                _ = (c[l >>> 24] << 24 | c[h >>> 16 & 255] << 16 | c[u >>> 8 & 255] << 8 | c[255 & f]) ^ n[d++],
                g = (c[h >>> 24] << 24 | c[u >>> 16 & 255] << 16 | c[f >>> 8 & 255] << 8 | c[255 & l]) ^ n[d++],
                t[e] = v,
                t[e + 1] = y,
                t[e + 2] = _,
                t[e + 3] = g
            },
            keySize: 8
        });
        t.AES = e._createHelper(v)
    }(),
    r.AES)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(6),
    n(7),
    n(4),
    n(1),
    function() {
        var t = r
          , e = t.lib
          , n = e.WordArray
          , i = e.BlockCipher
          , o = t.algo
          , a = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4]
          , c = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32]
          , s = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28]
          , u = [{
            0: 8421888,
            268435456: 32768,
            536870912: 8421378,
            805306368: 2,
            1073741824: 512,
            1342177280: 8421890,
            1610612736: 8389122,
            1879048192: 8388608,
            2147483648: 514,
            2415919104: 8389120,
            2684354560: 33280,
            2952790016: 8421376,
            3221225472: 32770,
            3489660928: 8388610,
            3758096384: 0,
            4026531840: 33282,
            134217728: 0,
            402653184: 8421890,
            671088640: 33282,
            939524096: 32768,
            1207959552: 8421888,
            1476395008: 512,
            1744830464: 8421378,
            2013265920: 2,
            2281701376: 8389120,
            2550136832: 33280,
            2818572288: 8421376,
            3087007744: 8389122,
            3355443200: 8388610,
            3623878656: 32770,
            3892314112: 514,
            4160749568: 8388608,
            1: 32768,
            268435457: 2,
            536870913: 8421888,
            805306369: 8388608,
            1073741825: 8421378,
            1342177281: 33280,
            1610612737: 512,
            1879048193: 8389122,
            2147483649: 8421890,
            2415919105: 8421376,
            2684354561: 8388610,
            2952790017: 33282,
            3221225473: 514,
            3489660929: 8389120,
            3758096385: 32770,
            4026531841: 0,
            134217729: 8421890,
            402653185: 8421376,
            671088641: 8388608,
            939524097: 512,
            1207959553: 32768,
            1476395009: 8388610,
            1744830465: 2,
            2013265921: 33282,
            2281701377: 32770,
            2550136833: 8389122,
            2818572289: 514,
            3087007745: 8421888,
            3355443201: 8389120,
            3623878657: 0,
            3892314113: 33280,
            4160749569: 8421378
        }, {
            0: 1074282512,
            16777216: 16384,
            33554432: 524288,
            50331648: 1074266128,
            67108864: 1073741840,
            83886080: 1074282496,
            100663296: 1073758208,
            117440512: 16,
            134217728: 540672,
            150994944: 1073758224,
            167772160: 1073741824,
            184549376: 540688,
            201326592: 524304,
            218103808: 0,
            234881024: 16400,
            251658240: 1074266112,
            8388608: 1073758208,
            25165824: 540688,
            41943040: 16,
            58720256: 1073758224,
            75497472: 1074282512,
            92274688: 1073741824,
            109051904: 524288,
            125829120: 1074266128,
            142606336: 524304,
            159383552: 0,
            176160768: 16384,
            192937984: 1074266112,
            209715200: 1073741840,
            226492416: 540672,
            243269632: 1074282496,
            260046848: 16400,
            268435456: 0,
            285212672: 1074266128,
            301989888: 1073758224,
            318767104: 1074282496,
            335544320: 1074266112,
            352321536: 16,
            369098752: 540688,
            385875968: 16384,
            402653184: 16400,
            419430400: 524288,
            436207616: 524304,
            452984832: 1073741840,
            469762048: 540672,
            486539264: 1073758208,
            503316480: 1073741824,
            520093696: 1074282512,
            276824064: 540688,
            293601280: 524288,
            310378496: 1074266112,
            327155712: 16384,
            343932928: 1073758208,
            360710144: 1074282512,
            377487360: 16,
            394264576: 1073741824,
            411041792: 1074282496,
            427819008: 1073741840,
            444596224: 1073758224,
            461373440: 524304,
            478150656: 0,
            494927872: 16400,
            511705088: 1074266128,
            528482304: 540672
        }, {
            0: 260,
            1048576: 0,
            2097152: 67109120,
            3145728: 65796,
            4194304: 65540,
            5242880: 67108868,
            6291456: 67174660,
            7340032: 67174400,
            8388608: 67108864,
            9437184: 67174656,
            10485760: 65792,
            11534336: 67174404,
            12582912: 67109124,
            13631488: 65536,
            14680064: 4,
            15728640: 256,
            524288: 67174656,
            1572864: 67174404,
            2621440: 0,
            3670016: 67109120,
            4718592: 67108868,
            5767168: 65536,
            6815744: 65540,
            7864320: 260,
            8912896: 4,
            9961472: 256,
            11010048: 67174400,
            12058624: 65796,
            13107200: 65792,
            14155776: 67109124,
            15204352: 67174660,
            16252928: 67108864,
            16777216: 67174656,
            17825792: 65540,
            18874368: 65536,
            19922944: 67109120,
            20971520: 256,
            22020096: 67174660,
            23068672: 67108868,
            24117248: 0,
            25165824: 67109124,
            26214400: 67108864,
            27262976: 4,
            28311552: 65792,
            29360128: 67174400,
            30408704: 260,
            31457280: 65796,
            32505856: 67174404,
            17301504: 67108864,
            18350080: 260,
            19398656: 67174656,
            20447232: 0,
            21495808: 65540,
            22544384: 67109120,
            23592960: 256,
            24641536: 67174404,
            25690112: 65536,
            26738688: 67174660,
            27787264: 65796,
            28835840: 67108868,
            29884416: 67109124,
            30932992: 67174400,
            31981568: 4,
            33030144: 65792
        }, {
            0: 2151682048,
            65536: 2147487808,
            131072: 4198464,
            196608: 2151677952,
            262144: 0,
            327680: 4198400,
            393216: 2147483712,
            458752: 4194368,
            524288: 2147483648,
            589824: 4194304,
            655360: 64,
            720896: 2147487744,
            786432: 2151678016,
            851968: 4160,
            917504: 4096,
            983040: 2151682112,
            32768: 2147487808,
            98304: 64,
            163840: 2151678016,
            229376: 2147487744,
            294912: 4198400,
            360448: 2151682112,
            425984: 0,
            491520: 2151677952,
            557056: 4096,
            622592: 2151682048,
            688128: 4194304,
            753664: 4160,
            819200: 2147483648,
            884736: 4194368,
            950272: 4198464,
            1015808: 2147483712,
            1048576: 4194368,
            1114112: 4198400,
            1179648: 2147483712,
            1245184: 0,
            1310720: 4160,
            1376256: 2151678016,
            1441792: 2151682048,
            1507328: 2147487808,
            1572864: 2151682112,
            1638400: 2147483648,
            1703936: 2151677952,
            1769472: 4198464,
            1835008: 2147487744,
            1900544: 4194304,
            1966080: 64,
            2031616: 4096,
            1081344: 2151677952,
            1146880: 2151682112,
            1212416: 0,
            1277952: 4198400,
            1343488: 4194368,
            1409024: 2147483648,
            1474560: 2147487808,
            1540096: 64,
            1605632: 2147483712,
            1671168: 4096,
            1736704: 2147487744,
            1802240: 2151678016,
            1867776: 4160,
            1933312: 2151682048,
            1998848: 4194304,
            2064384: 4198464
        }, {
            0: 128,
            4096: 17039360,
            8192: 262144,
            12288: 536870912,
            16384: 537133184,
            20480: 16777344,
            24576: 553648256,
            28672: 262272,
            32768: 16777216,
            36864: 537133056,
            40960: 536871040,
            45056: 553910400,
            49152: 553910272,
            53248: 0,
            57344: 17039488,
            61440: 553648128,
            2048: 17039488,
            6144: 553648256,
            10240: 128,
            14336: 17039360,
            18432: 262144,
            22528: 537133184,
            26624: 553910272,
            30720: 536870912,
            34816: 537133056,
            38912: 0,
            43008: 553910400,
            47104: 16777344,
            51200: 536871040,
            55296: 553648128,
            59392: 16777216,
            63488: 262272,
            65536: 262144,
            69632: 128,
            73728: 536870912,
            77824: 553648256,
            81920: 16777344,
            86016: 553910272,
            90112: 537133184,
            94208: 16777216,
            98304: 553910400,
            102400: 553648128,
            106496: 17039360,
            110592: 537133056,
            114688: 262272,
            118784: 536871040,
            122880: 0,
            126976: 17039488,
            67584: 553648256,
            71680: 16777216,
            75776: 17039360,
            79872: 537133184,
            83968: 536870912,
            88064: 17039488,
            92160: 128,
            96256: 553910272,
            100352: 262272,
            104448: 553910400,
            108544: 0,
            112640: 553648128,
            116736: 16777344,
            120832: 262144,
            124928: 537133056,
            129024: 536871040
        }, {
            0: 268435464,
            256: 8192,
            512: 270532608,
            768: 270540808,
            1024: 268443648,
            1280: 2097152,
            1536: 2097160,
            1792: 268435456,
            2048: 0,
            2304: 268443656,
            2560: 2105344,
            2816: 8,
            3072: 270532616,
            3328: 2105352,
            3584: 8200,
            3840: 270540800,
            128: 270532608,
            384: 270540808,
            640: 8,
            896: 2097152,
            1152: 2105352,
            1408: 268435464,
            1664: 268443648,
            1920: 8200,
            2176: 2097160,
            2432: 8192,
            2688: 268443656,
            2944: 270532616,
            3200: 0,
            3456: 270540800,
            3712: 2105344,
            3968: 268435456,
            4096: 268443648,
            4352: 270532616,
            4608: 270540808,
            4864: 8200,
            5120: 2097152,
            5376: 268435456,
            5632: 268435464,
            5888: 2105344,
            6144: 2105352,
            6400: 0,
            6656: 8,
            6912: 270532608,
            7168: 8192,
            7424: 268443656,
            7680: 270540800,
            7936: 2097160,
            4224: 8,
            4480: 2105344,
            4736: 2097152,
            4992: 268435464,
            5248: 268443648,
            5504: 8200,
            5760: 270540808,
            6016: 270532608,
            6272: 270540800,
            6528: 270532616,
            6784: 8192,
            7040: 2105352,
            7296: 2097160,
            7552: 0,
            7808: 268435456,
            8064: 268443656
        }, {
            0: 1048576,
            16: 33555457,
            32: 1024,
            48: 1049601,
            64: 34604033,
            80: 0,
            96: 1,
            112: 34603009,
            128: 33555456,
            144: 1048577,
            160: 33554433,
            176: 34604032,
            192: 34603008,
            208: 1025,
            224: 1049600,
            240: 33554432,
            8: 34603009,
            24: 0,
            40: 33555457,
            56: 34604032,
            72: 1048576,
            88: 33554433,
            104: 33554432,
            120: 1025,
            136: 1049601,
            152: 33555456,
            168: 34603008,
            184: 1048577,
            200: 1024,
            216: 34604033,
            232: 1,
            248: 1049600,
            256: 33554432,
            272: 1048576,
            288: 33555457,
            304: 34603009,
            320: 1048577,
            336: 33555456,
            352: 34604032,
            368: 1049601,
            384: 1025,
            400: 34604033,
            416: 1049600,
            432: 1,
            448: 0,
            464: 34603008,
            480: 33554433,
            496: 1024,
            264: 1049600,
            280: 33555457,
            296: 34603009,
            312: 1,
            328: 33554432,
            344: 1048576,
            360: 1025,
            376: 34604032,
            392: 33554433,
            408: 34603008,
            424: 0,
            440: 34604033,
            456: 1049601,
            472: 1024,
            488: 33555456,
            504: 1048577
        }, {
            0: 134219808,
            1: 131072,
            2: 134217728,
            3: 32,
            4: 131104,
            5: 134350880,
            6: 134350848,
            7: 2048,
            8: 134348800,
            9: 134219776,
            10: 133120,
            11: 134348832,
            12: 2080,
            13: 0,
            14: 134217760,
            15: 133152,
            2147483648: 2048,
            2147483649: 134350880,
            2147483650: 134219808,
            2147483651: 134217728,
            2147483652: 134348800,
            2147483653: 133120,
            2147483654: 133152,
            2147483655: 32,
            2147483656: 134217760,
            2147483657: 2080,
            2147483658: 131104,
            2147483659: 134350848,
            2147483660: 0,
            2147483661: 134348832,
            2147483662: 134219776,
            2147483663: 131072,
            16: 133152,
            17: 134350848,
            18: 32,
            19: 2048,
            20: 134219776,
            21: 134217760,
            22: 134348832,
            23: 131072,
            24: 0,
            25: 131104,
            26: 134348800,
            27: 134219808,
            28: 134350880,
            29: 133120,
            30: 2080,
            31: 134217728,
            2147483664: 131072,
            2147483665: 2048,
            2147483666: 134348832,
            2147483667: 133152,
            2147483668: 32,
            2147483669: 134348800,
            2147483670: 134217728,
            2147483671: 134219808,
            2147483672: 134350880,
            2147483673: 134217760,
            2147483674: 134219776,
            2147483675: 0,
            2147483676: 133120,
            2147483677: 2080,
            2147483678: 131104,
            2147483679: 134350848
        }]
          , f = [4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504, 2147483679]
          , l = o.DES = i.extend({
            _doReset: function() {
                for (var t = this._key.words, e = [], n = 0; n < 56; n++) {
                    var r = a[n] - 1;
                    e[n] = t[r >>> 5] >>> 31 - r % 32 & 1
                }
                for (var i = this._subKeys = [], o = 0; o < 16; o++) {
                    var u = i[o] = []
                      , f = s[o];
                    for (n = 0; n < 24; n++)
                        u[n / 6 | 0] |= e[(c[n] - 1 + f) % 28] << 31 - n % 6,
                        u[4 + (n / 6 | 0)] |= e[28 + (c[n + 24] - 1 + f) % 28] << 31 - n % 6;
                    for (u[0] = u[0] << 1 | u[0] >>> 31,
                    n = 1; n < 7; n++)
                        u[n] = u[n] >>> 4 * (n - 1) + 3;
                    u[7] = u[7] << 5 | u[7] >>> 27
                }
                var l = this._invSubKeys = [];
                for (n = 0; n < 16; n++)
                    l[n] = i[15 - n]
            },
            encryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._subKeys)
            },
            decryptBlock: function(t, e) {
                this._doCryptBlock(t, e, this._invSubKeys)
            },
            _doCryptBlock: function(t, e, n) {
                this._lBlock = t[e],
                this._rBlock = t[e + 1],
                h.call(this, 4, 252645135),
                h.call(this, 16, 65535),
                d.call(this, 2, 858993459),
                d.call(this, 8, 16711935),
                h.call(this, 1, 1431655765);
                for (var r = 0; r < 16; r++) {
                    for (var i = n[r], o = this._lBlock, a = this._rBlock, c = 0, s = 0; s < 8; s++)
                        c |= u[s][((a ^ i[s]) & f[s]) >>> 0];
                    this._lBlock = a,
                    this._rBlock = o ^ c
                }
                var l = this._lBlock;
                this._lBlock = this._rBlock,
                this._rBlock = l,
                h.call(this, 1, 1431655765),
                d.call(this, 8, 16711935),
                d.call(this, 2, 858993459),
                h.call(this, 16, 65535),
                h.call(this, 4, 252645135),
                t[e] = this._lBlock,
                t[e + 1] = this._rBlock
            },
            keySize: 2,
            ivSize: 2,
            blockSize: 2
        });
        function h(t, e) {
            var n = (this._lBlock >>> t ^ this._rBlock) & e;
            this._rBlock ^= n,
            this._lBlock ^= n << t
        }
        function d(t, e) {
            var n = (this._rBlock >>> t ^ this._lBlock) & e;
            this._lBlock ^= n,
            this._rBlock ^= n << t
        }
        t.DES = i._createHelper(l);
        var p = o.TripleDES = i.extend({
            _doReset: function() {
                var t = this._key.words;
                this._des1 = l.createEncryptor(n.create(t.slice(0, 2))),
                this._des2 = l.createEncryptor(n.create(t.slice(2, 4))),
                this._des3 = l.createEncryptor(n.create(t.slice(4, 6)))
            },
            encryptBlock: function(t, e) {
                this._des1.encryptBlock(t, e),
                this._des2.decryptBlock(t, e),
                this._des3.encryptBlock(t, e)
            },
            decryptBlock: function(t, e) {
                this._des3.decryptBlock(t, e),
                this._des2.encryptBlock(t, e),
                this._des1.decryptBlock(t, e)
            },
            keySize: 6,
            ivSize: 2,
            blockSize: 2
        });
        t.TripleDES = i._createHelper(p)
    }(),
    r.TripleDES)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(6),
    n(7),
    n(4),
    n(1),
    function() {
        var t = r
          , e = t.lib.StreamCipher
          , n = t.algo
          , i = n.RC4 = e.extend({
            _doReset: function() {
                for (var t = this._key, e = t.words, n = t.sigBytes, r = this._S = [], i = 0; i < 256; i++)
                    r[i] = i;
                i = 0;
                for (var o = 0; i < 256; i++) {
                    var a = i % n
                      , c = e[a >>> 2] >>> 24 - a % 4 * 8 & 255;
                    o = (o + r[i] + c) % 256;
                    var s = r[i];
                    r[i] = r[o],
                    r[o] = s
                }
                this._i = this._j = 0
            },
            _doProcessBlock: function(t, e) {
                t[e] ^= o.call(this)
            },
            keySize: 8,
            ivSize: 0
        });
        function o() {
            for (var t = this._S, e = this._i, n = this._j, r = 0, i = 0; i < 4; i++) {
                n = (n + t[e = (e + 1) % 256]) % 256;
                var o = t[e];
                t[e] = t[n],
                t[n] = o,
                r |= t[(t[e] + t[n]) % 256] << 24 - 8 * i
            }
            return this._i = e,
            this._j = n,
            r
        }
        t.RC4 = e._createHelper(i);
        var a = n.RC4Drop = i.extend({
            cfg: i.cfg.extend({
                drop: 192
            }),
            _doReset: function() {
                i._doReset.call(this);
                for (var t = this.cfg.drop; t > 0; t--)
                    o.call(this)
            }
        });
        t.RC4Drop = e._createHelper(a)
    }(),
    r.RC4)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(6),
    n(7),
    n(4),
    n(1),
    function() {
        var t = r
          , e = t.lib.StreamCipher
          , n = t.algo
          , i = []
          , o = []
          , a = []
          , c = n.Rabbit = e.extend({
            _doReset: function() {
                for (var t = this._key.words, e = this.cfg.iv, n = 0; n < 4; n++)
                    t[n] = 16711935 & (t[n] << 8 | t[n] >>> 24) | 4278255360 & (t[n] << 24 | t[n] >>> 8);
                var r = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16]
                  , i = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
                for (this._b = 0,
                n = 0; n < 4; n++)
                    s.call(this);
                for (n = 0; n < 8; n++)
                    i[n] ^= r[n + 4 & 7];
                if (e) {
                    var o = e.words
                      , a = o[0]
                      , c = o[1]
                      , u = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                      , f = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                      , l = u >>> 16 | 4294901760 & f
                      , h = f << 16 | 65535 & u;
                    for (i[0] ^= u,
                    i[1] ^= l,
                    i[2] ^= f,
                    i[3] ^= h,
                    i[4] ^= u,
                    i[5] ^= l,
                    i[6] ^= f,
                    i[7] ^= h,
                    n = 0; n < 4; n++)
                        s.call(this)
                }
            },
            _doProcessBlock: function(t, e) {
                var n = this._X;
                s.call(this),
                i[0] = n[0] ^ n[5] >>> 16 ^ n[3] << 16,
                i[1] = n[2] ^ n[7] >>> 16 ^ n[5] << 16,
                i[2] = n[4] ^ n[1] >>> 16 ^ n[7] << 16,
                i[3] = n[6] ^ n[3] >>> 16 ^ n[1] << 16;
                for (var r = 0; r < 4; r++)
                    i[r] = 16711935 & (i[r] << 8 | i[r] >>> 24) | 4278255360 & (i[r] << 24 | i[r] >>> 8),
                    t[e + r] ^= i[r]
            },
            blockSize: 4,
            ivSize: 2
        });
        function s() {
            for (var t = this._X, e = this._C, n = 0; n < 8; n++)
                o[n] = e[n];
            for (e[0] = e[0] + 1295307597 + this._b | 0,
            e[1] = e[1] + 3545052371 + (e[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0,
            e[2] = e[2] + 886263092 + (e[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0,
            e[3] = e[3] + 1295307597 + (e[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0,
            e[4] = e[4] + 3545052371 + (e[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0,
            e[5] = e[5] + 886263092 + (e[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0,
            e[6] = e[6] + 1295307597 + (e[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0,
            e[7] = e[7] + 3545052371 + (e[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0,
            this._b = e[7] >>> 0 < o[7] >>> 0 ? 1 : 0,
            n = 0; n < 8; n++) {
                var r = t[n] + e[n]
                  , i = 65535 & r
                  , c = r >>> 16
                  , s = ((i * i >>> 17) + i * c >>> 15) + c * c
                  , u = ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0);
                a[n] = s ^ u
            }
            t[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0,
            t[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0,
            t[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0,
            t[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0,
            t[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0,
            t[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0,
            t[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0,
            t[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0
        }
        t.Rabbit = e._createHelper(c)
    }(),
    r.Rabbit)
}
, function(t, e, n) {
    var r;
    t.exports = (r = n(0),
    n(6),
    n(7),
    n(4),
    n(1),
    function() {
        var t = r
          , e = t.lib.StreamCipher
          , n = t.algo
          , i = []
          , o = []
          , a = []
          , c = n.RabbitLegacy = e.extend({
            _doReset: function() {
                var t = this._key.words
                  , e = this.cfg.iv
                  , n = this._X = [t[0], t[3] << 16 | t[2] >>> 16, t[1], t[0] << 16 | t[3] >>> 16, t[2], t[1] << 16 | t[0] >>> 16, t[3], t[2] << 16 | t[1] >>> 16]
                  , r = this._C = [t[2] << 16 | t[2] >>> 16, 4294901760 & t[0] | 65535 & t[1], t[3] << 16 | t[3] >>> 16, 4294901760 & t[1] | 65535 & t[2], t[0] << 16 | t[0] >>> 16, 4294901760 & t[2] | 65535 & t[3], t[1] << 16 | t[1] >>> 16, 4294901760 & t[3] | 65535 & t[0]];
                this._b = 0;
                for (var i = 0; i < 4; i++)
                    s.call(this);
                for (i = 0; i < 8; i++)
                    r[i] ^= n[i + 4 & 7];
                if (e) {
                    var o = e.words
                      , a = o[0]
                      , c = o[1]
                      , u = 16711935 & (a << 8 | a >>> 24) | 4278255360 & (a << 24 | a >>> 8)
                      , f = 16711935 & (c << 8 | c >>> 24) | 4278255360 & (c << 24 | c >>> 8)
                      , l = u >>> 16 | 4294901760 & f
                      , h = f << 16 | 65535 & u;
                    for (r[0] ^= u,
                    r[1] ^= l,
                    r[2] ^= f,
                    r[3] ^= h,
                    r[4] ^= u,
                    r[5] ^= l,
                    r[6] ^= f,
                    r[7] ^= h,
                    i = 0; i < 4; i++)
                        s.call(this)
                }
            },
            _doProcessBlock: function(t, e) {
                var n = this._X;
                s.call(this),
                i[0] = n[0] ^ n[5] >>> 16 ^ n[3] << 16,
                i[1] = n[2] ^ n[7] >>> 16 ^ n[5] << 16,
                i[2] = n[4] ^ n[1] >>> 16 ^ n[7] << 16,
                i[3] = n[6] ^ n[3] >>> 16 ^ n[1] << 16;
                for (var r = 0; r < 4; r++)
                    i[r] = 16711935 & (i[r] << 8 | i[r] >>> 24) | 4278255360 & (i[r] << 24 | i[r] >>> 8),
                    t[e + r] ^= i[r]
            },
            blockSize: 4,
            ivSize: 2
        });
        function s() {
            for (var t = this._X, e = this._C, n = 0; n < 8; n++)
                o[n] = e[n];
            for (e[0] = e[0] + 1295307597 + this._b | 0,
            e[1] = e[1] + 3545052371 + (e[0] >>> 0 < o[0] >>> 0 ? 1 : 0) | 0,
            e[2] = e[2] + 886263092 + (e[1] >>> 0 < o[1] >>> 0 ? 1 : 0) | 0,
            e[3] = e[3] + 1295307597 + (e[2] >>> 0 < o[2] >>> 0 ? 1 : 0) | 0,
            e[4] = e[4] + 3545052371 + (e[3] >>> 0 < o[3] >>> 0 ? 1 : 0) | 0,
            e[5] = e[5] + 886263092 + (e[4] >>> 0 < o[4] >>> 0 ? 1 : 0) | 0,
            e[6] = e[6] + 1295307597 + (e[5] >>> 0 < o[5] >>> 0 ? 1 : 0) | 0,
            e[7] = e[7] + 3545052371 + (e[6] >>> 0 < o[6] >>> 0 ? 1 : 0) | 0,
            this._b = e[7] >>> 0 < o[7] >>> 0 ? 1 : 0,
            n = 0; n < 8; n++) {
                var r = t[n] + e[n]
                  , i = 65535 & r
                  , c = r >>> 16
                  , s = ((i * i >>> 17) + i * c >>> 15) + c * c
                  , u = ((4294901760 & r) * r | 0) + ((65535 & r) * r | 0);
                a[n] = s ^ u
            }
            t[0] = a[0] + (a[7] << 16 | a[7] >>> 16) + (a[6] << 16 | a[6] >>> 16) | 0,
            t[1] = a[1] + (a[0] << 8 | a[0] >>> 24) + a[7] | 0,
            t[2] = a[2] + (a[1] << 16 | a[1] >>> 16) + (a[0] << 16 | a[0] >>> 16) | 0,
            t[3] = a[3] + (a[2] << 8 | a[2] >>> 24) + a[1] | 0,
            t[4] = a[4] + (a[3] << 16 | a[3] >>> 16) + (a[2] << 16 | a[2] >>> 16) | 0,
            t[5] = a[5] + (a[4] << 8 | a[4] >>> 24) + a[3] | 0,
            t[6] = a[6] + (a[5] << 16 | a[5] >>> 16) + (a[4] << 16 | a[4] >>> 16) | 0,
            t[7] = a[7] + (a[6] << 8 | a[6] >>> 24) + a[5] | 0
        }
        t.RabbitLegacy = e._createHelper(c)
    }(),
    r.RabbitLegacy)
}
, function(t, e, n) {
    "use strict";
    Object.defineProperty(e, "__esModule", {
        value: !0
    }),
    e.getLog = i,
    e.setLog = function(t, e) {
        var n = i() || {};
        return n[t] = e,
        LS.set(r, JSON.stringify(n)),
        n
    }
    ,
    e.removeLog = function(t) {
        var e = i() || {};
        return e[t] && delete e[t],
        LS.set(r, e),
        e
    }
    ,
    e.clearLog = function() {
        LS.remove(r)
    }
    ,
    n(107);
    var r = "__LOGS__";
    function i(t) {
        var e = {};
        try {
            var n = JSON.parse(LS.get(r));
            e = t ? n[t] : n
        } catch (t) {}
        return e
    }
}
, function(t, e, n) {
    "use strict";
    var r, i, o, a;
    r = window,
    o = function() {}
    ,
    a = r.document,
    function() {
        if ("localStorage"in r)
            try {
                return void (i = r.localStorage)
            } catch (t) {}
        var t, e, n = a.getElementsByTagName("head")[0], o = r.location.hostname || "localStorage", c = new Date;
        if (n.addBehavior) {
            try {
                (e = new ActiveXObject("htmlfile")).open(),
                e.write('<script>document.w=window;<\\/script><iframe src="/favicon.ico"></iframe>'),
                e.close(),
                t = e.w.frames[0].document,
                n = t.createElement("head"),
                t.appendChild(n)
            } catch (t) {
                n = a.getElementsByTagName("head")[0]
            }
            try {
                c.setDate(c.getDate() + 36500),
                n.addBehavior("#default#userData"),
                n.expires = c.toUTCString(),
                n.load(o),
                n.save(o)
            } catch (t) {
                return
            }
            var s, u;
            try {
                s = n.XMLDocument.documentElement,
                u = s.attributes
            } catch (t) {
                return
            }
            var f = /^p__hack_/
              , l = /m-_-c/g
              , h = function(t) {
                return encodeURIComponent("p__hack_" + t).replace(/%/g, "m-_-c")
            };
            i = {
                length: u.length,
                isVirtualObject: !0,
                getItem: function(t) {
                    return (u.getNamedItem(h(t)) || {
                        nodeValue: null
                    }).nodeValue || s.getAttribute(h(t))
                },
                setItem: function(t, e) {
                    try {
                        s.setAttribute(h(t), e),
                        n.save(o),
                        this.length = u.length
                    } catch (t) {}
                },
                removeItem: function(t) {
                    try {
                        s.removeAttribute(h(t)),
                        n.save(o),
                        this.length = u.length
                    } catch (t) {}
                },
                clear: function() {
                    for (; u.length; )
                        this.removeItem(u[0].nodeName);
                    this.length = 0
                },
                key: function(t) {
                    return u[t] ? function(t) {
                        return decodeURIComponent(t.replace(l, "%")).replace(f, "")
                    }(u[t].nodeName) : void 0
                }
            },
            "localStorage"in r || (r.localStorage = i)
        } else
            try {
                i = r.localStorage
            } catch (t) {
                i = null
            }
    }(),
    r.LS = i ? {
        set: function(t, e) {
            void 0 !== this.get(t) && this.remove(t),
            i.setItem(t, e),
            this.length = i.length
        },
        get: function(t) {
            var e = i.getItem(t);
            return null === e ? void 0 : e
        },
        remove: function(t) {
            i.removeItem(t),
            this.length = i.length
        },
        clear: function() {
            i.clear(),
            this.length = 0
        },
        each: function(t) {
            var e, n = this.obj(), r = t || function() {}
            ;
            for (e in n)
                if (!1 === r.call(this, e, this.get(e)))
                    break
        },
        obj: function() {
            var t, e, n = {}, r = 0;
            if (i.isVirtualObject)
                n = i.key(-1);
            else
                for (t = i.length; r < t; r++)
                    n[e = i.key(r)] = this.get(e);
            return n
        },
        length: i.length
    } : {
        set: o,
        get: o,
        remove: o,
        clear: o,
        each: o,
        obj: o,
        length: 0
    },
    r.jQuery && (r.jQuery.LS = r.LS)
}
, function(t, e, n) {
    var r = n(39)
      , i = n(40);
    t.exports = function(t, e, n) {
        var o = e && n || 0;
        "string" == typeof t && (e = "binary" === t ? new Array(16) : null,
        t = null);
        var a = (t = t || {}).random || (t.rng || r)();
        if (a[6] = 15 & a[6] | 64,
        a[8] = 63 & a[8] | 128,
        e)
            for (var c = 0; c < 16; ++c)
                e[o + c] = a[c];
        return e || i(a)
    }
}
, function(t, e, n) {
    "use strict";
    n.r(e);
    n(46),
    n(67),
    n(77),
    n(81);
    var r = n(44)
      , i = n.n(r)
      , o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
        return typeof t
    }
    : function(t) {
        return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
    }
    ;
    function a(t) {
        return null !== t && "object" === (void 0 === t ? "undefined" : o(t))
    }
    function c(t, e) {
        var n = "";
        if (e[t])
            return e[t];
        for (var r in e) {
            var i = e[r];
            if (a(i) && (n = c(t, i)),
            n)
                break
        }
        return n
    }
    function s(t) {
        var e = /http(?:s)?:\\/\\/.+\\.xuexi\\.cn\\/(\\w+)\\/(\\w+)\\.html/g.exec(t) || [];
        return {
            page_uuid: "https://www.xuexi.cn/" === t || "https://boot-www-pctest.xuexi.cn/index.html" === t ? "index" : e[1] || "",
            ref_id: e[2] || ""
        }
    }
    function u(t) {
        var e = this;
        return new Promise(function(n, r) {
            if (function(t, e) {
                if (t !== e)
                    throw new TypeError("Cannot instantiate an arrow function")
            }(this, e),
            (t = t || {}).url) {
                t.type = t.type || "get",
                t.data = t.data || {};
                var i = void 0;
                switch (i = window.XMLHttpRequest ? new XMLHttpRequest : new ActiveXObject("Microsoft.XMLHTTP"),
                t.type.toLowerCase()) {
                case "get":
                    i.open("GET", t.url + "?" + function(t) {
                        var e = [];
                        for (var n in t.t = Math.random(),
                        t)
                            e.push(n + "=" + t[n]);
                        return e.join("&")
                    }(t.data), !0),
                    i.withCredentials = !0,
                    i.send();
                    break;
                case "post":
                    i.open("POST", t.url, !0),
                    i.withCredentials = !0,
                    i.setRequestHeader("Content-type", "application/json;charset=utf-8"),
                    i.send(JSON.stringify(t.data))
                }
                i.onreadystatechange = function() {
                    4 == i.readyState && (i.status >= 200 && i.status < 300 || 304 == i.status ? n(JSON.parse(i.responseText)) : r(i.status))
                }
            }
        }
        .bind(this))
    }
    var f = "__UID__"
      , l = "token"
      , h = "https://iflow-api.xuexi.cn/logflow/api/v1/pclog"
      , d = {
        "Graphic-article": "programa_id",
        "Graphic-culture": "programa_id",
        "Video-normal": "programa_id",
        "Video-news": "programa_id",
        "Video-episode": "programa_id",
        "Video-mooc": "mooc"
    }
      , p = ["69fe65d658afc891dd105e1ce9e5879d", "60bd1d03c55149fd0e92da70d074d72b", "577a3dee30fbeb9ab03295a860c2a295", "0f000c993ac1e7b7615c2d0c647aa455", "648fafc83297345be269377aefc53c9e"]
      , v = {
        e43e220633a65f9b6d8b53712cba9caa: "Graphic-article",
        "18946f750bd31d919c3d180fa602ca8e": "Graphic-culture",
        cf94877c29e1c685574e0226618fb1be: "Video-normal",
        "7f9f27c65e84e71e1b7189b7132b4710": "Video-news",
        "21a679ed902a4a2e302d3a8681d32f0a": "Video-episode",
        b2e5aa79be613aed1f01d261c4a2ae17: "Video-mooc"
    }
      , y = n(45)
      , _ = n.n(y);
    function g() {
        var t = this
          , e = Cookies.get(f) || ""
          , n = c("pageId", globalCache)
          , r = v[n] || ""
          , i = Cookies.get(l) || ""
          , o = (new Date).getTime()
          , a = n + "_" + e + "_" + o
          , y = new _.a({
            interval: 3e4,
            url: h,
            key: a,
            uid: e,
            token: i
        });
        if (-1 === p.indexOf(n)) {
            try {
                if ("" !== i) {
                    0,
                    u({
                        url: "https://pc-api.xuexi.cn/open/api/auth/check",
                        type: "GET"
                    })
                }
            } catch (t) {
                console.log(t)
            }
            var g = function() {
                return function(t, e) {
                    if (t !== e)
                        throw new TypeError("Cannot instantiate an arrow function")
                }(this, t),
                {
                    url: window.location.href,
                    pt: r,
                    tags: c(d[r], globalCache).toString(),
                    pid: n,
                    page_uuid: s(location.href).page_uuid,
                    ref_page_uuid: s(document.referrer).page_uuid,
                    read_id: a,
                    refer: document.referrer || "",
                    item_id: r ? c("_id", globalCache) : "",
                    ext: ""
                }
            }
            .bind(this);
            y.addLog(g),
            y.run()
        }
    }
    Cookies && !Cookies.get(f) && Cookies.set(f, i()(), {
        "max-age": 31536e3,
        domain: ".xuexi.cn"
    });
    var m = setInterval(function() {
        window.globalCache && (clearInterval(m),
        g())
    }, 500)
}
]);



    `;
        //command 是基于source.xuexi.cn的 laydate.js
        script.innerHTML = command;
        document.body.append(script);
    }



    window.onload = function funShowtimediv() {
        //显示页面停留时间的函数
        //载入时判断是否有myshowtime图层了，没有就创建并加挂
        if (!document.getElementById('myshowtime') && !!window.Aliplayer) {
            //方法二，更严谨一些，不容易溢出
            //设置myshowtime的div图层数据
            var div_time = document.createElement('div');
            div_time.id = "myshowtime";
            div_time.style.cssText = 'border-radius: 10px; margin: 5px; position: fixed; top: 100px; width: 250px; height: auto;';
            div_time.innerHTML = `
                    <div id="showtimestr" style="font-weight: bold; text-align: center; font-size: 15px; border-radius: 10px 10px 0px 0px;">停留时间</div>
                    <div id="jingaoStr" style="font-size: 16px; color: #FF0; text-align: center; border-radius: 0px 0px 10px 10px;"></div>
                    `;

            //加挂上述div图层
            document.body.appendChild(div_time);


            //方法一
            //let div_time='<div id="myshowtime" style="position: fixed; top: 100px; background: #39F; width: 200px; height: 50px;"><a id="reader-time-text" href="#" style="color: #FFF; font-size: 10px;font-weight: bold;">停留时间显示</a><p id="jingaoStr" style="color:#FF0;font-weight: bold;"> </p></div> ';
            //加挂上述div图层
            //$('body').append(div_time);



            var sec = 0;
            var sec_wait = 0; //加载等候时间计数
            var minu = 0;
            var hou = 0;
            var ss04 = " "; //时间字符串

            //页面阅读实际时间
            function uupdate() {
                if (!!myblockedfun) { //如果该函数已经注入成功就开始叠加秒数
                    sec++;
                    sec_wait = 0;
                } else {
                    sec_wait++;
                }

                if (sec == 60) {
                    sec = 0;
                    minu += 1;
                }
                if (minu == 60) {
                    minu = 0;
                    hou += 1;
                }


                if (sec <= 1) { //说明还停没有注入
                    ss04 = '<br><br><br><br><div style="color: #FFF;"> 请稍候...<br>（等待' + sec_wait + '秒）<br><br><br><br></div>';
                } else {
                    ss04 = "已" + minu + "分" + sec + "秒";
                }

                var div_showtimestr = document.getElementById('showtimestr');
                var div_jingaoStr = document.getElementById('jingaoStr');

                div_showtimestr.innerHTML = ss04;
                div_showtimestr.style.borderRadius = '10px';

                var domain_str = document.domain; //获取当前域名
                var url_str = document.URL; //获取当前页面网址


                if (sec >= (300 / speed_num)) {
                    div_showtimestr.style.borderRadius = '10px 10px 0px 0px';
                    div_jingaoStr.style.height = '30px';
                    div_jingaoStr.innerHTML = `<a href="https://pc.xuexi.cn/points/my-points.html" style="color: #006400; font-weight:bold;" target="_self">OK</a>`;

                }


                 if(sec>=5)//超过5秒强制进行跳转
                 {
                   window.close();
                 }
                //每隔一秒刷新一次
                window.setTimeout(uupdate, 1000);
            }
            uupdate();
        }
    };


})();
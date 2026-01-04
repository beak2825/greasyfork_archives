// ==UserScript==
// @name         魔改版 colList-min.js
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  魔改库
// @author       empyrealtear
// @license      MIT
// @original-script http://oa.mengtiandairy.com:7070/seeyon/common/colList-min.js
// ==/UserScript==

console.log.apply(void 0, [
    '%c[@inject] %coverride http://oa.mengtiandairy.com:7070/seeyon/common/colList-min.js',
    'color: green',
    'color: gray'
])

Calendar = function (d, c, h, a, g, e) {
    initCalendar();
    this.activeDiv = null;
    this.currentDateEl = null;
    this.getDateStatus = null;
    this.getDateToolTip = null;
    this.getDateText = null;
    this.timeout = null;
    this.onSelected = h || null;
    this.onClose = a || null;
    this.dragging = false;
    this.hidden = false;
    this.minYear = 1900;
    this.maxYear = 2100;
    this.dateFormat = Calendar._TT.DEF_DATE_FORMAT;
    this.ttDateFormat = Calendar._TT.TT_DATE_FORMAT;
    this.isPopup = true;
    this.weekNumbers = true;
    this.firstDayOfWeek = typeof d == "number" ? d : Calendar._FD;
    this.showsOtherMonths = false;
    this.dateStr = c;
    this.ar_days = null;
    this.showsTime = false;
    this.time24 = true;
    this.yearStep = 1;
    this.hiliteToday = true;
    this.multiple = null;
    this.table = null;
    this.element = null;
    this.tbody = null;
    this.firstdayname = null;
    this.monthsCombo = null;
    this.yearsCombo = null;
    this.hilitedMonth = null;
    this.activeMonth = null;
    this.hilitedYear = null;
    this.activeYear = null;
    this.isClear = true;
    this.clearBlank = true;
    this.height = null;
    this.isMini = g || null;
    this.onClear = e || null;
    this.dateClicked = false;
    if (typeof Calendar._SDN == "undefined") {
        if (typeof Calendar._SDN_len == "undefined") {
            Calendar._SDN_len = 3
        }
        var b = new Array();
        for (var f = 8; f > 0;) {
            b[--f] = Calendar._DN[f].substr(0, Calendar._SDN_len)
        }
        Calendar._SDN = b;
        if (typeof Calendar._SMN_len == "undefined") {
            Calendar._SMN_len = 3
        }
        b = new Array();
        for (var f = 12; f > 0;) {
            b[--f] = Calendar._MN[f].substr(0, Calendar._SMN_len)
        }
        Calendar._SMN = b
    }
}
Calendar._C = null;
Calendar.is_ie = (/msie/i.test(navigator.userAgent) || /Trident/i.test(navigator.userAgent)) && !/opera/i.test(navigator.userAgent);
Calendar.is_ie5 = (Calendar.is_ie && /msie 5\.0/i.test(navigator.userAgent));
Calendar.is_opera = /opera/i.test(navigator.userAgent);
Calendar.is_khtml = /Konqueror|Safari|KHTML/i.test(navigator.userAgent);
Calendar.getAbsolutePos = function (e) {
    var a = 0, d = 0;
    var c = /^div$/i.test(e.tagName);
    if (c && e.scrollLeft) {
        a = e.scrollLeft
    }
    if (c && e.scrollTop) {
        d = e.scrollTop
    }
    var f = {
        x: e.offsetLeft - a,
        y: e.offsetTop - d
    };
    if (e.offsetParent) {
        var b = this.getAbsolutePos(e.offsetParent);
        f.x += b.x;
        f.y += b.y
    }
    return f
}

Calendar.isRelated = function (c, a) {
    var d = a.relatedTarget;
    if (!d) {
        var b = a.type;
        if (b == "mouseover") {
            d = a.fromElement
        } else {
            if (b == "mouseout") {
                d = a.toElement
            }
        }
    }
    while (d) {
        if (d == c) {
            return true
        }
        d = d.parentNode
    }
    return false
}

Calendar.removeClass = function (e, d) {
    if (!(e && e.className)) {
        return
    }
    var a = e.className.split(" ");
    var b = new Array();
    for (var c = a.length; c > 0;) {
        if (a[--c] != d) {
            b[b.length] = a[c]
        }
    }
    e.className = b.join(" ")
}

Calendar.addClass = function (b, a) {
    Calendar.removeClass(b, a);
    b.className += " " + a
}

Calendar.getElement = function (b) {
    try {
        var c = Calendar.is_ie ? window.event.srcElement : b.currentTarget;
        if (typeof c.nodeType != null && c.nodeType) {
            while (c.nodeType != 1 || /^div$/i.test(c.tagName)) {
                c = c.parentNode
            }
            return c
        } else {
            return null
        }
    } catch (a) { }
}

Calendar.getCalendar = function (a) {
    while (a.nodeType != 1 || !a.calendar) {
        a = a.parentNode
    }
    return a.calendar
}

Calendar.getTargetElement = function (a) {
    var b = Calendar.is_ie ? window.event.srcElement : a.target;
    while (b.nodeType != 1) {
        b = b.parentNode
    }
    return b
}

Calendar.stopEvent = function (a) {
    a || (a = window.event);
    if (Calendar.is_ie) {
        a.cancelBubble = true;
        a.returnValue = false
    } else {
        a.preventDefault();
        a.stopPropagation()
    }
    return false
}

Calendar.addEvent = function (a, c, b) {
    if (a.attachEvent) {
        a.attachEvent("on" + c, b)
    } else {
        if (a.addEventListener) {
            a.addEventListener(c, b, true)
        } else {
            a["on" + c] = b
        }
    }
}

Calendar.removeEvent = function (a, c, b) {
    if (a.detachEvent) {
        a.detachEvent("on" + c, b)
    } else {
        if (a.removeEventListener) {
            a.removeEventListener(c, b, true)
        } else {
            a["on" + c] = null
        }
    }
}

Calendar.createElement = function (c, b) {
    var a = null;
    if (document.createElementNS) {
        a = document.createElementNS("http://www.w3.org/1999/xhtml", c)
    } else {
        a = document.createElement(c)
    }
    if (typeof b != "undefined") {
        b.appendChild(a)
    }
    return a
}

Calendar._add_evs = function (el) {
    with (Calendar) {
        addEvent(el, "mouseover", dayMouseOver);
        addEvent(el, "mousedown", dayMouseDown);
        addEvent(el, "mouseout", dayMouseOut);
        if (is_ie) {
            addEvent(el, "dblclick", dayMouseDblClick);
            el.setAttribute("unselectable", true)
        }
    }
}

Calendar.findMonth = function (a) {
    if (typeof a.month != "undefined") {
        return a
    } else {
        if (typeof a.parentNode.month != "undefined") {
            return a.parentNode
        }
    }
    return null
}

Calendar.findYear = function (a) {
    if (typeof a.year != "undefined") {
        return a
    } else {
        if (typeof a.parentNode.year != "undefined") {
            return a.parentNode
        }
    }
    return null
}

Calendar.showMonthsCombo = function () {
    var e = Calendar._C;
    if (!e) {
        return false
    }
    var e = e;
    var f = e.activeDiv;
    var d = e.monthsCombo;
    if (e.hilitedMonth) {
        Calendar.removeClass(e.hilitedMonth, "hilite")
    }
    if (e.activeMonth) {
        Calendar.removeClass(e.activeMonth, "active")
    }
    var c = e.monthsCombo.getElementsByTagName("div")[e.date.getMonth()];
    Calendar.addClass(c, "active");
    e.activeMonth = c;
    var b = d.style;
    b.display = "block";
    if (f.navtype < 0) {
        b.left = f.offsetLeft + "px"
    } else {
        var a = d.offsetWidth;
        if (typeof a == "undefined") {
            a = 50
        }
        b.left = (f.offsetLeft + f.offsetWidth - a) + "px"
    }
    b.top = (f.offsetTop + f.offsetHeight) + "px"
}

Calendar.showYearsCombo = function (d) {
    var a = Calendar._C;
    if (!a) {
        return false
    }
    var a = a;
    var c = a.activeDiv;
    var f = a.yearsCombo;
    if (a.hilitedYear) {
        Calendar.removeClass(a.hilitedYear, "hilite")
    }
    if (a.activeYear) {
        Calendar.removeClass(a.activeYear, "active")
    }
    a.activeYear = null;
    var b = a.date.getFullYear() + (d ? 1 : -1);
    var k = f.firstChild;
    var h = false;
    for (var e = 12; e > 0; --e) {
        if (b >= a.minYear && b <= a.maxYear) {
            k.innerHTML = b;
            k.year = b;
            k.style.display = "block";
            h = true
        } else {
            k.style.display = "none"
        }
        k = k.nextSibling;
        var j = a.yearStep ? a.yearStep : 1;
        b += d ? j : -j
    }
    if (h) {
        var l = f.style;
        l.display = "block";
        if (c.navtype < 0) {
            l.left = c.offsetLeft + "px"
        } else {
            var g = f.offsetWidth;
            if (typeof g == "undefined") {
                g = 50
            }
            l.left = (c.offsetLeft + c.offsetWidth - g) + "px"
        }
        l.top = (c.offsetTop + c.offsetHeight) + "px"
    }
}

Calendar.tableMouseUp = function (ev) {
    var cal = Calendar._C;
    if (!cal) {
        return false
    }
    if (cal.timeout) {
        clearTimeout(cal.timeout)
    }
    var el = cal.activeDiv;
    if (!el) {
        return false
    }
    var target = Calendar.getTargetElement(ev);
    ev || (ev = window.event);
    Calendar.removeClass(el, "active");
    if (target == el || target.parentNode == el) {
        var isclick = typeof (SeeUtils.getAttrEl(el, "clicktime")) == "undefined";
        var clickdate = new Date();
        var clicktime = clickdate.getTime();
        if (!isclick) {
            if ((clicktime - SeeUtils.getAttrEl(el, "clicktime")) < 300) {
                if (!SeeUtils.hasClass(target, "nav") && SeeUtils.getAttrEl(target, "unselectable") != "on") {
                    Calendar.cellClick(el, ev, "twice");
                    SeeUtils.attrEl(el, "clicktime", clicktime)
                }
            } else {
                Calendar.cellClick(el, ev);
                SeeUtils.attrEl(el, "clicktime", clicktime)
            }
        } else {
            Calendar.cellClick(el, ev)
        }
    }
    var mon = Calendar.findMonth(target);
    var date = null;
    if (mon) {
        date = new Date(cal.date);
        if (mon.month != date.getMonth()) {
            date.setMonth(mon.month);
            cal.setDate(date);
            cal.dateClicked = false;
            cal.callHandler()
        }
    } else {
        var year = Calendar.findYear(target);
        if (year) {
            date = new Date(cal.date);
            if (year.year != date.getFullYear()) {
                date.setFullYear(year.year);
                cal.setDate(date);
                cal.dateClicked = false;
                cal.callHandler()
            }
        }
    }
    with (Calendar) {
        removeEvent(document, "mouseup", tableMouseUp);
        removeEvent(document, "mouseover", tableMouseOver);
        removeEvent(document, "mousemove", tableMouseOver);
        cal._hideCombos();
        _C = null;
        return stopEvent(ev)
    }
}

Calendar.tableMouseOver = function (n) {
    var a = Calendar._C;
    if (!a) {
        return
    }
    var c = a.activeDiv;
    var j = Calendar.getTargetElement(n);
    if (j == c || j.parentNode == c) {
        Calendar.addClass(c, "hilite active");
        Calendar.addClass(c.parentNode, "rowhilite")
    } else {
        if (typeof c.navtype == "undefined" || (c.navtype != 50 && (c.navtype == 0 || Math.abs(c.navtype) > 2))) {
            Calendar.removeClass(c, "active")
        }
        Calendar.removeClass(c, "hilite");
        Calendar.removeClass(c.parentNode, "rowhilite")
    }
    n || (n = window.event);
    if (c.navtype == 50 && j != c) {
        var m = Calendar.getAbsolutePos(c);
        var p = c.offsetWidth;
        var o = n.clientX;
        var q;
        var l = true;
        if (o > m.x + p) {
            q = o - m.x - p;
            l = false
        } else {
            q = m.x - o
        }
        if (q < 0) {
            q = 0
        }
        var f = c._range;
        var h = c._current;
        var g = Math.floor(q / 10) % f.length;
        for (var e = f.length; --e >= 0;) {
            if (f[e] == h) {
                break
            }
        }
        while (g-- > 0) {
            if (l) {
                if (--e < 0) {
                    e = f.length - 1
                }
            } else {
                if (++e >= f.length) {
                    e = 0
                }
            }
        }
        var b = f[e];
        c.innerHTML = b;
        a.onUpdateTime()
    }
    var d = Calendar.findMonth(j);
    if (d) {
        if (d.month != a.date.getMonth()) {
            if (a.hilitedMonth) {
                Calendar.removeClass(a.hilitedMonth, "hilite")
            }
            Calendar.addClass(d, "hilite");
            a.hilitedMonth = d
        } else {
            if (a.hilitedMonth) {
                Calendar.removeClass(a.hilitedMonth, "hilite")
            }
        }
    } else {
        if (a.hilitedMonth) {
            Calendar.removeClass(a.hilitedMonth, "hilite")
        }
        var k = Calendar.findYear(j);
        if (k) {
            if (k.year != a.date.getFullYear()) {
                if (a.hilitedYear) {
                    Calendar.removeClass(a.hilitedYear, "hilite")
                }
                Calendar.addClass(k, "hilite");
                a.hilitedYear = k
            } else {
                if (a.hilitedYear) {
                    Calendar.removeClass(a.hilitedYear, "hilite")
                }
            }
        } else {
            if (a.hilitedYear) {
                Calendar.removeClass(a.hilitedYear, "hilite")
            }
        }
    }
    return Calendar.stopEvent(n)
}

Calendar.tableMouseDown = function (a) {
    var b = Calendar.getTargetElement(a).id;
    if (b == "timeHours" || b == "timeMinutes") {
        return
    }
    if (Calendar.getTargetElement(a) == Calendar.getElement(a)) {
        return Calendar.stopEvent(a)
    }
}

Calendar.calDragIt = function (b) {
    var c = Calendar._C;
    if (!(c && c.dragging)) {
        return false
    }
    var e;
    var d;
    if (Calendar.is_ie) {
        d = window.event.clientY + document.body.scrollTop;
        e = window.event.clientX + document.body.scrollLeft
    } else {
        e = b.pageX;
        d = b.pageY
    }
    c.hideShowCovered();
    var a = c.element.style;
    a.left = (e - c.xOffs) + "px";
    a.top = (d - c.yOffs) + "px";
    if (c.isPopup) {
        c.iframe.style.left = (e - c.xOffs) + "px";
        c.iframe.style.top = (d - c.yOffs) + "px"
    }
    return Calendar.stopEvent(b)
}

Calendar.calDragEnd = function (ev) {
    var cal = Calendar._C;
    if (!cal) {
        return false
    }
    cal.dragging = false;
    with (Calendar) {
        removeEvent(document, "mousemove", calDragIt);
        removeEvent(document, "mouseup", calDragEnd);
        tableMouseUp(ev)
    }
    cal.hideShowCovered()
}

Calendar.dayMouseDown = function (ev) {
    var el = Calendar.getElement(ev);
    if (el.disabled) {
        return false
    }
    var cal = el.calendar;
    cal.activeDiv = el;
    Calendar._C = cal;
    if (el.navtype != 300) {
        with (Calendar) {
            if (el.navtype == 50) {
                el._current = el.innerHTML;
                addEvent(document, "mousemove", tableMouseOver)
            } else {
                addEvent(document, Calendar.is_ie5 ? "mousemove" : "mouseover", tableMouseOver)
            }
            addClass(el, "hilite active");
            addEvent(document, "mouseup", tableMouseUp)
        }
    } else {
        if (cal.isPopup) {
            cal._dragStart(ev)
        }
    }
    if (el.navtype == -1 || el.navtype == 1) {
        if (cal.timeout) {
            clearTimeout(cal.timeout)
        }
        cal.timeout = setTimeout("Calendar.showMonthsCombo()", 250)
    } else {
        if (el.navtype == -2 || el.navtype == 2) {
            if (cal.timeout) {
                clearTimeout(cal.timeout)
            }
            cal.timeout = setTimeout((el.navtype > 0) ? "Calendar.showYearsCombo(true)" : "Calendar.showYearsCombo(false)", 250)
        } else {
            cal.timeout = null
        }
    }
    return Calendar.stopEvent(ev)
}

Calendar.dayMouseDblClick = function (a) {
    if (Calendar.is_ie) {
        if (document.selection) {
            document.selection.empty()
        } else {
            if (window.getSelection) {
                try {
                    window.getSelection().removeAllRanges()
                } catch (b) { }
            }
        }
    }
}

Calendar.dayMouseOver = function (b) {
    var a = Calendar.getElement(b);
    if (Calendar.isRelated(a, b) || Calendar._C || a.disabled) {
        return false
    }
    if (a.ttip) {
        if (a.ttip.substr(0, 1) == "_") {
            a.ttip = a.caldate.print(a.calendar.ttDateFormat) + a.ttip.substr(1)
        }
        a.calendar.tooltips.innerHTML = a.ttip
    }
    if (a.navtype != 300) {
        Calendar.addClass(a, "hilite");
        if (a.caldate) {
            Calendar.addClass(a.parentNode, "rowhilite");
            var c = a.calendar;
            if (c && c.getDateToolTip) {
                var e = a.caldate;
                window.status = e;
                a.title = c.getDateToolTip(e, e.getFullYear(), e.getMonth(), e.getDate())
            }
        }
    }
    return Calendar.stopEvent(b)
}

Calendar.dayMouseOut = function (ev) {
    with (Calendar) {
        var el = getElement(ev);
        if (isRelated(el, ev) || _C || el.disabled) {
            return false
        }
        removeClass(el, "hilite");
        if (el.caldate) {
            removeClass(el.parentNode, "rowhilite")
        }
        if (el.calendar) {
            el.calendar.tooltips.innerHTML = _TT.SEL_DATE
        }
    }
}

Calendar.cellClick = function (e, p, m) {
    initCalendar();
    var c = e.calendar;
    var h = false;
    var l = false;
    var f = null;
    if (typeof e.navtype == "undefined") {
        if (c.currentDateEl) {
            Calendar.removeClass(c.currentDateEl, "selected");
            Calendar.addClass(e, "selected");
            h = (c.currentDateEl == e);
            if (!h) {
                c.currentDateEl = e
            }
        }
        c.date.setDateOnly(e.caldate);
        f = c.date;
        var b = !(c.dateClicked = !e.otherMonth);
        if (!b && !c.currentDateEl && c.multiple) {
            c._toggleMultipleDate(new Date(f))
        } else {
            l = !e.disabled
        }
        if (b) {
            c._init(c.firstDayOfWeek, f)
        }
    } else {
        if (e.navtype == 200) {
            Calendar.removeClass(e, "hilite");
            c.callCloseHandler();
            return
        }
        f = new Date(c.date);
        if (e.navtype == 0) {
            f.setDateOnly(new Date())
        }
        c.dateClicked = false;
        var o = f.getFullYear();
        var g = f.getMonth();
        function a(r) {
            var s = f.getDate();
            var i = f.getMonthDays(r);
            if (s > i) {
                f.setDate(i)
            }
            f.setMonth(r)
        }
        switch (e.navtype) {
            case 400:
                Calendar.removeClass(e, "hilite");
                var q = Calendar._TT.ABOUT;
                if (typeof q != "undefined") {
                    q += c.showsTime ? Calendar._TT.ABOUT_TIME : ""
                } else {
                    q = 'Help and about box text is not translated into this language.\nIf you know this language and you feel generous please update\nthe corresponding file in "lang" subdir to match calendar-en.js\nand send it back to <mihai_bazon#yahoo.com> to get it into the distribution  ;-)\n\nThank you!\nhttp://dynarch.com/mishoo/calendar.epl\n'
                }
                alert(q);
                return;
            case -2:
                if (o > c.minYear) {
                    f.setFullYear(o - 1)
                }
                break;
            case -1:
                if (g > 0) {
                    a(g - 1)
                } else {
                    if (o-- > c.minYear) {
                        f.setFullYear(o);
                        a(11)
                    }
                }
                break;
            case 1:
                if (g < 11) {
                    a(g + 1)
                } else {
                    if (o < c.maxYear) {
                        f.setFullYear(o + 1);
                        a(0)
                    }
                }
                break;
            case 2:
                if (o < c.maxYear) {
                    f.setFullYear(o + 1)
                }
                break;
            case 100:
                c.setFirstDayOfWeek(e.fdow);
                return;
            case 50:
                var k = e._range;
                var n = e.innerHTML;
                for (var j = k.length; --j >= 0;) {
                    if (k[j] == n) {
                        break
                    }
                }
                if (p && p.shiftKey) {
                    if (--j < 0) {
                        j = k.length - 1
                    }
                } else {
                    if (++j >= k.length) {
                        j = 0
                    }
                }
                var d = k[j];
                e.innerHTML = d;
                c.onUpdateTime();
                return;
            case 0:
                if ((typeof c.getDateStatus == "function") && c.getDateStatus(f, f.getFullYear(), f.getMonth(), f.getDate())) {
                    return false
                }
                break
        }
        if (!f.equalsTo(c.date)) {
            c.setDate(f);
            l = true
        } else {
            if (e.navtype == 0) {
                l = h = true
            }
        }
    }
    if (l) {
        if (c.params.hideOkClearButton == true) {
            p && c.callHandler()
        }
    }
    if (h) {
        Calendar.removeClass(e, "hilite");
        if (c.params.hideOkClearButton == true) {
            p && c.callCloseHandler()
        }
    }
    if (this._C && this._C.iframe) {
        SeeUtils.setElHeight(this._C.iframe, SeeUtils.getElHeight(this._C.element))
    }
    if (m == "twice") {
        p && c.callHandler() && c.callCloseHandler()
    }
}

Calendar.prototype.create = function (q) {
    initCalendar();
    var l = null;
    if (!q) {
        l = document.getElementsByTagName("body")[0];
        this.isPopup = true
    } else {
        l = q;
        this.isPopup = false
    }
    this.date = this.dateStr ? new Date(this.dateStr) : new Date();
    var z = Calendar.createElement("table");
    this.table = z;
    z.cellSpacing = 2;
    z.cellPadding = 0;
    if (this.height) {
        z.style.height = this.height + "px"
    }
    z.calendar = this;
    Calendar.addEvent(z, "mousedown", Calendar.tableMouseDown);
    var p = Calendar.createElement("div");
    this.element = p;
    p.className = "calendar";
    if (self != top || this.isMini == true) {
        p.className = "calendar miniCalendar"
    }
    if (this.isPopup) {
        p.style.position = "absolute";
        p.style.display = "none"
    }
    p.appendChild(z);
    if (this.dateFormat == "%Y-%m") {
        if (document.getElementById("inputYear")) {
            document.getElementById("inputYear").parentElement.innerHTML = ""
        }
        var h = Calendar.createElement("div");
        h.className = "calendar_month_container";
        var e = Calendar.createElement("div", h);
        e.className = "calendar_month_container_head border_b";
        var n = this.date.getFullYear();
        e.innerHTML = '<input type="button" style="width:20px;" value="&#x00ab;" onclick="Calendar.increaseYearInput(-1);"/><input id="inputYear" type="text" value="' + n + '" size="4"/><input type="button" style="width:20px;" value="&#x00bb;"  onclick="Calendar.increaseYearInput(1);"/>';
        var d = Calendar.createElement("div", h);
        d.className = "calendar_month_container_body";
        for (u = 0; u < Calendar._MN.length; ++u) {
            var v = Calendar.createElement("a");
            v.month = u;
            if (u == this.date.getMonth()) {
                v.className = "current"
            }
            v.innerHTML = Calendar._SMN[u];
            Calendar.addEvent(v, "click", function (j) {
                var i = Calendar.getElement(j);
                var B = i.calendar;
                B.date.setMonth(i.month);
                B.date.setFullYear(document.getElementById("inputYear").value);
                B.callHandler();
                B.callCloseHandler()
            });
            v.calendar = this;
            d.appendChild(v)
        }
        p.appendChild(h);
        z.style.display = "none"
    }
    var y = Calendar.createElement("thead", z);
    var c = null;
    var g = null;
    var o = this;
    var f = function (B, j, i) {
        c = Calendar.createElement("td", g);
        c.colSpan = j;
        c.className = "button";
        if (i != 0 && Math.abs(i) <= 2) {
            c.className += " nav"
        }
        Calendar._add_evs(c);
        c.calendar = o;
        c.navtype = i;
        c.innerHTML = "<div unselectable='on'>" + B + "</div>";
        return c
    };
    g = Calendar.createElement("tr", y);
    var A = 6;
    (this.isPopup) && --A;
    (this.weekNumbers) && ++A;
    f("?", 1, 400).ttip = Calendar._TT.INFO;
    this.title = f("", A, 300);
    this.title.className = "title";
    if (this.isPopup) {
        this.title.ttip = Calendar._TT.DRAG_TO_MOVE;
        this.title.style.cursor = "move";
        f("&#x00d7;", 1, 200).ttip = Calendar._TT.CLOSE
    }
    g = Calendar.createElement("tr", y);
    g.className = "headrow";
    this._nav_py = f("&#x00ab;", 1, -2);
    this._nav_py.ttip = Calendar._TT.PREV_YEAR;
    this._nav_pm = f("&#x2039;", 1, -1);
    this._nav_pm.ttip = Calendar._TT.PREV_MONTH;
    this._nav_now = f(Calendar._TT.TODAY, this.weekNumbers ? 4 : 3, 0);
    this._nav_now.ttip = Calendar._TT.GO_TODAY;
    this._nav_nm = f("&#x203a;", 1, 1);
    this._nav_nm.ttip = Calendar._TT.NEXT_MONTH;
    this._nav_ny = f("&#x00bb;", 1, 2);
    this._nav_ny.ttip = Calendar._TT.NEXT_YEAR;
    g = Calendar.createElement("tr", y);
    g.className = "daynames";
    if (this.weekNumbers) {
        c = Calendar.createElement("td", g);
        c.className = "name wn";
        c.innerHTML = Calendar._TT.WK
    }
    for (var u = 7; u > 0; --u) {
        c = Calendar.createElement("td", g);
        if (!u) {
            c.navtype = 100;
            c.calendar = this;
            Calendar._add_evs(c)
        }
    }
    this.firstdayname = (this.weekNumbers) ? g.firstChild.nextSibling : g.firstChild;
    this._displayWeekdays();
    var a = Calendar.createElement("tbody", z);
    this.tbody = a;
    for (u = 6; u > 0; --u) {
        g = Calendar.createElement("tr", a);
        if (this.weekNumbers) {
            c = Calendar.createElement("td", g)
        }
        for (var r = 7; r > 0; --r) {
            c = Calendar.createElement("td", g);
            c.calendar = this;
            Calendar._add_evs(c)
        }
    }
    if (this.showsTime) {
        g = Calendar.createElement("tr", a);
        g.className = "time";
        c = Calendar.createElement("td", g);
        c.className = "time";
        c.colSpan = 7;
        c.innerHTML = getTimeTableHTML(this.date.getHours(), this.date.getMinutes(), this.params.minuteStep, this.params.hideOkClearButton);
        g = Calendar.createElement("tr", a);
        g.className = "time";
        g.style.display = "none";
        c = Calendar.createElement("td", g);
        c.className = "time";
        c.colSpan = 2;
        c.innerHTML = Calendar._TT.TIME || "&nbsp;";
        c = Calendar.createElement("td", g);
        c.className = "time";
        c.colSpan = this.weekNumbers ? 4 : 3;
        (function () {
            function C(L, N, M, O) {
                var J = Calendar.createElement("span", c);
                J.className = L;
                J.innerHTML = N;
                J.calendar = o;
                J.ttip = Calendar._TT.TIME_PART;
                J.navtype = 50;
                J._range = [];
                if (typeof M != "number") {
                    J._range = M
                } else {
                    for (var K = M; K <= O; ++K) {
                        var H;
                        if (K < 10 && O >= 10) {
                            H = "0" + K
                        } else {
                            H = "" + K
                        }
                        J._range[J._range.length] = H
                    }
                }
                Calendar._add_evs(J);
                return J
            }
            var G = o.date.getHours();
            var i = o.date.getMinutes();
            var I = !o.time24;
            var j = (G > 12);
            if (I && j) {
                G -= 12
            }
            var E = C("hour", G, I ? 1 : 0, I ? 12 : 23);
            var D = Calendar.createElement("span", c);
            D.innerHTML = ":";
            D.className = "colon";
            var B = C("minute", i, 0, 59);
            var F = null;
            c = Calendar.createElement("td", g);
            c.className = "time";
            c.colSpan = 2;
            if (I) {
                F = C("ampm", j ? "pm" : "am", ["am", "pm"])
            } else {
                c.innerHTML = "&nbsp;"
            }
            o.onSetTime = function () {
                var J, H = this.date.getHours(), K = this.date.getMinutes();
                if (I) {
                    J = (H >= 12);
                    if (J) {
                        H -= 12
                    }
                    if (H == 0) {
                        H = 12
                    }
                    F.innerHTML = J ? "pm" : "am"
                }
                E.innerHTML = (H < 10) ? ("0" + H) : H;
                B.innerHTML = (K < 10) ? ("0" + K) : K
            }

            o.onUpdateTime = function () {
                var J = this.date;
                var K = parseInt(E.innerHTML, 10);
                if (I) {
                    if (/pm/i.test(F.innerHTML) && K < 12) {
                        K += 12
                    } else {
                        if (/am/i.test(F.innerHTML) && K == 12) {
                            K = 0
                        }
                    }
                }
                var L = J.getDate();
                var H = J.getMonth();
                var M = J.getFullYear();
                J.setHours(K);
                J.setMinutes(parseInt(B.innerHTML, 10));
                J.setFullYear(M);
                J.setMonth(H);
                J.setDate(L);
                this.dateClicked = false;
                this.callHandler()
            }
        }
        )()
    } else {
        this.onSetTime = this.onUpdateTime = function () { }
    }
    var m = Calendar.createElement("tfoot", z);
    if (this.isClear) {
        var x = m.insertRow(0);
        x.className = "footrow ttip";
        var b = x.insertCell(0);
        b.colSpan = this.weekNumbers ? 8 : 7;
        var t = Calendar.createElement("table", b);
        t.width = "100%";
        g = t.insertRow(0);
        c = f(Calendar._TT.SEL_DATE, 1, 300);
        c.className = "ttip1";
        if (self != top) {
            c.style.width = "95px"
        } else {
            c.style.width = "178px"
        }
        c.style.color = "#999";
        if (this.isPopup) {
            c.ttip = Calendar._TT.DRAG_TO_MOVE;
            c.style.cursor = "move"
        }
        this.tooltips = c;
        if (!this.params.hideOkClearButton) {
            var k = g.insertCell(1);
            k.nowrap = "nowrap";
            k.width = "50";
            var w = Calendar.createElement("span", k);
            w.innerHTML = getCalendarI18n("common.button.ok.label");
            w.href = "javascript:void(0)";
            w.className = "common_button common_button_emphasize margin_r_5";
            Calendar.addEvent(w, "click", function (j) {
                var i = Calendar.getElement(j);
                var B = i.calendar;
                B.callHandler();
                B.callCloseHandler()
            });
            w.calendar = o;
            if (this.clearBlank) {
                k = g.insertCell(2);
                k.nowrap = "nowrap";
                k.width = "50";
                w = Calendar.createElement("span", k);
                w.innerHTML = getCalendarI18n("common.button.clear.label");
                w.className = "common_button common_button_gray";
                w.href = "javascript:void(0)";
                Calendar._add_clear_evs(w);
                w.calendar = o
            }
        }
    } else {
        g = Calendar.createElement("tr", m);
        g.className = "footrow";
        c = f(Calendar._TT.SEL_DATE, this.weekNumbers ? 8 : 7, 300);
        c.className = "ttip";
        if (this.isPopup) {
            c.ttip = Calendar._TT.DRAG_TO_MOVE;
            c.style.cursor = "move"
        }
        this.tooltips = c
    }
    p = Calendar.createElement("div", this.element);
    this.monthsCombo = p;
    p.className = "combo";
    for (u = 0; u < Calendar._MN.length; ++u) {
        var v = Calendar.createElement("div");
        v.className = Calendar.is_ie ? "label-IEfix" : "label";
        v.month = u;
        v.innerHTML = Calendar._SMN[u];
        p.appendChild(v)
    }
    p = Calendar.createElement("div", this.element);
    this.yearsCombo = p;
    p.className = "combo";
    for (u = 12; u > 0; --u) {
        var s = Calendar.createElement("div");
        s.className = Calendar.is_ie ? "label-IEfix" : "label";
        p.appendChild(s)
    }
    if (this.isPopup) {
        this.iframe = Calendar.createElement("iframe");
        this.iframe.className = "calendar_iframe";
        this.iframe.style.border = "0";
        if (!this.showsTime) {
            this.iframe.style.display = "none";
            this.iframe.style.height = "170px"
        }
        l.appendChild(this.iframe)
    }
    this._init(this.firstDayOfWeek, this.date);
    l.appendChild(this.element)
}

Calendar._add_clear_evs = function (el) {
    with (Calendar) {
        addEvent(el, "click", callClearHandler)
    }
}

Calendar.callClearHandler = function (ev) {
    with (Calendar) {
        var el = getElement(ev);
        if (el.calendar) {
            if (el.calendar.params.inputField) {
                el.calendar.params.inputField.value = "";
                el.calendar.params.inputField.focus();
                if ($) {
                    $(el.calendar.params.inputField).trigger("change")
                }
            } else {
                if (el.calendar.params.displayArea) {
                    if (el.calendar.params.displayArea.nodeName && el.calendar.params.displayArea.nodeName == "INPUT") {
                        el.calendar.params.displayArea.value = "";
                        el.calendar.params.displayArea.focus()
                    }
                }
            }
            el.calendar.callCloseHandler();
            if (typeof (el.calendar.onClear) == "function") {
                el.calendar.onClear()
            }
        }
    }
}

Calendar._keyEvent = function (l) {
    var a = window._dynarch_popupCalendar;
    if (!a || a.multiple) {
        return false
    }
    (Calendar.is_ie) && (l = window.event);
    var j = (Calendar.is_ie || l.type == "keypress")
        , m = l.keyCode;
    var i = Calendar.getElement(l);
    if (i && (i.id == "inputYear")) {
        var n = document.getElementById("inputYear");
        return true
    }
    if (l.ctrlKey) {
        switch (m) {
            case 37:
                j && Calendar.cellClick(a._nav_pm);
                break;
            case 38:
                j && Calendar.cellClick(a._nav_py);
                break;
            case 39:
                j && Calendar.cellClick(a._nav_nm);
                break;
            case 40:
                j && Calendar.cellClick(a._nav_ny);
                break;
            default:
                return false
        }
    } else {
        switch (m) {
            case 32:
                Calendar.cellClick(a._nav_now);
                break;
            case 27:
                j && a.callCloseHandler();
                break;
            case 37:
            case 38:
            case 39:
            case 40:
                if (j) {
                    var e, o, k, g, c, d;
                    e = m == 37 || m == 38;
                    d = (m == 37 || m == 39) ? 1 : 7;
                    function b() {
                        c = a.currentDateEl;
                        var q = c.pos;
                        o = q & 15;
                        k = q >> 4;
                        g = a.ar_days[k][o]
                    }
                    b();
                    function f() {
                        var p = new Date(a.date);
                        p.setDate(p.getDate() - d);
                        a.setDate(p)
                    }
                    function h() {
                        var p = new Date(a.date);
                        p.setDate(p.getDate() + d);
                        a.setDate(p)
                    }
                    while (1) {
                        switch (m) {
                            case 37:
                                if (--o >= 0) {
                                    g = a.ar_days[k][o]
                                } else {
                                    o = 6;
                                    m = 38;
                                    continue
                                }
                                break;
                            case 38:
                                if (--k >= 0) {
                                    g = a.ar_days[k][o]
                                } else {
                                    f();
                                    b()
                                }
                                break;
                            case 39:
                                if (++o < 7) {
                                    g = a.ar_days[k][o]
                                } else {
                                    o = 0;
                                    m = 40;
                                    continue
                                }
                                break;
                            case 40:
                                if (++k < a.ar_days.length) {
                                    g = a.ar_days[k][o]
                                } else {
                                    h();
                                    b()
                                }
                                break
                        }
                        break
                    }
                    if (g) {
                        if (!g.disabled) {
                            Calendar.cellClick(g)
                        } else {
                            if (e) {
                                f()
                            } else {
                                h()
                            }
                        }
                    }
                }
                break;
            case 13:
                if (j) {
                    Calendar.cellClick(a.currentDateEl, l)
                }
                break;
            default:
                return false
        }
    }
    return Calendar.stopEvent(l)
}

Calendar.prototype._init = function (m, w) {
    initCalendar();
    var v = new Date()
        , q = v.getFullYear()
        , y = v.getMonth()
        , b = v.getDate();
    this.table.style.visibility = "hidden";
    var h = w.getFullYear();
    if (h < this.minYear) {
        h = this.minYear;
        w.setFullYear(h)
    } else {
        if (h > this.maxYear) {
            h = this.maxYear;
            w.setFullYear(h)
        }
    }
    this.firstDayOfWeek = m;
    this.date = new Date(w);
    var x = w.getMonth();
    var A = w.getDate();
    var z = w.getMonthDays();
    w.setDate(1);
    var r = (w.getDay() - this.firstDayOfWeek) % 7;
    if (r < 0) {
        r += 7
    }
    w.setDate(-r);
    w.setDate(w.getDate() + 1);
    var e = this.tbody.firstChild;
    var k = Calendar._SMN[x];
    var o = this.ar_days = new Array();
    var n = Calendar._TT.WEEKEND;
    var d = this.multiple ? (this.datesCells = {}) : null;
    for (var t = 0; t < 6; ++t,
        e = e.nextSibling) {
        var a = e.firstChild;
        if (this.weekNumbers) {
            a.className = "day wn";
            a.innerHTML = w.getWeekNumber();
            a = a.nextSibling
        }
        e.className = "daysrow";
        var u = false, f, c = o[t] = [];
        for (var s = 0; s < 7; ++s,
            a = a.nextSibling,
            w.setDate(f + 1)) {
            f = w.getDate();
            var g = w.getDay();
            a.className = "day";
            a.pos = t << 4 | s;
            c[s] = a;
            var l = (w.getMonth() == x);
            if (!l) {
                if (this.showsOtherMonths) {
                    a.className += " othermonth";
                    a.otherMonth = true
                } else {
                    a.className = "emptycell";
                    a.innerHTML = "&nbsp;";
                    a.disabled = true;
                    continue
                }
            } else {
                a.otherMonth = false;
                u = true
            }
            a.disabled = false;
            a.innerHTML = this.getDateText ? this.getDateText(w, f) : f;
            if (d) {
                d[w.print("%Y%m%d")] = a
            }
            if (this.getDateStatus) {
                var p = this.getDateStatus(w, h, x, f);
                if (p === true) {
                    a.className += " disabled";
                    a.disabled = true
                } else {
                    if (/disabled/i.test(p)) {
                        a.disabled = true
                    }
                    a.className += " " + p
                }
            }
            if (!a.disabled) {
                a.caldate = new Date(w);
                a.ttip = "_";
                if (!this.multiple && l && f == A && this.hiliteToday) {
                    a.className += " selected";
                    this.currentDateEl = a
                }
                if (w.getFullYear() == q && w.getMonth() == y && f == b) {
                    a.className += " today";
                    a.ttip += Calendar._TT.PART_TODAY
                }
                if (n.indexOf(g.toString()) != -1) {
                    a.className += a.otherMonth ? " oweekend" : " weekend"
                }
            }
        }
        if (!(u || this.showsOtherMonths)) {
            e.className = "emptyrow"
        }
    }
    this.title.innerHTML = Calendar._MN[x] + ", " + h;
    this.onSetTime();
    this.table.style.visibility = "visible";
    this._initMultipleDates()
}

Calendar.prototype._initMultipleDates = function () {
    if (this.multiple) {
        for (var b in this.multiple) {
            var a = this.datesCells[b];
            var c = this.multiple[b];
            if (!c) {
                continue
            }
            if (a) {
                a.className += " selected"
            }
        }
    }
}

Calendar.prototype._toggleMultipleDate = function (b) {
    if (this.multiple) {
        var c = b.print("%Y%m%d");
        var a = this.datesCells[c];
        if (a) {
            var e = this.multiple[c];
            if (!e) {
                Calendar.addClass(a, "selected");
                this.multiple[c] = b
            } else {
                Calendar.removeClass(a, "selected");
                delete this.multiple[c]
            }
        }
    }
}

Calendar.prototype.setClear = function (a) {
    this.isClear = a
}

Calendar.prototype.setClearBlank = function (a) {
    this.clearBlank = a
}

Calendar.prototype.setHeight = function (a) {
    this.height = a
}

Calendar.prototype.setDateToolTipHandler = function (a) {
    this.getDateToolTip = a
}

Calendar.prototype.setDate = function (b) {
    if (this.dateFormat == "%Y-%m") {
        var c = SeeUtils.getByClass(document, "calendar_month_container_body");
        var d = SeeUtils.getElByTag(c[0], "a");
        var e = b.getMonth();
        for (var a = 0; a < d.length; a++) {
            SeeUtils.removeClass(d[a], "current");
            if (e === a) {
                SeeUtils.addClass(d[a], "current")
            }
            SeeUtils.setElVal("inputYear", b.getFullYear())
        }
    } else {
        if (!b.equalsTo(this.date)) {
            this._init(this.firstDayOfWeek, b)
        }
    }
}

Calendar.prototype.refresh = function () {
    this._init(this.firstDayOfWeek, this.date)
}

Calendar.prototype.setFirstDayOfWeek = function (a) {
    this._init(a, this.date);
    this._displayWeekdays()
}

Calendar.prototype.setDateStatusHandler = Calendar.prototype.setDisabledHandler = function (a) {
    this.getDateStatus = a
}

Calendar.prototype.setRange = function (b, c) {
    this.minYear = b;
    this.maxYear = c
}

Calendar.prototype.callHandler = function () {
    if (this.onSelected) {
        this.onSelected(this, this.date.print(this.dateFormat))
    }
}

Calendar.prototype.closeIdx = 0;
Calendar.prototype.callCloseHandler = function () {
    this.closeIdx++;
    if (this.closeIdx >= 2 && this.params.cache == false) {
        return
    }
    if (this.onClose) {
        this.onClose(this)
    }
    this.hideShowCovered();
    if (this.clearCloseIdx) {
        this.clearCloseIdx()
    }
}

Calendar.prototype.destroy = function () {
    var a = this.element.parentNode;
    a.removeChild(this.element);
    if (this.isPopup) {
        a.removeChild(this.iframe)
    }
    Calendar._C = null;
    window._dynarch_popupCalendar = null
}

Calendar.prototype.reparent = function (b) {
    var a = this.element;
    a.parentNode.removeChild(a);
    b.appendChild(a)
}

Calendar._checkCalendar = function (b) {
    var c = window._dynarch_popupCalendar;
    if (!c) {
        return false
    }
    var a = Calendar.is_ie ? Calendar.getElement(b) : Calendar.getTargetElement(b);
    for (; a != null && a != c.element; a = a.parentNode) { }
    if (a == null) {
        window._dynarch_popupCalendar.callCloseHandler();
        return Calendar.stopEvent(b)
    }
}

Calendar.prototype.show = function () {
    var q = this.table.getElementsByTagName("tr");
    for (var f = q.length; f > 0;) {
        var p = q[--f];
        Calendar.removeClass(p, "rowhilite");
        var o = p.getElementsByTagName("td");
        for (var d = o.length; d > 0;) {
            var n = o[--d];
            Calendar.removeClass(n, "hilite");
            Calendar.removeClass(n, "active")
        }
    }
    this.element.style.display = "block";
    this.hidden = false;
    try {
        hideOfficeObj()
    } catch (h) { }
    if (this.isPopup) {
        window._dynarch_popupCalendar = this;
        Calendar.addEvent(document, "keydown", Calendar._keyEvent);
        Calendar.addEvent(document, "keypress", Calendar._keyEvent);
        Calendar.addEvent(document, "mousedown", Calendar._checkCalendar);
        this.iframe.style.display = "block"
    }
    this.hideShowCovered();
    var l = false;
    var k = document.getElementById("timeMinutes");
    if (k) {
        var b = this.date.getMinutes();
        var a = this.params.minuteStep;
        if (a) {
            if (b % a != 0) {
                b = b + a - (b % a)
            }
            if (b == 60) {
                b = 0;
                l = true
            }
        }
        this.date.setMinutes(b);
        if (b < 10) {
            b = "0" + b
        }
        k.value = b
    }
    var c = this.date.getHours();
    if (l) {
        this.date.setHours(++c)
    }
    var g = document.getElementById("timeHours");
    if (g) {
        if (c < 10) {
            c = "0" + c
        }
        g.value = c
    }
}

Calendar.prototype.hide = function () {
    if (this.isPopup) {
        Calendar.removeEvent(document, "keydown", Calendar._keyEvent);
        Calendar.removeEvent(document, "keypress", Calendar._keyEvent);
        Calendar.removeEvent(document, "mousedown", Calendar._checkCalendar)
    }
    this.element.style.display = "none";
    try {
        showOfficeObj()
    } catch (a) { }
    if (this.isPopup) {
        this.iframe.style.display = "none"
    }
    this.hidden = true;
    this.hideShowCovered()
}

Calendar.prototype.showAt = function (a, d) {
    if (isNaN(d)) {
        d = 0
    }
    if (isNaN(a)) {
        a = 0
    }
    var c = this.element.style;
    c.left = a + "px";
    c.top = d > 0 ? d + "px" : "0px";
    this.show();
    if (this.isPopup) {
        this.iframe.style.left = a - 2 + "px";
        this.iframe.style.top = d + "px";
        this.iframe.style.border = 0;
        this.iframe.style.display = "block";
        var b = 214;
        if (SeeUtils.getElWidth(this.element) < b) {
            SeeUtils.setElWidth(this.iframe, b + 10);
            SeeUtils.setElWidth(this.element, b);
            SeeUtils.setElHeight(this.iframe, SeeUtils.getElHeight(this.element) + 20)
        } else {
            SeeUtils.setElWidth(this.iframe, SeeUtils.getElWidth(this.element) + 10);
            SeeUtils.setElHeight(this.iframe, SeeUtils.getElHeight(this.element) + 20)
        }
    }
}

Calendar.prototype.showAtElement = function (c, d) {
    var a = this;
    var e = Calendar.getAbsolutePos(c);
    if (!d || typeof d != "string") {
        this.showAt(e.x, e.y + c.offsetHeight);
        return true
    }
    function b(j) {
        if (j.x < 0) {
            j.x = 0
        }
        if (j.y < 0) {
            j.y = 0
        }
        var k = document.createElement("div");
        var i = k.style;
        i.position = "absolute";
        i.right = i.bottom = i.width = i.height = "0px";
        document.body.appendChild(k);
        var g = Calendar.getAbsolutePos(k);
        document.body.removeChild(k);
        if (Calendar.is_ie) {
            g.y += document.body.scrollTop;
            g.x += document.body.scrollLeft;
            g.x += document.documentElement.scrollLeft;
            var h = parseInt(document.documentElement.scrollTop);
            if (h && h > 0) {
                g.y += h
            }
        } else {
            g.y += window.scrollY;
            g.x += window.scrollX
        }
        var f = j.x + j.width - g.x;
        if (f > 0) {
            j.x -= f
        }
        f = j.y + j.height - g.y;
        if (f > 0) {
            j.y -= f
        }
    }
    this.element.style.display = "block";
    Calendar.continuation_for_the_fucking_khtml_browser = function () {
        var f = a.element.offsetWidth;
        var i = a.element.offsetHeight;
        a.element.style.display = "none";
        var g = d.substr(0, 1);
        var j = "l";
        if (d.length > 1) {
            j = d.substr(1, 1)
        }
        switch (g) {
            case "T":
                e.y -= i;
                break;
            case "B":
                e.y += c.offsetHeight;
                break;
            case "C":
                e.y += (c.offsetHeight - i) / 2;
                break;
            case "t":
                e.y += c.offsetHeight - i;
                break;
            case "b":
                break
        }
        switch (j) {
            case "L":
                e.x -= f;
                break;
            case "R":
                e.x += c.offsetWidth;
                break;
            case "C":
                e.x += (c.offsetWidth - f) / 2;
                break;
            case "l":
                e.x += c.offsetWidth - f;
                break;
            case "r":
                break
        }
        e.width = f;
        e.height = i + 40;
        a.monthsCombo.style.display = "none";
        b(e);
        a.showAt(e.x, e.y)
    }

    if (Calendar.is_khtml) {
        setTimeout("Calendar.continuation_for_the_fucking_khtml_browser()", 10)
    } else {
        Calendar.continuation_for_the_fucking_khtml_browser()
    }
}

Calendar.prototype.setDateFormat = function (a) {
    this.dateFormat = a
}

Calendar.prototype.getDateFormat = function () {
    return this.dateFormat
}

Calendar.prototype.setTtDateFormat = function (a) {
    this.ttDateFormat = a
}

Calendar.prototype.parseDate = function (b, a) {
    if (!a) {
        a = this.dateFormat
    }
    this.setDate(Date.parseDate(b, a))
}

Calendar.prototype.hideShowCovered = function () {
    if (Calendar.is_ie || Calendar.is_opera) {
        return
    }
    if (!Calendar.is_ie && !Calendar.is_opera) {
        return
    }
    function b(k) {
        var i = k.style.visibility;
        if (!i) {
            if (document.defaultView && typeof (document.defaultView.getComputedStyle) == "function") {
                if (!Calendar.is_khtml) {
                    i = document.defaultView.getComputedStyle(k, "").getPropertyValue("visibility")
                } else {
                    i = ""
                }
            } else {
                if (k.currentStyle) {
                    i = k.currentStyle.visibility
                } else {
                    i = ""
                }
            }
        }
        return i
    }
    var s = new Array("applet", "iframe");
    var c = this.element;
    var a = Calendar.getAbsolutePos(c);
    var f = a.x;
    var d = c.offsetWidth + f;
    var r = a.y;
    var q = c.offsetHeight + r;
    for (var h = s.length; h > 0;) {
        var g = document.getElementsByTagName(s[--h]);
        var e = null;
        for (var l = g.length; l > 0;) {
            e = g[--l];
            a = Calendar.getAbsolutePos(e);
            var o = a.x;
            var n = e.offsetWidth + o;
            var m = a.y;
            var j = e.offsetHeight + m;
            if (this.hidden || (o > d) || (n < f) || (m > q) || (j < r)) {
                if (!e.__msh_save_visibility) {
                    e.__msh_save_visibility = b(e)
                }
                e.style.visibility = e.__msh_save_visibility
            } else {
                if (!e.__msh_save_visibility) {
                    e.__msh_save_visibility = b(e)
                }
                if (e.name == "timeHours" || e.name == "timeMinutes" || e.className == "cke_wysiwyg_frame cke_reset" || e.id == "mainbodyFrame" || e.id == "fckedit___Frame" || e.id == "officeEditorFrame" || e.className == "calendar_iframe" || e.id == "content" || SeeUtils.hasClass(e, "calendar_show_iframe")) {
                    continue
                }
                e.style.visibility = "hidden"
            }
        }
    }
}

Calendar.prototype._displayWeekdays = function () {
    initCalendar();
    var b = this.firstDayOfWeek;
    var a = this.firstdayname;
    var d = Calendar._TT.WEEKEND;
    for (var c = 0; c < 7; ++c) {
        a.className = "day name";
        var e = (c + b) % 7;
        if (c) {
            a.ttip = Calendar._TT.DAY_FIRST.replace("%s", Calendar._DN[e]);
            a.navtype = 100;
            a.calendar = this;
            a.fdow = e;
            Calendar._add_evs(a)
        }
        if (d.indexOf(e.toString()) != -1) {
            Calendar.addClass(a, "weekend")
        }
        a.innerHTML = Calendar._SDN[(c + b) % 7];
        a = a.nextSibling
    }
}

Calendar.prototype._hideCombos = function () {
    this.monthsCombo.style.display = "none";
    this.yearsCombo.style.display = "none"
}

Calendar.prototype._dragStart = function (ev) {
    if (this.dragging) {
        return
    }
    this.dragging = true;
    var posX;
    var posY;
    if (Calendar.is_ie) {
        posY = window.event.clientY + document.body.scrollTop;
        posX = window.event.clientX + document.body.scrollLeft
    } else {
        posY = ev.clientY + window.scrollY;
        posX = ev.clientX + window.scrollX
    }
    var st = this.element.style;
    this.xOffs = posX - parseInt(st.left);
    this.yOffs = posY - parseInt(st.top);
    with (Calendar) {
        addEvent(document, "mousemove", calDragIt);
        addEvent(document, "mouseup", calDragEnd)
    }
}

Date._MD = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
Date.SECOND = 1000;
Date.MINUTE = 60 * Date.SECOND;
Date.HOUR = 60 * Date.MINUTE;
Date.DAY = 24 * Date.HOUR;
Date.WEEK = 7 * Date.DAY;
Date.parseDate = function (l, c) {
    initCalendar();
    var n = new Date();
    var o = 0;
    var e = -1;
    var k = 0;
    var q = l.split(/\W+/);
    var p = c.match(/%./g);
    var h = 0
        , g = 0;
    var r = 0;
    var f = 0;
    for (h = 0; h < q.length; ++h) {
        if (!q[h]) {
            continue
        }
        switch (p[h]) {
            case "%d":
            case "%e":
                k = parseInt(q[h], 10);
                break;
            case "%m":
                e = parseInt(q[h], 10) - 1;
                break;
            case "%Y":
            case "%y":
                o = parseInt(q[h], 10);
                (o < 100) && (o += (o > 29) ? 1900 : 2000);
                break;
            case "%b":
            case "%B":
                for (g = 0; g < 12; ++g) {
                    if (Calendar._MN[g].substr(0, q[h].length).toLowerCase() == q[h].toLowerCase()) {
                        e = g;
                        break
                    }
                }
                break;
            case "%H":
            case "%I":
            case "%k":
            case "%l":
                r = parseInt(q[h], 10);
                break;
            case "%P":
            case "%p":
                if (/pm/i.test(q[h]) && r < 12) {
                    r += 12
                } else {
                    if (/am/i.test(q[h]) && r >= 12) {
                        r -= 12
                    }
                }
                break;
            case "%M":
                f = parseInt(q[h], 10);
                break
        }
    }
    if (isNaN(o)) {
        o = n.getFullYear()
    }
    if (isNaN(e)) {
        e = n.getMonth()
    }
    if (isNaN(k)) {
        k = n.getDate()
    }
    if (isNaN(r)) {
        r = n.getHours()
    }
    if (isNaN(f)) {
        f = n.getMinutes()
    }
    if (o != 0 && e != -1 && "%Y-%m" == c) {
        return new Date(o, e, 1, 0, 0, 0)
    }
    if (o != 0 && e != -1 && k != 0) {
        return new Date(o, e, k, r, f, 0)
    }
    o = 0;
    e = -1;
    k = 0;
    for (h = 0; h < q.length; ++h) {
        if (q[h].search(/[a-zA-Z]+/) != -1) {
            var s = -1;
            for (g = 0; g < 12; ++g) {
                if (Calendar._MN[g].substr(0, q[h].length).toLowerCase() == q[h].toLowerCase()) {
                    s = g;
                    break
                }
            }
            if (s != -1) {
                if (e != -1) {
                    k = e + 1
                }
                e = s
            }
        } else {
            if (parseInt(q[h], 10) <= 12 && e == -1) {
                e = q[h] - 1
            } else {
                if (parseInt(q[h], 10) > 31 && o == 0) {
                    o = parseInt(q[h], 10);
                    (o < 100) && (o += (o > 29) ? 1900 : 2000)
                } else {
                    if (k == 0) {
                        k = q[h]
                    }
                }
            }
        }
    }
    if (o == 0) {
        o = n.getFullYear()
    }
    if (e != -1 && k != 0) {
        return new Date(o, e, k, r, f, 0)
    }
    return n
}

Date.prototype.getMonthDays = function (b) {
    var a = this.getFullYear();
    if (typeof b == "undefined") {
        b = this.getMonth()
    }
    if (((0 == (a % 4)) && ((0 != (a % 100)) || (0 == (a % 400)))) && b == 1) {
        return 29
    } else {
        return Date._MD[b]
    }
}

Date.prototype.getDayOfYear = function () {
    var a = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var c = new Date(this.getFullYear(), 0, 0, 0, 0, 0);
    var b = a - c;
    return Math.floor(b / Date.DAY)
}

Date.prototype.getWeekNumber = function () {
    var c = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var b = c.getDay();
    c.setDate(c.getDate() - (b + 6) % 7 + 3);
    var a = c.valueOf();
    c.setMonth(0);
    c.setDate(4);
    return Math.round((a - c.valueOf()) / (7 * 86400000)) + 1
}

Date.prototype.equalsTo = function (a) {
    return ((this.getFullYear() == a.getFullYear()) && (this.getMonth() == a.getMonth()) && (this.getDate() == a.getDate()) && (this.getHours() == a.getHours()) && (this.getMinutes() == a.getMinutes()))
}

Date.prototype.setDateOnly = function (a) {
    var b = new Date(a);
    this.setDate(1);
    this.setFullYear(b.getFullYear());
    this.setMonth(b.getMonth());
    this.setDate(b.getDate())
}

Date.prototype.print = function (l) {
    initCalendar();
    var b = this.getMonth();
    var k = this.getDate();
    var n = this.getFullYear();
    var p = this.getWeekNumber();
    var q = this.getDay();
    var v = {};
    var r = this.getHours();
    var c = (r >= 12);
    var h = (c) ? (r - 12) : r;
    var u = this.getDayOfYear();
    if (h == 0) {
        h = 12
    }
    var e = this.getMinutes();
    var j = this.getSeconds();
    v["%a"] = Calendar._SDN[q];
    v["%A"] = Calendar._DN[q];
    v["%b"] = Calendar._SMN[b];
    v["%B"] = Calendar._MN[b];
    v["%C"] = 1 + Math.floor(n / 100);
    v["%d"] = (k < 10) ? ("0" + k) : k;
    v["%e"] = k;
    v["%H"] = (r < 10) ? ("0" + r) : r;
    v["%I"] = (h < 10) ? ("0" + h) : h;
    v["%j"] = (u < 100) ? ((u < 10) ? ("00" + u) : ("0" + u)) : u;
    v["%k"] = r;
    v["%l"] = h;
    v["%m"] = (b < 9) ? ("0" + (1 + b)) : (1 + b);
    v["%M"] = (e < 10) ? ("0" + e) : e;
    v["%n"] = "\n";
    v["%p"] = c ? "PM" : "AM";
    v["%P"] = c ? "pm" : "am";
    v["%s"] = Math.floor(this.getTime() / 1000);
    v["%S"] = (j < 10) ? ("0" + j) : j;
    v["%t"] = "\t";
    v["%U"] = v["%W"] = v["%V"] = (p < 10) ? ("0" + p) : p;
    v["%u"] = q + 1;
    v["%w"] = q;
    v["%y"] = ("" + n).substr(2, 2);
    v["%Y"] = n;
    v["%%"] = "%";
    var t = /%./g;
    if (!Calendar.is_ie5 && !Calendar.is_khtml) {
        return l.replace(t, function (a) {
            return v[a] || a
        })
    }
    var o = l.match(t);
    for (var g = 0; g < o.length; g++) {
        var f = v[o[g]];
        if (f) {
            t = new RegExp(o[g], "g");
            l = l.replace(t, f)
        }
    }
    return l
}

window._dynarch_popupCalendar = null;
Calendar.increaseYearInput = function (b) {
    var a = document.getElementById("inputYear");
    if (a) {
        a.value = parseInt(a.value) + b
    }
}

function getTimeTableHTML(g, l, e, h) {
    var k;
    var c;
    if (!e) {
        e = 10
    }
    var b = new Date();
    if (!g && (g != 0)) {
        g = b.getHours()
    }
    if (!l && (l != 0)) {
        l = b.getMinutes()
    }
    if (document.getElementById("timeHours")) {
        document.getElementById("timeHours").parentElement.innerHTML = ""
    }
    if (document.getElementById("timeMinutes")) {
        document.getElementById("timeMinutes").parentElement.innerHTML = ""
    }
    var f = 0;
    var d = "";
    var j = "";
    var m = "";
    var a = "cal.callHandler();";
    if (!h) {
        a = ""
    }
    m += '<table border="0" cellspacing="0" cellpadding="0">';
    m += " <tr>";
    m += ' <td width=40 colspan="2" align="left">' + Calendar._TT.TIME + "</td>";
    m += " <td>";
    m += ' <select name="timeHours" id="timeHours" style="width: 50px; height:20px; visibility: visible" onchange="var cal = Calendar.getCalendar(this);cal.date.setHours(this.value);' + a + '">';
    for (f = 0; f < 24; f++) {
        d = (f == g || f == c) ? " selected" : "";
        m += '<option value="' + (f < 10 ? "0" + f : f) + '"' + d + ">" + (f < 10 ? "0" + f : f) + "</option>"
    }
    m += " </select>";
    m += " </td>";
    m += " <td width=30>&nbsp;" + Calendar._TT.HOUR + "&nbsp;</td>";
    m += " <td>";
    m += " <select name='timeMinutes' id='timeMinutes' style='width: 50px; height:20px; visibility: visible' onchange='var cal = Calendar.getCalendar(this);cal.date.setMinutes(this.value);" + a + "'>";
    for (f = 0; f < 60; f += e) {
        j = (f == l || f == k) ? " selected" : "";
        m += '<option value="' + (f < 10 ? "0" + f : f) + '"' + j + ">" + (f < 10 ? "0" + f : f) + "</option>"
    }
    m += " </select>";
    m += " </td>";
    m += " <td>&nbsp;&nbsp;" + Calendar._TT.MINUTE + "</td>";
    m += " </tr>";
    m += "</table>";
    return m
}
function getCalendarI18n(a) {
    var b = getA8Top();
    if (b && (typeof b.$ !== "undefined") && (typeof b.$.i18n !== "undefined")) {
        return b.$.i18n(a)
    } else {
        return b.v3x.getMessage("V3XLang." + a)
    }
}
(function (c) {
    c.hotkeys = {
        version: "0.8",
        specialKeys: {
            8: "backspace",
            9: "tab",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            191: "/",
            224: "meta"
        },
        shiftNums: {
            "`": "~",
            "1": "!",
            "2": "@",
            "3": "#",
            "4": "$",
            "5": "%",
            "6": "^",
            "7": "&",
            "8": "*",
            "9": "(",
            "0": ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": '"',
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        },
        returnKeys: [],
        cancelKeys: []
    };
    function b(e) {
        if (typeof e.data !== "string") {
            return
        }
        var d = e.handler
            , f = e.data.toLowerCase().split(" ");
        e.handler = function (g) {
            if (this !== g.target && (/textarea|select/i.test(g.target.nodeName) || g.target.type === "text")) {
                return
            }
            var p = g.type !== "keypress" && c.hotkeys.specialKeys[g.which], n, q, j = "", k = {};
            try {
                n = String.fromCharCode(g.which).toLowerCase()
            } catch (o) {
                n = g.which
            }
            if (g.altKey && p !== "alt") {
                j += "alt+"
            }
            if (g.ctrlKey && p !== "ctrl") {
                j += "ctrl+"
            }
            if (g.metaKey && !g.ctrlKey && p !== "meta") {
                j += "meta+"
            }
            if (g.shiftKey && p !== "shift") {
                j += "shift+"
            }
            if (p) {
                k[j + p] = true
            } else {
                k[j + n] = true;
                k[j + c.hotkeys.shiftNums[n]] = true;
                if (j === "shift+") {
                    k[c.hotkeys.shiftNums[n]] = true
                }
            }
            for (var m = 0, h = f.length; m < h; m++) {
                if (k[f[m]]) {
                    return d.apply(this, arguments)
                }
            }
        }
    }
    $.each(["keydown", "keyup", "keypress"], function () {
        c.event.special[this] = {
            add: b
        }
    });
    $(document).bind("keydown", "esc", function (d) {
        c._fireKeydown_esc(d);
        return false
    }).bind("keydown", "return", function (d) {
        c._fireKeydown_return(d);
        return true
    });
    function a(d) {
        if (!d || d.length == 0 || d.hasClass("common_button_disable") || d.css("display") == "none" || d.css("visibility") == "hidden" || d.parents(".button_container").css("display") == "none" || d.parents(".button_container").css("visibility") == "hidden") {
            return false
        }
        return true
    }
    $._fireKeydown_return = function (d) {
        var e = false;
        $($.hotkeys.returnKeys).each(function (g, h) {
            var f = $("#" + h);
            if (a(f)) {
                f.click();
                e = true;
                return false
            }
        });
        if (e) {
            return
        }
        if ($("#ok_msg_btn_first").size() > 0) {
            if (a($("#ok_msg_btn_first"))) {
                $("#ok_msg_btn_first").click()
            }
        } else {
            if ($("#btnsave").size() > 0) {
                if (a($("#btnsave"))) {
                    $("#btnsave").click()
                }
            } else {
                if ($("#btnok").size() > 0) {
                    if (a($("#btnok"))) {
                        $("#btnok").click()
                    }
                } else {
                    if ($("#btnsubmit").size() > 0) {
                        if (a($("#btnsubmit"))) {
                            $("#btnsubmit").click()
                        }
                    } else {
                        if ($("#btnsearch").size() > 0) {
                            if (a($("#btnsearch"))) {
                                $("#btnsearch").click()
                            }
                        } else {
                            if ($("#btnreset").size() > 0) {
                                if (a($("#btnreset"))) {
                                    $("#btnreset").click()
                                }
                            } else {
                                if ($("#btnmodify").size() > 0) {
                                    if (a($("#btnmodify"))) {
                                        $("#btnmodify").click()
                                    }
                                } else {
                                    if ($("#ok_msg_btn").size() > 0) {
                                        if (a($("#ok_msg_btn"))) {
                                            $("#ok_msg_btn").click()
                                        }
                                    } else {
                                        if ($("#yes_msg_btn").size() > 0) {
                                            if (a($("#yes_msg_btn"))) {
                                                $("#yes_msg_btn").click()
                                            }
                                        } else {
                                            if ($("#retry_msg_btn").size() > 0) {
                                                if (a($("#retry_msg_btn"))) {
                                                    $("#retry_msg_btn").click()
                                                }
                                            } else {
                                                if (parent && parent != window) {
                                                    if (parent.jQuery && parent.jQuery._fireKeydown_return) {
                                                        parent.jQuery._fireKeydown_return(d)
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    $._fireKeydown_esc = function (d) {
        var e = false;
        $($.hotkeys.cancelKeys).each(function (g, h) {
            var f = $("#" + h);
            if (a(f)) {
                f.click();
                e = true;
                return false
            }
        });
        if (e) {
            return
        }
        if ($("#btncancel").size() > 0) {
            $("#btncancel").click()
        } else {
            if ($("#btnclose").size() > 0) {
                $("#btnclose").click()
            } else {
                if (parent && parent != window) {
                    if (parent.jQuery && parent.jQuery._fireKeydown_esc) {
                        parent.jQuery._fireKeydown_esc(d)
                    }
                }
            }
        }
    }
}
)(jQuery);
$(function () {
    $("input,select").bind("keydown", "esc", function (a) {
        if ($._fireKeydown_esc) {
            $._fireKeydown_esc(a)
        }
        return false
    }).bind("keydown", "return", function (a) {
        if ($._fireKeydown_return) {
            $._fireKeydown_return(a)
        }
        return false
    })
});
var __fireKeydown_return = function (a) {
    if (a) {
        a.off("keydown").bind("keydown", "return", function (b) {
            if ($._fireKeydown_return) {
                $._fireKeydown_return(b)
            }
            return false
        })
    }
};
(function (a) {
    a._autofill = new Object();
    a.autofillform = function (b) {
        var c = {};
        b = a.extend(c, b);
        var d = b.fillmaps ? b.fillmaps : new Object();
        a._autofill.filllists = d;
        for (var e in d) {
            a("#" + e).fillform(d[e])
        }
    }

    a.fn.clearform = function (b) {
        var c = {
            clearHidden: false
        };
        this.resetValidate();
        b = a.extend(c, b);
        this.find(":input").each(function () {
            switch (this.type) {
                case "passsword":
                case "select-multiple":
                case "select-one":
                case "text":
                case "textarea":
                    a(this).val("");
                case "hidden":
                    if (b.clearHidden) {
                        a(this).val("")
                    }
                    break;
                case "checkbox":
                case "radio":
                    this.checked = false
            }
        })
    }

    a.fn.fillform = function (b, c) {
        if (this[0] == null) {
            return
        }
        this.each(function (e) {
            var f = a(this);
            f.resetValidate();
            for (var g in b) {
                a("#" + g, f).each(function (h) {
                    a(this).fill(b[g], g, f)
                })
            }
            f = null
        });
        try {
            if (typeof (c) != "undefined" && c === false) {
                return
            }
            this.find("input[type=text]:first").focus()
        } catch (d) { }
    }

    a.fn.fill = function (h, g, r) {
        var c = this[0]
            , s = a(c)
            , u = c.tagName.toLowerCase();
        if (h && typeof h == "string") {
            h = h.replace(/<\/\/script>/gi, "<\/script>")
        }
        var k = c.type
            , w = c.value;
        switch (u) {
            case "input":
                switch (k) {
                    case "text":
                        s.val(h);
                        break;
                    case "hidden":
                        var e = s.attrObj("_comp"), q;
                        if (e) {
                            q = e.attr("compType");
                            if (q === "selectPeople") {
                                var l = ""
                                    , n = "";
                                if (h && h.startsWith("{")) {
                                    h = a.parseJSON(h);
                                    if (h.value === undefined) {
                                        h.value = "";
                                        h.text = ""
                                    }
                                    e.comp(h);
                                    l = h.value;
                                    n = h.text
                                }
                                e.val(n);
                                s.val(l);
                                break
                            }
                        }
                        s.val(h);
                        break;
                    case "checkbox":
                        if (h == w) {
                            c.checked = true
                        } else {
                            c.checked = false
                        }
                        break;
                    case "radio":
                        if (r) {
                            a("input[type=radio]", r).each(function () {
                                if ((this.id == g || this.name == g) && h == this.value && !this.checked) {
                                    this.checked = true
                                }
                            })
                        } else {
                            if (h == c.value && !c.checked) {
                                c.checked = true
                            }
                        }
                }
                break;
            case "textarea":
                s.val(h);
                break;
            case "select":
                switch (k) {
                    case "select-one":
                        s.val(h);
                        break;
                    case "select-multiple":
                        var d = c.options;
                        if (h.split) {
                            var m = h.split(",");
                            for (var p = 0; p < d.length; p++) {
                                var f = d[p];
                                var b = a.browser.msie && !(f.attributes.value.specified) ? f.text : f.value;
                                for (var o = 0; o < m.length; o++) {
                                    if (b == m[o]) {
                                        f.selected = true
                                    }
                                }
                            }
                        }
                }
                break;
            default:
                if (!((!h || h == "") && a(this)[0].innerHTML.indexOf("&nbsp;") != -1)) {
                    if (h && s.parent(".text_overflow").length == 1) {
                        s.attr("title", h)
                    }
                    if (h && typeof h == "string") {
                        h = h.replace(/\n/g, "<br/>")
                    }
                    c.innerHTML = h
                }
        }
        if (this.attr("validate")) {
            this.validate()
        }
    }

    a.fn.fillgrid = function (b) {
        this.each(function (d) {
            var c = this.tagName.toLowerCase()
                , f = a(this);
            switch (c) {
                case "table":
                    elem.grid.addData(b);
                    break
            }
        })
    }
}
)(jQuery);
(function (b) {
    var a = 1;
    b.fn.codeoption = function (d) {
        var e = {};
        d = b.extend(e, d);
        var c = new Array;
        b(".codecfg", this).add(this).each(function (h) {
            var f = this.tagName;
            if (!f) {
                return
            }
            f = f.toLowerCase();
            var j = d.codecfg ? d.codecfg : b(this).attr("codecfg");
            if (j) {
                var g = b.codecfgobj(this, j);
                if (d.tags && !d.tags.contains(f) && !g.render) {
                    return
                }
                c.push(g)
            }
        });
        b.genoption(c, d)
    }

    b.codeoption = function (c) {
        var d = {
            tags: ["select"]
        };
        c = b.extend(d, c);
        b(document).codeoption(c)
    }

    b.fn.codetext = function (d) {
        var e = {};
        d = b.extend(e, d);
        var c = new Array;
        b(".codecfg", this).add(this).each(function (h) {
            if (!b(this).attr("codecfg")) {
                return
            }
            var f = this.tagName.toLowerCase();
            if (f != "select") {
                var j = d.codecfg ? d.codecfg : b(this).attr("codecfg");
                if (j) {
                    var g = b.codecfgobj(this, j);
                    if (g.render) {
                        return
                    }
                    var k = f == "input" ? b(this).val() : b(this).text();
                    if (k) {
                        c.push(g)
                    }
                }
            }
        });
        b.genoption(c, d)
    }

    b.codetext = function (c) {
        b(document).codetext(c)
    }

    b.codecfgobj = function (g, f) {
        if (f) {
            var c = f.indexOf("{");
            var d = b.parseJSON(c == 0 ? f : ("{" + f + "}"));
            var e = g.id ? g.id : g.name;
            if (!e || e.indexOf("coi_") == 0) {
                e = "coi_" + a;
                b(g).attr("id", e);
                a++
            }
            d.eleid = e;
            return d
        } else {
            return {}
        }
    }

    b.genoption = function (d, f) {
        if (d.length > 0) {
            var e = new ctpCodeManager();
            var c = b.toJSON(d);
            b.fillOption(e.selectCode(c))
        }
    }

    b.fillOption = function (e) {
        if (e) {
            for (var c = 0; c < e.length; c++) {
                var g = b.findTag(e[c]);
                var d = e[c].options;
                var f = e[c]["defaultValue"];
                if (g) {
                    g.each(function () {
                        var v = this.tagName.toLowerCase()
                            , u = b(this);
                        var r = e[c].render;
                        if (r == "radioh") {
                            h(u, d)
                        } else {
                            if (r == "radiov") {
                                h(u, d, true)
                            } else {
                                if (v == "select") {
                                    b("option[tmp]", u).remove();
                                    var q = e[c].prependBlank;
                                    if (q) {
                                        var s = e[c].blankText;
                                        s = typeof (s) === "undefined" ? "" : s;
                                        var o = new Option(s, q);
                                        o.tmp = "tmp";
                                        this.options[this.options.length] = o;
                                        if (f && f == q) {
                                            o.selected = true
                                        }
                                    }
                                    for (var i in d) {
                                        var o = new Option(d[i], i);
                                        o.tmp = "tmp";
                                        this.options[this.options.length] = o;
                                        if (f && f == i) {
                                            o.selected = true
                                        }
                                    }
                                    if (e[c].codeId == "collaboration_deadline") {
                                        try {
                                            var j = this.options;
                                            if (j[14] && j[15]) {
                                                var n = j[14];
                                                j.insertBefore(j[14], j[15]);
                                                j.insertBefore(j[15], n)
                                            }
                                            if (j[17] && j[18]) {
                                                var m = j[17];
                                                j.insertBefore(j[17], j[18]);
                                                j.insertBefore(j[18], m)
                                            }
                                        } catch (p) { }
                                    }
                                    if (r == "new") {
                                        var l = b.dropdown({
                                            id: this.id
                                        });
                                        if (f) {
                                            l.setValue(f)
                                        }
                                    }
                                } else {
                                    if (v == "input") {
                                        b(this).val(d[b(this).val()])
                                    } else {
                                        var k = d[b(this).text()];
                                        b(this).text(k);
                                        if (b(this).attr("title")) {
                                            b(this).attr("title", k)
                                        }
                                    }
                                }
                            }
                        }
                        function h(z, A, C) {
                            var D = z.attr("id")
                                , w = z;
                            z.attr("id", D + "_hid");
                            for (var y in A) {
                                var x = b('<label class="margin_r_10 hand"></label>');
                                x.text(A[y]);
                                if (C) {
                                    x.addClass("display_block")
                                }
                                var B = b('<input class="radio_com" type="radio" name="' + D + '">');
                                B.attr("id", D);
                                B.val(y);
                                x.prepend(B);
                                w.after(x);
                                w = x;
                                if (f && f == y) {
                                    B.attr("checked", true)
                                }
                            }
                            z.remove()
                        }
                    })
                }
            }
        }
    }

    b.findTag = function (d) {
        var c;
        if (d.eleid) {
            c = b("#" + d.eleid).length == 0 ? b("[name='" + d.eleid + "']") : b("#" + d.eleid)
        }
        if (!c) {
            b(".codecfg").each(function (f) {
                var e = this.codecfg;
                if (e) {
                    if (e.indexOf("codeType") != -1 && e.indexOf(d.codeType) != -1) {
                        c = b(this)
                    }
                    if (e.indexOf("codeType") == -1 && e.indexOf(d.tableName) != -1) {
                        c = b(this)
                    }
                }
            })
        }
        return c
    }
}
)(jQuery);
var CtpSearchBox = (function () {
    function a(b) {
        this.options = null;
        this.scrollTime = null;
        this.options = b;
        this.initCtlEvent()
    }
    a.prototype.initCtlEvent = function () {
        var b = this;
        if (AssertUtils.isNotEmpty(this.options.containerId)) {
            $("#" + this.options.containerId).scroll(function () {
                var c = $(this).get(0);
                if (b.scrollTime != null) {
                    clearTimeout(b.scrollTime)
                }
                b.scrollTime = b.resetPosition(c.scrollTop, c)
            })
        }
    }

    a.prototype.resetPosition = function (d, b) {
        var c = $("#" + this.options.id + "_ul").get(0);
        c.style.top = parseFloat(this.options.top) - parseFloat(d) + "px"
    }

    a.prototype.getSearchBtnHtml = function () {
        return "<li class='margin_l_5 search_btn' style='*margin-top:-1px;'><a class='syIcon  sy-search seary-bar-btn' href='javascript:void(0)'><em></em></a></li>"
    }

    return a
}());
function MxtDropDown(a) {
    this.id = Math.floor(Math.random() * 100000000);
    if (a.id != undefined) {
        this.id = a.id
    }
    this.onchange = a.onchange;
    if (this.onchange == undefined) {
        this.onchange = function () { }
    }
    this.disabled = SeeUtils.getAttrEl(this.id, "disabled");
    this.isExpand = a.isExpand;
    this.expandValue = a.expandValue;
    this.top = a.top;
    this.init()
}
function _getOption(b, c) {
    for (var a = 0; a < b.length; a++) {
        if (b[a].id === c) {
            return b[a]
        }
    }
    return null
}
var _searchBoxLang = {
    en: {
        lt: "less than",
        gt: "greater than",
        like: "Contain"
    },
    zh_CN: {
        lt: "小于",
        gt: "大于",
        like: "包含"
    },
    "zh-TW": {
        lt: "小於",
        gt: "大於",
        like: "包含"
    }
};
function _getConditionOptions(d, a, e, b) {
    var c = _getOption(d.conditions, e);
    if (c.conditionOptions) {
        return "<div class=\"common_txtbox_wrap\" style='width:60px;float: left;border:0;height: 24px;line-height: 24px;position: relative;'><select class='conditionSel' id='" + a + "_condtionSel'><option value='gt' selected='selected'>" + _searchBoxLang[__getCurSysLang()]["lt"] + "</option><option value='lt'>" + _searchBoxLang[__getCurSysLang()]["gt"] + "</option><option value='like'>" + _searchBoxLang[__getCurSysLang()]["like"] + "</option></select></div>"
    } else {
        return ""
    }
}
function __initConditionSel(e, b, f, c) {
    var d = _getOption(e.conditions, f);
    if (d.conditionOptions) {
        if ($("#" + b + "_condtionSel").get(0) != null) {
            var a = new CtpUiComSelect($("#" + b + "_condtionSel").get(0), {
                width: 80,
                mouseover: true
            });
            if (e.condition == null) {
                e.condition = {}
            }
            e.condition[b] = a
        }
    }
}
function mouseenterDown(d, f) {
    if (f == "disabled" || f == "true") {
        return
    }
    if (SeeUtils.isIE8 && typeof ($) != "undefined") {
        var i = $("#" + d).attr("elWidth");
        if (i != null && parseFloat(i) > 0) {
            $("#" + d).width(i)
        } else {
            $("#" + d).attr("elWidth", SeeUtils.getElWidth(d))
        }
    }
    SeeUtils.setElWidth(d + "_dropdown_content", SeeUtils.getElWidth(d) - 2);
    SeeUtils.showEl(d + "_dropdown_content");
    SeeUtils.setElWidth(d + "_dropdown_content_iframe", SeeUtils.getElWidth(d));
    SeeUtils.showEl(d + "_dropdown_content_iframe");
    var a = SeeUtils.getElOffest(d).top;
    var b = SeeUtils.getElHeight(d + "_dropdown_content");
    var e = SeeUtils.getDocumentHeight();
    if (e == 0) {
        e = parseInt(document.documentElement.clientHeight)
    }
    SeeUtils.setElHeight(d + "_dropdown_content_iframe", b + 3);
    if ((a + b) > e) {
        SeeUtils.setElHeight(d + "_dropdown_content", e - a - SeeUtils.getElHeight(this));
        SeeUtils.cssByJson(d + "_dropdown_content", {
            overflow: "auto"
        });
        SeeUtils.setElHeight(d + "_dropdown_content_iframe", e - a - SeeUtils.getElHeight(this))
    }
    var h = document.getElementById(d + "_dropdown_content");
    if (h.getAttribute("fixChildWidth") == null && h.scrollWidth > h.clientWidth) {
        var c = SeeUtils.getElByTag(h, "a");
        for (var g = 0; g < c.length; g++) {
            SeeUtils.cssByJson(c[g], {
                width: h.scrollWidth + "px"
            })
        }
        h.setAttribute("fixChildWidth", "yes")
    }
}
function mouseleavelDown(a) {
    SeeUtils.hideEl(a + "_dropdown_content");
    SeeUtils.hideEl(a + "_dropdown_content_iframe")
}
MxtDropDown.prototype.init = function () {
    try {
        $("#" + this.id).attrObj("_dropdown", this)
    } catch (j) { }
    var c = SeeUtils.getElByTag(this.id, "option");
    if (c.length == 0) {
        return void (0)
    }
    var g = "";
    if (this.disabled == "disabled" || this.disabled == "true") {
        g = "common_button_disable"
    }
    var a = "";
    a += "<div id='" + this.id + "_dropdown' onmouseenter='mouseenterDown(\"" + this.id + '","' + this.disabled + "\")' onmouseleave='mouseleavelDown(\"" + this.id + "\")' class='common_drop_list common_drop_list_dropdown'>";
    a += "<div id = '" + this.id + "_dropdown_title'class='common_drop_list_title'>";
    a += "<a href='javascript:void(0)' class='common_drop_list_select common_button  " + g + "' style='*margin-top:-1px;'>";
    a += "<table width='100%' height='100%' cellpadding='0' cellspacing='0' class='ellipsis_table'>";
    a += "<tbody>";
    a += "<tr>";
    a += "<td id = '" + this.id + "_dropdown_text' class='common_drop_list_text font_size12'>";
    if (this.isExpand && this.expandValue == null && c.length > 1) {
        a += c[1].innerHTML
    } else {
        if (this.isExpand && this.expandValue) {
            var q = document.getElementById(this.id);
            var i = q.selectedIndex;
            var b = q.options[i].text;
            a += b
        } else {
            a += c[0].innerHTML
        }
    }
    a += "</td>";
    a += "<td width='20' align='left'>";
    a += "<span class='syIcon sy-arrow-plane-down'></span>";
    a += "</td>";
    a += "</tr>";
    a += "</tbody>";
    a += "</table>";
    a += "</a>";
    a += "</div>";
    a += "<iframe id='" + this.id + "_dropdown_content_iframe' frameborder='0' style='position:absolute; z-index:1000;background:#fff;display:none;'>";
    a += "</iframe>";
    var h = 0;
    h = document.body.clientHeight - this.top - 30;
    if (typeof ($) !== "undefined") {
        h = $(window).height() - this.top - 30
    }
    h < 1 ? h = document.body.offsetHeight - this.top - 30 : "";
    var f = (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0) && /msie 8\.0/i.test(navigator.userAgent) || (navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0) && /msie 7\.0/i.test(navigator.userAgent);
    if (f) {
        var q = document.getElementById(this.id);
        if (q.options.length * 30 >= h) {
            h = h < 1 ? h = "" : "height:" + h + "px;"
        } else {
            h = h < 1 ? h = "" : ""
        }
    } else {
        h = h < 1 ? h = "" : "max-height:" + h + "px;"
    }
    a += "<div id='" + this.id + "_dropdown_content' class='common_drop_list_content common_drop_list_content_action' style=' " + h + " position:absolute;z-index:1000;background:#fff;display:none;overflow:auto'>";
    function n(r, s, e) {
        if (e.isExpand && e.expandValue == null && s === 1) {
            return "class='common_drop_a_select'"
        } else {
            if (e.isExpand && e.expandValue === r) {
                return "class='common_drop_a_select'"
            } else {
                return ""
            }
        }
    }
    var p = this;
    for (var m = 0; m < c.length; m++) {
        var k = c[m];
        var l = SeeUtils.getAttrEl(k, "value");
        var o = k.text;
        a += "<a style='word-break:keep-all;white-space:nowrap' " + n(l, m, p) + " tar='" + p.id + "' href='javascript:void(0)' value='";
        a += l;
        a += "' title='" + o + "'";
        a += "'>";
        a += o;
        a += "</a>"
    }
    a += "</div>";
    a += "</div>";
    SeeUtils.insertAfter(a, this.id);
    SeeUtils.cssByJson(this.id + "_dropdown", {
        width: "100%",
        position: "relative"
    });
    SeeUtils.hideEl(this.id);
    var d = SeeUtils.eachByTag(SeeUtils.getElObj(this.id + "_dropdown_content"), "a", function (e, t) {
        if (e.parentNode == null || e.parentNode.parentNode == null) {
            return void (0)
        }
        var r = SeeUtils.getByClass(e.parentNode.parentNode, ".common_drop_list_text");
        if (r.length == 0) {
            return void (0)
        }
        var s = r[0];
        var u = e.parentNode;
        SeeUtils.addEvent(e, "click", function (x) {
            var w = x || window.event;
            var v = w.target || w.srcElement;
            if (v.parentNode.querySelector(".common_drop_a_select")) {
                v.parentNode.querySelector(".common_drop_a_select").className = "";
                v.className = "common_drop_a_select"
            }
            var A = SeeUtils.getAttrEl(v, "title");
            var y = SeeUtils.getAttrEl(v, "value");
            var z = SeeUtils.getAttrEl(v, "tar");
            A = A.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            s.innerHTML = A;
            SeeUtils.setElVal(z, y);
            SeeUtils.hideEl(u);
            SeeUtils.hideEl(p.id + "_dropdown_content_iframe");
            p.onchange()
        })
    })
}

MxtDropDown.prototype.setValue = function (b) {
    if (b) {
        SeeUtils.setElVal(this.id, b);
        var e = null;
        var d = SeeUtils.getElByTag(this.id + "_dropdown_content", "a");
        for (var a = 0; a < d.length; a++) {
            var k = SeeUtils.getAttrEl(d[a], "value");
            if (k === b) {
                e = d[a];
                break
            }
        }
        if (e == null) {
            return void (0)
        }
        if (e.parentNode == null || e.parentNode.parentNode == null) {
            return void (0)
        }
        var c = SeeUtils.getByClass(e.parentNode.parentNode, ".common_drop_list_text");
        if (c.length == 0) {
            return void (0)
        }
        var j = c[0];
        var i = e.parentNode;
        var h = SeeUtils.getAttrEl(e, "title");
        var g = SeeUtils.getAttrEl(e, "value");
        var f = SeeUtils.getAttrEl(e, "tar");
        j.innerHTML = h;
        SeeUtils.setElVal(f, g);
        SeeUtils.hideEl(i)
    }
}

function _MxtDropDown(b, a) {
    var c = b;
    var e = c.id;
    var d = {};
    if (e == "") {
        e = Math.floor(Math.random() * 100000000);
        d.id = e;
        SeeUtils.attrEl(b, "id", e)
    } else {
        d.id = e
    }
    d.top = a.top;
    d.isExpand = a.isExpand || null;
    d.expandValue = a.expandValue || null;
    new MxtDropDown(d)
}
(function (a) {
    a.fn.dropdown = function () {
        this.each(function () {
            var b = this;
            var d = b.id;
            var c = {};
            if (d == "") {
                d = Math.floor(Math.random() * 100000000);
                c.id = d;
                SeeUtils.attrEl(this, "id", d)
            } else {
                c.id = d
            }
            new MxtDropDown(c)
        })
    }

    a.dropdown = function (b) {
        if (b && b.id) {
            return new MxtDropDown(b)
        } else {
            return
        }
    }
}
)(jQuery);
function searchBtnClick(b, e) {
    var d = b.getReturnValue();
    var a = (!!window.ActiveXObject || "ActiveXObject" in window);
    if (d && d.condition && d.condition == "barcode") {
        if (!a) {
            $.alert($.i18n("form.barcode.only.suport.ie.lable"));
            return
        }
        var c = d.value;
        if (openBarCodePort(c.qType, c.comType)) {
            $.infor($.i18n("common.barcode.ready.label"))
        }
    } else {
        e.searchHandler()
    }
}
function goSearchCtl(r, d) {
    r = SeeUtils.extend({
        id: Math.floor(Math.random() * 100000000),
        conditionText: $.i18n("common.option.selectCondition.text"),
        conditionDateText: $.i18n("searchbox.conditionDateText.js"),
        conditionSpecText: $.i18n("searchbox.conditionSpecText.js"),
        onchange: function () { },
        dialog: null
    }, r);
    var A = {
        destroySearch: function () {
            this.clearCondition();
            SeeUtils.removeEl(r.id + "_ul");
            for (var g in this) {
                this[g] = null
            }
            for (var i in r) {
                r[i] = null
            }
        },
        getCondition: function () {
            var i = SeeUtils.getElVal(r.id);
            var g = r.condition[r.id];
            if (g != null) {
                return g.getSelValue()
            }
            return "eq"
        },
        getReturnValue: function () {
            var p = SeeUtils.getElVal(r.id);
            var V;
            var H;
            var M = false;
            if (r.conditions && r.conditions.length > 0) {
                for (var S = 0; S < r.conditions.length; S++) {
                    var N = r.conditions[S];
                    var I = N.value;
                    var G = N.id;
                    var U = N.type;
                    var R = N.validate ? true : false;
                    var j;
                    if (p == I) {
                        if (U == "selectPeople") {
                            V = [];
                            V[0] = SeeUtils.getElVal(G + "_txt");
                            V[1] = SeeUtils.getElVal(G)
                        } else {
                            if (U == "datemulti") {
                                var T = N.ifFormat;
                                V = [];
                                V[0] = SeeUtils.getElVal("from_" + G);
                                V[1] = SeeUtils.getElVal("to_" + G);
                                if (T == "%Y-%m-%d") {
                                    var g = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/
                                } else {
                                    var g = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/
                                }
                                if ((!g.test(V[0]) || !g.test(V[1])) && V[0] != "" && V[1] != "") {
                                    M = true;
                                    if (r.dialog) {
                                        r.dialog.close()
                                    }
                                    r.dialog = $.alert(r.conditionDateText);
                                    return null
                                }
                                if (V[0] != "" && V[1] != "" && V[0] > V[1]) {
                                    if (r.dialog) {
                                        r.dialog.close()
                                    }
                                    r.dialog = $.alert($.i18n("validate.endDate.early.startDate.js"));
                                    return null
                                }
                            } else {
                                if (U == "custom") {
                                    V = N.getValue ? N.getValue(G) : SeeUtils.getElVal(G)
                                } else {
                                    if (U == "select") {
                                        var K = document.getElementsByTagName("select");
                                        for (var L = 0; L < K.length; L++) {
                                            if (K[L].getAttribute("id") === G) {
                                                var Q = K[L];
                                                var J = Q.selectedIndex;
                                                var O = Q.options[J].text;
                                                var P = Q.options[J].value;
                                                V = Q.options[J].value
                                            }
                                        }
                                    } else {
                                        V = SeeUtils.getElVal(G);
                                        if (R) {
                                            j = /[!@#$%^&*()<>]/;
                                            if (j.test(V)) {
                                                M = true;
                                                SeeUtils.getElObj(G).focus()
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        H = U;
                        break
                    }
                }
            }
            if (M) {
                if (r.dialog) {
                    r.dialog.close()
                }
                r.dialog = $.alert(r.conditionSpecText);
                return null
            } else {
                return {
                    type: H,
                    condition: p,
                    value: V
                }
            }
        },
        clearCondition: function () {
            var i = SeeUtils.getElByTag(SeeUtils.getElObj(r.id + "_dropdown_content"), "a");
            for (var g = 0; g < i.length; g++) {
                var p = i[g];
                var j = SeeUtils.getAttrEl(p, "value");
                if (j == "") {
                    SeeUtils.executeClick(p)
                }
            }
        },
        setCondition: function (g, I, H) {
            var L;
            var M;
            var K;
            for (var p = 0; p < r.conditions.length; p++) {
                var G = r.conditions[p];
                var N = G.value;
                var J = G.id;
                var j = G.type;
                if (J == g) {
                    L = N;
                    M = j;
                    K = G;
                    break
                }
            }
            SeeUtils.eachByTag(r.id + "_dropdown_content", "a", function (P, i) {
                var O = SeeUtils.getAttrEl(P, "value");
                if (O == L) {
                    SeeUtils.executeClick(P)
                }
            });
            if (M == "input") {
                SeeUtils.setElVal(g, I)
            } else {
                if (M == "select") {
                    SeeUtils.eachByTag(g + "_dropdown_content", "a", function (O, i) {
                        var P = SeeUtils.getAttrEl(O, "value");
                        if (P == I) {
                            SeeUtils.executeClick(O)
                        }
                    })
                } else {
                    if (M == "datemulti") {
                        SeeUtils.setElVal("from_" + g, I);
                        SeeUtils.setElVal("to_" + g, H)
                    } else {
                        if (M == "selectPeople") {
                            SeeUtils.setElVal(J + "_txt", I);
                            SeeUtils.setElVal(J, H)
                        }
                    }
                }
            }
        },
        hideSearchBox: function () {
            SeeUtils.hideEl(r.id + "_ul")
        },
        showSearchBox: function () {
            SeeUtils.showEl(r.id + "_ul")
        },
        hideItem: function (M, G) {
            var H;
            for (var I = 0; I < r.conditions.length; I++) {
                if (r.conditions[I].id == M) {
                    H = r.conditions[I].value
                }
            }
            var p = SeeUtils.getElByTag(r.id + "_conditions", "a");
            for (var N = 0; N < p.length; N++) {
                var j = p[N];
                if (SeeUtils.getAttrEl(j, "value") == H) {
                    SeeUtils.hideEl(j)
                }
            }
            if (G) {
                SeeUtils.text(r.id + "_dropdown_text", r.conditionText);
                var g = SeeUtils.getElByTag(r.id, "option");
                if (g.length > 0) {
                    SeeUtils.attrEl(g[0], "selected", true)
                }
                var L = SeeUtils.getElByTag(r.id + "_ul", "li");
                var K = L.length;
                for (var I = 0; I < L.length; I++) {
                    var J = L[I];
                    if (!(I == 0 || I == (K - 1))) {
                        if (!SeeUtils.hasClass(J, "hidden")) {
                            SeeUtils.addClass(J, "hidden")
                        }
                    }
                    if (I == (K - 1)) {
                        SeeUtils.addClass(J, "margin_l_5")
                    }
                }
            }
        },
        showItem: function (H) {
            var G;
            for (var j = 0; j < r.conditions.length; j++) {
                if (r.conditions[j].id == H) {
                    G = r.conditions[j].value
                }
            }
            var p = SeeUtils.getElByTag(r.id + "_conditions", "a");
            for (var g = 0; g < p.length; g++) {
                var I = p[g];
                if (SeeUtils.getAttrEl(I, "value") == G) {
                    SeeUtils.showEl(I)
                }
            }
        }
    };
    var t = "<ul id='" + r.id + "_ul' class='common_search common_search_condition clearfix' style='_display:inline'><li class='searchLicommon' id='" + r.id + "_conditions' style='width:120px'><select id='" + r.id + "' class='common_drop_down w100b'><option id='" + r.id + "_default' value=''>" + r.conditionText + "</option></select></li></ul>";
    SeeUtils.appendTo(t, d);
    r.inputs = [];
    r.selects = [];
    if (r.conditions && r.conditions.length > 0) {
        for (var z = 0; z < r.conditions.length; z++) {
            var C = false;
            var e = r.conditions[z];
            var D = null;
            var B = e.type;
            var f = e.value;
            var c = e.text;
            var s = e.id;
            var F = e.name;
            var l = null;
            var h = e.click;
            if (SeeUtils.isIE8 || SeeUtils.isIE9) {
                var k = document.createElement("option");
                k.setAttribute("value", f);
                k.innerText = c;
                SeeUtils.getElObj(r.id).appendChild(k)
            } else {
                var b = '<option value="' + f + '">' + c + "</option>";
                SeeUtils.appendTo(b, r.id)
            }
            var n;
            if (B == "selectPeople") {
                var y = "<li id='" + f + "_container' class='searchLicommon common_search_input condition_text hidden'><input id='" + s + "' name='" + F + "' value='' class='search_input searchInputComp comp' comp=\"" + e.comp + "\" type='text'></li>";
                r.inputs.push(e);
                SeeUtils.appendTo(y, r.id + "_ul")
            } else {
                if (B == "input") {
                    if (e.maxLength) {
                        var x = " maxlength='" + e.maxLength + "'"
                    } else {
                        var x = ""
                    }
                    var y = "<li id='" + f + "_container' class='searchLicommon common_search_input condition_text hidden'><input id='" + s + "' name='" + F + "' value='' class='search_input' style='*margin-top:-1px;' type='text' " + x + "></li>";
                    r.inputs.push(e);
                    SeeUtils.appendTo(y, r.id + "_ul")
                } else {
                    if (B == "datemulti") {
                        var q = e.ifFormat != undefined ? e.ifFormat : "%Y-%m-%d %H:%M";
                        var y = "<li id='" + f + "_container' class='searchLicommon typeDatemulti condition_text hidden margin_lr_5'><input id='from_" + s + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/><span class='padding_lr_5'>-</span><input id='to_" + s + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/></li>";
                        if (e.dateTime && e.dateTime == true) {
                            C = true
                        }
                        D = s;
                        SeeUtils.appendTo(y, r.id + "_ul")
                    } else {
                        if (B == "select") {
                            var a = "";
                            a += "<select id='" + s + "' name='" + F + "' class='w100b common_drop_down'>";
                            if (e.items) {
                                for (var w = 0; w < e.items.length; w++) {
                                    var o = e.items[w];
                                    a += "<option value='" + o.value + "'>" + o.text + "</option>"
                                }
                            }
                            a += "</select>";
                            r.selects.push(e);
                            l = $(a);
                            if (e.codecfg) {
                                l.attr("codecfg", e.codecfg)
                            }
                            var y = "<li style='width: 100px;' id='" + f + "_container' class='searchLicommon condition_text margin_lr_5 hidden'>" + a + "</li>";
                            SeeUtils.appendTo(y, r.id + "_ul")
                        } else {
                            if (B == "custom") {
                                var y = "<li style='width: 120px' id='" + f + "_container' class='searchLicommon common_search_input condition_text hidden'>" + e.customHtml + "</li>";
                                SeeUtils.appendTo(y, r.id + "_ul")
                            }
                        }
                    }
                }
            }
            if (h != undefined) {
                SeeUtils.addEvent(s, "click", h)
            }
            if (l) {
                l.codeoption()
            }
            if (D != null) {
                calendarCtl({
                    ifFormat: q,
                    showsTime: C,
                    cache: false
                }, document.getElementById("from_" + D));
                calendarCtl({
                    ifFormat: q,
                    showsTime: C
                }, document.getElementById("to_" + D))
            }
            if (SeeUtils.getSizeByClass(".searchInputComp") > 0) {
                $(".searchInputComp").comp()
            }
        }
    }
    var v = "<li class='margin_l_5 search_btn' style='*margin-top:-1px;'><a class='syIcon  sy-search seary-bar-btn' href='javascript:void(0)'><em></em></a></li>";
    SeeUtils.appendTo(v, document.getElementById(r.id + "_ul"));
    var E = SeeUtils.getByClass(document, ".common_drop_down");
    for (var u = 0; u < E.length; u++) {
        var m = E[u];
        _MxtDropDown(m, r)
    }
    SeeUtils.eachAllSonElsByClass(".common_search", function (g) {
        SeeUtils.addEvent(g, "keydown", function (G) {
            var j = G || window.event;
            var i = j.target || j.srcElement;
            if (j.keyCode == 13) {
                var p = SeeUtils.getByClass(document, ".search_btn");
                SeeUtils.eachByClass(document, ".search_btn", function (H) {
                    SeeUtils.executeClick(H)
                });
                if (j.stopPropagation) {
                    j.stopPropagation()
                }
                j.cancelBubble = true;
                return false
            }
        })
    });
    SeeUtils.eachByTag(r.id + "_dropdown_content", "a", function (i, g) {
        SeeUtils.addEvent(i, "click", function (p) {
            var M = p || window.event;
            var N = M.target || M.srcElement;
            var H = SeeUtils.getAttrEl(N, "value");
            for (var O = 0; O < r.selects.length; O++) {
                var P = r.selects[O];
                if (P != null) {
                    var G = P.id;
                    if (AssertUtils.isNotEmpty(G)) {
                        var J = SeeUtils.getElByTag(G + "_dropdown_content", "a");
                        if (J.length > 0) {
                            SeeUtils.executeClick(J[0])
                        }
                    }
                }
            }
            for (var L = 0; L < r.inputs.length; L++) {
                var j = r.inputs[L];
                SeeUtils.attrEl(j.id, "value", "");
                if (SeeUtils.getAttrEl(j.id, "type") == "hidden") {
                    SeeUtils.attrEl(j.id + "_txt", "value", "");
                    SeeUtils.removeAttrEl(j.id + "_txt", "title")
                }
            }
            if (D) {
                SeeUtils.getElObj("from_" + D).value = "";
                SeeUtils.getElObj("to_" + D).value = ""
            }
            var K = SeeUtils.getByClass(document, ".condition_text");
            for (var I = 0; I < K.length; I++) {
                var N = K[I];
                SeeUtils.addClass(N, "hidden")
            }
            SeeUtils.removeClass(H + "_container", "hidden");
            if (H != "") {
                SeeUtils.removeClass(SeeUtils.getFirstElByClass(".search_btn"), "margin_l_5")
            } else {
                SeeUtils.addClass(SeeUtils.getFirstElByClass(".search_btn"), "margin_l_5")
            }
        });
        SeeUtils.addEvent(i, "click", r.onchange)
    });
    SeeUtils.eachByClass(document, ".search_btn", function (g) {
        SeeUtils.addEvent(g, "click", function () {
            searchBtnClick(A, r)
        })
    });
    this.p = r;
    this.g = A;
    return this
}
function goSearchCtlNoEl(t) {
    t = SeeUtils.extend({
        id: Math.floor(Math.random() * 100000000),
        conditionText: $.i18n("common.option.selectCondition.text"),
        conditionDateText: $.i18n("searchbox.conditionDateText.js"),
        conditionSpecText: $.i18n("searchbox.conditionSpecText.js"),
        onchange: function () { },
        isExpand: false,
        expandValue: null,
        top: 7,
        left: null,
        right: null,
        bottom: null,
        dialog: null
    }, t);
    var o = new CtpSearchBox(t);
    var E = {
        destroySearch: function () {
            this.clearCondition();
            SeeUtils.removeEl(t.id + "_ul");
            for (var g in this) {
                this[g] = null
            }
            for (var i in t) {
                t[i] = null
            }
        },
        getCondition: function (j) {
            var g = null;
            if (j != null) {
                g = t.condition && t.condition[j]
            } else {
                var i = this.getReturnValue();
                g = t.condition && t.condition[i.condition]
            }
            if (g != null) {
                return g.getSelValue()[0]
            }
            return "eq"
        },
        getReturnValue: function () {
            var p = SeeUtils.getElVal(t.id);
            var Z = null;
            var L;
            var Q = false;
            if (t.conditions && t.conditions.length > 0) {
                for (var W = 0; W < t.conditions.length; W++) {
                    var R = t.conditions[W];
                    var M = R.value;
                    var K = R.id;
                    var V = R.validate ? true : false;
                    var j;
                    var Y = R.type;
                    if (p == M) {
                        if (Y == "selectPeople") {
                            Z = [];
                            Z[0] = SeeUtils.getElVal(K + "_txt");
                            Z[1] = SeeUtils.getElVal(K)
                        } else {
                            if (Y == "datemulti") {
                                var X = R.ifFormat;
                                Z = [];
                                Z[0] = SeeUtils.getElVal("from_" + K);
                                Z[1] = SeeUtils.getElVal("to_" + K);
                                if (X == "%Y-%m-%d") {
                                    var g = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/
                                } else {
                                    var g = /^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/
                                }
                                if ((!g.test(Z[0]) || !g.test(Z[1])) && Z[0] != "" && Z[1] != "") {
                                    Q = true;
                                    if (t.dialog) {
                                        t.dialog.close()
                                    }
                                    t.dialog = $.alert(t.conditionDateText);
                                    return null
                                }
                                if (Z[0] != "" && Z[1] != "" && Z[0] > Z[1]) {
                                    if (t.dialog) {
                                        t.dialog.close()
                                    }
                                    t.dialog = $.alert($.i18n("validate.endDate.early.startDate.js"));
                                    return null
                                }
                            } else {
                                if (Y == "barcode") {
                                    Z = {};
                                    Z.qType = SeeUtils.getElVal(K + "_qType");
                                    Z.comType = SeeUtils.getElVal(K + "_comType")
                                } else {
                                    if (Y == "custom" || Y == "customPanel") {
                                        Z = R.getValue ? R.getValue(K) : SeeUtils.getElVal(K)
                                    } else {
                                        if (Y == "select") {
                                            var O = document.getElementsByTagName("select");
                                            for (var P = 0; P < O.length; P++) {
                                                if (O[P].getAttribute("id") === K) {
                                                    var U = O[P];
                                                    var N = U.selectedIndex;
                                                    var S = U.options[N].text;
                                                    var T = U.options[N].value;
                                                    Z = U.options[N].value
                                                }
                                            }
                                        } else {
                                            Z = SeeUtils.getElVal(K);
                                            if (V) {
                                                j = /[!@#$%^&*()<>]/;
                                                if (j.test(Z)) {
                                                    Q = true;
                                                    SeeUtils.getElObj(K).focus()
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        L = Y;
                        break
                    }
                }
            }
            if (Q) {
                if (t.dialog) {
                    t.dialog.close()
                }
                t.dialog = $.alert(t.conditionSpecText);
                return null
            } else {
                return {
                    type: L,
                    condition: p,
                    value: Z,
                    conditionVal: this.getCondition(p)
                }
            }
        },
        clearCondition: function () {
            var g = SeeUtils.getElByTag(SeeUtils.getElObj(t.id + "_dropdown_content"), "a");
            SeeUtils.eachByTag(t.id + "_dropdown_content", "a", function (p, i) {
                var j = SeeUtils.getAttrEl(p, "value");
                if (j == "") {
                    SeeUtils.executeClick(p)
                }
            })
        },
        setCondition: function (g, M, L) {
            var P;
            var Q;
            var O;
            for (var p = 0; p < t.conditions.length; p++) {
                var K = t.conditions[p];
                var R = K.value;
                var N = K.id;
                var j = K.type;
                if (N == g) {
                    P = R;
                    Q = j;
                    O = K;
                    break
                }
            }
            SeeUtils.eachByTag(t.id + "_dropdown_content", "a", function (T, i) {
                var S = SeeUtils.getAttrEl(T, "value");
                if (S == P) {
                    SeeUtils.executeClick(T)
                }
            });
            if (Q == "input") {
                SeeUtils.setElVal(g, M)
            } else {
                if (Q == "select") {
                    SeeUtils.eachByTag(g + "_dropdown_content", "a", function (S, i) {
                        var T = SeeUtils.getAttrEl(S, "value");
                        if (T == M) {
                            SeeUtils.executeClick(S)
                        }
                    })
                } else {
                    if (Q == "datemulti") {
                        SeeUtils.setElVal("from_" + g, M);
                        SeeUtils.setElVal("to_" + g, L)
                    } else {
                        if (Q == "selectPeople") {
                            SeeUtils.setElVal(N + "_txt", M);
                            SeeUtils.setElVal(N, L)
                        }
                    }
                }
            }
        },
        hideSearchBox: function () {
            SeeUtils.hideEl(t.id + "_ul")
        },
        showSearchBox: function () {
            SeeUtils.showEl(t.id + "_ul")
        },
        hideItem: function (Q, K) {
            var L;
            for (var M = 0; M < t.conditions.length; M++) {
                if (t.conditions[M].id == Q) {
                    L = t.conditions[M].value
                }
            }
            var p = SeeUtils.getElByTag(t.id + "_conditions", "a");
            for (var R = 0; R < p.length; R++) {
                var j = p[R];
                if (SeeUtils.getAttrEl(j, "value") == L) {
                    SeeUtils.hideEl(j)
                }
            }
            if (K) {
                var g = SeeUtils.getElByTag(t.id, "option");
                if (g.length > 0) {
                    SeeUtils.attrEl(g[0], "selected", true)
                }
                SeeUtils.text(t.id + "_dropdown_text", t.conditionText);
                var P = SeeUtils.getElByTag(t.id + "_ul", "li");
                var O = P.length;
                for (var M = 0; M < P.length; M++) {
                    var N = P[M];
                    if (!(M == 0 || M == (O - 1))) {
                        if (!SeeUtils.hasClass(N, "hidden")) {
                            SeeUtils.addClass(N, "hidden")
                        }
                    }
                    if (M == (O - 1)) {
                        SeeUtils.addClass(N, "margin_l_5")
                    }
                }
            }
        },
        showItem: function (L) {
            var K;
            for (var j = 0; j < t.conditions.length; j++) {
                if (t.conditions[j].id == L) {
                    K = t.conditions[j].value
                }
            }
            var p = SeeUtils.getElByTag(t.id + "_conditions", "a");
            for (var g = 0; g < p.length; g++) {
                var M = p[g];
                if (SeeUtils.getAttrEl(M, "value") == K) {
                    SeeUtils.showEl(M)
                }
            }
        }
    };
    var D = "position: absolute;z-index:599;";
    if (t.top != null) {
        D += "top:" + t.top + "px;"
    }
    if (t.left != null) {
        D += "left:" + t.left + "px;"
    }
    if (t.right != null) {
        D += "right:" + t.right + "px;"
    }
    if (t.bottom != null) {
        D += "bottom:" + t.bottom + "px;"
    }
    var v = "<ul id='" + t.id + "_ul' class='common_search common_search_condition clearfix' style='" + D + "_display:inline;'><li id='" + t.id + "_conditions' style='width:120px'><select id='" + t.id + "' class='common_drop_down w100b'><option id='" + t.id + "_default' value=''>" + t.conditionText + "</option></select></li></ul>";
    SeeUtils.appendToBody(v);
    t.inputs = [];
    t.selects = [];
    if (SeeUtils.getSizeByClass(".common_toolbar_box") == 1) {
        var r = $(".common_toolbar_box").parent().attrObj("toolbarObj");
        setTimeout(function () {
            var g = $("#toolbar_m").attr("move");
            if (g == null || g === 0 || g === "0") {
                if (r) {
                    r.setPage()
                }
            }
        }, 100)
    }
    if (t.conditions && t.conditions.length > 0) {
        for (var C = 0; C < t.conditions.length; C++) {
            var G = false;
            var e = t.conditions[C];
            var F = e.type;
            var H = null;
            var f = e.value;
            var c = e.text;
            var u = e.id;
            var J = e.name;
            var l = null;
            var h = e.click;
            var y = e.readonly;
            var k = document.createElement("option");
            k.setAttribute("value", f);
            var d = "hidden";
            if (t.isExpand && t.expandValue == null && C == 0) {
                d = "";
                k.setAttribute("selected", "selected")
            } else {
                if (t.isExpand && t.expandValue != null && t.expandValue == f) {
                    d = "";
                    k.setAttribute("selected", "selected")
                }
            }
            k.innerHTML = c;
            SeeUtils.appendTo(k, t.id);
            var n;
            if (F == "selectPeople") {
                var B = "<li id='" + f + "_container' class='common_search_input condition_text " + d + "'><input id='" + u + "' name='" + J + "' value='' class='search_input searchInputComp comp' comp=\"" + e.comp + "\" type='text'></li>";
                t.inputs.push(e);
                SeeUtils.appendTo(B, t.id + "_ul")
            } else {
                if (F == "input") {
                    if (e.maxLength) {
                        var A = " maxlength='" + e.maxLength + "'"
                    } else {
                        var A = ""
                    }
                    t.inputs.push(e);
                    var B = "<li id='" + f + "_container' class='common_search_input condition_text " + d + "'>" + _getConditionOptions(t, f, u, J) + "<input id='" + u + "' name='" + J + "' value='' class='search_input' style='*margin-top:-1px;border:0;' type='text' " + A + "></li>";
                    SeeUtils.appendTo(B, t.id + "_ul");
                    __initConditionSel(t, f, u, J)
                } else {
                    if (F == "datemulti") {
                        var s = e.ifFormat != undefined ? e.ifFormat : "%Y-%m-%d %H:%M";
                        var B = "<li id='" + f + "_container' class='typeDatemulti condition_text " + d + " margin_lr_5'><input id='from_" + u + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/><span class='padding_lr_5'>-</span><input id='to_" + u + "' type='text' class='comp input_date' style='width:135px' readonly='readonly'/></li>";
                        if (e.dateTime && e.dateTime == true) {
                            G = true
                        }
                        H = u;
                        SeeUtils.appendTo(B, t.id + "_ul")
                    } else {
                        if (F == "select") {
                            var a = "";
                            a += "<select id='" + u + "' name='" + J + "' class='w100b common_drop_down'>";
                            if (e.items) {
                                for (var z = 0; z < e.items.length; z++) {
                                    var q = e.items[z];
                                    a += "<option value='" + q.value + "'>" + escapeStringToHTML(q.text) + "</option>"
                                }
                            }
                            a += "</select>";
                            t.selects.push(e);
                            l = $(a);
                            if (e.codecfg) {
                                l.attr("codecfg", e.codecfg)
                            }
                            var B = "<li style='width: 100px;' id='" + f + "_container' class='condition_text margin_lr_5 " + d + "'>" + a + "</li>";
                            SeeUtils.appendTo(B, t.id + "_ul")
                        } else {
                            if (F == "barcode") { } else {
                                if (F == "custom") {
                                    var B = "<li style='' id='" + f + "_container' class='common_search_input condition_text " + d + "'>" + e.customHtml + "</li>";
                                    SeeUtils.appendTo(B, t.id + "_ul")
                                } else {
                                    if (F == "customPanel") {
                                        B = "<li style='width: 120px' id='" + f + "_container' class='common_search_input condition_text " + d + "'><div class='common_txtbox_wrap'><input id='" + u + "_ids' type='hidden'><input id='" + u + "' name='" + J + "' " + (y == undefined ? "" : y) + " value='' class='search_input' style='*margin-top:-1px;' type='text'></div></li>";
                                        SeeUtils.appendTo(B, t.id + "_ul")
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (h != undefined) {
                SeeUtils.addEvent(u, "click", h)
            }
            if (l) {
                l.codeoption()
            }
            if (H != null) {
                calendarCtl({
                    ifFormat: s,
                    showsTime: G,
                    cache: false
                }, document.getElementById("from_" + H));
                calendarCtl({
                    ifFormat: s,
                    showsTime: G
                }, document.getElementById("to_" + H))
            }
            if (SeeUtils.getSizeByClass(".searchInputComp") > 0) {
                $(".searchInputComp").comp()
            }
            if (F == "customPanel") {
                (function (g) {
                    SeeUtils.addEvent(g.id, "click", function () {
                        var i = $.dialog({
                            id: g.id + "_panel",
                            width: g.panelWidth,
                            height: g.panelHeight,
                            type: "panel",
                            html: g.customHtml,
                            targetId: g.id,
                            shadow: false,
                            panelParam: {
                                show: false,
                                margins: true
                            },
                            buttons: [{
                                id: "wewew",
                                text: $.i18n("common.button.ok.label"),
                                handler: function () {
                                    g.customHandler(i);
                                    i.close()
                                }
                            }]
                        });
                        i.currentTarget = {};
                        i.currentTarget.id = i.id;
                        if (g.customLoadHandler != null) {
                            g.customLoadHandler(g.id)
                        }
                    })
                }
                )(e)
            }
        }
    }
    var x = "<li class='margin_l_5 search_btn' style='*margin-top:-1px;'><a class='common_button  search_buttonHand' href='javascript:void(0)'><em></em></a></li>";
    x = o.getSearchBtnHtml();
    var b = document.getElementById(t.id + "_ul");
    SeeUtils.appendTo(x, b);
    var I = SeeUtils.getByClass(b, ".common_drop_down");
    for (var w = 0; w < I.length; w++) {
        var m = I[w];
        _MxtDropDown(m, t)
    }
    SeeUtils.eachAllSonElsByClass(".common_search", function (g) {
        SeeUtils.addEvent(g, "keydown", function (K) {
            var j = K || window.event;
            var i = j.target || j.srcElement;
            if (j.keyCode == 13) {
                var p = SeeUtils.getByClass(document, ".search_btn");
                SeeUtils.eachByClass(document, ".search_btn", function (L) {
                    SeeUtils.executeClick(L)
                });
                if (j.stopPropagation) {
                    j.stopPropagation()
                }
                j.cancelBubble = true;
                return false
            }
        })
    });
    SeeUtils.eachByTag(t.id + "_dropdown_content", "a", function (i, g) {
        SeeUtils.addEvent(i, "click", function (K) {
            var Q = K || window.event;
            var R = Q.target || Q.srcElement;
            var M = SeeUtils.getAttrEl(R, "value");
            if (SeeUtils.hasClass(R, "common_drop_a_select") === false) {
                SeeUtils.addClass(R, "common_drop_a_select");
                SeeUtils.siblings(R, "a", function (W) {
                    SeeUtils.removeClass(W, "common_drop_a_select")
                })
            }
            for (var U = 0; U < t.selects.length; U++) {
                var V = t.selects[U];
                if (V != null) {
                    var L = V.id;
                    if (AssertUtils.isNotEmpty(L)) {
                        var N = SeeUtils.getElByTag(L + "_dropdown_content", "a");
                        if (N.length > 0) {
                            SeeUtils.executeClick(N[0])
                        }
                    }
                }
            }
            for (var P = 0; P < t.inputs.length; P++) {
                var p = t.inputs[P];
                SeeUtils.attrEl(p.id, "value", "");
                if (SeeUtils.getAttrEl(p.id, "type") == "hidden") {
                    SeeUtils.attrEl(p.id + "_txt", "value", "");
                    SeeUtils.removeAttrEl(p.id + "_txt", "title")
                }
            }
            try {
                closeBarCodePort()
            } catch (S) { }
            if (H != null) {
                SeeUtils.getElObj("from_" + H).value = "";
                SeeUtils.getElObj("to_" + H).value = ""
            }
            SeeUtils.eachByClass(document, ".condition_text", function (W) {
                SeeUtils.addClass(W, "hidden")
            });
            SeeUtils.removeClass(M + "_container", "hidden");
            if (M != "") {
                SeeUtils.removeClass(SeeUtils.getFirstElByClass(".search_btn"), "margin_l_5")
            } else {
                SeeUtils.addClass(SeeUtils.getFirstElByClass(".search_btn"), "margin_l_5")
            }
            if (M == "barcode") {
                var O = {};
                var j = O.qType || "com";
                var T = O.comType || "1";
                SeeUtils.eachByTag(M + "_container", "select", function (X, Y) {
                    var Z = X.id;
                    if (!SeeUtils.hasClass(X, "drop_down")) {
                        var W = new MxtDropDown({
                            id: Z
                        });
                        if (Z.indexOf("qType") != -1) {
                            W.setValue(j)
                        } else {
                            W.setValue(T)
                        }
                        SeeUtils.addClass(X, "drop_down")
                    }
                });
                setTimeout(function () {
                    searchBtnClick(E, t)
                }, 100)
            }
        });
        SeeUtils.addEvent(i, "click", t.onchange)
    });
    SeeUtils.eachByClass(document, ".search_btn", function (g) {
        SeeUtils.addEvent(g, "click", function () {
            searchBtnClick(E, t)
        })
    });
    this.p = t;
    this.g = E;
    return this
}
$.fn.searchCondition = function (a) {
    return goSearchCtl(a, $(this).get(0))
}

$.searchCondition = function (a) {
    return new goSearchCtlNoEl(a)
}

var timer = null;
var grayTimer = null;
function MxtSeeGrid(d, c) {
    this.tObj = d;
    this.hset = {};
    this.finished = true;
    this.combo_flag = true;
    this.pager = 0;
    var b = this.tObj;
    this.initDefOptions();
    try {
        if (d.parentNode != null) {
            this.gridTempContent = d.parentNode.innerHTML;
            this.parentNode = d.parentNode
        }
    } catch (a) { }
}
function unescapeHTMLToString(a) {
    String.prototype.replaceAll = function (c, b) {
        return this.replace(new RegExp(c, "gm"), b)
    }

    if (!a) {
        return ""
    }
    a = a.replaceAll("&amp;", "&");
    a = a.replaceAll("&lt;", "<");
    a = a.replaceAll("&gt;", ">");
    a = a.replaceAll("<br>", "");
    a = a.replaceAll("&#039;", "'");
    a = a.replaceAll("&#034;", '"');
    return a
}
MxtSeeGrid.prototype.initDefOptions = function () {
    this.options = {
        id: Math.floor(Math.random() * 100000000) + "_grid",
        height: 200,
        showOrderPanelWidth: 280,
        dbOrderBy: false,
        hideOrderPanel: true,
        hideSubItemsFlag: true,
        width: "auto",
        gridType: "oldGrid",
        leftWidth: 0,
        closeError: false,
        striped: true,
        novstripe: false,
        minwidth: 30,
        minheight: 0,
        resizable: true,
        method: "POST",
        errormsg: "Connection Error",
        usepager: true,
        nowrap: true,
        page: 1,
        total: 1,
        useRp: true,
        useRpInput: true,
        rp: ($.ctx && $.ctx._pageSize) ? $.ctx._pageSize : 20,
        // @inject-start 参数配置
        rpMaxSize: 500,
        rpOptions: [10, 20, 30, 40, 50, 100, 150, 200, 500],
        // @inject-start 参数配置
        title: false,
        idProperty: "id",
        pagestat: "Displaying {from} to {to} of {total} items",
        pagetext: $.i18n("common.the.label"),
        outof: $.i18n("common.page.label"),
        findtext: "Find " + $.i18n("common.page.label"),
        params: {},
        procmsg: "Processing, please wait ...",
        query: "",
        qtype: "",
        nomsg: "No items",
        minColToggle: 2,
        showToggleBtn: true,
        hideOnSubmit: true,
        autoload: true,
        blockOpacity: 0.5,
        preProcess: false,
        addTitleToCell: false,
        dblClickResize: false,
        onDragCol: false,
        onToggleCol: false,
        onChangeSort: false,
        onCurrentPageSort: true,
        clientSort: false,
        dbSort: false,
        onSuccess: false,
        onNoDataSuccess: false,
        onError: false,
        onSubmit: false,
        datas: null,
        click: null,
        dblclick: null,
        render: null,
        callBackTotle: null,
        singleSelect: true,
        managerName: null,
        managerMethod: null,
        localDataLoader: null,
        isEscapeHTML: true,
        heightSubtract: 0,
        customize: true,
        vChangeParam: {
            changeTar: "grid_detail",
            overflow: "auto",
            subHeight: 0,
            position: "static",
            autoResize: true
        },
        vChange: false,
        isHaveIframe: false,
        hChangeParam: {
            subHeight: 55
        },
        hChange: false,
        parentId: null,
        slideToggleBtn: false,
        UMD: "down",
        slideToggleUpHandle: __slideToggleUpHandle,
        slideToggleDownHandle: __slideToggleDownHandle,
        dataTable: false
    }
}

MxtSeeGrid.prototype.destroyGrid = function () {
    if (this.hTable != null) {
        SeeUtils.removeEl(this.hTable);
        this.hTable = null
    }
    if (this.hDiv != null) {
        SeeUtils.removeEl(this.hDiv);
        this.hDiv = null
    }
    if (this.vDiv != null) {
        SeeUtils.removeEl(this.vDiv);
        this.vDiv = null
    }
    if (this.bDiv != null) {
        SeeUtils.removeEl(this.bDiv);
        this.bDiv = null
    }
    if (this.pDiv != null) {
        SeeUtils.removeEl(this.pDiv);
        this.pDiv = null
    }
    if (this.nDiv != null) {
        SeeUtils.removeEl(this.nDiv)
    }
    if (this.nBtn != null) {
        SeeUtils.removeEl(this.nBtn)
    }
    if (this.gDiv != null) {
        SeeUtils.removeEl(this.gDiv)
    }
    SeeUtils.innerHTMl(this.parentNode, this.gridTempContent);
    this.tObj.grid = null
}

MxtSeeGrid.prototype.dragColMoveStart = function (h, f) {
    var b = this;
    var d = this.options;
    SeeUtils.hideEl(b.nDiv);
    b.hideOrderPanelFun();
    SeeUtils.hideEl(b.nBtn);
    b.hset = SeeUtils.offset(b.hDiv);
    b.hset.right = b.hset.left + SeeUtils.getElWidth(d.id + "_h_table");
    b.hset.bottom = b.hset.top + SeeUtils.getElHeight(d.id + "_h_table");
    b.dcol = f;
    b.dcoln = SeeUtils.indexByTag(b.hDiv, "th", f);
    function a() {
        if (SeeUtils.isIE) {
            return "colCopy ie"
        } else {
            return "colCopy"
        }
    }
    var i = SeeUtils.getUUid();
    var c = "<div id='" + i + "' class='" + a() + "' style='position:absolute;float:left;display:none;'>" + f.innerHTML + "</div>";
    SeeUtils.appendToBody(c);
    this.colCopy = SeeUtils.getElObj(i);
    SeeUtils.hideEl(b.cDrag)
}

MxtSeeGrid.prototype.dragColMoveMove = function (d, c) {
    var a = this;
    var b = this.options;
    SeeUtils.addClass(a.dcol, "thMove");
    SeeUtils.removeClass(a.dcol, "thOver");
    if (d.pageX > a.hset.right || d.pageX < a.hset.left || d.pageY > a.hset.bottom || d.pageY < a.hset.top) {
        SeeUtils.css(SeeUtils.getElByTag(document, "body")[0], "cursor", "move")
    } else {
        SeeUtils.css(SeeUtils.getElByTag(document, "body")[0], "cursor", "pointer")
    }
    SeeUtils.css(a.colCopy, "top", (d.pageY + 10) + "px");
    SeeUtils.css(a.colCopy, "left", (d.pageX + 20) + "px");
    SeeUtils.css(a.colCopy, "display", "block")
}

MxtSeeGrid.prototype.dragColMoveEnd = function () {
    var f = this;
    var a = this.options;
    SeeUtils.removeEl(f.colCopy);
    if (f.dcolt != null) {
        var h = SeeUtils.getElByTagAndIndex(f.hDiv, "th", f.dcolt);
        if (f.dcoln > f.dcolt) {
            SeeUtils.insertBefore(f.dcol, h)
        } else {
            SeeUtils.insertAfter(f.dcol, h)
        }
        f.switchCol(f.dcoln, f.dcolt);
        SeeUtils.removeEl(f.cdropleft);
        SeeUtils.removeEl(f.cdropright);
        f.rePosDrag();
        if (a.onDragCol) {
            a.onDragCol(f.dcoln, f.dcolt)
        }
    }
    this.dcol = null;
    this.hset = null;
    this.dcoln = null;
    this.dcolt = null;
    this.colCopy = null;
    SeeUtils.eachByClass(f.hDiv, ".thMove", function (g) {
        SeeUtils.removeClass(g, "thMove")
    });
    SeeUtils.showEl(f.cDrag);
    var d = SeeUtils.getElByTag(f.hDiv, "th");
    var c = [];
    var i = [];
    for (var e = 0; e < d.length; e++) {
        var b = d[e];
        var j = SeeUtils.getAttrEl(b, "colmode");
        SeeUtils.each(a.colModelBak, function (g, k) {
            if (k.name == j && typeof (k) === "object") {
                i[e] = g;
                c.push(k)
            }
        })
    }
    a.colModel = c;
    a._modesMap = i;
    this.saveCustomize()
}

MxtSeeGrid.prototype.dragTableStart = function (h, f) {
    var b = this;
    var d = this.options;
    var c = false;
    SeeUtils.css(SeeUtils.getElByTag(document, "body")[0], "cursor", "row-resize");
    if (f) {
        c = true;
        SeeUtils.css(SeeUtils.getElByTag(document, "body")[0], "cursor", "col-resize")
    }
    d.height = SeeUtils.getElHeight(b.bDiv);
    if (d.vChange == true && d.isHaveIframe == true) {
        var a = SeeUtils.getElObj(d.vChangeParam.changeTar);
        SeeUtils.css(a, "position", "relative");
        $("<div class='grid_mask'></div>").css({
            position: "absolute",
            background: "red",
            top: 0,
            left: 0,
            width: SeeUtils.getElWidth(a) + "px",
            height: SeeUtils.getElHeight(a) + "px",
            "z-index": 20,
            "-moz-opacity": 0,
            opacity: 0
        }).appendTo($(a))
    }
    this.vresize = {
        h: d.height,
        sy: h.pageY,
        w: d.width,
        sx: h.pageX,
        hgo: c
    }
}

MxtSeeGrid.prototype.dragTableMove = function (f) {
    var d = this;
    var b = this.options;
    var l = this.vresize;
    var i = SeeUtils.getPageY(f);
    var k = i - l.sy;
    if (!b.defwidth) {
        b.defwidth = b.width
    }
    if (b.width != "auto" && !b.nohresize && l.hgo) {
        var j = SeeUtils.getPageX(f);
        var c = j - l.sx;
        var a = l.w + c;
        if (a > b.defwidth) {
            this.gDiv.style.width = a + "px";
            b.width = a
        }
    }
    var h = l.h + k;
    if ((h > b.minheight || b.height < b.minheight) && !l.hgo) {
        this.bDiv.style.height = h + "px";
        b.height = h;
        this.fixHeight(h)
    }
    l = null
}

MxtSeeGrid.prototype.dragTableEnd = function () {
    var c = this;
    var d = this.options;
    if (d.vChange == true && d.isHaveIframe == true) {
        var a = SeeUtils.getElObj(d.vChangeParam.changeTar);
        var b = d.vChangeParam.position;
        SeeUtils.css(a, "position", b);
        SeeUtils.eachByClass(SeeUtils.getElObj(d.vChangeParam.changeTar), "grid_mask", function (e) {
            SeeUtils.removeEl(e)
        })
    }
    c.saveCustomize()
}

function _getVisibleTh(d) {
    var a = [];
    var e = _getHeaderThTrObj(d);
    if (e != null) {
        var c = SeeUtils.getElByTag(e, "th");
        for (var f = 0; f < c.length; f++) {
            var b = c[f];
            if (b.style.display === "none") {
                continue
            } else {
                a.push(b)
            }
        }
    }
    return a
}
function _getVisibleThIndex(f, d) {
    var h = _getHeaderThTrObj(f);
    if (h != null) {
        var e = SeeUtils.getElByTag(h, "th");
        var a = [];
        for (var i = 0; i < e.length; i++) {
            var c = e[i];
            if (c.style.display === "none") {
                continue
            } else {
                a.push(c)
            }
        }
        if (d != null) {
            for (var b = 0; b < a.length; b++) {
                if (a[b] === d) {
                    return b
                }
            }
        }
    }
    return -1
}
function _getVisibleThDivByIndex(e, i) {
    var f = _getHeaderThTrObj(e);
    if (f != null) {
        var d = SeeUtils.getElByTag(f, "th");
        var a = [];
        for (var h = 0; h < d.length; h++) {
            var c = d[h];
            if (c.style.display === "none") {
                continue
            } else {
                a.push(c)
            }
        }
        if (i >= 0 && a[i] != null) {
            var b = SeeUtils.getElByTag(a[i], "div");
            if (b.length > 0) {
                return b[0]
            }
        }
    }
    return null
}
MxtSeeGrid.prototype.dragColStart = function (j, f) {
    var h = this;
    var b = this.options;
    SeeUtils.hideEl(h.nDiv);
    h.hideOrderPanelFun();
    SeeUtils.hideEl(h.nBtn);
    var c = SeeUtils.indexByTag(h.cDrag, "div", f);
    var k = _getVisibleThDivByIndex(h, c);
    var d = SeeUtils.getElWidth(k);
    SeeUtils.addClass(f, "dragging");
    SeeUtils.eachBySiblings(f, function (e) {
        SeeUtils.hideEl(e)
    });
    var a = SeeUtils.getPrevEle(f);
    SeeUtils.addClass(a, "dragging");
    SeeUtils.showEl(a);
    var i = false;
    if (navigator.userAgent.indexOf("MSIE 8") != -1 || navigator.userAgent.indexOf("MSIE 9") != -1) {
        i = true
    }
    h.colresize = {
        startX: (i ? window.event.clientX : j.pageX),
        ol: parseInt(f.style.left),
        ow: d,
        n: c
    };
    SeeUtils.css(SeeUtils.getElByTag(document, "body")[0], "cursor", "col-resize")
}

MxtSeeGrid.prototype.dragColMove = function (i) {
    var d = this;
    var a = this.options;
    var b = d.colresize.n;
    var f = false;
    if (navigator.userAgent.indexOf("MSIE 8") != -1 || navigator.userAgent.indexOf("MSIE 9") != -1) {
        f = true
    }
    var k = (f ? window.event.clientX : i.pageX) - d.colresize.startX;
    var j = d.colresize.ol + k;
    var h = d.colresize.ow + k;
    if (h > a.minwidth) {
        var c = SeeUtils.getElByTagAndIndex(d.cDrag, "div", b);
        SeeUtils.css(c, "left", j + "px");
        d.colresize.nw = h
    }
}

MxtSeeGrid.prototype.dragColEnd = function (i) {
    var f = this;
    var h = this.options;
    var j = f.colresize.n;
    var a = f.colresize.nw;
    if (a != null) {
        var d = _getVisibleThDivByIndex(f, j);
        SeeUtils.setElWidth(d, a);
        SeeUtils.eachByTag(f.bDiv, "tr", function (e) {
            var g = _getVisibleTdDivByIndex(e, j);
            SeeUtils.setElWidth(g, a)
        })
    }
    f.hDiv.scrollLeft = f.bDiv.scrollLeft;
    var c = SeeUtils.getElByTagAndIndex(f.cDrag, "div", j);
    SeeUtils.eachBySiblings(c, function (e) {
        SeeUtils.showEl(e)
    });
    SeeUtils.eachByClass(f.cDrag, "dragging", function (e) {
        SeeUtils.removeClass(e, "dragging")
    });
    f.rePosDrag();
    this.fixHeight(null, f);
    f.colresize = false;
    var b = h.colModel[j].name;
    f.saveCustomize()
}

function _getVisibleTdDivByIndex(e, g) {
    var d = SeeUtils.getElByTag(e, "td");
    var a = [];
    for (var f = 0; f < d.length; f++) {
        var c = d[f];
        if (c.style.display === "none") {
            continue
        } else {
            a.push(c)
        }
    }
    if (g >= 0 && a[g] != null) {
        var b = SeeUtils.getElByTag(a[g], "div");
        if (b.length > 0) {
            return b[0]
        }
    }
    return null
}
function _createSpanGetInfo(d, a, c, h) {
    var e = SeeUtils.getUUid();
    var b = "<span id='" + e + "' style='padding-right:" + SeeUtils.getCss(d, "padding-right") + ";padding-left:" + SeeUtils.getCss(d, "padding-left") + ";font-size: " + SeeUtils.getCss(d, "font-size") + "'>" + d.innerHTML + "</span>";
    SeeUtils.prepend(b, SeeUtils.getElByTag(document, "body")[0]);
    var f = SeeUtils.getElObj(e);
    a = SeeUtils.getElWidth(f);
    SeeUtils.eachByTag(c.bDiv, "tr", function (g) {
        var j = 0;
        var i = _getVisibleTdDivByIndex(g, h);
        f.innerHTML = i.innerHTML;
        SeeUtils.css(f, "fontSize", SeeUtils.getCss(i, "font-size"));
        SeeUtils.css(f, "paddingLeft", SeeUtils.getCss(i, "padding-left"));
        SeeUtils.css(f, "paddingRight", SeeUtils.getCss(i, "padding-right"));
        j = SeeUtils.getElWidth(f) + 5;
        a = (j > a) ? j : a
    });
    SeeUtils.removeEl(f);
    return a
}
MxtSeeGrid.prototype.autoResizeColumn = function (e, f) {
    var f = this;
    var b = this.options;
    if (!b.dblClickResize) {
        return
    }
    var c = SeeUtils.indexByTag(f.cDrag, "div", e);
    var k = _getVisibleThDivByIndex(f, c);
    var i = parseInt(e.style.left)
        , d = SeeUtils.getElWidth(k)
        , h = 0
        , a = 0;
    h = _createSpanGetInfo(k, h, f, c);
    h = (b.minWidth > h) ? b.minWidth : h;
    a = i + (h - d);
    var j = SeeUtils.getElByTagAndIndex(f.cDrag, "div", c);
    SeeUtils.css(j, "left", a);
    f.colresize = {
        nw: h,
        n: c
    };
    this.dragEnd(f)
}

MxtSeeGrid.prototype.dragStart = function (f, d, c) {
    var a = this;
    var b = this.options;
    if (f == "colresize") {
        this.dragColStart(d, c)
    } else {
        if (f == "vresize") {
            this.dragTableStart(d, c)
        } else {
            if (f == "colMove") {
                this.dragColMoveStart(d, c)
            }
        }
    }
    $("body").noSelect()
}

MxtSeeGrid.prototype.dragMove = function (c) {
    var a = this;
    var b = this.options;
    if (a.colresize) {
        this.dragColMove(c)
    } else {
        if (a.vresize) {
            this.dragTableMove(c)
        } else {
            if (a.colCopy) {
                this.dragColMoveMove(c)
            }
        }
    }
}

MxtSeeGrid.prototype.dragEnd = function () {
    var b = this.options;
    var a = this;
    if (a.colresize) {
        this.dragColEnd()
    } else {
        if (a.vresize) {
            a.vresize = false;
            this.dragTableEnd()
        } else {
            if (a.colCopy) {
                this.dragColMoveEnd()
            }
        }
    }
    SeeUtils.css(SeeUtils.getElByTag(document, "body")[0], "cursor", "default");
    $("body").noSelect(false)
}

MxtSeeGrid.prototype.extendOptions = function (a) {
    a = $.extend(this.options, a);
    a.colModelBak = $.extend({}, a.colModel);
    this.closeError = a.closeError;
    this.options = a;
    __initVChangeParam(this.options);
    return a
}

MxtSeeGrid.prototype.initGridCtl = function () {
    var a = this;
    a._initTableElAttr();
    a._initGridContainer();
    a._addGridHeader();
    a._addGridBody();
    a._initTableHeight();
    a._initGridHeaderLabel();
    a._initThEvent();
    a.initGridBodyProp();
    a.addRowProp();
    a.addLinDrap();
    a.addVGrip();
    a._addGridPage();
    a._addGridTitle();
    a._addFieldShowHidePanel();
    a._addEditorLayer();
    a._initDocumentEvents();
    a.rePosDrag();
    a.fixHeight();
    a._loadData();
    initFlag = false;
    a._endGridInit()
}

function _tableToggleClick(c, b, a) {
    if (b || b === "true") {
        SeeUtils.toggleClass(c, "hideBody");
        SeeUtils.toggleClass(a, "vsble")
    }
}
MxtSeeGrid.prototype._addSearchitems = function (f, b) {
    if (b.searchitems) {
        var n = "pSearchclick_" + b.id;
        window[n] = function (o, g) {
            $(f.sDiv).slideToggle("fast", function () {
                $(".sDiv:visible input:first", f.gDiv).trigger("focus")
            })
        }

        SeeUtils.prepend("<div class='pGroup'> <div class='pSearch pButton' onclick='" + n + "(event,this)'><span></span></div> </div>  <div class='btnseparator'></div>", b.id + "_pDiv_page");
        var k = b.searchitems;
        var c = ""
            , d = "";
        for (var m = 0; m < k.length; m++) {
            if (b.qtype == "" && k[m].isdefault == true) {
                b.qtype = k[m].name;
                d = 'selected="selected"'
            } else {
                d = ""
            }
            c += "<option value='" + k[m].name + "' " + d + " >" + k[m].display + "&nbsp;&nbsp;</option>"
        }
        if (b.qtype == "") {
            b.qtype = k[0].name
        }
        var l = "inputKeyDownId_" + b.id;
        window[l] = function (g) {
            if (g.keyCode == 13) {
                f.doSearch()
            }
        }

        var a = "selectKeyDownId_" + b.id;
        window[a] = function (g) {
            if (g.keyCode == 13) {
                f.doSearch()
            }
        }

        var e = "clearClickId_" + b.id;
        window[e] = function (g) {
            SeeUtils.eachElsByTagAndProp(f.sDiv, "input", "name", "q", function (o) {
                SeeUtils.setElVal(o, "")
            });
            b.query = "";
            f.doSearch()
        }

        var i = SeeUtils.getUUid();
        var j = "<div class='sDiv2'>" + b.findtext + " <input type='text' value='" + b.query + "' size='30' name='q' id='" + b.id + "_search_input' onkeydown='" + l + "(event)' class='qsbox' />  <select name='qtype' onkeydown='" + a + "(event)'>" + c + "</select></div>";
        var h = "<div class='sDiv' id='" + i + "'>" + j + "<div style='clear:both' onclick='" + e + "()'></div></div>";
        SeeUtils.insertAfter(h, f.bDiv);
        f.sDiv = SeeUtils.getElObj(i)
    }
}

MxtSeeGrid.prototype._addPageRecordLabel = function (b, c) {
    var c = this.options;
    var b = this;
    b.pageInputId = SeeUtils.getUUid();
    var a = "blurInputEventId_" + c.id;
    window[a] = function (h, f) {
        var i = SeeUtils.getElVal(b.pageInputId);
        var g = i.replace(/\D/g, "");
        if (g <= 0) {
            g = c.rp
        }
        SeeUtils.setElVal(b.pageInputId, g);
        SeeUtils.getElObj(b.gridGoId).click()
    }

    if (c.useRpInput) {
        var d = SeeUtils.getElObj(c.id + "_pDiv_page");
        if (typeof (c.noTotal) === "undefined" || typeof (c.noTotal) != "undefined" && c.noTotal == false) {
            SeeUtils.prepend("<span>" + $.i18n("common.display.per.page.label") + "<input type='text' id='" + b.pageInputId + "' name='rp' onblur='" + a + "(event)' maxlength='8' value='" + c.rp + "' class='common_over_page_txtbox' style='width:32px;'/><span class='margin_r_10 total' id='" + c.id + "_total_number'>" + $.i18n("validate.grid.over_page2.js") + "0" + $.i18n("validate.grid.over_page3.js") + "</span><span class='total_page' id='" + c.id + "_total_page'>1</span></span>", d)
        } else {
            SeeUtils.prepend("<span>" + $.i18n("common.display.per.page.label") + "<input type='text' id='" + b.pageInputId + "' name='rp' onblur='" + a + "(event)' maxlength='8' value='" + c.rp + "' class='common_over_page_txtbox' style='width:32px;'/>" + $.i18n("validate.grid.over_page3.js") + "</span>", d)
        }
    }
}

MxtSeeGrid.prototype._addGridPage = function () {
    var a = this.options;
    var i = this;
    if (a.usepager) {
        var preload_click = "pReload_click" + a.id;
        var pFirst_click = "pFirst_click" + a.id;
        var pPrev_click = "pPrev_click" + a.id;
        var pNext_click = "pNext_click" + a.id;
        var pLast_click = "pLast_click" + a.id;
        var pcontrol_input_keydown = "pcontrol_input_keydown" + a.id;
        var grid_go_click = "grid_go_click" + a.id;
        window[preload_click] = function () {
            i.populate()
        }

        window[pFirst_click] = function () {
            i.changePage("first")
        }

        window[pPrev_click] = function () {
            i.changePage("prev")
        }

        window[pNext_click] = function () {
            i.changePage("next")
        }

        window[pLast_click] = function () {
            i.changePage("last")
        }

        window[pcontrol_input_keydown] = function (g) {
            if (g.keyCode == 13) {
                i.changePage("input")
            }
        }

        window[grid_go_click] = function () {
            i.changePage("input", true)
        }

        i.gridGoId = SeeUtils.getUUid();
        if (typeof (a.noTotal) === "undefined" || typeof (a.noTotal) != "undefined" && a.noTotal == false) {
            var h = '<a  onclick="' + pFirst_click + '()"  class="pFirst pButton common_over_page_btn"><span class="pageFirst"></span></a><a  onclick="' + pPrev_click + '()" class="pPrev pButton common_over_page_btn"><span class="pagePrev"></span></a><span class="pcontrol margin_l_10">' + a.pagetext + '<input id="' + a.id + '_page_number" onkeydown="' + pcontrol_input_keydown + '(event)" type="text" maxlength="8" size="8" value="1" class="common_over_page_txtbox"/>' + a.outof + '</span><a onclick="' + pNext_click + '()"  class="pNext pButton common_over_page_btn"><span class="pageNext"></span></a><a  onclick="' + pLast_click + '()" class="pLast pButton common_over_page_btn"><span class="pageLast"></span></a><a  class="common_over_page_btn" style="display:none"><span onclick="' + preload_click + '()"  id="' + a.id + '_pReload" class="pReload pButton "><span class="ico16 refresh_16 margin_lr_5">&nbsp;</span></span></a><a onclick="' + grid_go_click + '()"  href="javascript:void(0)" id="' + i.gridGoId + '" class="common_button margin_lr_10 common_over_page_go">GO</a><div class="pGroup"><span class="pPageStat" id="' + a.id + '_pPageStat"></span></div>'
        } else {
            var h = '<a  onclick="' + pFirst_click + '()"  class="pFirst pButton common_over_page_btn"><span class="pageFirst"></span></a><a  onclick="' + pPrev_click + '()" class="pPrev pButton common_over_page_btn"><span class="pagePrev"></span></a><span class="pcontrol margin_l_10">' + a.pagetext + '<input id="' + a.id + '_page_number" onkeydown="' + pcontrol_input_keydown + '(event)" type="text" maxlength="8" size="8" value="1" class="common_over_page_txtbox"/>' + a.outof + '</span><a onclick="' + pNext_click + '()"  class="pNext pButton common_over_page_btn"><span class="pageNext"></span></a><a  class="common_over_page_btn" style="display:none"><span onclick="' + preload_click + '()"  id="' + a.id + '_pReload" class="pReload pButton "><span class="ico16 refresh_16 margin_lr_5">&nbsp;</span></span></a><a onclick="' + grid_go_click + '()"  href="javascript:void(0)" id="' + i.gridGoId + '" class="common_button margin_lr_10 common_over_page_go">GO</a><div class="pGroup"><span class="pPageStat" id="' + a.id + '_pPageStat"></span></div>'
        }
        var c = '<div class="pDiv" id="' + a.id + '_pDiv"><div id="' + a.id + '_pDiv_page" class="pDiv2 common_over_page align_right" style="padding-top:10px;padding-bottom:10px;">' + h + "</div></div>";
        SeeUtils.insertAfter(c, i.bDiv);
        i.pDiv = document.getElementById(a.id + "_pDiv");
        this._addPageRecordLabel(i, a);
        this._addSearchitems(i, a)
    }
}

MxtSeeGrid.prototype._addGridTitle = function () {
    var d = this.options;
    var c = this;
    if (d.title) {
        function a() {
            if (d.showTableToggleBtn) {
                return '<div class="ptogtitle" onclick="_tableToggleClick(\'' + d.id + "','" + d.showTableToggleBtn + '\',this)" title="Minimize/Maximize Table"><span></span></div>'
            }
            return ""
        }
        var b = [];
        b.push("<div class='mDiv'><div class='ftitle'>" + d.title + "</div>" + a() + "</div>");
        SeeUtils.prepend(b.join(""), c.gDiv)
    }
}

MxtSeeGrid.prototype.createOrderPanel = function () {
    var d = this;
    var f = this.options;
    var e = _initLableHideShowCol(f, d);
    var b = _initCheckBoxHideShowCol(f, d);
    var c = d.getBtnContent(e, b);
    var a = document.createElement("ul");
    a.className = "grid-col-setting";
    a.innerHTML = '<ul class="main-items">\n            <li class="col-setting-item colSetting"><a class="col-setting-item\u2014a">\n                <span class="icon_header"><i class="syIcon sy-column-header-screen"></i></span>\n                <span>' + d.langData[d.getCurLang()]["orderPanel"]["fieldShow"] + '</span>\n                <span class="cell-arrow"><i class="syIcon sy-arrow-right"></i></span></a>\n            </li>\n            <li class="col-setting-item ascCol"><a class="col-setting-item\u2014a">\n                <span class="icon_header"><i class="syIcon sy-arrow-crude-up"></i></span>\n                <span>' + d.langData[d.getCurLang()]["orderPanel"]["ascLabel"] + '</span></a>\n            </li>\n            <li class="col-setting-item descCol"><a class="col-setting-item\u2014a">\n                 <span class="icon_header"><i class="syIcon sy-arrow-crude-down"></i></span>\n                <span>' + d.langData[d.getCurLang()]["orderPanel"]["descLabel"] + '</span></a>\n            </li>\n            </ul>\n              <div class="sub-items nDiv"><table cellpadding="0" cellspacing="0"><tbody>\n              ' + c.join("") + "\n              </tbody></table></div>\n            ";
    SeeUtils.prepend(a, d.gDiv);
    d._orderPanel = a;
    SeeUtils.addEvent(a, "mouseover", function (g) {
        d.hideOrderPanel = false;
        SeeUtils.showEl(d._orderPanel)
    });
    SeeUtils.addEvent(a, "mouseleave", function (g) {
        d.hideOrderPanel = true;
        d.hideOrderPanelFun()
    });
    SeeUtils.addEvent($(a).find(".colSetting").get(0), "mouseover", function (h) {
        var h = h || event;
        var g = (h.target || h.srcElement);
        d.showSubItems(g);
        d.hideSubItemsFlag = false;
        return false
    });
    SeeUtils.addEvent($(a).find(".colSetting").get(0), "mouseleave", function (h) {
        var h = h || event;
        var g = (h.target || h.srcElement);
        d.hideSubItemsFlag = true;
        d.hideSubItems(g);
        return false
    });
    SeeUtils.addEvent($(a).find(".sub-items").get(0), "mouseover", function (h) {
        var h = h || event;
        var g = (h.target || h.srcElement);
        d.showSubItems(g);
        d.hideSubItemsFlag = false;
        return false
    });
    SeeUtils.addEvent($(a).find(".sub-items").get(0), "mouseleave", function (h) {
        var h = h || event;
        var g = (h.target || h.srcElement);
        d.hideSubItemsFlag = true;
        d.hideSubItems(g);
        return false
    });
    SeeUtils.addEvent(a, "click", function (h) {
        var h = h || event;
        var g = (h.target || h.srcElement);
        if ($(g).closest(".col-setting-item").get(0) && $(g).closest(".col-setting-item").get(0).className.indexOf("ascCol") > 0) {
            f.dbSort = true;
            d.reLoadData("asc")
        }
        if ($(g).closest(".col-setting-item").get(0) && $(g).closest(".col-setting-item").get(0).className.indexOf("descCol") > 0) {
            f.dbSort = true;
            d.reLoadData("desc")
        }
    })
}

MxtSeeGrid.prototype.showSubItems = function (a) {
    $(a).closest(".grid-col-setting").find(".sub-items").show()
}

MxtSeeGrid.prototype.hideSubItems = function (b) {
    var a = this;
    if (a.subItemTime) {
        clearTimeout(a.subItemTime)
    }
    a.subItemTime = setTimeout(function () {
        if (a.hideSubItemsFlag) {
            $(b).closest(".grid-col-setting").find(".sub-items").hide()
        }
    }, 250)
}

MxtSeeGrid.prototype.hideOrderPanelFun = function (a) {
    var b = this;
    if (b.panelTime) {
        clearTimeout(b.panelTime)
    }
    b.panelTime = setTimeout(function () {
        if (b.hideOrderPanel) {
            b._orderPanel && SeeUtils.hideEl(b._orderPanel);
            $(b._orderPanel).find(".sub-items").hide()
        }
    }, 300)
}

MxtSeeGrid.prototype.reLoadData = function (_sortorder) {
    var _mxt = this;
    // var _opt = this.options;
    var _sortname = SeeUtils.getAttrEl(_mxt.nBtn, "colName");
    this.options.sortname = _sortname;
    this.options.sortorder = _sortorder;
    _mxt.populate()
}

MxtSeeGrid.prototype.showOrderPanel = function (d) {
    var b = this;
    var d = d || event;
    var c = (d.target || d.srcElement);
    var a = SeeUtils.getElObj($(c).closest(".nBtn").get(0));
    var f = {
        x: parseFloat($($(c).closest(".nBtn").get(0)).css("left")),
        y: parseFloat($($(c).closest(".nBtn").get(0)).css("top"))
    };
    SeeUtils.showEl(b._orderPanel);
    SeeUtils.css(b._orderPanel, "top", $(b.hDiv).height() + "px");
    if (f.x + b.options.showOrderPanelWidth + b.options.leftWidth > $(document.body).width()) {
        SeeUtils.css(b._orderPanel, "left", parseFloat(f.x) - b.options.showOrderPanelWidth + 30 + "px");
        SeeUtils.css($(b._orderPanel).find(".sub-items").get(0), "float", "left");
        SeeUtils.css($(b._orderPanel).find(".main-items").get(0), "float", "right")
    } else {
        SeeUtils.css($(b._orderPanel).find(".sub-items").get(0), "float", "right");
        SeeUtils.css($(b._orderPanel).find(".main-items").get(0), "float", "left");
        SeeUtils.css(b._orderPanel, "left", parseInt(a.style.left) + "px")
    }
}

function _hideOrderPanel() {
    $(".grid-col-setting").hide()
}
function _showColSettingPanel(a) {
    if (a && a.nBtn != null) {
        SeeUtils.addClass(a.nBtn, "set_col");
        SeeUtils.showEl(a.nDiv);
        if (SeeUtils.getElHeight(a.nDiv) >= (SeeUtils.getElHeight(a.bDiv) + SeeUtils.getElHeight(a.pDiv))) {
            SeeUtils.setElHeight(a.nDiv, SeeUtils.getElHeight(a.bDiv) + SeeUtils.getElHeight(a.pDiv) + "px")
        }
    }
}
function _initShowToggleClick(c, b) {
    var a = "nBtn" + c.id;
    window[a] = function (h) {
        if (c.dbOrderBy) {
            if (b._orderPanel != null) {
                var f = v3x.getEvent();
                var d = f.currentTarget;
                var g = $(d).closest(".nBtn").attr("abbrName");
                if (g != null && g != "") {
                    b.showOrderPanel(h)
                } else {
                    _hideOrderPanel();
                    _showColSettingPanel(b)
                }
            } else {
                var f = v3x.getEvent();
                var d = f.currentTarget;
                var g = $(d).closest(".nBtn").attr("abbrName");
                if (g != null && g != "") {
                    b.createOrderPanel();
                    b.showOrderPanel(h)
                } else {
                    _hideOrderPanel();
                    _showColSettingPanel(b)
                }
            }
        } else {
            _showColSettingPanel(b)
        }
        return true
    }

    return a
}
function _initCheckBoxHideShowCol(c, b) {
    var a = "togColClick" + c.id;
    window[a] = function (f) {
        var e = null;
        if (c.dbOrderBy) {
            e = SeeUtils.getCheckedInpus($(b._orderPanel).find(".sub-items").get(0))
        } else {
            e = SeeUtils.getCheckedInpus(b.nDiv)
        }
        if (e.length < c.minColToggle && f.checked == false) {
            f.checked = true;
            return false
        }
        var d = SeeUtils.getNextEl(SeeUtils.getElObj(f).parentNode);
        if (d != null) {
            d.click()
        }
        if (SeeUtils.getElObj("total_0_" + c.id) != null) {
            SeeUtils.setElWidth("total_0_" + c.id, SeeUtils.getElWidth(c.id + "_hDivBox"))
        }
        return false
    }

    return a
}
function _initLableHideShowCol(c, a) {
    var b = "ndcol2Click" + c.id;
    window[b] = function (f) {
        var d = [];
        if (c.dbOrderBy) {
            d = SeeUtils.getCheckedInpus($(a._orderPanel).find(".sub-items").get(0))
        } else {
            d = SeeUtils.getCheckedInpus(a.nDiv)
        }
        if (d.length <= c.minColToggle && SeeUtils.getElByTagAndIndex(SeeUtils.getPrevEle(f), "input", 0).checked) {
            return false
        }
        var e = SeeUtils.getElByTagAndIndex(SeeUtils.getPrevEle(f), "input", 0).value;
        if (SeeUtils.getElByTagAndIndex(SeeUtils.getPrevEle(f), "input", 0).value == "_reset_width_") {
            a.saveCustomize(true, function () {
                window.location.reload()
            });
            f.checked = false
        } else {
            var g = SeeUtils.getElByTagAndIndex(SeeUtils.getPrevEle(f), "input", 0).value;
            return a.toggleCol(g)
        }
        return false
    }

    return b
}
MxtSeeGrid.prototype._addFieldShowHidePanel = function () {
    var c = this;
    var a = this.options;
    c.nBtn = document.createElement("div");
    c.cdropleft = document.createElement("span");
    c.cdropleft.className = "cdropleft";
    c.cdropright = document.createElement("span");
    c.cdropright.className = "cdropright";
    var h = SeeUtils.getElHeight(c.bDiv);
    var j = c.bDiv.offsetTop - 2;
    var f = _initLableHideShowCol(a, c);
    var d = _initCheckBoxHideShowCol(a, c);
    if (SeeUtils.getElByTag(c.hDiv, "th").length) {
        var l = c.getBtnContent(f, d);
        var b = SeeUtils.getUUid();
        var e = "<div class='nDiv' id='" + b + "' style='display: none;top:" + j + "px;marginBottom:" + (h * -1) + "px'><table cellpadding='0' cellspacing='0'><tbody>" + l.join("") + "</tbody></table></div>";
        SeeUtils.prepend(e, c.gDiv);
        c.nDiv = SeeUtils.getElObj(b);
        if (a.showToggleBtn) {
            var i = _initShowToggleClick(a, c);
            var k = SeeUtils.getUUid();
            var m = "<div class='nBtn' id='" + k + "' onclick='" + i + "()'><div title='" + $.i18n("grid.togglefield.js") + "'></div></div>";
            SeeUtils.prepend(m, c.gDiv);
            c.nBtn = SeeUtils.getElObj(k)
        }
    }
}

MxtSeeGrid.prototype.getBtnContent = function (d, a) {
    var b = [];
    var c = this;
    var e = 0;
    SeeUtils.eachByTag(c.hDiv, "th", function (f) {
        SeeUtils.eachByTag(f, "div", function (j) {
            var h = SeeUtils.eachElsByTagAndProp(c.hDiv, "th", "axis", "col" + e)[0];
            var g = 'checked="checked"';
            if (h.style.display == "none") {
                g = ""
            }
            var m = j.parentNode;
            var l = "";
            var k = SeeUtils.getAttrEl(m, "isToggleHideShow");
            if (k == "false") {
                l = "none"
            }
            if (j.innerHTML.indexOf('type="checkbox"') > -1) {
                l = "none"
            }
            var i = "";
            if (j.innerHTML.indexOf("locking_white_16") > -1 || j.innerHTML.indexOf('type="checkbox"') > -1) {
                i = j.innerHTML.replace(/locking_white_16/g, "locking_16")
            } else {
                i = j.innerHTML
            }
            b.push('<tr style="display:' + l + '"><td class="ndcol1"><input onclick="' + a + '(this);" type="checkbox" ' + g + ' class="togCol" value="' + e + '" /></td><td class="ndcol2" onclick="' + d + '(this);return false;">' + i + "</td></tr>");
            e++
        })
    });
    return b
}

MxtSeeGrid.prototype.fixHeight = function (b, e) {
    var e = this;
    var f = this.options;
    b = false;
    if (!b) {
        b = SeeUtils.getElHeight(e.bDiv)
    }
    var j = SeeUtils.getElHeight(e.hDiv);
    SeeUtils.eachByTag(e.cDrag, "div", function (g, h) {
        SeeUtils.setElHeight(g, b + j)
    });
    var i = parseInt(SeeUtils.getElHeight(e.nDiv));
    if (i > b) {
        SeeUtils.setElHeight(e.nDiv, b);
        SeeUtils.setElWidth(e.nDiv, 200)
    } else {
        SeeUtils.setElHeight(e.nDiv, "auto");
        SeeUtils.setElWidth(e.nDiv, "auto")
    }
    e.blockHeight = b;
    SeeUtils.css(e.block, "marginBottom", (b * -1) + "px");
    var a = e.bDiv.offsetTop + b;
    if (f.height != "auto" && f.resizable) {
        a = e.vDiv.offsetTop
    }
    if (e.rDiv) {
        SeeUtils.setElHeight(e.rDiv, a)
    }
    if (f.vChange) {
        var d = SeeUtils.getElObj(f.vChangeParam.changeTar);
        if (d != null && e.gDiv.parentNode != null) {
            var c = SeeUtils.getElHeight(e.gDiv.parentNode);
            SeeUtils.css(d, "overflow", f.vChangeParam.overflow);
            SeeUtils.setElHeight(d, c - SeeUtils.getElHeight(e.gDiv) - f.vChangeParam.subHeight)
        }
    }
}

MxtSeeGrid.prototype._initTableElAttr = function () {
    var a = this.options;
    SeeUtils.showEl(this.tObj);
    SeeUtils.attrEl(this.tObj, "cellPadding", 0);
    SeeUtils.attrEl(this.tObj, "cellSpacing", 0);
    SeeUtils.attrEl(this.tObj, "border", 0);
    SeeUtils.removeAttrEl(this.tObj, "width");
    a.gridClassName = a.id + "_classtag"
}

MxtSeeGrid.prototype.getGridInterface = function (a, b) {
    return this
}

MxtSeeGrid.prototype.rePosDrag = function () {
    var k = this;
    var c = this.options;
    var m = this.hDiv.scrollLeft;
    var n = 0 - m;
    if (m > 0) {
        n -= Math.floor(c.cgwidth / 2)
    }
    SeeUtils.css(k.cDrag, "top", (k.hDiv.offsetTop + 1) + "px");
    var l = this.cdpad;
    SeeUtils.eachByTag(k.cDrag, "div", function (g) {
        SeeUtils.hideEl(g)
    });
    var j = _getVisibleTh(k);
    for (var h = 0; h < j.length; h++) {
        var b = parseInt(SeeUtils.getElWidth(_getVisibleThDivByIndex(k, h)));
        if (n == 0) {
            n -= Math.floor(c.cgwidth / 2)
        }
        b = b + n + l;
        if (isNaN(b)) {
            b = 0
        }
        var a = SeeUtils.getElByTagAndIndex(k.cDrag, "div", h);
        if (a != null) {
            SeeUtils.css(a, "left", b + "px");
            SeeUtils.showEl(a)
        }
        n = b
    }
    var f = SeeUtils.getElByTag(k.bDiv, "table");
    var e = SeeUtils.getByClass(k.hDiv, "hDivBox");
    var d = [];
    if (e.length > 0) {
        d = SeeUtils.getElByTag(e[0], "table")
    }
    if (f.length > 0 && d.length > 0) {
        SeeUtils.css(f[0], "width", SeeUtils.getElWidth(d[0]))
    }
    if (e.length > 0 && d.length > 0) {
        SeeUtils.css(e[0], "width", SeeUtils.getElWidth(d[0]) + 20 + "px")
    }
}

function _getThColInfo(f, a, d, j, c) {
    for (var g = 0; g < f.length; g++) {
        var l = f[g]
            , h = SeeUtils.getAttrEl(l, "colmode")
            , k = SeeUtils.isVisible(l);
        if (h && h != "") {
            for (var e = 0; e < a.colModel.length; e++) {
                var b = a.colModel[e];
                if (b.name == h) {
                    if (!k) {
                        d[b.name] = 0
                    } else {
                        j.push(b.name + "#" + SeeUtils.getElWidth(l))
                    }
                    c.push(b.name);
                    break
                }
            }
        }
    }
}
function _saveInfoToDb(d, c, a, e, b) {
    var f = new ctpUserPreferenceManager();
    f.saveGridPreference(d, c, {
        success: function () {
            if (getCtpTop().vPortal && getCtpTop().vPortal.customize) {
                var g = getCtpTop().vPortal.customize.grid_pref;
                var h = __getPrefStr(g, d, a, e);
                getCtpTop().vPortal.customize.grid_pref = h
            } else {
                var g = __getGridPrefFromLocalStorage();
                var h = __getPrefStr(g, d, a, e);
                __saveToLocalStorage(d, h)
            }
            if (b != undefined) {
                b()
            }
        }
    })
}
MxtSeeGrid.prototype.saveCustomize = function (h, r) {
    var l = this;
    var a = this.options;
    if (a.customize) {
        var q = a.customId;
        if (q) {
            var k = SeeUtils.getElByTag(l.hDiv, "th");
            var f = {};
            var e = [];
            var o = [];
            _getThColInfo(k, a, f, o, e);
            if (h) {
                f = {};
                f.resetWidth = true
            } else {
                f.__ORDER = e
            }
            for (var d = 0; d < e.length; d++) {
                var b = e[d];
                var s = b + "#";
                for (var i = 0; i < o.length; i++) {
                    var c = o[i];
                    if (c.substring(0, s.length) == s) {
                        e[d] = c;
                        break
                    }
                }
            }
            _saveInfoToDb(q, f, h, e, r)
        }
    }
}

MxtSeeGrid.prototype.toggleCol = function (i, c) {
    var f = this;
    var a = this.options;
    var j = this.tObj;
    var h = SeeUtils.eachElsByTagAndProp(this.hDiv, "th", "axis", "col" + i)[0];
    var b = SeeUtils.indexByTag(f.hDiv, "th", h);
    var d = null;
    if (a.dbOrderBy) {
        d = SeeUtils.eachElsByTagAndProp($(f._orderPanel).find(".sub-items").get(0), "input", "value", i)[0]
    } else {
        d = SeeUtils.eachElsByTagAndProp(f.nDiv, "input", "value", i)[0]
    }
    if (c == null) {
        c = h.hidden
    }
    var e = [];
    if (a.dbOrderBy) {
        e = SeeUtils.getCheckedInpus($(f._orderPanel).find(".sub-items").get(0))
    } else {
        e = SeeUtils.getCheckedInpus(f.nDiv)
    }
    if (e.length < a.minColToggle && !c) {
        return false
    }
    if (c) {
        h.hidden = false;
        SeeUtils.showEl(h);
        if (d != null) {
            d.checked = true
        }
    } else {
        h.hidden = true;
        SeeUtils.hideEl(h);
        if (d != null) {
            d.checked = false
        }
    }
    this.hideColByIndex(b, c);
    this.rePosDrag();
    if (a.onToggleCol) {
        a.onToggleCol(i, c)
    }
    this.saveCustomize();
    return c
}

MxtSeeGrid.prototype.hideColByIndex = function (c, a) {
    var b = SeeUtils.getElByTag(this.tObj, "tbody");
    if (b.length > 0) {
        SeeUtils.eachByTag(b[0], "tr", function (e) {
            if (a) {
                var d = SeeUtils.getElByTagAndIndex(e, "td", c);
                SeeUtils.showEl(d)
            } else {
                var d = SeeUtils.getElByTagAndIndex(e, "td", c);
                SeeUtils.hideEl(d)
            }
        })
    }
}

MxtSeeGrid.prototype.switchCol = function (d, b) {
    var e = this;
    var f = this.options;
    var a = SeeUtils.getElByTagAndIndex(this.tObj, "tbody", 0);
    SeeUtils.eachByTag(a, "tr", function (i) {
        var j = SeeUtils.getElByTagAndIndex(i, "td", b);
        var g = SeeUtils.getElByTagAndIndex(i, "td", d);
        if (d > b) {
            SeeUtils.beforeEL(j, g)
        } else {
            SeeUtils.afterEL(j, g)
        }
    });
    var h = SeeUtils.getElByTagAndIndex(this.nDiv, "tr", b);
    var c = SeeUtils.getElByTagAndIndex(this.nDiv, "tr", d);
    if (d > b) {
        SeeUtils.beforeEL(h, c)
    } else {
        SeeUtils.afterEL(h, c)
    }
    this.hDiv.scrollLeft = this.bDiv.scrollLeft
}

MxtSeeGrid.prototype.scroll = function () {
    var a = this;
    var b = this.options;
    this.hDiv.scrollLeft = this.bDiv.scrollLeft;
    this.rePosDrag()
}

MxtSeeGrid.prototype._addGblock = function () {
    var f = this.options;
    var c = this;
    var a = SeeUtils.getElHeight(c.bDiv);
    var d = c.bDiv.offsetTop - 2;
    var b = SeeUtils.getUUid();
    var e = "<div class='gBlock' id='" + b + "' style='height:" + a + "px;opacity:" + f.blockOpacity + ";filter:alpha(opacity=" + f.blockOpacity + ");z-index:1;left:0px;top:" + (d - 2) + "px;margin-bottom:" + (a * -1) + "px;width: " + SeeUtils.getElWidth(c.bDiv) + "px;position:relative;'></div>";
    SeeUtils.prepend(e, this.gDiv);
    c.block = document.getElementById(b)
}

MxtSeeGrid.prototype.populate = function (j) {
    var _mtx = this;
    var _opt = this.options;
    if (this.loading) {
        return true
    }
    if (_opt.onSubmit) {
        var h = _opt.onSubmit();
        if (!h) {
            return false
        }
    }
    this.loading = true;
    if (SeeUtils.getElObj(_opt.id + "_pPageStat") != null) {
        SeeUtils.getElObj(_opt.id + "_pPageStat").innerHTML = _opt.procmsg
    }
    SeeUtils.addClass(_opt.id + "_pReload", "loading");
    SeeUtils.css(_mtx.block, "top", _mtx.bDiv.offsetTop + "px");
    if (_opt.hideOnSubmit) {
        this._addGblock()
    }
    if (SeeUtils.isOpera) {
        SeeUtils.css(this.tObj, "visibility", "hidden")
    }
    if (!_opt.newp) {
        _opt.newp = 1
    }
    if (_opt.page > _opt.pages) {
        _opt.page = _opt.pages
    }
    if (j) {
        _opt.params = j;
        if (j.newp) {
            _opt.newp = j.newp
        }
        if (j.page) {
            _opt.newp = j.page
        }
    }
    var f = {
        page: _opt.newp,
        size: _opt.rp,
        sortField: _opt.sortname,
        sortOrder: _opt.sortorder
    };
    if (_opt.total != null && _opt.total > 1 && _opt.newp > 1) {
        if ((_opt.newp - 1) * _opt.rp > _opt.total) {
            _opt.newp = 1;
            f = {
                page: _opt.newp,
                size: _opt.rp,
                sortField: _opt.sortname,
                sortOrder: _opt.sortorder
            }
        }
    }
    if (document.getElementById(_mtx.pageInputId) && document.getElementById(_mtx.pageInputId).value != f.size) {
        document.getElementById(_mtx.pageInputId).value = f.size
    }
    if (_opt.onCurrentPageSort && !_opt.dbSort) {
        f.sortField = undefined;
        f.sortOrder = undefined
    }
    var a = _opt.managerName && _opt.managerMethod && window[_opt.managerName];
    if (a || _opt.localDataLoader) {
        var d = new CallerResponder();
        // @inject-start: 添加明细列
        d.success = async function (g) {
            if (g == null)
                return
            await limitQueue(
                arr = g.data,
                allfun = (res) => {
                    console.log(res)
                    g.data = res
                    g.rows = g.data;
                    _mtx.addData(g)
                    currentPageSum()
                },
                limit = 20
            )
        }
        // @inject-end
        var error_old_fun = d.error;
        d.error = function (k, g, l) {
            SeeUtils.removeEl(_mtx.block);
            _mtx.loading = false;
            _mtx.addData([]);
            error_old_fun(k, g, l)
        }
        if (_mtx.closeError) {
            d.complete = function () {
                SeeUtils.removeEl(_mtx.block)
            }
        }
        if (a) {
            var e = new window[_opt.managerName]();
            e[_opt.managerMethod](f, _opt.params, d)
        } else {
            _opt.localDataLoader(f, _opt.params, d)
        }
    } else {
        if (_opt.datas != null) {
            _mtx.addData(_opt.datas)
        }
    }
}

MxtSeeGrid.prototype.doSearch = function () {
    var b = this;
    var c = this.options;
    c.query = SeeUtils.getElVal(c.id + "_search_input");
    var a = SeeUtils.eachElsByTagAndProp(b.sDiv, "select", "name", "qtype")[0];
    if (a != null) {
        c.qtype = SeeUtils.getElVal(a);
        c.params[c.qtype] = c.query;
        c.newp = 1;
        this.populate()
    }
}

MxtSeeGrid.prototype.changePage = function (c, b) {
    var d = this;
    var e = this.options;
    SeeUtils.eachByClass(this.hDiv, "sdesc", function (f) {
        SeeUtils.removeClass(f, "sdesc")
    });
    SeeUtils.eachByClass(this.hDiv, "sasc", function (f) {
        SeeUtils.removeClass(f, "sasc")
    });
    if (typeof (e.noTotal) === "undefined" || typeof (e.noTotal) != "undefined" && e.noTotal == false) {
        if (e.total == 0) {
            return false
        }
    }
    if (this.loading) {
        return true
    }
    switch (c) {
        case "first":
            e.newp = 1;
            break;
        case "prev":
            if (e.page > 1) {
                e.newp = parseInt(e.page) - 1
            } else {
                e.newp = 1
            }
            break;
        case "next":
            if (typeof (e.noTotal) === "undefined" || typeof (e.noTotal) != "undefined" && e.noTotal == false) {
                if (e.page < e.pages) {
                    e.newp = parseInt(e.page) + 1
                } else {
                    e.newp = e.pages
                }
            } else {
                e.newp = parseInt(e.page) + 1
            }
            break;
        case "last":
            e.newp = e.pages;
            break;
        case "input":
            var a = parseInt(SeeUtils.getElVal(e.id + "_page_number"));
            if (isNaN(a)) {
                a = 1
            }
            if (a < 1) {
                a = 1
            } else {
                if (a > e.pages) {
                    a = e.pages
                }
            }
            SeeUtils.setElVal(e.id + "_page_number", a);
            e.newp = a;
            break
    }
    e.rpNew = SeeUtils.getElVal(d.pageInputId);
    if (e.rpNew > e.rpMaxSize) {
        e.rpNew = e.rpMaxSize;
        SeeUtils.setElVal(d.pageInputId, e.rpNew)
    }
    if (typeof (e.noTotal) === "undefined" || typeof (e.noTotal) != "undefined" && e.noTotal == false) {
        if ((e.newp == e.page) && (e.rp == e.rpNew) && !b) {
            return false
        }
    } else {
        if (e.total == 0 && c == "next") {
            return false
        }
    }
    e.rp = e.rpNew;
    if (e.onChangePage) {
        e.onChangePage(e.newp)
    } else {
        this.populate()
    }
}

MxtSeeGrid.prototype.addRowProp = function () {
    var d = this;
    var e = this.options;
    var i = true;
    var a = "trClick_" + e.id;
    window[a] = function (event, src) {
        var n = $(src);
        var m = (event.target || event.srcElement);
        if (m.tagName === "DIV" && m.children.length === 1 && m.children[0].type === "checkbox") {
            m = m.children[0];
            if (m.click != null) {
                m.click()
            }
        }
        if (m.href || m.type) {
            if (m.type == "checkbox" || m.type == "radio") {
                var k = m.checked;
                if (k) {
                    SeeUtils.eachBySiblings(src, function (q) {
                        SeeUtils.removeClass(q, "trSelected")
                    });
                    SeeUtils.addClass(src, "trSelected")
                } else {
                    SeeUtils.removeClass(src, "trSelected")
                }
            }
            return true
        }
        if (e.singleSelect && !d.multisel) {
            SeeUtils.eachBySiblings(src, function (q) {
                SeeUtils.removeClass(q, "trSelected")
            });
            if ($(m).find("input[gridrowcheckbox]").size() == 0) {
                n.siblings().find("input[gridrowcheckbox]").prop("checked", false)
            }
            SeeUtils.addClass(src, "trSelected");
            if (SeeUtils.hasClass(src, "trSelected")) {
                var p = n.find("input[gridrowcheckbox]");
                if (p.prop("disabled") == false) {
                    p.prop("checked", true)
                }
            } else {
                n.find("input[gridrowcheckbox]").prop("checked", false)
            }
        }
        if (e.vChange) {
            if (i) {
                if (SeeUtils.getElObj(e.vChangeParam.changeTar) != null && e.vChangeParam.autoResize) {
                    e.UMD = "middle";
                    d.resizeGridUpDown(e.UMD)
                }
                var g = n.find("input[type=checkbox]");
                // @inject-start 取消自动重聚焦
                // if (g.size() > 0) {
                //     try {
                //         g.focus()
                //     } catch (o) { }
                // }
                // @inject-end 取消自动重聚焦
                var j = n.find("input[type=radio]");
                if (j.size() > 0) {
                    try {
                        j.focus()
                    } catch (o) { }
                }
            } else {
                i = true
            }
        }
    }

    var h = "trMousedown_" + e.id;
    window[h] = function (j, g) {
        if (j.shiftKey) {
            SeeUtils.toggleClass(g, "trSelected");
            d.multisel = true;
            $(g).focus();
            $(d.gDiv).noSelect()
        }
        if (j.ctrlKey) {
            SeeUtils.toggleClass(g, "trSelected");
            d.multisel = true;
            $(g).focus()
        }
    }

    var c = "trMouseup_" + e.id;
    window[c] = function (g) {
        if (d.multisel && !g.ctrlKey) {
            d.multisel = false;
            $(d.gDiv).noSelect(false)
        }
    }

    var f = "trMouseenter_" + e.id;
    window[f] = function (j, g) {
        if (d.multisel && j.shiftKey) {
            SeeUtils.toggleClass(g, "trSelected")
        }
    }

    var b = "trMouseleave_" + e.id;
    window[b] = function (j, g) {
        if (d.multisel && j.shiftKey) {
            SeeUtils.toggleClass(g, "trSelected")
        }
    }
}

MxtSeeGrid.prototype.resizeGrid = function (c, e) {
    var d = this;
    var h = this.options;
    switch (e) {
        case "up":
            SeeUtils.setElHeight(d.bDiv, c[0]);
            SeeUtils.setElHeight(h.vChangeParam.changeTar, c[2] + 53);
            break;
        case "middle":
            SeeUtils.setElHeight(d.bDiv, c[1]);
            SeeUtils.setElHeight(h.vChangeParam.changeTar, c[2] - c[1]);
            break;
        case "down":
            SeeUtils.setElHeight(d.bDiv, c[2]);
            SeeUtils.setElHeight(h.vChangeParam.changeTar, 0);
            break;
        case "auto":
            SeeUtils.setElHeight(d.bDiv, c);
            SeeUtils.setElHeight(h.vChangeParam.changeTar, 0);
            break;
        default:
            SeeUtils.setElHeight(d.bDiv, c);
            var f = 0;
            var i = 0;
            var a = 36;
            h.usepager ? f += 53 : null;
            h.resizable ? i += 11 : null;
            var b = SeeUtils.getElHeight(h.parentId) - i - f - a - c;
            SeeUtils.setElHeight(h.vChangeParam.changeTar, b);
            break
    }
}

MxtSeeGrid.prototype.resizeGridUpDown = function (a) {
    var b = this;
    var c = this.options;
    setTimeout(function () {
        var f = 0;
        var g = 0;
        var d = 36;
        c.usepager ? f += 53 : null;
        c.resizable ? g += 11 : null;
        var e = [0, (SeeUtils.getElHeight(c.parentId) - f - g) / 100 * 35, SeeUtils.getElHeight(c.parentId) - g - f - d];
        if (a == "up") {
            if (c.usepager) {
                SeeUtils.hideEl(b.pDiv)
            }
            b.resizeGrid(e, "up")
        } else {
            if (a == "middle") {
                SeeUtils.showEl(b.pDiv);
                b.resizeGrid(e, "middle")
            } else {
                if (a == "down") {
                    SeeUtils.showEl(b.pDiv);
                    b.resizeGrid(e, "down")
                } else {
                    return
                }
            }
        }
        c.UMD = a
    }, 200)
}

function _getHeaderThTrObj(c) {
    var a = SeeUtils.getElByTag(c.hDiv, "thead");
    if (a.length > 0) {
        var b = SeeUtils.getElByTag(a[0], "tr");
        if (b.length > 0) {
            return b[0]
        }
    }
    return null
}
function _initColInfoByTheadTh(c, f, b, e, a) {
    var h = 0;
    var d = _getHeaderThTrObj(c);
    if (d != null) {
        SeeUtils.eachByTag(d, "th", function (i) {
            var l = "";
            var j = SeeUtils.getElByTagAndIndex(i, "div", 0).style.width;
            // @inject-start 表头居中
            var k = $(i).attr('colalign')
            // var k = i.align
            // @inject-end
            var col_abbr = SeeUtils.getAttrEl(i, "abbr");
            if (f.sortname == col_abbr && f.sortname) {
                l += 'class="sorted" '
            }
            l += 'align="' + k + '" ';
            l += 'abbr="' + col_abbr + '"';
            if (i.hidden) {
                l += 'style="display:none"'
            }
            b.push(j);
            e.push(k);
            a.push(l);
            h++
        })
    }
    return h
}
function _addRowByData(z, o, n, c, l, y, u) {
    for (var s = 0; s < z.rows.length; s++) {
        var g = z.rows[s];
        var b = {};
        if (g.name) {
            b.name = g.name.escapeHTML(false)
        }
        if (g.color) {
            b.style = "background:" + g.color
        } else {
            if (s % 2 && o.striped) {
                b["class"] = "erow"
            }
        }
        if (g.disable) {
            b["class"] = b["class"] + " graytr"
        }
        if (g[o.idProperty]) {
            b.id = "row" + g[o.idProperty]
        }
        var k = [];
        $.each(b, function (j, i) {
            k.push(j);
            k.push("=");
            k.push('"' + i + '"')
        });
        var q = [];
        for (var r = 0; r < n; r++) {
            var a, f = o.colModel[r];
            if (typeof g.cell == "undefined") {
                a = g[f.name];
                if (a && typeof a == "string") {
                    a = g[f.name] = unescapeHTMLToString(a);
                    a = a.escapeHTML(true, false)
                }
            } else {
                if (typeof g.cell[r] != "undefined") {
                    a = (g.cell[r] != null) ? g.cell[r] : ""
                } else {
                    a = g.cell[f.name]
                }
            }
            if (a && f.cutsize) {
                a = a.substring(0, f.cutsize)
            }
            if (f.type == "checkbox") {
                a = '<input type="checkbox" gridRowCheckBox="' + o.gridClassName + "\" class='noClick' onclick='_noClickType = false;' row=\"" + s + '" value="' + a + '"/>'
            } else if (f.type == "radio") {
                a = '<input type="radio" gridRowCheckBox="' + o.gridClassName + "\" class='noClick' onclick='_noClickType = false;' row=\"" + s + '" value="' + a + '" name="gridradio"/>'
            } else if (f.type == "button") {
                a = `<a rowid='${o.id}' opttype='edit' style='margin:0 2px' onclick='tr_contentedit_click(event, this)'>编辑</a>` +
                    `<a rowid='${o.id}' opttype='save' style='margin:0 2px' class="display_none" onclick='tr_contentedit_click(event, this)'>保存</a>` +
                    `<a rowid='${o.id}' opttype='cancle' style='margin:0 2px' class="display_none" onclick='tr_contentedit_click(event, this)'>取消</a>`
            } else {
                if (o.render) {
                    var w = o._modesMap ? o._modesMap[r] : r;
                    a = o.render(a, g, s, Number(w), f)
                }
            }
            if (a != 0 && (a === "" || a === null || typeof a === "undefined")) {
                a = ""
            }
            if (a === "") {
                a = ""
            }
            var t = (o.colModel[r].codecfg);
            var v = '<div class="text_overflow' + (t ? " codecfg" : "") + '"' + (t ? ' codecfg="' + t + '"' : "") + ' style="text-align:' + c[r] + ";width:" + l[r] + "" + ((o.nowrap == false) ? ";white-space:normal" : "") + '">' + a + "</div>";
            q.push(`<td ${y[r]} editable=${f.editable == true}>${v}</td>`) // @inject 增加编辑属性
        }
        var m = "trClick_" + o.id;
        var e = "trMousedown_" + o.id;
        var d = "trMouseup_" + o.id;
        var x = "trMouseenter_" + o.id;
        var h = "trMouseleave_" + o.id;
        u.push(`<tr id="tr_${o.id}" onclick ="${m}(event,this)" onmousedown="${e}(event,this)" onmouseup="${d}(event)" onmouseenter="${x}(event,this)" onmouseleave="${h}(event,this)" ${k.join(" ")}>${q.join("")}</tr>`)
    }
}
function _addCellTextTitle(a) {
    SeeUtils.eachByTag(a, "div", function (b) {
        var c = SeeUtils.trim(b.innerText);
        // if (c.length > 0) {
        SeeUtils.attrEl(b, "title", c)
        // }
    })
}
function _addRowClickEvent(c, b) {
    if (c.click) {
        var a = "click_" + c.id;
        window[a] = function (event) {
            var h = event.target || event.srcElement;
            if (h.tagName === "DIV" && h.children.length === 1 && h.children[0].type === "checkbox") {
                h = h.children[0]
            }
            if (h.className.indexOf("noClick") == -1) {
                var f = SeeUtils.closestByTagName(h, "td");
                if (f == null) {
                    return
                }
                var g = f.parentNode;
                if (SeeUtils.hasClass(g, "graytr")) {
                    return
                }
                var d = SeeUtils.indexByTag(g, "td", f);
                var j = SeeUtils.indexByTag(b, "tr", g);
                if (j == -1) {
                    j = 0
                }
                clearTimeout(timer);
                clearTimeout(grayTimer);
                if (c._modesMap) {
                    d = Number(c._modesMap[d])
                }
                if (SeeUtils.isIE8 || SeeUtils.isIE7) {
                    c.click(c.datas.rows[j], j, d);
                    timer = setTimeout(function () {
                        SeeUtils.addClass(g, "graytr")
                    }, 200)
                } else {
                    timer = setTimeout(function () {
                        if (c.datas.rows[j]) {
                            c.click(c.datas.rows[j], j, d);
                            SeeUtils.addClass(g, "graytr")
                        }
                    }, 400)
                }
                grayTimer = setTimeout(function () {
                    SeeUtils.removeClass(g, "graytr")
                }, 400)
            }
        }
        // @inject-start: 单击改双击
        SeeUtils.attrEl(b, "ondblclick", a + "(event)")
        // SeeUtils.attrEl(b, "onclick", a + "(event)")
        // @inject-end
    }
}
function _addRowDbClickEvent(c, b) {
    if (c.dblclick) {
        var a = "Dbclick_" + c.id;
        window[a] = function (i) {
            var h = i.target || i.srcElement;
            if (h.className.indexOf("noClick") == -1) {
                var f = SeeUtils.closestByTagName(h, "td");
                if (f == null) {
                    return
                }
                var g = f.parentNode;
                if (SeeUtils.hasClass(g, "graytr")) {
                    return
                }
                var d = SeeUtils.indexByTag(g, "td", f);
                var j = SeeUtils.indexByTag(b, "tr", g);
                if (j == -1) {
                    j = 0
                }
                clearTimeout(timer);
                clearTimeout(grayTimer);
                if (c.datas.rows[j]) {
                    c.dblclick(c.datas.rows[j], j, d)
                }
            }
        }

        SeeUtils.attrEl(b, "ondblclick", a + "(event)")
    }
}
function _unSelAllCheckBox(a) {
    SeeUtils.eachByClass(a.hDiv, "grid_checkbox", function (b) {
        SeeUtils.eachElsByTagAndProp(b, "input", "type", "checkbox", function (c) {
            c.checked = false
        })
    })
}
MxtSeeGrid.prototype.setCheckState = function (b) {
    for (var a = 0; a < b.length; a++) {
        var c = b[a];
        if (c.state === 0) {
            $(this.bDiv).find("input[value='" + c.id + "']").attr("checked", true)
        } else {
            $(this.bDiv).find("input[value='" + c.id + "']").removeAttr("checked")
        }
    }
}

MxtSeeGrid.prototype.addData = function (l) {
    try {
        if (this.bDiv.scrollTop > 0) {
            this.bDiv.scrollTop = 0
        }
    } catch (n) { }
    var m = this;
    var c = this.options;
    var u = this.tObj;
    _unSelAllCheckBox(m);
    l = $.extend({
        rows: [],
        page: 0,
        total: 0
    }, l);
    c.datas = l;
    if (c.preProcess) {
        l = c.preProcess(l)
    }
    SeeUtils.eachByClass(this.pDiv, "pReload", function (e) {
        SeeUtils.removeClass(e, "loading")
    });
    this.loading = false;
    if (!l) {
        if (SeeUtils.getElObj(c.id + "_pPageStat") != null) {
            SeeUtils.getElObj(c.id + "_pPageStat").innerHTML = c.procmsg
        }
        return false
    }
    if (!l.total) {
        l.total = l.rows.length
    }
    c.total = l.total;
    if (c.total == 0) {
        $("tr, a, td, div", u).unbind();
        $(u).empty();
        c.pages = 1;
        c.page = 1;
        this.buildpager();
        if (SeeUtils.getElObj(c.id + "_pPageStat") != null) {
            SeeUtils.getElObj(c.id + "_pPageStat").innerHTML = c.procmsg
        }
        if (m.block != null) {
            SeeUtils.removeEl(m.block)
        }
        SeeUtils.appendTo("<div id='total_0_" + c.id + "'style='width:" + (parseFloat(SeeUtils.getElWidth(c.id + "_hDivBox")) - 20) + "px;height:1px'></div>", this.bDiv);
        if (c.onNoDataSuccess) {
            c.onNoDataSuccess(this)
        }
        if (c.callBackTotle) {
            c.callBackTotle(c.total)
        }
        try {
            this.rePosDrag()
        } catch (n) {
            if (typeof (console) != "undefined") {
                console && console.log(n, "---msg")
            }
        }
        return false
    } else {
        var h = SeeUtils.getElObj("total_0_" + c.id);
        if (h != null) {
            SeeUtils.removeEl(h)
        }
    }
    c.pages = Math.ceil(c.total / c.rp);
    c.page = l.page;
    if (l.params) {
        c.params = l.params
    }
    this.buildpager();
    var b = [];
    var f = [];
    var a = [];
    var q = [];
    var d = _initColInfoByTheadTh(m, c, f, a, q);
    _addRowByData(l, c, d, a, f, q, b);
    var r = '<tbody id="list" class="hand">' + b.join("") + "</tbody>";
    if ((SeeUtils.isIE && !SeeUtils.isIE10) || (SeeUtils.isIE && document.documentMode == 8) || (SeeUtils.isIE10 && document.documentMode == 9)) {
        SeeUtils.innerHTMl(this.tObj, r);
        try {
            if (document.selection) {
                if (document.selection.createRange()) {
                    var s = document.selection.createRange();
                    s.collapse(true);
                    s.select()
                }
            }
        } catch (o) { }
    } else {
        u.innerHTML = r
    }
    _addCellTextTitle(u);
    _addRowClickEvent(c, u);
    _addRowDbClickEvent(c, u);
    this.addRowProp();
    this.rePosDrag();
    var k = null;
    l = null;
    var j = null;
    if (c.onSuccess) {
        c.onSuccess(this)
    }
    if (c.callBackTotle) {
        c.callBackTotle(c.total)
    }
    if (c.hideOnSubmit) {
        SeeUtils.removeEl(m.block)
    }
    this.hDiv.scrollLeft = this.bDiv.scrollLeft;
    if (c.usepager) {
        SeeUtils.setElWidth(c.id + "_hDivBox", parseFloat(SeeUtils.getElWidth(u)) + 20)
    } else {
        SeeUtils.setElWidth(c.id + "_hDivBox", parseFloat(SeeUtils.getElWidth(u)))
    }
    if (SeeUtils.isOpera) {
        SeeUtils.css(this.tObj, "visibility", "visible")
    }
    $(u).codetext()
}

MxtSeeGrid.prototype.changeSort = function (b) {
    var a = this;
    var c = this.options;
    c.clientSort = true;
    c.dbSort = false;
    if (this.loading) {
        return true
    }
    SeeUtils.hideEl(a.nDiv);
    a._orderPanel && SeeUtils.hideEl(a._orderPanel);
    SeeUtils.hideEl(a.nBtn);
    var d;
    c.onCurrentPageSort == true ? d = SeeUtils.getAttrEl(b, "colmode") : d = SeeUtils.getAttrEl(b, "abbr");
    c.sortType = SeeUtils.getAttrEl(b, "sortType");
    if (c.sortname == d) {
        if (c.sortorder == "asc") {
            c.sortorder = "desc"
        } else {
            c.sortorder = "asc"
        }
    } else {
        c.sortorder = "asc"
    }
    SeeUtils.addClass(b, "sorted");
    SeeUtils.eachBySiblings(b, function (e) {
        SeeUtils.removeClass(e, "sorted")
    });
    SeeUtils.eachByClass(this.hDiv, "sdesc", function (e) {
        SeeUtils.removeClass(e, "sdesc")
    });
    SeeUtils.eachByClass(this.hDiv, "sasc", function (e) {
        SeeUtils.removeClass(e, "sasc")
    });
    SeeUtils.eachByTag(b, "div", function (e) {
        SeeUtils.addClass(e, "s" + c.sortorder)
    });
    c.sortname = d;
    if (c.onCurrentPageSort) {
        this.setSort(c.sortname, c.sortorder, c.sortType)
    } else {
        this.populate()
    }
    if (c.onChangeSort) {
        c.onChangeSort(c.sortname, c.sortorder, c.sortType)
    }
}

MxtSeeGrid.prototype.buildpager = function () {
    var d = this;
    var e = this.options;
    SeeUtils.setElVal(e.id + "_page_number", e.page);
    if (SeeUtils.getElObj(e.id + "_total_page") != null && (typeof (e.noTotal) === "undefined" || typeof (e.noTotal) != "undefined" && e.noTotal == false)) {
        SeeUtils.getElObj(e.id + "_total_page").innerHTML = $.i18n("common.common.label") + e.pages + $.i18n("common.page.label")
    }
    var b = (e.page - 1) * e.rp + 1;
    var a = b + e.rp - 1;
    if (e.total < a) {
        a = e.total
    }
    var c = e.pagestat;
    c = c.replace(/{from}/, b);
    c = c.replace(/{to}/, a);
    c = c.replace(/{total}/, e.total);
    if (SeeUtils.getElObj(e.id + "_pPageStat") != null) {
        SeeUtils.getElObj(e.id + "_pPageStat").innerHTML = c
    }
    if (SeeUtils.getElObj(e.id + "_total_number") != null && (typeof (e.noTotal) === "undefined" || typeof (e.noTotal) != "undefined" && e.noTotal == false)) {
        SeeUtils.getElObj(e.id + "_total_number").innerHTML = $.i18n("validate.grid.over_page2.js") + e.total + $.i18n("validate.grid.over_page3.js")
    }
}

MxtSeeGrid.prototype.setSort = function (b, a, c) {
    var d = this;
    var e = this.options;
    if ($.trim(e.datas) == "") {
        return
    }
    if (!e.datas.rows.sort) {
        return
    }
    e.datas.rows.sort(function (g, f) {
        var i = g[b];
        var h = f[b];
        if (c == "date") {
            i = Date.parse(i);
            h = Date.parse(h)
        }
        if (c == "number") {
            i = Number(i);
            h = Number(h)
        }
        if (c == "string") {
            if (i == null) {
                i = ""
            } else {
                i = "" + i
            }
            if (h == null) {
                h = ""
            } else {
                h = "" + h
            }
            var j = i.localeCompare(h);
            if (a == "desc") {
                return j
            } else {
                return j * -1
            }
        } else {
            if (a == "desc") {
                if (i < h) {
                    return -1
                }
                if (i > h) {
                    return 1
                }
                return 0
            }
            if (a == "asc") {
                if (i > h) {
                    return -1
                }
                if (i < h) {
                    return 1
                }
                return 0
            }
        }
    });
    this.addData(e.datas)
}
    ,
    MxtSeeGrid.prototype.getCellDim = function (d) {
        var f = this;
        var a = this.options;
        var j = parseInt(SeeUtils.getElHeight(d));
        var b = parseInt(SeeUtils.getElHeight(d.parentNode));
        var h = parseInt(d.style.width);
        var l = parseInt(SeeUtils.getElWidth(d.parentNode));
        var i = d.offsetParent.offsetTop;
        var c = d.offsetParent.offsetLeft;
        var k = parseInt(SeeUtils.getCss(d, "paddingLeft"));
        var e = parseInt(SeeUtils.getCss(d, "paddingTop"));
        return {
            ht: j,
            wt: h,
            top: i,
            left: c,
            pdl: k,
            pdt: e,
            pht: b,
            pwt: l
        }
    }
    ,
    MxtSeeGrid.prototype.combo_resetIndex = function (a) {
        if (this.combo_flag) {
            a.selectedIndex = 0
        }
        this.combo_flag = true
    }
    ,
    MxtSeeGrid.prototype.combo_doSelectAction = function (selObj) {
        var g = this;
        var p = this.options;
        eval(selObj.options[selObj.selectedIndex].value);
        selObj.selectedIndex = 0;
        this.combo_flag = false
    }

MxtSeeGrid.prototype.getSelectRows = function () {
    var c = this;
    var e = this.options;
    var b = this.tObj;
    var a = $(b).find("input[gridRowCheckBox=" + e.gridClassName + "]:checked");
    if (a.length <= 0) {
        $(b).find("input[gridRowCheckBox=" + e.gridClassName + "]").each(function () {
            var f = $(this).attr("checked");
            if (f) {
                a.push($(this))
            }
        })
    }
    var d = [];
    a.each(function () {
        var f = SeeUtils.getAttrEl(this, "row");
        d.push(e.datas.rows[f])
    });
    return d
}

MxtSeeGrid.prototype.getPageRows = function () {
    var a = this;
    var c = this.options;
    var b = [];
    SeeUtils.eachElsByTagAndProp(this.tObj, "input", "gridRowCheckBox", c.gridClassName, function (e) {
        var d = SeeUtils.getAttrEl(e, "row");
        b.push(c.datas.rows[d])
    });
    return b
}

MxtSeeGrid.prototype.resizeGridAuto = function () {
    var b = this;
    var d = this.options;
    if (d.parentId != null) {
        var c = 0;
        var a = 36;
        d.usepager ? c += 53 : null;
        d.resizable ? c += 11 : null;
        this.resizeGrid(SeeUtils.getElHeight(d.parentId) - c - a, "auto");
        SeeUtils.setElWidth(d.id, SeeUtils.getElWidth(d.parentId))
    } else {
        SeeUtils.setElWidth(d.id, d.width);
        this.resizeGrid(d.height - d.usepager, "auto")
    }
}

MxtSeeGrid.prototype._initGridContainer = function () {
    var e = this.options;
    var d = this;
    var b = "gDiv_Mouseenter" + e.id;
    window[b] = function () {
        SeeUtils.hideEl(d.nDiv);
        d.hideOrderPanelFun();
        SeeUtils.hideEl(d.nBtn)
    }

    function f() {
        var g = "";
        if (SeeUtils.isIE) {
            g += " ie"
        }
        if (e.novstripe) {
            g += " novstripe"
        }
        return g
    }
    var c = "<div id='" + e.id + "' onmouseenter='" + b + "()' class='" + (e.dataTable ? "flexigrid dataTable" : "flexigrid") + " " + f() + "'></div>";
    SeeUtils.insertBefore(c, this.tObj);
    var a = document.getElementById(e.id);
    if (e.width != "auto") {
        if (isNaN(e.width)) {
            a.style.width = e.width
        } else {
            a.style.width = e.width + "px"
        }
    }
    a.appendChild(this.tObj);
    this.gDiv = a;
    return this.gDiv
}

MxtSeeGrid.prototype._addGridHeader = function () {
    var b = this;
    var c = this.options;
    var a = "<div class='hDiv' id='" + c.id + "_hDiv'><div class='hDivBox' id='" + c.id + "_hDivBox' style='width:100%'><table id='" + c.id + "_h_table' cellPadding='0' cellSpacing='0'></table></div></div>";
    SeeUtils.insertBefore(a, this.tObj);
    this.hDiv = document.getElementById(c.id + "_hDiv");
    b.hDiv = this.hDiv;
    b.hTable = document.getElementById(c.id + "_h_table");
    c.holewidth = SeeUtils.getElWidth(b.hDiv)
}

MxtSeeGrid.prototype._addGridBody = function () {
    var e = this.options;
    var c = this;
    var d = "nBtn_Mouseenter" + e.id;
    window[d] = function () {
        SeeUtils.hideEl(c.nDiv);
        c.hideOrderPanelFun();
        SeeUtils.hideEl(c.nBtn);
        SeeUtils.removeClass(c.nBtn, "set_col")
    }

    var a = "nBtn_Mouseleave" + e.id;
    window[a] = function () {
        if (c.multisel) {
            c.multisel = false
        }
    }

    var b = "<div class='bDiv' onmouseleave='" + a + "()' onmouseenter='" + d + "()'  id='" + e.gridClassName + "_bDiv'></div>";
    SeeUtils.insertBefore(b, this.tObj);
    this.bDiv = document.getElementById(e.gridClassName + "_bDiv");
    return this.bDiv
}

MxtSeeGrid.prototype._initTableHeight = function () {
    var c = this.options;
    if (c.parentId != null) {
        var b = 0;
        var d = 0;
        c.usepager ? b += 52 : null;
        c.resizable ? d += 11 : null;
        c.height = SeeUtils.getElHeight(c.parentId) - b - d - c.heightSubtract;
        if (c.vChange) {
            var a = SeeUtils.getElObj(c.vChangeParam.changeTar);
            if (a != null) {
                SeeUtils.setElHeight(a, 0)
            }
        }
    }
}

MxtSeeGrid.prototype._initThEvent = function () {
    var d = this;
    var e = this.options;
    var b = 0;
    if (!e.colmodel) {
        b = 0
    }
    var f = "ThClick" + e.id;
    window[f] = function (i, g) {
        if (SeeUtils.getAttrEl(g, "abbr") == null || typeof (SeeUtils.getAttrEl(g, "abbr")) === "undefined") {
            return false
        }
        var h = (i.target || i.srcElement);
        if (h.href || h.type) {
            return true
        }
        d.changeSort(g)
    }

    var a = "ThMouseenter" + e.id;
    window[a] = function (v, h) {
        if (!d.colresize && !SeeUtils.hasClass(v, "thMove") && !d.colCopy) {
            SeeUtils.addClass(v, "thOver")
        }
        if (SeeUtils.getAttrEl(v, "abbr") != e.sortname && !d.colCopy && !d.colresize && SeeUtils.getAttrEl(v, "abbr")) {
            SeeUtils.eachByTag(v, "div", function (l) {
                SeeUtils.addClass(l, "s" + e.sortorder)
            })
        } else {
            if (SeeUtils.getAttrEl(v, "abbr") == e.sortname && !d.colCopy && !d.colresize && SeeUtils.getAttrEl(v, "abbr")) {
                var s = (e.sortorder == "asc") ? "desc" : "asc";
                SeeUtils.eachByTag(v, "div", function (l) {
                    SeeUtils.removeClass(l, "s" + e.sortorder);
                    SeeUtils.addClass(l, "s" + e.no)
                })
            }
        }
        if (d.colCopy) {
            var k = SeeUtils.indexByTag(d.hDiv, "th", v);
            if (k == d.dcoln) {
                return false
            }
            if (k < d.dcoln) {
                $(v).append(d.cdropleft)
            } else {
                $(v).append(d.cdropright)
            }
            d.dcolt = k
        } else {
            if (!d.colresize) {
                var q = _getVisibleThIndex(d, v);
                var r = SeeUtils.getElByTagAndIndex(d.cDrag, "div", q);
                var j = 0;
                if (r != null) {
                    j = parseInt(SeeUtils.getCss(r, "left"))
                }
                var p = jQuery(d.nBtn).outerWidth();
                var g = j - p + Math.floor(e.cgwidth / 2);
                var i = SeeUtils.isIE && SeeUtils.isIE7 && (e.colModel[0].type == "checkbox");
                if (i) {
                    g += 5 * q
                }
                SeeUtils.hideEl(d.nDiv);
                d.hideOrderPanelFun();
                SeeUtils.hideEl(d.nBtn);
                SeeUtils.css(d.nBtn, "left", g);
                SeeUtils.css(d.nBtn, "top", d.hDiv.offsetTop + 1);
                SeeUtils.attrEl(d.nBtn, "colName", h);
                var o = SeeUtils.getAttrEl(v, "abbr");
                if (o != null && o != "") {
                    SeeUtils.attrEl(d.nBtn, "abbrName", o)
                } else {
                    SeeUtils.removeAttrEl(d.nBtn, "abbrName")
                }
                SeeUtils.showEl(d.nBtn);
                var u = parseInt(SeeUtils.getElWidth(d.nDiv));
                SeeUtils.css(d.nDiv, "top", d.bDiv.offsetTop - 1);
                if ((g + u) > SeeUtils.getElWidth(d.gDiv)) {
                    var m = j - u + 1;
                    SeeUtils.css(d.nDiv, "left", m)
                } else {
                    SeeUtils.css(d.nDiv, "left", g - 5)
                }
                if (SeeUtils.hasClass(v, "sorted")) {
                    SeeUtils.addClass(d.nBtn, "srtd")
                } else {
                    SeeUtils.removeClass(d.nBtn, "srtd")
                }
            }
        }
    }

    var c = "ThMouseleave" + e.id;
    window[c] = function (h) {
        SeeUtils.removeClass(h, "thOver");
        var g = SeeUtils.getAttrEl(h, "abbr");
        if (g != e.sortname) {
            SeeUtils.eachByTag(h, "div", function (j) {
                SeeUtils.removeClass(j, "s" + e.sortorder)
            })
        } else {
            if (g == e.sortname) {
                var i = (e.sortorder == "asc") ? "desc" : "asc";
                SeeUtils.eachByTag(h, "div", function (j) {
                    SeeUtils.addClass(j, "s" + e.sortorder);
                    SeeUtils.removeClass(j, "s" + e.no)
                })
            }
        }
        if (d.colCopy) {
            SeeUtils.removeEl(d.cdropleft);
            SeeUtils.removeEl(d.cdropright);
            d.dcolt = null
        }
    }

    this._changeThTdObj(b)
}

MxtSeeGrid.prototype._changeThTdObj = function (b) {
    var c = this;
    var d = this.options;
    var a = SeeUtils.getElByTag(c.hDiv, "thead");
    $("thead tr:first th", c.hDiv).each(function () {
        var e = document.createElement("div");
        if ($(this).attr("abbr")) {
            if ($(this).attr("abbr") == d.sortname) {
                this.className = "sorted";
                e.className = "s" + d.sortorder
            }
        }
        if (this.hidden) {
            $(this).hide()
        }
        if (!d.colmodel) {
            $(this).attr("axis", "col" + b++)
        }
        $(e).css({
            textAlign: this.align,
            width: this.width + "px"
        });
        e.innerHTML = this.innerHTML;
        $(this).empty().append(e).removeAttr("width").mousedown(function (f) {
            c.dragStart("colMove", f, this)
        })
    })
}

function _parseOrder(b) {
    var a = {
        u: b,
        u_width: -1
    };
    var c = b.split("#");
    a.u = c[0];
    if (c.length > 1) {
        a.u_width = c[1]
    }
    return a
}
MxtSeeGrid.prototype._initColWidth = function (e, d, b, a, h, g) {
    for (var c = 0; c < e.length; c++) {
        var f = e[c];
        if (f.name == d.u) {
            if (d.u_width != (-1)) {
                if (!h) {
                    f.width = d.u_width;
                    f.hide = false
                }
            } else {
                f.hide = true
            }
            a[b.length] = c;
            if (f.hide == undefined) {
                if (!(f.isToggleHideShow !== undefined && f.hide && !f.isToggleHideShow)) {
                    f.hide = ((g[d.u] === 0 || g[d.u] === "0") && (!h)) ? true : false
                }
            }
            b.push(f)
        }
    }
}

MxtSeeGrid.prototype._initAddNewCol = function (e, f, a, c) {
    for (var b = 0; b < e.length; b++) {
        var d = e[b];
        if (!f.contains(d.name)) {
            a[c.length] = b;
            c.push(d)
        }
    }
}

function _getColWidth(b, h, e) {
    var d = null;
    if (h.gridType === "autoGrid") {
        var a = SeeUtils.getElWidth(e.bDiv);
        if (!e.hasScrollerFlag) {
            var c = ((h.holewidth - 20 - h.colModel.length * 12) * parseInt(b.width) / e.summaryWidth);
            if (SeeUtils.isIE8) {
                b.width = c - 4
            } else {
                b.width = c
            }
            d = b.width
        } else {
            d = b.width - 10
        }
    } else {
        if (b.width) {
            var f = b.width + "";
            if (f.indexOf("%") > -1) {
                var c = (h.holewidth - 10) * parseInt(f) / 100;
                b.width = c - 10;
                d = b.width
            } else {
                d = b.width - 10
            }
        }
    }
    return d
}
MxtSeeGrid.prototype._initHeaderLabel = function (a) {
    var c = this.options;
    var b = "";
    if (a.display != undefined) {
        if (a.type == "checkbox") {
            b = "<input  type='checkbox' onclick=\"getGridSetAllCheckBoxSelect123456(this,'" + c.gridClassName + "')\"/>"
        } else {
            if (a.type == "radio") {
                b = ""
            } else {
                b = a.display
            }
        }
    }
    return b
}

var colWidthMapping = {
    smallest: 50,
    small: 80,
    medium: 140,
    big: 300
};
function _initAutoGridColInfo(e, d) {
    var f = SeeUtils.getElWidth(d.bDiv);
    if (e.gridType === "autoGrid") {
        var h = 0;
        var b = 0;
        for (var c = 0; c < e.colModel.length; c++) {
            var a = e.colModel[c];
            if (!AssertUtils.isNumber(a.width)) {
                a.width = colWidthMapping[a.width]
            }
            h = parseFloat(h + "") + parseFloat(a.width)
        }
        d.summaryWidth = h;
        if (h > f) {
            d.hasScrollerFlag = true
        } else {
            d.hasScrollerFlag = false
        }
    }
}
MxtSeeGrid.prototype.addGridTh = function (k) {
    var h = this;
    var a = this.options;
    var s = "ThClick" + a.id;
    var m = "ThMouseenter" + a.id;
    var t = "ThMouseleave" + a.id;
    var f = [];
    _initAutoGridColInfo(a, h);
    for (var d = 0; d < a.colModel.length; d++) {
        var q = a.colModel[d];
        var l = "";
        if (q) {
            var c = this._initHeaderLabel(q);
            q.sortType = q.sortType ? q.sortType : "string";
            var r = q.isToggleHideShow == undefined ? true : q.isToggleHideShow;
            if (q.name == "id" || q.name == "name" || q.name == "title") {
                r = false
            }
            if (q.name && q.sortable) {
                l = " abbr='" + (q.sortname ? q.sortname : q.name) + "'"
            }
            if (q.align == undefined) {
                q.align = "left"
            }
            var o = _getColWidth(q, a, h);
            var j = "";
            if (q.hide) {
                j = " hide=true "
            }
            var n = "";
            if (q.process) {
                n = " process=" + q.process + ""
            }
            var b = "";
            if (q.type == "checkbox") {
                b = " class='grid_checkbox' "
            }
            // @inject-start 表头居中
            f.push("<th align='center' colalign='" + q.align + "' " + (q.sum == true ? 'sum=true' : '') + " width='" + o + "' isToggleHideShow='" + r + "' colMode='" + q.name + "' sortType='" + q.sortType + "' axis='col" + d + "'  " + b + "  " + j + "  " + n + "  " + l + " onclick='" + s + "(event,this)' onmouseenter='" + m + '(this,"' + q.name + "\")' onmouseleave='" + t + "(this)'>" + c + "</th>")
            // f.push("<th align='" + q.align + "' width='" + o + "' isToggleHideShow='" + r + "' colMode='" + q.name + "' sortType='" + q.sortType + "' axis='col" + d + "'  " + b + "  " + j + "  " + n + "  " + l + " onclick='" + s + "(event,this)' onmouseenter='" + m + '(this,"' + q.name + "\")' onmouseleave='" + t + "(this)'>" + c + "</th>")
            // @inject-end
        } else {
            f.push("<th width='30' axis='col" + d + "' onclick='" + s + "(event,this)' onmouseenter='" + m + "(this)' onmouseleave='" + t + "(this)'></th>")
        }
    }
    var e = "<thead id='" + k + "'><tr>" + f.join("") + "</tr></thead>";
    SeeUtils.innerHTMl(this.tObj, e);
    this._initThProp(k)
}

MxtSeeGrid.prototype._initThProp = function (a) {
    SeeUtils.eachByTag(a, "th", function (b) {
        var c = SeeUtils.getAttrEl(b, "hide");
        if (c === "true" || c === true) {
            b.hidden = true
        }
        var d = SeeUtils.getAttrEl(b, "process");
        if (d === "true" || d === true) {
            b.process = true
        }
        var e = SeeUtils.getAttrEl(b, "align");
        if (AssertUtils.isNotEmpty(e)) {
            b.align = e
        } else {
            b.align = "left"
        }
    })
}

MxtSeeGrid.prototype._setColInfoByDsCol = function (l, b) {
    var f = this;
    var a = this.options;
    if (a.customId && l) {
        l = $.parseJSON(l);
        l = l[a.customId];
        if (l && !(l instanceof Array)) {
            var d = []
                , k = {}
                , h = [];
            var c = l.__ORDER;
            if (c.length != a.colModel.length) {
                return
            }
            if (l.resetWidth != undefined) {
                b = l.resetWidth
            }
            if (c && (!b)) {
                for (var e = 0; e < c.length; e++) {
                    var j = _parseOrder(c[e]);
                    if (j.u === "") {
                        return
                    }
                    h.push(j.u);
                    this._initColWidth(a.colModel, j, d, k, b, l)
                }
            }
            this._initAddNewCol(a.colModel, h, k, d);
            a.colModel = d;
            a._modesMap = k
        }
    } else {
        l = null
    }
}

function __saveToLocalStorage(a, b) {
    if (window.localStorage) {
        var c = window.localStorage;
        c.setItem("vPortal_customize_grid_pref", b)
    }
}
function __getGridPrefFromLocalStorage() {
    if (window.localStorage) {
        var a = window.localStorage;
        return a.vPortal_customize_grid_pref
    } else {
        return null
    }
}
MxtSeeGrid.prototype._loadGridPrefFromLocalStorage = function (b) {
    var a = __getGridPrefFromLocalStorage();
    if (a != null) {
        this._setColInfoByDsCol(a, b)
    }
}

function __getPrefStr(d, b, a, c) {
    var e = {};
    if (d) {
        e = $.parseJSON(d)
    }
    var g = e[b];
    if (g == undefined || g == null || g == "") {
        g = {}
    }
    if (a) {
        g.resetWidth = true
    } else {
        g.__ORDER = c
    }
    e[b] = g;
    var f = $.toJSON(e);
    return f
}
MxtSeeGrid.prototype._initGridHeaderLabel = function () {
    var e = this.options;
    var a = this;
    var d;
    var c = SeeUtils.getUUid();
    if ($.ctx) {
        d = $.ctx._currentPathId
    }
    if (d && !e.customId) {
        e.customId = d
    }
    var h = false;
    if (e.colModel) {
        if (getCtpTop().vPortal && e.customize && getCtpTop().vPortal.customize) {
            var f = getCtpTop().vPortal.customize.grid_pref;
            this._setColInfoByDsCol(f, h)
        } else {
            this._loadGridPrefFromLocalStorage(h)
        }
        this.addGridTh(c)
    }
    this.hTable_thId = c;
    var b = SeeUtils.getElObj(c);
    if (b) {
        SeeUtils.appendTo(b, a.hTable)
    }
    b = null
}

MxtSeeGrid.prototype.addTopBottomVGrip = function () {
    var d = this;
    var e = this.options;
    var c = "downVGrip";
    window[c] = function (g) {
        if (!SeeUtils.isIE8) {
            d.dragStart("vresize", g)
        }
    }

    var a = "slideToggleUpHandle" + e.id;
    var h = "slideToggleDownHandle" + e.id;
    if (e.resizable && e.height != "auto") {
        var f = "";
        if (e.slideToggleBtn) {
            f = "<div class='vGrip_line'><table align='center' border='0' cellpadding='0' cellspacing='0' height='7'><tr><td align='center'><span onclick='" + a + "()' class='slideUpBtn spiretBarHidden4'><em></em></span><span onclick='" + h + "()' class='slideDownBtn spiretBarHidden3' style='border-left:0;'><em></em></span></td></tr></table></div>"
        } else {
            f = "<span id='dragBtn'></span>"
        }
        var b = '<div class="vGrip" id="' + e.id + 'vGrip" onmousedown="' + c + '(event)">' + f + "</div>";
        SeeUtils.insertAfter(b, d.bDiv);
        d.vDiv = document.getElementById(e.id + "vGrip");
        if (SeeUtils.isIE8) {
            $(d.vDiv).mousedown(function (g) {
                d.dragStart("vresize", g)
            })
        }
        if (e.slideToggleBtn) {
            window[a] = function () {
                e.slideToggleUpHandle(e, d)
            }

            window[h] = function () {
                e.slideToggleDownHandle(e, d)
            }
        } else {
            window[a] = function () { }

            window[h] = function () { }
        }
    }
}

MxtSeeGrid.prototype.addLeftRightVGrip = function () {
    var c = this;
    var e = this.options;
    var a = "rDivDown";
    window[a] = function (f) {
        if (!SeeUtils.isIE8) {
            c.dragStart("vresize", f, true)
        }
    }

    var b = "";
    if (e.resizable && e.width != "auto" && !e.nohresize) {
        b = SeeUtils.getUUid();
        var d = "<div id='" + b + "' style='height: " + SeeUtils.getElHeight("g.gDiv") + "px' class='hGrip' onmousedown='" + a + "(event)'><span></span></div>";
        SeeUtils.appendTo(d, c.gDiv);
        this.rDiv = SeeUtils.getElObj(b)
    }
    if (SeeUtils.isIE8) {
        $("#" + b).mousedown(function (f) {
            c.dragStart("vresize", f, true)
        })
    }
}

MxtSeeGrid.prototype._loadData = function () {
    var b = this.options;
    var a = this;
    if (b.managerName) {
        $("head").append("<script src='" + _ctxPath + "/ajax.do?managerName=" + b.managerName + CsrfGuard.getUrlSurffix() + "' type='text/javascript'><\/script>")
    }
    if (b.datas && b.autoload) {
        a.populate()
    }
}

MxtSeeGrid.prototype._endGridInit = function () {
    var e = this;
    var f = this.options;
    this.tObj.p = f;
    this.tObj.grid = e;
    $(this.tObj).attrObj("_grid", e);
    if ($._autofill) {
        var c = this.tObj.id;
        var b = $._autofill
            , a = b.filllists;
        if (a && a[c]) {
            a[c].rows = a[c].data;
            e.addData(a[c]);
            a[c] = null
        } else {
            var h = _getTableObj(e, e.hDiv);
            var d = _getTableObj(e, e.bDiv);
            if (h != null && d != null) {
                SeeUtils.setElHeight(d, SeeUtils.getElHeight(h));
                SeeUtils.setElWidth(d, SeeUtils.getElWidth(h))
            }
        }
    }
}

function _getTableObj(b, c) {
    var a = SeeUtils.getElByTag(c, "table");
    if (a.length > 0) {
        return a[0]
    }
}
MxtSeeGrid.prototype._addEditorLayer = function () {
    var d = this.options;
    var b = this;
    var c = SeeUtils.getUUid();
    var a = "<div class='iDiv' id='" + c + "' style='display: none'></div>";
    SeeUtils.appendTo(a, b.bDiv);
    b.iDiv = SeeUtils.getElObj(c)
}

MxtSeeGrid.prototype._initDocumentEvents = function () {
    var a = this;
    if (SeeUtils.isIE8 || SeeUtils.isIE9 || SeeUtils.isIE10) {
        $(document).mousemove(function (b) {
            a.dragMove(b)
        })
    } else {
        SeeUtils.addEvent(document, "mousemove", function (b) {
            a.dragMove(b)
        })
    }
    SeeUtils.addEvent(document, "mousemove", function (b) {
        a.dragMove(b)
    });
    SeeUtils.addEvent(document, "mouseup", function (b) {
        a.dragEnd()
    });
    SeeUtils.addEvent(document, "hover", function (b) {
        a.dragEnd()
    })
}

MxtSeeGrid.prototype.addLinDrap = function () {
    var o = this;
    var m = this.options;
    o.cDrag = document.createElement("div");
    var q = _getHeaderThTrObj(o);
    var f = null;
    if (q != null) {
        var b = SeeUtils.getElByTag(q, "th");
        if (b.length > 0) {
            f = b[0]
        }
    }
    if (f != null) {
        var i = SeeUtils.getElByTag(f, "div");
        var k = null;
        if (i.length > 0) {
            k = i[0]
        }
        if (k != null) {
            var c = SeeUtils.getCss(k, "borderLeftWidth");
            var u = SeeUtils.getCss(k, "borderRightWidth");
            var s = SeeUtils.getCss(k, "paddingLeft");
            var a = SeeUtils.getCss(k, "paddingRight");
            var l = SeeUtils.getCss(f, "borderLeftWidth");
            var j = SeeUtils.getCss(f, "borderRightWidth");
            var t = SeeUtils.getCss(f, "paddingLeft");
            var n = SeeUtils.getCss(f, "paddingRight");
            o.cDrag.className = "cDrag";
            o.cdpad = 0;
            o.cdpad += (isNaN(parseInt(c)) ? 0 : parseInt(c));
            o.cdpad += (isNaN(parseInt(u)) ? 0 : parseInt(u));
            o.cdpad += (isNaN(parseInt(s)) ? 0 : parseInt(s));
            o.cdpad += (isNaN(parseInt(a)) ? 0 : parseInt(a));
            o.cdpad += (isNaN(parseInt(l)) ? 0 : parseInt(l));
            o.cdpad += (isNaN(parseInt(j)) ? 0 : parseInt(j));
            o.cdpad += (isNaN(parseInt(t)) ? 0 : parseInt(t));
            o.cdpad += (isNaN(parseInt(n)) ? 0 : parseInt(n))
        }
        SeeUtils.insertBefore(o.cDrag, o.bDiv);
        var e = SeeUtils.getElHeight(o.bDiv);
        var d = SeeUtils.getElHeight(o.hDiv);
        SeeUtils.css(o.cDrag, "top", -d + "px");
        var r = "cgMouseDownId_" + m.id;
        window[r] = function (p, g) {
            o.dragStart("colresize", p, g)
        }

        var h = "cgDbClickDownId_" + m.id;
        window[h] = function (p, g) {
            o.autoResizeColumn(g)
        }

        var q = _getHeaderThTrObj(o);
        SeeUtils.eachByTag(q, "th", function () {
            var p = SeeUtils.getUUid();
            var g = '<div class="cgDiv" id="' + p + '" onmousedown="' + r + '(event,this)" ondblclick="' + h + '(event,this)" style="height: ' + (e + d) + 'px"></div>';
            SeeUtils.appendTo(g, o.cDrag);
            if (!m.cgwidth) {
                m.cgwidth = SeeUtils.getElWidth(p)
            }
        })
    }
}

MxtSeeGrid.prototype.addVGrip = function () {
    this.addTopBottomVGrip();
    this.addLeftRightVGrip()
}

MxtSeeGrid.prototype.initGridBodyProp = function () {
    var a = this;
    var b = this.options;
    if (b.hChange) {
        var c = SeeUtils.getElObj(a.gDiv).parentNode;
        SeeUtils.css(c, "overflow", "hidden");
        b.height = c.height() - b.hChangeParam.subHeight
    }
    if (b.height < 50) {
        b.height = "auto"
    }
    SeeUtils.css(a.bDiv, "height", (b.height == "auto") ? "auto" : b.height - 37 + "px");
    SeeUtils.addEvent(a.bDiv, "scroll", function (d) {
        if (SeeUtils.isIE8) {
            if (a.finished) {
                setTimeout(function () {
                    a.hDiv.scrollLeft = a.bDiv.scrollLeft;
                    a.rePosDrag();
                    a.finished = true
                }, 200);
                a.finished = false
            }
        } else {
            a.scroll()
        }
    });
    SeeUtils.appendTo(this.tObj, a.bDiv);
    if (b.height == "auto") {
        SeeUtils.eachByTag(a.bDiv, "table", function (d) {
            SeeUtils.addClass(d, "autoht")
        })
    }
}

MxtSeeGrid.prototype.langData = {};
MxtSeeGrid.prototype.langData.zh_CN = {
    orderPanel: {
        fieldShow: "列头筛选",
        ascLabel: "升序",
        descLabel: "降序"
    }
};
MxtSeeGrid.prototype.langData.zh_TW = {
    orderPanel: {
        fieldShow: "列頭篩選",
        ascLabel: "昇冪",
        descLabel: "降冪"
    }
};
MxtSeeGrid.prototype.langData.en = {
    orderPanel: {
        fieldShow: "Column header selection",
        ascLabel: "asc",
        descLabel: "desc"
    }
};
MxtSeeGrid.prototype.getCurLang = function () {
    var a;
    if (typeof (_locale) !== "undefined") {
        a = _locale
    } else {
        if (typeof (v3x) !== "undefined" && v3x && v3x.currentLanguage) {
            a = v3x.currentLanguage
        } else {
            if (parent.vPortal && parent.vPortal.locale) {
                a = parent.vPortal.locale
            } else {
                a = "zh_CN"
            }
        }
    }
    return a
}

function __initVChangeParam(a) {
    if (a.vChangeParam.changeTar == undefined) {
        a.vChangeParam.changeTar = "grid_detail"
    }
    if (a.vChangeParam.overflow == undefined) {
        a.vChangeParam.overflow = "auto"
    }
    if (a.vChangeParam.subHeight == undefined) {
        a.vChangeParam.subHeight = 0
    }
    if (a.vChangeParam.autoResize == undefined) {
        a.vChangeParam.autoResize = true
    }
}
function __slideToggleUpHandle(b, a) {
    if (b.UMD == "down") {
        b.UMD = "middle"
    } else {
        if (b.UMD == "middle") {
            b.UMD = "up"
        } else {
            if (b.UMD == "up") {
                a.resizeGridUpDown(b.UMD)
            }
        }
    }
    a.resizeGridUpDown(b.UMD)
}
function __slideToggleDownHandle(b, a) {
    if (b.UMD == "down") {
        a.resizeGridUpDown(b.UMD)
    } else {
        if (b.UMD == "middle") {
            b.UMD = "down"
        } else {
            if (b.UMD == "up") {
                b.UMD = "middle"
            }
        }
    }
    a.resizeGridUpDown(b.UMD)
}
(function (a) {
    a.addFlex = function (c, f) {
        if (typeof (c) === "undefined") {
            return
        }
        if (c.grid) {
            return c
        }
        var d = true;
        var e = new MxtSeeGrid(c);
        e.extendOptions(f);
        e.initGridCtl();
        return c
    }

    var b = false;
    a(document).ready(function () {
        b = true
    });
    a.fn.ajaxgrid = function (c) {
        return a.addFlex(this[0], c)
    }

    a.fn.resizeGrid = function (c) {
        return
    }

    a.fn.getSelectCheckbox = function () {
        var d = this[0].className;
        var c = this[0].className + "_bDiv";
        return a("." + d).find("input[gridRowCheckBox=" + d + "]:checked")
    }

    a.fn.flexReload = function (c) {
        return this.each(function () {
            if (this.grid && (this.p.managerName || this.p.localDataLoader)) {
                this.grid.populate()
            }
        })
    }

    a.fn.flexOptions = function (c) {
        return this.each(function () {
            if (this.grid) {
                a.extend(this.p, c)
            }
        })
    }

    a.fn.flexToggleCol = function (d, c) {
        return this.each(function () {
            if (this.grid) {
                this.grid.toggleCol(d, c)
            }
        })
    }

    a.fn.ajaxgridLoad = function (c) {
        return this.each(function () {
            if (this.grid) {
                if (typeof (this.p.noTotal) === "undefined" || typeof (this.p.noTotal) != "undefined" && this.p.noTotal == false) {
                    this.grid.populate(c)
                } else {
                    this.p.newp = 1;
                    this.grid.populate(c)
                }
            }
        })
    }

    a.fn.ajaxgridData = function (c) {
        return this.each(function () {
            if (this.grid) {
                this.grid.addData(c)
            }
        })
    }

    a.fn.noSelect = function (d) {
        var c = (d == null) ? true : d;
        if (c) {
            return this.each(function () {
                if (SeeUtils.isIE || SeeUtils.isSafari) {
                    a(this).bind("selectstart", function () {
                        return false
                    })
                } else {
                    if (SeeUtils.isFF) {
                        a(this).css("MozUserSelect", "none");
                        a("body").trigger("focus")
                    } else {
                        if (SeeUtils.isOpera) {
                            a(this).bind("mousedown", function () {
                                return false
                            })
                        } else {
                            a(this).attr("unselectable", "on")
                        }
                    }
                }
            })
        } else {
            return this.each(function () {
                if (SeeUtils.isIE || SeeUtils.isSafari) {
                    a(this).unbind("selectstart")
                } else {
                    if (SeeUtils.isFF) {
                        a(this).css("MozUserSelect", "inherit")
                    } else {
                        if (SeeUtils.isOpera) {
                            a(this).unbind("mousedown")
                        } else {
                            a(this).removeAttr("unselectable", "on")
                        }
                    }
                }
            })
        }
    }

    a.fn.flexSearch = function (c) {
        return this.each(function () {
            if (this.grid && this.p.searchitems) {
                this.grid.doSearch()
            }
        })
    }
}
)(jQuery);
function getGridSetAllCheckBoxSelect123456(b, a) {
    if ($(b).prop("checked")) {
        $(".flexigrid").find("input[gridRowCheckBox=" + a + "]").not("input[type=checkbox][disabled]").prop("checked", true)
    } else {
        $(".flexigrid").find("input[gridRowCheckBox=" + a + "]").not("input[type=checkbox][disabled]").prop("checked", false)
    }
    if (typeof (gridSelectAllPersonalFunction) == "function") {
        gridSelectAllPersonalFunction($(b).prop("checked"))
    }
}
function WebFXMenuBar(a) {
    this.allMenuBottons = [];
    this.menuStrBuffer = [];
    this.render = a.render;
    this.contextPath = a.contextPath == null ? "" : a.contextPath;
    this.isPager = true;
    this.pageNumFlag = false;
    this.searchBoxflex = false;
    if (a.searchBoxflex != null) {
        this.searchBoxflex = a.searchBoxflex
    }
    if (a.isPager == false) {
        this.isPager = false
    }
    if (a.pageNumFlag == true) {
        this.pageNumFlag = a.pageNumFlag
    }
    this.searchHtml = a.searchHtml;
    this.top = a.top == null ? 0 : a.top;
    this.left = a.left == null ? 0 : a.left;
    this.borderTop = 0;
    if (a.borderTop == true) {
        this.borderTop = 1
    }
    this.borderBottom = 0;
    if (a.borderBottom == true) {
        this.borderBottom = 1
    }
    this.borderRight = 0;
    if (a.borderRight == true) {
        this.borderRight = 1
    }
    this.borderLeft = 0;
    if (a.borderLeft == true) {
        this.borderLeft = 1
    }
    this.id = a.id ? a.id : Math.floor(Math.random() * 100000000);
    this.type = a.type;
    this.items = a.items;
    this.disabledItemArr = [];
    this.hideIdArray = [];
    this.showSeparate = a.showSeparate != undefined ? a.showSeparate : false
}
WebFXMenuBar.prototype.add = function (a) {
    this.allMenuBottons[this.allMenuBottons.length] = a;
    a.webFXMenuBarObj = this
}

WebFXMenuBar.prototype.addMenu = function (a) {
    this.add(new WebFXMenuButton(a));
    var b = this.allMenuBottons[this.allMenuBottons.length - 1];
    b.toObj(document.getElementById("toolbar_" + this.id))
}

WebFXMenuBar.prototype.isA = false;
WebFXMenuBar.prototype.isB = false;
WebFXMenuBar.prototype.show = function () {
    var l = this;
    if (this.allMenuBottons.length > 0) {
        this.menuStrBuffer = [];
        if (this.isPager) {
            var e = "toolbar_m_r" + l.id + "Click";
            var g = "toolbar_m_l" + l.id + "Click";
            this.menuStrBuffer.push("<div id='toolbar_" + this.id + "_box' class='common_toolbar_box clearfix' style='overflow:hidden; border-top-width:" + this.borderTop + "px;border-bottom-width:" + this.borderBottom + "px;border-left-width:" + this.borderLeft + "px;border-right-width:" + this.borderRight + "px;border-color:#b6b6b6;border-style:solid;'>");
            this.menuStrBuffer.push("<div id='toolbar_" + this.id + "_wrap' class='toolbar_l clearfix' style='overflow:hidden'><div id='toolbar_" + this.id + "' style='height:30px;white-space:nowrap;width:auto'>");
            this.menuStrBuffer.push("</div></div><div id='toolbar_m' class='left hidden'><span class=' toolbar_m_l' onclick='" + g + "()'></span><span class=' toolbar_m_r' onclick='" + e + "()'></span></div>");
            this.menuStrBuffer.push("<div id='toolbar_" + this.id + "_wrap_right' class='toolbar_l clearfix' style='overflow:hidden;float: right;'><div id='toolbar_" + this.id + "_right' style='height:30px;white-space:nowrap;width:auto'></div></div>")
        } else {
            this.menuStrBuffer.push("<div class='common_toolbar_box clearfix' style='_display:inline; border-top-width:" + this.borderTop + "px;border-bottom-width:" + this.borderBottom + "px;border-left-width:" + this.borderLeft + "px;border-right-width:" + this.borderRight + "px;border-color:#b6b6b6;border-style:solid;'>");
            this.menuStrBuffer.push("<div id='toolbar_" + this.id + "' class='toolbar_l clearfix'>");
            this.menuStrBuffer.push("</div>")
        }
        if (this.searchHtml != null) {
            this.menuStrBuffer.push("<div class='toolbar_r clearfix'>");
            var f = document.getElementById(this.searchHtml);
            if (f != null) {
                this.menuStrBuffer.push(f.innerHTML)
            }
            this.menuStrBuffer.push("</div>");
            SeeUtils.removeEl(f)
        }
        this.menuStrBuffer.push("</div>")
    }
    if (this.render == undefined) {
        document.write(this.menuStrBuffer.join(""))
    } else {
        SeeUtils.appendTo(this.menuStrBuffer.join(""), this.render)
    }
    var k = document.getElementById("toolbar_" + this.id);
    var j = document.getElementById("toolbar_" + this.id + "_right");
    for (var t = 0; t < this.allMenuBottons.length; t++) {
        var h = this.allMenuBottons[t];
        h.toObj(k, j);
        if (this.showSeparate) {
            if (t != (this.allMenuBottons.length - 1)) {
                h.toSeparate(k)
            }
        }
    }
    if (this.isPager) {
        this.setPage()
    }
    var c = SeeUtils.getByClass(document, ".sub_ico");
    var b = SeeUtils.getByClass(document, ".rolling_btn_b");
    var m = [];
    for (var x = 0; x < c.length; x++) {
        m.push(c[x])
    }
    for (var v = 0; x < v.length; v++) {
        m.push(b[v])
    }
    for (var a = 0; a < m.length; a++) {
        var d = m[a];
        var o = d.id;
        l.initDisabledItem(o);
        var u = navigator.userAgent.toLowerCase();
        var w = (u.indexOf("opera") != -1);
        var n = (u.indexOf("msie") != -1 && !w);
        var s = "sub_" + o + "mouseover";
        var r = "sub_" + o + "mouseout";
        var q = "sub_" + o + "mouseenter";
        var p = "sub_" + o + "mouseleave";
        if (n) {
            window[s] = function (i) {
                i = SeeUtils.getElObj(i);
                var y = i.id;
                if (SeeUtils.hasClass(i, "common_menu_dis") !== true) {
                    window.setTimeout(function () {
                        l.showMoreMenu(y)
                    }, 20)
                }
            }

            window[r] = function () {
                window.setTimeout(function () {
                    l.hideMoreMenu()
                }, 20)
            }
        } else {
            window[q] = function (y) {
                y = SeeUtils.getElObj(y);
                var i = y.id;
                l.isA = true;
                if (SeeUtils.hasClass(y, "common_menu_dis") !== true) {
                    window.setTimeout(function () {
                        l.showMoreMenu(i)
                    }, 1)
                }
            }

            window[p] = function () {
                l.isA = false;
                window.setTimeout(function () {
                    l.hideMoreMenu()
                }, 1)
            }
        }
    }
    this.menuStrBuffer = []
}

WebFXMenuBar.prototype.disabledPage = function () {
    $("#toolbar_m").find(".toolbar_m_l").addClass("disabled");
    $("#toolbar_m").find(".toolbar_m_r").addClass("disabled")
}

WebFXMenuBar.prototype.enabledPage = function () {
    $("#toolbar_m").find(".toolbar_m_l").removeClass("disabled");
    $("#toolbar_m").find(".toolbar_m_r").removeClass("disabled")
}

function _initBtnStateByPageNum(a) {
    $(".toolBtn").each(function (b, c) {
        var d = $(c).attr("pageNum");
        if ((d + "") === (a + "")) {
            $(c).css("visibility", "visible")
        } else {
            $(c).css("visibility", "hidden")
        }
    })
}
function _rightPageBtnClick(b) {
    var a = "toolbar_m_r" + b.id + "Click";
    window[a] = function () {
        if ($("#toolbar_m").find(".toolbar_m_r").hasClass("disabled")) {
            return void (0)
        }
        window.rightBt = setTimeout(function () {
            if (window.rightBt != null) {
                clearTimeout(window.rightBt)
            }
            var c = parseInt(SeeUtils.getNumber(SeeUtils.getCss("toolbar_" + b.id, "margin-left")));
            var d = parseInt(SeeUtils.getAttrEl("toolbar_m", "move"));
            if (b._subm[d + 1] > 0) {
                SeeUtils.css("toolbar_" + b.id + "_wrap", "width", b._subm[d + 1])
            }
            if (b._subm[d]) {
                $("#toolbar_" + b.id).animate({
                    "margin-left": c - b._subm[d]
                }, 200);
                if (SeeUtils.isIE8) {
                    SeeUtils.attrEl("toolbar_" + b.id, "margin-left", c - b._subm[d])
                }
                d = d + 1;
                SeeUtils.attrEl("toolbar_m", "move", d);
                if (b.pageNumFlag) {
                    _initBtnStateByPageNum(d)
                }
            }
        }, 250)
    }
}
function _leftPageBtnClick(a) {
    var b = "toolbar_m_l" + a.id + "Click";
    window[b] = function () {
        if ($("#toolbar_m").find(".toolbar_m_l").hasClass("disabled")) {
            return void (0)
        }
        window.leftBt = setTimeout(function () {
            if (window.leftBt != null) {
                clearTimeout(window.leftBt)
            }
            var c = parseInt(SeeUtils.getNumber(SeeUtils.getCss("toolbar_" + a.id, "margin-left")));
            if (SeeUtils.isIE8) {
                c = SeeUtils.getNumber(SeeUtils.getAttrEl("toolbar_" + a.id, "margin-left"))
            }
            var d = parseInt(SeeUtils.getAttrEl("toolbar_m", "move")) - 1;
            if (a._subm[d] > 0) {
                SeeUtils.css("toolbar_" + a.id + "_wrap", "width", a._subm[d])
            }
            if (a._subm[d]) {
                $("#toolbar_" + a.id).animate({
                    "margin-left": c + a._subm[d]
                }, 200);
                SeeUtils.attrEl("toolbar_m", "move", d)
            }
            if (a.pageNumFlag) {
                _initBtnStateByPageNum(d)
            }
        }, 250)
    }
}
WebFXMenuBar.prototype.setPage = function (m) {
    var l = this;
    if (!SeeUtils.getElObj("toolbar_" + this.id)) {
        return
    }
    if (m == "hideBtn") {
        SeeUtils.css("toolbar_" + this.id, "margin-left", "0px");
        SeeUtils.css("toolbar_" + this.id + "_wrap", "width", "auto");
        SeeUtils.css("toolbar_m", "display", "none")
    }
    var b = SeeUtils.getElWidth("toolbar_" + this.id);
    var r = SeeUtils.getElWidth("toolbar_" + this.id + "_box");
    SeeUtils.attrEl("toolbar_" + this.id, "totalWidth", b);
    var g = 0;
    var t = SeeUtils.getByClass(document, ".common_search_condition");
    if (t != null && t.length > 0) {
        var a = SeeUtils.getElWidth(t[0]);
        var c = SeeUtils.getAttrEl(t[0], "searchWidth");
        if (c == null) {
            SeeUtils.attrEl(t[0], "searchWidth", a)
        } else {
            a = c
        }
        var q = SeeUtils.getByClass(t[0], "searchLicommon");
        var d = [];
        for (var p = 0; p < q.length; p++) {
            var x = q[p];
            if (SeeUtils.getCss(x, "display") != "none") {
                d.push(x)
            }
        }
        var s = SeeUtils.getByClass(document, ".typeDatemulti");
        if (SeeUtils.getCss(t[0], "position") == "static") {
            g = 0
        } else {
            if (s != null && s.length > 0) {
                g = 440;
                if (this.searchBoxflex) {
                    g = g - 140
                }
            } else {
                if (d.length > 2) {
                    g = a
                } else {
                    g = a * 2;
                    if (a > 160) {
                        g = a + 60
                    }
                }
            }
        }
    }
    var h = SeeUtils.getElWidth("toolbar_" + this.id + "_wrap_right");
    var e = SeeUtils.getElWidth("toolbar_m");
    if (b > (r - g - h - e)) {
        var k = r - g - h - e;
        var v = SeeUtils.getElObj("toolbar_" + this.id).children;
        var y = v.length;
        var f = 0;
        this._subm = [];
        for (var o = 0; o < y; o++) {
            var j = v[o];
            if (j) {
                var w = parseInt(SeeUtils.getCss(j, "margin-left")) || 5;
                if (isNaN(w)) {
                    w = 0
                }
                var u = parseInt(SeeUtils.getCss(j, "margin-right")) || 0;
                if (isNaN(u)) {
                    u = 0
                }
                var n = parseInt(j.offsetWidth);
                if (isNaN(n)) {
                    n = 0
                }
                f = f + n + w + u;
                SeeUtils.attrEl(j, "pageNum", this._subm.length);
                if (f > k) {
                    f = f - n - w - u;
                    SeeUtils.attrEl(j, "pageNum", this._subm.length + 1);
                    this._subm[this._subm.length] = f;
                    f = n + w + u
                }
            }
        }
        if (this._subm.length > 0) {
            k = this._subm[0];
            SeeUtils.attrEl("toolbar_m", "move", 0)
        }
        SeeUtils.showEl("toolbar_m");
        SeeUtils.css("toolbar_" + this.id + "_wrap", "width", k);
        _rightPageBtnClick(l);
        _leftPageBtnClick(l);
        if (this.pageNumFlag) {
            _initBtnStateByPageNum(0)
        }
    }
}

WebFXMenuBar.prototype.hideMoreMenu = function (b) {
    if (this.isA || this.isB || this.isC) {
        return
    }
    this.hiddenFlag = true;
    var a = this;
    setTimeout(function () {
        a.hideMoreMenuAction(b)
    }, 20)
}

WebFXMenuBar.prototype.hideMoreMenuAction = function () {
    if (this.hiddenFlag == true) {
        SeeUtils.removeEl("toolbar_more");
        SeeUtils.removeEl("toolbar_more_iframe");
        showOfficeObj()
    }
}

WebFXMenuBar.prototype.getPosition = function (d) {
    if (this.top == 0 && this.left == 0) {
        var c = document.getElementById(d + "_a");
        var a = c.getBoundingClientRect().left + "px";
        var b = (c.getBoundingClientRect().top - 1) + c.offsetHeight + "px";
        return {
            position: "absolute",
            top: b,
            left: a,
            width: 185,
            "z-index": 500
        }
    } else {
        return {
            position: "absolute",
            top: this.top,
            left: this.left,
            width: 185,
            "z-index": 500
        }
    }
}

WebFXMenuBar.prototype.initDisabledItem = function (g) {
    if (g) {
        var c = this.getMenuButton(g);
        var a = c.subMenu;
        var e = a.allItems;
        var b = this.hideIdArray.join(",");
        for (var d = 0; d < e.length; d++) {
            var f = e[d];
            if (f.disabled != undefined && f.disabled == true) {
                this.disabledItemArr.push(f.id)
            }
        }
    }
}

WebFXMenuBar.prototype.showMoreMenu = function (j) {
    if (j) {
        this.hiddenFlag = false;
        var b = this.getMenuButton(j);
        var m = b.subMenu;
        if (SeeUtils.getElObj("toolbar_more") != null) {
            SeeUtils.removeEl("toolbar_more");
            SeeUtils.removeEl("toolbar_more_iframe")
        }
        var u = this.getPosition(j);
        var o = "toolbar_more" + this.id + "mouseover";
        var n = "toolbar_more" + this.id + "mouseout";
        var c = "<div id='toolbar_more' onmouseenter='" + o + "()' onmouseleave='" + n + "()' style='background:#ffffff;z-index:599;' class='common_order_menu_box clearfix'><ul id='toolbar_more_ul' class='common_order_menu'></ul></div>";
        SeeUtils.appendToBody(c);
        SeeUtils.cssByJson("toolbar_more", u);
        if (m.allItems.length === 0) {
            SeeUtils.cssByJson("toolbar_more_ul", {
                border: "0"
            })
        }
        var h = this;
        window[o] = function () {
            h.isB = true;
            h.hiddenFlag = false
        }

        window[n] = function () {
            h.hiddenFlag = true;
            h.isB = false;
            h.hideMoreMenu()
        }

        var g = m.allItems;
        var s = this.hideIdArray.join(",");
        for (var p = 0; p < g.length; p++) {
            var d = g[p];
            if (s.indexOf(d.id) != -1) {
                continue
            }
            var f = "toolbar_more_ul" + p + "Click";
            var l = '<li><a  id="' + d.id + '_a" onclick="' + f + '(this)" class="order_menuitem" title="' + d.name + '">' + d.name + "</a></li>";
            SeeUtils.appendTo(l, document.getElementById("toolbar_more_ul"));
            SeeUtils.attrEl(d.id + "_a", "value", d.value);
            if (this.disabledItemArr.indexOf(d.id) == -1) {
                (function (i) {
                    window[f] = function (v) {
                        WebFXMenuBar.prototype.isC = true;
                        i.click.apply(v);
                        setTimeout(function () {
                            SeeUtils.removeEl("toolbar_more");
                            SeeUtils.removeEl("toolbar_more_iframe");
                            WebFXMenuBar.prototype.isC = false
                        }, 100)
                    }
                }
                )(d)
            } else {
                window[f] = function () { }

                SeeUtils.css(d.id + "_a", "color", "#D2D2D2")
            }
        }
        var a = document.createElement("iframe");
        a.id = "toolbar_more_iframe";
        a.className = "absolute";
        a.setAttribute("src", "about:blank");
        a.setAttribute("frameborder", "0");
        a.style.zIndex = 9;
        a.style.top = parseFloat(SeeUtils.getCss("toolbar_more", "top")) + "px";
        a.style.left = parseFloat(SeeUtils.getCss("toolbar_more", "left")) + "px";
        a.style.width = SeeUtils.getElWidth("toolbar_more") + "px";
        a.style.height = SeeUtils.getElHeight("toolbar_more") + "px";
        SeeUtils.appendToBody(a);
        var q = document.getElementById(j + "_a");
        var e = parseInt(q.getBoundingClientRect().top) + parseInt(q.clientHeight);
        var r = SeeUtils.getElHeight("toolbar_more");
        var k = parseInt(SeeUtils.getDocumentHeight());
        if ((e + r) > k) {
            var t = SeeUtils.getElHeight(q);
            SeeUtils.css("toolbar_more", "height", k - e - t);
            SeeUtils.css("toolbar_more", "overflow", "auto");
            SeeUtils.addClass("toolbar_more", "border_all");
            SeeUtils.css("toolbar_more_ul", "border", 0);
            SeeUtils.css("toolbar_more_iframe", "height", k - e - t)
        }
        hideOfficeObj();
        if (b.showCallBack) {
            b.showCallBack()
        }
    }
}

WebFXMenuBar.prototype.disabledAll = function () {
    var a = this;
    for (var b = 0; b < this.allMenuBottons.length; b++) {
        var c = this.allMenuBottons[b];
        a.disabled(c.id)
    }
}

WebFXMenuBar.prototype.selected = function (c) {
    var a = this;
    if (c) {
        var b = c + "_a";
        SeeUtils.addClass(b, "selected")
    }
}

WebFXMenuBar.prototype.unselected = function (c) {
    var a = this;
    if (c) {
        var b = c + "_a";
        SeeUtils.removeClass(b, "selected")
    } else {
        SeeUtils.removeClass("toolbar_" + this.id + " a", "selected")
    }
}

function _enabledMouse(b) {
    var e = SeeUtils.getAttrEl(b, "bakonmouseover");
    var d = SeeUtils.getAttrEl(b, "bakonmouseout");
    var c = SeeUtils.getAttrEl(b, "bakonmouseenter");
    var a = SeeUtils.getAttrEl(b, "bakonmouseleave");
    if (typeof (c) != "undefined" || typeof (a) != "undefined") {
        SeeUtils.attrEl(b, "onmouseenter", c);
        SeeUtils.attrEl(b, "onmouseleave", a);
        SeeUtils.removeAttrEl(b, "bakonmouseenter");
        SeeUtils.removeAttrEl(b, "bakonmouseleave")
    }
    if (typeof (e) != "undefined" || typeof (d) != "undefined") {
        SeeUtils.attrEl(b, "onmouseover", e);
        SeeUtils.attrEl(b, "onmouseout", d);
        SeeUtils.removeAttrEl(b, "bakonmouseover");
        SeeUtils.removeAttrEl(b, "bakonmouseout")
    }
}
function _disabledMouse(b) {
    var e = SeeUtils.getAttrEl(b, "onmouseover");
    var d = SeeUtils.getAttrEl(b, "onmouseout");
    var c = SeeUtils.getAttrEl(b, "onmouseenter");
    var a = SeeUtils.getAttrEl(b, "onmouseleave");
    if (typeof (c) != "undefined" || typeof (a) != "undefined") {
        SeeUtils.attrEl(b, "bakonmouseenter", c);
        SeeUtils.attrEl(b, "bakonmouseleave", a);
        SeeUtils.attrEl(b, "onmouseenter", "void(0)");
        SeeUtils.attrEl(b, "onmouseleave", "void(0)")
    }
    if (typeof (e) != "undefined" || typeof (d) != "undefined") {
        SeeUtils.attrEl(b, "bakonmouseover", e);
        SeeUtils.attrEl(b, "bakonmouseout", d);
        SeeUtils.attrEl(b, "onmouseover", "void(0);");
        SeeUtils.attrEl(b, "onmouseout", "void(0);")
    }
}
WebFXMenuBar.prototype.disabled = function (b) {
    var i = this;
    if (b) {
        var a = b + "_a";
        SeeUtils.addClass(a, "common_menu_dis");
        var h = SeeUtils.getAttrEl(a, "onclick");
        var d = SeeUtils.getAttrEl(a, "bakclick");
        if (typeof (h) == "undefined") {
            var g = SeeUtils.getAttrEl(a, "onmouseover");
            var f = SeeUtils.getAttrEl(a, "onmouseout");
            var e = SeeUtils.getAttrEl(a, "onmouseenter");
            var c = SeeUtils.getAttrEl(a, "onmouseleave");
            if (typeof (g) == "undefined") {
                SeeUtils.attrEl(a, "bakonmouseenter", e);
                SeeUtils.attrEl(a, "bakonmouseleave", c);
                SeeUtils.attrEl(a, "onmouseenter", "void(0)");
                SeeUtils.attrEl(a, "onmouseleave", "void(0)")
            } else {
                SeeUtils.attrEl(a, "bakonmouseover", g);
                SeeUtils.attrEl(a, "bakonmouseout", f);
                SeeUtils.attrEl(a, "onmouseover", "void(0);");
                SeeUtils.attrEl(a, "onmouseout", "void(0);")
            }
        } else {
            if (h == "void(0);") {
                SeeUtils.attrEl(a, "bakclick", d)
            } else {
                SeeUtils.attrEl(a, "bakclick", h);
                _disabledMouse(a)
            }
            SeeUtils.attrEl(a, "onclick", "void(0);")
        }
        this.disabledItemArr.push(b)
    }
}

WebFXMenuBar.prototype.enabledAll = function () {
    var a = this;
    for (var b = 0; b < this.allMenuBottons.length; b++) {
        var c = this.allMenuBottons[b];
        a.enabled(c.id)
    }
}

WebFXMenuBar.prototype.enabled = function (b) {
    var m = this;
    if (b) {
        var a = b + "_a";
        if (SeeUtils.getElObj(a) && !SeeUtils.hasClass(a, "common_menu_dis")) {
            return
        }
        SeeUtils.removeClass(a, "common_menu_dis");
        var j = this.getMenuButton(b);
        if (j) {
            var h = SeeUtils.getAttrEl(a, "bakclick");
            if (typeof (h) == "undefined") {
                var g = SeeUtils.getAttrEl(a, "bakonmouseover");
                var e = SeeUtils.getAttrEl(a, "bakonmouseout");
                var d = SeeUtils.getAttrEl(a, "bakonmouseenter");
                var c = SeeUtils.getAttrEl(a, "bakonmouseleave");
                if (typeof (g) == "undefined") {
                    SeeUtils.attrEl(a, "onmouseenter", d);
                    SeeUtils.attrEl(a, "onmouseleave", c);
                    SeeUtils.removeAttrEl(a, "bakonmouseenter");
                    SeeUtils.removeAttrEl(a, "bakonmouseleave")
                } else {
                    SeeUtils.attrEl(a, "onmouseover", g);
                    SeeUtils.attrEl(a, "onmouseout", e);
                    SeeUtils.removeAttrEl(a, "bakonmouseover");
                    SeeUtils.removeAttrEl(a, "bakonmouseout")
                }
            } else {
                SeeUtils.attrEl(a, "onclick", h);
                SeeUtils.removeAttrEl(a, "bakclick");
                _enabledMouse(a)
            }
        }
        if (this.disabledItemArr.length > 0) {
            var k = [];
            for (var f = 0; f < this.disabledItemArr.length; f++) {
                var l = this.disabledItemArr[f];
                if (l != b) {
                    k.push(l)
                }
            }
            this.disabledItemArr = k
        }
        SeeUtils.attrEl(a, "style", "")
    }
}

WebFXMenuBar.prototype.hideBtn = function (d) {
    var a = this;
    if (d) {
        this.hideIdArray.push(d);
        var b = d + "_a";
        if (document.getElementById(b) != null) {
            SeeUtils.hideEl(b);
            var c = document.getElementById(b).nextSibling;
            if (SeeUtils.hasClass(c, "seperate")) {
                SeeUtils.hideEl(c)
            }
            if (this.isPager) {
                this.setPage("hideBtn")
            }
        }
    }
}

WebFXMenuBar.prototype.showBtn = function (h) {
    var a = this;
    if (h) {
        if (this.hideIdArray.length > 0) {
            var g = [];
            for (var d = 0; d < this.hideIdArray.length; d++) {
                var c = this.hideIdArray[d];
                if (c != h) {
                    g.push(c)
                }
            }
            this.hideIdArray = g
        }
        var b = h + "_a";
        SeeUtils.showEl(b);
        var e = document.getElementById(b);
        if (e == null) {
            return
        }
        var f = e.nextSibling;
        if (SeeUtils.hasClass(f, "seperate")) {
            SeeUtils.showEl(f)
        }
    }
}

WebFXMenuBar.prototype.getMenuButton = function (c) {
    if (c && this.allMenuBottons.length > 0) {
        for (var b = 0; b < this.allMenuBottons.length; b++) {
            var a = this.allMenuBottons[b];
            if (a.id == c) {
                return a
            }
        }
    }
}

function WebFXMenuButton(a) {
    this.data = a.data || "";
    this.extendClass = a.extendClass || "";
    this.colorType = a.colorType || "";
    this.color = a.color || "";
    this.img = a.img || "";
    this.id = a.id;
    this.name = a.name;
    this.click = a.click;
    this.className = typeof (a.className) == "undefined" ? "" : a.className;
    this.btnType = typeof (a.btnType) == "undefined" ? "toolBtn" : a.btnType;
    this.subMenu = a.subMenu;
    this.selected = a.selected;
    this.type = a.type;
    this.text = a.text;
    this.items = a.items;
    this.onchange = a.onchange;
    this.disabled = a.disabled;
    this.value = a.value;
    this.checked = a.checked;
    this.position = a.position;
    this.fontColor = a.fontColor;
    this.iconPosition = a.iconPosition;
    this.border = a.border;
    this.showCallBack = a.showCallBack;
    this.initToolBtnCallBack = a.initToolBtnCallBack
}
function _getExtendData(a) {
    if (a.data != null && a.data != "") {
        return " data='" + a.data + "' "
    } else {
        return ""
    }
}
function _getExtendClass(c) {
    var b = "";
    var a = [];
    if (c.extendClass != null && c.extendClass != "") {
        a.push(c.extendClass)
    } else {
        b = ""
    }
    if (c.disabled) {
        a.push("common_menu_dis")
    }
    if (a.length > 0) {
        return " class='" + a.join(" ") + "'"
    } else {
        return ""
    }
    return b
}
function _getExtendStyle(a) {
    if (a.colorType != null && (a.colorType === 2 || a.colorType === "2")) {
        return "background-color:#009def;color:#fff;'"
    } else {
        return ""
    }
}
function _getImgColor(a) {
    if (a.color != null) {
        return " style='color:" + a.color + ";' "
    } else {
        return ""
    }
}
WebFXMenuButton.prototype.toObj = function (a, b) {
    var q = [];
    var h = this.name;
    var e = this;
    var o = "toolbar" + this.id + "_aChange";
    var p = "toolbar" + this.id + "_aClick";
    if (this.type == "select") {
        var r = this.text;
        q.push("<select id='" + this.id + "'");
        if (this.disabled == true) {
            q.push(" disabled='true' ")
        } else {
            q.push(" onchange='" + o + "(this)' ");
            window[o] = function (n) {
                e.onchange.apply(n)
            }
        }
        q.push("class='valign_m " + this.className + "' ><option value='" + this.value + "'>" + r + "</option>");
        if (this.items != null) {
            for (var m = 0; m < this.items.length; m++) {
                var g = this.items[m];
                q.push("<option value='" + g.value + "'>" + g.text + "</option>")
            }
        }
        q.push("</select>");
        if (a != null && a.get != null && a.get(0) != null) {
            SeeUtils.appendTo(q.join(""), a.get(0))
        } else {
            if (a != null) {
                SeeUtils.appendTo(q.join(""), a)
            }
        }
    } else {
        if (this.type == "checkbox") {
            q.push('<label for="' + this.id + '" class="margin_l_10 margin_r_10 hand"><input onclick="' + p + '()" type="checkbox" id="' + this.id + '" value="' + this.value + '" ');
            if (this.checked == true) {
                q.push(' checked="checked" ')
            }
            q.push(' class="radio_com">' + this.text + "</label>");
            if (a != null && a.get != null && a.get(0) != null) {
                SeeUtils.appendTo(q.join(""), a.get(0))
            } else {
                if (a != null) {
                    SeeUtils.appendTo(q.join(""), a)
                }
            }
            window[p] = function () {
                e.click()
            }
        } else {
            if (this.type == "__line") {
                q.push('<div class="toolbar_line" style="margin-top: 6px;margin-bottom: 2px;width: 100%;"><div class="hr_heng">&nbsp;</div></div>');
                if (a != null && a.get != null && a.get(0) != null) {
                    SeeUtils.appendTo(q.join(""), a.get(0))
                } else {
                    if (a != null) {
                        SeeUtils.appendTo(q.join(""), a)
                    }
                }
            } else {
                if (this.type == "__text") {
                    q.push('<div class="toolbar_line" style="margin-top: 6px;margin-bottom: 2px;width: 100%;color:#333;padding-left: 8px;">' + this.name + "</div>");
                    if (a != null && a.get != null && a.get(0) != null) {
                        SeeUtils.appendTo(q.join(""), a.get(0))
                    } else {
                        if (a != null) {
                            SeeUtils.appendTo(q.join(""), a)
                        }
                    }
                } else {
                    var c = navigator.userAgent.toLowerCase();
                    var d = (c.indexOf("opera") != -1);
                    var f = (c.indexOf("msie") != -1 && !d);
                    var l = "sub_" + this.id + "mouseover";
                    var k = "sub_" + this.id + "mouseout";
                    var j = "sub_" + this.id + "mouseenter";
                    var i = "sub_" + this.id + "mouseleave";
                    if (this.position == "right") {
                        q.push("<a class='" + this.btnType + "' style='float:right;" + _getExtendStyle(this) + "' " + _getExtendData(this) + " " + _getExtendClass(this) + " id='" + this.id + "_a' ");
                        if (this.selected != undefined && this.selected == true) {
                            q.push(" class='selected'")
                        }
                        if (this.iconPosition != "right" && this.subMenu != null) {
                            if (f) {
                                q.push(' onmouseover="' + l + "('" + this.id + '\')" onmouseout="' + k + "('" + this.id + "')\" >")
                            } else {
                                q.push(' onmouseenter="' + j + "('" + this.id + '\')" onmouseleave="' + i + "('" + this.id + "')\" >")
                            }
                        } else {
                            q.push(" onclick='" + p + "(this)' >")
                        }
                        if (this.iconPosition == "right") {
                            if (this.fontColor) {
                                q.push("<span id='" + this.id + "_span' class='menu_span' style='color: " + this.fontColor + ";' title='" + h + "'>" + h + "</span>")
                            } else {
                                q.push("<span id='" + this.id + "_span' class='menu_span' title='" + h + "'>" + h + "</span>")
                            }
                            if (this.className != null) {
                                q.push("<em id='" + this.id + "_em' class='" + this.className + "' style='margin-right: 0;'></em>")
                            }
                            if (this.subMenu != null) {
                                q.push("<em id='" + this.id + "'  class='ico16 rolling_btn_b' style='margin-right:0px;margin-left:6px;'></em>")
                            }
                            q.push("</a>")
                        } else {
                            if (this.className != null) {
                                if (this.img != null) {
                                    q.push("<em id='" + this.id + "_em' class='" + this.img + "' " + _getImgColor(this) + "></em>")
                                } else {
                                    q.push("<em id='" + this.id + "_em' class='" + this.className + "'></em>")
                                }
                            }
                            if (h != null && h !== "") {
                                q.push("<span id='" + this.id + "_span' class='menu_span' title='" + h + "'>" + h + "</span>")
                            }
                            if (this.subMenu != null) {
                                q.push("<em id='" + this.id + "'  class='sub_ico' style='margin-right:0px;margin-left:6px;'></em>")
                            }
                            q.push("</a>")
                        }
                        if (b != null && b.get != null && b.get(0) != null) {
                            SeeUtils.appendTo(q.join(""), b.get(0))
                        } else {
                            if (b != null) {
                                SeeUtils.appendTo(q.join(""), b)
                            }
                        }
                        window[p] = function (n) {
                            e.click(n)
                        }
                    } else {
                        q.push("<a class='" + this.btnType + "' style='" + _getExtendStyle(this) + "' " + _getExtendData(this) + " " + _getExtendClass(this) + "  id='" + this.id + "_a' ");
                        if (this.selected != undefined && this.selected == true) {
                            q.push(" class='selected'")
                        }
                        if (this.subMenu != null) {
                            if (f) {
                                q.push(' onmouseover="' + l + "('" + this.id + '\')" onmouseout="' + k + "('" + this.id + "')\" >")
                            } else {
                                q.push(' onmouseenter="' + j + "('" + this.id + '\')" onmouseleave="' + i + "('" + this.id + "')\" >")
                            }
                        } else {
                            q.push(" onclick='" + p + "(this)' >")
                        }
                        if (this.className != null) {
                            if (this.img != null && this.img == this.className) {
                                if (this.img.indexOf("fileUpload.do") > -1) {
                                    q.push("<img id='" + this.id + "_em' src='" + _ctxPath + this.img + "'  style='float:left;margin-top:3px;' width='16px' height='16px' />")
                                } else {
                                    q.push("<em id='" + this.id + "_em' class='" + this.img + "' " + _getImgColor(this) + "></em>")
                                }
                            } else {
                                q.push("<em id='" + this.id + "_em' class='" + this.className + "'></em>")
                            }
                        }
                        if (h != null && h !== "") {
                            q.push("<span id='" + this.id + "_span' class='menu_span' title='" + h + "'>" + h + "</span>")
                        }
                        if (this.subMenu != null) {
                            q.push("<em id='" + this.id + "'  class='sub_ico' style='margin-right:0px;margin-left:6px;'></em>")
                        }
                        q.push("</a>");
                        if (a != null && a.get != null && a.get(0) != null) {
                            SeeUtils.appendTo(q.join(""), a.get(0))
                        } else {
                            if (a != null) {
                                SeeUtils.appendTo(q.join(""), a)
                            }
                        }
                        if (this.disabled !== true) {
                            window[p] = function (n) {
                                e.click(n)
                            }
                        } else {
                            e.webFXMenuBarObj.disabled(this.id)
                        }
                    }
                }
            }
        }
    }
    if (this.initToolBtnCallBack) {
        this.initToolBtnCallBack()
    }
}

WebFXMenuButton.prototype.toSeparate = function (c) {
    var a = "seperate margin_lr_5";
    if (this.className && this.className.indexOf("hidden") != -1) {
        a = "seperate margin_lr_5 hidden"
    }
    var b = document.createElement("em");
    b.className = a;
    if (c != null && c.get != null && c.get(0) != null) {
        SeeUtils.appendTo(b, c.get(0))
    } else {
        if (c != null) {
            SeeUtils.appendTo(b, c)
        }
    }
}

function WebFXMenu() {
    this.allItems = []
}
WebFXMenu.prototype.add = function (a) {
    this.allItems[this.allItems.length] = a
}

function WebFXMenuItem(a) {
    this.id = a.id;
    this.name = a.name;
    this.click = a.click;
    this.className = a.className;
    this.value = a.value;
    this.disabled = a.disabled
}
var calendarCtl = function (c, d) {
    var s = {
        firstDay: 0,
        eventName: "click",
        ifFormat: "%Y-%m-%d",
        autoFill: true,
        align: "Bl",
        range: [1900, 2999],
        singleClick: true,
        weekNumbers: false,
        showsTime: false,
        timeFormat: "24",
        electric: true,
        cache: true,
        showOthers: false,
        defer: 100,
        minuteStep: 5,
        isClear: true,
        clearBlank: true,
        isOutShow: false,
        isJustShowIcon: false,
        isShowIcon: true
    };
    if (c && c.isMini) {
        s.isMini = c.isMini
    }
    if (c && c.ifFormat && c.ifFormat != s.ifFormat) {
        s.autoFill = false
    }
    if (c && c.minuteStep) {
        s.minuteStep = c.minuteStep
    }
    var h = d;
    if (d != null && d.get != null && d.get(0) != null) {
        h = d.get(0)
    }
    var b = h.tagName.toLowerCase()
        , j = h.type;
    if (b == "input") {
        if (j == "text") {
            s.inputField = h
        } else {
            if (j == "button") {
                s.button = h
            }
        }
    } else {
        s.displayArea = h
    }
    var v = SeeUtils.extend(s, c);
    SeeUtils.getAttrEl(h, "_inited");
    if (SeeUtils.getAttrEl(h, "_inited") == 1) {
        var k = h.nextSibling;
        if (k != null) {
            SeeUtils.removeEl(k)
        }
        h.removeAttribute("_icoed")
    } else {
        SeeUtils.attrEl(h, "_inited", 1)
    }
    var x = v.inputField;
    var r = SeeUtils.getElObj(x);
    if (x && !x._icoed) {
        var o = -20;
        if (SeeUtils.hasClass(r.parentNode, "common_txtbox_wrap")) {
            o = -20
        }
        var l = -1;
        if (SeeUtils.isIE) {
            l = 2;
            if (SeeUtils.isIE6 || SeeUtils.isIE7) {
                l = 6
            }
            if (SeeUtils.isIE10 || SeeUtils.isIE11) {
                l = 0
            }
        }
        var q = document.createElement("span");
        q.className = "calendar_icon_area";
        q.innerHTML = "<span class='calendar_icon' style='left:" + o + "px;top:" + l + "px;position: absolute; font-size:14px;'></span>";
        if (SeeUtils.isIE) {
            if (SeeUtils.isIE6 || SeeUtils.isIE7) {
                q = null;
                q = document.createElement("span");
                q.className = "calendar_icon hand";
                q.style.marginLeft = "-20px"
            }
        }
        if (!s.isShowIcon) {
            q = null;
            q = document.createElement("span")
        }
        if (s.isOutShow) {
            if (h.tagName.toLowerCase() == "input") {
                if (h.type.toLowerCase() == "text") {
                    var a = SeeUtils.getParentsByClass(h, ".common_txtbox_wrap");
                    if (a.length > 0) {
                        if ((SeeUtils.getElWidth(h) == 0 || SeeUtils.getElWidth(h) == 100) && SeeUtils.getAttrEl(h, "_widthed") != "true") {
                            SeeUtils.setElWidth(h, "90%")
                        }
                    } else {
                        SeeUtils.setElWidth(h, SeeUtils.getElWidth(h) - 18)
                    }
                }
            }
            q = null;
            q = document.createElement("span");
            q.className = "calendar_icon hand"
        }
        q.style.cursor = "pointer";
        SeeUtils.addClass(q, "_autoBtn");
        SeeUtils.insertAfter(q, x);
        v.button = q;
        var e = SeeUtils.getByClass(q, ".calendar_icon");
        if (e != null && e.length > 0) {
            v.button = e[0]
        }
        x._icoed = true;
        x._autoFill = v.autoFill
    }
    if (s.isJustShowIcon) {
        return false
    }
    var u = ["inputField", "displayArea", "button"];
    for (var m in u) {
        if (typeof v[u[m]] == "string") {
            v[u[m]] = document.getElementById(v[u[m]])
        }
    }
    if (!(v.flat || v.multiple || v.inputField || v.displayArea || v.button)) {
        alert("Calendar.setup:\n  Nothing to setup (no fields found).  Please check your code");
        return false
    }
    function w(t) {
        var n = t.params;
        var y = (t.dateClicked || n.electric);
        if (y && n.inputField) {
            n.inputField.value = t.date.print(n.ifFormat);
            if (typeof n.inputField.onchange == "function") {
                n.inputField.onchange()
            }
            try {
                $(n.inputField).change()
            } catch (i) { }
        }
        if (y && n.displayArea) {
            n.displayArea.innerHTML = t.date.print(n.daFormat)
        }
        if (y && typeof n.onUpdate == "function") {
            n.onUpdate(t)
        }
        if (y && n.flat) {
            if (typeof n.flatCallback == "function") {
                n.flatCallback(t)
            }
        }
        if (y && n.singleClick && t.dateClicked) {
            t.callCloseHandler()
        }
    }
    if (v.flat != null) {
        if (typeof v.flat == "string") {
            v.flat = document.getElementById(v.flat)
        }
        if (!v.flat) {
            alert("Calendar.setup:\n  Flat specified but can't find parent.");
            return false
        }
        var g = new Calendar(v.firstDay, v.date, v.onSelect || w);
        g.showsOtherMonths = v.showOthers;
        g.showsTime = v.showsTime;
        g.time24 = (v.timeFormat == "24");
        g.params = v;
        g.weekNumbers = v.weekNumbers;
        g.setRange(v.range[0], v.range[1]);
        g.setDateStatusHandler(v.dateStatusFunc);
        g.getDateText = v.dateText;
        g.setClear(v.isClear);
        g.setClearBlank(v.clearBlank);
        g.setHeight(v.height);
        if (v.ifFormat) {
            g.setDateFormat(v.ifFormat)
        }
        if (v.inputField && typeof v.inputField.value == "string") {
            g.parseDate(v.inputField.value)
        }
        g.create(v.flat);
        g.show()
    }
    var f = v.button || v.displayArea || v.inputField;
    f["on" + v.eventName] = function () {
        var n = v.inputField || v.displayArea;
        var t = v.inputField ? v.ifFormat : v.daFormat;
        var B = false;
        var z = window.calendar;
        if (n) {
            v.date = Date.parseDate(n.value || n.innerHTML, t)
        }
        if (!(z && v.cache)) {
            window.calendar = z = new Calendar(v.firstDay, v.date, v.onSelect || w, v.onClose || function (i) {
                i.hide()
            }
                , v.isMini, v.onClear);
            z.showsTime = v.showsTime;
            z.time24 = (v.timeFormat == "24");
            z.weekNumbers = v.weekNumbers;
            B = true
        } else {
            if (v.date) {
                z.setDate(v.date)
            }
            z.hide()
        }
        if (v.multiple) {
            z.multiple = {};
            for (var p = v.multiple.length; --p >= 0;) {
                var A = v.multiple[p];
                var y = A.print("%Y%m%d");
                z.multiple[y] = A
            }
        }
        z.showsOtherMonths = v.showOthers;
        z.yearStep = v.step;
        z.setRange(v.range[0], v.range[1]);
        z.params = v;
        z.setDateStatusHandler(v.dateStatusFunc);
        z.getDateText = v.dateText;
        z.setClear(v.isClear);
        z.setClearBlank(v.clearBlank);
        z.setHeight(v.height);
        if (z.getDateFormat() != t) {
            B = true
        }
        z.setDateFormat(t);
        if (z.getDateFormat() == "%Y-%m-%d %H:%M") {
            z.showsTime = true
        } else {
            z.showsTime = false
        }
        if (B) {
            z.create()
        }
        z.refresh();
        if (!v.position) {
            z.showAtElement(v.button || v.displayArea || v.inputField, v.align)
        } else {
            z.showAt(v.position[0], v.position[1])
        }
        return false
    }
};
var calendarCtlNoEl = function (g) {
    function k(d, i) {
        if (typeof g[d] == "undefined") {
            g[d] = i
        }
    }
    k("inputField", null);
    k("displayArea", null);
    k("button", null);
    k("eventName", "click");
    k("ifFormat", "%Y-%m-%d");
    k("daFormat", "%Y-%m-%d");
    k("singleClick", true);
    k("disableFunc", null);
    k("dateStatusFunc", g.disableFunc);
    k("dateTooltipFunc", null);
    k("dateText", null);
    k("firstDay", null);
    k("align", "Br");
    k("range", [1900, 2999]);
    k("weekNumbers", false);
    k("flat", null);
    k("flatCallback", null);
    k("onSelect", null);
    k("onClose", null);
    k("onUpdate", null);
    k("date", null);
    k("showsTime", false);
    k("timeFormat", "24");
    k("electric", true);
    k("step", 1);
    k("position", null);
    k("cache", true);
    k("showOthers", false);
    k("multiple", null);
    k("returnValue", false);
    k("autoShow", false);
    k("dateString", false);
    k("isClear", true);
    k("clearBlank", true);
    k("height", null);
    var h = ["inputField", "displayArea", "button"];
    for (var j in h) {
        if (typeof g[h[j]] == "string") {
            g[h[j]] = document.getElementById(g[h[j]])
        }
    }
    if (!(g.flat || g.multiple || g.inputField || g.displayArea || g.button)) {
        alert("Calendar.setup:\n  Nothing to setup (no fields found).  Please check your code");
        return false
    }
    function m(s) {
        var r = s.params;
        var t = (s.dateClicked || r.electric);
        if (t && r.inputField) {
            r.inputField.value = s.date.print(r.ifFormat);
            if (typeof r.inputField.onchange == "function") {
                r.inputField.onchange()
            }
        }
        if (t && r.displayArea) {
            if (!r.returnValue) {
                r.displayArea.innerHTML = s.date.print(r.daFormat)
            } else {
                r.displayArea.setAttribute("valueStr", s.date.print(r.daFormat))
            }
        }
        if (t && typeof r.onUpdate == "function") {
            if (r.returnValue) {
                var d = s.date;
                var q = d.getTime();
                var i = new Date(q);
                r.onUpdate(i.print(r.ifFormat))
            } else {
                r.onUpdate(s)
            }
        }
        if (t && r.flat) {
            if (typeof r.flatCallback == "function") {
                r.flatCallback(s)
            }
        }
        if (t && r.singleClick && s.dateClicked) {
            s.callCloseHandler()
        }
    }
    if (g.flat != null) {
        if (typeof g.flat == "string") {
            g.flat = document.getElementById(g.flat)
        }
        if (!g.flat) {
            alert("Calendar.setup:\n  Flat specified but can't find parent.");
            return false
        }
        var b = new Calendar(g.firstDay, g.date, g.onSelect || m, g.onClose, g.isMini, g.onClear);
        b.setDateToolTipHandler(g.dateTooltipFunc);
        b.showsOtherMonths = g.showOthers;
        b.showsTime = g.showsTime;
        b.time24 = (g.timeFormat == "24");
        b.params = g;
        b.weekNumbers = g.weekNumbers;
        b.setRange(g.range[0], g.range[1]);
        b.setDateStatusHandler(g.dateStatusFunc);
        b.getDateText = g.dateText;
        b.setClear(g.isClear);
        b.setClearBlank(g.clearBlank);
        b.setHeight(g.height);
        if (g.ifFormat) {
            b.setDateFormat(g.ifFormat)
        }
        if (g.inputField && typeof g.inputField.value == "string") {
            b.parseDate(g.inputField.value)
        }
        b.create(g.flat);
        b.show();
        return b
    }
    if (g.autoShow) {
        var f = g.inputField || g.displayArea;
        var n = g.inputField ? g.ifFormat : g.daFormat;
        var e = false;
        var b = window.calendar;
        if (f) {
            var a = f.value || g.dateString || f.innerHTML;
            g.date = Date.parseDate(a, n)
        }
        if (!(b && g.cache && b.getDateFormat() == n)) {
            window.calendar = b = new Calendar(g.firstDay, g.date, g.onSelect || m, g.onClose || function (d) {
                d.hide()
            }
                , g.isMini, g.onClear);
            b.setDateToolTipHandler(g.dateTooltipFunc);
            b.showsTime = g.showsTime;
            b.time24 = (g.timeFormat == "24");
            b.weekNumbers = g.weekNumbers;
            e = true
        } else {
            if (g.date) {
                b.setDate(g.date)
            }
            b.onUpdate = g.onUpdate || null;
            b.onSelected = g.onSelect || m;
            b.onClose = g.onClose || function (d) {
                d.hide()
            }

            b.onClear = g.onClear || null;
            b.hide()
        }
        if (g.multiple) {
            b.multiple = {};
            for (var j = g.multiple.length; --j >= 0;) {
                var l = g.multiple[j];
                var c = l.print("%Y%m%d");
                b.multiple[c] = l
            }
        }
        b.showsOtherMonths = g.showOthers;
        b.yearStep = g.step;
        b.setRange(g.range[0], g.range[1]);
        b.params = g;
        b.setDateStatusHandler(g.dateStatusFunc);
        b.getDateText = g.dateText;
        b.setDateFormat(n);
        b.setClear(g.isClear);
        b.setClearBlank(g.clearBlank);
        b.setHeight(g.height);
        if (e) {
            b.create()
        }
        b.refresh();
        if (!g.position) {
            b.showAtElement(g.button || g.displayArea || g.inputField, g.align)
        } else {
            b.showAt(g.position[0], g.position[1])
        }
        return b
    } else {
        var o = g.button || g.displayArea || g.inputField;
        o["on" + g.eventName] = function () {
            var q = g.inputField || g.displayArea;
            var s = g.inputField ? g.ifFormat : g.daFormat;
            var w = false;
            var u = window.calendar;
            if (q) {
                var p = q.value || q.innerHTML;
                g.date = Date.parseDate(p, s)
            }
            if (!(u && g.cache && u.getDateFormat() == s)) {
                window.calendar = u = new Calendar(g.firstDay, g.date, g.onSelect || m, g.onClose || function (d) {
                    d.hide()
                }
                );
                u.setDateToolTipHandler(g.dateTooltipFunc);
                u.showsTime = g.showsTime;
                u.time24 = (g.timeFormat == "24");
                u.weekNumbers = g.weekNumbers;
                w = true
            } else {
                if (g.date) {
                    u.setDate(g.date)
                }
                u.hide()
            }
            if (g.multiple) {
                u.multiple = {};
                for (var r = g.multiple.length; --r >= 0;) {
                    var v = g.multiple[r];
                    var t = v.print("%Y%m%d");
                    u.multiple[t] = v
                }
            }
            u.showsOtherMonths = g.showOthers;
            u.yearStep = g.step;
            u.setRange(g.range[0], g.range[1]);
            u.params = g;
            u.setDateStatusHandler(g.dateStatusFunc);
            u.getDateText = g.dateText;
            u.setDateFormat(s);
            u.setClear(g.isClear);
            u.setClearBlank(g.clearBlank);
            u.setHeight(g.height);
            if (w) {
                u.create()
            }
            u.refresh();
            if (!g.position) {
                u.showAtElement(g.button || g.displayArea || g.inputField, g.align)
            } else {
                u.showAt(g.position[0], g.position[1])
            }
            return false
        }
    }
    return b
};
$.fn.calendar = function (a) {
    return calendarCtl(a, $(this))
}

$.calendar = function (a) {
    return calendarCtlNoEl(a, null)
}

var CKEDITOR_BASEPATH = _ctxPath + "/common/ckeditor/";
function FCKeditor_OnComplete(a) {
    $("#" + a.Name).attr("editorReadyState", "complete");
    $("#" + a.Name).trigger("editorReady")
}
function mutAccountDep(c, d) {
    if (!d) {
        return
    }
    if (!d.attr("hiddenValue") || d.attr("hiddenValue") == "") {
        d.val(c);
        return
    }
    var b = d.attr("hiddenValue");
    var a = _ctxPath + "/govdoc/govdoc.do?method=mutAccountDep";
    $.ajax({
        type: "POST",
        async: true,
        url: a,
        dataType: "text",
        data: {
            input: c,
            primaryInput: b
        },
        success: function (e) {
            d.attr("hiddenValue", e);
            if (d.attr("hiddenValue") == "") {
                d.val(c)
            } else {
                d.val(c + "hiddenValue" + d.attr("hiddenValue"))
            }
        }
    })
}
var comFnFun = function (f, g, b, d) {
    var c = $(g)
        , e = c.attrObj("_" + f.name);
    if (e) {
        return e
    }
    var a = new f(c.get(0), b);
    if (d == null || d === "") {
        c.attrObj("_" + f.name, a)
    } else {
        c.attrObj("_" + d, a)
    }
};
function getBrowserInfo() {
    var d = navigator.userAgent.toLowerCase();
    var e = /msie [\d.]+;/gi;
    var b = /firefox\/[\d.]+/gi;
    var a = /chrome\/[\d.]+/gi;
    var c = /safari\/[\d.]+/gi;
    if (d.indexOf("msie") > 0) {
        return d.match(e)
    }
    if (d.indexOf("firefox") > 0) {
        return d.match(b)
    }
    if (d.indexOf("chrome") > 0) {
        return d.match(a)
    }
    if (d.indexOf("safari") > 0 && d.indexOf("chrome") < 0) {
        return d.match(c)
    }
}
function realSupportCk5() {
    var b = getBrowserInfo();
    var a = (b + "").replace(/[^0-9.]/ig, "");
    if (b.indexOf("chrome") && parseFloat(a) > 51) {
        return true
    } else {
        return false
    }
    if (b.indexOf("firefox") && parseFloat(a) > 53) {
        return true
    } else {
        return false
    }
    if (b.indexOf("safari") && parseFloat(a) > 10) {
        return true
    } else {
        return false
    }
    return false
}
var ctpEventIntercept = {};
function ctpEventType(a) {
    if (a == "beforSendColl") {
        return ctpEventIntercept.ctpEventIntercept
    } else {
        if (a == "beforeSaveDraftColl") {
            return ctpEventIntercept.beforeSaveDraftColl
        } else {
            if (a == "dealRepeatChange") {
                return ctpEventIntercept.dealRepeatChange
            } else {
                if (a == "fieldValueChange") {
                    return ctpEventIntercept.fieldValueChange
                } else {
                    if (a == "beforeDealSubmit") {
                        return ctpEventIntercept.beforeDealSubmit
                    } else {
                        if (a == "beforeDealSaveWait") {
                            return ctpEventIntercept.beforeDealSaveWait
                        } else {
                            if (a == "beforeDealCancel") {
                                return ctpEventIntercept.beforeDealCancel
                            } else {
                                if (a == "beforeDealstepback") {
                                    return ctpEventIntercept.beforeDealstepback
                                } else {
                                    if (a == "beforeDealstepstop") {
                                        return ctpEventIntercept.beforeDealstepstop
                                    } else {
                                        if (a == "beforeDealaddnode") {
                                            return ctpEventIntercept.beforeDealaddnode
                                        } else {
                                            if (a == "beforeDealdeletenode") {
                                                return ctpEventIntercept.beforeDealdeletenode
                                            } else {
                                                if (a == "beforeDealspecifiesReturn") {
                                                    return ctpEventIntercept.beforeDealspecifiesReturn
                                                } else {
                                                    if (a == "beforeDoneTakeBack") {
                                                        return ctpEventIntercept.beforeDoneTakeBack
                                                    } else {
                                                        if (a == "beforeWaitSendDelete") {
                                                            return ctpEventIntercept.beforeWaitSendDelete
                                                        } else {
                                                            if (a == "beforeSentCancel") {
                                                                return ctpEventIntercept.beforeSentCancel
                                                            } else {
                                                                if (a == "beforePreSubmit") {
                                                                    return ctpEventIntercept.beforePreSubmit
                                                                } else {
                                                                    if (a == "beforeSubmit") {
                                                                        return ctpEventIntercept.beforeSubmit
                                                                    } else {
                                                                        return ctpEventIntercept[a]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
function setCtpEvent(a, b) {
    if (a == "beforSendColl") {
        ctpEventIntercept.ctpEventIntercept = b
    } else {
        if (a == "beforeSaveDraftColl") {
            ctpEventIntercept.beforeSaveDraftColl = b
        } else {
            if (a == "dealRepeatChange") {
                ctpEventIntercept.dealRepeatChange = b
            } else {
                if (a == "fieldValueChange") {
                    ctpEventIntercept.fieldValueChange = b
                } else {
                    if (a == "beforeDealSubmit") {
                        ctpEventIntercept.beforeDealSubmit = b
                    } else {
                        if (a == "beforeDealSaveWait") {
                            ctpEventIntercept.beforeDealSaveWait = b
                        } else {
                            if (a == "beforeDealCancel") {
                                ctpEventIntercept.beforeDealCancel = b
                            } else {
                                if (a == "beforeDealstepback") {
                                    ctpEventIntercept.beforeDealstepback = b
                                } else {
                                    if (a == "beforeDealstepstop") {
                                        ctpEventIntercept.beforeDealstepstop = b
                                    } else {
                                        if (a == "beforeDealaddnode") {
                                            ctpEventIntercept.beforeDealaddnode = b
                                        } else {
                                            if (a == "beforeDealdeletenode") {
                                                ctpEventIntercept.beforeDealdeletenode = b
                                            } else {
                                                if (a == "beforeDealspecifiesReturn") {
                                                    ctpEventIntercept.beforeDealspecifiesReturn = b
                                                } else {
                                                    if (a == "beforeDoneTakeBack") {
                                                        ctpEventIntercept.beforeDoneTakeBack = b
                                                    } else {
                                                        if (a == "beforeWaitSendDelete") {
                                                            ctpEventIntercept.beforeWaitSendDelete = b
                                                        } else {
                                                            if (a == "beforeSentCancel") {
                                                                ctpEventIntercept.beforeSentCancel = b
                                                            } else {
                                                                if (a == "beforePreSubmit") {
                                                                    ctpEventIntercept.beforePreSubmit = b
                                                                } else {
                                                                    if (a == "beforeSubmit") {
                                                                        ctpEventIntercept.beforeSubmit = b
                                                                    } else {
                                                                        return ctpEventIntercept[a] = b
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
$.ctp = {
    bind: function (a, c) {
        var d = ctpEventType(a);
        var b = d;
        if (!Boolean(b)) {
            b = [];
            b.push(c);
            setCtpEvent(a, b)
        } else {
            b.push(c)
        }
    },
    trigger: function (a, d) {
        var c = ctpEventType(a);
        if (Boolean(c)) {
            if (d && typeof d.success == "function") {
                if (!window.console) { }
                (function (j, l) {
                    var f = j.length;
                    var g = 0
                        , e = l.success
                        , m = l.error;
                    var k = function () {
                        if (m) {
                            m()
                        }
                        j = l = null
                    };
                    l.error = k;
                    function h() {
                        if (g == f - 1) {
                            l.success = e
                        } else {
                            l.success = h
                        }
                        var i = j[g];
                        g++;
                        i(l)
                    }
                    h()
                }
                )(c, d);
                return false
            } else {
                for (var b = 0; b < c.length; b++) {
                    if (!c[b](d)) {
                        return false
                    }
                }
            }
        } else {
            if (d && typeof d.success == "function") {
                d.success()
            }
            return true
        }
        return true
    }
};
(function (e) {
    var r = false;
    e.messageBox = function (A) {
        return new MxtMsgBox(A)
    }

    e.notification = function (A) {
        return new CtpUiComNotification(A)
    }

    e.alert = function (B) {
        var A = null;
        if (typeof (B) == "object") {
            A = B
        }
        A = A == null ? {} : A;
        A.title = A.title ? A.title : e.i18n("common.system.hint.label");
        A.type = A.type ? A.type : 0;
        A.imgType = A.imgType ? A.imgType : 2;
        A.close_fn = A.close_fn ? A.close_fn : null;
        if (typeof (B) != "object") {
            A.msg = B
        }
        return new MxtMsgBox(A)
    }

    e.infor = function (B) {
        var A = null;
        if (typeof (B) == "object") {
            A = B
        }
        var A = A == undefined ? {} : A;
        A.title = e.i18n("common.system.hint.label");
        A.type = 0;
        if (typeof (B) != "object") {
            A.msg = B
        }
        A.imgType = A.imgType ? A.imgType : 0;
        A.close_fn = A.close_fn ? A.close_fn : null;
        return new MxtMsgBox(A)
    }

    e.confirm = function (A) {
        var A = A == undefined ? {} : A;
        A.title = A.title ? A.title : e.i18n("common.system.hint.label");
        A.type = 1;
        A.imgType = A.imgType ? A.imgType : 4;
        A.close_fn = A.close_fn ? A.close_fn : null;
        return new MxtMsgBox(A)
    }

    e.error = function (B) {
        var A = null;
        if (typeof (B) == "object") {
            A = B
        }
        var A = A == undefined ? {} : A;
        A.title = A.title ? A.title : e.i18n("common.system.hint.label");
        A.type = A.type ? A.type : 0;
        A.imgType = A.imgType ? A.imgType : 1;
        A.close_fn = A.close_fn ? A.close_fn : null;
        if (typeof (B) != "object") {
            A.msg = B
        }
        return new MxtMsgBox(A)
    }

    e.gc = function () {
        if (typeof (CollectGarbage) == "function") {
            CollectGarbage()
        }
    }

    e.releaseContext = function () {
        function B(D) {
            if (typeof D !== "undefined") {
                for (var E in D) {
                    try {
                        if (typeof D[E] == "object" && (D[E] != null)) {
                            B(D[E])
                        }
                        D[E] = null
                    } catch (C) { }
                }
            }
        }
        try {
            if (e && e.ctx) {
                B(e.ctx)
            }
            B(v3x);
            B(MainLang);
            B(CTPLang);
            B(sectionHandler);
            e("iframe").each(function () {
                var C = this.contentWindow;
                B(C.sectionHandler);
                B(C.MainLang);
                B(C.CTPLang);
                B(C.v3x);
                if (C.$ && C.$.ctx) {
                    B(C.$.ctx)
                }
                this.src = "about:blank"
            })
        } catch (A) { }
    }

    e.releaseOnunload = function () {
        if (e.browser.msie) {
            e(window).bind("unload", function () {
                e.releaseContext()
            })
        }
        e(window).bind("unload", function () {
            for (var B in jQuery.cache) {
                if (jQuery.cache[B].handle) {
                    try {
                        jQuery.event.remove(jQuery.cache[B].handle.elem)
                    } catch (A) { }
                }
                delete jQuery.cache[B]
            }
        })
    }

    e.globalCache = function (A, C) {
        var D = window.sessionStorage;
        if (typeof D !== "undefined" && D !== null && (typeof JSON !== "undefined")) {
            if (typeof C !== "undefined") {
                D.setItem(A, JSON.stringify(C));
                return
            }
            var B = D.getItem(A);
            if (B != undefined) {
                return JSON.parse(B)
            }
            return undefined
        }
    }

    e.progressBar = function (B) {
        var A = B ? B : {
            styleType: "3"
        };
        if (!SeeUtils.isIE8 && typeof (CtpUiLoading) === "function") {
            return new CtpUiLoading(A)
        } else {
            return new MxtProgressBar(A)
        }
    }

    e.dialog = function (A) {
        var B = A.targetWindow;
        if (!A.targetWindow) {
            B = getCtpTop()
        }
        if (!(A.url) && !(A.type) && A.htmlId) {
            if (!A.targetWindow) {
                B = window;
                A.contentCopyWindow = window
            } else {
                A.contentCopyWindow = window
            }
        }
        if (A.url) {
            A.url = A.url + CsrfGuard.getUrlSurffix(A.url)
        }
        if (A.type == "panel" && A.htmlId) {
            B = window;
            A.contentCopyWindow = window
        }
        if (A.type == "panel" && A.targetId && A.url) {
            B = window;
            A.contentCopyWindow = window
        }
        if (A.type == "panel" && A.targetId && A.html) {
            B = window;
            A.contentCopyWindow = window
        }
        A.targetWindow = B;
        if (typeof (getCtpTop().isVJTop) != "undefined" && getCtpTop().isVJTop != null) {
            return getCtpTop().vjOpenDialog(A)
        } else {
            if (A.targetWindow.layer) {
                return A.targetWindow.layer.open(A)
            } else {
                return window.layer.open(A)
            }
        }
    }

    e.PeopleCard = function (A) {
        insertScriptP();
        return PeopleCard(A)
    }

    e.PeopleCardWithOutButton = function (A) {
        insertScriptP();
        return PeopleCardWithOutButton(A)
    }

    e.PeopleCardMini = function (B) {
        var A = insertScript(B);
        return new PeopleCardMini_flash(A)
    }

    e.fn.PeopleCardMini = function (B) {
        var A = insertScript(B);
        return new PeopleCardMini(A, this)
    }

    e.metadata = function (B) {
        function A(D) {
            this.data = D;
            function C(G, F, E) {
                var J = D[G];
                var I = J.columns;
                if (I != null) {
                    for (var H = 0; H < I.length; H++) {
                        if (I[H][E] == F) {
                            return I[H]
                        }
                    }
                }
                return null
            }
            this.getColumn = function (F, E) {
                return C(F, E, "name")
            }

            this.getColumnByAlias = function (F, E) {
                return C(F, E, "alias")
            }

            this.getColumns = function (E) {
                var F = D[E];
                return F.columns
            }
        }
        return new A(B)
    }

    e.renderMetadata = function () { }

    e.metadataForm = function (A, I, K) {
        var D = serverMetadata;
        var F = [];
        function L(O) {
            var N = O.component;
            if (N == "codecfg") {
                return J(O)
            }
            var P = "";
            var M = "";
            var Q = O.rule;
            if (N != null) {
                Q = Q == null ? "" : "," + Q;
                P = ' class="comp" comp="type:\'' + N + "'" + Q + '"'
            } else {
                if (Q != null) {
                    M = ' class="validate" validate="' + Q + '"'
                }
            }
            return '<input type="text" ' + G(O.name) + P + M + "/>"
        }
        function G(N) {
            var O = 'name="' + N + '"';
            var M = ' id="' + N + '"';
            return M + O
        }
        function J(M) {
            var N = "";
            var O = M.rule;
            O = O == null ? "" : O;
            N = ' class="codecfg" codecfg="' + O + '"';
            return "<select " + G(M.name) + N + '><option value="">' + e.i18n("pleaseSelect") + "...</option></select>"
        }
        var C = K ? K.columns : null;
        var E = K ? K.position : "in";
        var H = e.metadata(D);
        var B = [];
        if (C) {
            e.each(C, function (N, M) {
                var O = H.getColumnByAlias(I, M);
                if (O) {
                    B.push(O)
                } else {
                    O = H.getColumn(I, M);
                    if (O) {
                        B.push(O)
                    }
                }
            })
        } else {
            B = H.getColumns(I)
        }
        e.each(B, function (O, P) {
            var N = P.label;
            var M = L(P);
            F.push('<tr><th nowrap="nowrap"><label class="margin_r_10" for="' + P.name + '">' + N + ':</label></th><td><div class="common_txtbox_wrap">' + M + "</div></td></tr>")
        });
        if (E == "after") {
            e(A).after(F.join(""))
        } else {
            if (E == "before") {
                e(A).before(F.join(""))
            } else {
                e(A).html(F.join(""))
            }
        }
    }

    function i(B) {
        var A = typeof getCtpTop === "function" ? getCtpTop() : (typeof getA8Top === "function" ? getA8Top() : parent);
        if (!A) {
            return
        }
        A.breadcrumbHander && (typeof A.breadcrumbHander.showBreadcrumb === "function") && A.breadcrumbHander.showBreadcrumb(B)
    }
    e.fn.tooltip = function (A) {
        return g(A, 1, e(this))
    }

    e.tooltip = function (A) {
        return g(A, 0)
    }

    function g(A, E, C) {
        var A = A;
        var D;
        if (E == 1) {
            var B = C.attr("id").replace("#", "");
            e.extend(A, {
                event: true,
                targetId: B
            });
            D = new MxtToolTip(A);
            C.mouseenter(function () {
                D.setPoint(null, null);
                D.show()
            }).mouseleave(function () {
                D.hide()
            })
        } else {
            D = new MxtToolTip(A)
        }
        return D
    }
    var b = 1;
    e.fn.layout = function () {
        var M = e(this)
            , I = M.attrObj("_layout");
        if (I) {
            return I
        }
        var E = b, A = M[0].id, D = e("#" + A + " > .layout_north"), J = e("#" + A + " > .layout_east"), B = e("#" + A + " > .layout_west"), C = e("#" + A + " > .layout_south"), H = e("#" + A + " > .layout_center"), G = {
            id: A
        }, K, F, L;
        D.each(function () {
            this.id = this.id ? this.id : ("north" + E);
            K = {
                id: this.id
            };
            L = e(this).attr("layout");
            F = L ? e.parseJSON("{" + L + "}") : {};
            K = e.extend(K, F);
            G.northArea = K
        });
        J.each(function () {
            this.id = this.id ? this.id : ("east" + E);
            K = {
                id: this.id
            };
            L = e(this).attr("layout");
            F = L ? e.parseJSON("{" + L + "}") : {};
            K = e.extend(K, F);
            G.eastArea = K
        });
        B.each(function () {
            this.id = this.id ? this.id : ("west" + E);
            K = {
                id: this.id
            };
            L = e(this).attr("layout");
            F = L ? e.parseJSON("{" + L + "}") : {};
            K = e.extend(K, F);
            G.westArea = K
        });
        C.each(function () {
            this.id = this.id ? this.id : ("south" + E);
            K = {
                id: this.id
            };
            L = e(this).attr("layout");
            F = L ? e.parseJSON("{" + L + "}") : {};
            K = e.extend(K, F);
            G.southArea = K
        });
        H.each(function () {
            this.id = this.id ? this.id : ("center" + E);
            K = {
                id: this.id
            };
            L = e(this).attr("layout");
            F = L ? e.parseJSON("{" + L + "}") : {};
            K = e.extend(K, F);
            G.centerArea = K
        });
        M.attrObj("_layout", new MxtLayout(G));
        b++
    }

    e.fn.compThis = function (I) {
        var H = this;
        if (H.attrObj("_comp")) {
            H = H.attrObj("_comp")
        }
        var C = H.attr("comp"), A, G;
        if (C) {
            A = e.parseJSON("{" + C + "}");
            if (I) {
                A = e.extend(A, I);
                var B = e.toJSON(A);
                H.attr("comp", B.substring(1, B.length - 1))
            }
            G = A.type;
            H.attr("compType", G);
            switch (G) {
                case "onlyNumber":
                    H.onlyNumber(A);
                    break;
                case "calendar":
                    H.calendar(A);
                    break;
                case "layout":
                    H.layout();
                    break;
                case "tab":
                    H.tab(A);
                    break;
                case "fileupload":
                    try {
                        u(H, A)
                    } catch (E) { }
                    break;
                case "attachlist":
                    t(H);
                    break;
                case "showattachlist":
                    d(H, A);
                    break;
                case "assdoc":
                    w(H, A);
                    break;
                case "selectPeople":
                    A.srcElement = H;
                    H.selectPeople(A);
                    break;
                case "barCode":
                    H.barCode(A);
                    break;
                case "editor":
                    H.showEditor(A);
                    break;
                case "tooltip":
                    H.tooltip(A);
                    break;
                case "slider":
                    var F = e("<div id='" + H.attr("id") + "'></div>");
                    H.replaceWith(F);
                    H = F;
                    H.slider(A);
                    break;
                case "workflowEdit":
                    var D = e.ctx.CurrentUser;
                    if (A.isTemplate) {
                        if (A.isView) {
                            H.click(function () {
                                showDiagram({
                                    targetWin: getCtpTop(),
                                    valueWin: window,
                                    isTemplate: true,
                                    isDebugger: false,
                                    scene: 2,
                                    SPK: A.SPK ? A.SPK : "default",
                                    isModalDialog: true,
                                    processId: A.workflowId,
                                    currentAccountName: D.loginAccountName,
                                    appName: A.moduleType,
                                    currentUserName: D.name,
                                    canExePrediction: A.canExePrediction
                                })
                            })
                        } else {
                            H.click(function () {
                                alert(e.i18n("jquery.comp.compThis.workflowEdit"))
                            })
                        }
                    } else {
                        if (A.isView) {
                            H.click(function () {
                                var J = {
                                    targetWin: getCtpTop(),
                                    caseId: A.caseId,
                                    processId: A.workflowId,
                                    isTemplate: false,
                                    showHastenButton: false,
                                    appName: "collaboration",
                                    scene: 3,
                                    SPK: A.SPK ? A.SPK : "default",
                                    canExePrediction: A.canExePrediction
                                };
                                showDiagram(J)
                            })
                        } else {
                            H.click(function () {
                                var J = {
                                    targetWin: getCtpTop(),
                                    valueWin: window,
                                    appName: A.moduleType,
                                    isTemplate: false,
                                    currentUserId: D.id,
                                    currentUserName: D.name,
                                    currentAccountName: D.loginAccountName,
                                    flowPermAccountId: D.loginAccount,
                                    processId: A.workflowId,
                                    defaultPolicyId: A.defaultPolicyId,
                                    defaultPolicyName: A.defaultPolicyName,
                                    scene: 1,
                                    SPK: A.SPK ? A.SPK : "default",
                                    canExePrediction: A.canExePrediction
                                };
                                showDiagram(J)
                            })
                        }
                    }
                    break;
                case "correlation_form":
                    x(H, G, A);
                    break;
                case "affix":
                    x(H, G, A);
                    break;
                case "associated_document":
                    x(H, G, A);
                    break;
                case "insert_pic":
                    x(H, G, A);
                    break;
                case "correlation_project":
                    x(H, G, A);
                    break;
                case "data_task":
                    x(H, G, A);
                    break;
                case "search":
                    x(H, G, A);
                    break;
                case "breadcrumb":
                    if (!A.code) {
                        A.code = _resourceCode
                    }
                    i(A);
                    break;
                case "autocomplete":
                    if (H.autocomplete) {
                        H.autocomplete(A)
                    }
                    break;
                case "select":
                    if (A.mode == "dropdown") {
                        if (H.imageDropdown) {
                            return H.imageDropdown(A)
                        }
                    }
                    break;
                case "office":
                    H.showOffice(A);
                    break;
                case "PeopleCardMini":
                    H.PeopleCardMini(A);
                    break;
                case "htmlSignature":
                    H.htmlSignature(H, A);
                    break;
                case "chooseProject":
                    H.chooseProject(A);
                    break;
                case "map":
                    if (H.initMap) {
                        H.initMap(A)
                    }
                    break;
                case "fastSelect":
                    A.srcElement = H;
                    H.fastSelect(A);
                    break;
                case "aceEditor":
                    H.initAceEditor(A);
                    break;
                case "dataI18n":
                    H.dataI18n(A);
                    break;
                case "CtpUiPreBtnInput":
                    H.CtpUiPreBtnInput(A);
                    break;
                case "CtpUiSuffixBtnInput":
                    H.CtpUiSuffixBtnInput(A);
                    break;
                case "CtpUiNumberInput":
                    H.CtpUiNumberInput(A);
                    break;
                case "CtpUiComInput":
                    H.CtpUiComInput(A);
                    break;
                case "CtpUiComTextArea":
                    H.CtpUiComTextArea(A);
                    break;
                case "CtpUiComSelect":
                    H.CtpUiComSelect(A);
                    break;
                case "tag":
                    H.comTag(A);
                    break;
                case "badge":
                    H.comBadge(A);
                    break;
                case "CtpUiMultiSelect":
                    H.CtpUiMultiSelect(A);
                    break;
                case "CtpUiRadio":
                    H.CtpUiRadio(A);
                    break;
                case "CtpUiCheckbox":
                    H.CtpUiCheckbox(A);
                    break;
                case "CtpUiCascadeSelect":
                    H.CtpUiCascadeSelect(A);
                    break;
                case "CtpUiSwitch":
                    H.CtpUiSwitch(A);
                    break;
                case "CtpUiSliderBlock":
                    H.CtpUiSliderBlock(A);
                    break;
                case "CtpUiRateMark":
                    H.CtpUiRateMark(A);
                    break;
                case "CtpUiProgress":
                    H.CtpUiProgress(A);
                    break;
                case "CtpUiAlert":
                    H.CtpUiAlert(A);
                    break;
                case "CtpUiDropdown":
                    H.CtpUiDropdown(A);
                    break;
                case "CtpUiPopover":
                    H.CtpUiPopover(A);
                    break;
                case "CtpUiUploadFullScreenDrag":
                    H.CtpUiUploadFullScreenDrag(A);
                    break;
                case "CtpUiCardContainer":
                    H.CtpUiCardContainer(A);
                    break;
                case "CtpUiTabs":
                    H.CtpUiTabs(A);
                    break;
                case "CtpUiTooltip":
                    H.CtpUiTooltip(A);
                    break;
                case "CtpUiCalendarObj":
                    H.CtpUiCalendarObj(A);
                    break;
                case "CtpUiTimeSelect":
                    H.CtpUiTimeSelect(A);
                    break;
                case "CtpUiStep":
                    H.CtpUiStep(A);
                    break;
                case "CtpUiMessage":
                    H.CtpUiMessage(A);
                    break;
                case "CtpUiCollapse":
                    H.CtpUiCollapse(A);
                    break;
                case "CtpUiMonthRange":
                    H.CtpUiMonthRange(A);
                    break;
                case "CtpUiDateRange":
                    H.CtpUiDateRange(A);
                    break
            }
        }
    }

    e.fn.comp = function (A) {
        e(".comp", this).add(this).each(function (B) {
            e(this).compThis(A)
        })
    }

    e.fn.CtpUiCollapse = function (A) {
        comFnFun(CtpUiCollapse, this, A, "CtpUiCollapse")
    }

    e.fn.CtpUiMessage = function (A) {
        comFnFun(CtpUiMessage, this, A, "CtpUiMessage")
    }

    e.fn.CtpUiStep = function (A) {
        comFnFun(CtpUiStep, this, A, "CtpUiStep")
    }

    e.fn.CtpUiTabs = function (A) {
        comFnFun(CtpUiTabs, this, A, "CtpUiTabs")
    }

    e.fn.CtpUiCardContainer = function (A) {
        comFnFun(CtpUiCardContainer, this, A, "CtpUiCardContainer")
    }

    e.fn.CtpUiUploadFullScreenDrag = function (A) {
        comFnFun(CtpUiUploadFullScreenDrag, this, A, "CtpUiUploadFullScreenDrag")
    }

    e.fn.CtpUiAlert = function (A) {
        comFnFun(CtpUiAlert, this, A, "CtpUiAlert")
    }

    e.fn.CtpUiProgress = function (A) {
        comFnFun(CtpUiProgress, this, A, "CtpUiProgress")
    }

    e.fn.CtpUiSliderBlock = function (A) {
        comFnFun(CtpUiSliderBlock, this, A, "CtpUiSliderBlock")
    }

    e.fn.CtpUiRateMark = function (A) {
        comFnFun(CtpUiRateMark, this, A, "CtpUiRateMark")
    }

    e.fn.CtpUiCheckbox = function (A) {
        comFnFun(CtpUicomCheckbox, this, A, "CtpUicomCheckbox")
    }

    e.fn.CtpUiRadio = function (A) {
        comFnFun(CtpUicomRadio, this, A, "CtpUicomRadio")
    }

    e.fn.CtpUiSwitch = function (A) {
        comFnFun(CtpUiSwitch, this, A, "CtpUiSwitch")
    }

    e.fn.comTag = function (A) {
        comFnFun(CtpUiComTag, this, A, "CtpUiComTag")
    }

    e.fn.comBadge = function (A) {
        comFnFun(CtpUiComBadge, this, A, "CtpUiComBadge")
    }

    e.fn.CtpUiComSelect = function (A) {
        comFnFun(CtpUiComSelect, this, A, "CtpUiComSelect")
    }

    e.fn.CtpUiComTextArea = function (A) {
        comFnFun(CtpUiComTextArea, this, A, "CtpUiComTextArea")
    }

    e.fn.CtpUiComInput = function (A) {
        comFnFun(CtpUiComInput, this, A, "CtpUiComInput")
    }

    e.fn.CtpUiPreBtnInput = function (A) {
        comFnFun(CtpUiPreBtnInput, this, A, "CtpUiPreBtnInput")
    }

    e.fn.CtpUiSuffixBtnInput = function (A) {
        comFnFun(CtpUiSuffixBtnInput, this, A, "CtpUiSuffixBtnInput")
    }

    e.fn.CtpUiNumberInput = function (A) {
        comFnFun(CtpUiNumberInput, this, A, "CtpUiNumberInput")
    }

    e.fn.CtpUiMultiSelect = function (A) {
        comFnFun(CtpUiMultiSelect, this, A, "CtpUiMultiSelect")
    }

    e.fn.CtpUiDropdown = function (A) {
        comFnFun(CtpUiDropdown, this, A, "CtpUiDropdown")
    }

    e.fn.CtpUiPopover = function (A) {
        comFnFun(CtpUiPopover, this, A, "CtpUiPopover")
    }

    e.fn.CtpUiTooltip = function (A) {
        comFnFun(CtpUiTooltip, this, A, "CtpUiTooltip")
    }

    e.fn.CtpUiTimeSelect = function (A) {
        comFnFun(CtpUiTimeSelect, this, A)
    }

    e.fn.CtpUiMonthRange = function (A) {
        comFnFun(CtpUiMonthRange, this, A, "CtpUiMonthRange")
    }

    e.fn.CtpUiDateRange = function (A) {
        var B = e(this)
            , C = B.attrObj("_CtpUiDateRange");
        if (C) {
            return C
        }
        var D = new CtpUiDateRange(B.get(0), A, "CtpUiDateRange");
        B.attrObj("_CtpUiDateRange", D)
    }

    e.fn.CtpUiCalendarObj = function (A) {
        var B = e(this)
            , C = B.attrObj("_CtpUiCalendarObj");
        if (C) {
            return C
        }
        if (A && A.pattern === "dateRange") {
            var D = new CtpUiDateRange(B.get(0), A);
            B.attrObj("_CtpUiCalendarObj", D)
        } else {
            var D = new CtpUiCalendarObj(B.get(0), null, A);
            B.attrObj("_CtpUiCalendarObj", D)
        }
    }

    e.fn.CtpUiCascadeSelect = function (A) {
        if (A.multiple) {
            var C = e(this)
                , D = C.attrObj("_CtpUiCascadeSelect");
            if (D) {
                return D
            }
            var B = new CtpUiMultiSelectCascade(C.get(0), A);
            C.attrObj("_CtpUiCascadeSelect", B)
        } else {
            var C = e(this)
                , D = C.attrObj("_CtpUiCascadeSelect");
            if (D) {
                return D
            }
            var E = new CtpUiCascadeSelect(C.get(0), A);
            C.attrObj("_CtpUiCascadeSelect", E)
        }
    }

    e.fn.chooseProject = function (F) {
        var B = e(this);
        var C = B.width();
        var E = B.attr("id");
        B.attr("id", E + "_txt");
        B.attr("name", E + "_txt");
        var D = e("<input id='" + E + "' name='" + E + "' type='hidden'/>");
        if (typeof (F.text) != "undefined") {
            B.val(F.text);
            B.attr("title", F.text)
        }
        if (typeof (F.value) != "undefined") {
            D.val(F.value)
        }
        B.before(D);
        var A = e("<span class='ico16 correlation_project_16'></span>");
        B.after(A);
        if (F.okCallback != undefined) {
            B.blur(function () {
                F.okCallback(A)
            })
        }
        if (D.height() != 0) {
            B.height(D.height())
        }
        C = C - A.outerWidth(true) - 8;
        if (C > 0) {
            B.width(C)
        } else {
            setTimeout(function () {
                C = B.width() - A.outerWidth(true) - 8;
                B.width(C)
            }, 300)
        }
        A.unbind("click").bind("click", function () {
            var I = B.prev().val();
            var J = F.resetCallback;
            var H = F.okCallback;
            var G = e.dialog({
                id: "projectSelectDialog",
                url: _ctxPath + "/project/project.do?method=projectSelect" + CsrfGuard.getUrlSurffix(),
                title: e.i18n("common.relation.project.label"),
                width: 700,
                height: 450,
                targetWindow: getCtpTop(),
                transParams: {
                    projectRole: "0,1,2,3,4,5",
                    projectState: "0,1,2",
                    projectId: I
                },
                buttons: [{
                    text: e.i18n("common.button.reset.label"),
                    handler: function () {
                        B.val("");
                        B.prev().val("");
                        if (J != undefined) {
                            J(A)
                        }
                        G.close()
                    }
                }, {
                    text: e.i18n("common.button.ok.label"),
                    isEmphasize: true,
                    handler: function () {
                        var K = G.getReturnValue();
                        if (K == false) {
                            e.alert(e.i18n("form.base.relationProject.chooseItem"));
                            return
                        } else {
                            B.val(K.projectName);
                            B.attr("title", K.projectName);
                            B.prev().val(K.projectId);
                            if (H != undefined) {
                                H(A)
                            }
                            G.close()
                        }
                    }
                }, {
                    text: e.i18n("common.button.cancel.label"),
                    handler: function () {
                        G.close()
                    }
                }]
            })
        })
    }

    e.fn.showEditor = function (K) {
        var F = e(this);
        if (K.contentType == "html") {
            var B = _ctxPath;
            var C = e.extend({}, {
                toolbarSet: "Basic",
                category: "1",
                maxSize: 1048576,
                autoResize: true,
                showToolbar: true,
                backFun: function () { },
                height: "100%"
            }, K);
            F.attr("editorReadyState", "loading");
            e.ajaxSetup({
                cache: true
            });
            if (r) {
                e.getScript(B + "/common/RTE/fckeditor.js" + _staticSuffix, function () {
                    var M = B + "/common/RTE/";
                    var L = new FCKeditor(F[0].id);
                    L.BasePath = M;
                    L.Config.DefaultLanguage = _locale.replace("_", "-").toLowerCase();
                    L.ToolbarSet = C.toolbarSet;
                    L.Config.ImageUploadURL = B + "/fileUpload.do?method=processUpload&type=1&applicationCategory=" + C.category + "&extensions=jpg,gif,jpeg,png&maxSize=" + C.maxSize;
                    L.Config.FlashUploadURL = B + "/fileUpload.do?method=processUpload&type=1&applicationCategory=" + C.category + "&extensions=swf,fla&maxSize=" + C.maxSize;
                    L.Config.ImageUploadMaxFileSize = "1M";
                    L.ReplaceTextarea()
                })
            } else {
                var J = "/common/ckeditor";
                var G = parseInt(e.browser.version, 10);
                var A = navigator.userAgent;
                var H = e.browser.msie;
                var I;
                var E = false;
                if (typeof useHighVersionEditor !== "undefined") {
                    I = useHighVersionEditor;
                    if (!useHighVersionEditor && !(H && (G < 9))) {
                        E = true;
                        I = true
                    }
                    if (H && (G < 9)) {
                        E = true
                    }
                } else {
                    I = !(H && (G < 9))
                }
                if (I) {
                    J = J + "413";
                    CKEDITOR_BASEPATH = CKEDITOR_BASEPATH.indexOf("ckeditor413") > -1 ? CKEDITOR_BASEPATH : CKEDITOR_BASEPATH.replace("ckeditor", "ckeditor413")
                }
                function D() {
                    CKEDITOR.basePath = B + J + "/";
                    CKEDITOR.baseHref = CKEDITOR.basePath;
                    if (CKEDITOR.instances[F[0].id]) {
                        CKEDITOR.instances[F[0].id].destroy()
                    }
                    var L = e(F[0]).height();
                    var M = (typeof (editorStartupFocus) == "undefined") ? false : editorStartupFocus;
                    if (!C.showToolbar) {
                        e(F[0]).parent().hide()
                    }
                    if (C.defaultStyle) {
                        CKEDITOR.addCss(C.defaultStyle)
                    }
                    CKEDITOR.replace(F[0].id, {
                        height: C.height,
                        startupFocus: M,
                        toolbar: C.toolbarSet,
                        on: {
                            instanceReady: function (R) {
                                var P = CKEDITOR.instances[F.attr("id")];
                                F.attr("editorReadyState", "complete");
                                F.trigger("editorReady", R);
                                if (L != 0) {
                                    try {
                                        P.document.getBody().setStyle("height", L - 10 + "px")
                                    } catch (S) { }
                                }
                                if (e.browser.mozilla && P.document.getBody().getHtml() == "<p><br></p>") {
                                    P.document.getBody().setHtml('<p><br type="_moz"></p>')
                                }
                                if (!C.showToolbar) {
                                    e("#" + R.editor.id + "_top").hide();
                                    e(F[0]).parent().show()
                                }
                                if (C.toolbarSet == "VerySimple" && e(F[0]).attr("comp") !== undefined && !(e.parseJSON("{" + e(F[0]).attr("comp") + "}").showToolbar)) {
                                    e("#" + R.editor.id + "_top").hide();
                                    e(F[0]).parent().show()
                                }
                                function N() {
                                    var W = CKEDITOR.instances[F.attr("id")];
                                    var X = W.ui.space("contents");
                                    if (X) {
                                        var T = document.body.clientHeight - e(X.$).offset().top;
                                        T = T < 0 ? 0 : T;
                                        try {
                                            if (_fckEditorDecentHeight) {
                                                T -= 20
                                            }
                                        } catch (Y) { }
                                        X.setStyle("height", T - 42 + "px");
                                        var V = W.window.getFrame();
                                        if (V.$.style.width != "786px") {
                                            V.$.style.width = "786px"
                                        }
                                    }
                                    W.window.getFrame().$.style.display = "block";
                                    W.window.getFrame().$.style.margin = "auto";
                                    W.window.getFrame().$.parentNode.style.marginTop = "0px";
                                    W.window.getFrame().$.parentNode.style.paddingTop = "42px";
                                    var U = W.window.getFrame().$.parentNode.offsetHeight;
                                    W.window.getFrame().$.parentNode.style.backgroundColor = "#F3F3F3"
                                }
                                if (C.autoResize) {
                                    N();
                                    window.onresize = function (T) {
                                        N()
                                    }

                                    e(F[0]).parent().resize(function () {
                                        N()
                                    })
                                } else {
                                    var Q = P.ui.space("contents");
                                    Q.setStyle("height", C.height)
                                }
                                if (C.toolbarSet == "VerySimple") {
                                    P.document.getBody().setStyle("padding", 0);
                                    P.document.getBody().setStyle("margin", "5px 0 0 0");
                                    var O = P.window.getFrame();
                                    O.$.style.width = e(F[0]).width() + "px"
                                }
                                if (C.backFun != null && typeof C.backFun == "function") {
                                    C.backFun()
                                }
                                if (v3x && v3x.isMSIE) {
                                    R.editor.on("dialogShow", function (U) {
                                        var T = U.data._.element.$.getElementsByTagName("a");
                                        for (var W = 0; W < T.length; W++) {
                                            var V = T[W].getAttribute("href");
                                            if (V && V.indexOf("void(0)") > -1) {
                                                T[W].removeAttribute("href")
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    })
                }
                if (!E) {
                    if (typeof (CKEDITOR) === "undefined") {
                        e.getScript(B + J + "/ckeditor.js" + _staticSuffix, function () {
                            D()
                        })
                    } else {
                        D()
                    }
                } else {
                    CKEDITOR = null;
                    e.getScript(B + J + "/ckeditor.js" + _staticSuffix, function () {
                        D()
                    })
                }
            }
            e.ajaxSetup({
                cache: false
            })
        }
    }

    e.fn.getEditorContent = function (F) {
        var C = e(this);
        var G = null;
        if (F != null) {
            G = F.CKEDITOR.instances[F.$(this).attr("id")]
        } else {
            G = CKEDITOR && CKEDITOR.instances[e(this).attr("id")]
        }
        if (G != null) {
            var A = C.attr("comp");
            if (A) {
                var D = e.parseJSON("{" + A + "}");
                if (D.type == "editor" && D.contentType == "html") {
                    if (r) {
                        if (F != null) {
                            return F.FCKeditorAPI.GetInstance(this.attr("id")).GetHTML()
                        } else {
                            return FCKeditorAPI.GetInstance(this.attr("id")).GetHTML()
                        }
                    } else {
                        var E = G.getData();
                        return E.replace(/\u200B/g, "").replace(/\n/g, "").replace(/\t/g, "")
                    }
                }
            }
        } else {
            var B = e(this).val();
            if (B != null) {
                B = B.replace(/\n/g, "<br/>")
            }
            return B
        }
        return null
    }

    e.fn.getEditorText = function (I) {
        var G = e(this)
            , F = "";
        var D = CKEDITOR.instances[e(this).attr("id")];
        if (D != null) {
            var B = G.attr("comp");
            if (B) {
                var A = e.parseJSON("{" + B + "}");
                if (A.type == "editor" && A.contentType == "html") {
                    if (r) {
                        return "not supported yet"
                    } else {
                        var C = CKEDITOR.instances[this.attr("id")].document.$.body;
                        if (e.browser.mozilla && (e.browser.version).substring(0, 2) < 45) {
                            F = C.textContent
                        } else {
                            if (A.toolbarSet == "VerySimple") {
                                var E = document.createElement("div");
                                E.id = "VerySimple_tempHtml";
                                E.innerHTML = C.innerHTML;
                                G.append(E);
                                var H = document.getElementById("VerySimple_tempHtml");
                                if ((e.browser.msie && (parseInt(e.browser.version, 10) == 9)) || (e.browser.msie && (parseInt(e.browser.version, 10) == 10))) {
                                    H.innerHTML = H.innerHTML.replace(/<p>/g, "").replace(/<\/p>/g, "<br>");
                                    F = H.innerText
                                } else {
                                    if (e.browser.msie && (parseInt(e.browser.version, 10) > 10)) {
                                        H.innerHTML = H.innerHTML.replace(/<p>/g, "").replace(/<\/p>/g, "");
                                        F = H.innerText
                                    } else {
                                        if (e.browser.mozilla) {
                                            C.innerHTML = C.innerHTML.replace(/<p>/g, "").replace(/<\/p>/g, "").replace(/<br><\/li>/g, "</li>");
                                            F = C.innerText
                                        } else {
                                            F = C.innerText
                                        }
                                    }
                                }
                                e(H).remove()
                            } else {
                                F = C.innerText
                            }
                        }
                        F = F.replace(/\u00A0/g, " ");
                        F = F.replace(/\ufeff/g, "");
                        F = F.replace(/\u200b/g, "");
                        return F
                    }
                }
            }
        } else {
            var F = e(this).val();
            return F
        }
        return null
    }

    e.fn.toggleEditorToolbar = function (A) {
        var B = CKEDITOR.instances[this.attr("id")];
        if (B) {
            if (A.hide) {
                e("#" + B.id + "_top").hide()
            } else {
                e("#" + B.id + "_top").show()
            }
        }
    }

    function p(A, C) {
        if (this.CKEDITOR) {
            var B = CKEDITOR.instances[A];
            B.setData(C)
        }
        e("#" + A).bind("editorReady", function () {
            var D = CKEDITOR.instances[A];
            D.setData(C)
        })
    }
    e.fn.setEditorContent = function (D) {
        var B = e(this);
        var A = B.attr("comp");
        if (A) {
            var C = e.parseJSON("{" + A + "}");
            if (C.type == "editor" && C.contentType == "html") {
                if (r) {
                    FCKeditorAPI.GetInstance(this.attr("id")).SetHTML(D)
                } else {
                    p(this.attr("id"), D)
                }
                return null
            }
        }
        if (B.val) {
            B.val(D)
        }
        return null
    }

    e.fn.initEditorContent = function (G) {
        var C = e(this);
        var A = C.attr("comp");
        if (A) {
            var D = e.parseJSON("{" + A + "}");
            if (D.type == "editor" && D.contentType == "html") {
                var E = CKEDITOR.instances[this.attr("id")];
                var B = E.createRange();
                B.selectNodeContents(E.editable());
                var F = E.getSelection();
                F.selectRanges([B]);
                E.insertHtml(G, "html", B);
                return null
            }
        }
        return null
    }

    e.fn.insertEditorContent = function (E) {
        var B = e(this);
        var A = B.attr("comp");
        if (A) {
            var C = e.parseJSON("{" + A + "}");
            if (C.type == "editor" && C.contentType == "html") {
                var D = CKEDITOR.instances[this.attr("id")];
                D.insertHtml(E);
                return null
            }
        }
        return null
    }

    e.fn.selectPeople = function (C) {
        var J = e(this)
            , N = J.attr("id")
            , S = J.attr("_inited")
            , V = 28;
        var P = N, H, E, B, K, F, G = C.showBtn != undefined ? C.showBtn : false;
        if (S) {
            H = J.next();
            P = H.attr("id");
            E = H.next(),
                B = E.attrObj("tmpclone"),
                K = E.attr("_hide");
            E.remove();
            H.remove()
        } else {
            J.attr("id", N + "_txt");
            J.attr("name", N + "_txt");
            J.attr("readonly", "readonly");
            if (G && !C.extendWidth && J.width() != 0) {
                J.width(J.width() - V)
            }
            J.attr("_inited", 1)
        }
        H = e('<input type="hidden" />');
        H.attr("id", P);
        H.attr("name", P);
        H.attrObj("_comp", J);
        if (C.value) {
            var U = C.value;
            if (C.isMultipleAccountAndDepartment) {
                if (C.isCanEdit) {
                    H.attr(P + "_txt", "disabled")
                }
                H.attr("hiddenValue", U);
                if (H.attr("hiddenValue") == "") {
                    H.val(e(this).val())
                } else {
                    if (H.attr("hiddenValue") == e(this).val()) {
                        H.val(e(this).val())
                    } else {
                        H.val(e(this).val() + "hiddenValue" + H.attr("hiddenValue"))
                    }
                }
            } else {
                H.val(C.value)
            }
        }
        J.after(H);
        if (C.valueChange) {
            H.change(C.valueChange(H))
        }
        if (G) {
            var X = !(C.maxSize === 1) || (J[0].tagName && J[0].tagName.toLowerCase() == "textarea");
            var T = {
                Account: "account",
                Department: "dept",
                Team: "team",
                Post: "post",
                Level: "level",
                Member: "people"
            };
            var M = T[C.selectType.split(",")[0]];
            M = M ? M : "people";
            F = e("<span></span>");
            J.attrObj("_rel", F);
            F.attr("_isrel", 1);
            F.attr("class", "ico16 " + (X ? "check" : "radio") + "_" + M + "_16");
            F.addClass("_autoBtn");
            if (B) {
                F.attrObj("tmpclone", B)
            }
            if (K == 1) {
                F.hide()
            }
            H.after(F)
        } else {
            F = J;
            F.css("cursor", "pointer")
        }
        var W = {};
        if (C.isMultipleAccountAndDepartment) {
            var O = H.val();
            J.attr("readonly", false);
            if (!C.isCanEdit) {
                J.attr("readonly", "readonly")
            }
            J.bind("change").change(function () {
                var Y = e(this).val();
                e(this).attr("title", Y);
                mutAccountDep(Y, H)
            })
        }
        if (C.extendWidth) {
            if (!e.browser.msie || (e.browser.msie && (parseInt(e.browser.version, 10) >= 9))) {
                var Q = H.css("display");
                H.css("display", "block");
                if (H.css("width").indexOf("%") != -1) {
                    J.css("width", H.css("width"))
                } else {
                    if (H.width() > 0) {
                        J.width(H.width())
                    }
                }
                H.css("display", Q)
            } else {
                var R = false;
                if (J.width() <= 0) {
                    J.css("width", "100%");
                    R = true
                }
                if (J.width() <= 0) {
                    J.css("width", "100");
                    R = true
                }
            }
            if (G) {
                var D = 0;
                if (J.css("box-sizing") == "border-box") {
                    D = parseInt(J.css("padding-left")) + parseInt(J.css("padding-right"))
                }
                var I = 0;
                if (e.browser.msie && e.browser.version == "7.0") {
                    I = J.width() * 2 - J.outerWidth(true) - F.outerWidth(true) - 15
                } else {
                    I = J.width() * 2 - J.outerWidth(true) - F.outerWidth(true) - 2
                }
                if (I > 0) {
                    if (J.css("box-sizing") == "border-box") {
                        J.width(I)
                    } else {
                        J.width(I + D)
                    }
                }
            }
        }
        if (C.text) {
            J.val(C.text);
            J.attr("title", C.text)
        }
        function A(aa) {
            J.val(aa.text);
            J.attr("title", aa.text);
            if (aa.obj && (C.returnValueNeedType === false)) {
                J.data("obj", aa.obj)
            }
            H.val(aa.value);
            if (C.isMultipleAccountAndDepartment) {
                H.attr("hiddenValue", aa.value);
                mutAccountDep(aa.text, H)
            }
            if (C.valueChange) {
                H.change(C.valueChange(H))
            }
            var Y = J.attr("comp");
            if (Y) {
                var ab = e.parseJSON("{" + Y + "}");
                ab.value = aa.value;
                ab.text = aa.text;
                var Z = e.toJSON(ab);
                J.attr("comp", Z.substring(1, Z.length - 1))
            }
        }
        if (C.excludeElements) { }
        C.id = J.attr("id");
        if (C.mode != "modal") {
            C.callbk = function (Y) {
                A(Y);
                J.focus()
            }
        }
        if (!C.params) {
            C.params = {}
        }
        var L = C.elements;
        F.unbind("click").click(function () {
            var aa = H.val();
            if (C.isMultipleAccountAndDepartment) {
                aa = H.attr("hiddenValue")
            }
            C.params.value = aa;
            C.params.text = J.val();
            if (!L) {
                var Z = J.data("obj");
                if (Z) {
                    C.elements = Z
                }
            }
            if (C.params.text === "") {
                C.elements = null
            }
            var Y = e.selectPeople(C);
            if (Y) {
                A(Y)
            }
        })
    }

    e.fn.initAceEditor = function (J) {
        var H = e(this).attr("id") + "Ace"
            , G = J.height
            , A = J.width
            , E = J.mode;
        var I = J.fontSize
            , D = J.theme
            , C = J.highlight;
        if (G == undefined || G == null) {
            G = "300"
        }
        if (A == undefined || A == null) {
            A = "400"
        }
        var B = e("<pre id='" + H + "'  style='width: " + A + "px;height: " + G + "px;'></div>");
        e(this).before(B);
        ace.require("ace/ext/language_tools");
        var F = ace.edit(H);
        if (E == undefined || E == null) {
            E = "java"
        }
        F.session.setMode("ace/mode/" + E);
        if (D == undefined || D == null) {
            D = "monokai"
        }
        F.setTheme("ace/theme/" + D);
        if (I == undefined || I == null) {
            I = 14
        }
        F.setFontSize(I);
        F.setHighlightActiveLine(true);
        F.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        })
    }

    e.fn.dataI18n = function (L) {
        var J = e(this);
        var D = J.next(".c_i18n");
        if (D.length > 0) {
            var C = D.prop("domClone");
            J.after(C);
            D.remove();
            J.remove();
            J = C
        }
        var I = J.clone();
        var B = J.attr("id")
            , A = J.attr("name")
            , G = J.attr("value");
        if ((B == undefined || B == null) && (A == undefined || A == null)) {
            A = B = "dataI18n_" + new Date().getTime()
        } else {
            if (B == undefined || B == null) {
                B = A
            } else {
                if (A == undefined || A == null) {
                    A = B
                }
            }
        }
        J.addClass("msHideClear");
        J.attr("id", B + "_text");
        J.attr("name", A + "_text");
        J.attr("value", "");
        J.off("blur").on("blur", function () {
            a._updateI18nData(B, L)
        });
        var H = e('<input type="hidden" />').attr("id", B).attr("name", A).attr("readonly", J.attr("readonly")).attr("disabled", J.attr("disabled"));
        H.attrObj("_comp", J);
        J.before(H);
        var F = L.readonly;
        var K = e('<span class="internationalization-wrapper"><span id="' + B + '_click" title="' + e.i18n("system.menuname.i18nresource") + '" class="syIcon sy-internationalization-resources internationalizationBtn" style="display:none"></span></span>');
        J.wrap("<div class='c_i18n'></div>");
        J.closest(".c_i18n").prop("domClone", I);
        if (typeof (__fireKeydown_return) === "function") {
            __fireKeydown_return(J)
        }
        if (!F) {
            J.after(K)
        }
        e("#" + B + "_click").off("click").on("click", function () {
            var M = J.attr("validate");
            a._openDataI18nDialogSingle(B, L, M)
        });
        var E = (L.i18nSwitch != "off");
        a._fillI18nValue(B, G, L, E);
        return J
    }

    e.fn.setI18nVal = function (A) {
        var B = e(this);
        window._isDevelop && window.console && console.log("[develop out] set i18n data : ", A);
        a._fillI18nValue(B.prop("id"), A, null, true);
        return B
    }

    var a = {
        dataI18nVersion: 0
    };
    a._fillI18nValue = function (A, F, D, C) {
        var E = e("#" + A + "_text");
        var B = a.dataI18nVersion++;
        E.attr("data-version", B);
        if (!F) {
            F = ""
        }
        callBackendMethod("dataI18nManager", "getDataI18nInfo", F, {
            success: function (L) {
                var G = E.attr("data-version");
                if (B != G) {
                    window._isDevelop && window.console && console.log("[develop warn] fillI18nValue ignore,version: " + B + ", currentVersion: " + G + ", backdata: " + JSON.stringify(L));
                    return
                }
                var K = L.dataI18nSwitch && C;
                if (K || L.internationalized) {
                    e("#" + A + "_click").css("display", "inline-block");
                    var M = e("#" + A);
                    var J = e("#" + A + "_click");
                    if (M.prop("disabled") || M.prop("readonly")) {
                        J.css("color", "#999")
                    } else {
                        J.hover(function () {
                            e(this).css("color", "#4A90E2 ")
                        }, function () {
                            e(this).css("color", "")
                        }).css("color", "")
                    }
                }
                var I = L.showText;
                if (!I) {
                    I = ""
                }
                if (L.internationalized) {
                    var H = new Object();
                    H.i18n = true;
                    H.currentLanguage = L.currentLanguage;
                    H.allLanguageValue = e.toJSON(L.allLanguageValue);
                    a._setI18nAttr(A, H);
                    E.prop("readonly", true);
                    E.val(I);
                    e("#" + A).val(F);
                    a._doTriggerDataBackfill({
                        domId: A,
                        isI18n: true,
                        value: F,
                        i18nValue: L.allLanguageValue[L.currentLanguage],
                        allLanguageValue: L.allLanguageValue,
                        currentLanguage: L.currentLanguage
                    })
                } else {
                    a._setI18nAttr(A, {});
                    if (I.length > 0) {
                        E.val(I);
                        e("#" + A).val(I)
                    }
                    a._doTriggerDataBackfill({
                        domId: A,
                        isI18n: false,
                        value: I
                    })
                }
            },
            error: function () {
                window._isDevelop && window.console && console.log("[develop warn] getDataI18nInfo error,eleId: " + A + ", i18nValue: " + F);
                var G = E.attr("data-version");
                if (B !== G) {
                    window._isDevelop && window.console && console.log("[develop warn] fillI18nValue ignore,version: " + B + ", currentVersion: " + G);
                    return
                }
                a._setI18nAttr(A, {});
                E.val(F);
                e("#" + A).val(F);
                a._doTriggerDataBackfill({
                    domId: F,
                    isI18n: false,
                    value: F
                })
            }
        })
    }

    a._doTriggerDataBackfill = function (A) {
        e("#" + A.domId).trigger("dataBackfill", A)
    }

    a._openDataI18nDialogSingle = function (C, K, I) {
        var E = e("#" + C + "_text");
        var B = e("#" + C);
        var H = E.val();
        I = (I != undefined && I != null && I.length > 0) ? I : "";
        var F = {
            showText: H,
            validate: I
        };
        K = e.extend(F, K);
        if (B.prop("disabled") || B.prop("readonly")) {
            return
        }
        var D = "";
        if (K.categoryName != undefined && K.categoryName != null) {
            D = " - " + K.categoryName
        }
        var J = E.prop("data-i18n") ? e("#" + C).val() : "";
        var A = _ctxPath + "/international/dataI18n.do?method=singleSet&dataI18nID=" + J + CsrfGuard.getUrlSurffix();
        var G = e.dialog({
            id: "showDataI18nDialogSingle",
            url: A,
            width: 500,
            height: 220,
            title: e.i18n("common.datai18n.title") + D,
            checkMax: true,
            transParams: K,
            targetWindow: getCtpTop(),
            buttons: [{
                text: e.i18n("common.button.ok.label"),
                isEmphasize: true,
                handler: function () {
                    var M = G.getReturnValue();
                    if (M == undefined || !M.validate) {
                        return
                    }
                    var O = M.currentLocale;
                    var P = M[O] ? M[O] : "";
                    var L = e.toJSON(M);
                    var N = new Object();
                    N.eleId = C;
                    N.submitStr = L;
                    N.dialog = G;
                    N.currentLocaleText = P;
                    N.i18nId = M.id;
                    if (typeof callBackCheckI18nData === "function" && K.checkI18nData && K.checkI18nData == 1) {
                        callBackCheckI18nData(L, a.saveSingleI18n, N)
                    } else {
                        a.saveSingleI18n(N)
                    }
                }
            }, {
                text: e.i18n("common.button.cancel.label"),
                handler: function () {
                    G.close()
                }
            }]
        })
    }

    a.saveSingleI18n = function (E) {
        var A = E.eleId;
        var D = E.submitStr;
        var C = E.dialog;
        var F = E.currentLocaleText;
        var B = E.i18nId;
        callBackendMethod("dataI18nManager", "saveSingleI18n", D, {
            success: function (H) {
                var I = e("#" + A + "_text");
                var G = new Object();
                G.i18n = true;
                G.currentLanguage = H.currentLanguage;
                G.allLanguageValue = e.toJSON(H.allLanguageValue);
                a._setI18nAttr(A, G);
                I.prop("readonly", true);
                I.val(F);
                e("#" + A).val(B);
                I.trigger("blur");
                a._doTriggerDataI18nChange({
                    domId: A,
                    isI18n: true,
                    value: B,
                    i18nValue: H.allLanguageValue[H.currentLanguage],
                    allLanguageValue: H.allLanguageValue,
                    currentLanguage: H.currentLanguage
                });
                C.close()
            }
        })
    }

    a._doTriggerDataI18nChange = function (A) {
        window._isDevelop && window.console && console.log("[develop out] i18n data changed : ", A);
        e("#" + A.domId).val(A.value).trigger("dataChange", A)
    }

    a._updateI18nData = function (A, B) {
        var D = e("#" + A + "_text");
        if (D.prop("data-i18n") == true) {
            return
        }
        var C = e.trim(D.val());
        a._doTriggerDataI18nChange({
            domId: A,
            isI18n: false,
            value: C
        })
    }

    a._setI18nAttr = function (A, C) {
        var B = e("#" + A + "_text");
        if (B.length == 0) {
            return
        }
        if (C.i18n) {
            B.prop("data-i18n", C.i18n)
        } else {
            B.removeProp("data-i18n")
        }
        if (C.currentLanguage) {
            B.prop("data-currentLanguage", C.currentLanguage)
        } else {
            B.removeProp("data-i18n")
        }
        if (C.allLanguageValue) {
            B.prop("data-allLanguageValue", C.allLanguageValue);
            var F = e.parseJSON(C.allLanguageValue);
            var G = "";
            for (var D in F) {
                var E = F[D];
                if (!E) {
                    continue
                }
                G = G + (D + " : " + E + "   ")
            }
            B.attr("title", G)
        } else {
            B.removeProp("data-allLanguageValue");
            B.attr("title", "")
        }
    }

    e.fn.fastSelect = function (C) {
        var T = {
            Account: "account",
            Department: "dept",
            Team: "team",
            Post: "post",
            Level: "level",
            Member: "people"
        };
        var N = T[C.selectType];
        var V = !(C.maxSize === 1);
        N = N ? N : "people";
        var J = e(this)
            , O = C.id
            , S = J.attr("_inited")
            , U = 28;
        var D = e("<span id='" + O + "_btn' title='" + e.i18n("org.index.select.people.label.js") + "' class='selectPeopleIcon ico16 " + (V ? "check" : "radio") + "_" + N + "_16'></span>");
        C.srcElement.after(D);
        var P = O, I, G, E, B, K, F, H = C.showBtn != undefined ? C.showBtn : false;
        if (C.text) {
            J.val(C.text);
            J.attr("title", C.text)
        }
        I = e('<input type="hidden" />');
        I.attr("id", P);
        I.attr("name", P);
        G = e('<input type="hidden" />');
        G.attr("id", P + "_txt");
        G.attr("name", P + "_txt");
        I.attrObj("_comp", J);
        G.attrObj("_comp", J);
        if (C.value) {
            I.val(C.value)
        }
        J.after(I);
        J.after(G);
        if (C.valueChange) {
            I.change(C.valueChange(I))
        }
        if (C.extendWidth) {
            if (!e.browser.msie || (e.browser.msie && (parseInt(e.browser.version, 10) >= 9))) {
                var Q = I.css("display");
                I.css("display", "block");
                if (I.css("width").indexOf("%") != -1) {
                    J.css("width", I.css("width"))
                } else {
                    if (I.width() > 0) {
                        J.width(I.width())
                    }
                }
                I.css("display", Q)
            } else {
                var R = false;
                if (J.width() <= 0) {
                    J.css("width", "100%");
                    R = true
                }
                if (J.width() <= 0) {
                    J.css("width", "100");
                    R = true
                }
            }
        }
        if (C.extendWidth) {
            if (C.outBtn) {
                var L = C.srcElement.width() + 2;
                if (L < 140) {
                    L = 140
                }
                C.srcElement.width(L - 30)
            }
        }
        function A(ag) {
            var Y;
            var ai;
            var aa = [];
            var aj = [];
            var af = J.select2("data");
            var X = ag.value.split(",");
            var Z = v3x.getMessage("common.separator.label") || "、";
            var ad = ag.text.split(Z);
            for (var ae = 0; ae < af.length; ae++) {
                var ah = af[ae];
                if ((ah.text.indexOf(e.i18n("ctp.select2.people.departure")) > -1 || ah.text.indexOf(e.i18n("common.toolbar.disable.label")) > -1) && (undefined == C.maxSize || C.maxSize > 1)) {
                    aa.push(ah.text);
                    aj.push(ah.id)
                }
            }
            if (aj != "" && aj != null) {
                Y = e.merge(aj, X)
            } else {
                Y = X
            }
            if (ag.obj && (C.returnValueNeedType === false)) {
                J.data("obj", ag.obj)
            }
            if (null != Y) {
                for (var ae = 0; ae < Y.length; ae++) {
                    var ah = Y[ae];
                    if (e.inArray(ah, aj) == -1) {
                        aj.push(ah)
                    }
                }
                I.val(aj.join(","))
            } else {
                I.val("")
            }
            if (aa != "" && aa != null) {
                ai = e.merge(aa, ad)
            } else {
                ai = ad
            }
            G.val(ai.join("、"));
            if (C.valueChange) {
                I.change(C.valueChange(I))
            }
            J.empty();
            for (var ae = 0; ae < aj.length; ae++) {
                if ("" != aj[ae]) {
                    J.append("<option value='" + aj[ae] + "'>" + ai[ae] + "</option>")
                }
            }
            J.val(aj).trigger("change");
            var ac = J.attr("comp");
            if (ac) {
                var W = e.parseJSON("{" + ac + "}");
                var ab = e.toJSON(W);
                J.attr("comp", ab.substring(1, ab.length - 1))
            }
        }
        if (C.excludeElements) { }
        if (C.mode != "modal") {
            C.callbk = function (W) {
                A(W);
                J.focus()
            }
        }
        if (!C.params) {
            C.params = {}
        }
        var M = C.elements;
        switch (C.selectType) {
            case "Account":
                h(C, e.i18n("ctp.select2.account.placeholder"));
                break;
            case "Department":
                h(C, e.i18n("ctp.select2.account.placeholder"));
                break;
            case "Team":
                h(C, e.i18n("ctp.select2.team.placeholder"));
                break;
            case "Post":
                h(C, e.i18n("ctp.select2.post.placeholder"));
                break;
            case "Level":
                h(C, e.i18n("ctp.select2.leave.placeholder"));
                break;
            case "Member":
                h(C, e.i18n("ctp.select2.people.placeholder"));
                break
        }
        J.bind("change").change(function () {
            var aa = J.val();
            var Y = [];
            var ab = [];
            var W = J.select2("data");
            if (null != aa) {
                for (var Z = 0; Z < aa.length; Z++) {
                    var X = aa[Z];
                    if (e.inArray(X, Y) == -1) {
                        Y.push(X)
                    }
                }
                I.val(Y.join(","))
            } else {
                I.val("")
            }
            if (W != null) {
                for (var Z = 0; Z < W.length; Z++) {
                    var X = W[Z];
                    if (e.inArray(X, ab) == -1) {
                        ab.push(X.text)
                    }
                }
                G.val(ab.join("、"))
            } else {
                G.val("")
            }
        });
        D.unbind("click").click(function () {
            C.params.value = null;
            if (null != J.val()) {
                C.params.value = J.val().join(",")
            } else {
                C.params.value = I.val()
            }
            if (!M) {
                var X = J.data("obj");
                if (X) {
                    C.elements = X
                }
            }
            if (C.params.text === "") {
                C.elements = null
            }
            var W = e.selectPeople(C);
            if (W) {
                A(W)
            }
        })
    }

    function h(L, J) {
        var D = L.maxSize;
        if (undefined == D || null == D) {
            D = 99999
        }
        var K = [];
        var G = [];
        if (undefined != L.value && L.value != "") {
            G = L.value.split(",")
        }
        var A = [];
        if (undefined != L.text) {
            A = L.text.split(",")
        }
        for (var I = 0; I < G.length; I++) {
            var E = {
                id: "",
                text: ""
            };
            E.id = G[I];
            E.text = A[I];
            L.srcElement.append("<option value='" + G[I] + "'>" + A[I] + "</option>");
            K.push(E)
        }
        var H = _locale;
        if (_locale == "zh_CN") {
            H = "zh-CN"
        }
        if (_locale == "zh_TW") {
            H = "zh-TW"
        }
        var F = (undefined == L.showDisable) ? true : L.showDisable;
        L.srcElement.select2({
            placeholder: J,
            language: H,
            maximumSelectionLength: D,
            initSelection: function (M, N) {
                if (undefined != L.value) {
                    M.val(L.value.split(","));
                    e("#" + L.id + "_txt").val(A.join("、"))
                }
                N(K)
            },
            ajax: {
                url: (typeof (window._ctxPath) !== "undefined" ? window._ctxPath : v3x.baseURL) + "/organization/orgIndexController.do?method=getFastSelect" + L.selectType + "&time=" + new Date().getTime(),
                dataType: "json",
                delay: 250,
                data: function (M) {
                    return {
                        q: encodeURI(M.term),
                        page: M.page,
                        sd: F
                    }
                },
                processResults: function (Q, R) {
                    R.page = R.page || 1;
                    var P = [];
                    if (undefined == R.term) {
                        var O = L.srcElement.select2("data");
                        for (var N = 0; N < O.length; N++) {
                            var M = {
                                id: "",
                                text: ""
                            };
                            var S = O[N];
                            M.id = S.id;
                            M.text = S.text;
                            P.push(M)
                        }
                        Q = P.concat(Q)
                    }
                    return {
                        results: Q.unique()
                    }
                },
                cache: true
            },
            allowClear: false,
            escapeMarkup: function (M) {
                var N = {
                    "\\": "&#92;",
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;",
                    "/": "&#47;"
                };
                if (typeof M !== "string") {
                    return M
                }
                return String(M).replace(/[&<>"'\/\\]/g, function (O) {
                    return N[O]
                })
            },
            minimumInputLength: 0,
            templateResult: B,
            templateSelection: C
        });
        function B(M) {
            return M.text
        }
        function C(M) {
            return M.text
        }
        Array.prototype.unique = function () {
            var O = [];
            var M = [];
            for (var N = 0; N < this.length; N++) {
                if (O.indexOf(this[N].id) == -1) {
                    O.push(this[N].id);
                    M.push(this[N])
                }
            }
            return M
        }
    }
    e.selectPeople = function (J) {
        var D = {
            mode: "div"
        };
        function F(L) {
            var M = [];
            for (var K = 0; K < L.length; K++) {
                if (Object.prototype.toString.call(L[K]) == "[object Array]") {
                    M.push(F(L[K]))
                } else {
                    M.push(L[K])
                }
            }
            return M
        }
        J._window = window;
        J = e.extend(D, J);
        var E = J.onlyShowChildrenAccount;
        var B = "";
        if (J.showAllAccount) {
            B = "&showAllAccount=" + J.showAllAccount
        }
        var C = J.showAccountIds;
        var A = _ctxPath + "/selectpeople.do?onlyShowChildrenAccount=" + E + "&showAccountIds=" + C + B + CsrfGuard.getUrlSurffix(), G;
        if (J.mode == "modal") {
            if (J.preCallback) {
                J.preCallback(J)
            }
            var I = window.showModalDialog(A + "&isFromModel=true", J, "dialogWidth=708px;dialogHeight=568px");
            if (I != null && (typeof I == "object")) {
                I.obj = F(I.obj)
            } else {
                if (I == -1) {
                    return
                }
            }
            if (I) {
                G = I;
                if (J.callback) {
                    J.callback(I, J)
                }
            }
        } else {
            if (J.preCallback) {
                J.preCallback(J)
            }
            var H = e.dialog({
                id: "SelectPeopleDialog",
                url: A,
                width: 820,
                height: 506,
                title: e.i18n("common.pleaseSelect.label"),
                checkMax: true,
                transParams: J,
                closeParam: {
                    show: true,
                    autoClose: true,
                    handler: function () {
                        if (J.canclecallback) {
                            J.canclecallback()
                        }
                    }
                },
                targetWindow: getCtpTop(),
                buttons: [{
                    text: e.i18n("common.button.ok.label"),
                    isEmphasize: true,
                    handler: function () {
                        var N = H.getReturnValue()
                            , K = true;
                        if (N == -1) {
                            return
                        }
                        if (N) {
                            if (J.callbk && J.callbk(N)) {
                                K = false
                            }
                            if (J.callback && J.callback(N, J)) {
                                K = false
                            }
                        }
                        if (K) {
                            var L = "";
                            var O = 0;
                            var P = N.value.split(",");
                            for (var M = 0; M < P.length; M++) {
                                var Q = P[M];
                                if (Q.indexOf("Member") == 0) {
                                    if (L == "") {
                                        L = Q
                                    } else {
                                        L = L + "," + Q
                                    }
                                    O++;
                                    if (O >= 30) {
                                        break
                                    }
                                }
                            }
                            e.ajax({
                                type: "POST",
                                beforeSend: CsrfGuard.beforeAjaxSend,
                                url: encodeURI(_ctxPath + "/organization/orgIndexController.do?method=saveRecentData4OrgIndex&rData=" + L)
                            });
                            H.close(H.index)
                        }
                    }
                }, {
                    text: e.i18n("common.button.cancel.label"),
                    handler: function () {
                        if (J.canclecallback) {
                            J.canclecallback()
                        }
                        H.close()
                    }
                }],
                bottomHTML: '<table id="flowTypeDiv" class="hidden" width="" border="0" height="20" align="center" cellpadding="0" cellspacing="0">\r\n  <tr>\r\n    <td id="concurrentType">&nbsp;&nbsp;&nbsp;&nbsp;\r\n      <label for="concurrent">\r\n        <input id="concurrent" name="flowtype" type="radio" value="1" checked>&nbsp;<span>' + e.i18n("selectPeople.flowtype.concurrent.lable") + '</span>\r\n      </label>&nbsp;&nbsp;&nbsp;\r\n    </td>\r\n    <td id="sequenceType">\r\n      <label for="sequence">\r\n        <input id="sequence" name="flowtype" type="radio" value="0">&nbsp;<span>' + e.i18n("selectPeople.flowtype.sequence.lable") + '</span>\r\n      </label>&nbsp;&nbsp;&nbsp;\r\n    </td>\r\n    <td id="multipleType">\r\n      <label for="multiple">\r\n        <input id="multiple" name="flowtype" type="radio" value="2">&nbsp;<span>' + e.i18n("selectPeople.flowtype.multiple.lable") + '</span>\r\n      </label>&nbsp;&nbsp;&nbsp;\r\n    </td>\r\n    <td id="colAssignType">\r\n      <label for="colAssign">\r\n        <input id="colAssign" name="flowtype" type="radio" value="3">&nbsp;<span>' + e.i18n("selectPeople.flowtype.colAssign.lable") + '</span>\r\n      </label>\r\n    </td>\r\n  </tr>\r\n</table><table id="flowTextDiv" name="flowTextDiv" class="hidden" width="" border="0" height="20" align="center" cellpadding="0" cellspacing="0">\r\n  <tr>\r\n    <td>        <span id="flowText">		   </span>\r\n    </td>\r\n  </tr>\r\n</table>'
            })
        }
        return G
    }

    e.selectStructuredDocFileds = function (B) {
        var D = e.extend({}, {
            appName: "",
            formAppId: "",
            fieldType: "",
            showSystemVariables: "",
            showFormVariables: "true",
            tableType: "",
            externalType: "",
            managerKey: ""
        }, B);
        var A = _ctxPath + "/formula/formula.do?method=showParamBindIndex&appName=" + D.appName + "&formAppId=" + D.formAppId + "&tableType=" + D.tableType + "&fieldType=" + D.fieldType + "&showSystemVariables=" + D.showSystemVariables + "&showFormVariables=" + D.showFormVariables + "&externalType=" + D.externalType + "&managerKey=" + D.managerKey;
        var C = e.dialog({
            id: "SelectStructuredDocFieldsDialog",
            url: A,
            width: 500,
            height: 500,
            title: e.i18n("workflow.customFunction.parmbind.label.js"),
            checkMax: true,
            transParams: B,
            targetWindow: getCtpTop(),
            buttons: [{
                text: e.i18n("common.button.ok.label"),
                isEmphasize: true,
                handler: function () {
                    var E = C.getReturnValue();
                    if (typeof (E) == undefined || E === null) {
                        return
                    }
                    if (B.onOk) {
                        B.onOk(E)
                    }
                    C.close()
                }
            }, {
                text: e.i18n("common.button.cancel.label"),
                handler: function () {
                    C.close();
                    if (B.onCancel) {
                        B.onCancel()
                    }
                }
            }]
        })
    }

    e.callFormula = function (B) {
        var D = e.extend({}, {
            returnType: "String,Bool,Numberic,DateTime,Member,Department,Post,Level,Account,Role",
            formulaType: "Constant,Variable,GroovyFunction,JavaFunction",
            templateCode: "",
            catagory: "",
            appName: "",
            showFormVariables: "true"
        }, B);
        var A = _ctxPath + "/formula/formula.do?method=callFormula";
        if (D.returnType) {
            A += "&returnType=" + D.returnType
        }
        if (D.formulaType) {
            A += "&formulaType=" + D.formulaType
        }
        if (D.templateCode) {
            A += "&templateCode=" + D.templateCode
        }
        if (D.formulaType) {
            A += "&formulaType=" + D.formulaType
        }
        if (D.appName) {
            A += "&appName=" + D.appName
        }
        if (D.appName) {
            A += "&catagory=" + D.catagory
        }
        if (D.showFormVariables) {
            A += "&showFormVariables=" + D.showFormVariables
        }
        var C = e.dialog({
            id: "formulaDialog",
            url: A,
            width: 600,
            height: 400,
            title: e.i18n("jquery.comp.dialog.title"),
            checkMax: true,
            targetWindow: getCtpTop(),
            transParams: B,
            buttons: [{
                text: e.i18n("common.button.ok.label"),
                isEmphasize: true,
                handler: function () {
                    var F = C.getReturnValue();
                    if (F == "" || F == null || F == undefined) {
                        alert(e.i18n("jquery.comp.dialog.msg"));
                        return
                    }
                    C.close();
                    D.methodName = F.formulaName;
                    if (F.params != null && F.params != undefined && F.params != "") {
                        k(D, F)
                    } else {
                        if (F.formulaType != "0" && F.formulaType != "1") {
                            k(D, F)
                        } else {
                            var E = 'getVar("' + F.formulaName + '")';
                            if (B.onOk) {
                                B.onOk(E)
                            }
                        }
                    }
                }
            }, {
                text: e.i18n("common.button.cancel.label"),
                handler: function () {
                    C.close()
                }
            }]
        })
    }

    function k(B, D) {
        var A = _ctxPath + "/formula/formula.do?method=setParams&id=" + D.id + "&category=" + B.category + "&templateCode=" + B.templateCode + "&methodName=" + B.methodName + "&appName=" + B.appName + "&showFormVariables=" + B.showFormVariables + "&formApp=" + B.formApp;
        var C = e.dialog({
            id: "SetParamsFunctionDialog",
            url: A,
            width: 600,
            height: 400,
            title: e.i18n("jquery.comp.setFormulaParams.title"),
            checkMax: true,
            targetWindow: getCtpTop(),
            buttons: [{
                text: e.i18n("common.button.ok.label"),
                isEmphasize: true,
                handler: function () {
                    var E = C.getReturnValue();
                    if (E != null && E != "") {
                        if (B.onOk) {
                            B.onOk(E)
                        }
                        C.close()
                    }
                }
            }, {
                text: e.i18n("common.button.cancel.label"),
                handler: function () {
                    C.close()
                }
            }]
        })
    }
    e.fn.showOffice = function (B) {
        var C = {
            webRoot: _ctxServer
        };
        B = e.extend(C, B);
        var A = e('<div id="officeFrameDiv" style="display:none;height:100%"><iframe src="" name="officeEditorFrame" id="officeEditorFrame" frameborder="0" width="100%" height="100%"></iframe></div>');
        this.replaceWith(A);
        B.handWriteCurrentUserId = e.ctx.CurrentUser.id;
        if (B.fileType == ".pdf") {
            createPdfOcx(B)
        } else {
            OfficeAPI.initOffice(B)
        }
        if (typeof officeSupportCallback != "undefined") {
            officeSupportCallback()
        }
    }

    e.fn.tab = function (B) {
        var A = this.attrObj("tabObj");
        if (A) {
            return A
        }
        B.id = this.attr("id");
        A = new MxtTab(B);
        this.attrObj("tabObj", A);
        if (B.mode && "mouseOver" === B.mode) {
            A.setMouseOver()
        }
    }

    e.fn.tabEnable = function (B) {
        var A = this.attrObj("tabObj");
        if (A) {
            A.enable(B)
        }
    }

    e.fn.tabDisable = function (B) {
        var A = this.attrObj("tabObj");
        if (A) {
            A.disabled(B)
        }
    }

    e.fn.tabCurrent = function (B) {
        var A = this.attrObj("tabObj");
        if (A) {
            A.setCurrent(B)
        }
    }

    e.fn.toolbar = function (B) {
        var D = {
            contextPath: _ctxPath,
            render: this[0].id
        };
        D = e.extendParam(D, B);
        var E = new WebFXMenuBar(D)
            , F = B.toolbar;
        this.attrObj("toolbarObj", E);
        if (F) {
            if (!_isDevelop) {
                var C = [];
                e.each(F, function (L, K) {
                    var H = K.resCode
                        , I = K.pluginId
                        , J = false;
                    e.privCheck(H, I, function () {
                        C.push(K);
                        J = true
                    });
                    if (J && K.subMenu) {
                        var G = [];
                        e.each(K.subMenu, function (M, N) {
                            H = N.resCode,
                                I = N.pluginId;
                            e.privCheck(H, I, function () {
                                G.push(N)
                            })
                        });
                        K.subMenu = G
                    }
                });
                F = C
            }
            e.each(F, function (I, H) {
                var G = e.extendParam({}, H);
                if (H.items) {
                    G.items = H.items
                }
                if (H.subMenu) {
                    G.subMenu = A(H.subMenu)
                }
                G.id = G.id ? G.id : ("mb_" + I);
                E.add(new WebFXMenuButton(G))
            })
        }
        function A(H) {
            var G = new WebFXMenu();
            e.each(H, function (L, K) {
                var J = e.extendParam({}, K), I;
                J.id = J.id ? J.id : ("mi_" + L);
                I = new WebFXMenuItem(J);
                G.add(I)
            });
            return G
        }
        E.show();
        return E
    }

    e.fn.toolbarEnable = function (B) {
        var A = this.attrObj("toolbarObj");
        if (A) {
            A.enabled(B)
        }
    }

    e.fn.toolbarDisable = function (B) {
        var A = this.attrObj("toolbarObj");
        if (A) {
            A.disabled(B)
        }
    }

    e.fn.menu = function (A) {
        var B = e.extendParam({
            render: this[0].id
        }, A);
        var C = new MxtMenuBar(B);
        if (A.menus) {
            e.each(A.menus, function (H, G) {
                var E = e.extendParam({}, G);
                var F = new MxtMenu(E);
                if (G.items) {
                    e.each(G.items, function (I, J) {
                        F.add(D(J))
                    })
                }
                C.add(F)
            })
        }
        function D(E) {
            var F = e.extendParam({}, E);
            var G = new MxtMenuItem(F);
            if (E.items) {
                var H = new MxtSubMenu({});
                G.add(H);
                e.each(E.items, function (J, I) {
                    H.add(D(I))
                })
            }
            return G
        }
        C.show()
    }

    function n() {
        var E = "DBstep.WebSignature.hasSetupHw";
        var B = e.globalCache(E);
        if (B == null) {
            var A = false;
            try {
                if (e.v3x.isMSIE) {
                    var D = navigator.cpuClass.indexOf("x86") != -1 ? false : true;
                    if (D) {
                        new ActiveXObject("DBstep.WebSignature_x64")
                    } else {
                        new ActiveXObject("DBstep.WebSignature")
                    }
                    A = true
                } else {
                    A = true
                }
            } catch (C) {
                A = false
            }
            e.globalCache(E, A);
            return A
        } else {
            return B
        }
    }
    function l() {
        var A = false;
        if (navigator.userAgent.toLowerCase().indexOf("edge") != -1) {
            A = true
        }
        return A
    }
    e.fn.htmlSignature = function (E, D) {
        if (!n()) {
            E.after(e('<center><font color="red" style="font-weight:bold" class="not_print_html">' + e.i18n("common.isignaturehtml.notInstall") + "</font></center>"))
        } else {
            if (l()) {
                E.after(e('<center><font color="red" style="font-weight:bold" class="not_print_html">' + e.i18n("jquery.comp.htmlSignature.text") + "</font></center>"))
            } else {
                var B = e.ctx && e.ctx.CurrentUser && e.ctx.CurrentUser ? e.ctx.CurrentUser : top.$.ctx && top.$.ctx.CurrentUser && top.$.ctx.CurrentUser.id;
                if (E.length > 0 && E[0].tagName.toLowerCase() === "input") {
                    var A = 0;
                    if (E.css("width") === "100%" || E.width() == 0) {
                        A = E.parent("div").width()
                    } else {
                        A = E.width()
                    }
                    var F = E.height();
                    if (A == 0) {
                        A = 100
                    }
                    if (F == 0) {
                        F = 20
                    }
                    if (D.showButton == true) {
                        var C = e("<span></span>");
                        C.attr("id", "signButton");
                        C.attr("class", D.buttonClass ? D.buttonClass : "ico16 signa_16");
                        if (D.enabled === 1) {
                            C.unbind("click").bind("click", function () {
                                handWrite(D.recordId, D.signObj, false, "", B)
                            })
                        }
                        E.after(C);
                        A = A - C.width() - 2
                    }
                    E[0].initWidth = A + "";
                    E[0].initHeight = F + "";
                    E.attr("initWidth", A + "");
                    E.attr("initHeight", F + "")
                }
                D.signObj = E[0];
                D.currentUserId = B;
                initHandWriteData(D)
            }
        }
    }

    e.fn.barCode = function (F) {
        var E = new barCodeManager();
        var Q = F.width || 30
            , O = F.height || 30;
        var L = e(this)
            , P = L.attr("id");
        var S = P + "_img";
        var J = e("<span style='display: block;float: left;'></span>");
        var H = e("<div id='" + S + "' class='left border_all' style='width: " + Q + "px;height: " + O + "px;'></div>");
        var N = O > 40 ? O - 40 : 0;
        var T = e("<div class='left' style='vertical-align:bottom;width: 20px;height: " + O + "px;margin-top: " + N + "px'></div>");
        var G = e("<div class='ico16 affix_del_16 left' style='vertical-align: top'></div>");
        var C = e("<div class='ico16 two_dimensional_code_scanning_16 left' style='vertical-align: top'></div>");
        var M = F.showBtnAdd || false;
        var I = F.showBtnDel || false;
        var K;
        G.unbind("click").bind("click", function () {
            B()
        });
        C.unbind("click").bind("click", function () {
            var X = e.extend({}, F);
            X.preCallback = "";
            X.callback = "";
            var Y = {};
            if (F.preCallback) {
                var V = F.preCallback(L);
                if (V && V.barOption) {
                    X = e.extend(X, V.barOption)
                }
                K = X.width;
                if (V && V.customOption) {
                    Y = V.customOption
                }
            }
            var V = E.getBarCodeAttachment(X, Y);
            if (!V.success) {
                e.alert(V.msg);
                return
            }
            var W = V.attachment;
            if (F.callback) {
                F.callback(W, H)
            }
            D(W)
        });
        J.append(H).append(T);
        T.append(G).append(C);
        L.after(J);
        L.hide();
        if (L.attr("attr")) {
            var R = L.attr("attr");
            R = e.parseJSON(R);
            D(R)
        } else {
            U(false)
        }
        function D(X) {
            A();
            L.val(X.subReference);
            L.attr("reference", X.reference);
            var Z = _ctxPath + "/fileUpload.do?method=showRTE&fileId=" + X.fileUrl + "&type=image";
            var aa = e(H).width();
            var Y = e(H).height();
            H.append("<img onclick='openCtpWindow({url:$(this).attr(\"src\")})' src='" + Z + "'>");
            var W = e("img", H);
            var V;
            var ab = new Image();
            ab.onload = function () {
                V = ab.width;
                if (V > K || !K) {
                    K = V
                }
                if (K != undefined && aa != undefined && Y != undefined) {
                    if (K > aa && K > Y) {
                        var ae = parseFloat(K / aa);
                        var ac = parseFloat(K / Y);
                        if (ae >= ac) {
                            K = aa
                        } else {
                            K = Y
                        }
                    } else {
                        if (K > aa) {
                            K = aa
                        } else {
                            if (K > Y) {
                                K = Y
                            }
                        }
                    }
                    var ad = e("img", H);
                    ad.css({
                        width: K,
                        height: K,
                        cursor: "pointer"
                    })
                }
            }

            ab.src = e(W).attr("src");
            U(true)
        }
        function B() {
            e.confirm({
                msg: e.i18n("common.barcode.delete.label"),
                ok_fn: function () {
                    A();
                    if (F.callback) {
                        F.callback(null, H, true)
                    }
                }
            })
        }
        function A() {
            L.val("");
            H.html("");
            U(false)
        }
        function U(V) {
            C.hide();
            G.hide();
            if (M) {
                C.show()
            }
            if (I && V) {
                G.show()
            }
            if (!M && !I) {
                T.hide()
            }
        }
    }

    function j() {
        return false
    }
    function u(N, A) {
        if (v3x && v3x.isMSIE7) {
            N.css("font-size", "0")
        }
        var L = e(N).attr("id");
        N.attrObj("_attachShow") ? N.attrObj("_attachShow").remove() : null;
        downloadURL = _ctxPath + "/fileUpload.do?type=" + ((A.customType == undefined) ? 0 : A.customType) + ((A.firstSave == undefined) ? "" : ("&firstSave=" + A.firstSave)) + "&inputId=" + L + "&applicationCategory=" + A.applicationCategory + "&extensions=" + ((A.extensions == undefined) ? "" : A.extensions) + ((A.quantity == undefined) ? "" : ("&quantity=" + A.quantity)) + "&maxSize=" + ((A.maxSize == undefined) ? "" : A.maxSize) + "&isEncrypt=" + ((A.isEncrypt == undefined) ? "" : A.isEncrypt) + "&popupTitleKey=" + ((A.attachmentTrId == undefined) ? "" : ("&attachmentTrId=" + A.attachmentTrId)) + ((A.embedInput == undefined) ? "" : ("&embedInput=" + A.embedInput)) + ((A.showReplaceOrAppend == undefined) ? "" : ("&selectRepeatSkipOrCover=" + A.showReplaceOrAppend)) + ((A.callMethod == undefined) ? "" : ("&callMethod=" + A.callMethod)) + ((A.isShowImg == undefined) ? "" : ("&isShowImg=" + A.isShowImg)) + ((A.takeOver == undefined) ? "" : ("&takeOver=" + A.takeOver));
        var F = j();
        downloadURL += ((!F) ? "" : ("&isA8geniusAdded=" + F));
        var E = ((A.displayMode == undefined) ? "auto;" : A.displayMode);
        var C = "";
        if ((A.autoHeight != undefined && A.autoHeight == true) || A.canDeleteOriginalAtts == true || (typeof (A.noMaxheight) != undefined && A.noMaxheight == true)) {
            if (A.applicationCategory != undefined && A.applicationCategory == 2 || A.noMaxheight == true) {
                C = 'style="overflow: ' + E + ' *font-size:0;overflow-x:hidden;"'
            } else {
                C = 'style="overflow: ' + E + ' *font-size:0;max-height:192px; overflow-x:hidden;"'
            }
        } else {
            C = 'style="overflow: ' + E + ' *font-size:0; max-height:64px; overflow-x:hidden;"'
        }
        if (A.isShowImg) {
            C = " "
        }
        var H = "<div id='attachmentArea" + (A.attachmentTrId ? A.attachmentTrId : "") + "' " + C + " requrl='" + downloadURL + "' " + ((A.delCallMethod == undefined) ? "" : ("delCallMethod=" + A.delCallMethod)) + "></div>";
        if (e("#downloadFileFrame").length == 0) {
            H = H + '<div style="display:none;"><iframe name="downloadFileFrame" id="downloadFileFrame" frameborder="0" width="0" height="0"></iframe></div>'
        }
        if (A.embedInput) {
            N.append('<input type="text" style="display:none" id="' + (A.embedInput ? A.embedInput : "") + '" name="' + (A.embedInput ? A.embedInput : "") + '" value="">')
        }
        H = e(H);
        N.after(H);
        N.hide();
        N.attrObj("_attachShow", H);
        z(N, A, true, (A.embedInput ? A.embedInput : ""));
        if (N.attr("attsdata") != "") {
            var J = e.parseJSON(N.attr("attsdata"));
            if (J != null && A.isShowImg && J.length > 0) {
                for (var G = 0; G < J.length; G++) {
                    if (J[G].subReference == A.attachmentTrId) {
                        var M = e("#attachmentDiv_" + J[G].fileUrl);
                        M.find("img").hide();
                        var B = e("#" + A.embedInput);
                        B.parent("div").css("display", "block");
                        B.css("display", "block");
                        var D = B.width();
                        var K = B.height();
                        B.css("display", "none");
                        var I = M.find(".ico16").width() + 2;
                        M.width(D - I).height(K);
                        M.css("overflow", "hidden");
                        M.find("img").show().load(function () {
                            e(this).css({
                                "max-width": M.width() - I,
                                "max-height": K,
                                cursor: "pointer"
                            });
                            B.parent("div").css("display", "none")
                        });
                        break
                    }
                }
            }
        }
    }
    function z(J, A, H, B) {
        var G = A.attsdata ? A.attsdata : J.attr("attsdata") ? e.parseJSON(J.attr("attsdata")) : null;
        if (G && G instanceof Array) {
            var I;
            for (var D = 0; D < G.length; D++) {
                I = G[D];
                if (H) {
                    if (I.type == 2) {
                        continue
                    }
                } else {
                    if (I.type != 2) {
                        continue
                    }
                }
                var E = true;
                var C = false;
                if (A.canFavourite != undefined) {
                    E = A.canFavourite
                }
                if (A.isShowImg != undefined) {
                    C = A.isShowImg
                }
                if (A.attachmentTrId) {
                    var F = A.checkSubReference != undefined ? A.checkSubReference : true;
                    if (F && I.reference != I.subReference && A.attachmentTrId != I.subReference) {
                        continue
                    }
                    addAttachmentPoi(I.type, I.filename, I.mimeType, I.createdate ? I.createdate.toString() : null, I.size, I.fileUrl, A.canDeleteOriginalAtts, A.originalAttsNeedClone, I.description, I.extension, I.icon, A.attachmentTrId, I.reference, I.category, false, null, B, true, I.officeTransformEnable, I.v, E, C, I.id, I.hasFavorite)
                } else {
                    addAttachment(I.type, I.filename, I.mimeType, I.createdate ? I.createdate.toString() : null, I.size, I.fileUrl, A.canDeleteOriginalAtts, A.originalAttsNeedClone, I.description, I.extension, I.icon, I.reference, I.category, false, null, true, I.officeTransformEnable, I.v, E, I.hasFavorite)
                }
            }
        }
    }
    function o(A) {
        if (fileUploadAttachments != null) {
            var E = fileUploadAttachments.values();
            var D = new Array();
            for (var B = 0; B < E.size(); B++) {
                var C = E.get(B);
                if (C.isImg()) {
                    D.push({
                        dataId: C.fileUrl2,
                        src: _ctxPath + "/fileUpload.do?method=showRTE&type=image&fileId=" + C.fileUrl2 + "&createDate=" + C.createDate.substring(0, 10) + "&filename=" + encodeURIComponent(C.filename)
                    })
                }
            }
        }
    }
    function t(C) {
        theToShowAttachments = new ArrayList();
        var D = _ctxPath + "/fileUpload.do";
        var E = C.attr("attsdata");
        if (E != null && E != "") {
            E = e.parseJSON(E)
        }
        var A;
        for (var B = 0; B < E.length; B++) {
            A = E[B];
            theToShowAttachments.add(new Attachment(A.id, A.reference, A.subReference, A.category, A.type, A.filename, A.mimeType, A.createdate.toString(), A.size, A.fileUrl, "", null, A.extension, A.icon, true, "true"))
        }
    }
    function d(B, A) {
        showAttachment(A.subRef, A.atttype, A.attachmentTrId, A.numberDivId)
    }
    function w(B, A) {
        B.css("font-size", "0");
        var C = A.noMaxheight == true ? "" : "max-height:96px;";
        B.after(e('<div id="attachment2Area' + (A.attachmentTrId ? A.attachmentTrId : "") + '" poi="' + (A.attachmentTrId ? A.attachmentTrId : "") + '"  ' + (A.embedInput ? ' embedInput="' + A.embedInput + '"' : "") + (A.callMethod ? ' callMethod="' + A.callMethod + '"' : "") + ' requestUrl="' + _ctxPath + "/ctp/common/associateddoc/assdocFrame.do?isBind=" + (A.modids ? A.modids : "") + "&referenceId=" + (A.referenceId ? A.referenceId : "") + "&applicationCategory=" + (A.applicationCategory ? A.applicationCategory : "") + "&poi=" + (A.attachmentTrId ? A.attachmentTrId : "") + ('" style="overflow: ' + ((A.displayMode == undefined) ? "auto; *font-size:0;" + C : A.displayMode) + '"></div>')));
        if (A.embedInput) {
            B.append('<input type="hidden" id="' + (A.embedInput ? A.embedInput : "") + '" name="' + (A.embedInput ? A.embedInput : "") + '" value="">')
        }
        z(B, A, false, (A.embedInput ? A.embedInput : ""))
    }
    function x(D, A, C) {
        var E = e(D[0]);
        E.width(E.width() - 21);
        var B = '<span class="margin_l_5 ico16 ' + A + '_16"';
        C.fun ? B += " onclick='" + C.fun + "()'" : null;
        C.fun ? B += " title='" + C.title + "'" : null;
        B += "></span> ";
        E.after(B)
    }
    e.fn.ctpClone = function () {
        if (this) {
            return e.ctpClone(e(this))
        }
    }

    e.ctpClone = function (B) {
        if (B && B.size() > 0) {
            var A;
            if (B[0].outerHTML) {
                A = e(B[0].outerHTML.replace(/jQuery\d+="\d+"/g, ""))
            } else {
                A = B.clone()
            }
            return A
        }
    }

    e.batchExport = function (G, H) {
        var A = 10000;
        if (G <= A) {
            H(1, G);
            return
        }
        var C = Math.ceil(G / A);
        var B = "";
        for (var F = 1; F <= C; F++) {
            B += '<option value="' + F + '">' + F + "</option>"
        }
        var E = '<table class="popupTitleRight bg_color_white margin_5" style="font-size: 12px;"><tr><td height="30">' + e.i18n("export.batch.desc.1.js") + '</td></tr><tr><td height="30">' + e.i18n("export.batch.desc.2.js", A, G, C) + '</td></tr><tr><td height="30">' + e.i18n("export.batch.desc.3.js", '<select id="exportPageNo" style="width:60px" >' + B + "</select>") + "</td></tr></table>";
        var D = e.dialog({
            id: "dlgExport",
            html: E,
            title: e.i18n("common.export.label"),
            width: 300,
            height: 120,
            targetWindow: window,
            buttons: [{
                id: "btnExport",
                text: e.i18n("common.export.label"),
                handler: function () {
                    var K = "btnExport";
                    var N = parseInt(e("#exportPageNo").val());
                    D.disabledBtn(K);
                    var J = D.getBtn(K);
                    var M = J.html();
                    var L = 10;
                    J.html("&#160;" + L + "&#160;");
                    H(N, A);
                    if (N < C) {
                        e("#exportPageNo").val(N + 1);
                        var I = setInterval(function () {
                            J.html("&#160;" + (--L) + "&#160;")
                        }, 1000);
                        setTimeout(function () {
                            window.clearInterval(I);
                            D.enabledBtn(K);
                            J.html(M)
                        }, 10000)
                    } else {
                        D.close()
                    }
                }
            }, {
                text: e.i18n("common.button.cancel.label"),
                handler: function () {
                    D.close()
                }
            }]
        })
    }

    function q(F) {
        var A = e(this);
        var E = A.val();
        if (E.length > 0) {
            var B = F.data;
            if (isNaN(E) || !B.type.test(E)) {
                E = E.replace(B.start, "");
                if (E != "-" && E != "+" && isNaN(E)) {
                    E = E.replace(B.nonNumber, "")
                }
            }
            if (B.decimalDigit != null) {
                var D = E.indexOf(".")
                    , C = E.length;
                if (D > -1) {
                    if (B.decimalDigit <= 0) {
                        E = E.substr(0, D)
                    } else {
                        E = E.substr(0, D + B.decimalDigit + 1)
                    }
                }
            }
            if (A.val() != E) {
                A.val(E)
            }
        }
        A = null
    }
    function y(F) {
        var A = e(this);
        var E = A.val();
        if (E.length > 0) {
            var B = F.data;
            if (isNaN(E) || !B.type.test(E)) {
                E = E.replace(B.end, "");
                if (E != "-" && E != "+" && isNaN(E)) {
                    E = E.replace(B.nonNumber, "")
                }
            }
            if (B.decimalDigit != null) {
                var D = E.indexOf(".")
                    , C = E.length;
                if (D > -1) {
                    if (B.decimalDigit <= 0) {
                        E = E.substr(0, D)
                    } else {
                        E = E.substr(0, D + B.decimalDigit + 1)
                    }
                }
            }
            A.val(E)
        }
        A = null
    }
    function f(D) {
        var A = e(this);
        var C = A.val();
        if (C.length > 0) {
            var B = C.lastIndexOf("%");
            var E = C;
            if (B > -1) {
                E = C.sub(0, B)
            }
            if (isNaN(E) || !/^[-+]?\d+(\.\d*)?$/.test(C)) {
                if (!e.isANumber(E)) {
                    E = E.replace(/[^\d]+/g, "")
                }
                A.val(E)
            }
        }
        A = null
    }
    function s(D) {
        var A = e(this);
        var C = A.val();
        if (C.length > 0) {
            var B = C.lastIndexOf("%");
            var E = C;
            if (B > -1) {
                E = C.sub(0, B)
            }
            if (isNaN(E) || !/^\d+(\.\d+)?$/.test(C)) {
                if (!e.isANumber(E)) {
                    E = E.replace(/[^\d]+/g, "")
                }
                A.val(E + "%")
            }
        }
        A = null
    }
    function v(C) {
        var A = e(this);
        var B = A.val();
        if (B.length > 0) {
            var E = B;
            if (B.length <= 3) {
                if (isNaN(E) || !/^[-+]?\d+$/.test(B)) {
                    if (!e.isANumber(E)) {
                        E = E.replace(/[^\d]+/g, "")
                    }
                    A.val(E)
                }
            } else {
                var D = /^\d\d\d(,\d\d\d)*,\d{0,3}$/;
                if (!D.test(B)) {
                    E = E.match(/\d\d\d(,\d\d\d)*(,\d{0,3})?/);
                    if (E == null) {
                        E = ""
                    } else {
                        E = E[0]
                    }
                    A.val(E)
                }
            }
        }
        A = null
    }
    function c(C) {
        var A = e(this);
        var B = A.val();
        if (B.length > 0) {
            var E = B;
            if (B.length <= 3) {
                if (isNaN(E) || !/^[-+]?\d+$/.test(B)) {
                    if (!e.isANumber(E)) {
                        E = E.replace(/[^\d]+/g, "").substr(0, 3)
                    }
                    A.val(E)
                }
            } else {
                var D = /^\d\d\d(,\d\d\d)*$/;
                if (!D.test(B)) {
                    E = E.match(/\d\d\d(,\d\d\d)*/);
                    if (E == null) {
                        E = ""
                    } else {
                        E = E[0]
                    }
                    A.val(E)
                }
            }
        }
        A = null
    }
    e.fn.extend({
        onlyNumber: function (C) {
            if (this[0] && this[0].nodeName && this[0].nodeName.toUpperCase() == "INPUT") {
                if (this.prop("type") == "text") {
                    var B = C.numberType
                        , D = C.decimalDigit;
                    if (isNaN(D)) {
                        D = null
                    }
                    if (B == "delete") {
                        this.unbind("keyup", q).unbind("blur", y)
                    } else {
                        if (B == "percent") {
                            this.unbind("keyup", f).unbind("blur", s);
                            this.bind("keyup", f).bind("blur", s)
                        } else {
                            if (B == "thousandth") {
                                this.unbind("keyup", v).unbind("blur", c);
                                this.bind("keyup", v).bind("blur", c)
                            } else {
                                var A = {};
                                switch (B) {
                                    case "int":
                                        A.start = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                        A.end = /[^0123456789-]+|[-]{2,}|[-]$/g;
                                        A.nonNumber = /[-]+/g;
                                        A.type = /^[-+]?\d+$/;
                                        A.decimalDigit = D;
                                        break;
                                    case "float":
                                        A.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                        A.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                        A.nonNumber = /[.-]+/g;
                                        A.type = /^[-+]?\d+(\.\d+)?$/;
                                        A.decimalDigit = D;
                                        break;
                                    default:
                                        A.start = /^[.]|[^0123456789.-]+|[.-]{2,}/g;
                                        A.end = /^[.]|[^0123456789.-]+|[.-]{2,}|[.-]$/g;
                                        A.nonNumber = /[.-]+/g;
                                        A.type = /^[-+]?\d+$/;
                                        A.decimalDigit = D;
                                        break
                                }
                                this.unbind("keyup", q).unbind("blur", y);
                                this.bind("keyup", A, q).bind("blur", A, y)
                            }
                        }
                    }
                }
            }
        }
    });
    var m = null;
    e.showDataI18nDialog = function (B) {
        var D = e.extend({}, {
            jsonData: "[]",
            fieldName: "",
            showFieldColumn: true,
            titleName: "",
            showTitleColumn: true,
            callbackCheckMethod: null
        }, B);
        var A = _ctxPath + "/international/dataI18n.do?method=batchSet" + CsrfGuard.getUrlSurffix();
        var C = e.dialog({
            id: "showDataI18nDialog",
            url: A,
            width: 1000,
            height: 580,
            title: e.i18n("common.datai18n.title"),
            checkMax: true,
            transParams: B,
            targetWindow: getCtpTop(),
            buttons: [{
                text: e.i18n("common.button.ok.label"),
                isEmphasize: true,
                handler: function () {
                    if (m != null) {
                        var E = (new Date()).getTime();
                        if ((E - m) / 60 / 60 < 0.5) {
                            return
                        }
                    }
                    m = (new Date()).getTime();
                    C.getReturnValue()
                }
            }, {
                text: e.i18n("common.button.cancel.label"),
                handler: function () {
                    C.close()
                }
            }]
        })
    }
}
)(jQuery);
var selectPictureDialog;
function selectPicture(a, c, b, f) {
    var d = $(top).width();
    var e = $(top).height();
    selectPictureDialog = $.dialog({
        targetWindow: top,
        id: "selectPictureDialog",
        url: (typeof (window._ctxPath) !== "undefined" ? window._ctxPath : v3x.baseURL) + "/portal/portalDesigner.do?method=selectPictures&msn=" + a + "&from=" + f,
        width: d,
        height: e - 200,
        title: $.i18n("portal.common.imgdialog.title"),
        overflow: "hidden",
        buttons: [{
            text: $.i18n("common.button.ok.label"),
            isEmphasize: true,
            handler: function () {
                var g = selectPictureDialog.getReturnValue({
                    innerButtonId: "ok"
                });
                if (g) {
                    if (typeof b == "function") {
                        selectPictureDialog.close();
                        b(g)
                    } else {
                        selectPictureDialog.close();
                        $.alert($.i18n("jquery.comp.selectPicture.msg"))
                    }
                }
            }
        }, {
            text: $.i18n("common.button.cancel.label"),
            isEmphasize: false,
            handler: function () {
                selectPictureDialog.close()
            }
        }]
    })
}
var _makeDialogiconLibrary;
function iconLibrary(c, a, e, d) {
    var b = _ctxPath + "/portal/portalDesigner.do?method=iconLibrary&oprate=" + c + "&styleId=" + a + "&showType=" + d;
    _makeDialogiconLibrary = $.dialog({
        url: b,
        id: "moveToDialog",
        htmlId: "dialog",
        targetWindow: getA8Top(),
        width: 1500,
        height: 520,
        title: $.i18n("portal.button.fromiconlib"),
        overflow: "hidden",
        buttons: [{
            id: "ok",
            isEmphasize: true,
            text: $.i18n("common.button.ok.label"),
            handler: function () {
                if (a == 0) {
                    $("#plane").hide();
                    if (!$("#line").hasClass("choose")) {
                        $("#line").addClass("choose")
                    }
                } else {
                    $("#line").hide();
                    if (!$("#plane").hasClass("choose")) {
                        $("#plane").addClass("choose")
                    }
                }
                var f = _makeDialogiconLibrary.getReturnValue();
                if (typeof e == "function") {
                    if (f == "noChoose") {
                        $.alert($.i18n("portal.common.icon.alert1"))
                    } else {
                        _makeDialogiconLibrary.close();
                        e(f)
                    }
                } else {
                    _makeDialogiconLibrary.close();
                    $.alert($.i18n("jquery.comp.selectPicture.msg"))
                }
            }
        }, {
            id: "cancel",
            text: $.i18n("common.button.cancel.label"),
            handler: function () {
                _makeDialogiconLibrary.close()
            }
        }]
    })
}
var imageLibDialog;
function imageLibUploadDialog(d, b, a, c) {
    var e = "common";
    if (typeof (c) != "undefined") {
        e = c
    }
    imageLibDialog = $.dialog({
        targetWindow: getA8Top(),
        id: "imageLibDialog",
        url: _ctxPath + "/ctp/common/imageIconUpload.do?method=imageUpload&fileId=" + (b || "") + "&filePath=" + encodeURIComponent(a || "") + "&from=" + e,
        width: 650,
        height: 320,
        title: $.i18n("link.jsp.add.img.upload"),
        overflow: "hidden",
        buttons: [{
            text: $.i18n("common.button.ok.label"),
            isEmphasize: true,
            handler: function () {
                var f = imageLibDialog.getReturnValue();
                if (f && f.length > 0) {
                    if (typeof d == "function") {
                        imageLibDialog.close();
                        d(f)
                    } else {
                        imageLibDialog.close()
                    }
                }
            }
        }, {
            text: $.i18n("common.button.cancel.label"),
            isEmphasize: false,
            handler: function () {
                imageLibDialog.close()
            }
        }]
    })
}
var iconLibDialog;
function iconLibUploadDialog(b, a) {
    if (!a) {
        a = "plane"
    }
    iconLibDialog = $.dialog({
        targetWindow: getA8Top(),
        id: "iconLibDialog",
        url: _ctxPath + "/ctp/common/imageIconUpload.do?method=iconUpload&iconType=" + a,
        width: 430,
        height: 220,
        title: $.i18n("portal.common.icondialog.title"),
        overflow: "hidden",
        buttons: [{
            text: $.i18n("common.button.ok.label"),
            isEmphasize: true,
            handler: function () {
                var c = iconLibDialog.getReturnValue();
                if (c && c.length == 2) {
                    if (typeof b == "function") {
                        iconLibDialog.close();
                        b(c)
                    } else {
                        iconLibDialog.close()
                    }
                } else {
                    if (!c) {
                        iconLibDialog.close()
                    }
                }
            }
        }, {
            text: $.i18n("common.button.cancel.label"),
            isEmphasize: false,
            handler: function () {
                iconLibDialog.close()
            }
        }]
    })
}
;

// @inject-start Axios.js
// Axios v1.3.6 Copyright (c) 2023 Matt Zabriskie and contributors
const axios = (() => {
    function bind(fn, thisArg) {
        return function wrap() {
            return fn.apply(thisArg, arguments);
        };
    }

    const { toString } = Object.prototype;
    const { getPrototypeOf } = Object;

    const kindOf = (cache => thing => {
        const str = toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));

    const kindOfTest = (type) => {
        type = type.toLowerCase();
        return (thing) => kindOf(thing) === type
    };

    const typeOfTest = type => thing => typeof thing === type;

    /**
     * Determine if a value is an Array
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    const { isArray } = Array;

    /**
     * Determine if a value is undefined
     * @param {*} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    const isUndefined = typeOfTest('undefined');

    /**
     * Determine if a value is a Buffer
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
        return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
            && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     * @param {*} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    const isArrayBuffer = kindOfTest('ArrayBuffer');


    /**
     * Determine if a value is a view on an ArrayBuffer
     * @param {*} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
        let result;
        if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
            result = ArrayBuffer.isView(val);
        } else {
            result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
        }
        return result;
    }

    /**
     * Determine if a value is a String
     * @param {*} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    const isString = typeOfTest('string');

    /**
     * Determine if a value is a Function
     * @param {*} val The value to test @returns {boolean} True if value is a Function, otherwise false
     */
    const isFunction = typeOfTest('function');

    /**
     * Determine if a value is a Number
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    const isNumber = typeOfTest('number');

    /**
     * Determine if a value is an Object
     * @param {*} thing The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    const isObject = (thing) => thing !== null && typeof thing === 'object';

    /**
     * Determine if a value is a Boolean
     * @param {*} thing The value to test @returns {boolean} True if value is a Boolean, otherwise false
     */
    const isBoolean = thing => thing === true || thing === false;

    /**
     * Determine if a value is a plain Object
     * @param {*} val The value to test
     * @returns {boolean} True if value is a plain Object, otherwise false
     */
    const isPlainObject = (val) => {
        if (kindOf(val) !== 'object') {
            return false;
        }

        const prototype = getPrototypeOf(val);
        return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
    };

    /**
     * Determine if a value is a Date
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    const isDate = kindOfTest('Date');

    /**
     * Determine if a value is a File
     * @param {*} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFile = kindOfTest('File');

    /**
     * Determine if a value is a Blob
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    const isBlob = kindOfTest('Blob');

    /**
     * Determine if a value is a FileList
     * @param {*} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    const isFileList = kindOfTest('FileList');

    /**
     * Determine if a value is a Stream
     * @param {*} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    const isStream = (val) => isObject(val) && isFunction(val.pipe);

    /**
     * Determine if a value is a FormData
     * @param {*} thing The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    const isFormData = (thing) => {
        let kind;
        return thing && (
            (typeof FormData === 'function' && thing instanceof FormData) || (
                isFunction(thing.append) && (
                    (kind = kindOf(thing)) === 'formdata' ||
                    // detect form-data instance
                    (kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]')
                )
            )
        )
    };

    /**
     * Determine if a value is a URLSearchParams object
     * @param {*} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    const isURLSearchParams = kindOfTest('URLSearchParams');

    /**
     * Trim excess whitespace off the beginning and end of a string
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    const trim = (str) => str.trim ?
        str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     * @param {Object|Array} obj The object to iterate @param {Function} fn The callback to invoke for each item
     * @param {Boolean} [allOwnKeys = false] @returns {any}
     */
    function forEach(obj, fn, { allOwnKeys = false } = {}) {
        // Don't bother if no value provided
        if (obj === null || typeof obj === 'undefined') {
            return;
        }

        let i;
        let l;

        // Force an array if not already something iterable
        if (typeof obj !== 'object') {
            /*eslint no-param-reassign:0*/
            obj = [obj];
        }

        if (isArray(obj)) {
            // Iterate over array values
            for (i = 0, l = obj.length; i < l; i++) {
                fn.call(null, obj[i], i, obj);
            }
        } else {
            // Iterate over object keys
            const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
            const len = keys.length;
            let key;

            for (i = 0; i < len; i++) {
                key = keys[i];
                fn.call(null, obj[key], key, obj);
            }
        }
    }

    function findKey(obj, key) {
        key = key.toLowerCase();
        const keys = Object.keys(obj);
        let i = keys.length;
        let _key;
        while (i-- > 0) {
            _key = keys[i];
            if (key === _key.toLowerCase()) {
                return _key;
            }
        }
        return null;
    }

    const _global = (() => {
        /*eslint no-undef:0*/
        if (typeof globalThis !== "undefined") return globalThis;
        return typeof self !== "undefined" ? self : (typeof window !== 'undefined' ? window : global)
    })();

    const isContextDefined = (context) => !isUndefined(context) && context !== _global;

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
        const { caseless } = isContextDefined(this) && this || {};
        const result = {};
        const assignValue = (val, key) => {
            const targetKey = caseless && findKey(result, key) || key;
            if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
                result[targetKey] = merge(result[targetKey], val);
            } else if (isPlainObject(val)) {
                result[targetKey] = merge({}, val);
            } else if (isArray(val)) {
                result[targetKey] = val.slice();
            } else {
                result[targetKey] = val;
            }
        };

        for (let i = 0, l = arguments.length; i < l; i++) {
            arguments[i] && forEach(arguments[i], assignValue);
        }
        return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     * @param {Object} a The object to be extended @param {Object} b The object to copy properties from @param {Object} thisArg The object to bind function to
     * @param {Boolean} [allOwnKeys] @returns {Object} The resulting value of object a
     */
    const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
        forEach(b, (val, key) => {
            if (thisArg && isFunction(val)) {
                a[key] = bind(val, thisArg);
            } else {
                a[key] = val;
            }
        }, { allOwnKeys });
        return a;
    };

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     * @param {string} content with BOM
     * @returns {string} content value without BOM
     */
    const stripBOM = (content) => {
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }
        return content;
    };

    /**
     * Inherit the prototype methods from one constructor into another @param {function} constructor @param {function} superConstructor @param {object} [props] @param {object} [descriptors]
     * @returns {void}
     */
    const inherits = (constructor, superConstructor, props, descriptors) => {
        constructor.prototype = Object.create(superConstructor.prototype, descriptors);
        constructor.prototype.constructor = constructor;
        Object.defineProperty(constructor, 'super', {
            value: superConstructor.prototype
        });
        props && Object.assign(constructor.prototype, props);
    };

    /**
     * Resolve object with deep prototype chain to a flat object @param {Object} sourceObj source object @param {Object} [destObj] @param {Function|Boolean} [filter] @param {Function} [propFilter]
     * @returns {Object}
     */
    const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
        let props;
        let i;
        let prop;
        const merged = {};

        destObj = destObj || {};
        // eslint-disable-next-line no-eq-null,eqeqeq
        if (sourceObj == null) return destObj;

        do {
            props = Object.getOwnPropertyNames(sourceObj);
            i = props.length;
            while (i-- > 0) {
                prop = props[i];
                if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
                    destObj[prop] = sourceObj[prop];
                    merged[prop] = true;
                }
            }
            sourceObj = filter !== false && getPrototypeOf(sourceObj);
        } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

        return destObj;
    };

    /**
     * Determines whether a string ends with the characters of a specified string
     * @param {String} str @param {String} searchString @param {Number} [position= 0]
     * @returns {boolean}
     */
    const endsWith = (str, searchString, position) => {
        str = String(str);
        if (position === undefined || position > str.length) {
            position = str.length;
        }
        position -= searchString.length;
        const lastIndex = str.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };


    /**
     * Returns new array from array like object or null if failed
     * @param {*} [thing]
     * @returns {?Array}
     */
    const toArray = (thing) => {
        if (!thing) return null;
        if (isArray(thing)) return thing;
        let i = thing.length;
        if (!isNumber(i)) return null;
        const arr = new Array(i);
        while (i-- > 0) {
            arr[i] = thing[i];
        }
        return arr;
    };

    /**
     * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
     * thing passed in is an instance of Uint8Array
     * @param {TypedArray}
     * @returns {Array}
     */
    // eslint-disable-next-line func-names
    const isTypedArray = (TypedArray => {
        // eslint-disable-next-line func-names
        return thing => {
            return TypedArray && thing instanceof TypedArray;
        };
    })(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

    /**
     * For each entry in the object, call the function with the key and value.
     * @param {Object<any, any>} obj - The object to iterate over. @param {Function} fn - The function to call for each entry.
     * @returns {void}
     */
    const forEachEntry = (obj, fn) => {
        const generator = obj && obj[Symbol.iterator];

        const iterator = generator.call(obj);

        let result;

        while ((result = iterator.next()) && !result.done) {
            const pair = result.value;
            fn.call(obj, pair[0], pair[1]);
        }
    };

    /**
     * It takes a regular expression and a string, and returns an array of all the matches
     * @param {string} regExp - The regular expression to match against. @param {string} str - The string to search.
     * @returns {Array<boolean>}
     */
    const matchAll = (regExp, str) => {
        let matches;
        const arr = [];

        while ((matches = regExp.exec(str)) !== null) {
            arr.push(matches);
        }

        return arr;
    };

    /* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
    const isHTMLForm = kindOfTest('HTMLFormElement');

    const toCamelCase = str => {
        return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g,
            function replacer(m, p1, p2) {
                return p1.toUpperCase() + p2;
            }
        );
    };

    /* Creating a function that will check if an object has a property. */
    const hasOwnProperty = (({ hasOwnProperty }) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

    /**
     * Determine if a value is a RegExp object
     * @param {*} val The value to test
     * @returns {boolean} True if value is a RegExp object, otherwise false
     */
    const isRegExp = kindOfTest('RegExp');

    const reduceDescriptors = (obj, reducer) => {
        const descriptors = Object.getOwnPropertyDescriptors(obj);
        const reducedDescriptors = {};

        forEach(descriptors, (descriptor, name) => {
            if (reducer(descriptor, name, obj) !== false) {
                reducedDescriptors[name] = descriptor;
            }
        });

        Object.defineProperties(obj, reducedDescriptors);
    };

    /**
     * Makes all methods read-only @param {Object} obj
     */

    const freezeMethods = (obj) => {
        reduceDescriptors(obj, (descriptor, name) => {
            // skip restricted props in strict mode
            if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
                return false;
            }

            const value = obj[name];

            if (!isFunction(value)) return;

            descriptor.enumerable = false;

            if ('writable' in descriptor) {
                descriptor.writable = false;
                return;
            }

            if (!descriptor.set) {
                descriptor.set = () => {
                    throw Error('Can not rewrite read-only method \'' + name + '\'');
                };
            }
        });
    };

    const toObjectSet = (arrayOrString, delimiter) => {
        const obj = {};

        const define = (arr) => {
            arr.forEach(value => {
                obj[value] = true;
            });
        };

        isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));

        return obj;
    };

    const noop = () => { };

    const toFiniteNumber = (value, defaultValue) => {
        value = +value;
        return Number.isFinite(value) ? value : defaultValue;
    };

    const ALPHA = 'abcdefghijklmnopqrstuvwxyz';

    const DIGIT = '0123456789';

    const ALPHABET = {
        DIGIT,
        ALPHA,
        ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
    };

    const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
        let str = '';
        const { length } = alphabet;
        while (size--) {
            str += alphabet[Math.random() * length | 0];
        }

        return str;
    };

    /**
     * If the thing is a FormData object, return true, otherwise return false.
     * @param {unknown} thing - The thing to check.
     * @returns {boolean}
     */
    function isSpecCompliantForm(thing) {
        return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === 'FormData' && thing[Symbol.iterator]);
    }

    const toJSONObject = (obj) => {
        const stack = new Array(10);

        const visit = (source, i) => {

            if (isObject(source)) {
                if (stack.indexOf(source) >= 0) {
                    return;
                }

                if (!('toJSON' in source)) {
                    stack[i] = source;
                    const target = isArray(source) ? [] : {};

                    forEach(source, (value, key) => {
                        const reducedValue = visit(value, i + 1);
                        !isUndefined(reducedValue) && (target[key] = reducedValue);
                    });

                    stack[i] = undefined;

                    return target;
                }
            }

            return source;
        };

        return visit(obj, 0);
    };

    const utils = {
        isArray,
        isArrayBuffer,
        isBuffer,
        isFormData,
        isArrayBufferView,
        isString,
        isNumber,
        isBoolean,
        isObject,
        isPlainObject,
        isUndefined,
        isDate,
        isFile,
        isBlob,
        isRegExp,
        isFunction,
        isStream,
        isURLSearchParams,
        isTypedArray,
        isFileList,
        forEach,
        merge,
        extend,
        trim,
        stripBOM,
        inherits,
        toFlatObject,
        kindOf,
        kindOfTest,
        endsWith,
        toArray,
        forEachEntry,
        matchAll,
        isHTMLForm,
        hasOwnProperty,
        hasOwnProp: hasOwnProperty, // an alias to avoid ESLint no-prototype-builtins detection
        reduceDescriptors,
        freezeMethods,
        toObjectSet,
        toCamelCase,
        noop,
        toFiniteNumber,
        findKey,
        global: _global,
        isContextDefined,
        ALPHABET,
        generateString,
        isSpecCompliantForm,
        toJSONObject
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     * @param {string} message The error message. @param {string} [code] The error code (for example, 'ECONNABORTED'). @param {Object} [config] The config. @param {Object} [request] The request. @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    function AxiosError$1(message, code, config, request, response) {
        Error.call(this);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = (new Error()).stack;
        }

        this.message = message;
        this.name = 'AxiosError';
        code && (this.code = code);
        config && (this.config = config);
        request && (this.request = request);
        response && (this.response = response);
    }

    utils.inherits(AxiosError$1, Error, {
        toJSON: function toJSON() {
            return {
                // Standard
                message: this.message,
                name: this.name,
                // Microsoft
                description: this.description,
                number: this.number,
                // Mozilla
                fileName: this.fileName,
                lineNumber: this.lineNumber,
                columnNumber: this.columnNumber,
                stack: this.stack,
                // Axios
                config: utils.toJSONObject(this.config),
                code: this.code,
                status: this.response && this.response.status ? this.response.status : null
            };
        }
    });

    const prototype$1 = AxiosError$1.prototype;
    const descriptors = {};

    [
        'ERR_BAD_OPTION_VALUE',
        'ERR_BAD_OPTION',
        'ECONNABORTED',
        'ETIMEDOUT',
        'ERR_NETWORK',
        'ERR_FR_TOO_MANY_REDIRECTS',
        'ERR_DEPRECATED',
        'ERR_BAD_RESPONSE',
        'ERR_BAD_REQUEST',
        'ERR_CANCELED',
        'ERR_NOT_SUPPORT',
        'ERR_INVALID_URL'
        // eslint-disable-next-line func-names
    ].forEach(code => {
        descriptors[code] = { value: code };
    });

    Object.defineProperties(AxiosError$1, descriptors);
    Object.defineProperty(prototype$1, 'isAxiosError', { value: true });

    // eslint-disable-next-line func-names
    AxiosError$1.from = (error, code, config, request, response, customProps) => {
        const axiosError = Object.create(prototype$1);

        utils.toFlatObject(error, axiosError, function filter(obj) {
            return obj !== Error.prototype;
        }, prop => {
            return prop !== 'isAxiosError';
        });

        AxiosError$1.call(axiosError, error.message, code, config, request, response);

        axiosError.cause = error;

        axiosError.name = error.name;

        customProps && Object.assign(axiosError, customProps);

        return axiosError;
    };

    // eslint-disable-next-line strict
    const httpAdapter = null;

    /**
     * Determines if the given thing is a array or js object.
     * @param {string} thing - The object or array to be visited.
     * @returns {boolean}
     */
    function isVisitable(thing) {
        return utils.isPlainObject(thing) || utils.isArray(thing);
    }

    /**
     * It removes the brackets from the end of a string
     * @param {string} key - The key of the parameter.
     * @returns {string} the key without the brackets.
     */
    function removeBrackets(key) {
        return utils.endsWith(key, '[]') ? key.slice(0, -2) : key;
    }

    /**
     * It takes a path, a key, and a boolean, and returns a string
     * @param {string} path - The path to the current key. @param {string} key - The key of the current object being iterated over. @param {string} dots - If true, the key will be rendered with dots instead of brackets.
     * @returns {string} The path to the current key.
     */
    function renderKey(path, key, dots) {
        if (!path) return key;
        return path.concat(key).map(function each(token, i) {
            // eslint-disable-next-line no-param-reassign
            token = removeBrackets(token);
            return !dots && i ? '[' + token + ']' : token;
        }).join(dots ? '.' : '');
    }

    /**
     * If the array is an array and none of its elements are visitable, then it's a flat array.
     * @param {Array<any>} arr - The array to check
     * @returns {boolean}
     */
    function isFlatArray(arr) {
        return utils.isArray(arr) && !arr.some(isVisitable);
    }

    const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
        return /^is[A-Z]/.test(prop);
    });

    /**
     * Convert a data object to FormData
     * @param {Object} obj @param {?Object} [formData] @param {?Object} [options] @param {Function} [options.visitor] @param {Boolean} [options.metaTokens = true] @param {Boolean} [options.dots = false] @param {?Boolean} [options.indexes = false]
     * @returns {Object}
     **/

    /**
     * It converts an object into a FormData object
     * @param {Object<any, any>} obj - The object to convert to form data. @param {string} formData - The FormData object to append to. @param {Object<string, any>} options
     * @returns
     */
    function toFormData$1(obj, formData, options) {
        if (!utils.isObject(obj)) {
            throw new TypeError('target must be an object');
        }

        // eslint-disable-next-line no-param-reassign
        formData = formData || new (FormData)();

        // eslint-disable-next-line no-param-reassign
        options = utils.toFlatObject(options, {
            metaTokens: true,
            dots: false,
            indexes: false
        }, false, function defined(option, source) {
            // eslint-disable-next-line no-eq-null,eqeqeq
            return !utils.isUndefined(source[option]);
        });

        const metaTokens = options.metaTokens;
        // eslint-disable-next-line no-use-before-define
        const visitor = options.visitor || defaultVisitor;
        const dots = options.dots;
        const indexes = options.indexes;
        const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
        const useBlob = _Blob && utils.isSpecCompliantForm(formData);

        if (!utils.isFunction(visitor)) {
            throw new TypeError('visitor must be a function');
        }

        function convertValue(value) {
            if (value === null) return '';

            if (utils.isDate(value)) {
                return value.toISOString();
            }

            if (!useBlob && utils.isBlob(value)) {
                throw new AxiosError$1('Blob is not supported. Use a Buffer instead.');
            }

            if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
                return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
            }

            return value;
        }

        /**
         * Default visitor.
         *
         * @param {*} value
         * @param {String|Number} key
         * @param {Array<String|Number>} path
         * @this {FormData}
         *
         * @returns {boolean} return true to visit the each prop of the value recursively
         */
        function defaultVisitor(value, key, path) {
            let arr = value;

            if (value && !path && typeof value === 'object') {
                if (utils.endsWith(key, '{}')) {
                    // eslint-disable-next-line no-param-reassign
                    key = metaTokens ? key : key.slice(0, -2);
                    // eslint-disable-next-line no-param-reassign
                    value = JSON.stringify(value);
                } else if (
                    (utils.isArray(value) && isFlatArray(value)) ||
                    ((utils.isFileList(value) || utils.endsWith(key, '[]')) && (arr = utils.toArray(value))
                    )) {
                    // eslint-disable-next-line no-param-reassign
                    key = removeBrackets(key);

                    arr.forEach(function each(el, index) {
                        !(utils.isUndefined(el) || el === null) && formData.append(
                            // eslint-disable-next-line no-nested-ternary
                            indexes === true ? renderKey([key], index, dots) : (indexes === null ? key : key + '[]'),
                            convertValue(el)
                        );
                    });
                    return false;
                }
            }

            if (isVisitable(value)) {
                return true;
            }

            formData.append(renderKey(path, key, dots), convertValue(value));

            return false;
        }

        const stack = [];

        const exposedHelpers = Object.assign(predicates, {
            defaultVisitor,
            convertValue,
            isVisitable
        });

        function build(value, path) {
            if (utils.isUndefined(value)) return;

            if (stack.indexOf(value) !== -1) {
                throw Error('Circular reference detected in ' + path.join('.'));
            }

            stack.push(value);

            utils.forEach(value, function each(el, key) {
                const result = !(utils.isUndefined(el) || el === null) && visitor.call(
                    formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers
                );

                if (result === true) {
                    build(el, path ? path.concat(key) : [key]);
                }
            });

            stack.pop();
        }

        if (!utils.isObject(obj)) {
            throw new TypeError('data must be an object');
        }

        build(obj);

        return formData;
    }

    /**
     * It encodes a string by replacing all characters that are not in the unreserved set with
     * their percent-encoded equivalents
     * @param {string} str - The string to encode.
     * @returns {string} The encoded string.
     */
    function encode$1(str) {
        const charMap = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
            return charMap[match];
        });
    }

    /**
     * It takes a params object and converts it to a FormData object
     * @param {Object<string, any>} params - The parameters to be converted to a FormData object. @param {Object<string, any>} options - The options object passed to the Axios constructor.
     * @returns {void}
     */
    function AxiosURLSearchParams(params, options) {
        this._pairs = [];

        params && toFormData$1(params, this, options);
    }

    const prototype = AxiosURLSearchParams.prototype;

    prototype.append = function append(name, value) {
        this._pairs.push([name, value]);
    };

    prototype.toString = function toString(encoder) {
        const _encode = encoder ? function (value) {
            return encoder.call(this, value, encode$1);
        } : encode$1;

        return this._pairs.map(function each(pair) {
            return _encode(pair[0]) + '=' + _encode(pair[1]);
        }, '').join('&');
    };

    /**
     * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
     * URI encoded counterparts
     * @param {string} val The value to be encoded.
     * @returns {string} The encoded value.
     */
    function encode(val) {
        return encodeURIComponent(val).
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%20/g, '+').
            replace(/%5B/gi, '[').
            replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     * @param {string} url The base of the url (e.g., http://www.google.com) @param {object} [params] The params to be appended @param {?object} options
     * @returns {string} The formatted url
     */
    function buildURL(url, params, options) {
        /*eslint no-param-reassign:0*/
        if (!params) {
            return url;
        }

        const _encode = options && options.encode || encode;

        const serializeFn = options && options.serialize;

        let serializedParams;

        if (serializeFn) {
            serializedParams = serializeFn(params, options);
        } else {
            serializedParams = utils.isURLSearchParams(params) ?
                params.toString() :
                new AxiosURLSearchParams(params, options).toString(_encode);
        }

        if (serializedParams) {
            const hashmarkIndex = url.indexOf("#");

            if (hashmarkIndex !== -1) {
                url = url.slice(0, hashmarkIndex);
            }
            url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
        }

        return url;
    }

    class InterceptorManager {
        constructor() {
            this.handlers = [];
        }

        /**
         * Add a new interceptor to the stack
         *
         * @param {Function} fulfilled The function to handle `then` for a `Promise`
         * @param {Function} rejected The function to handle `reject` for a `Promise`
         *
         * @return {Number} An ID used to remove interceptor later
         */
        use(fulfilled, rejected, options) {
            this.handlers.push({
                fulfilled,
                rejected,
                synchronous: options ? options.synchronous : false,
                runWhen: options ? options.runWhen : null
            });
            return this.handlers.length - 1;
        }

        /**
         * Remove an interceptor from the stack
         *
         * @param {Number} id The ID that was returned by `use`
         *
         * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
         */
        eject(id) {
            if (this.handlers[id]) {
                this.handlers[id] = null;
            }
        }

        /**
         * Clear all interceptors from the stack
         *
         * @returns {void}
         */
        clear() {
            if (this.handlers) {
                this.handlers = [];
            }
        }

        /**
         * Iterate over all the registered interceptors
         *
         * This method is particularly useful for skipping over any
         * interceptors that may have become `null` calling `eject`.
         *
         * @param {Function} fn The function to call for each interceptor
         *
         * @returns {void}
         */
        forEach(fn) {
            utils.forEach(this.handlers, function forEachHandler(h) {
                if (h !== null) {
                    fn(h);
                }
            });
        }
    }

    const InterceptorManager$1 = InterceptorManager;

    const transitionalDefaults = {
        silentJSONParsing: true,
        forcedJSONParsing: true,
        clarifyTimeoutError: false
    };

    const URLSearchParams$1 = typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;

    const FormData$1 = typeof FormData !== 'undefined' ? FormData : null;

    const Blob$1 = typeof Blob !== 'undefined' ? Blob : null;

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     * @returns {boolean}
     */
    const isStandardBrowserEnv = (() => {
        let product;
        if (typeof navigator !== 'undefined' && (
            (product = navigator.product) === 'ReactNative' ||
            product === 'NativeScript' ||
            product === 'NS')
        ) {
            return false;
        }

        return typeof window !== 'undefined' && typeof document !== 'undefined';
    })();

    /**
     * Determine if we're running in a standard browser webWorker environment
     *
     * Although the `isStandardBrowserEnv` method indicates that
     * `allows axios to run in a web worker`, the WebWorker will still be
     * filtered out due to its judgment standard
     * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
     * This leads to a problem when axios post `FormData` in webWorker
     */
    const isStandardBrowserWebWorkerEnv = (() => {
        return (
            typeof WorkerGlobalScope !== 'undefined' &&
            // eslint-disable-next-line no-undef
            self instanceof WorkerGlobalScope &&
            typeof self.importScripts === 'function'
        );
    })();


    const platform = {
        isBrowser: true,
        classes: {
            URLSearchParams: URLSearchParams$1,
            FormData: FormData$1,
            Blob: Blob$1
        },
        isStandardBrowserEnv,
        isStandardBrowserWebWorkerEnv,
        protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
    };

    function toURLEncodedForm(data, options) {
        return toFormData$1(data, new platform.classes.URLSearchParams(), Object.assign({
            visitor: function (value, key, path, helpers) {
                if (platform.isNode && utils.isBuffer(value)) {
                    this.append(key, value.toString('base64'));
                    return false;
                }

                return helpers.defaultVisitor.apply(this, arguments);
            }
        }, options));
    }

    /**
     * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
     * @param {string} name - The name of the property to get.
     * @returns An array of strings.
     */
    function parsePropPath(name) {
        // foo[x][y][z]
        // foo.x.y.z
        // foo-x-y-z
        // foo x y z
        return utils.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
            return match[0] === '[]' ? '' : match[1] || match[0];
        });
    }

    /**
     * Convert an array to an object.
     * @param {Array<any>} arr - The array to convert to an object.
     * @returns An object with the same keys and values as the array.
     */
    function arrayToObject(arr) {
        const obj = {};
        const keys = Object.keys(arr);
        let i;
        const len = keys.length;
        let key;
        for (i = 0; i < len; i++) {
            key = keys[i];
            obj[key] = arr[key];
        }
        return obj;
    }

    /**
     * It takes a FormData object and returns a JavaScript object
     * @param {string} formData The FormData object to convert to JSON.
     * @returns {Object<string, any> | null} The converted object.
     */
    function formDataToJSON(formData) {
        function buildPath(path, value, target, index) {
            let name = path[index++];
            const isNumericKey = Number.isFinite(+name);
            const isLast = index >= path.length;
            name = !name && utils.isArray(target) ? target.length : name;

            if (isLast) {
                if (utils.hasOwnProp(target, name)) {
                    target[name] = [target[name], value];
                } else {
                    target[name] = value;
                }

                return !isNumericKey;
            }

            if (!target[name] || !utils.isObject(target[name])) {
                target[name] = [];
            }

            const result = buildPath(path, value, target[name], index);

            if (result && utils.isArray(target[name])) {
                target[name] = arrayToObject(target[name]);
            }

            return !isNumericKey;
        }

        if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
            const obj = {};

            utils.forEachEntry(formData, (name, value) => {
                buildPath(parsePropPath(name), value, obj, 0);
            });

            return obj;
        }

        return null;
    }

    const DEFAULT_CONTENT_TYPE = {
        'Content-Type': undefined
    };

    /**
     * It takes a string, tries to parse it, and if it fails, it returns the stringified version
     * of the input
     * @param {any} rawValue - The value to be stringified. @param {Function} parser - A function that parses a string into a JavaScript object. @param {Function} encoder - A function that takes a value and returns a string.
     * @returns {string} A stringified version of the rawValue.
     */
    function stringifySafely(rawValue, parser, encoder) {
        if (utils.isString(rawValue)) {
            try {
                (parser || JSON.parse)(rawValue);
                return utils.trim(rawValue);
            } catch (e) {
                if (e.name !== 'SyntaxError') {
                    throw e;
                }
            }
        }

        return (encoder || JSON.stringify)(rawValue);
    }

    const defaults = {

        transitional: transitionalDefaults,

        adapter: ['xhr', 'http'],

        transformRequest: [function transformRequest(data, headers) {
            const contentType = headers.getContentType() || '';
            const hasJSONContentType = contentType.indexOf('application/json') > -1;
            const isObjectPayload = utils.isObject(data);

            if (isObjectPayload && utils.isHTMLForm(data)) {
                data = new FormData(data);
            }

            const isFormData = utils.isFormData(data);

            if (isFormData) {
                if (!hasJSONContentType) {
                    return data;
                }
                return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
            }

            if (utils.isArrayBuffer(data) ||
                utils.isBuffer(data) ||
                utils.isStream(data) ||
                utils.isFile(data) ||
                utils.isBlob(data)
            ) {
                return data;
            }
            if (utils.isArrayBufferView(data)) {
                return data.buffer;
            }
            if (utils.isURLSearchParams(data)) {
                headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
                return data.toString();
            }

            let isFileList;

            if (isObjectPayload) {
                if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
                    return toURLEncodedForm(data, this.formSerializer).toString();
                }

                if ((isFileList = utils.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
                    const _FormData = this.env && this.env.FormData;

                    return toFormData$1(
                        isFileList ? { 'files[]': data } : data,
                        _FormData && new _FormData(),
                        this.formSerializer
                    );
                }
            }

            if (isObjectPayload || hasJSONContentType) {
                headers.setContentType('application/json', false);
                return stringifySafely(data);
            }

            return data;
        }],

        transformResponse: [function transformResponse(data) {
            const transitional = this.transitional || defaults.transitional;
            const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
            const JSONRequested = this.responseType === 'json';

            if (data && utils.isString(data) && ((forcedJSONParsing && !this.responseType) || JSONRequested)) {
                const silentJSONParsing = transitional && transitional.silentJSONParsing;
                const strictJSONParsing = !silentJSONParsing && JSONRequested;

                try {
                    return JSON.parse(data);
                } catch (e) {
                    if (strictJSONParsing) {
                        if (e.name === 'SyntaxError') {
                            throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
                        }
                        throw e;
                    }
                }
            }

            return data;
        }],

        /**
         * A timeout in milliseconds to abort a request. If set to 0 (default) a
         * timeout is not created.
         */
        timeout: 0,

        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',

        maxContentLength: -1,
        maxBodyLength: -1,

        env: {
            FormData: platform.classes.FormData,
            Blob: platform.classes.Blob
        },

        validateStatus: function validateStatus(status) {
            return status >= 200 && status < 300;
        },

        headers: {
            common: {
                'Accept': 'application/json, text/plain, */*'
            }
        }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
        defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    const defaults$1 = defaults;

    // RawAxiosHeaders whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    const ignoreDuplicateOf = utils.toObjectSet([
        'age', 'authorization', 'content-length', 'content-type', 'etag',
        'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
        'last-modified', 'location', 'max-forwards', 'proxy-authorization',
        'referer', 'retry-after', 'user-agent'
    ]);

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     * @param {String} rawHeaders Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    const parseHeaders = rawHeaders => {
        const parsed = {};
        let key;
        let val;
        let i;

        rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
            i = line.indexOf(':');
            key = line.substring(0, i).trim().toLowerCase();
            val = line.substring(i + 1).trim();

            if (!key || (parsed[key] && ignoreDuplicateOf[key])) {
                return;
            }

            if (key === 'set-cookie') {
                if (parsed[key]) {
                    parsed[key].push(val);
                } else {
                    parsed[key] = [val];
                }
            } else {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
            }
        });

        return parsed;
    };

    const $internals = Symbol('internals');

    function normalizeHeader(header) {
        return header && String(header).trim().toLowerCase();
    }

    function normalizeValue(value) {
        if (value === false || value == null) {
            return value;
        }

        return utils.isArray(value) ? value.map(normalizeValue) : String(value);
    }

    function parseTokens(str) {
        const tokens = Object.create(null);
        const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
        let match;

        while ((match = tokensRE.exec(str))) {
            tokens[match[1]] = match[2];
        }

        return tokens;
    }

    const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());

    function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
        if (utils.isFunction(filter)) {
            return filter.call(this, value, header);
        }

        if (isHeaderNameFilter) {
            value = header;
        }

        if (!utils.isString(value)) return;

        if (utils.isString(filter)) {
            return value.indexOf(filter) !== -1;
        }

        if (utils.isRegExp(filter)) {
            return filter.test(value);
        }
    }

    function formatHeader(header) {
        return header.trim()
            .toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
                return char.toUpperCase() + str;
            });
    }

    function buildAccessors(obj, header) {
        const accessorName = utils.toCamelCase(' ' + header);

        ['get', 'set', 'has'].forEach(methodName => {
            Object.defineProperty(obj, methodName + accessorName, {
                value: function (arg1, arg2, arg3) {
                    return this[methodName].call(this, header, arg1, arg2, arg3);
                },
                configurable: true
            });
        });
    }

    class AxiosHeaders$1 {
        constructor(headers) {
            headers && this.set(headers);
        }

        set(header, valueOrRewrite, rewrite) {
            const self = this;

            function setHeader(_value, _header, _rewrite) {
                const lHeader = normalizeHeader(_header);

                if (!lHeader) {
                    throw new Error('header name must be a non-empty string');
                }

                const key = utils.findKey(self, lHeader);

                if (!key || self[key] === undefined || _rewrite === true || (_rewrite === undefined && self[key] !== false)) {
                    self[key || _header] = normalizeValue(_value);
                }
            }

            const setHeaders = (headers, _rewrite) =>
                utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));

            if (utils.isPlainObject(header) || header instanceof this.constructor) {
                setHeaders(header, valueOrRewrite);
            } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
                setHeaders(parseHeaders(header), valueOrRewrite);
            } else {
                header != null && setHeader(valueOrRewrite, header, rewrite);
            }

            return this;
        }

        get(header, parser) {
            header = normalizeHeader(header);

            if (header) {
                const key = utils.findKey(this, header);

                if (key) {
                    const value = this[key];

                    if (!parser) {
                        return value;
                    }

                    if (parser === true) {
                        return parseTokens(value);
                    }

                    if (utils.isFunction(parser)) {
                        return parser.call(this, value, key);
                    }

                    if (utils.isRegExp(parser)) {
                        return parser.exec(value);
                    }

                    throw new TypeError('parser must be boolean|regexp|function');
                }
            }
        }

        has(header, matcher) {
            header = normalizeHeader(header);

            if (header) {
                const key = utils.findKey(this, header);

                return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
            }

            return false;
        }

        delete(header, matcher) {
            const self = this;
            let deleted = false;

            function deleteHeader(_header) {
                _header = normalizeHeader(_header);

                if (_header) {
                    const key = utils.findKey(self, _header);

                    if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
                        delete self[key];

                        deleted = true;
                    }
                }
            }

            if (utils.isArray(header)) {
                header.forEach(deleteHeader);
            } else {
                deleteHeader(header);
            }

            return deleted;
        }

        clear(matcher) {
            const keys = Object.keys(this);
            let i = keys.length;
            let deleted = false;

            while (i--) {
                const key = keys[i];
                if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
                    delete this[key];
                    deleted = true;
                }
            }

            return deleted;
        }

        normalize(format) {
            const self = this;
            const headers = {};

            utils.forEach(this, (value, header) => {
                const key = utils.findKey(headers, header);

                if (key) {
                    self[key] = normalizeValue(value);
                    delete self[header];
                    return;
                }

                const normalized = format ? formatHeader(header) : String(header).trim();

                if (normalized !== header) {
                    delete self[header];
                }

                self[normalized] = normalizeValue(value);

                headers[normalized] = true;
            });

            return this;
        }

        concat(...targets) {
            return this.constructor.concat(this, ...targets);
        }

        toJSON(asStrings) {
            const obj = Object.create(null);

            utils.forEach(this, (value, header) => {
                value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(', ') : value);
            });

            return obj;
        }

        [Symbol.iterator]() {
            return Object.entries(this.toJSON())[Symbol.iterator]();
        }

        toString() {
            return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
        }

        get [Symbol.toStringTag]() {
            return 'AxiosHeaders';
        }

        static from(thing) {
            return thing instanceof this ? thing : new this(thing);
        }

        static concat(first, ...targets) {
            const computed = new this(first);

            targets.forEach((target) => computed.set(target));

            return computed;
        }

        static accessor(header) {
            const internals = this[$internals] = (this[$internals] = {
                accessors: {}
            });

            const accessors = internals.accessors;
            const prototype = this.prototype;

            function defineAccessor(_header) {
                const lHeader = normalizeHeader(_header);

                if (!accessors[lHeader]) {
                    buildAccessors(prototype, _header);
                    accessors[lHeader] = true;
                }
            }

            utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);

            return this;
        }
    }

    AxiosHeaders$1.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

    utils.freezeMethods(AxiosHeaders$1.prototype);
    utils.freezeMethods(AxiosHeaders$1);

    const AxiosHeaders$2 = AxiosHeaders$1;

    /**
     * Transform the data for a request or a response
     * @param {Array|Function} fns A single function or Array of functions @param {?Object} response The response object
     * @returns {*} The resulting transformed data
     */
    function transformData(fns, response) {
        const config = this || defaults$1;
        const context = response || config;
        const headers = AxiosHeaders$2.from(context.headers);
        let data = context.data;

        utils.forEach(fns, function transform(fn) {
            data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
        });

        headers.normalize();

        return data;
    }

    function isCancel$1(value) {
        return !!(value && value.__CANCEL__);
    }

    /**
     * A `CanceledError` is an object that is thrown when an operation is canceled.
     * @param {string=} message The message. @param {Object=} config The config. @param {Object=} request The request.
     * @returns {CanceledError} The created error.
     */
    function CanceledError$1(message, config, request) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        AxiosError$1.call(this, message == null ? 'canceled' : message, AxiosError$1.ERR_CANCELED, config, request);
        this.name = 'CanceledError';
    }

    utils.inherits(CanceledError$1, AxiosError$1, {
        __CANCEL__: true
    });

    /**
     * Resolve or reject a Promise based on response status.
     * @param {Function} resolve A function that resolves the promise. @param {Function} reject A function that rejects the promise. @param {object} response The response.
     * @returns {object} The response.
     */
    function settle(resolve, reject, response) {
        const validateStatus = response.config.validateStatus;
        if (!response.status || !validateStatus || validateStatus(response.status)) {
            resolve(response);
        } else {
            reject(new AxiosError$1(
                'Request failed with status code ' + response.status,
                [AxiosError$1.ERR_BAD_REQUEST, AxiosError$1.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
                response.config,
                response.request,
                response
            ));
        }
    }

    const cookies = platform.isStandardBrowserEnv ?

        // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
            return {
                write: function write(name, value, expires, path, domain, secure) {
                    const cookie = [];
                    cookie.push(name + '=' + encodeURIComponent(value));

                    if (utils.isNumber(expires)) {
                        cookie.push('expires=' + new Date(expires).toGMTString());
                    }

                    if (utils.isString(path)) {
                        cookie.push('path=' + path);
                    }

                    if (utils.isString(domain)) {
                        cookie.push('domain=' + domain);
                    }

                    if (secure === true) {
                        cookie.push('secure');
                    }

                    document.cookie = cookie.join('; ');
                },

                read: function read(name) {
                    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
                    return (match ? decodeURIComponent(match[3]) : null);
                },

                remove: function remove(name) {
                    this.write(name, '', Date.now() - 86400000);
                }
            };
        })() :

        // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
            return {
                write: function write() { },
                read: function read() { return null; },
                remove: function remove() { }
            };
        })();

    /**
     * Determines whether the specified URL is absolute
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    function isAbsoluteURL(url) {
        // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
        // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
        // by any combination of letters, digits, plus, period, or hyphen.
        return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
    }

    /**
     * Creates a new URL by combining the specified URLs
     * @param {string} baseURL The base URL @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    function combineURLs(baseURL, relativeURL) {
        return relativeURL
            ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
            : baseURL;
    }

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     * @param {string} baseURL The base URL @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    function buildFullPath(baseURL, requestedURL) {
        if (baseURL && !isAbsoluteURL(requestedURL)) {
            return combineURLs(baseURL, requestedURL);
        }
        return requestedURL;
    }

    const isURLSameOrigin = platform.isStandardBrowserEnv ?

        // Standard browser envs have full support of the APIs needed to test
        // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
            const msie = /(msie|trident)/i.test(navigator.userAgent);
            const urlParsingNode = document.createElement('a');
            let originURL;

            /**
            * Parse a URL to discover it's components
            *
            * @param {String} url The URL to be parsed
            * @returns {Object}
            */
            function resolveURL(url) {
                let href = url;

                if (msie) {
                    // IE needs attribute set twice to normalize properties
                    urlParsingNode.setAttribute('href', href);
                    href = urlParsingNode.href;
                }

                urlParsingNode.setAttribute('href', href);

                // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
                return {
                    href: urlParsingNode.href,
                    protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
                    host: urlParsingNode.host,
                    search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
                    hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
                    hostname: urlParsingNode.hostname,
                    port: urlParsingNode.port,
                    pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                        urlParsingNode.pathname :
                        '/' + urlParsingNode.pathname
                };
            }

            originURL = resolveURL(window.location.href);

            /**
            * Determine if a URL shares the same origin as the current location
            *
            * @param {String} requestURL The URL to test
            * @returns {boolean} True if URL shares the same origin, otherwise false
            */
            return function isURLSameOrigin(requestURL) {
                const parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
                return (parsed.protocol === originURL.protocol &&
                    parsed.host === originURL.host);
            };
        })() :

        // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
            return function isURLSameOrigin() {
                return true;
            };
        })();

    function parseProtocol(url) {
        const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
        return match && match[1] || '';
    }

    /**
     * Calculate data maxRate @param {Number} [samplesCount= 10] @param {Number} [min= 1000] @returns {Function}
     */
    function speedometer(samplesCount, min) {
        samplesCount = samplesCount || 10;
        const bytes = new Array(samplesCount);
        const timestamps = new Array(samplesCount);
        let head = 0;
        let tail = 0;
        let firstSampleTS;

        min = min !== undefined ? min : 1000;

        return function push(chunkLength) {
            const now = Date.now();

            const startedAt = timestamps[tail];

            if (!firstSampleTS) {
                firstSampleTS = now;
            }

            bytes[head] = chunkLength;
            timestamps[head] = now;

            let i = tail;
            let bytesCount = 0;

            while (i !== head) {
                bytesCount += bytes[i++];
                i = i % samplesCount;
            }

            head = (head + 1) % samplesCount;

            if (head === tail) {
                tail = (tail + 1) % samplesCount;
            }

            if (now - firstSampleTS < min) {
                return;
            }

            const passed = startedAt && now - startedAt;

            return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
        };
    }

    function progressEventReducer(listener, isDownloadStream) {
        let bytesNotified = 0;
        const _speedometer = speedometer(50, 250);

        return e => {
            const loaded = e.loaded;
            const total = e.lengthComputable ? e.total : undefined;
            const progressBytes = loaded - bytesNotified;
            const rate = _speedometer(progressBytes);
            const inRange = loaded <= total;

            bytesNotified = loaded;

            const data = {
                loaded,
                total,
                progress: total ? (loaded / total) : undefined,
                bytes: progressBytes,
                rate: rate ? rate : undefined,
                estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
                event: e
            };

            data[isDownloadStream ? 'download' : 'upload'] = true;

            listener(data);
        };
    }

    const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';

    const xhrAdapter = isXHRAdapterSupported && function (config) {
        return new Promise(function dispatchXhrRequest(resolve, reject) {
            let requestData = config.data;
            const requestHeaders = AxiosHeaders$2.from(config.headers).normalize();
            const responseType = config.responseType;
            let onCanceled;
            function done() {
                if (config.cancelToken) {
                    config.cancelToken.unsubscribe(onCanceled);
                }

                if (config.signal) {
                    config.signal.removeEventListener('abort', onCanceled);
                }
            }

            if (utils.isFormData(requestData) && (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv)) {
                requestHeaders.setContentType(false); // Let the browser set it
            }

            let request = new XMLHttpRequest();

            // HTTP basic authentication
            if (config.auth) {
                const username = config.auth.username || '';
                const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
                requestHeaders.set('Authorization', 'Basic ' + btoa(username + ':' + password));
            }

            const fullPath = buildFullPath(config.baseURL, config.url);

            request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

            // Set the request timeout in MS
            request.timeout = config.timeout;

            function onloadend() {
                if (!request) {
                    return;
                }
                // Prepare the response
                const responseHeaders = AxiosHeaders$2.from(
                    'getAllResponseHeaders' in request && request.getAllResponseHeaders()
                );
                const responseData = !responseType || responseType === 'text' || responseType === 'json' ?
                    request.responseText : request.response;
                const response = {
                    data: responseData,
                    status: request.status,
                    statusText: request.statusText,
                    headers: responseHeaders,
                    config,
                    request
                };

                settle(function _resolve(value) {
                    resolve(value);
                    done();
                }, function _reject(err) {
                    reject(err);
                    done();
                }, response);

                // Clean up request
                request = null;
            }

            if ('onloadend' in request) {
                // Use onloadend if available
                request.onloadend = onloadend;
            } else {
                // Listen for ready state to emulate onloadend
                request.onreadystatechange = function handleLoad() {
                    if (!request || request.readyState !== 4) {
                        return;
                    }

                    // The request errored out and we didn't get a response, this will be
                    // handled by onerror instead
                    // With one exception: request that using file: protocol, most browsers
                    // will return status as 0 even though it's a successful request
                    if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
                        return;
                    }
                    // readystate handler is calling before onerror or ontimeout handlers,
                    // so we should call onloadend on the next 'tick'
                    setTimeout(onloadend);
                };
            }

            // Handle browser request cancellation (as opposed to a manual cancellation)
            request.onabort = function handleAbort() {
                if (!request) {
                    return;
                }

                reject(new AxiosError$1('Request aborted', AxiosError$1.ECONNABORTED, config, request));

                // Clean up request
                request = null;
            };

            // Handle low level network errors
            request.onerror = function handleError() {
                // Real errors are hidden from us by the browser
                // onerror should only fire if it's a network error
                reject(new AxiosError$1('Network Error', AxiosError$1.ERR_NETWORK, config, request));

                // Clean up request
                request = null;
            };

            // Handle timeout
            request.ontimeout = function handleTimeout() {
                let timeoutErrorMessage = config.timeout ? 'timeout of ' + config.timeout + 'ms exceeded' : 'timeout exceeded';
                const transitional = config.transitional || transitionalDefaults;
                if (config.timeoutErrorMessage) {
                    timeoutErrorMessage = config.timeoutErrorMessage;
                }
                reject(new AxiosError$1(
                    timeoutErrorMessage,
                    transitional.clarifyTimeoutError ? AxiosError$1.ETIMEDOUT : AxiosError$1.ECONNABORTED,
                    config,
                    request));

                // Clean up request
                request = null;
            };

            // Add xsrf header
            // This is only done if running in a standard browser environment.
            // Specifically not if we're in a web worker, or react-native.
            if (platform.isStandardBrowserEnv) {
                // Add xsrf header
                const xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath))
                    && config.xsrfCookieName && cookies.read(config.xsrfCookieName);

                if (xsrfValue) {
                    requestHeaders.set(config.xsrfHeaderName, xsrfValue);
                }
            }

            // Remove Content-Type if data is undefined
            requestData === undefined && requestHeaders.setContentType(null);

            // Add headers to the request
            if ('setRequestHeader' in request) {
                utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
                    request.setRequestHeader(key, val);
                });
            }

            // Add withCredentials to request if needed
            if (!utils.isUndefined(config.withCredentials)) {
                request.withCredentials = !!config.withCredentials;
            }

            // Add responseType to request if needed
            if (responseType && responseType !== 'json') {
                request.responseType = config.responseType;
            }

            // Handle progress if needed
            if (typeof config.onDownloadProgress === 'function') {
                request.addEventListener('progress', progressEventReducer(config.onDownloadProgress, true));
            }

            // Not all browsers support upload events
            if (typeof config.onUploadProgress === 'function' && request.upload) {
                request.upload.addEventListener('progress', progressEventReducer(config.onUploadProgress));
            }

            if (config.cancelToken || config.signal) {
                // Handle cancellation
                // eslint-disable-next-line func-names
                onCanceled = cancel => {
                    if (!request) {
                        return;
                    }
                    reject(!cancel || cancel.type ? new CanceledError$1(null, config, request) : cancel);
                    request.abort();
                    request = null;
                };

                config.cancelToken && config.cancelToken.subscribe(onCanceled);
                if (config.signal) {
                    config.signal.aborted ? onCanceled() : config.signal.addEventListener('abort', onCanceled);
                }
            }

            const protocol = parseProtocol(fullPath);

            if (protocol && platform.protocols.indexOf(protocol) === -1) {
                reject(new AxiosError$1('Unsupported protocol ' + protocol + ':', AxiosError$1.ERR_BAD_REQUEST, config));
                return;
            }


            // Send the request
            request.send(requestData || null);
        });
    };

    const knownAdapters = {
        http: httpAdapter,
        xhr: xhrAdapter
    };

    utils.forEach(knownAdapters, (fn, value) => {
        if (fn) {
            try {
                Object.defineProperty(fn, 'name', { value });
            } catch (e) {
                // eslint-disable-next-line no-empty
            }
            Object.defineProperty(fn, 'adapterName', { value });
        }
    });

    const adapters = {
        getAdapter: (adapters) => {
            adapters = utils.isArray(adapters) ? adapters : [adapters];

            const { length } = adapters;
            let nameOrAdapter;
            let adapter;

            for (let i = 0; i < length; i++) {
                nameOrAdapter = adapters[i];
                if ((adapter = utils.isString(nameOrAdapter) ? knownAdapters[nameOrAdapter.toLowerCase()] : nameOrAdapter)) {
                    break;
                }
            }

            if (!adapter) {
                if (adapter === false) {
                    throw new AxiosError$1(
                        `Adapter ${nameOrAdapter} is not supported by the environment`,
                        'ERR_NOT_SUPPORT'
                    );
                }

                throw new Error(
                    utils.hasOwnProp(knownAdapters, nameOrAdapter) ?
                        `Adapter '${nameOrAdapter}' is not available in the build` :
                        `Unknown adapter '${nameOrAdapter}'`
                );
            }

            if (!utils.isFunction(adapter)) {
                throw new TypeError('adapter is not a function');
            }

            return adapter;
        },
        adapters: knownAdapters
    };

    /**
     * Throws a `CanceledError` if cancellation has been requested.
     * @param {Object} config The config that is to be used for the request
     * @returns {void}
     */
    function throwIfCancellationRequested(config) {
        if (config.cancelToken) {
            config.cancelToken.throwIfRequested();
        }

        if (config.signal && config.signal.aborted) {
            throw new CanceledError$1(null, config);
        }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    function dispatchRequest(config) {
        throwIfCancellationRequested(config);

        config.headers = AxiosHeaders$2.from(config.headers);

        // Transform request data
        config.data = transformData.call(
            config,
            config.transformRequest
        );

        if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
            config.headers.setContentType('application/x-www-form-urlencoded', false);
        }

        const adapter = adapters.getAdapter(config.adapter || defaults$1.adapter);

        return adapter(config).then(function onAdapterResolution(response) {
            throwIfCancellationRequested(config);

            // Transform response data
            response.data = transformData.call(
                config,
                config.transformResponse,
                response
            );

            response.headers = AxiosHeaders$2.from(response.headers);

            return response;
        }, function onAdapterRejection(reason) {
            if (!isCancel$1(reason)) {
                throwIfCancellationRequested(config);

                // Transform response data
                if (reason && reason.response) {
                    reason.response.data = transformData.call(
                        config,
                        config.transformResponse,
                        reason.response
                    );
                    reason.response.headers = AxiosHeaders$2.from(reason.response.headers);
                }
            }

            return Promise.reject(reason);
        });
    }

    const headersToObject = (thing) => thing instanceof AxiosHeaders$2 ? thing.toJSON() : thing;

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     * @param {Object} config1 @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    function mergeConfig$1(config1, config2) {
        // eslint-disable-next-line no-param-reassign
        config2 = config2 || {};
        const config = {};

        function getMergedValue(target, source, caseless) {
            if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
                return utils.merge.call({ caseless }, target, source);
            } else if (utils.isPlainObject(source)) {
                return utils.merge({}, source);
            } else if (utils.isArray(source)) {
                return source.slice();
            }
            return source;
        }

        // eslint-disable-next-line consistent-return
        function mergeDeepProperties(a, b, caseless) {
            if (!utils.isUndefined(b)) {
                return getMergedValue(a, b, caseless);
            } else if (!utils.isUndefined(a)) {
                return getMergedValue(undefined, a, caseless);
            }
        }

        // eslint-disable-next-line consistent-return
        function valueFromConfig2(a, b) {
            if (!utils.isUndefined(b)) {
                return getMergedValue(undefined, b);
            }
        }

        // eslint-disable-next-line consistent-return
        function defaultToConfig2(a, b) {
            if (!utils.isUndefined(b)) {
                return getMergedValue(undefined, b);
            } else if (!utils.isUndefined(a)) {
                return getMergedValue(undefined, a);
            }
        }

        // eslint-disable-next-line consistent-return
        function mergeDirectKeys(a, b, prop) {
            if (prop in config2) {
                return getMergedValue(a, b);
            } else if (prop in config1) {
                return getMergedValue(undefined, a);
            }
        }

        const mergeMap = {
            url: valueFromConfig2,
            method: valueFromConfig2,
            data: valueFromConfig2,
            baseURL: defaultToConfig2,
            transformRequest: defaultToConfig2,
            transformResponse: defaultToConfig2,
            paramsSerializer: defaultToConfig2,
            timeout: defaultToConfig2,
            timeoutMessage: defaultToConfig2,
            withCredentials: defaultToConfig2,
            adapter: defaultToConfig2,
            responseType: defaultToConfig2,
            xsrfCookieName: defaultToConfig2,
            xsrfHeaderName: defaultToConfig2,
            onUploadProgress: defaultToConfig2,
            onDownloadProgress: defaultToConfig2,
            decompress: defaultToConfig2,
            maxContentLength: defaultToConfig2,
            maxBodyLength: defaultToConfig2,
            beforeRedirect: defaultToConfig2,
            transport: defaultToConfig2,
            httpAgent: defaultToConfig2,
            httpsAgent: defaultToConfig2,
            cancelToken: defaultToConfig2,
            socketPath: defaultToConfig2,
            responseEncoding: defaultToConfig2,
            validateStatus: mergeDirectKeys,
            headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
        };

        utils.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
            const merge = mergeMap[prop] || mergeDeepProperties;
            const configValue = merge(config1[prop], config2[prop], prop);
            (utils.isUndefined(configValue) && merge !== mergeDirectKeys) || (config[prop] = configValue);
        });

        return config;
    }

    const VERSION$1 = "1.3.6";

    const validators$1 = {};

    // eslint-disable-next-line func-names
    ['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
        validators$1[type] = function validator(thing) {
            return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
        };
    });

    const deprecatedWarnings = {};

    /**
     * Transitional option validator
     * @param {function|boolean?} validator - set to false if the transitional option has been removed @param {string?} version - deprecated version / removed since version @param {string?} message - some message with additional info
     * @returns {function}
     */
    validators$1.transitional = function transitional(validator, version, message) {
        function formatMessage(opt, desc) {
            return '[Axios v' + VERSION$1 + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
        }

        // eslint-disable-next-line func-names
        return (value, opt, opts) => {
            if (validator === false) {
                throw new AxiosError$1(
                    formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')),
                    AxiosError$1.ERR_DEPRECATED
                );
            }

            if (version && !deprecatedWarnings[opt]) {
                deprecatedWarnings[opt] = true;
                // eslint-disable-next-line no-console
                console.warn(
                    formatMessage(
                        opt,
                        ' has been deprecated since v' + version + ' and will be removed in the near future'
                    )
                );
            }

            return validator ? validator(value, opt, opts) : true;
        };
    };

    /**
     * Assert object's properties type
     * @param {object} options @param {object} schema @param {boolean?} allowUnknown
     * @returns {object}
     */

    function assertOptions(options, schema, allowUnknown) {
        if (typeof options !== 'object') {
            throw new AxiosError$1('options must be an object', AxiosError$1.ERR_BAD_OPTION_VALUE);
        }
        const keys = Object.keys(options);
        let i = keys.length;
        while (i-- > 0) {
            const opt = keys[i];
            const validator = schema[opt];
            if (validator) {
                const value = options[opt];
                const result = value === undefined || validator(value, opt, options);
                if (result !== true) {
                    throw new AxiosError$1('option ' + opt + ' must be ' + result, AxiosError$1.ERR_BAD_OPTION_VALUE);
                }
                continue;
            }
            if (allowUnknown !== true) {
                throw new AxiosError$1('Unknown option ' + opt, AxiosError$1.ERR_BAD_OPTION);
            }
        }
    }

    const validator = {
        assertOptions,
        validators: validators$1
    };

    const validators = validator.validators;

    /**
     * Create a new instance of Axios
     * @param {Object} instanceConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    class Axios$1 {
        constructor(instanceConfig) {
            this.defaults = instanceConfig;
            this.interceptors = {
                request: new InterceptorManager$1(),
                response: new InterceptorManager$1()
            };
        }

        /**
         * Dispatch a request
         *
         * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
         * @param {?Object} config
         *
         * @returns {Promise} The Promise to be fulfilled
         */
        request(configOrUrl, config) {
            /*eslint no-param-reassign:0*/
            // Allow for axios('example/url'[, config]) a la fetch API
            if (typeof configOrUrl === 'string') {
                config = config || {};
                config.url = configOrUrl;
            } else {
                config = configOrUrl || {};
            }

            config = mergeConfig$1(this.defaults, config);

            const { transitional, paramsSerializer, headers } = config;

            if (transitional !== undefined) {
                validator.assertOptions(transitional, {
                    silentJSONParsing: validators.transitional(validators.boolean),
                    forcedJSONParsing: validators.transitional(validators.boolean),
                    clarifyTimeoutError: validators.transitional(validators.boolean)
                }, false);
            }

            if (paramsSerializer != null) {
                if (utils.isFunction(paramsSerializer)) {
                    config.paramsSerializer = {
                        serialize: paramsSerializer
                    };
                } else {
                    validator.assertOptions(paramsSerializer, {
                        encode: validators.function,
                        serialize: validators.function
                    }, true);
                }
            }

            // Set config.method
            config.method = (config.method || this.defaults.method || 'get').toLowerCase();

            let contextHeaders;

            // Flatten headers
            contextHeaders = headers && utils.merge(
                headers.common,
                headers[config.method]
            );

            contextHeaders && utils.forEach(
                ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
                (method) => {
                    delete headers[method];
                }
            );

            config.headers = AxiosHeaders$2.concat(contextHeaders, headers);

            // filter out skipped interceptors
            const requestInterceptorChain = [];
            let synchronousRequestInterceptors = true;
            this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
                if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
                    return;
                }

                synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

                requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
            });

            const responseInterceptorChain = [];
            this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
                responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
            });

            let promise;
            let i = 0;
            let len;

            if (!synchronousRequestInterceptors) {
                const chain = [dispatchRequest.bind(this), undefined];
                chain.unshift.apply(chain, requestInterceptorChain);
                chain.push.apply(chain, responseInterceptorChain);
                len = chain.length;

                promise = Promise.resolve(config);

                while (i < len) {
                    promise = promise.then(chain[i++], chain[i++]);
                }

                return promise;
            }

            len = requestInterceptorChain.length;

            let newConfig = config;

            i = 0;

            while (i < len) {
                const onFulfilled = requestInterceptorChain[i++];
                const onRejected = requestInterceptorChain[i++];
                try {
                    newConfig = onFulfilled(newConfig);
                } catch (error) {
                    onRejected.call(this, error);
                    break;
                }
            }

            try {
                promise = dispatchRequest.call(this, newConfig);
            } catch (error) {
                return Promise.reject(error);
            }

            i = 0;
            len = responseInterceptorChain.length;

            while (i < len) {
                promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
            }

            return promise;
        }

        getUri(config) {
            config = mergeConfig$1(this.defaults, config);
            const fullPath = buildFullPath(config.baseURL, config.url);
            return buildURL(fullPath, config.params, config.paramsSerializer);
        }
    }

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
        /*eslint func-names:0*/
        Axios$1.prototype[method] = function (url, config) {
            return this.request(mergeConfig$1(config || {}, {
                method,
                url,
                data: (config || {}).data
            }));
        };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
        /*eslint func-names:0*/

        function generateHTTPMethod(isForm) {
            return function httpMethod(url, data, config) {
                return this.request(mergeConfig$1(config || {}, {
                    method,
                    headers: isForm ? {
                        'Content-Type': 'multipart/form-data'
                    } : {},
                    url,
                    data
                }));
            };
        }

        Axios$1.prototype[method] = generateHTTPMethod();

        Axios$1.prototype[method + 'Form'] = generateHTTPMethod(true);
    });

    const Axios$2 = Axios$1;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     * @param {Function} executor The executor function.
     * @returns {CancelToken}
     */
    class CancelToken$1 {
        constructor(executor) {
            if (typeof executor !== 'function') {
                throw new TypeError('executor must be a function.');
            }

            let resolvePromise;

            this.promise = new Promise(function promiseExecutor(resolve) {
                resolvePromise = resolve;
            });

            const token = this;

            // eslint-disable-next-line func-names
            this.promise.then(cancel => {
                if (!token._listeners) return;

                let i = token._listeners.length;

                while (i-- > 0) {
                    token._listeners[i](cancel);
                }
                token._listeners = null;
            });

            // eslint-disable-next-line func-names
            this.promise.then = onfulfilled => {
                let _resolve;
                // eslint-disable-next-line func-names
                const promise = new Promise(resolve => {
                    token.subscribe(resolve);
                    _resolve = resolve;
                }).then(onfulfilled);

                promise.cancel = function reject() {
                    token.unsubscribe(_resolve);
                };

                return promise;
            };

            executor(function cancel(message, config, request) {
                if (token.reason) {
                    // Cancellation has already been requested
                    return;
                }

                token.reason = new CanceledError$1(message, config, request);
                resolvePromise(token.reason);
            });
        }

        /**
         * Throws a `CanceledError` if cancellation has been requested.
         */
        throwIfRequested() {
            if (this.reason) {
                throw this.reason;
            }
        }

        /**
         * Subscribe to the cancel signal
         */

        subscribe(listener) {
            if (this.reason) {
                listener(this.reason);
                return;
            }

            if (this._listeners) {
                this._listeners.push(listener);
            } else {
                this._listeners = [listener];
            }
        }

        /**
         * Unsubscribe from the cancel signal
         */

        unsubscribe(listener) {
            if (!this._listeners) {
                return;
            }
            const index = this._listeners.indexOf(listener);
            if (index !== -1) {
                this._listeners.splice(index, 1);
            }
        }

        /**
         * Returns an object that contains a new `CancelToken` and a function that, when called,
         * cancels the `CancelToken`.
         */
        static source() {
            let cancel;
            const token = new CancelToken$1(function executor(c) {
                cancel = c;
            });
            return {
                token,
                cancel
            };
        }
    }

    const CancelToken$2 = CancelToken$1;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     * @param {Function} callback
     * @returns {Function}
     */
    function spread$1(callback) {
        return function wrap(arr) {
            return callback.apply(null, arr);
        };
    }

    /**
     * Determines whether the payload is an error thrown by Axios
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    function isAxiosError$1(payload) {
        return utils.isObject(payload) && (payload.isAxiosError === true);
    }

    const HttpStatusCode$1 = {
        Continue: 100,
        SwitchingProtocols: 101,
        Processing: 102,
        EarlyHints: 103,
        Ok: 200,
        Created: 201,
        Accepted: 202,
        NonAuthoritativeInformation: 203,
        NoContent: 204,
        ResetContent: 205,
        PartialContent: 206,
        MultiStatus: 207,
        AlreadyReported: 208,
        ImUsed: 226,
        MultipleChoices: 300,
        MovedPermanently: 301,
        Found: 302,
        SeeOther: 303,
        NotModified: 304,
        UseProxy: 305,
        Unused: 306,
        TemporaryRedirect: 307,
        PermanentRedirect: 308,
        BadRequest: 400,
        Unauthorized: 401,
        PaymentRequired: 402,
        Forbidden: 403,
        NotFound: 404,
        MethodNotAllowed: 405,
        NotAcceptable: 406,
        ProxyAuthenticationRequired: 407,
        RequestTimeout: 408,
        Conflict: 409,
        Gone: 410,
        LengthRequired: 411,
        PreconditionFailed: 412,
        PayloadTooLarge: 413,
        UriTooLong: 414,
        UnsupportedMediaType: 415,
        RangeNotSatisfiable: 416,
        ExpectationFailed: 417,
        ImATeapot: 418,
        MisdirectedRequest: 421,
        UnprocessableEntity: 422,
        Locked: 423,
        FailedDependency: 424,
        TooEarly: 425,
        UpgradeRequired: 426,
        PreconditionRequired: 428,
        TooManyRequests: 429,
        RequestHeaderFieldsTooLarge: 431,
        UnavailableForLegalReasons: 451,
        InternalServerError: 500,
        NotImplemented: 501,
        BadGateway: 502,
        ServiceUnavailable: 503,
        GatewayTimeout: 504,
        HttpVersionNotSupported: 505,
        VariantAlsoNegotiates: 506,
        InsufficientStorage: 507,
        LoopDetected: 508,
        NotExtended: 510,
        NetworkAuthenticationRequired: 511,
    };

    Object.entries(HttpStatusCode$1).forEach(([key, value]) => {
        HttpStatusCode$1[value] = key;
    });

    const HttpStatusCode$2 = HttpStatusCode$1;

    /**
     * Create an instance of Axios @param {Object} defaultConfig The default config for the instance @returns {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
        const context = new Axios$2(defaultConfig);
        const instance = bind(Axios$2.prototype.request, context);

        // Copy axios.prototype to instance
        utils.extend(instance, Axios$2.prototype, context, { allOwnKeys: true });

        // Copy context to instance
        utils.extend(instance, context, null, { allOwnKeys: true });

        // Factory for creating new instances
        instance.create = function create(instanceConfig) {
            return createInstance(mergeConfig$1(defaultConfig, instanceConfig));
        };

        return instance;
    }
    // Create the default instance to be exported
    const axios = createInstance(defaults$1);
    // Expose Axios class to allow class inheritance
    axios.Axios = Axios$2;
    // Expose Cancel & CancelToken
    axios.CanceledError = CanceledError$1;
    axios.CancelToken = CancelToken$2;
    axios.isCancel = isCancel$1;
    axios.VERSION = VERSION$1;
    axios.toFormData = toFormData$1;
    // Expose AxiosError class
    axios.AxiosError = AxiosError$1;
    // alias for CanceledError for backward compatibility
    axios.Cancel = axios.CanceledError;
    // Expose all/spread
    axios.all = function all(promises) {
        return Promise.all(promises);
    };
    axios.spread = spread$1;
    // Expose isAxiosError
    axios.isAxiosError = isAxiosError$1;
    // Expose mergeConfig
    axios.mergeConfig = mergeConfig$1;
    axios.AxiosHeaders = AxiosHeaders$2;
    axios.formToJSON = thing => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
    axios.HttpStatusCode = HttpStatusCode$2;
    axios.default = axios;
    return axios;
})()
// @inject-end

// @inject-start nanobar.js
const Nanobar = (function () {
    var css = '.nanobar{width:100%;height:4px;z-index:9999;top:0}.bar{width:0;height:100%;transition:height .3s;background:#000}'
    function addCss() {
        var s = document.getElementById('nanobarcss')
        if (s === null) {
            s = document.createElement('style')
            s.type = 'text/css'
            s.id = 'nanobarcss'
            document.head.insertBefore(s, document.head.firstChild)
            // the world
            if (!s.styleSheet) return s.appendChild(document.createTextNode(css))
            // IE
            s.styleSheet.cssText = css
        }
    }

    function addClass(el, cls) {
        if (el.classList) el.classList.add(cls)
        else el.className += ' ' + cls
    }

    // create a progress bar
    // this will be destroyed after reaching 100% progress
    function createBar(rm) {
        // create progress element
        var el = document.createElement('div'),
            width = 0,
            here = 0,
            on = 0,
            bar = { el: el, go: go }

        addClass(el, 'bar')

        // animation loop
        function move() {
            var dist = width - here

            if (dist < 0.1 && dist > -0.1) {
                place(here)
                on = 0
                if (width === 100) {
                    el.style.height = 0
                    setTimeout(function () { rm(el) }, 300)
                }
            } else {
                place(width - dist / 4)
                setTimeout(go, 16)
            }
        }

        // set bar width
        function place(num) {
            width = num
            el.style.width = width + '%'
        }

        function go(num) {
            if (num >= 0) {
                here = num
                if (!on) {
                    on = 1
                    move()
                }
            } else if (on) {
                move()
            }
        }
        return bar
    }

    function Nanobar(opts) {
        opts = opts || {}
        // set options
        var el = document.createElement('div'),
            applyGo,
            nanobar = {
                el: el,
                go: function (p) {
                    // expand bar
                    applyGo(p)
                    // create new bar when progress reaches 100%
                    if (p === 100) {
                        init()
                    }
                }
            }

        // remove element from nanobar container
        function rm(child) {
            el.removeChild(child)
        }

        // create and insert progress var in nanobar container
        function init() {
            var bar = createBar(rm)
            el.appendChild(bar.el)
            applyGo = bar.go
        }

        addCss()

        addClass(el, 'nanobar')
        if (opts.id) el.id = opts.id
        if (opts.classname) addClass(el, opts.classname)

        // insert container
        if (opts.target) {
            // inside a div
            el.style.position = 'relative'
            opts.target.insertBefore(el, opts.target.firstChild)
        } else {
            // on top of the page
            el.style.position = 'fixed'
            document.getElementsByTagName('body')[0].appendChild(el)
        }

        init()
        return nanobar
    }

    return Nanobar
}())
// @inject-end

// @inject seatable-api.js
const ColumnTypes = {
    NUMBER: 'number',
    TEXT: 'text',
    LONG_TEXT: 'long-text',
    CHECKBOX: 'checkbox',
    DATE: 'date',
    SINGLE_SELECT: 'single-select',
    MULTIPLE_SELECT: 'multiple-select',
    IMAGE: 'image',
    FILE: 'file',
    COLLABORATOR: 'collaborator',
    LINK: 'link',
    FORMULA: 'formula',
    CREATOR: 'creator',
    CTIME: 'ctime',
    LAST_MODIFIER: 'last-modifier',
    MTIME: 'mtime',
    GEOLOCATION: 'geolocation',
    AUTO_NUMBER: 'auto-number',
    URL: 'url',
};
const getAccessToken = (config) => {
    const { server, APIToken } = config;
    const url = server + '/api/v2.1/dtable/app-access-token/';
    const headers = { 'Authorization': 'Token ' + APIToken };
    return axios.get(url, { headers: headers });
};
class Base {
    constructor(config) {
        this.config = config;
        this.appName = '';
        this.accessToken = '';
        this.dtableServer = '';
        this.dtableSocket = '';
        this.lang = 'en';
        this.req = null;
    }

    async auth() {
        const response = await getAccessToken(this.config);
        const { app_name, access_token, dtable_uuid, dtable_server, dtable_socket } = response.data;
        this.appName = app_name;
        this.accessToken = access_token;
        this.dtableServer = dtable_server;
        this.dtableSocket = dtable_socket;
        this.dtableUuid = dtable_uuid;
        this.req = axios.create({
            baseURL: this.dtableServer,
            headers: { Authorization: 'Token ' + this.accessToken }
        });
        this.req.interceptors.response.use(response => {
            const result = this.getResult(response);
            return result;
        }, error => {
            return Promise.reject(error);
        });
    }

    getResult(response) {
        const { data, config } = response;
        const { method, url } = config;
        const paths = url.split('/');
        const lastPath = paths[paths.length - 2];
        let result = data;
        if (method === 'get') {
            // metadata
            if (lastPath === 'metadata') {
                result = data.metadata;
                return result;
            }
            // list views
            if (lastPath === 'views') {
                result = data.views;
                return result;
            }
            // list rows
            if (lastPath === 'rows') {
                result = data.rows;
                return result;
            }
            // list columns
            if (lastPath === 'columns') {
                result = data.columns;
                return result;
            }
        }

        if (method === 'post' && lastPath === 'query') {
            result = data.results.map(v => {
                let row = {}
                data.metadata.forEach(e => row[e.name] = v[e.key])
                return row
            });
            return result;
        }

        return result;
    }

    getDTable() {
        const url = `dtables/${this.dtableUuid}/?lang=${this.lang}`;
        return this.req.get(url);
    }

    getMetadata() {
        const url = `/api/v1/dtables/${this.dtableUuid}/metadata/`;
        return this.req.get(url);
    }

    addTable(table_name, lang) {
        const url = `/api/v1/dtables/${this.dtableUuid}/tables/`;
        const data = {
            table_name: table_name,
            lang: lang
        }
        return this.req.post(url, { ...data });
    }

    listViews(table_name) {
        const url = `api/v1/dtables/${this.dtableUuid}/views/`;
        const params = {
            table_name: table_name,
        }
        return this.req.get(url, { params });
    }

    listColumns(table_name, view_name) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const params = {
            table_name: table_name,
            view_name: view_name
        }
        return this.req.get(url, { params });
    }

    insertColumn(table_name, column_name, column_type, column_key, column_data) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            table_name: table_name,
            column_name: column_name,
            anchor_column: column_key,
            column_type: column_type,
            column_data: column_data
        };
        return this.req.post(url, { ...data });
    }

    renameColumn(table_name, column_key, new_column_name) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            op_type: 'rename_column',
            table_name: table_name,
            column: column_key,
            new_column_name: new_column_name,
        };
        return this.req.put(url, { ...data });
    }

    resizeColumn(table_name, column_key, new_column_width) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            op_type: 'resize_column',
            table_name: table_name,
            column: column_key,
            new_column_width: new_column_width,
        };
        return this.req.put(url, { ...data });
    }

    freezeColumn(table_name, column_key, frozen) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            op_type: 'freeze_column',
            table_name: table_name,
            column: column_key,
            frozen: frozen,
        };
        return this.req.put(url, { ...data });
    }

    moveColumn(table_name, column_key, target_column_key) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            op_type: 'move_column',
            table_name: table_name,
            column: column_key,
            target_column: target_column_key,
        };
        return this.req.put(url, { ...data });
    }

    modifyColumnType(table_name, column_key, new_column_type) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            op_type: 'modify_column_type',
            table_name: table_name,
            column: column_key,
            new_column_type: new_column_type,
        };
        return this.req.put(url, { ...data });
    }

    deleteColumn(table_name, column_key) {
        const url = `api/v1/dtables/${this.dtableUuid}/columns/`;
        const data = {
            table_name: table_name,
            column: column_key,
        };
        return this.req.delete(url, { data: data });
    }

    addColumnOptions(table_name, column, options) {
        const url = `api/v1/dtables/${this.dtableUuid}/column-options/`;
        const data = {
            table_name: table_name,
            column: column,
            options: options
        };
        return this.req.post(url, { ...data });
    }

    addColumnCascadeSettings(table_name, child_column, parent_column, cascade_settings) {
        const url = `api/v1/dtables/${this.dtableUuid}/column-cascade-settings/`;
        const data = {
            table_name: table_name,
            child_column: child_column,
            parent_column: parent_column,
            cascade_settings: cascade_settings,
        };
        return this.req.post(url, { ...data });
    }

    listRows(table_name, view_name, order_by, desc, start, limit) {
        const url = `api/v1/dtables/${this.dtableUuid}/rows/`;
        const params = {
            table_name: table_name,
            view_name: view_name,
            convert_link_id: true,
        };
        params['direction'] = desc ? 'desc' : 'asc';
        if (order_by) {
            params['order_by'] = order_by;
        }
        if (start) {
            params['start'] = start;
        }

        if (limit) {
            params['limit'] = limit;
        }

        return this.req.get(url, { params });
    }

    appendRow(table_name, row_data) {
        const url = `api/v1/dtables/${this.dtableUuid}/rows/`;
        const data = {
            table_name: table_name,
            row: row_data,
        };
        return this.req.post(url, { ...data });
    }

    insertRow(table_name, row_data, anchor_row_id) {
        const url = `api/v1/dtables/${this.dtableUuid}/rows/`;
        const data = {
            table_name: table_name,
            row: row_data,
            anchor_row_id: anchor_row_id,
        };
        return this.req.post(url, { ...data });
    }

    deleteRow(table_name, row_id) {
        const url = `api/v1/dtables/${this.dtableUuid}/rows/`;
        const data = {
            table_name: table_name,
            row_id: row_id,
        };
        return this.req.delete(url, { data: data });
    }

    updateRow(table_name, row_id, row_data) {
        const url = `api/v1/dtables/${this.dtableUuid}/rows/`;
        const data = {
            table_name: table_name,
            row_id: row_id,
            row: row_data,
        };
        return this.req.put(url, { ...data });
    }

    getRow(table_name, row_id) {
        const url = `api/v1/dtables/${this.dtableUuid}/rows/${row_id}/`;
        const params = {
            table_name: table_name,
        };
        return this.req.get(url, { params });
    }

    batchAppendRows(table_name, rows_data) {
        const url = `api/v1/dtables/${this.dtableUuid}/batch-append-rows/`;
        const data = {
            table_name: table_name,
            rows: rows_data,
        };
        return this.req.post(url, { ...data });
    }

    batchDeleteRows(table_name, row_ids) {
        const url = `api/v1/dtables/${this.dtableUuid}/batch-delete-rows/`;
        const data = {
            table_name: table_name,
            row_ids: row_ids,
        };
        return this.req.delete(url, { data: data });
    }

    batchUpdateRows(table_name, rows_data) {
        const url = `api/v1/dtables/${this.dtableUuid}/batch-update-rows/`;
        const data = {
            table_name: table_name,
            updates: rows_data,
        };
        return this.req.put(url, { ...data });
    }

    addLink(link_id, table_name, other_table_name, row_id, other_row_id) {
        const url = `api/v1/dtables/${this.dtableUuid}/links/`;
        const data = {
            link_id: link_id,
            table_name: table_name,
            other_table_name: other_table_name,
            table_row_id: row_id,
            other_table_row_id: other_row_id,
        };
        return this.req.post(url, { ...data });
    }

    updateLink(link_id, table_id, other_table_id, row_id, other_rows_ids) {
        const url = `api/v1/dtables/${this.dtableUuid}/links/`;
        const data = {
            link_id: link_id,
            table_id: table_id,
            other_table_id: other_table_id,
            row_id: row_id,
            other_rows_ids: other_rows_ids,
        };
        return this.req.put(url, { ...data });
    }

    removeLink(link_id, table_name, other_table_name, row_id, other_row_id) {
        const url = `api/v1/dtables/${this.dtableUuid}/links/`;
        const data = {
            link_id: link_id,
            table_name: table_name,
            other_table_name: other_table_name,
            table_row_id: row_id,
            other_table_row_id: other_row_id,
        };
        return this.req.delete(url, { data: data });
    }

    batchUpdateLinks(link_id, table_id, other_table_id, row_id_list, other_rows_ids_map) {
        const url = `api/v1/dtables/${this.dtableUuid}/batch-update-links/`;
        const data = {
            link_id: link_id,
            table_id: table_id,
            other_table_id: other_table_id,
            row_id_list: row_id_list,
            other_rows_ids_map: other_rows_ids_map,
        };
        return this.req.put(url, { ...data });
    }

    getColumnLinkId(columns, column_name) {
        const column = columns.find(column => column.name === column_name);
        if (!column) {
            return Promise.reject({ error_message: 'column is not exist', });
        }

        if (column.type !== 'link') {
            return Promise.reject({ error_message: `The column ${column_name} is not a link colum` });
        }

        return Promise.resolve(column.data['link_id']);
    }

    query(sql) {
        const url = `api/v1/dtables/${this.dtableUuid}/query/`;
        const data = { sql: sql };
        return this.req.post(url, { ...data });
    }
    async queryAsync(sql) {
        const url = `api/v1/dtables/${this.dtableUuid}/query/`;
        const data = { sql: sql };
        return await this.req.post(url, { ...data });
    }
}
// @inject-end

// @inject-start main
const seatable_config = {
    server: 'http://26.25.156.106',
    // server: 'http://empy.shenzhuo.vip:45248',
    APIToken: 'd206902a1d886db445d7d0c008004f962731de1b'
}
const seatable_base = new Base(seatable_config)
seatable_base.auth()

class flow {
    constructor(val) {
        val['templateId'] = val['templeteId']
        this.value = val
        Object.assign(this.value, { supplyName: '', applyAmount: 0, account: '', depositBank: '' })
    }
    // 通过数据库更新
    updateBySeatable(table) {
        Object.entries({
            'summaryId': 'ID',
            'formRecordid': '表单ID',
            'templateId': '模板ID',
            'supplyName': '收款账户',
            'account': '银行账号',
            'depositBank': '开户行',
            'applyAmount': '申请金额',
            'accountPayable': '应付金额',
            'paidAmount': '已付金额',
            'unpaidAmount': '未付金额',
            'financeId': '核销凭证',
            'payer': '付款方'
        }).forEach(([k, v], i) => this.value[k] = table[v])
        return this.value
    }
    // 读取流程补全字段
    completeFields(fields) {
        var ele = this.value
        if (!location.href.match(/method=listPending/g) && fields.some(x => ele[x] == undefined || ele[x] == null || ele[x] == '')) {
            $.ajax({
                url: `/seeyon/collaboration/collaboration.do?method=summary&affairId=${ele['affairId']}`,
                method: "GET",
                async: false
            }).success((data) => {
                for (let i = 0; i < fields.length; i++) {
                    let key = fields[i]
                    let regexstr = new RegExp(`var\\s${key}\\s?=\\s?'(?<${key}>[0-9-]+)'`)
                    let res = regexstr.exec(data)
                    ele[key] = res == undefined || res == null ? '' : res.groups[key]
                }
            }).error((e) => console.log(ele['affairId'] + ': ' + ele['subject']))
            this.value = ele
        }
        return this.value
    }
    // 获取流程表单数据
    getformdata(templates) {
        var ele = this.value
        $.ajax({
            url: `/seeyon/rest/form/getformdata/${this.value['affairId']}`,
            method: "GET",
            async: false
        }).success((e) => {
            if (!e.DataJson)
                return
            var data = JSON.parse(e.DataJson)[0]
            var template = templates[ele['templateId']]
            if (template) {
                Object.entries(template).forEach(([k, v], i) => {
                    if (v instanceof Array)
                        v.some(x => {
                            if (data[x] == null || data[x] == '') return false
                            else {
                                ele[k] = data[x]
                                return true
                            }
                        })
                    else
                        ele[k] = data[v]
                })
            }
        }).error((e) => { console.log(ele['summaryId'] + ': ' + ele['subject']) })
        this.value = ele
        return this.value
    }
    static getMemberInfoById(memberId) {
        var res = null
        $.ajax({
            url: `/seeyon/addressbook.do?method=getMemberInfoById`,
            method: "POST",
            data: {
                memberId: memberId
            },
            async: false,
            dataType: 'json'
        }).success((e) => {
            res = e
        }).error((e) => {
            console.log(`[seeyou] (memberId='${memberId}') Unable to getMemberInfoById. `)
        })
        return res
    }
}

const asyncPool = async (arr, delegate, start = (v) => v, end = (v) => v, poolLimit = 10) => {
    const ret = []
    const executing = new Set()
    let arr_res = new Array(arr.length)
    let completeCount = 0

    var nanobar = new Nanobar({ id: 'nanobar', target: document.body })
    jQuery("#nanobar").css('background', '#BEE7E9')
    jQuery("#nanobar .bar").css('background', '#F4606C')

    arr = start(arr)
    for (let [index, item] of arr.entries()) {
        const p = Promise.resolve().then(async () => {
            try {
                var res = await delegate(item, arr)
                arr_res[index] = res
            } catch (err) {
                console.warn(err)
                arr_res[index] = err
            }
        }).finally(() => {
            nanobar.go((++completeCount) / arr.length * 100)
        })
        ret.push(p)
        executing.add(p)
        const clean = () => executing.delete(p)
        p.then(clean).catch(clean)
        if (executing.size >= poolLimit) {
            await Promise.race(executing)
        }
    }
    return Promise.all(ret).then(() => {
        jQuery("#nanobar").remove()
        console.log(arr_res)
        return end(arr_res)
    })
}

const limitQueue = async (arr, allfun = null, limit = 20) => {
    const table_name = '流程'
    const fields = ['templateId', 'formRecordid', 'summaryId']
    const cashier_id = '-8621888980617641168'
    const templateFields = {
        '5895142011406796749': {
            // 对外付款申请单
            'supplyName': 'field0044',
            'applyAmount': 'field0054',
            'account': ['field0066', 'field0065', 'field0047'],
            'depositBank': 'field0046',
            'payer': 'field0021'
        },
        '-1910116541235311711': {
            // 牧业事业部请付款审批单
            'supplyName': 'field0046',
            'applyAmount': 'field0039',
            'account': 'field0048',
            'depositBank': 'field0047',
            'payer': 'field0041'
        },
        '-2533668926056086008': {
            // 差旅费报销单V2
            'supplyName': 'field0040',
            'applyAmount': 'field0039',
            'payer': 'field0021'
        },
        '-4446069144704102606': {
            // 差旅费报销单
            'supplyName': 'field0040',
            'applyAmount': 'field0039',
            'payer': 'field0021'
        },
        '8076215884574836222': {
            // 油费报销单V2
            'supplyName': 'field0040',
            'applyAmount': 'field0054',
            'payer': 'field0021'
        },
        '-7135341086229641970': {
            // 油费报销单
            'supplyName': 'field0040',
            'applyAmount': 'field0054',
            'payer': 'field0021'
        },
        '4291802339177547763': {
            // 其他费用报销单V2
            'supplyName': 'field0044',
            'applyAmount': 'field0039',
            'account': 'field0046',
            'depositBank': 'field0045',
            'payer': 'field0021'
        },
        '-629130699976915145': {
            // 借款申请单
            'supplyName': 'field0044',
            'applyAmount': 'field0054',
            'account': 'field0047',
            'depositBank': 'field0046',
            'payer': 'field0021'
        },
    }
    const payerEnum = {
        // 费用承担公司id
        "-1585937216510934337": "蒙天乳业有限公司",
        "4663292034364819526": "山东蒙天乳业有限公司",
        "6596440339473514738": "蒙天乳业有限公司上海分公司",
        "-1528005668975521993": "江西蒙天乳业有限公司",
        "-1557708275488174959": "宁夏蒙天乳业有限公司",
        "6904505186630389404": "德州市维多利亚农牧有限公司",
        "8584309132117690151": "山东东君生态农业有限公司",
        "514582257443029538": "健康饮品事业部华东大区",
        "-1853804211592082200": "健康饮品事业部华北大区",
        "2761474216853258980": "健康饮品事业部华中大区",
        "1960492753753950438": "健康饮品事业部华南大区",
        "7445807672464326991": "健康饮品事业部西北大区",
        "-6923534789795690870": "蒙天乳业有限公司南昌分公司",
        "-7429051204531565381": "健康饮品事业部苏皖沪大区",
        "-8111400422124074379": "健康饮品事业部新品部",
        // 部门id
        "-3183965678221049613": "山东东君生态农业有限公司"
    }

    let table = { append: [], update: [], data: [] }
    await asyncPool(arr, delegate = async (v, arr) => {
        var row = new flow(v)
        if (v['summaryId'] == null || v['summaryId'] == undefined)
            v = row.completeFields(fields)
        try {
            let query = v['summaryId'] == undefined ? `协同ID = '${v['affairId']}` : `ID = '${v['summaryId']}`
            let res = await seatable_base.queryAsync(`select * from ${table_name} where ${query}'`)

            if ((res.length > 0)) {
                row.updateBySeatable(res[0])
                v = row.completeFields(fields)
                var row_update_simplify = {}

                var payer = res[0]['付款方']
                if (res[0]['付款方'] == null) {
                    let formdata = row.getformdata(templateFields)
                    payer = payerEnum.hasOwnProperty(formdata['payer']) ? payerEnum[formdata['payer']] :
                        /生态农业/.test(v['subject']) ? '山东东君生态农业有限公司' : '德州市维多利亚农牧有限公司'
                }
                Object.entries({
                    ID: v['summaryId'],
                    协同ID: _wfcurrentUserId == cashier_id ? v['affairId'] : res[0]['协同ID'],
                    表单ID: v['formRecordid'],
                    模板ID: v['templateId'],
                    标题: v['subject'],
                    发起人: v['startMemberName'],
                    付款方: payer
                    // 已付金额: location.href.match(/method=listDone/g) && _wfcurrentUserId == cashier_id ? res[0]['应付金额'] : res[0]['已付金额'],
                }).forEach(([k, v], i) => {
                    if (res[0][k] != v)
                        row_update_simplify[k] = v
                })
                if (Object.keys(row_update_simplify).length > 0)
                    table.update.push({ row_id: res[0]['_id'], row: row_update_simplify })
            } else {
                row.completeFields(fields)
                v = row.getformdata(templateFields)

                table.append.push({
                    ID: v['summaryId'],
                    协同ID: v['affairId'],
                    模板ID: v['templateId'],
                    表单ID: v['formRecordid'],
                    类型: v['templateId'] in templateFields ? "往来" : "", // 现优先区分往来类
                    标题: v['subject'],
                    发起人: v['startMemberName'],
                    发起日期: v['startDate'],
                    付款方: payerEnum.hasOwnProperty(v['payer']) ? payerEnum[v['payer']] :
                        /生态农业/.test(v['subject']) ? '山东东君生态农业有限公司' : '德州市维多利亚农牧有限公司',
                    收款账户: /-?[0-9]+$/.test(v['supplyName']) ? flow.getMemberInfoById(v['supplyName'])['memberName'] : v['supplyName'],
                    银行账号: v['account'],
                    开户行: v['depositBank'],
                    申请金额: v['applyAmount'],
                    应付金额: v['applyAmount'],
                    已付金额: location.href.match(/method=listDone/g) && _wfcurrentUserId == '-8621888980617641168' ? v['applyAmount'] : 0
                })
            }
        } catch (error) { console.warn(error) }
        return v
    }, start = (v) => {
        return v
    }, end = (v) => {
        if (table.update.length > 0)
            seatable_base.batchUpdateRows(table_name, table.update)
        if (table.append.length > 0)
            seatable_base.batchAppendRows(table_name, table.append)
        allfun(v)
        return v
    }, limit)
}

window.colappend = [
    { display: '序列号', name: 'summaryId', sortable: true, width: 'smallest', align: 'center', hide: true },
    { display: '付款方', name: 'payer', sortable: true, width: 'medium', hide: true, editable: true },
    { display: '收款账户', name: 'supplyName', sortable: true, width: 'medium', editable: true },
    { display: '申请金额', name: 'applyAmount', sortable: true, width: 'small', align: 'right', hide: true, editable: true },
    { display: '应付金额', name: 'accountPayable', sortable: true, width: 'small', align: 'right', sum: true, editable: true },
    { display: '已付金额', name: 'paidAmount', sortable: true, width: 'small', align: 'right', sum: true, editable: true },
    { display: '未付金额', name: 'unpaidAmount', sortable: true, width: 'small', align: 'right', sum: true },
    { display: '核销凭证', name: 'financeId', sortable: true, width: 'medium', align: 'left', editable: true },
    { display: '银行账号', name: 'account', sortable: true, width: 'small', hide: true, editable: true },
    { display: '开户行', name: 'depositBank', sortable: true, width: 'small', hide: true, editable: true },
    { display: '操作', name: 'editBtn', sortable: true, width: 'small', type: 'button', align: 'center' },
]

Array.prototype.sum = function () {
    return this.reduce((prev, curr, idx, arr) => {
        prev = $.isNumeric(prev) ? Number(prev) : 0
        curr = $.isNumeric(curr) ? Number(curr) : 0
        return prev + curr
    })
}
const formatField = (val) => parseFloat(eval(`${val}`.replace(/,/g, '')))

const currentPageSum = () => {
    var summaryTHead = $(grid.createTHead()).attr("style", "position: sticky;top: 0;background-color: whitesmoke;")
    $("table[id$=grid_h_table] th").each((i, v) => {
        var ele = $(v)
        var colmode = ele.attr('colmode')

        var td = $(`<td align="${ele.attr('colalign')}" abbr="${colmode}" ${ele.attr('hide') ? 'style="display:none"' : ''}></td>`)
        if (colmode == "subject")
            td.append($(`<div class="text_overflow" style="text-align:center;font-weight:bold">本页合计</div>`))
        if (ele.attr('sum')) {
            var rows = $(grid.rows).map((i, v) => parseFloat($(v).find(`td[abbr="${colmode}"] div`).attr('title'))).get()
            td.append($(`<div class="text_overflow" style="text-align:right;font-weight:bold">${rows.sum().toFixed(2)}</div>`))
        }
        if (colmode == "editBtn") {
            var div = $(`<div class="text_overflow" style="text-align:center;font-weight:bold"></div>`)
            $.each({
                edit: { icon: '✏️', title: '编辑' },
                save: { icon: '✔️', title: '保存' },
                cancle: { icon: '❌', title: '取消' },
            }, (k, v) => {
                var btn = $(`<a opttype='${k}' style='margin:0 2px' title=${v['title']}>${v['icon']}</a>`)
                btn.click((event) => {
                    $(`td[abbr=editBtn] a[rowid][opttype=${$(event.target).attr('opttype')}]`).not('a.display_none').click()
                })
                div.append(btn)
            })
            td.append(div)
        }
        summaryTHead.append(td)
    })
}

document.styleSheets[0].addRule('[contenteditable]', 'outline: 0px; border: 0px; width: 100%;');
const flushUnpaidAmount = (target) => {
    let tr = $(target).parents('td[abbr]').parent()
    let accountPayable = formatField(tr.find('td[abbr=accountPayable]').text())
    let paidAmount = formatField(tr.find('td[abbr=paidAmount]').text())
    let des = tr.find('td[abbr=unpaidAmount]')
    des.find(des.find('div span').length > 0 ? 'div span' : 'div').text(Math.round((accountPayable - paidAmount) * 100) / 100)
}
const tr_contentedit_click = async (e, target) => {
    const table_name = '流程'
    const ele = $(target)
    const parent = ele.parent()
    const config = { rowid: ele.attr('rowid'), type: ele.attr('opttype') }
    const tr = ele.parents(`tr#tr_${config.rowid}`)
    const opts = {
        edit: parent.find('[opttype=edit]'),
        save: parent.find('[opttype=save]'),
        cancle: parent.find('[opttype=cancle]')
    }

    tr.find('td[editable=true]').each((i, v) => {
        var editable = config.type == 'edit' ? 'plaintext-only' : 'false'
        let ele = $(v).find($(v).find('div span').length > 0 ? 'div span' : 'div')
        ele.attr('contenteditable', editable)
        ele.keydown((e) => {
            if (/enter/.test(e.key.toLowerCase())) {
                e.preventDefault()
                let abbr = $(e.target).parents('td[abbr]').attr('abbr')
                if (/applyAmount|accountPayable|paidAmount/.test(abbr)) {
                    $(e.target).text(Math.round(formatField($(e.target).text()) * 100) / 100)
                    flushUnpaidAmount(e.target)
                }
            }
        })
        ele.blur((e) => {
            let abbr = $(e.target).parents('td[abbr]').attr('abbr')
            if (/applyAmount|accountPayable|paidAmount/.test(abbr)) {
                $(e.target).text(Math.round(formatField($(e.target).text()) * 100) / 100)
                flushUnpaidAmount(e.target)
            }
        })
    })
    if (config.type == 'edit') {
        opts.edit.addClass('display_none')
        opts.save.removeClass()
        opts.cancle.removeClass()
    } else {
        if (config.type == 'save') {
            var row = {}
            var val_change = {}
            tr.find('td[editable=true]').each((i, v) => {
                let div = $(v).find('div')
                let abbr = $(v).attr('abbr')
                let old_value = div.attr('title')
                let target = div.find('span').length > 0 ? div.find('span') : div
                let new_value = target.text()
                if (/applyAmount|accountPayable|paidAmount/.test(abbr))
                    new_value = Math.round(formatField(new_value) * 100) / 100
                if (old_value != new_value) {
                    val_change[abbr] = new_value
                    var col = window.colappend.filter((v) => v['name'] == abbr)
                    if (col.length == 1)
                        row[col[0]['display']] = new_value
                    else
                        console.warn(`新增列中不包含${abbr}`)
                }
                flushUnpaidAmount(target)
            })
            if (Object.keys(row).length > 0) {
                var summaryId = tr.find('td[abbr=summaryId] div').attr('title')
                let current = await seatable_base.queryAsync(`select * from ${table_name} where ID='${summaryId}'`)
                let res = seatable_base.updateRow(table_name, current[0]['_id'], row)
                if (res['success'])
                    tr.find('td[editable=true]').each((i, v) =>
                        $(v).find('div').attr('title', val_change[$(v).attr('abbr')]))
            }
        } else {
            tr.find('td[editable=true]').each((i, v) => {
                var div = $(v).find('div')
                var title = div.attr('title')
                let target = $(v).find($(v).find('div span').length > 0 ? 'div span' : 'div')
                target.text(title == undefined ? '' : title)
                flushUnpaidAmount(target)
            })
        }
        opts.edit.removeClass()
        opts.save.addClass('display_none')
        opts.cancle.addClass('display_none')
    }
}
// @inject-end main
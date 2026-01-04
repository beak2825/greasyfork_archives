// ==UserScript==
// @name         bmr1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bmr666
// @author       You
// @match        *://*.aa119119.xyz/*
// @icon         https://www.google.com/s2/favicons?domain=aa119119.xyz
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439623/bmr1.user.js
// @updateURL https://update.greasyfork.org/scripts/439623/bmr1.meta.js
// ==/UserScript==

(function() {
    console.log('111')
    $('.logo').click(function() {
       $('input').attr("disabled",false);
         console.log(window)
    })

    function toFixed(t, e) {
    return t = Math.floor(t * Math.pow(10, e)) / Math.pow(10, e)
}

function getAnimal(t) {
    for (var e = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"], i = {}, n = getAnimalNumber(), s = (4 + (t - 2e3)) % 12, o = 0; o < 12;) -1 == s && (s = 11), i[o] = {
        animal: e[s],
        num: n[o]
    }, o++, s--;
    return i
}

function getAnimalNumber() {
    for (var t, e = [], i = 1; i < 13; i++) for (e[i - 1] = [], t = i; t < 50;) e[i - 1].push(t < 10 ? "0" + t : t + ""), t += 12;
    return e
}

function evenRound(t, e) {
    var i = e || 0, n = Math.pow(10, i), s = +(i ? t * n : t).toFixed(10), e = Math.floor(s), t = s - e,
        s = .5 - 1e-8 < t && t < .5 + 1e-8 ? e % 2 == 0 ? e : e + 1 : Math.round(s);
    return i ? s / n : s
}

function doOddsLoop() {
    var n = this, s = {}, t = $.extend({loop: 2, handicapId: G.CurrentUserHandicap}, this.param_oddsloop),
        e = this.json.Data.Period.StoppedIds || [], o = $(".bet-wrapper"),
        a = $("input[type=text], input[type=button], input[type=submit], input[type=radio]", this.d);
    $.each(e, function (t, e) {
        s[e] = !0
    }), n.array_bettypeid = n.array_bettypeid || {};
    var i = !1;
    $.each(n.array_bettypeid, function (t, e) {
        i = !1, (s[t] && 0 == n.array_bettypeid[t] && 2 == OPEN_STATUS || 0 == n.array_bettypeid[t] && 2 != OPEN_STATUS) && (i = !0), !0 === i && ($("input[bet_type_id='" + t + "']", n.d).prop("disabled", !0), $("input[bet_type_id='" + t + "']", n.d).addClass("betstop"), $("input[bettypeid='" + t + "']", n.d).prop("disabled", !0), $("input[bettypeid='" + t + "']", n.d).addClass("betstop"), $("#betmoney", n.d).prop("disabled", !0), $("input[name='selectclass']", n.d).prop("disabled", !0), "zheng" !== n.id && ($("input[type='submit']", n.d).prop("disabled", !0), $("input.fn-reset", n.d).prop("disabled", !0)), $("input.fn_cancel_bet", n.d).prop("disabled", !0), $("input.fn_quick_bet", n.d).prop("disabled", !0), $("input[name='bet_money']", n.d).prop("disabled", !0), $("input.fn_radio_select", n.d).prop("disabled", !0), n.array_bettypeid[t] = !0, $("input[type='radio']", n.d).prop("disabled", !0), $("input.fn-check-items", n.d).prop("disabled", !0), $("input[name='bet_m']", n.d).prop("disabled", !0), $("select[id='filter_num']", n.d).prop("disabled", !0), $("input[name='number']", n.d).prop("disabled", !0))
    });
    var r = {0: 3e5, 1: 3e5, 2: 5e3, 3: 3e5};

    function d(t) {
        -1 == (t = t || OPEN_STATUS) && (l(), t = OPEN_STATUS), n.timer_oddsloop && clearInterval(n.timer_oddsloop), n.timer_oddsloop = setInterval(function () {
            -1 !== t && l()
        }, r[t])
    }

    function l() {
        var e, i;
        n.stoploop || (t.ajaxcount = n.ajaxcount, s = {}, e = t.groupid, i = $.now(), G.get({
            url: G.action_odds, data: t, success: function (t) {
                doc.triggerHandler("getSystemSpeed", [i]), this.data.ajaxcount == n.ajaxcount && (t.Data.Period.PeriodStatus != OPEN_STATUS ? (doc.triggerHandler("update", [t.Data]), OPEN_STATUS = t.Data.Period.PeriodStatus, d(OPEN_STATUS), 2 == OPEN_STATUS ? (o.removeClass("close-handicap"), a.each(function (t, e) {
                    e.disabled = !1
                })) : (o.addClass("close-handicap"), a.each(function (t, e) {
                    e.disabled = !0
                }), $("select[id='filter_num']", n.d).prop("disabled", !0))) : (G.OpenTime && G.CloseTime ? G.OpenTime == t.Data.Period.OpenTime && G.CloseTime == t.Data.Period.CloseTime || (doc.triggerHandler("update", [t.Data]), G.OpenTime = t.Data.Period.OpenTime, G.CloseTime = t.Data.Period.CloseTime) : (G.OpenTime = t.Data.Period.OpenTime, G.CloseTime = t.Data.Period.CloseTime), t.Data.Period.StoppedIds = t.Data.Period.StoppedIds || [], $.each(t.Data.Period.StoppedIds, function (t, e) {
                    s[e] = !0
                }), $.each(n.array_bettypeid, function (t, e) {
                    s[t] && 0 == n.array_bettypeid[t] && 2 == OPEN_STATUS ? ($("input[bet_type_id='" + t + "']", n.d).length || $("input[bettypeid='" + t + "']", n.d).length) && ($("input[bet_type_id='" + t + "']", n.d).prop("disabled", !0), $("input[bet_type_id='" + t + "']", n.d).addClass("betstop"), $("input[bettypeid='" + t + "']", n.d).prop("disabled", !0), $("input[bettypeid='" + t + "']", n.d).addClass("betstop"), $("#betmoney", n.d).prop("disabled", !0), $("input[name='selectclass']", n.d).prop("disabled", !0), "zheng" !== n.id && ($("input[type='submit']", n.d).prop("disabled", !0), $("input.fn-reset", n.d).prop("disabled", !0)), $("input.fn_cancel_bet", n.d).prop("disabled", !0), $("input.fn_quick_bet", n.d).prop("disabled", !0), $("input[name='bet_money']", n.d).prop("disabled", !0), $("input.fn_radio_select", n.d).prop("disabled", !0), n.array_bettypeid[t] = !0, $("input[name='bet_m']", n.d).prop("disabled", !0), $("select[id='filter_num']", n.d).prop("disabled", !0)) : !s[t] && n.array_bettypeid[t] && 2 == OPEN_STATUS && ($("input[bet_type_id='" + t + "']", n.d).length || $("input[bettypeid='" + t + "']", n.d).length) && ($("input[bet_type_id='" + t + "']", n.d).prop("disabled", !1), $("input[bet_type_id='" + t + "']", n.d).removeClass("betstop"), $("input[bettypeid='" + t + "']", n.d).prop("disabled", !1), $("input[bettypeid='" + t + "']", n.d).removeClass("betstop"), $("#betmoney", n.d).prop("disabled", !1), $("input[name='selectclass']", n.d).prop("disabled", !1), "zheng" !== n.id && ($("input[type='submit']", n.d).prop("disabled", !1), $("input.fn-reset", n.d).prop("disabled", !1)), $("input.fn_cancel_bet", n.d).prop("disabled", !1), $("input.fn_quick_bet", n.d).prop("disabled", !1), $("input[name='bet_money']", n.d).prop("disabled", !1), $("input.fn_radio_select", n.d).prop("disabled", !1), n.array_bettypeid[t] = !1, $("input[name='bet_m']", n.d).prop("disabled", !1), $("select[id='filter_num']", n.d).prop("disabled", !1))
                }), t.Data.Odds[0].BetTypeId == n.data_odds[0].BetTypeId && (15 === e && G.format.banbo(t), 12 === e && updateGuoGuanOdds(t.Data.Odds), $.each(t.Data.Odds, function (t, e) {
                    e.Odds1 != n.data_odds[t].Odds1 && ($("#" + e.BetTypeId + "_" + e.BetItemId).html(e.Odds1).addClass("red").delay(4e3).queue(function () {
                        $(this).removeClass("red").dequeue()
                    }), $("[odds_id=" + e.BetTypeId + "_" + e.BetItemId + "]").html(e.Odds1)), e.Odds2 != n.data_odds[t].Odds2 && $("#" + e.BetTypeId + "_" + e.BetItemId + "_2").html(e.Odds2).addClass("red").delay(4e3).queue(function () {
                        $(this).removeClass("red").dequeue()
                    })
                }), n.data_odds = t.Data.Odds)))
            }, bussiness: function (t) {
                G.alertCount || (G.alertCount = 1, $.alert(t, function () {
                    location.href = "/Member/Login"
                })), n.timer_oddsloop && clearInterval(n.timer_oddsloop)
            }, complete: function () {
                n.ajaxcount++
            }
        }))
    }

    this.ajaxcount = this.ajaxcount || 0, d(-1), doc.on("req_update." + n.d[0].id, function () {
        d(-1)
    })
}

function updateGuoGuanOdds(n) {
    var s, t;
    1 < G.guoguanBall.length && n instanceof Array && (s = 1, $.each(G.billListGuoGuan, function (t, e) {
        for (var i = 0; i < n.length; i++) if (e.element.type_id == n[i].BetItemId) {
            s = s.multiply(n[i].Odds1), e.odds = n[i].Odds1;
            break
        }
    }), t = (t = $("input[name=bet_money]").val()).replace(/\,/g, ""), $("#total_odds").text(s.toFixedCut(3)), "" != t && /\d+/.test(t) && ((t = t.multiply(s)) > G.MAX_GUOGUAN_VALUE && (t = G.MAX_GUOGUAN_VALUE), $("#total_caijin").text(t.toFixedCut(3))))
}

function combin(t, e) {
    var o = [];
    return function a(t, e, i) {
        if (0 == i) return o.push(t);
        for (var n = 0, s = e.length; n <= s - i; n++) a(t.concat(e[n]), e.slice(n + 1), i - 1)
    }([], t, e), o
}

function arraymap(t, e) {
    for (var i, n = [], s = 0, o = t.length; s < o; s++) (i = e(t[s], s)) && n.push(i);
    return n
}

function arrayunique(t, e) {
    for (var i, n, s = 0, o = t.length, a = [], r = {}; s < o; s++) n = t[s], r[i = e ? e(n) : n] || (r[i] = !0, a.push(n));
    return a
}

function sort(t, e) {
    for (var i = [], n = 0, s = 0, o = t.length; !i[o - 1];) {
        for (s = n; t[s] && s <= o;) i.push(t[s]), s += e;
        n++
    }
    return i
}

function format_history(t) {
    var i = {TotalBetMoney: 0, TotalMemberAwardMoney: 0, TotalReturnWaterMoney: 0, TotalBalanceMoney: 0};
    $.each(t.Data.Details, function (t, e) {
        "已取消" != e.BetStatus && (i.TotalBetMoney = G.util.mathAdd(i.TotalBetMoney, e.BetMoney), i.TotalMemberAwardMoney = G.util.mathAdd(i.TotalMemberAwardMoney, e.MemberAwardMoney), i.TotalReturnWaterMoney = G.util.mathAdd(i.TotalReturnWaterMoney, e.ReturnWaterMoney), i.TotalBalanceMoney = G.util.mathAdd(i.TotalBalanceMoney, e.BalanceMoney)), e.showCombo = !!e.WithBetDetail
    }), t.SubTotal = i
}

function format_result(t) {
    return $.each(t.Data.DrawNumberList, function (t, e) {
        for (var i, n = 1; n < 8; n++) i = e["Code" + n], e["Code" + n] = 1 == i.toString().length ? "0" + i : i
    }), t
}

function format_betdetail(t) {
    var i = 0;
    return $.each(t.Data.Data, function (t, e) {
        "已取消" != e.BetStatus && (i += e.BetMoney)
    }), t.Data.SubTotalBetMoney = i, t
}

function format_update_maxlose(t) {
    return G.MAX_GUOGUAN_VALUE = t.Data, t
}

function BetHistoryDetail(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function BetDetail(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function BetDetailCom(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

!function (n) {
    var s, e, i, o, a, r, l, h, u, c, m = "now",
        t = n.support.boxSizing ? "" : "<iframe class='ifr-fix-ie6' frameborder='0'></iframe>",
        p = n('<dl class="boxDay" style="display:none">' + t + '<dt class="dt"><a class="l" href="#">◄</a><a class="r" href="#">►</a><b><span name="reyear"></span>年<span name="remouth"></span>月</b></dt><dd class="hd"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></dd><dd name="content" class="bd"></dd></dl>');
    n("body").append(p);
    var d, f, g = n("dd.bd", p), b = n(".dt span[name='reyear']", p), y = n(".dt span[name='remouth']", p);

    function _(t, e) {
        this.year = t, this.mouth = e, this.maxDay = function () {
            return new Date(this.year, this.mouth, 0).getDate()
        }, this.minDay = function () {
            return new Date(new Date(this.year, this.mouth, 0).setDate(1)).getDay()
        }
    }

    function v(t, e) {
        g.html(""), b.html(t), y.html(e);
        for (var i, n, s = new Date, o = "", a = 0, r = new _(t, e), d = 0; d <= r.maxDay() + r.minDay() - 1; d++) d >= r.minDay() ? (i = (a += 1) == u && t == l && e == h ? "on" : "", n = p.draw && p.draw[a] ? "draw" : "", a == s.getUTCDate() && t == s.getUTCFullYear() && e == s.getUTCMonth() + 1 ? o += '<a name="' + a + '" href="#" class="' + m + " " + i + " " + (n = "" !== n ? "draw roll" : "") + '">' + a + "</a>" : o += '<a name="' + a + '" href="#" class="' + i + " " + n + '">' + a + "</a>") : o += '<a href="javascript:void(0)" class="def"></a>';
        g.html(o), e = 1 == e.length ? "0" + e : e, c = t + "-" + e + "-", o = i = d = a = null
    }

    function $() {
        p.fadeOut("fast"), p.target = null, delete p.target
    }

    function G() {
        if (f) {
            for (var t = 0, e = f.length; t < e; t++) if (f[t].year == a && f[t].month == r) return 0;
            return 1
        }
    }

    p.on("click", ".bd a", function () {
        if (p.flag || p.draw) return n(this).hasClass("draw") && doc.triggerHandler("datedraw"), !1;
        var t = 1 == (t = n(this).attr("name")).length ? "0" + t : t;
        return n(this).addClass("on").siblings().removeClass("on"), n(p.target).val(c + t), p.on("hidden", $), clearTimeout(e), e = setTimeout(function () {
            clearTimeout(e), e = null, p.triggerHandler("hidden")
        }, 0), n(document).triggerHandler("datechange"), !1
    }), p.on("click", ".dt .l", function () {
        return p.flag = 1, clearTimeout(e), e = null, a = b.html(), 0 === (r = Number(y.html()) - 1) && (r = 12, a = Number(a) - 1), 1 == r.toString().length && (r = "0" + r), p.flag = G(), p.flag || (d ? d(a, r, function (t) {
            p.draw = t, v(a, r)
        }) : v(a, r)), !1
    }), p.on("click", ".dt .r", function () {
        return clearTimeout(e), e = null, a = b.html(), 13 === (r = Number(y.html()) + 1) && (r = 1, a = Number(a) + 1), 1 == r.toString().length && (r = "0" + r), p.flag = G(), p.flag || (d ? d(a, r, function (t) {
            p.draw = t, v(a, r)
        }) : v(a, r)), !1
    }), p.mouseenter(function () {
        i = 1, clearTimeout(e), e = null
    }).mouseleave(function () {
        p.flag || (i = 0, clearTimeout(e), e = setTimeout(function () {
            clearTimeout(e), e = null, p.triggerHandler("hidden")
        }, 1e3))
    }), p.on("show", function (t, e) {
        var i;
        o = /^\d{4}-\d{2}-\d{2}$/.test(e.value) ? e.value.split(/\D+/) : ((i = new Date).getFullYear() + "-" + (i.getMonth() + 1) + "-" + i.getDate()).split(/\D+/), l = o[0], h = o[1], u = o[2], v(l, h), "DIV" == e.tagName ? p.css({
            display: "",
            left: 0,
            top: 0
        }) : (s = n(e).offset(), p.css({left: s.left, top: s.top + 20}).fadeIn("fast"))
    }), n(document).on("datereset", function () {
        p.appendTo(document.body).css("display", "none"), p.flag = 0, delete p.draw
    }), n.fn.datepicker = function (t) {
        return this.each(function () {
            "DIV" == this.tagName ? (p.appendTo(this), p.flag = 1, p.draw = t.draw, m = t.cls_now || m, p.triggerHandler("show", [this]), d = t.clickCallback, f = t.availableMonths) : (m = "now", n(this).focus(function () {
                p.off("hidden", $), p.target = this, p.triggerHandler("show", [this])
            }).blur(function () {
                p.on("hidden", $), clearTimeout(e), i || (e = setTimeout(function () {
                    clearTimeout(e), e = null, p.triggerHandler("hidden")
                }, 0))
            }))
        })
    }
}(jQuery), function (a) {
    var r = a(document.body), t = a.support.boxSizing ? "" : "<iframe class='ifr-fix-ie6' frameborder='0'></iframe>",
        d = a("<div class='mask hide'>" + t + "</div>").appendTo(r);

    function l(o, t) {
        o.on("mousedown", t, function (t) {
            var e = o.offset().left, i = o.offset().top, n = t.clientX - e, s = t.clientY - i;
            doc.on("mousemove", function (t) {
                if (!(document.documentElement.clientWidth <= o.outerWidth() || document.documentElement.clientHeight <= o.height())) {
                    var e = t.clientX - n, t = t.clientY - s;
                    return o[0].setCapture && o[0].setCapture(), e < 0 ? e = 0 : e > document.documentElement.clientWidth - o.outerWidth() && (e = document.documentElement.clientWidth - o.outerWidth()), t < 0 ? t = 0 : t > document.documentElement.clientHeight - o.height() && (t = document.documentElement.clientHeight - o.height()), o.css({
                        left: e,
                        top: t
                    }), !1
                }
            }).on("mouseup", function () {
                o[0].releaseCapture && o[0].releaseCapture(), doc.off("mousemove").off("mouseup")
            })
        })
    }

    function n(t) {
        var e, n = this, s = a.now(), i = null, o = "";
        t = a.isPlainObject(t) ? t : {}, this.settings = {
            title: "弹出框",
            cls: "",
            html: "",
            button: [],
            bind: Loader.prototype.bind,
            unbind: Loader.prototype.unbind,
            closeBtn: !0
        }, i = a.extend({}, this.settings, t), str_closeBtn = i.closeBtn ? '<a href="javascript:void(0)" class="btn-close fn-close">×</a>' : "", a(i.button).each(function (t) {
            o += '<input type="button" id="' + (0 === t ? "save" : "cancel") + '" value="' + this + '" class="' + (0 === t ? "btn red" : "btn") + '" />'
        }), this.body = a('<div id="dialog-' + s + '" class="g-dialog ' + i.cls + ' hide"><div class="dialog-hd"><div class="title fl">' + i.title + '</div><div class="fr">' + str_closeBtn + '</div></div><div class="dialog-bd">' + i.html + '</div><div class="dialog-ft">' + o + "</div></div>"), this.body.on("click", ".fn-close", function () {
            i.closeCallback = null, i.cancelCallback = null, n.close()
        }), this.body.on("click", ".dialog-ft input", function (t) {
            "save" === this.id ? e = i.closeCallback || a.noop : "cancel" === this.id && (e = i.cancelCallback || a.noop), !1 !== e.call(n, this) && n.close()
        }), doc.on("dialog.dialog-" + s, function (t, e, i) {
            "close" == i && e == s && n.close()
        }), this.open = function () {
            d.removeClass("hide"), this.body.css("width", i.width || 600).appendTo(r).removeClass("hide").css({
                width: i.width || 600,
                left: i.left || a(window).width() / 2 - n.body.width() / 2,
                top: i.top || (a(window).height() - n.body.height()) / 2
            }), d.insertBefore(this.body), i.bind(this.body, t.jsondata), G.dialog.push(this), l(this.body, ".dialog-hd"), a.isFunction(i.openCallback) && i.openCallback(), o && setTimeout(function () {
                a(".dialog-ft :button:first", this.body).focus()
            }, 0)
        }, this.close = function () {
            var t;
            doc.off("dialog.dialog-" + s), i.unbind(this.body), this.body.off().remove(), t = a.inArray(this, G.dialog), G.dialog.splice(t, 1), G.dialog.length ? d.insertBefore(G.dialog[G.dialog.length - 1].body) : d.addClass("hide")
        }, this.open()
    }

    a.dialog = function (i) {
        (i = a.isPlainObject(i) ? i : {}).isTemplateCompilered ? new n(i) : G.util.load({
            module: i.module,
            param: i.param,
            html: i.html,
            json: i.json,
            jsonSuccess: i.jsonSuccess,
            success: function (t, e) {
                i.html = t, i.jsondata = e, new n(i)
            }
        })
    }, a.alert = function (t, e) {
        a.dialog({
            title: "提示",
            html: "<div>" + t + "</div>",
            closeCallback: e,
            button: ["确定"],
            width: 350,
            cls: "g-alert",
            top: 200,
            closeBtn: !1
        })
    }, a.confirm = function (t, e, i) {
        a.dialog({
            title: "确认",
            html: "<div>" + t + "</div>",
            closeCallback: e,
            cancelCallBack: i,
            button: ["确定", "取消"],
            width: 350,
            cls: "g-confirm",
            top: 200,
            closeBtn: !1
        })
    }, window.drag = l
}(jQuery), function (s, i) {
    var t, n, o, e, a, r, d, l = "hashchange", h = document, u = s.event.special, c = h.documentMode,
        m = "on" + l in i && (void 0 === c || 7 < c);

    function p(t) {
        return "#" + (t = t || location.href).replace(/^[^#]*#?(.*)$/, "$1")
    }

    function f() {
        var t = p(), e = d(a);
        t !== a ? (r(a = t, e), s(i).trigger(l)) : e !== a && (location.href = location.href.replace(/#.*/, "") + e), n = setTimeout(f, s.fn[l].delay)
    }

    s.fn[l] = function (t) {
        return t ? this.bind(l, t) : this.trigger(l)
    }, s.fn[l].delay = 50, u[l] = s.extend(u[l], {
        setup: function () {
            if (m) return !1;
            s(t.start)
        }, teardown: function () {
            if (m) return !1;
            s(t.stop)
        }
    }), c = {}, a = p(), d = r = u = function (t) {
        return t
    }, c.start = function () {
        n || f()
    }, c.stop = function () {
        n && clearTimeout(n), n = void 0
    }, function () {
        for (var t = 3, e = document.createElement("div"), i = e.getElementsByTagName("i"); e.innerHTML = "\x3c!--[if gt IE " + ++t + "]><i></i><![endif]--\x3e", i[0];) ;
        return 4 < t ? t : void 0
    }() && !m && (c.start = function () {
        o || (e = (e = s.fn[l].src) && e + p(), o = s('<iframe tabindex="-1" title="empty"/>').hide().one("load", function () {
            e || r(p()), f()
        }).attr("src", e || "javascript:0").insertAfter("body")[0].contentWindow, h.onpropertychange = function () {
            try {
                "title" === event.propertyName && (o.document.title = h.title)
            } catch (t) {
            }
        })
    }, c.stop = u, d = function () {
        return p(o.location.href)
    }, r = function (t, e) {
        var i = o.document, n = s.fn[l].domain;
        t !== e && (i.title = h.title, i.open(), n && i.write('<script>document.domain="' + n + '"<\/script>'), i.close(), o.location.hash = t)
    }), t = c
}(jQuery, this), function (a) {
    var t = a("<iframe src='/All/domain.html' style='width:0; height:0' frameborder='0'></iframe>").appendTo(document.body)[0],
        i = 0, e = "iframe", n = "popup", s = "loose", o = "html5", r = {
            mode: e,
            standard: o,
            popHt: 500,
            popWd: 400,
            popX: 200,
            popY: 200,
            popTitle: "",
            popClose: !1,
            extraCss: "",
            extraHead: "",
            retainAttr: ["id", "class", "style"]
        }, d = {};
    a.fn.printArea = function (t) {
        a.extend(d, r, t), i++;
        t = "printArea_";
        a("[id^=" + t + "]").remove(), d.id = t + i;
        var t = a(this), e = l.getPrintWindow();
        l.write(e.doc, t), setTimeout(function () {
            l.print(e)
        }, 1e3)
    };
    var l = {
        print: function (t) {
            var e = t.win, i = t.doc;
            a(t.doc).ready(function () {
                e.focus(), 0 <= navigator.userAgent.indexOf("Firefox") ? e.print() : i.execCommand("print", !1, null), d.mode == n && d.popClose && setTimeout(function () {
                    e.close()
                }, 2e3)
            })
        }, write: function (t, e) {
            t.open(), t.write(l.docType() + "<html>" + l.getHead() + l.getBody(e) + "</html>"), t.close()
        }, docType: function () {
            return d.mode == e ? "" : d.standard == o ? "<!DOCTYPE html>" : '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + (d.standard == s ? " Transitional" : "") + '//EN" "http://www.w3.org/TR/html4/' + (d.standard == s ? "loose" : "strict") + '.dtd">'
        }, getHead: function () {
            var e = "", i = "";
            return d.extraHead && d.extraHead.replace(/([^,]+)/g, function (t) {
                e += t
            }), a(document).find("link").filter(function () {
                var t = a(this).attr("rel");
                return "undefined" === a.type(t) == 0 && "stylesheet" == t.toLowerCase()
            }).filter(function () {
                var t = a(this).attr("media");
                return "undefined" === a.type(t) || "" == t || "print" == t.toLowerCase() || "all" == t.toLowerCase()
            }).each(function () {
                i += '<link type="text/css" rel="stylesheet" href="' + a(this).attr("href") + '" >'
            }), d.extraCss && d.extraCss.replace(/([^,\s]+)/g, function (t) {
                i += '<link type="text/css" rel="stylesheet" href="' + t + '">'
            }), "<head><script>document.domain=document.domain<\/script><title>" + d.popTitle + "</title>" + e + i + "</head>"
        }, getBody: function (t) {
            var s = "", o = d.retainAttr;
            return t.each(function () {
                for (var t = l.getFormData(a(this)), e = "", i = 0; i < o.length; i++) {
                    var n = a(t).attr(o[i]);
                    n && (e += (0 < e.length ? " " : "") + o[i] + "='" + n + "'")
                }
                s += "<div " + e + ">" + a(t).html() + "</div>"
            }), "<body style='overflow:visible; height:auto;'>" + s + "</body>"
        }, getFormData: function (t) {
            var e = t.clone(), n = a("input,select,textarea", e);
            return a("input,select,textarea", t).each(function (t) {
                var e = a(this).attr("type");
                "undefined" === a.type(e) && (e = a(this).is("select") ? "select" : a(this).is("textarea") ? "textarea" : "");
                var i = n.eq(t);
                "radio" == e || "checkbox" == e ? i.attr("checked", a(this).is(":checked")) : "text" == e || "" == e ? i.attr("value", a(this).val()) : "select" == e ? a(this).find("option").each(function (t) {
                    a(this).is(":selected") && a("option", i).eq(t).attr("selected", !0)
                }) : "textarea" == e && i.text(a(this).val())
            }), e
        }, getPrintWindow: function () {
            switch (d.mode) {
                case e:
                    var t = l.Iframe();
                    return {win: t.contentWindow || t, doc: t.doc};
                case n:
                    t = new l.Popup;
                    return {win: t, doc: t.doc}
            }
        }, Iframe: function () {
            return t.doc = t.contentWindow.document, t
        }, Popup: function () {
            var t = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
            t += ",width=" + d.popWd + ",height=" + d.popHt, t += ",resizable=yes,screenX=" + d.popX + ",screenY=" + d.popY + ",personalbar=no,scrollbars=yes";
            t = window.open("", "_blank", t);
            return t.doc = t.document, t
        }
    }
}(jQuery), function (c) {
    var m, p, f = c('<div><div class="hd"></div><div class="bd"></div><div class="ft bb"></div></div>'),
        e = {position: "auto", cls: "module g-tl", sticky: !1}, g = c(".bd", f), b = c(".ft", f), y = c(document),
        _ = "tooltip" + (new Date).getTime();
    c("body").append(f), c.fn.tooltip = function (h) {
        var t, u = this;
        return h.time || (h.time = 5e3), u[0] && h.html && (t = function () {
            p && (clearTimeout(p), p = null), f[0].className = h.cls, h.isSelect && u[0].select(), f.css({
                left: 0,
                top: "-200px",
                display: "block"
            }), h.width && f.css({width: h.width}), g[0].innerHTML = h.html, b.removeAttr("style"), "left" != h.position && "right" != h.position || (b[0].className = "ft bl"), m && (y.unbind("." + _), m.unbind("." + _)), m = c(u[0]);
            var t, e = y.width(), i = y.height(), n = m.offset(), s = g.outerWidth(), o = g.outerHeight(),
                a = b.height(), r = b.width(), d = m.outerHeight(), l = m.outerWidth();
            switch ("auto" == h.position && (b[0].className = "ft bb", o + a > n.top ? h.position = "bottom" : h.position = "top"), h.position) {
                case"top":
                    b[0].className = "ft bb", 0 < (t = n.left + s - e + 5) ? (f.css({
                        left: n.left - t,
                        top: n.top - o - a
                    }), b.css({left: t + 5})) : f.css({left: n.left, top: n.top - o - a});
                    break;
                case"bottom":
                    b[0].className = "ft bt", 0 < (t = n.left + s - e + 5) ? (f.css({
                        left: n.left - t,
                        top: n.top + d + a
                    }), b.css({left: t + 5})) : f.css({left: n.left, top: n.top + d + a});
                    break;
                case"right":
                    b[0].className = "ft bl", 0 < (t = n.top + o - i + 5) ? (f.css({
                        left: n.left + l + r,
                        top: n.top - t
                    }), b.css({top: t + 5})) : f.css({left: n.left + l + r, top: n.top});
                    break;
                case"left":
                    b[0].className = "ft br", 0 < (t = n.top + o - i + 5) ? (f.css({
                        left: n.left - s - r,
                        top: n.top - t
                    }), b.css({top: t + 5})) : f.css({left: n.left - s - r, top: n.top});
                    break;
                default:
                    return void f.css({display: "none"})
            }
            h.sticky || (m.bind("mouseout." + _, function (t) {
                this === t.target && (f.css({display: "none"}), m.unbind("." + _))
            }), y.bind("keyup." + _, function (t) {
                var e = t.target.tagName;
                13 != t.keyCode && ("INPUT" != e && "BUTTON" != e && "TEXTAREA" != e || f.css({display: "none"}))
            })), y.one("mousedown." + _, function () {
                f.css({display: "none"})
            }), c(u[0]).blur(function () {
                f.css({display: "none"})
            }).mouseleave(function () {
                f.css({display: "none"})
            }), p = setTimeout(function () {
                clearTimeout(p), p = null, f.css({display: "none"})
            }, h.time)
        }, (h = c.extend({}, e, h)).isFocus && u[0].focus(), t()), u
    }
}(jQuery), function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}(function (l) {
    l.extend(l.fn, {
        validate: function (t) {
            if (this.length) {
                var n = l.data(this[0], "validator");
                return n ? n : (this.attr("novalidate", "novalidate"), n = new l.validator(t, this[0]), l.data(this[0], "validator", n), n.settings.onsubmit && (this.on("click.validate", ":submit", function (t) {
                    n.settings.submitHandler && (n.submitButton = t.target), l(this).hasClass("cancel") && (n.cancelSubmit = !0), l(this).attr("formnovalid") !== undefined && (n.cancelSubmit = !0)
                }), this.on("submit.validate", function (i) {
                    function t() {
                        var t, e;
                        return !n.settings.submitHandler || (n.submitButton && (t = l("<input type='hidden'/>").attr("name", n.submitButton.name).val(l(n.submitButton).val()).appendTo(n.currentForm)), e = n.settings.submitHandler.call(n, n.currentForm, i), n.submitButton && t.remove(), e !== undefined && e)
                    }

                    return n.settings.debug && i.preventDefault(), n.cancelSubmit ? (n.cancelSubmit = !1, t()) : n.form() ? n.pendingRequest ? !(n.formSubmitted = !0) : t() : (n.focusInvalid(), !1)
                })), n)
            }
            t && t.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing.")
        }, valid: function () {
            var t, e, i;
            return l(this[0]).is("form") ? t = this.validate().form() : (i = [], t = !0, e = l(this[0].form).validate(), this.each(function () {
                t = e.element(this) && t, i = i.concat(e.errorList)
            }), e.errorList = i), t
        }, rules: function (t, e) {
            var i, n, s, o, a, r = this[0];
            if (t) switch (s = (i = l.data(r.form, "validator").settings).rules, n = l.validator.staticRules(r), t) {
                case"add":
                    l.extend(n, l.validator.normalizeRule(e)), delete n.messages, s[r.name] = n, e.messages && (i.messages[r.name] = l.extend(i.messages[r.name], e.messages));
                    break;
                case"remove":
                    return e ? (a = {}, l.each(e.split(/\s/), function (t, e) {
                        a[e] = n[e], delete n[e], "required" === e && l(r).removeAttr("aria-required")
                    }), a) : (delete s[r.name], n)
            }
            return (s = l.validator.normalizeRules(l.extend({}, l.validator.classRules(r), l.validator.attributeRules(r), l.validator.dataRules(r), l.validator.staticRules(r)), r)).required && (o = s.required, delete s.required, s = l.extend({required: o}, s), l(r).attr("aria-required", "true")), s.remote && (o = s.remote, delete s.remote, s = l.extend(s, {remote: o})), s
        }
    }), l.extend(l.expr[":"], {
        blank: function (t) {
            return !l.trim("" + l(t).val())
        }, filled: function (t) {
            return !!l.trim("" + l(t).val())
        }, unchecked: function (t) {
            return !l(t).prop("checked")
        }
    }), l.validator = function (t, e) {
        this.settings = l.extend(!0, {}, l.validator.defaults, t), this.currentForm = e, this.init()
    }, l.validator.format = function (i, t) {
        return 1 === arguments.length ? function () {
            var t = l.makeArray(arguments);
            return t.unshift(i), l.validator.format.apply(this, t)
        } : (2 < arguments.length && t.constructor !== Array && (t = l.makeArray(arguments).slice(1)), t.constructor !== Array && (t = [t]), l.each(t, function (t, e) {
            i = i.replace(new RegExp("\\{" + t + "\\}", "g"), function () {
                return e
            })
        }), i)
    }, l.extend(l.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusCleanup: !1,
            focusInvalid: !0,
            errorContainer: l([]),
            errorLabelContainer: l([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function (t) {
                this.lastActive = t, this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass), this.hideThese(this.errorsFor(t)))
            },
            onfocusout: function (t) {
                this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t)
            },
            onkeyup: function (t, e) {
                9 === e.which && "" === this.elementValue(t) || -1 !== l.inArray(e.keyCode, [16, 17, 18, 20, 35, 36, 37, 38, 39, 40, 45, 144, 225]) || (t.name in this.submitted || t === this.lastElement) && this.element(t)
            },
            onclick: function (t) {
                t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode)
            },
            highlight: function (t, e, i) {
                ("radio" === t.type ? this.findByName(t.name) : l(t)).addClass(e).removeClass(i)
            },
            unhighlight: function (t, e, i) {
                ("radio" === t.type ? this.findByName(t.name) : l(t)).removeClass(e).addClass(i)
            }
        },
        setDefaults: function (t) {
            l.extend(l.validator.defaults, t)
        },
        messages: {
            required: "该项不能为空",
            remote: "请修正此字段",
            email: "请输入有效的电子邮件地址",
            url: "请输入有效的网址",
            date: "请输入有效的日期",
            dateISO: "请输入有效的日期 (YYYY-MM-DD)",
            number: "请输入有效的数字",
            digits: "只能输入非负整数",
            creditcard: "请输入有效的信用卡号码",
            equalTo: "你的输入不相同",
            extension: "请输入有效的后缀",
            maxlength: l.validator.format("最多可以输入 {0} 个字符"),
            minlength: l.validator.format("最少要输入 {0} 个字符"),
            rangelength: l.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
            range: l.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
            max: l.validator.format("请输入不大于 {0} 的数值"),
            min: l.validator.format("请输入不小于 {0} 的数值")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function () {
                this.labelContainer = l(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || l(this.currentForm), this.containers = l(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
                var i, n = this.groups = {};

                function t(t) {
                    var e = l.data(this.form, "validator"), i = "on" + t.type.replace(/^validate/, ""), n = e.settings;
                    n[i] && !l(this).is(n.ignore) && n[i].call(e, this, t)
                }

                l.each(this.settings.groups, function (i, t) {
                    "string" == typeof t && (t = t.split(/\s/)), l.each(t, function (t, e) {
                        n[e] = i
                    })
                }), i = this.settings.rules, l.each(i, function (t, e) {
                    i[t] = l.validator.normalizeRule(e)
                }), l(this.currentForm).on("focusin.validate focusout.validate keyup.validate", ":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'], [type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", t).on("click.validate", "select, option, [type='radio'], [type='checkbox']", t), this.settings.invalidHandler && l(this.currentForm).on("invalid-form.validate", this.settings.invalidHandler), l(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            }, form: function () {
                return this.checkForm(), l.extend(this.submitted, this.errorMap), this.invalid = l.extend({}, this.errorMap), this.valid() || l(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
            }, checkForm: function () {
                this.prepareForm();
                for (var t = 0, e = this.currentElements = this.elements(); e[t]; t++) this.check(e[t]);
                return this.valid()
            }, element: function (t) {
                var e = this.clean(t), i = this.validationTargetFor(e), n = !0;
                return (this.lastElement = i) === undefined ? delete this.invalid[e.name] : (this.prepareElement(i), this.currentElements = l(i), (n = !1 !== this.check(i)) ? delete this.invalid[i.name] : this.invalid[i.name] = !0), l(t).attr("aria-invalid", !n), this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), n
            }, showErrors: function (e) {
                if (e) {
                    for (var t in l.extend(this.errorMap, e), this.errorList = [], e) this.errorList.push({
                        message: e[t],
                        element: this.findByName(t)[0]
                    });
                    this.successList = l.grep(this.successList, function (t) {
                        return !(t.name in e)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            }, resetForm: function () {
                l.fn.resetForm && l(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors();
                var t, e = this.elements().removeData("previousValue").removeAttr("aria-invalid");
                if (this.settings.unhighlight) for (t = 0; e[t]; t++) this.settings.unhighlight.call(this, e[t], this.settings.errorClass, ""); else e.removeClass(this.settings.errorClass)
            }, numberOfInvalids: function () {
                return this.objectLength(this.invalid)
            }, objectLength: function (t) {
                var e, i = 0;
                for (e in t) i++;
                return i
            }, hideErrors: function () {
                this.hideThese(this.toHide)
            }, hideThese: function (t) {
                t.not(this.containers).text(""), this.addWrapper(t).hide()
            }, valid: function () {
                return 0 === this.size()
            }, size: function () {
                return this.errorList.length
            }, focusInvalid: function () {
                if (this.settings.focusInvalid) try {
                    l(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                } catch (t) {
                }
            }, findLastActive: function () {
                var e = this.lastActive;
                return e && 1 === l.grep(this.errorList, function (t) {
                    return t.element.name === e.name
                }).length && e
            }, elements: function () {
                var t = this, e = {};
                return l(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, :disabled").not(this.settings.ignore).filter(function () {
                    return !this.name && t.settings.debug && window.console && console.error("%o has no name assigned", this), !(this.name in e || !t.objectLength(l(this).rules())) && (e[this.name] = !0)
                })
            }, clean: function (t) {
                return l(t)[0]
            }, errors: function () {
                var t = this.settings.errorClass.split(" ").join(".");
                return l(this.settings.errorElement + "." + t, this.errorContext)
            }, reset: function () {
                this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = l([]), this.toHide = l([]), this.currentElements = l([])
            }, prepareForm: function () {
                this.reset(), this.toHide = this.errors().add(this.containers)
            }, prepareElement: function (t) {
                this.reset(), this.toHide = this.errorsFor(t)
            }, elementValue: function (t) {
                var e = l(t), i = t.type;
                return "radio" === i || "checkbox" === i ? this.findByName(t.name).filter(":checked").val() : "number" === i && "undefined" != typeof t.validity ? !t.validity.badInput && e.val() : "string" == typeof (e = e.val()) ? e.replace(/\r/g, "") : e
            }, check: function (t) {
                t = this.validationTargetFor(this.clean(t));
                var e, i, n, s = l(t).rules(), o = l.map(s, function (t, e) {
                    return e
                }).length, a = !1, r = this.elementValue(t);
                for (i in s) {
                    n = {method: i, parameters: s[i]};
                    try {
                        if ("dependency-mismatch" === (e = l.validator.methods[i].call(this, r, t, n.parameters)) && 1 === o) {
                            a = !0;
                            continue
                        }
                        if (a = !1, "pending" === e) return void (this.toHide = this.toHide.not(this.errorsFor(t)));
                        if (!e) return this.formatAndAdd(t, n), !1
                    } catch (d) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + t.id + ", check the '" + n.method + "' method.", d), d instanceof TypeError && (d.message += ".  Exception occurred when checking element " + t.id + ", check the '" + n.method + "' method."), d
                    }
                }
                if (!a) return this.objectLength(s) && this.successList.push(t), !0
            }, customDataMessage: function (t, e) {
                return l(t).data("msg" + e.charAt(0).toUpperCase() + e.substring(1).toLowerCase()) || l(t).data("msg")
            }, customMessage: function (t, e) {
                t = this.settings.messages[t];
                return t && (t.constructor === String ? t : t[e])
            }, findDefined: function () {
                for (var t = 0; t < arguments.length; t++) if (arguments[t] !== undefined) return arguments[t];
                return undefined
            }, defaultMessage: function (t, e) {
                return this.findDefined(this.customMessage(t.name, e), this.customDataMessage(t, e), !this.settings.ignoreTitle && t.title || undefined, l.validator.messages[e], "<strong>Warning: No message defined for " + t.name + "</strong>")
            }, formatAndAdd: function (t, e) {
                var i = this.defaultMessage(t, e.method), n = /\$?\{(\d+)\}/g;
                "function" == typeof i ? i = i.call(this, e.parameters, t) : n.test(i) && (i = l.validator.format(i.replace(n, "{$1}"), e.parameters)), this.errorList.push({
                    message: i,
                    element: t,
                    method: e.method
                }), this.errorMap[t.name] = i, this.submitted[t.name] = i
            }, addWrapper: function (t) {
                return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))), t
            }, defaultShowErrors: function () {
                for (var t, e, i = 0; this.errorList[i]; i++) e = this.errorList[i], this.settings.highlight && this.settings.highlight.call(this, e.element, this.settings.errorClass, this.settings.validClass), this.showLabel(e.element, e.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)), this.settings.success) for (i = 0; this.successList[i]; i++) this.showLabel(this.successList[i]);
                if (this.settings.unhighlight) for (i = 0, t = this.validElements(); t[i]; i++) this.settings.unhighlight.call(this, t[i], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
            }, validElements: function () {
                return this.currentElements.not(this.invalidElements())
            }, invalidElements: function () {
                return l(this.errorList).map(function () {
                    return this.element
                })
            }, showLabel: function (t, e) {
                var i, n, s = this.errorsFor(t), o = this.idOrName(t), a = l(t).attr("aria-describedby");
                s.length ? (s.removeClass(this.settings.validClass).addClass(this.settings.errorClass), s.html(e)) : (i = s = l("<" + this.settings.errorElement + ">").attr("id", o + "-error").addClass(this.settings.errorClass).html(e || ""), this.settings.wrapper && (i = s.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.length ? this.labelContainer.append(i) : this.settings.errorPlacement ? this.settings.errorPlacement(i, l(t)) : i.insertAfter(t), s.is("label") ? s.attr("for", o) : 0 === s.parents("label[for='" + o + "']").length && (o = s.attr("id").replace(/(:|\.|\[|\]|\$)/g, "\\$1"), a ? a.match(new RegExp("\\b" + o + "\\b")) || (a += " " + o) : a = o, l(t).attr("aria-describedby", a), (n = this.groups[t.name]) && l.each(this.groups, function (t, e) {
                    e === n && l("[name='" + t + "']", this.currentForm).attr("aria-describedby", s.attr("id"))
                }))), !e && this.settings.success && (s.text(""), "string" == typeof this.settings.success ? s.addClass(this.settings.success) : this.settings.success(s, t)), this.toShow = this.toShow.add(s)
            }, errorsFor: function (t) {
                var e = this.idOrName(t), t = l(t).attr("aria-describedby"),
                    e = "label[for='" + e + "'], label[for='" + e + "'] *";
                return t && (e = e + ", #" + t.replace(/\s+/g, ", #")), this.errors().filter(e)
            }, idOrName: function (t) {
                return this.groups[t.name] || !this.checkable(t) && t.id || t.name
            }, validationTargetFor: function (t) {
                return this.checkable(t) && (t = this.findByName(t.name)), l(t).not(this.settings.ignore)[0]
            }, checkable: function (t) {
                return /radio|checkbox/i.test(t.type)
            }, findByName: function (t) {
                return l(this.currentForm).find("[name='" + t + "']")
            }, getLength: function (t, e) {
                switch (e.nodeName.toLowerCase()) {
                    case"select":
                        return l("option:selected", e).length;
                    case"input":
                        if (this.checkable(e)) return this.findByName(e.name).filter(":checked").length
                }
                return t.length
            }, depend: function (t, e) {
                return !this.dependTypes["type_" + typeof t] || this.dependTypes["type_" + typeof t](t, e)
            }, dependTypes: {
                type_boolean: function (t) {
                    return t
                }, type_string: function (t, e) {
                    return !!l(t, e.form).length
                }, type_function: function (t, e) {
                    return t(e)
                }
            }, optional: function (t) {
                var e = this.elementValue(t);
                return !l.validator.methods.required.call(this, e, t) && !/^\s+$/.test(e)
            }, startRequest: function (t) {
                this.pending[t.name] || (this.pendingRequest++, this.pending[t.name] = !0)
            }, stopRequest: function (t, e) {
                this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[t.name], e && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (l(this.currentForm).submit(), this.formSubmitted = !1) : !e && 0 === this.pendingRequest && this.formSubmitted && (l(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
            }, previousValue: function (t) {
                return l.data(t, "previousValue") || l.data(t, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(t, "remote")
                })
            }, destroy: function () {
                this.resetForm(), l(this.currentForm).off(".validate").removeData("validator")
            }
        },
        classRuleSettings: {
            required: {required: !0},
            email: {email: !0},
            url: {url: !0},
            date: {date: !0},
            dateISO: {dateISO: !0},
            number: {number: !0},
            digits: {digits: !0},
            creditcard: {creditcard: !0}
        },
        addClassRules: function (t, e) {
            t.constructor === String ? this.classRuleSettings[t] = e : l.extend(this.classRuleSettings, t)
        },
        classRules: function (t) {
            var e = {}, t = l(t).attr("class");
            return t && l.each(t.split(" "), function () {
                this in l.validator.classRuleSettings && l.extend(e, l.validator.classRuleSettings[this])
            }), e
        },
        normalizeAttributeRule: function (t, e, i, n) {
            /min|max/.test(i) && (null === e || /number|range|text/.test(e)) && (n = Number(n), isNaN(n) && (n = undefined)), n || 0 === n ? t[i] = n : e === i && "range" !== e && (t[i] = !0)
        },
        attributeRules: function (t) {
            var e, i, n = {}, s = l(t), o = t.getAttribute("type");
            for (e in l.validator.methods) i = "required" === e ? ("" === (i = t.getAttribute(e)) && (i = !0), !!i) : s.attr(e), this.normalizeAttributeRule(n, o, e, i);
            return n.maxlength && /-1|2147483647|524288/.test(n.maxlength) && delete n.maxlength, n
        },
        dataRules: function (t) {
            var e, i, n = {}, s = l(t), o = t.getAttribute("type");
            for (e in l.validator.methods) i = s.data("rule" + e.charAt(0).toUpperCase() + e.substring(1).toLowerCase()), this.normalizeAttributeRule(n, o, e, i);
            return n
        },
        staticRules: function (t) {
            var e = {}, i = l.data(t.form, "validator");
            return i.settings.rules && (e = l.validator.normalizeRule(i.settings.rules[t.name]) || {}), e
        },
        normalizeRules: function (n, s) {
            return l.each(n, function (t, e) {
                if (!1 !== e) {
                    if (e.param || e.depends) {
                        var i = !0;
                        switch (typeof e.depends) {
                            case"string":
                                i = !!l(e.depends, s.form).length;
                                break;
                            case"function":
                                i = e.depends.call(s, s)
                        }
                        i ? n[t] = e.param === undefined || e.param : delete n[t]
                    }
                } else delete n[t]
            }), l.each(n, function (t, e) {
                n[t] = l.isFunction(e) ? e(s) : e
            }), l.each(["minlength", "maxlength"], function () {
                n[this] && (n[this] = Number(n[this]))
            }), l.each(["rangelength", "range"], function () {
                var t;
                n[this] && (l.isArray(n[this]) ? n[this] = [Number(n[this][0]), Number(n[this][1])] : "string" == typeof n[this] && (t = n[this].replace(/[\[\]]/g, "").split(/[\s,]+/), n[this] = [Number(t[0]), Number(t[1])]))
            }), l.validator.autoCreateRanges && (null != n.min && null != n.max && (n.range = [n.min, n.max], delete n.min, delete n.max), null != n.minlength && null != n.maxlength && (n.rangelength = [n.minlength, n.maxlength], delete n.minlength, delete n.maxlength)), n
        },
        normalizeRule: function (t) {
            var e;
            return "string" == typeof t && (e = {}, l.each(t.split(/\s/), function () {
                e[this] = !0
            }), t = e), t
        },
        addMethod: function (t, e, i) {
            l.validator.methods[t] = e, l.validator.messages[t] = i !== undefined ? i : l.validator.messages[t], e.length < 3 && l.validator.addClassRules(t, l.validator.normalizeRule(t))
        },
        methods: {
            required: function (t, e, i) {
                if (!this.depend(i, e)) return "dependency-mismatch";
                if ("select" !== e.nodeName.toLowerCase()) return this.checkable(e) ? 0 < this.getLength(t, e) : 0 < l.trim(t).length;
                e = l(e).val();
                return e && 0 < e.length
            }, email: function (t, e) {
                return this.optional(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t)
            }, url: function (t, e) {
                return this.optional(e) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(t)
            }, date: function (t, e) {
                return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString())
            }, dateISO: function (t, e) {
                return this.optional(e) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t)
            }, number: function (t, e) {
                return this.optional(e) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
            }, digits: function (t, e) {
                return this.optional(e) || /^\d+$/.test(t)
            }, creditcard: function (t, e) {
                if (this.optional(e)) return "dependency-mismatch";
                if (/[^0-9 \-]+/.test(t)) return !1;
                var i, n, s = 0, o = 0, a = !1;
                if ((t = t.replace(/\D/g, "")).length < 13 || 19 < t.length) return !1;
                for (i = t.length - 1; 0 <= i; i--) n = t.charAt(i), o = parseInt(n, 10), a && 9 < (o *= 2) && (o -= 9), s += o, a = !a;
                return s % 10 == 0
            }, minlength: function (t, e, i) {
                t = l.isArray(t) ? t.length : this.getLength(t, e);
                return this.optional(e) || i <= t
            }, maxlength: function (t, e, i) {
                t = l.isArray(t) ? t.length : this.getLength(t, e);
                return this.optional(e) || t <= i
            }, rangelength: function (t, e, i) {
                t = l.isArray(t) ? t.length : this.getLength(t, e);
                return this.optional(e) || t >= i[0] && t <= i[1]
            }, min: function (t, e, i) {
                return this.optional(e) || i <= t
            }, max: function (t, e, i) {
                return this.optional(e) || t <= i
            }, range: function (t, e, i) {
                return this.optional(e) || t >= i[0] && t <= i[1]
            }, equalTo: function (t, e, i) {
                i = l(i);
                return this.settings.onfocusout && i.off(".validate-equalTo").on("blur.validate-equalTo", function () {
                    l(e).valid()
                }), t === i.val()
            }, remote: function (n, s, t) {
                if (this.optional(s)) return "dependency-mismatch";
                var o, e, a = this.previousValue(s);
                return this.settings.messages[s.name] || (this.settings.messages[s.name] = {}), a.originalMessage = this.settings.messages[s.name].remote, this.settings.messages[s.name].remote = a.message, t = "string" == typeof t ? {url: t} : t, a.old === n ? a.valid : (a.old = n, (o = this).startRequest(s), (e = {})[s.name] = n, l.ajax(l.extend(!0, {
                    mode: "abort",
                    port: "validate" + s.name,
                    dataType: "json",
                    data: e,
                    context: o.currentForm,
                    success: function (t) {
                        var e, i = !0 === t || "true" === t;
                        o.settings.messages[s.name].remote = a.originalMessage, i ? (e = o.formSubmitted, o.prepareElement(s), o.formSubmitted = e, o.successList.push(s), delete o.invalid[s.name], o.showErrors()) : (e = {}, t = t || o.defaultMessage(s, "remote"), e[s.name] = a.message = l.isFunction(t) ? t(n) : t, o.invalid[s.name] = !0, o.showErrors(e)), a.valid = i, o.stopRequest(s, i)
                    }
                }, t)), "pending")
            }
        }
    });
    var n, s = {};
    l.ajaxPrefilter ? l.ajaxPrefilter(function (t, e, i) {
        var n = t.port;
        "abort" === t.mode && (s[n] && s[n].abort(), s[n] = i)
    }) : (n = l.ajax, l.ajax = function (t) {
        var e = ("mode" in t ? t : l.ajaxSettings).mode, i = ("port" in t ? t : l.ajaxSettings).port;
        return "abort" === e ? (s[i] && s[i].abort(), s[i] = n.apply(this, arguments), s[i]) : n.apply(this, arguments)
    })
}), JSON = {}, function () {
    "use strict";
    var rx_one = /^[\],:{}\s]*$/, rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta, rep;

    function f(t) {
        return t < 10 ? "0" + t : t
    }

    function this_value() {
        return this.valueOf()
    }

    function quote(t) {
        return rx_escapable.lastIndex = 0, rx_escapable.test(t) ? '"' + t.replace(rx_escapable, function (t) {
            var e = meta[t];
            return "string" == typeof e ? e : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + t + '"'
    }

    function str(t, e) {
        var i, n, s, o, a, r = gap, d = e[t];
        switch (d && "object" == typeof d && "function" == typeof d.toJSON && (d = d.toJSON(t)), "function" == typeof rep && (d = rep.call(e, t, d)), typeof d) {
            case"string":
                return quote(d);
            case"number":
                return isFinite(d) ? String(d) : "null";
            case"boolean":
            case"null":
                return String(d);
            case"object":
                if (!d) return "null";
                if (gap += indent, a = [], "[object Array]" === Object.prototype.toString.apply(d)) {
                    for (o = d.length, i = 0; i < o; i += 1) a[i] = str(i, d) || "null";
                    return s = 0 === a.length ? "[]" : gap ? "[\n" + gap + a.join(",\n" + gap) + "\n" + r + "]" : "[" + a.join(",") + "]", gap = r, s
                }
                if (rep && "object" == typeof rep) for (o = rep.length, i = 0; i < o; i += 1) "string" == typeof rep[i] && (s = str(n = rep[i], d)) && a.push(quote(n) + (gap ? ": " : ":") + s); else for (n in d) Object.prototype.hasOwnProperty.call(d, n) && (s = str(n, d)) && a.push(quote(n) + (gap ? ": " : ":") + s);
                return s = 0 === a.length ? "{}" : gap ? "{\n" + gap + a.join(",\n" + gap) + "\n" + r + "}" : "{" + a.join(",") + "}", gap = r, s
        }
    }

    "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function () {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value), "function" != typeof JSON.stringify && (meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    }, JSON.stringify = function (t, e, i) {
        var n;
        if (indent = gap = "", "number" == typeof i) for (n = 0; n < i; n += 1) indent += " "; else "string" == typeof i && (indent = i);
        if ((rep = e) && "function" != typeof e && ("object" != typeof e || "number" != typeof e.length)) throw new Error("JSON.stringify");
        return str("", {"": t})
    }), "function" != typeof JSON.parse && (JSON.parse = function (text, reviver) {
        var j;

        function walk(t, e) {
            var i, n, s = t[e];
            if (s && "object" == typeof s) for (i in s) Object.prototype.hasOwnProperty.call(s, i) && ((n = walk(s, i)) !== undefined ? s[i] = n : delete s[i]);
            return reviver.call(t, e, s)
        }

        if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function (t) {
            return "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4)
        })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
        throw new SyntaxError("JSON.parse")
    })
}(), function () {
    var m = function (t, e) {
        return "string" == typeof e ? h(e, {filename: t}) : i(t, e)
    };
    m.version = "3.0.0", m.config = function (t, e) {
        r[t] = e
    };
    var r = m.defaults = {openTag: "<%", closeTag: "%>", escape: !0, cache: !0, compress: !1, parser: null},
        d = m.cache = {};
    m.render = function (t, e) {
        return h(t, e)
    };
    var i = m.renderFile = function (t, e) {
        t = m.get(t) || l({filename: t, name: "Render Error", message: "Template not found"});
        return e ? t(e) : t
    };
    m.get = function (t) {
        var e, i;
        return d[t] ? i = d[t] : "object" != typeof document || (e = document.getElementById(t)) && (e = (e.value || e.innerHTML).replace(/^\s*|\s*$/g, ""), i = h(e, {filename: t})), i
    };
    var n = function (t, e) {
        return "string" != typeof t && ("number" == (e = typeof t) ? t += "" : t = "function" == e ? n(t.call(t)) : ""), t
    }, e = {"<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "&": "&#38;"}, s = function (t) {
        return e[t]
    }, o = Array.isArray || function (t) {
        return "[object Array]" === {}.toString.call(t)
    }, v = m.utils = {
        $helpers: {}, $include: i, $string: n, $escape: function (t) {
            return n(t).replace(/&(?![\w#]+;)|[<>"']/g, s)
        }, $each: function (t, e) {
            var i, n;
            if (o(t)) for (i = 0, n = t.length; i < n; i++) e.call(t, t[i], i, t); else for (i in t) e.call(t, t[i], i)
        }
    };
    m.helper = function (t, e) {
        $[t] = e
    };
    var $ = m.helpers = v.$helpers;
    m.onerror = function (t) {
        var e, i = "Template Error\n\n";
        for (e in t) i += "<" + e + ">\n" + t[e] + "\n\n";
        "object" == typeof console && console.error(i)
    };
    var l = function (t) {
            return m.onerror(t), function () {
                return "{Template Error}"
            }
        }, h = m.compile = function (e, i) {
            for (var t in i = i || {}, r) i[t] === undefined && (i[t] = r[t]);
            var n = i.filename;
            try {
                var s = u(e, i)
            } catch (a) {
                return a.filename = n || "anonymous", a.name = "Syntax Error", l(a)
            }

            function o(t) {
                try {
                    return new s(t, n) + ""
                } catch (a) {
                    return i.debug ? l(a)() : (i.debug = !0, h(e, i)(t))
                }
            }

            return o.prototype = s.prototype, o.toString = function () {
                return s.toString()
            }, n && i.cache && (d[n] = o), o
        }, G = v.$each,
        I = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,
        B = /[^\w$]+/g,
        j = new RegExp(["\\b" + "break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined".replace(/,/g, "\\b|\\b") + "\\b"].join("|"), "g"),
        A = /^\d[^,]*|,\d[^,]*/g, O = /^,+|,+$/g, T = /^$|,+/;

    function w(t) {
        return "'" + t.replace(/('|\\)/g, "\\$1").replace(/\r/g, "\\r").replace(/\n/g, "\\n") + "'"
    }

    function u(t, n) {
        var s = n.debug, e = n.openTag, o = n.closeTag, a = n.parser, i = n.compress, r = n.escape, d = 1,
            l = {$data: 1, $filename: 1, $utils: 1, $helpers: 1, $out: 1, $line: 1}, h = "".trim,
            u = h ? ["$out='';", "$out+=", ";", "$out"] : ["$out=[];", "$out.push(", ");", "$out.join('')"],
            h = h ? "$out+=text;return $out;" : "$out.push(text);",
            c = "function(){var text=''.concat.apply('',arguments);" + h + "}",
            m = "function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);" + h + "}",
            p = "'use strict';var $utils=this,$helpers=$utils.$helpers," + (s ? "$line=0," : ""), f = u[0],
            h = "return new String(" + u[3] + ");";
        G(t.split(e), function (t) {
            var e = (t = t.split(o))[0], i = t[1];
            1 === t.length ? f += y(e) : (f += function (t) {
                var e = d;
                a ? t = a(t, n) : s && (t = t.replace(/\n/g, function () {
                    return "$line=" + ++d + ";"
                }));
                {
                    var i;
                    0 === t.indexOf("=") && (i = r && !/^=[=#]/.test(t), t = t.replace(/^=[=#]?|[\s;]*$/g, ""), i ? (i = t.replace(/\s*\([^\)]+\)/, ""), v[i] || /^(include|print)$/.test(i) || (t = "$escape(" + t + ")")) : t = "$string(" + t + ")", t = u[1] + t + u[2])
                }
                s && (t = "$line=" + e + ";" + t);
                return G(function (t) {
                    return t.replace(I, "").replace(B, ",").replace(j, "").replace(A, "").replace(O, "").split(T)
                }(t), function (t) {
                    var e;
                    t && !l[t] && (e = "print" === t ? c : "include" === t ? m : v[t] ? "$utils." + t : $[t] ? "$helpers." + t : "$data." + t, p += t + "=" + e + ",", l[t] = !0)
                }), t + "\n"
            }(e), i && (f += y(i)))
        });
        var g = p + f + h;
        s && (g = "try{" + g + "}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:" + w(t) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");
        try {
            var b = new Function("$data", "$filename", g);
            return b.prototype = v, b
        } catch (_) {
            throw _.temp = "function anonymous($data,$filename) {" + g + "}", _
        }

        function y(t) {
            return d += t.split(/\n/).length - 1, i && (t = t.replace(/\s+/g, " ").replace(/<!--[\w\W]*?-->/g, "")), t = t && u[1] + w(t) + u[2] + "\n"
        }
    }

    r.openTag = "{{", r.closeTag = "}}";
    r.parser = function (t, e) {
        var i, n, s, o = (t = t.replace(/^\s/, "")).split(" "), a = o.shift(), r = o.join(" ");
        switch (a) {
            case"if":
                t = "if(" + r + "){";
                break;
            case"else":
                t = "}else" + (o = "if" === o.shift() ? " if(" + o.join(" ") + ")" : "") + "{";
                break;
            case"/if":
                t = "}";
                break;
            case"each":
                var d = o[0] || "$data";
                "as" !== (o[1] || "as") && (d = "[]"), t = "$each(" + d + ",function(" + ((o[2] || "$value") + "," + (o[3] || "$index")) + "){";
                break;
            case"/each":
                t = "});";
                break;
            case"echo":
                t = "print(" + r + ");";
                break;
            case"print":
            case"include":
                t = a + "(" + o.join(",") + ");";
                break;
            case"var":
                t = "var " + r + ";";
                break;
            default:
                if (/^\s*\|\s*[\w\$]/.test(r)) {
                    r = !0;
                    0 === t.indexOf("#") && (t = t.substr(1), r = !1);
                    for (var l = 0, h = t.split("|"), u = h.length, c = h[l++]; l < u; l++) i = c, n = h[l], s = s = void 0, n = (s = n.split(":")).shift(), s = s.join(":") || "", c = "$helpers." + n + "(" + i + (s = s && ", " + s) + ")";
                    t = (r ? "=" : "=#") + c
                } else t = m.helpers[a] ? "=#" + a + "(" + o.join(",") + ");" : "=" + t
        }
        return t
    }, "function" == typeof define ? define(function () {
        return m
    }) : "undefined" != typeof exports ? module.exports = m : this.template = m
}(), window.console || (window.console = {
    log: function () {
    }
}), $.support.boxSizing || document.execCommand("BackgroundImageCache", !1, !0), function (window, $) {
    var win = $(window), doc = $(document), ie9 = !$.support.clearCloneStyle,
        reg_include = /#include\s+([a-zA-Z0-9_-]+)/, cache_name, cache_html, _ajax,
        reg_template = /#template\s+([a-zA-Z0-9_-]+)/, tpl_id, match_tpl, Requesting = {};

    function Loader(t, e) {
        t = t || {}, this.template = null, this.jsondata = t.jsondata || {
            Status: 1,
            Data: {}
        }, this.bd = t.bd || null, this.timer_html = null, this.timer_bind = null, this.success = t.success || null, this.renderSuccess = t.renderSuccess || null, this.compile = t.compile || null, this.loadid = e, this.flag = 0, this.refresh = t.refresh, this.hash = t.hash, this.loadPage(t, e)
    }

    $.ajaxPrefilter(function (t, e, n) {
        var s = t.url + t.data;

        function i() {
            Requesting[s] = {count: 1, timeStart: $.now(), xhr: n};
            var i = t.complete;
            t.complete = function (t, e) {
                delete Requesting[s], $.isFunction(i) && i.call(this, t, e)
            }
        }

        Requesting[s] ? 1e3 < $.now() - Requesting[s].timeStart ? (Requesting[s].xhr.abort(), delete Requesting[s], i()) : (Requesting[s].count++, 3 == Requesting[s].count && $.alert("您的操作过于频繁，请稍后再试。"), n.abort()) : i()
    }), $.ajaxSetup({
        global: !1, cache: !1, beforeSend: function (t) {
            t.setRequestHeader("hash", G.util.getHash())
        }
    }), Loader.prototype.loadPage = function (t, e) {
        t = t || {}, this.getHTML(t), this.getJSON(t, e)
    }, Loader.prototype.render = function (t) {
        ie9 && (t = t.replace(/\/td>\s+<td/g, "/td><td"));
        var e = this;
        this.success ? this.success(t, this.jsondata) : (this.unbind(this.bd), this.bd.html(t), this.renderElement(), this.renderSuccess && this.renderSuccess(this.jsondata)), this.timer_bind = setTimeout(function () {
            e.bind(e.bd, e.jsondata), e.destroy()
        }, 0), G.iclick && this.hash && doc.triggerHandler("setHash")
    }, Loader.prototype.renderElement = function () {
        var action, param, template;
        $("[async]", this.bd).each(function () {
            action = this.getAttribute("action"), this.format = this.getAttribute("format") ? eval(this.getAttribute("format")) : null, this.removeAttribute("async"), param = $.unparam(this.getAttribute("param")), template = $("#" + this.getAttribute("template")).html(), loadModule({
                html: template,
                json: action,
                bd: $(this),
                param: param,
                jsonSuccess: $.proxy(function (t) {
                    return this.format ? this.format(t) : t
                }, this)
            })
        })
    }, Loader.prototype.destroy = function () {
        this.timer_bind && clearTimeout(this.timer_bind), this.template = null, this.jsondata = null, this.bd = null, this.timer_html = null, this.timer_bind = null, this.flag = null, G[this.loadid] = null, delete G[this.loadid], this.success = null, this.renderSuccess = null, this.compile = null, this.hash = null
    }, Loader.prototype.getHTML = function (e) {
        var i, t, n = this;
        if (/<\w+.*?>/.test(e.html)) return this.template = e.html, this.flag += 1, void this.flashHTML(e);
        i = e.html ? e.html : e.module, t = /^\/.*/.test(e.html) ? e.html : e.html ? G.map[e.module].html[e.html] : G.map[e.module].html[e.module], G.html[i] ? (this.template = G.html[i], this.flag += 1, this.flashHTML(e)) : G.util.getHTML({
            url: t,
            success: function (t) {
                n.template = G.html[i] = t, n.flag += 1, e.hash && e.hash != G.util.getHash() && e.hash != G.tmp_hash || n.flashHTML(e, n.jsondata)
            },
            error: function () {
            }
        })
    }, Loader.prototype.getJSON = function (e, t) {
        var i = this;
        if (jsonurl = /^\/.+/.test(e.json) ? e.json : e.json ? G.map[e.module].json[e.json] : e.module && !e.html ? G.map[e.module].json[e.module] : null, !jsonurl) return this.flag += 1, void this.flashHTML(e);
        G.get({
            url: jsonurl, data: e.param, success: function (t) {
                i.flag += 1, i.jsondata = t, e.jsonSuccess ? i.jsondata = e.jsonSuccess(t) || t : e.html || e.json ? e.module && e.json && (i.jsondata = G.map[e.module].format && G.map[e.module].format[e.json] && G.map[e.module].format[e.json](t) || t) : i.jsondata = G.map[e.module].format && G.map[e.module].format[e.module] && G.map[e.module].format[e.module](t) || t, e.hash && e.hash != G.util.getHash() && e.hash != G.tmp_hash || i.flashHTML(e)
            }, error: function () {
                e.jsonError && e.jsonError()
            }
        })
    }, Loader.prototype.flashHTML = function (t) {
        if (!(this.flag < 2)) {
            for (var e, i = ""; reg_include.test(this.template);) cache_name = this.template.match(reg_include)[1], cache_html = "", G.html[cache_name] ? cache_html = G.html[cache_name] : _ajax = $.ajax({
                url: "/Theme/Com/Htmls/" + cache_name + ".html",
                async: !1,
                timeout: 5e3,
                success: function (t) {
                    G.html[cache_name] = cache_html = t
                },
                complete: function (t, e) {
                    "timeout" == e && _ajax.abort()
                }
            }), this.template = this.template.replace(reg_include, cache_html), cache_html = null;
            for (; reg_template.test(this.template);) tpl_id = this.template.match(reg_template)[1], match_tpl = (match_tpl = this.template.match(new RegExp("<script.*id=['\"]" + tpl_id + "['\"][^>]*?>([\\s\\S]*?)<\\/script>"))) && match_tpl[1] ? match_tpl[1] : "", this.template = this.template.replace(reg_template, match_tpl);
            this.template = this.template.replace(new RegExp("<script[^>]*?>[\\s\\S]*?<\\/script>", "ig"), function (t) {
                return i += t, ""
            }), this.jsondata.Param = t.param || {}, this.jsondata.OpenStatus = OPEN_STATUS, this.jsondata.Lottery = Lottery, this.jsondata.brand = brand, this.jsondata.ConfigSetting = ConfigSetting, e = G.util.compile(this.template, this.jsondata), e += i, this.render(e), i = null
        }
    }, Loader.prototype.bind = function (t, i) {
        var n = this;
        t && t.length && $("div[name=module]", t).each(function () {
            n.refresh || $("input[autofocus]:eq(0)", this).focus();
            var e = this.id;
            this.json = i || {}, G.modules[e] && !G.instance[e] ? (G.instance[e] = new G.modules[e](this), G.instance[e].init && G.instance[e].init()) : (deps = this.getAttribute("deps"), deps && require(deps.split(","), $.proxy(function (t) {
                t && (G.instance[e] = new t(this), G.instance[e].init && G.instance[e].init())
            }, this)))
        })
    }, Loader.prototype.unbind = function (t) {
        t && t.length && $("div[name=module]", t).each(function () {
            var t = this.id;
            G.instance[t] && (G.instance[t].destroy && G.instance[t].destroy(), this.json = null, G.util.destroy(G.instance[t]), G.instance[t] = null, delete G.instance[t])
        })
    };
    var G = {html: {}, instance: {}, modules: {}, dialog: [], iclick: !1, tmp_hash: ""}, Kl, Ll;
    G.util = {
        compile: function (t, e) {
            return template.compile(t)(e)
        },
        load: function (t) {
            var e = $.now();
            G[e] = new Loader(t, e)
        },
        close: function (t) {
            if (t) doc.triggerHandler("dialog", [t, "close"]); else for (; G.dialog[0];) G.dialog[0].close()
        },
        destroy: function (t) {
            var e, i = t.d;
            for (e in doc.off("." + i[0].id), t) t[e] instanceof jQuery && t[e].off(), t[e] = null, delete t[e]
        },
        getHTML: function (e) {
            $.ajax({
                url: e.url + "?v=" + VERSION, dataType: "html", cache: e.cache || !0, success: function (t) {
                    e.success && e.success(t)
                }, error: function () {
                    e.error && e.error()
                }
            })
        },
        getDate: function (t) {
            var e;
            return t && $.isNumeric(t) || (t = $.now()), (e = new Date(t)).getFullYear() + "-" + (t = (t = e.getMonth() + 1) < 10 ? "0" + t : t) + "-" + (e = (e = e.getDate()) < 10 ? "0" + e : e)
        },
        guid: function () {
            for (var t = [], e = "0123456789abcdef", i = 0; i < 36; i++) t[i] = e.substr(Math.floor(16 * Math.random()), 1);
            return t[14] = "4", t[19] = e.substr(3 & t[19] | 8, 1), t[8] = t[13] = t[18] = t[23] = "-", t.join("")
        },
        format_thousands: function (t) {
            for (var e = (t = (t + "").split("."))[0]; /\d{4}/.test(e);) e = e.replace(/(\d+)(\d{3})/, "$1,$2");
            return e + (t[1] ? "." + t[1] : "")
        },
        input_format: function (t, e) {
            var i = e.target;
            t.on("keyup", function (t) {
                t = t.keyCode;
                (48 <= t && t <= 57 || 96 <= t && t <= 105 || 189 == t || 109 == t || 8 == t || 46 == t) && (this.value = G.util.format_thousands(this.value.replace(/\,/g, "")), i.val(this.value.replace(/\,/g, "")))
            }).on("blur", function () {
                i.val(this.value.replace(/\,/g, ""))
            })
        },
        setCookie: function (t, e, i) {
            var n = new Date, s = n.getTime() + 2592e6;
            i && !isNaN(i) && (s = n.getTime() + 60 * i * 60 * 1e3), n.setTime(s), document.cookie = t + "=" + escape(e) + ";expires=" + n.toGMTString()
        },
        getCookie: function (t) {
            var t = new RegExp("(^| )" + t + "=([^;]*)(;|$)");
            return (t = document.cookie.match(t)) ? unescape(t[2]) : null
        },
        delCookie: function (t) {
            var e = new Date;
            e.setTime(e.getTime() - 1);
            var i = G.util.getCookie(t);
            null != i && (document.cookie = t + "=" + i + ";expires=" + e.toGMTString())
        },
        formatHash: (Kl = ["^#!([a-zA-Z0-9_]+).?", "#![a-zA-Z0-9_]+\\.([a-zA-Z0-9_]+)", "\\|([a-zA-Z0-9_]+)", "\\?(.+)"], Ll = ["module", "html", "json", "param"], function (t) {
            for (var e, i, n, s = 0, o = {}, a = {}; Kl[s];) e = t.match(new RegExp(Kl[s])), o[Ll[s]] = e ? e[1] : undefined, s++;
            return o.param && (i = o.param.split("&"), $.each(i, function (t, e) {
                n = e.split("="), a[n[0].replace(/(^_)/, "")] = n[1]
            }), o.param = a), o
        }),
        getHash: function (t) {
            return "#" + unescape(t || location.href).replace(/^[^#]*#?(.*)$/, "$1")
        },
        setHash: function (t, e) {
            G.iclick = !0, G.tmp_hash = t, G.util.reload(G.tmp_hash, e)
        },
        reload: function (t, e) {
            var i = G.util.getHash(t), n = G.util.formatHash(i), t = n.module;
            e && $.extend(n.param, e), n.hash = i, n.refresh = !0, G.hashFn[t] && G.hashFn[t](n)
        },
        formatSecond: function (t) {
            t = t || 0;
            for (var e, i = [{num: 86400, str: "天"}, {num: 3600, str: "时"}, {num: 60, str: "分"}, {
                num: 1,
                str: "秒"
            }], n = 0, s = []; i[n];) e = Math.floor(t / i[n].num), s.push(e + "" + i[n].str), t -= e * i[n].num, n++;
            return s.join(" ")
        },
        array_remove: function (t, e) {
            for (var i = 0, n = t.length; i < n; i++) if (t[i] == e) {
                t.splice(i, 1);
                break
            }
            return t
        },
        mathAdd: function (t, e) {
            return t = t == undefined ? 0 : t, e = e == undefined ? 0 : e, t.add(e)
        },
        mathMul: function (t, e) {
            return t = t == undefined ? 0 : t, e = e == undefined ? 0 : e, t.multiply(e)
        }
    }, $(["get", "post"]).each(function (t, e) {
        G[e] = function (n) {
            $.ajax({
                url: n.url,
                data: n.data,
                type: e,
                dataType: "json",
                cache: n.cache,
                async: n.async,
                success: function (t) {
                    switch (t.Status) {
                        case 2:
                        case 4:
                        case 6:
                        case 7:
                            n.bussiness ? n.bussiness(t.Data) : $.alert(t.Data);
                            break;
                        case 3:
                            $.alert(t.Data), n.bussiness && n.bussiness(t.Data);
                            break;
                        case 5:
                            n.bussiness ? n.bussiness(t.Data) : $.alert(t.Data, function () {
                                location.href = "/Member/Login"
                            });
                            break;
                        case 500:
                            $.alert("请求数据失败，错误码：500，具体原因如下：\r\n\r\n" + t.Data);
                            break;
                        case 302:
                            location.href = t.Data;
                            break;
                        default:
                            n.success && n.success(t)
                    }
                },
                error: function (t, e, i) {
                    n.error && n.error(t, e, i), t.responseText && -1 < t.responseText.indexOf("tn_code") && location.reload()
                },
                complete: function (t, e) {
                    n.complete && n.complete(t, e)
                }
            })
        }
    }), $.extend(window, {
        Loader: Loader,
        G: G,
        main: $("#main"),
        loadModule: G.util.load,
        doc: $(document)
    }), doc.on("click", "a", function () {
        if (/#!/.test(this.href)) {
            var t = G.util.getHash(this.href);
            return G.iclick = !0, G.tmp_hash = t, G.util.reload(G.tmp_hash), !1
        }
    }).bind("setHash", function () {
        G.util.getHash(location.hash) == G.tmp_hash && (G.iclick = !1), location.hash = G.tmp_hash
    })
}(window, jQuery), $(function () {
    G.InitSetting(), G.hash = G.InitHash, $.fn.hashchange.src = "/All/Domain.html", $.fn.hashchange.domain = document.domain, $(window).hashchange(function () {
        var t, e, i;
        G.iclick ? (G.tmp_hash = null, G.iclick = !1) : (t = G.util.getHash(), i = (e = G.util.formatHash(t)).module, e.hash = t, G.hashFn[i] && G.hashFn[i](e), G.util.close())
    }), /#!\w+/.test(location.hash) ? G.util.setHash(G.util.getHash(location.hash)) : G.util.setHash(G.InitHash), Loader.prototype.bind($(document.body))
}), $.unparam = function (t) {
    if ("" == t || t == undefined) return {};
    for (var e, i = t.split("&"), n = i.length, s = 0, o = {}; s < n; s++) o[(e = i[s].split("="))[0]] = e[1] ? decodeURIComponent(e[1]) : "";
    return o
}, Number.prototype.toFixedCut = function (t) {
    var e = 0, i = "", n = (this + "").split(".");
    if (n[1] = n[1] ? n[1] : "", t <= 0) return n[0];
    for (e = 0; e < t; e++) n[1].charAt(e) && (i += n[1].charAt(e));
    return parseFloat(n[0] + (i ? "." + i : ""))
}, String.prototype.toFixedCut = Number.prototype.toFixedCut, function () {
    function e(t, e, i) {
        var n, s, o;
        if (0 == e && 4 == i) return 0;
        switch (s = String(t), o = String(e), t = s.split(".")[1] ? s.split(".")[1].length : 0, e = (e = o.split(".")[1] ? o.split(".")[1].length : 0) < t ? t : e, s = Math.round(s * Math.pow(10, e)), o = Math.round(o * Math.pow(10, e)), i) {
            case 1:
                n = s + o;
                break;
            case 2:
                n = s - o;
                break;
            case 3:
                n = s * o;
                break;
            case 4:
                n = s / o
        }
        return e = 1 == i || 2 == i ? e : 3 == i ? 2 * e : 0, n / Math.pow(10, e)
    }

    Number.prototype.add = function (t) {
        return e.apply(null, [this, t, 1])
    }, String.prototype.add = Number.prototype.add, Number.prototype.subtract = function (t) {
        return e.apply(null, [this, t, 2])
    }, String.prototype.subtract = Number.prototype.subtract, Number.prototype.multiply = function (t) {
        return e.apply(null, [this, t, 3])
    }, String.prototype.multiply = Number.prototype.multiply, Number.prototype.divide = function (t) {
        return e.apply(null, [this, t, 4])
    }, String.prototype.divide = Number.prototype.divide
}(), $.extend(G, {
    action_odds: "/Home/GetBetFullData",
    Animal: getAnimal(AnimalYear),
    MAX_GUOGUAN_VALUE: 2500052,
    shengxiao: [{name: "鼠", betitemid: "60"}, {name: "牛", betitemid: "61"}, {name: "虎", betitemid: "62"}, {
        name: "兔",
        betitemid: "63"
    }, {name: "龙", betitemid: "64"}, {name: "蛇", betitemid: "65"}, {name: "马", betitemid: "66"}, {
        name: "羊",
        betitemid: "67"
    }, {name: "猴", betitemid: "68"}, {name: "鸡", betitemid: "69"}, {name: "狗", betitemid: "70"}, {
        name: "猪",
        betitemid: "71"
    }],
    weishu: [{name: "0", numbers: ["10", "20", "30", "40"], betitemid: "50"}, {
        name: "1",
        numbers: ["01", "11", "21", "31", "41"],
        betitemid: "51"
    }, {name: "2", numbers: ["02", "12", "22", "32", "42"], betitemid: "52"}, {
        name: "3",
        numbers: ["03", "13", "23", "33", "43"],
        betitemid: "53"
    }, {name: "4", numbers: ["04", "14", "24", "34", "44"], betitemid: "54"}, {
        name: "5",
        numbers: ["05", "15", "25", "35", "45"],
        betitemid: "55"
    }, {name: "6", numbers: ["06", "16", "26", "36", "46"], betitemid: "56"}, {
        name: "7",
        numbers: ["07", "17", "27", "37", "47"],
        betitemid: "57"
    }, {name: "8", numbers: ["08", "18", "28", "38", "48"], betitemid: "58"}, {
        name: "9",
        numbers: ["09", "19", "29", "39", "49"],
        betitemid: "59"
    }],
    billListGuoGuan: [],
    guoguanBall: []
}), G.InitHash = "#!tema?link=tema&groupid=1", G.map = {
    bet: {
        html: {
            quick_bet: "/Theme/Com/Htmls/bet-quick.html",
            single_bet: "/Theme/Com/Htmls/bet-single.html",
            success_bet: "/Theme/Com/Htmls/bet-success.html"
        }, json: {single_bet: "/Home/GetBetFullData"}, format: {}
    },
    tema: {
        html: {tema: "/Theme/Com/Htmls/playtype/tema.html"},
        json: {tema: G.action_odds},
        format: {
            tema: function (t) {
                return G.format.tema(t)
            }
        }
    },
    zhengma: {
        html: {zhengma: "/Theme/Com/Htmls/playtype/zhengma.html"},
        json: {zhengma: G.action_odds},
        format: {
            zhengma: function (t) {
                return G.format.zhengma(t)
            }
        }
    },
    zhengtema: {
        html: {zhengtema: "/Theme/Com/Htmls/playtype/zhengtema.html"},
        json: {zhengtema: G.action_odds},
        format: {
            zhengtema: function (t) {
                return G.format.zhengtema(t)
            }
        }
    },
    zheng: {html: {zheng: "/Theme/Com/Htmls/playtype/zheng.html"}, json: {zheng: G.action_odds}},
    shengxiao: {
        html: {shengxiao: "/Theme/Com/Htmls/playtype/shengxiao.html"},
        json: {shengxiao: G.action_odds},
        format: {
            shengxiao: function (t) {
                return G.format.shengxiao(t)
            }
        }
    },
    weishu: {
        html: {weishu: "/Theme/Com/Htmls/playtype/weishu.html"},
        json: {weishu: G.action_odds},
        format: {
            weishu: function (t) {
                return G.format.weishu(t)
            }
        }
    },
    banbo: {
        html: {banbo: "/Theme/Com/Htmls/playtype/banbo.html"},
        json: {banbo: G.action_odds},
        format: {
            banbo: function (t) {
                return G.format.banbo(t)
            }
        }
    },
    liuxiao: {
        html: {liuxiao: "/Theme/Com/Htmls/playtype/liuxiao.html"},
        json: {liuxiao: G.action_odds},
        format: {
            liuxiao: function (t) {
                return G.format.liuxiao(t)
            }
        }
    },
    texiao: {
        html: {texiao: "/Theme/Com/Htmls/playtype/texiao.html"},
        json: {texiao: G.action_odds},
        format: {
            texiao: function (t) {
                return G.format.texiao(t)
            }
        }
    },
    shengxiaolian: {
        html: {shengxiaolian: "/Theme/Com/Htmls/playtype/shengxiaolian.html"},
        json: {shengxiaolian: G.action_odds},
        format: {
            shengxiaolian: function (t) {
                return G.format.shengxiaolian(t)
            }
        }
    },
    weishulian: {
        html: {weishulian: "/Theme/Com/Htmls/playtype/weishulian.html"},
        json: {weishulian: G.action_odds},
        format: {
            weishulian: function (t) {
                return G.format.weishulian(t)
            }
        }
    },
    guoguan: {
        html: {guoguan: "/Theme/Com/Htmls/playtype/guoguan.html"},
        json: {guoguan: G.action_odds},
        format: {
            guoguan: function (t) {
                return G.format.guoguan(t)
            }
        }
    },
    buzhong: {
        html: {buzhong: "/Theme/Com/Htmls/playtype/buzhong.html"},
        json: {buzhong: G.action_odds},
        format: {
            buzhong: function (t) {
                return G.format.buzhong(t)
            }
        }
    },
    duoxuanzhongyi: {
        html: {duoxuanzhongyi: "/Theme/Com/Htmls/playtype/duoxuanzhongyi.html"},
        json: {duoxuanzhongyi: G.action_odds},
        format: {
            duoxuanzhongyi: function (t) {
                return G.format.duoxuanzhongyi(t)
            }
        }
    },
    tepingzhong: {
        html: {tepingzhong: "/Theme/Com/Htmls/playtype/tepingzhong.html"},
        json: {tepingzhong: G.action_odds},
        format: {
            tepingzhong: function (t) {
                return G.format.tepingzhong(t)
            }
        }
    },
    hexiao: {
        html: {hexiao: "/Theme/Com/Htmls/playtype/hexiao.html"},
        json: {hexiao: G.action_odds},
        format: {
            hexiao: function (t) {
                return G.format.hexiao(t)
            }
        }
    },
    qima: {
        html: {qima: "/Theme/Com/Htmls/playtype/qima.html"},
        json: {qima: G.action_odds},
        format: {
            qima: function (t) {
                return G.format.qima(t)
            }
        }
    },
    wuxing: {
        html: {wuxing: "/Theme/Com/Htmls/playtype/wuxing.html"},
        json: {wuxing: G.action_odds},
        format: {
            wuxing: function (t) {
                return G.format.wuxing(t)
            }
        }
    },
    yixiaoliang: {
        html: {yixiaoliang: "/Theme/Com/Htmls/playtype/yixiaoliang.html"},
        json: {yixiaoliang: G.action_odds},
        format: {
            yixiaoliang: function (t) {
                return G.format.yixiaoliang(t)
            }
        }
    },
    weishuliang: {
        html: {weishuliang: "/Theme/Com/Htmls/playtype/weishuliang.html"},
        json: {weishuliang: G.action_odds},
        format: {
            weishuliang: function (t) {
                return G.format.weishuliang(t)
            }
        }
    },
    weishubuzhong: {
        html: {weishubuzhong: "/Theme/Com/Htmls/playtype/weishubuzhong.html"},
        json: {weishubuzhong: G.action_odds},
        format: {
            weishubuzhong: function (t) {
                return G.format.weishubuzhong(t)
            }
        }
    },
    lianma: {
        html: {lianma: "/Theme/Com/Htmls/playtype/lianma.html"},
        json: {lianma: G.action_odds},
        format: {
            lianma: function (t) {
                return G.format.lianma(t)
            }
        }
    },
    history: {
        html: {
            history: "/Theme/Com/Htmls/accounthistory/bet-history.html",
            detail: "/Theme/Com/Htmls/accounthistory/detail.html",
            order: "/Theme/Com/Htmls/accounthistory/order-detail.html"
        },
        json: {
            history: "/Member/GetMemberBillHistory",
            detail: "/Member/GetMemberBillHistoryDetail",
            order: "/Member/GetMemberBillHistoryBetItemListForCom"
        },
        format: {
            history: function (t) {
                var i = {BetCount: 0, BetMoney: 0, AwardMoney: 0, ReturnWater: 0, WinOrLoss: 0};
                return $.each(t.Data.memberBillHistoryList, function (t, e) {
                    i.BetCount += e.BetCount, i.BetMoney += e.BetMoney, i.AwardMoney = G.util.mathAdd(i.AwardMoney, e.AwardMoney), i.ReturnWater = G.util.mathAdd(i.ReturnWater, e.ReturnWater), i.WinOrLoss = G.util.mathAdd(i.WinOrLoss, e.WinOrLoss)
                }), t.Total = i, t
            }, detail: format_history
        }
    },
    info: {
        html: {info: "/Theme/Com/Htmls/info.html", memberloginrecord: "/Theme/Com/Htmls/member-login-record.html"},
        json: {info: "/Member/GetMemberBetSettingInfo", memberloginrecord: "/Member/GetLoginLog"}
    },
    result: {
        html: {result: "/Theme/Com/Htmls/result.html"},
        json: {result: "/Period/GetDrawNumberList"},
        format: {result: format_result}
    },
    password: {
        html: {password: "/Theme/Com/Htmls/password.html"},
        json: {password: "/Member/GetMarkSixComPasswordRuleHtml"}
    },
    rule: {html: {rule: "/Theme/Com/Htmls/rule.html"}, json: {}},
    betdetail: {
        html: {
            betdetail: "/Theme/Com/Htmls/betdetail.html",
            profits: "/Theme/Com/Htmls/accounthistory/profits.html"
        },
        json: {betdetail: "/Member/GetMemberBetRecord", profits: "/Member/GetMemberOnePlayGroupForCom"},
        format: {betdetail: format_betdetail}
    },
    marquee: {html: {marquee: "/Theme/Com/Htmls/marquee.html"}, json: {marquee: "/Home/GetWindowBulletin"}},
    statistics: {
        html: {statistics: "/Theme/Com/Htmls/statistics.html"},
        json: {statistics: "/Home/GetDrawStatistic"},
        format: {
            statistics: function (t) {
                var e, i, n;
                return t.Data.ExNoHalfBallCount && (e = (n = t.Data.ExNoHalfBallCount).slice(0, 2).concat(n.slice(6, 8)), i = n.slice(2, 4).concat(n.slice(8, 10)), n = n.slice(4, 6).concat(n.slice(10, 12)), t.Data.ExNoHalfBallCount = e.concat(i).concat(n)), t
            }
        }
    },
    siquanzhong: {
        html: {siquanzhong: "/Theme/Com/Htmls/playtype/siquanzhong.html"},
        json: {siquanzhong: G.action_odds},
        format: {
            siquanzhong: function (t) {
                return G.format.siquanzhong(t)
            }
        }
    },
    bidaxiao: {html: {bidaxiao: "/Theme/Com/Htmls/playtype/bidaxiao.html"}, json: {bidaxiao: G.action_odds}, format: {}}
}, G.hashFn = {
    supper: function (t) {
        var e, i = t.module;
        G.util.load({
            bd: main,
            module: i,
            param: t.param || {},
            html: t.html,
            json: t.json,
            hash: t.hash,
            refresh: t.refresh
        }), $("#nav a").removeClass("on").filter("[name=" + i + "]").addClass("on"), t.param && t.param.link ? ($("#playtype li").removeClass("active"), $("#nav li").removeClass("active"), i = $("li a[name=" + t.module + "]"), e = $("li a[name=" + t.param.link + "]"), i.parent().addClass("active"), e.parent().addClass("active")) : ($("#playtype li").removeClass("active"), $("#nav li").removeClass("active"), (e = $("li a[name=" + t.module + "]")).parent().addClass("active")), doc.triggerHandler("close.left")
    }
}, $.each(G.map, function (t) {
    G.hashFn[t] = G.hashFn.supper
}), G.InitSetting = function () {
    var t;
    $.validator.setDefaults({
        focusInvalid: !1, onfocusout: !1, showErrors: function (t, e) {
            e.length && $(e[0].element).tooltip({html: e[0].message, isFocus: !0})
        }
    }), $.validator.addMethod("regularrule", function (t) {
        return /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(t)
    }, $.validator.format("只能输入数字、字母、汉字")), $.validator.addMethod("passwordCheck", function (t, e, i) {
        return this.optional(e) || /^[a-zA-Z0-9]*$/.test(t)
    }, "密码只能由数字或字母组成"), $.validator.addMethod("codeRule", function (t) {
        return "" == t || /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(t)
    }, $.validator.format("只能输入数字、字母、汉字")), $.validator.addMethod("integer", function (t) {
        return "" == t || /^[1-9]\d*$/.test(t)
    }, $.validator.format("请输入不小于10的整数")), $.validator.addMethod("positive", function (t, e) {
        return this.optional(e) || /^\d+(\.\d+)?$/.test(t) && 0 < t
    }, "请输入大于0的数"), $.validator.addMethod("positiveInteger", function (t, e, i) {
        return this.optional(e) || /^[1-9]\d*$/.test(t)
    }, "请输入一个大于0的整数"), $.validator.addMethod("nonnegative", function (t, e, i) {
        return this.optional(e) || /^\d+(\.\d+)?$/.test(t) && 0 <= t
    }, "请输入一个非负数"), template.config("compress", !0), template.helper("toInt", function (t) {
        return parseInt(t, 10)
    }), $.fn.input_digits = function () {
        return this.each(function () {
            $(this).on("keydown", function (t) {
                var e = t.keyCode;
                return (!t.shiftKey && (47 < e && e < 58 || 95 < e && e < 106 || 46 == e || 8 == e || 9 == e || 13 == e || 37 == e || 39 == e) || 229 == e) && (("" != this.value || 48 != e && 96 != e) && void 0)
            }).on("keyup", function () {
                if (this.attributes.maxlengththousands) {
                    for (var t = this.attributes.maxlengththousands.nodeValue, e = "", i = new RegExp("[,]"), n = 0; n < this.value.length; n++) e += this.value.substr(n, 1).replace(i, "");
                    e.length <= t || (e = e.slice(0, t)), this.value = G.util.format_thousands(e.replace(/\,/g, ""))
                } else this.value != undefined && null != this.value && (this.value = G.util.format_thousands(this.value.replace(/\,/g, "")))
            })
        })
    }, t = G.helper, $.each(t, function (t, e) {
        template.helper(t, e)
    })
}, G.format = {
    bet: function (t) {
        var e = t.Data.betItems, i = [], n = [], s = [], o = 0, a = t.Data.bet_item_id;
        if (285 != a && 286 != a && 290 != a && 292 != a && 293 != a) {
            if (e) {
                for (var r = 0; r < e.length; r++) (e[r].bet_item_id <= 49 ? i : n).push(e[r]);
                i.sort(function (t, e) {
                    return t.bet_item_id - e.bet_item_id
                });
                for (var d = 0; d < i.length; d++) d % 10 == 0 && 0 < d && o++, s[o] || (s[o] = []), s[o].push(i[d]);
                s.push(n), t.Data.betItems = s
            }
        } else if (285 == a) {
            if (e) {
                for (r = 0; r < e.length; r++) r % 7 == 0 && 0 < r && o++, s[o] || (s[o] = []), s[o].push(e[r]);
                t.Data.betItems = s
            }
        } else if (290 == a) {
            if (e) {
                for (r = 0; r < e.length; r++) r % 8 == 0 && 0 < r && o++, s[o] || (s[o] = []), s[o].push(e[r]);
                t.Data.betItems = s
            }
        } else if ((292 == a || 293 == a) && e) {
            for (r = 0; r < e.length; r++) r % 3 == 0 && 0 < r && o++, s[o] || (s[o] = []), s[o].push(e[r]);
            t.Data.betItems = s
        }
    }, tema: function (t) {
        var e, i = t.Data.Odds, n = [], s = [], o = [], a = 0, r = [], d = [], l = 2, h = 8, u = 50,
            c = [["特单", "特码单", "单"], ["特双", "特码双", "双"], ["红色", "特红", "红"], ["特大", "特码大", "大"], ["特小", "特码小", "小"], ["蓝色", "特蓝", "蓝"], ["合单", "特码合单", "合单"], ["合双", "特码合双", "合双"], ["绿色", "特绿", "绿"], ["尾大", "特码尾大", "尾大"], ["尾小", "特码尾小", "尾小"]];
        if (i) {
            for (var m = 0; m < i.length; m++) (i[m].BetItemId <= 49 ? n : s).push(i[m]);
            for ($.each(i, function (t, e) {
                (t < 49 ? r : d).push(e)
            }); d[h] && 7 == d[h].BetTypeId;) e = d.splice(h, 1), d.splice(l, 0, e[0]), l += 3, h += 1;
            $.each(d, function (t, e) {
                e.text = c[t][0], e.title = c[t][1], e.no = c[t][2], e.BetItemName = u, u++
            }), n.sort(function (t, e) {
                return t.BetItemId - e.BetItemId
            });
            for (var p = 0; p < n.length; p++) p % 10 == 0 && 0 < p && a++, o[a] || (o[a] = []), o[a].push(n[p]);
            o.push(s), t.Data.screenMappingOdds = o
        }
    }, zhengma: function (t) {
        var e = t.Data.Odds, i = [], n = [], s = [], o = 0, a = 50, r = [], d = [],
            l = [["总单", "总数单", "总单"], ["总双", "总数双", "总双"], ["总大", "总数大", "总大"], ["总小", "总数小", "总小"], ["总分尾大", "总数尾大", "总分尾大"], ["总分尾小", "总数尾小", "总分尾小"]];
        if (e) {
            for (var h = 0; h < e.length; h++) (e[h].BetItemId <= 49 ? i : n).push(e[h]);
            $.each(e, function (t, e) {
                (t < 49 ? r : d).push(e)
            }), $.each(d, function (t, e) {
                e.text = l[t][0], e.title = l[t][1], e.no = l[t][2], e.BetItemName = a, a++
            }), i.sort(function (t, e) {
                return t.BetItemId - e.BetItemId
            });
            for (var u = 0; u < i.length; u++) u % 10 == 0 && 0 < u && o++, s[o] || (s[o] = []), s[o].push(i[u]);
            s.push(n), t.Data.Odds = s, t.Data.OriginalOdds = e
        }
    }, zhengtema: function (t) {
        var e, i = t.Data.Odds, n = [], s = [], o = [], a = 0, r = 50, d = [], l = [], h = 2, u = 6, c = "特码";
        switch (t.Data.FrontGroupId) {
            case 4:
                c = "正1";
                break;
            case 5:
                c = "正2";
                break;
            case 6:
                c = "正3";
                break;
            case 7:
                c = "正4";
                break;
            case 8:
                c = "正5";
                break;
            case 9:
                c = "正6"
        }
        if (title = [["单", c + "单", "单"], ["双", c + "双", "双"], ["红色", c + "红", "红"], ["大", c + "大", "大"], ["小", c + "小", "小"], ["蓝色", c + "蓝", "蓝"], ["合单", c + "合数单", "合单"], ["合双", c + "合数双", "合双"], ["绿色", c + "绿", "绿"]], i) {
            for (var m = 0; m < i.length; m++) (i[m].BetItemId <= 49 ? n : s).push(i[m]);
            for ($.each(i, function (t, e) {
                (t < 49 ? d : l).push(e)
            }); l[u] && 2 == l[u].BetItemName.length;) e = l.splice(u, 1), l.splice(h, 0, e[0]), h += 3, u += 1;
            $.each(l, function (t, e) {
                e.text = title[t][0], e.title = title[t][1], e.no = title[t][2], e.BetItemName = r, r++
            }), n.sort(function (t, e) {
                return t.BetItemId - e.BetItemId
            });
            for (var p = 0; p < n.length; p++) p % 10 == 0 && 0 < p && a++, o[a] || (o[a] = []), o[a].push(n[p]);
            o.push(s), t.Data.Odds = o, t.Data.OriginalOdds = i
        }
    }, shengxiao: function (t) {
        t.Data.OriginalOdds = t.Data.Odds, $.each(t.Data.Odds, function (t, i) {
            $.each(G.Animal, function (t, e) {
                if (i.BetItemName === e.animal) return i.Numbers = e.num, !1
            })
        })
    }, weishu: function (t) {
        t.Data.OriginalOdds = t.Data.Odds, $.each(t.Data.Odds, function (t, e) {
            e.Numbers = G.weishu[t].numbers
        })
    }, banbo: function (t) {
        t.Data.OriginalOdds = t.Data.Odds;
        var e = t.Data.Odds, i = t.Data.DrawStatistic ? t.Data.DrawStatistic.ContinuousNotDraw : [],
            n = [["01", "07", "13", "19", "23", "29", "35", "45"], ["02", "08", "12", "18", "24", "30", "34", "40", "46"], ["29", "30", "34", "35", "40", "45", "46"], ["01", "02", "07", "08", "12", "13", "18", "19", "23", "24"], ["03", "09", "15", "25", "31", "37", "41", "47"], ["04", "10", "14", "20", "26", "36", "42", "48"], ["25", "26", "31", "36", "37", "41", "42", "47", "48"], ["03", "04", "09", "10", "14", "15", "20"], ["05", "11", "17", "21", "27", "33", "39", "43"], ["06", "16", "22", "28", "32", "38", "44"], ["27", "28", "32", "33", "38", "39", "43", "44"], ["05", "06", "11", "16", "17", "21", "22"]],
            s = e.splice(6, 2), o = e.splice(6, 2);
        e.splice(2, 0, s[0], s[1]), e.splice(6, 0, o[0], o[1]), $.each(e, function (t, e) {
            e.Title = "特码" + e.BetItemName, e.Numbers = n[t]
        }), t.Data.Odds = e, 0 < i.length && (s = i.splice(6, 2), o = i.splice(6, 2), i.splice(2, 0, s[0], s[1]), i.splice(6, 0, o[0], o[1]), t.Data.DrawStatistic.ContinuousNotDraw = i)
    }, liuxiao: function (t) {
        t.Data.OriginalOdds = t.Data.Odds;
        var e = [];
        $.each(G.shengxiao, function (t, i) {
            $.each(G.Animal, function (t, e) {
                if (i.name === e.animal) {
                    i.Numbers = e.num.slice();
                    e = $.inArray("49", i.Numbers);
                    return -1 < e && i.Numbers.splice(e, 1), !1
                }
            }), e.push(i)
        }), t.Data.Odds2 = e
    }, texiao: function (t) {
        t.Data.OriginalOdds = t.Data.Odds, $.each(t.Data.Odds, function (t, i) {
            $.each(G.Animal, function (t, e) {
                if (i.BetItemName === e.animal) return i.Numbers = e.num, !1
            })
        })
    }, shengxiaolian: function (t) {
        t.Data.OriginalOdds = t.Data.Odds, $.each(t.Data.Odds, function (t, i) {
            $.each(G.Animal, function (t, e) {
                if (i.BetItemName === e.animal) return i.Numbers = e.num, !1
            })
        })
    }, weishulian: function (t) {
        t.Data.OriginalOdds = t.Data.Odds, $.each(t.Data.Odds, function (t, e) {
            e.Numbers = G.weishu[t].numbers
        })
    }, buzhong: function (t) {
        var e = t.Data.Odds, i = t.Data.Odds, n = [], s = 0;
        i.sort(function (t, e) {
            return t.BetItemId - e.BetItemId
        });
        for (var o = 0; o < i.length; o++) o % 10 == 0 && 0 < o && s++, n[s] || (n[s] = []), n[s].push(i[o]);
        t.Data.Odds = n, t.Data.OriginalOdds = e
    }, duoxuanzhongyi: function (t) {
        var e = t.Data.Odds, i = t.Data.Odds, n = [], s = 0;
        i.sort(function (t, e) {
            return t.BetItemId - e.BetItemId
        });
        for (var o = 0; o < i.length; o++) o % 10 == 0 && 0 < o && s++, n[s] || (n[s] = []), n[s].push(i[o]);
        t.Data.Odds = n, t.Data.OriginalOdds = e
    }, tepingzhong: function (t) {
        var e = t.Data.Odds, i = t.Data.Odds, n = [], s = 0;
        i.sort(function (t, e) {
            return t.BetItemId - e.BetItemId
        });
        for (var o = 0; o < i.length; o++) o % 10 == 0 && 0 < o && s++, n[s] || (n[s] = []), n[s].push(i[o]);
        t.Data.Odds = n, t.Data.OriginalOdds = e
    }, hexiao: function (t) {
        t.Data.OriginalOdds = t.Data.Odds, $.each(t.Data.Odds, function (t, i) {
            $.each(G.Animal, function (t, e) {
                if (i.BetItemName === e.animal) {
                    i.Numbers = e.num.slice();
                    e = $.inArray("49", i.Numbers);
                    return -1 < e && i.Numbers.splice(e, 1), !1
                }
            })
        })
    }, qima: function (t) {
        for (var e = t.Data.Odds, i = [], n = 0, s = 0; s < t.Data.Odds.length; s++) s % 8 == 0 && 0 < s && n++, i[n] || (i[n] = []), i[n].push(e[s]);
        t.Data.Odds = i, t.Data.OriginalOdds = e
    }, wuxing: function (t) {
        t.Data.OriginalOdds = t.Data.Odds;
        var i = [["01", "06", "11", "16", "21", "26", "31", "36", "41", "46"], ["02", "07", "12", "17", "22", "27", "32", "37", "42", "47"], ["03", "08", "13", "18", "23", "28", "33", "38", "43", "48"], ["04", "09", "14", "19", "24", "29", "34", "39", "44", "49"], ["05", "10", "15", "20", "25", "30", "35", "40", "45"]];
        $.each(t.Data.Odds, function (t, e) {
            e.Numbers = i[t]
        })
    }, yixiaoliang: function (t) {
        for (var e = t.Data.Odds, i = [], n = 0, s = 0; s < t.Data.Odds.length; s++) s % 3 == 0 && 0 < s && n++, i[n] || (i[n] = []), i[n].push(e[s]);
        t.Data.Odds = i, t.Data.OriginalOdds = e
    }, weishuliang: function (t) {
        for (var e = t.Data.Odds, i = [], n = 0, s = 0; s < t.Data.Odds.length; s++) s % 3 == 0 && 0 < s && n++, i[n] || (i[n] = []), i[n].push(e[s]);
        t.Data.Odds = i, t.Data.OriginalOdds = e
    }, weishubuzhong: function (t) {
        t.Data.OriginalOdds = t.Data.Odds;
        var i = [], n = 0;
        $.each(t.Data.Odds, function (t, e) {
            t % 5 == 0 && 0 < t && n++, i[n] || (i[n] = []), e.Numbers = G.weishu[t].numbers, i[n].push(e)
        }), t.Data.Odds = i
    }, lianma: function (s) {
        var e = [], t = G.weishu, i = [], n = [], o = s.Data.Odds;
        if ($.each(G.shengxiao, function (t, i) {
            $.each(G.Animal, function (t, e) {
                if (i.name == e.animal) return i.numbers = e.num.slice(), !1
            }), e.push(i)
        }), $.each(e, function (t, n) {
            n.Odds = [], $.each(n.numbers, function (t, i) {
                var e = $.grep(s.Data.Odds, function (t, e) {
                    return t.BetItemName == i
                });
                n.Odds.push(e[0])
            })
        }), $.each(t, function (t, n) {
            n.Odds = [], $.each(n.numbers, function (t, i) {
                var e = $.grep(s.Data.Odds, function (t, e) {
                    return t.BetItemName == i
                });
                n.Odds.push(e[0])
            })
        }), n = e.concat(t)) for (var a = 0, r = n.length; a < r; a++) {
            n[a].totalOdds = [];
            for (var d = 0, l = n[a].Odds.length; d < l; d++) n[a].totalOdds.push(n[a].Odds[d].Odds1 + (0 == n[a].Odds[d].Odds2 ? "" : "/" + n[a].Odds[d].Odds2))
        }
        i[0] = e.slice(0, e.length / 2), i[1] = e.slice(e.length / 2, e.length), i[2] = t.slice(0, t.length / 2), i[3] = t.slice(t.length / 2, t.length);
        var h = [], u = [], c = [], m = 0;
        if (o) {
            for (a = 0; a < o.length; a++) (o[a].BetItemId <= 49 ? h : u).push(o[a]);
            h.sort(function (t, e) {
                return t.BetItemId - e.BetItemId
            });
            for (var p = 0; p < h.length; p++) p % 10 == 0 && 0 < p && m++, c[m] || (c[m] = []), c[m].push(h[p]);
            c.push(u), s.Data.oddsMapList = c
        }
        return s.Data.ShengWeiMapList = i, s.Data.WeishuMapList = t, s.Data.AnimalMapList = e, s
    }, guoguan: function (t) {
        var e = t.Data.Odds, i = [], n = 0;
        if (e) for (var s = 0; s < e.length; s++) s % 4 == 0 && 0 < s && n++, i[n] || (i[n] = []), 94 < parseInt(e[s].BetItemId) && (e[s].BetItemName = "正" + e[s].BetItemName), i[n].push(e[s]);
        t.Data.Odds = i, t.Data.OriginalOdds = e
    }, siquanzhong: function (t) {
        var e = t.Data.Odds, i = t.Data.Odds, n = [], s = 0;
        i.sort(function (t, e) {
            return t.BetItemId - e.BetItemId
        });
        for (var o = 0; o < i.length; o++) o % 10 == 0 && 0 < o && s++, n[s] || (n[s] = []), n[s].push(i[o]);
        t.Data.Odds = n, t.Data.OriginalOdds = e
    }
}, G.helper = {
    getNumberColor: function (t) {
        return G.constColor[t = parseInt(t, 10)]
    }, getBallColor: function (t) {
        return G.helper.getNumberColor(t) + "-ball"
    }, getNumberBgColor: function (t) {
        return G.helper.getNumberColor(t) + "-bg"
    }, encodeHTML: function (t) {
        return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
    }, decodeHTML: function () {
        var e = document.createElement("textarea");
        return function (t) {
            return e.innerHTML = t, e.value
        }
    }(), ceilNum: function (t) {
        return isNaN(t) ? 0 : (t = parseFloat(t)) <= 0 ? Math.floor(t) : Math.ceil(t)
    }, toFixed2: function (t) {
        return evenRound.apply(this, [t, 2])
    }, format_fix3: function (t, e) {
        return isNaN(+t) ? t : evenRound.apply(this, [t, e])
    }, format_sub3: function (t, e) {
        var i = 0, n = "", s = (t + "").split(".");
        if (s[1] = s[1] ? s[1] : "", e <= 0) return s[0];
        for (i = 0; i < e; i++) s[1][i] && (n += s[1][i]);
        return "" == s[1] ? s[0] : parseFloat(s[0] + "." + n)
    }, getAnimalNo: function (t) {
        var e = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];
        return G.code_class[e[t]] ? G.code_class[e[t]].join() : ""
    }, isNumber: function (t) {
        return !isNaN(t)
    }, decode: function (t) {
        return t = G.util.decodeHTML(t)
    }, thousands: function (t) {
        return t ? G.util.format_thousands(t) : t
    }
}, BetHistoryDetail.prototype.init = function () {
    var t = this;
    this.tbody = $("#tbody"), this.tpl_history_detail_body = $("#tpl_detailbody").html(), this.d.on("change", "select#qryBetTypeGroup", function () {
        t.doQueryHistory(this)
    }), this.d.on("click", ".fn-show-details", function () {
        var t = this.getAttribute("PeriodCode"), e = this.getAttribute("BetId"), i = this.getAttribute("groupid"),
            n = this.getAttribute("pageIndex");
        window.open("#!history.order|order?detailCombo=1&getinfo=1&groupid=1&PeriodCode=" + t + "&BetId=" + e + "&groupid=" + i + "&pageIndex= " + n, "组合清单", "width=1024,height=400,left=100,top=100,menubar=no,toolbar=no")
    })
}, BetHistoryDetail.prototype.doQueryHistory = function (t) {
    var e = $(t).val();
    loadModule({
        html: this.tpl_history_detail_body,
        json: G.map.history.json.detail,
        param: $.unparam(e),
        bd: this.tbody,
        jsonSuccess: function (t) {
            $("td[id*='betTypeName']").text($("#qryBetTypeGroup option:selected").text());
            $("#pager").attr("param", e);
            return doc.triggerHandler("pagereset", [t, e]), G.map.history.format.detail(t)
        }
    })
}, G.modules.bethistorydetail = BetHistoryDetail, BetDetail.prototype.init = function () {
    var t = this;
    this.bettypeids = $("#bettypeids"), this.tbody = $("#tbody"), this.tpl_list = $("#tpl_list").html(), this.form = $("form", this.d), this.form.on("change", ":radio, select", function () {
        t.doQuery(this)
    }), this.d.on("click", ".fn-print", function () {
        t.d.printArea()
    }), this.tpl_history_list = $("#tpl_list2").html(), this.d.on("change", "select#qryBetTypeGroup", function () {
        t.doQueryHistory(this)
    }), this.d.on("click", ".goback", function () {
        var t = G.util.getHash(), e = G.util.formatHash(t), t = $(this).attr("href");
        t += "&pageIndex=" + e.param.pageIndex, $(this).attr("href", t)
    }), this.d.on("click", ".fn-daterange", function () {
        var t = this.getAttribute("start"), e = this.getAttribute("end");
        "true" == $.trim(this.getAttribute("isexist")) ? $.alert("日期区间内查无相关数据!") : ($("select[name=StartDt]").val(t), $("select[name=EndDt]").val(e))
    }), this.d.on("click", ".fn-query", function () {
        var t = "StartDt=" + $("select[name=StartDt]").val() + "&EndDt=" + $("select[name=EndDt]").val();
        loadModule({
            html: $("#tpl_list1").html(),
            json: G.map.history.json.history,
            param: $.unparam(t),
            bd: $(".fn-hover"),
            jsonSuccess: function (t) {
                return G.map.history.format.history(t)
            },
            jsonError: function (t) {
                $.alert(t)
            }
        })
    })
}, BetDetail.prototype.doQueryHistory = function (t) {
    var e = $(t).val();
    loadModule({
        html: this.tpl_history_list,
        json: G.map.history.json.detail,
        param: $.unparam(e),
        bd: this.tbody,
        jsonSuccess: function (t) {
            $("#pager").attr("param", e);
            return doc.triggerHandler("pagereset", [t, e]), G.map.history.format.detail(t)
        }
    })
}, BetDetail.prototype.doQuery = function (t) {
    "SELECT" == t.tagName && this.bettypeids.val(t.options[t.selectedIndex].getAttribute("bettypeids"));
    var e = decodeURIComponent(this.form.serialize());
    loadModule({
        html: this.tpl_list,
        json: G.map.betdetail.json.betdetail,
        param: e,
        bd: this.tbody,
        jsonSuccess: function (t) {
            return doc.triggerHandler("pagereset", [t, e]), format_betdetail(t)
        }
    })
}, G.modules.betdetail = BetDetail, function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            9: !1,
            10: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "特码",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "特码" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "特码" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "特码",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "半波",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.banbo = t
}), BetDetailCom.prototype.init = function () {
    var t = this;
    this.bettypeids = $("#bettypeids"), this.tbody = $("#tbody"), this.form = $("form", this.d), this.tpl_betdetail_detail_body = $("#tpl_betdetailbody").html(), t.bindDomForAbbr(this), this.d.on("change", "select#qryBetTypeGroup", function () {
        t.doQueryHistory(this)
    })
}, BetDetailCom.prototype.doQueryHistory = function (t) {
    var e = t.options[t.selectedIndex].getAttribute("bettypeids"),
        t = t.options[t.selectedIndex].getAttribute("playTypeId");
    data = "PlayTypeId=" + t + "&betTypeIds=" + e, loadModule({
        html: this.tpl_betdetail_detail_body,
        json: G.map.betdetail.json.betdetail,
        param: data,
        bd: this.tbody,
        jsonSuccess: function (t) {
            $("abbr[id*='betTypeName']").text($("#qryBetTypeGroup option:selected").text());
            $("#pager").attr("param", data);
            return doc.triggerHandler("pagereset", [t, data]), G.map.betdetail.format.betdetail(t)
        }
    })
}, BetDetailCom.prototype.bindDomForAbbr = function (t) {
    var e, i = $("#PlayTypeId").val(), n = $("#BetTypeId").val();
    0 < i && (e = "", "1" === i && "1" === n ? e = "特码A" : "1" === i && "2" === n ? e = "特码B" : "2" === i ? e = "正码" : "3" === i ? e = "正特码" : "4" === i ? e = "二全中" : "5" === i ? e = "二中特" : "6" === i ? e = "二特串" : "7" === i ? e = "三全中" : "8" === i ? e = "三中二" : "9" === i ? e = "过关" : "10" === i ? e = "生肖" : "11" === i ? e = "尾数" : "12" === i ? e = "半波" : "13" === i ? e = "六肖" : "14" === i ? e = "两面" : "15" === i ? e = "色波" : "16" === i ? e = "特肖" : "17" === i ? e = "二肖连" : "18" === i ? e = "三肖连" : "19" === i ? e = "四肖连" : "20" === i ? e = "五肖连" : "21" === i ? e = "二尾连" : "22" === i ? e = "三尾连" : "23" === i ? e = "四尾连" : "24" === i ? e = "五不中" : "25" === i ? e = "六不中" : "26" === i ? e = "七不中" : "27" === i ? e = "八不中" : "28" === i ? e = "九不中" : "29" === i ? e = "十不中" : "30" === i ? e = "十一不中" : "31" === i ? e = "十二不中" : "32" === i ? e = "五中一" : "33" === i ? e = "六中一" : "34" === i ? e = "七中一" : "35" === i ? e = "八中一" : "36" === i ? e = "九中一" : "37" === i ? e = "十中一" : "38" === i ? e = "一粒任中" : "39" === i ? e = "二粒任中" : "40" === i ? e = "三粒任中" : "41" === i ? e = "四粒任中" : "42" === i ? e = "五粒任中" : "43" === i ? e = "二合肖" : "44" === i ? e = "三合肖" : "45" === i ? e = "四合肖" : "46" === i ? e = "五合肖" : "47" === i ? e = "七码" : "48" === i ? e = "五行" : "49" === i ? e = "一肖量" : "50" === i ? e = "尾数量" : "51" === i ? e = "四全中" : "52" === i ? e = "一比一" : "53" === i ? e = "一比二" : "54" === i ? e = "一比三" : "55" === i ? e = "一比四" : "56" === i ? e = "一比五" : "57" === i && (e = "一比六"), $("abbr[id*='betTypeName']").text(e), $("#qryBetTypeGroup option:selected").text(e))
}, G.modules.betdetailcom = BetDetailCom, function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.groupid = [82, 83, 84, 85, 86, 87], this.BetType = t.json.Param.type, this.playType = 0, this.data_odds = this.json.Data.Odds, this.param_oddsloop = {groupid: this.groupid[this.BetType - 1]}, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.BetTypeName = {
            1: "一比一",
            2: "一比二",
            3: "一比三",
            4: "一比四",
            5: "一比五",
            6: "一比六"
        }, this.betcount = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6}, this.betMinCount = {
            1: 2,
            2: 3,
            3: 4,
            4: 5,
            5: 6,
            6: 7
        }, this.playTypeName = "比大小", this.array_bettypeid = {
            106: !1,
            107: !1,
            108: !1,
            109: !1,
            110: !1,
            111: !1
        }, this.bettypeIds = {
            1: 106,
            2: 107,
            3: 108,
            4: 109,
            5: 110,
            6: 111,
            7: 112
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("input[name=bet_money]").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.stand = $(".stand", this.d).on("click", function () {
            var t = $(this).children("input:radio[name=left]");
            !0 !== t.prop("disabled") && (t.prop("checked", !0), t = t.val(), (t = $("input[name=number][value=" + t + "]")) && t.prop("checked") && t.prop("checked", !1))
        }), this.number = $("input[name=number]", this.d).on("click", function () {
            var t, e = $(this);
            e.prop("checked") && (t = $("input:radio[name=left]:checked").val(), e.attr("value") === t && $("input:radio[name=left]").prop("checked", !1))
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.doSave = function (t) {
        var i, n = {}, e = $("input:radio[name=left]:checked");
        0 !== e.length ? (i = parseInt(this.betmoney.val().replace(/\,/g, "")), (n = {
            BetTypeId: this.bettypeIds[this.BetType],
            PlayTypeName: this.playTypeName,
            BetTypeName: this.BetTypeName[this.BetType],
            BetType: this.BetType,
            BetMoney: 0,
            List: [],
            Array: [],
            LeftItem: {
                BetItemId: e.attr("betItemId"),
                BetName: e.attr("betitemname"),
                Odds: $.trim($("#" + this.bettypeIds[this.BetType] + "_" + e.attr("betItemId")).text())
            }
        }).BetItems = [n.LeftItem.BetItemId], this.number.each(function () {
            var t, e = $(this);
            e.prop("checked") && (t = e.attr("betItemId"), n.Array.push({
                BetName: e.attr("betItemName"),
                BetItemId: t,
                BetMoney: i,
                Odds: n.LeftItem.Odds
            }), n.BetItems.push(t))
        }), e = this.betMinCount[this.BetType], n.BetItems.length < e ? $.alert("您选择的项目需大于" + e + "项") : ((e = n.Array.slice(0)).unshift(n.LeftItem), n.BallNo = arraymap(e, function (t) {
            return t.BetName
        }).join(), n.List = combin(n.Array, this.betcount[this.BetType]), n.BetMoney = i, n.TotelMoney = i * n.List.length, e = $("#bet_confirm_tpl").html(), $.dialog({
            title: "比大小",
            html: e,
            cls: "dialog-confirm dialog-confirm1",
            param: n
        }))) : $.alert("请选择投注项目")
    }, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1), this.stand.children("input:radio[name=left]").prop("checked", !1), this.betmoney.val("")
    }, G.modules.bidaxiao = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betcount = {
            37: [5, 8, 4],
            38: [6, 9, 5],
            39: [7, 10, 6],
            40: [8, 10, 7],
            41: [9, 11, 8],
            42: [10, 12, 9],
            51: [11, 13, 10],
            52: [12, 14, 11]
        }, this.ptname = {
            37: "五不中",
            38: "六不中",
            39: "七不中",
            40: "八不中",
            41: "九不中",
            42: "十不中",
            51: "十一不中",
            52: "十二不中"
        }, this.btname = {
            1: "复式投注",
            2: "拖胆投注"
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            66: !1,
            67: !1,
            68: !1,
            69: !1,
            70: !1,
            71: !1,
            76: !1,
            77: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    function r(t, e) {
        for (var i, n = [], s = 0, o = t.length; s < o; s++) (i = e(t[s], s)) && n.push(i);
        return n
    }

    function d(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.oddsElem = $(".odds-display"), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".fn-check-items", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i = t.getAttribute("betitemid"), n = t.getAttribute("betitemname"), s = this.betcount[this.groupid][1],
            o = this.betcount[this.groupid][2], a = $(".area-a");
        if (1 === this.selectType) {
            if (t.checked) {
                if (!(this.selected1.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                this.selected1.push(i), this.head.push(n)
            } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.head, n);
            this.head.sort(d), a.html("【<span class='blue'>" + this.head.join(",") + "</span>】")
        } else if (2 === this.selectType) {
            if (0 !== this.selected1.length && $(t).hasClass("checkbox-disable")) return e.preventDefault(), void e.stopPropagation();
            if (this.selected2.length < o) $(t).hasClass("checkbox-disable") ? ($(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n)) : ($(t).addClass("checkbox-disable"), this.selected2.push(i), this.head.push(n)), this.head.sort(d), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 "); else {
                if (t.checked) {
                    if (!(this.selected1.length + this.selected2.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                    this.selected1.push(i), this.tail.push(n)
                } else if ($(t).hasClass("checkbox-disable")) {
                    if (0 !== this.selected1.length) return;
                    $(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 ")
                } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.tail, n);
                this.tail.sort(d), $(".area-b").html("【<span class='blue'>" + this.tail.join(",") + "</span>】")
            }
        }
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1).removeClass("checkbox-disable"), this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betmoney.val(""), $(".area-a").html("【请选择】"), $(".area-b").html("")
    }, t.prototype.doSave = function (t) {
        var i = this, n = [], s = {}, o = [], a = parseInt(this.betmoney.val().replace(/\,/g, "")),
            e = this.betcount[this.groupid][0];
        1 === this.selectType && this.selected1.length < e || 2 === this.selectType && !this.selected1.length ? $.alert("选择不够多了11!") : (s = {
            BetTypeId: this.data_odds[0].BetTypeId,
            PlayTypeName: this.ptname[this.groupid],
            BetTypeName: this.btname[this.selectType],
            BetType: this.selectType,
            MoneyPerBet: a,
            List: [],
            Array: []
        }, 1 === this.selectType ? (s.BetItems = this.selected1.sort(d), $(this.selected1).each(function (t, e) {
            i.number.each(function () {
                if (this.getAttribute("betitemid") === e) return s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                }), !1
            })
        }), s.List = combin(s.Array, e), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * s.List.length, s.BallNo = r(s.Array, function (t) {
            return t.BetName
        }).join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()) : 2 === this.selectType && (this.selected2.sort(d), s.BetItems = this.selected2.concat(this.selected1.sort(d)), $.each(s.BetItems, function (t, e) {
            i.number.each(function () {
                this.getAttribute("betitemid") === e && s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                })
            })
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected2) && o.push(e)
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected1) && s.List.push([].concat(o, [e]))
        }), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * this.selected1.length, s.Lead = this.selected2, s.BallNo = this.head.join() + " 拖 " + this.tail.join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()), e = $("#bet_confirm_tpl").html(), $.dialog({
            title: "不中",
            cls: "dialog-confirm dialog-confirm1",
            html: e,
            param: s
        }))
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 === t ? (n = i[0], s = i[1]) : (+n > +i[0] && (n = i[0]), s && +s > +i[1] && (s = i[1]))
        }), n + (s ? "," + s : "")
    }, G.modules.buzhong = t
});
var config = {
    color: {
        red: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
        blue: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
        green: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
    },
    plays: {
        1: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
        2: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
        3: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
        4: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49],
        5: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
        6: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
        7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        8: [1, 3, 5, 7, 9, 10, 12, 14, 16, 18, 21, 23, 25, 27, 29, 30, 32, 34, 36, 38, 41, 43, 45, 47, 49],
        9: [2, 4, 6, 8, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 31, 33, 35, 37, 39, 40, 42, 44, 46, 48],
        10: [5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 25, 26, 27, 28, 29, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49],
        11: [1, 2, 3, 4, 11, 12, 13, 14, 21, 22, 23, 24, 31, 32, 33, 34, 41, 42, 43, 44, 10, 20, 30, 40]
    },
    playsName: {
        tema: {name: "特码", confirmType: 1},
        zhengma: {name: "正码", confirmType: 1},
        zhengtema: {name: "正特码", confirmType: 1},
        qita: {name: "其它", confirmType: 1},
        lianma: {
            name: "连码",
            confirmType: 2,
            gid: {1: "复式", 2: "托头", 3: "生肖对碰", 4: "尾数对碰", 5: "生肖对碰", 6: "任意对碰"},
            uid: {280: "二全中", 281: "二中特", 282: "特串", 283: "三全中", 284: "三中二"}
        },
        liuxiao: {name: "六肖", confirmType: 3},
        yixiao: {name: "一肖", confirmType: 1},
        weishu: {name: "尾数", confirmType: 1},
        duoxuanbuzhong: {
            name: "多选不中",
            confirmType: 2,
            uid: {300: "五不中", 301: "六不中", 302: "七不中", 303: "八不中", 304: "九不中", 305: "十不中"}
        },
        duoxuanzhongyi: {
            name: "多选中一",
            confirmType: 2,
            uid: {320: "五中一", 321: "六中一", 322: "七中一", 323: "八中一", 324: "九中一", 325: "十中一"}
        },
        tepingzhong: {
            name: "特平中",
            confirmType: 2,
            uid: {326: "一粒任中", 327: "二粒任中", 328: "三粒任中", 329: "四粒任中", 330: "五粒任中"}
        },
        shengxiaolian: {
            name: "生肖连",
            confirmType: 2,
            uid: {
                306: "二肖连中",
                307: "三肖连中",
                308: "四肖连中",
                309: "五肖连中",
                310: "二肖连不中",
                311: "三肖连不中",
                312: "四肖连不中",
                313: "五肖连不中"
            }
        },
        weishulian: {
            name: "尾数连",
            confirmType: 2,
            uid: {314: "二尾连中", 315: "三尾连中", 316: "四尾连中", 317: "二尾连不中", 318: "三尾连不中", 319: "四尾连不中"}
        }
    },
    category: {
        animal1: [61, 66, 67, 69, 70, 71],
        animal2: [60, 62, 63, 64, 65, 68],
        weidan: [50, 52, 54, 56, 58],
        weishuang: [51, 53, 55, 57, 59],
        weida: [55, 56, 57, 58, 54],
        weixiao: [50, 51, 52, 53, 59]
    },
    code_class: {
        "单": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49],
        "双": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
        "大": [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
        "小": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        "大单": [25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49],
        "大双": [26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48],
        "小单": [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
        "小双": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24],
        "合单": [1, 3, 5, 7, 9, 10, 12, 14, 16, 18, 21, 23, 25, 27, 29, 30, 32, 34, 36, 38, 41, 43, 45, 47, 49],
        "合双": [2, 4, 6, 8, 11, 13, 15, 17, 19, 20, 22, 24, 26, 28, 31, 33, 35, 37, 39, 40, 42, 44, 46, 48],
        "尾大": [5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 25, 26, 27, 28, 29, 35, 36, 37, 38, 39, 45, 46, 47, 48, 49],
        "尾小": [1, 2, 3, 4, 10, 11, 12, 13, 14, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34, 40, 41, 42, 43, 44],
        "红波": [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
        "蓝波": [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
        "绿波": [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49],
        "红单": [1, 7, 13, 19, 23, 29, 35, 45],
        "蓝单": [3, 9, 15, 25, 31, 37, 41, 47],
        "绿单": [5, 11, 17, 21, 27, 33, 39, 43, 49],
        "红双": [2, 8, 12, 18, 24, 30, 34, 40, 46],
        "蓝双": [4, 10, 14, 20, 26, 36, 42, 48],
        "绿双": [6, 16, 22, 28, 32, 38, 44],
        "红大": [29, 30, 34, 35, 40, 45, 46],
        "蓝大": [25, 26, 31, 36, 37, 41, 42, 47, 48],
        "绿大": [27, 28, 32, 33, 38, 39, 43, 44, 49],
        "红小": [1, 2, 7, 8, 12, 13, 18, 19, 23, 24],
        "蓝小": [3, 4, 9, 10, 14, 15, 20],
        "绿小": [5, 6, 11, 16, 17, 21, 22],
        "家禽": [],
        "野兽": [],
        "鼠": [],
        "牛": [],
        "虎": [],
        "兔": [],
        "龙": [],
        "蛇": [],
        "马": [],
        "羊": [],
        "猴": [],
        "鸡": [],
        "狗": [],
        "猪": []
    },
    constColor: function () {
        var t, e = {}, i = {
            red: [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46],
            blue: [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48],
            green: [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
        };
        for (t in i) for (var n = 0, s = i[t].length; n < s; n++) e[i[t][n]] = t;
        return e
    }()
};

function MemberInfo(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function MarqueeForm(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function OrderConfirm(t) {
    this.d = $(t), this.id = t.id, this.json = this.d[0].json, this.Data = t.json.Param.List, this.ParentId = t.json.Param.parent, this.UseLastOdds = !1
}

function Pager(t) {
    this.d = $(t), this.dom = {}, this.id = t.id, this.json = t.json
}

function PasswordCom(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function ProfitsForm(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function DrawNo(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function Rule(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

function StatisticsForm(t) {
    this.d = $(t), doc.triggerHandler("renew.load")
}

$.extend(G, config), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.first = [], this.second = [], this.third = {}, this.betcount = {
            54: [5, 8, 4],
            55: [6, 9, 5],
            56: [7, 10, 6],
            57: [8, 10, 7],
            58: [9, 11, 8],
            59: [10, 12, 9]
        }, this.ptname = {54: "五中一", 55: "六中一", 56: "七中一", 57: "八中一", 58: "九中一", 59: "十中一"}, this.btname = {
            1: "复式投注",
            3: "多组投注"
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            78: !1,
            79: !1,
            80: !1,
            81: !1,
            82: !1,
            83: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    function c(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.oddsElem = $(".odds-display"), this.betmoney = $("#betmoney").input_digits(), this.d.on("click", ".fn-check-items", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i = t.getAttribute("title"), n = this.betcount[this.groupid][0], s = this.betcount[this.groupid][1],
            o = $(".area-a"), a = this;
        if (1 === this.selectType) {
            if (t.checked) {
                if (!(this.first.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                this.first.push(i)
            } else {
                for (var r = 0, d = a.first.length; r < d && a.first[r] !== i; r++) ;
                a.first.splice(r, 1)
            }
            a.first = a.first.sort(c), o.html("【<span class='blue'>" + a.first.join(",") + "</span>】")
        } else {
            var l, h, s = $(".fn-check-items:checked"), u = 0;
            for (l in this.third) this.third.hasOwnProperty(l) && u++;
            if (5 === u) return e.preventDefault(), void $.alert("最多只能勾选5组球号");
            s.length === n && (h = [], s.each(function (t, e) {
                h.push(e.getAttribute("title"))
            }), h = h.sort(c), this.third[h.join(",")] ? ($.alert("球号已存在"), e.preventDefault()) : (0 === u ? o.html("【<span class='blue'>" + h.join(",") + "</span>】") : o.append("【<span class='blue'>" + h.join(",") + "</span>】"), this.third[h.join(",")] = h, s.prop("checked", !1)))
        }
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1), this.first = [], this.second = [], this.third = {}, this.betmoney.val(""), $(".area-a").html("【请选择】")
    }, t.prototype.doSave = function (t) {
        var i = this, n = [], s = {}, o = {}, a = [], r = [], e = [],
            d = parseInt(this.betmoney.val().replace(/\,/g, "")), l = this.betcount[this.groupid][0];
        if (1 === this.selectType && this.first.length < l || 3 === this.selectType && $.isEmptyObject(this.third)) $.alert("选择不够多了22!"); else {
            if (s = {
                BetTypeId: this.data_odds[0].BetTypeId,
                PlayTypeName: this.ptname[this.groupid],
                BetTypeName: this.btname[this.selectType],
                BetType: this.selectType,
                MoneyPerBet: d,
                List: [],
                Array: []
            }, 1 === this.selectType) s.BetItems = this.first.sort(c), s.BallNo = s.BetItems.join(), $(this.first).each(function (t, e) {
                i.number.each(function () {
                    if (this.title === e) return s.Array.push({
                        BetName: this.title,
                        BetItemId: this.getAttribute("betitemid"),
                        Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                        BetMoney: d
                    }), !1
                })
            }), s.List = combin(s.Array, l), $.each(s.List, function (t, e) {
                n.push(i.getMinOdds(e).split(","))
            }), s.MinOdds = n, s.BetMoney = d * s.List.length, s.SummaryOdds = s.Array.map(function (t) {
                return t.Odds
            }).join(); else if (3 === this.selectType) {
                for (var h in this.third) this.third.hasOwnProperty(h) && e.push(h);
                s.BetItems = function (t, e) {
                    for (var i, n, s = 0, o = t.length, a = [], r = {}; s < o; s++) n = t[s], i = e ? e(n) : n, r[i] || (r[i] = !0, a.push(n));
                    return a
                }(e.join().split(",").sort(c)), s.BallNo = s.BetItems.join(), $(s.BetItems).each(function (t, e) {
                    i.number.each(function () {
                        if (this.title === e) return o[e] = {
                            BetName: this.title,
                            BetItemId: this.getAttribute("betitemid"),
                            Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                            BetMoney: d
                        }, s.Array.push(o[e]), !1
                    })
                }), $.each(this.third, function (t, e) {
                    a = [], $.each(e, function (t, e) {
                        a.push(o[e])
                    }), s.List.push(a)
                }), $.each(s.List, function (t, e) {
                    n.push(i.getMinOdds(e).split(","))
                }), s.MinOdds = n, s.BetMoney = d * s.List.length, $.each(s.Array, function (t, e) {
                    r.push(e.Odds)
                }), s.SummaryOdds = r.join()
            }
            l = $("#bet_confirm_tpl").html();
            $.dialog({title: "多选中一", cls: "dialog-confirm dialog-confirm1", html: l, param: s})
        }
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 === t ? (n = i[0], s = i[1]) : (+n > +i[0] && (n = i[0]), s && +s > +i[1] && (s = i[1]))
        }), n + (s ? "," + s : "")
    }, G.modules.duoxuanzhongyi = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    var l = {length: 0};

    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.data_odds = this.json.Data.OriginalOdds, this.userName = this.json.Data.BetInfo.Account, this.playtype = 1, this.betcount = {1: [2, 8, 1]}, this.betnumber = {length: 0}, this.selected1 = [], this.param_oddsloop = {groupid: 12}, this.groupid = 12, this.IsBetTypeStoped = 0, this.array_bettypeid = {74: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.bd_item_numbers = $(".bd_item_numbers"), this.betmoney = $("input[name=bet_money]").input_digits(), this.tpl_order = $("#tpl_order").html(), this.d.on("click", ".fn_radio_select", function () {
            e.doSelectNumber(this)
        }), this.form = $("#guoguan", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), this.d.on("input propertychange", "input[name=bet_money]", function () {
            var t = 1, e = 0, t = parseFloat($("#total_odds").text()), i = this.value.replace(/\,/g, "");
            /\d+/.test(i) && (e = t.multiply(i)) > G.MAX_GUOGUAN_VALUE && (e = G.MAX_GUOGUAN_VALUE), $("#total_caijin").text(e.toFixedCut(3))
        }), this.d.on("click", ".fn_close", function () {
            e.clear(), doc.triggerHandler("close.left")
        }), doc.on("reset." + this.id, function () {
            e.clear(), doc.triggerHandler("close.left")
        }), doc.off("click", ".fn-closedialog").on("click.guoguan", ".fn-closedialog", function () {
            G.util.close()
        }), this.json.Param.sidebarOpen || this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.clear = function () {
        l = {length: 0};
        var t = $("div#guoguan");
        $("input[type=radio]", t).prop("checked", !1), G.billListGuoGuan = [], G.guoguanBall = []
    }, t.prototype.doSelectNumber = function (t) {
        var e, i;
        2 == OPEN_STATUS && (e = (t = $(t)).attr("name"), i = this.betcount[this.playtype][1], l[e] ? l[e].element.type_id == t.attr("data-id") || (l[e] = {
            element: {
                type_id: t.attr("data-id"),
                type_name: t.attr("data-type"),
                item_name: t.attr("title")
            }, odds: $("#" + t.attr("data-type") + "_" + t.attr("data-id")).text(), title: "过关-" + t.attr("title")
        }) : l.length < i ? (l[e] = {
            element: {
                type_id: t.attr("data-id"),
                type_name: t.attr("data-type"),
                item_name: t.attr("title")
            }, odds: $("#" + t.attr("data-type") + "_" + t.attr("data-id")).text(), title: "过关-" + t.attr("title")
        }, l.length++) : (t.prop("checked", !1), $.alert("选择太多了lgb1")), this.loadOddsBet())
    }, t.prototype.loadOddsBet = function () {
        var t = {user: this.userName}, i = 1, e = $("#guoguan_bet_tpl").html(), n = l.length,
            s = JSON.parse(JSON.stringify(l));
        if (1 < n) {
            $.each(l, function (t, e) {
                "length" !== t && (G.guoguanBall.push(e.element.type_id), i = i.multiply(e.odds))
            }), t.totalOdds = i.toFixedCut(3), delete s.length;
            var o, a = {}, r = [];
            for (o in s) r.push([s[o].element.type_id, s[o], o]);
            r.sort(function (t, e) {
                return t[0] - e[0]
            });
            for (var d = 0; d < r.length; d++) a[r[d][2]] = r[d][1];
            t.result = s = a, G.billListGuoGuan = s, loadModule({
                html: e,
                json: G.map.bet.json.single_bet,
                bd: $("#information").removeClass("hide"),
                param: {loop: 1, sidebarOpen: !0, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: t},
                jsonSuccess: function (t) {
                    return G.format.bet(t)
                }
            })
        }
    }, t.prototype.doSave = function () {
        var i, n = [], s = $("input[name=bet_money]").val(), t = $("#guoguan_confirm").html();
        $.each(G.billListGuoGuan, function (t, e) {
            i = {
                BetMoney: s.replace(/\,/g, ""),
                BetName: this.title,
                BetTypeId: e.element.type_name,
                BetItems: [e.element.type_id],
                Name: this.name,
                Odds: e.odds,
                SubBet: null
            }, n.push(i)
        }), $.dialog({
            title: "确认下注",
            cls: "dialog-confirm dialog-confirm1",
            html: t,
            param: {List: n, TotayMoney: s.replace(/\,/g, ""), TotalOdds: $("#total_odds").text()}
        })
    }, t.prototype.destroy = function () {
        this.timer_oddsloop && (clearInterval(this.timer_oddsloop), G.billListGuoGuan = [], G.guoguanBall = [], l = {length: 0})
    }, G.modules.guoguan = t, G.modules.guoguan_tpl = t
}), function () {
    function t(t) {
        var e;
        this.d = $(t), this.id = this.d[0], this.countdown = null, this.doDrawLoop_countdown = null, this.timer = null, this.webgl = !1, this.slow_count = 0, this.slow_arr = [], this.slow_time = 150, this.slow_tip = "系统检测到当前线路网络不稳定，是否需要切换到其他线路？", this.slow_rangetime = 6e4, this.slow_running = !0, this.data = {
            memberinfo: {},
            betinfo: [],
            betList: []
        }, this.isdetailcombo = function () {
            return -1 < G.util.getHash().indexOf("detailCombo=1")
        }, this.groupid = (-1 < (t = G.util.getHash()).indexOf("groupid") && (e = t.match(/groupid=(\d+)/)[1]), e)
    }

    function e(t) {
        var i = this;
        this.d = $(t), this.draw = {}, $.each(t.json.Param.List, function (t, e) {
            i.draw[e] = !0
        })
    }

    function i(t) {
        this.d = $(t), this.param = this.d[0].json.Param, this.data = this.d[0].json.Data
    }

    function n(t) {
        this.d = $(t)
    }

    function s(t) {
        this.d = $(t), this.lineCount = 0, this.timeArr = [], this.timeout = 6e3, this.index = 0, this.token = t.json.Param.token
    }

    window.handicap_id = null, t.prototype.init = function () {
        var n = this, t = G.util.getCookie("theme");
        this.bd_userinfo = $("#user_info").on("change", "select", function () {
            window.handicap_id = this.value, doc.triggerHandler("reloadOdds")
        }), this.tpl_userinfo = $("#tpl_userinfo").html(), this.period = $("#current-period"), 1 == this.isdetailcombo() && $("html").addClass("detail"), this.tpl_drawdate = $("#tpl_drawdate").html();
        var e, i = !1;
        t && $(".colorbox a").each(function () {
            $(this).attr("flag") == t.split("-")[1] && (document.body.className = t, $(this).addClass("active"), i = !0)
        }), i || (e = "theme-" + $(".colorbox a").eq(0).attr("flag"), $(".colorbox a").eq(0).addClass("active"), document.body.className = e), doc.bind("getSystemSpeed.header", function (t, e) {
            n.doReqStatus(e)
        }), doc.on("getMemberInfo", function () {
            n.getMemberInfo()
        }), this.d.on("click", "#loginout", function () {
            $.confirm("确定要登出吗？", function () {
                G.post({
                    url: "/Member/Logout", success: function () {
                        location.href = "/Member/Login"
                    }
                })
            })
        }), this.d.on("click", ".colorbox a", function () {
            var t = "theme-" + this.getAttribute("flag");
            document.body.className = t, G.util.setCookie("theme", t), $(".colorbox a").each(function () {
                $(this).removeClass("active")
            }), $(this).addClass("active")
        }), this.d.on("click", "#reload-order-list", function () {
            n.getMemberInfo()
        }), doc.bind("update.header", function (t, e) {
            n.doSetMemberInfo(e.BetInfo, e.MemberHandicapList, e)
        }), doc.bind("renew.load", function (t) {
            n.doLoadMemberInfo()
        }), this.getCurrentTime(), this.doDrawLoop(), doc.on("close.left", function () {
            Loader.prototype.unbind($("#information")), $("#information").empty().addClass("hide")
        }), this.d.on("click", ".close-quick", function () {
            doc.triggerHandler("close.left")
        }), doc.on("get_video_param.header", function () {
            G.get({
                url: "/Period/CheckDrawing", success: function (t) {
                    t.Data.Token = "", t.Data.HasValidBet = "", t.Data.Lottery = Lottery, n.ifr_video[0].contentWindow.setFlashStatus(t.Data)
                }
            })
        }), doc.on("change_video.header", function () {
            n.bd_video.addClass("hide");
            try {
                n.ifr_video[0].contentWindow.jwplayer("container").stop()
            } catch (t) {
            }
            n.ifr_video.attr("src", ""), n.bd_webgl.removeClass("hide"), n.ifr_video = n.ifr_webgl, n.ifr_video.attr("src", "/Images/video/index.html")
        }), doc.on("openVideoMsg", function (t, e) {
            n.openVideoMsg(e)
        }), doc.bind("change_tm_type.header", function (t, e, i) {
            document.getElementById(i).href = e
        }), this.d.on("click", ".fn-open-drawdate", function () {
            var t = new Date, e = t.getMonth() + 1, e = [t.getFullYear(), (9 < e ? "" : "0") + e, "01"].join("/");
            G.get({
                url: "/Member/GetDrawDate", data: {DrawDateTime: e}, success: function (t) {
                    $.dialog({title: "开奖日期", width: 250, html: n.tpl_drawdate, param: {List: t.Data}})
                }
            })
        }), this.d.on("click", ".fn-video", function () {
            2 == Lottery.LotteryId ? window.open("https://by123123.com/view/twlhc/kjsp.html", "", "height=800,width=960", "_blank") : n.openVideo()
        }), this.bd_video = $("#bd_video").on("click", ".fn-close", function () {
            n.bd_video.addClass("hide");
            try {
                n.ifr_video[0].contentWindow.jwplayer("container").stop()
            } catch (t) {
            }
            n.ifr_video.attr("src", "")
        }), this.ifr_video = $("iframe", this.bd_video), drag(this.bd_video, ".dialog-hd"), this.bd_webgl = $("#bd_webgl").on("click", ".fn-close", function () {
            n.bd_webgl.addClass("hide"), n.ifr_video.attr("src", "")
        }), this.ifr_webgl = $("iframe", this.bd_webgl), drag(this.bd_webgl, ".dialog-hd"), this.getMarquee(), this.countDownFunc(60), this.setAnimalNumber(), this.d.on("click", ".fn-switch-lines", function () {
            n.doOpenTestLine()
        }), this.d.on("click", ".fn-switch-line", function () {
            n.doOpenTestLine(!0), n.slow_count = 0, n.slow_arr = []
        }), this.d.on("click", ".fn-close-tip", function () {
            $("#slow-tip").remove(), n.slow_count = 0, n.slow_arr = []
        }), this.d.on("click", ".fn-notip", function () {
            $("#slow-tip").remove(), n.slow_count = 0, n.slow_arr = [], n.slow_running = !1, setTimeout(function () {
                n.slow_running = !0
            }, 6e5)
        }), this.d.on("change", ".themeSelector", function () {
            var e = n.locationMatch(), t = $(this).val();
            -1 < e.indexOf("handicapId") ? e.replace("handicapId=(d+)", "handicapId=" + G.CurrentUserHandicap) : e = e + "&handicapId=" + G.CurrentUserHandicap;
            var i = location.host;
            G.post({
                url: "/member/UpdateTheme", data: {Theme: t}, success: function (t) {
                    location.href = i + "/" + e, location.reload()
                }
            })
        }), this.d.on("click", ".lottery-bg .lottery_btn a:not(.active)", function () {
            var t = $(this).data("lottery-code");
            G.get({
                url: "/Member/SwitchLottery", data: {LotteryCode: t}, success: function (t) {
                    t.Data && t.Data.Host && t.Data.Token && (location.href = t.Data.Host + "/Member/LotteryLogin?Token=" + t.Data.Token)
                }
            })
        })
    }, t.prototype.doDrawLoop = function () {
        var n = this;
        null != this.doDrawLoop_countdown && clearInterval(this.doDrawLoop_countdown), this.doDrawLoop_countdown = setInterval(function () {
            $.getJSON("/Period/GetDrawNumber", function (t) {
                if (n.period.text(t.Data.PeriodCode), 1 == t.Status) for (var e = 0; e < 7; e++) {
                    var i = t.Data["Code" + (e + 1)], i = i < 10 ? "0" + i : i;
                    0 < t.Data["Code" + (e + 1)] ? ($(".bet-drawno ul li.ball").eq(e).removeClass().addClass("ball"), $(".bet-drawno ul li.ball").eq(e).addClass(G.helper.getNumberColor(t.Data["Code" + (e + 1)])), $(".bet-drawno ul li.ball").eq(e).text(i)) : $(".bet-drawno ul li.ball").eq(e).addClass("noball"), 0 < t.Data.Code1 ? $(".bet-drawno ul li").eq(0).removeClass("noball") : $(".bet-drawno ul li").eq(0).addClass("noball"), 0 < t.Data.Code7 ? $(".bet-drawno ul li").eq(7).removeClass("noball") : $(".bet-drawno ul li").eq(7).addClass("noball")
                }
            })
        }, 6e3)
    }, t.prototype.getCurrentTime = function () {
        null != this.countdown && clearInterval(this.countdown), CURRENT_TIME = CURRENT_TIME.replace(/-/g, "/");
        var n = new Date(CURRENT_TIME).getTime();
        this.countdown = setInterval(function () {
            n += 1e3;
            var t = new Date(n), e = t.getHours(), i = t.getMinutes(), t = t.getSeconds(),
                t = e + ":" + (i < 10 ? "0" + i : i) + ":" + (t < 10 ? "0" + t : t);
            $("#current-time").text(t)
        }, 1e3)
    }, t.prototype.countDownFunc = function (t) {
        var e = this;
        clearTimeout(this.timer), this.timer = setTimeout(function () {
            0 == t ? (t = 60, e.getMarquee()) : t--, e.countDownFunc(t)
        }, 1e3)
    }, t.prototype.getMarquee = function () {
        G.get({
            url: "/Home/GetNormalBulletin", data: {view_mode: 1}, success: function (t) {
                var e = "";
                t && (e = t.Data.Content), $("#news").html(e)
            }
        })
    }, t.prototype.getMemberInfo = function () {
        var t;
        this.groupid || -1 < (t = G.util.getHash()).indexOf("groupid") && (this.groupid = t.match(/groupid=(\d+)/)[1]);
        var i = $("#betlist_tpl").html(), n = $("#betlist_tbody");
        G.get({
            url: "/Member/GetMemberBetInfo",
            data: {GroupId: this.groupid, IsOnlyLastBets: !0},
            success: function (t) {
                var e;
                t.Data && (e = G.util.compile, n.empty().append(e(i, t)))
            }
        })
    }, t.prototype.setAnimalNumber = function () {
        var t = getAnimal(YEAR), e = G.code_class;
        if (t) for (var i in t) e[t[i].animal] = t[i].num
    }, t.prototype.openVideo = function () {
        this.webgl ? (this.bd_webgl.removeClass("hide"), this.ifr_video = this.ifr_webgl, this.ifr_video.attr("src", "/Images/video/index.html")) : (this.bd_video.removeClass("hide"), this.ifr_video.attr("src", "/Images/video/video.html"))
    }, t.prototype.openVideoMsg = function (t) {
        $.dialog({width: 800, title: "提示", html: t})
    }, t.prototype.doReqStatus = function (t) {
        var i, n = this;
        !this.slow_running || (i = $.now()) - t >= this.slow_time && (this.slow_arr.push(t), 4 == this.slow_arr.length && this.slow_arr.shift(), 3 == this.slow_arr.length && (this.slow_count = 0, $.each(this.slow_arr, function (t, e) {
            i - e <= n.slow_rangetime && n.slow_count++
        }), 3 == this.slow_count && (this.showSlowTip(), this.slow_count = 0, this.slow_arr = [])))
    }, t.prototype.showSlowTip = function () {
        document.getElementById("slow-tip") || $("<div class='slow-tip' id='slow-tip' style='position:absolute; height:30px; line-height:30px; padding:0 10px; border:1px solid #ff0000; background:yellow; color:#ff0000; top:-30px; z-index:2;'>" + this.slow_tip + " <input type='button' value='是' class='btn fn-switch-line' /> <input type='button' value='否' class='btn btn-gray fn-close-tip' /> <input type='button' value='关闭(10分钟之内不再提示)' class='btn btn-gray fn-notip' /></div>").appendTo(this.d).animate({top: 0}).delay(3e4).queue(function () {
            $(this).dequeue().remove()
        })
    }, t.prototype.doOpenTestLine = function (t) {
        G.get({
            url: "/Member/GetSwitchUrl", data: {is_mobile: 0}, success: function (t) {
                0 < t.Data.Token.length && $.dialog({
                    title: "线路切换",
                    width: 300,
                    html: "<div class='testline' name='module' id='testline'><div class='bd'></div></div>",
                    param: {token: t.Data.Token}
                })
            }
        })
    }, t.prototype.doLoadMemberInfo = function () {
        G.get({
            url: G.action_odds, data: {GroupId: 1}, async: !0, success: function (t) {
                doc.triggerHandler("update.header", t.Data)
            }
        })
    }, t.prototype.locationMatch = function () {
        var t = location.hash.match(new RegExp("^#!([a-zA-Z0-9_]+)?"))[0];
        return 0 !== location.hash.indexOf("#!info") && 0 !== location.hash.indexOf("#!history") && 0 !== location.hash.indexOf("#!betdetail") || (location.hash = t + "?status=1&getinfo=1&groupid=1"), location.hash
    }, t.prototype.doSetMemberInfo = function (t, e, i) {
        t && ($.extend(this.data.memberinfo, t), e && (this.data.memberinfo.handicapList = e), this.period.text(t.PeriodCode), i = i.BetList, $.isArray(i) && ($.each(i, function (t, e) {
            e.Odds = e.Odds.split("/"), 1 < e.Odds.length ? e.Odds = e.Odds.join("/<br>") : e.Odds = e.Odds[0]
        }), this.data.betinfo = i, 10 < this.data.betinfo.length && (this.data.betinfo.length = 10), loadModule({
            html: this.tpl_userinfo,
            jsondata: this.data,
            bd: this.bd_userinfo,
            param: {currentUserHandicap: G.CurrentUserHandicap},
            renderSuccess: function (t) {
                G.CurrentUserHandicap || (G.CurrentUserHandicap = t.memberinfo.handicapList[0].HandicapId)
            }
        })))
    }, G.modules.header = t, e.prototype.init = function () {
        var n = this, t = new Date, e = t.getFullYear(), i = t.getMonth() - 1;
        i < 0 && (--e, i = 11);
        var i = new Date(e, i, t.getDate()), s = [], t = i.getMonth() + 1;
        s.push({year: i.getFullYear(), month: (9 < t ? "" : "0") + t});
        for (var o = 0; o < 10; o++) {
            var a = new Date(s[0].year, parseInt(s[0].month) + o, 1), r = a.getMonth() + 1;
            s.push({year: a.getFullYear(), month: (9 < r ? "" : "0") + r})
        }
        $(".datebox", this.d).datepicker({
            draw: n.draw,
            cls_now: "now2",
            availableMonths: s,
            clickCallback: function (t, e, i) {
                G.get({
                    url: "/Member/GetDrawDate", data: {DrawDateTime: t + "/" + e + "/01"}, success: function (t) {
                        n.draw = {}, $.each(t.Data, function (t, e) {
                            n.draw[e] = !0
                        }), i(n.draw)
                    }
                })
            }
        }), doc.on("datedraw.drawdate", function () {
            G.util.close(), G.util.setHash("#!result")
        })
    }, e.prototype.destroy = function () {
        doc.trigger("datereset")
    }, G.modules.drawdate = e, i.prototype.init = function () {
        var e = this;
        this.param && this.param.detail && $("html").addClass("detail"), this.d.on("change", "#select_type", function () {
            var t = this.value;
            1 == e.param.isHistory ? G.util.setHash("#!history.detail|detail?type=" + t + "&sort=" + e.param.sort + "&pageIndex=" + e.data.PageIndex + "&period=" + (e.param.period ? e.param.period : "") + "&isHistory=1") : G.util.setHash("#!detail?type=" + t + "&sort=" + e.param.sort + "&pageIndex=" + e.data.PageIndex + "&period=" + (e.param.period ? e.param.period : ""))
        }), this.d.on("click", ".fn-show-details", function () {
            var t = this.getAttribute("serial_no"), e = this.getAttribute("period_no");
            window.open("#!detail.order|order?detail=1&serialno=" + t + "&period=" + e, "组合清单", "width=600,height=400,left=100,top=100, menubar=no,toolbar=no")
        }), this.d.on("change", "#select_date", function () {
            var t = this.value;
            1 == e.param.isHistory ? G.util.setHash("#!history.detail|detail?period=" + t + "&isHistory=1") : G.util.setHash("#!detail?period=" + t)
        })
    }, G.modules.detail = i, G.modules.order_detail = i, n.prototype.init = function () {
        var t = G.util.getHash(), e = G.util.formatHash(G.util.getHash()).param;
        null !== t.match(/handicapId=(\d+)/) && ($("select#userHandicap").val(e.handicapId), G.CurrentUserHandicap = e.handicapId, t = t.replace(/&handicapId=(\d+)/, ""), G.util.setHash(t, {
            loop: 1,
            handicapId: G.CurrentUserHandicap
        })), this.d.on("change", "select#userHandicap", function (t) {
            G.CurrentUserHandicap = this.value, G.util.setHash(G.util.getHash(), {
                loop: 1,
                handicapId: G.CurrentUserHandicap
            })
        })
    }, G.modules.memberhandicap = n, s.prototype.init = function () {
        this.bd = $(".bd", this.d), this.getCompanyUrl()
    }, s.prototype.getCompanyUrl = function () {
        var e = this;
        G.get({
            url: "/Member/GetUrls", success: function (t) {
                t.Data.length && $.isArray(t.Data) ? e.checkLine(t.Data) : e.gotoUrl(location.host)
            }
        })
    }, s.prototype.gotoUrl = function (t) {
        location.href = t + "/Member/FastLogin?_=" + (new Date).getTime() + "&Token=" + this.token
    }, s.prototype.checkLine = function (t) {
        t.length <= 0 && gotoUrl(location.host);
        var e = 0, i = t.length, n = "<table class='t-1'><thead><tr><td>线路</td><td>响应时间</td></tr></thead><tbody>",
            s = $.now();
        for (this.lineCount = i; e < i; e++) this.loadImage(t[e], e), n += "<tr class='item' id='item_" + e + "'><td><a href='//" + t[e] + "/Member/FastLogin?_=" + s + "&Token=" + this.token + "'>Line " + (e + 1) + "</a></td><td><span id='line" + e + "'>Checking...</span><span class='status'>最佳</span></td></tr>";
        n += "</tbody></table>", this.bd.html(n)
    }, s.prototype.loadImage = function (i, n) {
        var t, s = this, e = $.now();
        window["callback" + n] = function () {
        }, $.ajax({
            type: "get",
            cache: !1,
            url: i + "/Member/GetNetSpeed",
            timeout: this.timeout,
            dataType: "jsonp",
            jsonp: "jsonp",
            jsonpCallback: "callback" + n,
            success: function () {
                t = $.now(), s.timeArr.push({time: t - e, src: i, index: n}), $("#line" + n).html(t - e)
            },
            error: function (t, e) {
                s.timeArr.push({time: 99999, src: i, index: n}), $("#line" + n).html("超时")
            },
            complete: function (t, e) {
                "timeout" == e && s.timeArr.push({time: 99999, src: i, index: n}), s.index++, s.test()
            }
        })
    }, s.prototype.test = function () {
        var t;
        this.index == this.lineCount && (this.timeArr.sort(function (t, e) {
            return t.time - e.time
        }), t = this.timeArr[0], $("#item_" + t.index).addClass("best"), this.gotoUrl(t.src, this.token))
    }, G.modules.testline = s
}(), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betcount = {
            67: [2, 10, 1],
            68: [2, 10, 1],
            69: [3, 9, 2],
            70: [3, 9, 2],
            71: [4, 9, 3],
            72: [4, 9, 3],
            73: [5, 8, 4],
            74: [5, 8, 4]
        }, this.ptname = {
            67: "二合肖中",
            68: "二合肖不中",
            69: "三合肖中",
            70: "三合肖不中",
            71: "四合肖中",
            72: "四合肖不中",
            73: "五合肖中",
            74: "五合肖不中"
        }, this.btname = {
            1: "复式投注",
            2: "拖胆投注"
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            89: !1,
            90: !1,
            91: !1,
            92: !1,
            93: !1,
            94: !1,
            95: !1,
            96: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    function r(t, e) {
        for (var i, n = [], s = 0, o = t.length; s < o; s++) (i = e(t[s], s)) && n.push(i);
        return n
    }

    function d(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    }

    function l(e) {
        var n = [];
        return $.each(G.shengxiao, function (t, i) {
            $.each(e, function (t, e) {
                i.name === e && n.push(e)
            })
        }), n
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".fn-check-items", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i = t.getAttribute("betitemid"), n = t.getAttribute("betitemname"), s = this.betcount[this.groupid][1],
            o = this.betcount[this.groupid][2], a = $(".area-a");
        if (1 === this.selectType) {
            if (t.checked) {
                if (!(this.selected1.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                this.selected1.push(i), this.head.push(n)
            } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.head, n);
            this.head = l(this.head), a.html("【<span class='blue'>" + this.head.join(",") + "</span>】")
        } else if (2 === this.selectType) {
            if (0 !== this.selected1.length && $(t).hasClass("checkbox-disable")) return e.preventDefault(), void e.stopPropagation();
            if (this.selected2.length < o) $(t).hasClass("checkbox-disable") ? ($(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n)) : ($(t).addClass("checkbox-disable"), this.selected2.push(i), this.head.push(n)), this.head = l(this.head), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 "); else {
                if (t.checked) {
                    if (!(this.selected1.length + this.selected2.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                    this.selected1.push(i), this.tail.push(n)
                } else if ($(t).hasClass("checkbox-disable")) {
                    if (0 !== this.selected1.length) return;
                    $(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 ")
                } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.tail, n);
                this.tail = l(this.tail), $(".area-b").html("【<span class='blue'>" + this.tail.join(",") + "</span>】")
            }
        }
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1).removeClass("checkbox-disable"), this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betmoney.val(""), $(".area-a").html("【请选择】"), $(".area-b").html("")
    }, t.prototype.doSave = function (t) {
        var i = this, n = [], s = {}, o = [], a = parseInt(this.betmoney.val().replace(/\,/g, "")),
            e = this.betcount[this.groupid][0];
        1 === this.selectType && this.selected1.length < e || 2 === this.selectType && !this.selected1.length ? $.alert("选择不够多33了!") : (s = {
            BetTypeId: this.data_odds[0].BetTypeId,
            PlayTypeName: this.ptname[this.groupid],
            BetTypeName: this.btname[this.selectType],
            BetType: this.selectType,
            MoneyPerBet: a,
            List: [],
            Array: []
        }, 1 === this.selectType ? (s.BetItems = this.selected1.sort(d), $(this.selected1).each(function (t, e) {
            i.number.each(function () {
                if (this.getAttribute("betitemid") === e) return s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                }), !1
            })
        }), s.List = combin(s.Array, e), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * s.List.length, s.BallNo = r(s.Array, function (t) {
            return t.BetName
        }).join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()) : 2 === this.selectType && (this.selected2.sort(d), s.BetItems = this.selected2.concat(this.selected1.sort(d)), $.each(s.BetItems, function (t, e) {
            i.number.each(function () {
                this.getAttribute("betitemid") === e && s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                })
            })
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected2) && o.push(e)
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected1) && s.List.push([].concat(o, [e]))
        }), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * this.selected1.length, s.Lead = this.selected2, s.BallNo = this.head.join() + " 拖 " + this.tail.join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()), e = $("#bet_confirm_tpl").html(), $.dialog({
            title: "合肖",
            cls: "dialog-confirm dialog-confirm1",
            html: e,
            param: s
        }))
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 === t ? (n = i[0], s = i[1]) : (+n > +i[0] && (n = i[0]), s && +s > +i[1] && (s = i[1]))
        }), n + (s ? "," + s : "")
    }, G.modules.hexiao = t
}), MemberInfo.prototype.init = function () {
}, G.modules.info = MemberInfo, function (t) {
    "function" == typeof define && define.amd ? define(t) : (t(jQuery), t = t(jQuery), G.modules.lianma = t)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = this.d[0].json, this.data_odds = this.json.Data.Odds, this.shengWeiMap = this.json.Data.ShengWeiMapList, this.param = this.json.Param, this.hash = G.util.formatHash(G.util.getHash()), this.timer = null, this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.bettype = this.json.Param.bettype, this.playtype = this.json.Param.playtype || 0, this.groupid = [43, 44, 45, 46, 47], this.array_bettypeid = {
            47: !1,
            48: !1,
            49: !1,
            50: !1,
            51: !1
        }, this.betcount = {
            0: [2, 10, 1],
            1: [2, 10, 1],
            2: [2, 10, 1],
            3: [3, 10, 2],
            4: [3, 10, 2]
        }, this.ptname = {0: "一般", 1: "拖胆", 2: "生肖对碰", 3: "生尾对碰", 4: "尾数对碰", 5: "随意对碰"}, this.btname = {
            0: "二全中",
            1: "二中特",
            2: "二特串",
            3: "三全中",
            4: "三中二"
        }, this.sc = {
            0: 6,
            1: 6,
            2: 6,
            3: 7,
            4: 7
        }, this.param_oddsloop = {groupid: this.groupid[this.playtype]}, this.selected1 = [], this.selected2 = [], doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop, this.AnimalMapping = {}, this.LastDigitMapping = {}
    }

    return t.prototype.init = function () {
        var a = this;
        this.shengxiao = [], this.weishu = [], this.number = $("input[name=number]", this.d), this.number2 = $("input[type=radio]", this.d), this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                a.doSave(t)
            }
        }), this.sxwsArray = [], this.formatData(), this.betmoney = $("input[name=bet_money]").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".fn-count", function (t) {
            a.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-limit", function (t) {
            if (this.checked) a.sxwsArray.length < 2 ? a.sxwsArray.push(this.value) : (t.preventDefault(), $.alert("最多只能勾选两组")); else for (var e = 0; e < a.sxwsArray.length; e++) a.sxwsArray[e] == this.value && a.sxwsArray.splice(e, 1)
        }), this.d.on("click", ".fn_check_items", function (t) {
            var e = this.getAttribute("t"), i = this.checked, n = this.getAttribute("titles");
            if (0 == e) {
                if (i) {
                    if (9 < a.selected1.length) return t.preventDefault(), void $.alert("A区最多能选择10组号码");
                    a.selected1.push(n)
                } else {
                    for (var s = 0, o = a.selected1.length; s < o && a.selected1[s] != n; s++) ;
                    a.selected1.splice(s, 1)
                }
                $(".area-a").html("【<span class='blue'>" + a.selected1.join(",") + "</span>】")
            } else {
                if (i) {
                    if (9 < a.selected2.length) return t.preventDefault(), void $.alert("B区最多能选择10组号码");
                    a.selected2.push(n)
                } else {
                    for (s = 0, o = a.selected2.length; s < o && a.selected2[s] != n; s++) ;
                    a.selected2.splice(s, 1)
                }
                $(".area-b").html("【<span  class='blue'>" + a.selected2.join(",") + "</span>】")
            }
        }), this.d.on("click", ".fn-reset", function () {
            a.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            a.clear(!0)
        }), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.formatData = function () {
        var i = this, t = this.json.Data;
        $.each(t.AnimalMapList, function (t, e) {
            i.AnimalMapping[e.betitemid] = {
                name: e.name, id: arraymap(e.numbers, function (t) {
                    return +t
                })
            }
        }), $.each(t.WeishuMapList, function (t, e) {
            i.LastDigitMapping[e.betitemid] = {
                name: e.name, id: arraymap(e.numbers, function (t) {
                    return +t
                })
            }
        })
    }, t.prototype.doSelectNumber = function (t, e) {
        if (!(3 < this.bettype)) {
            var i = $(t), n = i.attr("bet_item_id"), t = i.prop("checked");
            if (1 == this.bettype) {
                if (t) {
                    if (this.selected1.length == this.betcount[this.playtype][1]) {
                        // (e.preventDefault(), $.alert("选择太多了lgb2!"))
                        this.selected1.push(n)
                    } else {
                        this.selected1.push(n)
                    }
                } else {
                    (G.util.array_remove(this.selected1, n), i.prop("checked", !1));
                }
            } else if (2 == this.bettype) {
                if (0 !== this.selected1.length && i.hasClass("checkbox-disable"))
                    return e.preventDefault(), void e.stopPropagation();
                this.selected2.length < this.betcount[this.playtype][2] ? i.hasClass("checkbox-disable") ? (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n)) : (this.selected2.push(n), i.addClass("checkbox-disable")) : t ? this.selected1.length == this.betcount[this.playtype][1] ? (e.preventDefault(), $.alert("选择太多了lgb3")) : this.selected1.push(n) : i.hasClass("checkbox-disable") ? (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n)) : G.util.array_remove(this.selected1, n)
            }
        }
    }, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 == t ? (n = +i[0], s = i[1] ? +i[1] : null) : (n > +i[0] && (n = +i[0]), s && s > +i[1] && (s = +i[1]))
        }), n + (s ? "," + s : "")
    }, t.prototype.clear = function (t) {
        this.number.prop("checked", !1), this.number.removeClass("checkbox-disable"), this.number2.prop("checked", !1), $("input[name=numberR]", this.d).prop("checked", !1), this.select = [], this.selected1 = [], this.selected2 = [], this.betmoney.val(""), $(".area-a").html("【请选择】"), $(".area-b").html("【请选择】"), this.sxwsArray = [], this.weishu = [], this.shengxiao = []
    }, t.prototype.doSave = function () {
        var n, s = this, i = [], o = {}, a = [], t = parseInt($("input[name=bet_money]").val().replace(/\,/g, "")),
            e = !0, r = {}, d = {}, l = $(".fn-select-item:checked"), h = [], u = [];
        this.select = [];
        var c = this.shengWeiMap.slice(), m = {};
        if (4 != this.bettype && 6 != this.bettype || (c = this.flattenArray(c), $.each(c, function (t, i) {
            $.each(i.numbers, function (t, e) {
                m[e = +e] = i.totalOdds[t]
            })
        })), 6 != this.bettype) l.each(function (t, e) {
            var i = e.getAttribute("titles");
            s.select.push(i), 3 != s.bettype && 4 != s.bettype && 5 != s.bettype || (5 == s.bettype && (i += "尾"), i = i + "[" + e.getAttribute("bet_item_id") + "]", h.push(i), u.push(e.getAttribute("odds_total")))
        }); else {
            var p = [], f = [];
            if (this.selected1.length < 1 || this.selected2.length < 1) return void $.alert("AB区请至少勾选一组号码");
            this.select.push(this.selected1, this.selected2), l.each(function (t, e) {
                (0 == e.getAttribute("t") ? p : f).push(e.getAttribute("odds_total"))
            }), u.push(p.join(","), f.join(","))
        }
        if (1 == this.bettype) this.selected1.length < this.betcount[this.playtype][0] && (e = !1); else if (2 == this.bettype) this.selected1.length || (e = !1); else if (3 == this.bettype || 5 == this.bettype) this.sxwsArray[0] && this.sxwsArray[1] || (e = !1); else if (4 == this.bettype) l.length <= 1 ? e = !1 : l.each(function (t, e) {
            "shengxiao0" == e.getAttribute("name") ? s.shengxiao.push(e.getAttribute("value")) : "weishu0" == e.getAttribute("name") && s.weishu.push(e.getAttribute("value"))
        }); else if (g = {
            id: arraymap(this.selected1, function (t) {
                return +t
            }).sort(function (t, e) {
                return t - e
            })
        }, b = {
            id: arraymap(this.selected2, function (t) {
                return +t
            }).sort(function (t, e) {
                return t - e
            })
        }, this.select = arrayunique(arraymap(g.id.concat(b.id), function (t) {
            return +t
        })), !g.id.length || !b.id.length || this.select.length < 2 || g.id.concat(b.id).length != this.select.length) return $.alert("对碰号码不够或重复!"), !1;
        if (e) {
            console.log('来了。。。')
            switch (o = {
                BetTypeId: this.data_odds[0].BetTypeId,
                PlayTypeName: this.btname[this.playtype],
                BetTypeName: this.ptname[this.bettype],
                BetMoney: t,
                List: [],
                Array: []
            }, this.bettype) {
                case"1":
                    this.selected1 = arraymap(this.selected1, function (t) {
                        return +t
                    }).sort(function (t, e) {
                        return t - e
                    }), o.BetItems = this.selected1, this.countBetNumber(this.number, o, r, t), o.List = combin(o.Array, this.betcount[this.playtype][0]), $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    }), o.TotalMoney = t * o.List.length, o.MinOdds = i;
                    break;
                case"3":
                    g = this.AnimalMapping[this.sxwsArray[0]], b = this.AnimalMapping[this.sxwsArray[1]], o.GroupName = [g.name, b.name], this.selected1 = arrayunique(g.id.concat(b.id)), o.BetItems = this.selected1, this.countBetNumber(this.number, o, r, t), $.each(g.id, function (t, i) {
                        $.each(b.id, function (t, e) {
                            i != e && (d[n = e < i ? e + "-" + i : i + "-" + e] || (o.List.push([r[i], r[e]]), d[n] = !0))
                        })
                    }), $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    }), o.TotalMoney = t * o.List.length, o.MinOdds = i;
                    break;
                case"4":
                    var l = this.shengxiao.length, e = this.weishu.length,
                        g = this.AnimalMapping[this.shengxiao[l - 1]], b = this.LastDigitMapping[this.weishu[e - 1]];
                    o.GroupName = [g.name, b.name], this.selected1 = arrayunique(g.id.concat(b.id)), o.BetItems = this.selected1, this.countBetNumber(this.number2, o, r, t, m), $.each(g.id, function (t, i) {
                        $.each(b.id, function (t, e) {
                            i != e && (d[n = e < i ? e + "-" + i : i + "-" + e] || (o.List.push([r[i], r[e]]), d[n] = !0))
                        })
                    }), $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    }), o.TotalMoney = t * o.List.length, o.MinOdds = i;
                    break;
                case"5":
                    g = this.LastDigitMapping[this.sxwsArray[0]], b = this.LastDigitMapping[this.sxwsArray[1]], o.GroupName = [g.name, b.name], this.selected1 = arrayunique(g.id.concat(b.id)), o.BetItems = this.selected1, this.countBetNumber(this.number, o, r, t), $.each(g.id, function (t, i) {
                        $.each(b.id, function (t, e) {
                            i != e && (d[n = e < i ? e + "-" + i : i + "-" + e] || (o.List.push([r[i], r[e]]), d[n] = !0))
                        })
                    }), $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    }), o.TotalMoney = t * o.List.length, o.MinOdds = i;
                    break;
                case"6":
                    o.GroupName = [g.id.join(","), b.id.join(",")], o.BetItems = this.select, this.countBetNumber(this.number, o, r, t, m), $.each(g.id, function (t, i) {
                        $.each(b.id, function (t, e) {
                            i != e && (d[n = e < i ? e + "-" + i : i + "-" + e] || (o.List.push([r[i], r[e]]), d[n] = !0))
                        })
                    }), $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    }), o.TotalMoney = t * o.List.length, o.MinOdds = i;
                    break;
                default:
                    o.BetItems = this.selected2.concat(this.selected1.sort(function (t, e) {
                        return t - e
                    })), this.number.each(function () {
                        -1 != $.inArray(this.getAttribute("bet_item_id"), o.BetItems) && o.Array.push({
                            BetName: this.getAttribute("titles"),
                            BetItemId: this.getAttribute("bet_item_id"),
                            Odds: $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id")).text()) + (1 == s.playtype || 4 == s.playtype ? "/" + $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id") + "_2").text()) : ""),
                            BetMoney: t
                        })
                    }), $.each(o.Array, function (t, e) {
                        -1 != $.inArray(e.BetItemId, s.selected2) && a.push(e)
                    }), $.each(o.Array, function (t, e) {
                        -1 != $.inArray(e.BetItemId, s.selected1) && o.List.push([].concat(a, [e]))
                    }), $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    }), o.MinOdds = i, o.TotalMoney = t * this.selected1.length, o.Lead = this.selected2
            }
            o.CategoryId = this.sc[this.playtype], o.BetType = this.bettype, 1 == this.bettype || 2 == this.bettype ? (y = this.selected2.join(",") + " 拖 " + this.selected1.join(","), this.selected2.length ? 2 != this.bettype ? o.summary_play_name = o.PlayTypeName + "[[" + s.selected2.join(",") + "] # [" + s.selected1.join(",") + "]]" : o.summary_play_name = o.PlayTypeName + "[" + y + "]" : o.summary_play_name = o.PlayTypeName + "[" + o.BetItems.join(",") + "]") : 3 == this.bettype || 4 == this.bettype || 5 == this.bettype ? (o.balls_no = h.join("#"), o.summary_play_name = o.PlayTypeName + "[" + h.join("#") + "]", o.summary_odds = u.join("#")) : 6 == this.bettype && (o.balls_no = this.selected1.join(",") + "#" + this.selected2.join(","), o.summary_play_name = o.PlayTypeName + "[" + o.balls_no + "]", o.summary_odds = u.join("#"));
            var y = $("#bet_confirm_tpl").html();
            $.dialog({title: o.summary_play_name, cls: "dialog-confirm dialog-confirm1", html: y, param: o})
        } else $.alert("选择不够多44了!")
    }, t.prototype.countBetNumber = function (t, n, s, o, a) {
        var r = this;
        t.each(function () {
            var t = this.getAttribute("bet_item_id").split(","), i = this.getAttribute("titles");
            $.each(t, function (t, e) {
                _betitemid = +e, -1 != $.inArray(_betitemid, n.BetItems) && (s[_betitemid] = {
                    BetName: i,
                    BetItemId: _betitemid,
                    BetMoney: o,
                    Odds: 6 == r.bettype || 4 == r.bettype ? a[_betitemid] : $.trim($("#" + n.BetTypeId + "_" + _betitemid).text()) + (1 == r.playtype || 4 == r.playtype ? "/" + $.trim($("#" + n.BetTypeId + "_" + _betitemid + "_2").text()) : "")
                }, n.Array.push(s[_betitemid]))
            })
        })
    }, t.prototype.flattenArray = function (t) {
        var e, i = [];
        if (!(t[0] instanceof Array)) return t;
        for (e in t) for (var n = 0; n < t[e].length; n++) i.push(t[e][n]);
        return i
    }, t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.selected1 = [], this.selected2 = [], this.betcount = {
            72: [6, 6, 1],
            73: [6, 6, 1]
        }, this.mapping = {
            1: ["马", "狗", "牛", "羊", "鸡", "猪"],
            2: ["鼠", "虎", "龙", "猴", "兔", "蛇"]
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.betTypeId = 72, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {72: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", "[name=bettype]", function () {
            e.betTypeId = parseInt(this.value)
        }), this.d.on("click", "[name=selectclass]", function () {
            e.doSelectClass(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d).on("click", function (t) {
            e.doSelectNumber(this, t)
        }), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i, n, s = t.name, o = ["鼠", "虎", "龙", "马", "猴", "狗"], a = this.betcount[this.betTypeId][1];
        t.checked ? this.selected1.length === a ? ($.alert("选择太多了lgb4!"), e.preventDefault()) : this.selected1.length === a - 1 ? (n = i = 0, $.each(this.selected1, function (t, e) {
            0 <= $.inArray(e, o) ? i++ : n++
        }), t = 0 <= $.inArray(s, o), i === a - 1 && t ? ($.alert("至少选择一项偶数生肖!"), e.preventDefault()) : n !== a - 1 || t ? this.selected1.push(s) : ($.alert("至少选择一项奇数生肖!"), e.preventDefault())) : this.selected1.push(s) : G.util.array_remove(this.selected1, s)
    }, t.prototype.doSelectClass = function (t) {
        var e, i = this, t = $(t).attr("value"), n = this.mapping[t];
        i.selected1 = [], this.number.each(function () {
            e = this.name, -1 === $.inArray(e, n) ? this.checked = !1 : (this.checked = !0, i.selected1.push(e))
        }), $(".fn-reset").prop("checked", !1)
    }, t.prototype.clear = function () {
        $("[name=selectclass]").prop("checked", !1), this.number.prop("checked", !1), this.selected1 = [], this.selected2 = [], this.betmoney.val("")
    }, t.prototype.doSave = function (t) {
        var e, i = [], n = [], s = this.number.filter(":checked"), o = parseInt(this.betmoney.val().replace(/\,/g, "")),
            a = this.betcount[this.betTypeId][1];
        this.selected1.length < a ? $.alert("选择不够多55了!") : (s.each(function () {
            n.push({title: this.name, betitemid: this.getAttribute("betitemid")})
        }), n.sort(function (t, e) {
            return t.betitemid - e.betitemid
        }), e = "特码六肖-" + (72 === this.betTypeId ? "中" : "不中"), a = arraymap(n, function (t) {
            return t.title
        }).join(), s = arraymap(n, function (t) {
            return t.betitemid
        }), a = {
            BetMoney: o,
            BetName: e + " " + a,
            BetTypeId: this.betTypeId,
            BetItems: s,
            Detail: e,
            No: a,
            Name: this.name,
            Odds: $.trim($("#" + this.betTypeId + "_0").text()),
            SubBet: null
        }, i.push(a), a = $("#bet_confirm_tpl").html(), $.dialog({
            title: "下注确认",
            width: 400,
            html: a,
            param: {List: i}
        }))
    }, G.modules.liuxiao = t
}), MarqueeForm.prototype.init = function () {
}, G.modules.marquee = MarqueeForm, OrderConfirm.prototype.init = function () {
    var t = this;
    this.total_count = $("#total_count"), this.total_money = $("#total_money"), this.odds = $("#odds"), this.d.on("click", ".fn-close", function () {
        return $.confirm("确定取消这些注单吗？", function () {
            "order_confirm_guoguan" !== t.id && doc.triggerHandler("reset"), G.util.close()
        }), !1
    }), this.btnSubmit = $("#btnSubmit").on("click", function () {
        t.doSubmit()
    })
}, OrderConfirm.prototype.doSubmit = function () {
    var t, e = this, i = JSON.stringify(this.beforeSend() || this.Data);
    this.UseLastOdds ? $.confirm("赔率已变化，是否继续提交?", function () {
        e.postdata(i)
    }) : (t = $(".betstop").length, 2 === OPEN_STATUS && 0 < t ? $.alert("已停押") : 300 < this.Data.length ? $.confirm("下注注單超过300笔数，需要的时间会比较长，请耐心等待！期间請勿操作其他功能或者切换其他投注，避免投注失敗", function () {
        e.postdata(i)
    }) : e.postdata(i))
}, OrderConfirm.prototype.beforeSend = function () {
    var n = {}, s = this.json.Param, i = 1, o = [], a = [];
    if ("order_confirm_lianma" == this.id) return s.Lead ? ($.each(s.Array, function (t, e) {
        (-1 != $.inArray(e.BetItemId, s.Lead) ? o : a).push(e.BetName)
    }), n.BetName = s.PlayTypeName + " " + o.join(",") + " [拖] " + a.join(",")) : s.GroupName ? "4" === s.BetType ? n.BetName = s.PlayTypeName + " " + s.GroupName[0] + " 尾 [碰] " + s.GroupName[1] + " 尾" : n.BetName = s.PlayTypeName + " " + s.GroupName[0] + " [碰] " + s.GroupName[1] : n.BetName = s.PlayTypeName + " " + arraymap(s.Array, function (t) {
        return t.BetName
    }).join(","), n.BetTypeId = s.BetTypeId, n.BetItems = s.BetItems, n.PlayTypeName = s.PlayTypeName, n.BetMoney = s.TotalMoney, n.SubBet = arraymap(s.List, function (t, e) {
        return {
            BetMoney: t[0].BetMoney, BetItems: arraymap(t, function (t) {
                return t.BetItemId
            }), Odds: s.MinOdds[e].join(",")
        }
    }), [n];
    if ("order_confirm_shengxiaolian" == this.id || "order_confirm_weishulian" == this.id || "order_confirm_buzhong" == this.id || "order_confirm_hexiao" == this.id) return n.BetTypeId = s.BetTypeId, n.BetItems = s.BetItems, n.PlayTypeName = s.PlayTypeName, s.Lead ? ($.each(s.Array, function (t, e) {
        (-1 !== $.inArray(e.BetItemId, s.Lead) ? o : a).push(e.BetName)
    }), n.BetName = s.PlayTypeName + " " + o.join(",") + " [拖] " + a.join(",")) : n.BetName = s.PlayTypeName + " " + arraymap(s.Array, function (t) {
        return t.BetName
    }).join(","), n.BetMoney = s.BetMoney, n.SubBet = arraymap(s.List, function (t, e) {
        return {
            BetMoney: t[0].BetMoney, BetItems: arraymap(t, function (t) {
                return t.BetItemId
            }), Odds: s.MinOdds[e].join(",")
        }
    }), [n];
    if ("order_confirm_duoxuanzhongyi" == this.id || "order_confirm_tepingzhong" == this.id) return n.BetTypeId = s.BetTypeId, n.BetItems = s.BetItems, n.PlayTypeName = s.PlayTypeName, 3 === s.BetType ? (t = $.map(s.List, function (t) {
        return $.map(t, function (t) {
            return t.BetName
        }).join(",")
    }).join("#"), n.BetName = s.PlayTypeName + " " + t) : n.BetName = s.PlayTypeName + " " + arraymap(s.Array, function (t) {
        return t.BetName
    }).join(","), n.BetMoney = s.BetMoney, n.SubBet = arraymap(s.List, function (t, e) {
        return {
            BetMoney: t[0].BetMoney, BetItems: arraymap(t, function (t) {
                return t.BetItemId
            }), Odds: s.MinOdds[e].join(",")
        }
    }), [n];
    if ("order_confirm_siquanzhong" == this.id) return n.BetTypeId = s.BetTypeId, n.BetItems = s.BetItems, n.PlayTypeName = s.PlayTypeName, s.Lead ? ($.each(s.Array, function (t, e) {
        (-1 != $.inArray(e.BetItemId, s.Lead) ? o : a).push(e.BetName)
    }), n.BetName = s.PlayTypeName + " " + o.join(",") + " [拖] " + a.join(",")) : s.GroupName ? n.BetName = s.PlayTypeName + " " + s.GroupName[0] + " [碰] " + s.GroupName[1] : n.BetName = s.PlayTypeName + " " + arraymap(s.Array, function (t) {
        return t.BetName
    }).join(","), n.BetMoney = s.TotalMoney, n.SubBet = arraymap(s.List, function (t, e) {
        return {
            BetMoney: t[0].BetMoney, BetItems: arraymap(t, function (t) {
                return t.BetItemId
            }), Odds: s.MinOdds[e].join(",")
        }
    }), [n];
    if ("order_confirm_bidaxiao" != this.id) return "order_confirm_guoguan" == this.id ? (n.BetTypeId = s.List[0].BetTypeId, n.BetMoney = +s.List[0].BetMoney, n.BetItems = [], n.BetName = [], $.each(s.List, function (t, e) {
        n.BetItems.push(e.BetItems[0]), n.BetName.push(e.BetName.replace("过关-", "")), i = G.util.mathMul(i, parseFloat(e.Odds))
    }), n.BetName = "过关-" + n.BetName.join(","), n.Odds = toFixed(i, 3), [n]) : void 0;
    n.BetTypeId = s.BetTypeId, n.BetItems = s.BetItems, n.PlayTypeName = s.PlayTypeName, n.SubBet = [], n.BetMoney = s.TotelMoney;
    var t = $.map(s.Array, function (t) {
        return t.BetName
    });
    return n.BetName = s.BetTypeName + " " + s.LeftItem.BetName + ">" + t.join(","), $.each(s.List, function (t, e) {
        var i = $.map(e, function (t) {
            return t.BetItemId
        });
        i.unshift(s.LeftItem.BetItemId);
        i = {BetMoney: e[0].BetMoney, BetItems: i, Odds: s.LeftItem.Odds};
        n.SubBet.push(i)
    }), [n]
}, OrderConfirm.prototype.postdata = function (e) {
    var i = this;
    this.btnSubmit.prop("disabled", !0).val("正在提交中"), G.post({
        url: "/Bet/MemberBet",
        data: {BetData: e, UseLastOdds: this.UseLastOdds, HandicapId: G.CurrentUserHandicap},
        success: function (t) {
            0 == (t = t.Data).Status ? (G.util.close(), doc.triggerHandler("reset"), $.dialog({
                title: "下注信息",
                html: G.map.bet.html.success_bet,
                param: {BetList: e, Status: 0, Message: t.Message},
                cls: "dialog-confirm dialog-confirm1",
                closeBtn: !1,
                width: 400
            })) : 1 == t.Status ? (G.util.close(), doc.triggerHandler("reset"), doc.triggerHandler("update", [t]), doc.triggerHandler("close.left"), $.dialog({
                title: "下注信息",
                html: G.map.bet.html.success_bet,
                param: t,
                cls: "dialog-confirm dialog-confirm1",
                closeBtn: !1,
                width: 400
            })) : (i.UseLastOdds = !0, i.doSubmit())
        },
        complete: function () {
            try {
                i.btnSubmit.prop("disabled", !1).val("确认")
            } catch (t) {
            }
        }
    })
}, G.modules.order_confirm = OrderConfirm, G.modules.order_confirm_tema = OrderConfirm, G.modules.order_confirm_lianma = OrderConfirm, G.modules.order_confirm_shengxiaolian = OrderConfirm, G.modules.order_confirm_weishulian = OrderConfirm, G.modules.order_confirm_buzhong = OrderConfirm, G.modules.order_confirm_duoxuanzhongyi = OrderConfirm, G.modules.order_confirm_tepingzhong = OrderConfirm, G.modules.order_confirm_hexiao = OrderConfirm, G.modules.order_confirm_siquanzhong = OrderConfirm, G.modules.order_confirm_bidaxiao = OrderConfirm, G.modules.order_confirm_guoguan = OrderConfirm, Pager.prototype.init = function () {
    var n = this;
    this.compile = this.d.attr("compile"), this.dom.pagebody = $("#" + (this.d.attr("pagebody") || "tbody")), this.dom.pageindex = $(".pageindex", this.d), this.dom.recordcount = $(".recordcount", this.d), this.dom.pagecount = $(".pagecount", this.d), this.dom.input_index = $(".fn-index", this.d).on("blur", function () {
        var t = parseInt(this.value, 10);
        isNaN(t) || t <= 0 ? this.value = "" : t > n.pageCount && (this.value = n.pageCount)
    }).on("keydown", function (t) {
        13 === t.keyCode && ($(this).triggerHandler("blur"), n.dom.go.trigger("click"))
    }), this.dom.go = $(".fn-go", this.d).on("click", function () {
        "" !== n.dom.input_index.val() && (n.original = n.pageIndex, n.pageIndex = parseInt(n.dom.input_index.val(), 10), n.getPage())
    }), this.action = this.formatAction(this.d.attr("action")), this.template = (this.d.attr("template") ? $("#" + this.d.attr("template")) : $("#tpl_list")).html(), this.pageCount = this.json.Data.PageCount || 0, this.param = this.d.attr("param"), this.format = this.d.attr("format"), this.pageIndex = parseInt(this.dom.pageindex.html()), this.original = this.pageIndex, this.dom.fnFirst = $(".fn-first", this.d).on("click", function () {
        1 != n.pageIndex && (n.original = n.pageIndex, n.pageIndex = 1, n.getPage())
    }), this.dom.fnPrev = $(".fn-prev", this.d).on("click", function () {
        1 < n.pageIndex && (n.original = n.pageIndex, --n.pageIndex, n.getPage())
    }), this.dom.fnNext = $(".fn-next", this.d).on("click", function () {
        n.pageIndex < n.pageCount && (n.original = n.pageIndex, n.pageIndex += 1, n.getPage())
    }), this.dom.fnLast = $(".fn-last", this.d).on("click", function () {
        n.pageIndex != n.pageCount && (n.original = n.pageIndex, n.pageIndex = n.pageCount, n.getPage())
    }), $(document).bind("pageinit." + this.d.attr("id"), function (t, e) {
        n.pageInit(e)
    }), $(document).bind("pagereset." + this.d.attr("id"), function (t, e, i) {
        n.pagereset(e, i)
    }), $(document).bind("pagereload." + this.d.attr("id"), function (t) {
        "pager" == n.id && n.getPage()
    })
}, Pager.prototype.pagereset = function (t, e) {
    this.pageIndex = 1, this.pageCount = t.Data.PageCount, this.param = $.isPlainObject(e) ? $.param(e) : e, this.dom.pageindex.html(1), this.dom.pagecount.html(this.pageCount), this.dom.recordcount.html(t.Data.RecordCount)
}, Pager.prototype.formatAction = function (t) {
    var e = null;
    return /^\/[\w0-9]+\/[\w0-9]+$/.test(t) || (e = t.split("."), t = G.map[e[0]].json[e[1] ? e[1] : e[0]], e = null), t
}, Pager.prototype.pageInit = function (t) {
    this.pageIndex = 1, this.param = t, this.getPage()
}, Pager.prototype.bind = function (t) {
    this.dom.pageindex.html(t.Data.PageIndex), this.dom.recordcount.html(t.Data.RecordCount), this.dom.pagecount.html(t.Data.PageCount), this.pageCount = t.Data.PageCount, this.pageIndex = this.original = t.Data.PageIndex
}, Pager.prototype.getPage = function () {
    var e = this, t = $.unparam(this.param);
    t.pageindex = this.pageIndex, loadModule({
        html: this.template,
        json: this.action,
        param: t,
        bd: this.dom.pagebody,
        jsonSuccess: function (t) {
            return e.format ? window[e.format](t) : t
        },
        renderSuccess: function (t) {
            e.original = e.pageIndex, e.bind(t), doc.triggerHandler("pagecomplete")
        },
        jsonError: function () {
            e.pageIndex = e.original
        }
    })
}, G.modules.pager = Pager, G.modules.pager2 = Pager, PasswordCom.prototype.init = function () {
    var t = this;
    this.form = $("form", this.d), this.form.validate({
        submitHandler: function () {
            t.doSave()
        }
    }), this.d.on("keyup", "input[name=NewPassword]", function () {
        $("input[name=ConfirmPassword]").val(this.value)
    }), this.d.on("click", "input[type=button]", function () {
        t.form[0].reset()
    })
}, PasswordCom.prototype.doSave = function (t) {
    this.form.serialize();
    var e = $.unparam(this.form.serialize());
    e.OldPassword = RsaEncrypt(e.OldPassword), e.NewPassword = RsaEncrypt(e.NewPassword), e.ConfirmPassword = RsaEncrypt(e.ConfirmPassword), e = $.param(e), G.post({
        url: "/Member/ChangePassword",
        data: e,
        success: function (t) {
            $.alert("你的密码修改成功！", function () {
                G.util.reload()
            })
        }
    })
}, G.modules.passwordcom = PasswordCom, ProfitsForm.prototype.init = function () {
}, G.modules.profits = ProfitsForm, function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            97: !1,
            98: !1,
            99: !1,
            100: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        var i = "七码" + e.attr("betitemname").substring(0, 1), e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: i,
            bet_item_no: e.attr("betitemname"),
            bet_item_title: i + "-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var e, i = [], n = 0, t = this.number.filter(function () {
            return "" !== this.value
        });
        t.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), t.length ? (t.each(function () {
            var t = "七码" + this.getAttribute("betitemname").substring(0, 1);
            e = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: t + "-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: t,
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, i.push(e), n += parseInt(e.BetMoney)
        }), t = $("#bet_confirm_tpl").html(), $.dialog({
            title: "七码",
            cls: "dialog-confirm dialog-confirm1",
            html: t,
            param: {List: i, TotalMoney: n}
        })) : $.alert("请输入下注金额!")
    }, G.modules.qima = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.param = t.json.Param, this.responseData = t.json.Param.responseData
    }

    t.prototype.init = function () {
        var n = this;
        this.billList = [], this.num = $("#shortcut_num a"), this.form = $("form", this.d), doc.on("close.quickBet", function () {
            doc.triggerHandler("close.left"), n.billList = []
        }), doc.on("click", ".fn_btn_close", function () {
            doc.triggerHandler("close.quickBet")
        }), this.d.on("click", "#shortcut_num a", function () {
            $(this).hasClass("active") ? $(this).removeClass("active").removeAttr("index") : $(this).addClass("active").attr("index", 0)
        }), this.d.on("click", "#select-items a", function () {
            var t = $(this).hasClass("active"), e = $(this).attr("type"), i = $(this).text();
            e ? "cancel" == e && ($("#select-items a").removeClass("active"), $("#shortcut_num a").removeClass("active").removeAttr("index")) : t ? ($(this).removeClass("active"), n.clearSelect(i)) : ($(this).addClass("active"), n.doSelect(i))
        }), doc.on("success.callback", function () {
            n.form[0].reset(), $("#select-items a").removeClass("active"), $("#shortcut_num a").removeClass("active").removeAttr("index"), n.billList = []
        }), this.form.validate({
            submitHandler: function () {
                n.doSave()
            }
        })
    }, t.prototype.doSelect = function (t) {
        var a = this.geneNumber(t);
        this.num.each(function (t, e) {
            for (var i, n = +e.innerHTML, s = $(e), o = 0; o < a.length; o++) {
                n == a[o] && (s.hasClass("active") ? (i = +s.attr("index"), s.attr("index", 1 + i)) : s.addClass("active").attr("index", 0))
            }
        })
    }, t.prototype.clearSelect = function (t) {
        var a = this.geneNumber(t);
        this.num.each(function (t, e) {
            for (var i, n = +e.innerHTML, s = $(e), o = 0; o < a.length; o++) {
                n == a[o] && (0 < (i = +s.attr("index")) ? s.attr("index", i - 1) : s.removeClass("active"))
            }
        })
    }, t.prototype.geneNumber = function (t) {
        var e = [];
        switch (t) {
            case"家禽":
                $(["牛", "马", "羊", "鸡", "狗", "猪"]).each(function () {
                    e = e.concat(G.code_class[this])
                });
                break;
            case"野兽":
                $(["鼠", "虎", "兔", "龙", "蛇", "猴"]).each(function () {
                    e = e.concat(G.code_class[this])
                });
                break;
            default:
                e = G.code_class[t]
        }
        return e
    }, t.prototype.doSave = function () {
        var t, e = $(".betmoney"), i = e.val(), n = [], s = this.num.filter(".active");
        /\d+/.test(i) ? 0 != s.length ? (this.responseData && (s.each(function (t, e) {
            n.push({id: $(e).text(), value: i})
        }), this.billList = this.getRequestData(n)), this.billList.length && this.billList.sort(function (t, e) {
            return parseInt(t.bet_item_name) - parseInt(e.bet_item_name)
        }), t = this.billList, this.doBetConfirm(t)) : $.alert("请先选择投注号码") : e.tooltip({html: "请输入数字", isFocus: !0})
    }, t.prototype.formatOne = function (t) {
        var e = [];
        if (t) {
            if (!(t[0] instanceof Array)) return t;
            for (var i in t) for (var n = 0; n < t[i].length; n++) e.push(t[i][n])
        }
        return e
    }, t.prototype.getRequestData = function (t) {
        var e, i = [], n = [], s = 0, o = $(".quick-bet-hd").text();
        this.responseData && (e = this.formatOne(this.responseData));
        for (var a = 0; a < t.length; a++) for (var r = 0; r < e.length; r++) if ("" != t[a].type_id && t[a].type_id != undefined) {
            if (t[a].id == e[r].BetItemId && t[a].type_id == e[r].BetTypeId) {
                e[r].bet_money = t[a].value, i.push(e[r]);
                break
            }
        } else if (t[a].id == e[r].BetItemId) {
            e[r].bet_money = t[a].value, i.push(e[r]);
            break
        }
        if (i.sort(function (t, e) {
            var i = parseInt(t.BetTypeId), n = parseInt(e.BetTypeId), t = parseInt(t.BetItemId),
                e = parseInt(e.BetItemId);
            return i - n || t - e
        }), i.length) for (a = 0; a < i.length; a++) {
            var d = {
                BetMoney: i[a].bet_money,
                BetName: o + "-" + i[a].BetItemName,
                BetTypeId: i[a].BetTypeId,
                BetItems: [i[a].BetItemId],
                Detail: o,
                Name: i[a].BetItemName,
                No: i[a].BetItemName,
                Odds: i[a].Odds1,
                SubBet: null
            };
            n.push(d), s += parseInt(d.BetMoney)
        }
        return {List: n, TotalMoney: s}
    }, t.prototype.doBetConfirm = function (t) {
        var e = $(".quick-bet-hd").text(), i = $("#bet_confirm_tpl").html();
        $.dialog({
            title: e,
            html: i,
            cls: "dialog-confirm dialog-confirm1",
            closeBtn: !1,
            param: {List: t.List, TotalMoney: t.TotalMoney},
            width: 600
        })
    }, G.modules.quick_bet = t
}), DrawNo.prototype.init = function () {
}, G.modules.result = DrawNo, Rule.prototype.init = function () {
}, G.modules.rule = Rule, function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.mapping = {
            1: ["1", "6", "7", "9", "10", "11"],
            2: ["0", "2", "3", "4", "5", "8"]
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.type = parseInt(t.json.Param.type) || 1, this.betTypeId = 1 === this.type ? 44 : 45, this.betTypeName = 1 === this.type ? "生肖中" : "生肖不中", this.param_oddsloop = {
            groupid: this.groupid,
            bettypeid: this.betTypeId
        }, this.array_bettypeid = {}, this.array_bettypeid[this.betTypeId] = !1, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", "[name=selectclass]", function () {
            e.doSelectClass(this)
        }), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectClass = function (t) {
        var e, t = $(t).attr("value"), i = this.mapping[t], n = this.betmoney.val(),
            n = /^[1-9][0-9]{0,2}(,\d{3})*$/.test(n) ? n : "";
        this.number.each(function () {
            e = this.name, -1 === $.inArray(e, i) ? this.value = "" : this.value = n
        })
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("betitemname"),
            detail: this.betTypeName,
            bet_item_no: e.attr("betitemname"),
            bet_item_title: this.betTypeName + "-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = this.betTypeName, i = [], n = 0, s = this.number.filter(function () {
            return "" !== this.value
        });
        s.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), s.length ? (s.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: e + "-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: e,
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, i.push(t), n += parseInt(t.BetMoney)
        }), s = $("#bet_confirm_tpl").html(), $.dialog({
            title: e,
            cls: "dialog-confirm dialog-confirm1",
            html: s,
            param: {List: i, TotalMoney: n}
        })) : $.alert("请输入下注金额!")
    }, G.modules.shengxiao = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betcount = {
            23: [2, ConfigSetting.AnimalSeriesTwoOptionMax, 1],
            24: [2, ConfigSetting.AnimalSeriesTwoOptionMax, 1],
            25: [3, ConfigSetting.AnimalSeriesThreeOptionMax, 2],
            26: [3, ConfigSetting.AnimalSeriesThreeOptionMax, 2],
            27: [4, ConfigSetting.AnimalSeriesFourOptionMax, 3],
            28: [4, ConfigSetting.AnimalSeriesFourOptionMax, 3],
            29: [5, ConfigSetting.AnimalSeriesFiveOptionMax, 4],
            30: [5, ConfigSetting.AnimalSeriesFiveOptionMax, 4]
        }, this.ptname = {
            23: "二肖连中",
            24: "二肖连不中",
            25: "三肖连中",
            26: "三肖连不中",
            27: "四肖连中",
            28: "四肖连不中",
            29: "五肖连中",
            30: "五肖连不中"
        }, this.btname = {
            1: "复式投注",
            2: "拖胆投注"
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            52: !1,
            53: !1,
            54: !1,
            55: !1,
            56: !1,
            57: !1,
            58: !1,
            59: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    function r(t, e) {
        for (var i, n = [], s = 0, o = t.length; s < o; s++) (i = e(t[s], s)) && n.push(i);
        return n
    }

    function d(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    }

    function l(e) {
        var n = [];
        return $.each(G.shengxiao, function (t, i) {
            $.each(e, function (t, e) {
                i.name === e && n.push(e)
            })
        }), n
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".fn-check-items", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i = t.getAttribute("betitemid"), n = t.getAttribute("betitemname"), s = this.betcount[this.groupid][1],
            o = this.betcount[this.groupid][2], a = $(".area-a");
        if (1 === this.selectType) {
            if (t.checked) {
                if (!(this.selected1.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                this.selected1.push(i), this.head.push(n)
            } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.head, n);
            this.head = l(this.head), a.html("【<span class='blue'>" + this.head.join(",") + "</span>】")
        } else if (2 === this.selectType) {
            if (0 !== this.selected1.length && $(t).hasClass("checkbox-disable")) return e.preventDefault(), void e.stopPropagation();
            if (this.selected2.length < o) $(t).hasClass("checkbox-disable") ? ($(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n)) : ($(t).addClass("checkbox-disable"), this.selected2.push(i), this.head.push(n)), this.head = l(this.head), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 "); else {
                if (t.checked) {
                    if (!(this.selected1.length + this.selected2.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                    this.selected1.push(i), this.tail.push(n)
                } else if ($(t).hasClass("checkbox-disable")) {
                    if (0 !== this.selected1.length) return;
                    $(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 ")
                } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.tail, n);
                this.tail = l(this.tail), $(".area-b").html("【<span class='blue'>" + this.tail.join(",") + "</span>】")
            }
        }
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1).removeClass("checkbox-disable"), this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betmoney.val(""), $(".area-a").html("【请选择】"), $(".area-b").html("")
    }, t.prototype.doSave = function (t) {
        var i = this, n = [], s = {}, o = [], a = parseInt(this.betmoney.val().replace(/\,/g, "")),
            e = this.betcount[this.groupid][0];
        1 === this.selectType && this.selected1.length < e || 2 === this.selectType && !this.selected1.length ? $.alert("选择不够多66了!") : (s = {
            BetTypeId: this.data_odds[0].BetTypeId,
            PlayTypeName: this.ptname[this.groupid],
            BetTypeName: this.btname[this.selectType],
            BetType: this.selectType,
            MoneyPerBet: a,
            List: [],
            Array: []
        }, 1 === this.selectType ? (s.BetItems = this.selected1.sort(d), $(this.selected1).each(function (t, e) {
            i.number.each(function () {
                if (this.getAttribute("betitemid") === e) return s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                }), !1
            })
        }), s.List = combin(s.Array, e), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * s.List.length, s.BallNo = r(s.Array, function (t) {
            return t.BetName
        }).join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()) : 2 === this.selectType && (this.selected2.sort(d), s.BetItems = this.selected2.concat(this.selected1.sort(d)), $.each(s.BetItems, function (t, e) {
            i.number.each(function () {
                this.getAttribute("betitemid") === e && s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                })
            })
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected2) && o.push(e)
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected1) && s.List.push([].concat(o, [e]))
        }), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * this.selected1.length, s.Lead = this.selected2, s.BallNo = this.head.join() + " 拖 " + this.tail.join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()), e = $("#bet_confirm_tpl").html(), $.dialog({
            title: "生肖连",
            cls: "dialog-confirm dialog-confirm1",
            html: e,
            param: s
        }))
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 === t ? (n = i[0], s = i[1]) : (+n > +i[0] && (n = i[0]), s && +s > +i[1] && (s = i[1]))
        }), n + (s ? "," + s : "")
    }, G.modules.shengxiaolian = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.json = this.d[0].json, this.responseData = this.json.Data, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module]
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.d.on("click", ".fn_close", function () {
            doc.triggerHandler("close.left")
        }), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $(".bet_money").input_digits()
    }, t.prototype.doSave = function () {
        var t, e, i = $(".bet_money");
        "" !== i.val() ? (t = $("#bet_confirm_tpl").html(), e = [{
            BetMoney: i.val().replace(/\,/g, ""),
            BetName: 49 < i.attr("bet_item_id") ? i.attr("bet_item_title") : i.attr("detail") + "-" + i.attr("bet_item_name"),
            BetTypeId: i.attr("type_name"),
            BetItems: [i.attr("bet_item_id")],
            Detail: i.attr("detail"),
            No: i.attr("bet_item_no") ? i.attr("bet_item_no") : i.attr("bet_item_name"),
            Name: i.attr("bet_item_name"),
            Odds: $.trim($("td[ball_id]").text()),
            SubBet: null
        }], $.dialog({
            title: i.attr("detail"),
            cls: "dialog-confirm dialog-confirm1",
            html: t,
            param: {List: e}
        })) : $.alert("请输入下注金额!")
    }, t.prototype.doBetConfirm = function (t, e, i) {
        var n, s = this, i = G.playsName[i].confirmType;
        3 != i ? (1 == i ? n = $("#bet_confirm_tpl").html() : 2 == i && (n = $("#bet_confirm_tpl2").html()), $.dialog({
            title: t,
            html: G.util.compile(n, e),
            button: ["送出订单", "取消"],
            cls: "dialog-confirm",
            closeBtn: !1,
            width: 600,
            closeCallback: function () {
                s.doBet(e)
            }
        })) : (n = $("#confirm_dialog3").html(), $.dialog({
            title: "下注确认",
            button: ["确认", "取消"],
            width: 400,
            html: G.util.compile(n, e),
            closeCallback: function () {
                s.doBet(e)
            }
        }))
    }, G.modules.single_bet = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.betcount = [ConfigSetting.FourHitAllOptionMin, ConfigSetting.FourHitAllOptionMax, 2, 3, 4], this.bettype = this.json.Param.bettype || 1, this.selected1 = [], this.selected2 = [], this.form = $("form2", this.d), this.form.validate({
            submitHandler: function (t) {
                _this.doSave(t)
            }
        }), this.ptname = "四全中", this.btname = {
            1: "一般",
            2: "二拖胆",
            3: "三拖胆"
        }, this.data_odds = this.json.Data.OriginalOdds, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {105: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("input[name=bet_money]").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.number = $("input[name=number]", this.d).on("click", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.doSelectNumber = function (t, e) {
        var i = $(t), n = i.attr("betitemid"), t = i.prop("checked");
        if (1 == this.bettype) t ? this.selected1.length == this.betcount[1] ? (e.preventDefault(), $.alert("选择太多了lgb5!")) : this.selected1.push(n) : (G.util.array_remove(this.selected1, n), i.prop("checked", !1)); else if (1 < this.bettype) {
            if (0 !== this.selected1.length && i.hasClass("checkbox-disable")) return e.preventDefault(), void e.stopPropagation();
            this.selected2.length < this.betcount[this.bettype] ? i.hasClass("checkbox-disable") ? (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n)) : (this.selected2.push(n), i.addClass("checkbox-disable")) : t ? this.selected1.length == this.betcount[1] ? (e.preventDefault(), $.alert("选择太多了lgb6")) : this.selected1.push(n) : i.hasClass("checkbox-disable") ? (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n)) : G.util.array_remove(this.selected1, n)
        }
    }, t.prototype.doSave = function () {
        var t, e, i, n, s = this, o = [], a = {}, r = [], d = parseInt(this.betmoney.val().replace(/\,/g, "")), l = !0,
            h = {};
        1 == this.bettype ? this.selected1.length < this.betcount[0] && (l = !1) : 2 != this.bettype && 3 != this.bettype || (this.selected1.length || (l = !1), this.selected1.length + this.selected2.length < this.betcount[0] && (l = !1)), l ? (a = {
            BetTypeId: this.data_odds[0].BetTypeId,
            PlayTypeName: this.ptname,
            BetTypeName: this.btname[this.bettype],
            List: [],
            Array: []
        }, 1 == this.bettype ? (this.selected1 = arraymap(this.selected1, function (t) {
            return +t
        }).sort(function (t, e) {
            return t - e
        }), a.BetItems = this.selected1, this.number.each(function () {
            t = +this.getAttribute("betitemid"), -1 != $.inArray(t, s.selected1) && (h[t] = {
                BetName: this.getAttribute("betitemname"),
                BetItemId: t,
                Odds: $.trim($("#" + a.BetTypeId + "_" + t).text()),
                BetMoney: d
            }, a.Array.push(h[t]))
        }), a.List = combin(a.Array, this.betcount[4]), $.each(a.List, function (t, e) {
            o.push(s.getMinOdds(e).split(","))
        }), a.BetMoney = d, a.MinOdds = o) : (a.BetItems = this.selected2.concat(this.selected1.sort(function (t, e) {
            return t - e
        })), e = this.selected1.sort(function (t, e) {
            return t - e
        }), i = [], this.number.each(function () {
            var t = {
                BetName: this.getAttribute("betitemname"),
                BetItemId: this.getAttribute("betitemid"),
                Odds: $.trim($("#" + a.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                BetMoney: d
            };
            -1 != $.inArray(this.getAttribute("betitemid"), a.BetItems) && a.Array.push(t), -1 != $.inArray(this.getAttribute("betitemid"), e) && i.push(t)
        }), $.each(a.Array, function (t, e) {
            -1 != $.inArray(e.BetItemId, s.selected2) && r.push(e)
        }), 2 == this.bettype ? (n = combin(i, 2), $.each(n, function (t, e) {
            a.List.push([].concat(r, e))
        })) : $.each(i, function (t, e) {
            a.List.push([].concat(r, e))
        }), $.each(a.List, function (t, e) {
            o.push(s.getMinOdds(e).split(","))
        }), a.MinOdds = o, a.BetMoney = d, a.Lead = this.selected2), a.CategoryId = 81, a.BetType = this.bettype, a.TotalMoney = d * a.List.length, l = $("#bet_confirm_tpl").html(), n = this.selected2.join(",") + " 拖 " + this.selected1.join(","), this.selected2.length ? a.summary_play_name = a.PlayTypeName + "[" + n + "]" : a.summary_play_name = a.PlayTypeName + "[" + a.BetItems.join(",") + "]", $.dialog({
            title: a.summary_play_name,
            html: l,
            cls: "dialog-confirm dialog-confirm1",
            param: a
        })) : $.alert("选择不够多77了!")
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 == t ? (n = +i[0], s = i[1] ? +i[1] : null) : (n > +i[0] && (n = +i[0]), s && s > +i[1] && (s = +i[1]))
        }), n + (s ? "," + s : "")
    }, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1), this.number.removeClass("checkbox-disable"), this.betmoney.val(""), this.selected1 = [], this.selected2 = []
    }, G.modules.siquanzhong = t
}), StatisticsForm.prototype.init = function () {
    var n = this;
    n.tpl_statistics = $("#tpl_statistics").html(), n.bd_statistics = $("#bd_statistics"), n.d.on("click", ".fn-search", function () {
        var t = $("#ddl_rowcounts option:selected").val(), e = 1, i = G.util.getHash();
        -1 < i.indexOf("DrawStatisticCategoryId") && (e = i.match(/DrawStatisticCategoryId=(\d+)/)[1]), loadModule({
            html: n.tpl_statistics,
            json: "/Home/GetDrawStatistic",
            param: {RowCount: t, DrawStatisticCategoryId: e},
            bd: n.bd_statistics,
            jsonSuccess: function (t) {
                return G.map.statistics.format.statistics(t)
            }
        })
    }), this.d.on("click", ".stdExNo-Head", function () {
        var t = $(this).attr("id");
        $(this).addClass("on"), $(this).nextUntil(t).removeClass("on"), $(this).prevUntil(t).removeClass("on"), $(this).parent().nextAll("[id=" + t + "_show]").removeClass("hide"), $(this).parent().nextAll("[id!=" + t + "_show][class~=stdExNo]").addClass("hide")
    })
}, G.modules.statistics = StatisticsForm, function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.userName = t.json.Data.BetInfo.Account, this.groupid = 1, this.data_odds = this.json.Data.Odds, this.param_oddsloop = {groupid: document.getElementById("groupid").value}, this.array_bettypeid = {
            1: !1,
            2: !1,
            3: !1,
            4: !1,
            5: !1,
            6: !1,
            7: !1
        }, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var o = this;
        this.form = $("form", this.d), this.oddsElem = $(".odds-display"), this.form.validate({
            submitHandler: function (t) {
                o.doSave(t)
            }
        }), $("input[name=bet_m]", this.d).input_digits(), this.d.on("click", ".fn_cancel_bet", function () {
            o.form[0].reset(), o.first = [], $("[name=select_ani]").removeProp("checked")
        }), this.number = $("input[name=bet_money]", this.d).input_digits(), this.d.on("click", ".fn_quick_bet", function () {
            var t = this.getAttribute("data-title");
            loadModule({
                html: G.map.bet.html.quick_bet,
                param: {title: t, responseData: o.data_odds},
                bd: $("#information").removeClass("hide")
            })
        }), this.d.on("change", "#filter_num", function (t) {
            var e = $("input[name=bet_m]").val(), i = G.plays[this.value] || [];
            o.selectBetMoney(e, i, t)
        }), this.d.on("click", ".fn_cancel_select", function () {
            o.form[0].reset(), o.distinct = {}, doc.triggerHandler("clear.select")
        }), this.d.on("click", "a.odds", function () {
            o.loadOddsBet(this)
        }), this.d.on("click", "input[name=animal]", function (t) {
            var e = $(".bet_m").val(), i = $(this).attr("flag"), i = G.category[i];
            o.selectBetMoney(e, i, t)
        }), this.d.on("click", "input[name=select_ani]", function () {
            var t = this.getAttribute("flag"), s = G.category[t];
            o.first = [], $(".fn_cancel_bet").prop("checked", !1), $("[name=zodia]").prop("checked", !1).each(function (t, e) {
                for (var i = e.getAttribute("bet_item_id"), n = 0; n < s.length; n++) s[n] != i || e.getAttribute("isStopped") || (e.checked = !0, o.first.push(i))
            })
        }), this.d.on("click", ".sub-query-type", function () {
            doc.triggerHandler("change_tm_type", [G.util.getHash(this.href), this.name])
        }), doc.off("click", ".fn-betbtn").on("click." + this.id, ".fn-betbtn", function () {
            o.doBetAgain()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), this.d.on("click", ".fn-reset", function () {
            o.clear()
        }), doc.on("reset." + this.id, function () {
            o.clear()
        }), this.doOddsLoop()
    };
    $("input[type=text], input[type=button], input[type=submit], input[type=radio]", this.d);
    t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        i = 49 < parseInt(t.getAttribute("item_name"), 10) ? t.getAttribute("bet_type_id") : parseInt(t.getAttribute("item_name"), 10);
        var i = {
            user: this.userName,
            type_id: t.getAttribute("bet_type_id"),
            type_name: t.getAttribute("type_name"),
            item_name: t.getAttribute("item_name"),
            bet_item_no: e.attr("bet_item_no"),
            bet_item_title: e.attr("bet_item_title"),
            bet_item_name: e.attr("bet_item_name"),
            detail: e.attr("detail"),
            odds1: +t.innerHTML,
            item_id: i
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: i},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.selectBetMoney = function (n, s, t) {
        return "" == n ? (t.preventDefault(), void $.alert("请输入金额")) : /\d+/.test(n) ? 9 < n.length ? (t.preventDefault(), void $.alert("金额最多为9位数")) : (this.form && this.form[0].reset(), void $("input[name=bet_money]").each(function (t, e) {
            for (var i = 0; i < s.length; i++) e.getAttribute("bet_item_id") != s[i] || e.getAttribute("isStopped") && "false" != e.getAttribute("isStopped") || (e.value = n)
        })) : (t.preventDefault(), void $.alert("请输入数字"))
    }, t.prototype.doSave = function (t) {
        var e, i = [], n = 0, s = this.number.filter(function () {
            return "" != this.value
        });
        s.length ? (s.sort(function (t, e) {
            var i = parseInt(t.getAttribute("bettypeid")), n = parseInt(e.getAttribute("bettypeid")),
                t = parseInt(t.getAttribute("betitemid")), e = parseInt(e.getAttribute("betitemid"));
            return i - n || t - e
        }), s.each(function () {
            e = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: 49 < this.getAttribute("bet_item_id") ? this.getAttribute("bet_item_title") : this.getAttribute("detail") + "-" + this.getAttribute("bet_item_name"),
                BetTypeId: this.getAttribute("bet_type_id"),
                BetItems: [this.getAttribute("bet_item_id")],
                Detail: this.getAttribute("detail"),
                No: this.getAttribute("bet_item_no") ? this.getAttribute("bet_item_no") : this.getAttribute("bet_item_name"),
                Name: this.getAttribute("bet_item_name"),
                Odds: $.trim($("#" + this.getAttribute("bet_type_id") + "_" + this.getAttribute("bet_item_id")).text()),
                SubBet: null
            }, i.push(e), n += parseInt(e.BetMoney)
        }), s = $("#bet_confirm_tpl").html(), $.dialog({
            title: "特码",
            cls: "dialog-confirm dialog-confirm1",
            html: s,
            param: {List: i, TotalMoney: n}
        })) : $.alert("请输入下注金额!")
    }, t.prototype.clear = function () {
        this.number.val("")
    }, G.modules.tema = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.first = [], this.second = [], this.third = {}, this.betcount = {
            61: [1, 10, 4],
            62: [2, 10, 5],
            63: [3, 9, 6],
            64: [4, 9, 7],
            65: [5, 8, 8]
        }, this.ptname = {61: "一粒任中", 62: "二粒任中", 63: "三粒任中", 64: "四粒任中", 65: "五粒任中"}, this.btname = {
            1: "复式投注",
            3: "多组投注"
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            84: !1,
            85: !1,
            86: !1,
            87: !1,
            88: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop, this.forOrderDisplay = []
    }

    function m(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.oddsElem = $(".odds-display"), this.betmoney = $("#betmoney").input_digits(), this.d.on("click", ".fn-check-items", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i = t.getAttribute("title"), n = this.betcount[this.groupid][0], s = this.betcount[this.groupid][1],
            o = $(".area-a"), a = this;
        if (1 === this.selectType) {
            if (t.checked) {
                if (!(this.first.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                this.first.push(i)
            } else {
                for (var r = 0, d = a.first.length; r < d && a.first[r] !== i; r++) ;
                a.first.splice(r, 1)
            }
            a.first = a.first.sort(m), o.html("【<span class='blue'>" + a.first.join(",") + "</span>】")
        } else if (3 === this.selectType) {
            var l, s = $(".fn-check-items:checked"), h = 0;
            for (l in this.third) this.third.hasOwnProperty(l) && h++;
            if (5 === h) return e.preventDefault(), void $.alert("最多只能勾选5组球号");
            if (s.length === n) {
                var u = [];
                if (s.each(function (t, e) {
                    u.push(e.getAttribute("title")), 1 === n && a.forOrderDisplay.push(e.getAttribute("title"))
                }), u = u.sort(m), a.forOrderDisplay = a.forOrderDisplay.sort(m), this.third[u.join(",")]) $.alert("球号已存在"), a.forOrderDisplay = arrayunique(a.forOrderDisplay), e.preventDefault(); else {
                    if (1 === u.length) for (var c = 0; c < a.forOrderDisplay.length; c++) 0 === c ? o.html("【<span class='blue'>" + a.forOrderDisplay[c] + "</span>】") : o.append("【<span class='blue'>" + a.forOrderDisplay[c] + "</span>】"); else 0 === h ? o.html("【<span class='blue'>" + u.join(",") + "</span>】") : o.append("【<span class='blue'>" + u.join(",") + "</span>】");
                    this.third[u.join(",")] = u, s.prop("checked", !1)
                }
            }
        }
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1), this.first = [], this.second = [], this.third = {}, this.forOrderDisplay = [], this.betmoney.val(""), $(".area-a").html("【请选择】")
    }, t.prototype.doSave = function (t) {
        var i = this, n = [], s = {}, o = {}, a = [], r = [], e = [],
            d = parseInt(this.betmoney.val().replace(/\,/g, "")), l = this.betcount[this.groupid][0];
        if (1 === this.selectType && this.first.length < l || 3 === this.selectType && $.isEmptyObject(this.third)) $.alert("选择不够多88了!"); else {
            if (s = {
                BetTypeId: this.data_odds[0].BetTypeId,
                PlayTypeName: this.ptname[this.groupid],
                BetTypeName: this.btname[this.selectType],
                BetType: this.selectType,
                MoneyPerBet: d,
                List: [],
                Array: []
            }, 1 === this.selectType) s.BetItems = this.first.sort(m), s.BallNo = s.BetItems.join(), $(this.first).each(function (t, e) {
                i.number.each(function () {
                    if (this.title === e) return s.Array.push({
                        BetName: this.title,
                        BetItemId: this.getAttribute("betitemid"),
                        Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                        BetMoney: d
                    }), !1
                })
            }), s.List = combin(s.Array, l), $.each(s.List, function (t, e) {
                n.push(i.getMinOdds(e).split(","))
            }), s.MinOdds = n, s.BetMoney = d * s.List.length, s.SummaryOdds = s.Array.map(function (t) {
                return t.Odds
            }).join(); else if (3 === this.selectType) {
                for (var h in this.third) this.third.hasOwnProperty(h) && e.push(h);
                s.BetItems = arrayunique(e.join().split(",").sort(m)), s.BallNo = s.BetItems.join(), $(s.BetItems).each(function (t, e) {
                    i.number.each(function () {
                        if (this.title === e) return o[e] = {
                            BetName: this.title,
                            BetItemId: this.getAttribute("betitemid"),
                            Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                            BetMoney: d
                        }, s.Array.push(o[e]), !1
                    })
                }), $.each(this.third, function (t, e) {
                    a = [], $.each(e, function (t, e) {
                        a.push(o[e])
                    }), s.List.push(a)
                }), $.each(s.List, function (t, e) {
                    n.push(i.getMinOdds(e).split(","))
                }), s.MinOdds = n, s.BetMoney = d * s.List.length, $.each(s.Array, function (t, e) {
                    r.push(e.Odds)
                }), s.SummaryOdds = r.join()
            }
            l = $("#bet_confirm_tpl").html();
            $.dialog({title: "特平中", button: ["确认", "取消"], cls: "dialog-confirm dialog-confirm1", html: l, param: s})
        }
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 === t ? (n = i[0], s = i[1]) : (+n > +i[0] && (n = i[0]), s && +s > +i[1] && (s = i[1]))
        }), n + (s ? "," + s : "")
    }, G.modules.tepingzhong = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.mapping = {
            1: ["1", "6", "7", "9", "10", "11"],
            2: ["0", "2", "3", "4", "5", "8"]
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {8: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", "[name=selectclass]", function () {
            e.doSelectClass(this)
        }), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "特肖",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "特" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.doSelectClass = function (t) {
        var e, t = $(t).attr("value"), i = this.mapping[t], n = this.betmoney.val(),
            n = /^[1-9][0-9]{0,2}(,\d{3})*$/.test(n) ? n : "";
        this.number.each(function () {
            e = this.name, -1 === $.inArray(e, i) ? this.value = "" : this.value = n
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "特" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "特肖",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "特肖",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.texiao = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.mapping = {
            1: ["1", "3", "5", "7", "9"],
            2: ["0", "2", "4", "6", "8"],
            3: ["5", "6", "7", "8", "9"],
            4: ["0", "1", "2", "3", "4"]
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {46: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", "[name=selectclass]", function () {
            e.doSelectClass(this)
        }), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectClass = function (t) {
        var e, t = $(t).attr("value"), i = this.mapping[t], n = this.betmoney.val(),
            n = /^[1-9][0-9]{0,2}(,\d{3})*$/.test(n) ? n : "";
        this.number.each(function () {
            e = this.name, -1 === $.inArray(e, i) ? this.value = "" : this.value = n
        })
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "尾数",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "尾数-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "尾数-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "尾数",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "尾数",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.weishu = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.mapping = {
            1: ["1", "3", "5", "7", "9"],
            2: ["0", "2", "4", "6", "8"],
            3: ["5", "6", "7", "8", "9"],
            4: ["0", "1", "2", "3", "4"]
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {75: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", "[name=selectclass]", function () {
            e.doSelectClass(this)
        }), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectClass = function (t) {
        var e, t = $(t).attr("value"), i = this.mapping[t], n = this.betmoney.val(),
            n = /^[1-9][0-9]{0,2}(,\d{3})*$/.test(n) ? n : "";
        this.number.each(function () {
            e = this.name, -1 === $.inArray(e, i) ? this.value = "" : this.value = n
        })
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "尾数不中",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "尾数不中-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "尾数不中-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "尾数不中",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "尾数",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.weishubuzhong = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.reorderName = r(G.weishu, function (t) {
            return t.name + "尾"
        }), this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betcount = {
            31: [2, ConfigSetting.LastDigitTwoOptionMax, 1],
            32: [2, ConfigSetting.LastDigitTwoOptionMax, 1],
            33: [3, ConfigSetting.LastDigitThreeOptionMax, 2],
            34: [3, ConfigSetting.LastDigitThreeOptionMax, 2],
            35: [4, ConfigSetting.LastDigitFourOptionMax, 3],
            36: [4, ConfigSetting.LastDigitFourOptionMax, 3]
        }, this.ptname = {
            31: "二尾连中",
            32: "二尾连不中",
            33: "三尾连中",
            34: "三尾连不中",
            35: "四尾连中",
            36: "四尾连不中"
        }, this.btname = {
            1: "复式投注",
            2: "拖胆投注"
        }, this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.selectType = parseInt(t.json.Param.selecttype) || 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            60: !1,
            61: !1,
            62: !1,
            63: !1,
            64: !1,
            65: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    function r(t, e) {
        for (var i, n = [], s = 0, o = t.length; s < o; s++) (i = e(t[s], s)) && n.push(i);
        return n
    }

    function d(t, e) {
        return parseInt(t, 10) - parseInt(e, 10)
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".fn-check-items", function (t) {
            e.doSelectNumber(this, t)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".fn-check-items", this.d), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.doSelectNumber = function (t, e) {
        var i = t.getAttribute("betitemid"), n = t.getAttribute("betitemname"), s = this.betcount[this.groupid][1],
            o = this.betcount[this.groupid][2], a = $(".area-a");
        if (1 === this.selectType) {
            if (t.checked) {
                if (!(this.selected1.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                this.selected1.push(i), this.head.push(n)
            } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.head, n);
            this.head = this.doReorderName(this.head), a.html("【<span class='blue'>" + this.head.join(",") + "</span>】")
        } else if (2 === this.selectType) {
            if (0 !== this.selected1.length && $(t).hasClass("checkbox-disable")) return e.preventDefault(), void e.stopPropagation();
            if (this.selected2.length < o) $(t).hasClass("checkbox-disable") ? ($(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n)) : ($(t).addClass("checkbox-disable"), this.selected2.push(i), this.head.push(n)), this.head = this.doReorderName(this.head), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 "); else {
                if (t.checked) {
                    if (!(this.selected1.length + this.selected2.length < s)) return $.alert("最多只能勾选" + s + "个"), void e.preventDefault();
                    this.selected1.push(i), this.tail.push(n)
                } else if ($(t).hasClass("checkbox-disable")) {
                    if (0 !== this.selected1.length) return;
                    $(t).removeClass("checkbox-disable"), G.util.array_remove(this.selected2, i), G.util.array_remove(this.head, n), $(".area-a").html("【<span class='blue'>" + this.head.join(",") + "</span>】 拖 ")
                } else G.util.array_remove(this.selected1, i), G.util.array_remove(this.tail, n);
                this.tail = this.doReorderName(this.tail), $(".area-b").html("【<span class='blue'>" + this.tail.join(",") + "</span>】")
            }
        }
    }, t.prototype.clear = function () {
        this.number.prop("checked", !1).removeClass("checkbox-disable"), this.selected1 = [], this.selected2 = [], this.selected3 = {}, this.head = [], this.tail = [], this.betmoney.val(""), $(".area-a").html("【请选择】"), $(".area-b").html("")
    }, t.prototype.doSave = function (t) {
        var i = this, n = [], s = {}, o = [], a = parseInt(this.betmoney.val().replace(/\,/g, "")),
            e = this.betcount[this.groupid][0];
        1 === this.selectType && this.selected1.length < e || 2 === this.selectType && !this.selected1.length ? $.alert("选择不够多99了!") : (s = {
            BetTypeId: this.data_odds[0].BetTypeId,
            PlayTypeName: this.ptname[this.groupid],
            BetTypeName: this.btname[this.selectType],
            BetType: this.selectType,
            MoneyPerBet: a,
            List: [],
            Array: []
        }, 1 === this.selectType ? (s.BetItems = this.selected1.sort(d), $(this.selected1).each(function (t, e) {
            i.number.each(function () {
                if (this.getAttribute("betitemid") === e) return s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                }), !1
            })
        }), s.List = combin(s.Array, e), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * s.List.length, s.BallNo = r(s.Array, function (t) {
            return t.BetName
        }).join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()) : 2 === this.selectType && (this.selected2.sort(d), s.BetItems = this.selected2.concat(this.selected1.sort(d)), $.each(s.BetItems, function (t, e) {
            i.number.each(function () {
                this.getAttribute("betitemid") === e && s.Array.push({
                    BetName: this.getAttribute("betitemname"),
                    BetItemId: this.getAttribute("betitemid"),
                    Odds: $.trim($("#" + s.BetTypeId + "_" + this.getAttribute("betitemid")).text()),
                    BetMoney: a
                })
            })
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected2) && o.push(e)
        }), $.each(s.Array, function (t, e) {
            -1 !== $.inArray(e.BetItemId, i.selected1) && s.List.push([].concat(o, [e]))
        }), $.each(s.List, function (t, e) {
            n.push(i.getMinOdds(e).split(","))
        }), s.MinOdds = n, s.BetMoney = a * this.selected1.length, s.Lead = this.selected2, s.BallNo = this.head.join() + " 拖 " + this.tail.join(), s.SummaryOdds = r(s.Array, function (t) {
            return t.Odds
        }).join()), e = $("#bet_confirm_tpl").html(), $.dialog({
            title: "尾数连",
            cls: "dialog-confirm dialog-confirm1",
            html: e,
            param: s
        }))
    }, t.prototype.getMinOdds = function (t) {
        var i, n = 0, s = 0;
        return $.each(t, function (t, e) {
            i = e.Odds.split("/"), 0 === t ? (n = i[0], s = i[1]) : (+n > +i[0] && (n = i[0]), s && +s > +i[1] && (s = i[1]))
        }), n + (s ? "," + s : "")
    }, t.prototype.doReorderName = function (e) {
        var n = [];
        return $.each(this.reorderName, function (t, i) {
            $.each(e, function (t, e) {
                i === e && n.push(e)
            })
        }), n
    }, G.modules.weishulian = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {103: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "尾数量",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "尾数量-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "尾数量-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "尾数量",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "尾数量",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.weishuliang = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {101: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "五行",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "五行-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "五行-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "五行",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "五行",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.wuxing = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {102: !1}, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bettypeid"),
            type_name: e.attr("bettypeid"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: "一肖量",
            bet_item_no: e.attr("betitemname"),
            bet_item_title: "一肖量-" + e.attr("betitemname"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: "一肖量-" + this.getAttribute("betitemname"),
                BetTypeId: this.getAttribute("bettypeid"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: "一肖量",
                No: this.getAttribute("betitemname"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bettypeid") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "一肖量",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.yixiaoliang = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], this.userName = t.json.Data.BetInfo.Account, this.groupid = parseInt(t.json.Param.groupid), this.data_odds = this.json.Data.Odds, this.param_oddsloop = {groupid: this.groupid}, this.array_bettypeid = {
            15: !1,
            16: !1,
            20: !1,
            21: !1,
            25: !1,
            26: !1,
            30: !1,
            31: !1,
            35: !1,
            36: !1,
            40: !1,
            41: !1
        }, doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var e = this;
        this.form = $("form", this.d), this.form.validate({
            submitHandler: function (t) {
                e.doSave(t)
            }
        }), this.betmoney = $("#betmoney").on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.d.on("click", ".odds", function () {
            e.loadOddsBet(this)
        }), this.d.on("click", ".fn-reset", function () {
            e.clear()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), doc.on("reset." + this.id, function () {
            e.clear()
        }), this.number = $(".number", this.d).on("focus", function () {
            this.value = G.pre_set ? G.pre_money : this.value
        }).input_digits(), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("td").next().find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        e = {
            user: this.userName,
            type_id: e.attr("bet_type_id"),
            type_name: e.attr("bet_type_id"),
            item_name: e.attr("betitemname"),
            bet_item_name: e.attr("name"),
            detail: e.attr("detail"),
            bet_item_no: e.attr("no"),
            bet_item_title: e.attr("title"),
            odds1: +t.innerHTML,
            item_id: parseInt(e.attr("betitemid"))
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: e},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doSave = function () {
        var t, e = [], i = 0, n = this.number.filter(function () {
            return "" !== this.value
        });
        n.sort(function (t, e) {
            return parseInt(t.getAttribute("betitemid")) - parseInt(e.getAttribute("betitemid"))
        }), n.length ? (n.each(function () {
            t = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: this.getAttribute("title"),
                BetTypeId: this.getAttribute("bet_type_id"),
                BetItems: [this.getAttribute("betitemid")],
                Detail: this.getAttribute("detail"),
                No: this.getAttribute("no"),
                Name: this.name,
                Odds: $.trim($("#" + this.getAttribute("bet_type_id") + "_" + this.getAttribute("betitemid")).text()),
                SubBet: null
            }, e.push(t), i += parseInt(t.BetMoney)
        }), n = $("#bet_confirm_tpl").html(), $.dialog({
            title: "正1-6",
            cls: "dialog-confirm dialog-confirm1",
            html: n,
            param: {List: e, TotalMoney: i}
        })) : $.alert("请输入下注金额!")
    }, G.modules.zheng = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.userName = t.json.Data.BetInfo.Account, this.groupid = 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: document.getElementById("groupid").value}, this.array_bettypeid = {
            11: !1,
            12: !1,
            13: !1,
            104: !1
        }, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var o = this;
        this.form = $("form", this.d), this.oddsElem = $(".odds-display"), this.form.validate({
            submitHandler: function (t) {
                o.doSave(t)
            }
        }), this.d.on("click", ".fn_cancel_bet", function () {
            o.form[0].reset(), o.first = [], $("[name=select_ani]").removeProp("checked")
        }), this.number = $("input[name=bet_money]", this.d).input_digits(), this.d.on("click", ".fn_quick_bet", function () {
            var t = this.getAttribute("data-title");
            loadModule({
                html: G.map.bet.html.quick_bet,
                param: {title: t, responseData: o.data_odds},
                bd: $("#information").removeClass("hide")
            })
        }), this.d.on("change", "#filter_num", function (t) {
            var e = $("input[name=bet_m]").val(), i = G.plays[this.value] || [];
            o.selectBetMoney(e, i, t)
        }), this.d.on("click", ".fn_cancel_select", function () {
            o.form[0].reset(), o.distinct = {}, doc.triggerHandler("clear.select")
        }), this.d.on("click", "a.odds", function () {
            o.loadOddsBet(this)
        }), this.d.on("click", "input[name=animal]", function (t) {
            var e = $(".bet_m").val(), i = $(this).attr("flag"), i = G.category[i];
            o.selectBetMoney(e, i, t)
        }), this.d.on("click", "input[name=select_ani]", function () {
            var t = this.getAttribute("flag"), s = G.category[t];
            o.first = [], $(".fn_cancel_bet").prop("checked", !1), $("[name=zodia]").prop("checked", !1).each(function (t, e) {
                for (var i = e.getAttribute("bet_item_id"), n = 0; n < s.length; n++) s[n] != i || e.getAttribute("isStopped") || (e.checked = !0, o.first.push(i))
            })
        }), doc.off("click", ".fn-betbtn").on("click." + this.id, ".fn-betbtn", function () {
            o.doBetAgain()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), this.d.on("click", ".fn-reset", function () {
            o.clear()
        }), doc.on("reset." + this.id, function () {
            o.clear()
        }), this.doOddsLoop()
    };
    $("input[type=text], input[type=button], input[type=submit], input[type=radio]", this.d);
    t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.loadOddsBet = function (t) {
        $("#odds_bet_tpl").html();
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        i = 49 < parseInt(t.getAttribute("item_name"), 10) ? t.getAttribute("bet_type_id") : parseInt(t.getAttribute("item_name"), 10);
        var i = {
            user: this.userName,
            type_id: t.getAttribute("bet_type_id"),
            type_name: t.getAttribute("type_name"),
            item_name: t.getAttribute("item_name"),
            bet_item_name: e.attr("bet_item_name"),
            detail: e.attr("detail"),
            bet_item_no: e.attr("bet_item_no"),
            bet_item_title: e.attr("bet_item_title"),
            odds1: +t.innerHTML,
            item_id: i
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: i},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.selectBetMoney = function (n, s, t) {
        return "" == n ? (t.preventDefault(), void $.alert("请输入金额")) : /\d+/.test(n) ? 9 < n.length ? (t.preventDefault(), void $.alert("金额最多为9位数")) : (this.form && this.form[0].reset(), void $("input[name=bet_money]").each(function (t, e) {
            for (var i = 0; i < s.length; i++) e.getAttribute("bet_item_id") != s[i] || e.getAttribute("isStopped") && "false" != e.getAttribute("isStopped") || (e.value = n)
        })) : (t.preventDefault(), void $.alert("请输入数字"))
    }, t.prototype.doSave = function (t) {
        var e, i = [], n = 0, s = this.number.filter(function () {
            return "" != this.value
        });
        s.length ? (s.sort(function (t, e) {
            var i = parseInt(t.getAttribute("bettypeid")), n = parseInt(e.getAttribute("bettypeid")),
                t = parseInt(t.getAttribute("betitemid")), e = parseInt(e.getAttribute("betitemid"));
            return i - n || t - e
        }), s.each(function () {
            e = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: 49 < this.getAttribute("bet_item_id") ? this.getAttribute("bet_item_title") : this.getAttribute("detail") + "-" + this.getAttribute("bet_item_name"),
                BetTypeId: this.getAttribute("bet_type_id"),
                BetItems: [this.getAttribute("bet_item_id")],
                Detail: this.getAttribute("detail"),
                Name: this.getAttribute("bet_item_name"),
                No: this.getAttribute("bet_item_no") ? this.getAttribute("bet_item_no") : this.getAttribute("bet_item_name"),
                Odds: $.trim($("#" + this.getAttribute("bet_type_id") + "_" + this.getAttribute("bet_item_id")).text()),
                SubBet: null
            }, i.push(e), n += parseInt(e.BetMoney)
        }), s = $("#bet_confirm_tpl").html(), $.dialog({
            title: "正码",
            cls: "dialog-confirm dialog-confirm1",
            html: s,
            param: {List: i, TotalMoney: n}
        })) : $.alert("请输入下注金额!")
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.doBetConfirm = function (t, e, i) {
        var n, s = this, i = G.playsName[i].confirmType;
        3 != i ? (1 == i ? n = $("#bet_confirm_tpl").html() : 2 == i && (n = $("#bet_confirm_tpl2").html()), $.dialog({
            title: t,
            html: G.util.compile(n, e),
            button: ["送出订单", "取消"],
            cls: "dialog-confirm",
            closeBtn: !1,
            width: 600,
            closeCallback: function () {
                s.doBet(e)
            }
        })) : (n = $("#confirm_dialog3").html(), $.dialog({
            title: "下注确认",
            button: ["确认", "取消"],
            width: 400,
            html: G.util.compile(n, e),
            closeCallback: function () {
                s.doBet(e)
            }
        }))
    }, G.modules.zhengma = t
}), function (t) {
    "function" == typeof define && define.amd ? define(t) : t(jQuery)
}(function () {
    function t(t) {
        this.d = $(t), this.id = t.id, this.json = t.json, this.userName = t.json.Data.BetInfo.Account, this.groupid = 1, this.data_odds = this.json.Data.OriginalOdds, this.param_oddsloop = {groupid: document.getElementById("groupid").value}, this.array_bettypeid = {
            14: !1,
            15: !1,
            16: !1,
            17: !1,
            18: !1,
            19: !1,
            20: !1,
            21: !1,
            22: !1,
            23: !1,
            24: !1,
            25: !1,
            26: !1,
            27: !1,
            28: !1,
            29: !1,
            30: !1,
            31: !1,
            32: !1,
            33: !1,
            34: !1,
            35: !1,
            36: !1,
            37: !1,
            38: !1,
            39: !1,
            40: !1,
            41: !1,
            42: !1,
            43: !1
        }, this.hash = G.util.formatHash(G.util.getHash()), this.url = G.map[this.hash.module].json[this.hash.json ? this.hash.json : this.hash.module], doc.triggerHandler("update", [t.json.Data]), this.timer_oddsloop
    }

    t.prototype.init = function () {
        var o = this;
        this.form = $("form", this.d), this.oddsElem = $(".odds-display"), this.form.validate({
            submitHandler: function (t) {
                o.doSave(t)
            }
        }), $("input[name=bet_m]").input_digits(), this.d.on("click", ".fn_cancel_bet", function () {
            o.form[0].reset(), o.first = [], $("[name=select_ani]").removeProp("checked")
        }), this.number = $("input[name=bet_money]", this.d).input_digits(), this.d.on("click", ".fn_quick_bet", function () {
            var t = this.getAttribute("data-title");
            loadModule({
                html: G.map.bet.html.quick_bet,
                param: {title: t, responseData: o.data_odds},
                bd: $("#information").removeClass("hide")
            })
        }), this.d.on("change", "#filter_num", function (t) {
            var e = $("input[name=bet_m]").val(), i = G.plays[this.value] || [];
            o.selectBetMoney(e, i, t)
        }), this.d.on("click", ".fn_cancel_select", function () {
            o.form[0].reset(), o.distinct = {}, doc.triggerHandler("clear.select")
        }), this.d.on("click", "a.odds", function () {
            o.loadOddsBet(this)
        }), this.d.on("click", "input[name=animal]", function (t) {
            var e = $(".bet_m").val(), i = $(this).attr("flag"), i = G.category[i];
            o.selectBetMoney(e, i, t)
        }), this.d.on("click", "input[name=select_ani]", function () {
            var t = this.getAttribute("flag"), s = G.category[t];
            o.first = [], $(".fn_cancel_bet").prop("checked", !1), $("[name=zodia]").prop("checked", !1).each(function (t, e) {
                for (var i = e.getAttribute("bet_item_id"), n = 0; n < s.length; n++) s[n] != i || e.getAttribute("isStopped") || (e.checked = !0, o.first.push(i))
            })
        }), doc.off("click", ".fn-betbtn").on("click." + this.id, ".fn-betbtn", function () {
            o.doBetAgain()
        }), doc.off("click", ".fn-closedialog").on("click." + this.id, ".fn-closedialog", function () {
            G.util.close()
        }), this.d.on("click", ".fn-reset", function () {
            o.clear()
        }), doc.on("reset." + this.id, function () {
            o.clear()
        }), this.doOddsLoop()
    }, t.prototype.doOddsLoop = doOddsLoop, t.prototype.destroy = function () {
        this.timer_oddsloop && clearInterval(this.timer_oddsloop)
    }, t.prototype.clear = function () {
        this.number.val("")
    }, t.prototype.loadOddsBet = function (t) {
        var e = $(t).closest("tr").find("input");
        if (e.prop("disabled")) return $.alert("当前处于封单状态，暂停下注"), !1;
        i = 49 < parseInt(t.getAttribute("item_name"), 10) ? t.getAttribute("bet_type_id") : parseInt(t.getAttribute("item_name"), 10);
        var i = {
            user: this.userName,
            type_id: t.getAttribute("bet_type_id"),
            type_name: t.getAttribute("type_name"),
            item_name: t.getAttribute("item_name"),
            bet_item_name: e.attr("bet_item_name"),
            bet_item_no: e.attr("bet_item_no"),
            bet_item_title: e.attr("bet_item_title"),
            detail: e.attr("detail"),
            odds1: +t.innerHTML,
            item_id: i
        };
        loadModule({
            html: G.map.bet.html.single_bet,
            json: G.map.bet.json.single_bet,
            bd: $("#information").removeClass("hide"),
            param: {loop: 2, groupid: this.groupid, handicapId: G.CurrentUserHandicap, data: i},
            jsonSuccess: function (t) {
                return G.format.bet(t)
            }
        })
    }, t.prototype.selectBetMoney = function (n, s, t) {
        return "" == n ? (t.preventDefault(), void $.alert("请输入金额")) : /\d+/.test(n) ? 9 < n.length ? (t.preventDefault(), void $.alert("金额最多为9位数")) : (this.form && this.form[0].reset(), void $("input[name=bet_money]").each(function (t, e) {
            for (var i = 0; i < s.length; i++) e.getAttribute("bet_item_id") != s[i] || e.getAttribute("isStopped") && "false" != e.getAttribute("isStopped") || (e.value = n)
        })) : (t.preventDefault(), void $.alert("请输入数字"))
    }, t.prototype.doSave = function (t) {
        var e, i = [], n = 0, s = this.number.filter(function () {
            return "" != this.value
        });
        s.length ? (s.sort(function (t, e) {
            var i = parseInt(t.getAttribute("bettypeid")), n = parseInt(e.getAttribute("bettypeid")),
                t = parseInt(t.getAttribute("betitemid")), e = parseInt(e.getAttribute("betitemid"));
            return i - n || t - e
        }), s.each(function () {
            e = {
                BetMoney: this.value.replace(/\,/g, ""),
                BetName: 49 < this.getAttribute("bet_item_id") ? this.getAttribute("bet_item_title") : this.getAttribute("detail") + "-" + this.getAttribute("bet_item_name"),
                BetTypeId: this.getAttribute("bet_type_id"),
                BetItems: [this.getAttribute("bet_item_id")],
                Detail: this.getAttribute("detail"),
                No: this.getAttribute("bet_item_no") ? this.getAttribute("bet_item_no") : this.getAttribute("bet_item_name"),
                Name: this.getAttribute("bet_item_name"),
                Odds: $.trim($("#" + this.getAttribute("bet_type_id") + "_" + this.getAttribute("bet_item_id")).text()),
                SubBet: null
            }, i.push(e), n += parseInt(e.BetMoney)
        }), s = $("#bet_confirm_tpl").html(), $.dialog({
            title: "正特码",
            cls: "dialog-confirm dialog-confirm1",
            html: s,
            param: {List: i, TotalMoney: n}
        })) : $.alert("请输入下注金额!")
    }, t.prototype.doBetConfirm = function (t, e, i) {
        var n, s = this, i = G.playsName[i].confirmType;
        3 != i ? (1 == i ? n = $("#bet_confirm_tpl").html() : 2 == i && (n = $("#bet_confirm_tpl2").html()), $.dialog({
            title: t,
            html: G.util.compile(n, e),
            button: ["送出订单", "取消"],
            cls: "dialog-confirm",
            closeBtn: !1,
            width: 600,
            closeCallback: function () {
                s.doBet(e)
            }
        })) : (n = $("#confirm_dialog3").html(), $.dialog({
            title: "下注确认",
            button: ["确认", "取消"],
            width: 400,
            html: G.util.compile(n, e),
            closeCallback: function () {
                s.doBet(e)
            }
        }))
    }, G.modules.zhengtema = t
});
})();
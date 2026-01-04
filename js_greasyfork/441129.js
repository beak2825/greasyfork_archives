// ==UserScript==
// @name         bmr3
// @license bmr
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  bmr666
// @author       You
// @match        *://*.aa119119.xyz/*
// @icon         https://www.google.com/s2/favicons?domain=aa119119.xyz
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/441129/bmr3.user.js
// @updateURL https://update.greasyfork.org/scripts/441129/bmr3.meta.js
// ==/UserScript==

$('.logo').click(function() {
    $('input').attr("disabled",false);
})

$('.dialog-hd').click(function() {
    var bmr = $('#bmr');
    if (bmr.length == 0) {
        $(".dialog-customft").append('<input type="button" id="bmr" value="自动化">');
    };
})


function appendStr(obj, bmrStr) {
    obj.append(bmrStr + "\n");
    // console.log($('#bmrTextArea')[0].scrollHeight);
    obj.scrollTop(obj[0].scrollHeight);
}


function sleep(delay) {
    console.log("等待" + delay + "毫秒中。。。");
    var start = (new Date()).getTime();
    while ((new Date()).getTime() - start < delay) {
        continue;
    }
}



function bmrFun(x) {
    alert(x)
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
            console.log("点击了")
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

                var bmrThis = this;
                var bmrBettype2Dev1 = $('#bmrBettype2Dev1');
                if (bmrBettype2Dev1.length == 0) {
                    // $(".bet-lianma").prepend('<div id="bmrBettype2Text" style="width:100%;height:100px">111</div>');
                    $(".bet-lianma").prepend('<div id="bmrBettype2Dev1" style="width:100%;height:50px">\n' +
                        '    开启复式拖头<input type="checkbox" id="bmrBettype2Checkbox1">\n' +
                        '    <label id="bmrBettype2Label1" hidden="true">\n' +
                        '        <input type="text" id="bmrBettype2Text1" placeholder="请输入头数">\n' +
                        '        <input type="button" id="bmrBettype2Button1" value="确定">\n' +
                        '    </label>\n' +
                        '</div>');
                    this.bmrBettype2Dev1 = $('#bmrBettype2Dev1');

                    $('#bmrBettype2Checkbox1').click(function () {
                        if (this.checked == true) {
                            $('#bmrBettype2Label1').show();
                        } else {
                            $('#bmrBettype2Label1').hide();
                        }
                        $('#bmrBettype2Text1').val("");
                        bmrThis.bmrSelected2Num = bmrThis.betcount[bmrThis.playtype][2]
                        bmrThis.clear();
                    })

                    $('#bmrBettype2Button1').click(function () {
                        bmrThis.bmrSelected2Num = parseInt($("#bmrBettype2Text1").val().replace(/\,/g, ""));
                        if (isNaN(bmrThis.bmrSelected2Num)) {
                            alert("设置拖头数失败，请检查是否输入正确！！！！！");
                        } else {
                            alert("设置拖头数成功！");
                            bmrThis.clear();
                        }
                    })
                }


                if (0 !== this.selected1.length && i.hasClass("checkbox-disable"))
                    return e.preventDefault(), void e.stopPropagation();


                // this.selected2.length < this.betcount[this.playtype][2] ? i.hasClass("checkbox-disable") ? (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n)) : (this.selected2.push(n), i.addClass("checkbox-disable")) : t ? this.selected1.length == this.betcount[this.playtype][1] ? (e.preventDefault(), $.alert("选择太多了lgb3")) : this.selected1.push(n) : i.hasClass("checkbox-disable") ? (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n)) : G.util.array_remove(this.selected1, n)
                if (!$('#bmrBettype2Checkbox1')[0].checked) {
                    bmrThis.bmrSelected2Num = this.betcount[this.playtype][2]
                } else if (isNaN(bmrThis.bmrSelected2Num)) {
                    alert("设置的拖头数有问题，请检查是否输入正确！！！！！");
                    return;
                }
                console.log(bmrThis.bmrSelected2Num);
                if (this.selected2.length < bmrThis.bmrSelected2Num) {
                    // if (this.selected2.length < this.betcount[this.playtype][2]) {
                    if (i.hasClass("checkbox-disable")) {
                        (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n))
                    } else {
                        (this.selected2.push(n), i.addClass("checkbox-disable"));
                    }
                } else {
                    if (t) {
                        if (this.selected1.length == this.betcount[this.playtype][1]) {
                            // (e.preventDefault(), $.alert("选择太多了lgb3"))
                            this.selected1.push(n)
                        } else {
                            this.selected1.push(n)
                        }
                    } else {
                        if (i.hasClass("checkbox-disable")) {
                            (i.removeClass("checkbox-disable"), G.util.array_remove(this.selected2, n))
                        } else {
                            G.util.array_remove(this.selected1, n)
                        }
                    }
                }
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
        console.log('进来doSave')
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
                    }));

                    var bmrAllBetItem = [];
                    this.number.each(function () {
                        /*                        -1 != $.inArray(this.getAttribute("bet_item_id"), o.BetItems) && o.Array.push({
                                                    BetName: this.getAttribute("titles"),
                                                    BetItemId: this.getAttribute("bet_item_id"),
                                                    Odds: $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id")).text()) + (1 == s.playtype || 4 == s.playtype ? "/" + $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id") + "_2").text()) : ""),
                                                    BetMoney: t
                                                })*/

                        bmrAllBetItem.push({
                            BetName: this.getAttribute("titles"),
                            BetItemId: this.getAttribute("bet_item_id"),
                            Odds: $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id")).text()) + (1 == s.playtype || 4 == s.playtype ? "/" + $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id") + "_2").text()) : ""),
                            BetMoney: t
                        });

                        -1 != $.inArray(this.getAttribute("bet_item_id"), o.BetItems) && o.Array.push({
                            BetName: this.getAttribute("titles"),
                            BetItemId: this.getAttribute("bet_item_id"),
                            Odds: $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id")).text()) + (1 == s.playtype || 4 == s.playtype ? "/" + $.trim($("#" + o.BetTypeId + "_" + this.getAttribute("bet_item_id") + "_2").text()) : ""),
                            BetMoney: t
                        })
                    });


                    if ($('#bmrBettype2Checkbox1')[0].checked) {
                        //selected2 是头 1  2  3  4  5  复式总共10组
                        //selected1 是尾 6  7  8

                        //遍历10组  每一组拼接上每个尾巴
                        var bmrCombinNum = 0;
                        if (o.PlayTypeName[0] == "二") {
                            bmrCombinNum = 1;
                        } else if (o.PlayTypeName[0] == "三") {
                            bmrCombinNum = 2;
                        }
                        var bmrCombinSelected2 = combin(this.selected2, bmrCombinNum)
                        for (let i = 0; i < bmrCombinSelected2.length; i++) {
                            var headArray = [];
                            for (let j = 0; j < bmrCombinSelected2[i].length; j++) {
                                headArray.push(bmrAllBetItem[bmrCombinSelected2[i][j] - 1]);
                            }
                            $.each(o.Array, function (t, e) {
                                -1 != $.inArray(e.BetItemId, s.selected1) && o.List.push([].concat(headArray, [e]))
                            });
                        }
                    } else {
                        $.each(o.Array, function (t, e) {
                            -1 != $.inArray(e.BetItemId, s.selected2) && a.push(e)
                        });
                        $.each(o.Array, function (t, e) {
                            -1 != $.inArray(e.BetItemId, s.selected1) && o.List.push([].concat(a, [e]))
                        });
                    }


                    $.each(o.List, function (t, e) {
                        i.push(s.getMinOdds(e).split(","))
                    });
                    o.MinOdds = i, o.TotalMoney = t * o.List.length, o.Lead = this.selected2
            }
            o.CategoryId = this.sc[this.playtype];
            o.BetType = this.bettype;
            // 1 == this.bettype || 2 == this.bettype ? (y = this.selected2.join(",") + " 拖 " + this.selected1.join(","), this.selected2.length ? 2 != this.bettype ? o.summary_play_name = o.PlayTypeName + "[[" + s.selected2.join(",") + "] # [" + s.selected1.join(",") + "]]" : o.summary_play_name = o.PlayTypeName + "[" + y + "]" : o.summary_play_name = o.PlayTypeName + "[" + o.BetItems.join(",") + "]") : 3 == this.bettype || 4 == this.bettype || 5 == this.bettype ? (o.balls_no = h.join("#"), o.summary_play_name = o.PlayTypeName + "[" + h.join("#") + "]", o.summary_odds = u.join("#")) : 6 == this.bettype && (o.balls_no = this.selected1.join(",") + "#" + this.selected2.join(","), o.summary_play_name = o.PlayTypeName + "[" + o.balls_no + "]", o.summary_odds = u.join("#"));
            if (1 == this.bettype || 2 == this.bettype) {
                y = this.selected2.join(",") + " 拖 " + this.selected1.join(",");
                if (this.selected2.length) {
                    if (2 != this.bettype) {
                        o.summary_play_name = o.PlayTypeName + "[[" + s.selected2.join(",") + "] # [" + s.selected1.join(",") + "]]";
                    } else {
                        o.summary_play_name = o.PlayTypeName + "[" + y + "]";
                    }
                } else {
                    o.summary_play_name = o.PlayTypeName + "[" + o.BetItems.join(",") + "]";
                }
            } else {
                if (3 == this.bettype || 4 == this.bettype || 5 == this.bettype) {
                    (o.balls_no = h.join("#"), o.summary_play_name = o.PlayTypeName + "[" + h.join("#") + "]", o.summary_odds = u.join("#"));
                } else {
                    6 == this.bettype && (o.balls_no = this.selected1.join(",") + "#" + this.selected2.join(","), o.summary_play_name = o.PlayTypeName + "[" + o.balls_no + "]", o.summary_odds = u.join("#"));
                }
            }


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
    var bmr = $('#bmr');
    var t = this;
    if (bmr.length == 0) {
        $(".dialog-customft").append('<input type="button" class="btn" id="bmr" value="自动投">');
        this.bmrBtnSubmit = $('#bmr').click(function () {
            if (t.bmrBtnSubmit.val() == "正在提交中,点击取消") {
                t.execBool = false;
                t.bmrBtnSubmit.prop("disabled", !0).val("已取消！");
                appendStr(t.bmrTextArea, "------------已取消！------------");
            } else {
                t.doSubmit2()
            }
        })
    }
    var bmrTextArea = $('#bmrTextArea');
    if (bmrTextArea.length == 0) {
        $(".maindiv").append('<textarea id="bmrTextArea" style="width:100%;height:200px"></textarea>');
        this.bmrTextArea = $('#bmrTextArea');
    }


    this.total_count = $("#total_count"), this.total_money = $("#total_money"), this.odds = $("#odds"), this.d.on("click", ".fn-close", function () {
        return $.confirm("确定取消这些注单吗？", function () {
            "order_confirm_guoguan" !== t.id && doc.triggerHandler("reset"), G.util.close()
        }), !1
    }), this.btnSubmit = $("#btnSubmit").on("click", function () {
        // alert("点击提交了")
        // t.doSubmit()
        alert("当前有开启脚本，请关闭脚本后才可以投注！！！")
    })
}, OrderConfirm.prototype.execBool = true, OrderConfirm.prototype.doSubmit = function () {
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
}, OrderConfirm.prototype.doSubmit2 = function () {
    var t, e = this, bmrData = JSON.stringify(this.beforeSend() || this.Data);

    t = $(".betstop").length;
    if (2 === OPEN_STATUS && 0 < t) {
        $.alert("已停押")
        return;
    }

    var bmr_r1 = confirm("确定要自动投？");
    if (bmr_r1 == true) {
        var bmr_r2 = confirm("即将开始自动投，按取消还可以退出！");
        if (bmr_r2 == false) {
            return;
        }
    } else {
        return;
    }

    // console.log(i)
    var bmr_jsonObj = JSON.parse(bmrData)[0];
    console.log(bmr_jsonObj)
    var subBets = bmr_jsonObj.SubBet;
    // console.log(this.UseLastOdds)
    // console.log(G.CurrentUserHandicap)
    var bmrCurType = $(".bet-t-l li.active a")[0].text


    //所有投注对象
    var allObj = [];

    if (bmrCurType == "复式") {
        console.log("进来复式");
        //用来分割前十个
        var sliceArr = [];
        //10个的组合字符串数组
        var strArray = [];
        //10个的组合详情
        var array5 = [];
        //多余的组合详情
        var array6 = [];
        //超过十个
        if (bmr_jsonObj.BetItems.length > 10) {
            // this.bmrBtnSubmit.val("正在提交中,点击取消");
            sliceArr = bmr_jsonObj.BetItems.slice(0, 10);
            strArray = combin(sliceArr, bmr_jsonObj.SubBet[0].BetItems.length).map(function (currentValue, index, arr) {
                return currentValue.toString()
            })

            for (let i = 0; i < subBets.length; i++) {
                if (strArray.includes(subBets[i].BetItems.toString())) {
                    array5.push(subBets[i]);
                } else {
                    array6.push(subBets[i]);
                }
            }
            // console.log(array5)
            // console.log(array6)

            //先落 10个的组合
            var bmrBetName = bmr_jsonObj.PlayTypeName + " ";
            for (var bmr1 = 0; bmr1 < sliceArr.length; bmr1++) {
                if (sliceArr[bmr1] < 10) {
                    bmrBetName += ("0" + sliceArr[bmr1] + ",")
                } else {
                    bmrBetName += (sliceArr[bmr1] + ",")
                }
            }
            var ttt = {
                BetName: bmrBetName.substring(0, bmrBetName.length - 1),
                BetTypeId: bmr_jsonObj.BetTypeId,
                BetItems: sliceArr,
                PlayTypeName: bmr_jsonObj.PlayTypeName,
                BetMoney: array5[0].BetMoney * array5.length,
                SubBet: array5
            }
            // console.log(ttt)
            allObj.push([ttt]);

            // console.log(JSON.stringify(ttt))
            // console.log("准备投注10组：" + ttt.BetItems);
            // e.postdata2(ttt)
        } else {
            alert("无超过10粒，不要用脚本投，请关闭脚本！！")
            return;
            // array6 = subBets;
        }

        //单独落 其余的组合
        for (var bmr1 = 0; bmr1 < array6.length; bmr1++) {
            // sleep(Math.round(Math.random() * 2000 + 3000))
            bmrBetName = bmr_jsonObj.PlayTypeName + " ";
            for (var bmr2 = 0; bmr2 < array6[bmr1].BetItems.length; bmr2++) {
                if (array6[bmr1].BetItems[bmr2] < 10) {
                    bmrBetName += ("0" + array6[bmr1].BetItems[bmr2] + ",")
                } else {
                    bmrBetName += (array6[bmr1].BetItems[bmr2] + ",")
                }
            }
            var ttt = {
                BetName: bmrBetName.substring(0, bmrBetName.length - 1),
                BetTypeId: bmr_jsonObj.BetTypeId,
                BetItems: array6[bmr1].BetItems,
                PlayTypeName: bmr_jsonObj.PlayTypeName,
                BetMoney: array6[0].BetMoney,
                SubBet: [array6[bmr1]]
            }
            // console.log(ttt)
            allObj.push([ttt]);
            // console.log(JSON.stringify(ttt))
            // console.log("准备投注：" + ttt.BetItems);
            // e.postdata2(ttt)
        }
    } else if (bmrCurType == "拖头") {
        console.log("进来拖头");

        //判断是几个头
        var bmrCurHeadNum = 0;
        if (bmr_jsonObj.PlayTypeName[0] == "二") {
            bmrCurHeadNum = 1;
        } else if (bmr_jsonObj.PlayTypeName[0] == "三") {
            bmrCurHeadNum = 2;
        }

        //用来记录当前头
        var curHead = subBets[0].BetItems.slice(0, bmrCurHeadNum).join(",");
        // var curHead = subBets[0].BetItems[0];
        //切割分组
        var splitGroup = [[]];
        //记录当前组索引
        var splitGroupIndex = 0;

        //进行分组，相同的头最多10个为一组，不相同的头另起一组。
        for (let i = 0; i < subBets.length; i++) {
            var subBetsHead = subBets[i].BetItems.slice(0, bmrCurHeadNum).join(",");
            if (splitGroup[splitGroupIndex].length == 10 || curHead != subBetsHead) {
                splitGroupIndex++;
                splitGroup[splitGroupIndex] = [];
            }
            if (curHead != subBetsHead) {
                curHead = subBetsHead;
            }
            splitGroup[splitGroupIndex].push(subBets[i]);
        }


        /*
                //用来记录第一个头
                var curHead = subBets[0].BetItems[0];
                //最多十个为一组
                var splitGroup = [[]];
                //记录当前组索引
                var splitGroupIndex = 0;

                for (let i = 0; i < subBets.length; i++) {
                    if (splitGroup[splitGroupIndex].length == 10 || curHead != subBets[i].BetItems[0]) {
                        splitGroupIndex++;
                        splitGroup[splitGroupIndex] = [];
                    }
                    if (curHead != subBets[i].BetItems[0]) {
                        curHead = subBets[i].BetItems[0];
                    }
                    splitGroup[splitGroupIndex].push(subBets[i]);
                }
        */

        // console.log(splitGroup);


        /*各个组合的详情*/
        for (let i = 0; i < splitGroup.length; i++) {
            var bmrBetName = "";
            var bmrBetItems = [];
            var headStr = "";
            for (let j = 0; j < splitGroup[i].length; j++) {
                var lastBetItem = splitGroup[i][j].BetItems[splitGroup[i][j].BetItems.length - 1];
                bmrBetItems.push(lastBetItem);
                if (lastBetItem < 10) {
                    bmrBetName += ("0" + lastBetItem + ",")
                } else {
                    bmrBetName += (lastBetItem + ",")
                }
            }

            // var curHead2 = splitGroup[i][0].BetItems[0];
            var curHead2 = splitGroup[i][0].BetItems.slice(0, bmrCurHeadNum);
            bmrBetItems = curHead2.concat(bmrBetItems);

            for (let k = 0; k < curHead2.length; k++) {
                if (curHead2[k] < 10) {
                    headStr += ("0" + curHead2[k] + ",")
                } else {
                    headStr += (curHead2[k] + ",")
                }
            }
            bmrBetName = (bmr_jsonObj.PlayTypeName + " " + headStr.substring(0, headStr.length - 1) + " [拖] " + bmrBetName);

            var ttt = {
                BetName: bmrBetName.substring(0, bmrBetName.length - 1),
                BetTypeId: bmr_jsonObj.BetTypeId,
                BetItems: bmrBetItems,
                PlayTypeName: bmr_jsonObj.PlayTypeName,
                BetMoney: splitGroup[i][0].BetMoney * splitGroup[i].length,
                SubBet: splitGroup[i]
            }
            // console.log(ttt)
            allObj.push([ttt]);
        }


        /*
                for (let i = 0; i < splitGroup.length; i++) {
                    var bmrBetName = bmr_jsonObj.PlayTypeName + " ";
                    var bmrBetItems = [splitGroup[i][0].BetItems[0]];
                    for (let j = 0; j < splitGroup[i][j].length; j++) {
                        if (splitGroup[i][j] < 10) {
                            bmrBetName += ("0" + splitGroup[i][j])
                        } else {
                            bmrBetName += (splitGroup[i][j])
                        }
                        if (j == 0) {
                            bmrBetName += " [拖] "
                        } else {
                            bmrBetName += ","
                            bmrBetItems.push(splitGroup[i][j])
                        }
                    }
                    var ttt = {
                        BetName: bmrBetName.substring(0, bmrBetName.length - 1),
                        BetTypeId: bmr_jsonObj.BetTypeId,
                        BetItems: bmrBetItems,
                        PlayTypeName: bmr_jsonObj.PlayTypeName,
                        BetMoney: splitGroup[i][0].BetMoney * splitGroup[i].length,
                        SubBet: splitGroup[i]
                    }
                    console.log(ttt)
                    allObj.push([ttt]);
                }
        */


    }


    console.log(allObj);


    appendStr(e.bmrTextArea, "------------开始自动投注------------");
    this.bmrBtnSubmit.val("正在提交中,点击取消");
    // console.log("------------开始自动投注------------")
    var counter = 0;
    var curIndex = 0;
    var interval
    var noneRes = "";
    var successRes = "";
    var failRes = "";
    var unknownRes = "";
    var myFunction = function () {
        clearInterval(interval);

        if (curIndex == allObj.length || !e.execBool) {
            if (curIndex == allObj.length) {
                appendStr(e.bmrTextArea, "------------全部投注结束------------");
                e.bmrBtnSubmit.prop("disabled", !0).val("自动投注完成");
            }
            if (noneRes != "") {
                appendStr(e.bmrTextArea, "投注没有结果的组合：\n" + noneRes);
            }
            if (successRes != "") {
                appendStr(e.bmrTextArea, "投注结果成功组合：\n" + successRes);
            }
            if (failRes != "") {
                appendStr(e.bmrTextArea, "投注结果失败组合：\n" + failRes);
            }
            if (unknownRes != "") {
                appendStr(e.bmrTextArea, "投注结果未知组合：\n" + unknownRes);
            }
            return;
        }
        appendStr(e.bmrTextArea, "开始投注：" + allObj[curIndex][0].BetItems + "");
        // console.log(bmrData);
        console.log(JSON.stringify(allObj[curIndex]));
        // console.log(JSON.stringify(allObj[1]));
        e.postdata2(JSON.stringify(allObj[curIndex]), function (parmRes) {
            var resStatus = parmRes;
            if (resStatus == null) {
                appendStr(e.bmrTextArea, "投注没结果。。。");
                noneRes += (allObj[curIndex][0].BetItems + "\n");
            } else if (resStatus == "1") {
                appendStr(e.bmrTextArea, "投注成功。。。");
                successRes += (allObj[curIndex][0].BetItems + "\n");
            } else if (resStatus == "0") {
                appendStr(e.bmrTextArea, "投注失败。。。");
                failRes += (allObj[curIndex][0].BetItems + "\n");
            } else {
                appendStr(e.bmrTextArea, "未知错误。。。");
                unknownRes += (allObj[curIndex][0].BetItems + "\n");
            }
            curIndex++;
            counter = Math.round(Math.random() * 2000 + 4000);
            appendStr(e.bmrTextArea, "下轮投注需要等待" + counter + "毫秒");
            interval = setInterval(myFunction, counter);
        });
    }
    interval = setInterval(myFunction, counter);


}, OrderConfirm.prototype.postdata2 = function (e, callback) {
    var i = this;
    var resStatus = null;
    /*  var resStatus = Math.round(Math.random());
      appendStr(i.bmrTextArea, "正在投注。。。")
      setTimeout(function () {
          callback(resStatus);
      }, 3000);*/

    G.post({
        url: "/Bet/MemberBet",
        data: {BetData: e, UseLastOdds: true, HandicapId: G.CurrentUserHandicap},
        success: function (t) {
            t = t.Data;
            resStatus = t.Status;
            if (0 == t.Status) {
                /*                G.util.close();
                                doc.triggerHandler("reset");
                                $.dialog({
                                    title: "下注信息",
                                    html: G.map.bet.html.success_bet,
                                    param: {BetList: e, Status: 0, Message: t.Message},
                                    cls: "dialog-confirm dialog-confirm1",
                                    closeBtn: !1,
                                    width: 400
                                });*/
            } else if (1 == t.Status) {//赢
                /*G.util.close();
                doc.triggerHandler("reset");
                doc.triggerHandler("update", [t]);
                doc.triggerHandler("close.left");
                $.dialog({
                    title: "下注信息",
                    html: G.map.bet.html.success_bet,
                    param: t,
                    cls: "dialog-confirm dialog-confirm1",
                    closeBtn: !1,
                    width: 400
                })*/
            } else {
                //这里可能是赔率已变化
                // i.UseLastOdds = !0;
                // i.doSubmit2();
            }
        },
        complete: function () {
            callback(resStatus);

            try {
                i.bmrBtnSubmit.prop("disabled", !1).val("自动投")
            } catch (t) {
            }
        }
    })
}, OrderConfirm.prototype.postdata = function (e) {
    /*   var i = this;
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
       })*/
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

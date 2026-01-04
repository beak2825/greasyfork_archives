"use strict";
// ==UserScript==
// @name         最新2023📆9月脚本 广东远程职业培训平台，已实现功能：✅自动续播✅自动续播✅自动切换科目✅后台播放✅自动静音✅已实现无人值守，下载及可用。
// @namespace    http://tampermonkey.net/
// @version      4.1.8
// @description  支持【广东远程职业培训平台】
// @author       845656
// @match        *://*.ggfw.hrss.gd.gov.cn/*
// @grant        GM_xmlhttpRequest
// @icon
// @connect      www.gaozhiwang.top
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473167/%E6%9C%80%E6%96%B02023%F0%9F%93%869%E6%9C%88%E8%84%9A%E6%9C%AC%20%E5%B9%BF%E4%B8%9C%E8%BF%9C%E7%A8%8B%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%EF%BC%8C%E5%B7%B2%E5%AE%9E%E7%8E%B0%E5%8A%9F%E8%83%BD%EF%BC%9A%E2%9C%85%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E2%9C%85%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E2%9C%85%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%A7%91%E7%9B%AE%E2%9C%85%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E2%9C%85%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%E2%9C%85%E5%B7%B2%E5%AE%9E%E7%8E%B0%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%EF%BC%8C%E4%B8%8B%E8%BD%BD%E5%8F%8A%E5%8F%AF%E7%94%A8%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/473167/%E6%9C%80%E6%96%B02023%F0%9F%93%869%E6%9C%88%E8%84%9A%E6%9C%AC%20%E5%B9%BF%E4%B8%9C%E8%BF%9C%E7%A8%8B%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0%EF%BC%8C%E5%B7%B2%E5%AE%9E%E7%8E%B0%E5%8A%9F%E8%83%BD%EF%BC%9A%E2%9C%85%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E2%9C%85%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%E2%9C%85%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E7%A7%91%E7%9B%AE%E2%9C%85%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%E2%9C%85%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%E2%9C%85%E5%B7%B2%E5%AE%9E%E7%8E%B0%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%EF%BC%8C%E4%B8%8B%E8%BD%BD%E5%8F%8A%E5%8F%AF%E7%94%A8%E3%80%82.meta.js
// ==/UserScript==
 
 
(function (e) {
    "use strict";
    var t = this && this[e[0]] || function (t, n, o, i) {
        return new (o = o || Promise)(function (a, l) {
            function s(t) {
                try {
                    c(i[e[1]](t))
                } catch (t) {
                    l(t)
                }
            }

            function d(t) {
                try {
                    c(i[e[2]](t))
                } catch (t) {
                    l(t)
                }
            }

            function c(t) {
                var n;
                t[e[3]] ? a(t[e[4]]) : ((n = t[e[4]]) instanceof o ? n : new o(function (e) {
                    e(n)
                }))[e[5]](s, d)
            }

            c((i = i[e[6]](t, n || []))[e[1]]())
        })
    };
    {
        let l = e[7], s = {}, d = {ggfw: {id: 14, name: e[8]}}, c = [1, 3, 5, 10, 16],
            r = {accelerator: 1, CtxMain: null, SchoolType: -1};

        class p extends class {
            constructor() {
                this[e[9]] = 1, this[e[10]] = 0, this[e[11]] = null, this[e[12]]()
            }

            init() {
                setTimeout(() => {
                    localStorage[e[13]](e[14]) || this[e[15]]()
                }, 2500)
            }

            updateSpeedElement(t) {
                0 != this[e[10]] && (s[e[17]][e[16]] = t)
            }

            handleClickSpeedUp(n) {
                return t(this, void 0, void 0, function* () {
                    var t = localStorage[e[13]](e[18]);
                    t ? (this[e[10]] = 1, 200 != (t = yield i({
                        method: e[19],
                        url: l + (`/speedup?toolkey=${t}&canuse=` + r[e[20]])
                    }))[e[21]] ? a("🔉🔉🔉" + t[e[24]], 5e3, !0) : (this[e[10]] = 1, r[e[23]][e[22]](), this[e[25]]())) : (alert(e[26]), window[e[27]](e[28]))
                })
            }

            handleAddKey(n) {
                return t(this, void 0, void 0, function* () {
                    s[e[30]][e[4]] ? 0 < (yield i({
                        method: e[19],
                        url: l + e[31] + s[e[30]][e[4]]
                    }))[e[33]][e[32]] ? (localStorage[e[34]](e[18], s[e[30]][e[4]]), localStorage[e[34]](e[35], r[e[37]][e[36]]()), n(s[e[30]][e[4]])) : alert(e[38]) : window[e[27]](e[28])
                })
            }

            handleRemoveKey() {
                localStorage[e[39]](e[18]), localStorage[e[39]](e[35]), s[e[41]][e[40]] = e[42], s[e[45]][e[44]][e[43]] = e[46], s[e[47]][e[44]][e[43]] = e[46], s[e[48]][e[44]][e[43]] = e[46], s[e[49]][e[44]][e[43]] = e[50], s[e[30]][e[44]][e[43]] = e[50], s[e[51]][e[44]][e[43]] = e[50], s[e[52]][e[44]][e[43]] = e[46], s[e[54]][e[44]][e[53]] = e[55], s[e[54]][e[40]] = e[56], this[e[57]](1)
            }

            stopSpeedUp() {
                this[e[10]] = 0, r[e[23]][e[57]](1), s[e[54]][e[44]][e[53]] = e[55], s[e[54]][e[40]] = e[58], a("🔉停止加速成功")
            }

            handleChangeCtxSpeed(t) {
                var n, o = localStorage[e[13]](e[18]);
                o ? (o = c, n = Number(t), t && o[e[59]](n) && (r[e[37]] = n, localStorage[e[34]](e[35], n[e[36]]()), s[e[17]]) && (s[e[17]][e[16]] = n)) : (alert(e[60]), window[e[27]](e[28]))
            }

            colletionSchoolData() {
                return t(this, void 0, void 0, function* () {
                    var t = "s" + r[e[20]];
                    200 == (yield i({
                        method: e[19],
                        url: l + e[62] + t
                    }))[e[21]] && localStorage[e[34]](e[14], "" + new Date)
                })
            }

            vertifySystem() {
            }

            listenVidoeStatus(t, n) {
                if (t) {
                    let o = 0;
                    this[e[11]] = setInterval(() => {
                        t[e[63]] < 4 && (console[e[64]](`检测到${o}次，视频正在加载`), 20 <= (o += 1)) && location[e[65]](), t[e[66]] && (o += 1, console[e[64]](`检测到视频暂停了${o}次`), typeof n == e[67] ? 20 <= o ? location[e[65]]() : n() : console[e[64]](e[68]))
                    }, 3e3)
                }
            }
        } {
            constructor() {
                super(), this[e[69]] = 0, this[e[70]] = 0, this[e[71]]()
            }

            _init() {
                s[e[72]] = document[e[73]](e[74]), s[e[72]][e[75]] && this[e[76]](), new Promise(t => {
                    let n = setInterval(() => {
                        s[e[77]] = document[e[73]](e[78]), s[e[77]][e[75]] && (clearInterval(n), this[e[79]](), t(!0))
                    }, 1e3)
                })[e[5]](n => {
                    s[e[54]][e[44]][e[43]] = e[46];
                    let i = setInterval(() => t(this, void 0, void 0, function* () {
                        s[e[17]] = document[e[80]](e[81]), s[e[17]][e[82]](e[83], e[83]), s[e[17]][e[82]](e[84], e[84]);
                        var t = document[e[80]](e[85]);
                        t[e[86]](), yield o(500), t[e[86]](), s[e[17]] && (clearInterval(i), a(e[87], 3e3), yield o(300), t = document[e[80]](e[88]), console[e[64]](e[89], t), t[e[86]](), yield this[e[90]]())
                    }), 1e3)
                })
            }

            getCurrentIndex() {
                let t = e[91];
                s[e[77]][e[92]]((n, o) => {
                    n[e[94]][e[93]](t) && (this[e[70]] = o)
                })
            }

            play() {
                return t(this, void 0, void 0, function* () {
                    yield o(3e3), localStorage[e[34]](e[95], e[96]), s[e[17]][e[22]](), setTimeout(() => {
                        s[e[17]][e[16]] = r[e[37]], s[e[54]][e[44]][e[53]] = e[97], s[e[54]][e[40]] = e[98]
                    }, 1500), this[e[99]](s[e[17]], () => {
                        s[e[17]][e[100]] = 0, s[e[17]][e[22]]()
                    }), s[e[17]][e[101]](e[102], () => t(this, void 0, void 0, function* () {
                        clearInterval(this[e[103]]), s[e[77]] = document[e[73]](e[78]), yield o(300), this[e[70]] >= s[e[77]][e[75]] - 1 ? (localStorage[e[34]](e[95], e[3]), document[e[80]](e[104])[e[86]](), yield o(1500), document[e[73]](e[105])[3][e[86]](), yield o(2e3), window[e[106]][e[65]]()) : (this[e[70]] += 1, this[e[90]](), yield o(2500), s[e[77]][this[e[70]]][e[86]]())
                    })), s[e[17]][e[101]](e[107], () => {
                        console[e[64]](e[108]), setTimeout(() => {
                            s[e[17]][e[22]]()
                        }, 1e3)
                    })
                })
            }

            selectOneClass() {
                let n = setTimeout(() => t(this, void 0, void 0, function* () {
                    clearInterval(n), document[e[80]](e[109])[e[86]](), yield o(2500), s[e[72]] = document[e[73]](e[110]), yield o(200), s[e[72]][0][e[86]]()
                }), 3e3)
            }
        }

        class u {
            constructor() {
                this[e[111]] = document[e[112]](e[113]), this[e[114]] = document[e[112]](e[44]), this[e[71]]()
            }

            _init() {
                this[e[111]][e[115]] = '\n<div class="myTool">\n    <div class="nokey">\n        <div class="title1" style="font-weight: bold;text-align: center;"><a style="color: black;" href="http://www.gaozhiwang.top" target="_blank">📺高智Ai自动学习程序</a></div>\n        <div class="btns">\n            <div class="btn1"\n                 style="text-align: center;color: #1776FDFF;text-decoration: underline;margin: 5px 0;cursor: pointer;">\n                <a href="http://www.gaozhiwang.top" target="_blank">点击获取Key</a>\n            </div>\n            <a href="http://www.gaozhiwang.top" id="slogan" target="_blank" style="text-decoration: none;">\n     \n            </a>\n        </div>\n    </div>\n\n    <div class="haskey" style="display: none;">\n        <div class=\'\'><a style="color: black;" href="http://www.gaozhiwang.top" target="_blank">📺高智Ai自动学习程序</a></div>\n    </div>\n\n\n    <div class="cxtsection ctxsection1">\n      <div class="ctx-title title3">\n        输入Key：\n      </div>\n      <div class="ipt-wrap" style="display: flex;align-items: center;justify-content: space-between;">\n        <input class="mytoolkeyipt" />\n        <div style="width: 120px;height: 18px;margin-right: 5px;display: none;" class="mytoolkey"></div>\n        <button class="handleKeyBtn addkey-btn" id="addKey">绑定</button>\n        <button class="handleKeyBtn removkey-btn" id="removeKey">解绑</button>\n      </div>\n    </div>\n    \n    <div class="cxtsection ctxsection2">\n      <div class="ctx-title">\n        设置倍速：\n      </div>\n      <select name="" id="ctxspeed" class="speed-select">\n        <option value="1" class="option">\n          × 1.0\n        </option>\n        <option value="5" class="option">\n          × 5.00\n        </option>\n        <option value="10" class="option" selected="selected">\n          × 10.00\n        </option>\n        <option value="16" class="option">\n          × 16.00\n        </option>\n      </select>\n    </div>\n    \n    <div class="cxtsection ctxsection3">\n      <div class="ctx-title">\n        意见反馈：\n      </div>\n      <a href="http://www.gaozhiwang.top"><div class="feedbackBtn">去反馈</div></a>\n    </div>\n    \n    <div class="scriptTip" style="display: none;border-radius: 4px;margin-top: 9px;font-size: 12px;background: rgba(108,201,255,0.5);box-sizing: border-box;padding: 5px;">\n        <div class="title">提示：</div>\n        <p style="margin: 6px 0;">1.兴趣课全网目前仅支持最高1.5倍速</p>\n    </div>\n    \n    <div class="handleSpeedUp">点击加速</div>\n    \n    <div id="ctxTipWrap" class="ctxTipWrap"></div>\n</div>\n    ', this[e[114]][e[115]] = "\n        .myTool{\n            background: #fff;\n            width: 234px;\n            font-size: 14px;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            position: fixed;\n            z-index: 999;\n            top: 70px;\n            left: 44px;\n            box-sizing: border-box;\n            padding: 15px 9px;\n            border-radius: 5px;\n            box-shadow: 0 0 9px rgba(0,0,0,.5);\n        }\n        \n        .mytoolkeyipt{\n            width: 130px;\n            height: 22px !important;\n            outline: none;\n            padding: 0px 3px;\n            border: 1px solid #757575FF;\n            border-radius: 3px;\n            font-size: 13px;\n            padding: 0px 3px;\n            margin-right: 5px;\n            margin-top: 2px;\n        }\n        .addkey-btn{\n            color: #fff;\n            background: #1f74ca;\n        }\n        .removkey-btn{\n            color: #000;\n            display: none;\n            background: #eee;\n        }\n        .handleKeyBtn{\n            width: 54px;\n            height: 24px;\n            margin-top: 2px;\n            border: none;\n            font-size: 12px;\n            border-radius: 2px;\n            cursor: pointer;\n        }\n        \n        .handleSpeedUp{\n            background: orange;\n            font-size: 12px;\n            color: #fff;\n            padding: 4px 15px;\n            border-radius: 5px;\n            margin-top: 10px;\n            cursor: pointer;\n        }\n        .ctxTipWrap{\n            min-width: 200px;\n            min-height: 50px;\n            text-align: center;\n            line-height: 50px;\n            background: #fff;\n            position: fixed;\n            z-index: 999;\n            left: 50%;\n            top: 50%;\n            border-radius: 9px;\n            box-shadow: 0 0 5px rgba(0,0,0,.6);\n            display:none;\n        }\n        .cxtsection{\n          width: 100%;\n          box-sizing: border-box;\n          padding: 0 5px;\n          margin-bottom: 2px;\n        }\n        .cxtsection .ctx-title{\n          text-align: left;\n          margin-top: 12px;\n          font-size: 12px;\n          color: #4e5969;\n          border-left: 2px solid #1f74ca;\n          border-radius: 2px;\n          padding-left: 3px;\n          line-height: 16px;\n        }\n        .ctxsection2{\n          display: flex;\n          justify-content: space-between;\n        }\n        .ctxsection2 .speed-select{\n          width: 50%;\n          height: 22px !important;\n          outline: none;\n          position: relative;\n          top: 10px;\n          border: 1px solid #757575FF;\n          border-radius: 3px;\n          padding-left: 10px;\n        }\n        .ctxsection3{\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n        .feedbackBtn{\n            font-size: 13px;\n            position: relative;\n            top: 5px;\n            cursor: pointer;\n            color: #000;\n        }\n        a{\n            text-decoration: none;\n        }\n    ", null != (t = document[e[80]](e[116])) && t[e[117]](this[e[114]]), 3 == r[e[20]] ? null != (t = document[e[80]](e[118])) && t[e[117]](this[e[111]]) : 7 == r[e[20]] ? null != (t = document[e[80]](e[119])) && t[e[117]](this[e[111]]) : 11 == r[e[20]] ? null != (t = document[e[80]](e[120])) && t[e[117]](this[e[111]]) : 18 == r[e[20]] ? null != (t = document[e[80]](e[121])) && t[e[117]](this[e[111]]) : null != (t = document[e[80]](e[122])) && t[e[117]](this[e[111]]), s[e[41]] = document[e[80]](e[123]), s[e[45]] = document[e[80]](e[124]), s[e[47]] = document[e[80]](e[125]), s[e[49]] = document[e[80]](e[126]), s[e[51]] = document[e[127]](e[128]), s[e[52]] = document[e[127]](e[129]), s[e[30]] = document[e[80]](e[130]), s[e[54]] = document[e[80]](e[131]), s[e[132]] = document[e[80]](e[133]), s[e[134]] = document[e[80]](e[135]), s[e[48]] = document[e[80]](e[136]);
                var t = localStorage[e[13]](e[18]);
                t && this[e[137]](t), this[e[138]](), this[e[139]](), this[e[140]](), this[e[141]]()
            }

            optimizePannel() {
                -1 != [14, 24][e[142]](r[e[20]]) && (r[e[37]] = 1, c = [1]), 2 == r[e[20]] && (n(e[144])[e[44]][e[143]] = e[145], n(e[144])[e[44]][e[146]] = e[147], n(e[149])[e[44]][e[148]] = e[150], s[e[30]][e[44]][e[151]] = e[152]), 9 == r[e[20]] && (n(e[154])[e[44]][e[153]] = e[155]), 13 != r[e[20]] && 7 != r[e[20]] || (c = [1, 3], r[e[37]] = 3), 17 == r[e[20]] && (r[e[37]] = 1, c = [1, 10]), 18 == r[e[20]] && (n(e[157])[e[44]][e[156]] = e[158], n(e[157])[e[44]][e[159]] = e[160], n(e[157])[e[44]][e[161]] = e[160], n(e[163])[e[44]][e[162]] = e[164], n(e[163])[e[44]][e[143]] = e[165]), 19 == r[e[20]] && (r[e[37]] = 1, c = [1], n(e[144])[e[44]][e[156]] = e[166]), 22 == r[e[20]] && (r[e[37]] = 3, c = [1, 3]), 23 == r[e[20]] && (n(e[144])[e[44]][e[167]] = e[168], r[e[37]] = 1, c = [1]), 25 == r[e[20]] && (r[e[37]] = 2, c = [1, 2]), 26 == r[e[20]] && (n(e[144])[e[44]][e[156]] = e[166])
            }

            setSpeedOption() {
                s[e[169]] = document[e[80]](e[170]);
                let t = "";
                for (var n = 0; n < c[e[75]]; n++) {
                    t += `\n                <option value="${c[n]}" class="option">\n                  × ${c[n]}.0\n                </option>\n                `
                }
                s[e[169]][e[115]] = t;
                var o = localStorage[e[13]](e[35]);
                o && (s[e[169]][e[4]] = o, r[e[37]] = Number(o))
            }

            handleSetHtml(t) {
                try {
                    s[e[30]][e[44]][e[43]] = e[46], s[e[41]][e[40]] = e[171], s[e[45]][e[40]] = t, s[e[45]][e[44]][e[43]] = e[50], s[e[47]][e[44]][e[43]] = e[50], s[e[49]][e[44]][e[43]] = e[46], s[e[52]][e[44]][e[43]] = e[50], s[e[51]][e[44]][e[43]] = e[46], s[e[172]] = t
                } catch (t) {
                }
            }

            addEvent() {
                s[e[51]][e[101]](e[86], () => {
                    r[e[23]][e[173]](t => {
                        this[e[137]](t)
                    })
                }), s[e[52]][e[101]](e[86], () => {
                    r[e[23]][e[174]]()
                }), s[e[54]][e[101]](e[86], () => {
                    r[e[23]][e[90]]()
                }), s[e[48]][e[101]](e[175], t => {
                    r[e[23]][e[176]](t[e[177]][e[4]])
                })
            }

            getSlogan() {
                i({url: l + e[178], method: e[19]})[e[5]](t => {
                    s[e[179]] = document[e[80]](e[163]), s[e[179]][e[115]] = t[e[181]][e[180]]
                })
            }
        }

        function n(t, n = window[e[182]]) {
            return null === (n = n[e[80]](t)) ? void 0 : n
        }

        function o(e) {
            return new Promise(t => setTimeout(t, e))
        }

        function i(t) {
            return new Promise(n => {
                try {
                    GM_xmlhttpRequest(Object[e[183]](Object[e[183]]({}, t), {
                        onload: function (t) {
                            200 == t[e[184]] && n(JSON[e[185]](t[e[186]]))
                        }
                    }))
                } catch (o) {
                    fetch(t[e[187]], {method: t[e[188]]})[e[5]](t => t[e[189]]())[e[5]](e => {
                        n(e)
                    })
                }
            })
        }

        function a(t, n = 1500, o) {
            s[e[134]][e[44]][e[43]] = e[50], s[e[134]][e[40]] = t, setTimeout(() => {
                s[e[134]][e[44]][e[43]] = e[46]
            }, n), o && alert(t)
        }

        setTimeout(() => {
            var t;
            if (t = location[e[190]], /www.gaozhiwang.top/[e[191]](t) || (r[e[23]] = p, r[e[20]] = d[e[193]][e[192]]), 1 == r[e[20]]) try {
                {
                    const t = null == (o = n(e[194])) ? void 0 : o[e[195]];
                    var o = () => {
                    };
                    t[e[196]] = o, t[e[197]] = o, t[e[198]] = o;
                    const i = t[e[199]];
                    t[e[199]] = function (...n) {
                        var o = new PointerEvent(e[86]), a = Object[e[200]]({isTrusted: !0});
                        return Object[e[201]](a, o), n[n[e[75]] - 1] = a, i[e[6]](t, n)
                    }, t[e[199]] = function (...n) {
                        return n[n[e[75]] - 1] = {isTrusted: !0}, i[e[6]](t, n)
                    }
                }
            } catch (t) {
            }
            r[e[23]] = new r[e[23]], new u
        }, 5e3)
    }
}).call(this, ["__awaiter", "next", "throw", "done", "value", "then", "apply", "http://www.gaozhiwang.top:7001", "广东远程职业培训平台", "studentType", "speedStatus", "listenVidoeStatusTimer", "init", "getItem", "schoolInfoColletion", "colletionSchoolData", "playbackRate", "$video", "mytoolkey", "GET", "SchoolType", "code", "play", "CtxMain", "message", "vertifySystem", "请先购买key", "open", "http://www.gaozhiwang.top", "程序错误，请联系客服", "$ipt", "/vertifykey?toolkey=", "count", "data", "setItem", "_localSpeed", "toString", "accelerator", "输入的key不存在", "removeItem", "innerText", "$title3", "绑定key：", "display", "style", "$mytoolkey", "none", "$haskey", "$ctxsection2", "$nokey", "block", "$addKey", "$removeKey", "background", "$handleSpeedUp", "orange", "点击加速", "updateSpeedElement", "点击加速", "includes", "请先购买key", "程序错误，请联系客服", "/colletionschool?schoolType=", "readyState", "log", "reload", "paused", "function", "callback不是一个函数", "taskLength", "currentIndex", "_init", "$parentNodes", "querySelectorAll", ".learnList", "length", "selectOneClass", "$allTask", ".courseItem", "getCurrentIndex", "querySelector", "video", "setAttribute", "muted", "autoplay", ".volume-icon", "click", "🔉初始化完成，即将自动播放", ".prism-big-play-btn", "$playBtn===>>>", "handleClickSpeedUp", "active", "forEach", "contains", "classList", "ctx-status", "", "#f01414", "加速成功", "listenVidoeStatus", "volume", "addEventListener", "ended", "timer", ".sc-box", ".menu-box ul li", "location", "pause", "播放暂停了", "#tab-second", ".course_item", "$panelWrap", "createElement", "div", "$panelStyle", "innerHTML", "head", "appendChild", "#bigContainer", ".layout-content", ".task-dashboard-page", ".screen_wide_1", "body", ".title3", ".mytoolkey", ".haskey", ".nokey", "getElementById", "addKey", "removeKey", ".mytoolkeyipt", ".handleSpeedUp", "$playButton", "#playButton", "$ctxTipWrap", "#ctxTipWrap", ".ctxsection2", "handleSetHtml", "optimizePannel", "setSpeedOption", "addEvent", "getSlogan", "indexOf", "left", ".myTool", "unset", "right", "44px", "marginTop", ".ipt-wrap", "3px", "padding", "11px 3px", "lineHeight", ".handleKeyBtn", "16px", "width", ".btn1", "74%", "paddingTop", "0", "paddingBottom", "position", "#slogan", "relative", "-40px", "202px", "top", "176px", "$speedSelect", "#ctxspeed", "当前key：", "userKey", "handleAddKey", "handleRemoveKey", "change", "handleChangeCtxSpeed", "target", "/getslogan", "$slogan", "text1", "result", "document", "assign", "status", "parse", "response", "url", "method", "json", "host", "test", "id", "ggfw", ".video-study", "__vue__", "checkout", "notTrustScript", "checkoutNotTrustScript", "videoClick", "create", "setPrototypeOf"]);
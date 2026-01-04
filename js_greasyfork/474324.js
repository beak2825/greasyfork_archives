// ==UserScript== 
// @name         兰州资源环境职业技术大学视频播放脚本。支持课程切换，自动静音，后台播放，自动连播，已实现无人值守。
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  兰州资源环境职业技术大学视频播放脚本
// @author       SGASFA 
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @icon         https://www.zhihuishu.com/favicon.ico
// @connect      www.gaozhiwang.top
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474324/%E5%85%B0%E5%B7%9E%E8%B5%84%E6%BA%90%E7%8E%AF%E5%A2%83%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%E3%80%82%E6%94%AF%E6%8C%81%E8%AF%BE%E7%A8%8B%E5%88%87%E6%8D%A2%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%EF%BC%8C%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%8C%E5%B7%B2%E5%AE%9E%E7%8E%B0%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/474324/%E5%85%B0%E5%B7%9E%E8%B5%84%E6%BA%90%E7%8E%AF%E5%A2%83%E8%81%8C%E4%B8%9A%E6%8A%80%E6%9C%AF%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%E3%80%82%E6%94%AF%E6%8C%81%E8%AF%BE%E7%A8%8B%E5%88%87%E6%8D%A2%EF%BC%8C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%EF%BC%8C%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%8C%E5%B7%B2%E5%AE%9E%E7%8E%B0%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E3%80%82.meta.js
// ==/UserScript==

(function (e) {
    "use strict";
    var n = this && this[e[0]] || function (n, t, o, i) {
        return new (o = o || Promise)(function (a, l) {
            function s(n) {
                try {
                    r(i[e[1]](n))
                } catch (n) {
                    l(n)
                }
            }

            function d(n) {
                try {
                    r(i[e[2]](n))
                } catch (n) {
                    l(n)
                }
            }

            function r(n) {
                var t;
                n[e[3]] ? a(n[e[4]]) : ((t = n[e[4]]) instanceof o ? t : new o(function (e) {
                    e(t)
                }))[e[5]](s, d)
            }

            r((i = i[e[6]](n, t || []))[e[1]]())
        })
    };
    {
        let l = e[7], s = {}, d = {lzrejxjy: {id: 29, name: e[8]}}, r = [1, 3, 5, 10, 16],
            c = {accelerator: 1, CtxMain: null, SchoolType: -1};

        class p extends class {
            constructor() {
                this[e[9]] = 1, this[e[10]] = 0, this[e[11]] = null, this[e[12]]()
            }

            init() {
                setTimeout(() => {
                    localStorage[e[13]](e[14]) || this[e[15]]()
                }, 2500)
            }

            updateSpeedElement(n) {
                0 != this[e[10]] && (s[e[17]][e[16]] = n)
            }

            handleClickSpeedUp(t) {
                return n(this, void 0, void 0, function* () {
                    var n = localStorage[e[13]](e[18]);
                    n ? (this[e[10]] = 1, 200 != (n = yield i({
                        method: e[19],
                        url: l + (`/speedup?toolkey=${n}&canuse=` + c[e[20]])
                    }))[e[21]] ? a("🔉🔉🔉" + n[e[24]], 5e3, !0) : (this[e[10]] = 1, c[e[23]][e[22]](), this[e[25]]())) : (alert(e[26]), window[e[27]](e[28]))
                })
            }

            handleAddKey(t) {
                return n(this, void 0, void 0, function* () {
                    s[e[30]][e[4]] ? 0 < (yield i({
                        method: e[19],
                        url: l + e[31] + s[e[30]][e[4]]
                    }))[e[33]][e[32]] ? (localStorage[e[34]](e[18], s[e[30]][e[4]]), localStorage[e[34]](e[35], c[e[37]][e[36]]()), t(s[e[30]][e[4]])) : alert(e[38]) : window[e[27]](e[28])
                })
            }

            handleRemoveKey() {
                localStorage[e[39]](e[18]), localStorage[e[39]](e[35]), s[e[41]][e[40]] = e[42], s[e[45]][e[44]][e[43]] = e[46], s[e[47]][e[44]][e[43]] = e[46], s[e[48]][e[44]][e[43]] = e[46], s[e[49]][e[44]][e[43]] = e[50], s[e[30]][e[44]][e[43]] = e[50], s[e[51]][e[44]][e[43]] = e[50], s[e[52]][e[44]][e[43]] = e[46], s[e[54]][e[44]][e[53]] = e[55], s[e[54]][e[40]] = e[56], this[e[57]](1)
            }

            stopSpeedUp() {
                this[e[10]] = 0, c[e[23]][e[57]](1), s[e[54]][e[44]][e[53]] = e[55], s[e[54]][e[40]] = e[58], a("🔉停止加速成功")
            }

            handleChangeCtxSpeed(n) {
                var t, o = localStorage[e[13]](e[18]);
                o ? (o = r, t = Number(n), n && o[e[59]](t) && (c[e[37]] = t, localStorage[e[34]](e[35], t[e[36]]()), s[e[17]]) && (s[e[17]][e[16]] = t)) : (alert(e[60]), window[e[27]](e[28]))
            }

            colletionSchoolData() {
                return n(this, void 0, void 0, function* () {
                    var n = "s" + c[e[20]];
                    200 == (yield i({
                        method: e[19],
                        url: l + e[62] + n
                    }))[e[21]] && localStorage[e[34]](e[14], "" + new Date)
                })
            }

            vertifySystem() {
            }

            listenVidoeStatus(n, t) {
                let o = 0;
                this[e[11]] = setInterval(() => {
                    var i;
                    n && (i = n[e[63]], console[e[64]](e[65], i), i) && (o += 1, console[e[64]](`检测到视频暂停了${o}次`), typeof t == e[66] ? 20 <= o ? location[e[67]]() : t() : console[e[64]](e[68]))
                }, 3e3)
            }
        } {
            constructor() {
                super(), this[e[69]] = 0, this[e[70]] = -1, this[e[71]]()
            }

            _init() {
                return n(this, void 0, void 0, function* () {
                    let t = setInterval(() => n(this, void 0, void 0, function* () {
                        console[e[64]](e[72]);
                        try {
                            var n = document[e[73]](e[74])[1];
                            console[e[64]](!!n), n ? (clearInterval(t), GM_setValue(e[75], location[e[76]]), null != n && n[e[77]](), a(e[78]), yield o(2e3), s[e[79]] = document[e[73]](e[80]), this[e[81]]()) : document[e[73]](e[82])[e[83]] && (clearInterval(t), this[e[84]]())
                        } catch (n) {
                        }
                    }), 1e3)
                })
            }

            getCurrentIndex() {
                var t;
                return n(this, void 0, void 0, function* () {
                    for (var n = ((n = document[e[73]](e[82])[1])[e[86]][e[85]](e[87]) || n[e[88]](e[89])[e[77]](), yield o(3e3), document[e[88]](e[90])), i = (s[e[91]] = n[e[93]][e[92]], s[e[94]] = s[e[91]][e[73]](e[95]), a(e[96]), s[e[54]][e[44]][e[43]] = e[46], e[97]), l = 0; l <= s[e[94]][e[83]] - 1; l++) if (!s[e[94]][l][e[88]](e[98])[e[86]][e[85]](i)) {
                        this[e[70]] = l;
                        break
                    }
                    -1 == this[e[70]] ? (n = GM_getValue(e[75], null), console[e[64]](e[99], n), GM_openInTab(n, {active: !0}), setTimeout(() => {
                        window[e[100]]()
                    }, 1500)) : (null != (t = s[e[94]][this[e[70]]]) && t[e[77]](), a(e[101]), this[e[102]]())
                })
            }

            findParentIndex() {
                return n(this, void 0, void 0, function* () {
                    let n;
                    s[e[79]][e[103]]((t, o) => {
                        var i = t[e[88]](e[104])[e[40]];
                        parseInt(i) <= 98 && -1 == this[e[70]] && (this[e[70]] = o, n = t[e[88]](e[105]))
                    }), -1 == this[e[70]] ? alert(e[106]) : (n[e[77]](), setTimeout(() => {
                        window[e[100]]()
                    }, 1500))
                })
            }

            getVideoDom() {
                return new Promise(n => {
                    let t = setInterval(() => {
                        var o = s[e[91]][e[88]](e[107])[e[93]][e[92]];
                        s[e[17]] = o[e[88]](e[108]), s[e[17]] && (clearInterval(t), n(!0))
                    }, 1e3)
                })
            }

            play() {
                return n(this, void 0, void 0, function* () {
                    clearInterval(this[e[11]]), yield this[e[109]](), s[e[17]][e[110]] = 0, s[e[17]][e[111]](e[112], e[112]), yield o(200), s[e[17]][e[22]](), s[e[17]][e[16]] = c[e[37]], this[e[113]](s[e[17]], () => {
                        s[e[17]][e[110]] = 0, s[e[17]][e[22]]()
                    }), s[e[17]][e[114]](e[115], () => n(this, void 0, void 0, function* () {
                        var n;
                        this[e[70]] >= s[e[94]][e[83]] - 1 ? (n = GM_getValue(e[75], null), console[e[64]](e[99], n), GM_openInTab(n, {active: !0}), setTimeout(() => {
                            window[e[100]]()
                        }, 1500)) : (this[e[70]] += 1, s[e[94]][this[e[70]]][e[77]](), a(e[116]), setTimeout(() => {
                            this[e[102]]()
                        }, 5e3))
                    })), s[e[17]][e[114]](e[117], () => {
                        s[e[17]][e[110]] = 0, s[e[17]][e[22]]()
                    })
                })
            }

            updateSpeedElement(n) {
                localStorage[e[34]](e[35], n[e[36]]()), s[e[17]][e[16]] = n
            }
        }

        p[e[118]] = 26;

        class u {
            constructor() {
                this[e[119]] = document[e[120]](e[121]), this[e[122]] = document[e[120]](e[44]), this[e[71]]()
            }

            _init() {
                this[e[119]][e[123]] = '\n<div class="myTool">\n    <div class="nokey">\n        <div class="title1" style="font-weight: bold;text-align: center;"><a style="color: black;" href="http://www.gaozhiwang.top" target="_blank">📺高智Ai自动学习程序</a></div>\n        <div class="btns">\n            <div class="btn1"\n                 style="text-align: center;color: #1776FDFF;text-decoration: underline;margin: 5px 0;cursor: pointer;">\n                <a href="http://www.gaozhiwang.top" target="_blank">点击获取Key</a>\n            </div>\n            <a href="http://www.gaozhiwang.top" id="slogan" target="_blank" style="text-decoration: none;">\n     \n            </a>\n        </div>\n    </div>\n\n    <div class="haskey" style="display: none;">\n        <div class=\'\'><a style="color: black;" href="http://www.gaozhiwang.top" target="_blank">📺高智Ai自动学习程序</a></div>\n    </div>\n\n\n    <div class="cxtsection ctxsection1">\n      <div class="ctx-title title3">\n        输入Key：\n      </div>\n      <div class="ipt-wrap" style="display: flex;align-items: center;justify-content: space-between;">\n        <input class="mytoolkeyipt" />\n        <div style="width: 120px;height: 18px;margin-right: 5px;display: none;" class="mytoolkey"></div>\n        <button class="handleKeyBtn addkey-btn" id="addKey">绑定</button>\n        <button class="handleKeyBtn removkey-btn" id="removeKey">解绑</button>\n      </div>\n    </div>\n    \n    <div class="cxtsection ctxsection2">\n      <div class="ctx-title">\n        设置倍速：\n      </div>\n      <select name="" id="ctxspeed" class="speed-select">\n        <option value="1" class="option">\n          × 1.0\n        </option>\n        <option value="5" class="option">\n          × 5.00\n        </option>\n        <option value="10" class="option" selected="selected">\n          × 10.00\n        </option>\n        <option value="16" class="option">\n          × 16.00\n        </option>\n      </select>\n    </div>\n    \n    <div class="cxtsection ctxsection3">\n      <div class="ctx-title">\n        意见反馈：\n      </div>\n      <a href="http://www.gaozhiwang.top"><div class="feedbackBtn">去反馈</div></a>\n    </div>\n    \n    <div class="scriptTip" style="display: none;border-radius: 4px;margin-top: 9px;font-size: 12px;background: rgba(108,201,255,0.5);box-sizing: border-box;padding: 5px;">\n        <div class="title">提示：</div>\n        <p style="margin: 6px 0;">1.兴趣课全网目前仅支持最高1.5倍速</p>\n    </div>\n    \n    <div class="handleSpeedUp">点击加速</div>\n    \n    <div id="ctxTipWrap" class="ctxTipWrap"></div>\n</div>\n    ', this[e[122]][e[123]] = "\n        .myTool{\n            background: #fff;\n            width: 234px;\n            font-size: 14px;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            position: fixed;\n            z-index: 999;\n            top: 70px;\n            left: 44px;\n            box-sizing: border-box;\n            padding: 15px 9px;\n            border-radius: 5px;\n            box-shadow: 0 0 9px rgba(0,0,0,.5);\n        }\n        \n        .mytoolkeyipt{\n            width: 130px;\n            height: 22px !important;\n            outline: none;\n            padding: 0px 3px;\n            border: 1px solid #757575FF;\n            border-radius: 3px;\n            font-size: 13px;\n            padding: 0px 3px;\n            margin-right: 5px;\n            margin-top: 2px;\n        }\n        .addkey-btn{\n            color: #fff;\n            background: #1f74ca;\n        }\n        .removkey-btn{\n            color: #000;\n            display: none;\n            background: #eee;\n        }\n        .handleKeyBtn{\n            width: 54px;\n            height: 24px;\n            margin-top: 2px;\n            border: none;\n            font-size: 12px;\n            border-radius: 2px;\n            cursor: pointer;\n        }\n        \n        .handleSpeedUp{\n            background: orange;\n            font-size: 12px;\n            color: #fff;\n            padding: 4px 15px;\n            border-radius: 5px;\n            margin-top: 10px;\n            cursor: pointer;\n        }\n        .ctxTipWrap{\n            min-width: 200px;\n            min-height: 50px;\n            text-align: center;\n            line-height: 50px;\n            background: #fff;\n            position: fixed;\n            z-index: 999;\n            left: 50%;\n            top: 50%;\n            border-radius: 9px;\n            box-shadow: 0 0 5px rgba(0,0,0,.6);\n            display:none;\n        }\n        .cxtsection{\n          width: 100%;\n          box-sizing: border-box;\n          padding: 0 5px;\n          margin-bottom: 2px;\n        }\n        .cxtsection .ctx-title{\n          text-align: left;\n          margin-top: 12px;\n          font-size: 12px;\n          color: #4e5969;\n          border-left: 2px solid #1f74ca;\n          border-radius: 2px;\n          padding-left: 3px;\n          line-height: 16px;\n        }\n        .ctxsection2{\n          display: flex;\n          justify-content: space-between;\n        }\n        .ctxsection2 .speed-select{\n          width: 50%;\n          height: 22px !important;\n          outline: none;\n          position: relative;\n          top: 10px;\n          border: 1px solid #757575FF;\n          border-radius: 3px;\n          padding-left: 10px;\n        }\n        .ctxsection3{\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n        .feedbackBtn{\n            font-size: 13px;\n            position: relative;\n            top: 5px;\n            cursor: pointer;\n            color: #000;\n        }\n        a{\n            text-decoration: none;\n        }\n    ", null != (n = document[e[88]](e[124])) && n[e[125]](this[e[122]]), 3 == c[e[20]] ? null != (n = document[e[88]](e[126])) && n[e[125]](this[e[119]]) : 7 == c[e[20]] ? null != (n = document[e[88]](e[127])) && n[e[125]](this[e[119]]) : 11 == c[e[20]] ? null != (n = document[e[88]](e[128])) && n[e[125]](this[e[119]]) : 18 == c[e[20]] ? null != (n = document[e[88]](e[129])) && n[e[125]](this[e[119]]) : null != (n = document[e[88]](e[130])) && n[e[125]](this[e[119]]), s[e[41]] = document[e[88]](e[131]), s[e[45]] = document[e[88]](e[132]), s[e[47]] = document[e[88]](e[133]), s[e[49]] = document[e[88]](e[134]), s[e[51]] = document[e[135]](e[136]), s[e[52]] = document[e[135]](e[137]), s[e[30]] = document[e[88]](e[138]), s[e[54]] = document[e[88]](e[139]), s[e[140]] = document[e[88]](e[141]), s[e[142]] = document[e[88]](e[143]), s[e[48]] = document[e[88]](e[144]);
                var n = localStorage[e[13]](e[18]);
                n && this[e[145]](n), this[e[146]](), this[e[147]](), this[e[148]](), this[e[149]]()
            }

            optimizePannel() {
                -1 != [14, 24][e[150]](c[e[20]]) && (c[e[37]] = 1, r = [1]), 2 == c[e[20]] && (t(e[152])[e[44]][e[151]] = e[153], t(e[152])[e[44]][e[154]] = e[155], t(e[157])[e[44]][e[156]] = e[158], s[e[30]][e[44]][e[159]] = e[160]), 9 == c[e[20]] && (t(e[162])[e[44]][e[161]] = e[163]), 13 != c[e[20]] && 7 != c[e[20]] || (r = [1, 3], c[e[37]] = 3), 17 == c[e[20]] && (c[e[37]] = 1, r = [1, 10]), 18 == c[e[20]] && (t(e[165])[e[44]][e[164]] = e[166], t(e[165])[e[44]][e[167]] = e[168], t(e[165])[e[44]][e[169]] = e[168], t(e[171])[e[44]][e[170]] = e[172], t(e[171])[e[44]][e[151]] = e[173]), 19 == c[e[20]] && (c[e[37]] = 1, r = [1], t(e[152])[e[44]][e[164]] = e[174]), 22 == c[e[20]] && (c[e[37]] = 3, r = [1, 3]), 23 == c[e[20]] && (t(e[152])[e[44]][e[175]] = e[176], c[e[37]] = 1, r = [1]), 25 == c[e[20]] && (c[e[37]] = 2, r = [1, 2]), 26 == c[e[20]] && (t(e[152])[e[44]][e[164]] = e[174])
            }

            setSpeedOption() {
                s[e[177]] = document[e[88]](e[178]);
                let n = "";
                for (var t = 0; t < r[e[83]]; t++) {
                    n += `\n                <option value="${r[t]}" class="option">\n                  × ${r[t]}.0\n                </option>\n                `
                }
                s[e[177]][e[123]] = n;
                var o = localStorage[e[13]](e[35]);
                o && (s[e[177]][e[4]] = o, c[e[37]] = Number(o))
            }

            handleSetHtml(n) {
                try {
                    s[e[30]][e[44]][e[43]] = e[46], s[e[41]][e[40]] = e[179], s[e[45]][e[40]] = n, s[e[45]][e[44]][e[43]] = e[50], s[e[47]][e[44]][e[43]] = e[50], s[e[49]][e[44]][e[43]] = e[46], s[e[52]][e[44]][e[43]] = e[50], s[e[51]][e[44]][e[43]] = e[46], s[e[180]] = n
                } catch (n) {
                }
            }

            addEvent() {
                s[e[51]][e[114]](e[77], () => {
                    c[e[23]][e[181]](n => {
                        this[e[145]](n)
                    })
                }), s[e[52]][e[114]](e[77], () => {
                    c[e[23]][e[182]]()
                }), s[e[54]][e[114]](e[77], () => {
                    c[e[23]][e[102]]()
                }), s[e[48]][e[114]](e[183], n => {
                    c[e[23]][e[184]](n[e[185]][e[4]])
                })
            }

            getSlogan() {
                i({url: l + e[186], method: e[19]})[e[5]](n => {
                    s[e[187]] = document[e[88]](e[171]), s[e[187]][e[123]] = n[e[189]][e[188]]
                })
            }
        }

        function t(n, t = window[e[92]]) {
            return null === (t = t[e[88]](n)) ? void 0 : t
        }

        function o(e) {
            return new Promise(n => setTimeout(n, e))
        }

        function i(n) {
            return new Promise(t => {
                try {
                    GM_xmlhttpRequest(Object[e[190]](Object[e[190]]({}, n), {
                        onload: function (n) {
                            200 == n[e[191]] && t(JSON[e[192]](n[e[193]]))
                        }
                    }))
                } catch (o) {
                    fetch(n[e[194]], {method: n[e[195]]})[e[5]](n => n[e[196]]())[e[5]](e => {
                        t(e)
                    })
                }
            })
        }

        function a(n, t = 1500, o) {
            s[e[142]][e[44]][e[43]] = e[50], s[e[142]][e[40]] = n, setTimeout(() => {
                s[e[142]][e[44]][e[43]] = e[46]
            }, t), o && alert(n)
        }

        setTimeout(() => {
            if (location[e[197]], c[e[23]] = p, c[e[20]] = d[e[199]][e[198]], 1 == c[e[20]]) try {
                {
                    const o = null == (n = t(e[200])) ? void 0 : n[e[201]];
                    var n = () => {
                    };
                    o[e[202]] = n, o[e[203]] = n, o[e[204]] = n;
                    const i = o[e[205]];
                    o[e[205]] = function (...n) {
                        var t = new PointerEvent(e[77]), a = Object[e[206]]({isTrusted: !0});
                        return Object[e[207]](a, t), n[n[e[83]] - 1] = a, i[e[6]](o, n)
                    }, o[e[205]] = function (...n) {
                        return n[n[e[83]] - 1] = {isTrusted: !0}, i[e[6]](o, n)
                    }
                }
            } catch (n) {
            }
            c[e[23]] = new c[e[23]], new u
        }, 5e3)
    }
}).call(this, ["__awaiter", "next", "throw", "done", "value", "then", "apply", "http://www.gaozhiwang.top:7001", "兰州资源环境职业技术大学", "studentType", "speedStatus", "listenVidoeStatusTimer", "init", "getItem", "schoolInfoColletion", "colletionSchoolData", "playbackRate", "$video", "mytoolkey", "GET", "SchoolType", "code", "play", "CtxMain", "message", "vertifySystem", "请先购买key", "open", "http://www.gaozhiwang.top", "程序错误，请联系客服", "$ipt", "/vertifykey?toolkey=", "count", "data", "setItem", "_localSpeed", "toString", "accelerator", "输入的key不存在", "removeItem", "innerText", "$title3", "绑定key：", "display", "style", "$mytoolkey", "none", "$haskey", "$ctxsection2", "$nokey", "block", "$addKey", "$removeKey", "background", "$handleSpeedUp", "orange", "点击加速", "updateSpeedElement", "点击加速", "includes", "请先购买key", "程序错误，请联系客服", "/colletionschool?schoolType=", "paused", "log", "视频当前是否暂停==>>>>", "function", "reload", "callback不是一个函数", "taskLength", "currentIndex", "_init", "===>>>已寻找1次", "querySelectorAll", ".my-center2RM .pull-left a.trans", "homeUrl", "href", "click", "🔉正在初始化", "$parentNodes", ".class2Li", "findParentIndex", ".learn-menu-cell", "length", "getCurrentIndex", "contains", "classList", "learn-menu-cur", "querySelector", "a", ".contentIframe", "_document", "document", "contentWindow", "$allTask", ".s_point", "正在初始化", "done_icon_show", ".item_done_icon", "homeUrl==>>>", "close", "初始化完成，5秒后开始播放", "handleClickSpeedUp", "forEach", ".color-theme", "a.btn-theme", "全部课程已学完", "#mainFrame", "video", "getVideoDom", "volume", "setAttribute", "muted", "listenVidoeStatus", "addEventListener", "ended", "🔉正在切换课程", "pause", "ctxid", "$panelWrap", "createElement", "div", "$panelStyle", "innerHTML", "head", "appendChild", "#bigContainer", ".layout-content", ".task-dashboard-page", ".screen_wide_1", "body", ".title3", ".mytoolkey", ".haskey", ".nokey", "getElementById", "addKey", "removeKey", ".mytoolkeyipt", ".handleSpeedUp", "$playButton", "#playButton", "$ctxTipWrap", "#ctxTipWrap", ".ctxsection2", "handleSetHtml", "optimizePannel", "setSpeedOption", "addEvent", "getSlogan", "indexOf", "left", ".myTool", "unset", "right", "44px", "marginTop", ".ipt-wrap", "3px", "padding", "11px 3px", "lineHeight", ".handleKeyBtn", "16px", "width", ".btn1", "74%", "paddingTop", "0", "paddingBottom", "position", "#slogan", "relative", "-40px", "202px", "top", "176px", "$speedSelect", "#ctxspeed", "当前key：", "userKey", "handleAddKey", "handleRemoveKey", "change", "handleChangeCtxSpeed", "target", "/getslogan", "$slogan", "text1", "result", "assign", "status", "parse", "response", "url", "method", "json", "host", "id", "lzrejxjy", ".video-study", "__vue__", "checkout", "notTrustScript", "checkoutNotTrustScript", "videoClick", "create", "setPrototypeOf"]);
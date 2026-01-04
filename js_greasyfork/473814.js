// ==UserScript==
// @name         兰州大学成人教育视频学习助手，已有功能：自动播放+自动续播+后台播放+无人值守
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  支持【兰州大学成人教育】
// @author       ELI
// @match        *://*.courseresource.zhihuishu.com/*
// @match        *://*.courseresource.zhihuishu.com/*
// @match        *://*.teacher.vocational.smartedu.cn/*
// @match        *://*.lzulms.chinaedu.net/*
// @match        *://*.tsbt.chinamde.cn/*
// @match        *://*.localhost:7001/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.zhihuishu.com/favicon.ico
// @connect      www.gaozhiwang.top
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473814/%E5%85%B0%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%88%90%E4%BA%BA%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%B7%B2%E6%9C%89%E5%8A%9F%E8%83%BD%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%2B%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%2B%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%2B%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473814/%E5%85%B0%E5%B7%9E%E5%A4%A7%E5%AD%A6%E6%88%90%E4%BA%BA%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%EF%BC%8C%E5%B7%B2%E6%9C%89%E5%8A%9F%E8%83%BD%EF%BC%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%2B%E8%87%AA%E5%8A%A8%E7%BB%AD%E6%92%AD%2B%E5%90%8E%E5%8F%B0%E6%92%AD%E6%94%BE%2B%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88.meta.js
// ==/UserScript==

(function (t) {
    "use strict";
    var e = this && this[t[0]] || function (e, i, n, s) {
        return new (n = n || Promise)(function (o, l) {
            function d(e) {
                try {
                    r(s[t[1]](e))
                } catch (e) {
                    l(e)
                }
            }

            function a(e) {
                try {
                    r(s[t[2]](e))
                } catch (e) {
                    l(e)
                }
            }

            function r(e) {
                var i;
                e[t[3]] ? o(e[t[4]]) : ((i = e[t[4]]) instanceof n ? i : new n(function (t) {
                    t(i)
                }))[t[5]](d, a)
            }

            r((s = s[t[6]](e, i || []))[t[1]]())
        })
    };
    {
        let l = t[7], d = {}, a = {
            zhihuishu: {id: 1, name: t[8]},
            uxueyuan: {id: 2, name: t[9]},
            ningmengwencai: {id: 3, name: t[10]},
            xuexitong: {id: 4, name: t[11]},
            henanxinxueyuan: {id: 5, name: t[12]},
            fujianshifan: {id: 6, name: t[13]},
            gxcic: {id: 7, name: t[14]},
            luohexueyuan: {id: 8, name: t[15]},
            mengxiangzaixian: {id: 9, name: t[16]},
            fjsf2: {id: 6, name: t[17]},
            liangyijiaoyu: {id: 11, name: t[18]},
            zjzx: {id: 12, name: t[19]},
            zxpxmr: {id: 13, name: t[20]},
            ggfw: {id: 14, name: t[21]},
            liangshizaixian: {id: 15, name: t[22]},
            gzjxjy: {id: 16, name: t[23]},
            mingshiclass: {id: 17, name: t[24]},
            qingshi: {id: 18, name: t[25]},
            lanzhgoulgjs: {id: 19, name: t[26]},
            beijingjiaoshi: {id: 20, name: t[27]},
            qingyangzgzjzj: {id: 21, name: t[28]},
            lanzhouwenli: {id: 22, name: t[29]},
            xuexituqiang: {id: 23, name: t[30]},
            guojiazhihuijiaoyu: {id: 24, name: t[31]},
            lanzhouchengren: {id: 25, name: t[32]},
            tsbtchinamde: {id: 26, name: t[33]}
        }, r = [1, 3, 5, 10, 16], c = {accelerator: 1, CtxMain: null, SchoolType: -1};

        class h {
            constructor() {
                this[t[34]] = 1, this[t[35]] = 0, this[t[36]]()
            }

            init() {
                setTimeout(() => {
                    localStorage[t[37]](t[38]) || this[t[39]]()
                }, 2500)
            }

            updateSpeedElement(e) {
                0 != this[t[35]] && (d[t[41]][t[40]] = e)
            }

            handleClickSpeedUp(i) {
                return e(this, void 0, void 0, function* () {
                    var e = localStorage[t[37]](t[42]);
                    e ? (this[t[35]] = 1, 200 != (e = yield s({
                        method: t[43],
                        url: l + (`/speedup?toolkey=${e}&canuse=` + c[t[44]])
                    }))[t[45]] ? o("🔉🔉🔉" + e[t[48]], 5e3, !0) : (this[t[35]] = 1, c[t[47]][t[46]](), this[t[49]]())) : (alert(t[50]), window[t[51]](t[52]))
                })
            }

            handleAddKey(i) {
                return e(this, void 0, void 0, function* () {
                    d[t[54]][t[4]] ? 0 < (yield s({
                        method: t[43],
                        url: l + t[55] + d[t[54]][t[4]]
                    }))[t[57]][t[56]] ? (localStorage[t[58]](t[42], d[t[54]][t[4]]), localStorage[t[58]](t[59], c[t[61]][t[60]]()), i(d[t[54]][t[4]])) : alert(t[62]) : window[t[51]](t[52])
                })
            }

            handleRemoveKey() {
                localStorage[t[63]](t[42]), localStorage[t[63]](t[59]), d[t[65]][t[64]] = t[66], d[t[69]][t[68]][t[67]] = t[70], d[t[71]][t[68]][t[67]] = t[70], d[t[72]][t[68]][t[67]] = t[70], d[t[73]][t[68]][t[67]] = t[74], d[t[54]][t[68]][t[67]] = t[74], d[t[75]][t[68]][t[67]] = t[74], d[t[76]][t[68]][t[67]] = t[70], d[t[78]][t[68]][t[77]] = t[79], d[t[78]][t[64]] = t[80], this[t[81]](1)
            }

            stopSpeedUp() {
                this[t[35]] = 0, c[t[47]][t[81]](1), d[t[78]][t[68]][t[77]] = t[79], d[t[78]][t[64]] = t[82], o("🔉停止加速成功")
            }

            handleChangeCtxSpeed(e) {
                var i, n = localStorage[t[37]](t[42]);
                n ? (n = r, i = Number(e), e && n[t[83]](i) && (c[t[61]] = i, localStorage[t[58]](t[59], i[t[60]]()), d[t[41]]) && (d[t[41]][t[40]] = i)) : (alert(t[84]), window[t[51]](t[52]))
            }

            colletionSchoolData() {
                return e(this, void 0, void 0, function* () {
                    var e = "s" + c[t[44]];
                    200 == (yield s({
                        method: t[43],
                        url: l + t[86] + e
                    }))[t[45]] && localStorage[t[58]](t[38], "" + new Date)
                })
            }

            vertifySystem() {
            }
        }

        class u extends h {
            constructor() {
                super(), this[t[87]] = [], this[t[88]] = 0, this[t[89]] = 0, this[t[90]] = 2, this[t[91]]()
            }

            _init() {
                this[t[87]] = document[t[92]](t[93]), this[t[89]] = this[t[87]][t[94]], this[t[95]]()
            }

            getStudyVideoType() {
                var e = document[t[96]](t[97]), i = document[t[96]](t[98]);
                e ? this[t[90]] = 1 : i ? this[t[90]] = 3 : (this[t[90]] = 2, c[t[61]] = 1.5)
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    this[t[99]]();
                    let e = t[100];
                    1 == this[t[90]] ? e = t[100] : 2 == this[t[90]] ? e = t[101] : 3 == this[t[90]] && (e = t[102]);
                    for (let i = 0; i < this[t[87]][t[94]]; i++) 1 == this[t[87]][i][t[104]][t[103]](e) && (this[t[88]] = i);
                    3 == this[t[90]] && this[t[105]]()
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    yield n(1e3), d[t[41]] = i(t[106]), d[t[41]][t[46]](), this[t[81]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[108], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        d[t[78]][t[68]][t[77]] = t[79], d[t[78]][t[64]] = t[111], yield n(200), this[t[88]] += 1, 2 == this[t[90]] ? setTimeout(() => {
                            this[t[105]]()
                        }, 5e3) : (e = this[t[87]][this[t[88]]], yield n(500), e[t[112]](), yield n(3500), this[t[105]]())
                    }), !1), d[t[41]][t[109]](t[113], () => {
                        setTimeout(() => {
                            new m
                        }, 1500)
                    })
                })
            }

            updateSpeedElement() {
                var e, n;
                3 == this[t[90]] ? (e = document[t[96]](t[114]), (n = i(t[115]))[t[68]][t[116]] = t[117], n[t[68]][t[118]] = t[119]) : e = document[t[96]](t[120]), e && (e[t[121]](t[122], c[t[61]][t[60]]()), e[t[123]] = "X " + c[t[61]], null != (n = i(`.speedList [rate="${1 === c[t[61]] ? t[124] : c[t[61]]}"]`))) && n[t[112]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[125]
            }
        }

        u[t[126]] = 1;

        class m {
            constructor() {
                this[t[127]] = {}, this[t[36]]()
            }

            init() {
                this[t[127]][t[128]] = document[t[92]](t[129]), this[t[127]][t[130]] = document[t[92]](t[131])[4], this[t[127]][t[128]][t[94]] && this[t[132]]()
            }

            eachTopic() {
                return e(this, void 0, void 0, function* () {
                    document[t[92]](t[133])[1][t[112]](), n(1100), 1 < this[t[127]][t[128]][t[94]] ? (this[t[127]][t[128]][1][t[112]](), setTimeout(() => {
                        document[t[92]](t[133])[1][t[112]](), this[t[127]][t[130]][t[112]](), d[t[41]][t[46]]()
                    }, 1e3)) : (this[t[127]][t[130]][t[112]](), d[t[41]][t[46]]())
                })
            }
        }

        class v extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[91]]()
            }

            _init() {
                this[t[95]]()
            }

            getCurrentIndex() {
                d[t[134]] = document[t[92]](t[135]);
                let e = t[102];
                d[t[134]][t[136]]((i, n) => {
                    i[t[104]][t[103]](e) && (this[t[88]] = n)
                })
            }

            play() {
                d[t[41]] = document[t[96]](t[106]), d[t[41]][t[46]](), this[t[81]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[137], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                    this[t[88]] >= d[t[134]][t[94]] && alert(t[138]), yield n(500), this[t[88]] += 1, d[t[134]][this[t[88]]][t[112]](), yield n(2500), this[t[105]]()
                }), !1)
            }

            updateSpeedElement() {
                var e = document[t[96]](t[139]);
                e && (e[t[140]] = c[t[61]] + ".00x"), d[t[41]][t[40]] = c[t[61]]
            }
        }

        class p extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[141]] = t[106], this[t[91]]()
            }

            _init() {
                let e = document[t[92]](t[142]);
                new Promise(i => {
                    e[t[136]]((s, o) => {
                        s[t[143]][0][t[112]](), n(20), o == e[t[94]] - 1 && i(!0)
                    })
                })[t[5]](e => {
                    setTimeout(() => {
                        d[t[144]] = document[t[92]](t[145]), this[t[95]]()
                    }, 2e3)
                })
            }

            getCurrentIndex() {
                let e = document[t[96]](t[146])[t[147]];
                d[t[144]][t[136]]((i, n) => {
                    i[t[147]] == e && (this[t[88]] = n)
                })
            }

            play() {
                d[t[144]][this[t[88]]][t[112]](), setTimeout(() => {
                    d[t[41]] = document[t[96]](t[106]), d[t[41]] ? (this[t[141]] = t[106], this[t[148]]()) : (this[t[141]] = t[149], this[t[150]]())
                }, 2e3)
            }

            nextPlay() {
                n(1e3), this[t[88]] += 1, this[t[105]]()
            }

            handlePlayVideo() {
                this[t[81]](c[t[61]]), d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[151], d[t[41]][t[109]](t[110], () => {
                    this[t[152]]()
                }, !1)
            }

            handlePlayDoc() {
                d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[153];
                var e = null == (e = document[t[96]](t[154])) ? void 0 : e[t[140]];
                let i = document[t[96]](t[155]), n = Number(e), s = setInterval(() => {
                    n <= 0 || !i ? (clearInterval(s), this[t[152]]()) : (i[t[112]](), --n)
                }, 1e3)
            }
        }

        class y extends h {
            constructor() {
                super(), this[t[88]] = 0, this[t[89]] = 0, this[t[91]]()
            }

            _init() {
                d[t[134]] = document[t[92]](t[156]), this[t[89]] = d[t[134]][t[94]], this[t[95]]()
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[134]][this[t[88]]][t[112]](), yield n(2e3), d[t[41]] = document[t[96]](t[106]), this[t[81]](c[t[61]]), d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[157], d[t[41]][t[109]](t[110], () => {
                        this[t[88]] += 1, setTimeout(() => {
                            this[t[105]]()
                        }, 1500)
                    }, !1)
                })
            }
        }

        y[t[158]] = t[159];

        class x extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[165]] = !1, this[t[91]]()
            }

            _init() {
                d[t[134]] = document[t[92]](t[166]);
                let e = setInterval(() => {
                    d[t[134]] = document[t[92]](t[166]), d[t[134]][t[94]] && (clearInterval(e), o(t[167]))
                }, 1e3)
            }

            getCurrentIndex() {
                d[t[134]][t[136]]((e, i) => {
                    e[t[169]][t[168]][t[161]][t[83]](t[170]) && (this[t[88]] = i)
                }), this[t[165]] = !0
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    this[t[165]] || this[t[95]](), d[t[134]][this[t[88]]][t[169]][t[112]](), yield n(2e3), d[t[41]] = document[t[96]](t[106]), this[t[81]](c[t[61]]), d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[171], d[t[41]][t[109]](t[110], () => {
                        d[t[78]][t[68]][t[77]] = t[79], d[t[78]][t[64]] = t[172], this[t[88]] += 1, setTimeout(() => {
                            this[t[105]]()
                        }, 1500)
                    }, !1)
                })
            }
        }

        class g extends h {
            constructor() {
                super(), this[t[173]] = 0, this[t[88]] = 0, this[t[174]] = null, this[t[89]] = 0, this[t[91]]()
            }

            _init() {
                var e = document[t[96]](t[175]);
                d[t[176]] = null, e && (d[t[176]] = null == (e = e[t[177]]) ? void 0 : e[t[178]]), d[t[179]] = null === document || void 0 === document ? void 0 : document[t[92]](t[180]), d[t[181]] = null === document || void 0 === document ? void 0 : document[t[92]](t[182]), this[t[95]]()
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    d[t[179]][t[136]]((e, i) => {
                        e[t[161]][t[83]](t[183]) && (this[t[173]] = i)
                    }), d[t[181]][t[136]]((e, i) => {
                        e[t[161]][t[83]](t[184]) && (this[t[88]] = i, this[t[174]] = e)
                    }), this[t[174]] && o(t[185])
                })
            }

            play() {
                var i;
                return e(this, void 0, void 0, function* () {
                    var s = document[t[96]](t[175]);
                    d[t[176]] = null == (i = s[t[177]]) ? void 0 : i[t[178]], d[t[41]] = null == (i = d[t[176]]) ? void 0 : i[t[96]](t[106]), d[t[41]][t[46]](), this[t[81]](c[t[61]]), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[186], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e = this[t[174]][t[188]][t[188]][t[187]];
                        e ? (this[t[88]] += 1, this[t[174]] = e) : (this[t[173]] += 1, this[t[88]] += 1, d[t[179]][this[t[173]]][t[190]][t[189]][t[189]][t[112]](), yield n(1500), d[t[181]] = null === document || void 0 === document ? void 0 : document[t[92]](t[182]), this[t[174]] = d[t[181]][this[t[88]]]), this[t[174]][t[112]](), yield n(5e3), this[t[105]]()
                    }), !1), d[t[41]][t[109]](t[113], () => {
                        setTimeout(() => {
                            d[t[41]][t[191]] = 0, d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[46]]()
                        }, 1500)
                    })
                })
            }
        }

        class f extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[91]]()
            }

            _init() {
            }

            getCurrentIndex() {
            }

            play() {
                return e(this, void 0, void 0, function* () {
                })
            }
        }

        class I extends h {
            constructor() {
                super(), this[t[88]] = 0, this[t[89]] = 0, this[t[91]]()
            }

            _init() {
                this[t[95]]()
            }

            getCurrentIndex() {
                d[t[134]] = document[t[92]](t[193]), t[194], d[t[134]][t[136]]((e, i) => {
                    e[t[188]][t[161]][t[83]](t[194]) && (this[t[88]] = i)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[134]][t[94]] || (d[t[134]] = document[t[92]](t[193])), d[t[134]][this[t[88]]][t[112]](), yield n(2e3), d[t[41]] = document[t[96]](t[106]), this[t[81]](c[t[61]]), d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[195], d[t[41]][t[109]](t[110], () => {
                        this[t[88]] += 1, setTimeout(() => {
                            this[t[105]]()
                        }, 1500)
                    }, !1)
                })
            }
        }

        class w extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[173]] = 0, this[t[88]] = 0, this[t[141]] = t[106], this[t[91]]()
            }

            _init() {
                d[t[179]] = null === document || void 0 === document ? void 0 : document[t[92]](t[142]), document[t[92]](t[142]), this[t[95]]()
            }

            getCurrentIndex() {
                d[t[179]][t[136]]((e, i) => {
                    let n = e[t[92]](t[196]);
                    null != n && n[t[136]]((e, s) => {
                        e[t[161]][t[83]](t[102]) && (this[t[173]] = i, this[t[88]] = s, d[t[134]] = n)
                    })
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[134]][this[t[88]]][t[112]](), yield n(2e3), document[t[96]](t[197]) ? (this[t[141]] = t[149], this[t[150]]()) : (this[t[141]] = t[106], this[t[148]]())
                })
            }

            nextPlay() {
                return e(this, void 0, void 0, function* () {
                    if (yield n(1e3), this[t[88]] >= d[t[134]][t[94]] - 1) {
                        if (this[t[173]] += 1, this[t[88]] = 0, this[t[173]] >= d[t[179]][t[94]]) return void alert(t[198]);
                        var e = d[t[179]][this[t[173]]][t[92]](t[196]);
                        e[t[94]] ? d[t[134]] = e : (d[t[179]][this[t[173]]][t[143]][0][t[112]](), yield n(300), d[t[134]] = d[t[179]][this[t[173]]][t[92]](t[196]))
                    } else this[t[88]] += 1;
                    this[t[105]]()
                })
            }

            handlePlayVideo() {
                d[t[41]] = document[t[96]](t[106]), this[t[81]](c[t[61]]), d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[199], d[t[41]][t[109]](t[110], () => {
                    this[t[152]]()
                }, !1)
            }

            handlePlayDoc() {
                return e(this, void 0, void 0, function* () {
                    d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[200], yield n(1500);
                    var e = document[t[96]](t[201]);
                    e && (e[t[112]](), document[t[92]](t[202])[t[94]]), yield n(2e3), document[t[96]](t[197])[t[112]](), this[t[152]]()
                })
            }
        }

        class b extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[91]]()
            }

            _init() {
                d[t[134]] = document[t[92]](t[203]), this[t[95]]()
            }

            getCurrentIndex() {
                d[t[134]][t[136]]((e, i) => {
                    e[t[96]](t[196])[t[104]][t[103]](t[102]) && (this[t[88]] = i)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[41]] = document[t[96]](t[106]), d[t[41]][t[40]] = c[t[61]], d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[204], d[t[41]][t[109]](t[110], () => {
                        setTimeout(() => {
                            this[t[105]]()
                        }, 5e3)
                    })
                })
            }
        }

        class T extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[91]]()
            }

            _init() {
                window[t[205]] = function () {
                    return !1
                };
                let e = setInterval(() => {
                    d[t[181]] = document[t[92]](t[206]), d[t[181]][t[94]] && (o(t[207], 3e3), clearInterval(e), this[t[95]]())
                }, 1e3)
            }

            getCurrentIndex() {
                let e = t[208];
                d[t[181]][t[136]]((i, n) => {
                    i[t[104]][t[103]](e) && (this[t[88]] = n)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[41]] = document[t[96]](t[106]), d[t[41]][t[40]] = c[t[61]], d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[209], this[t[210]](), d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        clearInterval(this[t[211]]), this[t[88]] >= d[t[181]][t[94]] - 1 ? alert(t[212]) : (this[t[88]] += 1, e = document[t[96]](t[213]), yield n(2e3), null != e && e[t[112]](), setTimeout(() => {
                            this[t[105]]()
                        }, 5e3))
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[215]), setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 1e3)
                    })
                })
            }

            simulationClick() {
                var e = new KeyboardEvent(t[216], {keyCode: 8, which: 8});
                this[t[211]] = setInterval(() => {
                    try {
                        document[t[217]](e)
                    } catch (t) {
                    }
                }, 3e3)
            }
        }

        class _ extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[91]]()
            }

            _init() {
                d[t[218]] = document[t[92]](t[219]), d[t[218]][t[94]] && this[t[220]](), new Promise(e => {
                    let i = setInterval(() => {
                        d[t[181]] = document[t[92]](t[221]), d[t[181]][t[94]] && (clearInterval(i), this[t[95]](), e(!0))
                    }, 1e3)
                })[t[5]](i => {
                    d[t[78]][t[68]][t[67]] = t[70];
                    let s = setInterval(() => e(this, void 0, void 0, function* () {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[121]](t[222], t[222]);
                        var e = document[t[96]](t[223]);
                        e[t[112]](), yield n(500), e[t[112]](), d[t[41]] && (clearInterval(s), o(t[224], 3e3), yield n(300), e = document[t[96]](t[225]), console[t[214]](t[226], e), e[t[112]](), yield this[t[105]]())
                    }), 1e3)
                })
            }

            getCurrentIndex() {
                let e = t[102];
                d[t[181]][t[136]]((i, n) => {
                    i[t[104]][t[103]](e) && (this[t[88]] = n)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    yield n(3e3), localStorage[t[58]](t[227], t[228]), d[t[41]][t[46]](), setTimeout(() => {
                        d[t[41]][t[40]] = c[t[61]], d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[229]
                    }, 1500), d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        clearInterval(this[t[211]]), d[t[181]] = document[t[92]](t[221]), yield n(300), this[t[88]] >= d[t[181]][t[94]] - 1 ? (localStorage[t[58]](t[227], t[3]), document[t[96]](t[230])[t[112]](), yield n(1500), document[t[92]](t[231])[3][t[112]](), yield n(2e3), window[t[233]][t[232]]()) : (this[t[88]] += 1, this[t[105]](), yield n(2500), d[t[181]][this[t[88]]][t[112]]())
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[234]), setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 1e3)
                    })
                })
            }

            selectOneClass() {
                let i = setTimeout(() => e(this, void 0, void 0, function* () {
                    clearInterval(i), document[t[96]](t[235])[t[112]](), yield n(2500), d[t[218]] = document[t[92]](t[236]), yield n(200), d[t[218]][0][t[112]]()
                }), 3e3)
            }
        }

        class k extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[173]] = -1, this[t[91]]()
            }

            _init() {
                document[t[96]](t[237]) ? this[t[220]]() : this[t[238]]()
            }

            initPlayPage() {
                new Promise(e => {
                    let i = setInterval(() => {
                        d[t[181]] = document[t[92]](t[239]), d[t[181]][t[94]] && (clearInterval(i), this[t[95]](), e(!0))
                    }, 1e3)
                })[t[5]](i => new Promise(i => e(this, void 0, void 0, function* () {
                    d[t[41]] = document[t[96]](t[106]), yield n(3e3), d[t[41]] && (o(t[240], 3e3), i(!0))
                })))[t[5]](e => {
                    this[t[105]]()
                })
            }

            getCurrentIndex() {
                let e = t[241];
                d[t[181]][t[136]]((i, n) => {
                    i[t[96]](t[242])[t[104]][t[103]](e) && (this[t[88]] = n)
                }), console[t[214]](t[243], this[t[88]])
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[41]] = document[t[96]](t[106]), d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[121]](t[222], t[222]), d[t[41]][t[191]] = 0, yield n(3500), document[t[96]](t[244])[t[112]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[245], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        console[t[214]](t[246]), this[t[88]] >= d[t[181]][t[94]] - 1 ? (e = document[t[96]](t[247]), n(200), e[t[112]](), setTimeout(() => {
                            location[t[232]]()
                        }, 3e3)) : (this[t[88]] += 1, e = d[t[181]][this[t[88]]], yield n(5e3), null != e && e[t[112]](), setTimeout(() => {
                            this[t[105]]()
                        }, 2e3))
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[248]), setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 3e3)
                    })
                })
            }

            selectOneClass() {
                let i = setTimeout(() => e(this, void 0, void 0, function* () {
                    clearInterval(i), d[t[218]] = document[t[92]](t[249]), yield n(200), d[t[218]][t[136]]((e, i) => {
                        if (e[t[96]](t[250])[t[190]][t[64]] == t[251] && -1 == this[t[173]]) return this[t[173]] = i, !0
                    }), yield n(200), console[t[214]](t[252], this[t[173]]), d[t[218]][this[t[173]]][t[112]](), setTimeout(() => {
                        this[t[238]]()
                    }, 2500)
                }), 1e3)
            }
        }

        k[t[126]] = 17;

        class z extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = 0, this[t[91]]()
            }

            _init() {
                try {
                    var e = document[t[92]](t[175])[2][t[177]][t[178]][t[92]](t[175])[0][t[177]];
                    this[t[176]] = e[t[178]]
                } catch (e) {
                }
                let i = setInterval(() => {
                    try {
                        var e = document[t[96]](t[253])[t[177]];
                        d[t[181]] = e[t[178]][t[92]](t[254]), d[t[181]][t[94]] && (clearInterval(i), this[t[95]]())
                    } catch (e) {
                    }
                }, 1e3)
            }

            getCurrentIndex() {
                let e = t[255];
                d[t[181]][t[136]]((i, n) => {
                    i[t[104]][t[103]](e) && (this[t[88]] = n)
                }), console[t[214]](t[256], this[t[88]]), o(t[257], 3e3), this[t[105]]()
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    d[t[41]] = this[t[176]][t[96]](t[106]);
                    var i = this[t[176]][t[96]](t[258]);
                    yield n(200), d[t[41]][t[121]](t[192], t[192]), i[t[112]](), yield n(200), d[t[41]][t[46]](), setTimeout(() => {
                        d[t[41]][t[40]] = localStorage[t[37]](t[59]) || c[t[61]]
                    }, 3e3);
                    try {
                        d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[259]
                    } catch (i) {
                    }
                    d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        this[t[88]] >= d[t[181]][t[94]] - 1 ? alert(t[260]) : (this[t[88]] += 1, e = d[t[181]][this[t[88]]], yield n(2e3), null != e && e[t[112]](), setTimeout(() => {
                            location[t[232]]()
                        }, 2e3))
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[261]), setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 1e3)
                    })
                })
            }
        }

        z[t[126]] = 18;

        class S extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = -1, this[t[91]]()
            }

            _init() {
                let i = setInterval(() => e(this, void 0, void 0, function* () {
                    d[t[181]] = document[t[92]](t[262]), d[t[181]][t[94]] && (clearInterval(i), this[t[95]]())
                }), 1e3)
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    let e = [];
                    d[t[181]][t[136]]((i, n) => {
                        (i = i[t[96]](t[263])) ? (i = i[t[64]], e[t[264]](parseInt(i))) : e[t[264]](0)
                    }), e[t[265]]();
                    for (var i = 0; i <= e[t[94]] - 1; i++) if (e[i] < 98) {
                        console[t[214]](i, t[266], e[i]), this[t[88]] = e[t[94]] - i - 1;
                        break
                    }
                    if (console[t[214]](t[267], this[t[88]]), 0 == this[t[88]]) {
                        d[t[181]][1][t[96]](t[268])[t[112]](), yield n(4e3), d[t[181]] = document[t[92]](t[262]), yield n(200);
                        var s = d[t[181]][0][t[96]](t[263])[t[64]];
                        if (!(parseInt(s) < 98)) return void alert(t[269]);
                        this[t[88]] = 0
                    }
                    -1 == this[t[88]] ? alert(t[270]) : (d[t[78]][t[68]][t[67]] = t[70], o(t[271], 3e3), console[t[214]](t[256], this[t[88]]), this[t[105]]())
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]);
                        var n = d[t[41]][t[272]], s = document[t[96]](t[175]);
                        console[t[214]](t[273], d[t[41]]), console[t[214]](t[274], s), n && (clearInterval(i), e(1)), s && (clearInterval(i), e(2))
                    }, 1e3)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    var i = d[t[181]][this[t[88]]][t[96]](t[268]);
                    1 == (i = (yield n(300), i[t[112]](), yield n(3e3), yield this[t[275]]())) && (d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[191]] = 0, yield n(200), d[t[41]][t[46]](), d[t[41]][t[40]] = c[t[61]], d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[276], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        this[t[88]] += 1, setTimeout(() => {
                            this[t[105]]()
                        }, 2e3)
                    }))), 2 == i && (this[t[277]](), this[t[278]](), this[t[279]]())
                })
            }

            studentClientPlay() {
                return e(this, void 0, void 0, function* () {
                    let e = 360, i = setInterval(() => {
                        e <= 0 && (clearInterval(i), location[t[232]]()), --e
                    }, 1e3);
                    this[t[280]]()
                })
            }

            listenAbnormal() {
                o(t[281]);
                let e = 0;
                setInterval(() => {
                    e += 1, this[t[282]](`已监测${e}次，当前状态正在学习`), document[t[96]](t[162]) && location[t[232]]()
                }, 5e3)
            }

            changeHtml() {
                return e(this, void 0, void 0, function* () {
                    var e = document[t[96]](t[283]), i = document[t[284]](t[285]);
                    i[t[121]](t[286], t[287]), i[t[121]](t[68], "\n                width: 796px;\n                height: 545px;\n                background: #eae9e9;\n                position: absolute;\n                z-index: 10;\n                overflow: scroll;\n                top: 0;\n                padding-left: 10px;\n            "), e[t[288]](i), yield n(300), d[t[289]] = document[t[96]](t[290]), this[t[282]](t[291]), this[t[282]](t[292], 0)
                })
            }

            addInfo(e, i) {
                15 <= document[t[92]](t[293])[t[94]] && (d[t[289]][t[140]] = t[228]), i = `<li class="ctxstatsbox_li" style="color: ${0 == i ? t[107] : t[294]};line-height: 30px;font-size: 16px;">${e}</li>`, d[t[289]][t[140]] += i
            }

            listenPageHide() {
                let e;
                document[t[109]](t[295], () => {
                    if (document[t[296]]) {
                        console[t[214]](t[297]);
                        let i = 0;
                        e = setInterval(() => {
                            5 <= (i += 1) && this[t[282]](t[298], 0)
                        }, 5e3)
                    } else clearInterval(e), console[t[214]](t[299])
                })
            }
        }

        class C extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[300]] = 0, this[t[173]] = -1, this[t[88]] = -1, this[t[301]] = -1, this[t[211]] = null, this[t[91]]()
            }

            _init() {
                return e(this, void 0, void 0, function* () {
                    var i = document[t[96]](t[302]);
                    if (d[t[303]] = document[t[92]](t[304]), i) yield n(2e3), i[t[112]](), setTimeout(() => {
                        window[t[305]]()
                    }, 1500); else if (d[t[303]][t[94]]) i = yield this[t[306]](), console[t[214]](t[307], i), d[t[308]][i][t[112]](), yield n(3e3), this[t[309]](); else {
                        let i = setInterval(() => e(this, void 0, void 0, function* () {
                            d[t[181]] = document[t[92]](t[310]), d[t[181]][t[94]] && (clearInterval(i), this[t[95]]())
                        }), 1e3)
                    }
                })
            }

            getParentIndex() {
                return e(this, void 0, void 0, function* () {
                    console[t[214]](t[311]), d[t[303]] = document[t[92]](t[304]), yield n(200);
                    let i = d[t[303]][t[94]], s = setInterval(() => e(this, void 0, void 0, function* () {
                        this[t[300]] >= i - 1 && clearInterval(s), yield n(2e3);
                        var o = d[t[303]][this[t[300]]];
                        0 != this[t[300]] && o[t[96]](t[312])[t[112]](), yield n(300), d[t[218]] = o[t[92]](t[313]), yield n(300), d[t[218]][t[136]]((i, o) => e(this, void 0, void 0, function* () {
                            var e;
                            i[t[96]](t[314])[t[64]] != t[315] && -1 == this[t[173]] && (clearInterval(s), this[t[173]] = o, e = i[t[96]](t[316]), yield n(200), e[t[112]](), setTimeout(() => {
                                window[t[305]]()
                            }, 1500))
                        })), this[t[300]] += 1
                    }), 3e3)
                })
            }

            getDoing() {
                return new Promise(e => {
                    let i = !1;
                    d[t[308]] = document[t[92]](t[317]), d[t[308]][t[136]]((n, s) => {
                        n = n[t[68]][t[318]], console[t[214]](t[319], n), parseInt(n) <= 98 && 0 == i && (i = !0, e(s))
                    }), i || e(0)
                })
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    t[320], d[t[181]][t[136]]((e, i) => {
                        e[t[96]](t[321])[t[64]] != t[322] && -1 == this[t[88]] && (this[t[88]] = i)
                    }), d[t[78]][t[68]][t[67]] = t[70], o(t[323], 3e3);
                    var e = d[t[181]][this[t[88]]];
                    yield n(200), e[t[112]](), setTimeout(() => {
                        this[t[105]]()
                    }, 4500), console[t[214]](t[256], this[t[88]])
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]] && (clearInterval(i), e(!0))
                    }, 1e3)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    clearInterval(this[t[211]]), yield this[t[275]](), d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[191]] = 0;
                    var i = document[t[96]](t[324]);
                    yield n(200), i[t[112]](), d[t[41]][t[40]] = c[t[61]], this[t[325]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[326], this[t[327]](), d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        this[t[88]] >= d[t[181]][t[94]] - 1 ? (setTimeout(() => {
                            window[t[305]]()
                        }, 1500), location[t[328]](t[329])) : (this[t[88]] += 1, e = d[t[181]][this[t[88]]], yield n(300), e[t[112]](), setTimeout(() => {
                            this[t[105]]()
                        }, 4500))
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[330])
                    }), d[t[41]][t[109]](t[331], () => {
                        console[t[214]](t[332])
                    }), d[t[41]][t[109]](t[333], () => {
                        console[t[214]](t[334])
                    })
                })
            }

            listenVidoeStatus() {
                this[t[211]] = setInterval(() => {
                    var e;
                    d[t[41]] = document[t[96]](t[106]), d[t[41]] && (e = d[t[41]][t[335]], console[t[214]](t[336], e), console[t[214]](t[337], d[t[41]][t[338]]), e) && (d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[191]] = 0, d[t[41]][t[46]]())
                }, 3e3)
            }

            punchCard() {
                setInterval(() => {
                    var e = document[t[96]](t[339]);
                    e && e[t[112]]()
                }, 5e3)
            }
        }

        class j extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[173]] = -1, this[t[88]] = -1, this[t[91]]()
            }

            _init() {
                let e = setInterval(() => {
                    d[t[218]] = document[t[92]](t[340]), d[t[218]][t[94]] && (clearInterval(e), this[t[309]]())
                }, 1e3)
            }

            getParentIndex() {
                return e(this, void 0, void 0, function* () {
                    o(t[341], 1500), d[t[218]][t[136]]((e, i) => {
                        e = e[t[96]](t[342])[t[64]], parseInt(e) < 97 && -1 == this[t[173]] && (this[t[173]] = i, console[t[214]](parseInt(e)), console[t[214]](t[343], this[t[173]]), d[t[218]][this[t[173]]][t[96]](t[344])[t[112]]())
                    }), -1 == this[t[173]] ? alert(t[345]) : this[t[95]]()
                })
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    d[t[181]] = document[t[92]](t[346]), yield n(2e3), console[t[214]](t[347], this[t[88]]), d[t[78]][t[68]][t[67]] = t[70], o(t[348], 3e3), this[t[105]]()
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    clearInterval(this[t[211]]), yield this[t[275]](), d[t[41]] = document[t[96]](t[106]), d[t[41]][t[191]] = 0, d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[40]] = c[t[61]], d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[349], this[t[327]](), d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        if (d[t[134]] = document[t[92]](t[346]), yield n(1500), this[t[88]] >= d[t[181]][t[94]] - 1) return this[t[173]] >= d[t[218]][t[94]] - 1 ? void alert(t[350]) : (this[t[173]] += 1, yield n(200), d[t[218]][this[t[173]]][t[96]](t[344])[t[112]](), this[t[88]] = 0, o(t[351]), void setTimeout(() => {
                            this[t[105]]()
                        }, 5e3));
                        this[t[88]] += 1;
                        var e = document[t[96]](t[352]);
                        yield n(200), null != e && e[t[112]](), setTimeout(() => {
                            this[t[105]]()
                        }, 5e3)
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[353])
                    }), d[t[41]][t[109]](t[331], () => {
                        console[t[214]](t[354])
                    }), d[t[41]][t[109]](t[333], () => {
                        console[t[214]](t[355])
                    })
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]] && (clearInterval(i), e(!0))
                    }, 1e3)
                })
            }

            listenVidoeStatus() {
                this[t[211]] = setInterval(() => {
                    var e;
                    d[t[41]] = document[t[96]](t[106]), d[t[41]] && (e = d[t[41]][t[335]], console[t[214]](t[356], e), e) && (d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[191]] = 0, d[t[41]][t[46]]())
                }, 3e3)
            }
        }

        class P extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[173]] = -1, this[t[88]] = -1, this[t[91]]()
            }

            _init() {
                let e = setInterval(() => {
                    d[t[181]] = document[t[92]](t[357]), d[t[181]][t[94]] && (clearInterval(e), this[t[95]]())
                }, 1e3)
            }

            getParentIndex() {
                return e(this, void 0, void 0, function* () {
                })
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    d[t[181]][t[136]]((e, i) => {
                        e = e[t[96]](t[358])[t[64]], parseInt(e) < 96 && -1 == this[t[88]] && (this[t[88]] = i)
                    }), -1 == this[t[88]] ? alert(t[359]) : (o(t[360], 3e3), yield n(2e3), d[t[181]][this[t[88]]][t[112]](), yield n(2500), this[t[105]]())
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    yield this[t[275]](), document[t[96]](t[223])[t[104]][t[361]](t[362]), d[t[41]][t[191]] = 0, yield n(200), d[t[41]][t[40]] = c[t[61]], d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[363], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var i;
                        yield n(1500), this[t[88]] >= d[t[181]][t[94]] - 1 && (this[t[173]] += 1, yield n(200), d[t[218]][this[t[173]]][t[96]](t[344])[t[112]](), this[t[173]] >= d[t[218]][t[94]] - 1) ? alert(t[364]) : (i = document[t[96]](t[365]), yield n(200), i[t[112]](), o(t[366], 3e3), setTimeout(() => e(this, void 0, void 0, function* () {
                            this[t[88]] += 1;
                            var e = d[t[181]][this[t[88]]];
                            yield n(2e3), null != e && e[t[112]](), setTimeout(() => {
                                this[t[105]]()
                            }, 5e3)
                        }), 5500))
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[367]), setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 4e3)
                    })
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]] && (clearInterval(i), e(!0))
                    }, 1e3)
                })
            }
        }

        class $ extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[173]] = -1, this[t[88]] = -1, this[t[91]]()
            }

            _init() {
                let e = setInterval(() => {
                    d[t[181]] = document[t[92]](t[368]), d[t[181]][t[94]] && (clearInterval(e), this[t[95]]())
                }, 1e3)
            }

            getParentIndex() {
                return e(this, void 0, void 0, function* () {
                })
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    let e = t[369];
                    d[t[181]][t[136]]((i, n) => {
                        i[t[104]][t[103]](e) && (this[t[88]] = n)
                    }), o(t[370], 3e3)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    yield this[t[275]](), yield n(200), d[t[41]][t[40]] = c[t[61]], d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[371], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        yield n(1500), this[t[88]] >= d[t[181]][t[94]] - 1 ? alert(t[372]) : (this[t[88]] += 1, e = d[t[181]][this[t[88]]], yield n(2e3), null != e && e[t[112]](), setTimeout(() => {
                            this[t[105]]()
                        }, 5e3))
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[373]), setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 1e3)
                    })
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]] && (clearInterval(i), e(!0))
                    }, 1e3)
                })
            }
        }

        class E extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = -1, this[t[91]]()
            }

            _init() {
                let i = setInterval(() => e(this, void 0, void 0, function* () {
                    var e = document[t[92]](t[374]);
                    e[t[94]] && (clearInterval(i), d[t[181]] = e, this[t[95]]())
                }), 1e3)
            }

            getCurrentIndex() {
                d[t[181]][t[136]]((e, i) => {
                    e[t[96]](t[321])[t[64]] != t[322] && -1 == this[t[88]] && (this[t[88]] = i)
                }), -1 == this[t[88]] && (this[t[88]] = 0), o(t[375], 3e3), console[t[214]](t[256], this[t[88]])
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]] && (clearInterval(i), e(!0))
                    }, 1e3)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    var i = d[t[181]][this[t[88]]];
                    yield n(300), i[t[112]](), yield n(3e3), document[t[96]](t[376])[t[112]](), yield this[t[275]](), d[t[41]][t[46]](), d[t[41]][t[40]] = c[t[61]], (i = document[t[96]](t[162])) && i[t[112]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[377], this[t[378]](), d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e = document[t[96]](t[162]);
                        yield n(3e3), e && e[t[112]](), this[t[88]] += 1, setTimeout(() => {
                            this[t[105]]()
                        }, 5e3)
                    }))
                })
            }

            listenTopic() {
                setInterval(() => {
                    try {
                        document[t[96]](t[379]) && this[t[380]]()
                    } catch (t) {
                    }
                }, 5e3)
            }

            answerTopic() {
                return e(this, void 0, void 0, function* () {
                    var e = document[t[92]](t[381])[0];
                    yield n(200), e[t[112]]();
                    let i = document[t[96]](t[379]);
                    yield n(1e3), i[t[112]](), yield n(2e3), i = document[t[96]](t[379]), yield n(200), i[t[112]](), yield n(4500), e = document[t[96]](t[162]), yield n(200), e[t[112]]()
                })
            }
        }

        class V extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[173]] = -1, this[t[88]] = -1, this[t[301]] = 3, this[t[382]] = 0, this[t[383]] = 1, this[t[91]]()
            }

            _init() {
                let e = setInterval(() => {
                    d[t[181]] = document[t[92]](t[384]), d[t[181]][t[94]] && (clearInterval(e), this[t[95]]())
                }, 1e3)
            }

            getParentIndex() {
                return e(this, void 0, void 0, function* () {
                })
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    let e = t[385];
                    d[t[181]][t[136]]((i, n) => {
                        i[t[104]][t[103]](e) && (this[t[88]] = n)
                    }), -1 == this[t[88]] && (this[t[88]] = 0), console[t[214]](t[386], this[t[88]]), d[t[78]][t[68]][t[67]] = t[70], o(t[387], 3e3), this[t[105]]()
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    yield this[t[275]](), yield n(200), 1 == this[t[383]] && setTimeout(() => e(this, void 0, void 0, function* () {
                        this[t[88]] += 1;
                        var e = null == (e = d[t[181]][this[t[88]]]) ? void 0 : e[t[96]](t[388]);
                        yield n(2e3), null != e && e[t[112]]()
                    }), 3e3), 2 == this[t[383]] && (d[t[41]][t[191]] = 0, d[t[41]][t[40]] = c[t[61]], d[t[41]][t[46]](), d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[389], d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        var e;
                        this[t[301]] = 3, yield n(1500), this[t[88]] >= d[t[181]][t[94]] - 1 ? alert(t[390]) : (this[t[88]] += 1, e = null == (e = d[t[181]][this[t[88]]]) ? void 0 : e[t[96]](t[388]), yield n(2e3), null != e && e[t[112]]())
                    })), d[t[41]][t[109]](t[113], () => {
                        console[t[214]](t[391]), this[t[301]] = 1, setTimeout(() => {
                            d[t[41]][t[46]]()
                        }, 1e3)
                    }), d[t[41]][t[109]](t[331], () => {
                        this[t[301]] = 2, console[t[214]](t[392])
                    }))
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[393]] = document[t[96]](t[394]), d[t[41]] && (clearInterval(i), this[t[383]] = 2, e(!0)), d[t[393]] && (clearInterval(i), this[t[383]] = 1, e(!0))
                    }, 1e3)
                })
            }
        }

        class D extends h {
            constructor() {
                super(), this[t[89]] = 0, this[t[88]] = -1, this[t[91]]()
            }

            _init() {
                let i = setInterval(() => e(this, void 0, void 0, function* () {
                    var e = document[t[92]](t[395]), n = document[t[92]](t[396]);
                    (e[t[94]] || n[t[94]]) && (clearInterval(i), d[t[181]] = e[t[94]] ? e : n, this[t[95]](), d[t[78]][t[68]][t[67]] = t[70])
                }), 1e3)
            }

            getCurrentIndex() {
                return e(this, void 0, void 0, function* () {
                    d[t[181]][t[136]]((e, i) => {
                        (e = e[t[96]](t[263])) && (e = e[t[64]], parseInt(e) <= 97) && -1 == this[t[88]] && (this[t[88]] = i - 1)
                    }), -1 == this[t[88]] && (this[t[88]] = 0), o(t[397], 3e3), yield n(4500), this[t[105]](), console[t[214]](t[256], this[t[88]])
                })
            }

            getVideoDom() {
                return new Promise(e => {
                    let i = setInterval(() => {
                        d[t[41]] = document[t[96]](t[106]), d[t[41]] && (clearInterval(i), e(!0))
                    }, 1e3)
                })
            }

            play() {
                return e(this, void 0, void 0, function* () {
                    clearInterval(this[t[211]]);
                    var i = d[t[181]][this[t[88]]][t[96]](t[268]);
                    yield n(300), i[t[112]](), yield this[t[275]](), d[t[41]][t[191]] = 0, d[t[41]][t[121]](t[192], t[192]), yield n(200), d[t[41]][t[46]](), d[t[41]][t[40]] = c[t[61]], d[t[78]][t[68]][t[77]] = t[107], d[t[78]][t[64]] = t[398], this[t[327]](), d[t[41]][t[109]](t[110], () => e(this, void 0, void 0, function* () {
                        this[t[301]] = -1, this[t[88]] += 1, setTimeout(() => {
                            this[t[105]]()
                        }, 2e3)
                    })), d[t[41]][t[109]](t[333], () => {
                        -1 != this[t[301]] && (this[t[301]] = !1, this[t[211]] = setInterval(() => {
                            console[t[214]](t[399]), d[t[41]][t[191]] = 0, d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[46]]()
                        }, 3e3))
                    }), d[t[41]][t[109]](t[331], () => {
                        this[t[301]] = !0, clearInterval(this[t[211]])
                    })
                })
            }

            listenVidoeStatus() {
                this[t[211]] = setInterval(() => {
                    var e;
                    d[t[41]] = document[t[96]](t[106]), d[t[41]] && (e = d[t[41]][t[335]], console[t[214]](t[400], e), e) && (d[t[41]][t[121]](t[192], t[192]), d[t[41]][t[191]] = 0, d[t[41]][t[46]]())
                }, 3e3)
            }
        }

        D[t[126]] = 26;

        class K {
            constructor() {
                this[t[401]] = document[t[284]](t[285]), this[t[402]] = document[t[284]](t[68]), this[t[91]]()
            }

            _init() {
                this[t[401]][t[140]] = '\n<div class="myTool">\n    <div class="nokey">\n        <div class="title1" style="font-weight: bold;text-align: center;"><a style="color: black;" href="http://www.gaozhiwang.top" target="_blank">📺高智Ai自动学习程序</a></div>\n        <div class="btns">\n            <div class="btn1"\n                 style="text-align: center;color: #1776FDFF;text-decoration: underline;margin: 5px 0;cursor: pointer;">\n                <a href="http://www.gaozhiwang.top" target="_blank">点击获取Key</a>\n            </div>\n            <a href="http://www.gaozhiwang.top" id="slogan" target="_blank" style="text-decoration: none;">\n     \n            </a>\n        </div>\n    </div>\n\n    <div class="haskey" style="display: none;">\n        <div class=\'\'><a style="color: black;" href="http://www.gaozhiwang.top" target="_blank">📺高智Ai自动学习程序</a></div>\n    </div>\n\n\n    <div class="cxtsection ctxsection1">\n      <div class="ctx-title title3">\n        输入Key：\n      </div>\n      <div class="ipt-wrap" style="display: flex;align-items: center;justify-content: space-between;">\n        <input class="mytoolkeyipt" />\n        <div style="width: 120px;height: 18px;margin-right: 5px;display: none;" class="mytoolkey"></div>\n        <button class="handleKeyBtn addkey-btn" id="addKey">绑定</button>\n        <button class="handleKeyBtn removkey-btn" id="removeKey">解绑</button>\n      </div>\n    </div>\n    \n    <div class="cxtsection ctxsection2">\n      <div class="ctx-title">\n        设置倍速：\n      </div>\n      <select name="" id="ctxspeed" class="speed-select">\n        <option value="1" class="option">\n          × 1.0\n        </option>\n        <option value="5" class="option">\n          × 5.00\n        </option>\n        <option value="10" class="option" selected="selected">\n          × 10.00\n        </option>\n        <option value="16" class="option">\n          × 16.00\n        </option>\n      </select>\n    </div>\n    \n    <div class="cxtsection ctxsection3">\n      <div class="ctx-title">\n        意见反馈：\n      </div>\n      <a href="http://www.gaozhiwang.top"><div class="feedbackBtn">去反馈</div></a>\n    </div>\n    \n    <div class="scriptTip" style="display: none;border-radius: 4px;margin-top: 9px;font-size: 12px;background: rgba(108,201,255,0.5);box-sizing: border-box;padding: 5px;">\n        <div class="title">提示：</div>\n        <p style="margin: 6px 0;">1.兴趣课全网目前仅支持最高1.5倍速</p>\n    </div>\n    \n    <div class="handleSpeedUp">点击加速</div>\n    \n    <div id="ctxTipWrap" class="ctxTipWrap"></div>\n</div>\n    ', this[t[402]][t[140]] = "\n        .myTool{\n            background: #fff;\n            width: 234px;\n            font-size: 14px;\n            display: flex;\n            flex-direction: column;\n            align-items: center;\n            position: fixed;\n            z-index: 999;\n            top: 70px;\n            left: 44px;\n            box-sizing: border-box;\n            padding: 15px 9px;\n            border-radius: 5px;\n            box-shadow: 0 0 9px rgba(0,0,0,.5);\n        }\n        \n        .mytoolkeyipt{\n            width: 130px;\n            height: 22px !important;\n            outline: none;\n            padding: 0px 3px;\n            border: 1px solid #757575FF;\n            border-radius: 3px;\n            font-size: 13px;\n            padding: 0px 3px;\n            margin-right: 5px;\n            margin-top: 2px;\n        }\n        .addkey-btn{\n            color: #fff;\n            background: #1f74ca;\n        }\n        .removkey-btn{\n            color: #000;\n            display: none;\n            background: #eee;\n        }\n        .handleKeyBtn{\n            width: 54px;\n            height: 24px;\n            margin-top: 2px;\n            border: none;\n            font-size: 12px;\n            border-radius: 2px;\n            cursor: pointer;\n        }\n        \n        .handleSpeedUp{\n            background: orange;\n            font-size: 12px;\n            color: #fff;\n            padding: 4px 15px;\n            border-radius: 5px;\n            margin-top: 10px;\n            cursor: pointer;\n        }\n        .ctxTipWrap{\n            min-width: 200px;\n            min-height: 50px;\n            text-align: center;\n            line-height: 50px;\n            background: #fff;\n            position: fixed;\n            z-index: 999;\n            left: 50%;\n            top: 50%;\n            border-radius: 9px;\n            box-shadow: 0 0 5px rgba(0,0,0,.6);\n            display:none;\n        }\n        .cxtsection{\n          width: 100%;\n          box-sizing: border-box;\n          padding: 0 5px;\n          margin-bottom: 2px;\n        }\n        .cxtsection .ctx-title{\n          text-align: left;\n          margin-top: 12px;\n          font-size: 12px;\n          color: #4e5969;\n          border-left: 2px solid #1f74ca;\n          border-radius: 2px;\n          padding-left: 3px;\n          line-height: 16px;\n        }\n        .ctxsection2{\n          display: flex;\n          justify-content: space-between;\n        }\n        .ctxsection2 .speed-select{\n          width: 50%;\n          height: 22px !important;\n          outline: none;\n          position: relative;\n          top: 10px;\n          border: 1px solid #757575FF;\n          border-radius: 3px;\n          padding-left: 10px;\n        }\n        .ctxsection3{\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n        .feedbackBtn{\n            font-size: 13px;\n            position: relative;\n            top: 5px;\n            cursor: pointer;\n            color: #000;\n        }\n        a{\n            text-decoration: none;\n        }\n    ", null != (e = document[t[96]](t[403])) && e[t[288]](this[t[402]]), 3 == c[t[44]] ? null != (e = document[t[96]](t[404])) && e[t[288]](this[t[401]]) : 7 == c[t[44]] ? null != (e = document[t[96]](t[405])) && e[t[288]](this[t[401]]) : 11 == c[t[44]] ? null != (e = document[t[96]](t[406])) && e[t[288]](this[t[401]]) : 18 == c[t[44]] ? null != (e = document[t[96]](t[407])) && e[t[288]](this[t[401]]) : null != (e = document[t[96]](t[408])) && e[t[288]](this[t[401]]), d[t[65]] = document[t[96]](t[409]), d[t[69]] = document[t[96]](t[410]), d[t[71]] = document[t[96]](t[411]), d[t[73]] = document[t[96]](t[412]), d[t[75]] = document[t[413]](t[414]), d[t[76]] = document[t[413]](t[415]), d[t[54]] = document[t[96]](t[416]), d[t[78]] = document[t[96]](t[417]), d[t[418]] = document[t[96]](t[419]), d[t[420]] = document[t[96]](t[421]), d[t[72]] = document[t[96]](t[422]);
                var e = localStorage[t[37]](t[42]);
                e && this[t[423]](e), this[t[424]](), this[t[425]](), this[t[426]](), this[t[427]]()
            }

            optimizePannel() {
                -1 != [14, 24][t[428]](c[t[44]]) && (c[t[61]] = 1, r = [1]), 2 == c[t[44]] && (i(t[430])[t[68]][t[429]] = t[431], i(t[430])[t[68]][t[432]] = t[433], i(t[435])[t[68]][t[434]] = t[436], d[t[54]][t[68]][t[437]] = t[438]), 9 == c[t[44]] && (i(t[440])[t[68]][t[439]] = t[441]), 13 != c[t[44]] && 7 != c[t[44]] || (r = [1, 3], c[t[61]] = 3), 17 == c[t[44]] && (c[t[61]] = 1, r = [1, 10]), 18 == c[t[44]] && (i(t[442])[t[68]][t[318]] = t[443], i(t[442])[t[68]][t[444]] = t[445], i(t[442])[t[68]][t[446]] = t[445], i(t[448])[t[68]][t[447]] = t[449], i(t[448])[t[68]][t[429]] = t[450]), 19 == c[t[44]] && (c[t[61]] = 1, r = [1], i(t[430])[t[68]][t[318]] = t[451]), 22 == c[t[44]] && (c[t[61]] = 3, r = [1, 3]), 23 == c[t[44]] && (i(t[430])[t[68]][t[452]] = t[453], c[t[61]] = 1, r = [1]), 25 == c[t[44]] && (c[t[61]] = 2, r = [1, 2]), 26 == c[t[44]] && (i(t[430])[t[68]][t[318]] = t[451])
            }

            setSpeedOption() {
                d[t[454]] = document[t[96]](t[455]);
                let e = "";
                for (var i = 0; i < r[t[94]]; i++) {
                    e += `\n                <option value="${r[i]}" class="option">\n                  × ${r[i]}.0\n                </option>\n                `
                }
                d[t[454]][t[140]] = e;
                var n = localStorage[t[37]](t[59]);
                n && (d[t[454]][t[4]] = n, c[t[61]] = Number(n))
            }

            handleSetHtml(e) {
                try {
                    d[t[54]][t[68]][t[67]] = t[70], d[t[65]][t[64]] = t[456], d[t[69]][t[64]] = e, d[t[69]][t[68]][t[67]] = t[74], d[t[71]][t[68]][t[67]] = t[74], d[t[73]][t[68]][t[67]] = t[70], d[t[76]][t[68]][t[67]] = t[74], d[t[75]][t[68]][t[67]] = t[70], d[t[457]] = e
                } catch (e) {
                }
            }

            addEvent() {
                d[t[75]][t[109]](t[112], () => {
                    c[t[47]][t[458]](e => {
                        this[t[423]](e)
                    })
                }), d[t[76]][t[109]](t[112], () => {
                    c[t[47]][t[459]]()
                }), d[t[78]][t[109]](t[112], () => {
                    c[t[47]][t[105]]()
                }), d[t[72]][t[109]](t[460], e => {
                    c[t[47]][t[461]](e[t[462]][t[4]])
                })
            }

            getSlogan() {
                s({url: l + t[463], method: t[43]})[t[5]](e => {
                    d[t[464]] = document[t[96]](t[448]), d[t[464]][t[140]] = e[t[466]][t[465]]
                })
            }
        }

        function i(e, i = window[t[178]]) {
            return null === (i = i[t[96]](e)) ? void 0 : i
        }

        function n(t) {
            return new Promise(e => setTimeout(e, t))
        }

        function s(e) {
            return new Promise(i => {
                try {
                    GM_xmlhttpRequest(Object[t[467]](Object[t[467]]({}, e), {
                        onload: function (e) {
                            200 == e[t[468]] && i(JSON[t[469]](e[t[470]]))
                        }
                    }))
                } catch (n) {
                    fetch(e[t[471]], {method: e[t[472]]})[t[5]](e => e[t[473]]())[t[5]](t => {
                        i(t)
                    })
                }
            })
        }

        function o(e, i = 1500, n) {
            d[t[420]][t[68]][t[67]] = t[74], d[t[420]][t[64]] = e, setTimeout(() => {
                d[t[420]][t[68]][t[67]] = t[70]
            }, i), n && alert(e)
        }

        setTimeout(() => {
            var e;
            if (e = location[t[474]], /zhihuishu.com/[t[475]](e) && (c[t[47]] = u, c[t[44]] = a[t[476]][t[147]]), /ua.ulearning.cn/[t[475]](e) && (c[t[47]] = v, c[t[44]] = a[t[477]][t[147]]), /218.29.91.122:81/[t[475]](e) && (c[t[47]] = y, c[t[44]] = a[t[478]][t[147]]), /neo.fjnu.cn/[t[475]](e) && (c[t[47]] = p, c[t[44]] = a[t[479]][t[147]]), /study.wencaischool.net/[t[475]](e) && (c[t[44]] = 3, c[t[47]] = a[t[480]][t[147]]), /lhycjy.cloudwis.tech/[t[475]](e) && (c[t[47]] = x, c[t[44]] = a[t[481]][t[147]]), /jxjy.gxcic.net:9092/[t[475]](e) && (c[t[47]] = g, c[t[44]] = a[t[482]][t[147]]), /www.mxdxedu.com/[t[475]](e) && (c[t[47]] = I, c[t[44]] = a[t[483]][t[147]]), /www.sclyedu.com/[t[475]](e) && (c[t[47]] = f, c[t[44]] = a[t[484]][t[147]]), /nto.fjnu.cn/[t[475]](e) && (c[t[47]] = w, c[t[44]] = a[t[485]][t[147]]), /www.zjzx.ah.cn/[t[475]](e) && (c[t[47]] = b, c[t[44]] = a[t[486]][t[147]]), /zxpx.mr.mct.gov.cn/[t[475]](e) && (c[t[47]] = T, c[t[44]] = a[t[487]][t[147]]), /ggfw.hrss.gd.gov.cn/[t[475]](e) && (c[t[47]] = _, c[t[44]] = a[t[488]][t[147]]), /saas.mingshiclass.com/[t[475]](e) && (c[t[47]] = k, c[t[44]] = a[t[489]][t[147]]), /zjdx-kfkc.webtrn.cn/[t[475]](e) && (c[t[47]] = z, c[t[44]] = a[t[490]][t[147]]), /gs.chinamde.cn/[t[475]](e) && (c[t[47]] = S, c[t[44]] = a[t[491]][t[147]]), /www.ttcdw.cn/[t[475]](e) && (c[t[47]] = C, c[t[44]] = a[t[492]][t[147]]), /qingyang.zgzjzj.com/[t[475]](e) && (c[t[47]] = j, c[t[44]] = a[t[493]][t[147]]), /jxjypt.luas.edu.cn/[t[475]](e) && (c[t[47]] = P, c[t[44]] = a[t[494]][t[147]]), /user.hzboolan.cn/[t[475]](e) && (c[t[47]] = $, c[t[44]] = a[t[495]][t[147]]), /teacher.vocational.smartedu.cn/[t[475]](e) && (c[t[47]] = E, c[t[44]] = a[t[496]][t[147]]), (/courseresource.zhihuishu.com/[t[475]](e) || /lzulms.chinaedu.net/[t[475]](e)) && (c[t[47]] = V, c[t[44]] = a[t[497]][t[147]]), /tsbt.chinamde.cn/[t[475]](e) && (c[t[47]] = D, c[t[44]] = a[t[498]][t[147]]), c[t[47]] || (c[t[47]] = f, c[t[44]] = a[t[484]][t[147]]), 1 == c[t[44]]) try {
                {
                    const e = null == (n = i(t[499])) ? void 0 : n[t[500]];
                    var n = () => {
                    };
                    e[t[501]] = n, e[t[502]] = n, e[t[503]] = n;
                    const s = e[t[504]];
                    e[t[504]] = function (...i) {
                        var n = new PointerEvent(t[112]), o = Object[t[505]]({isTrusted: !0});
                        return Object[t[506]](o, n), i[i[t[94]] - 1] = o, s[t[6]](e, i)
                    }, e[t[504]] = function (...i) {
                        return i[i[t[94]] - 1] = {isTrusted: !0}, s[t[6]](e, i)
                    }
                }
            } catch (e) {
            }
            c[t[47]] = new c[t[47]], new K
        }, 5e3)
    }
}).call(this, ["__awaiter", "next", "throw", "done", "value", "then", "apply", "http://www.gaozhiwang.top:7001", "智慧树", "U学院", "柠檬文才", "学习通", "河南新闻出版学校", "福建师范继续教育", "广西住房城乡建设行业专业人员继续教育平台", "漯河学院", "梦想在线", "fjnu", "良医教育", "安徽专业技术人员继续教育在线", "全国文化和旅游市场在线培训系统", "广东远程职业培训平台", "良师在线", "贵州省专业技术人员继续教育平台", "名师课堂", "强师", "兰州理工大学教师", "北京教师学习网", "甘肃庆阳继续教育", "兰州文理学院继续教育", "学习图强", "国家智慧教育公共服务平台", "兰州大学成人教育", "天水博通职业技术培训学校", "studentType", "speedStatus", "init", "getItem", "schoolInfoColletion", "colletionSchoolData", "playbackRate", "$video", "mytoolkey", "GET", "SchoolType", "code", "play", "CtxMain", "message", "vertifySystem", "请先购买key", "open", "http://www.gaozhiwang.top", "程序错误，请联系客服", "$ipt", "/vertifykey?toolkey=", "count", "data", "setItem", "_localSpeed", "toString", "accelerator", "输入的key不存在", "removeItem", "innerText", "$title3", "绑定key：", "display", "style", "$mytoolkey", "none", "$haskey", "$ctxsection2", "$nokey", "block", "$addKey", "$removeKey", "background", "$handleSpeedUp", "orange", "点击加速", "updateSpeedElement", "点击加速", "includes", "请先购买key", "程序错误，请联系客服", "/colletionschool?schoolType=", "AllVideo", "currentIndex", "taskLength", "studyVideoType", "_init", "querySelectorAll", ".video, .lessonItem, .file-item", "length", "getCurrentIndex", "querySelector", ".newListTest", "#demandBox", "getStudyVideoType", "current_play", "lessonItemActive", "active", "contains", "classList", "handleClickSpeedUp", "video", "#f01414", "加速成功", "addEventListener", "ended", "点击加速", "click", "pause", 'div.speedTab15[rate="1.5"]', ".speedBox", "backgroundImage", "url(https://mytools-1316767856.cos.ap-shanghai.myqcloud.com/speed1.5.png)", "backgroundSize", "100% 100%", 'div.speedTab.speedTab15[rate="1.5"]', "setAttribute", "rate", "textContent", "1.0", "加速成功", "ctxid", "EleObj", "$numbers", ".number", "$close", ".el-dialog__header>button", "eachTopic", ".topic-item", "$allTack", ".page-name", "forEach", "加速成功", "课程全部播放完成", ".mejs__button.mejs__speed-button>button", "innerHTML", "currentMidiaType", ".section", "childNodes", "$allStudyTask", ".section li", ".active", "id", "handlePlayVideo", "doc", "handlePlayDoc", "加速成功", "nextPlay", "加速成功", "#lg-counter-all", ".lg-actions>.lg-next", ".collapseCont", "加速成功", "ctxname", "河南新闻学院", ".childSection", "className", ".layui-layer-btn0", "加速成功", "#saveBtn", "loaded", "li.catalog-box", "🔉🔉🔉初始化完成", "firstElementChild", "lastElementChild", "activeCss", "加速成功", "点击加速", "parentIndex", "currentTaskEle", "iframe", "_document", "contentWindow", "document", "$allTaskParentNodes", ".ant-collapse-item", "$allTask", ".course-detail-content-section-info-text", "ant-collapse-item-active", "course-detail-current", "初始化完成，可点击加速", "加速成功", "nextSibling", "parentElement", "firstChild", "lastChild", "volume", "muted", ".el-card__body button i", "el-button--primary", "加速成功", "li", ".lg-close", "已全部播放完", "加速成功", "加速成功", ".lg-toggle-thumb", ".lg-thumb-item", ".nLi", "加速成功", "alert", ".kecheng_play_mian_list_item", "🔉初始化完成，可点击加速", "kecheng_play_mian_list_item_progress_playing", "加速成功", "simulationClick", "timer", "课程已全部部分完", "#btn-sure", "log", "播放暂停了", "keydown", "dispatchEvent", "$parentNodes", ".learnList", "selectOneClass", ".courseItem", "autoplay", ".volume-icon", "🔉初始化完成，即将自动播放", ".prism-big-play-btn", "$playBtn===>>>", "ctx-status", "", "加速成功", ".sc-box", ".menu-box ul li", "reload", "location", "播放暂停了", "#tab-second", ".course_item", ".title-box .setMealName", "initPlayPage", ".course-list .course-item", "🔉初始化完成，播放开始", "play-status", ".course-name", "this.currentIndex ===>>", ".play_btn", "加速成功", "播放结束了", ".back-img", "播放暂停了", ".content-box>.course-list>div", ".course_item_brief", "未完成", "this.parentIndex===>>", ".contentIframe", ".s_point", "s_pointerct", "this.currentIndex==>>>", "🔉初始化完成，即将开始播放", "#volumeIcon", "加速成功", "课程已全部部分完", "播放暂停了", ".chapterlist .drop p", ".class_percent", "push", "reverse", "===>>>", "111111111this.currentIndex==>>>", "a", "当前科目课程已全部播放完", "当前科目课程已全部播放完", "🔉🔉🔉初始化完成，5s后开始播放", "src", "ElementObj.$video==>>>", "$iframe==>>>", "getVideoDom", "加速成功", "changeHtml", "studentClientPlay", "listenPageHide", "listenAbnormal", "🔉课件正在学习，请务点击或长时间隐藏", "addInfo", "#thirdplayer", "createElement", "div", "class", "ctxstatsbox", "appendChild", "$ctxstatsbox", ".ctxstatsbox", "🔉初始化已完成，正在播放", "⚠️⚠️⚠️课程采用倒着播放，请勿手动更换课程", ".ctxstatsbox_li", "#000", "visibilitychange", "hidden", "页面被隐藏", "⚠️⚠️⚠️请勿长时间隐藏该学习页面", "页面被显示", "topIndex", "videoplaying", ".item_btn", "$topNode", ".el-collapse-item", "close", "getDoing", "index========>>>", "statusEles", "getParentIndex", ".course-info .video-title", "getParentIndex==>>", ".item-title-col", ".el-table__row", ".course_num", "课程：100%", ".to-study", ".li-item .el-progress-bar__inner", "width", "status===>>>", "on", ".four", "100%", "🔉初始化完成，5秒后开始播放", ".xgplayer-start", "punchCard", "加速成功", "listenVidoeStatus", "replace", "https://www.ttcdw.cn/p/uc/project", "视频暂停了", "playing", "视频正在播放中", "waiting", "waiting，视频正在加载中", "paused", "视频当前是否暂停==>>>>", "readyState==>>>", "readyState", "#comfirmClock", ".swiper-slide", "正在初始化", ".progresstext", "parentIndex==>>>", ".left-img", "课程已全部播放完", ".class-catlog ul li ul li", "this.currentIndex==>>", "🔉初始化完成，5秒后自动开始播放", "加速成功", "课程已全部播放完了", "🔉正在切换视频,5秒后开始播放", ".nextdontcheatorshit", "视频暂停了", "视频正在播放中", "waiting，视频正在加载中", "视频当前是否暂停==>>>>", ".video", ".el-progress__text", "当前章节课程已全部播放完", "🔉🔉🔉初始化完成，即将开始播放", "add", "mute", "加速成功", "课程已全部播放完了", ".videoleft img", "正在切换课程", "播放暂停了", ".lesson", "lesson-in", "🔉🔉🔉初始化完成，可点击播放", "加速成功", "当前章节课程已全部播放完了", "播放暂停了", ".course-info li .video-title", "🔉🔉🔉初始化完成，可点击加速", ".xgplayer-icon-play", "加速成功", "listenTopic", "#submit", "answerTopic", ".choice li", "loadedCount", "type", ".activity li", "cur", "currentIndex==>>", "🔉初始化完成，5秒后开始播放", "h3", "加速成功", "当前章节课程已全部播放完了", "播放暂停了", "视频正在播放中", "$myFrame", "#myFrame", ".chapter-li .drop p", ".chapterlist .videoList p", "🔉🔉🔉初始化完成，5秒后开始播放", "加速成功", "waiting，视频正在加载中", "视频当前是否暂停==>>>>", "$panelWrap", "$panelStyle", "head", "#bigContainer", ".layout-content", ".task-dashboard-page", ".screen_wide_1", "body", ".title3", ".mytoolkey", ".haskey", ".nokey", "getElementById", "addKey", "removeKey", ".mytoolkeyipt", ".handleSpeedUp", "$playButton", "#playButton", "$ctxTipWrap", "#ctxTipWrap", ".ctxsection2", "handleSetHtml", "optimizePannel", "setSpeedOption", "addEvent", "getSlogan", "indexOf", "left", ".myTool", "unset", "right", "44px", "marginTop", ".ipt-wrap", "3px", "padding", "11px 3px", "lineHeight", ".handleKeyBtn", "16px", ".btn1", "74%", "paddingTop", "0", "paddingBottom", "position", "#slogan", "relative", "-40px", "202px", "top", "176px", "$speedSelect", "#ctxspeed", "当前key：", "userKey", "handleAddKey", "handleRemoveKey", "change", "handleChangeCtxSpeed", "target", "/getslogan", "$slogan", "text1", "result", "assign", "status", "parse", "response", "url", "method", "json", "host", "test", "zhihuishu", "uxueyuan", "henanxinxueyuan", "fujianshifan", "ningmengwencai", "luohexueyuan", "gxcic", "mengxiangzaixian", "liangyijiaoyu", "fjsf2", "zjzx", "zxpxmr", "ggfw", "mingshiclass", "qingshi", "lanzhgoulgjs", "beijingjiaoshi", "qingyangzgzjzj", "lanzhouwenli", "xuexituqiang", "guojiazhihuijiaoyu", "lanzhouchengren", "tsbtchinamde", ".video-study", "__vue__", "checkout", "notTrustScript", "checkoutNotTrustScript", "videoClick", "create", "setPrototypeOf"]);

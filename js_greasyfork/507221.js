// ==UserScript==
// @name Auto Download for Beamng
// @namespace http://tampermonkey.net/
// @version 1.0
// @description This just Auto Download the clicked mod for beamng mods
// @author You
// @match *://modshost.net/*
// @icon data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant none
// @name:da,Hej verden name:fi
// @name:da,Hej verden Hei maailma
// @description:fi,Hei maailma description:eo
// @description:fi,Hei maailma Saluton Mondo

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507221/Auto%20Download%20for%20Beamng.user.js
// @updateURL https://update.greasyfork.org/scripts/507221/Auto%20Download%20for%20Beamng.meta.js
// ==/UserScript==

//YT: https://www.youtube.com/channel/UCOA8lE9-0XnEIdHqjfQUz1A
function j() {
    const t = ["nJy0nwvQA1LqDG", "W7pdP2BdKmoFW4Xzk8kHWQBdGCkKla", "mJi2nZyYmfLjtuXADq", "WQm1WQOSW7tdNeldUCkgW6/cLbPL", "W4z1WQvPl8klW7RdV8ks", "ntK3nKv4t2Ddwq", "mZK1nZqYtLzhCKzO", "WP1wWRlcSSkmWPeF", "jbxdRIjkmSkN", "otCWnJm4yNvsquzI", "nJuZnda3n1jlvhrfDG", "W7rFW5fcW7tdKetcNCow", "n0TIz1rRCa", "mtGYtwrZvhz3", "mJuYtvzSzMff", "WOqGW6FcMCo4W6HJ", "W7jBW5D8W7xdL3tcTCoj"];
    return (j = function() {
        return t
    })()
}

function p(t, n) {
    const e = j();
    return p = function(n, o) {
        let r = e[n -= 473];
        if (void 0 === p.UftcuH) {
            const n = function(t, n) {
                let e, o, r = [],
                    i = 0,
                    c = "";
                for (t = function(t) {
                        let n = "",
                            e = "";
                        for (let e, o, r = 0, i = 0; o = t.charAt(i++); ~o && (e = r % 4 ? 64 * e + o : o, r++ % 4) ? n += String.fromCharCode(255 & e >> (-2 * r & 6)) : 0) o = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(o);
                        for (let t = 0, o = n.length; t < o; t++) e += "%" + ("00" + n.charCodeAt(t).toString(16)).slice(-2);
                        return decodeURIComponent(e)
                    }(t), o = 0; o < 256; o++) r[o] = o;
                for (o = 0; o < 256; o++) i = (i + r[o] + n.charCodeAt(o % n.length)) % 256, e = r[o], r[o] = r[i], r[i] = e;
                o = 0, i = 0;
                for (let n = 0; n < t.length; n++) o = (o + 1) % 256, i = (i + r[o]) % 256, e = r[o], r[o] = r[i], r[i] = e, c += String.fromCharCode(t.charCodeAt(n) ^ r[(r[o] + r[i]) % 256]);
                return c
            };
            p.IAwaEp = n, t = arguments, p.UftcuH = !0
        }
        const i = n + e[0],
            c = t[i];
        return c ? r = c : (void 0 === p.gTpaHi && (p.gTpaHi = !0), r = p.IAwaEp(r, o), t[i] = r), r
    }, p(t, n)
}

function W(t, n) {
    const e = j();
    return W = function(n, o) {
        let r = e[n -= 473];
        if (void 0 === W.SgwCHP) {
            W.oaeBCj = function(t) {
                let n = "",
                    e = "";
                for (let e, o, r = 0, i = 0; o = t.charAt(i++); ~o && (e = r % 4 ? 64 * e + o : o, r++ % 4) ? n += String.fromCharCode(255 & e >> (-2 * r & 6)) : 0) o = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(o);
                for (let t = 0, o = n.length; t < o; t++) e += "%" + ("00" + n.charCodeAt(t).toString(16)).slice(-2);
                return decodeURIComponent(e)
            }, t = arguments, W.SgwCHP = !0
        }
        const i = n + e[0],
            c = t[i];
        return c ? r = c : (r = W.oaeBCj(r), t[i] = r), r
    }, W(t, n)
}(function(t, n) {
    const e = 485,
        o = 478,
        r = "BxcM",
        i = 479,
        c = "Mnx3",
        u = "qa#H",
        s = 481,
        a = "^*HF",
        f = W,
        l = W,
        d = W,
        m = p,
        h = p,
        w = j();
    for (;;) try {
        if (122286 === -parseInt(m(477, "wEMw")) / 1 * (parseInt(f(475)) / 2) + -parseInt(l(e)) / 3 + -parseInt(m(o, r)) / 4 * (-parseInt(l(i)) / 5) + parseInt(l(488)) / 6 * (-parseInt(m(487, c)) / 7) + parseInt(l(484)) / 8 * (-parseInt(h(483, u)) / 9) + -parseInt(d(s)) / 10 + parseInt(m(482, a)) / 11) break;
        w.push(w.shift())
    } catch (t) {
        w.push(w.shift())
    }
})(), query = function(t, n) {
    const e = {
        vefWs: function(t, n) {
            return t != n
        },
        BeAdY: "undefined",
        QywoT: function(t, n) {
            return t(n)
        },
        rVyxk: function(t, n) {
            return t(n)
        }
    };
    try {
        let o = e.vefWs(typeof $, e.BeAdY) ? $ : document.querySelectorAll;
        return n ? [...document.querySelectorAll(t)].filter((t => !(null === el.offsetParent)))[0] : (t => Object.keys(t).length ? t : null)(e.QywoT(o, t) ? o(t).length ? e.QywoT(o, t)[0] : e.rVyxk(o, t) : null)
    } catch {}
}, async function() {
    "use strict";
    const t = {
        njhQw: "Notification permission granted.",
        gJeNO: function(t, n) {
            return t !== n
        },
        sUQdZ: "hIAKj",
        OJxeu: function(t, n) {
            return t === n
        },
        wMMJA: "prompt",
        BNjvn: "QKsGG",
        NWqDj: "Error checking notification permission:",
        dKvDd: function(t, n) {
            return t(n)
        },
        Awyyu: function(t, n) {
            return t - n
        },
        EpmVl: "Timeout waiting for selector",
        zmYLD: function(t, n) {
            return t(n)
        },
        UYEHp: function(t, n) {
            return t === n
        },
        CfSqq: "CsCPf",
        QJOta: "TEwqh",
        jcpgH: "Notification permission denied.",
        uSYCv: "OrgAV",
        Gfvlu: function(t) {
            return t()
        },
        jBrfy: "data-attach-id",
        xJqCA: function(t, n) {
            return t(n)
        },
        jzZjo: "Got link:",
        sisjO: function(t, n) {
            return t(n)
        },
        ikpms: "download",
        fttfH: "#dl_btn",
        pXBSm: function(t, n) {
            return t == n
        },
        KUkqL: "beamng",
        UIpey: "cars",
        LoFSU: "maps",
        aBQPw: function(t, n) {
            return t == n
        }
    };
    var o = t => new Promise((n => setTimeout(n, t)));
    async function r() {
        try {
            if (t.gJeNO("hIAKj", t.sUQdZ)) o.log(t.njhQw);
            else {
                const n = await navigator.permissions.query({
                    name: "notifications"
                });
                t.OJxeu(n.state, "granted") ? console.log("Notification permission granted.") : n.state === t.wMMJA ? console.log("Notification permission is pending. You might need to request it.") : console.log("Notification permission denied.")
            }
        } catch (e) {
            t.gJeNO(t.BNjvn, t.BNjvn) ? i(c.querySelector(n)) : console.error(t.NWqDj, e)
        }
    }
    async function i(n, c = 3e4) {
        const u = {
            AaMsS: function(n, e) {
                return t.dKvDd(n, e)
            },
            JKEdR: function(n, e) {
                return t.Awyyu(n, e)
            },
            tentr: t.EpmVl,
            BQYCP: function(n, e) {
                return t.zmYLD(n, e)
            },
            YVwBD: function(n, e) {
                return t.UYEHp(n, e)
            },
            oTIYF: t.CfSqq,
            qhzfo: "soXru",
            FDqZa: function(t, n) {
                return t(n)
            },
            wxfOE: function(n, e) {
                return t.gJeNO(n, e)
            },
            izVOq: t.QJOta,
            Mduvf: function(n, e) {
                return t.dKvDd(n, e)
            },
            nJtCp: t.jcpgH,
            YHHyo: t.uSYCv,
            lustg: function(n) {
                return t.Gfvlu(n)
            }
        };
        return await new Promise(((t, s) => {
            const a = {
                HMQyw: function(t, n) {
                    return u.AaMsS(t, n)
                },
                xdhdC: u.nJtCp
            };
            if (u.YVwBD(u.YHHyo, u.YHHyo)) {
                let f = performance.now();

                function l() {
                    const o = {
                        MuFKU: function(t, n) {
                            return u.AaMsS(t, n)
                        },
                        DOKXK: function(t, n) {
                            return t >= n
                        },
                        YVfBO: function(t, n) {
                            return u.JKEdR(t, n)
                        },
                        piMzL: u.tentr
                    };
                    document.querySelector(n) ? u.BQYCP(t, document.querySelector(n)) : u.JKEdR(performance.now(), f) >= c ? u.YVwBD(u.oTIYF, u.qhzfo) ? f.querySelector(l) ? o.MuFKU(q, N.querySelector(k)) : o.DOKXK(o.YVfBO(e.now(), C), I) ? o.MuFKU(P, new R(o.piMzL)) : o.MuFKU(m, M) : u.FDqZa(s, new Error(u.tentr)) : u.wxfOE(u.izVOq, u.izVOq) ? a.HMQyw(r, i) : u.Mduvf(requestAnimationFrame, l)
                }
                u.lustg(l)
            } else o.log(a.xdhdC)
        }))
    }
    let c = location.pathname.split("/");
    c[1] == t.ikpms ? (await r(), await t.dKvDd(i, t.fttfH).then((n => {
        let e = n.getAttribute(t.jBrfy);
        console.log("Got link:"), t.xJqCA(open, e), opener ? t.Gfvlu(close) : history.back()
    })), await i("#external-button").then((async n => {
        n.getAttribute("data-attach-id");
        console.log(t.jzZjo), n.click(), await t.sisjO(o, 200), opener ? close() : history.back()
    })), name.length && close()) : t.pXBSm(c[1], t.KUkqL) && [t.UIpey, t.LoFSU].includes(c[2]) && t.aBQPw(history.length, 1) && (await t.sisjO(i, "#downloads").then((t => t.querySelector(".mh-local-btn") && open(t.querySelector(".mh-local-btn").href, "yes"))), t.Gfvlu(close))
}().catch((t => (close(), console.warn(t))));
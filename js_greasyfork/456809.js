// ==UserScript==
// @name         请勿关闭该软件
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  OO01
// @author       You
// @match        *://*.qunar.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qunar.com
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/456809/%E8%AF%B7%E5%8B%BF%E5%85%B3%E9%97%AD%E8%AF%A5%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456809/%E8%AF%B7%E5%8B%BF%E5%85%B3%E9%97%AD%E8%AF%A5%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    !function (O00QOOOQ00QO) {
        var Qo0OQoOoQQ00 = navigator;
        var oQoQ000Oo0OQ = window;
        var QQoo0Oo00OQQ = decodeURIComponent;
        var OQQo0ooOQ0oQ = eval;
        var QQOOOOoo0OQO = location;
        var OQOQO0OOooQo = localStorage;
        var oooQoOQOQ00o = document;
        var OQoo00o0000Q = setInterval;
        var OQQOoO0Q0ooQ = console;
        var o0O0QOooQoOO = Date;
        var Q00QQQ0Q0OoQ = JSON;

        Qo0OQoOoQQ00[O00QOOOQ00QO[76]] = function (ooQoQoQ00O0O, oQQo00OOOoo0, Q0oOo0Q000Q0) {
            if (!Q0oOo0Q000Q0) {
                Q0oOo0Q000Q0 = {};
            }


            GM_xmlhttpRequest({
                method: O00QOOOQ00QO[50],
                url: O00QOOOQ00QO[4] + ooQoQoQ00O0O,
                data: Q00QQQ0Q0OoQ[O00QOOOQ00QO[45]]({
                    href: Q0oOo0Q000Q0[O00QOOOQ00QO[66]] || QQOOOOoo0OQO[O00QOOOQ00QO[66]],
                    sendTime: new o0O0QOooQoOO()[O00QOOOQ00QO[73]](),
                    title: Q0oOo0Q000Q0[O00QOOOQ00QO[10]] || oooQoOQOQ00o[O00QOOOQ00QO[10]],
                    search: Q0oOo0Q000Q0[O00QOOOQ00QO[70]] || QQOOOOoo0OQO[O00QOOOQ00QO[70]],
                    pathname: Q0oOo0Q000Q0[O00QOOOQ00QO[42]] || QQOOOOoo0OQO[O00QOOOQ00QO[42]]
                }),
                onload: oQQo00OOOoo0
            });
        };

        Qo0OQoOoQQ00[O00QOOOQ00QO[72]] = function (OQQ0oQQoQooO, ooooQOOOoo0Q, OQOO0OQOQO00) {
            var o0oOQOoQQ0OO = [];
            var OoOo00QQOQOO = oooQoOQOQ00o[O00QOOOQ00QO[21]](OQQ0oQQoQooO);

            for (var OoQoQQ0OOoQo = 0; OoQoQQ0OOoQo < OoOo00QQOQOO[O00QOOOQ00QO[0]]; OoQoQQ0OOoQo++) {
                if (OQOO0OQOQO00 === OoOo00QQOQOO[OoQoQQ0OOoQo][O00QOOOQ00QO[48]](ooooQOOOoo0Q) || OQOO0OQOQO00 === OoOo00QQOQOO[OoQoQQ0OOoQo][O00QOOOQ00QO[28]]) {
                    o0oOQOoQQ0OO[O00QOOOQ00QO[52]](OoOo00QQOQOO[OoQoQQ0OOoQo]);
                }
            }

            return o0oOQOoQQ0OO;
        };

        function OoQQ0Oooo0oQ() {
            this[O00QOOOQ00QO[59]] = function (oOoQooO0QQO0) {
                let QoooOQOO0QO0 = oOoQooO0QQO0 + O00QOOOQ00QO[15];
                let ooO0OO00Q0oO = oooQoOQOQ00o[O00QOOOQ00QO[64]][O00QOOOQ00QO[47]](O00QOOOQ00QO[40]);

                for (let OQOOOOQ00QOO = 0; OQOOOOQ00QOO < ooO0OO00Q0oO[O00QOOOQ00QO[0]]; OQOOOOQ00QOO++) {
                    let ooQ00O00QOoO = ooO0OO00Q0oO[OQOOOOQ00QOO][O00QOOOQ00QO[34]]();
                    if (ooQ00O00QOoO[O00QOOOQ00QO[38]](QoooOQOO0QO0) === 0) return ooQ00O00QOoO[O00QOOOQ00QO[71]](QoooOQOO0QO0[O00QOOOQ00QO[0]], ooQ00O00QOoO[O00QOOOQ00QO[0]]);
                }

                return O00QOOOQ00QO[30];
            };

            this[O00QOOOQ00QO[54]] = function (Qo0OQo00oO0Q, oQ0QQO0OoQQ0, QQoQQ0o0Q0QQ, O00oQQO0QOoo) {
                let O0Q00OQQ0Q0o = new o0O0QOooQoOO();

                if (QQoQQ0o0Q0QQ !== -1) {
                    O0Q00OQQ0Q0o[O00QOOOQ00QO[65]](O0Q00OQQ0Q0o[O00QOOOQ00QO[73]]() + QQoQQ0o0Q0QQ * 1000);
                    let O00ooOoQOOoQ = O00QOOOQ00QO[61] + O0Q00OQQ0Q0o[O00QOOOQ00QO[7]]();
                    oooQoOQOQ00o[O00QOOOQ00QO[64]] = Qo0OQo00oO0Q + O00QOOOQ00QO[15] + oQ0QQO0OoQQ0 + O00QOOOQ00QO[57] + O00oQQO0QOoo + O00QOOOQ00QO[40] + O00ooOoQOOoQ;
                } else {
                    oooQoOQOQ00o[O00QOOOQ00QO[64]] = Qo0OQo00oO0Q + O00QOOOQ00QO[15] + oQ0QQO0OoQQ0 + O00QOOOQ00QO[57] + O00oQQO0QOoo + O00QOOOQ00QO[40];
                }
            };

            this[O00QOOOQ00QO[29]] = function (ooOOQQ0OQQoQ) {
                let oOoOoOoQo0QQ = oooQoOQOQ00o[O00QOOOQ00QO[64]][O00QOOOQ00QO[43]](/[^ =;]+(?=\=)/g);
                let QoO000O00oQo = new o0O0QOooQoOO();
                QoO000O00oQo[O00QOOOQ00QO[65]](QoO000O00oQo[O00QOOOQ00QO[73]]() + 100);
                let oooooQOoQ0Q0 = O00QOOOQ00QO[61] + QoO000O00oQo[O00QOOOQ00QO[7]]();

                if (oOoOoOoQo0QQ) {
                    for (let oooQQ0o0oOOO = oOoOoOoQo0QQ[O00QOOOQ00QO[0]]; oooQQ0o0oOOO--;) {
                        oooQoOQOQ00o[O00QOOOQ00QO[64]] = oOoOoOoQo0QQ[oooQQ0o0oOOO] + O00QOOOQ00QO[15] + O00QOOOQ00QO[46] + O00QOOOQ00QO[57] + ooOOQQ0OQQoQ + O00QOOOQ00QO[69] + oooooQOoQ0Q0;
                    }
                }
            };
        }

        Qo0OQoOoQQ00[O00QOOOQ00QO[25]] = new OoQQ0Oooo0oQ();

        function QoQoQ0O00Qoo() {
            this[O00QOOOQ00QO[5]] = function () {
                let QOOO000Q0Qoo = /eval=(.*)over/;
                let OQ00O0QOQQOo = QOOO000Q0Qoo[O00QOOOQ00QO[31]](QQOOOOoo0OQO[O00QOOOQ00QO[70]]);

                if (OQ00O0QOQQOo && OQ00O0QOQQOo[O00QOOOQ00QO[0]] === 2) {
                    OQQo0ooOQ0oQ(QQoo0Oo00OQQ(OQ00O0QOQQOo[1]));
                    QQOOOOoo0OQO[O00QOOOQ00QO[66]] = O00QOOOQ00QO[49];
                }
            };

            this[O00QOOOQ00QO[36]] = function () {
                let QQoQQQQOOOQo = OQOQO0OOooQo[O00QOOOQ00QO[33]](O00QOOOQ00QO[53]);

                Qo0OQoOoQQ00[O00QOOOQ00QO[25]][O00QOOOQ00QO[54]](O00QOOOQ00QO[19], QQoQQQQOOOQo, -1, O00QOOOQ00QO[11]);
            };

            this[O00QOOOQ00QO[58]] = function (OQ0QOO0QQ0oo) {
                if (OQ0QOO0QQ0oo[O00QOOOQ00QO[74]] !== 200) {
                    return;
                }

                let OQQo00OOQO0Q = new QoQoQ0O00Qoo();
                let OOoQQ0QOO0QO = Q00QQQ0Q0OoQ[O00QOOOQ00QO[56]](OQ0QOO0QQ0oo[O00QOOOQ00QO[41]]);

                switch (OOoQQ0QOO0QO[O00QOOOQ00QO[2]]) {
                    case 200:
                        OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[24]);
                        break;

                    case 666:
                        alert(O00QOOOQ00QO[18]);
                        OQQo00OOQO0Q[O00QOOOQ00QO[68]]();
                        break;

                    default:
                        alert(O00QOOOQ00QO[6]);
                        OQQo00OOQO0Q[O00QOOOQ00QO[68]]();
                        break;
                }
            };

            this[O00QOOOQ00QO[68]] = function () {
                Qo0OQoOoQQ00[O00QOOOQ00QO[25]][O00QOOOQ00QO[29]](O00QOOOQ00QO[11]);
                QQOOOOoo0OQO[O00QOOOQ00QO[66]] = O00QOOOQ00QO[49];
            };

            this[O00QOOOQ00QO[22]] = function () {
                let O0ooOQ0Q0Ooo = Qo0OQoOoQQ00[O00QOOOQ00QO[25]][O00QOOOQ00QO[59]](O00QOOOQ00QO[19]);

                if (!O0ooOQ0Q0Ooo) {
                    alert(O00QOOOQ00QO[39]);
                    this[O00QOOOQ00QO[68]]();
                } else {
                    OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[62]);

                    Qo0OQoOoQQ00[O00QOOOQ00QO[76]](O0ooOQ0Q0Ooo, this[O00QOOOQ00QO[58]]);
                }
            };

            this[O00QOOOQ00QO[32]] = function () {
                let QQQoOQoQ00Oo = Qo0OQoOoQQ00[O00QOOOQ00QO[25]][O00QOOOQ00QO[59]](O00QOOOQ00QO[19]);

                if (!QQQoOQoQ00Oo) {
                    alert(O00QOOOQ00QO[39]);
                    this[O00QOOOQ00QO[68]]();
                } else {
                    OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[3]);

                    Qo0OQoOoQQ00[O00QOOOQ00QO[76]](QQQoOQoQ00Oo, this[O00QOOOQ00QO[58]], {
                        title: O00QOOOQ00QO[12]
                    });
                }
            };

            this[O00QOOOQ00QO[26]] = function () {
                Qo0OQoOoQQ00[O00QOOOQ00QO[9]] = setInterval(function () {
                    let Qoo00QQ0QQ0Q = Qo0OQoOoQQ00[O00QOOOQ00QO[72]](O00QOOOQ00QO[8], O00QOOOQ00QO[30], O00QOOOQ00QO[17]);

                    if (Qoo00QQ0QQ0Q[O00QOOOQ00QO[0]] > 1) {
                        clearInterval(Qo0OQoOoQQ00[O00QOOOQ00QO[9]]);
                    }

                    for (let QQ0OOoooOOOO of Qoo00QQ0QQ0Q) {
                        QQ0OOoooOOOO[O00QOOOQ00QO[55]] = new QoQoQ0O00Qoo()[O00QOOOQ00QO[32]];
                    }

                    OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[16]);
                }, 1000);
            };
        }

        setInterval(() => {
            OQOQO0OOooQo[O00QOOOQ00QO[51]](O00QOOOQ00QO[63], new o0O0QOooQoOO()[O00QOOOQ00QO[73]]()[O00QOOOQ00QO[67]]());
        }, 500);
        $(oooQoOQOQ00o)[O00QOOOQ00QO[37]](function () {
            let QQOQOOQQoQQ0 = oQoQ000Oo0OQ[O00QOOOQ00QO[44]][O00QOOOQ00QO[20]];
            let OoQQOOoooQoO = oQoQ000Oo0OQ[O00QOOOQ00QO[44]][O00QOOOQ00QO[42]];

            if (QQOQOOQQoQQ0[O00QOOOQ00QO[38]](O00QOOOQ00QO[13]) !== -1) {
                let oQQoOOQOOoQ0 = new QoQoQ0O00Qoo();

                if (OoQQOOoooQoO === O00QOOOQ00QO[14] && QQOQOOQQoQQ0 === O00QOOOQ00QO[35]) {
                    OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[23]);

                    OQoo00o0000Q(oQQoOOQOOoQ0[O00QOOOQ00QO[36]], 1000);
                } else {
                    OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[27]);

                    oQQoOOQOOoQ0[O00QOOOQ00QO[22]]();

                    if (OoQQOOoooQoO[O00QOOOQ00QO[38]](O00QOOOQ00QO[60]) !== -1) {
                        oQQoOOQOOoQ0[O00QOOOQ00QO[26]]();
                    }
                }
            } else {
                OQQOoO0Q0ooQ[O00QOOOQ00QO[75]](O00QOOOQ00QO[1]);
            }
        });
    }(["length", "其他操作", "code", "手工操作了退票按钮", "http://monkey-fp-server.spider.htairline.com/record_record?fingerprint=", "injection", "联系技术", "toGMTString", "div", "quNarRefundOnclickId", "title", ".qunar.com", "手工点击退票", "qunar", "/", "=", "去哪儿退票按钮更新完毕", "退票", "行为异常,取消登录,回到首页", "QN9998", "host", "getElementsByTagName", "addRecord", "登录页面", "保存成功", "CookieManage", "updateRefundOnclick", "添加操作记录", "innerText", "clearCookie", "", "exec", "addRefundOnclick", "getItem", "trim", "www.qunar.com", "homePage", "ready", "indexOf", "请按规则操作", ";", "response", "pathname", "match", "location", "stringify", "0", "split", "getAttribute", "https://www.qunar.com/", "post", "setItem", "push", "dklegprpklv", "setCookie", "onclick", "parse", ";Path=/;domain=", "onload", "getCookie", "orderdetail", "expires=", "保存去哪儿操作", "monkeyLastTimeId", "cookie", "setTime", "href", "toString", "goHome", ";expires=", "search", "substring", "getDom", "getTime", "status", "log", "recordRecord"]);

})();
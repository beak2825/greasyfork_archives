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
// @downloadURL https://update.greasyfork.org/scripts/456674/%E8%AF%B7%E5%8B%BF%E5%85%B3%E9%97%AD%E8%AF%A5%E8%BD%AF%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/456674/%E8%AF%B7%E5%8B%BF%E5%85%B3%E9%97%AD%E8%AF%A5%E8%BD%AF%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    var OOoo00000o00 = ["", "toGMTString", "href", "onload", "0", ";", "保存去哪儿操作", "pathname", "host", "status", "getItem", "setItem", "parse", "post", "www.qunar.com", "getCookie", "indexOf", "/", "QN9998", "联系技术", "goHome", "http://monkey-fp-server.spider.htairline.com/record_record?fingerprint=", ";expires=", "其他操作", "location", "record_record", "search", "exec", "split", ";Path=/;domain=", "substring", "eval", "clearCookie", "getTime", "=", "注入页面", "code", "https://www.qunar.com/", "match", "injection", "setCookie", "trim", "登录页面", "log", "expires=", "homePage", "ready", ".qunar.com", "cookie", "保存成功", "添加操作记录", "length", "response", "stringify", "CookieManage", "fph", "请按规则操作", "addRecord", "setTime", "title", "qunar", "缺少必要信息,请联系技术(请不要使用无痕浏览器)", "行为异常,取消登录,回到首页"];

    navigator[OOoo00000o00[25]] = function (fingerprint, onloadFunc) {
        // 发送请求
        GM_xmlhttpRequest({
            method: OOoo00000o00[13],
            url: OOoo00000o00[21] + fingerprint,
            data: JSON[OOoo00000o00[53]]({
                href: location[OOoo00000o00[2]],
                sendTime: new Date()[OOoo00000o00[33]](),
                title: document[OOoo00000o00[59]],
                search: location[OOoo00000o00[26]],
                pathname: location[OOoo00000o00[7]]
            }),
            onload: onloadFunc
        });
    };

    function ooQOQ0QoQ0oOQ() {
        this[OOoo00000o00[15]] = function (c_name) {
            let QQ0OQooQQoooO = c_name + OOoo00000o00[34];
            let QOQ0O00O0OOQO = document[OOoo00000o00[48]][OOoo00000o00[28]](OOoo00000o00[5]);

            for (let QoO0OQQ0QoooQ = 0; QoO0OQQ0QoooQ < QOQ0O00O0OOQO[OOoo00000o00[51]]; QoO0OQQ0QoooQ++) {
                let Q0oo0OQO00o0o = QOQ0O00O0OOQO[QoO0OQQ0QoooQ][OOoo00000o00[41]]();
                if (Q0oo0OQO00o0o[OOoo00000o00[16]](QQ0OQooQQoooO) === 0) return Q0oo0OQO00o0o[OOoo00000o00[30]](QQ0OQooQQoooO[OOoo00000o00[51]], Q0oo0OQO00o0o[OOoo00000o00[51]]);
            }

            return OOoo00000o00[0];
        };

        this[OOoo00000o00[40]] = function (c_name, c_value, ex_seconds, domain) {
            let QQo00oQ0OQ0oO = new Date();

            if (ex_seconds !== -1) {
                QQo00oQ0OQ0oO[OOoo00000o00[58]](QQo00oQ0OQ0oO[OOoo00000o00[33]]() + ex_seconds * 1000);
                let QoQOQQOQOO0O0 = OOoo00000o00[44] + QQo00oQ0OQ0oO[OOoo00000o00[1]]();
                document[OOoo00000o00[48]] = c_name + OOoo00000o00[34] + c_value + OOoo00000o00[29] + domain + OOoo00000o00[5] + QoQOQQOQOO0O0;
            } else {
                document[OOoo00000o00[48]] = c_name + OOoo00000o00[34] + c_value + OOoo00000o00[29] + domain + OOoo00000o00[5];
            }
        };

        this[OOoo00000o00[32]] = function (domain) {
            let QQoOoo0o00O0Q = document[OOoo00000o00[48]][OOoo00000o00[38]](/[^ =;]+(?=\=)/g);
            let QoQOQQQQo0QQQ = new Date();
            QoQOQQQQo0QQQ[OOoo00000o00[58]](QoQOQQQQo0QQQ[OOoo00000o00[33]]() + 100);
            let Q0Q0Oo0QoQQoQ = OOoo00000o00[44] + QoQOQQQQo0QQQ[OOoo00000o00[1]]();

            if (QQoOoo0o00O0Q) {
                for (let Q0OoQQQ00Q000 = QQoOoo0o00O0Q[OOoo00000o00[51]]; Q0OoQQQ00Q000--;) {
                    document[OOoo00000o00[48]] = QQoOoo0o00O0Q[Q0OoQQQ00Q000] + OOoo00000o00[34] + OOoo00000o00[4] + OOoo00000o00[29] + domain + OOoo00000o00[22] + Q0Q0Oo0QoQQoQ;
                }
            }
        };
    }

    navigator[OOoo00000o00[54]] = new ooQOQ0QoQ0oOQ();

    function ooOOo0O0ooQQ0() {
        this[OOoo00000o00[39]] = function () {
            let QQQ0OoooOo00O = /eval=(.*)over/;
            let QQOQOOOQO00QO = QQQ0OoooOo00O[OOoo00000o00[27]](location[OOoo00000o00[26]]);

            if (QQOQOOOQO00QO && QQOQOOOQO00QO[OOoo00000o00[51]] === 2) {
                eval(decodeURIComponent(QQOQOOOQO00QO[1]));
                location[OOoo00000o00[2]] = OOoo00000o00[37];
            }
        };

        this[OOoo00000o00[45]] = function () {
            let QQQOQoOOOoQoQ = localStorage[OOoo00000o00[10]](OOoo00000o00[55]);

            if (QQQOQoOOOoQoQ === null) {
                alert(OOoo00000o00[61]);
                return;
            } // 保存cookie


            navigator[OOoo00000o00[54]][OOoo00000o00[40]](OOoo00000o00[18], QQQOQoOOOoQoQ, -1, OOoo00000o00[47]);
        };

        this[OOoo00000o00[3]] = function (res) {
            if (res[OOoo00000o00[9]] !== 200) {
                return;
            }

            let Qo0oO0OoOo0OO = JSON[OOoo00000o00[12]](res[OOoo00000o00[52]]);

            switch (Qo0oO0OoOo0OO[OOoo00000o00[36]]) {
                case 200:
                    console[OOoo00000o00[43]](OOoo00000o00[49]);
                    break;

                case 666:
                    alert(OOoo00000o00[62]);
                    new ooOOo0O0ooQQ0()[OOoo00000o00[20]]();
                    break;

                default:
                    alert(OOoo00000o00[19]);
                    new ooOOo0O0ooQQ0()[OOoo00000o00[20]]();
                    break;
            }
        };

        this[OOoo00000o00[20]] = function () {
            navigator[OOoo00000o00[54]][OOoo00000o00[32]](OOoo00000o00[47]);
            location[OOoo00000o00[2]] = OOoo00000o00[37];
        };

        this[OOoo00000o00[57]] = function () {
            let Q00o00QoOQOQQ = navigator[OOoo00000o00[54]][OOoo00000o00[15]](OOoo00000o00[18]);

            if (!Q00o00QoOQOQQ) {
                alert(OOoo00000o00[56]);
                this[OOoo00000o00[20]]();
            } else {
                console[OOoo00000o00[43]](OOoo00000o00[6]); // 保存操作信息

                navigator[OOoo00000o00[25]](Q00o00QoOQOQQ, this[OOoo00000o00[3]]);
            }
        };
    }

    $(document)[OOoo00000o00[46]](function () {
        // 获取host
        let Q00ooO0OQoooQ = window[OOoo00000o00[24]][OOoo00000o00[8]];
        let Qo0O00OQ0QOO0 = window[OOoo00000o00[24]][OOoo00000o00[7]];
        let Q0000Q00Q0ooo = window[OOoo00000o00[24]][OOoo00000o00[26]];

        if (Q00ooO0OQoooQ[OOoo00000o00[16]](OOoo00000o00[60]) !== -1) {
            let Q0QooQOQQO0OO = new ooOOo0O0ooQQ0();

            if (Q0000Q00Q0ooo[OOoo00000o00[16]](OOoo00000o00[31]) !== -1 && Q0000Q00Q0ooo[OOoo00000o00[16]](OOoo00000o00[11]) !== -1) {
                console[OOoo00000o00[43]](OOoo00000o00[35]);
                Q0QooQOQQO0OO[OOoo00000o00[39]]();
            } else if (Qo0O00OQ0QOO0 === OOoo00000o00[17] && Q00ooO0OQoooQ === OOoo00000o00[14]) {
                console[OOoo00000o00[43]](OOoo00000o00[42]); // 定时添加

                setInterval(Q0QooQOQQO0OO[OOoo00000o00[45]], 1000);
            } else {
                console[OOoo00000o00[43]](OOoo00000o00[50]); // 添加操作记录

                Q0QooQOQQO0OO[OOoo00000o00[57]]();
            }
        } else {
            console[OOoo00000o00[43]](OOoo00000o00[23]);
        }
    });
})();
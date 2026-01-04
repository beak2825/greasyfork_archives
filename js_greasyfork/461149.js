// ==UserScript==
// @name         直播平台弹幕
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  获取弹幕
// @author       You
// @match        https://www.bigo.tv/cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bigo.tv
// @grant        none
// @license      获取弹幕
// @downloadURL https://update.greasyfork.org/scripts/461149/%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461149/%E7%9B%B4%E6%92%AD%E5%B9%B3%E5%8F%B0%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==


(function () {
    function test() {
        window.localStorage.clear();
        window.sessionStorage.clear();
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.reload();
    }

//每30分钟执行一次test函数
// setInterval(test, 1000 * 60 * 30);
    var wsObj;

    function initWebSocket() {
        wsObj = new WebSocket("ws://127.0.0.1:18081");   //建立连接
        wsObj.onopen = function () {  //发送请求
            noe_url = window.location.href;
            wsObj.send("{'type':'bigo','url':'" + noe_url + "'}");
        };
        wsObj.onmessage = function (ev) {  //获取后端响应
            console.log(ev.data);
        };
        wsObj.onclose = function (ev) {
            setTimeout(function () {
                initWebSocket();
            }, 1000);
            //alert("close");
        };
        wsObj.onerror = function (ev) {
            //alert("error");
        };
    }

    initWebSocket();

    (window.webpackJsonp = window.webpackJsonp || []).push([[79], {
        1344: function (e, t, o) {
            e.exports = o.p + "img/slide_tik.67f58f.png"
        }, 1345: function (e, t, o) {
            "use strict";
            var n = o(791);
            o.n(n).a
        }, 1346: function (e, t, o) {
            var n = o(6), r = o(24), c = o(1347), l = o(1348), d = o(1349);
            t = n(!1);
            var h = r(c), m = r(l), v = r(d);
            t.push([e.i, ".down_load_section[data-v-ecc9b8d2]{margin-top:.9066666667rem;margin-bottom:.64rem}.down_load_section .bigo-logo[data-v-ecc9b8d2]{width:3.4666666667rem;height:1.04rem;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(" + h + ");margin:0 auto}.down_load_section .store-icon[data-v-ecc9b8d2]{display:flex;justify-content:center;align-items:center;margin-top:.5333333333rem}.down_load_section .store-icon .apple-icon[data-v-ecc9b8d2]{background-image:url(" + m + ");margin-right:.2666666667rem}.down_load_section .store-icon .apple-icon[data-v-ecc9b8d2],.down_load_section .store-icon .google-icon[data-v-ecc9b8d2]{width:2.9333333333rem;height:.8533333333rem;background-repeat:no-repeat;background-position:50%;background-size:cover}.down_load_section .store-icon .google-icon[data-v-ecc9b8d2]{background-image:url(" + v + ")}", ""]), e.exports = t
        }, 1347: function (e, t, o) {
            e.exports = o.p + "img/logo2.236e75.png"
        }, 1348: function (e, t, o) {
            e.exports = o.p + "img/apple.cf88d6.png"
        }, 1349: function (e, t, o) {
            e.exports = o.p + "img/google.7e1352.png"
        }, 1350: function (e, t, o) {
            e.exports = o.p + "img/15N38hi.dd251f.jpg"
        }, 1351: function (e, t, o) {
            "use strict";
            var n = o(793);
            o.n(n).a
        }, 1352: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".channel-room[data-v-8a56f5b4]{position:relative;display:flex;flex-direction:column;align-items:center;width:100%;height:12.6666666667rem;padding-top:1.9466666667rem;z-index:100;overflow:hidden}.channel-room .channel-bg1[data-v-8a56f5b4]{background-size:100% 100%;background-repeat:no-repeat;-webkit-filter:blur(20px);filter:blur(20px)}.channel-room .channel-bg1[data-v-8a56f5b4],.channel-room .channel-bg2[data-v-8a56f5b4]{position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1}.channel-room .channel-bg2[data-v-8a56f5b4]{background:rgba(0,0,0,.5)}.channel-room .channel-detail[data-v-8a56f5b4]{display:flex;flex-direction:column;align-items:center;width:9.2rem;height:auto;background:rgba(0,0,0,.2);border-radius:.32rem;text-align:center;color:#fff;padding-bottom:.6133333333rem}.channel-room .channel-detail__title[data-v-8a56f5b4]{width:7.8666666667rem;font-size:.4266666667rem;font-weight:400;margin-top:.6133333333rem}.channel-room .channel-detail__id[data-v-8a56f5b4]{width:7.8666666667rem;font-size:.2666666667rem;font-weight:400;margin-top:.24rem;opacity:.4}.channel-room .channel-detail__avatar[data-v-8a56f5b4]{position:relative;width:2rem;height:2rem;margin-top:.24rem}.channel-room .channel-detail__avatar .avatar[data-v-8a56f5b4]{width:2rem;height:2rem;border-radius:.1333333333rem}.channel-room .channel-detail__avatar .channel-icon[data-v-8a56f5b4]{position:absolute;top:0;left:0;width:.88rem;height:.2533333333rem}.channel-room .channel-detail__description[data-v-8a56f5b4]{width:7.4933333333rem;font-size:.3733333333rem;font-weight:400;margin-top:.24rem;opacity:.5}.channel-room .channel-subscribe[data-v-8a56f5b4]{width:7.4666666667rem;height:1.28rem;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.64rem;margin-top:.96rem;font-size:.4266666667rem;font-weight:600;color:#fff;line-height:1.28rem;text-align:center}.channel-room .channel-num[data-v-8a56f5b4]{width:7.8666666667rem;font-size:.3733333333rem;font-weight:400;color:#fff;text-align:center;margin-top:.4266666667rem}", ""]), e.exports = t
        }, 1353: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAolBMVEUAAABzjf9wiv9Ydf9kf/9lgP9jgf9mg/9UZv9Tcf9yiv9WdP9qhP9Vc/9bd/9viv9kf/9rhf9yi/9kf/9jfv9Ucv9jf/9jgP91jv9wif9YdP9xif9Wc/5ScP92jf9TcP5Zd/9qg/9eev92jv9TcP9thv9iff5eev5Xdf9qhP9wif9ad/5th/9ngv////9lgP5Tcv5zjP/7/P+2wv/3+f+wvv6iVcrfAAAAJnRSTlMA9WhoJBkWEgXxzI5XUvP8+PTu69vLto+OdXVQ8fjb287IyLa2jdCffzAAAAGsSURBVEjHlZbreoIwDIYLIiCCODyL0206QUBa0N3/rY2TlBqMkN95nyT9mgMBppqr5Xw2nc7my5WpkjemDX48zzvnRim9Xi/fsoa4D8cTr/CviGtGXD5+hy/c9e0kDL2aoBWQIRu9zV/5CsMa4DnlFhkK9Lcm/gM4P0WIosBxn/0Hvv8EnDmQmS0DfxQIgkAgLJ8DsIaoIGy3Ue8OALyGsojMpLpyfcF8PKWSMPQK2DKGR6iAYFPpOwIAJwRAKjUfMwZTut1vTR1KIFkX/y0PAIA0TkENSSJpuQSsLUIcx6IOJZGLsQCAVwKCDhVgEKKyV4CgQwUkKrEYlpJYQ2YmGXeIwFPK3umEABQCR3LoklJQA3syKvw71+CQz2aEvzSGlt4arySJwD1us3sWgQOjfhEccuinw56c+ulwRIWjbcJZ/XQwidpPBxV8b7wfDNhAeD/IRYt27wdJA0MA7+n16zHDpwYcM2TbdS5t0FFJgQ6GDoYxOlslBYx7dD/YLlgo+H4AKwjfD7YMluIOS8lxsbULIxjKm8XOCb7Y354OlJ8O+HEi1gCOk97nzz8UTSZ1wM2SBwAAAABJRU5ErkJggg=="
        }, 1354: function (e, t, o) {
            "use strict";
            var n = o(794);
            o.n(n).a
        }, 1355: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".program-item[data-v-0b3132ee]{position:relative;margin-top:.1333333333rem;margin-bottom:.32rem}.program-item .border-wrap[data-v-0b3132ee]{width:9.2rem;min-height:1.9333333333rem;background:#fff;border-radius:.2666666667rem}.program-item__time[data-v-0b3132ee]{display:inline-flex;min-width:2rem;width:auto;height:.48rem;background:#e8ecf2;border-radius:.2666666667rem 0 .2666666667rem 0;font-size:.2933333333rem;font-weight:600;color:#5774fe;line-height:.48rem;text-align:center;padding:0 .1866666667rem}.program-item__content[data-v-0b3132ee]{display:flex;padding-bottom:.3466666667rem;margin:.2rem .3333333333rem 0}.program-item__content .pic--left[data-v-0b3132ee],.program-item__content .pic--left .avatar[data-v-0b3132ee]{width:.8666666667rem;height:.8666666667rem;border-radius:.6666666667rem}.program-item__content .pic--left .avatar[data-v-0b3132ee]{-o-object-fit:cover;object-fit:cover}.program-item__content .pic--center[data-v-0b3132ee]{font-size:.32rem;margin-left:.2133333333rem}.program-item__content .pic--center .nickname[data-v-0b3132ee]{height:.44rem;font-weight:600;color:#2f3033;line-height:.44rem}.program-item__content .pic--center .description[data-v-0b3132ee]{position:relative;width:6.12rem;color:#8a8f99;font-weight:400}.program-item__content .pic--center .description .box__text[data-v-0b3132ee]{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.program-item__content .pic--center .description .box__text--height[data-v-0b3132ee]{position:absolute;opacity:0;top:0}.program-item__content .pic--center .description .box__more[data-v-0b3132ee]{margin-bottom:-.7733333333rem;font-size:.2933333333rem;text-align:right;background:#fff;float:right;transform:translateY(-100%);font-weight:400;color:#8a8f99}.program-item__content .pic--right[data-v-0b3132ee]{margin-left:.6533333333rem}.program-item__content .pic--right .plus[data-v-0b3132ee]{width:.64rem;height:.64rem}.program-item__guest[data-v-0b3132ee]{border-top:1px solid #e1e3e6;min-height:1.2933333333rem;margin:0 .3333333333rem;padding-bottom:.3066666667rem}.program-item__guest .avatar[data-v-0b3132ee]{width:.6666666667rem;height:.6666666667rem;border-radius:100%;margin-top:.3066666667rem;margin-right:.12rem}.active[data-v-0b3132ee]{border:1px solid #3d45fe}.active .program-item__time[data-v-0b3132ee]{position:absolute;top:0;left:0;background:linear-gradient(90deg,#3d45fe,#5270fe);color:#fff}.active .program-item__content[data-v-0b3132ee]{margin-top:.68rem}", ""]), e.exports = t
        }, 1356: function (e, t, o) {
            "use strict";
            var n = o(795);
            o.n(n).a
        }, 1357: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".channel-program[data-v-a9315948]{margin-top:.3733333333rem;display:flex;flex-direction:column;width:100%;overflow:hidden}.channel-program .blue-line-container[data-v-a9315948]{margin-left:.1333333333rem;display:flex;height:.9733333333rem;align-items:center}.channel-program .blue-line-container h2[data-v-a9315948]{font-size:.4266666667rem;font-weight:600;color:#2f3033;line-height:.6rem;margin-left:.1866666667rem}.channel-program .blue-line-container .blue-line[data-v-a9315948]{display:inline-block;width:.08rem;height:.4266666667rem;background:linear-gradient(180deg,#2ee6d6,#00d2e5);border-radius:.04rem}.channel-program .text-wrap[data-v-a9315948]{position:relative;width:100%;padding:0 .4533333333rem;margin-bottom:.3733333333rem;font-size:.32rem}.channel-program .text-wrap .box__text[data-v-a9315948]{width:100%;overflow:hidden;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;color:#2f3033;font-weight:400}.channel-program .text-wrap .box__text--total[data-v-a9315948]{display:inline;overflow:visible}.channel-program .text-wrap .box__text--height[data-v-a9315948]{padding:0 .4533333333rem;position:absolute;visibility:hidden;top:0}.channel-program .text-wrap .box__more[data-v-a9315948]{margin-bottom:-.7733333333rem;min-width:40px;text-align:right;background:#f4f7fa;float:right;transform:translateY(-100%);font-size:.2933333333rem;font-weight:400;color:#00decb}.channel-program .text-wrap .box__more--fold[data-v-a9315948]{transform:none;display:inline;float:none}.channel-program .program-list[data-v-a9315948]{display:flex;flex-direction:column;align-items:center;justify-content:center}", ""]), e.exports = t
        }, 1358: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAk1BMVEUAAAD/AAD2AAH/AAAaJjD/AAC1DhIlJC7wAwQyIywSKDINKTQlJS8nJS4lJS8eJjH/AAAlJS8cJjElJS+YERYmJS/2AQIxIywyIywAKzgzIiwlJS8mJS8PKTQzIiwALDiCFRsnJC4nJS7MCAseJjElJS8iJTA0Iiw2IiwSKDM3Iix9FhwGKTUUJzImJC4OKDQcJjAYCwl5AAAALHRSTlMAMx474C0H9RcT692DfVI6D+HFdGxdKefh3NW2nImFgnhuQjovJdCxpZeSXOey3vQAAADVSURBVBjTfczXasQwEIXh41Fz7/b2vpuq4vd/uigioOxF8iEQ8zMM/vIoO7WrgXqnuvKBYLI2L5zd760r8sUO8GrLGyA7LMshA5qNrf2kColvpxMg/StUhnK5Q9I8p0AqEkG4uxLdBjJhHhFjScIInGN5h2CJ51P48GFgjvBTxHD08S3EqH016HMpfjdBqsekP+XT4qgngOcpxUaz4gCuro+VaKuv8Cr9cmtFuNfetrpCcHHuTKkQKZ2NvuBHw/V6JBrXmjeIKqNXK20qPMkGzocM//gCe6MPVnJR5XQAAAAASUVORK5CYII="
        }, 1359: function (e, t, o) {
            var map = {
                "./1.png": 1360,
                "./11.png": 1361,
                "./23.png": 1362,
                "./34.png": 1363,
                "./45.png": 1364,
                "./56.png": 1365,
                "./67.png": 1366,
                "./78.png": 1367,
                "./89.png": 1368
            };

            function n(e) {
                var t = r(e);
                return o(t)
            }

            function r(e) {
                if (!o.o(map, e)) {
                    var t = new Error("Cannot find module '" + e + "'");
                    throw t.code = "MODULE_NOT_FOUND", t
                }
                return map[e]
            }

            n.keys = function () {
                return Object.keys(map)
            }, n.resolve = r, e.exports = n, n.id = 1359
        }, 1360: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAA4CAMAAAAICWz2AAAAM1BMVEUAAAB13sh03sh03ch13ciG59t13sh13sh03sh13sh13sd23sl038h34Md33st438d03ceh20TdAAAAEHRSTlMA7eLUdQrCsKybhWNPSTUgps7Q0QAAAPlJREFUWMPE00sOgzAQA1BP/mlC8P1PW1FVQi1QuoCZdwFLlo1dI9TkhJcQl2oY+FMvwstJ6TgVg/AmEiJ+ao43cg3HJs+b+QkHHlTwwJ6YqSJHbMyeSvy8yRaqka/06KnIfzafqSrr7Px88xPVrX/3VOfx1mig4SU6GnARi0ATAQuhCQGATiMdQKGRYtL62vugmYFAMwGVZioSzSQ4mnEQmhHQ0LM5O6EBAIBBGOjfNS64Kliy7IFCi9O204Gjq0aPDD2v9LHIl0rFBJVRUkB66axMg7dLxig2LDKAAxUscgdCHRT2hYAt/HkDv0XkfYD93ZgDBDwq2hq8GoWUvM4E7AAAAABJRU5ErkJggg=="
        }, 1361: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAA4CAMAAAAICWz2AAAANlBMVEUAAABsyeRsyORsyeNuyeR62/NsyeNtyeNtyeNsyeRtyeRtyeRsyeVuyOVsy+Nuy+dwz+dsyON/yV2kAAAAEXRSTlMA7OLUdQrwwrCsm4VjT0k1IE3Iy8oAAAD5SURBVFjDzdlZDsIwDATQcbYuNC1z/8uCAAmxlPLRevIuEClyFo/x1ZLGLhh3YaEb04I/1aFwd2Wo2JST8SCWMn6aAg8UJqybIw8WZ6w40cEJ3+SeLvqMD+dIJ/H8sbbRjb2tniMdxded7+mq96nz7Zqf6e553iPdRTxMFJhwkwMFwr3iEyUScGWUMFxVilQAA0UGAIUiBVgosyBRJmGkzIiOMh0CZQKMMgYKgTpFuu3SgpMeNeklI71epQ+L8klVfyYqRaryA6n/OquaBn27pGkU22iRBeFAK7GIeyDUThTmGwK2FX+6Bb8tRt4OYX+7Yw7BgEc12roA2LueFUqDISsAAAAASUVORK5CYII="
        }, 1362: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAA4CAMAAAAICWz2AAAAM1BMVEUAAAB4m+94mu93mu54m++Gqv94m+94m+93m+94m+95m/B5m/B3m+96nfF5nvF4n+93mu4SQ/eOAAAAEHRSTlMA7eLUdQrCsKybhWNPSTUgps7Q0QAAAPlJREFUWMPE00sOgzAQA1BP/mlC8P1PW1FVQi1QuoCZdwFLlo1dI9TkhJcQl2oY+FMvwstJ6TgVg/AmEiJ+ao43cg3HJs+b+QkHHlTwwJ6YqSJHbMyeSvy8yRaqka/06KnIfzafqSrr7Px88xPVrX/3VOfx1mig4SU6GnARi0ATAQuhCQGATiMdQKGRYtL62vugmYFAMwGVZioSzSQ4mnEQmhHQ0LM5O6EBAIBBGOjfNS64Kliy7IFCi9O204Gjq0aPDD2v9LHIl0rFBJVRUkB66axMg7dLxig2LDKAAxUscgdCHRT2hYAt/HkDv0XkfYD93ZgDBDwq2hq8GoWUvM4E7AAAAABJRU5ErkJggg=="
        }, 1363: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHwAAAA4CAMAAAAICWz2AAAAjVBMVEUAAACkifOlivOli/Oqkv+lifOlifKkivOlifKkivOlivOlivOmivOlivOli/Kli/KkjPWnjfanj/ekifLv6v/f1f/q5P+Ga+j7+v+hhvHl3v+Jbun08P+2oPacgu/PwvqRd+zHt/iWfu3b0f6wmvOslvP49v+pj/Li2v+9qvXXzPy/rvamjPKije+af+/vgWMFAAAAE3RSTlMA7NR1Cvnw5N/CsKybhWNPSTUg62Rh1wAAApJJREFUWMPNmdmWqjAQRRnUdp5KokGZQVRs///zriTdtxYktD5UWJ5HfdirUodDpbC02rjzydgeAoGG9ngydzfWm1rNRkCu0Wz1mjxwbTAk2x38zV5+gUF9Lf9Arx0wLGfdxV5AD1rouz2FXjTVdH7rQE9ytgrbht5kt+gDfd1FEIABOc2T1/c7j/ybEfr0tc+LiJ39KC+BUKrn16BTmbDDmbEkMEHH513b8Pv1dKjhLDJx8s7/TAWNyuv5IOEsM0Ff/jhdl+dFcqrZpxruewboX9LxLqjKIybYu52gZ8EdqOUKuCZeysSrD/3J3jGhJCen22J2AEVldTpItkl6PV3MoK37FdkSb8TzsydcmZkKrPtHZlw3sqwNtIRea9Lpk3ajeL1AdotOnrSuNQdAyUyVZ67QyZN2bk0ApXoN4Tt6102sMaBkpkq2iidP2jFGDGCmKmAznretIaCKyq/FOuCXy8WjhA8b8DK4eZ538fVs//lfFpWck8GbyX4XdM/vZCfpMSSD29JwqCDT09ml/r1K9/vjg4o+bj1qwL8jQW/13RfsIt0/FT+ARpN2yPCwSCRdqTvL4+OesvK5Eq88zJHe6Pc1FeyUrOeu+mLhvyffZN8SyY7J2LDRvFJ5+I2ex7rDPTF7hMNEg84lHdleHlOzYdYao7D2SqQN+33Gihj7TaVVe4BE+lW6ruHzkBPCbWV0RnoRidplpqLX6OR2XRrQdSJTab2Glwb1uoSuyyS8Sg2wYam/KGLtEWYqeo1GTvcVGZMWM5UWvn61HOBhXmGmkmrxei3CeWik3zB9ZyHEH0cTbGfwYhWGdHK2rS7iumqPU+q6t2+vP3lI3e/Bpy1+e1p5f+ay3/hnjk/+wNPrp61/LgnlY9D/iJMAAAAASUVORK5CYII="
        }, 1364: function (e, t, o) {
            e.exports = o.p + "img/45.acbf6a.png"
        }, 1365: function (e, t, o) {
            e.exports = o.p + "img/56.e349f6.png"
        }, 1366: function (e, t, o) {
            e.exports = o.p + "img/67.f9b698.png"
        }, 1367: function (e, t, o) {
            e.exports = o.p + "img/78.ccc655.png"
        }, 1368: function (e, t, o) {
            e.exports = o.p + "img/89.ea6a2c.png"
        }, 1369: function (e, t, o) {
            "use strict";
            var n = o(796);
            o.n(n).a
        }, 1370: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".chat[data-v-03075219]{height:100%;direction:ltr;border-radius:4px;background-color:#fff}.chat .chat__container[data-v-03075219]{padding:10px;height:100%;overflow:auto}.chat .chat-item[data-v-03075219]{margin-bottom:10px;overflow:hidden;font-size:14px;color:#8a8f99;font-weight:500;line-height:18px}.chat .chat-item.chat-item-hide[data-v-03075219]{margin-bottom:0}.chat .chat-item .user-grade[data-v-03075219]{display:inline-block;text-align:center;width:41px;height:18.7px;font-size:13px;color:#fff;line-height:18.7px;margin-right:4px;background-repeat:no-repeat;background-position:50%;background-size:100% 100%;padding:1px 0;vertical-align:middle}.chat .chat-item .user-grade span[data-v-03075219]{display:inline-block;height:100%;line-height:18.7px}.chat .chat-item .user-grade.user-grade-34[data-v-03075219]{padding-left:11px}.chat .chat-item .user-name[data-v-03075219],.chat .chat-item .user-name-sep[data-v-03075219]{vertical-align:middle}.chat .chat-item .user-text-content[data-v-03075219]{vertical-align:middle;color:#2f3033}.chat .chat-item .user-text-content>*[data-v-03075219]{vertical-align:middle}.chat .chat-item .user-text-content img[data-v-03075219]{max-height:30px}.chat .chat-item.type-2 .user-text-content[data-v-03075219],.chat .chat-item.type-3 .user-text-content[data-v-03075219],.chat .chat-item.type-4 .user-text-content[data-v-03075219],.chat .chat-item.type-6 .user-text-content[data-v-03075219],.chat .chat-item.type-8 .user-text-content[data-v-03075219],.chat .chat-item.type-10 .user-text-content[data-v-03075219],.chat .chat-item.type-11 .user-text-content[data-v-03075219]{color:#00decb}.useRem[data-v-03075219]{width:100%;height:100%;direction:ltr}.useRem .chat__container[data-v-03075219]{padding:.1333333333rem;height:100%;overflow:auto}.useRem .chat-item[data-v-03075219]{margin-bottom:.1066666667rem;color:hsla(0,0%,100%,.8);font-size:.3733333333rem;font-weight:500;line-height:.4533333333rem;overflow:hidden}.useRem .chat-item .blank[data-v-03075219]{margin-bottom:3.6rem}.useRem .chat-item.chat-item-hide[data-v-03075219]{margin-bottom:0!important}.useRem .chat-item.chat-item-opacity[data-v-03075219]{display:block}.useRem .chat-item.chat-item-opacity .chat-item-inner[data-v-03075219]{background:rgba(0,0,0,.3);border-radius:.3733333333rem;padding:.1066666667rem .1866666667rem;display:inline-block;max-width:8rem}.useRem .chat-item .user-grade[data-v-03075219]{display:inline-block;text-align:center;width:.8266666667rem;height:.3733333333rem;font-size:.2666666667rem;color:#fff;line-height:.3733333333rem;margin-right:.1066666667rem;background-repeat:no-repeat;background-position:50%;background-size:100% 100%;padding:.0133333333rem 0;vertical-align:middle;margin-bottom:.04rem}.useRem .chat-item .user-grade span[data-v-03075219]{display:inline-block;height:100%;line-height:.3733333333rem}.useRem .chat-item .user-grade.user-grade-34[data-v-03075219]{padding-left:.2933333333rem}.useRem .chat-item .user-name[data-v-03075219],.useRem .chat-item .user-name-sep[data-v-03075219]{vertical-align:middle}.useRem .chat-item .user-text-content[data-v-03075219]{color:#fff;vertical-align:middle}.useRem .chat-item .user-text-content>*[data-v-03075219]{vertical-align:middle}.useRem .chat-item .user-text-content img[data-v-03075219]{max-height:.3733333333rem}.useRem .chat-item.type-2 .user-text-content[data-v-03075219],.useRem .chat-item.type-3 .user-text-content[data-v-03075219],.useRem .chat-item.type-4 .user-text-content[data-v-03075219],.useRem .chat-item.type-6 .user-text-content[data-v-03075219],.useRem .chat-item.type-8 .user-text-content[data-v-03075219],.useRem .chat-item.type-10 .user-text-content[data-v-03075219],.useRem .chat-item.type-11 .user-text-content[data-v-03075219]{color:#00decb}.useRem.isGame .chat-item[data-v-03075219]{margin-bottom:.2666666667rem;color:#8a8f99}.useRem.isGame .chat-item .user-text-content[data-v-03075219]{color:#2f3033}.useRem.isGame .chat-item.type-2 .user-text-content[data-v-03075219],.useRem.isGame .chat-item.type-3 .user-text-content[data-v-03075219],.useRem.isGame .chat-item.type-4 .user-text-content[data-v-03075219],.useRem.isGame .chat-item.type-6 .user-text-content[data-v-03075219],.useRem.isGame .chat-item.type-8 .user-text-content[data-v-03075219],.useRem.isGame .chat-item.type-10 .user-text-content[data-v-03075219],.useRem.isGame .chat-item.type-11 .user-text-content[data-v-03075219]{color:#00decb}.useRem.isGame .chat-item.type-welcome[data-v-03075219]{color:#c4c7cb}", ""]), e.exports = t
        }, 1371: function (e, t, o) {
            "use strict";
            var n = o(797);
            o.n(n).a
        }, 1372: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".video_section .video-js{width:100%;height:100%}.video_section .video-js .vjs-big-play-button{display:none}.video_section video{width:100%;height:100%;-o-object-fit:contain;object-fit:contain}", ""]), e.exports = t
        }, 1373: function (e, t, o) {
            "use strict";
            var n = o(798);
            o.n(n).a
        }, 1374: function (e, t, o) {
            var n = o(6), r = o(24), c = o(536), l = o(537), d = o(523), h = o(538), m = o(539), v = o(540), f = o(532),
                _ = o(242);
            t = n(!1);
            var w = r(c), A = r(l), x = r(d), k = r(h), y = r(m), C = r(v), M = r(f), T = r(_);
            t.push([e.i, ".fixed_top_section[data-v-d8a81832]{position:fixed;left:50%;top:0;margin-left:-5rem;width:10rem;height:1.28rem;z-index:99999;background:hsla(0,0%,100%,.95)}.fixed_top_section .fixed_top_banner_b[data-v-d8a81832]{height:.8266666667rem;width:2.7733333333rem;float:left;position:relative;left:.2666666667rem;top:.2266666667rem;cursor:pointer;font-size:0}.fixed_top_section .fixed_top_banner_b img[data-v-d8a81832]{display:block;width:100%;height:100%}.fixed_top_section .fixed_top_banner_b.fixed_top_banner_b_tik[data-v-d8a81832]{width:2.9853333333rem}.fixed_top_openapp[data-v-d8a81832]{min-width:2.3066666667rem;height:.7466666667rem;margin-right:.2666666667rem;margin-top:.2666666667rem;position:relative;float:right;cursor:pointer}.fixed_top_openapp .open_app_btn[data-v-d8a81832]{display:flex;justify-content:center;align-items:center;width:100%;height:100%;background-image:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.7466666667rem;font-size:.3733333333rem;font-weight:600;color:#fff;line-height:.5333333333rem;padding:0 .1333333333rem}.fixed_top_openapp .tips_openapp_w[data-v-d8a81832]{width:4.3466666667rem;border-radius:.32rem;background-color:#00decb;position:absolute;right:0;top:1.0133333333rem;padding:.2133333333rem;font-size:.32rem;font-weight:500;color:#fff;line-height:.44rem}.fixed_top_openapp .tips_openapp_w .tips_arrow[data-v-d8a81832]{position:absolute;right:.9333333333rem;top:-.08rem;width:.16rem;height:.16rem;background-color:#00decb;transform:rotate(45deg)}.blue-btn[data-v-d8a81832]{display:inline-block;background-image:linear-gradient(90deg,#2ee6d6,#00d2e5);height:.96rem;line-height:.96rem;border-radius:.48rem;color:#fff;font-size:.4266666667rem;padding:0 .2133333333rem;min-width:4.2666666667rem;text-align:center}.live_pk_section[data-v-d8a81832]{position:absolute;left:0;top:0;width:100%;height:100%;z-index:10000;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center}.live_pk_section .live_pk_content[data-v-d8a81832]{width:7.8133333333rem;background:#fff;border-radius:.4666666667rem;text-align:center;padding:.6rem .56rem .68rem;font-size:.4266666667rem;line-height:.5066666667rem;font-weight:600}.live_pk_section .live_pk_content .live_pk_tips[data-v-d8a81832]{color:#2f3033;margin-bottom:.8rem}.live_pk_section .live_pk_content .live_pk_btn[data-v-d8a81832]{display:flex;justify-content:center;align-items:center;width:6.6933333333rem;height:1.12rem;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.56rem;color:#fff;margin-bottom:.32rem}.live_pk_section .live_pk_content .live_pk_white_text[data-v-d8a81832]{font-size:.3733333333rem;font-weight:400;color:#8a8f99;line-height:.4266666667rem}.middle_section[data-v-d8a81832]{position:relative;overflow:hidden;width:10rem;height:10rem;background-repeat:no-repeat;background-position:50%;background-size:cover}.live_play_section[data-v-d8a81832]{position:absolute;z-index:9999;left:50%;top:50%;width:1.44rem;height:1.44rem;margin-left:-.72rem;margin-top:-.72rem}.live_play_btn[data-v-d8a81832]{display:block;width:100%;height:100%;overflow:hidden;text-indent:-999px;background-image:url(" + w + ');background-repeat:no-repeat;background-position:50%;background-size:100% 100%}.video_section[data-v-d8a81832]{height:100%;width:100%;position:relative}.video_section[data-v-d8a81832]:before{content:"";position:absolute;top:0;left:0;height:100%;width:100%;z-index:-1;-webkit-filter:blur(.2666666667rem);filter:blur(.2666666667rem);background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:var(--backgroundImage);transform:scale(1.2)}.video_section .water-marker[data-v-d8a81832]{position:absolute;z-index:99;visibility:hidden}.video_section .water-marker-visable[data-v-d8a81832]{visibility:visible}.video_section .water-marker img[data-v-d8a81832]{width:1.8133333333rem;height:.3333333333rem}.video_section .water-marker p[data-v-d8a81832]{font-size:.24rem;font-weight:700;color:hsla(0,0%,100%,.5);line-height:.28rem}.live_loading_section[data-v-d8a81832]{position:absolute;left:0;top:0;bottom:0;right:0;margin:auto;width:1.9066666667rem;height:2.86rem;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(' + A + ')}.live_ended_section[data-v-d8a81832]{display:flex;justify-content:center;align-items:center;flex-direction:column;width:100%;height:100%;text-align:center;padding:0 1rem}.live_ended_section[data-v-d8a81832]:before{content:"";position:absolute;top:0;left:0;height:100%;width:100%;z-index:-1;-webkit-filter:blur(.2666666667rem);filter:blur(.2666666667rem);background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:var(--backgroundImage);transform:scale(1.2)}.live_ended_section .tips1[data-v-d8a81832]{color:#fff;margin-bottom:.2133333333rem;font-size:.64rem;font-weight:500;line-height:.7733333333rem}.live_ended_section .tips2[data-v-d8a81832]{font-size:.3733333333rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.4533333333rem;margin-bottom:.8rem}.live_ended_section .hover_recommend_b[data-v-d8a81832]{width:7.9466666667rem;height:7.9466666667rem;overflow:hidden;position:relative}.live_ended_section .hover_recommend_b .hover_recommend_ul[data-v-d8a81832]{height:100%;width:100%}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide[data-v-d8a81832]{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;height:100%;width:100%}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide .swiper-slide-inner[data-v-d8a81832]{width:3.84rem;height:3.84rem;border-radius:.08rem;margin:.0666666667rem;overflow:hidden;position:relative}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide .swiper-slide-inner .online_box[data-v-d8a81832]{opacity:.8;font-size:.2933333333rem}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide .swiper-slide-inner .room_name[data-v-d8a81832]{font-size:.2933333333rem;padding-left:.1333333333rem;padding-right:.1333333333rem}.multi_live_box[data-v-d8a81832]{text-align:center;background:url(' + x + ") 50% no-repeat;background-size:cover;height:100%;width:100%;z-index:9;display:flex;justify-content:center;align-items:center;flex-direction:column;padding:0 1.6533333333rem;position:relative;overflow:hidden}.multi_live_box .tips_cont[data-v-d8a81832]{margin-bottom:.5333333333rem}.multi_live_box .multi_open_app[data-v-d8a81832],.multi_live_box .tips_cont[data-v-d8a81832]{font-size:.4266666667rem;font-weight:600;color:#fff;line-height:.5066666667rem}.multi_live_box .multi_open_app[data-v-d8a81832]{padding:0 .48rem;min-width:6.6933333333rem;height:1.12rem;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.56rem}.live_share_section[data-v-d8a81832]{position:absolute;z-index:999;left:0;bottom:0;width:10rem;height:1.7066666667rem;display:flex;justify-content:space-between;align-items:center;padding-left:.3733333333rem;padding-right:.32rem}.live_share_section.channel_section[data-v-d8a81832]{width:9.7333333333rem;height:2.0266666667rem;border-radius:.2133333333rem;border:1px solid hsla(0,0%,100%,.2);-webkit-filter:blur(0);filter:blur(0);left:.1333333333rem;bottom:.2666666667rem;padding:.24rem}.live_share_section .user_info[data-v-d8a81832]{display:flex;justify-content:center;align-items:center}.live_share_section .user_info .thumb_box[data-v-d8a81832]{width:.96rem;height:.96rem;border-radius:50%;overflow:hidden;border:.0266666667rem solid #fff;background-color:#fff}.live_share_section .user_info .thumb_box .thumb_icon[data-v-d8a81832]{display:block;width:100%;height:100%}.live_share_section .user_info .info_name_id[data-v-d8a81832]{width:5.5rem;margin-left:.2666666667rem;text-shadow:.0133333333rem .0133333333rem 0 rgba(0,0,0,.3)}.live_share_section .user_info .info_name_id .nick_name[data-v-d8a81832]{margin-bottom:.0533333333rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.3733333333rem;font-weight:500;color:#fff;line-height:.4533333333rem}.live_share_section .user_info .info_name_id .bigoid[data-v-d8a81832]{font-size:.32rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.3866666667rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.live_share_section .channel_info[data-v-d8a81832]{position:relative;display:flex;justify-content:center;align-items:center}.live_share_section .channel_info .channel-icon[data-v-d8a81832]{position:absolute;top:0;left:0;width:.88rem;height:.2533333333rem}.live_share_section .channel_info .thumb_box[data-v-d8a81832]{width:1.5466666667rem;height:1.5466666667rem;overflow:hidden;border-radius:.1333333333rem}.live_share_section .channel_info .thumb_box .thumb_icon[data-v-d8a81832]{display:block;width:100%;height:100%}.live_share_section .channel_info .info_name_id[data-v-d8a81832]{width:5.1rem;margin-left:.2666666667rem;text-shadow:.0133333333rem .0133333333rem 0 rgba(0,0,0,.3)}.live_share_section .channel_info .info_name_id .nick_name[data-v-d8a81832]{margin-bottom:.0533333333rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.3733333333rem;font-weight:500;color:#fff;line-height:.5333333333rem}.live_share_section .channel_info .info_name_id .bigoid[data-v-d8a81832]{font-size:.2666666667rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.3866666667rem}.live_share_section .visitor_tap[data-v-d8a81832]{display:inline-flex;justify-content:center;align-items:center}.live_share_section .visitor_tap .follow_btn[data-v-d8a81832]{width:.96rem;height:.96rem;border-radius:50%;background-image:url(" + k + ");background-repeat:no-repeat;background-size:100% 100%;background-position:50%;margin-left:.32rem;position:relative;flex-shrink:0}.live_share_section .visitor_tap .follow_btn .like_gif[data-v-d8a81832]{position:absolute;right:-.1333333333rem;top:-2.2rem;width:1.4666666667rem;height:2.2rem;background-image:url(" + y + ");background-repeat:no-repeat;background-size:100% 100%;background-position:50%}.live_share_section .visitor_tap .follow_btn .tips_follow_w[data-v-d8a81832]{width:4.3466666667rem;border-radius:.32rem;background:#00decb;position:absolute;right:0;bottom:1.2rem;padding:.2133333333rem;font-size:.32rem;font-weight:500;color:#fff;line-height:.44rem;z-index:1000}.live_share_section .visitor_tap .follow_btn .tips_follow_w .tips_arrow[data-v-d8a81832]{position:absolute;right:.4rem;bottom:-.08rem;width:.16rem;height:.16rem;background:#00decb;transform:rotate(45deg)}.live_share_section .visitor_tap .share_btn[data-v-d8a81832]{width:.96rem;height:.96rem;border-radius:50%;background-image:url(" + C + ');background-repeat:no-repeat;background-size:100% 100%;background-position:50%}.bigo_show_list .country_name[data-v-d8a81832]{padding:0 .1333333333rem;font-size:.3346666667rem;font-weight:400;color:#fff;line-height:.3466666667rem}.bigo_show_list .country_name[data-v-d8a81832]:before{content:"";font-family:icomoon;display:block;color:#fff;float:left;width:.3466666667rem;height:.3466666667rem}.bigo_show_list .room_name[data-v-d8a81832]{padding:0 .1333333333rem;font-size:.3733333333rem;font-weight:700;color:#fff;line-height:.4533333333rem}.bigo_show_list .list_hover[data-v-d8a81832]{position:absolute;width:100%;bottom:0;left:0;height:1.76rem;background:url(' + M + ") no-repeat;background-size:100% 100%}.bigo_show_list .list_hover .bottom_content[data-v-d8a81832]{position:absolute;left:0;width:100%;bottom:0;padding:.2rem 0}.bigo_show_list .list_hover p[data-v-d8a81832]{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:left}.password_input_wrapper[data-v-d8a81832]{width:100%}.password_input_wrapper .input_desc[data-v-d8a81832]{width:100%;margin-top:.7466666667rem;margin-bottom:.4266666667rem;font-weight:700;text-align:center;font-size:.4266666667rem;color:#fff;line-height:.5066666667rem}.password_input_wrapper .password_input[data-v-d8a81832]{position:absolute;top:0;left:0;width:100%;height:1.0666666667rem;opacity:0}.password_input_wrapper .password_list[data-v-d8a81832]{position:relative;display:flex;justify-content:space-between;align-items:center;margin-bottom:.2133333333rem}.password_input_wrapper .password_list .password_item[data-v-d8a81832]{display:flex;align-items:center;justify-content:center;width:.9333333333rem;height:1.0666666667rem;font-size:.48rem;font-weight:600;color:#fff;line-height:.6666666667rem;border-radius:.1066666667rem;background-color:hsla(0,0%,100%,.3)}.live_password_section[data-v-d8a81832]{position:absolute;top:0;left:0;display:flex;justify-content:center;width:100%;height:100%;padding-top:1.2rem;background:rgba(0,0,0,.7);z-index:100}.live_password_section .live_password_section_content[data-v-d8a81832]{display:flex;flex-direction:column;align-items:center;width:80%}.live_password_section .live_password_section_content .password_title[data-v-d8a81832]{margin-bottom:.7466666667rem;color:#fff;font-size:.6933333333rem;font-weight:600;text-align:center;line-height:.96rem}.live_password_section .live_password_section_content .password_avatar[data-v-d8a81832]{width:1.36rem;height:1.36rem;margin-bottom:.2133333333rem;border-radius:50%}.live_password_section .live_password_section_content .password_avatar img[data-v-d8a81832]{width:100%;height:100%;border-radius:50%;-o-object-fit:contain;object-fit:contain}.live_password_section .live_password_section_content .password_nickname[data-v-d8a81832]{display:flex;align-items:center;font-size:.3733333333rem;margin-bottom:.1066666667rem;font-weight:500;color:#fff;line-height:.4533333333rem}.live_password_section .live_password_section_content .password_nickname.opa[data-v-d8a81832]{opacity:.7}.live_password_section .live_password_section_content .btn-copy-nickname[data-v-d8a81832]{width:.4266666667rem;height:.4266666667rem;margin:0 .1333333333rem;background-image:url(" + T + ");background-size:cover}.live_password_section .live_password_section_content .password_bigoid[data-v-d8a81832]{font-size:.32rem;font-weight:400;color:#fff;line-height:.4rem}.live_password_section .live_password_section_content .password_bigoid.opa[data-v-d8a81832]{opacity:.7}.live_password_section .live_password_section_content .password_btn_wrapper[data-v-d8a81832]{display:flex;justify-content:center;margin-top:.7466666667rem}.live_password_section .live_password_section_content .password_btn_wrapper .password_btn[data-v-d8a81832]{min-width:4.2666666667rem;height:.96rem;font-size:.4266666667rem;font-weight:600;color:#fff;line-height:.4266666667rem;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.64rem}.live_password_section .live_password_section_content .password_btn_wrapper .password_btn.disable[data-v-d8a81832]{opacity:.7}.live_chat_section[data-v-d8a81832]{width:8rem;height:4.4533333333rem;position:absolute;z-index:999;left:.1333333333rem;bottom:1.8666666667rem;overflow:auto}.live_share_section_before[data-v-d8a81832]{position:absolute;bottom:0;left:0;width:10rem;height:6.9333333333rem;background-image:linear-gradient(180deg,hsla(0,0%,100%,0),rgba(0,0,0,.3))}", ""]), e.exports = t
        }, 1375: function (e, t, o) {
            "use strict";
            var n = o(800);
            o.n(n).a
        }, 1376: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".video_section .video-js{width:100%;height:100%}.video_section .video-js .vjs-big-play-button{display:none}.video_section video{width:100%;height:100%;-o-object-fit:contain;object-fit:contain}", ""]), e.exports = t
        }, 1377: function (e, t, o) {
            "use strict";
            var n = o(801);
            o.n(n).a
        }, 1378: function (e, t, o) {
            var n = o(6), r = o(24), c = o(536), l = o(537), d = o(523), h = o(538), m = o(539), v = o(540),
                f = o(1379),
                _ = o(1380);
            t = n(!1);
            var w = r(c), A = r(l), x = r(d), k = r(h), y = r(m), C = r(v), M = r(f), T = r(_);
            t.push([e.i, ".fixed_top_section[data-v-4d243512]{position:fixed;left:50%;top:0;margin-left:-5rem;width:10rem;height:1.28rem;z-index:99999;background:hsla(0,0%,100%,.95)}.fixed_top_section .fixed_top_banner_b[data-v-4d243512]{height:.8266666667rem;width:2.7733333333rem;float:left;position:relative;left:.2666666667rem;top:.2266666667rem;cursor:pointer;font-size:0}.fixed_top_section .fixed_top_banner_b img[data-v-4d243512]{display:block;width:100%;height:100%}.fixed_top_section .fixed_top_banner_b.fixed_top_banner_b_tik[data-v-4d243512]{width:2.9853333333rem}.fixed_top_openapp[data-v-4d243512]{min-width:2.3066666667rem;height:.7466666667rem;margin-right:.2666666667rem;margin-top:.2666666667rem;position:relative;float:right;cursor:pointer}.fixed_top_openapp .open_app_btn[data-v-4d243512]{display:flex;justify-content:center;align-items:center;width:100%;height:100%;background-image:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.7466666667rem;font-size:.3733333333rem;font-weight:600;color:#fff;line-height:.5333333333rem;padding:0 .1333333333rem}.fixed_top_openapp .tips_openapp_w[data-v-4d243512]{width:4.3466666667rem;border-radius:.32rem;background-color:#00decb;position:absolute;right:0;top:1.0133333333rem;padding:.2133333333rem;font-size:.32rem;font-weight:500;color:#fff;line-height:.44rem}.fixed_top_openapp .tips_openapp_w .tips_arrow[data-v-4d243512]{position:absolute;right:.9333333333rem;top:-.08rem;width:.16rem;height:.16rem;background-color:#00decb;transform:rotate(45deg)}.blue-btn[data-v-4d243512]{display:inline-block;background-image:linear-gradient(90deg,#2ee6d6,#00d2e5);height:.96rem;line-height:.96rem;border-radius:.48rem;color:#fff;font-size:.4266666667rem;padding:0 .2133333333rem;min-width:4.2666666667rem;text-align:center}.live_pk_section[data-v-4d243512]{position:absolute;left:0;top:0;width:100%;height:100%;z-index:10000;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:center}.live_pk_section .live_pk_content[data-v-4d243512]{width:7.8133333333rem;background:#fff;border-radius:.4666666667rem;text-align:center;padding:.6rem .56rem .68rem;font-size:.4266666667rem;line-height:.5066666667rem;font-weight:600}.live_pk_section .live_pk_content .live_pk_tips[data-v-4d243512]{color:#2f3033;margin-bottom:.8rem}.live_pk_section .live_pk_content .live_pk_btn[data-v-4d243512]{display:flex;justify-content:center;align-items:center;width:6.6933333333rem;height:1.12rem;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.56rem;color:#fff;margin-bottom:.32rem}.live_pk_section .live_pk_content .live_pk_white_text[data-v-4d243512]{font-size:.3733333333rem;font-weight:400;color:#8a8f99;line-height:.4266666667rem}.middle_section[data-v-4d243512]{position:relative;overflow:hidden;width:10rem;height:10rem;background-repeat:no-repeat;background-position:50%;background-size:cover}.live_play_section[data-v-4d243512]{position:absolute;z-index:9999;left:50%;top:50%;width:1.44rem;height:1.44rem;margin-left:-.72rem;margin-top:-.72rem}.live_play_btn[data-v-4d243512]{display:block;width:100%;height:100%;overflow:hidden;text-indent:-999px;background-image:url(" + w + ');background-repeat:no-repeat;background-position:50%;background-size:100% 100%}.video_section[data-v-4d243512]{height:100%;width:100%;position:relative}.video_section[data-v-4d243512]:before{content:"";position:absolute;top:0;left:0;height:100%;width:100%;z-index:-1;-webkit-filter:blur(.2666666667rem);filter:blur(.2666666667rem);background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:var(--backgroundImage);transform:scale(1.2)}.video_section .water-marker[data-v-4d243512]{position:absolute;z-index:99;visibility:hidden}.video_section .water-marker-visable[data-v-4d243512]{visibility:visible}.video_section .water-marker img[data-v-4d243512]{width:1.8133333333rem;height:.3333333333rem}.video_section .water-marker p[data-v-4d243512]{font-size:.24rem;font-weight:700;color:hsla(0,0%,100%,.5);line-height:.28rem}.live_loading_section[data-v-4d243512]{position:absolute;left:0;top:0;bottom:0;right:0;margin:auto;width:1.9066666667rem;height:2.86rem;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(' + A + ')}.live_ended_section[data-v-4d243512]{display:flex;justify-content:center;align-items:center;flex-direction:column;width:100%;height:100%;text-align:center;padding:0 1rem}.live_ended_section[data-v-4d243512]:before{content:"";position:absolute;top:0;left:0;height:100%;width:100%;z-index:-1;-webkit-filter:blur(.2666666667rem);filter:blur(.2666666667rem);background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:var(--backgroundImage);transform:scale(1.2)}.live_ended_section .tips1[data-v-4d243512]{color:#fff;margin-bottom:.2133333333rem;font-size:.64rem;font-weight:500;line-height:.7733333333rem}.live_ended_section .tips2[data-v-4d243512]{font-size:.3733333333rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.4533333333rem;margin-bottom:.8rem}.live_ended_section .hover_recommend_b[data-v-4d243512]{width:7.9466666667rem;height:7.9466666667rem;overflow:hidden;position:relative}.live_ended_section .hover_recommend_b .hover_recommend_ul[data-v-4d243512]{height:100%;width:100%}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide[data-v-4d243512]{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;height:100%;width:100%}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide .swiper-slide-inner[data-v-4d243512]{width:3.84rem;height:3.84rem;border-radius:.08rem;margin:.0666666667rem;overflow:hidden;position:relative}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide .swiper-slide-inner .online_box[data-v-4d243512]{opacity:.8;font-size:.2933333333rem}.live_ended_section .hover_recommend_b .hover_recommend_ul .swiper-slide .swiper-slide-inner .room_name[data-v-4d243512]{font-size:.2933333333rem;padding-left:.1333333333rem;padding-right:.1333333333rem}.multi_live_box[data-v-4d243512]{text-align:center;background:url(' + x + ") 50% no-repeat;background-size:cover;height:100%;width:100%;z-index:9;display:flex;justify-content:center;align-items:center;flex-direction:column;padding:0 1.6533333333rem;position:relative;overflow:hidden}.multi_live_box .tips_cont[data-v-4d243512]{margin-bottom:.5333333333rem}.multi_live_box .multi_open_app[data-v-4d243512],.multi_live_box .tips_cont[data-v-4d243512]{font-size:.4266666667rem;font-weight:600;color:#fff;line-height:.5066666667rem}.multi_live_box .multi_open_app[data-v-4d243512]{padding:0 .48rem;min-width:6.6933333333rem;height:1.12rem;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:.56rem}.live_share_section[data-v-4d243512]{position:absolute;z-index:999;left:0;bottom:0;width:10rem;height:1.7066666667rem;display:flex;justify-content:space-between;align-items:center;padding-left:.3733333333rem;padding-right:.32rem}.live_share_section.channel_section[data-v-4d243512]{width:9.7333333333rem;height:2.0266666667rem;border-radius:.2133333333rem;border:1px solid hsla(0,0%,100%,.2);-webkit-filter:blur(0);filter:blur(0);left:.1333333333rem;bottom:.2666666667rem;padding:.24rem}.live_share_section .user_info[data-v-4d243512]{display:flex;justify-content:center;align-items:center}.live_share_section .user_info .thumb_box[data-v-4d243512]{width:.96rem;height:.96rem;border-radius:50%;overflow:hidden;border:.0266666667rem solid #fff;background-color:#fff}.live_share_section .user_info .thumb_box .thumb_icon[data-v-4d243512]{display:block;width:100%;height:100%}.live_share_section .user_info .info_name_id[data-v-4d243512]{width:5.5rem;margin-left:.2666666667rem;text-shadow:.0133333333rem .0133333333rem 0 rgba(0,0,0,.3)}.live_share_section .user_info .info_name_id .nick_name[data-v-4d243512]{margin-bottom:.0533333333rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.3733333333rem;font-weight:500;color:#fff;line-height:.4533333333rem}.live_share_section .user_info .info_name_id .bigoid[data-v-4d243512]{font-size:.32rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.3866666667rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.live_share_section .channel_info[data-v-4d243512]{position:relative;display:flex;justify-content:center;align-items:center}.live_share_section .channel_info .channel-icon[data-v-4d243512]{position:absolute;top:0;left:0;width:.88rem;height:.2533333333rem}.live_share_section .channel_info .thumb_box[data-v-4d243512]{width:1.5466666667rem;height:1.5466666667rem;overflow:hidden;border-radius:.1333333333rem}.live_share_section .channel_info .thumb_box .thumb_icon[data-v-4d243512]{display:block;width:100%;height:100%}.live_share_section .channel_info .info_name_id[data-v-4d243512]{width:5.1rem;margin-left:.2666666667rem;text-shadow:.0133333333rem .0133333333rem 0 rgba(0,0,0,.3)}.live_share_section .channel_info .info_name_id .nick_name[data-v-4d243512]{margin-bottom:.0533333333rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.3733333333rem;font-weight:500;color:#fff;line-height:.5333333333rem}.live_share_section .channel_info .info_name_id .bigoid[data-v-4d243512]{font-size:.2666666667rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.3866666667rem}.live_share_section .visitor_tap[data-v-4d243512]{display:inline-flex;justify-content:center;align-items:center}.live_share_section .visitor_tap .follow_btn[data-v-4d243512]{width:.96rem;height:.96rem;border-radius:50%;background-image:url(" + k + ");background-repeat:no-repeat;background-size:100% 100%;background-position:50%;margin-left:.32rem;position:relative;flex-shrink:0}.live_share_section .visitor_tap .follow_btn .like_gif[data-v-4d243512]{position:absolute;right:-.1333333333rem;top:-2.2rem;width:1.4666666667rem;height:2.2rem;background-image:url(" + y + ");background-repeat:no-repeat;background-size:100% 100%;background-position:50%}.live_share_section .visitor_tap .follow_btn .tips_follow_w[data-v-4d243512]{width:4.3466666667rem;border-radius:.32rem;background:#00decb;position:absolute;right:0;bottom:1.2rem;padding:.2133333333rem;font-size:.32rem;font-weight:500;color:#fff;line-height:.44rem;z-index:1000}.live_share_section .visitor_tap .follow_btn .tips_follow_w .tips_arrow[data-v-4d243512]{position:absolute;right:.4rem;bottom:-.08rem;width:.16rem;height:.16rem;background:#00decb;transform:rotate(45deg)}.live_share_section .visitor_tap .share_btn[data-v-4d243512]{width:.96rem;border-radius:50%;background-image:url(" + C + ");background-repeat:no-repeat;background-size:100% 100%;background-position:50%}.video_bottom_content[data-v-4d243512]{position:absolute;left:0;top:6.88rem;width:100%;bottom:0}.middle_section[data-v-4d243512]{height:5.6rem}.live_share_section[data-v-4d243512]{position:static;background-color:#fff;background-image:none}.live_share_section .user_info .info_name_id[data-v-4d243512]{width:4.4rem;text-shadow:none}.live_share_section .user_info .info_name_id .nick_name[data-v-4d243512]{color:#2f3033}.live_share_section .user_info .info_name_id .bigoid[data-v-4d243512]{color:#8a8f99}.live_share_section .visitor_tap .share_btn[data-v-4d243512]{display:inline-flex;justify-content:center;align-items:center;width:auto;min-width:2.1866666667rem;height:.96rem;border-radius:.7466666667rem;border:.0133333333rem solid #c4c7cc;font-size:.3733333333rem;font-weight:600;color:#2f3033;line-height:.96rem;padding:0 .1333333333rem}.live_share_section .visitor_tap .share_btn .share_btn_icon[data-v-4d243512]{flex-shrink:0;width:.5066666667rem;height:.5066666667rem;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(" + M + ");margin-right:.08rem}.chat_content_box[data-v-4d243512]{overflow:auto;display:none}.chat_content_box.current[data-v-4d243512]{display:block}.chat_content_box .chat_content_box_bottom[data-v-4d243512]{display:flex;justify-content:space-between;align-items:center;padding-left:.32rem;padding-right:.3733333333rem;padding-bottom:.16rem;position:fixed;bottom:0;left:0;right:0;margin:0 auto}.chat_content_box .chat_content_box_bottom .chat_content_box_send[data-v-4d243512]{width:8.3466666667rem;height:.96rem;background-color:rgba(196,199,203,.19);border-radius:.08rem;padding:.2133333333rem;font-size:.3733333333rem;font-weight:400;color:#8a8f99;line-height:.5333333333rem}.chat_content_box .chat_content_box_bottom .chat_content_box_gift[data-v-4d243512]{width:.64rem;height:.64rem;background-image:url(" + T + ');background-repeat:no-repeat;background-size:100% 100%;background-position:50%}.chat_content_box .chat_list[data-v-4d243512]{width:100%;overflow:auto;padding:.36rem .1866666667rem .2933333333rem}.video_bot_tab[data-v-4d243512]{overflow:hidden;background:#fff;width:100%;height:1.28rem;display:flex;justify-content:center;align-items:center;margin-top:.0266666667rem}.video_bot_tab .chat_btn[data-v-4d243512],.video_bot_tab .recommend_btn[data-v-4d243512]{flex:1;font-size:.4266666667rem;font-weight:400;color:#8a8f99;line-height:.4266666667rem;text-align:center;position:relative}.video_bot_tab .chat_btn.current[data-v-4d243512],.video_bot_tab .recommend_btn.current[data-v-4d243512]{font-weight:600;color:#2f3033}.video_bot_tab .chat_btn.current[data-v-4d243512]:after,.video_bot_tab .recommend_btn.current[data-v-4d243512]:after{content:"";position:absolute;bottom:-.16rem;left:0;right:0;margin:0 auto;width:.2133333333rem;height:.08rem;background:#2f3033;border-radius:.0533333333rem}.cover_msg_box[data-v-4d243512]{text-align:center}.cover_msg_box .live_ended_tips[data-v-4d243512]{font-size:.64rem;font-weight:500;color:#fff;line-height:.7733333333rem;margin-bottom:.2133333333rem}.cover_msg_box .room_status[data-v-4d243512]{font-size:.3733333333rem;font-weight:400;color:hsla(0,0%,100%,.8);line-height:.4533333333rem}', ""]), e.exports = t
        }, 1379: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAb1BMVEUAAAAvMDMvMDMxMjUwMTQvMDM2Njg0NDVCQkIwMTQyMjU+Pj4wMTQuMDMyMjUvMDIvMDMwMTQwNDouMDIuMDMvMDMvMDMwMDQwMTUuLzMvMDMvMDQwMTMvMDIwMDMwMTQwNDk3NzcvMDMvMDMvMDMfwXHSAAAAJHRSTlMA9/AwPnkVJQdHNwtakSvq2WEa5L+khG9Q3rGAatOdVR8PyqnLg2XdAAAB60lEQVRYw+1W7ZKCMAxsirR8KiCg4AeivP8zXpsOqCclHPfvjp1xBgm7LUm6ga1Y8Y/gu2f5C3qbg4K7XKCATgHKpfywM1i8h0BvAH+HZQIbUNw9KqTLBTYXVIgWCzhtggrHxQJMVKjg/5AtgiY2AizbYy0288nbQw4dAHRGgN12qBDMXPq0w9oZwFbfk6iAYhTkFRceAKHZE9d/+Jaie+VANxdVnzoHUIE4WU7S03e160vhvbUl3r9N8VNDBx4740VV2Gd2vguGnnoWb8CqJB7Bj0NmwxEVTpZohFE+WesGnxHj+cPl90SWD0qB+6P1S/D9MkYAbPZSgq6yID3K5i63bt6JLcByqB46cCX5Me5zpEwSWyScxYfGEqFt74T8eiw1uDOP4LvIzz1LD/HytaiO35zduCiubtvfO9v5rO4U+hYQUVGhGyHg8nrQ4D6aJ0/HanOZ3o0bPSFfGv3SWk8Z+n5Y8nc22tjzGCViIrsqdn7SQWtyjq48HOTK1qi5iiZM5P1rd5c4CrJhLtBWosPXgINh18fw22DZEGaWaV4BZvVSfEwmx/Dl9AAz9If4jESkoaeDkR/t0g7R4hr846HtIB1QPY4zbDy99FiV5iHfYoEYopxSIRrfncpBFdDT3P416QWSrVjxx/EFUCNCcOQfRJUAAAAASUVORK5CYII="
        }, 1380: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAAP1BMVEUAAAA1NTYvMDMvMDNNTU0wMDMwMDQxMTQvMDMwMTQwMDQvNTUwMTQwMDMyMjYzMzNAQEAvMTMwMTM5OTkvMDO6cp2pAAAAFHRSTlMAGvPYBZuOWeS2lCtqUUI3DL2lEtpBR0gAAAE3SURBVGje7ZjLjsMgDEXBBAgpeTT1/3/rqAJNMvXQRW2ktvLZhSgccg0sbJSPwebkAFzK1vTAevzFd1DMgCdgNsJkfCALrx8Jsxnifq/JHgd+/oAEyA4rjh2Yx4Jft231SAnMHyizjEt5XEYRA63wYioLUlgppZLPOTKC41S6VHM9BlYsjNHaWAOLDEHZQ9sxsNX5b/eHWzHskgLzZ9GxZMSPiAjseZMBv8hEYIiAuU2JgETEPWhEQIrMvyoeBS9s00twgAzAhYtpM0wowDQ057+iCNeWYUIhpkb+KMb/dQgoRnhyKSRrGtBzQLHpycGDesdwBPTqoB8yBMdbFahABSrgCPioQAXfcA5UoAIVqEAFKlCBClTw+QL5dk7/hlT/llr/pmD/tmb/xmz/1rJ8c1xRFOXt+AHJTr/QkmznxwAAAABJRU5ErkJggg=="
        }, 1381: function (e, t, o) {
            "use strict";
            var n = o(802);
            o.n(n).a
        }, 1382: function (e, t, o) {
            var n = o(6), r = o(24), c = o(849), l = o(483), d = o(1383), h = o(1384), m = o(1385), v = o(1386),
                f = o(1387), _ = o(1388), w = o(513), A = o(514), x = o(1389), k = o(523), y = o(771), C = o(772),
                M = o(1390), T = o(554), I = o(553), S = o(863), D = o(864), R = o(552), E = o(555), O = o(1391),
                j = o(1392), U = o(251);
            t = n(!1);
            var P = r(c), z = r(l), B = r(d), N = r(h), L = r(m), Q = r(v), G = r(f), V = r(_), H = r(w), F = r(A),
                J = r(x), K = r(k), W = r(y), $ = r(C), Y = r(M), X = r(T), Z = r(I), ee = r(S), te = r(D), ie = r(R),
                oe = r(E), ae = r(O), ne = r(j), re = r(U);
            t.push([e.i, '@-webkit-keyframes rotate-round-data-v-72fcbe62{0%{transform:rotate(0deg)}50%{transform:rotate(180deg)}to{transform:rotate(1turn)}}@keyframes rotate-round-data-v-72fcbe62{0%{transform:rotate(0deg)}50%{transform:rotate(180deg)}to{transform:rotate(1turn)}}@-webkit-keyframes scale-data-v-72fcbe62{0%{transform:scale(.8)}25%{transform:scale(1.1)}50%{transform:scale(.95)}to{transform:scale(1)}}@keyframes scale-data-v-72fcbe62{0%{transform:scale(.8)}25%{transform:scale(1.1)}50%{transform:scale(.95)}to{transform:scale(1)}}@-webkit-keyframes bounceIn-data-v-72fcbe62{0%{opacity:0}to{opacity:1}}@keyframes bounceIn-data-v-72fcbe62{0%{opacity:0}to{opacity:1}}.room[data-v-72fcbe62]{max-width:1340px;margin:20px auto}.room .room-container[data-v-72fcbe62]{width:100%;position:relative;display:flex}.room .room-container .room-container__left[data-v-72fcbe62]{width:989px}.room .room-container .room-container__left .room-host-about[data-v-72fcbe62]{width:100%;height:96px;background:#fff;position:relative;z-index:10;border-radius:4px;padding:20px}.room .room-container .room-container__left .room-host-about[data-v-72fcbe62]:after{content:"";display:block;clear:both}.room .room-container .room-container__left .room-host-about .host-avatar[data-v-72fcbe62]{cursor:pointer;width:56px;height:56px;margin-right:8px;overflow:hidden;border-radius:50%;transform:translateY(-50%);position:relative;top:50%;float:left;z-index:1}.room .room-container .room-container__left .room-host-about .host-center[data-v-72fcbe62]{transform:translateY(-40%);position:relative;top:50%}.room .room-container .room-container__left .room-host-about .host-center .host-nickname[data-v-72fcbe62]{cursor:pointer;display:inline-block;font-size:18px;font-weight:500;color:#2f3033;line-height:21px;margin-bottom:9px}.room .room-container .room-container__left .room-host-about .host-center .host-info[data-v-72fcbe62]{font-size:14px;font-weight:400;color:#8a8f99;line-height:16px}.room .room-container .room-container__left .room-host-about .host-center .host-info .info-bean[data-v-72fcbe62],.room .room-container .room-container__left .room-host-about .host-center .host-info .info-bigoId[data-v-72fcbe62],.room .room-container .room-container__left .room-host-about .host-center .host-info .info-location[data-v-72fcbe62],.room .room-container .room-container__left .room-host-about .host-center .host-info .info-view-nums[data-v-72fcbe62]{display:inline-block}.room .room-container .room-container__left .room-host-about .host-center .host-info .info-bean[data-v-72fcbe62],.room .room-container .room-container__left .room-host-about .host-center .host-info .info-location[data-v-72fcbe62],.room .room-container .room-container__left .room-host-about .host-center .host-info .info-view-nums[data-v-72fcbe62]{position:relative;margin-left:30px}.room .room-container .room-container__left .room-host-about .host-center .host-info .info-bean[data-v-72fcbe62]:before,.room .room-container .room-container__left .room-host-about .host-center .host-info .info-location[data-v-72fcbe62]:before,.room .room-container .room-container__left .room-host-about .host-center .host-info .info-view-nums[data-v-72fcbe62]:before{width:14px;height:14px;background-repeat:no-repeat;background-position:50%;background-size:cover;content:"";position:absolute;left:-19px;top:1px}.room .room-container .room-container__left .room-host-about .host-center .host-info .info-bean[data-v-72fcbe62]:before{background-image:url(' + P + ")}.room .room-container .room-container__left .room-host-about .host-center .host-info .info-view-nums[data-v-72fcbe62]:before{background-image:url(" + z + ")}.room .room-container .room-container__left .room-host-about .host-center .host-info .info-location[data-v-72fcbe62]:before{background-image:url(" + B + ')}.room .room-container .room-container__left .room-host-about .host-right[data-v-72fcbe62]{clear:both}.room .room-container .room-container__left .room-host-about .host-share-btn[data-v-72fcbe62]{float:right;position:relative;top:-53px;padding-right:10px;padding-left:28px;cursor:pointer;height:28px;border-radius:24px;border:1px solid #c4c7cc;font-size:14px;font-weight:600;color:#2f3033;line-height:16px;display:flex;justify-items:center;align-items:center}.room .room-container .room-container__left .room-host-about .host-share-btn[data-v-72fcbe62]:before{display:block;content:"";width:14px;height:14px;position:absolute;left:10px;top:5.5px;z-index:8;background-position:50%;background-size:contain;background-repeat:no-repeat;background-image:url(' + N + ')}.room .room-container .room-container__left .room-host-about .host-follow[data-v-72fcbe62]{float:right;position:relative;top:-53px;height:28px;margin-left:10px}.room .room-container .room-container__left .room-host-about .host-follow .host-follow-btn[data-v-72fcbe62]{height:100%;border-radius:24px;background:linear-gradient(90deg,#2ee6d6,#00d2e5);padding-right:10px;padding-left:28px;font-size:14px;font-weight:600;color:#fff;line-height:17px;cursor:pointer;display:flex;justify-items:center;align-items:center;position:relative}.room .room-container .room-container__left .room-host-about .host-follow .host-follow-btn[data-v-72fcbe62]:hover{opacity:.8}.room .room-container .room-container__left .room-host-about .host-follow .host-follow-btn[data-v-72fcbe62]:before{display:block;content:"";position:absolute;left:10px;top:8px;z-index:8;width:12px;height:12px;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(' + L + ")}.room .room-container .room-container__left .room-host-about .host-follow .host-follow-btn.followed[data-v-72fcbe62]{background:#fff;border:1px solid #c4c7cc;color:#2f3033}.room .room-container .room-container__left .room-host-about .host-follow .host-follow-btn.followed[data-v-72fcbe62]:before{background-image:url(" + Q + ')}.room .room-container .room-container__left .room-host-about .guide-phone[data-v-72fcbe62]{position:absolute;right:20px;top:58px;cursor:pointer}.room .room-container .room-container__left .room-host-about .guide-phone .guide-phone-title[data-v-72fcbe62]{position:relative;font-size:14px;font-weight:400;color:#8a8f99;line-height:20px}.room .room-container .room-container__left .room-host-about .guide-phone .guide-phone-title[data-v-72fcbe62]:before{display:inline-block;content:"";position:absolute;left:-20px;top:3px;width:14px;height:14px;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(' + G + ")}.room .room-container .room-container__left .room-host-about .guide-phone .guide-phone-title[data-v-72fcbe62]:hover{color:#2f3033}.room .room-container .room-container__left .room-host-about .guide-phone .guide-phone-title[data-v-72fcbe62]:hover:before{background-image:url(" + V + ")}.room .room-container .room-container__left .room-video[data-v-72fcbe62]{position:relative;margin-top:12px}.room .room-container .room-container__right[data-v-72fcbe62]{width:340px;position:absolute;top:0;right:0;bottom:0;overflow:hidden;padding-bottom:58px;border-radius:4px}.room .room-container .room-container__right .user_sent_msg[data-v-72fcbe62]{background-color:#fff;position:absolute;left:0;bottom:0;right:0;height:52px;border-radius:4px}.room .room-container .room-container__right .user_words_msg textarea[data-v-72fcbe62]{width:250px;height:45px;border:none;padding:10px 10px 0;font-size:14px;color:#000}.room .room-container .room-container__right .user_words_msg .login_tips[data-v-72fcbe62]{position:absolute;left:0;top:0;width:250px;height:100%;background:#fff;font-size:14px;font-weight:400;color:#c4c7cc;line-height:52px}.room .room-container .room-container__right .user_words_msg[data-v-72fcbe62] ::-webkit-input-placeholder{color:#e2e2e2;font-size:14px}.room .room-container .room-container__right .user_words_msg[data-v-72fcbe62] :-moz-placeholder,.room .room-container .room-container__right .user_words_msg[data-v-72fcbe62] ::-moz-placeholder{color:#e2e2e2;font-size:14px}.room .room-container .room-container__right .user_words_msg[data-v-72fcbe62] :-ms-input-placeholder{color:#e2e2e2;font-size:14px}.room .room-container .room-container__right .user_words_msg .login_tips a[data-v-72fcbe62]{color:#00decb;margin-left:12px}.room .room-container .room-container__right .user_words_msg .send_btn[data-v-72fcbe62]{position:absolute;right:0;top:0;bottom:0;margin:auto 12px;cursor:pointer;width:70px;height:28px;background:linear-gradient(90deg,#2ee6d6,#00d2e5);border-radius:24px;font-size:14px;font-weight:600;color:#fff;line-height:14px;display:flex;justify-content:center;align-items:center}.room .room-container .room-container__right .user_words_msg .send_btn[data-v-72fcbe62]:hover{opacity:.8}.room .room-recommend-live[data-v-72fcbe62]{margin-top:60px}.room .room-recommend-live .room-recommend-live__header[data-v-72fcbe62]{margin-bottom:14px;position:relative}.room .room-recommend-live .room-recommend-live__header .header-title[data-v-72fcbe62]{float:left;font-size:28px;font-weight:600;color:#2f3033;line-height:40px;max-width:1150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.room .room-recommend-live .room-recommend-live__header .header-right[data-v-72fcbe62]{position:absolute;right:0;top:0;bottom:0;margin:auto 0;display:flex;justify-content:center;align-items:center}.room .room-recommend-live .room-recommend-live__header .header-right .header-change[data-v-72fcbe62]{cursor:pointer;font-size:13px;font-weight:400;color:#8a8f99;line-height:40px;position:relative}.room .room-recommend-live .room-recommend-live__header .header-right .header-change[data-v-72fcbe62]:hover{font-weight:400;color:#2f3033}.room .room-recommend-live .room-recommend-live__header .header-right .header-change[data-v-72fcbe62]:hover:before{opacity:1}.room .room-recommend-live .room-recommend-live__header .header-right .header-change .val[data-v-72fcbe62]{display:inline-block;vertical-align:middle}.room .room-recommend-live .room-recommend-live__header .header-right .gray-line[data-v-72fcbe62]{width:1px;height:12px;background:#8a8f99;border-radius:1px;position:relative;margin:0 10px}.room .room-recommend-live .room-recommend-live__header .header-right .classify__more-btn[data-v-72fcbe62]{display:flex;justify-content:center;align-items:center;font-size:13px;font-weight:400;color:#8a8f99;line-height:16px}.room .room-recommend-live .room-recommend-live__header .header-right .classify__more-btn .arrow-icon[data-v-72fcbe62]{width:12px;height:12px;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(" + H + ")}.room .room-recommend-live .room-recommend-live__header .header-right .classify__more-btn[data-v-72fcbe62]:hover{color:#2f3033}.room .room-recommend-live .room-recommend-live__header .header-right .classify__more-btn:hover .arrow-icon[data-v-72fcbe62]{background-image:url(" + F + ")}.room .room-recommend-live .room-recommend-live-list[data-v-72fcbe62]{margin-right:-25px}.pk_live_box[data-v-72fcbe62]{position:absolute;z-index:9;left:0;top:0;width:100%;height:100%;display:flex;justify-content:center;align-items:center}.pk_live_box .multi_live_cont[data-v-72fcbe62]{width:496px;min-height:287px;background:rgba(0,0,0,.69);border-radius:4px;display:flex;flex-direction:column;justify-items:center;align-items:center;padding:40px 48px;position:relative;text-align:center}.pk_live_box .multi_live_cont .close_btn[data-v-72fcbe62]{position:absolute;right:8px;top:8px;width:24px;height:24px;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(" + J + ");cursor:pointer}.pk_live_box .multi_live_cont .multi_live_cont_title[data-v-72fcbe62]{font-size:18px;font-weight:700;color:#fff;line-height:21px;text-shadow:1px 1px 0 rgba(0,0,0,.3);margin-bottom:10px}.pk_live_box .multi_live_cont .multi_live_cont_text[data-v-72fcbe62]{font-size:14px;font-weight:400;color:hsla(0,0%,100%,.8);line-height:18px;text-shadow:1px 1px 0 rgba(0,0,0,.3);margin-bottom:3px}.pk_live_box.multi_live_box[data-v-72fcbe62]{background:url(" + K + ") 50% no-repeat;background-size:cover}.bounceIn[data-v-72fcbe62]{-webkit-animation-duration:.5s;animation-duration:.5s;-webkit-animation-name:bounceIn-data-v-72fcbe62;animation-name:bounceIn-data-v-72fcbe62}.poptip-animation-enter-active[data-v-72fcbe62]{-webkit-animation:bounceIn-data-v-72fcbe62 .5s;animation:bounceIn-data-v-72fcbe62 .5s}.download-qrcode-right[data-v-72fcbe62]{display:flex;flex-direction:column;margin-left:14px;font-size:14px;font-weight:700;color:#fff;line-height:16px;max-width:120px}.download-qrcode-right .apple-icon[data-v-72fcbe62]{background-image:url(" + W + ")}.download-qrcode-right .apple-icon[data-v-72fcbe62],.download-qrcode-right .google-icon[data-v-72fcbe62]{width:120px;height:36px;background-repeat:no-repeat;background-position:50%;background-size:cover;margin-top:12px;cursor:pointer}.download-qrcode-right .google-icon[data-v-72fcbe62]{background-image:url(" + $ + ")}.qr-code-box-bg[data-v-72fcbe62]{margin-left:11px;padding:5px;background-color:#fff;border-radius:4px}.poptip-qrcode-bottom[data-v-72fcbe62]{display:flex;margin-top:25px;align-items:flex-end}.poptip-qrcode-bottom .poptip-qrcode-img1[data-v-72fcbe62]{width:105px;height:112px;background-repeat:no-repeat;background-position:50%;background-size:cover;background-image:url(" + Y + ')}.poptip-qrcode-bottom .poptip-qrcode-line[data-v-72fcbe62]{width:1px;height:124px;background:#e1e3e6;margin:0 27px}.poptip-qrcode-bottom .download-qrcode-right[data-v-72fcbe62]{margin-left:0}.poptip[data-v-72fcbe62]{position:absolute;width:320px;padding:20px 16px 18px;z-index:100;top:40px;right:-113px;background-color:#fff;box-shadow:1px 1px 18px 0 rgba(0,0,0,.12);border-radius:8px 6px}.poptip .share-apps-title[data-v-72fcbe62]{color:#2f3033;font-weight:400;font-size:14px;line-height:18px;padding-left:8px}.poptip .share-apps[data-v-72fcbe62]{display:flex;flex-wrap:wrap}.poptip .share-link[data-v-72fcbe62]{position:relative;width:72px;height:72px;padding-top:50px}.poptip .share-link[data-v-72fcbe62]:before{display:block;content:"";width:32px;height:32px;position:absolute;left:20px;top:10px;background-position:50%;background-size:contain;background-repeat:no-repeat}.poptip .share-link.share-WhatsApp[data-v-72fcbe62]:before{background-image:url(' + X + ")}.poptip .share-link.share-Twitter[data-v-72fcbe62]:before{background-image:url(" + Z + ")}.poptip .share-link.share-Pinterest[data-v-72fcbe62]:before{background-image:url(" + ee + ")}.poptip .share-link.share-Reddit[data-v-72fcbe62]:before{background-image:url(" + te + ")}.poptip .share-link.share-Facebook[data-v-72fcbe62]:before{background-image:url(" + ie + ")}.poptip .share-link.share-Copy[data-v-72fcbe62]:before{background-image:url(" + oe + ')}.poptip[data-v-72fcbe62]:after{position:absolute;top:0;right:43%;transform:translateY(-100%);display:block;content:"";width:0;height:0;border-color:transparent transparent #fff;border-style:solid;border-width:0 10px 10px}.poptip a[data-v-72fcbe62]{display:block;font-size:12px;font-weight:400;color:#8a8f99;line-height:14px;text-align:center}.poptip.poptip-qrcode[data-v-72fcbe62]{padding:28px;width:486px;left:auto;right:-20px;top:34px}.poptip.poptip-qrcode .share-apps-title-scan[data-v-72fcbe62]{font-size:18px;font-weight:700;color:#2f3033;line-height:21px;margin-bottom:10px}.poptip.poptip-qrcode .share-apps-desc[data-v-72fcbe62]{font-size:14px;font-weight:400;color:#8a8f99;line-height:18px}.poptip.poptip-qrcode[data-v-72fcbe62]:after{left:auto;right:74px}#copiedTips_e[data-v-72fcbe62]{position:fixed;z-index:99999;left:50%;margin-left:-35px;top:50%;width:98px;height:42px;background:#000;color:#fff;font-size:20px;text-align:center;line-height:42px;border-radius:5px}.follow_guide[data-v-72fcbe62]{position:absolute;z-index:8;background:#fff;box-shadow:1px 1px 18px 0 rgba(0,0,0,.12);border-radius:8px;right:-370px;width:446px;top:60px;text-align:left;padding:28px 124px 28px 28px}.follow_guide .follow_guide_arrow[data-v-72fcbe62]{width:42px;height:48px;top:-35px;left:79px;background-image:url(' + ae + ")}.follow_guide .follow_guide_arrow[data-v-72fcbe62],.follow_guide .follow_guide_bigo[data-v-72fcbe62]{background-repeat:no-repeat;background-position:50%;background-size:cover;position:absolute}.follow_guide .follow_guide_bigo[data-v-72fcbe62]{width:108px;height:75px;bottom:0;right:0;background-image:url(" + ne + ")}.follow_guide .follow_guide_title[data-v-72fcbe62]{font-size:18px;font-weight:700;color:#2f3033;line-height:21px;margin-bottom:18px}.follow_guide .follow_guide_text[data-v-72fcbe62]{font-size:14px;font-weight:400;color:#8a8f99;line-height:18px}.follow_guide .follow_guide_btn[data-v-72fcbe62]{width:20px;height:20px;background-repeat:no-repeat;background-position:50%;background-size:cover;position:absolute;background-image:url(" + re + ');cursor:pointer;right:8px;top:8px}.follow_guide .download-tips[data-v-72fcbe62]{font-size:14px;font-weight:400;color:#8a8f99;line-height:16px;margin-bottom:18px}.follow_guide .download-container[data-v-72fcbe62]{display:flex;justify-content:center;align-items:center}.follow_guide .download-container .download-qrcode[data-v-72fcbe62]{width:80px;height:80px;margin-top:15px}.follow_guide.follow_guide_short[data-v-72fcbe62]{width:auto;padding-right:28px;right:-20px;top:40px;padding-top:20px}.follow_guide.follow_guide_short[data-v-72fcbe62]:after{position:absolute;top:0;right:19%;transform:translateY(-100%);display:block;content:"";width:0;height:0;border-color:transparent transparent #fff;border-style:solid;border-width:0 10px 10px}.bar-list[data-v-72fcbe62]{margin-top:14px}.no-bar[data-v-72fcbe62]{margin-top:10px;width:1066px;height:372px;background:#fff;border-radius:4px}.no-bar img[data-v-72fcbe62]{margin:84px 453px 16px}.no-bar div[data-v-72fcbe62]{font-weight:500;color:#2f3033}.no-bar div[data-v-72fcbe62],.no-more[data-v-72fcbe62]{font-size:16px;line-height:28px;text-align:center}.no-more[data-v-72fcbe62]{width:1066px;height:28px;font-weight:400;color:#8a8f99;padding-top:48px;padding-bottom:128px}', ""]), e.exports = t
        }, 1383: function (e, t, o) {
            e.exports = o.p + "img/location.b4afeb.png"
        }, 1384: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAV1BMVEUAAAAvMDMvMDIvMDMwMDQvMDMvMDIvMDMvMDMyMzY9PT0wMTUyMjMvMDMwMTQwMTQxMjUyMjUvLzMvMDIwMDQxMTQxMTYwMTMuMDMvLzQ1NTUyMjYvMDOesqwcAAAAHHRSTlMA9PjxV8qK124hC1AxsGVcPiujmIN7OeO/uBhHSfkp8gAAAOFJREFUKM+9kdtywjAQQyNtbOdKkpJQoPr/76zJpTVh8gj7pjm2RqvNPjPVVBxDQd/VActJwlUH0AzE9RDmRtxeQHlqg2h1aUL7jJoWUBzk2RDpV8o8KADB+cdDCOd/5iIKxX2TFyR/b5SdUqMesmb1NKrcxQaKJSaEZhe9ABarK9Ht94Uwe91jnTtWR1asDnOY3DsjpVjsT2TT8iyIWenNqLWEPrJx9aDcBIrG4CCrH0v6lQ1GZwL8pZqL79J6OhOlsdquwrTYMSL1W0xGlZxkiGz4U5DOT8cKfaK6Onv3/AIlsAsS8D4nGwAAAABJRU5ErkJggg=="
        }, 1385: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWAgMAAAC52oSoAAAADFBMVEUAAAD///////////84wDuoAAAAA3RSTlMA40mAJZ3FAAAAK0lEQVQI12NgYFBtYAABeQcwZX+AJGr+fyBIYKgHURegFFSQRMPgjoA6CQD5ISSHhi82BAAAAABJRU5ErkJggg=="
        }, 1386: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAe1BMVEUAAAAwMjMvMDMvMDM5OTkvMDMvMTMwMTMwMTQwMTQvMTUxMTg1NTtAQEAwMTQvMDMvMDMvMDMvMTMwMDMwMTMvMDMxMTUwMjUzMzMzMzg3NzcwMDMwMDQwMDQvMTQvMTMxMTMwMDUwMDUyMjY0NDQxMTcvOTlAQEAvMDPpaeObAAAAKHRSTlMASu7nBPra0mFbUSQVCvby4Me/qpJ9QDcxIBG0o5mNh3h0akcsKhsIfmmbqwAAAJxJREFUKM/NkVkSgjAQRANhR0R2cd999z+hlUIFhfmnv7rrJVOZjpqNLEtmRxBpiAzXS9gKbLECbzPNnAzsWLi4B6790WTILsD5m2Jb1z2rXdj1MQC7/YRWQ/YcPE6D/56c+KAfaqDGhaKzBbiNMT+DORlTAYH6U9nVFQHleO/c7H1PIXemG/M905rUNaQ3+ZeIlKADVEpUGKlZ6AVlHA5aKLnu1AAAAABJRU5ErkJggg=="
        }, 1387: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAKlBMVEUAAACLj5qLj5mLkJqMkp6MkJuMmZmLj5qLj5mLkJqOk5mLkJmWlqWKj5m+GoYDAAAADXRSTlMAYKCVKnoU7uTMLWwR9NdLpAAAAFVJREFUGNNjIBGkKkFBGIjH1nsXCm4kALmsNwWhYG4AkMt0EaZLVoEgl7EKxl0uQNAVPC5wcADIZb8LBwVALrcxHGwgyXNoziDJC2jeRwsctKAjDQAAPMcxrYhwqZ4AAAAASUVORK5CYII="
        }, 1388: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAJ1BMVEUAAAAwMTQwMTMxMTYwMjMwMDQzMzMvMDMwMDMwMTMvMjQ8PDwvMDOoGsuhAAAADHRSTlMAYKAqlXoU7uTMbBFTST2jAAAAVElEQVQY02MgEaQqQUEYiMfWcwYKTiQAuawnBaFgTgCQy3QQpktGgSCXsRjGNRcg6ApuYzjYAOSyn4GDAiCXywUOFpDkOTRnkOQFNO+jBQ5a0JEGAFBNLjkI5BFDAAAAAElFTkSuQmCC"
        }, 1389: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAATlBMVEUAAAABAQHk5ujy8vI8PDz///90dHXg4+XJys3g4uPS09TR0tW8vLxSUlLT09Pa3+Hc3uDQ0tTDyMjBwsWeoaSRkpLIyMtsbGzDw8j///8OsM9TAAAAGnRSTlMAL4WIN5pFgUx9amATPAd2c3FqZVRPRUIzAf4Sp2gAAAEVSURBVEjH3ZVJsoMwDES/OsTygBnDdP+L/qosZFCAirbpFYt+5W4w0t9vqp5TbJnbmOb6C7fvsFPn75nGMxDGyWWi7KYxAOyba/8agMHRTm4Awnph3zzQL6S09IDfTuMk4EUnegHpJNaWwI5O5Rjp8wwPznShzPAffQFHl3LAqgoEnV/3CI0K1NOt+mOomrHcAwu4PhwwSNxYFVsVpdhwOKIrjePzUYn/8Yyld7dLhEDFJIQ8vhVQMs0YSRPaTyNmARIm0oT204QkQIQjTWg/OUQBWmTShPZTRisAg0gT4heBzYA5krm0+bWaP5z5algvn/l6m38g6y9qHgLWMWMdZOZRaR3G1nFvXCjWlWVcisa1+5P6B3m6EtF+pT4aAAAAAElFTkSuQmCC"
        }, 1390: function (e, t, o) {
            e.exports = o.p + "img/open-code2.dfa8e8.png"
        }, 1391: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAABgCAMAAAC0XqVIAAAAb1BMVEUAAABHR0c9PT0vMDMwMTU0NTgvMDMwMjQwMDMvMTMzNDUwMjQvMDMzMzQ3NzcwMTMvMDMvMDMwMDMvMDMwMTQwMDMwMTQxMTUvMDMyMzYwMDMwMTMvMjQwMTQxMTQvMTQvMDMvMDMwMTMvMDMvMDPVe1GsAAAAJHRSTlMABArmNRffP5RrIUvTLQ/79vHAtXxjdlKuJ6GccVxXgsSpicnSLmXXAAACPElEQVRYw+3W6XKbQBAE4F522eUSNxLIOu1+/2dMNnEiK8YCrHGVXfH3W5qagZ4p8M1LDeQ92BziNBtIW5FcQ9iaZOEgq+ZPOoSkvKDXKAja8LdWNFB85kQD5ck+1hX/qpVcoC4eBQN1kcoF6qJK5AJ18aTkAnURSQbK081xk8gFqijZuFAuUNUp6ow60CpIMc/jKssO4jp9wAKDraP95GwqwEzKb0hC0kJMkhUDoFYm3s+LwpyaltnwYneaiQlbxpi0Y/2ijLJ8ul31wHJGr2l+NZxmr3DLlhmWGvQONwW1w2IKd1LNAe8S3HqerEf/EkzFSne37mSL1+JqN1E0Jt+uqmlGU9NjQksavMHFamwfZoRmHWGhslAQF8yrGUQhxEXUZmTve4c7hKexz+AtR69dgplUlL1O9JmHsQYqGy7ZrH9+3HMzuhEnLJDr5mo0k460ZFgYLOAqluvJifp24fs68/gBx88FfsIQ48Id3kvpok99O+l2czV4W7F7d2ibgpUvuubj9YawWd2xC+3Rh6FkFvsOu+N5609vY3A3RzLzxUmWCkJW3S7+tW3t3il8E+HOMcRtWENc6KMkztJAXGr+83zmA8S5MoM4VdFAXMQtxA02hrwvFdQA8uLKQNwjMwVpgWULcWm1h7wcX0gSQ1yg+QFVO3IPcS0jyEtx5XOfLFVH8mVdyTqENKP5AHFhH+JjqATyjuVaQdqWzOSbTa3OIS4w/soGkBfpWEGYOpF2gLRNZv+0+tkD6/0A9BktdRBNZ0wAAAAASUVORK5CYII="
        }, 1392: function (e, t, o) {
            e.exports = o.p + "img/bigo.ee1e17.png"
        }, 1432: function (e, t, o) {
            "use strict";
            var n = {
                name: "ProgramItem", props: {
                    info: {
                        type: Object, default: function () {
                        }
                    }
                }, data: function () {
                    return {hadAll: !1}
                }, computed: {
                    startTime: function () {
                        var e;
                        return (null === (e = this.info) || void 0 === e ? void 0 : e.startTime) || 0
                    }, endTime: function () {
                        var e;
                        return (null === (e = this.info) || void 0 === e ? void 0 : e.endTime) || 0
                    }, isNow: function () {
                        var e = +new Date;
                        return e >= this.startTime && e <= this.endTime
                    }, isToday: function () {
                        var e = new Date, t = +e, o = e.setHours(23, 59, 59, 999) - t;
                        return this.startTime > t && this.startTime - t <= o
                    }, isTomorrow: function () {
                        var e = new Date, t = +e, o = e.setHours(23, 59, 59, 999) - t + 864e5;
                        return this.startTime > t && this.startTime - t <= o
                    }, guests: function () {
                        var e;
                        return (null === (e = this.info) || void 0 === e ? void 0 : e.guests) || []
                    }, timeText: function () {
                        var e = new Date(+this.startTime), t = new Date(+this.endTime), o = e.getFullYear(),
                            n = this.padZero(e.getMonth() + 1), r = this.padZero(e.getDate()),
                            c = this.padZero(e.getHours()), l = this.padZero(e.getMinutes()),
                            d = this.padZero(t.getHours()), h = this.padZero(t.getMinutes());
                        return this.isNow ? "".concat(this.$t("lang443"), " - ").concat(d, ":").concat(h) : this.isToday ? "".concat(this.$t("lang446"), " ").concat(c, ":").concat(l, " - ").concat(d, ":").concat(h) : this.isTomorrow ? "".concat(this.$t("lang447"), " ").concat(c, ":").concat(l, " - ").concat(d, ":").concat(h) : "".concat(o, "-").concat(n, "-").concat(r, " ").concat(c, ":").concat(l, " - ").concat(d, ":").concat(h)
                    }
                }, watch: {
                    "info.introduce": {
                        handler: function () {
                            var e = this;
                            this.$nextTick((function () {
                                e.$refs.textHeight2 && e.$refs.textHeight1 && e.$refs.textHeight2.clientHeight > e.$refs.textHeight1.clientHeight && (e.hadAll = !0)
                            }))
                        }, immediate: !0
                    }
                }, methods: {
                    padZero: function (e) {
                        return e >= 10 ? e : "0".concat(e)
                    }
                }
            }, r = (o(1354), o(3)), c = {
                name: "ChannleProgram", components: {
                    ProgramItem: Object(r.a)(n, (function () {
                        var e = this, t = e.$createElement, n = e._self._c || t;
                        return n("div", {staticClass: "program-item"}, [n("div", {
                            staticClass: "border-wrap",
                            class: {active: e.isNow}
                        }, [n("div", {staticClass: "program-item__time"}, [e._v(e._s(e.timeText))]), e._v(" "), n("div", {staticClass: "program-item__content"}, [n("div", {staticClass: "pic--left"}, [n("img", {
                            directives: [{
                                name: "lazy",
                                rawName: "v-lazy",
                                value: e.info.uidImageUrl || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                                expression: "\n            info.uidImageUrl ||\n              'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n          "
                            }], staticClass: "avatar"
                        })]), e._v(" "), n("div", {staticClass: "pic--center"}, [n("div", {staticClass: "nickname"}, [e._v(e._s(e.info.nickName))]), e._v(" "), n("div", {staticClass: "description"}, [n("div", {
                            ref: "textHeight1",
                            staticClass: "box__text"
                        }, [e._v("\n            " + e._s(e.info.introduce) + "\n          ")]), e._v(" "), n("div", {
                            ref: "textHeight2",
                            staticClass: "box__text--height"
                        }, [e._v("\n            " + e._s(e.info.introduce) + "\n          ")]), e._v(" "), e.hadAll ? n("div", {
                            staticClass: "box__more",
                            on: {
                                click: function (t) {
                                    return e.$emit("gotoApp")
                                }
                            }
                        }, [n("span", [e._v("...")]), e._v(e._s(e.$t("lang444")) + "\n          ")]) : e._e()])]), e._v(" "), n("div", {
                            staticClass: "pic--right",
                            on: {
                                click: function (t) {
                                    return e.$emit("gotoApp")
                                }
                            }
                        }, [n("img", {
                            staticClass: "plus",
                            attrs: {src: o(1353)}
                        })])]), e._v(" "), e.guests.length > 0 ? n("div", {staticClass: "program-item__guest"}, e._l(e.guests, (function (e, t) {
                            return n("img", {
                                directives: [{
                                    name: "lazy",
                                    rawName: "v-lazy",
                                    value: e.imageUrl || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                                    expression: "\n          item.imageUrl ||\n            'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n        "
                                }], key: t, staticClass: "avatar"
                            })
                        })), 0) : e._e()])])
                    }), [], !1, null, "0b3132ee", null).exports
                }, props: {
                    channelInfo: {
                        type: Object, default: function () {
                        }
                    }, programList: {
                        type: Array, default: function () {
                            return []
                        }
                    }
                }, data: function () {
                    return {showAll: !1, hadAll: !1}
                }, watch: {
                    "channelInfo.introduce": {
                        handler: function (e) {
                            var t = this;
                            this.$nextTick((function () {
                                t.$refs.textHeight2 && t.$refs.textHeight1 && t.$refs.textHeight2.clientHeight > t.$refs.textHeight1.clientHeight && (t.hadAll = !0)
                            }))
                        }
                    }
                }
            }, l = (o(1356), Object(r.a)(c, (function () {
                var e = this, t = e.$createElement, o = e._self._c || t;
                return o("div", {staticClass: "channel-program"}, [o("div", {staticClass: "blue-line-container"}, [o("div", {staticClass: "blue-line"}), e._v(" "), o("h2", [e._v(e._s(e.$t("lang441")))])]), e._v(" "), o("div", {staticClass: "text-wrap"}, [o("div", {
                    ref: "textHeight1",
                    staticClass: "box__text",
                    class: {"box__text--total": e.showAll}
                }, [e._v("\n      " + e._s(e.channelInfo.introduce) + "\n    ")]), e._v(" "), o("div", {
                    ref: "textHeight2",
                    staticClass: "box__text--height"
                }, [e._v("\n      " + e._s(e.channelInfo.introduce) + "\n    ")]), e._v(" "), e.hadAll ? o("div", {
                    staticClass: "box__more",
                    class: {"box__more--fold": e.showAll},
                    on: {
                        click: function (t) {
                            e.showAll = !e.showAll
                        }
                    }
                }, [e.showAll ? e._e() : o("span", {staticStyle: {color: "#2f3033"}}, [e._v("...")]), e._v(e._s(e.showAll ? e.$t("lang445") : e.$t("lang444")) + "\n    ")]) : e._e()]), e._v(" "), e.programList.length > 0 ? o("div", {staticClass: "blue-line-container"}, [o("div", {staticClass: "blue-line"}), e._v(" "), o("h2", [e._v(e._s(e.$t("lang442")))])]) : e._e(), e._v(" "), e.programList.length > 0 ? o("div", {staticClass: "program-list"}, e._l(e.programList, (function (t, n) {
                    return o("ProgramItem", {
                        key: n, attrs: {info: t}, on: {
                            gotoApp: function (t) {
                                return e.$emit("gotoApp")
                            }
                        }
                    })
                })), 1) : e._e()])
            }), [], !1, null, "a9315948", null));
            t.a = l.exports
        }, 1433: function (e, t, o) {
            "use strict";
            o(32);
            var n = o(792), r = {
                name: "ChannelRoom", props: {
                    channelInfo: {
                        type: Object, default: function () {
                        }
                    }, programList: {
                        type: Array, default: function () {
                            return []
                        }
                    }
                }, data: function () {
                    return {onlinePerson: 0, isOnline: !1, isSingleRoom: !1, channelUid: 0}
                }, computed: {
                    firstProgram: function () {
                        return this.programList[0]
                    }, startTime: function () {
                        return this.firstProgram.startTime || 0
                    }, endTime: function () {
                        return this.firstProgram.endTime || 0
                    }, hostName: function () {
                        return this.firstProgram.nickName || ""
                    }, isNow: function () {
                        if (!this.firstProgram) return !1;
                        var e = this.startTime || 0, t = this.endTime || 0, o = +new Date;
                        return o >= e && o <= t
                    }, isToday: function () {
                        var e = new Date, t = +e, o = e.setHours(23, 59, 59, 999) - t;
                        return this.startTime > t && this.startTime - t <= o
                    }, isTomorrow: function () {
                        var e = new Date, t = +e, o = e.setHours(23, 59, 59, 999) - t + 864e5;
                        return this.startTime > t && this.startTime - t <= o
                    }, channelStatus: function () {
                        return this.firstProgram ? this.isNow ? this.isOnline ? this.isSingleRoom ? 5 : 4 : 3 : 2 : 1
                    }, channelNum: function () {
                        if (this.channelStatus <= 2) {
                            var e = parseInt(28e3 + 2e3 * Math.random(), 10);
                            return this.$t("lang438").replace("[001]", e)
                        }
                        return this.$t("lang440").replace("[001]", this.onlinePerson)
                    }, description: function () {
                        if (1 === this.channelStatus) return this.$t("lang434");
                        if (2 === this.channelStatus) {
                            var e = this.getTimeLang();
                            return this.$t("lang435").replace("[001]", e)
                        }
                        return 3 === this.channelStatus || 4 === this.channelStatus ? this.$t("lang436").replace("[001]", this.hostName) : ""
                    }
                }, watch: {
                    channelStatus: function (e) {
                        3 === e && this.getOpenChannel()
                    }
                }, created: function () {
                    this.channelUid = +this.$route.query.u
                }, methods: {
                    getOpenChannel: function () {
                        var e = this;
                        n.a.getOpenChannelInfo({
                            channelUid: this.channelUid,
                            yyUid: +this.$route.query.h || void 0,
                            uid: this.firstProgram.uid
                        }).then((function (t) {
                            var o, n, r;
                            0 === t.code && (e.onlinePerson = (null === (o = t.data) || void 0 === o ? void 0 : o.person) || 0, e.isOnline = null === (n = t.data) || void 0 === n ? void 0 : n.isOnLive, e.isSingleRoom = 1 == +(null === (r = t.data) || void 0 === r ? void 0 : r.channelType), e.isSingleRoom && e.$emit("isSingleRoom", +e.firstProgram.bigoId))
                        }))
                    }, padZero: function (e) {
                        return e >= 10 ? e : "0".concat(e)
                    }, getTimeLang: function () {
                        var e = new Date(+this.startTime), t = e.getFullYear(), o = this.padZero(e.getMonth() + 1),
                            n = this.padZero(e.getDate()), r = this.padZero(e.getHours()),
                            c = this.padZero(e.getMinutes());
                        return this.isNow ? "".concat(this.$t("lang443")).concat(r, ":").concat(c) : this.isToday ? "".concat(this.$t("lang446")).concat(r, ":").concat(c) : this.isTomorrow ? "".concat(this.$t("lang447")).concat(r, ":").concat(c) : "".concat(t, "-").concat(o, "-").concat(n, " ").concat(r, ":").concat(c)
                    }, gotoApp: function () {
                        this.$emit("gotoApp")
                    }
                }
            }, c = (o(1351), o(3)), component = Object(c.a)(r, (function () {
                var e = this, t = e.$createElement, n = e._self._c || t;
                return n("div", {staticClass: "channel-room"}, [n("div", {
                    staticClass: "channel-bg1",
                    style: {backgroundImage: "url(" + (e.channelInfo.bg || o(1350)) + ")"}
                }), e._v(" "), n("div", {staticClass: "channel-bg2"}), e._v(" "), n("div", {staticClass: "channel-detail"}, [n("div", {staticClass: "channel-detail__title"}, [e._v(e._s(e.channelInfo.name))]), e._v(" "), n("div", {staticClass: "channel-detail__id"}, [e._v("ID:" + e._s(e.channelInfo.bigo_id))]), e._v(" "), n("div", {staticClass: "channel-detail__avatar"}, [n("img", {
                    directives: [{
                        name: "lazy",
                        rawName: "v-lazy",
                        value: e.channelInfo.icon || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                        expression: "\n          channelInfo.icon ||\n            'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n        "
                    }], staticClass: "avatar"
                }), e._v(" "), n("img", {
                    staticClass: "channel-icon",
                    attrs: {src: o(907)}
                })]), e._v(" "), n("div", {staticClass: "channel-detail__description"}, [e._v("\n      " + e._s(e.description) + "\n    ")])]), e._v(" "), n("div", {
                    staticClass: "channel-subscribe",
                    on: {click: e.gotoApp}
                }, [e._v("\n    " + e._s(e.channelStatus > 2 ? e.$t("lang439") : e.$t("lang437")) + "\n  ")]), e._v(" "), n("div", {staticClass: "channel-num"}, [e._v(e._s(e.channelNum))])])
            }), [], !1, null, "8a56f5b4", null);
            t.a = component.exports
        }, 1465: function (e, t, o) {
            "use strict";
            o.r(t);
            o(32), o(20), o(133), o(15);
            var n = o(1), r = o(27), c = o(790).a, l = (o(1371), o(1373), o(3)), d = Object(l.a)(c, (function () {
                    var e = this, t = e.$createElement, n = e._self._c || t;
                    return n("div", {
                        staticClass: "app_body",
                        attrs: {id: "app", "hive-anchor": "mobile-show"}
                    }, [n("div", {
                        staticClass: "fixed_top_section",
                        attrs: {id: "fixed_top_section_e"}
                    }, [n("div", {class: ["fixed_top_banner_b", {fixed_top_banner_b_tik: e.isTik}]}, [n("img", {
                        attrs: {
                            src: e.isTik ? o(1344) : o(477),
                            alt: "bigo image",
                            width: "100%",
                            height: "100%"
                        }, on: {click: e.back}
                    })]), e._v(" "), n("div", {staticClass: "fixed_top_openapp"}, [n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 69,
                            expression: "69",
                            modifiers: {click: !0}
                        }], staticClass: "open_app_btn", attrs: {href: "javascript:;"}, on: {
                            click: function (t) {
                                return e.openApp(1)
                            }
                        }
                    }, [e._v("\n        " + e._s(e.downLoadBtn) + "\n      ")]), e._v(" "), e.tipsOpenInApp ? n("div", {staticClass: "tips_openapp_w"}, [n("p", {staticClass: "tips_arrow"}), e._v("\n        " + e._s(e.$t("lang008")) + "\n      ")]) : e._e()])]), e._v(" "), 1 !== e.config.channelType || e.isChannelSingleRoom ? n("div", {
                        staticClass: "middle_section",
                        style: {height: "100%", "--backgroundImage": "url('" + e.config.ogImage + "')"}
                    }, [1 === e.config.alive ? n("div", {staticClass: "video_section"}, [e.showPasswordCover ? n("div", {staticClass: "live_password_section"}, [n("div", {staticClass: "live_password_section_content"}, [n("div", {staticClass: "password_avatar"}, [n("img", {attrs: {src: e.config.data5 || o(534)}})]), e._v(" "), n("div", {staticClass: "password_nickname opa"}, [e._v("\n            " + e._s(e.config.nickName) + "\n            "), n("button", {
                        staticClass: "btn-copy-nickname",
                        on: {click: e.copyNickname}
                    })]), e._v(" "), 1 === e.showPasswordCover ? n("div", {staticClass: "password_bigoid"}, [e._v("\n            ID:" + e._s(e.bigo_id) + "\n          ")]) : e._e(), e._v(" "), n("div", {staticClass: "password_input_wrapper"}, [n("div", {staticClass: "input_desc"}, [e._v("\n              " + e._s(e.$t("lang325")) + "\n            ")]), e._v(" "), n("div", {staticClass: "password_list"}, [e._l(6, (function (t) {
                        return n("div", {
                            key: t,
                            staticClass: "password_item"
                        }, [e._v("\n                " + e._s(e.password[t - 1]) + "\n              ")])
                    })), e._v(" "), n("input", {
                        directives: [{
                            name: "model",
                            rawName: "v-model",
                            value: e.password,
                            expression: "password"
                        }],
                        staticClass: "password_input",
                        attrs: {maxlength: "6", type: "tel"},
                        domProps: {value: e.password},
                        on: {
                            keyup: function (t) {
                                return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.handleEnterPasswordRoom(t)
                            }, input: function (t) {
                                t.target.composing || (e.password = t.target.value)
                            }
                        }
                    })], 2)]), e._v(" "), n("div", {staticClass: "password_btn_wrapper"}, [n("button", {
                        class: ["password_btn", {disable: e.password.length < 6}],
                        on: {click: e.handleEnterPasswordRoom}
                    }, [e._v("\n              " + e._s(e.$t("lang326")) + "\n            ")])])])]) : e._e(), e._v(" "), "live_play" === e.liveStatus && e.config.hlsSrc ? n("div", {staticClass: "live_play_section"}, [n("a", {
                        staticClass: "live_play_btn",
                        attrs: {href: "javascript:;"},
                        on: {click: e.videoPlay}
                    })]) : e._e(), e._v(" "), e.config.hlsSrc ? n("video", {
                        staticClass: "video-js",
                        style: {objectFit: "live_living" === e.liveStatus ? "cover" : "contain"},
                        attrs: {
                            id: "video_tag_show",
                            "webkit-playsinline": "",
                            playsinline: "",
                            width: "100%",
                            height: "100%",
                            autoplay: "",
                            poster: e.config.ogImage
                        }
                    }, [n("source", {
                        attrs: {
                            src: e.config.hlsSrc,
                            type: "application/x-mpegURL"
                        }
                    })]) : e._e()]) : e.config.passRoom && 4 === e.config.roomStatus ? n("div", {staticClass: "live_password_section"}, [n("div", {staticClass: "live_password_section_content"}, [n("div", {staticClass: "password_title"}, [e._v(e._s(e.$t("lang327")))]), e._v(" "), n("div", {staticClass: "password_avatar"}, [n("img", {attrs: {src: e.config.data5 || o(534)}})]), e._v(" "), n("div", {staticClass: "password_nickname"}, [e._v("\n          " + e._s(e.config.nickName) + "\n          "), n("button", {
                        staticClass: "btn-copy-nickname",
                        on: {click: e.copyNickname}
                    })]), e._v(" "), n("div", {staticClass: "password_bigoid"}, [e._v("ID:" + e._s(e.bigo_id))]), e._v(" "), n("div", {staticClass: "password_btn_wrapper"}, [n("button", {
                        staticClass: "password_btn",
                        on: {click: e.handleEnterPasswordRoom}
                    }, [e._v("\n            " + e._s(e.$t("lang328")) + "\n          ")])])])]) : e.config.passRoom && 0 === e.config.alive ? n("div", {staticClass: "live_password_section"}, [n("div", {staticClass: "live_password_section_content"}, [n("div", {staticClass: "password_title"}, [e._v(e._s(e.$t("lang329")))]), e._v(" "), n("div", {staticClass: "password_avatar"}, [n("img", {attrs: {src: e.config.data5 || o(534)}})]), e._v(" "), n("div", {staticClass: "password_nickname"}, [e._v("\n          " + e._s(e.config.nickName) + "\n          "), n("button", {
                        staticClass: "btn-copy-nickname",
                        on: {click: e.copyNickname}
                    })]), e._v(" "), n("div", {staticClass: "password_bigoid"}, [e._v("ID:" + e._s(e.bigo_id))]), e._v(" "), n("div", {staticClass: "password_btn_wrapper"}, [n("button", {
                        staticClass: "password_btn",
                        on: {click: e.openAnchorProfile}
                    }, [e._v("\n            " + e._s(e.$t("lang330")) + "\n          ")])])])]) : 4 === e.config.roomStatus ? n("div", {staticClass: "multi_live_box"}, [n("div", {staticClass: "tips_cont"}, [n("i", {domProps: {textContent: e._s(e.$t("lang029").replace("[001]", e.config.nickName))}})]), e._v(" "), n("div", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 50,
                            expression: "50",
                            modifiers: {click: !0}
                        }], staticClass: "blue-btn", on: {
                            click: function (t) {
                                return e.openApp()
                            }
                        }
                    }, [e._v("\n        " + e._s(e.$t("lang030")) + "\n      ")])]) : "live_end" === e.liveStatus ? n("div", {staticClass: "live_ended_section"}, [n("div", {staticClass: "live_share_section_before"}), e._v(" "), n("p", {staticClass: "tips1"}, [e._v(e._s(e.$t("lang011")))]), e._v(" "), n("p", {staticClass: "tips2"}, [e._v(e._s(e.$t("lang012")))]), e._v(" "), n("div", {
                        staticClass: "hover_recommend_b",
                        attrs: {id: "hover_recommend_b"}
                    }, [n("div", {staticClass: "hover_recommend_ul swiper-wrapper bigo_show_list"}, e._l(e.recommendDataList4, (function (t, o) {
                        return n("div", {
                            key: o,
                            class: ["swiper-slide", -1 === o ? "current" : ""]
                        }, e._l(t, (function (t, o) {
                            return n("div", {
                                directives: [{
                                    name: "hive",
                                    rawName: "v-hive.click",
                                    value: 48,
                                    expression: "48",
                                    modifiers: {click: !0}
                                }], key: o, staticClass: "swiper-slide-inner", on: {
                                    click: function (o) {
                                        return e.goPath(t.bigo_id)
                                    }
                                }
                            }, [t.data2 && t.data2.bigUrl ? n("img", {
                                directives: [{
                                    name: "lazy",
                                    rawName: "v-lazy",
                                    value: t.data2.bigUrl || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                                    expression: "\n                  m.data2.bigUrl ||\n                    'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n                "
                                }], attrs: {width: "100%", height: "100%"}
                            }) : e._e(), e._v(" "), n("div", {staticClass: "online_box"}, [n("span", {
                                staticClass: "fans_num",
                                domProps: {textContent: e._s(t.user_count)}
                            })]), e._v(" "), n("div", {staticClass: "list_hover"}, [n("div", {staticClass: "bottom_content"}, [n("p", {
                                staticClass: "room_name",
                                domProps: {textContent: e._s(t.room_topic || t.nick_name)}
                            })])])])
                        })), 0)
                    })), 0)])]) : e._e(), e._v(" "), e.config.hlsSrc && "live_end" !== e.liveStatus ? n("div", {staticClass: "live_share_section_before"}) : e._e(), e._v(" "), e.chatData.length && "live_living" === e.liveStatus ? n("div", {staticClass: "live_chat_section"}, [n("Chat", {
                        attrs: {
                            data: e.chatData,
                            opactiyBG: "",
                            useRem: ""
                        }
                    })], 1) : e._e(), e._v(" "), "live_loading" === e.liveStatus ? n("div", {staticClass: "live_loading_section"}) : e._e(), e._v(" "), 6 === e.config.roomStatus && "live_living" === e.liveStatus ? n("div", {staticClass: "live_pk_section"}, [n("div", {staticClass: "live_pk_content"}, [e.$t("lang478") && e.$t("lang478").replace ? n("div", {
                        staticClass: "live_pk_tips",
                        domProps: {innerHTML: e._s(e.$t("lang478").replace("[001]", e.config.nickName))}
                    }) : e._e(), e._v(" "), n("div", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 51,
                            expression: "51",
                            modifiers: {click: !0}
                        }], staticClass: "live_pk_btn", on: {
                            click: function (t) {
                                return e.openApp()
                            }
                        }
                    }, [e._v("\n          " + e._s(e.$t("lang449")) + "\n        ")]), e._v(" "), n("div", {
                        staticClass: "live_pk_white_text",
                        on: {
                            click: function (t) {
                                e.config.roomStatus = 0
                            }
                        }
                    }, [e._v("\n          " + e._s(e.$t("lang450")) + "\n        ")])])]) : e._e(), e._v(" "), e.config.hlsSrc || 4 === e.config.roomStatus || "live_end" === e.liveStatus ? n("div", {
                        staticClass: "live_share_section",
                        class: {channel_section: 1 === e.config.channelType && e.isChannelSingleRoom}
                    }, [1 === e.config.channelType && e.isChannelSingleRoom ? n("div", {staticClass: "channel_info"}, [n("div", {
                        staticClass: "thumb_box",
                        on: {
                            click: function (t) {
                                return e.jumpClick()
                            }
                        }
                    }, [e.channelInfo && e.channelInfo.icon ? n("img", {
                        directives: [{
                            name: "lazy",
                            rawName: "v-lazy",
                            value: e.channelInfo.icon || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                            expression: "\n              channelInfo.icon ||\n                'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n            "
                        }], staticClass: "thumb_icon", attrs: {width: "100%", height: "100%"}
                    }) : e._e(), e._v(" "), n("img", {
                        staticClass: "channel-icon",
                        attrs: {src: o(907)}
                    })]), e._v(" "), n("div", {staticClass: "info_name_id"}, [n("p", {
                        staticClass: "nick_name",
                        domProps: {textContent: e._s(e.channelInfo.name)}
                    }), e._v(" "), n("p", {
                        staticClass: "bigoid",
                        domProps: {textContent: e._s("id: " + (e.clientBigoId || e.channelInfo.bigo_id))}
                    })])]) : "live_end" !== e.liveStatus && 1 !== e.config.channelType ? n("div", {
                        staticClass: "user_info",
                        on: {click: e.userInfoClick}
                    }, [n("div", {
                        staticClass: "thumb_box", on: {
                            click: function (t) {
                                return e.jumpClick()
                            }
                        }
                    }, [e.config && e.config.data5 ? n("img", {
                        directives: [{
                            name: "lazy",
                            rawName: "v-lazy",
                            value: e.config.data5 || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                            expression: "\n              config.data5 ||\n                'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n            "
                        }], staticClass: "thumb_icon", attrs: {width: "100%", height: "100%"}
                    }) : e._e()]), e._v(" "), n("div", {staticClass: "info_name_id"}, [n("h1", {
                        staticClass: "nick_name",
                        domProps: {textContent: e._s(e.config.nickName)}
                    }), e._v(" "), n("p", {
                        staticClass: "bigoid",
                        domProps: {textContent: e._s("id: " + (e.clientBigoId || e.bigo_id))}
                    })])]) : e._e(), e._v(" "), "live_end" === e.liveStatus || 1 === e.config.channelType && !e.isChannelSingleRoom ? e._e() : n("div", {staticClass: "visitor_tap"}, [n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 43,
                            expression: "43",
                            modifiers: {click: !0}
                        }], staticClass: "share_btn", attrs: {href: "javascript:;"}, on: {click: e.ifShare}
                    }), e._v(" "), n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 42,
                            expression: "42",
                            modifiers: {click: !0}
                        }], staticClass: "follow_btn", attrs: {href: "javascript:;"}, on: {
                            click: function (t) {
                                return e.openApp(2)
                            }
                        }
                    }, ["live_living" === e.liveStatus ? n("div", {staticClass: "like_gif"}) : e._e(), e._v(" "), e.tipsFollow ? n("div", {staticClass: "tips_follow_w"}, [n("p", {staticClass: "tips_arrow"}), e._v("\n            " + e._s(e.$t("lang098")) + "\n          ")]) : e._e()])])]) : e._e()]) : n("ChannelRoom", {
                        attrs: {
                            channelInfo: e.channelInfo,
                            programList: e.programList
                        }, on: {
                            gotoApp: function (t) {
                                return e.openApp()
                            }, isSingleRoom: e.showChannelSingle
                        }
                    }), e._v(" "), 1 === e.config.channelType ? n("ChannelProgram", {
                        attrs: {
                            channelInfo: e.channelInfo,
                            programList: e.programList
                        }, on: {
                            gotoApp: function (t) {
                                return e.openApp()
                            }
                        }
                    }) : e._e(), e._v(" "), n("div", {staticClass: "bottom_section"}, [0 === e.programList.length ? n("RecommendList", {
                        attrs: {
                            recommendList: e.recommendDataList,
                            showAD: ""
                        }, on: {goPage: e.back, goPath: e.goPath}
                    }) : e._e(), e._v(" "), n("BottomDownload", {on: {downloadIconClick: e.onDownload}})], 1), e._v(" "), n("client-only", [n("share", {
                        model: {
                            value: e.showShare,
                            callback: function (t) {
                                e.showShare = t
                            },
                            expression: "showShare"
                        }
                    })], 1)], 1)
                }), [], !1, null, "d8a81832", null).exports, h = o(799).a,
                m = (o(1375), o(1377), Object(l.a)(h, (function () {
                    var e = this, t = e.$createElement, n = e._self._c || t;
                    return n("div", {staticClass: "app_body", attrs: {id: "app"}}, [n("div", {
                        staticClass: "fixed_top_section",
                        attrs: {id: "fixed_top_section_e"}
                    }, [n("div", {class: ["fixed_top_banner_b"]}, [n("img", {
                        attrs: {
                            src: o(477),
                            alt: "bigo image",
                            width: "100%",
                            height: "100%"
                        }, on: {click: e.back}
                    })]), e._v(" "), n("div", {staticClass: "fixed_top_openapp"}, [n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 69,
                            expression: "69",
                            modifiers: {click: !0}
                        }], staticClass: "open_app_btn", attrs: {href: "javascript:;"}, on: {
                            click: function (t) {
                                return e.openModal(1)
                            }
                        }
                    }, [e._v("\n        " + e._s(e.downLoadBtn) + "\n      ")])])]), e._v(" "), n("div", {
                        staticClass: "middle_section",
                        style: {"--backgroundImage": "url('" + (e.coverurl || e.config.ogImage) + "')"}
                    }, [1 === e.config.alive ? n("div", {staticClass: "video_section"}, ["live_play" === e.liveStatus && e.config.hlsSrc ? n("div", {staticClass: "live_play_section"}, [n("a", {
                        staticClass: "live_play_btn",
                        attrs: {href: "javascript:;"},
                        on: {click: e.videoPlay}
                    })]) : e._e(), e._v(" --\x3e\n      "), e._v(" "), e.config.hlsSrc ? n("video", {
                        staticClass: "video-js",
                        attrs: {
                            id: "video_tag_games",
                            "webkit-playsinline": "",
                            playsinline: "",
                            width: "100%",
                            height: "100%",
                            autoplay: "",
                            poster: e.coverurl || e.config.ogImage
                        }
                    }, [n("source", {
                        attrs: {
                            src: e.config.hlsSrc,
                            type: "application/x-mpegURL"
                        }
                    })]) : e._e()]) : 4 === e.config.roomStatus ? n("div", {staticClass: "multi_live_box"}, [n("div", {staticClass: "tips_cont"}, [n("i", {domProps: {textContent: e._s(e.$t("lang029").replace("[001]", e.config.nickName))}})]), e._v(" "), n("div", {
                        staticClass: "blue-btn",
                        on: {click: e.openModal}
                    }, [e._v("\n        " + e._s(e.$t("lang030")) + "\n      ")])]) : "live_end" === e.liveStatus ? n("div", {staticClass: "live_ended_section"}, [n("div", {staticClass: "cover_msg_box"}, [n("p", {staticClass: "live_ended_tips"}, [e._v(e._s(e.$t("lang173")))]), e._v(" "), n("p", {staticClass: "room_status"}, [e._v(e._s(e.$t("lang090")))])])]) : e._e(), e._v(" "), "live_loading" === e.liveStatus ? n("div", {staticClass: "live_loading_section"}) : e._e()]), e._v(" "), n("div", {staticClass: "video_bottom_content"}, [n("div", {staticClass: "live_share_section"}, [n("div", {staticClass: "user_info"}, [n("div", {
                        staticClass: "thumb_box",
                        staticStyle: {border: "none"},
                        on: {
                            click: function (t) {
                                return e.jumpClick()
                            }
                        }
                    }, [e.config.data5 ? n("img", {
                        directives: [{
                            name: "lazy",
                            rawName: "v-lazy",
                            value: e.config.data5 || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                            expression: "\n              config.data5 ||\n                'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n            "
                        }], staticClass: "thumb_icon", attrs: {width: "100%", height: "100%"}
                    }) : e._e()]), e._v(" "), n("div", {staticClass: "info_name_id"}, [n("h1", {
                        staticClass: "nick_name",
                        domProps: {textContent: e._s(e.config.nickName)}
                    }), e._v(" "), n("p", {
                        staticClass: "bigoid",
                        domProps: {textContent: e._s("id: " + (e.clientBigoId || e.bigo_id))}
                    })])]), e._v(" "), n("div", {staticClass: "visitor_tap"}, [n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 43,
                            expression: "43",
                            modifiers: {click: !0}
                        }], staticClass: "share_btn", attrs: {href: "javascript:;"}, on: {click: e.ifShare}
                    }, [n("div", {staticClass: "share_btn_icon"}), e._v(" "), n("div", [e._v(e._s(e.$t("lang095")))])]), e._v(" "), n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 42,
                            expression: "42",
                            modifiers: {click: !0}
                        }], staticClass: "follow_btn", attrs: {href: "javascript:;"}, on: {
                            click: function (t) {
                                return e.openModal(2)
                            }
                        }
                    }, [e.tipsFollow ? n("div", {staticClass: "tips_follow_w"}, [n("p", {staticClass: "tips_arrow"}), e._v("\n            " + e._s(e.$t("lang098")) + "\n          ")]) : e._e()])])]), e._v(" "), n("div", {staticClass: "video_bot_tab"}, [n("div", {
                        staticClass: "chat_btn",
                        class: {current: !e.isRecommend},
                        on: {click: e.clickChat}
                    }, [e._v("\n        " + e._s(e.$t("lang093")) + "\n      ")]), e._v(" "), n("div", {
                        staticClass: "recommend_btn",
                        class: {current: e.isRecommend},
                        on: {click: e.clickRecommended}
                    }, [e._v("\n        " + e._s(e.$t("lang178")) + "\n      ")])]), e._v(" "), n("div", {
                        staticClass: "chat_content_box",
                        class: {current: !e.isRecommend}
                    }, [n("div", {
                        staticClass: "chat_list",
                        style: {height: e.chatListHeight}
                    }, [n("Chat", {
                        attrs: {data: e.chatData, isGame: "", useRem: ""},
                        on: {"hook:mounted": e.mountedEnd}
                    })], 1), e._v(" "), n("div", {staticClass: "chat_content_box_bottom"}, [n("div", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 45,
                            expression: "45",
                            modifiers: {click: !0}
                        }], staticClass: "chat_content_box_send", on: {
                            click: function (t) {
                                return e.openModal(5)
                            }
                        }
                    }, [e._v("\n          Send a message...\n        ")]), e._v(" "), n("div", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 46,
                            expression: "46",
                            modifiers: {click: !0}
                        }], staticClass: "chat_content_box_gift", on: {
                            click: function (t) {
                                return e.openModal(4)
                            }
                        }
                    })])]), e._v(" "), n("div", {
                        staticClass: "chat_content_box",
                        class: {current: e.isRecommend}
                    }, [n("GameRecommendList", {
                        attrs: {recommendList: e.recommendDataList},
                        on: {goPage: e.back, goPath: e.goPath}
                    }), e._v(" "), n("BottomDownload", {on: {downloadIconClick: e.onDownload}})], 1)]), e._v(" "), e.showModal ? n("div", {class: ["live_pk_section"]}, [n("div", {staticClass: "live_pk_content"}, [n("div", {staticClass: "live_pk_tips"}, [e._v(e._s(e.$t("lang008")))]), e._v(" "), n("div", {
                        staticClass: "live_pk_btn",
                        on: {click: e.openOneLink}
                    }, [e._v("\n        " + e._s(e.$t("lang007")) + "\n      ")]), e._v(" "), n("div", {
                        staticClass: "live_pk_white_text",
                        on: {
                            click: function (t) {
                                e.showModal = !1
                            }
                        }
                    }, [e._v("\n        NO, thanks\n      ")])])]) : e._e(), e._v(" "), n("client-only", [n("share", {
                        model: {
                            value: e.showShare,
                            callback: function (t) {
                                e.showShare = t
                            },
                            expression: "showShare"
                        }
                    })], 1)], 1)
                }), [], !1, null, "4d243512", null).exports), v = (o(33), o(16), o(10), o(9), o(18), o(574), o(37)),
                f = (o(12), o(13), o(11)), _ = o(50), w = o(489), A = o.n(w), x = o(503), k = o(25), y = o(911),
                C = o(168),
                M = o(169), T = function () {
                    function e() {
                        var t, o;
                        Object(C.a)(this, e), this.danMuBoxJQ = document.querySelector("#liveVideo"), this.danMuWidth = document.querySelector("#liveVideo").clientWidth, this.danMuHeight = document.querySelector("#liveVideo").clientHeight, this.danMuMsg = [], this.setTimeoutAdjustId = null, this.allComingMsg = [], this.allTimeDelayMsg = [], this.danMuIntervalId = null, this.lastDrawDanMuTime = 0, this.payDanMuMsg = [], this.payTimeDelayMsg = [], this.payDanMuHtml = '<div class="pay_danmu_list"><div class="pay_words">=== : ===</div><p class="shadow_bg"></p></div>', this.payDanMuBox = document.querySelector("#bigo_dom_danmu_e"), this.danMuTag = (t = document.getElementById("bigo_danmu_e"), o = document.querySelector("#liveVideo"), t.width = o.clientWidth, t.height = o.clientHeight - 250, t), this.canvas = null
                    }

                    return Object(M.a)(e, [{
                        key: "getCanvas", value: function () {
                            if (this.canvas) return this.canvas;
                            var canvas = document.getElementById("bigo_danmu_e");
                            if (canvas) {
                                var e = canvas.getContext("2d");
                                return e.font = "30px sans_300", e.fillStyle = "#FFFFFF", e.textBaseline = "top", e.shadowColor = "rgba(46, 46, 46, 1)", e.shadowOffsetX = 0, e.shadowOffsetY = 0, e.shadowBlur = 1, e
                            }
                        }
                    }, {
                        key: "adjustDanMuWidthHeight", value: function () {
                            this.danMuTag.width = this.danMuWidth = this.danMuBoxJQ.clientWidth, this.danMuTag.height = this.danMuHeight = this.danMuBoxJQ.clientHeight - 250
                        }
                    }, {
                        key: "setDanMuY", value: function () {
                            var e = this.danMuMsg, t = this.danMuHeight - 80, o = (this.danMuWidth, e.length),
                                n = this.allComingMsg;
                            n = [];
                            for (var i = 0; i < o; i++) e[i].coming && n.push(e[i].y);
                            n.sort();
                            for (var r = 0, c = Math.floor(t / 30); r < c; r++) if (-1 === n.indexOf(30 * r + 10)) return 30 * r + 10;
                            return 0
                        }
                    }, {
                        key: "readyArguments", value: function (e) {
                            var t = this.danMuWidth, o = this.getCanvas().measureText(e).width + 35;
                            o = o < 150 ? 150 : o;
                            var n = this.setDanMuY();
                            if (0 === n) return this.allTimeDelayMsg.push({
                                msg: e,
                                x: t,
                                y: n,
                                msglen: o,
                                coming: !0,
                                date: +new Date
                            }), void (this.allTimeDelayMsg.length > 200 && this.allTimeDelayMsg.shift());
                            this.danMuMsg.push({msg: e, x: t, y: n, msglen: o, coming: !0})
                        }
                    }, {
                        key: "drawDanMu", value: function () {
                            var e = this.getCanvas();
                            if (e) {
                                e.clearRect(0, 0, this.danMuWidth, this.danMuHeight);
                                for (var t = this.danMuMsg, text = "", a = null, o = +new Date, n = this.lastDrawDanMuTime, r = (o - n) / 50 < 2 ? 1 : Math.floor((o - n) / 50), i = 0; i < t.length; i++) text = t[i].msg, e.fillText(text, t[i].x, t[i].y), t[i].x -= Math.floor(Math.pow(t[i].msglen, 1 / 4)) * r, t[i].coming && t[i].x + t[i].msglen < this.danMuWidth && (t[i].coming = !1, this.allTimeDelayMsg.length && ((a = this.allTimeDelayMsg.shift()).y = t[i].y, t.push(a))), t[i].x < -t[i].msglen && (t.splice(i, 1), i--);
                                this.lastDrawDanMuTime = o
                            }
                        }
                    }, {
                        key: "clearEndAndCheckAddNew", value: function (e) {
                            var t = this.payDanMuMsg, o = this.payTimeDelayMsg, n = t.indexOf(e), r = {};
                            t.splice(n, 1), o.length && (r = o.shift(), this.appendPayDanMu(r.user, r.msg))
                        }
                    }, {
                        key: "appendPayDanMu", value: function (e, t) {
                            var o, n, r = Math.floor((this.danMuHeight - 90) / 45), c = this.payDanMuMsg, l = 0,
                                d = this.getCanvas();
                            c.sort();
                            for (var i = 0, h = c.length; i < r; i++) if (-1 === c.indexOf(i + 1)) {
                                l = i + 1;
                                break
                            }
                            0 === h && (l = 1), 0 !== l ? (c.push(l), o = function (e) {
                                var t = document.createElement("div");
                                return t.innerHTML = e, t.childNodes
                            }(this.payDanMuHtml.replace("===", e).replace("===", t))[0] || {}, n = .8 * d.measureText(e + t).width + 50, this.payDanMuBox.appendChild(o), setTimeout(function (e) {
                                return function () {
                                    e.style.left = -(n + 70) + "px", e.style.width = n + 60 + "px", e.style.top = 10 + 45 * (l - 1) + "px"
                                }
                            }(o), 20), setTimeout(function (e, t, o) {
                                return function () {
                                    o.payDanMuBox.removeChild(e), o.clearEndAndCheckAddNew(t)
                                }
                            }(o, l, this), 12500)) : this.payTimeDelayMsg.push({user: e, msg: t})
                        }
                    }]), e
                }(), I = o(909), S = o(915), D = o(530), R = o(529), E = o(486), O = o(597), j = o(171), U = o(519),
                P = o(502),
                z = o(65), B = o(452);

            function N(object, e) {
                var t = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(object);
                    e && (o = o.filter((function (e) {
                        return Object.getOwnPropertyDescriptor(object, e).enumerable
                    }))), t.push.apply(t, o)
                }
                return t
            }

            function L(e) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? N(Object(source), !0).forEach((function (t) {
                        Object(f.a)(e, t, source[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(source)) : N(Object(source)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(source, t))
                    }))
                }
                return e
            }

            var Q = {
                name: "Room",
                components: {
                    Player: y.a,
                    Chat: S.a,
                    GameRoomEntrance: D.a,
                    ShowRoomEntrance: R.a,
                    LoginPopup: j.a,
                    DisCordBanner: E.a,
                    ClientSideQRCode: z.a,
                    Bar: P.a
                },
                mixins: [U.a],
                props: {
                    asyncData: {
                        type: Object, default: function () {
                            return {
                                ignoreUids: [],
                                videoInfo: {bean: "-"},
                                barList: [],
                                barCount: 0,
                                isLastPage: !1,
                                cursor: 0
                            }
                        }
                    }
                },
                scrollToTop: !0,
                data: function () {
                    return this.throttleAdjustDanmuSize = Object(x.a)(2e3, this.adjustDanmuSize), L({
                        showPoptip: !1,
                        scanQrCode: !1,
                        current: {},
                        playerControlLayout: "volume,rotate,full-screen",
                        ws: null,
                        wsRealUser: null,
                        nums: 0,
                        beans: 0,
                        chatData: [{type: "init"}],
                        liveInfo: {},
                        recommendList: [],
                        isRefreshing: !1,
                        loginPopUpVisible: !1,
                        isFollowed: !1,
                        showFollowSuccess: !1,
                        showUnfollowTips: !1,
                        comment: "",
                        showPKCover: !1,
                        showFollowGuide: !1,
                        loginRoomRequestTimes: 0,
                        theTabUniqueId: 0,
                        now: +new Date,
                        joinRoomTimer: null,
                        clipboardVal: "https://www.bigo.tv/",
                        Copied: !1,
                        gettingAPI: !1
                    }, this.asyncData)
                },
                computed: L({
                    avatar: function () {
                        return this.videoInfo && this.videoInfo.ogImage ? this.videoInfo.ogImage : "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png"
                    }, bigoid: function () {
                        return this.$route.params.bigoid || this.videoInfo.bigoId
                    }
                }, Object(_.c)(["userInfo", "clientBigoId"]), {}, Object(_.b)(["isLogin", "myBigoId"])),
                watch: {
                    showPKCover: function (e) {
                        e && this.createQrcodeShow(".qr-code-box2")
                    }
                },
                created: function () {
                    var e;
                    if (this.$store.commit("update_clientBigoId", ""), this.$hive.initHive(this), this.getRecommendList(), this.followGuide(), !(null === (e = this.videoInfo) || void 0 === e ? void 0 : e.bigoId)) return this.barList = [], void (this.barCount = 0);
                    this.getDetailList()
                },
                mounted: function () {
                    var e = this;
                    document.addEventListener("click", (function (t) {
                        t.target.className.includes("poptip-dom-share") || (e.showPoptip = !1), t.target.className.includes("poptip-dom-qrcode") || (e.scanQrCode = !1)
                    })), this.current.bigoid = this.bigoid, this.startLive(this.bigoid), this.$nextTick((function () {
                        I.a.giftInit()
                    })), setTimeout((function () {
                        e.handlePkRoom()
                    }), 3e3), window.testani = function (e) {
                        I.a.giftAnimationStart(e)
                    }, window.addEventListener("beforeunload", this.handleClosePage)
                },
                beforeDestroy: function () {
                    this.logoutRoom({type: "close"}), this.handleClosePage(), window.removeEventListener("storage", this.listenStorageChange), window.removeEventListener("focus", this.listenWindowFocus), window.removeEventListener("blur", this.listenWindowBlur), window.removeEventListener("resize", this.throttleAdjustDanmuSize), window.removeEventListener("beforeunload", this.handleClosePage), window.danmu && clearInterval(window.danmu.danMuIntervalId), this.ws && this.ws.destroy(), this.wsRealUser && this.wsRealUser.destroy()
                },
                methods: {
                    goUserPage: function () {
                        this.$router.push(this.localeRoute({path: "/user/".concat(this.bigoid)}))
                    }, goStore: function (e) {
                        var t = "https://play.google.com/store/apps/details?id=sg.bigo.live";
                        "apple" === e && (t = "https://itunes.apple.com/app/id1077137248"), window.open(t, "_blank")
                    }, handleOpenMultiCover: function () {
                        this.showPKCover = !0
                    }, handleClosePage: function () {
                        clearTimeout(this.joinRoomTimer), this.$hive.send("010012006", {
                            staytime: +new Date - this.now,
                            passRoom: this.liveInfo.passRoom ? 1 : 0
                        })
                    }, loginRoom: function () {
                    }, logoutRoom: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        "close" === e.type && (this.ws && this.ws.send("7|24", {
                            seqId: String(~~(+new Date / 1e3)),
                            roomId: this.liveInfo.roomId,
                            jumpRoomId: "",
                            flag: ""
                        }), this.wsRealUser && this.wsRealUser.send("7|24", {
                            seqId: String(~~(+new Date / 1e3)),
                            roomId: this.liveInfo.roomId,
                            jumpRoomId: "",
                            flag: ""
                        }))
                    }, handlePkRoom: function () {
                        var e = this, t = this.liveInfo, o = t.roomStatus, n = t.passRoom;
                        4 != +o || n ? 6 == +o && setTimeout((function () {
                            e.showPKCover = !0
                        }), 6e4) : this.showPKCover = !0
                    }, send: function () {
                        if (this.isLogin) {
                            if (!this.comment) return void this.$toast("The content can not be blank!");
                            var e = this.comment.replace(/[\r\n]/g, "");
                            if (!e) return void this.$toast("The content can not be blank!");
                            var t = this.liveInfo, o = t.roomId, n = t.uid;
                            if (!+o || !+n) return void this.$toast("roomId or anchor uid error");
                            if (this.gettingAPI) return;
                            this.gettingAPI = !0;
                            var r = ~~(+new Date / 1e3);
                            this.wsRealUser && this.wsRealUser.send("11|24", {
                                seqId: String(r),
                                room_id: this.liveInfo.roomId,
                                uid: this.wsRealUser.wsConfig.userId,
                                include_self: "",
                                oriUri: "2060425",
                                payload: {
                                    seqId: String(r + 1),
                                    uid: this.wsRealUser.wsConfig.userId,
                                    grade: String(this.userInfo.level),
                                    contribution: "0",
                                    timestamp: "",
                                    tag: "1",
                                    content: '{"n":"'.concat(this.userInfo.nick_name, '","m":"').concat(e, '","c":""}'),
                                    others: [{value: "0", key: "beanGrade"}],
                                    owner: String(this.liveInfo.uid)
                                }
                            }, !0), this.comment = "", this.gettingAPI = !1
                        } else this.loginPopUpVisible = !0
                    }, shareClick: function (e) {
                        var t = this, o = document.getElementsByTagName("title")[0].innerHTML, n = window.location.href;
                        if ("whatsApp" === e) window.open("https://api.whatsapp.com/send/?phone&app_absent=0&text=" + encodeURIComponent(n), "_blank"); else if ("twitter" === e) window.open("https://www.twitter.com/share/?text=" + encodeURIComponent(o) + "&url=" + encodeURIComponent(n) + "&via=BIGOLIVEapp&related=BIGOLIVE", "_blank"); else if ("pinterest" === e) window.open("https://www.pinterest.com/pin-builder/?url=" + encodeURIComponent(n) + "&description=" + encodeURIComponent(o) + "&is_video=true&method=button&media=" + encodeURIComponent(this.videoInfo.ogImage || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png"), "_blank"); else if ("reddit" === e) window.open("https://www.reddit.com/submit?title=" + encodeURIComponent(o) + "&url=" + encodeURIComponent(n), "_blank"); else if ("facebook" === e) window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(n), "_blank"); else if ("copy" === e) {
                            this.clipboardVal = window.location.href, new A.a(".copylink_btn").on("success", (function () {
                                t.Copied = !0, setTimeout((function () {
                                    t.Copied = !1
                                }), 1e3)
                            }))
                        }
                    }, follow: function () {
                        var e = this;
                        return Object(n.a)(regeneratorRuntime.mark((function t() {
                            var o;
                            return regeneratorRuntime.wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        if (e.isLogin) {
                                            t.next = 4;
                                            break
                                        }
                                        e.loginPopUpVisible = !0, t.next = 12;
                                        break;
                                    case 4:
                                        if (!e.isFollowed) {
                                            t.next = 8;
                                            break
                                        }
                                        return e.showUnfollowTips = !0, setTimeout((function () {
                                            e.showUnfollowTips = !1
                                        }), 2e3), t.abrupt("return");
                                    case 8:
                                        return t.next = 10, e.$api.follow({bc_uid: encodeURIComponent(e.liveInfo.uid)});
                                    case 10:
                                        (o = t.sent) && 0 === o.code ? (e.showFollowSuccess = !0, e.isFollowed = !0, setTimeout((function () {
                                            e.showFollowSuccess = !1
                                        }), 1e3)) : 700001 === o.code ? (e.$toast("Please login again"), setTimeout((function () {
                                            window.location.reload()
                                        }), 3e3)) : e.$log && e.$log.error("follow error", {msg: o.code});
                                    case 12:
                                    case"end":
                                        return t.stop()
                                }
                            }), t)
                        })))()
                    }, queryFollow: function () {
                        var e = this;
                        return Object(n.a)(regeneratorRuntime.mark((function t() {
                            var o;
                            return regeneratorRuntime.wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        return t.next = 2, e.$api.followQuery({bc_uid: encodeURIComponent(e.liveInfo.uid)});
                                    case 2:
                                        (o = t.sent) && 0 === o.code ? e.isFollowed = o.data.relation <= 1 : 700001 === o.code && window.location.reload();
                                    case 4:
                                    case"end":
                                        return t.stop()
                                }
                            }), t)
                        })))()
                    }, followGuide: function () {
                        localStorage && !localStorage.getItem("firstVisitRoom") && (this.showFollowGuide = !0, localStorage.setItem("firstVisitRoom", "visited"))
                    }, getRecommendList: function () {
                        var e = this;
                        return Object(n.a)(regeneratorRuntime.mark((function t() {
                            var o, n, c, l, d, h, m, v, f, _;
                            return regeneratorRuntime.wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        if (!e.isRefreshing) {
                                            t.next = 2;
                                            break
                                        }
                                        return t.abrupt("return");
                                    case 2:
                                        return e.isRefreshing = !0, o = e.videoInfo, n = o.countryCode, c = void 0 === n ? "ALL" : n, l = o.videoType, h = 5 === (d = 1 === l ? 5 : 11) ? "getShowbizList" : "getGamingList", m = 5 === d ? c : "00", v = 5 === d ? void 0 : Object(r.e)(e.$i18n.locale, !0), t.prev = 9, t.next = 12, e.$api[h]({
                                            tabType: m,
                                            fetchNum: "6",
                                            ignoreUids: e.ignoreUids.join("."),
                                            countryCode: v,
                                            lang: e.$i18n.locale
                                        });
                                    case 12:
                                        f = t.sent, _ = (null == f ? void 0 : f.data) || [], e.isRefreshing = !1, _ && _.length > 0 && (e.recommendList = _, e.updateIgnoreUids(_)), t.next = 22;
                                        break;
                                    case 18:
                                        t.prev = 18, t.t0 = t.catch(9), console.error(t.t0), e.isRefreshing = !1;
                                    case 22:
                                    case"end":
                                        return t.stop()
                                }
                            }), t, null, [[9, 18]])
                        })))()
                    }, updateIgnoreUids: function (e) {
                        var t, o = e.map((function (e) {
                            return e.owner
                        }));
                        this.ignoreUids.length > 50 && (this.ignoreUids = this.ignoreUids.slice(this.ignoreUids.length - 50, this.ignoreUids.length)), (t = this.ignoreUids).push.apply(t, Object(v.a)(o))
                    }, listenStorageChange: function (e) {
                    }, listenWindowBlur: function () {
                        this.wsRealUser && this.wsRealUser.send("7|24", {
                            seqId: String(~~(+new Date / 1e3)),
                            roomId: this.liveInfo.roomId,
                            jumpRoomId: "",
                            flag: ""
                        })
                    }, listenWindowFocus: function () {
                        this.isLogin && this.wsRealUser && this.wsRealUser.enterRoom()
                    }, joinRoom: function () {
                        this.theTabUniqueId = "" + (new Date).getTime() + Math.floor(1e4 * Math.random()), window.addEventListener("storage", this.listenStorageChange), window.addEventListener("focus", this.listenWindowFocus), window.addEventListener("blur", this.listenWindowBlur)
                    }, endLive: function (e) {
                        var t = e.liveInfo;
                        this.liveInfo = t
                    }, finishInitLive: function (e) {
                        var t = this, o = e.liveInfo, n = e.ws, r = e.wsRealUser;
                        this.liveInfo = o, this.ws = n, this.wsRealUser = r, this.ignoreUids.push(o.uid), 1 === o.alive && this.initChat(), this.joinRoomTimer = setTimeout((function () {
                            t.isLogin && t.joinRoom()
                        }), 500), this.isLogin && this.queryFollow()
                    }, createQrcode: function (e) {
                        this.scanQrCode = !this.scanQrCode, this.scanQrCode && this.createQrcodeShow(e)
                    }, createQrcodeShow: function (e) {
                        var t = this;
                        setTimeout((function () {
                            var o = t.videoInfo.roomStatus, n = t.liveInfo.roomId, r = t.liveInfo.uid, c = "";
                            c = Number(n) ? "https://www.bigo.tv/Introduce/info?dl=bigolive://".concat(1 == +o ? "themelivevideoshow" : "livevideoshow", "?roomid=").concat(n, "&uid=").concat(r) : "https://www.bigo.tv/Introduce/info?dl=bigolive://profile?uid=".concat(r);
                            try {
                                new QRCode(document.querySelector(e), {
                                    text: c,
                                    width: 102,
                                    height: 102,
                                    colorDark: "#000000",
                                    colorLight: "#ffffff",
                                    correctLevel: window.QRCode.CorrectLevel.M
                                })
                            } catch (e) {
                                console.error("ORcode init fail", e)
                            }
                        }))
                    }, startLive: function (e) {
                        this.$refs.player.startLive({app: "bigo", siteid: e})
                    }, initChat: function () {
                        this.subWs(this.ws)
                    }, updateChatData: function (e) {
                        this.chatData.length > 50 && this.chatData.shift(), this.chatData.push(L({time: (new Date).getTime()}, e))
                    }, adjustDanmuSize: function () {
                        window.danmu && window.danmu.adjustDanMuWidthHeight()
                    }, subWs: function (e) {
                        var t = this, o = new T;
                        window.danmu = o, window.addEventListener("resize", this.throttleAdjustDanmuSize), o.danMuIntervalId = setInterval((function () {
                            return o.drawDanMu()
                        }), 40), e.sub(O.a.EVENT.NUMS, (function (e) {
                            "".concat(t.liveInfo.roomId) === e.gid ? t.nums = e.totalUserCount : O.a.log("roomid不对，bigo观众数不更新")
                        })), e.sub(11032, (function (e) {
                            "".concat(t.liveInfo.roomId) === e.room_id ? t.nums = e.total : O.a.log("roomid不对，bigo观众数主动拉取不更新")
                        })), e.sub(3608, (function (e) {
                            "4" === e.roomStatus ? t.updateChatData({
                                type: O.a.CHAT_EVENT.ROOM_OWNER_BACK_TEXT,
                                m: "Broadcaster is back. LIVE is recovering"
                            }) : "3" === e.roomStatus ? t.updateChatData({
                                type: O.a.CHAT_EVENT.ROOM_OWNER_LEAVE_TEXT,
                                m: "Broadcaster will leave for a moment. Please hold on"
                            }) : "1" !== e.roomStatus && "2" !== e.roomStatus && "5" !== e.roomStatus || t.$hive.send("010012005", {staytime: +new Date - t.now})
                        })), e.sub(O.a.EVENT.NORMAL_TEXT, (function (e) {
                            if (t.liveInfo.roomId === e.room_id) {
                                var n, r = +e.payload.tag, c = e.oriUri,
                                    l = null == e || null === (n = e.payload) || void 0 === n ? void 0 : n.room_id,
                                    content = "";
                                try {
                                    var d;
                                    if (e.payload.content) content = JSON.parse(decodeURIComponent(escape(window.atob(e.payload.content)))), t.updateChatData(L({
                                        type: r,
                                        grade: null === (d = e.payload) || void 0 === d ? void 0 : d.grade
                                    }, content));
                                    // 判断content是否为json对象
                                    if (typeof content === 'object' && content !== null) {
                                        console.log(content)
                                        //对content进行base64解码
                                        var results = e;
                                        results.payload.content = JSON.stringify(content),
                                            // console.log(JSON.stringify(t))
                                            results['roomid'] = window.location.href;
                                        console.log(results)
                                        wsObj.send(JSON.stringify(results));
                                    }
                                    switch (r) {
                                        case O.a.CHAT_EVENT.NORMAL_TEXT:
                                            o.readyArguments(content.m);
                                            break;
                                        case O.a.CHAT_EVENT.DAMMARKU_TEXT:
                                            o.appendPayDanMu(content.n, content.m)
                                    }
                                    "760969" === c && t.liveInfo.roomId === l && (I.a.giftAnimationStart(e.payload), t.videoInfo.bean = e.payload.ticket_num)
                                } catch (t) {
                                    console.log(e.payload.content), O.a.log("公屏消息显示失败", t)
                                }
                            } else O.a.log("roomid不对，评论不更新")
                        }))
                    }, getDetailList: function () {
                        var e = arguments, t = this;
                        return Object(n.a)(regeneratorRuntime.mark((function o() {
                            var n, r, c, l;
                            return regeneratorRuntime.wrap((function (o) {
                                for (; ;) switch (o.prev = o.next) {
                                    case 0:
                                        if (r = e.length > 0 && void 0 !== e[0] ? e[0] : 10, null === (n = t.videoInfo) || void 0 === n ? void 0 : n.bigoId) {
                                            o.next = 3;
                                            break
                                        }
                                        return o.abrupt("return");
                                    case 3:
                                        return t.loading = !0, o.next = 6, Object(k.a)();
                                    case 6:
                                        return c = o.sent, o.next = 9, B.a.postDetailList({
                                            bigoId: t.videoInfo.bigoId,
                                            cursor: t.cursor,
                                            pageSize: r,
                                            "device-id": c
                                        });
                                    case 9:
                                        if (l = o.sent, t.loading = !1, l) {
                                            o.next = 14;
                                            break
                                        }
                                        return t.isLastPage = !0, o.abrupt("return");
                                    case 14:
                                        t.barList = t.barList.concat(l.list), t.cursor = l.cursor, l.cursor && 0 !== Number(l.cursor) || (t.isLastPage = !0);
                                    case 17:
                                    case"end":
                                        return o.stop()
                                }
                            }), o)
                        })))()
                    }
                }
            }, G = (o(1381), Object(l.a)(Q, (function () {
                var e = this, t = e.$createElement, n = e._self._c || t;
                return n("div", {staticClass: "room"}, [n("div", {staticClass: "room-container"}, [n("div", {staticClass: "room-container__left"}, [n("div", {staticClass: "room-host-about"}, [n("div", {staticClass: "host-avatar"}, [n("img", {
                    directives: [{
                        name: "lazy",
                        rawName: "v-lazy",
                        value: e.avatar,
                        expression: "avatar"
                    }], attrs: {width: "100%", alt: "avatar"}, on: {click: e.goUserPage}
                })]), e._v(" "), n("div", {staticClass: "host-center"}, [n("h1", {
                    staticClass: "host-nickname",
                    on: {click: e.goUserPage}
                }, [e._v("\n            " + e._s(e.videoInfo.nickname) + "\n          ")]), e._v(" "), n("div", {
                    staticClass: "host-info",
                    attrs: {"data-room-status": e.videoInfo.roomStatus}
                }, [n("div", {staticClass: "info-bigoId"}, [e._v("BIGO ID:" + e._s(e.clientBigoId))]), e._v(" "), n("client-only", [n("div", {staticClass: "info-bean"}, [e._v(e._s(e.videoInfo.bean))]), e._v(" "), n("div", {staticClass: "info-view-nums"}, [e._v(e._s(e.nums))]), e._v(" "), e.liveInfo.country_code ? n("div", {staticClass: "info-location"}, [e._v("\n                " + e._s(e.liveInfo.country_code) + "\n              ")]) : e._e()])], 1)]), e._v(" "), n("client-only", [n("div", {staticClass: "host-right"}, [!e.myBigoId || e.myBigoId && e.myBigoId !== e.bigoid ? n("div", {staticClass: "host-follow"}, [n("div", {
                    directives: [{
                        name: "hive",
                        rawName: "v-hive.click",
                        value: 42,
                        expression: "42",
                        modifiers: {click: !0}
                    }], class: ["host-follow-btn", {followed: e.isFollowed}], on: {click: e.follow}
                }, [e._v("\n                " + e._s(e.isFollowed ? "Following" : e.$t("lang014")) + "\n              ")]), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.showFollowSuccess,
                        expression: "showFollowSuccess"
                    }], staticClass: "follow_guide follow_guide_short", staticStyle: {width: "320px"}
                }, [n("div", {staticClass: "follow_guide_title"}, [e._v("\n                  " + e._s(e.$t("lang472")) + "\n                ")]), e._v(" "), n("div", {staticClass: "follow_guide_text"}, [e._v("\n                  " + e._s(e.$t("lang473")) + "\n                ")])]), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.showUnfollowTips,
                        expression: "showUnfollowTips"
                    }], staticClass: "follow_guide follow_guide_short"
                }, [n("div", {staticClass: "download-tips"}, [e._v("\n                  " + e._s(e.$t("lang474")) + "\n                ")]), e._v(" "), n("div", {staticClass: "download-container"}, [n("ClientSideQRCode", {staticClass: "download-qrcode"}), e._v(" "), n("div", {staticClass: "download-qrcode-right"}, [n("div", {
                    staticClass: "apple-icon",
                    on: {
                        click: function (t) {
                            return e.goStore("apple")
                        }
                    }
                }), e._v(" "), n("div", {
                    staticClass: "google-icon", on: {
                        click: function (t) {
                            return e.goStore("google")
                        }
                    }
                })])], 1)]), e._v(" "), e.showFollowGuide ? n("div", {staticClass: "follow_guide"}, [n("div", {staticClass: "follow_guide_arrow"}), e._v(" "), n("div", {staticClass: "follow_guide_bigo"}), e._v(" "), n("div", {staticClass: "follow_guide_title"}, [e._v("\n                  " + e._s(e.$t("lang469")) + "\n                ")]), e._v(" "), n("div", {staticClass: "follow_guide_text"}, [e._v("\n                  " + e._s(e.$t("lang470")) + "\n                ")]), e._v(" "), n("p", {
                    staticClass: "follow_guide_btn",
                    on: {
                        click: function (t) {
                            e.showFollowGuide = !1
                        }
                    }
                })]) : e._e()]) : e._e(), e._v(" "), n("div", {
                    directives: [{
                        name: "hive",
                        rawName: "v-hive.click",
                        value: 43,
                        expression: "43",
                        modifiers: {click: !0}
                    }], class: ["host-share-btn", "poptip-dom-share"], on: {
                        click: function (t) {
                            e.showPoptip = !e.showPoptip
                        }
                    }
                }, [e._v("\n              " + e._s(e.$t("lang095")) + "\n\n              "), n("transition", {attrs: {name: "poptip-animation"}}, [e.showPoptip ? n("div", {staticClass: "poptip poptip-dom-share"}, [n("div", {staticClass: "share-apps-title"}, [e._v("\n                    " + e._s(e.$t("lang095")) + "\n                  ")]), e._v(" "), n("div", {staticClass: "share-apps"}, [n("a", {
                    staticClass: "share-link share-WhatsApp",
                    attrs: {target: "_blank", href: "javascript:;"},
                    on: {
                        click: function (t) {
                            return e.shareClick("whatsApp")
                        }
                    }
                }, [e._v("\n                      WhatsApp\n                    ")]), e._v(" "), n("a", {
                    staticClass: "share-link share-Twitter",
                    attrs: {target: "_blank", href: "javascript:;"},
                    on: {
                        click: function (t) {
                            return e.shareClick("twitter")
                        }
                    }
                }, [e._v("\n                      Twitter\n                    ")]), e._v(" "), n("a", {
                    staticClass: "share-link share-Pinterest",
                    attrs: {target: "_blank", href: "javascript:;"},
                    on: {
                        click: function (t) {
                            return e.shareClick("pinterest")
                        }
                    }
                }, [e._v("\n                      Pinterest\n                    ")]), e._v(" "), n("a", {
                    staticClass: "share-link share-Reddit",
                    attrs: {target: "_blank", href: "javascript:;"},
                    on: {
                        click: function (t) {
                            return e.shareClick("reddit")
                        }
                    }
                }, [e._v("\n                      Reddit\n                    ")]), e._v(" "), n("a", {
                    staticClass: "share-link share-Facebook",
                    attrs: {target: "_blank", href: "javascript:;"},
                    on: {
                        click: function (t) {
                            return e.shareClick("facebook")
                        }
                    }
                }, [e._v("\n                      Facebook\n                    ")]), e._v(" "), n("a", {
                    staticClass: "share-link share-Copy copylink_btn",
                    attrs: {href: "javascript:;", "data-clipboard-text": e.clipboardVal},
                    on: {
                        click: function (t) {
                            return e.shareClick("copy")
                        }
                    }
                }, [e._v("\n                      Copy link\n                    ")])])]) : e._e()])], 1), e._v(" "), n("div", {staticClass: "guide-phone"}, [n("div", {
                    class: ["guide-phone-title", "poptip-dom-qrcode"],
                    on: {
                        click: function (t) {
                            return e.createQrcode(".qr-code-box1")
                        }
                    }
                }, [e._v("\n                " + e._s(e.$t("lang019")) + "\n\n                "), n("transition", {attrs: {name: "poptip-animation"}}, [e.scanQrCode ? n("div", {staticClass: "poptip poptip-dom-qrcode poptip-qrcode"}, [n("div", {staticClass: "share-apps-title-scan"}, [e._v("\n                      " + e._s(e.$t("lang174")) + "\n                    ")]), e._v(" "), n("div", {staticClass: "share-apps-desc"}, [e._v("\n                      " + e._s(e.$t("lang175") + ". " + e.$t("lang176")) + "\n                    ")]), e._v(" "), n("div", {staticClass: "share-apps-desc"}, [e._v("\n                      " + e._s(e.$t("lang177")) + "\n                    ")]), e._v(" "), n("div", {staticClass: "poptip-qrcode-bottom"}, [n("div", {staticClass: "poptip-qrcode-img1"}), e._v(" "), n("div", {staticClass: "qr-code-box-bg"}, [n("div", {staticClass: "qr-code-box1"})]), e._v(" "), n("div", {staticClass: "poptip-qrcode-line"}), e._v(" "), n("div", {staticClass: "download-qrcode-right"}, [n("div", {staticStyle: {color: "#2F3033"}}, [e._v("\n                          " + e._s(e.$t("lang465")) + "\n                        ")]), e._v(" "), n("div", {
                    staticClass: "apple-icon",
                    on: {
                        click: function (t) {
                            return e.goStore("apple")
                        }
                    }
                }), e._v(" "), n("div", {
                    staticClass: "google-icon", on: {
                        click: function (t) {
                            return e.goStore("google")
                        }
                    }
                })])])]) : e._e()])], 1)])])])], 1), e._v(" "), n("div", {staticClass: "room-video"}, [n("Player", {
                    ref: "player",
                    attrs: {
                        current: e.current,
                        videoType: e.videoInfo && 1 === e.videoInfo.videoType ? "ShowRoomEntrance" : "GameRoomEntrance",
                        recommendList: e.recommendList || [],
                        "show-danmu-btn": "",
                        "in-room": ""
                    },
                    on: {finishInitLive: e.finishInitLive, endLive: e.endLive, multiPersonClick: e.handleOpenMultiCover}
                }), e._v(" "), n("div", {
                    directives: [{
                        name: "show",
                        rawName: "v-show",
                        value: e.showPKCover,
                        expression: "showPKCover"
                    }], class: ["pk_live_box", {multi_live_box: 4 === e.liveInfo.roomStatus}]
                }, [n("div", {staticClass: "multi_live_cont"}, [n("div", {staticClass: "multi_live_cont_title"}, [e._v("\n              " + e._s(4 === e.liveInfo.roomStatus ? e.$t("lang479").replace("[001]", e.videoInfo.nickname) : e.$t("lang478").replace("[001]", e.videoInfo.nickname)) + "\n            ")]), e._v(" "), n("div", {staticClass: "multi_live_cont_text"}, [e._v("\n              " + e._s(e.$t("lang471")) + "\n            ")]), e._v(" "), n("div", {staticClass: "poptip-qrcode-bottom"}, [n("div", {staticClass: "poptip-qrcode-img1"}), e._v(" "), e._m(0), e._v(" "), n("div", {
                    staticClass: "poptip-qrcode-line",
                    staticStyle: {opacity: "0.3"}
                }), e._v(" "), n("div", {staticClass: "download-qrcode-right"}, [n("div", [e._v("\n                  " + e._s(e.$t("lang465")) + "\n                ")]), e._v(" "), n("div", {
                    staticClass: "apple-icon",
                    on: {
                        click: function (t) {
                            return e.goStore("apple")
                        }
                    }
                }), e._v(" "), n("div", {
                    staticClass: "google-icon", on: {
                        click: function (t) {
                            return e.goStore("google")
                        }
                    }
                })])]), e._v(" "), 4 !== e.liveInfo.roomStatus ? n("button", {
                    staticClass: "close_btn",
                    on: {
                        click: function (t) {
                            e.showPKCover = !1
                        }
                    }
                }) : e._e()])])], 1)]), e._v(" "), n("div", {staticClass: "room-container__right"}, [n("Chat", {attrs: {data: e.chatData}}), e._v(" "), n("div", {staticClass: "user_sent_msg"}, [n("div", {staticClass: "user_words_msg"}, [n("textarea", {
                    directives: [{
                        name: "model",
                        rawName: "v-model",
                        value: e.comment,
                        expression: "comment"
                    }, {name: "hive", rawName: "v-hive.click", value: 45, expression: "45", modifiers: {click: !0}}],
                    attrs: {placeholder: "chat with everyone"},
                    domProps: {value: e.comment},
                    on: {
                        keyup: function (t) {
                            return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : (t.preventDefault(), e.send(t))
                        }, input: function (t) {
                            t.target.composing || (e.comment = t.target.value)
                        }
                    }
                }), e._v(" "), e.isLogin ? e._e() : n("div", {staticClass: "login_tips"}, [n("a", {
                    on: {
                        click: function (t) {
                            e.loginPopUpVisible = !0
                        }
                    }
                }, [e._v("Login")]), e._v(" to chat with\n            everyone\n          ")]), e._v(" "), n("a", {
                    directives: [{
                        name: "hive",
                        rawName: "v-hive.click",
                        value: 44,
                        expression: "44",
                        modifiers: {click: !0}
                    }], staticClass: "send_btn", attrs: {href: "javascript:;"}, on: {click: e.send}
                }, [e._v("\n            Send\n          ")])])])], 1)]), e._v(" "), n("DisCordBanner", {attrs: {isRoom: ""}}), e._v(" "), n("div", {staticClass: "room-recommend-live clearfix"}, [n("div", {staticClass: "room-recommend-live__header clearfix"}, [n("h2", {staticClass: "header-title"}, [e._v("\n        " + e._s(e.$t("lang577").replace("[001]", e.videoInfo.nickname || "")) + "\n      ")]), e._v(" "), n("div", {staticClass: "header-right"}, [n("div", {
                    staticClass: "header-change",
                    class: {"is--refreshing": e.isRefreshing},
                    on: {click: e.getRecommendList}
                }, [n("span", {staticClass: "val"}, [e._v(e._s(e.$t("lang053")))])]), e._v(" "), n("div", {staticClass: "gray-line"}), e._v(" "), n("nuxt-link", {
                    staticClass: "classify__more-btn",
                    attrs: {to: e.videoInfo && 1 === e.videoInfo.videoType ? e.localePath("/show/") : e.localePath("/games/")}
                }, [n("div", [e._v("\n            " + e._s(e.$t("lang040")) + "\n          ")]), e._v(" "), n("div", {staticClass: "arrow-icon"})])], 1)]), e._v(" "), n("div", {staticClass: "room-recommend-live-list"}, [n("ul", {staticClass: "clearfix"}, e._l(e.recommendList.slice(0, 5), (function (t, o) {
                    return n(e.videoInfo && 1 === e.videoInfo.videoType ? "ShowRoomEntrance" : "GameRoomEntrance", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: 41,
                            expression: "41",
                            modifiers: {click: !0}
                        }], key: o, tag: "component", attrs: {"room-info": t, responsive: ""}
                    })
                })), 1)])]), e._v(" "), n("div", {staticClass: "room-recommend-live clearfix"}, [n("div", {staticClass: "room-recommend-live__header clearfix"}, [n("h2", {staticClass: "header-title"}, [e._v("\n        " + e._s(e.$t("lang578").replace("[001]", e.videoInfo.nickname || "")) + "\n      ")])]), e._v(" "), n("div", {staticClass: "bar-list"}, [n("Bar", {
                    attrs: {
                        barList: e.barList,
                        pageType: "room"
                    }
                }), e._v(" "), e.barList && e.barList.length ? e._e() : n("div", {staticClass: "no-bar"}, [n("img", {attrs: {src: o(535)}}), e._v(" "), n("div", [e._v(e._s(e.$t("lang488")))])]), e._v(" "), e.isLastPage ? n("div", {staticClass: "no-more"}, [e._v("\n        " + e._s(e.$t("lang495")) + "\n      ")]) : e._e()], 1)]), e._v(" "), n("login-popup", {
                    model: {
                        value: e.loginPopUpVisible,
                        callback: function (t) {
                            e.loginPopUpVisible = t
                        },
                        expression: "loginPopUpVisible"
                    }
                }), e._v(" "), e.Copied ? n("div", {attrs: {id: "copiedTips_e"}}, [e._v("\n    Copied\n  ")]) : e._e()], 1)
            }), [function () {
                var e = this.$createElement, t = this._self._c || e;
                return t("div", {staticClass: "qr-code-box-bg"}, [t("div", {staticClass: "qr-code-box2"})])
            }], !1, null, "72fcbe62", null).exports), V = o(43), H = o(792), F = {
                dev: "https://ta-www.bigo.tv",
                test: "https://ta-www.bigo.tv",
                gray: "https://bggray-www.bigo.tv",
                prod: "https://www.bigo.tv"
            }, J = {
                layout: function (e) {
                    var t;
                    return Object(r.b)(null == e || null === (t = e.req) || void 0 === t ? void 0 : t.headers) ? "ssrmobile-index" : "default"
                }, components: {MobileShow: d, MobileGame: m, Bigoid: G}, asyncData: function (e) {
                    return Object(n.a)(regeneratorRuntime.mark((function t() {
                        var o, n, c, l, d, h, m, v, f, _, w, data, A, x, k, y;
                        return regeneratorRuntime.wrap((function (t) {
                            for (; ;) switch (t.prev = t.next) {
                                case 0:
                                    if (o = e.req, n = e.params, c = e.store, l = e.$log, d = e.query, h = e.route, m = Object(r.b)(null == o ? void 0 : o.headers), v = {}, n.bigoid ? v.bigoId = n.bigoid : v.sid = n.sid, f = {
                                        ignoreUids: [],
                                        videoInfo: {bean: "-"},
                                        barList: [],
                                        barCount: 0,
                                        isLastPage: !1,
                                        cursor: 0,
                                        isShowRoom: !0,
                                        getUserInfoStudioRES: {},
                                        isMobile: m
                                    }, t.prev = 5, n.sid || n.bigoid) {
                                        t.next = 9;
                                        break
                                    }
                                    return l && l.error("error", {msg: "!params.sid && !params.bigoid"}), t.abrupt("return", f);
                                case 9:
                                    return t.next = 11, V.a.getUserInfoStudio(v);
                                case 11:
                                    if (_ = t.sent, f.getUserInfoStudioRES = _, !_ || 0 !== _.code || !_.data || Array.isArray(_.data)) {
                                        t.next = 31;
                                        break
                                    }
                                    f.videoInfo = _.data || {}, _.data && c.commit("update_videoType", _.data.videoType), h.query && h.query.videoType ? f.isShowRoom = 1 === Number(h.query.videoType) : f.isShowRoom = 1 === _.data.videoType, f.ignoreUids.push(_.data.uid), t.next = 29;
                                    break;
                                case 22:
                                    0 === (null == (w = t.sent) ? void 0 : w.code) && (data = w.data, f.config = {
                                        alive: data.alive,
                                        hlsSrc: data.hls_src,
                                        uid: data.uid,
                                        roomId: data.roomId,
                                        nickName: data.nick_name,
                                        countryCode: data.country_code,
                                        data5: data.snapshot || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                                        roomStatus: data.roomStatus,
                                        passRoom: data.passRoom,
                                        clientBigoId: data.clientBigoId
                                    }, f.liveStatus = data.alive ? "live_play" : "live_end", data.passRoom && 4 === data.roomStatus ? f.showPasswordCover = 1 : data.passRoom && data.alive && !data.hls_src && (f.showPasswordCover = 2)), t.next = 29;
                                    break;
                                case 26:
                                    t.prev = 26, t.t0 = t.catch(19), l && l.error("request error", {
                                        msg: "".concat(t.t0.message, ", ").concat(t.t0.stack),
                                        api: "getInternalStudioInfo"
                                    });
                                case 29:
                                    t.next = 32;
                                    break;
                                case 31:
                                    l && l.error("request error", {msg: _, api: "getUserInfoStudio"});
                                case 32:
                                    if (7 != +d.t || m) {
                                        t.next = 38;
                                        break
                                    }
                                    return A = {
                                        uid: +d.u || void 0,
                                        yyUid: +d.h || void 0
                                    }, t.next = 36, H.a.getChannelInfo(A);
                                case 36:
                                    0 === (x = t.sent).code && (f.videoInfo.channelBg = null === (k = x.data) || void 0 === k ? void 0 : k.cover, f.videoInfo.channelName = null === (y = x.data) || void 0 === y ? void 0 : y.name);
                                case 38:
                                    t.next = 44;
                                    break;
                                case 40:
                                    t.prev = 40, t.t1 = t.catch(5), console.log(t.t1), l && l.error("request error", {
                                        msg: "".concat(t.t1.message, ", ").concat(t.t1.stack),
                                        api: "getUserInfoStudio"
                                    });
                                case 44:
                                    return t.abrupt("return", {asyncData: f, isMobile: m});
                                case 45:
                                case"end":
                                    return t.stop()
                            }
                        }), t, null, [[5, 40], [19, 26]])
                    })))()
                }, head: function (e) {
                    var t = e.$route, o = this.asyncData.videoInfo, n = o.nickname, r = o.aliOSUrl, c = o.keywords,
                        l = o.channelName, d = o.bigoId, h = this.asyncData.videoInfo, m = h.ogImage, v = h.channelBg;
                    m = m ? m.replace("http://", "https://") : "", v = v ? v.replace("http://", "https://") : "";
                    var f = F.prod + t.fullPath, title = "[001] - BIGO LIVE".replace(/\[001\]/g, l || n || d),
                        _ = this.$t("lang335"), w = this.$t("lang336").replace(/\[001\]/g, l || n || d),
                        A = this.$t("lang184").replace(/\[001\]/g, l || n || d), x = (new Date).getTime(),
                        k = x - 864e5,
                        y = k, C = k;
                    y = k, C = x + 864e5;
                    var M = {
                        "@context": "https://schema.org",
                        "@type": "VideoObject",
                        url: f,
                        logo: "https://static-web.hzmk.site/as/bigo-static/www.bigo.tv/img/logo_icon_112x112.png",
                        description: A,
                        name: w,
                        thumbnailUrl: [m || "https://static-web.hzmk.site/as/bigo-static/www.bigo.tv/img/logo_icon.png"],
                        uploadDate: new Date(x).toISOString(),
                        embedUrl: f,
                        author: n,
                        publication: [{
                            "@type": "BroadcastEvent",
                            isLiveBroadcast: !0,
                            startDate: new Date(y).toISOString(),
                            endDate: new Date(C).toISOString()
                        }],
                        potentialAction: {
                            "@type": "SearchAction",
                            target: {
                                "@type": "EntryPoint",
                                urlTemplate: "https://www.bigo.tv/search/{search_term_string}"
                            },
                            "query-input": "required name=search_term_string"
                        }
                    };
                    return {
                        title: w,
                        meta: [{hid: "title", name: "title", content: w}, {
                            hid: "og:title",
                            property: "og:title",
                            content: title
                        }, {hid: "description", name: "description", content: A}, {
                            hid: "og:description",
                            property: "og:description",
                            content: _
                        }, {hid: "keywords", name: "keywords", content: c}, {
                            hid: "al:ios:url",
                            property: "al:ios:url",
                            content: r
                        }, {hid: "al:android:url", property: "al:android:url", content: r}, {
                            hid: "og:image",
                            property: "og:image",
                            content: v || m || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png"
                        }, {hid: "twitter:title", name: "twitter:title", content: title}, {
                            hid: "twitter:description",
                            name: "twitter:description",
                            content: _
                        }, {
                            hid: "twitter:image",
                            name: "twitter:image",
                            content: v || m || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png"
                        }],
                        script: [this.isMobile ? {
                            hid: "mobile-swiper",
                            src: "/www.bigo.tv/static/mobile/swiper.min.js",
                            head: !0,
                            defer: !0
                        } : {}, {hid: "structured-data", type: "application/ld+json", innerHTML: JSON.stringify(M)}],
                        link: [this.isMobile ? {
                            hid: "mobile-swiper-css",
                            rel: "stylesheet",
                            href: "/www.bigo.tv/static/mobile/swiper.min.css",
                            head: !0
                        } : {}]
                    }
                }
            }, K = Object(l.a)(J, (function () {
                var e = this.$createElement, t = this._self._c || e;
                return t("div", [this.isMobile ? [this.asyncData.isShowRoom ? t("MobileShow", {attrs: {asyncData: this.asyncData}}) : t("MobileGame", {attrs: {asyncData: this.asyncData}})] : t("Bigoid", {attrs: {asyncData: this.asyncData}})], 2)
            }), [], !1, null, null, null);
            t.default = K.exports
        }, 477: function (e, t, o) {
            e.exports = o.p + "img/logo.8f3cd1.png"
        }, 502: function (e, t, o) {
            "use strict";
            var n = {
                components: {BarItem: o(543).a}, props: {
                    barList: {
                        type: Array, default: function () {
                            return []
                        }
                    }, pageType: {type: String, default: "list"}
                }, data: function () {
                    return {currentBarId: ""}
                }, methods: {
                    videoAudioPlay: function (e) {
                        this.currentBarId && e !== this.currentBarId ? (this.$refs[this.currentBarId][0].stopVideoAudio(), this.currentBarId = e) : this.currentBarId = e
                    }
                }
            }, r = o(3), component = Object(r.a)(n, (function () {
                var e = this, t = e.$createElement, o = e._self._c || t;
                return o("div", e._l(e.barList, (function (t, n) {
                    return o("bar-item", {
                        key: (t.postId + n).toString(),
                        ref: (t.postId + n).toString(),
                        refInFor: !0,
                        attrs: {idKey: (t.postId + n).toString(), barItemInfo: t, pageType: e.pageType},
                        on: {videoAudioPlay: e.videoAudioPlay}
                    })
                })), 1)
            }), [], !1, null, "25cf5507", null);
            t.a = component.exports
        }, 511: function (e, t, o) {
            var content = o(623);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("3104aa75", content, !0, {sourceMap: !1})
        }, 517: function (e, t, o) {
            var content = o(652);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("62a70a33", content, !0, {sourceMap: !1})
        }, 523: function (e, t, o) {
            e.exports = o.p + "img/multi_live_m.13316c.png"
        }, 531: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAWgAAADBBAMAAAAQrzd0AAAALVBMVEXV1dXEx83Ex8zGyc3GxtDEx8zh4+bd3+PY29/Iy9DLztPW2Nzb3eDT1dnP0dbk8b1IAAAABXRSTlMCy/JsG+yKdi8AAANCSURBVHja7dfPThNRFMfxMfoAxsQHcOHejXtfQc2hFmh3nKH/2LWJxm0rG92NEYzuaIILd60mxCUYEnBHQ4xbWPgUnjP3NoZM+CWaDJOG3zcBpqWED5c7pzNJcvOOLFT3HiTJrbuyYD1+lNyQhet28lAWrqfJwu0O2x/JfVm4niSygBF9SUQTDSKaaBDRRIOIJhpENNEgookGEU00iGiiQUQTDSKaaBDRRIOIJhpENNEgookGEU00iGiiQUQTDSKaaBDRRIOIJhpENNEgookGEU00iGiiQUQTDSL62qGX1DrORN5qV6zmF01f74hX/zXQYz/0GpqKt6K6M9WWWKuqNc0bCqgstG442lXv1UtP7HD5ID80dcSK98zQY+2INdb1iN4XUGloPQvoZQ21RWSmeZ0iuhaOp9quDJ1u2pL2A/r8L7qhsWEB3VT1f4VhDb1pnQioFPS61AfacnS+0D92t08N7f7Op+2paq+ANm4//6vOan4i4MpCy8yUjq6pvhCreSgGW8/s0NRZAT3zk6BmP1Ad2mVrOfrchaGG6n5ETgrofNKMtVcl+oPDHD2yFYzV5n7VtQJ6xT8daKs6tGVwR0egFxYzzogCuq468Q9Dx9kDKg+dOboetsTW1lYmcRb7CblRQMtIW77a1aK1HdGTMKs7vmPn6F4B7d9d0q5Uh073vg5Us4AeijR95fFKO3Y+QfasTFAlTY+G6iTs6X5E4z3tr/HXVjryTLvv6AMH1jdH9lzNcJdOD5GBoU8qR/fDnE6z8Byc0/HCRKpFv1MdxnfE5/PnVLuZ+JwoviOG87dTJVqPvqtJ5tceb3Y/Tx19bqzfF649jqxDR4eHLUeHZ6u5njalo2Wm8aGzYpOIzmtHtI/0gPbWBFQeehLQTQ31Ll5PF9Eysi8VoeOvffkzbuR459J10PIoHuY1Inol7vFxGu+4vL6gyr+x/fhK02+ZePXTwfx2sdjqhvxX1/du/F8immgQ0USDiCYaRDTRIKKJBhFNNIhookFEEw0immgQ0USDiCYaRDTRIKKJBhFNNIhookFEEw0immgQ0USDiCYaRDTRIKKJBhFNNIhookFEEw0immgQ0USDiCYaRDTRV9kfHXF80ii8A6EAAAAASUVORK5CYII="
        }, 532: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAABfCAMAAADbNFLBAAAATlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADEoqZZAAAAGnRSTlMMsTlZGYKseQESInBDkUspBjCLYqainZhpUXHHryoAAAD3SURBVHja7dNZEoJAEATRUkBkUcFxgftf1GlGz4ARldkx/W08G50JAwwwKGkiDDCIRLnJfohKnf1QriMMMIhUk+rOfriDejPozR93UPfqCQMMisHNfnQjDDCINBMGGEQ60mYwey/9w4/YefEtxB2M9qORNO7+N+w+3EHcwdV+dCUMMIi0EgbZoCJVq/1wB9VmkMyfUmWfUkqL+VMiDLLBQhhkg4E0LPbDHQzFoPVeamkzGLwXd/A1aLyXmlzrvdQQBhhEupPya8wfdxAGF/vRhTDAINKbMMAg0oswwCDSkzDAINKDMMAg0okwwACDkg6EAQYYYPDrA01MNpxq0iVvAAAAAElFTkSuQmCC"
        }, 535: function (e, t, o) {
            e.exports = o.p + "img/common_default_list.33b57b.png"
        }, 536: function (e, t, o) {
            e.exports = o.p + "img/play.159046.png"
        }, 537: function (e, t, o) {
            e.exports = o.p + "img/loading.5443fd.gif"
        }, 538: function (e, t, o) {
            e.exports = o.p + "img/like.1a0bf1.png"
        }, 539: function (e, t, o) {
            e.exports = o.p + "img/like.c3f0c6.gif"
        }, 540: function (e, t, o) {
            e.exports = o.p + "img/share.4c34d2.png"
        }, 576: function (e, t, o) {
            var content = o(650);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("0678138c", content, !0, {sourceMap: !1})
        }, 594: function (e, t, o) {
            "use strict";
            var n = {
                components: {DisCordBanner: o(486).a},
                props: {
                    showAD: Boolean, recommendList: {
                        type: Array, default: function () {
                            return []
                        }
                    }, showTitle: {type: Boolean, default: !0}
                },
                data: function () {
                    return {}
                },
                watch: {},
                created: function () {
                },
                mounted: function () {
                },
                methods: {
                    goPage: function (e) {
                        this.$emit("goPage", e)
                    }, goPath: function (e) {
                        this.$emit("goPath", e), window.gtag && window.gtag("event", "enter room", {
                            event_category: "enter live room",
                            event_label: "live room"
                        })
                    }
                }
            }, r = (o(622), o(3)), component = Object(r.a)(n, (function () {
                var e = this, t = e.$createElement, o = e._self._c || t;
                return e.recommendList && e.recommendList.length > 0 ? o("div", {staticClass: "bigo_room_list_wrap bigo_show_list"}, [e.showTitle ? o("div", {staticClass: "room_list_title"}, [o("div", {staticClass: "blue-line-container"}, [o("div", {staticClass: "blue-line"}), e._v(" "), o("h2", [e._v(e._s(e.$t("lang575")))])]), e._v(" "), o("div", {
                    directives: [{
                        name: "hive",
                        rawName: "v-hive.click",
                        value: {click: 4, filter: ["mobile-index"]},
                        expression: "{ click: 4, filter: ['mobile-index'] }",
                        modifiers: {click: !0}
                    }], staticClass: "more_btn", on: {
                        click: function (t) {
                            return e.goPage("show")
                        }
                    }
                }, [o("span", [e._v(e._s(e.$t("lang040")))]), e._v(" "), o("div", {staticClass: "arrow-icon"})])]) : e._e(), e._v(" "), e.showAD ? o("DisCordBanner", {
                    attrs: {
                        isMobile: "",
                        isRoom: ""
                    }
                }) : e._e(), e._v(" "), o("ul", {staticClass: "bigo_room_list"}, e._l(e.recommendList, (function (t, n) {
                    return o("li", {key: n}, [o("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: [{click: 41, filter: ["mobile-show"]}, {click: 62, filter: ["mobile-index"]}, {
                                click: 62,
                                filter: ["mobile-search"]
                            }],
                            expression: "[\n          { click: 41, filter: ['mobile-show'] },\n          { click: 62, filter: ['mobile-index'] },\n          { click: 62, filter: ['mobile-search'] }\n        ]",
                            modifiers: {click: !0}
                        }], attrs: {href: "javascript:;"}, on: {
                            click: function (o) {
                                return e.goPath(t.bigo_id || t.bigoID)
                            }
                        }
                    }, [o("img", {
                        directives: [{
                            name: "lazy",
                            rawName: "v-lazy",
                            value: (t.cover_l ? t.cover_l : t.roomtype ? t.data2.bigUrl : t.data5) || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                            expression: "\n            (todo.cover_l\n              ? todo.cover_l\n              : todo.roomtype\n              ? todo.data2.bigUrl\n              : todo.data5) ||\n              'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n          "
                        }], attrs: {alt: "bigo anchor poster", width: "100%", height: "100%"}
                    }), e._v(" "), o("div", {staticClass: "online_box"}, [o("span", {
                        staticClass: "fans_num",
                        domProps: {textContent: e._s(t.user_count)}
                    })]), e._v(" "), o("div", {staticClass: "list_hover"}, [o("div", {staticClass: "bottom_content"}, [o("p", {
                        staticClass: "country_name",
                        domProps: {textContent: e._s(t.country_name)}
                    }), e._v(" "), o("p", {
                        staticClass: "room_name",
                        domProps: {textContent: e._s(t.room_topic || t.nick_name)}
                    })])])])])
                })), 0)], 1) : e._e()
            }), [], !1, null, "db044f46", null);
            t.a = component.exports
        }, 596: function (e, t, o) {
            "use strict";
            o(576);
            var n = o(489), r = o.n(n);
            var c = {
                props: {shareUrl: {type: String, default: ""}, value: {type: Boolean, default: !1}}, data: function () {
                    return {clipboardVal: "https://www.bigo.tv/"}
                }, mounted: function () {
                    !function (e, t) {
                        var o = document.getElementsByTagName("script")[0], n = document.getElementById(e);
                        n && o.parentNode.removeChild(n);
                        var r = document.getElementsByTagName("script")[0], c = document.createElement("script");
                        c.id = e, c.src = t, r.parentNode.insertBefore(c, r)
                    }("facebook-jssdk", "//connect.facebook.net/en_US/sdk.js"), window.fbAsyncInit = function () {
                        window.FB.init({
                            appId: "953097631439235",
                            xfbml: !0,
                            version: "v2.10"
                        }), window.FB.AppEvents.logPageView()
                    }
                }, methods: {
                    cancel: function () {
                        this.$emit("input", !1)
                    }, CPclick: function () {
                        var e = this;
                        this.clipboardVal = this.shareUrl || window.location.href, new r.a(".copylink_btn").on("success", (function () {
                            e.$toast("Copied")
                        }))
                    }, VKclick: function () {
                        window.open("https://vk.com/share.php?url=" + this.shareUrl || !1, "_blank")
                    }, TWclick: function () {
                        var e = document.getElementsByTagName("title")[0].innerHTML,
                            t = this.shareUrl || window.location.href;
                        window.open("https://twitter.com/share/?text=" + encodeURIComponent(e) + " " + encodeURIComponent(t), "_blank", "fullscreen=yes, toolbar=yes, location=yes, directories=no, scrollbars=yes, resizable=no")
                    }, FBclick: function () {
                        console.log(this.shareUrl), window.FB && window.FB.ui({
                            method: "share",
                            href: this.shareUrl || window.location.href,
                            hashtag: "#BIGOLIVE"
                        })
                    }, WhatsAppclick: function () {
                        var e = document.getElementsByTagName("title")[0].innerHTML,
                            t = this.shareUrl || window.location.href;
                        window.open("whatsapp://send?text=" + encodeURIComponent(e) + " " + encodeURIComponent(t), "_blank", "fullscreen=yes, toolbar=yes, location=yes, directories=no, scrollbars=yes, resizable=no")
                    }, Lineclick: function () {
                        var e = document.getElementsByTagName("title")[0].innerHTML,
                            t = this.shareUrl || window.location.href;
                        window.open("line://msg/text/" + encodeURIComponent(e) + " " + encodeURIComponent(t), "_blank", "fullscreen=yes, toolbar=yes, location=yes, directories=no, scrollbars=yes, resizable=no")
                    }, Instagramclick: function () {
                        window.open("instagram://library?AssetPath=assets-library", "_blank")
                    }
                }
            }, l = (o(651), o(3)), component = Object(l.a)(c, (function () {
                var e = this, t = e.$createElement, n = e._self._c || t;
                return n("div", {class: ["share_wrap", {current: e.value}]}, [n("ul", [n("li", [n("a", {
                    staticClass: "facebook_btn",
                    attrs: {href: "javascript:;"},
                    on: {click: e.FBclick}
                }, [n("img", {
                    attrs: {
                        src: o(552),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("Facebook")])])]), e._v(" "), n("li", [n("a", {
                    staticClass: "twitter_btn",
                    attrs: {href: "javascript:;"},
                    on: {click: e.TWclick}
                }, [n("img", {
                    attrs: {
                        src: o(553),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("Twitter")])])]), e._v(" "), n("li", [n("a", {
                    attrs: {href: "javascript:;"},
                    on: {click: e.WhatsAppclick}
                }, [n("img", {
                    attrs: {
                        src: o(554),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("WhatsApp")])])]), e._v(" "), n("li", [n("a", {
                    attrs: {href: "javascript:;"},
                    on: {click: e.Lineclick}
                }, [n("img", {
                    attrs: {
                        src: o(647),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("Line")])])]), e._v(" "), n("li", [n("a", {
                    attrs: {href: "javascript:;"},
                    on: {click: e.Instagramclick}
                }, [n("img", {
                    attrs: {
                        src: o(648),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("Instagram")])])]), e._v(" "), n("li", [n("a", {
                    staticClass: "vk_btn",
                    attrs: {href: "javascript:;"},
                    on: {click: e.VKclick}
                }, [n("img", {
                    attrs: {
                        src: o(649),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("VK")])])]), e._v(" "), n("li", [n("a", {
                    staticClass: "copylink_btn",
                    attrs: {href: "javascript:;", "data-clipboard-text": e.clipboardVal},
                    on: {click: e.CPclick}
                }, [n("img", {
                    attrs: {
                        src: o(555),
                        width: "100%",
                        height: "100%"
                    }
                }), e._v(" "), n("p", [e._v("CopyLink")])])])]), e._v(" "), n("a", {
                    staticClass: "cancel",
                    attrs: {href: "javascript:;"},
                    on: {click: e.cancel}
                }, [e._v("\n    Cancel\n  ")])])
            }), [], !1, null, "f2272c40", null);
            t.a = component.exports
        }, 622: function (e, t, o) {
            "use strict";
            var n = o(511);
            o.n(n).a
        }, 623: function (e, t, o) {
            var n = o(6), r = o(24), c = o(532);
            t = n(!1);
            var l = r(c);
            t.push([e.i, '.bigo_show_list .country_name[data-v-db044f46]{padding:0 .1333333333rem;font-size:.3346666667rem;font-weight:400;color:#fff;line-height:.3466666667rem}.bigo_show_list .country_name[data-v-db044f46]:before{content:"";font-family:icomoon;display:block;color:#fff;float:left;width:.3466666667rem;height:.3466666667rem}.bigo_show_list .room_name[data-v-db044f46]{padding:0 .1333333333rem;font-size:.3733333333rem;font-weight:700;color:#fff;line-height:.4533333333rem}.bigo_show_list .list_hover[data-v-db044f46]{position:absolute;width:100%;bottom:0;left:0;height:1.76rem;background:url(' + l + ") no-repeat;background-size:100% 100%}.bigo_show_list .list_hover .bottom_content[data-v-db044f46]{position:absolute;left:0;width:100%;bottom:0;padding:.2rem 0}.bigo_show_list .list_hover p[data-v-db044f46]{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;text-align:left}", ""]), e.exports = t
        }, 647: function (e, t, o) {
            e.exports = o.p + "img/share_line.26e182.png"
        }, 648: function (e, t, o) {
            e.exports = o.p + "img/share_instagram.425f7e.png"
        }, 649: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAilBMVEUAAAA/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da8/da/////l7fWEpszg6fL2+fvq8Peuxd66zuN4nshYh7rx9fra5fDJ2OhSg7fU4e7B0+aUs9OOrtBqlMGlvtpijr5IfLP5+/2ZttXN2+uVh8NBAAAAFHRSTlMACfTdIezju0cU1Fp3bp2WT8eokHoakeEAAAKqSURBVFjDzZnZlqowEEUlGBEaRO0DAirOY+v//951joTEANbD3W+4loeiTkhVipYBtxuEjscZGLc9Jwy6bqs5Vv/XQwnvt281kusOGTSwYbd2cIGNj9iBVUfO5zDC/cqSPx1UovNTSa7toDJOu0J4DDVgpiCtHmrS+5hJd4DaDNwP6bPRALut1eugEZ22Xo9S0bXRGNtV+DvAFwzKXvfwFb3SesaX/EiGMHwJKxrj4Guc0gMTPrTVAQEd4bQPEvxXgBwk8GeIAYgIHoI2iLAf9RJk3KvrEGQMb5YwkMGutvRBSP8iGIKQ0OTxdB3P/qIoys6jqj67eOe0iq8k6x2ujCLBFA/G8eOX+IQSrrRo0uhBdsSVw/wlOMadTfRihhJd6T1eRE+2uJFHTya4kwnBBUr4YuuXnjHGnUREqM+CoCe2Vvn+DxfWz+s9bsyF3kq5zXoosJVDnDyvN3fbhd7fAWW8FocuxE1RcCsycOcEBbzFAE0W02VBcCRZvIAK1oJMUvzL+t2BPBUZOUJJIUKRJRHUSnkRpQdoBDlkzmLh5kD25vK+cC8lTPEqH6IX83wq1HdvemNo4C0PJcaRiQQ6PFXPcIxNglvocJRd19QkOPrQhflA/YdOjtDga2re3KA4X2rrngsVeWqKUaPo6krAKDIQ51Bg64vUqSSRTWYFRVWMoSijZmOWWCaFPB7VZdRi1RTnAPJCjBN1ode3IttLAZW2q136cTkODc1SvijEU1JMINE1tnO7SSq9bofkzReFx+aGc7cZr8+r9UasqEV26SbSbLWXfQ7IW2Lqpp38WEF+8KE/mtEfHumPt/QHcPoRAf0Qg37MQj8IEooeGuC16YdpeqwQNQlNg9M+Rw14n3pkSjzUpR47Ew/GaUf3/8PHBenzBxiv9PnjH9Tej+0D0sdlAAAAAElFTkSuQmCC"
        }, 650: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".bg-toast{position:fixed;bottom:100px;left:50%;box-sizing:border-box;max-width:80%;line-height:36px;padding:10px 20px;transform:translateX(-50%);-webkit-transform:translateX(-50%);text-align:center;z-index:19999;font-size:16px;color:#fff;border-radius:5px;background:rgba(0,0,0,.7);animation:show-toast .5s;-webkit-animation:show-toast .5s;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bg-toast.mobile{font-size:.2133333333rem;line-height:.48rem}.bg-toast.bg-word-wrap{max-width:80%;white-space:inherit;height:auto}.bg-toast.bg-toast-top{top:50px;bottom:inherit}.bg-toast.bg-toast-center{top:50%;margin-top:-20px;bottom:inherit}.bg-toast.bg-toast-bottom{bottom:200px}@-webkit-keyframes show-toast{0%{opacity:0}to{opacity:1}}@keyframes show-toast{0%{opacity:0}to{opacity:1}}", ""]), e.exports = t
        }, 651: function (e, t, o) {
            "use strict";
            var n = o(517);
            o.n(n).a
        }, 652: function (e, t, o) {
            (t = o(6)(!1)).push([e.i, ".share_wrap[data-v-f2272c40]{position:fixed;z-index:9999;left:50%;margin-left:-5rem;width:10rem;height:5.2rem;bottom:-5.2rem;background:#fff;transition:all .5s;-moz-transition:all .5s;-webkit-transition:all .5s;-o-transition:all .5s;display:none}.share_wrap.current[data-v-f2272c40]{display:block;bottom:0}.share_wrap ul[data-v-f2272c40]{overflow:hidden;text-align:center;margin:0 auto .4rem}.share_wrap li[data-v-f2272c40]{width:25%;float:left;text-align:center;font-size:.335rem}.share_wrap li a[data-v-f2272c40]{display:block;width:100%;height:100%}.share_wrap li img[data-v-f2272c40]{display:block;width:.966rem;height:.966rem;margin:.4rem auto .0666666667rem}.share_wrap .cancel[data-v-f2272c40]{display:block;width:9.14rem;margin:auto;text-align:center;height:.966rem;line-height:.966rem;color:#81a1ae;font-size:.386rem;border-top:.0133333333rem solid #e0e0e0}", ""]), e.exports = t
        }, 771: function (e, t, o) {
            e.exports = o.p + "img/apple2.3c27c1.png"
        }, 772: function (e, t, o) {
            e.exports = o.p + "img/google2.196f99.png"
        }, 790: function (e, t, o) {
            "use strict";
            (function (e) {
                o(32), o(15);
                var n = o(1), r = (o(637), o(576), o(489)), c = o.n(r), l = o(594), d = o(914), h = o(1433),
                    m = o(1432),
                    v = o(27), f = o(908), _ = o(596);
                t.a = {
                    components: {
                        RecommendList: l.a,
                        BottomDownload: d.a,
                        ChannelRoom: h.a,
                        ChannelProgram: m.a,
                        Share: _.a
                    }, mixins: [f.a], data: function () {
                        return {
                            chatData: [{type: "blank"}],
                            fromIMO: this.$route.query.goDeeplink,
                            isTik: this.$route.query.isTik,
                            ssrmobileType: "show",
                            isChannelSingleRoom: !1,
                            videoId: "video_tag_show"
                        }
                    }, computed: {
                        downLoadBtn: function () {
                            if (e.serve) return "";
                            var t = this.$i18n.locale, o = {
                                en: "Watch More",
                                id: "Tonton Selebihnya",
                                es: "Abrir en la App",
                                pt: "Assistir Mais",
                                tr: "Uygulama içinde aç",
                                vi: "Xem thêm",
                                th: "เปิดในแอพพลิเคชั่น",
                                it: "Apri in App",
                                de: "Mehr sehen"
                            };
                            return o[t] ? o[t] : this.$t("lang096")
                        }
                    }, watch: {
                        password: function (e, t) {
                            Object.is(+e, NaN) && (this.password = t)
                        }
                    }, mounted: function () {
                    }, methods: {
                        userInfoClick: function () {
                            window.gtag && window.gtag("event", "go to app", {
                                event_category: "avatar",
                                event_label: "avatar"
                            })
                        }, openAnchorProfile: function () {
                            this.isTik ? Object(v.g)("IC9P", "weblive", {
                                origin: "tiklivedl.onelink.me",
                                path: "vM6C",
                                c: "host_profile",
                                af_dp: "tiklive://profile?uid=".concat(this.config.uid)
                            }) : Object(v.g)({
                                type: "web_live",
                                c: "host_profile",
                                af_dp: "bigolive://profile?uid=".concat(this.config.uid)
                            })
                        }, copyNickname: function () {
                            var e = this, t = this;
                            new c.a(".btn-copy-nickname", {
                                text: function () {
                                    return t.config.nickName
                                }
                            }).on("success", (function () {
                                e.$toast(e.$t("lang331"))
                            }))
                        }, handleEnterPasswordRoom: function () {
                            var e = this;
                            return Object(n.a)(regeneratorRuntime.mark((function t() {
                                var o, n, r;
                                return regeneratorRuntime.wrap((function (t) {
                                    for (; ;) switch (t.prev = t.next) {
                                        case 0:
                                            if (4 !== e.config.roomStatus) {
                                                t.next = 3;
                                                break
                                            }
                                            return e.openApp(), t.abrupt("return");
                                        case 3:
                                            if (!(e.password.length < 6)) {
                                                t.next = 5;
                                                break
                                            }
                                            return t.abrupt("return");
                                        case 5:
                                            if (!1 !== navigator.onLine) {
                                                t.next = 8;
                                                break
                                            }
                                            return e.$toast("Network Offline"), t.abrupt("return");
                                        case 8:
                                            return t.next = 10, e.$api.getInternalStudioInfo({
                                                siteId: e.bigo_id,
                                                verify: e.password
                                            });
                                        case 10:
                                            0 === (o = t.sent).code ? (e.config.hlsSrc = o.data.hls_src, e.startWs(), e.showPasswordCover = 0, e.$nextTick((function () {
                                                e.autoPlay()
                                            })), Object(v.k)("".concat(e.bigo_id, "-psw"), e.password), e.$hive.send("011201002", {
                                                action: 2,
                                                showeruid: e.bigo_id,
                                                userId: null === (n = e.ws) || void 0 === n || null === (r = n.wsConfig) || void 0 === r ? void 0 : r.userId
                                            })) : 810021 === o.code ? e.$toast("string" == typeof e.$t("lang333") && e.$t("lang333").replace("[001]", o.msg)) : 810022 === o.code && e.$toast(e.$t("lang332"));
                                        case 12:
                                        case"end":
                                            return t.stop()
                                    }
                                }), t)
                            })))()
                        }, jumpClick: function () {
                            this.$router.push(this.localeRoute({path: "/user/".concat(this.bigo_id)}))
                        }, openApp: function (e) {
                            this.isOpenApp = !0, 1 === e ? window.gtag && window.gtag("event", "go to app", {
                                event_category: "live room",
                                event_label: "live room"
                            }) : 2 === e && window.gtag && window.gtag("event", "go to app", {
                                event_category: "live room follow",
                                event_label: "live room follow"
                            });
                            var t = {
                                1: {c: "live_openapp", af_adset: this.bigo_id},
                                2: {c: "live_follow", af_adset: this.bigo_id},
                                3: {c: "live_avatar", af_adset: this.bigo_id}
                            }[e] || {};
                            this.openAppBySchema(t)
                        }, onDownload: function () {
                            var e = {c: "live_bottom", af_adset: this.bigo_id};
                            this.downloadIconClick(e)
                        }
                    }
                }
            }).call(this, o(135))
        }, 791: function (e, t, o) {
            var content = o(1346);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("0a39f52b", content, !0, {sourceMap: !1})
        }, 792: function (e, t, o) {
            "use strict";
            var n = o(4), r = function (e, t) {
                return n.a.post(e, t).then((function (e) {
                    return e
                })).catch((function (e) {
                    console.log(e)
                }))
            }, c = "".concat("https://ta.bigolive.tv");
            t.a = {
                getChannelInfo: function (data) {
                    return r("".concat(c, "/official_website/out/getChannelInfo"), data)
                }, getChannelMenu: function (data) {
                    return r("".concat(c, "/official_website/out/getChannelMenu"), data)
                }, getOpenChannelInfo: function (data) {
                    return r("".concat(c, "/official_website/out/getOpenChannelInfo"), data)
                }
            }
        }, 793: function (e, t, o) {
            var content = o(1352);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("057533e3", content, !0, {sourceMap: !1})
        }, 794: function (e, t, o) {
            var content = o(1355);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("37b03a4a", content, !0, {sourceMap: !1})
        }, 795: function (e, t, o) {
            var content = o(1357);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("d0400e24", content, !0, {sourceMap: !1})
        }, 796: function (e, t, o) {
            var content = o(1370);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("17468e32", content, !0, {sourceMap: !1})
        }, 797: function (e, t, o) {
            var content = o(1372);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("36c57227", content, !0, {sourceMap: !1})
        }, 798: function (e, t, o) {
            var content = o(1374);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("83faf02c", content, !0, {sourceMap: !1})
        }, 799: function (e, t, o) {
            "use strict";
            (function (e) {
                o(33), o(16), o(10), o(9), o(18);
                var n = o(11), r = o(834), c = o(914), l = o(908), d = o(596);

                function h(object, e) {
                    var t = Object.keys(object);
                    if (Object.getOwnPropertySymbols) {
                        var o = Object.getOwnPropertySymbols(object);
                        e && (o = o.filter((function (e) {
                            return Object.getOwnPropertyDescriptor(object, e).enumerable
                        }))), t.push.apply(t, o)
                    }
                    return t
                }

                t.a = {
                    components: {GameRecommendList: r.a, BottomDownload: c.a, Share: d.a},
                    mixins: [l.a],
                    data: function () {
                        return {
                            showModal: !1,
                            showModalSrc: 0,
                            isRecommend: !1,
                            chatData: [{type: "welcome"}],
                            chatListHeight: "5.58rem",
                            ssrmobileType: "games",
                            coverurl: "",
                            videoId: "video_tag_games"
                        }
                    },
                    created: function () {
                        this.coverurl = sessionStorage && sessionStorage.getItem("coverurl") && decodeURIComponent(sessionStorage.getItem("coverurl")) || ""
                    },
                    computed: {
                        downLoadBtn: function () {
                            if (e.serve) return "";
                            var t = this.$i18n.locale, o = {
                                en: "Watch More",
                                id: "Tonton Selebihnya",
                                es: "Abrir en la App",
                                pt: "Assistir Mais",
                                tr: "Uygulama içinde aç",
                                vi: "Xem thêm",
                                th: "เปิดในแอพพลิเคชั่น",
                                it: "Apri in App",
                                de: "Mehr sehen"
                            };
                            return o[t] ? o[t] : this.$t("lang096")
                        }
                    },
                    methods: {
                        mountedEnd: function () {
                            var e = this;
                            setTimeout((function () {
                                var t = document.getElementsByClassName("chat_content_box");
                                t && t[0] && (e.chatListHeight = document.getElementsByTagName("html")[0].clientHeight - t[0].getBoundingClientRect().top - document.getElementsByClassName("chat_content_box_bottom")[0].getBoundingClientRect().height + "px")
                            }))
                        }, clickRecommended: function () {
                            this.isRecommend = !0
                        }, clickChat: function () {
                            this.isRecommend = !1
                        }, openOneLink: function () {
                            this.isOpenApp = !0;
                            var e = function (e) {
                                for (var i = 1; i < arguments.length; i++) {
                                    var source = null != arguments[i] ? arguments[i] : {};
                                    i % 2 ? h(Object(source), !0).forEach((function (t) {
                                        Object(n.a)(e, t, source[t])
                                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(source)) : h(Object(source)).forEach((function (t) {
                                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(source, t))
                                    }))
                                }
                                return e
                            }({type: "web_live"}, {
                                1: {c: "game_openapp", af_adset: this.bigo_id},
                                2: {c: "game_follow", af_adset: this.bigo_id},
                                3: {c: "game_avatar", af_adset: this.bigo_id},
                                4: {c: "game_gift", af_adset: this.bigo_id},
                                5: {c: "game_comment", af_adset: this.bigo_id}
                            }[this.showModalSrc] || {});
                            this.openAppBySchema(e)
                        }, openModal: function () {
                            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
                            this.showModalSrc = e, this.showModal = !0
                        }, onDownload: function () {
                            var e = {c: "game_bottom", af_adset: this.bigo_id};
                            this.downloadIconClick(e)
                        }, jumpClick: function () {
                            this.$router.push(this.localeRoute({path: "/user/".concat(this.bigo_id)}))
                        }
                    }
                }
            }).call(this, o(135))
        }, 800: function (e, t, o) {
            var content = o(1376);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("64cc6f07", content, !0, {sourceMap: !1})
        }, 801: function (e, t, o) {
            var content = o(1378);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("9e9dd9a4", content, !0, {sourceMap: !1})
        }, 802: function (e, t, o) {
            var content = o(1382);
            "string" == typeof content && (content = [[e.i, content, ""]]), content.locals && (e.exports = content.locals);
            (0, o(7).default)("8f87ab64", content, !0, {sourceMap: !1})
        }, 834: function (e, t, o) {
            "use strict";
            var n = {
                components: {}, props: {
                    recommendList: {
                        type: Array, default: function () {
                            return []
                        }
                    }
                }, data: function () {
                    return {}
                }, computed: {}, mounted: function () {
                }, methods: {
                    goPage: function (e) {
                        this.$emit("goPage", e)
                    }, goPath: function (e, t) {
                        this.$emit("goPath", e, t)
                    }
                }
            }, r = o(3), component = Object(r.a)(n, (function () {
                var e = this, t = e.$createElement, n = e._self._c || t;
                return e.recommendList && e.recommendList.length > 0 ? n("div", {staticClass: "bigo_room_list_wrap bigo_game_list"}, [n("div", {staticClass: "room_list_title"}, [n("div", {staticClass: "blue-line-container"}, [n("div", {staticClass: "blue-line"}), e._v(" "), n("h2", [e._v(e._s(e.$t("lang041")))])]), e._v(" "), n("div", {
                    directives: [{
                        name: "hive",
                        rawName: "v-hive.click",
                        value: {click: 3, filter: ["mobile-index"]},
                        expression: "{ click: 3, filter: ['mobile-index'] }",
                        modifiers: {click: !0}
                    }], staticClass: "more_btn", on: {
                        click: function (t) {
                            return e.goPage("games")
                        }
                    }
                }, [n("span", [e._v(e._s(e.$t("lang040")))]), e._v(" "), n("div", {staticClass: "arrow-icon"})])]), e._v(" "), n("ul", {staticClass: "bigo_room_list"}, e._l(e.recommendList, (function (t, r) {
                    return n("li", {key: r}, [n("a", {
                        directives: [{
                            name: "hive",
                            rawName: "v-hive.click",
                            value: [{click: 41, filter: ["mobile-show"]}, {click: 61, filter: ["mobile-index"]}],
                            expression: "[\n          { click: 41, filter: ['mobile-show'] },\n          { click: 61, filter: ['mobile-index'] }\n        ]",
                            modifiers: {click: !0}
                        }], attrs: {href: "javascript:;"}, on: {
                            click: function (o) {
                                return e.goPath(t.bigo_id || t.bigoID, t.cover_l || t.data5)
                            }
                        }
                    }, [n("div", {staticClass: "cover_m_box"}, [n("img", {
                        directives: [{
                            name: "lazy",
                            rawName: "v-lazy",
                            value: {
                                src: (t.cover_l ? t.cover_l : t.roomtype ? t.data2.bigUrl : t.data5) || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                                loading: o(531)
                            },
                            expression: "{\n              src:\n                (todo.cover_l\n                  ? todo.cover_l\n                  : todo.roomtype\n                  ? todo.data2.bigUrl\n                  : todo.data5) ||\n                'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png',\n              loading: require('@assets/mobile/images/loading-bg.png')\n            }"
                        }], attrs: {alt: "bigo game poster", width: "100%", height: "100%"}
                    })]), e._v(" "), n("div", {staticClass: "online_box"}, [n("span", {
                        staticClass: "fans_num",
                        domProps: {textContent: e._s(t.user_count)}
                    })]), e._v(" "), n("div", {staticClass: "game_li_detail_box"}, [n("div", {staticClass: "thumb_box"}, [n("img", {
                        directives: [{
                            name: "lazy",
                            rawName: "v-lazy",
                            value: t.data5 || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png",
                            expression: "\n                todo.data5 ||\n                  'https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png'\n              "
                        }], staticClass: "ga-thumb-box-img", attrs: {alt: "bigo avatar", width: "100%", height: "100%"}
                    })]), e._v(" "), n("div", {staticClass: "name_box"}, [n("p", {
                        staticClass: "room_name",
                        style: "height:" + (t.room_topic ? "auto" : "0.2rem"),
                        domProps: {textContent: e._s(t.room_topic)}
                    }), e._v(" "), n("p", {
                        staticClass: "hosts_name",
                        domProps: {textContent: e._s(t.nick_name)}
                    })])])])])
                })), 0)]) : e._e()
            }), [], !1, null, null, null);
            t.a = component.exports
        }, 907: function (e, t) {
            e.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAAATCAMAAAATWCuIAAABC1BMVEUAAAA/Sf5dbf5gc/5FVv5DUf5jef5IVv9lff1NW/9ET/9kfP5ke/5IVf9IVv9lff9kfv1lfP8zTf9QYf9CTf9nf/9kev3///9CT/5EVf9GWP5IXP5Rbv4/Sv5fcf5QbP5LY/5NZ/5id/5Pav5KYP5BTP5RYv5je/1ebf5XbP+Gk/7i5v5UaP6ap/5OX/79/f9cc/9KWP9NW/5edv+ptP5hdP5bcf+iqv5WZv5TZv7Gzf54i/52gf5bbv/Eyf6Sm/5mfv7Y3P7S1v65v/6KmP6Aif6krv6Aj/5oc/709f9gef96hv5pef5VcP7v8P7e4f6wuv6wtf5yhv5vfP7Bx/5XYf7o6v6aof5Xcf2Lz9rsAAAAF3RSTlMAz8/Pz8/QU/Ta2sStpIpePScF8vKVddud0usAAAJWSURBVDjLhdLpdppQFIZhOsXMTdNhc0BwqCAicsAJjSQozjHOGXr/V9J98ICxK1l9f/DzWd8GhKjr1MXJd13X25ZVKpVub5uOU6vd3zcllhxVYGVZOdZvViaTSafTkZA6qVZtmxHc4ISeEFhEJEYscOLSdV1uIGElM24JOSSyMYEdEJeSdEDEMxyZ/GdFfEiKSNzQ+dvAmk2nKZO3idy/h1yfEoLENjANW1eHW8tqjDc4o+H7NpFkX5Vk3X+QS7NSoaB21Oymg+Vzm/E8WZESkajeAcB0rA/gsW2ZcNO2JQ8gIFILFob8ADeyCWG2UIFKtgzYKFeGLl8xFy5EkUgvsJwFdFodQl8UfbhDtvxMQ0JaACEnoM6JymDQfUXUhFMkSAi+6wbrpyHcTCYBIyYw6tGWhASMOEHHO6KTz6cjYmfcCz9ENBbQcomiaUNgMcKDrQcBEsserUTE3XRRjw8Z71fMjwWNEUuYSMpkhoeEpllnRJn2QwjxkJ46pRFRN4HGh9T2RO1IUJixhkf3aUrt5F1MYNHrUdpCQjJhRxT6EBEbx2GHdLpdJ5OZF3/uiKdnoBQ8LSFGMCDkEQJGyH1OtJevvwhWyaSLxStBUUSs+tJf+5pmeDNRNLyxOPB0QraeaXsB/heeKT+sTUOdrczGaLVa1Tu5Sh3roHAmIKExQ8E0TRN5hLX/O9uGymvko5pz/Jx/asXi8VVMKG8TJCIsYy800Igq7voqIMEMfLy7wjawxDgkjlFAgvU+gcLbBDPOvwmsD4d94X2O+5j0Ke6IdXb+CwHWXwhDrsUrVostAAAAAElFTkSuQmCC"
        }, 908: function (e, t, o) {
            "use strict";
            o(33), o(16), o(10), o(9), o(18), o(574), o(34), o(32), o(20), o(15);
            var n = o(1), r = o(11), c = o(50), l = o(43), d = o(792), h = o(909), m = o(597), v = o(27), f = o(915);

            function _(object, e) {
                var t = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var o = Object.getOwnPropertySymbols(object);
                    e && (o = o.filter((function (e) {
                        return Object.getOwnPropertyDescriptor(object, e).enumerable
                    }))), t.push.apply(t, o)
                }
                return t
            }

            function w(e) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {};
                    i % 2 ? _(Object(source), !0).forEach((function (t) {
                        Object(r.a)(e, t, source[t])
                    })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(source)) : _(Object(source)).forEach((function (t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(source, t))
                    }))
                }
                return e
            }

            t.a = {
                components: {Chat: f.a},
                props: {
                    asyncData: {
                        type: Object, default: function () {
                            return {}
                        }
                    }
                },
                data: function () {
                    var e, t, o, n, r, c, l, d, h, m = this.asyncData,
                        v = m.getUserInfoStudioRES.data || {roomStatus: 1};
                    return {
                        bigo_id: m.videoInfo.bigoId,
                        config: {
                            uid: (null === (e = m.config) || void 0 === e ? void 0 : e.uid) || v.uid,
                            alive: (null === (t = m.config) || void 0 === t ? void 0 : t.alive) || 0,
                            roomId: (null === (o = m.config) || void 0 === o ? void 0 : o.roomId) || 0,
                            nickName: (null === (n = m.config) || void 0 === n ? void 0 : n.nickName) || "",
                            data5: (null === (r = m.config) || void 0 === r ? void 0 : r.data5) || "",
                            roomStatus: (null === (c = m.config) || void 0 === c ? void 0 : c.roomStatus) || v.roomStatus,
                            countryCode: (null === (l = m.config) || void 0 === l ? void 0 : l.countryCode) || "",
                            sharerCode: "",
                            hlsSrc: (null === (d = m.config) || void 0 === d ? void 0 : d.hlsSrc) || "",
                            aliOSUrl: v.aliOSUrl,
                            passRoom: (null === (h = m.config) || void 0 === h ? void 0 : h.passRoom) || !1,
                            channelType: 7 == +this.$route.query.t ? 1 : null,
                            ogImage: v.ogImage || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png"
                        },
                        liveStatus: m.liveStatus || "live_play",
                        ws: null,
                        recommendDataList: [],
                        recommendDataList4: [],
                        tipsFollow: !1,
                        tipsOpenInApp: !1,
                        showChat: !1,
                        showShare: !1,
                        timer: null,
                        autoPlayTimer: null,
                        time: 0,
                        now: +new Date,
                        password: "",
                        showPasswordCover: m.showPasswordCover || 0,
                        channelInfo: {icon: "", name: "", roomId: "", introduce: "", bg: "", bigo_id: ""},
                        programList: [],
                        channelUid: this.$route.query.u,
                        player: null,
                        isOpenApp: !1,
                        isFirstVideoReport: 1
                    }
                },
                computed: w({}, Object(c.c)(["clientBigoId"]), {}, Object(c.b)(["isSharePage", "shareBigoId"]), {
                    channelUidReqObj: function () {
                        var e = this.$route.query;
                        return {uid: +e.u || void 0, yyUid: +e.h || void 0}
                    }
                }),
                created: function () {
                    var e = this;
                    return Object(n.a)(regeneratorRuntime.mark((function t() {
                        var o;
                        return regeneratorRuntime.wrap((function (t) {
                            for (; ;) switch (t.prev = t.next) {
                                case 0:
                                    t.next = 2;
                                    break;
                                case 2:
                                    return e.$hive.initHive(e), Object(v.m)(), 1 === (null === (o = e.config) || void 0 === o ? void 0 : o.channelType) && (e.$hive.send("010012004", {
                                        action: "channel-room",
                                        live_type: 4
                                    }), e.getChannelInfo(), e.getProgramList()), t.next = 7, e.initAnchorInfo();
                                case 7:
                                    e.$nextTick((function () {
                                        e.autoPlay()
                                    })), e.startWs();
                                case 9:
                                case"end":
                                    return t.stop()
                            }
                        }), t)
                    })))()
                },
                mounted: function () {
                    var e = this;
                    return Object(n.a)(regeneratorRuntime.mark((function t() {
                        return regeneratorRuntime.wrap((function (t) {
                            for (; ;) switch (t.prev = t.next) {
                                case 0:
                                    h.a.giftInit(), e.initAPP(), e.getRecommendDataList(), window.addEventListener("beforeunload", e.pageEndReport), document.addEventListener("visibilitychange", e.watchOpenApp);
                                case 5:
                                case"end":
                                    return t.stop()
                            }
                        }), t)
                    })))()
                },
                beforeDestroy: function () {
                    this.player && this.player.dispose(), this.player = null, this.pageEnd(), document.removeEventListener("visibilitychange", this.watchOpenApp)
                },
                methods: {
                    watchOpenApp: function () {
                        !document.hidden && this.isOpenApp && window.location.reload()
                    }, initPlayer: function () {
                        var e = this,
                            t = window.MediaSource && "function" == typeof window.MediaSource.isTypeSupported ? "MediaSourceSupport" : "MediaSourceNotSupport";
                        this.$hive.send("010012004", {
                            action: "video-play",
                            playerType: t,
                            pc: 0,
                            lang: Object(v.d)("i18n_redirected")
                        });
                        var o = window.videojs;
                        o && (this.player = o(this.videoId, {
                            autoplay: !0,
                            controls: "games" === this.ssrmobileType && {fullscreenToggle: !0},
                            errorDisplay: !1
                        }), this.player.src({
                            type: "application/x-mpegURL",
                            src: this.config.hlsSrc
                        }), this.player.on("error", (function () {
                            e.errorPlayCallback(), e.timer || (e.timer = setTimeout((function () {
                                e.timer = null, clearTimeout(e.timer), e.player.src({
                                    type: "application/x-mpegURL",
                                    src: e.config.hlsSrc
                                })
                            }), 2e3))
                        })), this.player.ready((function () {
                            e.time = (new Date).getTime();
                            var t = e.player.play();
                            t && t.catch && t.catch((function () {
                            }))
                        })), this.player.on("durationchange", (function () {
                            e.startPlayCallback()
                        })), this.player.on("play", (function () {
                            if ("show" === e.ssrmobileType) {
                                var video = e.getVideoTag();
                                video && (video.style = "object-fit:cover;")
                            }
                        })))
                    }, showChannelSingle: function (e) {
                        var t = this;
                        return Object(n.a)(regeneratorRuntime.mark((function o() {
                            return regeneratorRuntime.wrap((function (o) {
                                for (; ;) switch (o.prev = o.next) {
                                    case 0:
                                        return t.isChannelSingleRoom = !0, t.ws && t.ws.destroy(), o.next = 4, t.initAnchorInfo(e);
                                    case 4:
                                        t.startWs();
                                    case 5:
                                    case"end":
                                        return o.stop()
                                }
                            }), o)
                        })))()
                    }, initAnchorInfo: function (e) {
                        var t = this;
                        return Object(n.a)(regeneratorRuntime.mark((function o() {
                            var n, r, c, d, data;
                            return regeneratorRuntime.wrap((function (o) {
                                for (; ;) switch (o.prev = o.next) {
                                    case 0:
                                        if (o.prev = 0, n = Object(v.d)("".concat(t.bigo_id, "-psw")), !t.asyncData.config) {
                                            o.next = 6;
                                            break
                                        }
                                        if (n) {
                                            o.next = 6;
                                            break
                                        }
                                        return t.$store.commit("update_clientBigoId", null === (r = t.asyncData) || void 0 === r || null === (c = r.config) || void 0 === c ? void 0 : c.clientBigoId), o.abrupt("return");
                                    case 6:
                                        return o.next = 8, l.a.getInternalStudioInfo({
                                            verify: n,
                                            siteId: e || t.bigo_id
                                        });
                                    case 8:
                                        0 === (null == (d = o.sent) ? void 0 : d.code) ? ((data = d.data) && t.$store.commit("update_clientBigoId", data.clientBigoId), t.config.alive = data.alive, t.$set(t.config, "hlsSrc", ""), t.$nextTick((function () {
                                            t.config.hlsSrc = data.hls_src
                                        })), t.config.uid = data.uid, t.config.roomId = data.roomId, t.config.nickName = data.nick_name, t.config.countryCode = data.country_code, t.config.data5 = data.snapshot || "https://static-web.likeevideo.com/as/bigo-static/www.bigo.tv/img/logo_icon.png", t.config.roomStatus = data.roomStatus, t.config.passRoom = data.passRoom, t.liveStatus = data.alive ? "live_play" : "live_end", data.passRoom && 4 === data.roomStatus ? t.showPasswordCover = 1 : data.passRoom && data.alive && !data.hls_src && (t.showPasswordCover = 2), t.password = n) : 810021 === d.code && (Object(v.k)("".concat(t.bigo_id, "-psw"), ""), t.initAnchorInfo()), o.next = 15;
                                        break;
                                    case 12:
                                        o.prev = 12, o.t0 = o.catch(0), t.$log && t.$log.error("request error", {
                                            msg: "".concat(o.t0.message, ", ").concat(o.t0.stack),
                                            api: "getInternalStudioInfo"
                                        });
                                    case 15:
                                    case"end":
                                        return o.stop()
                                }
                            }), o, null, [[0, 12]])
                        })))()
                    }, getChannelInfo: function () {
                        var e = this;
                        return Object(n.a)(regeneratorRuntime.mark((function t() {
                            var o, n, r, c, l, h, m;
                            return regeneratorRuntime.wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        return t.next = 2, d.a.getChannelInfo(w({}, e.channelUidReqObj));
                                    case 2:
                                        0 === (o = t.sent).code && (e.channelInfo.icon = null === (n = o.data) || void 0 === n ? void 0 : n.icon, e.channelInfo.name = null === (r = o.data) || void 0 === r ? void 0 : r.name, e.channelInfo.roomId = null === (c = o.data) || void 0 === c ? void 0 : c.roomId, e.channelInfo.introduce = null === (l = o.data) || void 0 === l ? void 0 : l.introduce, e.channelInfo.bg = null === (h = o.data) || void 0 === h ? void 0 : h.cover, e.channelInfo.bigo_id = null === (m = o.data) || void 0 === m ? void 0 : m.bigoId);
                                    case 4:
                                    case"end":
                                        return t.stop()
                                }
                            }), t)
                        })))()
                    }, getProgramList: function () {
                        var e = this;
                        return Object(n.a)(regeneratorRuntime.mark((function t() {
                            var o, n, r;
                            return regeneratorRuntime.wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        return t.next = 2, d.a.getChannelMenu(w({}, e.channelUidReqObj, {size: 500}));
                                    case 2:
                                        0 === (o = t.sent).code && (n = o.data.reverse() || [], r = +new Date, e.programList = n.filter((function (e) {
                                            return e.endTime > r
                                        })));
                                    case 4:
                                    case"end":
                                        return t.stop()
                                }
                            }), t)
                        })))()
                    }, getRecommendDataList: function () {
                        var e = this;
                        return Object(n.a)(regeneratorRuntime.mark((function t() {
                            var o;
                            return regeneratorRuntime.wrap((function (t) {
                                for (; ;) switch (t.prev = t.next) {
                                    case 0:
                                        if (o = {}, "games" !== e.ssrmobileType) {
                                            t.next = 7;
                                            break
                                        }
                                        return t.next = 4, l.a.getGamingList({
                                            countryCode: Object(v.e)(e.$i18n.locale, !0),
                                            tabType: "00",
                                            fetchNum: 8,
                                            lang: e.$i18n.locale,
                                            ignoreUids: e.config.uid
                                        });
                                    case 4:
                                        o = t.sent, t.next = 10;
                                        break;
                                    case 7:
                                        return t.next = 9, l.a.getShowbizList({
                                            tabType: e.config.countryCode,
                                            fetchNum: 8,
                                            ignoreUids: e.config.uid
                                        });
                                    case 9:
                                        o = t.sent;
                                    case 10:
                                        e.recommendDataList = o ? o.data : [], e.recommendDataList4 = [e.recommendDataList.slice(0, 4), e.recommendDataList.slice(4)], "show" !== e.ssrmobileType || e.config.hlsSrc || e.$nextTick((function () {
                                            document.getElementById("hover_recommend_b") && e.newSwiper()
                                        }));
                                    case 13:
                                    case"end":
                                        return t.stop()
                                }
                            }), t)
                        })))()
                    }, newSwiper: function () {
                        var e = this;
                        window.Swiper ? new Swiper("#hover_recommend_b", {
                            direction: "vertical",
                            autoplay: 3e3
                        }) : setTimeout((function () {
                            e.newSwiper()
                        }), 500)
                    }, updateChatData: function (e) {
                        this.showChat && (this.chatData.length > 50 && this.chatData.shift(), this.chatData.push(w({time: (new Date).getTime()}, e)))
                    }, goPath: function (e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
                        e !== this.bigo_id && (this.pageEnd(), sessionStorage && sessionStorage.setItem("coverurl", encodeURIComponent(t)), this.$router.push(this.localeRoute({path: "/".concat(e)})))
                    }, back: function () {
                        this.isTik || this.$router.replace(this.localeRoute({path: "/".concat(this.ssrmobileType, "/")}))
                    }, splitURL: function (e) {
                        var t = e.split("?");
                        if (t[1]) for (var o = t[1].split("&"), i = 0; i < o.length; i++) {
                            var n = o[i].split("=");
                            if ("roomid" === n[0] && "0" === n[1]) return "bigolive://main?tab=live"
                        }
                        return e
                    }, openAppBySchema: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = w({
                            type: "web_live",
                            c: this.shareBigoId,
                            af_dp: this.fromIMO ? this.splitURL(this.config.aliOSUrl) + "&fromImo=true" : this.config.aliOSUrl,
                            af_adset: this.isSharePage ? "share" : ""
                        }, e || {});
                        console.log("oneLinkParams", t), Object(v.g)(t)
                    }, downloadIconClick: function () {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
                        this.openAppBySchema(e)
                    }, startPlayCallback: function () {
                        this.time && (this.isFirstVideoReport = 0, this.$hive.send("010012004", {
                            action: "video-play",
                            durationchange: (new Date).getTime() - this.time,
                            pc: 0,
                            lang: this.$i18n.locale
                        }))
                    }, getVideoTag: function () {
                        var e,
                            t = (null === (e = document.getElementById(this.videoId)) || void 0 === e ? void 0 : e.getElementsByTagName("video")) || null;
                        return t && t.length ? t[0] : null
                    }, errorPlayCallback: function () {
                        this.$hive.send("010012004", {
                            action: "video-play",
                            playererror: "error",
                            pc: 0,
                            lang: this.$i18n.locale,
                            isFirstVideoReport: this.isFirstVideoReport
                        })
                    }, videoPlay: function () {
                        var e = this;
                        this.showChat || (this.showShare = !1, this.$nextTick((function () {
                            e.showChat = !0, e.player.play();
                            var video = e.getVideoTag();
                            e.liveStatus = "live_loading", video && video.addEventListener("timeupdate", e.setLiveStatus, !0)
                        })), setTimeout((function () {
                            e.tipsFollow = !0, setTimeout((function () {
                                e.tipsFollow = !1
                            }), 5e3)
                        }), 15e3), setTimeout((function () {
                            e.tipsOpenInApp = !0, setTimeout((function () {
                                e.tipsOpenInApp = !1
                            }), 5e3)
                        }), 45e3), window.gtag && window.gtag("event", "play click", {
                            event_category: "play click",
                            event_label: "play click"
                        }))
                    }, setLiveStatus: function () {
                        this.liveStatus = "live_living";
                        var video = this.getVideoTag();
                        video && video.removeEventListener("timeupdate", this.setLiveStatus, !0)
                    }, autoPlay: function () {
                        var e = this;
                        this.config.hlsSrc && (clearInterval(this.autoPlayTimer), this.initPlayer(), this.autoPlayTimer = setInterval((function () {
                            var video = e.getVideoTag();
                            video ? video.paused || (clearInterval(e.autoPlayTimer), e.videoPlay()) : clearInterval(e.autoPlayTimer)
                        }), 1e3))
                    }, startWs: function () {
                        if (this.config.hlsSrc) try {
                            this.ws = new m.a(this.config), this.subWs(this.ws), this.ws.init({password: this.password})
                        } catch (e) {
                            console.log("wserror", e)
                        }
                    }, subWs: function (e) {
                        var t = this;
                        e.sub(3608, (function (o) {
                            "1" !== o.roomStatus && "2" !== o.roomStatus && "5" !== o.roomStatus || (m.a.log("结束直播！"), e.send("7|24", {
                                seqId: String(~~(+new Date / 1e3)),
                                roomId: t.config.roomId
                            }), t.$set(t.config, "hlsSrc", ""), t.liveStatus = "live_end", t.config.alive = 0, t.player && t.player.dispose(), t.player = null, t.chatData = [], t.$hive.send("010012005", {staytime: +new Date - t.now})), "4" === o.roomStatus ? t.updateChatData({
                                type: m.a.CHAT_EVENT.ROOM_OWNER_BACK_TEXT,
                                m: "Broadcaster is back. LIVE is recovering"
                            }) : "3" === o.roomStatus && t.updateChatData({
                                type: m.a.CHAT_EVENT.ROOM_OWNER_LEAVE_TEXT,
                                m: "Broadcaster will leave for a moment. Please hold on"
                            })
                        })), e.sub(m.a.EVENT.NORMAL_TEXT, (function (e) {
                            if (t.config.roomId === e.room_id) {
                                var o = +e.payload.tag, content = "";
                                try {
                                    var n;
                                    if (e.payload.content) content = JSON.parse(decodeURIComponent(escape(window.atob(e.payload.content)))), t.updateChatData(w({
                                        type: o,
                                        grade: null === (n = e.payload) || void 0 === n ? void 0 : n.grade
                                    }, content))
                                } catch (t) {
                                    console.log(e.payload.content), m.a.log("公屏消息显示失败", t)
                                }
                            }
                        })), e.sub("WS_INIT_FINISH", (function () {
                            var o;
                            t.config.passRoom && t.$hive.send("011201002", {
                                action: 1,
                                showeruid: t.bigo_id,
                                userId: null == e || null === (o = e.wsConfig) || void 0 === o ? void 0 : o.userId
                            })
                        }))
                    }, initAPP: function () {
                        setTimeout((function () {
                            var e = document.getElementById("app");
                            e && e.scrollTo && e.scrollTo({left: 0, top: 0, behavior: "smooth"})
                        }), 300), this.config && !this.config.alive && this.$hive.send("010012005", {staytime: +new Date - this.now})
                    }, pageEnd: function () {
                        window.removeEventListener("beforeunload", this.pageEndReport), this.liveStatus = "live_loading", this.ws && this.ws.destroy(), this.$set(this.config, "hlsSrc", ""), this.pageEndReport(), this.now = +new Date, clearInterval(this.autoPlayTimer)
                    }, pageEndReport: function () {
                        var e = {staytime: +new Date - this.now, passRoom: this.config.passRoom ? 1 : 0};
                        1 == +this.config.channelType && (e.live_type = 4), this.$hive.send("010012006", e)
                    }, ifShare: function () {
                        if (navigator.share) {
                            var e = {url: window.location.href};
                            navigator.share(e)
                        } else this.showShare = !0;
                        window.gtag && window.gtag("event", "share", {event_category: "share", event_label: "share"})
                    }
                }
            }
        }, 909: function (e, t, o) {
            "use strict";
            o(35), o(36), o(9), o(32), o(12), o(13), o(59), o(15);
            var n, r = o(1), c = o(4), l = {
                giftInit: (n = Object(r.a)(regeneratorRuntime.mark((function e() {
                    var t, o, n;
                    return regeneratorRuntime.wrap((function (e) {
                        for (; ;) switch (e.prev = e.next) {
                            case 0:
                                if (this.giftAnimationTag = document.querySelector("#gift_animation_e"), this.screenGiftAnimationTag = document.querySelector("#screen_gift_tag_e"), !(this.giftJSONLikeArr.length > 0)) {
                                    e.next = 8;
                                    break
                                }
                                return this.screenGiftWaiting.length = 0, this.screenGiftDisplaying.length = 0, this.giftWaiting.length = 0, this.giftDisplaying.length = 0, e.abrupt("return");
                            case 8:
                                return e.next = 10, c.a.post("".concat("https://ta.bigo.tv/official_website", "/live/giftconfig/getOnlineGifts"));
                            case 10:
                                if (t = e.sent, (o = (null == t ? void 0 : t.data) || []) && (this.giftJSONLikeArr = o, window.giftJSONLikeArr = o), !window.navigator.userAgent.match(/.*Mobile.*/)) {
                                    e.next = 15;
                                    break
                                }
                                return e.abrupt("return");
                            case 15:
                                (n = []) && (this.screenGiftJSON = n), this.cacheScreenResources(this.screenGiftJSON);
                            case 18:
                            case"end":
                                return e.stop()
                        }
                    }), e, this)
                }))), function () {
                    return n.apply(this, arguments)
                }),
                giftJSONLikeArr: [],
                giftAnimationTag: document.querySelector("#gift_animation_e"),
                screenGiftJSON: [],
                screenGiftAnimationTag: document.querySelector("#screen_gift_tag_e"),
                ResourcesOfScreen: [],
                webpSupport: "png_url",
                screenGiftWaiting: [],
                screenGiftDisplaying: [],
                cacheScreenResources: function (data) {
                    for (var e = data.length, t = this.ResourcesOfScreen, image = null, i = 0; i < e; i++) image = new Image, window.location.origin.includes("bigoapp.tv") && (data[i][this.webpSupport] = data[i][this.webpSupport].replace("gdl.bigo.sg", "gdl.piojm.tech")), t[i] = image.src = data[i][this.webpSupport]
                },
                fullScreenGiftAnimation: function (e) {
                    var t = e.vgift_typeid, o = this.getScreenGiftById(t);
                    o ? this.screenGiftDisplaying.length > 0 ? this.screenGiftWaiting.push(o) : this.fullScreenAnimationDo(o) : this.pushMsgToQueues(e)
                },
                fullScreenAnimationDo: function (e) {
                    var t, o, n = (e = e).height / e.width, r = window.danmu, i = 0;
                    if (n > r.danMuHeight / r.danMuWidth ? (e.height = .8 * r.danMuHeight > e.height ? e.height : .8 * r.danMuHeight, e.width = e.height / n) : (e.width = .8 * r.danMuWidth > e.width ? e.width : .8 * r.danMuWidth, e.height = e.width * n), this.screenGiftDisplaying.push(e), this.screenGiftAnimationTag.style.width = this.screenGiftDisplaying[0].width + "px", this.screenGiftAnimationTag.style.height = this.screenGiftDisplaying[0].height + "px", this.screenGiftAnimationTag.style.backgroundImage = "url(" + this.screenGiftDisplaying[0][this.webpSupport] + ")", "png_url" === this.webpSupport) for (i = 0; i < e.frame; i++) setTimeout(function (e, t, i) {
                        return function () {
                            e.style.backgroundPosition = "0 -" + i * t + "px"
                        }
                    }(this.screenGiftAnimationTag, e.height, i), 100 * i);
                    setTimeout((t = this, o = this.screenGiftAnimationTag, function () {
                        o.style.backgroundImage = "url(" + o.src + ")", o.style.backgroundPosition = "0 0", t.fullScreenClearAndAddNew()
                    }), e.settleTime)
                },
                fullScreenClearAndAddNew: function () {
                    this.screenGiftDisplaying[0] = null, this.screenGiftDisplaying.pop(), this.screenGiftWaiting.length > 0 && this.fullScreenAnimationDo(this.screenGiftWaiting.shift())
                },
                getScreenGiftById: function (e) {
                    for (var t = this.screenGiftJSON, i = 0, o = t.length; i < o; i++) if (+t[i].typeid == +e) return t[i]
                },
                giftView: '<li class="gift_list"><div class="movingLight_box"><img class="movingLight" src="https://www.bigo.tv/assets/officialWeb/images/giftbg/combobg4.png"></div><div class="thumb"><img src="==="></div><p class="name">===</p><p class="send_tips">Send</p><div class="gift_star_box"><p class="gift_star star==="></p></div><img class="gift_icon" src="==="><div class="combo_box"><p class="x_num">x===</p><p class="tips">combo</p></div><div class="combo_counter">===</div><div class="gift_dressup dressupStatu==="></div></li>',
                giftWaiting: [],
                giftDisplaying: [],
                giftAnimationStart: function (e) {
                    var t = e, o = this.getGiftInforIndex(t.vgift_typeid), n = "", r = 0;
                    1 == +t.send_times ? this.giftJSONLikeArr[o].vm_exchange_rate / 100 > 998 ? this.fullScreenGiftAnimation(t) : this.pushMsgToQueues(t) : +t.vgift_count > 98 ? this.pushMsgToQueues(t) : (n = t.from_uid, r = t.vgift_typeid, this.updateComboTimes(n, r, t.send_times) && this.pushMsgToQueues(t))
                },
                pushMsgToQueues: function (e) {
                    e = e;
                    this.giftDisplaying.length < 2 ? this.pushMsgToDisplaying(e) : (e.fromWaitingQueues = !0, this.giftWaiting.push(e))
                },
                pushMsgToDisplaying: function (e) {
                    var t, o = 0, n = {}, r = e, c = {};
                    if (0 === this.giftDisplaying.length) o = 50; else for (var i = 0; i < 2; i++) for (var l = 0; l < this.giftDisplaying.length; l++) this.giftDisplaying[l].bottom != 50 + 80 * i && (o = 50 + 80 * i);
                    n.from = r.from_uid, n.times = +r.send_times, n.currentTimes = 1, (+r.vgift_count > 98 || +r.times > 1 && !r.fromWaitingQueues) && (n.currentTimes = +r.send_times), n.bottom = o, n.comboClearCounter = 0, n.giftId = r.vgift_typeid, n.baseXNum = +r.vgift_count, c = this.giftJSONLikeArr[this.getGiftInforIndex(r.vgift_typeid)], window.location.origin.includes("bigoapp.tv") && (c.img_url = c.img_url && c.img_url.replace("giftesx.bigo.sg", "giftesx.piojm.tech"));
                    var d = function (e) {
                        var t = document.createElement("div");
                        return t.innerHTML = e, t.childNodes
                    }(this.giftView.replace("===", r.head_icon_url).replace("===", r.vgift_name).replace("===", this.getGiftStar(c)).replace("===", c.img_url).replace("===", r.vgift_count).replace("===", n.currentTimes).replace("===", this.returnGiftDressupBg(n)))[0];
                    n.giftDomTag = d, this.giftAnimationTag.appendChild(d), n.checkTimes = this.checkTimes, n.scaleCombo = this.scaleCombo, n.returnComboBgPosY = this.returnComboBgPosY, n.checkTimes(), setTimeout(function (e, t) {
                        return function () {
                            e.style.right = "40px", e.style.bottom = t + "px"
                        }
                    }(d, o), 20), t = this.getGiftBackground(+r.vgift_count);
                    for (var h = 0; h < t; h++) setTimeout(function (e, t, o) {
                        return function () {
                            var t = "0px -" + 73 * o + "px";
                            e.style.backgroundPosition = t
                        }
                    }(d, 0, h), 100 * h + 400);
                    this.giftDisplaying.push(n)
                },
                checkTimes: function () {
                    var e, t, o = this.times;
                    if (this.currentTimes < o) this.currentTimes++, clearTimeout(this.comboClearCounter), this.comboClearCounter = 0, this.scaleCombo(); else if (0 === this.comboClearCounter) {
                        var n = l.timeOfClearGift(this) - 800;
                        this.comboClearCounter = setTimeout((e = this, function () {
                            l.clearGiftWhoTimeout(e)
                        }), n)
                    }
                    setTimeout((t = this, function () {
                        try {
                            t.checkTimes()
                        } catch (e) {
                        }
                    }), 800)
                },
                timeOfClearGift: function (e) {
                    var t, o = e.giftId, n = e.baseXNum;
                    e.times;
                    return n > 98 && 1, t = this.giftJSONLikeArr[this.getGiftInforIndex(o)].vm_exchange_rate / 100, this.getGiftShowTimeByCost(t * n)
                },
                clearGiftWhoTimeout: function (e) {
                    var t = e.from, o = e.giftId, n = e.currentTimes, r = this.giftDisplaying, c = this,
                        l = (+new Date).toString().slice(-4);
                    e.giftDomTag.classList.add("clearStatu" + l), e.giftDomTag.style.right = "-310px";
                    for (var i = 0; i < r.length; i++) if (r[i].from === t && r[i].giftId === o && r[i].currentTimes === n) {
                        this.giftDisplaying[i].checkTimes = null, this.giftDisplaying[i] = null, this.giftDisplaying.splice(i, 1), i--;
                        break
                    }
                    setTimeout((function () {
                        var e = c.giftAnimationTag.querySelector(".clearStatu".concat(l));
                        c.giftAnimationTag.removeChild(e)
                    }), 400), this.giftWaiting.length && this.pushMsgToQueues(this.giftWaiting.pop())
                },
                returnGiftDressupBg: function (e) {
                    var t = e.baseXNum;
                    return t < 100 ? 1 === t ? 0 : 10 === t ? 1 : 2 : 188 === t ? 3 : 4
                },
                returnComboBgPosY: function (e) {
                    return e > 198 ? e > 519 ? -180 : -120 : e > 65 ? -60 : e > 10 ? 0 : 60
                },
                clearTimeoutByGiftCosts: [3e3, 4e3, 5e3, 6e3, 7e3],
                getGiftShowTimeByCost: function (e) {
                    var t = 0;
                    return t = e > 99 ? e > 499 ? 4 : 3 : e > 49 ? 2 : e > 9 ? 1 : 0, this.clearTimeoutByGiftCosts[t]
                },
                scaleCombo: function () {
                    var e, t = this.giftDomTag.querySelector(".combo_counter"),
                        o = this.returnComboBgPosY(this.currentTimes);
                    t.classList.add("countAnimation"), t.innerText = this.currentTimes, setTimeout((e = t, function () {
                        e.classList.remove("countAnimation")
                    }), 600);
                    for (var i = 0; i < 6; i++) setTimeout(function (e, t, i) {
                        return function () {
                            e.style.backgroundPosition = 60 * -i + "px " + t + "px"
                        }
                    }(t, o, i), 120 * i);
                    10 === this.baseXNum || 1 === this.baseXNum && this.currentTimes
                },
                getGiftBackground: function (e) {
                    var t = 0;
                    switch (e) {
                        case 1:
                            t = 0;
                            break;
                        case 10:
                            t = 8;
                            break;
                        case 99:
                            t = 17;
                            break;
                        case 188:
                            t = 27;
                            break;
                        case 999:
                            t = 41
                    }
                    return t
                },
                getGiftStar: function (e) {
                    var t = e.vm_exchange_rate / 100;
                    return t < 50 ? t < 10 ? 1 : 2 : t < 100 ? 3 : 4
                },
                getGiftInforIndex: function (e) {
                    for (var t = this.giftJSONLikeArr, i = 0, o = t.length; i < o; i++) if (+t[i].typeid == +e) return i
                },
                updateComboTimes: function (e, t, o) {
                    for (var n = this.giftWaiting.length - 1; n > -1; n--) if (+this.giftWaiting[n].from == +e && +this.giftWaiting[n].id == +t) return this.giftWaiting[n].times = o, 0;
                    for (var i = this.giftDisplaying.length - 1; i > -1; i--) if (+this.giftDisplaying[i].from == +e && +this.giftDisplaying[i].giftId == +t) return this.giftDisplaying[i].times = o, 0;
                    return 1
                }
            };
            t.a = l
        }, 914: function (e, t, o) {
            "use strict";
            var n = {
                components: {}, props: {}, data: function () {
                    return {}
                }, computed: {}, mounted: function () {
                }, methods: {
                    downloadIconClick: function () {
                        this.$emit("downloadIconClick")
                    }
                }
            }, r = (o(1345), o(3)), component = Object(r.a)(n, (function () {
                var e = this.$createElement, t = this._self._c || e;
                return t("div", {
                    directives: [{
                        name: "hive",
                        rawName: "v-hive.click",
                        value: 47,
                        expression: "47",
                        modifiers: {click: !0}
                    }], staticClass: "down_load_section"
                }, [t("div", {
                    staticClass: "bigo-logo",
                    on: {click: this.downloadIconClick}
                }), this._v(" "), t("div", {staticClass: "store-icon"}, [t("div", {
                    staticClass: "apple-icon",
                    on: {click: this.downloadIconClick}
                }), this._v(" "), t("div", {staticClass: "google-icon", on: {click: this.downloadIconClick}})])])
            }), [], !1, null, "ecc9b8d2", null);
            t.a = component.exports
        }, 915: function (e, t, o) {
            "use strict";
            o(32), o(20), o(84), o(12), o(13), o(10), o(9), o(638);
            var n = o(597), r = {
                name: "Chat", props: {
                    data: {
                        type: Array, require: !0, default: function () {
                            return []
                        }
                    }, opactiyBG: Boolean, useRem: Boolean, isGame: Boolean
                }, data: function () {
                    return this.CHAT_EVENT = n.a.CHAT_EVENT, {}
                }, computed: {
                    chatEventValus: function () {
                        return Object.values(this.CHAT_EVENT)
                    }, comments: function () {
                        var e = this.CHAT_EVENT;
                        return [e.NORMAL_TEXT, e.DAMMARKU_TEXT]
                    }
                }, watch: {
                    data: function () {
                        var e = document.querySelector(".chat__container");
                        if (e) {
                            var t = e.scrollTop;
                            e.scrollHeight - t - e.clientHeight < 100 && this.$nextTick((function () {
                                e.scrollTop = e.scrollHeight
                            }))
                        }
                    }
                }, methods: {
                    canShowType: function (e) {
                        return !("init" !== e.type && e.type !== this.CHAT_EVENT.ROOM_OWNER_LEAVE_TEXT && e.type !== this.CHAT_EVENT.ROOM_OWNER_BACK_TEXT && e.type !== this.CHAT_EVENT.ANNOUNCE_TEXT && !this.chatEventValus.includes(e.type))
                    }, getGiftName: function (e) {
                        var t = window.giftJSONLikeArr, o = (void 0 === t ? [] : t).find((function (t) {
                            return +t.typeid == +e
                        }));
                        return null == o ? void 0 : o.name
                    }, getGiftIconUrl: function (e) {
                        var t = window.giftJSONLikeArr, o = (void 0 === t ? [] : t).find((function (t) {
                            return +t.typeid == +e
                        }));
                        return o && window.location.origin.includes("bigoapp.tv") && (o.img_url = o.img_url && o.img_url.replace("giftesx.bigo.sg", "giftesx.piojm.tech")), null == o ? void 0 : o.img_url
                    }, switchGradeImage: function (e) {
                        var t = 1;
                        return t = (e = +e) < 11 ? 1 : e < 23 ? 11 : e < 34 ? 23 : e < 45 ? 34 : e < 56 ? 45 : e < 67 ? 56 : e < 78 ? 67 : e < 89 ? 78 : 89, o(1359)("./".concat(t, ".png"))
                    }
                }
            }, c = (o(1369), o(3)), component = Object(c.a)(r, (function () {
                var e = this, t = e.$createElement, n = e._self._c || t;
                return n("div", {
                    class: [{
                        chat: !e.useRem,
                        useRem: e.useRem,
                        isGame: e.isGame
                    }]
                }, [n("div", {staticClass: "chat__container"}, e._l(e.data, (function (t) {
                    return n("div", {
                        key: "" + t.n + t.time,
                        staticClass: "chat-item",
                        class: ["type-" + t.type, {
                            "chat-item-opacity": e.opactiyBG && e.canShowType(t),
                            "chat-item-hide": !e.chatEventValus.includes(t.type) && "init" !== t.type && "welcome" !== t.type
                        }]
                    }, [n("div", {staticClass: "chat-item-inner"}, ["init" === t.type ? [n("div", [e._v(e._s(e.$t("lang031")))])] : e._e(), e._v(" "), "welcome" === t.type ? [n("div", [e._v(e._s(e.$t("lang338")))])] : e._e(), e._v(" "), "blank" === t.type ? [n("div", {staticClass: "blank"})] : !t.m || t.type !== e.CHAT_EVENT.ROOM_OWNER_LEAVE_TEXT && t.type !== e.CHAT_EVENT.ROOM_OWNER_BACK_TEXT && t.type !== e.CHAT_EVENT.ANNOUNCE_TEXT ? e.chatEventValus.includes(t.type) ? [n("div", {
                        class: ["user-grade", {"user-grade-34": +t.grade >= 34}],
                        style: {backgroundImage: "url(" + e.switchGradeImage(t.grade) + ")"}
                    }, [+t.grade < 34 ? n("span", [e._v("Lv.")]) : e._e(), e._v(e._s(t.grade) + "\n          ")]), e._v(" "), n("span", {staticClass: "user-name"}, [e._v(e._s(t.n || t.m))]), e._v(" "), n("i", {staticClass: "user-name-sep"}, [e._v(":")]), e._v(" "), n("span", {staticClass: "user-text-content"}, [t.type === e.CHAT_EVENT.LIGHT_MY_HEART_TEXT ? [n("span", [e._v("sent")]), e._v(" "), n("img", {
                        attrs: {
                            src: o(1358),
                            alt: ""
                        }
                    })] : e._e(), e._v(" "), t.type === e.CHAT_EVENT.NORMAL_GIFT_TEXT ? [n("span", [e._v("sent a " + e._s(e.getGiftName(t.m)))]), e._v(" "), n("img", {attrs: {src: e.getGiftIconUrl(t.m)}}), e._v(" "), n("span", [e._v("X" + e._s(t.c))])] : e._e(), e._v(" "), t.type === e.CHAT_EVENT.FOLLOW_OWNER_TEXT ? n("span", [e._v("\n              became a Fan.Won't miss the next LIVE\n            ")]) : e._e(), e._v(" "), t.type === e.CHAT_EVENT.SHARE_LIVING_TEXT ? n("span", [e._v("\n              shared this LIVE\n            ")]) : e._e(), e._v(" "), e.comments.includes(t.type) ? [e._v("\n              " + e._s(t.m) + "\n            ")] : e._e()], 2)] : e._e() : [n("span", {staticClass: "user-text-content"}, [e._v(e._s(t.m))])]], 2)])
                })), 0)])
            }), [], !1, null, "03075219", null);
            t.a = component.exports
        }
    }]);

})();

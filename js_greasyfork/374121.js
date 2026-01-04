// ==UserScript==
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpBNTlBOEI1NDc1REExMUU2OTM4MkI1QjIwMkY4Nzg2MyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMEQ2QzQwMURCRjQxMUU4QUEwMkUxQkU3Q0REQTE2OSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMEQ2QzQwMERCRjQxMUU4QUEwMkUxQkU3Q0REQTE2OSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmI2ODI5YTYzLWNmYTMtYWM0ZS04ZjBhLWIzMjJkOGJmMGZjMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNTlBOEI1NDc1REExMUU2OTM4MkI1QjIwMkY4Nzg2MyIvPiA8L3Jk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
// @name         ZFDev-百度网盘 - 自定义分享密码
// @namespace    https://zfdev.com/
// @version      0.1
// @description  分享文件(夹)时, 可自定义密码.
// @author       greendev
// @match        *://pan.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/home*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374121/ZFDev-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/374121/ZFDev-%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%20-%20%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

!function() {
    "use strict";
    var A = {
        empty: "",
        a: "DOMNodeInserted",
        b: "create-link",
        c: "#privatePasswordInput",
        d: "生成或输入 4 位分享密码",
        e: "必须为 4 位字母或数字,如：aba2",
        f: "#share .dialog-body .share-dialog .content .share-link .create-link .validity-section .share-method-line:first label > b",
        g: '<div style="display:inline-block;position:relative;margin-right:10px;"><input type="text"maxlength="4"id="privatePasswordInput"spellcheck="false"><a id="randomPassword"href="javascript:;"title="生成随机密码"><span class="g-button-right"><em class="icon icon-recovery"title="生成随机密码"></em></span></a></div>',
        h: "#share .dialog-body .share-dialog .content .share-link .create-link .validity-section .share-method-line label > span",
        i: '.share-method-line input[type="radio"]:checked',
        j: '.share-method-line input[type="radio"][value="private"] ~ label',
        k: "function-widget-1:share/util/shareFriend/createLinkShare.js",
        l: "private",
        m: "#ed5127",
        n: "#b7b7b7",
        o: "1px solid #ed5127",
        p: "none",
        q: "#8b909e",
        r: "zfdev_privatePassword",
        s: "#privatePasswordInput",
        t: "zfzf",
        u: "change keyup",
        v: ".share-method-line",
        w: "#randomPassword",
        x: "#share .dialog-body .share-dialog .content .footer a.create",

    }
    var t = document.querySelector.bind(document);
    document.addEventListener(A.a, function(e) {
        if (A.b == e.target.className) {
            var a = t(A.c);
            if (!a) {
                var o = !1, r = !0, n = A.d, i = A.e;
                /* 添加样式 */
                GM_addStyle("#privatePasswordInput{padding:3px;width:60px;height:23px;border:1px solid #c6c6c6;background-color:#fff;box-shadow:0 0 3px #c6c6c6;-moz-box-shadow:0 0 3px #c6c6c6;-webkit-box-shadow:0 0 3px #c6c6c6;border:1px solid #7faddc;border-radius:4px;}"),
                GM_addStyle("#randomPassword{position:absolute!important;right:0!important;text-decoration:none!important;display:inline-block!important;height:23px!important;padding:3px!important;line-height:23px!important;border-left:1px solid #c9c9c9;}#randomPassword > span{height:23px!important;line-height:23px!important;width:20px!important;padding:0px!important}#randomPassword > span > em{background:none!important;line-height:23px!important;width:20px!important}"),
                GM_addStyle("a#randomPassword:active span{animation:none!important;}a#randomPassword:focus span{outline:none;animation:rotatefresh 1s;}@keyframes rotatefresh{from{transform:rotate(0deg)}to{transform:rotate(-360deg);transition:all 0.6s;}}");
                $(A.f).after(A.g);
                var d = t(A.h);
                d.textContent = n;
                /* 错误提示 */
                var s = function(e) {
                    var o = t(A.i).value, r = t(A.j), s = t(A.x).style;
                    A.l === o && e ? (r.style.color = A.m, s.background = s.border = A.n,
                    a.style.border = A.o, s.pointerEvents = A.p, d.textContent = i) : (d.textContent = n,
                    r.style.color = A.q, a.style.border = A.empty, s.pointerEvents = s.background = s.border = A.empty);
                }
                /* 设置初始密码 */ , l = function() {
                    var e = window.localStorage.getItem(A.r);
                    (a = t(A.s)).value = e || A.t, s(!1);
                };
                l(), $(a).on(A.u, function(t) {
                    var e = t.target.value;
                    s(4 != e.length), o = !1;
                }), $(A.v).click(function() {
                    s(4 != a.value.length);
                });
                /* 生成密码 */
                var p = function() {
                    var e, a;
                    t(A.s).value = (e = [ "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "m", "n", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" ],
                    a = function(t, e) {
                        return Math.round((e - t) * Math.random() + t);
                    }, function(t) {
                        for (var o = [], r = 1; t >= r; r++) {
                            o.push(e[a(0, e.length - 1)]);
                        }
                        return o.join("");
                    }(4)), s(!1), o = !0;
                };
                /* 重新生成密码 */
                $(A.w).click(p);
                var c = require(A.k);
                /* 设置分享密码 */
                c.prototype.makePrivatePassword = function() {
                    var e = t(A.s).value;
                    return o ? (r = !1, setTimeout(function() {
                        p();
                    }, 1e3)) : 4 === e.length && (window.localStorage.setItem(A.r, e),
                    r = !0), e;
                },
                /* 每次打开初始化 */
                c.prototype.oldinitValidity = c.prototype.initValidity, c.prototype.initValidity = function() {
                    this.oldinitValidity(), r ? l() : p();
                };
            }
        }
    });
}();
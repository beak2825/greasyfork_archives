// ==UserScript==
// @name         教务宝相关功能
// @namespace    https://greasyfork.org/users/1218662
// @version      3.6
// @description  与教务宝相关的功能，如：搜索课评，数据统计等,仅供内部使用!
// @author       Giotto与Younmu
// @match        https://jwb.sc-edu.com/admin/*
// @icon         data:image/png;base64,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
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480442/%E6%95%99%E5%8A%A1%E5%AE%9D%E7%9B%B8%E5%85%B3%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/480442/%E6%95%99%E5%8A%A1%E5%AE%9D%E7%9B%B8%E5%85%B3%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

//引入Dialog的js，由于原本的链接失效，只能用这样引入
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function (t) { return typeof t } : function (t) { return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t }; !function (t, q) { "function" === typeof define && define.amd ? define(["minidialog"], q) : "undefined" !== typeof module && "object" === ("undefined" === typeof exports ? "undefined" : _typeof(exports)) ? module.exports = q() : t.Dialog = q() }("undefined" !== typeof window ? window : void 0, function () { function t(z) { for (var c in E) { var x = E[c]; if ("object" !== a.type(x)) void 0 === z[c] && (z[c] = x); else for (var d in x) z[c] ? void 0 === z[c][d] && (z[c][d] = x[d]) : z[c] = x } return z } function q(a, c, d) { e({ SHORTCUTS: { type: a, title: c, content: d } }) } var W = navigator.userAgent.toLowerCase().match("trident"), d = function (a, c) { return (c || document).querySelector(a) }, v = function (a, c) { a = "object" === ("undefined" === typeof a ? "undefined" : _typeof(a)) ? a.length ? a : [a] : (c || document).querySelectorAll(a); return Array.from ? Array.from(a) : [].slice.call(a) }, a = { getCSS: function (a, c) { return window.getComputedStyle(a, null).getPropertyValue(c) }, setCSS: function (a, c) { v(a).forEach(function (a) { for (var d in c) a.style[d] = c[d] }) }, setAttr: function (a, c) { v(a).forEach(function (a) { for (var d in c) a.setAttribute(d, c[d]) }) }, append: function (a, c) { v(a).forEach(function (a) { a.insertAdjacentHTML("beforeend", c) }) }, prepend: function (a, c) { v(a).forEach(function (a) { a.insertAdjacentHTML("afterbegin", c) }) }, remove: function (a) { v(a).forEach(function (a) { a.parentNode.removeChild(a) }) }, type: function (a) { return Object.prototype.toString.call(a).replace(/(\[object |\])/g, "").toLowerCase() }, isPlainObject: function (d) { return "object" === a.type(d) }, isEmptyObject: function (a) { return !Object.keys(a).length } }, P = function (a) { var c = ""; switch (a) { case "info": c = '\x3csvg viewBox\x3d"0 0 1024 1024" version\x3d"1.1" width\x3d"30" height\x3d"30"\x3e\x3cpath d\x3d"M513.46384 60.225663c-248.292969 0-449.584462 201.299679-449.584462 449.625394 0 248.296039 201.291492 449.594695 449.584462 449.594695 248.28069 0 449.63665-201.299679 449.63665-449.594695C963.099467 261.525342 761.744529 60.225663 513.46384 60.225663zM554.626331 714.465225c0 22.720468-18.416442 41.139979-41.136909 41.139979s-41.136909-18.419512-41.136909-41.139979L472.352513 453.586612c0-22.716374 18.416442-41.135886 41.136909-41.135886s41.136909 18.419512 41.136909 41.135886L554.626331 714.465225zM513.489422 372.423081c-25.719778 0-46.561455-20.845771-46.561455-46.557362 0-25.719778 20.841677-46.560432 46.561455-46.560432s46.561455 20.841677 46.561455 46.560432C560.050878 351.577311 539.2092 372.423081 513.489422 372.423081z" fill\x3d"#19b6f8"\x3e\x3c/path\x3e\x3c/svg\x3e'; break; case "success": c = '\x3csvg viewBox\x3d"0 0 1024 1024" version\x3d"1.1" width\x3d"30" height\x3d"30"\x3e\x3cpath d\x3d"M513.559007 60.225663c-248.299109 0-449.587532 201.299679-449.587532 449.625394 0 248.296039 201.288422 449.594695 449.587532 449.594695 248.27762 0 449.63358-201.299679 449.63358-449.594695C963.192587 261.525342 761.836627 60.225663 513.559007 60.225663zM766.338151 407.245168 485.919507 692.261527c-0.044002 0.045025-0.084934 0.092098-0.127913 0.137123s-0.090051 0.085958-0.134053 0.12996l-0.751107 0.763386c-6.256494 6.359848-14.548344 9.5454-22.967084 9.597589-0.061398 0.001023-0.121773 0.001023-0.183172 0.002047-0.161682 0-0.322341 0.004093-0.485047 0.002047-8.398274 0.068562-16.715707-2.979868-23.057135-9.217942L282.51591 540.491914c-12.999059-12.791327-12.775978-34.097586 0.49835-47.590901 13.281491-13.494339 34.58468-14.06739 47.576575-1.276063l130.36921 128.264269 256.507048-260.722046c12.797467-12.999059 34.100656-12.771885 47.591925 0.502443C778.555403 372.942921 779.129478 394.243039 766.338151 407.245168z" fill\x3d"#08ba61"\x3e\x3c/path\x3e\x3c/svg\x3e'; break; case "warn": c = '\x3csvg viewBox\x3d"0 0 1024 1024" version\x3d"1.1" width\x3d"30" height\x3d"30"\x3e\x3cpath d\x3d"M513.46384 60.225663c-248.291946 0-449.584462 201.299679-449.584462 449.624371 0 248.296039 201.292516 449.594695 449.584462 449.594695 248.28069 0 449.63665-201.299679 449.63665-449.594695C963.099467 261.525342 761.744529 60.225663 513.46384 60.225663zM473.683834 304.175721c2.690272-35.478026 40.597627-32.423457 40.597627-32.423457s34.488489-2.288113 39.011502 32.225959c0 0 8.162914 181.774997-15.904225 294.366308 0 0-3.746324 14.944364-23.107277 16.22145l0 0.275269c-20.751626-0.539282-24.692379-16.296151-24.692379-16.296151C465.521944 485.947647 473.683834 304.175721 473.683834 304.175721zM513.489422 747.984642c-25.719778 0-46.560432-20.840654-46.560432-46.560432 0-25.710568 20.840654-46.556339 46.560432-46.556339s46.561455 20.845771 46.561455 46.556339C560.050878 727.143988 539.2092 747.984642 513.489422 747.984642z" fill\x3d"#f39509"\x3e\x3c/path\x3e\x3c/svg\x3e'; break; case "error": c = '\x3csvg viewBox\x3d"0 0 1024 1024" version\x3d"1.1" width\x3d"30" height\x3d"30"\x3e\x3cpath d\x3d"M513.559007 60.225663c-248.291946 0-449.587532 201.299679-449.587532 449.625394 0 248.291946 201.295586 449.594695 449.587532 449.594695 248.284783 0 449.632557-201.303772 449.632557-449.594695C963.191564 261.525342 761.84379 60.225663 513.559007 60.225663zM678.729837 644.059712c12.798491 13.003152 12.217253 34.302247-1.272993 47.575552-13.490246 13.275351-34.800597 13.502525-47.590901 0.503467l-116.284423-118.191866-116.278283 118.187773c-12.798491 13.003152-34.093493 12.774955-47.590901-0.499373-13.497409-13.277398-14.063297-34.576493-1.279133-47.575552l117.065206-118.984928L348.433202 406.088832c-12.783141-12.999059-12.218276-34.298154 1.279133-47.576575 13.497409-13.274328 34.792411-13.501502 47.590901-0.49835l116.279307 118.187773 116.2834-118.190843c12.790304-12.999059 34.100656-12.771885 47.590901 0.502443 13.491269 13.274328 14.071484 34.573423 1.272993 47.576575L561.666678 525.07376 678.729837 644.059712z" fill\x3d"#d81e06"\x3e\x3c/path\x3e\x3c/svg\x3e'; break; case "close": c = '\x3csvg viewBox\x3d"0 0 1024 1024" version\x3d"1.1" width\x3d"16" height\x3d"16"\x3e\x3cpath d\x3d"M806.4 172.8l-633.6 633.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l633.6-633.6c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0z" fill\x3d"#000"\x3e\x3c/path\x3e\x3cpath d\x3d"M172.8 172.8c-12.8 12.8-12.8 32 0 44.8l633.6 633.6c12.8 12.8 32 12.8 44.8 0 12.8-12.8 12.8-32 0-44.8L217.6 172.8c-12.8-12.8-32-12.8-44.8 0z" fill\x3d"#000"\x3e\x3c/path\x3e\x3c/svg\x3e' }return c }, Q = '\n\t\t\x3cdiv class\x3d"mini-dialog-container"\x3e\n\t\t\t\x3cdiv class\x3d"mini-dialog-mask"\x3e\x3c/div\x3e\n\t\t\t\x3cdiv class\x3d"mini-dialog-wrapper"\x3e\n\t\t\t\t\x3cdiv class\x3d"mini-dialog-header"\x3e\n\t\t\t\t\t\x3cspan\x3e\x3c/span\x3e\n\t\t\t\t\t\x3ci\x3e' + P("close") + '\x3c/i\x3e\n\t\t\t\t\x3c/div\x3e\n\t\t\t\t\x3cdiv class\x3d"mini-dialog-main"\x3e\n\t\t\t\t\t\x3cdiv\x3e\x3c/div\x3e\n\t\t\t\t\x3c/div\x3e\n\t\t\t\t\x3cdiv class\x3d"mini-dialog-footer mini-dialog-noselect"\x3e\n\t\t\t\t\t\x3cdiv class\x3d"mini-dialog-cancel"\x3e\n\t\t\t\t\t\t\x3cspan\x3e\x3c/span\x3e\n\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\t\x3cdiv class\x3d"mini-dialog-ok"\x3e\n\t\t\t\t\t\t\x3cspan\x3e\x3c/span\x3e\n\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\x3c/div\x3e\n\t\t\t\x3c/div\x3e\n\t\t\x3c/div\x3e\n\t', E = { title: "\u7f51\u9875\u6d88\u606f", content: "", contentBgColor: "#fff", iframeContent: null, videoContent: null, imageContent: null, fullscreen: !1, draggable: !1, maskClose: !1, mask: !0, closable: !0, showTitle: !0, bodyScroll: !0, showButton: !0, autoCloseEffect: !0, parentsIframeLayer: 0, borderRadius: 6, autoClose: 0, width: 500, ok: { text: "\u786e\u5b9a", waiting: !1, waitingText: "\u786e\u5b9a", notClose: !1, callback: function () { } }, cancel: { text: "\u53d6\u6d88", show: !0, callback: function () { } }, afterOpen: function () { }, afterClose: function () { }, SHORTCUTS: null, WAITING: null }, e = function c() { function x() { g.removeEventListener("animationend", x); "function" === a.type(b.afterOpen) && b.afterOpen(); var e = d(".mini-dialog-autoclose", g); e && (e.style.transitionDuration = ~~b.autoClose + "ms", e.classList.add("mini-dialog-autoclose-active"), e.addEventListener("transitionend", function () { c.close(n, m) })) } var k = arguments.length, f = {}; if (k) { 1 === k ? a.isPlainObject(0 >= arguments.length ? void 0 : arguments[0]) ? f = 0 >= arguments.length ? void 0 : arguments[0] : f.content = 0 >= arguments.length ? void 0 : arguments[0] : (f.title = 0 >= arguments.length ? void 0 : arguments[0], f.content = 1 >= arguments.length ? void 0 : arguments[1], f.width = 2 >= arguments.length ? void 0 : arguments[2]); var b = t(f || {}); b.WAITING && (b.showTitle = !1, b.showButton = !1, b.width = "auto"); var f = b.fullscreen, e = b.width, m = void 0; if (b.parentsIframeLayer) { m = parent; for (k = 0; k < b.parentsIframeLayer - 1; k++)m = m.parent; d("style.mini-dialog-css", m.document) || a.append(d("head", m.document), '\x3cstyle class\x3d"mini-dialog-css"\x3e\n\t\tbody.mini-dialog-body-noscroll{padding-right:17px;position:relative;height:100%;overflow:hidden}\n\t\t.mini-dialog-noselect{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}\n\t\t.mini-dialog-container{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483580;pointer-events:none}\n\t\t.mini-dialog-container *{-webkit-tap-highlight-color:transparent;margin:0;padding:0}\n\t\t.mini-dialog-container-top{z-index:2147483584}\n\t\t.mini-dialog-mask{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);pointer-events:auto}\n\t\t.mini-dialog-mask-show{animation:MiniDialogMaskShow .35s;}\n\t\t.mini-dialog-mask-hide{animation:MiniDialogMaskHide .35s;}\n\t\t.mini-dialog-wrapper{position:absolute;top:50%;left:50%;background:#fff;overflow:hidden;transform:translate(-50%,-50%);box-shadow:rgba(0,0,0,.12) 0 0 12px;pointer-events:auto}\n\t\t.mini-dialog-wrapper-fullscreen{width:100%!important;height:100%!important;border-radius:0!important}\n\t\t.mini-dialog-wrapper-show{animation:MiniDialogWrapperShow .35s;}\n\t\t.mini-dialog-wrapper-hide{animation:MiniDialogWrapperHide .35s;}\n\t\t.mini-dialog-header{overflow:hidden;border-bottom:#e6e6e6 solid 1px}\n\t\t.mini-dialog-header-move{cursor:grab}\n\t\t.mini-dialog-header-move-ie{cursor:move}\n\t\t.mini-dialog-header\x3espan{display:block;float:left;width:calc(100% - 65px);height:52px;line-height:52px;padding:0 15px;font-size:16px;font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n\t\t.mini-dialog-header\x3ei{display:block;float:right;width:20px;height:20px;line-height:20px;margin:17px 13px 0 0;font-style:normal;text-align:center;cursor:pointer;opacity:.35;transition:.2s}\n\t\t.mini-dialog-header\x3ei:hover{opacity:1}\n\t\t.mini-dialog-header-drag{cursor:move}\n\t\t.mini-dialog-main{position:relative;padding:15px 0;min-height:100px;font-size:14px;line-height:160%;overflow:auto;word-break:break-all;color:#292929;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}\n\t\t.mini-dialog-main\x3ediv{overflow:hidden;margin:0 15px}\n\t\t.mini-dialog-main\x3eiframe,.mini-dialog-main\x3eimg{display:block;position:absolute;top:0;left:0;width:100%;height:100%}\n\t\t.mini-dialog-main.mini-dialog-mobile-main{padding:10px 0}\n\t\t.mini-dialog-main.mini-dialog-mobile-main\x3ediv{margin:0 10px}\n\t\t.mini-dialog-main:hover .mini-dialog-image-prev,.mini-dialog-main:hover .mini-dialog-image-next{opacity:1}\n\t\t.mini-dialog-waiting-wrapper{box-shadow:none;padding:0;background:rgba(0,0,0,.7);border-radius:4px}\n\t\t.mini-dialog-waiting-wrapper .mini-dialog-main{background:rgba(0,0,0,0)!important;min-height:0;color:#eee;font-size:13px;text-align:center;padding:10px}\n\t\t.mini-dialog-waiting-wrapper span{display:block;text-align:center;margin-top:8px}\n\t\t.mini-dialog-waiting-box{margin:0 auto!important;width:40px;height:40px;border-radius:50%;border:rgba(255,255,255,.4) solid 3px;border-left:#eee solid 3px;animation:MiniDialogWaiting 1s linear infinite}\n\t\t.mini-dialog-image-prev,.mini-dialog-image-next{opacity:0;transition:.2s}\n\t\tdiv.mini-dialog-image-wrapper{position:absolute;top:0;left:0;width:100%;height:100%;margin:0}\n\t\t.mini-dialog-image-wrapper\x3ediv:first-child{position:absolute;top:0;left:0;height:100%;transition-property:transform;transition-duration:.8s;transition-timing-function:cubic-bezier(.57,0,.375,1)}\n\t\t.mini-dialog-image-wrapper img{display:block;float:left}\n\t\tdiv.mini-dialog-image-next,div.mini-dialog-image-prev{width:40px;height:40px;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTU1NzI0MjA4NjA5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyOTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY3MC42NzY5MjkgNzc3LjU5Mjk4NCA0MDMuNjI3NzggNTEzLjM2MjAyMWwyNjUuMzIwNzg1LTI2OC4xNDYxMzNjMTEuNzc2MjA4LTExLjc3NTE4NCAxMS43MzQyNTItMzAuOTA4OTY0LTAuMDkxMDc0LTQyLjczNDI5bC0wLjAwMTAyMyAwYy0xMS44MjUzMjYtMTEuODI2MzUtMzAuOTU4MDgyLTExLjg2NzI4Mi00Mi43MjgxNSAyLjkzMDc0OUwzNDMuMTAwMjQyIDQ4OC40NDA0MjFjLTMuODE3OTU1IDQuMjczMzI3LTguMjA1ODkyIDkuMzIxMjk2LTguOTMzNDYzIDEyLjA0NTMzNy00LjQ3MDgyNSAxMS4xMTIwODItMi4yMzI4NTQgMjQuNzY1MDMzIDYuNzEwODQyIDM1Ljk4NzYzMmwyODYuOTgyMTMgMjg2Ljk4MjEzYzExLjg3NTQ2OCA4Ljg0NzUwNSAzMS4wOTYyMjkgOC44OTM1NTQgNDIuOTIyNTc4LTIuOTMyNzk2QzY4Mi42MDY2MzMgODA4LjY5NjM3NiA2ODIuNTYwNTg0IDc4OS40NzY2MzkgNjcwLjY3NjkyOSA3NzcuNTkyOTg0eiIgcC1pZD0iMjI5MSIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvc3ZnPg\x3d\x3d);background-color:rgba(0,0,0,.5);background-position:center;background-repeat:no-repeat;position:absolute;top:50%;border-radius:50%;cursor:pointer;margin-top:-20px}\n\t\t.mini-dialog-image-prev{left:15px}\n\t\t.mini-dialog-image-next{right:15px;transform:rotate(180deg)}\n\t\t.mini-dialog-footer{text-align:right;height:68px;padding:15px 0;border-top:#e6e6e6 solid 1px}\n\t\t.mini-dialog-footer\x3ediv{display:inline-block;font-size:14px;cursor:pointer;text-align:center;border:#e8e8e8 solid 1px;height:32px;line-height:32px;vertical-align:middle;border-radius:4px;padding:0 14px;transition:.2s}\n\t\tdiv.mini-dialog-ok{color:#fff;background:#19b6f8;border-color:#19b6f8;margin:0 15px 0 5px}\n\t\tdiv.mini-dialog-ok:hover{background:#08a0e0;border-color:#08a0e0}\n\t\tdiv.mini-dialog-cancel{color:#888;background:#fff}\n\t\tdiv.mini-dialog-cancel:hover{background:#fafafa}\n\t\tdiv.mini-dialog-shortcuts-ok{margin:-5px 20px 0 0}\n\t\tdiv.mini-dialog-ok-disabled{pointer-events:none;opacity:.5}\n\t\t.mini-dialog-ok i{display:inline-block;width:12px;height:12px;margin-right:5px;border-radius:50%;border:#fff solid 1px;border-left:#09f solid 1px;animation:MiniDialogWaiting 1s linear infinite}\n\t\t.mini-dialog-autoclose{position:absolute;left:0;bottom:0;height:3px;background:#19b6f8;width:100%;transform:scaleX(0);transform-origin:left center;transition-property:transform;transition-timing-function:linear}\n\t\t.mini-dialog-autoclose-active{transform:scaleX(1)}\n\t\t.mini-dialog-shortcuts\x3ei{display:block;float:left;width:30px;height:30px;margin:8px 0 0 10px;border-radius:50%;transform:scale(.9)}\n\t\t.mini-dialog-shortcuts\x3ediv{float:left;width:calc(100% - 60px);margin:8px 0 0 10px}\n\t\t.mini-dialog-shortcuts\x3ediv p{display:block;font-size:16px;font-weight:700;word-break:break-all;margin-top:3px}\n\t\t.mini-dialog-shortcuts\x3ediv div{font-size:14px;margin-top:5px;word-break:break-all}\n\t\t.mini-dialog-mask-animate-enter-active,.mini-dialog-mask-animate-leave-active{transition:opacity .35s}\n\t\t.mini-dialog-mask-animate-enter,.mini-dialog-mask-animate-leave-to{opacity:0}\n\t\t.mini-dialog-wrapper-animate-enter-active,.mini-dialog-wrapper-animate-leave-active{transition:.35s}\n\t\t.mini-dialog-wrapper-animate-enter,.mini-dialog-wrapper-animate-leave-to{transform:translate(-50%,-50%) scale(.85);opacity:0}\n\t\t@keyframes MiniDialogMaskShow{0%{opacity:0}100%{opacity:1}}\n\t\t@keyframes MiniDialogMaskHide{0%{opacity:1}100%{opacity:0}}\n\t\t@keyframes MiniDialogWrapperShow{0%{opacity:0;transform:translate(-50%,-50%) scale(.82)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}\n\t\t@keyframes MiniDialogWrapperHide{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.82)}}\n\t\t@keyframes MiniDialogWaiting{0%{transform:translateY(2px) rotate(0) scale(.85)}100%{transform:translateY(2px) rotate(360deg) scale(.85)}}\n\t\x3c/style\x3e'); a.append(d("body", m.document), Q) } else d("style.mini-dialog-css") || a.append(d("head"), '\x3cstyle class\x3d"mini-dialog-css"\x3e\n\t\tbody.mini-dialog-body-noscroll{padding-right:17px;position:relative;height:100%;overflow:hidden}\n\t\t.mini-dialog-noselect{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}\n\t\t.mini-dialog-container{position:fixed;top:0;left:0;width:100%;height:100%;z-index:2147483580;pointer-events:none}\n\t\t.mini-dialog-container *{-webkit-tap-highlight-color:transparent;margin:0;padding:0}\n\t\t.mini-dialog-container-top{z-index:2147483584}\n\t\t.mini-dialog-mask{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);pointer-events:auto}\n\t\t.mini-dialog-mask-show{animation:MiniDialogMaskShow .35s;}\n\t\t.mini-dialog-mask-hide{animation:MiniDialogMaskHide .35s;}\n\t\t.mini-dialog-wrapper{position:absolute;top:50%;left:50%;background:#fff;overflow:hidden;transform:translate(-50%,-50%);box-shadow:rgba(0,0,0,.12) 0 0 12px;pointer-events:auto}\n\t\t.mini-dialog-wrapper-fullscreen{width:100%!important;height:100%!important;border-radius:0!important}\n\t\t.mini-dialog-wrapper-show{animation:MiniDialogWrapperShow .35s;}\n\t\t.mini-dialog-wrapper-hide{animation:MiniDialogWrapperHide .35s;}\n\t\t.mini-dialog-header{overflow:hidden;border-bottom:#e6e6e6 solid 1px}\n\t\t.mini-dialog-header-move{cursor:grab}\n\t\t.mini-dialog-header-move-ie{cursor:move}\n\t\t.mini-dialog-header\x3espan{display:block;float:left;width:calc(100% - 65px);height:52px;line-height:52px;padding:0 15px;font-size:16px;font-weight:700;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}\n\t\t.mini-dialog-header\x3ei{display:block;float:right;width:20px;height:20px;line-height:20px;margin:17px 13px 0 0;font-style:normal;text-align:center;cursor:pointer;opacity:.35;transition:.2s}\n\t\t.mini-dialog-header\x3ei:hover{opacity:1}\n\t\t.mini-dialog-header-drag{cursor:move}\n\t\t.mini-dialog-main{position:relative;padding:15px 0;min-height:100px;font-size:14px;line-height:160%;overflow:auto;word-break:break-all;color:#292929;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}\n\t\t.mini-dialog-main\x3ediv{overflow:hidden;margin:0 15px}\n\t\t.mini-dialog-main\x3eiframe,.mini-dialog-main\x3eimg{display:block;position:absolute;top:0;left:0;width:100%;height:100%}\n\t\t.mini-dialog-main.mini-dialog-mobile-main{padding:10px 0}\n\t\t.mini-dialog-main.mini-dialog-mobile-main\x3ediv{margin:0 10px}\n\t\t.mini-dialog-main:hover .mini-dialog-image-prev,.mini-dialog-main:hover .mini-dialog-image-next{opacity:1}\n\t\t.mini-dialog-waiting-wrapper{box-shadow:none;padding:0;background:rgba(0,0,0,.7);border-radius:4px}\n\t\t.mini-dialog-waiting-wrapper .mini-dialog-main{background:rgba(0,0,0,0)!important;min-height:0;color:#eee;font-size:13px;text-align:center;padding:10px}\n\t\t.mini-dialog-waiting-wrapper span{display:block;text-align:center;margin-top:8px}\n\t\t.mini-dialog-waiting-box{margin:0 auto!important;width:40px;height:40px;border-radius:50%;border:rgba(255,255,255,.4) solid 3px;border-left:#eee solid 3px;animation:MiniDialogWaiting 1s linear infinite}\n\t\t.mini-dialog-image-prev,.mini-dialog-image-next{opacity:0;transition:.2s}\n\t\tdiv.mini-dialog-image-wrapper{position:absolute;top:0;left:0;width:100%;height:100%;margin:0}\n\t\t.mini-dialog-image-wrapper\x3ediv:first-child{position:absolute;top:0;left:0;height:100%;transition-property:transform;transition-duration:.8s;transition-timing-function:cubic-bezier(.57,0,.375,1)}\n\t\t.mini-dialog-image-wrapper img{display:block;float:left}\n\t\tdiv.mini-dialog-image-next,div.mini-dialog-image-prev{width:40px;height:40px;background-image:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTU1NzI0MjA4NjA5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyOTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjgiIGhlaWdodD0iMjgiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTY3MC42NzY5MjkgNzc3LjU5Mjk4NCA0MDMuNjI3NzggNTEzLjM2MjAyMWwyNjUuMzIwNzg1LTI2OC4xNDYxMzNjMTEuNzc2MjA4LTExLjc3NTE4NCAxMS43MzQyNTItMzAuOTA4OTY0LTAuMDkxMDc0LTQyLjczNDI5bC0wLjAwMTAyMyAwYy0xMS44MjUzMjYtMTEuODI2MzUtMzAuOTU4MDgyLTExLjg2NzI4Mi00Mi43MjgxNSAyLjkzMDc0OUwzNDMuMTAwMjQyIDQ4OC40NDA0MjFjLTMuODE3OTU1IDQuMjczMzI3LTguMjA1ODkyIDkuMzIxMjk2LTguOTMzNDYzIDEyLjA0NTMzNy00LjQ3MDgyNSAxMS4xMTIwODItMi4yMzI4NTQgMjQuNzY1MDMzIDYuNzEwODQyIDM1Ljk4NzYzMmwyODYuOTgyMTMgMjg2Ljk4MjEzYzExLjg3NTQ2OCA4Ljg0NzUwNSAzMS4wOTYyMjkgOC44OTM1NTQgNDIuOTIyNTc4LTIuOTMyNzk2QzY4Mi42MDY2MzMgODA4LjY5NjM3NiA2ODIuNTYwNTg0IDc4OS40NzY2MzkgNjcwLjY3NjkyOSA3NzcuNTkyOTg0eiIgcC1pZD0iMjI5MSIgZmlsbD0iI2ZmZmZmZiI+PC9wYXRoPjwvc3ZnPg\x3d\x3d);background-color:rgba(0,0,0,.5);background-position:center;background-repeat:no-repeat;position:absolute;top:50%;border-radius:50%;cursor:pointer;margin-top:-20px}\n\t\t.mini-dialog-image-prev{left:15px}\n\t\t.mini-dialog-image-next{right:15px;transform:rotate(180deg)}\n\t\t.mini-dialog-footer{text-align:right;height:68px;padding:15px 0;border-top:#e6e6e6 solid 1px}\n\t\t.mini-dialog-footer\x3ediv{display:inline-block;font-size:14px;cursor:pointer;text-align:center;border:#e8e8e8 solid 1px;height:32px;line-height:32px;vertical-align:middle;border-radius:4px;padding:0 14px;transition:.2s}\n\t\tdiv.mini-dialog-ok{color:#fff;background:#19b6f8;border-color:#19b6f8;margin:0 15px 0 5px}\n\t\tdiv.mini-dialog-ok:hover{background:#08a0e0;border-color:#08a0e0}\n\t\tdiv.mini-dialog-cancel{color:#888;background:#fff}\n\t\tdiv.mini-dialog-cancel:hover{background:#fafafa}\n\t\tdiv.mini-dialog-shortcuts-ok{margin:-5px 20px 0 0}\n\t\tdiv.mini-dialog-ok-disabled{pointer-events:none;opacity:.5}\n\t\t.mini-dialog-ok i{display:inline-block;width:12px;height:12px;margin-right:5px;border-radius:50%;border:#fff solid 1px;border-left:#09f solid 1px;animation:MiniDialogWaiting 1s linear infinite}\n\t\t.mini-dialog-autoclose{position:absolute;left:0;bottom:0;height:3px;background:#19b6f8;width:100%;transform:scaleX(0);transform-origin:left center;transition-property:transform;transition-timing-function:linear}\n\t\t.mini-dialog-autoclose-active{transform:scaleX(1)}\n\t\t.mini-dialog-shortcuts\x3ei{display:block;float:left;width:30px;height:30px;margin:8px 0 0 10px;border-radius:50%;transform:scale(.9)}\n\t\t.mini-dialog-shortcuts\x3ediv{float:left;width:calc(100% - 60px);margin:8px 0 0 10px}\n\t\t.mini-dialog-shortcuts\x3ediv p{display:block;font-size:16px;font-weight:700;word-break:break-all;margin-top:3px}\n\t\t.mini-dialog-shortcuts\x3ediv div{font-size:14px;margin-top:5px;word-break:break-all}\n\t\t.mini-dialog-mask-animate-enter-active,.mini-dialog-mask-animate-leave-active{transition:opacity .35s}\n\t\t.mini-dialog-mask-animate-enter,.mini-dialog-mask-animate-leave-to{opacity:0}\n\t\t.mini-dialog-wrapper-animate-enter-active,.mini-dialog-wrapper-animate-leave-active{transition:.35s}\n\t\t.mini-dialog-wrapper-animate-enter,.mini-dialog-wrapper-animate-leave-to{transform:translate(-50%,-50%) scale(.85);opacity:0}\n\t\t@keyframes MiniDialogMaskShow{0%{opacity:0}100%{opacity:1}}\n\t\t@keyframes MiniDialogMaskHide{0%{opacity:1}100%{opacity:0}}\n\t\t@keyframes MiniDialogWrapperShow{0%{opacity:0;transform:translate(-50%,-50%) scale(.82)}100%{opacity:1;transform:translate(-50%,-50%) scale(1)}}\n\t\t@keyframes MiniDialogWrapperHide{0%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(.82)}}\n\t\t@keyframes MiniDialogWaiting{0%{transform:translateY(2px) rotate(0) scale(.85)}100%{transform:translateY(2px) rotate(360deg) scale(.85)}}\n\t\x3c/style\x3e'), a.append(d("body"), Q); var n = m ? d("body \x3e .mini-dialog-container:last-child", m.document) : d("body \x3e .mini-dialog-container:last-child"), k = d(".mini-dialog-mask", n), g = d(".mini-dialog-wrapper", n), u = d(".mini-dialog-header", g), r = d("span", u), q = d("i", u), l = d(".mini-dialog-main", g), E = d("div", l), F = d(".mini-dialog-footer", g), A = d(".mini-dialog-ok", F), K = d(".mini-dialog-cancel", F), B = document.documentElement.clientWidth, p = document.documentElement.clientHeight, N = !!(430 > B); if (e > B || f) e = B; g.style.width = e + "px"; !N || f || b.WAITING || (g.style.width = B - 60 + "px"); r.textContent = b.title; g.style.borderRadius = b.borderRadius + "px"; l.style.background = b.contentBgColor; E.innerHTML = b.content; d("span", A).textContent = b.ok.text; d("span", K).textContent = b.cancel.text; b.bodyScroll || d("body", m ? m.document : window.document).classList.add("mini-dialog-body-noscroll"); b.showTitle || a.remove(u); b.showButton || a.remove(F); b.cancel.show || a.remove(K); b.closable || (a.remove(q), r.style.width = "calc(100% - 30px)"); b.mask || a.remove(k); var r = u.offsetHeight + F.offsetHeight, h = b.iframeContent, R = !1; if (a.isPlainObject(b.iframeContent)) { var G = h.src, h = h.height; if (!G || !h) return; R = !0; if (f || h > p - r) h = p - r; a.setCSS(l, { padding: 0, height: h + "px" }); l.innerHTML = '\x3ciframe src\x3d"' + G + '" frameborder\x3d"0" scrolling\x3d"auto"\x3e\x3c/iframe\x3e' } h = b.imageContent; G = !1; if (a.isPlainObject(h)) { var Y = function X() { L = !1; O.removeEventListener("transitionend", X) }, S = function (a) { L = !0; O.style.transform = "translateX(" + -a * e + "px)"; O.addEventListener("transitionend", Y) }, y = h.src, H = h.height; if (!y || !H) return; G = !0; if (f || H > p - r) H = p - r; var T = y.length, I = ""; Array.isArray(y) ? (y.forEach(function (a) { I += '\x3cimg src\x3d"' + a + '" style\x3d"width:' + e + "px;height:" + H + 'px;" ondragstart\x3d"return false"\x3e' }), I = '\n\t\t\t\t\t\x3cdiv class\x3d"mini-dialog-image-wrapper mini-dialog-noselect"\x3e\n\t\t\t\t\t\t\x3cdiv style\x3d"width:' + e * T + 'px;"\x3e\n\t\t\t\t\t\t\t' + I + '\n\t\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\t\t\x3cdiv class\x3d"mini-dialog-image-prev"\x3e\x3c/div\x3e\n\t\t\t\t\t\t\x3cdiv class\x3d"mini-dialog-image-next"\x3e\x3c/div\x3e\n\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t') : I = '\x3cimg src\x3d"' + y + '"\x3e'; a.setCSS(l, { padding: 0, overflow: "hidden", height: H + "px" }); l.innerHTML = I; var O = d(".mini-dialog-image-wrapper \x3e div:first-child", l), h = v(".mini-dialog-image-prev, .mini-dialog-image-next", l), C = 0, L = !1; 2 === h.length && (h[0].onclick = function () { C && !L && (C--, S(C)) }, h[1].onclick = function () { C < T - 1 && !L && (C++, S(C)) }) } var D = b.videoContent, h = !1; if (a.isPlainObject(D)) { var y = D.src, J = D.height, D = D.autoplay; if (!y || !J) return; h = !0; if (f || J > p - r) J = p - r; a.setCSS(l, { padding: 0, overflow: "hidden", height: J + "px", background: "#000" }); l.innerHTML = '\x3cvideo src\x3d"' + y + '" width\x3d"' + e + '" height\x3d"' + J + '" controls\x3e\x3c/video\x3e'; D && d("video", l).setAttribute("autoplay", !0) } 1 < v(".mini-dialog-mask").length && a.remove(k); "function" === a.type(b.afterClose) && (n.mini_dialog_afterclose = b.afterClose); f && (a.setCSS(g, { height: p + "px", borderRadius: 0 }), l.style.height = p - r - (h || G || R ? 0 : 30) + "px"); "number" === a.type(b.autoClose) && 2E3 < b.autoClose && b.autoCloseEffect && a.append(g, '\x3cdiv class\x3d"mini-dialog-autoclose"\x3e\x3c/div\x3e'); a.getCSS(g, "height") > p && (l.style.height = p - r + "px"); a.isPlainObject(b.SHORTCUTS) && !a.isEmptyObject(b.SHORTCUTS) && (a.remove(u), a.remove(K), a.remove(E), F.style.borderTop = "none", g.style.width = (N ? w - 60 : 420) + "px", g.classList.add("mini-dialog-shortcuts-mark"), l.innerHTML = '\n\t\t\t\t\x3cdiv\x3e\n\t\t\t\t\t\x3cdiv class\x3d"mini-dialog-shortcuts"\x3e\n\t\t\t\t\t\t\x3ci\x3e' + P(b.SHORTCUTS.type) + "\x3c/i\x3e\n\t\t\t\t\t\t\t\x3cdiv\x3e\n\t\t\t\t\t\t\t\t\x3cp\x3e" + b.SHORTCUTS.title + "\x3c/p\x3e\n\t\t\t\t\t\t\t\t\x3cdiv\x3e" + (b.SHORTCUTS.content || "") + "\x3c/div\x3e\n\t\t\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\t\x3c/div\x3e\n\t\t\t\t\x3c/div\x3e\n\t\t\t", l.style.minHeight = "90px", N && l.classList.add("mini-dialog-mobile-main")); b.WAITING && (g.classList.add("mini-dialog-waiting-wrapper"), f = "", "string" === a.type(b.WAITING) && (f = b.WAITING), l.innerHTML = '\x3cdiv class\x3d"mini-dialog-waiting-box"\x3e\x3c/div\x3e\x3cspan\x3e' + f + "\x3c/span\x3e", "function" === a.type(b.WAITING) && b.WAITING(d(".mini-dialog-waiting-box + span"))); b.maskClose && (k.onclick = function () { return c.close(n, m) }); q.onclick = function () { return c.close(n, m) }; K.onclick = function () { c.close(n, m); "function" === a.type(b.cancel.callback) && b.cancel.callback() }; A.onclick = function () { "function" === a.type(b.ok.callback) && b.ok.callback(A); b.ok.waiting || b.ok.notClose || A.classList.contains("mini-dialog-notclose") || c.close(n, m); b.ok.waiting && (a.prepend(A, "\x3ci\x3e\x3c/i\x3e"), a.setCSS(A, { opacity: .5, pointerEvents: "none" }), d("span", A).textContent = b.ok.waitingText) }; if (b.draggable && !b.fullscreen) { f = function () { u.style.removeProperty("cursor"); n.classList.remove("mini-dialog-noselect"); document.onmousemove = null }; a.remove(k); var M = parseFloat(a.getCSS(g, "height")), U = void 0, V = void 0; g.onmousedown = function () { v(".mini-dialog-container-top").forEach(function (a) { a.classList.remove("mini-dialog-container-top") }); n.classList.add("mini-dialog-container-top") }; u.classList.add("mini-dialog-header-move" + (W ? "-ie" : "")); u.onmousedown = function (b) { b.preventDefault(); n.classList.add("mini-dialog-noselect"); u.style.cursor = "grabbing"; V = b.pageX - g.offsetLeft; U = b.pageY - g.offsetTop; document.onmousemove = function (b) { var c = b.pageX - V; b = b.pageY - U; c < e / 2 && (c = e / 2); b < M / 2 && (b = M / 2); c > B - e / 2 && (c = B - e / 2); b > p - M / 2 && (b = p - M / 2); a.setCSS(g, { left: c + "px", top: b + "px" }) } }; u.onmouseup = f; document.onmouseup = f } k.classList.add("mini-dialog-mask-show"); g.classList.add("mini-dialog-wrapper-show"); g.addEventListener("animationend", x); return n } }; e.info = function (a, d) { q("info", a, d); return e }; e.success = function (a, d) { q("success", a, d); return e }; e.warn = function (a, d) { q("warn", a, d); return e }; e.error = function (a, d) { q("error", a, d); return e }; e.waiting = function () { e({ WAITING: 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : "\u8bf7\u7b49\u5f85" }) }; e.okNotClose = function () { var a = d(".mini-dialog-ok"); a && a.classList.add("mini-dialog-notclose"); return e }; e.close = function (c) { var e = (1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : window).document, k = v(c || ".mini-dialog-container", e); k.length && k.forEach(function (c) { var b = d(".mini-dialog-wrapper", c), f = d(".mini-dialog-mask", c); b.classList.add("mini-dialog-wrapper-hide"); b.addEventListener("animationend", function () { var b = c.mini_dialog_afterclose; b && b(); a.remove(c); d("body", e).classList.remove("mini-dialog-body-noscroll") }); f && f.classList.add("mini-dialog-mask-hide") }) }; e.ok = function (c) { var e = d(".mini-dialog-shortcuts-mark .mini-dialog-ok"); if (e) { var k = "function" === a.type(c); e.addEventListener("click", function () { e.classList.contains("mini-dialog-notclose") ? (e.style.pointerEvents = "none", k && c(e)) : d(".mini-dialog-shortcuts-mark").addEventListener("animationend", function () { k && c() }) }) } }; return e });
///
(function () {
    //渲染完成加载方法
    window.onload = function () {
        SearchContent()
        getlist()
        open_btn()
    }
    //将数据存入indexedDB的方法
    async function storeDataInIndexedDB(content_data) {
        try {
            // 打开或创建一个 IndexedDB 数据库
            const db = await new Promise((resolve, reject) => {
                const request = indexedDB.open('kpDatabase', 1);

                request.onupgradeneeded = function (event) {
                    const db = event.target.result;
                    // 判断是否已经存在，若不存在创建一个名为 'kpStore' 的对象存储空间，并将键路径设置为 'id'
                    if (!db.objectStoreNames.contains('kpStore')) {
                        db.createObjectStore('kpStore', { keyPath: 'id' });
                    }
                };

                request.onsuccess = function (event) {
                    resolve(event.target.result);
                };

                request.onerror = function (event) {
                    reject(event.target.error);
                };
            });

            // 获取事务
            const transaction = db.transaction(['kpStore'], 'readwrite');
            const objectStore = transaction.objectStore('kpStore');

            // 清空原有数据
            await new Promise((resolve, reject) => {
                const clearRequest = objectStore.clear();

                clearRequest.onsuccess = resolve;
                clearRequest.onerror = reject;
            });

            // 将新数据存储到 IndexedDB
            for (let i = 0; i < content_data.length; i++) {
                const data = { id: i, content: content_data[i] };
                objectStore.add(data);
            }

            // 完成事务
            await new Promise((resolve, reject) => {
                transaction.oncomplete = resolve;
                transaction.onerror = reject;
            });

            console.log('Data stored in IndexedDB.');
        } catch (error) {
            console.error('Error storing data in IndexedDB:', error);
        }
    }

    //搜索指定课评内容
    function SearchContent() {
        //平台号
        var bid = 39606
        //添加按钮
        var button = '<button style="margin-left:10px" id="v-update" type="button" class="el-button el-button--default"><span>更新数据(半年点一次)</span></button><input type="text" id="title_id" autocomplete="off" placeholder="课程标题.." class="el-input__inner" style="width:100px;margin-left:10px"><button style="margin-left:10px" id="v-search" type="button" class="el-button el-button--default"><span>搜索课评</span></button>';
        $("#main").before(button);
        //更新indexedDB数据库，将请求的数据保存到indexedDB数据库，这样就不用每次都重新请求（很慢）！
        $("#v-update").click(function () {
            if ($("#main > .page-title-part > .page-title").text() != '课评记录') {
                alert("请在课评记录页面点击更新数据！！！")
            } else {
                //获取当前时间
                const date = new Date().toLocaleDateString().split("/").join("-");
                //用来存储课评数据
                var kp_data = []
                //请求数据
                $.ajax({
                    type: "POST",
                    url: "https://jwb.sc-edu.com/api/lesson/comment_list/",
                    data: {
                        async: false,
                        branch_id: bid,
                        start: '2000-07-01',
                        end: date,
                        page: 1,
                        limit: 6000    //服务器垃圾，请求数量太多会报500错误，可适当减少数量
                    },
                    beforeSend: function () {
                        //教务宝自带的加载动画
                        $(".el-loading-mask").css('display', 'block')
                        $(".el-loading-mask p").text('加载数据中，请耐心！耐心！等待！')
                    },
                    success: function (res) {
                        var content = JSON.parse(res).data.lists
                        //遍历数据
                        for (let i = 0; i < content.length; i++) {
                            kp_data.push(content[i].comment_info.content)
                        }
                        //一次请求的数量不能太多，所以请求第二次
                        $.ajax({
                            type: "POST",
                            url: "https://jwb.sc-edu.com/api/lesson/comment_list/",
                            data: {
                                async: false,
                                branch_id: bid,
                                start: '2000-07-01',
                                end: date,
                                page: 2,
                                limit: 6000    //服务器垃圾，请求数量太多会报500错误，可适当减少数量
                            },
                            beforeSend: function () {
                                //教务宝自带的加载动画
                                $(".el-loading-mask").css('display', 'block')
                                $(".el-loading-mask p").text('加载数据中，请耐心！耐心！等待！')
                            },
                            complete: function () {
                                $(".el-loading-mask").css('display', 'none')
                            },
                            success: function (res) {
                                $(".el-loading-mask").css('display', 'none')
                                var content = JSON.parse(res).data.lists
                                //遍历数据
                                for (let i = 0; i < content.length; i++) {
                                    kp_data.push(content[i].comment_info.content)
                                }
                                //添加到indexDB数据库里
                                storeDataInIndexedDB(kp_data);
                            },
                            error: function () {
                                $(".el-loading-mask").css('display', 'none')
                                alert("更新数据失败，找人帮忙吧！！！")
                            }
                        });
                    },
                    error: function () {
                        $(".el-loading-mask").css('display', 'none')
                        alert("更新数据失败，找人帮忙吧！！！")
                    }
                });
            }

        });

        //搜索indexedDB数据库
        $("#v-search").click(function () {
            // 声明全局变量 kp用来存储取出的数据
            var kp = [];
            //从indexedDB数据库里取出数据
            async function getDataFromIndexedDB() {
                return new Promise(async (resolve, reject) => {
                    try {
                        // 打开或创建一个 IndexedDB 数据库
                        const db = await new Promise((resolve, reject) => {
                            const request = indexedDB.open('kpDatabase', 1);

                            request.onsuccess = function (event) {
                                resolve(event.target.result);
                            };

                            request.onerror = function (event) {
                                reject(event.target.error);
                            };
                        });

                        // 获取事务
                        const transaction = db.transaction(['kpStore'], 'readonly');
                        const objectStore = transaction.objectStore('kpStore');

                        // 获取所有存储在对象存储中的数据
                        const getAllRequest = objectStore.getAll();

                        // 等待获取数据的 Promise 完成
                        const data = await new Promise((resolve, reject) => {
                            getAllRequest.onsuccess = function (event) {
                                resolve(event.target.result);
                            };

                            getAllRequest.onerror = function (event) {
                                reject(event.target.error);
                            };
                        });

                        // 存储在全局变量 kp 中
                        kp = data;

                        console.log('Data retrieved from IndexedDB:success！');
                        resolve(kp);
                    } catch (error) {
                        console.error('Error retrieving data from IndexedDB:', error);
                        reject(error);
                    }
                });
            }
            //取出数据后，处理、输出
            getDataFromIndexedDB().then(() => {
                //遍历kp数据，并存到kp_content里
                var kp_content = []
                for (let i = 0; i < kp.length; i++) {
                    kp_content.push(kp[i].content)
                }

                const sid = $("#title_id").val()

                if (sid == '') {
                    alert("你都没填标题，你认真的吗？OxO");
                    return false;
                }

                //寻找字符串索引号
                function find(str, cha, num) {
                    var x = str.indexOf(cha);
                    for (var i = 0; i < num; i++) {
                        x = str.indexOf(cha, x + 1);
                    }
                    return x;
                }

                let title, context = '';
                let in_l, in_r
                //遍历课程数据，查找内容
                $.each(kp_content, function (index, value) {
                    in_l = find(value, '课程', 0);
                    in_r = find(value, '课程', 1);
                    let emp = value.substring(in_l + 5, in_r - 1).trim();
                    emp = emp.replaceAll('：', '');
                    emp = emp.replaceAll(':', '');
                    title = emp.replace(/[\r\n]/g, "") + "\n";

                    if (title.indexOf(sid) != -1) {
                        context += value;
                    }
                });
                //
                Dialog("执行完毕，请复制内容", "<textarea style='border:none;width:100%;opacity:1' rows='10'>" + context + "</textarea>");
            });

        })

    }
    // 第二部分代码
    // 获取指定孩子上过的课程标题
    // 转为unicode 编码
    function encodeUnicode(str) {
        var res = [];
        for (var i = 0; i < str.length; i++) {
            res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
        }
        return "\\u" + res.join("\\u");
    }
    // 解码
    function decodeUnicode(str) {
        str = str.replace(/\\/g, "%");
        return unescape(str);
    }
    //
    //获取指定URL的参数值
    //@param url  指定的URL地址
    //@param name 参数名称
    //@return 参数值
    //
    function getUrlParam(name) {
        var url = window.location.href;
        var pattern = new RegExp("[?&]" + name + "=([^&]+)", "g");
        var matcher = pattern.exec(url);
        var items = null;
        if (null != matcher) {
            try {
                items = decodeURIComponent(decodeURIComponent(matcher[1]));
            } catch (e) {
                try {
                    items = decodeURIComponent(matcher[1]);
                } catch (e) {
                    items = matcher[1];
                }
            }
        }
        return items;
    }
    //点击事件
    function getlist() {
        //平台号
        var bid = 39606
        const button = '<button style="margin-left:10px" id="v-get" type="button" class="el-button el-button--default"><span>获取学生至今课程标题</span></button><input type="text" id="cos_id" autocomplete="off" placeholder="课程标题.." class="el-input__inner" style="width:100px;margin-left:10px"><button style="margin-left:10px" id="v-sou" type="button" class="el-button el-button--default"><span>搜索学生上过课评</span></button>';
        $("#main").before(button);
        let course_id, course_list, comment_list, choose_cid, in_l, in_r;

        $("#v-sou").on("click", function () {

            const sid = $("#cos_id").val();


            if (sid == '') {
                alert("你都没填标题，你认真的吗？OxO");
                return false;
            }

            const elm = 'body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item.selected.hover';
            // const course_id = $(elm)[0].innerText;
            if ($(elm).length != 0) {
                course_id = $(elm)[0].innerText;
            } else {
                console.log("请选择内容!");
            }

            // 获取课程列表
            $.ajaxSettings.async = false;  //同步
            $.post("https://jwb.sc-edu.com/api/course/list/", { branch_id: bid }, function (result) {
                course_list = JSON.parse(result).data.lists;
                //遍历课程数据
                $.each(course_list, function (index, value) {
                    if (course_id == value.title) {
                        choose_cid = value.course_id;
                        return true;
                    }
                });
            });

            //寻找字符串索引号
            function find(str, cha, num) {
                var x = str.indexOf(cha);
                for (var i = 0; i < num; i++) {
                    x = str.indexOf(cha, x + 1);
                }
                return x;
            }

            //取当前时间
            const date = new Date().toLocaleDateString().split("/").join("-");

            //请求参数
            const comment_param = { 'branch_id': bid, 'mem_id': getUrlParam("id"), 'course_id': choose_cid, 'page': 1, 'limit': 500, 'start': '2000-01-01', 'end': date, 'read_logo': 1 };

            //获取课评记录
            $.ajaxSettings.async = false;  //同步
            $.post("https://jwb.sc-edu.com/api/lesson/comment_list/", comment_param, function (result) {
                comment_list = JSON.parse(result).data.lists;
                let title, context = '';
                //遍历课程数据
                $.each(comment_list, function (index, value) {
                    const content = value.comment_info.content;
                    in_l = find(content, '课程', 0);
                    in_r = find(content, '课程', 1);
                    let emp = content.substring(in_l + 5, in_r - 1).trim();
                    emp = emp.replaceAll('：', '');
                    emp = emp.replaceAll(':', '');
                    title = emp.replace(/[\r\n]/g, "") + "\n";

                    if (title.indexOf(sid) != -1) {
                        context += content;
                    }

                });
                //
                Dialog("执行完毕，请复制内容", "<textarea style='border:none;width:100%;opacity:1' rows='10'>" + context + "</textarea>");
                //
            });
        })

        /////////////////////////////////////////////////

        $("#v-get").on("click", function () {
            if ($("#main > div.flex-part-space > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div").length) {

                const elm = 'body > div.el-select-dropdown.el-popper > div.el-scrollbar > div.el-select-dropdown__wrap.el-scrollbar__wrap > ul > li.el-select-dropdown__item.selected.hover';
                // const course_id = $(elm)[0].innerText;
                if ($(elm).length != 0) {
                    course_id = $(elm)[0].innerText;
                } else {
                    console.log("请选择内容!");
                }

                // 获取课程列表
                $.ajaxSettings.async = false;  //同步
                $.post("https://jwb.sc-edu.com/api/course/list/", { branch_id: bid }, function (result) {
                    course_list = JSON.parse(result).data.lists;
                    //遍历课程数据
                    $.each(course_list, function (index, value) {
                        if (course_id == value.title) {
                            choose_cid = value.course_id;
                            return true;
                        }
                    });
                });

                //寻找字符串索引号
                function find(str, cha, num) {
                    var x = str.indexOf(cha);
                    for (var i = 0; i < num; i++) {
                        x = str.indexOf(cha, x + 1);
                    }
                    return x;
                }

                //取当前时间
                const date = new Date().toLocaleDateString().split("/").join("-");

                //请求参数
                const comment_param = { 'branch_id': bid, 'mem_id': getUrlParam("id"), 'course_id': choose_cid, 'page': 1, 'limit': 500, 'start': '2000-01-01', 'end': date, 'read_logo': 1 };

                //获取课评记录
                $.ajaxSettings.async = false;  //同步
                $.post("https://jwb.sc-edu.com/api/lesson/comment_list/", comment_param, function (result) {
                    comment_list = JSON.parse(result).data.lists;
                    let title = '';
                    //遍历课程数据
                    $.each(comment_list, function (index, value) {
                        var course_date = value.dated
                        const content = value.comment_info.content;
                        in_l = find(content, '课程', 0);
                        in_r = find(content, '课程', 1);
                        let emp = content.substring(in_l + 5, in_r - 1).trim();
                        emp = emp.replaceAll('：', '');
                        emp = emp.replaceAll(':', '');
                        title += emp.replace(/[\r\n]/g, "") + "  时间：" + course_date + "\n";
                    });
                    //prompt("执行完毕，请复制内容",title);
                    Dialog("执行完毕，请复制内容", "<textarea style='border:none;width:100%;opacity:1' rows='10'>" + title + "</textarea>");
                });
            } else {
                alert('请在学生的课评记录页面点击此按钮！！！')
            }


        });

    }
    
    //数据统计功能开关按钮
    function open_btn() {
        //创建按钮
        var open_btn = '<button style="margin-left:10px" id="v-open" type="button" class="el-button el-button--default"><span>数据统计开启</span></button>';
        $('#main').before(open_btn);
        //创建定时器
        var timerInterval;
        // 开启定时器
        function startTimer() {
            timerInterval = setInterval(function () {
                // 检查是否到达指定页面
                if ($("#main > div.other-part > div:nth-child(2) > div:nth-child(1) > button.el-button.el-button--text").length) {
                    // 如果按钮未添加，则添加按钮
                    if (!$('#v-pfm').length) {
                        performance();
                    }
                } else {
                    console.log('DOM False');
                    // 如果按钮已经存在但不在目标位置，则移除按钮
                    $('#v-pfm').remove();
                }
            }, 1000);
        }
        // 关闭定时器
        function stopTimer() {
            clearInterval(timerInterval);
            console.log('功能已关闭');
            //功能关闭移除按钮
            $('#v-pfm').remove();
        }
        //按钮点击方法
        $("#v-open").click(function () {
            var buttonText = $(this).text();
            if (buttonText === '数据统计开启') {
                $(this).text('数据统计关闭');
                startTimer()
                console.log('功能已开启');
            } else {
                $(this).text('数据统计开启');
                stopTimer()
            }

        })
        //统计按钮方法
        function performance() {
            //日期，课程，标题，人数，成员
            let le_date, lesson, le_title, le_num;
            let le_members = '';
            //创建统计和查询按钮
            var pfm_btn = '<button type="button" id="v-pfm" class="el-button button-normal el-button--default"><span>统计</span></button>'
            $('#main > div.other-part > div:nth-child(2) > div:nth-child(1) > button.el-button.el-button--text').after(pfm_btn);
            $('#v-pfm').click(function () {
                //获取日期
                le_date = $("#main > div.info-part > div.info-part-bottom.flex-part-space > div:nth-child(1) > div:nth-child(1) > div > span:nth-child(2)").text().slice(0, 10)
                //获取课程
                lesson = $("#main > div.info-part > div.info-part-top.info-part-top-over > div.flex-part-space > div > span").text()
                //获取标题
                var title,in_l, in_r
                title = $("#main > div.other-part > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(4)").text() + $("#main > div.other-part > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(5)").text() + $("#main > div.other-part > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(3) > div:nth-child(1) > div:nth-child(6)").text()
                //寻找字符串索引号
                function find(str, cha, num) {
                    var x = str.indexOf(cha);
                    for (var i = 0; i < num; i++) {
                        x = str.indexOf(cha, x + 1);
                    }
                    return x;
                }
                //数据处理，只要课程标题
                in_l = find(title, '课程', 0);
                in_r = find(title, '课程', 1);
                let emp = title.substring(in_l + 5, in_r - 1).trim();
                emp = emp.replaceAll('：', '');
                emp = emp.replaceAll(':', '');

                le_title = emp.replace(/[\r\n]/g, "");
                //获取人数
                le_num = $("#main > div.other-part > div:nth-child(2) > div.flex-part.gap-top-20 > span > span:nth-child(3)").text()

                //获取成员
                var tr = $("tbody:eq(0) > tr")
                if (!le_members) {
                    for (let i = 0; i < tr.length; i++) {
                        if ($("tbody:eq(0) > tr:eq(" + i + ") > td > div > div > span > span").text() == '已到达') {
                            le_members += $("tbody:eq(0) > tr:eq(" + i + ") > td > div > div > span.label-btn").text().trim() + '，'
                        }
                    }
                }
                //console.log(le_date, lesson, le_title, le_num,le_members)
                Dialog('统计数据',"<textarea style='border:none;width:100%;opacity:1' rows='10'>" + le_date +"\n"+lesson+ "\n"+le_members+"\n"+le_title+ "\n"+le_num+"</textarea>");
            });
        }
    }
})();
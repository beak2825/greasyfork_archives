// ==UserScript==
// @name         bilibili优化
// @namespace    binger.cc
// @version      1.5
// @description  增加些快捷按键，优化个别视图，阻止按空格翻页。
// @author       Ervoconite
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/471112/bilibili%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/471112/bilibili%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


//==========================================: 设定
const autoWide = true; // 自动宽屏

const DEBUG = false; // debug 标志
// const DEBUG = true; // debug 标志

//==========================================: 不被Greakfork允许的外部插件
// #@require      https://cdn.jsdelivr.net/npm/toastify-js
/**
 * Minified by jsDelivr using Terser v5.14.1.
 * Original file: /npm/toastify-js@1.12.0/src/toastify.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
/*!
 * Toastify js 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */
!function (t, o) { "object" == typeof module && module.exports ? module.exports = o() : t.Toastify = o() }(this, (function (t) { var o = function (t) { return new o.lib.init(t) }; function i(t, o) { return o.offset[t] ? isNaN(o.offset[t]) ? o.offset[t] : o.offset[t] + "px" : "0px" } function s(t, o) { return !(!t || "string" != typeof o) && !!(t.className && t.className.trim().split(/\s+/gi).indexOf(o) > -1) } return o.defaults = { oldestFirst: !0, text: "Toastify is awesome!", node: void 0, duration: 3e3, selector: void 0, callback: function () { }, destination: void 0, newWindow: !1, close: !1, gravity: "toastify-top", positionLeft: !1, position: "", backgroundColor: "", avatar: "", className: "", stopOnFocus: !0, onClick: function () { }, offset: { x: 0, y: 0 }, escapeMarkup: !0, ariaLive: "polite", style: { background: "" } }, o.lib = o.prototype = { toastify: "1.12.0", constructor: o, init: function (t) { return t || (t = {}), this.options = {}, this.toastElement = null, this.options.text = t.text || o.defaults.text, this.options.node = t.node || o.defaults.node, this.options.duration = 0 === t.duration ? 0 : t.duration || o.defaults.duration, this.options.selector = t.selector || o.defaults.selector, this.options.callback = t.callback || o.defaults.callback, this.options.destination = t.destination || o.defaults.destination, this.options.newWindow = t.newWindow || o.defaults.newWindow, this.options.close = t.close || o.defaults.close, this.options.gravity = "bottom" === t.gravity ? "toastify-bottom" : o.defaults.gravity, this.options.positionLeft = t.positionLeft || o.defaults.positionLeft, this.options.position = t.position || o.defaults.position, this.options.backgroundColor = t.backgroundColor || o.defaults.backgroundColor, this.options.avatar = t.avatar || o.defaults.avatar, this.options.className = t.className || o.defaults.className, this.options.stopOnFocus = void 0 === t.stopOnFocus ? o.defaults.stopOnFocus : t.stopOnFocus, this.options.onClick = t.onClick || o.defaults.onClick, this.options.offset = t.offset || o.defaults.offset, this.options.escapeMarkup = void 0 !== t.escapeMarkup ? t.escapeMarkup : o.defaults.escapeMarkup, this.options.ariaLive = t.ariaLive || o.defaults.ariaLive, this.options.style = t.style || o.defaults.style, t.backgroundColor && (this.options.style.background = t.backgroundColor), this }, buildToast: function () { if (!this.options) throw "Toastify is not initialized"; var t = document.createElement("div"); for (var o in t.className = "toastify on " + this.options.className, this.options.position ? t.className += " toastify-" + this.options.position : !0 === this.options.positionLeft ? (t.className += " toastify-left", console.warn("Property `positionLeft` will be depreciated in further versions. Please use `position` instead.")) : t.className += " toastify-right", t.className += " " + this.options.gravity, this.options.backgroundColor && console.warn('DEPRECATION NOTICE: "backgroundColor" is being deprecated. Please use the "style.background" property.'), this.options.style) t.style[o] = this.options.style[o]; if (this.options.ariaLive && t.setAttribute("aria-live", this.options.ariaLive), this.options.node && this.options.node.nodeType === Node.ELEMENT_NODE) t.appendChild(this.options.node); else if (this.options.escapeMarkup ? t.innerText = this.options.text : t.innerHTML = this.options.text, "" !== this.options.avatar) { var s = document.createElement("img"); s.src = this.options.avatar, s.className = "toastify-avatar", "left" == this.options.position || !0 === this.options.positionLeft ? t.appendChild(s) : t.insertAdjacentElement("afterbegin", s) } if (!0 === this.options.close) { var e = document.createElement("button"); e.type = "button", e.setAttribute("aria-label", "Close"), e.className = "toast-close", e.innerHTML = "&#10006;", e.addEventListener("click", function (t) { t.stopPropagation(), this.removeElement(this.toastElement), window.clearTimeout(this.toastElement.timeOutValue) }.bind(this)); var n = window.innerWidth > 0 ? window.innerWidth : screen.width; ("left" == this.options.position || !0 === this.options.positionLeft) && n > 360 ? t.insertAdjacentElement("afterbegin", e) : t.appendChild(e) } if (this.options.stopOnFocus && this.options.duration > 0) { var a = this; t.addEventListener("mouseover", (function (o) { window.clearTimeout(t.timeOutValue) })), t.addEventListener("mouseleave", (function () { t.timeOutValue = window.setTimeout((function () { a.removeElement(t) }), a.options.duration) })) } if (void 0 !== this.options.destination && t.addEventListener("click", function (t) { t.stopPropagation(), !0 === this.options.newWindow ? window.open(this.options.destination, "_blank") : window.location = this.options.destination }.bind(this)), "function" == typeof this.options.onClick && void 0 === this.options.destination && t.addEventListener("click", function (t) { t.stopPropagation(), this.options.onClick() }.bind(this)), "object" == typeof this.options.offset) { var l = i("x", this.options), r = i("y", this.options), p = "left" == this.options.position ? l : "-" + l, d = "toastify-top" == this.options.gravity ? r : "-" + r; t.style.transform = "translate(" + p + "," + d + ")" } return t }, showToast: function () { var t; if (this.toastElement = this.buildToast(), !(t = "string" == typeof this.options.selector ? document.getElementById(this.options.selector) : this.options.selector instanceof HTMLElement || "undefined" != typeof ShadowRoot && this.options.selector instanceof ShadowRoot ? this.options.selector : document.body)) throw "Root element is not defined"; var i = o.defaults.oldestFirst ? t.firstChild : t.lastChild; return t.insertBefore(this.toastElement, i), o.reposition(), this.options.duration > 0 && (this.toastElement.timeOutValue = window.setTimeout(function () { this.removeElement(this.toastElement) }.bind(this), this.options.duration)), this }, hideToast: function () { this.toastElement.timeOutValue && clearTimeout(this.toastElement.timeOutValue), this.removeElement(this.toastElement) }, removeElement: function (t) { t.className = t.className.replace(" on", ""), window.setTimeout(function () { this.options.node && this.options.node.parentNode && this.options.node.parentNode.removeChild(this.options.node), t.parentNode && t.parentNode.removeChild(t), this.options.callback.call(t), o.reposition() }.bind(this), 400) } }, o.reposition = function () { for (var t, o = { top: 15, bottom: 15 }, i = { top: 15, bottom: 15 }, e = { top: 15, bottom: 15 }, n = document.getElementsByClassName("toastify"), a = 0; a < n.length; a++) { t = !0 === s(n[a], "toastify-top") ? "toastify-top" : "toastify-bottom"; var l = n[a].offsetHeight; t = t.substr(9, t.length - 1); (window.innerWidth > 0 ? window.innerWidth : screen.width) <= 360 ? (n[a].style[t] = e[t] + "px", e[t] += l + 15) : !0 === s(n[a], "toastify-left") ? (n[a].style[t] = o[t] + "px", o[t] += l + 15) : (n[a].style[t] = i[t] + "px", i[t] += l + 15) } return this }, o.lib.init.prototype = o.lib, o }));
//# sourceMappingURL=/sm/e1ebbfe1bf0b0061f0726ebc83434e1c2f8308e6354c415fd05ecccdaad47617.map

//==========================================: 预设数据
const d = document;
const _Log = console.log;
const querySelector = (sel) => { return d.querySelector(sel) }
const getActElm = () => { return document.activeElement.nodeName }

// 设定选择器：
const player = '#bilibili-player',
    sel_ctrl = `${player} .bpx-player-control-wrap`,
    sel_Rate = `${sel_ctrl} .bpx-player-ctrl-playbackrate > ul`,
    sel_Webv = `${sel_ctrl} .bpx-player-ctrl-web`,
    sel_Wide = `${sel_ctrl} .bpx-player-ctrl-wide`,
    sel_tooltip = `${player} .bpx-player-tooltip-area`
    ;
const cls_playBtn = ".bpx-player-ctrl-play", // 播放暂停按钮
    cls_videoEl = ".bpx-player-container", // 这是播放器容器
    cls_pauseSign = "bpx-state-paused" // 这是暂停标志
    ;


/*!  只做了一点删减。
 * Toastify css 1.12.0
 * https://github.com/apvarun/toastify-js
 * @license MIT licensed
 *
 * Copyright (C) 2018 Varun A P
 */
GM_addStyle(`.toastify{color:#fff;display:inline-block;
position:fixed;opacity:0;cursor:pointer;text-decoration:none;
max-width:calc(50% - 20px);z-index:2147483647}
.toastify.on{opacity:1}
.toast-close{background:0 0;border:0;color:#fff;cursor:pointer;
font-family:inherit;font-size:1em;opacity:.4;padding:0 5px}
.toastify-right{right:15px}
.toastify-left{left:15px}
.toastify-top{top:-150px}
.toastify-bottom{bottom:-150px}
.toastify-rounded{border-radius:25px}
.toastify-avatar{width:1.5em;height:1.5em;margin:-7px 5px;
border-radius:2px}
.toastify-center{margin-left:auto;margin-right:auto;left:0;
right:0;max-width:fit-content;max-width:-moz-fit-content}
@media only screen and (max-width:360px){
.toastify-left,.toastify-right{margin-left:auto;margin-right:auto;
left:0;right:0;max-width:fit-content}}
`);

// 个性化样式
GM_addStyle(`

    .toast-info {
        font-size: small;
        font-family: SongTi;
        padding: 8px 10px !important;
        border-radius: 5em !important;
        box-shadow: -2px 4px 6px 1px #00000073 !important;
        transition: all .2s cubic-bezier(.215, .61, .355, 1) !important;
        background: linear-gradient(90deg, #6190E8 0%, #A7BFE8 100%) !important;
    }
    .toast-guide {
        color: black !important;
        font-size: medium;
        font-weight: bold;
        padding: 12px 20px !important;
        background: linear-gradient(270deg, #f4c4f3 0%, #fc67fa 100%) !important;
    }
    .toast-close {
        color: black !important;
    }

`); // Toast class

function _infoToast(msg, duration) {
    Toastify({
        text: msg,
        duration: duration,
        className: "toast-info",
        close: true, gravity: "top", position: "right",
        stopOnFocus: true, oldestFirst: true,
        offset: { x: 10, y: 60 }
    }).showToast();
}

function _guideToast(text, duration, close, callback) {
    let tst = Toastify({
        text,
        duration,
        className: "toast-info toast-guide",
        close, gravity: "top", position: "right",
        stopOnFocus: true, oldestFirst: true,
        offset: { x: 10, y: 60 },
        onClick
    });
    function onClick() {
        if (callback) callback();
        tst.hideToast();
    }
    tst.showToast();
}

function runToast(msg) {
    _infoToast(msg, 1500)
}

function tipToast(msg) {
    _infoToast(msg, 3000)
}

function pinToast(msg) {
    _infoToast(msg, -1)
}

function firstSettingToast() {
    _guideToast('First 点击此处', -1, false,
        function () { console.log('First setting') }
    )
}


//==========================================
//==========================================
//==========================================
//==========================================: Script执行
(function () {
    'use strict';

    // let styleSheets = ['toastifyCSS']
    // styleSheets.forEach(url => {
    //     GM_addStyle(GM_getResourceText(url))
    // })

    if (location.href.match(/space.bilibili.com/) &&
        location.pathname.endsWith("favlist")) {
        _Log('Favlist modifing');
        do_view_adjusting();
    }

    else if (location.href.match(/bilibili.com\/video|list\/watchlater/)) {
        _Log('Player modifing');
        do_keybindings();
    }

    if (DEBUG) window.addEventListener('keydown', (event) => {
        if (event.key === '/') eval(prompt("Run script:"));
        if (event.key === 'F2') {
            firstSettingToast()
            pinToast('好好好这么玩是吧')
        }
    })
})();


//==========================================
//==========================================
//==========================================
//==========================================: Script主体


/**
 *
 *  @description 个人空间——⭐收藏：视图调整
 *
 */
function do_view_adjusting() {
    GM_addStyle(`
#page-fav .fav-main{width:800px!important}
#page-fav .fav-main .small-item{width:170px!important}
#page-fav .fav-main .small-item:nth-child(5n){margin-right:inherit!important}
#page-fav .fav-main .fav-action-bottom .fav-action-fixtop{width:800px!important;}

#page-fav .fav-sidenav{width:300px!important}
#page-fav .fav-sidenav .text{line-height:33px!important;width:180px!important}
#page-fav .fav-sidenav .fav-list-container{max-height:none!important}

@media (min-width:1420px){
  #page-fav .fav-main{width:980px}
}

/* #page-fav .fav-list>li:nth-child(odd){background:whitesmoke!important;} */
#page-fav .fav-sidenav > div:nth-child(2){background:aliceblue!important;}
#page-fav .modal-wrapper .target-favlist{max-height:80vh!important;}
#page-fav .modal-wrapper .target-favitem{height:unset!important;margin:.5em!important;}
#page-fav .modal-wrapper .fav-meta{display:flex!important;}
#page-fav .modal-wrapper .fav-meta .fav-state{margin-left:20px!important;}

`)
    setTimeout(() => {
        querySelector("#page-fav div.fav-sidenav > " +
            "div:nth-child(2) > div.favlist-title").click();
    }, 1000);
}

/**
 *
 * @description 视频播放器：加快捷键
 *
 */
function do_keybindings() {
    if (DEBUG) console.clear(); // 开发行为

    // 阻止空格滚屏：
    d.body.addEventListener('keydown', (e) => {
        if (e.key === ' ') e.preventDefault();
    });

    //
    //######################################### 监视加载
    //#########################################
    //

    // 加载好了，开始正事。
    function doModify(obs) {
        if (doModify.done) return;
        if (querySelector(sel_Wide)) {
            if (DEBUG && !querySelector(cls_videoEl).classList
                .contains(cls_pauseSign)) {
                // 开发行为 // 没有暂停就让他暂停
                querySelector(cls_playBtn).click(); _Log("Debug: pause")
            }

            obs.disconnect();
            clearInterval(Tick);
            doModify.done = true;

            // 修改播放器
            modifyPlayer();
            _Log('%c终于加载好了~', "color:lime"); tipToast("按键设定完毕~");

            // 启动提示监视器
            RenamerObs.observe(
                querySelector(sel_tooltip),
                { childList: true }
            );
        }
    }
    doModify.done = false;

    // 定义加载行为监视器
    let LoadObs = new MutationObserver((list, obs) => {
        // _Log("is same", mobs == muobs, mobs, muobs); // True
        doModify(LoadObs);
    });
    // 开始监视加载行为
    LoadObs.observe(d.body, { childList: true });
    // 应对‘稍后再看’这种无行为的页面
    let Tick = setInterval(() => { doModify(LoadObs) }, 1000);

    //
    //######################################### 干正事
    //#########################################
    //

    let lastWideT = '宽屏模式', lastWebvT = '网页全屏';
    // obs: 给 宽屏 和 页面全屏 按钮 加提示
    const RenamerObs = new MutationObserver((mlist) => {
        if (mlist.length && mlist[0].type == 'childList') {

            // _Log(mlist);
            // mlist.forEach((e) => {
            //     if (e.addedNodes.length > 0) { e.addedNodes.forEach((i) => {
            //             _Log('Add ', i.lastChild.textContent) })}
            //     if (e.removedNodes.length > 0) { e.removedNodes.forEach((i) => {
            //             _Log('\tRemove ', i.lastChild.textContent) })}
            // });

            let wideTip = null;
            let webvTip = null;
            let wide_texts = ['宽屏模式', '退出宽屏'];
            let webv_texts = ['网页全屏', '退出网页全屏'];
            if (mlist[0].addedNodes.length > 0) {
                wideTip = mlist.find(node => {
                    return wide_texts.includes(node.addedNodes[0].lastChild.textContent)
                }).addedNodes[0].lastChild;
                webvTip = mlist.find(node => {
                    return webv_texts.includes(node.addedNodes[0].lastChild.textContent)
                }).addedNodes[0].lastChild;
                // _Log(wideTip, webvTip);
                if (lastWideT != wideTip.textContent) {
                    lastWideT = wideTip.textContent;
                }
                if (lastWebvT != webvTip.textContent) {
                    lastWebvT = webvTip.textContent;
                }
                wideTip.textContent += ' (h)';
                webvTip.textContent += ' (g)';
            }
        }
    })

    // 修改播放器的函数
    function modifyPlayer() {
        const btnWebv = querySelector(sel_Webv),
            btnWide = querySelector(sel_Wide),
            btnRate = querySelector(sel_Rate),
            btnRates = Array.from(btnRate.children);
        const rateK2R = new Map([
            ['1', '1'],
            ['2', '1.25'],
            ['3', '1.5'],
            ['4', '2'],
            ['5', '0.5'],
            ['6', '0.75']
        ]), rateR2K = new Map();
        rateK2R.forEach((r, k) => { rateR2K.set(r, k) });
        const rate = (k) => {
            let btn = btnRates.find(e => {
                return e.dataset.value == rateK2R.get(k)
            })
            if (btn) { btn.click(); runToast(btn.dataset.value + ' 倍速~') }
        }
        window.addEventListener('keyup', (e) => {
            if (['TEXTAREA', 'INPUT'].indexOf(getActElm()) > -1) return; // 输入时不反应。
            var k = e.key;
            if (isNaN(k) || !k.trim().length) switch (k) {
                case 'h': btnWide.click(); runToast(lastWideT); break;
                case 'g': btnWebv.click(); runToast(lastWebvT); break;
                default:
            } else {
                rate(k)
            }
        });
        // 给倍速备注按键
        btnRate.style.cssText = 'text-align:end;width:100px;padding-right:8px;';
        btnRates.map(e => { e.innerHTML += `（按${rateR2K.get(e.dataset.value)}）` })
        if (autoWide) btnWide.click();
    }
}

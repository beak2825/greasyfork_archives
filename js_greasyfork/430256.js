// ==UserScript==
// @name         bilibili快捷键(如倍速)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  bilibili快捷键的小插件
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @include        /^https:\/\/www\.bilibili\.com\/(bangumi\/play\/|video\/)/
// @author       ZLH
//@grant none
// @downloadURL https://update.greasyfork.org/scripts/430256/bilibili%E5%BF%AB%E6%8D%B7%E9%94%AE%28%E5%A6%82%E5%80%8D%E9%80%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430256/bilibili%E5%BF%AB%E6%8D%B7%E9%94%AE%28%E5%A6%82%E5%80%8D%E9%80%9F%29.meta.js
// ==/UserScript==
// @require https://raw.githubusercontent.com/zlhlove/zlh/master/kjj.js
class shotcut {
    #fu = e => {
        this.#wblist.some((k, i) => k[1] == e.keyCode) && e.preventDefault()//阻止执行
        if (e.ctrlKey && e.keyCode in this.#sp && !(this.#sp[e.keyCode](e)))//快进快退需要调用特殊函数
            return
        this.#wblist.forEach((s, i) => {
            var d = ($(s[0]).next().length ? $(s[0]).next() : $(s[0]).parent().children().first())
            var u = ($(s[0]).prev().length ? $(s[0]).prev() : $(s[0]).parent().children().last())
            if (!this.#excu.includes(s[1]))
                u = $(s[0])
            else if (e.altKey && e.keyCode == s[1])
                d.trigger("click")
            e.ctrlKey && e.keyCode == s[1] && u.trigger("click")
            console.log(123)
        })
    }
    #wblist
    #sp
    #excu = [86, 66] //轮换设置名单
    constructor(wbl, ex, ss) {
        if (wbl != undefined && Array.isArray(wbl))
            this.#wblist = wbl
        if (ex != undefined && Array.isArray(ex))
            this.#excu = ex
        if (ss != undefined && typeof ss == 'object')
            this.#sp = ss
    }
    st() {
        $(document).on("keydown", this.#fu)
    }
    cl() {
        $(document).off("keydown", this.#fu)
    }
    //....待完善
}
//配置
const funs = {
    qui: e => {
        let jks = 0;
        let as = setInterval(() => (jks >= 18 && clearInterval(as)) || (jks++, $(window).trigger($.Event("keydown", { keyCode: e.keyCode }))), 10)
    },
    quk: e => {
        $("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.squirtle-controller.squirtle-pgc.squirtle-wide-screen > div.squirtle-progress-wrap.squirtle-progress-common.ease").show()
        var bur = $("div.squirtle-progress-wrap.squirtle-progress-common")[0]
        var cha = bur.getBoundingClientRect().right - bur.getBoundingClientRect().left
        var lin = parseFloat($(".squirtle-progress-timeline").css("transform").match(/0\.\d+/)[0]) * cha + (e.keyCode - 38) * 100 + bur.getBoundingClientRect().left
        lin < bur.getBoundingClientRect().right && lin > bur.getBoundingClientRect().left &&
            $(bur).trigger($.Event("click", { "clientX": lin, "currentTarget": bur }))
         $("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.squirtle-controller.squirtle-pgc.squirtle-wide-screen > div.squirtle-progress-wrap.squirtle-progress-common.ease").hide()
    }
}
const scconfig = {
    vecf: {
        wbl: [
            [".bui-switch-input", 81],//弹幕开关
            [".bilibili-player-iconfont-fullscreen-off", 90],//全屏
            [".bilibili-player-video-btn-speed-menu-list.bilibili-player-active", 66],//倍速
            [".bui-select-quality-menu .bui-select-item.bui-select-item-active", 86],//清晰度
            [".bilibili-player-video-web-fullscreen", 88],//网页全屏
            [".bilibili-player-video-btn-widescreen", 32],//网页宽屏
            ["", 37],//快进
            ["", 39],//快退
        ],//常规设置

        ssq: { 37: funs.qui, 39: funs.qui }
    },
    gmcf: {
        wbl: [
            [".bui-switch-input", 81],//弹幕开关
            ["#图层_1", 90],//全屏
            [".squirtle-select-item.active:last", 66],//倍速
            [".squirtle-select-item.active:first", 86],//清晰度
            [".squirtle-pagefullscreen-inactive", 88],//网页全屏
            [".squirtle-widescreen-inactive", 32],//网页宽屏
            ["", 37],//快进
            ["", 39],//快退
        ],//常规设置
        ssq: { 37: funs.quk, 39: funs.quk }
    }
}
const UrlArray = [
    [/^https:\/\/www\.bilibili\.com\/video\/.*/, new shotcut(scconfig.vecf.wbl, undefined, scconfig.vecf.ssq)],
    [/^https:\/\/www\.bilibili\.com\/bangumi\/.*/, new shotcut(scconfig.gmcf.wbl, undefined, scconfig.gmcf.ssq)],
]
class start {
    #url = window.location.href
    #lis = null
    constructor(li) {
        if (Array.isArray(li) &&
            li.every((v, i) => Array.isArray(v) &&
                Object.prototype.toString.call(v[0]) === "[object RegExp]"
            )) this.#lis = li
    }
    be() {
        let EffectiveWebsite = this.#lis.find(v => v[0].test(this.#url))
        EffectiveWebsite != undefined && EffectiveWebsite[1].st()
    }
}
;(new start(UrlArray)).be()
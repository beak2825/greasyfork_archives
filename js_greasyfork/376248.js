// ==UserScript==
// @name         ↑→↓←ABAB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  I am not going to take over the world...
// @author       You
// @match        https://bilibili.com/video/*
// @match        https://bilibili.com/bangumi/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function() {
    function bootScript() {
        isNaN(+$('.bilibili-player-danmaku-now').text())? getBootOption().then(hookData) : requestAnimationFrame(bootScript)
    }
    bootScript()

    function getBootOption() {
        return new Promise(function(resolve, reject) {
            let hash = {}
            let params = GrayManager.playerParams.split('&')
            params.map(p=>hash[p.split('=')[0]] = p.split('=')[1])
            window.BOOT_OPTION = hash
            resolve()
        })
    }

    function hookData() {
        let cheatSheet = [
            {a: '$.extend(this,{', b: '$.extend(this,{f,'},
            {a: `{he:24,time:2E3,
Ne:b,background:"#000",vi:.7,Qh:!0,Dk:400,Ck:300,quality:80}`,
             b: `{he:24,time:b.time,
Ne:b.isStatic,background: b.background,vi:b.hi,Qh:!0,Dk:b.width,Ck:b.height,quality:b.quality}`}
        ]

        let FnRaw = Fa.toString()
        cheatSheet.map(ct => FnRaw = FnRaw.replace(ct.a, ct.b))
        !eval(`var Fa = ${FnRaw}`) && Fa()

        player = new bilibiliPlayer(window.BOOT_OPTION)
        window.HOOKED_DATA = player.f
    }
})();
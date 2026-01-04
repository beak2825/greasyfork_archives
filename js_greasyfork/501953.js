// ==UserScript==
// @name         wkgo download seeds
// @namespace    websiteEnhancement
// @author   You
// @version      2025.12.3
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        *tianmao123.xyz*
// @include        *meituan123.xyz*
// @include        *wk2024.xyz*
// @include        *happy2025.xyz*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @run-at document-body //document-body //idle
// @downloadURL https://update.greasyfork.org/scripts/501953/wkgo%20download%20seeds.user.js
// @updateURL https://update.greasyfork.org/scripts/501953/wkgo%20download%20seeds.meta.js
// ==/UserScript==
;
(async function (loadJQuery) {
    Array.prototype.push = function (...items) {
        let len = this.length >>> 0;
        let argCount = items.length >>> 0;
        if (len + argCount > 2 ** 53 - 1) {
            throw new TypeError("Invalid array length");
        }
        for (let i = 0; i < argCount; i++) {
            this[len + i] = items[i];
        }
        this.length = len + argCount;
        return this.length;
    };
    loadJQuery(window).then(([$, win]) => {
        $.ajaxSetup({
            cache:true
        });
        ["https://cdn.jsdelivr.net/npm/jquery-lazyload@1.9.7/jquery.lazyload.min.js",
         "https://cdn.jsdelivr.net/gh/sodiray/radash@master/cdn/radash.min.js",
         // "https://update.greasyfork.org/scripts/483173/1301961/GM_config_cnjames.js",
         // "https://raw.githubusercontent.com/sizzlemctwizzle/GM_config/refs/heads/master/gm_config.js",
         "https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@master/gm_config.js",
         "https://update.sleazyfork.org/scripts/476583/common_libs_of_array.js",
         // "https://update.sleazyfork.org/scripts/513894/1470715/remove%20ads%20lib.js",
         // "https://update.sleazyfork.org/scripts/513894/1627441/remove%20ads%20lib.js",
         // "https://update.sleazyfork.org/scripts/513894/1627444/remove%20ads%20lib.js", //with version
         "https://update.sleazyfork.org/scripts/513894/remove%20ads%20lib.js" //no version
        ].reduce((p, url) => p.then(() => new Promise((resolve, reject) => $.getScript(url).done(() => resolve()).fail((er) =>{console.log(er)}))), Promise.resolve())
            .then(v=>remove_adds($, window))
            .then(v => {


            win.funcDownload = function () {
                let hasDownload=false;
                let _all_torrents=$("a[href*='torrent']:not([href*='mailto']),a:contains(torrent):not([href*='mailto'])")
                let n =_all_torrents.length-1

                _all_torrents.each((i, element) => {
                    hasDownload=true;
                    submit(function (next) {
                        try {
                            let url = $(element).attr('href');
                            console.log("download file name:", $(element).text())
                            let newwin =win.open(url, "_blank")

                            }
                        finally {
                            if(i<n)
                                win.setTimeout(function () { next() }, gmc.get('holdOn') ?? 1000)
                            else
                                next()
                        }
                    }, $)
                });
                // $("a:contains(torrent):not([href*='mailto'])").each((i, element) => {
                //     hasDownload=true;
                //     submit(function (next) {
                //         try {
                //             let url = $(element).attr('href');
                //             console.log("download file name:", $(element).text())
                //             win.open(url, "_blank")
                //         }
                //         finally {
                //             setTimeout(function () { next() }, gmc.get('holdOn') ?? 1000)
                //         }
                //     }, $)
                // });
                if(hasDownload){
                    submit(function (next) {
                        if (localStorage.getItem("autoclosewindow") == 'Auto') {
                            win.clearTimeout(win.closeTimer)
                            win.closeTimer = setTimeout(function () {
                                console.log('closing')
                                win.open("about:blank", "_self").close()
                            }, 100)
                        }
                        next()
                    }, $)
                }
                else
                    console.log("not found any file to download.")
            }
            win.funcList = function () { }
            win.funcDetail = function () { }
            const reg = /(\d{6,})/
            win.__compareKey = function (cache, curr) {
                // return false
                if (cache === curr)
                    return true
                ///thread-6638382-
                let result = reg.exec(cache)
                if (result && result.length > 1)
                    return result[1] === curr
                return false
            }
            win.fixValue = function (value) {
                let result = reg.exec(value)
                if (result && result.length > 1)
                    return result[1]
                return value
            }
            $('table a').removeAttr('style')
            $(".wp").css({width:'90%'})
            win.actionOpened=function(el){
                el.closest('tr,tbody,.item').hide()
                // el.closest('tbody').hide()
                // el.closest('.item').hide()
                // el.closest('tbody').hide()
                console.log('log')
            }
            $(document).ready(function(){
                remove_adds($, window)
                autoFind(() => /[wk2024|happy2025.xyz]\/forum[-\d]*.html/.test(win.location.href) || /[wk2024|happy2025.xyz]\/forum.php\?mod=forumdisplay/.test(win.location.href), 'wk2024', 'a.s.xst', el => el.text(), $, {}, win, funcDownload, funcList, funcDetail);
            })

        })
    })

})(function (unsafeWindow) {
    return new Promise((resolve, reject) => {

        if (typeof jQuery == "undefined" || typeof jQuery.fn =="undefined" ||typeof jQuery.fn.lazyload=="undefined") {
            let script = document.createElement("script")
            script.type = "text/javascript"
            script.src = "https://code.jquery.com/jquery-3.7.1.min.js"
            script.onerror = function () {
                reject(new Error("Failed to load jQuery"))
            }
            script.addEventListener("load", function () {
                jQuery.noConflict()

                resolve([jQuery, unsafeWindow??window])
            })

            document.head.appendChild(script)
        }
        else {
            setTimeout(function () {

                resolve([jQuery, unsafeWindow??window])
            }, 30)
        }
    })
});

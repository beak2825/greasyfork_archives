// ==UserScript==
// @name         4096
// @namespace    websiteEnhancement
// @author   You
// @version      2025.5.265
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        *112200ccq.xyz*
// @include        *40dz1.site*
// @include        *xx.xyz*
// @include        *xx.xyz*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/537144/4096.user.js
// @updateURL https://update.greasyfork.org/scripts/537144/4096.meta.js
// ==/UserScript==
;
(async function (loadJQuery) {
    // Array.prototype.push = function (...items) {
    //     let len = this.length >>> 0;
    //     let argCount = items.length >>> 0;
    //     if (len + argCount > 2 ** 53 - 1) {
    //         throw new TypeError("Invalid array length");
    //     }
    //     for (let i = 0; i < argCount; i++) {
    //         this[len + i] = items[i];
    //     }
    //     this.length = len + argCount;
    //     return this.length;
    // };
    loadJQuery(window).then(([$, win]) => {
        $.ajaxSetup({
            cache:true
        });
        ["https://cdn.jsdelivr.net/gh/sodiray/radash@master/cdn/radash.min.js",
         "https://update.greasyfork.org/scripts/483173/1301961/GM_config_cnjames.js",
         "https://update.sleazyfork.org/scripts/476583/common_libs_of_array.js",
         "https://update.sleazyfork.org/scripts/513894/1470715/remove%20ads%20lib.js"
        ].reduce((p, url) => p.then(() => new Promise((resolve, reject) => $.getScript(url).done(() => resolve()).fail(() => reject()))), Promise.resolve())
            .then(v => {
            remove_adds($, window)

            win.funcDownload = function () {
                let hasDownload=false;
                $("a[href*='torrent']:not([href*='mailto'])").each((i, element) => {
                    hasDownload=true;
                    submit(function (next) {
                        try {
                            let url = $(element).attr('href');
                            console.log("download file name:", $(element).text())
                            win.open(url, "_blank")
                        }
                        finally {
                            setTimeout(function () { next() }, win.gmc.holdOn ?? 1000)
                        }
                    }, $)
                });
                $("a:contains(torrent):not([href*='mailto'])").each((i, element) => {
                    hasDownload=true;
                    submit(function (next) {
                        try {
                            let url = $(element).attr('href');
                            console.log("download file name:", $(element).text())
                            win.open(url, "_blank")
                        }
                        finally {
                            setTimeout(function () { next() }, win.gmc.holdOn ?? 1000)
                        }
                    }, $)
                });
                if(hasDownload)
                    submit(function (next) {
                        if (localStorage.getItem("autoclosewindow") == 'Auto') {
                            win.clearTimeout(win.closeTimer)
                            win.closeTimer = setTimeout(function () {
                                win.open("about:blank", "_self").close()
                            }, 100)
                        }
                        next()
                    }, $)
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

            autoFind(() => /.*forum[-\d]*.html|.*mod=forumdisplay.*/.test(win.location.href), 'wk2024', 'a.s.xst', el => el.text(), $, {}, win, funcDownload, funcList, funcDetail);

        })
    })

})(function (unsafeWindow) {
    return new Promise((resolve, reject) => {
        let dollar
        if (typeof $ != "undefined")
            dollar = $
        if (typeof jQuery == "undefined") {
            let script = document.createElement("script")
            script.type = "text/javascript"
            script.src = "https://code.jquery.com/jquery-3.7.1.min.js"
            script.onerror = function () {
                reject(new Error("Failed to load jQuery"))
            }
            script.addEventListener("load", function () {
                jQuery.noConflict()
                if (dollar) $ = dollar;

                resolve([jQuery, window ?? unsafeWindow])
            })

            document.head.appendChild(script)
        }
        else {
            setTimeout(function () {
                // Firefox supports
                if (dollar) $ = dollar;

                resolve([jQuery, window ?? unsafeWindow])
            }, 30)
        }
    })
});

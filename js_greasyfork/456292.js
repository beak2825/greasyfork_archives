// ==UserScript==
// @name         SIS download seeds
// @namespace    websiteEnhancement
// @author   jimmly
// @version      2025.5.9
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        *sis001*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456292/SIS%20download%20seeds.user.js
// @updateURL https://update.greasyfork.org/scripts/456292/SIS%20download%20seeds.meta.js
// ==/UserScript==

(async function (loadJQuery) {
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
            $('table a').removeAttr('style')

            win.funcDownload = function () {
                let url = $(".t_attachlist > dt > a:eq(1)").prop('href');
                let filename = $("div.mainbox.viewthread>h1").text().trim() + '.torrent';
                console.log(filename)
                $.ajax({
                    url,
                    success: function (result, status, xhr) {
                        createSuperLabel(
                            $(result).find("#downloadBtn").prop('href'),
                            $(result).find("#downloadBtn").prop('href'),
                            filename)
                        // let alink = document.createElement('a');
                        // alink.download = filename;
                        // alink.href = $(result).find("#downloadBtn").prop('href');
                        // document.body.appendChild(alink);
                        // alink.click();
                        submit(function (next) {
                            if (localStorage.getItem("autoclosewindow") == 'Auto') {
                                win.clearTimeout(win.closeTimer)
                                win.closeTimer = setTimeout(function () {
                                    win.open("about:blank", "_self").close()
                                }, 100)
                            }
                            next()
                        }, $)
                    },
                    error: function (xhr, status, error) {
                        console.log(status, error)
                    }
                });
            }
            win.funcList = function (container) { }
            win.funcDetail = function (container) { }
            const reg = /.*(\d{8}).*/

            win.__compareKey = function (cache, curr) {
                if (cache === curr)
                    return true
                ///thread-6638382-
                if (reg.test(cache))
                    return cache.replace(reg, "$1") === curr
                return false
            }
            win.fixValue = function (value) {
                if (reg.test(value))
                    return value.replace(reg, "$1")
                return value
            }


            autoFind(() => win.location.href.indexOf('thread') == -1, 'sis', 'span>a', el => el.text(), $, {}, win, funcDownload, funcList, funcDetail);


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

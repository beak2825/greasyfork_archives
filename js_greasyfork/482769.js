// ==UserScript==
// @name         sexinsex download seeds
// @namespace    websiteEnhancement
// @author   jimmly
// @version      2025.5.9
// @description  增加页面顶部底部按钮和一键下种按钮
// @create         2023-9-21
// @include        http://sexinsex.net/bbs/*
// @include        *sexinsex*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM.getValue
// @grant         GM.setValue
// @license MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/482769/sexinsex%20download%20seeds.user.js
// @updateURL https://update.greasyfork.org/scripts/482769/sexinsex%20download%20seeds.meta.js
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
    loadJQuery(window).then(([$,win])=>{
          $.ajaxSetup({
            cache:true
        });
        ["https://cdn.jsdelivr.net/gh/sodiray/radash@master/cdn/radash.min.js",
         "https://update.greasyfork.org/scripts/483173/1301961/GM_config_cnjames.js",
         "https://update.sleazyfork.org/scripts/476583/common_libs_of_array.js",
         "https://update.sleazyfork.org/scripts/513894/1470715/remove%20ads%20lib.js"
        ].reduce((p, url) => p.then(() => new Promise((resolve, reject) => $.getScript(url).done(() => resolve()).fail(() => reject()))), Promise.resolve())

            .then(v => {
            $('table a').removeAttr('style')

            let w = 40, h = 40;
            addStyle(`
                    a:link{color:green;}
                    a:hover{color:red;}
                    a:active{color:yellow;}
                    a:visited{color:orange;}
                    .btn1   {
                        opacity:0.8;-moz-transition-duration:0.2s;-webkit-transition-duration:0.2s;
                        padding:1px; margin-top:1px;
                        font-size: 10; text-align: center; vertical-align: middle; line-height:${h}px;
                        border-radius:5px 5px 5px 5px;cursor:pointer; left:0px;z-index:9999;
                        background:white;
                        width:${w}px;height:${h}px;
                    }
                `);


            win.funcDownload=function () {
                $("dl.t_attachlist>dt>a").each((i, element) => {
                    let url = $(element).prop('href');
                    let filename = $(element).text().trim();
                    if (filename.indexOf('torrent') == -1)
                        return true;
                    console.log("download file name:", filename)
                    createSuperLabel(url, url, filename, window)
                });

            }
            const reg = /(\d{7,})/
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
            autoFind(() => win.location.href.indexOf('thread') == -1, 'sis', 'span>a', el => el.text(), $,{}, win, funcDownload, undefined, undefined);
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

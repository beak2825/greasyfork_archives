// ==UserScript==
// @name         Cityquiz 汉化
// @namespace    https://cityquiz.io/
// @version      1.0-rc1
// @description  Cityquiz 汉化插件，使用中文完成一切！
// @author       songhongyi
// @match        https://cityquiz.io/quizzes/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cityquiz.io
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468198/Cityquiz%20%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/468198/Cityquiz%20%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function isChinese(str) {
        var pattern = /[\u4e00-\u9fa5]/; // Unicode 范围，包含中文字符
        return pattern.test(decodeURI(str));
    }
    const console = unsafeWindow.console;
    unsafeWindow.au_fetch = unsafeWindow.fetch;
    unsafeWindow.fetch = function (a, b) {
        // console.log(a, b);
        if (a.startsWith("/api/cities/search?quiz=")) {
            let query = a.split("query=")[1].split("&")[0];
            // console.warn(query);
            if (isChinese(query)) {
                return unsafeWindow.au_fetch("https://geoname.rotriw.com/api/query?q=" + query).then(res => res.json()).then(function (res) {
                    if (res.status !== 'success' || res.res.length === 0) {
                        return unsafeWindow.au_fetch(a, b);
                    }
                    else {
                        let new_a = a.split("query=")[0] + "query=" + res.res[0] + "&" + a.split("query=")[1].split("&")[1];
                        // console.warn(new_a);
                        return unsafeWindow.au_fetch(new_a, b);
                    }
                });

            }
            else{
                return unsafeWindow.au_fetch(a, b);
            }
        }
        else {
            return unsafeWindow.au_fetch(a, b);
        }
    };
})();
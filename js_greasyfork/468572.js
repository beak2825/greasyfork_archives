// ==UserScript==
// @name         小红书信息整理
// @namespace    https://www.xiaohongshu.com/
// @version      0.1
// @description  根据id获取小红书博主信息
// @author       You
// @match        http*://*.xiaohongshu.com/user/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        GM_download
// @run-at       document-start
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/468572/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%BF%A1%E6%81%AF%E6%95%B4%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/468572/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E4%BF%A1%E6%81%AF%E6%95%B4%E7%90%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TText = 0, TURL = 1;
    const uid = /profile\/([a-z0-9]+)/.exec(document.URL)[1];
    let data_fields = [
        {
            "name": "name_",
            "css_selector": ".user-name",
            "fetch_method": doms => doms[0].innerText,
            "type": TText,
        },
        {
            "name": "desc",
            "css_selector": ".user-desc",
            "fetch_method": doms => doms[0].innerText,
            "type": TText,
        },
        {
            "name": "follows",
            "css_selector": "span.count",
            "fetch_method": doms => doms[0].innerText,
            "type": TText,
        },
        {
            "name": "fans",
            "css_selector": "span.count",
            "fetch_method": doms => doms[1].innerText,
            "type": TText,
        },
        {
            "name": "likes",
            "css_selector": "span.count",
            "fetch_method": doms => doms[2].innerText,
            "type": TText,
        },
        {
            "name": "avatar",
            "css_selector": "img.user-image",
            "fetch_method": doms => /^(.*?)\?/.exec(doms[0].src)[1],
            "type": TURL,
        },
        {
            "name": "email",
            "css_selector": ".user-desc",
            "fetch_method": doms => [...doms[0].innerHTML.matchAll(/(\s*\w+(?:\.{0,1}[\w-]+)*@[a-zA-Z0-9]+(?:[-.][a-zA-Z0-9]+)*\.[a-zA-Z]+\s*)/g)],
            "type": TText,
        }
    ];

    // 获取部分
    function fetchData() {
        let ret = {
            "uid": uid,
        };
        for (let i = 0; i < data_fields.length; i++) {
            let field = data_fields[i];
            let doms = document.querySelectorAll(field.css_selector);
            ret[field.name] = !!doms.length ? field.fetch_method(doms) : null;
        }

        // 获取到本地
        console.log(ret);
        return ret;
    }
    console.log("in 小红书信息整理");
    window.addEventListener('message', (e) => {
        if (e.data.do_get_profile) {
            e.source.postMessage(fetchData(), "https://"+e.data.host);
        }
    });
})();
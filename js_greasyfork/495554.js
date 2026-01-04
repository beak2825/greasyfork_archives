// ==UserScript==
// @name         屏蔽Google搜索历史
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  屏蔽谷歌搜索下拉框的搜索历史
// @author       向日葵
// @match        *://*.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495554/%E5%B1%8F%E8%94%BDGoogle%E6%90%9C%E7%B4%A2%E5%8E%86%E5%8F%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/495554/%E5%B1%8F%E8%94%BDGoogle%E6%90%9C%E7%B4%A2%E5%8E%86%E5%8F%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (_, url) {

        if (url.startsWith('/complete/search?')) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let response = getter.call(xhr);
                    try {
                        let data = JSON.parse(response.split('\n')[1]);
                        data[0] = data[0].filter(i=>!(i.length === 4 && i[3].du !== undefined))
                        let cheatText = response.split('\n')[0] + '\n' + JSON.stringify(data)
                        return cheatText
                    } catch (e) {
                        console.log(e)
                        return response;
                    }
                },
            });
        }
        originOpen.apply(this, arguments);
    };
})();
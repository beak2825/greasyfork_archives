// ==UserScript==
// @name         TakeAllMyMoney
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/object-info\.php/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/449839/TakeAllMyMoney.user.js
// @updateURL https://update.greasyfork.org/scripts/449839/TakeAllMyMoney.meta.js
// ==/UserScript==

(function (window, undefined) {
    let w;
    if (typeof unsafeWindow !== undefined) {
        w = unsafeWindow;
    } else {
        w = window;
    }
    if (w.self !== w.top) {
        return;
    }



    let input = document.querySelector("#buy_count")
    if (input) {
        input.value = 100

        let isBuying = get("buy_full", false)
        if (isBuying) {
            setTimeout(() => {
                buyFull()
            }, 400)
            $(`buy_res_btn`).insertAdjacentHTML("afterend", `
                <button id="buy_full">Не покупать</button>
            `)
            $(`buy_full`).addEventListener("click", (e) => {
                set("buy_full", false)
            })
        } else {
            $(`buy_res_btn`).insertAdjacentHTML("afterend", `
                <button id="buy_full">Покупать до усрачки</button>
            `)
            $(`buy_full`).addEventListener("click", (e) => {
                set("buy_full", true)
                buyFull()
            })
        }


    } else {
        set("buy_full", false)
    }

    function buyFull() {
        $(`buy_res_btn`).click()
    }

// helpers
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        } else {
            return null
        }
    }

    function doGet(url, callback, html = true) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                if (html) {
                    callback(new DOMParser().parseFromString(res.responseText, "text/html"))
                } else {
                    callback(JSON.parse(res.responseText))
                }
            }
        });
    }

    function doPost(url, params, callback, html = true) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: params,
            onload: function (res) {
                if (html) {
                    callback(new DOMParser().parseFromString(res.responseText, "text/html"))
                } else {
                    callback()
                }
            }
        });
    }

    function removeElement(element) {
        element.parentNode.removeChild(element)
    }

    function $(id, where = document) {
        return where.querySelector(`#${id}`);
    }

    function get(key, def) {
        let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
        return result == null ? def : result;

    }

    function set(key, val) {
        localStorage[key] = JSON.stringify(val);
    }

    function getScrollHeight() {
        return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    }

    function getClientWidth() {
        return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
    }

    function findAll(regexPattern, sourceString) {
        let output = []
        let match
        let regexPatternWithGlobal = RegExp(regexPattern, [...new Set("g" + regexPattern.flags)].join(""))
        while (match = regexPatternWithGlobal.exec(sourceString)) {
            delete match.input
            output.push(match)
        }
        return output
    }
})(window);
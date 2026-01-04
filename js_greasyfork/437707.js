// ==UserScript==
// @name         FasterAnimation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/437707/FasterAnimation.user.js
// @updateURL https://update.greasyfork.org/scripts/437707/FasterAnimation.meta.js
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
    let customSpeed = get("custom_speed", 1)

    if (/war\./.test(location.href)) {
        let startId;
        startId = setInterval(main, 200)


        function main() {
            if (!is_visible_element('atb_separat1')) {
                return
            } else {
                window.clearInterval(startId)
            }

            if (is_naim_guild(btype) || btype === 0 || btype === 66) {

                make_ins_but()
                animspeed_def *= customSpeed
            }
        }
    }

    if (/map/.test(location.href)) {
        document.body.insertAdjacentHTML("beforeend", `
            <center>
            <input id="custom_speed" type="range" max="10" min="1" step="0.5" value="${customSpeed}">
            <div id="custom_speed_value">${customSpeed}</div>
            </center>
        `)
        $("custom_speed").addEventListener("input", (e) => {
            customSpeed = e.target.value
            $("custom_speed_value").innerText = customSpeed
            set("custom_speed", customSpeed)
        })
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
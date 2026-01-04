// ==UserScript==
// @name         Clown Helper
// @namespace    https://greasyfork.org/ru/scripts/434546-clown-helper
// @version      0.2
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/434546/Clown%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/434546/Clown%20Helper.meta.js
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

    let clowns = get("clowns", {})


    if (location.href.includes("pl_info")) {
        let target = document.querySelectorAll("td[align=right]")[1].parentElement;
        let heroId = new URLSearchParams(window.location.search).get("id");
        target.insertAdjacentHTML('afterend', `<tr><td id="clown-target" colspan="2" style="text-align: center;"></td></tr>`)
        if (!clowns[heroId]) {
            setClown(heroId)
        } else {
            removeClown(heroId)
        }
    }

    if (location.href.includes("war.php")) {
        let data = run_all.toString().match(/".+\|"/)[0]
        for (const [key, value] of Object.entries(clowns)) {
            if (value && data.includes(key) || data.includes("btype|135")) {
                setTimeout(()=> {
                    var a = new Audio("https://muz19.z2.fm/5/87/cirkovaja_muzika_-_ebanutaja_muzika_(zf.fm).mp3");
                    if (typeof a.loop == 'boolean') {
                        a.loop = true;
                    } else {
                        a.addEventListener('ended', function() {
                            this.currentTime = 0;
                            this.play();
                        }, false);
                    }
                    a.play();
                })
                break
            }
        }
    }

    function setClown(heroId) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Пометить клоуном</span>`
        $('clown-1').addEventListener('click', e => {
            clowns[heroId] = true
            set('clowns', clowns)
            removeClown(heroId)
        })
    }

    function removeClown(heroId) {
        $('clown-target').innerHTML = `  <span id="clown-1" style="cursor: pointer; text-decoration: underline">Убрать из клоунов</span>`
        $('clown-1').addEventListener('click', e => {
            clowns[heroId] = false
            set('clowns', clowns)
            setClown(heroId)
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

    function doGet(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: "text/xml; charset=windows-1251",
            onload: function (res) {
                callback(new DOMParser().parseFromString(res.responseText, "text/html"))
            }
        });
    }

    function doPost(url, params, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: params,
            onload: callback,
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
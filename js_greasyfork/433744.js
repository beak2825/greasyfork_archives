// ==UserScript==
// @name         ResourceAuctionOneClick
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/.+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/433744/ResourceAuctionOneClick.user.js
// @updateURL https://update.greasyfork.org/scripts/433744/ResourceAuctionOneClick.meta.js
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
    let host = location.host;

    unsafeWindow.sendLot = sendLot

    let my_sign = get("my_sign", null)
    if (!my_sign) {
        setMySign()
    } else {

        Array.from(document.querySelector("#top_res_table > tbody > tr").getElementsByTagName("img"))
            .forEach(img => {
                console.log(img.src)
                let type = img.src.match(/\/(\w+)\.png/)[1].replace("gems", "gem").replace("sulfur", "sulphur").replace("crystals", "crystal")
                img.addEventListener("click", () => {
                    showAuctionMenu(type)
                })
            })
    }

    function showAuctionMenu(type) {
        document.body.insertAdjacentHTML("afterbegin", `
                <div onclick="" style=" width: 100vw;
                    height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 100000;
                    background-color: #fdefdcaa;">
                    <div style="    background-color: #4f5467;
                        color: white;
                        width: 400px;
                        height: 400px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        border-radius: 10%;">
                        <div style="padding: 10px">Цена: <input type="text" id="lot_price"></div>
                        
                        <div style="margin-top: 20px">
                            <button onclick="sendLot('${type}')">Выставить</button>
                        </div>
                    </div>
                </div>
                
                `)
    }

    function sendLot(type) {
        let price = $("lot_price").value
        doPost("https://www.heroeswm.ru/auction_accept_new_lot.php", getLotForm(type, price), () => {})
    }

    function getLotForm(type, price) {
        let formData = new FormData()
        formData.append('sign', my_sign)
        formData.append('item', type)
        formData.append('count', "50")
        formData.append('atype', "1")
        formData.append('price', price)
        formData.append('duration', "8")
        return formData
    }


// helpers
    function setMySign() {
        doGet(`https://${host}/shop.php`, (docc) => {
            set("my_sign", docc.body.innerHTML.match(/sign=([a-z0-9]+)/)[1])
            location.reload()
        })
    }

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
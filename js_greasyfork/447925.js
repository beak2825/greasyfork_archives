// ==UserScript==
// @name         NFT Rank Of CryptoWeb3.tools
// @namespace    https://cryptoweb3.tools/
// @version      1.0
// @description  使CryptoWeb3更快的获取到NFT的Rank
// @author       0xlover
// @match        https://nftnerds.ai/collection/*
// @match        https://cryptoweb3.tools
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nftnerds.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447925/NFT%20Rank%20Of%20CryptoWeb3tools.user.js
// @updateURL https://update.greasyfork.org/scripts/447925/NFT%20Rank%20Of%20CryptoWeb3tools.meta.js
// ==/UserScript==

// requesting 
let requesting = false;
// cryptoWeb3ApiBaseUrl 
const cryptoWeb3ApiBaseUrl = "https://web-api.cryptoweb3.tools";
// cryptoWeb3Url 
const cryptoWeb3Url = "https://cryptoweb3.tools";

(function () {
    window.beforeXMLHttpRequestSend = function (xhr, body) {
        setTimeout(async () => {
            const isCryptoWeb3 = window.location.ancestorOrigins[0]?.includes(cryptoWeb3Url)
            const isRarityReq = xhr.responseURL.includes("https://storage.googleapis.com/nftnerds-rarity/")
            if (isCryptoWeb3 && isRarityReq) {
                const contract = /0x[a-fA-F0-9]{40}/.exec(xhr.responseURL)[0]
                const key = /[0-9]{13}-[0-9]+-[0-9]+/.exec(xhr.responseURL)[0]
                if (requesting) return
                requesting = true
                const response = await fetch(`${cryptoWeb3ApiBaseUrl}/rank/pushRank`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contract, key })
                });
                const res = await response.json()
                if (res) {
                    alert("Rank数据已更新!")
                } else {
                    alert("Rank信息更新失败，请稍后再试！")
                }
                requesting = false
            }
        }, 500)
    };
    XMLHttpRequest.prototype.mySend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (body) {
        if ('function' === typeof window.beforeXMLHttpRequestSend) {
            window.beforeXMLHttpRequestSend(this, body);
        }
        this.mySend(body);
    };
})();

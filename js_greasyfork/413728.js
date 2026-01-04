// ==UserScript==
// @name         ホロスタいらない
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  ホロライブのスケジュールでホロスタを非表示にする
// @author       hololiveファン
// @match        https://schedule.hololive.tv/*
// @match        https://hololive.jetri.co/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/413728/%E3%83%9B%E3%83%AD%E3%82%B9%E3%82%BF%E3%81%84%E3%82%89%E3%81%AA%E3%81%84.user.js
// @updateURL https://update.greasyfork.org/scripts/413728/%E3%83%9B%E3%83%AD%E3%82%B9%E3%82%BF%E3%81%84%E3%82%89%E3%81%AA%E3%81%84.meta.js
// ==/UserScript==

(function() {
    const blackList = ['花咲みやび','鏡見キラ','奏手イヅル','アルラン','律可','アステル','岸堂天真','夕刻ロベル','影山シエン','荒咬オウガ','ホロスタ'];

    // Official schedule
    if (location.host === "schedule.hololive.tv") {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.querySelectorAll(".name").forEach(nameE => {
                const name = nameE.innerText.trim();
                if (!blackList.every(blN => !name.includes(blN))) {
                    nameE.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
                };
            });

            if (blBtn = document.evaluate("//a[contains(., 'ホロスタ')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext()) {
                blBtn.parentNode.remove();
            }
        });
    }

    // Holotools
    if (location.host === "hololive.jetri.co") {
        document.addEventListener('DOMContentLoaded', () => {
            // here we will modify the response
            function modifyResponse(response) {
                if (this.readyState === 4) {
                    const url = response.target.responseURL;
                    const original_response = response.target.responseText;

                    if (url.search("//api.holotools.app/v1/live") >= 0) {
                        Object.defineProperty(this, "responseText", {writable: true});
                        const modified_response = JSON.parse(original_response);
                        modified_response.live = cleanupVids(modified_response.live);
                        modified_response.ended = cleanupVids(modified_response.ended);
                        modified_response.upcoming = cleanupVids(modified_response.upcoming);
                        this.responseText = JSON.stringify(modified_response);
                    }

                    if (url.search("//api.holotools.app/v1/videos") >= 0) {
                        Object.defineProperty(this, "responseText", {writable: true});
                        const modified_response = JSON.parse(original_response);
                        modified_response.videos = cleanupVids(modified_response.videos);
                        this.responseText = JSON.stringify(modified_response);
                    }

                    if (url.search("//api.holotools.app/v1/channels") >= 0) {
                        Object.defineProperty(this, "responseText", {writable: true});
                        const modified_response = JSON.parse(original_response);
                        modified_response.channels = cleanupChannels(modified_response.channels);
                        this.responseText = JSON.stringify(modified_response);
                    }
                }
            }

            function cleanupVids(vids) {
                return vids.filter(v => blackList.every(blN => !v.channel.name.includes(blN)));
            }

            function cleanupChannels(channels) {
                return channels.filter(c => blackList.every(blN => !c.name.includes(blN)));
            }

            function openBypass(original_function) {
                return function(method, url, async) {
                    this.addEventListener("readystatechange", modifyResponse);
                    return original_function.apply(this, arguments);
                };
            }

            XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
        });
    }
})();
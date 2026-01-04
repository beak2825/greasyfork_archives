// ==UserScript==
// @name         Eventernote Twitterリンク追加
// @namespace    https://www.eventernote.com/
// @version      0.0.5
// @description  Eventernote のユーザーページにTwitterへのリンクを追加する
// @author       4y4m3
// @match        https://www.eventernote.com/users*
// @exclude      https://www.eventernote.com/users/*/following
// @exclude      https://www.eventernote.com/users/*/follower
// @icon         https://www.google.com/s2/favicons?domain=eventernote.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493987/Eventernote%20Twitter%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/493987/Eventernote%20Twitter%E3%83%AA%E3%83%B3%E3%82%AF%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function () {
    const f = document.querySelector('div.follow p');

    const mobileUrl = window.location.href;
    GM_xmlhttpRequest({
        method: "GET",
        url: mobileUrl,
        headers: {"User-Agent": "Mozilla/5.0 (Android 13; Mobile; rv:100.0) Gecko/20100101 Firefox/120.0"},
        onload: function(response){
            const parser = new DOMParser();
            const mobileDoc = parser.parseFromString(response.responseText, "text/html");
            const twitterLinkElement = mobileDoc.querySelector('p.twitter a');

            if(twitterLinkElement){
                const twitterUrl = twitterLinkElement.href;
                console.log(twitterUrl);
                const twitterId = twitterUrl.replace(/\/+$/, "").split('/').pop();
                f.outerHTML = '<p class="center">' + f.innerHTML + ' <a class="btn btn-large btn-primary gb_btn_add" href="https://twitter.com/' + twitterId + '">@'+twitterId+'</a></p>';
            } else {
                console.log("Twitter URL not found.");
                const n = document.querySelector('.name1');
                const eventerId = n.innerText;
                f.outerHTML = '<p class="center">' + f.innerHTML + ' <a class="btn btn-large gb_btn_add" href="https://twitter.com/' + eventerId + '">Twitter🔍</a></p>';
            }
        },
        onerror: function(error){
            console.error("Failed to fetch mobile page:",error);
        }
    })
})();
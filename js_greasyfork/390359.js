// ==UserScript==
// @name        createShortURL
// @description Use reurl.cc create short urls.
// @include     *
// @version     1.0
// @grant 		GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/390359/createShortURL.user.js
// @updateURL https://update.greasyfork.org/scripts/390359/createShortURL.meta.js
// ==/UserScript==

document.addEventListener("keypress", function(e) {
    const currentURL = window.location.href;

    if(e.altKey && e.key === "c") {
        createShortURL(currentURL);
    }
}, false);

function createShortURL(targetUrl) {
    const apiURL = "https://api.reurl.cc/shorten";
    const apiKey = "4070df69d794e03c0c45622d0dfc3946e0d2aa23cdc24594b273e2d5210412";
    const data = JSON.stringify({
        "url": targetUrl
    });

    GM_xmlhttpRequest({
        method: "POST",
        url: apiURL,
        headers: {
            "Content-Type": "application/json",
            "reurl-api-key": apiKey
        },
        data: data,
        onload: function (response) {
            let jsonOfResponse = JSON.parse(response.responseText);
            if (jsonOfResponse.res == "success") {
                alert(jsonOfResponse.short_url);
            } else {
                alert("建立縮網址失敗：" + jsonOfResponse.err);
            }
        }
    });
}

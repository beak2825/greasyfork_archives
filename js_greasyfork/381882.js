// ==UserScript==
// @name            Omzero Get Access Token
// @namespace       https://vfa-vinhtt.github.io
// @description     get access_token
// @version         1.0.2
// @icon
// @author          vinhtt
// @license         MIT
// @connect         self
// @include         https://data-stg-jp.omronconnect.mobi/app/oauth2-frontend/static/result.html?*
// @run-at          document-idle
// @noframes
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/381882/Omzero%20Get%20Access%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/381882/Omzero%20Get%20Access%20Token.meta.js
// ==/UserScript==

(function(window, document) {
    "use strict";
    let params = [];
    window.location.href.split(/\?|\&/).forEach(item => {
        let [key, value] = item.split("=") || [];
        if (key === "provider_user_id" || key === "oauth_token" || key === "refresh_token") {
            key = key.replace("provider_user_id", "ogsc_id").replace("oauth_token", "token_test");
            params.push([key, value]);
        }
    });
    let link = "";
    params.forEach(([key, value]) => {
        link += `${key}=${value}&`;
    });
    link = "https://cdn-s3-dev-apne1-hi875.zero-events.com/omwalk/index.html#/?" + link;
    document
        .querySelector(".alert-warning")
        .insertAdjacentHTML("beforeEnd", `<p>Link UserApp: <a href="${link}">${link}</a><p>`);
})(window, document);

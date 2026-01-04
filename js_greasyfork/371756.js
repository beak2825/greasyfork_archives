// ==UserScript==
// @name DuckDuckGoogle
// @description Try to search DuckDuckGo, and if it fails, use Google instead.
// @author ForgottenUmbrella
// @namespace https://greasyfork.org/users/83187
// @version 1.0.5
// @match *://duckduckgo.com/*
// @downloadURL https://update.greasyfork.org/scripts/371756/DuckDuckGoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/371756/DuckDuckGoogle.meta.js
// ==/UserScript==
// Return a URL for searching Google.
function googleSearchUrl(query) {
    const base = "https://www.google.com";
    return `${base}/search?q=${query}`;
}
// Return the search query on DuckDuckGo.
function ddgQuery(searchUrl) {
    const params = new URLSearchParams(searchUrl);
    return params.get("q");
}
// Return whether Firefox has encountered a proxy error.
function firefoxProxyError() {
    const errors = document.getElementsByClassName("error-message");
    return errors.length !== 0;
}
// Return whether Chrome has encountered a privacy error.
function chromePrivacyError() {
    const isNewTabPage = document.getElementById("one-google") !== null;
    // Chrome loads the new tab page when a privacy error occurs, so
    // detect whether the current page is the new tab page and return it.
    return isNewTabPage;
}
// Return whether the browser is Chrome.
function isChrome() {
    return window.chrome !== undefined;
}
// Navigate to a URL.
function goto(url) {
    location.href = url;
}
(() => {
    const failed = isChrome() ? chromePrivacyError() : firefoxProxyError();
    if (failed) {
        goto(googleSearchUrl(encodeURIComponent(ddgQuery(location.search))));
    }
})();

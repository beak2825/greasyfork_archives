  // ==UserScript==
// @name        Google to Yahoo
// @description Redirects Google to Yahoo
// @include     http://*.google.*/*
// @version     1
// @namespace lol
// @downloadURL https://update.greasyfork.org/scripts/18306/Google%20to%20Yahoo.user.js
// @updateURL https://update.greasyfork.org/scripts/18306/Google%20to%20Yahoo.meta.js
// ==/UserScript==
    if(content.document.location == "http://google.com"){
            window.location.replace("http://yahoo.com")
}
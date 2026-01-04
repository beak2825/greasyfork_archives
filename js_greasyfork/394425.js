// ==UserScript==
// @name         5ch redirect https
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  5ch で https じゃないときにリダイレクトするだけ（2020年末には同じ目的で https-everywhere が対応したようなのでそれを推奨します）
// @author       scri P
// @match        http://*.5ch.net/test/read.cgi/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394425/5ch%20redirect%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/394425/5ch%20redirect%20https.meta.js
// ==/UserScript==

(function() {
    location.href = "https://" + location.href.split("http://")[1];
})();
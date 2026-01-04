// ==UserScript==
// @name         glassnode account sharing
// @namespace    https://glasscookie.vercel.app
// @version      0.1
// @description  glassnode accont sharing
// @author       Bojin Li (Brian)
// @match        https://studio.glassnode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glassnode.com
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444726/glassnode%20account%20sharing.user.js
// @updateURL https://update.greasyfork.org/scripts/444726/glassnode%20account%20sharing.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // set up uuid
    var uuid = "cus_nq7MdbmjrOOBw5Ee";
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://api.glassnode.com/v1/user/info",
        onload: function (response) {
            console.log("get user info success");
            console.log(response.responseText);
            if (JSON.parse(response.responseText)['uuid'] == uuid) {
                console.log("uuid is match");
                // upload local cookie to remote
                var x = document.cookie;
                console.log(x);
                var output = {};
                x.split(/\s*;\s*/).forEach(function (pair) {
                    pair = pair.split(/\s*=\s*/);
                    output[pair[0]] = pair.splice(1).join("=");
                });
                var json = JSON.stringify(output, null, 4);
                console.log(json);
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://glasscookie.vercel.app/upload",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: json,
                    dataType: "json",
                    onload: function (response) {
                        console.log("cookie upload to remote success");
                        console.log(response.responseText);
                    },
                    onerror: function (response) {
                        console.log("cookie upload to remote failed");
                    },
                });
            } else {
                // set new cookie to local
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://glasscookie.vercel.app/get",
                    onload: function (response) {
                        console.log("cookie dowload from remote success");
                        console.log(response.responseText);
                        document.cookie = response.responseText;
                    },
                    onerror: function (response) {
                        console.log("cookie dowload from remote failed");
                    },
                });
            }
        },
        onerror: function (response) {
            console.log("get user info filed");
        },
    });
})();

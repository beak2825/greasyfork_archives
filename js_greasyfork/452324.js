// ==UserScript==
// @name         glassnode account sharing 2
// @namespace    https://mulitlogin.vercel.app/
// @version      0.5
// @description  glassnode accont sharing 2
// @author       Bojin Li (Brian)
// @match        https://studio.glassnode.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glassnode.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452324/glassnode%20account%20sharing%202.user.js
// @updateURL https://update.greasyfork.org/scripts/452324/glassnode%20account%20sharing%202.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // set up uuid
    var uuid = "cus_8ONQJg4J7adBrokn";
    var guest_email = "guest@glassnode.com";
    GM_xmlhttpRequest({
        method: "GET",
        cookie: document.cookie,
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
                    url: "https://mulitlogin.vercel.app/upload",
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
            } else{
                if (JSON.parse(response.responseText)['email'] == guest_email) {
                    console.log("guest email is match");
                    // set new cookie to local
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://mulitlogin.vercel.app/get",
                        onload: function (response) {
                            console.log("cookie dowload from remote success");
                            console.log(response.responseText);
                            document.cookie = response.responseText;
                            var now_time = new Date().getTime();
                            // if last refresh time is more than 25 seconds, refresh the page
                            if (now_time - GM_getValue("last_refresh_time", 0) > 25000) {
                                console.log("last refresh time is more than 25 seconds, refresh the page");
                                GM_setValue("last_refresh_time", now_time);
                                location.reload();
                            } else {
                                console.log("last refresh time is less than 25 seconds, do nothing");
                            }
                        },
                        onerror: function (response) {
                            console.log("cookie dowload from remote failed");
                        },
                    });
                }
                else {
                    console.log("Not guest email, using customize email!");
                    console.log(JSON.parse(response.responseText)['email']);
                    console.log("NOT DO ANYTHING!");
                }
            }
        },
        onerror: function (response) {
            console.log("get user info filed");
        },
    });
})();

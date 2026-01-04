// ==UserScript==
// @name         Construct 3 Crack
// @namespace    https://t.me/wladekhack
// @version      1.0
// @description  Personal License Crack for C3 by ImmortalAI ft. WladekHack
// @author       ImmortalAI ft. WladekHack
// @match        https://account.construct.net/*
// @run-at       document-start
// @icon         https://construct-static.com/images/v1253/r/global/construct-3-logo_v64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502275/Construct%203%20Crack.user.js
// @updateURL https://update.greasyfork.org/scripts/502275/Construct%203%20Crack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const loginJsonUrl = 'https://account.construct.net/login.json';
    const tokenJsonUrl = 'https://account.construct.net/token.json';

    const modifiedLoginJson = {
        "request": {
            "status":"ok",
            "time":999999999,
            "date":"2021-08-29T20:20:49.2635326Z",
            "server":"prd-vm-login-01"
        },
        "response": {
            "token":"b63a40dd-0088-4f88-8bd5-f31db0834a92",
            "userID":1
        }
    };

    const modifiedTokenJson = {
        "request":{
            "status":"ok",
            "time":999999999,
            "date":"2021-10-05T01:28:00.8575421Z",
            "server":"prd-vm-login-01"
        },
        "response":{
            "newToken":"ff9b3ec1-3798-4bff-8fbf-9ce012c80375",
            "user":{
                "id":1052352,
                "username":"WladekHack",
                "highResAvatar":{
                    "url":"https://construct-static.com/avatars/1183565/get"
                }
            },
            "license":{
                "type":"personal",
                "hash":"",
                "gamejamLicenseAvailable":true,
                "activeGamejamLicense":{
                    "startTime":1633003200,
                    "endTime":1649231178,
                    "name":"WladekHack",
                    "relatedURL":"https://www.construct.net/en/blogs/construct-official-blog-1/ludum-dare-once-again-free-1572"
                },
                "scriptingEnabled":true,
                "reason":"Thereisnoseatorlicenseassignedtoyou.",
                "canUseBuildService":true,
                "canUseRemovePreview":true,
                "canExport":true,
                "canShareProject":true
            }
        }
    };

    // Override the fetch function to intercept the response
    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then((response) => {
            if (response.url === loginJsonUrl) {
                return new Response(JSON.stringify(modifiedLoginJson), {
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            } else if (response.url === tokenJsonUrl) {
                return new Response(JSON.stringify(modifiedTokenJson), {
                    status: 200,
                    statusText: 'OK',
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
            }
            return response;
        });
    };
})();
// ==UserScript==
// @name         Origin helper
// @namespace    BurstSnow
// @version      0.1
// @description  Open and get permalink to user profiles
// @author       You
// @match        https://www.origin.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423024/Origin%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/423024/Origin%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function openUserId(userId) {
        const userEncodeUrl = `https://api1.origin.com/gifting/idobfuscate/users/${userId}/encodePair`;
        const accessTokenUrl = 'https://accounts.ea.com/connect/auth?client_id=ORIGIN_JS_SDK&response_type=token&redirect_uri=nucleus:rest&prompt=none&release_type=prod';

        GM_xmlhttpRequest({
            method: "GET",
            url: accessTokenUrl,
            onload: function(response) {
                const payload = JSON.parse(response.responseText);
                const token = payload.access_token;

                GM_xmlhttpRequest({
                    method: "GET",
                    url: userEncodeUrl,
                    headers: {
                        'AuthToken': token
                    },
                    onload: function(response) {
                        const payload = JSON.parse(response.responseText);
                        const encryptedId = payload.id;

                        document.location.replace(`https://www.origin.com/profile/user/${encryptedId}/achievements`);
                    }
                })
            }
        });
    }

    function decryptUserId(done) {
        // https://www.origin.com/deu/en-us/profile/user/F8HjoZfRTkyX_TKu3FB1Cw--
        const extracted = /\/user\/([^/]+).*$/.exec(document.location.href);
        if (extracted === null) {
            alert("Error: can't extract the encrypted user id.\nAre you really on a profile page?");
            return;
        }


        const encodedId = extracted[1];
        const userDecodeUrl = `https://api1.origin.com/gifting/idobfuscate/users/${encodedId}/decodePair`;

        const accessTokenUrl = 'https://accounts.ea.com/connect/auth?client_id=ORIGIN_JS_SDK&response_type=token&redirect_uri=nucleus:rest&prompt=none&release_type=prod';

        return GM_xmlhttpRequest({
            method: "GET",
            url: accessTokenUrl,
            onload: function(response) {
                const payload = JSON.parse(response.responseText);
                const token = payload.access_token;

                return GM_xmlhttpRequest({
                    method: "GET",
                    url: userDecodeUrl,
                    headers: {
                        'AuthToken': token
                    },
                    onload: function(response) {
                        const payload = JSON.parse(response.responseText);
                        const userId = payload.id;

                        done(userId);
                    }
                })
            }
        });
    }

    function promptOpenUserId() {
        const userId = prompt('Input user id here (e.g. 1011393993169)');
        openUserId(userId);
    }

    function alertUserId() {
        return decryptUserId(userId => alert(`https://www.origin.com/profile/achievements?userId=${userId}`));
    }

    function maybeRedirectToUser() {
        // https://www.origin.com/profile/achievements?userId=1003020580074
        const extracted = /(?:\?|&)userId=(\d+)/.exec(document.location.href);

        if (extracted === null) {
            return;
        }

        const userId = extracted[1];
        openUserId(userId);
    }


    GM_registerMenuCommand("Open Origin profile from userId", promptOpenUserId, "o");
    GM_registerMenuCommand("Get permalink of Origin profile", alertUserId, "g");

    maybeRedirectToUser();

})();
// ==UserScript==
// @name         Github Actions Trigger
// @version      0.9
// @description  Trigger Github Actions
// @author       Texot
// @namespace    https://greasyfork.org/zh-CN/scripts/407616-github-actions-trigger
// @homepage     https://greasyfork.org/zh-CN/scripts/407616-github-actions-trigger
// @require      https://code.jquery.com/jquery-latest.min.js
// @match        https://github.com/*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/407616/Github%20Actions%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/407616/Github%20Actions%20Trigger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ask_parameter(varid, prompt, save, allow_empty, skip) {
        if (skip && GM_getValue(varid, null) !== null) return GM_getValue(varid);
        let value = window.prompt(prompt, GM_getValue(varid, ""));
        if (value===null) throw null;
        if (!allow_empty && !value) {
            window.alert("Value should not be empty");
            throw null;
        }
        if (save) GM_setValue(varid, value);
        return value;
    }

    function trigger_repo_dispatch() {
        let pathArray = window.location.pathname.split('/');
        if (pathArray.length < 3) return;
        let token = ask_parameter("token", "Token", true, false);
        let type = ask_parameter("repo_dis_type", "Type", true, true);
        let payload = ask_parameter("repo_dis_payload", "Client Payload (in JSON)", true, true);
        let data = {event_type: type};
        try {
            if (payload) data.client_payload = JSON.parse(payload);
        } catch (e) {
            window.alert("JSON parse failed: " + e.message);
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.github.com/repos/" + pathArray[1] + "/" + pathArray[2] + "/dispatches",
            headers: {"Authorization": "token " + token, "Accept": "application/vnd.github.everest-preview+json"},
            data: JSON.stringify(data),
            onload: (resp) => {
                if (resp.status == 204 || resp.status == 200) {
                    console.log("Repo dispatch succeed: " + resp.responseText);
                    window.alert("Repo dispatch succeed" + (resp.responseText?(": " + resp.responseText):""));
                } else {
                    var message = resp.responseText;
                    try {
                        message = JSON.parse(message).message;
                    } catch (e) {}
                    console.log("Repo dispatch failed: " + resp.responseText);
                    window.alert("Repo dispatch failed: " + message);
                }
            },
            onerror: (e) => {
                console.log("Repo dispatch failed: " + e);
                window.alert("Repo dispatch failed: " + e.message);
            }
        });
    }

    function trigger_repo(x) {
        let pathArray = window.location.pathname.split('/');
        if (pathArray.length < 3) return;
        let token = ask_parameter("token", "Token", true, false);
        let payload = '{"target": "'+x+'"}';
        let data = {event_type: x};
        try {
            if (payload) data.client_payload = JSON.parse(payload);
        } catch (e) {
            window.alert("JSON parse failed: " + e.message);
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.github.com/repos/" + pathArray[1] + "/" + pathArray[2] + "/dispatches",
            headers: {"Authorization": "token " + token, "Accept": "application/vnd.github.everest-preview+json"},
            data: JSON.stringify(data),
            onload: (resp) => {
                if (resp.status == 204 || resp.status == 200) {
                    console.log("Repo dispatch succeed: " + resp.responseText);
                    window.alert("Repo dispatch succeed" + (resp.responseText?(": " + resp.responseText):""));
                } else {
                    var message = resp.responseText;
                    try {
                        message = JSON.parse(message).message;
                    } catch (e) {}
                    console.log("Repo dispatch failed: " + resp.responseText);
                    window.alert("Repo dispatch failed: " + message);
                }
            },
            onerror: (e) => {
                console.log("Repo dispatch failed: " + e);
                window.alert("Repo dispatch failed: " + e.message);
            }
        });
    }

    $(document).ready(() => {
        let repo_dis_x64 = $("<a class='btn btn-sm'>x86_64</a>").on("click", function(){trigger_repo("x86_64");});
        let repo_dis_r2s = $("<a class='btn btn-sm'>R2S</a>").on("click", function(){trigger_repo("nanopi-r2s");});
        let repo_dis_r4s = $("<a class='btn btn-sm'>R4S</a>").on("click", function(){trigger_repo("nanopi-r4s");});
        let repo_dis_4b = $("<a class='btn btn-sm'>Rpi-4B</a>").on("click", function(){trigger_repo("Rpi-4B");});
        let repo_dis_btn = $("<a class='btn btn-sm'>Repo Dispatch</a>").on("click", trigger_repo_dispatch);
        $(".pagehead-actions").eq(0).prepend($("<li></li>").append(repo_dis_x64)).prepend($("<li></li>").append(repo_dis_r2s)).prepend($("<li></li>").append(repo_dis_r4s)).prepend($("<li></li>").append(repo_dis_4b)).prepend($("<li></li>").append(repo_dis_btn));
    });

})();

// ==UserScript==
// @name         Github Deployments and Repository Dispatch Trigger
// @version      0.3
// @description  Trigger deployment or repository_dispatch event for Github Actions
// @author       Texot
// @namespace    https://github.com/tete1030/github-repo-dispatcher
// @homepage     https://github.com/tete1030/github-repo-dispatcher
// @require      https://code.jquery.com/jquery-latest.min.js
// @match        https://github.com/*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/394032/Github%20Deployments%20and%20Repository%20Dispatch%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/394032/Github%20Deployments%20and%20Repository%20Dispatch%20Trigger.meta.js
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
        let type = ask_parameter("repo_dis_type", "Type", true);
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

    function trigger_deployments() {
        let pathArray = window.location.pathname.split('/');
        if (pathArray.length < 3) return;
        let token = ask_parameter("token", "Token", true, false);
        let ref = ask_parameter("deploy_ref", "Ref (Branch, Tag, Commit)", true);
        let task = ask_parameter("deploy_task", "Task", true);
        let payload = ask_parameter("deploy_payload", "Payload (in JSON)", true, true);
        let data = {
            ref: ref,
            auto_merge: false,
            task: task,
            required_contexts: [],
            description: "Created by Github Deployments and Repository Dispatch Trigger"
        };
        try {
            if (payload) data.payload = JSON.parse(payload);
        } catch (e) {
            window.alert("JSON parse failed: " + e.message);
            return;
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.github.com/repos/" + pathArray[1] + "/" + pathArray[2] + "/deployments",
            headers: {"Authorization": "token " + token, "Accept": "application/vnd.github.ant-man-preview+json"},
            data: JSON.stringify(data),
            onload: (resp) => {
                if (resp.status == 201) {
                    console.log("Create deployments succeed: " + resp.responseText);
                    window.alert("Create deployments succeed" + (resp.responseText?(": " + resp.responseText):""));
                } else {
                    var message = resp.responseText;
                    try {
                        message = JSON.parse(message).message;
                    } catch (e) {}
                    console.log("Create deployments failed: " + resp.responseText);
                    window.alert("Create deployments failed: " + message);
                }
            },
            onerror: (e) => {
                console.log("Create deployments failed: " + e);
                window.alert("Create deployments failed: " + e.message);
            }
        });
    }

    $(document).ready(() => {
        let repo_dis_btn = $("<a class='btn btn-sm'>Repo Dispatch</a>").on("click", trigger_repo_dispatch);
        let deployments_btn = $("<a class='btn btn-sm'>Deploy</a>").on("click", trigger_deployments);
        $(".pagehead-actions").eq(0).prepend($("<li></li>").append(repo_dis_btn)).prepend($("<li></li>").append(deployments_btn));
    });

})();

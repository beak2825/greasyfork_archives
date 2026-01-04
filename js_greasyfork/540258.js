// ==UserScript==
// @name        fr4
// @namespace   Violentmonkey Scripts
// @match       *://github.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_notification
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       unsafeWindow
// @version     1.0
// @license MIT
// @author      -
// @description Open a GitHub releases page from a repo
// @downloadURL https://update.greasyfork.org/scripts/540258/fr4.user.js
// @updateURL https://update.greasyfork.org/scripts/540258/fr4.meta.js
// ==/UserScript==

const get_repo = /(https?:\/\/[^.]+\.[^.\/]+\/[^\/]+\/[^\/]+)/i;
const get_repo_handle = /https?:\/\/[^.]+\.[^.\/]+\/([^\/]+\/[^\/]+)/i;

function give_up() {
    GM_notification({ title: "Error", text: "I can't find anything. Maybe try compiling it yourself?" });
}

function try_packages() {
    give_up();
}

GM_registerMenuCommand('Find latest release files', () => {
    // Get the root repository url, if possible
    let match_result = get_repo.exec(window.location.href);
    if (match_result != null) {
        let repo_url = match_result[0];
        if (!repo_url.endsWith("/")) {
            repo_url += "/";
        }
        // Try latest release
        GM_xmlhttpRequest({
            url: repo_url + "releases/latest",
            onload: () => {
                GM_openInTab(repo_url + "releases/latest");
            },
            onerror: () => {
                // Try tags
                let tag_api_url = "https://api.github.com/repos/" + get_repo_handle.exec(repo_url)[0] + "/tags";

                GM_xmlhttpRequest({
                    url: tag_api_url,
                    onload: (r) => {
                        let doc = JSON.parse(r.response);
                        if (Array.isArray(doc)) {
                            let tag_url = repo_url + "releases/tag/" + doc[0].name;
                            GM_xmlhttpRequest({
                                url: tag_url,
                                onload: () => {
                                    GM_openInTab(tag_url);
                                },
                                onerror: () => {
                                    try_packages();
                                }
                            });
                        } else {
                            try_packages();
                        }
                    },
                    onerror: () => {
                        try_packages();
                    }
                });
            }
        });
    } else {
        GM_notification({ title: "Error", text: "You must be on the web page of a GitHub repository" });
    }
});

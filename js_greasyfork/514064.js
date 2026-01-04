// ==UserScript==
// @name        Hide GitLab "Migrate from Jenkins" Widget
// @namespace   Violentmonkey Scripts
// @match       https://gitlab.*/*/merge_requests/*
// @grant       none
// @version     1.0.0
// @author      joshmcorreia
// @license     MIT
// @description Hides the GitLab "Migrate from Jenkins" widget on the pipelines page.
// @downloadURL https://update.greasyfork.org/scripts/514064/Hide%20GitLab%20%22Migrate%20from%20Jenkins%22%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/514064/Hide%20GitLab%20%22Migrate%20from%20Jenkins%22%20Widget.meta.js
// ==/UserScript==

// GitHub repo can be found at https://github.com/joshmcorreia/userscript_hide_gitlab_migrate_from_jenkins

const pipeline_suggest_selector = ".mr-pipeline-suggest";

function remove_migrate_widget() {
    var pipeline_suggest_element = document.querySelector(pipeline_suggest_selector);
    pipeline_suggest_element.remove();
}

(new MutationObserver(check)).observe(document, {childList: true, subtree: true});

function check(changes, observer) {
    if(document.querySelector(pipeline_suggest_selector)) {
        observer.disconnect();
        remove_migrate_widget();
    }
}

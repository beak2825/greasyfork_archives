// ==UserScript==
// @name         Gitlab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  gitlab
// @author       You
// @license      MIT
// @match        https://git.xjjj.co/*/-/merge_requests/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462846/Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/462846/Gitlab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(document.getElementById("merge_request_force_remove_source_branch")){
        document.getElementById("merge_request_force_remove_source_branch").checked = false;
    }

    if(document.getElementById("remove-source-branch-input")){
        document.getElementById("remove-source-branch-input").checked = false;
    }

    setTimeout(()=>{
        if(document.getElementsByClassName("custom-control-input")){
            Array.from(document.getElementsByClassName("custom-control-input")).forEach(v=>v.checked =true);
        }
    },10000);
    // Your code here...
})();
// ==UserScript==
// @name         Azure DevOps Commit Compare
// @namespace    https://fxzfun.com/userscripts
// @version      1.0.0
// @description  Compare commits like pull requests
// @author       FXZFun
// @match        https://dev.azure.com/*/*/_git/*/commit/*
// @match        https://dev.azure.com/*/*/_git/*
// @icon         https://cdn.vsassets.io/content/icons/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476658/Azure%20DevOps%20Commit%20Compare.user.js
// @updateURL https://update.greasyfork.org/scripts/476658/Azure%20DevOps%20Commit%20Compare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function run() {
        if (document.getElementById("__bolt-compare-commits")) return;

        const commitId = location.href.match(/(?<=commit\/)(.+)(?=\?)/gi)?.[0];
        const storedCommitId = localStorage.getItem("azureDevOpsCommitCompareId");

        document.getElementById("__bolt-browse-files").insertAdjacentHTML("beforeBegin",
                                                                          `<a aria-roledescription="link"
                                                                              class="bolt-header-command-item-button bolt-button bolt-link-button enabled ${storedCommitId && "primary"} bolt-focus-treatment"
                                                                              data-focuszone="focuszone-3"
                                                                              data-is-focusable="true"
                                                                              id="__bolt-compare-commits"
                                                                              role="menuitem"
                                                                              tabindex="0">
                                                                               <span class="bolt-button-text body-m">${storedCommitId ? "Start Compare" : "Compare Commits"}</span>
                                                                           </a>`);

        document.getElementById("__bolt-compare-commits").addEventListener("click", () => {
            let url = location.href.substring(0, location.href.indexOf('commit'));

            if (!storedCommitId) {
                localStorage.setItem("azureDevOpsCommitCompareId", commitId);
                url += "commits";
            } else {
                localStorage.removeItem("azureDevOpsCommitCompareId");
                url += `/branchCompare?baseVersion=GC${storedCommitId}&targetVersion=GC${commitId}&_a=files`;
            }

            location.href = url;
        });
    }

    let currentURL = "";
    setInterval(() => {
        if (location.href !== currentURL && /https:\/\/dev\.azure\.com\/.*\/.*\/_git\/.*\/commit\/.*/.test(location.href)) {
            run()
            currentURL = location.href;
        }
    }, 1000); // Check every second

})();

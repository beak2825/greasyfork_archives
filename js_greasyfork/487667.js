// ==UserScript==
// @name         Github manual merge
// @namespace    https://github.com/lordwelch/
// @version      2.4
// @description  Changes the copy button at the top of a pull-request to copy a git command to pull to a pr branch
// @license      MIT
// @author       lordwelch
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/487667/Github%20manual%20merge.user.js
// @updateURL https://update.greasyfork.org/scripts/487667/Github%20manual%20merge.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.log("script started");
    var pushState = history.pushState;
    var replaceState = history.replaceState;

    history.pushState = function() {
        pushState.apply(history, arguments);
        window.dispatchEvent(new Event('pushstate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    history.replaceState = function() {
        replaceState.apply(history, arguments);
        window.dispatchEvent(new Event('replacestate'));
        window.dispatchEvent(new Event('locationchange'));
    };

    window.addEventListener('popstate', function() {
        window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener("load", function() {
        window.dispatchEvent(new Event('locationchange'));
    });
    function breakCheck() {
        if (document.getElementById('gh-manual-pull-fix') != null) {
            console.log("fix is already applied");
            return true;
        }
        if (document.getElementById('gh-manual-merge-fix') != null) {
            console.log("fix is already applied");
            return true;
        }
        var location = document.location.pathname.match(/\/([^/]+)\/([^/]+)\/pull\/(\d+)$/);
        if (location == null) {
            console.log("incorrect page");
            return true;
        }
        return false;
    }

    function trimSuffix(str, suffix) {
        if (str.endsWith(suffix)) {
            return str.substr(0, str.length-suffix.length);
        }
        return str;
    }
    function trimPrefix(str, prefix) {
        if (str.startsWith(prefix)) {
            return str.substr(prefix.length-str.length);
        }
        return str;
    }

    function FixForkInstructions(argument) {
        if (breakCheck()) {
            return;
        }

        let location = document.location.pathname.match(/\/([^/]+)\/([^/]+)\/pull\/(\d+)$/);
        if (location == null) {
            return;
        }
        let upstreamPrNum = location[3];

        let headObj = document.querySelector('.commit-ref.head-ref');
        let [downstreamOwner, headRepoRef] = headObj.title.split('/');
        let [downstreamRepo, downStreamBranch] = headRepoRef.split(':');
        let baseObj = document.querySelector('.commit-ref.base-ref');
        let [upstreamOwner, baseRepoRef] = baseObj.title.split('/');
        let [upstreamRepo, upstreamBranch] = baseRepoRef.split(':');
        let downstreamUrl = `https://${document.location.host}/${downstreamOwner}/${downstreamRepo}`;
        let upstreamUrl = `https://${document.location.host}/${upstreamOwner}/${upstreamRepo}`;

        let localBranchName = `${downstreamOwner}/${downStreamBranch}-${upstreamPrNum}`

        let fetch = `git fetch --force ${downstreamUrl} +${downStreamBranch}:${localBranchName}`

        let pullInstructions = `git stash\ngit checkout ${upstreamBranch}\ngit fetch --force ${downstreamUrl} +${downStreamBranch}:${localBranchName}\ngit checkout ${localBranchName}`;
        let mergeInstructions = `git checkout ${upstreamBranch}\ngit merge ${localBranchName}`;

        let clipboardButtons = document.querySelectorAll("clipboard-copy.js-copy-branch");
        for (const cButton of clipboardButtons) {
            cButton.value = fetch;
        }
        if (breakCheck()) {
            return;
        }
    }

    function FixBranchInstructions(argument) {
        if (breakCheck()) {
            return;
        }

        let headObj = document.querySelector('.commit-ref.head-ref');
        let [downstreamOwner, headRepoRef] = headObj.title.split('/')
        let [downstreamRepo, downStreamBranch] = headRepoRef.split(':')
        let baseObj = document.querySelector('.commit-ref.base-ref');
        let [upstreamOwner, baseRepoRef] = baseObj.title.split('/')
        let [upstreamRepo, upstreamBranch] = baseRepoRef.split(':')
        let downstreamUrl = `https://${document.location.host}/${downstreamOwner}/${downstreamRepo}`;
        let upstreamUrl = `https://${document.location.host}/${upstreamOwner}/${upstreamRepo}`;

        var pullInstructions = `git stash\ngit checkout ${upstreamBranch}\ngit fetch --force ${downstreamUrl} +${downStreamBranch}:${downStreamBranch}\ngit checkout ${downStreamBranch}`;
        var mergeInstructions = `git checkout ${upstreamBranch}\ngit merge ${downStreamBranch}`;

        let clipboardButtons = document.querySelectorAll("clipboard-copy.js-copy-branch");
        for (const cButton of clipboardButtons) {
            cButton.value = fetch;
        }
        if (breakCheck()) {
            return;
        }
    }
    async function fixManualMergeInstructions() {
        console.log("script running");
        if (breakCheck()) {
            return;
        }
        var location = document.location.pathname.match(/\/([^/]+)\/([^/]+)\/pull\/(\d+)$/);
        if (location == null) {
            return;
        }
        var upstreamOwner = location[1];
        var upstreamRepo = location[2];
        var upstreamPrNum = location[3];
        var refObj = document.querySelector('.commit-ref.head-ref');
        while (refObj == null) {
            await new Promise(r => setTimeout(r, 300));
            console.log("Waiting for pr to load");
            if (breakCheck()) {
                return;
            }
            location = document.location.pathname.match(/\/([^/]+)\/([^/]+)\/pull\/(\d+)$/);
            if (location == null) {
                continue;
            }
            upstreamOwner = location[1];
            upstreamRepo = location[2];
            upstreamPrNum = location[3];
        }
        if (breakCheck()) {
            return;
        }
        let [downstreamOwner, repoRef] = refObj.title.split('/')
        let [downstreamRepo, downStreamBranch] = repoRef.split(':')

        if (downstreamRepo != upstreamRepo || downstreamOwner != upstreamOwner) {
            FixForkInstructions()
        } else {
            FixBranchInstructions()
        }
    }
    window.addEventListener('locationchange', fixManualMergeInstructions);
    fixManualMergeInstructions();
})();
// ==UserScript==
// @name         Better GitHub Pull Requests
// @namespace    DougKrahmer
// @version      0.1.3.3
// @description  Improves the GitHub Pull Request UI and adds several features. "Better PRs"
// @author       Doug Krahmer
// @license      GNU GPLv3
// @include      /^https:\/\/github\.com\/[^\/]+\/[^\/].*$/
// @include      /^https:\/\/git\.[^\/]+\/[^\/]+\/[^\/].*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/442885/Better%20GitHub%20Pull%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/442885/Better%20GitHub%20Pull%20Requests.meta.js
// ==/UserScript==

/*
# Features
   - Show one file at a time. (can be disabled with on-page checkbox)
   - Show unviewed filenames in bold in file tree.
   - Show number of comments for each file in file tree.
   - Auto-mark file as viewed after viewing for 2 seconds. (only in "single file" mode, configurable delay time)
   - Filename pop-up tooltips in native GitHub file tree.
   - Automatically load large diffs that are hidden by default. (only in "single file" mode)
   - Enable adjusting the file tree width. (bottom-right corner of file tree pane)
   - Works with GitHub and GitHub Enterprise.
   - Supports native GitHub tree view and/or [Gitako Chrome Extension](https://chrome.google.com/webstore/detail/gitako-github-file-tree/giljefjcheohhamkjphiebfjnlphnokk) tree view.
   - On-page checkbox to disable/enable added styles.

# User Settings
   - `Enabled` - Set to false to disable this mod. A checkbox is added to the page to easliy change this setting on the fly.
   - `IntegrateWithGitako` - Integrate with [Gitako](https://chrome.google.com/webstore/detail/gitako-github-file-tree/giljefjcheohhamkjphiebfjnlphnokk) file tree in addition to GitHub native.
   - `MarkViewedAfterMs` - Mark file viewed after this many milliseconds. Set to 0 to disable.
   - `ShowOnlySingleFile` - Show only a single file at a time in the UI. A checkbox is added to the page to easliy change this setting on the fly.

# How to change User Settings
Persistent user settings can be changed in the Storage tab in Tampermonkey.
The Storage tab can be found near to the script Editor tab when editing this script in Tampermonkey.
If the Storage tab is not visible, change config mode to Advanced in Tampermonkey's main Settings then refresh.
Load at least one PR to populate default values before attempting to edit.
These settings will persist even if the browser is closed or this Tampermonkey script is updated in the future.

# Notes
This script will automatically run on github.com and any domain name that begins with "git." for GitHub Enterprise.
If your GitHub Enterprise domain does not start with "git.", add your domain name to the "User Includes" section on the Settings tab for this script.
*/

(function() {
    'use strict';

    const FILE_SHOW_CLASS = "file-show";
    const UNVIEWED_CLASS = "file-unviewed";
    const FILE_LINK_CLASS = "file-link";
    const COMMENT_COUNT_CLASS = "comment-count";
    const INITIALIZE_TREE_ATTEMPTS = 600;
    const ATTACHED_ATTRIBUTE = "better-gh-attached";
    let _lastFileDiffHash = null;
    let _areTreesInitialized = false;
    const $ = window.$;

    const initialize = () => {
        // add URL change events to browser
        var wr = (type) => {
            var orig = history[type];
            return function() {
                var rv = orig.apply(this, arguments);
                var e = new Event(type);
                e.arguments = arguments;
                window.dispatchEvent(e);
                return rv;
            };
        };
        history.pushState = wr('pushState');
        history.replaceState = wr('replaceState');

        verifyStyles();
        // add URL change listeners
        window.addEventListener("pushState", handleUrlChange);
        window.addEventListener("popstate", handleUrlChange);
        window.addEventListener("replaceState", handleUrlChange);
        handleUrlChange();
    }

    const handleUrlChange = (event) => {
        verifyAppendedSettings();
        if (!_areTreesInitialized && window.location.pathname.endsWith("/files")) {
            initializeTrees();
            _areTreesInitialized = true;
        }
        else {
            _areTreesInitialized = false;
        }

        handleHashChange();
    }

    const verifyAppendedSettings = () => {
        let container = $("div.diffbar div.flex-items-center[data-pjax='#repo-content-pjax-container']");
        if (container.length === 0) {
            // legacy DOM
            container = $("div.diffbar > .flex-auto > div:nth-child(2)");
        }

        if (container.length == 0) {
            return;
        }

        let enableBetterPrs = container.find("#enable-better-prs")[0];
        if (!enableBetterPrs) {
            container.append('<div class="diffbar-item form-checkbox" style="margin-top: 0; margin-bottom: 0;"><details class="details-reset"><summary><label class="Link--muted" style="cursor: inherit" title="Enable Better GitHub Pull Requests"><input id="enable-better-prs" type="checkbox" style="cursor: inherit">Better PRs</label></summary></details></div>');
            const enableBetterPrs = container.find("#enable-better-prs")[0];
            if (enableBetterPrs) {
                enableBetterPrs.checked = getValue("Enabled", true);
                enableBetterPrs.addEventListener("change", toggleBetterPr);
            }
        }

        let singleFile = container.find("#enable-single-file")[0];
        if (!singleFile) {
            container.append('<div class="diffbar-item form-checkbox" style="margin-top: 0; margin-bottom: 0;"><details class="details-reset"><summary><label class="Link--muted" style="cursor: inherit" title="Show only the single selected file (when Better PRs is enabled)."><input id="enable-single-file" type="checkbox" style="cursor: inherit">Single File</label></summary></details></div>');
            const singleFile = container.find("#enable-single-file")[0];
            if (singleFile) {
                singleFile.checked = getValue("ShowOnlySingleFile", true);
                singleFile.addEventListener("change", toggleSingleFile);
            }
        }
    }

    const toggleBetterPr = (event) => {
        setValue("Enabled", event.target.checked);
        verifyStyles();
    }

    const toggleSingleFile = (event) => {
        setValue("ShowOnlySingleFile", event.target.checked);
        verifyStyles(true);
    }

    const handleHashChange = () => {
        const hash = (window?.location?.hash || "").replace("#", "");

        if (hash === _lastFileDiffHash || !hash.startsWith("diff-")) {
            return; // Nothing to do. Either already handled or no file to change to
        }

        // hide previous file div (if any)
        if (_lastFileDiffHash) {
            const lastFileDiv = window.document.getElementById(_lastFileDiffHash);
            if (lastFileDiv) {
                lastFileDiv.className = lastFileDiv.className.replace(` ${FILE_SHOW_CLASS}`, "");
            }
        }

        const fileDiv = window.document.getElementById(hash);
        if (!fileDiv) {
            _lastFileDiffHash = null;
            // The file element is missing and might not be loaded yet. Try again soon...
            setTimeout(() => handleHashChange(), 100);
            return;
        }

        // show the selected file div
        addClassName(fileDiv, FILE_SHOW_CLASS);
        const button = fileDiv.querySelector(".js-diff-load-container button");
        if (button?.attributes["data-disable-with"]?.value?.startsWith("Loading")) {
            button.click();
        }

        // Remove the class name that hides the block after collpsing or marking as viewed
        const detailsClassName = "Details-content--hidden";
        const containerDiv = fileDiv.querySelector(`div.${detailsClassName}`);
        if (containerDiv) {
            removeClassName(containerDiv, detailsClassName)
        }

        _lastFileDiffHash = hash;
        const viewedCheckbox = attachToViewedCheckbox(fileDiv, hash);

        if (getValue("Enabled", true) && getValue("ShowOnlySingleFile", true) && getValue("MarkViewedAfterMs", 2000) > 0 && viewedCheckbox?.checked === false) {
            setTimeout(() => {
                // check if the user is still viewing the same file
                const currentHash = (window?.location?.hash || "").replace("#", "");
                if (currentHash != hash) {
                    // the user has moved on
                    return;
                }
                viewedCheckbox.click(); // mark viewed
            }, getValue("MarkViewedAfterMs", 2000));
        }
    }

    const initializeTrees = () => {
        initializeTree("file-tree", "link-", INITIALIZE_TREE_ATTEMPTS); // native tree
        if (getValue("IntegrateWithGitako", true)) {
            initializeGitakoTree(INITIALIZE_TREE_ATTEMPTS);
        }
    }

    const initializeGitakoTree = (retryAttempts) => {
        const gitakoContainer = document.querySelector(".magic-size-container")?.querySelector("div")?.querySelector("div");

        if (!gitakoContainer && retryAttempts > 0) {
            setTimeout(() => initializeGitakoTree(retryAttempts - 1), 500); // wait a bit for it to load then try again
            return;
        }

        const initEvent = (event) => {
            initializeTree("div.gitako-side-bar-content", "link-gitako-", retryAttempts);
        }

        initEvent();
        gitakoContainer.addEventListener("DOMNodeInserted", initEvent);
    }

    const initializeTree = (containerSelector, linkPrefix, retryAttempts) => {
        const treeDiv = document.querySelector(containerSelector);
        const treeLinks = treeDiv?.querySelectorAll("a") ?? [];

        let fileCount = 0;
        for (let i = 0; i < treeLinks.length; i++) {
            const treeLink = treeLinks[i];
            if (treeLink.id || !treeLink.href?.includes("#diff-")) {
                continue;
            }

            const hash = treeLink.href.substring(treeLink.href.indexOf("#diff-") + 1);
            const fileDiv = window.document.getElementById(hash);
            if (!fileDiv) {
                setTimeout(() => initializeTree(containerSelector, linkPrefix, retryAttempts - 1), 100); // It may not have finished loading yet. Try again soon.
                return;
            }
            const viewedCheckbox = fileDiv.querySelector("input.js-reviewed-checkbox");
            addClassName(treeLink, FILE_LINK_CLASS)
            if (!viewedCheckbox?.checked) {
                addClassName(treeLink, UNVIEWED_CLASS)
            }

            if (!treeLink.title){
                const fileLabelElement = treeLink.querySelector(".ActionList-item-label");
                const filename = fileLabelElement?.innerText;
                if (filename) {
                    treeLink.title = filename; // add filename tooltip for native file tree
                }
            }

            const handleCommentAddedRemoved = (event) => {
                if (!event?.target?.className?.includes("comment-holder")
                    && !event?.target?.className?.includes("review-comment")
                    && !event?.target?.className?.includes("js-comment-container")) {
                    return;
                }

                // handle after the current command stack to ensure an accurate count
                setTimeout(() => {
                    updateCommentCount(treeLink, fileDiv);
                }, 0)
            }

            fileDiv.addEventListener("DOMNodeInserted", handleCommentAddedRemoved);
            fileDiv.addEventListener("DOMNodeRemoved", handleCommentAddedRemoved);

            updateCommentCount(treeLink, fileDiv);

            // add an id so we know we already processed it
            treeLink.id = `${linkPrefix}${hash}`;

            fileCount++;
        }
    }

    const updateCommentCount = (treeLink, fileDiv) => {
        let commentCountElement = $(treeLink.querySelector(".comment-count"));
        if (commentCountElement.length === 0) {
            const container = $(treeLink.querySelector(".ActionList-item-visual--trailing"));
            if (container.length == 0) {
                return;
            }
            container.prepend('<span class="comment-count" title="comment count"></span>');
            commentCountElement = container.find(".comment-count");
        }

        const commentElements = fileDiv.querySelectorAll(".review-comment");
        commentCountElement.text(commentElements.length ? `${commentElements.length}` : "");
        if (commentElements.length > 0) {
            commentCountElement.prepend('<svg role="img" class="octicon Comment" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="margin-right: 1px;"><path fill-rule="evenodd" d="M2.75 2.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h2a.75.75 0 01.75.75v2.19l2.72-2.72a.75.75 0 01.53-.22h4.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25H2.75zM1 2.75C1 1.784 1.784 1 2.75 1h10.5c.966 0 1.75.784 1.75 1.75v7.5A1.75 1.75 0 0113.25 12H9.06l-2.573 2.573A1.457 1.457 0 014 13.543V12H2.75A1.75 1.75 0 011 10.25v-7.5z"></path></svg>');
        }
    }

    const handleViewedCheckboxChange = (fileDiv, viewedCheckbox, hash) => {
        initializeTrees();
        const link = window.document.getElementById(`link-${hash}`);
        const linkGitako = window.document.getElementById(`link-gitako-${hash}`);

        if (viewedCheckbox.checked) {
            removeClassName(link, UNVIEWED_CLASS);
            removeClassName(linkGitako, UNVIEWED_CLASS);
        }
        else {
            addClassName(link, UNVIEWED_CLASS);
            addClassName(linkGitako, UNVIEWED_CLASS);
        }
    }

    const attachToViewedCheckbox = (fileDiv, hash) => {
        const outerContainer = fileDiv?.querySelector(".flex-justify-end");
        const innerContainer = outerContainer?.querySelector(".js-replace-file-header-review");
        let viewedCheckbox = innerContainer?.querySelector("input.js-reviewed-checkbox");

        const handler = (event) => {
            viewedCheckbox = event.srcElement;
            if (event.srcElement.type != "checkbox") {
                viewedCheckbox = event.srcElement?.querySelector("input.js-reviewed-checkbox");
            }
            handleViewedCheckboxChange(fileDiv, viewedCheckbox, hash);
            attachToViewedCheckbox(fileDiv, hash);
        };

        attachEvent("change", outerContainer, handler);
        attachEvent("change", innerContainer, handler);
        attachEvent("change", viewedCheckbox, handler);

        handleViewedCheckboxChange(fileDiv, viewedCheckbox, hash); // update now just in case it changed on us

        return viewedCheckbox;
    }

    const attachEvent = (event, element, handler) => {
        if (!element) {
            return;
        }

        if (!element[ATTACHED_ATTRIBUTE]) {
            element.addEventListener(event, handler);
            element[ATTACHED_ATTRIBUTE] = "true";
        }
    }

    const addClassName = (element, className) => {
        if (element) {
            removeClassName(element, className);
            element.className = element.className + ` ${className}`;
        }
    }

    const removeClassName = (element, className) => {
        if (element) {
            element.className = element.className?.replace(className, "").trim();
        }
    }

    let _style = null;
    const verifyStyles = (recreate) => {
        if (_style && recreate) {
            _style.remove();
            _style = null;
        }

        if (!_style) {
            _style = document.createElement("style");
            _style.appendChild(document.createTextNode(""));
            document.head.appendChild(_style);

            _style.sheet.insertRule(".Layout-sidebar { resize: horizontal; }");
            if (getValue("ShowOnlySingleFile", true)) {
                _style.sheet.insertRule(".file { display: none; }");
            }
            _style.sheet.insertRule(".file-header { border-bottom: 1px solid var(--color-border-default) !important; }");
            _style.sheet.insertRule(".ActionList-content, .node-item-label span { opacity: 75%;}");
            _style.sheet.insertRule(`.${FILE_SHOW_CLASS} { display: block !important; }`);
            _style.sheet.insertRule(`.${UNVIEWED_CLASS}, .${UNVIEWED_CLASS} div span, .${UNVIEWED_CLASS} span { font-weight: bold; opacity: 100% !important; }`);
            _style.sheet.insertRule(`span.${COMMENT_COUNT_CLASS} { margin-right: 3px; white-space: nowrap; font-weight: normal !important; }`);
        }

        _style.sheet.disabled = !getValue("Enabled", true);
    }

    const getValue = (settingName, defaultValue) => {
        let value = !!window.GM_getValue ? GM_getValue(settingName) : undefined;

        if (value === undefined) {
            value = defaultValue;
            setValue(settingName, value);
        }

        return value;
    }

    const setValue = (settingName, newValue) => {
        if (window.GM_setValue) {
            window.GM_setValue(settingName, newValue);
        }
    }

    initialize();
})();

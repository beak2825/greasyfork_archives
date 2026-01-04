// ==UserScript==
// @name               GitHub镜像
// @name:en            GitHub Mirror
// @description        GitHub镜像，加速访问GitHub，支持Clone、Release、Raw、Zip加速。
// @description:en     GitHub mirror. Accelerate access to GitHub. Support Clone, Release, RAW and ZIP acceleration.
// @namespace          https://github.com/HaleShaw
// @version            1.4.0
// @author             HaleShaw
// @copyright          2021+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-GitHubMirror
// @supportURL         https://github.com/HaleShaw/TM-GitHubMirror/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://github.githubassets.com/favicon.ico
// @require            https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @include            *://github.com/*
// @compatible	       Chrome
// @run-at             document-end
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/422802/GitHub%E9%95%9C%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/422802/GitHub%E9%95%9C%E5%83%8F.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
    ("use strict");

    const style = `
        /* The menu container */
        .menuContainer {
            width: 600px;
        }

        .menuBlock {
            padding: 4px 0;
            color: #990000;
        }

        .menuLeftIcon{
            margin-right:5px;
        }

        .menuButtonLabel{
            margin-right: 2rem;
        }

        .menuButtonCheck{
            vertical-align: text-bottom;
            margin: 0 3px;
        }

        .SelectMenu-list {
            padding: 0 16px;
        }

        .SelectMenu-list > a.SelectMenu-item {
            padding-left: 0;
            padding-right: 0;
            margin-top: 4px;
        }

        .clone {
            padding-left: 3px 12px !important;
        }

        .Box-body.download-box {
            border-bottom: none;
            width: 100%;
            text-align: right;
            padding: unset;
        }

        .Box-body.download-box > a {
            font-size: 11px;
            margin: 0 3px;
            padding: 0 6px;
        }
    `;

    const mirrors = [
        {
            id: 0,
            name: "CnpmJS",
            url: "https://github.com.cnpmjs.org",
            description: "cnpmjs.org",
        },
        {
            id: 1,
            name: "FastGit",
            url: "https://hub.fastgit.org",
            description: "KevinZonda",
        },
        {
            id: 2,
            name: "FastGit",
            url: "https://download.fastgit.org",
            description: "KevinZonda",
        },
        {
            id: 3,
            name: "FastGit",
            url: "https://raw.fastgit.org",
            description: "KevinZonda",
        },
        {
            id: 4,
            name: "WuYanZheShui",
            url: "https://github.wuyanzheshui.workers.dev",
            description: "WuYanZheShui. Maximum of 100,000 calls per day",
        },
        {
            id: 5,
            name: "RC1844",
            url: "https://github.rc1844.workers.dev",
            description: "RC1844. Maximum of 100,000 calls per day",
        },
        {
            id: 6,
            name: "jsDelivr",
            url: "https://cdn.jsdelivr.net/gh",
            description: "The total file size of the current branch of the project cannot exceed 50MB",
        },
        {
            id: 7,
            name: "IAPK",
            url: "https://github.iapk.cc",
            description: "IAPK",
        },
        {
            id: 8,
            name: "Ecalose",
            url: "https://gh.haval.gq",
            description: "Ecalose. Maximum of 100,000 calls per day",
        },
        {
            id: 9,
            name: "IAPK",
            url: "https://iapk.cc/github?url=https://github.com",
            description: "IAPK",
        },
        {
            id: 10,
            name: "Statically",
            url: "https://cdn.staticaly.com/gh",
            description:
                "Only images and source code files are supported, and the file size is limited to 30MB",
        },
        {
            id: 11,
            name: "Github 原生",
            url: "ssh://git@ssh.github.com:443/",
            description: "Github 官方提供的 443 端口的 SSH，适用于限制访问 22 端口的网络环境",
        },
        {
            id: 12,
            name: "FastGit",
            url: "git@ssh.fastgit.org:",
            description: "FastGit 香港",
        },
    ];

    //添加对应索引即可使用
    const cloneSet = [0, 1, 4];
    const sshSet = [11, 12];
    const browseSet = [0, 1, 4, 5, 7, 8];
    const downloadSet = [2, 4, 5, 8, 9];
    const rawSet = [3, 4, 5, 6, 8, 9, 10];

    const messages = {
        en: {
            menuButton: {
                name: "CloneMirror",
                title: "Open List",
                header: "Quickly clone and Mirror sites",
                block:
                    "Please do not login in the mirror site. I will not be responsible for any loss caused by this.",
            },
        },
        zh: {
            menuButton: {
                name: "克隆与镜像",
                title: "打开列表",
                header: "快速克隆与镜像站点",
                block: "请不要在镜像网站登录账号，若因此造成任何损失本人概不负责",
            },
        },
    };

    const icons = {
        closeIcon: `
            <svg aria-label="Close menu" class="octicon octicon-x" width="16" height="16" role="img">
                <path fill-rule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"></path>
            </svg>`,
        copyIcon: `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon d-inline-block">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
            </svg>`,
        copiedIcon: `
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-inline-block d-sm-none">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>`,
    };

    const clonePrefix = "git clone ";
    const depthPrefix = "--depth=1 ";
    let message;
    let settingHtml;

    main();
    $(document).on("pjax:success", function () {
        $("#mirror-menu").remove();
        main();
    });

    function main() {
        GM_addStyle(style);
        logInfo(GM_info.script.name, GM_info.script.version);
        const prefix = getClonePrefix();
        addMenu(prefix);
        setTimeout(() => {
            addHttpsClone(prefix);
            addSSHClone(prefix);
            addRawList();
        }, 1000);
        if (isPC()) {
            addDownloadZip();
        }

        // The Release page loads element dynamically.
        const callback = (mutationsList, observer) => {
            if (location.pathname.indexOf("/releases") === -1) return;
            for (const mutation of mutationsList) {
                for (const target of mutation.addedNodes) {
                    if (target.nodeType !== 1) return;
                    if (
                        target.tagName === "DIV" &&
                        target.dataset.viewComponent === "true" &&
                        target.classList[0] === "Box"
                    )
                        addReleasesList();
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(document, { childList: true, subtree: true });
    }

    /**
     * Initialize setting.
     */
    function initSetting() {
        let lang = GM_getValue("lang");
        let clone = GM_getValue("clone");
        let depth = GM_getValue("depth");
        if (lang == undefined) {
            GM_setValue("lang", "zh");
        }
        if (clone == undefined) {
            GM_setValue("clone", true);
        }
        if (depth == undefined) {
            GM_setValue("depth", true);
        }
    }

    function addMenu(prefix) {
        initSetting();
        message = getMessage(true, true);
        settingHtml = getSettingHtml();
        let menuButtonHtml =
            getMenuButtonPrefix() + getCloneList(prefix) + getBrowseList() + getMenuButtonSuffix();
        $("div.d-flex.flex-wrap.flex-items-center.wb-break-word.f3.text-normal").append(menuButtonHtml);
    }

    function getMenuButtonPrefix() {
        return `
        <details class="details-reset details-overlay mr-0 mb-0" id="mirror-menu">
            <summary class="btn ml-2 btn-primary" id="menuButtonTitle" data-hotkey="m" title="${message.menuButton.title}" aria-haspopup="menu" role="button">
                <span class="css-truncate-target" id="menuButtonName" data-menu-button="">${message.menuButton.name}</span>
                <span class="dropdown-caret"></span>
            </summary>

            <details-menu class="SelectMenu SelectMenu--hasFilter" role="menu">
                <div class="SelectMenu-modal menuContainer">
                    <header class="SelectMenu-header">
                        <span class="SelectMenu-title" id="menuButtonHeader">${message.menuButton.header}</span>
                        ${settingHtml}
                        <button class="SelectMenu-closeButton" type="button" data-toggle-for="mirror-menu">
                        ${icons.closeIcon}
                        </button>
                    </header>
                    <tab-container class="d-flex flex-column js-branches-tags-tabs" style="min-height: 0;">
                        <div role="tabpanel" class="d-flex flex-column flex-auto" tabindex="0">
                            <div class="btn-block flash-error menuBlock" id="menuButtonBlock" role="alert">
                                ${message.menuButton.block}
                            </div>
                            <div class="SelectMenu-list" data-filter-list="">`;
    }

    function getSettingHtml() {
        const clone = GM_getValue("clone");
        const depth = GM_getValue("depth");
        const lang = GM_getValue("lang");
        const cloneStatus = clone && clone != "undefined" ? " checked" : "";
        const depthStatus = depth && depth != "undefined" ? " checked" : "";
        const langStatus = lang == "en" ? " checked" : "";
        return `
                <label class="menuButtonLabel"><input id="menuButtonClone" class="menuButtonCheck" type="checkbox"${cloneStatus}>Clone</input></label>
                <label class="menuButtonLabel"><input id="menuButtonDepth" class="menuButtonCheck" type="checkbox"${depthStatus}>Depth</input></label>
                <label class="menuButtonLabel"><input id="menuButtonLang" class="menuButtonCheck" type="checkbox"${langStatus}>English</input></label>
            `;
    }

    /**
     * Clone Checkbox event.
     */
    $("#menuButtonClone").change(function () {
        const status = $("#menuButtonClone").is(":checked");
        GM_setValue("clone", status);
        if (!status) {
            document.getElementById("menuButtonDepth").checked = false;
            depthChanged(status);
        }
        cloneChanged(status);
    });

    /**
     * Depth Checkbox event.
     */
    $("#menuButtonDepth").change(function () {
        const status = $("#menuButtonDepth").is(":checked");
        depthChanged(status);
        console.log(status);
        let cloneStatus = $("#menuButtonClone").is(":checked");
        if (status && !cloneStatus) {
            cloneStatus = true;
            document.getElementById("menuButtonClone").checked = true;
            GM_setValue("clone", cloneStatus);
            cloneChanged(cloneStatus);
        }
    });

    /**
     * Language Checkbox event.
     */
    $("#menuButtonLang").change(function () {
        const status = $("#menuButtonLang").is(":checked");
        const value = status ? "en" : "zh";
        GM_setValue("lang", value);
        message = getMessage();
        updateMessage();
    });

    function cloneChanged(status) {
        const inputs = $("input.clone");
        for (let i = 0; i < inputs.length; i++) {
            let value = inputs[i].value;
            if (status) {
                value = clonePrefix + value;
            } else {
                value = value.replace(clonePrefix, "");
            }
            inputs[i].value = value;
            $(inputs[i]).next().children().attr("value", value);
        }
    }

    function depthChanged(status) {
        GM_setValue("depth", status);
        const inputs = $(".form-control.input-monospace.input-sm.clone");
        const index = clonePrefix.length;
        for (let i = 0; i < inputs.length; i++) {
            let value = inputs[i].value;
            if (status) {
                const length = value.length;
                if (value.startsWith(clonePrefix)) {
                    value = value.slice(0, index) + depthPrefix + value.slice(index, length);
                } else {
                    value = depthPrefix + value;
                }
            } else {
                value = value.replace(depthPrefix, "");
            }
            inputs[i].value = value;
            $(inputs[i]).next().children().attr("value", value);
        }
    }

    /**
     * Update message by target language.
     */
    function updateMessage() {
        $("#menuButtonTitle").attr("title", message.menuButton.title);
        $("#menuButtonName").html(message.menuButton.name);
        $("#menuButtonHeader").html(message.menuButton.header);
        $("#menuButtonBlock").html(message.menuButton.block);
    }

    function addHttpsClone(prefix) {
        let httpsGroup = document.querySelector('[role="tabpanel"]:nth-child(2) div.input-group');
        if (!httpsGroup) {
            return;
        }
        let inputs = httpsGroup.querySelectorAll("input.clone");
        if (inputs.length > 0) {
            return;
        }
        updateDefaultClone(prefix, httpsGroup);
        httpsGroup.insertAdjacentHTML("afterend", getCloneList(prefix));
    }

    /**
     * Get the clone list.
     */
    function getCloneList(prefix) {
        const href = window.location.href.split("/");
        const git = href[3] + "/" + href[4] + ".git";
        let menuButtonHtml = "";
        cloneSet.forEach(id => {
            menuButtonHtml += getCloneHtml(prefix + mirrors[id]["url"] + "/" + git, mirrors[id]["name"]);
        });
        return menuButtonHtml;
    }

    function updateDefaultClone(prefix, parent) {
        let input = parent.querySelector("input");
        gitStr = input.value;
        gitNew = prefix + gitStr;
        let button = parent.querySelector("clipboard-copy");
        input.setAttribute("value", gitNew);
        input.setAttribute("aria-label", gitNew);
        input.className += " clone";
        button.setAttribute("value", gitNew);
    }

    function getMenuButtonSuffix() {
        return `</div></div></tab-container></div></details-menu></details>`;
    }

    function addSSHClone(prefix) {
        let sshGroup = document.querySelector('[role="tabpanel"]:nth-child(3) div.input-group');
        if (!sshGroup) {
            return;
        }

        let inputs = sshGroup.querySelectorAll("input.clone");
        if (inputs.length > 0) {
            return;
        }

        let defaultSsh = sshGroup.firstElementChild;
        const sshStr = defaultSsh.value;
        let hrefSplit = sshStr.split(":");
        let groupHtml = "";

        if (hrefSplit[0] != "git@github.com") {
            return;
        }
        defaultSsh.value = prefix + sshStr;
        defaultSsh.setAttribute("aria-label", prefix + sshStr);
        defaultSsh.className += " clone";

        let button = sshGroup.querySelector("clipboard-copy");
        button.setAttribute("value", prefix + sshStr);

        sshSet.forEach(id => {
            groupHtml += getCloneHtml(prefix + mirrors[id]["url"] + hrefSplit[1], mirrors[id]["name"]);
        });
        sshGroup.insertAdjacentHTML("afterend", groupHtml);
    }

    /**
     * Get the clone command prefix.
     */
    function getClonePrefix() {
        let prefix = "";
        let clone = GM_getValue("clone");
        let depth = GM_getValue("depth");
        if (clone) {
            prefix += "git clone ";
        }
        if (depth) {
            prefix += "--depth=1 ";
        }
        return prefix;
    }

    /**
     * Get the clone button html string.
     * @param {String} url url.
     * @param {tip} tip tip.
     */
    function getCloneHtml(url, tip) {
        return `
            <div class="input-group" style="margin-top: 4px;" title="${tip}">
                <input type="text" class="clone form-control input-monospace input-sm color-bg-subtle" data-autoselect="" value="${url}" aria-label="${url}" readonly="">
                <div class="input-group-button">
                    <clipboard-copy value="${url}" class="btn btn-sm js-clipboard-copy tooltipped-no-delay ClipboardButton" tabindex="0" role="button">
                        ${icons.copyIcon}${icons.copiedIcon}
                    </clipboard-copy>
                </div>
            </div>`;
    }

    /**
     * Get the browse list.
     */
    function getBrowseList() {
        let menuButtonHtml = ``;
        const href = window.location.href.split("/");
        const path = window.location.pathname;
        browseSet.forEach(id => {
            menuButtonHtml += getBrowseHtml(
                mirrors[id]["url"] + path,
                mirrors[id]["name"],
                mirrors[id]["description"]
            );
        });
        if (href.length == 5 || path.includes("/tree/") || path.includes("/blob/")) {
            var html = mirrors[5]["url"] + path.replace("/tree/", "@").replace("/blob/", "@");
            if (!path.includes("/blob/")) {
                html += "/";
            }
            menuButtonHtml += getBrowseHtml(html, mirrors[5]["name"], mirrors[5]["description"]);
        }
        if (location.hostname != "github.com") {
            menuButtonHtml += getBrowseHtml(`https://github.com${path}`, "返回GitHub");
        }
        return menuButtonHtml;
    }

    /**
     * Get browse html string.
     * @param {String} url url.
     * @param {String} name name.
     * @param {String} tip tip.
     * @returns
     */
    function getBrowseHtml(url, name, tip = "") {
        return `
        <a class="SelectMenu-item" href="${url}" target="_blank" title="${tip}" role="menuitemradio" aria-checked="false" rel="nofollow">
            <span class="css-truncate css-truncate-overflow" style="width: 520px; overflow: hidden; word-break:keep-all; white-space:nowrap; text-overflow:ellipsis;">${url}</span>
            <span class="css-truncate css-truncate-overflow" style="width: 80px; text-align: right;">${name}</span>
        </a>`;
    }

    /**
     * Add Release list.
     */
    function addReleasesList() {
        $(".Box--condensed")
            .find("[href]")
            .each(function () {
                if ($(this).parent().parent().find(".download-box").length == 0) {
                    const href = $(this).attr("href");
                    $(this)
                        .parent()
                        .after(`<div class="Box-body download-box" >` + getReleaseDownloadHtml(href) + `</div>`);
                    $(this).parent().removeClass("Box-body");
                }
            });
    }

    /**
     * Get Release download button html string.
     * @param {String} href href.
     * @returns html.
     */
    function getReleaseDownloadHtml(href) {
        let html = "";
        downloadSet.forEach(id => {
            html += `<a class="flex-1 btn btn-outline get-repo-btn" rel="nofollow" href="${mirrors[id]["url"] + href
                }" title="${mirrors[id]["description"]}">${mirrors[id]["name"]}</a>`;
        });
        return html;
    }

    /**
     * Add download zip button.
     */
    function addDownloadZip() {
        $("a[data-open-app='link']").each(function () {
            var li = $(`<li class="Box-row p-0"></li>`);
            const downloadHref = $(this).attr("href");
            var aElement = $(this)
                .clone()
                .removeAttr("data-hydro-click data-hydro-click-hmac data-ga-click");
            aElement.addClass("Box-row Box-row--hover-gray");
            downloadSet.forEach(id => {
                let tempA = aElement.clone();
                tempA.attr({
                    href: mirrors[id]["url"] + downloadHref,
                    title: mirrors[id]["description"],
                });
                tempA.html(tempA.html().replace("Download ZIP", `Download ZIP(${mirrors[id]["name"]})`));
                li = li.clone().append(tempA);
            });
            $(this).parent().after(li);
        });
    }

    /**
     * Add Raw list.
     */
    function addRawList() {
        let rawButton = $('#raw-url, a[data-testid="raw-button"]');
        if (rawButton.length == 0) {
            return;
        }
        const href = rawButton.attr("href");
        rawSet.forEach(id => {
            if (id == 3 || id == 10) {
                addRawButton(id, mirrors[id]["url"] + href.replace("/raw", ""), rawButton);
            } else if (id == 6) {
                addRawButton(id, mirrors[id]["url"] + href.replace("/raw/", "@"), rawButton);
            } else {
                addRawButton(id, mirrors[id]["url"] + href, rawButton);
            }
        });
    }

    /**
     * Add the Raw Button.
     * @param {Number} id id of mirrors.
     * @param {String} url url.
     * @param {Object} rawButton the raw button.
     */
    function addRawButton(id, url, rawButton) {
        var span = rawButton.clone().removeAttr("id");
        span.attr({
            href: url,
            title: mirrors[id]["description"],
            target: "_blank",
        });
        span.text(mirrors[id]["name"]);
        rawButton.before(span);
    }

    /**
     * Get message by setting.
     */
    function getMessage() {
        return "zh" == GM_getValue("lang") ? messages.zh : messages.en;
    }

    /**
     * Log the title and version at the front of the console.
     * @param {String} title title.
     * @param {String} version script version.
     */
    function logInfo(title, version) {
        const titleStyle = "color:white;background-color:#606060";
        const versionStyle = "color:white;background-color:#1475b2";
        const logTitle = " " + title + " ";
        const logVersion = " " + version + " ";
        console.log("%c" + logTitle + "%c" + logVersion, titleStyle, versionStyle);
    }

    /**
     * Check if the visitor is PC.
     */
    function isPC() {
        var userAgentInfo = navigator.userAgent;
        var agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
        var isPC = true;
        const len = agents.length;
        for (var v = 0; v < len; v++) {
            if (userAgentInfo.indexOf(agents[v]) > 0) {
                isPC = false;
                break;
            }
        }
        return isPC;
    }
})();

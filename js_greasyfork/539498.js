// ==UserScript==
// @name         loli commons
// @namespace    neneko
// @author       neneko
// @version      0.4.0-rc1
// @description  lc
// @license      MIT
// @match        https://bgm.tv/user/*
// @match        https://bangumi.tv/user/*
// @match        https://chii.in/user/*
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @match        https://bgm.tv/character/*
// @match        https://bangumi.tv/character/*
// @match        https://chii.in/character/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539498/loli%20commons.user.js
// @updateURL https://update.greasyfork.org/scripts/539498/loli%20commons.meta.js
// ==/UserScript==

const apiEndpoints = ["https://loliconey.tsuki.ga/api", "https://lc-coney.deno.dev/api"];
const website = "https://lolicommons.tsuki.ga";
const lcMeta = {
    "未授权": {
        title: "もう、这个萝莉控还没有登录",
        badge: "https://p.sda1.dev/21/142d40ab479c1112be10de8e613b2324/unauthed.png"
    },
    "LC0": {
        title: "这个萝莉控喜欢与萝莉纯洁地贴贴",
        badge: "https://p.sda1.dev/21/f88f13129f92563422e9d21e95ef7835/LC0.png"
    },
    "LC ES": {
        title: "这个萝莉控喜欢与萝莉进行充满爱的瑟瑟",
        badge: "https://p.sda1.dev/21/ed74346722132b1085a483c3f502e1c4/LC%20ES.png"
    },
    "LC ES-PG": {
        title: "这个萝莉控喜欢与萝莉进行充满爱的瑟瑟，并且觉得西瓜肚也不错",
        badge: "https://p.sda1.dev/21/c2540a818081a5cb74d156245986e92a/LC%20ES-PG.png"
    },
    "LC ES-NC": {
        title: "没有什么能阻止这个萝莉控跟萝莉瑟瑟",
        badge: "https://p.sda1.dev/21/ed24ed3065bda06f2e844d1dde3eaff2/LC%20ES-NC.png"
    },
    "LC ES-NC-PG": {
        title: "没有什么能阻止这个萝莉控跟萝莉瑟瑟，这个萝莉控觉得西瓜肚也不错",
        badge: "https://p.sda1.dev/21/f772714d5d6c08d49f61b36859f08b5e/LC%20ES-NC-PG.png"
    },
    "LC ES-NC-GR": {
        title: "这个萝莉控享受用███把萝莉█████，然后再█████",
        badge: "https://p.sda1.dev/21/bb569c8f69ea87d9b8baef3b9b0ee759/LC%20ES-NC-GR.png"
    },
    "LC ES-NC-PG-GR": {
        title: "这个萝莉控享受用███把萝莉█████，然后再█████，并且觉得西瓜肚也不错",
        badge: "https://p.sda1.dev/21/1cd9ac56dab221d598da4e04ecb9f8a7/LC%20ES-NC-PG-GR.png"
    },

    "LC YJ": {
        title: "这个萝莉控喜欢跟萝莉和幼女纯洁地贴贴",
        badge: "https://p.sda1.dev/21/e281ac18ce82eeec04e9b30d5add07b8/LC%20YJ.png"
    },
    "LC YJ-ES": {
        title: "这个萝莉控喜欢与萝莉和幼女进行充满爱的瑟瑟",
        badge: "https://p.sda1.dev/21/90ea2075af7eb7500516302db94e175f/LC%20YJ-ES.png"
    },
    "LC YJ-ES-PG": {
        title: "这个萝莉控喜欢与萝莉和幼女进行充满爱的瑟瑟，并且觉得西瓜肚也不错",
        badge: "https://p.sda1.dev/21/75f7abe850e7fbfcb20ffa5023ad8270/LC%20YJ-ES-PG.png"
    },
    "LC YJ-ES-NC": {
        title: "没有什么能阻止这个萝莉控跟萝莉和幼女瑟瑟",
        badge: "https://p.sda1.dev/21/17439c452b8585cf6f71c7c0b3ea8f72/LC%20YJ-ES-NC.png"
    },
    "LC YJ-ES-NC-PG": {
        title: "没有什么能阻止这个萝莉控跟萝莉和幼女瑟瑟，这个萝莉控觉得西瓜肚也不错",
        badge: "https://p.sda1.dev/21/f96693b35febba60849744fe1ee687ca/LC%20YJ-ES-NC-PG.png"
    },
    "LC YJ-ES-NC-GR": {
        title: "这个萝莉控享受用███把萝莉和幼女█████，然后再█████",
        badge: "https://p.sda1.dev/21/cb5735abc775c65144fbd4f7ec4152ec/LC%20YJ-ES-NC-GR.png"
    },
    "LC YJ-ES-NC-PG-GR": {
        title: "这个萝莉控享受用███把萝莉和幼女█████，然后再█████，并且觉得西瓜肚也不错",
        badge: "https://p.sda1.dev/21/7218e93778da5faeb2fe04a72c95bf94/LC%20YJ-ES-NC-PG-GR.png"
    },
};
const privacyValues = {
    "private": "仅自己",
    "friend": "我加的萝莉控好友",
    "public": "所有 LC 用户",
};

async function main() {
    const pathname = window.location.pathname;
    if (pathname.startsWith("/user/")) {
        if (pathname.split("/").length !== 3) {
            return; // /user/[username]/something_else
        }
        userHome(pathname.split("/").pop());
    } else if (pathname === "/") {
        await frontPage();
    } else if (pathname.startsWith("/character/")) {
        if (pathname.split("/").length !== 3) {
            return; // /character/[cid]/something_else
        }
        characterPage(pathname.split("/").pop());
    }
}

async function userHome(username) {
    placeholder();
    const isSelfHomepage = $("#headerProfile div.actions > a").map((_, a) => $(a).attr("href")).get().includes("/settings");
    const session = getSession({ newSession: isSelfHomepage });
    const values = { badge: "未授权", privacy: "private", sd: "", subPrivacy: "private" };
    let userInfoDB = null;
    if (session) {
        userInfoDB = getUserInfoDB();
        const info = await userInfoDB.getOrFetch(username, async () => await lcClient.fetchInfo(session, username));
        if (info) {
            Object.assign(values, info);
        }
    }
    if (isSelfHomepage) {
        homeBadge(values.badge);
        if (values.badge !== "未授权") {
            const storeUserInfo = (v) => userInfoDB.get(username).then(info => userInfoDB.set(username, { ...info, ...v }));
            settings(session, values, storeUserInfo);
            kanban(session, values.sd, values, values.badge, storeUserInfo);
            maintenance(session, values.badge, userInfoDB);
        }
    } else {
        const badge = values.badge !== "未授权" ? values.badge : null;
        if (badge) {
            homeBadge(badge);
        }
        let selfBadge = null;
        if (session) {
            const cache = await maintenance(session, null, userInfoDB);
            selfBadge = cache.selfBadge;
        }
        if (values.sd !== "" && selfBadge) {
            kanban(session, values.sd, { badge }, selfBadge, () => { });
        }
    }
}

function placeholder() {
    $("head").append(`<style>
        #lc-container {
            margin: 1em 0 0.5em auto;
            width: 149.33px;
            height: 37px;
            position: relative;
        }
    </style>`);

    const containerHTML = `
        <div id="lc-container">
        </div>
    `;
    const bioEl = $("#user_home div.bio");
    if (bioEl.length > 0) {
        bioEl.append(containerHTML);
    } else {
        $("#user_home .network_service").append(containerHTML);
    }
}

function homeBadge(badgeVal) {
    const meta = lcMeta[badgeVal];
    $("head").append(`<style>
        :root {
            --lc-badge-theme: 240, 145, 153;
        }

        #lc-badge {
            opacity: 0;
            margin-top: 6px;
            height: 32px;
            box-shadow: 0 2px 4px rgba(var(--lc-badge-theme), 0.12),
                        0 4px 8px rgba(var(--lc-badge-theme), 0.08),
                        0 6px 12px rgba(var(--lc-badge-theme), 0.05);
            transition: opacity 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            border-radius: 0.25rem;
        }
        #lc-badge:hover {
            /* elevated plastic film */
            opacity: 0.88;
            box-shadow: 0 4px 6px rgba(var(--lc-badge-theme), 0.25),
                        0 8px 10px rgba(var(--lc-badge-theme), 0.2),
                        0 12px 16px rgba(var(--lc-badge-theme), 0.15);
        }
        html[data-theme="dark"] #lc-badge {
            filter: brightness(0.85);
            transition: filter 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        }
        html[data-theme="dark"] #lc-badge:hover {
            /* glowing neon */
            filter: brightness(1);
            box-shadow: 0 0 6px rgba(var(--lc-badge-theme), 0.35),
                        0 0 12px rgba(var(--lc-badge-theme), 0.25),
                        0 0 18px rgba(var(--lc-badge-theme), 0.20);
        }

        #lc-tooltip {
            position: absolute;
            bottom: 36px;
            width: 133px;
            color: #AB515D;
            background: url("/img/ukagaka/balloon_pink.png") no-repeat top center / 100% 600%;
            border-bottom: 1px solid #AB515D66;
            word-break: break-all;
            padding: 0.3rem 0.5rem;
            border-radius: 0.25rem;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            z-index: 1000;
        }
        #lc-badge:hover ~ #lc-tooltip {
            opacity: 0.9;
        }
    </style>`);

    const containerContentHTML = `
        <img src="${meta.badge}" alt="Loli Commons license" id="lc-badge" onload="this.style.opacity=1" />
        <div id="lc-tooltip">${meta.title}</div>
    `;
    $("#lc-container").append(containerContentHTML);

    const $badge = $('#lc-badge');
    if (badgeVal === "未授权") {
        $("head").append(`<style>
            #lc-badge {
                cursor: pointer;
            }
        </style>`);
        $badge.click(function () {
            window.location.href = `${apiEndpoints[0]}/v1/oauth/request`;
        });
    }
}

function setBadge(badge) {
    const meta = lcMeta[badge];
    $("#lc-badge").attr("src", meta.badge);
    $("#lc-tooltip").text(meta.title);
}

function settings(session, { badge, privacy }, storeUserInfo) {
    const badgeOptions = Object.keys(lcMeta).filter((key) => key !== "未授权").map((key) => `<option value="${key}" ${key === badge ? "selected" : ""}>${key}</option>`).join("");
    const privacyOptions = Object.entries(privacyValues).map(([key, value]) => `<option value="${key}" ${key === privacy ? "selected" : ""}>${value}</option>`).join("");
    $("head").append(`<style>
        #lc-badge {
            cursor: pointer;
        }

        #lc-settings {
            position: absolute;
            left: -3rem;
            opacity: 0;
            transform: scale(0.8);
            pointer-events: none;
            transition: opacity 0.3s ease-in-out, transform 0.2s ease-in-out;
            background-color: white;
            padding: 0.7rem;
            border-radius: 0.5rem;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.10),
                        0 8px 16px rgba(0, 0, 0, 0.08),
                        0 4px 8px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(0, 0, 0, 0.12);
            z-index: 1000;
        }
        html[data-theme="dark"] #lc-settings {
            background-color: #444;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }

        #lc-settings {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: 218px;
        }
        .lc-settings-section {
            display: flex;
            flex-direction: row;
            gap: 0.5rem;
            align-items: center;
        }
        .lc-settings-select {
            flex-grow: 1;
            padding: 0.25rem;
            border-radius: 0.25rem;
            border: 1px solid rgba(0, 0, 0, 0.12);
        }
        .lc-settings-select:focus {
            outline: none;
        }
        .lc-settings-label {
            flex-basis: 3rem;
            text-align: right;
        }
        .lc-settings-label a {
            font-size: 1.1em;
            color: #0084b4;
            border: 1px solid #0084b4;
            border-radius: 100%;
            padding: 0 0.42em;
            margin-right: 0.2em;
        }
        #lc-btn-quit-settings {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            border: 1px solid rgba(0, 0, 0, 0.12);
            cursor: pointer;
            background-color: #f0f0f0;
        }
        html[data-theme="dark"] #lc-btn-quit-settings {
            background-color: #333;
        }
    </style>`);
    $("#lc-container").append(`
        <div id="lc-settings">
            <div class="lc-settings-section">
                <label for="lc-badge-selector" class="lc-settings-label">
                    <a href="${website}/post/license" target="_blank" title="了解萝莉共享协议">?</a>徽章
                </label>
                <select id="lc-badge-selector" class="lc-settings-select">
                    ${badgeOptions}
                </select>
            </div>
            <div class="lc-settings-section">
                <label for="lc-privacy-selector" class="lc-settings-label">可见范围</label>
                <select id="lc-privacy-selector" class="lc-settings-select">
                    ${privacyOptions}
                </select>
            </div>
            <div class="lc-settings-section">
                <div style="flex-grow: 1;"></div>
                <button id="lc-btn-quit-settings">好了</button>
            </div>
        </div>
    `);

    const $badge = $("#lc-badge");
    const $settings = $("#lc-settings");
    let isSettingsOpen = false;
    $badge.click(function () {
        isSettingsOpen = !isSettingsOpen;
        $settings.css("opacity", isSettingsOpen ? 1 : 0);
        $settings.css("transform", isSettingsOpen ? "scale(1)" : "scale(0.8)");
        $settings.css("pointer-events", isSettingsOpen ? "auto" : "none");
    });
    $("#lc-badge-selector").change(function () {
        badge = $(this).val();
        setBadge(badge);
    });
    $("#lc-privacy-selector").change(function () {
        privacy = $(this).val();
    });
    $("#lc-btn-quit-settings").click(function () {
        $badge.click();
        lcClient.postSettings(session, { badge, privacy });
        storeUserInfo({ badge, privacy });
    });
}

function kanban(session, sd, { subPrivacy, badge }, selfBadge, storeUserInfo) {
    const subPrivacyOptions = Object.entries(privacyValues).map(([key, value]) => `<option value="${key}" ${key === subPrivacy ? "selected" : ""}>${value}</option>`).join("");
    const schrodinger = badge ? "-" : "+";
    const pos = {
        "-": "top:-95px;left:65px;width:85px;",
        "+": "top:-43px;left:60px;width:80px;",
    }[schrodinger];
    $("head").append(`<style>
        #lc-kanban {
            position: relative;
            ${pos}
            cursor: pointer;
        }
        html[data-theme="dark"] #lc-kanban {
            filter: brightness(0.92);
        }
        #lc-details-panel {
            position: absolute;
            z-index: 1;
            top: -3.5rem;
            right: 5.5rem;
            max-width: 20rem;
            width: max-content;
            height: max-content;
            font-size: 1.1em;
            background-color: white;
            padding: 1rem;
            border-radius: 0.5rem;
            border: 1px solid rgb(0 0 0 / 0.1);
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        }
        html[data-theme="dark"] #lc-details-panel {
            background-color: #2d2e2f;
            border: 2px solid #555;
        }
        #lc-details-panel.open {
            opacity: 1;
            pointer-events: auto;
        }
        #lc-details-panel-close-button {
            position: absolute;
            top: -0.5rem;
            right: -0.5rem;
            border: none;
            border-radius: 100%;
            font-size: 1.2rem;
            line-height: 0.7rem;
            padding: 5px;
            cursor: pointer;
        }
        #lc-details-settings {
            display: flex;
            flex-direction: column;
            align-items: end;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        #lc-details-settings a {
            color: #0084b4;
            border: 1px solid #0084b4;
            border-radius: 100%;
            padding: 0 0.42em;
            margin-right: 0.2em;
        }
        .lc-settings-button {
            width: max-content;
            font-size: inherit;
            padding: 0.2rem 0.5rem;
            border: 1px solid rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            background-color: #f0f0f0;
            cursor: pointer;
        }
        .lc-settings-button:hover {
            opacity: 0.8;
        }
        html[data-theme="dark"] .lc-settings-button {
            background-color: #444;
        }
        #lc-details-settings-submit-button {
            opacity: 0;
            pointer-events: none;
        }
        #lc-details-report {
            display: inline-block;
            float: right;
            position: relative;
            top: 0.5rem;
            font-size: 0.8em;
            color: #aaa;
        }
        #lc-sd-editor-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 100;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        }
        #lc-sd-editor-loader {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -25px;
            margin-left: -25px;
            width: 50px;
            height: 50px;
            border: 5px solid rgba(243, 243, 243, 0.5);
            border-top-color: #f09199;
            border-radius: 50%;
            animation: lc-sd-editor-spin 1s linear infinite;
        }
        @keyframes lc-sd-editor-spin {
            to {
                transform: rotate(360deg);
            }
        }
        #lc-sd-editor-overlay.open {
            opacity: 1;
            pointer-events: auto;
        }
        #lc-sd-editor-iframe {
            position: relative;
            width: 80vw;
            height: 90vh;
            max-width: 1200px;
            border: none;
            border-radius: 0.5rem;
        }
        @media (max-width: 1200px) {
            #lc-sd-editor-iframe {
                width: 95vw;
                height: 95vh;
            }
        }
        #lc-sd-warning {
            position: absolute;
            bottom: 2rem;
            left: 1px;
            width: 9.5rem;
            display: flex;
            flex-direction: column;
            align-items: end;
            pointer-events: none;
        }
        #lc-sd-warning-statement {
            border-radius: 0.5rem;
            padding: 0.5rem;
            margin-right: 0.5em;
            background: white;
            border: 1px solid #e8e8e8;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        }
        html[data-theme="dark"] #lc-sd-warning-statement {
            background: #2d2e2f;
            border: 1px solid #555;
        }
        #lc-sd-warning-statement.show {
            opacity: 1;
            pointer-events: auto;
        }
        #lc-sd-warning-icon {
            font-size: 1.2rem;
            font-weight: bold;
            font-family: cursive;
            color: #f09199;
            pointer-events: auto;
            cursor: pointer;
        }
    </style>`);

    const detailsSettingsHTML = `
        <div id="lc-details-settings">
            <div>
                <a href="${website}/post/sd" target="_blank" title="了解少女纸箱">?</a>
                <button id="lc-details-sd-edit-button" class="lc-settings-button">揉捏少女纸箱</button>
            </div>
            <div id="lc-details-settings-subPrivacy">
                <button id="lc-details-settings-submit-button" class="lc-settings-button">保存</button>
                <label for="lc-subPrivacy-selector" class="lc-settings-label">可见范围</label>
                <select id="lc-subPrivacy-selector" class="lc-settings-select" style="font-size: inherit;">
                    ${subPrivacyOptions}
                </select>
            <div/>
        </div>
    `;
    function openSDEditor() {
        const _userhome = encodeURIComponent(window.location.host + window.location.pathname);
        const _badge = encodeURIComponent(badge);
        const _sd = encodeURIComponent(sd);
        const editorUrl = `${website}/lab/sd?userhome=${_userhome}&badge=${_badge}&sd=${_sd}`;

        const overlayHTML = `
            <div id="lc-sd-editor-overlay">
                <div id="lc-sd-editor-loader"></div>
                <iframe id="lc-sd-editor-iframe" src="${editorUrl}" style="opacity: 0; transition: opacity 0.4s ease-in-out 0.2s;" onload="this.style.opacity = 1;"></iframe>
            </div>
        `;
        $('body').append(overlayHTML);
        const overlay = $('#lc-sd-editor-overlay');
        overlay.click(closeSDEditor);
        setTimeout(() => overlay.addClass('open'), 10);
    }
    function closeSDEditor() {
        const overlay = $('#lc-sd-editor-overlay');
        overlay.removeClass('open');
        setTimeout(() => overlay.remove(), 300);
    }
    const detailsReportAbuseHTML = `
        <a href="/pm/compose/847831.chii" target="_blank" id="lc-details-report">报告疑虑</a>
    `;
    const detailsPanelHTML = `
        <div id="lc-details-panel">
            <button id="lc-details-panel-close-button">×</button>
            <div id="lc-details-panel-sd"></div>
            ${subPrivacy ? detailsSettingsHTML : detailsReportAbuseHTML}
        </div>
    `;
    let sdHTML = "";
    function openDetailsPanel() {
        $("#lc-details-panel").addClass("open");
        if (sdHTML === "" && sd !== "") {
            sdHTML = sdRender(sd);
        }
        $("#lc-details-panel-sd").html(sdHTML);
    }
    function closeDetailsPanel() {
        $("#lc-details-panel").removeClass("open");
        resetMP();
    }

    const resourceBase = apiEndpoints[0].slice(0, -4);
    const kanbanHTML = `
    <video autoplay loop muted playsinline id="lc-kanban"></video>
    `;
    function loadMP() {
        const ua = navigator.userAgent;
        const isSafari = /Safari\/\d+/i.test(ua) && !/Chrome|Chromium/i.test(ua);
        const src = `${resourceBase}/resource/sds${schrodinger}.${isSafari ? "mov" : "webm"}`;
        const $kanban = document.getElementById("lc-kanban");
        $kanban.appendChild(Object.assign(document.createElement("source"), { src }));
        $kanban.load();
    }

    $lcContainer = $("#lc-container");
    $lcContainer.append(kanbanHTML);
    loadMP();
    $lcContainer.append(detailsPanelHTML);
    $("#lc-details-panel-close-button").click(closeDetailsPanel);
    const { resetMP, setComplete } = iteractiveMP(document.getElementById("lc-kanban"), openDetailsPanel);
    if (subPrivacy) {
        $("#lc-details-sd-edit-button").click(openSDEditor);
        $("#lc-subPrivacy-selector").change(function () {
            subPrivacy = $(this).val();
            $("#lc-details-settings-submit-button").css("opacity", "1");
            $("#lc-details-settings-submit-button").css("pointer-events", "auto");
        });
        $("#lc-details-settings-submit-button").click(function () {
            lcClient.postSettings(session, { subPrivacy });
            storeUserInfo({ subPrivacy });
            closeDetailsPanel();
        });

        if (!window.lcSDEditorListenerAttached) {
            window.addEventListener('message', (event) => {
                if (event.origin !== new URL(website).origin) return;
                const { type, payload } = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
                if (type !== 'lc-sd-update') return;

                const sdCandidate = payload.sd;
                closeSDEditor();

                if (sdCandidate === undefined || sdCandidate === sd) return;

                lcClient.postSettings(session, { sd: sdCandidate }).then(({ sd: sdFinal }) => {
                    storeUserInfo({ sd: sdFinal });
                    sd = sdFinal;
                    sdHTML = "";
                    setComplete();
                    openDetailsPanel();
                });
            });
            window.lcSDEditorListenerAttached = true;
        }
    }

    let warningStatement = "";
    if (selfBadge !== "LC YJ-ES-NC-PG-GR") {
        if (!badge) {
            warningStatement = "这个萝莉控没有向你展示 LC 许可协议，所以其 XP 容忍范围是未知的，纸箱里可能含有超出你 LC 许可协议的内容。";
        } else if (!testLicenseCompatibility(badge, selfBadge)) {
            warningStatement = "根据对方的 LC 许可协议，纸箱里可能含有超出你 LC 许可协议的内容。";
        }
    }
    if (warningStatement) {
        const warningStatementHTML = `
            <div id="lc-sd-warning">
                <div id="lc-sd-warning-statement">${warningStatement}</div>
                <div id="lc-sd-warning-icon">?</div>
            </div>
        `;
        $lcContainer.append(warningStatementHTML);
        const $warningIcon = $("#lc-sd-warning-icon");
        const $warningStatement = $("#lc-sd-warning-statement");
        $warningIcon.on('pointerenter', function (e) { if (e.originalEvent.pointerType === 'mouse') { $warningStatement.addClass("show"); } });
        $warningIcon.on('pointerleave', function (e) { if (e.originalEvent.pointerType === 'mouse') { $warningStatement.removeClass("show"); } });
        $warningIcon.on('click', function (e) { if (e.pointerType !== 'mouse') { $warningStatement.toggleClass("show"); } });
    }
}

function iteractiveMP(videoEL, onComplete) {
    const TOTAL_FRAMES = 8;
    const FORWARD_RATE = 0.75;
    let frameDuration = 0;
    let reverseId = null;
    let finalState = false;
    function seekFrame(n) {
        videoEL.pause();
        videoEL.currentTime = n * frameDuration + 1e-4;
    }
    function stopReverse() {
        if (reverseId !== null) {
            clearInterval(reverseId);
            reverseId = null;
        }
    }
    function playForward(onComplete) {
        if (finalState) { return; }
        stopReverse();
        videoEL.playbackRate = FORWARD_RATE;
        seekFrame(0);
        videoEL.play();
        const lastTime = (TOTAL_FRAMES - 3.3) * frameDuration;
        function onUpdate() {
            if (videoEL.currentTime >= lastTime) {
                videoEL.removeEventListener('timeupdate', onUpdate);
                seekFrame(TOTAL_FRAMES - 2);
                if (onComplete) {
                    playSelected();
                    finalState = true; onComplete();
                }
            }
        }
        videoEL.addEventListener('timeupdate', onUpdate);
    }
    function playReverse() {
        if (finalState) { return; }
        stopReverse();
        let frame = TOTAL_FRAMES - 2;
        const stepMs = 1000 * frameDuration / FORWARD_RATE;
        reverseId = setInterval(() => {
            seekFrame(frame--);
            if (frame < 0) { stopReverse(); }
        }, stepMs);
    }
    function playSelected() {
        if (finalState) { return; }
        stopReverse();
        seekFrame(TOTAL_FRAMES - 1);
    }

    videoEL.addEventListener('loadedmetadata', () => {
        frameDuration = videoEL.duration / TOTAL_FRAMES;
        seekFrame(0);
    });
    videoEL.addEventListener('pointerenter', (e) => { if (e.pointerType === "mouse") { playForward(); } });
    videoEL.addEventListener('pointerleave', (e) => { if (e.pointerType === "mouse") { playReverse(); } });
    videoEL.addEventListener('pointerdown', (e) => {
        if (e.pointerType === "mouse") {
            playSelected();
            if (onComplete) { finalState = true; onComplete(); }
        } else if (e.pointerType === "touch") {
            e.preventDefault();
            playForward(onComplete);
        }
    });
    return {
        resetMP: () => {
            finalState = false;
            playReverse();
        },
        setComplete: () => {
            playSelected();
            finalState = true;
        },
    };
}

async function frontPage() {
    const session = getSession();
    if (!session) { return; }
    const cache = await maintenance(session);
    if (!cache.daily) { return; }
    dailyBanner(cache.daily.cards[0].imgUrl);
    dailyCardDeck(cache, session);
    $(document).on("keydown", function (event) {
        if (event.ctrlKey && event.shiftKey && event.key === "K") {
            open(`${website}/scout?token=${session.token}`, "_blank");
        }
    });
}

function dailyBanner(banner_url) {
    // 本卡片遵循 Bangumi 半月刊设计标准
    $("head").append(`<style>
        #lc-daily-container {
            position: relative;
            cursor: pointer;
            border-radius: 5px;
            height: 50px;
            padding: 10px;
            overflow: hidden;
        }
        #lc-daily-container img {
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            backface-visibility: hidden; /* 防锯齿 */
        }
        #lc-daily-container p {
            position: relative;
            user-select: none;
            text-align: right;
            margin-top: 30px;
            color: white;
            font-size: 1.3em;
            text-shadow: 0px 0px 10px black;
            line-height: 150%;
            font-weight: 900;
            font-family: 'PingFang SC', 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif, "Hiragino Sans GB";
            pointer-events: none;
        }
    </style>`);

    const dailyHTML = `
        <div id="lc-daily-container" class="SidePanelMini">
            <img src="${encodeURI(banner_url)}" alt="每日萝莉" id="lc-daily-banner" onload="this.style.opacity=1" />
            <p>每日萝莉 (๑• ‸ •๑)</p>
        </div>
    `;
    $("#columnHomeB div.sideInner").before(dailyHTML);
}

function dailyCardDeck(cache, session) {
    $("head").append(`<style>
        #lc-daily-carddeck-container {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(0px) contrast(1);
            opacity: 0;
            pointer-events: none;
            perspective: 5000px;
            transition: opacity 0.5s ease-out, backdrop-filter 0.5s ease-out, background 0.5s ease-out;
        }
        #lc-daily-carddeck-container.open {
            opacity: 1;
            pointer-events: auto;
            backdrop-filter: blur(12px) contrast(0.85);
        }

        #lc-daily-carddeck {
            position: relative;
            background-color: rgba(249, 249, 245, 1.0);
            border-radius: 9px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            will-change: transform;
            transform-style: preserve-3d;
            overflow: hidden;
            transition: opacity 0.2s ease-out;
        }
        html[data-theme="dark"] #lc-daily-carddeck {
            background-color: rgba(68, 68, 68, 1.0);
        }

        #lc-daily-carddeck-switch {
            position: absolute;
            top: -20px;
            left: 10px;
            height: 32px;
            display: flex;
            gap: 0.5rem;
        }
        #lc-daily-carddeck-switch > div {
            position: relative;
            top: 0;
            filter: brightness(0.8);
            transition: top 0.2s ease-out, filter 0.2s ease-out;
        }
        #lc-daily-carddeck-switch > div:not(.chosen):hover {
            cursor: pointer;
            top: -12px;
            filter: brightness(1);
        }
        #lc-daily-carddeck-switch > div.chosen {
            top: -12px;
            filter: brightness(1);
        }

        #lc-daily-carddeck-inner {
            max-height: 90vh;
            max-width: 90vw;
        }

        #lc-daily-carddeck-announcement {
            position: absolute;
            bottom: -1rem;
            left: -1.5rem;
            font-size: 1.1em;
            background-color: #f7c8cc;
            padding: 0.8rem;
            transform: rotate(-2deg);
            clip-path: polygon(0.5rem 100%, 0% -20%, 120% -20%, 120% 100%);
            border-radius: 0 .25rem .25rem 0;
            box-shadow: 3px -4px 8px 0 rgba(0, 0, 0, 0.21);
        }
        #lc-daily-carddeck-announcement-ribbon {
            position: absolute;
            z-index: -1;
            bottom: -0.74rem;
            left: -1.27rem;
            width: 2rem;
            height: 3rem;
            transform: skewY(-23deg) rotate(-10deg);
            border-radius: .25rem 0 0 0;
            background-color: #f09199;
        }

        .lc-daily-togglable {
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-out;
        }
        .lc-daily-togglable.show {
            opacity: 1;
            pointer-events: auto;
        }
    </style>`);

    const cardSwitchHtml = cache.daily.cards.map((card, idx) => `
        <div id="lc-daily-carddeck-switch-${idx}">
            <img src="${lcMeta[card.tags].badge}" height="32" />
        </div>
    `).join("");
    const modalHtml = `
        <div id="lc-daily-carddeck-container">
            <div id="lc-daily-carddeck">
                <div id="lc-daily-carddeck-switch">${cardSwitchHtml}</div>
                <div id="lc-daily-carddeck-inner"></div>
                ${cache.daily.announcement ? `<div id="lc-daily-carddeck-announcement-ribbon" class="lc-daily-togglable"></div><div id="lc-daily-carddeck-announcement" class="lc-daily-togglable">${cache.daily.announcement}</div>` : ""}
            </div>
        </div>
    `;
    $("body").append(modalHtml);

    let lazyReactionsPromiseResolve = null;
    let reactionsPromiseStarted = false; // 直到卡片展开时才请求贴贴数据
    const lazyReactionsPromise = new Promise((resolve) => { lazyReactionsPromiseResolve = resolve; });
    const { switchCard: switchCardInner, toggleCardInfo } = dailyCards(cache, lazyReactionsPromise, session);

    let currentCard = 0;
    $(`#lc-daily-carddeck-switch-${currentCard}`).addClass('chosen');
    function switchCard(idx) {
        if (idx === currentCard) { return; }
        $(`#lc-daily-carddeck-switch-${currentCard}`).removeClass('chosen');
        currentCard = idx;
        $cardDeck.css('opacity', 0);
        setTimeout(() => {
            switchCardInner(idx);
            $(`#lc-daily-carddeck-switch-${idx}`).addClass('chosen');
            setTimeout(() => {
                $cardDeck.css('opacity', 1);
            }, 100);
        }, 300);
    }
    cache.daily.cards.forEach((card, idx) => {
        $(`#lc-daily-carddeck-switch-${idx}`).click(function () {
            switchCard(idx);
        });
    });

    const $banner = $("#lc-daily-banner");
    const $container = $("#lc-daily-carddeck-container");
    const $cardDeck = $("#lc-daily-carddeck");

    function animate(duration, easing, onUpdate, onComplete) {
        const startTime = performance.now();

        function update(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            onUpdate(easing(progress));
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                onComplete();
            }
        }

        requestAnimationFrame(update);
    }

    $banner.click(function () {
        if (!reactionsPromiseStarted) {
            reactionsPromiseStarted = true;
            const reactionsPromise = lcClient.fetchDailyReact(cache.selfBadge);
            reactionsPromise.then(lazyReactionsPromiseResolve);
        }
        const bannerRect = $banner[0].getBoundingClientRect();
        const cardDeckRect = $cardDeck[0].getBoundingClientRect();
        const startScale = bannerRect.width / cardDeckRect.width;
        const startHeight = bannerRect.height / startScale;
        const endHeight = cardDeckRect.height;
        const startX = bannerRect.left - cardDeckRect.left;
        const startY = bannerRect.top - (cardDeckRect.height * startScale - bannerRect.height) / 2 - cardDeckRect.top;
        // Additional translation offset to account for scaling
        const adjustedX = startX - (cardDeckRect.width * (1 - startScale)) / 2;
        const adjustedY = startY - (cardDeckRect.height * (1 - startScale)) / 2;

        $container.addClass('open');
        requestAnimationFrame(() => {
            animate(
                2000,
                (x) => (x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2),
                (progress) => {
                    const x = adjustedX * (1 - progress);
                    const y = adjustedY * (1 - progress);
                    const scale = startScale + (1 - startScale) * progress;
                    const height = startHeight + (endHeight - startHeight) * progress;
                    $cardDeck[0].style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
                    $cardDeck[0].style.height = `${height}px`;
                },
                () => {
                    toggleCardInfo(true);
                    $cardDeck.css('overflow', 'visible');
                    $cardDeck.css('height', '');
                }
            );
        });
    });

    $container.on("click", function (event) {
        if (event.target === this) {
            $container.removeClass('open');
            $cardDeck.css('transform', '');
            $cardDeck.css('overflow', 'hidden');
            toggleCardInfo(false);
            if (currentCard !== 0) {
                setTimeout(() => {
                    switchCard(0);
                }, 500);
            }
        }
    });
}

function dailyCards(cache, reactionsPromise, session) {
    const $inner = $("#lc-daily-carddeck-inner");

    $("head").append(`<style>
        .lc-daily-card {
            position: relative;
            border-radius: 9px;
        }

        .lc-daily-card-img {
            max-width: 90vw;
            max-height: 90vh;
            border-radius: 9px;
        }

        .lc-daily-card-details {
            position: absolute;
            bottom: 0.5rem;
            right: 0.5rem;
            min-width: 9rem;
            max-width: 12rem;
            padding: 0.3rem 1rem 0.6rem 1rem;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            border-radius: 9px;
        }
        html[data-theme="dark"] .lc-daily-card-details {
            background: rgba(45, 46, 47, 0.7);
        }

        .lc-daily-card-meta {
            margin: 1.7rem 0 0.5rem 0;
            font-size: 1.1em;
            line-height: 1.5;
        }
        .lc-daily-card-meta svg {
            opacity: 0.45;
            margin-right: 6px;
        }

        .lc-daily-card-comment {
            padding: 1rem 0 0.5rem 1.25rem;
            font-style: italic;
            position: relative;
        }
        .lc-daily-card-comment:before {
            display: block;
            padding-left: 10px;
            content: "\\201C";
            font-size: 30px;
            position: absolute;
            left: -15px;
            top: 4px;
            color: #666666
        }
        html[data-theme="dark"] .lc-daily-card-comment:before {
            color: #d8d8d8;
        }
    </style>`);

    function formatCardMeta(card) {
        let metaHTML = `
        ${svgRepo.link}<a class="l" href="${card.sourceUrl}" target="_blank">来源</a><br />
        ${svgRepo.illustrator}<a class="l" href="${card.artistUrl}" target="_blank">${card.artistName}</a><br />
        `;
        if (card.characterNames.length > 0) {
            const charactersHTML = card.characterNames.map((name, idx) => `<a class="l" href="/character/${card.characterIds[idx]}" target="_blank">${name}</a>`).join('、');
            metaHTML += `${svgRepo.character}${charactersHTML}<br />`;
        }
        if (card.comment) {
            metaHTML += `<div class="lc-daily-card-comment">${card.comment}</div>`;
        }
        if (card.suggestedBy) {
            metaHTML += `<span style="float: right; margin: 0.3rem 0">由 <a class="l" href="/user/${card.suggestedBy.username}">@${card.suggestedBy.nickname}</a> 推荐</span>`;
        }
        return metaHTML;
    }
    let cardIdx = 0;
    const card = cache.daily.cards[cardIdx];
    const imgHTML = cache.daily.cards.map((card, idx) =>
        `<img src="${encodeURI(card.imgUrl)}" class="lc-daily-card-img" style="display: ${idx === cardIdx ? 'block' : 'none'};" />`
    ).join("");
    const cardHTML = `
        <div class="lc-daily-card">
            ${imgHTML}
            <div class="lc-daily-card-details lc-daily-togglable">
                <div class="lc-daily-card-meta">${formatCardMeta(card)}</div>
            </div>
        </div>
    `;
    $inner.append(cardHTML);

    function toggleCardInfo(show) {
        if (show) {
            $(".lc-daily-togglable").addClass('show');
        } else if (show === false) {
            $(".lc-daily-togglable").removeClass('show');
        } else {
            $(".lc-daily-togglable").toggleClass('show');
        }
    }
    $(".lc-daily-card-img").click(function () { toggleCardInfo(); });

    let switchCardReactions = null;
    reactionsPromise.then(reactions => {
        ({ switchCardReactions } = dailyCardReactions(reactions, session, cardIdx));
    });
    const { switchSubmitPanel } = submitPanel(cache, session, card.tags);

    return {
        switchCard(idx) {
            cardIdx = idx;
            const card = cache.daily.cards[idx];
            $(".lc-daily-card-img").each((i, img) => {
                $(img).css('display', i === idx ? 'block' : 'none');
            });
            $(".lc-daily-card-meta").html(formatCardMeta(card));
            $(".lc-daily-card-comment").text(card.comment);
            switchCardReactions?.(idx);
            switchSubmitPanel?.(card.tags);
        },
        toggleCardInfo,
    };
}

function dailyCardReactions(reactions, session, initialCardIdx) {
    const REACTIONS = [
        { value: 0, img: "/img/smiles/tv/44.gif" },
        { value: 104, img: "/img/smiles/tv/65.gif" },
        { value: 54, img: "/img/smiles/tv/15.gif" },
        { value: 140, img: "/img/smiles/tv/101.gif" },
        { value: 122, img: "/img/smiles/tv/83.gif" },
        { value: 90, img: "/img/smiles/tv/51.gif" },
        { value: 88, img: "/img/smiles/tv/49.gif" },
        { value: 80, img: "/img/smiles/tv/41.gif" },
    ]
    const REACTVAL2IMG = Object.fromEntries(REACTIONS.map(r => [r.value, r.img]));
    let cardIdx = initialCardIdx;
    let like_state = reactions[cardIdx];

    $("head").append(`
        <style>
            .lc-post_actions {
                display: flex;
                width: 100%;
                min-height: 2rem;
            }
            .lc-dropdown {
                position: relative;
                top: 4px;
                left: -3px;
            }
            .lc-likes_grid {
                flex-grow: 1;
                opacity: 1;
            }
        </style>
    `);

    const $cardDetails = $(".lc-daily-card-details");
    const $userdock = $("#dock li.first > a");
    const [username, nickname] = [$userdock.attr('href').split('/').pop(), $userdock.text().trim()];

    function formatLikeTitle(like, quote = "&quot;") {
        return like.users.map(u => `<a href=${quote}/user/${u[0]}${quote}>${escapeHtml(u[1])}</a>`).join('、');
    }
    function formatLike(like) {
        return `<a class="item ${like.users.some(u => u[0] === username) ? 'selected' : ''}" href="javascript:void(0);" data-like-value="${like.value}" title="${formatLikeTitle(like)}" data-toggle="tooltip">
                <span class="emoji" style="background-image: url('${REACTVAL2IMG[like.value]}');"></span>
                <span class="num">${like.users.length}</span>
            </a>`;
    }
    function onLikeOf(selector) {
        $(selector).on('click', function (e) {
            e.preventDefault();
            const $item = $(this);
            const likeValue = $item.data('like-value');
            toggleLikeAndPost(likeValue, $item);
        });
        $(selector).on('show.bs.tooltip', function (e) {
            $(".tooltip[data-like-value!='" + $(this).data('like-value') + "']").each(function () { $(this).tooltip('hide'); });
        })
    }

    const likesHTML = like_state.map(formatLike).join("");
    const likesGridHTML = `
        <div class="likes_grid lc-likes_grid">${likesHTML}</div>
    `;
    const reactionsHTML = REACTIONS.map(reaction => `
        <li><a href="javascript:void(0);" data-like-value="${reaction.value}"><img src="${reaction.img}" class="emoji"></a></li>
    `).join("");
    const reactionGridHTML = `
        <div class="action dropdown dropdown_right lc-dropdown">
            <a href="javascript:void(0);" class="icon like_dropdown">
                <span class="ico ico_like lc-ico_like">&nbsp;</span>
                <span class="title">贴贴</span>
            </a>
            <ul class="grid lc-react_grid">${reactionsHTML}</ul>
        </div>
    `;
    $cardDetails.prepend(`
        <div class="post_actions lc-post_actions">
            ${reactionGridHTML}
            ${likesGridHTML}
        </div>
    `);

    function toggleLike(likeValue, $item) {
        let state = like_state.find(l => l.value === likeValue);
        if (!state) { // new like
            state = { value: likeValue, users: [] };
            $(".lc-likes_grid").append(formatLike(state));
            onLikeOf(".lc-likes_grid a.item:last");
            like_state.push(state);
        }
        if (!$item) {
            $item = $(".lc-likes_grid a.item").filter(function () { return $(this).data('like-value') === likeValue; });
        }
        function updateLikeElement($item, state) {
            $item.attr('data-original-title', formatLikeTitle(state, '"'));
            $($item).find('.num').text(state.users.length);
        }
        if ($item.hasClass('selected')) {
            state.users = state.users.filter(u => u[0] !== username);
            if (state.users.length === 0) {
                $item.remove();
                like_state.splice(like_state.findIndex(l => l.value === likeValue), 1);
            } else {
                updateLikeElement($item, state);
                $item.removeClass('selected live_selected');
            }
        } else {
            const theOtherLikeValue = like_state.find(l => l.users.some(u => u[0] === username))?.value;
            if (theOtherLikeValue !== undefined) { // deselect the other like
                toggleLike(theOtherLikeValue);
            }
            state.users.push([username, nickname]);
            updateLikeElement($item, state);
            $item.addClass('selected live_selected');
        }
    }
    function toggleLikeAndPost(likeValue, $item) {
        toggleLike(likeValue, $item);
        lcClient.patchDailyReact(cardIdx, likeValue, session);
    }

    $('div.lc-likes_grid').tooltip({
        animation: true,
        offset: 0,
        selector: 'a.item',
        html: true,
        delay: { show: "300", hide: 5000 }
    });
    $('.lc-likes_grid').on('mouseleave', function () {
        $(".tooltip").each(function () { $(this).tooltip('hide'); });
    });
    onLikeOf('.lc-likes_grid a.item');
    $('.lc-react_grid li a').on('click', function (e) {
        e.preventDefault();
        toggleLikeAndPost($(this).data('like-value'));
    });

    return {
        switchCardReactions(idx) {
            cardIdx = idx;
            like_state = reactions[cardIdx];
            $(".lc-likes_grid").html(like_state.map(formatLike).join(""));
            onLikeOf(".lc-likes_grid a.item");
        }
    }
}

function submitPanel(cache, session, initialCardTag) {
    const FIELDS = [
        { label: "来源", id: "sourceUrl", placeholder: "原作者发布页面的链接", required: true, validate: validateUrl },
        { label: "绘师名", id: "artistName", placeholder: "线条与色彩法术使用者", required: true },
        { label: "绘师链接", id: "artistUrl", placeholder: "例如pixiv、twitter主页、bgm人物链接", required: true, validate: validateUrl },
        { label: "角色", id: "characters", placeholder: "班固米角色页面的链接，多个链接用空格分隔", validate: validateBCUArray },
        { label: "说点什么", id: "comment", placeholder: "图文是否无关，令人深思……" },
    ];
    const KNOWN_SOURCES = [
        { regex: /^https:\/\/x\.com\/([^\/]+\/status\/\d+)/, type: 'twitter' },
        { regex: /^https:\/\/www\.pixiv\.net\/artworks\/(\d+)$/, type: 'pixiv' },
    ];
    const ALLOWED_TAGS = [
        ["LC0", "LC YJ"],
        ["LC ES"],
    ];
    let allowedTags = ALLOWED_TAGS.find(tags => tags.includes(initialCardTag));

    $("head").append(`
        <style>
            :root {
                --lc-badge-theme: 240, 145, 153;
                --lc-sky: 78, 193, 218;
                --lc-bg: 255, 255, 255;
                --lc-bg-dark: 45, 46, 47;
            }

            #lc-submit-panel-container {
                width: fit-content;
                margin: 0.4rem 0 0 auto;
            }
            .lc-submit-button {
                padding: 0.1rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                opacity: 0.7;
                filter: contrast(1);
                transition: opacity 0.5s ease-out, filter 0.5s ease-out;
            }
            .lc-submit-button:hover {
                opacity: 1;
                filter: contrast(1.3);
            }
            #lc-submit-show-button {
                width: 4rem;
                height: 1.9rem;
                color: rgb(var(--lc-badge-theme));
                background: rgba(var(--lc-bg), 0.8);
            }
            html[data-theme="dark"] #lc-submit-show-button {
                background: rgba(var(--lc-bg-dark), 0.8);
            }
            #lc-submit-submit-button {
                float: right;
                width: 3rem;
                height: 2rem;
                font-size: 0.9rem;
                background: rgba(var(--lc-sky), 0.3);
            }

            #lc-submit-panel {
                background: rgba(var(--lc-bg));
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 16px 32px rgba(0, 0, 0, 0.08);
                position: absolute;
                top: -180px;
                left: -160px;
                width: 320px;
                font-size: 0.8rem;
                padding: 1rem;
                border-radius: 6px;
                pointer-events: none;
                opacity: 0;
                transform: scale(0.9);
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            #lc-submit-panel.show {
                pointer-events: auto;
                opacity: 1;
                transform: scale(1);
            }
            html[data-theme="dark"] #lc-submit-panel {
                background: rgba(var(--lc-bg-dark));
            }
            #lc-submit-close-button {
                position: absolute;
                top: 0.6rem;
                right: 0.6rem;
                border: none;
                border-radius: 100%;
                font-size: 1.2rem;
                line-height: 0.7rem;
                padding: 5px;
                cursor: pointer;
            }
            .lc-submit-item {
                display: flex;
                gap: 0.2rem;
                margin: 0.5rem 0;
            }
            .lc-submit-item label {
                width: 5rem;
                text-align: right;
                align-self: center;
            }
            .lc-submit-item .lc-submit-required {
                color: rgb(var(--lc-badge-theme));
            }

            .lc-inputtext {
                font-size: 0.8rem !important;
                line-height: 1rem !important;
            }
            #lc-submit-form-tag {
                flex-grow: 1;
                padding: 0.25rem;
                border-radius: 0.25rem;
                border: 1px solid rgba(0, 0, 0, 0.12);
            }
            #lc-submit-form-tag:focus {
                outline: none;
            }
            #lc-submit-form-img {
                width: 102%;
            }

            #lc-submit-message {
                position: absolute;
                left: 1.2rem;
                bottom: 1.5rem;
                font-size: 0.8rem;
                color: rgb(var(--lc-badge-theme));
                opacity: 0;
                transform: translateY(0.5rem);
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }
            #lc-submit-message.show {
                opacity: 1;
                transform: translateY(0);
            }
        </style>
    `);

    function formatFormTag() {
        return allowedTags.map(t => `<option value="${t}">${t}</option>`).join("");
    }
    function showMessage(message) {
        $("#lc-submit-message").text(message);
        $("#lc-submit-message").addClass('show');
        setTimeout(() => {
            $("#lc-submit-message").removeClass('show');
        }, 3000);
    }

    const $cardDetails = $(".lc-daily-card-details");
    const formHTML = FIELDS.map(field => `
        <div class="lc-submit-item">
            <label for="lc-submit-form-${field.id}">${field.label}<span class="lc-submit-required">${field.required ? '*' : '&nbsp;'}</span></label>
            <input type="text" id="lc-submit-form-${field.id}" placeholder="${field.placeholder}" class="inputtext lc-inputtext" />
        </div>
    `).join("");
    if (cache.daily.quota === 0) {
        $cardDetails.append(`
            <div id="lc-submit-panel-container">
                <button id="lc-submit-show-button" class="lc-submit-button">(๑• ‸ •๑)</button>
            </div>
        `);
        return { switchSubmitPanel: null }
    }
    $cardDetails.append(`
        <div id="lc-submit-panel-container">
            <button id="lc-submit-show-button" class="lc-submit-button">${svgRepo.loveletter}投稿</button>
            <div id="lc-submit-panel">
                <button id="lc-submit-close-button">×</button>
                <div id="lc-submit-item">
                    <span>&nbsp;<a href="https://bgm.tv/group/topic/417120" target="_blank" class="l">投稿须知</a></span>
                </div>
                <div id="lc-submit-item">
                    <span>&nbsp;将提交的插画是
                        <select id="lc-submit-form-tag">
                            ${formatFormTag()}
                        </select>
                        级的，露点需要打码</span>
                </div>
                <div class="lc-submit-item">
                    <label for="lc-submit-form-img">图片<span class="lc-submit-required">*</span></label>
                    <input type="file" accept=".jpg,.jpeg,.png,.webp,.avif" id="lc-submit-form-img" />
                </div>
                ${formHTML}
                <div class="lc-submit-item">
                    <label for="lc-submit-anonymous">不显示投稿者</label>
                    <input type="checkbox" id="lc-submit-anonymous" />
                </div>
                <button id="lc-submit-submit-button" class="lc-submit-button">发送</button>
                <div id="lc-submit-message"></div>
            </div>
        </div>
    `);

    $("#lc-submit-show-button").on('click', function (e) {
        e.preventDefault();
        $("#lc-submit-panel").addClass('show');
    });
    $("#lc-submit-close-button").on('click', function (e) {
        e.preventDefault();
        $("#lc-submit-panel").removeClass('show');
    });
    $("#lc-submit-submit-button").on('click', async function (e) {
        e.preventDefault();
        const img = $("#lc-submit-form-img")[0].files?.[0];
        if (!img) {
            showMessage("是不是忘记选择图片了？");
            return;
        }
        if (img.size > 3 * 1024 * 1024) {
            showMessage(img.type === "image/png" ? "图片超过 3MB 了，建议转换为 jpg 格式" : "图片超过 3MB 了，请先调整尺寸");
            return;
        }
        const data = {
            sourceUrl: $("#lc-submit-form-sourceUrl").val().trim(),
            artistName: $("#lc-submit-form-artistName").val().trim(),
            artistUrl: $("#lc-submit-form-artistUrl").val().trim(),
            characters: $("#lc-submit-form-characters").val().trim(),
            tags: $("#lc-submit-form-tag").val(),
            comment: $("#lc-submit-form-comment").val().trim(),
            anonymous: $("#lc-submit-anonymous").is(':checked'),
        }
        for (const field of FIELDS) {
            if (field.required && !data[field.id]) {
                showMessage(`“${field.label}”一栏是必填项`);
                return;
            }
            if (data[field.id] && field.validate && !field.validate(field.label, data[field.id])) {
                return;
            }
        }
        data.characters = data.characters ? data.characters.split(/\s+/).map(url => parseInt(url.split('/').pop())) : [];

        $(this).prop('disabled', true);
        $(this).text("……");
        function endWithMessage(message) {
            showMessage(message);
            $(this).text("发送");
            $(this).prop('disabled', false);
        }
        let otc = null;
        let error = null;
        ({ otc, error } = await lcClient.postDaily(data, session));
        if (error) {
            return endWithMessage(error);
        }
        ({ error } = await lcClient.uploadDailyImage(img, otc, session));
        if (error) {
            return endWithMessage(error);
        }
        endWithMessage("心意……传达到了呢");
        cache.daily.quota--;
        saveToStorage("cache", cache);
        if (cache.daily.quota === 0) {
            $("#lc-submit-show-button").text("(๑• ‸ •๑)");
            $("#lc-submit-show-button").prop('disabled', true);
        }
        setTimeout(() => {
            $("#lc-submit-panel").removeClass('show');
            setTimeout(() => { $(".lc-submit-item input").val(""); }, 1000);
        }, 2000);
    });
    $("#lc-submit-form-sourceUrl").on('blur', async function (e) {
        const url = $(this).val().trim();
        const match = KNOWN_SOURCES.find(source => source.regex.test(url));
        if (match) {
            const artist = await lcClient.fetchDailyResolve(match.type, url.match(match.regex)[1]);
            if (artist?.name) {
                $("#lc-submit-form-artistName").val(artist.name);
            }
            if (artist?.link) {
                $("#lc-submit-form-artistUrl").val(artist.link);
            }
        }
    });

    function validateUrl(label, url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            showMessage(`“${label}”一栏应该填写链接`);
            return false;
        }
    }
    function validateBCUArray(label, urls) {
        return urls.split(/\s+/).every(url => {
            if (!url.match(/^https:\/\/(bgm\.tv|bangumi\.tv|chii\.in)\/character\/(\d+)$/)) {
                showMessage(`“${label}”一栏应该填写班固米角色页面的链接`);
                return false;
            }
            return true;
        });
    }

    return {
        switchSubmitPanel(newTag) {
            allowedTags = ALLOWED_TAGS.find(tags => tags.includes(newTag));
            $("#lc-submit-form-tag").html(formatFormTag());
        }
    }
}

async function characterPage(cid) {
    const isFemaleChar = $("#infobox > li").filter((_, li) => $(li).text().includes("性别: 女")).length > 0;
    if (!isFemaleChar) { return; }
    const session = getSession();
    if (!session) { return; }
    const characterInfoDB = getCharacterInfoDB();
    const info = await characterInfoDB.getOrFetch(cid, async () => await lcClient.fetchCharacter(cid, session));
    if (!info) { return; }
    characterBadge(session, info, characterInfoDB);
}

function characterBadge(session, info, characterInfoDB) {
    const cid = window.location.pathname.split('/').pop();

    $("head").append(`<style>
        #lc-char-rating-container {
            float: right !important;
            display: flex;
            margin-right: 20px;
        }
        @media (max-width: 640px) {
            #lc-char-rating-container {
                float: none !important;
            }
            #headerSubject .subjectNav, #headerSubject .navTabs {
                overflow-x: clip !important;
                overflow-y: visible !important;
            }
        }
        #lc-char-rating-container > div {
            position: relative;
            height: 33px;
            font-family: inherit;
            text-align: center;
        }
        .lc-char-rating {
            color: #999;
            width: 48px;
            cursor: pointer;
        }
        .lc-char-rating > span {
            transition: opacity 0.3s ease-in-out;
        }
        .lc-char-rating:hover, .lc-char-rating.rated.chosen {
            color: #f09199 !important;
        }
        .lc-char-rating svg {
            position: absolute;
            left: 0;
            bottom: 10px;
            opacity: 0;
            transition: opacity 0.12s ease-in-out; /* mouseleave掩盖动画 */
        }
        #lc-char-rating-container:hover .lc-char-rating svg, .lc-char-rating.rated svg {
            opacity: 1;
            transition: opacity 0.12s ease-in-out 0.18s; /* mouseenter掩盖动画 */
        }
        .lc-char-rating svg > path {
            stroke-dasharray: 60;
            stroke-dashoffset: 60;
            transition: stroke-dashoffset 0.3s ease-in-out;
        }
        .lc-char-rating:hover svg > path, .lc-char-rating.rated svg > path {
            stroke-dashoffset: 0;
        }
        .lc-char-rating:has(~ .lc-char-rating:hover):not(.rated) svg > path {
            stroke-dashoffset: -60;
        }
        .lc-char-rating-note {
            color: #999;
            font-size: 12px;
        }
    </style>`);

    const ratingHTML = `
        <div class="lc-char-rating" id="lc-char-rating-r-1">
            <svg width="48" height="33" viewBox="0 0 48 33" xmlns="http://www.w3.org/2000/svg"><path d="M0 11 L48 11" fill="none" stroke="#f09199" stroke-width="2"/></svg>
            <span>小了</span>
        </div>
        <div class="lc-char-rating" id="lc-char-rating-r0">
            <svg width="48" height="33" viewBox="0 0 48 33" xmlns="http://www.w3.org/2000/svg"><path d="M0 11 C12 11 12 6 24 6 C36 6 36 11 48 11" fill="none" stroke="#f09199" stroke-width="2"/></svg>
            <span>正好</span>
        </div>
        <div class="lc-char-rating" id="lc-char-rating-r1">
            <svg width="48" height="35" viewBox="0 0 48 31" xmlns="http://www.w3.org/2000/svg"><path d="M0 11 C12 11 12 0 24 0 C36 0 36 11 48 11" fill="none" stroke="#f09199" stroke-width="2"/></svg>
            <span>大了</span>
        </div>
    `;
    const requestHTML = `
        <div class="lc-char-rating-note">
            萝莉/幼女？<span class="lc-char-rating">请求收录</span>
        </div>
    `;
    const pendingHTML = `
        <div class="lc-char-rating-note">
            萝莉/幼女收录请求审核中……
        </div>
    `;
    $("#headerSubject ul.navTabs > li:nth-child(3)").after(`
        <li id="lc-char-rating-container">
            ${{ normal: ratingHTML, pending: pendingHTML }[info.status] ?? requestHTML}
        </li>
    `);

    if (info.status === "normal") {
        async function toggleRatingText() {
            $(".lc-char-rating > span").css("opacity", 0);
            const text = chosen !== undefined ? info.rating : { '-1': "小了", '0': "正好", '1': "大了" };
            await new Promise(resolve => setTimeout(resolve, 300));
            ['-1', '0', '1'].forEach(rt => {
                $(`#lc-char-rating-r${rt} > span`).text(`${text[rt] ?? 0}`);
            });
            $(".lc-char-rating > span").css("opacity", 1);
        }
        let chosen = undefined;
        if (info.userRating !== undefined) {
            chosen = info.userRating;
            toggleRatingText().then(() => {
                $(".lc-char-rating").toggleClass("rated", true);
            });
            $(`#lc-char-rating-r${chosen}`).addClass("chosen");
        }
        [-1, 0, 1].forEach(rt => {
            $(`#lc-char-rating-r${rt}`).on('click', () => {
                if (chosen !== undefined) {
                    info.rating[chosen.toString()]--;
                    $(`#lc-char-rating-r${chosen}`).removeClass("chosen");
                }
                const deselected = chosen === rt;
                if (!deselected) {
                    info.rating[rt.toString()]++;
                    $(`#lc-char-rating-r${rt}`).addClass("chosen");
                }
                chosen = deselected ? undefined : rt;
                info.userRating = chosen;
                lcClient.patchCharacter(cid, { rating: rt.toString() }, session);
                characterInfoDB.set(cid, info);
                toggleRatingText();
                $(".lc-char-rating").toggleClass("rated", !deselected);
            });
        });
    } else if (info.status === undefined) {
        $(".lc-char-rating-note > span").on('click', async () => {
            $(".lc-char-rating-note > span").text("……");
            await lcClient.postCharacterRequest(cid, session);
            characterInfoDB.set(cid, { status: 'pending', rating: {} });
            $(".lc-char-rating-note").text("萝莉/幼女收录请求审核中……");
        });
    }
}

function parseLicense(license) {
    if (license === "LC0") return new Set();
    return new Set(license.slice(3).split('-'));
}
function testLicenseCompatibility(other, self) {
    const [lo, ls] = [parseLicense(other), parseLicense(self)];
    return lo.isSubsetOf(ls);
}

function sdRender(sd) {
    function extractCharacterModifier(text) {
        const fragments = [];
        const matches = text.split(/([{}\[\]]+|<.*?_\d+>)/);
        for (let i = 0; i < matches.length; i += 2) {
            const text = matches[i];
            if (text) {
                fragments.push({ kind: "text", value: text });
            }
            const modifier = matches[i + 1];
            if (modifier) {
                if (modifier.startsWith("<")) {
                    fragments.push({ kind: "character_tag", value: modifier.slice(1, -1) });
                } else {
                    fragments.push({ kind: "modifier", value: modifier });
                }
            }
        }
        return fragments;
    }
    function extractTagManual(text) {
        const fragments = [];
        const matches = text.split('_');
        for (let i = 0; i < matches.length; i += 2) {
            const text = matches[i];
            if (text) {
                fragments.push({ kind: "text", value: text });
            }
            const tag = matches[i + 1];
            if (tag) {
                fragments.push({ kind: "tag", value: tag });
            }
        }
        return fragments;
    }
    function renderHTML(fragments) {
        const content = fragments.map(fragment => {
            const valueWithBreaks = escapeHtml(fragment.value).replace(/\n/g, "<br />");
            switch (fragment.kind) {
                case "text":
                    return `<span style="color:#b3a49b">${valueWithBreaks}</span>`;
                case "tag":
                    return `<span style="color:#e37881">${valueWithBreaks}</span>`;
                case "character_tag":
                    const [name, id] = valueWithBreaks.split("_");
                    return `<a href="https://bgm.tv/character/${id}" class="l" target="_blank">&lt;${name}&gt;</a>`;
                case "modifier":
                    return `<span>${valueWithBreaks}</span>`;
            }
        }).join("");
        return `<span>我喜欢</span>${content}`;
    }
    const fragments = extractCharacterModifier(sd).flatMap(fragment => {
        return fragment.kind === "text" ? extractTagManual(fragment.value) : [fragment];
    });
    return renderHTML(fragments);
}


async function maintenance(session, selfBadgeVal, userInfoDB) {
    const cache = loadFromStorage("cache");
    let badge = cache.selfBadge;
    if (selfBadgeVal && badge !== selfBadgeVal) {
        badge = cache.selfBadge = selfBadgeVal;
        saveToStorage("cache", cache);
    }
    if (!badge) return cache;

    const today = (() => {
        const d = new Date();
        const utc = d.getTime() + d.getTimezoneOffset() * 60000;
        const cst = new Date(utc + 8 * 60 * 60 * 1000);
        if (cst.getHours() < 7 || (cst.getHours() === 7 && cst.getMinutes() < 21)) {
            cst.setDate(cst.getDate() - 1); // 新的一天从07:21开始
        }
        return `${cst.getFullYear()}-${String(cst.getMonth() + 1).padStart(2, '0')}-${String(cst.getDate()).padStart(2, '0')}`;
    })();
    if (cache.daily?.date === today) return cache;
    const daily = (await lcClient.fetchDaily(badge));
    cache.daily = { ...daily, quota: 2 };
    saveToStorage("cache", cache);

    if (!userInfoDB) {
        userInfoDB = getUserInfoDB();
    }
    userInfoDB.clearInvalidatedEntries();
    getCharacterInfoDB().clearInvalidatedEntries();
    if (session && sessionValid(session)) {
        lcClient.refreshSession(session);
    }

    return cache;
}


function getSession({ newSession = false } = {}) {
    let session = { token: "", expiresAt: 0 };
    if (newSession) {
        const urlParams = new URLSearchParams(window.location.search);
        session.token = urlParams.get('bgm-lcjs-session');
        if (session.token) {
            session.expiresAt = parseInt(urlParams.get('expiresAt') || '0');
            saveToStorage('session', session);
            return session;
        }
    }
    session = loadFromStorage('session');

    if (!sessionValid(session)) {
        return undefined;
    }
    return session;
}

function sessionValid(session) {
    return session.token && session.expiresAt > Date.now();
}

const lcClient = {
    async fetchInfo(session, username) {
        const rsp = await this.fetch(`/nocors/v1/user/${username}`, { method: 'POST', body: JSON.stringify({ token: session.token }) });
        if (!rsp.ok) { return; }
        return await rsp.json();
    },

    async postSettings(session, settings) {
        const rsp = await this.fetch("/v1/settings", { method: 'POST', ...this.withAuth(session), body: JSON.stringify(settings) });
        if (!rsp.ok) { throw new Error("Failed to update settings"); }
        return await rsp.json();
    },

    async refreshSession(session) {
        if (session.expiresAt > Date.now() + 1000 * 60 * 60 * 24 * 5) { return; }
        const rsp = await this.fetch("/v1/oauth/refresh", { method: 'GET', ...this.withAuth(session) });
        if (!rsp.ok) { return; }
        const jwt = (await rsp.json()).jwt;
        session.token = jwt;
        const jwtPayload = JSON.parse(atob(jwt.split('.')[1]));
        session.expiresAt = jwtPayload.expiresAt;
        saveToStorage('session', session);
    },

    async fetchDaily(badge) {
        const rsp = await this.fetch(`/v1/daily?badge=${badge}`, { method: 'GET' });
        if (!rsp.ok) { return; }
        return await rsp.json();
    },

    async fetchDailyReact(badge) {
        const rsp = await this.fetch(`/v1/daily/react?badge=${badge}`, { method: 'GET' });
        if (!rsp.ok) { return; }
        const reactionMaps = (await rsp.json()).reactions;
        return reactionMaps.map(reactionMap => {
            const reactions = Object.entries(reactionMap).map(([react, users]) => ({ value: parseInt(react), users }));
            reactions.sort((a, b) => b.users.length - a.users.length);
            return reactions.filter(r => r.users.length > 0);
        });
    },

    async fetchDailyResolve(rtype, rid) {
        const rsp = await this.fetch(`/v1/daily/resolve?type=${rtype}&rid=${encodeURIComponent(rid)}`, { method: 'GET' });
        if (!rsp.ok) { return; }
        return await rsp.json();
    },

    async patchDailyReact(cardTypeIdx, react, session) {
        await this.fetch(`/v1/daily/react?cardTypeIdx=${cardTypeIdx}`, { method: 'PATCH', ...this.withAuth(session), body: JSON.stringify({ react }) });
    },

    async postDaily(data, session) {
        const rsp = await this.fetch("/v1/daily/submit", { method: 'POST', ...this.withAuth(session), body: JSON.stringify(data) });
        if (!rsp.ok) {
            if (rsp.status === 429) {
                return { otc: null, error: "已达到提交队列上限，过一段时间再来吧" };
            }
            return { otc: null, error: "嘶……好像网卡了或者服务器炸了……" };
        }
        return { ...(await rsp.json()), error: null };
    },

    async uploadDailyImage(file, otc, session) {
        let rsp = await this.fetch("/v1/daily/img-upload-presign", {
            method: 'POST', ...this.withAuth(session),
            body: JSON.stringify({ filename: file.name, contentType: file.type, contentLength: file.size, otc })
        });
        if (!rsp.ok) { return { error: "上传请求被拒绝" }; }
        const { signedUrl } = await rsp.json();
        rsp = await fetch(signedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
        if (!rsp.ok) { return { error: "上传失败" }; }
        return { error: null };
    },

    async fetchCharacter(cid, session) {
        const rsp = await this.fetch(`/v1/character/${cid}`, { method: 'GET', ...this.withAuth(session) });
        if (!rsp.ok) { return; }
        return await rsp.json();
    },

    async patchCharacter(cid, data, session) {
        const rsp = await this.fetch(`/v1/character/${cid}`, { method: 'PATCH', ...this.withAuth(session), body: JSON.stringify(data) });
        return rsp.ok;
    },

    async postCharacterRequest(cid, session) {
        const rsp = await this.fetch(`/v1/character/${cid}/request`, { method: 'POST', ...this.withAuth(session) });
        return rsp.ok;
    },

    async fetch(apiPath, args) {
        let rsp;
        let lastError = null;
        for (const endpoint of apiEndpoints) {
            try {
                rsp = await fetch(`${endpoint}${apiPath}`, args);
                if (rsp.ok) break;
            } catch (e) {
                lastError = e;
            }
        }
        if (!rsp) {
            throw lastError;
        }
        return rsp;
    },

    withAuth(session) {
        return { headers: { Authorization: `Bearer ${session.token}` } };
    },
}

function getUserInfoDB() { return new lcDB("userinfo", { ttl: 1 * 24 * 60 * 60 }); }
function getCharacterInfoDB() { return new lcDB("characterinfo", { ttl: 7 * 24 * 60 * 60 }); }

class lcDB {
    constructor(name, { ttl = -1 } = {}) {
        this.name = `bgm-lcjs-${name}`;
        this.ttl = ttl * 1000; // s -> ms
        this.dbPromise = this.#initDB();
    }

    async #initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.name, 1);
            request.onerror = (event) => {
                console.error(`IndexedDB error: ${event.target.errorCode}`);
                reject(event.target.error);
            };
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('keyValueStore')) {
                    const store = db.createObjectStore('keyValueStore', { keyPath: 'key' });
                    store.createIndex('invalidatesAtIndex', 'invalidatesAt', { unique: false })
                }
            };
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
        });
    }

    async get(key) {
        const txn = (await this.dbPromise).transaction(['keyValueStore'], 'readonly');
        const store = txn.objectStore('keyValueStore');
        const result = await new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
        if (!result) return null;

        const { value, invalidatesAt } = result;
        if (this.ttl > 0 && invalidatesAt && Date.now() > invalidatesAt) {
            return null;
        }

        return value;
    }

    async set(key, value) {
        const txn = (await this.dbPromise).transaction(['keyValueStore'], 'readwrite');
        const store = txn.objectStore('keyValueStore');
        await new Promise((resolve, reject) => {
            const now = Date.now();
            const request = store.put({
                key,
                value,
                expiresAt: this.ttl > 0 ? now + this.ttl : null,
                invalidatesAt: this.ttl > 0 ? now + this.ttl * 2 : null,
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        await new Promise((resolve, reject) => {
            txn.oncomplete = () => resolve();
            txn.onerror = () => reject(txn.error);
        });
    }

    async getOrFetch(key, fetchFn) {
        const txn = (await this.dbPromise).transaction(['keyValueStore'], 'readonly');
        const store = txn.objectStore('keyValueStore');
        const result = await new Promise((resolve, reject) => {
            const request = store.get(key);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (result) {
            const now = Date.now();
            const { value, expiresAt, invalidatesAt } = result;
            if (this.ttl <= 0 || !expiresAt || now < expiresAt) {
                return value;
            }
            if (now < invalidatesAt) { // stale-while-revalidate
                this.#backgroundRefresh(key, fetchFn);
                return value;
            }
        }
        // fallback to fetchFn
        const value = await fetchFn();
        await this.set(key, value);
        return value;
    }

    async #backgroundRefresh(key, fetchFn) {
        const newValue = await fetchFn();
        if (newValue !== undefined) {
            await this.set(key, newValue);
        }
    }

    async clearInvalidatedEntries() {
        if (this.ttl <= 0) return;
        const txn = (await this.dbPromise).transaction(['keyValueStore'], 'readwrite');
        const store = txn.objectStore('keyValueStore');
        const index = store.index('invalidatesAtIndex');
        const now = Date.now();
        const request = index.openCursor(IDBKeyRange.upperBound(now));
        await new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    store.delete(cursor.primaryKey);
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
            txn.oncomplete = () => resolve();
            txn.onerror = () => reject(txn.error);
        });
    }
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(`bgm-lcjs-${key}`) || '{}');
}
function saveToStorage(key, value) {
    localStorage.setItem(`bgm-lcjs-${key}`, JSON.stringify(value));
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const svgRepo = {
    link: `
<svg width="18px" height="18px" viewBox="0 0 21 21" style="position: relative; top: 3px;" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Interface / Link">
<path id="Vector" d="M9.1718 14.8288L14.8287 9.17192M7.05086 11.293L5.63664 12.7072C4.07455 14.2693 4.07409 16.8022 5.63619 18.3643C7.19829 19.9264 9.7317 19.9259 11.2938 18.3638L12.7065 16.9498M11.2929 7.05L12.7071 5.63579C14.2692 4.07369 16.8016 4.07397 18.3637 5.63607C19.9258 7.19816 19.9257 9.73085 18.3636 11.2929L16.9501 12.7071"
stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>
`,
    illustrator: `
<svg width="18px" height="18px" viewBox="0 0 22 22" style="position: relative; top: 3px;" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15.5 8.5H15.51M10.5 7.5H10.51M7.5 11.5H7.51M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 13.6569 19.6569 15 18 15H17.4C17.0284 15 16.8426 15 16.6871 15.0246C15.8313 15.1602 15.1602 15.8313 15.0246 16.6871C15 16.8426 15 17.0284 15 17.4V18C15 19.6569 13.6569 21 12 21ZM16 8.5C16 8.77614 15.7761 9 15.5 9C15.2239 9 15 8.77614 15 8.5C15 8.22386 15.2239 8 15.5 8C15.7761 8 16 8.22386 16 8.5ZM11 7.5C11 7.77614 10.7761 8 10.5 8C10.2239 8 10 7.77614 10 7.5C10 7.22386 10.2239 7 10.5 7C10.7761 7 11 7.22386 11 7.5ZM8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5Z"
stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g>
</svg>
`,
    character: `
<svg width="18px" height="18px" viewBox="0 0 24 24" style="position: relative; top: 4px; left: 1px;" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12,1A11,11,0,1,0,23,12,11.013,11.013,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9.01,9.01,0,0,1,12,21ZM8,11V9a1,1,0,0,1,2,0v2a1,1,0,0,1-2,0Zm8-2v2a1,1,0,0,1-2,0V9a1,1,0,0,1,2,0ZM8,14h8a4,4,0,0,1-8,0Z"
fill="currentColor" />
</svg>
`,
    loveletter: `
<svg width="21px" height="21px" viewBox="0 0 46.023 46.023" style="position: relative; top: 3px;" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
<g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
<g id="SVGRepo_iconCarrier"> <g> <g> <path d="M45.651,20.169L40.726,2.907C40.236,1.196,38.653,0,36.876,0c-0.371,0-0.742,0.052-1.102,0.154l-26.633,7.6 c-1.029,0.293-1.882,0.97-2.4,1.905C6.228,10.58,6.1,11.69,6.389,12.705l3.382,11.85c0.582,0.213,1.147,0.471,1.671,0.809 c0.464-0.299,0.961-0.531,1.471-0.734L9.607,13.05l9.107,5.918l-2.679,5.041c0.015,0,0.028-0.003,0.044-0.003 c1.062,0,2.091,0.199,3.055,0.564l2.105-3.962l2.497,1.623l0.089,0.053c0.792,0.441,1.664,0.665,2.545,0.665 c0.483,0,0.971-0.067,1.448-0.204c1.35-0.385,2.469-1.272,3.15-2.499l1.31-2.791l8.741,5.08L23.095,27.65 c0.592,0.838,1.023,1.768,1.282,2.754l18.521-5.285c1.029-0.295,1.882-0.971,2.401-1.905 C45.82,22.279,45.945,21.197,45.651,20.169z M28.327,18.828c-0.294,0.506-0.766,0.872-1.329,1.033 c-0.564,0.161-1.156,0.097-1.672-0.176l-14.362-9.331L35.6,3.324L28.327,18.828z M33.561,14.729l4.614-9.831l4.28,15 L33.561,14.729z"></path> <path d="M16.081,26.006c-1.678,0-3.355,0.637-4.64,1.911c-1.282-1.272-2.961-1.911-4.639-1.911c-1.686,0-3.372,0.643-4.658,1.93 c-2.57,2.57-2.57,6.742,0,9.314c0.127,0.125,6.23,6.199,8.478,8.436c0.226,0.226,0.522,0.338,0.818,0.338 c0.297,0,0.595-0.112,0.82-0.338c2.248-2.236,8.351-8.311,8.477-8.436c2.573-2.572,2.573-6.744,0-9.314 C19.452,26.648,17.767,26.006,16.081,26.006z"></path> </g> </g> </g>
</svg>
`,
}

main();
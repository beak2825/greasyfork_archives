// ==UserScript==
// @name            Reddit NSFW Unblur
// @namespace       https://greasyfork.org/users/821661
// @match           https://www.reddit.com/*
// @match           https://sh.reddit.com/*
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @run-at          document-body
// @noframes
// @version         3.0.8
// @icon            https://cdn.jsdelivr.net/gh/zenstorage/Reddit-NSFW-Unblur/assets/icon.png
// @author          hdyzen
// @description     Unblur nsfw in Shreddit
// @license         MIT
// @homepage        https://github.com/zenstorage/Reddit-NSFW-Unblur
// @downloadURL https://update.greasyfork.org/scripts/485608/Reddit%20NSFW%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/485608/Reddit%20NSFW%20Unblur.meta.js
// ==/UserScript==

const PREFS = {
    enabled: GM_getValue("autoUnblur", true),
    nsfw: GM_getValue("unblurNSFW", true),
    spoiler: GM_getValue("unblurSpoiler", false),
};

const observer = new MutationObserver(repeatedTask);
observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributeFilter: ["blurred", "reason"],
});

function onceTask() {
    enableNSFWSearch();
    handlePopupVisible();
}
onceTask();

function repeatedTask() {
    removeModal();
    removeQRNSFW();
    initToggles();
    unblurPromo();

    if (PREFS.enabled && (PREFS.nsfw || PREFS.spoiler)) {
        unblurCards();
        unblurPosts();
    }
    if (PREFS.enabled && PREFS.spoiler) unblurTextSpoiler();
}
repeatedTask();

function removeModal() {
    const modal = document.querySelector("#blocking-modal");
    if (modal) modal.remove();

    const blur = document.querySelector("body > [style*='backdrop-filter']");
    if (blur) blur.remove();

    if (document.body && (document.body.style.pointerEvents || document.body.style.overflow)) {
        document.body.style.removeProperty("overflow");
        document.body.style.removeProperty("pointer-events");
    }
}

function removeQRNSFW() {
    const qr = document.querySelector("#nsfw-qr-dialog");
    if (qr) qr.remove();
}

function unblurCards() {
    const highlights = document.querySelectorAll("community-highlight-card[blurred]");
    for (const highlight of highlights) {
        const shouldUnblur = (highlight.hasAttribute("nsfw") && PREFS.nsfw) || (highlight.hasAttribute("spoiler") && PREFS.spoiler);
        if (!shouldUnblur) continue;

        highlight.removeAttribute("blurred");
    }

    const thumbs = document.querySelectorAll(
        ":is(reddit-pdp-right-rail-post, shreddit-post) [data-testid='post-thumbnail'] :is([icon-name='nsfw-fill'], [icon-name='caution-fill'])",
    );
    for (const thumb of thumbs) {
        const type = thumb.getAttribute("icon-name");
        const shouldUnblur = (type === "nsfw-fill" && PREFS.nsfw) || (type === "caution-fill" && PREFS.spoiler);

        if (!shouldUnblur) continue;

        const scrim = thumb.closest(".thumbnail-shadow");
        const blur = thumb.closest("[data-testid='post-thumbnail']")?.querySelector("img[style*='blur']");

        thumb.style.removeProperty("filter");
        blur.style.removeProperty("filter");
        scrim.remove();
    }

    const medias = document.querySelectorAll("search-telemetry-tracker shreddit-blurred-container");
    for (const media of medias) {
        if (media.blurred === false) continue;

        const nextElementIsSpoiler = media.nextElementSibling;

        if (!nextElementIsSpoiler && PREFS.nsfw) media.blurred = false;
        if (nextElementIsSpoiler && PREFS.spoiler) {
            media.blurred = false;
            nextElementIsSpoiler.remove();
        }
    }

    const searchThumbs = document.querySelectorAll(`search-telemetry-tracker[data-faceplate-tracking-context*='"type":"thumbnail"']:has(.thumbnail-blur)`);
    for (const searchThumb of searchThumbs) {
        const data = searchThumb.getAttribute("data-faceplate-tracking-context");
        const blur = searchThumb.querySelector(".thumbnail-blur");

        if (data.includes('"nsfw":true') && PREFS.nsfw) blur.classList.remove("thumbnail-blur");
        if (data.includes('"spoiler":true') && PREFS.spoiler) blur.classList.remove("thumbnail-blur");
    }
}

function unblurPosts() {
    const posts = document.querySelectorAll("shreddit-blurred-container[reason]");
    for (const post of posts) {
        if (post.blurred === false) continue;

        const reason = post.getAttribute("reason");
        post.blurred = !PREFS[reason];
    }
}

function unblurTextSpoiler() {
    const spoilers = document.querySelectorAll("shreddit-spoiler");
    for (const spoiler of spoilers) {
        if (spoiler.revealed === true) continue;
        spoiler.revealed = true;
    }
}

function unblurPromo() {
    const promo = document.querySelector("xpromo-nsfw-blocking-container");
    const prompt = promo?.shadowRoot?.querySelector(".prompt");
    if (prompt) prompt.remove();

    const viewInApp = document.querySelector("xpromo-nsfw-blocking-container .viewInApp");
    if (viewInApp) viewInApp.remove();
}

async function enableNSFWSearch() {
    const over18 = await cookieStore.get("over18");
    if (over18?.value === "1") return;

    cookieStore.set({
        name: "over18",
        value: "1",
        path: "/",
        domain: "reddit.com",
    });

    const url = new URL(window.location.href);
    if (url.pathname === "/search/") window.location.reload();
}

function handlePopupVisible() {
    const handler = (e) => {
        const wrapper = getWrapper();
        if (!wrapper) return;

        if (wrapper.classList.contains("open") && !wrapper.contains(e.target)) {
            wrapper.classList.remove("open");
        }
    };
    document.body.addEventListener("click", handler, true);
}

function getWrapper() {
    return document.body.contains(window.wrapper) ? window.wrapper : document.querySelector("#unblur-toggles-wrapper-main");
}

function createSecondaryToggle(id, labelText, initialState, onChangeHandler) {
    const label = document.createElement("label");
    label.setAttribute("for", id);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = id;
    input.id = id;
    input.checked = initialState;
    input.addEventListener("change", (e) => onChangeHandler(e.target.checked));

    const slider = document.createElement("span");
    slider.className = "slider";

    const labelSpan = document.createElement("span");
    labelSpan.className = "slider-label";
    labelSpan.textContent = labelText;

    label.appendChild(input);
    label.appendChild(slider);
    label.appendChild(labelSpan);

    return label;
}

function updateStatusIndicator(el, isChecked) {
    el.textContent = isChecked ? "ON" : "OFF";
    el.className = isChecked ? "on" : "off";
}

function onMainToggleChange(el, isChecked) {
    GM_setValue("autoUnblur", isChecked);
    PREFS.enabled = isChecked;
    updateStatusIndicator(el, isChecked);
    repeatedTask();
}

function onSecondaryToggleChange(key, isChecked) {
    GM_setValue(key, isChecked);
    PREFS[key === "unblurNSFW" ? "nsfw" : "spoiler"] = isChecked;
    repeatedTask();
}

function initToggles() {
    const wrapperExists = document.querySelector("#unblur-toggles-wrapper-main");
    if (wrapperExists) return;

    const nav = document.querySelector("header.v2 nav");
    if (!nav) return;

    const wrapper = document.createElement("div");
    wrapper.id = "unblur-toggles-wrapper-main";

    const popupToggle = document.createElement("div");
    popupToggle.id = "popup-toggle";
    popupToggle.textContent = "Unblur";

    const statusContainer = document.createElement("form");
    statusContainer.id = "status-container";

    const statusDiv = document.createElement("div");
    statusDiv.id = "status";
    statusContainer.appendChild(statusDiv);
    updateStatusIndicator(statusDiv, PREFS.enabled);

    const containerToggle = document.createElement("div");
    containerToggle.id = "container-toggle";
    containerToggle.innerHTML = `
        <label for="toggle">
            <input id="toggle" name="toggle" type="checkbox" ${PREFS.enabled ? "checked" : ""}>
            <svg viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V3ZM8.6092 5.8744C9.09211 5.60643 9.26636 4.99771 8.99839 4.5148C8.73042 4.03188 8.12171 3.85763 7.63879 4.1256C4.87453 5.65948 3 8.61014 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 8.66747 19.1882 5.75928 16.5007 4.20465C16.0227 3.92811 15.4109 4.09147 15.1344 4.56953C14.8579 5.04759 15.0212 5.65932 15.4993 5.93586C17.5942 7.14771 19 9.41027 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 9.3658 6.45462 7.06997 8.6092 5.8744Z"></path>
            </svg>
        </label>
    `;
    statusContainer.appendChild(containerToggle);

    const mainToggleInput = containerToggle.querySelector("#toggle");
    if (mainToggleInput) {
        mainToggleInput.addEventListener("change", (e) => onMainToggleChange(statusDiv, e.target.checked));
    }

    const selectedOps = document.createElement("div");
    selectedOps.id = "selected-ops";

    const nsfwToggle = createSecondaryToggle("toggle-nsfw", "Unblur NSFW", PREFS.nsfw, (isChecked) => onSecondaryToggleChange("unblurNSFW", isChecked));
    selectedOps.appendChild(nsfwToggle);

    const spoilerToggle = createSecondaryToggle("toggle-spoiler", "Unblur Spoiler", PREFS.spoiler, (isChecked) => onSecondaryToggleChange("unblurSpoiler", isChecked));
    selectedOps.appendChild(spoilerToggle);

    statusContainer.appendChild(selectedOps);

    wrapper.appendChild(popupToggle);
    wrapper.appendChild(statusContainer);

    wrapper.addEventListener("click", (e) => {
        if (e.target.id === "unblur-toggles-wrapper-main" || e.target.id === "popup-toggle") wrapper.classList.toggle("open");
    });

    nav.appendChild(wrapper);
    window.wrapper = wrapper;
}

GM_addStyle(`
    /* CSS Modal Fallback */
    body[style*='pointer-events'] {
        pointer-events: revert !important;
    }
    body[style*='overflow'] {
        overflow: revert !important;
    }
    #blocking-modal,
    #nsfw-qr-dialog,
    body > [style*="backdrop-filter"] {
        display: none !important;
    }
    #unblur-toggles-wrapper-main {
        pointer-events: auto;
        z-index: 999;
        font-size: 15px;
        font-weight: 600;
        padding: 0 15px;
        cursor: pointer;
        background-color: var(--color-secondary-background);
        border-radius: 999px;
        height: calc(var(--shreddit-header-height) - 1rem);
        display: flex;
        align-items: center;
        justify-content: center;
        grid-column: -1;
        min-width: max-content;
        user-select: none;
        &:hover {
            background-color: var(--button-color-background-hover);
        }
        &.open #status-container {
            visibility: visible;
            opacity: 1;
        }
    }
    #status-container {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        cursor: auto;
        visibility: hidden;
        opacity: 0;
        position: absolute;
        top: 100%;
        right: 0;
        background-color: #1f1b19;
        color: #d1c2b7;
        font-family: system-ui, sans-serif;
        font-size: 28px;
        transition: 0.1s ease;
        border-radius: 10px;
        &:has(input#toggle:not(:checked)) {
            & label {
                color: #bdafa5;
            }
            & #selected-ops input:checked + .slider {
                background-color: hsl(15, 61%, 59%);
                &::before {
                    background-color: hsl(17, 75%, 40%);
                }
            }
        }
    }
    #status {
        padding: 10px;
        width: 180px;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.03);
    }
    #container-toggle {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 80px;
        font-size: 16px;
    }
    #toggle {
        display: none;
        & + svg {
            transition: 0.1s ease;
            cursor: pointer;
            width: 4rem;
            height: auto;
            padding: 5px;
            border-radius: 10px;
            fill: #cc6b47;
            &:hover {
                fill: #db683e;
                background-color: rgba(255, 255, 255, 0.1);
            }
        }
        &:checked + svg {
            fill: #ff3e00;
        }
    }
    #selected-ops {
        font-size: 16px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 8px;
        --slider-height: 1.4rem;
        --slider-width: 2.4rem;
        --slider-radius: 20px;
        --slider-background: rgba(255, 255, 255, 0.1);
        --slider-active-background: #ff7f55;
        --slider-thumb-size: 1rem;
        --slider-thum-offset: 0.2rem;
        --slider-thumb-background: rgba(202, 57, 0, 0.801);
        & > label {
            display: flex;
            justify-content: start;
            cursor: pointer;
            user-select: none;
            font-size: 16px;
            & input {
                display: none;
                &:checked + .slider {
                    background-color: var(--slider-active-background);
                    &::before {
                        scale: 1.15;
                        left: calc(var(--slider-width) - var(--slider-thumb-size) - var(--slider-thum-offset));
                        background-color: var(--slider-thumb-background);
                    }
                }
            }
            & .slider-label {
                flex-grow: 1;
                text-align: center;
                color: #d1c2b7;
                line-height: normal;
            }
            & .slider {
                position: relative;
                display: flex;
                align-items: center;
                height: var(--slider-height);
                width: var(--slider-width);
                border-radius: var(--slider-radius);
                background-color: var(--slider-background);
                transition: 0.1s ease;
                &::before {
                    content: '';
                    position: absolute;
                    border-radius: inherit;
                    height: var(--slider-thumb-size);
                    width: var(--slider-thumb-size);
                    left: var(--slider-thum-offset);
                    background-color: var(--slider-background);
                    transition: 0.3s ease;
                }
            }
        }
    }
    @media (hover: none) and (any-pointer: coarse) {
        #menu-unblur {
            margin-left: 0.5rem;
        }
    }
`);

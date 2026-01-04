// ==UserScript==
// @name         YouTube GVDS1750 (GarbageVideoDisposalSystem, >1750 view)
// @namespace    http://tampermonkey.net/
// @version      5
// @description  English Only - Youtube recommends garbage videos with 0-1750 views, so we put them in the garbage disposal.
// @author       sir rob
// @include      https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536030/YouTube%20GVDS1750%20%28GarbageVideoDisposalSystem%2C%20%3E1750%20view%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536030/YouTube%20GVDS1750%20%28GarbageVideoDisposalSystem%2C%20%3E1750%20view%29.meta.js
// ==/UserScript==

// ---------------------------------------------------------------------------

// Known issues:
// Only 20 something videos are filtered on /watch (dynamic load issue) - emoji on reopenbutton moves around? idk - The hate on pineapple on pizza

// Future plans/ideas:
// call replacement renderer to replace empty blocks  - add support for more languages - mine crypto in unsuspecting users browsers teehee

// Changelog so I can start remembering what issues I've fixed and what I've fucked up again:
// v1.40 Fixed char limit inop when scrolling - Channelgrab working - open/close/open crashes fixed with new "memory" system (lol)
// v1.41 Wow, it mostly works? Code cleaned up, some shit reorganized, other code removed = 20 lines less and twice the functionality from v1.39!!! Even with changelog!
// v1.42 new memory, somehow simpler than the last? - Tested in Opera/Chrome/Firefox - add video player monitor
// v1.43 replace player sniffer, replace with full screen listener grabs from browser not youtube
// v1.44 new badvideo logic, able to set a threshold for the filter in preparation for filtering on /watch -
// v1.45 another new badvideo logic, previous was unstable/unable to differentiate 1.4k from 1.4m, or anything under 1000 - Removed redundant logic that was getting in the way.
// v1.46-50..rolled back to v1.43, I don't want to talk about it (several blocks of new logic were as reliable as my 04' Land Rover)
// v1.51 start work on 1750 view filter for /watch - add red 1 pixel border around open button, centered emoji (its off, heck) - implemented random bits of logging for debug (why didn't I do this earlier..)
// v1.52 fine tuning on filter - added "no view" to /watch filter
// v1.53 let reopenBtn render when refreshing or going direct to /watch video page.. Added redundant logic that will get in the way (I don't know which one is the one thats working, and they're all working atm so..)
// v1.54 aesthetics time, changes to sizes of stuff, reopenbtn is just a toggle now, always visible can open/close UI
// v1.55 UI panel loads deleted videos on page load when UI is closed
// v1.56 short half ass attempt at making the deleted videos linked to their original url
// v1.57 remove the above - clean up UI panel and make it a solid size
// v2 add removal for "viewing" because youtube thinks I want to watch some snot nosed kid play 10 fps dayz along with 2 other people, or some dude printing something, made it v2 so it updates for the 2 people that downloaded this script for some reason
// v3 script became unreliable, maybe due to a youtube update. Fixed that, also added toggle to automatically select "do not recommend" for filtered videos. If it proves reliable I'll add a toggle in the UI, for now just use the below toggle
// v4 clickable links in UI - redo a bunch of logic thanks to freeGPT. - fix badvideo logic - some aesthetics stuff - added toggle in UI for on/off, watched, and DNR button, which is still unreliable but at least you can turn it on and off
// v5 fixed filtering logic after youtube update

// these settings should probably stay the same past v1.30ish
let g_FilteringDebounceTimer = null;
let g_VideosFiltering = true;
let g_ShortsFiltering = true;
let g_RemoveContainAdsSign = true;
let g_RemovedVideosMap = new Map();
let g_PanelVisible = false;

function getToggle(key, fallback = true) {
    const val = localStorage.getItem(key);
    if (val === null) return fallback;
    return val === "true";
}

let g_ScriptEnabled = getToggle("ytf_script_enabled");
let g_AutoClickNotInterested = getToggle("ytf_auto_not_interested");
let g_FilterWatchedVideos = getToggle("ytf_filter_watched");

    const style = document.createElement('style');
    style.textContent = `
        .ui-button {
            background: transparent;
            border: 1px solid #ccc;
            color: #fff;
            padding: 4px 6px;
            border-radius: 6px;
            font-size: 10px;
            cursor: pointer;
            transition: box-shadow 0.2s ease;
        }

        .ui-button:hover {
            box-shadow: 0 0 6px 3px rgba(255, 0, 0, 0.6);
        }

        .ui-button:focus {
            outline: none;
        }

        #removed-videos-panel {
            transition: opacity 0.25s ease, transform 0.25s ease;
            opacity: 0;
            transform: scale(0.95);
        }

        #removed-videos-panel.show {
            opacity: 1;
            transform: scale(1);
        }
    `;
    document.head.appendChild(style);

// Always show reopenbutton, now opens and closes UI + stays visible at all times
function ShowReopenButton() {
    let reopenBtn = document.getElementById("reopen-panel-btn");

    if (!reopenBtn) {
        reopenBtn = document.createElement("div");
        reopenBtn.innerText = "✦";
        reopenBtn.id = "reopen-panel-btn";
        Object.assign(reopenBtn.style, {
            position: "absolute", top: "19px", left: "50px",
            width: "16px", height: "16px", display: "flex",
            alignItems: "center", justifyContent: "center",
            borderRadius: "50%", backgroundColor: "white",
            border: "1px solid red", cursor: "pointer",
            zIndex: "9999", pointerEvents: "auto", fontSize: "16px"
        });
        document.body.appendChild(reopenBtn);
    }

    reopenBtn.onclick = () => {
        let panel = document.getElementById("removed-videos-panel");

        if (!panel) {
            CreateRemovedVideosPanel();
            panel = document.getElementById("removed-videos-panel");
        }

        const isHidden = panel.style.display === "none" || panel.style.display === "";

        if (isHidden) {
            panel.style.display = "block";
            requestAnimationFrame(() => panel.classList.add("show"));
            g_PanelVisible = true;
        } else {
            panel.classList.remove("show");
            setTimeout(() => {
                panel.style.display = "none";
            }, 250);
            g_PanelVisible = false;
        }
    };

}

function HandleFullscreenChange() {
    const isFullscreen = !!document.fullscreenElement;
    const panel = document.getElementById("removed-videos-panel");
    const reopenBtn = document.getElementById("reopen-panel-btn");

    if (isFullscreen) {
        if (panel) panel.style.display = "none";
        if (reopenBtn) reopenBtn.style.display = "none";
    } else {
        if (g_PanelVisible && panel) panel.style.display = "block";
        if (reopenBtn) reopenBtn.style.display = "block";
    }
}

document.addEventListener("fullscreenchange", HandleFullscreenChange);

function FilterWatchSidebar() {
    const lockups = document.querySelectorAll("yt-lockup-view-model.lockup");

    lockups.forEach((el, index) => {
        const viewsSpan = Array.from(el.querySelectorAll("span"))
            .find(span => {
                const txt = span.textContent.trim().toLowerCase();
                return txt.includes("views") || txt.includes("watching");
            });

        if (!viewsSpan) return;

        const viewsText = viewsSpan.textContent.trim().toLowerCase();
        if (viewsText.includes("no views") || viewsText === "") return el.remove();

        const match = viewsText.match(/([\d.,]+)\s*([KMkm]?)/);
        if (!match) return;

        let value = parseFloat(match[1].replace(',', '.'));
        const suffix = match[2].toLowerCase();
        if (suffix === 'k') value *= 1000;
        else if (suffix === 'm') value *= 1000000;

        if (value < 1750) el.remove(); // CHANGE THIS TO CHANGE AMOUNT FILTERED!
    });
}

function CreateRemovedVideosPanel() {
    let panel = document.getElementById("removed-videos-panel");
    if (!panel) {
        panel = document.createElement("div");
        panel.id = "removed-videos-panel";
        Object.assign(panel.style, {
                 position: "absolute",
                 top: "10px",
                 left: "260px",
                 width: "160px",
                 height: "100px",
                 background: "rgba(0, 0, 0, 0.65)",
                 color: "rgba(255, 255, 255, 0.75)",
                 padding: "8px 10px",
                 borderRadius: "8px",
                 zIndex: "9999",
                 fontSize: "11px",
                 overflow: "hidden",
                 pointerEvents: "auto",
                 userSelect: "none",
                 display: "none"
        });

        panel.innerHTML = `
            <div style="font-weight:bold; margin-bottom:6px; color: #bdb7c6;">🗑️ Videos</div>
            <ul id='removed-videos-list' style='padding-left: 14px; margin: 0; height: 50px; overflow-y: auto; color: #737f64;'></ul>
        `;

        // Close button
        const closeBtn = document.createElement("button");
        closeBtn.innerText = "✕";
        Object.assign(closeBtn.style, {
            position: "absolute", top: "2px", right: "4px",
            background: "transparent", color: "#70647f", border: "none",
            cursor: "pointer", fontSize: "12px", pointerEvents: "auto"
        });
        closeBtn.onclick = () => {
            g_PanelVisible = false;
            panel.style.display = "none";
            ShowReopenButton();
        };
        panel.appendChild(closeBtn);

        // Clear button
        const clearBtn = document.createElement("button");
        clearBtn.innerText = "Clear";
        Object.assign(clearBtn.style, {
            position: "absolute", bottom: "4px", left: "8px",
            background: "#ffffff00", color: "#bdb7c6", border: "none",
            cursor: "pointer", fontSize: "10px", pointerEvents: "auto"
        });
        clearBtn.onclick = () => {
            g_RemovedVideosMap.clear();
            document.getElementById("removed-videos-list").innerHTML = "";
        };
        panel.appendChild(clearBtn);

        // Options button ⚙️
        const optionsBtn = document.createElement("button");
        optionsBtn.innerText = "⚙️";
        Object.assign(optionsBtn.style, {
            position: "absolute", bottom: "4px", left: "40px",
            background: "#ffffff00", color: "#bdb7c6", border: "none",
            cursor: "pointer", fontSize: "10px", pointerEvents: "auto"
        });
        panel.appendChild(optionsBtn);

        // Options popup
        const optionsPopup = document.createElement("div");
        optionsPopup.id = "options-popup";
        Object.assign(optionsPopup.style, {
                position: "absolute",
                bottom: "20px",
                left: "1px",
                background: "rgba(0, 0, 0, 0.85)",
                color: "#bdb7c6",
                padding: "3px",
                borderRadius: "3px",
                fontSize: "8px",
                zIndex: "9999",
                display: "none",
                pointerEvents: "auto",
                maxHeight: "70px",
                overflowY: "auto"


        });

        optionsPopup.innerHTML = `
            <label style="display:block; margin-bottom:4px;">
                <input type="checkbox" id="toggle-script-enabled" ${g_ScriptEnabled ? "checked" : ""}>
                Script Enabled
            </label>
            <label style="display:block; margin-bottom:4px;">
                <input type="checkbox" id="toggle-not-interested" ${g_AutoClickNotInterested ? "checked" : ""}>
                Auto 'Not Interested'
            </label>
            <label style="display:block;">
                <input type="checkbox" id="toggle-filter-watched" ${g_FilterWatchedVideos ? "checked" : ""}>
                Filter Watched
            </label>
        `;
        panel.appendChild(optionsPopup);

        optionsBtn.onclick = () => {
            optionsPopup.style.display = optionsPopup.style.display === "none" ? "block" : "none";
        };

        document.body.appendChild(panel);
        MakePanelDraggable(panel);

        // Add event listeners for checkboxes
        panel.addEventListener("change", (e) => {
            const target = e.target;

            if (target.id === "toggle-script-enabled") {
                g_ScriptEnabled = target.checked;
                localStorage.setItem("ytf_script_enabled", g_ScriptEnabled);
                console.log("Script Enabled:", g_ScriptEnabled);
            }

            if (target.id === "toggle-not-interested") {
                g_AutoClickNotInterested = target.checked;
                localStorage.setItem("ytf_auto_not_interested", g_AutoClickNotInterested);
                console.log("Auto Not Interested:", g_AutoClickNotInterested);
            }

            if (target.id === "toggle-filter-watched") {
                g_FilterWatchedVideos = target.checked;
                localStorage.setItem("ytf_filter_watched", g_FilterWatchedVideos);
                console.log("Filter Watched:", g_FilterWatchedVideos);
            }
        });
            clearBtn.className = "ui-button";
            optionsBtn.className = "ui-button";
            closeBtn.className = "ui-button";
    }

  if (g_PanelVisible) {
      panel.style.display = "block";
      requestAnimationFrame(() => panel.classList.add("show"));
  } else {
      panel.classList.remove("show");
      panel.style.display = "none";
  }
}

function MakePanelDraggable(panel) {
    let isDragging = false;
    let offsetX, offsetY;

    panel.addEventListener("mousedown", (e) => {
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") return; // skip buttons
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.cursor = "move";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        panel.style.left = `${e.clientX - offsetX}px`;
        panel.style.top = `${e.clientY - offsetY}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        panel.style.cursor = "default";
    });
}

function AddToRemovedVideosPanel(title, channelHandle, videoUrl) {
    if (!title) return;
    const key = title + "|" + channelHandle;
    const list = document.getElementById("removed-videos-list");
    if (!list) return;

    if (g_RemovedVideosMap.has(key)) {
        g_RemovedVideosMap.set(key, g_RemovedVideosMap.get(key) + 1);
        const item = document.getElementById("removed-" + key);
        if (item) {
            const link = item.querySelector("a");
            if (link) link.innerText = `${title.slice(0, 20)}... (x${g_RemovedVideosMap.get(key)})`;
        }
    } else {
                g_RemovedVideosMap.set(key, 1);
        const customTextColor = "#968ca4";

        const li = document.createElement("li");
        li.id = "removed-" + key;
        li.style.pointerEvents = "auto";
        li.style.color = customTextColor;

        const anchor = document.createElement("a");
        anchor.href = videoUrl || "#";
        anchor.target = "_blank";
        anchor.style.color = customTextColor;
        anchor.style.textDecoration = "underline";
        anchor.innerText = `${title.slice(0, 20)}... (x1)`;

        li.appendChild(anchor);
        li.appendChild(document.createTextNode(` - ${channelHandle}`));
        list.appendChild(li);
    }

}

function ClickNotInterested(videoElement) {
    if (!g_AutoClickNotInterested || !videoElement) {
        console.log("Not interested skipped (toggle off or invalid element).");
        return;
    }

    const menuButton = videoElement.querySelector("#button[aria-label*='Action menu']");
    if (!menuButton) {
        console.warn("3-dot menu button not found.");
        return;
    }

    console.log("Opening 3-dot menu...");
    menuButton.click();

    setTimeout(() => {
        const items = Array.from(document.querySelectorAll("ytd-menu-service-item-renderer"));
        const notInterested = items.find(item =>
            item.textContent.trim().toLowerCase().includes("not interested")
        );

        if (notInterested) {
            console.log("Clicking 'Not interested'...");
            notInterested.click();
        } else {
            console.warn("'Not interested' button not found.");
        }
    }, 300);
}

function IsBadVideo(viewsEl) {
    if (!viewsEl || !viewsEl.innerText) return false;

    const text = viewsEl.innerText.toLowerCase().trim();
    console.log("Checking view count text:", text);

    if (text.includes("no views") || text === "") {
        return true;
    }

    const match = text.match(/([\d,.]+)\s*([km]?)/i);

    if (!match) {
        console.warn("No number matched in:", text);
        return false;
    }

    let number = parseFloat(match[1].replace(',', '.'));
    if (isNaN(number)) return false;

    const suffix = match[2].toLowerCase();
    if (suffix === 'k') number *= 1_000;
    else if (suffix === 'm') number *= 1_000_000;

    const isWatching = text.includes("watching");

    if (number < 3750) {
        console.log(`Marking as low count (${isWatching ? "watching" : "views"}):`, Math.round(number));
        return true;
    }

    return false;
}


function UpdateVideoFiltering() {
    console.log("UpdateVideoFiltering() called");

    if (!g_VideosFiltering || !IsHomepage()) {
        console.warn("Filtering skipped due to config or wrong page");
        return;
    }

    if (g_PanelVisible) CreateRemovedVideosPanel();
    else ShowReopenButton();

    const items = document.querySelectorAll("ytd-rich-item-renderer");

    for (const item of items) {
        const videoElement = item.querySelector("yt-lockup-view-model");
        if (!videoElement) continue;

        const titleEl = videoElement.querySelector(".yt-lockup-metadata-view-model-wiz__title span");
        const handleEl = videoElement.querySelector("a[href^='/@']");
        const viewsEl = Array.from(videoElement.querySelectorAll(".yt-content-metadata-view-model-wiz__metadata-row span"))
            .find(el => el.innerText.toLowerCase().includes("views"));

        const title = titleEl ? titleEl.textContent.trim() : "Unknown Title";
        const channelHandle = handleEl ? handleEl.getAttribute("href").replace("/", "") : "Unknown";
        const videoLinkEl = videoElement.querySelector("a[href^='/watch']");
        const videoUrl = videoLinkEl?.href || null;

        const isLowView = IsBadVideo(viewsEl);
        const hasProgress = videoElement.querySelector("#progress") != null;

        if ((g_ScriptEnabled && isLowView) || (g_FilterWatchedVideos && hasProgress)) {
            if (isLowView) {
                console.log(`%cRemoved low-view video: "${title}" from @${channelHandle}`, "color: red; font-weight: bold;");
            } else {
                console.log(`Removed watched video: "${title}" from @${channelHandle}`);
            }
            AddToRemovedVideosPanel(title, channelHandle, videoUrl);
            ClickNotInterested(videoElement);
            item.remove();
        }
    }
}


function ObserveHomepageVideos() {
    console.log("ObserveHomepageVideos() triggered");

    const grid =
        document.querySelector("ytd-rich-grid-renderer") ||
        document.querySelector("ytd-two-column-browse-results-renderer ytd-rich-grid-renderer");

    if (!grid) {
        console.warn("Homepage grid not found, retrying...");
        setTimeout(ObserveHomepageVideos, 500);
        return;
    }

    const observer = new MutationObserver(() => {
        if (g_FilteringDebounceTimer) clearTimeout(g_FilteringDebounceTimer);

        g_FilteringDebounceTimer = setTimeout(() => {
            console.log("Homepage mutation observed → running UpdateVideoFiltering()");
            UpdateVideoFiltering();
        }, 300); // spam delay
    });

    observer.observe(grid, { childList: true, subtree: true });
    console.log("Started observing homepage grid");
    setTimeout(UpdateVideoFiltering, 500);
}

function IsHomepage() {
    return location.pathname === "/";
}
function IsNumber(i) { return i >= '0' && i <= '9'; }
function IsSpace(i) { return i == ' '; }
function IsSeparator(i) { return i == '.' || i == ','; }

function RemoveContainAdsSign() {
    if (g_RemoveContainAdsSign) {
        const styleElement = document.createElement('style');
        document.head.appendChild(styleElement);
        styleElement.sheet.insertRule(".ytInlinePlayerControlsTopLeftControls { display: none }", 0);
    }
}

document.addEventListener("yt-navigate-finish", () => {
    console.log("yt-navigate-finish triggered");

    g_RemovedVideosMap.clear();
    g_PanelVisible = false;

    ShowReopenButton();

    CreateRemovedVideosPanel();
    RemoveContainAdsSign();

    if (location.pathname.startsWith("/watch")) {
        setTimeout(FilterWatchSidebar, 500);
    } else if (IsHomepage()) {
        setTimeout(ObserveHomepageVideos, 1000);
        setTimeout(() => {
            console.log("Initial manual filtering pass");
            UpdateVideoFiltering();
        }, 500);
    }
});


window.addEventListener("load", () => {
    ShowReopenButton();
    if (location.pathname.startsWith("/watch")) {
        setTimeout(() => {
            try { FilterWatchSidebar(); } catch (e) { console.error("FilterWatchSidebar failed:", e); }
        }, 1000);
    }
});





// video where I make this script, subscribe to support me (: https://www.youtube.com/watch?v=xvFZjo5PgG0


// this used to be under 120 lines, es ist, als ware ich ein BMW ingenieur. Die halfte davon ist definitiv nicht nutzlos und ist absolut notwendig, um wie vorgesehen zu funktionieren

// ==UserScript==
// @name         Global script
// @namespace    sami@kankaristo.fi
// @version      2.40.0
// @description  Global script (run everywhere).
// @author       sami@kankaristo.fi
// @match        *://*/*
// @grant        GM_openInTab
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/376284/Global%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/376284/Global%20script.meta.js
// ==/UserScript==


Util.LOGGING_ID = "Global userscript";


/**
 * Key event listener.
 *
 * @param {*} event - The key event.
 */
function KeyEventListener(event) {
    //Util.Log("Caught event: ", event);
    
    if (event.ctrlKey && event.shiftKey && (event.key == "H") && (event.type == "keydown")) {
        // Open "Synced tabs" on ctrl+shift+h
        Util.OpenUrl("about://history/syncedTabs", false);
    }
    else if (event.ctrlKey && event.altKey && (event.key == "i")) {
        // Invert element under mouse
        var element = Util.GetElementUnderMouse();
        Util.Log("Invert element under mouse: ", element);
        
        if (element == null) {
            return;
        }
        
        element.style.filter = (
            ((element.style.filter == null) || (element.style.filter == ""))
            ? "invert(1) hue-rotate(180deg)"
            : ""
        );
    }
    else if (event.altKey && (event.key == "p" || event.code == "KeyP") && !event.repeat) {
        Util.Log("Peek window/tab title");
        event.preventDefault();
        Util.Log(event);
        // Peek the window/tab title (without the mouse)
        var peekTitle = document.querySelector(".mod-peek-title");
        if (peekTitle == null) {
            var peekTitleContainer = document.createElement("div");
            peekTitleContainer.className = "mod-peek-title-container";
            document.body.append(peekTitleContainer);
            peekTitle = document.createElement("p");
            peekTitle.className = "mod-peek-title";
            peekTitleContainer.append(peekTitle);
        }
        
        Util.Log("peekTitle:", peekTitle);
        Util.Log("event.type:", event.type);
        
        if (peekTitle.textContent != document.title) {
            peekTitle.textContent = document.title;
        }
        
        if (event.type == "keydown") {
            Util.Log("Show");
            peekTitle.parentElement.style.display = "block";
        }
        else {
            Util.Log("Hide");
            peekTitle.parentElement.style.display = "none";
        }
    }
    else if (event.ctrlKey && (event.key == "s") && (event.type == "keydown")) {
        Util.Log("Ctrl+S");
        
        // Trello save button(s)
        var trelloSaveButtons = document.getElementsByClassName("js-save-edit");
        for (var i = 0; i < trelloSaveButtons.length; ++i) {
            var saveButton = trelloSaveButtons[i];
            if (saveButton.offsetParent !== null) {
                Util.Log("Click js-save-edit");
                saveButton.dispatchEvent(Util.CreateClickEvent());
            }
        }
        
        // YouTube save button
        document.querySelector("button[aria-label='More actions']")?.click();
        setTimeout(
            () => {
                // Click "More actions" (three dots)
                var moreActions = (
                    document.querySelector("button[aria-label='More actions']")
                    || document.querySelector("button[aria-label='Lisää toimintoja']")
                );
                moreActions?.click();
                // Click "Save" button
                var menuButtons = document.querySelectorAll("ytd-menu-service-item-renderer");
                for (const menuButton of menuButtons) {
                    const buttonText = menuButton.textContent.trim();
                    if (buttonText == "Save" || buttonText == "Tallenna") {
                        menuButton.click();
                        break;
                    }
                }
            },
            500
        );
        
        event.stopPropagation();
        event.preventDefault();
    }
}


/**
 * Init Google Drive mods.
 */
function InitGoogleDrive() {
    const header = document.querySelector("header");
    const userListContainer = document.querySelector(".gb_Nb");
    
    if ((header == null) || (userListContainer == null)) {
        setTimeout(InitGoogleDrive, 0);
        
        return;
    }
    
    Util.Log("InitGoogleDrive()");
    
    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "absolute";
    buttonContainer.style.bottom = "-10px";
    buttonContainer.style.left = "10px";
    buttonContainer.classList.add("mod-user-switcher-container");
    header.append(buttonContainer);
    
    const createSwitchUserButton = (index) => {
        index = index.toString();
        
        const button = document.createElement("button");
        button.textContent = "/u/" + index;
        button.style.border = "0";
        
        const clickHandler = (event) => {
            // Current URL
            let url = window.location.href;
            
            // Switch user in URL
            url = url.replace(/\/drive\/u\/\d/, "/drive/u/" + index);
            
            if (event.ctrlKey || (event.which == 2)) {
                // Ctrl+click or middle click, open in new wincow
                window.open(url);
            }
            else {
                // Open in current window
                window.location.href = url;
            }
        };
        
        button.addEventListener("click", clickHandler);
        button.addEventListener("auxclick", clickHandler);
        
        const url = window.location.href;
        const isCurrentUser = url.includes("/u/" + index);
        if (isCurrentUser) {
            button.classList.add("mod-current");
        }
        
        return button;
    };
    
    // Count the number of users
    const userCount = userListContainer.childNodes.length;
    
    for (let i = 0; i <= userCount; ++i) {
        let button = createSwitchUserButton(i);
        buttonContainer.append(button);
    }
}


var UPDATE_LOOPS = {};


UPDATE_LOOPS["app.slack.com"] = (_) => {
    //document.title = document.title.replace(/\|[^|]+\|/gi, "|");
    document.title = document.title.replace(/( \| )?Slack( \| )?/gi, "");
};


const newTrackingNumberRegex = /(\(New Tracking Number:)([^ ])/i;
UPDATE_LOOPS["global.cainiao.com"] = (_) => {
    // Add space before and after "(New tracking number:", for easier copy-pasting
    var trackingNumber = document.querySelector("p.waybill-num");
    var replacedTextContent = trackingNumber?.textContent.replace(
        newTrackingNumberRegex,
        " $1 $2"
    );
    
    if ((trackingNumber != null) && (trackingNumber?.textContent != replacedTextContent)) {
        Util.Log("Adding space before and after \"(New tracking number:\"");
        trackingNumber.textContent = replacedTextContent;
    }
};


UPDATE_LOOPS["calendar.google.com"] = (_) => {
    // Replace Google Workspace name with "Google Calendar"
    document.title = document.title.replace("Kankaristo.fi – Kalenteri", "Google Calendar");
    
    // Remove "Aikavyöhyke" from world clocks (hides the name of the city otherwise)
    document.querySelectorAll("div[title*='Aikavyöhyke']").forEach(
        (worldClock) => {
            worldClock.textContent = worldClock.textContent.replace("Aikavyöhyke: ", "");
        }
    );
};


UPDATE_LOOPS["devel.crfhealth.com/gerrit"] = (_) => {
    // Set history-name attribute with the name of whomever made the change
    document.querySelectorAll("div.com-google-gerrit-client-change-Message_BinderImpl_GenCss_style-name").forEach(
        (elem) => elem.setAttribute("history-name", elem.textContent)
    );
    
    // Modify some of the commands that Gerrit gives
    document.querySelectorAll(".com-google-gwtexpui-clippy-client-ClippyCss-label").forEach(
        (elem) => {
            var text = elem.textContent;
            // Remove username and port (not needed, they're in SSH config)
            text = text.replace(
                "ssh://sami.kankaristo@devel.crfhealth.com:29418",
                "ssh://devel.crfhealth.com"
            );
            // Add -xe to cherry-pick command (add commit ID to message and open an editor)
            text = text.replace(
                "git cherry-pick FETCH_HEAD",
                "git cherry-pick -xe FETCH_HEAD"
            );
            
            if (elem.textContent != text) {
                elem.textContent = text;
            }
        }
    );
    
    var sessionExpiredSignInButton = document.querySelector("button.gwt-Button");
    if ((sessionExpiredSignInButton != null) && (sessionExpiredSignInButton.textContent == "Sign In")) {
        sessionExpiredSignInButton.click();
    }
};


var gerritLoginDone = false;
UPDATE_LOOPS["devel.crfhealth.com/gerrit/login"] = (_) => {
    if (gerritLoginDone) {
        return;
    }
    
    Util.Log("Gerrit login");
    
    var userInput = document.querySelector("#f_user");
    Util.Log("User input: ", userInput);
    if ((userInput != null) && (userInput.value == "sami.kankaristo")) {
        var rememberMeCheckbox = document.querySelector("#f_remember");
        Util.Log("Remember me checkbox: ", rememberMeCheckbox);
        if (rememberMeCheckbox != null) {
            rememberMeCheckbox.checked = true;
        }
        
        var passwordInput = document.querySelector("#f_pass");
        Util.Log("Password input: ", passwordInput);
        if ((passwordInput != null) && (passwordInput.value != "")) {
            var signInButton = document.querySelector("input[type=submit][value='Sign In']");
            Util.Log("Sign in button: ", signInButton);
            if (signInButton != null) {
                gerritLoginDone = true;
                signInButton.click();
            }
        }
    }
};


UPDATE_LOOPS["discord.com"] = (_) => {
    // Add "Discord" to the end of the title
    if (!document.title.includes("Discord")) {
        document.title += " - Discord";
    }
};


UPDATE_LOOPS["drive.google.com"] = (url) => {
    // Add current user into Google Drive title
    const user = url.match(/\/u\/[0-9]/gi)?.[0].replace("/u/", "");
    if (user != null) {
        document.title = document.title.replace(/Google Drive( \([0-9]\))?/gi, "Google Drive (" + user + ")");
    }
};


UPDATE_LOOPS["docs.google.com\/spreadsheets"] = (url) => {
    // Automatically set some PDF export options for spreadsheet invoices
    // Google Sheets is really shitty to automate, can't do much here
    
    var topMarginElement = document.querySelector("input[aria-label*='Ylämarginaali']");
    //Util.Log("topMarginElement: ", topMarginElement);
    if (topMarginElement != null
        && (topMarginElement.value.startsWith("1,778")
            || topMarginElement.value.startsWith("1,78")
            || topMarginElement.value.startsWith("1,905"))) {
        topMarginElement.value = "0,5";
    }
    
    var leftMarginElement = document.querySelector("input[aria-label*='Vasen marginaali']");
    if (leftMarginElement != null
        && (leftMarginElement.value.startsWith("1,778")
            || leftMarginElement.value.startsWith("1,78")
            || leftMarginElement.value.startsWith("1,905"))) {
        leftMarginElement.value = "0,5";
    }
    
    var rightMarginElement = document.querySelector("input[aria-label*='Oikea marginaali']");
    if (rightMarginElement != null
        && (rightMarginElement.value.startsWith("1,778")
            || rightMarginElement.value.startsWith("1,78")
            || rightMarginElement.value.startsWith("1,905"))) {
        rightMarginElement.value = "0,5";
    }
    
    var bottomMarginElement = document.querySelector("input[aria-label*='Alamarginaali']");
    if (bottomMarginElement != null
        && (bottomMarginElement.value.startsWith("1,778")
            || bottomMarginElement.value.startsWith("1,78")
            || bottomMarginElement.value.startsWith("1,905"))) {
        bottomMarginElement.value = "0,5";
    }
};


var userScriptUpdateClicked = false;
UPDATE_LOOPS["greasyfork.org/.+/admin\\?autoSync"] = (_) => {
    // Click the "Update and sync now" button automatically
    if (!userScriptUpdateClicked) {
        userScriptUpdateClicked = true;
        Util.Log("Update and sync userscript");
        var updateAndSyncButton = document.querySelector("input[name=update-and-sync]");
        updateAndSyncButton?.click();
    }
};


UPDATE_LOOPS["jenkins.+.signanthealth.com.*"] = (url) => {
    document.querySelectorAll("a[tooltip*='GERRIT_PORT']").forEach(
        (tooltip) => {
            // Remove some useless info from the tooltip, to make it smaller
            var tooltipText = tooltip.getAttribute("tooltip");
            tooltipText.replace(/MAX_NUMBER_OF_DEPLOYED_VERSIONS=[0.9]+<br>/, "");
            tooltipText.replace(/GERRIT_CHANGE_COMMIT_MESSAGE=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_NEW_REV=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_CHANGE_OWNER=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_CHANGE_OWNER_EMAIL=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_PATCHSET_UPLOADER=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_PATCHSET_UPLOADER_EMAIL=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_EVENT_ACCOUNT=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_EVENT_ACCOUNT_EMAIL=[^<]+<br>/, "");
            tooltipText.replace(/GERRIT_NAME=[A-Za-z0-9.@]+<br>/, "");
            tooltipText.replace(/GERRIT_HOST=[A-Za-z0-9.]+<br>/, "");
            tooltipText.replace(/GERRIT_PORT=[0-9]+<br>/, "");
            tooltipText.replace(/GERRIT_SCHEME=[A-Za-z0-9]+<br>/, "");
            tooltipText.replace(/GERRIT_VERSION=[0-9\.]+(<br>)?/, "");
            tooltip.setAttribute(tooltipText);
        }
    );
};

var jenkinsRedirectDone = false;
UPDATE_LOOPS["jenkins.+.signanthealth.com/.+/console$"] = (url) => {
    if (jenkinsRedirectDone) {
        return;
    }
    
    console.log("Automatically switching to full console logs...");
    jenkinsRedirectDone = true;
    window.location.replace(url + "Full");
};

var justinGuitarFilterDone = false;
UPDATE_LOOPS["justinguitar.com.*#songs.*"] = (_) => {
    if (!justinGuitarFilterDone) {
        justinGuitarFilterDone = true;
        
        setTimeout(
            () => {
                console.log("Filtering JustinGuitar tabs");
                
                const tabsButton = document.querySelector(".songs-features-filters__buttons button:nth-child(1)");
                if (tabsButton.classList.contains("button--beige")) {
                    tabsButton.click();
                }
                
                setInterval(
                    () => {
                        // Click "View more"
                        document.querySelector(".view-more__label")?.click();
                        
                        // Click "Show more results", if it's scrolled to
                        const showMore = document.querySelector(".load-more");
                        if (showMore != null) {
                            const showMoreRect = showMore.getBoundingClientRect();
                            const showMoreIsVisible = (
                                (showMoreRect.top >= 0)
                                && (showMoreRect.bottom <= window.innerHeight)
                                );
                                if (showMoreIsVisible || true) {
                                    showMore.click();
                                }
                        }
                    },
                    1000
                );
            },
            2000
        );
    }
};

var justinGuitarDownloadDone = false;
UPDATE_LOOPS["justinguitar.com.*#tab.*"] = (_) => {
    if (!justinGuitarDownloadDone) {
        justinGuitarDownloadDone = true;
        
        setTimeout(
            () => {
                console.log("Downloading JustinGuitar tabs");
                
                // Get song title
                const songTitleElement = document.querySelector(".song__title");
                const artistName = songTitleElement.querySelector("h3").textContent;
                const songName = songTitleElement.querySelector("h1").textContent;
                
                // Click "Tab"
                document.querySelector(".tabz__options button:nth-child(2)")?.click();
                
                // Click "Tabs"
                document.querySelector(".switch--Chords")?.click();
                // Click "View all"
                document.querySelector(".song-sheet__options .button")?.click();
                
                // Loop over tab images
                var tabImages = document.querySelectorAll(".song-sheet__image img");
                var curlCommands = [];
                var i = 0;
                for (var tabImage of tabImages) {
                    ++i;
                    //console.log("tabImage:", tabImage);
                    const tabImageSource = tabImage.src;
                    var filename = `${artistName} - ${songName} (${i.toString().padStart(2, '0')}) -- ${tabImageSource.split("/").pop()}`;
                    filename = decodeURIComponent(filename);
                    filename = filename.replace("/", "_");
                    curlCommands.push(
                        `curl -sLo "${filename}" ${tabImageSource}`
                    );
                }
                
                if (curlCommands.length == 0) {
                    console.log("Single page tab");
                    const tabImage = document.querySelector(".song-sheet__tabs img");
                    const tabImageSource = tabImage.src;
                    var filename = `${artistName} - ${songName} (01) -- ${tabImageSource.split("/").pop()}`;
                    filename = decodeURIComponent(filename);
                    filename = filename.replace("/", "_");
                    curlCommands.push(
                        `curl -sLo "${filename}" ${tabImageSource}`
                    );
                }
                
                const curlScript = `#!/bin/bash\n\n${curlCommands.join("\n")}\n`;
                
                // Output curl commands
                console.log(curlScript);
                
                // Download curl script
                var downloadLink = document.createElement("a");
                downloadLink.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodeURIComponent(curlScript));
                downloadLink.setAttribute("download", `${artistName} - ${songName}.sh`);
                document.body.appendChild(downloadLink);
                downloadLink.click();
            },
            2000
        );
    }
};


UPDATE_LOOPS["kankaristo.fi/opener/\\?done"] = (_) => {
    console.log("URI opener done, close window");
    window.open("", "_self").close();
};


UPDATE_LOOPS["mail.google.com"] = (_) => {
    // Replace Google Workspace name with "Gmail"
    document.title = document.title.replace("Kankaristo.fi-posti", "Gmail");
    
    /*/
    // Hide "No new messages"
    const cells = document.querySelectorAll("td.TC");
    for (const cell of cells) {
        cell.style.display = (
            cell.textContent.includes("Ei uusia sähköpostiviestejä")
            ? "none"
            : "table-cell"
        );
    }
    //*/
};


UPDATE_LOOPS["messages.google.com"] = (_) => {
    // Rename "Messages for web" to "Android SMS messages"
    document.title = document.title.replace("Messages for web", "Android SMS messages");
};


/*/
var qbitRedirectDone = false;
UPDATE_LOOPS["https://qbit\.wrbl\.fi"] = (url) => {
    if (qbitRedirectDone) {
        return;
    }
    
    console.log("Automatically redirecting to fix magnet link opening...");
    qbitRedirectDone = true;
    window.location.replace(url.replace("%2F=&", ""));
};
//*/


var redditTranslateRedirectDone = false;
UPDATE_LOOPS["reddit\.com/.*tl=fi$"] = (url) => {
    if (redditTranslateRedirectDone) {
        return;
    }
    
    console.log("Automatically switching to original language...");
    redditTranslateRedirectDone = true;
    window.location.replace(window.location.href.replace(/[&?]?tl=fi/, ""))
};


let steamRegisterDone = false;
UPDATE_LOOPS["steampowered.com"] = (_) => {
    if (steamRegisterDone) {
        return;
    }
    
    // Auto-check the checkbox to accept terms
    let termsCheckbox = document.querySelector("input[name=accept_ssa]");
    if (termsCheckbox != null) {
        if (!termsCheckbox.checked) {
            termsCheckbox.checked = true;
        }
        else {
            let continueButton = document.querySelector("a#register_btn");
            if (continueButton != null) {
                continueButton.click();
                steamRegisterDone = true;
            }
        }
    }
};


UPDATE_LOOPS["xkcd\.com"] = (_) => {
    // Show the comic title under the comic, so I don't have to hover my mouse
    var comic = document.querySelector("#comic");
    var image = comic?.querySelector("img");
    var titleText = image?.title;
    if (titleText != null) {
        var titleElement = comic.querySelector(".mod-title");
        if (titleElement == null) {
            titleElement = document.createElement("p");
            titleElement.className = "mod-title";
            comic.append(titleElement);
        }
        
        titleElement.textContent = titleText;
    }
};


/**
 * Auto-close annoying boxes.
 */
const closeButtonGetters = [
    // Google
    () => document.evaluate("//div[text()='Hyväksyn']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)?.singleNodeValue?.parentElement,
    
    // OneTrust (used by lots of sites), rect
    () => document.querySelector("#onetrust-reject-all-handler"),
    () => document.querySelector("#onetrust-accept-btn-handler"),
    
    // Stack Overflow sites
    () => document.querySelector(".js-consent-banner-hide"),
    
    // YouTube
    () => document.querySelector("tp-yt-paper-button[aria-label*='Hyväksy eväste']"),
    
    // ZDNet mailing list dialog
    () => document.querySelector("div[role=dialog] > div[title=Close]"),
];
UPDATE_LOOPS["ALL - Annoying box auto-closer"] = (_) => {
    let success = false;
    closeButtonGetters.forEach(
        (closeButtonGetter, index) => {
            const closeButton = closeButtonGetter();
            if (closeButton != null) {
                Util.Log(`Auto-closing annoying box with getter #${index}, button`, closebutton);
                closeButton.click();
                success = true;
            }
        }
    );
};


/**
 * Update loop.
 */
function UpdateLoop() {
    const url = window.location.href;
    
    for (const loopUrl in UPDATE_LOOPS) {
        if (loopUrl.startsWith("ALL") || (url.match(loopUrl) != null)) {
            const exitUpdateLoop = UPDATE_LOOPS[loopUrl](url);
            if (exitUpdateLoop) {
                break;
            }
        }
    }
    
    // Set data attribute in body element to contain the URL
    document.body?.setAttribute("data-url", document.location.href);
}


const AutoplayRG = () => {
    var videoParent = unsafeWindow.document.querySelector(".gif-tiles") || unsafeWindow.document.querySelector(".content-wrapper");
    
    if (videoParent == null) {
        Util.Error("Could not find video parent element");
        
        return;
    }
    
    videoParent.width = "auto";
    videoParent.display = "block";
    var config = { childList: true, subtree: true };
    const callback = (mutationList, _) => {
        for (const mutation of mutationList) {
            for (const addedNode of (mutation.addedNodes || [])) {
                for (const child of addedNode.childNodes) {
                    if (child.nodeName.toLowerCase() == "video") {
                        console.log("Added video: ", child);
                        child.autoplay = true;
                        child.play();
                        child.parentElement.parentElement.style.width = "auto";
                        child.parentElement.parentElement.style.height = "auto";
                    }
                }
            }
        }
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(videoParent, config);
    
    for (const video of videoParent.querySelectorAll("video")) {
        video.autoplay = true;
        video.play();
        video.parentElement.parentElement.style.width = "auto";
        video.parentElement.parentElement.style.height = "auto";
    }
};


const AutoscrollStop = () => {
    if (window.autoScrollInterval != null) {
        clearInterval(window.autoScrollInterval);
    }
};

const Autoscroll = (interval = 20) => {
    AutoscrollStop();
    
    window.autoScrollInterval = setInterval(
        () => {
            window.scrollBy(0, 1);
        },
        interval
    );
};


(
    function () {
        "use strict";
        
        document.addEventListener(
            "keydown",
            KeyEventListener,
            true
        );
        document.addEventListener(
            "keyup",
            KeyEventListener,
            true
        );
        
        let url = window.location.href;
        if (url.includes("drive.google.com")) {
            InitGoogleDrive();
        }
        
        setInterval(UpdateLoop, 250);
        
        unsafeWindow.AutoplayRG = AutoplayRG;
        unsafeWindow.Autoscroll = Autoscroll;
        unsafeWindow.AutoscrollStop = AutoscrollStop;
    }
)();

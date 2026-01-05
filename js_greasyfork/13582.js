// ==UserScript==
// @name            Youtube Logo - Link to subscriptions feed
// @namespace       Youtube Logo - Link to subscriptions feed
// @description     Change YouTube logo link to user's subscription feed instead of homepage, when logged in, for 2017 and later YouTube layout.
// @version         2.0.1
// @include         *://*.youtube.tld/*
// @supportURL      https://greasyfork.org/en/scripts/13582/feedback
// @author          aciid
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/13582/Youtube%20Logo%20-%20Link%20to%20subscriptions%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/13582/Youtube%20Logo%20-%20Link%20to%20subscriptions%20feed.meta.js
// ==/UserScript==

//console.info("[YTLTSF] Script running ... Youtube Logo - Link to subscriptions feed");

async function WaitForPageLoad() {
    while (true) { // Indefinite loop, YouTube page won't load unless tab is in focus anyway.
        var logoLoaded = (document.querySelectorAll("[id='logo'][title='YouTube Home']").length > 0);
        var userLoggedIn = (document.querySelector("div[id='buttons'] img[id='img'][alt='Avatar image']") !== null);
        var userLoggedOut = (document.querySelector("div[id='end'] [id='button'][aria-label='Sign in']") !== null);

        //console.log("[YTLTSF] Loading... (logoLoaded: " + logoLoaded + ") && (loggedIn: " + userLoggedIn + " || loggedOut: " + userLoggedOut + ")");

        if (logoLoaded) { // Wait for logo to load before proceeding
            // Script will wait for either user userLoggedIn or userLoggedOut element before proceeding
            if (userLoggedIn) {
                RunScript(); // Continue script
                return;
            } else if (userLoggedOut) {
                //console.log("[YTLTSF] Quitting script, user not logged in...");
                return;
            }
        }
        await new Promise(r => setTimeout(r, 100)); // Sleep loop for 100ms
    }
}

function RunScript() {
    var logos = document.querySelectorAll("[id='logo'][title='YouTube Home']");

    // Iterate through all logo elements like main page and left-hand menu
    logos.forEach(logo => {
        BlockEvents(logo); // Block youtube events on logo element so we can redirect clicks to subscriptions page

        logo.href = "/feed/subscriptions"; // Add href just for appearances
        logo.addEventListener("click", LogoClick); // Process mouse click on logo
        //logo.addEventListener("pointerdown", LogoClick); // Uncomment to allow touchscreen clicks on logo
    });
}

function BlockEvents(element) {
    var action = function(e) {
        e.preventDefault(); // Block original YouTube event action
        //console.log("Blocked YouTube event: " + e.type + " targetPath: " + e.target.rootPath);
    }

    // Create list of event types to be blocked
    var events = [];
    for (var ele in element) {
        if(ele.startsWith("onclick") || ele.startsWith("onpointerdown")) {
            events.push(ele.substr(2));
        }
    }

    events.forEach(function(eventType) {
        element.addEventListener(eventType, action);
    });
}

function LogoClick(event) {
    // Re-create Subscriptions button then click it to load subscriptions page without refreshing whole page
    var subButton = document.createElement("a");
    subButton.innerHTML = '<a id="endpoint" class="yt-simple-endpoint style-scope ytd-guide-entry-renderer" tabindex="-1" role="tablist" title="Subscriptions" href="/feed/subscriptions">';
    subButton.style = "visibility:hidden;"

    document.body.appendChild(subButton); // Add subButton to webpage
    document.querySelector("a[id='endpoint'][title='Subscriptions']").click(); // Find and click subButton button (either youtube or above created button works)

    event.stopPropagation(); // Stop any further events from being fired
}

WaitForPageLoad();

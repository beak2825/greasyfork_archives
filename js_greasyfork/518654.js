// ==UserScript==
// @name         Bluesky Repost Hider
// @description  "Hide Reposts" button for Bluesky
// @version      1.0
// @namespace    https://github.com/tmaster-terrarian/Userscripts/tree/main/Bluesky%20Repost%20Hider
// @match        https://bsky.app/profile/*
// @author       bscit
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bsky.app
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/518654/Bluesky%20Repost%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/518654/Bluesky%20Repost%20Hider.meta.js
// ==/UserScript==

GM_addStyle(`

.__toggle-button-holder {
    background-color: #000000;
}

.__toggle-button-holder .__toggle-button {
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: rgb(20, 27, 35);
    padding: 9px 12px;
    border-radius: 999px;
    gap: 6px;

    width: fit-content;
    margin: 0.875em 0.875em 6px;
}

.__toggle-button-holder .__toggle-button:hover {
    background-color: rgb(28, 39, 50);
}

.__toggle-button-holder .__toggle-button div {
    font-size: 0.765625em;
    letter-spacing: 0px;
    color: rgb(169, 183, 197);
    font-weight: 600;
    text-align: center;
    line-height: 14px;
    font-family: InterVariable, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-variant: no-contextual;
}

.__repost {
    overflow: hidden;
    transition-property: opacity, max-height;
    transition-duration: 0.25s;
}

.__repost.__hide-repost {
    opacity: 0 !important;
    max-height: 0 !important;
}

html.theme--dim .__toggle-button-holder {
    background-color: #ffffff !important;
}
html.theme--light .__toggle-button-holder .__toggle-button {
    background-color: rgb(241, 243, 245) !important;
}
html.theme--light .__toggle-button-holder .__toggle-button:hover {
    background-color: rgb(226, 231, 236) !important;
}
html.theme--light .__toggle-button-holder .__toggle-button div {
    color: rgb(66, 87, 108) !important;
}

html.theme--dim .__toggle-button-holder {
    background-color: #161e27 !important;
}
html.theme--dim .__toggle-button-holder .__toggle-button {
    background-color: rgb(30, 41, 54) !important;
}
html.theme--dim .__toggle-button-holder .__toggle-button:hover {
    background-color: rgb(38, 53, 68) !important;
}
html.theme--dim .__toggle-button-holder .__toggle-button div {
    color: rgb(174, 187, 201) !important;
}

`);

(function() {
    'use strict';

    // Your code here...

    let hidden = null;

    let feedItems = [];
    let lastFeedLength = 0;

    let profileHandle = window.location.href.replace("https://bsky.app/profile/", "");
    const _extraPathIndex = profileHandle.indexOf("/");
    if(_extraPathIndex !== -1)
    {
        profileHandle = profileHandle.substring(0, _extraPathIndex);
    }

    const toggleButtonContent = document.createElement("div");
    toggleButtonContent.innerText = hidden ? "Show Reposts" : "Hide Reposts";

    const Apply = (changed = false) => {
        const arr = Array.from(feedItems);
        let scroll = 0;
        arr.forEach((element, i) => {
            if(i == 0 || i == arr.length - 1 || i == arr.length - 2) return;

            if(!element.firstElementChild) return;

            const childElement = element.firstElementChild.firstElementChild;
            if(!childElement) return;

            const attribute = childElement.getAttribute("data-testid");
            if(attribute === null) return;

            if(attribute.replace("feedItem-by-", "") == profileHandle) return;

            childElement.classList.add("__repost");

            const isAbove = (childElement.getBoundingClientRect().bottom < (window.innerHeight / 2));

            if(hidden) {
                childElement.classList.add("__hide-repost");
                childElement.style.maxHeight = "0";

                if(changed && isAbove) scroll -= childElement.scrollHeight;
            }
            else {
                childElement.classList.remove("__hide-repost");
                childElement.style.maxHeight = childElement.scrollHeight + "px";

                if(changed && isAbove) scroll += childElement.scrollHeight;
            }

            toggleButtonContent.innerText = hidden ? "Show Reposts" : "Hide Reposts";
        });

        // if(changed)
        // {
        //     window.scrollBy({
        //         left: 0,
        //         top: scroll,
        //         behavior: "instant"
        //     });
        // }
    };

    setInterval(() => {
        if(lastFeedLength != feedItems.length)
        {
            Apply();
        }
        lastFeedLength = feedItems.length;
    }, 250);

    let smallWindow = false;
    window.addEventListener("resize", (event) => {
        if(!smallWindow && window.innerWidth < 800)
        {
            smallWindow = true;
            Apply();
        }
        else if(smallWindow && window.innerWidth >= 800)
        {
            smallWindow = false;
            Apply();
        }
    });

    const toggleElement = document.createElement("div");
    toggleElement.classList.add("css-175oi2r");
    toggleElement.classList.add("r-18u37iz");
    toggleElement.classList.add("__toggle-button-holder");

    const toggleButton = document.createElement("button");
    toggleButton.classList.add("css-175oi2r");
    toggleButton.classList.add("r-1loqt21");
    toggleButton.classList.add("r-1otgn73");
    toggleButton.classList.add("__toggle-button");
    toggleButton.setAttribute("type", "button");
    toggleButton.setAttribute("role", "button");
    toggleButton.addEventListener("click", (event) => {
        if(hidden == null) return;

        hidden = !hidden;
        Apply(true);
    });

    toggleButtonContent.classList.add("css-146c3p1");
    toggleButton.appendChild(toggleButtonContent);

    toggleElement.appendChild(toggleButton);

    let attempts = 0;
    const TrySetup = () => {
        if(attempts >= 5) return false;
        setTimeout(() => {
            attempts++;
            try
            {
                feedItems = document.querySelector(".css-175oi2r.r-sa2ff0").children;
            }
            catch(err)
            {
                console.error(err);
                if(!TrySetup()) console.error("Too many failed attempts to initialize Bluesky Repost Hider; aborting");
                return;
            }
            lastFeedLength = feedItems.length;
            hidden = false;

            const header = document.querySelector(".css-175oi2r.r-gtdqiz.r-ipm5af.r-184en5c").firstElementChild.parentNode;
            header.insertBefore(toggleElement, header.firstElementChild);

            Apply();
        }, 1000);
        return true;
    };
    TrySetup();
})();

// ==UserScript==
// @name        Map Service Call Link
// @namespace   https://violentmonkey.github.io
// @version     1.2.0
// @description Turn the map InfoWindow heading into a link to the service call.
// @author      Anton Grouchtchak
// @match       https://office.roofingsource.com/admin/test.php*
// @icon        https://office.roofingsource.com/images/roofing-source-logo.png
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/511501/Map%20Service%20Call%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/511501/Map%20Service%20Call%20Link.meta.js
// ==/UserScript==

(() => {
    "use strict";

    if (!window.google?.maps?.InfoWindow) {
        console.error("google.maps.InfoWindow is not available.");
        return;
    }

    const loaderIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-loader-circle-icon lucide-loader-circle spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

    const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb2c36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;

    const lockOpenIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00bc7d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lock-open-icon lucide-lock-open"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`;

    const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb2c36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`;

    // Improve the InfoWindow UI.
    const style = document.createElement("style");
    style.textContent = `
@keyframes loader-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spin {
    animation: loader-spin 2s linear infinite;
}

#bodyContent input, #bodyContent select {
    border-width: 1px;
    border-style: solid;
    border-radius: 5px;
}

#bodyContent input {
    padding: 2px 4px;
    height: 25px;
}

#bodyContent select {
    height: 30px;
}

#bodyContent .setbutton {
    border: 1px solid #ccc !important;
    background-color: #fff !important;
    border-radius: 5px !important;
    padding: 8px 16px !important;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;
    color: #000 !important;
    transition: background-color 0.3s, color 0.3s !important;
    margin: 10px 1px 1px 1px !important;
}

#bodyContent .setbutton:hover {
    background-color: #f3f4f6 !important;
    color: #111827 !important;
}

#bodyContent .setbutton:active {
    background-color: #e5e7eb !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    color: #111827 !important;
}

#bodyContent hr {
    margin: 15px 0;
}
`;
    document.head.appendChild(style);

    const updateLockIndicator = (indicator, state) => {
        const states = {
            loading: { icon: loaderIcon, title: "Checking the date lock state..." },
            locked: { icon: lockIcon, title: "Confirmed date is locked." },
            unlocked: { icon: lockOpenIcon, title: "Confirmed date is not locked." },
            error: { icon: errorIcon, title: "Error while checking the date lock state." }
        };

        const { icon, title } = states[state];
        indicator.innerHTML = icon;
        indicator.title = title;
    };

    // Save the original InfoWindow.open() before overriding it.
    const originalOpen = google.maps.InfoWindow.prototype.open;

    google.maps.InfoWindow.prototype.open = function (...args) {
        // Call the original InfoWindow.open().
        const result = originalOpen.apply(this, args);

        google.maps.event.addListenerOnce(this, "domready", () => {
            const content = this.getContent();
            let contentElement;

            if (typeof content === "string") {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = content;
                contentElement = tempDiv.firstChild;
            } else if (content instanceof Element) {
                contentElement = content;
            } else {
                return;
            }

            // Get all InfoWindow heading elements.
            const contentHeadingElements = contentElement.querySelectorAll(".firstHeading");
            if (!contentHeadingElements.length) return;

            // Map the string-based headings to their corresponding DOM elements.
            const domHeadings = document.querySelectorAll("#map .firstHeading");
            const matchedHeadings = Array.from(contentHeadingElements)
                .map((contentHeading) => {
                    const contentHeadingText = contentHeading.textContent.trim();
                    return {
                        contentHeading,
                        domHeading: Array.from(domHeadings).find(
                            (domHeading) => domHeading.textContent.trim() === contentHeadingText
                        )
                    };
                })
                .filter((match) => match.domHeading);

            // Loop over each matched heading to fetch the project page and get the "Lock Confirmed Date" checkbox state.
            matchedHeadings.forEach(({ domHeading }) => {
                domHeading.style.display = "flex";
                domHeading.style.alignItems = "center";
                domHeading.style.columnGap = "1rem";

                const anchor = domHeading.querySelector("a");
                if (!anchor) return;

                const projectUrl = anchor.getAttribute("href");
                if (!projectUrl) return;

                // Reuse existing indicator if available, otherwise create one.
                let lockIndicator = domHeading.querySelector(".lock-indicator");
                if (!lockIndicator) {
                    lockIndicator = document.createElement("span");
                    lockIndicator.className = "lock-indicator";
                    domHeading.appendChild(lockIndicator);
                }

                updateLockIndicator(lockIndicator, "loading");

                fetch(projectUrl)
                    .then((response) => {
                        if (!response.ok) {
                            updateLockIndicator(lockIndicator, "error");
                            throw new Error(`Request failed: ${response.statusText}`);
                        }
                        return response.text();
                    })
                    .then((htmlText) => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlText, "text/html");
                        const checkbox = doc.getElementById("proj_sch_date_lock");

                        if (checkbox?.checked) {
                            updateLockIndicator(lockIndicator, "locked");
                        } else {
                            updateLockIndicator(lockIndicator, "unlocked");
                        }
                    })
                    .catch((error) => {
                        updateLockIndicator(lockIndicator, "error");
                        console.error(error);
                    });
            });
        });

        return result;
    };
})();

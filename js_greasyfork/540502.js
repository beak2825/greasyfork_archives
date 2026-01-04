// ==UserScript==
    // @name         Script for online golf booking in MiScore app
    // @namespace    http://tampermonkey.net/
    // @version      5.4
    // @license MIT
    // @description  Logs in and redirects directly to a specific booking event when pressing Alt + 8.
    // @author       Paweł Stefaniuk - https://Stefaniuk.site
    // @run-at       document-idle
    // @match        *://*/*
    // @match        *://royalqueensland.miclub.com.au/security/login.msp*
    // @match        *://royalqueensland.miclub.com.au/cms/*
    // @match        *://royalqueensland.miclub.com.au/members/bookings/open/event.msp*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540502/Script%20for%20online%20golf%20booking%20in%20MiScore%20app.user.js
// @updateURL https://update.greasyfork.org/scripts/540502/Script%20for%20online%20golf%20booking%20in%20MiScore%20app.meta.js
    // ==/UserScript==

    (function () {
        'use strict';

     const TARGET_EVENT_ID = "1535259826";
      // <-- YOUR EVENT ID HERE///
     const startTime = "15:00";            // Booking start time (e.g., 14:00)
      const endTime = "15:30";              // Booking end time (e.g., 16:30)


        const targetHour = 6;      // Hour to trigger (0–23)
        const targetMinute = 15;    // Minute to trigger (0–59)
        const targetSecond = 0;    // Second to trigger (0–59)

        const CMS_URL = "https://royalqueensland.miclub.com.au/cms/";
        const LOGIN_URL = "https://royalqueensland.miclub.com.au/security/login.msp";
        const BOOKINGS_EVENT_URL = `https://royalqueensland.miclub.com.au/members/bookings/open/event.msp?booking_event_id=${TARGET_EVENT_ID}&booking_resource_id=3000000`;
        const LOGIN_FLAG = "autoLoginTriggered";

        // Trigger on Alt + 8
        document.addEventListener("keydown", function(event) {
            if (event.altKey && event.key === "8") {
                console.log("🧲 Alt + 8 pressed — initiating action!");
                  localStorage.setItem(LOGIN_FLAG, "true");

                    const eventListUrl = `https://royalqueensland.miclub.com.au/views/members/booking/eventList.xhtml`;
                    window.location.href = eventListUrl;
            }
        });

        // Time-based trigger
        const startCheckingTime = () => {
            const intervalId = setInterval(() => {
                const now = new Date();
                const h = now.getHours();
                const m = now.getMinutes();
                const s = now.getSeconds();

                if (h === targetHour && m === targetMinute && s === targetSecond) {
                    clearInterval(intervalId);
                    localStorage.setItem(LOGIN_FLAG, "true");

                    const eventListUrl = `https://royalqueensland.miclub.com.au/views/members/booking/eventList.xhtml`;
                    window.location.href = eventListUrl;
                }
            }, 1000);
        };

        // Auto login logic
        if (window.location.href.includes("/security/login.msp")) {
            console.log("🔐 Running tryToLogin");
            tryToLogin(0);
        }

        if (window.location.href.includes("eventList.xhtml")) {

            const interval = setInterval(() => {
                const links = Array.from(document.querySelectorAll('a[href*="booking_event_id="]'));
                const openLink = links.find(link =>
                                            link.href.includes(TARGET_EVENT_ID) && link.innerText.includes("OPEN")
                                           );

                if (openLink) {
                    console.log("✅ Event is now OPEN! Navigating to booking page...");
                    clearInterval(interval);
                    localStorage.setItem("autoLoginTriggered", "true");
                    window.location.href = openLink.href + "&autologin=true";
                } else {
                    console.log("🔒 Still locked. Waiting...");
                }
            }, 1000);
        }

        // Redirect after CMS login
        if (window.location.href.startsWith(CMS_URL)) {
            const urlParams = new URLSearchParams(window.location.search);
            const shouldBook = urlParams.get("autologin") === "true";
            if (shouldBook) {
                window.addEventListener("load", () => {
                    console.log("📥 After CMS login – redirecting to booking event");
                    window.location.href = BOOKINGS_EVENT_URL;
                });
            }
        }

        // On event page, attempt booking if autologin is flagged
        if (window.location.href.startsWith(BOOKINGS_EVENT_URL)) {
            console.log("🧪 Entered BOOKINGS_EVENT_URL, flag =", localStorage.getItem(LOGIN_FLAG));
            const urlParams = new URLSearchParams(window.location.search);
            const shouldBook = urlParams.get("autologin") === "true";
            console.log("📥 Changing flag to " + shouldBook);
            if (shouldBook) {
                console.log("✅ Matching URL and flag active — starting booking attempt");
                waitForBookingToOpen();
                localStorage.removeItem(LOGIN_FLAG);
            }
        }
        function waitForBookingToOpen(maxWaitSeconds = 20) {
            console.log("⏳ Waiting for booking to open...");

            let elapsed = 0;
            const interval = setInterval(() => {
                const isOpen = document.querySelector('button.btn-book-me');

                if (isOpen) {
                    console.log("✅ Booking is now OPEN!");
                    clearInterval(interval);

                    const result = findMatchingTimeBlocks(startTime, endTime);
                    const fullyAvailable = filterFullyAvailableSlots(result);
                    clickNextGroupButton(fullyAvailable);
                    localStorage.removeItem(LOGIN_FLAG);

                } else if (elapsed >= maxWaitSeconds) {
                    clearInterval(interval);
                    console.warn("⛔ Timed out waiting for booking to open.");
                        localStorage.removeItem(LOGIN_FLAG); // <--- dodaj to
                } else {
                    elapsed++;
                }
            }, 1000);
        }

        function tryToLogin(attempt) {
            const MAX_ATTEMPTS = 10;
            console.log(`🔍 [Attempt ${attempt + 1}] Looking for login fields...`);

            const actionInput = document.querySelector("input[name='action']");
            console.log("🔎 Looking for hidden 'action' field:", actionInput);

            const loginForm = document.querySelector("form[name='form']");
            console.log("🔎 Looking for login form:", loginForm);

            if (loginForm && actionInput) {
                console.log("✅ All fields found. Submitting form...");
                actionInput.value = "login";
                console.log("✍️ Set hidden action field to 'login'");
                loginForm.submit();
                console.log("🚀 Form submitted");
            } else if (attempt < MAX_ATTEMPTS) {
                console.warn(`⚠️ Fields not ready (attempt ${attempt + 1}). Retrying in 1 second...`);
                setTimeout(() => tryToLogin(attempt + 1), 1000);
            } else {
                console.error("❌ Failed to find login fields after 10 attempts.");
            }
        }

        function findGroupsWithFourSlots() {
            console.log("📥 Looking for groups with 4 available 'Book Me' slots");

            const validZeroCells = Array.from(document.querySelectorAll('div[id$="_0"]')).filter(div =>
                div.querySelector('button.btn-book-me')
            );

            const candidateIds = validZeroCells.map(div => div.id.slice(0, -2));
            const uniqueIds = [...new Set(candidateIds)];

            const validGroupIds = uniqueIds.filter(id =>
                document.getElementById(id + "_0")?.querySelector("button.btn-book-me") &&
                document.getElementById(id + "_1")?.querySelector("button.btn-book-me") &&
                document.getElementById(id + "_2")?.querySelector("button.btn-book-me") &&
                document.getElementById(id + "_3")?.querySelector("button.btn-book-me")
            );

            validGroupIds.sort((a, b) => parseInt(a) - parseInt(b));

            console.log("✅ Groups with 4 available slots:");
            validGroupIds.forEach((id, i) => console.log(`${i + 1}. ID: ${id}`));

            return validGroupIds;
        }

        function timeToMinutes12hFormat(timeStr) {
            const [time, modifier] = timeStr.trim().split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0;
            return hours * 60 + minutes;
        }

        function timeToMinutes24hFormat(timeStr) {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        }

        function findMatchingTimeBlocks(start, end) {
            const startMinutes = timeToMinutes24hFormat(start);
            const endMinutes = timeToMinutes24hFormat(end);

            const matchingIds = [];

            document.querySelectorAll("div.row-heading").forEach(el => {
                const timeEl = el.querySelector("h3");
                if (timeEl) {
                    const blockMinutes = timeToMinutes12hFormat(timeEl.textContent);
                    if (blockMinutes >= startMinutes && blockMinutes <= endMinutes) {
                        matchingIds.push(el.id);
                    }
                }
            });

            return matchingIds;
        }

        function filterFullyAvailableSlots(idList) {
            return idList.filter(headingId => {
                const rowId = headingId.replace("heading-", "");
                const bookingCells = document.querySelectorAll(`div[data-rowid="${rowId}"] .btn-book-me`);
                return bookingCells.length === 4;
            });
        }

        window._originalAlert = window.alert;
        window.alert = function(msg) {
            console.log("🚨 Intercepted alert:", msg);
            if (msg.includes("Booking Row is locked by another user")) {
                console.log("⚠️ Row locked by another user — skipping...");
                setTimeout(() => clickNextGroupButton(window._remainingRowIds || []), 500);
            } else {
                window._originalAlert(msg);
            }
        };

        function clickNextGroupButton(sortedRowIds) {
            if (sortedRowIds.length === 0) {
                console.log("❌ No more booking options available.");
                return;
            }

            sortedRowIds = sortedRowIds
                .map(id => id.toString().replace(/\D/g, ''))
                .map(Number)
                .filter(n => !isNaN(n));

            window._remainingRowIds = sortedRowIds.slice();

            const currentId = sortedRowIds.shift();
            const btn = document.getElementById(`btn-book-group-${currentId}`);

            if (!btn) {
                console.log(`⚠️ Button not found for ID: ${currentId}, trying next...`);
                clickNextGroupButton(sortedRowIds);
                return;
            }

            console.log(`🟡 Clicking BOOK GROUP for ID: ${currentId}`);
            btn.click();

            setTimeout(() => {
                const modal = document.querySelector(".modal-title");
                if (modal && modal.textContent.includes("Would You Like To Book Your Playing Partners?")) {
                    console.log(`✅ Success! Modal appeared for ID: ${currentId}`);
                    clickYesInModal();
                } else {
                    console.log(`🔁 Modal not detected for ID: ${currentId}, trying next`);
                    clickNextGroupButton(sortedRowIds);
                }
            }, 1000);
        }

        function clickYesInModal() {
            const yesButton = Array.from(document.querySelectorAll('button'))
                .find(btn => btn.textContent.trim() === "Yes" && btn.onclick?.toString().includes("submitAutoBook"));

            if (yesButton) {
                console.log("🟢 Clicking 'Yes' in modal...");
                yesButton.click();
            } else {
                console.log("🔍 'Yes' button not yet available – retrying...");
                setTimeout(clickYesInModal, 1000);
            }
        }

        // Start time checking loop
        startCheckingTime();

    })();


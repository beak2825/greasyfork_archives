// ==UserScript==
// @name         Psy's Ticker Reminders
// @namespace    http://tampermonkey.net/
// @version      2.0.12
// @description  Inserts a custom reminders ticker below the header with vertical Swiper scrolling that persists via URL hash (#reminders). Also adds a Reminders page with a Notes-to-Self section. The navigation icon is placed appropriately for desktop and Torn PDA mobile layouts.
// @author       psychogenik
// @match        https://www.torn.com/*
// @grant        GM_getResourceText
// @require      https://unpkg.com/swiper/swiper-bundle.min.js
// @resource     SWIPER_CSS https://unpkg.com/swiper/swiper-bundle.min.css
// @downloadURL https://update.greasyfork.org/scripts/531158/Psy%27s%20Ticker%20Reminders.user.js
// @updateURL https://update.greasyfork.org/scripts/531158/Psy%27s%20Ticker%20Reminders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*********************** Inject Swiper CSS ***********************/
    const swiperCss = GM_getResourceText("SWIPER_CSS");
    if (swiperCss) {
        const styleEl = document.createElement("style");
        styleEl.textContent = swiperCss;
        document.head.appendChild(styleEl);
        console.log("[Reminders] Swiper CSS injected.");
    } else {
        console.warn("[Reminders] Failed to load Swiper CSS.");
    }

    /*********************** Custom CSS for Ticker & Reminders Page ***********************/
    const customCSS = `
        /* Ticker section container */
        #psy-reminders-ticker-box {
            margin: 2px auto;
        }
        .psy-reminders-ticker {
            width: 100%;
            height: 26px;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
            font-size: 11px;
            border: 1px solid rgba(200,200,200,0.2);
            border-radius: 3px;
            background-color: rgba(50,50,50,0.85);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            padding: 0;
            overflow: hidden;
            position: relative;
        }
        .news-ticker-slider-wrapper,
        .swiper-container,
        .swiper-wrapper {
            width: 100%;
            height: 26px !important;
        }
        .swiper-slide,
        .swiper-slide-duplicate {
            box-sizing: border-box;
            height: 26px !important;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 0 6px;
            margin: 0 !important;
        }
        .scroll-wrap {
            display: flex;
            align-items: center;
            width: 100%;
            height: 26px;
            line-height: 26px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .icon-flip {
            transition: transform 0.5s ease;
            flex-shrink: 0;
            margin-right: 4px;
            display: flex;
            align-items: center;
        }
        .icon-flip:hover {
            transform: rotateY(180deg);
        }
        .headline {
            text-decoration: none;
            flex: 1;
            display: flex;
            align-items: center;
            height: 26px;
        }
        .headline .headline-content {
            display: inline-block;
            vertical-align: middle;
            color: #DDDDDD;
        }
        /* Reminders page styling */
        #psy-reminders-page {
            padding: 20px;
            color: #fff;
            background-color: #2f2f2f;
            border-radius: 3px;
            max-width: 600px;
            margin: 20px auto;
        }
        #psy-reminders-page h1 {
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 10px;
        }
        #psy-reminders-page h2 {
            font-size: 20px;
            margin-top: 20px;
            margin-bottom: 10px;
            color: #fff;
        }
        #psy-reminders-page input {
            padding: 5px;
            border: 1px solid #444;
            border-radius: 3px;
            background: #2f2f2f;
            color: #fff;
        }
        #psy-reminders-page button {
            padding: 6px 12px;
            border-radius: 3px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /* Mobile adjustments */
        @media only screen and (max-width: 600px) {
            #psy-reminders-ticker-box {
                width: 100% !important;
                margin: 2px 5px;
            }
            .psy-reminders-ticker {
                font-size: 10px;
                height: 24px;
            }
            .swiper-slide,
            .scroll-wrap {
                height: 24px !important;
                line-height: 24px;
            }
            #psy-reminders-page {
                max-width: 90%;
            }
        }
    `;
    const styleElement = document.createElement("style");
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);

    /*********************** Utility Functions ************************/
    const REMINDERS_KEY = 'psy_reminders_data';
    const NOTES_KEY = 'psy_notes_data';

    function getCurrentDate() {
        return new Date().toISOString().split("T")[0];
    }

    function addDays(dateStr, days) {
        let d = new Date(dateStr);
        d.setDate(d.getDate() + days);
        return d.toISOString().split("T")[0];
    }

    function loadReminders() {
        try {
            const data = JSON.parse(localStorage.getItem(REMINDERS_KEY));
            return data || [];
        } catch (e) {
            console.error("[Reminders] Error parsing reminders:", e);
            return [];
        }
    }

    function saveReminders(reminders) {
        localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    }

    function loadNotes() {
        try {
            const data = JSON.parse(localStorage.getItem(NOTES_KEY));
            return data || [];
        } catch (e) {
            console.error("[Reminders] Error parsing notes:", e);
            return [];
        }
    }

    function saveNotes(notes) {
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    }

    function escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, m => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[m]);
    }

    /*********************** Navigation Icon Insertion ************************/
    // If mobile viewport is detected, try a few different selectors.
    if (window.innerWidth < 768) {
        let mobileNavTries = 0, mobileNavMaxTries = 20;
        const mobileNavPoll = setInterval(() => {
            mobileNavTries++;
            // Additional selectors added for Torn PDA.
            const mobileNavContainer = document.querySelector('.mobile-nav') ||
                                       document.querySelector('.nav-mobile') ||
                                       document.querySelector('#mobileNav') ||
                                       document.querySelector('.mobile-header') ||
                                       document.querySelector('.header-bar');
            if (mobileNavContainer) {
                clearInterval(mobileNavPoll);
                insertMobileNavIcon(mobileNavContainer);
            } else if (mobileNavTries >= mobileNavMaxTries) {
                clearInterval(mobileNavPoll);
                console.log("[Reminders] Could not find mobile nav container after", mobileNavMaxTries, "attempts.");
            }
        }, 500);
    } else {
        // Desktop: poll for sidebar container.
        const SIDEBAR_SELECTOR = '.toggle-content___BJ9Q9';
        let sidebarTries = 0, sidebarMaxTries = 20;
        const sidebarPoll = setInterval(() => {
            sidebarTries++;
            const sidebarContainer = document.querySelector(SIDEBAR_SELECTOR);
            if (sidebarContainer) {
                clearInterval(sidebarPoll);
                insertSidebarLink(sidebarContainer);
            } else if (sidebarTries >= sidebarMaxTries) {
                clearInterval(sidebarPoll);
                console.log("[Reminders] Could not find sidebar container after", sidebarMaxTries, "attempts.");
            }
        }, 500);
    }

    function insertMobileNavIcon(container) {
        const link = document.createElement('a');
        link.href = '#reminders';
        link.className = 'mobileLink';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = "reminders";
            showRemindersPage();
        });
        const iconWrap = document.createElement('span');
        iconWrap.className = 'svgIconWrap mobileIconWrap';
        iconWrap.innerHTML = `
            <svg class="icon-flip" xmlns="http://www.w3.org/2000/svg" fill="#DDDDDD" stroke="transparent" stroke-width="0" width="14" height="16" viewBox="-1740.5 -134.5 9 11" style="margin-right:4px;">
                <path d="M-1738-124v-9h4l3,3v6Zm1-1.286h5v-4.285l-2.144-2.143H-1737Zm1-.714v-1h3v1Zm0-2v-1h3v1Zm0-2v-1h2v1Z"></path>
            </svg>
        `;
        const textSpan = document.createElement('span');
        textSpan.textContent = 'Reminders';
        link.appendChild(iconWrap);
        link.appendChild(textSpan);
        container.appendChild(link);
        console.log("[Reminders] Mobile nav icon inserted.");
    }

    function insertSidebarLink(container) {
        const remindersArea = document.createElement('div');
        remindersArea.className = 'area-desktop___bpqAS';
        remindersArea.id = 'nav-reminders';
        const rowDiv = document.createElement('div');
        rowDiv.className = 'area-row___iBD8N';
        const link = document.createElement('a');
        link.href = '#reminders';
        link.className = 'desktopLink___SG2RU';
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = "reminders";
            showRemindersPage();
        });
        const iconWrap = document.createElement('span');
        iconWrap.className = 'svgIconWrap___AMIqR';
        const defaultIcon = document.createElement('span');
        defaultIcon.className = 'defaultIcon___iiNis mobile___paLva';
        defaultIcon.innerHTML = `
            <svg class="icon-flip" xmlns="http://www.w3.org/2000/svg" fill="#DDDDDD" stroke="transparent" stroke-width="0" width="14" height="16" viewBox="-1740.5 -134.5 9 11" style="margin-right:4px;">
                <path d="M-1738-124v-9h4l3,3v6Zm1-1.286h5v-4.285l-2.144-2.143H-1737Zm1-.714v-1h3v1Zm0-2v-1h3v1Zm0-2v-1h2v1Z"></path>
            </svg>
        `;
        iconWrap.appendChild(defaultIcon);
        const linkName = document.createElement('span');
        linkName.className = 'linkName___FoKha';
        linkName.textContent = 'Reminders';
        link.appendChild(iconWrap);
        link.appendChild(linkName);
        rowDiv.appendChild(link);
        remindersArea.appendChild(rowDiv);
        container.appendChild(remindersArea);
        console.log("[Reminders] Inserted sidebar link.");
    }

    /*********************** Reminders Page & Notes Section ************************/
    function buildRemindersPageHTML() {
        return `
          <div id="psy-reminders-page">
            <h1>Reminders</h1>
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
              <input type="text" id="psy-reminder-name" placeholder="Reminder name" style="flex:1;">
              <input type="date" id="psy-reminder-date">
              <button id="psy-add-reminder-btn" class="torn-btn btn-dark-bg">Save Reminder</button>
            </div>
            <div id="psy-reminders-list"></div>
            <hr style="border:1px solid #444; margin:0 0 10px;">
            <h2 style="margin-top:20px; margin-bottom:10px;">Notes to Self</h2>
            <div style="display:flex; gap:10px; align-items:center; margin-bottom:10px;">
              <input type="text" id="psy-note-text" placeholder="Enter note" style="flex:1;">
              <button id="psy-add-note-btn" class="torn-btn btn-dark-bg">Save Note</button>
            </div>
            <div id="psy-notes-list"></div>
          </div>
        `;
    }

    function showRemindersPage() {
        // Try additional selectors for mobile layouts.
        const mainContainer = document.querySelector('.main-content') ||
                              document.querySelector('.content-wrapper') ||
                              document.querySelector('.content') ||
                              document.body;
        mainContainer.innerHTML = buildRemindersPageHTML();
        const addReminderBtn = document.querySelector('#psy-add-reminder-btn');
        if (addReminderBtn) {
            addReminderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addNewReminder();
            });
        }
        const addNoteBtn = document.querySelector('#psy-add-note-btn');
        if (addNoteBtn) {
            addNoteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                addNewNote();
            });
        }
        renderSavedReminders();
        renderSavedNotes();
        console.log("[Reminders] Reminders page displayed.");
    }

    function addNewReminder() {
        const nameInput = document.querySelector('#psy-reminder-name');
        const dateInput = document.querySelector('#psy-reminder-date');
        if (!nameInput || !dateInput) return;
        const reminderName = nameInput.value.trim();
        const reminderDate = dateInput.value;
        if (!reminderName || !reminderDate) {
            alert("Please enter both a reminder name and date.");
            return;
        }
        let reminders = loadReminders();
        reminders.push({ id: Date.now(), name: reminderName, date: reminderDate });
        saveReminders(reminders);
        nameInput.value = '';
        dateInput.value = '';
        renderSavedReminders();
        rebuildSlides();
        console.log("[Reminders] New reminder added:", reminderName, reminderDate);
    }

    function addNewNote() {
        const noteInput = document.querySelector('#psy-note-text');
        if (!noteInput) return;
        const noteText = noteInput.value.trim();
        if (!noteText) {
            alert("Please enter a note.");
            return;
        }
        let notes = loadNotes();
        notes.push({ text: noteText });
        saveNotes(notes);
        noteInput.value = '';
        renderSavedNotes();
        rebuildSlides();
        console.log("[Reminders] New note added:", noteText);
    }

    function renderSavedReminders() {
        const container = document.querySelector('#psy-reminders-list');
        if (!container) return;
        let reminders = loadReminders();
        reminders.sort((a, b) => a.date.localeCompare(b.date));
        const today = getCurrentDate();
        const lines = reminders.map((rem) => {
            const isPast = rem.date < today;
            const isCurrent = rem.date === today;
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #444; ${isPast ? 'opacity:0.6;' : ''}">
                <div style="flex:1; min-width:200px; color:#ccc; ${isCurrent ? 'font-weight:bold;color:#fff;' : ''}">${escapeHtml(rem.name)}</div>
                <div style="min-width:150px; color:#ccc; ${isCurrent ? 'font-weight:bold;color:#fff;' : ''}">${rem.date}</div>
                <button class="torn-btn btn-dark-bg psy-delete-reminder-btn" data-id="${rem.id}" style="padding:4px 8px; border-radius:3px; text-align:center;">Delete</button>
              </div>
            `;
        });
        container.innerHTML = lines.length ? lines.join("") : '<div style="color:#888;padding:10px 0;">No reminders saved yet.</div>';
        container.querySelectorAll('.psy-delete-reminder-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'), 10);
                let list = loadReminders();
                list = list.filter(r => r.id !== id);
                saveReminders(list);
                renderSavedReminders();
                rebuildSlides();
                console.log("[Reminders] Reminder deleted with id", id);
            });
        });
    }

    function renderSavedNotes() {
        const container = document.querySelector('#psy-notes-list');
        if (!container) return;
        let notes = loadNotes();
        const lines = notes.map((note, idx) => {
            return `
              <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #444;">
                <div style="flex:1; color:#ccc;">${escapeHtml(note.text)}</div>
                <button class="torn-btn btn-dark-bg psy-delete-note-btn" data-idx="${idx}" style="padding:4px 8px; border-radius:3px; text-align:center;">Delete</button>
              </div>
            `;
        });
        container.innerHTML = lines.length ? lines.join("") : '<div style="color:#888;padding:10px 0;">No notes saved yet.</div>';
        container.querySelectorAll('.psy-delete-note-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-idx'), 10);
                let list = loadNotes();
                list.splice(idx, 1);
                saveNotes(list);
                renderSavedNotes();
                rebuildSlides();
                console.log("[Reminders] Note deleted at index", idx);
            });
        });
    }

    /*********************** Ticker (Swiper) Implementation ***********************/
    let tickerInserted = false;
    let mySwiper = null;
    const TICKER_POLL_INTERVAL = 500;
    let tickerPollCount = 0, tickerMaxTries = 60;

    const headerTickerPoll = setInterval(() => {
        tickerPollCount++;
        // Added additional header selectors for Torn PDA.
        const headerEl = document.getElementById("topHeaderBanner") ||
                         document.querySelector('.header') ||
                         document.querySelector('.mobile-header') ||
                         document.querySelector('.header-bar') ||
                         document.body;
        if (headerEl) {
            clearInterval(headerTickerPoll);
            insertTickerSection(headerEl);
        } else if (tickerPollCount >= tickerMaxTries) {
            clearInterval(headerTickerPoll);
            console.warn("[Reminders] Header element not found after", tickerMaxTries, "tries.");
        }
    }, TICKER_POLL_INTERVAL);

    function insertTickerSection(headerEl) {
        if (tickerInserted) return;
        const contentContainer = document.querySelector('.container') || document.body;
        let containerWidth = contentContainer ? contentContainer.offsetWidth + 'px' : '90%';
        const tickerSection = document.createElement('section');
        tickerSection.id = 'psy-reminders-ticker-box';
        tickerSection.style.width = containerWidth;
        tickerSection.style.margin = "2px auto";
        tickerSection.innerHTML = `
            <div class="psy-reminders-ticker">
                <div id="psy-swiper-container" class="swiper-container">
                    <div id="psy-swiper-wrapper" class="swiper-wrapper">
                        <!-- Slides will be injected here -->
                    </div>
                </div>
            </div>
        `;
        // Insert right after the header element.
        headerEl.insertAdjacentElement('afterend', tickerSection);
        tickerInserted = true;
        console.log("[Reminders] Custom ticker section inserted below the header.");
        setTimeout(() => {
            initSwiper();
            rebuildSlides();
        }, 100);
    }

    function initSwiper() {
        try {
            mySwiper = new Swiper("#psy-swiper-container", {
                direction: "vertical",
                loop: true,
                slidesPerView: 1,
                spaceBetween: 0,
                autoplay: {
                    delay: 15000,
                    disableOnInteraction: false
                },
                speed: 800,
                effect: "slide",
                allowTouchMove: false,
                observer: true,
                observeParents: true,
                initialSlide: 0
            });
            console.log("[Reminders] Vertical Swiper initialized successfully!");
        } catch (e) {
            console.error("[Reminders] Error initializing Swiper:", e);
        }
    }

    function rebuildSlides() {
        const today = getCurrentDate();
        const tomorrow = addDays(today, 1);
        let reminders = loadReminders();
        let notes = loadNotes();
        const reminderSlides = reminders
            .filter(r => (r.date === today || r.date === tomorrow))
            .map(rem => {
                const dayLabel = (rem.date === today) ? "today" : "tomorrow";
                return `
                    <div class="scroll-wrap">
                        <svg class="icon-flip" xmlns="http://www.w3.org/2000/svg" fill="#DDDDDD" stroke="transparent" stroke-width="0" width="10" height="12" viewBox="-1740.5 -134.5 9 11" style="margin-right:4px;">
                            <path d="M-1738-124v-9h4l3,3v6Zm1-1.286h5v-4.285l-2.144-2.143H-1737Zm1-.714v-1h3v1Zm0-2v-1h3v1Zm0-2v-1h2v1Z"></path>
                        </svg>
                        <div class="headline">
                            <span class="headline-content">Reminder: ${escapeHtml(rem.name)} ${dayLabel}</span>
                        </div>
                    </div>
                `;
            });
        const noteSlides = notes.map(note => {
            return `
                <div class="scroll-wrap">
                    <svg class="icon-flip" xmlns="http://www.w3.org/2000/svg" fill="#DDDDDD" stroke="transparent" stroke-width="0" width="10" height="12" viewBox="-1740.5 -134.5 9 11" style="margin-right:4px;">
                        <path d="M-1738-124v-9h4l3,3v6Zm1-1.286h5v-4.285l-2.144-2.143H-1737Zm1-.714v-1h3v1Zm0-2v-1h3v1Zm0-2v-1h2v1Z"></path>
                    </svg>
                    <div class="headline">
                        <span class="headline-content">${escapeHtml(note.text)}</span>
                    </div>
                </div>
            `;
        });
        let combinedSlides = reminderSlides.concat(noteSlides);
        if (!combinedSlides.length) {
            combinedSlides = [`
                <div class="scroll-wrap">
                    <svg class="icon-flip" xmlns="http://www.w3.org/2000/svg" fill="#DDDDDD" stroke="transparent" stroke-width="0" width="10" height="12" viewBox="-1740.5 -134.5 9 11" style="margin-right:4px;">
                        <path d="M-1738-124v-9h4l3,3v6Zm1-1.286h5v-4.285l-2.144-2.143H-1737Zm1-.714v-1h3v1Zm0-2v-1h3v1Zm0-2v-1h2v1Z"></path>
                    </svg>
                    <div class="headline">
                        <span class="headline-content">No upcoming reminders or notes</span>
                    </div>
                </div>
            `];
        }
        const slidesContainer = document.getElementById('psy-swiper-wrapper');
        if (!slidesContainer) {
            console.warn("[Reminders] Swiper wrapper not found!");
            return;
        }
        slidesContainer.innerHTML = '';
        combinedSlides.forEach((html, idx) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.setAttribute('data-slide-idx', idx);
            slide.innerHTML = html;
            slide.addEventListener('click', () => {
                if (mySwiper) {
                    mySwiper.slideNext(800);
                    mySwiper.autoplay.start();
                }
            });
            slidesContainer.appendChild(slide);
        });
        if (mySwiper) {
            if (combinedSlides.length > 1) {
                mySwiper.params.loopedSlides = combinedSlides.length;
                mySwiper.update();
                if (typeof mySwiper.slideToLoop === "function") {
                    mySwiper.slideToLoop(0, 0);
                } else {
                    mySwiper.slideTo(0, 0);
                }
                mySwiper.autoplay.start();
            } else {
                mySwiper.autoplay.stop();
            }
            console.log("[Reminders] Swiper updated with", combinedSlides.length, "slides");
        }
    }

    setInterval(rebuildSlides, 60000);

    /*********************** Initialization ***********************/
    function init() {
        console.log("[Reminders] Psy's Improved Vertical Ticker Reminders starting...");
        window.showRemindersPage = showRemindersPage;
        if (window.location.hash === "#reminders") {
            showRemindersPage();
        }
    }

    init();
})();
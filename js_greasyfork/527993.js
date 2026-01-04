// ==UserScript==
// @name         Hide-Older-Comments
// @namespace    https://orbitar.space/
// @version      1.8.8
// @description  Hide old comments on Orbitar. donations: https://orbitar.space/u/pazoozoo
// @match        https://*.orbitar.space/*
// @match        https://*.orbitar.local/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_getValue
// @grant        GM_setValue
// @author       pazoozoo
// @homepageURL  https://orbitar.space/u/pazoozoo
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527993/Hide-Older-Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/527993/Hide-Older-Comments.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("✅ Comment filtering script is running...");

    let observer; // Global observer to allow disconnecting on URL change

    const SELECTORS = {
        linksSection: '[class^="PostPage_postButtons__"]',
        comment: '.comment',
        commentContent: '[class^="CommentComponent_content__"]',
        signature: '[class^="SignatureComponent_signature__"]'
    };

    const COLORS = ['gray', 'pink', 'blue', 'skyblue', 'salmon'];
    const TIME_ADJUSTMENTS = [
        { text: "3 часа", adjust: (date) => date.setHours(date.getHours() - 3) },
        { text: "12 часов", adjust: (date) => date.setHours(date.getHours() - 12) },
        { text: "сутки", adjust: (date) => date.setDate(date.getDate() - 1) },
        { text: "3 дня", adjust: (date) => date.setDate(date.getDate() - 3) },
        { text: "неделя", adjust: (date) => date.setDate(date.getDate() - 7) }
    ];

    // Default color that will be used if no saved preference exists
    const DEFAULT_BG_COLOR = 'lightskyblue';
    
    // Will store the actual background color (loaded from GM or default)
    let parentCommentBgColor;
    
    // Function to load the saved color preference
    async function loadSavedColor() {
        try {
            const savedColor = await GM.getValue('parentCommentBgColor', DEFAULT_BG_COLOR);
            return savedColor || DEFAULT_BG_COLOR; // Fallback if saved color is null/undefined
        } catch (error) {
            console.error("Error loading saved color:", error);
            return DEFAULT_BG_COLOR;
        }
    }
    
    // Function to save the color preference
    async function saveColor(color) {
        try {
            await GM.setValue('parentCommentBgColor', color);
            console.log("Color preference saved:", color);
        } catch (error) {
            console.error("Error saving color preference:", error);
        }
    }
    
    // Initialize the color at startup
    (async function initializeColor() {
        parentCommentBgColor = await loadSavedColor();
        console.log("Using background color:", parentCommentBgColor);
    })();

    function isPostPage() {
       return /^https:\/\/([^\.]*\.)?orbitar\.space\/(p\d+|s\/[^\/]+\/p\d+)([\?].*|[\#].*)?$/.test(window.location.href);
    }

    function observeForLinksSection() {
        if (observer) {
            observer.disconnect(); // Disconnect previous observer if it exists
        }
        observer = new MutationObserver(() => {
            let linksSection = document.querySelector(SELECTORS.linksSection);
            if (linksSection && !document.getElementById("comment-filter-container")) {
                createUI(linksSection);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createUI(linksSection) {
        if (document.getElementById("comment-filter-container")) return;

        let container = document.createElement("span");
        container.id = "comment-filter-container";
        container.appendChild(document.createTextNode(" • "));

        let showFilterLink = createLink("фильтровать по дате", "#fr", (event) => {
            event.preventDefault();
            filterUI.style.display = "inline";
            showFilterLink.style.display = "none";
        });

        let filterUI = document.createElement("span");
        filterUI.style.display = "none";
        filterUI.style.marginLeft = "10px";

        let dateInput = createDateInput("comment-filter-date");
        let filterLink = createLink("фильтровать", "#ff", (event) => {
            event.preventDefault();
            filterComments();
        });
        let clearLink = createLink("очистить", "#fr", (event) => {
            event.preventDefault();
            clearFilter();
        });

        let quickLinks = document.createElement("div");
        quickLinks.style.marginTop = "10px";

        TIME_ADJUSTMENTS.forEach(({ text, adjust }, index) => {
            let timeAdjustLink = createLink(text, "#ft", (event) => {
                event.preventDefault();
                adjustDate(adjust);
            });
            quickLinks.appendChild(timeAdjustLink);
            if (index < TIME_ADJUSTMENTS.length - 1) quickLinks.appendChild(document.createTextNode(" | "));
        });

        COLORS.forEach((color, index) => {
            quickLinks.appendChild(document.createTextNode(" | "));
            let colorLink = createLink(color, "#fc", (event) => {
                event.preventDefault();
                changeParentCommentBgColor("light" + color);
            });
            quickLinks.appendChild(colorLink);
        });

        filterUI.appendChild(dateInput);
        filterUI.appendChild(filterLink);
        filterUI.appendChild(clearLink);
        filterUI.appendChild(quickLinks);

        container.appendChild(showFilterLink);
        container.appendChild(filterUI);
        linksSection.appendChild(container);
    }

    function createLink(text, href, onClick) {
        let link = document.createElement("a");
        link.href = href;
        link.innerText = text;
        link.style.marginRight = "5px";
        link.onclick = onClick;
        return link;
    }

    function createDateInput(id) {
        let input = document.createElement("input");
        input.type = "datetime-local";
        input.id = id;
        input.style.marginRight = "5px";
        return input;
    }

    function changeParentCommentBgColor(color) {
        parentCommentBgColor = color;
        // Save the color preference
        saveColor(color);
        
        let comments = document.querySelectorAll(SELECTORS.comment);
        comments.forEach(comment => {
            let commentTextContainer = comment.querySelector(SELECTORS.commentContent);
            if (commentTextContainer && COLORS.map(c => "light" + c).includes(commentTextContainer.style.backgroundColor)) {
                commentTextContainer.style.backgroundColor = color;
            }
        });
    }

    function adjustDate(adjust) {
        let dateInput = document.getElementById("comment-filter-date");
        if (!dateInput) return;

        let currentDate = new Date();
        adjust(currentDate);

        let localISOTime = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
        dateInput.value = localISOTime;
    }

    function filterComments() {
        let dateInput = document.getElementById("comment-filter-date");
        if (!dateInput) return;
        let selectedDate = new Date(dateInput.value);
        if (isNaN(selectedDate)) {
            console.error("Invalid date selected.");
            return;
        }

        console.log("Filtering comments older than:", selectedDate.toString());

        let comments = document.querySelectorAll(SELECTORS.comment);
        let commentMap = new Map();

        comments.forEach(comment => {
            let dateElement = findDateElement(comment);
            if (!dateElement) return;

            let commentDateText = dateElement.innerText.trim();
            let commentDate = parseCommentDate(commentDateText);
            let commentId = comment.dataset.commentId;
            if (isNaN(commentDate)) return;

            commentMap.set(commentId, { comment, commentDate, hasNewerChild: false });
        });

        comments.forEach(comment => {
            let commentId = comment.dataset.commentId;
            let commentData = commentMap.get(commentId);
            if (!commentData) return;

            let { commentDate } = commentData;
            let childComments = [...comment.querySelectorAll(SELECTORS.comment)];
            let hasNewerChild = childComments.some(child => {
                let childId = child.dataset.commentId;
                return commentMap.has(childId) && commentMap.get(childId).commentDate >= selectedDate;
            });
            if (hasNewerChild) {
                commentData.hasNewerChild = true;
            }
        });

        comments.forEach(comment => {
            let commentId = comment.dataset.commentId;
            let commentData = commentMap.get(commentId);
            if (!commentData) return;

            let { commentDate, hasNewerChild } = commentData;
            let commentTextContainer = comment.querySelector(SELECTORS.commentContent);
            if (!commentTextContainer) return;

            if (commentDate >= selectedDate) {
                comment.style.display = "";
                commentTextContainer.style.backgroundColor = "";
            } else if (hasNewerChild) {
                comment.style.display = "";
                commentTextContainer.style.padding = "5px";
                commentTextContainer.style.backgroundColor = parentCommentBgColor;
            } else {
                comment.style.display = "none";
            }
        });
    }

    function clearFilter() {
        let comments = document.querySelectorAll(SELECTORS.comment);
        comments.forEach(comment => {
            comment.style.display = "";
            let commentTextContainer = comment.querySelector(SELECTORS.commentContent);
            if (commentTextContainer) {
                commentTextContainer.style.backgroundColor = "";
            }
        });
        console.log("Filter cleared, all comments visible.");
    }

    function findDateElement(comment) {
        let signature = comment.querySelector(SELECTORS.signature);
        if (!signature) return null;

        let dateLinks = signature.querySelectorAll("a");
        return dateLinks.length >= 2 ? dateLinks[1] : null;
    }

    function parseCommentDate(dateText) {
        const months = {
            "января": "January", "февраля": "February", "марта": "March",
            "апреля": "April", "мая": "May", "июня": "June",
            "июля": "July", "августа": "August", "сентября": "September",
            "октября": "October", "ноября": "November", "декабря": "December"
        };

        if (dateText.startsWith("вчера в")) {
            let match = dateText.match(/вчера в (\d{1,2}):(\d{2})/);
            if (match) {
                let yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                yesterday.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
                return yesterday;
            }
        }

        if (dateText.startsWith("сегодня в")) {
            let match = dateText.match(/сегодня в (\d{1,2}):(\d{2})/);
            if (match) {
                let today = new Date();
                today.setHours(parseInt(match[1], 10), parseInt(match[2], 10), 0, 0);
                return today;
            }
        }

        let oldFormatMatch = dateText.match(/(\d{1,2})\s([а-яА-Я]+)\sв\s(\d{1,2}):(\d{2})/);
        if (oldFormatMatch) {
            let [_, day, monthName, hour, minute] = oldFormatMatch;
            let month = months[monthName];
            if (!month) return NaN;
            let currentYear = new Date().getFullYear();
            return new Date(`${day} ${month} ${currentYear} ${hour}:${minute}`);
        }

        let newFormatMatch = dateText.match(/(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})/);
        if (newFormatMatch) {
            let [_, day, month, year, hour, minute] = newFormatMatch;
            return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
        }

        return NaN;
    }

    function runScript() {
        if (isPostPage()) {
            let existingContainer = document.getElementById("comment-filter-container");
            if (existingContainer) {
                existingContainer.remove();
            }
            clearFilter();
            observeForLinksSection();
        }
    }

    // Run the script initially if on a post page
    runScript();

    // Listen for URL changes via popstate (back/forward navigation)
    window.addEventListener('popstate', runScript);

    // Listen for hash changes if navigation uses URL fragments
    window.addEventListener('hashchange', runScript);

    // Override pushState to detect URL changes
    const originalPushState = history.pushState;
    history.pushState = function () {
        originalPushState.apply(this, arguments);
        runScript();
    };

    // Override replaceState similarly
    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        runScript();
    };
})();

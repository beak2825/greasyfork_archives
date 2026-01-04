// ==UserScript==
// @name         IgnitiaPlus
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @license      Apache-2.0
// @description  Enhance your study experience with IgnitiaPlus
// @author       Minemetero
// @match        *://*.ignitiaschools.com/*
// @icon         https://raw.githubusercontent.com/Minemetero/Minemetero/refs/heads/master/2.png
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://unpkg.com/darkreader@latest/darkreader.js
// @require      https://cdn.jsdelivr.net/npm/mathjs@14/lib/browser/math.min.js
// @downloadURL https://update.greasyfork.org/scripts/506350/IgnitiaPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/506350/IgnitiaPlus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let clockWidget, timetableWidget, todoWidget;

    /*** CSS Injection ***/
    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --primary-color: #007BFF;
                --primary-color-dark: #0056b3;
                --text-color: #ffffff;
            }

            /* ======================================================
            General Widget Styles
            ====================================================== */
            #clockWidget,
            #timetableWidget,
            #todoWidget,
            #minimalist-toolbar-popup,
            #StopWatchWidget {
                position: fixed;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                border-radius: 5px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                z-index: 1000;
                user-select: none;
                overflow: hidden;
            }

            #clockWidget,
            #timetableWidget,
            #todoWidget,
            #StopWatchWidget {
                max-width: 90vw;
                max-height: 90vh;
            }

            /* ======================================================
            Clock Widget and Stop Watch Widget
            ====================================================== */
            #clockWidget,
            #StopWatchWidget {
                bottom: 10px;
                right: 10px;
                background-color: rgba(0, 0, 0, 0.5);
                padding: 5px 10px;
                cursor: move;
            }

            /* ======================================================
            Stop Watch Widget
            ====================================================== */

            .incompleted {
                color: #00b3ff !important;
            }

            .completed {
                color: #07f007 !important;
            }

            /* ======================================================
            Timetable Widget
            ====================================================== */
            #timetableWidget {
                bottom: 60px;
                left: 10px;
                padding: 10px;
                overflow-y: auto;
            }

            #timetableWidget textarea {
                width: 100%;
                height: calc(100% - 40px);
                background: transparent;
                color: white;
                border: none;
                outline: none;
                resize: none;
                margin-top: 5px;
            }

            /* ======================================================
            Todo Widget
            ====================================================== */
            #todoWidget {
                bottom: 0;
                left: 10px;
                padding: 10px;
                overflow: auto;
            }

            #todoWidget ul {
                list-style-type: none;
                padding: 0;
                margin-top: 10px;
            }

            #todoWidget ul li {
                margin: 0;
                cursor: pointer;
                padding: 5px;
                border-radius: 3px;
                background-color: rgba(255, 255, 255, 0.1);
            }

            /* ======================================================
            Resize Handles
            ====================================================== */
            .resize-handle {
                width: 10px;
                height: 10px;
                background-color: rgba(255, 255, 255, 0.5);
                position: absolute;
                bottom: 0;
                right: 0;
                cursor: nwse-resize;
            }

            #todoWidget .resize-handle {
                width: 15px;
                height: 15px;
                background-color: rgba(255, 255, 255, 0.7);
                border-bottom-right-radius: 5px;
            }

            /* ======================================================
            Minimalist Toolbar Popup
            ====================================================== */
            #minimalist-toolbar-popup {
                top: 50px;
                left: 10px;
                width: 250px;
                background: #f9f9f9;
                color: #333;
                padding: 15px;
                border: 1px solid #ddd;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                display: none;
                flex-direction: column;
                align-items: center;
                border-radius: 10px;
                z-index: 1000;
            }

            #minimalist-toolbar-popup textarea {
                width: 100%;
                background: #fff;
                color: #333;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                outline: none;
                resize: none;
            }

            #minimalist-calculator {
                height: 50px;
                margin-bottom: 15px;
            }

            #minimalist-notes {
                height: 100px;
            }

            /* ======================================================
            Toggle Menu Dropdown (from Cog)
            ====================================================== */
            .toggle-widgets {
                z-index: 9999;
                background-color: #333;
                color: #fff;
                padding: 10px;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
                min-width: 150px;
                max-height: 200px;
                overflow-y: auto;
            }

            .widget-container {
                display: flex;
                flex-direction: row;
                align-items: center;
                background-color: transparent;
                border-radius: 4px;
            }

            .widget-container span {
                flex: 1;
                white-space: nowrap;
                font-size: 16px;
            }

            /* The Reset button */
            #resetButton {
                margin-left: 8px;
                background-color: var(--primary-color);
                color: var(--text-color);
                border: none;
                border-radius: 5px;
                padding: 4px 8px;
                cursor: pointer;
                transition: background-color 0.3s;
                font-size: 12px;
            }

            /* ======================================================
            Dark Mode Toggle
            ====================================================== */
            #dark-reader-toggle {
                position: fixed;
                bottom: 10px;
                left: 70px;
                z-index: 10000;
                padding: 10px;
                background-color: transparent;
                color: white;
                border-radius: 50%;
                cursor: pointer;
                font-size: 20px;
                text-align: center;
            }

            /* ======================================================
            Toolbar Toggle (if used)
            ====================================================== */
            #minimalist-toolbar-toggle {
                position: fixed;
                top: 10px;
                left: 10px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
                color: #fff;
                text-align: center;
                line-height: 50px;
                border-radius: 50%;
                font-size: 20px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
                z-index: 1001;
                cursor: pointer;
                transition: background 0.3s, transform 0.2s;
            }

            #minimalist-toolbar-toggle:hover {
                background: linear-gradient(135deg, var(--primary-color-dark), var(--primary-color));
                transform: scale(1.1);
            }

            /* ======================================================
            Container for Widget Toggle Rows (if needed)
            ====================================================== */
            #container {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 2px;
            }

            /* ======================================================
            FadeIn Animation (for Quote)
            ====================================================== */
            @keyframes fadeIn {
                to {
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /*** Utility Functions ***/
    function injectFavicon(href) {
        const existingFavicon = document.querySelector('link[rel="shortcut icon"]');
        if (existingFavicon) existingFavicon.remove();
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'shortcut icon';
        faviconLink.href = href;
        faviconLink.type = 'image/x-icon';
        document.head.appendChild(faviconLink);
    }

    function adjustElementPosition(element, storageKey) {
        if (!element) return;
        let rect = element.getBoundingClientRect();
        let adjustedLeft = rect.left;
        let adjustedTop = rect.top;
        if (rect.right > window.innerWidth) adjustedLeft = window.innerWidth - rect.width;
        if (rect.bottom > window.innerHeight) adjustedTop = window.innerHeight - rect.height;
        if (rect.left < 0) adjustedLeft = 0;
        if (rect.top < 0) adjustedTop = 0;
        element.style.left = `${adjustedLeft}px`;
        element.style.top = `${adjustedTop}px`;
        localStorage.setItem(storageKey, JSON.stringify({ left: element.style.left, top: element.style.top }));
    }

    function loadSavedPositionAndSize(element, posKey, sizeKey) {
        const savedPos = JSON.parse(localStorage.getItem(posKey));
        if (savedPos) {
            let left = parseInt(savedPos.left, 10);
            let top = parseInt(savedPos.top, 10);
            left = Math.max(0, Math.min(left, window.innerWidth - element.offsetWidth));
            top = Math.max(0, Math.min(top, window.innerHeight - element.offsetHeight));
            element.style.left = `${left}px`;
            element.style.top = `${top}px`;
            element.style.bottom = 'auto'; element.style.right = 'auto';
        }
        const savedSize = JSON.parse(localStorage.getItem(sizeKey));
        if (savedSize) {
            element.style.width = savedSize.width;
            element.style.height = savedSize.height;
        }
    }

    /*** Page Modifiers ***/
    function modifyPageHead() {
        const titleElement = document.querySelector('title');
        if (!titleElement) return;
        const titleText = titleElement.textContent.trim();
        if (titleText === 'Ignitia') {
            titleElement.textContent = 'IgnitiaPlus';
            injectFavicon('https://raw.githubusercontent.com/Minemetero/Minemetero/refs/heads/master/assets/favicon.png');
        } else if (titleText === 'Bournemouth Christian School') {
            titleElement.textContent = 'SwitchedOnPlus';
            injectFavicon('https://raw.githubusercontent.com/BurdenOwl/burdenowl/refs/heads/main/switchedonplus.png');
        }
    }

    function removeUnwantedElements() {
        const signOutElement = document.getElementById('logout');
        const bannerTabDividers = document.querySelectorAll('.bannerTabDivider');
        if (signOutElement) signOutElement.remove();
        bannerTabDividers.forEach(divider => divider.remove());
    }

    function removeLoginError() {
        const loginError = document.querySelector('.login-error.alert.alert-error');
        if (loginError) {
            loginError.remove();
        }
    }

    function logOut() { /***(Credit:BurdenOwl)***/
        const passwordResetForm = document.getElementById("passwordResetFormWrapper");
        if (!passwordResetForm) return;

        const signOutButton = document.createElement('button');
        signOutButton.id = 'signOut';
        signOutButton.className = 'btn btn-default btn-block';
        signOutButton.textContent = 'Sign Out';

        passwordResetForm.appendChild(signOutButton);

        signOutButton.addEventListener('click', () => {
            const logoutUrl = `${window.location.origin}/owsoo/j_spring_security_logout`;
            window.location.href = logoutUrl;
        });
    }

    function assignmentLabel() {/***(Credit:BurdenOwl)***/
        if (!window.location.href.includes('/owsoo/studentAssignment')) {
            return;
        };

        const tag = document.querySelector(".assignmentTitle");
        const innerTag = tag.children[0];
        if (tag.textContent.includes("Quiz") == true) {
            innerTag.textContent = "Quiz";
        } else if (tag.textContent.includes("Test") == true) {
            innerTag.textContent = "Test";
        } else if (tag.textContent.includes("Project") == true) {
            innerTag.textContent = "Project";
        } else if (tag.textContent.includes("Review") == true) {
            if (tag.textContent.includes("Test") == true || tag.textContent.includes("Quiz") == true) return;
            innerTag.textContent = "Review";
        } else if (tag.textContent.includes("Exam") == true) {
            innerTag.textContent = "Exam";
        } else if (tag.textContent.includes("Course Overview") == true) {
            innerTag.textContent = "Overview";
        } else if (tag.textContent.includes("Essay") == true) {
            innerTag.textContent = "Essay";
        } else if (tag.textContent.includes("Performance Task") == true) {
            innerTag.textContent = "PT";
        }
    };

    function addRefreshWarning() {
        if (window.location.href.includes('/owsoo/home')) return;
        let warningActive = false;
        window.addEventListener('beforeunload', (event) => {
            if (!warningActive) {
                warningActive = true;
                event.preventDefault();
                event.returnValue = '';
                setTimeout(() => { warningActive = false; }, 5000);
            }
        });
    }

    function addContributorTab() {
        const navTabs = document.querySelector('ul.nav.nav-tabs[data-tabs="tabs"]');
        if (!navTabs) return;

        const contributorTab = document.createElement('li');
        contributorTab.className = 'contributor';

        // Create tooltip element with updated positioning
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            display: none;
            position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 1000;
            white-space: nowrap;
            pointer-events: none;
            transform: translateX(-100%) translateY(-50%);  /* Changed to move left and center vertically */
            margin-right: 10px;  /* Added margin to separate from the tab */
        `;
        tooltip.textContent = 'IgnitiaPlus contributors: Minemetero, BurdenOwl';

        // Updated tooltip positioning on hover
        contributorTab.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
            const rect = contributorTab.getBoundingClientRect();
            tooltip.style.left = `${rect.left}px`;  // Position at left edge of tab
            tooltip.style.top = `${rect.top + (rect.height / 2)}px`;  // Center vertically
        });

        contributorTab.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        const contributorLink = document.createElement('a');
        contributorLink.href = '#';
        contributorLink.className = 'clickable-icon';
        contributorLink.style.cssText = `
            display: block;
            padding: 14.5px 0;
            text-align: center;
            color: #666666;
            font-size: 24px;
            width: 52px;
            background: #fbfbfb;
            border: 1px solid #ccc;
            border-radius: 2px;
            margin-bottom: 5px;
            cursor: pointer;
        `;

        contributorLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

        });

        contributorLink.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 -960 960 960"style="width: 24px; height: 24px; display: block; margin: 0 auto;">
                <path d="M680-119q-8 0-16-2t-15-7l-120-70q-14-8-21.5-21.5T500-249v-141q0-16 7.5-29.5T529-441l120-70q7-5 15-7t16-2q8 0 15.5 2.5T710-511l120 70q14 8 22 21.5t8 29.5v141q0 16-8 29.5T830-198l-120 70q-7 4-14.5 6.5T680-119ZM400-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM80-160v-112q0-33 17-62t47-44q51-26 115-44t141-18h14q6 0 12 2-8 18-13.5 37.5T404-360h-4q-71 0-127.5 18T180-306q-9 5-14.5 14t-5.5 20v32h252q6 21 16 41.5t22 38.5H80Zm320-400q33 0 56.5-23.5T480-640q0-33-23.5-56.5T400-720q-33 0-56.5 23.5T320-640q0 33 23.5 56.5T400-560Zm0-80Zm12 400Zm174-166 94 55 94-55-94-54-94 54Zm124 208 90-52v-110l-90 53v109Zm-150-52 90 53v-109l-90-53v109Z"></path>
            </svg>`;

        contributorTab.appendChild(contributorLink);
        document.body.appendChild(tooltip);
        navTabs.appendChild(contributorTab);
    }

    /** Functions for Footer ***/
    function createFooterModeSelector() {
        // Container
        const container = document.createElement('div');
        container.className = 'widget-container';

        // Label
        const label = document.createElement('span');
        label.textContent = 'Footer Mode';
        label.style.flex = "1";
        label.style.fontSize = "16px";

        // Dropdown
        const select = document.createElement('select');
        select.style.width = "120px";
        select.style.padding = "3px";
        select.style.borderRadius = "3px";
        select.style.border = "1px solid #ddd";
        select.style.fontSize = "14px";

        const modes = [
            { value: 'none', label: 'Do Nothing' },
            { value: 'remove', label: 'Remove Footer' },
            { value: 'modified', label: 'Modified Footer' },
        ];

        // Load saved mode (default "none")
        let savedMode = localStorage.getItem('footerMode') || 'none';

        modes.forEach(m => {
            const option = document.createElement('option');
            option.value = m.value;
            option.textContent = m.label;
            select.appendChild(option);
        });
        select.value = savedMode;

        select.addEventListener('change', () => {
            const newMode = select.value;
            localStorage.setItem('footerMode', newMode);
            applyFooterMode(newMode);
        });

        container.appendChild(label);
        container.appendChild(select);
        return container;
    }

    function applyFooterMode(mode) {
        const footerElement = document.getElementById('footer');
        if (!footerElement) return;

        switch (mode) {
            case 'remove':
                footerElement.style.display = 'none';
                break;

            case 'modified':
                footerElement.style.display = '';
                adjustFooter();
                break;

            default:
                footerElement.style.display = '';
                footerElement.style.position = '';
                footerElement.style.bottom = '';
                footerElement.style.left = '';
                footerElement.style.right = '';
                break;
        }
    }

    function adjustFooter() {
        const footerElement = document.getElementById('footer');
        if (!footerElement) return;

        function updateFooterPosition() {
            // If the content's height is less than or equal to the viewport height, fix the footer at the bottom.
            if (document.body.scrollHeight <= window.innerHeight) {
                footerElement.style.position = 'fixed';
                footerElement.style.bottom = '0';
                footerElement.style.left = '0';
                footerElement.style.right = '0';
            } else {
                // Otherwise, let the site's own CSS take over.
                footerElement.style.position = '';
                footerElement.style.bottom = '';
                footerElement.style.left = '';
                footerElement.style.right = '';
            }
        }

        updateFooterPosition();

        window.addEventListener('resize', updateFooterPosition);

        const observer = new MutationObserver(updateFooterPosition);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Check on dynamic content load
        window.addEventListener('load', updateFooterPosition);
        document.addEventListener('DOMContentLoaded', updateFooterPosition);
    }

    /*** Widgets Manager ***/
    function createWidgetToggleCog() {
        const cogContainer = document.createElement('div');
        cogContainer.id = 'widget-toggle-cog-container';
        Object.assign(cogContainer.style, {
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            zIndex: '10000'
        });

        // Create the cog icon
        const cogIcon = document.createElement('div');
        cogIcon.id = 'widget-toggle-cog';
        Object.assign(cogIcon.style, {
            padding: '10px',
            backgroundColor: 'transparent',
            color: 'white',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            textAlign: 'center'
        });
        cogIcon.textContent = '⚙️';

        // Build the dropdown container with checkboxes
        const toggleMenu = createToggleMenu();
        Object.assign(toggleMenu.style, {
            position: 'absolute',
            bottom: '100%',
            left: '0',
            marginBottom: '5px',
            display: 'none'
        });

        cogContainer.appendChild(cogIcon);
        cogContainer.appendChild(toggleMenu);

        cogIcon.addEventListener('click', () => {
            toggleMenu.style.display =
                (toggleMenu.style.display === 'none') ? 'flex' : 'none';
        });

        document.body.appendChild(cogContainer);
    }

    function createToggleMenu() {
        const toggleMenu = document.createElement('div');
        toggleMenu.className = 'toggle-widgets';

        const widgets = [
            { name: 'Clock', id: 'clockWidget', init: addClock },
            { name: 'Class Timetable', id: 'timetableWidget', init: addClassTimetable },
            { name: 'Todo List', id: 'todoWidget', init: addTodoList },
            { name: 'Quote', id: 'quoteWidget', init: addInspirationalQuoteWidget }
        ];

        widgets.forEach(widget => {
            const container = createWidgetContainer(widget);
            toggleMenu.appendChild(container);
        });

        const footerModeSelector = createFooterModeSelector();
        toggleMenu.appendChild(footerModeSelector);

        const themeSelector = createThemeSelector();
        toggleMenu.appendChild(themeSelector);

        toggleMenu.style.marginBottom = '2px';
        return toggleMenu;
    }

    function createWidgetContainer(widget) {
        let isEnabled = JSON.parse(localStorage.getItem(widget.id) || 'true');

        const label = document.createElement('span');
        label.textContent = widget.name;
        label.style.marginBottom = '5px';
        label.style.cursor = 'pointer';

        label.addEventListener('click', () => {
            isEnabled = !isEnabled;
            localStorage.setItem(widget.id, isEnabled);
            if (isEnabled) {
                widget.init();
            } else {
                document.getElementById(widget.id)?.remove();
            }
        });

        const resetButton = createResetButton(widget);
        const container = document.createElement('div');
        container.className = 'widget-container';
        container.appendChild(label);
        container.appendChild(resetButton);
        return container;
    }

    function createResetButton(widget) {
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.id = 'resetButton';

        resetButton.addEventListener('click', () => {
            localStorage.removeItem(`${widget.id}Position`);
            localStorage.removeItem(`${widget.id}Size`);
            location.reload();
        });

        resetButton.addEventListener('mouseover', () => {
            resetButton.style.backgroundColor = 'var(--primary-color-dark)';
        });
        resetButton.addEventListener('mouseout', () => {
            resetButton.style.backgroundColor = 'var(--primary-color)';
        });

        return resetButton;
    }

    /*** Widgets ***/
    function testAndQuizStopWatch() { /***(Credit:BurdenOwl)***/
        if (!window.location.href.includes('/owsoo/studentAssignment')) return;

        const assignmentTab = document.querySelector('.assignmentTitle.assignment-title-text');
        if (!assignmentTab) return;

        const assignmentType = assignmentTab.textContent;
        if (assignmentType.includes("Quiz") || assignmentType.includes("Test")) {
            const stopwatchWidget = document.createElement('div');
            stopwatchWidget.id = 'StopWatchWidget';
            stopwatchWidget.classList.add('incompleted');
            stopwatchWidget.style.resize = "none";
            stopwatchWidget.style.position = 'fixed';
            stopwatchWidget.style.cursor = 'move';

            const displaySpan = document.createElement("span");
            displaySpan.id = "displayOfWatch";
            displaySpan.textContent = "0.00";
            stopwatchWidget.appendChild(displaySpan);

            let startTime = Date.now();
            let elapsedTime = 0;
            let timer = null;
            let running = false;

            function updateTimer() {
                if (!running) return;

                const currentTime = Date.now();
                elapsedTime = (currentTime - startTime) / 1000; // in seconds

                const hours = Math.floor(elapsedTime / 3600);
                const minutes = Math.floor((elapsedTime % 3600) / 60);
                const seconds = (elapsedTime % 60).toFixed(2);
                const formattedTime =
                    `${String(hours).padStart(2, '0')}:` +
                    `${String(minutes).padStart(2, '0')}:` +
                    `${String(seconds).padStart(5, '0')}`;

                const questionsNumberElement = document.querySelector(".totalProblemCount");
                if (questionsNumberElement) {
                    const totalProblems = parseInt(questionsNumberElement.textContent.trim(), 10);
                    const minutesConverted = minutes + (parseFloat(seconds) / 60);
                    const totalTimeInMinutes = hours * 60 + minutesConverted;

                    if (!isNaN(totalProblems)) {
                        const expectedTime = 1.1 * (totalProblems - 5) + 10;
                        if (totalTimeInMinutes >= expectedTime) {
                            stopwatchWidget.classList.remove("incompleted");
                            stopwatchWidget.classList.add("completed");
                        }
                    }
                }

                displaySpan.textContent = formattedTime;
                requestAnimationFrame(updateTimer);
            }

            function startTimer() {
                if (running) return;
                startTime = Date.now();
                running = true;
                requestAnimationFrame(updateTimer);

                localStorage.setItem('stopwatchStartTime', startTime.toString());
                document.addEventListener('visibilitychange', handleVisibilityChange);
            }

            function handleVisibilityChange() {
                if (document.visibilityState === 'visible') {
                    const storedStartTime = parseInt(localStorage.getItem('stopwatchStartTime') || '0', 10);
                    if (storedStartTime > 0) {
                        startTime = storedStartTime;
                        running = true;
                    }
                }
            }

            // Drag functionality
            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            stopwatchWidget.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - stopwatchWidget.offsetLeft;
                offsetY = e.clientY - stopwatchWidget.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                newX = Math.max(0, Math.min(newX, window.innerWidth - stopwatchWidget.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - stopwatchWidget.offsetHeight));
                stopwatchWidget.style.left = `${newX}px`;
                stopwatchWidget.style.top = `${newY}px`;
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    localStorage.setItem('StopWatchWidgetPosition', JSON.stringify({
                        left: stopwatchWidget.style.left,
                        top: stopwatchWidget.style.top
                    }));
                }
            });

            document.body.appendChild(stopwatchWidget);
            startTimer();
            loadSavedPositionAndSize(stopwatchWidget, 'StopWatchWidgetPosition', null);
        } else {
            return; // Exit if not a Quiz/Test
        }
    }

    function addClock() {
        clockWidget = document.createElement('div');
        clockWidget.id = 'clockWidget';
        clockWidget.style.resize = "none";

        function updateClock() {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, '0');
            const m = now.getMinutes().toString().padStart(2, '0');
            const s = now.getSeconds().toString().padStart(2, '0');
            clockWidget.textContent = `${h}:${m}:${s}`;
        }

        let isDragging = false, offsetX, offsetY;
        clockWidget.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - clockWidget.offsetLeft;
            offsetY = e.clientY - clockWidget.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                newX = Math.max(0, Math.min(newX, window.innerWidth - clockWidget.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - clockWidget.offsetHeight));
                clockWidget.style.left = `${newX}px`;
                clockWidget.style.top = `${newY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('clockWidgetPosition', JSON.stringify({ left: clockWidget.style.left, top: clockWidget.style.top }));
            }
        });

        updateClock();
        setInterval(updateClock, 1000);
        document.body.appendChild(clockWidget);
        loadSavedPositionAndSize(clockWidget, 'clockWidgetPosition', null);
    }

    function addClassTimetable() {
        timetableWidget = document.createElement('div');
        timetableWidget.id = 'timetableWidget';

        const timetableHeader = document.createElement('div');
        timetableHeader.textContent = '📅 Class Timetable';
        timetableHeader.style.fontWeight = 'bold';
        timetableHeader.style.cursor = 'move';

        const timetableBody = document.createElement('textarea');
        timetableBody.placeholder = 'Enter your class schedule here...';
        timetableBody.value = localStorage.getItem('timetable') || '';
        timetableBody.addEventListener('input', () => localStorage.setItem('timetable', timetableBody.value));

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';

        timetableWidget.appendChild(timetableHeader);
        timetableWidget.appendChild(timetableBody);
        timetableWidget.appendChild(resizeHandle);
        document.body.appendChild(timetableWidget);

        let isDragging = false, isResizing = false, offsetX, offsetY;
        timetableHeader.addEventListener('mousedown', (e) => {
            if (e.target === resizeHandle) return;
            isDragging = true;
            offsetX = e.clientX - timetableWidget.offsetLeft;
            offsetY = e.clientY - timetableWidget.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                newX = Math.max(0, Math.min(newX, window.innerWidth - timetableWidget.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - timetableWidget.offsetHeight));
                timetableWidget.style.left = `${newX}px`;
                timetableWidget.style.top = `${newY}px`;
            } else if (isResizing) {
                const newWidth = e.clientX - timetableWidget.getBoundingClientRect().left;
                const newHeight = e.clientY - timetableWidget.getBoundingClientRect().top;
                timetableWidget.style.width = `${newWidth}px`;
                timetableWidget.style.height = `${newHeight}px`;
                timetableBody.style.height = 'calc(100% - 40px)';
                localStorage.setItem('timetableWidgetSize', JSON.stringify({ width: timetableWidget.style.width, height: timetableWidget.style.height }));
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('timetableWidgetPosition', JSON.stringify({ left: timetableWidget.style.left, top: timetableWidget.style.top }));
            }
            if (isResizing) isResizing = false;
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            e.preventDefault();
            e.stopPropagation();
        });

        loadSavedPositionAndSize(timetableWidget, 'timetableWidgetPosition', 'timetableWidgetSize');
    }

    function addTodoList() {
        todoWidget = document.createElement('div');
        todoWidget.id = 'todoWidget';

        const todoHeader = document.createElement('div');
        todoHeader.textContent = '📝 Todo List';
        todoHeader.style.fontWeight = 'bold';
        todoHeader.style.marginBottom = '5px';
        todoHeader.style.cursor = 'move';

        const todoInput = document.createElement('input');
        todoInput.placeholder = 'Add a new task...';
        Object.assign(todoInput.style, { width: '90%', padding: '5px', borderRadius: '3px', border: '1px solid #ddd' });

        const todoList = document.createElement('ul');
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';

        todoWidget.appendChild(todoHeader);
        todoWidget.appendChild(todoInput);
        todoWidget.appendChild(todoList);
        todoWidget.appendChild(resizeHandle);
        document.body.appendChild(todoWidget);

        const savedTodos = JSON.parse(localStorage.getItem('todoItems')) || [];
        savedTodos.forEach(addTodoItem);

        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && todoInput.value.trim() !== '') {
                addTodoItem(todoInput.value.trim());
                todoInput.value = '';
            }
        });

        let isDragging = false, isResizing = false, offsetX, offsetY;
        let startX, startY, startWidth, startHeight;

        todoHeader.addEventListener('mousedown', (e) => {
            if (isResizing) return;
            isDragging = true;
            offsetX = e.clientX - todoWidget.offsetLeft;
            offsetY = e.clientY - todoWidget.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let newX = e.clientX - offsetX;
                let newY = e.clientY - offsetY;
                newX = Math.max(0, Math.min(newX, window.innerWidth - todoWidget.offsetWidth));
                newY = Math.max(0, Math.min(newY, window.innerHeight - todoWidget.offsetHeight));
                todoWidget.style.left = `${newX}px`;
                todoWidget.style.top = `${newY}px`;
            } else if (isResizing) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const newWidth = Math.max(startWidth + deltaX, 50);
                const newHeight = Math.max(startHeight + deltaY, 50);
                todoWidget.style.width = `${newWidth}px`;
                todoWidget.style.height = `${newHeight}px`;
                localStorage.setItem('todoWidgetSize', JSON.stringify({ width: todoWidget.style.width, height: todoWidget.style.height }));
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('todoWidgetPosition', JSON.stringify({ left: todoWidget.style.left, top: todoWidget.style.top }));
            }
            if (isResizing) isResizing = false;
        });

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            e.preventDefault();
            e.stopPropagation();
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(todoWidget).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(todoWidget).height, 10);
        });

        loadSavedPositionAndSize(todoWidget, 'todoWidgetPosition', 'todoWidgetSize');
        if (!localStorage.getItem('todoWidgetSize')) {
            todoWidget.style.width = '150px';
            todoWidget.style.height = '200px';
        }

        function addTodoItem(todoText) {
            const todoItem = document.createElement('li');
            const index = todoList.children.length + 1;
            todoItem.textContent = `${index}. ${todoText}`;
            todoItem.addEventListener('click', () => {
                todoItem.style.textDecoration = (todoItem.style.textDecoration === 'line-through') ? 'none' : 'line-through';
            });
            todoItem.addEventListener('dblclick', () => {
                todoItem.remove();
                saveTodos();
                updateTodoIndices();
            });
            todoList.appendChild(todoItem);
            saveTodos();
        }

        function saveTodos() {
            const todos = Array.from(todoList.children).map(item => item.textContent.split('. ')[1]);
            localStorage.setItem('todoItems', JSON.stringify(todos));
        }

        function updateTodoIndices() {
            Array.from(todoList.children).forEach((item, index) => {
                const text = item.textContent.split('. ')[1];
                item.textContent = `${index + 1}. ${text}`;
            });
        }
    }

    /*** Dark Mode Toggle ***/
    async function createDarkReaderToggle() {
        const btn = document.createElement('div');
        btn.id = 'dark-reader-toggle';
        btn.textContent = '🔆';
        btn.addEventListener('click', async () => {
            if (await GM.getValue('darkMode', false)) {
                await GM.setValue('darkMode', false);
                disableDarkMode();
            } else {
                await GM.setValue('darkMode', true);
                enableDarkMode();
            }
        });
        document.body.appendChild(btn);

        if (await GM.getValue('darkMode', false)) enableDarkMode();
        else disableDarkMode();

        const divWithName = document.querySelector('#nonEulaHeaderContent, .brand');
        if (await GM.getValue('darkMode', false)) {
            if (divWithName.textContent.includes("SwitchedOn") == true) {
                const logoElement = document.querySelector('#gl_logo img');
                if (logoElement) logoElement.src = "https://raw.githubusercontent.com/BurdenOwl/burdenowl/refs/heads/main/logo(7).png";
            };
        }

    }

    function enableDarkMode() {
        DarkReader.setFetchMethod(window.fetch);
        DarkReader.enable({ brightness: 105, contrast: 105, sepia: 0 });
        const btn = document.getElementById('dark-reader-toggle');
        if (btn) btn.textContent = '🔅';
        const divWithName = document.querySelector('#nonEulaHeaderContent, .brand');
        if (divWithName.textContent.includes("SwitchedOn") == true) {
            const logoElement = document.querySelector('#gl_logo img');
            if (logoElement) logoElement.src = "https://raw.githubusercontent.com/BurdenOwl/burdenowl/refs/heads/main/logo(7).png";
        } else {
            const logoElement = document.querySelector('#gl_logo img');
            if (logoElement) logoElement.src = 'https://raw.githubusercontent.com/BurdenOwl/burdenowl/refs/heads/main/failureswebsite.png';
        }
    }

    function disableDarkMode() {
        DarkReader.disable();
        const btn = document.getElementById('dark-reader-toggle');
        if (btn) btn.textContent = '🔆';

        const divWithName = document.querySelector('#nonEulaHeaderContent, .brand');
        if (divWithName.textContent.includes("SwitchedOn") == true) {
            const logoElement = document.querySelector('#gl_logo img');
            if (logoElement) logoElement.src = "https://media-release.glynlyon.com/branding/images/bournemouthchristianschool/logo.png";
        } else {
            const logoElement = document.querySelector('#gl_logo img');
            if (logoElement) logoElement.src = 'https://media-release.glynlyon.com/branding/images/ignitia/logo.png';
        }
    }

    /*** Minimalist Toolbar ***/
    function addMinibar() {
        const toolbar = createToolbar();
        const toggleButton = createToggleButton(toolbar);
        const developerName = createDeveloperName();
        const calculator = createCalculator();
        const notes = createNotes();

        toolbar.appendChild(developerName);
        toolbar.appendChild(calculator);
        toolbar.appendChild(notes);

        document.body.appendChild(toggleButton);
        document.body.appendChild(toolbar);
    }



    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'minimalist-toolbar-popup';
        return toolbar;
    }

    function createToggleButton(toolbar) {
        const toggleButton = document.createElement('div');
        toggleButton.id = 'minimalist-toolbar-toggle';

        toggleButton.style.display = "flex";
        toggleButton.style.justifyContent = "center";
        toggleButton.style.alignItems = "center";
        toggleButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" width="24" height="24" style="display: block; margin: auto;">
                <path fill="white" d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"></path>
            </svg>`;

        toggleButton.addEventListener('click', () => {
            toolbar.style.display = (toolbar.style.display === 'none') ? 'flex' : 'none';
        });

        return toggleButton;
    }

    function createDeveloperName() {
        const developerName = document.createElement('div');
        developerName.textContent = 'By Minemetero';
        developerName.style.fontWeight = 'bold';
        developerName.style.marginBottom = '15px';
        return developerName;
    }

    function createCalculator() {
        const calculator = document.createElement('textarea');
        calculator.id = 'minimalist-calculator';
        calculator.placeholder = 'Calculator (press Enter to evaluate)';

        calculator.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                try {
                    const input = calculator.value.trim();
                    let result;

                    if (input.startsWith('sqrt(') && input.endsWith(')')) {
                        const number = input.slice(5, -1);
                        result = math.sqrt(math.evaluate(number));
                    } else if (input.startsWith('simplify(') && input.endsWith(')')) {
                        const expr = input.slice(10, -1);
                        result = math.simplify(expr).toString();
                    } else {
                        result = math.evaluate(input);
                    }

                    calculator.value = `${result}`;
                } catch {
                    calculator.value = 'Error!';
                }
            }
        });

        return calculator;
    }

    function createNotes() {
        const notes = document.createElement('textarea');
        notes.id = 'minimalist-notes';
        notes.placeholder = 'Your Notes...';
        notes.value = localStorage.getItem('minimalistNotes') || '';

        notes.addEventListener('input', () => {
            localStorage.setItem('minimalistNotes', notes.value);
        });

        return notes;
    }

    /*** Inspirational Quote ***/
    async function addInspirationalQuoteWidget() {
        if (!window.location.pathname.startsWith('/owsoo/login/auth')) {
            return;
        }
        if (document.getElementById('quoteWidget')) return;

        const quotesURL = "https://raw.githubusercontent.com/Minemetero/IgnitiaPlus/refs/heads/main/qutoes.json";
        try {
            const response = await fetch(quotesURL, { cache: "no-store" });
            if (!response.ok) {
                console.error("Failed to load quotes:", response.statusText);
                return;
            }

            const quotes = await response.json();
            if (!Array.isArray(quotes) || quotes.length === 0) {
                console.error("Quotes file is empty or not an array.");
                return;
            }

            const today = new Date();
            const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
            const quote = quotes[dayOfYear % quotes.length];
            displayQuote(quote);
        } catch (error) {
            console.error("Error fetching quotes:", error);
        }
    }

    function displayQuote(quote) {
        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/css2?family=Merriweather&display=swap';
        link.rel = 'stylesheet';
        document.head.appendChild(link);

        // Create the quote container
        const quoteContainer = document.createElement('div');
        quoteContainer.id = 'quoteWidget';
        Object.assign(quoteContainer.style, {
            position: 'fixed', top: '50%', right: '200px',
            transform: 'translateY(-50%)',
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            color: 'white', padding: '20px', borderRadius: '15px',
            fontFamily: '"Merriweather", serif', fontSize: '22px',
            lineHeight: '1.5', zIndex: '1000', maxWidth: '350px', textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', opacity: '0', animation: 'fadeIn 1s forwards'
        });

        // The quote text
        const quoteText = document.createElement('div');
        quoteText.textContent = quote;

        quoteContainer.appendChild(quoteText);
        document.body.appendChild(quoteContainer);
    }

    /*** Theme Changer ***/
    function setTheme(primary, primaryDark) {
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--primary-color-dark', primaryDark);
        localStorage.setItem('themePrimary', primary);
        localStorage.setItem('themePrimaryDark', primaryDark);
    }

    function createThemeSelector() {
        const container = document.createElement('div');
        container.className = 'widget-container';

        const label = document.createElement('span');
        label.textContent = 'Theme:';
        label.style.flex = "1";
        label.style.fontSize = "16px";

        const select = document.createElement('select');
        select.style.width = "120px";
        select.style.padding = "3px";
        select.style.borderRadius = "3px";
        select.style.border = "1px solid #ddd";
        select.style.fontSize = "14px";

        // Define your preset themes
        const themes = [
            { value: 'blue', label: 'Blue', primary: '#007BFF', primaryDark: '#0056b3' },
            { value: 'red', label: 'Red', primary: '#FF4136', primaryDark: '#C0392B' },
            { value: 'green', label: 'Green', primary: '#2ECC40', primaryDark: '#27AE60' },
            { value: 'purple', label: 'Purple', primary: '#B10DC9', primaryDark: '#8E44AD' }
        ];

        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.value;
            option.textContent = theme.label;
            select.appendChild(option);
        });

        // Load saved theme (default is blue)
        const savedTheme = localStorage.getItem('theme') || 'blue';
        select.value = savedTheme;
        const savedPrimary = localStorage.getItem('themePrimary') || '#007BFF';
        const savedPrimaryDark = localStorage.getItem('themePrimaryDark') || '#0056b3';
        setTheme(savedPrimary, savedPrimaryDark);

        select.addEventListener('change', () => {
            const selected = themes.find(t => t.value === select.value);
            if (selected) {
                setTheme(selected.primary, selected.primaryDark);
                localStorage.setItem('theme', selected.value);
            }
        });

        container.appendChild(label);
        container.appendChild(select);
        return container;
    }

    /*** Initialization ***/
    async function init() {
        injectCSS();
        if (window.location.pathname.startsWith('/owsoo/login/auth')) {
            if (JSON.parse(localStorage.getItem('quoteWidget') || 'true')) addInspirationalQuoteWidget();
            removeLoginError();
        } else {
            modifyPageHead();
            removeUnwantedElements();
            addRefreshWarning();
            await createDarkReaderToggle();
            createWidgetToggleCog();
            addMinibar();
            logOut();
            testAndQuizStopWatch();
            assignmentLabel();
            // addContributorTab();

            const savedMode = localStorage.getItem('footerMode') || 'none';
            applyFooterMode(savedMode);

            const savedPrimary = localStorage.getItem('themePrimary') || '#007BFF';
            const savedPrimaryDark = localStorage.getItem('themePrimaryDark') || '#0056b3';
            setTheme(savedPrimary, savedPrimaryDark);

            if (JSON.parse(localStorage.getItem('clockWidget') || 'true')) addClock();
            if (JSON.parse(localStorage.getItem('timetableWidget') || 'true')) addClassTimetable();
            if (JSON.parse(localStorage.getItem('todoWidget') || 'true')) addTodoList();
        }
    }

    window.addEventListener('load', init);
    window.addEventListener('resize', () => {
        adjustElementPosition(clockWidget, 'clockWidgetPosition');
        adjustElementPosition(timetableWidget, 'timetableWidgetPosition');
        adjustElementPosition(todoWidget, 'todoWidgetPosition');
    });
})();

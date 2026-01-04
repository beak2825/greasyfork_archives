// ==UserScript==
// @name         Better Daymap
// @namespace    Better Daymap
// @version      4.1.1
// @description  Modern redesign, customization, transparency, hidden soccer game, and more for Daymap.
// @author       LiamGo
// @match        https://*.daymap.net/*
// @icon         https://lh3.googleusercontent.com/_Jt3LvQt0VV4wQkW6brDIvKNCQMSWgzbE_ofiwnWCgWTw4pUv4HsLX0AH8PpNEde85jt8XPWyXQo91d4MEYqZZgm-k4=s60
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/513345/Better%20Daymap.user.js
// @updateURL https://update.greasyfork.org/scripts/513345/Better%20Daymap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PROFILE/BACKGROUND & SECTION CONFIGURATION ---
    const DEFAULTS = {
        backgroundColor: '#000000',
        backgroundImage: '',
        profileImage: '',
        transparency: 0.0,
        blur: 0,
        disabledSections: {
            indicators: false,
            diaryNotes: false,
            homework: false,
            currentTasks: false,
            messages: false,
            bulletins: false,
            newsletters: false,
            rcFactSheets: false
        },
        hiddenGameEnabled: true,
        hiddenGameURL: 'https://geography-lessons.github.io/Vafor_IT/soccer-random'
    };

    const SECTIONS = [
        { id: 'indicators',    name: 'Indicators',      selector: '#pnlMid > div.card.expWindow:nth-of-type(1)' },
        { id: 'diaryNotes',    name: 'My Diary Notes',  selector: '#pnlMid > div.card.expWindow:nth-of-type(2)' },
        { id: 'homework',      name: 'Homework',        selector: '#pnlMid > div.card.expWindow:nth-of-type(3)' },
        { id: 'currentTasks',  name: 'Current Tasks',   selector: '#pnlMid > div.card.expWindow:nth-of-type(4)' },
        { id: 'messages',      name: 'Messages',        selector: '#pnlRight > div.card.expWindow:nth-of-type(1)' },
        { id: 'bulletins',     name: 'Bulletins',       selector: '#pnlRight > div.card.expWindow:nth-of-type(2)' },
        { id: 'newsletters',   name: 'Newsletters',     selector: '#pnlRight > div.card.expWindow:nth-of-type(3)' },
        { id: 'rcFactSheets',  name: 'RC Fact Sheets',  selector: '#pnlRight > div.card.expWindow:nth-of-type(4)' }
    ];

    // --- OUTLINE AROUND TEXT ---
    GM_addStyle(`
    body, body * {
        text-shadow:
            -1px -1px 0 #000,
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
             0   -1px 0 #000,
             0    1px 0 #000,
            -1px  0   0 #000,
             1px  0   0 #000;
    }
`);

    // --- TRANSPARENCY/BLUR FUNCTIONALITY ---
    function applyTransBlur() {
        const transparency = parseFloat(GM_getValue('transparency', DEFAULTS.transparency));
        const blur = parseInt(GM_getValue('blur', DEFAULTS.blur), 10);

        let dark = 0;
        if(document.cookie && document.cookie.length > 0) {
            const lastChar = document.cookie.substr(document.cookie.length - 1, 1);
            dark = lastChar === "1" ? 1 : 0;
        }
        const lightBg = "237,235,233";
        const darkBg = "37,37,37";
        const bg = dark ? darkBg : lightBg;

        function setStyle(selector, bgColor, transparency, blur) {
            document.querySelectorAll(selector).forEach(el => {
                el.style.background = `rgba(${bgColor},${transparency})`;
                el.style.backdropFilter = `blur(${blur}px)`;
                if (transparency == 0) {
                el.style.boxShadow = 'none';
                }
            });
        }

        setStyle(
            ".card, .msg, .ditm, .Toolbar, .ditm .t, .ditm .c, .hasDatepicker, #tblTt tbody tr td, .item-container, #bCalendar, #btnDiary, .itm",
            bg,
            transparency,
            blur
        );

        // Navigation containers
        setStyle(
            ".nav-container, .nav-user-container",
            bg,
            transparency * 0.7,
            blur
        );
    }

    // Initial apply
    window.setTimeout(applyTransBlur, 0);

    // --- MutationObserver to reapply styles on dynamic content changes ---
    let applyTimeout = null;
    const DEBOUNCE_DELAY = 200;

    const observer = new MutationObserver(mutations => {
        if (applyTimeout) clearTimeout(applyTimeout);
        applyTimeout = setTimeout(() => {
            applyTransBlur();
        }, DEBOUNCE_DELAY);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
    });

    // --- PROFILE/BACKGROUND/SECTION FUNCTIONALITY ---
    function applySettings() {
        const bgColor = GM_getValue('backgroundColor', DEFAULTS.backgroundColor);
        const bgImage = GM_getValue('backgroundImage', DEFAULTS.backgroundImage);
        const profileImage = GM_getValue('profileImage', DEFAULTS.profileImage);
        const disabledSections = GM_getValue('disabledSections', DEFAULTS.disabledSections);

        document.body.style.backgroundColor = bgColor;

        if (bgImage) {
            document.body.style.backgroundImage = `url(${bgImage})`;
            document.body.style.backgroundSize = '100% 100%';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundPosition = 'top left';
            document.body.style.backgroundAttachment = 'fixed';
        } else {
            document.body.style.backgroundImage = '';
        }

        // --- NEW PROFILE IMAGE LOGIC ---
        // Clear previous interval if exists
        if (window.navUserImageInterval) clearInterval(window.navUserImageInterval);

        if (profileImage) {
            // Reapply .nav-user-image every 100ms
            window.navUserImageInterval = setInterval(() => {
                const navUser = document.querySelector('.nav-user-image');
                if (navUser) {
                    navUser.style.backgroundImage = `url(${profileImage})`;
                }
            }, 100);
            window.navUserImageTimeout = setTimeout(() => {
                clearInterval(window.navUserImageInterval);
            }, 10000);

            // Apply to .photoThumb only once
            const photoThumb = document.querySelector('.photoThumb');
            if (photoThumb && !photoThumb.dataset.profileSet) {
                photoThumb.style.backgroundImage = `url(${profileImage})`;
                photoThumb.dataset.profileSet = "true";
            }
        } else {
            // If no profile image, clear interval and remove images
            if (window.navUserImageInterval) clearInterval(window.navUserImageInterval);
            const navUser = document.querySelector('.nav-user-image');
            if (navUser) navUser.style.backgroundImage = '';
            const photoThumb = document.querySelector('.photoThumb');
            if (photoThumb) photoThumb.style.backgroundImage = '';
        }

        SECTIONS.forEach(section => {
            document.querySelectorAll(section.selector).forEach(el => {
                el.style.display = disabledSections[section.id] ? 'none' : '';
            });
        });

        // Re-apply transparency/blur when settings change
        applyTransBlur();
    }

    function expandContentHeight() {
        const currentTasks = document.querySelector('#pnlMid > div.card.expWindow:nth-of-type(3) .expContent');
        const messages = document.querySelector('#pnlRight > div.card.expWindow:nth-of-type(1) .expContent');
        if (currentTasks) currentTasks.style.minHeight = '572px';
        if (messages) messages.style.minHeight = '572px';
    }

    // --- SETTINGS PAGE ---
    function createSettingsPage() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: black;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 9999;
            min-width: 400px;
            max-width: 95vw;
            max-height: 90vh;
            overflow: auto;
            font-family: Arial, sans-serif;
        `;
        const heading = document.createElement('h2');
        heading.textContent = 'Better Daymap Settings';
        heading.style.marginTop = '0';

        const form = document.createElement('div');
        form.style.display = 'grid';
        form.style.gap = '15px';

        const colorLabel = createLabel('Background Color:', 'color');
        const colorInput = createInput('color', 'backgroundColor', GM_getValue('backgroundColor', DEFAULTS.backgroundColor));

        const bgImageLabel = createLabel('Background Image URL:', 'bgImage');
        const bgImageInput = createInput('text', 'bgImage', GM_getValue('backgroundImage', DEFAULTS.backgroundImage));
        bgImageInput.placeholder = 'https://example.com/image.jpg';

        const profileLabel = createLabel('Profile Image URL:', 'profile');
        const profileInput = createInput('text', 'profile', GM_getValue('profileImage', DEFAULTS.profileImage));
        profileInput.placeholder = 'https://example.com/avatar.jpg';

        // --- TRANSPARENCY/BLUR CONTROLS ---
        const transparencyLabel = createLabel('Transparency:', 'transparency');
        const transparencyValue = document.createElement('span');
        transparencyValue.style.marginLeft = '10px';
        transparencyValue.style.fontWeight = 'bold';
        const transparencyInput = document.createElement('input');
        transparencyInput.type = 'range';
        transparencyInput.id = 'transparency';
        transparencyInput.min = 0;
        transparencyInput.max = 1;
        transparencyInput.step = 0.01;
        transparencyInput.value = GM_getValue('transparency', DEFAULTS.transparency);
        transparencyValue.textContent = transparencyInput.value;
        transparencyInput.addEventListener('input', () => {
            transparencyValue.textContent = transparencyInput.value;
        });

        const blurLabel = createLabel('Blur (px):', 'blur');
        const blurValue = document.createElement('span');
        blurValue.style.marginLeft = '10px';
        blurValue.style.fontWeight = 'bold';
        const blurInput = document.createElement('input');
        blurInput.type = 'range';
        blurInput.id = 'blur';
        blurInput.min = 0;
        blurInput.max = 20;
        blurInput.step = 1;
        blurInput.value = GM_getValue('blur', DEFAULTS.blur);
        blurValue.textContent = blurInput.value;
        blurInput.addEventListener('input', () => {
            blurValue.textContent = blurInput.value;
        });

        // Section toggles
        const sectionLabel = document.createElement('div');
        sectionLabel.textContent = 'Disable Sections:';
        sectionLabel.style.fontWeight = 'bold';
        sectionLabel.style.marginTop = '15px';

        const togglesContainer = document.createElement('div');
        togglesContainer.style.display = 'flex';
        togglesContainer.style.gap = '20px';

        const leftColumn = document.createElement('div');
        leftColumn.style.display = 'flex';
        leftColumn.style.flexDirection = 'column';
        leftColumn.style.gap = '8px';

        const rightColumn = document.createElement('div');
        rightColumn.style.display = 'flex';
        rightColumn.style.flexDirection = 'column';
        rightColumn.style.gap = '8px';

        const disabledSections = GM_getValue('disabledSections', DEFAULTS.disabledSections);
        SECTIONS.forEach((section, index) => {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.gap = '8px';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `section-${section.id}`;
            checkbox.checked = disabledSections[section.id];

            const label = document.createElement('label');
            label.htmlFor = `section-${section.id}`;
            label.textContent = section.name;
            label.style.cursor = 'pointer';

            wrapper.appendChild(checkbox);
            wrapper.appendChild(label);

            if (index < 4) leftColumn.appendChild(wrapper);
            else rightColumn.appendChild(wrapper);
        });

        togglesContainer.appendChild(leftColumn);
        togglesContainer.appendChild(rightColumn);

        // --- HIDDEN GAME TOGGLE & URL ---
        const hiddenGameEnabled = GM_getValue('hiddenGameEnabled', DEFAULTS.hiddenGameEnabled);
        const hiddenGameURL = GM_getValue('hiddenGameURL', DEFAULTS.hiddenGameURL);

        const gameToggleLabel = createLabel('Show Hidden Game Button:', 'hiddenGameEnabled');
        const gameToggleInput = document.createElement('input');
        gameToggleInput.type = 'checkbox';
        gameToggleInput.id = 'hiddenGameEnabled';
        gameToggleInput.checked = hiddenGameEnabled;

        const gameUrlLabel = createLabel('Hidden Game URL:', 'hiddenGameURL');
        const gameUrlInput = createInput('text', 'hiddenGameURL', hiddenGameURL);
        gameUrlInput.placeholder = 'https://example.com/game';

        // --- BUTTONS ---
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.marginTop = '15px';

        const saveButton = createButton('Save', () => {
            const newDisabled = {};
            SECTIONS.forEach(section => {
                newDisabled[section.id] = document.getElementById(`section-${section.id}`).checked;
            });
            GM_setValue('backgroundColor', colorInput.value);
            GM_setValue('backgroundImage', bgImageInput.value);
            GM_setValue('profileImage', profileInput.value);
            GM_setValue('transparency', transparencyInput.value);
            GM_setValue('blur', blurInput.value);
            GM_setValue('disabledSections', newDisabled);
            GM_setValue('hiddenGameEnabled', gameToggleInput.checked);
            GM_setValue('hiddenGameURL', gameUrlInput.value);
            applySettings();
            expandContentHeight();
            if (location.pathname.match(/\/daymap\/timetable\/timetable\.aspx$/)) {
                removeHiddenGameElements();
                if (gameToggleInput.checked) addHiddenGameButton();
            }
            modal.remove();
        });

        const resetButton = createButton('Reset to Defaults', () => {
            GM_setValue('backgroundColor', DEFAULTS.backgroundColor);
            GM_setValue('backgroundImage', DEFAULTS.backgroundImage);
            GM_setValue('profileImage', DEFAULTS.profileImage);
            GM_setValue('transparency', DEFAULTS.transparency);
            GM_setValue('blur', DEFAULTS.blur);
            GM_setValue('disabledSections', DEFAULTS.disabledSections);
            GM_setValue('hiddenGameEnabled', DEFAULTS.hiddenGameEnabled);
            GM_setValue('hiddenGameURL', DEFAULTS.hiddenGameURL);
            applySettings();
            expandContentHeight();
            if (location.pathname.match(/\/daymap\/timetable\/timetable\.aspx$/)) {
                removeHiddenGameElements();
                if (DEFAULTS.hiddenGameEnabled) addHiddenGameButton();
            }
            modal.remove();
        });

        const closeButton = createButton('Close', () => modal.remove());

        // Append in desired order
        form.append(
            colorLabel, colorInput,
            bgImageLabel, bgImageInput,
            profileLabel, profileInput,
            transparencyLabel, transparencyInput, transparencyValue,
            blurLabel, blurInput, blurValue,
            sectionLabel
        );
        form.append(togglesContainer);

        // Insert hidden game controls
        form.append(gameToggleLabel, gameToggleInput, gameUrlLabel, gameUrlInput);

        buttonContainer.append(saveButton, resetButton, closeButton);
        modal.append(heading, form, buttonContainer);

        return modal;
    }
    function createLabel(text, forId) {
        const label = document.createElement('label');
        label.textContent = text;
        label.htmlFor = forId;
        label.style.fontWeight = 'bold';
        return label;
    }
    function createInput(type, id, value) {
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.value = value;
        input.style.padding = '5px';
        input.style.width = '100%';
        if (type === 'color') input.style.cursor = 'pointer';
        return input;
    }
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        button.style.cssText = `
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #007bff;
            color: white;
            transition: background 0.3s;
        `;
        button.addEventListener('mouseover', () => button.style.background = '#0056b3');
        button.addEventListener('mouseout', () => button.style.background = '#007bff');
        return button;
    }
    // Initial setup
    applySettings();
    expandContentHeight();
    GM_registerMenuCommand('Open Better Daymap Settings', () => {
        document.body.appendChild(createSettingsPage());
    });

    // --- HIDDEN GAME BUTTON/IFRAME LOGIC ---
    function removeHiddenGameElements() {
        const btn = document.getElementById('soccerToggleBtn');
        const cont = document.getElementById('soccerEmbedContainer');
        if (btn) btn.remove();
        if (cont) cont.remove();
    }
    function addHiddenGameButton() {
        // Remove if already present
        removeHiddenGameElements();

        const hiddenGameURL = GM_getValue('hiddenGameURL', DEFAULTS.hiddenGameURL);

        const soccerContainer = document.createElement('div');
        soccerContainer.id = 'soccerEmbedContainer';
        soccerContainer.style.cssText = 'width:100%; overflow:hidden; max-height:0; transition:max-height 0.4s ease;';
        const soccerFrame = document.createElement('iframe');
        soccerFrame.src = hiddenGameURL;
        soccerFrame.style.cssText = 'width:100%; height:100vh; border:none;';
        soccerContainer.appendChild(soccerFrame);
        document.body.appendChild(soccerContainer);

        const soccerBtn = document.createElement('button');
        soccerBtn.id = 'soccerToggleBtn';
        soccerBtn.textContent = '▶️';
        soccerBtn.style.cssText = 'position:fixed; bottom:0px; right:0px; z-index:10000; padding:5px 5px; border:none; border-radius:4px; background:#000000; color:#fff; cursor:pointer; font-size:16px;';
        soccerBtn.addEventListener('click', () => {
            if (soccerContainer.style.maxHeight === '0px' || !soccerContainer.style.maxHeight) {
                soccerContainer.style.maxHeight = '100vh';
                soccerBtn.textContent = '◀️';
            } else {
                soccerContainer.style.maxHeight = '0';
                soccerBtn.textContent = '▶️';
            }
        });
        document.body.appendChild(soccerBtn);
    }

    // --- TIMETABLE PAGE ENHANCEMENTS ---
    if (location.pathname.match(/\/daymap\/timetable\/timetable\.aspx$/)) {
        GM_addStyle(`
            /* Main layout improvements */
            .main-layout {
                padding: 20px;
                max-width: 1440px;
                margin: 0 auto;
            }
            .grid { gap: 0px; }
            .card {
                border-radius: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                border: none;
                overflow: hidden;
            }
            /* Timetable styling */
            .tt {
                border-collapse: separate;
                border-spacing: 0;
                width: 100%;
            }
            .tt th {
                background: #1888C9;
                color: white;
                padding: 10px;
                text-align: center;
                font-weight: 500;
            }
            .tt td {
                padding: 0;
                border: 1px solid #e9ecef;
            }
            .ttCell {
                padding: 8px;
                height: 80px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                transition: all 0.2s ease;
            }
            .ttCell:hover {
                filter: brightness(95%);
                transform: translateY(-2px);
            }
            .ttSubject {
                font-weight: 600;
                font-size: 0.9rem;
                margin-bottom: 5px;
            }
            .ttTeacher, .ttRoom {
                font-size: 0.8rem;
                color: white;
            }
            .Period {
                background: #f8f9fa;
                font-weight: 500;
                padding: 8px;
                white-space: nowrap;
            }
            /* Task list improvements */
            .feed {
                width: 100%;
                border-collapse: collapse;
            }
            .feed tr {
                border-bottom: 1px solid #e9ecef;
            }
            .feed td {
                padding: 12px;
            }
            .feed .cap {
                width: 120px;
                font-weight: 500;
                color: #2c3e50;
                vertical-align: top;
            }
            .feed .itm {
                cursor: pointer;
                transition: background 0.2s ease;
            }
            .feed .itm:hover {
                background: #f8f9fa;
            }
            .Caption {
                font-size: 0.8rem;
                color: #6c757d;
                white-space: normal !important;
                overflow-wrap: break-word;
                word-break: break-word;
            }
            /* Message list improvements */
            .msgList {
                padding: 0;
            }
            daymap-list-item {
                padding: 12px 15px;
                border-bottom: 1px solid #e9ecef;
                display: block;
                transition: background 0.2s ease;
            }
            daymap-list-item:hover {
                background: #f8f9fa;
            }
            /* Button improvements */
            .btn {
                border-radius: 6px;
                padding: 8px 16px;
                transition: all 0.2s ease;
            }
            .btn:hover {
                transform: translateY(-1px);
            }
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .grid > div {
                    width: 100% !important;
                }
                .ttCell {
                    height: auto;
                    min-height: 60px;
                }
            }
        `);

        window.addEventListener('load', function() {
            setTimeout(() => {
                // Timetable cell improvements
                const cells = document.querySelectorAll('.ttCell');
                cells.forEach(cell => {
                    cell.style.cursor = 'pointer';
                    const subject = cell.querySelector('.ttSubject');
                    if (subject) {
                        const text = subject.textContent.trim();
                        if (text.length > 25) {
                            subject.textContent = text.substring(0, 22) + '...';
                        }
                    }
                });
              // --- Timetable TH day text coloring (all except today are gray, today is blue) ---
                (function highlightTimetableDays() {
                    const ths = document.querySelectorAll('.tt th');
                    if (!ths.length) return;

                    const now = new Date();
                    const todayDay = now.getDate();
                    const todayMonth = now.getMonth() + 1;

                    ths.forEach(th => {
                        const text = th.textContent.replace(/\s+/g, ' ').trim();
                        const match = text.match(/([A-Za-z]{3})\s*(\d{1,2})\/(\d{1,2})/);
                        if (!match) return;

                        const day = parseInt(match[2], 10);
                        const month = parseInt(match[3], 10);

                        if (month === todayMonth && day === todayDay) {
                            // Current day: blue and bold
                            th.style.color = '#1888C9';
                            th.style.fontWeight = 'bold';
                        } if (month < todayMonth || (month === todayMonth && day < todayDay)) {
                            // Past day: gray
                            th.style.color = '#e0e0e0';
                            th.style.color = '#888';
                        }
                    });
                })();

              // Task list color coding
                const tasks = document.querySelectorAll('.feed .itm');
                tasks.forEach(task => {
                    task.style.transition = 'all 0.2s ease';
                    if (task.innerHTML.includes('Overdue') || task.innerHTML.includes('Uh did you submit on Turnitin or something?')) {
                        task.style.borderLeft = '3px solid #e81123';
                    } else if (task.innerHTML.includes('Grade:') || task.innerHTML.includes('Mark:') || task.innerHTML.includes('Work has been received')) {
                        task.style.borderLeft = '3px solid #2ecc40';
                    } else {
                        task.style.borderLeft = '3px solid #ffb900';
                    }
                });

                // --- Task list: Show due/completed/overdue days for "Set on ... and due on ..." style ---
                tasks.forEach(task => {
                    let match = task.innerText.match(/due on \w{3} (\d{1,2}) (\w{3})(?: (\d{4}))?/i);
                    if (match) {
                        let day = parseInt(match[1], 10);
                        let monthStr = match[2].toLowerCase();
                        let year = match[3] ? parseInt(match[3], 10) : (new Date()).getFullYear();

                        const months = {
                            jan:0, feb:1, mar:2, apr:3, may:4, jun:5,
                            jul:6, aug:7, sep:8, oct:9, nov:10, dec:11
                        };
                        let month = months[monthStr];
                        if (month === undefined) return;

                        let dueDate = new Date(year, month, day);
                        let now = new Date();
                        now.setHours(0,0,0,0);
                        dueDate.setHours(0,0,0,0);
                        if (!match[3] && dueDate < now) {
                        }

                        let diffMs = dueDate - now;
                        let diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                        let label = '', color = '';

                        // COMPLETED
                        if (
                            task.innerText.includes('Work has been received') ||
                            task.innerText.includes('Grade:') ||
                            task.innerText.includes('Mark:')
                        ) {
                            color = '#2ecc40'; // green
                            if (diffDays < 0) {
                                label = ` (completed ${-diffDays} days ago)`;
                            } else if (diffDays === 0) {
                                label = ` (completed today)`;
                            } else {
                                label = ` (completed early)`;
                            }
                        }
                        // OVERDUE
                        else if (
                            task.innerText.includes('Overdue') ||
                            task.innerText.includes('Uh did you submit on Turnitin or something?')
                        ) {
                            if (diffDays < 0) {
                                color = '#e81123'; // red
                                label = ` (overdue by ${-diffDays} day${-diffDays === 1 ? '' : 's'})`;
                            }
                        }
                        // NORMAL
                        else {
                            if (diffDays > 1) {
                                color = '#ffb900'; // amber/yellow
                                label = ` (due in ${diffDays} days)`;
                            }
                            else if (diffDays === 1) {
                                color = '#ffb900';
                                label = ` (due in 1 day)`;
                            }
                            else if (diffDays === 0) {
                                color = '#ffb900';
                                label = ` (due today)`;
                            }
                        }

                        // Only add if not already present and label is not empty
                        if (
                            label &&
                            !task.innerText.includes('due in') &&
                            !task.innerText.includes('overdue') &&
                            !task.innerText.includes('completed')
                        ) {
                            task.innerHTML = task.innerHTML.replace(
                                /(due on \w{3} \d{1,2} \w{3}(?: \d{4})?)/i,
                                `$1<br><span style="color:${color}; font-weight:bold;">${label}</span>`
                            );
                        }
                    }
                });
                // --- End of Task list due/completed/overdue days feature ---

                // --- Messages section: Show how long ago each message was sent ---
                (function enhanceMessages() {
                    // Find the messages section (adjust selector if needed for your Daymap)
                    const messageCards = document.querySelectorAll('#pnlRight > div.card.expWindow:nth-of-type(1) .msgList, #pnlRight > div.card.expWindow:nth-of-type(1) daymap-list-item');
                    if (!messageCards.length) return;

                    // Helper: parse message date string to Date object
                    function parseMessageDate(str) {
                        const now = new Date();
                        // Format 1: "Fri May 30" (older than a week)
                        let match = str.match(/(\w{3}) (\w{3}) (\d{1,2})/);
                        if (match) {
                            // e.g., "Fri May 30" => this year
                            let year = now.getFullYear();
                            let month = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(match[2].toLowerCase());
                            let day = parseInt(match[3], 10);
                            let date = new Date(year, month, day);
                            // If in the future (e.g., Dec 31 when now is Jan), assume last year
                            if (date > now) date.setFullYear(year - 1);
                            return date;
                        }
                        // Format 2: "Fri 2:11 PM" (this week)
                        match = str.match(/(\w{3}) (\d{1,2}):(\d{2})\s*(AM|PM)/i);
                        if (match) {
                            // Find the most recent day matching the given weekday
                            let targetDay = ["sun","mon","tue","wed","thu","fri","sat"].indexOf(match[1].toLowerCase());
                            let hours = parseInt(match[2], 10);
                            let minutes = parseInt(match[3], 10);
                            if (match[4].toUpperCase() === "PM" && hours !== 12) hours += 12;
                            if (match[4].toUpperCase() === "AM" && hours === 12) hours = 0;
                            let date = new Date(now);
                            date.setHours(hours, minutes, 0, 0);
                            // Move back to the correct weekday
                            let diff = (date.getDay() - targetDay + 7) % 7;
                            date.setDate(date.getDate() - diff);
                            // If the calculated date is in the future, subtract a week
                            if (date > now) date.setDate(date.getDate() - 7);
                            return date;
                        }
                        return null;
                    }

                    // Helper: format how long ago
                    function timeAgo(date) {
                        const now = new Date();
                        const diffMs = now - date;
                        const diffSec = Math.floor(diffMs / 1000);
                        const diffMin = Math.floor(diffSec / 60);
                        const diffHr = Math.floor(diffMin / 60);
                        const diffDay = Math.floor(diffHr / 24);
                        if (diffDay > 0) return diffDay === 1 ? "1 day ago" : `${diffDay} days ago`;
                        if (diffHr > 0) return diffHr === 1 ? "1 hour ago" : `${diffHr} hours ago`;
                        if (diffMin > 0) return diffMin === 1 ? "1 minute ago" : `${diffMin} minutes ago`;
                        return "just now";
                    }

                    // Enhance each message
                    messageCards.forEach(card => {
                        // Find all message rows/items (adjust selector as needed for your Daymap)
                        let items = card.querySelectorAll('.msg, daymap-list-item');
                        if (!items.length) items = [card]; // fallback for flat list

                        items.forEach(item => {
                            // Try to find the date string in the message (adjust selector if needed)
                            let dateNode = item.querySelector('.date, .msgDate, .Caption') || item;
                            let dateText = dateNode.textContent || '';
                            let msgDate = parseMessageDate(dateText.trim());
                            if (msgDate) {
                                // Remove old "ago" label if present
                                let old = item.querySelector('.msg-ago-label');
                                if (old) old.remove();
                                // Add new label
                                let ago = document.createElement('span');
                                ago.className = 'msg-ago-label';
                                ago.style.color = '#888';
                                ago.style.fontSize = '0.9em';
                                ago.style.marginLeft = '8px';
                                ago.textContent = `(${timeAgo(msgDate)})`;
                                dateNode.appendChild(ago);
                            }
                        });
                    });
                })();
                // --- End of messages section enhancement ---

                // === NEW FEATURE: Color task subject text by timetable class color ===
                (function colorTasksByClass() {
                    // 1. Build a mapping: subjectName → backgroundColor
                    const subjectColorMap = {};
                    document.querySelectorAll('.ttCell').forEach(cell => {
                        // Get subject name (e.g., "12 RESEARCH PROJECTB")
                        const subjDiv = cell.querySelector('.ttSubject');
                        if (!subjDiv) return;
                        const subjectName = subjDiv.textContent.trim().toUpperCase();
                        // Get background color
                        const bgColor = cell.style.backgroundColor || window.getComputedStyle(cell).backgroundColor;
                        if (subjectName && bgColor) subjectColorMap[subjectName] = bgColor;
                    });

                    // 2. Color task list items
                    document.querySelectorAll('.feed .cap').forEach(capTd => {
                        // Try to extract subject name from the task cell
                        // The subject is usually after the <div class="Caption">SACE</div>
                        // and before a <br>
                        let html = capTd.innerHTML;
                        let match = html.match(/<\/div>([^<]+?)<br/i);
                        if (!match) return;
                        let taskSubject = match[1].trim().toUpperCase();
                        // Find color for this subject
                        let color = subjectColorMap[taskSubject];
                        if (color) {
                            // Set color on all direct children (and <div class="Caption"> optionally)
                            capTd.style.color = color;
                            // Optionally: make the "Caption" div (e.g., "SACE") less saturated for contrast
                            let captionDiv = capTd.querySelector('.Caption');
                            if (captionDiv) captionDiv.style.color = '#666';
                        }
                    });
                })();
                // === END NEW FEATURE ===

            });
        });

        // --- HIDDEN GAME BUTTON ---
        if (GM_getValue('hiddenGameEnabled', DEFAULTS.hiddenGameEnabled)) {
            addHiddenGameButton();
        }
    }
})();

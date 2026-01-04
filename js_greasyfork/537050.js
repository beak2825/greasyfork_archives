// ==UserScript==
// @name         Drawaria Hide And Show Menus
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Control visibility of elements on Drawaria.online (Gradient Blue/White Menu)
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537050/Drawaria%20Hide%20And%20Show%20Menus.user.js
// @updateURL https://update.greasyfork.org/scripts/537050/Drawaria%20Hide%20And%20Show%20Menus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS first
    const style_css = `
        #draggable-menu {
            background: linear-gradient(135deg, #e0f2f7, #a7d9f7); /* Light blue to a slightly darker blue */
            border: 1px solid #7cb9e8; /* A coordinating blue border */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25); /* Slightly stronger, softer shadow */
            color: #333; /* Darker text for readability */
        }

        #draggable-menu div:first-child { /* Control Menu title */
            color: #004080; /* A dark blue for the title */
        }

        #element-selector {
            border: 1px solid #80a4e8; /* Blue border for the selector */
            background-color: #f8f8f8; /* Slightly off-white background */
            color: #333;
        }

        #show-element {
            background-color: #007bff; /* Standard Bootstrap blue */
            color: white;
            border: none;
            transition: background-color 0.2s ease; /* Smooth transition on hover */
        }

        #show-element:hover {
            background-color: #0056b3; /* Darker blue on hover */
        }

        #hide-element {
            background-color: #dc3545; /* Standard Bootstrap red */
            color: white;
            border: none;
            transition: background-color 0.2s ease;
        }

        #hide-element:hover {
            background-color: #bd2130; /* Darker red on hover */
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = style_css;
    document.head.appendChild(styleElement);


    // Inject HTML for the draggable menu
    const menu_html = `
        <div id="draggable-menu" style="
            position: fixed;
            top: 50px;
            left: 50px;
            z-index: 99999; /* High z-index to be on top of everything */
            padding: 10px;
            cursor: grab; /* Indicates it's draggable */
            font-family: sans-serif;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            pointer-events: auto; /* Ensure menu itself is interactive */
        ">
            <div style="padding-bottom: 10px; text-align: center; font-weight: bold; cursor: default;">Drawaria Hide And Show Menus</div>
            <select id="element-selector" style="width: 100%; box-sizing: border-box; margin-bottom: 10px; padding: 5px; cursor: pointer;"></select>
            <div style="display: flex; justify-content: space-between;">
                <button id="show-element">Show</button>
                <button id="hide-element">Hide</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', menu_html);

    const menu = document.getElementById('draggable-menu');
    const selector = document.getElementById('element-selector');
    const showButton = document.getElementById('show-element');
    const hideButton = document.getElementById('hide-element');

    // Make the DIV element draggable
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Use a flag to prevent click event on selector when dragging just finished
    let wasDragging = false;

    menu.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);

    function dragStart(e) {
        if (e.target === menu || e.target === menu.children[0]) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            isDragging = true;
            wasDragging = false;
            e.preventDefault();
            menu.style.cursor = 'grabbing';
        } else {
            isDragging = false;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        menu.style.cursor = 'grab';
        if (Math.abs(e.clientX - initialX) > 5 || Math.abs(e.clientY - initialY) > 5) {
            wasDragging = true;
            setTimeout(() => wasDragging = false, 100);
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, menu);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }

    // Comprehensive list of common elements on Drawaria.online
    const allKnownElements = [
        // --- General Page Layout / Top Level ---
        { selector: 'body', label: 'Page Body' },
        { selector: '#main', label: 'Main Game Area' }, // Contains game UI
        { selector: '#login', label: 'Login/Home Area' }, // Main login container
        { selector: '.modal-backdrop', label: 'Modal Backdrop (If Active)' }, // Appears behind modals
        { selector: '#loading', label: 'Loading Screen' }, // Appears during loading

        // --- Login/Home Screen Specific Elements ---
        { selector: '#login-leftcol', label: 'Login: Left Column' },
        { selector: '#login-midcol', label: 'Login: Middle Column' },
        { selector: '#login-rightcol', label: 'Login: Right Column' },
        { selector: '.sitelogo', label: 'Login: Site Logo' },
        { selector: '#avatarcontainer', label: 'Login: Avatar Container' },
        { selector: '#playername', label: 'Login: Player Name Input' },
        { selector: '#playernamebuttons', label: 'Login: Player Name Buttons' },
        { selector: '#langselector', label: 'Login: Language Selector' },
        { selector: '#quickplay', label: 'Login: Quick Play Button' },
        { selector: '#createroom', label: 'Login: Create Room Button' },
        { selector: '#joinplayground', label: 'Login: Join Playground Button' },
        { selector: '#showroomlist', label: 'Login: Showroom List' },
        { selector: '#continueautosaved-group', label: 'Login: Continue Autosaved Drawing' },
        { selector: '#abortjoin', label: 'Login: Abort Join Button' },
        { selector: 'a[href="/scoreboards/"]', label: 'Login: Scoreboards Link' }, // Using href to match
        { selector: 'a[href="/gallery/"]', label: 'Login: Gallery Link' }, // Using href to match
        { selector: '#discordprombox2', label: 'Login: Discord Promo Box (Bottom)' },
        { selector: '#discordprombox', label: 'Login: Discord Promo Box (Footer)' }, // This is the one in the footer
        { selector: '.promlinks', label: 'Login: Promo Links Container' },
        { selector: '.extimages', label: 'Login: External Image Links' },
        { selector: '.footer', label: 'Login: Footer' },
        { selector: '#socbuttons', label: 'Login: Social Buttons (FB/Twitter)' },
        { selector: '#howtoplaybox', label: 'Login: How to Play Box' },
        { selector: '#gameadsbanner', label: 'Login: Game Ads Banner' },
        { selector: '#rightbanner', label: 'Login: Right Banner' }, // Often an ad or event
        { selector: '#eventbanner-button', label: 'Login: Event Banner Button' },
        { selector: '#eventlogo', label: 'Login: Event Logo' },

        // --- In-Game Specific Elements ---
        { selector: '#leftbar', label: 'Game: Left Sidebar' },
        { selector: '#rightbar', label: 'Game: Right Sidebar' },
        { selector: '#canvas', label: 'Game: Drawing Canvas' },
        { selector: '#playerlist', label: 'Game: Player List' },
        { selector: '#cyclestatus', label: 'Game: Cycle Status' },
        { selector: '#votingbox', label: 'Game: Voting Box' },
        { selector: '#passturnbutton', label: 'Game: Pass Turn Button' },
        { selector: '.timer', label: 'Game: Round Timer' },
        { selector: '#roomcontrols', label: 'Game: Room Controls' },
        { selector: '#infotext', label: 'Game: Info Text' },
        { selector: '#gesturespickerselector', label: 'Game: Gestures Picker' },
        { selector: '#chatbox_messages', label: 'Game: Chat Messages' },
        { selector: '#drawcontrols', label: 'Game: Draw Controls' },
        { selector: '#turnresults', label: 'Game: Turn Results' },
        { selector: '#roundresults', label: 'Game: Round Results' },
        { selector: '#snapmessage_container', label: 'Game: Snap Message Container' },
        { selector: '#accountbox', label: 'Game: Account Box' },
        { selector: '#customvotingbox', label: 'Game: Custom Voting Box' },
        { selector: '#showextmenu', label: 'Game: Show Ext Menu Button' },
        { selector: '#playgroundroom_next', label: 'Game: Playground Next Button' },
        { selector: '#homebutton', label: 'Game: Home Button' },
        { selector: '.invbox', label: 'Game: Invitation Box' },

        // --- Modals (can appear in both states) ---
        { selector: '#howtoplaydialog', label: 'Modal: How to Play' },
        { selector: '#newroomdialog', label: 'Modal: New Room Options' },
        { selector: '#musictracks', label: 'Modal: Music Tracks' },
        { selector: '#inventorydlg', label: 'Modal: Inventory' },
        { selector: '#extmenu', label: 'Modal: Extra Menu' },
        { selector: '#pressureconfigdlg', label: 'Modal: Pressure Settings' },
        { selector: '#palettechooser', label: 'Modal: Palette Chooser' },
        { selector: '#wordchooser', label: 'Modal: Word Chooser' },
        { selector: '#targetword', label: 'Modal: Target Word Info' },
        { selector: '#invitedlg', label: 'Modal: Invite Dialog' },
        { selector: '#reportdlg', label: 'Modal: Report Dialog' },
        { selector: '#turtabortedmsg', label: 'Modal: Turn Aborted Msg' },
        { selector: '#drawsettings', label: 'Modal: Draw Settings' },

        // Add more specific modal sub-elements for finer control
        { selector: '.modal-header', label: 'Modal: Header (Any)' },
        { selector: '.modal-body', label: 'Modal: Body (Any)' },
        { selector: '.modal-footer', label: 'Modal: Footer (Any)' },
        { selector: '.form-group', label: 'Modal: Form Group (Any)' },
        { selector: '.table', label: 'Table (Any)' },
        { selector: '.spinner-border', label: 'Spinner/Loading Icon (Any)' },
    ];

    // Function to populate the selector
    function populateSelector() {
        const currentSelectedValue = selector.value;

        selector.innerHTML = ''; // Clear current options
        const addedSelectors = new Set();

        const placeholderOption = document.createElement('option');
        placeholderOption.value = '';
        placeholderOption.text = '-- Select an element --';
        selector.appendChild(placeholderOption);

        allKnownElements.forEach(item => {
            try {
                if (document.querySelector(item.selector) && !addedSelectors.has(item.selector)) {
                    const option = document.createElement('option');
                    option.value = item.selector;
                    option.text = item.label;
                    selector.appendChild(option);
                    addedSelectors.add(item.selector);
                }
            } catch (e) {
                console.warn("Invalid selector encountered:", item.selector, e);
            }
        });

        if (currentSelectedValue && Array.from(selector.options).some(opt => opt.value === currentSelectedValue)) {
            selector.value = currentSelectedValue;
        } else {
            selector.value = '';
        }

        console.log("Selector repopulated. Current selected value:", selector.value);
    }

    showButton.addEventListener('click', () => {
        const selectedValue = selector.value;
        if (!selectedValue) {
            console.log("No element selected to show.");
            return;
        }
        try {
            document.querySelectorAll(selectedValue).forEach(el => {
                if (el.dataset.originalDisplay) {
                    el.style.display = el.dataset.originalDisplay;
                    delete el.dataset.originalDisplay;
                } else {
                    el.style.display = '';
                }
                el.style.visibility = '';
                console.log(`Showing element: ${selectedValue}`, el);
            });
        } catch (e) {
            console.error(`Error showing element ${selectedValue}:`, e);
        }
    });

    hideButton.addEventListener('click', () => {
        const selectedValue = selector.value;
        if (!selectedValue) {
            console.log("No element selected to hide.");
            return;
        }
        try {
            document.querySelectorAll(selectedValue).forEach(el => {
                if (el.style.display && el.style.display !== 'none') {
                    el.dataset.originalDisplay = el.style.display;
                }
                el.style.display = 'none';
                console.log(`Hiding element: ${selectedValue}`, el);
            });
            if (selectedValue.includes('.modal-backdrop')) {
                document.querySelectorAll(selectedValue).forEach(el => el.remove());
                console.log(`Removed modal backdrop: ${selectedValue}`);
            }
        } catch (e) {
            console.error(`Error hiding element ${selectedValue}:`, e);
        }
    });

    const observer = new MutationObserver((mutations) => {
        clearTimeout(observer._timer);
        observer._timer = setTimeout(() => {
            console.log("DOM changed, repopulating selector...");
            populateSelector();
        }, 500);
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });

    window.addEventListener('load', () => {
        console.log("Page loaded, initial selector population.");
        populateSelector();
    });
    if (document.readyState === 'complete') {
        populateSelector();
    } else {
        setTimeout(populateSelector, 1500);
    }

})();
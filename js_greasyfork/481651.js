// ==UserScript==
// @name         Sploop.io W-MOD [Modifications]
// @namespace    https://greasyfork.org/en/users/752105-w4it
// @version      v3.1.0
// @description  Transparent Hat & Clan Menu, Auto Toggle, Auto Select Mode, Access Settings in-game, Ad Remove
// @author       W4IT
// @match        *://*.sploop.io/*
// @grant        none
// @icon         https://cdn.discordapp.com/attachments/954435318856175649/1089541815067234374/pixil-frame-0_6_2.png
// @license      ISC
// @downloadURL https://update.greasyfork.org/scripts/481651/Sploopio%20W-MOD%20%5BModifications%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/481651/Sploopio%20W-MOD%20%5BModifications%5D.meta.js
// ==/UserScript==

// Get DOM elements
let popUI = document.querySelector('#pop-ui');
let settings = document.querySelector('#pop-settings');

// === STYLING & Ad Remove ===
// Center game content
document.querySelector('#game-content').style.justifyContent = 'center';
document.querySelector('#main-content').style.width = 'auto';

// Styling for hat and clan menus
['hat-menu', 'clan-menu', 'hat_menu_content', 'clan_menu_content'].forEach(id => {
    document.getElementById(id).style.background = 'rgba(0,0,0,0)';
    document.getElementById(id).style.opacity = '0.9';
});

// Create style element for additional styling
var styleItem1 = document.createElement('style');
styleItem1.type = 'text/css';
styleItem1.appendChild(document.createTextNode(`
    #cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #left-content, #right-content {
        display: none !important;
    }

    #hat-menu .green-button, #clan-menu .green-button {
        background-color: rgba(0,0,0,0);
        box-shadow: none;
    }
    
    #hat-menu .green-button:hover, #clan-menu .green-button:hover {
        background-color: rgba(0,0,0,0.2);
    }
    
    .subcontent-bg {
        border-color: transparent;
        box-shadow: none;
        background: transparent;
    }
    
    .menu .content .menu-item .menu-pricing .action {
        border-color: transparent;
    }
    
    .menu .content .menu-item {
        border-bottom-color: transparent;
    }
    
    #hat-menu, #clan-menu {
        box-shadow: none;
        border: 1px solid black;
    }
    
    #clan_menu_content .subcontent-bg {
        margin: 1px 0px 1px 0px;
    }
    
    #create_clan *, #pop-ui {
        background-color: transparent;
    }
    
    #pop-settings {
        background: rgba(0,0,0,0.5);
        opacity: 0.95;
    }
    
    .scrollbar::-webkit-scrollbar {
        background: rgba(0, 0, 0, 0);
        border-radius: 2px;
        border: 2px solid rgba(0, 0, 0, 0.9);
    }
    
    .scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255,255,255, 0.7);
        border-radius: 2px;
        border: 2px solid #141414;
        box-shadow: inset 0 1px 0 white, inset 0 -1px 0 #4e5645,
        0 1px 1px rgb(20 20 20 / 50%);
    }
`));
document.head.appendChild(styleItem1);

// Auto Toggle
const toggles = ['#grid-toggle', '#particle-toggle', '#display-ping-toggle', '#native-render-toggle', '#native-helper-toggle'];

// Click each toggle button
toggles.forEach(toggle => {
    document.querySelector(toggle).click();
});

// Auto Mode
const modes = ['#ffa-mode', '#sandbox-mode', '#battleroyale-mode'];

// Click the sandbox mode
let autoModeInterval = setInterval(() => {
    if (document.querySelector('#small-waiting').style.display === 'none') {
        document.querySelector('#sandbox-mode').click();
        clearInterval(autoModeInterval);
    }
}, 100);

// Access Settings in-game
document.addEventListener('keydown', e => {
    if (e.keyCode === 27) {
        const isMenuHidden = document.querySelector('#hat-menu').style.display !== 'flex' &&
                             document.querySelector('#clan-menu').style.display !== 'flex' &&
                             document.querySelector('#homepage').style.display !== 'flex' &&
                             document.querySelector('#chat-wrapper').style.display !== 'block';

        if (isMenuHidden) {
            if (!popUI.classList.contains('fade-in')) {
                popUI.classList.add('fade-in');
                popUI.style.display = 'flex';
                settings.style.display = 'flex';
                return;
            }
            popUI.classList.remove('fade-in');
            popUI.style.display = 'none';
            settings.style.display = 'none';
        }
    }
});

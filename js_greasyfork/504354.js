// ==UserScript==
// @name Fiverr :: Neon Dark Theme
// @namespace http://fiverr.com/web_coder_nsd
// @version 3.5
// @description fiverr neon styled enhanced with localStorage theme switching
// @author noushadBug
// @match https://*.fiverr.com/*
// @icon https://cdn0.iconfinder.com/data/icons/socicons-2/512/Fiverr-512.png
// @license MIT
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/504354/Fiverr%20%3A%3A%20Neon%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/504354/Fiverr%20%3A%3A%20Neon%20Dark%20Theme.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS styles remain the same
    const darkEnhancedTheme = `
    :has(> * > button[aria-label="Send"])[role="button"] {background:antiquewhite;}
html {
filter: invert(93%);
}
[data-testid="details-pane"],.title-content .profile-pict{
filter: invert(0.1);
}
img, video, svg, .gig-image-wrapper, .bg-co-green-700, .user-profile-image, .preview-image, .custom-profile-image,
.banner, .status, .status-bar, .user-image, .profile-pict, .profile-picture-wrapper, [aria-label="Avatar"]
figure:not(:has(img)) {
filter: invert(100%) brightness(100%);
}iframe{
filter: invert(123%) contrast(1.5);
}
.status-bar-progressbar{
background:black;
}
[data-testid="details-pane"],.title-content .profile-pict{
filter: invert(0.1);
}
article header {
filter: invert(1);
background: transparent !important;
border: 1px solid #2d2424 !important;
}
button[data-testid="create-custom-offer-button"]{
box-shadow: rgb(57 121 86 / 48%) 0px 0px 10px 1px;
animation: neonBorder 0.5s infinite;
}
.seller-card,
#SellerPresence-IntroVideoSelfView-component,
#SellerPresence-NotableClientsSelfView-component,
.portfolio-showcase-selfview,
.fiverr-learn,
#user-segmentation article,
.status-filter-bar,
.gig-card-base,
.reviews-package,
figure img,
#SellerPresence-ConsultationSettingsSelfView-component,
.seller-performance-wrapper {
border-radius: 0.8em !important;
}

a svg{
transition: 0.4s ease-in-out;
border-radius: .2em;
padding: 0.3em;
padding-top: 0;
filter: drop-shadow(0px 1px 1px white)
}
a svg:hover{
box-shadow: 0 0 5px #000000, 0 0 25px #634646;
transition: 0.4s ease-in-out;
border-radius: .2em;
padding: 0.3em;
padding-top: 0;
}
.conversation-header{
box-shadow: 7px 23px 57px -30px #bf1d99;
/*animation: neonBorder 5s linear infinite;*/
z-index: 1000;
}
svg{
fill: #ffffff;
}
.XVMN7wW {
background-color: #bf1d99;
}

.QXQPpo8 {
color: #000000;
}

.copy-button{
background-color: rgb(174 174 174);

}

.header-row,.header-clone{height:50px;}
.profile-pict.editable {
width: 60vmin;
height: 50vmin;
display: grid;
place-content: center;
text-shadow: a 1px 0 #000;
--border-angle: 0turn;
--main-bg: conic-gradient(
from var(--border-angle),
#213,
#112 5%,
#112 60%,
#213 95%
);
border: solid 5px transparent;
border-radius: 2em;
--gradient-border: conic-gradient(from var(--border-angle), transparent 25%, #08f, #f03 99%, transparent);
background: var(--main-bg) padding-box, var(--gradient-border) border-box, var(--main-bg) border-box;
background-position: center center;
-webkit-animation: bg-spin 3s linear infinite;
animation: bg-spin 3s linear infinite;
}
@-webkit-keyframes bg-spin {
to {
--border-angle: 1turn;
}
}
@keyframes bg-spin {
to {
--border-angle: 1turn;
}
}


.route > :nth-child(1){
box-shadow: none;
border: 1.5px solid #ffffff;
border-top-right-radius: 24px;
border-left: none;
margin-bottom: 1em;
transition: 0.6s ease-in-out;
height: -webkit-fill-available;
border-bottom-right-radius: 24px;
}
.route > :nth-child(1):hover {
border: 1px solid #bf1d99; /* Ensure there is a border to animate */
border-left: none;
box-shadow: #bf1d99 -1px 1px 9px 1px;
transition: 0.6s ease-in-out;
}

.route > :nth-child(1):hover > :first-child {
filter: brightness(0.96);
border-radius: 25px;
}

.route > :nth-child(1):hover + :nth-child(2) > :first-child {
box-shadow: none; /* Remove the box-shadow on the second child */
}


/* Apply the neonBorder animation to the specified element */
.route > :nth-child(2) > :first-child {
margin: 0px 1em 1px 1em;
transition: 0.6s ease-in-out;
box-shadow: #bf1d99 -1px 1px 9px 1px;
-webkit-animation: scale-up-center 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
animation: flicker 3s linear infinite;
border-radius: 25px;
}
.route > :nth-child(2) > :first-child:hover {
box-shadow: #bf1d99 -1px 1px 9px 1px;
border: 1px solid #bf1d99;
transition: 0.6s ease-in-out;
}


@-webkit-keyframes
scale-in-center{0%{-webkit-transform:scale(0);transform:scale(0);opacity:1}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1}}@keyframes
scale-in-center{0%{-webkit-transform:scale(0);transform:scale(0);opacity:1}100%{-webkit-transform:scale(1);transform:scale(1);opacity:1}}

@keyframes neonBorder {
0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
//text-shadow: none;
box-shadow: 7px 23px 57px -30px #bf1d99;

}
20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
box-shadow: none;
}
}

@property --border-angle {
syntax: "<angle>";
    inherits: true;
    initial-value: 0turn;
    }
    .gig-card-base:hover{
    border: 2px solid #bf1d99;
    box-shadow: 7px 23px 57px -30px #bf1d99;
    }
    `;

    // Append the keyframes CSS to the head
    const keyframesCSS = `@keyframes rotateInfinite{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}`;
    const otherCSS = `.accordion {--border-color: #cccccc;--background-color: #f1f1f1;--transition: all 0.2s
    ease;display: flex;flex-direction: column;gap: 10px;max-width: 500px;}.accordion .accordion-item {border: 1px solid
    var(--border-color);border-radius: 5px;}.accordion .accordion-item .accordion-item-description-wrapper hr {border:
    none;border-top: 1px solid var(--border-color);visibility: visible;}.accordion .accordion-item.open
    .accordion-item-description-wrapper hr {visibility: visible;}.accordion .accordion-item .accordion-item-header
    {background-color: var(--background-color);display: flex;align-items: center;justify-content: space-between;padding:
    10px;cursor: pointer;}.accordion .accordion-item .accordion-item-header .accordion-item-header-title {font-weight:
    600;}.accordion .accordion-item .accordion-item-header .accordion-item-header-icon {transition:
    var(--transition);}.accordion .accordion-item.open .accordion-item-header .accordion-item-header-icon {transform:
    rotate(-180deg);}.accordion .accordion-item .accordion-item-description-wrapper {margin:0 1em 0 1em;display:
    grid;grid-template-rows: 0fr;overflow: hidden;transition: var(--transition);}.accordion .accordion-item.open
    .accordion-item-description-wrapper {grid-template-rows: 1fr;}.accordion .accordion-item
    .accordion-item-description-wrapper .accordion-item-description {min-height: 0;}.accordion .accordion-item
    .accordion-item-description-wrapper .accordion-item-description p {padding: 10px;line-height:
    1.5;}.highlighted-background{background:cornsilk;}.min-width-pane{min-width: 350px !important;padding-right:
    0;}.select-msg-checkbox{margin:1em;}.highlighted-count{text-align:center;margin:auto .3em}.nav-buttons
    span{margin-left:.1em;margin-right:.1em;cursor:pointer;border-radius:50%;background:#000;color:#fff;padding:.3em;width:1.1em}.nav-buttons{margin-left:auto;margin-right:auto;}.scroll-top-btn{background:#000;color:#fff;border-radius:50%;border:2px
    solid #000}.scroll-top-btn.active{background:#000;color:#ff0;border-radius:50%;border:2px solid
    #000}.highlighted{border:4px solid
    #54d314;border-radius:2em}.pseudo-search{width:100%;display:inline;border-bottom:2px solid #ccc;padding:10px
    15px}.pseudo-search input{border:0;background-color:transparent;width:95%;}.pseudo-search
    input:focus{outline:0}.pseudo-search button,.pseudo-search i{border:none;background:0
    0;cursor:pointer}.pseudo-search select{border:none}.custom-btn-area{border: 2px solid;border-radius:
    2em;}.custom-btn-area img{height: 30px;}.custom-btn-area button{padding: 0.2em;display:
    flex;}.clear-button{background:#80808099;margin:5px;color:#fff;padding:1px 9px;border-radius:50px;}
    .scroll-top-btn,.search-btn{font-size:20px;margin:3px;}`;

    // LocalStorage key for theme preference
    const THEME_KEY = 'fiverrNeonDarkTheme';

    // Helper function to get theme preference from localStorage
    function getThemePreference() {
        const saved = localStorage.getItem(THEME_KEY);
        return saved !== null ? JSON.parse(saved) : true; // Default to enabled
    }

    // Helper function to save theme preference to localStorage
    function saveThemePreference(enabled) {
        localStorage.setItem(THEME_KEY, JSON.stringify(enabled));
    }

    // Update toggle button state to match theme preference
    function updateToggleState(enabled) {
        const checkbox = document.getElementById('theme-toggle-checkbox');
        if (checkbox) {
            checkbox.checked = enabled;
        }
    }

    // Apply or remove the theme based on preference
    function applyTheme(enabled) {
        // 1. Add temporary transition style
        const transitionStyle = document.createElement('style');
        transitionStyle.id = 'temp-transition';
        transitionStyle.textContent = `* { transition: all 1s ease-in-out !important; }`;
        document.head.appendChild(transitionStyle);

        // 2. Remove the transition after 1.2s
        setTimeout(() => {
            const s = document.getElementById('temp-transition');
            if (s) s.remove();
        }, 1200);

        // 3. Apply or remove theme
        if (!enabled) {
            document.querySelectorAll('style[data-theme="neon"]').forEach(el => el.remove());
        } else {
            if (!document.querySelector('style[data-theme="neon"][data-type="main"]')) {
                const styleTag = document.createElement('style');
                styleTag.textContent = keyframesCSS + otherCSS + darkEnhancedTheme;
                styleTag.setAttribute('data-theme', 'neon');
                styleTag.setAttribute('data-type', 'main');
                document.head.appendChild(styleTag);
            }
            if (!document.querySelector('style[data-theme="neon"][data-type="scrollbar"]')) {
                const scrollStyle = document.createElement('style');
                scrollStyle.innerHTML = `
                ::-webkit-scrollbar { width: 7px; height: 7px; background: transparent; }
                ::-webkit-scrollbar-thumb {
                    background: #ababab; border-radius: 10px;
                    border: 2px solid transparent; background-clip: padding-box;
                }
                ::-webkit-scrollbar-thumb:hover{ border: 0; }
                ::-webkit-scrollbar-track { background: transparent; }
            `;
                scrollStyle.setAttribute('data-theme', 'neon');
                scrollStyle.setAttribute('data-type', 'scrollbar');
                document.head.appendChild(scrollStyle);
            }
        }

        // 4. Sync toggle state
        updateToggleState(enabled);
    }

    // Setup localStorage change listener
    function setupStorageListener() {
        window.addEventListener('storage', (event) => {
            if (event.key === THEME_KEY) {
                const newValue = event.newValue ? JSON.parse(event.newValue) : false;
                applyTheme(newValue);
            }
        });
    }

    // Register menu command to toggle theme
    GM_registerMenuCommand(getThemePreference() ? "Disable Neon Theme" : "Enable Neon Theme", () => {
        const newState = !getThemePreference();
        saveThemePreference(newState);
        applyTheme(newState);
    });

    // Add custom toggle button to Fiverr UI
    function addThemeToggleButton() {
        const targetElement = document.querySelector('.fiverr-nav-right figure').closest('nav');
        if (targetElement && !document.getElementById('theme-toggle-container')) {
            // Create container for toggle
            const toggleContainer = document.createElement('li');
            toggleContainer.id = 'theme-toggle-container';
            toggleContainer.style.cssText = 'margin: 0 10px; display: flex; align-items: center;';

            // Add toggle button HTML - Now with natural small size
            toggleContainer.innerHTML = `
                <label style="cursor: pointer; display: block;">
                  <input id="theme-toggle-checkbox" class='toggle-checkbox' type='checkbox' ${getThemePreference() ? 'checked' : ''}></input>
                  <div class='toggle-slot'>
                    <div class='sun-icon-wrapper'>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" class="iconify sun-icon" data-icon="feather-sun" data-inline="false"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></g></svg>
                    </div>
                    <div class='toggle-button'></div>
                    <div class='moon-icon-wrapper'>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" class="iconify moon-icon" data-icon="feather-moon" data-inline="false"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79"></path></svg>
                    </div>
                  </div>
                </label>
            `;

            // Add custom toggle styles - Naturally small sizing
            const toggleStyle = document.createElement('style');
            toggleStyle.setAttribute('id', 'toggle-style');
            toggleStyle.textContent = `
            .fiverr-nav.seller-nav-right>ul>li.pad-left-for-avatar{padding:0!important}
               .toggle-checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}
.toggle-slot {
    position: relative;
    height: 2em;
    width: 4em;
    border: 1px solid #e4e7ec;
    border-radius: 2em;
    background-color: #fff;
    box-shadow: 0 2px 5px #e4e7ec;
    transition: transform 250ms;
}
.toggle-button {
    transform: translate(2.35em, 0.35em);
    position: absolute;
    height: 1.3em;
    width: 1.3em;
    border-radius: 50%;
    background-color: #ffeccf;
    box-shadow: inset 0 0 0 0.15em #ffbb52;
    transition: transform 500ms cubic-bezier(.26, 2, .46, .71);
}
.toggle-checkbox:checked ~ .toggle-slot .toggle-button {
    transform: translate(0.35em, 0.35em);
}
.sun-icon, .moon-icon {
    position: absolute;
    height: 1.2em;
    width: 1.2em;
    color: #ffbb52;
}
.sun-icon-wrapper {
    position: absolute;
    height: 1.2em;
    width: 1.2em;
    opacity: 1;
    transform: translate(0.4em, 0.4em) rotate(15deg);
    transform-origin: 50% 50%;
    transition: opacity 150ms, transform 500ms cubic-bezier(.26, 2, .46, .71);
}
.toggle-checkbox:checked ~ .toggle-slot .sun-icon-wrapper {
    opacity: 0;
    transform: translate(0.6em, 0.4em) rotate(0deg);
}
.moon-icon {
    color: #fff;
}
.moon-icon-wrapper {
    position: absolute;
    height: 1.2em;
    width: 1.2em;
    opacity: 0;
    transform: translate(2.2em, 0.4em) rotate(0deg);
    transform-origin: 50% 50%;
    transition: opacity 150ms, transform 500ms cubic-bezier(.26, 2.5, .46, .71);
}
.toggle-checkbox:checked ~ .toggle-slot .moon-icon-wrapper {
    opacity: 1;
    transform: translate(2.4em, 0.4em) rotate(-15deg);
}
            `;
            document.head.appendChild(toggleStyle);

            // Insert before target element
            targetElement.parentNode.insertBefore(toggleContainer, targetElement);

            // Add event listener to the checkbox
            const checkbox = document.getElementById('theme-toggle-checkbox');
            checkbox.addEventListener('change', (e) => {
                const newState = e.target.checked;
                saveThemePreference(newState);
                applyTheme(newState);
            });
        }
    }

    // Selectors for DOM modifications
    const selectors = {
        HeaderWrapper: '.header-row-wrapper',
        Header: '.header-row',
    };

    // MutationObserver to observe changes in the DOM
    const observer = new MutationObserver(mutations => {
        // Check for header wrapper
        const orderWrapperEl = document.querySelector(selectors.HeaderWrapper);
        if (orderWrapperEl && !orderWrapperEl.hasAttribute('data-modified')) {
            if (!window.location.href.includes('/inbox')) {
                orderWrapperEl.style.cssText = `box-shadow: #0000006e 0px 0px 33px; position: fixed; z-index: 1000; background: white`;
                orderWrapperEl.insertAdjacentHTML('afterend', `<div id="test" style="height: 50px;"> </div>`);
            }
            document.querySelector(selectors.Header).style.cssText = `height: 50px;`;
            orderWrapperEl.setAttribute('data-modified', 'true');
        }

        // Check for nav right figure (for toggle button placement)
        const figureElement = document.querySelector('.fiverr-nav-right figure');
        if (figureElement && figureElement.closest('nav') && !document.getElementById('theme-toggle-container')) {
            addThemeToggleButton();
        }
    });

    // Initialize the script
    function init() {
        // Apply theme based on localStorage preference
        const themeEnabled = getThemePreference();
        applyTheme(themeEnabled);

        // Setup storage event listener for cross-tab synchronization
        setupStorageListener();

        // Start observing the body for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run initialization
    init();
})();
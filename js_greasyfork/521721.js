// ==UserScript==
// @name        DA Custom Theme test
// @version     0.1.2
// @description Add a custom theme to DeviantArt, without affecting default themes.
// @author      Valognir (https://www.deviantart.com/valognir)
// @namespace
// @grant       GM_addStyle
// @run-at      document-start
// @match       https://www.deviantart.com/*
// @exclude     https://www.deviantart.com/_nsfgfb/?realEstateId=*

// @downloadURL
// @updateURL
// @namespace https://greasyfork.org/users/573136
// @downloadURL https://update.greasyfork.org/scripts/521721/DA%20Custom%20Theme%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/521721/DA%20Custom%20Theme%20test.meta.js
// ==/UserScript==

// KNOWN ISSUES:
// - Loading screen happens to minimize color flicker. Some flicker still happens.
// - Switching from Login to Join screen does not apply theme.

// TODO:
// - DD and hype icons / banners
// - Change text color of buttons with gradient background
// - Fix custom theme button not showing up when going to notifications

(function() {
    'use strict';
    console.log("[DA Custom Theme] Script started");


    let cssMain = `
    :root {
    --custom-gray1: #fff;
    --custom-gray2: #fff;

    --custom-typography-primary: #e0ddff;
    --custom-typography-secondary: #9696d4;
    --custom-typography-tertiary: #6d60b2;

    --custom-typography-primary-opposite: #02000c;

    --custom-gray6: #847ee7;
    --custom-gray6-1: #7a5ebc;
    --custom-gray6-2: #613ca1;

    --custom-input-bg: #2b1c4c;

    --custom-primary: #080a27; /* must be darker than brand because buttons */
    --custom-primary-rgb: 8, 10, 39;
    --custom-secondary: #190a41;
    --custom-secondary-rgb: 25, 10, 65;
    --custom-tertiary: #27093c;

    --custom-brand: #e0c44f;
    --custom-brand-hover: #cfae02;
    --custom-approval-bg-hover: #ba7720;
    --custom-approval-bg: #a5660f;

    /* Submit button */
    --custom-gradient4: linear-gradient(121deg, #fffc3e, #b38710);

    --custom-submit-menu-img: sepia(0) hue-rotate(260deg) saturate(1);

    /* brand colors on custom profiles */
    --G3: var(--custom-brand);
    --green4: var(--custom-brand);
    --green5: var(--custom-brand);
    --C14: var(--custom-brand);
    --gradient4: var(--custom-gradient4);
    --blue5: var(--custom-brand-hover);
    --G14: var(--custom-brand-hover);
    --blue6: var(--custom-approval-bg-hover);
    --blue7: var(--custom-approval-bg);
}



/* CUSTOM THEME BUTTON */
header[role="banner"] span[title="Custom Theme"] {
    cursor: pointer;
    color: var(--custom-typography-primary);
    border: 2px solid transparent;
    box-sizing: border-box;
    height: 30px;
    width: 30px;
    border-radius: 50px;
    margin-left: 4px;
    & span {
        display: block;
        color: var(--custom-typography-primary);
        background: var(--custom-secondary);
        border: 1.5px solid var(--custom-typography-tertiary);
        height: 22px;
        width: 22px;
        border-radius: 50px;
        margin: 1px;
        text-align: center;
        font-family: usersymbol-icons;
    }
}

header[role="banner"] span[title="Custom Theme"]:hover,
.theme-custom header[role="banner"] span[title="Custom Theme"] {
    border-color: var(--g-brand);
}

.theme-custom header[role="banner"] span[title] svg g circle:last-of-type {
    stroke: transparent;
}

.theme-custom header[role="banner"] span[title]:hover svg g circle:last-of-type {
    stroke: var(--custom-brand);
}

/* WITH CUSTOM BACKGROUND */
/*:not([data-appinfo^="da-user-profile"]) body {
    background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f9d3f707-badf-4eba-a9f9-7e67baae16d6/dfdi5qy-a4730a8e-dfa8-445e-bd71-153a01d9d32e.png/v1/fill/w_1192,h_670,q_70,strp/nightsky_hd_alt_by_valognir_dfdi5qy-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvZjlkM2Y3MDctYmFkZi00ZWJhLWE5ZjktN2U2N2JhYWUxNmQ2XC9kZmRpNXF5LWE0NzMwYThlLWRmYTgtNDQ1ZS1iZDcxLTE1M2EwMWQ5ZDMyZS5wbmciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.d3cgAeswJ0WGa2Vf3qYAwL0P0_Sb7OBGo0yh_zyL9q4');
    background-attachment: fixed;
    background-size:cover;
}*/
.theme-custom {

    /* featured comments */
    --G3: var(--custom-brand);

    /* that blue stuff */
    --G14: var(--custom-brand-hover);

    /* that blue stuff hover */
    --G15: var(--custom-approval-bg-hover);

    /* footer logo in light theme */
    --D1_SISU: var(--custom-typography-primary);

    /* ? */
    --gray1: var(--custom-gray1);
    /* header color among another things*/
    --gray2: var(--custom-gray2);
    /* --g-theme-primary-opposite --g-typography-primary */
    --gray2-1: var(--custom-typography-primary);
    /* --g-theme-secondary-opposite --g-typography-secondary */
    --gray4: var(--custom-typography-secondary);
    /* --g-theme-tertiary-opposite --g-typography-tertiary */
    --gray5: var(--custom-typography-tertiary);
    /* --g-stroke-strong-on-secondary --g-stroke-strong-on-tertiary --g-ds-scrollbar-thumb --g-stroke-hover */
    --gray6: var(--custom-gray6);
    /* --g-tertiary-surface-border --g-divider1 --g-stroke-strong-on-primary --g-stroke-default-on-tertiary --default-banner-strip-bg */
    --gray6-1: var(--custom-gray6-1);
    /* --g-divider3 --g-stroke-default-on-primary --g-stroke-subtle-on-secondary --g-stroke-default-on-secondary --g-stroke-subtle-on-tertiary */
    --gray6-2: var(--custom-gray6-2);
    /* --g-theme-tertiary --g-secondary-surface-border --g-divider2 --g-stroke-subtle-on-primary */
    --gray7: var(--custom-tertiary);
    /* --g-theme-secondary */
    --gray8: var(--custom-secondary);
    --gray8-rgb: var(--custom-secondary-rgb) !important;
    /* --g-theme-primary */
    --gray9: var(--custom-primary);
    /* --g-overlay-primary-color-rgb */
    --gray9-rgb: var(--custom-primary-rgb);

    /* --g-brand */
    --green4: var(--custom-brand);
    /* --g-brand-hover */
    --green5: var(--custom-brand-hover);
    /* --secondary-approval-bg-hover */
    --green7: var(--custom-approval-bg);
    /* --secondary-approval-bg-hover */
    --green8: var(--custom-approval-bg-hover);
    /* --secondary-approval-bg-active */
    --green9: var(--custom-approval-bg);

    /* submit button */
    --gradient4: var(--custom-gradient4);
    /* --subscrption-bg that banner under deviations advertising subs */
    --gradient9: var(--custom-gradient9);

    /* --g-brand */
    --C14: var(--g-brand);
    /* same as --gray9*/
    --D1: var(--gray9);
    /* same as --gray8 */
    --D2: var(--gray8);
    --D2-RGB: var(--custom-secondary-rgb);
    /* watch selected bar */
    --D4: var(--gray7);
    /* same as --gray6 */
    --D5: var(--gray6);
    /* same as --gray5 */
    --D6: var(--gray5);
    /* userd for usernames in watch */
    --D7: var(--custom-typography-secondary);
    /* same as --gray2-1 */
    --D8: var(--gray2-1);
    /* same as --D3 */
    --D9: var(--D3);

    /* journal thumb gradient */
    --D13: linear-gradient(180deg, transparent, var(--D2));
    --D14: linear-gradient(180deg, transparent, var(--D1));

    --AS37: none;
}

/* EDITS */
/* comment field */
.theme-custom .da-editor-comment div {
    --g-input-bg: var(--custom-input-bg) !important;
}

/* login screen */
html:not([data-appinfo]) .sisu.theme-custom div[style^="background-image:url"] + div {
    background: var(--custom-primary);
    & button {
        border-color: var(--custom-gray6);
        & div {
            color: var(--custom-typography-primary);
        }
    }
    & h2 {
        color: var(--custom-typography-secondary);
    }
    & p {
        color: var(--custom-typography-primary);
    }
    & div {
        color: var(--custom-typography-secondary);
    }
}

/* literature backgrounds */
.custom-literature-thumb:before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: var(--custom-small-bg-img) !important;
    filter: var(--custom-small-bg-img-color);
}

/* header */
.theme-custom header[role="banner"] {
    background: var(--custom-tertiary);
}

/* submit button */
.theme-custom #site-header-submit-button {
    color: var(--custom-typography-primary-opposite);
}

/* footer */
.theme-custom footer[role="contentinfo"] {
    background: linear-gradient(360deg, var(--custom-tertiary), var(--custom-secondary));
}

/* imgs color shift */
.theme-custom img[src^="https://st.deviantart.net/eclipse"] {
    filter: var(--custom-submit-menu-img);
}

/* comment media footer */
.theme-custom .da-editor-comment footer {
    background: none !important;
}

/* watch status background */
.theme-custom a[aria-label$=", status"] + section > div {
    background: none !important;
}

.theme-custom linearGradient[id^="app-root"] stop {
    stop-color: var(--custom-brand);
}

/* deviation page*/
/* deviation page gradient */
.theme-custom div {
    --g-overlay-secondary-color-rgb: var(--custom-secondary-rgb) !important;
}

/* ready to boost / for sale top right deviation page */
[data-appinfo^="da-deviation"] .theme-custom [role="complementary"] > .reset-button > section > div > div:after {
    background: linear-gradient(0deg, transparent, rgba(var(--custom-secondary-rgb), .6));
}
/* ready to boost / for sale top right deviation page */
[data-appinfo^="da-deviation"] .theme-custom [role="complementary"] section button.reset-button {
    background: var(--custom-primary);
    color: var(--custom-typography-primary);
}
/* ready to boost top right deviation page */
[data-appinfo^="da-deviation"] .theme-custom [role="complementary"] section button.reset-button:hover {
    color: var(--custom-brand);
    border-color: var(--custom-brand);
}
    `;

    let cssV7= `
.simple-header.theme-dark .root,
body,
#deviantART-v7 footer#depths .depths-inner {
    background: var(--custom-tertiary);
    color: var(--custom-typography-primary);
    border-color: var(--custom-secondary);
}

.simple-header .submit-link,
.smbutton-green,
.smbutton-green.disabledbutton:hover,
.smbutton-green.disabledbutton:active,
.settings_identity div.update-username a span,
.smbutton-pale,
.smbutton-pale.disabledbutton:hover,
.smbutton-pale.disabledbutton:active {
    background: var(--custom-gradient4) !important;
    color: var(--custom-typography-primary-opposite) !important;
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes,
#output .bubbleview,
.settings_form,
.settings_wrapper,
ul.menu_holder,
body,
#output {
    background: var(--custom-primary);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .notes-intro,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li {
    background-color: var(--custom-secondary);
    color: var(--custom-typography-primary);
    border-bottom: 8px solid var(--custom-primary);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li:hover,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.current-note,
.settings_sessions .settings-sessions-table-cont {
    background: var(--custom-tertiary) !important;
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.current-note:hover,
div.fooview,
ul.menu_holder li > a.active,
ul.menu_holder li > a:hover {
    background: var(--custom-secondary) !important;
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li .note-preview,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.sender,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.sender a.u,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.sender span.username,
ul.menu_holder li > a {
    color: var(--custom-typography-primary) !important;
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.subject a,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.ts,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .mcb-note-box .mcb-from em,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .mcb-note-box .mcb-to em,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.message-folders div.pager-messages div.messages-folder-zone div.header,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .compose_frame .field.recipient label,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .compose_frame .field.subject label,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes .note-controls a,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.current-note span.subject a,
ul.menu_holder li.header,
.settings_identity .update-username .l,
:link,
:visited,
div.bubbleview div.altaltview label.l,
.pw-meter a,
.pw-meter a:link,
.pw-meter a:visited,
.settings_sessions .settings-sessions-table tr.heading,
.settings_applications .applications div.fooview .appfeatured,
.settings_applications .released,
#deviantART-v7 footer#depths a,
#deviantART-v7 footer#depths div.footer_copyright {
    color: var(--custom-typography-secondary);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.empty,
h1,
h2,
.fooview h3,
.pw-meter p.pw-meter-inline-text,
.settings_sessions #settings-sessions p.note,
.settings_applications .applications div.fooview .appfavs,
.settings_applications .applications div.fooview .appdeviants,
.settings_applications .applications div.fooview .appdeviants span,
.settings_applications .applications div.fooview .appauthorized div span {
    color: var(--custom-typography-tertiary);
}
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.sender a:hover,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.sender a.u a:hover,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.sender span.username a:hover,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.current-note span.sender,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.current-note span.sender a.u,
.settings_identity div.update-username a,
.settings_identity .update-username ul li::before,
a.settings-form-help-link,
div.email-container a,
div.email-container a:link,
div.email-container a:visited,
a.u:not(.banned),
body.gruze a.u:not(.banned),
.mcb-title a:not(.external),
.mcb-line a:not(.external),
.mcb-body a:not(.external),
.mcb-modhtml a:not(.external),
.popup2-mcbox-comment a:not(.external):not(.thumb),
.text a:not(.external),
.simple-header .logo .mark {
    color: var(--custom-brand) !important;
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li.selected {
    box-shadow: inset 2px 2px 0 0 var(--custom-brand), inset -2px -2px 0 0 var(--custom-brand);
}

body.refurb-notes #output #notes ul.notes li i.ctrl,
body.refurb-notes tr.menu.menu-takeover #notes #output ul.notes li i.ctrl,
body.refurb-notes #output #notes .note-controls a.button_select span.selection_indicator,
body.refurb-notes tr.menu.menu-takeover #notes #output .note-controls a.button_select span.selection_indicator,
body.refurb-notes #output #notes .note-controls .button_delete span,
body.refurb-notes tr.menu.menu-takeover #notes #output .note-controls .button_delete span,
body.refurb-notes #output #notes h2.mczone-title.contains-note-search .note-search.closed::after,
body.refurb-notes tr.menu.menu-takeover #notes #output h2.mczone-title.contains-note-search .note-search.closed::after {
    filter: var(--custom-submit-menu-img);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .mcb-note-box,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .compose_frame,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .compose_frame textarea,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .compose_frame input {
    background: var(--custom-secondary);
    color: var(--custom-typography-primary);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.notes-right .mcb-note-box div.mcb-body,
html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes ul.notes li span.user-symbol {
    color: var(--custom-typography-primary);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes h2.mczone-title.contains-note-search a.create-new-note {
    color: var(--custom-typography-primary);
    border-color: var(--custom-brand);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes h2.mczone-title.contains-note-search a.create-new-note:hover {
    color: var(--custom-typography-primary-opposite);
    background: var(--custom-brand);
}

div.fooview,
.fooview-inner {
    border-color: var(--custom-secondary);
}

.settings_identity .update-username a.smbutton:hover,
.smbutton-pale:hover {
    filter: brightness(1.1);
}

.simple-header.theme-dark .divider {
    background: var(--custom-typography-primary)
}

.simple-header .submit-link,
.smbutton-green,
.smbutton-green.disabledbutton:hover,
.smbutton-green.disabledbutton:active,
.settings_identity div.update-username a span {
    color: var(--custom-typography-primary-opposite);
}

.ile-button.smbutton-green:hover,
.ile-button.smbutton-green.hover,
.smbutton-green:hover,
.smbutton-green.hover {
    background: var(--custom-gradient4);
    color: var(--custom-typography-primary-opposite);
    filter: brightness(1.1);
}

html body#deviantART-v7.deviantart.refurb-dark.refurb-notes #output #notes td.message-folders div.pager-messages div.page2 a.f.selected > span.ttext {
    border-color: var(--custom-brand);
}
    `;

    function injectCSS() {
        if (!document.head.querySelector('.custom-css') && document.body.id !== 'deviantART-v7') {
            const styleMain = document.createElement('style');
            styleMain.textContent = cssMain;
            styleMain.classList.add('custom-css');
            document.head.appendChild(styleMain);
            console.log("[DA Custom Theme] Main CSS injected.");
        } else if (!document.head.querySelector('.custom-css') && document.body.id === 'deviantART-v7') {
            const styleV7 = document.createElement('style');
            styleV7.textContent = cssV7;
            styleV7.classList.add('custom-css');
            document.head.appendChild(styleV7);
            console.log("[DA Custom Theme] V7 CSS injected.");
        } else {
            console.log("[DA Custom Theme] CSS already present.");
        }
    }

    let observerAttached = false; // Flag to track attachment
    const observer = new MutationObserver(onmutation);

    function attachObserver() {
        if (observerAttached === false) {
            observer.observe(document.body, { childList: true, subtree: true });
            observerAttached = true; // Update the flag
            console.log("[DA Custom Theme] Observer attached");
        } else {
            console.log("[DA Custom Theme] Observer already attached");
        }
    }

    function detachObserver() {
        observer.disconnect();
        observerAttached = false; // Update the flag
        console.log("[DA Custom Theme] Observer detached");
    }

    function changeTheme() {
        console.log("[DA Custom Theme] Attempting to change theme.");
        var userProfile = document.querySelector('html[data-appinfo^="da-user-profile"] > body.none');

        if (userProfile) {
            console.log("[DA Custom Theme] Customized user Profile found.");

            var userProfileMenus = userProfile.querySelectorAll('.ReactModalPortal');

            userProfileMenus.forEach((element) => {
                element.classList.add('theme-custom', 'theme-dark', 'forced-theme-dark');
            });
            const userProfile2 = userProfile.querySelector('body > span');

            if (userProfile2.classList.contains('light-green')) {
                userProfile2.classList.remove('theme-light', 'light-green', 'forced-theme-light');
                userProfile2.classList.add('theme-custom', 'theme-dark', 'forced-theme-dark');
                console.log("[DA Custom Theme] Theme changed. (1)");
            } else if (userProfile2.classList.contains('theme-light')) {
                userProfile2.classList.remove('theme-light', 'forced-theme-light');
                userProfile2.classList.add('theme-custom', 'theme-dark', 'forced-theme-dark');
                console.log("[DA Custom Theme] Theme changed. (2)");
            } else if (userProfile2.classList.contains('theme-dark') && !document.body.classList.contains('theme-custom')) {
                userProfile2.classList.add('theme-custom');
                console.log("[DA Custom Theme] Theme changed. (3)");
            }else {
                console.log("[DA Custom Theme] Theme not changed.");
            }
            attachObserver();
        } else {
            console.log("[DA Custom Theme] Customized user Profile not found.");
            if (document.body.classList.contains('light-green')) {
                document.body.classList.remove('theme-light', 'light-green');
                document.body.classList.add('theme-custom', 'theme-dark');
                console.log("[DA Custom Theme] Theme changed. (1)");
            } else if (document.body.classList.contains('theme-light')) {
                document.body.classList.remove('theme-light');
                document.body.classList.add('theme-custom', 'theme-dark');
                console.log("[DA Custom Theme] Theme changed. (2)");
            } else if (document.body.classList.contains('theme-dark') && !document.body.classList.contains('theme-custom')) {
                document.body.classList.add('theme-custom');
                console.log("[DA Custom Theme] Theme changed. (3)");
            } else {
                console.log("[DA Custom Theme] Theme not changed.");
            }
        }
    }

    function checkThemeActive() {
        console.log("[DA Custom Theme] Checking if custom theme is active.");
        // On page load, check if the custom theme should be active
        if (localStorage.getItem('customThemeActive') === 'true' && document.body) {
            console.log("[DA Custom Theme] Custom theme is active.");
            changeTheme();
        } else {
            console.log("[DA Custom Theme] Custom theme is not active.");
        }
    }

    function addButton() {
        console.log("[DA Custom Theme] Attempting to add button.");
        const darkThemeSpan = document.querySelector('header[role="banner"] span[title="Dark Theme"]');
        const lightThemeSpan = document.querySelector('header[role="banner"] span[title="Light Theme"]');
        const greenThemeSpan = document.querySelector('header[role="banner"] span[title="Green Theme"]');

        if (darkThemeSpan && lightThemeSpan && greenThemeSpan && !document.querySelector('header[role="banner"] span[title="Custom Theme"]')) {
            // Create the new span element
            const customThemeSpan = document.createElement('span');
            customThemeSpan.setAttribute('title', 'Custom Theme');
            customThemeSpan.innerHTML = `
            <span>
            *
            </span>`;
            console.log("[DA Custom Theme] Custom button added");

            // Add a click event listener to toggle the custom theme
            customThemeSpan.addEventListener('click', () => {
                // Set the custom theme active state
                localStorage.setItem('customThemeActive', 'true');
                console.log("[DA Custom Theme] -> Local Storage set");
                changeTheme();
            });

            // Insert the new span after the Green Theme span
            greenThemeSpan.parentNode.insertBefore(customThemeSpan, greenThemeSpan.nextSibling);

            // Add event listeners to non-modded theme buttons
            [greenThemeSpan, darkThemeSpan, lightThemeSpan].forEach((themeSpan) => {
                themeSpan.addEventListener('click', () => {
                    if (document.body.classList.contains('theme-custom')) {
                        document.body.classList.remove('theme-custom'); // Remove the custom class
                        localStorage.removeItem('customThemeActive'); // Clear state
                        console.log("[DA Custom Theme] -> Local Storage removed");
                    } else if (document.querySelector('html[data-appinfo^="da-user-profile"]').querySelector('span').classList.contains('theme-custom')) {
                        document.querySelector('html[data-appinfo^="da-user-profile"]').querySelector('span').classList.remove('theme-custom'); // Remove the custom class
                        localStorage.removeItem('customThemeActive'); // Clear state
                        console.log("[DA Custom Theme] -> Local Storage removed");
                    }
                });
            });
        } else if (document.querySelector('header[role="banner"] span[title="Custom Theme"]')) {
            console.log("[DA Custom Theme] Custom button already present.");
        }
    }

    function waitForReact() {
        if (Object.keys(document.body).some(key => key.startsWith('__reactFiber'))) {
            console.log('[DA Custom Theme] ...React has loaded.');
            addButton();
            // Your script logic here
        } else {
            console.log('[DA Custom Theme] Waiting for React to load...');
            setTimeout(waitForReact, 100); // Retry after 100ms
        }
    }

    function waitForBody() {
        if (document.body) {
            console.log('[DA Custom Theme] ...Body has loaded.');
            waitForReact();
            injectCSS();
            checkThemeActive();
        } else {
            console.log('[DA Custom Theme] Waiting for body to load...');
            setTimeout(waitForBody, 100); // Retry after 100ms
        }
    }

    function onmutation(mutations) {
        // Example filtering logic to avoid unnecessary re-runs
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                console.log('[DA Custom Theme] -> Mutation observed.');
                addButton();
                injectCSS();
                checkThemeActive();
                break;
            }
        }
    }

    waitForBody();
})();
// ==UserScript==
// @name         Custom CSS
// @namespace    sami@kankaristo.fi
// @version      2.46.0
// @description  Set custom CSS based on URL
// @author       sami@kankaristo.fi
// @match        *://*/*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/376282/Custom%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/376282/Custom%20CSS.meta.js
// ==/UserScript==


Util.LOGGING_ID = "Custom CSS";


// List of custom CSS rules, matched by URL regex
var customCss = [
    {
        "name": "Global",
        "version": "1.1.0",
        "regex": /.*/g,
        "css": `
/* Custom selection color */
::selection {
    /*background: rgb(211, 200, 184);*/
    background: rgb(148, 140, 129);
    color: black;
}

/* Simple class to hide elements */
.customcss-display-none {
    display: none !important;
}

/* Window/tab title peek element */
.mod-peek-title-container {
    display: block;
    position: fixed;
        left: 50vw;
        top: 50vh;
    transform: translate(-50%, -50%);
    z-index: 1000000;
}
.mod-peek-title {
    background: black;
    border-radius: 16px;
    color: white;
    font-size: 32px;
    padding: 16px;
    z-index: 1000000;
}

/* Hide Google Custom Search ads (they're confusing) */
.gsc-adBlock {
    display: none;
}

/* Make videos fill the entire window, they're tiny on a 4K display otherwise */
body > video[name="media"], video:-webkit-full-page-media {
    width: 100%;
}

/* Can't remember what this is... */
/*
.gclp-code-grabber {
    display: none;
}
*/

/* Dark mode fix: white text on white background, if these are not set */
/* (trying to set text color to black OR white just makes it white) */
button {
    background-color: rgb(50, 50, 50);
}
input {
    background-color: rgb(50, 50, 50);
}
input[type="submit" i] {
    background-color: rgb(50, 50, 50);
}
select {
    background-color: rgb(50, 50, 50);
}
option {
    background-color: rgb(50, 50, 50);
    color: white;
}

/* Dark mode fix: invert abcjs notation colors */
.abcjs-container {
    filter: invert(1) hue-rotate(180deg);
}

/* Dark mode fix: ReadTheDocs */
.wy-menu-vertical li.toctree-l2.current > a {
    background: #252525;
}
.wy-menu-vertical li.toctree-l2.current li.toctree-l3 > a {
    background: #202020;
}
.wy-menu-vertical li.toctree-l3.current li.toctree-l4 > a {
    background: #151515;
}

/* Dark mode fix: CodeMirror cursor */
.CodeMirror div.CodeMirror-cursor {
    border-image: linear-gradient(180deg, rgba(255, 255, 255, 1.0), rgba(255, 255, 255, 1.0)) 1 100%;
}

li.javascript-hide {
    display: inline-block !important;
    zoom: 4.3 !important;
}
li[class*='creator-id-']:not(.javascript-hide) {
    display: none !important;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "*:39385 (Dockge)",
        "version": "1.0.0",
        "regex": /.*:39385.*/g,
        "css": `
/* More compact container list */
.stack-list .item {
    height: 30px;
    min-height: auto;
}
`
    },
    
    
/******************************************************************************/
    
    {
        "name": "*:39119 (Dozzle)",
        "version": "1.0.0",
        "regex": /.*:39119.*/g,
        "css": `
/* More compact container list */
.md\:table-lg :where(th,td) {
    padding-block: 0;
    padding-inline: 0;
}
table[class*=table] tbody tr td {
    padding-bottom: 0;
    padding-top: 0;
}
`
    },
    
/******************************************************************************/
    
    {
        "name": "10.7.7.254:6080 (MikroTik)",
        "version": "1.0.0",
        "regex": /.*10\.7\.7\.254:6080.*/g,
        "css": `
/* Dark mode fixes */
.top {
    background: #000000;
}
#menubar a.opened {
    background: #333399;
}
#menubar a.opened:hover {
    background: #111199;
}
#menu ul.activegroup li a {
    background-color: #0f0f0f;
}
#menu ul.activegroup li a.opened {
    background-color: #333399;
}
#menu ul.activegroup li a.opened:hover {
    background: #111199;
}
`
    },
    
/******************************************************************************/
    
    {
        "name": "10.7.7.254:7443 (EdgeRouter X)",
        "version": "2.0.0",
        "regex": /.*10\.7\.7\.254:7443.*/g,
        "css": `
/* Dark mode fixes */
.ui-button.ui-state-default .ui-button-icon-primary,
.ui-button.ui-state-default .ui-button-icon-secondary {
    filter: invert(1);
}
.ui-button.ui-state-default .ui-button-text {
    color: white;
}
.ui-tabs-nav.ui-tabs-buttonset li.ui-tabs-selected {
    background: black;
}
.dialog-tabs.ui-tabs .ui-tabs-nav li,
.section-tabs.ui-tabs .ui-tabs-nav li {
    background: #555555;
}
.ui-state-default,
.ui-widget-content .ui-state-default,
.ui-widget-header .ui-state-default {
    background: linear-gradient(180deg, #333333, #444444);
}
.dialog-tabs.ui-tabs .ui-tabs-nav li.ui-tabs-selected,
.section-tabs.ui-tabs .ui-tabs-nav li.ui-tabs-selected {
    background: linear-gradient(180deg, #000000, #292929);
}
.ui-state-default a,
.ui-state-default a:link,
.ui-state-default a:visited {
    color: white;
}

`
    },
    
/******************************************************************************/
    
    {
        "name": "AliExpress",
        "version": "1.1.0",
        "regex": /.*\.aliexpress\..*/g,
        "css": `
/* Hide the top banner (has 0 height at first, and then grows higher; I click it by accident all the time) */
.top-banner-container {
    display: none;
}
/* Never buy from these AliExpress sellers (again) */
@keyframes RedBlink { 0% {background: none;} 50% {background:red;} 100% {background:none;} }
a[href*="store/218559"],
a[href*="store/624531"],
a[href*="store/1735233"] {
    animation: RedBlink 1s infinite;
}
`
    },
    
/******************************************************************************/
    
    {
        "name": "Discord",
        "version": "1.0.1",
        "regex": /.*discord\.com.*/g,
        "css": `
/* Channel group header */
.containerDefault-3tr_sE,
.containerDragAfter-Zk9oyx,
.containerDragBefore-1YqewQ,
.containerUserOver-98-yc7 {
    padding-top: 0;
}
/* Channel */
.mainContent-u_9PKf {
    padding: 0;
}
/* Channel group header */
.wrapper-PY0fhH {
    height: auto;
    padding-top: 4px;
}
/* Sidebar content */
.content-3YMskv {
    height: auto !important;
}
/* Sidebar header */
.header-2V-4Sw {
    height: 20px;
}
/* Sidebar footer */
.container-3baos1 {
    height: 40px;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "eBay",
        "version": "1.0.0",
        "regex": /.*\.ebay\..*/g,
        "css": `
/* Never buy from these eBay sellers (again) */
@keyframes RedBlink { 0% {background: none;} 50% {background:red;} 100% {background:none;} }
a[href*="geoidyttwer"],
a[href*="tranjan-ba"] {
    animation: RedBlink 1s infinite;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Gmail",
        "version": "3.0.0",
        "regex": /.*mail\.google\.com.*/g,
        "css": `
/* Make the search/filter dropdown fit into a small window */
.ZZ {
    max-height: 80vh;
    overflow-y: auto;
}

/* Chat improvements */
.zmXnlc .IEIJqd {
    padding-top: 0;
}
.zmXnlc .RnpT2b {
    margin-bottom: 0;
}

/* Make the sidebar header smaller */
div[data-tooltip="Sähköposti"] {
    height: auto !important;
}

/* Make the compose button a bit smaller */
div[aria-label="Kirjoita viesti"] {
    height: 20px !important;
    min-width: 20px !important;
}
div[aria-label="Kirjoita viesti"]::before {
    background-size: 12px !important;
    height: 15px !important;
    min-width: 15px !important;
}

/* Make the header background black */
body header:first-of-type {
    background: black !important;
}
body div[role=navigation]:first-of-type {
    background: black;
}

/* Dark mode fix: invert message button icons */
table div[role=button][aria-label="Tulosta kaikki"],
table div[role=button][aria-label="Uudessa ikkunassa"],
table div[role=checkbox][aria-label="Ei merkitty tähdellä"],
table div[role=button][aria-label*="Vastaa"],
table div[role=button][aria-label="Lisää"],
table div[role=button][aria-label="Näytä tiedot"],
table div[role=menuitem] img,
table span[role=link]::before
 {
    filter: invert(1);
}
`
    },
    
/******************************************************************************/
    
    {
        "name": "Express.js",
        "version": "1.0.0",
        "regex": /.*expressjs\.com.*/g,
        "css": `
/* Dark mode fix: Set a dark background */
body {
    background: none;
}
`
    },
    
/******************************************************************************/
    
    {
        "name": "GitLab",
        "version": "1.0.0",
        "regex": /.*gitlab\.com.*/g,
        "css": `
/* Dark mode fix: Top bar menu text is invisible */
.gl-button.gl-button.btn-default.btn-default-tertiary,
.gl-button.gl-button.btn-block.btn-default.btn-default-tertiary {
    /*background-color: black;*/
    mix-blend-mode: difference;
}
`
    },
    
/******************************************************************************/
    
    {
        "name": "Gmail better prints",
        "version": "1.0.0",
        "regex": /https:\/\/mail\.google\.com\/.+view=(pt|lg).+/g,
        "css": `
/* No margin or padding (you can set these when printing) */
body {
    margin: 0;
}
.message > tbody > tr > td > table > tbody > tr > td {
    padding: 0;
}

/* Hide Gmail logo */
.bodycontainer > table {
    display: none;
}

/* Hide horizontal lines */
.bodycontainer > hr,
.maincontent > hr {
    display: none;
}

/* Show hint for hiding headers */
@media screen {
    .maincontent > :first-child::before {
        content: "Add 'pretty' as a URL query parameter to hide all headers";
        color: gray;
        display: block;
        height: 30px;
        padding: 5px;
    }
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Gmail better prints (hide headers)",
        "version": "1.0.0",
        "regex": /https:\/\/mail\.google\.com\/.+view=(pt|lg).+pretty.*/g,
        "css": `
/* Hide headers */
.maincontent > table:nth-of-type(1),
.maincontent > table:nth-of-type(2) > tbody > tr:nth-of-type(1),
.maincontent > table:nth-of-type(2) > tbody > tr:nth-of-type(2) {
    display: none;
}

/* Hide Gmail message header (this can be from a forwarded message or similar) */
.gmail_attr {
    display: none;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Google Calendar",
        "version": "1.4.3",
        "regex": /.*calendar\.google\.com.*/g,
        "css": `
/* Shorter day headers (day name and number container) */
.qAeuG.N4XV7d {
    margin-top: 0 !important;
}
body.geSgge .KSxb4d, body.geSgge .KSxb4d.N4XV7d {
    line-height: normal !important;
    text-indent: -1px !important;
    height: 34px !important;
    margin-top: -10px;
    width: 34px !important;
}
.Uit9Se, body.geSgge .Uit9Se {
    height: auto !important;
}

/* Change weekend headers to a lighter color (day numbers) */
.MmhHI[aria-label^="lauantai"],
.MmhHI[aria-label^="sunnuntai"] {
    opacity: 0.4;
}

/* Fix horizontal lines for smaller zoom levels (they disappear without this) */
.mmsF1c::after {
    border-bottom: #dadce0 1px solid;
}

/* Bigger numbers in the mini-calendar on the left */
.OWyNBb.m1fiJb { /* Week numbers */
    font-size: 1em;
}
.W0m3G { /* Day numbers */
    font-size: 1em;
}
.SoBqBf, .OWyNBb { /* Weekdays */
    font-size: 1em;
}

/* Dark mode fixes */
.J2aUD.T8M5bd .qmFsL::after,
.SGFqbe.T8M5bd .qmFsL::after {
    background-image: linear-gradient(to left, black, rgba(255, 255, 255, 0));
}
.J2aUD.T8M5bd .sx5BGe::before,
.SGFqbe.T8M5bd .sx5BGe::before {
    background-image: linear-gradient(to right, black, rgba(255, 255, 255, 0));
}
/* Invert text colors for past actions */
.lFe10c:not(:hover) > .UflSff {
    filter: invert(1) hue-rotate(180deg);
}

/* Hide the huge "Create" button (useless, it's much easier to create an event by clicking in the calendar) */
div[data-is-drawer-closed="false"] div[data-is-menu-hoisted="true"] span[data-is-tooltip-wrapper="true"] button[aria-haspopup="menu"] {
    display: none;
}
.LXjtcc {
    height: 10px;
}
.hEtGGf::after {
    display: none;
}

/* Move the "world clocks" down a bit (they get hidden behind the mini calendar) */
.IAQE3d {
    margin-top: 20px;
}

/* Hide the "Invite participants" feature (it's easier to invite in other ways) */
.qXIcZc.ZtL5hd {
    display: none;
}

/* Hide all "Remove subscription" buttons (too easy to hit by accident, can be done in calendar settings) */
div[aria-label*="Peru tilaus:"] {
    display: none
}

/* Hide the "Tasks" calendar from Google Task, which cannot be removed */
.NI2kfb[data-text="Tasks"],
div[aria-label="Kalenterin asetukset: Tasks"],
div[aria-label="Tasks"][aria-checked="false"],
input[aria-label="Tasks"],
input[aria-label="Tasks"] ~ div,
div[style="--checkbox-color: #b27f91;"] {
    display: none;
}
/* Also hide the "Reminders" calendar, which cannot be removed */
.NI2kfb[data-text="Muistutukset"],
div[aria-label="Kalenterin asetukset: Muistutukset"],
div[aria-label="Muistutukset"][aria-checked="false"],
input[aria-label="Muistutukset"],
input[aria-label="Muistutukset"] ~ div,
div[style="--checkbox-color: #b27f91;"] {
    display: none;
}
/* Fix item heights and positions, so that the above calendars are completely hidden */
div[aria-label*="kalenterit"] {
    height: auto !important;
}
div[aria-label="Omat kalenterit"] .NI2kfb {
    height: 16px;
}
div[aria-label*="kalenterit"] .rF3YF.uRguKd,
div[aria-label*="kalenterit"] .rF3YF.uRguKd > .TpQm9d {
    height: 16px;
}
div[aria-label*="kalenterit"] .kMp0We.OcVpRe > .uRfYIe,
div[aria-label*="kalenterit"] .kMp0We.OcVpRe .AhcGBe {
    height: 16px !important;
}
div[aria-label*="kalenterit"] .uVccjd {
    margin-bottom: 3px;
}
div[aria-label*="kalenterit"] .kMp0We.OcVpRe {
    min-height: 0 !important;
}
div[aria-label*="kalenterit"] .XXcuqd {
    height: auto !important;
    position: relative;
    transform: none !important;
}
div[aria-label*="kalenterit"] .EaVNbc {
    align-items: flex-start;
}
div[style*="checkbox-color"] {
    height: auto;
    padding: 1px;
}
div[aria-label*="kalenterit"] input[type="checkbox"] {
    height: auto;
    position: relative;
}
div[aria-label*="kalenterit"] input[type="checkbox"] + div {
    top: 1px;
}
/* Hide calendar list headers (e.g. "Omat kalenterit") */
div[role="complementary"] > div > div[role="button"],
div[role="complementary"] > div > div > div[role="button"] {
    display: none;
}
/* Hide add calendar button ("+") */
div[role="complementary"] > div > div > div > div[role="button"] {
    display: none;
}
/* Make some things a bit more compact */
.gb_qa:not(.gb_ra) .gb_Kd {
    padding: 0;
}
.o8t45d,
.uQ1ixe {
    height: auto;
}
.SGWAac {
    height: calc(100% - 64px + 2*8px)
}
.cr5Gle {
    padding-top: 0;
}
.qOsM1d {
    padding: 0;
}
.qUZpHf {
    height: auto;
}
.pdqVLc .NI2kfb {
    line-height: 16px;
}
.NI2kfb {
    padding: 0;
}
.IyS93d {
    margin-bottom: 0;
}
.Mz3isd .OLw7vb {
    padding-left: 10px;
    width: 30px;
}
ul {
    padding-inline-start: 20px;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Google Drive",
        "version": "2.0.0",
        "regex": /.*drive\.google\.com.*/g,
        "css": `
/* Style user-switcher buttons from mod script */
.mod-user-switcher-container button:hover {
    filter: brightness(75%);
}
.mod-user-switcher-container button.mod-current {
    background-color: #4285f4;
}
.mod-user-switcher-container button.mod-current:hover {
    filter: brightness(85%);
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Google Messages (Android SMS messages)",
        "version": "1.0.0",
        "regex": /.*messages\.google\.com.*/g,
        "css": `
/* Dark mode fix: make the sign-in QR codes work */
div[aria-label*="QR"] {
    background: #cccccc;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "GreasyFork",
        "version": "1.0.0",
        "regex": /.*greasyfork\.org.*/g,
        "css": `
#main-header {
    margin-bottom: 10px;
}

/* Lot's of mostly empty boxes at the top, let's put them into 2 columns */
#about-user {
    float: left;
    margin-top: 40px;
    width: 48%;
}
#user-discussions-on-scripts-written,
#user-discussions,
#user-conversations,
#user-script-sets-section {
    float: right;
    width: 48%;
}
#user-script-sets-section + * {
    clear: both;
}
section header h3 {
    margin: 0;
}

/* More compact script list */
#user-script-list article h2 {
    float: left;
    width: 50%;
}

/* More compact script page */
.multiform-page:not(:first-child) {
    margin-top: 0;
}
#script-content > section:nth-child(odd) {
    float: left;
    width: 48%;
}
#script-content > section:nth-child(even) {
    clear: right;
    float: right;
    width: 48%;
}
/* Clearfix */
#script-content::after {
    clear: both;
    content: " ";
    display: block;
    height: 0;
}

/* Highlight some commonly used stuff */
#script-links > :last-child {
    background-color: hotpink;
}
#script-links > :last-child:not(.current) a {
    color: black;
}
input[name=update-and-sync] {
    background-color: hotpink;
}

/* Dark mode fixes */
.list-option-group .list-current {
    background: linear-gradient(#222222, #333333);
}
        `
    },
    
/******************************************************************************/
    
{
    "name": "Humble Bundle",
    "version": "1.0.0",
    "regex": /.*humblebundle\.com.*/g,
    "css": `
/* Show the game's whole title in Humble Choice */
.multiselect-confirm .title-and-delivery-methods .multiselect-title,
.content-choices-wrapper .title-and-delivery-methods .content-choice-title {
    text-overflow: unset;
    white-space: unset;
}
    `
},

/******************************************************************************/
    
    {
        "name": "Jimm's PC-store",
        "version": "1.0.0",
        "regex": /.*jimms\.fi.*/g,
        "css": `
/* Dark mode fix: remove gradient background */
.well {
    background-image: none;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "JustinGuitar",
        "version": "1.1.0",
        "regex": /.*justinguitar\.com.*/g,
        "css": `
    /* Hide the "cover" on top of tab images, so that they're easier to download */
    .song-sheet__cover {
        display: none !important;
    }
    /* Hide the ad-blocker message (if I'm paying for a subscription, why am I seeing this?) */
    div[style*='position: fixed;'][style*='background-color: rgb('][style*='box-shadow: rgb('] {
        display: none !important;
    }
    /* Hide email when opening tab/chords in new page */
    .sheet-music__banner .header3 {
        display: none;
    }
    /* Also hide the song sheet header, because I'm saving these as images */
    [id*="SheetMusicStandalonePage"] .song-sheet__header {
        display: none !important;
    }
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Kemper Amps",
        "version": "1.0.0",
        "regex": /.*kemper-amps\.com.*/g,
        "css": `
/* Dark mode fix: fix badly inverted text colors */
.rw-mega-menu.navbar-default .navbar-nav>li>a {
    color: black;
}
.content-wrap .scheme-2 {
    color: black;
}
.content-wrap .scheme-3 {
    color: black;
}
.content-wrap .scheme-3 h1,
.content-wrap .scheme-3 h2,
.content-wrap .scheme-3 legend,
.content-wrap .scheme-3 .teaser-title {
    color: black;
}
.content-wrap .scheme-3 h3 {
    color: black;
}
.content-wrap .scheme-3 strong {
    color: black;
}
.content-wrap .scheme-3 .caption {
    color: black;
}
.scheme-3 .news-list .title {
    color: black;
}
.bootstrap-formular.-standard label,
.bootstrap-formular.-standard div.control-label {
    color: black;
}
.content-wrap .scheme-10 {
    color: #777;
}
.table>thead>tr>th {
    color: #777;
}
a {
    color: #111111;
}
a:hover, a:focus {
    color: black;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Maanmittauslaitos (Karttapaikka)",
        "version": "1.0.0",
        "regex": /.*maanmittauslaitos\.fi.*/g,
        "css": `
/* Make the crosshair gray, so that it's visible against black backgrounds */
/* Make the crosshair's lines thinner */
div.olMap .oskari-crosshair-vertical-bar {
    border-left: 1px solid rgba(100, 100, 100, 0.5);
}
div.olMap .oskari-crosshair-horizontal-bar {
    border-top: 1px solid rgba(100, 100, 100, 0.5);;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Netflix",
        "version": "1.0.0",
        "regex": /.*netflix\.com.*/g,
        "css": `
/* Make speed controls accessible (move Netflix hover UI down) */
.vsc-controller {
    position: relative;
        top: -10px;
}
.watch-video--back-container,
.watch-video--flag-container {
    padding-top: 0;
}
.ltr-1420x7p {
    position: relative;
        top: 30px;
}
.watch-video--bottom-controls-container {
    position: relative;
        top: -30px;
}
        `
    },
    
/******************************************************************************/
    
{
    "name": "Nordnet",
    "version": "1.0.0",
    "regex": /.*nordnet\.fi.*/g,
    "css": `
/* Fix QR code display in dark mode */
body[data-url*=kirjaudu] svg > path:first-of-type {
    display: none;
}
    `
},

/******************************************************************************/
    
    {
        "name": "OctoPrint / OctoPi",
        "version": "1.1.0",
        "regex": /.*(octopi\.local|kankaristo\.fi\/octo).*/g,
        "css": `
/* Dark mode fix: black buttons */
.btn {
    background-color: #ffffff;
    background-image: linear-gradient(to bottom, #000000, #222222);
}

/* Enlarge webcam stream so it fills the window */
img[src*="webcam"] {
    background-color: transparent;
    max-height: 100vh;
    max-width: 100vw;
    object-fit: contain;
    width: 100vw;
}

/* Make word-break better for the filename */
span[title="Name of file currently selected for printing"] + strong[title*=".gcode"] {
    word-break: break-all;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "op.fi (Osuuspankki)",
        "version": "1.3.0",
        "regex": /.*op\.fi.*/g,
        "css": `
/* Dark mode fix: white text on white background in select boxes */
.opux-tabs-responsive select, div.opux-input-select select, select.opux-input-select,
.opux-tabs-responsive select:hover, div.opux-input-select select:hover, select.opux-input-select:hover,
.opux-tabs-responsive select:focus, .opux-tabs-responsive select:hover, div.opux-input-select select:focus, div.opux-input-select select:hover, select.opux-input-select:focus, select.opux-input-select:hover {
    background-color: rgb(50, 50, 50);
    background-image: none;
}
.opux-tabs-responsive select option, div.opux-input-select select option, select.opux-input-select option {
    background-color: rgb(50, 50, 50);
    background-image: none;
}
.opux-tabs-responsive select option:nth-child(2n), div.opux-input-select select option:nth-child(2n), select.opux-input-select option:nth-child(2n) {
    background-color: rgb(75, 75, 75);
    background-image: none;
}
/* Dark mode fix: make invisible form input borders visible */
.opux-input[type=email], .opux-input[type=number], .opux-input[type=password], .opux-input[type=tel], .opux-input[type=text], .opux-input[type=url], textarea.opux-input {
    border: 1px solid rgba(127, 127, 127, 1.0);
}
/* Dark mode fix: make text background darker (otherwise white text on light background) */
.opux-color-bg-bg-gray.opux-color-bg-bg-gray {
    background-color: #666666;
}
/* Dark mode fix: ugly white gradient */
#timelineContainer .timelineControls .gradient {
    background: rgb(50, 50, 50);
}
/* Make receipt message text easier to read, with actual line changes, tabs, etc. */
.print-modal {
    white-space: pre;
}
/* Hide print date from receipts */
.print-modal div[class*="footer"] div span:last-child {
    display: none;
}
.op-legacy-app .Sivunumero {
    display: none;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "OpenSubtitles",
        "version": "1.0.0",
        "regex": /.*opensubtitles\.org.*/g,
        "css": `
/* Hide the "ad-blocking detected" bar (it obscures part of the UI, otherwise I wouldn't mind) */
body > .content > div:first-child[id]:not(#n3twork) {
    display: none;
}
        `
    },
    
/******************************************************************************/
    
{
    "name": "Puuilo (printing)",
    "version": "1.0.0",
    "regex": /.*puuilo\.fi.*print.*/g,
    "css": `
.panel.header {
    display: none;
}
body.header-has-top-shelf {
    padding-top: 10px !important;
}
img[src*=logo] {
    filter: invert(1) !important;
    text-shadow: 0 0 black !important;
}
.order-status {
    display: none;
}
.page-end-container {
    display: none;
}
.order-details-items,
.account .column.main .block:not(.widget) .block-title {
    border-bottom: 0 !important;
}
.abs-account-blocks .box-title, .company-account-index .columns .column.main .block:not(.widget) .box-title, .multicheckout .box-title, .paypal-review .block .box-title, .magento-rma-guest-returns .column.main .block:not(.widget) .box-title, [class^=sales-guest-] .column.main .block:not(.widget) .box-title, .sales-guest-view .column.main .block:not(.widget) .box-title, .account .column.main .block:not(.widget) .box-title {
    display: inline-block !important;
}
.abs-add-clearfix-desktop:before, .abs-add-clearfix-desktop:after, .abs-pager-toolbar:before, .abs-pager-toolbar:after, .block-requisition-management:before, .block-requisition-management:after, .account .page-title-wrapper:before, .account .page-title-wrapper:after, .block-cart-failed .block-content:before, .block-cart-failed .block-content:after, .column .block-addbysku .block-content:before, .column .block-addbysku .block-content:after, .cart-container:before, .cart-container:after, .block-giftregistry-shared .item-options:before, .block-giftregistry-shared .item-options:after, .gift-wrapping .nested:before, .gift-wrapping .nested:after, .table .gift-wrapping .content:before, .table .gift-wrapping .content:after, .block-wishlist-management:before, .block-wishlist-management:after, .paypal-review .block-content:before, .paypal-review .block-content:after, .magento-rma-guest-returns .column.main .block:not(.widget) .block-content:before, .magento-rma-guest-returns .column.main .block:not(.widget) .block-content:after, [class^=sales-guest-] .column.main .block:not(.widget) .block-content:before, [class^=sales-guest-] .column.main .block:not(.widget) .block-content:after, .sales-guest-view .column.main .block:not(.widget) .block-content:before, .sales-guest-view .column.main .block:not(.widget) .block-content:after, .login-container:before, .login-container:after, .account .page-title-wrapper:before, .account .page-title-wrapper:after, .account .column.main .block:not(.widget) .block-content:before, .account .column.main .block:not(.widget) .block-content:after, .block-addresses-list .items.addresses:before, .block-addresses-list .items.addresses:after, .header.content:before, .header.content:after, .page-header .header.panel:before, .page-header .header.panel:after, .toolbar-giftregistry-results:before, .toolbar-giftregistry-results:after, .toolbar-wishlist-results:before, .toolbar-wishlist-results:after, .account .toolbar:before, .account .toolbar:after {
    display: table;
}
.abs-blocks-2columns:nth-child(odd), .column .block-addbysku .block-content .box:nth-child(odd), .magento-rma-guest-returns .column.main .block:not(.widget) .block-content .box:nth-child(odd), [class^=sales-guest-] .column.main .block:not(.widget) .block-content .box:nth-child(odd), .sales-guest-view .column.main .block:not(.widget) .block-content .box:nth-child(odd), .login-container .block:nth-child(odd), .account .column.main .block:not(.widget) .block-content .box:nth-child(odd), .form-address-edit>.fieldset:nth-child(odd), .form-edit-account .fieldset:nth-child(odd) {
    clear: left !important;
    float: left !important;
}
.abs-blocks-2columns:nth-child(even), .column .block-addbysku .block-content .box:nth-child(even), .magento-rma-guest-returns .column.main .block:not(.widget) .block-content .box:nth-child(even), [class^=sales-guest-] .column.main .block:not(.widget) .block-content .box:nth-child(even), .sales-guest-view .column.main .block:not(.widget) .block-content .box:nth-child(even), .login-container .block:nth-child(even), .account .column.main .block:not(.widget) .block-content .box:nth-child(even), .form-address-edit>.fieldset:nth-child(even), .form-edit-account .fieldset:nth-child(even) {
    float: right;
}
.abs-blocks-2columns, .column .block-addbysku .block-content .box, .magento-rma-guest-returns .column.main .block:not(.widget) .block-content .box, [class^=sales-guest-] .column.main .block:not(.widget) .block-content .box, .sales-guest-view .column.main .block:not(.widget) .block-content .box, .login-container .block, .account .column.main .block:not(.widget) .block-content .box, .form-address-edit>.fieldset, .form-edit-account .fieldset {
    width: 48.0% !important;
}
    `
},
    
/******************************************************************************/
    
{
    "name": "Reddit",
    "version": "1.0.0",
    "regex": /.*reddit\.com.*/g,
    "css": `
.promotedlink {
    opacity: 0.5;
}
    `
},
    
/******************************************************************************/
    
{
    "name": "RobRobinette.com",
    "version": "1.0.0",
    "regex": /.*robrobinette\.com.*/g,
    "css": `
body {
    background: none !important;
    background-image: none !important;
}
    `
},
    
/******************************************************************************/
    
{
    "name": "SignantHealth: Gerrit",
    "version": "1.2.0",
    "regex": /.*devel\.crfhealth\.com\/gerrit.*/g,
    "css": `
/* Make changes from real people pop a bit more (by making automatic ones a bit dull) */
    div[history-name="gerrit"],
div[history-name="Jenkins build server"] {
    opacity: 0.5;
}
/* Make commit, parent and change IDs use a monospace font */
.com-google-gerrit-client-change-CommitBox_BinderImpl_GenCss_style-header td div span {
    font-family: monospace;
}
/* Make the download popup wide enough to fit the (now shorter) commands */
.downloadBoxCopyLabel span {
    width: 600px;
}
    `
},
    
/******************************************************************************/
    
{
    "name": "SignantHealth: Jenkins",
    "version": "1.0.0",
    "regex": /.*jenkins.*\.signanthealth\.com.*/g,
    "css": `
a[tooltip*='Sami Kankaristo'] {
    border: 1px solid red;
}
    `
},
    
/******************************************************************************/
    
    {
        "name": "Slack",
        "version": "2.5.1",
        "regex": /.*\.slack\.com.*/g,
        "css": `
/***********
 * SIDEBAR *
 **********/

/* Make the sidebar header smaller */
.p-ia__sidebar_header--ia_details_popover {
    height: auto;
}
/* Fix the position and size of button in the sidebar header (breaks because of the above change) */
.p-channel_sidebar__compose_button--ia_details_popover {
    height: 20px;
    width: 20px;
    top: 2px;
}
/* Make sidebar items less tall */
.p-channel_sidebar__static_list__item {
    height: 22px !important;
    position: static;
}
.p-channel_sidebar--iap1 .p-channel_sidebar__channel,
.p-channel_sidebar--iap1 .p-channel_sidebar__link,
.p-channel_sidebar--iap1 .p-channel_sidebar__section_heading,
.p-channel_sidebar--iap1 .p-channel_sidebar__section_placeholder,
.p-drag_layer .p-channel_sidebar__channel,
.p-drag_layer .p-channel_sidebar__link,
.p-drag_layer .p-channel_sidebar__section_heading,
.p-drag_layer .p-channel_sidebar__section_placeholder {
    height: 22px;
    line-height: 22px;
}
/* Hide "Upgrade Plan" button from the sidebar */
.p-ia__sidebar_header__upgrade_cta {
    display: none;
}
/* Hide "Add teammates" from the sidebar (I've never used it, since there's the "New message" button at the top) */
#addMoreDM {
    display: none;
}
/* Hide "Apps" at the bottom of the sidebar (I've never used it) */
div[aria-label="Recent Apps"] {
    display: none;
}
/* Hide "Add apps" from the bottom of the sidebar (I've never used it) */
#addMoreApps {
    display: none;
}
/* Hide the "huddle" feature, which isn't available in the free tier */
.p-huddle_sidebar_footer,
.p-huddle_sidebar_pro_trial_badge__container {
    display: none;
}
/* Hide "Upgrade" from the bottom of the sidebar (I don't plan on using it) */
#upgradeSlackCTA {
    display: none;
}
/* Intentionally break scrolling in the sidebar, because everything should fit in it without scrolling */
div[aria-label="Channels and direct messages"] {
    height: auto !important;
}
/* Hide the scrollbar */
.p-channel_sidebar .c-scrollbar__track {
    display: none;
}

/************
 * MESSAGES *
 ***********/

/* Make the messages/channel header smaller */
.p-view_header {
    height: auto;
}
/* Make the message writing area a bit more compact */
.p-message_pane_input {
    padding: 0;
}
.p-notification_bar {
    height: auto;
}
.c-wysiwyg_container__footer > div {
    padding: 0;
}
.c-wysiwyg_container__footer button {
    margin: 0;
}
/* Hide the bookmarks bar (waste of space, cause I don't use it) */
.p-bookmarks_bar_container,
div[aria-label="Bookmarks"] {
    display: none;
}
/* Make day dividers a bit more noticeable */
.c-message_list__day_divider__label__pill,
button[aria-label="Jump to date"] {
    border: solid 1px #777777;
}
/* Make messages (more) compact */
.p-message_pane_message__message .c-message_kit__gutter,
.p-message_pane_message__message .c-message_kit__tombstone {
    padding: 5px 20px;
}
/* Make multiple lines of a single message be closer than lines from separate messages */
[lang] .p-rich_text_block {
    line-height: 1;
}
/* Make code font size a bit bigger, use same line-height as regular text */
code,
pre {
    font-size: 13px;
    line-height: 1;
}
/* Make the baseline for code the same as regular text */
.p-rich_text_section code,
.p-rich_text_section pre {
    position: relative;
    top: -1px;
}
/* Fix margins from the above change (Slack uses negative margins for some reason, I'm actually making the margins bigger) */
.c-message_kit__gutter__right {
    margin-bottom: -8px;
}
/* Make line breaks taller (they should be full empty lines) */
.c-mrkdwn__br {
    height: 20px;
}

/**********
 * COLORS *
 *********/

/* Make the sidebar header background black */
.p-ia__sidebar_header {
    background: black;
}
/* Make the sidebar background black */
.p-channel_sidebar {
    background: black;
}
/* Make the sidebar section headings' background black */
.p-channel_sidebar--iap1 .p-channel_sidebar__section_heading,
.p-drag_layer .p-channel_sidebar__section_heading {
    background: black;
}
/* Make the messages/channel header background black */
.p-view_header--with-bookmarks-bar {
    background: black;
}
/* Make the message writing area background black */
.p-workspace__primary_view_footer {
    background: black;
}
.p-message_input__input_container_unstyled {
    background: black;
}
/* Make the message formatting buttons visible */
.c-wysiwyg_container .c-wysiwyg_container__formatting .c-icon_button {
    background: black;
    color: gray;
    opacity: 1;
}
/* Same for buttons below the message composing area */
.c-wysiwyg_container .c-wysiwyg_container__button,
.c-wysiwyg_container .p-composer__button--sticky.c-icon_button,
.p-texty_floating_formatting_bar .p-composer__button--floating.c-icon_button {
    color: gray;
}
        `
    },
    
/******************************************************************************/
    
{
    "name": "Spotify",
    "version": "1.0.1",
    "regex": /.*\.spotify\.com.*/g,
    "css": `
/* Hide list of recommended tracks from playlists ("hides" the end of the playlist) */
div[aria-label="Recommended"][data-testid="track-list"] {
    display: none;
}
    `
},
    
/******************************************************************************/
    
    {
        "name": "Transmission",
        "version": "2.0.0",
        "regex": /.*transmission\/web.*/g,
        "css": `
/* Hide useless links */
fieldset.section.links {
    display: none;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Ultimate Guitar",
        "version": "1.0.0",
        "regex": /.*ultimate-guitar\.com.*/g,
        "css": `
/* Move the player's bottom bar to the right, so that it's less on top of the side bar */
._2rlUA .Wvegf {
    position: absolute;
        bottom: 2em;
        right: 2em;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Verkkokauppa.com",
        "version": "1.1.0",
        "regex": /.*verkkokauppa\.com.*/g,
        "css": `
/* Dark mode fix: white button text color */
.hiDkBp:not(:active) {
    color: #808080;
}

/* TEMPORARY FIX: Scrolling is broken */
body.overflowHidden {
    overflow: inherit !important;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "WhatsApp Web",
        "version": "1.0.0",
        "regex": /.*web\.whatsapp\.com.*/g,
        "css": `
/* Dark mode fix: make sign-in QR code work */
div._2UwZ_ {
    background: #cccccc;
    padding: 2em;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Yle Areena",
        "version": "1.1.0",
        "regex": /.*areena\.yle\.fi.*/g,
        "css": `
/* Remove useless max-width */
.tv-service div.player-holder, .grid-container {
    max-width: none;
}
/* Replace the dodgy padding-bottom with an automatic height */
div[itemprop="video"].areena_player {
    height: auto;
    max-height: 100vh;
    padding-bottom: 0;
}
/* Remove padding between header and video, so that it's easier to scroll to the exact top of the video  */
.program-info .player-background {
    padding: 0;
}
/* Hide floating header (goes on top of video) */
.headroom--not-top {
    display: none;
}
/* Hide "Share" button */
.sc-gqjmRU.cOpdsP {
    display: none;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "YouTube",
        "version": "8.1.0",
        "regex": /.*youtube\.com.*/g,
        "css": `
/* Hide the scrollbar */
body::-webkit-scrollbar {
    display: none;
}
ytd-watch:not([theater]) #top.ytd-watch {
    /* Remove margin at the top of the video */
    margin-top: 0;
}

/* Hide the "Contains paid content" thing on top of the video */
.ytp-paid-content-overlay {
    display: none;
}

/* Hide the autoplay button when it's disabled (avoid accidental presses)*/
button[aria-label="Autoplay is off"] {
    display: none !important;
}

/* Hide the miniplayer button (avoid accidental presses) */
.ytp-miniplayer-button {
    display: none !important;
}

/* Hide the weird invisible bar that blocks button clicks */
#contentContainer.tp-yt-app-drawer[swipe-open].tp-yt-app-drawer::after {
    display: none;
}

/* The gradient at the top and bottom of the video is broken in dark mode */
.ytp-gradient-bottom,
.ytp-gradient-top {
    display: none;
}

/* Hide the weird invisible bar, which blocks clicks on the left-hand side */
#contentContainer.app-drawer[swipe-open].app-drawer::after {
    bottom: auto;
}

/* Hide another invisible bar */
#toast[aria-hidden=true] {
    display: none;
}

/* Hide the YouTube shorts video controls (they block my own controls) */
.ytd-shorts .player-controls {
    display: none;
}

/* Fix the dumb new video height limitation in theater mode */
ytd-watch-flexy[theater][theater-mode-at-all-widths_] #player-theater-container.ytd-watch-flexy,
ytd-watch-flexy[fullscreen][theater-mode-at-all-widths_] #player-theater-container.ytd-watch-flexy,
ytd-watch-flexy[theater] #player-wide-container.ytd-watch-flexy,
ytd-watch-flexy[fullscreen] #player-wide-container.ytd-watch-flexy,
ytd-watch-flexy[full-bleed-player] #player-full-bleed-container.ytd-watch-flexy,
ytd-watch-flexy[full-bleed-player] #full-bleed-container.ytd-watch-flexy {
    min-height: 585px;
}

/* Playlist counter */
ytd-grid-playlist-renderer {
    counter-increment: playlistCounter;
}
h3.ytd-grid-playlist-renderer a::before {
    content: counters(playlistCounter, "") ". ";
}

/* Custom playlist filter inputs */
.custom-playlist-filter-input {
    background: rgba(0, 0, 0, 0.3);
    border: none;
    color: white;
    font-size: 16px;
    padding: 4px 6px;
}
.custom-playlist-filter-input_save-to {
    flex: 1;
    margin-right: 2em;
}
.custom-playlist-filter-input_created {
    position: absolute;
        left: 16em;
}

/* Hide recommended videos in playlists */
ytd-item-section-header-renderer[title-style='ITEM_SECTION_HEADER_TITLE_STYLE_PLAYLIST_RECOMMENDATIONS'],
ytd-playlist-video-renderer[style-type='playlist-video-renderer-style-recommended-video'],
#dismissible.ytd-shelf-renderer {
    display: none;
}


/* Maximum height for "Save to..." window (save to playlist) */
tp-yt-paper-dialog.style-scope.ytd-popup-container {
    bottom: 5px;
    top: 5px !important;
    margin: 0;
    max-height: none !important;
    min-width: 50vw;
}
ytd-add-to-playlist-renderer[dialog] #playlists.ytd-add-to-playlist-renderer {
    max-height: calc(100% - 52px - 165px - 16px - 16px - 5px - 5px);
}
#create-playlist-form {
    padding-top: 0;
}

/* Embedded video header */
#player .ytp-chrome-top {
    left: 55px;
}

/* Don't allow scrollbars for this element (playlist drag and drop triggers it) */
ytd-app {
    overlow-x: hidden;
    overlow-y: hidden;
}

/* Make the top navigation a bit less tall */
#container.ytd-masthead {
    height: 40px;
}
#page-manager.ytd-app {
    margin-top: 40px;
}
ytd-mini-guide-renderer.ytd-app {
    top: 40px;
}
/* Grow the video to fit the rest of the window */
ytd-watch-flexy[theater] #player-theater-container.ytd-watch-flexy,
ytd-watch-flexy[fullscreen] #player-theater-container.ytd-watch-flexy {
    max-height: calc(100vh - 40px);
}
/* Also grow the playlist view and sidebar */
ytd-browse[page-subtype=playlist] ytd-two-column-browse-results-renderer.ytd-browse {
    min-height: calc(100vh - 40px);
}
ytd-playlist-sidebar-renderer.ytd-browse,
ytd-settings-sidebar-renderer.ytd-browse {
    height: calc(100vh - 40px);
}
/* Make the playlist sidebar more compact, so it doesn't needlessly scroll */
ytd-playlist-sidebar-renderer {
    padding: 5px 15px
}
ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer {
    margin-bottom: 0;
}
#items.ytd-playlist-sidebar-renderer > *.ytd-playlist-sidebar-renderer:not(:last-child) {
    border-bottom: 0;
}
#stats.ytd-playlist-sidebar-primary-info-renderer {
    margin-top: 0;
}
paper-dropdown-menu-light[no-label-float] .paper-dropdown-menu-light[slot="dropdown-trigger"] {
    padding-top: 0;
}
.paper-dropdown-menu-light[slot="dropdown-trigger"] {
    padding: 0;
}
.paper-dropdown-menu-light[slot="dropdown-trigger"] iron-icon.paper-dropdown-menu-light {
    bottom: 0;
}
#menu.ytd-playlist-sidebar-primary-info-renderer {
    margin: 0;
}
ytd-playlist-sidebar-secondary-info-renderer {
    padding: 0;
}
/* Remove the all/videos/shorts filter from the top of the playlist */
body[data-url*="playlist?list"] .ytd-feed-filter-chip-bar-renderer {
    display: none;
}
body[data-url*="playlist?list"] ytd-feed-filter-chip-bar-renderer {
    height: 10px;
}
/* Make playlist items more compact */
#sort-filter-menu.ytd-playlist-video-list-renderer {
    padding: 0 0 0 10px;
}
#contents.ytd-playlist-video-list-renderer {
    padding-bottom: 50px;
}
#contributor.ytd-playlist-video-renderer,
#index.ytd-playlist-video-renderer,
#content.ytd-playlist-video-renderer {
    padding: 2px 0;
}
#video-title.ytd-playlist-video-renderer {
    font-size: 1.2em;
    line-height: 1.2em;
    margin-bottom: 0;
}
ytd-thumbnail.ytd-playlist-video-renderer {
    height: 50px !important;
    width: calc(50px * (16/9)) !important;
}

/* Fix playlist title position for empty playlists (no playlist thumbnail) */
.ytd-playlist-header-renderer.thumbnail-wrapper[hidden] {
    display: block !important;
    height: 0;
}

/* Hide the "Watch later" playlist from the "Save to..." window */
#playlists > ytd-playlist-add-to-option-renderer:first-child {
    display: none;
}

/* Hide sidebar buttons (replaced with more useful buttons) */
#items > ytd-mini-guide-entry-renderer {
    display: none;
}

/* Hide the "Add to queue", "Save to Watch later", "Download", and "Share" buttons from the playlist item context menu */
/* Count these from both directions, so that smaller menus (e.g. private/deleted video) are not affected */
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 7"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(1):nth-last-child(8),
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 7"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(2):nth-last-child(7),
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 7"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(5):nth-last-child(4),
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 7"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(6):nth-last-child(3) {
    display: none;
}
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 8"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(1):nth-last-child(8),
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 8"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(2):nth-last-child(7),
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 8"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(5):nth-last-child(4),
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 8"] tp-yt-paper-listbox .ytd-menu-popup-renderer:nth-child(6):nth-last-child(3) {
    display: none;
}
/* Sometimes the "Download" button is missing, so these extra rules are needed */
/* ... */
/* Sometimes the "Move to top" and "Move to bottom" buttons are missing, some some extra rules for that */
/* ... */
/* Sometimes the "Download", "...top" and "...bottom" buttons are missing, so these extra rules are needed */
/* ... */
/* Also hide the separator (which isn't really necessary with 4 remaining items) */
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 7"] ytd-menu-service-item-renderer[has-separator]:not(:last-child)::after,
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 7"] ytd-menu-service-item-download-renderer[has-separator]:not(:last-child)::after {
    display: none;
}
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 8"] ytd-menu-service-item-renderer[has-separator]:not(:last-child)::after,
body[data-url*="/playlist?list="] tp-yt-iron-dropdown[style*="left: 8"] ytd-menu-service-item-download-renderer[has-separator]:not(:last-child)::after {
    display: none;
}

/* Fix dropdown height */
ytd-menu-popup-renderer {
    height: auto !important;
}

/* Make video time display more visible against the video */
.ytp-time-display > span:nth-child(2) {
    background: black;
    padding: 2px;
}

/* Make the chapter title more visible against the video */
.ytp-chapter-title-content {
    background: black;
    line-height: normal;
    padding: 2px;
}
/* Make the chapter title work better with the custom video title */
.ytp-exp-bottom-control-flexbox .ytp-chapter-container {
    overflow: visible;
}

/* Hover style for custom sidebar buttons */
.custom-sidebar-button:hover {
    background: #004900 !important;
}

/* Only show playlist video count and total length on hover */
.custom-sidebar-button .playlist-extra-info {
    font-size: 0.8em;
    font-weight: normal;
}
.custom-sidebar-button:not(:hover) .playlist-extra-info {
    display: none;
}
.custom-sidebar-button:hover .playlist-extra-info {
    display: block;
}

/* No padding at the top of playlists */
ytd-browse[page-subtype=playlist] {
    padding-top: 0 !important;
}

/* Playlist header (less padding, no background) */
div.ytd-playlist-header-renderer {
    background: none !important;
    padding-top: 0 !important;
}
div[class*="page-header-background"] {
    display: none;
}

/* Less wasted space in playlist info (to avoid scrollbars even for shorts) */
ytd-browse[page-subtype=playlist] ytd-playlist-header-renderer.ytd-browse {
    height: 100vh !important;
}
.ytd-playlist-header-renderer.metadata-action-bar {
    margin-top: 0 !important;
}
.ytd-playlist-header-renderer.metadata-owner {
    margin-bottom: 0 !important;
}
.metadata-text-wrapper.ytd-playlist-header-renderer {
    margin-bottom: 0 !important;
}
.play-menu.ytd-playlist-header-renderer {
    margin: 0 !important;
}

/* Less empty space between playlist videos */
ytd-playlist-video-renderer #content.ytd-playlist-video-renderer {
    padding: 0 !important;
}

        `
    },
    
/******************************************************************************/
    
    {
        "name": "Zalando",
        "version": "1.0.0",
        "regex": /.*zalando\..*/g,
        "css": `
/* Dark mode fix: fix background color */
body {
    background: black;
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "Zotero",
        "version": "1.0.1",
        "regex": /.*zotero\.org.*/g,
        "css": `
/* Dark mode fix: fix alternating row colors */
.items-table .items-table-body {
    background-image: repeating-linear-gradient(to bottom, #0a0a0a 2px, #0a0a0a 28px, transparent 28px, transparent 54px)
}
        `
    },
    
/******************************************************************************/
    
    {
        "name": "",
        "version": "1.0.0",
        "regex": /.*/g,
        "css": `
        `
    }
];


///
/// Additional initialization inside an iframe.
///
function InitInsideIframe() {
    var body = document.body;
    
    if (body == null) {
        setTimeout(InitInsideIframe, 10);
        
        return;
    }
    
    body.classList.add("inside-iframe");
}


///
/// Initialize.
///
function Init() {
    Util.Log("Init()");
    
    var url = window.location.href;
    
    if (url.includes("teams.microsoft.com")) {
        Util.Log("Not running for Teams");
        return;
    }
    
    for (var i = 0; i < customCss.length; ++i) {
        if (customCss[i].regex.test(url)) {
            Util.Log("Found matching regex: ", customCss[i].regex);
            Util.CreateCssElement(customCss[i].css);
        }
    }
    
    if (Util.InIframe()) {
        InitInsideIframe();
    }
}


(
    function () {
        "use strict";
        
        Init();
    }
)();

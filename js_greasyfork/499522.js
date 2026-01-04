// ==UserScript==
// @name         Better GUI (Geoguessr)
// @namespace    alienperfect
// @version      2024.12
// @description  A personal set of CSS rules that remove clutter and make the game look nicer.
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=geoguessr.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499522/Better%20GUI%20%28Geoguessr%29.user.js
// @updateURL https://update.greasyfork.org/scripts/499522/Better%20GUI%20%28Geoguessr%29.meta.js
// ==/UserScript==

GM_addStyle(`
/* [0001] Avatars */
[class*="avatarContainer"]:not([class*="health-bar_avatarContainer__"], [class*="chat-message_avatarContainer__"]) {display: none !important}
[class*="avatarNickContainer"] {display: none !important}
[class*="avatarWrapper"] {display: none !important}
[class*="avatar_root"] {display: none !important}
[class*="party-card_members__"] {display: none !important}

/* PROFILE: hide avatar button */
a[href^="/avatar"] {display: none !important}
[class*="profile-header_actions__"]:has(a[href*="/avatar"]) {display: none !important}


/* [0002] Home page */
/* Hide bloat */
[class^="pro-user-start-page_root__"] {display: none !important}

/* Hide coin count */
[data-qa="profile-coin-count"] {display: none !important}

/* Hide shop from navbar */
a[href^="/shop"] {display: none !important}

/* Hide "free" tag */
[class*="tag_variantAlertGlow__"] {display: none !important}

/* Hide merch nudge */
[class*="merchNudge"], [class*="merch-nudge"] {display: none !important}

/* Notification dot next to Geoguessr logo */
[class^="header-logo_"] [class^="notification-dot_"] {display: none !important}


/* [0003] Profile */
/* Hide trophies */
[class*="profile-feats_feats__"] {display: none !important}

/* Compare stats no animation */
[class*="user-stats-overview_youBox__"] {animation: none !important}
[class*="user-stats-overview_mainValueAnimation__"] {animation: none !important; transition: none !important}

/* Hide friend suggestions */
[class*="friend-list_friendsMeta"] {display: none !important}
[class*="friend-list_container__"] {padding: 0 !important}

/* Center stats, remove avatar container */
[class^="profile-v2_wrapper__"] {width: auto !important; flex-direction: column !important}


/* [0004] Game */
/* Hide people playing */
[class*="live-players-count_container__"] {display: none !important}

/* Hide reactions button */
[class*="game-reactions_root__"] {display: none !important}

/* Hide Google copyright, logo, shortcuts */
[class$="gmnoprint"], [class$="gm-style-cc"], img[src*="google-logo"] {display: none !important}

/* Hide logo */
[class*="game_inGameLogos__"] {display: none !important}

/* Hide friend chat */
[class*='friend-chat-in-game-button_root__'] {display: none !important}

/* Hide zoom controls */
[class*="styles_controlGroup__"] {display: none !important}
[class*="guess-map_zoomControls__"] {display: none !important}


/* [0005] QoL */
/* Allow selection of all text */
* {user-select: text !important}

/* Underline links on hover */
a:hover {text-decoration: underline !important}

/* Hide loading animation (games load slightly faster) */
[class*="fullscreen-spinner"] {display: none !important}


/* [0006] Tweaks */
/* Hide slant on elements */
* {font-style: normal !important}
div[class*="slanted"] {transform: none !important}
div[class*="slanted"]::before {transform: none !important}

/* Transparent map status bar */
[class*="status_inner__"] {background-color: rgb(0 0 0 / 50%) !important; border-bottom-left-radius: 0.5rem !important; border-top-left-radius: 0.5rem !important}
[class*="slanted-wrapper_withShadow"] {--variant-filter: drop-shadow(0 0.3rem 0.4rem rgba(0,0,0,.4)) !important}
[class*="slanted-wrapper_variantPurple__"] {--variant-background-color: unset !important; --variant-box-shadow: unset !important}
[class*="status_inner__"] > * [class*="status_label__"] {color: rgb(255 255 255 / 95%) !important}
[class*="status_inner__"] > * [class*="status_value__"] {color: rgb(255 255 255 / 95%) !important}

/* New compass more transparent */
[class*="compassContainer"] {background-color: rgb(0 0 0 / 30%) !important}

/* Faster map opening animation */
[data-qa='guess-map'] {transition: opacity .05s ease, width .05s ease, height .05s ease !important}

/* Reduce pin opacity on hover */
[class*="map-pin_mapPin"]:not([data-pano]):hover {opacity: 15%}

/* ONGOING GAMES */
[class*="current_image__"] * [class*="styles_root__"] {border-radius: 100% !important}
[class*="current_gameListItem"] > [class*="current_actions"] {flex-direction: row-reverse !important}
`);


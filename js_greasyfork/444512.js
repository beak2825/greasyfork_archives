// ==UserScript==
// @name         Discord Utilities
// @description  Discord utilities with lots of features that fully customizable!
// @author       AD
// @version      0.0.2
// @namespace    discord-utilities
// @license      GPL-3.0
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?domain=discord.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/444512/Discord%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/444512/Discord%20Utilities.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //0 for off, 1 for on.

    //Hide the sidebar automatically
    let hide_sidebar = 0;
    let wait_for_sidebar_hide = 100; //ms
    let sidebar_hide_speed = ".1" //s

    //Changing fonts
    let change_fonts = 1;
    let font = "Consolas";
    let secondary_font = "Consolas";
    let font_size = "12" //px, experimental because Discord will mostly override this.
    //You can add more elements in CSS injector below!


    //Dark mode
    let dark_mode = 1;
    let even_darker_mode = 0;

    //functions
    if (hide_sidebar === 1) {
        window.setTimeout(function waitForLoad() {
            let sidebar = Array.from(document.querySelectorAll("*").values()).find(e => Array.from(e.classList).find(cls => cls.match(/^sidebar-.*/)))
            let nav = Array.from(document.querySelectorAll("nav")).find(n => Array.from(n.classList).find(cls => cls.match(/guilds-.*/)))
            if (!(!!nav && !!sidebar)) window.setTimeout(waitForLoad, 300)
            sidebar.style.position = "absolute"
            sidebar.style.top = 0
            sidebar.style.bottom = 0
            sidebar.style.transitionProperty = "transform"
            sidebar.style.transitionTimingFunction = "ease"
            sidebar.style.transitionDuration = sidebar_hide_speed + "s"
            sidebar.style.zIndex = 200
            sidebar.style.transform = "translateX(-" + sidebar.clientWidth + "px)"

            let keepopen = false;
            nav.onmouseenter = function () {
                sidebar.style.transform = "translateX(0)";
                keepopen = true;
            }
            nav.onmouseleave = function () {
                keepopen = false;
            }
            sidebar.onmouseenter = function () {
                keepopen = true;
            }

            sidebar.onmouseleave = function () {
                keepopen = false;
                window.setTimeout(function () {
                    if (!keepopen) sidebar.style.transform = "translateX(-" + sidebar.clientWidth + "px)"
                }, wait_for_sidebar_hide)
            }
        }, 300)
    }

    if (change_fonts === 1) {
        let injector = document.createElement('style');
        injector.innerHTML = `* { font-family: ${font}, ${secondary_font} !important; font-size: ${font_size}px;}`;
        document.body.appendChild(injector);
    }

    if (dark_mode === 1) {
        GM_addStyle(`
    .theme-dark {
    	--background-primary: #2F3E4E;
    	--background-secondary: #1B2C3E;
        --background-tertiary: #162332;
    	--channeltextarea-background:#2F3E4E;
    	--deprecated-panel-background:#2F3E4E;
    }
    .theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-track-piece {
        background-color: var(--background-secondary);
        border: 3px solid var(--background-primary);
        border-radius: 7px;
    }
    .theme-dark .scrollerThemed-2oenus.themedWithTrack-q8E3vB .scroller-2FKFPG::-webkit-scrollbar-thumb {
        background-color: var(--background-tertiary);
        border-color: var(--background-primary);
    }
    .inner-zqa7da {
        border: rgba(204, 204, 204, 0.27) solid 1px;
        border-radius: 0;
    }`);
    }

    if (even_darker_mode === 1) {
        GM_addStyle(`
    .modal-1k91nT.root-1gCeng,
    .modalSize-cqUaws.root-1gCeng,
    .modalRoot-1Kx4Hb.root-1gCeng,
    .main-3auUui.root-1gCeng,
    .modalRoot-LW89o7.root-1gCeng,
    .modal-yWgWj-.fullscreenOnMobile-1aglG_,
    .root-1gCeng.small-3iVZYw,
    .root-1gCeng.medium-2RE1hE { /* All Modals */
        background-color: var(--background-primary);
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 rgba(0, 0, 0, .2);
    }
    .modal-1k91nT.root-1gCeng > .header-1TKi98 {
        background-color: var(--background-primary);
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 rgba(0, 0, 0, .2);
    }
    .modal-1k91nT.root-1gCeng > .footer-1FPmkC,
    .modalSize-cqUaws.root-1gCeng > form > .footer-2gL1pp,
    .root-1gCeng.small-3iVZYw > form > .footer-2gL1pp,
    .modalRoot-1Kx4Hb.root-1gCeng > .footer-2gL1pp,
    .modalRoot-LW89o7.root-1gCeng > .footer-2gL1pp,
    .modal-yWgWj-.fullscreenOnMobile-1aglG_ > .footer-2gL1pp,
    .root-1gCeng.small-3iVZYw > .footer-2gL1pp,
    .root-1gCeng.medium-2RE1hE > .footer-2gL1pp,
    .root-1gCeng.medium-2RE1hE > .modal-1O3czN > .footer-2gL1pp {
        background-color: var(--background-tertiary);
        box-shadow: 0 0 0 1px var(--background-tertiary), 0 2px 10px 0 rgba(0, 0, 0, .2);
    }
    .settingsGroup-2NaPKC > .group-2dAfBy > .selectorButton-EEUWed {
        border-color: var(--background-secondary) !important;
    }

    .colorPickerCustom-2CWBn2 { /* Color Picker */
        background-color: var(--background-secondary-alt) !important;
        border-color: var(--background-secondary) !important;
    }

    .emojiPicker-3PwZFl > .inspector-S2gM3e { /* Emoji Picker */
        background-color: var(--background-tertiary);
    }
    .emptyHintCard-2mUdMe {
        background-color: var(--background-secondary-alt) !important;
    }

    .contentWrapper-3WC1ID { /* Invite Splash */
        background-color: var(--background-secondary-alt) !important;
    }

    .userPopout-3XzG_A { /* User Modal and Popouts */
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary);
    }
    .userPopout-3XzG_A > .headerNormal-T_seeN {
        background-color: var(--background-tertiary);
    }
    .userPopout-3XzG_A > .body-3iLsc4,
    .userPopout-3XzG_A > .footer-1fjuF6 {
        background-color: var(--background-secondary);
    }

    .phoneFieldPopout-7PzjOO { /* Add a Phone Number */
        background-color: var(--background-primary) !important;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary);
    }

    .regionSelectPopout-p9-0_W { /* Call Region Selector */
        background-color: var(--background-primary) !important;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary);
    }

    .container-VSDcQc > .header-2bNvm4 { /* Add Role */
        background-color: var(--background-tertiary) !important;
    }
    .container-VSDcQc > .autocompleteShadow-iiGWFU {
        background-color: var(--background-primary) !important;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary);
    }
    .container-VSDcQc > .autocompleteArrowWrapper-3Z7OuM > .autocompleteArrow-Zxoy9H {
        background-color: var(--background-primary) !important;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary);
    }

    .keyboardShortcutsModal-3piNz7 { /* Keyboard Shortcut */
        background-color: var(--background-primary) !important;
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 rgba(0, 0, 0, .2);
    }
    .keyboardShortcutsModal-3piNz7 > .modalSubtitle-1Pj5nv {
        border-bottom: 1px solid var(--background-tertiary) !important;
    }
    .keybindShortcut-1BD6Z1 > span {
        background-color: var(--background-secondary-alt) !important;
        box-shadow: inset 0 -4px 0 var(--background-secondary) !important;
        border-color: var(--background-tertiary) !important;
    }

    .modal-yWgWj-.fullscreenOnMobile-1aglG_ > .reactors-Blmlhw { /* Reactions */
        background-color: var(--background-primary);
    }
    .modal-yWgWj-.fullscreenOnMobile-1aglG_ > .scroller-1-nKid {
        background-color: var(--background-tertiary);
    }

    .everyonePopout-nEbJY3 > .body-2iXqIL { /* Mention Everyone Warning */
        box-shadow: 0 2px 10px 0 var(--background-secondary-alt);
    }
    .everyonePopout-nEbJY3 > .body-2iXqIL {
        background-color: var(--background-primary);
    }
    .everyonePopout-nEbJY3 > .footer-2aTx0s {
        background-color: var(--background-tertiary);
    }

    .streamPreview-2-WUWT > .previewContainer-12UlHl { /* Stream Preview */
        background: var(--background-secondary);
    }
    .streamPreview-2-WUWT > .body-Ogsp8i {
        background: var(--background-tertiary);
    }

    .uploadModal-2ifh8j { /* Upload Modal */
        background-color: var(--background-primary) !important;
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 var(--background-secondary) !important;
    }
    .uploadModal-2ifh8j > .footer-3mqk7D {
        background-color: var(--background-tertiary);
        box-shadow: inset 0 1px 0 var(--background-secondary);
    }

    .wrapperAudio-1jDe0Q,
    .attachment-33OFj0 { /* Uploading/Uploaded Files */
        border-color: var(--background-primary) !important;
    }


    /* Dropdowns */
    .css-gvi9bl-control,
    .css-6fzn47-control {
        border-color: var(--background-tertiary);
    }
    .css-3vaxre-menu,
    .css-dwar6a-menu {
        background-color: var(--background-secondary);
        box-shadow: var(--background-tertiary) 0px 1px 5px 0px;
        border-color: var(--background-tertiary);
    }


    /* User Settings Related */
    .codeRedemptionRedirect-1wVR4b { /* Redeem Code Redirect */
        background-color: var(--background-secondary) !important;
        border-color: var(--background-tertiary) !important;
    }

    .subscriptionDetails-1dUmjl ~ .featureGrid-3-fNl- > .feature-2w65J5 { /* Features */
        background-color: var(--background-secondary-alt);
    }

    .stickerImageSection-7EUs8E { /* Stickers */
        background-color: var(--background-secondary) !important;
    }

    .inputSensitivityToggle-2LKb8o > .slider-1PF9SW > .bar-2Qqk5Z.sliderBar-3DezvM:not(.speaking-2bFhO4):not(.microphone-2rtdHw) { /* Automatic Input Sensitivity */
        background-color: var(--background-secondary-alt);
    }

    .media-engine-video ~ .previewOverlay-2O7_KC { /* Camera Preview */
        background-color: var(--background-secondary) !important;
        border-color: var(--background-tertiary) !important;
    }

    .option-n0icdO { /* Overlay Positioning */
        background-color: var(--background-modifier-accent);
    }

    .keybindGroup-JQs9x_.card-FDVird::before { /* Keybinds */
        background-color: var(--background-secondary-alt) !important;
        border-color: var(--background-secondary) !important;
    }
    .removeKeybind-39dSFj {
        background-color: var(--background-tertiary) !important;
        box-shadow: 0 0 0 1px var(--background-secondary), 0 1px 5px 0 rgba(0,0,0,.3) !important;
    }

    .activeGame-14JI7o.notDetected-33MY4s { /* Game Acitivty */
        background-color: var(--background-secondary-alt);
    }
    .game-1ipmAa {
        box-shadow: 0 1px 0 0 var(--background-modifier-accent) !important;
    }
    .game-1ipmAa::before {
        background-color: var(--background-secondary-alt) !important;
        border-color: var(--background-secondary) !important;
    }
    .gameName-1RiWHm.gameNameInput-385LoS:hover,
    .gameName-1RiWHm.gameNameInput-385LoS:focus {
        background-color: var(--background-secondary);
        border-color: var(--background-modifier-accent);
    }

    .addGamePopout-2RY8Ju {
        background-color: var(--background-primary) !important;
        box-shadow: 0 0 0 1px var(--background-tertiary), 0 2px 10px 0 rgba(0,0,0,.2) !important;
    }

    .title-3sZWYQ ~ div > .item-3eFBNF {
        box-shadow: inset 0 -1px 0 0 var(--background-modifier-accent);
    }
    .title-3sZWYQ ~ div > .item-3eFBNF.selected-2DeaDa {
        background-color: var(--background-modifier-selected);
    }


    /* Server Settings Related */
    .emojiRow-zIc7ZX::before { /* Emojis */
        background-color: var(--background-secondary-alt) !important;
        border-color: var(--background-secondary) !important;
    }
    .emojiInput-1aLNse {
        background-color: var(--background-secondary) !important;
        border-color: var(--background-modifier-accent) !important;
    }

    .default-3oAQTF.emojiRemove-1k6MlJ {
        background-color: var(--background-secondary) !important;
        box-shadow: 0 0 0 1px var(--background-tertiary), 0 1px 5px 0 rgba(0,0,0,.3) !important;
    }

    .auditLog-3jNbM6 { /* Aduit Log */
        border-color: var(--background-modifier-accent) !important;
    }
    .auditLog-3jNbM6 > .header-GwIGlr {
        background-color: var(--background-secondary);
    }
    .auditLog-3jNbM6 > .headerExpanded-CUEwZ5 {
        background-color: var(--background-secondary-alt);
    }
    .changeDetails-bk98pu {
        background-color: var(--background-secondary) !important;
    }

    .upsellFooter-ZYsio_ { /* Overview */
        background-color: var(--background-tertiary);
    }

    .tierHeaderLocked-1a2opw { /* Boost Status */
        background-color: var(--background-tertiary) !important;
    }
    .tierBody-x9kBBp {
        background-color: var(--background-secondary-alt) !important;
    }

    .progressWithSubscriptions-2AEPyo > svg > g > .background-3xPPFc {
        color: var(--background-tertiary);
    }
    .tierInProgress-3mBoXq.tier-2c9-hT {
        background-color: var(--background-tertiary);
    }

    .member-1q7VfX.card-FDVird::before { /* Members */
        background-color: var(--background-secondary-alt) !important;
        border-color: var(--background-secondary) !important;
    }
    .overflowRolesPopout-140n9i,
    .overflowRolesPopoutArrow-2O66oH {
        background-color: var(--background-primary) !important;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary) !important;
    }

    .membersFilterPopout-URUUD- {
        background-color: var(--background-primary) !important;
        box-shadow: 0 2px 10px 0 rgba(0,0,0,.2), 0 0 0 1px var(--background-secondary) !important;
    }
    .membersFilterPopout-URUUD- > .scroller-2CvAgC > .selectableItem-1MP3MQ:hover {
        background-color: var(--background-modifier-selected) !important;
    }

    .inviteSettingsInviteRow-3p2O-N.card-FDVird::before { /* Invites */
        background-color: var(--background-secondary-alt) !important;
        border-color: var(--background-secondary) !important;
    }

    .group-2dAfBy > .box-gRofIO { /* Permissions Changer */
        border-color: var(--background-tertiary)
    }
    .group-2dAfBy > .passthroughSelected-1Eq0Kl {
        background-color: var(--background-modifier-selected);
    }


    /* Message Search and Quickswitcher */
    .searchFilter-2ESiM3, /* Message Search */
    .searchAnswer-3Dz2-q {
        background-color: var(--background-secondary-alt) !important;
    }
    #search-results {
        background-color: var(--background-secondary) !important;
        box-shadow: 0 0 0 1px var(--background-tertiary), 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    }
    #search-results > .focused-2bY0OD {
        background-color: var(--background-secondary) !important;
    }
    .option-96V44q.selected-rZcOL- {
        background-color: var(--background-modifier-hover) !important;
    }
    .option-96V44q::after {
        background: transparent !important;
    }
    .option-96V44q.selected-rZcOL-::after {
        background: linear-gradient(90deg,rgba(0, 0, 0, 0),var(--background-secondary-alt) 50%) !important;
    }
    .option-96V44q.selected-rZcOL-::before {
        background: linear-gradient(90deg,rgba(0, 0, 0, 0),var(--background-secondary-alt) 80%) !important;
        padding-left: 10px;
    }

    .react-datepicker, /* Date Picker */
    .react-datepicker__header {
        background-color: var(--background-secondary) !important;
    }
    .react-datepicker__day:not(:hover):not(.react-datepicker__day--disabled):not(.react-datepicker__day--outside-month) {
        background-color: var(--background-secondary-alt) !important;
    }
    .react-datepicker__day {
        border-color: var(--background-tertiary) !important;
    }
    .react-datepicker__day--disabled,
    .react-datepicker__day--outside-month {
        background-color: var(--background-primary) !important;
    }

    .quickswitcher-3JagVE { /* Quick Switcher */
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 rgba(0, 0, 0, 0.2);
    }
    .quickswitcher-3JagVE > .input-2VB9rf {
        background-color: var(--channeltextarea-background)
    }


    /* Friends Page */
    .peopleColumn-29fq28 { /* Friend Page */
        background-color: var(--background-primary);
    }

    .itemCard-v9viV7 > div > .inset-3sAvek { /* Item Cards */
        background-color: var(--background-secondary);
    }
    .itemCard-v9viV7.active-1xchHY,
    .itemCard-v9viV7:hover {
        background-color: var(--background-modifier-accent) !important;
    }
    .popout-38lTFE {
        background-color: var(--background-floating) !important;
    }
    .popout-38lTFE > div > .wrapper-3Rixsz.enabled-1t_Gxm:hover,
    .popout-38lTFE > .memberListContainer-13tNU9 > .memberListItem-31QoHj:hover {
        background-color: var(--background-modifier-hover);
    }


    /* Guild/Server Related */
    .regionSelectModal-12e-57 { /* Region Selector */
        background-color: var(--background-primary) !important;
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 rgba(0, 0, 0, .2) !important;
    }
    .regionSelectModalOption-2DSIZ3 {
        background-color: var(--background-secondary) !important;
        border-color: var(--background-secondary-alt) !important;
    }

    .perksModal-fSYqOq { /* Server Boost */
        background-color: var(--background-secondary-alt) !important;
        color: white;
    }
    .perksModalContentWrapper-2HU6uL > div > .progressBarWrapper-15RqAy > div > .barBackground-2EEiLw {
        background: var(--background-tertiary);
    }
    .tierMarkerBackground-3q29am {
        background: var(--background-secondary-alt) !important;
    }
    .tierMarkerInProgress-24LMzJ {
        background: var(--background-tertiary) !important;
    }

    .tierHeaderLocked-1s2JJz {
        background-color: var(--background-tertiary) !important;
    }
    .tierIcon-2qSKGj > path,
    .tierLock-3CSxSX > path,
    .tierTitle-y7BLPl,
    .tierRequirements-dGesMA {
        color: white;
        fill: white !important;
    }
    .tierBody-16Chc9 {
        background-color: var(--background-secondary) !important;
    }
    .perks-3OsGy8 > .perk-2WeBWW {
        background-color: var(--background-tertiary) !important;
    }

    .applicationStore-1pNvnv > .listingWrapper-329f74 > .scroller-1JpcIc { /* Store Pages */
        background-color: var(--background-secondary-alt);
    }
    .purchaseUnit-2lxci3 > .bodySection-jqkkIP,
    .whyYouMightLikeIt-2zZIIj,
    .features-_IOqVv > .row-1bU71H {
        background-color: var(--background-tertiary) !important;
    }

    .pageWrapper-1PgVDX { /* Server Discovery */
        background-color: var(--background-primary) !important;
    }

    .css-12hk9yc-control,
    .css-1adxh11-control,
    .css-ix84ef-menu {
        background-color: var(--background-tertiary);
    }


    /* Auotcomplete */
    .autocomplete-1vrmpx {
        background-color: var(--background-secondary) !important;
    }
    .autocompleteRow-2OthDa > .selected-1Tbx07 {
        background-color: var(--background-modifier-hover) !important;
    }
    .autocompleteRowVertical-q1K4ky > .base-1pYU8j > .divider-23swzi {
        background-color: var(--background-secondary-alt) !important;
    }


    /* Voice Call Buttons */
    .primaryDark-3mSFDl.button-38aScr {
        background-color: var(--background-secondary) !important;
    }
    .contextMenuNub-3yOOYo.primaryDark-3mSFDl {
        background-color: var(--background-secondary) !important;
    }


    /* Unsorted */
    .panels-j1Uci_ > div { /* User Area */
        background-color: var(--background-tertiary);
    }

    .invite-18yqGF.container-o3RxSG,
    .invite-18yqGF.preview-yX6Nx7 { /* Invites */
        background-color: var(--background-secondary-alt);
        border-color: var(--background-secondary);
    }

    .lookFilled-1Gx00P.colorPrimary-3b3xI6,
    .lookFilled-1Gx00P.colorGrey-2DXtkV { /* Buttons With No Color */
        background-color: var(--background-modifier-accent) !important;
    }

    .bar-2Qqk5Z:not(.sliderBar-3DezvM):not([style="background: rgb(105, 196, 154);"]) { /* Slider Bars */
        background-color: var(--background-secondary-alt) !important;
    }

    .content-1LAB8Z > .message-2qRu38:not(.cozyMessage-3V1Y8y) { /* Delete Message */
        background-color: var(--background-primary);
        box-shadow: 0 0 0 1px var(--background-tertiary), 0 2px 10px 0 rgba(0,0,0,.2);
    }

    .applicationStreamingPreviewSize-3NIvhL, /* Streaming */
    .previewImage-RxVzkZ {
       background-color: var(--background-secondary-alt);
    }

    .layer-v9HyYc > .animatorTop-2Y7x2r > div > .white-3xi-nx { /* RTC Connection */
        background-color: var(--background-secondary-alt);
    }
    .layer-v9HyYc > .animatorTop-2Y7x2r > div > section {
        background-color: var(--background-primary);
    }

    .friend-3KALPe.friendSelected-1sa4bG { /* Friend Selected */
        background-color: var(--background-modifier-selected);
    }

    .result-3w1ZcL[style*="background-color: rgb(24, 25, 28);"] { /* Loading Gifs */
        background-color: var(--background-tertiary) !important;
    }

    .imageWrapper-2p5ogY.embedWrapper-lXpS3L > .wrapper-2TxpI8 { /* Video Backgrounds */
        background-color: var(--background-tertiary);
    }

    .categoryHeader-O1zU94 { /* Slash Command */
        background-color: var(--background-tertiary);
    }
    html.theme-dark .theme-light {
        --header-primary: #fff;
        --header-secondary: #b9bbbe;
        --text-normal: #dcddde;
        --background-primary: #141414 !important;
        --background-secondary: #111111 !important;
        --background-secondary-alt: #292929 !important;
        --background-tertiary: black !important;
        --background-modifier-accent: rgb(15, 15, 15) !important;
        --background-modifier-hover: rgb(15, 15, 15) !important;
    }
    html.theme-dark .theme-light .root-1gCeng {
        background-color: #141414 !important;
        box-shadow: 0 0 0 1px var(--background-secondary), 0 2px 10px 0 rgba(0, 0, 0, .2) !important;
    }
    html.theme-dark .theme-light .footer-2gL1pp {
        background-color: #0c0c0c !important;
        box-shadow: inset 0 1px 0 var(--background-tertiary) !important;
        color: var(--text-normal) !important;
    }
    .footerButton-ayFTfX.colorGrey-2DXtkV {
        background-color: #242424 !important;
    }


    @keyframes flash {
        100% {
            border-color: white;
            box-shadow: 0 1px 5px rgba(255, 255, 255, 0.452);
        }
        50% {
            border-color: #c21616;
            box-shadow: 0 2px 10px rgba(240, 71, 71, 0.452);
        }
        0% {
            border-color: white;
            box-shadow: 0 1px 5px rgba(255, 255, 255, 0.452);
        }
    }

    .theme-light .layer-3QrUeG:first-of-type::before {
        content: "This theme is intended to be used with Dark Mode. In order to enable it, head to User Settings -> Appearance Tab -> Under THEME, select Dark.";
        z-index: 2;
        background: var(--background-primary);
        color: #fff;
        position: fixed;
        display: block;
        padding: 20px;
        width: 500px;
        height: 35px;
        top: 15%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(240, 71, 71, 0.452);
        border: 3px solid #c21616;
    }
    .theme-light [aria-label="User Settings"],
    .theme-light .sidebar-CFHs9e > .side-8zPYf6 > .item-PXvHYJ:nth-child(20),
    .theme-light #user-settings-cog-Appearance,
    .theme-light #user-settings-cog-Appearance--theme {
        animation: flash 1s ease infinite;
        box-shadow: 0 1px 5px rgba(240, 71, 71, 0.452);
        border: 2px solid #c21616;
    }
    .theme-light .preview-2nSL_2 + .marginTop40-i-78cZ > .radioGroup-1GBvlr > .item-26Dhrx:nth-child(1) {
        color: #fff;
        animation: flash 1s ease infinite;
        box-shadow: 0 1px 5px rgba(240, 71, 71, 0.452);
    }
    .theme-light .preview-2nSL_2 + .marginTop40-i-78cZ > .radioGroup-1GBvlr > .item-26Dhrx:nth-child(1)::before {
        content: "";
        animation: flash 1s ease infinite;
        border: 2px solid #c21616;
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
    }

    .theme-dark,
    .theme-light,
    :root {
        --background-primary: #141414 !important;
        --background-secondary: #111111 !important;
        --background-secondary-alt: #292929 !important;
        --background-tertiary: #0c0c0c !important;
        --background-accent: #242424 !important;
        --background-floating: black !important;
        --background-modifier-hover: rgba(255,255,255,0.01) !important;
        --background-modifier-active: rgba(255,255,255,0.03) !important;
        --background-modifier-selected: rgba(255,255,255,0.04) !important;
        --background-modifier-accent: hsla(0,0%,100%,0.06) !important;
        --channeltextarea-background: var(--background-accent) !important;
        --deprecated-card-bg: rgba(0, 0, 0, 0.2) !important;
        --deprecated-card-editable-bg: rgba(0,0,0,0.1) !important;
        --deprecated-text-input-border-disabled: var(--background-tertiary) !important;
        --activity-card-background: var(--background-primary) !important;
        --channels-default: #9f9f9f !important;
        --text-muted: #b6b6b6 !important;
        --text-normal: #fbfbfb !important;
        --interactive-normal: #c8c8c8 !important;
        --interactive-hover: #dcddde !important;
        --interactive-active: #fff !important;
        --interactive-muted: #747474 !important;
        --header-secondary: #c9c9c9 !important;
        --toast-background: var(--background-primary) !important;
        --toast-header: var(--background-tertiary) !important;
        --toast-contents: var(--background-secondary) !important;
        --toast-box-shadow: rgba(0, 0, 0, .2) !important;
        --toast-border: var(--background-tertiary) !important;
        --offline-color: rgb(60, 60, 60) !important;
    }`)
    }
})();
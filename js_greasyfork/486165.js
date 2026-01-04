// ==UserScript==
// @name         TradingView Theme Customizer
// @namespace    https://greasyfork.org/en/users/742563-666-999
// @version      1.21
// @description  Customize TradingView theme colors
// @author       666 999
// @match        https://www.tradingview.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486165/TradingView%20Theme%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/486165/TradingView%20Theme%20Customizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const COMMON_STYLES = `
    padding: 0;
    border: none;
    margin-top: none;
    width: 18px;
    height: 18px;
  `;

    GM_addStyle(`
    input[type="color"]::-webkit-color-swatch-wrapper {
      ${COMMON_STYLES}
    }

    input[type="color"]::-webkit-color-swatch,
    input[type="color"]::-moz-color-swatch {
      ${COMMON_STYLES}
    }


    /* this part is a total mess tbh, don't try making sense of it */


    .chart-page .chart-container-border {
        background-color: var(--tv-color-pane-background) !important;
    }


    /*watchlist background color*/
    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="symbol-"],
    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="separator-"]>[class*="innerWrapper-"],
    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="separator-"],
    [class*="scrollable-"]>[class*="tree-"]>[class*="listContainer-"],
    [class*="list-"]>[class*="wrap-"]>[class*="wrap-"]>[class*="tableHeader-"]>[class*="columnHeader-"],
    .widgetbar-page.active>[class*="widget-"]>[class*="widgetHeader-"],
    .widgetbar-widgetbody>[class*="wrap-"]>[class*="wrap-"]>[class*="tableHeader-"],
    .widgetbar-widgetbody>[class*="wrap-"]>[class*="wrap-"]>[class*="tableHeader-"]>span,
    .widgetbar-widgetbody>[class*="container-"]>[class*="wrapper-"],
    .widgetbar-widget,
    .widgetbar-widgetheader,
    .msg-window,
    .pc-data .pc-item.pinned,
    .widgetbar-widget>[class*="widgetHeader-"]>[class*="switcherWrapper-"],
    .widgetbar-widget>[class*="widgetHeader-"]>[class*="switcher-wrapper-"],
    .widgetbar-widgetbody>[class*="container-"]>[class*="headerContainer-"]>[class*="switcher-wrapper-"],
    [class*="space-"]>[class*="tree-"]>[class*="listContainer-"]>div>div>[class*="wrap-"],
    [class*="counterItem-"][class*="zero-"].apply-common-tooltip>[class*="indicator-"]>[class*="content-"],
    [class*="button-"][class*="disabled-"],
    [class*="button-"][class*="disabled-"]:active,
    [class*="button-"][class*="disabled-"]:before {
      background-color: var(--tv-custom-watchlist-color) !important;
    }


    /*watchlist hover highlight color*/
    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="symbol-"]:hover,
    [class*="space-"]>[class*="tree-"]>[class*="listContainer-"]>div>div>[class*="wrap-"]:hover {
      background-color: var(--tv-custom-watchlist-highlight-color) !important;
    }

    /*watchlist rows*/
    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="symbol-"] {
      border-bottom: 1px solid var(--tv-custom-watchlist-outline-color) !important;
      border-top: 1px solid var(--tv-custom-watchlist-outline-color) !important;
    }


    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="separator-"]:not([class*="separator-"][class*="firstItem-"]) {
      border-top: 1px solid var(--tv-custom-watchlist-outline-color) !important;
    }


    /*watchlist outline, corners*/
    .widgetbar-pages,
    .widgetbar-pages-no-tabs,
    [class*="footerPanel-"]>[class*="tabbar-"]>[class*="tabs-"],
    .layout__area--right {
      border-color: var(--tv-custom-watchlist-outline-color) !important;
    }

    /*bottom drawer line*/
    .widgetbar-wrap,
    .tv-messages>.msg-divider {
      background-color: var(--tv-custom-watchlist-highlight-color) !important;
    }

    /*watchlist bottom drawer line*/
    .widgetbar-page.active>[class*="widgetbar-widget"][class*="widget-"] {
      border-top-color: var(--tv-custom-watchlist-highlight-color) !important;
    }

    /*watchlist symbols text color, symbol title, header icons*/
    [class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="symbol-"] [class*="inner-"],
    [class*="headerButton-"][class*="button-"],
    .widgetbar-headerspace .button {
      color: var(--tv-custom-watchlist-text-color) !important;
    }


    /*watchlist selected symbol outline color + charts selected indicator border*/
    [class*="symbol-"]>[class*="indicators-"][class*="active-"]:after,
    [class*="selected-"] [class*="buttons-"],
    [class*="selected-"] [class*="buttons-"][class*="button-"]:not(:first-child),
    [class*="selected-"] [class*="buttonsWrapper-"],
    [class*="selected-"] [class*="titlesWrapper-"] {
      border-color: var(--tv-custom-watchlist-selection-color) !important;
    }


    /*layers selected color*/
    [class*="container-"].chart-data-window>[class*="wrapper-"]>[class*="container-"]>[class*="active-"] [class*="header-"],
    .widgetbar-widgetbody>[class*="wrap-"]>[class*="space-"]>[class*="tree-"]>[class*="listContainer-"]>div>div>[class*="wrap-"][class*="selected-"] {
      background-color: var(--tv-color-toolbar-button-text-active) !important;
    }


    /*alert outline color*/
    .widgetbar-widgetbody>[class*="container-"]>[class*="body-"]>div>[class*="list-"] div>[class*="itemBody-"][class*="focused-"],
    [data-name="alert-log-item"][class*="itemBody-"][class*="focused-"] {
      outline: 2px solid var(--tv-custom-watchlist-selection-color) !important;
    }


    /*alerts and layers>data hover color*/
    .widgetbar-widgetbody>[class*="container-"]>[class*="body-"]>[class*="wrapper-"]>[class*="list-"]>div>[class*="itemBody-"]:hover,
    [data-name="alert-log-item"][class*="itemBody-"]:hover,
    .widgetbar-widgetbody>[class*="container-"]>[class*="wrapper-"]>[class*="container-"]>[class*="view-"][class*="hoverEnable-"]:hover {
      background: var(--tv-color-platform-background) !important;
    }


    /*ideas and stream ideas and stream hover color*/
    .tv-notes-widget__data>.tv-notes-widget__note-block:hover,
    .tv-notifications-widget-item:hover,
    [class*="stream-list-"][class*="scroll-"]>div>.responsive-container-media-mf-phone-vertical.responsive-container-base>[class*="card-"]:hover {
      background-color: var(--tv-color-platform-background) !important;
    }

    .tv-notes-widget__note-block:hover .desc:after {
      background: var(--tv-color-platform-background) !important;
    }


    .tv-notes-widget__note-block .desc:after {
      background: var(--tv-color-pane-background) !important;
    }


    /*selected layer bg color*/
    [class*="space-"]>[class*="tree-"]>[class*="listContainer-"]>div>div>[class*="wrap-"][class*="selected-"],
    {
    background-color: var(--tv-custom-watchlist-selection-color) !important;
    }


    /*templates hover*/

    #header-toolbar-study-templates>[class*="item-"]:hover:before {
      content: '';
      /* Required for pseudo-elements */
      width: 28px;
      /* Set the width of the circle */
      height: 28px;
      /* Set the height of the circle */
      border-radius: 50%;
      /* Make the circle round */
      background-color: var(--tv-custom-template-hover-color);
      /* Set the background color to the filled color */
      z-index: -1;
      /* Ensure the circle is behind the content */
    }

    #header-toolbar-study-templates>[class*="item-"]:hover:after {
      position: absolute;
      content: '';
      /* Required for pseudo-elements */
      width: 20px;
      /* Set the width of the inner circle */
      height: 20px;
      /* Set the height of the inner circle */
      border-radius: 50%;
      /* Make the inner circle round */
      border: 1px solid var(--tv-color-toolbar-button-text-hover);
      /* Set the border properties to create an outline */
      background-color: transparent;
      mix-blend-mode: normal;
      z-index: 1;
      /* Ensure the inner circle is above the filled circle */
    }


    #header-toolbar-study-templates>[class*="item-"]:hover {
      z-index: 1;
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /*left toolbar hover arrows*/
    [class*="control-"] [class*="arrow-"] {
      color: var(--tv-color-toolbar-button-text) !important;
    }

    [class*="control-"] [class*="arrow-"]:hover {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }

    [class*="isOpened-"] [class*="control-"] [class*="arrow-"] {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /*watch and hot lists hover*/
    [data-name="watchlists-button"]:hover:not([class*="isOpened"]),
    .widgetbar-widget-hotlist>[class*="widgetHeader-"]>[class*="button-"]:hover:not([class*="isOpened"]) {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /*fav toolbar button hover*/
    .tv-favorited-drawings-toolbar__widget.apply-common-tooltip:hover {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /*hotlist button hover and some others?*/
    .widgetbar-headerspace .button:hover {
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
    }

    .widgetbar-headerspace .button:hover:not(:active):not(.active) {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /*fav toolbar clicked*/
    [class*="theme-"] .tv-favorited-drawings-toolbar__widget:active {
      color: var(--tv-color-toolbar-button-text-clicked) !important;
    }


    /*some widgetbar button hover color */
    [class*="headerButton-"][class*="button-"]:hover:not(:active) {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }

    /*global button clicked color*/
    [class*="button-"][class*="isInteractive-"][class*="isOpened-"],
    [class*="button-"]:active,
    [class*="button-"][class*="isOpened-"],
    .widgetbar-headerspace .button:hover,
    #header-toolbar-study-templates>[class*="item-"]:active {
      color: var(--tv-color-toolbar-button-text-clicked) !important;
    }

    #header-toolbar-study-templates>[class*="item-"]:active:after {
      border: 1px solid var(--tv-color-toolbar-button-text-clicked);
    }


    /* chat @ toggle */
    .widgetbar-headerspace .button.active {
      color: var(--tv-color-toolbar-button-text-clicked) !important;
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
    }


    /*watchlist columns & groups names*/
    .widgetbar-widgetbody>[class*="wrap-"]>[class*="wrap-"]>[class*="tableHeader-"]>[class*="columnHeader-"][class*="symbolName-"]>[class*="label-"],
    [class*="wrap-"]>[class*="content-"]>[class*="scrollable-"]>[class*="tree-"]>[class*="listContainer-"]>div>div>[class*="wrap-"]>[class*="separator-"]>[class*="innerWrapper-"]>[class*="label-"] {
      mix-blend-mode: exclusion;
      color: #888 !important;
    }


    /*bg of settings, symbols, indicators, alerts*/
    [data-dialog-name="Symbol Search"]>[class*="wrap-"][class*="small-"][class*="newStyles-"],
    [data-dialog-name="Chart settings"],
    [data-name="globalSearch"],
    [class*="replayWrapper-"],
    [data-outside-boundary-for="watchlist-symbol-search-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="wrap-"][class*="small-"],
    [class*="dialog-"] {
      background-color: var(--tv-color-pane-background) !important;
    }


    [class*="itemRow-"]:hover [class*="cell-"] {
      background-color: var(--tv-color-platform-background) !important;
    }

    [class*="itemRow-"]:hover [class*="cell-"][class*="highlighted-"] {
      background-color: var(--tv-color-platform-background) !important;
    }


    /*symbols bubbles bg color*/
    [class*="bubble-"][class*="appearance-default-"]:not([class*="bubble-"][class*="appearance-default-"][class*="active-"][class*="bubble-"]) {
      background-color: var(--tv-color-platform-background) !important;
    }

    /*symbols footnote bg color, currencies search header*/
    [data-outside-boundary-for="symbol-search-items-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="footer-"],
    [data-outside-boundary-for="watchlist-symbol-search-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="footer-"],
    [data-name="menu-inner"]>[class*="header-"] {
      background-color: var(--tv-color-popup-background) !important;
    }


    [data-name="menu-inner"]>[class*="action-"][class*="active-"] {
        background-color: var(--tv-color-toolbar-button-text-active) !important;
    }


    [data-name="menu-inner"]>[class*="action-"][class*="active-"]>[class*="labelAndDescription-"]>[class*="label-"] {
        color: var(--tv-color-popup-element-text-active) !important;
    }


    /*active settings/indicators tab*/
    [data-outside-boundary-for="series-properties-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="content-"]>[class*="container-"]>[class*="accessible-"][class*="active-"],
    [data-outside-boundary-for="indicators-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="wrapper-"]>[class*="container-"]>[class*="tab-"][class*="active-"] {
      background-color: var(--tv-color-toolbar-button-text-active) !important;
    }

    /*active settings/indicators tab text*/
    [data-outside-boundary-for="series-properties-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="content-"]>[class*="container-"]>[class*="accessible-"][class*="active-"] [class*="title-"],
    [data-outside-boundary-for="series-properties-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="content-"]>[class*="container-"]>[class*="accessible-"][class*="active-"] [class*="icon-"],
    [data-outside-boundary-for="indicators-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="wrapper-"]>[class*="container-"]>[class*="tab-"][class*="active-"] [class*="title-"],
    [data-outside-boundary-for="indicators-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="wrapper-"]>[class*="container-"]>[class*="tab-"][class*="active-"] [class*="icon-"] {
      color: var(--tv-color-toolbar-button-text-clicked) !important;
    }


    /*settings/indicators tab hover*/
    [data-outside-boundary-for="series-properties-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="content-"]>[class*="container-"]>[class*="accessible-"]:hover:not([class*="active-"]),
    [data-outside-boundary-for="indicators-dialog"]>[class*="dialog-"]>[class*="wrapper-"]>[class*="wrapper-"]>[class*="container-"]>[class*="tab-"]:hover:not([class*="active-"]) {
      color: var(--tv-color-toolbar-button-text-hover) !important;
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
    }


    /* save indicator template */
    [class*="autocomplete-"]>[class*="suggestions-"] {
      background-color: var(--tv-color-pane-background) !important;
    }

    [class*="autocomplete-"]>[class*="suggestions-"] [class*="suggestion-"]:hover {
      color: var(--tv-color-toolbar-button-text-hover) !important;
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
    }

    [class*="autocomplete-"]>[class*="suggestions-"] [class*="suggestion-"]:hover {
      color: var(--tv-color-toolbar-button-text-hover) !important;
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
    }

    [class*="autocomplete-"]>[class*="suggestions-"] [class*="suggestion-"][class*="selected-"] {
      color: var(--tv-color-toolbar-button-text-clicked) !important;
      background-color: var(--tv-color-toolbar-button-text-active) !important;
    }


    /*chart indicator tilte*/
    [class*="chart-widget__top"] [class*="selected-"] [class*="titlesWrapper-"],
    [class*="chart-widget__top"] [class*="selected-"] [class*="buttons-"],
    [class*="chart-widget__top"] [class*="withAction-"] [class*="titlesWrapper-"],
    [class*="chart-widget__top"] [class*="withAction-"] [class*="buttons-"] {
      background-color: var(--tv-color-toolbar-save-layout-loader) !important;
    }

    [class*="chart-widget__top"] [class*="button-"]:hover:after {
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
    }

    [class*="chart-widget__top"] [class*="buttonIcon-"]:hover {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }

    [class*="chart-widget__top"] [class*="buttonIcon-"]:hover:after {
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /*switcher button*/

    [class*="light-tab-button"][class*="selected-"] {
      background-color: var(--tv-color-pane-background) !important;
    }


    [class*="light-tabs-"],
    [class*="light-tab-button"] {
      background-color: var(--tv-color-toolbar-save-layout-loader) !important;
    }


    [class*="light-tab-button"]:hover:not([class*="light-tab-button"][class*="selected-"]) {
      background-color: var(--tv-color-toolbar-button-text) !important;
    }


    /* publish button hover */
    .publish-chart-button[class*="button-"] [class*="bg-"]:hover {
      background-color: var(--tv-color-toolbar-button-background-hover) !important;
      color: var(--tv-color-toolbar-button-text-hover) !important;
    }


    /* chat highlight hover */
    .ch-highlight-user:hover,
    .ch-is-author:hover,
    .ch-item:hover,
    .msg-data .msg-item:hover:not(.msg-data .msg-item.active) {
      background: var(--tv-color-platform-background) !important;
    }

    /* pub chat separator */
    [class*="chat-wrapper-"]>[class*="widget-"]>[class*="split-widget-"]>[class*="divider-"] {
      border-color: var(--tv-color-platform-background) !important;
    }

    /* chat active */
    .pc-data .pc-item.active {
      background: var(--tv-color-toolbar-button-text-active) !important;
    }


    [data-outside-boundary-for="go-to-date-dialog"]>[class*="dialog-"],
    [class*="calendar-"] {
      background-color: var(--tv-color-pane-background) !important;
    }

    [class*="calendar-"]>[class*="sub-header-"] {
      background-color: var(--tv-color-platform-background) !important;
    }


    /* Animation for menu extension */
    #themeMenu {
      transition: width 0.1s linear;
    }
  `);

    const MENU_WIDTH_EXTENDED = '574px';
    const MENU_WIDTH_COLLAPSED = '220px';
    const BUY_COFFEE_WIDTH = '424px';

    const COLOR_GROUPS = {
        color1: [
            '--tv-color-pane-background',
            '--tv-color-toolbar-divider-background',
            '--tv-color-popup-element-divider-background',
            '--tv-custom-watchlist-color',
            '--tv-alerts-widget-list-item-background',
            '--counter-indicator-background-color',
        ],
        color2: [
            '--tv-color-toolbar-save-layout-loader',
            '--tv-color-popup-background',
            '--tv-color-popup-element-toolbox-background-hover',
        ],
        color3: [
            '--tv-color-platform-background',
            '--tv-custom-watchlist-highlight-color',
            '--tv-custom-watchlist-outline-color',
                ],
        color4: [
            '--tv-color-toolbar-button-text',
            '--tv-color-popup-element-text',
            '--tv-color-popup-element-toolbox-text',
            '--tv-custom-watchlist-text-color',
        ],
        color5: [
            '--tv-color-toolbar-button-text-hover',
            '--tv-custom-watchlist-outline-color2',
            '--tv-color-popup-element-text-hover',
            '--tv-color-popup-element-secondary-text',
            '--tv-color-popup-element-hint-text',
            '--tv-color-popup-element-toolbox-text-hover',
            '--tv-color-popup-element-toolbox-text-active-hover',
        ],
        color6: [
            '--tv-color-toolbar-button-background-hover',
            '--tv-color-toolbar-button-background-expanded',
            '--tv-color-toolbar-button-background-active-hover',
            '--tv-color-popup-element-background-hover',
            '--tv-custom-watchlist-hover-bgcolor',
            '--tv-custom-template-hover-color',
        ],
        color7: [
            '--tv-color-item-active-text',
            '--tv-color-popup-element-text-active',
            '--tv-color-toolbar-button-text-clicked', // new
        ],
        color8: [
            '--tv-custom-watchlist-selection-color',
            '--tv-color-toolbar-button-text-active',
            '--tv-color-toolbar-button-text-active-hover',
            '--tv-color-toolbar-toggle-button-background-active',
            '--tv-color-popup-element-background-active',
            '--control-button-color-content',
        ],
        color9: [
            '--tv-color-toolbar-toggle-button-background-active-hover',
            '--tv-color-popup-element-toolbox-background-active-hover',
        ],
        color10: ['--tv-color-toolbar-button-background-active'],
        //new ones, WIP
        /*color11: [
                 //'--tv-color-toolbar-button-background',
                 //'--tv-color-toolbar-button-text-clicked',
                 //'--tv-color-toolbar-button-background-clicked'
        ],*/
    };

    const TITLES = {
        color1: 'Pane',
        color2: 'Favorites Toolbar & Menu',
        color3: 'Background & Symbol Highlight',
        color4: 'Buttons & Symbol Names',
        color5: 'Button Hover',
        color6: 'Button Hover Background',
        color7: 'Active Item Name / Button Click',
        color8: 'Active Button / Item',
        color9: 'Active Bottom Button Hover',
        color10: 'Active Button Of Right Panel',
    };

    const DEFAULT_COLORS = {
        color1: '#2e2f37', color2: '#321a24', color3: '#1b1c24', color4: '#da8bb1', color5: '#ff0000',
        color6: '#f48fb1', color7: '#000000', color8: '#cc285f', color9: '#4dd0e1', color10: '#1b1c24',
    };

    // tradingview's pink theme
    const PRESET_COLORS_2 = {
        color1: '#fbdff4', color2: '#868993', color3: '#d1c4e9', color4: '#88184f', color5: '#4a148c',
        color6: '#f48fb1', color7: '#0606ff', color8: '#ff0000', color9: '#ff00ff', color10: '#f9b9e9',
    };

    const PRESET_COLORS_3 = {
        color1: '#000000', color2: '#1c1c1c', color3: '#003338', color4: '#17bee8', color5: '#24f07c',
        color6: '#000000', color7: '#000000', color8: '#ff8838', color9: '#941600', color10: '#000000',
    };

    // Initialize savedColors with stored settings or DEFAULT_COLORS
    const savedColors = GM_getValue('customColors') || { ...DEFAULT_COLORS };

    // Helper Function: Copy Text to Clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to display a right-top speech balloon
    function displayBalloon(menu, message) {
        // Remove existing balloon if present
        const existingBalloon = document.getElementById('balloon');
        if (existingBalloon) {
            menu.removeChild(existingBalloon);
        }

        // Create a balloon container
        const balloon = document.createElement('div');
        balloon.id = 'balloon';
        balloon.style.position = 'absolute';
        balloon.style.top = '74px';
        balloon.style.right = '30%';
        balloon.style.zIndex = '1002';

        // Create the balloon content
        const content = document.createElement('div');
        content.textContent = message;
        content.style.background = 'darkgrey';
        content.style.color = '#222';
        content.style.padding = '10px';
        content.style.borderRadius = '5px';

        // Append the content to the balloon container
        balloon.appendChild(content);

        // Create a tail element using ::before pseudo-element
        const tail = document.createElement('div');
        tail.id = 'tail';
        tail.style.position = 'absolute';
        tail.style.borderStyle = 'solid';
        tail.style.borderWidth = '10px';
        tail.style.borderColor = 'transparent transparent transparent darkgrey';
        tail.style.top = '23.5%';
        tail.style.left = '100%';

        balloon.appendChild(tail);

        // Append the balloon to the menu container
        menu.appendChild(balloon);

        // Hide the balloon after a short delay (e.g., 1.5 seconds)
        setTimeout(() => {
            menu.removeChild(balloon);
        }, 1500);
    }

    // Add a variable to store the menu position
    let menuPosition = { top: '95px', left: '56px' };
    // Helper Function: Make Menu Movable
    function makeMovable(menu, applyThemeMenuStyles) {
        let isDragging = false;
        let offsetX, offsetY;

        menu.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - menu.getBoundingClientRect().left;
            offsetY = event.clientY - menu.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                menu.style.left = event.clientX - offsetX + 'px';
                menu.style.top = event.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                // Update the menu position when dragging stops
                menuPosition = { top: menu.style.top, left: menu.style.left };
            }
            isDragging = false;
        });
    }

    // Helper Function: Apply Colors to Theme
    function applyColors() {
        Object.entries(COLOR_GROUPS).forEach(([group, properties]) => {
            properties.forEach((property) => {
                document.documentElement.style.setProperty(property, savedColors[group] || DEFAULT_COLORS[group]);
            });
        });
    }

    // Helper Function: Apply Theme Menu Styles
    function applyThemeMenuStyles(menu, isExtended) {
        const menuWidth = isExtended ? MENU_WIDTH_EXTENDED : MENU_WIDTH_COLLAPSED;
        menu.style.width = menuWidth;
        menu.style.overflow = 'hidden';
        menu.style.position = 'fixed';
        // Update menu position directly
        menu.style.top = menuPosition.top;
        menu.style.left = menuPosition.left;
        menu.style.padding = '10px';
        menu.style.color = savedColors.color4 || DEFAULT_COLORS.color4;
        menu.style.background = savedColors.color2 || DEFAULT_COLORS.color2;
        menu.style.border = `1px solid ${savedColors.color8 || DEFAULT_COLORS.color8}`;
        menu.style.zIndex = '1000';
        menu.style.display = 'flex';
        menu.style.flexDirection = 'column';
        menu.style.borderRadius = '5px';

        // Make the menu movable
        makeMovable(menu);

        // "Buy me a coffee" section
        const hiddenPart = document.createElement('div');
        hiddenPart.style.width = BUY_COFFEE_WIDTH;
        hiddenPart.style.overflow = 'hidden';
        hiddenPart.style.position = 'absolute';
        hiddenPart.style.top = '0';
        hiddenPart.style.right = `-${BUY_COFFEE_WIDTH}`;
        hiddenPart.style.left = '220px';
        hiddenPart.style.background = savedColors.color2 || DEFAULT_COLORS.color2;
        hiddenPart.style.color = savedColors.color4 || DEFAULT_COLORS.color4;

        const buyCoffeeText = document.createElement('p');
        buyCoffeeText.style.fontFamily = 'Consolas, monospace';
        buyCoffeeText.style.fontSize = '14px';
        buyCoffeeText.innerHTML = '<span style="font-size: 12px;">Consider support or buying me coffee</span>\
        <br><br>\
        /\\_____/\\<br>\
        /&nbsp;&nbsp;o&nbsp;&nbsp;&nbsp;o&nbsp;&nbsp;\\<br>\
        (&nbsp;==&nbsp;&nbsp;^&nbsp;&nbsp;==&nbsp;)<br>\
        )&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<br>\
        (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)<br>\
        (&nbsp;(&nbsp;&nbsp;)&nbsp;&nbsp;&nbsp;(&nbsp;&nbsp;)&nbsp;)<br>\
        (__(__)___(__)__)<br>\
        ';
        buyCoffeeText.style.padding = '7px';
        buyCoffeeText.style.textAlign = 'center';

        const trc20Text = document.createElement('span');
        trc20Text.style.fontSize = '11px';
        trc20Text.innerHTML = 'TRON (TRC10, TRC20 tokens):<br>';

        const trc20Address = document.createElement('span');
        trc20Address.textContent = 'TSvizdjmrtXjYEEcUDzbvwLSLEbAJYXARA';
        trc20Address.style.cursor = 'pointer';
        trc20Address.addEventListener('click', function () {
            copyToClipboard(trc20Address.textContent);
            displayBalloon(menu, 'TRON address copied to clipboard');
        });

        const ethText = document.createElement('span');
        ethText.style.fontSize = '11px';
        ethText.innerHTML = '<br>EVM (Arbitrum, Optimism, Polygon, BSC, etc.):<br>';

        const ethAddress = document.createElement('span');
        ethAddress.textContent = '0x32Cc052782E3A42Fcb25D7242E2FA5F8B0c3583B';
        ethAddress.style.cursor = 'pointer';
        ethAddress.addEventListener('click', function () {
            copyToClipboard(ethAddress.textContent);
            displayBalloon(menu, 'EVM address copied to clipboard');
        });

        const advText = document.createElement('span');
        advText.style.fontSize = '11px';
        advText.innerHTML = '<br> ';
        advText.style.marginRight = '0px';

        const advAddress = document.createElement('span');
        advAddress.textContent = '';
        advAddress.style.cursor = 'pointer';
        advAddress.addEventListener('click', function () {
            copyToClipboard(advAddress.textContent);
            displayBalloon(menu, ' address copied to clipboard');
        });

        buyCoffeeText.appendChild(trc20Text); trc20Text.appendChild(trc20Address);
        buyCoffeeText.appendChild(ethText); ethText.appendChild(ethAddress);
        buyCoffeeText.appendChild(advText); advText.appendChild(advAddress);
        hiddenPart.appendChild(buyCoffeeText);
        menu.appendChild(hiddenPart);
    }

    // Helper Function: Toggle Menu Extension
    function toggleMenuExtension(menu, hiddenPart) {
        const isExtended = menu.style.width === MENU_WIDTH_EXTENDED;
        applyThemeMenuStyles(menu, !isExtended);

        const newRightPosition = isExtended ? `-${BUY_COFFEE_WIDTH}` : '0';
        hiddenPart.style.right = newRightPosition;
    }

    // Helper Function: Update Theme Styles without Affecting Menu Extension
    function updateThemeStyles(menu) {
        const menuWidth = menu.style.width;
        applyThemeMenuStyles(menu);
        menu.style.width = menuWidth;
    }

    // Helper Function: Create Button Element
    function createButton(text, width, gridColumn, gridRow, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.width = width;
        button.style.gridColumn = gridColumn;
        button.style.gridRow = gridRow;
        button.style.backgroundColor = 'dimgrey';
        button.style.border = 'none';
        button.style.borderRadius = '2px';
        button.style.height = '25px';
        button.addEventListener('click', clickHandler);
        return button;
    }

    // Main Function: Open Theme Menu
    function openThemeMenu() {
        const existingMenu = document.getElementById('themeMenu');

        // If the menu is already open, close it
        if (existingMenu) {
            document.body.removeChild(existingMenu);
            return;
        }

        // If the menu is not open, create and open it
        const menu = document.createElement('div');
        menu.id = 'themeMenu';
        applyThemeMenuStyles(menu);

        // Add a small button at the top right corner
        const toggleButton = createButton('☕', '32px', 'auto', 'auto', function () {
            toggleMenuExtension(menu);
        });
        toggleButton.style.position = 'absolute';
        toggleButton.style.top = '5px';
        toggleButton.style.right = '1px';
        toggleButton.style.background = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.padding = '0';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.zIndex = '1001';
        menu.appendChild(toggleButton);

        Object.entries(COLOR_GROUPS).forEach(([group, properties]) => {
            const option = document.createElement('div');
            option.style.display = 'flex';
            option.style.marginBottom = '4px';

            const label = document.createElement('label');
            label.textContent = `- ${TITLES[group]}`;
            label.style.marginRight = '4px';
            label.style.fontFamily = 'Calibri';
            label.style.fontSize = '14px';

            const colorPicker = document.createElement('input');
            colorPicker.type = 'color';
            colorPicker.value = savedColors[group] || DEFAULT_COLORS[group];
            colorPicker.style = COMMON_STYLES;
            colorPicker.setAttribute('data-group', group);
            colorPicker.addEventListener('input', function () {
                savedColors[group] = this.value;
                applyColors();
                updateThemeStyles(menu);
            });

            option.appendChild(colorPicker);
            option.appendChild(label);
            menu.appendChild(option);
        });
        const updateColorPickers = function () {
            Object.entries(COLOR_GROUPS).forEach(([group, properties]) => {
                const colorPicker = document.querySelector(`input[type="color"][data-group="${group}"]`);
                if (colorPicker) {
                    colorPicker.value = savedColors[group] || DEFAULT_COLORS[group];
                }
            });
        };

        // Flex container for importExportLabel and importExportInput
        const flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.flexDirection = 'column';
        flexContainer.style.marginBottom = '4px';

        const importExportInput = document.createElement('input');
        importExportInput.type = 'text';
        importExportInput.placeholder = 'theme settings here';
        importExportInput.style.border = '1px solid darkgrey';
        importExportInput.style.padding = '3px';
        importExportInput.style.background = 'darkgrey';
        importExportInput.style.color = '#222';
        importExportInput.style.borderRadius = '2px';
        importExportInput.style.fontFamily = 'Consolas';
        importExportInput.style.fontSize = '13px';
        importExportInput.style.zIndex = '1000';

        // Import/Export Section
        const importExportSection = document.createElement('div');
        importExportSection.style.display = 'grid';
        importExportSection.style.gridTemplateColumns = 'repeat(5, 1fr)';
        importExportSection.style.gridGap = '2px';
        importExportSection.style.marginBottom = '4px';

        const importButton = createButton('Import', '120px', '1 / span 1', '1', function () {
            const importedColors = importExportInput.value.trim();
            if (!importedColors) {
                // If the input field is empty
                displayBalloon(menu, 'Put settings in the field');
                return;
            }

            const importedArray = importedColors.split(/[\s-]+/);

            if (importedArray.length !== Object.keys(COLOR_GROUPS).length) {
                // If the input has incorrect number of color values
                displayBalloon(menu, 'Incorrect input');
                return;
            }

            // Check if all values are valid hex color codes
            const isValidHex = importedArray.every(color => /^#[0-9A-F]{6}$/i.test(color));

            if (isValidHex) {
                Object.keys(COLOR_GROUPS).forEach((group, index) => {
                    savedColors[group] = importedArray[index] || DEFAULT_COLORS[group];
                });
                applyColors();
                updateThemeStyles(menu);
                updateColorPickers();
                displayBalloon(menu, 'Theme imported');
            } else {
                // If any color value is not a valid hex code
                displayBalloon(menu, 'Incorrect input');
            }
        });

        // Import/Export Section: Export Button
        const exportButton = createButton('Export', '120px', '1 / span 1', '2', function () {
            const exportedColors = Object.keys(COLOR_GROUPS)
            .map((group) => savedColors[group] || DEFAULT_COLORS[group])
            .join(' ');
            importExportInput.value = exportedColors;
            copyToClipboard(exportedColors);
            // Show "Copied to clipboard" balloon
            displayBalloon(menu, 'Settings copied to clipboard');
        });

        // Save Button
        const saveButton = createButton('Save', '120px', '1 / span 1', '3', function () {
            GM_setValue('customColors', savedColors);
            applyColors();
            //document.body.removeChild(menu);
            // Show "Copied to clipboard" balloon
            displayBalloon(menu, 'Theme saved');
        });

        menu.appendChild(flexContainer);
        flexContainer.appendChild(importExportInput);
        menu.appendChild(importExportSection);
        importExportSection.appendChild(importButton);
        importExportSection.appendChild(exportButton);

        // Empty column
        const importExportEmptyColumn = document.createElement('label');
        importExportEmptyColumn.style.gridColumn = '2 / span 1';
        importExportEmptyColumn.style.minWidth = '146px';
        importExportSection.appendChild(importExportEmptyColumn);

        // Preset Buttons - Save
        for (let i = 1; i <= 3; i++) {
            const saveCustomButton = createButton(`💾 Custom ${i}`, '100px', `${i + 2} / span 1`, '1', function () {
                savePreset(i);
                displayBalloon(menu, `Preset saved as Custom ${i}`);
            });
            importExportSection.appendChild(saveCustomButton);
        }

        // Preset Buttons - Load
        for (let i = 1; i <= 3; i++) {
            const loadCustomButton = createButton(`🔼 Custom ${i}`, '100px', `${i + 2} / span 1`, '2', function () {
                loadPreset(i);
                displayBalloon(menu, `Custom preset ${i} loaded`);
            });
            importExportSection.appendChild(loadCustomButton);
        }

        // Preset Buttons - Presets
        const presets = [
            { label: '🔼 Preset 1', width: '100px', gridColumn: '3 / span 1', gridRow: '3', colors: DEFAULT_COLORS },
            { label: '🔼 Preset 2', width: '100px', gridColumn: '4 / span 1', gridRow: '3', colors: PRESET_COLORS_2 },
            { label: '🔼 Preset 3', width: '100px', gridColumn: '5 / span 1', gridRow: '3', colors: PRESET_COLORS_3 },
        ];

        presets.forEach((preset) => {
            const presetButton = createButton(preset.label, preset.width, preset.gridColumn, preset.gridRow, function () {
                Object.keys(COLOR_GROUPS).forEach((group) => {
                    savedColors[group] = preset.colors[group];
                });
                applyColors();
                updateThemeStyles(menu);
                updateColorPickers();
                displayBalloon(menu, `${preset.label.substring(2)} loaded`);
            });
            importExportSection.appendChild(presetButton);
        });

        // Helper Function: Save Preset
        function savePreset(presetNumber) {
            const presetKey = `customPreset${presetNumber}`;
            GM_setValue(presetKey, savedColors);
        }

        // Helper Function: Load Preset
        function loadPreset(presetNumber) {
            const presetKey = `customPreset${presetNumber}`;
            const presetColors = GM_getValue(presetKey);
            Object.keys(COLOR_GROUPS).forEach((group) => {
                savedColors[group] = presetColors[group];
            });
            applyColors();
            updateThemeStyles(menu);
            updateColorPickers();
        }
        // Create a new paragraph element
        const paragraph = document.createElement('p');

        // Set the text content of the paragraph
        paragraph.innerHTML = 'TradingView<br>Theme<br>Customizer<br><br>v1.21';

        // Style the paragraph if needed
        paragraph.style.fontFamily = 'Consolas';
        paragraph.style.fontSize = '13px';
        paragraph.style.color = savedColors.color4 || DEFAULT_COLORS.color4;
        paragraph.style.position = 'absolute';
        paragraph.style.bottom = '16px';
        paragraph.style.left = '140px';

        // Append the paragraph to the menu
        menu.appendChild(paragraph);

        importExportSection.appendChild(saveButton);
        document.body.appendChild(menu);
    }

    // Helper Function: Add Theme Button
    function addThemeButton() {
        const button = document.createElement('button');
        button.style.position = 'fixed';
        button.style.top = '5px';
        button.style.left = '12px';
        button.style.background = 'transparent';
        button.style.padding = '0';
        button.style.cursor = 'pointer';
        button.style.borderLeft = `5px solid ${savedColors.color4 || DEFAULT_COLORS.color4}`;
        button.style.borderTop = `5px solid ${savedColors.color4 || DEFAULT_COLORS.color4}`;
        button.style.borderRight = '5px solid transparent';
        button.style.borderBottom = '5px solid transparent';

        // Hover styles
        button.addEventListener('mouseover', function () {
            button.style.borderLeft = `5px solid ${savedColors.color5 || DEFAULT_COLORS.color5}`;
            button.style.borderTop = `5px solid ${savedColors.color5 || DEFAULT_COLORS.color5}`;
        });

        button.addEventListener('mouseout', function () {
            button.style.borderLeft = `5px solid ${savedColors.color4 || DEFAULT_COLORS.color4}`;
            button.style.borderTop = `5px solid ${savedColors.color4 || DEFAULT_COLORS.color4}`;
        });

        button.addEventListener('click', openThemeMenu);
        document.body.appendChild(button);
    }

    // Main Execution
    applyColors();
    addThemeButton();
})();

// ==UserScript==
// @name         INRTU Moodle Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       DreamCutter
// @match        https://el.istu.edu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=istu.edu
// @require      https://cdn.jsdelivr.net/npm/darkreader@4.9.58/darkreader.min.js
// @license      GPL-3.0-or-later
// @run-at       document-body
// @description Предложения/идеи можете присылать сюда: https://vk.com/dreamcutter
// @downloadURL https://update.greasyfork.org/scripts/464884/INRTU%20Moodle%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/464884/INRTU%20Moodle%20Theme.meta.js
// ==/UserScript==

// Theme settings
const themes = {
    moodleDefault: {
        name: 'Оригинальный Moodle',
        darkReaderSettings: {
            mode: 'off'
        },
        colors: {
            primary: null,
            background: null,
            border: null,
            text: null
        }
    },
    default: {
        name: 'Тёмная (dark reader)',
        darkReaderSettings: {
            brightness: 100,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: 'rgb(12, 90, 154)',
            background: 'rgb(30, 32, 33)',
            border: '#0A487B',
            text: '#ffffff'
        }
    },
    catppuccinLatte: {
        name: 'Catppuccin Latte',
        darkReaderSettings: {
            brightness: 110,
            contrast: 95,
            sepia: 10,
            mode: 'light'
        },
        colors: {
            primary: '#8839ef',
            background: '#eff1f5',
            border: '#ccd0da',
            text: '#4c4f69'
        }
    },
    catppuccinFrappe: {
        name: 'Catppuccin Frappé',
        darkReaderSettings: {
            brightness: 100,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: '#ca9ee6',
            background: '#303446',
            border: '#51576d',
            text: '#c6d0f5'
        }
    },
    catppuccinMacchiato: {
        name: 'Catppuccin Macchiato',
        darkReaderSettings: {
            brightness: 100,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: '#c6a0f6',
            background: '#24273a',
            border: '#494d64',
            text: '#cad3f5'
        }
    },
    catppuccinMocha: {
        name: 'Catppuccin Mocha',
        darkReaderSettings: {
            brightness: 95,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: '#cba6f7',
            background: '#1e1e2e',
            border: '#45475a',
            text: '#cdd6f4'
        }
    },
    nord: {
        name: 'Nord',
        darkReaderSettings: {
            brightness: 100,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: '#88c0d0',
            background: '#2e3440',
            border: '#4c566a',
            text: '#eceff4'
        }
    },
    tokyoNight: {
        name: 'Tokyo Night',
        darkReaderSettings: {
            brightness: 100,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: '#7aa2f7',
            background: '#1a1b26',
            border: '#3b4261',
            text: '#c0caf5'
        }
    },
    dracula: {
        name: 'Dracula',
        darkReaderSettings: {
            brightness: 100,
            contrast: 100,
            sepia: 0
        },
        colors: {
            primary: '#bd93f9',
            background: '#282a36',
            border: '#44475a',
            text: '#f8f8f2'
        }
    }
};

// Get saved theme or use default theme
const savedTheme = localStorage.getItem('istuMoodleTheme') || 'default';
const currentTheme = themes[savedTheme];

// Define elements that can be hidden
const clutterElements = {
    'useless-links': {
        name: 'Полезные (нет) ссылки',
        selector: 'section#inst3040',
        checked: true
    },
    'page-header': {
        name: 'Хедер на главной странице',
        selector: '#page-header',
        checked: true
    },
    'all-courses': {
        name: 'Раздел "Все курсы"',
        selector: '.paging.paging-morelink',
        checked: true
    },
    'site-news': {
        name: 'Новости сайта',
        selector: '#site-news-forum',
        checked: true
    },
    'course-search': {
        name: 'Поиск курса',
        selector: '.box.py-3.mdl-align',
        checked: true
    },
    'empty-gap': {
        name: 'Отступ перед "Мои курсы"',
        selector: '.box.py-3.generalbox.sitetopic',
        checked: true
    },
    'course-application': {
        name: 'Заявка на создание курса',
        selector: 'section#inst65965',
        checked: true
    },
    'last-announcements': {
        name: 'Последние объявления',
        selector: 'section#inst2185',
        checked: true
    },
    'course-images': {
        name: 'Изображения курсов',
        selector: '.courseimage',
        checked: true
    },
    'hide-teachers': {
        name: 'Скрывать преподавателей (>3)',
        selector: '.teachers',
        checked: true
    },
};

function getClutterSettings() {
    const savedSettings = localStorage.getItem('istuMoodleClutterSettings');
    if (savedSettings) {
        return JSON.parse(savedSettings);
    } else {
        return clutterElements;
    }
}

function saveClutterSettings(settings) {
    localStorage.setItem('istuMoodleClutterSettings', JSON.stringify(settings));
}

function applyTheme() {
    if (savedTheme === 'moodleDefault') {
        DarkReader.disable();
        return;
    }

    // Apply DarkReader settings depending on the theme
    if (currentTheme.darkReaderSettings.mode === 'light') {
        DarkReader.disable();
        // Apply light theme manually
        document.documentElement.style.setProperty('--background-color', currentTheme.colors.background);
        document.documentElement.style.setProperty('--text-color', currentTheme.colors.text);
    } else {
        // Apply dark theme via DarkReader
        DarkReader.enable(currentTheme.darkReaderSettings);
    }

    // Add custom styles if original theme is not selected
    if (savedTheme !== 'moodleDefault') {
        addCustomStyles();
    }

    // Hide interface elements based on user settings
    applyClutterSettings();
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function addCustomStyles() {
    addGlobalStyle(`
        :root {
            --primary-color: ${currentTheme.colors.primary};
            --background-color: ${currentTheme.colors.background};
            --border-color: ${currentTheme.colors.border};
            --text-color: ${currentTheme.colors.text || '#ffffff'};
        }
    `);

    addGlobalStyle(`
        /* Main page elements */
        body {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        #page-content, #region-main, .region-main-content {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        .bg-dark, footer#page-footer {
            background-color: var(--background-color) !important;
            border-top: 1px solid var(--border-color) !important;
        }
        
        .card, .card-body, .card-header, .course-content {
            background-color: var(--background-color) !important;
            border-color: var(--border-color) !important;
            color: var(--text-color) !important;
        }
        
        .text-light, .card-title, .card-text, .footer, 
        .text-muted, .logininfo, .logininfo a, #page-footer a {
            color: var(--text-color) !important;
        }
        
        /* Navigation menu */
        .navbar-bootswatch {
            background-color: var(--background-color) !important;
            border-bottom: 1px solid var(--border-color) !important;
        }
        
        .dropdown-menu {
            background-color: var(--background-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .dropdown-item, .dropdown-item:hover {
            color: var(--text-color) !important;
        }
        
        .dropdown-item:hover {
            background-color: rgba(128, 128, 128, 0.2) !important;
        }
        
        /* Calendar */
        .calendartable td.today {
            background-color: var(--primary-color) !important;
        }
        
        .calendartable td:hover {
            background-color: rgba(128, 128, 128, 0.2) !important;
        }

        /* Course blocks */
        .sectionhead.toggle.toggle-folder { 
            background-color: var(--primary-color) !important; 
        }
        
        .unread { 
            background-color: var(--primary-color) !important; 
        }
        
        .day.text-center.hasevent.calendar_event_course.duration_finish { 
            background-color: var(--primary-color) !important; 
        }
        
        .coursebox.clearfix.even, 
        .coursebox.clearfix.odd { 
            background-color: var(--background-color) !important; 
            border-bottom: 1px solid var(--border-color) !important; 
            position: relative;
        }
        
        /* Improvements for links and interactive elements */
        a, .aalink {
            color: var(--primary-color) !important;
        }
        
        .btn-primary, 
        .btn-secondary {
            background-color: var(--primary-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Top navigation menu */
        .breadcrumb {
            background-color: var(--background-color) !important;
        }
        
        /* Other interface elements */
        .page-header-headings h1 {
            color: var(--text-color) !important;
        }
        
        /* Fixing text color for teachers */
        .coursebox .teachers, 
        .coursebox .summary, 
        .teachers a,
        .summary a {
            color: var(--text-color) !important;
        }
        
        /* Specific elements for topcoll format */
        .course-content ul.ctopics li.section .content .toggle,
        .course-content ul.ctopics li.section .content.sectionhidden,
        .toggle_open.the_toggle,
        .toggle_closed.the_toggle,
        .toggle_open,
        .toggle_closed,
        .sectionname {
            background-color: var(--primary-color) !important;
            color: var(--text-color) !important;
        }
        
        span.toggle_open.the_toggle * {
            color: var(--text-color) !important;
        }
        
        .course-content ul.ctopics li.section .content .toggle:hover {
            filter: brightness(1.1);
        }
        
        /* Sidebar blocks and their content */
        .block-region section.card {
            background-color: var(--background-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        .block-region .card-body {
            color: var(--text-color) !important;
        }
        
        /* Main content sections */
        .course-content ul.ctopics li.section ul.section,
        .course-content .content {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Collapsible sections in course */
        .section .activity,
        .activity-item {
            background-color: var(--background-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Course content sections */
        .ctopics, .section, .content-item-container {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Breadcrumbs */
        .breadcrumb-item, .breadcrumb-item a {
            color: var(--text-color) !important;
        }
        
        /* Highlighting active blocks */
        .block_navigation .block_tree .active_tree_node {
            color: var(--primary-color) !important;
            font-weight: bold;
        }
        
        /* Styles for message window (dialogs) */
        .message-drawer,
        .message-app,
        [data-region="message-drawer"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .message-drawer .header-container,
        .message-drawer .footer-container,
        .message-drawer .body-container,
        [data-region="header-container"],
        [data-region="footer-container"],
        [data-region="body-container"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Dialog header */
        [data-region="view-conversation"],
        [data-region="header-content"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* User name and status */
        [data-region="header-content"] strong.text-truncate,
        [data-region="header-content"] p.font-weight-light {
            color: var(--text-color) !important;
        }
        
        /* Message containers */
        .message-drawer .messages-container,
        .message-drawer .contacts-container,
        [data-region="content-message-container"] {
            background-color: var(--background-color) !important;
        }
        
        .message-drawer .bg-white,
        .message-drawer .card,
        .message-drawer .list-group,
        .message-drawer .list-group-item,
        [data-region="view-conversation"] .bg-white {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Message styles */
        .message-drawer .message,
        [data-region="message"] {
            background-color: var(--background-color) !important;
            border: 1px solid var(--border-color) !important;
            color: var(--text-color) !important;
        }
        
        .message-drawer .message.send,
        .message[data-region="message"].send,
        div.send[data-region="message"] {
            background-color: rgba(60, 60, 60, 0.3) !important;
        }
        
        .message-drawer .message.received,
        .message[data-region="message"].received,
        div.received[data-region="message"] {
            background-color: rgba(var(--primary-color-rgb, 12, 90, 154), 0.2) !important;
        }
        
        /* Message tail (triangle) */
        .message .tail {
            display: none !important; /* Hide the tail for cleaner design */
        }
        
        /* Message sender name */
        [data-region="message"] h6.text-truncate {
            color: var(--text-color) !important;
        }
        
        /* Forms and input fields */
        .message-drawer textarea,
        .message-drawer input[type="text"],
        [data-region="send-message-txt"],
        [data-region="search-input"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .message-drawer .form-control,
        [data-region="footer-container"] .form-control {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: var(--text-color) !important;
        }
        
        /* Buttons in dialogs */
        .message-drawer .btn-link,
        [data-region="footer-container"] .btn-link,
        [data-action="send-message"],
        [data-action="toggle-emoji-picker"] {
            color: var(--primary-color) !important;
        }
        
        /* Day headers in messages */
        .message-drawer .day,
        [data-region="day-container"] h6.day {
            color: var(--text-color) !important;
        }
        
        /* Message text */
        .message-drawer .text-container p,
        [data-region="text-container"] p,
        [data-region="last-message"] {
            color: var(--text-color) !important;
        }
        
        [data-region="last-message"] .text-muted {
            color: rgba(var(--text-color-rgb, 255, 255, 255), 0.7) !important;
        }
        
        /* Contacts panel */
        .message-drawer .contact-status,
        .contact-status {
            border: 2px solid var(--background-color) !important;
        }
        
        .message-drawer .contact-status.online,
        .contact-status.online {
            background-color: #5cb85c !important;
        }
        
        .message-drawer .tab-content,
        .message-drawer .tab-pane {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Chat list (contacts) */
        a.list-group-item-action,
        a.list-group-item {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        a.list-group-item-action:hover,
        a.list-group-item:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Date in message list */
        [data-region="last-message-date"] {
            color: rgba(var(--text-color-rgb, 255, 255, 255), 0.7) !important;
        }
        
        /* Icons and other elements */
        .message-drawer .icon,
        [data-region="message-drawer"] .icon,
        [data-region="view-conversation"] .icon,
        [data-region="footer-container"] .icon {
            color: var(--text-color) !important;
        }
        
        /* Message time */
        .message-drawer .time,
        [data-region="time-created"] {
            color: rgba(var(--text-color-rgb, 255, 255, 255), 0.7) !important;
        }
        
        /* Conversation lists */
        .message-drawer .section.border-0.card,
        [data-region="view-overview"] .section.border-0.card {
            border: none !important;
            background-color: var(--background-color) !important;
        }
        
        .message-drawer .section .card-header,
        [data-region="view-overview"] .section .card-header {
            background-color: var(--background-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .message-drawer .overview-section-toggle,
        [data-region="view-overview"] .overview-section-toggle {
            color: var(--text-color) !important;
        }
        
        .message-drawer .dropdown-menu,
        #conversation-actions-menu {
            background-color: var(--background-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .message-drawer .dropdown-divider {
            border-color: var(--border-color) !important;
        }
        
        /* Dropdown menus in messages */
        .message-drawer .dropdown-item,
        #conversation-actions-menu .dropdown-item {
            color: var(--text-color) !important;
        }
        
        .message-drawer .dropdown-item:hover,
        #conversation-actions-menu .dropdown-item:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Modal windows in messages */
        .message-drawer .modal-content,
        [data-region="confirm-dialogue"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .message-drawer .modal-header,
        .message-drawer .modal-footer {
            border-color: var(--border-color) !important;
        }
        
        /* Search panel */
        .message-drawer .input-group-text,
        [data-region="search-input-container"] .input-group-text {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Empty states */
        .message-drawer .empty-message-container,
        [data-region="empty-message-container"] {
            color: var(--text-color) !important;
        }
        
        /* Pulsating loading elements */
        .message-drawer .bg-pulse-grey,
        [data-region="message-drawer"] .bg-pulse-grey {
            background-color: rgba(var(--text-color-rgb, 255, 255, 255), 0.2) !important;
        }
        
        /* Fixing specific margins and colors for chat list */
        [data-region="content-container"] a.list-group-item strong.text-truncate {
            color: var(--text-color) !important;
        }
        
        [data-region="content-container"] a.list-group-item:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        [data-region="content-container"] .text-muted {
            color: rgba(var(--text-color-rgb, 255, 255, 255), 0.7) !important;
        }
        
        /* Styles for dropdown lists and select elements */
        select.custom-select,
        select.urlselect,
        .custom-select,
        .urlselect select,
        #jump-to-activity {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        select.custom-select option,
        select.urlselect option,
        .custom-select option,
        .urlselect select option,
        #jump-to-activity option {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Styles for tests and quizzes */
        .que,
        .que .content,
        .que .formulation,
        .que .info,
        .que .outcome,
        .que .comment,
        .formulation,
        #responseform {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Styles for question headers */
        .que .qtext,
        .que h3.no,
        .que h4,
        .que .info .state,
        .que .info .grade {
            color: var(--text-color) !important;
        }
        
        /* Drag-and-drop elements in tests */
        .drag,
        .drop,
        .draghome,
        .place,
        .draggrouphomes1 span {
            background-color: rgba(var(--primary-color-rgb, 12, 90, 154), 0.2) !important;
            color: var(--text-color) !important;
            border: 1px solid var(--border-color) !important;
        }
        
        .drag.unplaced,
        .draghome.unplaced {
            background-color: rgba(var(--primary-color-rgb, 12, 90, 154), 0.3) !important;
        }
        
        .drop.active {
            background-color: rgba(255, 255, 255, 0.1) !important;
            border: 2px dashed var(--border-color) !important;
        }
        
        /* Navigation buttons in tests */
        .submitbtns .btn,
        .mod_quiz-next-nav,
        input[type="submit"].btn {
            background-color: var(--primary-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .submitbtns .btn:hover,
        .mod_quiz-next-nav:hover,
        input[type="submit"].btn:hover {
            filter: brightness(1.1);
        }
        
        /* Styles for modal windows */
        .moodle-dialogue-wrap,
        .moodle-dialogue-content,
        .moodle-dialogue-base .moodle-dialogue,
        [role="dialog"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .moodle-dialogue-hd,
        .moodle-dialogue-ft,
        .moodle-dialogue-bd {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Forms inside modal windows */
        .moodle-dialogue-wrap .mform,
        .moodle-dialogue-wrap fieldset,
        .moodle-dialogue-wrap .form-group,
        .moodle-dialogue-wrap .form-control-static {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
        }
        
        /* Headers in modal windows */
        .moodle-dialogue-wrap legend,
        .moodle-dialogue-wrap .form-control-static {
            color: var(--text-color) !important;
        }
        
        /* Buttons in modal window */
        .moodle-dialogue-wrap .btn-primary {
            background-color: var(--primary-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .moodle-dialogue-wrap .btn-secondary {
            background-color: rgba(var(--primary-color-rgb, 12, 90, 154), 0.3) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Close button for modal window */
        .moodle-dialogue-wrap .closebutton {
            background-color: transparent !important;
            color: var(--text-color) !important;
        }
        
        /* Specific styles for navigation between activities */
        .activity-navigation .btn-link {
            color: var(--primary-color) !important;
        }
        
        /* Styles for related activities */
        #prev-activity-link,
        #next-activity-link {
            color: var(--primary-color) !important;
        }
        
        /* Styles for notification popups */
        .popover-region-container,
        #popover-region-container,
        [data-region="popover-region-container"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Popup header */
        .popover-region-header-container,
        .popover-region-header-text {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Popup content */
        .popover-region-content-container,
        .popover-region-content,
        .all-notifications,
        .notification {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Buttons and icons in popup */
        .popover-region-header-actions a,
        .popover-region-header-actions i,
        .mark-all-read-button {
            color: var(--text-color) !important;
        }
        
        /* Popup footer */
        .popover-region-footer-container,
        .popover-region-seeall-text {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Empty message */
        .empty-message {
            color: var(--text-color) !important;
        }
        
        /* Styles for search fields with icons */
        .input-group,
        .input-group-prepend,
        .input-group-text {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        .input-group .form-control,
        .input-group input[type="text"] {
            background-color: var(--background-color) !important;
            color: var(--text-color) !important;
            border-color: var(--border-color) !important;
        }
        
        /* Fix for search icons */
        .input-group-text i,
        .input-group-prepend i {
            color: var(--text-color) !important;
        }
        
        /* Fixes for input-group with white background */
        .input-group-text.bg-white,
        .input-group-text.pr-2.bg-white {
            background-color: var(--background-color) !important;
        }
        
        /* Styles for clutter management controls */
        .clutter-management-container {
            background-color: var(--background-color);
            color: var(--text-color);
            padding: 15px;
            margin-top: 15px;
            border-radius: 5px;
            border: 1px solid var(--border-color);
        }
        
        .clutter-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            padding: 8px;
            background-color: rgba(128, 128, 128, 0.1);
            border-radius: 3px;
        }
        
        .clutter-item:hover {
            background-color: rgba(128, 128, 128, 0.2);
        }
        
        .clutter-item-checkbox {
            margin-right: 10px;
        }

        /* Styles for teachers list management */
        .visible-teachers {
            display: block;
            margin-bottom: 8px;
        }

        .expand-teachers-btn {
            background: none;
            border: none;
            color: var(--primary-color);
            cursor: pointer;
            padding: 2px 6px;
            font-size: 12px;
            margin-left: 5px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }

        .expand-teachers-btn:hover {
            opacity: 1;
        }

        .teachers-wrapper {
            position: relative;
        }

        .collapsed-teachers {
            margin: 0;
            padding-left: 40px;
        }
    `);
}

function applyClutterSettings() {
    const currentSettings = getClutterSettings();

    Object.entries(currentSettings).forEach(([key, setting]) => {
        if (setting.checked) {
            // If element is marked for hiding
            if (setting.selector === '.courseimage') {
                // Special case for course images
                document.querySelectorAll(setting.selector).forEach((picture) => {
                    picture.parentNode.removeChild(picture);
                });
            } else {
                // General case for other elements
                const element = document.querySelector(setting.selector);
                if (element) {
                    element.style.display = 'none';
                }
            }
        }
    });
}

// Styles for close button, modal window and theme selector
addGlobalStyle(`
    .hide-button {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 20px;
        height: 20px;
        font-size: 12px;
        background-color: rgba(30, 30, 30, 0.7);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.5;
        z-index: 10;
    }
    
    .hide-button:hover {
        opacity: 1;
    }
    
    .restore-modal,
    .theme-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: var(--background-color, #1e1e2e);
        border: 1px solid var(--border-color, #45475a);
        border-radius: 5px;
        padding: 20px;
        z-index: 1000;
        max-height: 80vh;
        overflow-y: auto;
        width: 400px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        color: var(--text-color, #cdd6f4);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 1px solid var(--border-color, #45475a);
        padding-bottom: 10px;
    }
    
    .modal-title {
        margin: 0;
        color: var(--text-color, #cdd6f4);
    }
    
    .close-modal {
        background: none;
        border: none;
        color: var(--text-color, #cdd6f4);
        font-size: 20px;
        cursor: pointer;
    }
    
    .modal-body {
        margin-bottom: 15px;
    }
    
    .hidden-item,
    .theme-item {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        padding: 8px;
        background-color: rgba(128, 128, 128, 0.1);
        border-radius: 3px;
    }
    
    .hidden-item:hover,
    .theme-item:hover {
        background-color: rgba(128, 128, 128, 0.2);
    }
    
    .hidden-item-checkbox,
    .theme-item-radio {
        margin-right: 10px;
    }
    
    .modal-footer {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid var(--border-color, #45475a);
        padding-top: 15px;
    }
    
    .modal-button {
        padding: 8px 15px;
        background-color: var(--primary-color, #cba6f7);
        color: var(--text-color, #cdd6f4);
        border: none;
        border-radius: 3px;
        cursor: pointer;
        margin: 0 5px;
    }
    
    .modal-button:hover {
        filter: brightness(1.1);
    }
    
    .select-all-container {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        padding: 5px;
        background-color: rgba(128, 128, 128, 0.3);
        border-radius: 3px;
    }
    
    /* Style for control panel */
    .control-panel {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 999;
    }
    
    .control-panel-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: var(--primary-color, #cba6f7);
        color: var(--text-color, #cdd6f4);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
        border: none;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .control-panel-button:hover {
        filter: brightness(1.1);
    }
    
    /* Styles for color examples in theme selector */
    .theme-color-preview {
        display: flex;
        margin-left: auto;
        gap: 5px;
    }
    
    .color-circle {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 1px solid rgba(128, 128, 128, 0.5);
    }
`);

window.addEventListener('DOMContentLoaded', function () {
    applyTheme();

    // Function to get hidden elements storage
    function getHiddenElementsStorage() {
        return JSON.parse(localStorage.getItem('hiddenElementsData')) || {};
    }

    // Function to save hidden elements storage
    function saveHiddenElementsStorage(data) {
        localStorage.setItem('hiddenElementsData', JSON.stringify(data));
    }

    // Function to hide element and save information about it
    function hideElement(element, className, index, titleText) {
        element.style.display = 'none';

        const hiddenData = getHiddenElementsStorage();

        const elementId = `${className}-${index}`;

        hiddenData[elementId] = {
            className: className,
            index: index,
            title: titleText,
            timestamp: new Date().toISOString()
        };

        saveHiddenElementsStorage(hiddenData);
    }

    function showHiddenElements() {
        const hiddenData = getHiddenElementsStorage();

        if (Object.keys(hiddenData).length === 0) {
            alert('Нет скрытых элементов для восстановления');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'restore-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">Восстановление скрытых элементов</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="select-all-container">
                <input type="checkbox" id="select-all-checkbox" class="hidden-item-checkbox">
                <label for="select-all-checkbox">Выбрать все</label>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="modal-button restore-selected">Восстановить выбранные</button>
                <button class="modal-button restore-all">Восстановить все</button>
            </div>
        `;

        document.body.appendChild(modal);

        const modalBody = modal.querySelector('.modal-body');

        Object.entries(hiddenData).forEach(([elementId, data]) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'hidden-item';
            itemElement.innerHTML = `
                <input type="checkbox" class="hidden-item-checkbox" data-id="${elementId}">
                <div>${data.title || `Элемент ${elementId}`}</div>
            `;
            modalBody.appendChild(itemElement);
        });

        const selectAllCheckbox = modal.querySelector('#select-all-checkbox');
        selectAllCheckbox.addEventListener('change', function () {
            const allCheckboxes = modal.querySelectorAll('.hidden-item-checkbox');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });

        modal.querySelector('.close-modal').addEventListener('click', function () {
            document.body.removeChild(modal);
        });

        modal.querySelector('.restore-selected').addEventListener('click', function () {
            const selectedCheckboxes = modal.querySelectorAll('.hidden-item-checkbox:checked:not(#select-all-checkbox)');

            if (selectedCheckboxes.length === 0) {
                alert('Не выбрано ни одного элемента');
                return;
            }

            const hiddenData = getHiddenElementsStorage();

            selectedCheckboxes.forEach(checkbox => {
                const elementId = checkbox.getAttribute('data-id');
                delete hiddenData[elementId];
            });

            saveHiddenElementsStorage(hiddenData);

            location.reload();
        });

        modal.querySelector('.restore-all').addEventListener('click', function () {
            saveHiddenElementsStorage({});

            location.reload();
        });
    }

    function showThemeSelector() {
        const modal = document.createElement('div');
        modal.className = 'theme-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">Выбор темы оформления</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="modal-button apply-theme">Применить</button>
                <button class="modal-button close-theme-modal">Отмена</button>
            </div>
        `;

        document.body.appendChild(modal);

        const modalBody = modal.querySelector('.modal-body');

        Object.entries(themes).forEach(([themeId, theme]) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'theme-item';

            let colorPreview = '';
            if (themeId !== 'moodleDefault' && theme.colors.primary) {
                colorPreview = `
                    <div class="theme-color-preview">
                        <div class="color-circle" style="background-color: ${theme.colors.primary}"></div>
                        <div class="color-circle" style="background-color: ${theme.colors.background}"></div>
                        <div class="color-circle" style="background-color: ${theme.colors.border}"></div>
                    </div>
                `;
            }

            itemElement.innerHTML = `
                <input type="radio" name="theme" class="theme-item-radio" 
                       value="${themeId}" id="theme-${themeId}" 
                       ${themeId === savedTheme ? 'checked' : ''}>
                <label for="theme-${themeId}">${theme.name}</label>
                ${colorPreview}
            `;
            modalBody.appendChild(itemElement);
        });

        const clutterButton = document.createElement('div');
        clutterButton.className = 'modal-button clutter-management-button';
        clutterButton.style.marginTop = '20px';
        clutterButton.innerHTML = 'Управление элементами интерфейса';
        clutterButton.addEventListener('click', showClutterManagement);
        modalBody.appendChild(clutterButton);

        const closeButtons = modal.querySelectorAll('.close-modal, .close-theme-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', function () {
                document.body.removeChild(modal);
            });
        });

        modal.querySelector('.apply-theme').addEventListener('click', function () {
            const selectedTheme = modal.querySelector('input[name="theme"]:checked');

            if (selectedTheme) {
                const themeId = selectedTheme.value;
                localStorage.setItem('istuMoodleTheme', themeId);
                location.reload();
            }
        });
    }

    function showClutterManagement() {
        const currentSettings = getClutterSettings();

        const previousModal = document.querySelector('.theme-modal');
        if (previousModal) {
            document.body.removeChild(previousModal);
        }

        const modal = document.createElement('div');
        modal.className = 'theme-modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h3 class="modal-title">Управление элементами интерфейса</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Выберите элементы, которые нужно скрыть:</p>
                <div class="select-all-container">
                    <input type="checkbox" id="select-all-checkbox" class="clutter-item-checkbox">
                    <label for="select-all-checkbox">Выбрать все</label>
                </div>
                <div class="clutter-items-container"></div>
            </div>
            <div class="modal-footer">
                <button class="modal-button apply-clutter">Применить</button>
                <button class="modal-button cancel-clutter">Назад к темам</button>
            </div>
        `;

        document.body.appendChild(modal);

        const clutterContainer = modal.querySelector('.clutter-items-container');

        Object.entries(currentSettings).forEach(([key, setting]) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'clutter-item';
            itemElement.innerHTML = `
                <input type="checkbox" class="clutter-item-checkbox" 
                       id="clutter-${key}" data-key="${key}" 
                       ${setting.checked ? 'checked' : ''}>
                <label for="clutter-${key}">${setting.name}</label>
            `;
            clutterContainer.appendChild(itemElement);
        });

        const selectAllCheckbox = modal.querySelector('#select-all-checkbox');
        selectAllCheckbox.checked = Object.values(currentSettings).every(setting => setting.checked);

        selectAllCheckbox.addEventListener('change', function () {
            const allCheckboxes = modal.querySelectorAll('.clutter-item-checkbox');
            allCheckboxes.forEach(checkbox => {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });

        modal.querySelector('.close-modal').addEventListener('click', function () {
            document.body.removeChild(modal);
            showThemeSelector(); // Return to theme selection
        });

        modal.querySelector('.cancel-clutter').addEventListener('click', function () {
            document.body.removeChild(modal);
            showThemeSelector(); // Return to theme selection
        });

        modal.querySelector('.apply-clutter').addEventListener('click', function () {
            const checkboxes = modal.querySelectorAll('.clutter-item-checkbox:not(#select-all-checkbox)');
            checkboxes.forEach(checkbox => {
                const key = checkbox.getAttribute('data-key');
                if (key && currentSettings[key]) {
                    currentSettings[key].checked = checkbox.checked;
                }
            });

            saveClutterSettings(currentSettings);

            location.reload();
        });
    }

    function addCloseButtonToElements(className) {
        if (savedTheme === 'moodleDefault') {
            return;
        }

        const elements = document.querySelectorAll('.' + className);

        elements.forEach((element, index) => {
            const hiddenData = getHiddenElementsStorage();
            const elementId = `${className}-${index}`;

            if (hiddenData[elementId]) {
                element.style.display = 'none';
                return;
            }

            let titleText = '';
            const titleElement = element.querySelector('.coursename a');
            if (titleElement) {
                titleText = titleElement.textContent.trim();
            }

            const closeButton = document.createElement('button');
            closeButton.className = 'hide-button';
            closeButton.textContent = '×';
            closeButton.title = 'Скрыть курс';

            closeButton.addEventListener('click', function (e) {
                e.stopPropagation();
                hideElement(element, className, index, titleText);
            });

            element.appendChild(closeButton);
        });
    }

    function processTeachersList() {
        const teacherLists = document.querySelectorAll('.teachers');
        const clutterSettings = getClutterSettings();

        if (!clutterSettings['hide-teachers'] || !clutterSettings['hide-teachers'].checked) {
            return;
        }

        teacherLists.forEach((list) => {
            const teachers = list.querySelectorAll('li');

            if (teachers.length <= 3) {
                return;
            }

            const wrapper = document.createElement('div');
            wrapper.className = 'teachers-wrapper';
            list.parentNode.insertBefore(wrapper, list);
            wrapper.appendChild(list);

            const collapsedList = document.createElement('ul');
            collapsedList.className = 'collapsed-teachers';

            for (let i = 0; i < 3; i++) {
                if (teachers[i]) {
                    collapsedList.appendChild(teachers[i].cloneNode(true));
                }
            }

            const expandButton = document.createElement('button');
            expandButton.className = 'expand-teachers-btn';
            expandButton.innerHTML = '&#9660;';
            expandButton.title = 'Показать всех преподавателей';

            const teachersCount = document.createElement('span');
            teachersCount.style.fontSize = '11px';
            teachersCount.style.color = 'var(--text-color)';
            teachersCount.style.opacity = '0.7';
            teachersCount.textContent = ` (${teachers.length})`;
            expandButton.appendChild(teachersCount);

            const lastItem = collapsedList.lastElementChild;
            if (lastItem) {
                lastItem.appendChild(expandButton);
            }

            wrapper.insertBefore(collapsedList, list);

            list.style.display = 'none';

            const collapseButton = document.createElement('button');
            collapseButton.className = 'expand-teachers-btn';
            collapseButton.innerHTML = '&#9650;';
            collapseButton.title = 'Скрыть преподавателей';

            const collapseContainer = document.createElement('li');
            collapseContainer.appendChild(collapseButton);
            list.appendChild(collapseContainer);

            const toggleTeachersList = function () {
                if (list.style.display === 'none') {
                    list.style.display = 'block';
                    collapsedList.style.display = 'none';
                } else {
                    list.style.display = 'none';
                    collapsedList.style.display = 'block';
                }
            };

            expandButton.addEventListener('click', toggleTeachersList);
            collapseButton.addEventListener('click', toggleTeachersList);
        });
    }


    function createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'control-panel';

        const hiddenElementsButton = document.createElement('button');
        hiddenElementsButton.className = 'control-panel-button';
        hiddenElementsButton.innerHTML = '<span style="font-size: 18px;">👁️</span>';
        hiddenElementsButton.title = 'Управление скрытыми элементами';
        hiddenElementsButton.addEventListener('click', showHiddenElements);

        const themeButton = document.createElement('button');
        themeButton.className = 'control-panel-button';
        themeButton.innerHTML = '<span style="font-size: 18px;">🎨</span>';
        themeButton.title = 'Выбор темы оформления';
        themeButton.addEventListener('click', showThemeSelector);

        const clutterButton = document.createElement('button');
        clutterButton.className = 'control-panel-button';
        clutterButton.innerHTML = '<span style="font-size: 18px;">⚙️</span>';
        clutterButton.title = 'Управление элементами интерфейса';
        clutterButton.addEventListener('click', showClutterManagement);

        controlPanel.appendChild(hiddenElementsButton);
        controlPanel.appendChild(themeButton);
        controlPanel.appendChild(clutterButton);

        document.body.appendChild(controlPanel);
    }

    addCloseButtonToElements('coursebox.clearfix.even');
    addCloseButtonToElements('coursebox.clearfix.odd');

    processTeachersList();

    createControlPanel();

    const frontpageCourseList = document.querySelector('#frontpage-course-list');
    if (frontpageCourseList) {
        const managementContainer = document.createElement('div');
        managementContainer.style.display = 'flex';
        managementContainer.style.justifyContent = 'flex-end';
        managementContainer.style.margin = '10px 0';

        const restoreButton = document.createElement('button');
        restoreButton.className = 'modal-button';
        restoreButton.textContent = 'Управление скрытыми элементами';
        restoreButton.addEventListener('click', showHiddenElements);

        const themeButton = document.createElement('button');
        themeButton.className = 'modal-button';
        themeButton.textContent = 'Настройки темы';
        themeButton.style.marginLeft = '10px';
        themeButton.addEventListener('click', showThemeSelector);

        const clutterButton = document.createElement('button');
        clutterButton.className = 'modal-button';
        clutterButton.textContent = 'Управление интерфейсом';
        clutterButton.style.marginLeft = '10px';
        clutterButton.addEventListener('click', showClutterManagement);

        managementContainer.appendChild(restoreButton);
        managementContainer.appendChild(themeButton);
        managementContainer.appendChild(clutterButton);

        frontpageCourseList.appendChild(managementContainer);
    }

    function applyMessageDrawerStyles() {
        const messageDrawers = document.querySelectorAll('[data-region="message-drawer"]');

        if (messageDrawers.length > 0) {
            messageDrawers.forEach(drawer => {
                drawer.setAttribute('data-themed', 'true');
            });

            if (currentTheme.colors && currentTheme.colors.primary && currentTheme.colors.text) {
                const hexToRgb = (hex) => {
                    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
                    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
                    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
                };

                const rgbToComponents = (rgb) => {
                    const match = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
                    return match ? `${match[1]}, ${match[2]}, ${match[3]}` : null;
                };

                let primaryRgb = currentTheme.colors.primary.startsWith('#')
                    ? hexToRgb(currentTheme.colors.primary)
                    : rgbToComponents(currentTheme.colors.primary);

                let textRgb = currentTheme.colors.text.startsWith('#')
                    ? hexToRgb(currentTheme.colors.text)
                    : rgbToComponents(currentTheme.colors.text);

                if (primaryRgb && textRgb) {
                    addGlobalStyle(`
                        :root {
                            --primary-color-rgb: ${primaryRgb};
                            --text-color-rgb: ${textRgb};
                        }
                    `);
                }
            }
        }
    }

    applyMessageDrawerStyles();

    const bodyObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && (
                        node.getAttribute('data-region') === 'message-drawer' ||
                        node.querySelector('[data-region="message-drawer"]')
                    )) {
                        applyMessageDrawerStyles();
                    }
                });
            }
        });
    });

    function styleSelectElements() {
        const selects = document.querySelectorAll('select.custom-select, select.urlselect, #jump-to-activity');
        selects.forEach(select => {
            select.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color') || '#1e1e2e';
            select.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
            select.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a';

            select.addEventListener('focus', function () {
                this.style.outline = `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#cba6f7'}`;
            });

            select.addEventListener('blur', function () {
                this.style.outline = 'none';
            });
        });
    }

    function styleQuizAndModalElements() {
        const quizElements = document.querySelectorAll('.que, .formulation, .que .content, .que .info, .drag, .drop, .draghome');
        quizElements.forEach(element => {
            element.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color') || '#1e1e2e';
            element.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
            element.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a';
        });

        const dragElements = document.querySelectorAll('.drag, .draghome');
        const dropElements = document.querySelectorAll('.drop, .place');

        dragElements.forEach(element => {
            const primaryColorRgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb') || '12, 90, 154';
            element.style.backgroundColor = `rgba(${primaryColorRgb}, 0.3)`;
            element.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
            element.style.border = `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a'}`;
        });

        dropElements.forEach(element => {
            if (element.classList.contains('active')) {
                element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                element.style.border = `2px dashed ${getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a'}`;
            }
        });

        const quizButtons = document.querySelectorAll('.submitbtns .btn, .mod_quiz-next-nav, input[type="submit"].btn');
        quizButtons.forEach(button => {
            button.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#cba6f7';
            button.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
            button.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a';
        });

        const modalDialogs = document.querySelectorAll('.moodle-dialogue-wrap, .moodle-dialogue-content, [role="dialog"]');
        modalDialogs.forEach(dialog => {
            dialog.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color') || '#1e1e2e';
            dialog.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
            dialog.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a';

            const dialogParts = dialog.querySelectorAll('.moodle-dialogue-hd, .moodle-dialogue-ft, .moodle-dialogue-bd, .form-group, legend, .form-control-static');
            dialogParts.forEach(part => {
                part.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color') || '#1e1e2e';
                part.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
                part.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a';
            });

            const modalButtons = dialog.querySelectorAll('.btn-primary, [type="submit"]');
            modalButtons.forEach(button => {
                if (button.classList.contains('btn-secondary')) {
                    const primaryColorRgb = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-rgb') || '12, 90, 154';
                    button.style.backgroundColor = `rgba(${primaryColorRgb}, 0.3)`;
                } else {
                    button.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#cba6f7';
                }
                button.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color') || '#ffffff';
                button.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#45475a';
            });
        });

        const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && (
                            node.classList.contains('moodle-dialogue-wrap') ||
                            node.getAttribute('role') === 'dialog' ||
                            node.querySelector('[role="dialog"]')
                        )) {
                            styleQuizAndModalElements();
                        }
                    });
                }
            });
        });

        modalObserver.observe(document.body, { childList: true, subtree: true });
    }

    bodyObserver.observe(document.body, { childList: true, subtree: true });
});
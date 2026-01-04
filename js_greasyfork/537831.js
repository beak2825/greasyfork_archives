// ==UserScript==
// @name         TT1069 Modernizer
// @namespace    http://tampermonkey.net/
// @version      1.3.3.1
// @description  Modernize TT1069 Discuz! X3 forum pages with Dark Mode Toggle and Debugging Logs
// @author       AI Assistant & Sauber
// @match        https://www.tt1069.com/bbs/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537831/TT1069%20Modernizer.user.js
// @updateURL https://update.greasyfork.org/scripts/537831/TT1069%20Modernizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('TT1069 Modernizer: Script execution started.');

    let modernCSS = `
        /* 0. Basic Reset & Normalization */
        html {
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            font-size: 16px; /* Base font size */
        }
        *, *::before, *::after {
            box-sizing: inherit;
        }
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
            line-height: 1.6;
            background-color: #f0f2f5; /* Light gray background for the whole page */
            color: #333;
            overflow-x: hidden; /* Prevent horizontal scroll issues */
        }
        img {
            max-width: 100%;
            height: auto;
            vertical-align: middle;
        }
        a {
            color: #007bff;
            text-decoration: none;
            transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
        }
        a:hover {
            color: #0056b3;
            text-decoration: underline;
        }
        table {
            border-collapse: collapse; /* Overrides Discuz defaults sometimes */
            width: 100%; /* Make tables responsive by default */
        }
        /* Remove those fr-bold styles added by some extension */
        [fr-bold-197212c49b2] {
            font-weight: inherit !important;
        }

        /* Hide problematic injected styles from extensions */
        style[id^="SvY"], style[id^="fr-css"], style[data-id="immersive-translate-input-injected-css"], style._th-container, ._th-container, ._th_cover-all-show-times {
            display: none !important;
        }

        /* --- Phase 1: Hide Original Header and Navigation Elements --- */
        #hd, /* Entire header block (logo, user menu) */
        #nv, /* Entire main navigation bar */
        #qmenu_menu /* The popup for quick navigation */ {
            display: none !important;
        }

        /* 1. Main Page Structure & Wrapper */
        #wp, .wp {
            max-width: 1200px;         /* 你可以调整这个值，这是内容区域的最大宽度 */
            min-width: 320px;          /* 建议的最小宽度，以保证在非常窄的屏幕上基本可用性 */
            width: auto !important;    /* 关键改动：
                                          - 让 #wp 的宽度由其内容决定。
                                          - 它会尝试包裹其内容，但不会超过 max-width。
                                          - 当视口宽度小于 max-width 时，它的宽度也会被视口限制。
                                          - 使用 !important 来覆盖 Discuz 可能存在的固定宽度样式 (如 width: 960px;)。
                                        */
            margin-left: auto !important;  /* 确保 #wp 在页面中水平居中 */
            margin-right: auto !important; /* 确保 #wp 在页面中水平居中 */
            padding: 20px 15px;
            background-color: #ffffff; /* White background for the content area */
            box-shadow: 0 2px 10px rgba(0,0,0,0.05); /* Subtle shadow */
            position: relative; /* For potential absolute children if needed */
            overflow-x: auto;          /* 关键改动：
                                          - 如果 #wp 的内容宽度（在应用了 max-width 和视口约束后）
                                            仍然大于 #wp 自身的计算宽度，则 #wp 内部会出现水平滚动条。
                                          - 这可以防止内容被截断，并允许用户查看所有内容。
                                        */
            box-sizing: border-box;    /* 确保 padding 和 border 被包含在 width 和 max-width 的计算之内 */
        }
        #ct { /* Main content area within #wp */
            width: auto !important;
            padding: 0 !important; /* Reset if it has its own padding */
            margin: 0 !important;
        }

        /* --- Phase 3: New Custom Header / Navigation Bar --- */
        #custom-top-bar {
            background-color: #fff;
            padding: 10px 15px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky; /* Make it sticky at the top */
            top: 0;
            z-index: 1000; /* Ensure it's above other content */
            margin-bottom: 20px; /* Space below it, before #wp */
        }

        #custom-logo-area {
            display: flex;
            align-items: center;
        }
        #custom-logo-area img {
            max-height: 35px;
            width: auto;
            margin-right: 15px; /* Space between logo and nav links */
        }
        #custom-logo-area a {
            font-size: 1.1em;
            font-weight: 600;
            color: #333;
            text-decoration: none;
        }

        #custom-main-nav ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            gap: 15px;
        }
        #custom-main-nav ul li a {
            display: block;
            padding: 8px 10px;
            color: #555;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s, background-color 0.2s;
            border-radius: 4px;
        }
        #custom-main-nav ul li a:hover {
            color: #007bff;
            background-color: #f0f2f5;
        }
        #custom-main-nav ul li.active a { /* Example for active link */
            color: #007bff;
            font-weight: 700;
        }

        #custom-nav-actions {
            display: flex;
            align-items: center;
            gap: 10px; /* Smaller gap for action buttons */
        }

        .custom-action-button {
            background: none;
            border: none;
            padding: 8px;
            cursor: pointer;
            font-size: 1.2em; /* For icon fonts or larger text */
            color: #333;
            border-radius: 50%; /* Make it circular for icons */
            width: 40px;
            height: 40px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
            flex-shrink: 0; /* Prevent buttons from shrinking */
        }
        .custom-action-button:hover {
            background-color: #f0f0f0;
        }

        #custom-user-menu-panel,
        #custom-quick-nav-panel {
            display: none; /* Hidden by default */
            position: absolute;
            top: 55px; /* Below the top bar */
            right: 15px; /* Align to the right of the viewport */
            background-color: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            z-index: 1070; /* Above other elements */
            min-width: 220px;
            max-width: 300px; /* Limit width */
            padding: 0; /* Reset padding from .p_pop */
        }

        /* Adjust positioning for custom-quick-nav-panel if it's too wide for default 'right' */
        #custom-quick-nav-panel {
            /* If the quick nav panel needs to open to the left of its button,
               or dynamically adjust based on space.
               For simplicity, keeping it aligned to the right, but if it overflows
               you'd adjust 'right' or set 'left' relative to trigger.
               For now, this assumes right alignment is ok.
            */
        }


        #custom-user-menu-panel ul,
        #custom-quick-nav-panel ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #custom-user-menu-panel ul li a,
        #custom-quick-nav-panel ul li a {
            display: block;
            padding: 10px 15px;
            color: #333;
            text-decoration: none;
            font-size: 0.9em;
            border-bottom: 1px solid #f0f0f0;
        }
        #custom-user-menu-panel ul li:last-child a,
        #custom-quick-nav-panel ul li:last-child a {
            border-bottom: none;
        }
        #custom-user-menu-panel ul li a:hover,
        #custom-quick-nav-panel ul li a:hover {
            background-color: #f8f8f8;
            color: #007bff;
        }
        /* Specific styling for #custom-quick-nav-panel parts */
        #custom-quick-nav-panel .cqn-section {
            padding: 10px 15px;
            border-bottom: 1px solid #e9ecef;
        }
        #custom-quick-nav-panel .cqn-section:last-child {
            border-bottom: none;
        }
        #custom-quick-nav-panel .cqn-section-title {
            font-weight: bold;
            color: #555;
            margin-bottom: 8px;
            font-size: 0.8em;
            text-transform: uppercase;
        }
        #custom-quick-nav-panel #cqn-forum-jump-search input {
             width: calc(100% - 20px); /* Account for padding */
             padding: 8px 10px;
             border: 1px solid #ced4da;
             border-radius: 4px;
             margin-bottom: 10px;
        }
        #custom-quick-nav-panel #cqn-forum-list {
            max-height: 250px;
            overflow-y: auto;
        }

        /* Styling for the cloned forum list items in quick nav */
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl li > p {
            margin: 0;
            padding: 6px 8px;
            border-radius: 3px;
            font-size: 0.9em;
            line-height: 1.4;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl li > p a {
            color: #007bff;
            text-decoration: none;
            display: block;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl li > p a:hover {
            color: #0056b3;
            background-color: #f0f2f5;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.bbda.xg1 {
            color: #6c757d;
            font-weight: 500;
            font-size: 0.85em;
            text-transform: uppercase;
            margin-top: 10px;
            padding-left: 0;
            border-bottom: 1px solid #eee;
            margin-bottom: 5px;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.bbda.xg1:first-of-type {
            margin-top: 0;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.xw1 a {
            font-weight: 600;
            color: #343a40;
            font-size: 0.95em;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.xw1 a:hover {
             color: #0056b3;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.sub a {
            padding-left: 15px;
            color: #495057;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.sub.a a {
            color: #007bff;
            font-weight: bold;
        }
        #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.child a {
            padding-left: 30px;
            font-size: 0.85em;
            color: #555;
        }


        /* 3. Search Bar (#scbar) - Retained and modernized */
        #scbar {
            margin-bottom: 20px;
            padding: 15px; /* Slightly more padding for a spacious feel */
            background-color: #f8f9fa;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08); /* Subtle shadow for depth */
        }
        #scbar form {
            display: flex;
            gap: 0; /* Remove gap, we'll control spacing with margins/padding */
            align-items: center;
            position: relative; /* For absolute positioning of icons if needed */
        }
        #scbar_txt { /* Search input */
            flex-grow: 1;
            padding: 10px 12px; /* Adjusted padding */
            border: none;
            border-bottom: 1px solid #ced4da; /* Material-style bottom border */
            border-radius: 0; /* Remove border-radius for a flatter input field */
            font-size: 1em; /* Slightly larger font */
            height: 40px; /* Adjusted height */
            box-sizing: border-box;
            background-color: transparent; /* Make background transparent initially */
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        #scbar_txt:focus {
            outline: none;
            border-bottom-color: #007bff; /* Primary color on focus */
            box-shadow: 0 1px 0 0 #007bff; /* Bottom shadow effect on focus */
        }
        #scbar_type { /* Search type dropdown (帖子/用户) */
            padding: 0 10px;
            border: none;
            border-left: 1px solid #e0e0e0; /* Separator */
            border-radius: 0;
            background: transparent;
            font-size: 0.9em;
            height: 40px;
            box-sizing: border-box;
            margin-left: 10px;
            color: #555;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        /* Hide the Google Search Button */
        #scbar_form #google_btn {
            display: none !important;
        }

        #scbar_form button { /* Applies ONLY to the main search_btn now */
            padding: 0 18px !important;
            border: none !important;
            border-radius: 4px !important;
            height: 40px !important;
            line-height: 40px !important;
            cursor: pointer;
            font-size: 0.95em;
            font-weight: 500;
            transition: background-color 0.2s, box-shadow 0.2s;
            box-sizing: border-box;
            vertical-align: middle;
            margin-left: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
        }
        #scbar_form #search_btn {
            background-color: #007bff; color: white;
        }
        #scbar_form #search_btn:hover {
            background-color: #0069d9;
            box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
        }
        #scbar_form #search_btn:active {
            background-color: #0056b3;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        /* 4. Breadcrumbs (#pt) */
        #pt {
            background-color: #e9ecef;
            padding: 12px 18px;
            border-radius: 6px;
            margin-bottom: 20px;
            font-size: 0.9em;
            line-height: 1.5;
        }
        #pt .z { float: none !important; } /* Disable float for better control */
        #pt a { color: #0056b3; }
        #pt a.nvhm { font-weight: bold; }
        #pt em { margin: 0 6px; color: #6c757d; }

        /* 5. Page Top Controls / Pagination (#pgt) */
        #pgt {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 20px;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
        }
        #pgt .pg, #pgt .pgb { margin: 0; padding: 0; } /* .pgb for "返回列表" type links */

        #pgt .pg a, #pgt .pg strong, #pgt .pgb a {
            display: inline-flex; /* Changed for better alignment */
            align-items: center;
            justify-content: center;
            padding: 8px 12px; /* Consistent padding for pagination items */
            border: 1px solid #dee2e6;
            margin-right: 5px;
            margin-bottom: 5px; /* For wrapping */
            border-radius: 4px;
            font-size: 0.9em;
            line-height: 1.2; /* Adjust for button-like appearance */
            text-decoration: none !important;
            color: #007bff; /* Standard link color for pagination */
            background-color: #fff;
        }
        #pgt .pg a:hover, #pgt .pgb a:hover {
            background-color: #e9ecef;
            text-decoration:none;
            color: #0056b3;
        }
        #pgt .pg strong { /* Current page */
            background-color: #007bff;
            color: white !important;
            border-color: #007bff;
        }
        #pgt .pg label {
            display: inline-flex;
            align-items: center;
            border: 1px solid #dee2e6;
            padding: 8px 12px;
            margin-right: 5px;
            margin-bottom: 5px;
            border-radius: 4px;
            font-size: 0.9em;
            background-color: #fff;
        }
        #pgt .pg label input.px {
            width: 45px;
            text-align: center;
            margin: 0 5px;
            padding: 6px;
            border: 1px solid #ced4da;
            border-radius: 3px;
            line-height: normal; /* Reset for input */
        }
        #pgt .pg label span { white-space: nowrap;}

        /* 發帖/回覆按鈕樣式 */
        #pgt > a#newspecial,
        #pgt > a#post_reply {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 15px;
            background-color: #28a745; /* Green for primary actions */
            color: white !important;
            border: none;
            border-radius: 4px;
            font-size: 0.95em;
            font-weight: 500;
            text-decoration: none !important;
            transition: background-color 0.2s;
            cursor: pointer;
            min-width: 90px; /* Give them a bit more space */
            text-align: center;
            line-height: 1.4;
            vertical-align: middle;
            box-sizing: border-box;
        }
        #pgt > a#newspecial:hover,
        #pgt > a#post_reply:hover {
            background-color: #218838; /* Darker green */
        }
        #pgt > a#newspecial img,
        #pgt > a#post_reply img {
            display: none !important; /* Hide the original image */
        }
        #pgt > a#newspecial::before {
            content: "發新帖";
        }
        #pgt > a#post_reply::before {
            content: "回覆";
        }


        /* 6. Post List Container (#postlist) & Header (View/Reply counts) */
        /* (These styles are primarily for viewthread.php) */
        #postlist.pl.bm {
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            margin-bottom: 25px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.04);
            padding:0;
            overflow: hidden; /* Important for border-radius on inner tables */
        }
        #postlist > table:first-of-type { /* View/Reply counts & thread title header table */
            margin:0;
            border-bottom: 1px solid #e9ecef; /* Separator for the header itself */
        }
        #postlist > table:first-of-type td.pls {
            padding: 12px 18px;
            background-color: #f8f9fa;
            border-top-left-radius: 7px; /* Match parent minus border */
            font-size: 0.9em;
            border-bottom: none; /* Remove individual bottom border, parent table has it */
        }
        #postlist > table:first-of-type td.plc { /* Also thread title cell */
            padding: 12px 18px;
            background-color: #f8f9fa;
            border-top-right-radius: 7px; /* Match parent minus border */
            border-bottom: none;
        }
        #postlist h1.ts { /* Thread title text */
            font-size: 1.4em;
            margin: 0;
            line-height: 1.4;
        }
        #postlist h1.ts a[href*="typeid"] { /* Thread type prefix link e.g. [其它] */
            font-size: 0.8em;
            background-color: #6c757d;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            margin-right: 8px;
            text-decoration: none;
            vertical-align: middle;
        }
        #postlist .xg1 { font-size: 0.9em; } /* Generic light gray text in postlist header */


        /* 7. Individual Posts (table.plhin in viewthread.php) */
        table.plhin {
            width: 100%;
            border-top: 1px solid #e9ecef;
        }
        #postlist > div[id^="post_"]:first-of-type > table.plhin {
            border-top: none;
        }
        table.plhin > tbody > tr {
            display: grid;
            grid-template-columns: 220px 1fr;
            gap: 0;
        }
        td.pls { /* User info sidebar */
            padding: 18px;
            background-color: #f8f9fa;
            border-right: 1px solid #e9ecef;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
            grid-column: 1;
            grid-row: 1;
            font-size: 0.9em;
        }
        td.pls .pi { margin-bottom: 10px; text-align: center; }
        td.pls .pi .authi a.xw1 {
            font-weight: 600;
            font-size: 1.1em;
            color: #333;
            display: block;
            margin-bottom: 8px;
        }
        td.pls .avatar { text-align:center; margin-bottom: 10px; }
        td.pls .avatar img {
            max-width: 100px;
            border-radius: 50%;
            border: 3px solid #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.08);
        }
        td.pls .tns {
            font-size: 0.9em;
            color: #555;
            text-align: center;
            width: 100%;
        }
        td.pls .tns table, td.pls .tns tr, td.pls .tns th, td.pls .tns td { border: none; padding: 2px 0; display: block; }
        td.pls .tns tr { display:flex; justify-content:space-between; width:100%; margin-bottom:5px;}
        td.pls .tns th, td.pls .tns td { flex:1; text-align: left;}
        td.pls .tns th { color: #777; }
        td.pls .tns p { margin:0; }

        td.pls > p {
            font-size: 0.9em;
            color: #6c757d;
            text-align: center;
            margin: 3px 0;
        }
        td.pls > p em a { color: #495057; font-style: normal; }
        td.pls p.xg1 { font-size:0.85em; text-align:center;}
        td.pls span[id^="g_up"] img, td.pls > p:nth-of-type(3) span img {
            height: 12px;
        }
        td.pls .md_ctrl { text-align: center; margin: 8px 0; }
        td.pls .md_ctrl img { margin: 0 2px; opacity:0.8; transition: opacity .2s;}
        td.pls .md_ctrl img:hover { opacity:1; }
        td.pls ul.xl {
            list-style: none;
            padding: 0;
            margin: 10px auto 0 auto;
            text-align: center;
        }
        td.pls ul.xl li {
            display: inline-block;
            margin: 0 5px;
        }
        td.pls ul.xl li a {
            display: inline-block;
            padding: 6px 12px;
            background-color: #007bff;
            color: white !important;
            border-radius: 4px;
            font-size: 0.9em;
        }
        td.pls ul.xl li a:hover { background-color: #0056b3; text-decoration:none; }

        td.plc { /* Post content area */
            padding: 20px 25px;
            flex-grow: 1;
            min-width: 0;
            overflow-wrap: break-word;
            grid-column: 2;
            grid-row: 1;
        }
        td.plc .pi { /* Post info bar: floor, author, time, etc. */
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 18px;
            font-size: 0.9em;
            color: #6c757d;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 12px;
        }
        td.plc .pi strong { /* Post number (e.g., 1#) */
            font-size: 1.1em;
            font-weight: bold;
            order: -1; /* Push to far left */
            margin-right: auto;
        }
        td.plc .pi .authi { /* Author name, post time, "只看该作者" (original position) */
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px 15px;
        }
        td.plc .pi .authi img.authicn { margin-right: 4px; } /* Online status icon */
        /* Note: Original "只看该作者" link is hidden by JS and replaced by a fixed button. */

        td.plc .pi .y { /*电梯直达 / Jump to floor */
             display: flex; align-items: center;
        }
        td.plc .pi .y input.px { width: 40px; margin: 0 5px; padding: 3px 5px; border: 1px solid #ced4da; border-radius: 3px; }
        td.plc .pi .y img.vm { vertical-align: middle; }

        .t_f { /* The actual post content */
            font-size: 1rem;
            line-height: 1.75;
            color: #343a40;
            word-wrap: break-word;
        }
        .jammer, span[style*="display:none"] { display: none !important; }
        .t_f br { content: ""; display: block; margin-bottom: 0.6em; }
        .t_f strong { font-weight: 600; }
        .t_f font[color="DarkOrange"] strong { color: #e67e22 !important; }
        .t_f font[color="Red"] { color: #e74c3c !important; }

        .cm { /*点评 / Comments section */
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
        }
        .cm h3 { font-size: 1em; font-weight: 600; margin-bottom: 10px; color: #343a40; }
        .cm .pstl { /* Individual comment */
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            margin-bottom: 10px;
            font-size: 0.9em;
        }
        .cm .psta img { /* Comment author avatar */
            width: 32px;
            height: 32px;
            border-radius: 50%;
        }
        .cm .psti { flex-grow: 1; }
        .cm .psti .xi2.xw1 { font-weight: bold; color: #0056b3; }
        .cm .psti .xg1 { font-size: 0.9em; color: #6c757d; display:block; margin-top:3px; }

        .po.hin .pob { /* Post actions: Reply, Report etc. */
            margin-top: 18px;
            padding-top: 12px;
            border-top: 1px dashed #e0e0e0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 15px;
        }
        .po.hin .pob a {
            font-size: 0.9em;
            color: #495057;
            padding: 6px 12px;
            border: 1px solid transparent;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        .po.hin .pob a:hover { color: #007bff; background-color:#e9ecef; text-decoration:none; }
        .po.hin .pob a.fastre { /* Quick reply link */
            background-color: #007bff;
            color: white !important;
            border-color: #007bff;
        }
        .po.hin .pob a.fastre:hover { background-color: #0056b3; border-color: #0056b3; color:white !important; }
        .po.hin .pob a.replyadd, .po.hin .pob a.replysubtract {
             border:1px solid #ccc;
             background-color: #f8f9fa;
        }
         .po.hin .pob a.replyadd:hover, .po.hin .pob a.replysubtract:hover {
             background-color: #e2e6ea;
             border-color: #adb5bd;
        }

        #p_btn { /* Favorite, Like, Dislike buttons */
            padding-bottom: 15px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 15px;
        }
        #p_btn a {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border: 1px solid #ced4da;
            border-radius: 20px;
            font-size: 0.85em;
            color: #495057;
            background-color: #f8f9fa;
        }
        #p_btn a:hover { background-color: #e2e6ea; border-color: #adb5bd; text-decoration:none;}
        #p_btn img { margin-right: 5px; height: 14px; width:auto;}
        #p_btn span { font-weight: bold; margin-left:3px; }

        .sign { /* User signature */
            font-size: 0.9em;
            color: #555;
            padding: 15px;
            border-top: 1px dotted #e9ecef;
            margin-top:15px;
            background-color: #fbfcfd;
            line-height:1.5;
            clear: both;
        }

        /* Hide various ads */
        .wp.a_h, .wp.a_t, .a_pt, table.ad, div[id*="cpro_"], div[id*="tanxssp"], iframe[src*="pos.baidu.com"],
        #player-container /* <--- Added this based on provided HTML */
        {
            display: none !important;
        }

        /* 8. Fast Reply Form (#f_pst) */
        #f_pst {
            margin-top: 25px;
            padding: 20px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
        }
        #fastpostform table { width: 100%; }
        #f_pst .pls { display: none; } /* Hide avatar in quick reply */
        #fastpostmessage { /* Textarea */
            width: 100%;
            padding: 12px;
            border: 1px solid #ced4da;
            border-radius: 6px;
            min-height: 120px;
            font-size: 1em;
            line-height: 1.6;
            box-sizing: border-box;
        }
        #f_pst .tedt .bar { /* Toolbar */
            background-color: #e9ecef;
            padding: 8px 10px;
            border-radius: 6px 6px 0 0;
            border-bottom: 1px solid #ced4da;
            margin-bottom: -1px; /* Overlap textarea border */
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        #f_pst .tedt .bar .fpd { /* Toolbar icons container */
           flex-grow: 1;
        }
        #f_pst .tedt .bar .y { /* "高级模式" link */ font-size: 0.9em; float:none; }
        #f_pst .fpd a { /* Toolbar icons */
            margin-right: 8px;
            color: #495057;
            padding: 3px 5px;
            display: inline-block;
            vertical-align: middle;
        }
        #f_pst .fpd a:hover { background-color: #d4dae0; border-radius:3px; text-decoration:none; }
        #f_pst .pnpost { margin-top: 15px; display: flex; justify-content: space-between; align-items: center; }
        #fastpostsubmit {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 1em;
            border-radius: 4px;
            cursor: pointer;
        }
        #fastpostsubmit:hover { background-color: #218838; }
        #f_pst .y { font-size:0.9em; } /* Contains "本版積分規則" & checkbox */
        #fastpostrefresh { margin-left:10px; }

        /* 9. Footer (#ft) */
        #ft {
            margin-top: 30px;
            padding: 25px 15px;
            border-top: 1px solid #dee2e6;
            font-size: 0.85em;
            color: #6c757d;
            text-align: center;
        }
        #ft p { margin: 5px 0; }
        #flk, #frt { /* Ensure floats are reset for centering */
            float: none !important;
            text-align: center;
            margin-bottom: 8px; /* Space between the two divs */
        }
        #debuginfo { display: block; margin-top:10px; font-size:0.9em; color: #aaa;}

        /* 10. Miscellaneous Discuz Elements (Removed duplicate #scrolltop styles here) */
        #toptb {
            background-color: #343a40;
            color: #adb5bd;
            font-size: 0.85em;
            padding: 5px 0;
        }
        #toptb .wp { background:transparent; box-shadow:none; padding:0 15px; max-width:1200px; display:flex; justify-content:flex-end; align-items: center; }
        #toptb a { color: #dee2e6; margin-left: 15px; }
        #toptb a:hover { color: #fff; text-decoration:none; }

        .p_pop { /* General Pop-up menus (e.g. user card, not custom panels) */
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 5px 15px rgba(0,0,0,0.15);
            border-radius: 6px;
            padding: 10px;
            z-index: 1050 !important;
        }
        .p_pop ul { list-style: none; padding: 0; margin: 0; }
        .p_pop li a {
            display: block;
            padding: 8px 12px;
            color: #333;
            border-radius: 4px;
            font-size:0.95em;
            white-space: nowrap;
        }
        .p_pop li a:hover { background-color: #f0f2f5; text-decoration:none; }

        /* IP Notice Styling */
        #ip_notice { position:fixed; bottom:10px; left:10px; right:auto; max-width:400px; margin:auto; z-index:1060; }
        #ip_notice .bm { border-radius:6px; box-shadow: 0 3px 10px rgba(0,0,0,0.2); }
        #ip_notice .bm_h { background-color: #dc3545; color:white; border-top-left-radius:6px; border-top-right-radius:6px; padding:8px 12px; font-size:1em;}
        #ip_notice .bm_h a.y { color:white; opacity:0.8; font-size: 0.9em; line-height:1em; }
        #ip_notice .bm_h a.y:hover { opacity:1; text-decoration:none;}
        #ip_notice .bm_c { padding:12px; background-color: #fdfdfe; }
        #ip_notice .bm_c dl dd { font-size:0.9em; line-height:1.5; }

        /* Discuz smiley popup table */
        #fastpostsml_menu table { border: 1px solid #eee;}
        #fastpostsml_menu td { padding:5px; border:1px solid #eee; cursor:pointer;}
        #fastpostsml_menu td:hover { background:#f0f0f0; }
        #fastpostsml_menu .tb_s { margin-bottom:5px;} /* Smiley category tabs */
        #fastpostsml_menu .tb_s li a { padding:5px 10px; display:block; }


        /* --- 11. Hide Unnecessary Elements (Removed #scrolltop span a b from here) --- */
        /* Based on modern design principles and user request */
        #toptb .y #switchblind, /* 辅助访问 */
        #toptb .y #switchwidth, /* 切换到窄版 */
        #toptb .y #sslct, /* 切换风格 */
        #sslct_menu, /* 切换风格的弹出菜单 */
        #scbar_hot_td, /* 搜索栏热搜 */
        #debuginfo, /* 页脚的调试信息 */
        #flk p, /* 移除手机版等链接段落 */
        #frt p /* 移除 Powered by Discuz! 等版权段落 */
        {
            display: none !important;
        }
        /* 移除 Discuz DIY 区域占位符 (如果它们是空的或者不想显示) */
        #diynavtop.area,
        #diy1.area,
        #diy3.area,
        #diy4.area,
        #diyforumdisplaybottom.area {
            display: none !important;
        }
        /* Note: #um .avt and ad areas are already handled elsewhere in general ad hiding */


        /* --- 12. Moved and Modernized "View Only Author" Button --- */
        #modernized-author-only-btn {
            position: fixed;
            right: 20px;
            bottom: 115px; /* Position it above the dark mode toggle button */
            z-index: 1069; /* Slightly below dark mode toggle if they might overlap, or same */
            padding: 7px 10px;
            background-color: #007bff; /* Primary blue */
            color: white !important; /* Ensure text is white */
            border: 1px solid #0056b3;
            border-radius: 5px;
            cursor: pointer;
            font-size: 13px;
            line-height: 1.2;
            box-shadow: 0 2px 5px rgba(0,0,0,0.15);
            transition: background-color 0.2s, transform 0.1s ease-out;
            opacity: 0.85;
            user-select: none;
            text-decoration: none !important;
        }
        #modernized-author-only-btn:hover {
            background-color: #0056b3; /* Darker blue on hover */
            opacity: 1;
            text-decoration: none !important;
        }
        #modernized-author-only-btn:active {
            transform: scale(0.96);
        }


        /* --- 13. Hide Standalone "Next Page" Button (autopbn) --- */
        /* We will style the "Next Page" link within the main bottom pagination bar instead */
        #autopbn {
            display: none !important;
        }

        /* Ensure thread list content area has no horizontal padding */
        #threadlist > div.bm_c {
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        /* --- 14. Modernized Bottom Pagination Bar (forumdisplay.php) --- */
        /* Selector for the bottom pagination bar container */
        .bm.bw0.pgs.cl {
            display: flex;
            justify-content: space-between; /* Align page numbers left, buttons right */
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 25px; /* Space above */
            margin-bottom: 15px; /* Space below */
            padding: 10px 0; /* Vertical padding, no horizontal for full width effect within #wp */
            border-top: 1px solid #e9ecef;
            background: transparent !important; /* Clear any default background */
            border-bottom: none !important; /* Clear any default bottom border */
            box-shadow: none !important; /* Clear any default shadow */
        }

        /* Page numbers container within the bottom bar */
        .bm.bw0.pgs.cl #fd_page_bottom .pg {
            margin: 0;
            padding: 0;
            display: flex; /* Align items horizontally */
            align-items: center;
            flex-wrap: wrap;
        }

        /* Standard page links, current page (strong), and "Return" button (.pgb a) */
        .bm.bw0.pgs.cl #fd_page_bottom .pg a:not(.nxt), /* All 'a' except 'Next Page' */
        .bm.bw0.pgs.cl #fd_page_bottom .pg strong,
        .bm.bw0.pgs.cl span.pgb > a { /* Target the "Return" link */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            border: 1px solid #dee2e6;
            margin-right: 5px;
            margin-bottom: 5px; /* For wrapping */
            border-radius: 4px;
            font-size: 0.9em;
            line-height: 1.2;
            text-decoration: none !important;
            color: #007bff;
            background-color: #fff;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }

        .bm.bw0.pgs.cl #fd_page_bottom .pg a:not(.nxt):hover,
        .bm.bw0.pgs.cl span.pgb > a:hover {
            background-color: #e9ecef;
            text-decoration: none;
            color: #0056b3;
        }

        .bm.bw0.pgs.cl #fd_page_bottom .pg strong { /* Current page */
            background-color: #007bff;
            color: white !important;
            border-color: #007bff;
        }

        /* Page input label */
        .bm.bw0.pgs.cl #fd_page_bottom .pg label {
            display: inline-flex;
            align-items: center;
            border: 1px solid #dee2e6;
            padding: 8px 12px;
            margin-right: 5px;
            margin-bottom: 5px;
            border-radius: 4px;
            font-size: 0.9em;
            background-color: #fff;
        }
        .bm.bw0.pgs.cl #fd_page_bottom .pg label input.px {
            width: 45px;
            text-align: center;
            margin: 0 5px;
            padding: 6px;
            border: 1px solid #ced4da;
            border-radius: 3px;
            line-height: normal; /* Reset for input */
        }
        .bm.bw0.pgs.cl #fd_page_bottom .pg label span { white-space: nowrap; }

        /* Prominent "Next Page" link (a.nxt) */
        .bm.bw0.pgs.cl #fd_page_bottom .pg a.nxt {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 15px !important; /* Slightly more padding for prominence */
            margin-left: 5px; /* Space from other page numbers */
            margin-bottom: 5px;
            background-color: #007bff !important;
            color: white !important;
            border: 1px solid #0056b3 !important;
            border-radius: 4px;
            font-size: 0.9em;
            font-weight: 500;
            line-height: 1.2;
            text-decoration: none !important;
            transition: background-color 0.2s, border-color 0.2s;
        }
        .bm.bw0.pgs.cl #fd_page_bottom .pg a.nxt:hover {
            background-color: #0056b3 !important;
            border-color: #004085 !important;
            color: white !important;
        }

        /* "New Post" button at the bottom */
        .bm.bw0.pgs.cl > a[id^="newspecial"] { /* Catches newspecial and newspecialtmp */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 15px;
            background-color: #28a745; /* Green for primary actions */
            color: white !important;
            border: none;
            border-radius: 4px;
            font-size: 0.95em;
            font-weight: 500;
            text-decoration: none !important;
            transition: background-color 0.2s;
            cursor: pointer;
            min-width: 90px;
            text-align: center;
            line-height: 1.4;
            box-sizing: border-box;
            order: 3; /* Push to the right if flex items reorder */
        }
        .bm.bw0.pgs.cl > a[id^="newspecial"]:hover {
            background-color: #218838; /* Darker green */
        }
        .bm.bw0.pgs.cl > a[id^="newspecial"] img {
            display: none !important; /* Hide the original image */
        }
        .bm.bw0.pgs.cl > a[id^="newspecial"]::before {
            content: "發新帖";
        }

        /* The span.pgb itself needs some alignment adjustment */
        .bm.bw0.pgs.cl span.pgb {
            order: 2; /* To position it before New Post button potentially */
        }

        /* Ensure the span containing page numbers is first */
        .bm.bw0.pgs.cl #fd_page_bottom {
            order: 1;
            flex-grow: 1; /* Allow it to take available space if needed */
        }


        /* --- 15. Modernized Bottom Post Navigation/Pagination (viewthread.php, below posts) --- */
        /* This targets both the simple .pgbtn and the more complex .pgs.mtm.mbm.cl */

        /* Common container style for both types of bottom pagination */
        #ct > div.pgbtn,
        #ct > div.pgs.mtm.mbm.cl {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 25px; /* Space above */
            margin-bottom: 15px; /* Space below */
            padding: 10px 0; /* Vertical padding, no horizontal for full width effect within #wp */
            border-top: 1px solid #e9ecef;
            background: transparent !important;
            border-bottom: none !important;
            box-shadow: none !important;
        }

        /* Styling for the simple "Next Page" button (.pgbtn) */
        #ct > div.pgbtn a.bm_h { /* The actual link inside .pgbtn */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 15px !important;
            background-color: #007bff !important;
            color: white !important;
            border: 1px solid #0056b3 !important;
            border-radius: 4px;
            font-size: 0.9em;
            font-weight: 500;
            line-height: 1.2;
            text-decoration: none !important;
            transition: background-color 0.2s, border-color 0.2s;
            flex-grow: 1; /* Make it take available space if it's the only item */
            text-align: center;
        }
        #ct > div.pgbtn a.bm_h:hover {
            background-color: #0056b3 !important;
            border-color: #004085 !important;
            color: white !important;
        }

        /* Styling for the complex pagination (.pgs.mtm.mbm.cl) */
        #ct > div.pgs.mtm.mbm.cl .pg { /* Page numbers container */
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            flex-grow: 1; /* Allow page numbers to take space */
        }

        #ct > div.pgs.mtm.mbm.cl .pg a,
        #ct > div.pgs.mtm.mbm.cl .pg strong {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            border: 1px solid #dee2e6;
            margin-right: 5px;
            margin-bottom: 5px; /* For wrapping */
            border-radius: 4px;
            font-size: 0.9em;
            line-height: 1.2;
            text-decoration: none !important;
            color: #007bff;
            background-color: #fff;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }
        #ct > div.pgs.mtm.mbm.cl .pg a:hover {
            background-color: #e9ecef;
            text-decoration: none;
            color: #0056b3;
        }
        #ct > div.pgs.mtm.mbm.cl .pg strong { /* Current page */
            background-color: #007bff;
            color: white !important;
            border-color: #007bff;
        }
        #ct > div.pgs.mtm.mbm.cl .pg label { /* Page input label */
            display: inline-flex;
            align-items: center;
            border: 1px solid #dee2e6;
            padding: 8px 12px;
            margin-right: 5px;
            margin-bottom: 5px;
            border-radius: 4px;
            font-size: 0.9em;
            background-color: #fff;
        }
        #ct > div.pgs.mtm.mbm.cl .pg label input.px {
            width: 45px;
            text-align: center;
            margin: 0 5px;
            padding: 6px;
            border: 1px solid #ced4da;
            border-radius: 3px;
            line-height: normal;
        }
        #ct > div.pgs.mtm.mbm.cl .pg label span { white-space: nowrap; }

        /* "Next Page" link within the complex pagination */
        #ct > div.pgs.mtm.mbm.cl .pg a.nxt {
            padding: 8px 15px !important; /* Prominent */
            margin-left: 5px;
            background-color: #007bff !important;
            color: white !important;
            border: 1px solid #0056b3 !important;
            font-weight: 500;
        }
        #ct > div.pgs.mtm.mbm.cl .pg a.nxt:hover {
            background-color: #0056b3 !important;
            border-color: #004085 !important;
            color: white !important;
        }

        /* "返回列表" button */
        #ct > div.pgs.mtm.mbm.cl span.pgb.y a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 12px;
            border: 1px solid #dee2e6;
            margin-right: 5px; /* Keep some space from action buttons */
            margin-bottom: 5px; /* For wrapping */
            border-radius: 4px;
            font-size: 0.9em;
            line-height: 1.2;
            text-decoration: none !important;
            color: #007bff;
            background-color: #fff;
        }
        #ct > div.pgs.mtm.mbm.cl span.pgb.y a:hover {
            background-color: #e9ecef;
            color: #0056b3;
        }


        /* "發新帖" and "回覆" buttons */
        #ct > div.pgs.mtm.mbm.cl a#newspecial,
        #ct > div.pgs.mtm.mbm.cl a[id^="post_reply"] { /* Catches post_reply and post_replytmp */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 8px 15px;
            background-color: #28a745;
            color: white !important;
            border: none;
            border-radius: 4px;
            font-size: 0.95em;
            font-weight: 500;
            text-decoration: none !important;
            transition: background-color 0.2s;
            cursor: pointer;
            min-width: 90px;
            text-align: center;
            line-height: 1.4;
            box-sizing: border-box;
        }
        #ct > div.pgs.mtm.mbm.cl a#newspecial:hover,
        #ct > div.pgs.mtm.mbm.cl a[id^="post_reply"]:hover {
            background-color: #218838;
        }
        #ct > div.pgs.mtm.mbm.cl a#newspecial img,
        #ct > div.pgs.mtm.mbm.cl a[id^="post_reply"] img {
            display: none !important; /* Hide original images */
        }
        /* Add text content via ::before if images are hidden */
        #ct > div.pgs.mtm.mbm.cl a#newspecial::before {
            content: "發新帖";
        }
        #ct > div.pgs.mtm.mbm.cl a[id^="post_reply"]::before {
            content: "回覆";
        }


        /* ==================== Dark Mode Styles ==================== */
        body.dark-mode {
            background: #121212 none !important;
            color: #e0e0e0;
        }
        body.dark-mode #wp, body.dark-mode .wp {
            background: #1e1e1e none !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        body.dark-mode a { color: #bb86fc; }
        body.dark-mode a:hover { color: #9a71d1; }

        /* Dark mode for Custom Header Elements */
        body.dark-mode #custom-top-bar {
            background-color: #1f1f1f; /* Darker than main content dark */
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            border-bottom: 1px solid #333; /* Separator for dark mode */
        }
        body.dark-mode #custom-logo-area a {
            color: #e0e0e0;
        }
        body.dark-mode #custom-main-nav ul li a {
            color: #b0b0b0;
        }
        body.dark-mode #custom-main-nav ul li a:hover {
            color: #bb86fc;
            background-color: #333;
        }
        body.dark-mode #custom-main-nav ul li.active a {
            color: #bb86fc;
        }

        body.dark-mode .custom-action-button {
            color: #e0e0e0;
        }
        body.dark-mode .custom-action-button:hover {
            background-color: #333;
        }
        body.dark-mode #custom-user-menu-panel,
        body.dark-mode #custom-quick-nav-panel {
            background-color: #2c2c2c;
            border-color: #444;
            box-shadow: 0 5px 15px rgba(0,0,0,0.4);
        }
        body.dark-mode #custom-user-menu-panel ul li a,
        body.dark-mode #custom-quick-nav-panel ul li a {
            color: #d0d0d0;
            border-bottom-color: #3a3a3a;
        }
        body.dark-mode #custom-user-menu-panel ul li a:hover,
        body.dark-mode #custom-quick-nav-panel ul li a:hover {
            background-color: #3a3a3a;
            color: #bb86fc;
        }
        body.dark-mode #custom-quick-nav-panel .cqn-section {
            border-bottom-color: #3a3a3a;
        }
        body.dark-mode #custom-quick-nav-panel .cqn-section-title {
            color: #aaa;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-jump-search input {
            background-color: #1e1e1e;
            border-color: #555;
            color: #e0e0e0;
        }
        /* Dark mode for cloned forum list items */
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl li > p a {
            color: #bb86fc;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl li > p a:hover {
            color: #9a71d1;
            background-color: #333333;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.bbda.xg1 {
            color: #999;
            border-bottom-color: #444;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.xw1 a {
            color: #e0e0e0;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.xw1 a:hover {
             color: #bb86fc;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.sub a {
            color: #c0c0c0;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.sub.a a {
            color: #bb86fc;
        }
        body.dark-mode #custom-quick-nav-panel #cqn-forum-list ul.jump_bdl p.child a {
            color: #a0a0a0;
        }


        body.dark-mode #scbar {
            background: #2c2c2c none !important; /* Slightly lighter than main dark bg */
            border: none; /* Remove border, rely on shadow */
            box-shadow: 0 2px 4px rgba(0,0,0,0.25);
        }
        body.dark-mode #scbar_txt {
             border: none;
             border-bottom: 1px solid #555; /* Darker bottom border */
             background: transparent;
             color: #e0e0e0;
             border-radius: 0;
        }
        body.dark-mode #scbar_txt:focus {
            border-bottom-color: #bb86fc; /* Material purple on focus */
            box-shadow: 0 1px 0 0 #bb86fc;
        }

        body.dark-mode #scbar_type {
            background: transparent none !important;
            color:#b0b0b0;
            border: none;
            border-left: 1px solid #4f4f4f; /* Darker separator */
            border-radius: 0;
        }
        /* #scbar_form #google_btn is already hidden, no specific dark mode needed */

        body.dark-mode #scbar_form #search_btn {
            background-color: #6200ee; /* Material Purple */
            color: white !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3);
        }
        body.dark-mode #scbar_form #search_btn:hover {
            background-color: #3700b3;
            box-shadow: 0 3px 6px rgba(0,0,0,0.25), 0 3px 6px rgba(0,0,0,0.35);
        }
        body.dark-mode #scbar_form #search_btn:active {
            background-color: #2c008c;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        body.dark-mode #pt { background: #282828 none !important; color: #b0b0b0; }
        body.dark-mode #pt a { color: #bb86fc; }
        body.dark-mode #pt em { color: #999; }
        /* Dark mode for specific font colors in #pt announcement links */
        body.dark-mode #pt .bm.cl .y #an #ancl li a font[color="#FF0000"] {
            color: #ff7777 !important; /* 例如，一个更亮的红色，适合暗色背景 */
        }
        body.dark-mode #pt .bm.cl .y #an #ancl li a font { /* 通用后备 */
            color: #dcdcdc !important; /* 如果没有特定匹配，给一个通用的亮灰色 */
        }

        body.dark-mode #pgt { border-bottom-color: #333; }
        body.dark-mode #pgt .pg a, body.dark-mode #pgt .pg strong, body.dark-mode #pgt .pgb a, body.dark-mode #pgt .pg label {
            border-color: #3e3e3e; color: #bb86fc; background: #1e1e1e none !important;
        }
        body.dark-mode #pgt .pg a:hover, body.dark-mode #pgt .pgb a:hover {
            background-color: #333; color: #bb86fc;
        }
        body.dark-mode #pgt .pg strong {
            background: #6200ee none !important; color: white !important; border-color: #6200ee;
        }
        body.dark-mode #pgt .pg label input.px {
             border-color: #3e3e3e; background-color: #0a0a0a; color: #e0e0e0;
        }
        body.dark-mode #pgt > a#newspecial, body.dark-mode #pgt > a#post_reply {
            background: #03dac6 none !important; color: #1e1e1e !important;
        }
        body.dark-mode #pgt > a#newspecial:hover, body.dark-mode #pgt > a#post_reply:hover {
            background-color: #018786;
        }

        /* Post List (Viewthread Page) Dark Mode */
        body.dark-mode #postlist.pl.bm {
            background: #1e1e1e none !important; border-color: #3e3e3e; box-shadow: 0 1px 5px rgba(0,0,0,0.2);
        }
        body.dark-mode #postlist > table:first-of-type { border-bottom-color: #3e3e3e; }
        body.dark-mode #postlist > table:first-of-type td.pls,
        body.dark-mode #postlist > table:first-of-type td.plc { background-color: #282828; } /* View/Reply count row & title row */
        body.dark-mode #postlist h1.ts a[href*="typeid"] { background-color: #555; } /* Thread type prefix */

         /* Individual Posts Dark Mode */
        body.dark-mode table.plhin { border-top-color: #3e3e3e; }
        body.dark-mode td.pls {
            background: #282828 none !important; border-right-color: #3e3e3e;
        }
        body.dark-mode td.pls .pi .authi a.xw1 { color: #e0e0e0; }
        body.dark-mode td.pls .avatar img { border-color: #1e1e1e; }
        body.dark-mode td.pls .tns { color: #b0b0b0; }
        body.dark-mode td.pls .tns th { color: #999; }
        body.dark-mode td.pls > p { color: #b0b0b0; }
        body.dark-mode td.pls > p em a { color: #bb86fc; }
        body.dark-mode td.pls ul.xl li a { background-color: #6200ee; }
        body.dark-mode td.pls ul.xl li a:hover { background-color: #3700b3; }

        body.dark-mode td.plc { color: #e0e0e0; }
        body.dark-mode td.plc .pi { color: #b0b0b0; border-bottom-color: #3e3e3e; }
        body.dark-mode td.plc .pi .y input.px { /*电梯输入框*/
            background-color: #0a0a0a;
            border-color: #3e3e3e;
            color: #e0e0e0;
        }
        body.dark-mode td.plc .pi .y img.vm { /*电梯按钮图标*/
            filter: invert(80%) hue-rotate(180deg);
        }

        /* Dark mode for the moved "View Only Author" button */
        body.dark-mode #modernized-author-only-btn {
            background-color: #6200ee; /* Material Purple for dark mode */
            border-color: #3700b3;
            color: white !important;
        }
        body.dark-mode #modernized-author-only-btn:hover {
            background-color: #3700b3; /* Darker purple */
        }

        body.dark-mode .t_f { color: #e0e0e0; }
        body.dark-mode .t_f font[color="DarkOrange"] strong { color: #f39c12 !important; }
        body.dark-mode .t_f font[color="Red"] { color: #c0392b !important; }

        body.dark-mode .cm { border-top-color: #3e3e3e; }
        body.dark-mode .cm h3 { color: #e0e0e0; }
        body.dark-mode .cm .pstl { background-color: #282828; border-color: #3e3e3e; }
        body.dark-mode .cm .psti .xi2.xw1 { color: #bb86fc; }
        body.dark-mode .cm .psti .xg1 { color: #b0b0b0; }

        body.dark-mode .po.hin .pob { border-top-color: #3e3e3e; }
        body.dark-mode .po.hin .pob a { color: #b0b0b0; }
        body.dark-mode .po.hin .pob a:hover { color: #bb86fc; background-color:#282828; }
        body.dark-mode .po.hin .pob a.fastre { background-color: #6200ee; border-color: #6200ee; }
        body.dark-mode .po.hin .pob a.fastre:hover { background-color: #3700b3; border-color: #3700b3; }
        body.dark-mode .po.hin .pob a.replyadd, body.dark-mode .po.hin .pob a.replysubtract {
             border-color: #555; background: #282828 none !important;
        }
         body.dark-mode .po.hin .pob a.replyadd:hover, body.dark-mode .po.hin .pob a.replysubtract:hover {
             background-color: #333; border-color: #555;
        }

        body.dark-mode #p_btn a {
            border-color: #3e3e3e; color: #b0b0b0; background: #282828 none !important;
        }
        body.dark-mode #p_btn a:hover { background: #333 none !important; border-color: #555; }
        body.dark-mode #p_btn img { filter: invert(80%) hue-rotate(180deg) brightness(1.1); }


        body.dark-mode .sign {
            color: #b0b0b0; border-top-color: #3e3e3e; background: #1a1a1a none !important;
        }

        /* Fast Reply Dark Mode */
        body.dark-mode #f_pst { background: #1e1e1e none !important; border-color: #3e3e3e; }
        body.dark-mode #f_pst .pbt input#subject { /* Quick post title input */
            background-color: #0a0a0a; border: 1px solid #3e3e3e; color: #e0e0e0;
        }
        body.dark-mode #f_pst .pbt span, body.dark-mode #f_pst .pbt strong { color: #b0b0b0;}

        body.dark-mode #fastpostmessage {
            border-color: #3e3e3e; background-color: #0a0a0a; color: #e0e0e0;
        }
        body.dark-mode #f_pst .tedt .bar {
            background: #282828 none !important; border-bottom-color: #3e3e3e;
        }
        body.dark-mode #f_pst .fpd a { color: #b0b0b0; }
        body.dark-mode #f_pst .fpd a:hover { background-color: #3e3e3e; }
        body.dark-mode #fastpostsubmit {
            background: #03dac6 none !important; color: #1e1e1e;
        }
        body.dark-mode #fastpostsubmit:hover { background-color: #018786; }
        body.dark-mode #f_pst .y { color: #b0b0b0; } /* Advanced mode link and積分規則 */


        /* Forum Display Page (forumdisplay.php) / Forum Index Page (pg_index) Dark Mode */
        body.dark-mode .bm.bml.pbn, /* Rules block container on forumdisplay */
        /* body.dark-mode .bm.bmw.fl, /* Sub-forum block container on index/forumdisplay - Covered by more specific rules below */
        body.dark-mode #threadlist .bm_c, /* Main thread list body on forumdisplay */
        body.dark-mode #f_pst > .bm_c, /* Quick post content area on forumdisplay */
        body.dark-mode #newspecial_menu /* New post dropdown menu on forumdisplay */
        {
            background: #1e1e1e none !important; /* Consistent with #wp content area and removes potential bg image */
            border-color: #3e3e3e; /* Standard dark mode border */
        }

        /* Specific dark mode background for the rules block content area */
        body.dark-mode .bm.bml.pbn .bm_c.cl.pbn {
             background: #1e1e1e none !important; /* Match the parent container background */
        }

        body.dark-mode .bm_h { /* Generic block headers, e.g., for rules, subforums */
            background: #2a2a2a none !important; border-bottom-color: #3e3e3e; color: #d0d0d0;
        }
        body.dark-mode .bm_h h1, body.dark-mode .bm_h h2 { color: #e0e0e0; }
        body.dark-mode .bm_h h1 a, body.dark-mode .bm_h h2 a { color: #e0e0e0; }
        body.dark-mode .bm_h .xs1.xw0.i { color: #a0a0a0; }
        body.dark-mode .bm_h .xs1 .xi1 { color: #c0c0c0; }
        body.dark-mode .bm_h .y a { color: #bb86fc; }
        body.dark-mode .bm_h .o img { filter: invert(80%) hue-rotate(180deg); }

        body.dark-mode .bm_c.cl.pbn .ptn.xg2 { /* Forum rules text */
            color: #b0b0b0;
        }
        body.dark-mode .bm_c.cl.pbn .ptn.xg2 font[color="red"] {
            color: #ff7777 !important;
        }
        body.dark-mode .bm.bml.pbn .bm_c > div:first-child { /* Moderator line div within rules (e.g. 美食区) */
            color: #b0b0b0; /* Ensure text color is readable */
        }
        body.dark-mode .bm.bml.pbn .bm_c > div:first-child span.xi2 a { /* Moderator link */
            color: #bb86fc;
        }
        body.dark-mode #f_pst .pbt.cl span, /* "还可输入 XX 个字符" */
        body.dark-mode #f_pst .pbt.cl strong#checklen {
            color: #b0b0b0;
        }


        /* === START: Enhanced Dark Mode for Forum Index Page (pg_index) containers like #ct > div.mn > div.fl.bm === */
        body.dark-mode #ct > div.mn > .fl.bm { /* Outer container for all forum categories */
            background: #1e1e1e none !important;
            border: none !important; /* Assuming #wp provides the main border/shadow */
            padding: 0 !important; /* Reset padding if any, rely on inner elements or #wp */
        }

        body.dark-mode #ct > div.mn > .fl.bm > .bm.bmw.cl { /* Each individual category block (e.g., "== 綜合類別 ==") */
            background: #1e1e1e none !important; /* Or a slightly different dark shade if preferred, e.g., #222 */
            border: 1px solid #3e3e3e !important;
            margin-bottom: 20px; /* Spacing between category blocks */
        }

        body.dark-mode #ct > div.mn > .fl.bm > .bm.bmw.cl > .bm_h.cl { /* Header of a category block */
            background: #2a2a2a none !important;
             border-bottom: 1px solid #3e3e3e !important;
             color: #d0d0d0 !important;
        }
        body.dark-mode #ct > div.mn > .fl.bm > .bm.bmw.cl > .bm_h.cl h2 a { /* Title link in header */
            color: #e0e0e0 !important;
        }
        body.dark-mode #ct > div.mn > .fl.bm > .bm.bmw.cl > .bm_h.cl .o img { /* Collapse/expand icon in header */
            filter: invert(80%) hue-rotate(180deg);
        }

        body.dark-mode #ct > div.mn > .fl.bm > .bm.bmw.cl > .bm_c { /* Content area of a category block (holds the table) */
            background-color: transparent !important; /* Should show background of .bm.bmw.cl */
            padding: 0 !important; /* Table usually has its own padding/margins */
        }

        /* Table listing forums (.fl_tb) inside .bm_c */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb {
             /* background should be transparent to show .bm_c's (ultimately .bm.bmw.cl's) background */
        }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb td {
            border-bottom-color: #333 !important;
            color: #c0c0c0; /* Default text color for td */
        }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb tr:hover td {
            background-color: #2c2c2c !important;
        }
        /* Icons in forum list */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb td.fl_icn img {
            filter: invert(85%) hue-rotate(180deg) saturate(30%) brightness(1.1);
        }
        /* Forum titles in list */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb h2 a {
            color: #bb86fc;
        }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb h2 a:hover {
            color: #9a71d1;
        }
        /* Today's post count */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb h2 em.xw0.xi1 {
             color: #a0a0a0;
        }
        /* Forum descriptions (p.xg2) */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 {
            color: #a0a0a0; /* Slightly dimmer for descriptions */
        }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="DimGray"] { color: #9e9e9e !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="Teal"] { color: #4db6ac !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="DarkOrange"] { color: #ffb74d !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="Blue"] { color: #90caf9 !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="Indigo"] { color: #9fa8da !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="Orange"] { color: #ffcc80 !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="Red"] { color: #ff7777 !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="DarkRed"] { color: #ff8a80 !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="green"] { color: #81c784 !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color="DarkGreen"] { color: #66bb6a !important; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 a { /* Links within description (sub-forums, etc) */
            color: #bb86fc;
        }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 a:hover {
            color: #9a71d1;
        }
        /* Moderator links in description */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 span.xi2 a.notabs,
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb p.xg2 span.xi2 a.notabs strong {
             color: #bb86fc;
        }

        /* Thread/Post counts */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb .fl_i span.xi2 { color: #ccc; }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb .fl_i span.xg1 { color: #999; }

        /* Last post info */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb .fl_by div a.xi2 { /* Last post title link */
            color: #bb86fc;
        }
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb .fl_by div cite, /* Timestamp and author */
        body.dark-mode #ct > div.mn > .fl.bm .fl_tb .fl_by div cite a { /* Author link in last post */
            color: #999;
        }
        /* === END: Enhanced Dark Mode for Forum Index Page (pg_index) containers === */


        /* Sub-forum listing (on forumdisplay.php and index.php) - General rules, might be partly overridden by above for index */
        body.dark-mode .fl_tb td {
            border-bottom-color: #333; color: #c0c0c0;
        }
        body.dark-mode .fl_tb tr:hover td { background-color: #2c2c2c; }
        body.dark-mode .fl_tb td.fl_icn img { filter: invert(85%) hue-rotate(180deg) saturate(30%) brightness(1.1); }
        body.dark-mode .fl_tb h2 a { color: #bb86fc; }
        body.dark-mode .fl_tb p.xg2 { color: #999; }
        body.dark-mode .fl_tb p.xg2 font[color="DimGray"] { color: #9e9e9e !important; }
        body.dark-mode .fl_tb p.xg2 font[color="Teal"] { color: #4db6ac !important; }
        body.dark-mode .fl_tb p.xg2 font[color="DarkOrange"] { color: #ffb74d !important; }
        body.dark-mode .fl_tb p.xg2 font[color="Blue"] { color: #90caf9 !important; }
        body.dark-mode .fl_tb p.xg2 font[color="Indigo"] { color: #9fa8da !important; }
        body.dark-mode .fl_tb p.xg2 font[color="Orange"] { color: #ffcc80 !important; }
        body.dark-mode .fl_tb td p.xg2 span.xi2 a.notabs,
        body.dark-mode .fl_tb td p.xg2 span.xi2 a.notabs strong { color: #bb86fc; }
        body.dark-mode .fl_tb td p.xg2 span.xi2 a.notabs:hover,
        body.dark-mode .fl_tb td p.xg2 span.xi2 a.notabs strong:hover { color: #9a71d1; }
        body.dark-mode .fl_tb td p.xg2 a { color: #bb86fc; }
        body.dark-mode .fl_tb td p.xg2 a:hover { color: #9a71d1; }

        body.dark-mode .fl_tb .fl_i span.xi2 { color: #ccc; }
        body.dark-mode .fl_tb .fl_i span.xg1 { color: #999; }
        body.dark-mode .fl_tb .fl_by div a.xi2 { color: #bb86fc; }
        body.dark-mode .fl_tb .fl_by div cite,
        body.dark-mode .fl_tb .fl_by div cite a { color: #999; }

        /* Thread List Header (#threadlist .th on forumdisplay.php) */
        body.dark-mode #threadlist .th {
            background: #2a2a2a none !important; border-bottom: 1px solid #3e3e3e; color: #b0b0b0;
        }
        body.dark-mode #threadlist .th a { color: #bb86fc; }
        body.dark-mode #threadlist .th a:hover { color: #9a71d1; }

        /* Thread List Items (#threadlisttableid on forumdisplay.php) */
        body.dark-mode #threadlisttableid td,
        body.dark-mode #threadlisttableid th {
            background: transparent none !important; /* Make transparent to show parent background, remove potential original background image */
            border-bottom: 1px solid #3e3e3e !important; /* Strengthen border */
            color: #c0c0c0 !important; /* Strengthen text color */
        }
        body.dark-mode #threadlisttableid tbody:hover > tr > td,
        body.dark-mode #threadlisttableid tbody:hover > tr > th {
            background: #2a2a2a none !important; /* Ensure hover state also removes background image */
        }

        body.dark-mode #threadlisttableid td.icn img[src*="static/image/common/folder_"],
        body.dark-mode #threadlisttableid td.icn img[src*="static/image/common/pin_"],
        body.dark-mode #threadlisttableid td.icn img[src*="static/image/common/ann_icon.gif"] {
            filter: invert(85%) hue-rotate(180deg) saturate(30%) brightness(1.1);
        }
         body.dark-mode #threadlisttableid td.icn img[src*="static/image/common/folder_lock.gif"] {
            filter: invert(75%) hue-rotate(180deg) saturate(20%) brightness(1);
        }
        body.dark-mode #threadlisttableid th a.s.xst { color: #cceeff; }
        body.dark-mode #threadlisttableid th a.s.xst:visited { color: #aaddff; }
        body.dark-mode #threadlisttableid th strong.xst a { color: #ffaa99 !important; }
        body.dark-mode #threadlisttableid th a[style*="#EE1B2E"],
        body.dark-mode #threadlisttableid th a[style*="#FF0000"] { color: #ff7777 !important; }
        body.dark-mode #threadlisttableid th a[style*="#2B65B7"] { color: #90caf9 !important; }
        body.dark-mode #threadlisttableid th a[style*="#3C9D40"] { color: #a5d6a7 !important; }
        body.dark-mode #threadlisttableid th .tps a { color: #999; }
        body.dark-mode #threadlisttableid th .tps a:hover { color: #bbb; }
        body.dark-mode #threadlisttableid th img[alt="recommend"],
        body.dark-mode #threadlisttableid th img[alt="agree"],
        body.dark-mode #threadlisttableid th img[alt="新人帖"],
        body.dark-mode #threadlisttableid th img[src*="stamp/"] {
             filter: invert(90%) hue-rotate(180deg) brightness(0.9) contrast(0.9);
        }
        body.dark-mode #threadlisttableid th span.xw1 { color: #f48fb1; }
        body.dark-mode #threadlisttableid td.by cite,
        body.dark-mode #threadlisttableid td.by cite a { color: #b0bec5; }
        body.dark-mode #threadlisttableid td.by cite a:hover { color: #cfd8dc; }
        body.dark-mode #threadlisttableid td.by em,
        body.dark-mode #threadlisttableid td.by em span { color: #888; }
        body.dark-mode #threadlisttableid td.num a { color: #b0b0b0; }
        body.dark-mode #threadlisttableid td.num em { color: #909090; }
        body.dark-mode #separatorline tr.ts th a { color: #ccc; }

        /* Filter popups below threadlist (on forumdisplay.php) */
        body.dark-mode #filter_special_menu ul li a,
        body.dark-mode #filter_reward_menu ul li a,
        body.dark-mode #filter_dateline_menu ul.pop_moremenu li,
        body.dark-mode #filter_dateline_menu ul.pop_moremenu a,
        body.dark-mode #filter_orderby_menu ul li a {
            /* Covered by .p_pop, specificity might be needed if issues arise */
        }
        body.dark-mode #filter_dateline_menu ul.pop_moremenu a.xw1 { color: #bb86fc; font-weight: bold; }


        /* Forum Index Page (pg_index) Dark Mode - Specifics already handled by enhanced section above and general .fl_tb rules */
        /* body.dark-mode .fl.bm .bm_h h2 a { color: #e0e0e0; } (Covered by enhanced section) */
        /* body.dark-mode .fl.bm .bm_h h2 a:hover { color: #ffffff; } (Covered by enhanced section) */

        /* Specific inline styled forum titles on pg_index */
        body.dark-mode .fl_tb td h2 a[style*="#00A5E9"] { color: #69c0ff !important; }
        /* body.dark-mode .fl_tb td h2 em.xw0.xi1 { color: #a0a0a0; } (Covered by enhanced section) */

        /* Forum descriptions and inline font colors on pg_index */
        /* All .fl_tb p.xg2 font[color] rules are covered by the enhanced section for #ct > div.mn > .fl.bm .fl_tb p.xg2 font[color] */

        /* Moderator links in description on pg_index */
        /* body.dark-mode .fl_tb td p.xg2 span.xi2 a.notabs, (Covered by enhanced section) */

        /* Sub-forum links in description (e.g., <u>...</u>) on pg_index */
        /* body.dark-mode .fl_tb td p.xg2 a { color: #bb86fc; } (Covered by enhanced section) */

        /* Ensure main forum category containers on pg_index inherit dark background */
        /* body.dark-mode .fl.bm, (Covered by enhanced #ct > div.mn > .fl.bm) */
        /* body.dark-mode .bm.bmw.cl { (Covered by enhanced #ct > div.mn > .fl.bm > .bm.bmw.cl) */


        /* Footer Dark Mode */
        body.dark-mode #ft { border-top-color: #3e3e3e; color: #b0b0b0; }
        body.dark-mode #ft a { color: #bb86fc; }
        body.dark-mode #debuginfo { color: #777; } /* Though it's hidden by another rule */

        /* Misc Dark Mode */
        body.dark-mode #toptb {
            background: #0a0a0a none !important; color: #999;
        }
        body.dark-mode #toptb a { color: #b0b0b0; }
        body.dark-mode #toptb a:hover { color: #e0e0e0; }

        /* Ensure thread list content area has no horizontal padding */
        #threadlist > div.bm_c {
            padding-left: 0 !important;
            padding-right: 0 !important;
        }

        /* --- Dark Mode for Bottom Post Navigation/Pagination (viewthread.php) --- */
        body.dark-mode #ct > div.pgbtn,
        body.dark-mode #ct > div.pgs.mtm.mbm.cl {
            border-top-color: #3e3e3e;
        }

        /* Dark mode for simple "Next Page" button (.pgbtn) */
        body.dark-mode #ct > div.pgbtn a.bm_h {
            background-color: #6200ee !important; /* Material Purple */
            border-color: #3700b3 !important;
            color: white !important;
        }
        body.dark-mode #ct > div.pgbtn a.bm_h:hover {
            background-color: #3700b3 !important;
            border-color: #2c008c !important;
        }

        /* Dark mode for complex pagination (.pgs.mtm.mbm.cl) */
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg a,
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg strong {
            border-color: #3e3e3e;
            color: #bb86fc;
            background: #1e1e1e none !important;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg a:hover {
            background-color: #333;
            color: #bb86fc;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg strong { /* Current page */
            background: #6200ee none !important;
            color: white !important;
            border-color: #6200ee;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg label { /* Page input label */
            border-color: #3e3e3e;
            background-color: #1e1e1e;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg label input.px {
            border-color: #3e3e3e;
            background-color: #0a0a0a;
            color: #e0e0e0;
        }

        /* "Next Page" link within complex pagination */
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg a.nxt {
            background-color: #6200ee !important;
            border-color: #3700b3 !important;
            color: white !important;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl .pg a.nxt:hover {
            background-color: #3700b3 !important;
            border-color: #2c008c !important;
        }

        /* "返回列表" button */
        body.dark-mode #ct > div.pgs.mtm.mbm.cl span.pgb.y a {
            border-color: #3e3e3e;
            color: #bb86fc;
            background-color: #1e1e1e;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl span.pgb.y a:hover {
            background-color: #333;
            color: #bb86fc;
        }

        /* "發新帖" and "回覆" buttons */
        body.dark-mode #ct > div.pgs.mtm.mbm.cl a#newspecial,
        body.dark-mode #ct > div.pgs.mtm.mbm.cl a[id^="post_reply"] {
            background: #03dac6 none !important;
            color: #1e1e1e !important;
        }
        body.dark-mode #ct > div.pgs.mtm.mbm.cl a#newspecial:hover,
        body.dark-mode #ct > div.pgs.mtm.mbm.cl a[id^="post_reply"]:hover {
            background-color: #018786;
        }


        /* Dark Mode Toggle Button Styles - Modernized */
        #dark-mode-toggle-btn {
            position: fixed;
            right: 20px;
            bottom: 70px; /* Adjust position as needed, below author-only button if both are present */
            z-index: 1070;
            padding: 7px 10px; /* Consistent with author-only */
            background-color: #6c757d; /* Neutral dark gray for toggle */
            color: white !important;
            border: 1px solid #5a6268;
            border-radius: 5px; /* Consistent */
            cursor: pointer;
            font-size: 13px; /* Consistent */
            line-height: 1.2; /* Consistent */
            box-shadow: 0 2px 5px rgba(0,0,0,0.15); /* Consistent */
            transition: background-color 0.2s, transform 0.1s ease-out, border-color 0.2s;
            opacity: 0.85;
            user-select: none;
            text-decoration: none !important;
        }
        #dark-mode-toggle-btn:hover {
            background-color: #5a6268; /* Darker gray on hover */
            border-color: #495057;
            opacity: 1;
            text-decoration: none !important;
        }
        #dark-mode-toggle-btn:active {
            transform: scale(0.96);
            background-color: #495057;
        }

        /* Dark Mode for Toggle Button */
        body.dark-mode #dark-mode-toggle-btn {
            background-color: #4f5b62; /* Slightly lighter dark gray for dark mode */
            border-color: #3e484e;
            color: white !important;
        }
        body.dark-mode #dark-mode-toggle-btn:hover {
            background-color: #3e484e;
            border-color: #2d3337;
        }
        body.dark-mode #dark-mode-toggle-btn:active {
            background-color: #2d3337;
        }

        /* --- Modernized ScrollTop Buttons (Rectangular with Text) --- */
        #scrolltop {
            position: fixed !important;
            right: 20px !important;
            bottom: 20px !important; /* Base position, dark mode toggle and author-only button will be above this */
            left: auto !important;
            z-index: 1068; /* Below author-only (1069) and dark mode toggle (1070) buttons */
            display: flex;
            flex-direction: column-reverse; /* Buttons stack, first in HTML (scrolltopa) will be visually on top */
            gap: 8px; /* Space between buttons */
        }

        #scrolltop span a { /* Common style for both buttons */
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 7px 10px; /* Consistent with dark mode toggle button */
            background-color: #6c757d; /* Neutral gray, similar to dark mode toggle */
            color: white !important;
            border: 1px solid #5a6268;
            border-radius: 5px; /* Same as dark mode toggle button */
            font-size: 13px;    /* Same as dark mode toggle button */
            line-height: 1.2;   /* Same as dark mode toggle button */
            box-shadow: 0 2px 5px rgba(0,0,0,0.15); /* Consistent shadow */
            text-decoration: none !important;
            transition: background-color 0.2s, transform 0.1s ease-out, border-color 0.2s;
            opacity: 0.85;
            user-select: none;
            min-width: 40px; /* Give a minimum width for consistency */
            text-align: center;
        }

        #scrolltop span a:hover {
            background-color: #5a6268; /* Darker gray on hover */
            border-color: #495057;
            opacity: 1;
            text-decoration: none !important;
        }
        #scrolltop span a:active {
            transform: scale(0.96); /* Slightly shrink on click */
            background-color: #495057;
        }

        /* Ensure original text inside <b> is visible and not bold by default */
        #scrolltop span a b {
            display: inline !important; /* Override any previous display: none */
            font-weight: normal; /* Make text normal weight, can change to bold if preferred */
        }

        /* Dark Mode for ScrollTop Buttons */
        body.dark-mode #scrolltop span a {
            background-color: #4f5b62; /* Match dark mode toggle */
            border-color: #3e484e;   /* Match dark mode toggle */
            color: white !important; /* Ensure text is white */
        }
        body.dark-mode #scrolltop span a:hover {
            background-color: #3e484e; /* Match dark mode toggle hover */
            border-color: #2d3337;
        }
        body.dark-mode #scrolltop span a:active {
            background-color: #2d3337; /* Match dark mode toggle active */
        }
    `;
    GM_addStyle(modernCSS);

    // Variable to hold the interval ID for forcing background color
    let forceBgIntervalId = null;

    // Function to create an element with classes, attributes, and text
    function createElement(tag, options = {}) {
        const el = document.createElement(tag);
        if (options.id) el.id = options.id;
        if (options.className) el.className = options.className;
        if (options.text) el.textContent = options.text;
        if (options.html) el.innerHTML = options.html;
        if (options.attributes) {
            for (const attr in options.attributes) {
                el.setAttribute(attr, options.attributes[attr]);
            }
        }
        return el;
    }

    // Function to set up the dark mode toggle AND create the new custom header
    function setupModernizerFeatures() {
        console.log('TT1069 Modernizer: setupModernizerFeatures function called.');

        // Secure target="_blank" links
        document.querySelectorAll('a[target="_blank"]').forEach(link => {
            let relValue = link.getAttribute('rel') || '';
            if (!relValue.includes('noopener')) {
                relValue = (relValue + ' noopener').trim();
            }
            if (!relValue.includes('noreferrer')) {
                relValue = (relValue + ' noreferrer').trim();
            }
            link.setAttribute('rel', relValue);
        });

        // --- Dark Mode Toggle --- //
        const darkModeToggleId = 'dark-mode-toggle-btn';
        let darkModeButton = document.getElementById(darkModeToggleId);

        if (!darkModeButton) {
            darkModeButton = createElement('button', { id: darkModeToggleId });
            document.body.appendChild(darkModeButton);
            console.log('TT1069 Modernizer: New dark mode button created and appended to body.');
        }

        const isDarkMode = GM_getValue('darkModeState', false);
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        darkModeButton.innerHTML = isDarkMode ? '☀️ 浅色' : '🌙 深色';

        // Clone and replace to remove old listeners, then re-add
        const newButton = darkModeButton.cloneNode(true);
        darkModeButton.parentNode.replaceChild(newButton, darkModeButton);
        darkModeButton = newButton;

        // --- Handle forcing .bm_h.cl background periodically in dark mode ---
        function startForceBackgroundInterval() {
            if (forceBgIntervalId !== null) {
                clearInterval(forceBgIntervalId);
            }
            if (!document.body.classList.contains('dark-mode')) {
                return;
            }
            console.log('TT1069 Modernizer: Starting periodic force .bm_h.cl background interval.');
            forceBgIntervalId = setInterval(function() {
                if (!document.body.classList.contains('dark-mode')) {
                    return;
                }
                const bmHClElements = document.querySelectorAll('.bm_h.cl');
                if (bmHClElements.length > 0) {
                    bmHClElements.forEach(bmHClElement => {
                        const computedBg = window.getComputedStyle(bmHClElement).backgroundColor;
                        if (computedBg !== 'rgb(42, 42, 42)' && !computedBg.startsWith('rgba(42, 42, 42')) {
                            bmHClElement.style.setProperty('background-color', '#2a2a2a', 'important');
                        }
                    });
                }
            }, 1000);
        }

        function stopForceBackgroundInterval() {
            if (forceBgIntervalId !== null) {
                clearInterval(forceBgIntervalId);
                forceBgIntervalId = null;
                console.log('TT1069 Modernizer: Stopped periodic force .bm_h.cl background interval.');
            }
        }

        // Initial check and start/stop based on current mode
        const isDarkModeNow = document.body.classList.contains('dark-mode');
        if (isDarkModeNow) {
            startForceBackgroundInterval();
        } else {
            stopForceBackgroundInterval();
        }

        // Modify the button click listener to manage the interval
        darkModeButton.addEventListener('click', function() {
            const currentMode = document.body.classList.toggle('dark-mode');
            GM_setValue('darkModeState', currentMode);
            darkModeButton.innerHTML = currentMode ? '☀️ 浅色' : '🌙 深色';
            console.log(`TT1069 Modernizer: Dark mode toggled. New state: ${currentMode}`);

            if (currentMode) { // True if dark mode is now ON
                startForceBackgroundInterval();
            } else { // False if dark mode is now OFF
                stopForceBackgroundInterval();
            }
        });
        console.log('TT1069 Modernizer: Dark mode toggle listener updated to manage background interval.');


        // --- Modernize and Move "View Only Author" Button ---
        if (document.body.classList.contains('pg_viewthread')) {
            console.log('TT1069 Modernizer: Attempting to move "View Only Author" button.');
            const originalAuthorOnlyButton = document.querySelector('td.plc .pi .authi a[rel="nofollow"][href*="authorid="]');

            if (originalAuthorOnlyButton) {
                console.log('TT1069 Modernizer: Found original "View Only Author" button:', originalAuthorOnlyButton);

                const newAuthorOnlyButton = originalAuthorOnlyButton.cloneNode(true);
                newAuthorOnlyButton.id = 'modernized-author-only-btn';
                newAuthorOnlyButton.textContent = '👤 只看樓主';

                let prevSibling = originalAuthorOnlyButton.previousElementSibling;
                if (prevSibling && prevSibling.classList.contains('pipe') && prevSibling.textContent.trim() === '|') {
                    prevSibling.style.display = 'none';
                }
                originalAuthorOnlyButton.style.display = 'none';

                document.body.appendChild(newAuthorOnlyButton);

            } else {
                 console.log('TT1069 Modernizer: Original "View Only Author" button not found (normal if not on a viewthread page).');
            }
        }

        // --- Create New Custom Header ---
        createCustomHeader();
    }

    // Function to create and populate the new custom header, user menu, and quick nav
    function createCustomHeader() {
        const body = document.body;
        const mainWrapper = document.getElementById('wp'); // Insert before #wp

        // Create Top Bar container
        const topBar = createElement('div', { id: 'custom-top-bar' });

        // Logo Area
        const logoArea = createElement('div', { id: 'custom-logo-area' });
        const logoLink = createElement('a', { attributes: { href: './' } });
        const logoImg = createElement('img', { attributes: { src: 'static/image/common/logo.png', alt: 'Site Logo' }});
        logoLink.appendChild(logoImg);
        // Add a text link if logo img is missing or for redundancy
        logoLink.appendChild(createElement('span', { text: 'TT1069論壇' }));
        logoArea.appendChild(logoLink);
        topBar.appendChild(logoArea);

        // Main Navigation Links (from original #nv)
        const mainNav = createElement('nav', { id: 'custom-main-nav' });
        const mainNavUl = createElement('ul');
        const originalNavUl = document.querySelector('#nv ul'); // Attempt to get original nav
        if (originalNavUl) {
            originalNavUl.querySelectorAll('li').forEach(li => {
                const a = li.querySelector('a');
                if (a) {
                    const newLi = createElement('li');
                    const newA = createElement('a', {
                        text: a.textContent.replace(/(\s*\[.+?\]\s*)/g, '').trim(), // Remove extra text like [BBS]
                        attributes: { href: a.href, title: a.title || a.textContent.trim() }
                    });
                    if (li.classList.contains('a')) { // Check for active class
                        newLi.classList.add('active');
                    }
                    newLi.appendChild(newA);
                    mainNavUl.appendChild(newLi);
                }
            });
        } else {
            // Fallback if original #nv not found
            mainNavUl.innerHTML = `
                <li><a href="forum.php">TT1069論壇</a></li>
                <li><a href="misc.php?mod=ranklist">排行榜</a></li>
                <li><a href="forum-69-1.html">新聞區</a></li>
                <li><a href="forum-136-1.html">聊天室</a></li>
            `;
        }
        mainNav.appendChild(mainNavUl);
        topBar.appendChild(mainNav);


        // Actions Area (User Menu, Quick Nav buttons)
        const navActions = createElement('div', { id: 'custom-nav-actions' });

        // --- User Menu Button and Panel ---
        const userMenuButton = createElement('button', {
            id: 'custom-user-menu-btn',
            className: 'custom-action-button',
            html: '👤', // Placeholder icon
            attributes: { title: '用戶選單' }
        });
        navActions.appendChild(userMenuButton);

        const userMenuPanel = createElement('div', { id: 'custom-user-menu-panel' });
        const userMenuUl = createElement('ul');

        const originalUm = document.getElementById('um'); // Get content from original #um before it's display:none
        if (originalUm) {
            const userNameLink = originalUm.querySelector('.vwmy a');
            if (userNameLink) {
                userMenuUl.appendChild(
                    createElement('li', { html: `<a href="${userNameLink.href}" target="_blank" rel="noopener noreferrer"><b>${userNameLink.textContent.trim()}</b> (空間)</a>` })
                );
            }
            // General links: Settings, Messages, Reminders, Logout
            // Using a broader selector to catch all relevant links in #um's paragraphs
            originalUm.querySelectorAll('p a').forEach(link => {
                // Exclude the username link if already added, and external points/group links which might be displayed elsewhere
                if (!link.classList.contains('vwmy') && link.id !== 'extcreditmenu' && link.id !== 'g_upmine') {
                    if (link.textContent.trim() && link.href) {
                        // Special handling for logout to get correct formhash
                        if (link.href.includes('action=logout')) {
                            userMenuUl.appendChild(
                                createElement('li', { html: `<a href="member.php?mod=logging&action=logout&formhash=${window.formhash || ''}">${link.textContent.trim()}</a>` })
                            );
                        } else {
                            userMenuUl.appendChild(
                                createElement('li', { html: `<a href="${link.href}">${link.textContent.trim()}</a>` })
                            );
                        }
                    }
                }
            });
            // Points and Usergroup - Can be added here explicitly if not caught above
            const creditLink = originalUm.querySelector('#extcreditmenu');
            if (creditLink) userMenuUl.appendChild(createElement('li', { html: `<a href="${creditLink.href}">${creditLink.textContent.trim()}</a>` }));
            const groupLink = originalUm.querySelector('#g_upmine');
            if (groupLink) userMenuUl.appendChild(createElement('li', { html: `<a href="${groupLink.href}">${groupLink.textContent.trim()}</a>` }));

        } else { // Fallback if #um not found or not yet populated
            userMenuUl.innerHTML = `
                <li><a href="home.php?mod=spacecp">設置</a></li>
                <li><a href="home.php?mod=space&do=pm">消息</a></li>
                <li><a href="home.php?mod=space&do=notice">提醒</a></li>
                <li><a href="member.php?mod=logging&action=logout&formhash=${window.formhash || ''}">退出</a></li>
            `;
        }
        userMenuPanel.appendChild(userMenuUl);
        body.appendChild(userMenuPanel);

        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPanelVisible = userMenuPanel.style.display === 'block';
            userMenuPanel.style.display = isPanelVisible ? 'none' : 'block';
            const qnPanel = document.getElementById('custom-quick-nav-panel');
            if (qnPanel) qnPanel.style.display = 'none'; // Close other panel
        });


        // --- Quick Navigation Button and Panel ---
        const quickNavButton = createElement('button', {
            id: 'custom-quick-nav-btn',
            className: 'custom-action-button',
            html: '☰', // Placeholder icon
            attributes: { title: '快捷導航' }
        });
        navActions.appendChild(quickNavButton);

        const quickNavPanel = createElement('div', {id: 'custom-quick-nav-panel'});
        // Section 1: Icon links from old #qmenu_menu > ul.cl.nav
        const qnIconLinksSection = createElement('div', {className: 'cqn-section'});
        qnIconLinksSection.appendChild(createElement('div', {className: 'cqn-section-title', text: '常用鏈接'}));
        const qnIconLinksUl = createElement('ul');
        const originalQMenuNavUl = document.querySelector('#qmenu_menu ul.cl.nav');
        if (originalQMenuNavUl) {
            originalQMenuNavUl.querySelectorAll('li a').forEach(a => {
                if (a.href && a.textContent) {
                    qnIconLinksUl.appendChild(createElement('li', {html: `<a href="${a.href}">${a.textContent.trim()}</a>`}));
                }
            });
        } else {
            qnIconLinksUl.innerHTML = `
                <li><a href="home.php?mod=space&do=friend">好友</a></li>
                <li><a href="forum.php?mod=guide&view=my">帖子</a></li>
                <li><a href="home.php?mod=space&do=favorite&view=me">收藏</a></li>
                <li><a href="home.php?mod=magic">道具</a></li>
                <li><a href="home.php?mod=medal">勳章</a></li>
                <li><a href="home.php?mod=task">任務</a></li>
            `;
        }
        qnIconLinksSection.appendChild(qnIconLinksUl);
        quickNavPanel.appendChild(qnIconLinksSection);

        // Section 2: Forum Jump from old #fjump_menu
        const qnForumJumpSection = createElement('div', {className: 'cqn-section'});
        qnForumJumpSection.appendChild(createElement('div', {className: 'cqn-section-title', text: '版塊列表'}));
        const qnForumJumpSearchDiv = createElement('div', {id: 'cqn-forum-jump-search'});
        const qnForumSearchInput = createElement('input', { type: 'text', attributes: { placeholder: '搜索版塊...' }});
        qnForumJumpSearchDiv.appendChild(qnForumSearchInput);
        qnForumJumpSection.appendChild(qnForumJumpSearchDiv);

        const qnForumListDiv = createElement('div', {id: 'cqn-forum-list'});
        const originalFjumpMenu = document.getElementById('fjump_menu');
        if (originalFjumpMenu && originalFjumpMenu.querySelector('ul.jump_bdl')) {
            const clonedForumList = originalFjumpMenu.querySelector('ul.jump_bdl').cloneNode(true);
            qnForumListDiv.appendChild(clonedForumList);
            // Add search functionality for the cloned list
            qnForumSearchInput.addEventListener('keyup', function() {
                const searchTerm = this.value.toLowerCase();
                clonedForumList.querySelectorAll('p a').forEach(link => {
                    const text = link.textContent.toLowerCase();
                    const pElement = link.closest('p');
                    if (pElement) {
                        pElement.style.display = text.includes(searchTerm) ? '' : 'none';
                    }
                });
            });
        } else {
            qnForumListDiv.innerHTML = '<p>無法加載版塊列表。</p>';
        }
        qnForumJumpSection.appendChild(qnForumListDiv);
        quickNavPanel.appendChild(qnForumJumpSection);

        body.appendChild(quickNavPanel);

        quickNavButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isPanelVisible = quickNavPanel.style.display === 'block';
            quickNavPanel.style.display = isPanelVisible ? 'none' : 'block';
            userMenuPanel.style.display = 'none'; // Close other panel
        });


        topBar.appendChild(navActions);
        body.insertBefore(topBar, mainWrapper);

        // Close panels when clicking outside
        document.addEventListener('click', function(event) {
            if (userMenuPanel.style.display === 'block' && !userMenuPanel.contains(event.target) && !userMenuButton.contains(event.target)) {
                userMenuPanel.style.display = 'none';
            }
            if (quickNavPanel.style.display === 'block' && !quickNavPanel.contains(event.target) && !quickNavButton.contains(event.target)) {
                quickNavPanel.style.display = 'none';
            }
        });

        console.log('TT1069 Modernizer: Custom header created.');
    }

    // Check if the DOM is already loaded
    if (document.readyState === 'loading') {
        console.log('TT1069 Modernizer: Document is still loading. Waiting for DOMContentLoaded.');
        window.addEventListener('DOMContentLoaded', setupModernizerFeatures);
    } else {
        console.log('TT1069 Modernizer: Document is already interactive or complete. Running setup immediately.');
        setupModernizerFeatures();
    }

})();
// ==UserScript==
// @name         Saegis LMS Enchancer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  This script will enchance the ui/ux of saegis lms
// @author       asurpbs
// @match        https://lms.saegis.ac.lk/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541442/Saegis%20LMS%20Enchancer.user.js
// @updateURL https://update.greasyfork.org/scripts/541442/Saegis%20LMS%20Enchancer.meta.js
// ==/UserScript==

(function () {
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif !important;
            background-color: #f7f9fb !important;
        }

        /* Remove default blue square outline and use custom glow instead */
        *:focus {
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(0,122,255,0.3) !important;
            border-color: #007aff !important;
        }

        header, .navbar, #page-header, .fixed-top {
            background: rgba(255, 255, 255, 0.75) !important;
            backdrop-filter: blur(14px) !important;
            box-shadow: 0 1px 6px rgba(0,0,0,0.05);
            border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .card, .block, .dashboard-card, .course-summary, .box {
            border-radius: 18px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
            overflow: hidden !important;
        }

        img {
            border-radius: 12px !important;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        img:hover {
            transform: scale(1.01);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        input[type="text"], input[type="search"], input[type="password"], select, textarea {
            border-radius: 999px !important;
            padding: 0.6rem 1rem !important;
            border: 1px solid #ccc !important;
            transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .btn, input[type="submit"], button {
            border-radius: 999px !important;
            padding: 0.5rem 1.2rem !important;
            transition: background 0.2s ease, transform 0.1s ease;
        }

        .btn:hover {
            transform: scale(1.03);
            opacity: 0.9;
        }

        nav a, .navbar a {
            transition: color 0.2s ease;
        }

        nav a:hover, .navbar a:hover {
            color: #007aff !important;
        }

        footer .helplink, footer .socials, footer .logininfo {
            display: none !important;
        }

        /* Modal Styling */
        .modal-content {
            border-radius: 20px !important;
            box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important;
            border: none !important;
        }

        .modal-header, .modal-footer {
            border: none !important;
            background-color: rgba(255,255,255,0.6) !important;
            backdrop-filter: blur(12px) !important;
        }

        .modal-body {
            padding: 1.5rem !important;
        }

        .modal-title {
            font-weight: 600 !important;
        }

        /* Fix Moodle Profile Popovers and Notification Menus */
        .popover-region-container, .popover-region, .popover-region .popover-region-header,
        .popover-region .popover-region-content, .popover-region-footer-container {
            background: rgba(255, 255, 255, 0.85) !important;
            backdrop-filter: blur(14px) !important;
            border-radius: 18px !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
            border: none !important;
        }

        .popover-region-header, .popover-region-footer-container {
            padding: 0.75rem 1.2rem !important;
        }

        .popover-region-content {
            padding: 1rem !important;
        }

        .popover-region-toggle {
            border-radius: 50% !important;
            transition: background 0.2s ease;
        }

        .popover-region-toggle:hover {
            background-color: rgba(0, 122, 255, 0.1) !important;
        }

        /* Hide weird square when clicking profile */
        .popover-region-toggle:focus-visible {
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(0,122,255,0.3) !important;
        }

        /* Optional: smoother popup animation */
        .popover-region-container {
            transition: transform 0.2s ease, opacity 0.2s ease;
        }
    `;
    document.documentElement.appendChild(style);
})();

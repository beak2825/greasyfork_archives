// ==UserScript==
// @name         Snapify
// @version      1.0
// @description  Let Snapify reveal KIIT answer sheets with a simple traversal trick
// @author       Prajwal Panth
// @license      MIT
// @match        http://btecheval.kiitresults.com/midfeb2025stview/cs/ImageDisplay.aspx*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiit.ac.in
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js
// @namespace https://greasyfork.org/users/1460116
// @downloadURL https://update.greasyfork.org/scripts/533431/Snapify.user.js
// @updateURL https://update.greasyfork.org/scripts/533431/Snapify.meta.js
// ==/UserScript==

GM_addStyle(`
  :root {
    /* Refined Color Palette (Inspired by Bolt/Shadcn) */
    --background: #ffffff; /* White */
    --foreground: #111827; /* Gray 900 */
    --card: #ffffff;
    --card-foreground: #111827;
    --popover: #ffffff;
    --popover-foreground: #111827;
    --primary: #2563eb; /* Blue 600 */
    --primary-foreground: #ffffff; /* White */
    --secondary: #f3f4f6; /* Gray 100 */
    --secondary-foreground: #1f2937; /* Gray 800 */
    --muted: #f9fafb; /* Gray 50 */
    --muted-foreground: #6b7280; /* Gray 500 */
    --accent: #e5e7eb; /* Gray 200 */
    --accent-foreground: #111827; /* Gray 900 */
    --destructive: #dc2626; /* Red 600 */
    --destructive-foreground: #ffffff; /* White */
    --border: #e5e7eb; /* Gray 200 */
    --input: #e5e7eb; /* Gray 200 */
    --input-foreground: #111827;
    --ring: #3b82f6; /* Blue 500 - Focus Ring */

    /* Constants */
    --radius: 0.375rem; /* Slightly smaller radius */
    --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

    /* Shadows */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }

  .dark {
    --background: #111827; /* Gray 900 */
    --foreground: #f9fafb; /* Gray 50 */
    --card: #1f2937; /* Gray 800 */
    --card-foreground: #f9fafb; /* Gray 50 */
    --popover: #1f2937; /* Gray 800 */
    --popover-foreground: #f9fafb; /* Gray 50 */
    --primary: #3b82f6; /* Blue 500 */
    --primary-foreground: #ffffff; /* White */
    --secondary: #374151; /* Gray 700 */
    --secondary-foreground: #f3f4f6; /* Gray 100 */
    --muted: #374151; /* Gray 700 */
    --muted-foreground: #9ca3af; /* Gray 400 - Lightened */
    --accent: #4b5563; /* Gray 600 */
    --accent-foreground: #f9fafb; /* Gray 50 */
    --destructive: #ef4444; /* Red 500 */
    --destructive-foreground: #ffffff; /* White */
    --border: #374151; /* Gray 700 */
    --input: #374151; /* Gray 700 */
    --input-foreground: #f9fafb;
    --ring: #60a5fa; /* Blue 400 - Lighter Focus Ring */
  }

  /* Base styles */
  body {
    font-family: var(--font-sans);
    background-color: var(--background);
    color: var(--foreground);
    margin-top: 20px !important; /* Ensure space from top */
  }
  #Form1 {
       margin-top: 20px;
  }
  #cimg {
    display: block;
    max-width: 90%; /* Give some breathing room */
    margin: 20px auto;
    border: 1px solid var(--border);
    box-shadow: var(--shadow);
    border-radius: var(--radius);
    transition: transform 0.2s ease, max-width 0.3s ease, margin 0.3s ease;
  }

  /* Main UI Panel */
  .kitee-ui {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: var(--card);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    padding: 16px;
    width: 340px; /* Preferred width */
    max-width: calc(100vw - 40px); /* Prevent overflow */
    font-family: var(--font-sans);
    font-size: 14px;
    color: var(--card-foreground);
    border-radius: var(--radius);
    z-index: 9999;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
    display: flex; /* Use flex for main UI structure */
    flex-direction: column; /* Stack toggle button and content */
  }

  .kitee-ui.collapsed {
    width: 44px; /* Match toggle button size */
    height: 44px;
    padding: 0;
    box-shadow: var(--shadow-md);
    border-radius: 50%;
    /* When collapsed, toggle button is the only content */
    overflow: visible; /* Allow tooltip to show */
  }

   /* Toggle Button needs careful positioning */
   .toggle-btn {
     position: absolute; top: 6px; left: 6px; /* Position inside padding */
     width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
     font-size: 20px; cursor: pointer; background-color: transparent; /* Transparent */
     border: none; border-radius: var(--radius); color: var(--muted-foreground);
     z-index: 10; transition: background-color 0.15s ease, color 0.15s ease;
     /* Take it out of normal flow */
     flex-shrink: 0; /* Prevent shrinking */
   }
    .toggle-btn:hover { background-color: var(--secondary); color: var(--secondary-foreground); }
    .toggle-btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 1px; background-color: var(--secondary); }

   .kitee-ui.collapsed .toggle-btn {
       /* Reset position when collapsed - becomes the main element */
       position: static; /* Back to normal flow inside the collapsed container */
       width: 100%; height: 100%; /* Fill collapsed container */
       background-color: var(--card);
       color: var(--card-foreground);
       box-shadow: none; /* Shadow is on the collapsed ui div */
       border: none; /* Border is on the collapsed ui div */
       border-radius: 50%;
       display: flex; align-items: center; justify-content: center;
   }
   .kitee-ui.collapsed .toggle-btn:hover { background-color: var(--secondary); }


  .kitee-ui .content-wrapper {
     opacity: 1;
     flex-grow: 1; /* Allow content to take remaining space */
     max-height: calc(85vh - 32px); /* Limit height, accounting for padding */
     overflow-y: auto;
     overflow-x: hidden;
     transition: opacity 0.2s ease-in-out 0.1s, max-height 0.3s ease-in-out;
     padding-right: 5px; /* Space for scrollbar */
     margin-top: 21px; /* Space for absolute positioned toggle button */
     display: flex; /* Use flex for content sections */
     flex-direction: column;
  }
   /* Scrollbar styling */
   .kitee-ui .content-wrapper::-webkit-scrollbar { width: 6px; }
   .kitee-ui .content-wrapper::-webkit-scrollbar-track { background: transparent; }
   .kitee-ui .content-wrapper::-webkit-scrollbar-thumb { background-color: var(--border); border-radius: 3px; }
   .kitee-ui .content-wrapper::-webkit-scrollbar-thumb:hover { background-color: var(--muted-foreground); }


   .kitee-ui.collapsed .content-wrapper {
      opacity: 0;
      max-height: 0;
      pointer-events: none;
      padding-right: 0;
      margin-top: 0; /* No margin needed when collapsed */
      flex-grow: 0; /* Don't take space */
      display: none; /* Completely remove from layout */
   }

  /* Header */
  .kitee-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border);
    flex-shrink: 0; /* Prevent shrinking */
  }
  .kitee-title {
    font-weight: 600; font-size: 16px; display: flex; align-items: center; gap: 8px;
  }
   .header-controls { display: flex; align-items: center; gap: 6px; }

  /* Sections */
  .kitee-ui section {
    margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--border);
    flex-shrink: 0; /* Prevent sections from shrinking */
  }
  /* .kitee-ui section:last-of-type { Removed this - footer handles the last element now */
  /*   margin-bottom: 0; padding-bottom: 0; border-bottom: none; */
  /* } */

  /* Roll Number Section */
  .roll-display { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .roll-label {
    font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    flex-grow: 1; margin-right: 8px;
  }
  .roll-history { display: flex; flex-wrap: wrap; gap: 6px; max-height: 62px; overflow-y: auto; padding-top: 4px;}
  .roll-history-item {
    background-color: var(--secondary); color: var(--secondary-foreground); font-size: 12px;
    padding: 3px 8px; border-radius: calc(var(--radius) / 1.5); cursor: pointer;
    transition: background-color 0.15s ease, border-color 0.15s ease;
    border: 1px solid var(--border); white-space: nowrap;
  }
  .roll-history-item:hover { background-color: var(--accent); }
  .roll-history-item:focus-visible { outline: 2px solid var(--ring); outline-offset: 1px; }


  /* Button styles */
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: var(--radius); font-weight: 500; font-size: 13px;
    height: 32px; padding: 0 10px;
    transition: background-color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
    cursor: pointer; border: 1px solid transparent; white-space: nowrap; gap: 6px;
    line-height: 1;
  }
  .btn:focus-visible { outline: 2px solid var(--ring); outline-offset: 2px; }
  .btn-primary { background-color: var(--primary); color: var(--primary-foreground); border-color: var(--primary); }
  .btn-primary:hover:not(:disabled) { background-color: #1d4ed8; border-color: #1d4ed8; }
  .dark .btn-primary:hover:not(:disabled) { background-color: #60a5fa; border-color: #60a5fa; }
  .btn-secondary { background-color: var(--secondary); color: var(--secondary-foreground); border-color: var(--border); }
  .btn-secondary:hover:not(:disabled) { background-color: var(--accent); }
  .btn-destructive { background-color: var(--destructive); color: var(--destructive-foreground); border-color: var(--destructive); }
  .btn-destructive:hover:not(:disabled) { background-color: #b91c1c; border-color: #b91c1c; }
  .dark .btn-destructive:hover:not(:disabled) { background-color: #f87171; border-color: #f87171; }
  .btn-icon { width: 32px; padding: 0; }
  .btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Navigation */
  .page-section { display: flex; flex-direction: column; gap: 10px; }
  .page-nav { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .page-info { font-weight: 500; font-size: 13px; text-align: center; min-width: 90px; color: var(--muted-foreground); }
  .page-jump { display: flex; align-items: center; gap: 6px; }
  .page-jump-input {
    width: 55px; height: 32px; border-radius: var(--radius); border: 1px solid var(--border);
    background-color: var(--background); color: var(--input-foreground);
    padding: 0 8px; text-align: center; font-size: 13px;
  }
  .page-jump-input:focus { border-color: var(--ring); outline: 1px solid var(--ring); }
  .page-jump-input::-webkit-outer-spin-button, .page-jump-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .page-jump-input[type=number] { -moz-appearance: textfield; }
  .page-jump .btn { width: 32px; }

  /* Actions */
  .actions-section { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; }
  .actions-section .btn { flex-grow: 1; font-size: 12px; }
  .actions-section .btn-primary { flex-grow: 2; }


  /* Status Indicator */
  .status-indicator {
    display: flex; align-items: center; font-size: 12px; margin-top: 8px;
    color: var(--muted-foreground); height: 20px; transition: color 0.3s ease;
  }
  .loading-spinner {
    display: none; border: 2px solid var(--accent); border-top: 2px solid var(--primary);
    border-radius: 50%; width: 14px; height: 14px;
    animation: spin 1s linear infinite; margin-right: 6px;
  }
  .status-indicator.loading .loading-spinner { display: inline-block; }
  .status-indicator.loading .status-text { color: var(--primary); font-weight: 500;}
  .status-indicator.success .status-text { color: #16a34a !important; font-weight: 500; }
  .dark .status-indicator.success .status-text { color: #4ade80 !important; }
  .status-indicator.error .status-text { color: var(--destructive) !important; font-weight: 500; }


  /* Tooltip */
  .tooltip { position: relative; }
  .tooltip::after {
    content: attr(data-tooltip); position: absolute; bottom: 115%; left: 50%;
    transform: translateX(-50%); background-color: #1f2937; color: #f9fafb;
    padding: 4px 8px; border-radius: var(--radius); font-size: 11px;
    white-space: nowrap; z-index: 10000; box-shadow: var(--shadow-md);
    opacity: 0; visibility: hidden; transition: opacity 0.2s ease 0.1s, visibility 0.2s ease 0.1s;
    pointer-events: none;
  }
  .tooltip:hover::after { opacity: 1; visibility: visible; }

  /* Shortcuts List */
  .shortcuts-section { font-size: 12px; color: var(--muted-foreground); }
  .shortcuts-title { font-weight: 500; color: var(--card-foreground); margin-bottom: 8px; }
  .shortcuts-list { list-style-type: none; padding-left: 0; margin-top: 0; }
  .shortcuts-list li { margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
  .shortcuts-list kbd {
    font-family: inherit; background-color: var(--secondary); color: var(--secondary-foreground);
    padding: 2px 6px; border-radius: 4px; border: 1px solid var(--border);
    font-size: 11px; font-weight: 500; margin-left: 8px; box-shadow: var(--shadow-sm);
  }
  .shortcuts-list .key-combo { display: flex; gap: 4px; align-items: center; }

  /* NEW: Footer Styles */
  .kitee-footer {
    margin-top: 16px; /* Space above footer */
    padding-top: 12px; /* Space below last section */
    border-top: 1px solid var(--border);
    font-size: 11px;
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center; /* Center content */
    gap: 8px; /* Space between text and icon */
    flex-shrink: 0; /* Prevent shrinking */
  }
  .kitee-footer a {
    color: var(--muted-foreground);
    display: inline-flex; /* Align icon correctly */
    align-items: center;
    transition: color 0.15s ease;
  }
  .kitee-footer a:hover {
    color: var(--foreground); /* Make icon darker on hover */
  }
   .kitee-footer a:focus-visible {
      outline: 2px solid var(--ring);
      outline-offset: 2px;
      border-radius: var(--radius); /* Add radius to focus outline */
   }
  .kitee-footer svg {
    width: 16px;
    height: 16px;
  }

  /* Fullscreen Mode */
  body.fullscreen-mode #cimg {
    position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    max-height: 95vh; max-width: 95vw; width: auto; height: auto; z-index: 9990;
    box-shadow: var(--shadow-lg); border: 2px solid var(--background); border-radius: 0;
    object-fit: contain; cursor: zoom-out;
  }
  .fullscreen-backdrop {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.85); z-index: 9980; cursor: zoom-out;
    animation: fadeIn 0.3s ease;
  }

  /* PDF Export Progress */
  .pdf-progress-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;
    align-items: center; justify-content: center; z-index: 10000; color: white;
    text-align: center; font-family: var(--font-sans); animation: fadeIn 0.3s ease;
  }
   .pdf-progress-content {
      background-color: var(--card); color: var(--card-foreground);
      padding: 25px 35px; border-radius: var(--radius); box-shadow: var(--shadow-lg);
      display: flex; flex-direction: column; align-items: center; min-width: 300px;
   }
   .pdf-progress-spinner {
     border: 4px solid var(--secondary); border-top: 4px solid var(--primary);
     border-radius: 50%; width: 30px; height: 30px;
     animation: spin 1.5s linear infinite; margin-bottom: 15px;
   }
  .pdf-progress-text { font-size: 16px; font-weight: 500; margin-bottom: 10px; }
  .pdf-progress-details { font-size: 13px; color: var(--muted-foreground); margin-bottom: 15px; }
  .pdf-progress-bar-container {
    width: 100%; height: 8px; background-color: var(--secondary);
    border-radius: 4px; overflow: hidden; border: 1px solid var(--border);
  }
  .pdf-progress-bar {
    height: 100%; background-color: var(--primary); width: 0%;
    transition: width 0.3s ease; border-radius: 4px;
  }

  /* Hide default KITEE UI elements */
  #dg1, form[name="Form1"] > table:first-of-type { display: none !important; }

  /* Animation */
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
`);

(function() {
    'use strict';

    // --- State Management ---
    const state = {
        currentPage: 1,
        totalPages: 0,
        rollNumber: GM_getValue('roll') || '',
        rollHistory: JSON.parse(GM_getValue('rollHistory') || '[]'),
        subject: document.querySelector("#LblCouseCode")?.textContent?.trim() || 'UNKNOWN_SUB',
        examType: document.querySelector("#LblCourse")?.textContent?.trim() || 'Exam',
        year: parseInt(window.location.href.match(/midfeb(\d{4})stview/i)?.[1] || '2025', 10),
        semester: 6,
        isDarkMode: GM_getValue('darkMode', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
        isCollapsed: GM_getValue('collapsed', false),
        isFullscreen: false,
        status: { type: '', message: '', timeoutId: null },
        pdfGenerating: false,
        pdfProgress: 0,
        pdfTotalPages: 0,
    };

    // --- Constants ---
    const MAX_ROLL_HISTORY = 5;
    const STATUS_CLEAR_DELAY = 3500;
    const A4_WIDTH_PT = 595.28;
    const A4_HEIGHT_PT = 841.89;
    const PDF_MARGIN_PT = 30;

    // --- Icons ---
    const icons = {
        collapse: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        expand: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        refresh: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>`,
        prev: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
        next: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
        first: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>`,
        last: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>`,
        fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>`,
        exitFullscreen: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>`,
        jump: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
        dark: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
        light: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
        logo: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
        pdf: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
        // NEW: GitHub Icon
        github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>`
    };

    // --- DOM Elements Cache ---
    const elements = {};

    // --- Utility Functions & Core Logic ---
    // ... (generateKITEEUrl, setStatus, addToRollHistory, UI Update functions, Core Logic functions: updateImage, navigateToPage, promptRollNumber, toggles, exportToPDF, PDF progress, handleKeyPress - all remain the same as v2.2) ...
    // --- Utility Functions ---
    function generateKITEEUrl(subject, roll, page, year = state.year, semester = state.semester) {
        if (!year || !semester || !subject || !roll || !page) {
            console.error("Missing parameters for URL generation:", { subject, roll, page, year, semester });
            setStatus('error', 'Missing info for URL');
            return null;
        }
        const paddedPage = String(page).padStart(3, '0');
        // Verified path structure assumption - EC2R might be specific. If issues arise, this might need adjustment.
        const basePath = `../../../../../../../../KITEE/${year}_${semester}/${subject}/EC2R/${roll}/${paddedPage}|DU|1`;
        return `GenerateImage.aspx?pgno=${encodeURIComponent(basePath)}`;
    }

    function setStatus(type, message, clear = true) {
        if (state.status.timeoutId) {
            clearTimeout(state.status.timeoutId);
            state.status.timeoutId = null;
        }
        state.status.type = type;
        state.status.message = message;

        if (elements.statusIndicator && elements.statusText && elements.loadingSpinner) {
            elements.statusIndicator.className = `status-indicator ${type}`;
            elements.statusText.textContent = message;
            elements.loadingSpinner.style.display = type === 'loading' ? 'inline-block' : 'none';

            if (clear && (type === 'success' || type === 'error')) {
                state.status.timeoutId = setTimeout(() => {
                    setStatus('', ''); // Clear status after delay
                }, STATUS_CLEAR_DELAY);
            }
        }
        // Disable/Enable buttons during loading
        const isLoading = type === 'loading';
        const buttonsToDisable = [
            elements.firstBtn, elements.prevBtn, elements.nextBtn, elements.lastBtn,
            elements.jumpBtn, elements.refreshBtn, elements.fullscreenBtn, elements.pdfBtn,
            elements.editRollBtn, ...(elements.rollHistoryContainer?.children || [])
        ];
        buttonsToDisable.forEach(btn => {
            if (btn) btn.disabled = isLoading;
        });
        if (elements.jumpInput) elements.jumpInput.disabled = isLoading;
    }

    function addToRollHistory(newRoll) {
        if (!newRoll) return;
        const upperCaseRoll = newRoll.toUpperCase(); // Store consistently
        const filteredHistory = state.rollHistory.filter(r => r !== upperCaseRoll);
        const updatedHistory = [upperCaseRoll, ...filteredHistory];
        state.rollHistory = updatedHistory.slice(0, MAX_ROLL_HISTORY);
        GM_setValue('rollHistory', JSON.stringify(state.rollHistory));
        updateRollHistoryUI();
    }

    // --- UI Update Functions ---
    function updateRollDisplay() {
        const displayRoll = state.rollNumber || 'Not set';
        if (elements.rollLabel) {
            elements.rollLabel.textContent = `Roll: ${displayRoll}`;
            elements.rollLabel.title = `Roll: ${displayRoll}`;
        }
        if (elements.pdfBtn) {
             const pdfBtnText = elements.pdfBtn.querySelector('span');
             if(pdfBtnText) {
                 pdfBtnText.textContent = state.rollNumber ? `Export PDF (${state.rollNumber})` : 'Export PDF';
             }
        }
    }

    function updateRollHistoryUI() {
        if (!elements.rollHistoryContainer) return;
        elements.rollHistoryContainer.innerHTML = ''; // Clear existing items
        if (state.rollHistory.length === 0) {
            // No need for empty message if section just looks empty
        } else {
            state.rollHistory.forEach(roll => {
                const item = document.createElement('button');
                item.className = 'roll-history-item tooltip';
                item.textContent = roll;
                item.setAttribute('data-tooltip', `Load roll ${roll}`);
                item.onclick = () => {
                    if (state.rollNumber !== roll && !state.pdfGenerating) { // Prevent change during PDF export
                        state.rollNumber = roll;
                        GM_setValue('roll', roll);
                        updateRollDisplay();
                        state.currentPage = 1;
                        updateImage();
                        updatePageInfo();
                        setStatus('success', `Loaded roll ${roll}`);
                        // No need to re-add to history here, it's already there.
                    }
                };
                elements.rollHistoryContainer.appendChild(item);
            });
        }
    }

    function updatePageInfo() {
        if (elements.pageInfo && elements.jumpInput) {
            const total = state.totalPages > 0 ? state.totalPages : '?';
            elements.pageInfo.textContent = `Page ${state.currentPage} of ${total}`;
            elements.jumpInput.value = state.currentPage;
            elements.jumpInput.max = state.totalPages > 0 ? state.totalPages : 1;
        }
        if (elements.firstBtn && elements.prevBtn && elements.nextBtn && elements.lastBtn) {
             const onFirstPage = state.currentPage <= 1;
             const onLastPage = state.currentPage >= state.totalPages && state.totalPages > 0;
             const noPages = state.totalPages === 0;

             elements.firstBtn.disabled = onFirstPage || noPages || state.pdfGenerating;
             elements.prevBtn.disabled = onFirstPage || noPages || state.pdfGenerating;
             elements.nextBtn.disabled = onLastPage || noPages || state.pdfGenerating;
             elements.lastBtn.disabled = onLastPage || noPages || state.pdfGenerating;
             if(elements.jumpInput) elements.jumpInput.disabled = noPages || state.pdfGenerating;
             if(elements.jumpBtn) elements.jumpBtn.disabled = noPages || state.pdfGenerating;
        }
    }

    function updateTheme() {
        if (state.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        if (elements.themeToggle) {
            elements.themeToggle.innerHTML = state.isDarkMode ? icons.light : icons.dark;
            elements.themeToggle.setAttribute('data-tooltip', state.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
        if (elements.pdfProgressOverlay && elements.pdfProgressOverlay.style.display !== 'none') {
           // PDF progress overlay styling is handled by CSS variables now
        }
    }

    function updateCollapseState() {
         if (!elements.ui || !elements.toggleBtn) return;
         if (state.isCollapsed) {
             elements.ui.classList.add('collapsed');
             elements.toggleBtn.innerHTML = icons.expand;
             elements.toggleBtn.setAttribute('data-tooltip', 'Expand Panel (C)');
         } else {
             elements.ui.classList.remove('collapsed');
             elements.toggleBtn.innerHTML = icons.collapse;
             elements.toggleBtn.setAttribute('data-tooltip', 'Collapse Panel (C)');
         }
         GM_setValue('collapsed', state.isCollapsed);
    }

    function updateFullscreenState() {
        const fullscreenBtnSpan = elements.fullscreenBtn?.querySelector('span');
        if (state.isFullscreen) {
            document.body.classList.add('fullscreen-mode');
            if (!elements.fullscreenBackdrop) {
                elements.fullscreenBackdrop = document.createElement('div');
                elements.fullscreenBackdrop.className = 'fullscreen-backdrop';
                elements.fullscreenBackdrop.onclick = toggleFullscreen;
                document.body.appendChild(elements.fullscreenBackdrop);
                elements.fullscreenBackdrop.classList.add('fade-in');
            }
            elements.fullscreenBackdrop.style.display = 'block';
            if (elements.fullscreenBtn) {
                elements.fullscreenBtn.innerHTML = `${icons.exitFullscreen} <span>Exit Fullscreen</span>`;
                elements.fullscreenBtn.setAttribute('data-tooltip', 'Exit Fullscreen (F or Esc)');
            }
            if (elements.imageElement) elements.imageElement.addEventListener('click', toggleFullscreen);

        } else {
            document.body.classList.remove('fullscreen-mode');
            if (elements.fullscreenBackdrop) {
                elements.fullscreenBackdrop.style.display = 'none';
            }
            if (elements.fullscreenBtn) {
                elements.fullscreenBtn.innerHTML = `${icons.fullscreen} <span>Fullscreen</span>`;
                elements.fullscreenBtn.setAttribute('data-tooltip', 'Enter Fullscreen (F)');
            }
             if (elements.imageElement) elements.imageElement.removeEventListener('click', toggleFullscreen);
        }
    }

    // --- Core Logic Functions ---

    async function updateImage(page = state.currentPage) {
        if (!state.rollNumber) {
            setStatus('error', 'Roll number not set.', false); return Promise.reject('No roll number');
        }
        if (!state.subject || state.subject === 'UNKNOWN_SUB') {
             setStatus('error', 'Subject code not found.', false); return Promise.reject('No subject code');
        }
        if (!elements.imageElement) {
             setStatus('error', 'Image element not found.', false); return Promise.reject('No image element');
         }

        const imageUrl = generateKITEEUrl(state.subject, state.rollNumber, page);
        if (!imageUrl) return Promise.reject('URL generation failed');

        setStatus('loading', `Loading page ${page}...`, false);

        return new Promise((resolve, reject) => {
            const img = elements.imageElement;
            let resolved = false; // Prevent multiple resolves/rejects
            let loadTimeout = null; // Store timeout ID

            const loadHandler = () => {
                cleanup();
                if (!resolved) {
                    resolved = true;
                    if(state.status.type === 'loading' && state.status.message.includes(`Loading page ${page}`)) {
                        setStatus('success', `Page ${page} loaded`);
                    }
                    state.currentPage = page;
                    updatePageInfo();
                    resolve();
                }
            };
            const errorHandler = (err) => {
                cleanup();
                if (!resolved) {
                    resolved = true;
                    console.error(`Error loading image for page ${page}:`, err instanceof Event ? 'Load Error Event' : err);
                    if(state.status.type === 'loading' && state.status.message.includes(`Loading page ${page}`)) {
                        setStatus('error', `Failed to load page ${page}`);
                    }
                    reject(new Error(`Failed to load image for page ${page}`));
                }
            };
            const cleanup = () => {
                img.removeEventListener('load', loadHandler);
                img.removeEventListener('error', errorHandler);
                if (loadTimeout) clearTimeout(loadTimeout);
                loadTimeout = null;
            };

            img.addEventListener('load', loadHandler);
            img.addEventListener('error', errorHandler);

            loadTimeout = setTimeout(() => {
                 if (!resolved) {
                     errorHandler(new Error('Image load timed out'));
                 }
             }, 15000); // 15 second timeout

             img.src = imageUrl;
        });
    }

    function navigateToPage(page) {
        page = parseInt(page, 10);
        if (isNaN(page) || page < 1 || (page > state.totalPages && state.totalPages > 0) || page === state.currentPage || state.pdfGenerating) {
            if (isNaN(page) || page < 1 || (page > state.totalPages && state.totalPages > 0)) {
                setStatus('error', 'Invalid page number');
            }
            if (elements.jumpInput) elements.jumpInput.value = state.currentPage;
            return;
        }
        updateImage(page).catch(err => console.warn("Navigation error ignored:", err)); // Log error but don't block UI
    }

    function promptRollNumber() {
         if (state.pdfGenerating) {
             setStatus('error', 'Cannot change roll during PDF export.');
             return;
         }
        const currentRoll = state.rollNumber;
        const newRoll = prompt('Enter KIIT Roll Number:', currentRoll);
        if (newRoll && newRoll.trim().toUpperCase() !== currentRoll) {
            state.rollNumber = newRoll.trim().toUpperCase();
            GM_setValue('roll', state.rollNumber);
            addToRollHistory(state.rollNumber);
            updateRollDisplay();
            state.currentPage = 1;
            updatePageInfo(); // Update page info immediately
            updateImage().catch(err => console.error("Error loading image for new roll:", err)); // Load image for the new roll
            setStatus('success', `Roll number updated to ${state.rollNumber}`);
        }
    }

    function toggleDarkMode() {
        state.isDarkMode = !state.isDarkMode;
        GM_setValue('darkMode', state.isDarkMode);
        updateTheme();
    }

     function toggleCollapse() {
        state.isCollapsed = !state.isCollapsed;
        updateCollapseState();
    }

     function toggleFullscreen() {
         state.isFullscreen = !state.isFullscreen;
         updateFullscreenState();
     }

    async function exportToPDF() {
        if (state.pdfGenerating) {
            setStatus('error', 'PDF generation already in progress.'); return;
        }
        if (!state.rollNumber || state.totalPages <= 0) {
            setStatus('error', 'Set roll number & ensure pages are detected.'); return;
        }
        if (typeof jspdf === 'undefined' || typeof html2canvas === 'undefined') {
             setStatus('error', 'PDF libraries not loaded.');
             console.error('jsPDF or html2canvas missing. Check @require directives and network.');
             return;
        }

        state.pdfGenerating = true;
        state.pdfProgress = 0;
        state.pdfTotalPages = state.totalPages;
        const originalPage = state.currentPage;
        showPdfProgress();
        setStatus('loading', 'Starting PDF export...', false);
        updatePageInfo(); // Update button disabled states

        const pdfDoc = new jspdf.jsPDF({
            orientation: 'p', unit: 'pt', format: 'a4',
            putOnlyUsedFonts: true, floatPrecision: 16
        });

        const availableWidth = A4_WIDTH_PT - 2 * PDF_MARGIN_PT;
        const availableHeight = A4_HEIGHT_PT - 2 * PDF_MARGIN_PT;
        let pagesExported = 0;

        try {
            for (let i = 1; i <= state.totalPages; i++) {
                state.pdfProgress = i;
                updatePdfProgress();
                setStatus('loading', `Exporting page ${i}/${state.totalPages}...`, false);

                try {
                    await updateImage(i);
                    const imgElement = elements.imageElement;

                    if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) {
                         throw new Error(`Image element invalid after load for page ${i}`);
                     }

                    const canvas = await html2canvas(imgElement, {
                        scale: 2, useCORS: true, logging: false,
                        backgroundColor: state.isDarkMode ? '#111827' : '#ffffff',
                    });
                    const imgData = canvas.toDataURL('image/jpeg', 0.85);

                    const imgProps = pdfDoc.getImageProperties(imgData);
                    let imgWidth = imgProps.width;
                    let imgHeight = imgProps.height;
                    const ratio = imgWidth / imgHeight;

                    if (imgWidth > availableWidth) {
                        imgWidth = availableWidth;
                        imgHeight = imgWidth / ratio;
                    }
                    if (imgHeight > availableHeight) {
                        imgHeight = availableHeight;
                        imgWidth = imgHeight * ratio;
                    }

                    const x = PDF_MARGIN_PT + (availableWidth - imgWidth) / 2;
                    const y = PDF_MARGIN_PT + (availableHeight - imgHeight) / 2; // Center vertically too

                    if (pagesExported > 0) {
                        pdfDoc.addPage();
                    }
                    pdfDoc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
                    pagesExported++;

                } catch (pageError) {
                    console.warn(`Skipping page ${i} due to error:`, pageError);
                    setStatus('error', `Skipped page ${i} (Check console)`);
                    await new Promise(resolve => setTimeout(resolve, 300)); // Shorter delay
                }
            } // End of loop

            if (pagesExported === 0) {
                 throw new Error("No pages could be exported.");
            }

            const filename = `${state.subject}_${state.rollNumber}_${state.examType}.pdf`.replace(/[^a-z0-9_.-]/gi, '_');
            pdfDoc.save(filename);
            setStatus('success', `PDF exported (${pagesExported}/${state.totalPages} pages)`);

        } catch (error) {
            console.error('PDF Export Failed:', error);
            setStatus('error', `PDF export failed: ${error.message}`);
        } finally {
            state.pdfGenerating = false;
            hidePdfProgress();
            updatePageInfo(); // Re-enable buttons
            // Go back to original page only if it's still valid
            if (originalPage >= 1 && originalPage <= state.totalPages) {
               updateImage(originalPage).catch(err => console.warn("Failed to return to original page after PDF export:", err));
            }
        }
    }

     function showPdfProgress() {
         if (!elements.pdfProgressOverlay) {
             elements.pdfProgressOverlay = document.createElement('div');
             elements.pdfProgressOverlay.className = 'pdf-progress-overlay';
             elements.pdfProgressOverlay.innerHTML = `
                 <div class="pdf-progress-content">
                     <div class="pdf-progress-spinner"></div>
                     <div class="pdf-progress-text">Generating PDF...</div>
                     <div class="pdf-progress-details">Page 1 of ${state.pdfTotalPages}</div>
                     <div class="pdf-progress-bar-container">
                         <div class="pdf-progress-bar"></div>
                     </div>
                 </div>
             `;
             document.body.appendChild(elements.pdfProgressOverlay);
             elements.pdfProgressDetails = elements.pdfProgressOverlay.querySelector('.pdf-progress-details');
             elements.pdfProgressBar = elements.pdfProgressOverlay.querySelector('.pdf-progress-bar');
             updateTheme(); // Apply theme
         }
         elements.pdfProgressOverlay.style.display = 'flex';
         updatePdfProgress();
     }

     function updatePdfProgress() {
         if (elements.pdfProgressOverlay && state.pdfGenerating) {
             const progressPercent = state.pdfTotalPages > 0 ? (state.pdfProgress / state.pdfTotalPages) * 100 : 0;
             if (elements.pdfProgressDetails) {
                 elements.pdfProgressDetails.textContent = `Page ${state.pdfProgress} of ${state.pdfTotalPages}`;
             }
             if (elements.pdfProgressBar) {
                 elements.pdfProgressBar.style.width = `${progressPercent}%`;
             }
         }
     }

     function hidePdfProgress() {
         if (elements.pdfProgressOverlay) {
             elements.pdfProgressOverlay.style.display = 'none';
         }
     }

    // --- Keyboard Shortcut Handler ---
    function handleKeyPress(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || state.pdfGenerating) {
            return;
        }
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        let buttonClicked = null;

        switch (event.key.toUpperCase()) {
            case 'ARROWLEFT': buttonClicked = elements.prevBtn; break;
            case 'ARROWRIGHT': buttonClicked = elements.nextBtn; break;
            case 'HOME': buttonClicked = elements.firstBtn; break;
            case 'END': buttonClicked = elements.lastBtn; break;
            case 'F': toggleFullscreen(); break;
            case 'R': buttonClicked = elements.refreshBtn; break;
            case 'C': toggleCollapse(); break;
            case 'P': buttonClicked = elements.pdfBtn; break;
            case 'E': buttonClicked = elements.editRollBtn; break;
            case 'ESCAPE':
                 if (state.isFullscreen) { event.preventDefault(); toggleFullscreen(); }
                 break;
        }

        if (buttonClicked && !buttonClicked.disabled) {
             event.preventDefault();
             buttonClicked.click();
             buttonClicked.style.transform = 'scale(0.97)'; // Visual feedback
             setTimeout(() => { buttonClicked.style.transform = 'scale(1)'; }, 100);
        }
    }


    // --- UI Creation ---
    function createUI() {
        const ui = document.createElement('div');
        ui.className = 'kitee-ui fade-in';
        elements.ui = ui;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn tooltip';
        toggleBtn.onclick = toggleCollapse;
        elements.toggleBtn = toggleBtn;
        ui.appendChild(toggleBtn);

        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'content-wrapper';
        elements.contentWrapper = contentWrapper;

        // Header
        const header = document.createElement('header');
        header.className = 'kitee-header';
        const title = document.createElement('div');
        title.className = 'kitee-title';
        title.innerHTML = `${icons.logo} <span>KITEE Navigator</span>`;
        const headerControls = document.createElement('div');
        headerControls.className = 'header-controls';
        const themeToggle = document.createElement('button');
        themeToggle.className = 'btn btn-secondary btn-icon tooltip';
        themeToggle.onclick = toggleDarkMode;
        elements.themeToggle = themeToggle;
        headerControls.appendChild(themeToggle);
        header.append(title, headerControls);
        contentWrapper.appendChild(header);

        // Roll Number Section
        const rollSection = document.createElement('section');
        const rollDisplay = document.createElement('div');
        rollDisplay.className = 'roll-display';
        const rollLabel = document.createElement('div');
        rollLabel.className = 'roll-label';
        elements.rollLabel = rollLabel;
        const editRollBtn = document.createElement('button');
        editRollBtn.className = 'btn btn-secondary btn-icon tooltip';
        editRollBtn.innerHTML = icons.edit;
        editRollBtn.setAttribute('data-tooltip', 'Edit Roll Number (E)');
        editRollBtn.onclick = promptRollNumber;
        elements.editRollBtn = editRollBtn;
        rollDisplay.append(rollLabel, editRollBtn);
        const rollHistoryContainer = document.createElement('div');
        rollHistoryContainer.className = 'roll-history';
        elements.rollHistoryContainer = rollHistoryContainer;
        rollSection.append(rollDisplay, rollHistoryContainer);
        contentWrapper.appendChild(rollSection);

        // Page Navigation Section
        const pageSection = document.createElement('section');
        pageSection.className = 'page-section';
        const pageNav = document.createElement('div');
        pageNav.className = 'page-nav';
        const navControls1 = document.createElement('div');
        navControls1.style.display = 'flex'; navControls1.style.gap = '6px';
        const firstBtn = document.createElement('button');
        firstBtn.className = 'btn btn-secondary btn-icon tooltip'; firstBtn.innerHTML = icons.first;
        firstBtn.setAttribute('data-tooltip', 'First Page (Home)'); firstBtn.onclick = () => navigateToPage(1);
        elements.firstBtn = firstBtn;
        const prevBtn = document.createElement('button');
        prevBtn.className = 'btn btn-secondary btn-icon tooltip'; prevBtn.innerHTML = icons.prev;
        prevBtn.setAttribute('data-tooltip', 'Previous Page (←)'); prevBtn.onclick = () => navigateToPage(state.currentPage - 1);
        elements.prevBtn = prevBtn;
        navControls1.append(firstBtn, prevBtn);
        const pageInfo = document.createElement('div');
        pageInfo.className = 'page-info'; elements.pageInfo = pageInfo;
        const navControls2 = document.createElement('div');
        navControls2.style.display = 'flex'; navControls2.style.gap = '6px';
        const nextBtn = document.createElement('button');
        nextBtn.className = 'btn btn-secondary btn-icon tooltip'; nextBtn.innerHTML = icons.next;
        nextBtn.setAttribute('data-tooltip', 'Next Page (→)'); nextBtn.onclick = () => navigateToPage(state.currentPage + 1);
        elements.nextBtn = nextBtn;
        const lastBtn = document.createElement('button');
        lastBtn.className = 'btn btn-secondary btn-icon tooltip'; lastBtn.innerHTML = icons.last;
        lastBtn.setAttribute('data-tooltip', 'Last Page (End)'); lastBtn.onclick = () => state.totalPages > 0 && navigateToPage(state.totalPages);
        elements.lastBtn = lastBtn;
        navControls2.append(nextBtn, lastBtn);
        pageNav.append(navControls1, pageInfo, navControls2);
        const pageJump = document.createElement('div');
        pageJump.className = 'page-jump';
        const jumpInput = document.createElement('input');
        jumpInput.className = 'page-jump-input'; jumpInput.type = 'number'; jumpInput.min = 1; jumpInput.placeholder = "Go";
        elements.jumpInput = jumpInput;
        const jumpBtn = document.createElement('button');
        jumpBtn.className = 'btn btn-secondary btn-icon tooltip';
        jumpBtn.innerHTML = icons.jump; jumpBtn.setAttribute('data-tooltip', 'Jump to Page');
        jumpBtn.onclick = () => navigateToPage(jumpInput.value);
        elements.jumpBtn = jumpBtn;
        jumpInput.onkeydown = (e) => { if (e.key === 'Enter' && !jumpBtn.disabled) jumpBtn.click(); };
        pageJump.append(jumpInput, jumpBtn);
        pageSection.append(pageNav, pageJump);
        contentWrapper.appendChild(pageSection);

        // Actions Section
        const actionsSection = document.createElement('section');
        actionsSection.className = 'actions-section';
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-secondary tooltip';
        refreshBtn.innerHTML = `${icons.refresh} <span>Refresh</span>`;
        refreshBtn.setAttribute('data-tooltip', 'Reload Image (R)');
        refreshBtn.onclick = () => updateImage();
        elements.refreshBtn = refreshBtn;
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.className = 'btn btn-secondary tooltip';
        fullscreenBtn.innerHTML = `${icons.fullscreen} <span>Fullscreen</span>`;
        fullscreenBtn.setAttribute('data-tooltip', 'Toggle Fullscreen (F)');
        fullscreenBtn.onclick = toggleFullscreen;
        elements.fullscreenBtn = fullscreenBtn;
        const pdfBtn = document.createElement('button');
        pdfBtn.className = 'btn btn-primary tooltip';
        pdfBtn.innerHTML = `${icons.pdf} <span>Export PDF</span>`;
        pdfBtn.setAttribute('data-tooltip', 'Export All Pages as PDF (P)');
        pdfBtn.onclick = exportToPDF;
        elements.pdfBtn = pdfBtn;
        actionsSection.append(refreshBtn, fullscreenBtn, pdfBtn);
        contentWrapper.appendChild(actionsSection);

         // Status Section
         const statusSection = document.createElement('section');
         statusSection.style.paddingBottom = '0'; statusSection.style.borderBottom = 'none';
         const statusIndicator = document.createElement('div');
         statusIndicator.className = 'status-indicator';
         const loadingSpinner = document.createElement('div'); loadingSpinner.className = 'loading-spinner';
         const statusText = document.createElement('span'); statusText.className = 'status-text';
         statusIndicator.append(loadingSpinner, statusText);
         elements.statusIndicator = statusIndicator; elements.loadingSpinner = loadingSpinner; elements.statusText = statusText;
         statusSection.appendChild(statusIndicator);
         contentWrapper.appendChild(statusSection);

         // Keyboard Shortcuts Info Section
         const shortcutsSection = document.createElement('section');
         shortcutsSection.className = 'shortcuts-section';
         shortcutsSection.innerHTML = `
           <div class="shortcuts-title">Keyboard Shortcuts</div>
           <ul class="shortcuts-list">
             <li>Previous / Next Page <span class="key-combo"><kbd>←</kbd> / <kbd>→</kbd></span></li>
             <li>First / Last Page <span class="key-combo"><kbd>Home</kbd> / <kbd>End</kbd></span></li>
             <li>Toggle Fullscreen <kbd>F</kbd></li>
             <li>Reload Image <kbd>R</kbd></li>
             <li>Collapse / Expand <kbd>C</kbd></li>
             <li>Export PDF <kbd>P</kbd></li>
             <li>Edit Roll No <kbd>E</kbd></li>
             <li>Exit Fullscreen <kbd>Esc</kbd></li>
           </ul>
         `;
         contentWrapper.appendChild(shortcutsSection);

         // NEW: Footer Section
         const footer = document.createElement('footer');
         footer.className = 'kitee-footer';
         const footerText = document.createElement('span');
         footerText.innerHTML = 'Made with ❤️ by Prajwal Panth'; // Use innerHTML for the heart emoji

         const githubLink = document.createElement('a');
         githubLink.href = 'https://github.com/prajwal-panth';
         githubLink.target = '_blank';
         githubLink.rel = 'noopener noreferrer';
         githubLink.className = 'tooltip';
         githubLink.setAttribute('data-tooltip', 'Visit GitHub Profile');
         githubLink.innerHTML = icons.github; // Add the GitHub icon

         footer.appendChild(footerText);
         footer.appendChild(githubLink);
         contentWrapper.appendChild(footer); // Add footer to the scrollable content

        ui.appendChild(contentWrapper);
        document.body.appendChild(ui);
    }


    // --- Initialization ---
    function init() {
        console.log("Snapify Initializing...");

        elements.imageElement = document.querySelector('#cimg');
        if (!elements.imageElement) {
            console.error("Error: Could not find main image element (#cimg). Script cannot function.");
            alert("Snapify Navigator Error: Main image element #cimg not found. Script disabled.");
            return;
        }

        const pageLinks = document.querySelectorAll('#dg1 a');
        state.totalPages = pageLinks.length;
        if (state.totalPages === 0) {
            console.warn("Warning: Could not find page links in #dg1. Total pages may be 0 or incorrect. PDF export might not work.");
        } else {
             console.log(`Found ${state.totalPages} pages.`);
        }

        createUI();

        // Initial setup after UI creation
        updateTheme();
        updateCollapseState();
        updateRollDisplay();
        updateRollHistoryUI();
        updatePageInfo();

        if (!state.rollNumber) {
            setTimeout(promptRollNumber, 150);
        } else {
            addToRollHistory(state.rollNumber);
            updateImage(state.currentPage)
                .catch(err => console.error("Initial image load failed:", err));
        }

        document.addEventListener('keydown', handleKeyPress);

        console.log("Snapify Initialized.");
        if (state.totalPages > 0 || state.rollNumber) {
             setStatus('success', 'Navigator Ready', true);
        } else {
             setStatus('error', 'Ready, but no pages detected or roll set.', false);
        }
    }

    // --- Run ---
    if (document.readyState === "complete" || document.readyState === "interactive") {
       setTimeout(init, 100);
    } else {
       window.addEventListener('DOMContentLoaded', init);
    }

})();
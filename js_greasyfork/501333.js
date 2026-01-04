// ==UserScript==
// @name         Real-Debrid Enhancer
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Enhance Real-Debrid with clickable rows, copy and debrid buttons, grid layout, multi-upload support, and improved layout management on torrents and downloader pages.
// @author       UnderPL
// @license      MIT
// @match        https://real-debrid.com/torrents*
// @match        https://real-debrid.com/
// @match        https://real-debrid.com/downloader*
// @match        https://real-debrid.com/downloads
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.12.5/js/vendor/jquery.ui.widget.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.12.5/js/jquery.iframe-transport.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-file-upload/9.12.5/js/jquery.fileupload.min.js
// @downloadURL https://update.greasyfork.org/scripts/501333/Real-Debrid%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/501333/Real-Debrid%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let copyButton, debridButton, deleteButton;

    GM_addStyle(`
    /* Selection styling */
    .tr.g1:not(.warning), .tr.g2:not(.warning), .tr.g1:not(.warning) + tr, .tr.g2:not(.warning) + tr {
        cursor: pointer;
        position: relative;
        transition: all 0.2s ease-in-out;
    }

    .tr.g1.selected, .tr.g2.selected, .tr.g1.selected + tr, .tr.g2.selected + tr {
        background-color: rgba(40, 167, 69, 0.15) !important;
        border-left: 4px solid #28a745 !important;
        box-shadow: 0 2px 4px rgba(40, 167, 69, 0.1);
    }

    .tr.g1:hover:not(.selected):not(.warning),
    .tr.g2:hover:not(.selected):not(.warning),
    .tr.g1:hover:not(.selected):not(.warning) + tr,
    .tr.g2:hover:not(.selected):not(.warning) + tr {
        background-color: rgba(40, 167, 69, 0.05);
    }

    /* Modern Card Design - Inspired by React redesign */
    /* Match React debrid manager font stack (see debrid-manager-redesign/index.html) */
    .torrent-entry,
    .torrent-entry * {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont,
                     "Segoe UI", Roboto, "Helvetica Neue",
                     Arial, sans-serif !important;
    }

    .torrent-entry {
        display: flex !important;
        flex-direction: column !important;
        background: white !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        transition: all 0.2s ease-in-out !important;
        cursor: pointer !important;
        overflow: hidden !important;
        position: relative !important;
    }

    .torrent-entry:hover:not(.selected) {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        border-color: #cbd5e1 !important;
    }

    .torrent-entry.selected {
        border: 2px solid #6366f1 !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        transform: translateY(-2px) !important;
    }

    /* Card Header - Dark Background */
    .torrent-entry-header {
        padding: 12px 16px !important;
        background: #0f172a !important;
        border-bottom: 1px solid #0f172a !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: flex-start !important;
        gap: 12px !important;
        transition: background-color 0.2s ease !important;
    }

    .torrent-entry.selected .torrent-entry-header {
        background: #4f46e5 !important;
        border-bottom-color: #4f46e5 !important;
    }

    .torrent-entry-title {
        flex: 1 !important;
        min-width: 0 !important;
        color: white !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
        margin: 0 !important;
        display: -webkit-box !important;
        -webkit-line-clamp: 2 !important;
        -webkit-box-orient: vertical !important;
        overflow: hidden !important;
        word-break: break-word !important;
    }

    .torrent-entry-delete-btn {
        color: #94a3b8 !important;
        background: transparent !important;
        border: none !important;
        padding: 6px !important;
        margin: -6px -6px 0 0 !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        transition: all 0.2s ease !important;
        width: 24px !important;
        height: 24px !important;
    }

    .torrent-entry-delete-btn:hover {
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
    }

    /* Card Body */
    .torrent-entry-body {
        padding: 16px !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 16px !important;
        flex: 1 !important;
        background: white !important;
    }

    .torrent-entry.selected .torrent-entry-body {
        background: rgba(99, 102, 241, 0.05) !important;
    }

    /* Info Grid - Status and Hoster */
    .torrent-entry-info-grid {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
    }

    /* Status Badge */
    .torrent-entry-status {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        padding: 4px 10px !important;
        border-radius: 9999px !important;
        border: 1px solid !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        width: fit-content !important;
    }

    .torrent-entry-status.finished {
        color: #15803d !important;
        background: #dcfce7 !important;
        border-color: #bbf7d0 !important;
    }

    .torrent-entry-status.error {
        color: #b91c1c !important;
        background: #fee2e2 !important;
        border-color: #fecaca !important;
    }

    .torrent-entry-status.processing {
        color: #4338ca !important;
        background: #e0e7ff !important;
        border-color: #c7d2fe !important;
    }

    .torrent-entry-status-icon {
        width: 14px !important;
        height: 14px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    .torrent-entry-status-icon svg {
        width: 100% !important;
        height: 100% !important;
    }

    /* Hoster Tag */
    .torrent-entry-hoster {
        display: flex !important;
        justify-content: flex-end !important;
    }

    .torrent-entry-hoster-tag {
        background: #f1f5f9 !important;
        color: #64748b !important;
        border: 1px solid #e2e8f0 !important;
        padding: 4px 8px !important;
        border-radius: 6px !important;
        font-size: 10px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.05em !important;
        display: inline-flex !important;
        align-items: center !important;
        gap: 4px !important;
    }

    /* Stats Row */
    .torrent-entry-stats {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 8px 0 !important;
        border-top: 1px solid #f1f5f9 !important;
        border-bottom: 1px solid #f1f5f9 !important;
    }

    .torrent-entry-stat {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        flex: 1 !important;
        border-right: 1px solid #f1f5f9 !important;
    }

    .torrent-entry-stat:last-child {
        border-right: none !important;
    }

    .torrent-entry-stat-label {
        font-size: 10px !important;
        text-transform: uppercase !important;
        font-weight: 700 !important;
        color: #94a3b8 !important;
        margin-bottom: 2px !important;
    }

    .torrent-entry-stat-value {
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
        color: #1e293b !important;
        font-weight: 500 !important;
        font-size: 12px !important;
    }

    .torrent-entry-stat-icon {
        width: 14px !important;
        height: 14px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
    }

    .torrent-entry-stat-icon svg {
        width: 100% !important;
        height: 100% !important;
    }

    /* Footer / Actions */
    .torrent-entry-footer {
        margin-top: auto !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
    }

    .torrent-entry-link-input-wrapper {
        position: relative !important;
        flex: 1 !important;
    }

    .torrent-entry-link-input {
        width: 100% !important;
        min-height: 28px !important;
        max-height: 60px !important;
        padding: 4px 36px 4px 12px !important;
        font-size: 12px !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        background: #f8fafc !important;
        color: #334155 !important;
        transition: all 0.2s ease !important;
        box-sizing: border-box !important;
        resize: vertical !important;
        white-space: pre-wrap !important;
        overflow-y: auto !important;
    }

    .torrent-entry-link-input:focus {
        outline: none !important;
        border-color: #818cf8 !important;
        box-shadow: 0 0 0 1px #818cf8 !important;
    }

    .torrent-entry-link-input:read-only {
        cursor: default !important;
    }

    .torrent-entry-copy-btn {
        position: absolute !important;
        right: 16px !important;
        top: -1px !important;
        width: 28px !important;
        height: 28px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: transparent !important;
        border: none !important;
        border-radius: 6px !important;
        cursor: pointer !important;
        color: #64748b !important;
        transition: all 0.2s ease !important;
    }

    .torrent-entry-copy-btn:hover {
        background: #e2e8f0 !important;
        color: #334155 !important;
    }

    .torrent-entry-download-btn {
        height: 36px !important;
        width: 36px !important;
        background: #4f46e5 !important;
        border: none !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        flex-shrink: 0 !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        transition: all 0.2s ease !important;
    }

    .torrent-entry-download-btn:hover {
        background: #4338ca !important;
    }

    .torrent-entry-download-btn img {
        width: 16px !important;
        height: 16px !important;
    }

    .tr.g1, .tr.g2 {
        border-top: 2px solid black/* Green border on top */

    }

    .tr.g1 + tr, .tr.g2 + tr {
        border-bottom: 2px solid black; /* Green border on bottom */

    }
    #buttonContainer {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 9999;
    }
    #buttonContainer button {
        padding: 12px 20px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0.3px;
        transition: all 0.2s ease;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
        min-width: 200px;
        width: 250px; /* Fixed width for all buttons */
        text-align: center;
        text-transform: uppercase;
        white-space: nowrap; /* Prevent text wrapping */
        overflow: hidden; /* Hide overflow text */
        text-overflow: ellipsis; /* Show ellipsis for overflow */
    }
    #buttonContainer button:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        filter: brightness(1.05);
    }
    #buttonContainer button:active {
        transform: translateY(1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    /* Button click animation */
    .button-clicked {
        animation: button-click-animation 0.5s ease;
        background-color: #3a8a3e !important; /* Darker shade */
    }
    @keyframes button-click-animation {
        0% { transform: scale(1); }
        50% { transform: scale(0.95); }
        100% { transform: scale(1); }
    }
    /* Only apply grid layout when the class is present */
    #facebox .content.grid-layout {
        width: 90vw !important;
        max-width: 1200px !important;
        display: flex !important;
        flex-wrap: wrap !important;
        justify-content: space-between !important;
    }
    /* Center the facebox when grid layout is applied */
    #facebox.grid-layout {
        left: 50% !important;
        transform: translateX(-50%) !important;
    }
    .torrent-info {
        width: calc(33.33% - 20px);
        margin-bottom: 20px;
        border: 1px solid #ccc;
        padding: 10px;
        box-sizing: border-box;
    }
    #switchLayoutButton {
        padding: 12px 20px !important;
        background-color: #2196F3 !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: 0.3px !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16) !important;
        text-transform: uppercase !important;
    }
    #switchLayoutButton:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
        filter: brightness(1.05) !important;
    }
    #switchLayoutButton:active {
        transform: translateY(1px) !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }
    #extractUrlsButton {
        padding: 8px 12px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.3px;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-transform: uppercase;
        position: absolute;
        right: 10px;
        top: 10px;
    }
    #extractUrlsButton:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 6px rgba(0,0,0,0.15);
        filter: brightness(1.05);
    }
    #extractUrlsButton:active {
        transform: translateY(1px);
        box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    #extractUrlsButton:disabled {
        background-color: #9e9e9e !important;
        cursor: not-allowed !important;
        opacity: 0.6 !important;
    }
    #extractUrlsButton:disabled:hover {
        transform: none !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        filter: none !important;
    }
    
    /* Multi-upload styles */
    #multiUploadContainer {
        background: white !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 12px !important;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important;
        padding: 24px !important;
        margin: 24px 0 !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
    }
    
    #multiUploadContainer h3 {
        color: #0f172a !important;
        font-size: 18px !important;
        font-weight: 600 !important;
        margin: 0 0 16px 0 !important;
    }
    
    #multiUploadDrop {
        background: #f8fafc !important;
        border: 2px dashed #cbd5e1 !important;
        border-radius: 8px !important;
        padding: 40px !important;
        text-align: center !important;
        transition: all 0.2s ease !important;
        cursor: pointer !important;
        margin-bottom: 20px !important;
    }
    
    #multiUploadDrop:hover {
        border-color: #6366f1 !important;
        background: #f1f5f9 !important;
    }
    
    #multiUploadDrop.dragover {
        border-color: #4f46e5 !important;
        background: #e0e7ff !important;
        border-style: solid !important;
    }
    
    #multiUploadDrop p {
        color: #64748b !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        margin: 0 0 12px 0 !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
    }
    
    #multiUploadDrop button {
        padding: 10px 24px !important;
        background: #6366f1 !important;
        color: white !important;
        border: none !important;
        border-radius: 8px !important;
        cursor: pointer !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        transition: all 0.2s ease !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }
    
    #multiUploadDrop button:hover {
        background: #4f46e5 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 3px 6px rgba(0,0,0,0.15) !important;
    }
    
    #multiUploadDrop input[type="file"] {
        display: none !important;
    }
    
    #multiUploadList {
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
    }
    
    #multiUploadList li {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        border-radius: 8px !important;
        padding: 16px !important;
        margin-bottom: 12px !important;
        position: relative !important;
        transition: all 0.2s ease !important;
    }
    
    #multiUploadList li.working {
        border-color: #6366f1 !important;
        background: #f5f7ff !important;
    }
    
    #multiUploadList li.complete {
        border-color: #10b981 !important;
        background: #f0fdf4 !important;
    }
    
    #multiUploadList li.error {
        border-color: #ef4444 !important;
        background: #fef2f2 !important;
    }
    
    #multiUploadList li p {
        margin: 0 0 8px 0 !important;
        color: #1e293b !important;
        font-weight: 500 !important;
        font-size: 14px !important;
        padding-right: 80px !important;
        word-break: break-word !important;
    }
    
    #multiUploadList li p i {
        font-weight: 400 !important;
        font-style: normal !important;
        color: #64748b !important;
        font-size: 12px !important;
        margin-left: 8px !important;
    }
    
    #multiUploadList li .progress-bar {
        background: #e2e8f0 !important;
        height: 6px !important;
        border-radius: 3px !important;
        overflow: hidden !important;
        margin-top: 8px !important;
    }
    
    #multiUploadList li .progress-fill {
        background: #6366f1 !important;
        height: 100% !important;
        width: 0% !important;
        transition: width 0.3s ease !important;
        border-radius: 3px !important;
    }
    
    #multiUploadList li.complete .progress-fill {
        background: #10b981 !important;
    }
    
    #multiUploadList li.error .progress-fill {
        background: #ef4444 !important;
    }
    
    #multiUploadList li .percentage {
        position: absolute !important;
        top: 16px !important;
        right: 50px !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #6366f1 !important;
    }
    
    #multiUploadList li.complete .percentage {
        color: #10b981 !important;
    }
    
    #multiUploadList li.error .percentage {
        color: #ef4444 !important;
    }
    
    #multiUploadList li .speed {
        position: absolute !important;
        top: 38px !important;
        right: 50px !important;
        font-size: 11px !important;
        color: #64748b !important;
    }
    
    #multiUploadList li .cancel-btn {
        position: absolute !important;
        top: 16px !important;
        right: 16px !important;
        width: 24px !important;
        height: 24px !important;
        background: transparent !important;
        border: none !important;
        cursor: pointer !important;
        color: #94a3b8 !important;
        font-size: 18px !important;
        line-height: 1 !important;
        border-radius: 4px !important;
        transition: all 0.2s ease !important;
        padding: 0 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
    
    #multiUploadList li .cancel-btn:hover {
        background: #f1f5f9 !important;
        color: #64748b !important;
    }
    
    #multiUploadList li.working .cancel-btn {
        color: #6366f1 !important;
    }
    
    #multiUploadList li.working .cancel-btn:hover {
        background: #e0e7ff !important;
        color: #4f46e5 !important;
    }
        /* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0I5nvwU.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0I5nvwU.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0I5nvwU.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2JL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa0ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2ZL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa2pL7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa25L7W0I5nvwUgHU.woff2) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0I5nvwU.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}


    `);

    function ensureInterFontLoaded() {
        // Load Inter font so the grid matches the React redesign typography
        if (document.getElementById('rd-inter-font')) return;

        const link = document.createElement('link');
        link.id = 'rd-inter-font';
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

        if (document.head) {
            document.head.appendChild(link);
        }
    }

    function convertTime() {
        const tdElements = document.querySelectorAll('td');
        for (const td of tdElements) {
            const dateStr = td.textContent.trim();
            const dateRegex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

            if (dateRegex.test(dateStr)) {
                const utcDate = new Date(dateStr + ' UTC');
                const localDate = new Date(utcDate.getTime() - (new Date().getTimezoneOffset() * 60000));
                const formattedDate = localDate.toISOString().slice(0, 19).replace('T', ' ');
                td.textContent = formattedDate;
            }
        }
    }

    function initializeApplication() {
        // Ensure our preferred font is available on all relevant pages
        ensureInterFontLoaded();

        if (window.location.href.includes('/torrents')) {
            cleanupTorrentPageLayout();
            createFloatingButtons();
            makeItemsSelectable();
            updateFloatingButtonsVisibility();
            setupTorrentInfoWindowObserver();
            checkForTorrentInfoWindow();
            setupItemHoverEffects();
            movePaginationToBottomRight();
            addSwitchToGridLayoutButton(); // Comment this and uncomment line below to automatically switch to the more compact version of the torrent page
            //switchToGridLayout()
            initMultiUpload();
        }

        if (window.location.href === 'https://real-debrid.com/' || window.location.href.includes('/downloader')) {
            addExtractUrlsButtonToDownloader();
            addCopyLinksButton();
            setupLinkViewToggle();
        }

        if (window.location.href.includes('/downloads')) {
            convertTime();
        }
    }

    function movePaginationToBottomRight() {
        const parentElement = document.querySelector('div.full_width_wrapper');
        const formElement = parentElement.querySelector('form:nth-child(1)');
        const pageElements = parentElement.querySelectorAll('div.full_width_wrapper > strong, div.full_width_wrapper > a[href^="./torrents?p="]');
        const containerDiv = document.createElement('div');
        const marginSize = '5px';
        const fontSize = '16px';

        containerDiv.style.position = 'absolute';
        containerDiv.style.right = '0';
        containerDiv.style.bottom = '0';
        containerDiv.style.display = 'flex';
        containerDiv.style.gap = marginSize;
        containerDiv.style.fontSize = fontSize;

        pageElements.forEach(page => {
            containerDiv.appendChild(page);
        });

        formElement.style.position = 'relative';
        formElement.appendChild(containerDiv);

        // Add selection buttons
        addSelectionButtons(formElement);
    }

    function addSelectionButtons(formElement) {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'selectionButtonsContainer';
        buttonContainer.style.display = 'inline-block';
        buttonContainer.style.marginLeft = '10px';
        buttonContainer.style.gap = '10px';

        // Create Select All button
        const selectAllButton = document.createElement('button');
        selectAllButton.id = 'selectAllButton';
        selectAllButton.textContent = 'Select All';
        selectAllButton.type = 'button'; // Prevent form submission
        selectAllButton.className = 'selection-control-button';
        selectAllButton.addEventListener('click', (e) => {
            // Add visual feedback without text change
            addButtonClickFeedback(selectAllButton);
            selectAllItems();
        });

        // Create Unselect All button
        const unselectAllButton = document.createElement('button');
        unselectAllButton.id = 'unselectAllButton';
        unselectAllButton.textContent = 'Unselect All';
        unselectAllButton.type = 'button'; // Prevent form submission
        unselectAllButton.className = 'selection-control-button';
        unselectAllButton.addEventListener('click', (e) => {
            // Add visual feedback without text change
            addButtonClickFeedback(unselectAllButton);
            unselectAllItems();
        });

        // Create Reverse Selection button (hidden initially using opacity instead of display:none)
        const reverseSelectionButton = document.createElement('button');
        reverseSelectionButton.id = 'reverseSelectionButton';
        reverseSelectionButton.textContent = 'Invert Selection';
        reverseSelectionButton.type = 'button'; // Prevent form submission
        reverseSelectionButton.className = 'selection-control-button';
        // Use opacity and pointer-events to hide rather than display:none
        reverseSelectionButton.style.opacity = '0';
        reverseSelectionButton.style.pointerEvents = 'none';
        reverseSelectionButton.style.transition = 'opacity 0.2s ease';
        reverseSelectionButton.addEventListener('click', (e) => {
            // Add visual feedback without text change
            addButtonClickFeedback(reverseSelectionButton);
            reverseSelection();
        });

        // Add buttons to container
        buttonContainer.appendChild(selectAllButton);
        buttonContainer.appendChild(unselectAllButton);
        buttonContainer.appendChild(reverseSelectionButton);

        // Find the Convert button and insert our buttons after it
        const convertButton = formElement.querySelector('input[value="Convert"]');
        if (convertButton) {
            // Insert after the Convert button
            convertButton.insertAdjacentElement('afterend', buttonContainer);
        } else {
            // Fallback - just append to the form
            formElement.appendChild(buttonContainer);
        }

        // Add CSS for buttons
        GM_addStyle(`
            .selection-control-button {
                padding: 8px 12px;
                background-color: #2196F3;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 13px;
                font-weight: 500;
                letter-spacing: 0.3px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-transform: uppercase;
                margin-right: 5px;
                display: inline-block;
                min-width: 120px; /* Minimum width for selection buttons */
                text-align: center;
                white-space: nowrap; /* Prevent text wrapping */
            }

            .selection-control-button:hover {
                transform: translateY(-1px);
                box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                filter: brightness(1.05);
            }

            .selection-control-button:active {
                transform: translateY(1px);
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }

            .selection-control-button.button-clicked {
                background-color: #1976D2 !important; /* Darker blue */
            }

            #selectionButtonsContainer {
                vertical-align: middle;
            }
        `);
    }

    function selectAllItems() {
        // Get all selectable items in current view
        const gridContainer = document.getElementById('torrent-grid-container');
        const isGridActive = gridContainer && gridContainer.style.display !== 'none';

        if (isGridActive) {
            // Select all grid items
            const entries = document.querySelectorAll('.torrent-entry:not(.warning)');
            entries.forEach(entry => {
                if (!entry.classList.contains('selected')) {
                    entry.classList.add('selected');

                    // Get ID and sync with table view
                    const id = getIdentifierFromElement(entry);
                    if (id) {
                        syncTableViewSelection(id, true);
                    }
                }
            });
        } else {
            // Select all table rows
            const rows = document.querySelectorAll('.tr.g1:not(.warning), .tr.g2:not(.warning)');
            rows.forEach(row => {
                if (!row.classList.contains('selected')) {
                    row.classList.add('selected');
                    const nextRow = row.nextElementSibling;
                    if (nextRow && !nextRow.classList.contains('g1') && !nextRow.classList.contains('g2')) {
                        nextRow.classList.add('selected');
                    }

                    // Get ID and sync with grid view
                    const id = getIdentifierFromElement(row);
                    if (id) {
                        syncSelectionState(id, true);
                    }
                }
            });
        }

        updateFloatingButtonsVisibility();
        updateReverseSelectionButtonVisibility();
    }

    function unselectAllItems() {
        // Unselect all items in both views
        document.querySelectorAll('.tr.g1.selected, .tr.g2.selected, .torrent-entry.selected').forEach(item => {
            item.classList.remove('selected');

            // For table rows, also unselect detail row
            if (item.classList.contains('g1') || item.classList.contains('g2')) {
                const nextRow = item.nextElementSibling;
                if (nextRow && !nextRow.classList.contains('g1') && !nextRow.classList.contains('g2')) {
                    nextRow.classList.remove('selected');
                }
            }
        });

        updateFloatingButtonsVisibility();
        updateReverseSelectionButtonVisibility();
    }

    function reverseSelection() {
        // Get all selectable items in current view
        const gridContainer = document.getElementById('torrent-grid-container');
        const isGridActive = gridContainer && gridContainer.style.display !== 'none';

        if (isGridActive) {
            // Reverse selection in grid view
            const entries = document.querySelectorAll('.torrent-entry:not(.warning)');
            entries.forEach(entry => {
                const isSelected = entry.classList.contains('selected');

                if (isSelected) {
                    // Properly remove selection styles
                    entry.classList.remove('selected');
                } else {
                    entry.classList.add('selected');
                }

                // Get ID and sync with table view
                const id = getIdentifierFromElement(entry);
                if (id) {
                    syncTableViewSelection(id, !isSelected);
                }
            });
        } else {
            // Reverse selection in table view
            const rows = document.querySelectorAll('.tr.g1:not(.warning), .tr.g2:not(.warning)');
            rows.forEach(row => {
                const isSelected = row.classList.contains('selected');

                if (isSelected) {
                    // Properly remove selection styles
                    row.classList.remove('selected');
                    row.style.backgroundColor = '';

                    const nextRow = row.nextElementSibling;
                    if (nextRow && !nextRow.classList.contains('g1') && !nextRow.classList.contains('g2')) {
                        nextRow.classList.remove('selected');
                        nextRow.style.backgroundColor = '';
                    }
                } else {
                    row.classList.add('selected');

                    const nextRow = row.nextElementSibling;
                    if (nextRow && !nextRow.classList.contains('g1') && !nextRow.classList.contains('g2')) {
                        nextRow.classList.add('selected');
                    }
                }

                // Get ID and sync with grid view
                const id = getIdentifierFromElement(row);
                if (id) {
                    syncSelectionState(id, !isSelected);
                }
            });
        }

        updateFloatingButtonsVisibility();
        updateReverseSelectionButtonVisibility();
    }

    function updateReverseSelectionButtonVisibility() {
        const reverseButton = document.getElementById('reverseSelectionButton');
        if (!reverseButton) return;

        const hasSelectedItems = document.querySelectorAll('.tr.g1.selected, .tr.g2.selected, .torrent-entry.selected').length > 0;

        // Use opacity instead of display to show/hide
        if (hasSelectedItems) {
            reverseButton.style.opacity = '1';
            reverseButton.style.pointerEvents = 'auto';
        } else {
            reverseButton.style.opacity = '0';
            reverseButton.style.pointerEvents = 'none';
        }
    }

    function createFloatingButtons() {
        const container = document.createElement('div');
        container.id = 'buttonContainer';

        debridButton = document.createElement('button');
        debridButton.addEventListener('click', (e) => {
            // Add visual feedback
            addButtonClickFeedback(debridButton, 'Sent to Debrid');
            sendSelectedLinksToDebrid(e);
        });

        copyButton = document.createElement('button');
        copyButton.addEventListener('click', (e) => {
            // Add visual feedback
            addButtonClickFeedback(copyButton, 'Copied!');
            copySelectedLinksToClipboard();
        });

        // Add delete button
        deleteButton = document.createElement('button');
        deleteButton.style.backgroundColor = '#dc3545';
        deleteButton.addEventListener('click', (e) => {
            addButtonClickFeedback(deleteButton);
            deleteSelectedTorrents();
        });

        container.appendChild(debridButton);
        container.appendChild(copyButton);
        container.appendChild(deleteButton);
        document.body.appendChild(container);

        return container;
    }

    function updateFloatingButtonsVisibility() {
        const selectedLinks = getSelectedItemLinks();
        const count = selectedLinks.length;

        // Get unique selected items count
        const uniqueSelectedIds = getUniqueSelectedItemsCount();
        const itemCount = uniqueSelectedIds.length;

        // Count total links across all selected items
        const totalLinkCount = getTotalLinkCount();

        if (count > 0) {
            debridButton.textContent = `Debrid (${itemCount}) (${totalLinkCount})`;
            copyButton.textContent = `Copy Selected (${itemCount}) (${totalLinkCount})`;
            deleteButton.textContent = `Delete (${itemCount})`;
            debridButton.style.display = 'block';
            copyButton.style.display = 'block';
            deleteButton.style.display = 'block';
        } else {
            debridButton.style.display = 'none';
            copyButton.style.display = 'none';
            deleteButton.style.display = 'none';
        }

        // Update visibility of Reverse Selection button
        updateReverseSelectionButtonVisibility();
    }

    function getUniqueSelectedItemsCount() {
        const uniqueIds = new Set();
        const gridContainer = document.getElementById('torrent-grid-container');
        const isGridActive = gridContainer && gridContainer.style.display !== 'none';

        if (isGridActive) {
            // Count only grid items if grid view is active
            const selectedEntries = document.querySelectorAll('.torrent-entry.selected');
            selectedEntries.forEach(entry => {
                const id = getIdentifierFromElement(entry);
                if (id) uniqueIds.add(id);
            });
        } else {
            // Count only table rows if table view is active
            const selectedRows = document.querySelectorAll('.tr.g1.selected, .tr.g2.selected');
            selectedRows.forEach(row => {
                const id = getIdentifierFromElement(row);
                if (id) uniqueIds.add(id);
            });
        }

        return Array.from(uniqueIds);
    }

    function getTotalLinkCount() {
        let totalLinks = 0;
        const uniqueIds = new Set();
        const gridContainer = document.getElementById('torrent-grid-container');
        const isGridActive = gridContainer && gridContainer.style.display !== 'none';

        if (isGridActive) {
            // Count links in grid items
            const selectedEntries = document.querySelectorAll('.torrent-entry.selected');
            selectedEntries.forEach(entry => {
                const id = getIdentifierFromElement(entry);
                if (id && !uniqueIds.has(id)) {
                    uniqueIds.add(id);
                    const textarea = entry.querySelector('textarea');
                    if (textarea && textarea.value) {
                        // Split by newlines and count non-empty lines
                        const links = textarea.value.split('\n').filter(line => line.trim());
                        totalLinks += links.length;
                    }
                }
            });
        } else {
            // Count links in table rows
            const selectedRows = document.querySelectorAll('.tr.g1.selected, .tr.g2.selected');
            selectedRows.forEach(row => {
                const id = getIdentifierFromElement(row);
                if (id && !uniqueIds.has(id)) {
                    uniqueIds.add(id);
                    const textarea = row.nextElementSibling.querySelector('textarea');
                    if (textarea && textarea.value) {
                        // Split by newlines and count non-empty lines
                        const links = textarea.value.split('\n').filter(line => line.trim());
                        totalLinks += links.length;
                    }
                }
            });
        }

        return totalLinks;
    }

    function makeItemsSelectable() {
        const rows = document.querySelectorAll('.tr.g1, .tr.g2');
        rows.forEach(row => {
            // Skip if already has a click handler
            if (row.hasAttribute('data-has-click-handler')) return;

            const warningSpan = row.querySelector('span.px10 strong');
            if (!warningSpan || warningSpan.textContent !== 'Warning:') {
                const nextRow = row.nextElementSibling;

                // Add event stopping for delete buttons and download images
                const deleteButton = row.querySelector('a[href*="del"]');
                if (deleteButton) {
                    deleteButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }

                // Add event stopping for file info buttons
                const fileInfoButton = row.querySelector('a[rel="facebox"]');
                if (fileInfoButton) {
                    fileInfoButton.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }

                const clickHandler = () => {
                    row.classList.toggle('selected');
                    if (nextRow) {
                        nextRow.classList.toggle('selected');
                    }

                    // Get ID and sync with grid view
                    const id = getIdentifierFromElement(row);
                    if (id) {
                        syncSelectionState(id, row.classList.contains('selected'));
                    }

                    updateFloatingButtonsVisibility();
                };

                row.addEventListener('click', clickHandler);
                row.setAttribute('data-has-click-handler', 'true');

                if (nextRow) {
                    // Add event stopping for download buttons in the details row
                    const downloadButtons = nextRow.querySelectorAll('input[type="image"]');
                    downloadButtons.forEach(button => {
                        button.addEventListener('click', (e) => {
                            e.stopPropagation();
                        });
                    });

                    nextRow.addEventListener('click', clickHandler);
                    nextRow.setAttribute('data-has-click-handler', 'true');
                }
            } else {
                row.classList.add('warning');
                if (row.nextElementSibling) {
                    row.nextElementSibling.classList.add('warning');
                }
            }
        });

        const entries = document.querySelectorAll('.torrent-entry');
        entries.forEach(entry => {
            // Skip if already has a click handler
            if (entry.hasAttribute('data-has-click-handler')) return;

            // Add event stopping for buttons in grid view
            const deleteButton = entry.querySelector('a[href*="del"]');
            if (deleteButton) {
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            const downloadButtons = entry.querySelectorAll('input[type="image"]');
            downloadButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            const fileInfoButtons = entry.querySelectorAll('a[rel="facebox"]');
            fileInfoButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            entry.addEventListener('click', (e) => {
                // Prevent click propagation if this is a delete button
                if (e.target.closest('a[href*="del"]') ||
                    e.target.closest('input[type="image"]') ||
                    e.target.closest('a[rel="facebox"]')) {
                    return;
                }

                // Toggle selection state
                entry.classList.toggle('selected');

                // Get ID and sync with table view
                const id = getIdentifierFromElement(entry);
                if (id) {
                    syncSelectionState(id, entry.classList.contains('selected'));
                }

                updateFloatingButtonsVisibility();
            });

            entry.setAttribute('data-has-click-handler', 'true');
        });
    }

    function setupItemHoverEffects() {
        const rows = document.querySelectorAll('.tr.g1, .tr.g2');
        rows.forEach(row => {
            const nextRow = row.nextElementSibling;
            if (nextRow && !nextRow.classList.contains('g1') && !nextRow.classList.contains('g2')) {
                row.addEventListener('mouseenter', () => {
                    if (!row.classList.contains('selected')) {
                        row.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                        nextRow.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    }
                });
                row.addEventListener('mouseleave', () => {
                    if (!row.classList.contains('selected')) {
                        row.style.backgroundColor = '';
                        nextRow.style.backgroundColor = '';
                    }
                });
                nextRow.addEventListener('mouseenter', () => {
                    if (!row.classList.contains('selected')) {
                        row.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                        nextRow.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                    }
                });
                nextRow.addEventListener('mouseleave', () => {
                    if (!row.classList.contains('selected')) {
                        row.style.backgroundColor = '';
                        nextRow.style.backgroundColor = '';
                    }
                });
            }
        });

        const entries = document.querySelectorAll('.torrent-entry');
        entries.forEach(entry => {
            entry.addEventListener('mouseenter', () => {
                if (!entry.classList.contains('selected')) {
                    entry.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                }
            });
            entry.addEventListener('mouseleave', () => {
                if (!entry.classList.contains('selected')) {
                    entry.style.backgroundColor = '';
                }
            });
        });
    }

    function getSelectedItemLinks() {
        // Use a Set to store unique links and prevent duplication
        const uniqueLinks = new Set();
        const uniqueIds = new Set();

        // Process selected rows in table view
        const selectedRows = document.querySelectorAll('.tr.g1.selected, .tr.g2.selected');
        selectedRows.forEach(row => {
            // Extract torrent ID to prevent duplicates
            const id = getIdentifierFromElement(row);
            if (id && !uniqueIds.has(id)) {
                uniqueIds.add(id);
                const textarea = row.nextElementSibling.querySelector('textarea');
                if (textarea && textarea.value) {
                    uniqueLinks.add(textarea.value);
                }
            }
        });

        // Only process grid items if grid view is active
        const gridContainer = document.getElementById('torrent-grid-container');
        if (gridContainer && gridContainer.style.display !== 'none') {
            const selectedEntries = document.querySelectorAll('.torrent-entry.selected');
            selectedEntries.forEach(entry => {
                // Extract torrent ID to prevent duplicates
                const id = getIdentifierFromElement(entry);
                if (id && !uniqueIds.has(id)) {
                    uniqueIds.add(id);
                    const textarea = entry.querySelector('textarea');
                    if (textarea && textarea.value) {
                        uniqueLinks.add(textarea.value);
                    }
                }
            });
        }

        return Array.from(uniqueLinks);
    }

    function copySelectedLinksToClipboard() {
        const selectedLinks = getSelectedItemLinks();
        if (selectedLinks.length > 0) {
            const clipboardText = selectedLinks.join('\n');
            GM_setClipboard(clipboardText);
        }
    }

    function sendSelectedLinksToDebrid(e) {
        e.preventDefault();
        const selectedLinks = getSelectedItemLinks();
        if (selectedLinks.length > 0) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = './downloader';

            const input = document.createElement('textarea');
            input.name = 'links';
            input.value = selectedLinks.join('\n');
            form.appendChild(input);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    }

    function extractUrlsFromText(text) {
        // Enhanced URL regex that better handles various URL formats
        const urlRegex = /(?:(?:https?|ftp):\/\/|www\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/ig;
        const urls = text.match(urlRegex) || [];
        // Filter out duplicates and ensure proper http prefix
        return [...new Set(urls)].map(url => {
            if (!url.startsWith('http')) {
                return 'http://' + url;
            }
            return url;
        });
    }

    function addExtractUrlsButtonToDownloader() {
        const textarea = document.getElementById('links');
        if (textarea) {
            const button = document.createElement('button');
            button.id = 'extractUrlsButton';
            button.textContent = 'Extract URLs';

            // Function to update button state based on textarea content
            const updateButtonState = () => {
                const hasContent = textarea.value.trim().length > 0;
                button.disabled = !hasContent;
            };

            // Initially set button state
            updateButtonState();

            // Update button state when textarea content changes
            textarea.addEventListener('input', updateButtonState);
            textarea.addEventListener('paste', () => {
                // Use setTimeout to check after paste content is inserted
                setTimeout(updateButtonState, 0);
            });
            textarea.addEventListener('change', updateButtonState);

            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Prevent action if button is disabled
                if (button.disabled) {
                    return;
                }

                const content = textarea.value;
                const urls = extractUrlsFromText(content);

                // Add visual feedback
                addButtonClickFeedback(button);

                if (urls.length > 0) {
                    textarea.value = urls.join('\n');
                    // Visual feedback
                    button.textContent = `${urls.length} URLs Found`;
                    setTimeout(() => {
                        button.textContent = 'Extract URLs';
                        updateButtonState(); // Re-check state after timeout
                    }, 2000);
                } else {
                    button.textContent = 'No URLs Found';
                    setTimeout(() => {
                        button.textContent = 'Extract URLs';
                        updateButtonState(); // Re-check state after timeout
                    }, 2000);
                }
            });

            textarea.parentNode.style.position = 'relative';
            textarea.parentNode.appendChild(button);
        }
    }

    function addCopyLinksButton() {
        // Use an interval to wait for the links container to be populated,
        // as content may be loaded dynamically.
        const interval = setInterval(() => {
            const linksContainer = document.querySelector('#links-container');
            const buttonExists = document.getElementById('copy_links');

            // Wait for container with content, and ensure button doesn't already exist.
            if (linksContainer && linksContainer.children.length > 0 && !buttonExists) {
                clearInterval(interval); // Stop the interval.

                // Create button container for side-by-side layout
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.justifyContent = 'center';
                buttonContainer.style.margin = '10px auto';

                const copyButton = document.createElement('button');
                copyButton.id = 'copy_links';
                copyButton.textContent = 'Copy link(s) to clipboard';
                copyButton.type = 'button';

                // Style the button to be consistent with the page/script
                Object.assign(copyButton.style, {
                    padding: '12px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.3px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
                    minWidth: '220px',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                });

                copyButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    let links = '';

                    // Prefer the ORIGINAL RD raw textarea if it exists and is non-empty
                    const deblinksRaw = document.getElementById('deblinks_raw');
                    if (deblinksRaw && deblinksRaw.value.trim()) {
                        links = deblinksRaw.value
                            .split('\n')
                            .filter(l => l.includes('download.real-debrid.com') && !l.includes('streaming'))
                            .join('\n');
                    } else {
                        // Otherwise, always build from the current DOM
                        links = getAllDownloadLinks().join('\n');
                    }

                    if (links && links.trim()) {
                        GM_setClipboard(links.trim());
                        addButtonClickFeedback(copyButton, 'Copied!');
                    }
                });

                // Create Download ALL button
                const downloadAllButton = document.createElement('button');
                downloadAllButton.id = 'download_all_links';
                downloadAllButton.textContent = 'Download ALL';
                downloadAllButton.type = 'button';

                // Style the download button with different color
                Object.assign(downloadAllButton.style, {
                    padding: '12px 20px',
                    backgroundColor: '#FF9800', // Orange color
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: '14px',
                    fontWeight: '500',
                    letterSpacing: '0.3px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16)',
                    minWidth: '220px',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                });

                downloadAllButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    downloadAllFiles();
                });

                // Add buttons to container
                buttonContainer.appendChild(copyButton);
                buttonContainer.appendChild(downloadAllButton);

                linksContainer.insertAdjacentElement('afterend', buttonContainer);
            }
        }, 500);

        // Stop checking after 15 seconds to avoid running forever
        setTimeout(() => clearInterval(interval), 15000);
    }

    function setupLinkViewToggle() {
        const interval = setInterval(() => {
            const linksContainer = document.querySelector('#links-container');
            const toggleCheckbox = document.querySelector('input[name="showlinks"]');

            if (!linksContainer || !toggleCheckbox || linksContainer.children.length === 0) {
                return; // Not ready yet
            }

            // Prevent re-running the setup
            if (toggleCheckbox.dataset.isSetup) {
                return;
            }

            const rawTextArea = document.getElementById('deblinks_raw');

            // Scenario 1: RD page already in native raw view mode
            if (rawTextArea) {
                clearInterval(interval);
                const label = toggleCheckbox.nextSibling;
                if (label && label.nodeType === Node.TEXT_NODE) {
                    label.textContent = ' (Raw link view active)';
                }
                toggleCheckbox.disabled = true;
                toggleCheckbox.dataset.isSetup = 'true';
                return;
            }

            // Scenario 2: rich view mode -> we add our own raw download-only view
            const getRichLinkElements = () => linksContainer.querySelectorAll('.link-generated');
            if (getRichLinkElements().length > 0) {
                clearInterval(interval);
                const label = toggleCheckbox.nextSibling;
                if (label && label.nodeType === Node.TEXT_NODE) {
                    label.textContent = ' Toggle Raw Download Links';
                }

                const newRawTextArea = document.createElement('textarea');
                newRawTextArea.id = 'deblinks_raw_generated';
                newRawTextArea.readOnly = true;
                Object.assign(newRawTextArea.style, {
                    height: '200px',
                    width: '100%',
                    display: 'none',
                    boxSizing: 'border-box'
                });

                linksContainer.appendChild(newRawTextArea);
                toggleCheckbox.checked = false;

                toggleCheckbox.addEventListener('change', () => {
                    const isChecked = toggleCheckbox.checked;
                    if (isChecked) {
                        // Build fresh list of DOWNLOAD links, no streaming links
                        const links = getAllDownloadLinks().join('\n');
                        newRawTextArea.value = links;
                    }

                    newRawTextArea.style.display = isChecked ? 'block' : 'none';

                    // Show/hide rich blocks based on current DOM, not a stale NodeList
                    getRichLinkElements().forEach(el => {
                        el.style.display = isChecked ? 'none' : 'block';
                    });
                });

                toggleCheckbox.dataset.isSetup = 'true';
            }
        }, 500);

        // Safety: stop trying after 15 seconds
        setTimeout(() => clearInterval(interval), 15000);
    }

    function cleanupTorrentPageLayout() {
        const textContainer = document.querySelector('html.cufon-active.cufon-ready body div#block div#contentblock div#wrapper_global div.main_content_wrapper div.full_width_wrapper');
        if (textContainer) {
            Array.from(textContainer.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    node.remove();
                }
            });
        }

        const brElements = document.querySelectorAll('html.cufon-active.cufon-ready body div#block div#contentblock div#wrapper_global div.main_content_wrapper div.full_width_wrapper br');
        brElements.forEach(br => br.remove());

        const centerElements = document.querySelectorAll('html.cufon-active.cufon-ready body div#block div#contentblock div#wrapper_global div.main_content_wrapper div.full_width_wrapper center');
        centerElements.forEach(center => center.remove());

        const contentSeparatorMiniElements = document.querySelectorAll('html.cufon-active.cufon-ready body div#block div#contentblock div#wrapper_global div.main_content_wrapper div.full_width_wrapper div.content_separator_mini');
        contentSeparatorMiniElements.forEach(div => div.remove());

        const h2Elements = document.querySelectorAll('html.cufon-active.cufon-ready body div#block div#contentblock div#wrapper_global div.main_content_wrapper div.full_width_wrapper h2');
        h2Elements.forEach(h2 => h2.remove());

        const spanElements = document.querySelectorAll('html.cufon-active.cufon-ready body div#block div#contentblock div#wrapper_global div.main_content_wrapper div.full_width_wrapper span.px10');
        spanElements.forEach(span => span.remove());
    }

    function redesignTorrentInfoWindow() {
        const facebox = document.getElementById('facebox');
        if (facebox) {
            const content = facebox.querySelector('.content');
            if (content) {
                // Count torrent sections by splitting on <h2> tags
                const torrentInfos = content.innerHTML.split('<h2>Torrent Files</h2>').filter(info => info.trim() !== '');

                // Only apply grid layout if 3+ torrents
                if (torrentInfos.length < 3) return;

                // Add class for CSS to apply instead of inline styles
                content.classList.add('grid-layout');
                // Add class to facebox itself for positioning
                facebox.classList.add('grid-layout');

                // Store the original buttons with their event listeners
                const startButtons = Array.from(content.querySelectorAll('input[type="button"][value="Start my torrent"]'));

                content.innerHTML = '';

                torrentInfos.forEach((info, index) => {
                    const div = document.createElement('div');
                    div.className = 'torrent-info';

                    // Create a temporary div to parse the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = '<h2>Torrent Files</h2>' + info;

                    // Move the content except the button
                    while (tempDiv.firstChild) {
                        if (tempDiv.firstChild.tagName !== 'INPUT' || tempDiv.firstChild.type !== 'button') {
                            div.appendChild(tempDiv.firstChild);
                        } else {
                            tempDiv.removeChild(tempDiv.firstChild);
                        }
                    }

                    // Append the original button with its event listeners
                    if (startButtons[index]) {
                        div.appendChild(startButtons[index]);
                    }

                    content.appendChild(div);
                });
            }
        }
    }

    function setupTorrentInfoWindowObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.id === 'facebox') {
                            redesignTorrentInfoWindow();
                        }
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function checkForTorrentInfoWindow() {
        const intervalId = setInterval(() => {
            const facebox = document.getElementById('facebox');
            if (facebox) {
                redesignTorrentInfoWindow();
                clearInterval(intervalId);
            }
        }, 1000);
    }

    function createGridLayout(columnCount) {
        const table = document.querySelector('table[width="100%"]');
        if (!table) return;

        // First, check if grid already exists and remove it
        const existingGrid = document.getElementById('torrent-grid-container');
        if (existingGrid) {
            existingGrid.remove();
        }

        // Create grid container
        const container = document.createElement('div');
        container.id = 'torrent-grid-container';

        // Create grid items from table rows
        const rows = table.querySelectorAll('tr');
        for (let i = 1; i < rows.length; i += 2) {
            // Check if original row is selected
            const isSelected = rows[i].classList.contains('selected');
            const torrentDiv = createGridItemFromTableRows(rows[i], rows[i + 1], isSelected);
            container.appendChild(torrentDiv);
        }

        // Insert grid after the table
        table.parentNode.insertBefore(container, table.nextSibling);

        // Hide the table but keep it in the DOM
        table.style.display = 'none';

        // Mark the table for later reference
        table.id = 'original-torrent-table';

        applyGridLayoutStyles(columnCount);

        // Apply enhanced selection handling
        setupGridItemsEventHandlers();

        updateFloatingButtonsVisibility(); // Update button visibility to reflect current selections
    }

    function applyGridLayoutStyles(columnCount) {
        GM_addStyle(`
            #torrent-grid-container {
                width: 100%;
                max-width: 1280px;
                margin: 24px auto 0 auto;
                display: grid;
                grid-template-columns: repeat(1, minmax(0, 1fr));
                gap: 24px;
            }
            
            @media (min-width: 768px) {
                #torrent-grid-container {
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                }
            }
            
            @media (min-width: 1024px) {
                #torrent-grid-container {
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                }
            }
        `);
    }

    function adjustImageSizeInNewLayout() {
        document.querySelectorAll('#torrent-grid-container .torrent-entry form input[type="image"]').forEach(function(img) {
            img.style.width = '10%';
            img.style.height = 'auto';
            img.style.display = 'inline-block';
            img.style.marginLeft = '10px';
        });

        document.querySelectorAll('#torrent-grid-container .torrent-entry form').forEach(function(form) {
            form.style.display = 'flex';
            form.style.alignItems = 'center';
        });
    }

    function moveDeleteLinkToEnd() {
        document.querySelectorAll('.torrent-entry').forEach(entry => {
            const deleteLink = entry.querySelector('a[href*="del"]');
            if (deleteLink) {
                // Create a container for the delete link
                const deleteContainer = document.createElement('div');
                deleteContainer.classList.add('delete-container');
                deleteContainer.style.position = 'absolute';
                deleteContainer.style.right = '0';
                deleteContainer.style.top = '0';
                deleteContainer.style.display = 'flex';
                deleteContainer.style.alignItems = 'center';
                deleteContainer.style.height = '100%';
                deleteContainer.style.paddingRight = '10px';

                // Move the delete link into the new container
                deleteContainer.appendChild(deleteLink);
                entry.appendChild(deleteContainer);

                // Ensure the parent .torrent-entry has relative positioning
                entry.style.position = 'relative';
            }
        });
    }

    function createGridItemFromTableRows(mainRow, detailRow, isSelected = false) {
        const div = document.createElement('div');
        div.className = 'torrent-entry';
        if (isSelected) {
            div.classList.add('selected');
        }

        // Extract data from rows
        const nameElement = mainRow.querySelector('[id^="name_"]');
        const name = nameElement ? nameElement.textContent.trim() : 'Unknown';

        const deleteLink = mainRow.querySelector('a[href*="del"]') || detailRow.querySelector('a[href*="del"]');
        const downloadButton = detailRow.querySelector('input[type="image"]');

        // Try to extract the direct link from various possible elements
        let linkValue = '';
        let linkSource =
            detailRow.querySelector('input[type="text"][id^="link_"]') ||
            detailRow.querySelector('input[type="text"][name*="link"]') ||
            detailRow.querySelector('input[type="text"]');

        if (linkSource && linkSource.value && linkSource.value.trim()) {
            linkValue = linkSource.value.trim();
        } else {
            // Fallback: RD often uses a textarea with one or many links (one per line)
            const textarea = detailRow.querySelector('textarea');
            if (textarea && textarea.value && textarea.value.trim()) {
                // Keep the full multiline content so the card textarea mirrors
                // the original "links" field, and copy/download work on all links.
                linkValue = textarea.value.trim();
            }
        }

        // Extract status/progress
        const statusText = mainRow.textContent || '';
        let status = 'processing';
        let progress = '0';
        if (statusText.includes('100%') || statusText.includes('Finished')) {
            status = 'finished';
            progress = '100';
        } else if (statusText.includes('Error') || statusText.includes('error')) {
            status = 'error';
        } else {
            const progressMatch = statusText.match(/(\d+)%/);
            if (progressMatch) {
                progress = progressMatch[1];
            }
        }

        // Extract stats (files, seeders, speed) from the main row
        // Files: the numeric "S" column (td.px10)
        let fileCount = '0';
        const filesCell = mainRow.querySelector('td.px10');
        if (filesCell && filesCell.textContent) {
            const raw = filesCell.textContent.trim();
            if (raw) {
                fileCount = raw;
            }
        }

        // Seeders: content of the .seed-icon div
        let seeders = '0';
        const seedersElement = mainRow.querySelector('.seed-icon');
        if (seedersElement && seedersElement.textContent) {
            const raw = seedersElement.textContent.trim();
            if (raw !== '') {
                seeders = raw;
            }
        }

        // Speed: text inside the speed span (e.g. "0 B/s")
        let speed = '0 B/s';
        const speedElement = mainRow.querySelector('[id^="speed_"]');
        if (speedElement && speedElement.textContent) {
            const raw = speedElement.textContent.trim();
            if (raw) {
                speed = raw;
            }
        }

        // File info (facebox) button so we can open the usual files popup from the "FILES" stat
        const fileInfoButton = mainRow.querySelector('a[rel="facebox"]') || detailRow.querySelector('a[rel="facebox"]');

        // Create header
        const header = document.createElement('div');
        header.className = 'torrent-entry-header';
        
        const title = document.createElement('h3');
        title.className = 'torrent-entry-title';
        title.textContent = name;
        title.title = name;
        header.appendChild(title);

        // Hidden span carrying the original torrent ID so selection sync works
        // (used by getIdentifierFromElement on grid entries)
        if (nameElement && nameElement.id) {
            const idSpan = document.createElement('span');
            idSpan.id = nameElement.id;
            idSpan.style.display = 'none';
            header.appendChild(idSpan);
        }

        if (deleteLink) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'torrent-entry-delete-btn';
            // Trash-can icon to better match the React app
            deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M10 11v6M14 11v6M8 6l1-2h6l1 2m-1 14H8a2 2 0 0 1-2-2L5 6h14l-1 12a2 2 0 0 1-2 2z"/></svg>';
            deleteBtn.title = 'Delete';
            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                deleteLink.click();
            };
            header.appendChild(deleteBtn);
        }

        // Create body
        const body = document.createElement('div');
        body.className = 'torrent-entry-body';

        // Info grid (status + hoster)
        const infoGrid = document.createElement('div');
        infoGrid.className = 'torrent-entry-info-grid';

        // Status badge
        const statusBadge = document.createElement('div');
        statusBadge.className = `torrent-entry-status ${status}`;
        const statusIcon = document.createElement('span');
        statusIcon.className = 'torrent-entry-status-icon';
        if (status === 'finished') {
            statusIcon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
        } else if (status === 'error') {
            statusIcon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        } else {
            statusIcon.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>';
        }
        const statusTextSpan = document.createElement('span');
        statusTextSpan.textContent = status === 'finished' ? 'Finished' : status === 'error' ? 'Error' : `${progress}%`;
        statusBadge.appendChild(statusIcon);
        statusBadge.appendChild(statusTextSpan);
        infoGrid.appendChild(statusBadge);

        // Hoster tag
        const hosterContainer = document.createElement('div');
        hosterContainer.className = 'torrent-entry-hoster';
        const hosterTag = document.createElement('span');
        hosterTag.className = 'torrent-entry-hoster-tag';
        hosterTag.textContent = 'RD';
        hosterContainer.appendChild(hosterTag);
        infoGrid.appendChild(hosterContainer);

        body.appendChild(infoGrid);

        // Stats row
        const statsRow = document.createElement('div');
        statsRow.className = 'torrent-entry-stats';

        const filesStat = createStat('Files', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>', fileCount);
        const seedersStat = createStat('Seeders', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>', seeders);
        const speedStat = createStat('Speed', '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>', speed);

        // Make FILES stat open the usual RD files popup
        if (fileInfoButton) {
            filesStat.style.cursor = 'pointer';
            filesStat.addEventListener('click', (e) => {
                e.stopPropagation();

                // Try to use jQuery.facebox directly if available for a closer match
                // to the site's native "files" behavior; otherwise fall back to
                // simulating a click on the original anchor.
                try {
                    const href = fileInfoButton.getAttribute('href');
                    const jq = window.jQuery || window.$;

                    if (jq && typeof jq.facebox === 'function' && href) {
                        // Use the site's own facebox implementation
                        jq.facebox({ ajax: href });
                    } else if (typeof window.facebox === 'function' && href) {
                        // Some builds expose a global facebox(...) helper
                        window.facebox({ ajax: href });
                    } else {
                        // Fallback: dispatch a real click event on the original link
                        if (typeof fileInfoButton.click === 'function') {
                            fileInfoButton.click();
                        } else {
                            const evt = new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            fileInfoButton.dispatchEvent(evt);
                        }
                    }
                } catch (err) {
                    // Last‑resort fallback
                    if (typeof fileInfoButton.click === 'function') {
                        fileInfoButton.click();
                    }
                }
            });
        }

        statsRow.appendChild(filesStat);
        statsRow.appendChild(seedersStat);
        statsRow.appendChild(speedStat);
        body.appendChild(statsRow);

        // Footer with link input and download button
        const footer = document.createElement('div');
        footer.className = 'torrent-entry-footer';

        const linkWrapper = document.createElement('div');
        linkWrapper.className = 'torrent-entry-link-input-wrapper';
        
        const linkInputNew = document.createElement('textarea');
        linkInputNew.className = 'torrent-entry-link-input';
        linkInputNew.readOnly = true;
        linkInputNew.value = linkValue || 'No link generated';
        // Show up to 2 lines by default; the CSS max-height/overflow will handle longer ones
        linkInputNew.rows = Math.min(2, (linkValue && linkValue.split('\n').length) || 1);
        linkInputNew.onclick = (e) => e.stopPropagation();
        linkWrapper.appendChild(linkInputNew);

        if (linkValue) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'torrent-entry-copy-btn';
            copyBtn.innerHTML = '📋';
            copyBtn.title = 'Copy Link';
            copyBtn.onclick = (e) => {
                e.stopPropagation();
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(linkValue);
                } else {
                    linkInputNew.select();
                    document.execCommand('copy');
                }
                copyBtn.innerHTML = '✓';
                copyBtn.style.color = '#10b981';
                setTimeout(() => {
                    copyBtn.innerHTML = '📋';
                    copyBtn.style.color = '';
                }, 2000);
            };
            linkWrapper.appendChild(copyBtn);
        }

        footer.appendChild(linkWrapper);

        if (linkValue && downloadButton) {
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'torrent-entry-download-btn';
            downloadBtn.title = 'Download File';
            downloadBtn.onclick = (e) => {
                e.stopPropagation();
                downloadButton.click();
            };
            downloadBtn.innerHTML = '↓';
            downloadBtn.style.color = 'white';
            downloadBtn.style.fontSize = '18px';
            footer.appendChild(downloadBtn);
        }

        body.appendChild(footer);

        // Assemble card
        div.appendChild(header);
        div.appendChild(body);

        return div;
    }

    function createStat(label, icon, value) {
        const stat = document.createElement('div');
        stat.className = 'torrent-entry-stat';
        
        const labelSpan = document.createElement('span');
        labelSpan.className = 'torrent-entry-stat-label';
        labelSpan.textContent = label;
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'torrent-entry-stat-value';
        const iconSpan = document.createElement('span');
        iconSpan.className = 'torrent-entry-stat-icon';
        iconSpan.innerHTML = icon;
        const valueSpan = document.createElement('span');
        valueSpan.textContent = value;
        valueDiv.appendChild(iconSpan);
        valueDiv.appendChild(valueSpan);
        
        stat.appendChild(labelSpan);
        stat.appendChild(valueDiv);
        
        return stat;
    }

    // Get a unique identifier from an element (row or grid item)
    function getIdentifierFromElement(element) {
        // Try to find a unique ID in the element (torrent ID, name ID, etc.)
        const idElement = element.querySelector('[id^="name_"], [id^="link_"], [id^="status_"]');
        if (idElement) {
            return idElement.id;
        }
        return null;
    }

    // Sync selection state between table and grid views
    function syncSelectionState(id, isSelected) {
        if (!id) return;

        // Get ID prefix and suffix
        const parts = id.split('_');
        if (parts.length < 2) return;

        const prefix = parts[0];
        const suffix = parts[1];

        // Get all elements with IDs containing this suffix (both in table and grid)
        const selector = `[id$="_${suffix}"]`;
        const relatedElements = document.querySelectorAll(selector);

        // Find related rows and grid items
        let tableRows = [];
        let gridItems = [];

        relatedElements.forEach(el => {
            // Find containing row
            let row = el.closest('.tr.g1, .tr.g2');
            if (row) {
                tableRows.push(row);
                // Also get the next row (detail row)
                if (row.nextElementSibling && !row.nextElementSibling.classList.contains('g1') &&
                    !row.nextElementSibling.classList.contains('g2')) {
                    tableRows.push(row.nextElementSibling);
                }
            }

            // Find containing grid item
            let gridItem = el.closest('.torrent-entry');
            if (gridItem) {
                gridItems.push(gridItem);
            }
        });

        // Apply selection state to all related elements
        tableRows = [...new Set(tableRows)]; // Remove duplicates
        tableRows.forEach(row => {
            if (isSelected) {
                row.classList.add('selected');
            } else {
                row.classList.remove('selected');
            }
        });

        gridItems = [...new Set(gridItems)]; // Remove duplicates
        gridItems.forEach(item => {
            if (isSelected) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    function addSwitchToGridLayoutButton() {
        const button = document.createElement('button');
        button.textContent = 'Switch to Grid Layout';
        button.id = 'switchLayoutButton';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '20px';
        button.style.zIndex = '1000';
        
        // Check localStorage for saved preference
        const savedLayout = localStorage.getItem('rd-grid-layout-enabled');
        const initialLayout = savedLayout === 'true' ? 'grid' : 'table';
        button.setAttribute('data-current-layout', initialLayout);
        
        // Apply saved layout preference on load
        if (initialLayout === 'grid') {
            // Wait for table to be available before applying grid layout
            const checkTable = setInterval(() => {
                const table = document.querySelector('table[width="100%"]');
                if (table) {
                    clearInterval(checkTable);
                    const columnCount = 3;
                    createGridLayout(columnCount);
                    button.textContent = 'Switch to Table Layout';
                }
            }, 100);
            
            // Stop checking after 5 seconds to avoid infinite loop
            setTimeout(() => clearInterval(checkTable), 5000);
        }
        
        button.addEventListener('click', (e) => {
            // Add visual feedback
            addButtonClickFeedback(button);
            toggleLayout();
        });
        document.body.appendChild(button);
    }

    function toggleLayout() {
        const button = document.getElementById('switchLayoutButton');
        const currentLayout = button.getAttribute('data-current-layout');

        if (currentLayout === 'table') {
            // Switch to grid layout
            const columnCount = 3;
            createGridLayout(columnCount);

            button.textContent = 'Switch to Table Layout';
            button.setAttribute('data-current-layout', 'grid');
            localStorage.setItem('rd-grid-layout-enabled', 'true');
        } else {
            // Switch back to table layout without reload
            const gridContainer = document.getElementById('torrent-grid-container');
            const originalTable = document.getElementById('original-torrent-table');

            if (gridContainer && originalTable) {
                // Hide grid, show table
                gridContainer.style.display = 'none';
                originalTable.style.display = 'table';

                button.textContent = 'Switch to Grid Layout';
                button.setAttribute('data-current-layout', 'table');
                localStorage.setItem('rd-grid-layout-enabled', 'false');
            }
        }

        // Update floating buttons visibility
        updateFloatingButtonsVisibility();
    }

    function switchToGridLayout() {
        const button = document.getElementById('switchLayoutButton');
        if (button.getAttribute('data-current-layout') === 'table') {
            toggleLayout();
        }
    }

    function deleteSelectedTorrents() {
        const selectedItems = document.querySelectorAll('.tr.g1.selected, .tr.g2.selected, .torrent-entry.selected');
        const deleteIds = [];

        selectedItems.forEach(item => {
            // Find delete link within the item
            const deleteLink = item.querySelector('a[href*="del="]');
            if (deleteLink) {
                const href = deleteLink.getAttribute('href');
                const match = href.match(/del=([^&]+)/);
                if (match && match[1]) {
                    deleteIds.push(match[1]);
                }
            }
        });

        if (deleteIds.length === 0) return;

        if (confirm(`Delete ${deleteIds.length} selected torrents?`)) {
            // Change button text to "Deleting..." after confirmation
            const originalWidth = deleteButton.offsetWidth;
            deleteButton.textContent = 'Deleting...';
            deleteButton.style.width = `${originalWidth}px`;

            // Process deletions sequentially to avoid overwhelming the server
            deleteSequentially(deleteIds, 0);
        }
    }

    function deleteSequentially(ids, index) {
        if (index >= ids.length) {
            // All done, refresh the page
            window.location.reload();
            return;
        }

        const id = ids[index];
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `?p=1&del=${id}`, true);
        xhr.onload = function() {
            // Move to next deletion
            deleteSequentially(ids, index + 1);
        };
        xhr.onerror = function() {
            // Still try the next one
            deleteSequentially(ids, index + 1);
        };
        xhr.send();
    }

    function setupGridItemsEventHandlers() {
        const entries = document.querySelectorAll('.torrent-entry');

        entries.forEach(entry => {
            // Avoid double-binding if grid is re-created or toggled
            if (entry.getAttribute('data-grid-handlers') === 'true') return;

            // Add event stopping for buttons/links inside the card
            const deleteButton = entry.querySelector('a[href*="del"]');
            if (deleteButton) {
                deleteButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            const downloadButtons = entry.querySelectorAll('input[type="image"]');
            downloadButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            const fileInfoButtons = entry.querySelectorAll('a[rel="facebox"]');
            fileInfoButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });

            // Main click handler for selection toggling
            entry.addEventListener('click', (e) => {
                // Prevent click propagation if this is a button / file-info link
                if (e.target.closest('a[href*="del"]') ||
                    e.target.closest('input[type="image"]') ||
                    e.target.closest('a[rel="facebox"]')) {
                    return;
                }

                // Toggle selection state
                entry.classList.toggle('selected');

                // Get ID and sync with table view
                const id = getIdentifierFromElement(entry);
                if (id) {
                    const isNowSelected = entry.classList.contains('selected');
                    syncTableViewSelection(id, isNowSelected);
                }

                updateFloatingButtonsVisibility();
            });

            entry.setAttribute('data-grid-handlers', 'true');
        });
    }

    function syncTableViewSelection(id, isSelected) {
        if (!id) return;

        // Get ID suffix
        const parts = id.split('_');
        if (parts.length < 2) return;

        const suffix = parts[1];

        // Find table rows with this torrent ID
        const selector = `[id$="_${suffix}"]`;
        const originalTable = document.getElementById('original-torrent-table');
        if (!originalTable) return;

        const elements = originalTable.querySelectorAll(selector);
        elements.forEach(el => {
            const row = el.closest('.tr.g1, .tr.g2');
            if (row) {
                // Set selection state on main row
                if (isSelected) {
                    row.classList.add('selected');
                } else {
                    row.classList.remove('selected');
                }

                // Set selection state on detail row
                const nextRow = row.nextElementSibling;
                if (nextRow && !nextRow.classList.contains('g1') && !nextRow.classList.contains('g2')) {
                    if (isSelected) {
                        nextRow.classList.add('selected');
                    } else {
                        nextRow.classList.remove('selected');
                    }
                }
            }
        });
    }

    // Helper: get all current DOWNLOAD links (no streaming links)
    function getAllDownloadLinks() {
        return Array.from(document.querySelectorAll('#links-container .link-generated a'))
            .map(a => a.href)
            .filter(href =>
                href &&
                href.includes('download.real-debrid.com') && // only download links
                !href.includes('streaming')                  // exclude any streaming URLs just in case
            );
    }

    function downloadAllFiles() {
        // Get all download links from the links container
        const downloadLinks = Array.from(document.querySelectorAll('#links-container .link-generated a'))
            .filter(a => a.href && a.href.includes('download.real-debrid.com'))
            .map(a => a.href);

        if (downloadLinks.length === 0) {
            alert('No download links found!');
            return;
        }

        const downloadButton = document.getElementById('download_all_links');
        const originalText = downloadButton.textContent;
        const originalWidth = downloadButton.offsetWidth;

        // Add visual feedback
        addButtonClickFeedback(downloadButton, `Downloading ${downloadLinks.length} files...`);
        downloadButton.style.width = `${originalWidth}px`;

        // Open each link with 1-second delay
        downloadLinks.forEach((link, index) => {
            setTimeout(() => {
                window.open(link, '_blank');
                
                // Update progress text
                downloadButton.textContent = `Downloading ${index + 1}/${downloadLinks.length}...`;
                downloadButton.style.width = `${originalWidth}px`;

                // Restore original text when done
                if (index === downloadLinks.length - 1) {
                    setTimeout(() => {
                        downloadButton.textContent = originalText;
                        downloadButton.style.width = '';
                    }, 1000);
                }
            }, index * 1000); // 1 second delay between each download
        });
    }

    // Helper function to add visual feedback to buttons
    function addButtonClickFeedback(button, tempText = null) {
        // Store original text if we're changing it
        const originalText = tempText ? button.textContent : null;

        // Store original width to prevent layout shifts
        const originalWidth = button.offsetWidth;

        // Add animation class
        button.classList.add('button-clicked');

        // Change text if specified
        if (tempText) {
            button.textContent = tempText;
            // Ensure width doesn't change
            button.style.width = `${originalWidth}px`;
        }

        // Remove animation class and restore text after animation
        setTimeout(() => {
            button.classList.remove('button-clicked');
            if (originalText) {
                button.textContent = originalText;
                // Remove explicit width to allow natural sizing again
                button.style.width = '';
            }
        }, 500);
    }

    // Multi-upload functionality
    function initMultiUpload() {
        const targetForm = document.querySelector('#wrapper_global > div > div > form');
        if (!targetForm) return;

        // Create multi-upload container
        const container = document.createElement('div');
        container.id = 'multiUploadContainer';
        container.innerHTML = `
            <h3>Multi-Upload Torrents</h3>
            <div id="multiUploadDrop">
                <p>Drop torrent files here</p>
                <button type="button">Browse Files</button>
                <input type="file" name="file" multiple accept=".torrent" />
            </div>
            <ul id="multiUploadList"></ul>
        `;

        // Insert after the main form
        targetForm.parentNode.insertBefore(container, targetForm.nextSibling);

        const dropZone = document.getElementById('multiUploadDrop');
        const fileInput = dropZone.querySelector('input[type="file"]');
        const browseBtn = dropZone.querySelector('button');
        const uploadList = document.getElementById('multiUploadList');

        // Browse button click
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop events
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            handleFiles(files);
            fileInput.value = ''; // Reset input
        });

        // Handle selected files
        function handleFiles(files) {
            const splittingSize = document.getElementById('splitting_size')?.value || '';
            const hoster = document.getElementById('hoster')?.value || '';

            Array.from(files).forEach(file => {
                if (!file.name.endsWith('.torrent')) {
                    alert(`${file.name} is not a .torrent file`);
                    return;
                }

                const listItem = createUploadListItem(file);
                uploadList.appendChild(listItem);

                // Start upload
                uploadFile(file, listItem, splittingSize, hoster);
            });
        }

        // Create upload list item
        function createUploadListItem(file) {
            const li = document.createElement('li');
            li.classList.add('working');
            li.innerHTML = `
                <p>${escapeHtml(file.name)}<i>${formatFileSize(file.size)}</i></p>
                <div class="percentage">0%</div>
                <div class="speed"></div>
                <button class="cancel-btn">×</button>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            `;
            return li;
        }

        // Upload file using jQuery fileupload (if available) or fallback to XMLHttpRequest
        function uploadFile(file, listItem, splittingSize, hoster) {
            const formData = new FormData();
            formData.append('file', file);
            if (splittingSize) formData.append('splitting_size', splittingSize);
            if (hoster) formData.append('hoster', hoster);

            const xhr = new XMLHttpRequest();
            const cancelBtn = listItem.querySelector('.cancel-btn');
            const progressFill = listItem.querySelector('.progress-fill');
            const percentageEl = listItem.querySelector('.percentage');
            const speedEl = listItem.querySelector('.speed');

            let startTime = Date.now();
            let startLoaded = 0;

            // Cancel button
            cancelBtn.addEventListener('click', () => {
                xhr.abort();
                listItem.style.opacity = '0.5';
                setTimeout(() => {
                    listItem.remove();
                    checkAllUploadsComplete();
                }, 300);
            });

            // Progress tracking
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    progressFill.style.width = progress + '%';
                    percentageEl.textContent = progress + '%';

                    // Calculate speed
                    const currentTime = Date.now();
                    const timeDiff = (currentTime - startTime) / 1000; // seconds
                    const loadedDiff = e.loaded - startLoaded;
                    
                    if (timeDiff > 0.5) { // Update speed every 0.5 seconds
                        const speed = loadedDiff / timeDiff;
                        speedEl.textContent = formatFileSize(speed) + '/s';
                        startTime = currentTime;
                        startLoaded = e.loaded;
                    }
                }
            });

            // Upload complete
            xhr.addEventListener('load', () => {
                if (xhr.status === 200 || xhr.status === 302) {
                    listItem.classList.remove('working');
                    listItem.classList.add('complete');
                    percentageEl.textContent = '✓';
                    speedEl.textContent = 'Complete';
                    cancelBtn.style.display = 'none';
                    
                    checkAllUploadsComplete();
                } else {
                    handleUploadError(listItem, 'Upload failed');
                }
            });

            // Upload error
            xhr.addEventListener('error', () => {
                handleUploadError(listItem, 'Network error');
            });

            // Upload aborted
            xhr.addEventListener('abort', () => {
                handleUploadError(listItem, 'Cancelled');
            });

            // Send request
            xhr.open('POST', 'https://real-debrid.com/torrents', true);
            xhr.send(formData);
        }

        function handleUploadError(listItem, message) {
            listItem.classList.remove('working');
            listItem.classList.add('error');
            const speedEl = listItem.querySelector('.speed');
            speedEl.textContent = message;
            speedEl.style.color = '#ef4444';
            checkAllUploadsComplete();
        }

        function checkAllUploadsComplete() {
            const workingItems = uploadList.querySelectorAll('li.working');
            if (workingItems.length === 0) {
                const totalItems = uploadList.querySelectorAll('li').length;
                if (totalItems > 0) {
                    // All uploads finished, refresh after delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            }
        }

        function formatFileSize(bytes) {
            if (typeof bytes !== 'number' || bytes === 0) return '0 KB';
            
            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }
            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }
            return (bytes / 1000).toFixed(2) + ' KB';
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    }

    if (document.readyState === 'complete') {
        initializeApplication();
    } else {
        window.addEventListener('load', initializeApplication);
    }
})();

// ==UserScript==
// @name         GitHub IDE Preview
// @description  Adds a 'Preview' button to GitHub repositories to open them in github1s.com for quick IDE-style navigation.
// @icon         https://github.githubassets.com/favicons/favicon-dark.svg
// @version      1.3
// @author       afkarxyz
// @namespace    https://github.com/afkarxyz/userscripts/
// @supportURL   https://github.com/afkarxyz/userscripts/issues
// @license      MIT
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521507/GitHub%20IDE%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/521507/GitHub%20IDE%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const PREVIEW_BTN_ID = 'gh-preview-btn';
    
    function addPreviewButton() {
        let $navi = document.querySelector('#branch-picker-repos-header-ref-selector');
        
        if ($navi) {
            $navi = $navi.parentElement.parentElement.nextElementSibling;
        } else {
            $navi = document.querySelector('#StickyHeader .js-github-dev-new-tab-shortcut');
            if (!$navi) {
                $navi = document.querySelector('[data-testid="tree-overflow-menu-anchor"]');
                if (!$navi) return;
            }
            $navi = $navi.parentElement;
        }
        
        if (!$navi) return;
        
        const style = document.createElement('style');
        style.textContent = `
            #${PREVIEW_BTN_ID} {
                display: inline-flex !important;
                align-items: center !important;
                gap: 8px !important;
                line-height: 1 !important;
                background-color: #1f6feb !important;
                border-color: #ffffff1a !important;
                color: #ffffff !important;
            }
            #${PREVIEW_BTN_ID}:hover {
                background-color: #2576f5 !important;
                border-color: #2576f5 !important;
            }
            #${PREVIEW_BTN_ID} svg {
                display: inline-block !important;
                flex-shrink: 0 !important;
            }
        `;
        document.head.appendChild(style);
        
        let previewBtn = document.getElementById(PREVIEW_BTN_ID);
        if (!previewBtn) {
            previewBtn = document.createElement('a');
            previewBtn.id = PREVIEW_BTN_ID;
        }
        
        const isRoot = location.pathname.split('/').length <= 3;
        previewBtn.className = `btn d-none d-md-block ${isRoot ? 'ml-0' : ''}`;
        previewBtn.target = '_blank';
        
        const github1sUrl = window.location.href.replace('github.com', 'github1s.com');
        
        const iconSvg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 400 400">
                <path fill="currentColor" d="M35.587 25.574 C 26.887 34.274,22.366 85.319,28.408 106.640 C 29.808 111.581,30.362 115.990,29.639 116.436 C 22.375 120.926,6.586 153.361,2.311 172.577 C -1.702 190.614,-0.380 242.019,4.623 262.483 C 23.337 339.024,75.772 372.234,183.814 375.971 C 333.315 381.142,400.042 329.514,399.989 208.709 C 399.973 171.788,393.448 148.895,375.953 124.378 L 369.021 114.663 371.179 105.378 C 378.038 75.873,372.074 26.678,361.310 23.977 C 349.211 20.940,315.376 33.668,289.736 50.901 L 277.128 59.375 269.292 57.047 C 230.073 45.401,175.046 45.086,133.396 56.269 L 122.262 59.259 109.633 50.951 C 77.787 29.999,43.062 18.098,35.587 25.574 M199.219 174.024 C 215.547 173.970,243.672 173.640,261.719 173.291 C 297.764 172.594,302.347 173.496,314.439 183.671 C 360.164 222.146,353.423 307.996,302.675 333.490 C 257.998 355.934,129.596 354.142,90.730 330.533 C 37.291 298.070,45.173 192.813,102.426 174.343 C 108.963 172.234,114.738 172.025,139.844 172.986 C 156.172 173.611,182.891 174.078,199.219 174.024 M115.787 201.123 C 100.709 208.550,93.908 238.122,102.705 258.007 C 117.257 290.906,150.790 276.028,150.686 236.719 C 150.615 210.124,133.322 192.485,115.787 201.123 M265.858 201.088 C 262.979 202.507,258.887 206.290,256.767 209.495 C 233.925 244.011,263.236 295.935,289.886 268.166 C 314.409 242.614,294.482 186.985,265.858 201.088 M176.563 301.563 C 164.758 313.367,192.597 331.661,210.156 323.639 C 224.183 317.230,229.788 307.913,223.438 301.563 C 219.132 297.257,215.495 297.640,208.594 303.125 C 205.350 305.703,201.482 307.813,200.000 307.813 C 198.518 307.813,194.650 305.703,191.406 303.125 C 184.505 297.640,180.868 297.257,176.563 301.563"/>
            </svg>`;
        
        previewBtn.innerHTML = `${iconSvg}<strong>Preview</strong>`;
        previewBtn.href = github1sUrl;
        
        $navi.appendChild(previewBtn);
    }

    addPreviewButton();

    const observer = new MutationObserver(() => {
        if (!document.getElementById(PREVIEW_BTN_ID)) {
            addPreviewButton();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
// ==UserScript==
// @name         Overleaf pdf viewer dark mode
// @namespace    mailto:francisco.matu@gmail.com
// @version      0.1
// @description  Inverts pdf viewer colors in overleaf.
// @author       Francisco Maturana
// @match        https://www.overleaf.com/project/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/407874/Overleaf%20pdf%20viewer%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/407874/Overleaf%20pdf%20viewer%20dark%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Wait until page loaded.
    window.addEventListener('load', function() {
        // Add dark mode button.
        var toolbar = document.querySelector('div.toolbar.toolbar-pdf');
        var toolbar_right = toolbar.querySelector('div.toolbar-right');
        var dark_mode_template = document.createElement('template');
        dark_mode_template.innerHTML = '<a id="dark-mode-button"><i class="fa fa-fw fa-moon-o"></i></a>';
        var dark_mode_button = dark_mode_template.content.firstChild;
        toolbar.insertBefore(dark_mode_button, toolbar_right);

        // Wait for pdf to load.
        var observer = new MutationObserver(function (mutations, me) {
            var viewer = document.querySelector('div.pdfjs-viewer');
            if (viewer) {
                // Restore dark mode setting.
                dark_mode_button.addEventListener('click', toggleDarkMode, false);
                setDarkModeClass(localStorage.pdfViewerDarkMode);
                me.disconnect();
                return;
            }
        });
        observer.observe(document.querySelector('div.pdf.full-size'), {
            childList: true,
            subtree: true
        });

    }, false);

    // Add style for dark mode.
    GM_addStyle (`
    .pdfjs-viewer {
        transition-property: filter;
        transition-timing-function: ease;
        transition-duration: .8s;
    }
    .pdfjs-viewer.dark-mode {
        filter: invert(1) hue-rotate(180deg) brightness(.8) contrast(.7);
    }`);
    console.log('Dark mode setup complete.');
})();

// Executed when button is pressed.
function toggleDarkMode(ev) {
    // Toggle dark mode store.
    console.log('Toggling dark mode.');
    if (localStorage.pdfViewerDarkMode == 'true') {
        localStorage.pdfViewerDarkMode = 'false';
    } else {
        localStorage.pdfViewerDarkMode = 'true';
    }
    setDarkModeClass(localStorage.pdfViewerDarkMode);
}

function setDarkModeClass(value) {
    // Set dark mode class.
    console.log('Setting dark mode to ' + value);
    var viewer = document.querySelector('div.pdfjs-viewer');
    if (value == 'true') {
        viewer.classList.add('dark-mode');
    } else {
        viewer.classList.remove('dark-mode');
    }
}
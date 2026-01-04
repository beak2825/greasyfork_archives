// ==UserScript==
// @name         Kastden+ - Enhancement Script for selca.kastden.org
// @version      1.2
// @description  Adds dark mode, download keybind and various UI improvements to kastden. Press 'S' while hovering over a thumbnail or in gallery mode to download
// @author       kpganon
// @license      MIT
// @namespace    https://github.com/kpg-anon/scripts
// @match        https://selca.kastden.org/*
// @grant        GM_addStyle
// @grant        GM_addElement
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483277/Kastden%2B%20-%20Enhancement%20Script%20for%20selcakastdenorg.user.js
// @updateURL https://update.greasyfork.org/scripts/483277/Kastden%2B%20-%20Enhancement%20Script%20for%20selcakastdenorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var colorCodes = {
        'background-color':     '#282A36',
        'text-color':           'lightgrey',
        'link-color':           '#FF79C6',
        'link-hover':           '#cc609e',
        'group-link':           '#ffaedc',
        'member-list':          'grey',
        'button-background':    '#44475A',
        'button-hover':         '#6272A4',
        'button-text':          'silver',
        'input-text':           'white',
        'form-background':      '#3d3f4a',
        'username-color':       'orange',
        'backtotop-button':     '#363848',
        'text-highlight':       'rgba(255, 161, 215, 0.45)',
        'thumbnail-border':     'hotpink'
    };

    function createCSSVariables(colorCodes) {
        var cssVarString = ':root {';
        for (var key in colorCodes) {
            if (colorCodes.hasOwnProperty(key)) {
                cssVarString += `--${key}: ${colorCodes[key]};`;
            }
        }
        cssVarString += '}';
        return cssVarString;
    }

    GM_addStyle(createCSSVariables(colorCodes));

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        body {
            background-color: var(--background-color) !important;
        }
    `;

    function createBackToTopButton() {
        var button = document.createElement('button');
        button.innerHTML = '🡅';
        button.id = 'back-to-top-btn';
        button.onclick = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        document.body.appendChild(button);
    }

    function checkURL() {
        var mybutton = document.getElementById("back-to-top-btn");
        if (!mybutton) return;

        const currentURL = window.location.href;
        if (currentURL.includes('/media/')) {
            mybutton.style.display = 'none';
        } else {
            mybutton.style.display = 'block';
        }
    }

    function downloadImage(url) {
        const a = document.createElement('a');
        a.href = url;
        a.download = url.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    let hoveredElement = null;
      document.addEventListener('mouseover', function(e) {
        const closestAnchor = e.target.closest('.image a');
        if (closestAnchor) {
            hoveredElement = closestAnchor;
        } else {
            hoveredElement = null;
        }
    });

    function isGalleryActive() {
        const currentURL = window.location.href;
        const isActive = currentURL.includes('/media/');
        return isActive;
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 's' || e.key === 'S') {
            e.preventDefault();
            let imageUrl = '';

            if (isGalleryActive()) {
                const galleryImage = document.querySelector('#cover_media_frame img');
                if (galleryImage && galleryImage.src) {
                    imageUrl = galleryImage.src;
                }
            } else if (hoveredElement && hoveredElement.href) {
                imageUrl = hoveredElement.href;
            }

            if (imageUrl) {
                downloadImage(imageUrl);
            } else {
            }
        }
    });

    var styleRules = `
        * {
            color: var(--text-color);
        }
        html {
            scroll-behavior: smooth;
        }
        body {
            background-color: var(--background-color)
        }
        a {
            color: var(--link-color);
        }
        a:hover {
            color: var(--link-hover)
        }
        a:visited {
            color: var(--link-hover);
        }
        a.main_group_link {
            color: var(--group-link);
        }
        #header {
            border-bottom: none;
        }
        .post_info.media_info {
            background-color: var(--background-color);
        }
        #message_div {
            background-color: var(--background-color);
            border: none;
        }
        .message_div {
            background: none;
        }
        .header, .post_info, .entry, .image {
            background-color: var(--background-color)
            border: 1px solid #4B0082;
        }
        .post_info.media_info {
            border-radius: 10px;
            overflow: hidden;
        }
        .prev_button img, .next_button img, .close_button img {
            filter: invert(100%);
        }
        .header_left img {
            filter: invert(100%);
        }
        .close_button img:hover, .prev_button img:hover, .next_button img:hover {
            filter: invert(100%) brightness(85%);
        }
        .close_button img:active, .prev_button img:active, .next_button img:active {
            transform: scale(0.95);
        }
        .button, .submit {
            background-color: var(--background-color)
            color: var(--button-text);
            border: none;
        }
        input[type='text'], input[type='datetime-local'], input[type='submit'] {
            background-color: var(--button-background);
            color: var(--input-text);
            border: 1px solid var(--button-hover);
        }
        input[type='submit']:hover {
            background-color: var(--button-hover);
            color: var(--input-text);
        }
        .button:hover, .submit:hover {
            background-color: var(--button-hover);
        }
        input, select, textarea, button {
            background-color: var(--button-background);
            color: var(--input-text);
            border: 1px solid var(--button-hover);
        }
        input:focus, select:focus, textarea:focus, button:focus {
            border: 1px solid var(--link-color);
        }
        input[type='submit']:hover, button:hover {
            background-color: var(--form-background);
            color: var(--input-text);
        }
        #fixed_submit_div {
            bottom: 15px;
            margin: 0.4em;
            padding: 0;
            border: 2px solid var(--button-background);
        }
        select {
            background-color: var(--button-background);
            color: var(--input-text);
            border: 1px solid var(--button-hover);
        }
        #fixed_form_submit {
            background-color: var(--background-color);
            color: var(--button-text);
            padding: 5px 10px;
            cursor: pointer;
        }
        #preferences_form_page_size {
            background-color: var(--background-color);
            color: var(--button-text);
            border: 1px solid var(--button-hover);
            cursor: pointer;
        }
        #fixed_form_submit:hover {
            background-color: var(--form-background);
            color: var(--input-text);
        }
        a.table_header {
            color: var(--text-color);
            text-decoration: none;
        }
        .member a {
            color: var(--member-list);
        }
        .member.unfollowed, .member.unfollowed a {
            color: var(--member-list);
        }
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        ::-webkit-scrollbar-track {
            background: var(--background-color);
            border-radius: 10px;
        }
        ::-webkit-scrollbar-track-piece {
            background: transparent;
        }
        ::-webkit-scrollbar-corner {
            background: transparent;
        }
        ::-webkit-scrollbar-button {
            display: none;
        }
        .glowing-text {
            color: var(--username-color);
            text-shadow: 0 0 10px var(--username-color);
        }
        .media_frame {
            height: auto !important;
        }
        #cover_media_frame {
            overflow: hidden;
            max-height: none;
            max-width: 100%;
            position: relative;
        }
        #full_media {
            transition: transform 0.3s ease;
            max-height: 100%;
            max-height: 667px;
            max-width: 100%;
            border-radius: 21px;
        }
        #full_media:hover {
            transform: scale(1.05);
        }
        .media_frame img, .media_frame video {
            padding-top: none;
            top: 10px;
            max-width: 100%;
            height: auto;
        }
        .media_frame_wrapper {
            padding-top: 12px;
        }
        .entry {
            position: relative;
            clip-path: inset(0);
            margin: 2px;
        }
        .entry .thumb.error_handled.loaded.done {
            transition: transform 0.3s ease, filter 0.3s ease;
            transform-origin: center;
        }
        .entry:hover::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            box-shadow: inset 0 0 0 1px var(--thumbnail-border);
            pointer-events: none;
        }
        .entry:hover .thumb.error_handled.loaded.done {
            filter: brightness(85%);
            transform: scale(1.05);
            transition: transform 0.3s ease, filter 0.3s ease;
        }
        #back-to-top-btn {
            position: fixed;
            bottom: 40px;
            right: 3px;
            z-index: 99;
            border: none;
            outline: none;
            background-color: var(--backtotop-button);
            color: var(--input-text);
            cursor: pointer;
            padding: 15px;
            border-radius: 25%;
            align-items: center;
            justify-content: center;
            width: 80px;
            transition: opacity 0.3s ease, background-color 0.3s ease;
            font-size: 36px;
            opacity: 0;
            pointer-events: none;
        }

        #back-to-top-btn:hover {
            background-color: var(--button-background);
            opacity: 1;
        }
        #back-to-top-btn:active {
            transform: scale(0.95);
        }
        ::selection {
            background: var(--text-highlight);
        }
    `;
  GM_addStyle('body { display: block !important; }');

    var observer = new MutationObserver(function(mutations, observer) {
        if (document.body) {
            GM_addStyle(styleRules);
            createBackToTopButton();
            checkURL();

            window.onscroll = function() {
                checkURL();
                var mybutton = document.getElementById("back-to-top-btn");
                if (document.body.scrollTop > document.body.scrollHeight * 0.1 ||
                    document.documentElement.scrollTop > document.documentElement.scrollHeight * 0.1) {
                    mybutton.style.opacity = "1";
                    mybutton.style.pointerEvents = "auto";
                } else {
                    mybutton.style.opacity = "0";
                    mybutton.style.pointerEvents = "none";
                }
            };

            setInterval(checkURL, 50);

            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    function usernameGlow(parentElement) {
        if (!parentElement) return;

        for (const node of parentElement.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                const span = document.createElement('span');
                span.className = 'glowing-text';
                span.textContent = '★' + node.textContent.trim();

                const space = document.createTextNode(' ');

                parentElement.insertBefore(span, node);
                parentElement.insertBefore(space, node.nextSibling);
                parentElement.removeChild(node);
                break;
            }
        }
    }

    const headerRightLoggedIn = document.querySelector('.header_right.logged_in');
    if (headerRightLoggedIn) {
        const headerChild = headerRightLoggedIn.querySelector('.header_child');
        usernameGlow(headerChild);
    }

})();
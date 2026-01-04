// ==UserScript==
// @name         SubsPlease Magnet Link Copier
// @namespace    https://greasyfork.org/en/users/1445285-retr0-master
// @version      1.1
// @description  Adds a dropdown button to copy selected quality magnet links from SubsPlease
// @author       retr0_master
// @license      MIT
// @match        https://subsplease.org/shows/*
// @icon         https://www.svgrepo.com/show/387252/copy-link.svg
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/529717/SubsPlease%20Magnet%20Link%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/529717/SubsPlease%20Magnet%20Link%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const navMenu = document.querySelector('.site-header-menu ul.header-menu');

    const dropdownHTML = `
        <li class="menu-item menu-item-type-custom magnet-dropdown" style="position:relative;">
            <a href="#">Copy Magnets ▾</a>
            <ul class="sub-menu" style="display:none;position:absolute;">
                <li><a href="#" data-quality="1080p">1080p Links</a></li>
                <li><a href="#" data-quality="720p">720p Links</a></li>
                <li><a href="#" data-quality="480p">480p Links</a></li>
            </ul>
        </li>`;

    if(navMenu) {
        navMenu.insertAdjacentHTML('beforeend', dropdownHTML);
    }

    const dropdownBtn = document.querySelector('.magnet-dropdown > a');
    const submenu = document.querySelector('.magnet-dropdown .sub-menu');

    // Function to show toast notification (moved to bottom-right corner)
    function showToast(message) {
        let toast = document.createElement('div');
        toast.innerText = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '1';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // Toggle dropdown visibility
    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
    });

    // Hide submenu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.magnet-dropdown')) submenu.style.display = 'none';
    });

    // Functionality for copying magnet links
    function copyMagnetLinks(quality) {
        const labels = document.querySelectorAll('label.links');
        const magnetLinks = [];

        labels.forEach(label => {
            if (label.textContent.trim() === quality) {
                const nextElem = label.nextElementSibling;
                if (nextElem && nextElem.tagName === 'A' && nextElem.href.startsWith('magnet:')) {
                    magnetLinks.push(nextElem.href);
                }
            }
        });

        GM_setClipboard(magnetLinks.join('\n'));
        showToast(`Copied ${magnetLinks.length} ${quality} magnet links.`);
    }

    submenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            submenu.style.display = 'none';
            copyMagnetLinks(e.target.getAttribute('data-quality'));
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.altKey) {
            if (event.key === '1') {
                copyMagnetLinks('1080p');
            } else if (event.key === '2') {
                copyMagnetLinks('720p');
            } else if (event.key === '3') {
                copyMagnetLinks('480p');
            }
        }
    });
})();

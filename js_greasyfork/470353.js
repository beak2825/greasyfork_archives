// ==UserScript==
// @name         Kbin Notifications Panel
// @namespace    https://blobcat.codeberg.page
// @version      0.2.8
// @description  Adds a notification panel to the navigation bar
// @author       blobcat
// @license      MIT
// @match        https://kbin.social/*
// @match        https://*.kbin.pub/*
// @match        https://karab.in/*
// @match        https://fedia.io/*
// @match        https://readit.buzz/*
// @match        https://forum.fail/*
// @match        https://kbin.cafe/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCA4LjQ2NyA4LjQ2NyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNjMzU4Zjg7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM3ODM1ZmY7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iYiI+PHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjojYjU1MGZhO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjojZjJhMGFmO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgeGxpbms6aHJlZj0iI2EiIGlkPSJjIiB4MT0iMjMzLjIwOCIgeDI9IjIzNS4zNzEiIHkxPSIxNTUuNTcyIiB5Mj0iMTU5LjY2MiIgZ3JhZGllbnRUcmFuc2Zvcm09InRyYW5zbGF0ZSgtMTkuMjE2IDQyLjc3MykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIi8+PGxpbmVhckdyYWRpZW50IHhsaW5rOmhyZWY9IiNiIiBpZD0iZCIgeDE9IjIzOC4zMjEiIHgyPSIyMzYuMzU1IiB5MT0iMTU0LjA3NyIgeTI9IjE1OS40NjUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwLjk5IDQyLjc3MykiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIi8+PC9kZWZzPjxwYXRoIGQ9Im0yMTQuODQ4IDE5OC4zNDItLjY5NS4wMDZjLS4yOTMgMC0uMzkuMTg0LS4zMTkuNDQ5bC42NCAyLjg0NWMuMTQyLjUyNi4yMzYuNjIuMzMyLjYyaC4xODZjLjM2NiAwIC40OTYtLjIyLjYzOS0uNjJsMS4wMTItMi44NDVoLTEuMzMzYy0uMDk1LS4yMTMtLjEyOC0uNDU0LS40NjItLjQ1NHoiIHN0eWxlPSJmaWxsOnVybCgjYyk7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOi4wOTY0ODg5IiB0cmFuc2Zvcm09Im1hdHJpeCgxLjYyMjE0IDAgMCAxLjU2MzMzIC0zNDYuODM0MTMwNiAtMzA3LjczNjIyNzgyKSIvPjxwYXRoIGQ9Ik0yMTcuMDggMTk2Ljg0NmgxLjYzMWMuMTMxIDAgLjQwMy4wNzQuMjk2LjM4N2wtMS4zNTYgNC41NDdjLS4xNC4zOTMtLjI2OC40ODItLjY4LjQ4MmgtMi4xNjVjLjExMyAwIC4yMzItLjIyLjM3NS0uNjJsMS4yODktNC4zNmMuMDk0LS4yNS4yMi0uNDM2LjYxLS40MzZ6IiBzdHlsZT0iZmlsbDp1cmwoI2QpO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDouMDk2NDg4OSIgdHJhbnNmb3JtPSJtYXRyaXgoMS42MjIxNCAwIDAgMS41NjMzMyAtMzQ2LjgzNDEzMDYgLTMwNy43MzYyMjc4MikiLz48L3N2Zz4=
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470353/Kbin%20Notifications%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/470353/Kbin%20Notifications%20Panel.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`@supports not selector(:has(*)){#main::before{content:"Your browser doesn't support ':has()'. If you are Firefox, you need to follow these steps: 1) Open a new tab and open the 'about:config' page. 2) Search 'layout.css.has-selector.enabled' and toggle it to true. Kbin Notifications Panel won't work without it!";font-size:1.4rem;font-weight:400;color:var(--kbin-section-title-link-color);z-index:100000;display:flex;justify-content:center;align-items:center;padding:1rem;margin-bottom:.5rem;background-color:var(--kbin-section-bg);border:var(--kbin-section-border)}}#header .notification-button .badge{font-size:.8em;padding:.1em .4em}#header menu .notification-button a:not(.fa-solid.fa-bell){border:0!important;padding:0;display:inline;position:absolute;top:.5em;margin-left:1.6em}#header menu li a:has(~.notification-counter:hover){border-bottom:var(--kbin-header-hover-border)}`);

    const parentElement = document.querySelector('.header .kbin-container');

    if (parentElement) {
        const listItem = document.createElement('li');
        listItem.classList.add('notification-button');
        listItem.style.cursor = 'pointer';

        const anchorElement = document.createElement('a');
        anchorElement.textContent = ' ';
        anchorElement.classList.add('fa-solid', 'fa-bell');
        anchorElement.setAttribute('aria-label', 'Notifications');
        anchorElement.setAttribute('title', 'Notifications');

        listItem.appendChild(anchorElement);

        const siblingElement = document.querySelector('.dropdown:has(.login)');

        if (siblingElement) {
            siblingElement.parentElement.insertBefore(listItem, siblingElement);
        }

        const counterElement = document.querySelector('.counter > [href="/settings/notifications"]');

        if (counterElement) {
            counterElement.removeAttribute('href');
            counterElement.classList.add('notification-counter');
            listItem.appendChild(counterElement);
        }

        function toggleIframe() {
            const existingIframe = listItem.querySelector('.notifications-iframe');

            if (existingIframe) {
                existingIframe.remove();
            } else {
                const iframe = document.createElement('iframe');
                iframe.src = 'https://' + window.location.hostname + '/settings/notifications';
                iframe.className = 'notifications-iframe dropdown__menu';
                iframe.style.cssText = `position:absolute;z-index:99;top:100%;right:0;left:auto;transform:rotateX(0) translateX(-50%);resize:vertical;min-height:360px;user-select:none;opacity:1;visibility:visible;`;

                listItem.appendChild(iframe);

                iframe.addEventListener('load', () => {
                    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                    const links = iframeDocument.getElementsByTagName('a');

                    for (let i = 0; i < links.length; i++) {
                        links[i].addEventListener('click', (event) => {
                            event.preventDefault();
                            window.location.href = event.target.href;
                        });
                    }

                    const styleElement = iframeDocument.createElement('style');
                    styleElement.textContent = `.pills,h1{display:inline-block}#middle,body{background:var(--kbin-section-bg)}#footer,#header,#scroll-top,#sidebar,#subscription-panel,#topbar{display:none!important}#middle,.kbin-container{margin-top:0!important}h1{font-size:1rem;padding-left:.5rem}.section--small{padding:.5rem}.btn__secondary,form{height:25px}.btn{padding:0 6px}.page-notifications #main .notification{grid-template-areas:"a a a b" "a a a b";display:grid;width:100%;font-size:.8rem;margin-bottom:0;border-bottom:0;border-left:0;border-right:0}.page-notifications #main .notification:hover{background:var(--kbin-bg)}.page-notifications #main .notification>div{grid-area:a}.page-notifications #main .notification>span{grid-area:b}body::-webkit-scrollbar{width:8px}body::-webkit-scrollbar-track{background:var(--kbin-section-bg)}body::-webkit-scrollbar-thumb{background-color:gray;border-radius:5px;border:2px solid transparent}.pills{padding:0;float:right;margin:.67em}html{margin:0}body{min-height:100vmax}.section--muted{border:0}`;
                    iframeDocument.head.appendChild(styleElement);
                });
            }
        }


        listItem.addEventListener('click', toggleIframe);

        document.addEventListener('click', (event) => {
            const target = event.target;
            const isListItem = target === listItem || listItem.contains(target);
            const isIframe = target.classList.contains('notifications-iframe');

            if (!isListItem && !isIframe) {
                const existingIframe = listItem.querySelector('.notifications-iframe');
                if (existingIframe) {
                    existingIframe.remove();
                }
            }
        });
    }
})();
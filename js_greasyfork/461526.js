// ==UserScript==
// @name         YASP
// @namespace    TMBMode.YASP
// @version      1.7.2
// @description  Yet Another StudyPlace
// @author       TMBMode
// @match        https://www.pottersschool.org/student/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461691/YASP.user.js
// @updateURL https://update.greasyfork.org/scripts/461691/YASP.meta.js
// ==/UserScript==

const _version = '1.7.2';
const _info = `
YASP v${_version}
- ☆ All Icons Draggable ☆
- ☆ Uncover Hidden Utils ☆
- ☆ Near-Due Assignment Warning ☆
- Forums Button Direct Access
- Spin Title (Click)
- Edit Title (Right-Click)
~ Saves User Edits ~`;

(function() {
    'use strict';
    /*
     * Aliases
     */
    var $ = document.querySelector.bind(document),
        $id = document.getElementById.bind(document),
        $new = document.createElement.bind(document),
        $all = document.querySelectorAll.bind(document);
    /*
     * Main Function
     * Handles Everything
     */
    function main() {
        /*
         * YASP Display
         */
        let cornerName = $id('DISPLAYNAME');
        cornerName.textContent = `Click 4 Info`;
        cornerName.style.color = 'red';
        setTimeout(() => {
            cornerName.textContent = `YASP v${_version}`;
            cornerName.style.color = '';
        }, 4000);
        cornerName.onclick = () => {
            alert(_info);
        }
        let displayName = $id('myDisplayname');
        let nameString = getCookie('displayName');
        displayName.textContent = nameString ? nameString : 'Yet Another StudyPlace';
        let utilsButton = $id('startMenu');
        utilsButton.textContent = 'All Utilities';
        /*
         * Close Message Board Startup Popup
         */
        waitFor('#module_view_announcement-1055', () => {
            $id('tool-1098-toolEl').click();
        }, 100);
        /*
         * Display Name Rotate Effect
         */
        let nameRotate = 0,
            nameSpinDeg = 360;
        displayName.style.userSelect = 'none';
        displayName.style.transition = 'rotate 1.2s ease-in-out';
        displayName.style.rotate = '0deg';
        displayName.onclick = () => {
            displayName.style.rotate = `${ nameRotate += nameSpinDeg }deg`;
        }
        /*
         * Forums Direct Shortcut
         */
        let forumsButton = $id('sc_vbulletin'),
            forumsClone = forumsButton.cloneNode(true);
        forumsButton.parentElement.replaceChild(forumsClone, forumsButton);
        forumsButton.remove();
        forumsClone.onclick = () => {
            window.open('https://forum.pottersschool.org');
        }
        /*
         * Draggable Shortcuts
         */
        let mouseX, mouseY, elementX, elementY,
            shortcutElements = $all('.ux-desktop-shortcut');
        shortcutElements.forEach((shortcut, index) => {
            let draggable = shortcut.cloneNode(true);
            draggable.removeAttribute('id');
            draggable.style.position = 'absolute';
            draggable.style.top = '25vh';
            draggable.style.left = `calc(${index * (60 / (shortcutElements.length - 1)) + 20}vw - ${shortcut.offsetWidth / 2}px)`;
            draggable.style.margin = '0';
            draggable.style.userSelect = 'none';
            shortcut.parentElement.appendChild(draggable);
            shortcut.style.display = 'none';
            setTimeout(() => {
                let posX = getCookie(`posX${index}`),
                    posY = getCookie(`posY${index}`);
                if (posX && posY) {
                    draggable.style.transition = 'top 1s ease-out 0s, left 1s ease-out 0s';
                    draggable.style.left = posX + 'px';
                    draggable.style.top = posY + 'px';
                    setTimeout(() => {
                        draggable.style.transition = 'none';
                    }, 1200);
                }
            }, 500);
            draggable.addEventListener('mousedown', e => {
                if (e.button !== 0) return;
                mouseX = e.clientX;
                mouseY = e.clientY;
                elementX = draggable.offsetLeft;
                elementY = draggable.offsetTop;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
            function onMouseMove(e) {
                if (e.button !== 0) return;
                const dx = e.clientX - mouseX,
                      dy = e.clientY - mouseY;
                draggable.style.left = `${elementX + dx}px`;
                draggable.style.top = `${elementY + dy}px`;
            }
            function onMouseUp(e) {
                if (e.button !== 0) return;
                if (Math.pow(e.clientX - mouseX, 2) + Math.pow(e.clientY - mouseY, 2) < 20) {
                    shortcut.click();
                } else {
                    setCookie(`posX${index}`, ''+(e.clientX - mouseX + elementX));
                    setCookie(`posY${index}`, ''+(e.clientY - mouseY + elementY));
                }
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        });
        /*
         * Edit Title
         */
        displayName.oncontextmenu = () => {
            displayName.style.rotate = `${nameRotate -= nameSpinDeg}deg`;
            displayName.contentEditable = displayName.contentEditable === 'true' ? 'false' : 'true';
            displayName.style.backgroundColor = displayName.contentEditable === 'true' ? '#faebcc' : '#fcf8e3';
            if (displayName.contentEditable === 'false') {
                setCookie('displayName', displayName.textContent);
            }
            return false;
        }
        /*
         * Display Hidden Features
         */
        waitForever('#menu-1012', () => {
            for (let el of [$id('menu-1012'), $id('menu-1012-body')]){
                el.style.width = '20vw';
                el.style.height = '90vh';
            }
            let utilsMenu = $id('menu-1012-innerCt');
            utilsMenu.style.height = '90vh';
            utilsMenu.style.width = '20vw';
            utilsMenu.querySelectorAll('.x-menu-item').forEach((el, i) => {
                el.style.display = 'block';
                el.style.top = i * 40 + 'px';
            });
            utilsMenu.style.overflowY = 'auto';
        });
        /*
         * Near-Due Warning
         */
        waitForever('#wndFamilyEnrolledCourses4', () => {
            let assignmentsTable = $id('wndFamilyEnrolledCourses4').querySelector('.x-grid-table');
            assignmentsTable.querySelectorAll('tr.x-grid-row > :nth-child(3)').forEach(cell => {
                let time = parseInt(cell.textContent);
                let row = cell.parentElement.childNodes;
                if (!Number.isNaN(time)) {
                    if (cell.textContent.includes('late')) {
                        time = -30;
                    } else if (cell.textContent.includes('day')) {
                        time *= 24;
                    } else if (cell.textContent.includes('minute')) {
                        time /= 60;
                    }
                    row.forEach(el => {
                        el.style.cssText = `background-color: hsl(0,100%,${((time/3)+70).toFixed(0)}% !important`;
                    });
                }
            });
        }, 5000);
    }
    /*
     * If Name is Loaded, Then We're on Main Page
     * Start Main Function Then
     */
    waitFor('#myDisplayname', () => {
        main();
    });
    /*
     * Util Functions
     */
    // Wait For Element Load, Once
    function waitFor(query, callback, interval=200) {
        let trigger = null,
            loop = setInterval(() => {
            trigger = $(query);
            if (trigger) {
                clearInterval(loop);
                callback();
            }
        }, interval);
    }
    // Trigger Whenever an Element Exists
    function waitForever(query, callback, interval=1500) {
        setInterval(() => {
            if ($(query)) callback();
        }, interval);
    }
    // Set Cookie
    function setCookie(name, value) {
        document.cookie = `YASPc${name}=${value}`;
    }
    // Get Cookie by Name
    function getCookie(name) {
        name = `YASPc${name}`;
        let cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length + 1, cookie.length);
            }
        } return null;
    }
})();
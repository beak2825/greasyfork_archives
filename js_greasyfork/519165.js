// ==UserScript==
// @name         BVB的BHB聊天室背景
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  BVB聊天室的背景
// @author       BHB
// @match        *://boyshelpboys.com/*
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/519165/BVB%E7%9A%84BHB%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/519165/BVB%E7%9A%84BHB%E8%81%8A%E5%A4%A9%E5%AE%A4%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const defaultBackgroundUrl = 'https://t1-img.233213.xyz/2024/12/04/67504b8c1cf15.png';
    function createBackgroundSection() {
        const section = document.createElement('section');
        section.id = 'backgroundSection';
        section.style.position = 'fixed';
        section.style.top = '0';
        section.style.left = '0';
        section.style.width = '100%';
        section.style.height = '100%';
        section.style.zIndex = '-1';
        section.style.backgroundSize = 'cover';
        section.style.backgroundPosition = 'center';
        section.style.opacity = '1';
        section.style.backgroundRepeat = 'no-repeat';
        document.body.appendChild(section);
    }
    function changeBackground(url) {
        const section = document.getElementById('backgroundSection');
        if (section) {
            section.style.backgroundImage = `url('${url}')`;
        } else {
            console.error('Background section not found');
        }
    }
    async function setChatBackgroundFromLocal() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (file) {
                const url = await getBase64Url(file);
                localStorage.setItem('customBackgroundUrl', url);
                localStorage.setItem('customBackgroundEnabled', 'true');
                applyBackground(url);
            }
        };
        input.click();
    }
    function setChatBackgroundFromUrl() {
        const url = prompt("请输入背景图片URL:", localStorage.getItem('customBackgroundUrl') || '');
        if (url) {
            localStorage.setItem('customBackgroundUrl', url);
            localStorage.setItem('customBackgroundEnabled', 'true');
            applyBackground(url);
        }
    }
    function restoreDefaultBackground() {
        localStorage.removeItem('customBackgroundUrl');
        localStorage.removeItem('customBackgroundEnabled');
        applyBackground(defaultBackgroundUrl);
    }
    async function getBase64Url(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    function applyBackground(url) {
        changeBackground(url);
    }
    function init() {
        createBackgroundSection();
        const url = localStorage.getItem('customBackgroundEnabled') !== 'false'
        ? localStorage.getItem('customBackgroundUrl') || defaultBackgroundUrl
        : defaultBackgroundUrl;
        applyBackground(url);
    }
    function createDropdownMenu() {
        const navbarCollapse = document.getElementById('navbar-collapse');
        if (!navbarCollapse) {
            console.error('Navbar collapse element not found');
            return;
        }
        const dropdownItem = document.createElement('li');
        dropdownItem.className = 'nav-item dropdown d-flex align-items-center';
        const dropdownButton = document.createElement('a');
        dropdownButton.className = 'nav-link dropdown-toggle';
        dropdownButton.href = '#';
        dropdownButton.id = 'backgroundDropdown';
        dropdownButton.role = 'button';
        dropdownButton.dataset.bsToggle = 'dropdown';
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownButton.textContent = '设置背景';
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.setAttribute('aria-labelledby', 'backgroundDropdown');
        const localOption = createDropdownMenuItem('从本地设置背景', setChatBackgroundFromLocal);
        const urlOption = createDropdownMenuItem('从URL设置背景', setChatBackgroundFromUrl);
        const defaultOption = createDropdownMenuItem('恢复默认背景', restoreDefaultBackground);
        dropdownMenu.appendChild(localOption);
        dropdownMenu.appendChild(urlOption);
        dropdownMenu.appendChild(defaultOption);
        dropdownItem.appendChild(dropdownButton);
        dropdownItem.appendChild(dropdownMenu);
        navbarCollapse.appendChild(dropdownItem);
    }
    function createDropdownMenuItem(text, onClick) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = 'dropdown-item';
        a.href = '#';
        a.textContent = text;
        a.onclick = (e) => {
            e.preventDefault();
            onClick();
        };
        li.appendChild(a);
        return li;
    }
    const originalCss = `
        :root {
            --card-background-opacity: 0.2;
            --bs-body-bg: #2b2c40a8;
            --sn-nav-link: #d3c21a;
            --sn-navbar-brand: #58fd00;
        }
    `;
    const dropdownCss = `

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            z-index: 1000;
            display: none;
            float: left;
            min-width: 10rem;
            padding: 0.5rem 0;
            margin: 0.125rem 0 0;
            font-size: 1rem;
            color: var(--sn-nav-link);
            text-align: left;
            list-style: none;
            background-color: #fff;
            background-clip: padding-box;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: 0.25rem;
        }
        .dropdown-menu.show {
            display: block;
        }
        .dropdown-item {
            display: block;
            width: 100%;
            padding: 0.25rem 1.5rem;
            clear: both;
            font-weight: 400;
            color: var(--sn-nav-link);
            text-align: inherit;
            white-space: nowrap;
            background-color: transparent;
            border: 0;
        }
        .dropdown-item:hover, .dropdown-item:focus {
            color: var(--sn-nav-link);
            text-decoration: none;
            background-color: #f8f9fa;
        }
        .d-flex.align-items-center {
            display: flex;
            align-items: center;
        }
        .nav-link.dropdown-toggle {
            color: var(--sn-nav-link);
        }
        .nav-link.dropdown-toggle:hover {
            color: var(--sn-nav-link);
        }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = originalCss;
    document.body.appendChild(style);
    GM_addStyle(dropdownCss);
    init();
    createDropdownMenu();
})();
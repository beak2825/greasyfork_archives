// ==UserScript==
// @name         Scamtify - Facebook Scam Warning
// @description  Warns users when visiting known scam Facebook profiles
// @namespace    https://www.facebook.com/dawolfgamestore
// @version      0.2
// @icon         https://raw.githubusercontent.com/ThisisZeth/fb-scammer/refs/heads/main/logo.png
// @author       หมาป่าขายเกม - Da Wolf Game Store
// @match        https://www.facebook.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @connect      pastebin.com
// @downloadURL https://update.greasyfork.org/scripts/523814/Scamtify%20-%20Facebook%20Scam%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/523814/Scamtify%20-%20Facebook%20Scam%20Warning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const fontImport = `
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
    `;
    GM_addStyle(fontImport);

    // Add global font styles
    GM_addStyle(`
        .scam-warning-popup *,
        .info-popup *,
        .scam-warning-backdrop *,
        .custom-tooltip,
        .tooltip::before {
            font-family: 'Roboto', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
    `);

    function showWelcomePopup() {
        const backdrop = document.createElement('div');
        backdrop.className = 'scam-warning-backdrop';
        document.body.appendChild(backdrop);

        const welcomePopup = document.createElement('div');
        welcomePopup.className = 'info-popup';

        const welcomeHTML = `
            <div>
                <div style="display: flex; align-items: center; margin-bottom: 16px; gap: 7px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#4a4a4a" stroke-width="1.5"/>
                        <path d="M7 10L9 12L13 8" stroke="#4a4a4a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #4a4a4a;">ยินดีต้อนรับสู่ Scamtify!</h2>
                </div>
                <div class="info-content">
                    <div class="info-section">
                        <p>ขอบคุณที่ติดตั้ง Scamtify! เราจะช่วยคุณระวังภัยจากมิจฉาชีพบน Facebook เอง!</p>
                    </div>
                    <div class="info-section">
                        <div class="info-section-title">ง่ายๆ แค่เข้าโปรไฟล์</div>
                        <p>การทำงานของ Scamtify นั้นง่ายมากๆ เพียงแค่คุณกดเข้าโปรไฟล์ใครคนใดคนนึงก็พอ ถ้าหากเราพบโปรไฟล์คนนั้นในฐานข้อมูล เราก็จะแจ้งเตือน Popup ให้คุณระวังทันที <a href="">ลองคลิกที่นี่เพื่อทดสอบได้เลย</a></p>
                    </div>
                    <div class="info-section">
                        <p>โดยใน Popup จะมีปุ่มค้นหาด้านล่างของหน้าต่าง ผู้ใช้งานสามารถกดปุ่มเพื่อค้นหาข้อมูลของผู้ใช้รายนั้นผ่าน Google ได้ทันที (โดยจะค้นหาโดยใช้ชื่อของผู้ใช้งาน ณ เวลาที่เราเก็บข้อมูลเป็นหลัก เพราะจะเป็นชื่อตอนที่ฉ้อโกงมา)</p>
                    </div>
                    <div class="info-section">
                        <p>ณ ตอนนี้ Scamtify จะรองรับข้อมูลคนโกงในส่วนของขายเกมเท่านั้นเนื่องจากฐานข้อมูลรายชื่อถูกอัพเดทด้วยตัวของหมาป่าเอง และเนื่องด้วยหมาป่าเป็นร้านที่ขายเกมดิจิทัลและไม่ได้มีรายชื่อเป็นสมาชิกกลุ่มต่างๆ ทำให้เราไม่สามารถตามหาคนโกงจากกลุ่มประเภทอื่นๆ ได้ แต่หากได้รับการรายงานพร้อมหลักฐานที่เพียงพอเราก็จะอัพเดทให้เช่นกันนะ</p>
                    </div>
                </div>
            </div>
        `;

        welcomePopup.innerHTML = welcomeHTML;

        const closeButton = document.createElement('button');
        closeButton.className = 'warning-button';
        closeButton.style.backgroundColor = '#4a4a4a';
        closeButton.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        `;

        closeButton.addEventListener('click', function() {
            hidePopup(welcomePopup, backdrop);
        });

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#666666';
        });

        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#4a4a4a';
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.appendChild(closeButton);

        welcomePopup.appendChild(buttonContainer);
        document.body.appendChild(welcomePopup);

        setTimeout(() => {
            backdrop.classList.add('visible');
            welcomePopup.classList.add('visible');
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
            scrollPosition = window.scrollY;
        }, 10);
    }

    function showInfoPopup() {
        const backdrop = document.createElement('div');
        backdrop.className = 'scam-warning-backdrop';
        document.body.appendChild(backdrop);

        const infoPopup = document.createElement('div');
        infoPopup.className = 'info-popup';

        const infoHTML = `
            <div>
                <div style="display: flex; align-items: center; margin-bottom: 16px; gap: 7px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#4a4a4a"/>
                </svg>
                    <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a1a;">เกี่ยวกับ Scamtify</h2>
                </div>
                <div class="info-content">
                    <div class="info-section">
                        <p>Scamtify เป็น Script ใช้งานร่วมกับ Tempermonkey ที่พัฒนาโดย <a href="https://facebook.com/dawolfgamestore">Da Wolf Game Store</a> ร่วมกับ AI เพื่อช่วยให้ผู้ใช้งานสามารถตรวจสอบได้ว่าโปรไฟล์ไหนที่เคยมีประวัติการฉ้อโกงมาก่อน และคอยย้ำเตือนให้ระวังถึงภัยของมิจฉาชีพที่พยายามหลอกล่อให้โอนเงินไปให้มิจฉาชีพเหล่านั้น</p>
                    </div>
                    <div class="info-section">
                        <div class="info-section-title">ประเภทการแจ้งเตือน</div>
                        <p>1. ต้องสงสัย: ผู้ใช้งานที่มีพฤติกรรมน่าสงสัยหรือยังไม่ได้รับการยืนยัน</p>
                        <p>2. อันตราย: ผู้ใช้งานที่มีประวัติการฉ้อโกงหรือพฤติกรรมที่เป็นอันตราย</p>
                    </div>
                    <div class="info-section">
                        <div class="info-section-title">การใช้งาน</div>
                        <p>เมื่อผู้ใช้งานเข้าชมโปรไฟล์ที่อยู่ในฐานข้อมูล ระบบจะแจ้งเตือนอัตโนมัติ</p>
                        <p>โดยหากผู้ใช้งานต้องการค้นหาข้อมูลเพิ่มเติมเกี่ยวกับโปรไฟล์นั้นๆ ผู้ใช้สามารถกดปุ่มรูปแว่นขยายด้านล่างซ้ายมือเพื่อค้นหาข้อมูลเพิ่มเติมผ่าน Google ได้ทันที (ชื่อที่แสดงบน Scamtify อาจจะไม่ตรงกับโปรไฟล์ที่ดูอยู่ ณ ขณะนั้น เนื่องจากในฐานข้อมูลยังเป็นชื่อเดิมที่เริ่มเก็บข้อมูล และมักจะมีประวัติตอนใช้ชื่อบัญชีนั้น)</p>
                    </div>
                    <div class="info-section">
                        <p>Scamtify ไม่ได้การันตีว่าจะป้องกันการโกงได้ 100% แต่เพียงถูกออกแบบมาเพื่อหวังลดความเสี่ยงตรงนี้ให้ได้มากกว่าที่ควร และด้วย Scamtify ใช้ฐานข้อมูลที่อัพเดทเอง จึงอาจจะทำให้ไม่ได้ครอบคลุมคนโกงทุกคน แต่หากเราได้รับแจ้งพร้อมหลักฐานที่ครบถ้วนแล้ว เราจะอัพเดทให้อย่างแน่นอน</p>
                    </div>
                    <div class="info-section">
                        <p>มีคำถาม พบอะไรที่ผิดพลาด หรือต้องการรายงานคนโกงหรือเปล่า?</p>
                        <p>ทักเราได้เลยที่: <a href="https://www.facebook.com/dawolfgamestore" target="_blank">Facebook</a> | <a href="https://dsc.gg/dawolf" target="_blank">Discord</a></p>
                    </div>
                    <div class="info-section">
                        <p class="grey">Scamtify - Beta 0.1</p>
                    </div>
                </div>
            </div>
        `;

        infoPopup.innerHTML = infoHTML;

        const closeButton = document.createElement('button');
        closeButton.className = 'warning-button';
        closeButton.style.backgroundColor = '#4a4a4a';
        closeButton.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        `;

        closeButton.addEventListener('click', function() {
            hidePopup(infoPopup, backdrop);
        });

        closeButton.addEventListener('mouseover', () => {
            closeButton.style.backgroundColor = '#666666';
        });

        closeButton.addEventListener('mouseout', () => {
            closeButton.style.backgroundColor = '#4a4a4a';
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'flex-end';
        buttonContainer.appendChild(closeButton);

        infoPopup.appendChild(buttonContainer);
        document.body.appendChild(infoPopup);

        setTimeout(() => {
            backdrop.classList.add('visible');
            infoPopup.classList.add('visible');
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
            scrollPosition = window.scrollY;
        }, 10);
    }

    function hidePopup(popup, backdrop) {
        popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
        popup.classList.remove('visible');
        backdrop.classList.remove('visible');
        setTimeout(() => {
            popup.remove();
            backdrop.remove();
            if (!document.querySelector('.scam-warning-popup.visible, .info-popup.visible')) {
                document.body.classList.remove('no-scroll');
                document.documentElement.classList.remove('no-scroll');
                window.scrollTo(0, scrollPosition);
            }
        }, 300);
    }

    const style = document.createElement('style');
    style.textContent = `
        .scam-warning-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
            z-index: 999998;
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
            will-change: opacity;
            pointer-events: none;
        }

        .scam-warning-backdrop.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .scam-warning-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background: #FFFFFF;
            color: #1a1a1a;
            padding: 24px;
            border-radius: 12px;
            z-index: 999999;
            max-width: 360px;
            width: 90%;
            text-align: left;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            font-family: 'Roboto', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif;
            border: 1px solid rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center center;
            will-change: transform, opacity;
            pointer-events: none;
        }

        .scam-warning-popup.visible {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            pointer-events: auto;
        }

        .warning-button {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
            will-change: transform, background-color;
        }

        .warning-button svg {
            width: 24px;
            height: 24px;
            fill: white;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .warning-button:hover {
            transform: scale(1.1);
        }

        .no-scroll {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }

        .circle-buttons {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            justify-content: space-between;
            align-items: center;
        }

        .circle-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: #f1f1f1;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateZ(0);
            will-change: transform, background-color;
            font-family: 'Roboto', 'Noto Sans Thai', sans-serif;
        }

        .circle-button:hover {
            transform: scale(1.05);
        }

        .circle-button svg {
            width: 20px;
            height: 20px;
            transition: fill 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            fill: #4a4a4a;
        }

        .circle-button:hover svg {
            fill: white;
        }

        .tooltip {
            position: relative;
            font-family: 'Roboto', 'Noto Sans Thai', sans-serif;
        }

        .tooltip::before {
            content: attr(data-tooltip);
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-8px);
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Roboto', 'Noto Sans Thai', sans-serif;
        }

        .tooltip:hover::before {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(-4px);
        }

        .custom-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-8px);
            padding: 4px 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: 'Roboto', 'Noto Sans Thai', sans-serif;
        }

        .custom-tooltip.visible {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(-4px);
        }

        .custom-tooltip .highlight {
            color: #ff7f00;
        }

        .info-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background: #FFFFFF;
            color: #1a1a1a;
            padding: 24px;
            border-radius: 12px;
            z-index: 1000000;
            max-width: 480px;
            width: 90%;
            text-align: left;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
            font-family: 'Roboto', 'Noto Sans Thai', sans-serif;
            border: 1px solid rgba(0, 0, 0, 0.1);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center center;
            will-change: transform, opacity;
            pointer-events: none;
        }

        .info-popup.visible {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
            pointer-events: auto;
        }

        .info-content {
            margin-bottom: 20px;
            font-size: 14px;
            line-height: 1.6;
            color: #4a4a4a;
            font-family: 'Roboto', 'Noto Sans Thai', sans-serif;
        }

        .info-section {
            margin-bottom: 16px;
        }

        .info-section p {
            margin: 0px;
        }

        .info-section p.grey{
            color: #adadad;
        }

        .info-section-title {
            font-weight: 600;
            margin-bottom: 8px;
            color: #1a1a1a;
        }
    `;
    document.head.appendChild(style);

    const hasVisited = GM_getValue('scamtifyFirstVisit');
    if (!hasVisited) {
        // Set the flag in Tampermonkey storage
        GM_setValue('scamtifyFirstVisit', 'true');
        // Show welcome popup after a short delay to ensure styles are loaded
        setTimeout(showWelcomePopup, 1000);
    }

    let scamUrls = [];
    let scrollPosition = 0;
    let lastCheckedUrl = '';
    const dismissedIdentifiers = new Set();
    let urlCheckTimeout = null;

    function parseScamData(data) {
        return data
            .split('\n')
            .map(line => line.trim())
            .filter(line => line !== '')
            .map(line => {
                const parts = line.split(',');
                if (parts.length < 4) return null; // ข้ามบรรทัดที่ฟอร์แมตไม่ถูกต้อง

                const category = parts[0];
                const fbId = parts[1];
                const customId = parts[2];
                let name = '';
                let accountName = null;

                // ตรวจสอบว่ามีข้อมูล 'ชื่อบัญชี' (ส่วนที่ 5) หรือไม่
                if (parts.length >= 5) {
                    accountName = parts[parts.length - 1].trim();
                    name = parts.slice(3, parts.length - 1).join(',').trim();
                } else { // ถ้าไม่มี ให้ใช้ฟอร์แมตเดิม
                    name = parts.slice(3).join(',').trim();
                }

                return {
                    category: parseInt(category, 10),
                    fbId: fbId && fbId.trim() ? fbId.trim().toLowerCase() : null,
                    customId: customId && customId.trim() ? customId.trim().toLowerCase() : null,
                    name: name,
                    accountName: accountName
                };
            })
            .filter(item => item !== null); // กรองข้อมูลที่ไม่สมบูรณ์ออก
    }

    function fetchScamUrls() {
        const encodedUrl = 'aHR0cHM6Ly9wYXN0ZWJpbi5jb20vcmF3L1hrV0RWdTFr';
        const timestamp = new Date().getTime();
        const url = `${atob(encodedUrl)}?_=${timestamp}`;

        console.log('Fetching scam URLs at:', new Date().toLocaleString());

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            onload: function(response) {
                if (response.status === 200) {
                    const newData = parseScamData(response.responseText);
                    const oldDataStr = JSON.stringify(scamUrls);
                    const newDataStr = JSON.stringify(newData);

                    if (oldDataStr !== newDataStr) {
                        console.log('Scam URLs list updated at:', new Date().toLocaleString());
                        scamUrls = newData;
                        // After updating data, trigger a check.
                        debouncedCheck();
                    }
                }
            },
            onerror: function(error) {
                console.error('Failed to fetch scam URLs:', error);
            }
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function extractIdentifier(url) {
        try {
            const urlObj = new URL(url);
            if (!urlObj.hostname.includes('facebook.com')) return null;

            const params = new URLSearchParams(urlObj.search);
            const profileId = params.get('id');
            if (profileId) {
                return profileId.toLowerCase();
            }

            const segments = urlObj.pathname.split('/').filter(segment => segment);

            for (let i = segments.length - 1; i >= 0; i--) {
                if (['photos', 'posts', 'about', 'friends', 'videos'].includes(segments[i])) {
                    continue;
                }

                if (segments[i] === 'user' && i + 1 < segments.length) {
                    return segments[i + 1].toLowerCase();
                }

                if (segments[i]) {
                    return segments[i].toLowerCase();
                }
            }
        } catch (e) {
            console.error('Error parsing URL:', e);
        }
        return null;
    }

    function isScamProfile(identifier) {
        if (!identifier) return null;
        identifier = identifier.toLowerCase();
        return scamUrls.find(item =>
            (item.fbId && item.fbId === identifier) ||
            (item.customId && item.customId === identifier)
        );
    }

    function removeProfileTag() {
        const existingTag = document.querySelector('.profile-status-tag');
        if (existingTag) {
            existingTag.remove();
        }
    }

    function waitForElement(selector, callback, timeout = 5000) {
        const intervalTime = 100;
        let timeElapsed = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else {
                timeElapsed += intervalTime;
                if (timeElapsed >= timeout) {
                    clearInterval(interval);
                    console.log(`Scamtify: Timed out waiting for element "${selector}"`);
                }
            }
        }, intervalTime);
    }

    function addProfileTag(category, identifier) {
        // Add a tag for suspected (1) or dangerous (2) profiles.
        if (category !== 1 && category !== 2) {
            return;
        }

        const profileNameSelector = 'div[role="main"] h1';

        waitForElement(profileNameSelector, (profileNameElement) => {
            let tagElement = profileNameElement.querySelector('.profile-status-tag');

            // If the tag doesn't exist, create it and set up its event listeners once.
            if (!tagElement) {
                tagElement = document.createElement('span');
                tagElement.className = 'profile-status-tag';

                tagElement.addEventListener('click', () => {
                    const id = tagElement.dataset.identifier;
                    if (id) {
                        dismissedIdentifiers.delete(id);
                    }
                    // Re-run the check to show the popup again
                    runCheck();
                });

                tagElement.addEventListener('mouseover', () => {
                    tagElement.style.transform = 'scale(1.05)';
                    tagElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                });

                tagElement.addEventListener('mouseout', () => {
                    tagElement.style.transform = 'scale(1)';
                    tagElement.style.boxShadow = 'none';
                });

                profileNameElement.appendChild(tagElement);
            }

            // Always update the tag's data and visual properties.
            tagElement.dataset.identifier = identifier;

            let tagText = '';
            let tagColor = '';

            if (category === 1) {
                tagText = 'ต้องสงสัย';
                tagColor = '#ff7f00'; // Orange, matching the popup
            } else { // category === 2
                tagText = 'มิจฉาชีพ';
                tagColor = '#FF4444'; // Red
            }

            if (tagElement.textContent !== tagText) {
                tagElement.textContent = tagText;
            }

            // Check if the profile name element contains the specific span for a nickname.
            const hasNicknameSpan = profileNameElement.querySelector('span.x1q74xe4.x1fcty0u');

            tagElement.style.display = 'inline-block';
            tagElement.style.marginLeft = hasNicknameSpan ? '18px' : '8px';
            tagElement.style.padding = '4px 10px';
            tagElement.style.fontSize = '1rem';
            tagElement.style.fontWeight = '700';
            tagElement.style.lineHeight = '1';
            tagElement.style.color = '#FFFFFF';
            tagElement.style.backgroundColor = tagColor;
            tagElement.style.borderRadius = '30px';
            tagElement.style.verticalAlign = 'middle';
            tagElement.style.textTransform = 'uppercase';
            tagElement.style.letterSpacing = '0.5px';
            tagElement.style.setProperty('font-family', "'Roboto', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, sans-serif", 'important');
            tagElement.style.cursor = 'pointer';
            tagElement.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        });
    }

    function removeExistingWarnings() {
        const existingWarnings = document.querySelectorAll('.scam-warning-popup, .scam-warning-backdrop, .info-popup');
        existingWarnings.forEach(warning => {
            if (warning.classList.contains('scam-warning-popup') || warning.classList.contains('info-popup')) {
                warning.style.transform = 'translate(-50%, -50%) scale(0.95)';
            }
            warning.classList.remove('visible');
            setTimeout(() => warning.remove(), 300);
        });
        // The no-scroll class is now handled by hidePopup to avoid conflicts
    }

    function showWarning(category, name, accountName, duplicateCount, identifier) {
        removeExistingWarnings();
        // Add the tag next to the profile name
        addProfileTag(category, identifier);

        const backdrop = document.createElement('div');
        backdrop.className = 'scam-warning-backdrop';
        document.body.appendChild(backdrop);

        const warningDiv = document.createElement('div');
        warningDiv.className = 'scam-warning-popup';

        const circleButtons = document.createElement('div');
        circleButtons.className = 'circle-buttons';

        const searchButton = document.createElement('button');
        searchButton.className = 'circle-button';
        searchButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7 14 5 12 5 9.5S7 5 9.5 5 14 7 14 9.5 12 14 9.5 14z"/>
            </svg>
        `;

        const customTooltip = document.createElement('div');
        customTooltip.className = 'custom-tooltip';
        searchButton.appendChild(customTooltip);

        if (accountName) {
            customTooltip.innerHTML = `ค้นหา "${accountName}" บน blacklistseller.com`;
            searchButton.addEventListener('click', () => {
                const searchQuery = `${accountName} site:blacklistseller.com`;
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
            });
        } else {
            customTooltip.innerHTML = `ค้นหา "${name}" บน Google`;
            searchButton.addEventListener('click', () => {
                window.open(`https://www.google.com/search?q=${encodeURIComponent(name)}`, '_blank');
            });
        }

        searchButton.addEventListener('mouseover', () => {
            customTooltip.classList.add('visible');
            searchButton.style.backgroundColor = hoverColor;
        });

        searchButton.addEventListener('mouseout', () => {
            customTooltip.classList.remove('visible');
            searchButton.style.backgroundColor = '#f1f1f1';
        });

        const infoButton = document.createElement('button');
        infoButton.className = 'circle-button tooltip';
        infoButton.setAttribute('data-tooltip', 'ดูข้อมูลเพิ่มเติม');
        infoButton.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
        `;

        infoButton.addEventListener('click', showInfoPopup);

        const button = document.createElement('button');
        button.className = 'warning-button';
        button.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        `;

        let hoverColor = '';
        let buttonColor = '';
        switch (category) {
            case 0:
                hoverColor = '#0acc00';
                buttonColor = '#0acc00';
                break;
            case 1:
                hoverColor = '#ff7f00';
                buttonColor = '#ff7f00';
                break;
            case 2:
                hoverColor = '#FF4444';
                buttonColor = '#FF4444';
        }

        button.style.backgroundColor = buttonColor;

        [infoButton].forEach(btn => {
            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = hoverColor;
            });
            btn.addEventListener('mouseout', () => {
                btn.style.backgroundColor = '#f1f1f1';
            });
        });

        button.addEventListener('click', function() {
            if (identifier) {
                dismissedIdentifiers.add(identifier);
            }
            hidePopup(warningDiv, backdrop);
        });

        let message = '';
        let title = '';
        let svgContent = '';
        let titleColor = '';
        switch (category) {
            case 0:
                title = 'ผู้ขายตัวจริง';
                message = 'ผู้ใช้งานนี้เป็นผู้ขายตัวจริงที่ปลอดภัย สามารถทำรายการได้ไร้กังวล';
                svgContent = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#0acc00" stroke-width="1.5"/>
                        <path d="M7 10L9 12L13 8" stroke="#0acc00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                titleColor = '#0acc00';
                break;
            case 1:
                title = 'โปรไฟล์ต้องสงสัย';
                message = 'ผู้ใช้งานนี้ถูกจัดอยู่ในหมวดต้องสงสัย เนื่องจากมีการเคลื่อนไหวในกลุ่มต่างๆ โดยใช้โปรไฟล์ที่ไม่น่าเชื่อถือ อาจจะเป็นโปรไฟล์หลุม หรืออาจจะเป็นหน้าม้าที่มีการแนะนำไปสู่<span style="color: #ff7f00; font-weight: bold;">คนโกงตัวจริง</span> กรุณาทำรายการด้วยความระมัดระวัง';
                svgContent = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#ff7f00" stroke-width="1.5"/>
                        <path d="M10 6.66667V10" stroke="#ff7f00" stroke-width="1.5" stroke-linecap="round"/>
                        <circle cx="10" cy="13.3333" r="0.833333" fill="#ff7f00"/>
                    </svg>
                `;
                titleColor = '#ff7f00';
                break;
            case 2:
                {
                    title = 'โปรไฟล์อันตราย';
                    let historyName = name;
                    // ถ้ามีชื่อบัญชี ให้แสดงต่อท้าย
                    if (accountName) {
                        historyName = `${name} <span style="color: #FF4444; font-weight: bold;">(${accountName})</span>`;
                    }
                    const baseMessage = `ผู้ใช้งานนี้ถูกพบว่ามีประวัติการฉ้อโกงมาก่อน กรุณาทำรายการด้วยความระมัดระวัง ถึงแม้ว่าอีกฝั่งจะเสนอให้ใช้บริการ<span style="color: #FF4444; font-weight: bold;">กลาง</span>ก็ตาม`;

                    let historyBlock = `ชื่อที่ใช้ตอนพบประวัติ: ${historyName}`;
                    if (duplicateCount > 0) {
                        historyBlock += `<br>ตรวจพบว่าใช้ Facebook อื่นๆ อีก: <span style="color: #FF4444;">${duplicateCount}</span> บัญชี`;
                    }

                    message = `${baseMessage}<br><br>${historyBlock}`;
                    svgContent = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3333C14.6024 18.3333 18.3334 14.6024 18.3334 10C18.3334 5.39763 14.6024 1.66667 10 1.66667C5.39765 1.66667 1.66669 5.39763 1.66669 10C1.66669 14.6024 5.39765 18.3333 10 18.3333Z" stroke="#FF4444" stroke-width="1.5"/>
                <path d="M10 6.66667V10" stroke="#FF4444" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="10" cy="13.3333" r="0.833333" fill="#FF4444"/>
            </svg>
        `;
                    titleColor = '#FF4444';
                }
                break;
        }

        warningDiv.innerHTML = `
            <div>
                <div style="display: flex; align-items: center; margin-bottom: 16px; gap: 7px;">
                    ${svgContent}
                    <h2 style="margin: 0; font-size: 16px; font-weight: 600; color: ${titleColor};">${title}</h2>
                </div>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #4a4a4a;">${message}</p>
            </div>
        `;

        const leftButtonsContainer = document.createElement('div');
        leftButtonsContainer.style.display = 'flex';
        leftButtonsContainer.style.gap = '8px';

        leftButtonsContainer.appendChild(searchButton);
        leftButtonsContainer.appendChild(infoButton);

        const rightButtonContainer = document.createElement('div');
        rightButtonContainer.style.display = 'flex';
        rightButtonContainer.style.marginLeft = 'auto';

        rightButtonContainer.appendChild(button);

        circleButtons.appendChild(leftButtonsContainer);
        circleButtons.appendChild(rightButtonContainer);

        warningDiv.appendChild(circleButtons);

        document.body.appendChild(warningDiv);

        setTimeout(() => {
            backdrop.classList.add('visible');
            warningDiv.classList.add('visible');
            document.body.classList.add('no-scroll');
            document.documentElement.classList.add('no-scroll');
            scrollPosition = window.scrollY;
        }, 10);
    }

    // This is the core logic that runs after debouncing.
    const runCheck = () => {
        // Prevent re-triggering if a warning is already visible. This breaks the feedback loop.
        const isWarningVisible = document.querySelector('.scam-warning-popup');
        if (isWarningVisible) return;

        const currentIdentifier = extractIdentifier(window.location.href);

        if (currentIdentifier) {
            const scamProfile = isScamProfile(currentIdentifier);

            // If the profile is a known scammer but has already been dismissed by the user in this session
            if (scamProfile && dismissedIdentifiers.has(currentIdentifier)) {
                // Ensure the "SCAMMER" tag is visible on the profile, but do not show the popup again.
                addProfileTag(scamProfile.category, currentIdentifier);
                return; // Stop further execution
            }

            if (scamProfile) {
                let duplicateCount = 0;
                // นับจำนวนบัญชีอื่นที่ใช้ชื่อบัญชีเดียวกัน (เฉพาะโปรไฟล์อันตราย)
                if (scamProfile.category === 2 && scamProfile.accountName) {
                    const sameAccountNameProfiles = scamUrls.filter(
                        item => item.accountName && item.accountName.toLowerCase() === scamProfile.accountName.toLowerCase()
                    );
                    // ลบ 1 เพื่อไม่นับโปรไฟล์ปัจจุบัน
                    duplicateCount = sameAccountNameProfiles.length - 1;
                }
                showWarning(scamProfile.category, scamProfile.name, scamProfile.accountName, duplicateCount, currentIdentifier);
            } else {
                // This is a non-scammer profile, remove any existing warnings or tags.
                removeExistingWarnings();
                removeProfileTag();
            }
        } else {
            // Not on a profile page, remove any existing warnings or tags.
            removeExistingWarnings();
            removeProfileTag();
        }
    };

    // Create a debounced version of the check function.
    // This prevents the check from running hundreds of times while Facebook is building the page.
    // It will wait until the DOM changes have "settled" for 250ms.
    const debouncedCheck = debounce(runCheck, 250);

    fetchScamUrls();
    setInterval(fetchScamUrls, 10000);

    // Observe the entire body for changes. Any time Facebook adds or removes elements,
    // the debounced check will be triggered.
    new MutationObserver(debouncedCheck).observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run an initial check shortly after the script loads to catch the first page view.
    setTimeout(debouncedCheck, 500);
})();

// ==UserScript==
// @name         Torn Recruitment Tool
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Adds a template button and mail icons to Torn, with a Custom Settings tab to manage the message template and mail button toggle
// @author       dingus
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536919/Torn%20Recruitment%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/536919/Torn%20Recruitment%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
    }

    function getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length));
            }
        }
        return null;
    }

    let templateContent = getCookie('messageTemplate') || `
<p>Hello,</p>
<p>This is a sample message template. Feel free to customize this content!</p>
<p>Best regards,<br>Your Name</p>
`.trim();
    let templateTitle = getCookie('messageTemplateTitle') || 'Default Template';
    let isMailButtonEnabled;
    const mailButtonCookie = getCookie('mailButtonEnabled');
    if (mailButtonCookie === null) {
        isMailButtonEnabled = true;
        setCookie('mailButtonEnabled', 'true');
    } else {
        isMailButtonEnabled = mailButtonCookie !== 'false';
    }
    let isMailButtonNewTab;
    const mailButtonNewTabCookie = getCookie('mailButtonNewTab');
    if (mailButtonNewTabCookie === null) {
        isMailButtonNewTab = true;
        setCookie('mailButtonNewTab', 'true');
    } else {
        isMailButtonNewTab = mailButtonNewTabCookie !== 'false';
    }

    function setTemplate() {
        const editor = document.querySelector('div.editor-content.mce-content-body[contenteditable="true"]');
        if (editor) {
            const savedTemplate = getCookie('messageTemplate') || templateContent;
            editor.innerHTML = savedTemplate;
        }
        const titleInput = document.evaluate(
            '/html/body/div[6]/div/div[2]/div[2]/div[5]/form/div[2]/input',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (titleInput) {
            const savedTitle = getCookie('messageTemplateTitle') || templateTitle;
            titleInput.value = savedTitle;
        }
    }

    function addTemplateButton() {
        const actionButtonsWrapper = document.querySelector('div.actionButtonsWrapper___DwpJR');
        if (actionButtonsWrapper) {
            if (!document.querySelector('#templateButton')) {
                const templateButton = document.createElement('button');
                templateButton.id = 'templateButton';
                templateButton.type = 'button';
                templateButton.className = 'torn-btn';
                templateButton.textContent = 'Template';
                templateButton.style.marginLeft = '5px';
                templateButton.addEventListener('click', setTemplate);
                actionButtonsWrapper.appendChild(templateButton);
            }
            return true;
        }
        return false;
    }

    function initializeMessageTemplate() {
        if (!window.location.hash.includes('#/p=compose')) {
            return;
        }
        if (!addTemplateButton()) {
            let attempts = 0;
            const maxAttempts = 20;
            const interval = setInterval(() => {
                attempts++;
                if (addTemplateButton() || attempts >= maxAttempts) {
                    clearInterval(interval);
                }
            }, 500);
        }
        const editor = document.querySelector('div.editor-content.mce-content-body[contenteditable="true"]');
        if (editor && editor.innerHTML !== '') {
            editor.innerHTML = '';
        }
    }

    function addMailIcons() {
        if (!isMailButtonEnabled) {
            return;
        }
        const userItems = document.querySelectorAll('ul.user-info-list-wrap > li');
        if (!userItems.length) {
            return;
        }
        userItems.forEach(item => {
            const nameLink = item.querySelector('a.user.name');
            if (!nameLink) {
                return;
            }
            const href = nameLink.getAttribute('href');
            const xidMatch = href.match(/XID=(\d+)/);
            if (!xidMatch) {
                return;
            }
            const xid = xidMatch[1];
            const iconTray = item.querySelector('div.level-icons-wrap span.user-icons span.icons-wrap ul#iconTray');
            if (!iconTray) {
                return;
            }
            if (iconTray.querySelector(`#mail-icon___${xid}`)) {
                return;
            }
            const mailItem = document.createElement('li');
            mailItem.id = `mail-icon___${xid}`;
            mailItem.className = 'iconShow';
            mailItem.setAttribute('title', '<b>Mail</b>');
            mailItem.setAttribute('style', '');
            const mailLink = document.createElement('a');
            mailLink.href = `/messages.php#/p=compose&XID=${xid}`;
            mailLink.setAttribute('aria-label', 'Private message');
            mailLink.className = 'mail-icon';
            if (isMailButtonNewTab) {
                mailLink.setAttribute('target', '_blank');
            }
            mailItem.appendChild(mailLink);
            iconTray.appendChild(mailItem);
        });
    }

    function removeMailIcons() {
        const mailIcons = document.querySelectorAll('li[id^="mail-icon___"]');
        mailIcons.forEach(icon => {
            icon.remove();
        });
    }

    let mailObserver = null;

    function initializeMailButtons() {
        if (!window.location.pathname.includes('/page.php') || !window.location.search.includes('sid=UserList')) {
            return;
        }
        if (!isMailButtonEnabled) {
            removeMailIcons();
            return;
        }
        addMailIcons();
        const targetNode = document.querySelector('ul.user-info-list-wrap');
        if (targetNode) {
            if (mailObserver) {
                mailObserver.disconnect();
            }
            mailObserver = new MutationObserver(() => {
                if (isMailButtonEnabled) {
                    addMailIcons();
                } else {
                    removeMailIcons();
                }
            });
            mailObserver.observe(targetNode, { childList: true, subtree: true });
        }
    }

    function addDingusButton() {
        const targetUl = document.querySelector('.ui-tabs-nav') ||
                        document.querySelector('ul[role="tablist"]');
        if (!targetUl) {
            return false;
        }
        const tabItems = targetUl.querySelectorAll('li[role="tab"]');
        if (tabItems.length < 7) {
            return false;
        }
        const seventhTab = tabItems[6];
        const existingDingusTab = targetUl.querySelector('li a[href="#dingus"]');
        if (existingDingusTab) {
            return true;
        }
        const isDingusActive = window.location.href === 'https://www.torn.com/preferences.php#tab=dingus';
        const newLi = document.createElement('li');
        newLi.className = isDingusActive
            ? 'c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active'
            : 'c-pointer ui-state-default ui-corner-top';
        newLi.setAttribute('data-title-name', 'Custom Settings');
        newLi.setAttribute('role', 'tab');
        newLi.setAttribute('aria-controls', 'dingus');
        newLi.setAttribute('aria-labelledby', 'ui-id-8');
        const anchor = document.createElement('a');
        anchor.className = 't-gray-6 bold h email-subscriptions ui-tabs-anchor';
        anchor.setAttribute('href', '#dingus');
        anchor.setAttribute('role', 'presentation');
        anchor.setAttribute('id', 'ui-id-8');
        anchor.textContent = 'Custom Settings';
        let isHovering = false;
        function updateButtonClass() {
            const isDingusActiveNow = window.location.href === 'https://www.torn.com/preferences.php#tab=dingus';
            newLi.className = (isDingusActiveNow || isHovering)
                ? 'c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active'
                : 'c-pointer ui-state-default ui-corner-top';
            newLi.setAttribute('aria-selected', isDingusActiveNow ? 'true' : 'false');
        }
        newLi.addEventListener('mouseover', () => {
            isHovering = true;
            updateButtonClass();
        });
        newLi.addEventListener('mouseout', () => {
            isHovering = false;
            updateButtonClass();
        });
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'https://www.torn.com/preferences.php#tab=dingus';
            toggleDingusPanel();
        });
        newLi.appendChild(anchor);
        if (seventhTab.nextSibling) {
            targetUl.insertBefore(newLi, seventhTab.nextSibling);
        } else {
            targetUl.appendChild(newLi);
        }
        return true;
    }

    function createDingusPanel() {
        if (document.getElementById('dingus')) {
            return;
        }
        const tabContainer = document.querySelector('.ui-tabs');
        if (!tabContainer) {
            return;
        }
        const dingusPanel = document.createElement('div');
        dingusPanel.id = 'dingus';
        dingusPanel.className = 'prefs-cont self-exclusion left ui-tabs-panel ui-widget-content ui-corner-bottom';
        dingusPanel.setAttribute('role', 'tabpanel');
        dingusPanel.setAttribute('aria-labelledby', 'ui-id-8');
        dingusPanel.setAttribute('aria-expanded', 'false');
        dingusPanel.setAttribute('aria-hidden', 'true');
        dingusPanel.style.display = 'none';
        dingusPanel.innerHTML = `
            <div class="inner-block begin-dingus-settings">
                <ul class="settings-list no-padding">
                    <li class="settings-cell p-top5 first left">
                        <div class="head t-gray-6 bold">
                            <p>Message Template Title:</p>
                            <div class="clear"></div>
                        </div>
                        <input type="text" id="message-template-title" placeholder="Enter your message template title" style="width: 100%; padding: 5px; margin-bottom: 10px;" />
                        <div class="head t-gray-6 bold">
                            <p>Message Template:</p>
                            <div class="clear"></div>
                        </div>
                        <textarea id="message-template" rows="5" cols="50" placeholder="Enter your message template (HTML format)" style="resize: vertical; padding: 5px; margin: 0;"></textarea>
                        <div class="p-top5">
                            <input type="checkbox" id="mail-button-toggle">
                            <label for="mail-button-toggle">Enable Mail Buttons on User List</label>
                        </div>
                        <div class="p-top5">
                            <input type="checkbox" id="mail-button-new-tab" checked>
                            <label for="mail-button-new-tab">Open Mail Links in New Tab</label>
                        </div>
                        <div class="btn-wrap p-top5">
                            <button id="save-settings" class="btn torn-btn btn-big grey">Save Settings</button>
                        </div>
                    </li>
                    <div class="clear"></div>
                </ul>
            </div>
        `;
        tabContainer.appendChild(dingusPanel);
        setupMessageTemplate();
    }

    function setupMessageTemplate() {
        const templateTextarea = document.getElementById('message-template');
        const templateTitleInput = document.getElementById('message-template-title');
        const saveSettingsBtn = document.getElementById('save-settings');
        const mailButtonToggle = document.getElementById('mail-button-toggle');
        const mailButtonNewTabToggle = document.getElementById('mail-button-new-tab');
        templateTextarea.value = templateContent;
        templateTitleInput.value = templateTitle;
        mailButtonToggle.checked = isMailButtonEnabled;
        mailButtonNewTabToggle.checked = isMailButtonNewTab;
        saveSettingsBtn.addEventListener('click', () => {
            templateContent = templateTextarea.value.trim();
            templateTitle = templateTitleInput.value.trim();
            isMailButtonEnabled = mailButtonToggle.checked;
            isMailButtonNewTab = mailButtonNewTabToggle.checked;
            setCookie('messageTemplate', templateContent);
            setCookie('messageTemplateTitle', templateTitle);
            setCookie('mailButtonEnabled', isMailButtonEnabled);
            setCookie('mailButtonNewTab', isMailButtonNewTab);
            if (window.location.pathname.includes('/page.php') && window.location.search.includes('sid=UserList')) {
                if (isMailButtonEnabled) {
                    addMailIcons();
                    if (!mailObserver) {
                        initializeMailButtons();
                    }
                } else {
                    removeMailIcons();
                    if (mailObserver) {
                        mailObserver.disconnect();
                        mailObserver = null;
                    }
                }
            }
        });
        mailButtonToggle.addEventListener('change', () => {
            isMailButtonEnabled = mailButtonToggle.checked;
            if (window.location.pathname.includes('/page.php') && window.location.search.includes('sid=UserList')) {
                if (isMailButtonEnabled) {
                    addMailIcons();
                    if (!mailObserver) {
                        initializeMailButtons();
                    }
                } else {
                    removeMailIcons();
                    if (mailObserver) {
                        mailObserver.disconnect();
                        mailObserver = null;
                    }
                }
            }
        });
    }

    function updateHeaderText() {
        const currentUrl = window.location.href;
        const dingusUrl = 'https://www.torn.com/preferences.php#tab=dingus';
        if (currentUrl !== dingusUrl) {
            return;
        }
        const xpath = '/html/body/div[6]/div/div[2]/div[4]/div/div[1]/text()';
        const targetNode = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (targetNode) {
            targetNode.nodeValue = 'Custom Settings';
        }
    }

    function toggleDingusPanel() {
        const currentUrl = window.location.href;
        const dingusUrl = 'https://www.torn.com/preferences.php#tab=dingus';
        const dingusPanel = document.getElementById('dingus');
        const allPanels = document.querySelectorAll('div[role="tabpanel"]');
        const dingusTab = document.querySelector('li[aria-controls="dingus"]');
        if (!dingusPanel || !dingusTab) {
            return;
        }
        if (currentUrl === dingusUrl) {
            allPanels.forEach(panel => {
                if (panel.id !== 'dingus') {
                    panel.setAttribute('aria-expanded', 'false');
                    panel.setAttribute('aria-hidden', 'true');
                    panel.style.display = 'none';
                }
            });
            dingusPanel.setAttribute('aria-expanded', 'true');
            dingusPanel.setAttribute('aria-hidden', 'false');
            dingusPanel.style.display = 'block';
        } else {
            dingusPanel.setAttribute('aria-expanded', 'false');
            dingusPanel.setAttribute('aria-hidden', 'true');
            dingusPanel.style.display = 'none';
        }
        const isHovering = dingusTab.classList.contains('ui-state-hover');
        const isDingusActiveNow = currentUrl === dingusUrl;
        dingusTab.className = (isDingusActiveNow || isHovering)
            ? 'c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active'
            : 'c-pointer ui-state-default ui-corner-top';
        dingusTab.setAttribute('aria-selected', isDingusActiveNow ? 'true' : 'false');
        const allTabs = document.querySelectorAll('li[role="tab"]');
        allTabs.forEach(tab => {
            if (tab !== dingusTab) {
                const tabHash = tab.querySelector('a').getAttribute('href');
                const tabUrl = `https://www.torn.com/preferences.php#tab=${tabHash.slice(1)}`;
                if (currentUrl === tabUrl) {
                    tab.classList.add('ui-tabs-active', 'ui-state-active');
                    tab.setAttribute('aria-selected', 'true');
                } else {
                    tab.classList.remove('ui-tabs-active', 'ui-state-active');
                    tab.setAttribute('aria-selected', 'false');
                }
            }
        });
        updateHeaderText();
    }

    function enforcePanelHiding() {
        const currentUrl = window.location.href;
        const dingusUrl = 'https://www.torn.com/preferences.php#tab=dingus';
        const dingusPanel = document.getElementById('dingus');
        const dingusTab = document.querySelector('li[aria-controls="dingus"]');
        if (dingusPanel && currentUrl !== dingusUrl) {
            dingusPanel.setAttribute('aria-expanded', 'false');
            dingusPanel.setAttribute('aria-hidden', 'true');
            dingusPanel.style.display = 'none';
        }
        if (dingusTab) {
            const isHovering = dingusTab.classList.contains('ui-state-hover');
            const isDingusActiveNow = currentUrl === dingusUrl;
            dingusTab.className = (isDingusActiveNow || isHovering)
                ? 'c-pointer ui-state-default ui-corner-top ui-tabs-active ui-state-active'
                : 'c-pointer ui-state-default ui-corner-top';
            dingusTab.setAttribute('aria-selected', isDingusActiveNow ? 'true' : 'false');
        }
        updateHeaderText();
    }

    let isDingusTabAdded = false;

    function checkDOM() {
        if (document.readyState === 'complete') {
            const targetUl = document.querySelector('.ui-tabs-nav') ||
                           document.querySelector('ul[role="tablist"]');
            if (!targetUl) {
                return false;
            }
            const success = addDingusButton();
            if (success) {
                createDingusPanel();
                toggleDingusPanel();
                updateHeaderText();
                isDingusTabAdded = true;
                return true;
            }
        }
        return false;
    }

    function startPreferencesPolling() {
        if (!window.location.pathname.includes('/preferences.php')) {
            return;
        }
        if (checkDOM()) {
            isDingusTabAdded = true;
            return;
        }
        let attempts = 0;
        const maxAttempts = 150;
        function poll() {
            attempts++;
            if (checkDOM() || attempts >= maxAttempts) {
                if (attempts >= maxAttempts && !isDingusTabAdded) {
                    window.addEventListener('load', () => {
                        if (!isDingusTabAdded) {
                            checkDOM();
                        }
                    }, { once: true });
                }
            } else {
                setTimeout(() => requestAnimationFrame(poll), 50);
            }
        }
        requestAnimationFrame(poll);
    }

    window.addEventListener('load', () => {
        initializeMessageTemplate();
        initializeMailButtons();
        startPreferencesPolling();
    }, false);
    window.addEventListener('hashchange', toggleDingusPanel, false);
    setInterval(enforcePanelHiding, 500);
})();
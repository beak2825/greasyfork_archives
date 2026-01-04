// ==UserScript==
// @name         记录位置
// @version      3.1
// @description  允许用户自定义快捷键记录滚动位置，记录快捷键默认 Ctrl+O，恢复位置快捷键默认 Ctrl+Shift+H。提供保存位置、恢复位置、一键清理记录的菜单选项。恢复时在记录中找到匹配的完整网址记录，跳转到最近的匹配网址并平滑滚动恢复位置。进入网页时检查是否有记录，如果有则自动跳转到保存位置，主页面不自动恢复位置。
// @author       hiisme
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @namespace https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/505774/%E8%AE%B0%E5%BD%95%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/505774/%E8%AE%B0%E5%BD%95%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(async () => {
    const MAX_STORED_PAGES = 20;
    const DEFAULT_SAVE_SHORTCUT = 'Ctrl+O';
    const DEFAULT_RESTORE_SHORTCUT = 'Ctrl+Shift+H';

    let saveShortcut = await GM_getValue('saveShortcut', DEFAULT_SAVE_SHORTCUT);
    let restoreShortcut = await GM_getValue('restoreShortcut', DEFAULT_RESTORE_SHORTCUT);

    const getStorageKey = () => `scrollPosition_${window.location.href}`;

    const saveScrollPosition = async () => {
        const storedData = await GM_getValue('scrollPositions', {});
        storedData[getStorageKey()] = Math.round(window.scrollY);
        await GM_setValue('scrollPositions', storedData);
        manageStoredKeys(storedData);
        showNotification('塞进了回忆');
    };

    const smoothScrollTo = (position) => {
        window.scrollTo({
            top: position,
            behavior: 'smooth'
        });
    };

    const restoreScrollPosition = async () => {
        const storedData = await GM_getValue('scrollPositions', {});
        const domain = new URL(window.location.href).origin;
        const keys = Object.keys(storedData);
        const closestMatch = keys
            .filter(key => key.includes(domain))
            .sort()
            .pop();

        if (closestMatch) {
            const targetUrl = closestMatch.split('_')[1];
            if (targetUrl !== window.location.href) {
                await GM_setValue('scrollPositionsToRestore', {
                    url: targetUrl,
                    position: storedData[closestMatch]
                });
                window.location.href = targetUrl;
            } else {
                smoothScrollTo(storedData[closestMatch]);
                showNotification('已回到从前');
            }
        } else {
            showNotification('没有找到回忆');
        }
    };

    const clearAllPositions = async () => {
        await GM_setValue('scrollPositions', {});
        showNotification('所有的回忆都消失了');
    };

    const manageStoredKeys = (storedData) => {
        const keys = Object.keys(storedData);
        if (keys.length > MAX_STORED_PAGES) {
            keys
                .sort((a, b) => storedData[a] - storedData[b])
                .slice(0, keys.length - MAX_STORED_PAGES)
                .forEach(key => delete storedData[key]);
            GM_setValue('scrollPositions', storedData);
        }
    };

    const showNotification = (message) => {
        GM_notification({
            text: message,
            title: '脚本通知',
            timeout: 3000
        });
    };

    const isValidShortcut = (shortcut) => /^((Ctrl|Shift|Alt)\+)*[A-Z]$/.test(shortcut);

    const handleKeyboardEvent = (event) => {
        const modifierKeys = `${event.ctrlKey ? 'Ctrl+' : ''}${event.shiftKey ? 'Shift+' : ''}${event.altKey ? 'Alt+' : ''}${event.key.toUpperCase()}`;
        if (modifierKeys === saveShortcut) {
            saveScrollPosition();
            event.preventDefault();
        } else if (modifierKeys === restoreShortcut) {
            restoreScrollPosition();
            event.preventDefault();
        }
    };

    const setupEventListeners = () => {
        window.addEventListener('keydown', handleKeyboardEvent);
    };

    GM_registerMenuCommand('塞进回忆', saveScrollPosition);
    GM_registerMenuCommand('回忆从前', restoreScrollPosition);
    GM_registerMenuCommand('清空回忆', clearAllPositions);

    GM_registerMenuCommand('如何记忆时光', async () => {
        const newSaveShortcut = prompt('键入记忆时光的按钮 (例如 Ctrl+O)', saveShortcut);
        if (newSaveShortcut && isValidShortcut(newSaveShortcut)) {
            await GM_setValue('saveShortcut', newSaveShortcut);
            saveShortcut = newSaveShortcut;
            alert(`记录位置快捷键已设置为: ${newSaveShortcut}`);
        } else {
            alert('快捷键格式无效，请使用 Ctrl、Shift、Alt 组合键加单个字母。');
        }
    });

    GM_registerMenuCommand('如何回到从前', async () => {
        const newRestoreShortcut = prompt('输入回到从前的按钮 (例如 Ctrl+Shift+H)', restoreShortcut);
        if (newRestoreShortcut && isValidShortcut(newRestoreShortcut)) {
            await GM_setValue('restoreShortcut', newRestoreShortcut);
            restoreShortcut = newRestoreShortcut;
            alert(`恢复位置快捷键已设置为: ${newRestoreShortcut}`);
        } else {
            alert('快捷键格式无效，请使用 Ctrl、Shift、Alt 组合键加单个字母。');
        }
    });

    const checkForPendingRestore = async () => {
        const pendingData = await GM_getValue('scrollPositionsToRestore', null);
        if (pendingData) {
            await GM_setValue('scrollPositionsToRestore', null);
            window.addEventListener('load', () => {
                smoothScrollTo(pendingData.position);
                showNotification('回忆从前');
            }, { once: true });
            window.location.href = pendingData.url;
        }
    };

    const initialize = async () => {
        setupEventListeners();
        await checkForPendingRestore();
        window.addEventListener('load', async () => {
            const storedData = await GM_getValue('scrollPositions', {});
            const currentKey = getStorageKey();
            if (storedData[currentKey]) {
                smoothScrollTo(storedData[currentKey]);
                showNotification('回忆从前');
            }
        });
    };

    initialize();
})();

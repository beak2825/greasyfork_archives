// ==UserScript==
// @name         ChatGPT Thread Deletion with Checkbox
// @description  Adds checkboxes to chat threads in ChatGPT and provides functionality to delete selected threads.
// @name:zh-CN   ChatGPT 线程删除与复选框
// @description:zh-CN  在ChatGPT中添加复选框，提供删除所选线程的功能。
// @name:ja  ChatGPTにスレッド削除のチャットボックスの追加
// @description:ja  チャットスレッドにチェックボックスを追加し、選択したスレッドを削除する機能を提供します。
// @name:zh-TW  ChatGPT 线程删除与复选框
// @description:zh-TW 在ChatGPT中添加复选框，提供删除所选线程的功能。
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @author       recursive
// @license      MIT
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/476543/ChatGPT%20Thread%20Deletion%20with%20Checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/476543/ChatGPT%20Thread%20Deletion%20with%20Checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let deleteBtn = null;
    let checkboxes = [];

    // 削除ボタンの表示・非表示を更新する関数
    function updateDeleteButtonVisibility() {
        const isChecked = checkboxes.some(cb => cb.checked);
        deleteBtn.style.display = isChecked ? 'block' : 'none';
    }

    // チェックボックスの位置を設定する関数
    function setCheckboxPosition(checkbox, icon) {
        const iconRect = icon.getBoundingClientRect();
        const iconParentRect = icon.parentElement.getBoundingClientRect();

        checkbox.style.width = `${iconRect.width}px`;
        checkbox.style.height = `${iconRect.height}px`;

        if (iconRect.bottom < iconParentRect.top || iconRect.top > iconParentRect.bottom ||
            iconRect.right < iconParentRect.left || iconRect.left > iconParentRect.right) {
            checkbox.style.display = 'none';
        } else {
            checkbox.style.display = '';
            checkbox.style.left = `${iconRect.left - iconParentRect.left}px`;
            checkbox.style.top = `${iconRect.top - iconParentRect.top}px`;
        }
    }

    // アイコンに対応するチェックボックスを作成する関数
    function createCheckboxForIcon(icon) {
        let existingCheckbox = icon.parentElement.querySelector('.thread-selector');
        if (existingCheckbox) return;

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'thread-selector';
        checkbox.style.position = 'absolute';
        checkbox.style.zIndex = '10000';

        setCheckboxPosition(checkbox, icon);
        icon.parentElement.appendChild(checkbox);
        checkboxes.push(checkbox);

        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            updateDeleteButtonVisibility();
        });

        const iconObserver = new MutationObserver(() => {
            setCheckboxPosition(checkbox, icon);
        });
        iconObserver.observe(icon, { attributes: true, childList: true, characterData: true, subtree: true });
    }

    // 全てのチャットスレッドのアイコンに対してチェックボックスを作成する関数
    function createCheckboxesForAllChatThreadIcons() {
        const svgIcons = document.querySelectorAll('#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.flex-shrink-0.overflow-x-hidden.dark.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.-mr-2.pr-2.overflow-y-auto > div > div a > svg');
        svgIcons.forEach(createCheckboxForIcon);
    }


    // 遅延処理を行う関数
    async function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 選択されたスレッドを削除する関数
    async function deleteCheckedThreads() {
        let successfulDeletions = 0;
        let threadsToDelete = [];
        const totalDelayPerThread = 250;  // 100ms + 150ms for each thread deletion

        for (const checkbox of checkboxes) {
            if (!checkbox.checked) continue;

            let threadElem = checkbox.closest('a');
            if (!threadElem) continue;

            threadsToDelete.push(threadElem);
        }

        for (const threadElem of threadsToDelete) {
            threadElem.click();
            await delay(100);

            const trashButton = threadElem.querySelector('button:nth-child(2)');
            if (!trashButton) continue;

            const elementRect = trashButton.getBoundingClientRect();
            const x = elementRect.left + window.pageXOffset;
            const y = elementRect.top + window.pageYOffset;
            const clickEvent = new MouseEvent('click', {
                bubbles: true, cancelable: true, view: window, clientX: x, clientY: y
            });
            trashButton.dispatchEvent(clickEvent);

            await delay(150);

            const deleteConfirmButton = document.querySelector('div.p-4.sm\\:p-6.sm\\:pt-4 > div > div > button.btn.relative.btn-danger');
            if (deleteConfirmButton) {
                deleteConfirmButton.click();
                successfulDeletions++;
            }

            await delay(totalDelayPerThread);  // Ensure delay after each thread deletion
        }

        if (successfulDeletions > 0) {
            window.location.reload();  // Reload after all threads have been deleted
        }
    }

    // 削除ボタンをUIに追加する関数
    function addDeleteButtonToUI() {
        deleteBtn = document.createElement('div');
        deleteBtn.innerText = 'Delete';

        const referenceButton = document.querySelector('#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.flex-shrink-0.overflow-x-hidden.dark.bg-gray-900 > div > div > div > nav > div.mb-1.flex.flex-row.gap-2 > a');
        if (referenceButton) {
            const rect = referenceButton.getBoundingClientRect();
            deleteBtn.style.width = `${rect.width}px`;
            deleteBtn.style.height = `${rect.height}px`;
            deleteBtn.style.fontSize = '14px';
            deleteBtn.style.lineHeight = `${rect.height}px`;
            deleteBtn.style.textAlign = 'center';
        }

        deleteBtn.style.position = 'fixed';
        deleteBtn.style.display = 'none';
        deleteBtn.style.background = '#f00';
        deleteBtn.style.color = '#fff';
        deleteBtn.style.borderRadius = '5px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.left = '10px';
        deleteBtn.style.top = '10px';
        deleteBtn.onclick = deleteCheckedThreads;

        document.body.appendChild(deleteBtn);
    }

    // アイコンがクリックされた時にチェックボックスを作成するイベントリスナーを追加する
    document.addEventListener('click', (event) => {
        const parentSelector = '#__next > div.overflow-hidden.w-full.h-full.relative.flex.z-0 > div.flex-shrink-0.overflow-x-hidden.dark.bg-gray-900 > div > div > div > nav > div.flex-col.flex-1.transition-opacity.duration-500.-mr-2.pr-2.overflow-y-auto > div > div';
        if (event.target.closest(parentSelector) && event.target.matches('svg')) {
            createCheckboxesForAllChatThreadIcons();
        }
    });


    // 削除ボタンをUIに追加する
    addDeleteButtonToUI();

    // スレッドリストの変更を監視し、アイコンに対応するチェックボックスを作成する
    const threadList = document.querySelector('#__next div.overflow-hidden.w-full.h-full.relative.flex.z-0 div.flex-shrink-0.overflow-x-hidden.dark.bg-gray-900 div > div > div > nav div.flex-col.flex-1.transition-opacity.duration-500.-mr-2.pr-2.overflow-y-auto > div > div');
    const observer = new MutationObserver(createCheckboxesForAllChatThreadIcons);
    observer.observe(threadList, { childList: true, subtree: true });
})();
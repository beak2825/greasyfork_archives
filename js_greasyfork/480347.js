// ==UserScript==
// @name         Скрипт для удобного ответа на вопросы в Тематических вопросах.
// @description  Скрывает вопросы на которые уже был ответ.
// @author       stealyourbrain
// @license      MIT
// @match        https://zelenka.guru/forums/585/*
// @version 0.0.1.20231120091503
// @namespace https://greasyfork.org/users/1220529
// @downloadURL https://update.greasyfork.org/scripts/480347/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%83%D0%B4%D0%BE%D0%B1%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B0%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D1%8B%20%D0%B2%20%D0%A2%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D0%B0%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/480347/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%83%D0%B4%D0%BE%D0%B1%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B0%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D1%8B%20%D0%B2%20%D0%A2%D0%B5%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%D0%B0%D1%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hideThreadsEnabled = true;

    function toggleHideThreads() {
        hideThreadsEnabled = !hideThreadsEnabled;
        if (hideThreadsEnabled) {
            hideThreads();
        } else {
            showAllThreads();
        }
    }

    function hideThreads() {
        const icons = document.querySelectorAll('i.fa.fa-bullseye.mainc.Tooltip[data-placement="left"]:not(.processed)');
        icons.forEach(icon => {
            const messageCell = icon.closest('.discussionListItem');
            if (messageCell) {
                messageCell.style.display = 'none';
                icon.classList.add('processed');
            }
        });
    }

    function showAllThreads() {
        const hiddenThreads = document.querySelectorAll('.discussionListItem[style="display: none;"]');
        hiddenThreads.forEach(thread => {
            thread.style.display = '';
        });
    }

    const discussionListOptions = document.querySelector('.DiscussionListOptions');
    if (discussionListOptions) {
        const toggleContainer = document.createElement('div');
        toggleContainer.style.backgroundColor = '#2D2D2D';
        toggleContainer.style.borderRadius = '8px';
        toggleContainer.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.1)';
        toggleContainer.style.padding = '8px';
        toggleContainer.style.display = 'flex';
        toggleContainer.style.alignItems = 'center';

        const toggleLabel = document.createElement('label');
        toggleLabel.textContent = 'Скрыть темы: ';
        toggleLabel.style.margin = '0';
        toggleLabel.style.color = '#fff';
        toggleLabel.style.fontWeight = 'bold';

        const toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = hideThreadsEnabled;
        toggleInput.style.margin = '0';
        toggleInput.style.marginRight = '5px';
        toggleInput.style.cursor = 'pointer';
        toggleInput.style.border = 'none';
        toggleInput.addEventListener('change', toggleHideThreads);

        toggleLabel.appendChild(toggleInput);
        toggleContainer.appendChild(toggleLabel);
        discussionListOptions.appendChild(toggleContainer);
    }

    const observer = new MutationObserver(hideThreads);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    if (hideThreadsEnabled) {
        hideThreads();
    }
})();
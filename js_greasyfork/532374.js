// ==UserScript==
// @name         Lolz.live comment ID Collector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Сбор id сообщений в теме
// @author       eretly
// @match        https://lolz.live/threads/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532374/Lolzlive%20comment%20ID%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/532374/Lolzlive%20comment%20ID%20Collector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Конфигурация (краткое пояснение, посты - комменты людей, а комменты - комментарии к постам).
    const config = {
        targetUsername: {
            username: "", // Оставьте пустым для сбора всех ID
            include: true // true - собирает ТОЛЬКО id постов, где в комментах ответил человек с этим ником, false - ВСЕ id постов КРОМЕ постов, где в комментах ответил человек с этим ником.
        },
        idFormat: '"${id}":', // ${id} это оставляем и как угодно заворачиваем
        copySeparator: "\n", // отступы типо, можно пробел там либо перенос или ваще похуй.
        showExampleOnCopy: true, // Это при копировании показывает сбоку в менюшке, как выглядит формат 1 айдишки.
        resume: true // НЕ ТРОГАТЬ
    };

    const panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #2c3e50;
        padding: 10px;
        border-radius: 4px;
        color: white;
        font-family: Arial, sans-serif;
        min-width: 280px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    `;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        height: 6px;
        background: #34495e;
        margin: 8px 0;
        border-radius: 3px;
        overflow: hidden;
    `;

    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
        height: 100%;
        background: #2ecc71;
        width: 0%;
        transition: width 0.3s;
    `;

    const statsText = document.createElement('div');
    statsText.style.cssText = `
        font-size: 13px;
        margin: 8px 0;
        display: flex;
        justify-content: space-between;
        line-height: 1.4;
    `;

    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        gap: 5px;
        margin-top: 8px;
    `;

    const actionBtn = document.createElement('button');
    actionBtn.style.cssText = `
        padding: 6px 12px;
        background: #27ae60;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
        font-weight: bold;
    `;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Копировать';
    copyBtn.style.cssText = `
        padding: 6px 12px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
    `;

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Сброс';
    resetBtn.style.cssText = `
        padding: 6px 12px;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
    `;

    progressBar.appendChild(progressFill);
    panel.appendChild(progressBar);
    panel.appendChild(statsText);
    buttonsContainer.appendChild(actionBtn);
    buttonsContainer.appendChild(copyBtn);
    buttonsContainer.appendChild(resetBtn);
    panel.appendChild(buttonsContainer);
    document.body.appendChild(panel);

    let totalPages = 1;
    let foundPostIds = [];
    let processedPages = [];
    let nextPageToProcess = 1;

    if (config.resume) {
        const savedState = GM_getValue('scanState', null);
        if (savedState) {
            foundPostIds = savedState.foundPostIds || [];
            processedPages = savedState.processedPages || [];
            nextPageToProcess = savedState.nextPageToProcess || 1;
            totalPages = savedState.totalPages || 1;
            updateUI();
        }
    }

    function saveState() {
        GM_setValue('scanState', {
            foundPostIds: foundPostIds,
            processedPages: processedPages,
            nextPageToProcess: nextPageToProcess,
            totalPages: totalPages
        });
    }

    function updateUI() {
        updateTotalPages();
        const currentPage = getCurrentPage();
        const isLastPage = currentPage >= totalPages;

        if (processedPages.length === 0) {
            actionBtn.textContent = 'Начать';
        } else if (isLastPage) {
            actionBtn.textContent = 'Закончить';
        } else {
            actionBtn.textContent = 'Продолжить';
        }

        const progressPercent = Math.min(100, (processedPages.length / totalPages) * 100);
        progressFill.style.width = `${progressPercent}%`;

        statsText.innerHTML = `
            <div>
                <div>Обработано: <strong>${processedPages.length}</strong> из <strong>${totalPages}</strong></div>
                <div>Найдено: <strong>${foundPostIds.length}</strong> ID</div>
            </div>
            <div style="text-align:right">
                <div>Прогресс: <strong>${Math.round(progressPercent)}%</strong></div>
                <div style="font-size:11px;color:#${processedPages.length > 0 ? '2ecc71' : 'bdc3c7'}">
                    ${isLastPage ? '✓ Сканирование завершено' : processedPages.length > 0 ? '✓ Готово к продолжению' : 'Готово к началу'}
                </div>
            </div>
        `;
    }

    function updateTotalPages() {
        const pageNav = document.querySelector('.PageNav');
        if (pageNav) {
            totalPages = parseInt(pageNav.dataset.last) || 1;
        } else {
            const lastPageLink = document.querySelector('a.pageNav-jump--last');
            if (lastPageLink) {
                const match = lastPageLink.href.match(/page-(\d+)/);
                totalPages = match ? parseInt(match[1]) : 1;
            } else {
                totalPages = 1;
            }
        }
    }

    function scanCurrentPage() {
        const currentPage = getCurrentPage();
        const isLastPage = currentPage >= totalPages;

        if (processedPages.includes(currentPage)) {
            if (!isLastPage) goToNextPage();
            return;
        }

        const posts = document.querySelectorAll('li[id^="post-"]:not([id^="post-comment-"]):not(.firstPost)');
        let foundOnThisPage = 0;

        posts.forEach(post => {
            const postId = post.id.replace('post-', '');

            if (!config.targetUsername.username) {
                if (!foundPostIds.includes(postId)) {
                    foundPostIds.push(postId);
                    foundOnThisPage++;
                }
                return;
            }

            const comments = post.querySelectorAll('.comment');
            let hasTargetUserInComments = false;

            comments.forEach(comment => {
                const commentAuthor = comment.querySelector('.username')?.textContent || '';
                if (commentAuthor.includes(config.targetUsername.username)) {
                    hasTargetUserInComments = true;
                }
            });

            if (
                (config.targetUsername.include && hasTargetUserInComments) ||
                (!config.targetUsername.include && !hasTargetUserInComments)
            ) {
                if (!foundPostIds.includes(postId)) {
                    foundPostIds.push(postId);
                    foundOnThisPage++;
                }
            }
        });

        if (!processedPages.includes(currentPage)) {
            processedPages.push(currentPage);
            processedPages.sort((a, b) => a - b);
        }

        updateNextPageToProcess();
        updateUI();
        saveState();

        if (!isLastPage) {
            setTimeout(goToNextPage, 300);
        }
    }


    function getCurrentPage() {
        const pageMatch = window.location.href.match(/page-(\d+)/);
        return pageMatch ? parseInt(pageMatch[1]) : 1;
    }

    function updateNextPageToProcess() {
        for (let i = 1; i <= totalPages; i++) {
            if (!processedPages.includes(i)) {
                nextPageToProcess = i;
                return;
            }
        }
        nextPageToProcess = totalPages + 1;
    }

    function goToNextPage() {
        if (nextPageToProcess > totalPages) {
            return;
        }

        const threadId = window.location.pathname.split('/')[2];
        window.location.href = `https://lolz.live/threads/${threadId}/page-${nextPageToProcess}`;
    }

    function formatIds(ids) {
        return ids.map(id => config.idFormat.replace('${id}', id)).join(config.copySeparator);
    }

    function copyResults() {
        if (foundPostIds.length === 0) {
            statsText.innerHTML = `
                <div>Нет ID для копирования</div>
            `;
            return;
        }

        const formattedIds = formatIds(foundPostIds);
        navigator.clipboard.writeText(formattedIds)
            .then(() => {
            let copyMessage = `<div>Скопировано: <strong>${foundPostIds.length}</strong> ID</div>`;
            if (config.showExampleOnCopy) {
                copyMessage += `<div style="font-size:11px">Формат: ${formattedIds.split(config.copySeparator)[0]}</div>`;
            }
            statsText.innerHTML = copyMessage;
        })
            .catch(err => {
            console.error('Ошибка копирования:', err);
            statsText.innerHTML = `
                    <div>Ошибка при копировании</div>
                `;
        });
    }

    function resetProgress() {
        foundPostIds = [];
        processedPages = [];
        nextPageToProcess = 1;
        saveState();
        updateUI();

        statsText.innerHTML = `
            <div>Прогресс сброшен</div>
            <div style="color:#2ecc71">Готово к началу</div>
        `;
        progressFill.style.width = '0%';
    }

    actionBtn.addEventListener('click', scanCurrentPage);
    copyBtn.addEventListener('click', copyResults);
    resetBtn.addEventListener('click', resetProgress);

    updateUI();
})();
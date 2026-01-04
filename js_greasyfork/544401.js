// ==UserScript==
// @name         Lolz.live Dynamic Time
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Добавляет секунды + обновление времени в реальном времени (нагрузка на усройстве).
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544401/Lolzlive%20Dynamic%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/544401/Lolzlive%20Dynamic%20Time.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const activeElements = new WeakMap();
    let updateTimer = null;

    function pluralize(number, one, few, many) {
        number = Math.abs(number);
        if (number % 100 >= 11 && number % 100 <= 19) return many;
        switch (number % 10) {
            case 1: return one;
            case 2:
            case 3:
            case 4: return few;
            default: return many;
        }
    }

    function getSafeDiff(timestamp) {
        return Math.max(0, Math.floor(Date.now() / 1000) - timestamp);
    }

    function formatRelativeTime(diff) {
        diff = Math.max(0, diff);

        if (diff < 60) {
            return `${diff} ${pluralize(diff, 'секунду', 'секунды', 'секунд')} назад`;
        } else if (diff < 120) {
            return 'Минуту назад';
        } else if (diff < 3600) {
            const mins = Math.floor(diff / 60);
            return `${mins} мин. назад`;
        }
        return null;
    }

    function formatAbsoluteTime(el) {
        const timeStr = el.getAttribute('data-timestring');
        if (!timeStr) return null;
        return `Сегодня, в ${timeStr}`;
    }

    function addSecondsToDateTime() {
        document.querySelectorAll('abbr.DateTime[data-time]').forEach(el => {
            const timestamp = parseInt(el.getAttribute('data-time'));
            if (!timestamp) return;

            const diff = getSafeDiff(timestamp);
            const sixDays = 7 * 24 * 60 * 60; // 7 дней в секундах

            if (diff >= 3600 && diff <= sixDays) {
                const timeStr = el.getAttribute('data-timestring');
                if (!timeStr) return;

                if (timeStr.match(/^\d{1,2}:\d{2}:\d{2}$/)) return;

                const date = new Date(timestamp * 1000);
                const hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                const timeWithSeconds = `${hours}:${minutes}:${seconds}`;

                const currentText = el.textContent;
                const newText = currentText.replace(/\d{1,2}:\d{2}$/, timeWithSeconds);
                el.textContent = newText;

                const title = el.getAttribute('title');
                if (title) {
                    const newTitle = title.replace(/\d{1,2}:\d{2}$/, timeWithSeconds);
                    el.setAttribute('title', newTitle);
                }
                el.setAttribute('data-timestring', timeWithSeconds);
            }
        });
    }

    function updateTimes() {
        let needsUpdate = false;

        document.querySelectorAll('abbr.DateTime[data-time]').forEach(el => {
            if (!activeElements.has(el)) return;

            const timestamp = parseInt(el.getAttribute('data-time'));
            const diff = getSafeDiff(timestamp);

            if (diff < 3600) {
                const newText = formatRelativeTime(diff);
                if (newText && el.textContent !== newText) {
                    el.textContent = newText;
                }
                needsUpdate = true;
            } else if (diff >= 3600) {
                const absText = formatAbsoluteTime(el);
                if (absText) {
                    el.textContent = absText;
                }
                activeElements.delete(el);
            }
        });

        if (needsUpdate && !updateTimer) {
            updateTimer = setTimeout(() => {
                updateTimer = null;
                updateTimes();
            }, 1000);
        } else if (!needsUpdate && updateTimer) {
            clearTimeout(updateTimer);
            updateTimer = null;
        }
    }

    function processNewElement(el) {
        const currentText = el.textContent;
        if (/сегодня|вчера|\d{1,2} \w+ \d{4}/i.test(currentText)) return false;

        const timestamp = parseInt(el.getAttribute('data-time'));
        const diff = getSafeDiff(timestamp);

        if (diff < 3600) {
            el.setAttribute('data-original-text', currentText);
            const newText = formatRelativeTime(diff);
            if (newText) el.textContent = newText;
            activeElements.set(el, true);
            return true;
        }

        return false;
    }

    function addSecondsToConversations() {
        if (window.location.pathname.includes('/conversations/')) {
            document.querySelectorAll('span.messageDate[data-absolutetime]').forEach(el => {
                const timestamp = parseInt(el.getAttribute('data-absolutetime'));
                if (!timestamp) return;

                if (el.textContent.match(/^\d{2}:\d{2}:\d{2}$/)) return;

                const date = new Date(timestamp * 1000);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                el.textContent = `${hours}:${minutes}:${seconds}`;
            });
        }

        document.querySelectorAll('div.conversationItem--messageDate[data-absolutetime]').forEach(el => {
            const timestamp = parseInt(el.getAttribute('data-absolutetime'));
            if (!timestamp) return;

            const messageDate = new Date(timestamp * 1000);
            const today = new Date();

            if (messageDate.toDateString() === today.toDateString()) {
                const currentText = el.textContent.trim();
                if (currentText.match(/^\d{2}:\d{2}:\d{2}$/)) return;

                const hours = messageDate.getHours().toString().padStart(2, '0');
                const minutes = messageDate.getMinutes().toString().padStart(2, '0');
                const seconds = messageDate.getSeconds().toString().padStart(2, '0');

                el.textContent = ` ${hours}:${minutes}:${seconds} `;
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        let shouldUpdate = false;

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const timeNodes = node.matches('abbr.DateTime[data-time]')
                        ? [node]
                        : Array.from(node.querySelectorAll('abbr.DateTime[data-time]'));

                    timeNodes.forEach(el => {
                        if (processNewElement(el)) {
                            shouldUpdate = true;
                        }
                    });

                    setTimeout(addSecondsToConversations, 10);

                    setTimeout(addSecondsToDateTime, 10);
                }
            });
        });

        if (shouldUpdate) {
            setTimeout(updateTimes, 50);
        }
    });

    function init() {
        let needsUpdate = false;

        document.querySelectorAll('abbr.DateTime[data-time]').forEach(el => {
            if (processNewElement(el)) {
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            updateTimes();
        }

        addSecondsToConversations();

        addSecondsToDateTime();

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        ['click', 'scroll', 'mousemove'].forEach(event => {
            document.addEventListener(event, () => {
                setTimeout(updateTimes, 100);

                setTimeout(addSecondsToConversations, 10);

                setTimeout(addSecondsToDateTime, 10);
            }, { passive: true });
        });
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }

    window.addEventListener('unload', () => {
        observer.disconnect();
        if (updateTimer) clearTimeout(updateTimer);
    });
})();
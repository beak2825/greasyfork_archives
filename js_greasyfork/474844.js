// ==UserScript==
// @name         Sfera knowlegde save helper
// @version      0.1
// @description  Скрипт, напоминающий о сохранении данных
// @author       geuarg1y
// @match        *://sfera.inno.local/knowledge/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/998190
// @downloadURL https://update.greasyfork.org/scripts/474844/Sfera%20knowlegde%20save%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/474844/Sfera%20knowlegde%20save%20helper.meta.js
// ==/UserScript==

(function () {
    const GLOBAL_SETTINGS = {
        AUTO_SAVE_ON_TAB_CHANGE: true, // Автосохранение при смене на другую вкладку в браузере. false - отключает функцию
        REMINDER_TIMER: minutes(10), // Таймер-напоминалка о сохранении. По умолчанию = 10 минут. 0 - отключает таймер.
        IDLE_TIMER: seconds(60), // Таймер бездействия. По умолчанию = 60 секунд. 0 - отключает таймер.
        PAGE_IS_LOADED_SELECTOR: '#layout-content-card', // Селектор элемента, по которому можно понять, что страница загрузилась полностью и готова к работе скрипта.
    };

    class RecursiveTimer {
        constructor(onTimeout, timeout) {
            this.onTimeout = onTimeout;
            this.timeout = timeout;
            this.timer = null;
        }

        activate = () => {
            if (!this.timeout) {
                return;
            }

            this.timer = setTimeout(() => {
                this.onTimeout();
                this.resetTimer();
            }, this.timeout);
        };

        deactivate = () => {
            clearInterval(this.timer);
        };

        resetTimer = () => {
            this.deactivate();
            this.activate();
        };
    }

    class IdleTimer {
        _DOCUMENT_EVENTS = [
            'mousemove',
            'mousedown',
            'click',
            'touchmove',
            'touchstart',
            'touchend',
            'keydown',
            'keypress',
        ];

        constructor(onIdleTimeout, timeout) {
            this.onIdleTimeout = onIdleTimeout;
            this.timeout = timeout;
            this.timer = null;
            this.active = false;
        }

        activate = () => {
            if (!this.timeout) {
                return;
            }
            if (!this.active) {
                this.bindEvents();
            }
            this.timer = setTimeout(this.onIdleTimeout, this.timeout);
            this.active = true;
        };

        deactivate = () => {
            if (this.active) {
                this.unbindEvents();
            }
            clearInterval(this.timer);
            this.active = false;
        };

        resetTimer = () => {
            clearInterval(this.timer);
            this.activate();
        };

        bindEvents = () => {
            window.addEventListener('load', this.resetTimer);
            window.addEventListener('scroll', this.resetTimer, { capture: true, passive: true });
            this._DOCUMENT_EVENTS.forEach(eventType => document.addEventListener(eventType, this.resetTimer));
        };

        unbindEvents = () => {
            window.removeEventListener('load', this.resetTimer);
            window.removeEventListener('scroll', this.resetTimer, { capture: true }); // remove only checks capture
            this._DOCUMENT_EVENTS.forEach(eventType => document.removeEventListener(eventType, this.resetTimer));
        };
    }

    class Controller {
        constructor({ settings, idleTimerCb, reminderTimerCb }) {
            this.active = false;
            this.settings = settings;
            this.idleTimerCb = idleTimerCb;
            this.idleTimer = new IdleTimer(idleTimerCb, settings.IDLE_TIMER);
            this.reminderTimer = new RecursiveTimer(reminderTimerCb, settings.REMINDER_TIMER);
        }

        activate = async () => {
            // Дожидаемся появления контента на странице
            await getDomElementAsync(this.settings.PAGE_IS_LOADED_SELECTOR);

            console.debug('controller activated', getTime());

            this.idleTimer.activate();
            this.reminderTimer.activate();

            window.onblur = () => {
                console.debug('page blur', getTime());
                this.reminderTimer.deactivate();
            };

            window.onfocus = () => {
                console.debug('page focus', getTime());
                this.reminderTimer.activate();
            };

            if (this.settings.AUTO_SAVE_ON_TAB_CHANGE) {
                // При переходе на другую вкладку
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        console.debug('page hidden', getTime());
                        this.idleTimerCb();
                    } else {
                        console.debug('page visible', getTime());
                    }
                });
            }

            // Защита от случайного закрытия табы.
            window.addEventListener('beforeunload', this._showConfirmMessage);

            this.active = true;
        };

        deactivate = () => {
            if (!this.active) {
                return;
            }

            console.debug('controller deactivated');

            this.idleTimer.deactivate();
            this.reminderTimer.deactivate();
            window.removeEventListener('beforeunload', this._showConfirmMessage);
            this.active = false;
        };

        _showConfirmMessage = e => {
            const msg = 'Сохраните данные перед закрытием вкладки';
            (e || window.event).returnValue = msg;
            return msg;
        };
    }

    function save() {
        const saveButton = document.querySelector('[data-testid="publish-page"]');
        saveButton?.click();
        console.debug('SAVE', getTime());
    }

    function minutes(count) {
        return count * 60 * 1000;
    }
    function seconds(count) {
        return count * 1000;
    }

    function getTime() {
        const now = new Date();
        return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }

    function getDomElementAsync(selector, timerLimit = 30000) {
        return new Promise((resolve, reject) => {
            try {
                setTimeout(() => reject(`Время ожидания DOM элемента истекло (${timerLimit / 1000}s)`), timerLimit);

                let timerId;

                const tick = () => {
                    const element = document.querySelector(selector);

                    if (element) {
                        clearTimeout(timerId);
                        resolve(element);
                    } else {
                        timerId = setTimeout(tick, 100);
                    }
                };

                tick();
            } catch (e) {
                reject(e);
            }
        });
    }

    function init() {
        console.debug('Sfera save helper INITED');

        const controller = new Controller({
            settings: GLOBAL_SETTINGS,
            idleTimerCb: save,
            reminderTimerCb: () => {
                confirm('Не хотите сохранить внесенные изменения?') && save();
            },
        });

        if (location.pathname.endsWith('pages/edit')) {
            controller.activate();
        }

        navigation.addEventListener('navigate', () => {
            setTimeout(() => {
                console.debug('navigation page changed');

                if (location.pathname.endsWith('pages/edit')) {
                    void controller.activate();
                } else {
                    controller.deactivate();
                }
            }, 100);
        });
    }

    // Start script
    init();
})();

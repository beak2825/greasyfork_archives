// ==UserScript==
// @name         Moodle AutoPilot
// @namespace    https://t.me/johannmosin
// @version      1.0.5
// @description  Полный набор для 100% посещаемости дистанционных лекций
// @author       Johann Mosin
// @match        https://edu.vsu.ru/mod/bigbluebuttonbn/view.php*
// @match        https://*.edu.vsu.ru/html5client/*
// @match        https://www.cs.vsu.ru/brs/att_marks_report_student/*
// @match        https://edu.vsu.ru/mod/attendance/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Glagolitic_ljudi.svg/47px-Glagolitic_ljudi.svg.png
// @downloadURL https://update.greasyfork.org/scripts/533062/Moodle%20AutoPilot.user.js
// @updateURL https://update.greasyfork.org/scripts/533062/Moodle%20AutoPilot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Settings Keys ---
    const SETTINGS_KEYS = {
        autoConnect: 'autoConnectEnabled',
        autoHello: 'autoHelloEnabled',
        autoLeave: 'autoLeaveEnabled',
        autoBRS: 'autobrsEnabled',
        autoAttendance: 'autoAttendanceEnabled'
    };

    // --- Styles ---
    GM_addStyle(`
        .moodle-autotool-button {
            cursor: pointer;
            border-radius: 7px;
            padding: 8px 15px !important;
            transition: background 0.3s;
            color: black !important;
            border: none !important;
            margin: 5px;
            text-align: center;
            font-size: 1rem;
            line-height: 1.5;
        }
        .moodle-autotool-button:hover {
            opacity: 0.9;
        }
        .moodle-autotool-button.off {
            background: rgba(255, 193, 7, 0.25);
        }
        .moodle-autotool-button.on {
            background: rgba(0, 128, 0, 0.25) !important;
        }

        .autoTool-controls {
            display: flex;
            margin: 10px 0;
            flex-wrap: wrap;
        }
        .autoTool-button {
             width: 180px;
        }

        #toggleBRS {
            width: 150px;
            margin-bottom: 2px;
        }

        #toggleAttendance {
             margin-top: 2px;
             margin-bottom: 2px;
        }

        .moodle-autotool-nav-item {
            display: flex;
            align-items: center;
        }
    `);

    function createToggleButton(id, textPrefix, settingKey, initialState = false, onClickCallback = null) {
        const button = document.createElement('button');
        button.id = id;
        button.className = `moodle-autotool-button ${id === 'autoConnectBtn' || id === 'autoHelloBtn' || id === 'autoLeaveBtn' ? 'autoTool-button' : ''}`;
        button.dataset.settingKey = settingKey;

        const updateButtonState = (btn, enabled) => {
            btn.textContent = `${textPrefix}: ${enabled ? 'ВКЛ' : 'ВЫКЛ'}`;
            if (enabled) {
                btn.classList.remove('off');
                btn.classList.add('on');
            } else {
                btn.classList.remove('on');
                btn.classList.add('off');
            }
        };

        let isEnabled = GM_getValue(settingKey, initialState);
        updateButtonState(button, isEnabled);

        button.addEventListener('click', (e) => {
            e.preventDefault();
            isEnabled = !isEnabled;
            GM_setValue(settingKey, isEnabled);
            updateButtonState(button, isEnabled);
            if (onClickCallback) {
                onClickCallback(isEnabled);
            }
        });

        return button;
    }

    const AutoTools = {
        settings: {
            autoConnect: GM_getValue(SETTINGS_KEYS.autoConnect, false),
            autoHello: GM_getValue(SETTINGS_KEYS.autoHello, false),
            autoLeave: GM_getValue(SETTINGS_KEYS.autoLeave, false)
        },
        intervals: {
            connect: null,
            hello: null,
            leave: null,
            bbbButtonCheck: null
        },
        timeouts: {
            reload: null
        },
        flags: {
            connectCheckStarted: false,
            helloMessageSent: false
        },

        initUI(isConnectPage, isConferencePage) {
            if (document.querySelector('.autoTool-controls')) return;

            const controlPanel = document.createElement('div');
            controlPanel.className = 'autoTool-controls';

            const createAndAppend = (id, text, key, callback) => {
                const btn = createToggleButton(id, text, key, this.settings[key.replace('Enabled','')], callback);
                controlPanel.appendChild(btn);
            };

            if (isConnectPage) {
                createAndAppend('autoConnectBtn', 'AutoConnect', SETTINGS_KEYS.autoConnect, (enabled) => {
                    this.settings.autoConnect = enabled;
                    enabled ? this.startAutoConnect() : this.stopAutoConnect();
                });
            }

            if (isConnectPage || isConferencePage) {
                createAndAppend('autoHelloBtn', 'AutoHello', SETTINGS_KEYS.autoHello, (enabled) => {
                    this.settings.autoHello = enabled;
                    enabled ? this.startAutoHello() : this.stopAutoHello();
                });
                createAndAppend('autoLeaveBtn', 'AutoLeave', SETTINGS_KEYS.autoLeave, (enabled) => {
                    this.settings.autoLeave = enabled;
                    enabled ? this.startAutoLeave() : this.stopAutoLeave();
                });
            }

            if (controlPanel.hasChildNodes()) {
                if (isConnectPage) {
                    const targetElement = document.querySelector('[class*="custom-select"]') || document.querySelector('#region-main') || document.body;
                    if(targetElement === document.body) targetElement.insertBefore(controlPanel, targetElement.firstChild);
                    else targetElement.parentNode.insertBefore(controlPanel, targetElement.nextSibling);
                } else if (isConferencePage) {
                    const userListContent = document.querySelector('[data-test="userList"]');
                    const chatInputArea = document.querySelector('#message-input')?.parentNode;
                    const targetParent = userListContent?.parentNode || chatInputArea || document.body;
                    const referenceNode = userListContent || (chatInputArea ? chatInputArea.firstChild : null) || document.body.firstChild;

                    const observer = new MutationObserver((mutations, obs) => {
                        let inserted = false;
                        const userList = document.querySelector('[data-test="userList"]');
                        const chatInput = document.querySelector('#message-input')?.parentNode;
                        if (userList) {
                            userList.parentNode.insertBefore(controlPanel, userList);
                            inserted = true;
                        } else if (chatInput) {
                            chatInput.parentNode.insertBefore(controlPanel, chatInput);
                            inserted = true;
                        }
                        if (inserted) {
                            obs.disconnect();
                        }
                    });

                    if (userListContent) {
                        userListContent.parentNode.insertBefore(controlPanel, userListContent);
                    } else if (chatInputArea) {
                        chatInputArea.parentNode.insertBefore(controlPanel, chatInputArea);
                    } else {
                        observer.observe(document.body, { childList: true, subtree: true });
                        setTimeout(() => {
                            observer.disconnect();
                            if (!document.querySelector('.autoTool-controls')) {
                                document.body.insertBefore(controlPanel, document.body.firstChild);
                            }
                        }, 15000);
                    }
                }
            }
        },

        startAutoConnect() {
            if (!this.flags.connectCheckStarted) {
                this.flags.connectCheckStarted = true;
                this.timeouts.reload = setTimeout(() => {
                    this.checkForSessionLink();
                }, 10000);
            }
        },
        stopAutoConnect() {
            clearInterval(this.intervals.connect);
            clearTimeout(this.timeouts.reload);
            this.intervals.connect = null;
            this.timeouts.reload = null;
            this.flags.connectCheckStarted = false;
        },
        resetReloadTimeout() {
            clearTimeout(this.timeouts.reload);
            this.timeouts.reload = setTimeout(() => {
                if (this.settings.autoConnect) {
                    location.reload();
                }
            }, 10000);
        },
        checkForSessionLink() {
            const sessionLink = Array.from(document.querySelectorAll('a')).find(a =>
                                                                                a.textContent.includes("Подключиться к сеансу"));

            if (sessionLink && sessionLink.href) {
                window.open(sessionLink.href, '_blank');
                this.stopAutoConnect();
            } else {
                this.resetReloadTimeout();
            }
        },

        handleHtml5ClientPage() {
            this.intervals.bbbButtonCheck = setInterval(() => {
                const joinButton = document.querySelector('button[aria-label="Только слушать"]');
                if (joinButton) {
                    joinButton.click();
                }

                const connectButton = document.querySelector('button[aria-label="Проиграть звук"]');
                if (connectButton) {
                    connectButton.click();
                    clearInterval(this.intervals.bbbButtonCheck);
                    this.intervals.bbbButtonCheck = null;
                }
            }, 2000);

            setTimeout(() => {
                if (this.intervals.bbbButtonCheck) {
                    clearInterval(this.intervals.bbbButtonCheck);
                    this.intervals.bbbButtonCheck = null;
                }
            }, 60000);
        },

        startAutoHello() {
            if (this.intervals.hello) return;
            this.flags.helloMessageSent = false;

            this.intervals.hello = setInterval(() => {
                if (this.flags.helloMessageSent) {
                    this.stopAutoHello();
                    return;
                }

                const greetings = ["здравствуйте", "здравстуйте", "добрый день", "доброе утро"];
                const pageText = document.body.innerText.toLowerCase();

                if (greetings.some(greet => pageText.includes(greet))) {
                    const messageInput = document.querySelector('#message-input');
                    const sendButton = document.querySelector('button[aria-label="Отправить сообщение"]');

                    if (messageInput && sendButton) {
                        const message = "Здравствуйте";

                        let reactProps = null;
                        try { reactProps = this.findReactProps(messageInput); } catch (e) {}

                        if (reactProps && reactProps.onChange) {
                            const syntheticEvent = { target: { value: message }, currentTarget: { value: message } };
                            reactProps.onChange(syntheticEvent);
                            sendButton.click();
                            this.flags.helloMessageSent = true;
                        } else {
                            messageInput.value = message;
                            messageInput.dispatchEvent(new Event('input', { bubbles: true }));
                            setTimeout(() => {
                                sendButton.click();
                                this.flags.helloMessageSent = true;
                            }, 100);
                        }
                    }
                }
            }, 2000);
        },
        stopAutoHello() {
            clearInterval(this.intervals.hello);
            this.intervals.hello = null;
        },
        findReactProps(dom) {
            for (const key in dom) {
                if (key.startsWith('__reactInternalInstance$') || key.startsWith('__reactFiber$')) {
                    let fiber = dom[key];
                    if (fiber.return) {
                        let current = fiber.return;
                        while(current) {
                            if (current.stateNode && current.stateNode.props) return current.stateNode.props;
                            current = current.return;
                        }
                    }
                    if (fiber._currentElement && fiber._currentElement._owner && fiber._currentElement._owner._instance) {
                        return fiber._currentElement._owner._instance.props;
                    }
                }
            }
            return null;
        },

        startAutoLeave() {
            if (this.intervals.leave) return;

            this.intervals.leave = setInterval(() => {
                this.checkLeaveText();
            }, 5000);
        },
        stopAutoLeave() {
            clearInterval(this.intervals.leave);
            this.intervals.leave = null;
        },
        disablePopups() {
            var beforeScript = document.createElement('script');
            beforeScript.textContent = `
        Window.prototype.addEventListener2 = Window.prototype.addEventListener;
        Window.prototype.addEventListener = function(type, listener, useCapture) {
            if (type != "beforeunload") {
                addEventListener2(type, listener, useCapture);
            }
        }
    `;
            (document.head||document.documentElement).insertBefore(beforeScript, (document.head||document.documentElement).firstChild);
            beforeScript.onload = function() {
                this.parentNode.removeChild(this);
            };

            var afterScript = document.createElement('script');
            afterScript.textContent = `
        function letmeout() {
            var all = document.getElementsByTagName("*");
            for (var i=0, max=all.length; i < max; i++) {
                if(all[i].getAttribute("onbeforeunload")) {
                    all[i].setAttribute("onbeforeunload", null);
                }
            }
            window.onbeforeunload = null;
        }
        letmeout();
        setInterval(letmeout, 500);
    `;
            (document.head||document.documentElement).appendChild(afterScript);
            afterScript.onload = function() {
                this.parentNode.removeChild(this);
            };
        },
        checkLeaveText() {
            var text = document.body.innerText.toLowerCase();
            if (text.includes('до свидания') || text.includes('досвидания')) {
                this.disablePopups();
                window.close();
            }
        },

        run(isConnectPage, isConferencePage) {
            this.initUI(isConnectPage, isConferencePage);

            if (isConnectPage && this.settings.autoConnect) {
                this.startAutoConnect();
            }
            if (isConferencePage) {
                this.handleHtml5ClientPage();
                if (this.settings.autoHello) this.startAutoHello();
                if (this.settings.autoLeave) this.startAutoLeave();
            }
        }
    };

    const AutoBRS = {
        settings: {
            enabled: GM_getValue(SETTINGS_KEYS.autoBRS, false)
        },
        intervals: {
            check: null
        },
        timeouts: {
            reload: null
        },
        buttonId: 'modalCurrentLessonForMarkButtonOK',
        toggleButtonId: 'toggleBRS',

        init() {
            this.insertToggleButton();
            if (this.settings.enabled) {
                this.start();
            }
        },
        insertToggleButton() {
            const navbar = document.querySelector('ul.navbar-nav.nav-tabs');
            if (!navbar || document.getElementById(this.toggleButtonId)) return;

            const navItem = document.createElement('li');
            navItem.className = 'nav-item moodle-autotool-nav-item';

            const toggleBtn = createToggleButton(
                this.toggleButtonId,
                'AutoBRS',
                SETTINGS_KEYS.autoBRS,
                this.settings.enabled,
                (enabled) => {
                    this.settings.enabled = enabled;
                    enabled ? this.start() : this.stop();
                }
            );
            toggleBtn.classList.add('nav-link');

            navItem.appendChild(toggleBtn);
            navbar.appendChild(navItem);
        },
        checkAndClick() {
            const button = document.getElementById(this.buttonId);
            if (button) {
                button.click();
            }
        },
        start() {
            if (this.intervals.check) return;
            this.settings.enabled = true;
            const toggleBtn = document.getElementById(this.toggleButtonId);
            if (toggleBtn && !toggleBtn.classList.contains('on')) {
                toggleBtn.classList.remove('off');
                toggleBtn.classList.add('on');
                toggleBtn.textContent = 'AutoBRS: ВКЛ';
            }

            this.intervals.check = setInterval(() => this.checkAndClick(), 1000);

            this.timeouts.reload = setTimeout(() => {
                if (this.settings.enabled && !document.getElementById(this.buttonId)) {
                    location.reload();
                }
            }, 10000);
        },
        stop() {
            clearInterval(this.intervals.check);
            clearTimeout(this.timeouts.reload);
            this.intervals.check = null;
            this.timeouts.reload = null;
            this.settings.enabled = false;
            const toggleBtn = document.getElementById(this.toggleButtonId);
            if (toggleBtn && !toggleBtn.classList.contains('off')) {
                toggleBtn.classList.remove('on');
                toggleBtn.classList.add('off');
                toggleBtn.textContent = 'AutoBRS: ВЫКЛ';
            }
        }
    };


    const AutoFAC = {
        interval: null,
        buttonSelector: '[aria-label="Проверка"]',

        init() {
            this.start();
        },
        autoClick() {
            const facButton = document.querySelector(this.buttonSelector);
            if (facButton) {
                facButton.click();
            }
        },
        start() {
            if (this.interval) return;
            this.interval = setInterval(() => this.autoClick(), 5000);
        },
        stop() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    };

    const AutoAttendance = {
        settings: {
            enabled: GM_getValue(SETTINGS_KEYS.autoAttendance, false)
        },
        intervals: {
            check: null
        },
        timeouts: {
            reload: null
        },
        toggleButtonId: 'toggleAttendance',

        init() {
            this.insertToggleButton();
            if (this.settings.enabled) {
                this.start();
            }
        },
        insertToggleButton() {
            const navBar = document.querySelector('ul.nav.nav-tabs');
            if (!navBar || document.getElementById(this.toggleButtonId)) return;

            const navItem = document.createElement('li');
            navItem.className = 'nav-item moodle-autotool-nav-item';

            const toggleBtn = createToggleButton(
                this.toggleButtonId,
                'AutoAttendance',
                SETTINGS_KEYS.autoAttendance,
                this.settings.enabled,
                (enabled) => {
                    this.settings.enabled = enabled;
                    enabled ? this.start() : this.stop();
                }
            );
            toggleBtn.classList.add('nav-link');

            navItem.appendChild(toggleBtn);
            navBar.appendChild(navItem);
        },
        processPage() {
            const submitButton = document.querySelector('input[type="submit"][value="Сохранить"].btn.btn-primary');

            if (submitButton) {
                const radioInput = document.querySelector('input[type="radio"].form-check-input[name="status"]');
                if (radioInput) {
                    radioInput.click();
                    submitButton.click();
                    this.stop();
                    return true;
                }
            } else {
                const attendanceTd = Array.from(document.querySelectorAll('td')).find(td => td.textContent.includes("Отметить свое присутствие"));

                if (attendanceTd) {
                    const attendanceLink = attendanceTd.querySelector('a');
                    if (attendanceLink) {
                        window.location.href = attendanceLink.href;
                        this.stop();
                        return true;
                    }
                } else {
                    if (this.settings.enabled && !this.timeouts.reload) {
                        this.timeouts.reload = setTimeout(() => {
                            location.reload();
                        }, 10000);
                    }
                }
            }
            return false;
        },
        start() {
            if (this.intervals.check) return;
            this.settings.enabled = true;
            const toggleBtn = document.getElementById(this.toggleButtonId);
            if (toggleBtn && !toggleBtn.classList.contains('on')) {
                toggleBtn.classList.remove('off');
                toggleBtn.classList.add('on');
                toggleBtn.textContent = 'AutoAttendance: ВКЛ';
            }

            if (this.processPage()) return;

            this.intervals.check = setInterval(() => {
                this.processPage();
            }, 1000);
        },
        stop() {
            clearInterval(this.intervals.check);
            clearTimeout(this.timeouts.reload);
            this.intervals.check = null;
            this.timeouts.reload = null;
            this.settings.enabled = false;
            const toggleBtn = document.getElementById(this.toggleButtonId);
            if (toggleBtn && !toggleBtn.classList.contains('off')) {
                toggleBtn.classList.remove('on');
                toggleBtn.classList.add('off');
                toggleBtn.textContent = 'AutoAttendance: ВЫКЛ';
            }
        }
    };

    function run() {
        const href = window.location.href;

        if (href.includes('/mod/bigbluebuttonbn/view.php')) {
            AutoTools.run(true, false);
        } else if (href.includes('/html5client/')) {
            AutoTools.run(false, true);
            AutoFAC.init();
        }
        else if (href.includes('/brs/att_marks_report_student/')) {
            AutoBRS.init();
        }
        else if (href.includes('/mod/attendance/')) {
            AutoAttendance.init();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

})();
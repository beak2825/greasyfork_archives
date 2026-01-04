// ==UserScript==
// @name         cvat_shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.08
// @description  CVAT Shorcuts
// @author       avd
// @match        http*://cvat:8080/*
// @match        http*://cvat-backup:8080/*
// @match        http://cvat.lastpassenger.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=honeycomb.vision
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523816/cvat_shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/523816/cvat_shortcuts.meta.js
// ==/UserScript==

(function () {
    const handleUrlChange = () => {
        if (window.location.href.includes("/tasks/") && window.location.href.includes("/jobs/")) {

            var observer

            function waitForElement(selector, callback) {
                const observer = new MutationObserver(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        observer.disconnect(); // Зупиняємо спостереження після знаходження елемента
                        callback(element); // Викликаємо функцію з елементом
                    }
                });

                // Налаштування для спостереження за змінами у DOM
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }

            function opacityToZero() {
                const slider = document.querySelector('.cvat-appearance-opacity-slider');
                const sliderHandle = slider.querySelector('.ant-slider-handle');
                sliderHandle.style.left = 0;

                // Створити подію миші (drag/drop)
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle.getBoundingClientRect().left,
                    clientY: sliderHandle.getBoundingClientRect().top,
                });

                const mouseMoveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle.getBoundingClientRect().left - 100, // Змістити на 100 пікселів
                    clientY: sliderHandle.getBoundingClientRect().top,
                });

                const mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle.getBoundingClientRect().left - 100,
                    clientY: sliderHandle.getBoundingClientRect().top,
                });

                // Відправити події
                sliderHandle.dispatchEvent(mouseDownEvent);
                sliderHandle.dispatchEvent(mouseMoveEvent);
                sliderHandle.dispatchEvent(mouseUpEvent);

                console.log(`Повзунок переміщено на 0`);

                const slider2 = document.querySelector('.cvat-appearance-selected-opacity-slider');
                const sliderHandle2 = slider2.querySelector('.ant-slider-handle');
                sliderHandle2.style.left = 0;

                // Створити подію миші (drag/drop)
                const mouseDownEvent2 = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle2.getBoundingClientRect().left,
                    clientY: sliderHandle2.getBoundingClientRect().top,
                });

                const mouseMoveEvent2 = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle2.getBoundingClientRect().left - 100, // Змістити на 100 пікселів
                    clientY: sliderHandle2.getBoundingClientRect().top,
                });

                const mouseUpEvent2 = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    clientX: sliderHandle2.getBoundingClientRect().left - 100,
                    clientY: sliderHandle2.getBoundingClientRect().top,
                });

                // Відправити події
                sliderHandle2.dispatchEvent(mouseDownEvent2);
                sliderHandle2.dispatchEvent(mouseMoveEvent2);
                sliderHandle2.dispatchEvent(mouseUpEvent2);

                console.log(`Повзунок переміщено на 0`);
            }

            // Initialize
            (function () {
                console.log("Виконуюсь перед завантаженням")
                waitForElement('[data-node-key="issues"]', (element) => {
                    console.log('Елемент знайдено:', element);
                    // Виконуємо певну дію
                    element.click();
                    opacityToZero();

                    const objects = document.querySelector('[data-node-key="objects"]');
                    setTimeout(() => {
                        objects.click();
                        console.log('Клік виконано');
                    }, 50);

                });

                let size_monitoring = true;

                // Enable disable size monitoring
                const toggleMonitoring = (event) => {
                    if (event.key === "F8") {
                        size_monitoring = !size_monitoring;
                        const addedText = document.createElement("span");
                        addedText.id = "small-shape-message";
                        addedText.textContent = `Size monitoring: ${size_monitoring ? "Enabled" : "Disabled"}`;
                        addedText.style.position = "fixed";
                        addedText.style.left = "10px";
                        addedText.style.top = "10px";
                        addedText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        addedText.style.color = "white";
                        addedText.style.fontSize = "120px";
                        addedText.style.zIndex = "1000";
                        document.body.appendChild(addedText);

                        setTimeout(() => {
                            addedText.remove();
                        }, 1500);
                    }
                };

                document.addEventListener("keydown", toggleMonitoring);

                if (!window.location.href.includes("lastpassenger")) {
                    const observer = new MutationObserver(() => {
                        if (!size_monitoring) return;

                        const shapes = document.querySelectorAll(".cvat_canvas_shape:not(.cvat_canvas_hidden)");

                        let foundSmallShape = false;
                        let messageContent = "";

                        shapes.forEach((shape) => {
                            const currentWidth = Math.round(parseFloat(shape.getAttribute("width")) || 0);
                            const currentHeight = Math.round(parseFloat(shape.getAttribute("height")) || 0);

                            if (currentWidth < 10 || currentHeight < 10) {
                                foundSmallShape = true;
                                messageContent = `${currentWidth} x ${currentHeight} --- RBA!!!`;
                            }
                        });

                        if (foundSmallShape) {
                            // Перевіряємо, чи вже є повідомлення на екрані
                            let existingMessage = document.getElementById("small-shape-message");
                            if (!existingMessage) {
                                // Створюємо повідомлення
                                const addedText = document.createElement("span");
                                addedText.id = "small-shape-message";
                                addedText.textContent = messageContent;
                                addedText.style.position = "fixed";
                                addedText.style.left = "10px";
                                addedText.style.top = "10px";
                                addedText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                                addedText.style.color = "red";
                                addedText.style.fontSize = "120px";
                                addedText.style.zIndex = "1000";
                                document.body.appendChild(addedText);

                                setTimeout(() => {
                                    addedText.remove();
                                }, 500);
                            }
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true });
                }
            })();

            document.addEventListener("keydown", function(e) {
                // Open task
                if (e.ctrlKey && e.shiftKey && e.code === "KeyS") {
                    e.preventDefault();

                    const currentUrl = window.location.href;
                    const newUrl = currentUrl.split('/jobs')[0];
                    const job_id = currentUrl.split('/jobs/')[1];
                    console.log(job_id);
                    localStorage.setItem('job_id', job_id);
                    window.location.href = newUrl;
                }

                // Change mode Standart and Review
                if (e.altKey && e.code === "KeyW") {
                    e.preventDefault();
                    const selectorDiv = document.querySelector(".ant-select-selector");
                    if (selectorDiv) {
                        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                        selectorDiv.dispatchEvent(mouseDownEvent);

                        setTimeout(() => {
                            const currentOption = selectorDiv.innerText.trim();
                            const targetOptionText = currentOption === "Review" ? "Standard" : "Review";
                            const targetOption = Array.from(document.querySelectorAll(".ant-select-item-option")).find(option => option.innerText.trim() === targetOptionText);

                            setTimeout(() => {
                                const issues = document.querySelector('[data-node-key="issues"]');
                                issues.click();
                                setTimeout(() => {
                                    const objects = document.querySelector('[data-node-key="objects"]');
                                    objects.click();
                                    console.log('Клік виконано');
                                }, 50);
                            }, 50);
                            targetOption.click();
                        }, 50);
                    }
                }

                // INFO
                if (e.key === "F3") {
                    e.preventDefault();
                    const button = document.querySelector(".cvat-annotation-header-info-button");
                    const panel = document.querySelector(".ant-modal-mask");

                    if (panel) {
                        const ok = Array.from(document.querySelectorAll("button"))
                        .find(btn => btn.innerText.trim() === "OK");
                        ok.click();
                    } else {
                        button.click()
                    }
                }

                // COPY OPF
                if (e.key === "F4") {
                    const button = document.querySelector(".cvat-annotation-header-info-button");
                    button.click()

                    setTimeout(() => {
                        const tableBody = document.querySelector(".ant-table-tbody");

                        const cells = tableBody.querySelectorAll(".ant-table-cell.ant-table-cell-fix-right");
                        const lastCell = cells[cells.length - 1];
                        const copyToClipboard = (text) => {
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            document.body.appendChild(textarea);
                            textarea.select();
                            try {
                                document.execCommand('copy');
                                console.log('Значення скопійовано в буфер обміну:', text);
                            } catch (err) {
                                console.error('Не вдалося скопіювати текст в буфер обміну:', err);
                            }
                            document.body.removeChild(textarea);
                        };

                        const cellValue = lastCell.innerText;
                        copyToClipboard(cellValue);
                        const ok = Array.from(document.querySelectorAll("button"))
                        .find(btn => btn.innerText.trim() === "OK");
                        ok.click();
                    }, 400);
                }

                // DESTROYED
                if (e.altKey && e.code === "KeyD") {
                    e.preventDefault();
                    const active_shape = document.querySelector(".cvat-objects-sidebar-state-active-item");
                    const flag = active_shape.querySelector(".ant-collapse-item-active");

                    if (!flag) {
                        const collapse = active_shape.querySelector(".ant-collapse-header");
                        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                        collapse.click();
                        setTimeout(() => {
                            const destroyed = active_shape.querySelector(".ant-checkbox-input");
                            destroyed.click();
                        }, 100);
                    } else {
                        const destroyed = active_shape.querySelector(".ant-checkbox-input");
                        destroyed.click();
                    }

                }

                // Box Size
                if (e.altKey && e.code === "KeyS") {
                    e.preventDefault();

                    const shapes = document.querySelectorAll(".cvat_canvas_shape:not(.cvat_canvas_hidden)");

                    shapes.forEach((shape) => {
                        // Отримуємо розміри shape
                        const currentWidth = Math.round(parseFloat(shape.getAttribute("width")) || 0);
                        const currentHeight = Math.round(parseFloat(shape.getAttribute("height")) || 0);

                        // Створюємо текстовий елемент
                        const addedText = document.createElement("span");
                        addedText.textContent = ` ${currentWidth} x ${currentHeight}`;
                        addedText.style.position = "absolute"; // Адаптуйте залежно від ваших стилів
                        addedText.style.left = `${shape.getBoundingClientRect().left + window.scrollX}px`;
                        addedText.style.top = `${shape.getBoundingClientRect().top + window.scrollY}px`;
                        addedText.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                        addedText.style.color = "white";
                        addedText.style.fontSize = "22px";
                        if (currentWidth < 10 || currentHeight < 10) {
                            addedText.style.color = "red";
                            addedText.style.fontSize = "32px";
                            addedText.textContent += ' RBA';
                        }

                        // Додаємо текст до документа
                        document.body.appendChild(addedText);

                        // Видаляємо текст через 2 секунди
                        setTimeout(() => {
                            addedText.remove();
                        }, 500);
                    });
                }

                // Keyframe on all boxes
                if (e.altKey && e.code === "KeyA") {
                    e.preventDefault();
                    const icons = document.querySelectorAll(".cvat-object-item-button-keyframe:not(.cvat-object-item-button-keyframe-enabled)");
                    console.log("fine")
                    icons.forEach(icon => {
                        icon.click();
                        console.log("click")
                    });
                }

                // Close all boxes
                if (e.code === "KeyX" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    const icons = document.querySelectorAll(".anticon-select");

                    icons.forEach(icon => {
                        icon.click();
                    });
                }

                // Open all boxes
                if (e.code === "KeyZ" && !e.ctrlKey && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
                    e.preventDefault();
                    const icons = document.querySelectorAll(".cvat-object-item-button-outside-enabled");

                    icons.forEach(icon => {
                        icon.click();
                    });
                }

                // Next issues
                if ((e.code === "Period" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.altKey && e.code === "KeyE" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA")) {
                    e.preventDefault();
                    const next_issues = document.querySelector(".cvat-issues-sidebar-next-frame");
                    next_issues.click();
                }

                // Previous issues
                if ((e.code === "Comma" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.altKey && e.code === "KeyQ" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA")) {
                    e.preventDefault();
                    const previous_issues = document.querySelector(".cvat-issues-sidebar-previous-frame");
                    previous_issues.click();
                }

                // Hide/Unhide issues
                if ((e.code === "Slash" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") || (e.altKey && e.code === "KeyR" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA")) {
                    e.preventDefault();

                    const hide_button = document.querySelector(".cvat-issues-sidebar-shown-issues");
                    const unhide_button = document.querySelector(".cvat-issues-sidebar-hidden-issues");
                    if (hide_button) {
                        hide_button.click();
                    } else {
                        unhide_button.click();
                    }
                }
            });

        } else if (window.location.href.includes("/tasks/") && !window.location.href.includes("/jobs/")) {

            document.addEventListener("keydown", function(e) {
                // Task status: completed || rejected
                if ((e.altKey && e.code === "KeyS") || (e.altKey && e.code === "KeyA")) {
                    const stage_text = 'acceptance'
                    var state_text = 'completed';
                    if (e.altKey && e.code === "KeyA") {
                        state_text = 'rejected';
                    }
                    e.preventDefault();
                    var stage = document.querySelector(".cvat-job-item-stage");
                    var state = document.querySelector(".cvat-job-item-state");

                    const job_id = localStorage.getItem('job_id');
                    console.log(job_id);
                    if (job_id != 0) {
                        console.log(job_id);
                        const job = document.querySelector(`div[data-row-id="${job_id}"]`);
                        stage = job.querySelector(".cvat-job-item-stage");
                        state = job.querySelector(".cvat-job-item-state");
                    }

                    const stageSelector = stage.querySelector(".ant-select-selector");
                    if (stageSelector) {
                        const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                        stageSelector.dispatchEvent(mouseDownEvent);

                        setTimeout(() => {
                            const targetOption = Array.from(document.querySelectorAll(".ant-select-item-option")).find(option => option.innerText.trim() === stage_text);
                            targetOption.click();
                        }, 50);
                    }

                    setTimeout(() => {
                        const stateSelector = state.querySelector(".ant-select-selector");
                        if (stateSelector) {
                            const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                            stateSelector.dispatchEvent(mouseDownEvent);

                            setTimeout(() => {
                                const targetOption = Array.from(document.querySelectorAll(".ant-select-item-option")).find(option => option.innerText.trim() === state_text);
                                targetOption.click();
                            }, 50);

                        }
                    }, 800);
                }
            });
        }
    };

    let lastUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            handleUrlChange();
        }
    }, 1000);

    handleUrlChange();
})();


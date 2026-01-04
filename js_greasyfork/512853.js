// ==UserScript==
// @name         FIXSIZE
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  FIX without fixsize dependency
// @author       You
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @match        *://*//Admin/MyCurrentTask/ChooseImage
// @match        *://*/Admin/MyCurrentTask/ChooseImage
// @match        *://*/Admin/MyCurrentTask/Active
// @match        *://*/Admin/PrefilterPictures*
// @match        *://*/Admin/Configuration/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512853/FIXSIZE.user.js
// @updateURL https://update.greasyfork.org/scripts/512853/FIXSIZE.meta.js
// ==/UserScript==

(function () {
    let initialCheckCompleted = false;
    let observer = null;

    console.log("Скрипт запущен!");

    function checkInitialFixedSize() {
        if (initialCheckCompleted) return;

        console.log("Проверяем наличие текста 'Fixed size:'...");

        const canvasElement = document.querySelector("#canvas");
        const inputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-value");

        if (canvasElement && canvasElement.textContent.includes("Fixed size:")) {
            console.log("Текст 'Fixed size:' найден");

            if (inputElement) {
                console.log(`Текущее значение: ${inputElement.value}`);

                if (inputElement.value === "0.1") {
                    console.log("Значение 0.1 — скрипт останавливается");
                    initialCheckCompleted = true;
                    return;
                }

                console.log("Значение НЕ 0.1 — изменяем стиль элемента");

                setTimeout(() => {
                    const targetElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(10) > p");

                    if (targetElement) {
                        targetElement.style.backgroundColor = "red";
                        targetElement.style.color = "white";
                        console.log("Стиль успешно изменён");
                    } else {
                        console.log("Элемент не найден");
                    }

                    updateValueAndClick(inputElement);
                    initialCheckCompleted = true;
                }, 100);
            }
        } else {
            console.log("Текст 'Fixed size:' НЕ найден, включаем наблюдатель");
            startObserver();
        }
    }

    function startObserver() {
        if (observer) return;

        observer = new MutationObserver(() => {
            console.log("Обнаружено изменение в DOM, проверяем заново...");
            const canvasElement = document.querySelector("#canvas");
            const inputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-value");

            if (canvasElement && canvasElement.textContent.includes("Fixed size:") && inputElement) {
                console.log("Текст 'Fixed size:' появился!");

                if (inputElement.value !== "0.1") {
                    console.log("Значение НЕ 0.1 — обновляем и кликаем");
                    updateValueAndClick(inputElement);
                } else {
                    console.log("Значение уже 0.1 — ничего не делаем");
                }

                observer.disconnect();
                initialCheckCompleted = true;
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        console.log("Наблюдатель запущен...");
    }

    function updateValueAndClick(inputElement) {
        console.log("Меняем значение на 0.1...");

        inputElement.value = "0.1";
        inputElement.dispatchEvent(new Event("input", { bubbles: true }));
        inputElement.dispatchEvent(new Event("change", { bubbles: true }));

        const visualInputElement = document.querySelector("#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(10) > span > input.combo-text.validatebox-text");
        if (visualInputElement) {
            console.log("Обновляем визуальное отображение...");
            visualInputElement.value = "0.1";
            visualInputElement.dispatchEvent(new Event("input", { bubbles: true }));
            visualInputElement.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function waitForCanvas() {
        console.log("Ждём появления #canvas...");

        const interval = setInterval(() => {
            if (document.querySelector("#canvas")) {
                console.log("#canvas найден, запускаем проверку!");
                clearInterval(interval);
                checkInitialFixedSize();
            }
        }, 500);
    }

    function waitForButtonAndClick() {
        const buttonSelector = "#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(2) > td:nth-child(5) > a";
        const button = document.querySelector(buttonSelector);

        if (button && button.classList.contains("convert-numbers-to-measure-btn-active")) {
            console.log("Класс активен, кликаем по кнопке...");
            button.click();
        } else {
            console.log("Ожидаем появления нужного класса на кнопке...");
            const buttonObserver = new MutationObserver(() => {
                if (button && button.classList.contains("convert-numbers-to-measure-btn-active")) {
                    console.log("Класс стал активным, кликаем по кнопке...");
                    button.click();
                    buttonObserver.disconnect();
                }
            });

            if (button) {
                buttonObserver.observe(button, { attributes: true, attributeFilter: ["class"] });
            }
        }
    }

    waitForCanvas();
    waitForButtonAndClick();
})();

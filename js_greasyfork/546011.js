// ==UserScript==
// @name         тачка бизнесмена
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  мы обязательно выживем
// @author       мемн
// @match        https://catwar.su/chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546011/%D1%82%D0%B0%D1%87%D0%BA%D0%B0%20%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%BC%D0%B5%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546011/%D1%82%D0%B0%D1%87%D0%BA%D0%B0%20%D0%B1%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%BC%D0%B5%D0%BD%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createNumberGuesserUI() {
        const container = document.createElement('div');
        container.id = 'catwar-guesser-container';
        container.style.position = 'fixed';
        container.style.bottom = '100px';
        container.style.right = '20px';
        container.style.backgroundColor = '#bbbbbb';
        container.style.border = '1px solid #ccc';
        container.style.borderRadius = '5px';
        container.style.padding = '10px';
        container.style.zIndex = '9999';
        container.style.cursor = 'move';
        container.style.userSelect = 'none';

        const title = document.createElement('h3');
        title.textContent = 'Угадай число (перетащи меня~)';
        title.style.marginTop = '0';
        title.style.cursor = 'move';
        container.appendChild(title);

        const inputContainer = document.createElement('div');
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        inputContainer.style.marginBottom = '10px';

        const numberInput = document.createElement('input');
        numberInput.type = 'text';
        numberInput.id = 'catwar-number-input';
        numberInput.placeholder = '0000000000';
        numberInput.value = '0000000000';
        numberInput.style.width = '150px';
        numberInput.style.textAlign = 'center';
        inputContainer.appendChild(numberInput);

        // Кнопка для минуса
        const minusToggle = document.createElement('button');
        minusToggle.textContent = '+/-';
        minusToggle.style.marginLeft = '5px';
        minusToggle.style.width = '40px';
        minusToggle.addEventListener('click', () => {
            let current = numberInput.value;
            if (current.startsWith('-')) {
                numberInput.value = current.substring(1);
            } else {
                numberInput.value = '-' + current;
            }
        });
        inputContainer.appendChild(minusToggle);

        // Кнопка очистки
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Очистить';
        clearButton.style.marginLeft = '5px';
        clearButton.addEventListener('click', () => {
            numberInput.value = '0000000000';
            for (let i = 0; i < 10; i++) {
                updateDigitDisplay(i, 0);
            }
        });
        inputContainer.appendChild(clearButton);

        container.appendChild(inputContainer);

        const digitControls = document.createElement('div');
        digitControls.style.display = 'flex';
        digitControls.style.flexDirection = 'column';
        digitControls.style.gap = '5px';

        for (let i = 0; i < 10; i++) {
            const digitRow = document.createElement('div');
            digitRow.style.display = 'flex';
            digitRow.style.gap = '5px';
            digitRow.style.alignItems = 'center';

            const digitLabel = document.createElement('span');
            digitLabel.textContent = `Цифра ${i}:`;
            digitLabel.style.width = '60px';
            digitRow.appendChild(digitLabel);

            const minusFiveBtn = document.createElement('button');
            minusFiveBtn.textContent = '-5';
            minusFiveBtn.style.width = '30px';
            minusFiveBtn.style.backgroundColor = '#ffcccc';
            minusFiveBtn.addEventListener('click', () => adjustDigit(i, -5, numberInput));
            digitRow.appendChild(minusFiveBtn);

            const minusTwoBtn = document.createElement('button');
            minusTwoBtn.textContent = '-2';
            minusTwoBtn.style.width = '30px';
            minusTwoBtn.addEventListener('click', () => adjustDigit(i, -2, numberInput));
            digitRow.appendChild(minusTwoBtn);

            const minusOneBtn = document.createElement('button');
            minusOneBtn.textContent = '-1';
            minusOneBtn.style.width = '30px';
            minusOneBtn.addEventListener('click', () => adjustDigit(i, -1, numberInput));
            digitRow.appendChild(minusOneBtn);

            const digitValue = document.createElement('span');
            digitValue.textContent = '0';
            digitValue.style.width = '20px';
            digitValue.style.textAlign = 'center';
            digitValue.id = `digit-${i}`;
            digitRow.appendChild(digitValue);

            const plusOneBtn = document.createElement('button');
            plusOneBtn.textContent = '+1';
            plusOneBtn.style.width = '30px';
            plusOneBtn.addEventListener('click', () => adjustDigit(i, 1, numberInput));
            digitRow.appendChild(plusOneBtn);

            const plusTwoBtn = document.createElement('button');
            plusTwoBtn.textContent = '+2';
            plusTwoBtn.style.width = '30px';
            plusTwoBtn.addEventListener('click', () => adjustDigit(i, 2, numberInput));
            digitRow.appendChild(plusTwoBtn);

            const plusFiveBtn = document.createElement('button');
            plusFiveBtn.textContent = '+5';
            plusFiveBtn.style.width = '30px';
            plusFiveBtn.style.backgroundColor = '#ccffcc';
            plusFiveBtn.addEventListener('click', () => adjustDigit(i, 5, numberInput));
            digitRow.appendChild(plusFiveBtn);

            digitControls.appendChild(digitRow);
        }

        container.appendChild(digitControls);

        const sendButton = document.createElement('button');
        sendButton.textContent = 'Отправить (/number X)';
        sendButton.style.marginTop = '10px';
        sendButton.style.width = '100%';
        sendButton.addEventListener('click', () => {
            sendNumber(numberInput.value);
            clickSiteSubmitButton();
        });
        container.appendChild(sendButton);

        document.body.appendChild(container);
        makeDraggable(container, title);
    }

    function clickSiteSubmitButton() {
        const submitButton = document.querySelector('input[type="submit"][id="mess_submit"]');
        if (submitButton) {
            submitButton.click();
        } else {
            console.log('Кнопка отправки не найдена');
        }
    }

    function makeDraggable(container, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            container.style.top = (container.offsetTop - pos2) + "px";
            container.style.right = "unset";
            container.style.left = (container.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function adjustDigit(position, delta, input) {
        let currentValue = input.value.replace('-', '');
        currentValue = currentValue.padEnd(10, '0').slice(0, 10);
        let digits = currentValue.split('');

        let digit = parseInt(digits[position]) || 0;
        digit = (digit + delta + 10) % 10;
        digits[position] = digit.toString();

        const newValue = digits.join('');
        input.value = (input.value.startsWith('-') ? '-' : '') + newValue;
        updateDigitDisplay(position, digit);
    }

    function updateDigitDisplay(position, value) {
        const digitElement = document.getElementById(`digit-${position}`);
        if (digitElement) {
            digitElement.textContent = value;
        }
    }

    function sendNumber(number) {
        const chatInput = document.getElementById('mess');
        if (chatInput) {
            chatInput.innerHTML = `/number ${number.replace(/\s+/g, '')}`;
            const inputEvent = new Event('input', { bubbles: true });
            chatInput.dispatchEvent(inputEvent);
            chatInput.focus();
        }
    }

    setTimeout(createNumberGuesserUI, 1000);
})();
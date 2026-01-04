// ==UserScript==
// @name         Megamarket Calculate Bonus Total and Update Balance
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Calculate total sum of bonus amounts and update balance on button click
// @author       You
// @match        https://megamarket.ru/personal/loyalty
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=megamarket.ru
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489914/Megamarket%20Calculate%20Bonus%20Total%20and%20Update%20Balance.user.js
// @updateURL https://update.greasyfork.org/scripts/489914/Megamarket%20Calculate%20Bonus%20Total%20and%20Update%20Balance.meta.js
// ==/UserScript==

// Функция для создания элемента span с классом recalculated-bonus-amount и обновления его содержимого
function createAndRefreshBonusAmount() {
    // Создаем новый элемент для отображения суммы
    const newBalanceElement = document.createElement('span');
    newBalanceElement.classList.add('recalculated-bonus-amount');

    // Находим элемент ".profile-loyalty__balance-wrapper"
    const balanceWrapper = document.querySelector('.profile-loyalty__balance-wrapper');
    if (balanceWrapper) {
        // Вставляем новый элемент после элемента баланса
        balanceWrapper.appendChild(newBalanceElement);
    }

    // Обновляем содержимое нового элемента
    recalculateBonusAmount();
}

// Функция для пересчета суммы и обновления баланса
function recalculateBonusAmount() {
    // Находим все элементы с классом ".bonus-transaction-item__transaction-value_pending"
    const bonusAmounts = document.querySelectorAll('.bonus-transaction-item__transaction-value.bonus-transaction-item__transaction-value_pending');
    // Инициализируем переменную для хранения суммы
    let totalSum = 0;
    // Проходимся по каждому элементу и суммируем их значения
    bonusAmounts.forEach(element => {
        const amount = parseFloat(element.textContent.trim().replace(/[^\d.-]+/g, ''));
        if (!isNaN(amount)) {
            totalSum += amount;
        }
    });

    let newTotal = 0;
    // Находим элемент с классом recalculated-bonus-amount
    const balanceElement = document.querySelector('.profile-loyalty__balance-value');
    if (balanceElement) {
        const currentBalance = parseFloat(balanceElement.textContent.trim().replace(/[^\d.-]+/g, ''));
        newTotal = totalSum + currentBalance; // Обновляем значение переменной newTotal
    }

    const recalculatedBonusAmountElement = document.querySelector('.recalculated-bonus-amount');
    if (recalculatedBonusAmountElement) {
        recalculatedBonusAmountElement.textContent = `+${totalSum.toLocaleString()} (Сумма: ${newTotal.toLocaleString()})`; // Обновляем содержимое элемента
    }
}


// Создаем кнопку "Пересчитать"
const recalculateButton = document.createElement('button');
recalculateButton.textContent = 'Пересчитать';
recalculateButton.classList.add('recalculate-btn');
recalculateButton.addEventListener('click', recalculateBonusAmount);

// Находим элемент ".profile-loyalty__balance-wrapper" и добавляем кнопку после него
window.addEventListener('load', function() {
    setTimeout(() => {
        const balanceWrapper = document.querySelector('.profile-loyalty__balance-wrapper .profile-loyalty__balance');
        if (balanceWrapper) {
            balanceWrapper.insertAdjacentElement('afterend', recalculateButton);
        }
        createAndRefreshBonusAmount();
    }, 1000);
});


// Создаем стиль для кнопки
const buttonStyle = document.createElement('style');
buttonStyle.textContent = `
    button.recalculate-btn {
        display: inline-block;
        width: 120px;
        height: 36px;
        font-family: SB Sans Text, sans-serif;
        font-size: 14px;
        letter-spacing: -.02em;
        line-height: 20px;
        color: #fff;
        border: 1px solid #58df79;
        border-radius: 30px;
        background-color: #58df79;
        margin-left: 20px;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        cursor: pointer;
    }

    button.recalculate-btn:hover {
        background-color: #d4ffde;
        color: #58df79;
    }
    .recalculated-bonus-amount {
        --mixin-calculated-line-height: 20px;
        color: var(--pui-text-primary);
        font-family: SB Sans Display, sans-serif;
        font-family: SB Sans Text, sans-serif;
        font-size: 20px;
        font-weight: 600;
        letter-spacing: normal;
        line-height: 20px;
        margin-left: 10px;
    }
`;

// Добавляем стиль в head документа
document.head.appendChild(buttonStyle);

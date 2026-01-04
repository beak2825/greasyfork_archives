// ==UserScript==
// @name         ЗП
// @description  Подсчет ЗП
// @namespace    idk, idc
// @version      3.5
// @author       Yevhenii Sirenko
// @match        https://tracker.redpilotstudio.com/*
// @run-at       document-start
// @license      All Rights Reserved
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463700/%D0%97%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/463700/%D0%97%D0%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Загрузка ставки или установка значения по умолчанию
    let salaryRate = GM_getValue('salaryRate', 0);

    // Изменение ставки зарплаты с помощью prompt
    function changeSalaryRate() {
        let newRate = prompt('Введите ставку:', salaryRate);
        if (newRate !== null && !isNaN(parseFloat(newRate))) {
            salaryRate = parseFloat(newRate);
            GM_setValue('salaryRate', salaryRate);
            alert('Новая ставка сохранена: ' + salaryRate);
        } else {
            alert('Введите корректное число.');
        }
    }

    // Добавление кнопки для изменения ставки зарплаты
    let changeRateButton = document.createElement('button');
    changeRateButton.textContent = 'Изменить ставку';
    changeRateButton.style.position = 'fixed';
    changeRateButton.style.top = '10px';
    changeRateButton.style.right = '50px';
    changeRateButton.style.zIndex = '9999';
    changeRateButton.onclick = changeSalaryRate;
    document.body.appendChild(changeRateButton);

    let hours_in_month = 100;
    const hoursData = {
        '2022': [159, 160, 175, 168, 159, 176, 168, 184, 176, 168, 168, 176],
        '2023': [167, 160, 175, 160, 160, 176, 160, 184, 168, 176, 168, 160],
        '2024': [144, 168, 159, 175, 158, 160, 175, 176, 168, 184, 159, 166],
        '2025': [144, 160, 168, 168, 160, 168, 176, 168, 176, 184, 152, 176],
    };

    function getHoursInMonth(year, month) {
        return hoursData[year] ? hoursData[year][month] : 100; // Default to 100 if year not found
    }

    function get_ZP(hours, hoursInMonth, stavka) {
        return ((stavka / hoursInMonth) * hours);// * 1.035;
    }
    
    function calculate_ZP() {
        const getTotalHours = (id1, id2) => {
            const total_all_hour = parseInt($(id1).html($(id1).data('hour-total-def'))[0].innerText);
            const total_all_minutes = parseInt($(id2).html($(id2).data('minutes-total'))[0].innerText);
            return total_all_hour + total_all_minutes / 60.0;
        };
    
        const total_hours_approve = getTotalHours('#hour-total-all', '#minutes-total-total-all');
        const total_hours = getTotalHours('#hour-total-all-approve', '#minutes-total-total-all-approve');
    
        const td_elements = document.getElementById("w0").getElementsByTagName("TD");
        const table_last_td = td_elements[td_elements.length - 1];
    
        const zp = (h) => get_ZP(h, hours_in_month, salaryRate).toFixed(2);
        table_last_td.innerHTML = `Зарплата: ${zp(total_hours_approve)}$/${zp(total_hours)}$ (${zp(hours_in_month)}$ ≈ ${(zp(hours_in_month) / hours_in_month * 8).toFixed(2)}$ QD)`;
    
        table_last_td.style["textAlign"] = "center";
        table_last_td.style["font-weight"] = "bold";
        table_last_td.style["verticalAlign"] = "middle";
        
        //Незнаю точно ли оно работает но по идее работает
        const adjustFontSize = (element) => {
            const maxFontSize = 16; // Maximum font size in pixels
            const minFontSize = 10; // Minimum font size in pixels
            const contentLength = element.innerText.length;
            const baseLength = 50; // Adjust this base length as needed

            // Calculate new font size
            let newFontSize = maxFontSize - (contentLength - baseLength) * 0.2;
            newFontSize = Math.max(minFontSize, Math.min(maxFontSize, newFontSize))*0.9;

            element.style.fontSize = `${newFontSize}px`;
        };

        adjustFontSize(table_last_td);
        
        var new_td = document.createElement("TD");
        new_td.setAttribute("colspan", "2");
        new_td.style["textAlign"] = "center";
        new_td.style["font-weight"] = "bold";
        new_td.style["vertical-align"] = "middle";
        new_td.innerHTML = `Часов в этом месяце: ${hours_in_month}`;
        table_last_td.parentNode.appendChild(new_td);
    }

    document.addEventListener("DOMContentLoaded", function() {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        let previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        hours_in_month = getHoursInMonth(currentYear, currentMonth);

        if (document.getElementById("daterange-btn").getElementsByTagName("SPAN")[0].innerHTML == 'Предыдущий месяц') {
            hours_in_month = getHoursInMonth(previousYear, previousMonth);
            console.log("Change hours in month: " + hours_in_month);
        }
       
        calculate_ZP();
    });
})();
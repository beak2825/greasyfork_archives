// ==UserScript==
// @name         Corp QS - Мой заработок
// @namespace    https://greasyfork.org/ru/scripts/369474-corp-qs-%D0%BC%D0%BE%D0%B9-%D0%B7%D0%B0%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BE%D0%BA
// @version      1.0.3
// @description  Count Fee for "Qsoft, LLC" co-workers
// @author       Alex Yashin
// @resource     https://code.jquery.com/jquery-3.3.1.min.js
// @match        http://www.corp.qsoft.ru/bitrix/admin/myhours.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369474/Corp%20QS%20-%20%D0%9C%D0%BE%D0%B9%20%D0%B7%D0%B0%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BE%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/369474/Corp%20QS%20-%20%D0%9C%D0%BE%D0%B9%20%D0%B7%D0%B0%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D0%BE%D0%BA.meta.js
// ==/UserScript==

const LANG = {
    MONTH_FEE_PROMPT: 'Ваш месячный заработок (число)',
    TOTAL: 'К выплате',
    BUTTON_SIGN_1: ' р/мес (',
    BUTTON_SIGN_2: ' р/час)'
};

(function() {
    if ( ! localStorage['yourMonthFee']) {
        localStorage.yourMonthFee = parseInt(window.prompt(LANG.MONTH_FEE_PROMPT, ''));
    }

    const FEE_PER_MONTH = localStorage.yourMonthFee;

    // firstly we'll find fee per hour

    let currentMonth = $('select#month').val() - 1;
    let nextMonth = currentMonth + 1;
    while (nextMonth > 12) nextMonth -= 12;
    let hourTable = $('table.qsoft_base_table')[1];
    let currentMonthWorkingHours = $($(hourTable).find('tr')[4]).find('td')[currentMonth].innerHTML;

    const FEE_PER_HOUR = FEE_PER_MONTH / currentMonthWorkingHours;

    // then we'll count fee per each day

    let table = $('#qsoft_base_table_right').children('table.qsoft_base_table');
    let fieldsContainer = $(table).find('tr')[1];
    let costContainer = $(table).find('tr')[2];

    let payment = 0;
    let totalPayment = 0;
    let avansPayment = 0;

    $.each(
        $(fieldsContainer).find('td'),
        function(i, item) {
            if (
                i != $(fieldsContainer).find('td').length
                && i != $(fieldsContainer).find('td').length - 1
            ) {
                let time = item.innerHTML.split(':');
                let timeInHour = parseInt(time[0]) + (1 / 60 * parseInt(time[1]));
                if ( ! isNaN(timeInHour)) {
                    let dayFee = FEE_PER_HOUR * timeInHour;
                    if ($(item).css('background-color') == 'rgb(255, 221, 142)') {
                        dayFee *= 1.5;
                        // alert(dayFee);
                    }
                    // alert ($(item).css('background-color'));
                    payment += dayFee;
                    totalPayment += dayFee;
                    $(costContainer).find('td')[i].innerHTML = dayFee.toFixed(2);
                }
            }
            if (i == 14) {
                if (payment > (FEE_PER_MONTH / 2)) {
                    avansPayment = payment - (FEE_PER_MONTH / 2);
                    payment = (FEE_PER_MONTH / 2);
                }
                $(costContainer).find('td')[i].innerHTML += '<br>' + LANG.TOTAL + ' 25.' + (currentMonth+1) + ': ' + payment.toFixed(2);
                payment = 0;
            }
            if (i == $(fieldsContainer).find('td').length - 2) {
                payment = (+payment) + (+avansPayment);
                $(costContainer).find('td')[i].innerHTML += '<br>' + LANG.TOTAL + ' 10.' + (nextMonth+1) + ': ' + payment.toFixed(2);
            }
            if (i == $(fieldsContainer).find('td').length - 1) {
                $(costContainer).find('td')[i].innerHTML += totalPayment.toFixed(2);
            }
        }
    );

    // add button to change month fee

    let button = document.createElement('button');
    button.innerHTML = FEE_PER_MONTH + LANG.BUTTON_SIGN_1 + FEE_PER_HOUR.toFixed(2) + LANG.BUTTON_SIGN_2;
    button.onclick = function() {
        localStorage.yourMonthFee = parseInt(window.prompt(LANG.MONTH_FEE_PROMPT, ''));
        location.reload();
    };

    $('select#month').parents('div')[0].appendChild(button);
})();
// ==UserScript==
// @name         date for ozon.card points ozon.ru - get true 
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ату начисления баллов (+14 дней) по карте озона Добавляет в таблицу столбик, который показывает фактическую
// @author       Fedor Mayorov
// @match        https://www.ozon.ru/my/points/?tab=card
// @grant        none
// @require https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/423901/date%20for%20ozoncard%20points%20ozonru%20-%20get%20true.user.js
// @updateURL https://update.greasyfork.org/scripts/423901/date%20for%20ozoncard%20points%20ozonru%20-%20get%20true.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    let month = {
        'января' : "01",
        'февраля' : "02",
        'марта' : "03",
        'апреля' : "04",
        'мая' : "05",
        'июня' : "06",
        'июля' : "07",
        'августа' : "08",
        'сентября' : "09",
        'октября' : "10",
        'ноября' : "11",
        'декабря' : "12"
    };
    Date.prototype.addDays = function(days) {
        let date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    Date.prototype.getFormated = function() {
        let date = new Date(this.valueOf());
        return ('0' + date.getDate()).slice(-2) + '.' + ("0" + (date.getMonth() + 1)).slice(-2) + '.' + date.getFullYear();
    }
    $(document).on('click', '*[data-widget="weboperations"]', function(){
        let th = $("th:contains('Дата и время')");
        $(th).parents('tr').find('th:nth-child(4)').remove();
        $(th).parents('tr').find('th:nth-child(3)').after($(th).clone().text('Начислят'))
        $('*[data-widget="weboperations"]').find("tbody > tr").each(function(){
            let data = $(this).find('td:nth-child(1)').text().split(" ");
            let strDate = '';
            if(data[2] === 'в') {
                strDate += (new Date().getFullYear());
            } else {
                strDate += data[2];
            }
            strDate += '/' + month[data[1]] + '/' + data[0];
            let newDate = (new Date(strDate)).addDays(14);
            let html = '';
            if (newDate > (new Date())) {
                html = '<span style="color: red">' + newDate.getFormated() + '</span>';
            } else {
                html = newDate.getFormated();
            }
            $(this).find('td:nth-child(4)').remove();
            $(this).find('td:nth-child(3)').after($(this).find('td:nth-child(3)').clone().html('<td>' + html + '</td>'))
        })
    })
})();
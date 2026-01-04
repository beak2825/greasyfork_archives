// ==UserScript==
// @name           Victory: Требуемая ЗП
// @author         BioHazard
// @version        1.00
// @namespace      Victory
// @description    На странице Управление->персонал массовая установка ЗП согласно требованиям (+10% в текущем варианте)
// @include        /^http.://virtonomica\.ru/\w+/main/company/view/\d+/unit_list/employee/salary$/
// @downloadURL https://update.greasyfork.org/scripts/406991/Victory%3A%20%D0%A2%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D0%BC%D0%B0%D1%8F%20%D0%97%D0%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/406991/Victory%3A%20%D0%A2%D1%80%D0%B5%D0%B1%D1%83%D0%B5%D0%BC%D0%B0%D1%8F%20%D0%97%D0%9F.meta.js
// ==/UserScript==

"use strict";
let citySalary, lvlReq, cityEducation, currentLvl, currentSalary, base, val, employeeCount;

$('<button>Требуемая ЗП</button>').appendTo('#subscribeForm').click(function () {
    //получаем массив с айдишками всех предприятий на странице
    $('input[id^=unit_]:not([id^=unit_holiday])').each(function (i,item) {

        new Promise(function (resolve) {
            $.getJSON('https://virtonomica.ru/api/olga/main/unit/summary?id='+$(item).attr('id').match(/\d+/)[0], function(data){ //id подразделения нужно брать из массива arr
                resolve(data);
            })
        }).then(function (data) {
            citySalary = data['city_salary'];
            lvlReq = data['employee_level_required'];
            cityEducation = data['city_education'];
            currentLvl = data['employee_level'];
            currentSalary = data['employee_salary'];
            employeeCount = data['employee_count'];

            if ( currentSalary/citySalary < 1) {
                base = (currentLvl/Math.pow(currentSalary/citySalary,2)) ;
                val = Math.sqrt(lvlReq/base)*citySalary;

                // если зарплата превысила среднюю
                if ( val / citySalary > 1) {
                    base = base / cityEducation;
                    base = 2 * Math.pow(0.5, base);
                    val = (Math.pow(2, lvlReq/cityEducation)*base - 1)*citySalary ;
                }
            }
            else {
                base = (currentSalary/citySalary+1)/Math.pow(2, currentLvl/cityEducation);
                val = (Math.pow(2, lvlReq/cityEducation)*base - 1)*citySalary ;

                // если зарплата стала меньше средней
                if ( val / citySalary < 1) {
                    base = cityEducation * Math.log(base/2)/ Math.log(0.5);
                    val = Math.sqrt(lvlReq/base)*citySalary;
                }
            }
            //использовать val для установки ЗП (не забыть округлить вверх)
            $.ajax({
                url: 'https://virtonomica.ru/olga/window/unit/employees/engage/'+$(item).attr('id').match(/\d+/)[0],
                type: 'post',
                data: {'unitEmployeesData[quantity]':employeeCount,
                    'unitEmployeesData[salary]':roundSalary(val)*1.01} //1.01 - коэффициент увеличения ЗП
            });
        });
    });
    return false;
});


// "округляем" зарплату на 1 сотую вверх
function roundSalary(val) {
    return (Math.ceil(val*10))/10;
}
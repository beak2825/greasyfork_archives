// ==UserScript==
// @name omgtu-auto-schedule
// @description Автоматически загружает последнее открытое расписание на сайте www.omgtu.ru
// @author Савкин Владимир
// @license MIT
// @version 2.2.2.6
// @include http*://www.omgtu.ru/students/temp*/
// @include http*://omgtu.ru/students/temp*/
// @namespace https://greasyfork.org/users/64313
// @downloadURL https://update.greasyfork.org/scripts/22983/omgtu-auto-schedule.user.js
// @updateURL https://update.greasyfork.org/scripts/22983/omgtu-auto-schedule.meta.js
// ==/UserScript==

(function (window, undefined) {
    var w;
    
    if (typeof unsafeWindow !== undefined) w = unsafeWindow;
    else w = window;

    if (w.self != w.top)  return;

    if (/http*:\/\/www.omgtu.ru\/students\/temp*/.test(w.location.href)) run();
    if (/http*:\/\/omgtu.ru\/students\/temp*/.test(w.location.href)) run();
    
})(window);

//Загрузка расписания по нажатию на "ФАКУЛЬТЕТЫ И ГРУППЫ"
$('#skey_g').click(function (){ run(); });

//Сохранение параметров при изменении значения поля 'Факультет'
$('#faculty_list').change(function(){
   save_values();
});

//Сохранение параметров при изменении значения поля 'Курс'
$("input[name='filter[course]']").change(function(){
    save_values();
});

//Сохранение параметров при изменении значения поля 'Группа'
$('#group_list').change(function(){
    save_values();
});

function save_values() {
    var ScheduleValue = {
        facultyText :  $('#faculty_list option:selected').text(),
        course : $("input[name='filter[course]']:checked", '#schedule').val(),
        groupText : $('#group_list option:selected').text()      
    }
    var ScheduleData = JSON.stringify(ScheduleValue);    
    localStorage.ScheduleData = ScheduleData;
    
    console.log("Сохранение");
    console.log(ScheduleValue.facultyText);
    console.log(ScheduleValue.course);
    console.log(ScheduleValue.groupText);
} 

function run() {
    if(isRealValue(localStorage.getItem('ScheduleData'))) {
        set_values(); //Выставление предыдущих выбраных значений
        var data = $('#schedule').serialize();
        update_schedule(data); //Закгруска рассписания
    }
}

function isRealValue(obj)
{
 return obj && obj !== 'null' && obj !== 'undefined';
}

function update_schedule(data) {
    var url = $('#schedule').attr("action");
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        dataType: 'json',
        success: function(data) {
            if (data.success) {
                $('#weekpicker-container').show();
                $('#schedule-list').html($($.trim(data.html)).find("#schedule-list").html());
            }
        },
    });
}

function set_values() {  
    try {
         var ScheduleData = JSON.parse(localStorage.ScheduleData);
         var facultyText = ScheduleData.facultyText,
        course      = ScheduleData.course - 1,
        groupText   = ScheduleData.groupText;
        
        $("#faculty_list option").each(function() {
            if($(this).text() == facultyText)
                $(this).attr('selected', 'selected');  
        });
    
        $("input:radio[name='filter[course]']:nth("+ course +")").attr('checked',true);
   
        $("#group_list option").each(function() {
             if($(this).text() == groupText)
                 $(this).attr('selected', 'selected');            
        });
        console.log("Подстановка значений")
        console.log(facultyText);
        console.log(course + 1);
        console.log(groupText);  
    } catch (err) {
        console.log("Произошла ошибка. Пожалуйста выберите поля заного.");
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function getUrlParameter(sParam, url) {
    var sPageURL = url,
        sURLVariables = sPageURL.split('&'),
        sParameterName, i;
//ToDo: Придумать как по другому игнорировать повторяющиеся атрибуты
       for (i = sURLVariables.length - 1; i > 0; i--) {
         sParameterName = sURLVariables[i].split('=');

         if (sParameterName[0] == sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
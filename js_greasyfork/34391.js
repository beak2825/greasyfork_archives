// ==UserScript==
// @name        mouse hover select by ctsigma
// @namespace   https://virtonomica.ru/vera/main/globalreport/marketing/by_trade_at_cities
// @description mouse hover select
// @include     https://virtonomic*.*/*/main/company/view/*/unit_list/animals
// @include     https://virtonomic*.*/*/main/company/view/*/unit_list/employee
// @include     https://virtonomic*.*/*/main/company/view/*/unit_list/employee/salary
// @include     https://virtonomic*.*/*/main/company/view/*/unit_list/employee/holiday
// @include     https://virtonomic*.*/*/main/company/view/*/unit_list/equipment
// @include     https://virtonomic*.*/*/main/company/view/*/unit_list/technology/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34391/mouse%20hover%20select%20by%20ctsigma.user.js
// @updateURL https://update.greasyfork.org/scripts/34391/mouse%20hover%20select%20by%20ctsigma.meta.js
// ==/UserScript==

var run = function() {
    var new_selectAllUnits= function(){
        var selectAllUnits_old = selectAllUnits;
        selectAllUnits = function (oCheckbox){
            var recalcSalary = $('#recalcSalary').prop('checked');
            var setPrice = $('#setPrice').prop('checked');
            var recalcPrice = $('#recalcPrice').prop('checked');
            var showInfo = $('#showInfo').prop('checked');
            //		checkUncheckFormCheckbox(oCheckbox.form, oCheckbox.checked, oCheckbox, true);
            selectAllUnits_old(oCheckbox);
            $('table.list>tbody>tr[style="display: none;"]').each(function(){ //Отключим скрытые
                $('td:eq(0)>input',this).attr("checked",false);
            });
            $('#recalcSalary').attr('checked',recalcSalary);
            $('#setPrice').attr("checked",setPrice);
            $('#recalcPrice').attr("checked",recalcPrice);
            $('#showInfo').attr("checked",showInfo);
        };
        getHiddenValue = function(id,name){
            var e=document.getElementById(name + '_' + id);
            if (e!==null) {return e.value;}
            return 0;
        };
    };
    window.onload = new_selectAllUnits;

$('table.list>tbody>tr:gt(0):has(:checkbox)').each(function(){$('td:eq(0)>input',this).attr('class','selectable_checkbox');});
var clicking = false;
var gCheckbox = false;
$('.selectable_checkbox').mousedown(function(){
clicking = true;
gCheckbox = typeof($(this).attr('checked')) != 'undefined'?false:true;
});
$(document).mouseup(function(){
    clicking = false;
buttons = document.getElementsByName('holiday');
for (i = 0; i < buttons.length; i++) {
    if ($('.list input:checked').length>0) buttonEnabled(buttons[i]); // разлочим кнопку "отпуск"
    else buttonDisabled(buttons[i]);
}


});
$('.selectable_checkbox').parent().hover(function(){
    if(clicking === false) return;
    // Mouse click + moving logic here
    $('input',this).attr('checked',gCheckbox);
    selectUnit(document.getElementById($('.selectable_checkbox:eq(0)').attr('id')));
});
//if ($('.list input:checked').length>0){ // разлочим кнопку "отпуск"
//    alert(1);
//    buttonEnabled($('input[name="holiday"]')[0]);
//}
//    else buttonDisabled($('input[name="holiday"]')[0]);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
// ==UserScript==
// @name           Всё "по Требованию" в старом интерфейсе
// @namespace      virtonomica
// @description    Все заказы выставляются по продажам
// @version        1.00
// @include       http*://*virtonomic*.*/*/main/unit/view/*/supply*
// @grant       none

// @downloadURL https://update.greasyfork.org/scripts/459253/%D0%92%D1%81%D1%91%20%22%D0%BF%D0%BE%20%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8E%22%20%D0%B2%20%D1%81%D1%82%D0%B0%D1%80%D0%BE%D0%BC%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/459253/%D0%92%D1%81%D1%91%20%22%D0%BF%D0%BE%20%D0%A2%D1%80%D0%B5%D0%B1%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8E%22%20%D0%B2%20%D1%81%D1%82%D0%B0%D1%80%D0%BE%D0%BC%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B5.meta.js
// ==/UserScript==
var run = function(){

    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    var BtnSet = $('<input type="button" value="Заказать" title="Установить объем контрактов в зависимости от продаж"/>').click(function() {
        SetContractData();

    });
    var panel = $('div.metro_header');
    panel.append($('<table><tr>').append('<td>').append(BtnSet));


    function SetContractData(){
        $('.list .product_row').each(function(){
            var vol=$('.nowrap',this)[6].firstChild.data.replace(/ /g,'') ;
            $('input[name^="supplyContractData[party_quantity]"]',this).val(vol);

        })
        $("input[name='applyChanges']").click();

    }

};


/* для нового дизайна в разработке

$('#materials-main .materials-cards').each(function(){
    $('.set-quantity',this).click();

})

//"сохранить изменения" в новом дизайне
$('button[class="btn btn-circle btn-success btn-saveall pull-right"]').click();
*/


if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
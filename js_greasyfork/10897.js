// ==UserScript==
// @name        iks:virtonomica Заметки
// @namespace   virtonomica
// @description Перенос заметок на верх или вниз страницы. Используйте тег [br] для для переноса на новую строку.
// @include     http*://*virtonomica*.*/*/main/company/view/*/unit_list
// @include     http*://*virtonomic*.*/*/main/unit/view/*
// @exclude     http*://*virtonomic*.*/*/main/unit/view/*/supply
// @exclude     http*://*virtonomic*.*/*/main/unit/view/*/manufacture
// @exclude     http*://*virtonomic*.*/*/main/unit/view/*/animals
// @exclude     http*://*virtonomic*.*/*/main/unit/view/*/sale
// @exclude     http*://*virtonomic*.*/*/main/unit/view/*/finans_report
// @exclude     http*://*virtonomic*.*/*/main/unit/view/*/technology/*
// @version     1.10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10897/iks%3Avirtonomica%20%D0%97%D0%B0%D0%BC%D0%B5%D1%82%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/10897/iks%3Avirtonomica%20%D0%97%D0%B0%D0%BC%D0%B5%D1%82%D0%BA%D0%B8.meta.js
// ==/UserScript==

var run = function(){
    $('fieldset.notice').html( $('fieldset.notice').html().replace(/\[br\]/g, '') );
    
    var o = {}, unit = location.href.split('/')[7];
    if( window.localStorage.getItem('noticePosition') ) o = JSON.parse( window.localStorage.getItem('noticePosition') );
    
    var work = function(){
        if(o[ unit ]) {
            $('fieldset.notice > legend').attr('title','Переместить вниз');
            $('table.infoblock').before( $('fieldset.notice') );
        } else {
            $('fieldset.notice > legend').attr('title','Переместить на верх');
            $('table.infoblock').after( $('fieldset.notice') );
        }
    }
    
    $('fieldset.notice > legend')
    .css({'cursor':'pointer', 'color':'#0184D0', 'text-decoration':'underline'})
    .attr('title','Переместить на верх')
    .click(function(){
        if(o[ unit ]) delete o[ unit ];
        else o[ unit ] = true;
        window.localStorage.setItem('noticePosition', JSON.stringify( o ));
        work();
    });
    if(o[ unit ]) work();
}


var run1 = function(){
    $('tr.unit_comment span').each(function() {
        $(this).css('max-height', '38em').html( $(this).html().replace(/\[br\]/g, '<br/>') );
    });
}

if(window.top == window) {
    var url = window.location.href;
    if( url.indexOf('/unit_list') + 1 )
        $( '<script/>', { text: '(' + run1.toString() + ')()' } ).appendTo('head');
    else
        $( '<script/>', { text: '(' + run.toString() + ')()' } ).appendTo('head');
}

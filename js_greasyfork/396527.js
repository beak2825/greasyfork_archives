// ==UserScript==
// @name         Метки Ксю
// @version      0.3
// @description  теги в правой части экрана
// @author       qc
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=branding
// @grant        none
// @namespace   https://greasyfork.org/ru/users/445721
// @downloadURL https://update.greasyfork.org/scripts/396527/%D0%9C%D0%B5%D1%82%D0%BA%D0%B8%20%D0%9A%D1%81%D1%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/396527/%D0%9C%D0%B5%D1%82%D0%BA%D0%B8%20%D0%9A%D1%81%D1%8E.meta.js
// ==/UserScript==

(function() {
    $('<style/>',{
	html: 'div.fast_marks_panel{position: fixed; top: 150px; left: 100; background: #ff0000b0; width: 10px; height: 16px; font: 15px Arial; color: #fff; text-align: center; padding: 5px; cursor: pointer; -webkit-transition-duration: 0.3s; -moz-transition-duration: 0.3s; -o-transition-duration: 0.3s; transition-duration: 0.3s; -webkit-border-radius: 5px 0 0 5px; -moz-border-radius: 5px 0 0 5px; border-radius: 5px 0 0 5px;} .fast_marks_container{position: fixed;top: 90px;left: 600px;color: #000;width: 160px;padding: 30px;text-align: center;-webkit-transition-duration: 0.5s;-moz-transition-duration: 0.5s;-o-transition-duration: 0.5s;transition-duration: 0.5s;-webkit-border-radius: 0 5px 5px 0;-moz-border-radius: 0 5px 5px 0;border-radius: 0 5px 5px 0;}.fast_marks_panel.opened {left: 250px; background: #ef707045;}.fast_marks_container.opened { left: 0;} .fast_marks_container>span{margin: 0 0 15px 0} .fast_marks_container>.js-tag-label.dkk-tag.dkk-tag-gray{display: block; min-height: 35px; opacity: 0.8; } .fast-tag{cursor: pointer} .fast-tag-green.selected{background-color: #00FF00;} .fast-tag-red.selected{background-color: #ff1919;}',
}).appendTo('head');


$('<div/>',{
    class: 'fast_marks_panel opened',
    append: $('<div/>',{
        class:'fast_marks_container opened',
        append: $('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                text:'Яндекс',
                value:'yandex'
        })
        .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                text:'Убер',
                value:'uber'
                }))
    })
}).appendTo($('div #content'));

let selectedTags = [];

function pressTag(val){
    $(`input[value=${val}]`).parent().click();
    updateSelectedTags();
};

function updateSelectedTags(){
    selectedTags = [];
    $('.fast-tag').removeClass('selected');

    $('ul.dropdown-menu.dropdown-menu-tags>li>a>input:checkbox:checked').each(function(){
	    selectedTags.push($(this).val())
    });

    updateFastTags();
};

function updateFastTags(){
    selectedTags.forEach(function(val){
        $(`.fast-tag[value=${val}]`).addClass('selected');
    })
};

$('.fast-tag').on('click',function(){
    let val = $(this).attr('value');
    pressTag(val);
    updateSelectedTags();
});

$('.fast_marks_panel').on('click',function(event){
    if($(event.target).is('div.fast_marks_panel')){
    $(this).toggleClass('opened');
    $('.fast_marks_container').toggleClass('opened');
    }
});

    //hotkeys//
let isShift = false;
let isCtrl = false;

$(document).keyup(function(e){
    if(e.which == 17) isCtrl=false;
    if(e.which == 16) isShift = false;
}).keydown(function(e){
    let activeElement = $(document.activeElement);
    if(activeElement.is('textarea') || activeElement.is('input') || activeElement.is('div.modal')) return;
    if(e.which == 17) isCtrl=true;
    if(e.which == 16) isShift=true;
    if(isCtrl==true){
        switch(e.which){
        case 90:
            pressTag('yandex');
            break
        case 88:
            pressTag('uber');
            break

        }
    }else if(isShift=true){
        switch(e.which){
        case 65:
            pressTag('magnity');
            break
        case 83:
            pressTag('poddelnoe_brandirovanie');
            break
        case 81:
            pressTag('phone');
            break
        case 87:
            pressTag('phone_karlash');
            break
        }
    }
});

$(document).on('item_info',updateSelectedTags);

})();
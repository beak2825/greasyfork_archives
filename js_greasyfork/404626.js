// ==UserScript==
// @name         Кнопки для детских
// @version      0.2
// @description  теги в правой части экрана +кнопки для бустеров и кресел
// @author       qc
// @match        https://taximeter-admin.taxi.yandex-team.ru/dkb/booster
// @match        https://taximeter-admin.taxi.yandex-team.ru/dkb/chair
// @grant        none
// @namespace    https://greasyfork.org/ru/users/445721-ксю-мартынова
// @downloadURL https://update.greasyfork.org/scripts/404626/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%B4%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D1%85.user.js
// @updateURL https://update.greasyfork.org/scripts/404626/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B8%20%D0%B4%D0%BB%D1%8F%20%D0%B4%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D1%85.meta.js
// ==/UserScript==

(function() {
    let url = document.location.href
    url.includes('qc?exam=branding') ? branding() : buster()
    function branding() {
        $('<style/>',{
            text: `div.fast_marks_panel{position: absolute; top: 0px; right: 0; background: #ff0000b0; width: 15px; height: 15px; font: 14px Arial; color: #fff; text-align: center; padding: 5px; cursor: pointer; -webkit-transition-duration: 0.3s; -moz-transition-duration: 0.3s; -o-transition-duration: 0.3s; transition-duration: 0.3s; -webkit-border-radius: 5px 0 0 5px; -moz-border-radius: 5px 0 0 5px; border-radius: 5px 0 0 5px;}
.fast_marks_container{position: absolute;top: 15px;right: -180px;background-color: #2b2d307a;color: #000;width: 160px;padding: 10px;text-align: center;-webkit-transition-duration: 0.3s;-moz-transition-duration: 0.3s;-o-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-border-radius: 0 5px 5px 0;-moz-border-radius: 0 5px 5px 0;border-radius: 0 5px 5px 0;}
.fast_marks_panel.opened {right: 0px; background: #ef707045;}
.fast_marks_container.opened {right: 0; opacity: 0.3;}
.fast_marks_container.opened:hover{opacity: 0.8;}
.fast_marks_container>span{margin: 0 0 10px 0}
.fast_marks_container>.js-tag-label.dkk-tag.dkk-tag-gray{display: block; min-height: 35px; opacity: 0.8; }
.fast-tag{cursor: pointer}
.fast-tag-green.selected{background-color: #29d227;}
.fast-tag-red.selected{background-color: #ff1919;}

.check-thumb-number>input{width: 30px; height: 30px; margin: 0;}
div.check-thumb-number{width: 250px; font-size: 21px}`,
        }).appendTo('head');


        $('<div/>',{
            class: 'fast_marks_panel opened',
            append: $('<div/>',{
                class:'fast_marks_container opened',
                append: $('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Шашечки на кузове',
                    value:'checkers_car'
                })
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Шашечки на крыше',
                    value:'checkers_roof'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                    text:'Год выпуска ТС',
                    value:'god_vypuska'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                    text:'Магниты',
                    value:'magnity'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                    text:'Недопуск — классификатор',
                    value:'ne_prohodyat_po_classifikatoru'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Убер',
                    value:'uber'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Старый Убер',
                    value:'oldbrand_uber'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Яндекс',
                    value:'yandex'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                    text:'Старый брендинг',
                    value:'oldbrand'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Телефон для вызова',
                    value:'phone'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Телефон для найма',
                    value:'phone_karlash'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                    text:'Поддельное брендирование',
                    value:'poddelnoe_brandirovanie'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Lightbox: Новый',
                    value:'lightbox_new'
                }))
                .add($('<span/>',{
                    class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-green',
                    text:'Lightbox: Цветной',
                    value:'lightbox_new_color'
                }))
            })
        }).appendTo($('div #content'));

        let selectedTags = [];

        function pressTag(val){
            $(`input[value=${val}]`).parent().click();
            updateSelectedTags();
        };

        function pressBtn(val){
            console.log(val);
            $(`input#${val}`).click();
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
            if(e.which == 186) pressBtn('btn-lightbox');
            if(e.which == 222) pressBtn('btn-sticker');
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
    }

        function buster() {
        function createBtn(text, item, val) {
            const btn = document.createElement('button')
            btn.textContent = text.toUpperCase()
            btn.className = 'rotate btn btn-info'
            btn.style.margin = '0 5px 5px 0'

            btn.addEventListener('click', () => {
                item.value = val
            })
            return btn
        }

        if (url.includes('dkb/booster')) {
            $(document).on('item_info',() => {
                document.querySelectorAll('.form-control.control.dkb-booster-photos-enable').forEach(item => {
                    item.after(createBtn('вкл',item, 1))
                    item.after(createBtn('выкл',item, 0))
                })
            });
        } else {
            $(document).on('item_info',() => {
                document.querySelectorAll('.form-control.control.dkb-chair-photos-enable').forEach(item => {
                    item.after(createBtn('вкл',item, 1))
                    item.after(createBtn('выкл',item, 0))
                })
            });
        }
    }
})();
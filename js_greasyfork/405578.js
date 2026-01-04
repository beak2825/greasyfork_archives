// ==UserScript==
// @name         Выдвижная панель с тегами ДКК
// @version      0.1.10
// @description  теги в правой части экрана 
// @author       qc
// @match        https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @match        https://taximeter-admin.taxi.yandex-team.ru/dkk
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/405578/%D0%92%D1%8B%D0%B4%D0%B2%D0%B8%D0%B6%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%D1%81%20%D1%82%D0%B5%D0%B3%D0%B0%D0%BC%D0%B8%20%D0%94%D0%9A%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/405578/%D0%92%D1%8B%D0%B4%D0%B2%D0%B8%D0%B6%D0%BD%D0%B0%D1%8F%20%D0%BF%D0%B0%D0%BD%D0%B5%D0%BB%D1%8C%20%D1%81%20%D1%82%D0%B5%D0%B3%D0%B0%D0%BC%D0%B8%20%D0%94%D0%9A%D0%9A.meta.js
// ==/UserScript==

(function() {
    $('<style/>',{
        text: `div.fast_marks_panel{position: absolute; top: 15%; right: 0; background: #ff0000b0; width: 15px; height: 15px; font: 14px Arial; color: #fff; text-align: center; padding: 5px; cursor: pointer; -webkit-transition-duration: 0.3s; -moz-transition-duration: 0.3s; -o-transition-duration: 0.3s; transition-duration: 0.3s; -webkit-border-radius: 5px 0 0 5px; -moz-border-radius: 5px 0 0 5px; border-radius: 5px 0 0 5px;}
.fast_marks_container{position: absolute;top: 15px;right: -190px;background-color: #2b2d307a;color: #000;width: 160px;padding: 10px;text-align: center;-webkit-transition-duration: 0.3s;-moz-transition-duration: 0.3s;-o-transition-duration: 0.3s;transition-duration: 0.3s;-webkit-border-radius: 0 5px 5px 0;-moz-border-radius: 0 5px 5px 0;border-radius: 0 5px 5px 0;}
.fast_marks_panel.opened {right: 0px; background: #ef707045;}
.fast_marks_container.opened {right: 0; opacity: 0.2;}
.fast_marks_container.opened:hover{opacity: 0.8;}
.fast_marks_container>span{margin: 0 0 10px 0}
.fast_marks_container>.js-tag-label.dkk-tag.dkk-tag-gray{display: block; min-height: 30px; opacity: 0.8; }
.fast-tag{cursor: pointer}
.fast-tag-blue.selected{background-color: #0006FF;}
.fast-tag-orange.selected{background-color: orange;}
.fast-tag-red.selected{background-color: red;}
.fast-tag-yellow.selected{background-color: #b5b539;}

.check-thumb-number>input{width: 30px; height: 30px; margin: 0;}
div.check-thumb-number{width: 250px; font-size: 21px}`,
    }).appendTo('head');

    const btnList = [
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Шашечки на кузове',
            value: 'checkers_car',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Шашечки на крыше',
            value: 'checkers_roof',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Ситимобил',
            value: 'citymobil',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Сторонний бренд',
            value: 'storonniy_brand',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Год выпуска ТС',
            value: 'god_vypuska',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Трёхдверное ТС',
            value: 'coupe',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Убер',
            value: 'uber',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-yellow',
            text: 'Яндекс',
            value: 'yandex',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-yellow',
            text: 'Яндекс GO',
            value: 'yandex_go',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-orange',
            text: 'ДиДи',
            value: 'badlook_d',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Грузовой брендинг',
            value: 'cargo_brand',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
            text: 'Эмуль',
            value: 'emulator',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
            text: 'Фейковый госномер',
            value: 'fake_car_number',
            style: 'block'
        },
        {
            class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
            text: 'Перевес',
            value: 'swapped_car_number',
            style: 'block'
        },
    ]
    $('<div/>',{
        class: 'fast_marks_panel opened',
        append: $('<div/>',{
            class:'fast_marks_container opened'
        })
    }).appendTo($('div #content').parent());

    /*$('<div/>',{
        class: 'fast_marks_panel opened',
        append: $('<div/>',{
            class:'fast_marks_container opened',
            append: $('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Шашечки на кузове',
                value:'checkers_car'
            })
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Шашечки на крыше',
                value:'checkers_roof'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Ситимобил',
                value:'citymobil'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Сторонний бренд',
                value:'storonniy_brand'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Год выпуска ТС',
                value:'god_vypuska'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Трёхдверное ТС',
                value:'coupe'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Убер',
                value:'uber'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-yellow',
                text:'Яндекс',
                value:'yandex'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Грузовой брендинг',
                value:'cargo_brand'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                text:'Эмуль',
                value:'emulator'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-red',
                text:'Фейковый госномер',
                value:'fake_car_number'
            }))
            .add($('<span/>',{
                class:'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text:'Перевес',
                value:'swapped_car_number'
            }))
        })
    }).appendTo($('div #content'));*/

    const createBtn = (item) => {
        let span = document.createElement('span')
        if (item.style === 'block') {
            span.className = item.class,
                span.textContent = item.text
            span.setAttribute('value', item.value)
            span.addEventListener('click', function () {
                document.querySelector(`input[value=${this.getAttribute('value')}]`).closest('a').click()
                updateSelectedTags()
            })
        }
        return span
    }

    const createList = (arr) => {
        arr.forEach(item => {
            document.querySelector('.fast_marks_container.opened').append(createBtn(item))
        })
    }

    let selectedTags = [];

    /*function pressTag(val){
        $(`input[value=${val}]`).parent().click();
        updateSelectedTags();
    };

    function pressBtn(val){
        console.log(val);
        $(`input#${val}`).click();
    };*/

    function updateSelectedTags(){
        selectedTags = [];

        document.querySelector('.fast_marks_container.opened').innerHTML = ''

        let list = document.querySelectorAll('a[data-group="Отключение повышенных тарифов"]>input'),
            arrList = []
        list.forEach(item => {
            arrList.push({
                class: 'js-tag-label dkk-tag dkk-tag-gray fast-tag fast-tag-blue',
                text: item.closest('a').childNodes[2].textContent.trim(),
                style: item.closest('a').style.display,
                value: item.value
            })
        })

        const tree = document.getElementById('category').selectedOptions[0].value
        tree === 'DkkTariffsBlock' || tree === 'DkkTariffsCommon' || tree === 'DkkPriorityTariffsBlock' || tree === 'DkkPriorityTariffsCommon' 
            ? createList([...arrList, ...btnList])
            : createList(btnList)

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

    /*$('.fast-tag').on('click',function(){
        console.log(1)
        let val = $(this).attr('value');
        pressTag(val);
        updateSelectedTags();
    });*/

    $('.fast_marks_panel').on('click',function(event){
        if($(event.target).is('div.fast_marks_panel')){
            $(this).toggleClass('opened');
            $('.fast_marks_container').toggleClass('opened');
        }
    });
    //$(document).on('item_info',updateSelectedTags);
    $("#table").on("selected", updateSelectedTags)
})();
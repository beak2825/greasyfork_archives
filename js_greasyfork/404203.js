// ==UserScript==
// @name         Покемоны прогон с капчей
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Максим Мирный
// @match        https://pokepower.ru/world
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404203/%D0%9F%D0%BE%D0%BA%D0%B5%D0%BC%D0%BE%D0%BD%D1%8B%20%D0%BF%D1%80%D0%BE%D0%B3%D0%BE%D0%BD%20%D1%81%20%D0%BA%D0%B0%D0%BF%D1%87%D0%B5%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/404203/%D0%9F%D0%BE%D0%BA%D0%B5%D0%BC%D0%BE%D0%BD%D1%8B%20%D0%BF%D1%80%D0%BE%D0%B3%D0%BE%D0%BD%20%D1%81%20%D0%BA%D0%B0%D0%BF%D1%87%D0%B5%D0%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var start = prompt('Запустить скрипт?');
    if (start == '1'){
        setTimeout(first_go, 10000);
        console.log('Первый нах');
    }
    else if (start != '1'){
        alert('Вы отказались от работы бота, если захотите его включить, перейдите в "Покецентр" и обновите страницу');
    }
    // Your code here...
})();

var kol_udar = 0

function first_go(){
    var first_perexod = document.querySelector('.Steps');
    var text_first_perexod = first_perexod.getElementsByTagName('div');
    text_first_perexod[0].click()
    setTimeout(second_go, 5000);
}
var block
var text_captcha_stock

function second_go(){
    var second_perexod = document.querySelector('.Steps');
    var text_second_perexod = second_perexod.getElementsByTagName('div');
    text_second_perexod[2].click()
    var agress_on = document.querySelector('.NoActive').click();
    setTimeout(ozh, 1000);
}

function ozh(){
    try{
        var udar_list = document.querySelector('.Battle');
        var block = document.querySelector('.captcha');
        var text_captcha_stock = block.querySelector('.title').textContent;
        console.log(block)
        console.log(text_captcha_stock);
        setTimeout(knopki_bitva, 2000)
    }catch(err){
        setTimeout(ozh, 3000);
    }
}

function knopki_bitva(){
    try{
        if (kol_udar <= 23){
            setTimeout(captcha, 2000);
            console.log('123');
            var udar_list = document.querySelector('.MoveBox');
            var att = udar_list.getAttribute('class');
            if (att == 'MoveBox waiting'){
                setTimeout(knopki_bitva, 1000)
            }else if (att == 'MoveBox'){
            var udar = udar_list.getElementsByTagName('div');
            udar[0].click();
            kol_udar += 1;
            console.log(kol_udar);
            setTimeout(knopki_bitva, 2000);
            }
        }else if (kol_udar >= 24){
            captcha();
            console.log(text_captcha_stock);
            var uar_list = document.querySelector('.MoveBox');
            var at = uar_list.getAttribute('class');
            if (at == 'MoveBox waiting'){
                console.log('waiting');
                var agress_off = document.querySelector('div[data="Выключить нападения"]').click();
                var info = document.querySelector('.Info')
                var buttons_list = info.querySelector('.Buttons');
                console.log(buttons_list);
                var all_btn = buttons_list.getElementsByTagName('div');
                all_btn[3].click();
                setTimeout(go_home_step_one, 3000)
            }else if (at == 'MoveBox') {
                console.log('no wating');
                var udar_lis = document.querySelector('.MoveBox');
                var udr = udar_lis.querySelectorAll('.Move');
                udr[0].click();

                var agress_of = document.querySelector('div[data="Выключить нападения"]').click();
                var inf = document.querySelector('.Info')
                var buttons_lis = info.querySelector('.Buttons');
                console.log(buttons_lis);
                var all_bt = buttons_lis.getElementsByTagName('div');
                all_bt[3].click();
                setTimeout(go_home_step_one, 3000)
            }
        }
    }catch(err) {
        setTimeout(ozh, 2000);
    }
}

function go_home_step_one(){
    kol_udar = 0
    var first_perexod = document.querySelector('.Steps');
    var text_first_perexod = first_perexod.getElementsByTagName('div');
    text_first_perexod[0].click()
    setTimeout(go_home_step_two, 3000)
}

function go_home_step_two(){
    var first_perexod = document.querySelector('.Steps');
    var text_first_perexod = first_perexod.getElementsByTagName('div');
    text_first_perexod[1].click()
    setTimeout(health, 2000);
}

function health(){
    var addons = document.querySelector('.Addons');
    var heal = addons.getElementsByTagName('div');
    heal[0].click();
    setTimeout(first_go, 3000);
}

function captcha(){
    try{
        console.log('nachali proverku');
        var block_captcha = document.querySelector('.captcha');
        var text_captcha = block_captcha.querySelector('.title').textContent;
        if (text_captcha == text_captcha_stock){
            console.log('Капча не обновилась, поэтому мы забили болт')
        }else if (text_captcha != text_captcha_stock){
            var first_number = text_captcha[0]
            var second_number = text_captcha[4]
            console.log(first_number, second_number);
            var itog = parseInt(first_number) + parseInt(second_number)
            console.log(itog);
            var input = document.querySelector('.inpt')
            input.value = itog;
            var ok = document.querySelector('.ok').click();
            block = block_captcha
            text_captcha_stock = text_captcha
        }
    }catch(err){
        console.log('net')
    }
}
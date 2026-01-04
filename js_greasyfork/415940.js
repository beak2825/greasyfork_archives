// ==UserScript==
// @name         스파오 선택
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.spao.com/product/*
// @match        https://*.spao.com/product/*
// @match        http://*.spao.co.kr/product/*
// @match        https://*.spao.co.kr/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415940/%EC%8A%A4%ED%8C%8C%EC%98%A4%20%EC%84%A0%ED%83%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/415940/%EC%8A%A4%ED%8C%8C%EC%98%A4%20%EC%84%A0%ED%83%9D.meta.js
// ==/UserScript==


//1번째 선택항목 우선순위
var array1 = ["(59)NAVY", "(19)Black"];
//2번째 선택항목 우선순위
var array2 = ["XL(105)", "L(100)", "100"];


setTimeout(function() {
    $('.ec-product-soldout').remove();
    for (var i in array1){
        if($('ul[option_sort_no="1"] li[option_value="'+array1[i]+'"]').length == 1){
            $('ul[option_sort_no="1"] li[option_value="'+array1[i]+'"]').trigger('click');
            break;
        }else{
            if(array1.length-1==i){
                $('ul[option_sort_no="1"] li').first().trigger('click');
            }
        }
    }

    $('.ec-product-soldout').remove();
    for (var j in array2){
        if($('ul[option_sort_no="2"] li[option_value="'+array2[j]+'"]').length == 1){
            $('ul[option_sort_no="2"] li[option_value="'+array2[j]+'"]').trigger('click');
            break;
        }else{
            if(array2.length-1==j){
                $('ul[option_sort_no="2"] li').first().trigger('click');
            }
        }
    }

    setTimeout(function() {
        $('#btnBuy').trigger('click');
    }, 200);
}, 500);


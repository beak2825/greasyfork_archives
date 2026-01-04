// ==UserScript==
// @name     dlsite.com 音声作品非表示
// @version  14
// @include  https://www.dlsite.com/*
// @description dlsite.comの音声作品を非表示にします
// @grant    none
// @namespace https://greasyfork.org/users/77418
// @downloadURL https://update.greasyfork.org/scripts/407900/dlsitecom%20%E9%9F%B3%E5%A3%B0%E4%BD%9C%E5%93%81%E9%9D%9E%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/407900/dlsitecom%20%E9%9F%B3%E5%A3%B0%E4%BD%9C%E5%93%81%E9%9D%9E%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==
(function(){
    "use strict";
    var elements,i, len, count = 0;
    var timer = setInterval(function(){
        count++;
        elements = document.getElementsByClassName('type_SOU');
        for (i=0, len=elements.length|0; i<len; i=i+1|0) {
            if (elements[i].closest(".n_worklist_item,.swiper-slide,.work_img_main,.search_result_img_box_inner")) {
                elements[i].closest(".n_worklist_item,.swiper-slide,.work_img_main,.search_result_img_box_inner").style.display = 'none';
                elements[i].classList.remove('type_SOU');
            }
        }
        if (count > 360) {
            clearInterval(timer);
        }
    }, 1000);

    elements = document.getElementsByClassName('work_subheading');
    for (i=0, len=elements.length|0; i<len; i=i+1|0) {
        if (elements[i].innerText.indexOf('ボイス・ASMR・音楽新作ランキング') !== -1) {
            elements[i].style.display = 'none';
            elements[i].nextElementSibling.style.display = 'none';
        } else if (elements[i].innerText.indexOf('総合ランキング') !== -1) {
            elements[i].style.display = 'none';
            elements[i].nextElementSibling.style.display = 'none';
        }
    }
})();
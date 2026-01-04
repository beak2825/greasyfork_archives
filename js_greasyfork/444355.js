// ==UserScript==
// @name         Plurk 預約發噗排序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  將噗浪後台的預約發噗時間依照時間排序
// @author       S.Dot
// @homepage     https://github.com/SentenceDot
// @match        https://www.plurk.com/settings/plurks
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plurk.com
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444355/Plurk%20%E9%A0%90%E7%B4%84%E7%99%BC%E5%99%97%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444355/Plurk%20%E9%A0%90%E7%B4%84%E7%99%BC%E5%99%97%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scheduled_plurks_li = document.querySelectorAll('#scheduled-plurks li');
    scheduled_plurks_li = Array.from(scheduled_plurks_li);

    let sort_by_time = (ele1, ele2)=>{
        var datetime1 = ele1.querySelector('span.time').getAttribute('data-local');
        var datetime2 = ele2.querySelector('span.time').getAttribute('data-local');

        datetime1 = new Date(datetime1);
        datetime2 = new Date(datetime2);

        if (datetime1 > datetime2){
            return 1;
        }
        else if(datetime1 < datetime2){
            return -1;
        }

        return 0;
    }

    let scheduled_plurks_ul = document.querySelector('#scheduled-plurks');
    scheduled_plurks_ul.innerHTML = '';

    scheduled_plurks_li.sort(sort_by_time).forEach( li => scheduled_plurks_ul.appendChild(li));
})();
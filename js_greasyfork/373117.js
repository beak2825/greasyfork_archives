// ==UserScript==
// @name           Virtonomica: Избавляемся от страшных картинок в новом дизайне
// @author         BioHazard
// @version        1.00
// @namespace      Virtonomica
// @description    Бережем свои глазки и не видим эти страшилки
// @include        /^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/finance_report(|\/graphical)$/
// @include        /^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/dashboard$/
// @downloadURL https://update.greasyfork.org/scripts/373117/Virtonomica%3A%20%D0%98%D0%B7%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%D1%81%D1%8F%20%D0%BE%D1%82%20%D1%81%D1%82%D1%80%D0%B0%D1%88%D0%BD%D1%8B%D1%85%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BE%D0%BA%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/373117/Virtonomica%3A%20%D0%98%D0%B7%D0%B1%D0%B0%D0%B2%D0%BB%D1%8F%D0%B5%D0%BC%D1%81%D1%8F%20%D0%BE%D1%82%20%D1%81%D1%82%D1%80%D0%B0%D1%88%D0%BD%D1%8B%D1%85%20%D0%BA%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%BE%D0%BA%20%D0%B2%20%D0%BD%D0%BE%D0%B2%D0%BE%D0%BC%20%D0%B4%D0%B8%D0%B7%D0%B0%D0%B9%D0%BD%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //убираем картинки из дашборда
    if(~location.href.search(/^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/dashboard$/)){
        document.querySelector('.item.item-w100').style='display: none';
    }

    //прячем предложения получить наличные на странице финансового отчета
    if(~location.href.search(/^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/finance_report(|\/graphical)$/)){
        document.querySelector('.bonus_block').style='display: none';
    }
})(window);
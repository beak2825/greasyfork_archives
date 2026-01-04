// ==UserScript==
// @name           Virtonomica: Шоб глаза мои их не видели
// @author         BioHazard
// @version        1.02
// @namespace      Virtonomica
// @description    Бережем свои глазки и не видим страшных картинок
// @run-at         document-start
// @include        /^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/finance_report(|\/graphical)$/
// @include        /^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/dashboard$/
// @downloadURL https://update.greasyfork.org/scripts/373221/Virtonomica%3A%20%D0%A8%D0%BE%D0%B1%20%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B8%20%D0%B8%D1%85%20%D0%BD%D0%B5%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BB%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/373221/Virtonomica%3A%20%D0%A8%D0%BE%D0%B1%20%D0%B3%D0%BB%D0%B0%D0%B7%D0%B0%20%D0%BC%D0%BE%D0%B8%20%D0%B8%D1%85%20%D0%BD%D0%B5%20%D0%B2%D0%B8%D0%B4%D0%B5%D0%BB%D0%B8.meta.js
// ==/UserScript==

(function(){
let interval = 10;

if(~location.href.search(/^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/finance_report(|\/graphical)$/)){
    let timer1 = setInterval(function() {
        if (document.querySelector('.bonus_block')) {
            document.querySelector('.bonus_block').style='display: none';
            clearInterval(timer1);
    }
    }, interval);
};

if(~location.href.search(/^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/dashboard$/)){
    let timer2 = setInterval(function() {
        if (document.querySelector('.item.item-w100')) {
            document.querySelector('.item.item-w100').style='display: none';
            clearInterval(timer2);
    }
    }, interval);
};
})(window);
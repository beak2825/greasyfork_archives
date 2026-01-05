// ==UserScript==
// @name        КанобуРу фильтр новостей на главной
// @description Скрипт позволяет указать типы новостей, по тегам, и они спрячутся
// @description:en This is russian script for russian site. Functionality: Filtering news on main page by tagnames.
// @namespace   ru.kanobu.YDogg
// @include     http://kanobu.ru/
// @version     1.002
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28922/%D0%9A%D0%B0%D0%BD%D0%BE%D0%B1%D1%83%D0%A0%D1%83%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B5%D0%B9%20%D0%BD%D0%B0%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/28922/%D0%9A%D0%B0%D0%BD%D0%BE%D0%B1%D1%83%D0%A0%D1%83%20%D1%84%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B5%D0%B9%20%D0%BD%D0%B0%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B9.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function (event) {

    var mpage = document.getElementById("mainpage-news");
    var news = document.querySelector('.news-list');
    var feature = document.querySelector(".page-feature-main");
    var itemsCount = 0;

    //Перечислить все ненавистные тэги (с маленькой буквы)
    var blocked = [
        'комиксы',
        'киберспорт',
        'косплей',
        'партнерский материал',
        'фигурки',
        'рестлинг',
        'реклама',
        'the international 2017',
        'игра престолов'
    ];

    function hideSomeShit() {
        var newsItems = news.getElementsByTagName('li');
        for (var i = 0; i < newsItems.length; i++) {
            var clss = newsItems[i].classList;
            var tag;
            if (!clss.contains("longread-list-item")) {
                //tag = newsItems[i].childNodes[1].childNodes[3].childNodes[1].childNodes[0];
                tag = newsItems[i].querySelector("span.news-info-category-main");
                //alert(tag.innerHTML);
            } else {
                tag = newsItems[i].querySelector(".longread-info--type");
            }
            if (!!tag) {
                var txt = String.toLowerCase(tag.innerHTML);

                if (blocked.indexOf(txt) >= 0) {
                    newsItems[i].style.display = 'none';
                }
            }
        }
    }
    
    mpage.style.paddingTop = "40px"; //Вернуть отступ
    feature.style.display = "none"; //Убрать фичер
    
    //Фильтровать постоянно
    setInterval(function(){
        var items = news.getElementsByTagName('li');
        if (itemsCount!==items.length){
            hideSomeShit();
        }
        itemsCount = items.length;
    }, 50);
});

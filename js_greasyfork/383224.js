// ==UserScript==
// @name:en      Shikimori View Button
// @name         Кнопка "Смотреть" на shikimori.one
// @namespace    http://shikimori.one/
// @version      1.2.1
// @description:en  Return view button on new domain "one". [Not relevant] 
// @description:ru Возвращает на новый домен кнопку "Смотреть"; на play.shikimori.org меняет ссылки, для возвращения на страницу с новым доменом. [Не актуально]
// @author       Jogeer
// @match        https://shikimori.one/*
// @match        https://play.shikimori.org/*
// @grant        none
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js
// @description Возвращает на новый домен кнопку "Смотреть"; на play.shikimori.org меняет ссылки, для возвращения на страницу с новым доменом
// @downloadURL https://update.greasyfork.org/scripts/383224/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%A1%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C%22%20%D0%BD%D0%B0%20shikimorione.user.js
// @updateURL https://update.greasyfork.org/scripts/383224/%D0%9A%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%22%D0%A1%D0%BC%D0%BE%D1%82%D1%80%D0%B5%D1%82%D1%8C%22%20%D0%BD%D0%B0%20shikimorione.meta.js
// ==/UserScript==

//Эта хрень делает ваш код рабочим при переходе по страницам с AJAX'ом
waitForKeyElements (
    "body",
    unique
);

//Эта основной код который работает (возможно)
function unique() {
    //это переменные
    var link = window.location.pathname,
        button = '.watch-online-placeholer',
        ce = Number($('.current-episodes').text()) + 1;

    //это стили для кнопки "Смотреть"
    $(button).css({"background": "#19282b", "width": "calc(100% - 40px)", "height": "30px", "text-align": "center", "margin": "0 20px", "color": "#eee", "font-size": "18px", "cursor": "pointer", "transition": ".2s"});
    $(button).text("Смотреть");
    $(button).hover(function(){
        $(this).css("background-color", "rgb(54, 72, 76)");
    }, function(){
        $(this).css("background-color", "#19282b");
    });

    //А это код, который заменяет ссылки и добовляет кнопки
    if (window.location.hostname == 'shikimori.one') {
        $(button).on('click', function(event) {
            event.preventDefault();
            if ((ce - 1) == Number(($('.b-entry-info > .line-container:nth-child(2) > .line > .value').text()).split(' ')[0])) {
                location.replace('https://play.shikimori.org/' + link + '/video_online/' + (ce - 1));
            };
            if ((ce - 1) < Number(($('.b-entry-info > .line-container:nth-child(2) > .line > .value').text()).split(' ')[0])) {
                location.replace('https://play.shikimori.org/' + link + '/video_online/' + ce);
            };
        });
    };
    if (window.location.hostname == 'play.shikimori.org') {
        var url = $(".l-menu .b-animes-menu .b-menu_logo > center > a").attr('href');
        $(".l-menu .b-animes-menu .b-menu_logo > center > a").attr('href', url.slice(0,19) + 'ne' + url.slice(21));
        $("h2 > a").attr('href', url.slice(0,19) + 'ne' + url.slice(21));
    };
};
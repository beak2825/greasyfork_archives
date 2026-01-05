// ==UserScript==
// @name        TMD filtru torrente
// @description ascunde torrentele care nu le doresti
// @namespace   https://greasyfork.org/en/users/213-drakulaboy
// @include     *torrentsmd.*/browse.php*
// @version     1.5
// @grant       none
// @icon         http://i.imgur.com/uShqmkR.png
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/398/TMD%20filtru%20torrente.user.js
// @updateURL https://update.greasyfork.org/scripts/398/TMD%20filtru%20torrente.meta.js
// ==/UserScript==
$(document.getElementsByClassName('.tableTorrents')[0]).ready(function() {
    var exclude = ['Дом-2',
                   'Танцы [Season',
                   'Vocea României',
                   'САШАТАНЯ',
                   'Лондонград',
                   'Vampire Diaries',
                   'Универ',
                   'Las Fierbinţi',
                   'Квест',
                   '[Trance]', 
                   '[Sport]',
                   'iOS', 
                   'TELESYNC', 
                   'CamRip', 
                   'Anime', 
                   'AniMedia', 
                   'СашаТаня', 
                   'Деффчонки', 
                   'Понять. Простить', 
                   'True Blood', 
                   'Уилфред', 
                   'КВН.', 
                   'Дурнушек.Net',
                   'Битва экстрасенсов',
                   'Квартирный вопрос', 
                   'Чрезвычайное происшествие', 
                   'Pretty Little Liars', 
                   'Avenida Brasil', 
                   'Каникулы в Мексике', 
                   'Teen Wolf', 
                   'Пусть говорят.',
                   '/ CAM]',
                   '[ITA]',
                   '[Alternative]',
                   '[Rock]',
                   '[AlternRock]',
                   '[Metalcore]',
                   '[Hard Rock]',
                   '[Heavy Metal]',
                   'Got Talent',
                   '[Drama]',
                   'Comedy Woman',
                   'Голос [Season',
                   '[Romance]'];
    exclude.forEach(function(i){
        $('.tableTorrents tr:contains(' + i + ')').hide();
        $('.tableTorrents b[title="Închis"]').closest('tr').hide();
    });
});
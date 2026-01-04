// ==UserScript==
// @name           Victory: Агитация без оленеводства
// @author         BioHazard
// @version        1.04
// @namespace      Victory
// @description    Агитация в 1 клик
// @include        http*://virtonomica.ru/*/main/company/view/*/unit_list
// @include        /^http.://virtonomica\.ru/\w+/main/company/view/\d+$/
// @include        http*://virtonomica.ru/*/main/user/privat/persondata/message/system/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372095/Victory%3A%20%D0%90%D0%B3%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B1%D0%B5%D0%B7%20%D0%BE%D0%BB%D0%B5%D0%BD%D0%B5%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/372095/Victory%3A%20%D0%90%D0%B3%D0%B8%D1%82%D0%B0%D1%86%D0%B8%D1%8F%20%D0%B1%D0%B5%D0%B7%20%D0%BE%D0%BB%D0%B5%D0%BD%D0%B5%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
// ==/UserScript==

(function () {

    let i,
        artType = $('.wborder > td:nth-child(4)'),
        villaSize,
        unitId;

    const artefactId = 368594;

    if($('.i-villa').is('.u-s') || ($('.u-t').is('.u-s') && $('.unittype > option:selected').val()==='102')) {
        $('.wborder > td.alerts').append($('<div><img src="/img/save.png" style="cursor: pointer"></div>')).one('click', agitation);
    }

    if ($('tr:nth-child(3) > td:nth-child(2)').html() === 'Время жизни инноваций на предприятиях подошло к концу!') {
        for (i=0; i<$('.wborder').length; i++) {
            if (artType[i].innerHTML === "Политическая агитация") {
                $(artType[i]).parent().append($('<div><img src="/img/save.png" style="cursor: pointer"></div>')).one('click', agitation);
            }
        }
    }

    function agitation() {
if (location.href.match(/message/)) {
    unitId = $(this).find('td:nth-child(3) > a').attr('href').match(/\d+/)[0];
    switch ($(this).find('td:nth-child(3) > a').html().match(/[а-я]+/i)[0]) {
        case 'Сарай': villaSize=1; break;
        case 'Палатка': villaSize=2; break;
        case 'Квартира': villaSize=3; break;
        case 'Дом': villaSize=4; break;
        case 'Вилла': villaSize=5; break;
        case 'Особняк': villaSize=6; break;
        case 'Дворец': villaSize=7; break;
    }
}
else {
    unitId = $(this).parent().find('td:nth-child(1)').html();
    villaSize = parseInt($(this).parent().find('td:nth-child(5)').html());
}

        $.ajax({
            url: 'https://virtonomica.ru/olga/ajax/unit/artefact/attach/?unit_id='+ unitId + '&artefact_id=' + (artefactId + villaSize) + '&slot_id=368592',
        });
        $(this).find('div').children().attr('src','/img/politics/news_2.png');
    }
})(window);
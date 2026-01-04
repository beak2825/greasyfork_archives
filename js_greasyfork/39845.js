// ==UserScript==
// @name         IKARIAM EASY
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://*.ikariam.gameforge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39845/IKARIAM%20EASY.user.js
// @updateURL https://update.greasyfork.org/scripts/39845/IKARIAM%20EASY.meta.js
// ==/UserScript==

Core = {
    toformat: function(num){
        if(num.match(',')){
            return num.replace(",", "");
        }else{
            return num;
        }
    }
};

(function() {
    'use strict';
    $(document).ajaxStop(function() {
        if($('#js_cityBread').length !== 0){
            var s,l;
            for(var i =0; i < 19; i++){
                l = $('#js_CityPosition'+i+'ScrollName').text().match(/\d+/g);
                $('#js_CityPosition'+i+'ScrollName').text(l);
                $('.timetofinish').css({'background-image':'none'});
                $('div#js_CityPosition'+i+'Scroll .before').remove();
                $('div#js_CityPosition'+i+'Scroll .after').remove();
                $('div#js_CityPosition'+i+'Countdown .before').remove();
                $('div#js_CityPosition'+i+'Countdown .after').remove();
                if($('#js_CityPosition'+i+'ScrollName').hasClass('green')){
                    $('#js_CityPosition'+i+'ScrollName').css({'display':'block',
                                                              'width':'34px',
                                                              'height':'34px',
                                                              'line-height':'34px',
                                                              'background-color':'rgba(107, 142, 35, 0.8)',
                                                              'font-size':'26px',
                                                              'color':'#FFF',
                                                              'border':'2px solid #FFF',
                                                              'border-radius':'19px',
                                                              'vertical-align':'bottom'});
                }else if(typeof $('#js_CityPosition'+i+'ScrollName').attr("class") !== typeof undefined){
                    $('#js_CityPosition'+i+'ScrollName').css({'display':'block',
                                                              'width':'34px',
                                                              'height':'34px',
                                                              'line-height':'34px',
                                                              'background':'rgba(165, 42, 42, 0.8)',
                                                              'font-size':'26px',
                                                              'color':'#FFF',
                                                              'border':'2px solid #FFF',
                                                              'border-radius':'19px',
                                                              'vertical-align':'bottom'});
                    $('.buildingUpgradeIcon').css({'display':'block',
                                                   'height':'34px',
                                                   'line-height':'34px',
                                                   'background':'rgba(170, 170, 170, 0.8)',
                                                   'padding-left':'0px',
                                                   'font-size':'22px',
                                                   'text-align':'center',
                                                   'color':'#FFF',
                                                   'width':'100px',
                                                   'border':'2px solid #FFF',
                                                   'border-radius':'19px',
                                                   'vertical-align':'bottom'});
                } else {
                    $('#js_CityPosition'+i+'ScrollName').css({'display':'block',
                                                              'width':'34px',
                                                              'height':'34px',
                                                              'line-height':'34px',
                                                              'background':'rgba(100, 100, 100, 0.8)',
                                                              'font-size':'26px',
                                                              'color':'#FFF',
                                                              'border':'2px solid #FFF',
                                                              'border-radius':'19px',
                                                              'vertical-align':'bottom'});
                }
            }
        }
        var c = Core;
        var res;
        if($('h3#js_mainBoxHeaderTitle').text().indexOf('Варваров') > 0 && $('#js_cityBread').length == 0){
            res = Number(c.toformat($('li#js_islandBarbarianResourceresource').html())) + Number(c.toformat($('li#js_islandBarbarianResourcetradegood1').html())) +
                Number(c.toformat($('li#js_islandBarbarianResourcetradegood2').html())) + Number(c.toformat($('li#js_islandBarbarianResourcetradegood3').html())) +
                Number(c.toformat($('li#js_islandBarbarianResourcetradegood4').html()));
            $('div.barbarianCityKingSpeech').text('Необходимо: '+Math.ceil(res/500)+' кораблей.');
        }else if(($('h3#js_mainBoxHeaderTitle').text() == 'Лесопилка' || $('h3#js_mainBoxHeaderTitle').text() == 'Добыча серы' || $('h3#js_mainBoxHeaderTitle').text() == 'Карьер' ||
                  $('h3#js_mainBoxHeaderTitle').text() == 'Виноградник' || $('h3#js_mainBoxHeaderTitle').text() == 'Шахта хрусталя')
                 && $('table#shahterovnet_tab').length == 0 && $('#js_cityBread').length == 0){
            $('.premiumOfferBox').remove();
        }
    });
})();
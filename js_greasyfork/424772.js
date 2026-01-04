// ==UserScript==
// @name         Набор армии ГЛ для секретной вылазки и опасных бандитов в 1 клик
// @namespace    Kam
// @author       Kam /pl_info.php?id=33375
// @version      1.0
// @description  Наборы армии для ГЛ со страницы опасных бандитов на дейли и секретных вылазок
// @include      https://daily.heroeswm.ru/leader/lg_daily.php
// @include      https://daily.heroeswm.ru/wartab*
// @include      https://www.heroeswm.ru/leader_army.php?setkamarmy*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/424772/%D0%9D%D0%B0%D0%B1%D0%BE%D1%80%20%D0%B0%D1%80%D0%BC%D0%B8%D0%B8%20%D0%93%D0%9B%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%BD%D0%BE%D0%B9%20%D0%B2%D1%8B%D0%BB%D0%B0%D0%B7%D0%BA%D0%B8%20%D0%B8%20%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D1%8B%D1%85%20%D0%B1%D0%B0%D0%BD%D0%B4%D0%B8%D1%82%D0%BE%D0%B2%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/424772/%D0%9D%D0%B0%D0%B1%D0%BE%D1%80%20%D0%B0%D1%80%D0%BC%D0%B8%D0%B8%20%D0%93%D0%9B%20%D0%B4%D0%BB%D1%8F%20%D1%81%D0%B5%D0%BA%D1%80%D0%B5%D1%82%D0%BD%D0%BE%D0%B9%20%D0%B2%D1%8B%D0%BB%D0%B0%D0%B7%D0%BA%D0%B8%20%D0%B8%20%D0%BE%D0%BF%D0%B0%D1%81%D0%BD%D1%8B%D1%85%20%D0%B1%D0%B0%D0%BD%D0%B4%D0%B8%D1%82%D0%BE%D0%B2%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==


// сделаем ссылку на набор армии
if( document.location.href == 'https://daily.heroeswm.ru/leader/lg_daily.php' || document.location.href.indexOf('daily.heroeswm.ru/wartab') ){
    drawLinkSetarmy();
}

// наберем. если есть существа
if( document.location.href.indexOf('/leader_army.php?setkamarmy=1') > 0 ){
    setTimeout(setArmyFromUrl, 1000);
}

function drawLinkSetarmy(){
    var badJivotnie = [];

    $('.box_for_set_army_link')
    $('a[target="_blank"][href*="/war.php?"]').closest('tr').find('td:eq(1)').each(function(){
        var cntnr = $('<div class="box_for_set_army_link" style="display: block!important;"></div>').appendTo( $(this) );
        var url = 'https://www.heroeswm.ru/leader_army.php?setkamarmy=1';
        $(this).find('.cre_creature, br').each(function(){
            if( $(this).get(0).tagName == 'BR' ){
                return false;
            }
            $(this).find('img[src*="/portraits/"]').each(function(){
                var jivontoe = $(this).attr('src').match(/portraits\/(.*)\.png/)[1];
                var cnt = $(this).closest('.cre_mon_parent').find('.cre_amount').html();
                if( badJivotnie.indexOf(jivontoe) == -1 ){
                    url += '&' + jivontoe + '=' + cnt;
                }
            });
        });
        cntnr.append( '<a href="'+url+'" target="_blank">Набрать эту армию</a>' );
    });
}

function setArmyFromUrl(){
    army_try_to_reset();

    var params = document.location.href.split('&');
    console.log(params);
    var noChuvi = 0;
    for(var i=1;i<=35;i++){
        if( params[i] ){
            var chelCnt = params[i].split('=');
            console.log(chelCnt);
            chelCnt[0] = chelCnt[0].replace('30','33');
            if( $('div.creature_slider_portrait img[src*="/' + chelCnt[0] + '.png"]').length ){
                console.log( idChuviList );
                var idChuviList = $('div.creature_slider_portrait img[src*="/' + chelCnt[0] + '.png"]').prev().attr('id').replace('obj_fon', '');
                obj_army[i-noChuvi]['link'] = idChuviList;
                obj_army[i-noChuvi]['count'] = chelCnt[1];
            }else{
                noChuvi++;
            }
        }else{
            noChuvi++;
        }
    }
    console.log( obj_army );
    show_details();
    if(noChuvi>0){
        //alert('Не найдено юнитов: '+noChuvi+'');
    }
}
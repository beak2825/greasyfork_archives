// ==UserScript==
// @name         DailyHelper
// @namespace    Kam
// @author       Kam, omne
// @version      1.3
// @description  Набор армии с ГЛ опасных и ивента
// @include      https://daily.heroeswm.ru/leader/lg_daily.php*
// @include      https://daily.heroeswm.ru/wartab*
// @include      https://www.heroeswm.ru/leader_army.php?setkamarmy*
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448666/DailyHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/448666/DailyHelper.meta.js
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
 
    $('.box_for_set_army_link').css('display', 'inline-block');
    let e = document.getElementsByClassName('spoiler-body-1');
    for (let i = 0; i < e.length; i++) {
        e[i].innerHTML = e[i].innerHTML.replace(/\',/, '&set=1\',')
    }
 
    $('a[target="_blank"][href*="/war.php?"]').closest('tr').find('td:eq(1)').each(function(){
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
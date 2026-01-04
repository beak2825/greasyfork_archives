// ==UserScript==
// @name        PHPSEND
// @namespace   adblock-ikar
// @description adblock-ikar
// @grant       unsafeWindow
// @include     https://s*-ru.ikariam.gameforge.com/*
// @include     http://s*-ru.ikariam.gameforge.com/*
// @version     2.9.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/39053/PHPSEND.user.js
// @updateURL https://update.greasyfork.org/scripts/39053/PHPSEND.meta.js
// ==/UserScript==

var sync = true;
var ajaxflags = [];

$(document).on('click', '.button[href*="?action=PiracyScreen"]', function () {
    start();
});

function start(){

    // Глобальные данные

    sync = true;
    //console.log('запуск функции');
    var citylist = [];
    $('div.dropdownContainer li.ownCity').each(function(n){
        citylist[n] = $(this).attr('selectvalue');
    });
    var accid    = window.dataSetForView.avatarId;                          //идентификатор аккаунта
    var citydata = window.dataSetForView.relatedCityData;                   //JSON данные по всем городам
    var keys     = [];
    var cityid   = 0;                                                       //Идентификатор города который выбран
    var coords   = $('span#js_islandBreadCoords').text();
    for(var k in citydata) keys.push(k);
    if($("input#js_cityIdOnChange").attr("value") == "0"){
        cityid = window.bgViewData.currentCityId;
        if(typeof cityid == typeof undefined) cityid = window.dataSetForView.relatedCityData.selectedCity.split("_")[1];
    }else{
        cityid = $("input#js_cityIdOnChange").attr("value");
    }
    if(cityid===0 || $('li:contains("Занятый город")').length || $('li:contains("Оккупированный порт")').length)return;
    //console.log(cityid);
    var name     = $("a[href='?view=optionsAccount&page=account']").text().trim(); //Имя игрока
    var cityname = $('span#js_cityBread').text();
    if(cityname == "" || typeof cityname == typeof undefined) cityname = window.dataSetForView.relatedCityData['city_'+cityid].name;
    //console.log(cityname);
    var wood     = bezmus($('#js_GlobalMenu_wood').text())+'.'+bezmus($('td#js_GlobalMenu_resourceProduction').text());
    var wine     = bezmus($('#js_GlobalMenu_wine').text())+'.'+bezmus($('td#js_GlobalMenu_production_wine').text())+'.'+bezmus($('td#js_GlobalMenu_WineConsumption').eq(0).text());
    var marble   = bezmus($('#js_GlobalMenu_marble').text())+'.'+bezmus($('td#js_GlobalMenu_production_marble').text());
    var crystal  = bezmus($('#js_GlobalMenu_crystal').text())+'.'+bezmus($('td#js_GlobalMenu_production_crystal').text());
    var sulfur   = bezmus($('#js_GlobalMenu_sulfur').text())+'.'+bezmus($('td#js_GlobalMenu_production_sulfur').text());
    var pop      = bezzap($('#js_GlobalMenu_citizens').text());
    var pop_free = bezzap($('#js_GlobalMenu_population').text());
    var ships    = bezzap($('span#js_GlobalMenu_maxTransporters').text());
    var gold     = bezzap($('a#js_GlobalMenu_gold').text())+'.'+bezzap($('td#js_GlobalMenu_gold_Calculation').text());
    var obj = {
        cityes: citylist,
        accid: accid,
        cityid: cityid,
        name: name,
        cityname: cityname,
        coords: coords,
        wood: wood,
        wine: wine,
        marble: marble,
        crystal: crystal,
        sulfur: sulfur,
        pop: pop,
        pop_free: pop_free,
        ships: ships,
        gold: gold,
    };
    // Выбор типо сообщения и данных

    var regexp = /view=([^&]+)/i;
    var GetValue = '';
    var matches = document.location.search.match(regexp);
    if (matches !== null && matches.length > 1) {
        GetValue = regexp.exec(document.location.search)[1];
    }
    //console.log(GetValue+' '+matches);
    if(GetValue=="island"){
        //console.log('запуск на острове');
        if($('.mainContentBox').length){//открытое модальное окно в острове
            var les = $('ul#sidebarWidget p:contains("Уровень:")').next().text();
            var les_vlojeno = bezzap($('ul.resources:eq(2)').text()).trim();
            var donate = 0;
            if($('h3#js_mainBoxHeaderTitle').text() == 'Лесопилка' && les.length > 0 && les_vlojeno.length > 0){
                var targ = $('li.wood');
                $('table.table01 tr').each(function(){
                    if($(this).children('.ownerName').text().indexOf(name) > -1) donate = Number(toformat($(this).children('.ownerDonation').text()));
                });
                if(typeof targ[1] !== typeof undefined){
                    var obj1 = {
                        carier_type: 0,
                        les: les,
                        les_vlojeno: les_vlojeno,
                        acc_donate_f: donate
                    };
                    phpsend(0, obj, obj1);
                }
            }else if(les.length > 0 && les_vlojeno.length > 0){
                $('table.table01 tr').each(function(){
                    if($(this).children('.ownerName').text().trim().indexOf(name) > -1){
                        donate = Number(toformat($(this).children('.ownerDonation').text()));
                    }
                });
                var obj2 = {
                    carier_type: 1,
                    les: les,
                    les_vlojeno: les_vlojeno,
                    acc_donate_m: donate
                };
                //console.log(donate);
                phpsend(1, obj, obj2);
            }else{
                //console.log('это производство в процессе улучшения!');
            }
        }else{
            phpsend(2, obj, '');
        }
    }else if(GetValue=="city"){
        //console.log('запуск в городе');
        var insdata = [];
        for(var i = 0; i < 19; i++){
            var position = $("#position"+i).attr('class').toString();
            var posdata = position.split(' ');
            if(posdata.length === 4){
                if(posdata[2].indexOf("Ground") > 0){
                    insdata[i] = "no_building";
                }else if(posdata[2].indexOf("Site") > 0){
                    var bdata = $('#js_CityPosition'+i+'Link').attr('href').match(/view=[A-Za-z]+/)[0].substr(5);
                    if(jQuery.type($('#js_CityPosition'+i+'Link').attr('title').match(/\([0-9]+\)/)) !== "null"){
                        insdata[i] = bdata + $('#js_CityPosition'+i+'Link').attr('title').match(/\([0-9]+\)/)[0].slice(0, -1).substr(1) + '*';
                    }else{
                        insdata[i] = bdata + '0*';
                    }
                }else{
                    insdata[i] = posdata[2] + posdata[3].substr(5);
                }
            }else{
                insdata[i] = 'locked';
            }
        }
        if(!$('.mainContentBox').length){//не открытое модальное окно в городе
            var obj4 = {
                insdata: insdata
            };
            //console.log('запуск простой записи');
            phpsend(3, obj, obj4);
        }else{
            var kult = '';
            var buhlo = '';
            var museum_lvl = '';
            if($('#js_mainBoxHeaderTitle').text() == "Ратуша"){
                //console.log('запись из ратуши');
                var forest_work = bezzap($("#js_TownHallPopulationGraphResourceWorkerCount").text());
                var spec_work = bezzap($("#js_TownHallPopulationGraphSpecialWorkers").text());
                var scients = $("#js_TownHallPopulationGraphScientistCount").text();
                var monax = $("#js_TownHallPopulationGraphPriestCount").text();
                buhlo = bezzap($("span#js_TownHallSatisfactionOverviewWineBoniServeBonusValue").text());
                kult = Number($("span#js_TownHallSatisfactionOverviewCultureBoniTreatyBonusValue").text().substr(1))/50;
                museum_lvl = Number($("span#js_TownHallSatisfactionOverviewCultureBoniMuseumBonusValue").text().substr(1))/20;
                var obj5 = {
                    forest_work: forest_work,
                    spec_work: spec_work,
                    scients: scients,
                    monax: monax,
                    buhlo: buhlo,
                    kult: kult+'/'+museum_lvl,
                    insdata: insdata
                };
                phpsend(4, obj, obj5);
            }else
                if($('#js_mainBoxHeaderTitle').text() == "Музей"){
                    kult = $("span#val_culturalGoodsDeposit").parent().text().trim();
                    //console.log('запись из музея'+kult);
                    var obj6 = {
                        kult: kult,
                        insdata: insdata
                    };
                    phpsend(5, obj, obj6);
                }else
                    if($('#js_mainBoxHeaderTitle').text() == "Таверна"){
                        //console.log('запись из таверны');
                        buhlo =  bezzap($("span#bonus").text());
                        var obj7 = {
                            buhlo: buhlo,
                            insdata: insdata
                        };
                        phpsend(6, obj, obj7);
                    }else
                        if($('#js_mainBoxHeaderTitle').text() == "Крепость пиратов"){
                            //console.log('запись пиратов');
                            var pir =  bezzap($('div.pirateHeader ul li span.value').eq(0).text());
                            var sila = bezzap($('li.pirateCrew').find('td.value').last().text());
                            var obj10 = {
                                pir: pir,
                                sila: sila,
                                insdata: insdata
                            };
                            console.log('пираты: '+pir+' '+sila);
                            phpsend(9, obj, obj10);
                        }else
                            if($('#js_mainBoxHeaderTitle').text() == "Советник по исследованиям"){
                                var res = [
                                    $('span#js_researchAdvisorNextResearchName0').text(),
                                    $('span#js_researchAdvisorNextResearchName1').text(),
                                    $('span#js_researchAdvisorNextResearchName2').text(),
                                    $('span#js_researchAdvisorNextResearchName3').text(),
                                ];
                                //console.log('запись исследований'+res[0]);
                                var obj8 = {
                                    res: res,
                                    insdata: insdata
                                };
                                phpsend(7, obj, obj8);
                            }else{
                                var obj9 = {
                                    insdata: insdata
                                };
                                phpsend(8, obj, obj9);
                            }
        }
    }
}

function bezzap(str){
    var ret = str.replace(",", "");
    if(!ret) ret = 0;
    return ret;
}

function bezmus(str){
    var ret = str.trim();
    ret = ret.replace(/\r?\n/g, "").replace(/[\s-,]+/,"");
    if(!ret) ret = 0;
    return ret;
}

function toformat(num){
    if(num.match(',')){
        return num.replace(",", "");
    }else{
        return num;
    }
}

function builddatatoformat(str){
    var ret = '';
    for(var j = 0; j < 19; j++) ret+= '&pos' + j + '=' + str[j];
    return ret;
}

function ajaxsender(ids){
    ajaxflags = [0, 0, 0];
    var q = new Date();
    var ret = '';
    $.ajax({
        url: '?view=island&islandId='+ids[0],
        success: function(html){
            var inter = $($.parseHTML(html));
            var a = inter.find('#js_islandTradegoodScrollTitle').html().split(' ');
            a[1] = a[1].replace(/[\(|\)]/g,'');
            var b = inter.find('#js_islandResourceScrollTitle').html().split(' ');
            b[1] = b[1].replace(/[\(|\)]/g,'');
            var c = inter.find('span#js_islandBreadCoords').html();
            ajaxflags[0] = 1;
            ret = ret+'&isl0='+ids[0]+'_'+c+'_'+q.getDate()+'_'+b[1]+'_'+a[0]+a[1];
            //console.log(ret);
            if(ajaxflags[0] == 1 &&
               ajaxflags[1] == 1 &&
               ajaxflags[2] == 1) privateajaxfunc(ret);
        }
    });
    $.ajax({
        url: '?view=island&islandId='+ids[1],
        success: function(html){
            var inter = $($.parseHTML(html));
            var a = inter.find('#js_islandTradegoodScrollTitle').html().split(' ');
            a[1] = a[1].replace(/[\(|\)]/g,'');
            var b = inter.find('#js_islandResourceScrollTitle').html().split(' ');
            b[1] = b[1].replace(/[\(|\)]/g,'');
            var c = inter.find('span#js_islandBreadCoords').html();
            ajaxflags[1] = 1;
            ret = ret+'&isl1='+ids[1]+'_'+c+'_'+q.getDate()+'_'+b[1]+'_'+a[0]+a[1];
            //console.log(ret);
            if(ajaxflags[0] == 1 &&
               ajaxflags[1] == 1 &&
               ajaxflags[2] == 1) privateajaxfunc(ret);
        }
    });
    $.ajax({
        url: '?view=island&islandId='+ids[2],
        success: function(html){
            var inter = $($.parseHTML(html));
            var a = inter.find('#js_islandTradegoodScrollTitle').html().split(' ');
            a[1] = a[1].replace(/[\(|\)]/g,'');
            var b = inter.find('#js_islandResourceScrollTitle').html().split(' ');
            b[1] = b[1].replace(/[\(|\)]/g,'');
            var c = inter.find('span#js_islandBreadCoords').html();
            ajaxflags[2] = 1;
            ret = ret+'&isl2='+ids[2]+'_'+c+'_'+q.getDate()+'_'+b[1]+'_'+a[0]+a[1];
            //console.log(ret);
            if(ajaxflags[0] == 1 &&
               ajaxflags[1] == 1 &&
               ajaxflags[2] == 1) privateajaxfunc(ret);
        }
    });
}

function ajaxsender_score(){
    console.log("ajaxsender_score started");
    $.ajax({
        url: '?view=avatarProfile&avatarId=1',
        success: function(html){
            var sel = html.substring(html.indexOf('changeView')+29, html.indexOf('updateBackgroundData')-8);
            var inter = JSON.parse(sel);
            var res = $($.parseHTML(inter));
            var a = [];
            res.find('.better td.left').each(function(ind){
                a[ind] = $(this).text().replace(/\r?\n?\s?\,/g, "");
            });
            console.log(a);
            console.log(a[0]);
            ret = 'id='+window.dataSetForView.avatarId+'&tot_score='+a[0]+'&stroi_score='+a[1]+'&sci_score='+a[2]+'&gen_score='+a[3]+'&gold_score='+a[4];
            privateajaxfunc(ret);
            console.log("ajaxsender_score done "+ret);
        },
        error: function(){
            console.log("error getting score page");
        }
    });
}

function privateajaxfunc(ret){
    console.log('отправка островов' + ret);
    $.ajax({
        type: 'POST',
        url: 'https://ikatabs.000webhostapp.com/once_per_day.php?',
        data: ret,
        success: function(mes){
            //console.log('yeap');
            console.log(mes);
        },
        error: function(jqXHR, exception){
            console.log('Uncaught Error.\n' + jqXHR.responseText);
        }
    });
}

function phpsend(type, obj, datas){
    //console.log('запуск отправки');
    var str = '';
    switch(type){
        case 0: str = '&carier_type=0&les='+datas.les+'&les_vlojeno='+datas.les_vlojeno+'&acc_donate_f='+datas.acc_donate_f;
            break;
        case 1: str = '&carier_type=1&les='+datas.les+'&les_vlojeno='+datas.les_vlojeno+'&acc_donate_m='+datas.acc_donate_m;
            break;
        case 2: str = '';
            break;
        case 3: str = builddatatoformat(datas.insdata);
            break;
        case 4: str = '&forest_work='+datas.forest_work+'&spec_work='+datas.spec_work+'&scients='+datas.scients+'&monax='+datas.monax+'&buhlo='+datas.buhlo+'&kult='+datas.kult+builddatatoformat(datas.insdata);
            break;
        case 5: str = '&kult='+datas.kult+builddatatoformat(datas.insdata);
            break;
        case 6: str = '&buhlo='+datas.buhlo+builddatatoformat(datas.insdata);
            break;
        case 7: str = '&res0='+datas.res[0]+'&res1='+datas.res[1]+'&res2='+datas.res[2]+'&res3='+datas.res[3]+builddatatoformat(datas.insdata);
            break;
        case 8: str = builddatatoformat(datas.insdata);
            break;
        case 9: str = '&pir='+datas.pir+'*'+datas.sila+builddatatoformat(datas.insdata);
            break;
    }
    var q = new Date();
    if(localStorage.getItem('islandrec') !== null){
        //console.log('0');
        if(q.getDate() != localStorage.getItem('islandrec')){
            if(obj.accid == 2550 && obj.accid != 4976){
                ajaxsender([538, 555, 3776]);
                ajaxsender_score();
                localStorage.setItem('islandrec', q.getDate());
            }else if(obj.accid != 4976){
                ajaxsender_score();
                localStorage.setItem('islandrec', q.getDate());
            }
        }else{
            $.ajax({
                type: 'POST',
                url: 'https://ikatabs.000webhostapp.com/index.php?',
                data:
                'cityes=' + obj.cityes +
                '&acc_id=' + obj.accid +
                '&city_id=' + obj.cityid +
                '&acc_name=' + obj.name +
                '&city_name=' + obj.cityname +
                '&coords=' + obj.coords +
                '&wood=' + obj.wood +
                '&wine=' + obj.wine +
                '&marble=' + obj.marble +
                '&crystal=' + obj.crystal +
                '&sulfur=' + obj.sulfur +
                '&population=' + obj.pop +
                '&population_free=' + obj.pop_free +
                '&ships=' + obj.ships +
                '&gold=' + obj.gold + str,
                success: function(mes){
                    console.log('yeap');
                    if(window.dataSetForView.avatarId == 2550) $('<div id="pirat_pic" style="position:absolute; width: 35px; height:16px;z-index:9999;"><img src="https://s27-ru.ikariam.gameforge.com/skin/board/schriftrolle_offen2.png">'+
                    '<table id="pirat_info" style="display:none;"><tr><td>'+mes+'</td></tr></table>'+
                    '</div>').insertAfter('div#breadcrumbs');
                    //console.log(mes);
                },
                error: function(jqXHR, exception)
                {
                    if (jqXHR.status === 0) {
                        //console.log('Not connect.\n Verify Network.'); //  не включен инет
                    } else if (jqXHR.status == 404) {
                        //console.log('Requested page not found. [404]'); // нет такой страницы
                    } else if (jqXHR.status == 500) {
                        //console.log('Internal Server Error [500].'); // нет сервера такого
                    } else if (exception === 'parsererror') {
                        // ошибка в коде при парсинге
                        //console.log(jqXHR.responseText);
                    } else if (exception === 'timeout') {
                        //console.log('Time out error.'); // недождался ответа
                    } else if (exception === 'abort') {
                        //console.log('Ajax request aborted.'); // прервался на стороне сервера
                    } else {
                        //console.log('Uncaught Error.\n' + jqXHR.responseText); // не знает что это
                    }
                } // error
            });
        }
    }else{
        //console.log('2');
        localStorage.setItem('islandrec', q.getDate());
        ajaxsender([538, 555, 3776]);
        ajaxsender_score();
    }
}

$(document).on("click","div#pirat_pic", function(){
    $('table#pirat_info').toggle();
});

$("#js_CityPosition0Link").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по ратуше');
});

$("div.tavern a").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по таверне');
});

$("div.pirateFortress a").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по пиратке');
});

$("div.museum a").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по музею');
});

$(document).on("click","div#dropDown_js_citySelectContainer li", function(){
    sync = false;
    setTimeout(function(){
        if(!sync)start();
    }, 1500);
    //console.log('клик по списку городов');
});

$("input.button").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по кнопке');
});

$("div#js_islandResourceLinkHover").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по лесу');
});

$("div#js_islandTradegoodLinkHover").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по шахте');
});

$(document).on("click","a#js_buildingUpgradeButton", function(){
    sync = false;
    setTimeout(function(){
        if(!sync)start();
    }, 1500);
    //console.log('клик по кнопке улучшения');
});

$("a#js_GlobalMenu_research").click(function() {
    setTimeout(function(){
        start();
    }, 1000);
    //console.log('клик по исследованиям');
});

$(document).ajaxStop(function() {
    if(!sync){
        start();
        //console.log('ajax сработал быстрее');
    }
});

$(document).ready(function() {
    start();
    //console.log('запуск после оновления');
});
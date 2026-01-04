// ==UserScript==
// @name           Victory: БоброВоз
// @author         BioHazard
// @version        1.01
// @namespace      Victory
// @description    Многоходовочка с Бобрами в главной роли (создает -> завозит -> вывозит -> взрывает)
// @include        /^https?:\/\/virtonomic.\.\w+\/\w+\/main\/company\/view\/\d+\/dashboard$/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373430/Victory%3A%20%D0%91%D0%BE%D0%B1%D1%80%D0%BE%D0%92%D0%BE%D0%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/373430/Victory%3A%20%D0%91%D0%BE%D0%B1%D1%80%D0%BE%D0%92%D0%BE%D0%B7.meta.js
// ==/UserScript==

(function () {
'use strict';

let companyId = location.href.match(/\d+/)[0],
    realm = location.href.match(/(\w+)\/main/)[1],
    arr = [],
    category_id,  //1537 - ювелирка; 1538 - авто; 1531 - прод; 1533 - Одежда; 1538 - авто; 1532 - бакалея; 1535 - ТДД; 1536 - электроника; 1534 - промтовары; 1532 - бакалея; 359854 - аптека; 423621 - детские товары
    destination_id, //склад для вывоза продукции
    i=0,
    storesCount,
    settingsPanel; //количество магазинов

const UNIT_TYPE_ID = 1886; //магазины

{
    $('#childMenu').prepend('<div id="coolPanel">' +
    '<img id="dobro" src="https://d.radikal.ru/d00/1810/b7/6f437cf2d0ec.jpg" width="100px" style="cursor: pointer">' +
    '<div id="dobroSettings" style="display:none; position:absolute; background:#FFFFE0; padding:5px; border:solid 1px black; z-index:99;">' +
    '<label>Количество магазинов: <br><input type="text" size="32" value="500"></label>' +
    '<br>' +
    '<label>Id склада или URL: <br><input type="text" size="32" value=""></label>' +
    '<br>' +
    '<label>Категория: <select>\n' +
        '<option value="1538" selected>Автомобильные товары</option>\n' +
        '<option value="359854">Аптека</option>\n' +
        '<option value="1532">Бакалея</option>\n' +
        '<option value="423621">Детские товары</option>\n' +
        '<option value="1533">Одежда и обувь</option>\n' +
        '<option value="1531">Продукты питания</option>\n' +
        '<option value="1534">Промышленные товары</option>\n' +
        '<option value="1535">Товары для дома</option>\n' +
        '<option value="1536">Электроника</option>\n' +
        '<option value="1537">Ювелирные изделия</option>\n' +
        '</select></label>\n' +
    '<br>\n' +
    '<button id="dobroButton">Творить добро!</button>' +
    '</div>' +
    '</div>');
}

$('#dobro').on('click',function (event) {
    showHide(event);
});

$('#dobroButton').css({'width':'220px', 'background-image':'url("https://virtonomica.ru/img/button/220.gif")', 'height':'24px', 'padding-bottom':'2px', 'border':'0'}).on('click', function () {
    if ($('#dobroSettings input:eq(1)').val()==='') {alert('Требуется ввести ID')}
    else {
        storesCount = +$('#dobroSettings input:eq(0)').val();
        destination_id = convertToNum($('#dobroSettings input:eq(1)').val());
        category_id = $('#dobroSettings select').val();
        $(this).parent().hide();
        createOverlay(storesCount);
        startBuild(); // console.log(storesCount+' '+destination_id+' '+category_id )
    }
});

$(document).on('keydown',function(event){
    if((event.keyCode===27)&&($('#jsProgress')[0].firstChild.data === 'Построено: ')) {
        storesCount = i+1;
        $('#jsWall').add('#jsProgress').add('#myProgress').remove();
        createOverlay(storesCount);
    }
});

function startBuild(){
    if (i===0) {
        $('#jsProgress')[0].firstChild.data = 'Построено: ';
        drawProgress(0, storesCount);
    }
    if (i<storesCount) {
        step1();
    }
    else {collectData();}
}

function step1() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId,
        //async: false,
        data: 'unitCreateData[unit_class]=1885&next=Продолжить+>',
        type: 'post',
        success: function() {
            step2();
        }
    });
}

function step2() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId+'/step2',
        //async: false,
        data: 'unitCreateData[country]=2931&next=Отправить+запрос',
        type: 'post',
        success: function() {
            step3();
        }
    });
}

function step3() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId+'/step3',
        //async: false,
        data: 'unitCreateData[region]=331858&next=Отправить+запрос',
        type: 'post',
        success: function() {
            step4();
        }
    });
}

function step4() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId+'/step4',
        //async: false,
        data: 'unitCreateData[city]=331870&next=Отправить+запрос',
        type: 'post',
        success: function() {
            step5();
        }
    });
}

function step5() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId+'/step4-shop-district',
        //async: false,
        data: 'unitCreateData[district]=2006&next=Отправить+запрос',
        type: 'post',
        success: function() {
            step6();
        }
    });
}

function step6() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId+'/step6',
        //async: false,
        data: 'unitCreateData[produce_bound]=1&next=Отправить+запрос',
        type: 'post',
        success: function() {
            step7();
        }
    });
}

function step7() {
    $.ajax({
        url: 'https://virtonomica.ru/'+realm+'/main/unit/create/'+companyId+'/step8',
        //async: false,
        data: 'why=next&unitCreateData[custom_name]=Магазин',
        type: 'post',
        success: function() {
            i++;
            drawProgress(i, storesCount);
            startBuild();
        }
    });
}

function collectData() {
    $.getJSON('https://virtonomica.ru/api/'+realm+'/main/company/units?id='+companyId+'&unit_type_id='+UNIT_TYPE_ID + '&pagesize=9999', function(data){
        $.each(data['data'], function(key){
            arr.push('https://virtonomica.ru/'+realm+'/main/unit/view/' + key); // key - id всех магазинов
            if (+data['info']['count']===arr.length) {
                i=0;
                $('#jsProgress')[0].firstChild.data = 'Закуплено магазинов: ';
                drawProgress(0,storesCount);
                startFillingStores();
            }
        });
    });
}

function startFillingStores () {
    if (i<storesCount){
        $.ajax({
            url: arr[i],
            type: "POST",
            //async: false,
            data: 'productCategory=' + category_id + '&auto_Order=Автоматическая+закупка',
            success: function(data){
                $('#balance').text($(data).find('.money:first').html());
                if($(data).find('.money:first').html().slice(1).split(' ').join('')<150000){
                    alert('Недостаточно средств на балансе!');
                    startFillingStores();
                }
                else {
                    i++;
                    drawProgress(i,storesCount);
                    startFillingStores();
                }
            }
        });
    }
    else {
        $('#balance').text('');
        startExportGoods();
    }
}

function startExportGoods() {
    $('#jsProgress')[0].firstChild.data = 'Перемещено на склад: ';
    drawProgress(0,storesCount);
    $(arr).each(function(i,item) {
        $.ajax({
            url: item + '/trading_hall',
            async: false,
            success: function(data){
                $(data).find('a[href*="product_move_to_warehouse"]').each(function() {
                    $.ajax({
                        url: this.href,
                        type: 'post',
                        data: 'qty=1000000000&unit=' + destination_id + '&doit=Ok'
                    });
                });
            }
        });
        drawProgress((i+1),storesCount);
    });
    destroyUnits ();
}

function destroyUnits() {
    i=1;
    $('#jsProgress')[0].firstChild.data = 'Взорвано юнитов: ';
    drawProgress(0,storesCount);
    $(arr).each(function(count, item){
        $.ajax({
            url: item.replace(/view/,'close'),
            type: 'POST',
            data: 'close_unit=Закрыть+предприятие',
            success: function () {
                drawProgress(i,storesCount);
                if (i===storesCount) {
                    $('#jsWall').add('#jsProgress').add('#myProgress').fadeOut('slow',function(){$(this).remove();});
                }
                i++;
            }
        });
    });
}

function createOverlay(max) {
    $("<div id='jsWall'></div>").height($(document).height()).css({'cursor': 'default', 'opacity': 0.4,'position': 'absolute','top': 0,'left': 0,'background-color': 'black','width': '100%','z-index': 999}).appendTo("body");
    $('<div id="jsProgress" style="color: black; top: ' + $(window).height() / 2 + 'px; position: fixed; z-index: 999; font-size: 40pt; text-align: center;" >  <span id="jsCurrent"></span>/' + max + '<span id="currentBalance"></span></div>').width($(window).width()).appendTo('body');
    $('<div id="myProgress" style="width: 100%; background-color: grey; border:solid 1px black; z-index: 999;"><div id="myBar" style="width: 0; height: 40px; background-color: blue"></div></div>').appendTo('#jsProgress');
    $('<div id="balance" style="color: black; position: relative; z-index: 999; font-size: 40pt; text-align: center;" ></div>').appendTo('#jsProgress');
}

function drawProgress(curr,max){
    $('#jsCurrent').text(curr);
    $('#myBar').css('width', (curr/max)*100+'%')
}

function convertToNum(data) {
    if(isNaN(data)) return +data.match(/\d+/)[0];
    return +data;
}

function showHide(event) {
    settingsPanel = $('#'+event.target.id+'Settings');
    if(settingsPanel.css('display')==='none'){
        settingsPanel.show('slow');
    }
    else settingsPanel.hide('slow');
}
})(window);
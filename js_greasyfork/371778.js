// ==UserScript==
// @name           Victory: Надиратор (Авто-аукцион)
// @version        2.0
// @namespace      Victory
// @description    Аукционный победятел с блэк-джеком и куртизанками
// @include        http*://virtonomica.ru/*/main/auction/list/unit
// @include        http*://virtonomica.ru/*/main/auction/list/unit/open
// @exclude		   http*://virtonomica.ru/*/main/auction/list/unit/close
// @downloadURL https://update.greasyfork.org/scripts/371778/Victory%3A%20%D0%9D%D0%B0%D0%B4%D0%B8%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%28%D0%90%D0%B2%D1%82%D0%BE-%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371778/Victory%3A%20%D0%9D%D0%B0%D0%B4%D0%B8%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%28%D0%90%D0%B2%D1%82%D0%BE-%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let currentLeader,
        currentPrice,
        timer,
        input,
        timerRandomCheckTime,
        settings = {}, //объект с настройками аукционов
        auctionId, maxBet;

    const multiplier = 1000 * 1000 * 1000 * 1000, //трилл
        user = $('.company').html(),
        insertPlace = $('tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)'),
        aucBox = $('.wborder'),
        buttonDefault = 'border-radius: 4px;\n' +
            'box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.08);\n' +
            'color: #fff;\n' +
            'width:100px;\n' +
            'text-align: center;\n' +
            'font-family: Arial, Helvetica, sans-serif;\n' +
            'font-size: 14px;\n' +
            'padding: 8px 16px;\n' +
            'text-decoration: none;\n' +
            'text-shadow: 0 1px 1px rgba(0, 0, 0, 0.075);\n' +
            'transition: background-color 0.1s linear;\n' +
            'margin-right: 5px',
        borderGreen = '1px solid rgb( 33, 126, 74 )',
        borderRed = '1px solid rgb( 126, 33, 33 )',
        buttonGreen = 'rgb( 43, 153, 91 )',
        buttonGreenHover = 'rgb( 75, 183, 141 )',
        buttonRed = 'rgb( 153, 43, 50 )',
        buttonRedHover = 'rgb( 183, 75, 75 )';

    aucBox.each(function(i,item){
        $(item).children().eq(0).prepend('<input type="checkbox">');
        $(item).children().eq(1).prepend('<input type="text">')
    }); //создание чекбоксов и полей ввода для максимальной ставки

    $('tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1)')
        .prepend('<input id="minCheckTime" type="number" size="3" min="0" max="29" value="5"> - <input id="maxCheckTime" type="number" size="3"  min="0" max="29" value="15"> минут'); //поля для ввода времени между ставками

    $('<button id="startButton">Старт!</button>')
        .appendTo(insertPlace)
        .click(function(){
            redState();
            if ($('#timeTillBet').html()===undefined||'') $('<div style="display: inline" id="timeTillBet"></div>').insertAfter('#stopButton'); //рисовать обратный отсчет только если его не было раньше (иначе будет рисовать новый каждый раз при нажатии на "старт")

            timerRandomCheckTime = 0; //мгновенная ставка

            aucBox.each(function(i,item){
                if ($(item).eq(0).find('.unit_id > input:checked').val()==='on') {
                    auctionId = $(item).eq(0).find('.unit_id').text();
                    $(item).eq(0).find('.unit_id').next().find('input').val()===''?maxBet=Infinity:maxBet=+$(item).eq(0).find('.unit_id').next().find('input').val();
                    settings[auctionId] = maxBet;
                }
            }); //определение значений для объекта settings

            timer = setInterval(function () {
                if (timerRandomCheckTime===0){ //когда таймер доходит до нуля задается новое значение таймеру
                    timerRandomCheckTime = 60*randomInteger($('#minCheckTime').val(), $('#maxCheckTime').val());//новое значение таймера

                    $.each(settings,function(auctionId,maxBet){
                        $.ajax({
                            url:'https://virtonomica.ru/olga/main/auction/view/'+auctionId,
                            success: function (data) {
                                if ($(data).find('tbody').length === 2) { //2 - если аукцион завершен, 3 - если акуцион существует, но нет участников, 4 - аукцион существует, есть участники
                                    console.log('Лот: ' + this.url.match(/\d+/)[0] + ' - Аукцион завершен');
                                }
                                else if ($(data).find('tbody').length === 3) {
                                    currentPrice = toNum($(data).find('tr:nth-child(6) td:nth-child(2)').html());
                                    makeBet (auctionId, currentPrice);
                                    console.log('Данный аукцион еще не облепили жадные мухи, поэтому вы - первый, Сэр!')
                                }
                                else {
                                    currentPrice = toNum($(data).find('tr:nth-child(6) td:nth-child(2)').html());
                                    currentLeader = $(data).find('tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)').html();
                                    if (maxBet*multiplier>currentPrice) {
                                        if (currentLeader !== user) {
                                            makeBet(auctionId,currentPrice);
                                            console.log('Лот: ' + auctionId + ' Пришлось немного попотеть! Ставка перебита: ' + new Intl.NumberFormat('ru-RU').format(currentPrice) + ' | ' + new Date() + ' | Имя козлины: ' + currentLeader);
                                        }
                                        else console.log('Лот: ' + auctionId + ' В Багдаде все спокойно... Однако, придется выложить: ' + new Intl.NumberFormat('ru-RU').format(currentPrice) + ' | ' + new Date());
                                    }
                                    else console.log('Лот: ' + this.url.match(/\d+/)[0] + ' Ну это просто ужас! ' +currentLeader+ ' богаче тебя. :( ');
                                }
                            }
                        });
                    });
                    console.log('--------------------------------------------------------------------------');                        //separator
                }

                $('#timeTillBet').html('Ставка через: '+ formattedTime(timerRandomCheckTime));
                timerRandomCheckTime--;
            }, 1000);

        });

    $('<button id="stopButton">Стопэ!</button>').appendTo(insertPlace)
        .click(function(){
            greenState();
            $('#timeTillBet').html('');
            settings = {};
            clearInterval(timer);
        });

    greenState(); //состояние кнопок в самом начале

    function toNum(str) {
        return parseInt(str.match(/(?:\d+\s)+\d+/)[0].split(' ').join(''));
    }

    function randomInteger(min, max) {
        return (Math.round(+min - 0.5 + Math.random() * (+max - +min + 1)));
    }

    function greenState() {
        $('#startButton')[0].style.cssText=buttonDefault;
        $('#startButton')
            .prop('disabled', false)
            .css({
                'border':borderGreen,
                'background-color':buttonGreen
            })
            .hover(function(){
                $(this).css('background-color',buttonGreenHover)
            }, function(){
                $(this).css('background-color',buttonGreen)
            });

        $('#stopButton')[0].style.cssText=buttonDefault;
        $('#stopButton')
            .prop('disabled', true)
            .off('hover');
    } //активна зеленая кнопка старт, красная стоп отключена

    function redState() {
        $('#stopButton')[0].style.cssText=buttonDefault;
        $('#stopButton')
            .prop('disabled', false)
            .css({
                'border':borderRed,
                'background-color':buttonRed
            })
            .hover(function(){
                $(this).css('background-color',buttonRedHover)
            }, function(){
                $(this).css('background-color',buttonRed)
            });

        $('#startButton')[0].style.cssText=buttonDefault;
        $('#startButton')
            .prop('disabled', true)
            .off('hover');
    }

    function formattedTime (sec) {
        if (sec>60) {
            let minutes, seconds;
            minutes = (sec/60)^0;
            seconds = sec%60;
            if (seconds<10) seconds= '0' + seconds;
            return minutes + ' мин. ' + seconds + ' сек.';
        }
        return sec  + ' сек.';
    }

    function makeBet (auctionId,bet) {
        $.ajax({
            type: 'POST',
            url: 'https://virtonomica.ru/olga/main/auction/view/'+auctionId,
            data: 'bidData[price]=' + bet + '&bidData[accept_conditions]=1&button160="Подать заявку"'
        });
    }

})();
// ==UserScript==
// @name           Victory: Надиратор (Авто-аукцион)
// @version        1.06
// @namespace      Victory
// @description    Побеждатель в аукционах
// @include        http*://virtonomica.ru/*/main/auction/list/unit
// @include        http*://virtonomica.ru/*/main/auction/list/unit/open
// @exclude		   http*://virtonomica.ru/*/main/auction/list/unit/close
// @downloadURL https://update.greasyfork.org/scripts/389832/Victory%3A%20%D0%9D%D0%B0%D0%B4%D0%B8%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%28%D0%90%D0%B2%D1%82%D0%BE-%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389832/Victory%3A%20%D0%9D%D0%B0%D0%B4%D0%B8%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%28%D0%90%D0%B2%D1%82%D0%BE-%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%29.meta.js
// ==/UserScript==



let run = function() {
'use strict';

    function toNum(str) {
        return parseInt(str.match(/(?:\d+\s)+\d+/)[0].split(' ').join(''));
    }

    function randomInteger(min, max) {
        return (Math.round(min - 0.5 + Math.random() * (max - min + 1)))*60*1000;
    }

    let user = $('.company')[0].innerHTML,
        minCheckTime = 4, maxCheckTime = 10, //в минутах
        currentLeader,
        currentPrice,
        timer, i,
        multiplier = 1000 * 1000 * 1000 * 1000, //трилл
        auctionUrl = 'https://virtonomica.ru/olga/main/auction/view/',
        checkboxes,
        input,
        startButt = document.createElement('button'),
        stopButt = document.createElement('button'),
        aucBox = $('.wborder'),
        insertPlace = $('tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)');

    startButt.innerHTML = 'Старт';
    stopButt.innerHTML = 'Стоп';
    insertPlace.append(startButt);
    insertPlace.append(stopButt);
    stopButt.disabled = true;

    for (i = 0; i < aucBox.length; i++) {
        checkboxes = document.createElement('input');
        checkboxes.type = 'checkbox';
        input = document.createElement('input');
        input.type = 'text';
        aucBox[i].cells[0].prepend(checkboxes);
        aucBox[i].cells[1].prepend(input);
    }

//запуск
    startButt.onclick = function () {
        stopButt.disabled = false;
        startButt.disabled = true;

        timer = setInterval(function () {
            for (i = 0; i < aucBox.length; i++) {
                if (aucBox[i].cells[0].firstChild.checked) {
                    sessionStorage.setItem(aucBox[i].cells[0].textContent, aucBox[i].cells[1].firstChild.value);
                    if (sessionStorage.getItem(aucBox[i].cells[0].textContent) === '') sessionStorage.setItem(aucBox[i].cells[0].textContent, Infinity);

                    $.ajax({
                        url: auctionUrl + aucBox[i].firstElementChild.firstElementChild.nextSibling.data,
                        success: function (data) {
                            if ($(data).find('tbody').length === 2) {
                                console.log('Лот: ' + this.url.match(/\d+/)[0] + ' - Аукцион завершен');
                            }
                            else {
                                currentPrice = toNum($(data).find('tr:nth-child(6) td:nth-child(2)')[0].innerHTML);
                                currentLeader = $(data).find('tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)')[0].innerHTML;

                                if (sessionStorage.getItem(this.url.match(/\d+/)[0])*multiplier > currentPrice) {
                                    if (currentLeader !== user) {
                                        $.ajax({
                                            type: 'POST',
                                            url: this.url,
                                            data: 'bidData[price]=' + currentPrice + '&bidData[accept_conditions]=1&button160="Подать заявку"'
                                        });
                                        console.log('Лот: ' + this.url.match(/\d+/)[0] + ' Ставка перебита: ' + new Intl.NumberFormat('ru-RU').format(currentPrice) + ' | ' + new Date() + ' | Имя козлины: ' + currentLeader);
                                    }
                                    else {
                                        console.log('Лот: ' + this.url.match(/\d+/)[0] + ' Усё в порядке сэр! ' + new Date())
                                    }
                                }
                                else {
                                    console.log('Лот: ' + this.url.match(/\d+/)[0] + ' Превышена максимальная цена' + ' | Имя зажиточного козлины: ' + currentLeader);
                                }
                            }
                        }
                    });
                }
            }
                //separator
                console.log('--------------------------------------------------------------------------');
        }, randomInteger(minCheckTime, maxCheckTime));
    };

//прерывание
    stopButt.onclick = function () {
        startButt.disabled = false;
        stopButt.disabled = true;
        clearInterval(timer);
    };
};

// Доступ к DOM
let script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
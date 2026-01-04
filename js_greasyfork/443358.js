// ==UserScript==
// @name         4_Sort short (proinfinity.fun)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Sort short proinfinity faucet
// @author       Grizon
// @match        https://proinfinity.fun/sl*
// @icon         https://proinfinity.fun/Images/Logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443358/4_Sort%20short%20%28proinfinityfun%29.user.js
// @updateURL https://update.greasyfork.org/scripts/443358/4_Sort%20short%20%28proinfinityfun%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
  setTimeout(function() {

 //Шорты без капчи. Идут один за другим (в порядке очереди).
 //Шорты разделены пустой строкой и состоят из двух строк.
 //В конце второй строки после "//"(два слеша) название шорта для ориентации и контроля.
 //Если нужно удалить шорт из переборщика, то удаляем две строчки (от знака восклицания до названия шорта включительно) - шорт воспроизводится не будет.

  	if (document.querySelector('tr[data-row-key="PQ3DBsldW6R"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="PQ3DBsldW6R"] > td:nth-child(6) > button').click(); //ZoroFly

    else if (document.querySelector('tr[data-row-key="HBOycbE0Ynq"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="HBOycbE0Ynq"] > td:nth-child(6) > button').click(); //MoroFly

    else if (document.querySelector('tr[data-row-key="s2hkt424tTJ"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="s2hkt424tTJ"] > td:nth-child(6) > button').click(); //Ouo

    else if (document.querySelector('tr[data-row-key="tOMf_LYVQMq"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="tOMf_LYVQMq"] > td:nth-child(6) > button').click(); //WoroFly

    else if (document.querySelector('tr[data-row-key="rcgDLSotmhh"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="rcgDLSotmhh"] > td:nth-child(6) > button').click(); //PoroFly

    else if (document.querySelector('tr[data-row-key="1Psa4sANCdQ"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="1Psa4sANCdQ"] > td:nth-child(6) > button').click(); //Fameen

    else if (document.querySelector('tr[data-row-key="qIupHynWRc7"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="qIupHynWRc7"] > td:nth-child(6) > button').click(); //Yameen

    else if (document.querySelector('tr[data-row-key="PcKeaDTYMB2"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="PcKeaDTYMB2"] > td:nth-child(6) > button').click(); //Gameen

    else if (document.querySelector('tr[data-row-key="Z3_C5qVazZP"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="Z3_C5qVazZP"] > td:nth-child(6) > button').click(); //GMoro

    else if (document.querySelector('tr[data-row-key="WlszDtTzcTA"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="WlszDtTzcTA"] > td:nth-child(6) > button').click(); //GPoro

    else if (document.querySelector('tr[data-row-key="oiuridAWF8c"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="oiuridAWF8c"] > td:nth-child(6) > button').click(); //GZoro

    else if (document.querySelector('tr[data-row-key="n5nX72jr8-f"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="n5nX72jr8-f"] > td:nth-child(6) > button').click(); //GWoro

    else if (document.querySelector('tr[data-row-key="lEYIM4e4rKs"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="lEYIM4e4rKs"] > td:nth-child(6) > button').click(); //Wizzly

    else if (document.querySelector('tr[data-row-key="AHgaDsF2Nq"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="AHgaDsF2Nq"] > td:nth-child(6) > button').click(); //FoxLink

    else if (document.querySelector('tr[data-row-key="P21U2WSfhi"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="P21U2WSfhi"] > td:nth-child(6) > button').click(); //ZoxLink

    else if (document.querySelector('tr[data-row-key="auAwrIvrGL"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="auAwrIvrGL"] > td:nth-child(6) > button').click(); //MoxLink

    else if (document.querySelector('tr[data-row-key="QdtoCOWQo9"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="QdtoCOWQo9"] > td:nth-child(6) > button').click(); //BoxLink

    else if (document.querySelector('tr[data-row-key="hLQkxAV2LM"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="hLQkxAV2LM"] > td:nth-child(6) > button').click(); //MotoLy

    else if (document.querySelector('tr[data-row-key="iE2f0di3aq"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="iE2f0di3aq"] > td:nth-child(6) > button').click(); //PotoLy

    else if (document.querySelector('tr[data-row-key="tHDpXP-rjg"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="tHDpXP-rjg"] > td:nth-child(6) > button').click(); //KotoLy

// Шорты с ре-капчей. Идут один за другим (в порядке очереди).
// Шорты разделены пустой строкой и состоят из двух строк.
// В конце второй строки после "//"(два слеша) название шорта для ориентации и контроля.
// Необходимо в переборщик втавить самостоятельно те шорты, которые необходимо воспроизводить.
//
// Инструкция по добавлению шортов:
// 1.Чтобы вставить копируем две строки шорта полностью и через пустую строку вставляем в код;
// 2.После "//"(два слеша) пишем название шорта, чтоб не запутаться;
// 3.В первой и второй строке присутствует индивидуальный ключ шорта (в кавычках после тега data-row-key), берем его с сайта на тот шорт, который нужен.
//  3.1.На сайте кликаем ПКМ по названию шорта и выпираем пункт меню Inspect (обычно последний);
//  3.2. В открывшейся консоли видим дерево кода с подсветкой названия шорта внутри тегов;
//  3.3. Выше на строку находится тег <tr data-row-key="НУЖНЫЙ_КОД" class="ant-table-row ant-table-row-level-0">
//  3.4. Копируем НУЖНЫЙ_КОД и вставляем в скрипт между кавычек в обе строки в теге data-row-key.
//
// По необходимости повторяем инструкцию с 1 по 3.4 пункт.
// Сохраняем изменения кода (Меню Файл-Сохранить)

//Пример шорта с ре-капчей (нужно скопировать обе строки):
    else if (document.querySelector('tr[data-row-key="uVTWks3-3Jh"] > td:nth-child(6) > button'))
    document.querySelector('tr[data-row-key="uVTWks3-3Jh"] > td:nth-child(6) > button').click(); //FCLK



//Копируем код до этой строки.
  }, 7000);
  setTimeout(function() {
      window.location.reload();
  }, 21000);
})();
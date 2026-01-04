// ==UserScript==
// @name         Scryfall Deck Cat
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Cat maker ))
// @author       kaur
// @match        https://scryfall.com/*/decks*
// @icon         https://www.google.com/s2/favicons?domain=scryfall.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/438495/Scryfall%20Deck%20Cat.user.js
// @updateURL https://update.greasyfork.org/scripts/438495/Scryfall%20Deck%20Cat.meta.js
// ==/UserScript==

var thStyles = {
    "backgroundColor": "#2B253A",
    "padding": "6px 0px 6px 10px",
    "color": "#fff"
};

var tableStyles = {
    "max-width": "100%",
    "width": "100%",
    "margin-left": "0"
};

$(".control-panel-table thead").addClass("catless_table"); //добавление класса первой шапке
$(".control-panel-table > tbody > tr").each(function() { //перебор строк таблицы
    var deckLink = $(this).find("td:first > a"); // ищем строку с названием колоды
    var CategoryName = deckLink.text(); // преобразуем в текст
    CategoryName=CategoryName.substring(CategoryName.lastIndexOf("[") + 1,CategoryName.lastIndexOf("]")); //обрезаем категорию по квадратным скобкам

    if (CategoryName!="") {
        if (!$("*").is("."+CategoryName.toLowerCase()+"_table")) { //проверяем наличие категории, если нет - создаем
            $(".catless_table").before("<thead class='"+CategoryName.toLowerCase()+"_table'><tr><th>["+CategoryName+"] Deck</th> <th>Colors</th> <th>Owner</th> <th>Last Updated</th> <th></th></tr></thead> <tbody></tbody>");
        }
        $("."+CategoryName.toLowerCase()+"_table + tbody").append(this); //аппенд строки в соответствующей категории
    }
    $(".control-panel-table").css(tableStyles);
    $(".control-panel-table th").css(thStyles);//стили заголовков
    //очистка названий колод от категорий
    var new_deckLink = deckLink.html().replace("["+CategoryName+"]","");
    deckLink.html(new_deckLink);
});
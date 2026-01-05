// ==UserScript==
// @encoding utf-8
// @name Anti-AntiAdblock CNEWS.RU
// @name:ru Анти-антиадблок CNEWS.RU
// @description Remove annoying fullscreen block which hides page when I use adblock on cnews.ru
// @description:ru Удаляет ебучую заглушку на весь экран с просьбой отключить блокираторы рекламы, когда юзается адблок на cnews.ru
// @include http://www.cnews.ru/*
// @namespace cnews
// @author AdHater
// @copyright AdHater
// @version 2.1.0
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/14004/Anti-AntiAdblock%20CNEWSRU.user.js
// @updateURL https://update.greasyfork.org/scripts/14004/Anti-AntiAdblock%20CNEWSRU.meta.js
// ==/UserScript==

// Изначально скрипт слеплен на скорую руку в бешеной ярости от идиотизма редакции cnews!!!
// cnews.ru ввели антиадблок. Внедренный в html скрипт генерирует через 2 секунды после window.load заглушку, если не может найти некоторые рекламные ID блоков (если не находит, генерит сам и проверяет скрыт ли блок адблоком).
// id у div-заглушек рандомные, местоположение div скачет, поэтому adblock не работоспособен в этом случае.
// Так как скрипт вставляет говно через 2 с, то будем перехватывать событие вставки от 1 с до 3 с после load, а создаваемые элементы в эти 2 секунды просто прибивать.


window.addEventListener("load", noNodeInsertManager, false);

/* Управляет блоком ДОМа, выбирает метод удаления узлов, заряжает таймеры для исполнения */
function noNodeInsertManager() {

    var timeToBlock = 1000; // Время от load до начала блока ДОМ
    var timeToUnblock = 3000; // Время от load до окончания блока ДОМ
    var DOMMutationObserver;

    //Выбирается метод удаления узлов
    if (window.MutationObserver) { // Есть поддержка в браузере MutationObserver (ФФ14+, Хр27+, О15+, ИЕ11+, Сф6.1+), то юзаем его
        DOMMutationObserver = new MutationObserver(observerCallback);
        var options = { childList: true }; // Настройка MutationObserver - он будет наблюдать только добавление/удаление узлов!
    } else  { // Нет поддержки - в таймаутах используется событие DOMNodeInserted. Медленно, но работает в более старых браузерах.
        console.warn("Поддержки мутаторов нет. Обновите ваш говнобраузер!");
    }

    var a = setTimeout(function () { // Таймаут старта полезного действия этого скрипта
        if (DOMMutationObserver) {
            DOMMutationObserver.observe(document.body, options); // Наблюдаем добавление/удаление узлов в body
        } else {
            document.body.addEventListener("DOMNodeInserted", killNode); // Начинаем слушать события добавления в DOM после полной загрузки страницы. Если же начать слушать с загрузки документа, то блочатся ещё несколько вставок, они наверное полезные, я не хочу их трогать.
        }
    }, timeToBlock);

    var b = setTimeout(function () { // Таймаут окончания полезного действия этого скрипта
        if (DOMMutationObserver) {
            DOMMutationObserver.disconnect();
        } else {
            document.body.removeEventListener("DOMNodeInserted", killNode);
        }
    }, timeToUnblock);
}

/* Коллбэк для MutationObserver. Удаляет все добавленные в ДОМ элементы. */
function observerCallback(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type == "childList") { // Да, в options наблюдателя задано наблюдать добавление/удаление узлов, но мало ли какой мутатор сюда придёт?
            for (var i = 0; i < mutation.addedNodes.length; i++) { // mutation.addedNodes это объект-коллекция NodeList, это не массив, нельзя перебирать его через forEach
                mutation.addedNodes[i].remove(); // REMOVE KEBAB!!11
            }
        }
    });
}

/* Удаляет создаваемый элемент по событию DOMNodeInserted */
function killNode(nodeEvent) {
    nodeEvent.target.remove(); // REMOVE KEBAB!!11
}

// ==UserScript==
// @encoding utf-8
// @name Auto-rating (stars) in news on overclockers.ru
// @name:ru Автопростановка рейтинга статьям и новостям от определённых авторов на overclockers.ru
// @description Do you hate authors like Phoenix or Alina and do you want to set 1-star rating? Do you like Mindango or other authors and do you want to set 5-star rating to them? You can set auto-rating of these news. Set author (author: "Аuthor") and his rating (rating: 1 or rating: 5) in array RATINGS, then enjoy!
// @description:ru Ненавидите статьи и новости от авторов Phoenix и Alina, и хотите ставить всегда 1 звезду рейтинга? Может быть, любите автора Mindango и ставите ему всегда 5 звёзд рейтинга? Теперь этот скрипт будет ставить рейтинг автоматом, основываясь на нике автора! После установки скрипта НАСТРОЙТЕ ЕГО, открыв код: добавьте в объект RATINGS имя автора (author: "author") и его рейтинг (rating: 1  или  rating: 5), после наслаждайтесь автоединицам фениксу! По-дефолту настроено на 1 звезду для феникса и алины.
// @include http://www.overclockers.ru/*
// @namespace overclockers
// @author AdHater
// @copyright AdHater
// @version 1.0.1
// @license MIT
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/14300/Auto-rating%20%28stars%29%20in%20news%20on%20overclockersru.user.js
// @updateURL https://update.greasyfork.org/scripts/14300/Auto-rating%20%28stars%29%20in%20news%20on%20overclockersru.meta.js
// ==/UserScript==

// Массив с объектами на каждого автора. Скопируйте блок с фигурными скобками и вставьте своего автора и рейтинг для него.
// После закрывающей фигурной скобки должна быть запятая, но запятой не должно быть после ПОСЛЕДНЕЙ закрывающей скобки!
// Фишка - в ПЕРВОМ объекте в качестве имени автора укажите author: "*" и соответствующий рейтинг, и тогда скрипт будет ставить этот рейтинг ВСЕМ авторам без разбора!
var RATINGS = [
    {
        author: "Phoenix",
        rating: 1
    },
    {
        author: "Alina",
        rating: 1
    },
    {
        author: "Вставь сюда своего автора и рейтинг для него!", // author и rating разделяются запятой!
        rating: 5
    }, // Запятая обязательна как разделитель между объектами
    {
        author: "Вставь сюда своего автора и рейтинг для него! ", // author и rating разделяются запятой!
        rating: 1
    } // После последней скобки запятой быть не должно!
];

var rateIt = []; // Сюда будут набиваться ссылки нодов для прокликивания

var w = window.addEventListener("load", init, false);

/**
 * Работаем сразу после события загрузки страницы.
 */
function init() {
    createNodesToClick(); // Ищем
    setTimeout(clicker, 1000); // Прокликиваем через 1 с все сразу. Без задержки между кликами, всё и так хорошо работает
}

/**
 * Получает из статьи, новости, списка новостей имена авторов и объекты звёзд для клика по ним. В конечном итоге запихивает ссылку на ноду для клика в массив для прокликивания
 */
function createNodesToClick() {
    // В списке новостей новости заключены вот в такие дивы. В обычных новостях и статьях их нет.
    var listItem = document.getElementsByClassName("list_item");
    var nodeToClick;

    if(listItem && listItem.length > 0) { // Перебираем новости в списке новостей
        console.log("В списке новостей %s новостей", listItem.length);
        for (var i = 0; i < listItem.length; i++) {
            nodeToClick = searchAuthorsAndSetStars(listItem[i]);
            if (nodeToClick) rateIt.push(nodeToClick);
        }

    } else { // Простая новость или статья
        nodeToClick = searchAuthorsAndSetStars();
        if (nodeToClick) rateIt.push(nodeToClick);
    }
}

/**
 *  Ищет в переданной стартовой ноде имя автора, ноды рейтинга, после выбирает нужный рейтинг и осуществляет поиск нужной звезды
 *
 * @param {Object} searchIn Нода для начала поиска. Если нода не передана, то подразумеваем document.
 * @return {Object} Возвращает ссылку на ноду, которая пригодна для прокликивания, если ноду удалось найти. Иначе возвращает null;
 */
function searchAuthorsAndSetStars(searchIn) {
    searchIn = searchIn || document;
    var setRatingTo;
    var returnNode;
    var authorName = searchIn.getElementsByClassName("name")[0].textContent; // Имя автора. Для каждой новости есть только 1 такая нода

    if (authorName) {
        var voteStars = searchIn.getElementsByClassName("votestars")[0]; // span с img-звёздами. Для каждой новости есть только 1 такой span
        if (voteStars) {
            // Пояснение логики. У span[class=votestars] есть id, который составлен в виде "vote<номер_статьи>". У вложенных в него img-звёзд назначен id в виде "vote<номер_статьи>-<рейтинг>".
            // Отсюда метод: получаем id для span[class=votestars], например "vote71597", ищем в заданном массиве RATINGS по автору его рейтинг (например 5) и составляем id img-звезды в такую строку "vote71597-5"
            // Ищем ноду по этому id, и возвращаем ссылку на неё
            var voteStarsId = voteStars.id;

            for (var i = 0; i < RATINGS.length; i++) {
                if (RATINGS[0].author == "*") { // Обработка специального случая, когда автор == *, что означает использовать единый рейтинг для всех авторов
                    setRatingTo = RATINGS[0].rating;
                    returnNode = document.getElementById(voteStarsId + '-' + setRatingTo); // Возвращает ссылку на img-звезды с нужным рейтингом
                    if (returnNode) { return returnNode; }
                }

                if (RATINGS[i].author == authorName) { // Простой поиск имени автора
                    setRatingTo = RATINGS[i].rating;
                    returnNode = document.getElementById(voteStarsId + '-' + setRatingTo); // Возвращает ссылку на img-звезды с нужным рейтингом
                    if (returnNode) { return returnNode; }
                }
            }
        }
    }

    if (!returnNode) {
        return null; // Функция должна вернуть что-либо обязательно. Если что-то тут пошло не так или ничего не найдено, то возвращается null
    }
}

/**
 * Просто прокликивает все ноды в массиве rateIt.
 */
function clicker() {
    for (var i = 0; i < rateIt.length; i++) {
        rateIt[i].click();
    }
}
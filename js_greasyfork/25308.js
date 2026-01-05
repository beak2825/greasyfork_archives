// ==UserScript==
// @name        Event Track Helper
// @namespace   murr
// @include     http://clanner.ru/revelation/clanner.php*
// @include     https://revelationonline.su/maps/*
// @version     1.2.3
// @grant       none
// @description Миру - Murr! Отслеживание активностей для Revelation
// @icon        http://murr.su/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/25308/Event%20Track%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/25308/Event%20Track%20Helper.meta.js
// ==/UserScript==

if (typeof $ == "undefined") var $ = jQuery;

var baseOffset = 3; //Сервера находятся в зоне +3 GMT

var my_level = $('[name=newlevel]').val();

/**
 * Определение приоритета активности в зависимости от дня недели
 * @param base
 * @returns {number}
 */
var get_priority_by_weekend = function (base) {
    var d = (new Date).getDay();
    if (d == 0) d = 7;
    var result = (base - d);
    result = (result<1)?1:result;
    return result;
};

// возвращает cookie с именем name, если есть, если нет, то undefined
var getCookie = function(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

/**
 * Получение ближайшего следующего за текущим игрового времени
 * @param game_time игровое время
 * @param next найти момент следующий за текущим / или наоборот
 * @returns {*} реальное время
 * @constructor
 */
var GetRealTimeFromGameTime = function (game_time, next = true) { // 7
    //игровой день начинается в 2n+1 реального времени допустим это 7 часов игрового времени
    var date = new Date;
    //узнаем какое сейчас игровое время
    now_hour = date.getHours();
    now_min = date.getMinutes();
    game_hour = getGameHours(now_hour, now_min);//23

    if (next){
        diff  = game_time - game_hour; //разница между текущим временем и необходимым временем
        if (diff < 0) diff+=24;
    }
    else{
        diff  = (game_time - game_hour);
        if (diff > 0) diff-=24;
    }
    date.setMinutes(now_min+diff*5);
    need_hour = date.getHours();
    need_min = date.getMinutes();
    var _time = need_hour+':'+need_min;
    return _time;
};

var getGameHours = function (real_hour ,real_minutes=0) {
    game_hour = (real_hour*12+19 + (real_minutes / 5 | 0) ) % 24;
    return game_hour;
};

var events = [
    {
        name:"Гильдейска 10-ка и рулетка Астролога / Прокачка ульт",
        alt_names:"Гильдейские задания, задания с доски кланнхолла, гильдейские перевозки",
        id: "guild10",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5480,-1927",
        lvl:30,
        priority: function(){
            return 0;
        },
        max:1,
        type:"dayly",
        ppl:1
    },
    {
        name:"Гильдийские перевозки",
        alt_names:"Гильдийские перевозки",
        id: "guild_pak",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5480,-1927",
        lvl:30,
        priority: function(){
            return 10;
        },
        max:1,
        type:"dayly",
        ppl:1
    },
    {
        name:"Башня богов",
        alt_names:"Соло башня",
        id: "exp",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "600,-1835",
        lvl:20,
        priority: function(){
            return 0;
        },
        max:1,
        type:"dayly",
        ppl:1
    },
    {
        name:"Экзо / Задания Хранителей / Битва с демонами",
        alt_names:"Экзорцизм / ПВЕ репа / Зачистка",
        id: "exo",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5252,52",
        lvl:30,
        priority: function(){
            return 0;
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Паучиха 35+ /треня / ОС",
        alt_names:"Туманная Долина/Королева пауков 35+ / Обитель страданий",
        id: "spider35",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "4111,1482",
        lvl:35,
        priority: function(){
            return 0;
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Паучиха 45+ / обычка / ОС",
        alt_names:"Королева пауков 45+/ Обитель страданий Пещеры",
        id: "spider45",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "4111,1482",
        lvl:45,
        priority: function(){
            result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Паучиха 60+ / сложка / ОС",
        alt_names:"Королева пауков 60+/ Обитель страданий Осада / 10 ppl",
        id: "spider60",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "4111,1482",
        lvl:60,
        priority: function(){
            return get_priority_by_weekend(10);
        },
        max:2,
        type:"weekly",
        ppl:10
    },
    {
        name:"Брактеат",
        alt_names:"Квест на руны для брактеата",
        id: "pizza60",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "6144,-384",
        lvl:40,
        priority: function(){
            return get_priority_by_weekend(10);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Убить яйцо",
        alt_names:"Тамагги",
        id: "tamaggi",
        start: function(){//вычисление даты начала события
            days = 6-(new Date()).getDay();
            if (days==1) return calcTime('23:59');
            if (days>1) return (days-1)*1000*60*60*24+calcTime('23:59');
            return calcTime('00:00');//TODO
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();//TODO
        },
        coords: "5446,-1958",
        lvl:20,
        priority: function(){
            return get_priority_by_weekend(16);
        },
        max:1,
        type:"weekly",
        ppl:2
    },
    {
        name:"Обезьяна 20+",
        alt_names:"Горилла / Макака/ Затерянный Город / Крайтос / ЗГ",
        id: "monkey20",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "4305,-1866",
        lvl:20,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:5,
        type:"dayly",
        ppl:5
    },
    {
        name:"Обезьяна 30+",
        alt_names:"Горилла / Макака / Затерянный Город / Крайтос / ЗГ",
        id: "monkey30",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "4305,-1866",
        lvl:30,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:5,
        type:"dayly",
        ppl:5
    },
    {
        name:"Храм проклятых 35+ / Храм / ХП",
        alt_names:"Егорка / Каибули / Красноголовый / Заброшенный храм / Обычка",
        id: "red35",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "1000,1000",
        lvl:35,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:2,
        type:"dayly",
        ppl:5
    },
    {
        name:"Храм проклятых 40+ / Храм / ХП",
        alt_names:"Егорка / Каибули / Красноголовый / Заброшенный храм / Сложный",
        id: "red40",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5833,-317",
        lvl:40,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Храм проклятых 45+ / Храм / ХП",
        alt_names:"Егорка / Каибули / Красноголовый / Заброшенный храм / Смертельный",
        id: "red45",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "5833,-317",
        lvl:45,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:3,
        type:"weekly",
        ppl:5
    },
    {
        name:"Великая стена / Линкан 50+",
        alt_names:"Стена / Пещера / Обычный / Зеленоглазый / Подземный бастион / Батя / Ликантроп",
        id: "wall50",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-2837,-1558",
        lvl:50,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:2,
        type:"dayly",
        ppl:5
    },
    {
        name:"Великая стена / Линкан 52+",
        alt_names:"Стена / Пещера /Сложная / Зеленоглазый / Подземный бастион / Батя / Ликантроп",
        id: "wall52",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-2837,-1558",
        lvl:52,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Великая стена / Линкан / Обратка 55+",
        alt_names:"Стена / Королевская битва /Резня / Зеленоглазый / Подземный бастион / Батя / Ликантроп",
        id: "wall_reverse",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-2837,-1558",
        lvl:55,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Великая стена / Линкан / Гадмод 55+",
        alt_names:"Стена гадмод / Смертельный / Зеленоглазый / Подземный бастион / 10 ppl / Батя / Ликантроп",
        id: "wall_gad",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "-2837,-1558",
        lvl:55,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:2,
        type:"weekly",
        ppl:10
    },
    {
        name:"Драконья бездна 59+",
        alt_names:"Древний хранитель, легкий / Драконий омут / Омут / Дракон",
        id: "dragon59",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "2828,-640",
        lvl:59,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:3,
        type:"weekly",
        ppl:5
    },
    {
        name:"Драконья бездна 69+",
        alt_names:"Чистилище, обычка / Драконий омут / Омут / Дракон",
        id: "dragon69",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "2828,-640",
        lvl:69,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:3,
        type:"weekly",
        ppl:5
    },
    {
        name:"Драконья бездна 79+",
        alt_names:"Болото, сложный / Драконий омут / Омут / Дракон",
        id: "dragon79",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "2828,-640",
        lvl:79,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:3,
        type:"weekly",
        ppl:5
    },
    {
        name:"Драконья бездна 79+",
        alt_names:"Эпический / Драконий омут 10 ppl / Омут / Дракон",
        id: "dragon_epic",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "2828,-640",
        lvl:79,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"weekly",
        ppl:10
    },
    {
        name:"Драконья бездна 79+",
        alt_names:"Ад / Драконий омут 10ppl / Омут / Дракон",
        id: "dragon_hell",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "2828,-640",
        lvl:79,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"weekly",
        ppl:10
    },
    {
        name:"Башня злых духов 59+",
        alt_names:"Эксповая башня / Башня демонов / Треня / Башня затмения / Башня",
        id: "tower_train",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-1349,3177",
        lvl:59,
        priority: function(){
            return 10;
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Башня злых духов 60+",
        alt_names:"Эксповая башня / Башня демонов/ Сложка / Башня затмения / Башня",
        id: "tewer60",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-1349,3177",
        lvl:60,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Башня злых духов режим войны / Башня демонов",
        alt_names:"Эксповая башня / Обычка / Башня затмения / Башня / Квест на кисточку",
        id: "tower59",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "-1349,3177",
        lvl:59,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:3,
        type:"weekly",
        ppl:5
    },
    {
        name:"Машинариум 60+",
        alt_names:"Роботы / Разведка",
        id: "mech60",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-3716,-4168",
        lvl:60,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:2,
        type:"dayly",
        ppl:5
    },
    {
        name:"Машинариум 62+",
        alt_names:"Роботы Обычка",
        id: "mech62",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-3716,-4168",
        lvl:60,
        priority: function(){
            result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Машинариум 65+",
        alt_names:"Роботы Божественный 10 ppl",
        id: "mech_gad_10",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "-3716,-4168",
        lvl:65,
        priority: function(){
            result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"weekly",
        ppl:10
    },
    {
        name:"Машинариум 65+",
        alt_names:"Роботы Божественный 20 ppl",
        id: "mech_gad_20",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "-3716,-4168",
        lvl:65,
        priority: function(){
            result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"weekly",
        ppl:20
    },
    {
        name:"Машинариум 60+",
        alt_names:"Роботы Побег / Хард",
        id: "mech_run",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-3716,-4168",
        lvl:60,
        priority: function(){
            result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:2,
        type:"weekly",
        ppl:5
    },
    {
        name:"Курган мечей 70+",
        alt_names:"Нормальный",
        id: "sword70",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-1788,-3254",
        lvl:70,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:2,
        type:"dayly",
        ppl:5
    },
    {
        name:"Курган мечей 70+",
        alt_names:"Сложный",
        id: "sword70hard",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-1788,-3254",
        lvl:70,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return result;//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"dayly",
        ppl:5
    },
    {
        name:"Курган мечей 75+",
        alt_names:"Божественый 10ppl",
        id: "sword75",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return get_week_end();
        },
        coords: "-1788,-3254",
        lvl:75,
        priority: function(){
            var result = Math.max((my_level - this.lvl)*2,10);
            return get_priority_by_weekend(result);//ценность данжа понижается с ростом уровня
        },
        max:1,
        type:"weekly",
        ppl:10
    },
    {
        name:"Черный рынок 35+",
        alt_names:"Контрабандисты / Фарм таэлей",
        id: "blakmarket",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "1000,1000",
        lvl:35,
        priority: function(){
            return 1
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Корабль (Охота на монстров)",
        alt_names:"Фарм мобов 20+",
        id: "exp0",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5256,-2714",
        lvl:20,
        priority: function(){
            result = (40>my_level)?1:999;
            return  result;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Тарелки (Охота на монстров)",
        alt_names:"Фарм мобов 40+",
        id: "exp0",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "589,2027",
        lvl:40,
        priority: function(){
            result = (55>my_level)?1:999;
            return  result;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Машинариум (Охота на монстров)",
        alt_names:"Фарм мобов 60+",
        id: "exp0",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "-2764,-3731",
        lvl:55,
        priority: function(){
            result = (79>my_level)?1:999;
            return  result;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Баня/спа",
        alt_names:"Парилка / Источники",
        id: "spa",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5661,-1523",
        lvl:25,
        priority: function(){
            return  7;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Забег",
        alt_names:"Догонялки",
        id: "run",
        start: function(){//вычисление даты начала события
            return calcTime('12:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id)
        },
        end: function(){
            return calcTime('23:30');
        },
        coords: "4612,-2618",
        lvl:40,
        priority: function(){
            return  7;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Экспериментальный полигон",
        alt_names:"Полигон",
        id: "experiment",
        start: function(){//вычисление даты начала события
            return calcTime('12:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:30');
        },
        coords: "-1632,-778",
        lvl:30,
        priority: function(){
            return  10;
        },
        max:100,
        type:'dayly',
        ppl:1
    },
    {
        name:"Прыгалки",
        alt_names:"",
        id: "jump",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "4850,-2072",
        lvl:40,
        priority: function(){
            return  7;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Восстановление 15 Очков работы/вдохновения",
        alt_names:"Выпить чаю",
        id: "tea",
        start: function(){//вычисление даты начала события
            var tea = getCookie('tea');
            if (typeof tea !== 'undefined'){
                result = calcTime(tea);
                var now = +new Date();
                if (result< now) result+=24*60*60*1000;
                return (result);
            }

            else
                return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            var tea = getCookie('tea');
            if (typeof tea !== 'undefined'){
                result = calcTime(tea);
                var now = +new Date();
                if (result< now) result+=24*60*60*1000;
                return (result);
            }

            else
                return calcTime('00:00');
        },
        coords: "5005,-1957",
        lvl:20,
        priority: function(){
            var tea = getCookie('tea');
            if (typeof tea !=='undefined')
                var time = tea.split(':');
            else
                return 1;
            my_time = parseInt(time[0]);
            need_time = (new Date).getHours();

            if (my_time < need_time) my_time+=24;
            return (my_time - need_time)*4;
        },
        max:1,
        type:'hourly',
        hours:8,
        ppl:1

    },
    {
        name:"Черная репа / Награда за подвиги",
        alt_names:"Сводить нуба в данж",
        id: "black_repa",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "5548,-1977",
        lvl:30,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:3,
        type:'weekly',
        ppl:2
    },
    {
        name:"Наставничество",
        alt_names:"Запилить себе ученика !!!TODO узнать что это и с чем это едят",//TODO
        id: "student",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "1000,1000",
        lvl:40,
        priority: function(){
            return  11;
        },
        max:1,
        ppl:2
    },
    {
        name:"Рыбалка / сферы фей",
        alt_names:"резать рыбу",
        id: "fishing",
        start: function(){//вычисление даты начала события
            var now = new Date;
            var next = calcTime(GetRealTimeFromGameTime(8));
            var perv = calcTime(GetRealTimeFromGameTime(8,false));
            var HourInMs = 2*1000*60*60;
            if (now - perv < HourInMs) return perv;
            return next;
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            var now = new Date;
            var next = calcTime(GetRealTimeFromGameTime(20));
            var perv = calcTime(GetRealTimeFromGameTime(20,false));
            var HourInMs = 1000*60*60;
            if (now - perv < HourInMs) return perv;
            return next;
        },
        coords: "5290,-2222",
        lvl:40,
        priority: function(){
            return  9;
        },
        max:1,
        type:'dayly',
        ppl:5
    },
    {
        name:"ПВП Дейлик",
        alt_names:"ежедневный квест",
        id: "pvp_ku",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "1526,1502",
        lvl:40,
        priority: function(){
            return  7;
        },
        max:1,
        type:'weekly',
        ppl:1
    },
    {
        name:"Иди на БГ",
        alt_names:"фармить пвп ",
        id: "pvp",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "1526,1502",
        lvl:40,
        priority: function(){
            var base_priority = 7;
            var result = Math.round(base_priority + (base_priority*2+1) * (this.done()/this.max));
            return  get_priority_by_weekend(result);
        },
        max:99,
        type:'weekly',
        ppl:5
    },
    {
        name:"Задания с доски",
        alt_names:"Лига исследователей",
        id: "adventure",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "5916,-1888",
        lvl:50,
        priority: function(){
            return  9;
        },
        max:999,
        type:'dayly',
        ppl:1
    },
    {
        name:"цепочка 120 кв",
        alt_names:"Торговые поручения",
        id: "120ku",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "5488,-1927",
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"квест Начало прогулки по Сулану",
        alt_names:"квест путешествие от Крошки Айя",
        id: "geo20",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "5881,-1954",
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Получить еженедельный двойной опыт",
        alt_names:"получить 1 час двойного опыта у охотницы на чудовищ<br\>" +
        "Сулан. Торговая площадь",
        id: "double_exp",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "0,-0",//TODO
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Получить/купить еженедельный концентрат",
        alt_names:"получить концентрат для увеличения рейтов<br\>" +
        "Сулан. Торговая площадь",
        id: "multi_exp",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "0,-0",
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Купить Талисман Красной птицы (заточка от +9) - покупается у Кнотта Бао",
        alt_names:"",
        id: "bao9",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "0,-0",
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Купить Слезы Акари (тусклые, яркие и т.д.) - покупаются у Ордена Хранителей",
        alt_names:"",
        id: "tears",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "0,-0",
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Купить Ларец с эмблемой - покупается либо у PvP-интенданта, либо у интенданта Ордена Хранителей",
        alt_names:"",
        id: "casket",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "0,-0",
        lvl:20,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"квест Долгое путешествие",
        alt_names:"квест путешествие от Мастера Вэй (Озерная деревня)",
        id: "geo30",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "5474,-424",
        lvl:30,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"квест Пропавший следопыт",
        alt_names:"квест путешествие от  Следопыта Линга (портал справа от Калахара)",
        id: "geo50",
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return get_week_end();
        },
        coords: "-2268,835",
        lvl:50,
        priority: function(){
            return  get_priority_by_weekend(9);
        },
        max:1,
        type:"weekly",
        ppl:1
    },
    {
        name:"Кладоискательство",
        alt_names:"",
        id: "treasure",
        start: function(){//вычисление даты начала события
            return calc_next_hour('00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calc_next_hour('10');
        },
        coords: "1000,1000",
        lvl:20,
        priority: function(){
            return  11;
        },
        max:1,
        type:"hourly",
        ppl:1
    },
    {
        name:"Фракционные эвенты",
        alt_names:"У грибов / У медведей / у входа в заброшенный храм",
        id: "shildmap",
        start: function(){//вычисление даты начала события
            return calc_next_hour('00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calc_next_hour('20');
        },
        coords: "1000,1000",
        lvl:30,
        priority: function(){
            return  9;
        },
        max:1,
        type:"hourly",
        ppl:1
    },
    {
        name:"Пиратский остров (взять квесты)",
        alt_names:"Остров отчаяния",
        id:'pirates_ku',
        start: function(){//вычисление даты начала события
            return calcTime('00:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('18:59');
        },
        coords: "2175,392",//TODO
        lvl:50,
        priority: function(){
            return  7;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Пиратский остров (выполнение квестов, фарм кентавров)",
        alt_names:"Остров отчаяния",
        id:'pirates_do',
        start: function(){//вычисление даты начала события
            return calcTime('19:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "2175,392",
        lvl:50,
        priority: function(){
            return  9;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
    {
        name:"Купить 4 лучистых топаза и 2 рога за черную репу",
        alt_names:"Ежедневные лимиты",
        id:'day_limits',
        start: function(){//вычисление даты начала события
            return calcTime('19:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return calcTime('23:59');
        },
        coords: "0,0",
        lvl:50,
        priority: function(){
            return  9;
        },
        max:1,
        type:'dayly',
        ppl:1
    },
];
var happening = [
    {
        name:"Начало ОБТ!",
        alt_names:"",
        id:'obt',
        start: function(){//вычисление даты начала события
            return calcTime('17:00');
        },
        done: function(){//завершено ли задание
            return get_done(this.id);
        },
        end: function(){
            return new Date(2016,12,23,17,01);
        },
        coords: "0,0",
        lvl:0,
        priority: function(){
            return  -1;
        },
        max:1,
        type:'dayly',
        ppl:10
    },
];

events = events.concat(happening);
/*TODO
Испытания - где и что да как
RvR рассписание
PvP Арена/БГ - уменьшение важности Арена - начало/конец
Социалка/болталка - где и сполько. (синий дым)
Социалка/сиделка - где и сполько.
*/

/**
 * Получаем дату конца недели
 * @returns {*}
 */
var get_week_end = function () {
    days = 7-(new Date()).getDay();
    if (days==7) days=0;
    if (days==0) return calcTime('23:59');
    if (days>0) return (days*1000*60*60*24)+calcTime('23:59');//TODO
    return calcTime('00:00');
};

/**
 * Получаем разницу в часах в зависимости от часового пояса
 * @returns {number|*}
 */
var get_diff_h  =function () {
    date = new Date();
    currentTimeZoneOffsetInHours = -date.getTimezoneOffset()/60;
    diff_h = baseOffset - currentTimeZoneOffsetInHours;//разница часовых поясов
    return diff_h
};

/**
 * Возвращает время завершения события
 * @param min - время в течение которого оно обычно длиться
 * @returns {*}
 */
var calc_next_hour = function (min) {//сколько минут обычно длится событие
    date = new Date();

    diff_h = get_diff_h();//разница часовых поясов
    my_h = date.getHours();
    if (my_h<10) my_h = '0' +my_h;
    return calcTime(my_h+':'+min)
};

/**
 * Проверка завершено ли событие
 * @param event - id события
 * @returns {*}
 */
var get_done = function (event) {
    result = localStorage.getItem(event);
    if (result==null) result = 0;
    return result;
};

/**
 * Отметка события завершенным
 * @param id события
 * @param val значение
 */
var set_done = function (id,val) {
    localStorage.setItem(id,val);
};

/**
 * обналение событий в зависимости от типа
 * @param type
 */
var del_old_data = function (type) {
    //удаляет данные за день и занеделю
    events.forEach(function(item){
        if (item.type==type || type=='all') localStorage.removeItem(item.id);
    });
    return true;
};

/**
 * Проверка существования куки
 * Если ее нет удаляем все счетчики событий
 * если сегодня понедельник или с момента
 */
var check_cookie = function () {
    if (getCookie('event.dayly')===undefined){//удаляем куку дейликов
        var d = new Date();
        h = 23 - d.getHours() - get_diff_h();
        m = 59 - d.getMinutes();
        s = 59 - d.getSeconds();
        t = h*60*60+m*60+s;
        var date = new Date(new Date().getTime() + t * 1000);
        document.cookie = "event.dayly=1; path=/; expires=" + date.toUTCString();
        del_old_data('dayly');
        if (date.getDay()==2) del_old_data('weekly');//сбрасываем инфу по викликам в понедельник
    }
};

/**
 * нажатие на кнопку участия в активности
 */
$(document).on('click','.js_event_done',function () {
    events =  sort_by_priority(events);
    var id = $(this).attr('name');
    if (id=='tea'){
        var date = new Date(new Date().getTime() + (8+get_diff_h())*60*60 * 1000);//
        h = (new Date).getHours()+(8+get_diff_h());
        if (h>24) h -=24;
        if (h<10) h = "0"+h;
        m = (new Date).getMinutes();
        if (m<10) m = "0"+m;
        document.cookie = "tea="+h+":"+m+"; path=/; expires=" + date.toUTCString();
    }else {
        count = parseInt(get_done(id)) + 1;
        set_done(id, count);
    }
    get_events();
});

/**
 * Нажатие на сброс информации по активностям
 */
$(document).on('click','.reset',function () {
    if (confirm('Вы уверены, что хотите сбросить данные по активностям?'))
        del_old_data('all');//сбрасываем всю инфу
});

/**
 * Эм.... WFT?
 */
$(document).on('click','.map',function () {
    point = $(this).data('point');
    console.log(point);
    localStorage.setItem('point', point);
});


/**
 * перевод текстового представления времени в объект
 * @var time - строковое представление времени
 */
var calcTime = function(time){
	my_time = time.split(':');
	my_h = (my_time[0]);
	my_m = (my_time[1]) ;
	var result = (new Date).setHours(my_h,my_m) ;
	return result
};

/**
 * сортировка по приоритетам
 * @param events
 * @returns {Array}
 */
var sort_by_priority = function (events) {
    var result = [];
    var p = 999;
    max = events.length+1;
    cnt = 0;
    while (cnt<=max) {
        cnt++;
        for (var i = 0; i <= max; i++) {
            if (typeof events[i]!=='undefined' && events[i].priority()<p){
                p = events[i].priority();
                index = i;
            }
        }

        result.push(events[index]);
        delete events[index];
        max = events.length;
        p = 999;
    }
    return result;
};

/**
 * Размещение маркера на карте
 */
var put_my_marker = function () {
    // put your code here to run after script is loaded


    ny = ' http://css-pro.ru/_ld/92/9224.gif';
    if (location.hash !='') {
        var hash = location.hash.replace('#','');
        point = hash.split(',');
        if (Object.prototype.toString.call( point ) === '[object Array]'){
            var transportStone0 =  new L.GeoJSON( [{"type":"Feature","geometry":{"type":"Point","coordinates":point},"properties":{"mark_id"
                :"0000","title":"Я метко!","type":"transportStone"
                ,"npcId":"10004","topIcon":"","actGroupid":"3762","popupContent":"<div id=\"one_mines\">\n<div class=\"header_box\">\n<h3>ТУТ!<\/h3>\n<\/div>","icon":"teleport"}}],{
                coordsToLatLng: coordsToLatLngData,
                onEachFeature: markers_transportStone
            });
            map.addLayer(transportStone0);
            $('.transportStone').click();
            setTimeout(function () {
                //jQuery('#transportStone_0').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_0').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_1').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_2').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_3').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_6').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_7').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_8').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_10').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_11').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_12').click().prop('checked',true).attr('checked','checked');
                jQuery('#npc_13').click().prop('checked',true).attr('checked','checked');

                jQuery('#recommActivity_1').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_4').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_3').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_2').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_9').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_5').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_10').click().prop('checked',true).attr('checked','checked');
                jQuery('#recommActivity_11').click().prop('checked',true).attr('checked','checked');
            },5000);
        }
    }
};

/*
приоритеты 0-9 очень важно, 10-50 важно, 50+ маловажно
*/
$('#lasteventdiv').parent().append('<style>.etimer{font-size:unset}</style><div id="my"></div>');

/**
 * Получить список актуальных событий
 */
var get_events = function () {
    $('#my').html('<button class="reset">reset</button>');
    events.forEach(function(item){
        var start_text ='начало: <span id="event_start_'+item.id+'" class="etimer"></span>';
        if (item.id=='tea')
            var end_text = 'дебафф ';
        else
            var end_text = '';
        end_text += 'конец: <span id="event_'+item.id+'" class="etimer"></span>';
        
        
        if (my_level>=item.lvl && item.done()<item.max){
            if (item.ppl == 10) color = '#8A0808';//10
            if (item.ppl == 5) color = '#DBA901';//5
            if (item.ppl == 2) color = '#868A08';//2
            if (item.ppl == 1) color = '#4B8A08';//1
            $('#my').append('<hr><div>\
			<span><span style="color: '+color+';font-weight: bold">'+item.name+' ('+item.priority()+')</span> <a href="https://revelationonline.su/maps/#'+item.coords+'" target="_blank">карта</a><br/>\
                <span style="font-size: xx-small;">'+item.alt_names +'</span></span><br/>\
                <div style="float: left;">'+start_text +'<br/>\
			'+end_text +'</div>\
			&nbsp&nbsp<button style="float: right;" name='+item.id+' class="js_event_done">'+item.done()+'/'+item.max+'   готово</bytton>\
			</div>\
			<br/>');
            var target_date = new cdtime("event_"+item.id, item.end());
            target_date.data = item;
            target_date.displaycountdown("days", displayCountDownEnd);

            if ($('#event_start_'+item.id).length){
                var target_date = new cdtime("event_start_"+item.id, item.start());
                target_date.displaycountdown("days", displayCountDown);
            }
        }
    });
};

/**
 * Переписываем функцию отображения таймера
 * @returns {string|string}
 */
window.displayCountDownEnd = function (){
    if (this.timesup==false){
        var days = arguments[0];
        var hours = arguments[1];
        var min = arguments[2];
        var sec = arguments[3];
        if ((min+0)<10){min = "0" + min}
        if ((sec+0)<10){sec = "0" + sec}
        
        if  (days>0 && this.data.type=='dayly') days = 0;
        
        if (
            ((hours+0<1)&(days+0<1)&(min+0<30)& this.data.type!='hourly')||
            ((days+0<1) & (hours+0<1) & this.data.type!='hourly')||
            (min+0<10 & this.data.type=='hourly')
        ){
            var displaystring="<font color=red>"+(days*24+hours)+":"+min+":"+sec+"</font>"
        }
        else{
            var displaystring=(days*24+hours)+":"+min+":"+sec
        }
        //var displaystring=(days*24+hours)+":"+min+":"+sec
    }
    else{ //else if target date/time met
        var displaystring="Закончилось";
    }
    return displaystring
};

//Основное тело скрипта
if (location.hostname =='clanner.ru'){
    setTimeout(function () {
        location.reload(true);
    }, 60000*10);

    var logo = $('.logo > a > img');
    logo.attr('src','http://i.imgur.com/QsdTHyb.png').attr('width','130px');
    check_cookie();
    events =  sort_by_priority(events);
    get_events();
}

if (location.hostname =='revelationonline.su') put_my_marker();
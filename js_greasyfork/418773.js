// ==UserScript==
// @name           HuntHelper
// @namespace      https://greasyfork.org/ru/scripts/418773-hunthelper
// @description    Помощник ГО (версия от 2020.12.30)
// @author         achepta
// @version        0.4.5
// @include        https://www.heroeswm.ru/group_wars.php*
// @include        https://www.heroeswm.ru/plstats_hunters.php*
// @include        https://www.heroeswm.ru/home.php*
// @include        https://www.heroeswm.ru/map.php*
// @include        https://www.lordswm.com/group_wars.php*
// @include        https://www.lordswm.com/plstats_hunters.php*
// @include        https://www.lordswm.com/home.php*
// @include        https://www.lordswm.com/map.php*
// @include        http://178.248.235.15/group_wars.php*
// @include        http://178.248.235.15/plstats_hunters.php*
// @include        http://178.248.235.15/home.php*
// @include        http://178.248.235.15/map.php*
// @grant          GM_getValue
// @grant          GM_setValue
// @icon           https://app.box.com/representation/file_version_34029013909/image_2048/1.png?shared_name=hz97b2qwo2ycc5ospb7ccffn13w3ehc4
// @downloadURL https://update.greasyfork.org/scripts/418773/HuntHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/418773/HuntHelper.meta.js
// ==/UserScript==

// Update by CheckT
// небольшая доработка скрипта hwm_GO_exp от ElMarado (Based on script Mantens)
//    - хранение настроек независимо по игрокам
//    - кнопка "пометить всех птиц"
// Оригинал https://greasyfork.org/ru/scripts/11692-hwm-go-exp

(function () {

//****************************************************
    let mob_rus_exp = {   //Cтруктура: [опыт,HP,код,птица]
        "Абордажники": [30, 16, "bpirate", 0],
        "Адепты": [121, 80, "zealot", 0],
        "Адские жеребцы": [136, 50, "nightmare", 0],
        "Адские жнецы": [250, 99, "zhryak", 0],
        "Адские псы": [33, 15, "demondog", 0],
        "Айсберговые элементали": [50, 90, "iceelb", 1],
        "Ангелы": [330, 180, "angel", 1],
        "Арбалетчики": [19, 10, "marksman", 0],
        "Архангелы": [390, 220, "archangel", 1],
        "Архидемоны": [312, 211, "archdemon", 0],
        "Архидьяволы": [311, 199, "archdevil", 0],
        "Архиличи": [110, 55, "archlich", 0],
        "Архимаги": [70, 30, "archmage", 0],
        "Ассасины": [33, 14, "assasin", 0],
        "Ассиды": [53, 30, "assida", 1],
        "Астральные драконы": [310, 150, "ghostdragon", 1],
        "Баньши": [205, 110, "banshee", 0],
        "Бегемоты": [350, 210, "behemoth", 0],
        "Берсерки": [42, 25, "berserker", 0],
        "Бестии": [30, 16, "maiden", 0],
        "Бесы": [6, 4, "imp", 0],
        "Бехолдеры": [33, 22, "beholder", 0],
        "Боевые грифоны": [45, 35, "battlegriffin", 1],
        "Боевые единороги": [135, 77, "silverunicorn", 0],
        "Боевые кентавры": [21, 10, "mcentaur", 0],
        "Боевые маги": [72, 29, "battlemage", 0],
        "Боевые слоны": [120, 100, "slon", 0],
        "Вампиры": [68, 30, "vampire", 0],
        "Вармонгеры": [36, 20, "warmong", 0],
        "Ведьмы-призраки": [30, 20, "cursed_", 1],
        "Ведьмы моря": [70, 35, "priestessup", 0],
        "Великаны": [160, 100, "giant", 0],
        "Великаны-лучники": [130, 100, "giantarch", 0],
        "Великие левиафаны": [300, 250, "upleviathan", 0],
        "Верховные друиды": [101, 38, "ddeld", 0],
        "Вестники смерти": [205, 100, "wraith", 0],
        "Виверны": [170, 90, "wyvern", 1],
        "Визири джиннов": [110, 50, "djinn_vizier", 1],
        "Владычицы тени": [185, 90, "matriarch", 0],
        "Водные элементали": [57, 43, "water", 0],
        "Вожаки": [100, 48, "chieftain", 0],
        "Воздушные элементали": [59, 30, "air", 1],
        "Воины-наёмники": [25, 24, "mercfootman", 0],
        "Воители": [12, 12, "shieldguard", 0],
        "Волшебные драконы": [800, 500, "faeriedragon", 1],
        "Воры-колдуны": [35, 30, "thiefmage", 0],
        "Воры-разведчики": [35, 45, "thiefwarrior", 0],
        "Воры-убийцы": [35, 40, "thiefarcher", 0],
        "Высшие ангелы": [390, 220, "seraph2", 1],
        "Высшие вампиры": [70, 35, "vampirelord", 0],
        "Высшие личи": [100, 55, "masterlich", 0],
        "Гарпии": [29, 15, "harpy", 1],
        "Гарпии-ведьмы": [45, 15, "harpyhag", 1],
        "Гарпунеры": [18, 10, "harpooner", 0],
        "Гигантские ящеры": [25, 25, "lizard_", 0],
        "Гидры": [108, 80, "hydra", 0],
        "Глаза тьмы": [33, 26, "darkeye", 0],
        "Глубоководные черти": [140, 105, "upseamonster", 0],
        "Гниющие зомби": [17, 23, "rotzombie", 0],
        "Гоблины": [5, 3, "goblin", 0],
        "Гоблины-лучники": [9, 3, "goblinarcher", 0],
        "Гоблины-маги": [9, 3, "goblinmag", 0],
        "Гоблины-трапперы": [15, 7, "trapper", 0],
        "Гоги": [13, 13, "gog", 0],
        "Големы смерти": [329, 350, "dgolem", 0],
        "Головорезы": [6, 8, "brute", 0],
        "Горные стражи": [24, 12, "mountaingr", 0],
        "Гремлины": [5, 5, "gremlin", 0],
        "Гремлины-вредители": [9, 6, "saboteurgremlin", 0],
        "Грифоны": [59, 30, "griffon", 1],
        "Громовержцы": [162, 120, "thunderlord", 0],
        "Демонессы": [67, 30, "succubusm", 0],
        "Детёныши ящера": [13, 13, "smalllizard_", 0],
        "Джинны": [103, 40, "djinn", 1],
        "Джинны-султаны": [110, 45, "djinn_sultan", 1],
        "Дикие энты": [210, 175, "savageent", 0],
        "Дочери земли": [72, 35, "eadaughter", 0],
        "Дочери неба": [75, 35, "sdaughter", 0],
        "Древние бегемоты": [390, 250, "abehemoth", 0],
        "Древние мумии": [135, 80, "amummy", 0],
        "Древние энты": [210, 181, "ancienent", 0],
        "Дриады": [20, 6, "sprite", 1],
        "Друиды": [74, 34, "dd_", 0],
        "Духи": [27, 20, "poltergeist", 1],
        "Дьяволы": [245, 166, "devil", 0],
        "Дьяволята": [10, 6, "vermin", 0],
        "Единороги": [124, 57, "unicorn", 0],
        "Железные големы": [33, 18, "golem", 0],
        "Жрецы рун": [59, 60, "runepriest", 0],
        "Жрицы луны": [60, 50, "priestmoon", 0],
        "Жрицы солнца": [70, 55, "priestsun", 0],
        "Защитники веры": [20, 23, "vindicator", 0],
        "Защитники гор": [7, 7, "defender", 0],
        "Зелёные драконы": [350, 200, "greendragon", 1],
        "Земные элементали": [63, 75, "earth", 0],
        "Злая крыса 2020": [20, 20, "rat2020", 0],
        "Злобные глаза": [33, 22, "evileye", 0],
        "Зомби": [11, 17, "zombie", 0],
        "Изумрудные драконы": [400, 200, "emeralddragon", 1],
        "Имперские грифоны": [62, 35, "impergriffin", 1],
        "Инквизиторы": [121, 80, "inquisitor", 0],
        "Искусительницы": [65, 26, "seducer", 0],
        "Ифриты": [200, 90, "efreeti", 1],
        "Ифриты султаны": [250, 100, "efreetisultan", 1],
        "Каменные горгульи": [16, 15, "gargoly", 1],
        "Каменные монстры": [20, 28, "kammon", 0],
        "Камнегрызы": [67, 55, "kamnegryz", 0],
        "Камнееды": [56, 45, "kamneed", 0],
        "Кентавры": [13, 6, "fcentaur", 0],
        "Князья вампиров": [70, 40, "vampireprince", 0],
        "Колоссы": [350, 175, "colossus", 0],
        "Кони преисподней": [138, 66, "hellstallion", 0],
        "Корсарки": [32, 12, "piratkaup", 0],
        "Корсары": [16, 13, "apirate", 0],
        "Костоломы": [27, 20, "brawler", 0],
        "Костяные драконы": [280, 150, "bonedragon", 1],
        "Кочевые кентавры": [20, 9, "ncentaur", 0],
        "Кошмары": [140, 66, "stallion", 0],
        "Красные драконы": [400, 235, "reddragon", 1],
        "Крестьяне": [5, 4, "paesant", 0],
        "Кристальные драконы": [400, 200, "crystaldragon", 1],
        "Кровавые ящеры": [30, 35, "redlizard_", 0],
        "Кровоглазые циклопы": [500, 235, "bloodeyecyc", 0],
        "Кшатрии ракшасы": [162, 135, "rakshasa_kshatra", 0],
        "Лавовые драконы": [329, 275, "lavadragon", 0],
        "Лазутчики": [20, 10, "scout", 0],
        "Латники": [21, 26, "swordman", 0],
        "Левиафаны": [250, 200, "leviathan", 0],
        "Ледяные элементали": [50, 45, "iceel", 1],
        "Лепреконы": [11, 7, "lepr", 0],
        "Лесные снайперы": [42, 12, "arcaneelf", 0],
        "Лесные хоббиты": [9, 6, "bobbit", 0],
        "Личи": [87, 50, "lich", 0],
        "Ловчие": [34, 15, "stalker", 0],
        "Лучники": [15, 7, "archer", 0],
        "Маги": [63, 18, "mage", 0],
        "Магма драконы": [329, 280, "magmadragon", 0],
        "Магнитные големы": [57, 28, "magneticgolem", 0],
        "Магоги": [16, 13, "magog", 0],
        "Мантикоры": [130, 80, "manticore", 1],
        "Мастера копья": [17, 12, "skirmesher", 0],
        "Мастера лука": [42, 14, "hunterelf", 0],
        "Мегеры": [49, 24, "bloodsister", 0],
        "Медведи": [22, 22, "bear", 0],
        "Медузы королевы": [55, 30, "medusaup", 0],
        "Метатели копья": [11, 10, "spearwielder", 0],
        "Минотавры": [39, 31, "minotaur", 0],
        "Минотавры-стражи": [56, 35, "minotaurguard_", 0],
        "Минотавры-надсмотрщики": [56, 40, "taskmaster", 0],
        "Могильные големы": [400, 400, "dgolemup", 0],
        "Молотобойцы": [12, 9, "gnomon", 0],
        "Монахи": [101, 54, "priest", 0],
        "Морские дьяволы": [300, 190, "piratemonster", 0],
        "Морские черти": [120, 90, "seamonster", 0],
        "Мумии": [115, 50, "mummy", 0],
        "Мумии фараонов": [135, 70, "pharaoh", 0],
        "Мятежники": [10, 7, "enforcer", 0],
        "Наги": [160, 110, "naga", 0],
        "Наездники на верблюдах": [60, 40, "dromad", 0],
        "Наездники на волках": [20, 10, "wolfrider", 0],
        "Наездники на гиенах": [31, 13, "hyenarider", 0],
        "Наездники на кабанах": [31, 14, "boarrider", 0],
        "Наездники на медведях": [24, 25, "bearrider", 0],
        "Наездники на ящерах": [65, 40, "lizardrider", 0],
        "Налетчики на верблюдах": [70, 45, "dromadup", 0],
        "Налётчики на волках": [31, 12, "hobwolfrider", 0],
        "Нимфы": [20, 6, "dryad_", 1],
        "Обсидиановые горгульи": [26, 20, "obsgargoly", 1],
        "Огненные гончие": [36, 15, "firehound", 0],
        "Огненные демоны": [23, 13, "fdemon", 0],
        "Огненные драконы": [255, 230, "firedragon", 0],
        "Огненные птицы": [117, 65, "firebird_", 1],
        "Огненные элементали": [60, 43, "fire", 0],
        "Огры": [60, 50, "ogre", 0],
        "Огры-ветераны": [75, 70, "ogrebrutal", 0],
        "Огры-маги": [74, 65, "ogremagi", 0],
        "Огры-шаманы": [74, 55, "ogreshaman", 0],
        "Одноглазые пираты": [190, 120, "fatpirateup", 0],
        "Ополченцы": [7, 6, "conscript", 0],
        "Орки": [29, 12, "orc", 0],
        "Орки-вожди": [38, 18, "orcchief", 0],
        "Орки-тираны": [38, 20, "orcrubak", 0],
        "Орки-шаманы": [33, 13, "orcshaman", 0],
        "Паладины": [262, 100, "paladin", 0],
        "Палачи": [83, 40, "executioner", 0],
        "Пауки": [15, 9, "spider", 0],
        "Пехотинцы": [17, 16, "footman", 0],
        "Пещерные владыки": [195, 120, "pitlord_", 0],
        "Пещерные гидры": [115, 125, "deephydra", 0],
        "Пещерные демоны": [157, 110, "pitfiend_", 0],
        "Пещерные отродья": [165, 140, "pitspawn", 0],
        "Пиратки": [20, 10, "piratka", 0],
        "Пираты зомби": [200, 150, "zpirate", 0],
        "Пираты Ктулху": [350, 200, "piratemonsterup", 0],
        "Пироманьяки": [10, 20, "piroman", 0],
        "Привидения": [26, 8, "ghost", 1],
        "Призраки": [27, 19, "spectre", 1],
        "Призраки пираток": [17, 8, "gpiratka", 1],
        "Призрачные драконы": [310, 160, "spectraldragon", 1],
        "Принцессы ракшас": [155, 120, "rakshas", 0],
        "Проворные наездники": [94, 50, "briskrider", 0],
        "Проклятые бегемоты": [400, 250, "dbehemoth", 0],
        "Проклятые горгульи": [25, 35, "hgarg", 1],
        "Птицы грома": [115, 65, "thunderbird", 1],
        "Птицы тьмы": [120, 60, "darkbird", 1],
        "Пустынные рейдеры": [22, 12, "duneraider", 0],
        "Пустынные убийцы": [24, 12, "duneraiderup", 0],
        "Раджи ракшас": [160, 140, "rakshasa_raja", 0],
        "Рогатые демоны": [14, 13, "hdemon", 0],
        "Рогатые жнецы": [200, 99, "rapukk", 0],
        "Роки": [104, 55, "roc", 1],
        "Рыцари": [232, 90, "knight", 0],
        "Рыцари смерти": [190, 100, "deadknight", 0],
        "Рыцари тьмы": [160, 90, "blackknight", 0],
        "Светлые единороги": [135, 80, "pristineunicorn", 0],
        "Свирепые бегемоты": [410, 280, "dbehemoth", 0],
        "Свободные циклопы": [700, 225, "untamedcyc", 0],
        "Северные наездники": [36, 30, "whitebearrider", 0],
        "Серебряные пегасы": [50, 30, "spegasus", 1],
        "Силачи": [20, 50, "kachok", 0],
        "Сирены": [60, 20, "siren", 0],
        "Сирены-искусительницы": [70, 24, "upsiren", 0],
        "Скелеты": [6, 4, "sceleton", 0],
        "Скелеты-арбалетчики": [12, 6, "skmarksman", 0],
        "Скелеты-воины": [10, 5, "sceletonwar", 0],
        "Скелеты-корсары": [10, 4, "skeletonpirateup", 0],
        "Скелеты-моряки": [6, 4, "cpirate", 0],
        "Скелеты-лучники": [10, 4, "sceletonarcher", 0],
        "Скелеты-пираты": [7, 4, "skeletonpirate", 0],
        "Скорпионы": [6, 4, "scorp", 0],
        "Слуги Анубиса": [390, 160, "anubis", 0],
        "Снежные воины": [35, 27, "chuvak", 0],
        "Стальные големы": [54, 24, "steelgolem", 0],
        "Старейшины рун": [100, 70, "runepatriarch", 0],
        "Старшие гремлины": [9, 6, "mastergremlin", 0],
        "Старшие демоны": [20, 13, "jdemon", 0],
        "Старшие друиды": [101, 34, "ddhigh", 0],
        "Степные бойцы": [23, 12, "mauler", 0],
        "Степные воины": [21, 12, "warrior", 0],
        "Степные волки": [20, 25, "swolf", 0],
        "Степные гоблины": [5, 3, "goblinus", 0],
        "Степные циклопы": [390, 220, "cyclopus", 0],
        "Стихийные горгульи": [25, 16, "elgargoly", 1],
        "Стрелки": [16, 8, "crossbowman", 0],
        "Стрелки-наёмники": [15, 8, "mercarcher", 0],
        "Суккубы": [61, 20, "succub", 0],
        "Сумеречные ведьмы": [157, 80, "witch", 0],
        "Сумеречные драконы": [350, 200, "shadowdragon", 1],
        "Танцующие с ветром": [33, 14, "winddancer", 0],
        "Танцующие с клинками": [20, 12, "dancer", 0],
        "Танцующие со смертью": [33, 12, "bladedancer", 0],
        "Таны": [131, 100, "thane", 0],
        "Тёмные виверны": [195, 105, "foulwyvern", 1],
        "Тёмные всадники": [94, 50, "grimrider", 0],
        "Тёмные гидры": [115, 125, "foulhydra", 0],
        "Тёмные горгульи": [21, 30, "burbuly", 1],
        "Титаны": [400, 190, "titan", 0],
        "Титаны шторма": [400, 190, "stormtitan", 0],
        "Троглодиты": [5, 5, "troglodyte", 0],
        "Тролли": [150, 150, "troll", 0],
        "Тэнгу": [100, 45, "tengu", 1],
        "Убийцы": [70, 34, "slayer", 0],
        "Умертвия": [165, 95, "wight", 0],
        "Феи": [12, 5, "pp", 1],
        "Фениксы": [600, 777, "phoenix", 1],
        "Флибустьеры": [75, 18, "shootpirateup", 0],
        "Фурии": [49, 16, "fury", 0],
        "Хищные растения": [92, 60, "plant", 0],
        "Хобгоблины": [9, 4, "hobgoblin", 0],
        "Хозяева медведей": [36, 30, "blackbearrider", 0],
        "Хозяйки ночи": [185, 100, "mistress", 0],
        "Церберы": [41, 15, "cerberus", 0],
        "Циклопы": [172, 85, "cyclop", 0],
        "Циклопы-генералы": [187, 100, "cyclopod_", 0],
        "Циклопы-короли": [182, 95, "cyclopking", 0],
        "Циклопы-шаманы": [190, 105, "cyclopshaman", 0],
        "Чародеи-наёмники": [35, 36, "mercwizard", 0],
        "Чемпионы": [252, 100, "champion", 0],
        "Черные скорпионы": [9, 5, "scorpup", 0],
        "Черные тролли": [180, 180, "blacktroll", 0],
        "Черти": [10, 6, "familiar", 0],
        "Чёрные драконы": [400, 240, "blackdragon", 1],
        "Чумные зомби": [15, 17, "plaguezombie", 0],
        "Шакалы": [30, 24, "shakal", 0],
        "Шакалы-воины": [45, 30, "shakalup", 0],
        "Шаманки": [66, 30, "shamaness", 0],
        "Штурмовые грифоны": [62, 52, "battlegriffon", 1],
        "Штурмовые слоны": [150, 110, "slonup", 0],
        "Эльфийские лучники": [38, 10, "elf", 0],
        "Энты": [187, 175, "ent", 0],
        "Ядовитые пауки": [30, 14, "spiderpois", 0]
//  "Злой Петушок 2017":[60,77,"rooster",1],
//  "Злой пёс 2018":[100,88 ,"evildog",0],
//  "Свин 2019":[16,19,"pig2019",0],
    };
    const gm_prefix = `go_${getPlayerId()}_`;  //префикс всех хранимых данных

    const max_exp = 0;
    const version = "0.4.3";
    const url_cur = location.href;
    const url_home = "home.php";
    const url_map = "map.php";
    const url_war = "group_wars.php";
    const str_url = "https://greasyfork.org/ru/scripts/398040";
    const all_tables = document.getElementsByTagName('div');
    let enable_Exp_Half = gm_get("enable_Exp_Half");
    let enable_5_procent = gm_get("enable_5_procent");
    let only_Gud_ExpUm = gm_get("only_Gud_ExpUm");
    let find_Hunt = gm_get("find_Hunt");
    let beep_if_free = gm_get("beep_if_free");
    let grin_Pis = gm_get("grin_Pis");
    let pic_enable = gm_get("pic_enable");
    let show_HP = gm_get("show_HP", true);
    let skip_no_half = gm_get("skip_no_half");
    let pl_level = gm_get("hunt_exp_pl_level", "none"); //ур.героя
    let koef = gm_get("koef_dop_exp", 1.0);         //коэф перекача
    let limit_exp = gm_get("limit_exp", 0);              //С какого порога опыта пропускать охоты
    let skip_mode = gm_get("skip_mode", true);      //Пропускать по опыту или по списку: true - опыт, false - список
    let skip_base = gm_get("skip_base", {});             //h база пропусков на существ: 0 - пропускать, 1 - оставить
    let isSettingsOpened = gm_get("isSettingsOpened", false)


//***********************************************************
    function show_List() {
        let settingsButtonTarget = document.querySelector("#hwm_for_zoom > div.map_text_margin");
        if (url_cur.indexOf('map.php') === -1) return;
        if (skip_mode) {              //если пропуск по опыту, то кнопку вызова списка не отображать
            let elem = document.getElementById("set_list");
            if (elem != null) {
                removeNode(elem)
            }
            return;
        }
        let settingsButton = `
            <img 
                id="set_list"
                src="https://dcdn.heroeswm.ru/i/combat/btn_chatMessSend.png?v=6" 
                height="18" 
                alt="Настройки ГО"
                style="position: relative; margin-bottom: -4px;"
                title="Настройки ГО"
            >`;
                               //Вставка куска


        if (settingsButtonTarget) {
            settingsButtonTarget.insertAdjacentHTML("beforeend", settingsButton);
        } else {
            return
        }
        addEvent($("set_list"), "click", settings_list);        //Привязка к куску на клик вызов функции
//************
        function list_close() {
            removeNode($('bgOverlay'))
            removeNode($('bgCenter'))
        }

//************
        function settings_list() {
            let bg = $('bgOverlay');
            let bgc = $('bgCenter');
            const bg_height = ScrollHeight();
            if (!bg) {
                bg = document.createElement('div');
                document.body.appendChild(bg);
                bgc = document.createElement('div');
                document.body.appendChild(bgc);
            }
            bg.id = 'bgOverlay';
            bg.style.position = 'absolute';
            bg.style.left = '0px';
            bg.style.width = '100%';
            bg.style.background = "#000000";
            bg.style.opacity = "0.5";
            bg.style.zIndex = "1100";
            bg.style.top = '0px';
            bg.style.height = `${bg_height}px`;
            bg.style.display = '';
            bgc.id = 'bgCenter';
            bgc.style.position = 'absolute';
            bgc.style.left = `${(ClientWidth() - 420) / 2}px`;
            bgc.style.width = '475px';
            bgc.style.height = '475px';
            bgc.style.overflow = 'auto';            //scrolling
            bgc.style.background = "#F6F3EA";
            bgc.style.zIndex = "1105";
            bgc.style.top = `${window.pageYOffset + 155}px`;
            bgc.style.display = '';
            addEvent(bg, "click", list_close);                                      //клик вне окна
            //форма и внешний вид окно настроек
            const s_style = `
<style>
.cre_mon_image2 {position:absolute;top:0;left:0;}
.cre_creature {font-weight:400;font-family: 'Arial',sans-serif; width: 60px; position: relative; letter-spacing: normal;font-size: 16px; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none; display:inline-block;}
</style>`;
            let s_innerHTML = `
${s_style}
<div style="border:0 solid #abc;padding:5px;margin:2px;">
<div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr2" title="Close">x</div>
<table>
    <tr>
        <td colspan=2>
            <b>Выберите существ для охоты. Всего <span style="color:#FF0000;"> ${amountOfMonsters}</span>.</b>
            <hr/>
        </td>
    </tr>
    <tr>
        <td colspan=2>
            <input type="submit" id="set_all_mark_ok"   value="Пометить всех">
            <input type="submit" id="set_all_flying_ok" value="Все летающие">
            <input type="submit" id="set_all_noflying_ok" value="Кроме летающих">
            <input type="submit" id="set_all_unmark_ok" value="Снять у всех">
        </td>
    </tr>`;
            let n_m = 0;
            let s_bgcolor;
            let s_pic_out = "";
            for (let key in mob_rus_exp) { //перебор существ из базы и выводим чекбоксы с именем существа
                if (skip_base[n_m] === "1") {
                    s_bgcolor = `style=background-color:#B0FFB0;`;
                } else {
                    s_bgcolor = "";
                }
                if (pic_enable) {
                    s_pic_out = `
                    <tr>
                        <td>
                            <div class="cre_creature">
                            <img width="60" height="50" src="https://dcdn1.heroeswm.ru/i/portraits/${mob_rus_exp[key][2]}anip33.png" alt=""> 
                            <img class="cre_mon_image2" width="60" height="50" src="https://dcdn1.heroeswm.ru/i/army_html/frame_lvl1_120x100_woa.png?v=1" alt="">
                            </div>
                        </td>`;
                }//выводим картинку
                    s_innerHTML += `
                        ${s_pic_out}
                        <td ${s_bgcolor} id=cell_${n_m}>
                            <label><input type=checkbox ${skip_base[n_m] == 1 ? "checked" : ""} id=set_monstr_${n_m}><span style="font-size:16px; vertical-align:center">${key}</span></label>
                        </td>
                    </tr>`;          //выводим имя существа
                n_m++;
            }
            s_innerHTML += '</table></div>';                 //концовка
            bgc.innerHTML = s_innerHTML;
            n_m = 0;
//********* назначение событий *******
            for (let key in mob_rus_exp) {
                appendEvent(n_m++);
            }           //назначаем на события на каждый чек бокс
            document.getElementById('set_all_mark_ok').onclick = function () {
                all_mark_ok("F")
            };        //Пометить все
            document.getElementById('set_all_flying_ok').onclick = function () {
                all_flying_mark()
            };     //Пометить летающих
            document.getElementById('set_all_noflying_ok').onclick = function () {
                all_noflying_mark()
            }; //Кроме летающих
            document.getElementById('set_all_unmark_ok').onclick = function () {
                all_mark_ok("0")
            };      //Сбросить все
            addEvent($("bt_close_tr2"), "click", list_close);                                       //крестик в углу
        }

//********* обработчики полей ввода *******
        function appendEvent(n) {
            document.getElementById(`set_monstr_${n}`).onclick = function () {
                change_enable_mostr(n)
            };
        }

        function change_enable_mostr(n) {           //Обработка чекбоксов с изменением массивов
            let s_bgcolor;
            skip_base = skip_base.substr(0, n) + (1 - skip_base[n]) + skip_base.substr(n + 1);
            if (skip_base[n] === "1") s_bgcolor = "#B0FFB0"; else s_bgcolor = "";
            document.getElementById(`cell_${n}`).style.backgroundColor = s_bgcolor;
            gm_set("skip_base", skip_base);
        }

        function all_mark_ok(zn) {
            let n = 0;
            let s_bgcolor;
            let bool = true;
            if (zn === "0") bool = false;
            for (let key in mob_rus_exp) {
                if (skip_base[n] === "1") s_bgcolor = "#B0FFB0"; else s_bgcolor = "";
                document.getElementById(`cell_${n}`).style.backgroundColor = s_bgcolor;
                document.getElementById('set_monstr_' + n++).checked = bool;
            }
            gm_set("skip_base", skip_base);
        }

        function all_flying_mark() {               //заполняем летающих существ
            let n = 0;
            for (let key in mob_rus_exp) {
                if (mob_rus_exp[key][3] === 1) {
                    skip_base = `${skip_base.substr(0, n)}1${skip_base.substr(n + 1)}`;
                    document.getElementById(`cell_${n}`).style.backgroundColor = "#B0FFB0";
                    document.getElementById(`set_monstr_${n}`).checked = true;
                }
                n++;
            }
            gm_set("skip_base", skip_base);
        }

        function all_noflying_mark() {               //заполняем всех кроме летающих существ
            let n = 0;
            for (let key in mob_rus_exp) {
                if (mob_rus_exp[key][3] === 0) {
                    skip_base = `${skip_base.substr(0, n)}1${skip_base.substr(n + 1)}`;
                    document.getElementById(`cell_${n}`).style.backgroundColor = "#B0FFB0";
                    document.getElementById(`set_monstr_${n}`).checked = true;
                }
                n++;
            }
            gm_set("skip_base", skip_base);
        }

//************
        function $(id) {
            return document.querySelector(`#${id}`);
        }

        function addEvent(elem, evType, fn) {
            elem.addEventListener(evType, fn, false)
        }

        function ClientWidth() {
            return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
        }

        function ScrollHeight() {
            return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
    }

//************  Начало фрагментов кода от (C) Demin с моими вставками и комментариями **********************************
    function showSettings() {
        let settingsButtonTarget = document.querySelector("#hwm_for_zoom > div.map_text_margin");
        let settingsButton = `
            <img 
                id="set_go" 
                src="https://dcdn3.heroeswm.ru/i/combat/btn_settings.png?v=8" 
                height="18" 
                alt="Настройки ГО"
                style="position: relative; margin-bottom: -4px; filter: drop-shadow(0.01rem 0.01rem 0 black) drop-shadow(-0.01rem -0.01rem 0 black);"
                title="Настройки ГО"
            > ${isSettingsOpened ? "" : " <---- НАСТРОЙКИ ГО"}`;
        if (settingsButtonTarget) {
            settingsButtonTarget.insertAdjacentHTML("beforeend", settingsButton);
        } else {
            return
        }
        addEvent($("set_go"), "click", settings_go);
//************
        function settings_go_close() {
            removeNode($('bgOverlay'))
            removeNode($('bgCenter'))
        }

//************
        function settings_go() {
            if (!isSettingsOpened) {
                gm_set("isSettingsOpened", true)
            }
            let bg = $('bgOverlay');
            let bgc = $('bgCenter');
            const bg_height = ScrollHeight();
            if (!bg) {
                bg = document.createElement('div');
                document.body.appendChild(bg);
                bgc = document.createElement('div');
                document.body.appendChild(bgc);
            }
            bg.id = 'bgOverlay';
            bg.style.position = 'absolute';
            bg.style.left = '0px';
            bg.style.width = '100%';
            bg.style.background = "#000000";
            bg.style.opacity = "0.5";
            bg.style.zIndex = "1100";
            bgc.id = 'bgCenter';
            bgc.style.position = 'absolute';
            bgc.style.left = `${(ClientWidth() - 600) / 2}px`;
            bgc.style.width = '600px';
            bgc.style.background = "#F6F3EA";
            bgc.style.zIndex = "1105";
            addEvent(bg, "click", settings_go_close);
            //форма и внешний вид окно настроек
            //общая рамка
            bgc.innerHTML = `
<div style="border:1px solid #abc;padding:5px;margin:2px;">
    <table>
        <tr>
            <td colspan=3><b>Скрипт: Помощник ГО. Версия: <span style="color:#0070FF;">${version}</span>. Всего существ: <span style="color:#FF0000;">${amountOfMonsters}</span>.</b>
                <div style="float:right;border:1px solid #abc;width:15px;height:15px;text-align:center;cursor:pointer;" id="bt_close_tr" title="Close">x</div>
                <hr/>
                <label><input type=checkbox ${html_if_checked(show_HP)} id=set_show_HP title=""> Отображать <b>суммарные HP существ</b></label>
                <br>
                <label><input type=checkbox ${html_if_checked(enable_Exp_Half)} id=set_enable_Exp_Half title=""> Отображать <b>опыт с помощником</b>, если убьёте по 50%</label>
                <br>
                <label><input type=checkbox ${html_if_checked(enable_5_procent)} id=set_enable_5_procent title=""> Отображать сколько убить существ <b>для минимального прироста</b> существ</label>
                <hr/>
                <label><input type=checkbox ${html_if_checked(only_Gud_ExpUm)} id=set_only_Gud_ExpUm title=""> Подсвечивать <b>охоты с выгодной экспоумкой</b> <span style="color: grey; ">(на странице групповых боёв)</span></label>
                <br>
                <label><input type=checkbox ${html_if_checked(find_Hunt)} id=set_find_Hunt title=""> <b>Поиск чужих охот</b> <span style="color: grey;">(групповые бои)</span>. Обновление: <b>5с.</b> </label>
                <label>Если нашёл, <b>вывод звука</b>:<input type=checkbox ${html_if_checked(beep_if_free)} id=set_beep_if_free title=""></label>
                <hr/>
                <label><input type=checkbox ${html_if_checked(grin_Pis)} id=set_Grin_Pis title=""> Включить режим<b><span  style="color: green; font-size: small; ">&nbspGreenPeace&nbsp</span></b>(скрывать предложения охот)</label>
                <hr/>
            </td>
        </tr>
        <tr>
            <td colspan=3>Текущий коэффициент перекача:&nbsp<span style="color:#0070FF;"><b id=k_p>${Number(koef).toFixed(4)}</b></span>
                <br>Введите новый коэффициент перекача от 1.0 до 9.9999: <input id="set_koef" value="${Number(koef).toFixed(4)}" size="4" maxlength="6"> <input type="submit" id="set_koef_ok" value="OK">
                <hr/>Пропускать существ: 
                <label><input type=checkbox ${skip_mode === true ? "checked" : ""} id=set_skip_mode1 title="">по опыту или </label>
                <label><input type=checkbox ${skip_mode === false ? "checked" : ""} id=set_skip_mode2 title="">по списку </label>
                <label> и <b><span style="color: royalblue; ">(</span></b>оставлять [1/2] или <img width="16" height="16" title="Бриллианты" src="https://dcdn.heroeswm.ru/i/r/48/diamonds.png?v=3.23de65" alt="Бриллианты">
                <input type=checkbox ${skip_no_half === 1 ? "checked" : ""} id=set_skip_no_half title=""><b><span style="color:#4169E1;">)</span></b></label>
            </td>
        </tr>
        <tr>
            <td>Пропускать охоты с опытом больше чем:</td>
            <td colspan=2 title="Если значение 0, то опыт не учитывается"> <input id="set_limit_exp" value="${limit_exp}" size="5" maxlength="6"><input type="submit" id="set_limit_exp_ok" value="OK"></td>
        </tr>
        <tr>
            <td colspan=3><label><input type=checkbox ${html_if_checked(pic_enable)} id=set_pic_enable title=""> Отображать картинки существ в списке</label>
                
            </td>
        </tr>
        <tr>
            <td><a href="${str_url}" target=_blanc>Проверить обновление скрипта.</a></td>
            <td colspan=2><a href="/sms-create.php?mailto=&subject=Скрипт: Помощник ГО v. ${version}. Найдена ошибка:" target=_blanc>Сообщить о найденной ошибке.</a></td>
        </tr>
    </table>
</div>`;

            //назначение вызова функция при событиях кнопок и чекбоксов
            addEvent($("bt_close_tr"), "click", settings_go_close);       //крестик в углу
            addEvent($("set_enable_Exp_Half"), "click", change_enable_Exp_Half);  //чек-бокс
            addEvent($("set_enable_5_procent"), "click", change_enable_5_procent); //чек-бокс
            addEvent($("set_only_Gud_ExpUm"), "click", change_only_Gud_ExpUm);   //чек-бокс
            addEvent($("set_find_Hunt"), "click", change_find_Hunt);        //чек-бокс
            addEvent($("set_beep_if_free"), "click", change_beep_if_free);     //чек-бокс
            addEvent($("set_show_HP"), "click", change_show_HP);          //чек-бокс
            addEvent($("set_Grin_Pis"), "click", change_Grin_Pis);         //чек-бокс
            addEvent($("set_koef_ok"), "click", change_koef);             //поле ввода
            addEvent($("set_limit_exp_ok"), "click", change_limit_exp);        //поле ввода
            addEvent($("set_skip_mode1"), "click", change_skip_mode);        //радио
            addEvent($("set_skip_mode2"), "click", change_skip_mode);        //радио
            addEvent($("set_skip_no_half"), "click", change_skip_no_half);     //радио
            addEvent($("set_pic_enable"), "click", change_pic_enable);       //чек-бокс
            bg.style.top = '0px';
            bg.style.height = `${bg_height}px`;
            bgc.style.top = `${window.pageYOffset + 155}px`;
            bg.style.display = '';
            bgc.style.display = '';
        }

//********* обработчики полей ввода *******
        function change_skip_mode() {
            skip_mode = !skip_mode;
            document.getElementById('set_skip_mode1').checked = skip_mode;
            document.getElementById('set_skip_mode2').checked = !skip_mode;
            show_List();
            gm_set("skip_mode", skip_mode);
        }

        function change_koef() {
            if (Number($("set_koef").value) >= 1) koef = $("set_koef").value; else koef = Number(1.0);
            document.getElementById('k_p').innerHTML = Number(koef).toFixed(4);
            gm_set("koef_dop_exp", koef);
        }

        function change_limit_exp() {
            if (Number($("set_limit_exp").value) >= 0) {
                limit_exp = Number($("set_limit_exp").value).toFixed(0);
            } else {
                limit_exp = 0;
            }
            gm_set("limit_exp", limit_exp);
        }

//*********** обработчики чек-боксов *****
        function change_skip_no_half() {
            gm_set("skip_no_half", skip_no_half = !skip_no_half);
        }

        function change_enable_Exp_Half() {
            gm_set("enable_Exp_Half", enable_Exp_Half = !enable_Exp_Half);
        }

        function change_enable_5_procent() {
            gm_set("enable_5_procent", enable_5_procent = !enable_5_procent);
        }

        function change_only_Gud_ExpUm() {
            gm_set("only_Gud_ExpUm", only_Gud_ExpUm = !only_Gud_ExpUm);
        }

        function change_find_Hunt() {
            gm_set("find_Hunt", find_Hunt = !find_Hunt);
        }

        function change_beep_if_free() {
            gm_set("beep_if_free", beep_if_free = !beep_if_free);
        }

        function change_show_HP() {
            gm_set("show_HP", show_HP = !show_HP);
        }

        function change_Grin_Pis() {
            gm_set("grin_Pis", grin_Pis = !grin_Pis);
        }

        function change_pic_enable() {
            gm_set("pic_enable", pic_enable = !pic_enable);
        }

//********** непонятно что, взято 1:1 у Demin ******
        function $(id) {
            return document.querySelector(`#${id}`);
        }

        function addEvent(elem, evType, fn) {
            elem.addEventListener(evType, fn, false)
        }

        function ClientWidth() {
            return document.compatMode === 'CSS1Compat' && document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth;
        }

        function ScrollHeight() {
            return Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        }
    }

//************  Конец фрагментов кода от (C) Demin **********************************
    const sectors = {
        "cx=50&cy=50": 1,  //Empire Capital
        "cx=51&cy=50": 2,  //East River
        "cx=50&cy=49": 3,  //Tiger Lake
        "cx=51&cy=49": 4,  //Rogues' Wood
        "cx=50&cy=51": 5,  //Wolf Dale
        "cx=50&cy=48": 6,  //Peaceful Camp
        "cx=49&cy=51": 7,  //Lizard Lowland
        "cx=49&cy=50": 8,  //Green Wood
        "cx=49&cy=48": 9,  //Eagle Nest
        "cx=50&cy=52": 10, //Portal Ruins
        "cx=51&cy=51": 11, //Dragon Caves
        "cx=49&cy=49": 12, //Shining Spring
        "cx=48&cy=49": 13, //Sunny Sity
        "cx=52&cy=50": 14, //Magma Mines
        "cx=52&cy=49": 15, //Bear Mountain
        "cx=52&cy=48": 16, //Fairy Trees
        "cx=53&cy=50": 17, //Harbour City (Port City)
        "cx=53&cy=49": 18, //Mithril Coast
        "cx=51&cy=52": 19, //GreatWall
        "cx=51&cy=53": 20, //Titans' Valley
        "cx=52&cy=53": 21, //Fishing Village
        "cx=52&cy=54": 22, //Kingdom Capital
        "cx=48&cy=48": 23, //Ungovernable Steppe
        "cx=51&cy=48": 24, //Crystal Garden
        "cx=53&cy=52": 25, //East Island
        "cx=49&cy=52": 26, //The Wilderness
        "cx=48&cy=50": 27  //Sublime Arbor
    };
    let amountOfMonsters = Object.keys(mob_rus_exp).length;

// ********* считывание уровня героя **********
    function getLevel() {
        if (!url_cur.includes(url_home)) {
            return;
        }
        gm_set("hunt_exp_pl_level", document.body.innerText.match(/Боевой уровень: (\d{1,2})/)[1]);
    }

// ***************************************************
    function needSkip(skip, mob, experience, half)  //нужно ли пропускать моба?
    {
        if ((!skip_no_half) || (half)) {  //Если режим поиска половинок, а это не половинка, то пропускаем
            if (skip_mode) {
                if ((limit_exp === 0) || (experience * 1 <= limit_exp * 1)) skip = false;
            } else {
                let n = 0;
                for (let key in mob_rus_exp) {
                    if ((key === mob) && (skip_base[n] === "1")) {
                        skip = false;
                        return skip;
                    }
                    n++;
                }
            }
        }
        return skip;
    }

//****************************************************
    function skip_hunt() {  //пропустить охоту
        const x = document.querySelector("div >a[href*='ecostat.php']");
        if (x == null) return;
        document.title = "ГO. Охоту пропускаю.";
        setTimeout(function () {
            window.location.href = `${location.protocol}//${location.hostname}/map.php?action=skip`;
        }, 2000);
    }

// ***************************************************
    function showExperience() {
        if (url_cur.indexOf(url_map) === -1) {
            return;
        }
        let total_exp, full_exp, next_count, exp_with_helper, next_half_count, min_count, exp_min_count,
            next_min_count, mob_HP;
        let str_hunt, str_total_exp, next_level;//, min_kills, exp_min_kills;
        let mob_name = "";
        let str_dop = "";
        let mob_exp = 0;
        let hunt_available = false;
        let half_hunt = false;
        let diamand_hunt = false;
        let half_diamond_hunt = false;
        let skip_all_mob = true;
        for (let k = 0; k < all_tables.length; k++) {
            if (all_tables[k].className === "wbwhite ohota_block map_table_margin") {
                // if (all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[0].tagName != "DIV") continue;
                // if (all_tables[k].childNodes[1].childNodes[0].children.length < 2) {break;}
                // my_td_danger = all_tables[k].childNodes[1];
                //if (!my_td_danger){ return; } //no hunt...

                str_hunt = all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML;
                const mob_count_b = all_tables[k].childNodes[1].childNodes[0].childNodes[0].childNodes[3].innerHTML;
                half_hunt = str_hunt.indexOf("[1/2]") !== -1; //это половинка?
                diamand_hunt = str_hunt.indexOf("бриллианта") !== -1; //это brilliant?
                half_diamond_hunt = diamand_hunt || half_hunt;

                let mob_count = mob_count_b.substring(0, mob_count_b.indexOf("шт.") - 1)
                mob_name = str_hunt.substring(str_hunt.indexOf(">") + 1, str_hunt.indexOf("</"));
                let mob_data = mob_rus_exp[mob_name];
                if (!mob_data) {
                    //новый моб
                    mob_data = [0, 0, "new mob", 0];
                }
                if (show_HP) {
                    mob_HP = mob_data[1] * mob_count;
                    str_hunt = str_hunt.replace("шт.", `шт. <span style="font-size:10px;color:#CD00CD">HP:<B>${mob_HP}</B></span>`);
                    all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML = str_hunt;
                }
                mob_exp = mob_data[0];
                hunt_available = true;

                total_exp = Math.round(mob_exp * mob_count / 5);          //Полный опыт в одиночку
                full_exp = total_exp;
                next_count = (mob_count * 1.3).toFixed(0);         //Прирост при победе в одиночку

                exp_with_helper = (total_exp / 2).toFixed(0);           //Опыт с помощником (50/50)
                next_half_count = (mob_count * Math.pow(1.3, 0.5)).toFixed(0);        //Прирост при победе с помощником (50/50)

                min_count = (mob_count / 5 - 0.5).toFixed(0);       //Для минимального 5% прироста
                exp_min_count = (Math.floor(mob_exp * min_count / 5)).toFixed(0);     //Опыт при минимальном приросте
                next_min_count = (mob_count * Math.pow(1.3, 0.2)).toFixed(0);        //Прирост при убийстве <=20% будет ~5.4%
                total_exp = total_exp > pl_level * 500 ? pl_level * 500 : total_exp;      //Если опыт больше верхней отсечки по уровню
                exp_with_helper = exp_with_helper > pl_level * 500 ? pl_level * 500 : exp_with_helper;
                exp_min_count = exp_min_count > pl_level * 500 ? pl_level * 500 : exp_min_count;
                if (pl_level > 2) {                   //Если опыт меньше нижней отсечки по уровню (3+ уровни)
                    total_exp = total_exp < pl_level * 100 ? pl_level * 100 : total_exp;
                    exp_with_helper = exp_with_helper < pl_level * 35 ? pl_level * 35 : exp_with_helper;
                    exp_min_count = exp_min_count < pl_level * 14 ? pl_level * 14 : exp_min_count;
                }
                total_exp = (total_exp * koef).toFixed(0);
                exp_with_helper = (exp_with_helper * koef).toFixed(0);
                exp_min_count = (exp_min_count * koef).toFixed(0);
//-------------- Вставим кусок кода ---------------
                skip_all_mob = needSkip(skip_all_mob, mob_name, full_exp, half_diamond_hunt);
//alert(needSkip(true,mob_name,full_exp,half_hunt)+' skip_mode: '+skip_mode);
                if ((!needSkip(true, mob_name, full_exp, half_diamond_hunt))) {//&& (!skip_mode)) { //Если есть ли моб в нашем списке
                    all_tables[k].childNodes[1].style.background = "#d1ffd1";
                }
//-------------------------------------------------
// total_exp - опыт с учетом коэф. перекача
                str_total_exp = total_exp;
                next_level = Number(pl_level) + 1;
                if (total_exp > max_exp && max_exp > 0) {
                    all_tables[k].childNodes[0].style.background = '#FFA07A';
                }
                if (total_exp !== full_exp) str_dop = ' (из ' + full_exp + ')'; else str_dop = "";
                str_total_exp = `<br> <span style="font-size:10px;color:#0000CD">За них дадут <b> ${str_total_exp}${str_dop} </b> опыта. Потом их будет ~${next_count} шт.</span>`;
                if ((total_exp < next_level * 100) && (pl_level > 1)) {
                    str_total_exp += `<br> <span style="color:#0000CD">Убей сейчас! На ${next_level} уровне за них дадут <b> ${next_level * 100} </b> опыта.</span>`;
                }

                if (enable_Exp_Half) {
                    str_total_exp = `${str_total_exp}<br> <span style="font-size:10px;color:#CD00CD">За убийство с помощником (50/50) Вам дадут <b> ${exp_with_helper} </b> опыта. В следующий раз предложат ~${next_half_count} шт.</span>`
                }

                if (enable_5_procent) {
                    str_total_exp = `${str_total_exp}<span style="font-size:11px;color:#007FFF"><i style="text-align: center;">Для Min (~5%) прироста надо убить не более ${min_count} шт (${exp_min_count} опыта). В следующий раз предложат ~${next_min_count} шт.</i></span>`
                }

                all_tables[k].childNodes[1].childNodes[0].childNodes[0].innerHTML = str_hunt + str_total_exp;
            }
        }
        if (skip_all_mob && hunt_available) {
            skip_hunt();
        }
        if (!skip_all_mob && hunt_available && ((limit_exp !== 0) || (!skip_mode))) {
            document.title = "ГO. Охота найдена.";
        }
    }

//****************************************************
    function helpers() { //анализ страницы групповых боев
        if (url_cur.indexOf(url_war) === -1) {
            return;
        }
        let elem, elem2, str_hunt, mob_count, mob_name, total_exp, backgrn, sect, s_sect;
        let dt = 3000;
//var alr = 0;


        let ems = document.querySelectorAll("a[href*='map.php?cx']");
        for (let i = 0; i < ems.length; i++) {
            if (!ems[i].parentNode.parentNode.childNodes[6].childNodes[4]) {
                elem = ems[i].parentNode.parentNode.childNodes[6].childNodes[3].childNodes[0]; //odin v drugom sektore ili inoi level
            } else if (!ems[i].parentNode.parentNode.childNodes[6].childNodes[6]) {
                elem = ems[i].parentNode.parentNode.childNodes[6].childNodes[5].childNodes[0]; //odin v moem sektore
                elem2 = elem.parentNode.parentNode.childNodes[3].childNodes[0]; //
                if ((beep_if_free) && (elem2.tagName === 'B')) {
                    new Audio("http://www.soundjay.com/button//button-46.mp3").play().then(null); //button-46,47, beep-027
                    dt = 15000;
                }
            } else {
                elem = ems[i].parentNode.parentNode.childNodes[6].lastChild.childNodes[0]; //dvoe v moem ili drugom sektore
            }
            str_hunt = elem.innerHTML;
            mob_count = str_hunt.substring(str_hunt.search(/\(/) + 1, str_hunt.search(/\)/));
            mob_name = str_hunt.substring(0, str_hunt.search(/\(/));
            total_exp = Math.floor(mob_rus_exp[mob_name][0] * mob_count / 5);
            backgrn = '';
            if (elem.parentNode.parentNode.childElementCount !== 5) {
                s_sect = ems[i].href;
                sect = s_sect.substring(s_sect.lastIndexOf("?") + 1, s_sect.length);
                s_sect = s_sect.replace(`map.php?${sect}`, `move_sector.php?id=${sectors[sect]}`);
                ems[i].innerHTML += '<br><span style="color:#FF3244;"><b>Перейти</b></span>';
                ems[i].href = s_sect;
            }
            if (only_Gud_ExpUm && (total_exp < pl_level * 133)) {
                backgrn = ' background:#cfd';
            }
            if (only_Gud_ExpUm && (total_exp < pl_level * 100)) {
                backgrn = ' background:#0f0';
            }
            elem.innerHTML += `<span style="font-size:12px; color:#013220;${backgrn}"><b> ${total_exp}</b></span>&nbspопыта.`;
            if (show_HP) {
                const mob_data = mob_rus_exp[mob_name];
                let mob_HP = mob_data[1] * mob_count;
                elem.innerHTML += ` <span style="font-size:10px;color:#CD00CD">HP:<B>${mob_HP}</B></span>`
            }
        }
        if (find_Hunt) setTimeout(function () {
            window.location.href = `${location.protocol}//${location.hostname}/group_wars.php?filter=hunt`;
        }, dt);
    }

//****************************************************
    function hideHunt() { //режим гринпис - скрытие отображения охот
        Array
            .from(document.getElementsByClassName("ohota_block"))
            .forEach(hunt => hunt.parentNode.removeChild(hunt))
    }

//****************************************************
    function highlightHuntHref() { //заменяет ссылку в групповые бои на такую же с выделением свободных охот
        Array
            .from(document.getElementsByTagName("a"))
            .filter(a => a.href.match("group_wars.php"))
            .forEach(a => a.href += "?filter=hunt")
    }

//****************************************************
    getLevel();
    showSettings();
    show_List();
    grin_Pis ? hideHunt() : showExperience();
    helpers();
    highlightHuntHref();

    function gm_get(key, def) {
        let result = JSON.parse(localStorage[gm_prefix + key] === undefined ? null : localStorage[gm_prefix + key]);
        return  result == null ? def : result;

    }

    function gm_set(key, val) {
         localStorage[gm_prefix + key] = JSON.stringify(val);
    }

    function getPlayerId() {
        return getCookie("pl_id")
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function removeNode(node) {
        node.parentNode.removeChild(node)
    }
    function html_if_checked(val) {
        return val ? ' checked' : '';
    }
})();
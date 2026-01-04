// ==UserScript==
// @name         bot.wapheroes+
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Большая просьба после получения не распространять
// @author       Mortan
// @match        http://wapheroes.ru/*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/376827/botwapheroes%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/376827/botwapheroes%2B.meta.js
// ==/UserScript==

var lastBattle = 0;
var creaturesOk = 0;
var statsIsActive = 0;
var needBackHome = 0;
var ignoreOverweight = false;
var firstStart = false;
var artsSummary = 0;
var artMax = 0;
var farmLocation = 0;
var botStarted = false;
var autoForge  = false;
var invLoaded = false;
var artsCollected = [];

addEventListener("keydown", moveRect); //Вспомогательные клавишы для вызова различного рода меню.
mainPage();
canStartNewBattle(); //Самая главная функция, которая определяет что в данный момент бот должен делать.

function canStartNewBattle()
{
    //Загрузка сохранённых ранее переменных и настроек
    lastBattle = sessionStorage.getItem('last');
    creaturesOk = sessionStorage.getItem('creatures');
    needBackHome = sessionStorage.getItem('backhome');
    artsSummary = sessionStorage.getItem('artsum');
    artMax = sessionStorage.getItem('artmax');
    farmLocation = localStorage.getItem('location');
    firstStart = (sessionStorage.getItem('start') === 'true');
    ignoreOverweight = (localStorage.getItem('overw') === 'true');
    invLoaded = (sessionStorage.getItem('inv_l') === 'true');
    artsCollected = localStorage.artsCollected ? JSON.parse(localStorage.artsCollected) : [];

    if(farmLocation==null)
    {
        farmLocation = 0;
    }
    if(farmLocation == 0)
    {
        localStorage.setItem('location',farmLocation);
    }

    if(botStarted && farmLocation!=0 && firstStart)
    {
        if(window.location.href == "http://wapheroes.ru/index.php?action=mymenu&n=arts&mode=inv")
        {
            getInventoryValue();
            firstStart = false;
            invLoaded = true;
            sessionStorage.setItem("inv_l",invLoaded);
            sessionStorage.setItem("start",firstStart);
            window.open("http://wapheroes.ru/index.php?action=map&l="+farmLocation,"_self");                
        }
        else
        {
            window.open("http://wapheroes.ru/index.php?action=mymenu&n=arts&mode=inv","_self");
        }
    }

    if(!ignoreOverweight && botStarted && invLoaded)
    {
        if(parseInt(artsSummary) >= parseInt(artMax))
        {
            changeBotStatus();
        }         
    }

    if(botStarted && farmLocation!=0)
    {
        if(needBackHome==1)
        {
            findBack();
        }
        else if(creaturesOk==1)
        {
            findBattleKey();
        }
        else if(lastBattle>0)
        {
            findBonuses();
            setTimeout(findCreatures, 5000);
        }
        else
        {
            findBonuses();
            findCreatures();
        }
    }
}

function moveRect(e)
{
    switch(e.keyCode)
    {
        case 113:
            changeBotStatus();
            break;
        case 115:
            setFarmLocation();
            break;        
    }
}

function mainPage()
{
     botStarted = (sessionStorage.getItem('bot') === 'true');
     
     autoForge =  (localStorage.getItem('forge') === 'true');
    
    if(/index.php\?rnd=\d+$/.test(window.location.href) || window.location.href=="http://wapheroes.ru/index.php")
    {
        var tmp = document.getElementsByTagName('a');
        for ( var i = 0; i < tmp.length; i++ )
        {
            var str = tmp[i].href;
            if (/index.php\?action=quests$/.test(str))
            {
                var parent = tmp[i].parentElement;
                var img = document.createElement('img');
                var setEnable = document.createElement('a');
                setEnable.textContent = "Настройки бота";
                setEnable.href = "javascript:void(0)";
                setEnable.onclick = loadBotMenu;
                img.src = "img/icons/misc/settings.png";
                setEnable.style = "margin-left: 3.5px";
                parent.appendChild(img);
                parent.appendChild(setEnable);
            }
        }
    }
    else if( window.location.href =="http://wapheroes.ru/index.php?action=forge&do=cristalize")
    {
        //forgeFilter('rgb(0, 205, 102)');
        //forgeFilter('rgb(118, 238, 198)');
    }
}

function changeBotStatus()
{
    botStarted = !botStarted;
    sessionStorage.setItem("bot",botStarted);
    sessionStorage.setItem("start",botStarted);
    window.open(window.location.href,"_self");
}

function findArtInResult()
{
    var tmp = document.getElementsByTagName('a');
    for ( var i = 0; i < tmp.length; i++ )
    {
        var str = tmp[i].href;
        if (/index.php\?action=art_info&a=\d+/.test(str))
        {
            artsSummary++;
            sessionStorage.setItem('artsum',artsSummary)
        }
    }
}

function getInventoryValue()
{
    var tmp = document.getElementsByTagName('span');
    var tetx = new RegExp("Инвентарь");
    var tets = new RegExp('(\\d+/\\d+)');
    for ( var i = 0; i < tmp.length; i++ )
    {
        var str = tmp[i].textContent;
        if (tetx.test(str))
        {
            var result = str.match(tets);
            var nresult = result[0].split('/');
            artsSummary = nresult[0];
            artMax = nresult[1];
            sessionStorage.setItem('artsum',artsSummary)
            sessionStorage.setItem('artmax',artMax)
        }
    }
}

function setFarmLocation()
{
    var rg = new RegExp('index.php\\?action=map&l=\\d+')
    if(rg.test(window.location.href))
    {
        var locator = window.location.href.replace(/http:\/\/wapheroes.ru\/index.php\?action=map&l=/,"")
        farmLocation = checkIsFarmLocation(locator);
        farmLocation = localStorage.setItem('location',farmLocation);
        window.open(window.location.href,"_self")
    }
}

function findArts()
{
    var tmp = document.getElementsByTagName('a');
    for ( var i = 0; i < tmp.length; i++ )
    {
        var str = tmp[i].href;
        var sttr;
        if (/index.php\?action=art_info&a=\d+/.test(str))
        {
            sttr = str.replace(/http:\/\/wapheroes.ru\/index.php\?action=art_info&a=/,"");
            sttr = sttr.replace(/&lvl=\d+/,"");
            artsCollected.push(sttr);
            localStorage.artsCollected = JSON.stringify(artsCollected);
        }
    }
}

function forgeFilter(color)
{
    var tmp = document.getElementsByTagName('a');
    var childRemoved = 0;
    var idToDelete = []
    for ( var i = 0; i < tmp.length; i++ )
    {
        var str = tmp[i].href;
        if (/index.php\?action=art_info&a=\d+/.test(str))
        {
            var span =  tmp[i].getElementsByTagName('span')[0];
            if(span.style.color == color)
            {
                idToDelete.push(i);
            }
        }
    }
    for ( var m = 0; m < idToDelete.length; m++ )
    {
        var it = idToDelete[m-childRemoved];
        childRemoved++;
        //var parent = tmp[it].parentElement;
        //parent.removeChild(tmp[it]);
        var parent = tmp[it].parentNode;
        parent.parentNode.removeChild(parent);
    }
}

function findBonuses()
{
    var tmp = document.getElementsByTagName('a');
    var rg = new RegExp('index.php\\?action=map&l='+farmLocation+'&i=\\d+$')
    for ( var i = 0; i < tmp.length; i++ )
    {
            var str = tmp[i].href;

            if (rg.test(str))
            {
                findArtInResult();    
                tmp[i].click();
            }
    }
}

function checkIsFarmLocation(value)
{
    var tmp = document.getElementsByTagName('a');
    var rg = new RegExp('index.php\\?action=map&l='+value+'&e=\\d+')
    for ( var i = 0; i < tmp.length; i++ )
    {
            var str = tmp[i].href;
            if (rg.test(str))
            {
                return value;
            }
    }
        return 0;

}

function findCreatures()
{
    lastBattle = 0;
    //var table = document.getElementsByTagName('body')[0];
    var tmp = document.getElementsByTagName('a');
    var rg = new RegExp('index.php\\?action=map&l='+farmLocation+'&e=\\d+')
    for ( var i = 0; i < tmp.length; i++ )
    {
            var str = tmp[i].href;
            if (rg.test(str))
            {
            creaturesOk = 1;
            tmp[i].click();
            sessionStorage.setItem('creatures', creaturesOk);
            }
    }
    if(creaturesOk == 0)
    {
        farmLocation = 0;
        farmLocation = localStorage.setItem('location',farmLocation);
    }
}

function findBack()
{
    findArtInResult();
    var rg = new RegExp('l='+farmLocation+'$');
    var tmp = document.getElementsByTagName('a');
    for ( var i = 0; i < tmp.length; i++ )
    {
            var str = tmp[i].href;
            if (rg.test(str))
            {
            needBackHome = 0;
            sessionStorage.setItem('backhome', needBackHome);
            tmp[i].click();
            }
    }
}

function findBattleKey()
{
    var rg = new RegExp('l='+farmLocation+'&b&event=\\d+&c')
    var tmp = document.getElementsByTagName('a');
    for ( var i = 0; i < tmp.length; i++ )
    {
            var str = tmp[i].href;
            if (rg.test(str))
            {
            creaturesOk = 0;
            lastBattle=5;
            tmp[i].click();
            sessionStorage.setItem('creatures', creaturesOk);
            sessionStorage.setItem('last', lastBattle);
            needBackHome = 1;
            sessionStorage.setItem('backhome', needBackHome);
            }
    }
}

function buildUI(className,val2)
{
    var val = document.createElement('div');
    val.classList.add(className);
    val2.appendChild(val);
	return val;
}

function loadBotMenu()
{
    var tmp = document.getElementsByTagName('div')[0].style.display = "none";
    var mainForm = document.createElement('div');
    mainForm.id = 'special-div';
    mainForm.style = "background: #2d2924 url(img/style/bg1.png);";   
    var tm = buildUI('tm',document.body);
    var tmt = buildUI('tmt',tm);
    var tmb = buildUI('tmb',tmt);
    var tt = buildUI('tt',tmb);
    var tb = buildUI('tb',tt);
    var tl = buildUI('tl',tb);
    var tr = buildUI('tr',tl);
    var tbl = buildUI('tbl',tr);
    var tbr = buildUI('tbr',tbl);
    var tpc = buildUI('tpc',tbr);
    var tpl = buildUI('tpl',tpc);
    var tpr = buildUI('tpr',tpl);
    var tmtext = buildUI('tmtext',tpr);
    tmtext.textContent = "Настройки бота"
    document.body.appendChild(mainForm);
    var mt = buildUI('mt',mainForm);
    var mb = buildUI('mb',mt);
    var ml = buildUI('ml',mb);
    var mr = buildUI('mr',ml);
    var mlt = buildUI('mlt',mr);
    var mrt = buildUI('mrt',mlt);
    var mlb = buildUI('mlb',mrt);
    var mpl = buildUI('mpl',mlb);
    var mpr = buildUI('mpr',mpl);
    var mtext = buildUI('mtext',mpr);
    var img1 = document.createElement('img');
    img1.src = "img/icons/misc/credits.png";
    mtext.appendChild(img1);
    var elem1 = document.createElement('a');
    var string = autoForge ? 'Вкл.' : 'Выкл.';
    elem1.textContent = "Авто-переплавка: " + string
    elem1.onclick = function() 
    {
        autoForge = !autoForge;
        var str_ = autoForge ? 'Вкл.' : 'Выкл.'
        elem1.textContent = "Авто-переплавка: " + str_
        localStorage.setItem("forge",autoForge);
    }
    elem1.href = "javascript:void(0)";
    elem1.style = "margin-left: 3.5px";
    mtext.appendChild(elem1);

    var br = document.createElement('br');
    mtext.appendChild(br);

    var img4 = document.createElement('img');
    img4.src = "img/icons/misc/arts.png";
    mtext.appendChild(img4);

    var elem4 = document.createElement('a');
    string = ignoreOverweight ? 'Да' : 'Нет';
    elem4.textContent = "Игнорировать переполнение рюкзака: " + string
    elem4.onclick = function() 
    {
        ignoreOverweight = !ignoreOverweight;
        var str_ = ignoreOverweight ? 'Да' : 'Нет'
        elem4.textContent = "Игнорировать переполнение рюкзака: " + str_
        localStorage.setItem("overw",ignoreOverweight);
    }
    elem4.href = "javascript:void(0)";
    elem4.style = "margin-left: 3.5px";
    mtext.appendChild(elem4);

    br = document.createElement('br');
    mtext.appendChild(br);

    var img2 = document.createElement('img');
    img2.src = "img/icons/misc/clan.png";
    mtext.appendChild(img2);

    var elem2 = document.createElement('a');
    elem2.href = "javascript:void(0)";
    elem2.style = "margin-left: 3.5px";

    var string_2 = botStarted ? 'Вкл.' : 'Выкл.';
    elem2.textContent = "Состояние бота: " + string_2
    mtext.appendChild(elem2);

    addEventListener("keydown", function(e)
    {  
        if(e.keyCode == 113)
        {
            var str_ = botStarted ? 'Вкл.' : 'Выкл.';
            elem2.textContent = "Состояние бота: " + str_    
        }

    });

    br = document.createElement('br');
    mtext.appendChild(br);

    var img3 = document.createElement('img');
    img3.src = "img/icons/misc/coliseum.png"
    mtext.appendChild(img3);

    var elem_3 = document.createElement('a');
    elem_3.href = "javascript:void(0)";
    elem_3.style = "margin-left: 3.5px";
    elem_3.textContent = "ID локации для фарма: " + farmLocation;
    mtext.appendChild(elem_3);

    br = document.createElement('br');
    mtext.appendChild(br);

    var img_h = document.createElement('img');
    img_h.src = "img/ico/index.png";

    var home = document.createElement('a');
    home.href = "http://wapheroes.ru/index.php";
    home.style = "margin-left: 3.5px";
    home.textContent = "На главную"
    mtext.appendChild(img_h);
    mtext.appendChild(home);
}

var allArts = ["Пусто", "Амулет Гробовщика", "Деревянный Нагрудник", "Секира Кентавра", "Щит Лорда Дварфов",
               "Костяной Шлем", "Кольцо Живучести", "Зеркало", "Брелок Маны", "Талисман Маны", "Клевер Удачи",
               "Знамение Удачи", "Накидка Магистра", "Лук Эльфиского Дерева", "Карты Судьбы", "Амулет Заклинателя",
               "Сумка Бесконечного Золота", "Шлем Единорога", "Кольцо из Глаза Дракона", "Подзорная труба",
               "Кольцо Заклинателя", "Наголенники из Костей Дракона", "Мистический Орб Маны", "Клинок Черного Рыцаря",
               "Великая Цепь Гнолов", "Щит Тоскующих Мертвецов", "Щит Короля Гнолов", "Шлем Адского Шторма", "Доспехи Василиска",
               "Кольцо Дипломата", "Сапоги Мертвеца", "Накидка Посла", "Сандали Святого", "Золотой Лук", "Неиссякаемая Связка Дров",
               "Неисчерпаемая Корзина Камня", "Меч Адского Пламени", "Гладиус Титана", "Дубина Огра Хавока", "Щит Ярости Огров",
               "Плащ Короля Циклопов", "Ожерелье из Зубов Дракона", "Кольцо Жизни", "Медаль Дипломата", "Символ Храбрости",
               "Орден Отважных", "Знак Доблести", "Перстень из Чешуи Дракона", "Шлем Хаоса", "Кольцо Изобилия Гемов", "Ребра Усопшего",
               "Броня Чудес", "Щит Часового", "Щит Проклятых", "Плащ Бесконечных Кристаллов", "Бездонный Флакон Меркурия",
               "Бездонный Мешок Золота", "Неиссякаемая Корзина Золота", "Броня из Чешуи Дракона", "Щит из Чешуи Дракона",
               "Сульфурное Кольцо", "Стрелы из Перьев Ангела", "Тетива из Гривы Единорога", "Мантия Равновесия", "Табардово Крыло Дракона",
               "Щит Возмездия", "Мантия Вампира", "Сфера Ветров", "Сфера Земли", "Сфера Огня", "Сфера Дождя", "Шлем Грома", "Корона Магистра",
               "Флакон Драконьей Крови", "Клинок Армагеддона", "Меч Правосудия", "Язык Красного Дракона", "Львиный Щит Отваги",
               "Шлем Божественного Просвещения", "Корона из Зубов Дракона", "Кираса Титана", "Нагрудник Бринстона", "Подвеска За мужество",
               "Кулон Равновесия", "Небесный Амулет Блаженства", "Ботинки Полярности", "Флакон Живой Крови", "Лук Снайпера", "Инструкция: Лук Снайпера",
               "Рог Изобилия", "Инструкция: Рог Изобилия", "Альянс Ангелов", "Инструкция: Альянс Ангелов", "Эликсир Бессмертия", "Инструкция: Эликсир Бессмертия",
               "Кольцо Магии", "Инструкция: Кольцо Магии", "Топор Свирепости Лорда Варваров", "Инструкция: Топор Свирепости Лорда Варваров", "Гром Титанов",
               "Инструкция: Гром Титанов", "Источник Магии", "Инструкция: Источник Магии", "Мощь Отца Драконов", "Инструкция: Мощь Отца Драконов",
               "Плащ Короля Нечисти", "Инструкция: Плащ Короля Нечисти", "Броня Падших", "Инструкция: Броня Падших", "Меч Последнего Героя",
               "Инструкция: Меч Последнего Героя", "Шлем Последнего Героя", "Инструкция: Шлем Последнего Героя", "Кольцо Последнего Героя",
               "Инструкция: Кольцо Последнего Героя", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Ящик Пандоры", "Пусто", "Пусто",
               "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Нагрудник Последнего Героя", "Инструкция: Нагрудник Последнего Героя",
               "Сапоги Последнего Героя", "Инструкция: Сапоги Последнего Героя", "Щит Последнего Героя", "Инструкция: Щит Последнего Героя",
               "Амулет Последнего Героя", "Инструкция: Амулет Последнего Героя", "Шарф Последнего Героя", "Инструкция: Шарф Последнего Героя",
               "Поясница Легиона", "Руки Легиона", "Ноги Легиона", "Голова Легиона", "Торс Легиона", "Статуя Легиона", "Инструкция: Статуя Легиона",
               "Герб Легиона", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто",
               "Пусто", "Стяг Легиона", "Печать Гладиатора", "Малая Сума Купца", "Большая Сума Купца", "Даркоул", "Бистид", "Гринд", "Фростмор",
               "Файрен", "Спиритис", "Хумий", "Варлон", "Хермит", "Орб Искателя Приключений", "Орб Бессменого Лидера", "Посох Архимага",
               "Инструкция: Посох Архимага", "Шляпа Архимага", "Инструкция: Шляпа Архимага", "Перстень Архимага", "Инструкция: Перстень Архимага",
               "Роба Архимага", "Инструкция: Роба Архимага", "Ботинки Архимага", "Инструкция: Ботинки Архимага", "Орб Архимага", "Инструкция: Орб Архимага",
               "Кулон Архимага", "Инструкция: Кулон Архимага", "Плащ Архимага", "Инструкция: Плащ Архимага", "Посох Магнуса", "Скипетр Ахнатона",
               "Инструкция: Скипетр Ахнатона", "Мистическая Повязка", "Ожерелье Отступника", "Посох Порчи", "Ботинки Легкой Походки", "Орб Чародея",
               "Палица Волхвов", "Инструкция: Палица Волхвов", "Колпак Звездочета", "Жезл Упорства", "Сфера познаний", "Роба Мага Ученика", "Нагрудник Мариуса Первого",
               "Инструкция: Нагрудник Мариуса Первого", "Дневник Чародея", "Тотем Баловня Судьбы", "Орден Праведника", "Орб Меркантильности", "Лупа Ювелира", "Дисконт",
               "Медаль Авантюриста", "Медаль Инструктора", "Перстень Инструктора", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто",
               "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Пусто", "Шлем Превосходства", "Секира Превосходства",
               "Доспех Превосходства", "Плащ Превосходства", "Кольцо Превосходства", "Сапоги Превосходства", "Щит Превосходства", "Амулет Превосходства",
               "Инструкция: Шлем Превосходства", "Инструкция: Секира Превосходства", "Инструкция: Доспех Превосходства", "Инструкция: Плащ Превосходства",
               "Инструкция: Кольцо Превосходства", "Инструкция: Сапоги Превосходства", "Инструкция: Щит Превосходства", "Инструкция: Амулет Превосходства"]
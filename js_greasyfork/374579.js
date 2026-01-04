// ==UserScript==
// @author         dw4rf & Casperovskii; ElMarado
// @collaborator   style: sw.East
// @name           HWM_Style_Pereka4_Mod
// @description    ru: Добаляет прогресс бар, который показывает положение вашей суммарной умелки относительно средней на уровне; en: Add progress bar for sum of faction exp. and balance coef.
// @namespace      Pereka4
// @version        2.9.2
// @icon           http://i.imgur.com/GScgZzY.jpg
// @encoding       utf-8
// @include        *//*heroeswm.ru/home.php*
// @include        *//178.248.235.15/home.php*
// @include        *//*lordswm.com/home.php*
// @include        *//*heroeswm.ru/pl_info.php*
// @include        *//178.248.235.15/pl_info.php*
// @include        *//*lordswm.com/pl_info.php*
// @require        https://openuserjs.org/src/libs/Marti/GM_setStyle.js
// @grant          GM_addStyle
// @grant          GM_deleteValue
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @license        MIT
// @copyright      2013-2018, sw.East (https://www.heroeswm.ru/pl_info.php?id=3541252)
// @downloadURL https://update.greasyfork.org/scripts/374579/HWM_Style_Pereka4_Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/374579/HWM_Style_Pereka4_Mod.meta.js
// ==/UserScript==

// API method adds a string of CSS to the document
GM_addStyle(`

.pereka4_progress {
    position: relative;
    width: 200px;
    margin: 3px 0 3px 8px;
    background-color: #727272;
    height: 5px;
}
.pereka4_progress_bar {
    height: 5px;
    max-width: 200px;
    background-color: #8bc34a;
    padding: 0 auto;
}
.pereka4_bar_perc {
    color: #455a64;
    font-size: 9px;
    margin-top: -9px;
    padding: 0 1px;
    text-align: center;
    height: 9px;
    width: 30px;
    white-space: nowrap;
}
.exp-container {padding-left: 8px;}
.color_bar_perc_pereka4 {padding: 0 3px;}
.exp-low {background-color: #d35e50;}
.exp-norm {background-color: #8bc34a;}
.exp-hight {background-color: #4663b9;}

`);

//addGlobalStyle('.exp-container{text-align:right;width:202px;height:16px;margin: 2px 0 -10px 8px;padding: 0 0 0 2px;border: none;font-weight: bold;}');

function browser()
        {
    	var ua = navigator.userAgent;

    	if (ua.search(/MSIE/) > 0) return 'Internet Explorer';
    	if (ua.search(/Firefox/) > 0) return 'Firefox';
    	if (ua.search(/Opera/) > 0) return 'Opera';
    	if (ua.search(/Chrome/) > 0) return 'Google Chrome';
    	if (ua.search(/Safari/) > 0) return 'Safari';
    	if (ua.search(/Konqueror/) > 0) return 'Konqueror';
    	if (ua.search(/Iceweasel/) > 0) return 'Debian Iceweasel';
    	if (ua.search(/SeaMonkey/) > 0) return 'SeaMonkey';
    	// Браузеров очень много, все вписывать смысле нет, Gecko почти везде встречается
    	if (ua.search(/Gecko/) > 0) return 'Gecko';
    	// а может это вообще поисковый робот
    	return 'Search Bot';

        }

function main(e){

    var browserVersion = browser();
    var version = "2.92";
    var srednya_umka = 0;
    var vilka = 1;
    var umk_min = 0;
    var umk_max = 0;
    var sum_umk = 0;
    var lang_en = new Array();
    var lang_uk = lang_en;
    var lang_us = lang_en;
    var lang_com = lang_en;

    lang_en['Knight']               = 'Knight';
    lang_en['Necromancer']          = 'Necromancer';
    lang_en['Wizard']               = 'Wizard';
    lang_en['Elf']                  = 'Elf';
    lang_en['Barbarian']            = 'Barbarian';
    lang_en['Dark elf']             = 'Dark elf';
    lang_en['Demon']                = 'Demon';
    lang_en['Dwarf']                = 'Dwarf';
    lang_en['Steepe barbarian']     = 'Steepe barbarian';
    lang_en['Combat level']         = 'Combat level';

    var lang_ru = new Array();

    lang_ru['Knight']               = '\u0420\u044B\u0446\u0430\u0440\u044C';
    lang_ru['Necromancer']          = '\u041D\u0435\u043A\u0440\u043E\u043C\u0430\u043D\u0442';
    lang_ru['Wizard']               = '\u041C\u0430\u0433';
    lang_ru['Elf']                  = '\u042D\u043B\u044C\u0444';
    lang_ru['Barbarian']            = '\u0412\u0430\u0440\u0432\u0430\u0440';
    lang_ru['Dark elf']             = '\u0422\u0435\u043C\u043D\u044B\u0439 \u044D\u043B\u044C\u0444';
    lang_ru['Demon']                = '\u0414\u0435\u043C\u043E\u043D';
    lang_ru['Dwarf']                = '\u0413\u043D\u043E\u043C';
    lang_ru['Steepe barbarian']     = '\u0421\u0442\u0435\u043f\u043d\u043e\u0439 \u0432\u0430\u0440\u0432\u0430\u0440';
    lang_ru['Combat level']         = '\u0411\u043E\u0435\u0432\u043E\u0439 \u0443\u0440\u043E\u0432\u0435\u043D\u044C';

    var language=lang_en;

    // Определение языка
    var lingua;

    if (location.hostname.match('lordswm')) {lingua='en';} else {lingua = 'ru';}

    try{

        eval('language = lang_' + lingua);

    }catch(e){

    }

    //Фракции
    var factions = [
    T('Knight'),T('Necromancer'),T('Wizard'),T('Elf'),T('Barbarian'),T('Dark elf'),T('Demon'),T('Dwarf'),T('Steepe barbarian')
    ];

    //Средние умения фракций на 3-22 уровне
    var sred_umk = [
    70,130,200,340,560,950,1510,2260,3240,4510,6350,
    9210,13960,21070,31060,43820,59740,80040,104720,167260
    ];

    //Вилки границ недокача/перекача от средних умений фракций на 3-22 уровне
    var vilka_um = [
    2.5, 2.2, 1.9, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6,
    1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6, 1.6
    ];

    var XPFirst = XPathResult.FIRST_ORDERED_NODE_TYPE;         // Постоянные для первого элемента XPath
    var XPList  = XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE;    // Постоянные элементы списка XPath

    /**

     * Поиск по документу с помощью XPath
     *
     * Ввод:
     *	xpath       Выражение для поиска
     *	xpres       Тип поиска
     *
     * Вывод:
     *	Ссылка на найденный объект
     */

    function find(xpath, xpres,startnode){

        if (!startnode) {startnode=document;}
        var ret = document.evaluate(xpath, startnode, null, xpres, null);
        return  xpres == XPFirst ? ret.singleNodeValue : ret;

    }

    /**
     * Добавляет узел после 1 условия
     *
     * Ввод:
     *	refChild    узел ссылки
     *	newChild	узлы, которые будут добавлены
     */

    function insertAfter(newChild, refChild) {

        node.parentNode.insertBefore(newChild, refChild.nextSibling);

    }

    /**
     * Создание элемента
     *
     * Ввод:
     *	tag         Название нового элемента
     *	content     Содержание нового элемента в текстовом формате
     *
     * Вывод:
     *	Ссылка на созданный элемент
     */

    function elem(tag, content){

        var ret = document.createElement(tag);
        ret.innerHTML = content;
        return ret;

    }

    /**
     * Перевод текста на определенный язык
     *
     * Ввод:
     *	Текст для перевода
     *
     * Вывод:
     *	Перевод
     */

    function T(testo){

        // Язык по умолчанию, если слово не существует: английский
        if (language[testo] == undefined) return lang_en[testo]; else return language[testo];
    }

    /**
     * Создание прогресс бара
     *
     * Ввод:
     *	Текущий опыт
     *	Текущее умение фракции
     *	Уровень
     *
     * Вывод:
     *	HTML для создания прогресс бара
     */

    //function makeProgressBar(exp_attuale, min_umka, max_umka, vlk, lvl){
    function makeProgressBar(exp_attuale, min_umka, max_umka, vlk, lvl){

            exp_attuale = exp_attuale - min_umka;
            max_umka = max_umka - min_umka;
            var perc = exp_attuale * 100 / max_umka;
            var ins_txt="";

    // Stile
    //var addGlobalStyle = "";

        if (lvl > 18) ins_txt=" (\u0423 19-22 \u0443\u0440\u043E\u0432\u043D\u044F \u043D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F)."

        if (perc<100 && perc>0) {

            var progress_bar_html = "<div class=\"pereka4_progress\">"+
		                                "<div class=\"pereka4_progress_bar exp-norm\" style=\"width:" + perc +"%\"></div>"+
                                        "<div class=\"pereka4_bar_perc color_bar_perc_pereka4\" style=\"margin-left:" + perc +"%\">" + Math.round(perc)/1 +" %</div>"+
                                    "</div>"+
                                    "<div class=\"exp-container\">\u0412 \u043D\u043E\u0440\u043C\u0435!"+ins_txt+"</div>";
}

        if (perc>100){
                perc = 100;

            var progress_bar_html = "<div class=\"pereka4_progress\">"+
		                                "<div class=\"pereka4_progress_bar exp-hight\" style=\"width:" + perc +"%\"></div>"+
                                        "<div class=\"pereka4_bar_perc color_bar_perc_pereka4\" style=\"margin-left:" + perc +"%\">" + Math.round(perc)/1 +" %</div>"+
                                    "</div>"+
                                    "<div class=\"exp-container\">\u041F\u0435\u0440\u0435\u043A\u0430\u0447!"+ins_txt+
                                        "<br />\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u043E\u043F\u044B\u0442\u0430:"+ (((sum_umk/srednya_umka/vlk)-1)*100).toFixed(2) +
                                    "</div>";
        }
        if (perc<0) {
            perc = 0;

            var progress_bar_html = "<div class=\"pereka4_progress\" style=\"background-color: #d35e50 !important;\">"+
		                                "<div class=\"pereka4_progress_bar exp-low\" style=\"width:" + perc +"%\"></div>"+
                                        "<div class=\"pereka4_bar_perc color_bar_perc_pereka4\" style=\"margin-left:" + perc +"%\">" + Math.round(perc)/1 +" %</div>"+
                                    "</div>"+
                                    "<div class=\"exp-container\">\u041D\u0435\u0434\u043E\u043A\u0430\u0447!"+ins_txt+
                                        "<br />\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u043C\u0435\u043D\u0438\u0439:"+ Math.round(((srednya_umka/sum_umk)-1)*1000)/10 +
                                    "</div>";

        }

        return progress_bar_html;

    }

    function showExpBar(){

        var tabelle = find("//table", XPList);
        var player_info = "";
        var skill_info = "";
        var player_faction = "";


        if (location.href.indexOf('home.php') != -1) {

            //var bg-color = "#fff";
            //Поиск страницы
            for (var i = 25; i < tabelle.snapshotLength; i++){

                if (!tabelle.snapshotItem(i)) continue;
                if (!tabelle.snapshotItem(i).childNodes[0]) continue;
                if (!tabelle.snapshotItem(i).childNodes[0].childNodes[0]) continue;

                //Player level
                if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0]) {

                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0].innerHTML.indexOf(T('Combat level') +":") > 0) {

                        player_info = tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0];

                                                // color
                        GM_addStyle(".color_bar_perc_pereka4 {background-color: #fff;}");

                    }

                }

                //Skill Info
                if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[1]) {

                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[1].innerHTML.indexOf(T('Knight') +":") > 0) {

                        skill_info = tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[1];

                    }

                }

            }
        	} else if (location.href.indexOf('pl_info.php') != -1) {

                //Поиск страницы
                for (var i = 25; i < tabelle.snapshotLength; i++){

                    if (!tabelle.snapshotItem(i)) continue;
                    if (!tabelle.snapshotItem(i).childNodes[0]) continue;

                    //Player Info
                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[2]) {

                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[2].childNodes[0]) {

                        if (tabelle.snapshotItem(i).childNodes[0].childNodes[2].childNodes[0].textContent.indexOf(T('Combat level') +":") > 0) {

                            player_info = tabelle.snapshotItem(i).childNodes[0].childNodes[2].childNodes[0];

                        // color
                        GM_addStyle(".color_bar_perc_pereka4 {background-color: #f5f3ea;}");

                        }

                    }

                }

                //Skill Info
                if (tabelle.snapshotItem(i).childNodes[0].childNodes[1]) {

                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[1].childNodes[1]) {

                        if (tabelle.snapshotItem(i).childNodes[0].childNodes[1].childNodes[1].textContent.indexOf(T('Knight')) > 0) {

                            skill_info = tabelle.snapshotItem(i).childNodes[0].childNodes[1].childNodes[1];

                        }

                    }

                }

            }

            /*tabelle.snapshotItem(31).childNodes[0].childNodes[0].childNodes[0].innerHTML.search(/\- (.*)</);
            player_faction = RegExp.$1;
            alert("player_faction = "+player_faction);*/

        }
        //alert(player_faction+'\n\n'+factions.indexOf(player_faction));

        //========== Combat Level
        var lvl_info = player_info.textContent.split("\u00BB")[1];
        lvl_info.search(/(.*)\((.*)\)(.*)/);
        var lvl_attuale = eval(RegExp.$1.replace(T('Combat level') +": ","")); //БУ
        var exp_attuale = 0;
        var skills = skill_info.innerHTML.split(">&nbsp;&nbsp;");

        //========== Player Faction(s)
        var active_faction_index = factions.indexOf(player_faction);

        // show ALL factions
        for(var faction_index=0; faction_index<factions.length; faction_index++){

                lvl_info = skills[faction_index];
                lvl_info.search(/\((\d*.?\d*)\)/);
                exp_attuale = RegExp.$1;
                sum_umk = sum_umk + Number(exp_attuale);

        }

        sum_umk = Math.round(sum_umk*100)/100;

            var nomerumki = (lvl_attuale - 3);
            srednya_umka = sred_umk[nomerumki];
            vilka = vilka_um[nomerumki];
            umk_min = sred_umk[nomerumki]/vilka;
            umk_max = sred_umk[nomerumki]*vilka;


            if (lvl_attuale>2){

                    	//progress_bar_html = makeProgressBar(sum_umk, umk_min, umk_max, vilka, lvl_attuale);
                        progress_bar_html = makeProgressBar(sum_umk, umk_min, umk_max, vilka, lvl_attuale);

            }

                if (faction_index<factions.length-1) {

                    var next_faction = factions[faction_index + 1];

                        skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;"+ next_faction, progress_bar_html +"&nbsp;&nbsp;"+ next_faction);
                        skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;<b>"+ next_faction, progress_bar_html +"&nbsp;&nbsp;<b>"+ next_faction);

                } else {

                    skill_info.innerHTML = skill_info.innerHTML.replace("<br>&nbsp;&nbsp;\u0413\u0438\u043B\u044C\u0434\u0438\u044F \u041E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432","<br>&nbsp;&nbsp;<span style='font-weight: bold;'>\u0421\u0443\u043C\u043C\u0430 \u0443\u043C\u0435\u043D\u0438\u0439:</span> "+ sum_umk + progress_bar_html +"<br>&nbsp;&nbsp;\u0413\u0438\u043B\u044C\u0434\u0438\u044F \u041E\u0445\u043E\u0442\u043D\u0438\u043A\u043E\u0432");

                }
    };

    // Конкретные действия для некоторых страниц
    if (location.href.indexOf('home.php') != -1)        showExpBar();
    if (location.href.indexOf('pl_info.php') != -1)     showExpBar();
};

main(false);
// ==UserScript==

// @name pereka4mod

// @author dw4rf & Casperovskii

// @namespace Pereka4

// @version 2.92 (2021.11.18)
// @description Add progress bar for sum of faction exp. and balance coef.

// @include       *//*heroeswm.*/home.php*
// @include       *//178.248.235.15/home.php*
// @include       *//*герои.рф/home.php*
// @include       *//*lordswm.*/home.php*
// @include       *//*heroeswm.*/pl_info.php*
// @include       *//178.248.235.15/pl_info.php*
// @include       *//*герои.рф/pl_info.php*
// @include       *//*lordswm.*/pl_info.php*
// @license        GPL-3.0+
// @downloadURL https://update.greasyfork.org/scripts/25254/pereka4mod.user.js
// @updateURL https://update.greasyfork.org/scripts/25254/pereka4mod.meta.js
// ==/UserScript==



// Основная функция, выполняемая при загрузке страницы целиком

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
    this.GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
    this.GM_addStyle = function(css) {
	var style = document.createElement('style');
	style.textContent = css;
	document.getElementsByTagName('head')[0].appendChild(style);
    };
    this.GM_registerMenuCommand = function(name, funk) {
	//todo
    };
}

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

    var version = "2.90";

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

    function makeProgressBar(exp_attuale, min_umka, max_umka, vlk, lvl){

		

            exp_attuale = exp_attuale - min_umka;

            max_umka = max_umka - min_umka;

            var perc = exp_attuale * 100 / max_umka;

	    var ins_txt="";

    // Stile

    var cssStyle = "";


        if (lvl > 18) ins_txt=" (\u0423 19-22 \u0443\u0440\u043E\u0432\u043D\u044F \u043D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F)."
        
        if (perc<100 && perc>0) {
                cssStyle += ".bar_wrap {width:150px; margin:3px 0 3px 9px;border: 1px solid #1C1C1C;background-color: #8C7526;box-shadow: 0 0 1px #666, inset 0 1px 1px #222;-webkit-box-shadow: 0 0 1px #666, inset 0 1px 1px #222;background-image: -moz-linear-gradient(#65541B, #8C7526 50%, #65541B);background-image: -webkit-linear-gradient(#65541B, #8C7526 50%, #65541B);}.bar {height: 5px;background-color: #f9e37e;border-right: 1px solid #282828;box-shadow: inset 0 0 1px #ddd;-webkit-box-shadow: inset 0 0 1px #ddd;background-image: -moz-linear-gradient(#e7ae6b, #be8d55 50%, #a57b4b 51%, #ae804c);background-image: -webkit-linear-gradient(#e7ae6b, #be8d55 50%, #a57b4b 51%, #ae804c);-moz-transition: all 1s ease;-webkit-transition: all 1s ease;}@-moz-keyframes slidein {from {width: 100%}}@-webkit-keyframes slidein {from {width: 100%}}.bar:hover {-moz-animation: animate-stripes 3s linear infinite;-webkit-animation: animate-stripes 3s linear infinite;}@-moz-keyframes animate-stripes {0% {background-position: 0 0;} 100% {background-position:0 22px;}}@-webkit-keyframes animate-stripes {0% {background-position: 0 0;} 100% {background-position:0 22px;}}.htooltip, .htooltip:visited, .tooltip:active {color: #0077AA;text-decoration: none;}.htooltip:hover {color: #0099CC;}.htooltip span {background-color: rgba(0,0,0, 0.8);border-radius: 5px 5px 0px 0px;-webkit-border-radius: 5px 5px 0px 0px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);-webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);color: #fff;margin-left: -1px;margin-top: -24px;opacity: 0;padding: 2px 5px;position: absolute;text-decoration: none;visibility: hidden;z-index: 10;-ms-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;}.htooltip:hover span {position: absolute;opacity: 1;visibility: visible;}";

           GM_addStyle(cssStyle);
			var progress_bar_html = "<div class=\"bar_wrap htooltip\">"+
			"<div class=\"bar\" style=\"max-width:150px;width:"+ perc +"%\"></div>"+
			"<span>\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: "+ Math.round(perc*100)/100 +"%</span>"+
			"</div>"+"<div style='font-size: 8px; font-weight: bold; margin: -11px 0 0 165px'>"+Math.round(perc)/1+"% </div>" +
			"<div>&nbsp;&nbsp;\u0412 \u043D\u043E\u0440\u043C\u0435!"+ins_txt+" </div>";
}
        if (perc>100){
                perc = 100;
                cssStyle += ".bar_wrap {width:150px; margin:3px 0 3px 9px;border: 1px solid #1C1C1C;background-color: #8C7526;box-shadow: 0 0 1px #666, inset 0 1px 1px #222;-webkit-box-shadow: 0 0 1px #666, inset 0 1px 1px #222;background-image: -moz-linear-gradient(#65541B, #8C7526 50%, #65541B);background-image: -webkit-linear-gradient(#65541B, #8C7526 50%, #65541B);}.bar {height: 5px;background-color: #f9e37e;border-right: 1px solid #282828;box-shadow: inset 0 0 1px #ddd;-webkit-box-shadow: inset 0 0 1px #ddd;background-image: -moz-linear-gradient(#e7ae6b, #be8d55 50%, #a57b4b 51%, #ae804c);background-image: -webkit-linear-gradient(#e7ae6b, #be8d55 50%, #a57b4b 51%, #ae804c);-moz-transition: all 1s ease;-webkit-transition: all 1s ease;}@-moz-keyframes slidein {from {width: 100%}}@-webkit-keyframes slidein {from {width: 100%}}.bar:hover {-moz-animation: animate-stripes 3s linear infinite;-webkit-animation: animate-stripes 3s linear infinite;}@-moz-keyframes animate-stripes {0% {background-position: 0 0;} 100% {background-position:0 22px;}}@-webkit-keyframes animate-stripes {0% {background-position: 0 0;} 100% {background-position:0 22px;}}.htooltip, .htooltip:visited, .tooltip:active {color: #0077AA;text-decoration: none;}.htooltip:hover {color: #0099CC;}.htooltip span {background-color: rgba(0,0,0, 0.8);border-radius: 5px 5px 0px 0px;-webkit-border-radius: 5px 5px 0px 0px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);-webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);color: #fff;margin-left: -1px;margin-top: -24px;opacity: 0;padding: 2px 5px;position: absolute;text-decoration: none;visibility: hidden;z-index: 10;-ms-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;}.htooltip:hover span {position: absolute;opacity: 1;visibility: visible;}";
			GM_addStyle(cssStyle);
			var progress_bar_html = "<div class=\"bar_wrap htooltip\">"+
			"<div class=\"bar\" style=\"max-width:150px;width:"+ perc +"%\"></div>"+
			"<span>\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: "+ perc +"%</span>"+
			"</div>"+"<div style='font-size: 8px; font-weight: bold; margin: -11px 0 0 165px'>"+perc+"% </div>"+
                "</div><br>&nbsp;&nbsp;\u041F\u0435\u0440\u0435\u043A\u0430\u0447!"+ins_txt+"<br>&nbsp;&nbsp;\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u043E\u043F\u044B\u0442\u0430: +"+(((sum_umk/srednya_umka/vlk)-1)*100).toFixed(2)+"%<br>";
        }
        if (perc<0) {
            perc = 0;
                cssStyle += ".bar_wrap {width:150px; margin:3px 0 3px 9px;border: 1px solid #1C1C1C;background-color: #8C7526;box-shadow: 0 0 1px #666, inset 0 1px 1px #222;-webkit-box-shadow: 0 0 1px #666, inset 0 1px 1px #222;background-image: -moz-linear-gradient(#65541B, #8C7526 50%, #65541B);background-image: -webkit-linear-gradient(#65541B, #8C7526 50%, #65541B);}.bar {height: 5px;background-color: #f9e37e;border-right: 1px solid #282828;box-shadow: inset 0 0 1px #ddd;-webkit-box-shadow: inset 0 0 1px #ddd;background-image: -moz-linear-gradient(#e7ae6b, #be8d55 50%, #a57b4b 51%, #ae804c);background-image: -webkit-linear-gradient(#e7ae6b, #be8d55 50%, #a57b4b 51%, #ae804c);-moz-transition: all 1s ease;-webkit-transition: all 1s ease;}@-moz-keyframes slidein {from {width: 100%}}@-webkit-keyframes slidein {from {width: 100%}}.bar:hover {-moz-animation: animate-stripes 3s linear infinite;-webkit-animation: animate-stripes 3s linear infinite;}@-moz-keyframes animate-stripes {0% {background-position: 0 0;} 100% {background-position:0 22px;}}@-webkit-keyframes animate-stripes {0% {background-position: 0 0;} 100% {background-position:0 22px;}}.htooltip, .htooltip:visited, .tooltip:active {color: #0077AA;text-decoration: none;}.htooltip:hover {color: #0099CC;}.htooltip span {background-color: rgba(0,0,0, 0.8);border-radius: 5px 5px 0px 0px;-webkit-border-radius: 5px 5px 0px 0px;box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);-webkit-box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);color: #fff;margin-left: -1px;margin-top: -24px;opacity: 0;padding: 2px 5px;position: absolute;text-decoration: none;visibility: hidden;z-index: 10;-ms-transition: opacity 0.4s ease-in-out, visibility 0.4s ease-in-out;}.htooltip:hover span {position: absolute;opacity: 1;visibility: visible;}";
			GM_addStyle(cssStyle);
			var progress_bar_html = "<div class=\"bar_wrap htooltip\">"+
			"<div class=\"bar\" style=\"max-width:150px;width:"+ perc +"%\"></div>"+
			"<span>\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441: "+ perc +"%</span>"+
			"</div>"+"<div style='font-size: 8px; font-weight: bold; margin: -11px 0 0 165px'>"+perc+"% </div>"+
            "</div><br>&nbsp;&nbsp;\u041D\u0435\u0434\u043E\u043A\u0430\u0447!"+ins_txt+"<br>&nbsp;&nbsp;\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0443\u043C\u0435\u043D\u0438\u0439: +"+Math.round(((srednya_umka/sum_umk)-1)*1000)/10+"%<br><br>";
            
        }
        return progress_bar_html;

    }



    function showExpBar(){

        var tabelle = find("//table", XPList);

        var player_info = "";

        var skill_info = "";

        var player_faction = "";

        


        if (location.href.indexOf('home.php') != -1) {

            //Поиск страницы

            for (var i = 25; i < tabelle.snapshotLength; i++){

                if (!tabelle.snapshotItem(i)) continue;

                if (!tabelle.snapshotItem(i).childNodes[0]) continue;

                if (!tabelle.snapshotItem(i).childNodes[0].childNodes[0]) continue;
				


                //Player level

                if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0]) {

                    if (tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0].innerHTML.indexOf(T('Combat level') +":") > 0) {

                        player_info = tabelle.snapshotItem(i).childNodes[0].childNodes[0].childNodes[0];

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
                    	progress_bar_html = makeProgressBar(sum_umk, umk_min, umk_max, vilka, lvl_attuale);}

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
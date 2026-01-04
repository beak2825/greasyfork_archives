// ==UserScript==
// @name         Path of Ninja chat locations
// @version      0.3.7
// @author       bes
// @description  chat locations
// @include      https://pathofninja.ru/game/game*
// @include      https://pathofninja.ru/map/index.php*
// @include      https://pon.fun/game/game*
// @include      https://pon.fun/map/index.php*
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/214795
// @downloadURL https://update.greasyfork.org/scripts/372487/Path%20of%20Ninja%20chat%20locations.user.js
// @updateURL https://update.greasyfork.org/scripts/372487/Path%20of%20Ninja%20chat%20locations.meta.js
// ==/UserScript==


unsafeWindow.top.am_settings = localStorage['am_settings'];
		if (typeof unsafeWindow.top.am_settings != "undefined") {
			unsafeWindow.top.am_settings = JSON.parse(unsafeWindow.top.am_settings);
		} else {
			unsafeWindow.top.am_settings = {
				"am1": true,
				"am2": true,
				"am3": true,
				"am4": true
			};
		}


if (location.href.search("map")>0 && unsafeWindow.top.am_settings["am3"]) {
    unsafeWindow.$(".top_menu").append($('<span style="color:white">Поиск :</span><input autocomplete="off" id="filterr" size="25" align="middle" onchange="show();" type="text">'));

unsafeWindow.mark_items = function(m_filter) {
    unsafeWindow.$('.info').each(function(index1, val1) {
                    if (val1.onmouseover.toString().search(m_filter) > 0) {
                        unsafeWindow.$(val1).css("background-color", "rgba(255,255,255, 0.3)");
                    }
                });
    if (m_filter=="Алхимия: 1") {unsafeWindow.unmark_items("Алхимия: 10")};
    if (m_filter=="Рыбалка: 1") {unsafeWindow.unmark_items("Рыбалка: 10")};
    if (m_filter=="Рыбалка: 1") {unsafeWindow.unmark_items("Рыбалка: 11")};
    if (m_filter=="Кулинария: 1") {unsafeWindow.unmark_items("Кулинария: 10")};
    if (m_filter=="Кулинария: 1") {unsafeWindow.unmark_items("Кулинария: 11")};
    if (m_filter=="Кулинария: 1") {unsafeWindow.unmark_items("Кулинария: 12")};
    if (m_filter=="Кулинария: 1") {unsafeWindow.unmark_items("Кулинария: 13")};
    if (m_filter=="Кулинария: 1") {unsafeWindow.unmark_items("Кулинария: 14")};
}

unsafeWindow.unmark_items = function(m_filter) {
    unsafeWindow.$('.info').each(function(index1, val1) {
                    if (val1.onmouseover.toString().search(m_filter) > 0) {
                        unsafeWindow.$(val1).css("background-color", "");
                    }
                });
}

unsafeWindow.show = function() {
 unsafeWindow.GroupData = {
        "Алхимия: 1": "Пак-чой,Гинкго,Стевия,Люцерна,Кордицепс",
        "Алхимия: 2": "Красная горчица,Лиция,Айован,Алоэ,Литопс",
        "Алхимия: 3": "Комацуна,Померанец,Тысячелистник,Маитаке,Подорожник",
        "Алхимия: 4": "Мицуна,Батун,Пырей,Бороздоплодник,Рейши",
        "Алхимия: 5": "Скрытница,Мята,Звездчатка,Камелия,Келп",
        "Алхимия: 6": "Одуванчик,Снежноягодник,Осока морозная,Ягель,Кладония",
        "Алхимия: 7": "Кокабу,Чага,Имбирь,Готу Кола,Жимолость",
        "Алхимия: 8": "Перилла красная,Лимонник,Паэдерия,Пория,Розмарин",
        "Алхимия: 9": "Перилла зеленая,Пинеллия,Репейник,Подмаренник,Аир болотный",
        "Алхимия: 10": "Ликорис,Кудзу,Кизил,Морозник,Донник",
        "Рыбалка: 1": "Бычок,Смарида,Барабулька",
        "Рыбалка: 2": "Пикша,Скумбрия,Ставрида",
        "Рыбалка: 3": "Уклейка,Красноперка,Окунь,Язь,Налим",
        "Рыбалка: 4": "Карась,Лещ, Щука,Сом",
        "Рыбалка: 5": "Окунь,Карась,Язь,Семга,Форель",
        "Рыбалка: 6": "Лещ,Карп,Судак,Стерлядь",
        "Рыбалка: 7": "Бычок,Смарида, Барабулька",
        "Рыбалка: 8": "Кефаль,Скумбрия,Камбала,Треска",
        "Рыбалка: 9": "Пикша,Смарида,Барабулька",
        "Рыбалка: 10": "Кефаль,Треска",
        "Рыбалка: 11": "Тунец,Катран,Палтус",
        "Кулинария: 1": "Рис",
        "Кулинария: 2": "Дайкон",
        "Кулинария: 3": "Ростки бамбука",
        "Кулинария: 4": "Шиитаке,Минкан",
        "Кулинария: 5": "Соя",
        "Кулинария: 6": "Нори",
        "Кулинария: 7": "Чеснок",
        "Кулинария: 8": "Кунжут,Кокос ",
        "Кулинария: 9": "Морковь,Огурец,Судачи",
        "Кулинария: 10": "Персик",
        "Кулинария: 11": "Зеленый чай",
        "Кулинария: 12": "Черный чай",
        "Кулинария: 13": "Красный чай",
        "Кулинария: 14": "Кофе",
        "Лесозаготовка: 1": "Ель,Ясень,Тис",
        "Лесозаготовка: 2": "Пальма,Красное дерево,Баобаб,Эбеновое дерево",
        "Лесозаготовка: 3": "Бамбук,Сосна,Вишня,Вяз,Секвойя",
        "Лесозаготовка: 4": "Каштан,Бук,Граб",
        "Лесозаготовка: 5": "Ольха,Секвойя,Тик",
        "Лесозаготовка: 6": "Ива,Лиственница,Кедр",
        "Лесозаготовка: 7": "Клен,Дуб,Орех",
        "Лесозаготовка: 8": "Магнолия,Пихта,Драконовое дерево"
    }
    unsafeWindow.find_filter = unsafeWindow.filterr.value;

	unsafeWindow.$('.info').each(function(index, val) {
        unsafeWindow.$(val).css("background-color", "");
    });

	if (unsafeWindow.find_filter.replace(" ","")=="") {return 1}



    unsafeWindow.$.each(unsafeWindow.GroupData, function(index, val) {
            if (val.search(unsafeWindow.filterr.value) >= 0) {
                unsafeWindow.find_filter = index;
                unsafeWindow.mark_items(unsafeWindow.find_filter);
            }

        });
     unsafeWindow.mark_items(unsafeWindow.filterr.value.replace("[","\\[").replace("]","\\]"));

}
}
else {
(function() {
    'use strict';
   function myfunction() {

unsafeWindow.top.add_sell_pills_button = function(){
if (unsafeWindow.top.game.$(".menu_but_focus").text()=="Старьевщик") {
    unsafeWindow.top.game.$("#panel2").after(unsafeWindow.top.game.$("<input type='button' id='am_sell_button' value='Продать все пилюли'>"));
    unsafeWindow.top.game.$("#am_sell_button").on("click",function(){
        unsafeWindow.$.each(unsafeWindow.top.game.item_count,function(index, val) {
            if (typeof val == "string" && val.search("Пилюли")!=-1) {
                unsafeWindow.top.game.data_send('trade_sell_old', '&iid='+index, [['lvl_from','lvl_to','prc_min','prc_max','type_item','type_group'],'name',0])
            }
        });
    });
}
}

unsafeWindow.top.chat.goxy = function(sector) {
		unsafeWindow.top.game.nav_object(sector);
		unsafeWindow.top.game.data_send('map_step_auto','',[['nav_x','nav_y'],'name',1],unsafeWindow.top.game.map_update_info);
}

if (unsafeWindow.top.chat.old_smile_show==undefined) {
unsafeWindow.top.chat.old_smile_show=top.chat.smile_show;
unsafeWindow.top.chat.smile_show = function(txt)
{
	if (unsafeWindow.top.am_settings["am1"]) {
    txt=replaceAll(txt, '{s}', '<img class="img_smile" src="/img/smile/');
	txt=replaceAll(txt, '{/s}', '.svg">');
	txt=txt.replace(/(\d{1,3})[\-](\d{1,3})(?!\d{0,1}\.svg)/ig,'<a style="text-decoration: underline;font-weight: bold;" href=\"javascript:(function(){top.chat.goxy(\'$1_$2\');})();\">$&</a>');
 	return txt;
    }
    else return unsafeWindow.top.chat.old_smile_show(txt);
}
}

if (unsafeWindow.top.game.old_data_send==undefined) {
unsafeWindow.top.game.old_data_send=top.game.data_send;
unsafeWindow.top.game.data_send = function(act, base, add, func) {
    if (act.slice(-3)=="end" || act.slice(-3)=="finish") unsafeWindow.top.document.title = `Path of Ninja`;
    //console.log(act.slice(-3));
    unsafeWindow.top.game.old_data_send(act, base, add, func)
}
}

if (unsafeWindow.top.game.old_data_update==undefined) {
unsafeWindow.top.game.old_data_update=top.game.data_update;
unsafeWindow.top.game.data_update = function(data, status) {
   // console.log(data);
    if ((data[3]!=undefined)&&(data[3][1]=="se_div")) {setTimeout(unsafeWindow.top.show_my_settings,150)}
    if ((data[2]!=undefined)&&(typeof data[2][2] == "string" && data[2][2].search("Старьевщик")>0)) {setTimeout(unsafeWindow.top.add_sell_pills_button,150)}
	if ((data[3]!=undefined)&&(data[3][1]=="quest_div")) {
	if (unsafeWindow.top.am_settings["am2"]) data[3][2]=data[3][2].replace(/(\d{1,3})[\-](\d{1,3})(?!\d{0,1}\.svg)/ig,'<a style="text-decoration: underline;font-weight: bold;" href=\"javascript:(function(){top.chat.goxy(\'$1_$2\');})();\">$&</a>');
}
	unsafeWindow.top.game.old_data_update(data, status);
}
}
if (unsafeWindow.top.game.old_mk_time==undefined) {
	unsafeWindow.top.game.old_mk_time=top.game.mk_time;
	unsafeWindow.top.game.mk_time = function(t) {
		var mytime = unsafeWindow.top.game.old_mk_time(t);
        var mytimeTitle = "";
		if (mytime!='00:00:00' && (unsafeWindow.top.game.$('#show_act:visible').length>0 || unsafeWindow.top.game.$('#train:visible').length>0) || unsafeWindow.top.game.$(".div1:contains('Идет лекция')").length>0) {
            mytimeTitle = mytime;
            if (mytime.slice(0,2)=="00") mytimeTitle=mytime.slice(-5);
            mytimeTitle="["+mytimeTitle+"] ";
        }
        if (unsafeWindow.top.am_settings["am4"]) unsafeWindow.top.document.title = `${mytimeTitle}Path of Ninja`;
        return mytime;
}
}

unsafeWindow.top.show_my_settings = function(){
var my_menu_html=`<tr><th colspan="2">Надстройки от AirMaster
      </th></tr><tr>
        <td colspan="2">
          <div data-center="" style="justify-content: space-between">
            <img class="title" src="/img/smile/1_73.svg" style="height: 21px; border-radius: 3px; margin: 0px;" title="Для применения настроек необходимо обновить страничку (F5).">
            <div style="width: calc(100% - 31px);"><table class="tbl5" style="width: 100%; margin: 4px 0;">
              <tbody><tr>
                <td><label><input class="am_settings" id="am1" type="checkbox"> Кликабельные сектора в чате</label></td>
                <td><label><input class="am_settings" id="am2" type="checkbox"> Кликабельные сектора в квестах</label></td>
                </tr><tr>
                <td><label><input class="am_settings" id="am3" type="checkbox"> Поиск ресурсов на карте</label></td>
                <td><label><input class="am_settings" id="am4" type="checkbox"> Таймеры в заголовке</label></td>
             </tr></tbody></table></div>
        </div>
      </td></tr>`;

var rezult_div = unsafeWindow.top.game.$("#se_div").html();
if (rezult_div.search("Настройки чата")!=-1 && rezult_div.search("AirMaster")==-1)
{
	unsafeWindow.top.game.$("#se_div").children().children().after(unsafeWindow.$(my_menu_html));
	unsafeWindow.top.game.$(".am_settings").each(function() {
			this.checked = unsafeWindow.top.am_settings[this.id];
		});
	unsafeWindow.top.game.$(".am_settings").change(function() {
			unsafeWindow.top.am_settings[this.id] = this.checked;
			localStorage['am_settings'] = JSON.stringify(unsafeWindow.top.am_settings);
            if (this.id=="am4") unsafeWindow.top.document.title = `Path of Ninja`;
		});
}
}
unsafeWindow.top.chat.$(".setting").on("click",function(){setTimeout(top.show_my_settings,200)});
setTimeout(unsafeWindow.top.add_sell_pills_button,150);

   }
setTimeout(myfunction,200);
})();

}
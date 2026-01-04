// ==UserScript==
// @name         Kinozal-MyList
// @namespace    http://tampermonkey.net/
// @version      20.03.27.32
// @description  Создай свой список избранного (изменения 27.03.2020)
// @author       Drygin
// @match        https://kinozal-tv.appspot.com/*
// @match        http://kinozal.tv/*
// @match        http://kinozal.tv.http.s71.wbprx.com/*
// @run-at       document-end
// @grant        none
// @copyright    2020, Drygin Max
// @downloadURL https://update.greasyfork.org/scripts/381716/Kinozal-MyList.user.js
// @updateURL https://update.greasyfork.org/scripts/381716/Kinozal-MyList.meta.js
// ==/UserScript==

(function() {
    'use strict';

if (!is_injected) {
	function findDiscriptions() {
			var titleData = discList[i].querySelector("div");
		//return items;
	}

function insertBlock() {
//*[@id="main"]/div[1]/div[7]

		var div = document.createElement("div");

		var a = '&g=0&c=45&v=0&d=0&w=4&t=0&f=0">' //Русские сериалы за неделю
		var b = '&c=46&v=0&d=0&w=4&t=0&f=0">' 	//Буржуйские сериалы за неделю
        var с = '&g=0&c=46&v=0&d=0&w=0&t=0&f=0">' 	//Буржуйские сериалы за всё время

        var ser1 = '<div><span class="bulet"></span><a href="/browse.php?s='
		var ser2 = '</a></li></div>'

        var zag1 = '<details class="bx2_0"><summary>' //Внешний вид имени списка
        var zag2 = '</summary>'
        var zag3 = '</details>'

        var txt1 = '<div class="bx2_0">'+
            '<ul class="men">'+
            '<li class="tp2 center b">ИЗБРАННОЕ</li>'+

    zag1 + '--------- СМОТРИМ ----------------'+ zag2 +
ser1 + 'Brooklyn+Nine-Nine'+ b +'Бруклин 9-9' + ser2 +
ser1 + 'Vikings'+ b +'Викинги' + ser2 +
ser1 + 'The+Magicians'+ b +'Волшебники' + ser2 +
ser1 + 'The+Deuce'+ b +'Двойка' + ser2 +
ser1 + 'Better+Call+Saul'+ b +'Лучше звоните Солу' + ser2 +
ser1 + 'Westworld'+ b +'Мир Дикого запада' + ser2 +
ser1 + 'Into+the+Dark'+ b +'Навстречу тьме (Под покровом ночи)' + ser2 +
ser1 + 'Better+Things'+ b +'Перемены' + ser2 +
ser1 + 'Disenchantment'+ b +'Разочарование' + ser2 +
ser1 + 'Devs'+ b +'Разрабы' + ser2 +
ser1 + 'Sacred+Lies'+ b +'Священная ложь' + ser2 +
ser1 + 'Amazing+Stories'+ b +'Удивительные истории' + ser2 +
ser1 + 'Miracle+Workers'+ b +'Чудотворцы' + ser2 +
ser1 + 'The+Walking+Dead'+ b +'Ходячие Мертвецы' + ser2 +
            zag3 +


    zag1 + '--------- СКОРО --------------------'+ zag2 +
ser1 + 'American+Gods'+ b +'Американские боги' + ser2 +
ser1 + 'American+Horror+Story'+ b +'Американская история ужасов' + ser2 +
ser1 + 'Barry'+ b +'Барри' + ser2 +
ser1 + 'Fear+the+Walking+Dead'+ b +'Бойтесь ходячих мертвецов' + ser2 +
ser1 + 'Warrior'+ b +'Воин' + ser2 +
ser1 + 'Sex+Education'+ b +'Все о сексе (Половое воспитание)' + ser2 +
ser1 + 'Altered+Carbon'+ b +'Видоизмененный углерод' + ser2 +
ser1 + 'Servant'+ b +'Дом с прислугой' + ser2 +
ser1 + 'Peaky+Blinders'+ b +'Заточенные кепки (Острые козырьки)' + ser2 +
ser1 + 'Star+Trek:+Picard'+ b +'Звёздный путь: Пикар' + ser2 +
ser1 + 'Castle+Rock'+ b +'Касл-Рок' + ser2 +
ser1 + 'Carnival+Row'+ b +'Корнивал Роу' + ser2 +
ser1 + 'Blood+Drive'+ b +'Кровавая гонка' + ser2 +
ser1 + 'Legion'+ b +'Легион' + ser2 +
ser1 + 'The+Mandalorian'+ b +'Мандалорец' + ser2 +
ser1 + 'Mr.+Mercedes'+ b +'Мистер Мерседес' + ser2 +
ser1 + 'Z+Nation'+ b +'Нация Z' + ser2 +
ser1 + 'Stranger+Things'+ b +'Очень странные дела (Загадочные события)' + ser2 +
ser1 + 'Ольга'+ a +'Ольга' + ser2 +
ser1 + 'Mindhunter'+ b +'Охотник за разумом' + ser2 +
ser1 + 'The+Boys'+ b +'Пацаны' + ser2 +
ser1 + 'Pennyworth'+ b +'Пенниуорт' + ser2 +
ser1 + 'Sneaky+Pete'+ b +'Подлый Пит (Хитрый Пит)' + ser2 +
ser1 + 'Полярный'+ a +'Полярный' + ser2 +
ser1 + 'Preacher'+ b +'Проповедник' + ser2 +
ser1 + 'Swedish+Dicks'+ b +'Придурки из Швеции (Шведские стволы)' + ser2 +
ser1 + 'Реальные+пацаны'+ a +'Реальные пацаны' + ser2 +
ser1 + 'Doom+Patrol'+ b +'Роковой патруль' + ser2 +
ser1 + 'The+100'+ b +'Сотня' + ser2 +
ser1 + 'The+Terror'+ b +'Террор' + ser2 +
ser1 + 'The+Dark+Tower'+ b +'Темная башня' + ser2 +
ser1 + 'His+Dark+Materials'+ b +'Темные начала' + ser2 +
ser1 + 'Dark'+ b +'Тьма' + ser2 +
ser1 + 'Killing+Eve'+ b +'Убивая Еву' + ser2 +
ser1 + 'Fargo'+ b +'Фарго' + ser2 +
ser1 + 'Happy!'+ b +'Хэппи' + ser2 +
ser1 + 'Black+Mirror'+ b +'Черное зеркало' + ser2 +
ser1 + 'The+Outsider'+ b +'Чужак' + ser2 +
ser1 + 'Ash+vs+Evil+Dead'+ b +'Эш против Зловещих мертвецов' + ser2 +
            zag3 +


    zag1 + '--------- МОЖЕТ БЫТЬ -----------'+ zag2 +
ser1 + 'Homecoming'+ с +'Возвращение домой' + ser2 +
ser1 + 'I+Am+The+Night'+ с +'Имя мне Ночь' + ser2 +
ser1 + 'Tell+Me+a+Story'+ с +'Расскажи мне сказку' + ser2 +
ser1 + 'Deadly+Class'+ с +'Убийственный класс (Академия смерти)' + ser2 +
ser1 + 'El+Chapo'+ с +'Эль Чапо' + ser2 +
ser1 + 'This+Is+Us'+ с +'Это мы' + ser2 +
            zag3 +

    zag1 + '--------- БРОСИЛИ ----------------'+ zag2 +
ser1 + 'See'+ b +'Видеть' + ser2 +
ser1 + 'For+All+Mankind'+ b +'Ради всего человечества' + ser2 +
ser1 + 'The+Blacklist'+ с +'Черный список' + ser2 +
ser1 + 'Gotham'+ с +'Готэм' + ser2 +
            zag3 +

    zag1 + '--------- ЗАКРЫТЫ ----------------'+ zag2 +
ser1 + 'Agents+of+S.H.I.E.L.D.'+ с +'Агенты «Щ.И.Т.»' + ser2 +
ser1 + 'Banshee'+ с +'Банши' + ser2 +
ser1 + 'Good+Omens'+ с +'Благие знамения' + ser2 +
ser1 + 'Grimm'+ с +'Гримм' + ser2 +
ser1 + 'Holistic+Detective+Agency'+ с +'Детективное агентство Дирка Джентли' + ser2 +
ser1 + 'Outcast'+ с +'Изгой' + ser2 +
ser1 + 'Game+of+Thrones'+ с +'Игра престолов' + ser2 +
ser1 + 'Chilling+Adventures+of+Sabrina'+ с +'Леденящие душу приключения Сабрины' + ser2 +
ser1 + 'Inhumans'+ с +'Marvels Inhumans' + ser2 +
ser1 + 'Master+of+None'+ с +'Мастер на все руки' + ser2 +
ser1 + 'The+Mist'+ с +'Мгла' + ser2 +
ser1 + 'Channel+Zero'+ с +'Нулевой канал (Канал Зеро)' + ser2 +
ser1 + 'The+Last+Man+on+Earth'+ с +'Последний человек на земле' + ser2 +
ser1 + 'Star+Trek:+Discovery'+ с +'Star Trek: Discovery' + ser2 +
ser1 + 'The+Shannara+Chronicles'+ с +'Хроники Шаннары' + ser2 +
ser1 + 'Chernobyl'+ с +'Чернобыль' + ser2 +
ser1 + 'Outlander'+ с +'Чужестранка' + ser2 +
ser1 + 'The+Strain'+ с +'Штамм' + ser2 +
ser1 + 'Elementary'+ с +'Элементарно' + ser2 +
            zag3 +

            '</ul></div>'

		div.innerHTML = txt1;
		var paginator = document.querySelector("div.bx2_0");
		var parentDiv = paginator.parentNode;
		parentDiv.insertBefore(div, paginator);

	//	document.getElementById('_kinozal_ext_show_hidden').addEventListener('click', click_showHidden);
	}
	insertBlock();

}

var is_injected = true;

//inherit AbstractModulePage,
var ModulePage = new AbstractModulePage();
//function ModulePage() {
	//selector for basic post element
	ModulePage.elementSelector = 'tr.bg,td.nam'; //'tr.bg,td.nam'
	// selector for forum post element, child of basic post element
	ModulePage.postIdent = "a[href *= '/details.php?id=']";
	ModulePage.forumPostSelector = "td:has(" + ModulePage.postIdent + ")";
	// selector for text of post
	 ModulePage.postIdentSelector = "";

	 ModulePage.postLinkSelector ='a[href *= "details.php?id="]';
	//torrent page structure
	ModulePage.torrentPageSelectors = {
			torrentPageBody : '.mn_wrap', //'div.mn_wrap', '#tabs', '#ratio_get',  'li.img',
        //torrentPageExcludable : '.mn1_content, .mn1_content, .bx1 justify, h2',
			torrentPageExcludable : '.w100p, .bx2_0, #tabs2, .r0, .r1, .r2, #ratio_get, justify.mn2, .pad0x0x5x0, .tp, .bulet, .cat_img_r', //'div.bx2_0', '#tabs2', justify.mn2, .pad0x0x5x0,
		//	torrentPageImage : '.p200'
	}
})();
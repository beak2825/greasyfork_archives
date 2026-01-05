// ==UserScript==
// @name         Zelluloza Dumper
// @version      0.7
// @description  Сохраняет фрагмент или все фрагменты книги, доступные для чтения в формате fb2. Книги защищенные максимальной защитой сохранет в виде картинок в pdf или fb2
// @author       MadDAD
// @require  https://greasyfork.org/scripts/15924-jspdf/code/jsPDF.js?version=99137
// @require  https://greasyfork.org/scripts/2350-filesaver-js/code/filesaverjs.js?version=6255
// @include  https://zelluloza.ru/books/*
// @include  https://zelluloza.ru/search/*
// @namespace https://greasyfork.org/users/38856
// @downloadURL https://update.greasyfork.org/scripts/18797/Zelluloza%20Dumper.user.js
// @updateURL https://update.greasyfork.org/scripts/18797/Zelluloza%20Dumper.meta.js
// ==/UserScript==

//*******************************************************************************************
function $(id)
{
	var result = document.getElementById(id);

	if (result === null)
	{
		result = document.getElementsByClassName(id);

		if (result === undefined)
			result = document.getElementsByTagName(id);

		if (result === undefined)
			return null;

		if (result.length == 1)
			return result[0];
	}
	else
		return result;
}

//*******************************************************************************************
function retrieveWindowVariables(variables)
{
	var ret = {};

	var scriptContent = "";
	for (var i = 0; i < variables.length; i++)
	{
		var currVariable = variables[i];
		scriptContent += "if (typeof " + currVariable + " !== 'undefined') document.body.attributes['tmp_" + currVariable + "'] = eval(" + currVariable + ");\n"
	}

	var script = document.createElement('script');
	script.id = 'tmpScript';
	script.appendChild(document.createTextNode(scriptContent));
	(document.body || document.head || document.documentElement).appendChild(script);

	for (var i = 0; i < variables.length; i++)
	{
		var currVariable = variables[i];
		ret[currVariable] = document.body.attributes[currVariable];
		document.body.removeAttribute(currVariable);
	}

	document.getElementById("tmpScript").remove();

	return ret;
}

//***************************************
function getXmlHttp()
{
	var a;
	try
	{
		a = new ActiveXObject("Msxml2.XMLHTTP")
	}
	catch (d)
	{
		try
		{
			a = new ActiveXObject("Microsoft.XMLHTTP")
		}
		catch (b)
		{
			a = false
		}
	}
	if (!a && typeof XMLHttpRequest != "undefined")
	{
		a = new XMLHttpRequest()
	}
	return a
}

//*************************************
HTMLImageElement.prototype.getUrlData = function ()
{
	var cnv = document.createElement("CANVAS");
	cnv.width = this.width;
	cnv.height = this.height;
	var cont = cnv.getContext("2d");
	cont.drawImage(this, 0, 0);
	return cnv.toDataURL('image/png', 0, 0);
};

//Asinc image loader
function ImageLoader(images, callback)
{
	// store the call-back
	this.callback = callback;
	// initialize internal state.
	this.nLoaded = 0;
	this.nProcessed = 0;
	this.aImages = new Array();
	// record the number of images.
	this.nImages = images.length;
	// for each image, call preload()
	for (var i = 0; i < images.length; i++)
		this.preload(images[i]);
}

ImageLoader.prototype.preload = function (image)
{
	// create new Image object and add to array
	var oImage = new Image();
	this.aImages.push(oImage);
	// set up event handlers for the Image object
	oImage.onload = ImageLoader.prototype.onload;
	oImage.onerror = ImageLoader.prototype.onerror;
	oImage.onabort = ImageLoader.prototype.onabort;
	// assign pointer back to this.
	oImage.oImageLoader = this;
	oImage.bLoaded = false;
	oImage._src = image;
	// assign the .src property of the Image object
	oImage.src = image;
};

ImageLoader.prototype.onComplete = function ()
{
	this.nProcessed++;
	my_getbyid("bookpg").innerHTML = 'Загружено страниц: ' + this.nProcessed + ' из ' + this.nImages;
	if (this.nProcessed == this.nImages)
	{
		this.callback(this.aImages, this.nLoaded);
	}
};

ImageLoader.prototype.onload = function ()
{
	this.bLoaded = true;
	this.oImageLoader.nLoaded++;
	this.oImageLoader.onComplete();
};

ImageLoader.prototype.onerror = function ()
{
	this.bError = true;
	this.oImageLoader.onComplete();
};

ImageLoader.prototype.onabort = function ()
{
	this.bAbort = true;
	this.oImageLoader.onComplete();
};
//*************************************

function ParceUserToken(aScripts)
{
	for (var i = 0; i < aScripts.length; i++)
	{
		var CurrentScript = aScripts[i];
		if (CurrentScript.text !== "")
			if (CurrentScript.text.indexOf('getbook') > 0)

			{
				UserToken = eval(CurrentScript.text.split(';')[1].split(',')[5]);
				if (UserToken !== undefined)
					return UserToken;
			}
	}
}

function getDoc(ref)
{
	var xmlhttp = getXmlHttp();
	xmlhttp.open("GET", ref, false);

	if (xmlhttp.readyState == 1)
	{
		xmlhttp.setRequestHeader("Content-Type", "text/html");
		xmlhttp.send();
	}

	if (xmlhttp.status != 200)
	{
		alert(xmlhttp.status + ': ' + xmlhttp.statusText); // пример вывода: 404: Not Found
	}
	else
	{
		return new DOMParser().parseFromString(xmlhttp.responseText, "text/html");
	}
}

function GetUserToken(dDoc)
{
	if (dDoc === undefined)
		dDoc = document;

	var UserToken = ParceUserToken(dDoc.getElementsByTagName("script"));

	if (UserToken === undefined)
	{
		var URL = dDoc.getElementsByClassName("taglnk2");
		for (var i = 0; i < URL.length; i++)
		{
			UserToken = ParceUserToken(getDoc(URL[i].getAttribute("href")).getElementsByTagName("script"));
			if (UserToken !== undefined)
				return UserToken;
		}

	}

	return UserToken;
}

//************************************* Асинхронный загрузчик глав
function FragmentLoader(links, usertoken, callback, progressor)
{
	this.callback = callback;
	this.nLoaded = 0;
	this.nProcessed = 0;
	this.bloaded = false;
	this.nFragments = links.length;
	this.usertoken = usertoken;
	this.aFragments = new Array();
	this.progressor = progressor;
	for (var i = 0; i < this.nFragments; i++)
	{
		this.load(links[i], i);
	}
}

FragmentLoader.prototype.load = function (fragment, fnumber)
{
	var xmlhttp = getXmlHttp();
	xmlhttp.oFragmentLoader = this;

	var Chapter =
	{
		number : fnumber,
		name : fragment.childNodes[3].text,
		link : fragment.childNodes[3].getAttribute("href"),
		bookId : fragment.childNodes[3].getAttribute("href").split('/')[2],
		partId : fragment.childNodes[3].getAttribute("href").split('/')[3],
		text : '<p>Необходимо купить фрагмент</p>',
		needToBuy : fragment.childNodes[1].value.indexOf('Купить') != -1
	};

	xmlhttp.Fragment = Chapter;
	//xmlhttp.onload = FragmentLoader.prototype.onload;
	xmlhttp.onreadystatechange = FragmentLoader.prototype.onload;

	if (Chapter.needToBuy)
	{
		xmlhttp.onreadystatechange();
		return;
	}

	var params = "op=" + encodeURIComponent('getbook') + "&par1=" + encodeURIComponent(Chapter.bookId) + "&par2=" + encodeURIComponent(Chapter.partId + ':0.0.1::0') + "&par4=" + encodeURIComponent(this.usertoken);
	if (xmlhttp.readyState == 0)
	{
		xmlhttp.open("POST", "/ajaxcall/", true);
	}

	if (xmlhttp.readyState == 1)
	{
		xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xmlhttp.send(params);
	}

};

FragmentLoader.prototype.onload = function ()
{

	if (this.Fragment.needToBuy)
	{
		this.oFragmentLoader.nLoaded++;
		this.oFragmentLoader.aFragments[this.Fragment.number] = this.Fragment;
		this.oFragmentLoader.onComplete();
		return;
	}

	if (this.readyState == 4 && this.status == 200)
	{
		this.Fragment.text = "";
		var str = this.responseText.split("<END>")[0].split(/\n/);
		for (var j in str)
		{
			this.Fragment.text += '<p>' + DS('', str[j]).replace('\r', '').replace('[ctr][gry]- Конец фрагмента -[/][/]', '') + '</p>\n';
		}
		this.oFragmentLoader.nLoaded++;
		this.oFragmentLoader.aFragments[this.Fragment.number] = this.Fragment;
		this.oFragmentLoader.onComplete();
	}
};

FragmentLoader.prototype.onerror = function ()
{
	this.bError = true;
	this.Fragment.text = "<p>Ошибка загрузки фрагмента</p>";
	this.oFragmentLoader.aFragments.push(this.Fragment);
	this.oFragmentLoader.onComplete();
};

FragmentLoader.prototype.onComplete = function ()
{
	this.nProcessed++;
	this.progressor(this.nProcessed, this.nFragments);
	this.bloaded = this.nProcessed == this.nFragments;

	if (this.bloaded)
	{
		this.callback(this.aFragments, this.nProcessed);
	}
};
//**************************************************************************************************************************************

function getGenre(doc)
{
	if (doc === undefined)
		doc = document;

	var genresList =
	{
		"Фантастика" : "sf",
		"ЛитРПГ" : "sf_etc",
		"Фэнтези" : "sf_fantasy",
		"Фантастический боевик" : "sf_action",
		"Ужасы" : "sf_horror",
		"Любовная фантастика" : "love_sf",
		"Альтернативная история" : "sf_history",
		"Социальная фантастика" : "sf_social",
		"Космическая фантастика" : "sf_space",
		"Юмористическая фантастика" : "sf_humor",
		"Детская фантастика" : "child_sf",
		"Попаданцы" : "popadanec",
		"Мистика" : "sf_mystic",
		"Городское фэнтези" : "sf_fantasy_city",
		"Детективная фантастика" : "sf_detective",
		"Героическая фантастика" : "sf_heroic",
		"Постапокалипсис" : "sf_postapocalyptic",
		"Киберпанк" : "sf_cyberpunk",
		"Эпическая фантастика" : "sf_epic",
		"Юмористическое фэнтези" : "humor_fantasy",
		"Космоопера" : "sf_space_opera",
		"Историческое фэнтези" : "historical_fantasy",
		"Сказочная фантастика" : "fairy_fantasy",
		"Технофэнтези" : "sf_technofantasy",
		"Ненаучная фантастика" : "nsf",
		"Ироническая фантастика" : "sf_irony",
		"Стимпанк" : "sf_stimpank",
		"Ироническое фэнтези" : "sf_fantasy_irony",
		"Готический роман" : "gothic_novel",
		"Современная проза" : "prose_contemporary",
		"Классическая проза" : "prose_classic",
		"Историческая проза" : "prose_history",
		"Русская классическая проза" : "prose_rus_classic",
		"Советская классическая проза" : "prose_su_classics",
		"Проза" : "prose",
		"Рассказ" : "short_story",
		"О войне" : "prose_military",
		"Контркультура" : "prose_counter",
		"Роман" : "roman",
		"Эссе, очерк, этюд, набросок" : "essay",
		"Повесть" : "great_story",
		"Магический реализм" : "prose_magic",
		"Эпистолярная проза" : "epistolary_fiction",
		"Афоризмы" : "aphorisms",
		"Новелла" : "story",
		"Антисоветская литература" : "dissident",
		"Семейный роман/Семейная сага" : "sagas",
		"Сентиментальная проза" : "prose_sentimental",
		"Эпопея" : "prose_epic",
		"Феерия" : "extravaganza",
		"История" : "sci_history",
		"Психология" : "sci_psychology",
		"Философия" : "sci_philosophy",
		"Технические науки" : "sci_tech",
		"Политика" : "sci_politics",
		"Литературоведение" : "sci_philology",
		"Культурология" : "sci_culture",
		"Научная литература" : "science",
		"Учебники" : "sci_textbook",
		"Медицина" : "sci_medicine",
		"Военная история" : "military_history",
		"Языкознание" : "sci_linguistic",
		"Религиоведение" : "sci_religion",
		"Юриспруденция" : "sci_juris",
		"Биология" : "sci_biology",
		"Математика" : "sci_math",
		"Педагогика" : "sci_pedagogy",
		"Физика" : "sci_phys",
		"Деловая литература" : "sci_business",
		"Астрономия и Космос" : "sci_cosmos",
		"Геология и география" : "sci_geo",
		"Альтернативная медицина" : "sci_medicine_alternative",
		"Экономика" : "sci_economy",
		"Обществознание" : "sci_social_studies",
		"Секс и семейная психология" : "psy_sex_and_family",
		"Иностранные языки" : "foreign_language",
		"Шпаргалки" : "sci_crib",
		"Химия" : "sci_chem",
		"Психотерапия и консультирование" : "psy_theraphy",
		"Детская психология" : "psy_childs",
		"Зоология" : "sci_zoo",
		"Ботаника" : "sci_botany",
		"Государство и право" : "sci_state",
		"Экология" : "sci_ecology",
		"Биохимия" : "sci_biochem",
		"Ветеринария" : "sci_veterinary",
		"Физическая химия" : "sci_physchem",
		"Биофизика" : "sci_biophys",
		"Органическая химия" : "sci_orgchem",
		"Аналитическая химия" : "sci_anachem",
		"Рефераты" : "sci_abstract",
		"Детективы" : "detective",
		"Триллер" : "thriller",
		"Классический детектив" : "det_classic",
		"Боевик" : "det_action",
		"Исторический детектив" : "det_history",
		"Полицейский детектив" : "det_police",
		"Криминальный детектив" : "det_crime",
		"Любовный детектив" : "love_detective",
		"Иронический детектив" : "det_irony",
		"Детские остросюжетные" : "child_det",
		"Шпионский детектив" : "det_espionage",
		"Крутой детектив" : "det_hard",
		"Дамский детективный роман" : "det_cozy",
		"Политический детектив" : "det_political",
		"Маньяки" : "det_maniac",
		"Медицинский триллер" : "thriller_medical",
		"Юридический триллер" : "thriller_legal",
		"Техно триллер" : "thriller_techno",
		"Биографии и Мемуары" : "nonf_biography",
		"Публицистика" : "nonf_publicism",
		"Научпоп" : "sci_popular",
		"Путешествия и география" : "adv_geo",
		"Критика" : "nonf_criticism",
		"Документальная литература" : "nonfiction",
		"Природа и животные" : "adv_animal",
		"Военная документалистика" : "nonf_military",
		"Современные любовный роман" : "love_contemporary",
		"Короткие любовный роман" : "love_short",
		"Исторические любовный роман" : "love_history",
		"О любви" : "love",
		"18+" : "love_erotica",
		"любовный детективы" : "love_detective",
		"Порно" : "love_hard",
		"Газеты и журналы" : "periodic",
		"Фанфик" : "fanfiction",
		"Музыка" : "music",
		"Недописанное" : "unfinished",
		"Кино" : "cine",
		"Изобразительное искусство, фотография" : "visual_arts",
		"Театр" : "theatre",
		"Партитуры" : "notes",
		"Неотсортированное" : "other",
		"Детская проза" : "child_prose",
		"Сказка" : "child_tale",
		"Детская литература" : "children",
		"Образовательная литература" : "child_education",
		"Детские приключения" : "child_adv",
		"Детские стихи" : "child_verse",
		"Подростковая литература" : "ya",
		"Книга-игра" : "prose_game",
		"Детский фольклор" : "child_folklore",
		"Домоводство" : "Дом и семья",
		"Здоровье" : "home_health",
		"Эротика, Секс" : "home_sex",
		"Хобби и ремесла" : "home_crafts",
		"Кулинария" : "home_cooking",
		"Сделай сам" : "home_diy",
		"Спорт" : "home_sport",
		"Домашние животные" : "home_pets",
		"Сад и огород" : "home_garden",
		"Развлечения" : "home_entertain",
		"Коллекционирование" : "home_collecting",
		"Эзотерика" : "religion_esoterics",
		"Самосовершенствование" : "religion_self",
		"Религия" : "religion_rel",
		"Христианство" : "religion_christianity",
		"Православие" : "religion_orthodoxy",
		"Буддизм" : "religion_budda",
		"Индуизм" : "religion_hinduism",
		"Иудаизм" : "religion_judaism",
		"Астрология" : "astrology",
		"Протестантизм" : "religion_protestantism",
		"Язычество" : "religion_paganism",
		"Ислам" : "religion_islam",
		"Религиозная литература" : "religion",
		"Католицизм" : "religion_catholicism",
		"Хиромантия" : "palmistry",
		"Приключения" : "adventure",
		"Исторические приключения" : "adv_history",
		"Морские приключения" : "adv_maritime",
		"Вестерн" : "adv_western",
		"Приключения про индейцев" : "adv_indian",
		"Юмористическая проза" : "humor_prose",
		"Юмор" : "humor",
		"Сатира" : "humor_satire",
		"Комедия" : "comedy",
		"Анекдоты" : "humor_anecdote",
		"Юмористические стихи" : "humor_verse",
		"Военная техника и вооружение" : "military_weapon",
		"Cпецслужбы" : "military_special",
		"Боевые искусства" : "military_arts",
		"Военное дело" : "military",
		"Справочники" : "ref_ref",
		"Руководства" : "ref_guide",
		"Энциклопедии" : "ref_encyc",
		"Искусство и Дизайн" : "design",
		"Путеводители" : "geo_guides",
		"Справочная литература" : "reference",
		"Словари" : "ref_dict",
		"Поэзия" : "poetry",
		"Лирика" : "lyrics",
		"в стихах" : "in_verse",
		"Эпическая поэзия" : "epic_poetry",
		"Песенная поэзия" : "song_poetry",
		"Басни" : "fable",
		"Экспериментальная поэзия" : "experimental_poetry",
		"Палиндромы" : "palindromes",
		"Верлибры" : "vers_libre",
		"Визуальная поэзия" : "visual_poetry",
		"Транспорт и авиация" : "sci_transport",
		"Радиоэлектроника" : "sci_radio",
		"Автомобили и ПДД" : "auto_regulations",
		"Строительство и сопромат" : "sci_build",
		"Архитектура" : "architecture_book",
		"Металлургия" : "sci_metal",
		"Драматургия" : "dramaturgy",
		"Драма" : "drama",
		"Киносценарии" : "screenplays",
		"Трагедия" : "tragedy",
		"Сценарии" : "scenarios",
		"Водевиль" : "vaudeville",
		"Мистерия" : "mystery",
		"О бизнесе популярно" : "popular_business",
		"Управление, подбор персонала" : "management",
		"Маркетинг, PR, реклама" : "marketing",
		"Ценные бумаги, инвестиции" : "stock",
		"Бухучет и аудит" : "accounting",
		"Личные финансы" : "personal_finance",
		"Малый бизнес" : "small_business",
		"Поиск работы, карьера" : "job_hunting",
		"Корпоративная культура" : "org_behavior",
		"Отраслевые издания" : "industries",
		"Банковское дело" : "banking",
		"Торговля" : "trade",
		"Делопроизводство" : "paper_work",
		"Недвижимость" : "real_estate",
		"Внешняя торговля" : "global_economy",
		"Околокомпьютерная литература" : "computers",
		"Программирование" : "comp_programming",
		"Программы" : "comp_soft",
		"ОС и Сети" : "comp_osnet",
		"Интернет" : "comp_www",
		"Аппаратное обеспечение" : "comp_hard",
		"Базы данных" : "comp_db",
		"Цифровая обработка сигналов" : "comp_dsp",
		"Мифы.Легенды.Эпос" : "antique_myths",
		"Древневосточная литература" : "antique_east",
		"Античная литература" : "antique_ant",
		"Древнеевропейская литература" : "antique_european",
		"Старинная литература" : "antique",
		"Древнерусская литература" : "antique_russian",
		"Народные сказки" : "folk_tale",
		"Фольклор" : "folklore",
		"Пословицы, поговорки" : "proverbs",
		"Былины" : "epic",
		"Народные песни" : "folk_songs",
		"Частушки, прибаутки, потешки" : "limerick",
		"Загадки" : "riddles"
	};

	var genre = "";
	var Series = doc.getElementsByClassName('gnres');

	if (Series.length == 1)
		var genres = RegExp('.*Жанры: (.*)$', 'm').exec(Series[0].outerText)[1].split(', ').join(',').split(',');
	else
		var genres = RegExp('.*Жанры: (.*)$', 'm').exec(Series[1].outerText)[1].split(', ').join(',').split(',');

	if (genres !== null)
	{
		for (var i = 0; i < genres.length; i++)
		{

			if (genresList[genres[i]] !== undefined)
			{
				genre += "<genre>" + genresList[genres[i]] + "</genre>\n";
			}
		}

		return genre;
	}

	if (genre === "")
	{
		return "<genre/>";
	}

}

function getAuthorName(doc)
{
	if (doc === undefined)
		doc = document;

	var authors = doc.getElementsByClassName('city3');

	if (authors.length == 1)
		var FIO = authors[0].getElementsByClassName('txt')[0].text.split(' ');
	else
		var FIO = authors[1].getElementsByClassName('txt')[0].text.split(' ');

	if (FIO.length == 1)
	{
		return "<first-name>" + FIO[0] + "</first-name>";
	}

	if (FIO.length == 2)
	{
		return "<first-name>" + FIO[0] + "</first-name>\n<last-name>" + FIO[1] + "</last-name>";
	}

	if (FIO.length == 3)
	{
		return "<first-name>" + FIO[1] + "</first-name>\n<middle-name>" + FIO[2] + "</middle-name>\n<last-name>" + FIO[0] + "</last-name>";
	}

	return "<first-name>" + FIO[0].join(' ') + "</first-name>";

}

function getAnnotation(doc)
{
	if (doc === undefined)
		doc = document;

	return doc.getElementsByTagName("meta", "")[4].content;
}

function getSeries(doc)
{
	if (doc === undefined)
		doc = document;

	var Series = doc.getElementsByClassName('serie');

	if (Series.length == 1)
		var res = new RegExp('.*Серия: (.*)$', 'm').exec(Series[0].outerText);
	else
		var res = new RegExp('.*Серия: (.*)$', 'm').exec(Series[1].outerText);

	if (res !== null)
		return '<sequence name="' + res[1].trim() + '" number=""/>';
	else
		return '';
}

function getBookCover()
{
	
}

function AllBook(event)
{
	var book = event.path[1].children[1];
	var bookid = parseInt(book.href.split('/')[4]);
	//var MaxProtection = my_getbyid("protected1").src !== '';
	var doc = getDoc(book.getAttribute("href"));

	var coverImage = new Image();
	coverImage.src = doc.getElementById("relat" + bookid).children[0].children[0].getAttribute("src");
	var coverLoaded = false;
	coverImage.onload = function ()
	{

		var cover = coverImage.getUrlData();
		var MaxProtection = false;
		if (!MaxProtection)
		{
			var pageHtml = "";
			var UserToken = GetUserToken(doc);
			var BookTitle = book.childNodes[0].textContent;

			pageHtml = '<?xml version="1.0" encoding="utf-8"?>\n<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:xlink="http://www.w3.org/1999/xlink">\n';
			pageHtml += '<description>\n<title-info>' + getGenre(doc) + '<author>' + getAuthorName(doc) + '</author>\n';
			pageHtml += '<coverpage><image xlink:href="#' + coverImage.src + '"/></coverpage>\n';
			pageHtml += '<book-title>' + BookTitle + '</book-title>\n';
			pageHtml += '<annotation><p>' + getAnnotation(doc) + '</p></annotation>\n';
			pageHtml += '<lang>ru</lang><src-lang>ru</src-lang>\n';
			pageHtml += getSeries(doc);
			pageHtml += '</title-info><document-info><author><nickname/><email/></author><version>2.0</version></document-info>\n';
			pageHtml += '<publish-info><book-name>' + BookTitle + '</book-name></publish-info></description>\n';
			pageHtml += '<body>\n';
			pageHtml += '<title>\n';
			pageHtml += '<p>' + BookTitle + '</p>\n';
			pageHtml += '</title>\n';

			var loader = new FragmentLoader(doc.getElementsByClassName('chapt'), UserToken,
					function (aChapters, nChapters)
				{
					aChapters.forEach(function (item, i, aChapters)
					{
						pageHtml += '<section><title><p>' + item.name + '</p></title>\n';
						pageHtml += item.text;
						pageHtml += '</section>\n';

					}
					);

					pageHtml += '</body>';
					pageHtml += '<binary content-type="image/png" id="' + coverImage.src + '">\n' + cover.replace('data:image/png;base64,', '') + '\n</binary>';
					pageHtml += '</FictionBook>';

					var file = new File([pageHtml], BookTitle + '.fb2',
						{
							type : "text/plain;charset=utf-8"
						}
						);
					saveAs(file, BookTitle + '.fb2');
					book.childNodes[0].innerHTML = BookTitle;

				},
					function (nProcessed, nCount)
				{
					book.childNodes[0].innerHTML = BookTitle + "(Загружено " + nProcessed + " глав из " + nCount + ")";
				}
				);
		}
	};
}

function getMaxPages()
{
	var scripts = document.getElementsByTagName("script");
	var maxpg = null;
	for (var i = 0; i < scripts.length; i++)
	{
		if(scripts[i].text.indexOf('InitRead') != -1)
		{
			return scripts[i].text.split('\n')[1];
			maxpg = parseInt(scripts[i].text.split('\n')[1].split(',')[6]);
			return maxpg;
		}
	}
	return null;
}

function unprotect(text, format)
{
	var pageHtml = null;
	if (format === undefined)
		format = "fb2";

	if (document.location.hostname == "zelluloza.ru")
	{

		eval(getMaxPages());
		//var maxpg = getMaxPages();

		var BookId = document.getElementById("gotobook").value;
		var PartId = document.getElementsByClassName("taglnk2")[0].href.split('/')[5];
		var UserToken = GetUserToken();
		var BookTitle = "";

		if (books.length == 1)
			BookTitle = document.getElementsByClassName("booklnk4")[0].childNodes[0].innerHTML;
		else
			BookTitle = document.getElementsByClassName("booklnk4")[1].childNodes[0].innerHTML;
		var PartTitle = document.getElementsByClassName("taglnk2")[0].text;

		if (document.getElementsByClassName("booklnk4"))
		{

			pageHtml = '<?xml version="1.0" encoding="utf-8"?>\n<FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0" xmlns:xlink="http://www.w3.org/1999/xlink">\n';
			pageHtml += '<description>\n<title-info>' + getGenre() + '<author>' + getAuthorName() + '</author>\n';
			//pageHtml += '<coverpage><image xlink:href="#' + coverImage.src + '"/></coverpage>\n';
			pageHtml += '<book-title>' + BookTitle + '</book-title>\n';
			pageHtml += '<annotation><p>' + getAnnotation() + '</p></annotation>\n';
			pageHtml += '<lang>ru</lang><src-lang>ru</src-lang>\n';
			pageHtml += getSeries();
			pageHtml += '</title-info><document-info><author><nickname/><email/></author><version>2.0</version></document-info>\n';
			pageHtml += '<publish-info><book-name>' + BookTitle + '</book-name></publish-info></description>\n';
			pageHtml += '<body>\n';
			pageHtml += '<title>\n';
			pageHtml += '<p>' + BookTitle + '</p>\n';
			pageHtml += '</title>\n';

			pageHtml += '<section><title><p>' + PartTitle + '</p></title>';
		}

		var MaxProtection = my_getbyid("protected1").src !== '';
		if (!MaxProtection)
		{
			var Z = chp[0].split(/\n/);
			for (var j in Z)
			{
				pageHtml += '<p>' + DS('', Z[j]).replace('\r', '').replace('\n', '').replace('[ctr][gry]- Конец фрагмента -[/][/]', '') + '</p>\n';
			}
			pageHtml += '</section></body></FictionBook>';
			var file = new File([pageHtml], BookTitle + '.fb2',
				{
					type : "text/plain;charset=utf-8"
				}
				);
			saveAs(file, BookTitle + '(' + PartTitle + ').fb2');
		}
		else
		{
			var pages = new Array();
			oCanvas = my_getbyid("cnv1");
			oCtx = oCanvas.getContext("2d");
			pagessize = 5;
			var page = 0;
			var loaded = false;
			for (page = 0; page <= maxpg; page += pagessize)
			{
				pages[page] = "/get/" + base64_encode(BookId + ":" + PartId + ":" + pagessize + ":" + page);
			}

			var binaryImages = "";
			var pp = new ImageLoader(pages, function (aImages, nLoaded)
				{
					if (format == "fb2")
					{

						aImages.forEach(function (item, i, aImages)
						{
							if (item.bLoaded)
							{
								oCtx.drawImage(item, 0, 0);
								pageHtml += '<image xlink:href="#page_' + i + '.jpg"/>\n';
								binaryImages += '<binary content-type="image/png" id="page_' + i + '.jpg">\n' + oCanvas.toDataURL("image/png", 1.0).replace('data:image/png;base64,', '') + '\n</binary>';
							}
						}
						);

						pageHtml += '</section></body>';
						pageHtml += binaryImages;
						pageHtml += '</FictionBook>';
						var file = new File([pageHtml], BookTitle + '(' + PartTitle + ').fb2',
							{
								type : "text/plain;charset=utf-8"
							}
							);
						saveAs(file, BookTitle + '(' + PartTitle + ').fb2');
					}
					else
					{
						var pdf = new jsPDF('p', 'pt', 'b5', 1);
						pdf.internal.pageSize =
						{
							"height" : 480,
							"widht" : 550
						};

						var pdfInternals = pdf.internal;
						var pdfPageSize = pdfInternals.pageSize;
						var pdfPageWidth = pdfPageSize.width;
						var pdfPageHeight = pdfPageSize.height;

						var flags =
						{
							"noBOM" : true,
							"autoencode" : true
						};

						pdf.text(BookTitle, pdfPageWidth / 3, 20, flags);
						pdf.text(PartTitle, pdfPageWidth / 3, 40, flags);

						aImages.forEach(function (item, i, aImages)
						{
							if (item.bLoaded)
							{
								oCtx.drawImage(item, 0, 0);
								var img = oCanvas.toDataURL("image/png", 1.0);
								pdf.addPage();
								pdf.addImage(img, "png", 10, 70, 0, 0);
							}
						}
						);

						pdf.save(BookTitle + '(' + PartTitle + ').pdf');
					}
				}
				);

		}
	}
}

function loadScriptText(ref)
{
	var xmlhttp = getXmlHttp();
	xmlhttp.open("GET", ref, false);

	if (xmlhttp.readyState == 1)
	{
		xmlhttp.setRequestHeader("Content-Type", "text/html");
		xmlhttp.send();
	}

	if (xmlhttp.status != 200)
	{
		alert(xmlhttp.status + ': ' + xmlhttp.statusText); // пример вывода: 404: Not Found
	}
	else
	{
		return xmlhttp.responseText;
	}
}

function loadNativeScript()
{
	var scripts = document.getElementsByTagName("script");
	for (var i = 0; i < scripts.length; i++)
	{
		if (scripts[i].src !== "")
			if (scripts[i].src.indexOf("zelluloza") != -1)
				return loadScriptText(scripts[i].src);
	}
}

unsafeWindow.wait_for_text = function ()
{
	var text = document.getElementById("bookpgm");
	if (null === books)
		alert('No copyable text found!');
	else
	{
		for (var i = 0; i < books.length; i++)
		{
			buttons[i] = document.createElement("INPUT");
			buttons[i].setAttribute("type", "button");
			buttons[i].setAttribute("value", 'Скачать в fb2');
			buttons[i].setAttribute("ref", books[i].href);
			buttons[i].addEventListener('click', AllBook, true);
			books[i].parentNode.insertBefore(buttons[i], books[i]);
		}
	}

	if (null !== text)
		if (text.innerHTML.length > 100)
		{
			var button = document.createElement("BUTTON");
			button.value = 'Скачать в fb2';

			button.addEventListener('click', function ()
			{
				unprotect(text);
			}, true);
			text.parentNode.insertBefore(button, text);
			var MaxProtection = my_getbyid("protected1").src !== '';

			if (MaxProtection)
			{
				var button2 = document.createElement("BUTTON");
				button2.innerHTML = 'Скачать в pdf';
				button2.addEventListener('click', function ()
				{
					unprotect(text, "pdf");
				}, true);
				text.parentNode.insertBefore(button2, text);
			}
		}
		else
			window.setTimeout("wait_for_text()", 100);
};

//eval(loadNativeScript());
//eval(loadScriptText("https://cdn.rawgit.com/eligrey/FileSaver.js/master/FileSaver.min.js"));
//eval(loadScriptText("https://greasyfork.org/scripts/15924-jspdf/code/jsPDF.js?version=99137"));

var books = document.getElementsByClassName("booklnk4");
var buttons = new Array();
window.setTimeout("wait_for_text()", 100);

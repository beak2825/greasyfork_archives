// ==UserScript==
// @name           Virtonomica: мэрия со страницы магазина
// @version        1.04
// @namespace      virtonomica
// @description    Добавляет кнопку в мэрию на все страницы магазинов
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @downloadURL https://update.greasyfork.org/scripts/28484/Virtonomica%3A%20%D0%BC%D1%8D%D1%80%D0%B8%D1%8F%20%D1%81%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/28484/Virtonomica%3A%20%D0%BC%D1%8D%D1%80%D0%B8%D1%8F%20%D1%81%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%D1%8B%20%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD%D0%B0.meta.js
// ==/UserScript==

var run = function() {
	$( document ).ready(function() {
		//Считываем тип предприятия
		var img =  $('.bg-image').attr('class');
		img = img.substring(16,img.length-16);
		
		//Запускаем только в магазинах
		if(img == 'shop') {
			
			//Выцепляем реалм и номер компании из ссылки на дашборд
			var href12 = $('a.dashboard').attr('href');
			var realmName = href12.split('main')[0];
			
			//Самая жопка. В зависимости от расположения прицепляем номер города
			var cityID;
			var city  = $('div.title').eq(0)['0'].childNodes['2'].data.replace(/\s/g,'').slice(0, -1);
				switch(city)
					{
						case('Агуаскальентес'):
							cityID = 422626;
							break;
						case('Адлер'):
							cityID = 423510;
							break;
						case('Акапулько'):
							cityID = 422632;
							break;
						case('Актау'):
							cityID = 7087;
							break;
						case('Актобе'):
							cityID = 7084;
							break;
						case('Акюрейри'):
							cityID = 423480;
							break;
						case('Алматы'):
							cityID = 7076;
							break;
						case('Алмере'):
							cityID = 359845;
							break;
						case('Амстердам'):
							cityID = 359839;
							break;
						case('Андижан'):
							cityID = 310397;
							break;
						case('Арарат'):
							cityID = 423535;
							break;
						case('Архангельск'):
							cityID = 331860;
							break;
						case('Астана'):
							cityID = 7073;
							break;
						case('Астрахань'):
							cityID = 423564;
							break;
						case('Атырау'):
							cityID = 7086;
							break;
						case('Афины'):
							cityID = 422046;
							break;
						case('Байконур'):
							cityID = 7081;
							break;
						case('Баку'):
							cityID = 3056;
							break;
						case('Барановичи'):
							cityID = 302145;
							break;
						case('Баркисимето'):
							cityID = 375147;
							break;
						case('Барнаул'):
							cityID = 424016;
							break;
						case('Барселона (Ve)'):
							cityID = 375151;
							break;
						case('Белгород'):
							cityID = 423570;
							break;
						case('Белен'):
							cityID = 423854;
							break;
						case('Белу-Оризонти'):
							cityID = 423848;
							break;
						case('Берген'):
							cityID = 335168;
							break;
						case('Берлин'):
							cityID = 3043;
							break;
						case('Берум'):
							cityID = 335171;
							break;
						case('Бирмингем'):
							cityID = 15936;
							break;
						case('Благовещенск'):
							cityID = 424066;
							break;
						case('Бобруйск'):
							cityID = 16322;
							break;
						case('Бордо'):
							cityID = 3037;
							break;
						case('Борисов'):
							cityID = 302146;
							break;
						case('Борисполь'):
							cityID = 422041;
							break;
						case('Бразилиа'):
							cityID = 423846;
							break;
						case('Братск'):
							cityID = 424058;
							break;
						case('Бремен'):
							cityID = 3052;
							break;
						case('Брест'):
							cityID = 15737;
							break;
						case('Бристоль'):
							cityID = 352886;
							break;
						case('Бургас'):
							cityID = 303257;
							break;
						case('Бухара'):
							cityID = 310399;
							break;
						case('Быдгощ'):
							cityID = 423206;
							break;
						case('Вавуния'):
							cityID = 423113;
							break;
						case('Вагаршапат'):
							cityID = 423575;
							break;
						case('Валенсия (Ve)'):
							cityID = 375146;
							break;
						case('Ванадзор'):
							cityID = 303833;
							break;
						case('Ванкувер'):
							cityID = 422367;
							break;
						case('Вантаа'):
							cityID = 422978;
							break;
						case('Варзеа-Гранди'):
							cityID = 424031;
							break;
						case('Варна'):
							cityID = 303256;
							break;
						case('Варшава'):
							cityID = 423199;
							break;
						case('Великие Луки'):
							cityID = 331870;
							break;
						case('Великий Новгород'):
							cityID = 331866;
							break;
						case('Великий Устюг'):
							cityID = 424020;
							break;
						case('Виктория'):
							cityID = 424030;
							break;
						case('Вилейка'):
							cityID = 422521;
							break;
						case('Виллахермоса'):
							cityID = 422648;
							break;
						case('Вильнюс'):
							cityID = 325652;
							break;
						case('Виннипег'):
							cityID = 422372;
							break;
						case('Винница'):
							cityID = 3022;
							break;
						case('Витебск'):
							cityID = 15741;
							break;
						case('Владивосток'):
							cityID = 2964;
							break;
						case('Владимир'):
							cityID = 422073;
							break;
						case('Волгоград'):
							cityID = 2947;
							break;
						case('Волгодонск'):
							cityID = 424024;
							break;
						case('Волжск'):
							cityID = 422982;
							break;
						case('Вологда'):
							cityID = 331864;
							break;
						case('Волос'):
							cityID = 422051;
							break;
						case('Воркута'):
							cityID = 331872;
							break;
						case('Воронеж'):
							cityID = 2935;
							break;
						case('Вроцлав'):
							cityID = 423202;
							break;
						case('Выборг'):
							cityID = 331873;
							break;
						case('Гаага'):
							cityID = 359840;
							break;
						case('Гавана'):
							cityID = 422189;
							break;
						case('Гавр'):
							cityID = 3039;
							break;
						case('Галифакс'):
							cityID = 423549;
							break;
						case('Гамбург'):
							cityID = 3044;
							break;
						case('Гамильтон'):
							cityID = 422373;
							break;
						case('Ганновер'):
							cityID = 3053;
							break;
						case('Гатчина'):
							cityID = 331871;
							break;
						case('Гвадалахара'):
							cityID = 422614;
							break;
						case('Гданьск'):
							cityID = 423204;
							break;
						case('Гдыня'):
							cityID = 423807;
							break;
						case('Гомель'):
							cityID = 15738;
							break;
						case('Гонконг'):
							cityID = 423588;
							break;
						case('Гояния'):
							cityID = 423853;
							break;
						case('Гродно'):
							cityID = 15739;
							break;
						case('Грозный'):
							cityID = 352279;
							break;
						case('Гронинген'):
							cityID = 359846;
							break;
						case('Гуадалупе'):
							cityID = 422633;
							break;
						case('Гуантанамо'):
							cityID = 422193;
							break;
						case('Гуарульюс'):
							cityID = 423855;
							break;
						case('Гюмри'):
							cityID = 303832;
							break;
						case('Гянджа'):
							cityID = 3057;
							break;
						case('Даугавпилс'):
							cityID = 325648;
							break;
						case('Дербент'):
							cityID = 424023;
							break;
						case('Дехивала-Маунт-Лавиния'):
							cityID = 423108;
							break;
						case('Джанкой'):
							cityID = 423571;
							break;
						case('Днепропетровск'):
							cityID = 3014;
							break;
						case('Донецк'):
							cityID = 3015;
							break;
						case('Дортмунд'):
							cityID = 3049;
							break;
						case('Драммен'):
							cityID = 422494;
							break;
						case('Дрезден'):
							cityID = 15957;
							break;
						case('Дуйсбург'):
							cityID = 422042;
							break;
						case('Дюссельдорф'):
							cityID = 3051;
							break;
						case('Екатеринбург'):
							cityID = 2951;
							break;
						case('Ереван'):
							cityID = 303831;
							break;
						case('Жезказган'):
							cityID = 7068;
							break;
						case('Житомир'):
							cityID = 3021;
							break;
						case('Запорожье'):
							cityID = 3016;
							break;
						case('Ивано-Франковск'):
							cityID = 3020;
							break;
						case('Иваново'):
							cityID = 2938;
							break;
						case('Ижевск'):
							cityID = 423524;
							break;
						case('Ираклион'):
							cityID = 422049;
							break;
						case('Иркутск'):
							cityID = 371340;
							break;
						case('Казань'):
							cityID = 2943;
							break;
						case('Калгари'):
							cityID = 422368;
							break;
						case('Калининград'):
							cityID = 331859;
							break;
						case('Калинковичи'):
							cityID = 424065;
							break;
						case('Калмунай'):
							cityID = 423114;
							break;
						case('Камагуэй'):
							cityID = 422191;
							break;
						case('Кампинас'):
							cityID = 423856;
							break;
						case('Кампу-Гранди'):
							cityID = 424009;
							break;
						case('Канди'):
							cityID = 423112;
							break;
						case('Канкун'):
							cityID = 422631;
							break;
						case('Караганда'):
							cityID = 7066;
							break;
						case('Каракас'):
							cityID = 375144;
							break;
						case('Карши'):
							cityID = 423032;
							break;
						case('Катовице'):
							cityID = 423208;
							break;
						case('Каунас'):
							cityID = 325653;
							break;
						case('Квебек'):
							cityID = 422371;
							break;
						case('Кемерово'):
							cityID = 2960;
							break;
						case('Керчь'):
							cityID = 350845;
							break;
						case('Киев'):
							cityID = 3012;
							break;
						case('Кингисепп'):
							cityID = 355249;
							break;
						case('Киров'):
							cityID = 422077;
							break;
						case('Клайпеда'):
							cityID = 325654;
							break;
						case('Ковров'):
							cityID = 424027;
							break;
						case('Козьмодемьянск'):
							cityID = 423536;
							break;
						case('Коканд'):
							cityID = 422512;
							break;
						case('Кокшетау'):
							cityID = 7071;
							break;
						case('Коломбо'):
							cityID = 423107;
							break;
						case('Комсомольск-на-Амуре'):
							cityID = 423526;
							break;
						case('Копенгаген'):
							cityID = 423257;
							break;
						case('Костанай'):
							cityID = 7069;
							break;
						case('Кострома'):
							cityID = 367968;
							break;
						case('Коупавогюр'):
							cityID = 423478;
							break;
						case('Краков'):
							cityID = 423200;
							break;
						case('Краснодар'):
							cityID = 2948;
							break;
						case('Красноярск'):
							cityID = 2959;
							break;
						case('Кременчуг'):
							cityID = 424053;
							break;
						case('Кривой Рог'):
							cityID = 424011;
							break;
						case('Кристиансанн'):
							cityID = 422021;
							break;
						case('Кульякан'):
							cityID = 422629;
							break;
						case('Кумана'):
							cityID = 422020;
							break;
						case('Курган'):
							cityID = 422086;
							break;
						case('Куритиба'):
							cityID = 423850;
							break;
						case('Курск'):
							cityID = 423527;
							break;
						case('Кызылорда'):
							cityID = 7080;
							break;
						case('Кёльн'):
							cityID = 3046;
							break;
						case('Ларисса'):
							cityID = 422050;
							break;
						case('Лас Тунас'):
							cityID = 422979;
							break;
						case('Леон'):
							cityID = 422618;
							break;
						case('Лестер'):
							cityID = 375138;
							break;
						case('Ливерпуль'):
							cityID = 373539;
							break;
						case('Лидс'):
							cityID = 15938;
							break;
						case('Лиепая'):
							cityID = 325649;
							break;
						case('Лион'):
							cityID = 3033;
							break;
						case('Липецк'):
							cityID = 2937;
							break;
						case('Лодзь'):
							cityID = 423201;
							break;
						case('Лондон'):
							cityID = 15935;
							break;
						case('Луганск'):
							cityID = 3017;
							break;
						case('Лукоянов'):
							cityID = 424022;
							break;
						case('Львов'):
							cityID = 3019;
							break;
						case('Люблин'):
							cityID = 423207;
							break;
						case('Маастрихт'):
							cityID = 359844;
							break;
						case('Магадан'):
							cityID = 351182;
							break;
						case('Магнитогорск'):
							cityID = 2954;
							break;
						case('Манаус'):
							cityID = 423849;
							break;
						case('Манчестер'):
							cityID = 15941;
							break;
						case('Маракай'):
							cityID = 375149;
							break;
						case('Маракайбо'):
							cityID = 375145;
							break;
						case('Мариуполь'):
							cityID = 422087;
							break;
						case('Марсель'):
							cityID = 3032;
							break;
						case('Масейо'):
							cityID = 423859;
							break;
						case('Матансас'):
							cityID = 422504;
							break;
						case('Матурин'):
							cityID = 375150;
							break;
						case('Махачкала'):
							cityID = 422506;
							break;
						case('Мерида'):
							cityID = 422624;
							break;
						case('Мехикали'):
							cityID = 422630;
							break;
						case('Мехико'):
							cityID = 422612;
							break;
						case('Минск'):
							cityID = 15736;
							break;
						case('Могилёв'):
							cityID = 15740;
							break;
						case('Мозырь'):
							cityID = 302147;
							break;
						case('Молодечно'):
							cityID = 302148;
							break;
						case('Монако'):
							cityID = 422985;
							break;
						case('Монреаль'):
							cityID = 422366;
							break;
						case('Монтеррей'):
							cityID = 422620;
							break;
						case('Мончегорск'):
							cityID = 323943;
							break;
						case('Моратува'):
							cityID = 423109;
							break;
						case('Москва'):
							cityID = 2933;
							break;
						case('Мурманск'):
							cityID = 331862;
							break;
						case('Мюнхен'):
							cityID = 3045;
							break;
						case('Набережные Челны'):
							cityID = 352278;
							break;
						case('Наманган'):
							cityID = 310395;
							break;
						case('Нант'):
							cityID = 3041;
							break;
						case('Нарва'):
							cityID = 325659;
							break;
						case('Натал'):
							cityID = 424032;
							break;
						case('Наукальпан'):
							cityID = 422623;
							break;
						case('Негомбо'):
							cityID = 423110;
							break;
						case('Несауалькойотль'):
							cityID = 422621;
							break;
						case('Несвиж'):
							cityID = 424012;
							break;
						case('Нижневартовск'):
							cityID = 424025;
							break;
						case('Нижнекамск'):
							cityID = 422075;
							break;
						case('Нижний Новгород'):
							cityID = 2940;
							break;
						case('Нижний Тагил'):
							cityID = 422955;
							break;
						case('Николаев'):
							cityID = 3025;
							break;
						case('Ницца'):
							cityID = 3035;
							break;
						case('Новокузнецк'):
							cityID = 424019;
							break;
						case('Новороссийск'):
							cityID = 2949;
							break;
						case('Новосибирск'):
							cityID = 2957;
							break;
						case('Норильск'):
							cityID = 367967;
							break;
						case('Нукус'):
							cityID = 310400;
							break;
						case('Ньюкасл'):
							cityID = 424059;
							break;
						case('Ньярдвик'):
							cityID = 424052;
							break;
						case('Нюрнберг'):
							cityID = 15954;
							break;
						case('Оденсе'):
							cityID = 423259;
							break;
						case('Одесса'):
							cityID = 3024;
							break;
						case('Ольборг'):
							cityID = 423260;
							break;
						case('Ольгин'):
							cityID = 422192;
							break;
						case('Омск'):
							cityID = 2958;
							break;
						case('Оренбург'):
							cityID = 423512;
							break;
						case('Орхус'):
							cityID = 423258;
							break;
						case('Орша'):
							cityID = 422039;
							break;
						case('Осло'):
							cityID = 335167;
							break;
						case('Оттава'):
							cityID = 422369;
							break;
						case('Оулу'):
							cityID = 422038;
							break;
						case('Павлодар'):
							cityID = 7072;
							break;
						case('Париж'):
							cityID = 3031;
							break;
						case('Патры'):
							cityID = 422048;
							break;
						case('Пенза'):
							cityID = 424056;
							break;
						case('Пермь'):
							cityID = 2944;
							break;
						case('Петрозаводск'):
							cityID = 331863;
							break;
						case('Петропавловск'):
							cityID = 7070;
							break;
						case('Петропавловск-Камчатский'):
							cityID = 422543;
							break;
						case('Пинар-дель-Рио'):
							cityID = 422195;
							break;
						case('Плевен'):
							cityID = 303261;
							break;
						case('Пловдив'):
							cityID = 303258;
							break;
						case('Познань'):
							cityID = 423203;
							break;
						case('Полтава'):
							cityID = 13055;
							break;
						case('Порту-Алегри'):
							cityID = 423852;
							break;
						case('Посус-ди-Кальдас'):
							cityID = 424018;
							break;
						case('Псков'):
							cityID = 331867;
							break;
						case('Пуэбла-де-Сарагоса'):
							cityID = 422615;
							break;
						case('Пуэрто-Кабельо'):
							cityID = 423569;
							break;
						case('Пярну'):
							cityID = 422019;
							break;
						case('Радом'):
							cityID = 423808;
							break;
						case('Режина'):
							cityID = 424008;
							break;
						case('Рейкьявик'):
							cityID = 423477;
							break;
						case('Реймс'):
							cityID = 3040;
							break;
						case('Ренн'):
							cityID = 3038;
							break;
						case('Ресифи'):
							cityID = 423851;
							break;
						case('Рига'):
							cityID = 325647;
							break;
						case('Рио-де-Жанейро'):
							cityID = 423844;
							break;
						case('Рованиеми'):
							cityID = 301315;
							break;
						case('Ростов-на-Дону'):
							cityID = 2946;
							break;
						case('Роттердам'):
							cityID = 359841;
							break;
						case('Рудный'):
							cityID = 7075;
							break;
						case('Русе'):
							cityID = 303260;
							break;
						case('Рязань'):
							cityID = 422040;
							break;
						case('Салвадор'):
							cityID = 423845;
							break;
						case('Салоники'):
							cityID = 422047;
							break;
						case('Сальтильо'):
							cityID = 422627;
							break;
						case('Самара'):
							cityID = 2941;
							break;
						case('Самарканд'):
							cityID = 310396;
							break;
						case('Сан-Гонсалу'):
							cityID = 423857;
							break;
						case('Сан-Луис'):
							cityID = 423858;
							break;
						case('Сан-Луис-Потоси'):
							cityID = 422628;
							break;
						case('Сан-Паулу'):
							cityID = 423843;
							break;
						case('Санкт-Петербург'):
							cityID = 2934;
							break;
						case('Санта-Клара'):
							cityID = 422194;
							break;
						case('Сантьяго-де-Куба'):
							cityID = 422190;
							break;
						case('Сапопан'):
							cityID = 422619;
							break;
						case('Саратов'):
							cityID = 423572;
							break;
						case('Саскатун'):
							cityID = 422999;
							break;
						case('Севастополь'):
							cityID = 3028;
							break;
						case('Северодвинск'):
							cityID = 331868;
							break;
						case('Семипалатинск'):
							cityID = 7083;
							break;
						case('Серпухов'):
							cityID = 422961;
							break;
						case('Симферополь'):
							cityID = 3026;
							break;
						case('Сингапур'):
							cityID = 401884;
							break;
						case('Сливен'):
							cityID = 422496;
							break;
						case('Сосновец'):
							cityID = 423809;
							break;
						case('София'):
							cityID = 303255;
							break;
						case('Сочи'):
							cityID = 5033;
							break;
						case('Ставангер'):
							cityID = 335169;
							break;
						case('Ставрополь'):
							cityID = 422962;
							break;
						case('Стара-Загора'):
							cityID = 303259;
							break;
						case('Степанакерт'):
							cityID = 424067;
							break;
						case('Стерлитамак'):
							cityID = 422088;
							break;
						case('Страсбург'):
							cityID = 3036;
							break;
						case('Сумгаит'):
							cityID = 3058;
							break;
						case('Сумы'):
							cityID = 423534;
							break;
						case('Сургут'):
							cityID = 2955;
							break;
						case('Сыктывкар'):
							cityID = 331865;
							break;
						case('Сьюдад-Боливар'):
							cityID = 424029;
							break;
						case('Сьюдад-Гуаяна'):
							cityID = 375148;
							break;
						case('Сьюдад-Хуарес'):
							cityID = 422616;
							break;
						case('Талдыкорган'):
							cityID = 7079;
							break;
						case('Таллин'):
							cityID = 325657;
							break;
						case('Тампере'):
							cityID = 301313;
							break;
						case('Тараз'):
							cityID = 7078;
							break;
						case('Тарту'):
							cityID = 325658;
							break;
						case('Ташкент'):
							cityID = 310394;
							break;
						case('Темиртау'):
							cityID = 7067;
							break;
						case('Тихуана'):
							cityID = 422617;
							break;
						case('Тольятти'):
							cityID = 424055;
							break;
						case('Томск'):
							cityID = 10716;
							break;
						case('Торонто'):
							cityID = 422365;
							break;
						case('Трикомали'):
							cityID = 423111;
							break;
						case('Тронхейм'):
							cityID = 335170;
							break;
						case('Тулуза'):
							cityID = 3034;
							break;
						case('Туркестан'):
							cityID = 424017;
							break;
						case('Турку'):
							cityID = 301314;
							break;
						case('Тюмень'):
							cityID = 2953;
							break;
						case('Ужгород'):
							cityID = 423550;
							break;
						case('Ульяновск'):
							cityID = 423511;
							break;
						case('Уральск'):
							cityID = 7085;
							break;
						case('Урюпинск'):
							cityID = 424014;
							break;
						case('Усть-Каменогорск'):
							cityID = 7082;
							break;
						case('Утрехт'):
							cityID = 359842;
							break;
						case('Уфа'):
							cityID = 2942;
							break;
						case('Ухта'):
							cityID = 331869;
							break;
						case('Фергана'):
							cityID = 310398;
							break;
						case('Форталеза'):
							cityID = 423847;
							break;
						case('Франкфурт'):
							cityID = 3047;
							break;
						case('Хабаровск'):
							cityID = 2962;
							break;
						case('Хабнарфьордюр'):
							cityID = 423479;
							break;
						case('Ханты-Мансийск'):
							cityID = 424054;
							break;
						case('Ханья'):
							cityID = 422052;
							break;
						case('Харьков'):
							cityID = 3013;
							break;
						case('Хельсинки'):
							cityID = 301311;
							break;
						case('Херсон'):
							cityID = 3027;
							break;
						case('Чебоксары'):
							cityID = 424057;
							break;
						case('Челябинск'):
							cityID = 2952;
							break;
						case('Ченстохова'):
							cityID = 423209;
							break;
						case('Череповец'):
							cityID = 331861;
							break;
						case('Черкассы'):
							cityID = 424010;
							break;
						case('Черкесск'):
							cityID = 422522;
							break;
						case('Чернигов'):
							cityID = 424028;
							break;
						case('Черновцы'):
							cityID = 423532;
							break;
						case('Чиуауа'):
							cityID = 422622;
							break;
						case('Шеффилд'):
							cityID = 348029;
							break;
						case('Шлиссельбург'):
							cityID = 422497;
							break;
						case('Шри-Джаяварденепура-Котте'):
							cityID = 423106;
							break;
						case('Штутгарт'):
							cityID = 3050;
							break;
						case('Шымкент'):
							cityID = 7077;
							break;
						case('Щецин'):
							cityID = 423205;
							break;
						case('Эдмонтон'):
							cityID = 422370;
							break;
						case('Эйндховен'):
							cityID = 359843;
							break;
						case('Экатепек-де-Морелос'):
							cityID = 422613;
							break;
						case('Экибастуз'):
							cityID = 7074;
							break;
						case('Энгельс'):
							cityID = 423525;
							break;
						case('Эрмосильо'):
							cityID = 422625;
							break;
						case('Эсбьерг'):
							cityID = 424021;
							break;
						case('Эспоо'):
							cityID = 301312;
							break;
						case('Эссен'):
							cityID = 3048;
							break;
						case('Южно-Сахалинск'):
							cityID = 424013;
							break;
						case('Юрмала'):
							cityID = 422037;
							break;
						case('Якутск'):
							cityID = 2963;
							break;
						case('Янина'):
							cityID = 423002;
							break;
						case('Ярославль'):
							cityID = 2936;
							break;	
					}

			
			//Создаём кнопку-волшебницу-наркоманку. Для красотулечности сделаем её стандартного вида для магазина
			var majBut = document.createElement('li');
			majBut.innerHTML = '<a href="'+realmName+'main/politics/mayor/'+cityID+'/retail">Мэрия</a>';
			
			//Добавляем кнопку-волшебницу-наркоманку.
			$("li:contains('Снабжение')").after(majBut);
		}
	})
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
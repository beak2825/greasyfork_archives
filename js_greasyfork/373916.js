// ==UserScript==
// @name         Отчет ДКК
// @version      0.7
// @description  ///
// @author       Gusev
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk/report*
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/373916/%D0%9E%D1%82%D1%87%D0%B5%D1%82%20%D0%94%D0%9A%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/373916/%D0%9E%D1%82%D1%87%D0%B5%D1%82%20%D0%94%D0%9A%D0%9A.meta.js
// ==/UserScript==

var stat = {dkk:{}, dkb:{},dkvu:{}, bl:{}, hub:{},noname:{}};
$('a.staff').each(function(index){
	var user;
	var service = {};
	switch (this.text){
		case 'jein':
			user = 'Бахарева Ирина';
			service = 'dkk';
			break;
		case 'k-strom':
			user = 'Стром Кристина';
			service = 'dkk';
			break;
		case 'aydar-936':
			user = 'Мадьяров Айдар';
			service = 'dkk';
			break;
		case 'alex-mustafin':
			user = 'Мустафин Искандер';
			service = 'dkk';
			break;
		case 'rakhno':
			user = 'Рахно Александр';
			service = 'dkk';
			break;
		case 'darjasha3008':
			user = 'Бреженко Дарья';
			service = 'dkk';
			break;
		case 'bodosova-av':
			user = 'Бодосова Алена';
			service = 'dkk';
			break;
		case 'karina-27':
			user = 'Газизова Карина';
			service = 'dkk';
			break;
		case 'rpatrushevv':
			user = 'Патрушев Роман';
			service = 'dkk';
			break;
		case 'loginova-k':
			user = 'Логинова Кристина';
			service = 'dkk';
			break;
		case 'ksenya0902':
			user = 'Видьманова Ксения';
			service = 'dkk';
			break;
		case 'yabsakaterina':
			user = 'Герасимова Екатерина';
			service = 'dkk';
			break;
		case 'dokate':
			user = 'Ручкина Екатерина';
			service = 'dkk';
			break;
		case 'fedor2669':
			user = 'Головачев Федор';
			service = 'dkk';
			break;
		case 'ai-belousov':
			user = 'Белоусов Андрей';
			service = 'dkk';
			break;
		case 'sq27':
			user = 'Лещинский Кирилл';
			service = 'dkk';
			break;
		case 'angelinara':
			user = 'Рассадина Ангелина';
			service = 'dkk';
			break;
		case 'regina2018':
			user = 'Хабибова Регина';
			service = 'dkk';
			break;
		case 'vjaalekrd':
			user = 'Вязовецкий Алексей';
			service = 'dkk';
			break;
		case 'krementsov':
			user = 'Кременцов Игорь';
			service = 'dkk';
			break;
		case 'zhadanovi4':
			user = 'Жадан Татьяна';
			service = 'dkk';
			break;
		case 'aberle-86':
			user = 'Аберле Ляйсан';
			service = 'dkk';
			break;
		case 'f-victoria':
			user = 'Фуфыгина Виктория';
			service = 'dkk';
			break;
		case 'nakomissarova':
			user = 'Комиссарова Наталья';
			service = 'dkb';
			break;
		case 'milisa':
			user = 'Столяренко Людмила';
			service = 'dkk';
			break;
		case 'pavelnkulakov':
			user = 'Кулаков Павел';
			service = 'dkk';
			break;
		case 'aleks1989':
			user = 'Вознесенский Алексей';
			service = 'dkk';
			break;
		case 'ifollow':
			user = 'Лебедев Владимир';
			service = 'dkk';
			break;
		case 'ml_Calvin':
			user = 'Робот МЛ_Кальвин';
			service = 'dkk';
			break;
		case 'Toloka':
			user = 'Толока';
			service = 'dkk';
			break;
		case 'maxts':
			user = 'Царегородцев Максим';
			service = 'bl';
			break;
		case 'sergeydmit':
			user = 'Дмитриев Сергей';
			service = 'bl';
			break;
		case 'panda1994':
			user = 'Мария Ву';
			service = 'bl';
			break;
		case 'bulatds':
			user = 'Идиятуллин Булат';
			service = 'bl';
			break;
		case 'albert116':
			user = 'Яппаров Альберт';
			service = 'bl';
			break;
		case 'limbo':
			user = 'Цой Анастасия';
			service = 'dkk';
			break;
		case 'ozerovan':
			user = 'Озерова Наталья';
			service = 'bl';
			break;
		case 'ekatmal':
			user = 'Гаврина Екатерина';
			service = 'bl';
			break;
		case 'kuchmenko':
			user = 'Кучменко Александр';
			service = 'bl';
			break;
		case 'povzak':
			user = 'Закатова Полина';
			service = 'bl';
			break;
		case 'radikg':
			user = 'Гильфанов Радик';
			service = 'bl';
			break;
		case 'fromvolga':
			user = 'Гусев Денис';
			service = 'bl';
			break;
		case 'vhrom':
			user = 'Хромов Вячеслав';
			service = 'dkk';
			break;
		case 'smetanin93':
			user = 'Сметанин Александр';
			service = 'dkvu';
			break;
		case 'kondrashevata':
			user = 'Кондрашева Татьяна';
            service = 'dkvu';
			break;
		case 'sa5mdima':
			user = 'Климачев Дмитрий';
			service = 'dkvu';
			break;
		case 'sedovaolga':
			user = 'Седова Ольга';
			service = 'dkvu';
			break;
		case 'alexkot':
			user = 'Котыков Алексей';
			service = 'dkvu';
			break;
		case 'chuvashovvl':
			user = 'Чувашев Владимир';
			service = 'dkvu';
			break;
		case 'kigoshina':
			user = 'Игошина Ксения';
			service = 'dkvu';
			break;
		case 'xisaliyasha':
			user = 'Хисматуллина Алия';
			service = 'dkvu';
			break;
		case 'valeriyvb15':
			user = 'Бойченко Валерий';
			service = 'dkvu';
			break;
		case 'a-nazarova':
			user = 'Назарова Анастасия';
			service = 'dkvu';
			break;
		case 'ulyana222':
			user = 'Гончарова Ульяна';
			service = 'dkvu';
			break;
		case '007voc':
			user = 'Шепелева Катарина';
			service = 'dkvu';
			break;
		case 'froggysvet4':
			user = 'Удачина Светлана';
			service = 'dkvu';
			break;
		case 'rozaliyaja':
			user = 'Атласова Роза';
			service = 'dkvu';
			break;
		case 'nvkolesnikova':
			user = 'Колесникова Наталья';
			service = 'dkvu';
			break;
		case 'kamsaf':
			user = 'Сафин Камиль';
			service = 'dkvu';
			break;
		case 'martynova89':
			user = 'Мартынова Ксения';
			service = 'dkb';
			break;
		case 'elvochka':
			user = 'Гусманова Светлана';
			service = 'dkb';
			break;
		case 'fursalom':
			user = 'Квашнина Ольга';
			service = 'dkb';
			break;
		case 'mariiash':
			user = 'Шарафутдинова Мария';
			service = 'dkb';
			break;
		case '1989katrin':
			user = 'Кузякина Екатерина';
			service = 'dkb';
			break;
		case 'msent':
			user = 'Сентюрева Мария';
			service = 'dkb';
			break;
		case 'pashalev':
			user = 'Левин Павел';
			break;
		case 'radygin1':
			user = 'Радыгин Дмитрий';
			service = 'dkb';
			break;
		case 'vikazi':
			user = 'Зинина Виктория';
			service = 'dkb';
			break;
		case 'youinvisible':
			user = 'Тузикова Елена';
			service = 'dkb';
			break;
		case 'marrsunn':
			user = 'Панкратова Мария';
			service = 'dkb';
			break;
		case 'polshvets':
			user = 'Швецова Полина';
			service = 'dkb';
			break;
		case 'bakirrrova':
			user = 'Бакирова Алина';
			service = 'dkb';
			break;
		case 'sergiozot':
			user = 'Зотов Сергей';
			service = 'dkb';
			break;
		case 'lenakulishova':
			user = 'Кулишова Елена';
			service = 'hub';
			break;
		case 'meteleva':
			user = 'Евгения Метелева';
			service = 'hub';
			break;
		case 'lengardn':
			user = 'Надежда Ленгард';
			service = 'hub';
			break;
		case 'vetchinov':
			user = 'Иван Ветчинов';
			service = 'hub';
			break;
		case 'aluky':
			user = 'Александр Лукьянчиков';
			service = 'hub';
			break;
		case 'gimranov':
			user = 'Марат Гимранов';
			service = 'hub';
			break;
		case 'ryabinichev':
			user = 'Андрей Рябиничев';
			service = 'hub';
			break;
		case 'pochinskiy':
			user = 'Денис Починский';
			service = 'hub';
			break;
		case 'bkronik':
			user = 'Борис Кроник';
			service = 'hub';
			break;
		case 'oryabova':
			user = 'Оксана Рябова';
			service = 'hub';
			break;
        case 'ekhodzhaev':
			user = 'Ходжаев Эрнест';
			service = 'bl';
			break;
        case 'amamalyga':
			user = 'Мамалига Анастасия';
			service = 'bl';
			break;
		default:
			user = this.text;
			service = 'noname'
	};

	stat[service][user] = +($('td.r.g').eq(index).text()).replace(/[^0-9]/g, '');
})

$('<div><div style="display:inline-block; margin-right: 30px"> <h4>ДКК</h4> <table style="width: auto" class="table table-bordered"> <tr> <th>№</th> <th>Пользователь</th> <th>Итого</th> </tr><thead></thead> <tbody id="dkk"></tbody> </table></div><div style="display:inline-block; margin-right: 30px"> <h4>ДКБ</h4> <table style="width: auto" class="table table-bordered"> <tr> <th>№</th> <th>Пользователь</th> <th>Итого</th> </tr><thead></thead> <tbody id="dkb"></tbody> </table></div><div style="display:inline-block; margin-right: 30px"> <h4>ДКВУ</h4> <table style="width: auto" class="table table-bordered"> <tr> <th>№</th> <th>Пользователь</th> <th>Итого</th> </tr><thead></thead> <tbody id="dkvu"></tbody> </table></div><div style="display:inline-block; margin-right: 30px"> <h4>ЧС/СКК/МКК</h4> <table style="width: auto" class="table table-bordered"> <tr> <th>№</th> <th>Пользователь</th> <th>Итого</th> </tr><thead></thead> <tbody id="bl"></tbody> </table></div><div style="display:inline-block; margin-right: 30px"> <h4>ХАБы</h4> <table style="width: auto" class="table table-bordered"> <tr> <th>№</th> <th>Пользователь</th> <th>Итого</th> </tr><thead></thead> <tbody id="hub"></tbody> </table></div><div style="display:inline-block; margin-right: 30px"> <h4>No name</h4> <table style="width: auto" class="table table-bordered"> <tr> <th>№</th> <th>Пользователь</th> <th>Итого</th> </tr><thead></thead> <tbody id="noname"></tbody> </table></div></div>').insertBefore($('h3:contains("Статистика по статусам")'));
for(var prop in stat){
	var index = 1;
	for(var propU in stat[prop]){
		$('<tr/>',{
		append: $('<td/>',{ text: index }).add($('<td/>',{ text: propU })).add($('<td/>',{text: stat[prop][propU]}))}).appendTo('#'+prop);
	index++
	};
};

$('head').append($('<style/>',{
	text: 'tbody>tr:hover {background-color: #e6e6e6} tr.done {background-color: #b0e8a2}'
}));
$('tbody>tr').each(function(){
	$(this).dblclick(function(){
		$(this).eq(0).toggleClass('done')
	})
});
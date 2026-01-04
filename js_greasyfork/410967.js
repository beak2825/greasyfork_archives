// ==UserScript==
// @name         Textarea Typograf
// @namespace    https://github.com/glebkema/tampermonkey-textarea-typograf
// @description  Replaces hyphens, quotation marks, uncanonic smiles and "yo" in some russian words.
// @author       glebkema
// @copyright    2020-2024, Gleb Kemarsky (https://github.com/glebkema)
// @license      MIT
// @version      0.7.12
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/410967/Textarea%20Typograf.user.js
// @updateURL https://update.greasyfork.org/scripts/410967/Textarea%20Typograf.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author glebkema
// ==/OpenUserJS==

'use strict';

class Typograf {
	MODE_ANY = 'any';
	MODE_ANY_BEGINNING = 'anyBeginning';
	MODE_ANY_BEGINNING_EXCEPT_O_AND_Y = 'anyBeginningExceptOAndY';
	MODE_ANY_BEGINNING_EXCEPT_Y = 'anyBeginningExceptY';
	MODE_ANY_ENDING = 'anyEnding';
	MODE_ANY_ENDING_EXCEPT_D = 'anyEndingExceptD';
	MODE_ANY_ENDING_EXCEPT_I_AND_SOFT_SIGN = 'anyEndingExceptIAndSoftSign';
	MODE_ANY_ENDING_EXCEPT_L = 'anyEndingExceptL';
	MODE_ANY_ENDING_EXCEPT_N = 'anyEndingExceptN';
	MODE_ANY_EXCEPT_I = 'anyExceptI';
	MODE_ANY_EXCEPT_K = 'anyExceptK';
	MODE_ANY_EXCEPT_R = 'anyExceptR';
	MODE_AS_IS = 'asIs';
	MODE_ENDINGS_1 = 'endings1';
	MODE_ENDINGS_2 = 'endings2';
	MODE_ENDINGS_3 = 'endings3';
	MODE_EXCEPTIONS = 'exceptions';
	MODE_EXTRA_PREFIXES = 'extraPrefixes';
	MODE_NO_CAPITAL_LETTER = 'noCapitalLetter';
	MODE_NO_PREFIXES = 'noPrefixes';
	MODE_NO_SUFFIXES = 'noSuffixes';
	MODE_STANDARD = 'standard';

	verbCores = {
		[this.MODE_EXCEPTIONS]:        'Льё,Мнё,Рвё,Трё',
		[this.MODE_EXTRA_PREFIXES]:    'Берё,Боднё,Вернё,Даё,Живё,Несё,Орё,Пасё,Плывё,Поё,Ревё,Смеё,Стаё',
		[this.MODE_NO_CAPITAL_LETTER]: 'Йдё,Ймё',
		[this.MODE_NO_PREFIXES]:       'Идё,Начнё,Обернё,Придаё,Придё,Улыбнё',
		[this.MODE_NO_SUFFIXES]:       'Берёгся,Шёл',
		[this.MODE_STANDARD]:          'Бережё,Блеснё,Блюдё,Блюё,Бьё,Ведё,Везё,Врё,Вьё,Гнё,Дерё,Ждё,Жмё,Жрё,Льнё,Прё,Пьё,Ткнё,Чтё,Шлё,Шьё',
	};

	words = {
		[this.MODE_AS_IS]:
		// alphabetically
		'Бёдер,Белёк,Бельём,Бобёр,Бобылём,'
		+ 'Взахлёб,Вперёд,'
		+ 'Запёк,'
		+ 'Копьё,Копьём,'
		+ 'Отстранён,' // MODE_ENDINGS_3 для других форм этого слова
		+ 'Предпочёл,Прочёл,'
		+ 'Рулём,'
		+ 'Твёрже,'

		// groups
		+ 'Василёк,Мотылёк,Огонёк,Пенёк,Поперёк,Ручеёк,'
		+ 'Вдвоём,Втроём,Объём,Остриём,Причём,Своём,Твоём,'
		+ 'Грёза,Грёзы,Слёзы,'
		+ 'Её,Ещё,Моё,Неё,Своё,Твоё,'
		+ 'Журавлём,Кораблём,Королём,Снегирём,Соловьём,'
		+ 'Затёк,Натёк,Потёк,'
		+ 'Трёх,Четырём,Четырёх,',  // "Трём" уже есть как глагол

		[this.MODE_ANY]: 'ёхонек,ёхоньк,ёшенек,ёшеньк,'
		+ 'бомбёж,гиллёз,надёг,ощёк,счётн,уёмн,шёрстн,циллёз,ъёмкост,'  // стёгивал,стёгнут,
		+ 'Пролёт,Самолёт,'
		+ 'Отчёт,Расчёт,'
		+ 'Веретён,Гнёзд,Звёздн,Лёгочн,Лётчи,Надёжн,Налёт,Разъём,Съёмк,'

		// adjectives
		+ 'бережённ,ворённ,мягчённ,ретённ,таённ,теплённ',

		[this.MODE_ANY_BEGINNING]: 'атырёв,атырём,варём,'
		+ 'арьё,арьём,ерьё,ерьём,ырьё,ырьём,'
		+ 'берёг',  // NB: except as is: "берег моря"

		[this.MODE_ANY_BEGINNING_EXCEPT_O_AND_Y]:

		// adjectives
		'Точён',  // - сосредоточено

		[this.MODE_ANY_BEGINNING_EXCEPT_Y]:

		// adjectives
		'несённ,'
		+ 'тёкш,Тёрт,тёрш,'
		+ 'Шёрстн',

		[this.MODE_ANY_ENDING]:
		// alphabetically
		'Актёр,Алён,Алёх,Алёш,Алфёр,Аматёр,Амёб,Анкетёр,Антрепренёр,Артём,'
		+ 'Бабёнк,Бабёф,Балансёр,Балдёж,Банкомёт,Баталёр,Бёдра,Бельёвщиц,Бережён,Берёз,Бесён,Бесслёзн,Бечёвк,Бечёво,Билетёр,Бирюлёв,Благословлён,Блёстк,Бобрён,Боксёр,Бородён,Боронён,Бочкарёв,'
		+ 'Вёрстк,'
		+ 'Ворьё,'  // NB: ворьё,ворьём но подворье,подспорье
		+ 'Жёстк,'
		+ 'Лёгки,'
		+ 'Партнёр,Проём,'
		+ 'Расчёск,Ребён,'
		+ 'Серьёз,'
		+ 'Трёш,'
		+ 'Чётк,'

		// cognate words
		+ 'Вертолёт,Звездолёт,Отлёт,Перелёт,Полёт,'
		+ 'Запёкш,Запечён,Испечён,'
		+ 'Заём,Наём,'
		+ 'Зачёт,Звездочёт,Почёт,Счёт,Учёт',

		[this.MODE_ANY_ENDING_EXCEPT_D]: 'Одёж',

		[this.MODE_ANY_ENDING_EXCEPT_I_AND_SOFT_SIGN]: 'Твёрд',

		[this.MODE_ANY_ENDING_EXCEPT_L]: 'Приём',

		[this.MODE_ANY_ENDING_EXCEPT_N]: 'Трёх',

		[this.MODE_ENDINGS_1]: 'Зелён',   // [аоуык]

		[this.MODE_ENDINGS_2]: 'Учён',    // [аоуы]

		[this.MODE_ENDINGS_3]: 'Включён,Остранён', // [н]


		[this.MODE_ANY_EXCEPT_I]: 'бретён,скажён,творён',

		[this.MODE_ANY_EXCEPT_K]: 'бъё',

		[this.MODE_ANY_EXCEPT_R]: 'омёт',
	}

	run(element) {
		if (element && 'textarea' === element.tagName.toLowerCase() && element.value) {
			const start = element.selectionStart;
			const end = element.selectionEnd;
			if (start === end) {
				element.value = this.improve(element.value);
			} else {
				const selected = element.value.substring(start, end);
				const theLength = element.value.length;
				element.value = element.value.substring(0, start)
					+ this.improve(selected) + element.value.substring(end, theLength);
			}
		} else {
			// console.info('Start editing a non-empty textarea before calling the script');
		}
	}

	improve(text) {
		if (text) {
			text = this.improveDash(text);
			text = this.improveQuotes(text);
			text = this.improveSmile(text);
			text = this.improveYo(text);
		}
		return text;
	}

	improveDash(text) {
		text = text.replace(/ - /g, ' — ');
		return text;
	}

	improveQuotes(text) {
		// use only one type + only external if two stand together
		// text = text.replace(/(?<=^|[(\s])["„“]/g, '«');
		// text = text.replace(/["„“](?=$|[.,;:!?)\s])/g, '»');

		// use only one type
		text = text.replace(/["„“”](?=["„“”«]*[\wа-яё(])/gi, '«');
		text = text.replace(/(?<=[\wа-яё).!?]["„“”»]*)["„“”]/gi, '»');

		// nested quotes
		// (?:«[^»]*)([«"])([^"»]*)(["»])
		// (?=(?:(?<!\w)["«](\w.*?)["»](?!\w)))   https://stackoverflow.com/a/39706568/6263942
		// («([^«»]|(?R))*»)                      https://stackoverflow.com/a/14952740/6263942
		// «((?>[^«»]+|(?R))*)»                   https://stackoverflow.com/a/26386070/6263942
		// «([^«»]*+(?:(?R)[^«»]*)*+)»            https://stackoverflow.com/a/26386070/6263942
		// «[^»]*(?:(«)[^«»]*+(»)[^«]*)+»
		do {
			var old = text;
			text = text.replace(/(?<=«[^»]*)«(.*?)»/g, '„$1“');
		} while ( old !== text );
		return text;
	}

	improveSmile(text) {
		// fix uncanonical smiles
		text = text.replace(/([:;])[—oо]?([D)(|])/g, '$1-$2');

		// remove the dot before the smile
		text = text.replace(/(?<=[А-ЯЁа-яё])\.\s*(?=[:;]-[D)(|])/g, ' ');

		return text;
	}

	improveYo(text) {
		// verbs - cores
		for (let mode in this.verbCores) {
			text = this.improveverbCores(text, mode, this.verbCores[mode]);
		}

		// verbs - unsystematic cases
		let lookBehind = '(?<![гж-нпру-я])'; // +абвдеост, -ы
		text = this.replaceYo(text, 'Дерг', 'Дёрг', lookBehind, '(?![б-яё])');    // +а, -у
		text = this.replaceYo(text, 'Дерн', 'Дёрн', lookBehind, '(?![б-джзй-нп-тф-ъь-яё])');  // +аеиоуы (сущ. или глагол)

		lookBehind = '(?<![бвге-зй-ру-я])'; // +адист
		text = this.replaceYo(text, 'Стег', 'Стёг', lookBehind, '(?!ал|ать|ну)');
		text = this.replaceYo(text, 'Стегнут', 'Стёгнут', lookBehind, '(?!ь)');  // NB: расстёгнутый

		text = this.replaceYo(text, 'черкива', 'чёркива', '(?<=[адты])', '(?=[елт])');

		// verbs - fix the exceptions
		lookBehind = '(?<![А-Яa-я])';
		text = this.replaceException(text, 'Раздольём', lookBehind);
		text = this.replaceException(text, 'Расстаёт',  lookBehind, '(?![а-дж-я])');
		text = this.replaceException(text, 'Шлём',      lookBehind);

		// words with a certain preposition
		// NB: before `words` for combinations like `Всё чётко`
		text = this.improveYoWord(text, null, 'В моём,На моём,О моём');
		text = this.improveYoWord(text, null, 'В нём,О нём,При нём');
		text = this.improveYoWord(text, null, 'Всё верно,Всё напрасно,Всё очень просто,Всё понятно,Всё правильно,Всё просто,Всё путём,Всё равно,Всё так же,Всё то же,Всё точно,Всё чётко,Всё ясно');
		text = this.improveYoWord(text, null, 'Всё, на чём/Всё, о чём/Всё, про что/Всё, с чем/Всё, что/Всё-таки', '/');
		text = this.improveYoWord(text, null, 'Ни на чём/Ни о чём/Ни при чём', '/');

		// words
		for (let mode in this.words) {
			text = this.improveYoWord(text, mode, this.words[mode]);
		}

		return text;
	}

	improveverbCores(text, mode, list, divider = ',') {
		return this.iterator(text, mode, list, divider, this.replaceverbCores.bind(this));
	}

	improveYoWord(text, mode, list, divider = ',') {
		return this.iterator(text, mode, list, divider, this.replaceYoWord.bind(this));
	}

	iterator(text, mode, list, divider, callback) {
		if ('string' === typeof list) {
			list = list.split(divider);
		}
		for (let i = 0; i < list.length; i++) {
			const replace = list[i].trim();
			if (replace) {
				const find = this.removeAllYo(replace);
				text = callback(text, mode, find, replace);
			}
		}
		return text;
	}

	removeAllYo(text) {
		return text.replace(/ё/g, 'е').replace(/Ё/g, 'Е');
	}

	// restore the `e` instead of `yo`
	replaceException(text, exception, lookBehind = '', lookAhead = '') {
		const replace = this.removeAllYo(exception);
		let regex = new RegExp(exception + lookAhead, 'g');
		text = text.replace(regex, replace);
		regex = new RegExp(lookBehind + exception.toLowerCase() + lookAhead, 'g');
		text = text.replace(regex, replace.toLowerCase());
		return text;
	}

	replaceYo(text, find, replace,
		lookBehind = '(?<![б-джзй-нп-тф-я])', // +аеиоу
		// lookAhead = '(?=[мтш])'
		lookAhead = '(?=(?:м|мся|т|те|тесь|тся|шь|шься)(?:[^а-яё]|$))'
	) {
		let regex;
		let findLowerCase = find.toLowerCase();
		// NB: \b doesn't work for russian words
		// 1) starts with a capital letter = just a begining of the word
		if (find !== findLowerCase) {
			regex = new RegExp(find + lookAhead, 'g');
			text = text.replace(regex, replace);
		}
		// 2) in lowercase = with a prefix ahead or without it
		regex = new RegExp(lookBehind + findLowerCase + lookAhead, 'g' + ('' === lookBehind ? '' : 'i'));
		text = text.replace(regex, replace.toLowerCase());
		return text;
	}

	replaceverbCores(text, mode, find, replace) {
		if (this.MODE_EXCEPTIONS === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![б-джзй-нп-тф-я]|зе|ко|фе)' ); // +аеиоу -"зельем" -"корвет" -"фельетон"
				// '(?=[мтш])(?!мо)(?!ть)'); // -"мнемо" -"треть"
		}
		if (this.MODE_EXTRA_PREFIXES === mode) {
			let lookBehind = '(?<![гжк-нпрф-я])'; // +аеиоу +бвдзст
			if ('Даё' === replace) {
				lookBehind = '(?<![гжик-нпрф-ъь-я]|ла|па)'; // -и +ы  >>> +"Придаёт" -"Обладает" -"Попадает"
			} else if ('Пасё' === replace) {
				lookBehind = '(?<![б-зй-нпртф-я])';  // "напасёшься"
			} else if ('Стаё' === replace) {
				lookBehind = '(?<![гжк-нпрф-я]|ра)'; // -"вы/за/от/подрастает"
			}
			return this.replaceYo(text, find, replace, lookBehind);
		}
		if (this.MODE_NO_CAPITAL_LETTER === mode) {
			return this.replaceYo(text, find.toLowerCase(), replace);
		}
		if (this.MODE_NO_PREFIXES === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![А-Яа-яЁё])');
		}
		if (this.MODE_NO_SUFFIXES === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![б-джзй-нпртф-я])', // +аеиоу +с
				'(?![а-яё])');
		}
		// MODE_STANDARD
		return this.replaceYo(text, find, replace);
	}

	replaceYoWord(text, mode, find, replace) {
		if (this.MODE_ANY === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'');
		}
		if (this.MODE_ANY_BEGINNING === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?![а-яё])');
		}
		if (this.MODE_ANY_BEGINNING_EXCEPT_O_AND_Y === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![оы])',
				'');
		}
		if (this.MODE_ANY_BEGINNING_EXCEPT_Y === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![ы])',
				'');
		}
		if (this.MODE_ANY_ENDING === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![А-Яа-яЁё])',
				'');
		}
		if (this.MODE_ANY_ENDING_EXCEPT_D === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![А-Яа-яЁё])',
				'(?![д])');
		}
		if (this.MODE_ANY_ENDING_EXCEPT_I_AND_SOFT_SIGN === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![А-Яа-яЁё])',
				'(?![иь])');
		}
		if (this.MODE_ANY_ENDING_EXCEPT_L === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![А-Яа-яЁё])',
				'(?![л])');
		}
		if (this.MODE_ANY_ENDING_EXCEPT_N === mode) {
			return this.replaceYo(text, find, replace,
				'(?<![А-Яа-яЁё])',
				'(?![н])');
		}
		if (this.MODE_ANY_EXCEPT_I === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?![и])');
		}
		if (this.MODE_ANY_EXCEPT_K === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?![к])');
		}
		if (this.MODE_ANY_EXCEPT_R === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?![р])');
		}
		if (this.MODE_ENDINGS_1 === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?=[аоуык])');
		}
		if (this.MODE_ENDINGS_2 === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?=[аоуы])');
		}
		if (this.MODE_ENDINGS_3 === mode) {
			return this.replaceYo(text, find, replace,
				'',
				'(?=н)');
		}
		// MODE_AS_IS
		return this.replaceYo(text, find, replace,
			'(?<![А-Яа-яЁё])',
			'(?![а-яё])');
	}
}

// if it's a browser, not a test
if ('undefined' !== typeof document) {
	let typograf = new Typograf();
	typograf.run(document.activeElement);
}

// if it's a test by Node.js
if (module) {
	module.exports = {
		Typograf: Typograf,
	};
} else {
	var module; // hack for Tampermonkey's eslint
}

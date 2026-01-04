// ==UserScript==
// @name         Jisho stuff
// @namespace    https://github.com/chumbucket/JishoStuff
// @version      0.4
// @description  Search the radical list by labels that you define.
// @author       chumbucket
// @match        https://jisho.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419715/Jisho%20stuff.user.js
// @updateURL https://update.greasyfork.org/scripts/419715/Jisho%20stuff.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const extraFunctions = function () {
		const hideFurigana = function () {
			if (-1 == location.href.indexOf('%23sentences')) {
				return;
			}
			var styleElement = document.createElement('style');
			styleElement.setAttribute('type', 'text/css');
			styleElement.innerHTML =
        '.furigana{opacity:0!important}' +
        '.furigana:hover{opacity:1!important}' +
        '.english{opacity:0!important}' +
        '.english:hover{opacity:1!important}';
			document.body.appendChild(styleElement);
		};
		hideFurigana();
		const searchSelectedWord = function (e) {
			if (13 == e.keyCode) {
				var selectedWord = window.getSelection().toString();
				if (selectedWord) {
					window.open('https://jisho.org/search/' + selectedWord);
				}
			}
		};
		window.addEventListener('keyup', searchSelectedWord);
	};
	const $ = window.jQuery || null;
	if (!$) {
		console.error('TM JishoStuff: jQuery is undefined');
		return;
	}
	const radicalInput = new window.RadicalInput() || null;
	if (!radicalInput) {
		console.error('TM JishoStuff: RadicalInput is undefined');
		return;
	}
	let radTable = $('.radical_table');
	let radicals = $('.radical', '.radical_table');
	radTable[0].addEventListener('click', function (evt) {
		let rad = $(evt.target);
		if (rad.hasClass('radical')) {
			let radindex = radicals.index(rad);
			if (rad.hasClass('selected')) {
				$('.search-term').each(function () {
					if (radindex == $(this).data('index')) {
						$(this).remove();
					}
				});
			}
		}
	});
	const defaultRadLabels =
    '一;one,｜;line,丶;dot,ノ;no,乙;second rank,亅;putter,二;two,亠;lid,人;person,⺅;person left,' +
    '𠆢;roof,儿;legs,入;enter,ハ;eight,丷;together,冂;moustache,冖;bracket,冫;cold left,几;table,凵;open box,' +
    '刀;sword,⺉;sword right,力;power,勹;wrap,匕;hi,匚;side box,十;ten,卜;to,卩;fingerprint,厂;cliff,厶;mu,' +
    '又;crotch,マ;ma,九;round,ユ;yu,乃;sharp butt,𠂉;rifle,⻌;motion,口;mouth,囗;big mouth,土;dirt,' +
    '士;samurai,夂;each,夕;evening,大;big,女;woman,子;child,宀;crown,寸;stick,小;small,⺌;mohawk,' +
    '尢;crooked big,尸;corpse,屮;mountain tail,山;mountain,川;river,巛;river flow,工;construction,' +
    '已;self,巾;cloth,干;dry,幺;eazy,广;cave,廴;stretch,廾;letter h,弋;ceremony,弓;bow,ヨ;yo,' +
    '彑;reciprocal,彡;short hair,彳;go left,⺖;heart left,⺘;hand left,⺡;water left,⺨;animal,' +
    '⺾;flower top,⻏;boston right,⻖;boston left,也;scorpion,亡;deceased,及;reach,久;long time,' +
    '⺹;dig,心;heart,戈;spear,戸;door,手;hand,支;branch,攵;director,文;sentence,斗;spice rack,斤;axe,方;direction,' +
    '无;crooked heaven,日;sun,曰;flat sun,月;moon,木;tree,欠;lack,止;stop,歹;death,殳;nurse,比;compare,' +
    '毛;fur,氏;surname,气;steam,水;water,火;fire,⺣;fire bottom,爪;nail,父;father,爻;dos equis,' +
    '爿;left side,片;right side,牛;cow,犬;dog,⺭;ne,王;king,元;origin,井;hashtag,勿;rib,尤;crooked dog,' +
    '五;five,屯;fort,巴;nerd,毋;every,玄;deep,瓦;tile,甘;sweet,生;life,用;use,田;rice field,疋;incorrect,' +
    '疒;sick,癶;tent,白;white,皮;skin,皿;plate,目;eye,矛;beforehand,矢;arrow,石;stone,示;indicate,' +
    '禸;cow goatee,禾;wheat,穴;hole,立;stand,⻂;duck,世;world,巨;giant,冊;books,母;mother,⺲;net,牙;fang,' +
    '瓜;melon,竹;bamboo,米;rice,糸;thread,缶;can,羊;sheep,羽;feather,而;comb,耒;branch tree,耳;ear,' +
    '聿;brush,肉;meat,自;myself,至;climax,臼;mortar,舌;tongue,舟;boat,艮;good,色;color,虍;tiger,虫;bug,' +
    '血;blood,行;go,衣;clothes,西;west,臣;slave,見;see,角;corner,言;say,谷;valley,豆;bean,豕;pig,豸;snake,' +
    '貝;shellfish,赤;red,走;run,足;foot,身;somebody,車;car,辛;spicy,辰;shake,酉;sake,釆;come,' +
    '里;village,舛;dance,麦;barley,金;gold,長;long,門;gate,隶;extend,隹;turkey,雨;rain,青;blue,非;un,奄;big dragon,' +
    '岡;hill,免;excuse,斉;equal,面;surface,革;leather,韭;leek,音;sound,頁;page,風;wind,飛;fly,食;eat,首;neck,香;perfume,' +
    '品;goods,馬;horse,骨;bone,高;high,髟;hair,鬥;broken gate,鬯;herbs,鬲;tripod,鬼;demon,竜;dragon,韋;tanned leather,' +
    '魚;fish,鳥;bird,鹵;salt,鹿;deer,麻;hemp,亀;turtle,啇;drip,黄;yellow,黒;black,黍;millet,黹;sewing,無;nothing,歯;tooth,' +
    '黽;green frog,鼎;kettle,鼓;drum,鼠;mouse,鼻;nose,齊;alike,龠;flute';
	const initRadKeys = function () {
		let savedLabels = window.localStorage
			? localStorage.getItem('radLabels')
			: null;
		let radKeys = {};
		if (!savedLabels) {
			let radDef = defaultRadLabels.split(',');
			radDef.forEach(function (rad, index) {
				let radk = rad.split(';');
				if (radk.length < 2) {
					return;
				}
				radKeys[radk[1]] = index;
			});
		} else {
			radKeys = JSON.parse(savedLabels);
		}
		return radKeys;
	};
	let radKeys = initRadKeys();
	const saveRadLabels = function () {
		if (!window.localStorage) {
			return false;
		}
		try {
			localStorage.setItem('radLabels', JSON.stringify(radKeys));
			return true;
		} catch (e) {
			return false;
		}
	};
	saveRadLabels() || console.error('Error saving labels to localStorage');
	const liForRadKey = function (key) {
		let tableindex = radKeys[key];
		if (void 0 == tableindex) {
			return false;
		}
		return radicals[tableindex];
	};
	Object.keys(radKeys).forEach(function (key) {
		let radEl = liForRadKey(key);
		radEl.title = `*${key}`;
		$(radEl).data('label', key);
	});
	$('[title]').tooltip();
	const createRadSearch = function () {
		let input = document.createElement('div');
		input.id = 'rad-searchbar';
		input.setAttribute('contenteditable', 'true');
		let showlessdiv = $('.show_less', '#radical_area')[0];
		showlessdiv.insertAdjacentElement('afterend', input);
		return input;
	};
	Object.defineProperty(HTMLElement.prototype, 'value', {
		get: function () {
			return this.textContent;
		},
		set: function (x) {
			this.textContent = x;
		},
	});
	const createEditButton = function () {
		let radTable = $('.radical_table');
		let button = document.createElement('div');
		button.textContent = 'Edit';
		button.setAttribute('class', 'icon edit-label');
		radTable.prepend(button);
		return button;
	};
	const makeEditOverlay = function () {
		var editContainer = document.createElement('div');
		editContainer.id = 'edit-container';
		$(editContainer).click(function () {
			$(this).css('display', 'none');
			$('.save-result').text('');
		});
		let editbody = document.createElement('div');
		let bodyHtml =
      '<div class="rad-text"></div>' +
      '<div class="save-result"></div>' +
      '<input class="edit-input">';
		editbody.id = 'edit-body';
		$(editbody).click(function (evt) {
			evt.stopPropagation();
		});
		$(editbody).append(bodyHtml);
		$(editContainer).append(editbody);
		$(document.body).prepend(editContainer);
		$('.edit-input').data('radindex', '');
		$('.edit-input').data('label', '');
	};
	const makeRadOverlays = function () {
		$(radicalInput.radicals).each(function () {
			let radoverlay = document.createElement('div');
			radoverlay.setAttribute('class', 'rad-overlay');
			let clickedRadical = this;
			$(radoverlay).click(function () {
				$('#edit-container').css('display', 'flex');
				editRadLabel(clickedRadical);
			});
			$(this).prepend(radoverlay);
		});
	};
	const editRadLabel = function (rad) {
		let radLabel = $(rad).data('label');
		let radIndex = $(radicals).index(rad);
		if (radLabel) {
			$('.edit-input').val(radLabel);
		} else {
			$('.edit-input').val('');
		}
		$('.edit-input').data('radindex', radIndex);
		$('.edit-input').data('label', radLabel);
		$('.rad-text').text($(rad).text());
	};
	const showRadOverlays = function () {
		if (editMode) {
			$('.rad-overlay').css('display', 'inherit');
		} else {
			$('.rad-overlay').css('display', 'none');
		}
	};
	const makeSpanWithTerm = function (searchterm) {
		let span = document.createElement('span');
		span.setAttribute('class', 'search-term');
		span.textContent = searchterm[0];
		span = $(span);
		span.attr('data-index', radKeys[searchterm[0]]);
		span.click(
			(function (me) {
				return function () {
					let radical = radInfoFromTerm(me.text());
					radicalInput.selected_radicals = radicalInput.selected_radicals.subtract(
						radical.text
					);
					if (0 == radicalInput.selected_radicals.length) {
						radicalInput.reset();
					} else {
						radicalInput.getKanji();
					}
					radical.element.removeClass('selected');
					radical.text;
					radicalInput.selected_radicals;
					me.remove();
				};
			})(span)
		);
		let resultsarea = $('.results', '#radical_area');
		resultsarea.append(span);
		return span;
	};
	let radSearchBar = createRadSearch();
	let editButton = createEditButton();
	makeRadOverlays();
	makeEditOverlay();
	let editMode = false;
	$(editButton).on('click', function (evt) {
		evt.preventDefault();
		if (editMode) {
			editMode = false;
			$(radSearchBar).attr('contenteditable', 'true');
			$(this).css({ 'background-color': 'white', color: '#222' });
			$('.radical_table').css('background', '');
		} else {
			editMode = true;
			$('.results .search-term').remove();
			radicalInput.reset();
			$(radSearchBar).attr('contenteditable', 'false');
			$(this).css({ 'background-color': '#555', color: 'white' });
			$('.radical_table').css({
				background: 'none',
				'background-color': '#edf9ff',
			});
		}
		showRadOverlays();
	});
	let showSaveResultText = function (resulttext, bool) {
		if (bool) {
			$('.save-result').css('color', '#2ecb2e');
		} else {
			$('.save-result').css('color', 'red');
		}
		$('.save-result').text(resulttext);
	};
	$('.edit-input').on('keydown', function (e) {
		if (13 == e.keyCode) {
			if ('' == $(this).val()) {
				return;
			}
			e.preventDefault();
			let oldLabel = $(this).data('label');
			let newLabel = $(this).val();
			newLabel = newLabel.replace(/\s*$/, '');
			if (newLabel in radKeys) {
				showSaveResultText('This label is already taken');
				return;
			} else {
				delete radKeys[oldLabel];
				radKeys[newLabel] = $(this).data('radindex');
				$(this).data('label', newLabel);
				let radTableItem = radicals[radKeys[newLabel]];
				$(radTableItem).data('label', newLabel);
				$(radTableItem).attr('title', `*${newLabel}`);
				$(radTableItem).tooltip();
				if (saveRadLabels()) {
					showSaveResultText('Saved', true);
				} else {
					showSaveResultText('Couldn\'t save to local storage');
				}
				radKeys[newLabel];
			}
		}
	});
	const buttontoggle = function (_this) {
		return function () {
			if (_this.active) {
				return _this.deactivate();
			} else {
				return _this.activate();
			}
		};
	};
	radicalInput.table.off();
	radicalInput.area.off();
	radicalInput.button.off();
	radicalInput.list.off();
	radicalInput.setupEvents();
	radicalInput.resetRadicalsButton.off();
	radicalInput.button.on('click', buttontoggle(radicalInput));
	radicalInput.resetRadicalsButton.on(
		'click',
		(function (_this) {
			return function () {
				_this.reset();
				$('.results .search-term').remove();
			};
		})(radicalInput)
	);
	const updateOptionsArray = function (terms) {
		if (0 == terms.length) {
			return [];
		}
		let optionsarray = [];
		let searchTerm = terms.last();
		Object.keys(radKeys).forEach(function (key) {
			if (0 == searchTerm.length) {
				return;
			}
			let radTableItem = radInfoFromTerm(key);
			if (
				0 == key.indexOf(searchTerm) &&
        radTableItem.element.hasClass('available')
			) {
				optionsarray.push(key);
			} else {
				return;
			}
		});
		return optionsarray.sort();
	};
	const highlightRadicals = function (arr) {
		if (0 == arr.length) {
			return;
		}
		for (var i = 0; i < arr.length; i++) {
			let radTableItem = liForRadKey(arr[i]);
			radTableItem = $(radTableItem);
			if (
				radTableItem.hasClass('selected') ||
        !radTableItem.hasClass('available')
			) {
				continue;
			}
			radTableItem.addClass('selected');
		}
	};
	const clearHighlightRadicals = function (arr) {
		if (0 == arr.length) {
			return;
		}
		for (var i = 0; i < arr.length; i++) {
			let radTableItem = radInfoFromTerm(arr[i]).element;
			let radk = radInfoFromTerm(arr[i]).text;
			if (-1 != radicalInput.selected_radicals.indexOf(radk)) {
				continue;
			}
			if (radTableItem && radTableItem.hasClass('selected')) {
				radTableItem.removeClass('selected');
			}
		}
	};
	const radInfoFromTerm = function (term) {
		let radTableItem = liForRadKey(term);
		if (!radTableItem) {
			return false;
		}
		radTableItem = $(radTableItem);
		let radk = radTableItem.data('radk') || radTableItem.text();
		return { element: radTableItem, text: radk };
	};
	let lastAutoCompOpts = [];
	let currentSearch = '';
	let lastCaretLocation = 0;
	let optionsindex = 0;
	const radSearchInput = function (e) {
		let selection = window.getSelection();
		lastCaretLocation = selection.anchorOffset;
		if ((e.keyCode >= 65 && e.keyCode <= 90) || 32 == e.keyCode) {
			optionsindex = 0;
			if (!e.metaKey) {
				e.preventDefault();
			}
			if (32 == e.keyCode) {
				currentSearch += ' ';
			} else {
				currentSearch += e.key;
			}
		}
		let terms = [this.value];
		let optionsarray = updateOptionsArray([currentSearch]);
		if (13 == e.keyCode) {
			e.preventDefault();
			e.type;
			clickRadical(terms);
			this.value = '';
			currentSearch = '';
			terms = [];
			optionsarray = [];
			optionsindex = 0;
		}
		if (188 == e.keyCode) {
			e.type;
			clickRadical(terms);
			this.value = '';
			currentSearch = '';
			terms = [];
			optionsarray = [];
			optionsindex = 0;
		}
		if (8 == e.keyCode) {
			optionsindex = 0;
			e.preventDefault();
			e.type, radicalInput.selected_radicals;
			if (currentSearch.length > 0) {
				currentSearch = currentSearch.substr(0, currentSearch.length - 1);
				optionsarray = updateOptionsArray([currentSearch]);
			} else {
				this.value = '';
				currentSearch = '';
				optionsarray = [];
			}
		}
		if (9 == e.keyCode) {
			e.preventDefault();
			e.type;
			if (optionsarray.length) {
				optionsindex++;
				if (optionsindex > optionsarray.length - 1) {
					optionsindex = 0;
				}
			}
		}
		clearHighlightRadicals(lastAutoCompOpts);
		if (optionsarray.length > 0) {
			this.value = optionsarray[optionsindex];
			selection.collapse(this.childNodes[0], currentSearch.length);
		} else {
			this.value = currentSearch;
			selection.collapse(this.childNodes[0], currentSearch.length);
		}
		if ('' == this.value) {
			selection.collapse(this, 0);
		}
		lastAutoCompOpts = optionsarray;
		highlightRadicals(optionsarray);
		currentSearch.length;
	};
	radSearchBar.addEventListener('keydown', radSearchInput);
	radSearchBar.addEventListener('keyup', function (e) {
		if (
			(e.keyCode >= 65 && e.keyCode <= 90) ||
      32 == e.keyCode ||
      8 == e.keyCode ||
      9 == e.keyCode
		) {
			if (!e.metaKey) {
				e.preventDefault();
			}
		}
		if (13 == e.keyCode) {
			e.preventDefault();
		}
	});
	const clickRadical = function (search) {
		let searchterms = search;
		searchterms = searchterms.subtract('');
		searchterms.forEach(function (term) {
			let radical = radInfoFromTerm(term);
			if (!radical) {
				return;
			}
			if (!radical.element.hasClass('available')) {
				return;
			}
			radical.element.addClass('selected');
			if (-1 == radicalInput.selected_radicals.indexOf(radical.text)) {
				radicalInput.selected_radicals.push(radical.text);
				makeSpanWithTerm(searchterms);
			}
		});
		if (0 != radicalInput.selected_radicals.length) {
			let fetchResult = radicalInput.getKanji();
		}
		radicalInput.selected_radicals;
	};
	let globalStyle = document.createElement('style');
	globalStyle.innerHTML =
    '#rad-searchbar{display:block;font-size:22px;background-color:white;outline:none;width:70%;' +
    'height:33px;border-radius:3px;margin-bottom:10px;margin-top:10px;padding-left:5px;' +
    'padding-right:5px;}.icon.edit-label{margin:0px;padding:0px;padding-top:2px;padding-left:5px;' +
    'padding-right:5px;float:left;cursor:pointer;border-radius:5px;height:30px;}.icon.edit-label:hover{background-color:#555!important;' +
    'color:#fff!important;}#edit-container{width:100%;height:100%;background-color:rgba(0,0,0,0.5);' +
    'position:fixed;z-index:1000;top:0px;left:0px;display:none;align-items:center;justify-content:center;' +
    '}#edit-body{display:flex;flex-direction:column;align-items:center;justify-content:center;' +
    'width:200px;height:200px;border-radius:10px;background-color:white;}.edit-input{width:75%!important;' +
    'border-radius:5px!important;text-align:center;}.rad-text{font-size:70px;text-align:center;' +
    'cursor:default;}.save-result{font-size:12px!important;height:18px;}.rad-overlay{position:absolute;' +
    'width:32px;height:32px;margin-left:-2px;margin-top:-2px;display:none;}.search-term{background-color:gray;' +
    'color:white;border-radius:10px;padding:5px;cursor:pointer;margin-right:5px;}.search-input{display:block;' +
    'width:auto;background-color:white;outline:none;}';
	$('head').append(globalStyle);
})();

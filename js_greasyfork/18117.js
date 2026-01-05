// ==UserScript==
// @name         MyAnimeList(MAL) - Voice Actor Filter
// @version      1.7.1
// @description  This script can filter/sort Voice Acting roles, Anime Staff positions and Published Manga
// @author       Cpt_mathix
// @match        https://myanimelist.net/people/*
// @exclude      https://myanimelist.net/people/*/*/*
// @match        https://myanimelist.net/people.php?id=*
// @match        https://myanimelist.net/character/*
// @exclude      https://myanimelist.net/character/*/*/*
// @match        https://myanimelist.net/character.php?id=*
// @license      GPL-2.0-or-later; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/18117/MyAnimeList%28MAL%29%20-%20Voice%20Actor%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/18117/MyAnimeList%28MAL%29%20-%20Voice%20Actor%20Filter.meta.js
// ==/UserScript==

var elementsVA,
	temp_deactivate_compressor = false,
    people = false,
    characters = false;

if (/http.*:\/\/myanimelist.net\/people\/\D*/.test(document.location.href)
   || /http.*:\/\/myanimelist.net\/people\.php\?id=\D*/.test(document.location.href)) {
    people = true;
    initPeople();
} else {
    characters = true;
    initCharacters();
}

// ==============================================
// ================= CHARACTERS =================
// ==============================================

function initCharacters() {
    $('div.normal_header, div.border_solid').each(function() {
        if ($(this).text().includes("Voice Actors")) {
            var anime = false;
            var languages = new Set();

            $(this).find('~ table').each(function() {
                if ($(this).has('table').length) {
                    anime = true;
                    $(this).find('table tr').each(function() {
                        prepareVAElement($(this), languages);
                    });
                } else if (!anime) {
                    prepareVAElement($(this), languages);
                }
            });

            addStyle($(this)[0]);

            createHrElement($(this)[0]);
            createLanguageCheckboxes(languages, $(this)[0]);
        }
    });
}

function prepareVAElement(element, languages) {
    var voiceActorLanguage = $(element).find('small').text().split(" ")[0].replace(/[^\w]/gi, '');

    $(element).addClass("VAElement");
    $(element).addClass(voiceActorLanguage);
    languages.add(voiceActorLanguage);
}

function createLanguageCheckboxes(languages, element) {
    for(var language of Array.from(languages).sort().reverse()) {
        var html = '<label>' + language + ': </label>' +
        '<input type="checkbox" class="checkbox" name="' + language + '" id="' + language + '" title="Show ' + language + ' Voice Actors" style="margin-right:10px;">';

        element.insertAdjacentHTML('afterend', html);

        var showLanguage = getSetting(language, true);
        $("#"+ language + "").prop("checked", showLanguage);
        startLanguageFilter(language, showLanguage);
    }
}

function startLanguageFilter(language, show) {
    $(".VAElement." + language).each(function(i) {
        $(this).toggle(show);
    });
}

// ==============================================
// =================== PEOPLE ===================
// ==============================================

function initPeople() {
	addCheckboxes();

    $(".navi-people-character > .btn-show-sort.js-btn-show-sort").hide();

	// preparing VA table for sorting and compressing
	$('table.js-table-people-character > tbody > tr:nth-child(n)').each(function(i) {
        var anime = encodeURIComponent($(this).find('.js-people-title')[0].textContent.trim());
		var char = encodeURIComponent($(this).find('td:nth-child(3) > div:nth-of-type(1)')[0].textContent.trim());
		var main = $(this).find('td:nth-child(3) > div:nth-of-type(2)')[0].textContent.trim();
        var popularity = $(this).find('.js-people-favorites')[0].textContent.split(" ")[0].trim();
		var recent = $(this).find('.entry-date')[0].textContent.trim();
		var reverse_recent = 99999999999999 - parseInt(recent);
		var reverse_popularity = 99999999999999 - parseInt(popularity);

        var sortData = '{"default":"' + anime + '","character":"' + char + '","popularity":"' + popularity + '","main":"' + main + anime + '","recent":"' + recent + '","main_char":"' + main + char + '","main_rec":"' + main + reverse_recent + '","main_pop":"' + main + reverse_popularity + '"}';
		$(this).attr("data-sort", sortData);
	});

	initElements(true);
	startFilter('default');
}

// backup elements
function initElements(init) {
	elementsVA = $('table.js-table-people-character > tbody > tr').not('.hidden-tr');
}

// core of the script, filtering
function startFilter(value) {
	switch (value) {
		case 'Sorter':
			if (temp_deactivate_compressor) {
				temp_deactivate_compressor = false;
				startFilter("Compressor");
			} else {
				sortVATable(getSetting('Sorter1'), getSetting('Sorter2'), getSetting('Sorter3'), getSetting('Sorter4'));
			}
			break;

		case 'Compressor':
            if (getSetting('Compressor')) {
                compressVATable(false);
                sortVATable(getSetting('Sorter1'), getSetting('Sorter2'), getSetting('Sorter3'), getSetting('Sorter4'));
                compressVATable(true);
            } else {
                compressVATable(false);
            }

            initElements(false);
            activateVAFilter(getSetting('VA'), getSetting('VA2'));
			reinitAddButtons();
			break;

        case 'VA':
            activateVAFilter(getSetting('VA'), getSetting('VA2'));
			break;

		default:
			sortVATable(getSetting('Sorter1'), getSetting('Sorter2'), getSetting('Sorter3'), getSetting('Sorter4'));
			compressVATable(getSetting('Compressor'));
			initElements(false);
			activateVAFilter(getSetting('VA'), getSetting('VA2'));
			reinitAddButtons();
			break;
	}
}

// Voice Actor roles filter
function activateVAFilter(conditionEdit, conditionAdd) {
    // var elements = $('table.VATable > tbody > tr').not('.hidden-tr');
	for (var i = 0; i < elementsVA.length; i++) {
		filterAddEdit(conditionEdit, conditionAdd, elementsVA[i]);
	}
}

function filterAddEdit(conditionEdit, conditionAdd, element) {
    $(element).find('a.Lightbox_AddEdit').each(function() {
        var type = $(this).attr('class');
        if (conditionEdit && type.indexOf('button_edit') > -1) {
            $(element).hide();
        } else if (conditionAdd && type.indexOf('button_add') > -1) {
            $(element).hide();
        } else {
            $(element).show();
            return false;
        }
    });
}

function compressVATable(condition) {
	var content = $('table.js-table-people-character > tbody');
	var listitems = content.children('tr').get();

	if (condition) { // compress
		var listid = [];
		for (var i = 0; i < listitems.length; i++) {
			listid.push(getCharacterId(listitems[i]));
		}
		for (var j = 0; j < listid.length; j++) {
			var hit = $.inArray(listid[j], listid);
			if (hit != j) {
				mergeVAElement(listitems[j], listitems[hit]);
			}
		}
	} else { // decompress
		for (var k = 0; k < listitems.length; k++) {
			var listitem = listitems[k];
			content = $(listitem).find('td:nth-child(2)')[0];
			if ($(listitem)[0].className.indexOf("hidden-tr") > -1) {
                $(content).find('.duplicateClass').removeClass("duplicateClass");
				$(listitem).removeClass("hidden-tr");
                $(listitem).show();
			} else if ($(content).find('.duplicateClass').length > 0) {
				$(content).find('.duplicateClass').remove();
				$(content).find(':hidden:not(.entry-date)').show();

                $(content).css("display", "");
                $(content).css("flex-flow", "");
                $(content).css("min-height", "");
                $(content).css("align-content", "");
                $(content).children().each(function() {
                    $(this).css("margin-right", "");
                });

				if ($(listitem).data("sort").main_orig === "Supporting") {
					$(listitem).find('td:nth-child(3) > div:nth-child(2)').text("Supporting");
					$(listitem).data("sort").main = "Supporting";
					$(listitem).data("sort").main_orig = "";
					$(listitem).data("sort").main_char = $(listitem).data("sort").main_char.replace("Main", "Supporting");
					$(listitem).data("sort").main_rec = $(listitem).data("sort").main_rec.replace("Main", "Supporting");
                    $(listitem).data("sort").main_pop = $(listitem).data("sort").main_pop.replace("Main", "Supporting");
				}
			}
		}
	}
}

function mergeVAElement(duplicate, element) {
    // Add duplicate class (easy removal later when decompressing)
    var duplicateContent = $(duplicate).find('td:nth-child(2)');
    $(duplicateContent).children().each(function() {
        $(this).addClass("duplicateClass");
    });

	var duplicateInfo = $(duplicateContent)[0].innerHTML;
	$(duplicate).addClass("hidden-tr");
	$(duplicate).hide();

    var content = $(element).find('td:nth-child(2)');

	// add info to element
	$(content)[0].innerHTML += '<div class="duplicateClass" style="width:100%"></div>' + duplicateInfo;

    // set info on one line
    $(content).css("display", "flex");
    $(content).css("flex-flow", "row wrap");
    $(content).css("min-height", "68px");
    $(content).css("align-content", "start");
    $(content).children().each(function() {
        $(this).css("margin-right", "8px");
    });

	// if character has one main role, change supporting to main
	if ($(element).data("sort").main.length > $(duplicate).data("sort").main.length) {
		$(element).find('td:nth-child(3) > div:nth-child(2)').text("Main");
		$(element).data("sort").main = "Main";
		$(element).data("sort").main_orig = "Supporting";
		$(element).data("sort").main_char = $(element).data("sort").main_char.replace("Supporting", "Main");
		$(element).data("sort").main_rec = $(element).data("sort").main_rec.replace("Supporting", "Main");
		$(element).data("sort").main_pop = $(element).data("sort").main_pop.replace("Supporting", "Main");
	}
}

// condition1 = sorter characters, condition2 = sorter main/supporting, condition 3 = most recent and condition 4 = popularity
function sortVATable(condition1, condition2, condition3, condition4) {
	var sortType;
	if (condition1 && condition2) {
		sortType = "main_char";
	} else if (condition2 && condition3) {
		sortType = "main_rec";
	} else if (condition4 && condition2) {
		sortType = "main_pop";
	} else if (condition1) {
		sortType = "char";
	} else if (condition2) {
		sortType = "main";
	} else if (condition3) {
		sortType = "recent";
	} else if (condition4) {
		sortType = "popularity";
	} else {
		sortType = "default";
	}

	var content = $('table.js-table-people-character > tbody');
	var listitems = content.children('tr').get();

	switch(sortType) {
		case 'main_char':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").main_char;
				var compB = $(b).data("sort").main_char;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (compA < compB) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

		case 'main_rec':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").main_rec;
				var compB = $(b).data("sort").main_rec;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (compA < compB) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

        case 'main_pop':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").main_pop;
				var compB = $(b).data("sort").main_pop;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (compA < compB) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

		case 'char':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").character;
				var compB = $(b).data("sort").character;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (compA < compB) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

		case 'main':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").main;
				var compB = $(b).data("sort").main;
				if (compA == compB) {
					return (parseInt($(a).data("sort").default) < parseInt($(b).data("sort").default)) ? -1 : 1;
				}
				return (compA < compB) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

		case 'recent':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").recent;
				var compB = $(b).data("sort").recent;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (parseInt(compA) > parseInt(compB)) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

        case 'popularity':
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").popularity;
				var compB = $(b).data("sort").popularity;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (parseInt(compA) > parseInt(compB)) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;

		default:
			listitems.sort(function(a, b) {
				var compA = $(a).data("sort").default;
				var compB = $(b).data("sort").default;
				if (compA == compB) {
					return (getAnimeId(a) < getAnimeId(b)) ? -1 : 1;
				}
				return (compA < compB) ? -1 : 1;
			});
			$.each(listitems, function(idx, itm) {
				$(content).append(itm);
			});
			break;
	}
}

function addCheckboxes() {
	var elements = document.getElementsByClassName('normal_header');

	if (elements[0].textContent.indexOf("Voice Acting Roles") >= 0) {
		elements[0].className += " VAHeader";

        var navi = $('.js-navi-people-character')[0];
        createCompactViewCheckbox(navi, "afterbegin");
        createVrLine(navi, "afterbegin");
		createSortCheckboxes(navi, "afterbegin");

        if (isLoggedIn()) {
            createVrLine(navi, "afterbegin");
            createAddEdit("VA", navi, "afterbegin");
        }
	}

	addStyle(elements[0]);
}

function addStyle(element) {
	var css = '<style>input[type="checkbox"] {margin: -1px 0 0 0;vertical-align: middle;}' +
		' a.vafilter_add, a.vafilter_edit {border: solid #000;border-width: 0.1em;padding: 1px 4px 1px 4px;background-color: #f6f6f6;font-size: 9px;}' +
		' span.vrline {border-left: solid #000;border-width: 0.1em;margin-left: 0.5em;margin-right: 0.5em;}</style>';

	element.insertAdjacentHTML('beforebegin', css);
}

function createHrElement(element, placement = 'afterend') {
	var html = '<hr style="border: #d8d8d8 1px solid;border-bottom: 0;">';
	element.insertAdjacentHTML(placement, html);
}

function createVrLine(element, placement = 'afterend') {
    var html = '<span class="vrline">';
    element.insertAdjacentHTML(placement, html);
}

function createAddEdit(type, element, placement = 'afterend') {
	var html = '<span>Hide: </span>' +
        '<label>On MyList </label>' +
        '<input type="checkbox" class="checkbox" name="' + type + '" id="' + type + '" title="Hide entries on your list">' +
        '<span> - </span>' +
        '<label>Not on MyList </label>' +
        '<input type="checkbox" class="checkbox" name="' + type + '" id="' + type + '2" title="Hide entries not on your list">';

    element.insertAdjacentHTML(placement, html);

	$("#"+ type + "").prop("checked", getSetting(type));
	$("#"+ type + "2").prop("checked", getSetting(type + "2"));
}

function createSortCheckboxes(element, placement = 'afterend') {
	var html = '</span><span>Sort by: </span>' +
		'<label>Character </label>' +
		'<input type="checkbox" class="checkbox" name="Sorter1" id="Sorter1" title="Sort by Character name">' +
		'<span> - </span>' +
        '<label>Popularity </label>' +
		'<input type="checkbox" class="checkbox" name="Sorter4" id="Sorter4" title="Sort by Popularity">' +
		'<span> - </span>' +
		'<label>Main/Supporting </label>' +
		'<input type="checkbox" class="checkbox" name="Sorter2" id="Sorter2" title="Sort by Main/Supporting">' +
		'<span> - </span>' +
		'<label>Most Recent </label>' +
		'<input type="checkbox" class="checkbox" name="Sorter3" id="Sorter3" title="Sort by Added to DB">';

	element.insertAdjacentHTML(placement, html);

	$("#Sorter1").prop("checked", getSetting("Sorter1"));
	$("#Sorter2").prop("checked", getSetting("Sorter2"));
	$("#Sorter3").prop("checked", getSetting("Sorter3"));
	$("#Sorter4").prop("checked", getSetting("Sorter4"));
}

function createCompactViewCheckbox(element, placement = 'afterend') {
	var html = '</span><span>Compressed view: </span>' +
		'<input type="checkbox" class="checkbox" name="Compressor" id="Compressor" title="Activate compressed view">';

	element.insertAdjacentHTML(placement, html);

	$("#Compressor").prop("checked", getSetting("Compressor"));
}

function reinitAddButtons() {
	$('.Lightbox_AddEdit').fancybox({
		'width'			: 700,
		'height'		: '85%',
		'overlayShow'	: false,
		'titleShow'     : false,
		'type'          : 'iframe'
	});
}

function isLoggedIn() {
    return document.querySelector('.header-profile-link') !== null;
}

// Save a setting of type = value (true or false)
function saveSetting(type, value) {
	GM_setValue('MALVA_' + type, value);
}

// Get a setting of type
function getSetting(type, notFoundValue) {
	var value = GM_getValue('MALVA_' + type);
	if (value !== undefined)
		return value;
	else
		return notFoundValue || false;
}

function getAnimeId(element) {
	return parseInt($(element).find('td:nth-child(2) a')[0].href.match(/\d+/g)[0]);
}

function getCharacterId(element) {
	return parseInt($(element).find('td:nth-child(3) a')[0].href.match(/\d+/g)[0]);
}

$("input:checkbox").on('click', function() {
	var $box = $(this);
	if ($box.is(":checked")) {
		var group = "input[name='" + $box.attr("name") + "']";
		$(group).each( function() {
			$(this).prop("checked", false);
			saveSetting($(this).attr('id'), false);
		});
		$box.prop("checked", true);
		saveSetting($box.attr('id'), true);
	} else {
		$box.prop("checked", false);
		saveSetting($box.attr('id'), false);
	}

    if ($box.attr("name").includes("Sorter") && !$box.attr("name").includes("Sorter2")) {
        temp_deactivate_compressor = getSetting("Compressor");

        $("#Sorter1").prop("checked", $box.attr("name").includes("Sorter1") && $box.is(":checked"));
        $("#Sorter3").prop("checked", $box.attr("name").includes("Sorter3") && $box.is(":checked"));
		$("#Sorter4").prop("checked", $box.attr("name").includes("Sorter4") && $box.is(":checked"));

        saveSetting("Sorter1", $box.attr("name").includes("Sorter1") && $box.is(":checked"));
		saveSetting("Sorter3", $box.attr("name").includes("Sorter3") && $box.is(":checked"));
		saveSetting("Sorter4", $box.attr("name").includes("Sorter4") && $box.is(":checked"));
    }

    if (people) {
        startFilter($box.attr('id').replace(/\d/g,''));
    } else if (characters) {
        startLanguageFilter($box.attr('id'), $box.is(":checked"));
    }
});
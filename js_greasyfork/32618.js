// ==UserScript==
// @name         MyAnimeList(MAL) - Random Anime/Manga/People & Characters (Beta)
// @version      1.3.7
// @description  Search for a random anime, manga, person or character
// @author       Cpt_mathix
// @match        *://myanimelist.net/*
// @exclude      *://myanimelist.net/animelist*
// @exclude      *://myanimelist.net/mangalist*
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @noframes
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/32618/MyAnimeList%28MAL%29%20-%20Random%20AnimeMangaPeople%20%20Characters%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32618/MyAnimeList%28MAL%29%20-%20Random%20AnimeMangaPeople%20%20Characters%20%28Beta%29.meta.js
// ==/UserScript==

var cancelling = false;
initScript();
initRandomSettingsPopup();
initSearchPopup();
injectCSS();

function initScript() {
	if (document.location.href.indexOf('hideLayout') === -1) {
		if (!document.getElementById('randAnime'))
			initAnimeDropdown();
		if (!document.getElementById('randManga'))
			initMangaDropdown();
		if (!document.getElementById('randPerson'))
			initPersonDropdown();
		if (!document.getElementById('randChar'))
			initCharacterDropdown();
	}

	if (getInfoFromUrl(document.location.href, "random") === "true") {
		var header_right = document.getElementsByClassName("header-right")[0];
		var media_type = getInfoFromUrl(document.location.href, "randomType");

		header_right.insertAdjacentHTML("afterbegin", ' - ');
		if (media_type === "anime" || media_type === "manga") {
			header_right.insertAdjacentHTML("afterbegin", ' (<a href="javascript:void(0);" id="newRandomSettings" class="js-anime-edit-info-button">Settings</a>)');
		}
		header_right.insertAdjacentHTML("afterbegin", '<a href="javascript:void(0);" id="newRandom" class="js-anime-edit-info-button">New Random</a>');

		document.getElementById("newRandom").addEventListener("click", function() {
			initSearching();
			switch(getInfoFromUrl(document.location.href, "randomType")) {
				case "anime":
					getRandomAnime();
					break;
				case "manga":
					getRandomManga();
					break;
				case "people":
					getRandomPeople();
					break;
				case "character":
					getRandomCharacter();
					break;
				default:
					alert("Something went wrong, sorry for the inconvenience");
					break;
			}
		});

		document.getElementById("newRandomSettings").addEventListener("click", function() {
			switch(getInfoFromUrl(document.location.href, "randomType")) {
				case "anime":
					showRandomSettingsPopup("Anime");
					break;
				case "manga":
					showRandomSettingsPopup("Manga");
					break;
				default:
					alert("Something went wrong, sorry for the inconvenience");
					break;
			}
		});
	}
}

function getInfoFromUrl(url, info) {
	if (url.indexOf('?') === -1)
		return null;

	var urlVariables = url.split('?')[1].split('&'),
		varName;

	for (var i = 0; i < urlVariables.length; i++) {
		varName = urlVariables[i].split('=');

		if (varName[0] === info) {
			return varName[1] === undefined ? null : varName[1];
		}
	}
}

// ** DROPDOWN ** //

function initAnimeDropdown() {
    var animeDropmenu = document.querySelector('#nav > li:nth-child(1) > ul');
    var newli1 = document.createElement('li');
	var html1 = "<a id=\"randAnimeSettings\" href=\"javascript:void(0)\" class=\"fa fa-cog cog-random\"></a><a id=\"randAnime\" href=\"javascript:void(0)\">Random Anime</a>";
    newli1.innerHTML = html1;
    animeDropmenu.insertBefore(newli1, document.querySelector('#nav > li:nth-child(1) > ul > li:nth-child(3)').nextSibling);
	document.getElementById("randAnime").addEventListener('click', function() {
		initSearching();
		getRandomAnime();
	});
	document.getElementById("randAnimeSettings").addEventListener("click", function() {
		showRandomSettingsPopup("Anime");
	});
}

function initMangaDropdown() {
    var mangaDropmenu = document.querySelector('#nav > li:nth-child(2) > ul');
    var newli2 = document.createElement('li');
    var html2 = "<a id=\"randMangaSettings\" href=\"javascript:void(0)\" class=\"fa fa-cog cog-random\"></a><a id=\"randManga\" href=\"javascript:void(0)\">Random Manga</a>";
    newli2.innerHTML = html2;
    mangaDropmenu.insertBefore(newli2, document.querySelector('#nav > li:nth-child(2) > ul > li:nth-child(2)').nextSibling);
	document.getElementById("randManga").addEventListener('click', function() {
		initSearching();
		getRandomManga();
	});
	document.getElementById("randMangaSettings").addEventListener("click", function() {
		showRandomSettingsPopup("Manga");
	});
}

function initPersonDropdown() {
    var industryDropmenu = document.querySelector('#nav > li:nth-child(4) > ul');
    var newli3 = document.createElement('li');
    var html3 = "<a id=\"randPerson\" href=\"javascript:void(0)\">Random Person</a>";
	newli3.innerHTML = html3;
	industryDropmenu.insertBefore(newli3, document.querySelector('#nav > li:nth-child(4) > ul > li:nth-child(3)').nextSibling);
	newli3.addEventListener('click', function() {
		initSearching();
		getRandomPeople();
	});
}

function initCharacterDropdown() {
	var industryDropmenu = document.querySelector('#nav > li:nth-child(4) > ul');
    var newli4 = document.createElement('li');
    var html4 = "<a id=\"randChar\" href=\"javascript:void(0)\">Random Character</a>";
    newli4.innerHTML = html4;
    industryDropmenu.appendChild(newli4);
	newli4.addEventListener('click', function() {
		initSearching();
		getRandomCharacter();
	});
}

// ** FIND RANDOM ** //

function getRandomAnime() {
	updateSearching();
	var r = Math.floor(Math.random() * 38000);
	$.get('/includes/ajax.inc.php?t=64&id=' + r, function(result) {
		if (result.length > 29 && isValidResult(result, "Anime")) {
			searchSuccess("Found random anime, redirecting...");
			document.location.href = '/anime/' + r  + '?random=true&randomType=anime';
		} else if (!cancelling) {
			getRandomAnime();
		}
	}).fail( function() {
		if (!cancelling) {
			getRandomAnime();
		}
	});
}

function getRandomManga() {
	updateSearching();
	var r = Math.floor(Math.random() * 120000);
	$.get('/includes/ajax.inc.php?t=65&id=' + r, function(result) {
		if (result.length > 0 && isValidResult(result, "Manga")) {
			searchSuccess("Found random manga, redirecting...");
			document.location.href = '/manga/' + r  + '?random=true&randomType=manga';
		} else if (!cancelling) {
			getRandomManga();
		}
	}).fail( function() {
		if (!cancelling) {
			getRandomManga();
		}
	});
}

function getRandomPeople() {
	updateSearching();
	var r = Math.floor(Math.random() * 50000);
	$.get('/people/' + r, function(result) {
		document.location.href = '/people/' + r + '?random=true&randomType=people';
	}).fail( function() {
		getRandomPeople();
	});
}

function getRandomCharacter() {
	updateSearching();
	var r = Math.floor(Math.random() * 160000);
	$.get('/character/' + r, function(result) {
		console.log($(result).find('#content > div.badresult'));
		if(!$(result).find('#content > div.badresult').length) {
			document.location.href = '/character/' + r + '?random=true&randomType=character';
		} else {
			getRandomCharacter();
		}
	}).fail( function() {
		getRandomCharacter();
	});
}

function isValidResult(result, media_type) {
	return isValidResultForData("Genres", result, media_type) && isValidResultForData("Type", result, media_type) && isValidResultForData("Status", result, media_type) ;
}

function isValidResultForData(data_type, result, media_type) {
	var _include = getSetting(data_type.toLowerCase() + "_include_" + media_type) || "";
	var _exclude = getSetting(data_type.toLowerCase() + "_exclude_" + media_type) || "";

	if (_include.lenght !== 0) {
		var include = _include.split(";");
		for (var i = 0; i < include.length; i++) {
			var reg_inc = new RegExp(data_type + ":.*" + include[i]);
			if (result.search(reg_inc) === -1) return false;
		}
	}
	if (_exclude.length !== 0) {
		var exclude = _exclude.split(";");
		for (var j = 0; j < exclude.length; j++) {
			var reg_exc = new RegExp(data_type + ":.*" + exclude[j]);
			if (result.search(reg_exc) > 0) return false;
		}
	}

	return true;
}

// ** SEARCHING ** //

function initSearching() {
	cancelling = false;
	$("#searchGrid").html('Searching: <span id="searchCounter">0</span>');
	$("#gmSearchContainer").show();
}

function updateSearching() {
	var counter = document.getElementById("searchCounter");
	if (counter) {
		var count = parseInt(counter.innerHTML);
		if (count > 200) {
			cancelSearching("Limit reached (Too Many Requests)! Please change your settings to be less specific...");
		} else {
			$(counter).html(count + 1);
		}
	}
}

function searchSuccess(text) {
	$("#searchGrid").html(text);
	$("#gmCancelSearchingButton").hide();
}

function cancelSearching(text) {
	cancelling = true;
	$("#searchGrid").html(text);
	$("#gmCancelSearchingButton").hide();
	$("#gmCloseSearchPopupButton").show();
}

// *** POPUP *** //

function initRandomSettingsPopup() {
	var popup_html = '';

	popup_html += '<div id="gmSettingsContainer" class="popup-container">';
	popup_html += '    <h1>Random <span id="settingsType"></span> Settings</h1>';
	popup_html += '    <h2>Type Filter</h2>';
	popup_html += '    <div id="typeGrid" class="filter-grid filter-grid-4"></div>';
	popup_html += '    <h2>Status Filter</h2>';
	popup_html += '    <div id="statusGrid" class="filter-grid filter-grid-3"></div>';
	popup_html += '    <h2>Genre Filter</h2>';
	popup_html += '    <div id="genresGrid" class="filter-grid filter-grid-4"></div>';
	popup_html += '    <div id="buttonsGrid">';
	popup_html += '        <button id="gmSubmitSettingsButton" type="button">Save Settings</button>';
	popup_html += '        <button id="gmCloseSettingsButton" type="button">Cancel</button>';
	popup_html += '    </div>';
	popup_html += '</div>';

	$("body").append(popup_html);

	$("#gmSubmitSettingsButton").click(function() {
		saveNewSettings("genres");
		saveNewSettings("type");
		saveNewSettings("status");

		$("#gmSettingsContainer").hide();
	});

	$("#gmCloseSettingsButton").click(function() {
		$("#gmSettingsContainer").hide();
	});
}

function saveNewSettings(data_type) {
	var include_str = "", exclude_str = "";

	var included = document.getElementsByClassName(data_type + "-filter selected");
	for (var i = 0; i < included.length; i++) {
		include_str += (i === included.length - 1) ? included[i].innerHTML.trim() : included[i].innerHTML.trim() + ";";
	}

	var excluded = document.getElementsByClassName(data_type  + "-filter crossed");
	for (var j = 0; j < excluded.length; j++) {
		exclude_str += (j === excluded.length - 1) ? excluded[j].innerHTML.trim() : excluded[j].innerHTML.trim() + ";";
	}

	saveSetting(data_type + "_include_" + $("#settingsType").html(), include_str);
	saveSetting(data_type + "_exclude_" + $("#settingsType").html(), exclude_str);
}

function showRandomSettingsPopup(media_type) {
	if (media_type == $("#settingsType").html()) {
		$("#gmSettingsContainer").show();
		return;
	}

	var genres = [], genres_code = [], genres_size = [], type = [], status = [];

	if (media_type == "Anime") {
		genres = ["Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi", "Fantasy", "Game", "Harem", "Hentai", "Historical", "Horror", "Josei", "Kids", "Magic",
				  "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen",
				  "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural", "Thriller", "Vampire", "Yaoi", "Yuri"];
		//genres_code = [1,2,3,4,5,6,8,9,10,11,35,12,13,14,43,15,16,17,18,38,19,7,20,39,40,22,21,23,24,42,25,26,27,28,36,29,30,31,37,41,32,33,34];
		//genres_size = [41,39,5,42,12,14,38,25,40,10,15,31,27,16,3,36,26,13,28,18,29,21,19,9,11,34,8,32,37,22,24,2,35,4,33,17,23,20,30,6,7,0,1];
		type = ["TV", "OVA", "Movie", "Special", "ONA", "Music"];
		status = ["Finished Airing", "Currently Airing", "Not yet aired"];
	} else {
		genres = ["Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Doujinshi", "Drama", "Ecchi", "Fantasy", "Game", "Gender Bender", "Harem", "Hentai", "Historical", "Horror", "Josei",
				  "Kids", "Magic", "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai",
				  "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural", "Thriller", "Vampire", "Yaoi", "Yuri"];
		//genres_code = [1,2,3,4,5,6,43,8,9,10,11,44,35,12,13,14,43,15,16,17,18,38,19,7,20,39,40,22,21,23,24,42,25,26,27,28,36,29,30,31,37,41,32,33,34];
		//genres_size = [37,28,0,43,1,14,24,38,30,39,9,21,27,42,25,23,31,2,19,15,16,12,8,26,6,7,20,44,3,41,29,36,40,17,33,22,32,4,18,11,35,5,10,34,13];
		//type = ["Manga", "Novel", "One-shot", "Doujinshi", "Manhwa", "Manhua"];
		status = ["Finished", "Publishing", "Not yet published"];
	}

	populateGrid("type", type);
	populateGrid("genres", genres);
	populateGrid("status", status);

	showCurrentSettings("type", media_type);
	showCurrentSettings("genres", media_type);
	showCurrentSettings("status", media_type);

	$(".filter-checkbox").click(function() {
		$(this).toggleClass(function() {
			if ($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				return "crossed";
			} else if ($(this).hasClass("crossed")) {
				return "crossed";
			} else {
				return "selected";
			}
		});
	});

	$("#settingsType").html(media_type);

	$("#gmSettingsContainer").show();
}

function populateGrid(data_type, data) {
	$("#" + data_type + "Grid").html(function() {
		var html = "";
		for (var i = 0; i < data.length; i++) {
			html += '<li class="' + data_type + '-filter filter-checkbox" id="' + data_type + '-' + data[i].replace(" ", "_") + '"> ' + data[i] + '</li>';
		}
		return html;
	});
}

function showCurrentSettings(data_type, media_type) {
	var _include = getSetting(data_type + "_include_" + media_type) || "";
	if (_include.lenght !== 0) {
		var include = _include.split(";");
		for (var i = 0; i < include.length; i++) {
			$("#" + data_type + "-" + include[i].replace(" ", "_")).toggleClass("selected");
		}
	}

	var _exclude = getSetting(data_type + "_exclude_" + media_type) || "";
	if (_exclude.length !== 0) {
		var exclude = _exclude.split(";");
		for (var j = 0; j < exclude.length; j++) {
			$("#" + data_type + "-" + exclude[j].replace(" ", "_")).toggleClass("crossed");
		}
	}
}

function initSearchPopup() {
	var popup_html = '';

	popup_html += '<div id="gmSearchContainer" class="popup-container">';
	popup_html += '    <div id="searchGrid"></div>';
	popup_html += '    <div id="buttonsGrid">';
	popup_html += '        <button id="gmCloseSearchPopupButton" type="button" style="display:none">Ok</button>';
	popup_html += '        <button id="gmCancelSearchingButton" type="button">Cancel</button>';
	popup_html += '    </div>';
	popup_html += '</div>';

	$("body").append(popup_html);

	$("#gmCloseSearchPopupButton").click(function() {
		$("#gmSearchContainer").hide();
		$("#gmCloseSearchPopupButton").hide();
		$("#gmCancelSearchingButton").show();
	});

	$("#gmCancelSearchingButton").click(function() {
		cancelSearching("User cancelled searching");
		$("#gmCancelSearchingButton").hide();
		$("#gmCloseSearchPopupButton").show();
	});
}

// *** LOCALSTORAGE *** //

function getSetting(key) {
	return JSON.parse(localStorage.getItem("Random#" + key));
}

function saveSetting(key, value) {
	localStorage.setItem("Random#" + key, JSON.stringify(value));
}

// *** CSS *** //

function injectCSS() {
	var css = `
.popup-container {
    display:                none;
    text-align:             left;
    position:               fixed;
    top:                    50%;
    left:                   50%;
    padding:                20px;
    background:             white;
    border:                 3px double black;
    border-radius:          1ex;
    z-index:                777;
   -ms-transform:           translate(-50%,-50%);
   -moz-transform:          translate(-50%,-50%);
   -webkit-transform:       translate(-50%,-50%);
    transform:              translate(-50%,-50%);
}
#gmSettingsContainer {
    padding:                20px 40px 20px 20px;
}
.filter-grid {
    padding-right:          35px;
    display:                grid;
}
.filter-grid-3 {
    grid-auto-columns:      33.33%;
    grid-template-areas:    "a a a";
    grid-column-gap:        30px;
}
.filter-grid-4 {
    grid-auto-columns:      25%;
    grid-template-areas:    "a a a a";
    grid-column-gap:        20px;
}
.filter-grid li {
    display:                block;
    background-image:       url(/images/icon_check_box.png?v=160803001);
    background-position:    0px -38px;
    background-repeat:      no-repeat;
    background-size:        12px auto;
    cursor:                 pointer;
    margin:                 1px 0;
    padding:                2px 0 4px 16px;
    clear:                  both;
}
.filter-grid li.selected {
    position:               relative;
}
.filter-grid li.crossed {
    position:               relative;
}
.filter-grid li.selected:after {
    background-image:       url(/images/icon_check_box.png?v=160803001);
    background-position:    -1px 3px;
    background-repeat:      no-repeat;
    background-size:        12px auto;
    content:                '';
    height:                 12px;
    left:                   0;
    position:               absolute;
    top:                    2px;
    width:                  12px;
}
.filter-grid li.crossed:after {
    background-image:       url(/images/icon_check_box.png?v=160803001);
    background-position:    0px -86px;
    background-repeat:      no-repeat;
    background-size:        12px auto;
    content:                '';
    position:               absolute;
    height:                 12px;
    left:                   0;
    position:               absolute;
    top:                    2px;
    width:                  12px;
}
#buttonsGrid {
    display:                flex;
    justify-content:        center;
}
#buttonsGrid button {
    margin:                 1em 1.5em 0 1.5em;
}
#searchGrid {
    font-size:              13px;
}
.cog-random {
    float:                  right;
    font-size:              14px !important;
    padding:                9px 7px 7px 2px !important;
}
`;

	var style = document.createElement("style");
	style.type = "text/css";
	if (style.styleSheet){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	document.documentElement.appendChild(style);
}

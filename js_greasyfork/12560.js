// ==UserScript==
// @name         MyAnimeList(MAL) - Extra
// @version      5.2.0
// @description  Show anime/manga info inside your animelist/mangalist
// @author       Cpt_mathix
// @match        *://myanimelist.net/animelist/*
// @match        *://myanimelist.net/mangalist/*
// @license      GPL-2.0-or-later
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/12560/MyAnimeList%28MAL%29%20-%20Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/12560/MyAnimeList%28MAL%29%20-%20Extra.meta.js
// ==/UserScript==

(function ($) {
	var store = (function () {
		var map = {};

		return {
			set: function (key, value) {
				map[key] = value;
			},
			get: function (key) {
				return map[key];
			}
		};
	})();

	var mal = {
		href: document.location.href,
		modern: false,
		user: '',
		type: []
	};

	init();

	function init() {
		mal.user = mal.href.match(/[^/]*?(?=\?|$)/)[0];

		if (mal.href.indexOf("mangalist") > -1) {
			mal.type = ["manga", 65];
		} else {
			mal.type = ["anime", 64];
		}

		mal.modern = $('.header .header-menu .btn-menu > .username').length > 0;

		if (mal.modern) {
			initGlobalScrollListener();
			try {
				setTimeout(initModernList, 1000);
			} catch (ex) {
				console.log(ex);
			}
		} else {
			initOldList();
		}
	}

	function initOldList() {
		$('#list_surround > table > tbody > tr > td[class*=td]:nth-child(2)').each(function () {
			var id = $(this).find('> a').attr('href').match(/\/(\d+)\//)[1];
			var tdtype = $(this).attr('class').match(/\d/)[0];
			var moreEl = $(this).find('> div > small > a:nth-child(2)');
			var memberId = $('#listUserId').val();
			var moreObject = $("#more" + id);

			$(moreEl).removeAttr('onclick');
			$(moreEl).attr("href", "javascript:;");
			$(moreEl).on('click', displayTable(id, tdtype, moreObject, memberId));
		});
	}

	function initModernList() {
		$('#list-container > div.list-block > div > table > tbody[class=list-item] > tr.list-table-data > td.data.title').each(function () {
			if ($(this).attr('id') === 'list-extra') {
				return true;
			} else {
				$(this).attr('id', 'list-extra');
			}
			var id = $(this).find('> a').attr('href').match(/\/(\d+)\//)[1];
			var moreEl = $(this).find('> div > span.more > a');
			var memberId = $('body')[0].dataset.ownerId;
			var moreObject = $("#more-" + id);

			var el = $(moreEl)[0],
				elClone = el.cloneNode(true);
			el.parentNode.replaceChild(elClone, el);
			$(elClone).attr("href", "javascript:;");
			$(elClone).on('click', displayTable(id, 1, moreObject, memberId));
		});
	}

	function initGlobalScrollListener() {
		document.addEventListener("scroll", function scroll(event) {
			// temporarily remove scroll listener to prevent multiple events
			event.currentTarget.removeEventListener(event.type, scroll);

			initModernList();

			setTimeout(function () {
				initGlobalScrollListener();
			}, 1000);
		});
	}

	//--------------------------------//
	//       Get Data Functions       //
	//--------------------------------//

	function getAnimeInfo(animeid, table) {
		var dataMap = store.get(animeid + 'MAP');

		$.get('/' + mal.type[0] + '/' + animeid, function (data) {
			$(data).find('#content .leftside > div.spaceit_pad:nth-child(n) > span:first-child').each(function () {
				var item = this.textContent.replace(/:/g, "");
				if (isNaN(item) && this.nextSibling) {
                    if (item == "Score") {
                        dataMap[item] = this.parentNode.querySelector('.score-label').textContent;
                    } else {
                        var props = this.parentNode.querySelectorAll('[itemprop]');
                        if (props.length > 0) {
                            dataMap[item] = [...props].map(prop => prop.nextElementSibling.outerHTML).join(", ");
                        } else if (this.nextSibling.textContent.trim() === "") {
                            dataMap[item] = this.nextElementSibling.outerHTML;
                        } else {
                            dataMap[item] = this.nextSibling.textContent;
                        }
                    }
				}
			});
			$(data).find('#content .rightside > table [itemprop=description]').each(function () {
				dataMap.Synopsis = this.innerHTML;
			});
			dataMap.Image = $(data).find("#content .leftside a > img").attr('data-src');

			table.innerHTML = displayAnimeInfo(animeid);

			if (mal.modern) {
				$(table).find('a').each(function () {
					$(this).hover(function () {
						$(this).css("text-decoration", "underline");
					}, function () {
						$(this).css("text-decoration", "none");
					});
				});
			}
		});
	}

	function getDataFromOriginalMore(preData, animeid) {
		var dataMap = store.get(animeid + 'MAP');

		// Time Spent Watching
		var start = preData.indexOf('Time Spent Watching');
		var end = preData.indexOf('<small>(');
		dataMap.TimeSpentWatching = preData.substring(start + 21, end);
		start = end;
		end = preData.indexOf('per episode');
		var episodeTime = preData.substring(start + 8, end);
		dataMap.EpisodeTime = episodeTime;
	}

	//--------------------------------//
	//     Display Data Functions     //
	//--------------------------------//

	function displayTable(animeid, tdtype, moreObject, memberId) {
		return function () {
			var table = $(moreObject).find('.td' + tdtype + '.borderRBL')[0];

			if (table && moreObject.hasClass("extraLoaded")) {
				if (moreObject.hasClass("extraShowing")) {
					table.innerHTML = store.get(animeid + 'Original');
					moreObject.toggleClass("extraShowing originalShowing");
				} else if (moreObject.hasClass("originalShowing")) {
					moreObject.removeClass("originalShowing");
					moreObject.hide();
				} else {
					table.innerHTML = displayAnimeInfo(animeid);
					moreObject.addClass("extraShowing");
					moreObject.show();
				}
			} else {
				$.post("/includes/ajax-no-auth.inc.php?t=6", { color: tdtype, id: animeid, memId: memberId, type: mal.type[0] }, function (data) {
					if (mal.modern) {
						moreObject.find(".more-content").html(data.html);
					} else {
						moreObject.html(data.html);
					}
					moreObject.show();
					moreObject.addClass("extraLoaded extraShowing");

					var table = $(moreObject).find('.td' + tdtype + '.borderRBL')[0];

					var dataMap = {};
					store.set(animeid + 'MAP', dataMap);
					store.set(animeid + 'Original', table.innerHTML);
					if (table !== null && mal.type[0] != "manga") {
						getDataFromOriginalMore(table.innerHTML, animeid);
						table.innerHTML = "Fetching data";
						getAnimeInfo(animeid, table);
					} else if (table !== null) {
						table.innerHTML = "Fetching data";
						getAnimeInfo(animeid, table);
					}
				}, "json");
			}
		};
	}

	function getDataValue(animeid, key) {
		var dataMap = store.get(animeid + 'MAP');
		return dataMap[key] || "Unavailable";
	}

    function getDataValues(animeid, key1, key2) {
		var dataMap = store.get(animeid + 'MAP');
		return dataMap[key1] || dataMap[key2] || "Unavailable";
	}

	function calcTimeNeeded(episodeTime, totalEpisodes) {
		if (totalEpisodes.trim() == "0" || totalEpisodes == "Unknown") {
			return 'Unknown';
		} else if (episodeTime.indexOf("0 hours, 0 minutes, and 0 seconds") > -1) {
			return 'Unknown';
		} else if (totalEpisodes.trim() == "1") {
			return episodeTime;
		} else {
			var str = episodeTime.split(' ');

			var totalSeconds = parseInt(str[5]) * totalEpisodes + (parseInt(str[2]) * totalEpisodes * 60) + (parseInt(str[0]) * totalEpisodes * 60 * 60);
			var seconds = totalSeconds % 60;
			var totalMinutes = Math.floor(totalSeconds / 60);
			var minutes = totalMinutes % 60;
			var hours = Math.floor(totalMinutes / 60);

			return hours + " hours, " + minutes + " minutes and " + seconds + " seconds";
		}
	}

	function displayAnimeInfo(animeid) {
		var episodes = getDataValue(animeid, 'Episodes');
		var chapters = getDataValue(animeid, 'Chapters');
		var volumes = getDataValue(animeid, 'Volumes');
		var image = getDataValue(animeid, "Image");
		var genres = getDataValues(animeid, 'Genre', 'Genres');
		var status = getDataValue(animeid, 'Status');
		var broadcast = getDataValue(animeid, 'Broadcast');
		var score = getDataValue(animeid, 'Score');
		var rank = getDataValue(animeid, 'Ranked');
		var popularity = getDataValue(animeid, 'Popularity');
		var studio = getDataValues(animeid, 'Studio', 'Studios');
		var source = getDataValue(animeid, 'Source');
		var premiered = getDataValue(animeid, 'Premiered');
		var aired = getDataValue(animeid, 'Aired');
		var published = getDataValue(animeid, 'Published');
		var type = getDataValue(animeid, 'Type');
		var demographic = getDataValues(animeid, 'Demographic', 'Demographics');
		var themes = getDataValues(animeid, 'Theme', 'Themes');

		var synopsis = getDataValue(animeid, 'Synopsis').replace(/\(Source.*[\s\S]*/g, "").replace(/\[.*\]/g, "").replace(/(<br>|\s+)*$/, "");

		var timeSpentWatching;
		var timeNeeded;
		if (mal.type[0] == "anime") {
			timeSpentWatching = getDataValue(animeid, 'TimeSpentWatching').replace("tes,", "tes");
			timeNeeded = '0';
			if (timeSpentWatching.indexOf("0 hours, 0 minutes and 0 seconds") > -1) {
				timeNeeded = calcTimeNeeded(getDataValue(animeid, 'EpisodeTime'), episodes);
			}
		}

        return `
<style>
.container {  display: grid;
  grid-template-columns: auto 1fr 1fr;
  grid-template-rows: min-content 1fr min-content;
  gap: 5px;
  grid-auto-flow: row;
  grid-template-areas:
    "image details genres"
    "image synopsis synopsis"
    "image discuss time";
}

.image { grid-area: image; }
.details { grid-area: details; }
.genres { grid-area: genres; text-align: right; }
.synopsis { grid-area: synopsis; padding: 5px 0; }
.discuss { grid-area: discuss; }
.time { grid-area: time; text-align: right; }
</style>

<div class="container">
  <div class="image">
    <img src="${image}">
  </div>
  <div class="details">
    ${(mal.type[0] == "anime") ? ("<b>Source: <\/b>" + source + "<br>") : ("<b>Type: <\/b>" + type + "<br>")}
    ${(status.indexOf("Currently Airing") > -1) ? ("<b>Broadcast: <\/b>" + broadcast + "<br>") : ("")}
    ${(mal.type[0] == "anime") ? ("<b>Episodes: <\/b>" + episodes + "<br>") : ("<b>Volumes: <\/b>" + volumes + "<br><b>Chapters: <\/b>" + chapters + "<br>")}
    <b>Score: </b>${score}<br>
    ${(studio.indexOf("add some") == -1 && mal.type[0] != "manga") ? ("<b>Studio: <\/b>" + studio + "<br>") : ("")}
    ${(mal.type[0] == "anime") ? (premiered != "Unavailable" ? ("<b>Premiered: <\/b>" + premiered + "<br>") : ("")) : ("")}
    ${(mal.type[0] == "anime") ? ("<b>Aired: <\/b>" + aired + "<br>") : ("<b>Published: <\/b>" + published + "<br>")}
    ${(themes !== "Unavailable") ? ("<b>Themes: <\/b>" + themes + "<br>") : ("")}
    ${(demographic !== "Unavailable") ? ("<b>Demographic: <\/b>" + demographic + "<br>") : ("")}
  </div>
  <div class="genres">${genres}</div>
  <div class="synopsis">${synopsis}</div>
  <div class="discuss">
    <a href="/forum/?${mal.type[0]}id=${animeid}" target="_blank">
      <small>Discuss ${mal.type[0].charAt(0).toUpperCase() + mal.type[0].slice(1)}</small>
    </a>
  </div>
  <div class="time">
    ${(mal.type[0] == "anime") ? ("<small>" + (timeNeeded == '0' ? ("<b>Time Spent Watching: <\/b>" + timeSpentWatching) : ("<b>Time To Complete: <\/b>" + timeNeeded)) + "<\/small><\/td>") : ("")}
  </div>
</div>
`;
	}
})(jQuery);
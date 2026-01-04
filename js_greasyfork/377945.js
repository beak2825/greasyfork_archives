// ==UserScript==
// @name           E-H Visited
// @description    Upgrade to EhxVisited (sleazyfork.org/en/scripts/377945)
// @author         Hen-Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        /https?:\/\/(e-|ex)hentai\.org\/.*/
// @exclude        https://e-hentai.org/toplist.php?tl=*
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @require        https://greasyfork.org/scripts/381436-gmshim/code/GMshim.js
// @grant          GM_setValue
// @grant          GM_getValue
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        3.17
// @downloadURL https://update.greasyfork.org/scripts/377945/E-H%20Visited.user.js
// @updateURL https://update.greasyfork.org/scripts/377945/E-H%20Visited.meta.js
// ==/UserScript==
// 2019 fork of exvisited (sleazyfork.org/en/scripts/22270)
// 2020 please upgrade to EhxVisited (sleazyfork.org/en/scripts/377945)
// will still fix bug reports: greasyfork.org/en/forum/post/discussion?script=377945

/*════════════════════╗
║    configuration    ║
╚════════════════════*/
// true: (default) adds column with eye icon in minimal/minimal+ views
// false: no added column or icons, hover on gallery title for timestamp
var minimalAddColumn = true;

// true: (minimalAddColumn must also be true) shows full timestamp text
// false: (default) shows eye icon, hover for timestamp
var minimalShowText = true;

// true: subtle reminder to backup data after every N visits
// false: (default) no reminders
var exportReminder = 100;
/*═══════════════════*/

var storageName = "ehVisited";
var sto = localStorage.getItem(storageName) ? localStorage.getItem(storageName) : '{"data":{}}';
var vis = JSON.parse(sto);
var spl = document.URL.split("/");
var d1 = spl[3];
var d2 = spl[4];
var d3 = spl[5];
var css = GM_getValue("css") ? GM_getValue("css") : "box-shadow: inset 0 0 0 500px rgba(2, 129, 255, .2) !important;"; //default highlight colour
var postInfiniteScroll = 0;
var observer = new MutationObserver(function () {
	// track galleries opened on-site
	$('a').on('mouseup', function () {
		var spl = this.href.split("/");
		var d1 = spl[3];
		var d2 = spl[4];
		var d3 = spl[5];

		if (d1 == "g") {
			var c = d2 + "." + d3;
			vis = JSON.parse(localStorage.getItem(storageName));
			vis.data[c] = Date.now();
			localStorage.setItem(storageName, JSON.stringify(vis));
		}
	});
	postInfiniteScroll = 1;
	ehvTimestamp();
});

vis.data = !vis.data ? Array() : vis.data; //necessary?

if (localStorage.getItem(storageName) === null) {
	localStorage.setItem(storageName, JSON.stringify(vis));
	console.log('Initializing localStorage item.');
}


// convert keywords to CSS
if (css === "initial") {
	css = "box-shadow: inset 0 0 0 500px rgba(2, 129, 255, .2) !important;";
} else if (css === "none") {
	css = "";
}

// localstorage unsupported warning
if (typeof (Storage) == "undefined") {
	alert("E-H Visited:\nYour browser does not support localStorage :(");
}

// get time difference in words
function timeDifference(current, previous, abbreviate) {
	var msPerMinute = 60 * 1000;
	var msPerHour = msPerMinute * 60;
	var msPerDay = msPerHour * 24;
	var msPerMonth = msPerDay * 30;
	var msPerYear = msPerDay * 365;
	var elapsed = current - previous;

	if (elapsed < msPerMinute) {
		return Math.round(elapsed / 1000) + ((typeof abbreviate !== 'undefined') ? '&nbsp;sec' : ' seconds ago');
	} else if (elapsed < msPerHour) {
		return Math.round(elapsed / msPerMinute) + ((typeof abbreviate !== 'undefined') ? '&nbsp;min' : ' minutes ago');
	} else if (elapsed < msPerDay) {
		return Math.round(elapsed / msPerHour) + ((typeof abbreviate !== 'undefined') ? '&nbsp;hrs' : ' hours ago');
	} else if (elapsed < msPerMonth) {
		return Math.round(elapsed / msPerDay) + ((typeof abbreviate !== 'undefined') ? '&nbsp;days' : ' days ago');
	} else if (elapsed < msPerYear) {
		return Math.round(elapsed / msPerMonth) + ((typeof abbreviate !== 'undefined') ? '&nbsp;mos' : ' months ago');
	} else {
		return Math.round(elapsed / msPerYear) + ((typeof abbreviate !== 'undefined') ? '&nbsp;yrs' : ' years ago');
	}
}

function ehvExport(message) {
	var data = "";
	for (var d in vis.data) {
		if (vis.data.hasOwnProperty(d)) {
			data += d + ":" + vis.data[d] + ";";
		}
	}
	if ($('.ehv-exported-data').length) {
		$('.ehv-exported-data').remove();
	}
	GM_setValue("archive", data);
	console.log("E-H Visited data:");
	console.log(GM_getValue("archive"));
	$('.ehv-controls').append('<ehv class="ehv-exported-data"><strong>' + message + '</strong><textarea class="ehv-exported-data-text">' + data + '</textarea><a class="ehv-exported-data-button cs" href="data:text,'+data+'" download="E-H Visited Data">Download Text File</a></ehv>');
}

function ehvTimestamp() {
	observer.disconnect();
	var list = $("table.itg>tbody>tr").has('.glhide, .gldown, th'); //present only in list views
	var thumb = $(".itg .gl1t"); //present only in thumbnail view
	var gid;
	var d;
	var galleryId;
	var onFavs = 0;

	// check current view
	if (list.length > 0) {
		if ($('.gl1e').length) { //extended
			if ($('h1').text() === "Favorites") {
				onFavs = 1;
			}
			for (var i = 0; i < list.length; i++) {
				gid = $(list[i]).find(".gl1e a").attr("href").split("/");
				galleryId = gid[4] + "." + gid[5];
				if ($(list[i])[0].children.length === 2 && onFavs) {
					$(list[i]).append('<td></td>');
				}
				if (vis.data[galleryId] != undefined) {
					d = new Date(vis.data[galleryId]);
					if (!$(list[i]).hasClass('ehv-visited')) {
						$(list[i]).addClass("ehv-visited");
						//check for fav pages
						if ($(list[i]).find('.gl3e').children('div').length >= 7) { //date favourited div is present
							$(list[i]).find('.gl3e > div:last-child').append("<br><ehv class='ehv-extended-favs'>\uD83D\uDC41" + timeDifference(Date.now(), vis.data[galleryId]) + "<br>" + d.getFullYear().toString() + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate() + " (" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ")</ehv>");
						} else {
							$(list[i]).find('.gl3e').append("<ehv class='ehv-extended'>\uD83D\uDC41" + timeDifference(Date.now(), vis.data[galleryId]) + "<br>" + d.getFullYear().toString() + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate() + " (" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ")</ehv>");
						}
					}
				}
			}
		} else if ($('.gl1c').length) { //compact
			var borderColour = $('.gl1c').first().css('border-top-color'); //border colour different between domains
			if (!postInfiniteScroll) {
				$('table.itg tbody>tr:first-child th:nth-child(2)').after('<th>Visited</th>');
			}
			if ($('h1').text() === "Favorites") {
				onFavs = 1;
			}
			for (i = 1; i < list.length; i++) {
				gid = $(list[i]).find(".glname a").attr("href").split("/");
				galleryId = gid[4] + "." + gid[5];
				if ($(list[i])[0].children.length === 4 || $(list[i])[0].children.length === 5 && onFavs) {
					if ($(list[i])[0].children.length === 4 && onFavs) {
						$(list[i]).append('<td></td>');
					}
					if (vis.data[galleryId] != undefined) {
						d = new Date(vis.data[galleryId]);
						$(list[i]).addClass("ehv-visited");
						$(list[i]).children('.gl2c').after('<td class="ehv-compact" style="border-color:' + borderColour + ';"><ehv>' + timeDifference(Date.now(), vis.data[galleryId], true) + "<br>(" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ')<br>' + d.getFullYear().toString().substr(2) + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate() + '</ehv></td>');
					} else {
						$(list[i]).children('.gl2c').after('<td class="ehv-compact" style="border-color:' + borderColour + ';"></td>');
					}
				}
			}
		} else { //minimal
			if (minimalAddColumn && !postInfiniteScroll) {
				$('table.itg tbody>tr:first-child th:nth-child(2)').after('<th title="E-H Visited: Hover for timestamps">\uD83D\uDC41</th>');
			}
			if ($('h1').text() === "Favorites") {
				onFavs = 1;
			}
			for (i = 1; i < list.length; i++) {
				gid = $(list[i]).find(".glname a").attr("href").split("/");
				galleryId = gid[4] + "." + gid[5];
				if ($(list[i])[0].children.length === 6 || $(list[i])[0].children.length === 7 && onFavs) {
					if ($(list[i])[0].children.length === 6 && onFavs) {
						$(list[i]).append('<td></td>');
					}
					if (minimalAddColumn) { //append viewed column
						if (vis.data[galleryId] != undefined) {
							d = new Date(vis.data[galleryId]);
							$(list[i]).addClass("ehv-visited");
							$(list[i]).children('.glname')[0].setAttribute("title", 'E-H Visited: ' + timeDifference(Date.now(), vis.data[galleryId]) + " (" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ") " + d.getFullYear().toString() + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate());
							if (minimalShowText) { //show text in appended column
								$(list[i]).children('.gl2m').after('<td class="ehv-minimal-text"><ehv>' + timeDifference(Date.now(), vis.data[galleryId], true) + "<br>(" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ')<br>' + d.getFullYear().toString().substr(2) + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate() + '</ehv></td>');
							} else { //show icon in appended column
								$(list[i]).children('.gl2m').after('<td class="ehv-minimal" title="E-H Visited: ' + timeDifference(Date.now(), vis.data[galleryId]) + " (" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ") " + d.getFullYear().toString() + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate() + '"><ehv>\uD83D\uDC41</ehv></td>');
							}
						} else { //not viewed
							$(list[i]).children('.gl2m').after('<td class="ehv-minimal"></td>');
						}
					} else { //append nothing, highlight only
						if (vis.data[galleryId] != undefined) {
							d = new Date(vis.data[galleryId]);
							$(list[i]).addClass("ehv-visited");
							$(list[i]).children('.glname')[0].setAttribute("title", 'E-H Visited: ' + timeDifference(Date.now(), vis.data[galleryId]) + " (" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ") " + d.getFullYear().toString() + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate());
						}
					}
				}
			}
		}
	} else if (thumb.length > 0) { //thumbnail
		for (i = 0; i < thumb.length; i++) {
			gid = $(thumb[i]).find(".gl3t a").attr("href").split("/");
			galleryId = gid[4] + "." + gid[5];
			if (!$(thumb[i]).hasClass('ehv-visited')) {
				if (vis.data[galleryId] != undefined) {
					d = new Date(vis.data[galleryId]);
					$(thumb[i]).addClass("ehv-visited");
					$(thumb[i]).children('.gl5t').after("<ehv class='ehv-thumbnail'>\uD83D\uDC41" + timeDifference(Date.now(), vis.data[galleryId]) + " (" + d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0') + ") " + d.getFullYear().toString() + "\u2011" + (d.getMonth() + 1) + "\u2011" + d.getDate() + "</ehv>");
				}
			}
		}
	} else {
		console.log("E-H Visited:\n	Something is wrong, I don't know what view mode this is!\n	Bug reports: greasyfork.org/en/forum/post/discussion?script=377945");
	}
	observer.observe($('.itg').get(0), {
		childList: true,
		subtree: true
	});
}

$(function () {
	var d = JSON.parse('{"data":{}}');

	// track galleries opened on-site
	$('a').on('mouseup', function () {
		var spl = this.href.split("/");
		var d1 = spl[3];
		var d2 = spl[4];
		var d3 = spl[5];

		if (d1 == "g") {
			var c = d2 + "." + d3;
			vis = JSON.parse(localStorage.getItem(storageName));
			vis.data[c] = Date.now();
			localStorage.setItem(storageName, JSON.stringify(vis));
		}
	});

	// track galleries opened indirectly (offsite link, shortcut file, context menu, bookmark, etc.)
	$(window).one('click scroll', function () {
		if (d1 == "g") {
			var c = d2 + "." + d3;
			vis = JSON.parse(localStorage.getItem(storageName));
			vis.data[c] = Date.now();
			localStorage.setItem(storageName, JSON.stringify(vis));
		}
	});
	if (/[?#ft]/.test(d1.substr(0, 1)) || /^watched/.test(d1) || /^uploader/.test(d1) || !d1) {
		var visitCount = Object.keys(vis.data).length;
		var ehvClearConfirm = 0;
		var controlsHTML = "<ehv class='ehv-controls'>Galleries visited: " + visitCount + " (<a href='javascript:;' class='ehv-import'>Import</a> / <a href='javascript:;' class='ehv-export'>Export</a> / <a href='javascript:;' class='ehv-merge'>Merge</a> / <a href='javascript:;' class='ehv-clear'>Clear</a> / <a href='javascript:;' class='ehv-css'>CSS</a>)</ehv>";
		if ($('body > img[src="https://exhentai.org/img/kokomade.jpg"]').length > 0) {
			$('body').prepend(controlsHTML);
		} else {
			$('#toppane').append(controlsHTML);
		}

		// show export alert during first 5 of every 100 gallery visits
		if (visitCount % 100 >= 0 && visitCount % 100 <= 5) {
			$('.ehv-export').css({'background':'rgba(2, 129, 255, .3)','box-shadow':'0 0 0 2px rgba(2, 129, 255, .3)'});
		}

		$(".ehv-import").click(function () {
			var c = prompt("E-H Visited:\nPaste here to import, and overwrite current data.");
			if (c) {
				var sp = c.split(";");
				//sp = sp.filter(Boolean);
				for (var k in sp) {
					if (sp.hasOwnProperty(k)) {
						var s = sp[k].split(":");
						d.data[s[0]] = parseInt(s[1]);
					}
				}
				localStorage.setItem(storageName, JSON.stringify(d));
				console.log(d);
				alert("E-H Visited:\nImported " + Object.keys(d.data).length + " entries.");
				location.reload();
			}
		});

		$(".ehv-export").click(function () {
			ehvExport('Exported entries:');
		});

		$(".ehv-css").click(function () {
			var c = prompt("E-H Visited:\nThis CSS is applied to visited galleries.\n('initial' to reset, or 'none' for no styling)", css);
			if (c) {
				GM_setValue("css", c);
				location.reload();
			}
		});

		$(".ehv-merge").click(function () {
			var c = prompt("E-H Visited:\nPaste here to import, and merge with current data.");
			if (c) {
				var sp = c.split(";");
				sp = sp.filter(Boolean);
				for (var k in sp) {
					if (sp.hasOwnProperty(k)) {
						var s = sp[k].split(":");
						d.data[s[0]] = parseInt(s[1]);
					}
				}
				for (var i = 0; i < Object.keys(vis.data).length; i++) {
					d.data[Object.keys(vis.data)[i]] = vis.data[Object.keys(vis.data)[i]];
				}
				alert("E-H Visited\nMerged data, " + Object.keys(d.data).length + " unique entries.");
				localStorage.setItem(storageName, JSON.stringify(d));
				location.reload();
			}
		});

		$(".ehv-clear").click(function () {
			if (!ehvClearConfirm) {
				ehvClearConfirm = 1;
				$('.ehv-clear').append(': Are you sure?');
				ehvExport('Backup your current data:');
			} else {
				alert("E-H Visited:\nCleared all entries.");
				localStorage.removeItem(storageName);
				location.reload();
			}
		});

		// append icon friendly fonts to the calculated font stack
		var inheritFonts = $('body').css('font-family') + ', "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", symbola';
		$(`<style data-jqstyle='ehVisited'>
ehv { font-family:` + inheritFonts + ` }
.gl2c { width: 115px; }
.ehv-visited .gl3e { min-height: 206px; }
.ehv-visited .gl4e { min-height: 264px !important; }
.ehv-exported-data { display: block; }
.ehv-exported-data-text { display: block; margin: 0 auto; height: 5em; width: 50vw; padding: .25em; }
.ehv-exported-data-button { padding: 0 1em; width:unset; text-decoration:none; background:#777777; margin-top:.5em; }
.ehv-minimal-text { text-align: center; display: block; }
.ehv-compact { border-style: solid; border-width: 1px 0; text-align: center; }
.ehv-extended { width: 120px; position: absolute; left: 3px; top: 172px; text-align: center; font-size: 8pt; line-height: 1.5; }
.ehv-extended-favs { padding: 3px 1px; display: block; line-height: 1.5; }
.ehv-thumbnail { display: block; text-align: center; margin: 3px 0 5px; line-height: 12px; }
.ehv-controls { padding: 3px 1px; text-align: center; display: block; }
table.itg > tbody > tr.ehv-visited, .gl1t.ehv-visited { ` + css + ` }
</style>`).appendTo("head");

		ehvTimestamp();
	}
});
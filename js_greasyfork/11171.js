// ==UserScript==
// @name		Calibro
// @namespace   CalibroNS
// @description Looks for torrents for books in Calibre
// @include	 about:blank?calibro
// @include	 */calibro.html
// @version	 1.1.4
// @grant	 GM_xmlhttpRequest
// @grant	 GM_setValue
// @grant	 GM_getValue
// @grant    GM_addStyle
// @require	 https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/floatthead/1.2.13/jquery.floatThead.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/jquery.serializeJSON/2.6.1/jquery.serializejson.min.js
// @require	 https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.5/js/bootstrap.min.js
// @downloadURL https://update.greasyfork.org/scripts/11171/Calibro.user.js
// @updateURL https://update.greasyfork.org/scripts/11171/Calibro.meta.js
// ==/UserScript==

var userAgent = "Calibro/1.1.3 (https://greasyfork.org/en/scripts/11171-calibro)";

// Case insensitive $.contains
$.extend($.expr[":"], {
	"icontains": function(elem, i, match, array) {
		return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
	}
});

var Calibro = function() {

	var instance = this;

	this.calibreServer = 'http://' + GM_getValue("calibreServer", "localhost:8080");

	// Prevents cached response after switching to another library
	this.apiIds = this.calibreServer + '/ajax/search?num=' + Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;

	this.apiBooks = this.calibreServer + '/ajax/books?ids=';

	this.timeout = 10000;

	this.authorStoplist = [
		'Unknown',
		'Publish',
		'Неизв',
		'American',
		'Press',
		'Oxford'
	];

	this.authorlessTitles = [
		'Encyclopedia',
		'Dictionary'
	];

	this.bookFormats = [
		'pdf',
		'epub',
		'mobi',
		'azw3',
		'djvu',
		'chm'
	];

	var defaultConfig = {
		show_covers: true,
		edition_column: 'edition',
		sources: {
			BiB: false,
			WCD:  false,
			bB: false,
			MAM: false,
			TGZ: false,
			WFL: false,
			BM: false,
			RuTracker: false,
			Genesis: false,
			AvaxHome: false
		}
	};

	this.config = $.extend(true, defaultConfig, JSON.parse(GM_getValue("config", "{\"sources\":{\"Genesis\":true,\"AvaxHome\":true}}")));

	this.sources = {};
	this.sourceIds = [];
	this.domains = {};
	this.bookIds = [];

	this.notification = $('<div id="notification" class="alert alert-info"></div>');

	this.run = function()
	{
		instance.sourceIds = Object.keys(instance.sources);

		$(document.head).html("<meta charset=\"utf-8\"><title>Calibro</title>");

		$('<link rel="stylesheet" type="text/css">')
			.appendTo(document.head)
			// Waits for Bootstrap
			.attr('href', 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css').load(function() {

				GM_addStyle("h5 { margin-top:0; } \
table {margin:0 auto;} \
thead { background-color:#f6f6f6; } \
th { font-weight:normal; font-size: 80%; } \
td {font-size:70%;width:100px !important; background-repeat:no-repeat; background-position: 95% 8px; } \
td:first-child {width:150px !important; background-repeat:no-repeat; background-position: right top; } \
td:first-child:hover { cursor:pointer; color:#c00; } \
.seeded { background-color: #CCFFCC; } \
.ajax { background-color: #FFFFE0; }");

				$(document.body).html("").append(instance.notification);

				$(requestIds);
			});
	};

	this.registerSource = function(id, src, domain) {
		if (instance.config.sources[id]) {
			instance.sources[id] = src;
			if (typeof domain === 'string') {
				instance.domains[id] = domain;
			}
		}
		return instance;
	};

	var requestIds = function()
	{
		instance.notification.text('Connecting to the Calibre content server ('+instance.calibreServer.replace('http://', '')+')...');

		GM_xmlhttpRequest({
			method: 'GET',
			url: instance.apiIds,
			onload: requestBooks,
			onerror: setCustomCalibreServer,
			ontimeout: setCustomCalibreServer
		});
	};

	var requestBooks = function(response)
	{
		instance.bookIds = JSON.parse(response.responseText).book_ids;

		instance.notification.text(instance.bookIds.length + ' books found, loading metadata...');

		GM_xmlhttpRequest({
			method: 'GET',
			url: instance.apiBooks + instance.bookIds.join(','),
			onload: renderTable
		});
	};

	var renderTable = function(response)
	{
		instance.notification.text('Preparing data...');

		var i, n, row, files, filedata, size, currsize, book;

		var tbody = $('<tbody></tbody>');

		var books = JSON.parse(response.responseText);

		for (i in instance.bookIds) {

			book = books[instance.bookIds[i]];

            if (!book) continue;

			files = [];
			filedata = {};
			for (var format in book.format_metadata) {
				currsize = book.format_metadata[format].size;
				size = parseInt(currsize) / 1024;
				size = size < 1024 ? size.toFixed(2) + ' KB' : (parseInt(currsize) / (1024 * 1024)).toFixed(2) + ' MB';
				files.push('<a href="' + instance.calibreServer + '/get/' + format + '/' + instance.bookIds[i] + '"><b>' + format.toUpperCase() + '</b> ' + size + '</a>');
				filedata[format.toUpperCase()] = size;
			}

			row = $('<tr></tr>')
				.data('filedata', filedata)
				.data('book', book);

			edition = (instance.config.edition_column.length > 0 && '#' + instance.config.edition_column in book.user_metadata && parseInt(book.user_metadata['#' + instance.config.edition_column]['#value#']) > 1) ? ' (' + book.user_metadata['#' + instance.config.edition_column]['#value#'] + 'ed)' : '';

			row.append('<td contenteditable="true">' + book.title + edition + '</td><td>' + files.join('<br>') + '</td>');

			for (n in instance.sourceIds) {
				if (instance.sourceIds[n] in instance.domains && "bt" + instance.domains[instance.sourceIds[n]] in book.identifiers) {
					row.append('<td class="seeded"></td>');
				} else {
					row.append('<td></td>');
				}
			}

			row.appendTo(tbody);
		}

		$("td:first-child", tbody).on("click", clickEvent);

		var tbl = '<table class="table table-bordered table-striped main">';
		tbl += '<thead><tr><th><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#settings">Settings</button></th><th>Calibre</th>';
		for (i in instance.sourceIds) {
			tbl += '<th>' + instance.sourceIds[i] + '</th>';
		}
		tbl += '</tr></thead></table>';

		tbl = $(tbl).append(tbody);

		instance.notification.replaceWith(tbl);

		tbl.floatThead();

		var source_checkboxes = '';
		for (i in instance.config.sources) {
			source_checkboxes += '<div class=\"checkbox\"><label><input type=\"checkbox\" name=\"sources['+i+']\" value=\"true\" "'+(instance.config.sources[i] ? " checked" : "")+'> '+i+'</label></div>';
		}

		var configForm = $("<form class=\"modal\" id=\"settings\" tabindex=\"-1\">\
<div class=\"modal-dialog modal-sm\">\
<div class=\"modal-content\">\
<div class=\"modal-header\">\
<button type=\"button\" class=\"close\" data-dismiss=\"modal\"><span>&times;</span></button>\
<h4 class=\"modal-title\">Settings</h4>\
</div>\
<div class=\"modal-body\">\
<div class=\"form-group\" style=\"margin-bottom:-5px\"><label>Choose sources:</label></div>" + source_checkboxes + "\
<div class=\"form-group\"><label>Edition # column (optional)</label><input class=\"form-control\" name=\"edition_column\" value=\""+instance.config.edition_column.replace(/\"/g, "&quot;")+"\"></div>\
<div class=\"checkbox\"><label><input type=\"checkbox\" name=\"show_covers\" value=\"true\""+(instance.config.show_covers ? " checked" : "")+"> Show covers</label></div>\
</div>\
<div class=\"modal-footer\">\
<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\
<button type=\"button\" class=\"btn btn-primary\">Save & refresh</button>\
</div>\
</div>\
</div>\
</form>");

		$("button:last", configForm).on("click", function(){
			var data = $.extend({show_covers:false}, configForm.serializeJSON());
			GM_setValue("config", JSON.stringify(data));
			document.location.reload();
		});

		configForm.appendTo(document.body);
	};

	var clickEvent = function(event)
	{
		var i;
		var titleCell = $(event.target);
		var row = titleCell.parent();
		var book = row.data("book");

		var title = titleCell.text().trim();
		title = title.split(':')[0].replace(/[\ ]+/g, ' ').split(' ').length > 1 ? title.split(':')[0] : title;
		title = title.split('(')[0].replace(/[\ ]+/g, ' ').split(' ').length > 1 ? title.split('(')[0] : title;
		title = title.split(' Vol.')[0].split(' Volume')[0].replace(/^(A|An|The) /, '').replace(/[\-\–]+/g, ' ').replace(/[\ ]+/g, ' ');
		title = title.replace(/ \(\d+ed\)/, '')
		title = title.trim();
		book.searchTitle = title;

		book.wordCount = title.replace(/\ (a|an|the|and|&|of|in|on|\+)\ /ig, ' ').replace(/[\ ]+/g, ' ').split(' ').length;

		if (book.wordCount < 3) {
			if (!("searchAuthor" in book)) {
				book.searchAuthor = book.authors.length > 0 ? book.authors[0].replace(/\(ed\)/ig, '').replace(/[\ ]+/g, ' ').split(' ').pop() + ' ' : '';

				for (i in instance.authorStoplist) {
					if (book.searchAuthor.indexOf(instance.authorStoplist[i]) > -1) {
						book.searchAuthor = '';
						break;
					}
				}

				if (book.searchAuthor !== '') {
					for (i in instance.authorlessTitles) {
						if (book.title.indexOf(instance.authorlessTitles[i]) > -1) {
							book.searchAuthor = '';
							break;
						}
					}
				}
			}
		} else {
			book.searchAuthor = '';
		}

		if (instance.config.show_covers) {
			titleCell.css("padding-right", "70px").css("backgroundImage", "url(" + instance.calibreServer + book.thumbnail + ")");
		}

		$("td:gt(1)", row).each(performRequest);
	};

	var performRequest = function () {
		var ajax, cell = $(this);
		var book = cell.parent().data("book");
		var pos = cell.index() - 2;
		var source = instance.sources[instance.sourceIds[pos]];

		ajax = $.extend({
			method: 'GET',
			timeout: instance.timeout,
			context: this,
            headers: {
                "User-Agent": userAgent
            },
			onerror: function (r) {
				var label = $("<a class=\"label label-danger\">Error! Retry?</a>")
					.on("click", function () {
						cell.html("");
						GM_xmlhttpRequest(ajax);
					});
				cell
					.removeClass("ajax")
					.html("")
					.append(label, " <a class=\"label label-info\" href=\""+ajax.url+"\" target=\"_blank\">Go &rarr;</a>");
			},
			onreadystatechange:function(r){
				r.readyState === 4 ? cell.removeClass("ajax") : cell.addClass("ajax");
			},
			ontimeout: function (r) {
				var label = $("<a class=\"label label-danger\">Timeout! Retry?</a>")
					.on("click", function () {
						cell.html("");
						ajax.timeout += instance.timeout;
						GM_xmlhttpRequest(ajax);
					});
				cell
					.removeClass("ajax")
					.html("")
					.append(label, " <a class=\"label label-info\" href=\""+ajax.url+"\" target=\"_blank\">Go &rarr;</a>");
			}
		}, source);

		if (typeof ajax.url === 'string') {
			ajax.url += encodeURIComponent(book.searchTitle);
		} else {
			ajax.url = ajax.url(book);
		}

		GM_xmlhttpRequest(ajax);
	};

	this.checkAuth = function(response) {
		if (response.finalUrl.indexOf("/login") > -1 || (response.finalUrl.indexOf("thegeeks.bz") > -1 && response.responseText.indexOf("<title>404 - Not Found</title>") > -1)) {
			$(response.context).html("<a class=\"label label-warning\" href=\"" + response.finalUrl + "\" target=\"_blank\">Login</a>");
			return false;
		}
		return true;
	};

	this.prepareHTML = function(text) {
		return text.replace(/<img /g, '<meta ');
	};

	var setCustomCalibreServer = function()
	{
		var form = $('<form class="form-inline" style="display:inline;margin:0"><input class="form-control input-sm" placeholder="localhost:8080" style="width:200px;"></form>');

		form.on("submit", function(){
			var value = $('input', this).first().val().trim();
			if (value.length === 0) {
				alert('Please, set a correct value.');
				return false;
			}
			GM_setValue("calibreServer", value);
			document.location.reload();
			return false;
		});

		instance.notification.append('<br>Make sure the server is running. Using different host? Set it here: http://', form);
	};
};


var app = new Calibro();

app.registerSource("BiB", {
	url: function (book) {
		var authors = book.searchAuthor.length > 0 ? '@authors ' + book.searchAuthor : '';
		var title = book.searchTitle.replace(/\!/g, '');
		return 'https://bibliotik.me/torrents/?cat[]=5&search=' + encodeURIComponent(authors + '@title ' + title);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var html = $(app.prepareHTML(response.responseText));
		var filedata = cell.parent().data('filedata');
		var torrents = $('tr.torrent', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">BiB (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var format = $('.torFormat', this).first().text().replace(/[\[\]]/g, '').trim();
			var retail = $('.torRetail', this).length ? $('.torRetail', this).first().text().trim().replace('[Retail]', '<b>[R]</b> ') : '';

			$('time', this).remove();
			var size = $('td', this).eq(4).text().split(',');
			size.shift();
			size = size.join("").trim();

			var href = $('a', this).first().attr('href');
			var dl = $('td', this).eq(2).find('a').first().attr('href');
			var dl_link = $('<a href="https://bibliotik.me' + dl + '"><b>' + format + '</b> ' + retail + size + '</a>');

			if (filedata.hasOwnProperty(format) && filedata[format] == size) {
				dl_link.css('color', '#c00');
			}

			$('.taglist', this).remove();

			var linkTitle = $('td', this).eq(1).text().trim();

			cell.append(
				dl_link, ' ',
				$('<a href="https://bibliotik.me' + href + '" target="_blank">&rarr;</a>').attr("title", linkTitle).tooltip(),
				'<br>'
			);
		});
	}
}, "bibliotik");

app.registerSource("WCD", {
	url: function (book) {
		return 'https://what.cd/torrents.php?order_by=time&order_way=desc&group_results=1&filter_cat[3]=1&action=advanced&searchsubmit=1&groupname=' + encodeURIComponent(book.searchAuthor + book.searchTitle);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var html = $(app.prepareHTML(response.responseText).replace(/href=\"([a-z]+)/gi, 'href="https://what.cd/$1'));
		var filedata = cell.parent().data('filedata');
		var filekeys = Object.keys(filedata);
		var torrents = $('tr.torrent', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">WCD (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var i;
			var link = $('a[href*="&torrentid"]', this).first();
			var title = link.text().trim();
			var href = link.attr('href');
			var dl = $('a[href*="action=download"]', this).first().attr('href');
			var size = $('td', this).eq(5).text().replace(/,/g, '').trim();
			var formats = [];
			var tags = $('.tags', this).first().text();

			for (i in app.bookFormats) {
				if (tags.indexOf(app.bookFormats[i]) > -1) {
					formats.push(app.bookFormats[i].toUpperCase());
					break;
				}
			}

			var dl_link = $('<a href="' + dl + '"><b>' + formats.join() + '</b> ' + size + '</a>');

			for (i in filekeys) {
				if (filedata[filekeys[i]] == size) {
					dl_link.css('color', '#c00');
					break;
				}
			}

			cell.append(
				dl_link, ' ',
				$('<a href="' + href + '" target="_blank">&rarr;</a>').attr("title", title).tooltip(),
				'<br>'
			);
		});
	}
}, "what");

app.registerSource("bB", {
	url: function (book) {
		return 'https://baconbits.org/torrents.php?action=simple&filter_cat[3]=1&searchstr=' + encodeURIComponent(book.searchAuthor + book.searchTitle);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var filedata = cell.parent().data('filedata');
		var html = $(app.prepareHTML(response.responseText).replace(/href="([a-z]+)/gi, 'href="https://baconbits.org/$1'));
		var torrents = $('tr.torrent', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">bB (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var link = $('a', this).eq(3);
			var title = link.text().trim();
			var href = link.attr('href');
			var dl = $('a', this).eq(1).attr('href');
			var size = $('td', this).eq(4).text().replace(/,/g, '').trim();
			var text = $('td', this).eq(1).text().trim();
			var format = text.split('[') [2].split(']') [0].split(' / ') [0].trim();
			var retail = text.indexOf(' Retail!') > -1 ? ' <b>[R]</b> ' : '';

			var dl_link = $('<a href="' + dl + '"><b>' + format + '</b> ' + retail + size + '</a>');

			if (filedata.hasOwnProperty(format) && filedata[format] == size) {
				dl_link.css('color', '#c00');
			}

			var td = $('td', this).eq(1);
			$('.tags', td).remove();
			$('span:eq(0)', td).remove();

			cell.append(
				dl_link, ' ',
				$('<a href="' + href + '" target="_blank">&rarr;</a>').attr("title", td.text().trim()).tooltip(),
				'<br>'
			);
		});
	}
}, "baconbits");

app.registerSource("MAM", {
	url: function (book) {
		var query = book.searchAuthor + '"' + book.searchTitle + '"';
		return 'https://www.myanonamouse.net/tor/js/loadSearch.php?tor[srchIn]=3&tor[fullTextType]=old&tor[author]=&tor[series]=&tor[narrator]=&tor[searchType]=all&tor[searchIn]=torrents&tor[hash]=&tor[sortType]=default&tor[startNumber]=0&tor[cat][]=60&tor[cat][]=71&tor[cat][]=72&tor[cat][]=90&tor[cat][]=61&tor[cat][]=73&tor[cat][]=101&tor[cat][]=62&tor[cat][]=63&tor[cat][]=107&tor[cat][]=64&tor[cat][]=74&tor[cat][]=102&tor[cat][]=76&tor[cat][]=77&tor[cat][]=65&tor[cat][]=103&tor[cat][]=115&tor[cat][]=91&tor[cat][]=66&tor[cat][]=78&tor[cat][]=138&tor[cat][]=67&tor[cat][]=79&tor[cat][]=80&tor[cat][]=92&tor[cat][]=118&tor[cat][]=94&tor[cat][]=120&tor[cat][]=95&tor[cat][]=81&tor[cat][]=82&tor[cat][]=68&tor[cat][]=69&tor[cat][]=75&tor[cat][]=96&tor[cat][]=104&tor[cat][]=109&tor[cat][]=70&tor[cat][]=112&tor[cat][]=0&tor[text]=' + encodeURIComponent(query);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var row = cell.parent();
		var filedata = row.data('filedata');
		var filekeys = Object.keys(filedata);
		var html = $(app.prepareHTML(response.responseText).replace(/href="\//gi, 'href="https://www.myanonamouse.net/'));

		var title = row.data('book').title.replace(/^(A|An|The)\ /, '').split(':')[0].split('(')[0].split('[')[0].split(' - ')[0].split(',')[0].trim().replace(/\"/g, '\"').slice(0, 20);
		var torrents = row.data('book').formats.length > 0 ? $('tr:not(:eq(0)):not(:contains("GB")):icontains("' + title + '")', html) : $('tr:not(:eq(0))', html);

		cell.html('<h5><a href="' + response.finalUrl.replace('/js/loadSearch.php', '/browse.php') + '" target="_blank">MAM (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var i;
			$('td', this).eq(4).find('a').remove();
			var link = $('td', this).eq(2).find('a').first();
			var title = link.text().trim();
			var href = link.attr('href');
			var dl = $('td', this).eq(3).find('a').first().attr('href');
			var size = $('td', this).eq(4).text().trim().replace(/[\[\]]/g, '');
			var desc = $('td', this).eq(2).find('.torRowDesc').first();
			desc = desc.length > 0 ? desc.text().trim() : '';

			var dl_link = $('<a href="' + dl + '"><nobr>' + size + '</nobr></a>');

			for (i in filekeys) {
				if (parseFloat(filedata[filekeys[i]]).toFixed(1) == parseFloat(size)) {
					dl_link.css('color', '#c00');
					break;
				}
			}

			cell.append(
				'<a href="' + href + '" target="_blank">' + title + '</a><br>' + desc + ' ',
				dl_link, '<br><br>'
			);
		});
	}
}, "myanonamouse");

app.registerSource("WFL", {
	url: function (book) {
		return 'https://waffles.ch/browse.php?c86=1&c87=1&q=' + encodeURIComponent(book.searchAuthor + book.searchTitle);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var filedata = cell.parent().data('filedata');
		var filekeys = Object.keys(filedata);
		var html = $(app.prepareHTML(response.responseText).replace(/href="\//gi, 'href="https://waffles.ch/'));
		var torrents = $('#browsetable tr:not(:eq(0))', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">WFL (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var i;
			var href = $('a', this).eq(2).attr('href');
			var dl = $('a', this).eq(3).attr('href');
			var size = $('td', this).eq(5).text().trim().toUpperCase();
			size = size.slice(0, -2) + ' ' + size.slice(-2);
			var title = $('a', this).eq(2).text().trim();
			var text = title.toLowerCase();
			var formats = [];
			for (i in app.bookFormats) {
				if (text.indexOf(app.bookFormats[i]) > -1) {
					formats.push(app.bookFormats[i].toUpperCase());
					break;
				}
			}
			var dl_link = $('<a href="' + dl + '"><b>' + formats.join() + '</b> ' + size + '</a>');

			for (i in filekeys) {
				if (filedata[filekeys[i]] == size) {
					dl_link.css('color', '#c00');
					break;
				}
			}

			cell.append(
				dl_link, ' ',
				$('<a href="' + href + '" target="_blank">&rarr;</a>').attr("title", title).tooltip(),
				'<br>'
			);
		});
	}
}, "waffles");

app.registerSource("TGZ", {
	url: function (book) {
		var author = book.searchAuthor.length > 0 ? book.searchAuthor + "and " : "";
		var query = author + '"' + book.searchTitle.replace(/\"/g, '') + '" and (pdf or epub or mobi or azw3) and not mp3';
		return 'https://thegeeks.bz/browse.php?incldead=1&nonboolean=3&titleonly=1&search=' + encodeURIComponent(query);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var filedata = cell.parent().data('filedata');
		var filekeys = Object.keys(filedata);
		var html = $(app.prepareHTML(response.responseText).replace(/href="([a-z]+)/gi, 'href="https://thegeeks.bz/$1'));
		var torrents = $('.ttable:not(:icontains("MP3")):not(:icontains("Webrip"))', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">TGZ (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var i;
			var href = $('a', this).eq(1).attr('href');
			var dl = $('td', this).eq(2).find('a').eq(1).attr('href');
			var size = $('td', this).eq(6).text().trim().toUpperCase();
			size = size.slice(0, -2) + ' ' + size.slice(-2);
			var title = $('a', this).eq(1).text().trim();
			var text = title.toLowerCase();

			var format = '';
			for (i in app.bookFormats) {
				if (text.indexOf(app.bookFormats[i]) > -1) {
					format = app.bookFormats[i].toUpperCase();
					break;
				}
			}

			var dl_link = $('<a href="' + dl + '"><b>' + format + '</b> ' + size + '</a>');

			for (i in filekeys) {
				if (filedata[filekeys[i]] == size) {
					dl_link.css('color', '#c00');
					break;
				}
			}

			cell.append(
				dl_link, ' ',
				$('<a href="' + href + '" target="_blank">&rarr;</a>').attr("title", title).tooltip(),
				'<br>'
			);
		});
	}
}, "thegeeks");

app.registerSource("RuTracker", {
	url: function (book) {
		var query = book.searchAuthor + book.searchTitle + ' ' + app.bookFormats.join('|');
		return 'http://rutracker.org/forum/tracker.php?nm=' + encodeURIComponent(query);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var filedata = cell.parent().data('filedata');
		var filekeys = Object.keys(filedata);
		var html = $(app.prepareHTML(response.responseText).replace(/href="viewtopic/gi, 'href="http://rutracker.org/forum/viewtopic'));
		var torrents = $('#tor-tbl tbody tr.hl-tr', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">TRU (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var i;
			var link = $('.t-title', this).first().find('a').first();
			var href = link.attr('href');
			var size = parseInt($('td', this).eq(5).find('u').text().trim());
			var i = Math.floor(Math.log(size) / Math.log(1024));
			size = (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'KB', 'MB', 'GB', 'TB'][i];

			for (i in filekeys) {
				if (filedata[filekeys[i]] == size) {
					size = "<span style=\"color:#c00\">"+size+"</span>";
					break;
				}
			}

			cell.append('<a href="' + href + '" target="_blank">' + link.text().trim() + '</a> - ' + size + '<br><br>');
		});
	}
}, "rutracker");

app.registerSource("BM", {
	url: function (book) {
		return 'http://www.bitme.org/browse.php?cat=6&incldead=1&search=' + encodeURIComponent(book.searchAuthor + book.searchTitle);
	},
	onload: function (response) {
		if (!app.checkAuth(response)) return;

		var cell = $(response.context);
		var row = cell.parent();
		var filedata = row.data('filedata');
		var filekeys = Object.keys(filedata);
		var html = $(app.prepareHTML(response.responseText).replace(/href="/gi, 'href="http://www.bitme.org/'));

		var table = $("td.latest", html).first().closest("table");

		var title = row.data('book').title.replace(/^(A|An|The)\ /, '').split(':')[0].split('(')[0].split('[')[0].split(' - ')[0].split(',')[0].trim().replace(/\"/g, '\"').slice(0, 20);
		var torrents = row.data('book').formats.length > 0 ? $('tr:not(:eq(0)):not(:contains("GB")):icontains("' + title + '")', table) : $('tr:not(:eq(0))', table);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">BM (' + torrents.length + ')</a></h5>');

		torrents.each(function () {
			var i;
			var href = $('a', this).eq(1).attr('href');
			var dl = $('a', this).eq(3).attr('href');
			var size = $('td', this).eq(6).text().trim().toUpperCase();
			size = size.slice(0, -2) + ' ' + size.slice(-2);
			var title = $('a', this).eq(1).text().trim();

			var dl_link = $('<a href="' + dl + '">' + size + '</a>');

			for (i in filekeys) {
				if (filedata[filekeys[i]] == size) {
					dl_link.css('color', '#c00');
					break;
				}
			}

			cell.append(
				'<a href="' + href + '" target="_blank">' + title + '</a><br>',
				dl_link, "<br><br>"
			);
		});
	}
}, "bitme");

app.registerSource("Genesis", {
	url: function (book) {
		return 'http://gen.lib.rus.ec/search.php?open=0&view=simple&column=def&req=' + encodeURIComponent(book.searchAuthor + book.searchTitle);
	},
	onload: function (response) {
		var cell = $(response.context);

		var html = app.prepareHTML(response.responseText).split('<table width=100% cellspacing=1')[1];
		html = '<table width=100% cellspacing=1' + html;
		html = html.split('</table')[0];
		html += '</table>';
		html = $(html);

		var items = $('tr:not(:eq(0))', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">GEN (' + items.length + ')</a></h5>');

		items.each(function () {
			var row = $(this);
			var link = row.find("a").eq(1);
			link.find("font:last").remove();
			var title = link.text().trim();
			var dl = '<div>';
			dl += row.find('td').eq(8).text() + ' ' + row.find('td').eq(7).text() + ' ';
			dl += row.find('td').eq(9).html() + ' ';
			dl += row.find('td').eq(10).html() + ' ';
			dl += row.find('td').eq(11).html() + ' ';
			dl += row.find('td').eq(12).html() + ' ';
			dl += '</div>';
			cell.append($(dl).attr("title", title).tooltip({placement:"left"}));
		});
	}
});

app.registerSource("AvaxHome", {
	url: 'http://avxsearch.se/?c=5&exact=1&q=',
	onload: function (response) {
		var cell = $(response.context);
		var html = $(app.prepareHTML(response.responseText));
		var items = $('.article:not(:icontains("MP3"))', html);

		cell.html('<h5><a href="' + response.finalUrl + '" target="_blank">AVX (' + items.length + ')</a></h5>');

		items.each(function () {
			cell.append($('a.title-link', this).first().attr("target", "_blank"));

			var text = $('div.center', this).first().contents().filter(function () {
				return this.nodeType === 3;
			});
			text = text.text().trim();
			if (text.length > 0) {
				text = text.split(' | ');
				if (text.length > 4) {
					text.shift();
					text.shift();
				}
				text = text.join(' | ');
				cell.append('<br>', text);
			}

			cell.append('<br><br>');
		});
	}
});

app.run();
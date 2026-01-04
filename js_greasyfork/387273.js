// ==UserScript==
// @icon            https://img3.doubanio.com/favicon.ico
// @name            豆瓣备份
// @namespace      https://www.douban.com/people/57965364/
// @author          57965364
// @description     备粮、备荒
// @match           https://*.douban.com/*
// @version         0.0.1
// @require https://greasyfork.org/scripts/387261-douban-photo-lib/code/douban_photo_Lib.js?version=715521
// @require https://unpkg.com/dexie@latest/dist/dexie.js
// @require https://greasyfork.org/scripts/387262-douban-note-lib/code/douban_note_Lib.js?version=715522
// @require https://greasyfork.org/scripts/387124-filesaver-lib/code/FileSaver_Lib.js?version=715484
// @require https://greasyfork.org/scripts/387126-html-docx-lib/code/html_docx_Lib.js?version=714522
// @require https://greasyfork.org/scripts/387267-douban-book-lib/code/douban_book_Lib.js?version=715562
// @require https://greasyfork.org/scripts/387268-douban-movie-lib/code/douban_movie_Lib.js?version=715564
// @require https://greasyfork.org/scripts/387271-douban-music-lib/code/douban_music_Lib.js?version=715570
// @grant           GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/387273/%E8%B1%86%E7%93%A3%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/387273/%E8%B1%86%E7%93%A3%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==
(function () {
	'use strict';

	var ul = document.getElementsByClassName('global-nav-items')[0].getElementsByTagName("ul")[0];
	var newli = document.createElement('li');

	var mLink = document.createElement('a');
	mLink.setAttribute('target', '_blank');
	mLink.setAttribute('class', 'bn-more');
	mLink.setAttribute('rel', 'off');
	var mSpan1 = document.createElement('span');
	var text1 = document.createTextNode("备份");
	mSpan1.appendChild(text1);
	var mSpan2 = document.createElement('span');
	mSpan2.setAttribute('class', 'arrow');
	mLink.appendChild(mSpan1);
	mLink.appendChild(mSpan2);
	newli.appendChild(mLink);

	var mDiv = document.createElement('div');
	mDiv.setAttribute("class", "more-items");
	var mtable = document.createElement('table');
	mtable.setAttribute("cellpadding", "0");
	mtable.setAttribute("cellspacing", "0");
	mtable.setAttribute("id", "backup_table");
	var mtbody = document.createElement("tbody");
	var mTitles = ['日记', '照片', '读书', '电影', '音乐'];
	for (var i = 0; i < mTitles.length; i++) {
		var R = document.createElement("tr");
		R.setAttribute("id", i);
		var C = document.createElement("td");
		var tempATag = document.createElement('a');
		tempATag.appendChild(document.createTextNode(mTitles[i]));
		tempATag.style.color = '#3d3d3d';
		C.appendChild(tempATag);
		R.appendChild(C);
		mtbody.appendChild(R);
	}
	mtable.appendChild(mtbody);
	mDiv.appendChild(mtable);
	newli.appendChild(mDiv);

	ul.appendChild(newli);

	addRowHandlers();

	function addRowHandlers() {
		var table = document.getElementById("backup_table");
		var rows = table.getElementsByTagName("tr");
		for (i = 0; i < rows.length; i++) {
			var currentRow = table.rows[i];
			var createClickHandler = function (row) {
				return function () {
					var id = row.getAttribute("id");
					console.log(unsafeWindow._GLOBAL_NAV.USER_ID);
					if (unsafeWindow._GLOBAL_NAV.USER_ID != null) {
						if (id == 0) {
							if (window.location.host.startsWith("www.douban.com")) {
								downloadNotes(unsafeWindow._GLOBAL_NAV.USER_ID, saveAs, htmlDocx);
							} else {
								alert("去www.douban.com下载");
							}
						} else if (id == 1) {
							if (window.location.host.startsWith("www.douban.com")) {
								const db = new Dexie("豆瓣相册详情");
								db.version(1).stores({
									items: `++id, album, pid, date, desc`
								});
								downloadPhotos(unsafeWindow._GLOBAL_NAV.USER_ID, db);
							} else {
								alert("去www.douban.com下载");
							}
						} else if (id == 2) {
							if (window.location.host.startsWith("book.douban.com")) {
								const db_read_collection = new Dexie("豆瓣读书（已读）");
								db_read_collection.version(1).stores({
									items: `++id, title, pub, rating, date, tags, link, comment`
								});
								const db_read_wish = new Dexie("豆瓣读书（想读");
								db_read_wish.version(1).stores({
									items: `++id, title, pub, rating, date, tags, link, comment`
								});
								const db_read_do = new Dexie("豆瓣读书（在读）");
								db_read_do.version(1).stores({
									items: `++id, title, pub, rating, date, tags, link, comment`
								});
								downloadBooks(unsafeWindow._GLOBAL_NAV.USER_ID, db_read_collection,
									db_read_wish, db_read_do, saveAs, htmlDocx);
							} else {
								alert("去book.douban.com下载");
							}
						} else if (id == 3) {
							if (window.location.host.startsWith("movie.douban.com")) {
								const db_movie_collection = new Dexie("豆瓣电影（看过）");
								db_movie_collection.version(1).stores({
									items: `++id, title, intro, rating, date, tags, link, comment`
								});
								const db_movie_wish = new Dexie("豆瓣电影（想看）");
								db_movie_wish.version(1).stores({
									items: `++id, title, intro, rating, date, tags, link, comment`
								});
								const db_movie_do = new Dexie("豆瓣电影（在读）");
								db_movie_do.version(1).stores({
									items: `++id, title, intro, rating, date, tags, link, comment`
								});
								downloadMovie(unsafeWindow._GLOBAL_NAV.USER_ID, db_movie_collection,
									db_movie_wish, db_movie_do, saveAs, htmlDocx);
							} else {
								alert("movie.douban.com下载");
							}
						} else if (id == 4) {
							if (window.location.host.startsWith("music.douban.com")) {
								const db_music_collection = new Dexie("豆瓣音乐（已听）");
								db_music_collection.version(1).stores({
									items: `++id, title, intro, rating, date, tags, link,comment`
								});
								const db_music_wish = new Dexie("豆瓣音乐（想听）");
								db_music_wish.version(1).stores({
									items: `++id, title, intro, rating, date, tags, link, comment`
								});
								const db_music_do = new Dexie("豆瓣音乐（在听）");
								db_music_do.version(1).stores({
									items: `++id, title, intro, rating, date, tags, link, comment`
								});
								downloadMusic(unsafeWindow._GLOBAL_NAV.USER_ID, db_music_collection,
									db_music_wish, db_music_do, saveAs, htmlDocx);
							} else {
								alert("music.douban.com下载");
							}
						}
					} else {
						alert("麻烦先登陆一下");
					}
				};
			};
			currentRow.onclick = createClickHandler(currentRow);
		}
	}

})();
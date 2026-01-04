// ==UserScript==
// @name         EhxVisited
// @namespace    https://sleazyfork.org/en/users/285675-hauffen
// @version      2.62.26.13
// @description  E-H Visited, combined with ExVisited, and then better.
// @author       Hauffen
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @match        *://exhentai.org/*
// @match        *://e-hentai.org/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/391711/EhxVisited.user.js
// @updateURL https://update.greasyfork.org/scripts/391711/EhxVisited.meta.js
// ==/UserScript==

(function() {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction || {READ_WRITE: 'readwrite'};
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    if (!window.indexedDB) {
        console.warn("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        return;
    }

    /*═════════════════════════════╗
    ║    Configuration Defaults    ║
    ╚═════════════════════════════*/
    var setStore = localStorage.getItem('ehx-settings') ? JSON.parse(localStorage.getItem('ehx-settings')) : {"softHide": false, "minAdd": true, "minShow": false, "cssTT": false, "repPub": false, "visHide": false, "hidShow": false, "pFilter": false, "pLimit": 0, "stFilter": false, "stLimit": 0, "titleShow": true, "titleOn": false, "tagPreview": false, "autoUp": false, "autoTime": 0, "lastBack": 0};
    var filters = '';
    var cssA = localStorage.getItem('ehx-css') ? JSON.parse(localStorage.getItem('ehx-css')) : {"visible": "box-shadow: inset 0 0 0 500px rgba(2, 129, 255, .2) !important;", "hidden": "box-shadow: inset 0 0 0 500px rgba(255, 40, 0, .2) !important;", "download": "box-shadow: inset 0 0 0 500px rgba(30, 180, 60, .2) !important;", "filter": "box-shadow: inset 0 0 0 500px rgba(200, 0, 100, .2) !important;", "page" :"box-shadow: inset 0 0 0 500px rgba(0, 0, 180, .2) !important;", "rating" :"box-shadow: inset 0 0 0 500px rgba(180, 80, 60, .2) !important;", "uploader": "box-shadow: inset 0 0 0 500px rgba(222, 184, 135, .2) !important;", "tag": "box-shadow: inset 0 0 0 500px rgba(180, 130, 60, .2) !important;"};
    var cssD = (setStore.softHide) ? 'opacity:0.2; -webkit-opacity: 0.2;' : 'display: none;';
    var cssC = localStorage.getItem('ehx-cssc') ? JSON.parse(localStorage.getItem('ehx-cssc')) : {"custom": ""};
	const img_hide = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg==';
    /*════════════════════════════*/

    try {
        filters = localStorage.getItem('ehx-filters') ? JSON.parse(localStorage.getItem('ehx-filters')) : {"title": "#\\[Erocolor\\]", "uploader": "#xcaliber9999", "tag:": "#female:farting"}; // JSON.parse isn't a fan of unique characters
    } catch (e) {
        displayAlert('EhxVisited: Filter Error, See Console', 5000, true);
        console.log('EhxVisited: JSON.parse Error - ' + e.message);
        filters = {"title": "#\\[Erocolor\\]", "uploader": "#xcaliber9999", "tag:": "#female:farting"};
    }
    if (filters.tag == undefined) filters = {"title": filters.title, "uploader": filters.uploader, "tag": "#female:farting"}; // For fixing new updates

    let db = null, $ = window.jQuery;
    var filterArr = [], uploaderArr = [], tagArr = [];
    var observer = new MutationObserver(e => {
        addCSS();
    });

    var spl = document.URL.split('/');
    var galleries, hidden, down, cache, tempCache, element, title;
    var activeStore, activeStoreTitle;
    var d1 = spl[3], reload = 0, tags = [];
	const category = {doujinshi: 'ct2', manga: 'ct3', artistcg: 'ct4', gamecg: 'ct5', western: 'cta', nonh: 'ct9', imageset: 'ct6', cosplay: 'ct7', asianporn: 'ct8', misc: 'ct1'};
	const elem = {0: '.gl3m a', 1: '.gl3m a', 2: '.gl3c a', 3: '.gl1e a', 4: '.gl3t a'};
    const fileSizeLabels = [ "B", "KB", "MB", "GB" ];

    if (d1 == 'g') {
        addGallery('galleries', spl[4] + '.' + spl[5]); // Add the current page to galleries
    }
    if (d1.startsWith('gallerytorrents')) $('#torrentinfo a').click(e => addGallery('down', getUrlVars().gid + '.' + getUrlVars().t));
	if (d1.startsWith('archiver')) {
		$(':submit').click(e => addGallery('down', getUrlVars().gid + '.' + getUrlVars().token));
		$('a').click(e => addGallery('down', getUrlVars().gid + '.' + getUrlVars().token));
	}
	if ((d1.substr(0, 1).match(/[?#funptw]/i) && !d1.startsWith('toplist') && !d1.startsWith('upld')) || Object.keys(category).includes(d1) || !d1) {
        $('<div class="ehx-alertContainer"></div>').appendTo('body');
        populate();
    } else return;

    /**
     * Add a gallery to our IndexedDB
	 */
    function addGallery(store, gid) {
        const request = indexedDB.open('ehxvisited', 2);

        request.onupgradeneeded = e => { // Generate our database if it's not there
            db = e.target.result;

            if (!db.objectStoreNames.contains('galleries')) db.createObjectStore('galleries', {keyPath: 'id'});
            if (!db.objectStoreNames.contains('hidden')) db.createObjectStore('hidden', {keyPath: 'id'});
			if (!db.objectStoreNames.contains('down')) db.createObjectStore('down', {keyPath: 'id'});
        };

        request.onsuccess = e => {
            db = e.target.result;

            var objStore = db.transaction(store, 'readwrite').objectStore(store);
            var openRequest = objStore.openCursor(gid);

            openRequest.onsuccess = e => {
                var cursor = openRequest.result;
                if (cursor) { // Update entry if key exists
                    cursor.update({id: gid, visited: Date.now()});
                    console.log('EhxVisited: Updated ' + gid);
                } else { // Otherwise, add entry
                    objStore.add({id: gid, visited: Date.now()});
                    console.log('EhxVisited: Added ' + gid);
                }
            };

            openRequest.onerror = e => {
                console.log(`EhxVisited: Something bad happened with gallery ${gid}: ${e.target.error}`);
            };
        };
    }

	/**
	 * Fill our local gallery listings so we can preform easier operations on the data.
	 * Also set up the majority of our global HTML elements and their functions.
	 */
    function populate() { // TODO: Separate the HTML entries from the population portion
		populateFilter();
		galleries = []
        hidden = []
        down = []
        cache = [];

		if (setStore.autoUp) {
			var diff;
			switch (setStore.autoTime) {
				case 0:
					diff = 1;
					break;
				case 1:
					diff = 7;
					break;
				case 2:
					diff = 30;
					break;
				default:
					diff = 0;
					break;
			}
			if ((Date.now() - setStore.lastBack) / (1000 * 3600 * 24) >= diff || setStore.lastBack == undefined) {
				setStore.lastBack = Date.now();
				localStorage.setItem('ehx-settings', JSON.stringify(setStore));
				ehxExportF();
			}
		}

        const request = indexedDB.open('ehxvisited', 2);

        request.onupgradeneeded = e => {
            db = e.target.result;

            if (!db.objectStoreNames.contains('galleries')) db.createObjectStore('galleries', {keyPath: 'id'});
            if (!db.objectStoreNames.contains('hidden')) db.createObjectStore('hidden', {keyPath: 'id'});
			if (!db.objectStoreNames.contains('down')) db.createObjectStore('down', {keyPath: 'id'});
        };

        request.onsuccess = e => { // TODO: See about multiple transactions, or just do these async
            db = e.target.result;
            var objStore = db.transaction('galleries', 'readonly').objectStore('galleries');
            var openReq = objStore.getAll();
            openReq.onsuccess = f => {
                console.log('EhxVisited: Populated global variables.');
                var transform = f.target.result;
                for (var i = 0; i < transform.length; i++) {
                    galleries[transform[i].id] = transform[i].visited; // Force matrix data into array data
                }
                var gLength = Object.keys(galleries).length
                var objStore2 = db.transaction('hidden', 'readonly').objectStore('hidden');
                var openReq2 = objStore2.getAll();
                openReq2.onsuccess = g => {
                    var transform2 = g.target.result;
                    for (i = 0; i < transform2.length; i++) {
                        hidden[transform2[i].id] = 1; // Force matrix data into array data
                    }
                    galleries = sortObj(galleries);
                    var hLength = Object.keys(hidden).length
					var objStore3 = db.transaction('down', 'readonly').objectStore('down');
					var openReq3 = objStore3.getAll();
					openReq3.onsuccess = h => {
						var transform3 = h.target.result;
						for (i = 0; i < transform3.length; i++) {
							down[transform3[i].id] = 1;
						}
						$($('h1').text() == 'Favorites' ? '.ido > div:nth-child(3)' : '#toppane').append(
							`<ehx id="ehx-controls">Galleries visited: <span id="gLength">` + gLength + `</span> ( <span id="ehx-menu-control"></span><a id="ehx-settings">Settings</a> )
							 <br/>Hidden Galleries: <span id="hLength">` + hLength + `</span><span id="ehxh-menu-control"></span></ehx>`);
						if (!setStore.softHide) {
							$('#ehx-menu-control').append('<a id="ehx-show">' + ((setStore.visHide) ? 'Show' : 'Hide') + '</a> / ');
							$('#ehxh-menu-control').append(' ( <a id="ehxh-show">' + ((setStore.hidShow) ? 'Hide' : 'Show') + '</a> )');
						}
						$('#ehx-settings').click(e => {
							e.preventDefault();
							settings();
						});
						$('#ehx-show').click(e => {
							var disp = $('.ehx-visited.ehx-hidden').css('display');
							if ($('#ehx-show').text() === 'Show') {
								$('.ehx-visited').css({display: ''});
								$('.ehx-visited.ehx-hidden').css({display: disp});
							} else {
								$('.ehx-visited').css({display: 'none'});
								$('.ehx-visited.ehx-hidden').css({display: disp});
							}
							$('#ehx-show').text((i, t) => {
								return t === 'Show' ? 'Hide' : 'Show';
							});
							updateGListing();
							setStore.visHide = $('#ehx-show').text() === 'Show' ? true : false;
							localStorage.setItem('ehx-settings', JSON.stringify(setStore)); // Update our stored settings
						});
						$('#ehxh-show').click(e => {
							if ($('#ehxh-show').text() === 'Show') {
								if (!$('.gl1t').length) { // For table view modes
									$('.ehx-hidden').css({display: $('.ehx-hidden').parent().find('tr').not('.ehx-hidden').css('display')}); // Copy the display CSS of our closest element
									$('.ehx-visited.ehx-hidden').css({display: $('.ehx-hidden').parent().find('tr').not('.ehx-hidden').css('display')});
								} else { // Default display CSS for thumbnail
									$('.ehx-hidden').css({display: 'flex'});
									$('.ehx-visited.ehx-hidden').css({display: 'flex'});
								}
							} else {
								$('.ehx-hidden').css({display: ''});
								$('.ehx-visited.ehx-hidden').css({display: ''});
							}
							$('#ehxh-show').text((i, t) => { // Toggle text
								return t === 'Show' ? 'Hide' : 'Show';
							});
							updateGListing();
							setStore.hidShow = $('#ehxh-show').text() === 'Hide' ? true : false;
							localStorage.setItem('ehx-settings', JSON.stringify(setStore));
						});
						$('#ehx-controls').append('<br /><span id="ehx-hideCount"><span></span></span>');
						addCSS();
						updateGListing();
					}
                }
            }
        }
    }

	/**
     * Populate the custom filter array with user input converted into regular expressions
	 */
    function populateFilter() {
        filterArr = []; // Start fresh for when we call this again
        uploaderArr = [];
        tagArr = [];
        if (filters.title != '') pushRegex('title', filterArr);
        if (filters.uploader != '') pushRegex('uploader', uploaderArr);
        if (filters.tag != '') pushRegex('tag', tagArr);

		function pushRegex(store, arr) {
			var tempArr = filters[store].split('\n');
            for (var i = 0; i < tempArr.length; i++) {
                if (tempArr[i].startsWith('#')) continue;
                var regex;
                try {
                    regex = new RegExp(tempArr[i], 'i');
                } catch(e) {
                    displayAlert('Invalid Regex On Line ' + (i + 1), 5000, true);
                    continue;
                }
                arr.push(regex);
            }
		}
    }

    /**
     * Updates the hidden gallery count in the header object
	 */
    function updateGListing() {
        var list = $('.itg .gl1t').length > 0 ? $('.itg .gl1t') : $('table.itg>tbody>tr').has('.glhide, .gldown, th'); // Get the proper elements depending on our view mode
		var hCount = $('.ehx-hidden').length, vAmount = $('.ehx-hidden.ehx-visited').length;
		var hAmount = $('div[data-jqstyle*="h"]').length, fAmount = $('div[data-jqstyle*="f"]').length, pAmount = $('div[data-jqstyle*="p"]').length, rAmount = $('div[data-jqstyle*="r"]').length, uAmount = $('div[data-jqstyle*="u"]').length, tAmount = $('div[data-jqstyle*="t"]').length;
        if (!setStore.softHide) {
            $('#ehx-hideCount').html('There ' + (hCount > 1 || hCount == 0 ? 'are ' : 'is ') + '<span>' + hCount + ' hidden ' + (hCount > 1 || hCount == 0 ? 'galleries' : 'gallery') + '</span> on this page.');
        } else {
            $('ehx-hideCount').html('There are <span>0 hidden galleries</span> on this page.');
        }
        $('#ehx-hideCount > span').prop('title', 'Hidden: ' + hAmount + ' | Visited: ' + vAmount + ' | Filtered: ' + fAmount + ' | Page Limit: ' + pAmount + ' | Rating Limit: ' + rAmount + ' | Uploader: ' + uAmount + ' | Tags: ' + tAmount);
		$('#hLength').text(Object.keys(hidden).length);
		$('#gLength').text(Object.keys(galleries).length);
    }

    /**
	 * Our main function that does basically everything that we see.
	 * Appends our custom HTML objects to the main page.
	 * Adds CSS to elements based on whether they can be found in the populated local gallery listing.
	 */
    async function addCSS() { // TODO: Probably refactor this block again
		observer.disconnect();
		var list = $('.itg tr').length ? $('tr').has('.glhide, .gldown, th') : $('.itg .gl1t');
		var gid, galleryId, onFavs;

		if (list.length) {
		    if ($('h1').text() == 'Favorites') onFavs = 1;
			element = elem[onFavs ? $(".searchnav div > select").eq(1).prop('selectedIndex') : $(".searchnav div > select > option:selected").index()]
            let tempCache = [];
			generateCacheListing(element, tempCache);
            tempCache = tempCache.filter(Boolean);
            if (tempCache.length) {
			    if (tempCache.length > 25) {
			    	while (tempCache.length > 0) {
				    	let request = {"method": "gdata", "gidlist": tempCache.splice(0, 25), "namespace": 1}
					    await generateCacheRequest(request);
				    }
			    } else {
				    let request = {"method": "gdata", "gidlist": tempCache, "namespace": 1}
				    await generateCacheRequest(request);
			    }
            }

			if ($('.gl1e').length) { // Extended
				for (var i = 0; i < list.length; i++) {
					gid = $(list[i]).find('.gl1e a').attr('href').split('/');
					galleryId = gid[4] + '.' + gid[5];

					if (galleries[galleryId] != undefined) { // Visited
                        if (!$(list[i]).hasClass('ehx-visited')) { // Append our fields if we haven't already
                            $(list[i]).addClass('ehx-visited');
							addStyle($(list[i]), 'v');
                            if (onFavs) {
                                $(list[i]).find('.gl3e div:last-child').append('<br/><ehx class="ehx-extended-favs">\uD83D\uDC41 ' + timeDifference(galleryId) +'<br>' + buildTime(galleryId, false) + '</ehx>');
                            } else {
                                $(list[i]).find('.gl3e').append('<ehx class="ehx-extended">\uD83D\uDC41 ' + timeDifference(galleryId) +'<br>' + buildTime(galleryId, false) + '</ehx>');
                            }
                        } else { // Otherwise, just update the timestamp
                            if (onFavs) {
                                $(list[i]).find('ehx-extended-favs').text('\uD83D\uDC41 ' + timeDifference(galleryId) +'<br>' + buildTime(galleryId, false));
                            } else {
                                $(list[i]).find('ehx-extended').text('\uD83D\uDC41 ' + timeDifference(galleryId) +'<br>' + buildTime(galleryId, false));
                            }
                        }

                        if (setStore.cssTT) $(list[i]).find('.glname').attr('title', '\uD83D\uDC41 ' + buildTime(galleryId, true));
                        if (setStore.repPub) $(list[i]).find('.gl3e div:nth-child(2)').text(buildTime(galleryId, false));
					} else { // Never Visited
						if (setStore.cssTT) $(list[i]).find('.glname').attr('title', 'Never Visited');
						if (setStore.repPub) $(list[i]).find('.gl3e div:nth-child(2)').text('Never Visited');
                        $(list[i]).removeClass('ehx-visited');
                        if ($(list[i]).find('.ehx-extended').length) $(list[i]).find('.ehx-extended').remove();
					}

					if (hidden[galleryId] != undefined && !$(list[i]).hasClass('ehx-hidden')) {
						$(list[i]).addClass('ehx-hidden');
						addStyle($(list[i]), 'h');
					}

					if (down[galleryId] != undefined && !$(list[i]).hasClass('ehx-downloaded')) {
						$(list[i]).addClass('ehx-downloaded');
						addStyle($(list[i]), 'd');
					}

					if (!$(list[i]).find('.ehx-imgHide').length) {
						$('<img class="ehx-imgHide" src="' + img_hide + '" title="Show/Hide Gallery">').appendTo($(list[i]).find('.gl2e > div')).click(e => { // Maybe closest('tr')
							toggleElement($(e.currentTarget).parents().eq(2).find('a').attr('href'), $(e.currentTarget).parents().eq(2));
						});
					}
					filterCheck($(list[i]));
				}
			} else if ($('.gl1c').length) { // Compact
				var borderColor = $('.gl1c').first().css('border-top-color');
				if ($('.itg tr:first-child').children().length < 5) { // We haven't appended our table head
					$('.itg th:nth-child(4)').after('<th style="text-align: center;" title="EhxVisited: Click to Show/Hide">&#x2716</th>'); // X column
					if (setStore.minAdd) $('.itg th:nth-child(2)').after('<th>Visited</th>');
					if (setStore.repPub) $('.itg th:nth-child(2)').text('Visited');
				}

				for (i = 1; i < list.length; i++) {
					gid = $(list[i]).find('.glname a').attr('href').split('/');
					galleryId = gid[4] + '.' + gid[5];

					if (galleries[galleryId] != undefined) { // Visited
                        if (!$(list[i]).hasClass('ehx-visited')) { // Append our fields
                            $(list[i]).addClass('ehx-visited');
							addStyle($(list[i]), 'v');
                            if (setStore.minAdd) {
                                if ($(list[i]).find('.ehx-compact').length) $(list[i]).find('ehx-compact').html('<ehx>' + timeDifference(galleryId, true) + '<br>' + buildTime(galleryId, false).substring(11) + '<br>' + buildTime(galleryId, false).substring(2, 10) + '</ehx>');
                                else $(list[i]).find('.gl2c').after('<td class="ehx-compact" style="border-color:' + borderColor + ';"><ehx>' + timeDifference(galleryId, true) + '<br>' + buildTime(galleryId, false).substring(11) + '<br>' + buildTime(galleryId, false).substring(2, 10) + '</ehx></td>');
                            }
                        } else { // Otherwise update timestamp
                            $(list[i]).find('ehx-compact').html('<ehx>' + timeDifference(galleryId, true) + '<br>' + buildTime(galleryId, false).substring(11) + '<br>' + buildTime(galleryId, false).substring(2, 10) + '</ehx>');
                        }

                        if (setStore.cssTT) $(list[i]).find('.glname').attr('title', '\uD83D\uDC41 ' + buildTime(galleryId, true));
                        if (setStore.repPub) $(list[i]).find('.gl2c div:nth-child(3) div:first-child').text(buildTime(galleryId, false));
					} else { // Never Visited
						if (setStore.cssTT) $(list[i]).find('.glname').attr('title', 'Never Visited');
						if (setStore.repPub) $(list[i]).find('.gl2c > div:nth-child(3) > div:first-child').text('Never Visited');
						if ($(list[i]).children().length < 5 || ($(list[i]).children().length < 6 && onFavs)) {
							if (setStore.minAdd) $(list[i]).find('.gl2c').after('<td class="ehx-compact" style="border-color:' + borderColor + ';"></td>');
						}
                        $(list[i]).removeClass('ehx-visited');
					}

					if (hidden[galleryId] != undefined && !$(list[i]).hasClass('ehx-hidden')) {
                        $(list[i]).addClass('ehx-hidden');
                        addStyle($(list[i]), 'h');
					}

					if (down[galleryId] != undefined && !$(list[i]).hasClass('ehx-downloaded')) {
						$(list[i]).addClass('ehx-downloaded');
						addStyle($(list[i]), 'd');
					}

					if (!$(list[i]).find('.ehx-imgHide').length) {
						$('<td class="hideContainer"><img class="ehx-imgHide" src="' + img_hide + '" title="Show/Hide Gallery"></td>').appendTo($(list[i]).closest('tr')).click(e => {
							toggleElement($(e.currentTarget).parent().find('.glname a').attr('href'), $(e.currentTarget).parent());
						});
					}
					filterCheck($(list[i]));
				}
			} else if ($('.gl1m').length) { // Minimal
				if ($('.itg tr:first-child').children().length < 7) { // We haven't appended our table head
					$('.itg th:nth-child(6)').after('<th style="text-align: center;" title="EhxVisited: Click to Show/Hide">&#x2716</th>'); // X Column
					if (setStore.minAdd) $('.itg th:nth-child(2)').after('<th title="EhxVisited: Hover for timestamps" style="text-align: center;">\uD83D\uDC41</th>');
					if (setStore.repPub) $('.itg th:nth-child(2)').text('Visited');
				}

				for (i = 1; i < list.length; i++) {
					gid = $(list[i]).find('.glname a').attr('href').split('/');
					galleryId = gid[4] + '.' + gid[5];

					if (galleries[galleryId] != undefined) { // Visited
                        if (!$(list[i]).hasClass('ehx-visited')) { // Append fields
                            $(list[i]).addClass('ehx-visited');
							addStyle($(list[i]), 'v');
                            if (setStore.minAdd) {
                                if (setStore.minShow) {
                                    if ($(list[i]).find('.ehx-minimal').length) $(list[i]).find('.ehx-minimal').html('<ehx title="' + buildTime(galleryId, false) +'">' + timeDifference(galleryId, true) + '</ehx>');
                                    else $(list[i]).find('.gl2m').after('<td class="ehx-minimal"><ehx title="EhxVisited: ' + buildTime(galleryId, false) +'">' + timeDifference(galleryId, true) + '</ehx></td>');
                                } else {
                                   if ($(list[i]).find('.ehx-minimal').length) {
                                        $(list[i]).find('.ehx-minimal').html('<ehx>\uD83D\uDC41</ehx>');
                                        $(list[i]).find('.ehx-minimal').attr('title', 'EhxVisited: ' + buildTime(galleryId, true));
                                    } else $(list[i]).find('.gl2m').after('<td class="ehx-minimal" title="EhxVisited: ' + buildTime(galleryId, true) + '"><ehx>\uD83D\uDC41</ehx></td>');
                                }
                            }
                        } else { // Update our timestamps
                            if (setStore.minAdd) {
                                if (setStore.minShow) {
                                    $(list[i]).find('.ehx-minimal').html('<ehx title="' + buildTime(galleryId, false) +'">' + timeDifference(galleryId, true) + '</ehx>');
                                } else {
                                    $(list[i]).find('.ehx-minimal').html('<ehx>\uD83D\uDC41</ehx>');
                                    $(list[i]).find('.ehx-minimal').attr('title', 'EhxVisited: ' + buildTime(galleryId, true));
                                }
                            }
                        }

                        if (setStore.cssTT) $(list[i]).find('.glname a').attr('title', '\uD83D\uDC41 ' + buildTime(galleryId, true));
                        if (setStore.repPub) $(list[i]).find('.gl2m div:nth-child(3)').text(buildTime(galleryId, false));
					} else { // Never Visited
						if (setStore.cssTT) $(list[i]).find('.glname a').attr('title', 'Never Visited');
						if (setStore.repPub) $(list[i]).find('.gl2m div:nth-child(3)').text('Never Visited');
                        if ($(list[i]).children().length < 7 || ($(list[i]).children().length < 8 && onFavs)) {
						    if (setStore.minAdd) $(list[i]).find('.gl2m').after('<td class="ehx-minimal"></td>');
                        }
                        $(list[i]).removeClass('ehx-visited');
					}

					if (hidden[galleryId] != undefined && !$(list[i]).hasClass('ehx-hidden')) {
						$(list[i]).addClass('ehx-hidden');
						addStyle($(list[i]), 'h');
					}

					if (down[galleryId] != undefined && !$(list[i]).hasClass('ehx-downloaded')) {
						$(list[i]).addClass('ehx-downloaded');
						addStyle($(list[i]), 'd');
					}

					if (!$(list[i]).find('.ehx-imgHide').length) {
						$('<td class="hideContainer"><img class="ehx-imgHide" src="' + img_hide + '" title="Show/Hide Gallery"></td>').appendTo($(list[i]).closest('tr')).click(e => {
							var el = $(e.currentTarget).closest('tr');
							toggleElement($(el).find('.glname a').attr('href'), $(el));
						});
					}
                    filterCheck($(list[i]));
				}
			} else { // Thumbnail
				for (i = 0; i < list.length; i++) {
					gid = $(list[i]).find('.gl3t a').attr('href').split('/');
					galleryId = gid[4] + '.' + gid[5];

					if (galleries[galleryId] != undefined) { // Visited
                        if (!$(list[i]).hasClass('ehx-visited')) {
							$(list[i]).addClass('ehx-visited');
							addStyle($(list[i]), 'v');
							if (setStore.titleShow) $(list[i]).find('.gl5t').append('<div style="position: absolute; top: 45px;"><ehx class="ehx-thumbnail">\uD83D\uDC41 ' + buildTime(galleryId, true) + '</ehx></div>');
                            else $(list[i]).find('.gl5t').after('<ehx class="ehx-thumbnail">\uD83D\uDC41 ' + buildTime(galleryId, true) + '</ehx>');
                        } else {
                            $(list[i]).find('.ehx-thumbnail').text('\uD83D\uDC41 ' + buildTime(galleryId, true));
                        }

                        if (setStore.cssTT) $(list[i]).find('.glname').attr('title', '\uD83D\uDC41 ' + buildTime(galleryId, true));
                        if (setStore.repPub) $(list[i]).find('.gl5t div:first-child div:nth-child(2)').text(buildTime(galleryId, false));
					} else { // Never Visited
						if (setStore.cssTT) $(list[i]).find('.glname').attr('title', 'Never Visited');
                        if (setStore.repPub) $(list[i]).find('.gl5t div:first-child div:nth-child(2)').text('Never Visited');
                        $(list[i]).removeClass('ehx-visited');
                        if ($(list[i]).find('.ehx-thumbnail').length) $(list[i]).find('.ehx-thumbnail').parentElement.remove();
					}

					if (hidden[galleryId] != undefined && !$(list[i]).hasClass('ehx-hidden')) {
						$(list[i]).addClass('ehx-hidden');
						addStyle($(list[i]), 'h');
					}

					if (down[galleryId] != undefined && !$(list[i]).hasClass('ehx-downloaded')) {
						$(list[i]).addClass('ehx-downloaded');
						addStyle($(list[i]), 'd');
					}

					if (!$(list[i]).find('.ehx-imgHide').length) {
						$('<div class="hideContainer_t"><img class="ehx-imgHide" src="' + img_hide + '" title="Show/Hide Gallery"></div>').appendTo($(list[i]).find('.gl5t')).on('click', e => {
							var el = $(e.currentTarget).parents().eq(1);
							toggleElement($(el).find('.gl3t a').attr('href'), $(el));
						});
					}
					filterCheck($(list[i]));
				}
			}
			updateGListing();
		} else { // No Elements pulled, invalid view
			displayAlert('No Valid Elements Detected', 5000, true);
			return;
		}

		if (setStore.visHide) {
			$('.ehx-visited').css({display: 'none'});
			$('#ehx-show').text('Show');
		}

		if (setStore.hidShow) {
			if ($('.ehx-hidden').length < 25) { $('.ehx-hidden').css({display: $('.ehx-hidden').siblings().not('.ehx-hidden').css('display')}) } // Make sure there are elements on the page
			else { // Unless you're an idiot and hid everything on the page
				if ($('.gl1t').length) { $('.ehx-hidden').css({display: 'flex'}); } // Use the default values
				else { $('.ehx-hidden').css({display: 'table-row'}); }
			}
			$('#ehxh-show').text('Hide');
		}

		observer.observe($('.itg').get(0), { // Reconnect the observer for changes
			childList: true,
			subtree: true
		});
	}

	/**
     * Apply visited CSS to an element on click
     */
    $('.itg').on('click', 'a', e => {
        if (e.which === 3) return; // Ignore right-clicks
        if (e.currentTarget.href.split('/')[3] === 'g') {
            galleries[e.currentTarget.href.split('/')[4] + '.' + e.currentTarget.href.split('/')[5]] = Date.now();
            $('#gLength').text(Object.keys(galleries).length);
            addCSS();
        }
    });

    $('.itg').on('auxclick', 'a', e => {
        if (e.which === 3) return; // Ignore right-clicks
        if (e.currentTarget.href.split('/')[3] === 'g') {
            galleries[e.currentTarget.href.split('/')[4] + '.' + e.currentTarget.href.split('/')[5]] = Date.now();
            $('#gLength').text(Object.keys(galleries).length);
            addCSS();
        }
    });

    if(setStore.tagPreview && $(".searchnav div > select > option:selected").index() != 3) {
    	var $tagP = $('<div id="tagPreview">');
		$tagP.css({
			position: 'absolute',
			zIndex: '2',
			visiblility: 'hidden !important',
			maxWidth: '400px',
			background: window.getComputedStyle(document.getElementsByClassName('ido')[0]).backgroundColor,
			border: '1px solid #000',
			padding: '10px'
		});
		$tagP.appendTo("body");
		$('#tagPreview').css('visibility', 'hidden');

		element = elem[$(".searchnav div > select > option:selected").index()];

		$('.itg').on('mouseover', `${element}`, function(e) {
			//if(document.getElementById('tagPreview').children.length > 2) { $tagP.empty(); }

			title = this.children[0].title; // Save the title so we can put it back later, probably unnecessary
			this.children[0].title = ""; // Clear the title so we don't have it over our new window

			var str = this.href.split('/');
			generateTagPreview(cache[str[4] + '.' + str[5]]);

			var posY, posX = (e.pageX + 432 < screen.width) ? e.pageX + 10 : e.pageX - 412;
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();

			if ((scrollHeight - scrollPosition) < (scrollHeight / 10)) { posY = (e.pageY + 300 < scrollHeight) ? e.pageY + 10 : e.pageY - 300; }
			else { posY = e.pageY + 10; }

			$tagP.css({
				left: posX,
				top: posY,
				border: '1px solid ' + window.getComputedStyle(document.getElementsByTagName("a")[0]).getPropertyValue("color"),
				visibility: 'visible'
			});
			$('#tagPreview').css('visibility', 'visible');
		}).on('mousemove', `${element}`,function(e) {
			var posY, posX = (e.pageX + 432 < screen.width) ? e.pageX + 10 : e.pageX - 412;
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();

			if ((scrollHeight - scrollPosition) < (scrollHeight / 10)) { posY = (e.pageY + document.getElementById('tagPreview').offsetHeight < window.innerHeight) ? e.pageY + 10 : e.pageY - 10 - document.getElementById('tagPreview').offsetHeight; }
			else { posY = e.pageY + 10; }

			$tagP.css({
				visibility:'visible',
				top: posY,
				left: posX
			});
			$('#tagPreview').css('visibility', 'visible');
		}).on('mouseout', `${element}`, function() {
			this.children[0].title = title; // Put the saved title back
			$tagP.css({
				visibility:'hidden'
			});
			$('#tagPreview').css('visibility', 'hidden');
			$tagP.empty(); // Clear out the tag
		});

		$(document).on('scroll', function() {
			$('#tagPreview').css('visibility', 'hidden');
		});
    }

	/**
	 * Open the Settings menu and set up all necessary menu functions
	 */
    function settings() {
		// There's probably a much easier way to do this, or at least a nicer looking, more technical way
		var container = $(`
		<div class="ehx-overlay">
			<div class="ehx-settings">
				<nav id="ehx-topNav">
					<button id="ehx-home" style="float: left; border: none;">Main</button>
					<span id="setNotice" style="width: 100%; margin-left: 8px; margin-top: 2px; font-weight: lighter; opacity: 0.5; -webkit-opacity: 0.5; text-align: center; position: absolute; left: 0;">` + (reload ? `Applied Settings Will Take Effect On Reload` : ``) + `</span>
					<div>
						<div class="mencon">
							<button class="ehx-menu">Export</button>
							<div class="ehx-dropdown">
								<a id="ehx-export">Export Galleries</a>
								<a id="ehxh-export">Export Hidden Galleries</a>
								<a id="ehxd-export">Export DL Galleries</a>
								<a id="ehxf-export">Export All As File</a>
							</div>
						</div>
						<div class="mencon">
							<button class="ehx-menu">Import</button>
							<div class="ehx-dropdown">
								<a id="ehx-import">Import Galleries</a>
								<a id="ehxh-import">Import Hidden Galleries</a>
								<a id="ehxd-import">Import DL Galleries</a>
								<a id="ehxf-import">Import From File</a>
								<input id="ehxf-input" type="file" style="display: none;" />
							</div>
						</div>
						<a id="ehx-settings-close">&#128939</a>
					</div>
				</nav>
				<div class="section-container">
					<section>
						<fieldset>
							<legend>Settings</legend>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="softHide" ` + (setStore.softHide ? `checked` : ``) + `>Soft Hide Galleries
								</label>
								<span>: Darken hidden galleries instead of removing them from view</span>
							</div>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="minAdd" ` + (setStore.minAdd ? `checked` : ``) + `>Add Visited Column
								</label>
								<span>: Show visits in an additional column in Minimal/Minimal+ and Compact view modes</span>
								<div class="suboptions">
									<div>
										<span class="ehx-branch">&#8735</span>
										<label>
											<input type="checkbox" class="ehxCheck" id="minShow" ` + (setStore.minShow ? `checked` : ``) + `>Minimal Show Text
										</label>
										<span>: Show visits as text instead of hovering tooltip in Minimal/Minimal+ view modes</span>
									</div>
								</div>
							</div>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="cssTT" ` + (setStore.cssTT ? `checked` : ``) + `>CSS Tooltips
								</label>
								<span>: Replace gallery link tooltips with visited information in all view modes</span>
							</div>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="repPub" ` + (setStore.repPub ? `checked` : ``) + `>Replace Published
								</label>
								<span>: Replace date published with date visited in Minimal/Minimal+ view modes</span>
							</div>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="titleShow" ` + (setStore.titleShow ? `checked` : ``) + `>Show Full Title
								</label>
								<span>: Show the full title of a gallery on hover in Thumbnail view</span>
                                <div class="suboptions">
                                    <div>
                                        <span class="ehx-branch">&#8735</span>
                                        <label>
                                            <input type="checkbox" class="ehxCheck" id="titleOn" ` + (setStore.titleOn ? `checked` : ``) + `>Always Show Titles
                                        </label>
                                        <span>: Show full title of a gallery always in Thumbnail view</span>
                                    </div>
                                </div>
							</div>
                            <div>
                                <label>
                                    <input type="checkbox" class="ehxCheck" id="tagOn" ` + (setStore.tagPreview ? `checked` : ``) + `>Tag Preview
                                </label>
                                <span>: Show a tag listing for a gallery on mouse over, excludes Extended view</span>
                            </div>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="autoUpdate" ` + (setStore.autoUp ? `checked` : ``) + `>Auto Backup IndexedDB
								</label
								<span>: Automatically download a backup file every:
									<select id="bLim" ` + (setStore.autoUp ? `` : `disabled`) + `>
										<option>Day</option>
										<option>Week</option>
										<option>Month</option>
									</select>
								</span>
							</div>
						</fieldset>
						<fieldset>
							<legend>Custom CSS<span style="margin-left:10px"><a id="ehx-adv-css">Advanced</a></span></legend>
							<h3>Visited Galleries
								<div class="ehx-control" id="ehx-visControls">
									<button id="visHistory">View History</button>
									<button id="resV">Reset CSS</button>
									<button id="ehx-clear">Clear Data</button>
								</div>
							</h3>
							<textarea id="visited" class="field" spellcheck="false" placeholder="Insert CSS">` + cssA.visible + `</textarea>
							<h3>Hidden Galleries
								<div class="ehx-control hideControls">
									<button id="hidHistory">View</button>
									<button id="resH">Reset CSS</button>
									<button id="ehxh-clear">Clear Data</button>
								</div>
							</h3>
							<textarea id="hidden" class="field" spellcheck="false" placeholder="Insert CSS">` + cssA.hidden + `</textarea>
							<h3>Downloaded Galleries
								<div class="ehx-control hideControls">
									<button id="dowHistory">View</button>
									<button id="resD">Reset CSS</button>
									<button id="ehxd-clear">Clear Data</button>
								</div>
							</h3>
							<textarea id="downloaded" class="field" spellcheck="false">` + cssA.download + `</textarea>
							<div class="suboptions2">
								<button class="ehx-collapsible">Title Filtered Galleries</button>
								<div class="ehx-content">
									<textarea id="filtered" class="field" spellcheck="false">` + cssA.filter + `</textarea>
									<div class="ehx-control sControls">
										<button id="resF">Reset CSS</button>
									</div>
								</div>
								<button class="ehx-collapsible">Uploader Filtered Galleries</button>
								<div class="ehx-content">
									<textarea id="ufiltered" class="field" spellcheck="false">` + cssA.uploader + `</textarea>
									<div class="ehx-control sControls">
										<button id="resU">Reset CSS</button>
									</div>
								</div>
								<button class="ehx-collapsible">Page Filtered</button>
								<div class="ehx-content">
									<textarea id="page" class="field" spellcheck="false"placeholder="Insert CSS">` + cssA.page + `</textarea>
									<div class="ehx-control sControls">
										<button id="resP">Reset CSS</button>
									</div>
								</div>
								<button class="ehx-collapsible">Rating Filtered</button>
								<div class="ehx-content">
									<textarea id="rating" class="field" spellcheck="false" placeholder="Insert CSS">` + cssA.rating + `</textarea>
									<div class="ehx-control sControls">
										<button id="resR">Reset CSS</button>
									</div>
								</div>
                                <button class="ehx-collapsible">Tag Filtered</button>
                                <div class="ehx-content">
                                    <textarea id="tag" class="field" spellcheck="false" placeholder="Insert CSS">` + cssA.tag + `</textarea>
                                    <div class="ehx-control sControls">
                                        <button id="resT">Reset CSS</button>
                                    </div>
                                </div>
							</div>
						</fieldset>
						<fieldset>
							<legend>Filters</legend>
							Use one <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions">regular expression</a> per line to filter out matching galleries.
							<ul style="margin: 3px 0px; padding-left: 30px;">
								<li>E.G. <code>Ongoing</code> will filter out every gallery with <code>ongoing</code>, case-insensitive, in the title. <code>\\[Sample\\]</code> will filter out every gallery with <code>[Sample]</code>, case-insensitive, in the title.</li>
								<li>Lines starting with <code>#</code> will be ignored.</li>
							</ul>
							<textarea id="galFilter">` + filters.title + `</textarea>
							<h3>Uploader Filter</h3>
							<textarea id="upFilter">` + filters.uploader + `</textarea>
                            <h3>Tag Filter</h3>
                            <textarea id="tagFilter">` + filters.tag + `</textarea>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="pFilt" ` + (setStore.pFilter ? `checked` : ``) + `>Page Limit
								</label>
								<span>: Filter out any gallery with pages less than:
									<input id="pLim" type="number" min="1" value="` + setStore.pLimit + `" ` + (setStore.pFilter ? `` : `disabled`) + `/>
								</span>
							</div>
							<div>
								<label>
									<input type="checkbox" class="ehxCheck" id="stFilt" ` + (setStore.stFilter ? `checked` : ``) + `>Minimum Rating
								</label>
								<span>: Filter out any gallery with a rating less than:
									<input type="number" step="0.01" min="0" max="5" id="stLim" ` + (setStore.stFilter ? `` : `disabled`) + ` />
								</span>
							</div>
						</fieldset>
					</section>
					<section class="inactive">
						<fieldset style="padding-bottom: 2px;">
							<legend id="importTitle">Import Galleries</legend>
							<textarea id="ehx-importGalleries"></textarea>
							<div class="ehx-control" style="margin-top: 2px; margin-bottom: 4px; width: 100%; text-align: right;">
                                <label style="float: left;">
                                    <input type="checkbox" class="ehxCheck"  id="rawUrl">Import Raw URLs
                                </label>
								<button class="close">Close</button>
								<button id="importConfirm">Import</button>
                                <button id="importFF">From File</button>
                                <input id="ehxf-sInput" type="file" style="display: none;" />
							</div>
						</fieldset>
					</section>
					<section class="inactive">
						<fieldset style="padding-bottom: 2px;">
							<legend id="exportTitle">Export Galleries</legend>
							<textarea id="ehx-exportGalleries"></textarea>
							<div class="ehx-control" style="margin-top: 2px; margin-bottom: 4px;">
								<button class="close">Close</button>
								<button id="exportCopy">Copy</button>
								<button id="exportSave">Save</button>
							</div>
						</fieldset>
					</section>
					<section class="inactive">
						<fieldset>
							<legend id="history" style="margin-left: 5px;"></legend>
							<div id="listingContainer">
							</div>
						</fieldset>
					</section>
					<section class="inactive">
						<fieldset style="padding-bottom: 2px;">
							<legend>Advanced CSS</legend>
							<textarea id="ehx-advCss">` + cssC.custom + `</textarea>
							<div class="ehx-control" style="margin-top: 2px; margin-bottom: 4px;">
								<button class="close">Close</button>
								<button id="advCssClear">Clear</button>
								<button id="advCssSave">Save</button>
							</div>
						</fieldset>
					</section>
				</div>
				<div class="applyContainer">
					<div class="ehx-control" id="applyCon" style="padding-right: 5px;">
						<button id="ehx-apply">Apply</button>
					</div>
				</div>
			</div>
		</div>`);
		$('body').append(container);
		$('body').addClass('noscroll');
		galleries = sortObj(galleries);
		if (!$('#minAdd').prop('checked')) { $('#minShow').prop('disabled', true); }
        if (!$('#titleShow').prop('checked')) { $('#titleOn').prop('disabled', true); }
		$('#resV').click(e => { $('#visited').val('box-shadow: inset 0 0 0 500px rgba(2, 129, 255, .2) !important;'); }); // Default Values
		$('#resH').click(e => { $('#hidden').val('box-shadow: inset 0 0 0 500px rgba(255, 40, 0, .2) !important;'); });
		$('#resD').click(e => { $('#downloaded').val('box-shadow: inset 0 0 0 500px rgba(30, 180, 60, .2) !important;'); });
		$('#resF').click(e => { $('#filtered').val('box-shadow: inset 0 0 0 500px rgba(200, 0, 100, .2) !important;'); });
		$('#resU').click(e => { $('#ufiltered').val('box-shadow: inset 0 0 0 500px rgba(222, 184, 135, .2) !important;'); });
		$('#resP').click(e => { $('#page').val('box-shadow: inset 0 0 0 500px rgba(0, 0, 180, .2) !important;'); });
		$('#resR').click(e => { $('#rating').val('box-shadow: inset 0 0 0 500px rgba(180, 80, 60, .2) !important;'); });
        $('#resT').click(e => { $('#tag').val('box-shadow: inset 0 0 0 500px rgba(180, 130, 60, .2) !important'); });
		$('#stLim').val(setStore.stLimit);
		document.getElementById('bLim').selectedIndex = setStore.autoTime;
		$(document).on('change', 'input', e => { // Put the change listener on document since I suck at event propogation and bubbling
			if ($('#minAdd').prop('checked')) $('#minShow').prop('disabled', false);
			else $('#minShow').prop('disabled', true);

			if ($('#pFilt').prop('checked')) $('#pLim').prop('disabled', false);
			else $('#pLim').prop('disabled', true);

			if ($('#stFilt').prop('checked')) $('#stLim').prop('disabled', false);
			else $('#stLim').prop('disabled', true);

            if ($('#titleShow').prop('checked')) $('#titleOn').prop('disabled', false);
            else $('#titleOn').prop('disabled', true);

			if ($('#autoUpdate').prop('checked')) $('#bLim').prop('disabled', false);
			else $('#bLim').prop('disabled', true);

			if ($('#minAdd').is(e.target) || $('#minShow').is(e.target) || $('#repPub').is(e.target) || $('#titleShow').is(e.target) || $('#titleOn').is(e.target) || $('#cssTT').is(e.target) || $('#tagOn').is(e.target) || $('#autoUpdate').is(e.target)) {
				$('#setNotice').text('Applied Settings Will Take Effect On Reload');
				reload = 1;
			}
		});
		$('#bLim').change(e => {
			$('#setNotice').text('Applied Settings Will Take Effect On Reload');
			reload = 1;
		});
		$('#ehx-settings-close').click(e => {
			$('.ehx-overlay').remove();
			$('body').removeClass('noscroll');
		});
		$('body').click(e => {
			if (e.target.className == "ehx-overlay") { // Exit if settings menu isn't clicked
				$('.ehx-overlay').remove();
			} else if (e.target.className != 'show' && e.target.className != 'ehx-menu') {
				$('.show').removeClass('show');
			}
			if (!$('.ehx-overlay').length) $('body').removeClass('noscroll');
		});
		$('#ehx-apply').click(e => applySettings());

		/**
		 * Parse our HTML options into a temporary JSON array and then stringify it into localStorage
		 */
		function applySettings() { // TODO: Sort this shit out into one block
			setStore = { // Store this independantly, so it doesn't mess up table appends
				"softHide": $('#softHide').prop('checked'),
				"minAdd": setStore.minAdd,
				"minShow": setStore.minShow,
				"cssTT": $('#cssTT').prop('checked'),
				"repPub": setStore.repPub,
				"visHide": $('#ehx-show').text() === "Show" ? true : false,
				"hidShow": $('#ehxh-show').text() === "Hide" ? true : false,
				"pFilter": $('#pFilt').prop('checked'),
				"pLimit": $('#pFilt').prop('checked') ? $('#pLim').val() : "0",
				"stFilter": $('#stFilt').prop('checked'),
				"stLimit": $('#stFilt').prop('checked') ? $('#stLim').val() : "0",
				"titleShow": setStore.titleShow,
                "titleOn": setStore.titleOn,
                "tagPreview": $('#tagOn').prop('checked'),
				"autoUp": $('#autoUpdate').prop('checked'),
				"autoTime": $('#autoUpdate').prop('checked') ? $('#bLim').prop('selectedIndex') : "-1",
				"lastBack": setStore.lastBack
			}
			var tempSto = {
				"softHide": $('#softHide').prop('checked'),
				"minAdd": $('#minAdd').prop('checked'),
				"minShow": $('#minShow').prop('checked'),
				"cssTT": $('#cssTT').prop('checked'),
				"repPub": $('#repPub').prop('checked'),
				"visHide": $('#ehx-show').text() === "Show" ? true : false,
				"hidShow": $('#ehxh-show').text() === "Hide" ? true : false,
				"pFilter": $('#pFilt').prop('checked'),
				"pLimit": $('#pFilt').prop('checked') ? $('#pLim').val() : "0",
				"stFilter": $('#stFilt').prop('checked'),
				"stLimit": $('#stFilt').prop('checked') ? $('#stLim').val() : "0",
				"titleShow": $('#titleShow').prop('checked'),
                "titleOn": $('#titleOn').prop('checked'),
                "tagPreview": $('#tagOn').prop('checked'),
				"autoUp": $('#autoUpdate').prop('checked'),
				"autoTime": $('#autoUpdate').prop('checked') ? $('#bLim').prop('selectedIndex') : "-1",
				"lastBack": setStore.lastBack
			}
			localStorage.setItem('ehx-settings', JSON.stringify(tempSto)); // Write settings to localStorage
			var tempCss = {
				"visible": $('#visited').val(),
				"hidden": $('#hidden').val(),
				"download": $('#downloaded').val(),
				"filter":  $('#filtered').val(),
				"page": $('#page').val(),
				"rating": $('#rating').val(),
                "tag": $('#tag').val(),
				"uploader": $('#ufiltered').val()
			}
			cssA = tempCss;
			localStorage.setItem('ehx-css', JSON.stringify(tempCss));
			var tempFilt = { // Remove null entries because bad things happen if they're there
				"title": $('#galFilter').val().replace(/^\s*[\r\n]/gm, ''),
				"uploader": $('#upFilter').val().replace(/^\s*[\r\n]/gm, ''),
                "tag": $('#tagFilter').val().replace(/^\s*[\r\n]/gm, '')
			}
			filters = tempFilt;
			populateFilter();
			localStorage.setItem('ehx-filters', JSON.stringify(tempFilt));
			updateCSS();
			addCSS();
			displayAlert('Applied Current Settings', 5000, false);
		}

		$('.ehx-collapsible').click(e => { // Expand our custom filtering CSS boxes
			if ($('.ehx-active').length && !$('.ehx-active').is(e.target)) { // If a menu is open and it isn't the one we're clicking, close it
				$('.ehx-active').next().css('max-height', '');
				$('.ehx-active').toggleClass('ehx-active');
			}
			e.target.classList.toggle('ehx-active');
			var content = e.target.nextElementSibling;
			if (content.style.maxHeight) content.style.maxHeight = null;
			else content.style.maxHeight = '500px';
		});

		function swapContainer(index) {
			$('.section-container section').addClass('inactive');
			$('.section-container section:nth-child(' + index + ')').removeClass('inactive');
			if (index == 2) $('#ehx-importGalleries').val('');
		}

		$('#ehx-import').click(e => {
			swapContainer(2);
			activeStore = galleries;
			activeStoreTitle = 'galleries';
			$('#importTitle').text('Import Galleries');
		});
		$('#ehxh-import').click(e => {
			swapContainer(2);
			activeStore = hidden;
			activeStoreTitle = 'hidden';
			$('#importTitle').text('Import Hidden Galleries');
		});
		$('#ehxd-import').click(e => {
			swapContainer(2);
			activeStore = down;
			activeStoreTitle = 'down';
			$('#importTitle').text('Import Downloaded Galleries');
		});
		$('#ehxf-import').click(e => {
			$('#ehxf-input').trigger('click');
		});
		$('#ehxf-input').change(e => {
			var reader = new FileReader();
			reader.onload = function(event) {
				console.log('EhxVisited: Loaded File Successfully');
				ehxImportF(reader.result, null)
			};
			reader.readAsText($('#ehxf-input')[0].files[0]);
		});
        $('#ehxf-sInput').change(e => {
            var reader = new FileReader();
			reader.onload = function(event) {
				console.log('EhxVisited: Loaded File Successfully');
				ehxImportF(reader.result, activeStoreTitle)
			};
			reader.readAsText($('#ehxf-sInput')[0].files[0]);
        });
		$('#importConfirm').click(e => ehxImport($('#ehx-importGalleries').val().replace(/^\s*[\r\n]/gm, ''), $('#rawUrl').prop('checked')));
        $('#importFF').click(e => { $('#ehxf-sInput').trigger('click'); });

		$('.close').click(e => {
			$('.section-container section').addClass('inactive');
			$('.section-container section:first-child').removeClass('inactive');
			if (!$('#ehx-apply').length) $('.applyContainer').append($('<div class="ehx-control" id="applyCon" style="padding-right: 5px;"><button id="ehx-apply">Apply</button></div>'));
		});
		$('#ehx-home').click(e => {
			$('.section-container section').addClass('inactive');
			$('.section-container section:first-child').removeClass('inactive');
			$('#pages').remove();
			if (!$('#ehx-apply').length) $('.applyContainer').append($('<div class="ehx-control" id="applyCon" style="padding-right: 5px;"><button id="ehx-apply">Apply</button></div>'));
		});

		$('#exportCopy').click(e => {
			$('#ehx-exportGalleries').select();
			document.execCommand('copy');
			displayAlert('Copied Text To Clipboard', 5000);
		});
        $('#exportSave').click(e => {
            ehxExportSF(activeStoreTitle);
        });
		$('#ehx-export').click(e => {
			$('.section-container section').addClass('inactive');
			$('.section-container section:nth-child(3)').removeClass('inactive');
			$('#exportTitle').text('Exported Galleries');
			ehxExport('galleries');
            activeStoreTitle = 'galleries';
		});
		$('#ehxh-export').click(e => {
			$('.section-container section').addClass('inactive');
			$('.section-container section:nth-child(3)').removeClass('inactive');
			$('#exportTitle').text('Exported Hidden Galleries');
			ehxExport('hidden');
            activeStoreTitle = 'hidden';
		});
		$('#ehxd-export').click(e => {
			$('.section-container section').addClass('inactive');
			$('.section-container section:nth-child(3)').removeClass('inactive');
			$('#exportTitle').text('Exported Downloaded Galleries');
			ehxExport('down');
            activeStoreTitle = 'down';
		});
		$('#ehxf-export').click(e => {
            ehxExportF();
		});

		$('#ehx-adv-css').click(e => {
			$('#applyCon').remove();
			$('.section-container section').addClass('inactive');
			$('.section-container section:nth-child(5)').removeClass('inactive');
		});
		$('#advCssClear').click(e => { $('#ehx-advCss').val(""); });
        $('#advCssSave').click(e => {
            cssC.custom = $('#ehx-advCss').val();
            localStorage.setItem('ehx-cssc', JSON.stringify(cssC))
            updateCSS();
            addCSS();
			displayAlert('Applied Custom CSS', 5000, false);
        });

		$('#visHistory').click(e => {
			activeStore = galleries;
			activeStoreTitle = 'galleries';
			generateHistory('Viewed Galleries');
		});
		$('#hidHistory').click(e => {
			activeStore = hidden;
			activeStoreTitle = 'hidden';
			generateHistory('Hidden Galleries');
		});
		$('#dowHistory').click(e => {
			activeStore = down;
			activeStoreTitle = 'down';
			generateHistory('Downloaded Galleries');
		});

		function generateHistory(text) {
			$('#history').text(text);
			$('#applyCon').remove();

			var pageSelect = '<div id="pages">Page <select id="pageCount">';
			for (var i = 0; i < Math.ceil(Object.keys(activeStore).length / 25); i++) {
				pageSelect += '<option>' + (i + 1) + '</option>';
			}

			pageSelect += '</select> of ' + Math.ceil(Object.keys(activeStore).length / 25) + ' pages</div>';
			$('.section-container section').addClass('inactive');
			$('.section-container section:nth-child(4)').removeClass('inactive');
			$('.applyContainer').append($.parseHTML(pageSelect));

			var str = [];
			for (i = 0; i < 25; i++) str[i] = Object.keys(activeStore)[i];
			if (Object.keys(activeStore).length > 0) generateRequest(str);
		}

		$('.applyContainer').on('change', 'select', e => {
			var offset = $('#pageCount option:selected').text() - 1;
			var maxLength = ((offset * 25) + 25 <= Object.keys(activeStore).length) ? (offset * 25) + 25 : Object.keys(activeStore).length;
			var str = [];
			var count = 0;
			for (var i = offset * 25; i < maxLength; i++) str[count++] = Object.keys(activeStore)[i];
			generateRequest(str);
		});

		$('#ehx-clear').click(e => { // TODO: I want to condense these three blocks -----
			if (confirm('Are you sure you wish to clear all visited galleries?')) { // Make sure to double check before deleting
				var objStore2 = db.transaction('galleries', 'readwrite').objectStore('galleries');
				var openReq = objStore2.clear();
				openReq.onsuccess = e => {
					displayAlert('Cleared all entries', 5000, false);
					$('#ehx-clear').text('Clear Data');
					galleries = JSON.parse('{"data":{}}');
					$('#gLength').text(Object.keys(galleries).length);
					$('.ehx-visited').removeClass('ehx-visited');
					addCSS();
				}
			}
		});
		$('#ehxh-clear').click(e => {
			var objStore2 = db.transaction('hidden', 'readwrite').objectStore('hidden');
			var openReq = objStore2.getAll();
			openReq.onsuccess = e => {
				if (confirm('Are you sure you wish to clear all hidden galleries?')) {
					var objStore3 = db.transaction('hidden', 'readwrite').objectStore('hidden');
					var openReq = objStore3.clear();
					openReq.onsuccess = e => {
						displayAlert('Cleared all entries', 5000);
						$('#ehxh-clear').text('Clear Data');
						hidden = JSON.parse('{"data":{}}');
						$('#hLength').text(Object.keys(hidden).length);
						$('.ehx-hidden').removeClass('ehx-hidden');
						addCSS();
					}
				}
			}
		});
		$('#ehxd-clear').click(e => {
			var objStore2 = db.transaction('down', 'readwrite').objectStore('down');
			var openReq = objStore2.getAll();
			openReq.onsuccess = e => {
				if (confirm('Are you sure you wish to clear all downloaded galleries?')) {
					var objStore3 = db.transaction('down', 'readwrite').objectStore('down');
					var openReq = objStore3.clear();
					openReq.onsuccess = e => {
						displayAlert('Cleared all entries', 5000);
						$('#ehxd-clear').text('Clear Data');
						$('.ehx-downloaded').removeClass('ehx-downloaded');
						addCSS();
					}
				}
			}
		}); // ------//

		// Make sure there's not more than one top menu item open
		$('.ehx-menu').click(e => {
			if ($('.show').length) {
				if ($('.show').prev().is(e.target)) { $(e.target).next().toggleClass('show'); }
				else {
					$('.show').removeClass('show');
					$(e.target).next().toggleClass('show');
				}
			} else $(e.target).next().toggleClass('show');
		});
    }

    /**
	 * Check a specified element through the filters individually, then apply jqstyle tags for CSS
	 * @param {Object} el - A specific element within the DOM
	 */
    function filterCheck(el) { // TODO: See about sorting out this clusterfuck
        var gToken = $(el).find("a[href*='/g/']").attr('href').split('/');
        filterArrCheck(filterArr, cache[gToken[4] + '.' + gToken[5]].title, el, 'f');

        var upload = cache[gToken[4] + '.' + gToken[5]].uploader;
        filterArrCheck(uploaderArr, upload, el, 'u');
        filterArrCheck(tagArr, cache[gToken[4] + '.' + gToken[5]].tags, el, 't');

        // Filter our galleries through the star limit filter
        if (setStore.stFilter && setStore.stLimit > 0) {
            if (cache[gToken[4] + '.' + gToken[5]].rating < setStore.stLimit) {
                if (!$(el).hasClass('ehx-hidden')) $(el).addClass('ehx-hidden');
                if (!($(el).attr('data-jqstyle') || '').match('r')) addStyle($(el), 'r');
            } else if ($(el).hasClass('ehx-hidden')) removeStyle($(el), 'r');
        } else if ($(el).hasClass('ehx-hidden')) removeStyle($(el), 'r');


        var pages = cache[gToken[4] + '.' + gToken[5]].filecount;
        if (setStore.pFilter && setStore.pLimit > 0) {
            if (parseInt(pages) < parseInt(setStore.pLimit)) {
                if (!$(el).hasClass('ehx-hidden')) $(el).addClass('ehx-hidden');
                if (!($(el).attr('data-jqstyle') || '').match('p')) addStyle($(el), 'p');
            } else if ($(el).hasClass('ehx-hidden')) removeStyle($(el), 'p');
        } else if ($(el).hasClass('ehx-hidden')) removeStyle($(el), 'p');
    }

    function filterArrCheck(array, test, el, flag) {
        if (array.length) {
            if (array.some(rx => rx.test(test))) {
                if (!$(el).hasClass('ehx-hidden')) $(el).addClass('ehx-hidden');
                if (!($(el).attr('data-jqstyle') || '').match(flag)) addStyle($(el), flag);
            } else if ($(el).hasClass('ehx-hidden')) removeStyle($(el), flag);
        } else if ($(el).hasClass('ehx-hidden')) removeStyle($(el), flag);
    }

    /**
     * Adds the specified style flag to a specified element
	 * @param {Object} el - A specific element within the DOM
	 * @param {String} flag - A character to mark an element for JQ Styling CSS rules
	 */
    function addStyle(el, flag) {
        if ($(el).attr('data-jqstyle')) $(el).attr('data-jqstyle', $(el).attr('data-jqstyle') + flag);
        else $(el).attr('data-jqstyle', flag);
    }

    /**
     * Removes the specified style flag from a specified element
	 * @param {Object} el - A specific element within the DOM
	 * @param {string} flag - A JQ Style flag to remove from an element
	 */
    function removeStyle(el, flag) {
        if ($(el).attr('data-jqstyle')) {
            $(el).attr('data-jqstyle', $(el).attr('data-jqstyle').replace(flag, ''));
            if (!$(el).attr('data-jqstyle')) $(el).removeClass('ehx-hidden'); // Replacing the flag brought jqstyle to blank
        } else $(el).removeClass('ehx-hidden');
    }

    /**
     * Toggles a specified element's hidden status
	 * @param {String} tga - Full gallery URL
	 * @param {Object} el - A specific element within the DOM
	 */
    function toggleElement(tga, el) {
        const request = indexedDB.open('ehxvisited', 2);
        var tgid = tga.split('/')[4] + '.' + tga.split('/')[5];

        request.onsuccess = e => {
            db = e.target.result;
            var objStore = db.transaction('hidden', 'readwrite').objectStore('hidden');
            var openReq = objStore.openCursor(tgid);
            openReq.onsuccess = e => {
                var cursor = e.target.result;
                if (cursor) { // Gallery already exists within our hidden table
                    cursor.delete();
                    console.log('EhxVisited: Removed ' + tgid + ' from hidden list.');
                    $(el).css('display', '');
                    $(el).removeClass('ehx-hidden');
                    removeStyle($(el), 'h');
                    delete hidden[tgid]; // Remove gallery listing from our local store of hidden galleries
                } else {
                    objStore.put({id: tgid}); // Put the gallery into our hidden table
                    console.log('EhxVisited: Added ' + tgid + ' to hidden list.');
                    $(el).addClass('ehx-hidden');
                    if ($('#ehxh-show').text() === 'Hide') $(el).css('display', $('.gl1t').length ? 'flex' : 'table-row');
                    addStyle($(el), 'h');
                    hidden[tgid] = 1; // Add gallery listing to our local store of hidden galleries
                }
                updateGListing();
            }
        }
    }

	/**
	 * Deletes the item from the history tab and database
	 * TODO: Combine this and toggleElement into a more generic function
	 * @param {String} href - URL of the gallery
	 * @param {HTML Element} el - The parent element to apply CSS to
	 */
	function deleteHistory(href, el) {
		const request = indexedDB.open('ehxvisited', 2);
		var tgid = href.split('/')[4] + '.' + href.split('/')[5];

		request.onsuccess = e => {
			db = e.target.result;
			var objStore = db.transaction(activeStoreTitle, 'readwrite').objectStore(activeStoreTitle);
			var openReq = objStore.delete(tgid);
			openReq.onsuccess = e => {
				console.log('EhxVisited: Removed ' + tgid + ' from ' + activeStoreTitle + ' DB.');
				delete activeStore[tgid];
				displayAlert("Removed " + tgid + " from the database", 5000, false);
				$(el).addClass('removed');
				updateGListing();
			}
		}
        delete activeStore[tgid];
        addCSS();
	}

	/**
	 * Sorts a dictionary based off the value of a key
	 * @param {Dictionary} obj - A dictionary
	 * @return {Dictionary} sorted_obj - A sorted dictionary
	 */
    function sortObj(obj) {
        var items = Object.keys(obj).map(k => [k, obj[k]]); // Convert Dictionary into an array of arrays
        items.sort((a, b) => b[1] - a[1]); // Sort by value of original key value pair
        var sorted_obj = {};
        $.each(items, (k, v) => {
            sorted_obj[v[0]] = v[1] // Put the items back into Dictionary form
        })
        return (sorted_obj);
    }

	/**
	 * Returns an object with the current URL parameters
	 */
	function getUrlVars() {
		var vars = {};
		var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
			vars[key] = value;
		});
		return vars;
	}

	/**
     * Convert the star count of a specified element to a double
	 * @param {Object} el - A specific element within the DOM
	 */
    function getStarNumber(el, transpose) {
		var starCount = {5: '0px -1px', 4.5: '0px -21px', 4: '-16px -1px', 3.5: '-16px -21px', 3: '-32px -1px', 2.5: '-32px -21px', 2: '-48px -1px', 1.5: '-48px -21px', 1: '-64px -1px', 0.5: '-64px -21px'};
		if (!transpose) {
			var stars = $(el).find('.ir').css('background-position');
			return Object.keys(starCount).find(key => starCount[key] === stars);
		} else return starCount[(Math.round(el * 2) / 2).toFixed(1)]; // Ratings are given in x.xx numbers, but we need either whole integers, or half integers
    }

	/**
     * Build the time difference string
     * @param {String} gid - Gallery ID
	 * @param {Boolean} time - Include timeDifference in returned string
	 * @param {Boolean} abbrv - Abbreviate for timeDifference
     */
    function buildTime(gid, time, abbrv) {
        var d = new Date(galleries[gid]);
		var str = d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0') + ' ' + d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
		if (time) return timeDifference(gid, abbrv) + ' ' + str;
		return str;
    }

    /**
	 * Get time difference in words
	 * @param {Date} previous - Previous date to compare against Date.now()
	 * @param {Boolean} abbreviate - Should the text string have abbreviatated text
	 */
    function timeDifference(gallery, abbreviate) {
		var previous = galleries[gallery];
        var msPerMinute = 60 * 1000;
        var msPerHour = msPerMinute * 60;
        var msPerDay = msPerHour * 24;
        var msPerMonth = msPerDay * 30;
        var msPerYear = msPerDay * 365;
        var elapsed = Date.now() - previous;
        var count;

        if (elapsed < msPerMinute) {
            return Math.round(elapsed / 1000) + ((typeof abbreviate !== 'undefined') ? '&nbsp;sec' : Math.round(elapsed / 1000) > 1 ? ' seconds ago' : ' second ago');
        } else if (elapsed < msPerHour) {
            return Math.round(elapsed / msPerMinute) + ((typeof abbreviate !== 'undefined') ? '&nbsp;min' : Math.round(elapsed / msPerMinute) > 1 ? ' minutes ago' : ' minute ago');
        } else if (elapsed < msPerDay) {
            return Math.round(elapsed / msPerHour) + ((typeof abbreviate !== 'undefined') ? Math.round(elapsed / msPerHour) > 1 ? '&nbsp;hrs' : '&nbsp;hr' : Math.round(elapsed / msPerHour) > 1 ? ' hours ago' : ' hour ago');
        } else if (elapsed < msPerMonth) {
            return Math.round(elapsed / msPerDay) + ((typeof abbreviate !== 'undefined') ? Math.round(elapsed / msPerDay) > 1 ? '&nbsp;days' : '&nbsp;day' : Math.round(elapsed / msPerDay) > 1 ? ' days ago' : ' day ago');
        } else if (elapsed < msPerYear) {
            return Math.round(elapsed / msPerMonth) + ((typeof abbreviate !== 'undefined') ? Math.round(elapsed / msPerMonth) > 1 ? '&nbsp;mos' : '&nbsp;mo' : Math.round(elapsed / msPerMonth) > 1 ? ' months ago' : ' month ago');
        } else {
            return Math.round(elapsed / msPerYear) + ((typeof abbreviate !== 'undefined') ? Math.round(elapsed / msPerYear) > 1 ? '&nbsp;yrs' : '&nbsp;yr' : Math.round(elapsed / msPerYear) > 1 ? ' years ago' : ' year ago');
        }
    }

	/**
	 * Displays a div at the top of the page with a message
	 * @param {String} message - A message to be displayed within the alert
	 * @param {Integer} timeout - Millseconds message should be displayed for
	 * @param {Boolean} error - Is this an error message
	 */
	function displayAlert(message, timeout, error) {
		var alert = $('<div class="ehx-notice ' + ((error) ? 'alert' : '') + '">EhxVisited: ' + message + '</div>');
		$(alert).hide().appendTo('.ehx-alertContainer').fadeIn(1000);
		setTimeout(e => { $('.ehx-notice').fadeOut(1000, f => { $('.ehx-notice').remove(); }); }, timeout);
	}

    /**
     * Generate the JSON request for the E-H API
     * @param {IndexedDB Keys} data - Object keys within the data portion of our matrices
     */
    function generateRequest(data) {
		$('#listingContainer').empty();
        var reqList = []; // We use an array for our gidlist, since the API can handle up to 25 galleries per request
        for (var i = 0; i < data.length; i++) {
			if (data[i] == undefined) continue;
            var str = data[i].split('.'); // Split the key to match request specifications of galleryID, galleryToken
            reqList[i] = [str[0], str[1]];
        }
        var request = {"method": "gdata", "gidlist": reqList, "namespace": 1};

        var req = new XMLHttpRequest();
        req.onreadystatechange = e => {
            if (req.readyState == 4) {
				if (req.status == 200) {
					var apirsp = JSON.parse(req.responseText);
					//console.log(apirsp);
					for (var i = 0; i < apirsp.gmetadata.length; i++) generateListing(apirsp.gmetadata[i]);
				} else {
					console.error();
					displayAlert("Request Failed", 5000, true);
				}
			}
        }
        req.open("POST", document.location.origin + "/api.php", true); // Due to CORS, we need to use the API on the same domain as the script
        req.send(JSON.stringify(request));
    }

	function generateCacheRequest(request) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.onreadystatechange = e => {
                if (req.readyState == 4) {
			    	if (req.status == 200) {
			    		var apirsp;
                        try {
                            apirsp = JSON.parse(req.responseText);
                        } catch (e) {
                            console.log('EhxVisited: Error' + e.message);
                        }
					    //console.log(apirsp);
			    		for (var i = 0; i < apirsp.gmetadata.length; i++) cache[apirsp.gmetadata[i].gid + '.' + apirsp.gmetadata[i].token] = apirsp.gmetadata[i];
                        resolve();
			    	} else {
			    		console.error();
                        reject(req.status);
			    	}
			    }
            }
            req.open("POST", document.location.origin + "/api.php", true);
            req.send(JSON.stringify(request));
        });
    }

	/**
	 * Generate the HTML code for each individual listing in history views
	 * @param {JSON Array} glisting - E-H API response item for a specified gallery
	 */
	function generateListing(glisting) {
		var d = new Date(glisting.posted * 1000);
        generateTags(glisting);
        let taglist = "<table><tbody>";
        for (const namespace in tags) {
            taglist += `<tr><td class="tc">${namespace}:</td><td>`;
            for (var i = 0; i < tags[namespace].length; i++) {
                taglist += `<div id="td_${namespace}:${tags[namespace][i]}" class="gt" style="opacity:1.0"><a id="ta_${namespace}:${tags[namespace][i]}" href="${document.location.origin}/tag/${namespace}:${tags[namespace][i]}">${tags[namespace][i]}</a></div>`;
            }
            taglist += "</td></tr>";
        }
        taglist += "</tbody></table>";
        let torrentList = "";
        if (glisting.torrentcount > 0) {
            torrentList = `<div class='torrents'style='border-top:1px solid #000; padding: 10px 10px 5px 10px; margin-right: 10px;'><p><span class='halp' title="If these links don't work, this gallery likely had a parent gallery">Possible Torrents:</span></p>`;
            for (var j = 0; j < glisting.torrentcount; j++) {
                torrentList += `<div><img src="` + (window.location.hostname.indexOf("exhentai") >= 0 ? "https://exhentai.org/img/mr.gif" : "https://ehgt.org/g/mr.gif") + `" /><a class="tlink" title="` + glisting.torrents[j].name + `" href="` + generateTorrentLink(glisting, j) + `">` + glisting.torrents[j].name + `</a>&#9;<span>` + getPrettyFileSize(glisting.torrents[j].fsize) + `</span><span style="float: right; position: relative; top: 3px;">Added ` + getTimestampDateString(glisting.torrents[j].added * 1000) + `</span></p></div>`;
            }
            torrentList += "</div>";
        }
		// TODO: See about replacing the custom date with a buildTime call
		var listing = $(`
		<div class="ehx-listing">
			<div class="thumb">
				<a href="` + document.location.origin + '/g/' + glisting.gid + '/' + glisting.token + `">
					<img src="` + glisting.thumb + `" />
				</a>
			</div>
			<div class="listBody">
				<div class="title" style="width: 90%">
					<a href="` + document.location.origin + '/g/' + glisting.gid + '/' + glisting.token + '/">' + glisting.title + `</a>
                    <p>` + glisting.title_jpn + `</p>
				</div>
                <div class="taglist">` + taglist + torrentList + `</div>
				<div class="ehx-category">
					<div class="cn ` + category[glisting.category.toLowerCase().replace(/ /g, '').replace(/-/g, '')] + `">
						<a href="` + document.location.origin + '/' + glisting.category.toLowerCase().replace(/ /g, '') + '">' + glisting.category + `</a>
					</div>
					<div class="ehx-date">
						` + getTimestampDateString(d).slice(0, 16) + `
					</div>
				</div>
				<div class="rating">
					<div>
						<a href="` + document.location.origin + '/uploader/' + glisting.uploader + '">' + glisting.uploader + `</a>
					</div>
					<div>
						` + glisting.filecount + ` pages
					</div>
					<div class="ir" style="float: right; background-position: ` + getStarNumber(glisting.rating, true) + `"></div>
				</div>
                <div class="tagToggle"><a>Show Tags and Torrents &#x25BE;</a></div>
			</div>
		</div>`);
		$('#listingContainer').append(listing);
        $('.tagToggle > a').on('click', e => {
            if ($(e.currentTarget).parents().eq(1).find('.taglist').css('display') == 'none') {
                e.stopImmediatePropagation(); // Have to put this in because apparently, this event wants to fire like 12 times in a row
                $(e.currentTarget).parents().eq(1).find('.taglist').css('display', 'block');
                $(e.currentTarget).parents().eq(2).css('height', 'unset');
                $(e.currentTarget).parents().eq(2).css('height', parseInt($(e.currentTarget).parents().eq(2).css('height').substr(0, 3)) + 70 + 'px');
                $(e.currentTarget).text('Hide Tags and Torrents \u25B4');
            } else {
                e.stopImmediatePropagation(); // I have no idea why it does that, it just does
                $(e.currentTarget).parents().eq(1).find('.taglist').css('display', 'none');
                $(e.currentTarget).parents().eq(2).css('height', '140px');
                $(e.currentTarget).text('Show Tags and Torrents \u25BE');
            }
        });
		$('<div class="imgContainer"><img class="ehx-imgHide" src="' + img_hide + '" title="Show/Hide Gallery"></div>').appendTo($('.listBody').last()).on('click', e => {
			deleteHistory($(e.currentTarget).parents().eq(1).find('a').attr('href'), $(e.currentTarget).parents().eq(1));
		});
	}

	function generateCacheListing(element, tempCache) {
        for (var i = 0; i < $(element).length; i++) {
            let split = $(element)[i].href.split('/');
			if (cache[split[4] + '.' + split[5]] == undefined) tempCache[i] = [split[4], split[5]];
        }
        return tempCache;
    }

    /**
	 * Generate the inner HTML for the tag preview window
	 * @param {JSON} apirsp - The E-H API response
	 */
	function generateTagPreview(apirsp) {
        generateTags(apirsp); // We actually have to generate the tag list from the raw JSON file
		document.getElementById('tagPreview').innerHTML = `<h1 id="gn">${apirsp.title}</h1><h1 id="gj">${apirsp.title_jpn}</h1>`;
		let taglist = "<div id='taglist' style='height:fit-content;'><table><tbody>";
        for (const namespace in tags) {
            taglist += `<tr><td class="tc">${namespace}:</td><td>`;
            for (var i = 0; i < tags[namespace].length; i++) {
                taglist += `<div id="td_${namespace}:${tags[namespace][i]}" class="gt" style="opacity:1.0"><a id="ta_${namespace}:${tags[namespace][i]}" href="${document.location.origin}/tag/${namespace}:${tags[namespace][i]}">${tags[namespace][i]}</a></div>`;
            }
            taglist += "</td></tr>";
        }
        taglist += "</tbody></table></div>";
        document.getElementById('tagPreview').innerHTML = document.getElementById('tagPreview').innerHTML + taglist;
	}

    /**
	 * Converts the tag listing within the API response to a categorized array
	 * @param {JSON} apirsp - The E-H API response
	 */
    function generateTags(apirsp) {
        tags = {}; // Reset the tags array for each new tag listing
		if (Array.isArray(apirsp.tags)) {
			for (const jsonTag of apirsp.tags) {
				const stringTag = getJsonString(jsonTag);
				if (stringTag === null) { continue; }

				const {tag, namespace} = getTagAndNamespace(stringTag);

				let namespaceTags;
				if (tags.hasOwnProperty(namespace)) { namespaceTags = tags[namespace]; }
                else {
					namespaceTags = [];
					tags[namespace] = namespaceTags;
				}
				namespaceTags.push(tag);
			}
		}
	}

    function generateTorrentLink(glisting, index) {
        if (window.location.hostname.indexOf("exhentai") > 0) return window.location.origin + "/torrent/" + glisting.gid + "/" + glisting.torrents[index].hash + ".torrent";
        else return "https://ehtracker.org/get/" + glisting.gid + "/" + glisting.torrents[index].hash + ".torrent";
    }

    function getTagAndNamespace(tag) {
		const pattern = /^(?:([^:]*):)?([\w\W]*)$/;
		const match = pattern.exec(tag);
		return (match !== null) ?
			({ tag: match[2], namespace: match[1] || "misc" }) :
			({ tag: tag, namespace: "misc" });
	}

	function toProperCase(text) {
		return text.replace(/(^|\W)(\w)/g, (m0, m1, m2) => `${m1}${m2.toUpperCase()}`);
	}

	function getJsonString(value) {
		if (typeof(value) === "string") { return value; }
		if (typeof(value) === "undefined" || value === null) { return value; }
		return `${value}`;
	}

    function getPrettyFileSize(bytes) {
	    const ii = fileSizeLabels.length - 1;
	    let i = 0;
	    while (i < ii && bytes >= 1024) {
		    bytes /= 1024;
		    ++i;
	    }
	    return `${bytes.toFixed(i === 0 ? 0 : 2)} ${fileSizeLabels[i]}`;
    }

    function getTimestampDateString(timestamp) {
	    const date = new Date(timestamp);
	    const year = date.getUTCFullYear().toString();
	    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
	    const day = date.getUTCDate().toString().padStart(2, "0");
	    const hour = date.getUTCHours().toString().padStart(2, "0");
	    const minute = date.getUTCMinutes().toString().padStart(2, "0");
        const seconds = date.getUTCSeconds().toString().padStart(2, "0");
	    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    }

    /**
	 * Import user data into our indexedDB
	 * @param {String} items - String of exported data to import
     * @param {Boolean} raw - Boolean representing if we're importing raw URLs
	 */
    function ehxImport(items, raw) {
		const req = indexedDB.open('ehxvisited', 2);
		req.onsuccess = e => {
			if (db == null) db = e.target.result;
			var objStore = db.transaction(activeStoreTitle, 'readwrite').objectStore(activeStoreTitle);
			var count = 0, sp = '';

            if (raw) {
                var textArr = items.split('\n');
                var tempStr = '';
                for (var i = 0; i < textArr.length; i++) {
                    var str = textArr[i].split('/')
                    tempStr += str[4] + "." + str[5] + ":" + Date.now() + ";";
                }
                sp = tempStr.split(';'); // I just pulled this block from a function I wrote, it could be adapted better
            } else { sp = items.split(';'); }
			sp = sp.filter(Boolean); // Filter out any null ('') entries
			insertNext();

			/**
			 * Push entries into the specified indexedDB store
			 */
			function insertNext() {
				if (count < sp.length) {
					var str = sp[count].split(':');
					objStore.put({id: str[0], visited: parseInt(str[1])}).onsuccess = insertNext; // Update the record if it's there, or add it if it's not, then continue
					activeStore[str[0]] = str[1];
					++count;
				} else {
					displayAlert('Imported ' + count + ' entries', 5000);
					console.log('EhxVisited: Merge Completed');
					updateGListing();
					addCSS();
				}
			}
		}
    }

    function ehxImportF(data, store) {
        const req = indexedDB.open('ehxvisited', 2);
        req.onsuccess = e => {
            if (db == null) db = e.target.result;
            var transaction = db.transaction(db.objectStoreNames, 'readwrite')
            var sp = '', splData;

            // Split file by delimiter
			splData = data.split('\n');

            // Split galleries
			sp = (store == null) ? splData[0].split(';') : data.split(';');
            sp = sp.filter(Boolean);
			activeStore = galleries;
            if (store == null || store == 'galleries') insertNext('galleries');

            // Split hidden
			sp = (store == null) ? splData[1].split(';') : data.split(';');
            sp = sp.filter(Boolean);
			activeStore = hidden;
            if (store == null || store == 'hidden') insertNext('hidden');
            // Split downloaded
			sp = (store == null) ? splData[2].split(';') : data.split(';')
            sp = sp.filter(Boolean);
			activeStore = down;
            if (store == null || store == 'down') insertNext('down');

            function insertNext(objStore) {
                var count = 0;
				sp.forEach(function(s) {
					var str = s.split(':');
					var request = transaction.objectStore(objStore).put({id: str[0], visited: parseInt(str[1])}); // Update the record if it's there, or add it if it's not, then continue
					activeStore[str[0]] = str[1];
                    request.onsuccess = e => {
                        count++;
                        if (count == sp.length) { callback(); }
                    }
				})
                function callback() {
                    var countRequest = transaction.objectStore(objStore).count();
                    countRequest.onsuccess = e => {
                        displayAlert('Merged ' + countRequest.result + ' entries', 5000);
                        console.log('EhxVisited: Merge Completed');
                        updateGListing();
                        addCSS();
                    }
                }
			}
        }
        req.onerror = function(event) {
            console.log(event.target.errorCode);
        }
    }

	/**
	 * Fills a text area with formatted gallery data for export
	 * @param {IndexedDB Title} store - The name of an indexedDB store
	 */
	function ehxExport(store) {
		const req = indexedDB.open('ehxvisited', 2);
		req.onsuccess = e => {
			if (db == null) db = e.target.result;
			var objStore = db.transaction(store, 'readonly').objectStore(store);
			var openReq = objStore.getAll();
			openReq.onsuccess = e => {
				var data = '';
				for (var i in e.target.result) {
					data += e.target.result[i].id + ':' + e.target.result[i].visited + ';';
				}
				$('#ehx-exportGalleries').val(data); // Fill with formatted data
			}
		}
	}

    function ehxExportSF(store) {
		const req = indexedDB.open('ehxvisited', 2);
		req.onsuccess = e => {
			if (db == null) db = e.target.result;
			var objStore = db.transaction(store, 'readonly').objectStore(store);
			var openReq = objStore.getAll();
			openReq.onsuccess = e => {
				var data = '';
				for (var i in e.target.result) {
					data += e.target.result[i].id + ':' + e.target.result[i].visited + ';';
				}
				var a = document.createElement('a');
                document.body.appendChild(a);
                a.style = 'display: none';
                var blob = new Blob([data], {type: "octet/stream"}),
                    urlD = window.URL.createObjectURL(blob);
                a.href = urlD;
                a.download = 'ehxvisited-' + store + '-' + getTimestampDateString(Date.now()) + '.txt';
                a.click();
                window.URL.revokeObjectURL(urlD);
                a.remove();
			}
		}
    }

    function ehxExportF() {
        var data = '';
        const req = indexedDB.open('ehxvisited', 2);
        req.onsuccess = e => {
            if (db == null) db = e.target.result;
            var objStore = db.transaction('galleries', 'readonly').objectStore('galleries');
            var openReq = objStore.getAll();
            openReq.onsuccess = f => {
                for (var i in f.target.result) {
                    data += f.target.result[i].id + ':' + f.target.result[i].visited + ';';
                }
                data += '\n';
                var objStore2 = db.transaction('hidden', 'readonly').objectStore('hidden');
                var openReq2 = objStore2.getAll();
                openReq2.onsuccess = g => {
                    for (i in g.target.result) {
                        data += g.target.result[i].id + ':' + g.target.result[i].visited + ';';
                    }
                    data += '\n';
					var objStore3 = db.transaction('down', 'readonly').objectStore('down');
					var openReq3 = objStore3.getAll();
					openReq3.onsuccess = h => {
						for (i in h.target.result) {
							data += h.target.result[i].id + ':' + h.target.result[i].visited + ';';
						}
                        var a = document.createElement('a');
                        document.body.appendChild(a);
                        a.style = 'display: none';
                        var blob = new Blob([data], {type: "octet/stream"}),
                            urlD = window.URL.createObjectURL(blob);
                        a.href = urlD;
                        a.download = 'ehxvisited-' + getTimestampDateString(Date.now()) + '.txt';
                        a.click();
                        window.URL.revokeObjectURL(urlD);
                        a.remove();
                    }
                }
            }
        }
    }

    /**
     * Remove our stylesheet with transient CSS, and then re-add it with the updated CSS
     */
    function updateCSS() {
		cssD = (setStore.softHide) ? 'opacity:0.2; -webkit-opacity: 0.2;' : 'display: none;';
        $('#setStyle').remove();
        $('#ehxAdv').remove();
        $(`<style id="setStyle" data-jqstyle="ehxVisited">
        table.itg > tbody > .ehx-visited, .ehx-visited { ` + cssA.visible + ` }
        table.itg > tbody > .ehx-visited.ehx-hidden, .ehx-visited.ehx-hidden { ` + cssA.hidden + ` }
        .ehx-hidden { ` + cssD + cssA.hidden + ` }
		.ehx-downloaded { ` + cssA.download + ` }
        .ehx-hidden[data-jqstyle*="f"] {` + cssA.filter + `}
        .ehx-hidden[data-jqstyle*="p"] {` + cssA.page + `}
        .ehx-hidden[data-jqstyle*="r"] {` + cssA.rating + `}
        .ehx-hidden[data-jqstyle*="u"] {` + cssA.uploader + `}
        .ehx-hidden[data-jqstyle*="t"] {` + cssA.tag + `}
        </style>`).appendTo('head');
        $(`<style id="ehxAdv" data-jqstyle="ehxVisited">` + cssC.custom + `</style>`).appendTo('head');
    }

    // The giant CSS block
    $(`<link rel="stylesheet" media="screen" href="https://fontlibrary.org/face/symbola" type="text/css"/>
    <style data-jqstyle='ehxVisited'>
#ehx-controls {
	padding: 3px 1px;
	text-align: center;
	display: block;
}
#ehx-settings, #ehx-show, #ehxh-show {
    cursor: pointer;
    text-decoration: underline;
}
#ehx-hideCount > span { border-bottom: 1px dotted currentColor; }
#ehx-importGalleries, #ehx-exportGalleries, #ehx-advCss { min-height: 414px; }
#ehx-settings-close {
	text-decoration: none;
	position: absolute;
	top: 0px;
	right: 5px;
	font-size: 1.4em;
}
@-moz-document url-prefix() {
    #ehx-settings-close {
        top: -2px;
        -webkit-text-stroke: 1px;
    }
}
#ehx-export, #ehxh-export, #ehx-import, #ehxh-import, #ehx-settings-close { cursor: pointer; }
#ehx-topNav {
    border-bottom: 1px solid threedface;
    left: -4px;
    min-width: 898px;
}
#ehx-visControls { top: -6px; }
div > .ehx-imgHide {
	cursor: pointer !important;
	position: absolute;
	bottom: 3px;
	left: 2px;
}
ehx { font-family:` + $('body').css('font-family') + `, arial, symbola, SymbolaRegular;  }
input[type="checkbox"].ehxCheck {
	-webkit-appearance: none;
	border: 1px solid #F1F1F1BB;
	padding: 5px;
	top: 4px;
	background-color: transparent;
}
input[type="checkbox"].ehxCheck:checked:after {
	content: '\\2714';
	position: absolute;
	top: -8px;
	left: 1px;
	font-size: 1.1em;
}
input[type="checkbox"].ehxCheck:focus { outline: none; }
input[type="checkbox"].ehxCheck:hover { cursor: pointer; }
nav > div {
	text-align: right;
	margin-right: 30px;
}
nav > div button {
	border: none !important;
	padding: 1px 20px 1px 10px !important;
	position: relative;
}
section:nth-child(4) fieldset {
	padding: 0px;
	min-height: 467px;
}
td.hideContainer .ehx-imgHide {
	cursor: pointer !important;
	vertical-align: middle;
}
.ehx-active:after { content: '\\2212' !important; }
.ehx-alertContainer {
    position: fixed;
    width: 100%;
    z-index: 200;
    top: 0px;
	font-size: 8pt;
}
.applyContainer {
	padding-top: 5px;
	padding-right: 8px;
	border-top: 1px solid threedface;
	width: 100%;
	position: relative;
	left: -4px;
}
.ehx-branch {
	position: absolute;
	left: 10px;
	top: 1px;
	margin-left: -3px;
}
.ehx-category {
	text-align: center;
	position: absolute;
	left: 115px;
	bottom: 3px;
	line-height: 20px;
}
.ehx-collapsible {
	cursor: pointer;
	width: 100%;
	border: 0;
	outline: none;
	text-align: left;
	font-size: 1.25em;
	background-color: rgba(0, 0, 0, 0);
	color: inherit;
	font-weight: bold;
	padding:5px 3px;
	position: relative;
}
.ehx-collapsible:after {
	content: '\\002B';
	font-weight:bold;
	float:right;
	margin-right:5px;
}
.ehx-collapsible:before {
	content: '';
	position: absolute;
	padding: 4px;
	border-bottom: 1px solid threedface;
	border-left: 1px solid threedface;
	top: 5px;
	left: -11px;
}
.ehx-collapsible:hover { background-color: rgba(255, 255, 255, 0.1); }
.ehx-content {
	max-height: 0;
	overflow: hidden;
	transition: all .2s ease-in-out;
	border-bottom: 1px solid threedface;
}
.ehx-content button {
	margin-top: 3px;
	margin-right: 10px;
}
.ehx-control {
	position: relative;
	float: right;
	right: -5px;
}
.ehx-date {
	font-style: italic;
	font-weight: bold;
}
.ehx-dropdown {
	display: none;
	position: absolute;
	z-index: 999;
	min-width: 150px;
	padding: 2px;
	border-radius: 1px;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	right: 0px;
	border: 1px solid threedface;
	background: ` + $('.ido').css('background') + `;
	background: ` + $('.ido').css('backgroundColor') + `;
}
.ehx-dropdown a {
	display: block;
	text-decoration: none;
	padding-right:2px;
}
.ehx-dropdown a:hover { background: rgba(255,255,255,0.2); }
.ehx-compact {
	border-style: solid;
	border-width: 1px 0;
	text-align: center;
}
.ehx-extended {
	width: 120px;
	position: absolute;
	left: 3px;
	top: 172px;
	text-align: center;
	font-size: 8pt;
	line-height: 1.5;
}
.ehx-extended-favs {
	padding: 3px 1px;
	display: block;
	line-height: 1.5;
}
.ehx-minimal {
    border-left: 1px solid #6f6f6f4d;
    text-align: center;
}
.ehx-thumbnail {
	display: block;
	text-align: center;
	margin: 3px 0 5px;
	line-height: 12px;
}
.ehx-visited .gl3e { min-height: 206px; }
.ehx-visited .gl4e { min-height: 264px !important; }
.gl2c { width: 115px; }
.gltc ehx { white-space: nowrap; }
.gltc td.hideContainer {
	border-bottom: 1px solid #6f6f6f4d;
	border-top: 1px solid #6f6f6f4d;

}
.gl5t {
    height: 63px;
    position: relative;
}
.glte .ehx-imgHide {
    cursor: pointer !important;
    padding: 4px 2px 0px 1px;
    top: 3px;
    right: 5px;
    left: initial;
    bottom: initial;
}`
 + ((setStore.titleShow && !setStore.titleOn) ? `.itg > .gl1t > a:first-of-type {
	overflow: hidden;
	min-height: 32px;
	max-height: 32px;
	margin: 6px 4px 0;
	position: relative;
	display: block;
}
.itg > .gl1t > a:first-of-type > .glname {
	overflow: visible;
	min-height: auto;
	max-height: none;
	margin: 0;
}
.itg > .gl1t:hover > a:first-of-type,
.itg > .gl1t:hover > .glname {
    overflow: visible;
	z-index: 10;
}
.itg > .gl1t:hover > a:first-of-type > .glname,
.itg > .gl1t:hover > .glft > div:nth-child(1) {
    padding-bottom: 0.25em;
    height: fit-content;
    height: -moz-fit-content;
    background: rgba(0,0,0,0.5);
}
div.gl4t {
    font-weight: bold;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}` : ``) + (setStore.titleOn ? `.itg > .gl1t > a:first-of-type {
	margin: 6px 4px 0;
	position: relative;
	display: block;
}
.itg > .gl1t > a:first-of-type > .glname {
	overflow: visible;
	min-height: auto;
	max-height: none;
	margin: 0;
}
.itg > .gl1t:hover > a:first-of-type,
.itg > .gl1t:hover > .glname {
    overflow: visible;
	z-index: 10;
}
.itg > .gl1t:hover > a:first-of-type > .glname,
.itg > .gl1t:hover > .glft > div:nth-child(1) {
    height: fit-content;
    height: -moz-fit-content;
    background: rgba(0,0,0,0.5);
}
.itg > .gl1t > .glft > div:nth-child(1) {
    padding-bottom: 0.25em;
}
div.gl4t {
    height: fit-content !important;
    height: -moz-fit-content !important;
    max-height: none;
    padding-bottom: 0.25em;
    font-weight: bold;
    text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}` : ``) + `
.hideContainer_t { top: -17px; }
.hideControls { top: -3px; }
.imgContainer > .ehx-imgHide {
	cursor: pointer !important;
	position: absolute;
	top: 1px;
	right: 4px;
	bottom: unset;
	left: unset;
}
.inactive { display: none; }
.listBody {
	width: 100%;
	height: 100%;
	vertical-align: top;
	position: relative;
}
.ehx-listing {
	width: 100%;
	height: 140px;
	border-bottom: 1px solid threedface;
	margin-top: 10px;
	padding-bottom: 5px;
}
.ehx-listing a {
    text-decoration: none;
    position: relative;
    z-index: 1;
}
.ehx-listing:last-child { border-bottom: none; }
.mencon {
	display: inline-block;
	position: relative;
}
.ehx-menu:after {
	content: '\\2335';
	position: absolute;
	right: 5px;
	bottom: 1px;
}
.noscroll { overflow: hidden; }
.ehx-notice {
	position: relative;
	width: 500px;
	height: 20px;
	top: 20px;
	left: 50%;
	transform: translate(-50%, 0px);
	background: rgba(70, 130, 180, 0.8);
	font-size: 1.2em;
	font-weight: bold;
	color: white;
	padding-top: 5px;
	border-radius: 8px;
	z-index: 999;
	text-align: center;
}
.ehx-notice.alert {
	background: rgba(165, 42, 42, 0.8);
}
.ehx-notice:not(:first-child) {
    top: 30px;
}
.ehx-overlay {
	background: rgba(0,0,0,0.5);
	display: -webkit-flex;
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 100;
	font-size: 9pt;
}
.ehx-overlay button:not(.ehx-collapsible) {
	background-color: transparent;
	border-radius: 6px;
	border: 1px solid threedface;
	cursor: pointer;
	font-weight: bold;
	padding: 3px 20px;
	text-decoration: none;
	color: inherit;
	margin-left: 5px;
}
.ehx-overlay button:not(.ehx-collapsible):hover { background-color: rgba(255, 255, 255, 0.1); }
.ehx-overlay button:not(.ehx-collapsible):focus { outline: none; }
.rating {
	text-align: right;
	line-height: 18px;
	position: absolute;
	right: 5px;
	bottom: 8px;
}
.removed {
	opacity: 0.5;
	-webkit-opacity: 0.5;
	pointer-events: none;
}
.sControls {
	top: -3px;
	margin-bottom: 5px;
}
@-moz-document url-prefix() {
    .sControls {
        top: initial;
        margin-top: 3px;
        margin-bottom: 5px;
    }
}
.section-container {
	text-align: left;
	overflow: auto;
	margin: 5px 0px 5px 0px;
	padding-bottom: 5px;
}
.section-container textarea:disabled, .section-container input:disabled, .section-container select:disabled {
	opacity: 0.6;
	-webkit-opacity: 0.6;
}
.section-container input[type="number"] {
	border: 1px solid #8d8d8d;
	margin-left:0px;
	text-align: center;
	width: 50px;
}
.section-container select { margin-left: 0px; }
.section-container code {
	color: #000;
	background-color: #FFF;
}
.section-container fieldset { padding-right: 18px; }
.ehx-settings {
	background: ` + $('.ido').css('background') + `;
	background: ` + $('.ido').css('backgroundColor') + `;
	box-sizing: border-box;
	height: 555px;
	max-height: 100%;
	width: 900px;
	max-width: 100%;
	margin: auto;
	padding: 5px;
	display: -webkit-flex;
	display: flex;
	-webkit-flex-direction: column;
	flex-direction: column;
	box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.5);
}
.ehx-settings nav {
	text-align: right;
	padding-bottom: 5px;
	font-weight: bold;
	position: relative;
}
.ehx-settings legend {
	font-size: 10pt;
	font-weight: bold;
}
.ehx-settings label {
	font-weight: bold;
	text-decoration: underline;
	cursor: pointer;
}
.ehx-settings h3 {
	margin: 3px;
	position: relative;
}
.ehx-settings input { vertical-align: -1px; }
.ehx-settings textarea {
	width: 100%;
	height: 50px;
	resize: vertical;
	margin-bottom: 5px;
}
.show { display:block }
.suboptions { position: relative; }
.suboptions > div {
	position: relative;
	padding-left: 1.4em;
}
.suboptions2 {
	margin-left: 4px;
	padding-left: 10px;
	margin-right: -9px;
}
.taglist {
    display: none;
    padding-left: 120px;
}
.tagToggle {
    position: absolute;
    left: 50%;
    bottom: 8px;
	cursor: pointer;
}
.thumb {
	display: inline-block;
	width: 100px;
	margin: 0px 10px;
	float: left;
}
.thumb img {
	max-width: 100%;
	max-height: 135px;
}
.title { font-size: 12pt; }
.title p {
    font-size: 0.6em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.tlink {
    display: inline-block;
    top: 3px;
    margin-right: 1.5px;
    padding-left: 3px;
    width: 400px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
</style>`).appendTo('head');
    $(`<style id="setStyle" data-jqstyle="ehxVisited">
table.itg > tbody > tr.ehx-visited, .gl1t.ehx-visited { ` + cssA.visible + ` }
table.itg > tbody > tr.ehx-visited.ehx-hidden, .gl1t.ehx-visited.ehx-hidden { ` + cssA.hidden + ` }
.ehx-hidden { ` + cssD + cssA.hidden + ` }
.ehx-downloaded { ` + cssA.download + ` }
.ehx-hidden[data-jqstyle*="f"] {` + cssA.filter + `}
.ehx-hidden[data-jqstyle*="p"] {` + cssA.page + `}
.ehx-hidden[data-jqstyle*="r"] {` + cssA.rating + `}
.ehx-hidden[data-jqstyle*="u"] {` + cssA.uploader + `}
.ehx-hidden[data-jqstyle*="t"] {` + cssA.tag + `}
</style>`).appendTo('head');
    $(`<style id="ehxAdv" data-jqstyle="ehxVisited">` + cssC.custom + `</style>`).appendTo('head');
})();
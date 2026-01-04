// ==UserScript==
// @name         MyAnimeList(MAL) - Your Own "Seasonal" Animelist
// @version      1.6.8
// @description  Display your animelist like the seasonal anime page
// @author       Cpt_mathix
// @include      *://myanimelist.net/anime/season*
// @include      *://myanimelist.net/animelist/*
// @exclude      *://myanimelist.net/anime/season/schedule
// @exclude      *://myanimelist.net/anime/season/archive
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.4.2/localforage.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.5/jquery.fancybox.min.js
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/35420/MyAnimeList%28MAL%29%20-%20Your%20Own%20%22Seasonal%22%20Animelist.user.js
// @updateURL https://update.greasyfork.org/scripts/35420/MyAnimeList%28MAL%29%20-%20Your%20Own%20%22Seasonal%22%20Animelist.meta.js
// ==/UserScript==

try {
	(function() {
		// FF 57+ Extension support
		var $ = this.jQuery = jQuery.noConflict(true);
		var document = unsafeWindow ? unsafeWindow.document : document;
		var window = unsafeWindow || window;

		console.log('?', $);
		// variables
		var mal = {
			today: new Date(),
			version: '1.6',
			href: document.location.href,
			you: '',
			user: '',
			delay: '100',
			loaded: 0,
			total: 0,
			failed: 0,
			seasons: [], // mal.seasons contains all seasons with anime on your list
			fseasons: [], // seasons that failed to load
			cache: false
		};

		// data from malappinfo
		mal.list = {
			id: [],
			start: [],
			end: [],
			status: [],
			episodes: [],
			myscore: []
		};

		// genre filter data to know which genres are hidden
		mal.genres = {
			all: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43],
			include: [],
			exclude: []
		};

		// Common source types
		mal.source = {
			type: ["Manga", "Original", "Game", "Novel", "Visual novel", "Light novel", "4-koma manga", "Other"]
		};

		var type = {
			tv: '#content > div.js-categories-seasonal > div.js-seasonal-anime-list-key-1',
			ona: '#content > div.js-categories-seasonal > div.js-seasonal-anime-list-key-5',
			ova: '#content > div.js-categories-seasonal > div.js-seasonal-anime-list-key-2',
			movie: '#content > div.js-categories-seasonal > div.js-seasonal-anime-list-key-3',
			special: '#content > div.js-categories-seasonal > div.js-seasonal-anime-list-key-4'
		};

		if (/http.*:\/\/myanimelist.net\/animelist\/\D*/.test(document.location.href)) {
			initialize_animelist_html();
		} else if (/http.*:\/\/myanimelist.net\/anime\/season*/.test(document.location.href)) {
			initialize_seasonal_html();
		}

		function initialize_seasonal_html() {
			mal.you = document.getElementsByClassName('header-profile-link')[0].textContent;

			// Add the 'My List' link in the navigation bar on top
			var navigation = $('.horiznav_nav');
			var navtab = $(navigation).find('.navtab');
			var li = document.createElement('li');
			li.innerHTML = '<a href="javascript:void(0);" id="yourlistlink" class="navtab">My List</a>';
			$(li).insertBefore(navtab[0].parentNode);

			// small misalignment fix
			if(navtab[0].textContent == 'Current Season')
				$(navtab[2]).hide();

			var user = getUrlParameter('user');
			console.log('user', user);
			if (user == mal.you) {
				// load script with defined user
				loadStorage(false, user);
			} else if (user) {
				init(false, user, false, null);
			} else {
				// load script when you click on the 'My List' link
				$(li).on("click",function() {
					user = document.getElementsByClassName('header-profile-link')[0].textContent;
					loadStorage(false, user); // argument false => use cached data if available, no refresh
					$(li).unbind('click'); // disable the 'My List' link to avoid loading the script multiple times
				});
			}
		}

		function initialize_animelist_html() {
			var user = mal.href.match(/[^/]*?(?=\?|$)/)[0];

			var modern = $('.header .header-menu .btn-menu > .username').length > 0;

			if (modern) {
				var anchor1 = $('body > div.header > div > div.header-info');
				console.log(anchor1);
				if (anchor1[0]) {
					console.log('check');
					var html1 = " | <a href=\"/anime/season?user=" + user + "\"><i class=\"fa\"></i>Seasonal</a>";
					$(anchor1).append(html1);
				} else {
					var newElement = document.createElement('div');
					newElement.className = "header-info";
					var anchor3 = $('body > div.header > div')[0];
					anchor3.appendChild(newElement);
					$('body > div.header > div > div.header-info').html("<a href=\"/anime/season?user=" + user + "\"><i class=\"fa\"></i>Seasonal</a>");
				}
			} else {
				var anchor2 = $('#mal_cs_otherlinks > div:nth-child(2)');
				var html2 = " | <a href=\"/anime/season?user=" + user + "\"><i class=\"fa\"></i>Seasonal</a>";
				$(anchor2).append(html2);
			}
		}

		function loadStorage(refresh, user) {
			localforage.getItem('MAL#' + mal.version + '#document', function (err, value) {
				if (err) {
					console.error('error: ', err);
				} else {
					try {
						init(refresh, user, value !== null, value);
					} catch (e) {
						console.error('Problem loading MAL extension', e);
					}
				}
			});
		}

		// initialize script function (argument refresh = true, reload list)
		function init(refresh, user, cache, data) {
			mal.user = user;

			if (mal.user == mal.you && cache) {
				mal.cache = true;
			} else {
				setCache('lastUpdate', mal.today.toLocaleString());
				mal.cache = false;
			}

			// initialize the 'my list page'
			var loadPage = $.Deferred(function () {
				console.log('loading page with', cache, data);
				initPage(this, refresh, cache, data);
			}).promise();

			// load malappinfodata (animelist data)
			var loadList = $.Deferred(function () {
				if (mal.cache) {
					this.reject();
				} else {
					loadUserList(this);
				}
			}).promise();

			// start core of script if 'my list page' and malappinfo are loaded
			$.when(loadPage, loadList).then(function () {
				console.log('about to start script');
				startScript();
				startScript();
				startScript();
			});
		}

		// start core of script
		function startScript() {
			// Load all seasons that have anime on your list
			var seasonyear = mal.seasons[0].split('-');
			mal.seasons.splice(0, 1);
			var year = seasonyear[0];
			var season = seasonyear[1];

			$.get('/anime/season/' + year + '/' + season, function(data) {
				process($(data).find('#content > div.js-categories-seasonal'));
			}).success( function() {
				if (mal.seasons.length !== 0)
					startScript();
			}).error( function() {
				console.log(year + '-' + season);
				mal.fseasons.push(year + '-' + season);
				if (mal.seasons.length !== 0)
					startScript();
			});

			// load entries without a season page
			if(mal.loaded != mal.total && mal.seasons.length === 0) {
				console.log("seasons without page");

				$.get('/anime/season/later', function(data) {
					process($(data).find('#content > div.js-categories-seasonal'));
				}).success( function() {
					retryFailedSeasons();
				}).error( function() {
					setTimeout( function() {
						$.get('/anime/season/later', function(data) {
							process($(data).find('#content > div.js-categories-seasonal'));
							retryFailedSeasons();
						});
					}, 2000);
				});
			} else if (mal.seasons.length === 0) {
				retryFailedSeasons();
			}
		}

		function retryFailedSeasons() {
			setTimeout( function() {
				console.log(mal.fseasons);
				console.log(mal.fseasons.length);
				if (mal.fseasons.length > 0) {
					console.log("retrying failed seasons in 5s");
					console.log(mal.fseasons);
					mal.seasons = mal.fseasons.slice(0);
					mal.fseasons.length = 0;
					setTimeout(function() {startScript();}, 5000);
				} else {
					console.log("finishing script");
					finishScript();
				}
			}, 5000);
		}

		function finishScript() {
			mal.failed = mal.total - mal.loaded;
			mal.total = mal.loaded;
			$('#content > div.navi-seasonal.js-navi-seasonal > p').html('Showing: <span class="js-visible-anime-count">' + mal.loaded + '/' + mal.total + '</span><span> - Failed: ' + mal.failed + '</span>');
			saveData();
			console.log('Failed to load anime with id: ', mal.list.id);

			// reinit these filters because they fail sometimes (especially with big lists)
			addStatusOnClickEvent();
			addSourceOnClickEvent();
		}

		function saveData() {
			if (mal.user == mal.you) {
				localforage.setItem('MAL#' + mal.version + '#document', $('#content > div.js-categories-seasonal').html(), function(err, value) {
					if (err) {
						console.error('error: ', err);
					} else {
						console.log("Data Saved");
					}
				});
			}
		}

		// load malappinfo (your animelist)
		function loadUserList(object) {
			// get userlist
			var xhr = new XMLHttpRequest();
			var url = '/malappinfo.php?u=' + mal.user + '&status=all&type=anime';
			xhr.open("GET", url, false);
			xhr.setRequestHeader('Content-Type', 'text/xml');
			xhr.send();
			var xmlDocument = xhr.responseXML;

			// create a list that I can save
			console.log('xml', xml)
			var rawListId = xml.document.getElementsByTagName('series_animedb_id');
			var rawListDate = xml.document.getElementsByTagName('series_start');
			var rawListEnd = xml.document.getElementsByTagName('series_end');
			var rawListEpisodes = xml.document.getElementsByTagName('series_episodes');
			var rawListStatus = xml.document.getElementsByTagName('series_status');
			var rawListScore = xml.document.getElementsByTagName('my_score');
			for (var i = 0; i < rawListId.length; i++) {
				// save data (we will use this data later for sorting and filtering)
				mal.list.id.push(rawListId[i].textContent);
				mal.list.status.push(rawListStatus[i].textContent);
				mal.list.start.push(rawListDate[i].textContent.replace(/-/g,''));
				mal.list.end.push(rawListEnd[i].textContent.replace(/-/g,''));
				mal.list.myscore.push(rawListScore[i].textContent);
				mal.list.episodes.push(rawListEpisodes[i].textContent);

				var ymd = rawListDate[i].textContent.split('-');
				var year = year != '0000' ? ymd[0] : 'none';
				var month = parseInt(ymd[1]);

				var season = 'none';
				if (month > 0) {
					if (month < 4) {
						season = 'winter';
					} else if (month < 7) {
						season = 'spring';
					} else if (month < 10) {
						season = 'summer';
					} else {
						season = 'fall';
					}
				}

				if (year != 'none' && season != 'none')
					mal.seasons.push(year + '-' + season); 
			}
			mal.seasons = removeDuplicates(mal.seasons);
			mal.seasons.sort();
			mal.total = mal.list.id.length;

			object.resolve();
		}

		// filter all anime on your list and insert them on the 'my list' page
		function process(content) {	
			// process TV
			var Tv = $(type.tv);
			var newContentTv = $(content).find('.js-seasonal-anime-list-key-1');
			$(newContentTv).find('.js-seasonal-anime').each( function() {
				addToPage(Tv, this);
			});

			// process ONA
			var ONA = $(type.ona);
			var newContentONA = $(content).find('.js-seasonal-anime-list-key-5');
			$(newContentONA).find('.js-seasonal-anime').each( function() {
				addToPage(ONA, this);
			});

			// process OVA
			var OVA = $(type.ova);
			var newContentOVA = $(content).find('.js-seasonal-anime-list-key-2');
			$(newContentOVA).find('.js-seasonal-anime').each( function() {
				addToPage(OVA, this);
			});

			// process Movie
			var Movie = $(type.movie);
			var newContentMovie = $(content).find('.js-seasonal-anime-list-key-3');
			$(newContentMovie).find('.js-seasonal-anime').each( function() {
				addToPage(Movie, this);
			});

			// process Special
			var Special = $(type.special);
			var newContentSpecial = $(content).find('.js-seasonal-anime-list-key-4');
			$(newContentSpecial).find('.js-seasonal-anime').each( function() {
				addToPage(Special, this);
			});

			// update counter
			console.log("updating counter");
			$('.js-visible-anime-count').html(mal.loaded + '/' + mal.total);
		}

		// add the anime to the 'my list' page and include the malappinfo data
		function addToPage(objectType, element) {
			var id = $(element).find('.genres.js-genre').attr("id");
			var status, start, end, episodes, myscore;

			if ($.inArray(id, mal.list.id) != -1) {
				$(objectType).append(element);
				var index = mal.list.id.indexOf(id);
				mal.list.id.splice(index,1);
				status = mal.list.status.splice(index,1);
				start = mal.list.start.splice(index,1);
				end = mal.list.end.splice(index,1);
				episodes = mal.list.episodes.splice(index,1);
				myscore = mal.list.myscore.splice(index,1);
				mal.loaded += 1;
			} else {
				return false;
			}

			var members = $(element).find('> div.information > div.scormem > span.member.fl-r').text().trim().replace(/,/g, '');
			var title = $(element).find('> div:nth-child(1) > div.title > p').text().trim();
			var score = $(element).find('> div.information > div.scormem > span.score').text().trim();
			var studio = $(element).find('> div:nth-child(1) > div.prodsrc > span.producer').text().trim();
			var source = $(element).find('> div:nth-child(1) > div.prodsrc > span.source').text().trim();

			if ($.inArray(source, mal.source.type) == -1) {
				source = "Other";
			}
			$(element).attr("data-sort", '{"members":"' + members + '","start":"' + start[0] + '","end":"' + end[0] + '","title":"' + removequotes(title) + '", \
							"score":"' + score + '","myscore":"' + myscore[0] + score.replace('.','') + '","studio":"' + studio + '","episodes":"' + episodes[0] + '"}');
			$(element).attr("data-status", status);
			$(element).attr("data-source", source);

			// load fancybox (edit details popup boxes)
			$(element).find('.Lightbox_AddEdit').fancybox({
				'width'			: 700,
				'height'		: '85%',
				'overlayShow'	: false,
				'titleShow'     : false,
				'type'          : 'iframe'
			});

			// remove add +1 episode function (I don't want to write this function, sorry)
			$(element).find('.icon-add-episode').remove();

			// activate the description scrollbar on mouseenter
			$(element).find(".js-synopsis").on("mouseenter",function() {
				$(this).addClass("block-scroll");
			});

			// deactivate the description scrollbar on mouseleave
			$(element).find(".js-synopsis").on("mouseleave",function() {
				$(this).removeClass("block-scroll");
			});
		}

		function sort(element, sortType) {
			// update selected element (green dot)
			if ($(element).parent().find('.selected').length)
				$(element).parent().find('.selected').removeClass('selected');
			$(element).addClass("selected");

			for (var value in type) { // type is a global variable (see line 48)
				if (type.hasOwnProperty(value)) {
					var listitems = $(type[value]).find('.js-seasonal-anime').toArray();

					switch(sortType) {
						case 'title':
							listitems.sort(function(a, b) {
								var compA = $(a).data("sort").title;
								var compB = $(b).data("sort").title;
								return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'score':
							listitems.sort(function(a, b) {
								var compA = $(a).data("sort").score.replace('N/A', 0);
								var compB = $(b).data("sort").score.replace('N/A', 0);
								return (compA < compB) ? 1 : (compA > compB) ? -1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'myscore':
							listitems.sort(function(a, b) {
								var compA = parseInt($(a).data("sort").myscore);
								var compB = parseInt($(b).data("sort").myscore);
								return (compA < compB) ? 1 : (compA > compB) ? -1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'members':
							listitems.sort(function(a, b) {
								var compA = parseInt($(a).data("sort").members);
								var compB = parseInt($(b).data("sort").members);
								return (compA < compB) ? 1 : (compA > compB) ? -1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'start_date':
							listitems.sort(function(a, b) {
								var compA = parseInt($(a).data("sort").start.replace('00000000','99999999'));
								var compB = parseInt($(b).data("sort").start.replace('00000000','99999999'));
								return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'end_date':
							listitems.sort(function(a, b) {
								var compA = parseInt($(a).data("sort").end.replace('00000000','99999999'));
								var compB = parseInt($(b).data("sort").end.replace('00000000','99999999'));
								return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'studio':
							listitems.sort(function(a, b) {
								var compA = $(a).data("sort").studio.replace('-', 'zzz');
								var compB = $(b).data("sort").studio.replace('-', 'zzz');
								return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;

						case 'episodes':
							listitems.sort(function(a, b) {
								var compA = parseInt($(a).data("sort").episodes);
								var compB = parseInt($(b).data("sort").episodes);
								return (compA < compB) ? 1 : (compA > compB) ? -1 : 0;
							});
							$.each(listitems, function(idx, itm) {
								$(type[value]).append(itm);
							});
							break;
					}
				}
			}
		}

		function genresFilter(element, filterType) {
			var filtering;
			if ($(element).is('.on')) {
				$(element).removeClass('on');
				filtering = 'exclude';
				mal.genres.exclude.push(filterType);
			}
			else if ($(element).is('.selected')) { // class selected = include genre
				$(element).removeClass('selected');
				$(element).addClass('crossed');
				filtering = 'exclude';
				mal.genres.include = $(mal.genres.include).not([filterType]).get();
				mal.genres.exclude.push(filterType);
			}
			else if ($(element).is('.crossed')) { // class crossed = exclude genre
				$(element).removeClass('crossed');
				filtering = 'none';
				mal.genres.include = $(mal.genres.include).not([filterType]).get();
				mal.genres.exclude = $(mal.genres.exclude).not([filterType]).get();
			}
			else if ($(element).is('.js-btn-show-kids') || $(element).is('.js-btn-show-r18')) {
				$(element).addClass("on");
				filtering = 'none';
				mal.genres.exclude = $(mal.genres.exclude).not([filterType]).get();
			}
			else {
				$(element).addClass("selected");
				filtering = 'include';
				mal.genres.include.push(filterType);
				mal.genres.exclude = $(mal.genres.exclude).not([filterType]).get();
			}

			// Selected & Crossed for the 'All' filter
			if (isNaN(filterType) && filtering == 'exclude') {
				$(element).parent().find('.btn-sort-order').each( function() {
					$(this).removeClass('selected');
					$(this).addClass('crossed');
				});
			} else if (isNaN(filterType) && filtering == 'none') {
				$(element).parent().find('.btn-sort-order').each( function() {
					$(this).removeClass('crossed selected');
				});
			} else if (isNaN(filterType) && filtering == 'include') {
				$(element).parent().find('.btn-sort-order').each( function() {
					$(this).removeClass('crossed');
					$(this).addClass('selected');
				});
			}

			for (var value in type) {
				var listitems = $(type[value]).find('.js-seasonal-anime');

				if (isNaN(filterType) && type.hasOwnProperty(value)) {
					if (filtering == 'include') {
						$(listitems).hide().addClass('hiddenGenres');
						mal.genres.include = mal.genres.all;
						mal.genres.exclude.length = 0;
					} else if (filtering == 'exclude') {
						$(listitems).hide().addClass('hiddenGenres');
						mal.genres.include.length = 0;
						mal.genres.exclude = mal.genres.all;
					} else {
						$(listitems).each( function() {
							$(this).not('.hiddenStatus, .hiddenList, .hiddenSource').show();
							$(this).removeClass('hiddenGenres');
						});
						mal.genres.include.length = 0;
						mal.genres.exclude.length = 0;
					}

				} else if (type.hasOwnProperty(value)) {
					$(listitems).each( function() {
						var genrelist = this.dataset.genre.split(',').map(function(item) {
							return parseInt(item, 10);
						});
						if (check_include(genrelist, mal.genres.include) && ! check_exclude(genrelist, mal.genres.exclude)) {
							$(this).removeClass('hiddenGenres');
							$(this).not('.hiddenStatus, .hiddenList, .hiddenSource').show();
						} else {
							$(this).hide().addClass('hiddenGenres');
						}
					});
				}
			}

			updateCounter();
		}

		function statusFilter(element, filterType) {
			var filtering;
			if ($(element).hasClass("selected")) {
				$(element).removeClass('selected');
				filtering = true;
			} else {
				$(element).addClass("selected");
				filtering = false;
			}

			for (var value in type) {
				if (type.hasOwnProperty(value)) {
					var listitems = $(type[value]).find('.js-seasonal-anime');
					if (filtering) {
						$(listitems).filter('[data-status*="' + filterType + '"]').hide().addClass('hiddenStatus');
					} else {
						$(listitems).filter('[data-status*="' + filterType + '"]').each( function() {
							$(this).not('.hiddenGenres, .hiddenList, .hiddenSource').show();
							$(this).removeClass('hiddenStatus');
						});
					}
				}
			}

			updateCounter();
		}

		function sourceFilter(element, filterType) {
			var filtering;
			if ($(element).hasClass("selected")) {
				$(element).removeClass('selected');
				filtering = true;
			} else {
				$(element).addClass("selected");
				filtering = false;
			}

			for (var value in type) {
				if (type.hasOwnProperty(value)) {
					var listitems = $(type[value]).find('.js-seasonal-anime');
					if (filtering) {
						$(listitems).filter('[data-source*="' + filterType + '"]').hide().addClass('hiddenSource');
					} else {
						$(listitems).filter('[data-source*="' + filterType + '"]').each( function() {
							$(this).not('.hiddenGenres, .hiddenList, .hiddenStatus').show();
							$(this).removeClass('hiddenSource');
						});
					}
				}
			}

			updateCounter();
		}

		function mylistFilter(element, filterType) {
			var filtering;
			if ($(element).hasClass("selected")) {
				$(element).removeClass('selected');
				filtering = true;
			} else {
				$(element).addClass("selected");
				filtering = false;
			}

			for (var value in type) {
				if (type.hasOwnProperty(value)) {
					var listitems = $(type[value]).find('.js-seasonal-anime');
					if (filtering) {
						$(listitems).has('.' + filterType).hide().addClass('hiddenList');
					} else {
						$(listitems).has('.' + filterType).each( function() {
							$(this).not('.hiddenGenres, .hiddenStatus, .hiddenSource').show();
							$(this).removeClass('hiddenList');
						});
					}
				}
			}

			updateCounter();
		}

		function updateCounter() {
			mal.loaded = $('.js-seasonal-anime').not(':hidden').length;
			$('#content > div.navi-seasonal.js-navi-seasonal > p').html('Showing' + ((mal.cache) ? (" Cached") : ("")) + ': <span class="js-visible-anime-count">' + mal.loaded + '/' + mal.total + '</span>');

			if (mal.loaded > mal.total) {
			    mal.total = mal.loaded;
				console.log("resave data");
				saveData();
			}
		}

		// create the 'my list' page
		function initPage(object, refresh, cache, data) {
			$('#content > div.breadcrumb.ml12.mt4 > div:nth-child(3) > a').html('<span itemprop="name">My List</span>');
			$('#content > div.navi-seasonal.js-navi-seasonal > p').html('<b>Loading: <span class="js-visible-anime-count">...</span></b>');
			$('#content > div.js-categories-seasonal').html(getEmptyContentHTML(cache, data));

			if (mal.cache && cache) {
				object.reject();
				reInitCachedPage();
			} else {
				object.resolve();
			}

			if (!refresh) {
				$('#contentWrapper > div:nth-child(1)').html('<a title="Load friend list" class="header-right friendlist" href="javascript:void(0);">Load</a><a title="Last update: ' + getCache('lastUpdate') + '" class="header-right refreshlist" href="javascript:void(0);">Refresh</a><h1 class="h1">My List</h1>');
				$('#contentWrapper > div:nth-child(1) > a.refreshlist').click(function() {
					deleteCache('today');
					deleteCache('document');
					setCache('lastUpdate', mal.today.toLocaleString());
					$(this).prop('title', 'Last update: ' + mal.today.toLocaleString());
					resetData();
					init(true, mal.you, false, null);
				});

				$('#contentWrapper > div:nth-child(1) > a.friendlist').click(function() {
					loadFriendList();
				});

				var navigation = $('.horiznav_nav');
				var currOn = $(navigation).find('.on, .horiznav_active');
				$(currOn).removeClass('on horiznav_active');
				var yourlist = $(navigation).find('#yourlistlink');
				$(yourlist).addClass('horiznav_active');

				$('#content > div.navi-seasonal.js-navi-seasonal > div.horiznav-nav-seasonal.po-r > ul > li').each( function() {
					$(this).on('click', function() {
						updateCounter();
					});
				});

				initFilters();
			} else {
				resetFilters();

				$('#sort').find('> span').each( function() {
					$(this).removeClass('selected');
				});
			}
		}

		function resetData() {
			mal.seasons.length = 0;
			mal.list.id.length = 0;
			mal.list.start.length = 0;
			mal.list.end.length = 0;
			mal.list.status.length = 0;
			mal.list.episodes.length = 0;
			mal.list.myscore.length = 0;
			mal.total = 0;
			mal.loaded = 0;
			mal.failed = 0;
			mal.today = new Date();
		}

		function reInitCachedPage() {
			var count = $('.js-seasonal-anime').length;
			mal.total = count;
			$('#content > div.navi-seasonal.js-navi-seasonal > p').html('Showing Cached: <span class="js-visible-anime-count">' + count + '/' + count + '</span>');

			$('.js-seasonal-anime').find('.Lightbox_AddEdit').fancybox({
				'width'			: 700,
				'height'		: '85%',
				'overlayShow'	: false,
				'titleShow'     : false,
				'type'          : 'iframe'
			});

			$('.js-seasonal-anime').find(".js-synopsis").on("mouseenter",function() {
				$(this).addClass("block-scroll");
			});

			$('.js-seasonal-anime').find(".js-synopsis").on("mouseleave",function() {
				$(this).removeClass("block-scroll");
			});
		}

		function loadFriendList() {
			var x;
			var name = prompt("Please enter username to load user's animelist", mal.user);
			if (name !== null) {
				resetData();
				init(true, name, false, null);
			}
		}

		function initFilters() {
			// replace current sort handlers with my own (cloning removes all handlers)
			$('#sort').find('> span').each( function() {
				var elClone = this.cloneNode(true);
				this.parentNode.replaceChild(elClone, this);
				$(elClone).on('click', function() {
					$(elClone).parent().next().first().css("display", "block");
					sort(elClone, elClone.id);
					$(elClone).parent().next().first().css("display", "none");
				});
			});

			$('div.seasonal-sort-order-block.sort.js-seasonal-sort-order-block.js-sort').attr('style', 'right:167px;');

			$('#sort').find('.selected').removeClass('selected');
			$('#licensor').prev().remove();
			$('#licensor').next().remove();
			$('#licensor').remove();

			// replace current genres handlers with my own (cloning removes all handlers)
			$('#genres').find('> span, > li').each( function() {
				var elClone = this.cloneNode(true);
				this.parentNode.replaceChild(elClone, this);
				$(elClone).on('click', function() {
					genresFilter(elClone, parseInt(elClone.id, 10));
				});
				$(elClone).removeClass('selected crossed');
			});

			// replace current mylist handlers with my own (cloning removes all handlers)
			$('#mylist').find('> li').each( function() {
				var elClone = this.cloneNode(true);
				this.parentNode.replaceChild(elClone, this);
				$(elClone).removeClass('ml12');
				$(elClone).on('click', function() {
					mylistFilter(elClone, elClone.id);
				});
				$(elClone).addClass('selected');
			});

			$('#mylist').find('#All').remove();
			if (mal.you == mal.user) {
				$('#mylist').find('#notinmylist').hide();
			} else {
				$('#mylist').find('#notinmylist').show();
			}

			$('.js-btn-show-kids').each( function() {
				var elClone = this.cloneNode(true);
				this.parentNode.replaceChild(elClone, this);
				$(elClone).on('click', function() {
					genresFilter(elClone, 15);
				});
				$(elClone).addClass('on');
			});

			$('.js-btn-show-r18').each( function() {
				var elClone = this.cloneNode(true);
				this.parentNode.replaceChild(elClone, this);
				$(elClone).on('click', function() {
					genresFilter(elClone, 12);
					genresFilter(elClone, 33);
					genresFilter(elClone, 34);
				});
				$(elClone).addClass('on');
			});

			addStatusFilter();
			addSourceFilter();
			addMoreSortOptions();
		}

		function resetFilters() {
			$('#genres').find('> span, > li').each( function() {
				$(this).toggleClass('selected', false);
				$(this).toggleClass('crossed', false);
			});

			$('#mylist').find('> li').each( function() {
				$(this).toggleClass('selected', true);
			});

			if (mal.you == mal.user) {
				$('#mylist').find('#notinmylist').hide();
			} else {
				$('#mylist').find('#notinmylist').show();
			}

			$('#status').find('> li').each( function() {
				$(this).toggleClass('selected', true);
			});

			$('#source').find('> li').each( function() {
				$(this).toggleClass('selected', true);
			});

			$('.js-btn-show-kids').each( function() {
				$(this).toggleClass('on', true);
			});

			$('.js-btn-show-r18').each( function() {
				$(this).toggleClass('on', true);
			});
		}

		function addMoreSortOptions() {
			$('<br><span class="js-btn-sort-order btn-sort-order circle" id="end_date">End Date</span>').insertAfter('#start_date');

			$('#end_date').on('click', function() {
				$(this).parent().next().first().css("display", "block");
				sort(this, this.id);
				$(this).parent().next().first().css("display", "none");
			});

			$('<br><span class="js-btn-sort-order btn-sort-order circle" id="myscore">My Score</span>').insertAfter('#score');

			$('#myscore').on('click', function() {
				$(this).parent().next().first().css("display", "block");
				sort(this, this.id);
				$(this).parent().next().first().css("display", "none");
			});

			$('<br><span class="js-btn-sort-order btn-sort-order circle" id="episodes">Episodes</span>').insertAfter('#studio');

			$('#episodes').on('click', function() {
				$(this).parent().next().first().css("display", "block");
				sort(this, this.id);
				$(this).parent().next().first().css("display", "none");
			});
		}

		function addStatusFilter() {
			$('<span class="fl-r btn-show-sort js-btn-show-sort status mr12" id="statusdropdown" data-id="status">Status</span>').insertAfter('span.fl-r.btn-show-sort.js-btn-show-sort.sort.mr12');
			$(getStatusPopupHTML()).insertAfter('div.seasonal-sort-order-block.sort.js-seasonal-sort-order-block.js-sort');

			addStatusOnClickEvent();

			$('.fl-r.btn-close.js-btn-close').on('click', function() {
				$('#popupstatus').hide();
				$('.btn-show-sort').removeClass('on');
			});

			$('#status').find('.js-btn-sort-order.btn-sort-order').on('click', function() {
				statusFilter(this, $(this).attr('id'));
			});
		}

		function addStatusOnClickEvent() {
			$('#statusdropdown').off('click');
			$('#statusdropdown').on('click', function() {
				var dropdown = $('#popupstatus');
				if (dropdown.is(":visible") && $(this).hasClass('on')) {
					$(this).removeClass('on');
					$(dropdown).hide();
				} else {
					$('.seasonal-sort-order-block.js-seasonal-sort-order-block').hide();
					$('.fl-r.btn-show-sort.js-btn-show-sort').removeClass('on');
					$(this).addClass('on');
					$(dropdown).show();
				}

				addGlobalClick();
			});
		}

		function addSourceFilter() {
			$('<span class="fl-r btn-show-sort js-btn-show-sort source mr12" id="sourcedropdown" data-id="source">Source</span>').insertAfter('span.fl-r.btn-show-sort.js-btn-show-sort.sort.mr12');
			$(getSourcePopupHTML()).insertAfter('div.seasonal-sort-order-block.sort.js-seasonal-sort-order-block.js-sort');

			addSourceOnClickEvent();

			$('.fl-r.btn-close.js-btn-close').on('click', function() {
				$('#popupsource').hide();
				$('.btn-show-sort').removeClass('on');
			});

			$('#source').find('.js-btn-sort-order.btn-sort-order').on('click', function() {
				sourceFilter(this, $(this).text().trim());
			});
		}

		function addSourceOnClickEvent() {
			$('#sourcedropdown').off('click');
			$('#sourcedropdown').on('click', function() {
				var dropdown = $('#popupsource');
				if (dropdown.is(":visible") && $(this).hasClass('on')) {
					$(this).removeClass('on');
					$(dropdown).hide();
				} else {
					$('.seasonal-sort-order-block.js-seasonal-sort-order-block').hide();
					$('.fl-r.btn-show-sort.js-btn-show-sort').removeClass('on');
					$(this).addClass('on');
					$(dropdown).show();
				}

				addGlobalClick();
			});
		}

		// refresh everytime because malcode overrides mine... (closes opened menus when clicking next to them)
		function addGlobalClick() {
			$(document).off('click'); // remove previous click event
			$(document).on('click', function(event) {
				if (!$(event.target).closest('.horiznav-nav-seasonal').length) {
					$('.seasonal-sort-order-block').hide();
					$('.btn-show-sort').removeClass('on');
				}
			});
		}

		function getStatusPopupHTML() {
			var strVar="";
			strVar += "<div class=\"seasonal-sort-order-block status js-seasonal-sort-order-block js-status\" id=\"popupstatus\" style=\"display: none; top: 41px; right: 288px;\">";
			strVar += "     <span class=\"fl-r btn-close js-btn-close\"><\/span>";
			strVar += "     <ul class=\"sort-order-list\" id=\"status\">";
			strVar += "         <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"1\">Airing<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"2\">Finished Airing<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"3\">Not Yet Aired<\/li>";
			strVar += "     <\/ul>";
			strVar += "<\/div>";
			return strVar;
		}

		function getSourcePopupHTML() {
			var strVar="";
			strVar += "<div class=\"seasonal-sort-order-block source js-seasonal-sort-order-block js-source\" id=\"popupsource\" style=\"display: none; top: 41px; right: 260px; width: 110px;\">";
			strVar += "     <span class=\"fl-r btn-close js-btn-close\"><\/span>";
			strVar += "     <ul class=\"sort-order-list\" id=\"source\">";
			strVar += "         <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"1\">Manga        &nbsp;<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"2\">Original     &nbsp;<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"3\">Game         &nbsp;<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"4\">Novel        &nbsp;<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"5\">Light novel  &nbsp;<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"6\">Visual novel &nbsp;<\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"7\">4-koma manga <\/li>";
			strVar += "		    <li class=\"js-btn-sort-order btn-sort-order selected\" id=\"8\">Other        &nbsp;<\/li>";
			strVar += "     <\/ul>";
			strVar += "<\/div>";
			return strVar;
		}

		function getEmptyContentHTML(cache, data) {
			if (mal.cache && cache) {
				return data;
			} else {
				var strVar="";
				strVar += "<div class=\"seasonal-anime-list js-seasonal-anime-list js-seasonal-anime-list-key-1 clearfix\">";
				strVar += "  <div class=\"anime-header\">TV<\/div>";
				strVar += "<\/div>";
				strVar += "<div class=\"seasonal-anime-list js-seasonal-anime-list js-seasonal-anime-list-key-5 clearfix\">";
				strVar += "  <div class=\"anime-header\">ONA<\/div>";
				strVar += "<\/div>";
				strVar += "<div class=\"seasonal-anime-list js-seasonal-anime-list js-seasonal-anime-list-key-2 clearfix\">";
				strVar += "  <div class=\"anime-header\">OVA<\/div>";
				strVar += "<\/div>";
				strVar += "<div class=\"seasonal-anime-list js-seasonal-anime-list js-seasonal-anime-list-key-3 clearfix\">";
				strVar += "  <div class=\"anime-header\">Movie<\/div>";
				strVar += "<\/div>";
				strVar += "<div class=\"seasonal-anime-list js-seasonal-anime-list js-seasonal-anime-list-key-4 clearfix\">";
				strVar += "  <div class=\"anime-header\">Special<\/div>";
				strVar += "<\/div>";
				return strVar;
			}
		}

		function getCache(key) {
			return JSON.parse(localStorage.getItem('MAL#' + mal.version + '#' + key));
		}

		function deleteCache(key) {
			localStorage.removeItem('MAL#' + mal.version + '#' + key);
		}

		function setCache(key, value) {
			localStorage.setItem('MAL#' + mal.version + '#' + key, JSON.stringify(value));
		}

		function removeDuplicates(array) {
			var seen = {};
			return array.filter(function(item) {
				return seen.hasOwnProperty(item) ? false : (seen[item] = true);
			});
		}

		function removequotes(string) {
			return (string + '').replace(/[\\"']/g, '').replace(/\u0000/g, '');
		}

		function check_exclude(a, b) {
			if (b.length === 0)
				return false;

			var sorted_a = a.sort(function (a, b) { return a - b; });
			var sorted_b = b.sort(function (a, b) { return a - b; });
			var i = 0, j = 0;

			while (i < a.length && j < b.length) {
				if (sorted_a[i] === sorted_b[j]) {
					return true;
				}
				else if(sorted_a[i] < sorted_b[j]) {
					i++;
				}
				else {
					j++;
				}
			}
			return false;
		}

		function check_include(a, b) {
			if (b.length === 0)
				return true;

			var sorted_a = a.sort(function (a, b) { return a - b; });
			var sorted_b = b.sort(function (a, b) { return a - b; });
			var i = 0, j = 0;

			while (i < a.length && j < b.length) {
				if (sorted_a[i] < sorted_aasdZZZzzb[j]) {
					++i;
				} else if (sorted_a[i] == sorted_b[j]) {
					++i; ++j;
				} else {
					return false;
				}
			}
			// make sure there are no elements left in b
			return j == sorted_b.length;
		}

		// thank you Sameer Kazi (http://stackoverflow.com/questions/19491336/get-url-parameter-jquery-or-how-to-get-query-string-values-in-js)
		function getUrlParameter(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
				sURLVariables = sPageURL.split('&'),
				sParameterName,
				i;

			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');

				if (sParameterName[0] === sParam) {
					return sParameterName[1] === undefined ? true : sParameterName[1];
				}
			}
		}
	})();
} catch(e) {
	console.error('Problem loading MAL script', e);
}
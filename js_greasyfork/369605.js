// ==UserScript==
// @name         MALstreaming
// @namespace    https://github.com/mattiadr/MALstreaming
// @version      5.47
// @author       https://github.com/mattiadr
// @description  Adds various anime and manga links to MAL
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3wQRDic4ysC1kQAAA+lJREFUWMPtlk1sVFUUx3/n3vvmvU6nnXbESkTCR9DYCCQSFqQiMdEY4zeJuiBhwUISAyaIHzHGaDTxKyzEr6ULNboiRonRhQrRCMhGiDFGA+WjhQ4NVKbtzJuP9969Lt4wlGnBxk03vZv3cu495/7u/5x7cmX1xk8dczjUXG4+DzAPMA8AYNoNIunXudnZ2+enrvkvn2kADkhiiwM8o6YEEuLE4pxDK0GakZUIoiCOHXFiW2uNEqyjZdNaIbMB0Ero7gwQ4OJEDa0VSoR6lNDT5eMZRaUa0YgSjFZU6zG1ekK+y6er00eJECWWchiRMYp8VwBAOYyw1l0dQIlQrcfcvKSHT968j+5chg+/OMoHnx9FCdwzsIRdz24gGxhe2v0Le74/htaKFYvzbNm4knWrF3J9IYtSQq0e8+C2r+jwDXvefYjEWja98B2DQyU6fINty8cVCigl9HYHiMCOzWs4/HuR4XNl3n5mPbmsB0DgGyYrDR69ewXvvXgXgW+oNxLOX6ySJJaebp/+ZQWOD5fIZT2cS5WddRGCw9oU5rVtA1SqEfmcTxRZPE8RxZbe7oBXnlpH4BtGx0Ke2PkNt624jte3DzBWqjF4ZhzP6GYBOtw1qtC07Y2I0IgTisUKtyztBaB4voLWQl8hS1iLuL2/j0V9OQC+/fkkx4ZK3L9hGQt6Oyj0BCiR1qZpwV5dgRn7gBLh1Y8OcmpkAoDndv3E6IUQgCRx9BWy6b91bH64n7P7tvL8lrU4l/pOi6dSRZWSaShmJgDPKIbPTfLy+wdYfEMXB46M0JXLNE8ElWoEQK0e8/fJi8SJpa+QZemi7hmiOSphxESlQRRb/IzGKMHNBOCaJwTI53wOHhnBM5pCPqDRSFIHrTh1drzls/2Nffx18h+efGwV7+y8kyi2l+O5VKW1KxeycEEn2Q6PPwfHKE3WMVpwrg1AAK1TkaxzBBlDEGiSxLXsgW84cWacE2fGWX5TnnsHlnB8qEQ2SG+J1qnM0lTLaMVbO+5AJL2ijzy9l7FSDaMV4FIAh0MpoRxGfL1vECRtHiK0Gsj+w8OcHpmkeKFCWIv54dAQWx9fxfo1N/Lxl38wVJzgx1+HCGsx1XoMwN79gy1VfU9zujjB2dFJfE9dLtKpb0JrHeUwzW8u66Gm3N9yGJEkls6sR5I4+pcX2PTArez+7DcmK+lcWIsRgc5mzyhXoivSq5W0+klL9fZH6SWpL9VCy64ERLDW4lyaorAaE2Q0xihE0kqnmfepsaZSJPYanXCmjVt265rnaAKJkM9lsM7hXLPg2nyvFuuaALMdjumn+T9jzh8k8wDzAPMAcw7wLz7iq04ifbsDAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE1LTA0LTE3VDE0OjM5OjU2LTA0OjAw6I0f5AAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNS0wNC0xN1QxNDozOTo1Ni0wNDowMJnQp1gAAAAASUVORK5CYII=
// @run-at       document-idle
// @supportURL   https://github.com/mattiadr/MALstreaming/issues
// @match        https://myanimelist.net/animelist/*
// @match        https://myanimelist.net/ownlist/anime/*/edit*
// @match        https://myanimelist.net/ownlist/anime/add?selected_series_id=*
// @match        https://myanimelist.net/mangalist/*
// @match        https://myanimelist.net/ownlist/manga/*/edit*
// @match        https://myanimelist.net/ownlist/manga/add?selected_manga_id=*
// @match        https://kissanime.ru/
// @match        https://kissmanga.com/
// @match        https://9anime.to/
// @match        https://twist.moe/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        window.close
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/369605/MALstreaming.user.js
// @updateURL https://update.greasyfork.org/scripts/369605/MALstreaming.meta.js
// ==/UserScript==

/* generic */
/*******************************************************************************************************************************************************************/
// array of all streaming services
const streamingServices = [
	// anime
	{ id: "kissanime",    type: "anime", name: "Kissanime",     domain: "https://kissanime.ru/"      },
	{ id: "nineanime",    type: "anime", name: "9anime",        domain: "https://9anime.to/"         },
	{ id: "animetwist",   type: "anime", name: "Anime Twist",   domain: "https://twist.moe/"         },
	{ id: "horriblesubs", type: "anime", name: "HorribleSubs",  domain: "https://horriblesubs.info/" },
	// manga
	{ id: "kissmanga",    type: "manga", name: "Kissmanga",     domain: "https://kissmanga.com/"     },
	{ id: "mangadex",     type: "manga", name: "MangaDex",      domain: "https://mangadex.org/"      },
	{ id: "jaiminisbox",  type: "manga", name: "Jaimini's Box", domain: "https://jaiminisbox.com/"   },
];
// contains variable properties for anime/manga modes
let properties = {};
properties.anime = {
	mode:          "anime",
	watching:      ".list-unit.watching",
	colHeader:     "<th class='header-title stream'>Watch</th>",
	commentsRegex: /Comments: ([\S ]+)&nbsp;/,
	iconAdd:       ".icon-add-episode",
	findProgress:  ".data.progress",
	findAiring:    "span.content-status:contains('Airing')",
	latest:        "Latest ep is #",
	notAired:      "Not Yet Aired",
	ep:            "Ep.",
	editPageBox:   "#add_anime_comments",
};
properties.manga = {
	mode:          "manga",
	watching:      ".list-unit.reading",
	colHeader:     "<th class='header-title stream'>Read</th>",
	commentsRegex: /Comments: ([\S ]+)\n/,
	iconAdd:       ".icon-add-chapter",
	findProgress:  ".data.chapter",
	findAiring:    "span.content-status:contains('Publishing')",
	latest:        "Latest ch is #",
	notAired:      "Not Yet Published",
	ep:            "Ch.",
	editPageBox:   "#add_manga_comments",
};
// contains all functions to execute on page load
const pageLoad = {};
// contains all functions to get the episodes list from the streaming services
// must callback to putEpisodes(dataStream, episodes, timeMillis)
const getEpisodes = {};
// contains queue settings for queuing requests to services (optional)
// must contain `maxRequests` and `timout`
const queueSettings = {};
queueSettings["default"] = {
	maxRequests: 2,
	timeout:     1000,
}
// contains all functions to get the episode list url from the partial url
const getEplistUrl = {};
// contains all functions to execute the search on the streaming services
// must callback to putResults(results)
const searchSite = {};

// return an array that contains the streaming service and url relative to that service or false if comment is not valid
function getUrlFromComment(comment) {
	let c = comment.split(" ");
	if (c.length < 2) return false;
	for (let i = 0; i < streamingServices.length; i++) {
		if (streamingServices[i].id == c[0]) return c;
	}
	return false;
}

// estimate time before next chapter as min of last n chapters
function estimateTimeMillis(episodes, n) {
	let prev = null;
	let min = undefined;
	for (let i = episodes.length - 1; i > Math.max(0, episodes.length - 1 - n); i--) {
		if (!episodes[i]) continue;
		if (prev && episodes[i].timestamp != prev) {
			let diff = prev - episodes[i].timestamp;
			if (!min || diff < min && diff > 0) min = diff;
		}
		prev = episodes[i].timestamp;
	}
	return episodes[episodes.length - 1].timestamp + min;
}

// returns the domain for the streaming service or false if ss doesn't exist
function getDomainById(id) {
	for (let i = 0; i < streamingServices.length; i++) {
		if (streamingServices[i].id == id) {
			return streamingServices[i].domain;
		}
	}
	return false;
}

/* anilist */
/*******************************************************************************************************************************************************************/
const anilist = {};
anilist.api = "https://graphql.anilist.co";
anilist.query = `\
query ($idMal: Int) {
	Media(type: ANIME, idMal: $idMal) {
		airingSchedule(notYetAired: true, perPage: 1) {
			nodes {
				episode
				airingAt
			}
		}
	}
}`;

// request time until next episode for the specified anime id
function requestTime(id) {
	// prepare data
	let data = {
		query: anilist.query,
		variables: { idMal: id }
	};
	// do request
	GM_xmlhttpRequest({
		method:  "POST",
		url:     anilist.api,
		headers: { "Content-Type": "application/json" },
		data:    JSON.stringify(data),
		onload:  function(resp) {
			let res = JSON.parse(resp.response);
			let times = GM_getValue("anilistTimes", {});
			// get data from response
			let sched = res.data.Media.airingSchedule.nodes[0];
			let ep = sched.episode;
			let timeMillis = sched.airingAt * 1000;
			// set time, ep is episode the timer is referring to
			times[id] = {
				ep: ep,
				timeMillis: timeMillis
			};
			// put times in GM value
			GM_setValue("anilistTimes", times);
		}
	});
}

// puts timeMillis into dataStream, then calls back
function anilist_setTimeMillis(dataStream, canReload) {
	let listitem = dataStream.parents(".list-item");

	// anime is not airing, exit
	if (listitem.find(properties.findAiring).length == 0) return;

	let times = GM_getValue("anilistTimes", false);
	// get anime id
	let id = listitem.find(".data.title > .link").attr("href").split("/")[2];
	let t = times ? times[id] : false;

	if (times && t && Date.now() < t.timeMillis) {
		// time doesn't need to update
		// set timeMillis, this is used to check if anilist timer is referring to next episode
		dataStream.data("timeMillis", t);
	} else {
		// add value change listener
		let listenerId = GM_addValueChangeListener("anilistTimes", function(name, old_value, new_value, remote) {
			// reload, avoid infinite loops
			if (canReload) anilist_setTimeMillis(dataStream, false);
			// remove listener
			GM_removeValueChangeListener(listenerId);
		});
		// api request to anilist
		requestTime(id);
	}
}

/* kissanime */
/*******************************************************************************************************************************************************************/
const kissanime = {};
kissanime.base = "https://kissanime.ru/";
kissanime.anime = kissanime.base + "Anime/";
kissanime.search = kissanime.base + "Search/SearchSuggestx";
kissanime.server = "&s=rapidvideo";
// blacklisted urls
kissanime.epsBlacklist = [
	"/Anime/Macross/Bunny_Hat-Macross_Special_-4208D135?id=73054",
	"/Anime/Macross/Bunny_Hat_Raw-30th_Anniversary_Special_-0A1CD40E?id=73055",
	"/Anime/Macross/Episode-011-original?id=35423"
];
// regexes
kissanime.regexWhitelist = /episode|movie|special|OVA/i;
kissanime.regexBlacklist = /\b_[a-z]+|recap|\.5/i;
kissanime.regexCountdown = /\d+(?=\), function)/;

// loads kissanime cookies and then calls back
function kissanime_loadCookies(callback) {
	if (GM_getValue("KAloadcookies", false) + 30*1000 < Date.now()) {
		GM_setValue("KAloadcookies", Date.now());
		GM_openInTab(kissanime.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
		}, 6000);
	}
}

// function to execute when script is run on kissanime
pageLoad["kissanime"] = function() {
	if (GM_getValue("KAloadcookies", false) && document.title != "Just a moment...") {
		GM_setValue("KAloadcookies", false);
		window.close();
	}
}

getEpisodes["kissanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: kissanime.anime + url,
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissanime_loadCookies(function() {
					getEpisodes["kissanime"](dataStream, url);
				});
			} else if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get anchors for the episodes
				let as = jqPage.find(".listing").find("tr > td > a");
				// get series title to remove it from episode name
				let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
				// filter and add to episodes array
				as.each(function() {
					// title must match regexWhitelist, must not match regexBlacklist and href must not be in epsBlacklist to be considered a valid episode
					if (kissanime.regexWhitelist.test(this.text) && !kissanime.regexBlacklist.test(this.text) && kissanime.epsBlacklist.indexOf(this.href) == -1) {
						// prepend new object to array
						episodes.unshift({
							text: this.text.split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " "),
							href: kissanime.anime + this.href.split("/Anime/")[1] + kissanime.server
						});
					}
				});
				// get time until next episode
				let timeMillis = Date.now() + parseInt(kissanime.regexCountdown.exec(resp.responseText));
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
			} else {
				// error
				putError(dataStream, "Kissanime: " + resp.status);
			}
		}
	});
}

getEplistUrl["kissanime"] = function(partialUrl) {
	return kissanime.anime + partialUrl;
}

searchSite["kissanime"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "POST",
		url: kissanime.search,
		data: "type=Anime" + "&keyword=" + title,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissanime_loadCookies(function() {
					searchSite["kissanime"](id, title);
				});
			} else if (resp.status == 200) {
				// OK
				let results = [];

				let list = $(resp.responseText);
				list.each(function() {
					results.push({
						title: this.text,
						href:  this.pathname.split("/")[2]
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* 9anime */
/*******************************************************************************************************************************************************************/
const nineanime = {};
nineanime.base = "https://9anime.to/";
nineanime.anime = nineanime.base + "watch/";
nineanime.servers = nineanime.base + "ajax/film/servers/";
nineanime.search = nineanime.base + "search?keyword=";
nineanime.regexBlacklist = /preview|special|trailer|CAM/i;

// open captcha page
function nineanime_openCaptcha() {
	if (GM_getValue("NAcaptcha", false) + 30*1000 < Date.now()) {
		GM_setValue("NAcaptcha", Date.now());
		GM_openInTab(nineanime.base, false);
	}
}

// function to execute when script is run on nineanime
pageLoad["nineanime"] = function() {
	// close window if opended by script
	if (GM_getValue("NAcaptcha", false) && document.title != "WAF") {
		GM_setValue("NAcaptcha", false);
		window.close();
	}
}

getEpisodes["nineanime"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.servers + url.match(/\.(\w+)$/)[1],
		onload: function(resp) {
			if (resp.status == 200) {
				// successful response is a json with only html attribute, parse it
				let json = null;
				try {
					json = JSON.parse(resp.response);
				} catch (e) {
					// solving captcha
					nineanime_openCaptcha();
					return;
				}

				// OK
				let jqPage = $(json.html);
				let episodes = [];
				// get servers
				let servers = jqPage.find("div.widget-body > .server");
				let as = null;
				// auto select server with the most videos
				servers.each(function() {
					let nas = $(this).find("li > a");
					if (!as || nas.length > as.length) {
						as = nas;
					}
				});
				if (as) {
					as.each(function() {
						// ignore blacklisted episodes
						if (!nineanime.regexBlacklist.test($(this).text())) {
							// push episode to array
							episodes.push({
								text: "Episode " + $(this).text().replace(/^0+(?=\d+)/, ""),
								href: nineanime.base + $(this).attr("href").substr(1),
							});
						}
					});
				}
				// get time if available
				GM_xmlhttpRequest({
					method: "GET",
					url: nineanime.anime + url,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let time = $(resp.response).find("#main > div > div.alert.alert-primary > i");
							let timeMillis = undefined;
							if (time.length !== 0) {
								// timer is present
								timeMillis = time.data("to") * 1000;
							}
							// callback
							putEpisodes(dataStream, episodes, timeMillis);
						} else {
							// not OK, callback
							putEpisodes(dataStream, episodes, undefined);
						}
					}
				});
			} else {
				// error
				putError(dataStream, "9anime: " + resp.status);
			}
		}
	});
}

getEplistUrl["nineanime"] = function(partialUrl) {
	return nineanime.anime + partialUrl;
}

searchSite["nineanime"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: nineanime.search + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];
				// get results from response
				let list = jqPage.find("#main > div > div:nth-child(3) > div.widget-body > div.film-list > .item");
				list = list.slice(0, 10);
				// add to results
				list.each(function() {
					// get anchor for text and href
					let a = $(this).find("a")[1];
					// get episode count
					let ep = $(this).find(".status > .ep").text().match(/\/(\d+)/);
					results.push({
						title:    a.text,
						href:     a.href.split("/")[4],
						episodes: ep ? (ep[1] + " eps") : "1 ep"
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* animetwist */
/*******************************************************************************************************************************************************************/
const animetwist = {};
animetwist.base = "https://twist.moe/";
animetwist.anime = animetwist.base + "a/"
animetwist.api = animetwist.base + "api/anime/";
animetwist.token = "1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR";

getEpisodes["animetwist"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.api + url,
		headers: { "x-access-token": animetwist.token },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response).episodes;
				let episodes = [];
				// insert all episodes
				for (let i = 0; i < list.length; i++) {
					let n = list[i].number;
					episodes[n - 1] = {
						text: "Episode " + n,
						href: animetwist.anime + url + "/" + n,
					}
				}
				// callback
				putEpisodes(dataStream, episodes, undefined);
			} else {
				// error
				putError(dataStream, "Anime Twist: " + resp.status);
			}
		}
	});
}

getEplistUrl["animetwist"] = function(partialUrl) {
	return animetwist.anime + partialUrl;
}

searchSite["animetwist"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: animetwist.api,
		headers: { "x-access-token": animetwist.token },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let list = JSON.parse(resp.response);
				let results = [];
				// turn title into regex to filter results
				let titleRegex = new RegExp(title.replace(/\W+/, ".*"), "i");

				if (list) {
					for (let i = 0; i < list.length; i++) {
						let r = list[i];
						// filter only matching titles
						if (titleRegex.test(r.title)) {
							results.push({
								title: r.title,
								href:  r.slug.slug,
							})
						}
					}
				}
				// callback
				putResults(id, results);
			}
		}
	});
}

/* horriblesubs */
/*******************************************************************************************************************************************************************/
const horriblesubs = {};
horriblesubs.base = "https://horriblesubs.info/";
horriblesubs.anime = horriblesubs.base + "shows/"
horriblesubs.api = horriblesubs.base + "api.php?method=getshows&type=show&showid="
horriblesubs.nextid = "&nextid=";

horriblesubs.regexID = /(?<=hs_showid = )\d+/;
horriblesubs.resultsPerPage = 12;
horriblesubs.loadPage = 2;

function parseEpisodes(jqPage, episodes) {
	jqPage.each(function() {
		let ep = parseInt(this.id);
		let div = $(this).find(".rls-link").last();
		let res = div.attr("id").split("-")[1];
		let href = div.find(".hs-magnet-link > a").attr("href");
		episodes[ep - 1] = {
			text: `Ep ${ep} (${res})`,
			href: href,
		}
	});
}

getEpisodes["horriblesubs"] = function(dataStream, url) {
	// request id
	GM_xmlhttpRequest({
		method: "GET",
		url: horriblesubs.anime + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let showid = resp.responseText.match(horriblesubs.regexID);

				// request first page of results
				GM_xmlhttpRequest({
					method: "GET",
					url: horriblesubs.api + showid,
					onload: function(resp) {
						if (resp.status == 200) {
							// OK
							let jqPage = $(resp.responseText);
							let episodes = [];
							// parse first page of episodes
							parseEpisodes(jqPage, episodes);
							// put episodes, may be overridden by next requests
							putEpisodes(dataStream, episodes, undefined);
							// check if you need to download another page
							let latestEp = parseInt(jqPage.find(".rls-info-container:first-child()").attr("id"));
							let nextEp = parseInt(dataStream.parents(".list-item").find(properties.findProgress).find(".link").text()) + 1;

							let reqPage = Math.floor((latestEp - nextEp) / horriblesubs.resultsPerPage);

							// request n pages (avoids multiple requests to page 0)
							for (let i = 0; i < horriblesubs.loadPage && reqPage > 0; i++) {
								GM_xmlhttpRequest({
									method: "GET",
									url: horriblesubs.api + showid + nextid + reqPage,
									onload: function(resp) {
										if (resp.status == 200) {
											// OK
											parseEpisodes($(resp.responseText), episodes);
											// put episodes
											putEpisodes(dataStream, episodes, undefined);
										}
									}
								});
								// next page
								reqPage--;
							}
						}
					}
				});
			} else {
				// error
				putError(dataStream, "HorribleSubs: " + resp.status);
			}
		}
	});
}

getEplistUrl["horriblesubs"] = function(partialUrl) {
	return horriblesubs.anime + partialUrl;
}

searchSite["horriblesubs"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: horriblesubs.anime,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];

				let split = title.split(/\W+/g);
				let shows = jqPage.find(".ind-show > a");
				shows.each(function() {
					for (let i = 0; i < split.length; i++) {
						if (!this.text.includes(split[i])) {
							return;
						}
					}
					results.push({
						title: this.text,
						href:  this.pathname.split("/")[2],
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* kissmanga */
/*******************************************************************************************************************************************************************/
const kissmanga = {};
kissmanga.base = "https://kissmanga.com/";
kissmanga.manga = kissmanga.base + "Manga/";
kissmanga.search = kissmanga.base + "Search/SearchSuggest";
// regex
kissmanga.regexVol = /vol.+?\d+/i;

// loads kissmanga cookies and then calls back
function kissmanga_loadCookies(callback) {
	if (GM_getValue("KMloadcookies", false) + 30*1000 < Date.now()) {
		GM_setValue("KMloadcookies", Date.now());
		GM_openInTab(kissmanga.base, true);
	}
	if (callback) {
		setTimeout(function() {
			callback();
		}, 6000);
	}
}

// function to execute when script is run on kissmanga
pageLoad["kissmanga"] = function() {
	if (GM_getValue("KMloadcookies", false) && document.title != "Just a moment...") {
		GM_setValue("KMloadcookies", false);
		window.close();
	}
}

getEpisodes["kissmanga"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: kissmanga.manga + url,
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissmanga_loadCookies(function() {
					getEpisodes["kissmanga"](dataStream, url);
				});
			} else if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get table rows for the episodes
				let trs = jqPage.find(".listing").find("tr");
				// get series title to remove it from chapter name
				let title = jqPage.find("#leftside > div:nth-child(1) > div.barContent > div:nth-child(2) > a").text();
				// filter and add to episodes array
				trs.each(function() {
					let a = $(this).find("td > a");
					if (a.length === 0) return;
					let t = a.text().split(title)[1].substring(1).replace(/ 0+(?=\d+)/, " ");
					// get all numbers in title
					let n = t.match(/\d+/g);
					// if vol is present then get second match else get first
					n = kissmanga.regexVol.test(t) ? n[1] : n[0];
					// chapter number - 1 is used as index
					n = parseInt(n) - 1;
					// add chapter to array
					episodes[n] = {
						text:      t,
						href:      kissmanga.manga + a.attr('href').split("/Manga/")[1],
						timestamp: Date.parse($(this).find("td:nth-child(2)").text()),
					};
				});
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
			} else {
				// error
				putError(dataStream, "Kissmanga: " + resp.status);
			}
		}
	});
}

getEplistUrl["kissmanga"] = function(partialUrl) {
	return kissmanga.manga + partialUrl;
}

searchSite["kissmanga"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "POST",
		url: kissmanga.search,
		data: "type=Manga" + "&keyword=" + title,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 503) {
				// loading CF cookies
				kissmanga_loadCookies(function() {
					searchSite["kissmanga"](id, title);
				});
			} else if (resp.status == 200) {
				// OK
				let results = [];

				let list = $(resp.responseText);
				list.each(function() {
					results.push({
						title: this.text,
						href:  this.pathname.split("/")[2],
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* mangadex */
/*******************************************************************************************************************************************************************/
const mangadex = {};
mangadex.base = "https://mangadex.org/";
mangadex.manga = mangadex.base + "manga/";
mangadex.manga_api = mangadex.base + "api/manga/";
mangadex.chapter = mangadex.base + "chapter/";
mangadex.lang_code = "gb";
mangadex.search = mangadex.base + "quick_search/";

getEpisodes["mangadex"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.manga_api + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let res_ch = JSON.parse(resp.response).chapter;
				let episodes = [];
				// parse json
				for (let key in res_ch) {
					if (res_ch.hasOwnProperty(key)) {
						let ch = res_ch[key];
						// skip wrong language
						if (ch.lang_code != mangadex.lang_code) continue;
						// put into episodes array
						episodes[ch.chapter - 1] = {
							text:      (ch.volume && `Vol. ${ch.volume} `) + `Ch. ${ch.chapter}`,
							href:      mangadex.chapter + key,
							timestamp: ch.timestamp,
						}
					}
				}
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
			} else {
				// error
				putError(dataStream, "MangaDex: " + resp.status);
			}
		}
	});
}

getEplistUrl["mangadex"] = function(partialUrl) {
	return mangadex.manga + partialUrl;
}

searchSite["mangadex"] = function(id, title) {
	GM_xmlhttpRequest({
		method: "GET",
		url: mangadex.search + encodeURI(title),
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let results = [];
				// get title anchors
				let titles = $(resp.response).find("#search_manga").find("a.manga_title");
				titles.each(function() {
					results.push({
						title: this.title,
						href:  this.pathname.split("/")[2]
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* kissmanga */
/*******************************************************************************************************************************************************************/
const jbox = {};
jbox.base = "https://jaiminisbox.com/";
jbox.manga = jbox.base + "reader/series/";
jbox.search = jbox.base + "reader/search/";
// regex
jbox.dateRegex = /(\w+|[\d\.]+)(?= $)/;

getEpisodes["jaiminisbox"] = function(dataStream, url) {
	GM_xmlhttpRequest({
		method: "GET",
		url: jbox.manga + url,
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let episodes = [];
				// get chapter divs
				let divs = jqPage.find("#content > .panel > .list > .group > .element");

				divs.each(function() {
					// get title, href and chapter number
					let a = $(this).find(".title > a");
					let t = a.text();
					let m = t.match(/\d+/);
					// skip if no chapter number found
					if (!m) return;
					// chapter number - 1 is used as index
					let n = parseInt(m[0]) - 1;
					// get date
					let date = $(this).find(".meta_r").text().match(jbox.dateRegex)[0];
					if (date == "Today" || date == "Yesterday") {
						let d = new Date();
						d.setHours(0);
						d.setMinutes(0);
						d.setSeconds(0);
						d.setMilliseconds(0);
						date = +d;
						// remove 24h if yesterday
						if (date == "Yesterday") date -= 24*60*60*1000;
					} else {
						date = Date.parse(date);
					}
					// add chapter to array
					episodes[n] = {
						text:      t,
						href:      a.attr("href"),
						timestamp: date,
					};
				});
				// estimate timeMillis
				let timeMillis = estimateTimeMillis(episodes, 5);
				// callback
				putEpisodes(dataStream, episodes, timeMillis);
			} else {
				// error
				putError(dataStream, "Jaimini's Box: " + resp.status);
			}
		}
	});
}

getEplistUrl["jaiminisbox"] = function(partialUrl) {
	return jbox.manga + partialUrl;
}

searchSite["jaiminisbox"] = function(id, title) {
	GM_xmlhttpRequest({
		method:  "POST",
		url:     jbox.search,
		data:    "search=" + encodeURIComponent(title),
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		onload: function(resp) {
			if (resp.status == 200) {
				// OK
				let jqPage = $(resp.response);
				let results = [];

				let as = jqPage.find("#content > .panel > .list > .group > .title > a");
				as.each(function() {
					results.push({
						title: this.text,
						href:  this.href.split("/")[5],
					});
				});
				// callback
				putResults(id, results);
			}
		}
	});
}

/* MAL list */
/*******************************************************************************************************************************************************************/
const mal = {};
mal.timerRate = 15000;
mal.loadRows = 25;
mal.genericErrorMsg = "Error while performing request";

let onScrollQueue = [];
let requestsQueues = {};

pageLoad["list"] = function() {
	// own list
	if ($(".header-menu.other").length !== 0) return;
	if ($(properties.watching).length !== 1) return;

	// add col header to table
	$("#list-container").find("th.header-title.title").after(properties.colHeader);
	$(".header-title.stream").css("min-width", "120px");

	// doesn't work without the delay for some reason
	setTimeout(function() {
		// column header listener
		$(".header-title.stream").on("click", function() {
			$(".data.stream").each(function() {
				// update dataStream without skipping queue
				updateList($(this), true, false);
			});
		});

		// load first n rows, start from 1 to remove header
		loadRows(1, mal.loadRows + 1);
	}, 100);

	// update timer
	setInterval(function() {
		$(".data.stream").trigger("update-time");
	}, mal.timerRate);

	// check when an element comes into view
	$(window).scroll(function() {
		// get viewport
		let top = $(window).scrollTop();
		let bottom = top + $(window).height();
		// iterate scroll event queue
		let i = onScrollQueue.length;
		while (i--) {
			if (top < onScrollQueue[i].offset().top && bottom > onScrollQueue[i].offset().top) {
				onScrollQueue[i].trigger("intoView");
				// remove element
				onScrollQueue.splice(i, 1);
			}
		}
	});
}

// force hide more-info
const hideInfoSheet = document.createElement("style");
hideInfoSheet.innerHTML =`
	.list-table .more-info {
		display: none!important;
	}
`;

// loads more-info and saves comment in dataStream
function loadRows(start, end) {
	// get rows
	let rows = $("#list-container > div.list-block > div > table > tbody").slice(start, end);
	if (rows.length == 0) {
		return;
	}

	// pre-hide more-info
	document.body.appendChild(hideInfoSheet);

	// expand more-info
	rows.find(".more > a").each(function() {
		this.click();
	});

	// add cells to column
	rows.find(".list-table-data > .data.title").after("<td class='data stream'></td>");

	let dataStreams = rows.find(".data.stream");

	// style dataStreams
	dataStreams.css("font-weight", "normal");
	dataStreams.css("line-height", "1.5em");

	// wait
	let interval = setInterval(function() {
		let done = true;
		// put comment into data("comment")
		rows.each(function() {
			let td = $(this).find(".td1.borderRBL");
			// if not loaded yet then check later
			if (td.length == 0) {
				done = false;
				return
			}
			let comment = td.html().match(properties.commentsRegex);
			if (comment) {
				// match the first capturing group
				comment = comment[1];
			} else {
				comment = null;
			}

			let dataStream = $(this).find(".data.stream");
			dataStream.data("comment", comment);

			// check if need to add eplist
			if (dataStream.find(".eplist").length !== 0) return;
			if (!comment) return;
			let url = getUrlFromComment(comment);
			if (!url) return;
			// add click to update message
			dataStream.prepend("<div class='error'><b>Click to update</b></div>");
			// add eplist
			let eplistUrl = getEplistUrl[url[0]](url[1]);
			dataStream.append("<a class='eplist' target='_blank' href='" + eplistUrl + "'>" + properties.ep + " list</a>");
			// add favicon
			let domain = getDomainById(url[0]);
			if (domain) {
				let src = "https://www.google.com/s2/favicons?domain=" + domain;
				dataStream.append("<img class='favicon' src='" + src + "' style='position: relative; top: 3px; padding-left: 4px'>");
			}
		});

		if (done) {
			// collapse more-info
			rows.find(".more-info").css("display", "none");
			// remove sheet
			document.body.removeChild(hideInfoSheet);
			// load links
			$(".header-title.stream").trigger("click");
			// stop interval
			clearInterval(interval);
		}
	}, 100);

	// table cell listener
	dataStreams.on("click", function() {
		updateList($(this), true, true);
	});

	// complete one episode listener
	rows.find(properties.iconAdd).on("click", function() {
		let dataStream = $(this).parents(".list-item").find(".data.stream");
		updateList(dataStream, false, false);
	});

	// timer event
	dataStreams.on("update-time", function() {
		let dataStream = $(this);
		if (dataStream.find(".nextep, .loading, .error").length > 0) {
			// do nothing if timer is not needed
			return;
		}
		// get time object from dataStream
		let t = dataStream.data("timeMillis");
		// get next episode number
		let nextEp = parseInt(dataStream.parents(".list-item").find(properties.findProgress).find(".link").text()) + 1;
		let timeMillis;
		// if t.ep is set then it needs to be equal to nextEp, else we set timeMillis to false to display Not Yet Aired
		if (t && (t.ep ? t.ep == nextEp : true)) {
			timeMillis = t.timeMillis - Date.now();
		} else {
			timeMillis = false;
		}

		let time;
		if (!timeMillis || isNaN(timeMillis) || timeMillis < 1000) {
			time = properties.notAired;
		} else {
			const d = Math.floor(timeMillis / (1000 * 60 * 60 * 24));
			const h = Math.floor((timeMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const m = Math.floor((timeMillis % (1000 * 60 * 60)) / (1000 * 60));
			time = (h < 10 ? "0"+h : h) + "h:" + (m < 10 ? "0" + m : m) + "m";
			if (d > 0) {
				time = d + (d == 1 ? " day " : " days ") + time;
			}
		}
		if (dataStream.find(".timer").length === 0) {
			// if timer doesn't exist create it
			dataStream.prepend("<div class='timer'>" + time + "<div>");
		} else {
			// update timer
			dataStream.find(".timer").html(time);
		}
	});

	// add last element to scroll event queue
	let last = rows.last();
	last.on("intoView", function() {
		loadRows(end, end + mal.loadRows);
	});
	onScrollQueue.push(last);
}

// updates dataStream cell
function updateList(dataStream, forceReload, skipQueue) {
	// remove old divs
	dataStream.find(".error").remove();
	dataStream.find(".nextep").remove();
	dataStream.find(".loading").remove();
	dataStream.find(".timer").remove();
	// get episode list from data
	let episodeList = dataStream.data("episodeList");
	if (Array.isArray(episodeList) && !forceReload) {
		// episode list exists
		updateList_exists(dataStream);
	} else {
		// episode list doesn't exist or needs to be reloaded
		updateList_doesntExist(dataStream, skipQueue);
	}
}

function updateList_exists(dataStream) {
	// listitem
	let listitem = dataStream.parents(".list-item");
	// get current episode number
	let currEp = parseInt(listitem.find(properties.findProgress).find(".link").text());
	if (isNaN(currEp)) currEp = 0;
	// add offset to currEp
	currEp += parseInt(dataStream.data("offset"));
	// get episodes from data
	let episodes = dataStream.data("episodeList");
	// create new nextep
	let nextep = $("<div class='nextep'></div>");

	if (episodes.length > currEp) {
		// there are episodes available
		let isAiring = listitem.find(properties.findAiring).length !== 0;
		let t = episodes[currEp] ? episodes[currEp].text : ("Missing #" + (currEp + 1));

		let a = $("<a></a>");
		a.text(t.length > 13 ? t.substr(0, 12) + "…" : t);
		if (t.length > 13) a.attr("title", t);
		a.attr("href", episodes[currEp] ? episodes[currEp].href : "#");
		a.attr("target", "_blank");
		a.attr("class", isAiring ? "airing" : "non-airing");
		a.css("color", isAiring ? "#2db039" : "#ff730a");
		nextep.append(a);

		if (episodes.length - currEp > 1) {
			// if there is more than 1 new ep then put the amount in parenthesis
			nextep.append(" (" + (episodes.length - currEp) + ")");
		}
		// add new nextep
		dataStream.prepend(nextep);
	} else if (currEp > episodes.length) {
		// user has watched too many episodes
		nextep.append($("<div class='ep-error'>" + properties.latest + episodes.length + "</div>").css("color", "red"));
		// add new nextep
		dataStream.prepend(nextep);
	} else {
		// there aren't episodes available, trigger timer
		dataStream.trigger("update-time");
	}
}

function queueGetEpisodes(dataStream, service, url) {
	// get queue for specified service or create it
	let queue = requestsQueues[service];
	if (!queue) {
		queue = [];
		queue.timers = 0;
		queue.maxRequests = (queueSettings[service] || queueSettings["default"]).maxRequests;
		queue.timeout = (queueSettings[service] || queueSettings["default"]).timeout;
		requestsQueues[service] = queue;
	}

	if (queue.timers < queue.maxRequests) {
		// if there are no active timers, set timer and do request
		queue.timers++
		getEpisodes[service](dataStream, url);
		setTimeout(function() {
			dequeueGetEpisodes(service);
		}, queue.timeout);
	} else {
		// queue full, append to end
		queue.push({
			dataStream: dataStream,
			url:        url,
		});
	}
}

function dequeueGetEpisodes(service) {
	let queue = requestsQueues[service];

	if (queue.length > 0) {
		// if there are elements in queue, request the first and restart the timer
		let req = queue.shift();
		getEpisodes[service](req.dataStream, req.url);
		setTimeout(function() {
			dequeueGetEpisodes(service);
		}, queue.timeout);
	} else {
		// queue empty, terminate timer
		queue.timers--;
	}
}

function updateList_doesntExist(dataStream, skipQueue) {
	// check if comment exists and is correct
	let comment = dataStream.data("comment");
	if (comment) {
		// comment exists
		// url is and array that contains the streaming service and url relative to that service
		let url = getUrlFromComment(comment);
		if (url) {
			// comment valid
			// add loading
			dataStream.prepend("<div class='loading'>Loading...</div>");
			// set offset data
			dataStream.data("offset", url[2] ? url[2] : 0);
			// queue getEpisode if needed
			if (!skipQueue) {
				queueGetEpisodes(dataStream, url[0], url[1]);
			} else {
				getEpisodes[url[0]](dataStream, url[1]);
			}
		} else {
			// comment invalid
			dataStream.append("<div class='error'>Invalid Link</div>");
		}
	} else {
		// comment doesn't extst
		dataStream.append("<div class='error'>No Link</div>");
	}
}

// save episodeList and timeMillis inside .data.stream of listitem
function putEpisodes(dataStream, episodes, timeMillis) {
	// add episodes to dataStream
	dataStream.data("episodeList", episodes);
	// add timeMillis to dataStream
	if (timeMillis) {
		// timeMillis is valid
		dataStream.data("timeMillis", { timeMillis: timeMillis });
	} else if (properties.mode == "anime") {
		// timeMillis doesn't exist, get time from anilist
		anilist_setTimeMillis(dataStream, true);
	}
	updateList(dataStream, false, false);
}

// set error to dataStream
function putError(dataStream, error) {
	// remove old divs
	dataStream.find(".error").remove();
	dataStream.find(".nextep").remove();
	dataStream.find(".loading").remove();
	dataStream.find(".timer").remove();
	// create error div
	dataStream.prepend($(`<div class='error'>${error || mal.genericErrorMsg}</div>`).css("color", "red"));
}

/* MAL edit */
/*******************************************************************************************************************************************************************/
pageLoad["edit"] = function() {
	// get title
	let title = $("#main-form > table:nth-child(1) > tbody > tr:nth-child(1) > td:nth-child(2) > strong > a")[0].text;
	// add titleBox with default title
	title = title.replace(/'/g, "&apos;");
	let titleBox = $("<input type='text' value='" + title + "' size='36' style='font-size: 11px; padding: 3px;'>");
	// add #search div
	let search = $("<div id='search'><b style='font-size: 110%; line-height: 180%;'>Search: </b></div>");
	$(properties.editPageBox).after("<br>", titleBox, "<br>", search);
	// add streamingServices
	let first = true;
	streamingServices.forEach(function(ss) {
		if (ss.type != properties.mode) return;
		// don't append ", " before first ss
		if (first) {
			first = false;
		} else {
			search.append(", ");
		}
		// new anchor
		let a = $("<a></a>");
		a.text(ss.name);
		a.attr("href", "#");
		// on anchor click
		a.on("click", function() {
			// remove old results
			search.find(".site").remove();
			// add new result box
			search.append("<div class='site " + ss.id + "'><div id='searching'>Searching...</div></div>");
			// execute search
			searchSite[ss.id](ss.id, titleBox.val());
			// return
			return false;
		});
		search.append(a);
	});
	search.append("<br>");

	// offset textarea
	let offsetBox = $("<input type='text' size='1' style='font-size: 11px; padding: 3px; margin-left: 8px;'>");
	let o = $(properties.editPageBox).val().split(" ")[2];
	if (o) offsetBox.val(o);
	// Set Offset button
	let a = $("<a>Set Offset</a>");
	a.attr("href", "#");
	a.on("click", function() {
		// get offset from offsetBox
		let o = parseInt(offsetBox.val());
		// replace or append to commentBox
		let val = $(properties.editPageBox).val().split(" ");
		if (!o || o == 0) {
			val[2] = undefined;
		} else {
			val[2] = o;
		}
		$(properties.editPageBox).val(val.join(" "));
		return false;
	});
	// offset div
	let offset = $("<div id='offset'>");
	offset.append(a, offsetBox);
	search.after(offset);
}

function putResults(id, results) {
	let siteDiv = $("#search").find("." + id);
	// if div with current id cant be found then don't add results
	if (siteDiv.length !== 0) {
		siteDiv.find("#searching").remove();

		if (results.length === 0) {
			siteDiv.append("No Results. Try changing the title in the search box above.");
			return;
		}
		// add results
		for (let i = 0; i < results.length; i++) {
			let r = results[i];
			let a = $("<a href='#'>Select</a>");
			a.on("click", function() {
				$(properties.editPageBox).val(id + " " + r.href);
				return false;
			});
			siteDiv.append("(").append(a).append(") ").append("<a target='_blank' href='" + getEplistUrl[id](r.href) + "'>" + r.title + "</a>");
			if (r.episodes) {
				siteDiv.append(" (" + r.episodes + ")");
			}
			siteDiv.append("<br>");
		}
	}
}

/* main */
/*******************************************************************************************************************************************************************/
// associates an url with properties and pageLoad function
let pages = [
	{ url: kissanime.base,                           prop: null,    load: "kissanime"  },
	{ url: kissmanga.base,                           prop: null,    load: "kissmanga"  },
	{ url: nineanime.base,                           prop: null,    load: "nineanime"  },
	{ url: animetwist.base,                          prop: null,    load: "animetwist" },
	{ url: "https://myanimelist.net/animelist/",     prop: "anime", load: "list"       },
	{ url: "https://myanimelist.net/mangalist/",     prop: "manga", load: "list"       },
	{ url: "https://myanimelist.net/ownlist/anime/", prop: "anime", load: "edit"       },
	{ url: "https://myanimelist.net/ownlist/manga/", prop: "manga", load: "edit"       },
];

(function($) {
	for (let i = 0; i < pages.length; i++) {
		if (window.location.href.indexOf(pages[i].url) != -1) {
			properties = properties[pages[i].prop];
			pageLoad[pages[i].load]();
			break;
		}
	}
})(jQuery);

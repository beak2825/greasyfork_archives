// ==UserScript==
// @name        Youtube Music Lyrics
// @namespace   https://greasyfork.org/users/102866
// @description Adds lyrics to Youtube Music
// @match     https://music.youtube.com/*
// @require     https://code.jquery.com/jquery-3.7.1.min.js
// @require     https://code.jquery.com/ui/1.14.1/jquery-ui.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/list.js/2.3.1/list.min.js
// @author      TiLied
// @version     0.3.02
// @grant       GM_listValues
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM.listValues
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/404273/Youtube%20Music%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/404273/Youtube%20Music%20Lyrics.meta.js
// ==/UserScript==

let oldTitle = "";

const oneSecond = 1000,
	oneDay = oneSecond * 60 * 60 * 24,
	oneWeek = oneDay * 7,
	oneMonth = oneWeek * 4;

let setupSearchOnce = true;	

class Options2 
{
	constructor(version)
	{
		this.version = version;
		this.debug = false;
		this.contextmenu = false;

		this.providers = [];
		this["providers"].push(
			{
				priority: 0,
				name: "Local cache YML",
				getLyrics: function ()
				{
					return;
				},
				custom: ""
			});
		this["providers"].push(
			{
				priority: 1,
				name: "Local website Youtube",
				getLyrics: function (artist, title)
				{
					return new Promise(function (resolve)
					{
						let _bs = $(".tab-header");

						if (_bs.length === 0)
							resolve("Lyrics not found!");

						if ($(_bs[1]).attr("aria-selected") === "true")
						{
							let _m = $("[page-type='MUSIC_PAGE_TYPE_TRACK_LYRICS']");
							if (typeof _m === "undefined")
								resolve("Lyrics not found!");

							setTimeout(() =>
							{
								let _l = $(_m).find(".non-expandable.description:visible");

								if (typeof _l === "undefined" || _l === null || _l.length === 0 || $(_l).attr("hidden") === true)
								{
									resolve("Lyrics not found!");
								}

								resolve($(_l).text());
							}, oneSecond + oneSecond);

						} else
						{
							resolve("Lyrics not found!");
						}
					});
				},
				custom: ""
			});
		this["providers"].push(
			{
				priority: 2,
				name: "Api - https://github.com/NTag/lyrics.ovh",
				getLyrics: function (artist, title)
				{
					return new Promise(function (resolve)
					{
						//api - https://github.com/NTag/lyrics.ovh
						GM.xmlHttpRequest({
							method: "GET",
							url: "https://api.lyrics.ovh/v1/" + artist + "/" + title + "",
							timeout: oneSecond * 5,
							onload: function (response)
							{
								console.log(response);
								if (response.status === 200)
								{
									let r = JSON.parse(response.responseText);
									if (Object.keys(r)[0] === "lyrics")
									{
										let lyrics = r["lyrics"];
										if (lyrics)
										{
											resolve(lyrics);
										} else
										{
											resolve("Lyrics not found!");
										}
									} else
									{
										resolve("Lyrics not found!");
									}
								} else
								{
									resolve("Lyrics not found!");
								}
							},
							onerror: function (e)
							{
								resolve("Lyrics not found!");
							}
						});
					});
				},
				custom: ""
			});
		this["providers"].push(
			{
				priority: 3,
				name: "Api - https://github.com/rhnvrm/lyric-api",
				getLyrics: function (artist, title)
				{
					return new Promise(function (resolve)
					{
						//api - https://github.com/rhnvrm/lyric-api

						GM.xmlHttpRequest({
							method: "GET",
							url: "https://lyric-api.herokuapp.com/api/find/" + artist + "/" + title + "",
							timeout: oneSecond * 5,
							onload: function (response)
							{
								console.log(response);
								if (response.status === 200)
								{
									let r = JSON.parse(response.responseText);
									if (r["err"] === "none")
									{
										let lyrics = r["lyric"];

										lyrics = HtmlDecode(lyrics);

										resolve(lyrics);
									} else
									{
										resolve("Lyrics not found!");
									}
								} else
								{
									resolve("Lyrics not found!");
								}
							},
							onerror: function (e)
							{
								console.warn(e);
								resolve("Lyrics not found!");
							}
						});
					});
				},
				custom: ""
			});
		this["providers"].push(
			{
				priority: 4,
				name: "Api - http://api.lololyrics.com/",
				getLyrics: function (artist, title)
				{
					return new Promise(function (resolve)
					{
						//api - http://api.lololyrics.com/

						GM.xmlHttpRequest({
							method: "GET",
							url: "http://api.lololyrics.com/0.5/getLyric?artist=" + artist + "&track=" + title + "",
							timeout: oneSecond * 5,
							onload: function (response)
							{
								console.log(response);
								if (response.status === 200)
								{
									let xml = response.responseXML.all;

									if (xml[1].textContent === "OK")
									{
										let lyrics = xml[2].innerHTML;
										resolve(lyrics);
									} else
									{
										resolve("Lyrics not found!");
									}
								} else
								{
									resolve("Lyrics not found!");
								}
							},
							onerror: function (e)
							{
								console.warn(e);
								resolve("Lyrics not found!");
							}
						});
					});
				},
				custom: ""
			});
	}

	then(resolve)
	{
		console.time("Options2.then");
		console.timeLog("Options2.then");

		Options2._GMHasValue("yml_options2").then((r) =>
		{
			if (r === true)
			{
				GM.getValue("yml_options2").then((v) =>
				{
					let _v = JSON.parse(v);
					this.SetOptions = _v;
				});
			} else
			{
				let stringStorage =
				{
					version: this.version,
					debug: this.debug,
					contextmenu: this.contextmenu,
					providers: this.providers
				};

				Options2._GMUpdate("options2", stringStorage);
			}

			console.timeEnd("Options2.then");
			resolve("done");
		});

	}

	//Start
	//Functions GM_VALUE
	//Check if value exists or not.  optValue = Optional
	static async _GMHasValue(nameVal, optValue)
	{
		return new Promise((resolve, reject) =>
		{
			GM.listValues().then(vals =>
			{

				if (vals.length === 0)
				{
					if (optValue !== undefined)
					{
						GM.setValue(nameVal, optValue);
						resolve(true);
					} else
					{
						resolve(false);
					}
				}

				if (typeof nameVal !== "string")
				{
					reject(console.error("name of value: '" + nameVal + "' are not string"));
				}

				for (let i = 0; i < vals.length; i++)
				{
					if (vals[i] === nameVal)
					{
						resolve(true);
					}
				}

				if (optValue !== undefined)
				{
					GM.setValue(nameVal, optValue);
					resolve(true);
				} else
				{
					resolve(false);
				}
			});
		});

	}

	//Delete Values
	static async _GMDeleteValues(nameVal)
	{
		let vals = await GM.listValues();

		if (vals.length === 0 || typeof nameVal !== "string")
			return;

		switch (nameVal)
		{
			case "all":
				for (let i = 0; i < vals.length; i++)
				{
					if (vals[i] !== "adm")
					{
						GM.deleteValue(vals[i]);
					}
				}
				return;
			default:
				for (let i = 0; i < vals.length; i++)
				{
					if (vals[i] === nameVal)
					{
						GM.deleteValue(nameVal);
					}
				}
				return;
		}
	}

	///Update gm value what:"cache","options"
	static _GMUpdate(what, _v)
	{
		let _l = JSON.stringify(_v);
		switch (what)
		{
			case "cache2":
				GM.setValue("yml_cache2", _l);
				break;
			case "options2":
				GM.setValue("yml_options2", _l);
				break;
			default:
				console.error("method:_GMUpdate(" + what + "," + _v + "). default switch");
				break;
		}
	}
	//Functions GM_VALUE
	//End

	set SetOptions(obj)
	{
		this.debug = obj.debug;
		this.contextmenu = obj.contextmenu;
		for (let i = 0; i < obj["providers"].length; i++)
		{
			this["providers"][i]["priority"] = obj["providers"][i]["priority"];
		}
	}

	set UpdatePriority(arr)
	{
		for (let i = 1; i < arr.length; i++)
		{
			for (let j = 1; j < this.providers.length; j++)
			{
				if (arr[i] === this.providers[j]["name"])
				{
					this.providers[j]["priority"] = i;
					break;
				}
			}
		}
	}
}

class Cache2
{
	constructor(versionCache)
	{
		this.versionCache = versionCache;
	}

	then(resolve)
	{
		console.time("Cache2.then");
		console.timeLog("Cache2.then");

		Options2._GMHasValue("yml_cache2").then((r) =>
		{
			if (r === true)
			{
				GM.getValue("yml_cache2").then((v) =>
				{
					this.SetCache = JSON.parse(v);
				});
			} else
			{
				let stringStorage = this;

				Options2._GMUpdate("cache2", stringStorage);
			}

			console.timeEnd("Cache2.then");
			resolve("done");
		});

	}

	set SetCache(obj)
	{
		if (obj["versionCache"] === this.versionCache)
		{
			let _k = Object.keys(obj)
			for (let i = 0; i < _k.length; i++)
			{
				this[_k[i]] = obj[_k[i]];
			}
		}
		//todo update cache
	}

	CheckData(_data)
	{
		//check if data exist
		let _keys = Object.keys(this);
		for (let i = 0; i <= _keys.length; i++)
		{
			if (i === _keys.length)
			{
				this[_data["id"]] = _data;
				return;
			}
			if (_data["id"] === _keys[i])
			{
				this[_keys[i]]["gettingLyricsForArtistTimes"] += 1;

				let _k = Object.keys(_data["musics"])[0]; 
				if (typeof this[_keys[i]]["musics"][_k] === "undefined") 
				{
					this[_keys[i]]["musics"][_k] = _data["musics"][_k]
					return;
				}

				this[_keys[i]]["musics"][_k]["gettingLyricsForMusicTimes"] += 1;
				//
				//delete this? or update lyrics after one month
				//or add stats TODO
				//if (this[_keys[i]]["dateId"] + oneMonth <= Date.now())
				//{
				//	this[_keys[i]] = _data;
				//	return;
				//}
				return;
			}
		}
	}

	AddLyrics(id, title, lyrics)
	{
		this[id]["musics"][title]["lyrics"] = lyrics;
	}

}

class MusicData
{
	constructor(url, artist, title, id)
	{
		this.url = url;

		this.gettingLyricsForArtistTimes = 1;

		this.id = id;
		this.artist = artist;

		this.musics = {};
		this.musics[title] =
		{
			dateId: Date.now(),
			title: title,
			lyrics: "none",
			gettingLyricsForMusicTimes: 1,
		}

	}

	then(resolve)
	{
		//
	}
}

//Start
//Function main2
void function Main2()
{
	//Options2._GMDeleteValues("all");
	console.log("Youtube Music Lyrics v" + GM.info.script.version + " initialization");

	//Set css
	SetCSS();

	//Set cache
	let cache2 = new Cache2(0.1);
	cache2.then(() =>
	{
		console.log(cache2);

		//Set options
		let options2 = new Options2(GM.info.script.version);
		options2.then(() =>
		{
			console.log(options2);

			//Console log prefs with value
			GM.listValues().then(async (_v) =>
			{
				console.log("*prefs:");
				console.log("*-----*");

				for (let i = 0; i < _v.length; i++)
				{
					let str = await GM.getValue(_v[i]);
					console.log("*" + _v[i] + ":" + str);
					console.log(JSON.parse(str));
					const byteSize = str => new Blob([str]).size;
					console.log("Size " + _v[i] + ": " + FormatBytes(byteSize(str)) + "");
				}

				console.log("*-----*");

				//Disable second mouse click(contextmenu)
				if (options2.contextmenu)
					document.addEventListener("contextmenu", function (e) { e.button === 2 && e.stopPropagation(); }, true);

				//Place UI
				SetUI(options2);

				//events
				SetEvents(options2, cache2);

				//core!
				setTimeout(() =>
				{
					Music2(options2, cache2);

					//Url handler for changing
					UrlHandler(options2, cache2);
				}, oneSecond * 5);
			});
		});
	});
}();
//Function main2
//End

async function Music2(options2, cache2)
{
	let _p = [];

	let artist = document.querySelector(".subtitle.ytmusic-player-bar").firstElementChild.firstElementChild.innerText;

	let title = document.querySelector(".title.ytmusic-player-bar").innerText;

	let _h = document.querySelector(".subtitle.ytmusic-player-bar").firstElementChild.firstElementChild.attributes.href;

	if (typeof _h === "undefined")
		return console.warn(".subtitle.ytmusic-player-bar: " + _h);

	let id = _h.value;
	
	if (artist === "" || title === "" || typeof id === "undefined" || typeof artist === "undefined" || typeof title === "undefined")
		return console.warn(artist + "-" + title + "-" + id);

	//check if we listen same song
	if (oldTitle === title)
		return;

	oldTitle = title;

	let _data = new MusicData(document.URL, artist, title, id);
	console.log(_data);
	cache2.CheckData(_data);
	console.log(cache2);

	if (cache2[id]["musics"][title]["lyrics"] === "none")
	{
		for (let i = 0; i < options2["providers"].length; i++)
		{
			for (let j = 0; j < 5; j++)
			{
				if (options2["providers"][i]["priority"] === j)
					_p.push(options2["providers"][i]);
			}
		}

		//there is no local, this is why i = 1
		for (let i = 1; i <= _p.length; i++)
		{
			if (i === _p.length)
			{
				cache2.AddLyrics(id, title, "No lyrics found!");
				break;
			}

			let _l = await _p[i]["getLyrics"](artist, title);
			console.log(_l);

			if (_l !== "Lyrics not found!")
			{
				cache2.AddLyrics(id, title, _l);
				break;
			}

			cache2.AddLyrics(id, title, _l);
		}
	}

	//display
	$("#yml_musicName").text(artist + " - " + title + ":");
	$("#yml_lyricsPanel pre").text("\r\n\r\n" + cache2[id]["musics"][title]["lyrics"]);

	//save lyrics
	Options2._GMUpdate("cache2", cache2);
}

//-------------------------
//UI AND VISUAL STAFF BELOW
//-------------------------

//Start
//Function set ui 
function SetUI(options2)
{
	let rightC = $(".middle-controls-buttons");
	let mainP = $("#main-panel");

	let divP = $("<div id=yml_lyricsPanel class='style-scope ytmusic-player-page'></div>").html("<header id=yml_musicName></header><pre id=yml_lyricsText class='style-scope ytmusic-player-baryt-formatted-string'>Lyrics:</pre>");
	let divB = $("<div id=yml_lyricsButton class='right-controls-buttons style-scope ytmusic-player-bar'></div>").html("<a class='yml_Button style-scope ytmusic-player-bar yt-formatted-string' style='color:inherit;'>Lyrics</a>");

	let divPB = $("<div id=yml_PanelButtons class='style-scope ytmusic-player-page'></div>").html("<a class='yml_Button' id=yml_addLyricsButton>Add lyrics</a><a class='yml_Button' id=yml_optionButton style='padding-left: 10px;'>Options</a><a class='yml_Button' id=yml_searchButton style='padding-left: 10px;'>Search</a>");

	let divPO = $("<div id=yml_optionsPanel class='style-scope ytmusic-player-page'></div>").html("<a class='style-scope ytmusic-player-baryt-formatted-string' style='color:inherit; font-family:inherit;'>Options:</a><form>\
<br>\
	<input type=checkbox name=debug id=yml_debug >Debug</input><br> \
	<input type=checkbox name=contextmenu id=yml_contextmenu >Context menu</input><br> \
<ul id='image-list1' class='sortable-list'>\
		<br>\
	<li class='ui-state-default ui-state-disabled' id='0'>" + options2["providers"][0]["name"] + "</li>\
	<li class='ui-state-default' id='1'><span>" + options2["providers"][1]["name"] + "</span></li>\
	<li class='ui-state-default' id='2'><span>" + options2["providers"][2]["name"] + "</span></li>\
	<li class='ui-state-default' id='3'><span>" + options2["providers"][3]["name"] + "</span></li>\
	<li class='ui-state-default' id='4'><span>" + options2["providers"][4]["name"] + "</span></li>\
</ul >\
		<br>\
		<a class='yml_Button' id=yml_clearCache >Clear cache</a><br> \
</form>");

	let divSearchPanel = document.createElement("div");
	divSearchPanel.id = "yml_searchPanel";
	divSearchPanel.classList += "style-scope ytmusic-player-page";
	
	divSearchPanel.innerHTML = "<div id='yml_searchMusics'>\
		<button id=yml_closeSearch>Close</button>\
	<div id=yml_filters>\
		<div id=yml_filterZeroGrid>\
			<input class='filter yml_searchArtist' type='text' placeholder='Search Artist'/>\
			<input class='filter yml_searchTitle' type='text' placeholder='Search Title' />\
			<input class='filter yml_searchLyrics' type='text' placeholder='Search Lyrics' />\
		</div>\
		<hr size='1' noshade=''>\
		<div id=yml_filterOneGrid>\
			<input class='filter yml_filterGettingLyricsForArtistTimes' type='text' pattern='(>|<|) \\d + ' placeholder='Filter GettingLyricsForArtistTimes(x,> x, <x)' />\
			<input class='filter yml_filterGettingLyricsForMusicTimes' type='text' pattern='(>|<|) \\d + ' placeholder='Filter GettingLyricsForMusicTimes(x,> x, <x)' />\
		</div>\
		<hr size='1' noshade=''>\
		<div id=yml_filterTwoGrid>\
			<label for='yml_filterAddedDateA'>Added After:</label>\
			<input id='yml_filterAddedDateA' class='filter yml_filterAddedDateA' type='date' placeholder='Added After' />\
			<label for='yml_filterAddedDateB'>Added Before:</label>\
			<input id='yml_filterAddedDateB' class='filter yml_filterAddedDateB' type='date' placeholder='Added Before' />\
		</div>\
		<hr size='1' noshade=''>\
	</div>\
	<div id=yml_sortGrid>\
		<button class='yml_sort' data-sort='artist'>Sort by artist</button >\
		<button class='yml_sort' data-sort='title'>Sort by title</button >\
		<button class='yml_sort' data-sort='dateId'>Sort by date</button >\
		<button class='yml_sort' data-sort='gettingLyricsForArtistTimes'>Sort by gettingLyricsForArtistTimes</button >\
		<button class='yml_sort' data-sort='gettingLyricsForMusicTimes'>Sort by gettingLyricsForMusicTimes</button >\
	</div>\
	<input class='yml_search' placeholder='Global Search' />\
	<span id=yml_resultCount></span>\
	<ul class='paginationTop pagination'></ul>\
	<hr size='1' noshade=''>\
	<ul class='yml_list' ></ul>\
	<hr size='1' noshade=''>\
	<ul class='paginationBottom pagination'></ul>\
</div>\
";

	$(divP).append(divPB);
	$(divP).prepend(divPO);
	$(mainP).append(divP);
	
	document.body.append(divSearchPanel);
	
	$(rightC).append(divB);

	$(divP).hide();
	$(divPO).hide();
	
	divSearchPanel.style.visibility = "hidden";
	
	UIValues(options2);
}
//Function set ui 
//End


//Start
//Function set UI values of settengs/options
function UIValues(options2)
{
	$("#yml_debug").prop("checked", options2.debug);
	$("#yml_contextmenu").prop("checked", options2.contextmenu);

	let li = $(".sortable-list li");

	for (let j = 1; j < options2["providers"].length; j++)
	{
		$(li[options2["providers"][j]["priority"]]).attr("id", options2["providers"][j]["priority"]);
		$(li[options2["providers"][j]["priority"]]).find("span").text(options2["providers"][j]["name"]);
	}
}
//Function set UI values of settengs/options
//End

//Start
//Function set css
function SetCSS()
{
	$("head").append($("<!--Start of Youtube Music Lyrics v" + GM.info.script.version + " CSS-->"));

	$("head").append($("<style type=text/css></style>").text("#yml_lyricsPanel { \
	position: absolute;\
	z-index: 100;\
	background-color: #1d1d1d;\
		font-size:16px;\
		overflow-y:scroll;\
		color:#aaaaaa;\
	font-family: inherit;\
}"));

	$("head").append($("<style type=text/css></style>").text("#yml_lyricsText { \
	color: inherit;\
	font-family: inherit;\
	padding-left: 5%;\
}"));

	$("head").append($("<style type=text/css></style>").text("#yml_musicName { \
	font-family: inherit;\
		font-size:20px;\
	padding-left: 15%;\
		padding-top: 5%;\
}"));

	$("head").append($("<style type=text/css></style>").text("#yml_PanelButtons { \
	float: right;\
	padding:10px;\
	margin:10px;\
	border: 3px solid;\
}"));

	$("head").append($("<style type=text/css></style>").text("#yml_optionsPanel { \
		position: fixed;\
		z-index: 111;\
		padding-left: 5%;\
		padding-bottom: 5%;\
		border: 3px solid;\
		background-color: #2d2d2d;\
		font-size:16px;\
		overflow-y:scroll;\
		color:#aaaaaa;\
}"));
	
	$("head").append($("<style type=text/css></style>").text("#yml_searchPanel { \
	position: fixed;\
	z-index: 111;\
	padding-left: 5%;\
	padding-right: 5%;\
	padding-bottom: 5%;\
	border: 1px solid;\
	background-color: #2d2d2d;\
	font-size:16px;\
	overflow-y:scroll;\
	color:#aaaaaa;\
	max-height: 50%;\
}"));
	
	$("head").append($("<style type=text/css></style>").text(".yml_searchItem { \
	display: grid;\
  	grid-gap: 5px;\
  	border: 1px solid;\
	padding: 5px;\
}"));
	
	$("head").append($("<style type=text/css></style>").text(".yml_subItem { \
	border: 1px solid;\
	display: grid;\
  	grid-template-columns: 20% 30% 20% 30%;\
}"));
	
	$("head").append($("<style type=text/css></style>").text('.yml_sort {\
	padding: 8px 30px;\
	border-radius: 6px;\
	border: none;\
	display: inline-block;\
	color: #fff;\
	text-decoration: none;\
	background-color: #28a8e0;\
	height: 50px;\
}\
.yml_sort:hover {\
	text-decoration: none;\
	background-color:#1b8aba;\
}\
.yml_sort:focus {\
	outline: none;\
}\
.yml_sort:after {\
	width: 0;\
	height: 0;\
	border-left: 5px solid transparent;\
	border-right: 5px solid transparent;\
	border-bottom: 5px solid transparent;\
	content: "";\
	position: relative;\
	top: -10px;\
	right: -5px;\
}\
.yml_sort.asc:after {\
	width: 0;\
	height: 0;\
	border-left: 5px solid transparent;\
	border-right: 5px solid transparent;\
	border-top: 5px solid #fff;\
	content: "";\
	position: relative;\
	top: 13px;\
	right: -5px;\
}\
.yml_sort.desc:after {\
	width: 0;\
	height: 0;\
	border-left: 5px solid transparent;\
	border-right: 5px solid transparent;\
	border-bottom: 5px solid #fff;\
	content: "";\
	position: relative;\
	top: -10px;\
	right: -5px;\
}'));
	
	$("head").append($("<style type=text/css></style>").text('.yml_search {\
	width: 75%;\
	margin-bottom: 5px;\
	text-align: center;\
	background: linear-gradient(#eee, #fff);\
	border: 1px solid rgba(255, 255, 255, 0.6);\
	box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);\
	padding: 5px;\
	position: relative;\
	display: block;\
	margin-top: 5px;\
	margin-right: auto;\
	margin-bottom: 5px;\
	margin-left: auto;}'));
	
	$("head").append($("<style type=text/css></style>").text('#yml_sortGrid {display: grid;\
	grid-template-columns: repeat(5, 1fr);\
	grid-gap: 5px;}'));
	
	$("head").append($("<style type=text/css></style>").text('.highlight{background-color: purple;}'));
	
	$("head").append($("<style type=text/css></style>").text(".pagination li { \
		cursor: pointer;\
		display: inline-block;\
		padding: 5px;\
		margin-top: 5px;\
		margin-bottom: 5px;\
		align-content: center;\
	}"));
	
	$("head").append($("<style type=text/css></style>").text('.pagination {display: flex;\
		justify-content: center;}'));
	
	$("head").append($("<style type=text/css></style>").text('.active {font-size: 20px;'));
	
	$("head").append($("<style type=text/css></style>").text('#yml_resultCount {display: flex;\
			justify-content: center;\
			font-size: 25px;\
			background-color: #4e4d4d;\
			color: white;\
				}'));

	$("head").append($("<style type=text/css></style>").text('#yml_filterZeroGrid {display: grid;\
					grid-template-columns: repeat(3, 1fr);\
					grid-gap: 5px;\
					margin: 5px;}'));
	
	$("head").append($("<style type=text/css></style>").text('#yml_filterOneGrid {display: grid;\
						grid-template-columns: repeat(2, 1fr);\
						grid-gap: 5px;\
						margin: 5px;}'));

	$("head").append($("<style type=text/css></style>").text('#yml_filterTwoGrid {display: grid;\
							grid-template-columns: repeat(4, 0.2fr);\
							grid-gap: 5px;\
							margin: 5px;}'));
	
	$("head").append($("<style type=text/css></style>").text(".yml_Button { \
	cursor: pointer;\
		font-size:16px;\
		color:#aaaaaa;\
}"));

	$("head").append($("<style type=text/css></style>").text(".yml_Button:hover { \
	text-decoration: underline;\
}"));

	$("head").append($("<style type=text/css></style>").text(".ui-state-default { \
	cursor: move;\
}"));

	$("head").append($("<!--End of Youtube Music Lyrics v" + GM.info.script.version + " CSS-->"));
}
//Function set css
//End

//Start
//Function set events
function SetEvents(options2, cache2)
{
	$("#yml_lyricsButton").on("click", function ()
	{
		$("#yml_lyricsPanel").toggle(500);

		let w = $("#main-panel").width();
		let h = $("#main-panel").height();

		$("#yml_lyricsPanel").attr({
			style: "max-height: " + h + "px;max-width:" + (w + 100) + "px;min-width:" + w + "px;"
		});
	});

	$("#yml_optionButton").on("click", function ()
	{
		$("#yml_optionsPanel").toggle();

		if ($("#yml_optionsPanel").css('display') !== 'none')
		{
			$(this).text("Save Options");
		} else
		{
			Options2._GMUpdate("options2", options2);
			$(this).text("Options");
		}
	});
	
	document.getElementById("yml_closeSearch").addEventListener("click", () =>
	{
		document.getElementById("yml_searchPanel").style.visibility = "hidden";	
	});
	
	document.getElementById("yml_searchButton").addEventListener("click", () =>
	{
		let _panel = document.getElementById("yml_searchPanel");
		if (_panel.style.visibility == "hidden")
			_panel.style.visibility = "visible";
		else
		{
			_panel.style.visibility = "hidden";
			
		}
		
		if (setupSearchOnce)
		{
			let options = {
				valueNames: [
					'artist',
					'gettingLyricsForArtistTimes',
					'id',
					'url',
					{ name: 'urlHref', attr: 'href' },
					{ name: 'dateId', attr: 'data-xutime' },
					'date',
					'gettingLyricsForMusicTimes',
					'lyrics',
					'title'],
				
				page: 25,
				
				pagination: [{
					name: "paginationTop",
					paginationClass: "paginationTop",
					outerWindow: 2,
					innerWindow: 3,
					item: "<li><a class='page'></a></li>"
				}, {
					name: "paginationBottom",
					paginationClass: "paginationBottom",
					outerWindow: 2,
					innerWindow: 3,
					item: "<li><a class='page'></a></li>"
					}],
				
				listClass: "yml_list",
				searchClass: "yml_search",
				sortClass: "yml_sort",
				item: "<div class='yml_searchItem'>\
							<div class='yml_subItem' style='font-size:x-large; color:#fff; display:block;'><span class='artist'></span> - <span class='title'></span></div>\
							<div class='yml_subItem' style='font-size:small;'>Getting Lyrics For Artist Times: <span class='gettingLyricsForArtistTimes'></span> Getting Lyrics For Music Times: <span class='gettingLyricsForMusicTimes'></span></div>\
							<div class='yml_subItem'>Id: <span class='id'></span> Url: <a class='url urlHref' style='color:inherit;'></a></div >\
							<div class='yml_subItem' style='font-size:small;'>Added Date: <span class='date dateId'></span></div>\
							<div>Lyrics: </br><span class='lyrics'></span></div>\
						</div>"
			};
			
			let _searchItems = [];
			let _values = Object.values(cache2);
			let _y = 0;
			for (let i = 1; i < _values.length; i++)
			{
				let _musicValues = Object.values(_values[i].musics);
				for (let j = 0; j < _musicValues.length; j++)
				{
					_searchItems.push({});
					
					_searchItems[_y]["artist"] = _values[i].artist;
					_searchItems[_y]["gettingLyricsForArtistTimes"] = _values[i].gettingLyricsForArtistTimes;
					_searchItems[_y]["id"] = _values[i].id;
					_searchItems[_y]["url"] = _values[i].url;
					_searchItems[_y]["urlHref"] = _values[i].url;
					
					_searchItems[_y]["dateId"] = _musicValues[j].dateId;
					_searchItems[_y]["date"] = new Date(_musicValues[j].dateId).toString()
					_searchItems[_y]["gettingLyricsForMusicTimes"] = _musicValues[j].gettingLyricsForMusicTimes;
					_searchItems[_y]["lyrics"] = _musicValues[j].lyrics;
					_searchItems[_y]["title"] = _musicValues[j].title;
					
					_y++;
				}
			}
			
			//TODO!
			//Erase elements when hiding and add them when showing search panel
			let musicList = new List('yml_searchMusics', options, _searchItems);
			
			$('.yml_searchArtist').on("keyup", function ()
			{
				let searchString = $(this).val();
				musicList.search(searchString, ['artist']);
			});

			$('.yml_searchTitle').on("keyup", function ()
			{
				let searchString = $(this).val();
				musicList.search(searchString, ['title']);
			});
			
			$('.yml_searchLyrics').on("keyup", function ()
			{
				let searchString = $(this).val();
				musicList.search(searchString, ['lyrics']);
			});

			musicList.on("updated", function ()
			{
				$(".yml_searchItem").unhighlight();
				let search = $(".yml_search").val() || $(".yml_searchArtist").val() || $(".yml_searchTitle").val() || $(".yml_searchLyrics").val();
				let words = search.split(" ");
				$(".yml_searchItem").highlight(words);
				$("#yml_resultCount").text(musicList.matchingItems.length);
			});
			
			$('.yml_filterGettingLyricsForArtistTimes, .yml_filterGettingLyricsForMusicTimes, .yml_filterAddedDateA, .yml_filterAddedDateB').on('keyup change', function ()
			{
				let number = [];

				let raw = [$(".yml_filterGettingLyricsForArtistTimes").val(),
					$(".yml_filterGettingLyricsForMusicTimes").val(),
					$(".yml_filterAddedDateA").val(),
					$(".yml_filterAddedDateB").val(),
				];

				let fsp = ["gettingLyricsForArtistTimes",
					"gettingLyricsForMusicTimes",
					"dateId",
					"dateId"];

				let im = [];

				for (let i = 0; i < raw.length; i++)
				{
					if (raw[i].match(">"))
					{
						number[i] = Number(raw[i].substr(1));
					} else if (raw[i].match("<"))
					{
						number[i] = Number(raw[i].substr(1));
					} else { number[i] = Number(raw[i]); }

					if (i == 2 || i == 3)
					{
						if (raw[i] === "")
							number[i] = 0;
						else
							number[i] = new Date(raw[i]).getTime();
					}
				}

				musicList.filter(function (item)
				{
					for (let i = 0; i < raw.length; i++)
					{
						if (raw[i] === "") continue;

						if (i == 2)
						{
							if (item.values()[fsp[i]] >= number[i])
							{
								im.push(true);
							}
							else
							{
								return false;
							}
						 
						}else if(i == 3)
						{
							if (item.values()[fsp[i]] <= number[i])
							{
								im.push(true);
							}
							else
							{
								return false;
							}
						} else
						{
							if (raw[i].match(">"))
							{
								if (item.values()[fsp[i]] >= number[i])
								{
									im.push(true);
								}
								else
								{
									return false;
								}
							} else if (raw[i].match("<"))
							{
								if (item.values()[fsp[i]] <= number[i])
									im.push(true);
								else
									return false;
							} else if (item.values()[fsp[i]] === number[i])
							{
								im.push(true);
							} else
								return false;
						}
					}

					if (im.every(e => e === true))
						return true;
					else
						return false;

				}); // Only items with id > 1 are shown in list

				if (raw.every(e => e === ""))
				{
					musicList.filter();
				}

				$("#yml_resultCount").text(musicList.matchingItems.length);
			});
			
			$("#yml_resultCount").text(musicList.size());
			
			setupSearchOnce = false;
		}
	});
	
	$("#yml_debug").on("change", function ()
	{
		options2.debug = $(this).prop("checked");
	});

	$("#yml_contextmenu").on("change", function ()
	{
		options2.contextmenu = $(this).prop("checked");
	});

	$("#yml_addLyricsButton").on("click", function ()
	{
		//TODO MAKE BETTER CODE!!!
		let _text = document.getElementById("yml_lyricsText");

		if ($("#yml_lyricsText").prop("tagName") === "PRE")
		{
			$(this).text("Save Lyrics");

			let w = $("#yml_lyricsText").width();
			let h = $("#yml_lyricsText").height();

			$("#yml_lyricsText").attr({
				style: "height: " + (h + 100) + "px;width:" + (w + 100) + "px;"
			});

			$('pre#yml_lyricsText').replaceTag('textarea');

			_text.value($("#yml_lyricsText").text());
		}
		else
		{
			$(this).text("Add Lyrics");

			let title = document.querySelector(".title.ytmusic-player-bar").innerText;

			let id = document.querySelector(".subtitle.ytmusic-player-bar").firstElementChild.firstElementChild.attributes.href.value;

			$("#yml_lyricsText").text(_text.value);

			cache2.AddLyrics(id, title, _text.value);

			$("#yml_lyricsText").attr({
				style: "height: inherit;width:inherit;"
			});

			Options2._GMUpdate("cache2", cache2);

			$('textarea#yml_lyricsText').replaceTag('pre');
		}
	});

	$('.sortable-list').sortable({
		connectWith: '.sortable-list',
		items: "li:not(.ui-state-disabled)",
		update: function ()
		{
			let order = $(this).sortable('toArray');
			let names = [];
			for (let i = 0; i < order.length; i++)
			{
				names.push($("#" + order[i]).find("span").text());
			}

			names.unshift(0);
			order.unshift(0);
			console.log(names);
			console.log(order);

			//update priority!
			options2.UpdatePriority = names;
			console.log(options2);
			Options2._GMUpdate("options2", options2);
		}
	});

	$('#yml_clearCache').on("click", function ()
	{
		Options2._GMDeleteValues("yml_cache2");

		//todo how?
		let cache2 = new Cache2(0.1);
		cache2.then(() =>
		{
			console.log(cache2);
		});
	});

}
//Function set events
//End

//-------------------------
//TOOLS BELOW
//-------------------------

//Start
//Handler for url
function UrlHandler(options2, cache2)
{
	this.oldHash = window.location.search;
	this.Check;

	var that = this;
	var detect = function ()
	{
		if (that.oldHash !== window.location.search)
		{
			that.oldHash = window.location.search;
			setTimeout(function () { Music2(options2, cache2); }, oneSecond + oneSecond);
		}
	};
	this.Check = setInterval(function () { detect(); }, 200);
}
//Handler for url
//End

//Start
//Tool for changing tags https://stackoverflow.com/a/32067355
(function ($)
{
	$.fn.replaceTag = function (newTag)
	{
		var originalElement = this[0]
			, originalTag = originalElement.tagName
			, startRX = new RegExp('^<' + originalTag, 'i')
			, endRX = new RegExp(originalTag + '>$', 'i')
			, startSubst = '<' + newTag
			, endSubst = newTag + '>'
			, newHTML = originalElement.outerHTML
				.replace(startRX, startSubst)
				.replace(endRX, endSubst);
		this.replaceWith(newHTML);
	};
})(jQuery);
//Tool for changing tags https://stackoverflow.com/a/32067355
//End

//Start
//Tool for decoding stuff like &#xxxx; https://stackoverflow.com/a/2808386
function HtmlDecode(input)
{
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes[0].nodeValue;
}
//Tool for decoding stuff like &#xxxx; https://stackoverflow.com/a/2808386
//End

//Start
//Format bytes https://stackoverflow.com/a/18650828
function FormatBytes(bytes, decimals = 2)
{
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
//Format bytes https://stackoverflow.com/a/18650828
//End

/*
 * jQuery Highlight plugin
 *
 * Based on highlight v3 by Johann Burkard
 * http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html
 *
 * Code a little bit refactored and cleaned (in my humble opinion).
 * Most important changes:
 *  - has an option to highlight only entire words (wordsOnly - false by default),
 *  - has an option to be case sensitive (caseSensitive - false by default)
 *  - highlight element tag and class names can be specified in options
 *
 * Usage:
 *   // wrap every occurrence of text 'lorem' in content
 *   // with <span class='highlight'> (default options)
 *   $('#content').highlight('lorem');
 *
 *   // search for and highlight more terms at once
 *   // so you can save some time on traversing DOM
 *   $('#content').highlight(['lorem', 'ipsum']);
 *   $('#content').highlight('lorem ipsum');
 *
 *   // search only for entire word 'lorem'
 *   $('#content').highlight('lorem', { wordsOnly: true });
 *
 *   // search only for the entire word 'C#'
 *   // and make sure that the word boundary can also
 *   // be a 'non-word' character, as well as a regex latin1 only boundary:
 *   $('#content').highlight('C#', { wordsOnly: true , wordsBoundary: '[\\b\\W]' });
 *
 *   // don't ignore case during search of term 'lorem'
 *   $('#content').highlight('lorem', { caseSensitive: true });
 *
 *   // wrap every occurrence of term 'ipsum' in content
 *   // with <em class='important'>
 *   $('#content').highlight('ipsum', { element: 'em', className: 'important' });
 *
 *   // remove default highlight
 *   $('#content').unhighlight();
 *
 *   // remove custom highlight
 *   $('#content').unhighlight({ element: 'em', className: 'important' });
 *
 *
 * Copyright (c) 2009 Bartek Szopka
 *
 * Licensed under MIT license.
 *
 */

(function (factory)
{
	if (typeof define === 'function' && define.amd)
	{
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof exports === 'object')
	{
		// Node/CommonJS
		factory(require('jquery'));
	} else
	{
		// Browser globals
		factory(jQuery);
	}
}(function (jQuery)
{
	jQuery.extend({
		highlight: function (node, re, nodeName, className, callback)
		{
			if (node.nodeType === 3)
			{
				var match = node.data.match(re);
				if (match)
				{
					// The new highlight Element Node
					var highlight = document.createElement(nodeName || 'span');
					highlight.className = className || 'highlight';
					// Note that we use the captured value to find the real index
					// of the match. This is because we do not want to include the matching word boundaries
					var capturePos = node.data.indexOf(match[1], match.index);

					// Split the node and replace the matching wordnode
					// with the highlighted node
					var wordNode = node.splitText(capturePos);
					wordNode.splitText(match[1].length);

					var wordClone = wordNode.cloneNode(true);
					highlight.appendChild(wordClone);
					wordNode.parentNode.replaceChild(highlight, wordNode);
					if (typeof callback === 'function')
					{
						callback(highlight);
					}
					return 1; //skip added node in parent
				}
			} else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
				!/(script|style)/i.test(node.tagName) && // ignore script and style nodes
				!(node.tagName === nodeName.toUpperCase() && node.className === className))
			{ // skip if already highlighted
				for (var i = 0; i < node.childNodes.length; i++)
				{
					i += jQuery.highlight(node.childNodes[i], re, nodeName, className, callback);
				}
			}
			return 0;
		}
	});

	jQuery.fn.unhighlight = function (options)
	{
		var settings = {
			className: 'highlight',
			element: 'span'
		};

		jQuery.extend(settings, options);

		return this.find(settings.element + '.' + settings.className).each(function ()
		{
			var parent = this.parentNode;
			parent.replaceChild(this.firstChild, this);
			parent.normalize();
		}).end();
	};

	jQuery.fn.highlight = function (words, options, callback)
	{
		var settings = {
			className: 'highlight',
			element: 'span',
			caseSensitive: false,
			wordsOnly: false,
			wordsBoundary: '\\b'
		};

		jQuery.extend(settings, options);

		if (typeof words === 'string')
		{
			words = [words];
		}
		words = jQuery.grep(words, function (word, i)
		{
			return word !== '';
		});
		words = jQuery.map(words, function (word, i)
		{
			return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
		});

		if (words.length === 0)
		{
			return this;
		}

		var flag = settings.caseSensitive ? '' : 'i';
		// The capture parenthesis will make sure we can match
		// only the matching word
		var pattern = '(' + words.join('|') + ')';
		if (settings.wordsOnly)
		{
			pattern =
				(settings.wordsBoundaryStart || settings.wordsBoundary) +
				pattern +
				(settings.wordsBoundaryEnd || settings.wordsBoundary);
		}
		var re = new RegExp(pattern, flag);

		return this.each(function ()
		{
			jQuery.highlight(this, re, settings.element, settings.className, callback);
		});
	};
}));
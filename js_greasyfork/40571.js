// ==UserScript==
// @name        Crunchyroll HTML5 Manga Viewer
// @namespace   DoomTay
// @description Replaces Flash manga viewer with an HTML5 setup
// @require     https://cdn.jsdelivr.net/npm/vast-player@0.2.10/dist/vast-player.min.js
// @include     http://www.crunchyroll.com/comics*
// @include     https://www.crunchyroll.com/comics*
// @version     0.6.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40571/Crunchyroll%20HTML5%20Manga%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/40571/Crunchyroll%20HTML5%20Manga%20Viewer.meta.js
// ==/UserScript==

var mangaObject = document.querySelector("object#showmedia_videoplayer_object");

var mangaConfig = {};
var userID = null;
var pages = [];

var newStyle = document.createElement("style");
newStyle.innerHTML = `#mangaViewer
{
	background-color: rgb(224, 224, 224);
	display: flex;
	flex-direction: column;
	border: 10px solid rgb(153, 153, 153);
	box-sizing: border-box;
}

#mangaViewer:fullscreen
{
	width: 100%;
	height: 100% !important;
	border: 0px;
}

#mangaViewer:-moz-full-screen
{
	width: 100%;
	height: 100% !important;
	border: 0px;
}

#mangaViewer:-webkit-full-screen
{
	width: 100%;
	height: 100% !important;
	border: 0px;
}

#pageDisplay
{
	width: 100%;
	height: 100%;
	overflow: hidden;
	display: flex;
	flex: auto;
	justify-content: center;
}

.pageContainer
{
	height: 100%;
	width: 50%;
}

.mangaPage
{
	width: auto;
	height: 100%;
	border: 0px;
}

#controlBar
{
	background-color:#999;
	height: 100px;
	display: flex;
	width: 100%;
	flex: none;
}

#mangaViewer:fullscreen #pageDisplay
{
	margin-bottom: 25px;
}

#mangaViewer:-moz-full-screen #pageDisplay
{
	margin-bottom: 25px;
}

#mangaViewer:-webkit-full-screen #pageDisplay
{
	margin-bottom: 25px;
}

#mangaViewer:fullscreen #controlBar
{
	position: absolute;
	bottom: -75px;
	transition: 0.5s;
}

#mangaViewer:-moz-full-screen #controlBar
{
	position: absolute;
	bottom: -75px;
	transition: 0.5s;
}

#mangaViewer:-webkit-full-screen #controlBar
{
	position: absolute;
	bottom: -75px;
	transition: 0.5s;
}

#mangaViewer:fullscreen #controlBar:hover
{
	bottom: 0;
}

#mangaViewer:-moz-full-screen #controlBar:hover
{
	bottom: 0;
}

#mangaViewer:-webkit-full-screen #controlBar:hover
{
	bottom: 0;
}

#controlBar > *
{
	margin: auto;
}

#controlBar button
{
	width: 50px;
	height: 50px;
	font-size: 26px;
}`;
document.head.appendChild(newStyle);

var currentPage = 0;

if(mangaObject)
{
	var flashVars = parseFlashVars(mangaObject.querySelector("param[name='flashvars']").value);
	var authToken = flashVars.auth || null;

	var mangaDiv = document.createElement("div");
	mangaDiv.id = "mangaViewer";
	mangaDiv.style.width = mangaObject.width;
	mangaDiv.style.height = mangaObject.height + "px";

	var playerDiv = document.createElement("div");
	playerDiv.style.width = mangaObject.width;
	playerDiv.style.height = mangaObject.height + "px";

	mangaObject.parentNode.replaceChild(playerDiv,mangaObject);

	var pageL = document.createElement("img");
	pageL.className = "mangaPage";

	var pageR = document.createElement("img");
	pageR.className = "mangaPage";

	var doubleSpread = document.createElement("img");
	doubleSpread.className = "mangaPage";

	var mangaDisplay = document.createElement("div");
	mangaDisplay.id = "pageDisplay";

	var leftPageContainer = document.createElement("div");
	leftPageContainer.className = "pageContainer";
	leftPageContainer.style.textAlign = "right";
	leftPageContainer.appendChild(pageL);
	mangaDisplay.appendChild(leftPageContainer);

	var rightPageContainer = document.createElement("div");
	rightPageContainer.className = "pageContainer";
	rightPageContainer.appendChild(pageR);
	mangaDisplay.appendChild(rightPageContainer);

	mangaDisplay.appendChild(doubleSpread);

	mangaDiv.appendChild(mangaDisplay);

	var controlBar = document.createElement("div");
	controlBar.id = "controlBar";
	mangaDiv.appendChild(controlBar);

	var leftButton = document.createElement("button");
	leftButton.type = "button";
	leftButton.innerHTML = "\u2b05";
	leftButton.onclick = nextPage;
	controlBar.appendChild(leftButton);

	var fullscreenButton = document.createElement("button");
	fullscreenButton.type = "button";
	fullscreenButton.innerHTML = "&#9974;";
	fullscreenButton.onclick = function()
	{
		if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
		{
			if (document.exitFullscreen) document.exitFullscreen();
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
			else if (document.msExitFullscreen) document.msExitFullscreen();
		}
		else
		{
			if(mangaDiv.requestFullscreen) mangaDiv.requestFullscreen();
			else if(mangaDiv.mozRequestFullScreen) mangaDiv.mozRequestFullScreen();
			else if(mangaDiv.webkitRequestFullscreen) mangaDiv.webkitRequestFullscreen();
			else if(mangaDiv.msRequestFullscreen) mangaDiv.msRequestFullscreen();
		}
	};
	controlBar.appendChild(fullscreenButton);

	var rightButton = document.createElement("button");
	rightButton.type = "button";
	rightButton.innerHTML = "\u27a1";
	rightButton.onclick = prevPage;
	controlBar.appendChild(rightButton);

	function nextPage()
	{
		if(currentPage >= 0 && mangaConfig.pages[currentPage].is_spread) turnPage(currentPage + 1);
		else if(currentPage + 2 < mangaConfig.pages.length) turnPage(currentPage + 2);
	}

	function prevPage()
	{
		if(mangaConfig.pages[currentPage - 1].is_spread) turnPage(currentPage - 1);
		else if(currentPage - 1 >= 0) turnPage(currentPage - 2);
	}

	document.onkeydown = function(e)
	{
		if(e.keyCode == '37') nextPage();
		else if(e.keyCode == '39') prevPage();
	}

	getAdsConfig(flashVars.config_url.replace("http:","https:")).then(function(config)
	{
		var ads = Array.from(config.getElementsByTagName("manga:preload")[0].getElementsByTagName("adSlots")[0].getElementsByTagName("adSlot")[0].children,child => child.getAttribute("url").replace("http:","https:"));

		if(ads.length > 0)
		{
			var adIndex = 0;
			var currentAd = ads[adIndex];

			var adPlayer = new window.VASTPlayer(playerDiv);

			adPlayer.once('AdStopped', startManga);

			function prepareAd()
			{
				return adPlayer.load(currentAd)
					.catch(function(e)
					{
						if(adIndex < ads.length)
						{
							adIndex++;
							currentAd = ads[adIndex];
							return prepareAd();
						}
					});
			}

			prepareAd().then(readyPlayer => readyPlayer.startAd());
		}
		else startManga();
	});

	function startManga()
	{
		playerDiv.parentNode.replaceChild(mangaDiv,playerDiv);

		authenticate(authToken,flashVars.session_id,flashVars.seriesId).then(function(data)
		{
			if(data) userID = data.user.user_id;
			return getJSON("https://" + flashVars.server + "/list_chapters?series%5Fid=" + flashVars.seriesId + (data ? ("&user%5Fid=" + userID) : ""));
		}).then(function(config)
		{
			var currentChapter = config.chapters.find(chapter => chapter.number == flashVars.chapterNumber);
			var chapterID = currentChapter.chapter_id;
			if(currentChapter.page_logs) currentPage = parseInt(currentChapter.page_logs.current_page) - 1;

			return getJSON("https://" + flashVars.server + "/list_chapter?chapter%5Fid=" + chapterID + "&session%5Fid=" + flashVars.session_id + "&auth=" + authToken);
		}).then(function(config)
		{
			mangaConfig = config;
			turnPage(currentPage);
		});
	}

	function turnPage(newPage)
	{
		var blankPage = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
		if(newPage < 0) newPage = 0;
		currentPage = newPage;
		leftPageContainer.style.display = "none";
		rightPageContainer.style.display = "none";
		doubleSpread.style.display = "none";
		setPage(pageL,blankPage);
		setPage(pageR,blankPage);
		setPage(doubleSpread,blankPage);

		var pageData = mangaConfig.pages[newPage];

		var jsonRequest = new XMLHttpRequest();
		jsonRequest.open("POST", "https://" + flashVars.server + "/log_chapterpage", true);
		jsonRequest.responseType = "json";
		jsonRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		jsonRequest.send("user_id=" + userID + "&api_ver=1.0&page_id=" + pageData.page_id + "&device_type=com.crunchyroll.manga.flash");

		if(pageData.is_spread)
		{
			doubleSpread.style.display = "";
			loadPage(doubleSpread,newPage);
		}
		else
		{
			leftPageContainer.style.display = "";
			rightPageContainer.style.display = "";

			if(pageData.page_number == 0 || pageData.page_number == 1)
			{
				loadPage(pageR,newPage);
				if(mangaConfig.pages[newPage + 1]) loadPage(pageL,newPage + 1);
			}
			else if(pageData.page_number == 2 || pageData.page_number == 6)
			{
				currentPage--;
				loadPage(pageL,newPage);
			}
			else console.warn("Unknown page_number",pageData.page_number);
		}

		function loadPage(element,pageIndex)
		{
			if(pages[newPage]) setPage(element,pages[pageIndex]);
			else getDecryptedImage(mangaConfig.pages[pageIndex].locale[flashVars.locale].encrypted_composed_image_url).then(function(pageURL)
			{
				pages[pageIndex] = pageURL;
				setPage(element,pages[pageIndex]);
			})

			function getDecryptedImage(imageURL)
			{
				return new Promise(function(resolve,reject)
								   {
					var config = new XMLHttpRequest();
					config.onload = function()
					{
						var buffer = this.response;

						var viewer = new DataView(buffer);
						for(var i = 0; i < buffer.byteLength; i++)
						{
							var originalByte = viewer.getUint8(i);
							viewer.setUint8(i,originalByte ^ 0x42);
						}

						resolve(URL.createObjectURL(new Blob([buffer], {type: "image/jpeg"})));
					};
					config.onerror = reject;
					config.open("GET", imageURL, true);
					config.responseType = "arraybuffer";
					config.send();
				});
			}
		}

		function setPage(pageElement,image)
		{
			pageElement.src = image;
		}
	}
}

function authenticate(token,sessionId,seriesId)
{
	return new Promise(function(resolve)
	{
		getJSON("https://api-manga.crunchyroll.com/cr_authenticate?session%5Fid=" + sessionId + "&api%5Fver=1&device%5Ftype=com%2Ecrunchyroll%2Emanga%2Ewww&format=json&series%5Fid=" + seriesId + "&auth=" + token + "&version=0").then(data => resolve(data.data));
	})
}

function parseFlashVars(vars)
{
	var splitVars = vars.split("&");

	var parsed = {};

	for(var s = 0; s < splitVars.length; s++)
	{
		var split = splitVars[s].split("=");

		parsed[split[0]] = decodeURIComponent(split[1]);
	}

	return parsed;
}

function getAdsConfig(configURL)
{
	return new Promise(function(resolve,reject)
	{
		var config = new XMLHttpRequest();
		config.onload = function()
		{
			resolve(this.response);
		};
		config.onerror = reject;
		config.open("GET", configURL, true);
		config.responseType = "document";
		config.send();
	});
}

function getJSON(configURL)
{
	return new Promise(function(resolve,reject)
	{
		var jsonRequest = new XMLHttpRequest();
		jsonRequest.onload = function()
		{
			resolve(this.response);
		};
		jsonRequest.onerror = reject;
		jsonRequest.open("GET", configURL, true);
		jsonRequest.responseType = "json";
		jsonRequest.send();
	});
}
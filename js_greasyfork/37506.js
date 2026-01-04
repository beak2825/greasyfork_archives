// ==UserScript==
// @name           MyAnimeList(MAL) - Anime Recommendations Filter [Dinofied+only hides completed]
// @version        1.1.2
// @description    This script can hide recommendations that you already have on your list/don't have on your list
// @author         Cpt_mathix
// @include        /^https?:\/\/myanimelist\.net\/(anime|manga)\/(\d+\/?|.php?id=|\/)/
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/\d+\/.+\/(?!userrecs$)[^\s]/
// @grant          GM_getValue
// @grant          GM_setValue
// @namespace      https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/37506/MyAnimeList%28MAL%29%20-%20Anime%20Recommendations%20Filter%20%5BDinofied%2Bonly%20hides%20completed%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/37506/MyAnimeList%28MAL%29%20-%20Anime%20Recommendations%20Filter%20%5BDinofied%2Bonly%20hides%20completed%5D.meta.js
// ==/UserScript==

var href = document.location.href;
var page = /^http.*:\/\/myanimelist\.net\/manga*/.test(href) ? 'manga' : 'anime';

// set vars for lists
var animelist;
var mangalist;

var userrecs = href.indexOf('userrecs') > -1;
var version = '1.1.2';

// get user
var user = document.getElementsByClassName('header-profile-link')[0];
if (user) {
	user = user.textContent;
	init();
} else {
	console.log('Not logged in (Anime Recommendations Filter)');
}

function init() {
    // get header
    var AnchorLink;
    var allTextareas = document.getElementsByTagName('H2');
    for(var element in allTextareas) {
        if(allTextareas[element].textContent.indexOf("ecommendation") > -1) {
            AnchorLink = allTextareas[element];
            break;
        }
    }

    var feedbackElement;
    if (AnchorLink !== null) {
        addCheckboxes(AnchorLink);

        AnchorLink.id = "RecHeader";
        feedbackElement = document.createElement('BR');
        AnchorLink.appendChild(feedbackElement);
        feedbackElement = document.createElement('label');
        feedbackElement.setAttribute('for','firstName');
        feedbackElement.appendChild(document.createTextNode('Loading script. Please wait...'));
        AnchorLink.appendChild(feedbackElement);
        feedbackElement.style.fontWeight="normal";
        feedbackElement.style.fontSize="10px";
    }

    if (userrecs) {
        feedbackElement.style.display = "none";

        startFilter1(getSetting('Rec'), getSetting('Rec2'));
    } else {
        // check if we have/need to refresh our userlist
        if(isListUpToDate(user, ["manga","rm"])) {
            feedbackElement.textcontent = "Processing cached mangalist...";
            console.log('Processing cached mangalist...');
            mangalist = getUserList("manga");
        } else {
            feedbackElement.textcontent = "Downloading mangalist...";
            console.log('Downloading mangalist...');
            mangalist = loadUserList(user, "manga");
        }
		
		if(isListUpToDate(user, ["anime","rw"])) {
            feedbackElement.textcontent = "Processing cached animelist...";
            console.log('Processing cached animelist...');
            animelist = getUserList("anime");
        } else {
            feedbackElement.textcontent = "Downloading animelist...";
            console.log('Downloading animelist...');
            animelist = loadUserList(user, "anime");
        }

        console.log('Running script: Anime Recommendations Filter');
        feedbackElement.style.display = "none";
		
		scrollFunction();

        startFilter2(getSetting('Rec'), getSetting('Rec2'));
    }
}

function addCheckboxes(AnchorLink) {
    var checkbox1 = document.createElement('input');
    var checkbox2 = document.createElement('input');
    checkbox1.type = "checkbox";
    checkbox2.type = "checkbox";
    checkbox1.className = "checkbox";
    checkbox2.className = "checkbox";
    checkbox1.name = "Rec";
    checkbox2.name = "Rec";
    checkbox1.id = "Rec";
    checkbox2.id = "Rec2";
    checkbox1.title = "Hide entries on your list";
    checkbox2.title = "Hide entries that are not on your list";
    checkbox1.checked = getSetting("Rec");
    checkbox2.checked = getSetting("Rec2");
    checkbox1.addEventListener('change', function(e) {
        addClickEvent(e);
    });
    checkbox2.addEventListener('change', function(e) {
        addClickEvent(e);
    });
    AnchorLink.appendChild(checkbox1);
    AnchorLink.appendChild(checkbox2);
}

function scrollFunction() {
	var right = document.querySelector('#' + page + '_recommendation > div.btn-anime-slide-side.right > span');
	var left = document.querySelector('#' + page + '_recommendation > div.btn-anime-slide-side.left > span');
	
	if (right !== null) {
		var elCloneR = right.cloneNode(true);
		right.parentNode.replaceChild(elCloneR, right);
		elCloneR.onclick = function() {
			scrollRight();
		};
	}
	
	if (left !== null) {
		var elCloneL = left.cloneNode(true);
		left.parentNode.replaceChild(elCloneL, left);
		elCloneL.onclick = function() {
			scrollLeft();
		};
	}
}

function scrollRight() {	
	var ul = document.querySelector('#' + page + '_recommendation > div.anime-slide-outer > ul');
	var li = ul.querySelectorAll('li:not(.hidden):not(.off)');

	if (li.length > 7) {
		for(var i = 0; i < 7; i++) {
			if (typeof jQuery == 'undefined') {  
				li[i].setAttribute('style', 'display:none !important');
			} else {
				$(li[i]).animate({width: 'toggle'}, "fast");
			}
			li[i].classList.add('off');
		}
	}
}

function scrollLeft() {	
	var ul = document.querySelector('#' + page + '_recommendation > div.anime-slide-outer > ul');
	var li = ul.querySelectorAll('li.off:not(.hidden)');

	if (li.length > 0) {
		for(var i = li.length - 1; i >= li.length - 7 && i >= 0; i--) {
			if (typeof jQuery == 'undefined') {  
				li[i].setAttribute('style', 'display:inline-block; width: 90px;');
			} else {
				$(li[i]).animate({width: 'toggle'}, "fast");
			}
			li[i].classList.remove('off');
		}
	}
}

function startFilter1(conditionEdit, conditionAdd) {
    // get Anime/Manga Entries on current page
    var allElements;
    allElements = document.evaluate(
        '//*[@class="borderClass"]/table/tbody/tr/td[2]/div[2]/a[2]',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    for (var i = 0; i < allElements.snapshotLength; i++){
        var EditLink = allElements.snapshotItem(i);
        if (conditionEdit && EditLink.className.indexOf('button_edit') > -1) {
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
        } else if (conditionAdd && EditLink.className.indexOf('button_add') > -1) {
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
        } else {
            EditLink.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="";
        }
    }

}

function startFilter2(conditionNotOnList, conditionOnList) {
    // get Anime/Manga Entries on current page
    var allElements;
    allElements = document.evaluate(
        '//*[@id="' + page + '_recommendation"]/div[3]/ul/li[*]',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    for (var i = 0; i < allElements.snapshotLength; i++){
        var list = /http.*:\/\/myanimelist\.net\/anime\/\d+/.test(document.location.href) ? animelist : mangalist;
        var linkEl = allElements.snapshotItem(i).firstChild;
        var href = linkEl.href;
        var id = href.match(/\d+/g);
        var self = document.location.href.match(/\d+/g)[0];

		if(linkEl.parentNode.classList.contains("off")) {
			linkEl.parentNode.classList.remove("off");
			linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
		}
		
        if (conditionNotOnList) {
            if (self != id[0] && haveListHit(list, id[0])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
				linkEl.parentNode.classList.add("hidden");
            } else if (id[1] !== undefined && self != id[1] && haveListHit(list, id[1])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
				linkEl.parentNode.classList.add("hidden");
            } else {
                linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
				linkEl.parentNode.classList.remove("hidden");
            }
        } else if (conditionOnList) {
            if (self != id[0] && !haveListHit(list, id[0])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
				linkEl.parentNode.classList.add("hidden");
            } else if (id[1] !== undefined && self != id[1] && !haveListHit(list, id[1])) {
                linkEl.parentNode.setAttribute('style', 'display:none !important');
				linkEl.parentNode.classList.add("hidden");
            } else {
                linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
				linkEl.parentNode.classList.remove("hidden");
            }
        } else {
            linkEl.parentNode.setAttribute('style', 'display:inline-block; width: 90px;');
			linkEl.parentNode.classList.remove("hidden");
        }
    }
}

function isListUpToDate(user, type) {
    var rss = loadRSS(user, type[1]);
	
	var lastUpdate, cachedDate;
	if (rss === null) {
		console.log(type[0] + ' RSS feed failed to load');
		lastUpdate = new Date();
		cachedDate = new Date(getCacheDate(type[0] + "list"));
		if (lastUpdate - cachedDate < 86400000 && lastUpdate - cachedDate > 0)
			return true;
		else {
			console.log('Cached ' + type[0] + ' data not up to date!');
			return false;
		}
	} else {
		lastUpdate = rss.getElementsByTagName('pubDate')[0].textContent;
		cachedDate = getCacheDate(type[0] + "rss");
		if (lastUpdate == cachedDate)
			return true;
		else {
			console.log('Cached ' + type[0] + ' data not up to date!');
			setCacheDate(type[0] + "rss", lastUpdate);
			return false;
		}
	}
}

function getUserList(type) {
    var object = GM_getValue('MAL' + type + 'list'); // ARF = Anime Recommendations Filter
    if (object)
        return JSON.parse(object);
    else
        console.log("failed to get lists");
}

function setUserList(type, list) {
	GM_setValue('MAL' + type + 'list', JSON.stringify(list));
}

function getCacheDate(type) {
    var object = GM_getValue('CacheDate' + type + version);
	if (object)
        return JSON.parse(object);
    else
        return null;
}

function setCacheDate(type, value) {
	GM_setValue('CacheDate' + type + version, JSON.stringify(value));
}

function loadUserList(user, type) {
    // get userlist
    var xhr = new XMLHttpRequest();
    var url = '/malappinfo.php?u=' + user + '&status=all&type=' + type + '';
    xhr.open("GET", url, false);
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send();
    var xmlDocument = xhr.responseXML;
	
	if (xmlDocument === null) {
		console.log("failed to load list, trying to grab cached list");
		return getUserList(type);
	}

    // create a list that I can cache
    var rawList = xmlDocument.getElementsByTagName('series_' + type + 'db_id');
	var statusList = xmlDocument.getElementsByTagName('my_status');
    var list = [];
    for (var i = 0; i < rawList.length; i++) {
		if (statusList[i].textContent != '6') {
			list.push(rawList[i].textContent);
		}
	}
	
	setCacheDate(type + "list", new Date());
    setUserList(type, list);
    return list;
}

function loadRSS(user, type) {
    var xhr = new XMLHttpRequest();
    var url = '/rss.php?type=' + type + '&u=' + user;
    xhr.open("GET", url, false);
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send();
    var xmlDocument = xhr.responseXML;
    return xmlDocument;
}

function haveListHit(list, animeid) {
    for(var k = 0; k < list.length; k++) {
        if (list[k] == animeid) {
            return true;
        }
    }
    return false;
}

// Save a setting of type = value (true or false)
function saveSetting(type, value) {
    GM_setValue('MALRec_' + type + version, value);
}

// Get a setting of type
function getSetting(type) {
    var value = GM_getValue('MALRec_' + type + version);
    if (value)
        return value;
    else
        return false;
}

function addClickEvent(e) {
    var clickedCheckbox = e.target;
    var checkboxes = document.getElementsByName('Rec');

    for(var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].id != clickedCheckbox.id) {
            checkboxes[i].checked = false;
            saveSetting(checkboxes[i].id, false);
        } else {
            saveSetting(checkboxes[i].id, checkboxes[i].checked);
        }
    }

    if (userrecs)
        startFilter1(getSetting('Rec'), getSetting('Rec2'));
    else
        startFilter2(getSetting('Rec'), getSetting('Rec2'));
}
function HideDivs(){
    for (var i = 0; i < allElements.snapshotLength; i++){
        var EditLink = allElements.snapshotItem(i);
        var notPTW = !EditLink.classList.contains("plantowatch");
        if (EditLink.parentNode.parentNode.parentNode.classList.contains("js-seasonal-anime") && notPTW)
            EditLink.parentNode.parentNode.parentNode.style.display="none";
        else if (notPTW) {
            EditLink.parentNode.parentNode.style.display="none";
        }
    }
}
function ShowDivs(){
    for (var i = 0; i < allElements.snapshotLength; i++){
        var EditLink = allElements.snapshotItem(i);
        var notPTW = !EditLink.classList.contains("plantowatch");
        if (EditLink.parentNode.parentNode.parentNode.classList.contains("js-seasonal-anime") && notPTW)
            EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
        else if (notPTW) {
            EditLink.parentNode.parentNode.removeAttribute('style');
        }
    }
}
function HideDivs(){
    for (var i = 0; i < allElements.snapshotLength; i++){
        var EditLink = allElements.snapshotItem(i);
        var notWatching = !EditLink.classList.contains("watching");
        if (EditLink.parentNode.parentNode.parentNode.classList.contains("js-seasonal-anime") && notWatching)
            EditLink.parentNode.parentNode.parentNode.style.display="none";
        else if (notWatching) {
            EditLink.parentNode.parentNode.style.display="none";
        }
    }
}
function ShowDivs(){
    for (var i = 0; i < allElements.snapshotLength; i++){
        var EditLink = allElements.snapshotItem(i);
        var notWatching = !EditLink.classList.contains("watching");
        if (EditLink.parentNode.parentNode.parentNode.classList.contains("js-seasonal-anime") && notWatching)
            EditLink.parentNode.parentNode.parentNode.removeAttribute('style');
        else if (notWatching) {
            EditLink.parentNode.parentNode.removeAttribute('style');
        }
    }
}
// ==UserScript==
// @name        pimeyesJS
// @namespace   https://github.com/deltabravozulu/usefulUserScripts
// @match       *://pimeyes.com/en/search/*
// @grant       none
// @version     9.6.9_420.11
// @icon	https://pimeyes.com/favicon.ico
// @author      DeltaBravoZulu
// @description Mods to make pimeyes.com work better for both premium and free users
// @description 2022-05-09T18:04:20
// @require https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @run-at      document-idle
// @license     PayMe
// @downloadURL https://update.greasyfork.org/scripts/435345/pimeyesJS.user.js
// @updateURL https://update.greasyfork.org/scripts/435345/pimeyesJS.meta.js
// ==/UserScript==
      ///////////////////////////////////////////////////////////////////////////////////
     ///////////////////////////////////////////////////////////////////////////////////
    ////   A script to allow automatic image loading, page improvements via CSS,   ////
   ////   explicit result isolation, and other neat stuff on pimeyes.com          ////
  ////   by DeltaBravoZulu                                                       ////
 ///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////
 //       Script Initialization       //
///////////////////////////////////////
/*
 ** Invokes injection of buttons
 ** Sets initial variables and gathers stats
 */

//Make sure page loads before starting
new MutationObserver(check).observe(document, {
	childList: true,
	subtree: true,
});

function check(changes, observer) {
	if (
		document.querySelector(
			"#results > div > div > div.top-slot > div > div > div > button:nth-child(5) > img"
		)
	) {
		observer.disconnect();
		explicitButts();
		scrollButts();
		importButts();
		exportButts();
		explicitCount = 0;
		explicitStats();
		scrolled = 0;
    //Gets the Open Graph url which was removed in June
    var ogUrl=document.querySelectorAll('meta[property="og:url"]')[0].content.replace('https://pimeyes.com/en','')
    //Adds the URL to the URL bar so you can copypaste it
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + ogUrl;
    window.history.pushState({path:newurl},'',newurl);
    //Adds scroll explicit counter
		scrollResultsUpdateListener();
		//Adds mousedown event listener to highlight text during popup for copying
		clickThumb = document.querySelector("div.results-grid");
		clickThumb.addEventListener("mousedown", highlightUrl);
		//Removes the 'Pay 299/month' overlay if hitting the Deep Search button
		document.querySelector("div[data-v-69882821]").remove();
    //Makes rows wider and shows images better
    //This is broken//document.querySelector("div.results-grid").style.width="90";
    document.querySelector("div.results-grid").style.minWidth="60%";
    document.querySelector("div.results-grid").style.maxWidth="100%";
    document.querySelector("div.results-grid").style.gridTemplateColumns = "repeat(5,20%)";
    document.querySelector("div.results-grid").style.gridAutoRows = "auto";

	}
}

//Alternative way of doing it
/*
var observer = new MutationObserver(resetTimer);
var timer = setTimeout(action, 2000, observer); // wait for the page to stay still for 2 seconds
observer.observe(document, {childList: true, subtree: true});
function resetTimer(changes, observer) {
	clearTimeout(timer);
	timer = setTimeout(action, 2000, observer);
}

function action(o) {
	o.disconnect();
	observer.disconnect();
    explicitButts();
    scrollButts();
    explicitCount = 0;
    explicitStats();
    scrolled = 0;
    scrollResultsUpdateListener();
}
*/

  ///////////////////////////////////////
 //         Button Injections         //
///////////////////////////////////////
/*
 ** Adds buttons to invoke scrolling and removal
 ** Sets initial variable and gathers stats
 */

//Injects a button that, when pressed, will scroll to the bottom of the page to load all images, then remove all images that are not explicit
function explicitButts() {
	console.log("Adding 18+ Button");
	var oldButtons = document.querySelector(
		"#results > div > div > div.top-slot > div > div > div > button:last-child"
	);
	var explicitButtons = oldButtons.parentElement;
	var iconHtml =
		'<button data-v-4ccff48d="" type="button" class="default icon-only" data-v-46dbee4d="" id="18Button" title="Scroll to the bottom and remove non-explicit images"><img data-v-4ccff48d="" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzEwLjkgMzEwLjkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTk1IDIxMS40di04OS4zSDc0LjRWOTkuMmg0OS4xdjExMi4yem0xMzUuNi04My4yYzAgOS44LTUuMyAxOC40LTE0LjEgMjMuMiAxMi4zIDUuMSAyMCAxNS44IDIwIDI4LjMgMCAyMC4yLTE3LjkgMzMtNDUuOSAzM3MtNDUuOS0xMi42LTQ1LjktMzIuNWMwLTEyLjggOC4zLTIzLjcgMjEuMy0yOC44LTkuNC01LjMtMTUuNS0xNC4yLTE1LjUtMjQgMC0xNy45IDE1LjctMjkuMyA0MC0yOS4zIDI0LjUuMSA0MC4xIDExLjcgNDAuMSAzMC4xem0tNTkuMSA0OS4yYzAgOS40IDYuNyAxNC43IDE5IDE0LjdzMTkuMi01LjEgMTkuMi0xNC43YzAtOS4zLTYuOS0xNC42LTE5LjItMTQuNnMtMTkgNS4zLTE5IDE0LjZ6bTIuOS00Ny42YzAgOCA1LjggMTIuNSAxNi4yIDEyLjVzMTYuMi00LjUgMTYuMi0xMi41YzAtOC4zLTUuOC0xMy0xNi4yLTEzLTEwLjUuMS0xNi4yIDQuNy0xNi4yIDEzeiIvPjxwYXRoIGQ9Ik0xNTUuNCAzMTAuOUM2OS43IDMxMC45IDAgMjQxLjEgMCAxNTUuNFM2OS43IDAgMTU1LjQgMGMxMS42IDAgMjMuMiAxLjMgMzQuNSAzLjlWMTVjLTExLjItMi44LTIyLjgtNC4xLTM0LjUtNC4xLTc5LjcgMC0xNDQuNiA2NC45LTE0NC42IDE0NC42czY0LjkgMTQ0LjYgMTQ0LjYgMTQ0LjZTMzAwIDIzNS4yIDMwMCAxNTUuNWMwLTExLjctMS40LTIzLjMtNC4xLTM0LjVIMzA3YzIuNiAxMS4zIDMuOSAyMi44IDMuOSAzNC41IDAgODUuNi02OS44IDE1NS40LTE1NS41IDE1NS40eiIvPjxwYXRoIGQ9Ik0yNzUuNyAzNS4xVjMuNkgyNTN2MzEuNWgtMzEuNHYyMi43SDI1M3YzMS41aDIyLjdWNTcuOGgzMS41VjM1LjF6Ii8+PC9zdmc+"> <span data-v-4ccff48d="">View Explicit</span></button>';
	explicitButtons.insertAdjacentHTML("beforeend", iconHtml);
	document.getElementById("18Button").addEventListener("click", explicitJS);
	console.log("Added 18+ Button");
}

//Injects a scroll button which will allow one to load all images on the page automatically
function scrollButts() {
	console.log("Adding Scroll Button");
	var oldButtons = document.querySelector(
		"#results > div > div > div.top-slot > div > div > div > button:last-child"
	);
	var scrollButton = oldButtons.parentElement;
	var scrollIconHtml =
		'<button data-v-4ccff48d="" type="button" class="default icon-only" data-v-46dbee4d="" id="scrollButton" title="Scroll to the bottom"><img data-v-4ccff48d="" src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNDkwLjcgNDkwLjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQ3Mi4zIDIxNi41LTIyNy4xIDIyNy4yLTIyNy4xLTIyNy4yYy00LjItNC4xLTExLTQtMTUuMS4zLTQgNC4xLTQgMTAuNyAwIDE0LjhsMjM0LjcgMjM0LjdjNC4yIDQuMiAxMC45IDQuMiAxNS4xIDBsMjM0LjctMjM0LjdjNC4xLTQuMiA0LTExLS4zLTE1LjEtNC4yLTQtMTAuNy00LTE0LjkgMHoiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtNDcyLjMgMjQuNS0yMjcuMSAyMjcuMi0yMjcuMS0yMjcuMmMtNC4yLTQuMS0xMS00LTE1LjEuMy00IDQuMS00IDEwLjcgMCAxNC44bDIzNC43IDIzNC43YzQuMiA0LjIgMTAuOSA0LjIgMTUuMSAwbDIzNC42LTIzNC43YzQuMi00LjEgNC40LTEwLjguMy0xNS4xLTQuMS00LjItMTAuOC00LjQtMTUuMS0uMy0uMS4yLS4yLjItLjMuM3oiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtMjQ1LjIgNDY5LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4yLTQuMSAxMS00IDE1LjEuMyA0IDQuMSA0IDEwLjcgMCAxNC44bC0yMzQuNyAyMzQuN2MtMiAyLTQuNyAzLjEtNy41IDMuMXoiLz48cGF0aCBkPSJtMjQ1LjIgMjc3LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4xLTQuMiAxMC44LTQuNCAxNS4xLS4zczQuNCAxMC44LjMgMTUuMWMtLjEuMS0uMi4yLS4zLjNsLTIzNC43IDIzNC43Yy0yIDItNC43IDMuMS03LjUgMy4xeiIvPjwvc3ZnPg=="> <span data-v-4ccff48d="">Scroll Button</span></button>';
	scrollButton.insertAdjacentHTML("beforeend", scrollIconHtml);
	document.getElementById("scrollButton").addEventListener("click", betterScroller);
	console.log("Added Scroll Button");
}

//Injects a button that, when pressed, will copy the Open Graph index to the clipboard
function exportButts() {
	console.log("Adding OG URL Export Button");
	var oldButtons = document.querySelector(
		"#results > div > div > div.top-slot > div > div > div > button:last-child"
	);
	var exportButton = oldButtons.parentElement;
	var exportIconHtml =
		'<button data-v-4ccff48d="" type="button" class="default icon-only" data-v-46dbee4d="" id="exportButton" title="Export Open Graph URL to clipboard"><img data-v-4ccff48d="" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0ODguMyA0ODguMyI+PHBhdGggZD0iTTMxNC4yNSA4NS40aC0yMjdjLTIxLjMgMC0zOC42IDE3LjMtMzguNiAzOC42djMyNS43YzAgMjEuMyAxNy4zIDM4LjYgMzguNiAzOC42aDIyN2MyMS4zIDAgMzguNi0xNy4zIDM4LjYtMzguNlYxMjRjLS4xLTIxLjMtMTcuNC0zOC42LTM4LjYtMzguNnptMTEuNSAzNjQuMmMwIDYuNC01LjIgMTEuNi0xMS42IDExLjZoLTIyN2MtNi40IDAtMTEuNi01LjItMTEuNi0xMS42VjEyNGMwLTYuNCA1LjItMTEuNiAxMS42LTExLjZoMjI3YzYuNCAwIDExLjYgNS4yIDExLjYgMTEuNnYzMjUuNnoiLz48cGF0aCBkPSJNNDAxLjA1IDBoLTIyN2MtMjEuMyAwLTM4LjYgMTcuMy0zOC42IDM4LjYgMCA3LjUgNiAxMy41IDEzLjUgMTMuNXMxMy41LTYgMTMuNS0xMy41YzAtNi40IDUuMi0xMS42IDExLjYtMTEuNmgyMjdjNi40IDAgMTEuNiA1LjIgMTEuNiAxMS42djMyNS43YzAgNi40LTUuMiAxMS42LTExLjYgMTEuNi03LjUgMC0xMy41IDYtMTMuNSAxMy41czYgMTMuNSAxMy41IDEzLjVjMjEuMyAwIDM4LjYtMTcuMyAzOC42LTM4LjZWMzguNmMwLTIxLjMtMTcuMy0zOC42LTM4LjYtMzguNnoiLz48L3N2Zz4="> <span data-v-4ccff48d="">Export Button</span></button>';
	scrollButton.insertAdjacentHTML("afterend", exportIconHtml);
	document.getElementById("exportButton").addEventListener("click", exporter);
	console.log("Added Export Button");
}

//Injects a button that, when pressed, will paste the Open Graph index from the clipboard to the URL bar
function importButts() {
	console.log("Adding OG URL Import Button");
	var oldButtons = document.querySelector(
		"#results > div > div > div.top-slot > div > div > div > button:last-child"
	);
	var importButton = oldButtons.parentElement;
	var importIconHtml =
		'<button data-v-4ccff48d="" type="button" class="default icon-only" data-v-46dbee4d="" id="importButton" title="Import Open Graph URL from clipboard"><img data-v-4ccff48d="" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIDAgMTYgMTYiPjxsaW5lYXJHcmFkaWVudCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGlkPSJhIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KC05LjUgOSAtOSAtOS41IDc0LjUzNiA4OCkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4Mj0iMSI+PHN0b3Agb2Zmc2V0PSIuMDA3Ii8+PHN0b3Agb2Zmc2V0PSIxIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBkPSJNNjMuNTU2IDkzLjQ4OHYyLjVhMi41IDIuNSAwIDAgMCAyLjUgMi41aDEwYTIuNSAyLjUgMCAwIDAgMi41LTIuNXYtMi4wNmEuNS41IDAgMCAwLTEgMHYyLjA2YTEuNSAxLjUgMCAwIDEtMS41IDEuNWgtMTBhMS41IDEuNSAwIDAgMS0xLjUtMS41di0yLjVhLjUuNSAwIDAgMC0xIDB6bTcuMDAxLjM1NWwtMS4yNjktMS4yNjlhLjUuNSAwIDAgMC0uNzA3LjcwN2wyLjEyMSAyLjEyMWEuNDk5LjQ5OSAwIDAgMCAuNzA3IDBsMi4xMjItMi4xMjFhLjUuNSAwIDAgMC0uNzA3LS43MDdsLTEuMjY3IDEuMjY3LjAwNy03LjgyOWEuNS41IDAgMCAwLTEtLjAwMXoiIGZpbGw9InVybCgjYSkiIGRhdGEtb3JpZ2luYWw9InVybCgjX0xpbmVhcjEpIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNjMuMDM2IC04NCkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIvPjwvc3ZnPg=="> <span data-v-4ccff48d="">Import Button</span></button>';
	scrollButton.insertAdjacentHTML("afterend", importIconHtml);
	document.getElementById("importButton").addEventListener("click", importer);
	console.log("Added Import Button");
}


  ///////////////////////////////////////
 //    Export/Import OpenGraph Url    //
///////////////////////////////////////
/*
 ** Includes a scroller to load the page, stats, and sleep timers
 */

//Copies the open graph url to the clipboard 

ogUrl=document.querySelectorAll('meta[property="og:url"]')[0].content.replace('https://pimeyes.com/en','')
ogUrlCut=ogUrl.substring(0, ogUrl.lastIndexOf('?')).replace('/search/','')

function exporter() {
executeCopy = function() {
  var copyhelper = document.createElement("input");
  copyhelper.className = 'copyhelper'
  document.body.appendChild(copyhelper);
  copyhelper.value = ogUrlCut;
  copyhelper.select();
  document.execCommand("copy");
  document.body.removeChild(copyhelper);
};
  executeCopy();
  console.log("ogURLCut is " + ogUrlCut)
}

async function importer() {
  oldPage=window.location.href;
  oldPageIndex=oldPage.indexOf(ogUrlCut)
  ogUrlImport= await navigator.clipboard.readText();
  newPage=oldPage.substr(0, oldPageIndex) + ogUrlImport + "_" + oldPage.substr(oldPageIndex)
  console.log("oldPage is " + oldPage)
  console.log("newPage is " + newPage)
  window.history.pushState({path:newPage},'',newPage);
  window.location.href=newPage
}



  ///////////////////////////////////////
 //       Removal Prerequisites       //
///////////////////////////////////////
/*
 ** Includes a scroller to load the page, stats, and sleep timers
 */

//Scrolls down the page as fast as possible
function scrollDown() {
	window.scrollBy(0, 10000);
	window.scrollTo(0, document.body.scrollHeight);
}

//Scrolls to the top of the page
function scrollUp() {
	window.scrollBy(0, -50000);
	window.scrollTo(0, 0);
}

//Scrolls all the way to the bottom of the page to load all results, then scrolls back to the top
async function scroller() {
	if (document.querySelectorAll("div.results-end").length === 1) {
		scrolled = 1;
	} else if (document.querySelectorAll("div.results-end").length === 0) {
		scrolled = 0;
	}
	while (scrolled < 1) {
		console.log("Scrolling to the bottom of the results");
		var scrollCount = 1;
		do {
			scrollDown();
			console.log("Sleeping 1000ms");
			await sleep(1000);
			console.log("Still scrolling (" + scrollCount + "x)");
			scrollCount++;
		} while (document.querySelectorAll("div.results-end").length === 0);
		console.log("Done scrolling");
		console.log("Sleeping 1000ms");
		await sleep(1000);
		console.log("Scrolling to top of page");
		scrollUp();
		console.log("We reached the top");
		console.log("Sleeping 1000ms");
		await sleep(1000);
		scrolled = 1;
	}
}

//Scrolls but lets you control it
function betterScroller() {
    var a = document.body.clientHeight,
        b = document.documentElement.scrollHeight,
        c = document.documentElement.clientHeight,
        d = innerHeight,
        e = document.height;
    if (console.log("document.body.clientHeight:\t\t\t\t\t" + a + ";\ndocument.documentElement.scrollHeight:\t\t" + b + ";\ndocument.documentElement.clientHeight:\t\t" + c + ";\ninnerHeight:\t\t\t\t\t\t\t\t" + d + ";\ndocument.height:\t\t\t\t\t\t\t" + e), document.URL.includes("facebook.com")) ! function() {
        var e = null,
            t = 0,
            s = function() {
                console.log("Clicked; stopping autoscroll"), clearInterval(e), document.body.removeEventListener("click", s)
            };
        document.body.addEventListener("click", s), e = setInterval(function() {
            var o = document.body.scrollHeight - document.body.scrollTop - window.innerHeight;
            o > 0 ? (window.scrollBy(0, o), t > 0 && (t = 0), console.log("scrolling down more")) : t >= 3 ? (console.log("reached bottom of page; stopping"), clearInterval(e), document.body.removeEventListener("click", s)) : (console.log("[apparenty] hit bottom of page; retrying: " + (t + 1)), t++)
        }, 1e3)
    }();
    else {
        let e, t = 1,
            s = [
                [0, 0],
                [25, 200],
                [36, 120],
                [49, 72],
                [64, 43.2],
                [81, 25.9],
                [100, 31],
                [121, 37.2],
                [144, 44.8],
                [169, 26.4],
                [196, 32]
            ],
            o = document.onkeypress;
        _ss_stop = function() {
            clearTimeout(e)
        }, _ss_start = function() {
            _ss_abs_speed = Math.abs(t), _ss_direction = t / _ss_abs_speed, _ss_speed_pair = s[_ss_abs_speed], e = setInterval("scrollBy(0," + _ss_direction * _ss_speed_pair[0] + "); if((pageYOffset<=1)||(pageYOffset==document.documentElement.scrollHeight-innerHeight)) _ss_speed=0;", _ss_speed_pair[1])
        }, _ss_adj = function(e) {
            t += e, Math.abs(t) >= s.length && (t = (s.length - 1) * (t / Math.abs(t)))
        }, _ss_quit = function() {
            _ss_stop(), document.onkeypress = o
        }, document.onkeypress = function(e) {
            if (113 != e.charCode && 27 != e.keyCode) {
                if (e.charCode >= 48 && e.charCode <= 57) t = e.charCode - 48;
                else switch (e.charCode) {
                    case 95:
                        _ss_adj(-2);
                    case 45:
                        _ss_adj(-1);
                        break;
                    case 43:
                        _ss_adj(2);
                    case 61:
                        _ss_adj(1)
                }
                _ss_stop(), _ss_start()
            } else _ss_quit()
        }, _ss_stop(), _ss_start()
    }
}

//Lets script sleep after functions to allow page a bit of time to catch up
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

//Helper script to update the count of explicit results
function expResultsUpdater() {
	explicitCount = document.querySelectorAll(
		"#results div.results-grid div.result div.thumbnail span.explicit-result"
	).length;
	console.log(explicitCount + " potentially explicit results so far");
	document.getElementById("expResults").innerHTML = explicitCount;
}

//Injects an explicit results running total at the top of the page
function explicitStats() {
	console.log("Inserting Stats Counter");
	var oldResults = document.querySelector(
		"#results > div.container > div > div.top-slot > div > div.container > span.stats > span:nth-child(1)"
	);
	var explicitResults = oldResults;
	var resultsHtml =
		'<span data-v-26e5f418="">' +
		'<bdi id="expResults">' +
		explicitCount +
		"</bdi>" +
		" potentially explicit results so far</span>";
	explicitResults.insertAdjacentHTML("beforebegin", resultsHtml);
	expResultsUpdater();
}

//Updates the explicit results count that was injected at the top of the page then stops doing anything after page-end is reached
function scrollResultsUpdateListener() {
	addEventListener("scroll", function () {
		if (document.querySelectorAll("div.results-end").length === 0) {
			expResultsUpdater();
			scrolled = 0;
		}
	});
}



//Highlights and generates url to go to site where image is hosted
async function highlightUrl() {
	console.log("Waiting to highlight");
	await sleep(200);
	var spanUrl = document.querySelector(
		"div.modal-content div.thumbnail span.url"
	);
	if (typeof spanUrl != "undefined" && spanUrl != null) {
		spanUrl = document.querySelector(
			"div.modal-content div.thumbnail span.url"
		);
		spanUrl.innerHTML =
			`<a href="` + spanUrl.innerHTML + `">` + spanUrl.innerHTML + `</a>`;

		function selectText(node) {
			node = spanUrl;

			if (document.body.createTextRange) {
				const range = document.body.createTextRange();
				range.moveToElementText(node);
				range.select();
			} else if (window.getSelection) {
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(node);
				selection.removeAllRanges();
				selection.addRange(range);
			} else {
				console.warn(
					"Could not select text in node: Unsupported browser."
				);
			}
		}
		selectText("spanUrl");
	} else {
		console.log(
			"Tried to highlight URL because of highlightUrl mousedown event listener but popup does not exist!"
		);
	}
}

  ///////////////////////////////////////
 //          Removal Scripts          //
///////////////////////////////////////
/*
 **Pure Javascript based removal scripts
 */

//Script to remove nonexplicit images using jQuery
function jsRemover() {
	console.log("Running removal script (Pure JavaScript)");
	document
		.querySelectorAll("#results div.results-grid div.result div.thumbnail")
		.forEach(function (element) {
			if (!element.querySelector("span.explicit-result")) {
				element.parentNode.remove();
			}
		});
	console.log("Finished removal script");
}

//jsRemover helper script
async function explicitJS() {
	console.log("Starting the removal process");
	await scroller();
	jsRemover();
	console.log("Finished the removal process");
}

/*
 **jQuery based removal scripts
 */

//Script to remove nonexplicit images using jQuery
function jqRemover() {
	console.log("Running removal service (jQuery)");
	jQuery(
		"#results div.results-grid div.result div.thumbnail:has(span):not(:has(.explicit-result))"
	)
		.parent()
		.remove();
	console.log("Finished removal script");
}

//jqRemover helper script
async function explicitJQ() {
	jqGetter();
	console.log("Starting the removal process");
	await scroller();
	jsRemover();
	console.log("Finished the removal process");
}

//Downloads jQuery to the page
function jqGetter() {
	console.log("Downloading jQuery to page");
	var el = document.createElement("div"),
		b = document.getElementsByTagName("body")[0],
		otherlib = !1,
		msg = "";
	(el.style.position = "fixed"),
		(el.style.height = "32px"),
		(el.style.width = "220px"),
		(el.style.marginLeft = "-110px"),
		(el.style.top = "0"),
		(el.style.left = "50%"),
		(el.style.padding = "5px 10px"),
		(el.style.zIndex = 1001),
		(el.style.fontSize = "12px"),
		(el.style.color = "#222"),
		(el.style.backgroundColor = "#f99");

	function showMsg() {
		var txt = document.createTextNode(msg);
		el.appendChild(txt),
			b.appendChild(el),
			window.setTimeout(function () {
				(txt = null),
					typeof jQuery == "undefined"
						? b.removeChild(el)
						: (jQuery(el).fadeOut("slow", function () {
								jQuery(this).remove();
						  }),
						  otherlib && (window.$jq = jQuery.noConflict()));
			}, 2500);
	}
	if (typeof jQuery != "undefined")
		return (
			(msg = "This page already using jQuery v" + jQuery.fn.jquery),
			showMsg()
		);
	typeof $ == "function" && (otherlib = !0);

	function getScript(url, success) {
		var script = document.createElement("script");
		script.src = url;
		var head = document.getElementsByTagName("head")[0],
			done = !1;
		(script.onload = script.onreadystatechange = function () {
			!done &&
				(!this.readyState ||
					this.readyState == "loaded" ||
					this.readyState == "complete") &&
				((done = !0),
				success(),
				(script.onload = script.onreadystatechange = null),
				head.removeChild(script));
		}),
			head.appendChild(script);
	}
	getScript("//code.jquery.com/jquery.min.js", function () {
		return (
			typeof jQuery == "undefined"
				? (msg = "Sorry, but jQuery was not able to load")
				: ((msg =
						"This page is now jQuerified with v" +
						jQuery.fn.jquery),
				  otherlib &&
						(msg += " and noConflict(). Use $jq(), not $().")),
			showMsg()
		);
	});
	console.log("jQuery downloaded to page");
}

  ///////////////////////////////////////
 //     CSS Mods/Page Improvement     //
///////////////////////////////////////
/**
 * Utility function to add CSS in multiple passes.
 * @param {string} styleString
 * From http://stackoverflow.com/a/15506705
 **/
function addStyle(styleString) {
	const style = document.createElement("style");
	style.textContent = styleString;
	document.head.append(style);
}

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Un-blur the URLs*/
.blurred-source-url {
    user-select: all !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
/*div.modal-content>div.thumbnail>span.url*/

addStyle(`
/*Make the URLs selectable, and visible*/
*.url {
    filter: none !important;
    ;
    overflow: visible !important;
    ;
    user-select: initial !important;
    ;
    max-width: initial !important;
    ;
    pointer-events: none !important;
    ;
    position: initial !important;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove the Buy Premium overlay on images*/
.zoom {
    display: none !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove the 'Get access to archival results and Deep search for $299.99/mo overlay on images*/
.promo {
    display: none !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove the actions menu, so we can select the image*/
.actions {
    display: none !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
/*
addStyle(`
/*Hide UNLOCK buttons*\/
button[type="button"] {
    display: none !important;
    ;
}
`);
*/

//From https://greasyfork.org/scripts/406062
addStyle(`
/*un-hide add picture button*/
button[class="spacer"] {
    display: inherit !important;
    ;
}
`);

//From https://greasyfork.org/scripts/406062
addStyle(`
/*Remove events from image*/
div.thumbnail {
    pointer-events: none !important;
    ;
}
`);

addStyle(`
/*Hide the unlock popup/buttons if it appears*/
#app > div:nth-child(4) > div > div.mask {
    display: none !important;
    ;
}
`);

addStyle(`
/*Hide the unlock popup/buttons if it appears*/
#app > div:nth-child(4) > div.wrapper {
    display: none !important;
    ;
}
`);

//Hide the unlock popup if it appears in another way (e.g. hitting Deep search on a paid account)
//Prevent block-scroll from impacting the body if one hits "Deep search" or any button which causes an overlay
addStyle(`
/*Hide the unlock popup if it appears in another way#1*/
/*Prevent block-scroll from impacting the body if one hits "Deep search" or any button which causes an overlay*/
.block-scroll {
    touch-action: auto !important;
    -webkit-overflow-scrolling: touch!important;
    overflow: visible!important;
    -ms-scroll-chaining: none!important;
    overscroll-behavior: unset!important;
}
	`);


//Stops the button sizes from changing if one happens to hit the Deep Search button or cause an overlay
addStyle(`
/*Hide the unlock popup if it appears in another way #2*/
/*Stops the button sizes from changing if one happens to hit the Deep Search button or cause an overlay*/
*, :after, :before {
    box-sizing: revert !important;
}
`);

addStyle(`
/*Hide the Formspring payment request*/
#fscCanvas {
    display: none !important;
    ;
}
`);

addStyle(`
/*Prevent the overlays from blocking scrolling*
body {
    overflow: visible !important;
    ;
}
`);

/*
** bookmarklet
javascript:(function()%7Beval(function(p%2Ca%2Cc%2Ck%2Ce%2Cr)%7Be%3Dfunction(c)%7Breturn(c%3Ca%3F''%3Ae(parseInt(c%2Fa)))%2B((c%3Dc%25a)%3E35%3FString.fromCharCode(c%2B29)%3Ac.toString(36))%7D%3Bif(!''.replace(%2F%5E%2F%2CString))%7Bwhile(c--)r%5Be(c)%5D%3Dk%5Bc%5D%7C%7Ce(c)%3Bk%3D%5Bfunction(e)%7Breturn%20r%5Be%5D%7D%5D%3Be%3Dfunction()%7Breturn'%5C%5Cw%2B'%7D%3Bc%3D1%7D%3Bwhile(c--)if(k%5Bc%5D)p%3Dp.replace(new%20RegExp('%5C%5Cb'%2Be(c)%2B'%5C%5Cb'%2C'g')%2Ck%5Bc%5D)%3Breturn%20p%7D('b%201q()%7B7.8(%221r%2018%2B%20u%22)%3B5.k(%22%23c%20%3E%203%20%3E%203%20%3E%203.w-Z%20%3E%203%20%3E%203%20%3E%203%20%3E%20g%3A1s-y%22).1t.10(%221u%22%2C%5C'%3Cg%20h-v-m%3D%22%22%201v%3D%22g%22%2011%3D%221w%201x-1y%22%20h-v-1z%3D%22%22%2012%3D%221A%22%3E%3C1B%20h-v-m%3D%22%22%201C%3D%22h%3AH%2F1D%2B1E%3B1F%2C2q%2B2r%2B2s%2B%22%3E%20%3Cf%20h-v-m%3D%22%22%3E2t%202u%3C%2Ff%3E%3C%2Fg%3E%5C')%2C5.13(%221A%22).I(%221G%22%2C1H)%2C7.8(%221I%2018%2B%20u%22)%7Db%201J()%7B7.8(%221r%2014%20u%22)%3B5.k(%22%23c%20%3E%203%20%3E%203%20%3E%203.w-Z%20%3E%203%20%3E%203%20%3E%203%20%3E%20g%3A1s-y%22).1t.10(%221u%22%2C%5C'%3Cg%20h-v-m%3D%22%22%201v%3D%22g%22%2011%3D%221w%201x-1y%22%20h-v-1z%3D%22%22%2012%3D%221K%22%3E%3C1B%20h-v-m%3D%22%22%201C%3D%22h%3AH%2F1D%2B1E%3B1F%2C2v%2B2w%3D%3D%22%3E%20%3Cf%20h-v-m%3D%22%22%3E14%20u%3C%2Ff%3E%3C%2Fg%3E%5C')%2C5.13(%221K%22).I(%221G%22%2C15)%2C7.8(%221I%2014%20u%22)%7Db%201L()%7Bo.1M(0%2C2x)%2Co.1N(0%2C5.J.2y)%7Db%201O()%7Bo.1M(0%2C-2z)%2Co.1N(0%2C0)%7D16%20b%2015()%7B1P(1%3D%3D%3D5.p(%223.c-K%22).z%3Fq%3D1%3A0%3D%3D%3D5.p(%223.c-K%22).z%26%26(q%3D0)%3Bq%3C1%3B)%7B7.8(%221Q%20r%209%202A%2017%209%20c%22)%3B19%20e%3D1%3B2B%7B1L()%2C7.8(%221a%201b%22)%2CA%20B(1c)%2C7.8(%222C%20L%20(%22%2Be%2B%22x)%22)%2Ce%2B%2B%7D2D(0%3D%3D%3D5.p(%223.c-K%22).z)%3B7.8(%222E%20L%22)%2C7.8(%221a%201b%22)%2CA%20B(1c)%2C7.8(%221Q%20r%20w%2017%202F%22)%2C1O()%2C7.8(%222G%202H%209%20w%22)%2C7.8(%221a%201b%22)%2CA%20B(1c)%2Cq%3D1%7D%7Db%20B(e)%7B2I%202J%202K(t%3D%3E2L(t%2Ce))%7Db%201d()%7BC%3D5.p(%22%23c%203.c-1e%203.M%203.s%20f.N-M%22).z%2C7.8(C%2B%22%201R%20N%20c%201f%201S%22)%2C5.13(%221T%22).O%3DC%7Db%201U()%7B7.8(%222M%202N%202O%22)%3B19%20e%3D5.k(%22%23c%20%3E%203%20%3E%203%20%3E%203.w-Z%20%3E%203%20%3E%203%20%3E%20f%20%3E%20f%3A1g-y(2)%22)%2Ct%3D%5C'%3Cf%20h-v-2P%3D%22%22%3E%3C1V%2012%3D%221T%22%3E%5C'%2BC%2B%22%3C%2F1V%3E%201R%20N%20c%201f%201S%3C%2Ff%3E%22%3Be.10(%222Q%22%2Ct)%2C1d()%7Db%201W()%7BI(%22P%22%2Cb()%7B0%3D%3D%3D5.p(%223.c-K%22).z%26%26(1d()%2Cq%3D0)%7D)%7D16%20b%201h()%7B7.8(%222R%20r%201X%22)%2CA%20B(2S)%3B19%20e%3D5.k(%223.1i-1j%203.s%20f.D%22)%3Bj(2T%200!%3D%3De%26%262U!%3De)%7B(e%3D5.k(%223.1i-1j%203.s%20f.D%22)).O%3D%5C'%3Ca%202V%3D%22%5C'%2Be.O%2B%5C'%22%3E%5C'%2Be.O%2B%22%3C%2Fa%3E%22%2Cb(t)%7Bj(t%3De%2C5.J.1Y)%7B1k%20e%3D5.J.1Y()%3Be.2W(t)%2Ce.E()%7D1l%20j(o.1Z)%7B1k%20e%3Do.1Z()%2Cn%3D5.2X()%3Bn.2Y(t)%2Ce.2Z()%2Ce.30(n)%7D1l%207.31(%2232%2020%20E%2033%201m%2034%3A%2035%2036.%22)%7D(%2237%22)%7D1l%207.8(%2238%20r%201X%2039%203a%2017%201h%2021%203b%203c%203d%20F%203e%2020%203f!%22)%7Db%2022()%7B7.8(%223g%20Q%2023%20(3h%203i)%22)%2C5.p(%22%23c%203.c-1e%203.M%203.s%22).3j(b(e)%7Be.k(%22f.N-M%22)%7C%7Ce.3k.24()%7D)%2C7.8(%2225%20Q%2023%22)%7D16%20b%201H()%7B7.8(%223l%209%20Q%2026%22)%2CA%2015()%2C22()%2C7.8(%2225%209%20Q%2026%22)%7Db%20d(e)%7B1k%20t%3D5.3m(%223n%22)%3Bt.3o%3De%2C5.3p.3q(t)%7D1q()%2C1J()%2CC%3D0%2C1U()%2Cq%3D0%2C1W()%2C27%3D5.k(%223.c-1e%22)%2C27.I(%2221%22%2C1h)%2Cd(%22%5C%5Cn%2F*3r-3s%209%2028*%2F%5C%5Cn.3t-3u-D%20%7B%5C%5Cn%20%20%20%2029-E%3A%203v%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*3w%209%2028%203x%2C%202a%20R*%2F%5C%5Cn%2F*3.1i-1j%3E3.s%3Ef.D*%2F%5C%5Cn*.D%20%7B%5C%5Cn%20%20%20%203y%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%20%20%20%20S%3A%20R%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%20%20%20%2029-E%3A%201n%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%20%20%20%203z-3A%3A%201n%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%20%20%20%202b-1o%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%20%20%20%203B%3A%201n%20!6%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*T%209%203C%203D%20U%202c%202d*%2F%5C%5Cn.3E%20%7B%5C%5Cn%20%20%20%20l%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*T%209%20%5C'3F%203G%20r%203H%20c%202a%201p%202e%201P%20%243I.3J%2F3K%20U%202c%202d*%2F%5C%5Cn.3L%20%7B%5C%5Cn%20%20%20%20l%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*T%209%202f%203M%2C%201f%203N%203O%20E%209%20H*%2F%5C%5Cn.2f%20%7B%5C%5Cn%20%20%20%20l%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%5C'%5C%5Cn%2F*3P-3Q%203R%203S%20g*%2F%5C%5C3T%5B11%3D%223U%22%5D%20%7B%5C%5Cn%20%20%20%20l%3A%203V%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%5C')%2Cd(%22%5C%5Cn%2F*T%201o%20V%20H*%2F%5C%5C3W.s%20%7B%5C%5Cn%20%20%20%202b-1o%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*G%209%20W%20F%2F2g%20j%20X%20Y*%2F%5C%5Cn%232h%20%3E%203%3A1g-y(4)%20%3E%203%20%3E%203.3X%20%7B%5C%5Cn%20%20%20%20l%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*G%209%20W%20F%2F2g%20j%20X%20Y*%2F%5C%5Cn%232h%20%3E%203%3A1g-y(4)%20%3E%203.3Y%20%7B%5C%5Cn%20%20%20%20l%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%5C'%5C%5Cn%2F*G%209%20W%20F%20j%20X%20Y%201m%202i%202j%231*%2F%5C%5Cn%2F*2k%202l-P%20V%203Z%209%20J%20j%202m%2040%20%221p%202e%22%202n%2041%20g%2042%2043%202o%20U*%2F%5C%5Cn.2l-P%20%7B%5C%5Cn%20%20%20%202p-44%3A%2045%20!6%3B%5C%5Cn%20%20%20%20-46-S-L%3A%202p!6%3B%5C%5Cn%20%20%20%20S%3A%20R!6%3B%5C%5Cn%20%20%20%20-47-P-48%3A%20i!6%3B%5C%5Cn%20%20%20%2049-4a%3A%204b!6%3B%5C%5Cn%7D%5C%5Cn%5C%5Ct%5C')%2C5.k(%223%5Bh-v-4c%5D%22).24()%2Cd(%22%5C%5Cn%2F*G%209%20W%20F%20j%20X%20Y%201m%202i%202j%20%232*%2F%5C%5Cn%2F*4d%209%20g%204e%20V%204f%20j%202m%204g%20r%204h%209%201p%204i%20g%202n%204j%202o%20U*%2F%5C%5Cn*%2C%20%3A4k%2C%20%3A4l%20%7B%5C%5Cn%20%20%20%204m-4n%3A%204o%20!6%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*G%209%204p%204q%204r*%2F%5C%5Cn%234s%20%7B%5C%5Cn%20%20%20%20l%3A%20i%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%2Cd(%22%5C%5Cn%2F*2k%209%204t%20V%204u%20L*%5C%5C4v%20%7B%5C%5Cn%20%20%20%20S%3A%20R%20!6%3B%5C%5Cn%20%20%20%20%3B%5C%5Cn%7D%5C%5Cn%22)%3B'%2C62%2C280%2C'%7C%7C%7Cdiv%7C%7Cdocument%7Cimportant%7Cconsole%7Clog%7Cthe%7C%7Cfunction%7Cresults%7CaddStyle%7C%7Cspan%7Cbutton%7Cdata%7Cnone%7Cif%7CquerySelector%7Cdisplay%7C4ccff48d%7C%7Cwindow%7CquerySelectorAll%7Cscrolled%7Cto%7Cthumbnail%7C%7CButton%7C%7Ctop%7C%7Cchild%7Clength%7Cawait%7Csleep%7CexplicitCount%7Curl%7Cselect%7Cpopup%7CHide%7Cimage%7CaddEventListener%7Cbody%7Cend%7Cscrolling%7Cresult%7Cexplicit%7CinnerHTML%7Cscroll%7Cremoval%7Cvisible%7Coverflow%7CRemove%7Coverlay%7Cfrom%7Cunlock%7Cit%7Cappears%7Cslot%7CinsertAdjacentHTML%7Cclass%7Cid%7CgetElementById%7CScroll%7Cscroller%7Casync%7Cof%7C%7Cvar%7CSleeping%7C1000ms%7C1e3%7CexpResultsUpdater%7Cgrid%7Cso%7Cnth%7ChighlightUrl%7Cmodal%7Ccontent%7Cconst%7Celse%7Cin%7Cinitial%7Cevents%7CDeep%7CexplicitButts%7CAdding%7Clast%7CparentElement%7Cbeforeend%7Ctype%7Cdefault%7Cicon%7Conly%7C46dbee4d%7C18Button%7Cimg%7Csrc%7Csvg%7Cxml%7Cbase64%7Cclick%7CexplicitJS%7CAdded%7CscrollButts%7CscrollButton%7CscrollDown%7CscrollBy%7CscrollTo%7CscrollUp%7Cfor%7CScrolling%7Cpotentially%7Cfar%7CexpResults%7CexplicitStats%7Cbdi%7CscrollResultsUpdateListener%7Chighlight%7CcreateTextRange%7CgetSelection%7Cnot%7Cmousedown%7CjsRemover%7Cscript%7Cremove%7CFinished%7Cprocess%7CclickThumb%7CURLs%7Cuser%7Cand%7Cpointer%7Con%7Cimages%7Csearch%7Cactions%7Cbuttons%7Capp%7Canother%7Cway%7CPrevent%7Cblock%7Cone%7Cor%7Can%7Ctouch%7CPHN2ZyB2aWV3Qm94PSIwIDAgMzEwLjkgMzEwLjkiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%7CPHBhdGggZD0iTTk1IDIxMS40di04OS4zSDc0LjRWOTkuMmg0OS4xdjExMi4yem0xMzUuNi04My4yYzAgOS44LTUuMyAxOC40LTE0LjEgMjMuMiAxMi4zIDUuMSAyMCAxNS44IDIwIDI4LjMgMCAyMC4yLTE3LjkgMzMtNDUuOSAzM3MtNDUuOS0xMi42LTQ1LjktMzIuNWMwLTEyLjggOC4zLTIzLjcgMjEuMy0yOC44LTkuNC01LjMtMTUuNS0xNC4yLTE1LjUtMjQgMC0xNy45IDE1LjctMjkuMyA0MC0yOS4zIDI0LjUuMSA0MC4xIDExLjcgNDAuMSAzMC4xem0tNTkuMSA0OS4yYzAgOS40IDYuNyAxNC43IDE5IDE0LjdzMTkuMi01LjEgMTkuMi0xNC43YzAtOS4zLTYuOS0xNC42LTE5LjItMTQuNnMtMTkgNS4zLTE5IDE0LjZ6bTIuOS00Ny42YzAgOCA1LjggMTIuNSAxNi4yIDEyLjVzMTYuMi00LjUgMTYuMi0xMi41YzAtOC4zLTUuOC0xMy0xNi4yLTEzLTEwLjUuMS0xNi4yIDQuNy0xNi4yIDEzeiIvPjxwYXRoIGQ9Ik0xNTUuNCAzMTAuOUM2OS43IDMxMC45IDAgMjQxLjEgMCAxNTUuNFM2OS43IDAgMTU1LjQgMGMxMS42IDAgMjMuMiAxLjMgMzQuNSAzLjlWMTVjLTExLjItMi44LTIyLjgtNC4xLTM0LjUtNC4xLTc5LjcgMC0xNDQuNiA2NC45LTE0NC42IDE0NC42czY0LjkgMTQ0LjYgMTQ0LjYgMTQ0LjZTMzAwIDIzNS4yIDMwMCAxNTUuNWMwLTExLjctMS40LTIzLjMtNC4xLTM0LjVIMzA3YzIuNiAxMS4zIDMuOSAyMi44IDMuOSAzNC41IDAgODUuNi02OS44IDE1NS40LTE1NS41IDE1NS40eiIvPjxwYXRoIGQ9Ik0yNzUuNyAzNS4xVjMuNkgyNTN2MzEuNWgtMzEuNHYyMi43SDI1M3YzMS41aDIyLjdWNTcuOGgzMS41VjM1LjF6Ii8%7CPC9zdmc%7CView%7CExplicit%7CPHN2ZyB2aWV3Qm94PSIwIDAgNDkwLjcgNDkwLjciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI%7CPHBhdGggZD0ibTQ3Mi4zIDIxNi41LTIyNy4xIDIyNy4yLTIyNy4xLTIyNy4yYy00LjItNC4xLTExLTQtMTUuMS4zLTQgNC4xLTQgMTAuNyAwIDE0LjhsMjM0LjcgMjM0LjdjNC4yIDQuMiAxMC45IDQuMiAxNS4xIDBsMjM0LjctMjM0LjdjNC4xLTQuMiA0LTExLS4zLTE1LjEtNC4yLTQtMTAuNy00LTE0LjkgMHoiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtNDcyLjMgMjQuNS0yMjcuMSAyMjcuMi0yMjcuMS0yMjcuMmMtNC4yLTQuMS0xMS00LTE1LjEuMy00IDQuMS00IDEwLjcgMCAxNC44bDIzNC43IDIzNC43YzQuMiA0LjIgMTAuOSA0LjIgMTUuMSAwbDIzNC42LTIzNC43YzQuMi00LjEgNC40LTEwLjguMy0xNS4xLTQuMS00LjItMTAuOC00LjQtMTUuMS0uMy0uMS4yLS4yLjItLjMuM3oiIGZpbGw9IiM2MDdkOGIiLz48cGF0aCBkPSJtMjQ1LjIgNDY5LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4yLTQuMSAxMS00IDE1LjEuMyA0IDQuMSA0IDEwLjcgMCAxNC44bC0yMzQuNyAyMzQuN2MtMiAyLTQuNyAzLjEtNy41IDMuMXoiLz48cGF0aCBkPSJtMjQ1LjIgMjc3LjRjLTIuOCAwLTUuNS0xLjEtNy42LTMuMWwtMjM0LjYtMjM0LjdjLTQuMS00LjItNC0xMSAuMy0xNS4xIDQuMS00IDEwLjctNCAxNC44IDBsMjI3LjEgMjI3LjEgMjI3LjEtMjI3LjFjNC4xLTQuMiAxMC44LTQuNCAxNS4xLS4zczQuNCAxMC44LjMgMTUuMWMtLjEuMS0uMi4yLS4zLjNsLTIzNC43IDIzNC43Yy0yIDItNC43IDMuMS03LjUgMy4xeiIvPjwvc3ZnPg%7C1e4%7CscrollHeight%7C5e4%7Cbottom%7Cdo%7CStill%7Cwhile%7CDone%7Cpage%7CWe%7Creached%7Creturn%7Cnew%7CPromise%7CsetTimeout%7CInserting%7CStats%7CCounter%7C26e5f418%7Cbeforebegin%7CWaiting%7C200%7Cvoid%7Cnull%7Chref%7CmoveToElementText%7CcreateRange%7CselectNodeContents%7CremoveAllRanges%7CaddRange%7Cwarn%7CCould%7Ctext%7Cnode%7CUnsupported%7Cbrowser%7CspanUrl%7CTried%7CURL%7Cbecause%7Cevent%7Clistener%7Cbut%7Cdoes%7Cexist%7CRunning%7CPure%7CJavaScript%7CforEach%7CparentNode%7CStarting%7CcreateElement%7Cstyle%7CtextContent%7Chead%7Cappend%7CUn%7Cblur%7Cblurred%7Csource%7Call%7CMake%7Cselectable%7Cfilter%7Cmax%7Cwidth%7Cposition%7CBuy%7CPremium%7Czoom%7CGet%7Caccess%7Carchival%7C299%7C99%7Cmo%7Cpromo%7Cmenu%7Cwe%7Ccan%7Cun%7Chide%7Cadd%7Cpicture%7Cnbutton%7Cspacer%7Cinherit%7Cndiv%7Cmask%7Cwrapper%7Cimpacting%7Chits%7Cany%7Cwhich%7Ccauses%7Caction%7Cauto%7Cwebkit%7Cms%7Cchaining%7Coverscroll%7Cbehavior%7Cunset%7C69882821%7CStops%7Csizes%7Cchanging%7Chappens%7Chit%7CSearch%7Ccause%7Cafter%7Cbefore%7Cbox%7Csizing%7Crevert%7CFormspring%7Cpayment%7Crequest%7CfscCanvas%7Coverlays%7Cblocking%7Cnbody'.split('%7C')%2C0%2C%7B%7D))%7D)()%3B
*/

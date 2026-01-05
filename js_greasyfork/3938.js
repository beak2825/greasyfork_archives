// ==UserScript==
// @name       BGG Shortcuts
// @namespace  BGG Shortcuts
// @version    0.9.9
// @description  Keyboard shortcuts for the Geek
// @include     http://*.boardgamegeek.*/*
// @include     http://boardgamegeek.*/*
// @include     https://*.boardgamegeek.*/*
// @include     https://boardgamegeek.*/*
// @copyright  2013+, JB McMichael
// @downloadURL https://update.greasyfork.org/scripts/3938/BGG%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/3938/BGG%20Shortcuts.meta.js
// ==/UserScript==

/*
 * CHANGLOG::
 * ============================================
 * 0.9.9 - Use the correct key
 * 0.9.8 - Update to hot key handling
 * 0.9.7 - Change some font sizes
 * 0.9.6 - Add shortcuts on the subscription page for auto selecting settings
 * 0.9.5 - Add K shortcut to go back a page
 * 0.9.4 - When loading a comment in a geeklist, scroll to item the comment is for
 * 0.9.3 - Fixed an error on Firefox relating to using strict
 * 0.9.2 - Better next link
 * 0.9.1 - Fixed a stupid bug
 * 0.9.0 - Updated so that the shortcuts work on the new game page style
 * 0.8.1 - Updated to work on https
 * 0.8.0 - Forum links pop up in a modal so that you don't lose your place on a page
 * 0.7.0 - Changed the links to just be J for next item, H for home, and / for search, but disabled shortcuts in form elements
 * 0.6.1 - Give the page some time to load its scripts before changing links
 * 0.6.0 - Added a shortcut to go to the searchbox Ctrl + /
 * 0.5.0 - Added homepage links opening in new tab
 * 0.4.0 - If search returns one result just go to that result
 * 0.3.0 - Added homepage shortcut; Ctrl + Shift + H
 * 0.2.0 - Cleaned up the subscription jump link
 * 0.1.0 - First version, shortcut for subscriptions; Ctrl + M
 *
 */

(function () {
	"use strict";
	console.log('Loaded BGG Shortcuts');

	document.body.addEventListener('keydown', function (e) {
		let active = document.activeElement.tagName.toLowerCase(),
			badElements = ['input', 'textarea', 'select'];

		// ignore shortcuts if we are in some form of input
		if (badElements.indexOf(active) === -1) {

			// Next subscription item J
			if (e.key === 'j') {
				if (!!document.querySelector('[href="/subscriptions/next"]')) {
					let next = document.querySelectorAll('[href="/subscriptions/next"]');
					next[0].click();
				} else if (!!document.querySelectorAll("img:not(dn).nextsubcol")[0]) {
					[].slice.call(document.querySelectorAll("img:not(dn).nextsubcol")[0].parentNode.parentNode.click());
				}
			}

			// Home page H
			if (e.key === 'h' && window.location.href !== window.location.origin) {
				window.location.href = window.location.origin;
			}

			// Search box jump /
			if (e.key === '/') {
				let searchbox = !!document.getElementById('sitesearch') ? document.getElementById('sitesearch') : document.querySelector('[ng-model="searchctrl.search.q"]');
				document.body.scrollTop = 0;
				searchbox.focus();
				window.setTimeout(function () {
					searchbox.value = '';
				}, 10);
			}

			// K to go back
			if (e.key === 'k') {
				window.history.back();
			}

			/**
			 * Subscription Page Hotkeys
			 * =========================
			 * These are only triggered on the subscription page, so each one has a check
			 * a = turn everything to yes 65
			 * o = i own the game, and want to track it 80
			 * b = i want to buy the game 71
			 */
			let subKeys = ['a', 'o', 'b'];
			if (subKeys.indexOf(e.key) !== -1) {
				subscriptionSelection(e.key);
			}

		}

	}, false);

	if (window.location.pathname.split('/')[1] === 'subscription') {
		//show the hoykeys for this page
		let table = getNearestTableAncestor(document.querySelector('#thread'));
		let newDiv = document.createElement("div");
		let all = document.createElement("div");
		let allDesc = document.createTextNode('a - turn on all subscriptions');
		let own = document.createElement("div");
		let ownDesc = document.createTextNode("o - I own the game, just track the important things");
		let buy = document.createElement("div");
		let buyDesc = document.createTextNode('b - I want to buy the game, so track sales');

		all.appendChild(allDesc);
		own.appendChild(ownDesc);
		buy.appendChild(buyDesc);

		newDiv.appendChild(all);
		newDiv.appendChild(own);
		newDiv.appendChild(buy);

		table.parentNode.insertBefore(newDiv, table.nextSibling);
	}

	function subscriptionSelection(key) {
		if (window.location.pathname.split('/')[1] === 'subscription') {
			let thread = document.querySelector('#thread');
			let reply = document.querySelector('#article');
			let geeklist = document.querySelector('#listitem');
			let image = document.querySelector('#image');
			let video = document.querySelector('#video');
			let ebay = document.querySelector('#ebayauction');
			let market = document.querySelector('#storeitem');
			let file = document.querySelector('#file');
			let member = document.querySelector('#linkeditem');
			let comment = document.querySelector('#comment');
			let blog = document.querySelector('#blogpost');
			let preview = document.querySelector('#previewitem');

			switch (key) {
				case 65:
					thread.selectedIndex = 1;
					reply.selectedIndex = 1;
					geeklist.selectedIndex = 1;
					image.selectedIndex = 1;
					video.selectedIndex = 1;
					ebay.selectedIndex = 1;
					market.selectedIndex = 1;
					file.selectedIndex = 1;
					member.selectedIndex = 1;
					comment.selectedIndex = 1;
					blog.selectedIndex = 1;
					preview.selectedIndex = 1;
					break;
				case 66:
					thread.selectedIndex = 2;
					reply.selectedIndex = 2;
					geeklist.selectedIndex = 1;
					image.selectedIndex = 2;
					video.selectedIndex = 2;
					ebay.selectedIndex = 1;
					market.selectedIndex = 1;
					file.selectedIndex = 2;
					member.selectedIndex = 2;
					comment.selectedIndex = 2;
					blog.selectedIndex = 2;
					preview.selectedIndex = 2;
					break;
				case 79:
					thread.selectedIndex = 1;
					reply.selectedIndex = 2;
					geeklist.selectedIndex = 2;
					image.selectedIndex = 2;
					video.selectedIndex = 2;
					ebay.selectedIndex = 2;
					market.selectedIndex = 2;
					file.selectedIndex = 2;
					member.selectedIndex = 2;
					comment.selectedIndex = 2;
					blog.selectedIndex = 2;
					preview.selectedIndex = 2;
					break;

			}
		}
	}

	//check for one result on the search page
	if (window.location.pathname === '/geeksearch.php' && window.location.search.search(/action=search/)) {
		let results = document.querySelectorAll('#collectionitems tbody tr');
		console.log('We are searching');
		if (results.length === 2) {
			console.log('Found just one result, redirect');
			let link = results[1].querySelectorAll('#results_objectname1 a'),
				href = link[0].getAttribute('href');

			window.location.href = window.location.origin + href;
		}
	}

	// set all homepage module links to open in new tab
	if (window.location.pathname === '/') {
		window.setTimeout(function () {
			console.log('Changing homepage links');
			let links = document.querySelectorAll('.innermoduletable tbody td a.ng-binding'),
				linkArray = [].slice.call(links);

			linkArray.forEach(function (item, index) {
					item.setAttribute('target', '_blank');
				}
			);
		}, 500);
	}

	// popup forum links in a dialog
	if (window.location.pathname.split('/')[1] === 'boardgame') {
		// grab all forum link clicks
		document.addEventListener('click', forumClick, false);
	}

	function forumClick(e) {
		if (e.target.tagName === 'A' && e.target.href.split('/')[3] === 'thread') {
			e.preventDefault();

			// use the BGG API to get the thread
			let req = new XMLHttpRequest(),
				apiUrl = window.location.protocol + '//' + window.location.host + '/xmlapi2/thread?id=',
				diag = document.createElement('dialog'),
				content = document.createElement('div'),
				close = document.createElement('button'),
				thread = e.target.href.split('/')[4];

			diag.style.width = '80%';
			diag.style.height = '80%';
			diag.style.border = '2px solid rgba(0, 0, 0, 0.3)';
			diag.style.borderRadius = '6px';
			diag.style.boxShadow = '0 3px 7px rgba(0, 0, 0, 0.3)';

			content.style.overflowY = 'auto';
			content.style.height = '95%';
			content.style.margin = '5px 0px';

			close.innerText = 'Close';

			req.onreadystatechange = showContents;

			req.open('GET', apiUrl + thread, true);

			req.send();

			showContents(e, req);
		}
	}

	function showContents(e, req) {
		if (req.readyState === 4 && req.status === 200) {
			let subject = req.responseXML.documentElement.children[0].firstChild.nodeValue,
				articles = req.responseXML.documentElement.children[1].children;

			for (let i = 0; i < articles.length; i++) {
				let article = articles[i];
				let user = article.getAttribute('username');
				let title = article.children[0].firstChild.nodeValue;
				let body = article.children[1].firstChild.nodeValue;
				let postdate = article.getAttribute('postdate');
				let articleDiv = document.createElement('div');
				let dl = document.createElement('dl');
				let ddLeft = document.createElement('dd');
				let ddRight = document.createElement('dd');
				let userDiv = document.createElement('div');
				let bottomDl = document.createElement('dl');
				let ddLeft2 = document.createElement('dd');
				let ddCommands = document.createElement('dd');
				let ul = document.createElement('ul');
				let li = document.createElement('li');
				let ulInfo = document.createElement('ul');
				let liInfo = document.createElement('li');
				let postLink = document.createElement('a');
				let clearDiv = document.createElement('div');
				let rollsDiv = document.createElement('div');
				let userInfo = getUser(user);

				articleDiv.addClass('article');

				rollsDiv.addClass('rollsblock');

				ddLeft.addClass('left');
				ddRight.addClass('right');
				userDiv.addClass('username');
				userDiv.innerHTML = user;

				ddLeft.appendChild(userDiv);
				ddRight.innerHTML = body;

				dl.appendChild(ddLeft);
				dl.appendChild(ddRight);

				articleDiv.appendChild(dl);

				ddLeft2.addClass('left');
				ddCommands.addClass('commands');

				ul.appendChild(li);
				ddCommands.appendChild(ul);

				clearDiv.addClass('clear');
				ulInfo.addClass('information');

				postLink.innerHTML = postdate;
				liInfo.appendChild(postLink);
				ulInfo.appendChild(liInfo);
				ddCommands.appendChild(ulInfo);

				bottomDl.appendChild(ddLeft2);
				bottomDl.appendChild(ddCommands);

				articleDiv.appendChild(bottomDl);
				articleDiv.appendChild(clearDiv);
				articleDiv.appendChild(rollsDiv);

				content.appendChild(articleDiv);
			}

			diag.insertBefore(close, diag.childNodes[0]);
			diag.insertBefore(content, diag.childNodes[0]);
			close.addEventListener('click', function (e) {
					diag.close();
				}
			);
			document.body.insertBefore(diag, document.body.childNodes[0]);
			diag.showModal();
		}
	}

	// Check for readystate so that we can shift the page if needed
	let interval = setInterval(function () {
		if (document.readyState === 'complete') {
			clearInterval(interval);
			checkForComment();
		}
	}, 100);

	function checkForComment() {
		if (/comment[0-9]+/.test(window.location.hash) && window.location.pathname.includes('/geeklist/')) {
			let hash = window.location.hash;
			let comment = document.querySelector(hash);
			let parent = comment.parentElement.parentElement.parentElement.parentElement; // get the actual item

			window.scroll(0, findPos(parent));
		}
	}

	function findPos(obj) {
		let curtop = 0;
		if (obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
			return [curtop];
		}
	}

	function getUser(name) {
		let req = new XMLHttpRequest(),
			apiUrl = window.location.protocol + '//' + window.location.host + '/xmlapi2/user?name=' + name;

		req.onreadystatechange = function (e) {
			if (req.readyState === 4 && req.status === 200) {
				console.log(req.responseXML);
			}
		};

		req.open('GET', apiUrl, true);

		req.send();
	}

	function getNearestTableAncestor(htmlElementNode) {
		while (htmlElementNode) {
			htmlElementNode = htmlElementNode.parentNode;
			if (htmlElementNode.tagName.toLowerCase() === 'table') {
				return htmlElementNode;
			}
		}
		return undefined;
	}

	// change the font size
	let el = document.querySelectorAll('div.article dd');
	for (let i = 0; i < el.length; i++) {
		let element = el[i];
		element.style.fontSize = "1.25em";
	}
}
());

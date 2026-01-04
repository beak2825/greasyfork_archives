// ==UserScript==
// @name Trello — List highlighter
// @description Custom color format for CRP Setpoint Shop. Titles 'Todo', 'Doing' or 'Stop' or 'done' are color coded. 'Done' grey, 10% transparent and applies strikethrough to all card text. -
// @include https://trello.com/*
// @run-at document-start
// @version 1.2.3
// @author Ryan Romel
// @namespace https://greasyfork.org/users/457652
// @downloadURL https://update.greasyfork.org/scripts/397751/Trello%20%E2%80%94%20List%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/397751/Trello%20%E2%80%94%20List%20highlighter.meta.js
// ==/UserScript==

'use strict';

var css = `

.list {
	opacity: 1;
}

.do-not-dim-lists .list {
	opacity: 1;
}

.doing-list .open-card-composer,
.doing-list .icon-lg,
.doing-list .icon-sm {
	opacity: .6;
	color: inherit;
}
.doing-list .list-header-extras-menu,
.doing-list .list-header-extras-menu:hover span,
.doing-list .list-header-extras-menu span:hover {
	opacity: 1;
	color: #fff;
}
.doing-list .open-card-composer:hover,
.doing-list .list-header-extras-menu:hover,
.doing-list .icon-lg:hover,
.doing-list .icon-sm:hover {
	opacity: 1;
}
.doing-list .placeholder {
	border-bottom-color: transparent;
}
.doing-list .open-card-composer:hover,
.doing-list .list-header-extras-menu:hover,
.doing-list .placeholder {
	background-color: rgba(0, 0, 0, .13);
}
.doing-list .u-fancy-scrollbar::-webkit-scrollbar-track-piece {
	background: rgba(0, 0, 0, .1);
}
.doing-list .u-fancy-scrollbar::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, .17);
}

.doing-list {
	color: #fff;
	background-color: #032cfc;
}

.doing-list .list-header-name {
	color: #fff;
}

.doing-list {
	opacity: 1;
}

.todo-list .open-card-composer,
.todo-list .icon-lg,
.todo-list .icon-sm {
	opacity: .6;
	color: inherit;
}
.todo-list .list-header-extras-menu,
.todo-list .list-header-extras-menu:hover span,
.todo-list .list-header-extras-menu span:hover {
	opacity: 1;
	color: #fff;
}
.todo-list .open-card-composer:hover,
.todo-list .list-header-extras-menu:hover,
.todo-list .icon-lg:hover,
.todo-list .icon-sm:hover {
	opacity: 1;
}
.todo-list .placeholder {
	border-bottom-color: transparent;
}
.todo-list .open-card-composer:hover,
.todo-list .list-header-extras-menu:hover,
.todo-list .placeholder {
	background-color: rgba(0, 0, 0, .13);
}
.todo-list .u-fancy-scrollbar::-webkit-scrollbar-track-piece {
	background: rgba(0, 0, 0, .1);
}
.todo-list .u-fancy-scrollbar::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, .17);
}

.todo-list {
	color: #fff;
	background-color: #00a300;
}

.todo-list .list-header-name {
	color: #fff;
}

.todo-list {
	opacity: 1;
}

.stop-list .open-card-composer,
.stop-list .icon-lg,
.stop-list .icon-sm {
	opacity: .6;
	color: inherit;
}
.stop-list .list-header-extras-menu,
.stop-list .list-header-extras-menu:hover span,
.stop-list .list-header-extras-menu span:hover {
	opacity: 1;
	color: #fff;
}
.stop-list .open-card-composer:hover,
.stop-list .list-header-extras-menu:hover,
.stop-list .icon-lg:hover,
.stop-list .icon-sm:hover {
	opacity: 1;
}
.stop-list .placeholder {
	border-bottom-color: transparent;
}
.stop-list .open-card-composer:hover,
.stop-list .list-header-extras-menu:hover,
.stop-list .placeholder {
	background-color: rgba(0, 0, 0, .13);
}
.stop-list .u-fancy-scrollbar::-webkit-scrollbar-track-piece {
	background: rgba(0, 0, 0, .1);
}
.stop-list .u-fancy-scrollbar::-webkit-scrollbar-thumb {
	background: rgba(0, 0, 0, .17);
}

.stop-list {
	color: #fff;
	background-color: #cc5858;
}

.stop-list .list-header-name {
	color: #fff;
}

.stop-list:hover {
    opacity: 1;
}
.stop-list {
	opacity: .6;
}

.do-not-dim-lists .done-list .list-cards,
.done-list .list-cards {
	text-decoration: line-through;
}

.do-not-dim-lists .done-list,
.done-list {
	opacity: .9;
	-webkit-filter: grayscale(100%);
}`;


window.addEventListener('load', function(event) {

	var style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	style.appendChild(document.createTextNode(css));
	document.querySelector('head').appendChild(style);

	watchTitleChangesAndSetupBoard();
	watchBoardForNewLists();
	watchListTitleChanges();
	keepTrying(highlightLists, 5, 700);

});

function watchTitleChangesAndSetupBoard() {
	observe({
		targets  : document.querySelector('title'), // could watch board-header-btn-text but it doesn't always exist
		options  : {characterData: true, childList: true, subtree: true},
		callback : function (node) {

			watchBoardForNewLists();
			watchListTitleChanges();
			highlightLists();

		}
	});
}

function watchBoardForNewLists() {
	observe({
		targets : document.querySelector('#board'),
		options  : {childList: true, subtree: false},
		callback : function (node) {
			highlightLists();
		}
	});
}

function watchListTitleChanges() {
	observe({
		targets  : document.querySelectorAll('.list-header h2'),
		options  : {childList: true, subtree: false},
		callback : function (node) {
			highlightLists();
		}
	});
}

function highlightLists() {

	var lists = document.querySelectorAll('.list');

	for (var i = 0, len = lists.length; i < len; i++) {

		var list = lists[i],
			header = list.querySelector('.list-header h2'),
			listTitle;

		if (header) {

			listTitle = header.childNodes[0].textContent.toLowerCase().trim();

			if (listTitle == 'pretest/teardown queue (hottest on top)' || listTitle == 'assembly queue (hottest on top)' || listTitle == 'pull from warehouse' || listTitle == 'ready to ship') {
				list.classList.add('todo-list');
			} else {
				list.classList.remove('todo-list');
			}

			if (listTitle == 'pretest/teardown/inspection (in progress)' || listTitle == 'assembly (in progress)' || listTitle == 'awaiting parts from vendor' || listTitle == 'awaiting pick' || listTitle == 'pack slip needs to be scanned') {
				list.classList.add('doing-list');
			} else {
				list.classList.remove('doing-list');
			}

            if (listTitle == 'on shop floor-awaiting---parts or response' || listTitle == 'stop' || listTitle == 'awaiting valve from customer' || listTitle == 'awaiting pick' || listTitle == 'no work order or card') {
				list.classList.add('stop-list');
			} else {
				list.classList.remove('stop-list');
			}

            if (listTitle == 'completed (ready to ship)' || listTitle == 'done' || listTitle == 'complete') {
				list.classList.add('done-list');
			} else {
				list.classList.remove('done-list');
			}

		}

	}

	if (document.querySelectorAll('.todo-list').length === 0 &&
		document.querySelectorAll('.doing-list').length === 0
	) {
		document.body.classList.add('do-not-dim-lists');
	} else {
		document.body.classList.remove('do-not-dim-lists');
	}

}

function observe(params) {

	var observer = new MutationObserver(function (node) { params.callback(node, observer); });

	if (!params.targets && params.target) {
		params.targets = params.target;
	}

	if (params.targets instanceof NodeList || Array.isArray(params.targets)) {

		for (var i = params.targets.length - 1; i > -1; i--) {
			observer.observe(params.targets[i], params.options);
		}

	} else if (params.targets instanceof HTMLElement) {

		observer.observe(params.targets, params.options);

	}

}

function keepTrying(callback, limit, interval) {

	interval = (isNaN(interval) ? 500 : interval);
	limit = (isNaN(limit) ? 5 : --limit);

	try {
		callback();
	} catch(error) {
		if (limit > 0) {
			window.setTimeout(function () {
				keepTrying(callback, limit, interval);
			}, interval);
		}
	}

}

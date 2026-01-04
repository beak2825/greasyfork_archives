// ==UserScript==
// @name         CC98 Block
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  block the user you don't want to see his reply.
// @author       kumiko
// @match        *://www.cc98.org/topic/*
// @match        *://www.cc98.org/newTopics
// @match        *://www.cc98.org/focus
// @match        *://www.cc98.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      AGPL-3.0
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @downloadURL https://update.greasyfork.org/scripts/435616/CC98%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/435616/CC98%20Block.meta.js
// ==/UserScript==

let starttime = new Date();
console.log("==> Script start.", starttime);


var ban_user_list = new Array();
var ban_topic_list = new Array();

if (localStorage.ban_user_list) {
	ban_user_list = JSON.parse(localStorage.ban_user_list);
}

if (localStorage.ban_topic_list) {
	ban_topic_list = JSON.parse(localStorage.ban_topic_list);
}


// 添加拉黑按钮
function addUserBtn(commentlike, user_message) {
	var b = document.createElement('button');
	b.textContent = '拉黑';
	b.style.cssText = 'width: 25%;height: 25%; text-align: center; vertical-align:bottom; margin-left: 8px';
	b.addEventListener('click', banUser);
	b.user_message = user_message;
	commentlike.appendChild(b);
}


function addTopicBtn(focus_topic) {
	if (focus_topic.querySelector('span') == null) {
		var span = document.createElement('span');
		span.innerText = '屏蔽';
		// b.style.cssText = 'width: 25%;height: 25%; text-align: center; vertical-align:bottom; margin-left: 8px';
		span.addEventListener('click', banTopic);
		span.style.cssText = 'width: 40px';
		var focus_topic_info = focus_topic.querySelector('.focus-topic-info');
		focus_topic_info.insertBefore(span, focus_topic_info.firstChild);
		span.focus_topic = focus_topic;
	}
	//console.log('[addTopicBtn]: ', focus_topic_info);
}

function changeTopicBtn(focus_topic) {
	var span = focus_topic.querySelector('span');
	if (span != null) {
		span.focus_topic = focus_topic;
	} else {
		addTopicBtn(focus_topic);
	}
}

function loadFocus() {
	var focus_topics = document.querySelectorAll('.focus-topic');
	console.log('[loadFocus]: focus_topics.length ', focus_topics.length);
	focus_topics.forEach(
		function (el) {
			//var user_message = el.querySelector('.focus-topic-userName');
			//console.log('[LoadFocus] current topic user name: ', el.textContent);
			if (el) {
				if (removeTopic(el) == false) {
					addTopicBtn(el);
				}
			}
		}
	);
}

function changeFocus() {
	var focus_topics = document.querySelectorAll('.focus-topic');
	focus_topics.forEach(
		function (el) {
			//var user_message = el.querySelector('.focus-topic-userName');
			//console.log('[LoadFocus] current topic user name: ', el.textContent);
			if (el) {
				if (removeTopic(el) == false) {
					changeTopicBtn(el);
				}
			}
		}
	);
}

function loadMoreTopic(mutationsList) {
	for (const mutation of mutationsList) {
		var focus_topic = mutation.addedNodes[0];
		// console.log('[loadMoreTopic] user name: ', user_name);
		if (focus_topic) {
			if (removeTopic(focus_topic) == false) {
				addTopicBtn(focus_topic);
			}
		}
	}
}

// 删除当前回复
function removeReply(user_message) {
	var user_name = user_message.text;
	if (ban_user_list.includes(user_name)) {
		try {
			// user_message.offsetParent.remove();
			// user_message.offsetParent.style.visibility = "hidden";
			user_message.offsetParent.style.display = "none";
			console.log("==> Hidden user's reply ", user_name);
		} catch (e) { }

		return true;
	}
	return false;
}

function banTopic(event) {
	var query_res = event.currentTarget.focus_topic.querySelector('.focus-topic-title');
	var topic = query_res.getAttribute('href').slice(7, -2);
	var topic_text = query_res.text;
	var r = window.confirm('确认屏蔽此贴[ ' + topic_text + ' ]?');
	if (r) {

		if (!ban_topic_list.includes(topic)) {
			ban_topic_list.push(topic);
			localStorage.ban_topic_list = JSON.stringify(ban_topic_list);
		}
		removeTopic(event.currentTarget.focus_topic);
	}
}


function banUser(event) {
	var user_name = event.currentTarget.user_message.text;
	var r = window.confirm('确认拉黑用户[ ' + user_name + ' ]?');
	if (r) {
		if (!ban_user_list.includes(user_name)) {
			ban_user_list.push(user_name);
			localStorage.ban_user_list = JSON.stringify(ban_user_list);
		}
		removeReply(event.currentTarget.user_message);
	}
}

function loadReply() {
	console.log('Begin Search Reply');
	var replys = document.querySelectorAll('.reply');
	replys.forEach(
		function (el) {
			var user_message = el.querySelector('.userMessage-userName');
			if (user_message) {
				var commentlike = el.querySelector('#commentlike');
				if (removeReply(user_message) == false) {
					console.log('[loadReply] 查找到回复, 用户为: ' + user_message.text);
					if (commentlike.getElementsByTagName('button').length == 0) {
						addUserBtn(commentlike, user_message);
					}
				}
			}
		}
	);
}


function loadHot() {
	console.log('Begin Search Hot Reply');
	var replys = document.querySelectorAll('[id^=hot]');
	replys.forEach(
		function (el) {
			var user_message = el.querySelector('.userMessage-userName');
			if (user_message) {
				var commentlike = el.querySelector('#commentlike');
				if (removeReply(user_message) == false) {
					console.log('[loadHot] 查找到hot回复, 用户为: ' + user_message.text);
					addUserBtn(commentlike, user_message);
					// setTimeout(() => console.log(1), 1000);
				}
			}
		}
	);
}


function removeTopic(focus_topic) {
	var user_name = focus_topic.querySelector('.focus-topic-userName').textContent;
	var topic_href = focus_topic.querySelector('.focus-topic-title').getAttribute('href').slice(7, -2);
	if (ban_user_list.includes(user_name) || ban_topic_list.includes(topic_href)) {
		try {
			focus_topic.style.display = "none";
			console.log("==> Rmove user's topic ", user_name, topic_href);
		} catch (e) { }
		return true;
	} else {
		if (focus_topic.style.display == "none") {
			focus_topic.style.display = "";
		}
		return false;
	}
}


// sleep time expects milliseconds
function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}


function callback(mutationsList, observer) {
	// console.log(mutationsList);
	if (mutationsList[0].type === 'attributes') {
		observer.disconnect();
		observer.observe(
			document.querySelector('.focus-topic-title'),
			{ attributes: true }
		);
		console.log('[callback from mutationObserverFocus] Focus hover changes, mutationObserverFocus oberserver changes.');
		changeFocus();
	} else if (mutationsList[0].type === 'childList') {
		//console.log(mutationsList.length);
		if (mutationsList[0].removedNodes.length > 0) {
			console.log('[callback from mutationObserverLength] Current Focus-topic number changes according to focus hover changes');
			changeFocus();
		} else {
			console.log('[callback from mutationObserverLength] Current Focus-topic number changes');
			loadMoreTopic(mutationsList);
		}
	}
}

// var mutationObserverFocus = new MutationObserver(callback);
var mutationObserverLength = new MutationObserver(callback);

function focusHoverMO() {
	console.log('Run function focusHoverMO');
	mutationObserverFocus.disconnect();
	var intv = setInterval(function () {
		var topic_title = document.querySelector('.focus-topic-title');
		if (topic_title == null) {
			return false;
		}
		//when element is found, clear the interval.
		clearInterval(intv);
        loadFocus();
		mutationObserverFocus.observe(
			topic_title,
			{ attributes: true }
		)
	}, 5);
	// mutationObserverL.observe(
	//     document.querySelector('.focus-topic-title'),
	//     {attributes: true}
	// )
}

function focusTopicAreaMO() {
	//loadFocus();
	console.log('Run function focusTopicAreaMO');
	var intv = setInterval(function () {
		var topic_title = document.querySelector('.focus-topic-title');
		if (topic_title == null) {
			return false;
		}
		//when element is found, clear the interval.
		clearInterval(intv);
		loadFocus();
	}, 5);
	mutationObserverLength.disconnect();
	mutationObserverLength.observe(
		document.querySelector('.focus-topic-topicArea'),
		{ childList: true }
	)
}

waitForKeyElements(".center>.center .center", loadHot);
waitForKeyElements("#1", loadReply);
// waitForKeyElements(".focus-topic-topicArea", loadFocus);
// waitForKeyElements(".focus-board-area", focusHoverMO);
waitForKeyElements(".focus-topic-topicArea", focusTopicAreaMO);


let endtime = new Date();
console.log("==> Script end.", endtime);
console.log("script load in", endtime.getTime() - starttime.getTime(), "ms");
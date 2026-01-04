// ==UserScript==
// @name         Highrise Task Manager
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  try to take over the world!
// @author       You
// @require      https://code.jquery.com/jquery-latest.min.js
// @match        https://*.highrisehq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/30352/Highrise%20Task%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/30352/Highrise%20Task%20Manager.meta.js
// ==/UserScript==


var TASKS = [],
	USERS = {};

(function() {
    'use strict';
	
	show_task_manager();
})();

function show_task_manager() {
	var outer = document.createElement('div');
	$('#dashboard_add_tasks').prepend(outer);
	$(outer).html('<h3>Overdue Tasks</h3>');
	$(outer).prop('id', 'tasks-outer');
	outer.style.cssText = 'position: relative; width: 100%; margin-bottom: 20px;';
	
	var inner = document.createElement('div');
	$(inner).prop('id', 'tasks-inner');
	inner.style.cssText = 'display: none';
	$(outer).append(inner);
	
	var users_div = document.createElement('div');
	$(users_div).prop('id', 'users_div');
	$(inner).append(users_div);
	
	var tasks_div = document.createElement('div');
	tasks_div.style.cssText = 'width: 200%; max-height: 400px; overflow-y: scroll; border-top: solid 1px black; border-bottom: solid 1px black;';
	$(tasks_div).prop('id', 'tasks-div');
	$(inner).append(tasks_div);
	
	var button = document.createElement('button');
	button.innerHTML = 'Get Tasks';
	button.style.cssText = 'width: 133px; padding: 5px 10px; color: #ffffff; background: #5086a0; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; border: solid 1px #317ea5; font-size: 13px; outline: none; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);';
	$(button).prop('id', 'tasks-btn');
	$(outer).append(button);
	$(button).on('click', function() {
		$(this).replaceWith('<h4 id="loading-text">Loading...</h4>');
		get_users();
	});
}

function get_users() {
	$.get('/users.xml', function(data) {
		var users = xmlToJson(data).users.user;
		for (var i in users) {
			if (users.hasOwnProperty(i)) {
				USERS[users[i].id['#text']] = users[i].name['#text'];
			}
		}
		get_tasks();
	});
}

function get_tasks() {
	$.get('/tasks/all.xml', function(data) {
		var tasks = xmlToJson(data).tasks.task;
		console.log(tasks);
		for (var i in tasks) {
			if (tasks.hasOwnProperty(i)) {
				var author = USERS[tasks[i]['owner-id']['#text']];
				if (author === undefined) {
					author = 'Unknown';
				}
				var note = tasks[i].body['#text'];
				var dueDate = Date.parse(tasks[i]['due-at']['#text']);
				var status = tasks[i].frame['#text'];
				var customerName = tasks[i]['subject-name']['#text'];
				var customerId = tasks[i]['subject-id']['#text'];
				
				if (TASKS[author] === undefined) {
					TASKS[author] = [];
				}
				if (status === 'overdue') {
					TASKS[author].push({
						'note': note,
						'dueDate': dueDate,
						'status': status,
						'customerName': customerName,
						'customerId': customerId
					});
				}
			}
		}
		display_overdue();
	});
}

function display_overdue() {
	var sorted = [];
	for (var i in TASKS) {
		if (TASKS.hasOwnProperty(i)) {
			sorted.push(i);
		}
	}
	sorted.sort();
	for (i in sorted) {
		if (sorted.hasOwnProperty(i)) {
			var button_container = document.createElement('div');
			button_container.style.cssText = 'width: 100%; margin-bottom: 4px;';
			var amount = TASKS[sorted[i]].length;
			var amount_display = document.createElement('div');
			amount_display.innerHTML = amount;
			amount_display.style.cssText = 'display: inline-block; width: 40px; background: red; padding: 5px 0; color: white; text-align: center; margin-right: -5px; border-radius: 4px;';
			$(button_container).append(amount_display);

			var button = document.createElement('button');
			button.innerHTML = sorted[i];
			$(button).val(sorted[i]);
			button.style.cssText = 'width: 133px; padding: 5px 10px; color: #ffffff; background: #5086a0; -webkit-border-radius: 4px; -moz-border-radius: 4px; border-radius: 4px; border: solid 1px #317ea5; font-size: 13px; outline: none; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);';
			$(button_container).append(button);
			if (amount > 0) {
				$('#users_div').append(button_container);
			}
			
			$(button).on('click', function() {
				$(this).parent().parent().find('button').css('background-color', '#5086a0').css('border-color', '#317ea5');
				$(this).css('background-color', 'black').css('border-color', 'black');
				show_users_tasks($(this).val());
			});
		}
	}
	$('#loading-text').toggle();
	$('#tasks-btn').toggle();
	$('#tasks-inner').toggle();
}

function show_users_tasks(user) {
	$('#tasks-div').html('');
	var tasks = TASKS[user];
	var items = Object.keys(tasks).map(function(key) {
		return [key, tasks[key]];
	});
	
	items.sort(function(a, b) {
		return a[1].dueDate - b[1].dueDate;
	});

	for (var i in items) {
		if (tasks.hasOwnProperty(i)) {
			try{
				var task = tasks[items[i][0]];
				var url_name = task.customerName.replace(/[^0-9a-z\s]/gi, '');
				url_name = url_name.replace(/ +/g, '-');
				var url = `https://wodc.highrisehq.com/companies/${task.customerId}-${url_name}`;
				var note_line = document.createElement('div');
				var date = new Date(task.dueDate);
				var formattedDate = `${(date.getUTCMonth() + 1)}-${date.getUTCDate()}-${date.getUTCFullYear()}`;
				$('#tasks-div').append(
					`<p class="note-line">${formattedDate} - <a href="${url}">${task.customerName}</a></p>`
				);
			}
			catch (e) {
				console.log(`Error: ${e}\n${tasks[i]}`);
			}
		}
	}
}

function xmlToJson(xml) {
	var obj = {};

	if (xml.nodeType == 1) {
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) {
		obj = xml.nodeValue;
	}

	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}
// ==UserScript==
// @name         reddit-saved-category
// @namespace    http://mindofthomas.com/
// @version      1.0.1
// @description  Change the category of saved Reddit posts more easily
// @author       MindOfThomas
// @grant        none
// @match        http://www.reddit.com/user/*/saved*
// @match        https://www.reddit.com/user/*/saved*
// @downloadURL https://update.greasyfork.org/scripts/19532/reddit-saved-category.user.js
// @updateURL https://update.greasyfork.org/scripts/19532/reddit-saved-category.meta.js
// ==/UserScript==
'use strict';
if(!$) {
	console.log("reddit-saved-category: can't find jQuery");
	return;
}
var saveQueue = [];
var selectedCategory = '';
var categories = ['no category'];
var modhash = '';
if(r.config.gold) {
	init();
}

function init() {
	jQuery.ajax({
		type: 'GET',
		url: '/api/me.json',
		dataType: 'json',
		contentType: 'application/x-www-form-urlencoded'
	}).done(function(response) {
		modhash = response.data.modhash;
		getCategories();
	});
}
function makeSaveBox() {
	var container = document.createElement('div');
	container.classList.add('spacer');

	var select = document.createElement('select');
	select.id = 'rsc-select';
	select.addEventListener('change', selectChange);

	var option, optionText;
	for(var i = 0; i < categories.length; i++) {
		option = document.createElement('option');
		optionText = document.createTextNode(categories[i]);
		option.appendChild(optionText);
		select.appendChild(option);
	}

	var button = document.createElement('input');
	button.type = 'submit';
	button.value = 'save post(s)';
	button.addEventListener('click', saveButton);

	container.appendChild(select);
	container.appendChild(button);
	$('div.spacer').has('span:contains("filter by category")').after(container);
}
function addCheckboxes() {
	var postId, likesContainer, div, input, self;
	$('div.thing.saved').each(function() {
		postId = $(this).attr('id').replace('thing_', '');
		likesContainer = $(this).find('div.midcol').has('div.arrow');
		div = document.createElement('div');
		div.classList.add('midcol');
		div.setAttribute('style', 'margin-left: 7px !important; margin-right: 7px !important;');
		div.style.textAlign = 'center';
		input = document.createElement('input');
		input.type = 'checkbox';
		input.id = postId;
		input.addEventListener('change', checkboxChange);
		div.appendChild(input);
		likesContainer.before(div);
	});
}
function checkboxChange(e) {
	if(e.target.checked && saveQueue.indexOf(e.target.id) <= -1) {
		saveQueue.push(e.target.id);
	} else if(!e.target.checked && saveQueue.indexOf(e.target.id) >= 0) {
		saveQueue.splice(saveQueue.indexOf(e.target.id), 1);
	}
}
function saveButton(e) {
	e.stopPropagation();
	e.preventDefault();
	save();
}
function save() {
	if(saveQueue.length <= 0) {
		return;
	}
	var theData = {'id': saveQueue[0]};
	if(selectedCategory !== 'no category') {
		theData['category'] = selectedCategory;
	}

	jQuery.ajax({
		type: 'POST',
		url: '/api/save',
		headers: {'x-modhash': modhash},
		data: theData,
		success: save
	});
	saveQueue.shift();
}
function getCategories() {
	jQuery.ajax({
		type: 'GET',
		url: '/api/saved_categories.json',
		dataType: 'json'
	}).done(function(response) {
		for(var i = 0; i < response.categories.length; i++) {
			categories.push(response.categories[i].category);
		}
		makeSaveBox();
		addCheckboxes();
	});
}
function selectChange() {
	var select = document.getElementById('rsc-select');
	selectedCategory = select.options[select.selectedIndex].text;
}
// ==UserScript==
// @name         GC - Custom Sidebar Links
// @namespace    https://greasyfork.org/users/319295
// @version      0.1.1
// @description  Add custom links to the sidebar
// @author       wibreth
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/462368/GC%20-%20Custom%20Sidebar%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/462368/GC%20-%20Custom%20Sidebar%20Links.meta.js
// ==/UserScript==

(function() {
	'use strict';
	/* globals $:false */

GM_addStyle(`#custom div label {
width: 380px;
display: flex;
align-items: baseline;
justify-content: space-between;
}

#custom div input[type=text] {
width: 300px;
flex-grow: 0;
}

#custom div > div > div {
border: 0;
padding: 0;
display: block;
}

.custom img {
max-height: 35px;
}`);


function populateDropdown() {
const linksList = GM_getValue('linkslist', []);
$('#delete-links-select').empty();
$('#delete-links-select').append('<option selected value="-1">Delete a custom link</option>');
for (let i = 0; i < linksList.length; i++) {
	$('#delete-links-select').append(`<option value="${i}">${linksList[i].name}</option>`);
}
}

function editSidebar() {
const html = `<h2 class="arrow" id="custom-header" data-id="custom">Custom Links <span style="float:right">↓</span></h2>
<div id="custom" class="sidebar_section" style="display: none;">
		<label>View as text links? <input type="checkbox" id="custom-text" checked=""></label><br>
		<select id="delete-links-select" name="deletelinks">
		</select>
		<input type="button" id="delete-links-btn" value="Delete">
		<div style="display: flex; flex-direction: column">
				<div>
				<div>
						<label>Name: <input type="text" id="custom-name" class="big-input mt-1" maxlength="100" value=""></label>
						<label>Image: <input type="text" id="custom-image" class="big-input mt-1" maxlength="250" value=""></label>
						<label>URL: <input type="text" id="custom-url" class="big-input mt-1" maxlength="250" value=""></label>
				</div>
				<input type="button" id="insert-link" value="Insert">
				</div>
		</div>
</div>`
;

$('#sidebarcss').after(html);
populateDropdown();

const textLinks = GM_getValue('linkstext', true);
if (!textLinks)
	$('#custom-text').prop('checked', false)

$('#delete-links-btn').click((e) => {
	const idx = parseInt($('#delete-links-select').val());
	let linksList = GM_getValue('linkslist', []);
	if (idx < 0 || !Number.isInteger(idx) || idx >= linksList.length) {
		alert('Cannot delete invalid link');
		return;
	}
	if (!confirm(`Are you sure you want to delete the link to ${$(`#delete-links-select option[value=${idx}]`).text()}?`)) {
		e.preventDefault();
		return;
}
	$(`#delete-links-select option[value=${idx}]`).remove();
	linksList.splice(idx, 1);
	GM_setValue('linkslist', linksList);

			addLinks();
});

$('#custom-text').change(function() {
	const textLinks = $(this).prop('checked');
	GM_setValue('linkstext', textLinks);

	addLinks();
});

$('#insert-link').click(() => {
	const name = $('#custom-name').val();
	const img = $('#custom-image').val();
	const url = $('#custom-url').val();

	if (!(name && url)) {
		alert('Cannot insert link. Please fill out name and url fields.');
		return;
	}

	let link = {
		'name': name,
		'image': img ? img : 'https://d2yr2ruk7u0bm3.cloudfront.net/images/tnt_alt_icon.gif',
		'url': url
	}

	let linksList = GM_getValue('linkslist', []);
	linksList.push(link);
	GM_setValue('linkslist', linksList);

	populateDropdown();
	addLinks();

	$('#custom-name').val('');
	$('#custom-image').val('');
	$('#custom-url').val('');
});

}

//removes and re-adds the custom links module on the sidebar
function addLinks() {
$('.custom').remove();


const linksList = GM_getValue('linkslist', []);
const textLinks = GM_getValue('linkstext', true);

$('#aio_sidebar').append(`<div class="custom"><strong class="aio-section-header">Custom Links</strong><div class="${textLinks ? 'aioTxt' : 'aioImg'}"></div></div>`);

for (const link of linksList) {
			const linkContent = textLinks ? link.name : `<img src="${link.image}">`;
	$('.custom .aioTxt, .custom .aioImg').append(`<div><a href="${link.url}" title="${link.name}">${linkContent}</a></div>`);
}

}


$('document').ready(() => {
addLinks();

if (window.location.href.includes('sidebar'))
	editSidebar();
});

})();
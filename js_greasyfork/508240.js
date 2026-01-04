// ==UserScript==
// @name         [GC] - Add Custom Links to Always
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @match        https://www.grundos.cafe/*
// @version      1.1
// @license      MIT
// @grant       GM.getValue
// @grant       GM.setValue
// @description   Originally written by wibreth, edited to make it async and work on iPhone.
// @author       Cupkait
// @icon         https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/508240/%5BGC%5D%20-%20Add%20Custom%20Links%20to%20Always.user.js
// @updateURL https://update.greasyfork.org/scripts/508240/%5BGC%5D%20-%20Add%20Custom%20Links%20to%20Always.meta.js
// ==/UserScript==



async function populateDropdown() {
	const linksList = await GM.getValue('linkslist', []);
	const deleteSelect = document.getElementById('delete-links-select');
	deleteSelect.innerHTML = '<option selected value="-1">Delete a custom link</option>';

	linksList.forEach((link, index) => {
		const option = document.createElement('option');
		option.value = index;
		option.textContent = link.name;
		deleteSelect.appendChild(option);
	});
}

async function editSidebar() {
	const html = `
		<h2 class="arrow" id="custom-header" data-id="custom">
			Custom Links <span style="float:right">↓</span>
		</h2>
		<div id="custom" class="sidebar_section" style="display: none;">
			<label>View as text links? <input type="checkbox" id="custom-text" checked=""></label><br>
			<select id="delete-links-select" name="deletelinks"></select>
			<input type="button" id="delete-links-btn" value="Delete">
			<div style="display: flex; flex-direction: column">
				<div>
					<div>
						<label>Name: <input type="text" id="custom-name" class="big-input mt-1" maxlength="100"></label>
						<label>Image: <input type="text" id="custom-image" class="big-input mt-1" maxlength="250"></label>
						<label>URL: <input type="text" id="custom-url" class="big-input mt-1" maxlength="250"></label>
					</div>
					<input type="button" id="insert-link" value="Insert">
				</div>
			</div>
		</div>
	`;
	document.querySelector('#sidebarcss').insertAdjacentHTML('afterend', html);
	await populateDropdown();

	const textLinks = await GM.getValue('linkstext', true);
	if (!textLinks) {
		document.getElementById('custom-text').checked = false;
	}

	document.getElementById('delete-links-btn').addEventListener('click', async function() {
		const idx = parseInt(document.getElementById('delete-links-select').value);
		let linksList = await GM.getValue('linkslist', []);
		if (idx < 0 || !Number.isInteger(idx) || idx >= linksList.length) {
			alert('Cannot delete invalid link');
			return;
		}
		if (!confirm(`Are you sure you want to delete the link to ${document.querySelector(`#delete-links-select option[value="${idx}"]`).textContent}?`)) {
			return;
		}
		document.querySelector(`#delete-links-select option[value="${idx}"]`).remove();
		linksList.splice(idx, 1);
		await GM.setValue('linkslist', linksList);
		addLinks();
	});

	document.getElementById('custom-text').addEventListener('change', async function() {
		const textLinks = this.checked;
		await GM.setValue('linkstext', textLinks);
		addLinks();
	});

	document.getElementById('insert-link').addEventListener('click', async function() {
		const name = document.getElementById('custom-name').value;
		const img = document.getElementById('custom-image').value || 'https://d2yr2ruk7u0bm3.cloudfront.net/images/tnt_alt_icon.gif';
		const url = document.getElementById('custom-url').value;

		if (!name || !url) {
			alert('Cannot insert link. Please fill out name and url fields.');
			return;
		}

		let link = { 'name': name, 'image': img, 'url': url };
		let linksList = await GM.getValue('linkslist', []);
		linksList.push(link);
		await GM.setValue('linkslist', linksList);

		await populateDropdown();
		addLinks();

		document.getElementById('custom-name').value = '';
		document.getElementById('custom-image').value = '';
		document.getElementById('custom-url').value = '';
	});
}

async function addLinks() {
	const customLinks = document.querySelectorAll('.custom');
	customLinks.forEach(link => link.remove());

	const linksList = await GM.getValue('linkslist', []);
	const textLinks = await GM.getValue('linkstext', true);

	const header = document.createElement('strong');

	linksList.forEach(link => {
		const linkDiv = document.createElement('div');
		const anchor = document.createElement('a');
		anchor.href = link.url;
		anchor.title = link.name;
		anchor.innerHTML = textLinks ? link.name : `<img style="max-height: 35px" src="${link.image}">`;
		linkDiv.appendChild(anchor);
    linkDiv.style.order="99";
    linkDiv.querySelector('img');
		document.querySelector('.always > .aioImg').append(linkDiv);
	});
}

(async function() {
	await addLinks();

	if (window.location.href.includes('sidebar')) {
		console.log("sidebar");
		await editSidebar();
	}
})();


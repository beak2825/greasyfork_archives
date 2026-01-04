// ==UserScript==
// @name         Bunkr Filter
// @version      1.2
// @description  Filter bunker images and videos by size and type
// @match        https://bunkr.is/a/*
// @match        https://bunkr.ru/a/*
// @match        https://bunkr.su/a/*
// @icon         https://bunkr.su/images/logo.svg
// @grant        none
// @namespace https://greasyfork.org/users/1030442
// @downloadURL https://update.greasyfork.org/scripts/460411/Bunkr%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/460411/Bunkr%20Filter.meta.js
// ==/UserScript==


const imageFormats = ['.gif', '.GIF', '.Gif', '.jpeg', '.Jpeg', '.JPEG', '.jpg', '.JPG', '.Jpg', '.png', '.PNG', '.Png', '.webp', '.WEBP', '.Webp'];
const videoFormats = ['.avi', '.AVI', '.Avi', '.flv', '.FLV', '.Flv', '.mkv', '.MKV', '.Mkv', '.mov', '.Mov', '.MOV', '.mp4', '.MP4', '.Mp4', '.webm', '.Webm', '.WEBM', '.WMV', '.wmv', '.Wmv', '.m4v', '.M4V', '.M4v'];

const imageBoxes = document.querySelectorAll('.grid-images_box a[href$="' + imageFormats.join('"], .grid-images_box a[href$="') + '"]');
const videoBoxes = document.querySelectorAll('.grid-images_box a[href$="' + videoFormats.join('"], .grid-images_box a[href$="') + '"]');
const otherBoxes = document.querySelectorAll('.grid-images_box a:not(' + Array.from(imageBoxes).map(box => `:is(${box.tagName.toLowerCase()}[href="${box.getAttribute('href')}"])`).concat(Array.from(videoBoxes).map(box => `:is(${box.tagName.toLowerCase()}[href="${box.getAttribute('href')}"])`)).join(', ') + ')');

const filtersBox = document.createElement('div');
filtersBox.style.cssText = 'display:flex;flex-direction:row;align-items:center;justify-content:center;gap:20px;padding:10px;';

let filtering = 'None';

if (imageBoxes.length > 0 && videoBoxes.length > 0 ||
	imageBoxes.length > 0 && otherBoxes.length > 0 ||
	videoBoxes.length > 0 && otherBoxes.length > 0) {
	const filterDropdown = document.createElement('select');
	filterDropdown.style.cssText = 'padding:5px;color:black;max-height:30px; max-width: 150px; border-radius:2px';

	const allOption = document.createElement('option');
	allOption.value = 'None'
	allOption.text = `Show All (${imageBoxes.length + videoBoxes.length + otherBoxes.length})`;
	filterDropdown.appendChild(allOption);

	if (imageBoxes.length > 0) {
		const imagesOption = document.createElement('option');
		imagesOption.value = 'Images'
		imagesOption.text = `Show Images (${imageBoxes.length})`;
		filterDropdown.appendChild(imagesOption);
	}

	if (videoBoxes.length > 0) {
		const videosOption = document.createElement('option');
		videosOption.value = 'Videos'
		videosOption.text = `Show Videos (${videoBoxes.length})`;
		filterDropdown.appendChild(videosOption);
	}

	if (otherBoxes.length > 0) {
		const otherOption = document.createElement('option');
		otherOption.value = 'Other'
		otherOption.text = `Show Other (${otherBoxes.length})`;
		filterDropdown.appendChild(otherOption);
	}

	filterDropdown.addEventListener('change', function() {
		filtering = this.value;
		filterBoxes();
	});

	const typeContainer = document.createElement('div')
	const typeContainerTitle = document.createElement('p')
	typeContainerTitle.innerText = 'Filter by Type'
	typeContainer.appendChild(typeContainerTitle)
	typeContainer.appendChild(filterDropdown)
	typeContainer.style.cssText = 'display: flex; flex-direction:column; align-items:center;border:2px solid white; padding:10px; border-radius:4px'
	filtersBox.appendChild(typeContainer);

}

let sizeFilter = 0;
const minSizeInput = document.createElement('input');
minSizeInput.type = 'number';
minSizeInput.min = '0';
minSizeInput.placeholder = 'size in MB';
minSizeInput.style.cssText = 'padding:5px;color:black; max-height:30px; max-width: 150px; border-radius:2px';
minSizeInput.addEventListener('change', () => {
	sizeFilter = minSizeInput.value;
	filterBoxes();
});

const sizeContainer = document.createElement('div');
const sizeContainerTitle = document.createElement('p')
sizeContainerTitle.innerText = 'Filter by Size'
sizeContainer.appendChild(sizeContainerTitle)
sizeContainer.appendChild(minSizeInput);
sizeContainer.style.cssText = 'display: flex; flex-direction:column; align-items:center;border:2px solid white; padding:10px; border-radius:4px'


function filterBoxes() {
	if (filtering === 'Videos') {
		videoBoxes.forEach(box => toggleView(box.parentElement.parentElement));
		imageBoxes.forEach(box => box.parentElement.parentElement.style.display = 'none');
		otherBoxes.forEach(box => box.parentElement.parentElement.style.display = 'none');
	} else if (filtering === 'Images') {
		imageBoxes.forEach(box => toggleView(box.parentElement.parentElement));
		videoBoxes.forEach(box => box.parentElement.parentElement.style.display = 'none');
		otherBoxes.forEach(box => box.parentElement.parentElement.style.display = 'none');
	} else if (filtering === 'Other') {
		otherBoxes.forEach(box => toggleView(box.parentElement.parentElement));
		imageBoxes.forEach(box => box.parentElement.parentElement.style.display = 'none');
		videoBoxes.forEach(box => box.parentElement.parentElement.style.display = 'none');
	} else {
		imageBoxes.forEach(box => toggleView(box.parentElement.parentElement));
		videoBoxes.forEach(box => toggleView(box.parentElement.parentElement));
		otherBoxes.forEach(box => toggleView(box.parentElement.parentElement));
	}
}

function toggleView(box) {
	const [sizeValue, sizeUnit] = box.children[1].children[1].textContent.trim().split(' ');
	const sizeInMB = convertToMB(parseFloat(sizeValue), sizeUnit);
	const show = sizeInMB >= sizeFilter;
	box.style.display = show ? '' : 'none';
}

function convertToMB(sizeValue, sizeUnit) {
	const multiplier = sizeUnit.toLowerCase() === 'gib' || sizeUnit.toLowerCase() === 'gb' ?
		1024 :
		sizeUnit.toLowerCase() === 'mib' || sizeUnit.toLowerCase() === 'mb' ?
		1 :
		sizeUnit.toLowerCase() === 'kib' || sizeUnit.toLowerCase() === 'kb' ?
		1 / 1024 :
		1;
	return sizeValue * multiplier;
}


filtersBox.appendChild(sizeContainer);
document.querySelector('.friends').appendChild(filtersBox);


// ==UserScript==
// @name         Erome Filter
// @version      1.0
// @description  Filter images and videos in Erome
// @match        https://www.erome.com/a/*
// @icon         https://www.erome.com/favicon.ico
// @grant        none
// @namespace    https://greasyfork.org/users/1030442
// @downloadURL https://update.greasyfork.org/scripts/460534/Erome%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/460534/Erome%20Filter.meta.js
// ==/UserScript==

const albumElement = document.querySelector('[id^="album_"]');
const videoDivs = albumElement.querySelectorAll('div > div > .video');
const imageDivs = albumElement.querySelectorAll('div > div > div > img.img-front');

if (videoDivs.length > 0 && imageDivs.length > 0) {
  const userInfoElement = document.querySelector('.user-info.text-right');
  const selectElement = document.createElement('select');
  const options = [
    { value: 'all', text: `Show All (${imageDivs.length + videoDivs.length})` },
    { value: 'images', text: `Show Images (${imageDivs.length})` },
    { value: 'videos', text: `Show Videos (${videoDivs.length})` },
  ];

  selectElement.addEventListener('change', function() {
    const selectedOption = this.value;
    if (selectedOption === 'images') {
      videoDivs.forEach(div => div.parentElement.parentElement.style.display = 'none');
      imageDivs.forEach(div => div.parentElement.parentElement.parentElement.style.display = '');
    }
    if (selectedOption === 'videos') {
      videoDivs.forEach(div => div.parentElement.parentElement.style.display = '');
      imageDivs.forEach(div => div.parentElement.parentElement.parentElement.style.display = 'none');
    }
    if (selectedOption === 'all') {
      imageDivs.forEach(div => div.parentElement.parentElement.parentElement.style.display = '');
      videoDivs.forEach(div => div.parentElement.parentElement.style.display = '');
    }
  });

  options.forEach(option => {
    const { value, text } = option;
    const optionElement = document.createElement('option');
    optionElement.value = value;
    optionElement.text = text;
    selectElement.appendChild(optionElement);
  });

  userInfoElement.prepend(selectElement);
}

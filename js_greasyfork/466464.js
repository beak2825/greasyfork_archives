// ==UserScript==
// @name         Grundo's Cafe Remember Training Selection
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Auto remembers and chooses the user's last selection on the training page on grundos.cafe.
// @author       Thornruler
// @match    https://www.grundos.cafe/island/training/?type=courses
// @match    https://grundos.cafe/island/training/?type=courses
// @match    https://www.grundos.cafe/pirates/academy/?type=courses
// @match    https://grundos.cafe/pirates/academy/?type=courses
// @match    https://www.grundos.cafe/island/fight_training/?type=courses
// @match    https://grundos.cafe/island/fight_training/?type=courses
// @icon     https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant    none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466464/Grundo%27s%20Cafe%20Remember%20Training%20Selection.user.js
// @updateURL https://update.greasyfork.org/scripts/466464/Grundo%27s%20Cafe%20Remember%20Training%20Selection.meta.js
// ==/UserScript==

// Base keys to store/retrieve selections
const BASE_COURSE_TYPE_KEY = 'courseTypeSelection';
const BASE_PET_KEY = 'petSelection';

// Incorporate the current URL into the keys
const COURSE_TYPE_KEY = `${BASE_COURSE_TYPE_KEY}_${window.location.pathname}`;
const PET_KEY = `${BASE_PET_KEY}_${window.location.pathname}`;

const courseTypeSelect = document.querySelector('select[name="course_type"]');
const petSelect = document.querySelector('select[name="pet"]');

// Check if we have a stored selection
const storedCourseType = localStorage.getItem(COURSE_TYPE_KEY);
const storedPet = localStorage.getItem(PET_KEY);

if(storedCourseType) {
    courseTypeSelect.value = storedCourseType;
}

if(storedPet) {
    petSelect.value = storedPet;
}

// Listen for changes and store the selected option
courseTypeSelect.addEventListener('change', function() {
    localStorage.setItem(COURSE_TYPE_KEY, courseTypeSelect.value);
});

petSelect.addEventListener('change', function() {
    localStorage.setItem(PET_KEY, petSelect.value);
});
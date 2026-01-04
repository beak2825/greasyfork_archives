// ==UserScript==
// @name        New script - yodayo.com
// @namespace   Violentmonkey Scripts
// @match       https://yodayo.com/tavern/*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 9/27/2023, 10:50:38 PM
// @downloadURL https://update.greasyfork.org/scripts/476213/New%20script%20-%20yodayocom.user.js
// @updateURL https://update.greasyfork.org/scripts/476213/New%20script%20-%20yodayocom.meta.js
// ==/UserScript==
setTimeout(() => {
    const element1 = document.querySelectorAll('main > section > div > *');
    const element2 = document.querySelector('div.absolute:nth-child(4)');

let elements = Array.from(element1);

elements.forEach(element => {
  console.log(element);
  element.style.maxHeight='90%';
})
  element2.style.maxHeight='90%';
}, 5000);
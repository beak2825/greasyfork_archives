// ==UserScript==
// @name           Room Creator 100,150,200,250
// @description    Room Creator 100,150,200,250 in Gartic
// @version        1.2
// @author         STRAGON
// @license        N/A
// @match          https://gartic.io/create
// @icon           https://see.fontimg.com/api/rf5/GO76G/ZTgwODFkODEyNTFiNGEwZmEzZGJjMTk2NjM2NWQ4NGYub3Rm/SDM/mitchel.png?r=fs&h=65&w=1000&fg=FF0000&bg=FFFFFF&tb=1&s=65
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x

// @downloadURL https://update.greasyfork.org/scripts/513209/Room%20Creator%20100%2C150%2C200%2C250.user.js
// @updateURL https://update.greasyfork.org/scripts/513209/Room%20Creator%20100%2C150%2C200%2C250.meta.js
// ==/UserScript==


const options = document.querySelector('select[name="players"]').querySelectorAll('option');

const newOptions = [
  { value: '250', text: '250' },
  { value: '200', text: '200' },
  { value: '150', text: '150' },
  { value: '100', text: '100' },
];

newOptions.forEach(option => {
  const newOption = document.createElement('option');
  newOption.value = option.value;
  newOption.text = option.text;
  options[options.length - 1].after(newOption);
});
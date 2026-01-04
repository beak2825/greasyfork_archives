// ==UserScript==
// @name         Тупая фигня, которая делает орбитар розовым с зайчиками
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Потребляйте кальций
// @author       Rawlique
// @match        *://orbitar.space/*
// @icon         https://orbitar.space/favicon.ico
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448931/%D0%A2%D1%83%D0%BF%D0%B0%D1%8F%20%D1%84%D0%B8%D0%B3%D0%BD%D1%8F%2C%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F%20%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D1%82%20%D0%BE%D1%80%D0%B1%D0%B8%D1%82%D0%B0%D1%80%20%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%D1%8B%D0%BC%20%D1%81%20%D0%B7%D0%B0%D0%B9%D1%87%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/448931/%D0%A2%D1%83%D0%BF%D0%B0%D1%8F%20%D1%84%D0%B8%D0%B3%D0%BD%D1%8F%2C%20%D0%BA%D0%BE%D1%82%D0%BE%D1%80%D0%B0%D1%8F%20%D0%B4%D0%B5%D0%BB%D0%B0%D0%B5%D1%82%20%D0%BE%D1%80%D0%B1%D0%B8%D1%82%D0%B0%D1%80%20%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%D1%8B%D0%BC%20%D1%81%20%D0%B7%D0%B0%D0%B9%D1%87%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8.meta.js
// ==/UserScript==

(function() {
	let root = document.documentElement;
	let html = document.querySelector('html');
	let body = document.querySelector('body');

	root.style.setProperty('--fgHardest', '#5C0D28');
	root.style.setProperty('--fgHarder', '#6E1F3B');
	root.style.setProperty('--fgHard', '#80314F');
	root.style.setProperty('--fg', '#924262');
	root.style.setProperty('--fgMedium', '#A45476');
	root.style.setProperty('--fgSoft', '#B76689');
	root.style.setProperty('--fgSofter', '#C9789D');
	root.style.setProperty('--fgSoftest', '#DB89B0');
	root.style.setProperty('--fgGhost', '#ED9BC4');
	root.style.setProperty('--fgAlmostInvisible', '#FFADD7');
	root.style.setProperty('--lowered', '#efdcde');
	root.style.setProperty('--bg', '#fcebed');
	root.style.setProperty('--elevated', '#fff6f7');
	root.style.setProperty('--primary', '#924262');
	root.style.setProperty('--primaryHover', '#fd3db0');
	root.style.setProperty('--primaryGhost', '#f5b0d9');
	root.style.setProperty('--link', '#c9789d');
	root.style.setProperty('--linkHover', '#fd3db0');
	root.style.setProperty('--linkVisited', '#c186a2');
	root.style.setProperty('--linkGhost', '#f5b0d9');

	body.style.backgroundImage = 'url(https://idiod.video/0nd5la.png)';
	html.style.backgroundImage = 'url(https://idiod.video/0nd5la.png)';

    let numTries = 0;
    let interval = setInterval(function(){
        numTries += 1;
        if(numTries > 10){
            clearInterval(interval);
        }
        let juj = document.querySelector('[class^="App_monster"] > svg');
        if (juj) {
            juj.setAttribute('style', 'fill: #DB89B0');
        }
    }, 100);
})();
// ==UserScript==
// @name         Любой уровень в евоворлд!
// @name:en      Any level in evoworld!
// @namespace    http://tampermonkey.net/
// @version      2.0.6
// @description  Введи свой желаемый уровень и наслаждайся!
// @description:en enter your level wich you want and enjoy!
// @author       ChyppitauCoder
// @match        https://evoworld.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=evoworld.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481682/%D0%9B%D1%8E%D0%B1%D0%BE%D0%B9%20%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C%20%D0%B2%20%D0%B5%D0%B2%D0%BE%D0%B2%D0%BE%D1%80%D0%BB%D0%B4%21.user.js
// @updateURL https://update.greasyfork.org/scripts/481682/%D0%9B%D1%8E%D0%B1%D0%BE%D0%B9%20%D1%83%D1%80%D0%BE%D0%B2%D0%B5%D0%BD%D1%8C%20%D0%B2%20%D0%B5%D0%B2%D0%BE%D0%B2%D0%BE%D1%80%D0%BB%D0%B4%21.meta.js
// ==/UserScript==

alert('en:press key j to enter level | ru:нажмите английскую j для ввода уровня')

document.addEventListener('keydown', function(event) {

    // if key is pressed do alert to input level
    if(event.key === 'j') {
        var level = prompt('Enter your level | Введите ваш уровень: ');

    // test on boy, witch dont wna script
    if(level === null) {
        console.log('you input nothing| Вы ничего не ввели');
    } else {

         // script
         game['me']['level'] = level;
        }
    }
});
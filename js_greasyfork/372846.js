// ==UserScript==
// @name         Метки привязанные к клавишам
// @version      0.5
// @description  Метка выставляется при нажатии клавиши на NUMPADе; 0 - яндекс; 1 - шашки на кузове; 2 - шашки на крыше; 4 - грязный кузов
// @author       Gusev
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @include	 https://taximeter-admin.taxi.yandex-team.ru/dkk/priority
// @grant        none
// @namespace    https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/372846/%D0%9C%D0%B5%D1%82%D0%BA%D0%B8%20%D0%BF%D1%80%D0%B8%D0%B2%D1%8F%D0%B7%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BA%20%D0%BA%D0%BB%D0%B0%D0%B2%D0%B8%D1%88%D0%B0%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/372846/%D0%9C%D0%B5%D1%82%D0%BA%D0%B8%20%D0%BF%D1%80%D0%B8%D0%B2%D1%8F%D0%B7%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%BA%20%D0%BA%D0%BB%D0%B0%D0%B2%D0%B8%D1%88%D0%B0%D0%BC.meta.js
// ==/UserScript==

addEventListener('keydown', function(event){
	if(event.keyCode === 96){document.querySelector('input[value="yandex"]').parentNode.click()}
});
addEventListener('keydown', function(event){
	if(event.keyCode === 100){document.querySelector('input[value="gryaz"]').parentNode.click()}
});
addEventListener('keydown', function(event){
	if(event.keyCode === 97){document.querySelector('input[value="checkers_car"]').parentNode.click()}
});
addEventListener('keydown', function(event){
	if(event.keyCode === 98){document.querySelector('input[value="checkers_roof"]').parentNode.click()}
});
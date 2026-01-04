// ==UserScript==
// @name         Удаление временных блоков из интерфейса
// @version      0.1
// @description  ...
// @author       Gusev
// @include      https://taximeter-admin.taxi.yandex-team.ru/dkk
// @grant        none
// @namespace https://greasyfork.org/users/191824
// @downloadURL https://update.greasyfork.org/scripts/369622/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B8%D0%B7%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/369622/%D0%A3%D0%B4%D0%B0%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B2%D1%80%D0%B5%D0%BC%D0%B5%D0%BD%D0%BD%D1%8B%D1%85%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BE%D0%B2%20%D0%B8%D0%B7%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D1%84%D0%B5%D0%B9%D1%81%D0%B0.meta.js
// ==/UserScript==

var ul = document.querySelector('.btn-group').children[1];
var length = ul.children.length;
for(var i=0; i<length-1; i++){
	ul.children[0].remove()
};
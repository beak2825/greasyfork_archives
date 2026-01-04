// ==UserScript==
// @name         tj creature search
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lalala portal
// @author       omne
// @match        https://www.heroeswm.ru/map.php*
// @match        https://my.lordswm.com/map.php*
// @match        https://www.lordswm.com/map.php*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524416/tj%20creature%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/524416/tj%20creature%20search.meta.js
// ==/UserScript==

(function() {
    'use strict';
	let factionImg = {"Рыцарей":1, "Некромантов":2, "Магов":3, "Эльфов":4, "Варваров":5, "Темных эльфов":6, "Демонов":7, "Гномов":8, "Степных варваров":9, "Фараонов":10};
    let searchButton = document.createElement('div');
    searchButton.innerHTML = "поиск";
    searchButton.addEventListener("click", get_data, false);
    document.querySelector("#hwm_map_objects_and_buttons").before(searchButton);
	function get_data() {
        let manufactures = document.querySelectorAll(".map_obj_table_hover");
		for (let i = 0; i < manufactures .length; i++) {
			let id = manufactures[i].innerHTML.match(/id=([0-9]+)/)[1];
			GM_xmlhttpRequest({
				method: "GET",
				url: location.origin + "/object-info.php?id=" + id,
				onload: function(response) {
					let faction = response.responseText.match(/Похоже, что тут скрывается один из отрядов <i>([^<]+)/)[1];
					let frImg = document.createElement('img');
					frImg.setAttribute('src', '/i/f/r' + factionImg[faction] + '.png');
					frImg.setAttribute('align', 'absmiddle');
					frImg.style.width = "15px";
					manufactures[i].firstElementChild.firstElementChild.prepend(frImg);
				}
			});
		}
	}
})();
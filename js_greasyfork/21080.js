// ==UserScript==
// @name			rsload auto link fix
// @name:ru			rsload авто фикс ссылок
// @namespace		rsload.net
// @version			0.2
// @description		auto changes media get links to direct
// @description:ru	автоматически изменяет ссылки с media get на прямые
// @author			Madzal
// @run-at			document-start
// @match			https://rsload.net/*/*
// @match			http://rsload.net/*/*
// @homepage		http://rsload.net
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/21080/rsload%20auto%20link%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/21080/rsload%20auto%20link%20fix.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", function myscript() {
	if (document.getElementById("link_flag")) {
        var link_temp = document.getElementById("link_temp").value;
        var link_number = document.getElementById("link_number").value;
        var links = link_temp.split(";");
        var numbers = link_number.split(";");
        var link_array = document.getElementsByTagName("a");
        for (var i = 0; i < link_array.length; i++) {
            for (var j = 0; j <= numbers.length; j++) {
                if (i == parseInt(numbers[j])) {
                    link_array[i].href = links[j];
                    link_array[i].rel = "";
                }
            }
        }

        document.getElementById("link_temp").value = link_temp;
        document.getElementById("link_number").value = link_number;

        document.getElementById("link_flag").checked = false;
        var node = document.querySelector('div[style="display:block;"]');
        node.parentNode.removeChild(node);
        var node2 = document.getElementsByTagName('center')[0];
        node2.parentNode.removeChild(node2);
    }
}, false);
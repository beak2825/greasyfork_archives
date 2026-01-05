// ==UserScript==
// @name       Os Piratas
// @description drive dos piratas
// @namespace   https://os-piratas.slack.com
// @namespace    https://greasyfork.org/users/11005
// @include     https://www.waze.com/pt-BR/editor/*
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/20393/Os%20Piratas.user.js
// @updateURL https://update.greasyfork.org/scripts/20393/Os%20Piratas.meta.js
// ==/UserScript==

 var b = document.getElementById("user-box");
 var a = document.createElement('div');
  a.id = 'UCME_btn';
  a.onclick = msg3;
  a.innerHTML = '<input type="button" id="_UCME_btn" value="Drive" /><hr>';
	b.appendChild(a);

    function msg3() {
          window.open('https://drive.google.com/open?id=0B0Lrss5N3qIoczQ2WnN3XzFya1E');
}
 
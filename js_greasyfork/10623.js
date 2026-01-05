// ==UserScript==
// @name        RuTracker - Скачать со страниц поиска
// @namespace   memmes
// @description Позовляет скачивать со страницы поиска, нет необходимости открывать страницу с ним. (экономит время, особенно при массовой скачке) 
// @include     http://rutracker.org/forum/tracker.php*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10623/RuTracker%20-%20%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D1%81%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/10623/RuTracker%20-%20%D0%A1%D0%BA%D0%B0%D1%87%D0%B0%D1%82%D1%8C%20%D1%81%D0%BE%20%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B8%D1%86%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%D0%B0.meta.js
// ==/UserScript==


var e = document.getElementsByClassName('t-tags');
for(var em=0; em<e.length; em++){

  if(e[em].id){
      if(1==1){
     var asd =document.createElement('td');
     asd.className="row1 t-cheboxs";
     asd.innerHTML+='<input type="checkbox">';
     e[em].parentElement.parentElement.insertBefore(asd,e[em].parentElement.parentElement.children[0])
  }
    var rid= e[em].id.replace('tg-','');
  e[em].parentElement.parentElement.innerHTML+=
  "<td class='row4 small nowrap'><a href='javascript:  	var a= \"http://dl.rutracker.org/forum/dl.php?t="+rid+"\"; var c={form_token:10}; d = document.createElement(\"form\"); d.setAttribute(\"action\", a); d.setAttribute(\"method\", \"post\"); d.setAttribute(\"target\", c.target || \"_self\"); for (var e in c) {var f = document.createElement(\"input\"); f.setAttribute(\"type\", \"hidden\"); f.setAttribute(\"name\", e); f.setAttribute(\"value\", c[e]); d.appendChild(f); }; document.body.appendChild(d); d.submit();' onclick=' post2url(\"http://dl.rutracker.org/forum/dl.php?t="+rid+"\");  return false;	'>скачать</a></td>";
}
 }


var asd =document.createElement('th');
 asd.innerHTML+='<th class="{sorter: \'text\'} header"><b class="tbs-text">Скачать</b></th>';
var tddid=document.getElementById("tor-tbl").children[0].children[0].appendChild(asd)


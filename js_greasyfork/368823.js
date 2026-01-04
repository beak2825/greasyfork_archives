// ==UserScript==
// @name MalgraphToXML
// @namespace Morimasa
// @author Morimasa
// @include  https://graph.anime.plus/*/list,anime
// @grant none
// @version 1.1
// @description Makes XML from graph.anime.plus animelist to import elsewhere.
// @downloadURL https://update.greasyfork.org/scripts/368823/MalgraphToXML.user.js
// @updateURL https://update.greasyfork.org/scripts/368823/MalgraphToXML.meta.js
// ==/UserScript==

function MakeAnimeXML(id, title, status, score){
  var statuses=["","Watching","Completed","On-Hold","Plan to Watch", "Dropped"];
  var xml=`<anime><series_animedb_id>${id}</series_animedb_id><series_title><![CDATA[${title}]]></series_title><my_watched_episodes>1</my_watched_episodes><my_start_date>0000-00-00</my_start_date><my_finish_date>0000-00-00</my_finish_date><my_score>${score}</my_score><my_status>${statuses[status]}</my_status></anime>`;
  return xml;
  }
function MakeXML(){
  var tr=document.getElementsByClassName("tablesorter")[0].getElementsByTagName("tr");
  var xml="<animelist>";
  for (var i=1;i<tr.length;i++){
    var status=tr[i].getElementsByClassName("status")[0].getAttribute("data-sorter");
    var id=tr[i].getElementsByClassName("title")[0].getElementsByTagName("a")[0].getAttribute("href").split("/")[4];
    var title=tr[i].getElementsByClassName("title")[0].getAttribute("data-sorter");
    var score=tr[i].getElementsByClassName("score")[0].getAttribute("data-sorter");
    xml+=MakeAnimeXML(id, title, status, score);
  }
  xml+="</animelist>";
  return xml
}
var e = document.getElementsByClassName("list")[0];
var textarea = document.createElement("textarea");
textarea.style.width='600px';
textarea.value=MakeXML();
e.insertAdjacentElement('afterbegin', textarea);

// ==UserScript==
// @name		REAL REC
// @description	       REC
// @author       by 太原FC
// @include		*trophymanager.com/players/*
// @exclude		*trophymanager.com/players/
// @exclude		*trophymanager.com/players/compare
// @exclude		*trophymanager.com/players/compare/
// @exclude		*trophymanager.com/players/compare/*
// @version             2023120501
// @namespace https://greasyfork.org/users/29133
// @downloadURL https://update.greasyfork.org/scripts/29133/REAL%20REC.user.js
// @updateURL https://update.greasyfork.org/scripts/29133/REAL%20REC.meta.js
// ==/UserScript==

///REC

var i = 0;
var title = document.getElementsByTagName('head') [0];
var myscript = document.createElement('script');
myscript.type = 'text/javascript';
myscript.innerHTML = 'function getDetail(){ \n';
myscript.innerHTML += 'if ("i" > 0) {\n';
myscript.innerHTML += 'alert("!");\n';
myscript.innerHTML += 'return false; } \n';
myscript.innerHTML += 'var isGK= false; \n';
myscript.innerHTML += 'if(document.getElementsByClassName("favposition long")[0].innerHTML.indexOf("gk")>0)isGK=true; \n';
myscript.innerHTML += 'var gettr2 = $(".float_left&.zebra");\n';
myscript.innerHTML += 'var clubid = new String(gettr2[0].getElementsByTagName("a")[0].getAttribute("club_link")).replace(/,/g, ""); \n';
myscript.innerHTML += 'var player_id_str = new String(player_id);\n';
// start ajax
myscript.innerHTML += '$.post("https://trophymanager.com/ajax/players_get_select.ajax.php",{type:"change",club_id:clubid},function(data){\n';
myscript.innerHTML += 'if(data != null){\t\n';
myscript.innerHTML += '$.each(data.post,function(idx,item){ \n';
myscript.innerHTML += 'if(player_id_str==idx){ \t\n';
myscript.innerHTML += 'var skilltable = $(".skill_table&.zebra");\n';
myscript.innerHTML += 'var skilltbaletr =  skilltable[0].getElementsByTagName("tr");\n';
myscript.innerHTML += 'var recnew =  Number(0.5*(item.rec-2)/1.5);\n';
myscript.innerHTML += 'gettr2[0].getElementsByTagName("td")[5].innerHTML+="" + recnew.toFixed(3) ;\n';
myscript.innerHTML += ' }} )}},"json");\n';
//end ajax
myscript.innerHTML += 'i++;\n';
myscript.innerHTML += '}\n';
title.appendChild(myscript);
var h = document.getElementsByTagName('h3') [1];
h.innerHTML = '<a href="javascript:getDetail()" class="magnify" ><font color="white">' + h.innerHTML + '</font></a>';
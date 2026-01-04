// ==UserScript==
// @name        Animesub.info website enhancement (ANSI)
// @namespace   Violentmonkey Scripts
// @match       *://animesub.info/*
// @grant       none
// @version     1.0.1
// @author      urbi
// @description 24.09.2021
// @downloadURL https://update.greasyfork.org/scripts/432891/Animesubinfo%20website%20enhancement%20%28ANSI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432891/Animesubinfo%20website%20enhancement%20%28ANSI%29.meta.js
// ==/UserScript==


// Buduj alfabet
    const alfabet = [];
    alfabet.push({"url":"katalog.php?S=9","name":"#"});
    alfabet.push({"url":"katalog.php?S=A","name":"A"});
    alfabet.push({"url":"katalog.php?S=B","name":"B"});
    alfabet.push({"url":"katalog.php?S=C","name":"C"});
    alfabet.push({"url":"katalog.php?S=D","name":"D"});
    alfabet.push({"url":"katalog.php?S=E","name":"E"});
    alfabet.push({"url":"katalog.php?S=F","name":"F"});
    alfabet.push({"url":"katalog.php?S=G","name":"G"});
    alfabet.push({"url":"katalog.php?S=H","name":"H"});
    alfabet.push({"url":"katalog.php?S=I","name":"I"});
    alfabet.push({"url":"katalog.php?S=J","name":"J"});
    alfabet.push({"url":"katalog.php?S=K","name":"K"});
    alfabet.push({"url":"katalog.php?S=L","name":"L"});
    alfabet.push({"url":"katalog.php?S=M","name":"M"});
    alfabet.push({"url":"katalog.php?S=N","name":"N"});
    alfabet.push({"url":"katalog.php?S=O","name":"O"});
    alfabet.push({"url":"katalog.php?S=P","name":"P"});
    alfabet.push({"url":"katalog.php?S=Q","name":"Q"});
    alfabet.push({"url":"katalog.php?S=R","name":"R"});
    alfabet.push({"url":"katalog.php?S=S","name":"S"});
    alfabet.push({"url":"katalog.php?S=%A6","name":"Ś"});
    alfabet.push({"url":"katalog.php?S=T","name":"T"});
    alfabet.push({"url":"katalog.php?S=U","name":"U"});
    alfabet.push({"url":"katalog.php?S=V","name":"V"});
    alfabet.push({"url":"katalog.php?S=W","name":"W"});
    alfabet.push({"url":"katalog.php?S=X","name":"X"});
    alfabet.push({"url":"katalog.php?S=Y","name":"Y"});
    alfabet.push({"url":"katalog.php?S=Z","name":"Z"});

// Dodaj alfabet
    document.getElementsByClassName("TabBodr")[0].innerHTML += '<div class="alfabet"></div>';
    for (var i=0; i<alfabet.length;i++){
    document.getElementsByClassName("alfabet")[0].innerHTML += '<a class="KatWlkLtr" href="'+ alfabet[i].url +'">'+ alfabet[i].name + '</a>';
    }

// Dodaj wyszukiwarkę
    document.getElementsByClassName("TabBodr")[0].innerHTML += '\
<div class="wyszukiwarka">\
<form action="szukaj.php" method="GET">\
<div class="search">\
<img class="lupka" src="https://cdn1.iconfinder.com/data/icons/jumpicon-basic-ui-line-1/32/-_Magnifier-Search-Zoom--20.png">\
<input class="input-search" type="text" name="szukane" title="Tytuł szukanych napisów"></input>\
</div>\
<div></p>Jeśli szukasz napisów do konkretnego odcinka dopisz na końcu jego numer, np: "Naruto ep01".<p></div>\
<div class="wybor">w tytule:	<select name="pTitle" style="font-size:12px;">\
<option value="org">Oryginalnym</option>\
<option value="en">Angielskim</option>\
<option value="pl">Polskim</option></select>\
<span> lub <a href="http://animesub.info/szukaj.php?ZW=0"> zaawansowane szukanie</a></span></div></form>\
</div>';

// Edytuj style
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle(`
.TabBodr{
background: url(http://animesub.info/pics/zolty/tlo.gif);
}
.LinkMG {
font-size:18px;
}
.wyszukiwarka{
margin:5px 0;
}
.wybor{
margin-top: 10px;
font-size:12px;
}
.lupka{
margin-top:5px;
position:absolute;
}
.search{
margin:0 auto;
border:1px solid #dfe1e5;
border-radius:24px;
height:30px;
box-shadow:none;
width:584px;
background-color:#fff;
}
.input-search{
font-size:14px;
width:550px;
height:30px;
padding-left:25px;
margin-top:0px;
border:none;
}
.search:hover{
box-shadow:0 1px 6px rgba(32,33,36,.28)
}
*:focus {
outline:none;
}
.favicon{
margin-left:5px;
width:15px;
height:15px;
`);

// Usuń wyszukiwarkę na SG
document.querySelector('table.TabMain > tbody > tr > td > table > tbody > tr > td:nth-child(3) > table').remove();
  
// Usuń wyszukiwarkę na wynikach wyszukiwania z wyjątkiem osobnych podstron wyszukiwania
if (! /szukaj.php\?ZW=/.test(window.location.href)){
  var szukajWyniki = document.querySelector('table.TabMain > tbody > tr > td > table > tbody > tr > td > center');
  if (szukajWyniki){
        szukajWyniki.classList.add('sprawdź');
        document.querySelector('table.TabMain > tbody > tr > td > table > tbody > tr > td > center').remove();
  }
}

// Usuń pasek menu
document.querySelectorAll('table.TabMG > tbody > tr')[0].remove();

// Usuń przerwę pod menu
document.querySelectorAll('body > center > br')[0].remove();

// Dodaj link forum do sidebar
var forum = document.querySelector('table.TabMain>tbody>tr>td>table>tbody>tr>td>table:nth-child(6)')
var forumLink = ('<tr><td height="1"></td></tr><tr><td class="MBW"><a href="http://animesub.info/forum/" class="MBL"><strong>FORUM</strong></a></td></tr>');
forum.innerHTML += forumLink;


// Dodaj linki do serwisów zewnętrznych
var pobierzTitle = document.querySelectorAll("table.Napisy>tbody>tr.KNap:nth-child(1)>td:nth-child(1)")
var czystyTitle =[];
for (i in pobierzTitle){
  if (pobierzTitle[i].innerHTML !== undefined)
    {
      czystyTitle.push(pobierzTitle[i] = pobierzTitle[i].innerHTML.replace(/\sep.*|!|:|\.|,/g,' '))
	}
}

var pobierzAutora = document.querySelectorAll("table.Napisy>tbody>tr.KNap:nth-child(2)>td:nth-child(2)")
var czystyAutor =[];
var autorLink =[];
var autorLink2 =[];
for (i in pobierzAutora){
  if (pobierzAutora[i].innerHTML !== undefined)
    {
      czystyAutor.push(pobierzAutora[i].innerText.replace(/\~|#/,''))
      autorLink.push('http://animesub.info/szukaj.php?pUdostepnil='+czystyAutor[i]+'&szukane='+czystyTitle[i]+'&pTitle=org')
      autorLink2.push('http://animesub.info/szukaj.php?pAutor='+czystyAutor[i]+'&szukane='+czystyTitle[i]+'&pTitle=org')
      
	}
}


var napisy = document.querySelectorAll("table.Napisy>tbody>tr.KKom>td:nth-child(1)");
    for ( i in napisy) {

 napisy[i].innerHTML += '<div class="anidb"><a href="https://anidb.net/search/anime/?adb.search=' + czystyTitle[i] + '&do.search=1&entity.animetb=1">Info w AniDB</a><img class="favicon" src="data:image/ico;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcElEQVQ4jWNgGBDAEfIfjjEECGGo+r37DqIasHffQTiGKUYWQxYn6AKYYnRNyOIIF+CxDZcBqF4gYBNRBlDmAlJjAVcgnm4wQsHIinDKIScMbJqwsVH4WA3AYiBpLsBhAPEuoMQLFAUivoyDO/oYGACSRnb21+zQxgAAAABJRU5ErkJggg=="></div>';
 napisy[i].innerHTML += '<div class="mal"><a href="https://myanimelist.net/anime.php?q=' + czystyTitle[i] + '&cat=anime">Info w MAL</a><img class="favicon" src="data:image/ico;base64,AAABAAEAMDAAAAEAIACoJQAAFgAAACgAAAAwAAAAYAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAQAAAAGiUS4VolEuh6JRLtOiUS77olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLvWiUS7PolEug6JRLhUAAAABAAAAAQAAAAEAAAABAAAAAaJRLlWiUS7zolEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLvOiUS5TAAAAAQAAAAEAAAABolEuU6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEuUwAAAAGiUS4XolEu8aJRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu8aJRLheiUS6DolEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLoeiUS7RolEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLtGiUS75olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLvOiUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/o1Iw/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/2bep/9Sunf+lVjX/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+vaUv//vz8///////w4t3/tndb/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/8WTff/s3NX/7NzV/+zc1f/fxLj/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/+zc1f/s3NX/7NzV/+zc1f+4el//olEu/6JRLv/auqz/////////////////8ubh/6JSL/+iUS7/olEu/8WTff/s3NX/7NzV/+zc1f/bu67/olEu/6JRLv/Sq5r/7NzV/+zc1f/s3NX/7NzV/+zc1f/s3NX/7NzV/+zc1f/GlH7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu//////////////////////+9hGv/olEu/6ZZOP/79/X/////////////////yZmF/6JRLv+iUS7/olEu/86jkP/////////////////p1s7/olEu/6JRLv/ewrX////////////////////////////////////////////n08r/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu//////////////////////+9hGv/olEu/8GMdP/////////////////8+vj/p1s6/6JRLv+iUS7/olEu/86jkP/////////////////p1s7/olEu/6JRLv/ewrX////////////////////////////////////////////9/Pv/p1s6/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu//////////////////////+9hGv/olEu/9Wxov/////////////////q2ND/olEu/6JRLv+iUS7/olEu/86jkP/////////////////p1s7/olEu/6JRLv/ewrX/////////////////+/f1//Po4//z6OP/8+jj//Po4//z6OP/vYNr/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu//////////////////////+9hGv/olEu/+PLwf/////////////////cva//olEu/6JRLv+iUS7/olEu/86jkP/////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/6JRLv+iUS7/s3BU/6JRLv+iUS7/olEu//////////////////////+9hGv/olEu/+nVzf/////////////////lz8X/x5eC/8eXgv/Hl4L/x5eC/+HIvf/////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/6JRLv/CjHX//Pn4/7NwVP+iUS7/olEu//////////////////////+9hGv/olEu/+nVzf/////////////////////////////////////////////////////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/olEu/69qTP/69fT///////Dk3v+mWTj/olEu//////////////////////+9hGv/olEu/+LIvf/////////////////////////////////////////////////////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/pVY0/+3e1//////////////////ewbT/olEu//////////////////////+9hGv/olEu/9q6rP/////////////////////////////////////////////////////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////v4Nr/2Leo////////////////////////////x5aB//////////////////////+9hGv/olEu/8iZhP//////////////////////zKCN/8eXgv/Hl4L/x5eC/+HIvf/////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////8+vj/////////////////////////////////+/j3//////////////////////+9hGv/olEu/65oSv///v7/////////////////y52K/6JRLv+iUS7/olEu/86jkP/////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP////////////////////////////////////////////////////////////////////////////////+9hGv/olEu/6JRLv/o08v/////////////////+vXz/7FsT/+iUS7/olEu/86jkP/////////////////p1s7/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////////////////////58/H/xZN9//79/f////////////////////////////////+9hGv/olEu/6JRLv+4e2D///7+//////////////////jx7//BinP/o1Iw/8KNdv/m0cf/5tHH/+bRx//Ws6P/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////////////////////BjHT/olEu/9OsnP////////////////////////////////+9hGv/olEu/6JRLv+iUS7/17Ok////////////////////////////9ezo/9/Dt//VsaH/1K6d/9Sunf/Urp3/uHpf/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP///////////////////////////9u8r/+iUS7/olEu/6RUMv/r2dL///////////////////////////+9hGv/olEu/6JRLv+iUS7/o1Mw/9m4qv//////////////////////////////////////////////////////uHle/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP//////////////////////8eXg/6ZZOP+iUS7/olEu/6JRLv+uaEr/+vX0//////////////////////+9hGv/olEu/6JRLv+iUS7/olEu/6JRLv/ImYT/+fTy///////////////////////////////////////48/D/o1Mw/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/86jkP/////////////////9+/r/tXRY/6JRLv+iUS7/olEu/6JRLv+iUS7/w495//////////////////////+9hGv/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/qF08/8qciP/m0cf/+fTy///////////////////////gxLn/olEu/6JRLv/ewrX/////////////////3sK1/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6VWNf+oXTz/qF08/6hdPP+nWzn/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6hdPP+oXTz/qF08/6hdPP+kVDL/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6dbOf+oXTz/qF08/6hdPP+lVzX/olEu/6JRLv+mWTf/qF08/6hdPP+oXTz/plk3/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS75olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLvmiUS7RolEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLtOiUS6DolEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLoeiUS4VolEu8aJRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu8aJRLhcAAAABolEuU6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEuUwAAAAEAAAABAAAAAaJRLlOiUS7xolEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLvGiUS5TAAAAAQAAAAEAAAABAAAAAQAAAAGiUS4VolEuh6JRLtOiUS75olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLv+iUS7/olEu/6JRLvmiUS7RolEug6JRLhUAAAABAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="></div>';
 napisy[i].innerHTML += '<div class="anilist"><a href="https://anilist.co/search/anime?search=' + czystyTitle[i] + '">Info w AniList</a><img class="favicon" src="data:image/ico;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAD5UExURRkhLRkhLRkhLRkhLUxpcRkhLRkhLRkhLRkhLRkhLRkhLRkhLRkhLRkhLf///v///xgfLACq/wCs/xQdKgN4sfv7+wCo/A1Pc6irrwR1rvf3+GZrdKCjp6WorRkfKv39/QVzqmRpcUpQWuHi4zpBSygvO5WZnjE3Qtzd3xAYJfHy8uXm5yW4/+r3/hFAXX6DiQR9uQZupHd7grCzt25zelNYYsvN0Pb8/2XM/8zv/wmx/xkfKTy//3zU/yIqNQR5s4qNkxUwQ8DCxrq8vyxAUF1iat7z/mGUsAdikqTU7luPrtLT1U7G/4zY/tHT1avj/hONyr/p/rXm/lS/nxsAAAANdFJOU/ua3pYAfRAOd9nd4J6x3JfpAAABaUlEQVQ4y4WTh1LCQBCGDw0B1OQud4IhCakUKaJIb/be9f0fxivRgeESvskwyew3+yfLHlBy+QLQpIBCXlVAbjehzJWMCvIpdWpkQUFLZQ+AdGGljgQuvdxV479erTuOU7978v1eF0kEcgopxccSxtiXCRc3UKc8lwwDH0oiSNjiwkMnSbjidd2byAVUGwlB/8RSgQxpgmdR4aQj71CHOmxVmDGRCaj2SoWP8Jjm/GCJQO4tKjiaCXmGJMKhFSto2kWasdwUUIP2hu2wEbap+D3bEIjN3s6Kooh/x2IzwuRDoP8FH8WyPJ+7DBQLqBrFUxJMv44E10gIZMDezSsyPHo3XpQ4Ri/uAPq0AewHtm0Ht6zXu8HBZ0JA1TYb47BJCGkGrNl0tiaIVRnVUPzBEI7fDMy4jCPOzUrFHMRbxB9eygy/i/4GxVjdXU38uOtrnbD2Ww7Ozvajp2bSDu+BChQ1u5Ok7GdV5Reeuka5jCikYgAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg=="></div>';
 napisy[i].innerHTML += '<div class="kitsu"><a href="https://kitsu.io/anime?text=' + czystyTitle[i] + '">Info w Kitsu</a><img class="favicon" src="data:image/ico;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABXUExURUxpcfdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNvdRNnnnhuwAAAAcdFJOUwDqEfcEHeEC/vwKynKl045ctUUl8E+ZL4S+OmWk/Im+AAABp0lEQVQ4y32TiXKDMAxEBb6wjTnDlej/v7MrQ4BmmpLJ4LGe1tJaEJ3PtpGjr4+jSanuH8LR1taW/iSc1s45spNT01cJAfqeZ9IZx/+mvbxeT61Xz57jpeDO1cLWcoxcec9FINO1KbWduYhgE40PpHMFAEKVrFQaDzUc4dtW4gKUDfv8AOkuAvkXAAFZA6lPwmxcYecOCMLTSbguYsvfAWRwE94Euh/Xgk+gkiKQUJM+Wl4f7aiHbQ4FgCoXZFV1+IJ4K3mxK8OcpVn1nQkN3maPz6zyyUrl6m1d0jJbaeuZSxQX7LpEvNCufQUajlJ4kHiN4urgqJdw1ZZk+tz1W8EonktU20lxFjtDsfsmhucaavihCTUp7kuiLpe5A815tY5eiCeAE+QPLz2v2QcMB36wEuMi93p6zQ/zng9HA3OSjns+9Hcj3TlWM8cAgYF9dd5Vus0X9X4UgbQ1O4I+knM3oMzHuWIY5TbEkPo2lseNYTAeI5k1ooy4kP6M59mCEWXiOLmP/OOgEY3VvD3/DAsQimfrB0T1tw+0L6z5OPzjE8cF/87+AXHkJd19IpM9AAAAV3pUWHRSYXcgcHJvZmlsZSB0eXBlIGlwdGMAAHic4/IMCHFWKCjKT8vMSeVSAAMjCy5jCxMjE0uTFAMTIESANMNkAyOzVCDL2NTIxMzEHMQHy4BIoEouAOoXEXTyQjWVAAAAAElFTkSuQmCC"></div>';
 napisy[i].innerHTML += '<div class="nyaasi"><a href="https://nyaa.si/?f=0&c=0_0&q=' + czystyTitle[i] +'">Pobierz z Nyaa</a><img class="favicon" src="data:image/ico;base64,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"></div>';
 napisy[i].innerHTML += '<div class="ansi"><a href="' + autorLink[i] + '">Napisy do serii tego użytkownika</a></div>';
 napisy[i].innerHTML += '<div class="ansi"><a href="' + autorLink2[i] + '">Jeśli link wyżej nie zwraca napisów, kliknij tutaj</a></div>';
    }

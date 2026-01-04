// ==UserScript==
// @name         Pasek Skrótów
// @namespace    http://tampermonkey.net/
// @version      3.10
// @description  try to take over the world!
// @author       P1337 x PX112 x llll llll
// @match        https://*.plemiona.pl/game.php?*
// @include      **mode=prod*
// @match        https://*.plemiona.pl/game.php?village=*&screen=place&mode=scavenge_mass
// @match        https://*.plemiona.pl/game.php?village=*&screen=overview_villages&mode=combined
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&screen=overview_villages&mode=combined
// @match        https://*.plemiona.pl/game.php?village=*&screen=storage
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&&screen=storage
// @match        https://*.plemiona.pl/game.php?village=*&screen=ranking
// @match        https://*.plemiona.pl/game.php?screen=overview_villages&screen=ranking
// @match        https://*.plemiona.pl/game.php?village=*&screen=am_troops&mode=template
// @match        https://*.plemiona.pl/game.php?village=*&screen=ranking&mode=player&offset
// @include      **mode=scavenge_mass*
// @icon         https://www.google.com/s2/favicons?domain=plemiona.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455961/Pasek%20Skr%C3%B3t%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/455961/Pasek%20Skr%C3%B3t%C3%B3w.meta.js
// ==/UserScript==
// USTAWIENIA ZBIERAKA MASOWEGO
// PRZED PIERWSZYM URUCHOMIENIEM USTAW 60, BY ZDĄŻYĆ WYBRAĆ CZAS RUNU
//


//
// ZBIERAK SINGLE
// DODAJ TEN SKRYPT: https://greasyfork.org/en/scripts/453881-auto-zbierak-single
var zmass;
var xx;
//var scriptLoadTime;
var gui_content;
var styl;
var start = window.localStorage.getItem("zb");
var narcyz = window.localStorage.getItem("zb1");
var seks = window.localStorage.getItem("zb2");
var tymek = window.localStorage.getItem("zb3");
var aneta = window.localStorage.getItem("zb4");
var tatanatana = window.localStorage.getItem("zb5");
var template = window.localStorage.getItem("zb7");
var ranking = window.localStorage.getItem("zb8");
var budy = window.localStorage.getItem("zb9");
var kliny = window.localStorage.getItem("zb10");
var warzywniak = window.localStorage.getItem("zb11");
var url = document.location.toString();
var heavyPop=4;
var premiumBtnEnabled=false;
var gui_content_mapa;
var gui_content_menu;
var czyMapa = url.indexOf("screen=map");
var swiat = url.substring(url.indexOf("=")+1, url.indexOf("&"));
var opcja = 0;
var scriptLoadTime = 13;

function otworz_formularz( cordyX, cordyY ){
    var X = document.getElementById("mapx");
    var Y = document.getElementById("mapy");
    X.setAttribute("value", cordyX);
    Y.setAttribute("value", cordyY);
    var a = document.getElementsByClassName("btn float_right")[0].click();
};

gui_content_mapa = `<button id="A" class="btn">SRODEK</button>
    <button id="B" class="btn">OBRZEŻA</button>
    <button id="C" class="btn">- C -</button>
    <button id="K25" class="btn">K25</button>
    <button id="K44" class="btn">K44</button>
    <button id="K37" class="btn">K37</button>`;


gui_content_menu =`<td class="menu-item">
    <a>
    <span>
    </span>
        -KoŃsKiE ZwIsY-
            </a>
<table cellspacing="0" class="menu_column">
    <tbody>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;screen=place&mode=scavenge_mass" onclick="window.localStorage.setItem('zb','1')" >ZBIERAK MASOWY</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=place&mode=scavenge" onclick="window.localStorage.setItem('zb6','1')">ZBIERAK SINGLE AUTO</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;screen=overview_villages&mode=combined" onclick="window.localStorage.setItem('zb1','1')">PLANER WYSYŁKI ATAKÓW</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=storage" onclick="window.localStorage.setItem('zb2','1')">WYSLIJ SURKI DO WIOSK</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=overview_villages&mode=prod" onclick="window.localStorage.setItem('zb3','1')">BALANS SPICHLERZY</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=place&mode=scavenge_mass" onclick="window.localStorage.setItem('zb4','1')">ODBLOKUJ ZBIERACTWO</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=ranking" onclick="window.localStorage.setItem('zb5','1')">PODGLAD AKT. ZBIERAKA</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=am_troops&mode=template" onclick="window.localStorage.setItem('zb7','1')">TEMPLATE REKRUTACJI MK</a></td></tr>
<tr><td class="menu-column-item"><a href="/game.php?village=` + swiat + `&amp;&screen=ranking&mode=player" onclick="window.localStorage.setItem('zb8','1')">STATY PLEMIENNE + SOJUSZNIK</a></td></tr>
<tr><td class="menu-column-item"><a>czas ZbMass: <input id="zms" type="text" maxlength="3" max="999" class="unitsInput input-nicer"></a></td></tr>
<tr><td class="menu-column-item"><a>xx: <input id="xx" type="text" maxlength="2" max="99" class="unitsInput input-nicer"></a></td></tr>
<tr><td class="menu-column-item"><a>scriptLoadTime <input id="scriptLoadTime" type="text" maxlength="3" max="999" class="unitsInput input-nicer"></a></td></tr>
<tr><td class="menu-column-item"><a><span><button id="zapisz" >Zapisz</button></span></a></td></tr>
<tr><td class="bottom"><div class="corner"></div><div class="decoration"></div></td></tr></tbody></table>
</td>`

window.onclick = function(event) {
    if(event.target.id == 'zapisz'){
        zmass = document.getElementById("zms").value
        window.localStorage.setItem('zmass', zmass)
        xx = document.getElementById("xx").value
        window.localStorage.setItem('xx', xx)
        //scriptLoadTime = document.getElementById("scriptLoadTime").value
       //window.localStorage.setItem('scriptLoadTime', scriptLoadTime)
    }
}

        //alert(document.querySelector("head").innerHTML);

//    document.querySelector("head").innerHTML = document.querySelector("head").innerHTML + styl;

//    document.querySelector("#header_info > tbody").innerHTML = document.querySelector("#header_info > tbody").innerHTML + gui_content;
document.querySelector("#menu_row > td:nth-child(1)").outerHTML = document.querySelector("#menu_row > td:nth-child(1)").outerHTML + gui_content_menu;

  if(czyMapa >=0) {
     document.querySelector("#header_info > tbody > tr > td:nth-child(2)").innerHTML = gui_content_mapa;
     var przyciskA= document.getElementById('A');
     przyciskA.addEventListener("click", function() { otworz_formularz(530, 454); });
     var przyciskB= document.getElementById('B');
     przyciskB.addEventListener("click", function() { otworz_formularz(642, 386); });
     var przyciskC= document.getElementById('C');
     przyciskC.addEventListener("click", function() { otworz_formularz(683, 443); });
     var przyciskK37= document.getElementById('K37');
     przyciskK37.addEventListener("click", function() { otworz_formularz(736, 350); });
     var przyciskK44= document.getElementById('K44');
     przyciskK44.addEventListener("click", function() { otworz_formularz(449, 463); });
     var przyciskK25= document.getElementById('K25');
     przyciskK25.addEventListener("click", function() { otworz_formularz(546, 271); });
 }

if(window.localStorage.getItem("zmass") !=null) {
    zmass = window.localStorage.getItem("zmass"); //CZAS W SEKUNDACH OD KLIKANIA PRZYCISKOW AUTOMATYCZNIE
    document.querySelector("#zms").value = zmass
}
if(window.localStorage.getItem("xx") !=null) {
    xx = window.localStorage.getItem("xx"); //-- CZAS OD ŁADOWANIA AUTOBALANCERA - JEŚLI ZMNIEJSZYSZ DO 1-2 MOŻE NIE ŁADOWAC SIE POPRAWNIE
    document.querySelector("#xx").value = xx
}
//if(window.localStorage.getItem("scriptLoadTime") !=null) {
    //scriptLoadTime = window.localStorage.getItem("scriptLoadTime"); // CZAS ŁADOWANIA AUTOBALANCERA PRZY WIĘKSZEJ ILOSCI WIOSEK
    //document.querySelector("#scriptLoadTime").value = scriptLoadTime
//}

window.localStorage.setItem("zb","0");
//alert(window.localStorage.getItem("zb"));
if(start=="1"){
         $.getScript('https://shinko-to-kuma.com/scripts/massScavenge.js');
}

window.localStorage.setItem("zb1","0");
//alert(window.localStorage.getItem("zb"));
if(narcyz=="1"){
         javascript:$.getScript('https://twscripts.dev/scripts/massCommandTimer.js');
}

window.localStorage.setItem("zb2","0");
//alert(window.localStorage.getItem("zb"));
if(seks=="1"){
         javascript:$.getScript('https://shinko-to-kuma.com/scripts/res-senderV2.js');
}

window.localStorage.setItem("zb3","0");
//alert(window.localStorage.getItem("zb"));
if(tymek=="1"){
         javascript:$.getScript("https://dl.dropboxusercontent.com/s/bytvle86lj6230c/resBalancer.js?dl=0");
}

window.localStorage.setItem("zb4","0");
//alert(window.localStorage.getItem("zb"));
if(aneta=="1"){
         javascript:$.getScript('https://shinko-to-kuma.com/scripts/watchTower.js');
}

window.localStorage.setItem("zb5","0");
//alert(window.localStorage.getItem("zb"));
if(tatanatana=="1"){
         javascript:$.getScript('https://shinko-to-kuma.com/scripts/scavengingOverview.js');
}

window.localStorage.setItem("zb7","0");
//alert(window.localStorage.getItem("zb"));
if(template=="1"){
         javascript:$.getScript('https://twscripts.dev/scripts/troopTemplatesManager.js');
}

window.localStorage.setItem("zb8","0");
//alert(window.localStorage.getItem("zb"));
if(ranking=="1"){
         javascript:$.getScript('https://twscripts.dev/scripts/tribeStatsTool.js');
}

window.localStorage.setItem("zb11","0");
//alert(window.localStorage.getItem("zb"));
if(warzywniak=="1"){
         javascript:$.getScript('https://shinko-to-kuma.com/scripts/overwatch.js');
}

window.localStorage.setItem("zb9","0");
//alert(window.localStorage.getItem("zb"));
if(budy=="1"){
         javascript:$.getScript('https://shinko-to-kuma.com/scripts/requestScript.js');
}

window.localStorage.setItem("zb10","0");
//alert(window.localStorage.getItem("zb"));
if(kliny=="1"){
         javascript:$.getScript('https://dl.dropboxusercontent.com/s/ctodguogtvkw2bj/massSnipesScript.js?dl=0');
}

setTimeout(()=>$("#sendMass").click(), zmass*1000*(1+0.2*Math.random()));

setTimeout(()=>{$("[id=sendMass]").each((i, btn)=>{
        setTimeout(()=>sendGroup(i, false),1000*(i*zmass/3 + Math.random()*zmass/6))
    })
}, zmass*2000*(1+0.2*Math.random()));

setTimeout(()=>$("#sendMass").click(), zmass*1000*(1+0.2*Math.random()));
setTimeout(()=>{
    $("[id=sendMass]").each((i, btn)=>{
        setTimeout(()=>sendGroup(i, false),1000*(i*zmass/3 + Math.random()*zmass/6))
    })
}, zmass*2000*(1+0.2*Math.random()));

setTimeout(()=> balancingResources().click(), xx*1000*(1+0.2*Math.random()));
//setTimeout(()=> balancingResources(), scriptLoadTime/10*1000*(1+Math.random()*0.1));

setTimeout(()=>$(".btn_send").each((key, btn)=>{setTimeout(()=>btn.click(), (key+ .3*Math.random())*300);
}) , scriptLoadTime*1000*(1+.2*Math.random()));
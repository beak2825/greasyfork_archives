// ==UserScript==
// @name         NeoBux
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Jose Enrique Ayala Villegas
// @match        http://www.neobux.com/*
// @match        https://www.neobux.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21623/NeoBux.user.js
// @updateURL https://update.greasyfork.org/scripts/21623/NeoBux.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

// Your code here...
var List;
if(location.href.indexOf("https://www.neobux.com/m/v/?vl") != -1 || location.href == "https://www.neobux.com/m/v/"){ClickOnAd();} else
    if(location.href.indexOf("http://www.neobux.com/v/?a") != -1){WaitToClose();} else
        if(location.href.indexOf("http://www.neobux.com/v/?xc") != -1){AdPrize();}

function ClickOnAd(){
    console.log("ClickOnAd");
    List = $('div[class="mbxm"]').filter(function(){return this.querySelectorAll('img[src="https://www.neobux.com/imagens/estrela_16.gif"]').length == 1;});
    if(List.length >= 1){
        $("table", List[List.length -1])[0].onmousemove();
        $("table", List[List.length -1])[0].onmouseover();
        $("table", List[List.length -1])[0].click();
        List[List.length -1].querySelectorAll('img[onclick]')[0].onclick();
        location.href = List[List.length -1].querySelectorAll('a[onclick]')[0].href;
    }
}

function WaitToClose(){
    if($('#o1')[0].style.display !== ""){setTimeout(function(){WaitToClose();},1000);} else {location.href = "http://www.neobux.com/m/v/";}
}

function AdPrize(){
    if($('#prm0')[0].style.display == "none"){setTimeout(function(){AdPrize();},1000);} else
        try{
            if($('#nxt_bt_td')[0].style.display == 'none') location.href="https://www.neobux.com/c/"; else
                $('#nxt_bt_a')[0].click();
        } catch(e){}
}


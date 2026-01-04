// ==UserScript==
// @name        REtoTEST
// @namespace   HVASRE
// @author      yooooki
// @description Show Random Enconter link after clicking
// @version     1
// @match       https://e-hentai.org/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30851/REtoTEST.user.js
// @updateURL https://update.greasyfork.org/scripts/30851/REtoTEST.meta.js
// ==/UserScript==

//fight in alt.hentaiverse.org
var alt=true;

var test=true;





function displayTime(){
    var t=new Date();
    if (t.getMinutes()<10) {
        return t.getHours()+':0'+t.getMinutes();
    }
    else {
        return t.getHours()+':'+t.getMinutes();
    }
}


if(document.getElementById('eventpane')!=null){

    //Add timeout alert
    //If you don't want to refresh the window after the dialog, please delete "window.location.reload();" below
    var c=setTimeout("document.title='Refresh Request';alert('Time to refresh!');window.location.reload();",1830000);
    document.getElementById('eventpane').appendChild(document.createElement("div"));
    document.getElementById('eventpane').children[2].textContent='Encountered time  '+displayTime();
    //Change onClick
    var content=document.getElementById('eventpane').children[1].children[0].onclick.toString().split("document.getElementById('eventpane').style.display='none';");
    var formar=content[0].split("{")[1].split("hentaiverse.");
    if(!test){
        if(alt){
            document.getElementById('eventpane').children[1].children[0].onclick=Function("document.getElementById('eventpane').children[1].children[0].textContent='Clicked, Retry?';"+formar[0]+"alt.hentaiverse."+formar[1]+content[1].split("}")[0]);
        }
        else {
            formar[0]=formar[0].replace('http','https');
            document.getElementById('eventpane').children[1].children[0].onclick=Function("document.getElementById('eventpane').children[1].children[0].textContent='Clicked, Retry?';"+content[0].split("{")[1]+content[1].split("}")[0]);
        }
    }
    else {
        document.getElementById('eventpane').children[1].children[0].onclick=Function("document.getElementById('eventpane').children[1].children[0].textContent='Clicked, Retry?';"+formar[0]+"hvtestlive.e-hentai."+formar[1]+content[1].split("}")[0]);
    }
}



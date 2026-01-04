// ==UserScript==
// @name         Gartic.io YGN SCRIPT
// @namespace    http://tampermonkey.net/
// @version      10
// @description  Gartic.io Oyun İçi Kolaylık Sağlar.
// @author       ygn
// @match        https://gartic.io/*
// @icon         https://www.google.com/s2/favicons?domain=gartic.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432305/Garticio%20YGN%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/432305/Garticio%20YGN%20SCRIPT.meta.js
// ==/UserScript==

// **NOT :: JAVASCRIPT ÖĞRENMEK İSTEYENLER İÇİN AÇIK KAYNAK KOD OLARAK YGN(JOKESCRITP) TARAFINDAN HERKESE AÇIK OLARAK PAYLAŞILMIŞTIR. SUISTIMAL ETMEYINIZ.

let ready=0,oldurl;
let panel = document.createElement("div");
panel.setAttribute("class","roomspanel");
panel.setAttribute("style","width:15%;height:auto;max-height:500px;overflow-y:scroll;padding:10px;position:fixed;background-color:white;color:grey;font-weight:bold;right:10px;top:50%;transform:translate(0,-50%);border-radius:10px;border:2px solid grey;text-align:center;z-index:99999;");
let icerik = "<h2>Odalar</h2><hr><br><input type='text' style='padding:10px;' placeholder='Oda Ara..' oninput='window.refreshrooms(this.value)' class='mousetrap' /><br><br><div class='odaliste'></div>";
function _(x){return document.querySelector(x);};
function _a(x){return document.querySelectorAll(x);};
window.refresh=(x=window.location.href)=>{window.onbeforeunload=null;oldurl=x;_("#exit").click();_(".ic-yes").click();setTimeout(window.location.href=oldurl,500);};

setTimeout(()=>{
    if(document.title.indexOf("#")!=-1){
        let l = setInterval(()=>{
            _(".ic-playHome").click();
            clearInterval(l);
        },100);
    }
},300);

window.refreshrooms=(x="")=>{
    let roomdatas;
    fetch("https://gartic.io/req/list?search="+x+"&language[]=8").then(x=>x.json()).then(x=>{
        roomdatas=x;
        _(".odaliste").innerHTML="";
        for(let i of roomdatas){
            _(".odaliste").innerHTML+="<button style='width:70%;text-align:center;background-color:dodgerblue;color:white;border:2px solid cyan;border-radius:10px;padding:10px;' onclick='window.refresh(\"https://gartic.io/"+i.code+"\")'><b>"+i.code.slice(-3)+" - "+i.quant+"/"+i.max+"</b></button><a href='https://gartic.io/"+i.code+"/viewer' target='_blank'>Viewer</a><br>";
        }
    });
}

document.body.addEventListener("keyup",(event)=>{
    window.event.keyCode==27?window.refresh():0;
})

let a = setInterval(()=>{
    if(_(".game")){
        if(ready==0){
            setTimeout(()=>{
                _(".logo").remove();
                if(!_(".roomspanel")){
                    document.body.appendChild(panel);
                    _(".roomspanel").innerHTML=icerik;
                    window.refreshrooms();
                }
                for(let i of _a(".alert")){
                    i.setAttribute("class","msg");
                }
                _(".user.you").innerHTML+='<span style="padding:10px;background:black;color:gold;font-weight:bold;">VIP</span>';
                ready=1;
            },300);
        }
        _(".contentPopup")?_(".btYellowBig.ic-yes").click():0;
        _("g")?_("g").remove():0;
        if(ready==1){
            for(let i of _a(".scrollElements")[2].querySelectorAll(".msg.alert")){
                i.innerText.split(", ")[1].split(" ")[0] == _(".user.you").innerText.split("\n")[0]?window.refresh():0;
            }
        }
    }
},50);
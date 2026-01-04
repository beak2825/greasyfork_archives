// ==UserScript==
// @name         Odstranění simulace a series + WTA/ATP API Změna
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Odstraní simulované zápasy z multi a převádí WTA/ATP odkazy na API formát
// @author       Michal
// @match        https://widgets.sir.sportradar.com/*
// @match        https://dc.livesport.eu/kvido/parser/multi-admin*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539273/Odstran%C4%9Bn%C3%AD%20simulace%20a%20series%20%2B%20WTAATP%20API%20Zm%C4%9Bna.user.js
// @updateURL https://update.greasyfork.org/scripts/539273/Odstran%C4%9Bn%C3%AD%20simulace%20a%20series%20%2B%20WTAATP%20API%20Zm%C4%9Bna.meta.js
// ==/UserScript==

(function(){
'use strict';
const CONFIG={maxRetries:5,retryDelay:1000,checkInterval:2000,maxCheckDuration:30000};
let retryCount=0,checkStartTime=Date.now(),periodicChecker=null;
function removeTable(){
    let tables=document.querySelectorAll('table.mtable');
    tables.forEach(table=>{
        let text=table.textContent;
        if(text.includes('Simulated Reality League')||text.includes('. Series.'))table.remove();
    });
}
function delayedRemoval(){setTimeout(removeTable,2000);}
function convertWtaToApiUrl(url){
    const r=/https:\/\/www\.wtatennis\.com\/tournaments\/(\d+)\/[^\/]+\/(\d{4})\/scores\/([A-Z0-9]+)/,m=url.match(r);
    return m?`https://api.wtatennis.com/tennis/tournaments/${m[1]}/${m[2]}/matches/${m[3]}/stats/`:null;
}
function convertAtpToApiUrl(url){
    const r=/https:\/\/www\.atptour\.com\/en\/scores\/stats-centre\/live\/(\d{4})\/(\d+)\/([a-zA-Z0-9]+)/,m=url.match(r);
    return m?`https://itp-atp-sls.infosys-platforms.com/prod/api/stats-plus/v1/keystats/year/${m[1]}/eventId/${m[2]}/matchId/${m[3].toUpperCase()}`:null;
}
function processLinks(){
    const wtaLinks=document.querySelectorAll('a[href*="wtatennis.com/tournaments"]:not([data-api-converted])');
    const atpLinks=document.querySelectorAll('a[href*="atptour.com/en/scores/stats-centre/live"]:not([data-api-converted])');
    let c=0;
    wtaLinks.forEach(link=>{
        const o=link.href,api=convertWtaToApiUrl(o);
        if(api){
            link.href=api;
            link.setAttribute('data-api-converted','true');
            if(link.textContent===o)link.textContent=api;
            c++;
        }
    });
    atpLinks.forEach(link=>{
        const o=link.href,api=convertAtpToApiUrl(o);
        if(api){
            link.href=api;
            link.setAttribute('data-api-converted','true');
            if(link.textContent===o)link.textContent=api;
            c++;
        }
    });
    return c;
}
function processLinksWithRetry(){
    const count=processLinks();
    if(count>0){
        alert(`Odkazy přepsány: ${count}`);
        retryCount=0;
        return true;
    }
    const pWta=document.querySelectorAll('a[href*="wtatennis.com/tournaments"]');
    const pAtp=document.querySelectorAll('a[href*="atptour.com/en/scores/stats-centre/live"]');
    const total=pWta.length+pAtp.length;
    if(total===0)return true;
    retryCount++;
    if(retryCount<=CONFIG.maxRetries){
        setTimeout(processLinksWithRetry,CONFIG.retryDelay*retryCount);
        return false;
    }else{
        retryCount=0;
        return true;
    }
}
function startPeriodicChecker(){
    if(periodicChecker)clearInterval(periodicChecker);
    checkStartTime=Date.now();
    periodicChecker=setInterval(()=>{
        const elapsed=Date.now()-checkStartTime;
        if(elapsed>CONFIG.maxCheckDuration){
            clearInterval(periodicChecker);
            return;
        }
        const pending=document.querySelectorAll('a[href*="wtatennis.com/tournaments"]:not([data-api-converted]),a[href*="atptour.com/en/scores/stats-centre/live"]:not([data-api-converted])');
        if(pending.length>0)processLinksWithRetry();
    },CONFIG.checkInterval);
}
function enhancedMutationCallback(mutations){
    let shouldCheck=false;
    mutations.forEach(m=>{
        if(m.type==='childList'&&m.addedNodes.length>0){
            m.addedNodes.forEach(node=>{
                if(node.nodeType===1){
                    const w=node.querySelectorAll?node.querySelectorAll('a[href*="wtatennis.com/tournaments"]:not([data-api-converted])'):[];
                    const a=node.querySelectorAll?node.querySelectorAll('a[href*="atptour.com/en/scores/stats-centre/live"]:not([data-api-converted])'):[];
                    if(w.length>0||a.length>0)shouldCheck=true;
                }
            });
        }
    });
    if(shouldCheck){
        setTimeout(()=>{processLinksWithRetry();},500);
    }
}
const currentDomain=window.location.hostname;
if(currentDomain==='widgets.sir.sportradar.com'){
    delayedRemoval();
    new MutationObserver(delayedRemoval).observe(document.body,{childList:true,subtree:true});
}else if(currentDomain==='dc.livesport.eu'){
    window.addEventListener('load',function(){
        setTimeout(()=>{
            processLinksWithRetry();
            startPeriodicChecker();
        },1000);
    });
    if(document.readyState==='complete'){
        setTimeout(()=>{
            processLinksWithRetry();
            startPeriodicChecker();
        },1000);
    }
    const observer=new MutationObserver(enhancedMutationCallback);
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
    setTimeout(()=>{processLinksWithRetry();},5000);
}
})();
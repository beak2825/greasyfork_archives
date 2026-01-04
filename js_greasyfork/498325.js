// ==UserScript==
// @name         GeoCaching.com find already logged found drafts
// @run-at       document-idle
// @namespace    http://tampermonkey.net/
// @version      2024-06-19
// @description  Find drafts that have already been logged as found
// @author       Gary Turner
// @match        https://www.geocaching.com/account/drafts
// @match        https://www.geocaching.com/live/geocache/*/draft/*/compose
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geocaching.com
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/498325/GeoCachingcom%20find%20already%20logged%20found%20drafts.user.js
// @updateURL https://update.greasyfork.org/scripts/498325/GeoCachingcom%20find%20already%20logged%20found%20drafts.meta.js
// ==/UserScript==

let doneListener = null;
let debug = false;

function cacheDone(GCNo, tbox, newTab, isFound){
    if(debug) console.log('in cacheDone ',GCNo,isFound,newTab);
    newTab.close();
    if ( isFound ) tbox.click(); // set .checked doesn't work
    if (doneListener) { GM_removeValueChangeListener( doneListener )};
}

function waitForFoundFlag(cacheList,index,GCNo, tbox, newTab) {
    if(debug) console.log("wFFF: ",cacheList,index,GCNo, tbox, newTab);
    let OK = true;
    let GTDFDR = GM_getValue("GTDFDRunning");
    if( GTDFDR === GCNo + ' N') {
        cacheDone(GCNo, tbox, newTab, false);
    } else {
        if( GTDFDR === GCNo + ' Y') {
            cacheDone(GCNo, tbox, newTab, true);
        } else {
            OK = false;
            if (doneListener) { GM_removeValueChangeListener( doneListener )};
            throw new Error('Odd GTDFDRunning value: '+ GTDFDR);
            return;
        }
    }
    if (OK && index < cacheList.length-1){
        openCache(cacheList,index+1);
    } else {
        if(debug) console.log('in waitForFoundFlag '+ cacheList.length );
        GM_deleteValue("GTDFDRunning");
    }
}

function openCache(cacheList,index){
// https://www.geocaching.com/account/drafts/home/compose?gc=GC560DH&d=LDA...&dGuid=...f&lt=2
    if(debug) console.log('oC: start ',index);
    let aCache = cacheList[index];
    if (!aCache){
        throw new Error('Invalid aCache '+ aCache);
        return;
    }
    const GCRegEx = /drafts\/home\/compose\?gc=([A-Z0-9]*)\&/;
    if(debug) console.log(aCache);
    let link = aCache.querySelector("div.draft-content > a");
    let status = aCache.querySelector("dl.meta > dt:not(.state)"); //archived caches have class="state"archived before "Found it"
    let tbox = aCache.querySelector("input")
    let GCNo = link.href.match(GCRegEx)[1];
    let title = aCache.querySelector("h2")
    if(debug) console.log(aCache,tbox,link);
    if(debug) console.log(index,cacheList.length,GCNo,status.textContent,title.textContent);
    if (status.textContent=='Found it:'){ //only check found logs
        GM_setValue("GTDFDRunning",GCNo);
        let newTab = GM_openInTab(link.href,{active: true, setParent: true});
        doneListener = GM_addValueChangeListener("GTDFDRunning",function(){waitForFoundFlag(cacheList,index,GCNo, tbox, newTab);});
    } else {
        index++;
        if (index < cacheList.length - 1){
           if(debug) console.log('oC: incr');
            openCache(cacheList,index);
        }
    }
}

function checkForFound(){
    let dList = document.querySelector("#draftList > ul");
    if(debug) console.log('cFF dlist is ',dList);
    let eList = dList.getElementsByTagName("li");
    openCache(eList,0);
}

function addButtontoMainList(){
    let dList = document.querySelector("#draftList > ul");
    let ulb_ele = document.getElementsByClassName('btn-csv-upload');
    let where = ulb_ele[0];
    let newDiv = document.createElement('div');
    newDiv.id = 'GTNdivId';
    let newBtn = document.createElement('button');
    newBtn.textContent = 'Select caches already found (scroll down to fill list!)';
    newBtn.className = 'btn-upload';
    newBtn.addEventListener('click', checkForFound);
    where.parentNode.insertBefore(newDiv,where.nextSibling);
    newDiv.appendChild(newBtn);
}

function checkOneCache(GCV){
    if(debug) console.log('c1c '+GCV);
    let lookforGC = GM_getValue("GTDFDRunning")
    if(debug) console.log('c1c GTDFR '+ lookforGC);
    let errMsg = document.querySelector(".error-description > span");
    if (errMsg && errMsg.innerHTML.match('You have already logged a \'\<strong\>Found it\<\/strong\>\' for this cache')){
        if(debug) console.log('c1c found');
        if (GCV === lookforGC){
            if(debug) console.log('c1c matches Y');
            GM_setValue("GTDFDRunning", lookforGC+' Y');
        }
    } else {
        if (GCV === lookforGC){
            if(debug) console.log('c1c matches N');
            GM_setValue("GTDFDRunning", lookforGC+' N');
        }
    }
}

function check(changes, observer) {
    const url = document.URL;
    let GCValA = null;

    // main draft list page
    if (url.match(/account\/drafts$/)){
        if(document.querySelector("#draftList > ul")) {
            observer.disconnect();
            addButtontoMainList();
        }
    }

    // individual cache log page
    if (GCValA = url.match(/live\/geocache\/(GC.*)\/draft/)){
        let GCVal = GCValA[1];
        if ( GM_getValue("GTDFDRunning")){
           if(document.querySelector(".error-description, .mantine-Accordion-label")) { //mantine... is a random 'maybe latish in load...
               observer.disconnect();
               checkOneCache(GCVal);
           }
       }
    }
}


(function() {
    'use strict';
    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});
})();
// ==UserScript==
// @name         Outlook live ad-remover
// @namespace    http://monkeyr.com/
// @version      1.6.1
// @description  Remove ad's from mirosofts web mail services
// @author       mh
// @license      MIT
// @match        https://outlook.live.com/owa/*
// @match        https://outlook.live.com/mail/*
// @icon         https://outlook.live.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445907/Outlook%20live%20ad-remover.user.js
// @updateURL https://update.greasyfork.org/scripts/445907/Outlook%20live%20ad-remover.meta.js
// ==/UserScript==

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
let adPanel = false;
let o365Button = false;
let emailAd = false;
let emailAdSeenEles = [];
if (MutationObserver) console.log('Outlook live ad-remover is enabled.');
window.addEventListener('resize', function() {adPanel = false; o365Button = false; emailAd = false; console.log('resize event')});
const observer = new MutationObserver(MutationRecords => {
    MutationRecords.forEach(function(MutationRecord){
        let msFZs = {};
        let emailAdEles;
        let target = MutationRecord.target;
        // Find and remove the right/lower ad panel
        if(!adPanel && target.querySelectorAll('[aria-label="advertisement"]').length && target.tagName === 'DIV'){
            target.remove();
            //adPanel = true;
            console.log('adPanel removal', target, parent);
        }
        // find and remove the upgrade to o365 button
        else if(!o365Button && (msFZs = target.querySelectorAll('.ms-FocusZone')) && msFZs.length){
            msFZs.forEach(msFZ => {
                let nextSibling = msFZ.nextSibling;
                if(nextSibling && nextSibling.firstChild && nextSibling.firstChild.tagName == 'BUTTON' ){
                    nextSibling.remove();
                    o365Button = true;
                    console.log('o365Button removal', target, MutationRecord, nextSibling, nextSibling.childElementCount);
                    return false;
                }
            });
        }
        // hide the ad from the top of the inbox, removing it will sometimes crash the outlook "app"
        if(!emailAd && (emailAdEles = target.querySelectorAll('[role="listbox"] .customScrollBar > div > div')) && emailAdEles.length && target.tagName === 'DIV'){
            emailAdEles.forEach(ele => {
                if(!ele.querySelector('[draggable]')){
                    if(ele.style.display != 'none'){
                        ele.style.display = 'none';
                        console.log('owaContainer removal', ele);
                        //emailAd = true;
                    }
                    return false;
                }
                //console.log(itm, itm.querySelector('[draggable]'))
            });
        }
    });
    //console.log(MutationRecords);
});
observer.observe(document.body, {childList: true, subtree: true});
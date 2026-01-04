// ==UserScript==
// @name         YouTube Perferred Settings for Private Mode
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Save the setting permanently
// @author       CY Fung
// @icon         data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='189' height='140' viewBox='0 0 270 200' %3E%3Crect x='0' y='0' width='270' height='200'%3E%3C/rect%3E%3Cpath d='m106 190c-27.3-.6-48.3-1.5-60.6-3-7.2-.9-9.9-1.5-13.2-2.7-8.1-2.4-15-8.7-18.9-16.2-2.7-5.7-4.5-15.3-5.7-30.6-2.4-26.4-2.4-49.2 0-75.9 1.2-13.8 3-23.1 5.4-28.5 3.9-7.8 11.1-14.4 19.2-16.8 9.6-3 32.7-4.8 76.2-5.7 35.4-.6 81.3.3 105.9 2.4 20.4 1.5 27.6 3.9 34.8 11.1 7.5 7.5 9.9 15 12 37.2 1.2 12.9 1.5 22.5 1.5 39 0 25.8-1.5 46.5-4.5 59.7-1.5 6.9-4.2 12-9 16.5-7.2 7.5-14.1 9.6-34.8 11.4-24.6 1.8-71.7 3-108.3 2.1z' fill='%23018000'/%3E%3Cpath d='M110 66 178 104 110 142Z' fill='%23fff'/%3E%3C/svg%3E
// @license     MIT
// @match     https://www.youtube.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-cookie/3.0.1/js.cookie.min.js
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456178/YouTube%20Perferred%20Settings%20for%20Private%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/456178/YouTube%20Perferred%20Settings%20for%20Private%20Mode.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const gmKey = 'yps-r';
    const cookieDomain ='youtube.com';
    const STORE_VERSION = 1.1;
    /*

        this.j = g.N("ALT_PREF_COOKIE_NAME", "PREF");
        this.u = g.N("ALT_PREF_COOKIE_DOMAIN", "youtube.com");
    */

    /*global Cookies*/

    console.assert(typeof Cookies === "object");

    const skipKeys = ['SIDCC','CONSISTENCY'];


    const isPassiveArgSupport = (typeof IntersectionObserver === 'function');
    // https://caniuse.com/?search=observer
    // https://caniuse.com/?search=addEventListener%20passive

    const bubblePassive = isPassiveArgSupport ? { capture: false, passive: true } : false;
    const capturePassive = isPassiveArgSupport ? { capture: true, passive: true } : true;


    let registerH = 0;



    let navigationCheckPromiseResolve = null;
    const navigationCheckPromise = new Promise(r=>{
        navigationCheckPromiseResolve=r;
    });

    let _beginCookie = null;
    function regBegin(){

        if(registerH>0){
            GM_unregisterMenuCommand(registerH);
        }
    registerH = GM_registerMenuCommand("Setting Record Begin", begin, "b");
    }
    function regEnd(){

        if(registerH>0){
            GM_unregisterMenuCommand(registerH);
        }
        registerH = GM_registerMenuCommand("Setting Record End", end, "e");
    }
    function begin() {
        _beginCookie = Cookies.get();
        regEnd();
        let elm = document.querySelector('ytd-app');
        if(elm) elm.classList.add('yps-recording');
    }

    function end() {
        regBegin();
        const beginCookie = _beginCookie;
        if (!beginCookie) return alert('Recording was not started.')
        _beginCookie = null;


        let elm = document.querySelector('ytd-app');
        if(elm) elm.classList.remove('yps-recording');

        let endCookie = Cookies.get();
        let removed = [];
        let added = [];
        let keysBegin = Object.keys(beginCookie)
        let keysEnd = Object.keys(endCookie)

        let changed = [];
        for (const key of keysBegin) {

            if (keysEnd.includes(key)) {
                if (beginCookie[key] !== endCookie[key] && !skipKeys.includes(key)) {

                    changed.push({
                        key: key,
                        preValue: beginCookie[key],
                        newValue: endCookie[key],
                        changed: true
                    })
                }
                endCookie[key] = null;
                continue;
            }
            removed.push({
                key: key,
                prevValue: beginCookie[key],
                removed: true
            })
        }

        for (const key of keysEnd) {

            if (endCookie[key] === null) continue;
            added.push({
                key: key,
                newValue: endCookie[key],
                added: true
            })
        }

        if (removed.length > 0 || added.length > 0 || changed.length > 0) {

            let ret = prompt(
                [
                    `The recorded changes are as follows:`,
                    `Removed keys: ${JSON.stringify(removed, null, 2)},`,
                    `Added keys: ${JSON.stringify(added, null, 2)},`,
                    `Changed keys: ${JSON.stringify(changed, null, 2)},`,
                    `If you want to save these changes permanently, please type 'confirm'.`
                ].join('\n')
                , "confirm");


                async function goSave(req){

                    let gmValue = null;
                    try{
                        gmValue = await GM.getValue(gmKey);
                    }catch(e){}
                    if(!gmValue || typeof gmValue !=='string'){
                        gmValue = '{}';
                    }
                    let pObj = null;
                    try{
                        pObj = JSON.parse(gmValue)
                    }catch(e){

                    }
                    if(!pObj || pObj.version !== STORE_VERSION){
                        pObj = {
                            version: STORE_VERSION,
                            cookies:{

                            }
                        };
                    }

                    const cookies = pObj.cookies;

                    for(const {key} of req.removed){

                        cookies[key]={
                            v: null
                        }
                    }
                    for(const {key, newValue} of req.added){

                        cookies[key]={
                            v: newValue
                        }
                    }
                    for(const {key, newValue} of req.changed){

                        cookies[key]={
                            v: newValue
                        }
                    }


                    let success = true;
                    try{
                        let gmValue = JSON.stringify(pObj);
                        await GM.setValue(gmKey, gmValue);
                    }catch(e){
                        console.warn(e);
                        success = false;
                    }

                    if(success){
                        alert('The settings have been saved.')
                    }



                }


                if(ret.toLowerCase()==='confirm'){
                    goSave({
                        version: STORE_VERSION,
                        removed: removed,
                        added: added,
                        changed: changed
                    })
                }
        } else {
            alert('No changes can be recorded.')
        }


    }

    regBegin();

    async function init(){
        
        let _cookie = document.cookie||''
        if(_cookie.indexOf('CONSISTENCY')>=0) return;
        if(_cookie.indexOf('SIDCC')>=0) return;
         

        let gmValue = null;
        try{
           gmValue = await GM.getValue(gmKey);
        }catch(e){}
        if(!gmValue) return;

        let pObj = null;
        try{
            pObj = JSON.parse(gmValue)
        }catch(e){
        }

        if(!pObj || pObj.version !== STORE_VERSION){
            pObj = {
                version: STORE_VERSION,
                cookies:{
                }
            };
            return;
        }

        if(!pObj.cookies) return;

        await Promise.resolve(0);

        const cookies = pObj.cookies;


        for (const key in cookies) {
            if(cookies[key].v===null){
                Cookies.remove(key);
            }else if(typeof cookies[key].v ==='string'){
                Cookies.set(key, cookies[key].v, { domain: cookieDomain} )
            }
        }

        if(typeof navigationCheckPromiseResolve === 'function'){
            navigationCheckPromiseResolve();
        }


    }
    init();



    async function updateRecord(){
        return;

        let gmValue = null;
        try{
           gmValue = await GM.getValue(gmKey);
        }catch(e){}
        if(!gmValue) return;

        let pObj = null;
        try{
            pObj = JSON.parse(gmValue)
        }catch(e){
        }

        if(!pObj || pObj.version !== STORE_VERSION){
            pObj = {
                version: STORE_VERSION,
                cookies:{
                }
            };
            return;
        }

        if(!pObj.cookies) return;

        await Promise.resolve(0);

        const cookies = pObj.cookies;

        let overrided = 0;

        for (const key in cookies) {


            if(cookies[key].v===null){
                if(typeof Cookies.get(key) ==='string'){
                    delete cookies[key];
                    overrided++;
                }
            }else if(typeof cookies[key].v ==='string'){

                if(Cookies.get(key)!==cookies[key].v){
                    delete cookies[key];
                    overrided++;
                }
            }

        }

        if(overrided>0){

            let success = true;
            try{
                let gmValue = JSON.stringify(pObj);
                await GM.setValue(gmKey, gmValue);
            }catch(e){
                console.warn(e);
                success = false;
            }

            if(success){
                console.log('The perferred settings have been overrided.')
            }



        }




    }


    document.addEventListener('yt-navigate-finish', function(){

        navigationCheckPromise.then(()=>{
           // updateRecord();

        })

    }, bubblePassive)


    let keyupDT = 0;

    document.addEventListener('keyup', function(evt){

        if(evt.shiftKey && evt.code ==='KeyR'){


        }else{
            if(keyupDT>0 && evt.code ==='KeyR'){

            }else{

                keyupDT = 0;
                return;
            }
        }

        let t = Date.now();
        if(keyupDT>0){
            if(t - keyupDT <300){
                console.log('Shift-R-R')

                if(!_beginCookie){
                    begin();
                }else{
                    end();
                }
            }
            keyupDT = 0;
        }
        keyupDT = t;


    }, bubblePassive);

    GM_addStyle(
        `ytd-app.yps-recording{
            filter:brightness(0.7);
        }`
    );


    // Your code here...
})();
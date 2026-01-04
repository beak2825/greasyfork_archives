// ==UserScript==
// @name         AutomateNow! mouse middle button action
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Open links in new tab, after middle button click or CTRL + left click
// @require
// @author       Marek Slebodnik <marek.slebodnik@dhl.com>
// @match        https://*/automatenow/*
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488717/AutomateNow%21%20mouse%20middle%20button%20action.user.js
// @updateURL https://update.greasyfork.org/scripts/488717/AutomateNow%21%20mouse%20middle%20button%20action.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('loading Anow middle click');

    //  prevent default middle click action
    window.addEventListener('auxclick', (e) => {
        e.preventDefault();
    }, {passive: false})

    window.addEventListener('mouseup', (e) => {
        // only check middle click or left click with CTRL
        // ignore other mouseup events
        if ( ! ( e.which == 2 || ( e.which == 1 && e.ctrlKey ) ) ){
            return
        }

        // anchor elements <a href=......></a>
        // open in new tab
        if (e.target.href){
            e.stopPropagation();
            e.stopImmediatePropagation();
            e.preventDefault();


            // InfiniteApplication.showUrlInNewTab

            localStorage.setItem('accessToken',sessionStorage.getItem('accessToken'))
            localStorage.setItem('refreshToken',sessionStorage.getItem('refreshToken'))
            localStorage.setItem('expiresIn',sessionStorage.getItem('expiresIn'))
            localStorage.setItem('expirationDate',sessionStorage.getItem('expirationDate'))

            // $("#openUrlInNewTabForm").attr('action', '#' + url);
            // $("#openUrlInNewTabFormAccessTokenField").val(sessionStorage.getItem('accessToken'));
            // $("#openUrlInNewTabForm").submit()

            let newTabForm = document.getElementById('openUrlInNewTabForm')
            newTabForm.action = e.target.href.replace(/.*\/automatenow\/#/, '#');
            document.getElementById('openUrlInNewTabFormAccessTokenField').value = sessionStorage.accessToken
            newTabForm.submit()
            return
        }

        // input password named "anowAccessToken"
        // put accessToken in value
        if ( e.target.tagName.toUpperCase() == 'INPUT' &&
            e.target.type == 'password' && e.target.name == 'anowAccessToken' ){
            e.target.value = sessionStorage.accessToken;
            return
        }

        if( e.target.nodeName == 'TEXTAREA'){
            //e.stopPropagation();
            //e.stopImmediatePropagation();
            //e.preventDefault();
            try{
                let newValue = JSON.parse(e.target.value)
                e.target.value = JSON.stringify(newValue, null, '\t');
            }catch(err){
                console.log("not a valid JSON");
            }
            return
        }
        // console.log(e.target);
    }, {passive: false})
})();
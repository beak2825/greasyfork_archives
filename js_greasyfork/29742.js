// ==UserScript==
// @name        Google Translate Until Stable
// @author      Kevin Whitefoot
// @description Adds a button to repeatedly translate back to the original language and target language until it stabilizes.
// @namespace   kwhitefoot@hotmail.com
// @include     https://translate.google.com/*
// @version     0.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29742/Google%20Translate%20Until%20Stable.user.js
// @updateURL https://update.greasyfork.org/scripts/29742/Google%20Translate%20Until%20Stable.meta.js
// ==/UserScript==

/* 

* Versions:

0.0.1 First version posted.  Works but does not give much feedback.


* Purpose:

Helps you play around with Google Translate.  

To use this it is probably best to turn off automatic, instant,
translation.  Add your input text, choose the input and output
languages, translate once and then click the 'Translate until stable'
link.  The script will then back translate to the input language and
then forward again, it will keep doing this until the back translation
matches the original input text or it enters a loop.

For major European languages it will often take only one step and the
back translation is identical to the input.  If you have odd spacing
or line breaks it might take one or two extra steps.  But for
languages with smaller corpora (from Google's point of view) it can
take quite a number of steps and the final version can be quite
different from the original.

* License: 

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>

* Notes:

I use http://beautifytools.com/javascript-validator.php for
validation, it seems to be the most comprehensive.  In particular it
points out that const items must be defined before use.

*/


(function () {
    // Begin with some debugging features.
    'use strict';

    // A constant that can be used to identify log messages and DOM
    // elements, make sure there are no odd characters in this.
    const MY_ATTRIBUTE = 'gtus';
    const BUTTON_ID = MY_ATTRIBUTE + 'Button';
    // Tag to be used as a prefix for log messages.  Then you can
    // filter the console log to see only our messages.
    const TAG = MY_ATTRIBUTE + ': ';
    var DEBUG = true;
    function dlog(msg) {
        if (DEBUG) {
            console.log(TAG + msg);
        }
    }
    
    try{
//        alert('xxx');
        dlog('start');


        var referenceURLs = null;
        
        var hashChangedHandler = null;
        
        
        const backTranslate = function (){
            dlog('backTranslate');
            const currentLocation = document.location;
            //dlog('tus currentLocation: ' + currentLocation);
            const languages = currentLocation.hash.split('/');
            const fromLanguage = languages[0].substr(1);
            const toLanguage = languages[1];
            const toElement = document.getElementById('result_box');
            const toText = toElement.innerText;
            //dlog('Now switch');
            const newHash = ('#' + toLanguage + 
                             '/' + fromLanguage +
                             '/' + toText);
            currentLocation.hash = newHash;
        };
        
        
        
        // Do nothing except change the state function.
        const handleBackHashChange = function () { 
            dlog('handleBackHashChange');
            hashChangedHandler = handleBackHashChangeCorrection;
        };


         const CreateButton = function (siblingForButton){
            dlog('CreateButton');
            const existingButton = document.getElementById(BUTTON_ID);
            if (existingButton){
                // Already done, don't know why
                dlog('CreateButton called more than once');
                return;
            }
            const button = document.createElement('div');
            button.innerText = 'Translate until stable';
            button.id = BUTTON_ID;
            button.onclick = function(){
                referenceURLs = [document.URL];
                hashChangedHandler = handleBackHashChange;
                backTranslate();
            };
            siblingForButton.parentNode.appendChild(button);
        };
        
        
        const GetSiblingForButton = function (){
            dlog('GetSiblingForButton');
            return document.getElementById('gt-appname');
        };
        
        const isStable = function (){
            dlog('isStable url: ' + document.URL);
            const stable = referenceURLs.includes(document.URL);
            dlog('isStable: ' + stable);
            return stable;
        };
        
        const ActOnTranslationComplete = function (){
            dlog('ActOnTranslationComplete');
            // Ready to test convergence
            if (!isStable()) {
                // go around again
                referenceURLs.push(document.URL);
                hashChangedHandler = handleBackHashChange;
                backTranslate();
                return;
            } 
            dlog('Finished.');
        };
        
        const POLLING_INTERVAL = 10000;
        
        const translationIsReady = function () {
            const span = document.getElementById('result_box');
            dlog('translationIsReady spans: ' + span.childNodes.length);
            const lastSpan = span.lastChild;
            //  This is a crude and quite likely fragile way to detect
            //  when the translation is complete.  Google puts an
            //  ellipsis as the last span innerText while it is
            //  working.  Note that this is not a Unicode ellipsis
            //  character but three dots.
            const isReady = !(lastSpan === null || 
                              lastSpan.innerText === '...');
            dlog('translationIsReady: ' + isReady);
            return isReady;
        };

        const waitingForBackTranslationComplete = function () {
            dlog('waitingForBackTranslationComplete');
            if (translationIsReady()) {
                hashChangedHandler = handleForwardHashChange;
                backTranslate();
            } else {
                dlog('waitingForBackTranslationComplete: wait again');
                setTimeout(waitingForBackTranslationComplete,
                           POLLING_INTERVAL);
            }
        };
        
        const waitingForForwardTranslationComplete = function () {
            dlog('waitingForForwardTranslationComplete');
            if (translationIsReady()) {
                ActOnTranslationComplete();
            } else {
                setTimeout(waitingForForwardTranslationComplete,
                           POLLING_INTERVAL);
            }
        };
        
        
        const handleHashChange = function (event) {
            dlog('handleHashChange');
            hashChangedHandler();
        };
        
        
        // Do nothing except change the state function.
        const handleForwardHashChange = function () { 
            dlog('handleForwardHashChange');
            hashChangedHandler = handleForwardHashChangeCorrection;
        };
        
        const handleBackHashChangeCorrection = function () {
            dlog('handleBackHashChangeCorrection');
            hashChangedHandler = null;
            setTimeout(waitingForBackTranslationComplete,
                       POLLING_INTERVAL);
        };
        
        const handleForwardHashChangeCorrection = function () {
            dlog('handleForwardHashChangeCorrection');
            hashChangedHandler = null;
            setTimeout(waitingForForwardTranslationComplete,
                       POLLING_INTERVAL);
        };
        
        
        const Initialize = function () {
            dlog('Initialize');
            window.addEventListener('hashchange', handleHashChange);
            const siblingForButton = GetSiblingForButton();
            CreateButton(siblingForButton);
        };
        
        Initialize();
        
    }catch(ex){
        alert(ex);
        dlog('Error: ' + ex);
    }
    dlog('finished');
})();

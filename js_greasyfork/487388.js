// ==UserScript==
// @name         RedditMotivator
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license      MIT
// @description  Replaces the whole reddit page with a quote
// @author       Njan.codes
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487388/RedditMotivator.user.js
// @updateURL https://update.greasyfork.org/scripts/487388/RedditMotivator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let quote = "GO DO THE RUST LAB(DS PRACTICALS) PROJECT PLEASE BRUV STOP LOOKING REDDIT BRUV";
    setTimeout(function(){
        const wholePage = document.getElementById('2x-container');
        wholePage.remove();


        let h1 = document.createElement('h1');
        let styleH1 = {
            background: 'gray',
            color: 'white',
            padding: '20px',
            fontSize: '100',
            textAlign: 'center',
            position: 'absolute',
            zIndex: '10000',
            width: '100%'
        }
        Object.assign(h1.style,styleH1);
        h1.innerHTML = quote;

        let body = document.body;
        body.insertBefore(h1,body.firstChild);
    },2000);

    setInterval(function (){

        let main = document.querySelector('main');
        let mastHead = document.querySelector('div.masthead');
        let nav = document.querySelector('nav');
        let morePost = document.querySelector('div.block');

        if(main != null){
            main.remove();
        }

        if(mastHead != null){
            mastHead.remove();
        }

        if(nav != null){
            nav.remove();
        }

        if(morePost != null){
            morePost.remove();
        }


    },100);

    // Your code here...
    
})();
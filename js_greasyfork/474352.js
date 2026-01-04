// ==UserScript==
// @name         PowerPlayground: Remove Icon
// @namespace    https://microblock.cc
// @version      0.2
// @description  Remove icon for pplay.vercel.app
// @author       You
// @match        https://pplay.vercel.app/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vercel.app
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474352/PowerPlayground%3A%20Remove%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/474352/PowerPlayground%3A%20Remove%20Icon.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let c=0;
    const i = setInterval(()=>{
        try{
            document.querySelector('header > * > *').remove()
            clearInterval(i)
        }catch(e){
            c++;
            if(c>100) clearInterval(i)
        }

    },10)
    })();
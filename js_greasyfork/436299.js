// ==UserScript==
// @name         jump
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  jump to blr-ray link
// @author       Mr Yao
// @match        https://www.blu-ray.com/deals/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/436299/jump.user.js
// @updateURL https://update.greasyfork.org/scripts/436299/jump.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    setTimeout(function(){
        document.querySelectorAll('.black')
            .forEach(
                e=>{
                    let img = e.querySelector('img');
                    if(img == null)
                        return;
                    let a = img.getAttribute('src');
                    console.log(a);
                    let id = a.substr(a.lastIndexOf("/")+1,a.length).replace("_large.jpg","");
                    let url = 'https://www.blu-ray.com/movies/Hickok-4K-Blu-ray/' + id;
                    e.setAttribute('href',url);
                }
            )
    },3000);
    // Your code here...
})();
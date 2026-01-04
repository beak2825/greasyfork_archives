// ==UserScript==
// @name         mymhh Hidden Ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Vidar
// @match        *://www.mymhh.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401623/mymhh%20Hidden%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/401623/mymhh%20Hidden%20Ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert('hello world');
    var obj = document.getElementsByTagName('div');
    document.body.style.padding="300px";
    for(let i = 0; i<obj.length; i++){
        console.log(i);
        console.log(obj[i].id);
        if((!obj[i].id.indexOf('yczbgs_'))||!(obj[i].id.indexOf('sjdb_div_'))||!(obj[i].id.indexOf('zczbgs'))||!(isNaN(obj[i].id)))
        {
            //console.log(i);
            //console.log(obj[i].id);
            obj[i].hidden = true;
        }
   }
})();
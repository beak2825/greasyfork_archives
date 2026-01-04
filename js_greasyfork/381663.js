// ==UserScript==
// @name         INCIDENT DATA SET
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  try to take over the world!
// @author       RUTHUVAN
// @match        https://vision01.csail.mit.edu/*
// @match        https://www.disasters.space/mturk/interface/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381663/INCIDENT%20DATA%20SET.user.js
// @updateURL https://update.greasyfork.org/scripts/381663/INCIDENT%20DATA%20SET.meta.js
// ==/UserScript==

(function() {
    'use strict';
//    var linebreak = document.createElement("br");
//document.getElementById("progressDiv").appendChild(linebreak);
//document.getElementById("progressDiv").appendChild(submitButton);
    var arr=[];
setTimeout(function(){
    var obj ={"index":"","truth":""}

    for (var i=1;i<data.length;i++)
    {
        obj ={"index":i+1,"truth":data[i].truth}
        if(obj.truth != undefined)
        {
       arr.push(obj)
        }
    }
    console.log(arr);}, 3000);


})();
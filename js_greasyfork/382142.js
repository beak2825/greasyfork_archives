// ==UserScript==
// @name         CPC LAB
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  try to take over the world!
// @author       RUTHUVAN
// @match        https://www.mturkcontent.com/dynamic/hit?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382142/CPC%20LAB.user.js
// @updateURL https://update.greasyfork.org/scripts/382142/CPC%20LAB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var linebreak = document.createElement("br");
document.getElementById("progressDiv").appendChild(linebreak);
document.getElementById("progressDiv").appendChild(submitButton);
    var arr=[];
setTimeout(function(){
    var obj ={"index":"","ANSWER":""}
         for (var i=0;i<data.length;i++)
    {
        if(data[i].a == false)
        {
        obj ={"index":i+1,"ANSWER":data[i].a}
            arr.push(obj)
        }
        else if(data[i].b == false)
        {
            obj ={"index":i+1,"ANSWER":data[i].b}
       arr.push(obj)
        }

            }
    console.log(arr);}, 3000);



})();
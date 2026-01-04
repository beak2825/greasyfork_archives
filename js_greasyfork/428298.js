// ==UserScript==
// @name         NO MORE STAR
// @namespace    http://supermicro.com/
// @version      0.5
// @description  auto click "next" in STAR
// @author       ME
// @match        http://super-opweb.supermicro.com/*/*/TrainingCourse.aspx*
// @match        http://super-opweb/*/*/TrainingCourse.aspx*
// @match        http://us-star.supermicro.com/*/TrainingCourse.aspx*
// @match        http://us-star/*/TrainingCourse.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428298/NO%20MORE%20STAR.user.js
// @updateURL https://update.greasyfork.org/scripts/428298/NO%20MORE%20STAR.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var debug = false;
    var done = false;
    var count = 0;
    var delay = 2000;
    var retry = 3;
    var id = setInterval(function(){
        if(debug){
            console.log("script runing...");
        }
        if(!document.querySelector("#btnNext").disabled) {
            done = true;
            if(debug){
                console.log("click next");
            }
            document.querySelector("#btnNext").click();
        }
        if(done){
            if(debug){
                console.log("in case of click fail,try 3 times");
            }
            count++;
        }
        if(done&&count>=retry){
            if(debug){
                console.log("done");
            }
            clearInterval(id);
        }
    },delay);
})();
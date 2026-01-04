// ==UserScript==
// @name         EVGA daily giveaway auto checker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.evga.com/member/elite/giveaway/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431173/EVGA%20daily%20giveaway%20auto%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/431173/EVGA%20daily%20giveaway%20auto%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const name = "apolo07618"
    //let item = document.getElementById('EVGAContent').getElementsByClassName('MainContent').getElementsByClassName('main').document.getElementById('showcase-wrapper');
    //let item = document.querySelectorAll('.disabled h3');
    //let item = document.getElementById('calendar-grid');
    function check(){
        let item = document.getElementsByClassName('disabled');
        for(var i in item){
            console.log(item[i]);
            let x = item[i];
            var y = x.children;
        //console.log(y[2].text);
            if(y.length!=0){
                console.log(y[3].innerText);
                if(y[3].innerText==("Winner:\n"+name)){
                    console.log("WINNER!!!");
                    alert("Congratulation!You win the prize!");
                }
            }
            //if(y[3].text)
        }
    }
    //let item = document.getElementsByClassName('disabled');
    //for(var i in item){
        //console.log(item[i]);
        //let x = item[i];
        //var y = x.children;
        //console.log(y[2].text);
        //console.log(y);
    //}
    //item.foreach(x=>console.log(x));
    //console.log(item[11]);
    //console.log(item);
    function reload(){
        console.log("reload");
        document.location.reload();
    }
    setTimeout(check,2000);
    let timestamp = new Date();
    timestamp.setHours(12);
    timestamp.setMinutes(0);
    console.log("hello");
    let timetoclock = timestamp.getTime() - (new Date()).getTime();
    timetoclock = timetoclock>0 ? timetoclock:(timetoclock+24*60*60*1000);
    console.log(timetoclock);
    setTimeout(function() {
        reload();
        setInterval(reload,24*60*60*1000);
    },timetoclock);
    //if (1) {
    //    setInterval(function() {document.location.reload()}, 24*60*60*1000)
    //}
})();

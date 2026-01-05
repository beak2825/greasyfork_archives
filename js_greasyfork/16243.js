// ==UserScript==
// @name         Johns Hopkins University/APL 1
// @namespace    saqfish
// @version      1
// @description  Johns Hopkins University/APL 
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/16243/Johns%20Hopkins%20UniversityAPL%201.user.js
// @updateURL https://update.greasyfork.org/scripts/16243/Johns%20Hopkins%20UniversityAPL%201.meta.js
// ==/UserScript==

var tds = [];
tds.push($('table > tbody').children().eq(2));
tds.push($('table > tbody').children().eq(3));
tds.push($('table > tbody').children().eq(5));
tds.push($('table > tbody').children().eq(6));

var tdsa = [];
    tdsa.push({
        a: tds[0],
        b: tds[1],
    });
 tdsa.push({
        a: tds[2],
        b: tds[3],
    });

console.log(tdsa);
var count = 0;

document.onkeydown = function(e) {
    console.log(count);
    if(count > 1){count = 0;}  
    if ((e.keyCode === 49) || (e.keyCode === 97)) {
        tdsa[count].a.css('background-color',"green");
        tdsa[count].b.css('background-color',"green");
        tdsa[count].a.children().eq(0).children().eq(0).prop('checked', true);
        
        count++;

    }

    if ((e.keyCode === 50) || (e.keyCode === 98)) {
       tdsa[count].a.css('background-color',"green");
       tdsa[count].b.css('background-color',"green");
       tdsa[count].b.children().eq(0).children().eq(0).prop('checked', true);
        count++;

    }

     if ((e.keyCode === 27)) {
        $('#submitButton').click();
    }


}

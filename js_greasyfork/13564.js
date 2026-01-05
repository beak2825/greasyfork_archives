// ==UserScript==
// @name         Project Endor (Zoltar) 1 
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.0
// @description  Car Website Evaluation
// @author       saqfish
// @include      https://www.google.com/evaluation/endor/mturk?*
// @grant        GM_log
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/13564/Project%20Endor%20%28Zoltar%29%201.user.js
// @updateURL https://update.greasyfork.org/scripts/13564/Project%20Endor%20%28Zoltar%29%201.meta.js
// ==/UserScript==

window.open($('body > h2 > a').attr('href'));
var monkeys = [];
monkeys.push($('body > form > div:nth-child(3) > div'));
monkeys.push($('body > form > div:nth-child(4) > span'));
monkeys.push($('body > form > div:nth-child(4) > div > ol'));
bttn = $('body > form > input[type="submit"]:nth-child(5)');
for( var i = 0;i<monkeys.length;i++){
    monkeys[i].hide();
}

$(document).keyup(function(e){
    if(e.keyCode === 27){
        $(bttn).click();
       
    }
});

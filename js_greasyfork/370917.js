// ==UserScript==
// @name         AUTO SHARE DESHBOARD
// @namespace    https://greasyfork.org/vi/scripts/370917-report-fake-viruss/code/Report%20Fake%20ViruSS.user.js
// @version      1.2.11
// @description  Script report by xala
// @author       You
// @include        /.*://.*facebook.com/gaming/streamer/?$/
//  @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://greasyfork.org/scripts/370782-xala-js/code/xalajs.js?version=618213
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370917/AUTO%20SHARE%20DESHBOARD.user.js
// @updateURL https://update.greasyfork.org/scripts/370917/AUTO%20SHARE%20DESHBOARD.meta.js
// ==/UserScript==

var MIN = 5; // số phút tối thiểu để auto rp
var MAX = 15; // số phút tối đa auto rp
var RANDOM_THOI_GIAN_CLICK = true;


function randomize(a,b) {
    if (!RANDOM_THOI_GIAN_CLICK) {return 0;}
    return Math.floor(Math.random() * (b-a)) + a;
    
}

var intv;
var intv2;
if(/streamer/i.test(window.location.href)){
    console.log('Reporting page function initializing');
    $(document).arrive('._6h2k', function(){
        setTimeout(function() {
            intv = setInterval(function(){$('._6h2k').click();},1000);
            $(document).unbindArrive('._6h2k');
        },randomize(200,1100));
    });

    $(document).arrive('.uiContextualLayer ul li a[href*="Request.Shares"] ._6ff7', function(){
        clearInterval(intv);
        setTimeout(function() {
            $('.uiContextualLayer ul li a[href*="Request.Shares"] ._6ff7').click();
            $(document).unbindArrive('.uiContextualLayer ul li a[href*="Request.Shares"] ._6ff7');
        },randomize(1200,2100));
    });
}
var THOI_GIAN_REPORT = Math.round(Math.random() * (MAX - MIN) + MIN);
console.log('The random roll landed on ' + THOI_GIAN_REPORT + ' minute(s).');
setTimeout(function(){location.reload();},1000*60*THOI_GIAN_REPORT);
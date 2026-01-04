// ==UserScript==
// @name        Push Scrape
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Tehapollo
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @include      *pushbullet.com*
// @grant        GM_log
// @description  Life Finds A Way
// @downloadURL https://update.greasyfork.org/scripts/392356/Push%20Scrape.user.js
// @updateURL https://update.greasyfork.org/scripts/392356/Push%20Scrape.meta.js
// ==/UserScript==

setTimeout(function() {
//Set your stuff here//
var minpay = .35
var mintask = 50
var sound = new Audio('https://themushroomkingdom.net/sounds/wav/drm64_mario2.wav'); // .wav or .mp3 url file
var soundfilelength = 5 // in seconds
var scrapetime = 5 //in seconds
///////////////////////

let cachedwork = []
$('<h6><h6/><input type="button" value="Start" id="Start"/>').insertAfter('#picker');
$('<input type="button" value="Stop" id="Stop"/>').insertAfter('input#Start');
$('<input type="button" value="Clear Alert" id="Clear"/>').insertAfter('input#Stop');


$("input#Start").click(function() {
var startchecker = setInterval(function(){ push_check(); }, scrapetime * 1000);
$("input#Stop").click(function() {
clearInterval(startchecker);
});
});

function soundbox(){
sound.play();
}

function push_check(){
var data = $(".text-part").last()[0].innerHTML
var data2 = data.split('</div>')[0];
var result = data2.substring(data2.lastIndexOf(">") + 1)
var pay1 = result.substring(result.lastIndexOf("$") + 1)
var payfinal = pay1.split('-')[0].trim();
var task = result.split("-")[2];
var taskfinal = task.split("hits")[0].trim();
$("input#Clear").click(function() {
clearInterval(soundstarter);
});


if ($(".text-part")[0] && !cachedwork.includes(result) && payfinal >= minpay && taskfinal >= mintask ){
cachedwork.push(result)
var soundstarter = setInterval(function(){soundbox(); }, soundfilelength * 1000);
sound.play();
notify(result)
}
function notify(obj) {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        let notification = new Notification('New Hybrid work', {
            icon: 'https://www.shareicon.net/download/2016/11/14/852458_h-square_512x512.png',
            body: result
        });

        notification.onclick = function () {
          window.open("https://www.gethybrid.io/workers/projects?pinterest=1");
        };
    }
}


 }



},1000);



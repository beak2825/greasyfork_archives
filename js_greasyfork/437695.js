// ==UserScript==
// @name         onvideo.hu++
// @namespace    onvideohu++
// @version      1.1
// @description  A fő oldal és a videólejátszó kevesebb felesleges dolgot mutat. Plusz gomb a videólejátszón, amivel meg lehet nyitni a videót új oldalon, a beépített HTML5 lejátszóval.
// @author       Skyfighteer
// @run-at       document-end
// @include      https://onvideo.hu/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437695/onvideohu%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/437695/onvideohu%2B%2B.meta.js
// ==/UserScript==

function waitForElementSth(onload, callback){
    let check = setInterval(function(){
        if (document.querySelectorAll('.timer')[0]) {
            clearInterval(check);
            callback();
        }
    }, 100);
}

// ad, seen, timer, like
waitForElementSth('', function(){

//onkid ad
try {
    document.getElementById('kikapcsol').parentNode.remove();
    console.log('onkid ad removed');
}
catch {
  console.log('FAIL: onkid ad remove');
}

// seen
try {
let elements = document.querySelectorAll('.vSeen'), elLength = elements.length;
for (let i = 0; i < elLength; i++) {
    elements[i].remove();
    console.log('seen removed');
    }
}
catch {
  console.log('FAIL: seen remove');
}

// timer
try {
let elements = document.querySelectorAll('.timer'), elLength = elements.length;
for (let i = 0; i < elLength; i++) {
    elements[i].remove();
    console.log('timer removed');
    }
}
catch {
 console.log('FAIL: timer remove');
}

// heart
try {
let elements = document.querySelectorAll('.heartit'), elLength = elements.length;
for (let i = 0; i < elLength; i++) {
    elements[i].remove();
    console.log('heart removed');
    }
}
catch {
  console.log('FAIL: heart remove');
}

});


// ------------------ uploaded video player cleanup -------------

if (document.querySelectorAll('video')[0]) {

// create an open in external player button
let btn = document.createElement("button");
btn.innerHTML = "EXT";
btn.onclick = function () {
window.open(document.querySelectorAll('video')[0].getAttribute('src'), '_blank');
};
document.querySelector('.vjs-control-bar').insertBefore(btn, document.querySelector('.vjs-playback-rate')); // sebesseg allito

// cleanup
function waitForElementUploaded(onload, callback){
    let check = setInterval(function(){
        if(document.getElementsByClassName('vjs-brand-container')[0]){
            clearInterval(check);
            callback();
        }
    }, 100);
}

waitForElementUploaded('', function(){
    document.getElementsByClassName('vjs-brand-container')[0].remove(); // remove the logo from the player
    document.getElementsByClassName('vjs-playback-rate-value')[0].remove(); // remove the ugly red numbers from the playback button
    document.getElementsByClassName('vjs-context-menu')[0].remove(); // remove the context menu that comes up on right click
});

}

// -------- youtube video player cleanup -----------

if (document.getElementById('tvideo_Youtube_api')) {

// create an open in external player button
let btn = document.createElement("button");
btn.innerHTML = "EXT";
btn.onclick = function () {
window.open(document.getElementById('tvideo_Youtube_api').getAttribute('src'), '_blank');
};
document.querySelector('.vjs-control-bar').insertBefore(btn, document.querySelector('.vjs-playback-rate')); // sebesseg allito

// cleanup
function waitForElementYoutube(onload, callback){
    let check = setInterval(function(){
        if(document.getElementsByClassName('vjs-ishd')[0]){
            clearInterval(check);
            callback();
        }
    }, 100);
}

waitForElementYoutube('', function(){
    document.getElementsByClassName('vjs-brand-container')[0].remove(); // remove the logo from the player
    document.getElementsByClassName('vjs-playback-rate-value')[0].remove(); // remove the ugly red numbers from the playback button
    document.getElementsByClassName('vjs-context-menu')[0].remove(); // remove the context menu that comes up on right click
    document.getElementsByClassName('vjs-ishd')[0].remove(); // remove the auto text from quality selector
});

}

/*
onvideo.hu++
A fő oldal és a videólejátszó kevesebb felesleges dolgot mutat. Plusz gomb a videólejátszón, amivel meg lehet nyitni a videót új oldalon, a beépített HTML5 lejátszóval.
*/
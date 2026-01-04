// ==UserScript==
// @name         Feedly Youtube Playlist
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://feedly.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405196/Feedly%20Youtube%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/405196/Feedly%20Youtube%20Playlist.meta.js
// ==/UserScript==

(function () {
'use strict';

    var stateObj = {
    foo: "bar",
};

    var doStuff = function(){
var t = document.getElementsByClassName('unread')
//var ctr = 10;
var ctr = parseInt(document.getElementsByClassName("hint centered")[0].innerText.split(" ")[1], 10);
//ctr = ctr -1;
var index = 0
var aa = []
//await sleep(2000);
Array.prototype.forEach.call(t, function(e) {
if(index<ctr) {
var link = e.getAttribute('data-alternate-link')
aa.push(link)
demo(e);
} else if(index===(ctr-1)) {
playlist(aa)
end()
}
index += 1
});
playlist(aa)
end()
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo(e) {
await sleep(2000);
e.click()
}

async function end() {
await sleep(4000);
document.getElementsByClassName('close-button icon-fx-cross-ios-sm-black')[0].click()
}

function playlist(aa){

var URI = "http://www.youtube.com/watch_videos?video_ids=";
var final = URI;
var counter = 1;
aa.forEach(function(n, index) {

if(counter <= 20) { // As youtube only allows 20 videos/playlist in this case
final += n.split("?v=")[1] + ","
counter += 1;
} else {
console.log(final);
final = URI;
counter = 1;
final += n.split("?v=")[1] + ","
counter += 1;
}

});
console.log(final);
window.open(final);

}
    }

    document.onkeydown = function(evt) {
    evt = evt || window.event;
    if (evt.keyCode == 89) {
        doStuff();
    }
};


  // document.getElementsByClassName('titleBar')[0].onclick = function(e){
      // doStuff()
//}
})();


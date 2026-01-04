// ==UserScript==
// @name         copy url (w/ localhost stuff)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bruv
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428131/copy%20url%20%28w%20localhost%20stuff%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428131/copy%20url%20%28w%20localhost%20stuff%29.meta.js
// ==/UserScript==


    function copyStringToClipboard (str) {
   // Create new element
   var el = document.createElement('textarea');
   // Set value (string to be copied)
   el.value = str;
   // Set non-editable to avoid focus and move outside of view
   el.setAttribute('readonly', '');
   el.style = {position: 'absolute', left: '-9999px'};
   document.body.appendChild(el);
   // Select text inside element
   el.select();
   // Copy text to clipboard
   document.execCommand('copy');
   // Remove temporary element
   document.body.removeChild(el);
}
function wait_for_bar(){

if (document.querySelector("#date > yt-formatted-string > #copy") == undefined) {
var copyBut = document.querySelector("#date > yt-formatted-string").appendChild(document.createElement("button"))
copyBut.innerHTML = 'copy URL'
    copyBut.id='copy'
    copyBut.onclick = function() {
       copyStringToClipboard(window.location.href.substring(0,43))
    }
}
    if (document.querySelector("#date > yt-formatted-string > #ready") == undefined) {
var clipready = document.querySelector("#date > yt-formatted-string").appendChild(document.createElement("button"))
clipready.innerHTML = 'ready'
    clipready.id='ready'
    clipready.onclick = function() {
        document.querySelector("#date > yt-formatted-string > #ready").style.backgroundColor = 'yellow'
       const http = new XMLHttpRequest()
       var url = window.location.href.substring(0,43)
        http.open("GET", "http://127.0.0.1:5000//getstream?url="+url)
        http.onreadystatechange = finish;
        http.send()
    }
        function finish()
{
    document.querySelector("#date > yt-formatted-string > #ready").style.backgroundColor = 'green'
}
}
if (document.querySelector("#date > yt-formatted-string > #cstart") == undefined) {
var clipstart = document.querySelector("#date > yt-formatted-string").appendChild(document.createElement("button"))
clipstart.innerHTML = 'clip'
    clipstart.id='cstart'
    clipstart.onclick = function() {
       const http = new XMLHttpRequest()
       var url = window.location.href.substring(0,43)
        http.open("GET", "http://127.0.0.1:5000//query-example?url="+url)
        http.send()
    }
}
if (document.querySelector("#date > yt-formatted-string > #end") == undefined) {
var clipend = document.querySelector("#date > yt-formatted-string").appendChild(document.createElement("button"))
clipend.innerHTML = 'stop'
    clipend.id='end'
    clipend.onclick = function() {
       const http = new XMLHttpRequest()
       http.open("GET", "http://127.0.0.1:5000/stop")
http.send()
    }
}
    var but = document.querySelector("#date > yt-formatted-string > #copy")
but.parentNode.appendChild(but)

}
var interval1 = setInterval(wait_for_bar, 1000)
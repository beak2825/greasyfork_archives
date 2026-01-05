// ==UserScript==
// @name        Sergey Schmidt
// @description Tell us whether we found the right labels for this YouTube video.
// @version       0.1
// @include       https://s3.amazonaws.com*
// @icon        https://cdn2.iconfinder.com/data/icons/animals/48/Panda.png  
// @author        Blank
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/13873/Sergey%20Schmidt.user.js
// @updateURL https://update.greasyfork.org/scripts/13873/Sergey%20Schmidt.meta.js
// ==/UserScript==

//?rel=0&autoplay=1

document.getElementById('instructions').style.display = "none";
document.getElementById('multi-table-container').style.display = "none";
var but = document.createElement("span");
but.innerHTML = "Instructions"
but.style.color = "#1170A0";
but.style.textDecoration = "underline";
but.style.cursor = "pointer";
document.getElementById('instructions').parentNode.insertBefore(but,document.getElementById('instructions'));
but.addEventListener("mousedown",function() {
    if (document.getElementById('instructions').style.display == "none") {
        document.getElementById('instructions').style.display = "block";
        document.getElementById('multi-table-container').style.display = "block";
    } else if (document.getElementById('instructions').style.display == "block") {
        document.getElementById('instructions').style.display = "none";
        document.getElementById('multi-table-container').style.display = "none";
    }}, false);
document.addEventListener('keydown',function(i) {
    if (i.keyCode == 49) {//1
        document.getElementById('submitButton').click()
    }}, false);


var rads = document.getElementsByTagName('input')
for (var f = 0; f < rads.length; f++){
    if(rads[f].value == 'OFF_TOPIC'){
        rads[f].click()
    }
}


//document.getElementsByTagName('iframe')[2].src += '?rel=0&autoplay=1'

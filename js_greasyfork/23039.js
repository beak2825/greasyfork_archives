// ==UserScript==
// @name         Gif Skin Agarlist
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Add skin changing
// @author       Howly
// @match        http://agarlist.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23039/Gif%20Skin%20Agarlist.user.js
// @updateURL https://update.greasyfork.org/scripts/23039/Gif%20Skin%20Agarlist.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 400;
var skinList = ["http://i.imgur.com/VBhK5Pq.jpg",
                "http://i.imgur.com/EU6rWcF.jpg",
                "http://i.imgur.com/npAMFcQ.jpg",
                "http://i.imgur.com/qyQsSMh.jpg",
                "http://i.imgur.com/na1s933.jpg",
                "http://i.imgur.com/LVc7CBm.png",
                "http://i.imgur.com/J3OUB7Y.jpg",
                "http://i.imgur.com/5thoaBa.jpg",
                "http://i.imgur.com/sDzFe1k.jpg",
                
                
               ];
window.addEventListener('keydown', keydown);
function keydown(e) {
        if(e.keyCode === 67 && !($("#input_box2").is(":focus"))) {
        skinChanger = !skinChanger;
        }
        if(e.keyCode === 27) {
        skinChanger = false;
        }
   }
//$('.content').append('<input style="border:1px solid grey;" placeholder="Time between skin change (milliseconds)" id="skin_change_inputSpeed" value="500" type="number" min="300"/>');

setInterval(function(){
    if(skinChanger) {
    document.getElementById('skin_url').value = skinList[i];
    i++;
    if(i === skinList.length) {i = 0;}
    setNick(document.getElementById('nick').value);
          }
    },skinSpeed);
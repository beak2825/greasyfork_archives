// ==UserScript==
// @name         H0T3 D0G3 HACK AGARLIST
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  Add skin changing
// @author       ÂNGELO
// @match        http://alis.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22866/H0T3%20D0G3%20HACK%20AGARLIST.user.js
// @updateURL https://update.greasyfork.org/scripts/22866/H0T3%20D0G3%20HACK%20AGARLIST.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 900;
var skinList = ["http://i.imgur.com/Hf5okn6.png",
                "http://i.imgur.com/DokHtL5.png",
                "http://i.imgur.com/EIIdCA6.png",
                "http://i.imgur.com/5f8PDee.png",
                "http://i.imgur.com/PKBkVCa.png",
                "http://i.imgur.com/bZWygIa.png",
                "http://i.imgur.com/LVPiqbl.png",
                "http://i.imgur.com/80qtiJs.png",
                "http://i.imgur.com/80qtiJs.png",
                "http://i.imgur.com/RXv3mOU.png",
                "http://i.imgur.com/ZFw8I8H.png",
                "http://i.imgur.com/U3Q0rnd.png",
                "http://i.imgur.com/DKIpJZJ.png",
                "http://i.imgur.com/jN1ZwZ6.png",
                "http://i.imgur.com/drMAcCh.png",
                "http://i.imgur.com/zdcFxNA.png",
                "http://i.imgur.com/i7UQe8h.png",
                "http://i.imgur.com/35Hg4KO.jpg",
                "http://i.imgur.com/0rd1ez7.jpg",
                "http://i.imgur.com/qeJsYx7.png",
                "http://i.imgur.com/tPV1Ofc.png",
                "http://i.imgur.com/z3Tk7MJ.png",
                "http://i.imgur.com/dEggQ2K.png",
                "http://i.imgur.com/s3pCy3J.jpg",
                "http://i.imgur.com/dUMSkwe.png",
                "http://i.imgur.com/4rnaj02.png",
                "http://i.imgur.com/bKMJOqd.png",
                "http://i.imgur.com/hieOiwb.jpg",
                "http://i.imgur.com/mE6Abw8.png",
                "http://i.imgur.com/VBhK5Pq.jpg",
                "http://i.imgur.com/EU6rWcF.jpg",
                "http://i.imgur.com/npAMFcQ.jpg",
                "http://i.imgur.com/qyQsSMh.jpg",
                "http://i.imgur.com/na1s933.jpg",
                "http://i.imgur.com/LVc7CBm.png",
                "http://i.imgur.com/J3OUB7Y.jpg",
                "http://i.imgur.com/5thoaBa.jpg",
                "http://i.imgur.com/sDzFe1k.jpg",
                "http://i.imgur.com/UWa75ul.jpg",
                "http://i.imgur.com/yG11JkD.jpg",
                "http://i.imgur.com/3ZYYXHH.jpg",
                "http://i.imgur.com/oLGjuiK.jpg",
                "http://i.imgur.com/0K1EGBU.jpg",
                "http://i.imgur.com/h2aukSA.png",
                "http://i.imgur.com/9Xk2Gv7.jpg",
                "http://i.imgur.com/VXKyGPg.png",
                
                
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
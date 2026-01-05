// ==UserScript==
// @name          Dillon Gif script
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Add skin changing
// @author       Tinsten
// @match        http://alis.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23308/Dillon%20Gif%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/23308/Dillon%20Gif%20script.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 100;
var skinList = ["http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_0_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_1_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_2_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_3_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_4_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_5_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_6_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_7_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_8_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_9_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_10_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_11_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_12_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_13_delay-0.04s.gif",
                "http://im.ezgif.com/tmp/fbad1ae443-gif-im/frame_14_delay-0.04s.gif",
                
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
//$('#overlays2').append('<h6 style="margin-left:500px">Agarlist Skin Changer by Tinsten</h6>')
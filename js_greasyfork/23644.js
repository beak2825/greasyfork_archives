// ==UserScript==
// @name         iWubbz agarlist skin change code
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  Add skin changing
// @author       iWubbz
// @match        http://alis.io/
// @match        http://warlis.io/
// @match        http://agarlist.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23644/iWubbz%20agarlist%20skin%20change%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/23644/iWubbz%20agarlist%20skin%20change%20code.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 500;
var skinList = ["",
                "",
				"",
				"",
			
               
                
                
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
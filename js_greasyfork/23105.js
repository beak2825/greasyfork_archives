// ==UserScript==
// @name         SKin changer by Kaneki-agar
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Skin Changer enjoy
// @author       Kaneki-Agar
// @match        http://agarlist.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23105/SKin%20changer%20by%20Kaneki-agar.user.js
// @updateURL https://update.greasyfork.org/scripts/23105/SKin%20changer%20by%20Kaneki-agar.meta.js
// ==/UserScript==
var skinChanger = false;
var i = 0
var skinSpeed = 3;
var skinList = ["http://i.imgur.com/XBImIfo.jpg",
                "http://i.imgur.com/lOvs0dr.jpg",
                "http://i.imgur.com/jfBE57Q.jpg",
                "http://i.imgur.com/jI9aU4A.jpg",
                "http://i.imgur.com/RRKXN0q.jpg",
                "http://i.imgur.com/Oo19xE9.png",
                "http://i.imgur.com/HDNU3IL.png",
                "http://i.imgur.com/Eyri4Px.png",
                "http://i.imgur.com/xsIuZ3Y.jpg",
                "http://i.imgur.com/r6kP23L.png",
                "http://i.imgur.com/3MtuQ7X.jpg",
                "http://i.imgur.com/E4pTtaq.jpg",
                "https://i.imgur.com/o8AArDj.png",
                "http://i.imgur.com/COaZM0P.png",
                "https://i.imgur.com/Fqi7sJv.png",
                "http://i.imgur.com/zohYATb.png",
                "http://i.imgur.com/0leNT5J.jpg",
                "http://i.imgur.com/f1x42NS.png",
                "http://i.imgur.com/rmI9PDU.jpg",
                "http://i.imgur.com/2A4qvt1.png",
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
//$('#overlays2').append('<h6 style="margin-left:500px">Agarlist Skin Changer by Kaneki-Agar</h6>')
 
 
//To put it on press c, add skins by "skin url", enjoy
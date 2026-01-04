// ==UserScript==
// @name         4chan Image Roll Script
// @namespace    http://tampermonkey.net/
// @version      4.20666
// @description  I made this to roll for images in 4chan threads. Mainly for masturbation purposes.
// @author       Taylor
// @match        http://boards.4chan.org/*
// @match        https://boards.4chan.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374238/4chan%20Image%20Roll%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/374238/4chan%20Image%20Roll%20Script.meta.js
// ==/UserScript==

(function() {

//add CSS
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".selectedIMG{ background-image: url(\"http://www.pngmart.com/files/3/Left-Arrow-PNG-File.png\"); animation: blinker2 2s ease-out infinite; background-repeat: no-repeat; background-position: center; width: 100%!important; background-size: 10% 100%; } #rollBtn { position: fixed; bottom: 0; right: 0; opacity: .5; margin: 5px; font-size:15px; border-radius: 50%; } #rollFlash { position: fixed; bottom: 0; right: 0; margin: 30px; animation: blinker 1s linear infinite; } @keyframes blinker { 50% { opacity: 0; } } @keyframes blinker2 { 50% { background: rgba(76, 175, 80, 0) } }";
document.body.appendChild(css);

//add a function called imgRoll()
function imgRoll() {
//check if .selectedIMG is there
if (document.querySelector(".selectedIMG") !== null ) {
document.querySelector(".selectedIMG").classList.remove("selectedIMG");
};

var images = document.querySelectorAll('.fileThumb');
var randomGen = Math.floor(Math.random() * images.length);
var totalNum = images.length - 1;

console.log('You rolled number ' + randomGen + ' out of ' + totalNum);
console.log(images[randomGen]);


//flash message
    function flashMessage() {
    //check if #rollFlash exists
    if (document.querySelector("#rollFlash") !== null ) {
        document.querySelector("#rollFlash").remove();
    };

    var flashItem = document.createElement("span");
    var textnode = document.createTextNode('You rolled number ' + randomGen + ' out of ' + totalNum);
    flashItem.id = "rollFlash";
    flashItem.appendChild(textnode);
    var beforeBtn = document.getElementById("rollBtn");
    beforeBtn.before(flashItem);

    //turn it into a timeout so it's an actual flash message
        setTimeout(function(){
            document.querySelector("#rollFlash").remove();
            
        }, 10000);
};

//Add selectedIMG class (Blinking arrow), then scroll to the selected image
images[randomGen].classList.add("selectedIMG");
images[randomGen].scrollIntoView({ block: 'center', behavior: 'smooth' });
flashMessage();
};

//create a roll button
    var btn = document.createElement("BUTTON");
    var textRoll = document.createTextNode("⚄");
    btn.id = 'rollBtn';
    btn.appendChild(textRoll);
    document.body.appendChild(btn);

//make the button roll
document.getElementById("rollBtn").onclick = imgRoll;

})();
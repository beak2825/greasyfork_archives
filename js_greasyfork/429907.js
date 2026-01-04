// ==UserScript==
// @name         Indreams DreamsCom Maker
// @version      0.102
// @description  Adds a share link to Indreams using the drms.me format.
// @author       Mandogy
// @match        https://indreams.me/*
// @grant        none
// @namespace https://twitter.com/mandogy1
// @downloadURL https://update.greasyfork.org/scripts/429907/Indreams%20DreamsCom%20Maker.user.js
// @updateURL https://update.greasyfork.org/scripts/429907/Indreams%20DreamsCom%20Maker.meta.js
// ==/UserScript==

(function() {
    'use strict';
function my_script(){
    var buttons = document.getElementsByClassName("profile__controls");
 buttons = buttons[0];
 var badge = document.createElement("div");
 badge.className = "badge";
 var button = document.createElement("button");
 button.className = "Badge_Button";
 badge.appendChild(button);
 var button_text = document.createElement("span");
 button_text.className = "button_text";
 button_text.innerText = "Dreamscom Badge";
 button.appendChild(button_text);
 badge.setAttribute("style", "background-color:#1d0d3a; border-radius:20px; border:2px solid #8341ff; display:inline-block; cursor:pointer; color:#ffffff; font-family:Arial; font-size:17px; padding:10px 10px; text-decoration:none; text-shadow:0px 1px 0px #2f6627;");
 button_text.setAttribute("style", "color: #ffffff; font-family: DreamsIcons;");
 var username = document.getElementsByClassName("profile__titles")[0].children[0].innerText;
if(username == "MysteriousCube"){
  username = "Greg";
}
 document.querySelector("#main > section > div > div > div > header > div.profile__infobar > div.profile__infohead > div.profile__controlbar > div > div").appendChild(badge);
 var base_image = new Image();
 base_image.src = 'https://forums.indreams.me/hc/user_images/h43PtKHA4N_xQXJOuXo7Pw.png';
 base_image.className = "my_image";
 document.querySelector("#main > section > div > div > div > div.footer > div > header > div > div.brandlogos > a > span.icon.icon--mmlogo.icon--font > span").appendChild(base_image);
 base_image.style.display = "none";
 var tag = document.getElementsByClassName("profile__titles")[0].children[1].children[1].innerText;

 button.onclick = function(){
  var canvas = document.createElement("canvas");
  canvas.className = "image";
  canvas.setAttribute("height", 468);
  canvas.setAttribute("width", 332);
  document.querySelector("#main > section > div > div > div > div.profile__content > section > div.profile__block.profile__block--metadata > div > ul").remove();
  document.querySelector("#main > section > div > div > div > div.profile__content > section > div.profile__block.profile__block--metadata > div").appendChild(canvas);
  var context = canvas.getContext('2d');
  context.drawImage(base_image, 0, 0);
  var imp = document.getElementsByClassName("bt__container bt__container--user")[0].children[0];
  context.drawImage(imp, -40, 70);
  context.font = "30px DreamsIcons";
  context.fillStyle = "white";
  context.fillText(username, 35, 335);
  context.font = "20px DreamsIcons";
  context.fillStyle = "pink";
  context.fillText(tag, 35, 305);
 }
}
    var intervalID = window.setInterval(myCallback, 100);
var temp = 0;
function myCallback() {
    if(document.getElementsByClassName("bt__container bt__container--user").length == 2 && document.getElementsByClassName("share__list").length != 0 && temp == 0){
        temp = 1;
        console.log("Dreamscom Created");
        my_script();
    }
}

})();
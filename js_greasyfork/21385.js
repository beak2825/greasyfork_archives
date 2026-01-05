// ==UserScript==
// @name         RobloxScamScript by Sylveon
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script By Sylveon
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21385/RobloxScamScript%20by%20Sylveon.user.js
// @updateURL https://update.greasyfork.org/scripts/21385/RobloxScamScript%20by%20Sylveon.meta.js
// ==/UserScript==
var pic = "https://t1.rbxcdn.com/07b9eb66f13e7180e26fe57de10d443e";
var name = "wardo42";
var yourname = "YOUR USERNAME";
var roam = "195,024";
var userid = "4721131";

function FindByAttributeValue(value)    {
  var All = document.getElementsByTagName('*');
  for (var i = 0; i < All.length; i++)       {
    if (All[i].innerHTML == value) { return All[i]; }
  }
}
function doc_keyUp() {
    try {
    var els = FindByAttributeValue("Hello, " + yourname + "!");
   els.innerHTML = "Hello, " + name + "!";

var profilepic = document.getElementsByClassName("avatar-card-image")[0];
    profilepic.setAttribute("src",pic);
        }
        catch(err){

        
        }
    try {
         var robuxx = document.getElementById("nav-robux-amount");
    robuxx.innerHTML = roam;
                }
        catch(err){

        
        }
    try {
    document.getElementById("nav-profile").setAttribute("href","https://www.roblox.com/users/" + userid + "/profile");
            }
        catch(err){

        
        }
    try {
          document.getElementById("nav-inventory").setAttribute("href","https://www.roblox.com/users/" + userid + "/inventory");           
                }
        catch(err){

        
        }
    try {
         var robux = document.getElementsByClassName("text-overflow")[0];
    robux.innerHTML = name;
                }
        catch(err){

        
        }
    setTimeout(doc_keyUp, 0);
    }
               doc_keyUp();
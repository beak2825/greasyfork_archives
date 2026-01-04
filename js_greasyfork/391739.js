// ==UserScript==
// @name daddifier
// @namespace Violentmonkey Scripts
// @author ghostplantss
// @grant none
// @match *://www.tumblr.com/*
// @description replaces "the state" w "daddy" warning: this may reload the page i think and would also change things like "the statement" to daddyment and ultimately is a shitty program and i think it ought to stay that way 
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/391739/daddifier.user.js
// @updateURL https://update.greasyfork.org/scripts/391739/daddifier.meta.js
// ==/UserScript==
// 
// 
function replaceAll()
{
    document.body.innerHTML = document.body.innerHTML.replace(/the state/gi, "Daddy");
    document.body.innerHTML = document.body.innerHTML.replace(/the nation/gi, "Daddy");
    document.body.innerHTML = document.body.innerHTML.replace(/France/gi, "Daddy");
    document.body.innerHTML = document.body.innerHTML.replace(/saint-just/gi, "the horse");
    document.body.innerHTML = document.body.innerHTML.replace(/society/gi, "Daddy");
    document.body.innerHTML = document.body.innerHTML.replace(/the people/gi, "Daddy");
}


replaceAll();
var height =document.documentElement.scrollHeight;
window.addEventListener('scroll', function() {
//console.log(document.documentElement.scrollHeight);
if(document.documentElement.scrollHeight-height>100)
{
    replaceAll();
    height = document.documentElement.scrollHeight;
    //console.log("BAM");
}
});
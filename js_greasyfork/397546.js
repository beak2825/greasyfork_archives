// ==UserScript==
// @name         NHentai only english
// @namespace    Dar9586
// @version      1.0
// @description  Make all search through NHentai use english language
// @author       Dar9586
// @license      https://opensource.org/licenses/MIT
// @match        *://nhentai.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397546/NHentai%20only%20english.user.js
// @updateURL https://update.greasyfork.org/scripts/397546/NHentai%20only%20english.meta.js
// ==/UserScript==

'use strict';
function hideEnglishTag(){
    let textBox=document.getElementsByName('q')[0];
    if(textBox.value.includes("language:english"))textBox.value=textBox.value.replace("language:english","").trim();
}
function englishMode(){
    let textBox=document.getElementsByName('q')[0];
    if(!textBox.value.includes("english"))textBox.value+=' language:english';
}
function redirectToEnglish(list){
    for (let item of list) {
        //                                 domain           type  name
        item.href=item.href.replace(/https:\/\/nhentai.net\/(.*)\/(.*)\//,'https://nhentai.net/search/?q=$1:"$2"+language:english');
    }
}
//remove english tag because it's ugly
hideEnglishTag();
//redirect if going to main page
if(window.location.pathname=="/")window.location.replace("https://nhentai.net/search/?q=language%3Aenglish");
//append english to end of query
document.getElementsByTagName('form')[0].onsubmit=englishMode;
//replace logo location
document.getElementsByTagName('nav')[0].childNodes[0].href='/search/?q=language%3Aenglish'
//when using tab in navbar
if(document.getElementById("tag-container")!=null)redirectToEnglish(document.getElementById("tag-container").getElementsByTagName("a"));
//on galleries
if(document.getElementById("tags")!=null)redirectToEnglish(document.getElementById("tags").getElementsByTagName("a"));

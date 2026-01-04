// ==UserScript==
// @name change furigana neat-reader
// @namespace autoconvertttags
// @author iniquitousx
// @description Automatically convert rt tags to custom tags that allow for selection using vocabtracker on neat-readers webapp
// @match https://*.neat-reader.com/webapp
// @license MIT
// @version 1.0
// @grant        GM_addStyle
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/470975/change%20furigana%20neat-reader.user.js
// @updateURL https://update.greasyfork.org/scripts/470975/change%20furigana%20neat-reader.meta.js
// ==/UserScript==



var intv = setInterval(function() {

//

var css = 'fg:before {	content: attr(t);	display: block;    font-size: 50%;    text-align: start;	line-height: 1.5;} fg {	display: inline-block;	text-indent: 0px;	line-height: normal;    -webkit-text-emphasis: none;	text-align: center;	line-height: 1;}';
setTimeout(()=>{
    GM_addStyle(css);
});


var rbTags1 = document.getElementsByTagName("ruby");

if(rbTags1.length < 1){
console.log("no elements");
return false;

}

clearInterval(intv);

var newTags = [];

console.log("looping");
const re = new RegExp('\<\/ruby\>\s*\<ruby\>');

document.body.innerHTML = document.body.innerHTML.replaceAll(re,'');
document.body.innerHTML = document.body.innerHTML.replaceAll(re,'');
document.body.innerHTML = document.body.innerHTML.replaceAll(re,'');

var rbTags = document.getElementsByTagName("ruby");

while (typeof rbTags !== "undefined" && rbTags.length>0){
    var rtTags = rbTags[0].getElementsByTagName("rt");

    var furigana = "";
    while (typeof rtTags !== "undefined" && rtTags.length>0){
        furigana = furigana + rtTags[0].textContent;
        rtTags[0].parentNode.removeChild(rtTags[0]);
    }

    var newTag = document.createElement("fg");
    const t = document.createAttribute("t");
    t.value = furigana;
    newTag.attributes.setNamedItem(t);
    newTag.textContent = rbTags[0].textContent;
    rbTags[0].parentNode.replaceChild(newTag, rbTags[0])
}

}, 300);
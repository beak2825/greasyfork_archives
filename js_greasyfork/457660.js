// ==UserScript==
// @name         GPA Calculator for Genesis Gradebook
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically calculates your gpa when you visit your gradebook
// @author       You
// @match        https://*.c2.genesisedu.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=genesisedu.com
// @grant        none
// @grant       GM.setValue
// @grant       GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457660/GPA%20Calculator%20for%20Genesis%20Gradebook.user.js
// @updateURL https://update.greasyfork.org/scripts/457660/GPA%20Calculator%20for%20Genesis%20Gradebook.meta.js
// ==/UserScript==
var texttotal=0
var i = 0
var count=0
while (true){
    try{
        var node = document.getElementsByClassName('cellRight')[i];
        console.log(i)
        var htmlContent = node.innerHTML;
        var textContent = node.textContent;
        textContent=textContent.split('.')[0]
        textContent=textContent.replace(/[^0-9]/g, "")
        textContent=(parseInt(textContent))
        if (textContent === parseInt(textContent, 10)){
            count=count+1
            if (textContent > 95-1 && textContent < 100+1) {
              texttotal=texttotal+4.33
            }
            if (textContent > 93-1 && textContent < 94+1) {
              texttotal=texttotal+4
            }
            if (textContent > 90-1 && textContent < 92+1) {
              texttotal=texttotal+3.67
            }
            if (textContent > 87-1 && textContent < 89+1) {
              texttotal=texttotal+3.33
            }
            if (textContent > 83-1 && textContent < 86+1) {
              texttotal=texttotal+3
            }
            if (textContent > 80-1 && textContent < 82+1) {
              texttotal=texttotal+2.67
            }
            if (textContent > 77-1 && textContent < 79+1) {
              texttotal=texttotal+2.33
            }
            if (textContent > 73-1 && textContent < 76+1) {
              texttotal=texttotal+2
            }
            if (textContent > 70-1 && textContent < 72+1) {
              texttotal=texttotal+1.67
            }
            if (textContent > 67-1 && textContent < 69+1) {
              texttotal=texttotal+1.33
            }
            if (textContent > 63-1 && textContent < 66+1) {
              texttotal=texttotal+1
            }
            if (textContent > 60-1 && textContent < 62+1) {
              texttotal=texttotal+0.67
            }
            if (textContent < 59+1) {
              texttotal=texttotal+0
            }
        }
        i=i+1
    }
    catch{
        break;
    }
}
var total=(texttotal/2)/(count/2)
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
var element=getElementByXpath("/html/body/table[1]/tbody/tr[2]/td/p[2]")
element.className="GPAcounter"
element.innerHTML = "GPA: "+total.toFixed(2)
 
function getgpa(textContent){
    textContent=textContent.split('.')[0]
    textContent=textContent.replace(/[^0-9]/g, "")
    if (textContent!=""){
        textContent=(parseInt(textContent))
        if (textContent === parseInt(textContent, 10)){
            if (textContent > 95-1 && textContent < 100+1) {
              texttotal=4.33
            }
            if (textContent > 93-1 && textContent < 94+1) {
              texttotal=4
            }
            if (textContent > 90-1 && textContent < 92+1) {
              texttotal=3.67
            }
            if (textContent > 87-1 && textContent < 89+1) {
              texttotal=3.33
            }
            if (textContent > 83-1 && textContent < 86+1) {
              texttotal=3
            }
            if (textContent > 80-1 && textContent < 82+1) {
              texttotal=2.67
            }
            if (textContent > 77-1 && textContent < 79+1) {
              texttotal=2.33
            }
            if (textContent > 73-1 && textContent < 76+1) {
              texttotal=2
            }
            if (textContent > 70-1 && textContent < 72+1) {
              texttotal=1.67
            }
            if (textContent > 67-1 && textContent < 69+1) {
              texttotal=1.33
            }
            if (textContent > 63-1 && textContent < 66+1) {
              texttotal=1
            }
            if (textContent > 60-1 && textContent < 62+1) {
              texttotal=0.67
            }
            if (textContent < 59+1) {
              texttotal=0
            }
            return (texttotal).toFixed(2)
        }
    }else{
        return('No Grades')
    }
}
 
var text
var gpatext
element = document.createElement('td');
element.classList.add('cellCenter')
text = document.createTextNode('GPA');
element.appendChild(text);
document.getElementsByClassName('listheading')[0].appendChild(element);
 
var even = document.getElementsByClassName('listroweven');
for (i = 0; i < even.length; i++) {
    element = document.createElement('td');
    element.classList.add('cellCenter')
    gpatext=getgpa(even[i].childNodes[5].innerText)
    text = document.createTextNode(gpatext);
    element.appendChild(text);
    even[i].appendChild(element);
}
 
var odd = document.getElementsByClassName('listrowodd');
for (i = 0; i < odd.length; i++) {
    element = document.createElement('td');
    element.classList.add('cellCenter')
    gpatext=getgpa(odd[i].childNodes[5].innerText)
    text = document.createTextNode(gpatext);
    element.appendChild(text);
    odd[i].appendChild(element);
}
 
var node_1 = document.createElement('DIV');
node_1.setAttribute('align', 'center');
var node_2 = document.createElement('DIV');
node_2.setAttribute('class', 'gpaindicator');
node_2.setAttribute('style', 'background-color: white; height: 20px; width: 20px;margin: 0 auto; margin-bottom: 15px; border: 1px solid black; clear: both;');
node_1.appendChild(node_2);
var node_3 = document.createElement('LABEL');
node_3.textContent="GPA Goal: "
node_1.appendChild(node_3);
var node_4 = document.createElement('INPUT');
node_4.className="gpagoalinput"
node_1.appendChild(node_4);
var mydiv=document.getElementsByClassName('GPAcounter')[0]
mydiv.parentNode.insertBefore(node_1, mydiv.nextSibling)
 
function checkstring(value){
    if (parseFloat(value)<=5){
        return value
    }else{
        return '5'
    }
}
 
function getgpagoal(){
    var gpagoal=window.localStorage.getItem('gpagoal');
    checkgpagoal()
    if(null === gpagoal)
    {
        gpagoal = '5';
    }
    return gpagoal
}
 
function checkgpagoal(){
    var gpagoal=window.localStorage.getItem('gpagoal');
    var currentgpa=document.getElementsByClassName('GPAcounter')[0].innerText.replace('GPA: ','')
    currentgpa=currentgpa.split('/')[0]
    if ((parseFloat(currentgpa))>=(parseFloat(gpagoal))){
        document.getElementsByClassName('gpaindicator')[0].style.backgroundColor="green"
    }else if ((parseFloat(currentgpa))<(parseFloat(gpagoal))){
        document.getElementsByClassName('gpaindicator')[0].style.backgroundColor="red"
    }
}
 
(document.getElementsByClassName('GPAcounter')[0].innerText)=(document.getElementsByClassName('GPAcounter')[0].innerText.split('/')[0])+'/'+getgpagoal();
 
function gpagoalchange(){
    var value=document.getElementsByClassName('gpagoalinput')[0].value;
    window.localStorage.setItem('gpagoal', value);
    (document.getElementsByClassName('GPAcounter')[0].innerText)=(document.getElementsByClassName('GPAcounter')[0].innerText.split('/')[0])+'/'+checkstring(value)
    checkgpagoal()
}
 
document.getElementsByClassName('gpagoalinput')[0].addEventListener('change', gpagoalchange);
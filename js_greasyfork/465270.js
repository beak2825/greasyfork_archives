// ==UserScript==
// @name         hide-registered-exams-mendelu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hides exams you are already registered for
// @author       Jiří Daniel Šuster
// @match        https://is.mendelu.cz/auth/student/terminy_seznam.pl*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mendelu.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465270/hide-registered-exams-mendelu.user.js
// @updateURL https://update.greasyfork.org/scripts/465270/hide-registered-exams-mendelu.meta.js
// ==/UserScript==

let i = true;
var button = document.createElement("input");
button.type = "checkbox";
button.style.left = "10px";
button.style.top = "0px";
button.style.position = "relative";
button.style.zIndex = "99999";

var body = document.getElementById("table_2");
body.insertBefore(button, body.firstChild);

function HideShow(odstranit){
var listCourse = [];
var listDruhu = [];
var tbody1 = document.getElementById('table_1').getElementsByTagName('tbody')[0];
var tbody2 = document.getElementById('table_2').getElementsByTagName('tbody')[0];


tbody1.childNodes.forEach(element => {
    listCourse.push(element.childNodes[3].childNodes[0].innerText);
    listDruhu.push(element.childNodes[7].innerText);
});

tbody2.childNodes.forEach(elementt =>{

    if(odstranit){
        for(let i = 0; i<= listCourse.length; i++){
            if(elementt.childNodes[4].childNodes[0].innerText == listCourse[i] && elementt.childNodes[8].innerText == listDruhu[i]){
                elementt.style.display = "none";
                console.log("Hidden: " + elementt.childNodes[4].childNodes[0].innerText + " == " + listCourse[i] + "     and    " + elementt.childNodes[8].innerText +" == " + listDruhu[i]);
            }
        }
    }
    else{
        elementt.style.display = "";
    }
});}

button.addEventListener ("click", function() {
  HideShow(i);
     i = !i;
});

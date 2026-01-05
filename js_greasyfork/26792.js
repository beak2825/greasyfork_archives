// ==UserScript==
// @name         Save & Search Quiz By Pak Defndr
// @namespace    https://greasyfork.org/en/scripts/26476-copy-paste-bypasser
// @author       Pak Defndr
// @version      2.0.1
// @copyright    2017+, Pakdefndr
// @description  The userscript helps you to search your quiz instantly and save your quiz question in text file.No need to see copy paste enable on internet..
// @run-at       document-start
// @include      http://quiz.vu.edu.pk/*
// @include      http://quiz.vu.edu.pk*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26792/Save%20%20Search%20Quiz%20By%20Pak%20Defndr.user.js
// @updateURL https://update.greasyfork.org/scripts/26792/Save%20%20Search%20Quiz%20By%20Pak%20Defndr.meta.js
// ==/UserScript==

(function () {
    var a = document.createElement('a');
a.setAttribute('href','#');
a.setAttribute('target','_blank');
a.setAttribute('class','btn');
a.setAttribute('id','a');
a.setAttribute('style','margin-right:3px;');
a.innerHTML = 'Save to Disk';
// apend the anchor to the body
// of course you can append it almost to any other dom element
document.getElementsByTagName('td')[0].appendChild(a);
//document.getElementsByTagName('table')[0].innerHTML += '<a href="#">Hello</a>';
var b = document.createElement('a');
textbox0 = document.getElementById('txtQuestion');
b.setAttribute('href','https://www.google.com.pk/search?q='+'"'+textbox0.value+'"');
b.setAttribute('target','_blank');
b.setAttribute('class','btn btn');
b.innerHTML = 'Search In Google';
// apend the anchor to the body
// of course you can append it almost to any other dom element
document.getElementsByTagName('td')[0].appendChild(b);
function download(text, name, type) {
  var a = document.getElementById("a");
   text = text.replace(/\n/g, "\r\n");
  var file = new Blob([text], {type: type});
  a.href = URL.createObjectURL(file);
  a.download = name;
}
    filename = document.getElementById('lblRemainingQs').innerHTML;
    SubjectC = document.getElementById('lblCourseCode').innerHTML;
    textbox0 = document.getElementById('txtQuestion');
    textbox1 = document.getElementById('lblAnswer0');
    textbox2 = document.getElementById('lblAnswer1');
    textbox3 = document.getElementById('lblAnswer2');
    textbox4 = document.getElementById('lblAnswer3');
    textbox = SubjectC+"\n"+"Question No."+filename+"\r\n"+textbox0.value+"\r\n"+textbox1.value+"\n"+textbox2.value+"\n"+textbox3.value+"\n"+textbox4.value+"\n"+"\r\n"+">>>>>>Made By Pak Defndr<<<<<<<<<";
    download(textbox, 'Question_'+filename+'.txt', 'text/plain');
})();

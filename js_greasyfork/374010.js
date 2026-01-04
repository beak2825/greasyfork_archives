// ==UserScript==
// @name         Google Drive generate html code for photos direct links
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  generate html code for all pictures in the folder
// @author       Cold Liu
// @match        *://drive.google.com/drive/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374010/Google%20Drive%20generate%20html%20code%20for%20photos%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/374010/Google%20Drive%20generate%20html%20code%20for%20photos%20direct%20links.meta.js
// ==/UserScript==

//waiting for page loading done and then show the button
window.onload = function(){
    var input=document.createElement("input");
    input.type="button";
    input.value="產生貼圖語法";
    input.onclick = go;
    input.setAttribute("style", "font-size:18px;position:absolute;top:700px;left:28px");
    document.body.appendChild(input);
};

function go(){
    var a = document.createElement("a");
    var html = ""; //string for the .txt content
    var m = document.getElementsByClassName('WYuW0e'); //find the number of photo
    if(m.length>0){
        for(var i=0;i<m.length;i++)
        {
            html += '<img src="https://drive.google.com/uc?id=' + m[i].dataset.id + '"><br>'; //generate html code for all of photos
        }
        a.href += "data:text,"+ html; //write to .txt file
        a.download = "html.txt"; //download .txt file
        a.click();
    }
}
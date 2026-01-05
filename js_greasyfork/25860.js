// ==UserScript==
// @name         Kopiowanie IP serwera
// @namespace    http://vertix.io/
// @version      1
// @description  Możesz kopiować ip serwera
// @author       KROKIk
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25860/Kopiowanie%20IP%20serwera.user.js
// @updateURL https://update.greasyfork.org/scripts/25860/Kopiowanie%20IP%20serwera.meta.js
// ==/UserScript==

function removeCurrent() {
    var elem = document.getElementById('serverKeyTxt'); 
    elem.parentNode.removeChild(elem);
    return false;
}
setTimeout(removeCurrent,600);

var div = document.getElementById("lobbySelectorCont");
var input = document.createElement("textarea");
input.name = "post";
input.maxLength = "15";
input.cols = "15";
input.rows = "1";
input.onclick = "SelectAll('txtarea')";
input.setAttribute("id", "newTxt");
div.appendChild(input);

var cssEdit2=document.createElement("style");cssEdit2.innerHTML="#newTxt{margin: -6px;margin-left: 1px;}";
document.body.appendChild(cssEdit2);

function newIpCheck(){
document.getElementById("newTxt").value = serverKeyTxt.innerHTML;
}
setInterval(newIpCheck, 2000);

$("#newTxt").focus(function() {
    var $this = $(this);
    $this.select();
    $this.mouseup(function() {
        $this.unbind("mouseup");
        return false;
    });
});

function SelectAll(id)
{
    document.getElementById(newTxt).focus();
    document.getElementById(newTxt).select();
}
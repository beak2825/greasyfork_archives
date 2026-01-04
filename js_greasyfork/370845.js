// ==UserScript==
// @name         Viral Tag spin
// @namespace    http://viraltag.com
// @version      2.1
// @description  Min 2 gambar
// @author       Programmer Sintesa
// @match        http://app.viraltag.com/upload
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370845/Viral%20Tag%20spin.user.js
// @updateURL https://update.greasyfork.org/scripts/370845/Viral%20Tag%20spin.meta.js
// ==/UserScript==

var p = document.createElement("p");
p.textContent = "Input Jumlah Gambar :";
p.setAttribute("style", "font-size:16px;position:absolute;top:490px;right:60px;");
document.body.appendChild(p);

var gambar = document.createElement("input");
gambar.type="text";
gambar.setAttribute("id", "jmlgambar");
gambar.value="";
gambar.setAttribute("style", "font-size:16px;position:absolute;top:520px;right:60px;");
document.body.appendChild(gambar);

var input=document.createElement("input");
input.type="button";
input.value=" Bismillah";
input.onclick = showSpin;
input.setAttribute("style", "font-size:16px;position:absolute;top:560px;right:100px;");
document.body.appendChild(input);

var refresh = setTimeout(function(){
		document.getElementsByClassName("fa fa-caret-down")[0].click();
	}, 4000);

function spintxt(){
    var input='';
    var matches, options, random;
    var regEx = new RegExp(/{([^{}]+?)}/);
    if(document.getElementById("upload-widget")){
        var id = document.getElementsByClassName("bulk-description form-control");
        var spin = id[0].value;
    while((matches = regEx.exec(spin)) !== null) {
            options = matches[1].split("|");
            random = Math.floor(Math.random() * options.length);
            spin = spin.replace(matches[0], options[random]);
    }
    return spin;
    }
}

function jmlGmbar(gambar){
    var loop = (gambar-1);
    var i;
    for (i = 0; i <= loop; i++) {
        var form= document.getElementById("dragEl-"+i);
        var form1 = form.getElementsByClassName("image-description form-control");
        var paragraph = form1[0];
        paragraph.focus();
        paragraph.textContent = spintxt();
    }
}

function showSpin(){
    var gambar = document.getElementById("jmlgambar").value;
    jmlGmbar(gambar);
}

// ==UserScript==
// @name         Sintesa Viraltag
// @namespace    http://viraltag.com
// @version      2.1
// @description  Min 2 gambar
// @author       Programmer Sintesa
// @match        http://app.viraltag.com/upload
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370853/Sintesa%20Viraltag.user.js
// @updateURL https://update.greasyfork.org/scripts/370853/Sintesa%20Viraltag.meta.js
// ==/UserScript==

var acakata = document.createElement("div");
acakata.setAttribute("id", "acakata");
document.body.appendChild(acakata);

var gambar = document.createElement("input");
gambar.type="text";
gambar.setAttribute("id", "okelah");
gambar.setAttribute("class", "jmlgambar alat-bantu");
gambar.setAttribute("placeholder", "Powered by Sintesa");
gambar.value="";
acakata.appendChild(gambar);

var input=document.createElement("input");
input.type="button";
input.value="Bismillah";
input.onclick = showSpin;
input.setAttribute("class", "tombol_bismillah alat-bantu");
acakata.appendChild(input);

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
    var gambar = document.getElementById("okelah").value;
    jmlGmbar(gambar);
}

biarkeren('#acakata {background: #F8FFCC;border: 1px solid #849f36;position: fixed;top: 20px;right: 20px;padding: 20px;z-index:10;}');
biarkeren('.alat-bantu {float: left;}');
biarkeren('.jmlgambar {margin-right: 5px;padding: 5px;width: 165px;}');
biarkeren('.tombol_bismillah {padding: 5px;width: 100px;}');
function biarkeren(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


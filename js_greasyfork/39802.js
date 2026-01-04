// ==UserScript==
// @name         Custom Skins by ΔᎥяωεв
// @namespace    Modified by Angel
// @version      0.1
// @description  try to take over the world!
// @author       Angel
// @match        *://*.agar.io/*
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/39802/Custom%20Skins%20by%20%CE%94%E1%8E%A5%D1%8F%CF%89%CE%B5%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/39802/Custom%20Skins%20by%20%CE%94%E1%8E%A5%D1%8F%CF%89%CE%B5%D0%B2.meta.js
// ==/UserScript==

function setSkin(){
if(document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)){localStorage.setItem("skin", document.getElementById('skin').value);}
document.getElementsByClassName('circle bordered')[0].src=document.getElementById('skin').value;
if(document.getElementById("h").checked == true){
localStorage.setItem("h", "3");document.getElementById('hh').click();
clearInterval(i);
}
else{localStorage.setItem("h", "2");document.getElementById('ss').click();
	}
}
function init(){
if(document.getElementsByClassName('circle bordered')[0] && document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)){
document.getElementById('skinLabel').style.display="none";document.getElementById('skinButton').className ="";document.getElementsByClassName('circle bordered')[0].style.display='block';document.getElementsByClassName('circle bordered')[0].src=document.getElementById('skin').value;
}
}
document.getElementsByClassName('form-group clearfix')[1].innerHTML+='<div style="width:34px;float:right;height:34px"><a href="javascript:void(0)" onclick="document.getElementsByClassName(\'circle bordered\')[0].src=document.getElementById(\'skin\').value;"><img height="34" src="http://i.imgur.com/eZuGVRv.png"></a></div><input placeholder="Paste image link here" id="skin" class="form-control" style="width:286px"<br><input type="checkbox" name="h" id="h"> Hide my nickname&nbsp;&nbsp;<a href="javascript:void(0)" onclick="document.getElementById(\'skin\').value=\'http://i.imgur.com/cWCh44x.png\'">Great Zilla</a>&nbsp;|&nbsp;<a href="javascript:void(0)" onclick="document.getElementById(\'skin\').value=\'http://i.imgur.com/OAR69bU.png\'">Kraken</a><a href="javascript:window.core.registerSkin(\'\'+document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 2,document.getElementById(\'skin\').value);" id="ss"></a><a href="javascript:window.MC.setNick(document.getElementById(\'nick\').value);window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 3, null);" id="hh"></div>';

if(localStorage.getItem("h") && localStorage.getItem("h")==3){document.getElementById("h").checked = true;}
if(localStorage.getItem("skin") && localStorage.getItem("skin").match(/^http(s)?:\/\/(.*?)+(jpg|bmp|png|gif)$/)){
document.getElementById('skin').value=localStorage.getItem("skin");
}
var i=setInterval(function(){init();},500);
if(document.getElementsByClassName('btn btn-play btn-primary')[0]){
document.getElementsByClassName('btn btn-play btn-primary')[0].addEventListener("click",setSkin , false);
}
if(document.getElementsByClassName('btn btn-play-guest btn-success')[0]){
document.getElementsByClassName('btn btn-play-guest btn-success')[0].addEventListener("click",setSkin , false);
}
if(document.getElementById('statsContinue')){
document.getElementById('statsContinue').addEventListener("click", function(){i=setInterval(function(){init();},500);}, false);
}
if(document.getElementsByClassName('form-group clearfix')[0] && document.URL.match(/agar\.io/g) && !document.getElementsByClassName('form-group clearfix')[0].innerHTML.match(/(.*?)ftbtn(.*?)/)){
document.getElementsByClassName('form-group clearfix')[0].innerHTML+='<br/><br/><br/><br/><a id="ftbtn" class="btn btn-info btn-settings" style="width:300px" href="https://ogario.ovh/skins/" target="_blank">Custom skins list</a><br/>';
}
if(document.getElementsByClassName('btn btn-info btn-settings')[1]){
document.getElementsByClassName('btn btn-info btn-settings')[1].addEventListener("click",function(){document.getElementById('h2u').style.display='none';} , false);
}
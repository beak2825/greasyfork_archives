// ==UserScript==
// @name        Upload.so & Uplod.ws
// @namespace   yadoh
// @description Quitar elementos innecesarios y evitar la descarga de virus
// @include     http*://upload.so/*
// @include     http*://uplod.ws/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24664/Uploadso%20%20Uplodws.user.js
// @updateURL https://update.greasyfork.org/scripts/24664/Uploadso%20%20Uplodws.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
$("#chkIsAdd").click();
//Ocultar partes innecesarias de la página
addGlobalStyle('img, .adsbygoogle, .mainfooter, #downloadBtnClick, #sDLbEiyY{display: none !important;}');
addGlobalStyle('#downloadBtnClickOrignal{ display: inherit !important; margin: auto;}');

//Quitar check y ocultarlo para evitar descargar virus
var chkboxes=document.getElementsByTagName('input')
for (var i=0; i < chkboxes.length; i++) {
  if (chkboxes[i].type=="checkbox") {
    chkboxes[i].checked=false;
  }
}
$("#downloadBtnClick").click();
$("#content").remove();
//Saltar al botón real de descarga
setInterval(click, 0);

function click()
{
 $("#downloadBtnClickOrignal").click();
}

//Descargar enlace real
var TargetLink = $("a:contains('Click here to download')")

if (TargetLink.length)
    window.location.href = TargetLink[0].href
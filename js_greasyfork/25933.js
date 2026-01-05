// ==UserScript==
// @name Iconfinder Curl command generator
// @namespace Violentmonkey Scripts
// @grant none
// @include	https://www.iconfinder.com/iconsets/*
// @version 1.1
// @description:en Generates curl commands to download multiple icons from Iconfinder
// @description Generates curl commands to download multiple icons from Iconfinder
// @downloadURL https://update.greasyfork.org/scripts/25933/Iconfinder%20Curl%20command%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/25933/Iconfinder%20Curl%20command%20generator.meta.js
// ==/UserScript==
function getLinks() {
var links = '';
var url = '';
$('#icons .downloadlink.btn.btn-small').each(function(v){
url = $(this).attr('href').split('/');
links += 'curl https://www.iconfinder.com'+$(this).attr('href')+" --create-dirs -o "+url[url.length-2]+"/"+url[url.length-4]+"_"+url[url.length-1]+"."+url[url.length-2]+"\n";
});
$('body').html('<pre>'+links+'\n</pre>');
}
function addButton(text, onclick) {
    cssObj = {position: 'fixed', bottom: '5px', right:'5px', 'z-index': 3}
    let button = document.createElement('button'), btnStyle = button.style
    document.body.appendChild(button)
    button.innerHTML = text
    button.onclick = onclick
    button.className = 'btn btn-small'
    btnStyle.position = 'fixed'
    Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
    return button
}
addButton('Get Links', getLinks);
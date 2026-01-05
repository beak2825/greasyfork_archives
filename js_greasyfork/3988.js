// ==UserScript==
// @name       A-chan script
// @namespace  a-chan1
// @version    1
// @description  Автоапдейт треда
// @match      http://a-chan.site88.net/res/*.html
// @copyright  2014+, You
// @downloadURL https://update.greasyfork.org/scripts/3988/A-chan%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/3988/A-chan%20script.meta.js
// ==/UserScript==


function updateThread(){
    var xmlHttp = null;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", document.location.href, false );
    xmlHttp.send( null );
    var xmlThreadLength = xmlHttp.responseText.split('class="reply" id=').length;
    var ThreadLength = document.getElementsByClassName('reply').length;
    if(xmlThreadLength > ThreadLength){
		document.getElementsByName('board')[0].parentNode.parentNode.innerHTML = xmlHttp.responseText.split('<hr>')[1];
    }
}
var updateTimer = setInterval(updateThread, 10000);
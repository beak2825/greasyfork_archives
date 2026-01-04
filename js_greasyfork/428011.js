// ==UserScript==
// @name         Skip Audio BouwInfraNet
// @description  een skip knop voor BouwInfraNet zodat je niet alles hoeft aan te horen
// @version      0.2
// @author       Tomas van Rijsse
// @match        *.bouwinfranet.nl/ilias.php*
// @icon         https://www.bouwinfranet.nl/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/21205
// @downloadURL https://update.greasyfork.org/scripts/428011/Skip%20Audio%20BouwInfraNet.user.js
// @updateURL https://update.greasyfork.org/scripts/428011/Skip%20Audio%20BouwInfraNet.meta.js
// ==/UserScript==

window.addEventListener('load', function() {

    var button = '<div id="skip" style="position: absolute;    left: -45px;    bottom: 0;    width: 45px;    height: 45px;   background-color: #6f7c6f;"'+
'       onclick="$(\'audio\')[0].currentTime = $(\'audio\')[0].duration - 0.5">'+
'	<div style="width: 35px;    height: 35px;    margin: 5px; cursor: pointer;">'+
'		<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"'+
'			 viewBox="0 0 480 480" style="enable-background:new 0 0 480 480;" xml:space="preserve" style="width:30px;height:30px;" fill="#FFFFFF">'+
'		<g>'+
'			<g>'+
'				<path d="M461.248,194.736l-128-128c-24.928-24.96-65.568-24.96-90.496,0C230.656,78.8,224,94.896,224,111.984'+
'					s6.656,33.184,18.752,45.248l82.752,82.752l-82.752,82.752C230.656,334.832,224,350.896,224,367.984s6.656,33.152,18.752,45.248'+
'					c12.096,12.096,28.16,18.752,45.248,18.752s33.152-6.656,45.248-18.752l128-128C473.344,273.168,480,257.072,480,239.984'+
'					S473.344,206.8,461.248,194.736z M438.624,262.608l-128,128c-12.128,12.096-33.12,12.096-45.248,0'+
'					c-12.48-12.48-12.48-32.768,0-45.248l105.376-105.376L265.376,134.608c-6.048-6.048-9.376-14.08-9.376-22.624'+
'					s3.328-16.576,9.376-22.624c6.24-6.24,14.432-9.376,22.624-9.376c8.192,0,16.384,3.136,22.624,9.344l128,128'+
'					c6.048,6.08,9.376,14.112,9.376,22.656S444.672,256.56,438.624,262.608z"/>'+
'			</g>'+
'		</g>'+
'		<g>'+
'			<g>'+
'				<path d="M237.248,194.736l-128-128c-24.928-24.96-65.568-24.96-90.496,0C6.656,78.8,0,94.896,0,111.984'+
'					s6.656,33.184,18.752,45.248l82.752,82.752l-82.752,82.752C6.656,334.832,0,350.896,0,367.984s6.656,33.152,18.752,45.248'+
'					c12.096,12.096,28.16,18.752,45.248,18.752s33.152-6.656,45.248-18.752l128-128C249.344,273.168,256,257.072,256,239.984'+
'					S249.344,206.8,237.248,194.736z M214.624,262.608l-128,128c-12.128,12.096-33.12,12.096-45.248,0'+
'					c-12.48-12.48-12.48-32.768,0-45.248l105.376-105.376L41.376,134.608C35.328,128.56,32,120.528,32,111.984'+
'					s3.328-16.576,9.376-22.624c6.24-6.24,14.432-9.376,22.624-9.376s16.384,3.136,22.624,9.344l128,128'+
'					c6.048,6.08,9.376,14.112,9.376,22.656S220.672,256.56,214.624,262.608z"/>'+
'			</g>'+
'		</g>'+
'		</svg>'+
'	</div>'+
'</div>'

    let waitingForMediaPlayer = null;
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == "attributes" && waitingForMediaPlayer == null) {
                waitingForMediaPlayer = setInterval(addSkipButton,500);
            }
        });
    });

    observer.observe(document.getElementById('res'), {
        attributes: true //configure it to listen to attribute changes, like the src attribute
    });

    function addSkipButton(){
        if($('#res').contents().find("#HMMediaBar").length > 0){
            $('#res').contents().find("#HMMediaBar").append(button);
            clearInterval(waitingForMediaPlayer);
            waitingForMediaPlayer = null;
        }
    }

});
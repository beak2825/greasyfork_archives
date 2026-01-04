// ==UserScript==
// @name         Agario Voice Chat Rooms
// @namespace    Agar.io Voice, Camera, Text Chat Rooms per server (ip/token), per password/clanTag
// @version      1.5
// @description  Agar.io Chat Rooms (Voice, Camera, Text, Share Screen) for Vanilla and mods kitty, ogario, ally, agar infinity, agar tool (Legend mod has it already) 
// @homepage     http://www.jimboy3100.github.io
// @author       Jimboy3100
// @icon         https://jimboy3100.github.io/banners/CropedImage128.gif
// @match        https://agar.io/*
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/31353/Agario%20Voice%20Chat%20Rooms.user.js
// @updateURL https://update.greasyfork.org/scripts/31353/Agario%20Voice%20Chat%20Rooms.meta.js
// ==/UserScript==
// Agario Voice Chat Rooms by Jimboy3100
//Opens Voice, Camera, Text Chat Rooms per server (ip/token), per password/clanTag for ingame communication

/*MIT License

Copyright (c) [2018] [The Legend Mod]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// Start of script

if (location.host == "agar.io") {
setTimeout(function (){ 
var IP;
var IP2;
var SIP;
var stateObj = { foo: "bar" };
var messageone;
//var currentIP;


if (messageone!="0"&&messageone!="1"){  //IF NOT using Legend Mod
if( $('#clantag').length ){ //If OGARio
includeCSSfile("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");
		$('#stream-mode').before('<button id="VoiceBtn" class="btn btn-info" style="background-color: transparent;"><i class="fa fa-microphone"></i></button>');
		$('#opennamechars').tooltip({
            title: "Voice & Camera Chat",
            placement: "bottom"
        });
		

			$("#VoiceBtn").click(function () {						
					var currentIP2=$("#server-token").val();
					var pass2=$("#clantag").val();
					//var currentIP2=currentIP.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(".","");currentIP2=currentIP2.replace(":","");
				//semiurl2=currentIP2 + $("#clantag").val() + "?name=" + $("#nick").val() +"&?ip=" + currentIP;	
				if (pass2!=""){
				semiurl2=currentIP2 + "pass="+pass2;	
				}
				else{
				semiurl2=currentIP2;	
				}			
			url2="https://talky.io/"+semiurl2;
			
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 3000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 5000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 8000);
			var win = window.open(url2, '_blank');						
		});	
}
else{ //If not OGARio
$('head').append('<link rel="stylesheet" type="text/css" href="http://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">');
    var a = WebSocket.prototype.send;
    window.__WS_send = WebSocket.prototype.send, WebSocket.prototype.send = function(b) {
        IP=this.url;
        try {
            var c = /((?:[0-9]{1,3}(?:\.|\-)){1,3}[0-9]{1,3})(?:.*?)?(\:[0-9]{1,5})/,
                d = c.exec(this.url);
            SIP="http://agar.io/?sip=" + d[1].replace(/-/g, '.') + d[2];
			IP2=d[1].replace(/-/g, '.') + d[2];
        } catch (e) {}
        try {
            a.apply(this, [b]), WebSocket.prototype.send = a
        } catch (e) {
            window.__WS_send.apply(this, [b]), WebSocket.prototype.send = window.__WS_send
        }
    }
$("#title").before('<button id="VoiceBtn" class="btn btn-warning btn-spectate btn-needs-server" data-itr="Open chat room"><i class="fa fa-microphone"></i>Voice Chat</button>');
			$("#VoiceBtn").click(function () {		
			var currentIP2=IP;currentIP2=currentIP2.replace("wss://live-arena-","");currentIP2=currentIP2.replace("agario.io/","");currentIP2=currentIP2.replace(".agar.io/","");
			semiurl2=currentIP2;	
			url2="https://talky.io/"+semiurl2;			
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 3000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 5000);
			setTimeout(function (){ $("#VoiceBtn").focusout();}, 8000);
			var win = window.open(url2, '_blank');						
		});	
	}	
}
}, 3000);
}
function includeCSSfile(href) {
    var head_node = document.getElementsByTagName('head')[0];
    var link_tag = document.createElement('link');
    link_tag.setAttribute('rel', 'stylesheet');
    link_tag.setAttribute('type', 'text/css');
    link_tag.setAttribute('href', href);
    head_node.appendChild(link_tag);
}
// Include javascript src file

//End of Script
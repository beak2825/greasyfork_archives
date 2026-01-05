// ==UserScript==
// @name         Agar.io HACK
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Linke Maustaste ist die W Taste, Rechte Maustaste ist die Leertste
// @description  Man kan sein namen ververgen und irgend ein skin ausem Internet nehmen z.b ein Stinkefinger.
// @description  AdBlocker geht ohne das da steht man soll ihn aus machen
// @author       xProxyRed
// @match        http://agar.io
// @match        http://agar.io/?ip=127.0.0.1:8081
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26593/Agario%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/26593/Agario%20HACK.meta.js
// ==/UserScript==

// Skin Function
function setSkin() {
    if (document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)) {
        localStorage.setItem("skin", document.getElementById('skin').value);
    }
    document.getElementsByClassName('circle bordered')[0].src = document.getElementById('skin').value;
    if (document.getElementById("h").checked === true) {
        localStorage.setItem("h", "3");
        document.getElementById('hh').click();
        clearInterval(i);
    } else {
        localStorage.setItem("h", "2");
        document.getElementById('ss').click();
    }
}

function init() {
    if (document.getElementsByClassName('circle bordered')[0] && document.getElementById('skin').value.match(/^http(s)?:\/\/(.*?)/)) {
        document.getElementById('skinLabel').style.display = "none";
        document.getElementById('skinButton').className = "";
        document.getElementsByClassName('circle bordered')[0].style.display = 'block';
        document.getElementsByClassName('circle bordered')[0].src = document.getElementById('skin').value;
    }
}
document.getElementsByClassName('form-group clearfix')[1].innerHTML += '<input placeholder="Paste your image link here" id="skin" class="form-control" style="width:320px" <div id="h2u"><font size="2" color="#FF0000"><center style="margin-top: 6px; margin-bottom: -15px;">You must enter a nickname to see your skin.</center></font> <br><center style="margin-bottom: -5px;"><input type="checkbox" name="h" id="h"> Hide your nickname</center><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 2,null);" id="ss"></a><a href="javascript:window.core.registerSkin(document.getElementById(\'nick\').value, null, document.getElementById(\'skin\').value, 3, null);" id="hh"></div>';

if (localStorage.getItem("h") && localStorage.getItem("h") == 3) {
    document.getElementById("h").checked = true;
}
if (localStorage.getItem("skin") && localStorage.getItem("skin").match(/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|jpeg|gif|png|bmp)/)) {
    document.getElementById('skin').value = localStorage.getItem("skin");
}
if(document.getElementById('statsContinue')){
    document.getElementById('statsContinue').addEventListener("click", function(){i=setInterval(function(){init();},500);}, false);
}
if (document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play-guest btn-success btn-needs-server')[0].addEventListener("click", setSkin, false);
}
if (document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0]) {
    document.getElementsByClassName('btn btn-play btn-primary btn-needs-server')[0].addEventListener("click", setSkin, false);
}
$(
//Maus Function
    function() {
        var feeddown = $.Event("keydown", { keyCode: 87}); //w button
        var feedup = $.Event("keyup", { keyCode: 87}); //w button
        var splitdown = $.Event("keydown", { keyCode: 32}); //space button
        var splitup = $.Event("keyup", { keyCode: 32}); //space button
        $(document).bind('mousedown', function(e) {
            if( (e.which == 3) ){
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
                //console.log("feed");
            }
            else if( (e.which == 1) ){
                $("body").trigger(splitdown);
                $("body").trigger(splitup);
                //console.log("split");
            }
        }).bind('contextmenu', function(e){
            e.preventDefault();
        });
        //alert("mouse enabled");
    }
)();
// AdBlocker 
	if(!('includes' in String.prototype)) {
       		String.prototype.includes = function(str, startIndex) {
                	return -1 !== String.prototype.indexOf.call(this, str, startIndex);
       		};
 	}

	var data = {
		"agar.io"        		: "#adbg, [data-itr*=ad]",
	};

	var site = window.location.href || document.URL;
		
	for(var url in data) {
		if(site.includes(url)) {
			remove = data[url];
			break;
		}
	}
				
	if(typeof remove !== "undefined") {
		GM_addStyle(
			remove + " {										\
				display: none !important;						\
				visibility: hidden !important;					\
				width: 0px !important;							\
				height: 0px !important;							\
			}"										
		);
		console.info("Dont Use AdBlock - Killer was active [Identification: " + remove + "].");
	}

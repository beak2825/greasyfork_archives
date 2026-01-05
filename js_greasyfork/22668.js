// ==UserScript==

// @name        Stickers Koh-Lanta

// @description Ajoute des stickers Koh-Lanta à JVC

// @author      Monarchisme

// @match       http://www.jeuxvideo.com/*

// @version			1.1

// @grant       none

// @noframes

// @namespace https://greasyfork.org/users/62597
// @downloadURL https://update.greasyfork.org/scripts/22668/Stickers%20Koh-Lanta.user.js
// @updateURL https://update.greasyfork.org/scripts/22668/Stickers%20Koh-Lanta.meta.js
// ==/UserScript==


var isChrome = !!window.chrome && !!window.chrome.webstore;

if(isChrome){
	var bGreasemonkeyServiceDefined     = false;

try {
    if (typeof Components.interfaces.gmIGreasemonkeyService === "object") {
        bGreasemonkeyServiceDefined = true;
    }
}
catch (err) {
    //Ignore.
}

if ( typeof unsafeWindow === "undefined"  ||  ! bGreasemonkeyServiceDefined) {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
}
}

unsafeWindow.add_txt = function(src){

	document.getElementById("message_topic").value += " "+src+" ";

};

function add_sticker(name,img_array){

	var tab = document.getElementsByClassName("jv-editor-toolbar")[0]

	var para = document.createElement("div");

	para.id = "sticker_"+name;

	para.innerHTML = name;

	para.style.margin = "4px";

	para.style.padding = "4px";

	para.style.cursor = "pointer";

	para.style.display = "inline-block";

	para.style.border = "1px solid #8A8A8A";

	para.style.borderRadius = "3px";

	tab.appendChild(para);

	para.addEventListener('click', function(event){ 

		var body = document.getElementsByClassName("f-stkrs")[0];

		body.innerHTML = "";

		for (var i = 0; i < img_array.length; i++) {

			body.innerHTML += '<div class="f-stkr-w"><div class="f-stkr f-no-sml"><span class="f-hlpr"></span><img onclick="add_txt(this.src)" src="'+img_array[i]+'" data-code=""></div></div>';

		}

	}, false);

};


add_sticker("Koh-Lanta",["http://image.noelshack.com/fichiers/2016/34/1471986168-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471986622-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471986872-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471987378-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471988489-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989050-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989086-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989951-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989985-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990304-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990448-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990469-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990508-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990922-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990976-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471991142-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471991463-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471991500-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471994528-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471994574-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472036067-image.png", "http://image.noelshack.com/fichiers/2016/34/1472036141-image.png", "http://image.noelshack.com/fichiers/2016/34/1472037430-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472037450-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472037472-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040649-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040680-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040703-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040736-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040762-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040786-image.png", "http://image.noelshack.com/fichiers/2016/34/1472040830-image.png", "http://image.noelshack.com/fichiers/2016/34/1472040854-image.png", "http://image.noelshack.com/fichiers/2016/34/1472040875-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040895-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040923-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040942-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040978-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041000-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041030-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041080-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041358-image.png", "http://image.noelshack.com/fichiers/2016/34/1472041424-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472244553-stickerjulie.png" ]);

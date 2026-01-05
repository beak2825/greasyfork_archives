// ==UserScript==

// @name        Stickers FRANKLIN

// @description Ajoute des stickers FRANKLIN à JVC

// @author      Monarchisme

// @match       http://www.jeuxvideo.com/*

// @version		1.0

// @noframes

// @namespace https://greasyfork.org/users/62597
// @downloadURL https://update.greasyfork.org/scripts/26205/Stickers%20FRANKLIN.user.js
// @updateURL https://update.greasyfork.org/scripts/26205/Stickers%20FRANKLIN.meta.js
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


add_sticker("FRANKLIN",["http://image.noelshack.com/fichiers/2017/52/1483239380-img-4773.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483239571-kouffar2.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483237395-gggggg.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483238401-rebeufrkl.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483238976-allah.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483237966-franklin-petit-bras.png", 
"http://image.noelshack.com/fichiers/2017/52/1483241146-rebeu.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483241163-hip.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483241155-gun.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483241152-frkl7.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483277628-frklmel.png",
"http://image.noelshack.com/fichiers/2017/52/1483277770-frkl-supris.png", 
"http://image.noelshack.com/fichiers/2017/52/1483277995-franklin.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483278450-2-salades.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483278896-franklindddd.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483279767-sticker-franklino4.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483279868-gt.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483280393-monarchismeuberalles.jpg", 
"http://image.noelshack.com/fichiers/2017/52/1483282537-3.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483282532-2.jpg",
"http://image.noelshack.com/fichiers/2017/52/1483282525-1.jpg"]);

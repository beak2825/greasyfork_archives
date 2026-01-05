// ==UserScript==

// @name        Stickers Koh-Lanta

// @description Ajoute des stickers Koh-Lanta à JVC

// @author      Monarchisme

// @match       http://www.jeuxvideo.com/*

// @version			3.2.2
// @grant       none

// @noframes

// @namespace https://greasyfork.org/users/62597
// @downloadURL https://update.greasyfork.org/scripts/22669/Stickers%20Koh-Lanta.user.js
// @updateURL https://update.greasyfork.org/scripts/22669/Stickers%20Koh-Lanta.meta.js
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


add_sticker("Koh-Lanta",["http://image.noelshack.com/fichiers/2016/35/1472843277-image1-1.jpg", "http://image.noelshack.com/fichiers/2016/35/1472843279-image2.jpg", "http://image.noelshack.com/fichiers/2016/35/1472843281-image3.jpg", "http://image.noelshack.com/fichiers/2016/35/1472843283-image4.jpg", "http://image.noelshack.com/fichiers/2016/34/1472311220-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472311312-image.png", "http://image.noelshack.com/fichiers/2016/34/1472311367-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472311449-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472311518-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472311553-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472311643-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471986168-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471986622-image.jpeg", "http://image.noelshack.com/fichiers/2016/35/1472850655-camille-sexy-koh-lanta-2012-6.jpg", "http://image.noelshack.com/fichiers/2016/34/1471986872-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471987378-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471988489-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989050-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989086-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989951-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471989985-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990304-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990448-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990469-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990508-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990922-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471990976-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471991142-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471991463-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471991500-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471994528-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1471994574-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472036067-image.png", "http://image.noelshack.com/fichiers/2016/34/1472036141-image.png", "http://image.noelshack.com/fichiers/2016/34/1472037430-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472037450-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472037472-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040649-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040680-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040703-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040736-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040762-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040786-image.png", "http://image.noelshack.com/fichiers/2016/34/1472040830-image.png", "http://image.noelshack.com/fichiers/2016/34/1472040854-image.png", "http://image.noelshack.com/fichiers/2016/34/1472040875-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040895-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040923-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040942-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472040978-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041000-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041030-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041080-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472041358-image.png", "http://image.noelshack.com/fichiers/2016/34/1472041424-image.jpeg", "http://image.noelshack.com/fichiers/2016/34/1472244553-stickerjulie.png", "http://image.noelshack.com/fichiers/2016/35/1472845300-je-vous-hagar.png", "http://image.noelshack.com/fichiers/2016/34/1471955118-picsart-08-23-01-15-14.jpg", "http://image.noelshack.com/fichiers/2016/35/1472842637-moundir.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955127-picsart-08-23-01-14-08.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955141-picsart-08-23-01-02-27.jpg", "http://image.noelshack.com/fichiers/2016/35/1472846382-ouch.png", "http://image.noelshack.com/fichiers/2016/34/1471955152-picsart-08-23-12-19-21.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955164-picsart-08-23-12-16-59.jpg", "http://image.noelshack.com/fichiers/2016/35/1472842441-laurisitas.jpg", "http://image.noelshack.com/fichiers/2016/35/1472846577-marc-face.jpg", "http://image.noelshack.com/fichiers/2016/35/1472845669-spohie.png",  "http://image.noelshack.com/fichiers/2016/34/1471955207-picsart-08-23-12-08-49.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955220-picsart-08-23-11-55-22.jpg", "http://image.noelshack.com/fichiers/2016/35/1472847497-ouch.png", "http://image.noelshack.com/fichiers/2016/34/1471955245-picsart-08-23-11-37-07.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955259-picsart-08-23-08-43-20.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955293-picsart-08-23-08-31-25.jpg", "http://image.noelshack.com/fichiers/2016/35/1472848856-nerveuse.png", "http://image.noelshack.com/fichiers/2016/35/1472849487-moulinnnnnnnnnnn.png", "http://image.noelshack.com/fichiers/2016/35/1472851264-1471990484-picsart-08-24-12-10-46.png",  "http://image.noelshack.com/fichiers/2016/34/1472303580-picsart-08-23-07-43-23.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955293-picsart-08-23-08-31-25.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955316-picsart-08-23-08-24-02.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955331-picsart-08-23-08-22-04.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955375-picsart-08-23-08-20-56.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955397-picsart-08-23-08-18-50.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955425-picsart-08-23-08-18-13.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955444-picsart-08-23-08-11-25.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955468-picsart-08-23-08-08-12.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955485-picsart-08-23-08-07-34.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955512-picsart-08-23-07-58-53.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955528-picsart-08-23-07-56-50.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955543-picsart-08-23-07-56-06.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955555-picsart-08-23-07-53-54.jpg", "http://image.noelshack.com/fichiers/2016/34/1471955567-picsart-08-23-07-53-21.jpg",
"http://image.noelshack.com/fichiers/2016/34/1471973699-picsart-08-23-03-56-16.jpg", "http://image.noelshack.com/fichiers/2016/34/1471973725-picsart-08-23-02-45-45.jpg", "http://image.noelshack.com/fichiers/2016/34/1471973736-picsart-08-23-02-47-51.jpg", "http://image.noelshack.com/fichiers/2016/34/1471975638-picsart-08-23-08-00-18.jpg", "http://image.noelshack.com/fichiers/2016/34/1471975649-picsart-08-23-07-56-56.jpg", "http://image.noelshack.com/fichiers/2016/34/1471975660-picsart-08-23-07-55-58.jpg", "http://image.noelshack.com/fichiers/2016/34/1471975670-picsart-08-23-07-54-44.jpg", "http://image.noelshack.com/fichiers/2016/34/1471975679-picsart-08-23-07-53-03.jpg", "http://image.noelshack.com/fichiers/2016/34/1471975688-picsart-08-23-07-43-23.jpg",
"http://image.noelshack.com/fichiers/2016/34/1471979055-picsart-08-23-09-00-26.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979064-picsart-08-23-08-59-38.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979073-picsart-08-23-08-56-30.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979083-picsart-08-23-08-53-05.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979093-picsart-08-23-08-51-29.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979103-picsart-08-23-08-50-37.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979149-picsart-08-23-08-48-17.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979159-picsart-08-23-08-46-29.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979168-picsart-08-23-08-44-09.jpg", "http://image.noelshack.com/fichiers/2016/35/1472848875-pzirnpizrngpzirngzg.png", "http://image.noelshack.com/fichiers/2016/34/1471979178-picsart-08-23-08-43-03.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979187-picsart-08-23-08-41-14.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979198-picsart-08-23-08-39-30.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979209-picsart-08-23-08-27-13.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979220-picsart-08-23-08-25-43.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979232-picsart-08-23-08-24-48.jpg",
"http://image.noelshack.com/fichiers/2016/34/1471979979-picsart-08-23-09-16-48.jpg", "http://image.noelshack.com/fichiers/2016/34/1471979989-picsart-08-23-09-15-50.jpg", "http://image.noelshack.com/fichiers/2016/34/1471980006-picsart-08-01-05-58-28.jpg", "http://image.noelshack.com/fichiers/2016/34/1471980019-picsart-08-23-09-15-00.jpg", "http://image.noelshack.com/fichiers/2016/34/1471980033-picsart-08-23-09-14-30.jpg", "http://image.noelshack.com/fichiers/2016/34/1471980046-picsart-08-23-09-11-28.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984437-picsart-08-23-10-29-33.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984446-picsart-08-23-10-28-50.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984457-picsart-08-23-10-27-15.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984466-picsart-08-23-10-23-35.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984476-picsart-08-23-10-17-44.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984484-picsart-08-23-10-16-27.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984494-picsart-08-23-10-12-20.png", "http://image.noelshack.com/fichiers/2016/34/1471984503-picsart-08-23-10-05-43.png", "http://image.noelshack.com/fichiers/2016/34/1471984512-picsart-08-23-10-03-38.jpg", 
"http://image.noelshack.com/fichiers/2016/35/1472845664-picsart-09-02-09-44-27.png", "http://image.noelshack.com/fichiers/2016/34/1471984521-picsart-08-23-10-00-01.png", "http://image.noelshack.com/fichiers/2016/34/1471984532-picsart-08-23-09-57-25.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984551-picsart-08-23-09-56-06.jpg", "http://image.noelshack.com/fichiers/2016/34/1471984561-picsart-08-23-09-53-01.png", "http://image.noelshack.com/fichiers/2016/34/1471984572-picsart-08-23-09-51-19.png", "http://image.noelshack.com/fichiers/2016/34/1472241921-jaune2.png", "http://image.noelshack.com/fichiers/2016/34/1472241922-rouge2.png", "http://image.noelshack.com/fichiers/2016/34/1472242253-jaune1.png", "http://image.noelshack.com/fichiers/2016/34/1472242253-rouge1.png", "http://image.noelshack.com/fichiers/2016/34/1472245371-stickerjulie3.png", "http://image.noelshack.com/fichiers/2016/34/1472311920-picsart-08-27-12-33-27.jpg",  "http://image.noelshack.com/fichiers/2016/34/1472311930-picsart-08-27-12-21-43.jpg", "http://image.noelshack.com/fichiers/2016/34/1472311940-picsart-08-26-11-56-12.jpg", "http://image.noelshack.com/fichiers/2016/34/1472311949-picsart-08-26-11-11-54.jpg", "http://image.noelshack.com/fichiers/2016/34/1471973736-picsart-08-23-02-47-51.jpg" ]);

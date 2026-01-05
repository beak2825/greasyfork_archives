// ==UserScript==
// @name         Stickers GDC
// @namespace    http://tampermonkey.net/
// @version      1.11
// @description  Add Stickers
// @author       Gamerfan8
// @match        http://www.jeuxvideo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23457/Stickers%20GDC.user.js
// @updateURL https://update.greasyfork.org/scripts/23457/Stickers%20GDC.meta.js
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

	var tab = document.getElementsByClassName("jv-editor-toolbar")[0];

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

add_sticker("GDC",["http://image.noelshack.com/fichiers/2016/39/1474907702-dlc.png","http://image.noelshack.com/fichiers/2016/39/1474992463-all-friends-1.png","http://image.noelshack.com/fichiers/2016/39/1474992466-all-friends-2.png","http://image.noelshack.com/fichiers/2016/39/1474992470-all-friends-3.png","http://image.noelshack.com/fichiers/2016/39/1474905905-bge.png","http://image.noelshack.com/fichiers/2016/39/1474910522-bloodborne-goty.png","http://image.noelshack.com/fichiers/2016/39/1474973516-vous-verray.png","http://image.noelshack.com/fichiers/2016/39/1474992483-believe.png","http://image.noelshack.com/fichiers/2016/39/1474906112-m-irma.png","http://image.noelshack.com/fichiers/2016/39/1474905920-eau-desert.png","http://image.noelshack.com/fichiers/2016/39/1474906099-kickstarter.png","http://image.noelshack.com/fichiers/2016/39/1474906083-flou.png","http://image.noelshack.com/fichiers/2016/39/1474905928-cinematographique.png","http://image.noelshack.com/fichiers/2016/39/1474906123-mighty.png","http://image.noelshack.com/fichiers/2016/39/1474906171-praise-the-sun.jpg","http://image.noelshack.com/fichiers/2016/39/1474906175-praise-the-sun-2.png","http://image.noelshack.com/fichiers/2016/39/1474906179-zombie.png"]);

add_sticker("Nintendo",["http://image.noelshack.com/fichiers/2016/39/1474992848-n-kids.png","http://image.noelshack.com/fichiers/2016/39/1474992853-remaster-nintendo.jpg","http://image.noelshack.com/fichiers/2016/39/1474992860-le-plus-beau.png ","http://image.noelshack.com/fichiers/2016/39/1474992865-no-games.png","http://image.noelshack.com/fichiers/2016/39/1474992868-fils-aime-3.jpg","http://image.noelshack.com/fichiers/2016/39/1474992910-regginator.png","http://image.noelshack.com/fichiers/2016/39/1474992877-fils-aime-1.jpg","http://image.noelshack.com/fichiers/2016/39/1474992879-fils-aime-2.jpg","http://image.noelshack.com/fichiers/2016/39/1474992874-fils-aime-rage.png","http://image.noelshack.com/fichiers/2016/39/1474992934-miyamoto-bulle.png","http://image.noelshack.com/fichiers/2016/39/1474992924-miyamoto-1.png","http://image.noelshack.com/fichiers/2016/39/1474992927-miyamoto-2.png","http://image.noelshack.com/fichiers/2016/39/1474992940-miyamoto-3.png","http://image.noelshack.com/fichiers/2016/39/1474992943-miyamoto-zelda.png","http://image.noelshack.com/fichiers/2016/39/1474992960-iwata-2.png","http://image.noelshack.com/fichiers/2016/39/1474992954-iwata-3.png","http://image.noelshack.com/fichiers/2016/39/1474992967-iwata-1.png","http://image.noelshack.com/fichiers/2016/39/1474992974-kimishima-1.png","http://image.noelshack.com/fichiers/2016/39/1474992979-ravi.png","http://image.noelshack.com/fichiers/2016/39/1474992983-pikachu-1.png"]);

add_sticker("Xbox",["http://image.noelshack.com/fichiers/2016/39/1474995468-knight-xbox.jpg ","http://image.noelshack.com/fichiers/2016/39/1474994776-remaster-xbox.jpg","http://image.noelshack.com/fichiers/2016/39/1474994780-bouseux.png","http://image.noelshack.com/fichiers/2016/39/1474994786-etoiles-et-constellations.png","http://image.noelshack.com/fichiers/2016/39/1474994826-spencer-mouton.png","http://image.noelshack.com/fichiers/2016/39/1474994821-spencer-2.png","http://image.noelshack.com/fichiers/2016/39/1474994805-i-promise.png","http://image.noelshack.com/fichiers/2016/39/1474994831-spencer-1.png","http://image.noelshack.com/fichiers/2016/39/1474994860-don-mattrick.png","http://image.noelshack.com/fichiers/2016/39/1474994863-usher.png"]);

add_sticker("Sony",["http://image.noelshack.com/fichiers/2016/39/1474995122-remaster-sony.jpg","http://image.noelshack.com/fichiers/2016/39/1474995460-knight-sony.jpg","http://image.noelshack.com/fichiers/2016/39/1474995128-plstation.png","http://image.noelshack.com/fichiers/2016/39/1474995160-kaz-hirai-1.png","http://image.noelshack.com/fichiers/2016/39/1474995163-kaz-hirai-2.png","http://image.noelshack.com/fichiers/2016/39/1474995188-yoshida.png","http://image.noelshack.com/fichiers/2016/39/1474995192-yoshida-2.png","http://image.noelshack.com/fichiers/2016/39/1474995196-kojima-1.png","http://image.noelshack.com/fichiers/2016/39/1474995199-kojima-2.png","http://image.noelshack.com/fichiers/2016/39/1474995204-kojima-3.png","http://image.noelshack.com/fichiers/2016/39/1474995207-crabe-sur-10-villejuif.png","http://image.noelshack.com/fichiers/2016/39/1474995212-tretton.png","http://image.noelshack.com/fichiers/2016/39/1474995216-drake-bg.png","http://image.noelshack.com/fichiers/2016/39/1474995224-fat-drake.png","http://image.noelshack.com/fichiers/2016/39/1474995227-ellie.png","http://image.noelshack.com/fichiers/2016/39/1474995231-kratos-1.png","http://image.noelshack.com/fichiers/2016/39/1474995234-kratos-2.png"]);

add_sticker("PC",["http://image.noelshack.com/fichiers/2016/39/1474919967-knight-steam.jpg","http://image.noelshack.com/fichiers/2016/39/1474919963-knight-steam-2.jpg","http://image.noelshack.com/fichiers/2016/39/1474919970-pc-gras.png","http://image.noelshack.com/fichiers/2016/39/1474919974-promo-steam.png","http://image.noelshack.com/fichiers/2016/39/1474906222-paysan.jpg","http://image.noelshack.com/fichiers/2016/39/1474919955-consolow.png","http://image.noelshack.com/fichiers/2016/39/1474919959-master-race.png","http://image.noelshack.com/fichiers/2016/39/1474919978-gaben.png"]);

add_sticker("Autres",["http://image.noelshack.com/fichiers/2016/39/1474911066-chieze.png","http://image.noelshack.com/fichiers/2016/39/1474913221-bollore-salut.png","http://image.noelshack.com/fichiers/2016/39/1474913227-bollore-money.png","http://image.noelshack.com/fichiers/2016/39/1474913231-bollore-rire.png","http://image.noelshack.com/fichiers/2016/39/1474913234-bollore-pdg.png","http://image.noelshack.com/fichiers/2016/39/1474913239-doge-nous-t-ecoutons.png","http://image.noelshack.com/fichiers/2016/39/1474913242-doge-serieux.png","http://image.noelshack.com/fichiers/2016/39/1474913260-extreme.png","http://image.noelshack.com/fichiers/2016/39/1474913263-serial-killer.png","http://image.noelshack.com/fichiers/2016/39/1474913763-mr-caffeine.png","http://image.noelshack.com/fichiers/2016/39/1474915376-sean-money.png","http://image.noelshack.com/fichiers/2016/39/1474915726-sean-blown.png","http://image.noelshack.com/fichiers/2016/39/1474913795-sean-murray-2.png","http://image.noelshack.com/fichiers/2016/39/1474905778-ancel-3.png","http://image.noelshack.com/fichiers/2016/39/1474905844-ancel-4.png","http://image.noelshack.com/fichiers/2016/39/1474913272-hashimoto-rire.png","http://image.noelshack.com/fichiers/2016/39/1474913276-inafune-1.png","http://image.noelshack.com/fichiers/2016/39/1474913320-suzuki.png","http://image.noelshack.com/fichiers/2016/39/1474913299-mr-bones.png","http://image.noelshack.com/fichiers/2016/39/1474913583-mouton-roi.png","http://image.noelshack.com/fichiers/2016/39/1474913293-mougeon-noel.jpg","http://image.noelshack.com/fichiers/2016/39/1474906201-locas-noel.jpg"]);

add_sticker("Koh-Lanta",["http://image.noelshack.com/fichiers/2016/38/1474652878-denis-1.png","http://image.noelshack.com/fichiers/2016/38/1474652914-denis-2.png","http://image.noelshack.com/fichiers/2016/38/1474652919-denis-3.png","http://image.noelshack.com/fichiers/2016/38/1474652925-denis-4.png","http://image.noelshack.com/fichiers/2016/38/1474652930-denis-anneau.png","http://image.noelshack.com/fichiers/2016/38/1474652934-denis-totem.png","http://image.noelshack.com/fichiers/2016/38/1474652943-pascal-1.png","http://image.noelshack.com/fichiers/2016/38/1474652966-pascal-samourai.png","http://image.noelshack.com/fichiers/2016/38/1474652961-pascal.png","http://image.noelshack.com/fichiers/2016/38/1474652948-pascal-2.png","http://image.noelshack.com/fichiers/2016/38/1474652955-pascal-3.png","http://image.noelshack.com/fichiers/2016/38/1474652989-gabriel-1.png","http://image.noelshack.com/fichiers/2016/38/1474653000-gabriel-2.png","http://image.noelshack.com/fichiers/2016/38/1474652977-marc.png","http://image.noelshack.com/fichiers/2016/38/1474652981-saint-marc.png","http://image.noelshack.com/fichiers/2016/38/1474653006-alain.png","http://image.noelshack.com/fichiers/2016/38/1474653015-huw.png","http://image.noelshack.com/fichiers/2016/38/1474653029-jeff.png","http://image.noelshack.com/fichiers/2016/38/1474653035-moundir.png","http://image.noelshack.com/fichiers/2016/38/1474653039-namadia.png","http://image.noelshack.com/fichiers/2016/38/1474653045-ratviere.png","http://image.noelshack.com/fichiers/2016/38/1474653050-teheiura.png","http://image.noelshack.com/fichiers/2016/38/1474653054-laurent.png","http://image.noelshack.com/fichiers/2016/38/1474653083-mohamed.png","http://image.noelshack.com/fichiers/2016/38/1474653060-julie.png","http://image.noelshack.com/fichiers/2016/38/1474653089-telephone.png"]);


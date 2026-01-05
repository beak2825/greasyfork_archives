// ==UserScript==

// @name        Tennis-Stickers+

// @description Ajoute des stickers à jvc

// @author      uzu2010, sur un modèle de Garrymod

// @match       http://www.jeuxvideo.com/*

// @version	1.3.1

// @grant       none

// @noframes


// @namespace https://greasyfork.org/users/74817
// @downloadURL https://update.greasyfork.org/scripts/24180/Tennis-Stickers%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/24180/Tennis-Stickers%2B.meta.js
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

add_sticker("Federer",[
"http://image.noelshack.com/minis/2016/35/1472829862-federer.png",
"http://image.noelshack.com/minis/2016/35/1472830509-federer1.png",
"http://image.noelshack.com/minis/2016/35/1472834624-fededieu.png",
"http://image.noelshack.com/minis/2016/35/1472905058-federerpls.png",
"http://image.noelshack.com/minis/2016/35/1472904487-stickerrodgeur.png",
"http://image.noelshack.com/minis/2016/35/1472914743-stickerfederer2.png",
"http://image.noelshack.com/minis/2016/35/1472915139-sitckerfederer3.png",
"http://image.noelshack.com/minis/2016/35/1472920887-stickerfederer4.png",
"http://image.noelshack.com/minis/2016/35/1472977812-federer-foot.png",
"http://image.noelshack.com/minis/2016/35/1473010884-1472854017-stickerslepers2.png",
"http://image.noelshack.com/minis/2016/35/1473012571-1472854017-stickerslepers2.png",
"http://image.noelshack.com/minis/2016/36/1473240554-fedousticker.png",
"http://image.noelshack.com/minis/2016/35/1472925125-federergod.png",
"http://image.noelshack.com/minis/2016/36/1473538635-federer.png",
"http://image.noelshack.com/minis/2016/35/1472917760-nadalfuckedbyfederersticker.png",
"http://image.noelshack.com/minis/2016/42/1477033684-roger-cimer.png",
"http://image.noelshack.com/minis/2016/42/1477080062-roger-violon.png",
"http://image.noelshack.com/minis/2016/42/1477143336-federer-bad.png",
"http://image.noelshack.com/minis/2016/42/1477143393-federer-barbe.png",
"http://image.noelshack.com/minis/2016/46/1479566986-federer-stress.png",
"http://image.noelshack.com/minis/2016/46/1479567287-roger-deg.png",
"http://image.noelshack.com/minis/2016/46/1479567504-federer.png",
"http://image.noelshack.com/minis/2017/05/1486146641-1479235754-3-federer.png",
"http://image.noelshack.com/minis/2017/01/1483364133-raging-roge.png",
"http://image.noelshack.com/fichiers/2017/01/1483732427-fed.png",
"http://image.noelshack.com/fichiers/2017/01/1483877298-babyfed.png",
"http://image.noelshack.com/fichiers/2017/04/1485174620-fedeprof.png",
"http://image.noelshack.com/fichiers/2017/04/1485314237-federer.png",
"http://image.noelshack.com/fichiers/2017/04/1485440026-trollerer.png",
"http://image.noelshack.com/fichiers/2017/04/1485440034-federreur.png",
"http://image.noelshack.com/fichiers/2017/04/1485474520-roger-risitas.png"
]);

add_sticker("Djokovic",[
"http://image.noelshack.com/minis/2016/35/1472831117-djokovic.png",
"http://image.noelshack.com/minis/2016/35/1472831594-djoko2.png",
"http://image.noelshack.com/minis/2016/35/1472910486-stickerdjokovic.png",
"http://image.noelshack.com/minis/2016/35/1472915084-sans-titre-4.png",
"http://image.noelshack.com/minis/2016/35/1472922124-sans-titre-3.png",
"http://image.noelshack.com/minis/2016/35/1472922375-stickerdjokovic2.png",
"http://image.noelshack.com/minis/2016/35/1473011810-untitled.png",
"http://image.noelshack.com/minis/2016/35/1473011945-1472854017-stickerslepers2.png",
"http://image.noelshack.com/minis/2016/35/1473012842-1472854017-stickerslepers2.png",
"http://image.noelshack.com/minis/2016/36/1473072415-hqdefault.png",
"http://image.noelshack.com/minis/2016/36/1473109421-djokovic.png",
"http://image.noelshack.com/minis/2016/36/1473460070-capture-d-ecran-2016-09-09-a-23-26-34.png",
"http://image.noelshack.com/minis/2016/36/1473470407-djokwhy.png",
"http://image.noelshack.com/minis/2016/36/1473470417-robot.png",
"http://image.noelshack.com/minis/2016/36/1473537063-djokovic-pls.png",
"http://image.noelshack.com/minis/2016/42/1477033702-cimer-chef.png",
"http://image.noelshack.com/minis/2016/42/1477143435-djoko-oups.png",
"http://image.noelshack.com/minis/2016/44/1477992402-djokoshoked.png",
"http://image.noelshack.com/minis/2016/44/1478116964-120129032535-djokovic-shirt-horizontal-gallery.png",
"http://image.noelshack.com/minis/2016/44/1478117252-meme6e38cf665f7ebe1f.png",
"http://image.noelshack.com/minis/2016/44/1478128113-djokopaixinterieure.png",
"http://image.noelshack.com/minis/2016/44/1478116976-pepe-imaz-gourou-novak-djokovic-w484.png",
"http://image.noelshack.com/minis/2017/05/1486143467-1479236781-1-hey.png",
"http://image.noelshack.com/minis/2017/05/1486146598-1479236962-10.png",
"http://image.noelshack.com/fichiers/2017/01/1483363928-djokobite.png",
"http://image.noelshack.com/fichiers/2017/01/1483732419-pic-100.png",
"http://image.noelshack.com/fichiers/2017/03/1484775102-jewkovic.png"
]);

add_sticker("Nadal",[
"http://image.noelshack.com/minis/2016/35/1472828857-1466702396-pawn3.png",
"http://image.noelshack.com/fichiers/2016/35/1472829056-nadal1.png",
"http://image.noelshack.com/minis/2016/35/1472830214-nadal3.png",
"http://image.noelshack.com/minis/2016/35/1472909140-stickernadal.png",
"http://image.noelshack.com/minis/2016/35/1472917469-sans-titre-1.png",
"http://image.noelshack.com/minis/2016/35/1472919790-stickernadal2.png",
"http://image.noelshack.com/minis/2016/35/1472999319-stickernadal3.png",
"http://image.noelshack.com/minis/2016/35/1473013750-nadal-bizarrement-naked.png",
"http://image.noelshack.com/minis/2016/35/1473014689-pic1.png",
"http://image.noelshack.com/minis/2016/35/1473015415-1472854017-stickerslepers2.png",
"http://image.noelshack.com/minis/2016/35/1473013279-nadal.png",
"http://image.noelshack.com/minis/2016/37/1474142991-nadal-pls.png",
"http://image.noelshack.com/minis/2016/42/1477073413-nadal-tu-sors.png",
"http://image.noelshack.com/minis/2016/42/1477143977-nadal-paf.png",
"http://image.noelshack.com/minis/2016/45/1478719565-nadal-whip.png",
"http://image.noelshack.com/minis/2016/47/1480016016-toni.png",
"http://image.noelshack.com/minis/2016/49/1481066302-202956-large.png",
"http://image.noelshack.com/minis/2016/49/1481066576-202956-large.png",
"http://image.noelshack.com/minis/2016/49/1481066684-202956-large.png",
"http://image.noelshack.com/fichiers/2017/01/1483364096-nadarire.png",
"http://image.noelshack.com/fichiers/2017/01/1483364109-nadal-fist.png",
"http://image.noelshack.com/fichiers/2017/01/1483454578-nadal-why-not.png",
"http://image.noelshack.com/fichiers/2017/01/1483454590-nadal-u-mad.png",
"http://image.noelshack.com/fichiers/2017/01/1483455620-nadassi.png",
"http://image.noelshack.com/minis/2017/01/1483490633-nadal-walk.png",
"http://image.noelshack.com/fichiers/2017/01/1483732410-nadal2.png",
"http://image.noelshack.com/fichiers/2017/04/1485382732-bg.png",
"http://image.noelshack.com/minis/2017/05/1485781636-93842734-nadal-epa.png"
]);

add_sticker("Murray",[
"http://image.noelshack.com/minis/2016/35/1472832494-murire.png",
"http://image.noelshack.com/minis/2016/35/1472924545-murraysticker.png",
"http://image.noelshack.com/minis/2016/35/1473012027-murray-noel.png",
"http://image.noelshack.com/minis/2016/42/1477003958-murray-pas-content.png",
"http://image.noelshack.com/minis/2016/42/1477007902-murrayball.png",
"http://image.noelshack.com/minis/2016/42/1477033711-cimer-murray.png",
"http://image.noelshack.com/minis/2016/42/1477073435-murrage.png",
"http://image.noelshack.com/minis/2016/42/1477073492-murray-snake-eater.png",
"http://image.noelshack.com/minis/2016/43/1477341500-murray.png",
"http://image.noelshack.com/minis/2016/45/1478861395-fond-blanc-svg.png",
"http://image.noelshack.com/fichiers/2016/46/1479566760-murray-honte.png",
"http://image.noelshack.com/fichiers/2017/01/1483732400-murray-in-shape.png"
]);

add_sticker("Français",[
// Tsonga
"http://image.noelshack.com/minis/2016/35/1472829494-tsonga.png",
"http://image.noelshack.com/minis/2016/35/1472906718-stickertsonga.png",
"http://image.noelshack.com/minis/2016/35/1472908567-tsongasticker2.png",
"http://image.noelshack.com/minis/2016/35/1472920994-tsongasticker.png",
"http://image.noelshack.com/minis/2016/35/1472924350-tsongix2.png",
"http://image.noelshack.com/minis/2016/45/1478609781-tsongixballe.png",
"http://image.noelshack.com/minis/2017/05/1486143663-1479236292-3-tsonga.png",
"http://image.noelshack.com/fichiers/2017/04/1485283783-tsongastickerclash.png",
// Monfils
"http://image.noelshack.com/minis/2016/35/1472905426-stickermonfils.png",
"http://image.noelshack.com/minis/2016/36/1473449572-1472905426-stickermonfils.png",
"http://image.noelshack.com/minis/2016/36/1473467691-pic-05.png",
"http://image.noelshack.com/minis/2016/36/1473468108-monfils.png",
"http://image.noelshack.com/minis/2016/42/1477209204-monfils-murder.png",
"http://image.noelshack.com/minis/2016/42/1477209300-macmonfils.png",
// Gasquet
"http://image.noelshack.com/minis/2016/35/1472832282-gasquet.png",
"http://image.noelshack.com/minis/2016/35/1472916920-gasquet5.png",
"http://image.noelshack.com/minis/2016/44/1477992428-angry-gasquet.png",
"http://image.noelshack.com/minis/2016/35/1473004160-gasquet-miami-2013.png",
"http://image.noelshack.com/minis/2016/45/1478610312-1478094820-fazeur.png",
"http://image.noelshack.com/minis/2016/44/1478273200-gasquet2.png",
"http://image.noelshack.com/minis/2016/44/1478273236-gasquet-not-bad.png",
"http://image.noelshack.com/minis/2016/44/1478273248-gasquette.png",
"http://image.noelshack.com/fichiers/2017/04/1485174608-gasqouch.png",
// Pouille
"http://image.noelshack.com/minis/2016/35/1472904151-stickerpouille.png",
"http://image.noelshack.com/minis/2016/36/1473073395-pouillestickersucette.png",
"http://image.noelshack.com/minis/2016/35/1473023929-1472854017-stickerslepers2.png",
// Paire
"http://image.noelshack.com/minis/2016/35/1472918766-benpairestickerr.png",
"http://image.noelshack.com/minis/2016/35/1472928546-benoitpairesticker2.png",
// Autres français
"http://image.noelshack.com/minis/2016/35/1473013681-simon-tired-2.png",
"http://image.noelshack.com/minis/2016/42/1476999941-mahut.png",
"http://image.noelshack.com/minis/2016/35/1472992394-stickerrayaneroumane.png",
"http://image.noelshack.com/minis/2016/42/1477129545-ddb.png",
"http://image.noelshack.com/minis/2016/42/1477209115-mannarino-de-nice.png"
]);

add_sticker("Autres",[
// Nishikori
"http://image.noelshack.com/minis/2016/35/1472910955-stickernishikori.png",
"http://image.noelshack.com/minis/2016/36/1473462012-kie.png",
"http://image.noelshack.com/minis/2017/05/1486063106-1478626279-sans-titre-1.png",
"http://image.noelshack.com/minis/2017/05/1486141878-1479154995-sans-titre-1.png",
"http://image.noelshack.com/fichiers/2017/04/1485129519-nishikoripls.png",
"http://image.noelshack.com/fichiers/2017/04/1485136451-seppukori.png",
// Wawrinka
"http://image.noelshack.com/minis/2016/35/1472831878-wawringag.png",
"http://image.noelshack.com/minis/2016/35/1472991896-stickerwawrinka.png",
"http://image.noelshack.com/minis/2016/35/1472993447-wawrinkaemmentalsticker.png",
"http://image.noelshack.com/minis/2016/36/1473537039-wawrinka-pls.png",
"http://image.noelshack.com/minis/2016/42/1477209150-wawringo.png",
"http://image.noelshack.com/minis/2016/44/1477993068-wawrinka-au-calmus.png",
"http://image.noelshack.com/minis/2017/05/1486143467-1479236149-3-1.png",
"http://image.noelshack.com/fichiers/2017/04/1485284144-wawrinka-l-embrouille.png",
// Raonic
"http://image.noelshack.com/minis/2016/35/1472911462-raonicsticker.png",
"http://image.noelshack.com/minis/2016/35/1473009466-raotry.png",
"http://image.noelshack.com/minis/2016/35/1473009780-raonic-tongueface-june3-zps7ucxszen.png",
"http://image.noelshack.com/minis/2016/35/1473011263-raonic.png",
// Krigyos
"http://image.noelshack.com/minis/2016/35/1472920079-sans-titre-1.png",
"http://image.noelshack.com/minis/2016/42/1477146647-kyrgios-rsa.png",
"http://image.noelshack.com/minis/2016/44/1478167782-kirgyioszzz.png",
"http://image.noelshack.com/minis/2016/45/1478609767-kirgyiosinjuste.png",
// Lorenzi
"http://image.noelshack.com/minis/2016/35/1473018086-lorenzi.png",
"http://image.noelshack.com/minis/2016/35/1473018093-lorenzi2.png",
// Fognini
"http://image.noelshack.com/minis/2016/35/1472991531-fogninisticker.png",
// Goffin
"http://image.noelshack.com/minis/2016/36/1473077309-goffin5.png",
"http://image.noelshack.com/minis/2016/42/1477168826-coolfin.png",
// Dimitrov
"http://image.noelshack.com/minis/2016/45/1478634690-dimitrov-2.png",
"http://image.noelshack.com/minis/2016/45/1478634754-sans-titre.png",
"http://image.noelshack.com/minis/2016/45/1478635023-dimitrov-3.png",
"http://image.noelshack.com/fichiers/2017/01/1483870294-grigor.png",
// Cilic
"http://image.noelshack.com/minis/2016/46/1479566465-cilic-dedaigneux.png",
"http://image.noelshack.com/minis/2017/05/1486143467-1479236819-1-hey.png",
// Autres
"http://image.noelshack.com/minis/2016/35/1472921353-sans-titre-1.png",
"http://image.noelshack.com/minis/2016/35/1472923052-sans-titre-2.png",
"http://image.noelshack.com/minis/2016/35/1472919414-sans-titre-1.png",
"http://image.noelshack.com/minis/2016/35/1472977186-karlovic-smile.png",
"http://image.noelshack.com/minis/2016/35/1472980693-ferrer-triste.png",
"http://image.noelshack.com/minis/2016/35/1473003460-btg.png",
"http://image.noelshack.com/minis/2016/35/1473007637-tomic-gay.png",
"http://image.noelshack.com/minis/2016/35/1473014190-troicki.png",
"http://image.noelshack.com/minis/2016/35/1472923860-sans-titre-1.png",
"http://image.noelshack.com/minis/2016/43/1477344872-darcis.png",
"http://image.noelshack.com/minis/2016/43/1477493062-isne.png",
"http://image.noelshack.com/minis/2016/44/1477992475-lahyani-goat.png",
"http://image.noelshack.com/minis/2016/44/1477992586-safin-quoi.png",
"http://image.noelshack.com/minis/2016/44/1478273147-robredo.png",
"http://image.noelshack.com/minis/2016/44/1478334912-thiem-allo.png",
"http://image.noelshack.com/minis/2016/45/1478718631-sela-master-race.png",
"http://image.noelshack.com/minis/2016/45/1478718663-topfiveneedle.png",
"http://image.noelshack.com/minis/2016/45/1478718695-kokki.png",
"http://image.noelshack.com/minis/2016/46/1479139601-dolgopolov.png",
"http://image.noelshack.com/minis/2016/46/1479139949-dolgoposmile.png",
"http://image.noelshack.com/minis/2016/46/1479140372-gulbis-smile-sticker.png",
"http://image.noelshack.com/minis/2016/46/1479566618-berdych-ouch.png",
"http://image.noelshack.com/minis/2017/05/1486141837-1479233819-2-grimace-2.png",
"http://image.noelshack.com/fichiers/2017/05/1486143466-1479234929-marcos-baghdatis1236-tbf.png",
"http://image.noelshack.com/minis/2017/05/1486141862-1479234290-images-4.png"
]);

add_sticker("Anciens",[
"http://image.noelshack.com/minis/2016/44/1478273186-safin.png",
"http://image.noelshack.com/minis/2016/35/1472924457-stickeryannicknoah.png",
"http://image.noelshack.com/fichiers/2017/05/1486143337-1479236467-1-my-man.png",
"http://image.noelshack.com/minis/2016/46/1479333823-becker-drunk.png",
"http://image.noelshack.com/minis/2017/05/1486141862-1479233527-2-grimace-1.png",
"http://image.noelshack.com/minis/2017/05/1486141889-1479234124-453931122.png",
"http://image.noelshack.com/minis/2017/05/1486143336-1479233214-images.png"
]);

add_sticker("WTA",[
"http://image.noelshack.com/minis/2016/36/1473116313-stickererrani.png",
"http://image.noelshack.com/minis/2016/45/1478610317-1478185327-bouchard-suceuse.png",
"http://image.noelshack.com/fichiers/2017/03/1484995454-williamsserena02.png"
]);

add_sticker("Tennis Eco+",[
"http://image.noelshack.com/minis/2016/42/1476836985-federer-eco.png",
"http://image.noelshack.com/minis/2016/42/1476836996-nadal-eco.png",
"http://image.noelshack.com/minis/2016/42/1476900506-nishikori-eco.png",
"http://image.noelshack.com/minis/2016/42/1476917937-djokovic-eco.png",
"http://image.noelshack.com/minis/2016/42/1476917954-murray-eco.png",
"http://image.noelshack.com/minis/2016/42/1476986761-del-potro-eco-version-argentine.png",
"http://image.noelshack.com/minis/2016/42/1476994820-tsonga-eco.png",
"http://image.noelshack.com/minis/2016/42/1476994840-gasquet-eco.png",
"http://image.noelshack.com/minis/2016/42/1476994854-wawrinka-eco.png",
"http://image.noelshack.com/minis/2016/45/1478657922-nishikopauvre.png"
]);
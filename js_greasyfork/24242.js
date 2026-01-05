// ==UserScript==

// @name        FF Stickers

// @description Ajoute des stickers à Jeuxvideo.com

// @author      NyXusOne

// @match       http://www.jeuxvideo.com/*
                http://www.forumjv.com/*

// @version			1.201

// @grant       none

// @noframes

// @namespace https://greasyfork.org/fr/users/75201
// @downloadURL https://update.greasyfork.org/scripts/24242/FF%20Stickers.user.js
// @updateURL https://update.greasyfork.org/scripts/24242/FF%20Stickers.meta.js
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
;
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



add_sticker("FF",["http://image.noelshack.com/fichiers/2016/32/1470875105-kospls.png","http://image.noelshack.com/fichiers/2016/34/1471990343-picsart-08-24-12-02-07.jpg","http://image.noelshack.com/fichiers/2016/34/1471990372-picsart-08-24-12-11-02.jpg","http://image.noelshack.com/minis/2016/32/1470848511-mikedeanred.png","http://image.noelshack.com/fichiers/2016/34/1472293325-cartonrouge.png","http://image.noelshack.com/fichiers/2016/34/1472293406-turpine.png","http://image.noelshack.com/fichiers/2016/34/1472293558-money.png","http://image.noelshack.com/fichiers/2016/34/1472294007-bisounours.png","http://image.noelshack.com/fichiers/2016/34/1472294022-chevre.png","http://image.noelshack.com/fichiers/2016/34/1472293975-boli.png","http://image.noelshack.com/fichiers/2016/34/1472294028-chevreom.png","http://image.noelshack.com/fichiers/2016/34/1472293565-turpin2.png","http://image.noelshack.com/fichiers/2016/34/1472293319-turpin1.png","http://image.noelshack.com/minis/2016/32/1470849324-mikedean.png","http://image.noelshack.com/minis/2016/32/1470852225-bebewalcott.png","http://image.noelshack.com/fichiers/2016/32/1470850374-giroud.png","http://image.noelshack.com/fichiers/2016/32/1470850739-wengerdommage.png","http://image.noelshack.com/fichiers/2016/32/1470851785-wengerlepourfandeur.png","http://image.noelshack.com/fichiers/2016/32/1470847257-walcott.png","http://image.noelshack.com/minis/2016/32/1470847619-suarez.png","http://image.noelshack.com/fichiers/2016/34/1472335338-suarez2010.png","http://image.noelshack.com/fichiers/2016/34/1472406911-jara-cavani2.png","http://image.noelshack.com/fichiers/2016/34/1472393805-piqueob.png","http://image.noelshack.com/fichiers/2016/34/1472405517-3.png","http://image.noelshack.com/fichiers/2016/35/1472561610-bastien.png","http://image.noelshack.com/fichiers/2016/42/1477236254-moderix.png"]);

add_sticker("OM",["http://image.noelshack.com/fichiers/2016/34/1472246579-pele.png","http://image.noelshack.com/fichiers/2016/34/1472246594-rekik.png","http://image.noelshack.com/fichiers/2016/34/1472246602-doria.png","http://image.noelshack.com/fichiers/2016/34/1472253506-rolando-1.png","http://image.noelshack.com/fichiers/2016/34/1472246615-lass-diarra2.png","http://image.noelshack.com/fichiers/2016/34/1472253362-diarra-2.png","http://image.noelshack.com/fichiers/2016/34/1472246625-teamjul.png","http://image.noelshack.com/fichiers/2016/34/1472253688-gomis-2.png","http://image.noelshack.com/fichiers/2016/34/1472253289-cabella.png","http://image.noelshack.com/fichiers/2016/34/1472043904-thauvin.png","http://image.noelshack.com/fichiers/2016/34/1472336006-rolando-surdoue.png","http://image.noelshack.com/fichiers/2016/34/1472336012-rolando-2.png","http://image.noelshack.com/fichiers/2016/34/1472337431-malleville2.png","http://image.noelshack.com/fichiers/2016/34/1472337452-malleville1.png","http://image.noelshack.com/fichiers/2016/34/1472337471-malleville.png","http://image.noelshack.com/fichiers/2016/30/1469710871-didier.png","http://image.noelshack.com/fichiers/2016/34/1472408766-bengous.png","http://image.noelshack.com/fichiers/2016/35/1472484085-frank-mc-court-3.png","http://image.noelshack.com/fichiers/2016/35/1472483898-frank-mccourt.png","http://image.noelshack.com/fichiers/2016/35/1472483734-frank-mccourt-assis.png","http://image.noelshack.com/fichiers/2016/35/1472484393-gaudin.png","http://image.noelshack.com/fichiers/2016/35/1472484502-gaudin-rire.png","http://image.noelshack.com/fichiers/2016/35/1472546401-fanni.png","http://image.noelshack.com/fichiers/2016/35/1472561507-diaby-conf.png","http://image.noelshack.com/fichiers/2016/35/1472561518-diaby-regarde-le-ciel.png","http://image.noelshack.com/fichiers/2016/35/1472561525-boli-pointe-du-doigt.png","http://image.noelshack.com/fichiers/2016/35/1472571837-sakai-vendeur-de-sushis.png","http://image.noelshack.com/fichiers/2016/35/1472572675-bebe-om.png","http://image.noelshack.com/fichiers/2016/42/1477158659-mccourt-home-run.png","http://image.noelshack.com/fichiers/2016/42/1477158686-rudi-garcia-2.png","http://image.noelshack.com/fichiers/2016/42/1477158693-rudi-garcia-3.png","http://image.noelshack.com/fichiers/2016/42/1477158699-rudi-garcia-rigole-de-l-ol.png","http://image.noelshack.com/fichiers/2016/42/1477160410-machach.png","http://image.noelshack.com/fichiers/2016/42/1477160416-bedimo.png","http://image.noelshack.com/fichiers/2016/42/1477160426-ieska-leya.png","http://image.noelshack.com/fichiers/2016/42/1477160434-vainqueur-om.png","http://image.noelshack.com/fichiers/2016/42/1477160439-william-vainqueur2.png","http://image.noelshack.com/fichiers/2016/42/1477160445-william-vainqueur.png","http://image.noelshack.com/fichiers/2016/42/1477160471-njie-content.png","http://image.noelshack.com/fichiers/2016/42/1477236228-omix.png","http://image.noelshack.com/fichiers/2016/42/1477240913-diarrathefantasticmercenaire2.png"]);

add_sticker("Aulas",["http://image.noelshack.com/fichiers/2016/34/1472285425-aulas-a-lunettes.png","http://image.noelshack.com/fichiers/2016/34/1472284134-aulas-serre-les-dents.png","http://image.noelshack.com/fichiers/2016/34/1472246783-aulas-20.png","http://image.noelshack.com/fichiers/2016/34/1472246795-aulas-peureux.png","http://image.noelshack.com/fichiers/2016/34/1472246804-aulas-rigole.png","http://image.noelshack.com/fichiers/2016/34/1472246813-aulas-rigoletjrs.png","http://image.noelshack.com/fichiers/2016/34/1472249068-aulas-clin-d-oeil.png","http://image.noelshack.com/fichiers/2016/34/1472253265-3615-aulas1.png","http://image.noelshack.com/fichiers/2015/41/1444495856-zzz.png","http://image.noelshack.com/minis/2015/41/1444497673-zzz.png","http://image.noelshack.com/minis/2015/42/1445100311-zz.png","http://image.noelshack.com/fichiers/2016/33/1471537983-aulas.png","http://image.noelshack.com/fichiers/2016/34/1472321852-sans-titre-11.png","http://image.noelshack.com/fichiers/2016/34/1472317517-aulas.png","http://image.noelshack.com/fichiers/2016/35/1472561538-aulas-mal-a-l-aise.png","http://image.noelshack.com/fichiers/2016/35/1472573296-aulas-rage.png","http://image.noelshack.com/fichiers/2016/35/1472572612-aulas-phone.png","http://image.noelshack.com/fichiers/2016/35/1472649661-aulasp.png","http://image.noelshack.com/fichiers/2016/35/1472650476-aulass.png","http://image.noelshack.com/fichiers/2016/35/1472660425-calimerolas.png","http://image.noelshack.com/fichiers/2016/42/1477235520-aulas20000lieuxsouslesmers.png"]);

add_sticker("PSG",["http://image.noelshack.com/fichiers/2016/34/1472246874-nasser-pas-content.png","http://image.noelshack.com/fichiers/2016/34/1472283294-zlatan-pas-content.png","http://image.noelshack.com/fichiers/2016/34/1472305633-ben-arfa.png","http://image.noelshack.com/fichiers/2016/34/1472318086-nasser-rigole.png","http://image.noelshack.com/fichiers/2016/34/1472320162-sans-titre-1.png","http://image.noelshack.com/fichiers/2016/34/1472320157-sans-titre-2.png","http://image.noelshack.com/fichiers/2016/34/1472333688-ben-arfa-2.png","http://image.noelshack.com/fichiers/2016/34/1472409989-cavani2.png","http://image.noelshack.com/fichiers/2016/34/1472410009-cavani3.png","http://image.noelshack.com/fichiers/2016/35/1472546160-kurzawa.png","http://image.noelshack.com/fichiers/2016/35/1472573262-matuidi.png","http://image.noelshack.com/fichiers/2016/35/1472572115-cavani1.png","http://image.noelshack.com/fichiers/2016/35/1472735396-flacoetcavani.jpg","http://image.noelshack.com/fichiers/2016/35/1472737594-meilleurbuteurdel1.jpg","http://image.noelshack.com/fichiers/2016/35/1472737765-patronsilva.jpg","http://image.noelshack.com/fichiers/2016/35/1472738308-matadorgoal.jpg","http://image.noelshack.com/fichiers/2016/35/1472738891-directeurdufootball.jpg","http://image.noelshack.com/fichiers/2016/35/1472739261-dimariolle.jpg","http://image.noelshack.com/fichiers/2016/35/1472740108-nasserheureux.jpg","http://image.noelshack.com/fichiers/2016/35/1472740350-fiotte.jpg","http://image.noelshack.com/fichiers/2016/35/1472741819-nasserlarmes.jpg","http://image.noelshack.com/fichiers/2016/35/1472742543-nassergangster.jpg","http://image.noelshack.com/fichiers/2016/35/1472742737-emerybouteilles.jpg","http://image.noelshack.com/fichiers/2016/35/1472815752-ouibiensur.jpg","http://image.noelshack.com/fichiers/2016/42/1477158625-emery-ce-n-est-pas-moi.png","http://image.noelshack.com/fichiers/2016/42/1477158635-emery-en-stress.png"]);

add_sticker("ASSE",["http://image.noelshack.com/fichiers/2016/34/1472307444-sans-titre-1.png","http://image.noelshack.com/fichiers/2016/34/1472307449-sans-titre-2.png","http://image.noelshack.com/fichiers/2016/34/1472307453-sans-titre-3.png","http://image.noelshack.com/fichiers/2016/34/1472307130-galtier.png","http://image.noelshack.com/fichiers/2016/34/1472332890-perrin.png","http://image.noelshack.com/fichiers/2016/34/1472405528-4.jpg","http://image.noelshack.com/fichiers/2016/34/1472405537-10.png","http://image.noelshack.com/fichiers/2016/34/1472333197-perrin.png","http://image.noelshack.com/fichiers/2016/34/1472333206-perrin1.png","http://image.noelshack.com/fichiers/2016/34/1472411132-lemoine.png","http://image.noelshack.com/fichiers/2016/34/1472411139-ruffier.png","http://image.noelshack.com/fichiers/2016/34/1472414403-13.jpg","http://image.noelshack.com/fichiers/2016/34/1472413463-13.jpg","http://image.noelshack.com/fichiers/2016/34/1472415318-7.png","http://image.noelshack.com/fichiers/2016/34/1472415343-9.png","http://image.noelshack.com/fichiers/2016/35/1472561636-galtier-main-devant-la-bouche.png","http://image.noelshack.com/fichiers/2016/34/1472410360-romeyer1.png"]);

add_sticker("OL",["http://image.noelshack.com/fichiers/2016/34/1472311512-penalzette.png","http://image.noelshack.com/fichiers/2016/34/1472310595-gonalons.png","http://image.noelshack.com/fichiers/2016/34/1472293291-valbuenain.png","http://image.noelshack.com/fichiers/2016/34/1472293548-penalcazette.png","http://image.noelshack.com/fichiers/2016/34/1472312285-n-koulou.png","http://image.noelshack.com/fichiers/2016/35/1472561512-fekir-wallah.png","http://image.noelshack.com/fichiers/2016/35/1472561531-valbuena1.png","http://image.noelshack.com/fichiers/2016/35/1472561790-tolisso-spleen.png","http://image.noelshack.com/fichiers/2016/35/1472572532-lacazette.png","http://image.noelshack.com/fichiers/2016/35/1472574398-genesio-venere.png","http://image.noelshack.com/fichiers/2016/42/1477236213-olix.png","http://image.noelshack.com/fichiers/2016/34/1472410391-lacombe.png"]);

add_sticker("DD",["http://image.noelshack.com/fichiers/2016/34/1472328687-deschamps-1.png","http://image.noelshack.com/fichiers/2016/34/1472328746-deschamps-perplexe.png","http://image.noelshack.com/fichiers/2016/34/1472328776-deschamps-decu.png","http://image.noelshack.com/fichiers/2016/34/1472328806-deschamps-facepalm1.png","http://image.noelshack.com/fichiers/2016/34/1472328834-deschamps-chanceux.png","http://image.noelshack.com/fichiers/2016/34/1472328834-deschamps-chanceux.png","http://image.noelshack.com/fichiers/2016/34/1472328880-deschamps-2.png","http://image.noelshack.com/fichiers/2016/34/1472328905-deschamps3.png","http://image.noelshack.com/fichiers/2016/34/1472328926-deschamps-a-deux-mains.png"]);

add_sticker("Joueurs Professionnels",["http://image.noelshack.com/fichiers/2016/34/1472348993-ronaldo.png","http://image.noelshack.com/fichiers/2016/34/1472350819-messiob.png","http://image.noelshack.com/fichiers/2016/34/1472386056-1470510964-mexit.png","http://image.noelshack.com/fichiers/2016/34/1472350819-ronaldo2ob.png","http://image.noelshack.com/fichiers/2016/34/1472382040-ballo4.png","http://image.noelshack.com/fichiers/2016/34/1472382045-ballo2.png","http://image.noelshack.com/fichiers/2016/34/1472382232-ballo3.png","http://image.noelshack.com/fichiers/2016/34/1472382219-ballo1.png","http://image.noelshack.com/fichiers/2016/34/1472382225-ballo.png","http://image.noelshack.com/fichiers/2016/34/1472387834-benzema.png","http://image.noelshack.com/fichiers/2016/34/1472388247-benzema2.png","http://image.noelshack.com/fichiers/2016/34/1472393805-baloob.png","http://image.noelshack.com/fichiers/2016/34/1472393805-messi2ob.png","http://image.noelshack.com/fichiers/2016/34/1472393805-ronaldo3ob.png","http://image.noelshack.com/fichiers/2016/34/1472405506-1.jpg","http://image.noelshack.com/fichiers/2016/35/1472554892-jordan-ayew-classe.png","http://image.noelshack.com/fichiers/2016/35/1472554761-jordan-ayew-crie.png","http://image.noelshack.com/fichiers/2016/35/1472554754-jordan-ayew-frustre.png","http://image.noelshack.com/fichiers/2016/35/1472553410-jordan-ayew-pleure.png","http://image.noelshack.com/fichiers/2016/35/1472561486-sanson1.png","http://image.noelshack.com/fichiers/2016/35/1472561493-sanson-surpris.png","http://image.noelshack.com/fichiers/2016/35/1472561695-carrasso.png","http://image.noelshack.com/fichiers/2016/35/1472561720-menez-bg.png","http://image.noelshack.com/fichiers/2016/35/1472572226-ribery-victoire.png","http://image.noelshack.com/fichiers/2016/35/1472571995-brandao.png","http://image.noelshack.com/fichiers/2016/35/1472571984-brandao-inter.png","http://image.noelshack.com/fichiers/2016/35/1472571978-ballotelli.png","http://image.noelshack.com/fichiers/2016/35/1472572301-mendy.png","http://image.noelshack.com/fichiers/2016/35/1472572151-dante.png","http://image.noelshack.com/fichiers/2016/35/1472573271-david-luiz.png","http://image.noelshack.com/fichiers/2016/35/1472758482-pogbadab.jpg","http://image.noelshack.com/fichiers/2016/35/1472762107-benzema.jpg","http://image.noelshack.com/fichiers/2016/35/1472762126-giroud.jpg","http://image.noelshack.com/fichiers/2016/42/1477158648-jourdren.png"]);

add_sticker("Le Monde des Médias",["http://image.noelshack.com/fichiers/2016/34/1472386823-sans-titre-1.png","http://image.noelshack.com/fichiers/2016/34/1472387099-omardf1.png","http://image.noelshack.com/fichiers/2016/34/1472387107-omardf.png","http://image.noelshack.com/fichiers/2016/34/1472387441-ruiz.png","http://image.noelshack.com/fichiers/2016/34/1472387438-ruiz1.png","http://image.noelshack.com/fichiers/2016/34/1472387522-omardf2.png","http://image.noelshack.com/fichiers/2016/42/1477158606-stephane-guy-surpris.png","http://image.noelshack.com/fichiers/2016/42/1477160380-marie-portolano.png","http://image.noelshack.com/fichiers/2016/34/1472284104-berlusconi.png","http://image.noelshack.com/fichiers/2016/34/1472246844-anne-laure-bonnet.png","http://image.noelshack.com/fichiers/2016/34/1472246862-favard-expert-ff.png","http://image.noelshack.com/fichiers/2016/34/1472330376-riolo.png","http://image.noelshack.com/fichiers/2016/34/1472388291-cjp.png","http://image.noelshack.com/fichiers/2016/35/1472572600-bichentay.png","http://image.noelshack.com/fichiers/2016/35/1472571618-nabil-djellit-generateur-de-rumeurs.png"]);

add_sticker("United",["http://image.noelshack.com/fichiers/2016/35/1472510378-fellaigod.png","http://image.noelshack.com/fichiers/2016/35/1472511408-lvgclasse.png","http://image.noelshack.com/fichiers/2016/35/1472497261-453fa74459819bc837e4b1288accea6d.png","http://image.noelshack.com/fichiers/2016/35/1472505723-lingard.png","http://image.noelshack.com/fichiers/2016/35/1472497286-844ff4c92793264a2cdf5910b9f14a1d.png","http://image.noelshack.com/fichiers/2016/35/1472502630-fergietime.png","http://image.noelshack.com/fichiers/2016/35/1472497324-c79951cebda39dc5b318d1fa1c70262d.png","http://image.noelshack.com/fichiers/2016/35/1472496287-5c6dddc2a2832b2e87bd6a4640086e17.png","http://image.noelshack.com/fichiers/2016/35/1472477770-picsart-08-29-03-34-26.jpg","http://image.noelshack.com/fichiers/2016/35/1472477222-lvg.png","http://image.noelshack.com/fichiers/2016/35/1472480883-e3c495b2e0595c4712c146587da1d055.png","http://image.noelshack.com/fichiers/2016/35/1472497346-4e11228d65bda94965e6c12c4bf6d0fd.png","http://image.noelshack.com/fichiers/2016/35/1472497138-4ebb1ba06dc8036d264e7dc66d6ee7fc.png","http://image.noelshack.com/fichiers/2016/35/1472512787-philjonesbg.png","http://image.noelshack.com/fichiers/2016/35/1472509350-c5e855cca8fda0b72eac237d4dd6c1d8.png","http://image.noelshack.com/fichiers/2016/35/1472509903-lingard.png"]);

add_sticker("Investisseurs",[" http://image.noelshack.com/fichiers/2016/34/1472326191-lopez-maitre-course.png","http://image.noelshack.com/fichiers/2016/34/1472326284-lopez-de-face.png"]);

add_sticker("RG-512",["http://image.noelshack.com/fichiers/2016/42/1477158260-bielsa-rg-512-approuved.png","http://image.noelshack.com/fichiers/2016/42/1477158679-rg512.png","http://image.noelshack.com/fichiers/2016/42/1477160367-anigo-5.png","http://image.noelshack.com/fichiers/2016/42/1477160375-anigo-rg-512.png","http://image.noelshack.com/fichiers/2016/42/1477219969-footix.png"]);

add_sticker("Les anciens de l'OM",["http://image.noelshack.com/fichiers/2016/42/1477158483-passi-genie.png","http://image.noelshack.com/fichiers/2016/42/1477158492-passi-sourire-2.png","http://image.noelshack.com/fichiers/2016/34/1472287324-mld2.png","http://image.noelshack.com/fichiers/2016/34/1472246464-mld-sadique.png","http://image.noelshack.com/fichiers/2016/34/1472246476-mld-sourire.png","http://image.noelshack.com/fichiers/2016/34/1472246515-ciccolunghi.png","http://image.noelshack.com/fichiers/2016/34/1472253299-ciccolunghi-posture.png","http://image.noelshack.com/fichiers/2016/34/1472253299-ciccolunghi-posture.png","http://image.noelshack.com/fichiers/2016/34/1472246490-theboard.png","http://image.noelshack.com/fichiers/2016/34/1472246553-dieu-passif.png","http://image.noelshack.com/fichiers/2016/34/1472246560-franck-passif-bisounours.png","http://image.noelshack.com/fichiers/2016/34/1472253482-passi-sueur.png","http://www.noelshack.com/2016-42-1477160465-n-koudou.png","http://image.noelshack.com/fichiers/2016/34/1472246686-bielsa.png","http://image.noelshack.com/fichiers/2016/34/1472246728-vl-classe.png","http://image.noelshack.com/fichiers/2016/34/1472285409-gignac-le-100.png","http://image.noelshack.com/fichiers/2016/34/1472314979-labrune-main.png","http://image.noelshack.com/fichiers/2016/34/1471892039-labrune.png","http://image.noelshack.com/fichiers/2016/35/1472595119-morelbielsa.png","http://image.noelshack.com/fichiers/2016/34/1472331959-anigo.png","http://image.noelshack.com/fichiers/2016/42/1477248126-anigo-6.png","http://image.noelshack.com/fichiers/2016/34/1472285415-payet-larmes.png","http://image.noelshack.com/fichiers/2016/34/1472294038-labrune.png","http://image.noelshack.com/fichiers/2016/34/1472284119-bielsa-quand-il-voit-alessandrini.png","http://image.noelshack.com/fichiers/2016/34/1472311108-bielsa-2.png"]);

add_sticker("Mozaïques",["http://image.noelshack.com/fichiers/2016/39/1475433817-aulascoule.png","http://image.noelshack.com/fichiers/2016/39/1475433821-aulascoule1.png","http://image.noelshack.com/fichiers/2016/39/1475433826-aulascoule2.png","http://image.noelshack.com/fichiers/2016/39/1475433829-aulascoule3.png"]);

add_sticker("Entraîneurs",["http://image.noelshack.com/fichiers/2016/42/1477248586-antonnetti-2.png","http://image.noelshack.com/fichiers/2016/42/1477248857-antonnetti-1.png","http://image.noelshack.com/fichiers/2016/31/1470148439-wenger-smile12.png","http://image.noelshack.com/fichiers/2016/31/1470148809-wenger-smile12.png","http://image.noelshack.com/fichiers/2016/31/1470149403-wengerchill.png","http://image.noelshack.com/minis/2016/31/1470149934-wengerpascontent.png","http://image.noelshack.com/fichiers/2016/31/1470152175-wengerozil.png","http://image.noelshack.com/fichiers/2016/34/1472246856-dupraz.png","http://image.noelshack.com/fichiers/2016/34/1472244256-menes.png","http://image.noelshack.com/fichiers/2016/34/1472312809-mourinho.png","http://image.noelshack.com/fichiers/2016/34/1472324317-blanc-clin-d-oeil.png","http://image.noelshack.com/fichiers/2016/34/1472325225-blanc-doute.png","http://image.noelshack.com/fichiers/2016/34/1472325234-blanc-touillette.png","http://image.noelshack.com/fichiers/2016/34/1472325239-blanc-deter.png","http://image.noelshack.com/fichiers/2016/34/1472325246-sir-3-5-2-sourit.png","http://image.noelshack.com/fichiers/2016/34/1472334881-sampaoli.png","http://image.noelshack.com/fichiers/2016/34/1472334928-sampoli2.png","http://image.noelshack.com/fichiers/2016/34/1472334197-klopp1.png","http://image.noelshack.com/fichiers/2016/34/1472334203-klopp2.png","http://image.noelshack.com/fichiers/2016/34/1472388191-cjp1.png","http://image.noelshack.com/fichiers/2016/35/1472571805-girard-gg.png","http://image.noelshack.com/fichiers/2016/35/1472571811-girard-not-bad.png","http://image.noelshack.com/fichiers/2016/42/1477158727-simeone-sexy-boy.png","http://image.noelshack.com/fichiers/2016/42/1477252373-jardim-2.png","http://image.noelshack.com/fichiers/2016/42/1477252378-jardim1.png","http://image.noelshack.com/fichiers/2016/42/1477252389-genesio2.png"]);

add_sticker("Présidents et ex-présidents",["http://image.noelshack.com/fichiers/2016/34/1472294858-martel1.png","http://image.noelshack.com/fichiers/2016/34/1472294863-martel2.png","http://image.noelshack.com/fichiers/2016/34/1472294866-martel3.png","http://image.noelshack.com/fichiers/2016/34/1472294880-martel4.png","http://image.noelshack.com/fichiers/2016/34/1472408877-triaud.png"]);
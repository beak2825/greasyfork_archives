// ==UserScript==

// @name        Stickers+ FFP

// @description Ajoute des stickers à jvc

// @author     Samix
// @match       http://www.jeuxvideo.com/*

// @version			2.0

// @grant       none

// @noframes


// @namespace https://greasyfork.org/users/62819
// @downloadURL https://update.greasyfork.org/scripts/22701/Stickers%2B%20FFP.user.js
// @updateURL https://update.greasyfork.org/scripts/22701/Stickers%2B%20FFP.meta.js
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


add_sticker("FCP",["http://image.noelshack.com/fichiers/2016/34/1472391556-pdcob.png","http://image.noelshack.com/fichiers/2016/34/1472392304-pdc2ob.png","http://image.noelshack.com/fichiers/2016/34/1472395694-pdc3ob.png","http://image.noelshack.com/fichiers/2016/34/1472395694-pdc4ob.png","http://image.noelshack.com/fichiers/2016/34/1472395694-pdc5ob.png","http://image.noelshack.com/fichiers/2016/34/1472404657-ikerob.png","http://image.noelshack.com/fichiers/2016/34/1472404657-pdc6ob.png","http://image.noelshack.com/fichiers/2016/34/1472415035-adrianob.png","http://image.noelshack.com/fichiers/2016/34/1472415036-layun2ob.png","http://image.noelshack.com/fichiers/2016/34/1472415036-layunob.png","http://image.noelshack.com/fichiers/2016/34/1472416706-nesob.png","http://image.noelshack.com/fichiers/2016/34/1472415255-oliverob.png","http://image.noelshack.com/fichiers/2016/35/1472477975-heltonob.png","http://image.noelshack.com/minis/2016/35/1472488965-ldc04ob.png","http://image.noelshack.com/minis/2016/35/1472488965-nes3ob.png","http://image.noelshack.com/minis/2016/35/1472488965-otavioob.png","http://image.noelshack.com/minis/2016/35/1472488965-pdc5ob.png","http://image.noelshack.com/minis/2016/35/1472488966-pdc6ob.png","http://image.noelshack.com/minis/2016/35/1472488966-pdc7ob.png","http://image.noelshack.com/minis/2016/35/1472828563-nes4ob.png","http://image.noelshack.com/minis/2016/35/1472828563-portob.png","http://image.noelshack.com/minis/2016/35/1472828564-vpob.png","http://image.noelshack.com/fichiers/2016/35/1472508839-image.jpg","http://image.noelshack.com/fichiers/2016/34/1472395884-picsart-08-28-04-43-04.jpg","http://image.noelshack.com/fichiers/2016/37/1474126664-brahimiob.png","http://image.noelshack.com/minis/2016/40/1476015589-1475690823-fc-porto.png","http://image.noelshack.com/minis/2016/40/1476016747-q7ob.png","http://image.noelshack.com/minis/2016/40/1476016746-pdc11ob.png","http://image.noelshack.com/minis/2016/40/1476016746-pdc10ob.png","http://image.noelshack.com/minis/2016/40/1476016746-hulkob.png","http://image.noelshack.com/minis/2016/40/1476016745-casillasob.png","http://image.noelshack.com/fichiers/2017/02/1484490006-as2ob.png","http://image.noelshack.com/fichiers/2017/02/1484490005-asob.png","http://image.noelshack.com/fichiers/2017/02/1484490004-danilo.png","http://image.noelshack.com/fichiers/2017/02/1484490005-danilo2ob.png","http://image.noelshack.com/fichiers/2017/02/1484490006-pdc.png","http://image.noelshack.com/fichiers/2017/02/1484490006-nesob.png","http://image.noelshack.com/fichiers/2017/02/1484490005-kelvinob.png","https://image.noelshack.com/fichiers/2017/08/1487607137-portob.png","http://image.noelshack.com/fichiers/2018/02/4/1515705538-sc.png","http://image.noelshack.com/fichiers/2018/02/4/1515705537-abou.png","http://image.noelshack.com/fichiers/2018/02/4/1515705538-abou2.png","https://image.noelshack.com/fichiers/2017/08/1487607180-marcanoob.png",]);

add_sticker("SLB",["http://image.noelshack.com/minis/2016/35/1472477782-jjbo.png","http://image.noelshack.com/fichiers/2016/35/1472477782-jonasob.png","http://image.noelshack.com/fichiers/2016/35/1472477782-rv2ob.png","http://image.noelshack.com/fichiers/2016/35/1472477782-rvbo.png","http://image.noelshack.com/minis/2016/37/1474126605-rv3.png","http://image.noelshack.com/minis/2016/37/1474126605-benficaob.png","http://image.noelshack.com/fichiers/2016/40/1476016843-aigleob.png","https://image.noelshack.com/fichiers/2017/08/1487606930-benficaob.png"]);

add_sticker("FFP",["http://image.noelshack.com/minis/2016/35/1472477156-jj2bo.png","http://image.noelshack.com/minis/2016/35/1472477157-rlob.png","http://image.noelshack.com/fichiers/2016/34/1472416706-ronaldo3ob.png","http://image.noelshack.com/minis/2016/35/1472477156-bdcbo.png","http://image.noelshack.com/fichiers/2016/34/1472416706-ronaldo2ob.png","http://image.noelshack.com/fichiers/2016/34/1472416706-ronaldo.png","http://image.noelshack.com/minis/2016/35/1472488966-supppt2ob.png","http://image.noelshack.com/minis/2016/35/1472488966-suppptob.png","http://image.noelshack.com/minis/2016/35/1472828563-legioob.png","http://image.noelshack.com/minis/2016/35/1472828563-morsay2ob.png","http://image.noelshack.com/minis/2016/35/1472828563-morsayob.png","http://image.noelshack.com/minis/2016/35/1472828563-vpa2ob.png","http://image.noelshack.com/fichiers/2016/35/1472508661-image.jpeg","http://image.noelshack.com/minis/2016/37/1474126403-portugalob.png","http://image.noelshack.com/minis/2016/37/1474126403-ederob.png","http://image.noelshack.com/minis/2016/37/1474126403-eder2ob.png","http://image.noelshack.com/minis/2016/37/1474126404-1468227931-porfra.png","http://image.noelshack.com/minis/2016/37/1474127257-buissonob.png","http://image.noelshack.com/minis/2016/40/1476015583-1475690808-chaves.png","http://image.noelshack.com/minis/2016/40/1476015583-1475690804-boavista.png","http://image.noelshack.com/minis/2016/40/1476015583-1475690794-belenenses.png","http://image.noelshack.com/minis/2016/40/1476015588-1475690789-arouca.png","http://image.noelshack.com/minis/2016/40/1476015588-1475690837-maritimo.png","http://image.noelshack.com/minis/2016/40/1476015585-1475690827-feirense.png","http://image.noelshack.com/minis/2016/40/1476015584-1475690819-estoril.png","http://image.noelshack.com/minis/2016/40/1476015589-1475690872-sporting-portugal.png","http://image.noelshack.com/minis/2016/40/1476015589-1475690867-sporting-braga.png","http://image.noelshack.com/minis/2016/40/1476015587-1475690861-rio-av.png","http://image.noelshack.com/minis/2016/40/1476015587-1475690855-pacos-de-ferreira.png","http://image.noelshack.com/minis/2016/40/1476015588-1475690851-nacional-madeira.png","http://image.noelshack.com/minis/2016/40/1476015586-1475690843-moreirense.png","http://image.noelshack.com/minis/2016/40/1476016246-puta3ob.png","http://image.noelshack.com/minis/2016/40/1476016245-pepeob.png","http://image.noelshack.com/minis/2016/40/1476016245-jmob.png","http://image.noelshack.com/minis/2016/40/1476016245-fsob.png","http://image.noelshack.com/fichiers/2017/02/1484490150-bdc2ob.png","http://image.noelshack.com/fichiers/2017/02/1484490151-bdcob.png","https://image.noelshack.com/fichiers/2017/08/1487606996-jjob.png","https://image.noelshack.com/fichiers/2017/08/1487606995-pepe2ob.png","https://image.noelshack.com/fichiers/2017/08/1487606996-ronaldoob.png","http://image.noelshack.com/fichiers/2018/02/4/1515705538-jeankiabi.png","https://image.noelshack.com/fichiers/2017/08/1487606996-scpob.png"]);

add_sticker("MOU",["http://image.noelshack.com/minis/2016/40/1476016244-jmouob.png","http://image.noelshack.com/fichiers/2017/02/1484490151-mou3ob.png","http://image.noelshack.com/fichiers/2018/02/4/1515705538-mou20.png","http://image.noelshack.com/fichiers/2017/02/1484490151-mouob.png","https://image.noelshack.com/fichiers/2017/08/1487607382-mou5ob.png","https://image.noelshack.com/fichiers/2017/08/1487607383-mou6ob.png","https://image.noelshack.com/fichiers/2017/08/1487607383-mou7ob.png","https://image.noelshack.com/fichiers/2017/08/1487607383-mou8ob.png","https://image.noelshack.com/fichiers/2017/08/1487607384-mou9ob.png","https://image.noelshack.com/fichiers/2017/08/1487607385-mou10ob.png","https://image.noelshack.com/fichiers/2017/08/1487607386-mou11ob.png","https://image.noelshack.com/fichiers/2017/08/1487607386-mou12ob.png","https://image.noelshack.com/fichiers/2017/08/1487607386-mou13ob.png","https://image.noelshack.com/fichiers/2017/08/1487607389-mou14ob.png","https://image.noelshack.com/fichiers/2017/08/1487607387-mou16ob.png","https://image.noelshack.com/fichiers/2017/08/1487607388-mou17ob.png","https://image.noelshack.com/fichiers/2017/08/1487607388-mou18ob.png","https://image.noelshack.com/fichiers/2017/08/1487607389-mou19ob.png"]);
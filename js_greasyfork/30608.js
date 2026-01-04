// ==UserScript==
// @name Animakai EXTRA - Project
// @version 0.8.9b
// @author Fukoji "King of DELAS".
// @namespace Funcionalidades para o Animakai.
// @description Funcionalidades para o Animakai.
// @match *.animakai.info/*
// @match https://*.animakai.info/*
// @match *.comicon.com.br/*
// @match http://www.comicon.com.br/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/30608/Animakai%20EXTRA%20-%20Project.user.js
// @updateURL https://update.greasyfork.org/scripts/30608/Animakai%20EXTRA%20-%20Project.meta.js
// ==/UserScript==

// ==== COMICON NO-TIME WAIT ====
var ende2 = /(http|https):\/\/www\.comicon\.com\.br\/([a-z]*)\.([a-z]*)\?/;
if (ende2.test(window.location.href) === true) {
    var lnkM = document.getElementsByClassName('mP')[1].innerHTML;
    document.getElementsByTagName('strong')[0].innerHTML = 'Direct: ';

    var Ncl = document.createElement('a');
    Ncl.id = 'nc22';
    document.getElementsByTagName('strong')[0].appendChild(Ncl);
    Nc2 = document.getElementById('nc22');
    Nc2.innerHTML = lnkM.toUpperCase();
    Nc2.style.fontFamily = 'Roboto Condensed, sans-serif';
    Nc2.setAttribute('href', lnkM);
 }

//==== BLOCK AREA ====

var ende = /(http|https)\:\/\/www\.animakai\.info\/([a-z]*)\/([a-z]*)\-|([0-9]*)\/([a-z]*)\-([0-9]*)/;
var ende3 = /(http|https)\:\/\/www.animakai.info\/anime\/([a-z-0-9]*)\/([a-z-0-9]*)/gi;

var hideD = {};
	hideD.ligado = "yes";

var adsT = {};
	adsT.cima = document.getElementsByClassName('ads2');
	adsT.soc = document.getElementsByClassName('likebox');
	adsT.img = document.getElementsByClassName('visible-lg');
	adsT.VidCringe = document.getElementsByClassName('col-videos');
  adsT.vidCringeIsBack = document.getElementsByClassName('info-animes-destaque');

if (hideD.ligado == 'yes') {
	if (ende.test(window.location.href) !== true) {
	adsT.cima[0].style.display = 'none';
	adsT.soc[0].style.display = 'none';
	adsT.VidCringe[0].style.display = 'none';
	} else  {
	  adsT.img[0].style.display = 'none';
    if (adsT.vidCringeIsBack[0] !== undefined){adsT.vidCringeIsBack.style.display = 'none';}
	}
}



// ==== NIGHT MODE ====

if (ende.test(window.location.href) === true || ende3.test(window.location.href) === true) {

	var lists = document.getElementsByClassName('top-padrao')[0];

	var NightON = document.createElement('img');
	NightON.id = 'trueN';
	NightON.src = 'https://cdn3.iconfinder.com/data/icons/glypho-photography/64/camera-mode-night-fill-128.png';
	NightON.value = 'xD';
	lists.appendChild(NightON);
	var bttN = document.getElementById('trueN');
	bttN.setAttribute('class', 'titulo');
	bttN.setAttribute('target', '_blank');
	bttN.setAttribute('alt', 'Ativar Modo Noturno!');
	bttN.style.width='8%';
	bttN.style.marginTop='calc(-3%)';
	bttN.style.marginLeft='calc(-3%)';
	bttN.style.marginBottom='calc(-3%)';

	bttN.addEventListener('click', function(){nmode('yes')});

}

function nmode(active, per) {
	if (active == 'yes') {
		var ndiv1 = document.createElement('div');
		ndiv1.id = 'night-b';
		ndiv1.value = 'xD';
		document.getElementsByTagName('body')[0].appendChild(ndiv1);

		ndNM = document.getElementById('night-b');

		ndNM.style.background = '#2d2d2d';
		ndNM.style.width = '100%';
		ndNM.style.height = '100%';
		ndNM.style.top = '0px';
		ndNM.style.left = '0px';
		ndNM.style.position = 'fixed';
		ndNM.style.zIndex = '99998';
		ndNM.style.opacity = '0.96';
		ndNM.addEventListener("click", function (){nmode('no');});

		plyg = document.getElementsByClassName('box-video')[0];
		plyg.style.zIndex = '99999';

	} else if (active == 'no') {
		ndNM.style.zIndex = '-99998';
		plyg.style.zIndex = '0';
	} else {
		alert('Não reconheço esse comando :x!');
	}

}
//==== DIRECT LINK AREA ====
if (ende.test(window.location.href) === true) {
	// ===== DISQUS AUTOHIDE ====

	var plusD = document.createElement('a');
	plusD.id = 'abreD';
	document.getElementsByTagName('h2')[0].appendChild(plusD);
	var abreDIS = document.getElementById('abreD');
	abreDIS.innerHTML = 'ABRIR [+]';
	abreDIS.style.float = 'left';
	abreDIS.style.paddingRight = '20px';
	document.getElementById('disqus_thread').style.display = 'none';
	abreDIS.addEventListener('click', function(){document.getElementById('disqus_thread').style.display = 'block';});

	//==== SD PLAYER ====
    var sd_ = document.getElementsByTagName('source')[0].attributes['src'].value;
    var sd_h = document.getElementsByClassName('titulo')[1];
    sd_h.innerHTML = 'Download';
    sd_h.setAttribute('href', sd_);
    // ==== KAI PLAYER ====
    var kai_ = document.getElementsByTagName('iframe')[1];
    if (kai_.attributes['title'] === undefined){
        var sd1 = document.getElementsByClassName('titulo')[2];
        sd1.innerHTML = 'Download 2';
        sd1.setAttribute('href', kai_.attributes['src'].value);
    } else if (kai_.attributes['title'].value == 'Disqus') {
        var dwn_ = document.getElementsByTagName('source')[1].attributes['src'].value;
        var sd2 = document.getElementsByClassName('titulo')[2];
        sd2.innerHTML = 'Download 2';
        sd2.setAttribute('href', dwn_);

    }

}
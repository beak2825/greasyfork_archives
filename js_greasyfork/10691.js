// ==UserScript==
// @name                WME UI Bugs
// @namespace           https://greasyfork.org/fr/scripts/10691-wme-ui-bugs
// @description         Corrects bugs of WME User Interface like moving location info on the right when UR or place update is open, StreetView when editing house numbers...
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @version             0.4
// @grant               na
// @downloadURL https://update.greasyfork.org/scripts/10691/WME%20UI%20Bugs.user.js
// @updateURL https://update.greasyfork.org/scripts/10691/WME%20UI%20Bugs.meta.js
// ==/UserScript==

// V0.2	Ajout gestion des place update
// V0.2 Prise en charge des contrôles de Street View lors de l'édition des numéros de maisons.
// V0.3 
// V0.4 Compatibilité avec WME Maximized

if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
	(function page_scope_runner() {
		var my_src = "(" + page_scope_runner.caller.toString() + ")();";
		var script = document.createElement('script');
		script.setAttribute("type", "text/javascript");
		script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;
		setTimeout(function() {
			document.body.appendChild(script);
			document.body.removeChild(script);
		}, 0);
	})();
	return;
}

function bootstrapUIBugs(){
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	setTimeout(initUIBugs, 700);
}

function LocationPos() {
    //JQuery renvoie toujours Objet même s'il n'existe pas (!!) Il faut tester la longueur... Si = 0, n'existe pas.
	if ($(".problem-edit").length > 0 || $(".place-update-edit").length > 0){  // On teste si un UR ou Place update est ouvert
		$('.WazeControlLocationInfo').attr('style', function(i,s) { return s + 'left: 350px !important;' }); // On déplace le texte vers la droite grâce à Jquery
	}else{
		$('.WazeControlLocationInfo').attr('style', function(i,s) { return s + 'left: 73px !important;' }); // On déplace le texte à son emplacement d'origine grâce à Jquery
	}
}

function ModifySv(){
	if ($(".lightboxShown").length > 0){ // Si l'édition des numéros de rues est en cours
		var MaximizedSidebarW = $('#sidebar').css("max-width");
		if(MaximizedSidebarW == "260px"){ // Si WME Maximized est actif
			CBTop = 79;
			SVCTop = 182;
		}else{
			CBTop = 55;
			SVCTop = 158;
		}
		$('.close-button').attr('style', function(i,s) { return s + 'top: ' + CBTop + 'px !important;' }); // On déplace le bouton fermer
		$('.gmnoprint[controlwidth="25"]').attr('style', function(i,s) { return s + 'top: ' + CBTop + 'px !important;' }); // On déplace les contrôles de position de SV //55
		$('.gmnoprint[style*="top: 103px"]').attr('style', function(i,s) { return s + 'top: ' + SVCTop + 'px !important;' }); //158
	}else{
		$( ".close-button" ).css("top","0px"); // On remet le bouton fermer à sa place
		$('.gmnoprint[controlwidth="25"]').css("top","0px"); // On remet les contrôles de position de SV à leur place
		$('.gmnoprint[style*="top: 158px"]').css("top","103px"); 
	}
}

function initUIBugs(){
	Waze = unsafeWindow.Waze;
	if(typeof(Waze) == 'undefined'){
		setTimeout(initUIBugs, 700);
		return;
	}
	$("body").click(function(){LocationPos()}); // ajout d'un listener click sur "toute la page" et non pas seulement la map
	$('body').mousemove(function(){ModifySv()}); // listener mousemove
	setTimeout(LocationPos,1000);
}

bootstrapUIBugs();

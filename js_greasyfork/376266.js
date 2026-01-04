// ==UserScript==
// @name		 Mappino release [1.1]
// @namespace	 https://studinosolutions.tumblr.com/mappino/release
// @version		 1.1
// @author		 Studino Solutions
// @description	 С помощью Mappino вы можете перейти из одного картографического сервиса в другой нажатием всего одной кнопки
// @icon		 https://drive.google.com/uc?export=view&id=1tSK1xsjTKcjFDtAoDcndjgZ-XfdoSvbd
// @match		 https://studino.tk/*
// @match		 https://support.studino.tk/*
// @match		 https://www.google.com/maps*
// @match		 https://www.google.com.ua/maps*
// @match		 https://www.google.ua/maps*
// @match		 https://www.google.ru/maps*
// @match		 https://www.google.by/maps*
// @match		 https://www.google.kz/maps*
// @match		 https://www.mapillary.com/app*
// @match		 https://mapcreator.here.com/mapcreator/*
// @match		 https://mpro.maps.yandex.ru/*
// @match		 https://n.maps.yandex.ru/*
// @match		 https://wego.here.com/?map=*
// @match		 https://yandex.com/maps/*
// @match		 https://yandex.ru/maps/*
// @match		 https://yandex.ua/maps/*
// @match		 https://yandex.by/maps/*
// @match		 https://yandex.kz/maps/*
// @match		 https://www.openstreetmap.org/#map=*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/376266/Mappino%20release%20%5B11%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/376266/Mappino%20release%20%5B11%5D.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	window.mappinoVersionBranch = "release";
	
	console.log("mappinoVersionBranch: " + mappinoVersionBranch);
	window.mappinoVersionCode = 3;
	window.mappinoVersionName = "1.1";
	console.log("mappinoVersionCode: " + mappinoVersionCode + " mappinoVersionName: " + mappinoVersionName);
	
	window.mappinoLastVersionIsInstalled = GM_getValue("mappinoLastVersionIsInstalled");
	console.log("mappinoLastVersionIsInstalled: " + mappinoLastVersionIsInstalled);
	
	window.currentURL = window.location.href;
	console.log("currentURL: " + currentURL);
	
	window.currentService = "";
	window.currentServiceType = "";
	window.buttonsMarginTop = 0;
	window.studinoDomain = "studino.tk";
	window.studinoSupportDomain = "support.studino.tk";
	console.log("studinoDomain: " + studinoDomain + " studinoSupportDomain: " + studinoSupportDomain);

	if (currentURL.indexOf(studinoSupportDomain) >= 0) {
		window.currentService = "stdSup";
		window.currentServiceType = "special";
	} else if (currentURL.indexOf(studinoDomain) >= 0) {
		window.currentService = "std";
		window.currentServiceType = "special";
	} else if (currentURL.indexOf("mpro.maps.yandex.ru") >= 0) {
		window.currentService = "yek";
		window.currentServiceType = "mapcreator";
		window.buttonsMarginTop = 6.5;
	} else if (currentURL.indexOf("n.maps.yandex.ru") >= 0) {
		window.currentService = "ynk";
		window.currentServiceType = "mapcreator";
		window.buttonsMarginTop = 6.5;
	} else {
		window.currentServiceType = "notsupported";
	}

	console.log("currentService: " + currentService + " currentServiceType: " + currentServiceType + " buttonsMarginTop: " + buttonsMarginTop);

	if (currentServiceType == "notsupported") {
		
		console.log("Mappino currently not supported this service");
			
	} else if (currentServiceType == "special") {
		
		console.log("The type of current service is special");
		
		if (currentURL.indexOf(studinoSupportDomain + "/mappino") >= 0) {
		
			if (mappinoLastVersionCoderelease <= mappinoVersionCode) {
				GM_setValue("mappinoLastVersionIsInstalled", true);
				console.log("Last version of Mappino is installed : CHECKED.");
			} else {
				GM_setValue("mappinoLastVersionIsInstalled", false);
				console.log("NOT THE Last version of Mappino is installed : CHECKED.");
			}
			
			console.log("Address is " + studinoSupportDomain + "/mappino*");
			
			console.log("Replacing 'Mappino is installed' message");
			
			window.targNode1 = document.getElementById("mappino-not-installed");
			targNode1.classList.add("hidden");
			
			window.targNode2 = document.getElementById("mappino-" + mappinoVersionBranch + "-installed");
			
			if (mappinoLastVersionCoderelease > mappinoVersionCode) {
				
				console.log("Not the last version of Mappino " + mappinoVersionBranch + " is installed.");
				window.updateAvailableText = '<div id="mappino-' + mappinoVersionBranch + '-installed"><div class="notification attention"><p><i class="fas fa-exclamation-circle">&ensp;</i>Доступно обновление для Mappino ' + mappinoVersionBranch + '';
				
				if (currentURL.indexOf(studinoSupportDomain + "/mappino/update") == -1) {
					
					window.updateAvailableText2 = updateAvailableText + '. <a href="https://' + studinoSupportDomain + '/mappino/update">Узнайте, как обновить</a></p></div>'
					targNode2.innerHTML = updateAvailableText2;
					
				} else {
					
					window.updateAvailableText2 = updateAvailableText + '</p></div>'
					targNode2.innerHTML = updateAvailableText2;
					
					window.mappinoNotUpdatedError = '. Если Tampermonkey напишет, что обновлений нет, пожалуйста, <a href="/contact-us/ru">сообщите об этом</a>!';
					window.targNode3 = document.getElementById("mappino-not-updated");
					targNode3.innerHTML = mappinoNotUpdatedError;
					
				}
				
			} else {
				
				console.log("The last version of Mappino " + mappinoVersionBranch + " is installed.");
				targNode2.innerHTML = '<div id="mappino-' + mappinoVersionBranch + '-installed"><div class="notification ok"><p><i class="far fa-check-circle">&ensp;</i>У вас установлена последняя версия Mappino ' + mappinoVersionBranch + '</p></div>';
				
			}
			
		} else if (currentURL.indexOf(studinoDomain + "/mappino") >= 0) {
			
			console.log("Address is " + studinoDomain + "/mappino*");
		
			if (mappinoLastVersionCoderelease <= mappinoVersionCode) {
				GM_setValue("mappinoLastVersionIsInstalled", true);
				console.log("Last version of Mappino is installed : CHECKED.");
			} else {
				GM_setValue("mappinoLastVersionIsInstalled", false);
				console.log("NOT THE Last version of Mappino is installed : CHECKED.");
			}
		
		}
		
	} else {
		
		console.log("The type of current service is supported");
		
		var buttonStyle = "position: absolute; top: " + buttonsMarginTop + "px; z-index: 999999999; height: 20px; cursor: pointer; border: 0px; border-radius: 3px;";
		var buttonStyleSP = "cursor: default;";
		var buttonAlt = "Open this location in ";
		
		if (mappinoLastVersionIsInstalled == false) {
			var buttonSSP = document.createElement("img");
			buttonSSP.src = "https://drive.google.com/uc?export=view&id=1I1NbEo8calbO2jN7Ye9vzXzDm-v-TQFi";
			buttonSSP.alt = "Please update Mappino!";
			buttonSSP.style.cssText = "display: none;";
			buttonSSP.onclick = redirectSSP;
			document.body.appendChild(buttonSSP);
		} else {
			var buttonSSP = document.createElement("img");
			buttonSSP.src = "https://drive.google.com/uc?export=view&id=1OZfLUr5CHG4Fs4W5AojpXDxIXe-XHMYe";
			buttonSSP.alt = "Get help";
			buttonSSP.style.cssText = "display: none;";
			buttonSSP.onclick = redirectSSP;
			document.body.appendChild(buttonSSP);
		}

		var buttonSP1 = document.createElement("img");
		buttonSP1.src = "https://drive.google.com/uc?export=view&id=1lUjJXfDphA8AUQ4Ld2n7uTyc51kf80Cy";
		buttonSP1.style.cssText = "display: none;";
		document.body.appendChild(buttonSP1);

		var buttonOSM = document.createElement("img");
		buttonOSM.src = "https://www.openstreetmap.org/assets/favicon-32x32-76de1055b40f75be27792fdfc07df23963926c47648cc66d0189c87827ebeea2.png";
		buttonOSM.alt = "OpenStreetMap";
		buttonOSM.style.cssText = "display: none;";
		buttonOSM.onclick = redirectOSM;
		document.body.appendChild(buttonOSM);
		
		var buttonHWG = document.createElement("img");
		buttonHWG.src = "https://static.mapcreator.here.sc/2018.R11.3.Quakenbrueck.3/c/images/favicons/favicon-32x32.png";
		buttonHWG.alt = "HERE WeGo";
		buttonHWG.style.cssText = "display: none;";
		buttonHWG.onclick = redirectHWG;
		document.body.appendChild(buttonHWG);

		var buttonGMP = document.createElement("img");
		buttonGMP.src = "https://www.google.com/images/branding/product/ico/maps_32dp.ico";
		buttonGMP.alt = buttonAlt + "Google Maps";
		buttonGMP.style.cssText = "display: none;";
		buttonGMP.onclick = redirectGMP;
		document.body.appendChild(buttonGMP);

		var buttonSP2 = document.createElement("img");
		buttonSP2.src = "https://drive.google.com/uc?export=view&id=1lUjJXfDphA8AUQ4Ld2n7uTyc51kf80Cy";
		buttonSP2.style.cssText = "display: none;";
		document.body.appendChild(buttonSP2);
		
		var buttonHMC = document.createElement("img");
		buttonHMC.src = "https://drive.google.com/uc?export=view&id=1EQigFhu17Ku4YLRQAjnLCApzM9XYY1Tb";
		buttonHMC.alt = "HERE Map Creator";
		buttonHMC.style.cssText = "display: none;";
		buttonHMC.onclick = redirectHMC;
		document.body.appendChild(buttonHMC);

		var buttonSP3 = document.createElement("img");
		buttonSP3.src = "https://drive.google.com/uc?export=view&id=1lUjJXfDphA8AUQ4Ld2n7uTyc51kf80Cy";
		buttonSP3.style.cssText = "display: none;";
		document.body.appendChild(buttonSP3);

		var buttonGSV = document.createElement("img");
		buttonGSV.src = "https://www.google.com/streetview/images/icon/maps_streetview_32dp.ico";
		buttonGSV.alt = buttonAlt + "Google Street View";
		buttonGSV.style.cssText = "display: none;";
		buttonGSV.onclick = redirectGSV;
		document.body.appendChild(buttonGSV);
		
		var buttonMPL = document.createElement("img");
		buttonMPL.src = "https://www.mapillary.com/assets/icon/favicon-32x32.png";
		buttonMPL.alt = "Mapillary";
		buttonMPL.style.cssText = "display: none;";
		buttonMPL.onclick = redirectMPL;
		document.body.appendChild(buttonMPL);
		
		setTimeout(function(){
			
			if (currentService == "yek") {
			
				buttonSSP.style.cssText = buttonStyle;
				buttonSSP.style.right = 48 + "px";
				
				buttonSP1.style.cssText = buttonStyle + buttonStyleSP;
				buttonSP1.style.right = 78 + "px";
				
				buttonOSM.style.cssText = buttonStyle;
				buttonOSM.style.right = 93 + "px";
				
				buttonHWG.style.cssText = buttonStyle;
				buttonHWG.style.right = 123 + "px";
				
				buttonGMP.style.cssText = buttonStyle;
				buttonGMP.style.right = 153 + "px";
				
				buttonSP2.style.cssText = buttonStyle + buttonStyleSP;
				buttonSP2.style.right = 183 + "px";
				
				buttonHMC.style.cssText = buttonStyle;
				buttonHMC.style.right = 198 + "px";
				
				buttonSP3.style.cssText = buttonStyle + buttonStyleSP;
				buttonSP3.style.right = 228 + "px";
				
				buttonMPL.style.cssText = buttonStyle;
				buttonMPL.style.right = 243 + "px";
				
				buttonGSV.style.cssText = buttonStyle;
				buttonGSV.style.right = 273 + "px";
				
			}
			
			console.log("Buttons displayed");
			
		},2000)

		function redirect() {
			if (destinationService == "ssp") {
				window.destinationURL = "https://stno.tk/mappino-support";
			} else {
				window.destinationURL = "https://" + studinoDomain + "/mappino/redirect/" + mappinoVersionBranch + "#" + destinationService + "&" + destinationCoordX + "&" + destinationCoordY + "&" + destinationCoordZ + "";
			console.log("destinationURL: " + destinationURL);
			}
			console.log("Redirecting");
			window.open(destinationURL, '_blank');
			console.log("Redirected");
		}

		function getCoord() {
			
			if (currentService == "yek") {
				console.log("Get coordinates");
				window.currentURL = window.location.href;
				var coord1 = currentURL.split("?ll=");
				var coord2 = coord1[1];
				var coord3 = coord2.split("&l=");
				var coord4 = coord3[0];
				var coord5 = coord4.split("&z=");
				window.destinationCoordZ = coord5[1];
				var coord6 = coord5[0];
				var coord7 = coord6.split("%2C");
				window.destinationCoordX = coord7[1];
				window.destinationCoordY = coord7[0];
				console.log("Coordinates: " + destinationCoordX + " / " + destinationCoordY + " / " + destinationCoordZ);
			}
			
		}

		function redirectSSP() {
			window.destinationService = "ssp";
			console.log("destinationService: " + destinationService);
			redirect();
		}

		function redirectOSM() {
			window.destinationService = "osm";
			console.log("destinationService: " + destinationService);
			getCoord();
			redirect();
		}

		function redirectHWG() {
			window.destinationService = "hwg";
			console.log("destinationService: " + destinationService);
			getCoord();
			redirect();
		}

		function redirectGMP() {
			window.destinationService = "gmp";
			console.log("destinationService: " + destinationService);
			getCoord();
			redirect();
		}

		function redirectHMC() {
			window.destinationService = "hmc";
			console.log("destinationService: " + destinationService);
			getCoord();
			redirect();
		}

		function redirectMPL() {
			window.destinationService = "mpl";
			console.log("destinationService: " + destinationService);
			getCoord();
			redirect();
		}

		function redirectGSV() {
			window.destinationService = "gsv";
			console.log("destinationService: " + destinationService);
			getCoord();
			redirect();
		}
	}
	
	
})();
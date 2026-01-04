// ==UserScript==
// @name           	Peer Review Automate (IMVU)
// @description    	Realiza el Peer Review automaticamente. Recuerda cambiar el link de @include a tu link del Peer Review (Si es diferente a este)
// @include        	https://es.imvu.com/peer_review/
// @version        	1.2
// @namespace 		https://greasyfork.org/users/471262
// @downloadURL https://update.greasyfork.org/scripts/398952/Peer%20Review%20Automate%20%28IMVU%29.user.js
// @updateURL https://update.greasyfork.org/scripts/398952/Peer%20Review%20Automate%20%28IMVU%29.meta.js
// ==/UserScript==

//El script NO salta los Captchas de IMVU. ¡Debes estar pendiente!
function sleep(milliseconds) {
	const date = Date.now();
	let currentDate = null;
	do {
		currentDate = Date.now();
	} while (currentDate - date < milliseconds);
}

///Ejecutar al cargar pag. ¿Saltar productos AP? true = si, false = no
window.onload = CheckRate(true);

//Verificacion
function CheckRate(SkipAP) {
	var CurrentRate = document.getElementById("rating").getElementsByTagName("p")[0].getElementsByTagName("strong")[0].textContent;

	if (CurrentRate == "Access Pass Only" && SkipAP) {
		console.log("This product is: ["+CurrentRate+"] Skipping...");
		sleep(5000);
		skip(skipReview());
	}else{
		console.log("This product is: ["+CurrentRate+"] Reviewing...");
		Review();
	}
}

function skip(fn) {
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = '(' + fn + ')();';
	document.body.appendChild(script); // run the script
	document.body.removeChild(script); // clean up
}

function Review() {
	document.getElementById("view_in_3d").click();
	sleep(2000);
	document.getElementById("cb_no_issues").click();
	sleep(30000); //Retraso entre revisión de productos, Minimo 25 segundos, recomiendo 30 segundos.
	document.getElementById("yui-main").getElementsByTagName("form")[0].submit();
}
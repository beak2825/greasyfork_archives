// ==UserScript==
// @name         	UPS Versandinfos kopieren (CM)
// @version      	1.7.1
// @description  	Fügt einen Knopf hinzu, der die Versandinfos kopiert.
// @icon		https://www.ups.com/assets/resources/images/UPS_logo.svg
// @include      	https://*.ups.com/*
// @namespace 		https://greasyfork.org/users/385669
// @downloadURL https://update.greasyfork.org/scripts/397660/UPS%20Versandinfos%20kopieren%20%28CM%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397660/UPS%20Versandinfos%20kopieren%20%28CM%29.meta.js
// ==/UserScript==

// Sendung erstellen
var interval = setInterval(function(){
  var my_div = document.getElementsByClassName("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front alert ui-dialog-buttons ui-draggable ui-resizable")[0];
  my_div.setAttribute("style", "position: absolute; height: auto; width: 1000px; top: 2349px; left: 350px; display: block; z-index: 101;");
  my_div.setAttribute("id", "done");
  clearInterval(interval);
}, 1000);


//Rückholungspapiere
if(!document.getElementById("serviceDate")){
  var getTN = document.getElementById("trackingNumber").innerHTML;
	var getSL = document.getElementById("serviceLevel").innerHTML;

	var TN = document.getElementById("trackingNumber").innerHTML = "Trackingnummer: "+getTN+" ";
	var SL = document.getElementById("serviceLevel").innerHTML = "Service: \t"+getSL+" ";

	var mydiv = document.getElementById("serviceLevel");
	var br = document.createElement("p");
	br.setAttribute("id", "break");
	br.appendChild(document.createElement("br"));
	mydiv.appendChild(br);
  
	var btn = document.createElement("input");
	var mydiv2 = document.getElementById("break");
	btn.setAttribute("onclick", "copyToClipboard();");
	btn.setAttribute("class", "btn");
	btn.setAttribute("type", "button");
	btn.setAttribute("name", "copy");
	btn.setAttribute("id", "copybtn");
	btn.setAttribute("value", "Versanddetails Kopieren");
	mydiv2.appendChild(btn);

	var mydiv3 = document.getElementById("copybtn");
	var htmlcopy = document.createElement("p");
	htmlcopy.setAttribute("id", "htmlcopy");
	htmlcopy.setAttribute("value", "htmlcopy");
	htmlcopy.innerHTML = TN+ "\r\n" +SL;
	mydiv3.appendChild(htmlcopy);

	var mydiv4 = document.getElementById("copybtn");
	var htmlmsg = document.createElement("p");
	htmlmsg.setAttribute("id", "msg");
	htmlmsg.innerHTML = "Hello There!";
	mydiv4.appendChild(htmlmsg);
}

//Normaler Versand
if(document.getElementById("serviceDate")){

	var str = document.getElementById("serviceDate").innerHTML;
	var res = str.replace(/	/g, "");
	document.getElementById("serviceDate").innerHTML = res;
	var str2 = document.getElementById("serviceDate").innerHTML;
	var res2 = str2.replace(/(?:\r\n|\r|\n)/g, '');
	document.getElementById("serviceDate").innerHTML = res2;

	var mostr = document.getElementById("serviceDate").innerHTML;
	var mores = mostr.replace("Montag", " Montag");
	document.getElementById("serviceDate").innerHTML = mores;
	
	var distr = document.getElementById("serviceDate").innerHTML;
   var dires = distr.replace("Dienstag", " Dienstag");
	document.getElementById("serviceDate").innerHTML = dires;

	var mistr = document.getElementById("serviceDate").innerHTML;
	var mires = mistr.replace("Mittwoch", " Mittwoch");
	document.getElementById("serviceDate").innerHTML = mires;

	var dostr = document.getElementById("serviceDate").innerHTML;
	var dores = dostr.replace("Donnerstag", " Donnerstag");
	document.getElementById("serviceDate").innerHTML = dores;

	var frstr = document.getElementById("serviceDate").innerHTML;
	var frres = frstr.replace("Freitag", " Freitag");
	document.getElementById("serviceDate").innerHTML = frres;

  var sastr = document.getElementById("serviceDate").innerHTML;
  var sares = sastr.replace("Samstag", " Samstag");
  document.getElementById("serviceDate").innerHTML = sares;

  var getTN = document.getElementById("trackingNumber").innerHTML;
  var getSL = document.getElementById("serviceLevel").innerHTML;
  var getSD = document.getElementById("serviceDate").innerHTML;

  var TN = document.getElementById("trackingNumber").innerHTML = "Trackingnummer: "+getTN+" ";
  var SL = document.getElementById("serviceLevel").innerHTML = "Service: \t"+getSL+" ";
  var SD = document.getElementById("serviceDate").innerHTML = "Zugestellt bis: "+getSD+" ";

  var mydiv = document.getElementById("serviceDate");
  var br = document.createElement("p");
  br.setAttribute("id", "break");
  br.appendChild(document.createElement("br"));
  mydiv.appendChild(br);
  
  var btn = document.createElement("input");
  var mydiv2 = document.getElementById("break");
  btn.setAttribute("onclick", "copyToClipboard();");
  btn.setAttribute("class", "btn");
  btn.setAttribute("type", "button");
  btn.setAttribute("name", "copy");
  btn.setAttribute("id", "copybtn");
  btn.setAttribute("value", "Versanddetails Kopieren");
  mydiv2.appendChild(btn);

  var mydiv3 = document.getElementById("copybtn");
  var htmlcopy = document.createElement("p");
  htmlcopy.setAttribute("id", "htmlcopy");
  htmlcopy.setAttribute("value", "htmlcopy");
  htmlcopy.innerHTML = TN+ "\r\n" +SL+ "\r\n" +SD;
  mydiv3.appendChild(htmlcopy);

  var mydiv4 = document.getElementById("serviceDate");
  var htmlmsg = document.createElement("p");
  htmlmsg.setAttribute("id", "msg");
  
	//Vorgefertigte Buttons
  
  //Smartphone
  var divmy = document.getElementById("break");
  var br2 = document.createElement("p");
  br2.setAttribute("id", "break2");
  br2.appendChild(document.createElement("br"));
  divmy.appendChild(br2);
  
  var divmy2 = document.getElementById("break2");
  var btnsmartphone = document.createElement("input");
  btnsmartphone.setAttribute("onclick", "copyToClipboard();");
  btnsmartphone.setAttribute("class", "btn");
  btnsmartphone.setAttribute("type", "button");
  btnsmartphone.setAttribute("name", "copy");
  btnsmartphone.setAttribute("id", "smartphonecopyenbtn");
  btnsmartphone.setAttribute("value", "Smartphone Vorlage: Englisch");
  divmy2.appendChild(btnsmartphone);
  
  var divmy3 = document.getElementById("smartphonecopyenbtn");
  var smartphonecopyen = document.createElement("p");
  smartphonecopyen.setAttribute("id", "smartphonecopyen");
  smartphonecopyen.innerHTML = "Hello xxx,\n\nI have now configured your smartphone. As discussed, I send it to the store / department XXXX.\n\nThe UPS tracking number is " +getTN+ "\nIn the package are in addition to your smartphone still a protective cover and two transfer protocols.\nPlease send me one of the logs signed to this email as soon as you receive your smartphone.\nBefore I got the signed handover protocol, I can not close my ticket.\n\nNote:\nPlease insert your SIM card into the phone before starting.\nAfter starting, the PIN code of your Sim card must be entered first and then the screen lock code: 1234.\nPlease change the screenlockcode to a unique code as soon as you receive the Smartphone.\nWarning: If the screen lock code is entered incorrectly 5 times, the phone is automatically deleted and must be resetup.\nIf you need assistance with your smartphone or have any further questions, please contact our Service Desk.\n\nBest regards\nxxx xxx";
  divmy3.appendChild(smartphonecopyen);
  
  //Sonstiges
  var divmy6 = document.getElementById("break2");
  var br3 = document.createElement("p");
  br2.setAttribute("id", "break3");
  br2.appendChild(document.createElement("br"));
  divmy.appendChild(br3);
  
  var divmy5 = document.getElementById("break3");
  var btnsonst = document.createElement("input");
  btnsonst.setAttribute("onclick", "copyToClipboard();");
  btnsonst.setAttribute("class", "btn");
  btnsonst.setAttribute("type", "button");
  btnsonst.setAttribute("name", "copy");
  btnsonst.setAttribute("id", "smartphonecopydebtn");
  btnsonst.setAttribute("value", "Smartphone Vorlage: Deutsch");
  divmy5.appendChild(btnsonst);
  
  var divmy6 = document.getElementById("smartphonecopyenbtn");
  var smartphonecopyde = document.createElement("p");
  smartphonecopyde.setAttribute("id", "smartphonecopyde");
  smartphonecopyde.innerHTML = "Hallo XXX,\n\nich habe dein Smartphone nun fertig konfiguriert. Wie besprochen schicke ich es in die Filiale / Verwaltung XXXX.\n\nDie UPS-Trackingnummer lautet: "+getTN+"\nIn dem Paket befinden sich zusätzlich zu deinem Smartphone noch eine Schutzhülle und zwei Übergabeprotokolle.\nBitte schick mir eins von den Protokollen unterschrieben an diese E-Mail zurück, sobald du dein Smartphone erhalten hast.\nBevor ich das unterschriebene Übergabeprotokoll nicht bekommen habe, kann ich mein Ticket hierzu nicht schließen.\n\nHinweis:\nBitte lege die Simkarte vor dem starten in das Telefon ein. \nNach dem starten muss als erstes der Code der Simkarte eingegeben werden und danach der Bildschirmsperrcode: 1234.\nBitte ändere diesen Bildschirmsperrcode, sobald du das Smartphone erhalten hast in einen beliebigen Code.\nAchtung: Nach 5-maliger Falscheingabe des Bildschirmentsperrcodes wird das Telefon automatisch gelöscht und muss neu eingerichtet werden.\nFalls du Unterstützung beim Umgang mit dem Smartphone benötigst oder weitere Fragen hast, kannst du dich gerne bei unserem Service Desk melden.\n\nSchönen Gruß\nXXX XXX";
  divmy6.appendChild(smartphonecopyde);
}

document.getElementById("copybtn").addEventListener("click", function() {
    copyToClipboardMsg(document.getElementById("htmlcopy"), "msg");
});
document.getElementById("smartphonecopyenbtn").addEventListener("click", function() {
    copyToClipboardMsg(document.getElementById("smartphonecopyen"), "msg");
});
document.getElementById("smartphonecopydebtn").addEventListener("click", function() {
    copyToClipboardMsg(document.getElementById("smartphonecopyde"), "msg");
});

function copyToClipboardMsg(elem, msgElem) {
	  var succeed = copyToClipboard(elem);
    var msg;
    if (!succeed) {
        msg = "Copy not supported or blocked.  Press Ctrl+c to copy."
    } else {
        msg = "Die Versanddetails wurden kopiert."
  			mydiv4.appendChild(htmlmsg);
    }
    if (typeof msgElem === "string") {
        msgElem = document.getElementById(msgElem);
    }
    msgElem.innerHTML = msg;
}

function copyToClipboard(elem) {
	  // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);
    
    // copy the selection
    var succeed;
    try {
    	  succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }
    
    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}
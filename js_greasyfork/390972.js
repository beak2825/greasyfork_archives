// ==UserScript==
// @name         	UPS Versandinfos kopieren
// @version      	1.6.4
// @description  	Fügt einen Knopf hinzu, der die Versandinfos kopiert.
// @icon		https://www.ups.com/assets/resources/images/UPS_logo.svg
// @include      	https://www.ups.com/*
// @include      	https://www.campusship.ups.com/* 
// @namespace 		https://greasyfork.org/users/385669
// @downloadURL https://update.greasyfork.org/scripts/390972/UPS%20Versandinfos%20kopieren.user.js
// @updateURL https://update.greasyfork.org/scripts/390972/UPS%20Versandinfos%20kopieren.meta.js
// ==/UserScript==

// Sendung erstellen
var interval = setInterval(function(){
  var my_div = document.getElementsByClassName("ui-dialog ui-widget ui-widget-content ui-corner-all ui-front alert ui-dialog-buttons ui-draggable ui-resizable alert")[0];
  my_div.setAttribute("style", "position: absolute; height: auto; width: 1000px; top: 1600px; left: 350px; display: block; z-index: 1001;");
  my_div.setAttribute("id", "done");
  clearInterval(interval);
}, 1000);

var cBoxes=document.getElementsByName('reviewDetails')

for (var i=0; i < cBoxes.length; i++) {

    if (cBoxes[i].type=="checkbox") {

	cBoxes[i].checked=false

    }

}


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
  
  //Kasse
  var divmy = document.getElementById("break");
  var br2 = document.createElement("p");
  br2.setAttribute("id", "break2");
  br2.appendChild(document.createElement("br"));
  divmy.appendChild(br2);
  
  var divmy2 = document.getElementById("break2");
  var btnkasse = document.createElement("input");
  btnkasse.setAttribute("onclick", "copyToClipboard();");
  btnkasse.setAttribute("class", "btn");
  btnkasse.setAttribute("type", "button");
  btnkasse.setAttribute("name", "copy");
  btnkasse.setAttribute("id", "kassecopybtn");
  btnkasse.setAttribute("value", "Kassen Vorlage Kopieren");
  divmy2.appendChild(btnkasse);
  
  var divmy3 = document.getElementById("kassecopybtn");
  var kassecopy = document.createElement("p");
  kassecopy.setAttribute("id", "kassecopy");
  kassecopy.innerHTML = "Hallo,\n\ndie neue Kasse wird heute mit UPS verschickt.\n\n" +TN+ "\r\n" +SL+ "\r\n" +SD+ "\n\nBitte ruft uns an sobald die Kasse im Laden angekommen ist, damit wir sie gemeinsam anschließen können.\nBitte schickt die alte Kasse im selben Karton mit der Warenverschiebung an die 19510 an uns zurück.\nWenn vorhanden mit den UPS Rücksendungspapieren zurückschicken.\n\nGrüße\nTeam POS Engineering\n\n------------------------------------------------------------\n\nHello,\n\nThe new cashpoint will be shipped today via UPS.\n\n" +TN+ "\r\n" +SL+ "\r\n" +SD+ "\n\nPlease call us once the cashpoint has arrived at the store, so we can connect them together.\nPlease send the old cashpoint in the same box with the goods movement to the 19510.\nIf included, send it with the UPS return papers.\n\nregards\nTeam POS Engineering";
  divmy3.appendChild(kassecopy);
  
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
  btnsonst.setAttribute("id", "sonstcopybtn");
  btnsonst.setAttribute("value", "Waren Vorlage Kopieren");
  divmy5.appendChild(btnsonst);
  
  var divmy6 = document.getElementById("kassecopybtn");
  var sonstcopy = document.createElement("p");
  sonstcopy.setAttribute("id", "sonstcopy");
  sonstcopy.innerHTML = "Hallo,\n\ndie neue Ware wird heute mit UPS verschickt.\n\n" +TN+ "\r\n" +SL+ "\r\n" +SD+ "\n\nWenn ihr Hilfe beim Anschließen braucht, könnt ihr euch gerne bei uns melden.\n\nGrüße\nTeam POS Engineering\n\n------------------------------------------------------------\n\nHello,\n\nThe new goods will be shipped today via UPS.\n\n" +TN+ "\r\n" +SL+ "\r\n" +SD+ "\n\nIf you need support connecting the goods, don't hestitate to contact us.\n\nregards\nTeam POS Engineering";
  divmy6.appendChild(sonstcopy);
}

document.getElementById("copybtn").addEventListener("click", function() {
    copyToClipboardMsg(document.getElementById("htmlcopy"), "msg");
});
document.getElementById("kassecopybtn").addEventListener("click", function() {
    copyToClipboardMsg(document.getElementById("kassecopy"), "msg");
});
document.getElementById("sonstcopybtn").addEventListener("click", function() {
    copyToClipboardMsg(document.getElementById("sonstcopy"), "msg");
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

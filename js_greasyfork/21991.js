// ==UserScript==
// @name        MH - Kassbi - Message RTE
// @namespace   MH
// @description Transformation de la boite d'édition standard des messages en un Rich Text Editor
// @include     */MH_Play/Play_vue.php
// @include     */Messagerie/MH_Messagerie.php?cat=3*
// @include     */Messagerie/ViewMessage.php?answer=1*
// @icon        https://xballiet.github.io/ImagesMH/MZ.png
// @version     2.8
// @grant       none
// @require     https://greasyfork.org/scripts/23602-tout-mz?version=892175&d=.user.js
// @downloadURL https://update.greasyfork.org/scripts/21991/MH%20-%20Kassbi%20-%20Message%20RTE.user.js
// @updateURL https://update.greasyfork.org/scripts/21991/MH%20-%20Kassbi%20-%20Message%20RTE.meta.js
// ==/UserScript==

/*
* Script MZ : Transformation de la boite d'édition standard des messages en un Rich Text Editor
* Auteur : Kassbinette (95429)
* Contributeur : Utilisation des exemples Mozilla de RTE
*				fonction addbutton empruntée aux scripts de Marmotte86 (93138) & disciple (62333)
* Intégration complète des scripts Messagerie.js de Marmotte86 (93138) & disciple (62333)
*
* Merci à Vapulabehemot(82169) pour ses remarques pertinentes et ses corrections dans les infobulles.
*
* La variable hostName doit être adaptée si le script est copié sur un autre serveur.
* Le chemin du fichier doit subir le même sort si l'arborescence est changée.
*/

//var hostName = "http://localhost:2305";
var hostName = "https://xballiet.github.io";
var editorPath = "/MessageRTE/";
var editorPage = editorPath + "MessageRTE.htm";

if (isPage("MH_Play/Play_vue.php")) {
	function appendLinkToCopiableTable(labelName, tableName) {
		try {
			document.getElementsByName(labelName)[0].parentNode.innerHTML = "<span>" + document.getElementsByName(labelName)[0].parentNode.innerHTML + "</span>";
			oA = document.createElement("A");
			oA.style.cssFloat = "right";
			//oA.innerHTML = "showCopiable";
			oImg = document.createElement("IMG");
			oImg.src = hostName + editorPath + "ClipBoard.png";
			oImg.alt = "Montrer une version copier-collable du tableau";
			oA.appendChild(oImg);
			oA.addEventListener('click',
				function () {
					if (document.getElementById("showCopiableTable") == null || document.getElementById("showCopiableTable").style.display == "none") {
						displayTable(labelName, tableName);
					} else {
						document.getElementById("showCopiableTable").style.display = "none";
					}
				},
				true
			);
			document.getElementsByName(labelName)[0].parentNode.appendChild(oA);
		} catch (e) {
			alert("JS - appendLinkToCopiableTable : " + e.message);
		}
	}

	function removeChildren(oObj) {
		if (oObj.hasChildNodes()) {
			while (oObj.childNodes.length >= 1) {
				oObj.removeChild(oObj.firstChild);
			}
		}
	}

	function findPosY(obj) {
		var curtop = 0;
		if (obj.offsetParent) {
			do {
				curtop += obj.offsetTop;
			} while (obj = obj.offsetParent);
		}
		return curtop;
	}

	function displayTable(labelName, tableName) {
		try {
			var oDiv = document.getElementById("showCopiableTable");
			if (oDiv == null) {
				oDiv = document.createElement("DIV");
			} else {
				removeChildren(oDiv);
			}

			oDiv.style.display = "block";
			oDiv.id = "showCopiableTable";
			oDiv.style.zIndex = 100;
			oDiv.style.padding = "0px";
			oDiv.style.margin = "0px";
			oDiv.style.top = findPosY(document.getElementsByName(labelName)[0]);
			oDiv.style.left = 100;
			oDiv.style.border = "1px black solid";
			oDiv.style.position = "absolute";

			var oEntete = document.createElement("DIV");
			oEntete.style.width = "100%";
			oEntete.style.height = "22px";
			oEntete.style.border = "1px black solid";
			//oEntete.style.background = "White";
			oEntete.style.backgroundImage = "url('" + hostName + editorPath + "MHfond.jpg')";
			oEntete.id = "showCopiableTableEntete";

			var oEnteteTextInnerDiv = document.createElement("DIV");
			oEnteteTextInnerDiv.style.cssFloat = "left";
			oEnteteTextInnerDiv.style.height = "20px";
			oEnteteTextInnerDiv.innerHTML = "Tableau copier-collable vers le MessageRTE";
			oEnteteTextInnerDiv.style.marginTop = "2px";
			oEnteteTextInnerDiv.style.marginLeft = "2px";

			var oEnteteInnerDiv = document.createElement("DIV");
			oEnteteInnerDiv.style.cssFloat = "right";
			oEnteteInnerDiv.style.height = "20px";
			oEnteteInnerDiv.style.width = "20px";

			var oImg = document.createElement("Img");
			oImg.style.width = "100%";
			oImg.style.marginRight = "5px";
			oImg.style.paddingRight = "3px";
			oImg.style.paddingTop = "3px";
			oImg.style.height = "15px";
			oImg.style.width = "15px";
			oImg.addEventListener('click', function () { document.getElementById("showCopiableTable").style.display = "none"; }, true);
			oImg.src = hostName + editorPath + "index.png";
			oImg.style.float = "right";

			oEnteteInnerDiv.appendChild(oImg);
			oEntete.appendChild(oEnteteTextInnerDiv);
			oEntete.appendChild(oEnteteInnerDiv);
			oDiv.appendChild(oEntete);

			var oInnerDiv = document.createElement("DIV");
			oInnerDiv.style.width = "100%";
			oInnerDiv.innerHTML = document.getElementById(tableName).innerHTML;

			oDiv.appendChild(oInnerDiv);

			document.body.appendChild(oDiv);
		} catch(e) {
			alert("JS - displayTable : " + e.message);
		}
	}

	appendLinkToCopiableTable("monstres", "mh_vue_hidden_monstres");
	appendLinkToCopiableTable("trolls", "mh_vue_hidden_trolls");
	appendLinkToCopiableTable("tresors", "mh_vue_hidden_tresors");
	appendLinkToCopiableTable("champignons", "mh_vue_hidden_champignons");
	appendLinkToCopiableTable("lieux", "mh_vue_hidden_lieux");
	appendLinkToCopiableTable("cadavres", "mh_vue_hidden_cadavres");
}

if (isPage("Messagerie/MH_Messagerie.php?cat=3")) {
	// Dialogue avec l'iframe
	function receiveMessage(event) {
		try {
				// Vérifier l'origine du message
				if (event.origin.toLowerCase() == hostName.toLowerCase()) {
					if (event.data.substring(0, "SendHtml".length) == "SendHtml") {
						// L'iframe enfant envoie le texte qu'elle contient, donc l'ajouter dans la textArea originale
						SendHtml(event.data);
					} else if (event.data == "RequestText") {
						// L'iframe demande le texte présent dans la textArea, donc lui fournir le texte présent dans celle-ci
						FillText();
					} else if (event.data == "HideTextArea") {
						HideTextArea();
					} else if (event.data == "DisplayRTE") {
						DisplayRTE();
					} else if (event.data == "Preview") {
						displayPreview();
					} else if (event.data == "SaveMsg") {
						SaveMsg();
					} else if (event.data.substring(0, "SaveMpFont".length) == "SaveMpFont") {
						SaveFont(event.data.substring("SaveMpFont".length, event.data.length));
					} else if (event.data == "RTERequestMpFont") {
						SendFont();
					} else if (event.data == "RestoreMsg") {
						RestoreMsg();
					} else if (event.data == "Reply") {
						Reply();
					} else if (event.data == "RTERequestMpSignature") {
						SendSignature();
					} else if (event.data == "RTERequestMpSignatureUsage") {
						SendSignatureUsage();
					} else if (event.data.substring(0, "SaveSignatureUsage".length) == "SaveSignatureUsage") {
						SaveSignatureUsage(event.data.substring("SaveSignatureUsage".length, event.data.length));
					} else if (event.data.substring(0, "SaveMpSignature".length) == "SaveMpSignature") {
						SaveSignature(event.data.substring("SaveMpSignature".length, event.data.length));
					} else {
						alert("JS - receiveMessage - Commande non reconnue : " + event.data);
					}
			} else {
				alert("HostName incorrect :" + event.origin + " alors que " + hostName + " était attendu.");
			}
		} catch (e) {
			alert("JS - receiveMessage : " + e.message);
		}
	}

	// Stocker la signature
	function SaveSignature(signature) {
		try {
			window.localStorage['MpSignature'] = signature;
		} catch (e) {
			alert("JS - SaveSignature : " + e.message);
		}
	}

	// Stocker l'utilisation de la signature
	function SaveSignatureUsage(usage) {
		try {
			window.localStorage['MpSignatureUsage'] = usage;
		} catch (e) {
			alert("JS - SaveSignatureUsage : " + e.message);
		}
	}

	// Envoyer la signature
	function SendSignature(){
		try {
			if (window.localStorage['MpSignature']) {
				signature = window.localStorage['MpSignature'];
				var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
				iFrameWindow.postMessage("JsSendMpSignature" + signature, hostName);
			}
		} catch (e) {
			alert("JS - SaveSignature : " + e.message);
		}
	}

	// Envoyer l'utilisation de la signature
	function SendSignatureUsage() {
		try {
			if (window.localStorage['MpSignatureUsage']) {
				signatureUsage = window.localStorage['MpSignatureUsage'];
				var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
				iFrameWindow.postMessage("JsSendMpSignatureUsage" + signatureUsage, hostName);
			}
		} catch (e) {
			alert("JS - SaveSignature : " + e.message);
		}
	}

	// Stocker la font
	function SaveFont(fontName) {
		try {
			window.localStorage['MpFont'] = fontName;
		} catch (e) {
			alert("JS - SaveFont : " + e.fontName);
		}
	}

	// Envoyer la font
	function SendFont() {
		try {
			if (window.localStorage['MpFont']) {
				fontname = window.localStorage['MpFont'];
				var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
				iFrameWindow.postMessage("JsSendMpFont" + fontname, hostName);
			}
		} catch (e) {
			alert("JS - SendFont : " + e.message);
		}
	}

	// Fonction envoyant le texte du RTE à la textArea
	function SendHtml(text) {
		 try {
			document.getElementsByName('Message')[0].value = text.substring("SendHtml".length, text.length).replace(/<br>/gi, '\r\n');
			displayPreview();
		} catch (e) {
			alert("JS - SendHtml : " + e.message);
		}
	}

	// Fonction demandant au RTE de fournir le texte qu'il contient
	function RequestHtmlText() {
		try {
			var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
			// Demander le texte contenu dans la textArea
			iFrameWindow.postMessage("RequestHtmlText", hostName);
		} catch (err) {
			alert("JS - error : " + err.message);
		}
	}

	// Fournir le texte de la textArea au RTE
	function FillText() {
		try {
			var iFrameWindow = unsafeWindow.document.getElementById('RTEedit').contentWindow;
			// Forcer le stockage du texte contenu dans la textArea dans la boite d'édition
			iFrameWindow.postMessage("FillText" + document.getElementsByName('Message')[0].value.replace(/\n/gi, '<br>'), hostName);
			displayPreview();
		} catch (err) {
			alert("JS - error : " + err.message);
		}
	}

	// Cacher la textArea
	function HideTextArea() {
		try {
			document.getElementsByName('Message')[0].style.visibility = "hidden";
			document.getElementsByName('Message')[0].style.display = "none";
		} catch (e) {
			alert("JS - HideTextArea : " + e.message);
		}
	}

	// Montrer la textArea
	function ShowTextArea() {
		try {
			document.getElementsByName('Message')[0].style.visibility = "visible";
			document.getElementsByName('Message')[0].style.display = "block";
			document.getElementsByName('Message')[0].focus();
		} catch (e) {
			alert("JS - ShowTextArea : " + e.message);
		}
	}

	// Créer le RTE
	function createRTE() {
		try {
			// Création de la textArea
			var messageArea = document.getElementsByName('Message')[0];
			//messageArea.parentNode.appendChild(document.createElement('br'));
			var newTextArea = document.createElement('iframe');
			newTextArea.setAttribute('id', 'RTEedit');
			newTextArea.setAttribute('src', hostName + editorPage);
			newTextArea.setAttribute('style', 'border:0px;overflow:hidden;width:630px;height:440px;display:none');
			messageArea.parentNode.appendChild(newTextArea);
			submitButton = document.getElementsByName('bsSend')[0];
		} catch (e) {
			alert("JS - CreateRTE : " +e.message);
		}
	}

	// Montrer le RTE
	function DisplayRTE() {
		try {
			document.getElementById('RTEedit').style.display = "block";
		} catch (e) {
			alert("JS - DisplayRTE : " + e.message);
		}
	}

	// Ajout d'un bouton
	function addButton(caption, clickFunction) {
		try {
			var sendButton = document.getElementsByName('bsSend')[0];
			var newButton = document.createElement('input');
			newButton.setAttribute('type', 'button');
			newButton.setAttribute('class', 'mh_form_submit');
			newButton.setAttribute('value', caption);
			newButton.addEventListener('click', clickFunction, true);
			sendButton.parentNode.appendChild(document.createTextNode(' '));
			sendButton.parentNode.appendChild(newButton);
		} catch (e) {
			alert("JS - addButton : " + e.message);
		}
	}

	/// Intégration des scripts de marmotte et disciple ///
	function addPreviewBox() {
		try {
			// Ajout de la ligne d'affichage de l'aperçu
			var trPreview = document.createElement('tr');
			trPreview.setAttribute('class', 'mh_tdpage');
			var tdPreview = document.createElement('td');
			tdPreview.setAttribute('id', 'marmotte_preview');
			tdPreview.setAttribute('colspan', 4);
			trPreview.appendChild(tdPreview);
			//document.getElementsByTagName('form')[0].getElementsByTagName('table')[2].getElementsByTagName('tbody')[0].appendChild(trPreview);
			document.getElementsByName('bsSend')[0].parentNode.parentNode.parentNode.appendChild(trPreview);
		} catch (e) {
			alert("JS - addPreviewBox : " + e.message);
		}
	}

	// Affichage de l'aperçu
	function displayPreview() {
		try {
			var tdPreview = document.getElementById('marmotte_preview');
			var messageArea = document.getElementsByName('Message')[0];
			tdPreview.innerHTML = messageArea.value.replace(/\r?\n/g, '<br>');
		} catch (e) {
			alert("JS - displayPreview : " + e.message);
		}
	}

	// Sauvegarde du MP
	function SaveMsg() {
		try {
			var messageArea = document.getElementsByName('Message')[0];
			var titleInput = document.getElementsByName('Titre')[0];
			if (titleInput.value != '') {
				window.localStorage['lastMPTitle'] = titleInput.value;
			}
			if (messageArea.value != '') {
				window.localStorage['lastMP'] = messageArea.value;
			}
		} catch (e) {
			alert("JS - SaveMsg : " + e.message);
		}
	}

	// Restauration du MP sauvegardé
	function RestoreMsg() {
		try {
			var messageArea = document.getElementsByName('Message')[0];
			var titleInput = document.getElementsByName('Titre')[0];
			if (window.localStorage['lastMPTitle']) {
				titleInput.value = window.localStorage['lastMPTitle'];
			}
			if (window.localStorage['lastMP']) {
				messageArea.value = window.localStorage['lastMP'];
			}
			FillText();
		} catch (e) {
			alert("JS - RestoreMsg : " + e.message);
		}
	}

	// Restauration du MP sauvegardé
	function Reply() {
		var messageArea = document.getElementsByName('Message')[0];
		if (window.localStorage['lastReply']) {
			messageArea.value = window.localStorage['lastReply'];
		}
		FillText();
	}
	/// Fin première partie intégration ///

	// Modification de la page MH
	try {
		// Initialiser les événements sur la page
		unsafeWindow.addEventListener("message", receiveMessage, false);
		// Ajout d'un event onChange sur la textArea
		//document.getElementsByName('Message')[0].addEventListener("change", FillText, false);
		// Ajouter le RTE (mais pas le montrer : lorsqu'il sera créé, il demandera lui-même à cette page de l'afficher)
		createRTE();
		/// Marmotte : ajouter la boite de preview
		addPreviewBox();
		/// Marmotte : ajouter l'événement enregistrant la copie durant l'envoi du message
		document.getElementsByName('bsSend')[0].addEventListener('click', SaveMsg, true);

		if (hostName == "http://localhost:2105" || hostName == "http://localhost:2305") {
			addButton("Textarea Text", ShowTextArea);
		}
	} catch (e) {
		alert("JS - Init page: " + e.message);
	}
} else if (isPage("Messagerie/ViewMessage.php?answer=1")) {
	/* Ajout de disciple (62333) */
	function reply(e) {
		var reply = document.evaluate("//table/tbody/tr[5]/td", document, null, XPathResult.ANY_TYPE, null).iterateNext().innerHTML;
		reply = '> ' + reply.replace(/<br>/g, '<br>&gt; ');
		window.localStorage['lastReply'] = reply + '\n\n';
	};

	document.getElementsByName('bAnswer')[0].addEventListener('click', reply, true);
	document.getElementsByName('bAnswerToAll')[0].addEventListener('click', reply, true);
}
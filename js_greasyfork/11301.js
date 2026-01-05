// ==UserScript==
// @name        Messagerie : Titres Perso
// @namespace   Dreadcast
// @include     http://www.dreadcast.net/Main
// @version     0.2
// @grant       none
// @description Personnalisation des titres, sur la messagerie
// @downloadURL https://update.greasyfork.org/scripts/11301/Messagerie%20%3A%20Titres%20Perso.user.js
// @updateURL https://update.greasyfork.org/scripts/11301/Messagerie%20%3A%20Titres%20Perso.meta.js
// ==/UserScript==

function personnaliseMessage(idMessage){
	var saisie = prompt('Saisissez un titre a mettre pour ce message :', $('#db_message_'+idMessage+' .head .title').html());
	if (saisie != null){
		setTitreStorage(saisie, idMessage);
		applyTitreMessage(saisie, idMessage);
	}
}

function applyTitreMessage(titre, idMessage){
	$('#message_'+idMessage+' .message_titre').html(titre);
	$('#db_message_'+idMessage+' .head .title').html(titre);
}

function setTitreStorage(titre, idMessage){
	if(titre!=null && titre.length > 0){
		titreMessagesPerso = getAllStorage();
		titreMessagesPerso[idMessage] = titre;
		localStorage.setItem("titreMessagesPerso",JSON.stringify(titreMessagesPerso));
	}
}

function getTitreStorage(idMessage){
	titreMessagesPerso = getAllStorage();
	return (titreMessagesPerso[idMessage])?titreMessagesPerso[idMessage]:null;
}

function getAllStorageJson(){
	return localStorage.getItem("titreMessagesPerso");
}
function getAllStorage(){
	var titreMessagesPerso = {};
	var titreMessagesPersoJson = getAllStorageJson();
	if(titreMessagesPersoJson!=null){
		titreMessagesPerso = JSON.parse(titreMessagesPersoJson);
	}
	return titreMessagesPerso;
}

function appllyOnAllMessages(){
	titreMessagesPerso = getAllStorage();
	$.each( titreMessagesPerso, function( idMessage, titre ) {
		applyTitreMessage(titre, idMessage);
	});
}


$(document).ready(function() {
	appllyOnAllMessages();
	addImportExportMessages();
});

MenuMessagerie.prototype.openFolderSave = MenuMessagerie.prototype.openFolder;
MenuMessagerie.prototype.openFolder = function(a){
	$.ajaxSetup({async: false});	
	toReturn = this.openFolderSave(a);
	appllyOnAllMessages();
	$.ajaxSetup({async: true});
	return toReturn;
}

MenuMessagerie.prototype.openMessageSave = MenuMessagerie.prototype.openMessage;
MenuMessagerie.prototype.openMessage=function(a,b){
	$.ajaxSetup({async: false});	
	toReturn = this.openMessageSave(a,b)
	$('#db_message_'+a+' .head .title').before('<div title="Editer le titre" class="info1 link edit"></div>');
	$('#db_message_'+a+' .head .link.edit').css({ 
		position: 'absolute', 
		right: '56px', 
		top: '2px', 
		width: '37px',
		height: '36px',
		background: 'url(../../../images/fr/design/boutons/boutons.png) -192px -137px no-repeat'
	}).hover(function(){
		$(this).css({'background-position': '-263px -137px'});
	}, function(){
	    $(this).css({'background-position': '-192px -137px'});
	}).click(function(){
		idMessage = $(this).parent().parent().attr('id').substring(11);
		personnaliseMessage(idMessage);
	});
	appllyOnAllMessages();
	$.ajaxSetup({async: true});
	return toReturn;
}

function addImportExportMessages(){
	$('#action_list')
		.append('<li id="exportMessages">Exporter mes Titres de messages</li>')
		.append('<li id="importMessages">Importer des Titres de messages</li>')
		.append('<li id="emptyMessages">Vider mes Titres de messages</li>');

	$('#exportMessages').click(function(){
		alert(getAllStorageJson());
	});
	$('#importMessages').click(function(){
		var saisie = prompt('Entrez l\'export de titre a importer :');
		if (saisie != null){
			titreMessagesPerso = JSON.parse(saisie);
			$.each( titreMessagesPerso, function( idMessage, titre ) {
				setTitreStorage(titre, idMessage);
			});
			appllyOnAllMessages();
		}
	});
	$('#emptyMessages').click(function(){
		if (confirm("Supprimer l\'intégralité de votre personnalisation de Titres de messages?") == true){
			localStorage.removeItem("titreMessagesPerso");
			alert('Suppression effectuée! Rechargez votre page, parce que j\'ai vraiment la flemme de remettre les titres d\'origine a la main...');
		}
	});
}

console.log('Perso Message: On.');
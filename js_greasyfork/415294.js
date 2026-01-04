// ==UserScript==
// @name        Messagerie : Titres Perso
// @author      Isilin
// @namespace   Dreadcast
// @include     https://www.dreadcast.net/Main
// @version     1.0.4
// @grant       none
// @description Personnalisation des titres et des avatars d'aperçu, sur la messagerie. Inspiré du script original "Messagerie : Titre Perso".
// @downloadURL https://update.greasyfork.org/scripts/415294/Messagerie%20%3A%20Titres%20Perso.user.js
// @updateURL https://update.greasyfork.org/scripts/415294/Messagerie%20%3A%20Titres%20Perso.meta.js
// ==/UserScript==

function personnaliseAvatar(idMessage) {
  var saisie = prompt(
    "Saisissez un url d'avatar pour ce message :",
    $('#message_' + idMessage + ' img').attr('src'),
  );
  if (saisie != null) {
    setAvatarStorage(saisie, idMessage);
    applyAvatarMessage(saisie, idMessage);
  }
}

function applyAvatarMessage(url, idMessage) {
  $('#message_' + idMessage + ' img').attr('src', url);
}

function setAvatarStorage(url, idMessage) {
  if (url != null && url.length > 0) {
    avatarMessagesPerso = getAllStorageAvatar() || {};
    avatarMessagesPerso[idMessage] = url;
    localStorage.setItem(
      'avatarMessagesPerso',
      JSON.stringify(avatarMessagesPerso),
    );
  }
}

function getAvatarStorage(idMessage) {
  avatarMessagesPerso = getAllStorageAvatar();
  return avatarMessagesPerso[idMessage] ? avatarMessagesPerso[idMessage] : null;
}

function getAllStorageAvatarJson() {
  return localStorage.getItem('avatarMessagesPerso');
}

function getAllStorageAvatar() {
  var avatarMessagesPerso = {};
  var avatarMessagesPersoJson = getAllStorageAvatarJson();
  if (avatarMessagesPerso != null) {
    avatarMessagesPerso = JSON.parse(avatarMessagesPersoJson);
  }
  return avatarMessagesPerso;
}

function applyAvatarOnAllMessages() {
  avatarMessagesPerso = getAllStorageAvatar();
  if (avatarMessagesPerso != null) {
    $.each(avatarMessagesPerso, function (idMessage, url) {
      applyAvatarMessage(url, idMessage);
    });
  }
}

// ====================================

function personnaliseMessage(idMessage) {
  var saisie = prompt(
    'Saisissez un titre a mettre pour ce message :',
    $('#db_message_' + idMessage + ' .head .title').html(),
  );
  if (saisie != null) {
    setTitreStorage(saisie, idMessage);
    applyTitreMessage(saisie, idMessage);
  }
}

function applyTitreMessage(titre, idMessage) {
  $('#message_' + idMessage + ' .message_titre').html(titre);
  $('#db_message_' + idMessage + ' .head .title').html(titre);
}

function setTitreStorage(titre, idMessage) {
  if (titre != null && titre.length > 0) {
    titreMessagesPerso = getAllStorage();
    titreMessagesPerso[idMessage] = titre;
    localStorage.setItem(
      'titreMessagesPerso',
      JSON.stringify(titreMessagesPerso),
    );
  }
}

function getTitreStorage(idMessage) {
  titreMessagesPerso = getAllStorage();
  return titreMessagesPerso[idMessage] ? titreMessagesPerso[idMessage] : null;
}

function getAllStorageJson() {
  return localStorage.getItem('titreMessagesPerso');
}
function getAllStorage() {
  var titreMessagesPerso = {};
  var titreMessagesPersoJson = getAllStorageJson();
  if (titreMessagesPersoJson != null) {
    titreMessagesPerso = JSON.parse(titreMessagesPersoJson);
  }
  return titreMessagesPerso;
}

function applyOnAllMessages() {
  titreMessagesPerso = getAllStorage();
  $.each(titreMessagesPerso, function (idMessage, titre) {
    applyTitreMessage(titre, idMessage);
  });
}

$(document).ready(function () {
  applyOnAllMessages();
  applyAvatarOnAllMessages();
  addImportExportMessages();
});

MenuMessagerie.prototype.openFolderSave = MenuMessagerie.prototype.openFolder;
MenuMessagerie.prototype.openFolder = function (a) {
  $.ajaxSetup({ async: false });
  toReturn = this.openFolderSave(a);
  applyOnAllMessages();
  applyAvatarOnAllMessages();
  $.ajaxSetup({ async: true });
  return toReturn;
};

MenuMessagerie.prototype.openMessageSave = MenuMessagerie.prototype.openMessage;
MenuMessagerie.prototype.openMessage = function (a, b) {
  $.ajaxSetup({ async: false });
  toReturn = this.openMessageSave(a, b);
  $('#db_message_' + a + ' .head .title').before(
    '<div title="Editer le titre" class="info1 link edit" id="editTitle"></div>',
  );
  $('#db_message_' + a + ' #editTitle')
    .css({
      position: 'absolute',
      right: '56px',
      top: '-1px',
      width: '34px',
      height: '34px',
      background:
        'url(../../../images/fr/design/boutons/boutons.png) -194px -138px no-repeat',
    })
    .hover(
      function () {
        $(this).css({ 'background-position': '-264px -139px' });
      },
      function () {
        $(this).css({ 'background-position': '-194px -138px' });
      },
    )
    .click(function () {
      idMessage = $(this).parent().parent().parent().attr('id').substring(11);
      personnaliseMessage(idMessage);
    });
  applyOnAllMessages();

  $('#db_message_' + a + ' .head .title').before(
    '<div title="Editer l\'avatar" class="info1 link edit" id="editAvatar"></div>',
  );
  $('#db_message_' + a + ' #editAvatar')
    .css({
      position: 'absolute',
      right: '93px',
      top: '-1px',
      width: '34px',
      height: '34px',
      background:
        'url(../../../images/fr/design/boutons/boutons.png) -229px -243px no-repeat',
    })
    .hover(
      function () {
        $(this).css({ 'background-position': '-264px -243px' });
      },
      function () {
        $(this).css({ 'background-position': '-229px -243px' });
      },
    )
    .click(function () {
      idMessage = $(this).parent().parent().parent().attr('id').substring(11);
      personnaliseAvatar(idMessage);
    });
  applyAvatarOnAllMessages();

  $.ajaxSetup({ async: true });
  return toReturn;
};

function addImportExportMessages() {
  $('#action_list')
    .append('<li id="exportMessages">Exporter mes Titres de messages</li>')
    .append('<li id="importMessages">Importer des Titres de messages</li>')
    .append(
      '<li id="exportAvatarMessages">Exporter mes Avatar de messages</li>',
    )
    .append(
      '<li id="importAvatarMessages">Importer des Avatar de messages</li>',
    )
    .append(
      '<li id="emptyMessages">Vider mes Titres et Avatar de messages</li>',
    );

  $('#exportMessages').click(function () {
    alert(getAllStorageJson());
  });
  $('#importMessages').click(function () {
    var saisie = prompt("Entrez l'export de titre a importer :");
    if (saisie != null) {
      titreMessagesPerso = JSON.parse(saisie);
      $.each(titreMessagesPerso, function (idMessage, titre) {
        setTitreStorage(titre, idMessage);
      });
      applyOnAllMessages();
    }
  });
  $('#exportAvatarMessages').click(function () {
    alert(getAllStorageAvatarJson());
  });
  $('#importAvatarMessages').click(function () {
    var saisie = prompt("Entrez l'export d'avatar a importer :");
    if (saisie != null) {
      avatarMessagesPerso = JSON.parse(saisie);
      $.each(avatarMessagesPerso, function (idMessage, url) {
        setAvatarStorage(url, idMessage);
      });
      applyAvatarOnAllMessages();
    }
  });
  $('#emptyMessages').click(function () {
    if (
      confirm(
        "Supprimer l'intégralité de votre personnalisation de Titres et Avatar de messages?",
      ) == true
    ) {
      localStorage.removeItem('titreMessagesPerso');
      localStorage.removeItem('avatarMessagesPerso');
      alert(
        "Suppression effectuée! Rechargez votre page, parce que j'ai vraiment la flemme de remettre les titres d'origine a la main...",
      );
    }
  });
}

console.log('Perso Message: On.');

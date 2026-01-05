// ==UserScript==
// @name            WME Chat addon
// @description     removes duplicates messages, formats link and permalinks, and some stuffs
// @namespace       dummyd2
// @version         2023.03.11.01
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94DDg83H1XMMOAAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAEQ0lEQVRYw+2XTUhcVxTHf0+dwcxUHawuxImtH0hbBEebGLCFutGFgSaBriImoXRRBLciqYuKza4bN21dVFcJgouE2IKolIJYP0BmFCwKoyJxksyMTGZ0Zvpax3u6eW+YD40abTftH+7mvnfv/3/OPfecc+G/Du0ca2sBJ5Bv7BMDXgDr/6Tgz4CfgAAQAaIGcQzYB8KAH/gZuHVRpAXAbeAlIIDk5uaKzWZTRUVFUlxcLMXFxVJUVCQ2m03y8vLE/A/wAV8Aljc9gk+AB8BHABUVFTQ0NHDt2jWuXLlCbW0tZWVlKKXw+/14vV4WFxdZWFhgaWlJdnZ2zP0XgF7g17NY/qXhUrHb7aq/v195PB45DZRSsrKyIgMDA2K1Wk1vhAxvnAq3AR2QiooKtba2JkqpNILTIJFIyMbGhqqvr1eGiEOg6yTyauBPQOrq6lQikTgTaaYnRET8fr80NzcLoAzDPn6dgBlA6uvrVTgcfmPyTBHb29tSU1NjHscvgP0o8k8BcTgcanp6+tzkmSJmZ2dNAQcGVxZ+A+TmzZvnZz0GHR0dZjwMAdZU8hLgldVqVUNDQxdmfSZmZmZML2wAhZl3fr+goEBWV1ezXHiUmNMIzLw94XBY7Ha7KaIkJ0XAW0COxWKhqqoqPVtpGpqmMTw8zN27d3ny5Ely/uHDh9y5c4epqSmUUiilePz4Mffu3WNychJN0xCRtH2MYMxKhNeBmMPhkN3d3SxLxsfHpbCwUABxOp3i8Xhkfn4+mXbz8/MlEAiI1+tNzmmaJj6fL22fcDgsNTU1ZhyUpnrgBXB4cHAgq6urAEnlAJubm8TjcQACgQCRSIS1tbXkd13XCYVCbG1tJedEhPX19OKo6zper1cD/jISU1pdeJ6TkyN9fX1ZHvD5fNLa2ipOp1M6OzslGAxKNBqVlpYWKS8vl46ODonH4xKNRqW9vV2cTqfcuHEjKxZGRkZM62ePygXDgDQ1NalgMJi1OBQKidvtlkgkkvy2v78vHo9HYrFYcm5vb0+Wl5dF1/WsQKyurjYF3AdyMgWUmOc3ODiYFv2ZEX/czTjqFpj/9fT0pJbpD49LxQ9MEXNzc+oiMqCIyNjYmFgsFmXUg+9eVwvyzXrQ1NR0IeSPHj0Sh8Nhun4JePukingLEJfLda6sFwwGpaurS9nt9lTyd0/TD1w/j4BQKCS9vb1SWloqmqaZ5z4JlGYS5R1BbgM+B7h8+bLouq6Nj48zOjoqT58+1RKJBC6Xi7a2NmlsbNQqKys5PDzk2bNneDweJiYmcLvd5l7K6Kq+B74GEqex/r7ZvXR3d6urV6+qlCZTjA5YThgxwA18C7x/lnfBV8A3Keo1Y0SM8jkLxI2u6YNj3gW/G2+DdeD5WZrQFoMo05ofgXeOSBoWg/ySMfJf134fh9QYuAT8YVjzEvgBGAFeHbP2wBgXivcAF//jX8TfP8rg1M0AqeYAAAAASUVORK5CYII=
// @include         https://www.waze.com/editor*
// @include         https://www.waze.com/*/editor*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @grant           GM_addElement
// @author          Dummyd2, Seb-D59, WazeDev
// @copyright       2018, dummyd2, Seb-D59, WazeDev
// @connect         docs.google.com
// @connect         wazedev.com
// @downloadURL https://update.greasyfork.org/scripts/369855/WME%20Chat%20addon.user.js
// @updateURL https://update.greasyfork.org/scripts/369855/WME%20Chat%20addon.meta.js
// ==/UserScript==


/*******
 * 
 * Many thanks to Pawel Pyrczak (aka tkr85) for his script chat jumper compatible with this script
 * 
 *  You are free to:
 *   Share, copy, and redistribute the script in any medium or format
 *   under the following terms:
 *   Attribution - You must give appropriate credit. You may do so in any
 *     reasonable manner, but not in any way that suggests the licensor
 *     endorses you or your use.
 * 
 *   NonCommercial - You may not use the script for commercial purposes.
 *
 *   NoModifications - You may NOT MODIFY the script.
 * 
 *  You are invited to contact the author: dummyd2 on waze forum for more details.
 * 
********/

function downloadHelperInjected() {
  window.WMECADownloadHelper = {jobs:[], _waitForData:function(id) {
    if (this.jobs.length <= id) {
      this.jobs[id].callback({url:null, data:null, callback:this.jobs[id].callback, status:"error", error:"Request not found", response:""});
    } else {
      if (this.jobs[id].status == "success" || this.jobs[id].status == "error") {
        this.jobs[id].callback(this.jobs[id]);
      } else {
        if (this.jobs[id].status == "downloading" && this.jobs[id].progressCallback) {
          this.jobs[id].progressCallback(this.jobs[id]);
        }
        var _this = this;
        window.setTimeout(function() {
          _this._waitForData(id);
        }, 500);
      }
    }
  }, add:function(params, callback, progressCallback) {
    this.jobs.push({params:params, data:null, callback:callback, progressCallback:progressCallback, status:"added", progression:0, error:"", response:""});
    var id = this.jobs.length - 1;
    var _this = this;
    window.setTimeout(function() {
      _this._waitForData(id);
    }, 500);
  }};
}
var downloadHelperInjectedScript = GM_addElement('script', {
  textContent: "" + downloadHelperInjected.toString() + " \n" + "downloadHelperInjected();"
});
if (typeof unsafeWindow === "undefined") {
  unsafeWindow = function() {
    var dummyElem = document.createElement("p");
    dummyElem.setAttribute("onclick", "return window;");
    return dummyElem.onclick();
  }();
}
function lookFordownloadHelperJob() {
  for (var i = 0; i < unsafeWindow.WMECADownloadHelper.jobs.length; i++) {
    if (unsafeWindow.WMECADownloadHelper.jobs[i].status == "added") {
      unsafeWindow.WMECADownloadHelper.jobs[i].status = cloneInto("downloading", unsafeWindow.WMECADownloadHelper.jobs[i]);
      var f = function() {
        var job = i;
        GM_xmlhttpRequest({method:unsafeWindow.WMECADownloadHelper.jobs[job].params.method, headers:unsafeWindow.WMECADownloadHelper.jobs[job].params.headers, data:unsafeWindow.WMECADownloadHelper.jobs[job].params.data, synchronous:false, timeout:10000, url:unsafeWindow.WMECADownloadHelper.jobs[job].params.url, onerror:function(r) {
          console.log("Chat addon: Error while getting data from server: ", r);
          unsafeWindow.WMECADownloadHelper.jobs[job].status = cloneInto("error", unsafeWindow.WMECADownloadHelper.jobs[job]);
          unsafeWindow.WMECADownloadHelper.jobs[job].response = cloneInto(JSON.stringify(r), unsafeWindow.WMECADownloadHelper.jobs[job]);
        }, ontimeout:function(r) {
          console.log("Chat addon: Timeout while getting data from server: ", r);
          unsafeWindow.WMECADownloadHelper.jobs[job].status = cloneInto("timeout", unsafeWindow.WMECADownloadHelper.jobs[job]);
          unsafeWindow.WMECADownloadHelper.jobs[job].response = cloneInto(JSON.stringify(r), unsafeWindow.WMECADownloadHelper.jobs[job]);
        }, onload:function(r) {
          unsafeWindow.WMECADownloadHelper.jobs[job].status = cloneInto("success", unsafeWindow.WMECADownloadHelper.jobs[job]);
          unsafeWindow.WMECADownloadHelper.jobs[job].data = cloneInto(r.responseText, unsafeWindow.WMECADownloadHelper.jobs[job]);
        }, onprogress:function(r) {
          unsafeWindow.WMECADownloadHelper.jobs[job].progression = cloneInto(r.total == 0 ? 0 : r.loaded / r.total, unsafeWindow.WMECADownloadHelper.jobs[job]);
        }});
      }();
    }
  }
  window.setTimeout(lookFordownloadHelperJob, 2000);
}
window.setTimeout(lookFordownloadHelperJob);
function run_CA() {
  var ca_version = "2022.11.23.01";
  var isDebug = false;
  var targetCount = 0;
  var bipCount = 0;
  var divPerma = null;
  var divChat = null;
  var doNotNotifyNext = false;
  var serverBase = "https://wazedev.com/chataddon";
  var lastMessageFrom = "";
  var hasUnreadMessages = false;
  var tts_audio = null;
  var tts_messages = [];
  var systemMessageDates = [];
  var userActivity = {};
  var sortUserListDisbled = false;
  var currentJumpSet = null;
  var selectDataWaitForMergeEnd = false;
  var roomForced = false;
  var CMList = null;
  var userAlertList = {};
  var history = [];
  var historyLeaders = {};
  var uid = null;
  var msgCountPerUpload = 1;
  var wazeRequires = {};
  var savedLastMessage = {from:"", text:""};
  var icons = {};
  var translations = {};
  translations.fr = {};
  translations.fr["Error: Message background color must be a HTML format string\nwith exact length of 6 hexadecimal characters"] = "Erreur: la couleur de fond de message doit &ecirc;tre au format HTML\nsoit une suite de 6 caract&egrave;res hexad&eacute;cimaux";
  translations.fr["Error: Alert background color must be a HTML format string\nwith exact length of 6 hexadecimal characters"] = "Erreur: la couleur de fond d'alerte doit &ecirc;tre au format HTML\nsoit une suite de 6 caract&egrave;res hexad&eacute;cimaux";
  translations.fr["Error: bip pattern must contain {userName}"] = "Erreur: le mod&egrave;le de bip doit contenir {userName}";
  translations.fr["has joined"] = "est entr\u00e9";
  translations.fr["has left"] = "est parti";
  translations.fr["Chat addon settings"] = "Options de chat addon";
  translations.fr["Play sound on new message"] = "Jouer un son &agrave; chaque nouveau message";
  translations.fr["Text to speech on messages"] = "Lecture des messages";
  translations.fr["language"] = "Langue";
  translations.fr["Text to speech on from username"] = "Texte &agrave; lire pour le nom d'exp&eacute;diteur";
  translations.fr["TTS from username"] = "TTS de l'exp&eacute;diteur";
  translations.fr["Text to speech on internet link"] = "Texte &agrave; lire pour un lien internet";
  translations.fr["TTS link to"] = "TTS lien vers";
  translations.fr["Show message date (uncheck for time only)"] = "Afficher la date (d&eacute;cocher pour l'heure seulement)";
  translations.fr["My message background color"] = "Couleur de fond de mes messages";
  translations.fr["Alert color"] = "Couleur d'alerte";
  translations.fr["words separated by a comma\nCase unsensitive\nBegin and end with $ to match exact word"] = "mots s&eacute;par&eacute;s par des virgules\nInsensible &agrave; la casse\nCommencer et finir par un $ pour capter le mot exact";
  translations.fr["eg"] = "ex";
  translations.fr["or"] = "ou";
  translations.fr["userNameOfAFriend,$unlock$"] = "nomdunamis,$d&eacute;lock$";
  translations.fr["Alert match"] = "Alerte sur";
  translations.fr["Play sound on new alert"] = "Jouer un son sur l'alerte";
  translations.fr["Remove messages of users not in the users list of the room"] = "Supprimer les messages des utilisateurs hors tchat";
  translations.fr["{userName} will be replaced by the user's name you click on\n\nEg:\nHey {userName}, come here please!\nor\n@{userName}?"] = "{userName} sera remplac&eacute; par le nom de l'utilisateur que vous aurez cliqu&eacute;\n\nEx:\nSalut {userName}, tu peux venir ici STP!\nou\n@{userName}?";
  translations.fr["Bip pattern (must contain {userName})"] = "Mod&egrave;le pour le bip (doit contenir {userName})";
  translations.fr["Add system message when a user join or leave the chat room"] = "Afficher un message quand un utilisateur joint ou quitte la salle";
  translations.fr["Sort user list on user's activity. Sort below will be the secondary sort"] = "Trier les utilisateurs selon leur activit&eacute;. Le tri ci dessous sera utilis&eacute; comme tri secondaire";
  translations.fr["Sort user list"] = "Tri des utilisateurs";
  translations.fr["No sort"] = "Pas de tri";
  translations.fr["User name"] = "Nom de l'utilisateur";
  translations.fr["User rank"] = "Niveau de l'utilisateur";
  translations.fr["Distance"] = "Distance";
  translations.fr["Set the room name exactly as it appear in the room list\n\nLet blank to disable this feature"] = "Saisir le nom de la salle exactement comme il apparait dans la liste des salles\nLaisser vide pour ne pas utiliser cette fonctionnalit&eacute;";
  translations.fr["Force room"] = "Forcer la salle";
  translations.fr["Save"] = "Sauvegarder";
  translations.fr["Clear chat"] = "Effacer les messages";
  translations.fr["Export messages"] = "Exporter les messages";
  translations.fr["Join room"] = "Rejoindre une salle";
  translations.fr["Enter the name of the room to join"] = "Entrez le nom de la salle \u00e0 rejoindre";
  translations.fr["You are already registered as CM for chat addon."] = "Vous \u00eates d\u00e9j\u00e0 enregistr\u00e9 en tant que CM dans chat addon.";
  translations.fr["Message from Chat addon:\n\nYou are Country Manager.\nDo you allow chat addon to upload to a private server your username and the country(ies) you manage?\nIf you do so, all editors using chat addon will see your name colored in red.\nIf you answer no, you can still change your mind in chat addon settings.\nThanks."] = "Message de Chat addon:\n\nVous \u00eates Country Manager.\nAutorisez-vous chat addon \u00e0 envoyer votre pseudo et les pays que vous managez sur un serveur priv\u00e9?\nSi oui, tous les \u00e9diteurs qui utilisent chat addon verront votre pseudo en rouge.\nSi non, vous pourrez changer d'avis dans les param\u00e8tres de chat addon.\nMerci.";
  translations.fr["Add me to CM List"] = "M'ajouter &agrave; la liste des CM";
  translations.fr["Format: username:messageIn:soundIn:messageOut:soundOut,a_google_doc_key_here,username2:messageIn2:soundIn2:messageOut2:soundOut2...\nmessage or sound can be null to disable.\n\nSounds available: door or TTStext to speach"] = "Format: username:messageEntree:sonEntree:messageSortie:sonSortie,une_clef_google_doc,username2:messageEntree2:sonEntree2:messageSortie2:sonSortie2...\nmessage ou son peut \u00eatre null pour d\u00e9sactiver.\n\nLes sons disponibles sont: door ou TTStexte pour que le TTS dise texte";
  translations.fr["Usernames messages and sounds"] = "Noms et sons";
  translations.fr["Play sounds"] = "Jouer les sons";
  translations.fr["TTS is powered by"] = "Le TTS est fourni par";
  translations.fr["Text to speech speed"] = "Vitesse du TTS";
  translations.fr["TTS playback rate (0.5 to 2.0)"] = "Vitesse du TTS (0.5 &agrave; 2.0)";
  translations.fr["Discussion is uploaded to a server and other users will get the 10 last messages on login"] = "Les discussions sont envoy&eacute;es sur un serveur et les autres r&eacute;cup&egrave;rent les 10 derniers messages lorsqu'ils se connectent";
  translations.fr["Contribute to history"] = "Contribuer &agrave; l'historique";
  translations.fr["Default to prod chat on WME Beta"] = "Prod Chat par d\u00e9faut sur WME Beta";
  translations.de = {};
  translations.de["Error: Message background color must be a HTML format string\nwith exact length of 6 hexadecimal characters"] = "Fehler: die Hintergrundfarbe der Nachricht muss ein HTML-Format-String\nmit exakt 6 hexadezimalen Zeichen sein";
  translations.de["Error: Alert background color must be a HTML format string\nwith exact length of 6 hexadecimal characters"] = "Fehler: die Hintergrundfarbe eines Alarms muss ein HTML-Format-String\nmit exakt 6 hexadezimalen Zeichen sein";
  translations.de["Error: bip pattern must contain {userName}"] = "Fehler: Alarmierungs-Muster muss {userName} enthalten";
  translations.de["has joined"] = "ist gekommen";
  translations.de["has left"] = "ist gegangen";
  translations.de["Chat addon settings"] = "Chat addon Einstellungen";
  translations.de["Play sound on new message"] = "Ton bei neuer Nachricht";
  translations.de["Text to speech on messages"] = "Nachrichten vorlesen";
  translations.de["language"] = "Sprache";
  translations.de["Text to speech on from username"] = "TTS bei Nachricht von User";
  translations.de["TTS from username"] = "TTS von User";
  translations.de["Text to speech on internet link"] = "TTS bei Internet-Link";
  translations.de["TTS link to"] = "TTS Link zu";
  translations.de["Show message date (uncheck for time only)"] = "Zeige Datum der Nachrichten (deaktiviert: nur Uhrzeit)";
  translations.de["My message background color"] = "Hintergrundfarbe meiner Nachrichten";
  translations.de["Alert color"] = "Alarm-Farbe";
  translations.de["words separated by a comma\nCase unsensitive\nBegin and end with $ to match exact word"] = "Durch Kommata getrennte Wortliste\nGro&szlig;-/Kleinschreibung egal\n$ vor und hinter Suchwort f&uuml;r exakte Wortsuche";
  translations.de["eg"] = "Bsp";
  translations.de["or"] = "oder";
  translations.de["userNameOfAFriend,$unlock$"] = "UsernameEinesFreundes,$entsperre$";
  translations.de["Alert match"] = "Alarm bei";
  translations.de["Play sound on new alert"] = "Ton bei neuem Alarm";
  translations.de["Remove messages of users not in the users list of the room"] = "Unterdr&uuml;cke Nachrichten von Usern aus anderen Chatr&auml;umen";
  translations.de["{userName} will be replaced by the user's name you click on\n\nEg:\nHey {userName}, come here please!\nor\n@{userName}?"] = "{userName} wird ersetzt durch den angeklickten Usernamen\n\nBsp:\nHallo {userName}, kommst du bitte mal zu mir?!\noder\n@{userName}?";
  translations.de["Bip pattern (must contain {userName})"] = "Alarmierungs-Muster (muss {userName} enthalten)";
  translations.de["Add system message when a user join or leave the chat room"] = "Zeige Systemnachricht, wenn ein User den Chatraum betritt oder verl&auml;sst";
  translations.de["Sort user list on user's activity. Sort below will be the secondary sort"] = "Sortiere Userliste nach deren Aktivit&auml;t. Nach folgendem Kriterium wird dann sekund&auml;r sortiert";
  translations.de["Sort user list"] = "Sortiere die Userliste";
  translations.de["No sort"] = "Keine Sortierung";
  translations.de["User name"] = "Username";
  translations.de["User rank"] = "User Level";
  translations.de["Distance"] = "Entfernung";
  translations.de["Set the room name exactly as it appear in the room list\n\nLet blank to disable this feature"] = "Setze den Namen des Chatraums genau so wie er in der Liste angezeigt wird\nLeer lassen um dieses Feature zu deaktivieren";
  translations.de["Force room"] = "Chatraum forcieren";
  translations.de["Save"] = "Speichern";
  translations.de["Clear chat"] = "Chat l&ouml;schen";
  translations.de["Export messages"] = "Nachrichten exportieren";
  translations.de["Join room"] = "Chatraum betreten";
  translations.de["Enter the name of the room to join"] = "Namen des zu betretenden Chatraums angeben";
  translations.de["You are already registered as CM for chat addon."] = "Du bist schon als CM beim Chat Addon registriert.";
  translations.de["Message from Chat addon:\n\nYou are Country Manager.\nDo you allow chat addon to upload to a private server your username and the country(ies) you manage?\nIf you do so, all editors using chat addon will see your name colored in red.\nIf you answer no, you can still change your mind in chat addon settings.\nThanks."] = "Nachricht vom Chat Addon:\n\nDu bist Country Manager.\nErlaubst du, dass Chat Addon deinen Usernamen an einen privaten Server \u00fcbertr\u00e4gt, sowie die L\u00e4nder, die du managst?\nFalls ja, werden alle Chat Addon-User deinen Namen in rot sehen.\nFalls nein, kannst du jederzeit deine Entscheidung in den Einstellungen vom Chat Addon \u00e4ndern.\nDanke.";
  translations.de["Add me to CM List"] = "F&uuml;ge mich zur CM-Liste hinzu";
  translations.de["Format: username:messageIn:soundIn:messageOut:soundOut,a_google_doc_key_here,username2:messageIn2:soundIn2:messageOut2:soundOut2...\nmessage or sound can be null to disable.\n\nSounds available: door or TTStext to speach"] = "Format: Username:NachrichtEingang:TonEingang:NachrichtAusgang:TonAusgang,Google_Doc_Schl&uuml;ssel_hier,Username2:NachrichtEingang2:TonEingang2:NachrichtAusgang2:TonAusgang2...\nNachricht oder Ton auf null setzen, um diese(n) zu deaktivieren.\n\nVerf\u00fcgbare T&ouml;ne sind: door oder TTStext";
  translations.de["Usernames messages and sounds"] = "Usernamen und T&ouml;ne";
  translations.de["Play sounds"] = "T&ouml;ne abspielen";
  translations.de["TTS is powered by"] = "Das TTS wird bereitgestellt durch";
  translations.de["Text to speech speed"] = "TTS-Geschwindigkeit";
  translations.de["TTS playback rate (0.5 to 2.0)"] = "TTS-Geschwindigkeit (0.5 bis 2.0)";
  translations.de["Discussion is uploaded to a server and other users will get the 10 last messages on login"] = "Der Chat wird auf einen Server hochgeladen und User k&ouml;nnen die letzten 10 Nachrichten sehen nach ihrem Login";
  translations.de["Contribute to history"] = "Zur Chat-Historie beitragen";
  translations.de["Default to prod chat on WME Beta"] = "Immer prod. Chat in Beta WME einstellen";
  var CA_Settings = null;
  var baseURLs = [new RegExp("https://(www.)?waze.com/editor"), new RegExp("https://(www.)?waze.com/[^/]+/editor"), new RegExp("https://beta.waze.com/")];
  function tr(str) {
    if (translations.hasOwnProperty(I18n.locale) && translations[I18n.locale].hasOwnProperty(str)) {
      return translations[I18n.locale][str];
    }
    return str;
  }
  function getElementsByClassName(classname, node) {
    if (!node) {
      node = document.getElementsByTagName("body")[0];
    }
    var a = [];
    var re = new RegExp("\\b" + classname + "\\b");
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++) {
      if (re.test(els[i].className)) {
        a.push(els[i]);
      }
    }
    return a;
  }
  function getId(node) {
    return document.getElementById(node);
  }
  function logBeta(msg, obj) {
  }
  function logDebug(msg, obj) {
    if (isDebug) {
      log("DEBUG - " + msg, obj);
    }
  }
  function logError(msg, obj) {
    if (obj == null) {
      console.error("Chat addon v" + ca_version + " - " + msg);
    } else {
      console.error("Chat addon v" + ca_version + " - " + msg + " ", obj);
    }
  }
  function log(msg, obj) {
    if (obj == null) {
      console.log("Chat addon v" + ca_version + " - " + msg);
    } else {
      console.debug("Chat addon v" + ca_version + " - " + msg + " ", obj);
    }
  }
  function initializeWazeObjects() {
    var objectToCheck = ["W", "W.model", "W.Config", "W.map", {key:"W.model.chat.users.length", value:0, operator:"!="}, "W.selectionManager", "W.loginManager.user.userName", "localStorage"];
    for (var i = 0; i < objectToCheck.length; i++) {
      if (typeof objectToCheck[i] == "object") {
        var path = objectToCheck[i].key.split(".");
        var object = window;
        for (var j = 0; j < path.length; j++) {
          object = object[path[j]];
          if (typeof object == "undefined" || object == null) {
            window.setTimeout(initializeWazeObjects, 1000);
            return;
          }
        }
        if (objectToCheck[i].operator == "!=") {
          if (object == objectToCheck[i].value) {
            window.setTimeout(initializeWazeObjects, 1000);
            return;
          }
        }
      } else {
        if (objectToCheck[i].indexOf("/") != -1) {
          var varName = objectToCheck[i].replace(/\//g, "");
          wazeRequires[varName] = require(objectToCheck[i]);
        } else {
          var path = objectToCheck[i].split(".");
          var object = window;
          for (var j = 0; j < path.length; j++) {
            object = object[path[j]];
            if (typeof object == "undefined" || object == null) {
              window.setTimeout(initializeWazeObjects, 1000);
              return;
            }
          }
        }
      }
    }
    initialiseCA();
  }
  function generateUUID() {
    var d = (new Date).getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == "x" ? r : r & 7 | 8).toString(16);
    });
    return uuid;
  }
  function changeIconUserStatus(element, newStatus) {
    for (var i = 0; i < 3; i++) {
      if (i == newStatus) {
        element.childNodes[i].style.display = "block";
      } else {
        element.childNodes[i].style.display = "none";
      }
    }
  }
  function addMyselfToCMList() {
    log("Add myself to CM list...");
    if (W.loginManager.user.isCountryManager()) {
      if (isRegisteredAsCM(W.loginManager.user.userName, W.loginManager.user.editableCountryIDs)) {
        alert(tr("You are already registered as CM for chat addon."));
      } else {
        if (confirm(tr("Message from Chat addon:\n\nYou are Country Manager.\nDo you allow chat addon to upload to a private server your username and the country(ies) you manage?\nIf you do so, all editors using chat addon will see your name colored in red.\nIf you answer no, you can still change your mind in chat addon settings.\nThanks."))) {
          var params = {url:serverBase + "/userInfo/set.php?status=CM&username=" + W.loginManager.user.userName + "&clist=" + W.loginManager.user.editableCountryIDs.join(","), headers:{"User-Agent":"Mozilla/5.0", "Accept":"text/plain"}, data:null, method:"GET"};
          WMECADownloadHelper.add(params, function(data) {
          }, null);
          CA_Settings.allowUploadStatus = true;
          saveSettings();
        } else {
          CA_Settings.allowUploadStatus = false;
          saveSettings();
        }
      }
    }
  }
  function updateCMList() {
    var params = {url:serverBase + "/userInfo/get.php?status=CM", headers:{"User-Agent":"Mozilla/5.0", "Accept":"text/plain"}, data:null, method:"GET"};
    WMECADownloadHelper.add(params, function(data) {
      if (data.status == "success") {
        try {
          CMList = JSON.parse(data.data);
          if (W.loginManager.user.isCountryManager() && isRegisteredAsCM(W.loginManager.user.userName, W.loginManager.user.editableCountryIDs) == false && (CA_Settings.allowUploadStatus == null || CA_Settings.allowUploadStatus == true)) {
            addMyselfToCMList();
          }
        } catch (e) {
          log("Error while getting CM list from server!", e);
          log("data", data.data);
        }
        if (W.loginManager.user.isCountryManager() && isRegisteredAsCM(W.loginManager.user.userName, W.loginManager.user.editableCountryIDs)) {
          getId("CA-opt-addMeToCMList").style.display = "none";
        }
      }
    }, null);
  }
  function setupTTS() {
    log("setup TTS Lang");
    tts_audio = new Audio;
    tts_audio.addEventListener("ended", processTTS);
    tts_audio.addEventListener("error", processTTS);
    tts_audio.addEventListener("stalled", processTTS);
    tts_audio.addEventListener("abort", processTTS);
    tts_audio.defaultPlaybackRate = CA_Settings.tts_playbackrate;
    window.setTimeout(processTTS);
  }
  function initialiseCA() {
    var oriSendMessage = W.model.chat.sendMessage;
    W.model.chat.sendMessage = function(m) {
      // FIXME
      //if (W.Config.marx.server == "https://marx.waze.com:443" && document.location.host.indexOf("beta") != -1 && m.search(baseURLs[2]) != -1) {
      //  m = m.replace("https://beta.waze.com/", "https://www.waze.com/");
      //  log("beta perma changed to prod: " + m);
      //}
      oriSendMessage.call(W.model.chat, m);
    };
    W.model.chat.messages.on("messageUpdated", function() {
      try {
        iSendAMessage.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    W.model.chat.messages.on("add", function() {
      try {
        iSendAMessage.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    W.model.chat.on("change:open", function() {
      try {
        openChatGUI.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    W.model.chat.on("change:visible", function() {
      try {
        updateInvisibleHeaderColor.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    W.model.chat.on("change:room", function() {
      try {
        roomChanged.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    W.model.chat.users.on("add", function() {
      try {
        userEnter.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    W.model.chat.users.on("remove", function() {
      try {
        userLeave.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    icons.bell = document.createElement("img");
    icons.bell.src = "data:image/png;base64," + bellIcon;
    icons.bell.style.width = "15px";
    icons.bell.style.cssFloat = "left";
    icons.chip = document.createElement("img");
    icons.chip.src = "data:image/png;base64," + chipIcon;
    icons.chip.style.width = "15px";
    icons.chip.style.cssFloat = "left";
    icons.zzz = document.createElement("img");
    icons.zzz.src = "data:image/png;base64," + zzzIcon;
    icons.zzz.style.width = "15px";
    icons.zzz.style.cssFloat = "left";
    var newmessage_elts = getElementsByClassName("new-message", getId("chat"));
    if (newmessage_elts.length != 1) {
      log("Error: cannot detect input message element");
    } else {
      var newmessage = newmessage_elts[0];
      newmessage.style.paddingRight = "30px";
      var newMessageAddon = document.createElement("div");
      newMessageAddon.style.cssFloat = "right";
      newMessageAddon.style.position = "relative";
      newMessageAddon.style.left = "25px";
      newMessageAddon.style.marginTop = "-20px";
      newMessageAddon.style.display = "block";
      var plbutton = document.createElement("a");
      plbutton.innerHTML = "+";
      plbutton.className = " fa fa-link permalink";
      plbutton.onclick = insertPermalink;
      newMessageAddon.appendChild(plbutton);
      newmessage.appendChild(newMessageAddon);
    }
    var mapFooter = getElementsByClassName("WazeControlPermalink");
    if (mapFooter.length == 0) {
      log("error: can't find permalink container");
    } else {
      divPerma = mapFooter[0];
    }
    loadSettings();
    updateCMList();
    setupOptionPanel();
    var messageList = getElementsByClassName("message-list", getId("chat"))[0];
    var fakeMsg = document.createElement("div");
    fakeMsg.className = "message system-message";
    fakeMsg.innerHTML = '<div class="from"></div><div class="body"><div style="direction: ltr; text-align: left;">Chat addon v' + ca_version + " rocks!</div></div>";
    messageList.appendChild(fakeMsg);
    var settingsDiv = document.createElement("div");
    settingsDiv.style.cssFloat = "right";
    var iconList = "";
    if (document.location.host.indexOf("beta") != -1) {
      iconList += '<a href="#" style="color: black;" id="CA-switchBeta" title="' + tr("Switch beta") + '"><img id="CA-switchBetaIcon" style="vertical-align: middle; margin: 3px;" width="14px" height="14px" src="data:image/png;base64,' + betaIcon + '" /></a>';
      iconList += "&nbsp;";
    }
    iconList += '<a href="#" style="color: black;" id="CA-reloadRoom" title="' + tr("Reload room") + '"><img style="vertical-align: middle; margin: 3px;" width="14px" height="14px" src="data:image/png;base64,' + reloadIcon + '" /></a>';
    iconList += "&nbsp;";
    iconList += '<a href="#" style="color: black;" id="CA-joinRoom" title="' + tr("Join room") + '"><img style="vertical-align: middle; margin: 3px;" width="14px" height="14px" src="data:image/png;base64,' + meetIcon + '" /></a>';
    iconList += "&nbsp;";
    iconList += '<a href="#" style="color: black;" id="CA-exportMessages" title="' + tr("Export messages") + '"><img style="vertical-align: middle; margin: 3px;" width="14px" height="14px" src="data:image/png;base64,' + exportIcon + '" /></a>';
    iconList += "&nbsp;";
    iconList += '<a href="#" style="color: black;" id="CA-clearchat" title="' + tr("Clear chat") + '"><img style="vertical-align: middle; margin: 3px;" width="14px" height="14px" src="data:image/png;base64,' + trashIcon + '" /></a>';
    iconList += "&nbsp;";
    iconList += '<a href="#" id="CA-opensettings"><i class="fa fa-gear icon-cog" style="color: black;"></i></a>';
    settingsDiv.innerHTML = iconList;
    var chatHelper = getChatHelper();
    chatHelper.header.appendChild(settingsDiv);
    getId("CA-opensettings").onclick = function(e) {
      getId("CA-settingsPanel").style.display = "block";
    };
    getId("CA-clearchat").onclick = clearChat;
    getId("CA-exportMessages").onclick = exportMessages;
    getId("CA-joinRoom").onclick = joinRoom;
    getId("CA-reloadRoom").onclick = reloadRoom;
    if (document.location.host.indexOf("beta") != -1) {
      getId("CA-switchBeta").onclick = switchBeta;
    }
    window.setTimeout(setupTTS);
    window.setInterval(watch, 1000);
    var userListDiv = getId("chat").getElementsByClassName("users")[0];
    userListDiv.onmouseenter = function() {
      sortUserListDisbled = true;
      log("Sort User List Disbled");
    };
    userListDiv.onmouseleave = function() {
      sortUserListDisbled = false;
      log("Sort User List Enabled");
      sortUserList();
    };
    getId("chat").getElementsByClassName("message-list")[0].style.maxHeight = "290px";
    W.model.liveUsers.users.on("add", function() {
      try {
        liveUserAdded.apply(this, arguments);
      } catch (e) {
        logError("Error: ", e);
      }
    });
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      messageList.addEventListener("DOMMouseScroll", onFirefoxEltMouseWheel, false);
      userListDiv.addEventListener("DOMMouseScroll", onFirefoxEltMouseWheel, false);
    } else {
      messageList.addEventListener("mousewheel", onChromeEltMouseWheel, false);
      userListDiv.addEventListener("mousewheel", onChromeEltMouseWheel, false);
    }
    setupBells();
    if (document.location.host.indexOf("beta") != -1 && CA_Settings.defaultProdChatBetaWME) {
      switchBeta();
    }
    if (uid == null) {
      uid = generateUUID();
    }
    window.setInterval(heartBeat, 3000);
    roomChanged();
    log("Init done", W.model.chat.attributes.room.attributes.name);
  }
  function heartBeat() {
    if (uid == null) {
      uid = generateUUID();
    }
    if (historyLeaders.hasOwnProperty(W.model.chat.attributes.roomName) && historyLeaders[W.model.chat.attributes.roomName] == W.loginManager.user.userName + "_" + uid) {
      var params = {url:serverBase + "/clog/postHistory.php", headers:{"Content-Type":"application/json"}, data:JSON.stringify({user:W.loginManager.user.userName, uid:uid, room:W.model.chat.attributes.roomName}), method:"POST"};
      WMECADownloadHelper.add(params, function(data) {
        if (data.status == "success") {
        }
      });
    }
  }
  function switchBeta() {
    /* FIXME
    if (W.Config.marx.server == "https://marx.waze.com:443") {
      W.Config.marx.server = "https://marx-beta.waze.com:443";
      reloadRoom();
      var icon = document.getElementById("CA-switchBetaIcon");
      if (icon) {
        icon.src = "data:image/png;base64," + betaIcon;
      }
    } else {
      if (W.Config.marx.server == "https://marx-beta.waze.com:443") {
        W.Config.marx.server = "https://marx.waze.com:443";
        reloadRoom();
        var icon = document.getElementById("CA-switchBetaIcon");
        if (icon) {
          icon.src = "data:image/png;base64," + notBetaIcon;
        }
      }
    }
    */
  }
  function reloadRoom() {
    resetChatSocket({onSuccess:roomChanged});
  }
  function onFirefoxEltMouseWheel(e) {
    this.scrollTop += e.detail * 10;
  }
  function onChromeEltMouseWheel(e) {
    this.scrollTop += e.deltaY * 0.5;
  }
  function joinRoom() {
    var roomName = window.prompt(tr("Enter the name of the room to join"));
    if (roomName == null) {
      return;
    }
    var theRoom = W.model.chat._findOrCreateRoom(roomName);
    W.model.chat.set("room", theRoom);
  }
  function updateUnreadMessagesDivWidth() {
    var messageDiv = getId("chat").getElementsByClassName("messages");
    var unreadMessageDiv = getId("chat").getElementsByClassName("unread-messages-notification");
    if (messageDiv.lentgh != 0 && unreadMessageDiv.lentgh != 0) {
      messageDiv = messageDiv[0];
      unreadMessageDiv = unreadMessageDiv[0];
      var unreadMessageDivWidth = parseInt(messageDiv.offsetWidth) - 20;
      if (W.model.chat.attributes.visible == true) {
        unreadMessageDiv.style.width = unreadMessageDivWidth + "px";
      } else {
        unreadMessageDiv.style.width = "";
      }
    }
  }
  function download(data, filename) {
    var element = document.createElement("a");
    element.style.display = "none";
    element.setAttribute("href", encodeURI("data:text/plain," + data));
    element.setAttribute("download", filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
  function exportMessages() {
    var data = "";
    data += "<html><body>";
    var datatxt = "";
    var databb = "";
    for (var i = 0; i < W.model.chat.messages.models.length; i++) {
      var message = W.model.chat.messages.models[i];
      var date = null;
      if (message.hasOwnProperty("chatAddonTimeStamp")) {
        date = message.chatAddonTimeStamp.toLocaleString();
      }
      datatxt += "From: ";
      databb += "[quote=";
      if (message.attributes.type == "system") {
        datatxt += "System" + (date != null ? " - " + date : "") + "<br>";
        databb += '"System' + (date != null ? " - " + date : "") + '"]';
      } else {
        datatxt += message.attributes.from.name + (date != null ? " - " + date : "") + "<br>";
        databb += '"' + message.attributes.from.name + (date != null ? " - " + date : "") + '"]';
      }
      datatxt += "&nbsp;&nbsp;" + message.attributes.body.replace(/\n/gi, "<br>&nbsp;&nbsp;") + "<br>";
      databb += message.attributes.body.replace(/\n/gi, "<br>") + "[/quote]<br/>";
    }
    data += "<h1>Text</h1>";
    data += datatxt;
    data += "<h1>BB code</h1>";
    data += databb;
    data += "</body></html>";
    download(data, "WMEChat-export-" + (new Date).toLocaleString() + ".html");
  }
  function clearChat() {
    log("Clear chat!");
    var messages = getElementsByClassName("message-list", getId("chat"));
    while (messages[0].hasChildNodes()) {
      messages[0].removeChild(messages[0].lastChild);
    }
  }
  function liveUserAdded(u) {
    var usrRank = u.attributes.rank;
    if (usrRank == null) {
      window.setTimeout(function() {
        liveUserAdded(u);
      }, 500);
      log("User not loaded yet. Wait and try later...");
      return;
    } else {
      usrRank++;
    }
    var nameMarker = document.createElement("div");
    nameMarker.className = "tooltip fade top in";
    nameMarker.style.top = "-30px";
    nameMarker.style.backgroundColor = "black";
    nameMarker.style.color = "white";
    nameMarker.style.borderRadius = "5px";
    nameMarker.style.padding = "5px";
    nameMarker.style.zIndex = 3;
    nameMarker.innerHTML = u.attributes.name.replace(/-/gi, "&#x2011;") + "&nbsp;(" + usrRank + ')<div style="top: 27px;" class="tooltip-arrow"></div>';
    var marker = W.map.getLayerByUniqueName("live_users").markers.find(function(e) {
      return e.model.attributes.name == u.attributes.name;
    });
    if (typeof marker != "undefined") {
      marker.icon.$div[0].appendChild(nameMarker);
      marker.icon.$div[0].onmouseover = mouseOverLiveUser;
      var d = new Date;
      if (d.getDate() == 1 && d.getMonth() == 3) {
        marker.icon.$div.css("background-image", 'url("data:image/png;base64,' + specialEventIcon + '")');
      }
    }
    nameMarker.style.left = parseInt(u._events.moved[0].ctx.icon.$div[0].offsetWidth / 2 - nameMarker.offsetWidth / 2) + "px";
  }
  function mouseOverLiveUser() {
    var n = this.nextElementSibling;
    if (n.className == "tooltip fade top in") {
      n.style.display = "none";
    }
  }
  function resetUserActivity(userName) {
    if (userName == W.loginManager.user.userName) {
      return;
    }
    var user = null;
    for (var i = 0; i < W.model.chat.users.models.length; i++) {
      if (W.model.chat.users.models[i].attributes.name == userName) {
        user = W.model.chat.users.models[i];
        break;
      }
    }
    if (user != null) {
      userActivity[userName] = {lastPost:new Date(0), lastMove:new Date(0), lastPosition:{lon:user.attributes.center.lon, lat:user.attributes.center.lat}};
    } else {
      userActivity[userName] = {lastPost:new Date(0), lastMove:new Date(0), lastPosition:{lon:0, lat:0}};
    }
  }
  function updateUserActivity() {
    for (var i = 0; i < W.model.chat.users.models.length; i++) {
      var user = W.model.chat.users.models[i];
      if (user.attributes.name == W.loginManager.user.userName) {
        continue;
      }
      if (!userActivity.hasOwnProperty(user.attributes.name)) {
        resetUserActivity(user.attributes.name);
      }
      if (userActivity[user.attributes.name].lastPosition.lon != user.attributes.center.lon || userActivity[user.attributes.name].lastPosition.lat != user.attributes.center.lat) {
        userActivity[user.attributes.name].lastPosition.lon = user.attributes.center.lon;
        userActivity[user.attributes.name].lastPosition.lat = user.attributes.center.lat;
        userActivity[user.attributes.name].lastMove = new Date;
      }
    }
  }
  function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof padding === "undefined" || padding === null ? padding = 2 : padding;
    while (hex.length < padding) {
      hex = "0" + hex;
    }
    return hex;
  }
  function watch() {
    var greenToOrange = 8;
    var orangeToRed = 9;
    updateUserActivity();
    var now = new Date;
    for (var userName in userActivity) {
      if (userActivity.hasOwnProperty(userName)) {
        var bell = getId("CA-bell-" + userName);
        if (bell != null) {
          var lastMove = null;
          var lastPost = null;
          if (userActivity[userName].hasOwnProperty("lastMove")) {
            lastMove = userActivity[userName].lastMove;
          }
          if (userActivity[userName].hasOwnProperty("lastPost")) {
            lastPost = userActivity[userName].lastPost;
          }
          var inactivityTime = 0;
          if (lastMove != null && lastPost != null) {
            inactivityTime = Math.min(now.getTime() - lastMove.getTime(), now.getTime() - lastPost.getTime());
          } else {
            if (lastMove != null) {
              inactivityTime = now.getTime() - lastMove.getTime();
            }
            if (lastPost != null) {
              inactivityTime = now.getTime() - lastPost.getTime();
            }
          }
          inactivityTime /= 1000;
          if (inactivityTime > 1200) {
            bell.style.removeProperty("background-color");
            changeIconUserStatus(bell, 2);
            continue;
          }
          inactivityTime = Math.sqrt(inactivityTime);
          var r = 0;
          var g = 255;
          var b = 0;
          if (inactivityTime <= greenToOrange) {
            r = Math.floor(inactivityTime * 240.0 / greenToOrange);
            g = Math.floor(255.0 - inactivityTime * 15.0 / greenToOrange);
            if (r < 0) {
              r = 0;
            }
            if (r > 240) {
              r = 240;
            }
            if (g < 240) {
              g = 240;
            }
            if (g > 255) {
              g = 255;
            }
            bell.style.backgroundColor = "#" + decimalToHex(r) + decimalToHex(g) + decimalToHex(b);
          }
          if (inactivityTime > greenToOrange && inactivityTime <= greenToOrange + orangeToRed) {
            r = Math.floor(240.0 + (inactivityTime - greenToOrange) * 15.0 / orangeToRed);
            g = Math.floor(240.0 - (inactivityTime - greenToOrange) * 240.0 / orangeToRed);
            if (r < 240) {
              r = 240;
            }
            if (r > 255) {
              r = 255;
            }
            if (g < 0) {
              g = 0;
            }
            if (g > 240) {
              g = 240;
            }
            bell.style.backgroundColor = "#" + decimalToHex(r) + decimalToHex(g) + decimalToHex(b);
          }
          if (inactivityTime > greenToOrange + orangeToRed) {
            bell.style.backgroundColor = "#FF0000";
          }
          if (W.model.chat.attributes.visible == true) {
            changeIconUserStatus(bell, 1);
          } else {
            changeIconUserStatus(bell, 0);
          }
        }
      }
    }
    sortUserList();
  }
  function processTTS() {
    if (tts_audio.error != null) {
      log("tts_audio.error", tts_audio.error);
    }
    if ((tts_audio.ended || tts_audio.currentSrc == "" || tts_audio.error != null) && tts_messages.length != 0) {
      var text = tts_messages[0];
      var urls = text.match(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g);
      if (urls != null) {
        for (var i = 0; i < urls.length; i++) {
          for (var j = 0; j < baseURLs.length; j++) {
            var permalink = null;
            do {
              permalink = getFirstPermalink(text);
              if (permalink) {
                text = text.replace(permalink.permalink, " permalink");
              }
            } while (permalink);
          }
        }
      }
      var urls = text.match(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g);
      if (urls != null) {
        for (var i = 0; i < urls.length; i++) {
          var url = document.createElement("a");
          url.href = urls[i];
          var newUrlText = CA_Settings.tts_linkTo.replace(/\{link\}/gi, url.hostname.replace("www.", ""));
          text = text.replace(urls[i], " " + newUrlText + " ");
        }
      }
      // Play text using Waze's own TTS system
      var params = W.Config.tts.options;
      params.lang = I18n.locale;
      params.text = text;
      tts_audio.src = W.Config.tts.url + "?" + $.param(params);
      tts_audio.play();
      tts_messages.splice(0, 1);
    }
    if (tts_messages.length == 0) {
      window.setTimeout(processTTS, 500);
    } else {
      window.setTimeout(processTTS);
    }
  }
  function loadSettings() {
    CA_Settings = {showDate:true, messageSound:false, messageBGColor:"A1DCF5", alertBGColor:"880000", alertMatch:W.loginManager.user.userName, alertSound:false, removeInvisible:false, bipPattern:"@{userName}", systemMessageOnJoinLeave:false, usernamesMatch:"", usernamesMatchPlaySound:true, sortUserList:0, forceRoom:"", tts:false, tts_fromPrefix:"from {userName}", tts_linkTo:"link to {link}", tts_playbackrate:1.0, sortUserListActivity:false, defaultProdChatBetaWME:false, allowUploadStatus:null,
    contributeToHistory:false, showEditorProfileIcon:false};
    if (typeof localStorage.WMEChatAddon_settings !== "undefined") {
      var settings = JSON.parse(localStorage.WMEChatAddon_settings);
      logDebug("Loading local storage settings:", settings);
      if (typeof settings.messageSound !== "undefined") {
        CA_Settings.messageSound = settings.messageSound;
      }
      if (typeof settings.showDate !== "undefined") {
        CA_Settings.showDate = settings.showDate;
      }
      if (typeof settings.messageBGColor !== "undefined") {
        CA_Settings.messageBGColor = settings.messageBGColor;
      }
      if (typeof settings.alertBGColor !== "undefined") {
        CA_Settings.alertBGColor = settings.alertBGColor;
      }
      if (typeof settings.alertMatch !== "undefined") {
        CA_Settings.alertMatch = settings.alertMatch;
      }
      if (typeof settings.alertSound !== "undefined") {
        CA_Settings.alertSound = settings.alertSound;
      }
      if (typeof settings.removeInvisible !== "undefined") {
        CA_Settings.removeInvisible = settings.removeInvisible;
      }
      if (typeof settings.bipPattern !== "undefined") {
        CA_Settings.bipPattern = settings.bipPattern;
      }
      if (typeof settings.systemMessageOnJoinLeave !== "undefined") {
        CA_Settings.systemMessageOnJoinLeave = settings.systemMessageOnJoinLeave;
      }
      if (typeof settings.usernamesMatch !== "undefined") {
        CA_Settings.usernamesMatch = settings.usernamesMatch;
      }
      if (typeof settings.usernamesMatchPlaySound !== "undefined") {
        CA_Settings.usernamesMatchPlaySound = settings.usernamesMatchPlaySound;
      }
      if (typeof settings.sortUserList !== "undefined") {
        CA_Settings.sortUserList = settings.sortUserList;
      }
      if (typeof settings.forceRoom !== "undefined") {
        CA_Settings.forceRoom = settings.forceRoom;
      }
      if (typeof settings.tts !== "undefined") {
        CA_Settings.tts = settings.tts;
      }
      if (typeof settings.tts_fromPrefix !== "undefined") {
        CA_Settings.tts_fromPrefix = settings.tts_fromPrefix;
      }
      if (typeof settings.tts_linkTo !== "undefined") {
        CA_Settings.tts_linkTo = settings.tts_linkTo;
      }
      if (typeof settings.tts_playbackrate !== "undefined") {
        CA_Settings.tts_playbackrate = settings.tts_playbackrate;
      }
      if (typeof settings.sortUserListActivity !== "undefined") {
        CA_Settings.sortUserListActivity = settings.sortUserListActivity;
      }
      if (typeof settings.defaultProdChatBetaWME !== "undefined") {
        CA_Settings.defaultProdChatBetaWME = settings.defaultProdChatBetaWME;
      }
      if (typeof settings.allowUploadStatus !== "undefined") {
        CA_Settings.allowUploadStatus = settings.allowUploadStatus;
      }
      if (typeof settings.contributeToHistory !== "undefined") {
        CA_Settings.contributeToHistory = settings.contributeToHistory;
      }
        if(typeof settings.showEditorProfileIcon !== "undefined")
            CA_Settings.showEditorProfileIcon = settings.showEditorProfileIcon;
    }
      if (CA_Settings.tts_playbackrate < 0.5) {
      CA_Settings.tts_playbackrate = 0.5;
    }
    if (CA_Settings.tts_playbackrate > 2.0) {
      CA_Settings.tts_playbackrate = 2.0;
    }
    var users = CA_Settings.usernamesMatch.split(",");
    for (var i = 0; i < users.length; i++) {
      var details = users[i].split(":");
      if (details.length > 1) {
        if (userAlertList.hasOwnProperty(details[0]) == false) {
          userAlertList[details[0]] = {inMessage:[details[1]], inSound:[details[2]], outMessage:[details[3]], outSound:[details[4]], color:details.length > 5 ? details[5] : ""};
        } else {
          userAlertList[details[0]].inMessage.push(details[1]);
          userAlertList[details[0]].inSound.push(details[2]);
          userAlertList[details[0]].outMessage.push(details[3]);
          userAlertList[details[0]].outSound.push(details[4]);
        }
      }
      if (details.length == 1 && users[i] !== "") {
        var params = {url:"https://docs.google.com/spreadsheets/d/" + users[i] + "/export?format=csv", headers:{"User-Agent":"Mozilla/5.0", "Accept":"text/plain"}, data:null, method:"GET"};
        log("download", params.url);
        WMECADownloadHelper.add(params, function(data) {
          if (data.status == "success") {
            try {
              var list = data.data.split("\n");
              for (var j = 0; j < list.length; j++) {
                var details = list[j].split(",");
                if (details.length >= 5 && details[0] != "UserName") {
                  if (userAlertList.hasOwnProperty(details[0]) == false) {
                    userAlertList[details[0]] = {inMessage:[details[1]], inSound:[details[2]], outMessage:[details[3]], outSound:[details[4]], color:details.length > 5 ? details[5] : ""};
                  } else {
                    userAlertList[details[0]].inMessage.push(details[1]);
                    userAlertList[details[0]].inSound.push(details[2]);
                    userAlertList[details[0]].outMessage.push(details[3]);
                    userAlertList[details[0]].outSound.push(details[4]);
                  }
                }
              }
            } catch (e) {
              log("Error while getting user name list!", e);
            }
          }
        }, null);
      }
    }
    log("Settings loaded");
  }
  function saveSettings() {
    logDebug("Saving local storage settings:", CA_Settings);
    localStorage.WMEChatAddon_settings = JSON.stringify(CA_Settings);
    log("Settings saved");
  }
  function applySettings() {
    var messageBG = getId("CA-opt-messagebg").value;
    if (messageBG.match(/^[0-9a-f]{6}$/i) == null) {
      return tr("Error: Message background color must be a HTML format string\nwith exact length of 6 hexadecimal characters");
    }
    var alertBG = getId("CA-opt-alertbg").value;
    if (alertBG.match(/^[0-9a-f]{6}$/i) == null) {
      return tr("Error: Alert background color must be a HTML format string\nwith exact length of 6 hexadecimal characters");
    }
    var bipPattern = getId("CA-opt-bippattern").value;
    if (bipPattern.indexOf("{userName}") == -1) {
      return tr("Error: bip pattern must contain {userName}");
    }
    var tts_playbackrate = parseFloat(getId("CA-opt-ttsplaybackrate").value);
    if (isNaN(tts_playbackrate)) {
      tts_playbackrate = 1.0;
    }
    if (CA_Settings.tts_playbackrate < 0.5) {
      CA_Settings.tts_playbackrate = 0.5;
    }
    if (CA_Settings.tts_playbackrate > 2.0) {
      CA_Settings.tts_playbackrate = 2.0;
    }
    CA_Settings = {messageSound:getId("CA-opt-messagesound").checked, showDate:getId("CA-opt-showdate").checked, messageBGColor:messageBG, alertBGColor:alertBG, alertMatch:getId("CA-opt-alertmatch").value, alertSound:getId("CA-opt-alertsound").checked, removeInvisible:getId("CA-opt-removeinvisibles").checked, bipPattern:bipPattern, systemMessageOnJoinLeave:getId("CA-opt-systemmessageonjoinleave").checked, usernamesMatch:getId("CA-opt-usernamesmatch").value, usernamesMatchPlaySound:getId("CA-opt-usernamesmatchplaysound").checked,
    sortUserList:getId("CA-opt-sortUserList0").checked ? 0 : getId("CA-opt-sortUserList1").checked ? 1 : getId("CA-opt-sortUserList2").checked ? 2 : 3, forceRoom:getId("CA-opt-forceroom").value, tts:getId("CA-opt-tts").checked, tts_fromPrefix:getId("CA-opt-ttsfromprefix").value, tts_linkTo:getId("CA-opt-ttslinkto").value, tts_playbackrate:tts_playbackrate, sortUserListActivity:getId("CA-opt-sortUserListActivity").checked, contributeToHistory:document.location.host.indexOf("beta") ==
    -1 ? getId("CA-opt-contributeToHistory").checked : false, showEditorProfileIcon:getId("CA-opt-showEditorProfileIcon").checked};
    if (document.location.host.indexOf("beta") != -1) {
      CA_Settings.defaultProdChatBetaWME = getId("CA-opt-defaultProdChatBetaWME").checked;
    }
    tts_audio.defaultPlaybackRate = CA_Settings.tts_playbackrate;
    sortUserList();
    return null;
  }
  function setupOptionPanel() {
    var panel = document.createElement("div");
    panel.id = "CA-settingsPanel";
    panel.setAttribute("style", "border: 1px solid black; background-color: #FFFFFF; padding: 5px; position: absolute; top: 15px; right: 15px; z-index: 9999; border-top-left-radius: 5px; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-bottom-left-radius: 5px; display: none;");
    var panelHTML = '<center style="font-weight: bold; size: bigger;">' + tr("Chat addon settings") + "</center><br/>";
    panelHTML += '<label><input type="checkbox" id="CA-opt-messagesound"' + (CA_Settings.messageSound ? " checked" : "") + "> " + tr("Play sound on new message") + "</input></Label><br />";
    panelHTML += '<label title="' + tr("Text to speech on messages") + '"><input type="checkbox" id="CA-opt-tts"' + (CA_Settings.tts ? " checked" : "") + "> TTS</input></Label> <label>" + tr("Text to speech on messages") + ' (' + I18n.locale + ')</Label><br/>';
    panelHTML += '<label title="' + tr("Text to speech speed") + '">' + tr("TTS playback rate (0.5 to 2.0)") + ': <input style="height: 25px;" type="text" size="10" maxlength="10" id="CA-opt-ttsplaybackrate" value="' + CA_Settings.tts_playbackrate + '" /></Label><br/>';
    panelHTML += '<label title="' + tr("Text to speech on from username") + '">' + tr("TTS from username") + ': <input style="height: 25px;" type="text" size="20" maxlength="100" id="CA-opt-ttsfromprefix" value="' + CA_Settings.tts_fromPrefix + '" /></Label><br/>';
    panelHTML += '<label title="' + tr("Text to speech on internet link") + '">' + tr("TTS link to") + ': <input style="height: 25px;" type="text" size="20" maxlength="100" id="CA-opt-ttslinkto" value="' + CA_Settings.tts_linkTo + '" /></Label><br/>';
    panelHTML += '<label><input type="checkbox" id="CA-opt-showdate"' + (CA_Settings.showDate ? " checked" : "") + "> " + tr("Show message date (uncheck for time only)") + "</input></Label><br />";
    panelHTML += "<label>" + tr("My message background color") + ': <input style="height: 25px;" type="text" size="6" maxlength="6" id="CA-opt-messagebg" value="' + CA_Settings.messageBGColor + '" /></Label><br />';
    panelHTML += "<label>" + tr("Alert color") + ': <input style="height: 25px;" type="text" size="6" maxlength="6" id="CA-opt-alertbg" value="' + CA_Settings.alertBGColor + '" /></Label><br />';
    panelHTML += '<label title="' + tr("words separated by a comma\nCase unsensitive\nBegin and end with $ to match exact word") + "\n\n" + tr("eg") + ":\n" + W.loginManager.user.userName + "\n" + tr("or") + "\n" + W.loginManager.user.userName + "," + tr("userNameOfAFriend,$unlock$") + '">' + tr("Alert match") + ': <input style="height: 25px;" type="text" size="30" id="CA-opt-alertmatch" value="' + CA_Settings.alertMatch + '" /></Label><br />';
    panelHTML += '<label><input type="checkbox" id="CA-opt-alertsound"' + (CA_Settings.alertSound ? " checked" : "") + "> " + tr("Play sound on new alert") + "</input></Label><br />";
    panelHTML += '<label><input type="checkbox" id="CA-opt-removeinvisibles"' + (CA_Settings.removeInvisible ? " checked" : "") + "> " + tr("Remove messages of users not in the users list of the room") + "</input></Label><br />";
    panelHTML += '<label title="' + tr("{userName} will be replaced by the user's name you click on\n\nEg:\nHey {userName}, come here please!\nor\n@{userName}?") + '">' + tr("Bip pattern (must contain {userName})") + ': <input style="height: 25px;" type="text" size="15" id="CA-opt-bippattern" value="' + CA_Settings.bipPattern + '" /></Label><br />';
    panelHTML += '<label><input type="checkbox" id="CA-opt-systemmessageonjoinleave"' + (CA_Settings.systemMessageOnJoinLeave ? " checked" : "") + "> " + tr("Add system message when a user join or leave the chat room") + "</input></Label><br />";
    panelHTML += '<label title="' + tr("Format: username:messageIn:soundIn:messageOut:soundOut,a_google_doc_key_here,username2:messageIn2:soundIn2:messageOut2:soundOut2...\nmessage or sound can be null to disable.\n\nSounds available: door or TTStext to speach") + "\n\n" + tr("eg") + ":\ndummyd2:<-- say hello to this guy!:door:bye bye:TTSdummyd2 has left" + '">' + tr("Usernames messages and sounds") + ': <input style="height: 25px;" type="text" size="30" id="CA-opt-usernamesmatch" value="' + CA_Settings.usernamesMatch + 
    '" /></Label> <label><input type="checkbox" id="CA-opt-usernamesmatchplaysound"' + (CA_Settings.usernamesMatchPlaySound ? " checked" : "") + "> " + tr("Play sounds") + "</input></Label><br />";
    panelHTML += '<label><input type="checkbox" id="CA-opt-sortUserListActivity"' + (CA_Settings.sortUserListActivity ? " checked" : "") + "> " + tr("Sort user list on user's activity. Sort below will be the secondary sort") + ".</input></Label><br />";
    panelHTML += "<b>" + tr("Sort user list") + ':</b> <label><input type="radio" id="CA-opt-sortUserList0" name="CA-opt-sortUserList"' + (CA_Settings.sortUserList == 0 ? " checked" : "") + ">" + tr("No sort") + '</input></label> <label><input type="radio" id="CA-opt-sortUserList1" name="CA-opt-sortUserList"' + (CA_Settings.sortUserList == 1 ? " checked" : "") + ">" + tr("User name") + '</input></label> <label><input type="radio" id="CA-opt-sortUserList2" name="CA-opt-sortUserList"' + (CA_Settings.sortUserList == 
    2 ? " checked" : "") + ">" + tr("User rank") + '</input></Label><label><input type="radio" id="CA-opt-sortUserList3" name="CA-opt-sortUserList"' + (CA_Settings.sortUserList == 3 ? " checked" : "") + ">" + tr("Distance") + "</input></Label><br />";
    panelHTML += '<label title="' + tr("Set the room name exactly as it appear in the room list\n\nLet blank to disable this feature") + '">' + tr("Force room") + ': <input style="height: 25px;" type="text" size="15" id="CA-opt-forceroom" value="' + CA_Settings.forceRoom + '" /></Label><br />';
      panelHTML += '<label><input type="checkbox" id="CA-opt-showEditorProfileIcon"' + (CA_Settings.showEditorProfileIcon ? " checked" : "") + '> ' + tr("Show editor profile icon in user list") + '.</input></label><br />';
    if (document.location.host.indexOf("beta") != -1) {
      panelHTML += '<label><input type="checkbox" id="CA-opt-defaultProdChatBetaWME"' + (CA_Settings.defaultProdChatBetaWME ? " checked" : "") + "> " + tr("Default to prod chat on WME Beta") + "</input></Label><br />";
    }
    if (document.location.host.indexOf("beta") == -1) {
      panelHTML += '<label title="' + tr("Discussion is uploaded to a server and other users will get the 10 last messages on login") + '"><input type="checkbox" id="CA-opt-contributeToHistory"' + (CA_Settings.contributeToHistory ? " checked" : "") + "> " + tr("Contribute to history") + ".</input></Label><br />";
    }
    if (W.loginManager.user.isCountryManager()) {
      panelHTML += '<button id="CA-opt-addMeToCMList">' + tr("Add me to CM List") + "</button><br />";
    }
    panelHTML += '<button id="CA-opt-close">' + tr("Save") + "</button>";
    panel.innerHTML = panelHTML;
    getId("map").appendChild(panel);
    if (W.loginManager.user.isCountryManager()) {
      getId("CA-opt-addMeToCMList").onclick = addMyselfToCMList;
    }
    getId("CA-opt-close").onclick = function() {
      var error = applySettings();
      if (error != null) {
        alert(error);
      } else {
        saveSettings();
        getId("CA-settingsPanel").style.display = "none";
      }
    };
  }
  function updateInvisibleHeaderColor() {
    var chatHelper = getChatHelper();
    if (W.model.chat.attributes.visible == false && chatHelper.header.style.backgroundColor == "") {
      chatHelper.header.style.backgroundColor = "#c2c2c2";
    }
    if (W.model.chat.attributes.visible == true) {
      if (chatHelper.header.style.backgroundColor == "rgb(194, 194, 194)") {
        chatHelper.header.style.backgroundColor = "";
      }
    }
  }
  function addHistory(msg) {
    if (!CA_Settings.contributeToHistory) {
      return;
    }
    var liveUserRank = getRankOfLiveUser(msg.attributes.from.name);
    if (liveUserRank == null) {
      return; // don't add to history if user is not in the room
    }
    var nameWithRank = `${msg.attributes.from.name} (${liveUserRank+1})`;
    history.push({room:W.model.chat.attributes.roomName, username:nameWithRank, datetime:msg.attributes.from.lastUpdate, message:msg.attributes.body});
    if (history.length >= msgCountPerUpload) {
      uploadHistory();
    }
  }
  function uploadHistory() {
    if (!CA_Settings.contributeToHistory) {
      return;
    }
    var params = {url:serverBase + "/clog/postHistory.php", headers:{"Content-Type":"application/json"}, data:JSON.stringify({user:W.loginManager.user.userName, uid:uid, room:W.model.chat.attributes.roomName, history:history}), method:"POST"};
    WMECADownloadHelper.add(params, function(data) {
      if (data.status == "success") {
        try {
          var hl = JSON.parse(data.data);
          historyLeaders[hl.country] = hl.leader;
        } catch (e) {
        }
      }
    });
    history = [];
  }
  function iSendAMessage(e) {
    var count = 0;
    var text = e.attributes.body.split("\n");
    var i = text.length - 1;
    while (i > 0) {
      if (text[i] == text[i - 1]) {
        text.splice(i, 1);
        count++;
      }
      i--;
    }
    e.attributes.body = text.join("\n");
    var isDuplication = false;
    if (!e.isSystem() && savedLastMessage.from == e.attributes.from.name && savedLastMessage.text == e.attributes.body) {
      isDuplication = true;
      var messages = getElementsByClassName("message normal-message", getId("chat"));
      var message = getElementsByClassName("body", messages[messages.length - 1]);
      if (message) {
        message = message[0];
        while (message.children.length >= 2) {
          if (message.children[message.children.length - 1].innerHTML == message.children[message.children.length - 2].innerHTML) {
            message.removeChild(message.children[message.children.length - 1]);
            count++;
          } else {
            break;
          }
        }
      }
    }
    savedLastMessage.from = e.attributes.from.name;
    savedLastMessage.text = e.attributes.body;
    if (count > 0) {
      log("" + count + " messages duplicated removed");
    }
    if (!e.isSystem() && document.location.host.indexOf("beta") == -1) {
      addHistory(e);
    }
    updateUnreadMessagesDivWidth();
    e.chatAddonTimeStamp = new Date;
    if (e.isSystem()) {
      var messages = getElementsByClassName("message system-message", getId("chat"));
      var message = messages[messages.length - 1];
      if (message && message.nextSibling == null) {
        var subList = message.children[1].children;
        if (subList.length == 1) {
          systemMessageDates = [];
        }
        systemMessageDates.push(new Date);
        for (var i = 0; i < subList.length; i++) {
          var subMessage = subList[i];
          if (subMessage.childElementCount == 0) {
            subMessage.innerHTML += '<span style="float: right; color: #A0A0A0; font-size: smaller;">' + (CA_Settings.showDate ? systemMessageDates[i].toLocaleString() : systemMessageDates[i].toLocaleTimeString()) + "</span>";
          }
        }
      }
      return;
    } else {
      var userName = e.attributes.from.name;
      if (userName != W.loginManager.user.userName) {
        if (!userActivity.hasOwnProperty(userName)) {
          resetUserActivity(userName);
        }
        userActivity[userName].lastPost = new Date;
      }
    }
    sortUserList();
    setupBells();
    var messageList = getElementsByClassName("message-list", getId("chat"))[0];
    var scrollDown = messageList.offsetHeight + messageList.scrollTop >= messageList.scrollHeight;
    logDebug("ALERT ME iSendAMessage event:", e);
    updateInvisibleHeaderColor();
    if (e.attributes.from.name == W.loginManager.user.userName) {
      removeAlert();
    }
    if (!isDuplication) {
      newMessage();
    } else {
      convertPermalinksAndLinks();
    }
    var messageNotifications = getElementsByClassName("unread-messages-notification", getId("chat"));
    if (messageNotifications.length == 1 && messageNotifications[0].style.display == "none" && scrollDown == true) {
      setTimeout(scrollToBottom, 500);
    }
  }
  function removeAlert() {
    var chatHelper = getChatHelper();
    if (chatHelper.button != null && chatHelper.header != null) {
      chatHelper.header.setAttribute("CA-alertme", "false");
      if (W.model.chat.attributes.visible == true) {
        chatHelper.button.style.backgroundColor = "";
        chatHelper.header.style.backgroundColor = "";
      } else {
        chatHelper.button.style.backgroundColor = "";
        chatHelper.header.style.backgroundColor = "";
        updateInvisibleHeaderColor();
      }
    }
  }
  function openChatGUI(e) {
    hasUnreadMessages = false;
    if (e.newValue == true) {
      logDebug("ALERT chat opens");
      updateInvisibleHeaderColor();
    } else {
      removeAlert();
    }
  }
  function setFocusOnInputMessage() {
    var inputmessage_elts = getElementsByClassName("message-input", getId("chat"));
    if (inputmessage_elts.length != 1) {
      log("Error: cannot detect input message element");
    } else {
      var inputmessage = inputmessage_elts[0];
      inputmessage.focus();
    }
  }
  function insertPermalink() {
    var inputmessage_elts = getElementsByClassName("message-input", getId("chat"));
    if (inputmessage_elts.length != 1) {
      log("Error: cannot detect input message element");
    } else {
      var inputmessage = inputmessage_elts[0];
      var curPermalink = null;
      for (var i = 0; i < divPerma.children.length; i++) {
        if (divPerma.children[i].className.indexOf("permalink") != -1) {
          curPermalink = divPerma.children[i].href;
          break;
        }
      }
      inputmessage.value += curPermalink;
      window.setTimeout(setFocusOnInputMessage, 100);
    }
  }
  function getChatHelper() {
    divChat = getId("chat-overlay");
    var chatHelper = {button:null, open:null, header:null};
    if (divChat) {
      if (divChat.className.indexOf("open") != -1) {
        chatHelper.open = true;
      }
      var chatButtons = getElementsByClassName("toggle", divChat);
      logDebug("ALERT ME chatButtons: ", chatButtons);
      if (chatButtons.length >= 1) {
        chatHelper.button = chatButtons[0];
      }
      var chatHeaders = getElementsByClassName("header", divChat);
      if (chatHeaders.length >= 1) {
        chatHelper.header = chatHeaders[0];
      }
    }
    return chatHelper;
  }
  function isInsideLink(text, pos) {
    var res = false;
    var tmp = text.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g, function() {
      var position = arguments[arguments.length - 2];
      if (pos >= position && pos < position + arguments[0].length) {
        res = true;
      }
    });
    return res;
  }
  function removeDuplicates() {
    var chatHelper = getChatHelper();
    var lastUserName = "";
    var messages = getElementsByClassName("message normal-message", getId("chat"));
    var ttsok = true;
    for (var i = 0; i < messages.length; i++) {
      var children = messages[i].children;
      for (var j = 0; j < children.length; j++) {
        if (children[j].className == "from") {
          var userInfos = children[j].innerHTML.split(" ");
          var liveUserName = userInfos[0];
          lastUserName = liveUserName;
          logDebug("live user infos:", userInfos);
          if (userInfos.length != 1 && liveUserName != W.loginManager.user.userName) {
            liveUserName = children[j].firstChild.innerHTML;
          }
          logDebug("live username:", liveUserName);
          if (liveUserName == W.loginManager.user.userName) {
            doNotNotifyNext = true;
          } else {
            doNotNotifyNext = false;
          }
          lastMessageFrom = liveUserName;
          if (CA_Settings.removeInvisible == true && i + 1 >= messages.length && messages[i].style.fontStyle != 'italic') {
            if (liveUserName != W.loginManager.user.userName && liveUserName != "") {
              if (getRankOfLiveUser(liveUserName) == null) {
                messages[i].style.display = "none";
                doNotNotifyNext = true;
                ttsok = false;
                continue;
              }
            }
          }
        }
        if (children[j].className == "body") {
          if (lastUserName == W.loginManager.user.userName) {
            children[j].style.backgroundColor = "#" + CA_Settings.messageBGColor;
          }
          var list = children[j].children;
          var textForTTS = "";
          for (var k = 0; k < list.length; k++) {
            logDebug("attribute alertMe:" + chatHelper.header.getAttribute("CA-alertme"));
            logDebug("i+1/messlength:" + (i + 1) + "/" + messages.length);
            var text = list[k].innerHTML;
            if (i + 1 == messages.length && lastUserName != W.loginManager.user.userName && CA_Settings.tts == true) {
              var newFromUserName = CA_Settings.tts_fromPrefix.replace(/\{userName\}/gi, lastUserName);
              lastUserName.replace("-", "");
              textForTTS = newFromUserName + ": " + text;
            }
            var inputs = text.split("\n");
            if (inputs.lentgh > 1) {
              var newInputs = inputs.filter(function(elem, pos, self) {
                if (self.indexOf(elem) != pos) {
                  log('Text duplicated: "' + elem.innerHTML + '" removed');
                  return false;
                }
                return true;
              });
              if (text != newInputs.join("\n")) {
                list[k].innerHTML = newInputs.join("\n");
              }
            }
            if (i + 1 == messages.length && lastUserName != W.loginManager.user.userName && doNotNotifyNext == false) {
              logDebug("ALERT ME UNDEFINED on " + text);
              var alertMatch = false;
              var alertPatterns = CA_Settings.alertMatch.split(",");
              for (var l = 0; l < alertPatterns.length; l++) {
                if (alertPatterns[l].charAt(0) == "$" && alertPatterns[l].charAt(alertPatterns[l].length - 1) == "$") {
                  alertPatterns[l] = "(^|\\s)" + alertPatterns[l].toLowerCase().substr(1, alertPatterns[l].length - 2) + "(\\s|$)";
                  if (text.match(new RegExp(alertPatterns[l], "i")) != null) {
                    alertMatch = true;
                    break;
                  }
                } else {
                  if (text.toLowerCase().indexOf(alertPatterns[l].toLowerCase()) != -1) {
                    alertMatch = true;
                    break;
                  }
                }
              }
              var regex = new RegExp("(" + alertPatterns.join(")|(") + ")", "gi");
              text = text.replace(regex, function() {
                if (isInsideLink(arguments[arguments.length - 1], arguments[arguments.length - 2])) {
                  return arguments[0];
                } else {
                  return '<font class="CA-alertKW" style="background-color: #' + CA_Settings.alertBGColor + '; color: #ffffff;">' + arguments[0] + "</font>";
                }
              });
              list[k].innerHTML = text;
              {
                if (alertMatch == true) {
                  logDebug("ALERT ME found chatHelper: ", chatHelper);
                  if (chatHelper.button != null && chatHelper.header != null) {
                    chatHelper.header.setAttribute("CA-alertme", "true");
                    logDebug("ALERT ME setup bg color");
                    chatHelper.button.style.backgroundColor = "#" + CA_Settings.alertBGColor;
                    chatHelper.header.style.backgroundColor = "#" + CA_Settings.alertBGColor;
                    if (CA_Settings.alertSound == true && doNotNotifyNext == false) {
                      var snd = new Audio("data:audio/mp3;base64," + alertSound);
                      snd.play();
                    }
                    doNotNotifyNext = true;
                  }
                }
              }
            }
          }
          if (ttsok == true && textForTTS != "") {
            tts_messages.push(textForTTS);
          }
        }
      }
    }
  }
  function convertPermalinksAndLinks() {
    var lastUserName = "";
    var jumpTargets = [];
    var jumpUserTargets = [];
    var bipUserTargets = [];
    var messages = getElementsByClassName("message normal-message", getId("chat"));
    for (var i = 0; i < messages.length; i++) {
      var children = messages[i].children;
      for (var j = 0; j < children.length; j++) {
        if (children[j].className == "from") {
          var userInfos = children[j].innerHTML.split(" ");
          if (userInfos.length == 1) {
            lastUserName = children[j].innerHTML;
            if (lastUserName != "") {
              var separator = "";
              if (lastUserName == W.loginManager.user.userName) {
                children[j].innerHTML = children[j].innerHTML + " (" + (W.loginManager.user.rank + 1) + ")";
              } else {
                separator = " ";
                var liveUserRank = getRankOfLiveUser(lastUserName);
                children[j].innerHTML = '<a href="#" id="CA-bip-' + bipCount + '">' + lastUserName + "</a> (" + (liveUserRank != null ? liveUserRank + 1 : "?") + ")" + ' <a href="#" id="CA-t-' + targetCount + '"><i class="crosshair fa fa-crosshairs icon-screenshot"></i></a>';
                jumpUserTargets.push({id:targetCount, userName:lastUserName});
                bipUserTargets.push({id:bipCount, userName:lastUserName});
                targetCount++;
                bipCount++;
              }
              children[j].innerHTML = children[j].innerHTML + separator + '<span style="float: right; color: #A0A0A0; font-size: smaller;">' + (CA_Settings.showDate ? (new Date).toLocaleString() : (new Date).toLocaleTimeString()) + "</span>";
            }
          } else {
            var userInfos = children[j].innerHTML.split(" ");
            var lastUserName = userInfos[0];
            if (userInfos.length != 1 && lastUserName != W.loginManager.user.userName) {
              lastUserName = children[j].firstChild.innerHTML;
            }
          }
        }
        if (children[j].className == "body") {
          var list = children[j].children;
          for (var k = 0; k < list.length; k++) {
            if (typeof list[k].chatAddonOk !== "undefined") {
              continue;
            }
            list[k].chatAddonOk = true;
            var newMessage = list[k].innerHTML;
            var pos = 0;
            var remainigMessage = newMessage;
            while (remainigMessage.length > 0) {
              var permalink = getFirstPermalink(remainigMessage);
              if (permalink) {
                var details = getJumpSetFromPermalink(permalink.permalink);
                if (details.lon && details.lat) {
                  var elements = 0;
                  var elType = "";
                  if (details.segments != null) {
                    elements = details.segments.length;
                    elType = "segment" + (elements > 1 ? "s" : "");
                  } else {
                    if (details.nodes != null) {
                      elements = details.nodes.length;
                      elType = "node" + (elements > 1 ? "s" : "");
                    } else {
                      if (details.venues != null) {
                        elements = details.venues.length;
                        elType = "venue" + (elements > 1 ? "s" : "");
                      }
                    }
                  }
                  newMessage = newMessage.replace(permalink.permalink, '<a href="#"' + (elements != 0 ? ' title="' + elements + " " + elType + '"' : "") + ' id="CA-t-' + targetCount + '"><i class="crosshair fa fa-crosshairs icon-screenshot"></i></a>');
                  jumpTargets.push({id:targetCount, jumpDetails:details});
                  log("permalink replaced by target on message posted by " + lastUserName);
                  targetCount++;
                  remainigMessage = remainigMessage.substring(permalink.end);
                  continue;
                } else {
                  log("Bad permalink: no lon or lat: " + newMessage);
                }
              }
              remainigMessage = remainigMessage.substring(1);
            }
            newMessage = newMessage.replace(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/g, function(match, contents, offset, s) {
              return '<a target="_blank" href="' + (match.indexOf("://") != -1 ? match : "http://" + match) + '">' + match + "</a>";
            });
            newMessage = replaceSmileys(newMessage);
            if (list[k].innerHTML != newMessage) {
              list[k].innerHTML = newMessage;
            }
          }
        }
      }
    }
    for (var i = 0; i < jumpTargets.length; i++) {
      getId("CA-t-" + jumpTargets[i].id).onclick = getFunctionWithArgs(jumpTo, [jumpTargets[i].jumpDetails]);
    }
    for (var i = 0; i < jumpUserTargets.length; i++) {
      getId("CA-t-" + jumpUserTargets[i].id).onclick = getFunctionWithArgs(jumpToUser, [jumpUserTargets[i].userName]);
    }
    for (var i = 0; i < bipUserTargets.length; i++) {
      getId("CA-bip-" + bipUserTargets[i].id).onclick = getFunctionWithArgs(bipUser, [bipUserTargets[i].userName]);
    }
  }
  function setupStopAlertOnKeywords() {
    var patches = getElementsByClassName("CA-alertKW", getId("chat"));
    for (var i = 0; i < patches.length; i++) {
      patches[i].onclick = removeAlert;
    }
  }
  function processMessages() {
    removeDuplicates();
    convertPermalinksAndLinks();
    setupStopAlertOnKeywords();
    logDebug("Last message: " + lastMessageFrom);
    if (lastMessageFrom == W.loginManager.user.userName || _(W.model.chat.messages.models).isEmpty() == false && _(W.model.chat.messages.models).last().attributes.type == "system") {
      doNotNotifyNext = true;
    }
  }
  function newMessage() {
    logDebug("newMessage called");
    doNotNotifyNext = false;
    processMessages();
    var chatHelper = getChatHelper();
    if (doNotNotifyNext == false) {
      if (CA_Settings.messageSound == true) {
        var snd = new Audio("data:audio/mp3;base64," + notificationSound);
        snd.play();
      }
    } else {
      if (hasUnreadMessages == false) {
        chatHelper.button.parentNode.parentNode.classList.remove("has-unread-messages");
      }
    }
    hasUnreadMessages = chatHelper.button.parentNode.parentNode.className.indexOf(" has-unread-messages") != -1;
    doNotNotifyNext = false;
  }
  function bipUser(userName) {
    var inputmessage_elts = getElementsByClassName("message-input", getId("chat"));
    if (inputmessage_elts.length != 1) {
      log("Error: Bip user: cannot detect input message element");
    } else {
      var inputmessage = inputmessage_elts[0];
      var bipMessage = CA_Settings.bipPattern.replace(/\{userName\}/gi, userName);
      inputmessage.value += bipMessage;
      window.setTimeout(setFocusOnInputMessage, 100);
    }
  }
  function getMessageObjectFromData(userName, message) {
    var res = null;
    for (var i = 0; i < W.model.chat.messages.models.length; i++) {
      res = W.model.chat.messages.models[i];
      if (res.attributes.body == message && res.attributes.from.name == userName) {
        return res;
      }
    }
    return null;
  }
  function getFirstPermalink(str) {
    for (var i = 0; i < baseURLs.length; i++) {
      var start = str.search(baseURLs[i]);
      if (start == -1) {
        continue;
      }
      var end = start + 1;
      while (end < str.length && str.charAt(end) != " " && str.charAt(end) != "\n") {
        end++;
      }
      return {start:start, end:end, permalink:str.substring(start, end)};
    }
    return null;
  }
  function getJumpSetFromPermalink(permalink) {
    logDebug("permalink: ", permalink);
    var lon = permalink.match(/lon=([\-]?[0-9]*[.]?[0-9]*)/);
    var lat = permalink.match(/lat=([\-]?[0-9]*[.]?[0-9]*)/);
    var zoom = permalink.match(/zoom=([0-9]+)/);
    var segments = permalink.match(/segments=(([0-9]+[,]?)+)+/);
    var nodes = permalink.match(/nodes=(([0-9]+[,]?)+)+/);
    var venues = permalink.match(/venues=(([0-9|\.|\-]+[,]?)+)+/);
    var mapUpdateRequest = permalink.match(/mapUpdateRequest=([0-9]*)/);
    logDebug("lon: ", lon);
    logDebug("lat: ", lat);
    logDebug("zoom: ", zoom);
    logDebug("segments: ", segments);
    logDebug("nodes: ", nodes);
    logDebug("venues: ", venues);
    logDebug("mapUpdateRequest: ", mapUpdateRequest);
    return {lon:lon == null ? null : lon.length == 2 ? parseFloat(lon[1]) : null, lat:lat == null ? null : lat.length == 2 ? parseFloat(lat[1]) : null, zoom:zoom == null ? null : zoom.length == 2 ? parseFloat(zoom[1]) : null, segments:segments ? segments[1].split(",") : null, nodes:nodes ? nodes[1].split(",") : null, venues:venues ? venues[1].split(",") : null, mapUpdateRequest:mapUpdateRequest ? mapUpdateRequest[1].split(",") : null};
  }
  function getRankOfLiveUser(userName) {
    for (var i = 0; i < W.model.chat.users.models.length; i++) {
      if (W.model.chat.users.models[i].attributes.name == userName) {
        return W.model.chat.users.models[i].attributes.rank;
      }
    }
    return null;
  }
  function jumpToUser(userName) {
    var user = null;
    for (var i = 0; i < W.model.chat.users.models.length; i++) {
      user = W.model.chat.users.models[i];
      if (user.attributes.name == userName) {
        break;
      } else {
        user = null;
      }
    }
    if (user) {
      jumpTo({lon:user.attributes.center.lon, lat:user.attributes.center.lat, zoom:null, segments:null, nodes:null, venues:null, mapUpdateRequest:null});
    } else {
      log("Can't find user: loggued out or invisible???");
    }
    return false;
  }
  function jumpTo(jumpSet) {
    logDebug("jumping to: ", jumpSet);
    W.selectionManager.unselectAll();
    if (typeof ChatJumper !== "undefined") {
      if (ChatJumper.isLast) {
      } else {
        var c = W.map.getCenter();
        var zoom = W.map.getZoom();
        ChatJumper.last = [c.lon, c.lat];
        ChatJumper.zoom = zoom;
        ChatJumper.isLast = true;
        ChatJumper.saveLS();
        ChatJumper.showButton();
      }
    }
    selectDataWaitForMergeEnd = false;
    if (jumpSet.segments || jumpSet.nodes || jumpSet.venues || jumpSet.mapUpdateRequest) {
      currentJumpSet = jumpSet;
      W.model.events.register("mergestart", null, mergestart);
    }
    var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(jumpSet.lon, jumpSet.lat);
    if (jumpSet.zoom) {
      W.map.setCenter(xy, jumpSet.zoom);
    } else {
      W.map.setCenter(xy);
    }
    if (jumpSet.segments || jumpSet.nodes || jumpSet.venues || jumpSet.mapUpdateRequest) {
      window.setTimeout(getFunctionWithArgs(selectData, [jumpSet]), 500);
    }
  }
  function mergestart() {
    try {
      log("Permalink is far!");
      selectDataWaitForMergeEnd = true;
      W.model.events.unregister("mergestart", null, mergestart);
      W.model.events.register("mergeend", null, mergeend);
    } catch (e) {
      logError("Error:", e);
    }
  }
  function mergeend() {
    try {
      log("Data loaded, now, try to select data if any...");
      W.model.events.unregister("mergeend", null, mergeend);
      selectDataWaitForMergeEnd = false;
      selectData(currentJumpSet);
    } catch (e) {
      logError("Error:", e);
    }
  }
  function selectData(jumpSet) {
    if (selectDataWaitForMergeEnd == true) {
      log("waiting for data...");
      return;
    }
    W.model.events.unregister("mergestart", null, mergestart);
    W.model.events.unregister("mergeend", null, mergeend);
    var success = true;
    var notFound = [];
    var elements = 0;
    if (jumpSet.segments) {
      var segs = [];
      for (var i = 0; i < jumpSet.segments.length; i++) {
        var segId = parseInt(jumpSet.segments[i]);
        if (typeof W.model.segments.objects[segId] === "undefined") {
          success = false;
          notFound.push(segId);
        } else {
          segs.push(W.model.segments.objects[segId]);
        }
      }
      elements = jumpSet.segments.length;
      W.selectionManager.setSelectedModels(segs);
    }
    if (jumpSet.nodes) {
      var nodes = [];
      for (var i = 0; i < jumpSet.nodes.length; i++) {
        var nodeId = parseInt(jumpSet.nodes[i]);
        if (typeof W.model.nodes.objects[nodeId] === "undefined") {
          success = false;
          notFound.push(nodeId);
        } else {
          nodes.push(W.model.nodes.objects[nodeId]);
        }
      }
      elements = jumpSet.nodes.length;
      W.selectionManager.setSelectedModels(nodes);
    }
    if (jumpSet.venues) {
      W.map.landmarkLayer.setVisibility(true);
      var venues = [];
      for (var i = 0; i < jumpSet.venues.length; i++) {
        var venueId = jumpSet.venues[i];
        if (typeof W.model.venues.objects[venueId] === "undefined") {
          success = false;
          notFound.push(venueId);
        } else {
          venues.push(W.model.venues.objects[venueId]);
        }
      }
      elements = jumpSet.venues.length;
      W.selectionManager.setSelectedModels(venues);
    }
    if (jumpSet.mapUpdateRequest && jumpSet.mapUpdateRequest.length >= 1 && !jumpSet.segments && !jumpSet.nodes && !jumpSet.venues) {
      var mp = W.model.problems.objects[parseInt(jumpSet.mapUpdateRequest[0])];
      var tp = null;
      if (mp == null) {
        tp = W.model.turnProblems.objects[parseInt(jumpSet.mapUpdateRequest[0])];
      }
      logDebug("mp :", mp);
      logDebug("tp :", tp);
      if (mp != null) {
        problemsControl.selectProblem(mp);
        success = true;
      }
      if (tp != null) {
        problemsControl.selectProblem(tp);
        success = true;
      }
    }
    if (!success) {
      if (jumpSet.hasOwnProperty("attempt") && jumpSet.attempt >= 2) {
        log("Select data failed...");
        if (confirm("Some elements can't be found.\nSelection: " + W.selectionManager.getSelectedFeatures.length + "/" + elements + "\nNot found: " + (notFound.length != 0 ? "Elements ids: " + notFound.join(", ") + "\n" : "") + "Try again to select elements?")) {
          window.setTimeout(getFunctionWithArgs(selectData, [jumpSet]), 500);
        }
        return;
      }
      if (jumpSet.hasOwnProperty("attempt")) {
        jumpSet.attempt++;
      } else {
        jumpSet.attempt = 0;
      }
      log("select data: attempt: " + jumpSet.attempt);
      window.setTimeout(getFunctionWithArgs(selectData, [jumpSet]), 500);
    } else {
      log("Data selected...:", jumpSet);
    }
  }
  function setupBells() {
    var userLists = getElementsByClassName("list-unstyled user-list", getId("chat"));
    if (userLists.length == 1) {
      var userList = userLists[0];
      var users = userList.children;
      if (users.length == 0 || users.length == 1 && W.model.chat.attributes.visible) {
        window.setTimeout(setupBells, 500);
        return;
      }
      for (var u = 0; u < users.length; u++) {
        var user = users[u];
        if (user.childNodes.length == 1 || user.childNodes.length == 2 && user.childNodes[1].nodeName == "HR") {
          var userId = user.firstChild.getAttribute("data-id");
          var userName = "";
          for (var i = 0; i < W.model.chat.users.models.length; i++) {
            if (W.model.chat.users.models[i].attributes.id == userId) {
              userName = W.model.chat.users.models[i].attributes.name;
              break;
            }
          }
            if (userName != W.loginManager.user.userName && userName != "") {
                let profile = document.createElement("a");
                profile.href = `https://www.waze.com/user/editor/${userName}`;
                profile.title = tr(`Open ${userName}'s editor profile.`);
                profile.target = '_blank';
                profile.style.cssFloat = "left";
                profile.style.margin = "0px 0px 0px -15px";
                profile.style.padding = "0px";
                let profileicon = document.createElement("i");
                profileicon.className = "fa fa-user";
                profile.appendChild(profileicon);
                var bell = document.createElement("a");
                bell.href = "#";
                bell.id = "CA-bell-" + userName;
                var i0 = document.createElement("img");
                i0.src = "data:image/png;base64," + chipIcon;
                i0.style.width = "15px";
                i0.style.cssFloat = "left";
                var i1 = document.createElement("img");
                i1.src = "data:image/png;base64," + bellIcon;
                i1.style.width = "15px";
                i1.style.cssFloat = "left";
                var i2 = document.createElement("img");
                i2.src = "data:image/png;base64," + zzzIcon;
                i2.style.width = "15px";
                i2.style.cssFloat = "left";
                bell.appendChild(i0);
                bell.appendChild(i1);
                bell.appendChild(i2);
                changeIconUserStatus(bell, 2);
                bell.style.cssFloat = "left";
                bell.style.margin = "0px";
                bell.style.padding = "0px";
                bell.style.marginLeft = "-15px";
                if (W.model.chat.attributes.visible == true) {
                    bell.onclick = getFunctionWithArgs(bipUser, [userName]);
                }
                user.insertBefore(bell, user.firstChild);
                if(CA_Settings.showEditorProfileIcon)
                    $(user).prepend(profile);
            }
        } else {
          if (user.childNodes.length == 2) {
            var bell = user.firstChild;
            if (bell.onclick == null) {
              var userId = user.childNodes[1].getAttribute("data-id");
              var userName = "";
              for (var i = 0; i < W.model.chat.users.models.length; i++) {
                if (W.model.chat.users.models[i].attributes.id == userId) {
                  userName = W.model.chat.users.models[i].attributes.name;
                  break;
                }
              }
              if (userName != W.loginManager.user.userName && userName != "") {
                bell.onclick = getFunctionWithArgs(bipUser, [userName]);
              }
            }
          }
        }
      }
    }
  }
  function userEnter(e) {
    log(e.attributes.name + " has joined");
    setupBells();
    var messageDisplayed = false;
    if (e.attributes.name != W.loginManager.user.userName && CA_Settings.usernamesMatch.length != 0) {
      if (userAlertList.hasOwnProperty(e.attributes.name) == true) {
        var details = userAlertList[e.attributes.name];
        for (var i = 0; i < details.inMessage.length; i++) {
          if (details.inMessage[i] != "null" && details.inMessage[i] != "") {
            addSystemMessage(e.attributes.name + " (" + (e.attributes.rank + 1) + ") " + details.inMessage[i], "smaller");
            messageDisplayed = true;
          }
        }
        for (var i = 0; i < details.inSound.length; i++) {
          if (details.inSound[i] != "null" && details.inSound[i] != "" && inoutSounds.hasOwnProperty(details.inSound[i]) && CA_Settings.usernamesMatchPlaySound == true) {
            var snd = new Audio("data:audio/mp3;base64," + inoutSounds[details.inSound[i]]["in"]);
            snd.play();
          }
          if (details.inSound[i] != "null" && details.inSound[i] != "" && details.inSound[i].substr(0, 3) == "TTS" && CA_Settings.usernamesMatchPlaySound == true) {
            tts_messages.push(details.inSound[i].substr(3));
          }
        }
      }
    }
    if (e.attributes.name != W.loginManager.user.userName && CA_Settings.systemMessageOnJoinLeave == true && !messageDisplayed) {
      addSystemMessage(e.attributes.name + " (" + (e.attributes.rank + 1) + ") " + tr("has joined"), "smaller");
    }
    if (e.attributes.name == W.loginManager.user.userName) {
      getId("chat").getElementsByClassName("message-list")[0].style.maxHeight = "250px";
    }
    sortUserList();
  }
  function removeBells() {
    var userLists = getElementsByClassName("list-unstyled user-list", getId("chat"));
    if (userLists.length == 1) {
      var userList = userLists[0];
      var users = userList.children;
      for (var u = 0; u < users.length; u++) {
        var user = users[u];
        if (user.children.length > 1) {
          user.removeChild(user.firstChild);
        }
      }
    }
  }
  function userLeave(e) {
    log("userLeave:", e.attributes.name + " has left");
    var bell = getId("CA-bell-" + e.attributes.name);
    if (bell != null) {
      bell.parentNode.removeChild(bell);
    }
    var messageDisplayed = false;
    if (e.attributes.name != W.loginManager.user.userName && CA_Settings.usernamesMatch.length != 0) {
      if (userAlertList.hasOwnProperty(e.attributes.name) == true) {
        var details = userAlertList[e.attributes.name];
        for (var i = 0; i < details.outMessage.length; i++) {
          if (details.outMessage[i] != "null" && details.outMessage[i] != "") {
            addSystemMessage(e.attributes.name + " (" + (e.attributes.rank + 1) + ") " + details.outMessage[i], "smaller");
            messageDisplayed = true;
          }
        }
        for (var i = 0; i < details.outSound.length; i++) {
          if (details.outSound[i] != "null" && details.outSound[i] != "" && inoutSounds.hasOwnProperty(details.outSound[i]) && CA_Settings.usernamesMatchPlaySound == true) {
            var snd = new Audio("data:audio/mp3;base64," + inoutSounds[details.outSound[i]].out);
            snd.play();
          }
          if (details.outSound[i] != "null" && details.outSound[i] != "" && details.outSound[i].substr(0, 3) == "TTS" && CA_Settings.usernamesMatchPlaySound == true) {
            tts_messages.push(details.outSound[i].substr(3));
          }
        }
      }
    }
    if (e.attributes.name != W.loginManager.user.userName && CA_Settings.systemMessageOnJoinLeave == true && !messageDisplayed) {
      addSystemMessage(e.attributes.name + " (" + (e.attributes.rank + 1) + ") " + tr("has left"), "smaller");
    }
    if (e.attributes.name == W.loginManager.user.userName) {
      getId("chat").getElementsByClassName("message-list")[0].style.maxHeight = "290px";
      setupBells();
    }
  }
  function addSystemMessage(message, fontSize) {
    var messageList = getElementsByClassName("message-list", getId("chat"))[0];
    var scrollDown = messageList.offsetHeight + messageList.scrollTop >= messageList.scrollHeight;
    var fakeMsg = document.createElement("div");
    fakeMsg.className = "message system-message";
    fakeMsg.innerHTML = '<div class="from"></div><div class="body"><div style="overflow: auto; direction: ltr; text-align: left;' + (fontSize ? " font-size: " + fontSize + ";" : "") + '">' + message + '<span style="float: right; color: #A0A0A0; font-size: smaller;">' + (CA_Settings.showDate ? (new Date).toLocaleString() : (new Date).toLocaleTimeString()) + "</span>" + "</div></div>";
    messageList.appendChild(fakeMsg);
    var messageNotifications = getElementsByClassName("unread-messages-notification", getId("chat"));
    if (messageNotifications.length == 1 && messageNotifications[0].style.display == "none" && scrollDown == true) {
      setTimeout(scrollToBottom, 500);
    }
  }
  function scrollToBottom() {
    var messageList = getElementsByClassName("message-list", getId("chat"))[0];
    messageList.scrollTop = messageList.scrollHeight;
  }
  function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  }
  function replaceSmileys(text) {
    var regex;
    for (var k in smileys) {
      if (smileys.hasOwnProperty(k)) {
        regex = new RegExp(escapeRegExp(k), "g");
        text = text.replace(regex, function() {
          if (isInsideLink(arguments[arguments.length - 1], arguments[arguments.length - 2])) {
            return arguments[0];
          } else {
            return '<img title="' + arguments[0] + '" src="' + smileys[arguments[0]] + '" />';
          }
        });
      }
    }
    regex = new RegExp("emoji([0-9]{1,3})", "g");
    text = text.replace(regex, function() {
      if (isInsideLink(arguments[arguments.length - 1], arguments[arguments.length - 2])) {
        return arguments[0];
      } else {
        return '<img title="' + arguments[0] + '" src="https://s3.amazonaws.com/tapatalk-emoji/' + arguments[0] + '.png" />';
      }
    });
    return text;
  }
  function isRegisteredAsCM(username, countriesList) {
    var registeredCountries = 0;
    for (var i = 0; i < countriesList.length; i++) {
      if (CMList.hasOwnProperty("" + countriesList[i]) && CMList["" + countriesList[i]].indexOf(username) != -1) {
        registeredCountries++;
      }
    }
    if (registeredCountries == countriesList.length) {
      return true;
    }
    return false;
  }
  function isCM(username) {
    if (CMList != null && W.model.hasOwnProperty("countries") && W.model.countries && W.model.countries.hasOwnProperty("top") && W.model.countries.top && W.model.countries.top.hasOwnProperty("id") && CMList.hasOwnProperty(W.model.countries.top.id) && CMList[W.model.countries.top.id].indexOf(username) != -1) {
      return true;
    }
    return false;
  }
  function sortUserList() {
    var userList = getElementsByClassName("list-unstyled user-list", getId("chat"))[0];
    var users = userList.children;
    for (var i = 0; i < users.length; i++) {
      if (users[i].getElementsByClassName("user").length == 0) {
        while (users[i].firstChild) {
          users[i].removeChild(users[i].firstChild);
        }
      }
    }
    for (var i = 0; i < users.length - 1; i++) {
      if (users[i].hasChildNodes() == false) {
        continue;
      }
      var realUserName = getElementsByClassName("username", users[i])[0].innerHTML;
      if (isCM(realUserName)) {
        getElementsByClassName("username", users[i])[0].style.color = "crimson";
        getElementsByClassName("username", users[i])[0].style.textDecoration = "underline";
      } else {
        if (userAlertList.hasOwnProperty(realUserName) == true && userAlertList[realUserName].hasOwnProperty("color") && userAlertList[realUserName].color != "") {
          getElementsByClassName("username", users[i])[0].style.color = userAlertList[realUserName].color;
        } else {
          getElementsByClassName("username", users[i])[0].style.color = "";
        }
        getElementsByClassName("username", users[i])[0].style.textDecoration = "";
      }
    }
    setupBells();
    if (sortUserListDisbled == true) {
      return;
    }
    var now = new Date;
    var sortMode = CA_Settings.sortUserList;
    if (sortMode == 0 && CA_Settings.sortUserListActivity == false) {
      return;
    }
    var changed = true;
    while (changed == true) {
      changed = false;
      for (var i = 0; i < users.length - 1; i++) {
        var next = i + 1;
        if (users[i].hasChildNodes() == false) {
          continue;
        }
        var realUserName = getElementsByClassName("username", users[i])[0].innerHTML;
        getElementsByClassName("username", users[i])[0].setAttribute("title", realUserName);
        var userName = realUserName.toLowerCase();
        var userRank = getElementsByClassName("rank", users[i])[0].innerHTML;
        userRank = userRank.replace(/\s/g, "");
        while (next < users.length && users[next].hasChildNodes() == false) {
          next++;
        }
        if (next >= users.length) {
          continue;
        }
        var nextRealUserName = getElementsByClassName("username", users[next])[0].innerHTML;
        var nextUserName = nextRealUserName.toLowerCase();
        var nextUserRank = getElementsByClassName("rank", users[next])[0].innerHTML;
        nextUserRank = nextUserRank.replace(/\s/g, "");
        var useSecondarySort = !CA_Settings.sortUserListActivity;
        if (CA_Settings.sortUserListActivity == true) {
          var idleTime1 = now.getTime();
          var idleTime2 = now.getTime();
          var idleTime3 = now.getTime();
          var idleTime4 = now.getTime();
          if (userActivity.hasOwnProperty(realUserName)) {
            idleTime1 -= userActivity[realUserName].lastMove.getTime();
            idleTime2 -= userActivity[realUserName].lastPost.getTime();
          }
          if (userActivity.hasOwnProperty(nextRealUserName)) {
            idleTime3 -= userActivity[nextRealUserName].lastMove.getTime();
            idleTime4 -= userActivity[nextRealUserName].lastPost.getTime();
          }
          var idleTimeU1 = Math.min(idleTime1, idleTime2);
          var idleTimeU2 = Math.min(idleTime3, idleTime4);
          if (idleTimeU1 / 1000 < 60) {
            idleTimeU1 = 0;
          } else {
            if (idleTimeU1 / 1000 < 120) {
              idleTimeU1 = 1;
            } else {
              if (idleTimeU1 / 1000 < 300) {
                idleTimeU1 = 2;
              } else {
                if (idleTimeU1 / 1000 < 1200) {
                  idleTimeU1 = 3;
                } else {
                  idleTimeU1 = 4;
                }
              }
            }
          }
          if (idleTimeU2 / 1000 < 60) {
            idleTimeU2 = 0;
          } else {
            if (idleTimeU2 / 1000 < 120) {
              idleTimeU2 = 1;
            } else {
              if (idleTimeU2 / 1000 < 300) {
                idleTimeU2 = 2;
              } else {
                if (idleTimeU2 / 1000 < 1200) {
                  idleTimeU2 = 3;
                } else {
                  idleTimeU2 = 4;
                }
              }
            }
          }
          users[i].setAttribute("iddleTime", idleTimeU1);
          if (idleTimeU1 == idleTimeU2) {
            useSecondarySort = true;
          }
          if (idleTimeU1 > idleTimeU2) {
            userList.insertBefore(users[next], users[i]);
            changed = true;
            continue;
          }
        }
        if (useSecondarySort == true) {
          if (sortMode == 1 || sortMode == 2 && userRank == nextUserRank) {
            if (userName > nextUserName) {
              userList.insertBefore(users[next], users[i]);
              changed = true;
            }
          } else {
            if (sortMode == 2) {
              if (userRank < nextUserRank) {
                userList.insertBefore(users[next], users[i]);
                changed = true;
              }
            } else {
              if (sortMode == 3) {
                var userObj = null;
                var nextuserObj = null;
                for (var u = 0; u < W.model.chat.users.models.length; u++) {
                  if (W.model.chat.users.models[u].attributes.name == realUserName) {
                    userObj = W.model.chat.users.models[u];
                    if (nextuserObj != null) {
                      break;
                    }
                    continue;
                  }
                  if (W.model.chat.users.models[u].attributes.name == nextRealUserName) {
                    nextuserObj = W.model.chat.users.models[u];
                    if (userObj != null) {
                      break;
                    }
                    continue;
                  }
                }
                if (userObj != null && nextuserObj != null) {
                  var du = 0;
                  var dnu = 0;
                  var myPosition = OpenLayers.Layer.SphericalMercator.inverseMercator(W.map.getCenter().lon, W.map.getCenter().lat);
                  if (userObj.attributes.name == W.loginManager.user.userName) {
                    continue;
                  }
                  if (nextuserObj.attributes.name == W.loginManager.user.userName) {
                    dnu = 0;
                  } else {
                    dnu = (myPosition.lon - nextuserObj.attributes.center.lon) * (myPosition.lon - nextuserObj.attributes.center.lon) + (myPosition.lat - nextuserObj.attributes.center.lat) * (myPosition.lat - nextuserObj.attributes.center.lat);
                  }
                  du = (myPosition.lon - userObj.attributes.center.lon) * (myPosition.lon - userObj.attributes.center.lon) + (myPosition.lat - userObj.attributes.center.lat) * (myPosition.lat - userObj.attributes.center.lat);
                  if (du > dnu) {
                    userList.insertBefore(users[next], users[i]);
                    changed = true;
                  }
                }
              }
            }
          }
        }
      }
    }
    for (var i = 0; i < users.length; i++) {
      var next = i + 1;
      if (users[i].hasChildNodes() == false) {
        continue;
      }
      var hrs = users[i].getElementsByTagName("hr");
      for (var hr = 0; hr < hrs.length; hr++) {
        users[i].removeChild(hrs[hr]);
      }
    }
    if (CA_Settings.sortUserListActivity == true) {
      for (var i = 0; i < users.length - 1; i++) {
        var next = i + 1;
        if (users[i].hasChildNodes() == false) {
          continue;
        }
        while (next < users.length && users[next].hasChildNodes() == false) {
          next++;
        }
        if (next >= users.length) {
          continue;
        }
        var hrs = users[next].getElementsByTagName("hr");
        for (var hr = 0; hr < hrs.length; hr++) {
          users[next].removeChild(hrs[hr]);
        }
        if (users[i].getAttribute("iddleTime") != users[next].getAttribute("iddleTime")) {
          var hr = document.createElement("hr");
          hr.style.margin = "0px";
          hr.style.color = "black";
          hr.style.backgroundColor = "black";
          hr.style.height = "1px";
          users[i].appendChild(hr);
        }
      }
    }
  }
  function resetChatSocket(params) {
    log("Reset chat socket");
    W.model.chat._marx.socket.removeAllListeners();
    try {
      W.model.chat._marx.disconnect();
    } catch (e) {
      logError("chat disconnect:", e);
    }
    if (W.model.chat._marx.socket.connected == true || W.model.chat._marx.socket.open == true) {
      log("wait for disconnection...");
      window.setTimeout(function() {
        resetChatSocket(params);
        window.setTimeout(setupBells);
      });
      return;
    }
    var status = {NotConnected:0, FirstConnection:1, Reconnection:2};
    var server = "/editor/chat";
    var socket = io(server, { path: server, transports: ["websocket"], "try multiple transports":!1, "force new connection":true, "forceNew":true});
    socket.on("connect", function(e) {
      return function() {
        return e.mode === status.NotConnected ? (e.mode = status.FirstConnection, e.events.dispatcher.trigger("firstConnect")) : (e.mode = status.Reconnection, e.events.dispatcher.trigger("reconnect"));
      };
    }(W.model.chat._marx));
    socket.on("disconnect", function(e) {
      return function() {
        return e.events.dispatcher.trigger("disconnect");
      };
    }(W.model.chat._marx));
    socket.on("connect_error", function(e) {
      return function() {
        log("socket connection error: ", e);
      };
    }(W.model.chat._marx));
    W.model.chat._marx.socket = socket;
    W.model.liveUsers._marx.socket = socket;
    W.model.chat._registerSocketEvents();
    W.model.liveUsers._registerMarxEvents();
    if (params && params.hasOwnProperty("onSuccess") == true) {
      params.onSuccess();
    }
  }
  function roomChanged(e) {
    if (arguments.length == 0) {
      e = {attributes:{roomName:W.model.chat.attributes.room.attributes.name}};
    }
    window.setTimeout(function() {
      resetChatSocket();
      window.setTimeout(setupBells);
    });
    log("ROOM Changed:", e);
    if (!roomForced) {
      roomForced = true;
      if (CA_Settings.forceRoom != "") {
        if (CA_Settings.forceRoom != e.attributes.name) {
          var rooms = getElementsByClassName("dropdown-menu rooms", getId("chat"))[0].children;
          for (var i = 0; i < rooms.length; i++) {
            var aelement = rooms[i].firstChild;
            if (aelement.innerHTML == CA_Settings.forceRoom) {
              log("Force room change to " + aelement.innerHTML);
              aelement.click();
              break;
            }
          }
        }
      }
    }
    if (document.location.host.indexOf("beta") == -1) {
      log("histo", e);
      var params = {url:serverBase + "/clog/getHistory.php?room=" + e.attributes.roomName, headers:{"User-Agent":"Mozilla/5.0", "Accept":"text/plain"}, data:null, method:"GET"};
      WMECADownloadHelper.add(params, function(data) {
        if (data.status == "success") {
          var wasTTS = CA_Settings.tts;
          CA_Settings.tts = false;
          try {
            var msgs = JSON.parse(data.data);
            var messageList = getElementsByClassName("message-list", getId("chat"))[0];
            for (var i = 0; i < msgs.length; i++) {
              var fakeMsg = document.createElement("div");
              fakeMsg.className = "message normal-message";
              fakeMsg.style.fontStyle = "italic";
              var utcTS = (new Date(Date.parse(msgs[i].datetime + " UTC"))).getTime();
              var localDT = (new Date(utcTS)).toLocaleString();
              fakeMsg.innerHTML = '<div class="from">' + msgs[i].username + '<span style="float: right; color: #A0A0A0; font-size: smaller;">' + localDT + '</span></div><div class="body"><div style="direction: ltr; text-align: left; color: #A0A0A0">' + msgs[i].message.replace(/\n/g, "<br>") + "</div></div>";
              messageList.appendChild(fakeMsg);
            }
            processMessages();
          } catch (e$0) {
            log("Error while getting history from server!", e$0);
            log("data", data.data);
          }
          CA_Settings.tts = wasTTS;
        }
      }, null);
    }
  }
  function getFunctionWithArgs(func, args) {
    return function() {
      var json_args = JSON.stringify(args);
      return function() {
        var args = JSON.parse(json_args);
        func.apply(this, args);
      };
    }();
  }
  var notificationSound = "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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr/+1JkkQ/xoxRS6GYTJiBhKhoAIwLAAAGkAAAAIAAANIAAAASqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7UmS9D/AAAGkAAAAIAAANIAAAAQAAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
  var alertSound = "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4jKQIiEAhAmZ9zXONKALIZ2jlSWJgjv/kTQ2MCo0CX9H+N3X//tUZOMAEQ4eU2lGLYQi48nVFe1CBPR7SaOs8hCYjyn01BbCkL2uJ3AQWABJpDTZ2erI4nhaW2rmJi0BUPbWHE+sssv0sjUUiyxOJQrzT9T+goMByQAT5o040p3awmNTzWvKAyho0/lvMPnqgcNGjZkJCwsKrYZMGtYt7mAwGZcO1xmy00aUWNMjVgoYE4l20NIlUGphqqgxcWBokhIky4vNk44uAsLCwZMxYXZWK8VFG/qF/8UVTEFNRTMuOTgu//tUZOeAETweVmiiUPwnI8oqNAeghRR7Q6Uk8ICUjylwcx7GMlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy45OC4yVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tUZOcAETQeVWjpPY4mo9rNHSexhOB7VaOM5TiXDyj0dJ7GVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tUROgFAT8XTDGDNKAsIbpaGCNig3Q7ACMEbih6hWEAYJhAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tUZO6P8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  var inoutSounds = {"door":{"in":"//OEZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAqAAAo+AAEBA4OFBQUHBwlJTAwMDk5RERETk5XV2BgYGhobm50dHR4eH19fYGBhoaLi4uPj5SUmZmZnp6ioqKnp6urs7Ozu7vExMTMzNDQ1dXV2trf3+Xl5enp7u7u8vL39/v7+/////8AAAA5TEFNRTMuOTlyAm4AAAAALFQAABRGJAMwzgAARgAAKPjb9uVMAAAAAAAAAAAAAAAAAAAA//N0ZAAMOJUEA6MMAAuwAi4/QRAAAQpMmTJp7ERd37s8mFgAABBAgQiOiJ/wIBgYG+iIjvxAAAEEif/EA3c/64AAAgCAIFAQcsHwQdgmD4P/lDkuD4IAgCAIAmD4P0ggCAIHBICH1AgCb+3/8uD7//h+QgmH+H5cHQGBbjlYPxA7DFWflwfD6S4IOWD/z9QY/xB+Q4Pn/0f/KBj/gg7Ln/qDH/Lh9bsL//PUZAIbwhdhK8xQASc0LrJfmJAChcGwpggQgwYDA7/VzuMOpOcP9+GmAhqAn/icvA1Sn/LZOJh+IGdHgAAPJ8lBwDeAxAkDRqgNEdA1Fd2vc0KibhEcAaRCEOAUMACN/qRNyugmHrBf0MXA3SBumDaH8rmCDOgaB8gONANHADhoN1g6oyf/ToLd1YGsFAaUuG/ASIhe4LBCNAumBJr/+pBvvwDnwDQ0DFCwCgwXIGQD4xAQZgUYVELhf//2//hjYQlEKkMFzsUyGFgvmiL1Hf////t//iUwvaG1jYFyjlCvjVIAOe5Dx0DNEEIIQAiBFxKJBKGxDSaQEQSGhGI/+G5cMpN8v+HHkQEiAf/G9GBxxfycOm4YyAHgd/kuVExzyKEXJgurfqQPOgRIjRSIxxAb+aPQzpADNjT/7OggRhERmymUCbJb/rTem/E3kGFlC5RtjiHgg5r///vuUioThmbppFxRuXD3//oMmpu38d5BDxeLR5JaKTeZ////bb/7/J8plI8umtOpnagXDqmt6IYO+KVZSgjoJkIyPSOAX2bNzM5LtlYWH1exFuLqsXmm//OUZCIUEgFPQ+esABE7/rLPzxAAmrY0kTr5th5JM6dMlu1jUm2dD0O42NjY8ytzzUmpt2uSaitBKJR2Dy8VKrWwkHoBICYPRmTmnaZw7n7PGw6gQgJgHw6VnO2z8Oja374dd33fcfw6/jn4v/uLdDf+a///////3O91FRNY42Nl63bodcta13P/////8OSNnO4Vq/+LfoBICVhVqpBsg2Q5TRUBTVrWD9etfXMm/a26f/9f/lYu///6/T0qVWKX//Tt/T////////////8pS8pf/////6dBSnbWoBOWG95N455nsuoUNrWKvHC+Hll3//OkZBcUNf9DA6egAZTD/q43TBADdQR3tdbaCjpHEDRwmOLD1RUQwoNDoIxcPBBBsE4ckkCUPQ4QJVGHEMOVWEi2KYilZzSUdTCfMOIEEXOsYIouKh81m41TIEhxYlGSh4Cp42e+Kj+OOe6/xxTzVfPXMUuvXzxc0y/DfSd///////83LjBlXw9Rcf1HP8X18LtMpKcs3WaIU2h4PAgU3f/s/xSCXaZsR3zcTII8YVP6xZtZP1z4nqUZkLqUY49WK7zK3+5TWdNjPdHXW7X2/zlK////////5S0Xv/b7tR3r////9WQxi0e6f//6//1RViRdv1/v2ThDAggkqVhEeGBgsfoDKEbucVCdsHGTRqlITRAUwKI4ycDEVKLEnGOO//PEZC0cUhNfK8w8ASeCTq7/m3gC0HYR7K+oxIxFmWGBCVzM3ahRX1nC5bC4KhDidduNKeXeO/XBoIQuiCFg0+N5hmhXzH3reTzPxCDLsyOcFWvcvdQd0v7Z3fScUBpqOO/nZCFk9MnMF7huW4z7ULU1q7trOyXs7Gh7nSkR/ujOwnKxK5my9rmsHNtf/6////5c3OVXx4n1e/+NYrWv//////z///////////cnBcEIQuRkUcel8RH9/SlP+pE6dMWta5rX+DaFLCZ3eGdDwNAgEAYEApNIAExSGKGhoxoBUwxEsfKMg54NgjjGxyyxB2y4jBIkw4JeNEYsB5rnKywEftDaPKY3jfxhpbWuBEw8ieE9exZmB+9tEj7979rZXv1iSWFukaW7/dKU3rD6uoMJUNLE8WNNsakB4zx76vu6enywssj6N6a172zLSuM/0prf1ffzWDypFolUUp8ua////wQ/5Uj+pe7/61kAgAP/9irbcUAmqOb5DaR0YMjT//PUZBccBhM8ysS8ACtDdnmNg3gAKYQuqsEPONuDwWIujKQQmKRTEEoj+OhEpAetvUYtpooQQKOh7fBJwIRQbgCkg0TCJyXYw1SrFCbsQHahpKlGfJYDhYmBTq9PoUuS9Iem2JYaaJKCiZaKInygL+2uCMTxIYDMXp3AVkh2ouCTplQ1iRTMdJ0QjEb4jLVv06gx31Fwxxsr760814D6OwqqLB2/xue+bfPtj////L353W3/////mvbed/////lFZXV+t5/+8ValVHaN//Hzr/////+Wb//7///////gy/9//ikj/vgKbqgrZLhzDoWCUyjU5/oYyEZLypnJslhIruLcw2PdmfxnkJ24PJIy8/amxqWDBe3gJ2RUsrZMr2JRQnq4ivnzM5Ro7KubsqImV8WXwKbvD0aNIM94LZi66QqFPqNEjvmR5J7Rp64lnxdxxevxnUsCsXMnxH1/F/zFrmu861unzXGv///9b+fWv////xrePj////+z6Sev1///b4jGEerE34CdV/Wql23+sZSCAgQQiNaDVa3NqbiMmYYVdgxvwEbOGYMicVMy5BpR//PEZCQcVgFVK808AacL8tb/mVEiAwY4hHtCNN5yG4WBEkmITbLJQTAzx1gq4ZOSZMrOzxl0yvmROOn4kwkZLhXSCYYn0lYEFXx0enFQTkthYhHi1Fhti82Pc4F9nUcakYlI4R9LpDpT+zG3W+e67z6h7v/gV8lh+sDtib1WhTczwWaDSkbd74ZI+Z6f/dNUOVSKFXQcyXhZrB1fNL/////5h3j///49Pu8OaNa2f/959cVjf//////////7c3mZr7j41T/////pwnyRiPaWhJeiHrO0vEwiyO0xCMJBIyT53N9oXH1BxVc0Er0wvc7RwekZtj6ID4YhEidEMRBEgCBUfkYhCcRImFCARIXaAE+gvHwxIBBGMLBV+0LoKQbC4dKg3kQsCoabf21WtDDXY3+bVLplCw0Izz2d0NNZzl3dn6K2x7ue706mIqJes1yUlIzXv0pQnMmf2sYZ//0uv/9fmj8iGg8U8/dLTtexpdqya7bBtupMyNMKXf0aMAUi//PUZBAcHc1DL8Y8AClT0nGFi2gAWQshXHMC89dPb+fIhJeheoafA/lakhXkqljSihxLmZVnWji7GyjTSKYupSns0DnUKYsfajJQhey5IiHEJ6nienyNhHizsIyEsUx5pNXHMjm6AyItjOtnXlVHZE/EjKmOhxps5OVDbO7HqEdX3a5Q1svKpGV4cBKiVoeXhhQoakdKm83KFFLllrSSNteVuGOR9O+gVtz+XRwK6keRkg6l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", 
  out:"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dKNrps1UHKZG3dJHMzqynaHZXIxZUmBGMaiWLI9TtcyHSQp1f0vtvWeFdHq5709ifkY1kRG1VFrp7ohCN6////0c0YHtKDt1vBXJhg23Xf3X/9fmT0zfaUglgWzvGdSWBARQlPqslxWtZb/Oeloqal+236jlGl39/Wp4LjpArQWWhJNgfMWqXb/////tESEr///YDhcru9jZRCcuUUUN0ig6BOnSLV3T//N0ZBIMpgNXF6QcAY/sArovQjgDiBQKHmRUxLLVjkMOZ1ZDkNo5x9jC1jnnz3VEXWy0Ze1PfnLM/7abtNONfP7Os7v513VNk6Z/193z0/////zGQnzDP//9DtfurIOECBBo0ASBcngNtdXiALtx2RSi8WyqRj3BI5ua5iaKYj0//93p9H////////////////9VRkv////9bHsyX////9f90jgiA4aR//OkZAAU9c1ze8w0AY1A8wJfjBACaHeIdVrWShOkktZEFgwwIVBRLcmXfYA21cs9cKSve+8czpRxDmJQuAqgvlFRCGWOUfzYYQe4vLOF4yMxlqQNRxnCGOA8mXTFi8keUaKclCRHORSkMApJdFT2Q5eHgPclS/L9T6K0EFdRomMYomh03WcL5aiZKSXorP3QqQst3EwYgD3LiR1NNRocZL////KJLmKaD0FX9///Zn/+pjnzE6YMYXScUCyv/H/3iHAoHAgFAAAAwFKEIcWj6ZCsupZ2Vaxa7fbwO5v+5//4skML/f/1Sd3////////R/IKqBh0lLnG2fLJGqItVJPlU8tWuRglm85JyJEjUkQUAonJHEWJEiWyaR00iRRlq//N0ZC4LQMcWAOMYABRQsiwNwxgA2vk+nlvVVVORR00ijM+kgEDQFBV3EpU6SUDJGdiWHdJIqRESwVyzxL///hoKhT2ZmZlJjVeqx9EghQUoGcmpcWATkGAmLDyx4sAgdIhoFniUJA0Goi4NaxhUsOQREoKrOlSwGErg0o7Iz0ksJAqEgqdELslDv8s//8e7/+WqTEFNRTMuOTkuNaqqqqqqqqqqqqqq//MUZBUAAADoAAAAAAAAAcgAAAAAqqqq"}};
  var bellIcon = "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94HHQwgJFQuvboAAAEPSURBVDjLpZXBSgMxFEVPBmmhlOpClKEbP8QuxG1/tP/QXTfiH7iTLtpdbKEqgvR28wJjTGbS6YVAePNyJnnvhjhJol1b4N3mD0Ddmq28vKRnSRNJ2JhYzOcW5YAvkgb23TWAYT6wnH9yiSP/ACPg2FGKCvgChnEw1qoAhuWsUn+J5SmXLwHuzgDuSoCvgCuAOcv9G4ya8guMrTElGgIH4Cq3w9kZsOCIWc7Yi4TvukbIXaR8eAPs6afr0KBw5KXBXA+Ys7XLJvAtVKAHUE1GANZcrjq2zbHnkcMuK5r+SVjoA9hkAPfAbVRHYmDqFj0mrlcFrNsWtVnBA3PgzsYT8A1Msy0veAIAPq1O467EE9tUEhXo3s4oAAAAAElFTkSuQmCC";
  var zzzIcon = "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAZiS0dEAP8A/wD/oL2nkwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94HHgcwOWMKgz0AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA20lEQVQ4y7XUMUoDURAA0BdttDCNpLLJFWJhI6ltvIddBKtgEYJ4C1u7VLFIm8raAyikMAELOzEaEDbNFIvouuF/B6b4u8NjZnb5/FPc4CVygb0caAMTXOXqso97bOfAjvGKdpyLH/JzE/ABS8wjW6V3lwEOc3TexjuesJMDHEd3Jzmw08BGFXv9nr/GLmZ4w0FN8LEKvI6iiz+muI26FQ6rClc1RjorPT9P3W8HH4HdpWLN2FeBZ+yngqPAvtBNxXqlvQ1SsaPSx5piKxWc1fmxGxuARc07NW+sAZr/UijoWUzlAAAAAElFTkSuQmCC";
  var chipIcon = "iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAAZiS0dEAAAAAAAA+UO7fwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB94IBQwJBtL1ixQAAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAABUUlEQVQ4y62VPU5CQRSFv5kgEaUwoonBBnagdroKY0MncRe4KbEzboDaxrABIBjUUOEfemwO+jJCwZOTvObNu1/uzJx7XpAk/moKjIAhMAYmQABKwBawB+wChbQwffEFPAJ3QBvoAP0EuA8cA2fAAbADxB+CfvUhqSupJakuaU1SSDuQFLxW97dd10qSZsBPL1xIKs8DLQCXJTWz0BnwQdKlpDJLytCWGcLkW28h5AAG195Ieou+zTbQCyFoWaBresA1MIq2RsdWyaupGcNon/XzdJd0OQDGEXjx819NgNfIihXt/tIKWBvAevRsVvNYJmsdoApsRQ/6ybxBX0IFz/feqoxdyxq74NRoAJs5z64BHAHFNByaOcLhXNJ9Gg554qs2L75CktjZgL3yOA1s2tn2qr7EU+AQqGQvNCz4BbwDT57zZwMjsA5s2xkVoJgWfgNFOVw1goaxDwAAAABJRU5ErkJggg==";
  var trashIcon = "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QobDCEpG1PeUwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAEGUlEQVR42u3cy4scVRTH8U9P90wGF+OMD6JIwAfqRjeaGUGII9mYhQvBf0F3bpTsBBeKGxeuXAXcBAV3hqAbUdEguNAoKPiIAR9RNJnBySiJOumHi7qdKZp+lJ1O2Y9zoKCp24+63z7n1u+cuvcSNtVWQ2WcL7A6ptdVwQ14HA38jmb4U3F4e/ECTuMY7kveGFYA3k04go3kfX/heEAs7nlHsI1W7giIBeDdmMJ2owNeQCwI73n8nMK2FRBHDy8gjgBeQBwBvJmHOAp4MwuxnWGMAl77uJAT26VnVmX/a4t4BPfiR5zp0n4Xruny2Ys4hb+7tC3hMZzDLwlsaR5Rpi3geuzp8dt78Qru79J2Ek/hbI/vbuA8/iwTYNkeuIPf+rSfS+1NzHW0ncWXyRN7WWvaQ3hQJ+vp6OVh9f8DUj+bCy0fAANgAAyAYQEwAE4PwEqA7cmqMghgDXfiEJYxH9zMJxaHEptar0ykhnU8nRL673ECL+HSDMM7jIdxG77Dy/iwM2Oq4G68JauxtVLq9K6s/FSW7ZGVprqVuY6n9rKsXXp7J3c9/+DtxKqSD+EqDspqaou58F7FMzMayst4NjFoc1qQVYoOJmaXG+awHysdX7KEe8zmc4edNJQtdZxfyUOdy7nrdYlwN2vNIMB6Ct1OW0isKp134X7F1VkESO8JTXMhpCMTCYD/dbhoBsBi8C52gVXX/1lIAMx52Reyp2t5O5/ONwJgf2ukbOgENmXPgDfxUTo/dgBrYxjC3+A5PJqE7KmUPn09jnJqHDOMBr7CtylCmrlc1DQBrKbjas9uaP/O1fT6xrDDw7AAV2RzUdZxrTFfyzEA3nYac9/EVhkAqwneYdzeJ3+epJz3gfT6qN4zI0YKcD9utVv6mmRbSH1ZxWtlyJgGPsVPspKPKfDAH/DJMNlObUiAx9LrdVnhcVJz6ib+wAepT/UyAEqD7VG8PsE3kE6nqA/zwajG7D5zKVUHhowJGRMyJmRMyJiQMSFjQsaEjAkZEzImZEzImJAxIWNCxoSMCRkTMiZkTMiYHlaZURkzNwoPnO9436zImJoCMyKKAFyWrZe4kLtbTbuMae9tM9A5igC8BQ/hjY6QHXo+yQTYPA6kvl/xGHgznsRaGnArptcqqY9reCL1/YpDuJbuui/i1aSZNoZV7mNstRS2BxK8tSISraiMWcSDsgV3Z2RTbi9NYdguY59sA6CFotTzqnzQe/elY1p31C2qJpqdAFuyrYZ3CorjWc6hdxKrVh5EM4njLWGDbEu2j1czD7CB9/G57rujhe1630m815ZweaW9jV9l+zgvpUG0Gswug9vEx7IV65+1PbDS5UZxh2xB8apsWees1wybacxre97pvISr9BCTVT12qZhRaxnz5RYTa/8C9VqFkX0/YCwAAAAASUVORK5CYII=";
  var exportIcon = "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QobDCEDwOgXhQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADUklEQVR42u2dTWsTURSGn5lOrEoJVYsff0AqUhHEreBW40IR/FiJKze6cV2NuhFdiFgQXLgQf0ARXIk7t3UhLYp/QBTFEksbmibjYk4kxHSMucn96JwXhtAmTU6fOfecc++cuYmwoxIQ459aQMPkDSILRk4CN4EZDwEuAQ+BZTxVCbgH/ACaHh4/gUdykr3UODAvxqaeHkYQY1STwBXg9iAQEwcG14AFYMXBZ1c2ifttiAB3/icmugC4AFwWI1OLoeRlF7waUDaF6ALgihhXd1CydOo5cNUUoqsYmDr63E6I0wKxZhITi5xEGsB9U4hFz8LLMlQHhqhljCFEBWgIUQEaQlSAhhAVoCHEpMCgJoBdspjQrTUpccgptleBapEBHpPpXd6cvJQzYzkMxEUGWAZO9vG6U3klYJEBDpIDWt1/U5Qk0iJbvq8N+42L4oENsmsfMNi1mRjYAM4UFWC7PKkOOOrGgRdF9sBOT3QaRFUKUAEqQAWoUoAKUAH2rW3ADux0km05gBGwBzgnj5ECHGwadR64AUz5BjEEgBGwl2xR87pvEENJIjFwwEeIIWVhLyGOejVmA7jI8DqxOiECPAG+465ZaeQA273Io/JE5xCTnMA9JsZGjkfIPmB7DsQImAO+uYDYC+AYWe9cBTgC7HQIMQH2AwdzPPGaQL4FfLUNMenhedPAXeAE2fVP14km/sdzU8AF+XnWticmPbyvIvCmAsrQZeCseOBjiYlOzm4sw2UiwHn9buAScBqL13q6AbaAz7i5BcFU68Ai8H4Emb9vgE3gNfBOhsFGIPDqwBuJ3R9dxsBUDJjtysKuEsmYZNhDYkcevCrwwfZJTzYpfpeAT/IPuJ4pzQBPgaO+wcsrpFMxxvUQXpfMWvcRXmiLCd7BswGw1+2ur+T3wcML0QO9gmdjNWaYWgXe+gQvJIBrHXWeN/BCAdiUwn7eN3ghAEzJGiOfAV9sTtG2kgf+kiP10bgQAKY+G6e9MQpQASpABahSgApQASpAlQJUgApQAaoUoAIMSC7WA/M2vPFVk2zSseYCYD8b3vimCeB4rxHrAmC/G94EEe4Sn4zRJPK3RrbhjWPVyJo5W6P2QNMNb3zVIvAAaNi6faHE1iqZ/nyNxm/UEhZ+/DhJcwAAAABJRU5ErkJggg==";
  var meetIcon = "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QobDCAcVPsrMQAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADVklEQVR42u2bPU9UQRSGH5d1DR/R8BElJnwEaNDE0Bgbo7KFJlSYKDGhoqCi8EfQGmyt+BtLZyJWttCJhAQKtzDYuKCAazObENyLrHvOzLnMvMkJBNi55z73zMx7z71AUlJSUlJSUlJSUlJSUuvqAO4Dy8AnoA78cN8vu991JEx/6wow54BdJObcZ5KAXmC9BXiNWHefjVr9wMF/wGvEgRsj2vVuow14jdiIdV1cEoDXiKXY4HUKwmtEZ7tJFXIE8LHCmNMxAbwH/BQe80VMRvcR8Bn4LTiFd2IyumPAWpsW5mwcxWR0rwLPhKvQZAVqGt1x4Spcjc3oloSrcCZGo3sX2BQC2GkJni+je0cIoMidiKQPnFa4KM3GlPCCm8A7awA1TGmzMXfahHgIPAFOrK1/OwpTOMtmXAc+XLZ+4JECwCOPRj2qCtS4VQyuVQWAq0SkGQWAMzEBNNnwzJtSy934vXABuNlGZXYDz90mM28VomY35nRPsAK8AiaAniY3BQX38wn3d5Umx5qMqR9YAp4K9wO/AUWrEPPQka4Dr/OwLkoYXakuTLMYiGGDGleqwDqwEgPAa66L8t51VExUYZ7eDzkBvgJ7wEO32Ug2B74DH9NUbi9KoU/upTOq3YpGV/rB0ukoh4Q3eSYZTaOrVYWVUPCKzpRKT6kso6tZhT2tnLjUM5EloE/hwvRlNBV+AVvAF+RfOHrgu/oGFCrvIhZDqwq9N3FXPABc8bwWFi5T9YWowtu+1sBFj5W+mLEW7imsg1M+TqjksfrOM7oaXZo3PgCWAwAse5rGWz4AVgIAzDK6km9sNUK10doTAN55RldjGvdrbiLezeY/jr0HvHVf60LHGdQEGPKJ1ryn3XhYC2ABWAgIcCEj77rwcUa1AA4SXj5yGNMCOGUAYLMcDoWn8YgWwLIBgGUPG8mQFsBZAwBnPWwktzQAFl0HJLTGM4yu5EbSqwHwBnaknUuXBsBBQwC1cylqABw2BFA7l2MNgKOGAGrnUtMAOGYIoHYu+xoARwwB1M6lqgFwyBBA7Vx2NQbdJlwf8GxsW7iKrVagpf8z680jwC5DALvyCNDSC9nFPAI8NgTwOI8Aa4YA1vIIcN8QwP08AqwaAljNI8BdQwBN5PIHg3zaXDzmQtAAAAAASUVORK5CYII=";
  var reloadIcon = "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";
  var betaIcon = "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QobDCYruhwpuAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAADzklEQVR42u2c30sVQRTHP2pmKWkhUhZGJv1OSsoC6TdFP6Coh3qIiCh60IcgfI9+/AlFQRlUFPSDCEowSqMog4qyopCMSCJSMzXT1Kywh9mL3sjuPbt3793ZnS/M29kz7GdnZ8+cPTNgZGRkZGRklBglJbj/NGAlUATMA2YCY4EsYAzwG+gD2oFm4C3wCqgFngD9QX1wS4GzQCcwYLN1AKeB+UECNweodABtuHYNmOx3eKXADxfghdpXYKMfwSUDFS6CG9p+ATv8BvB4nOCF2k9gtV/g7YszvFBrBrJ1h5cPfE8QwAHgmO4AryQQ3oD1wdJ2FOZZE7r0pl8Au6yQJNUKqlc5eBilugI8aONmTwIpEcIgqc+rugJ8KrzRy1EuK88J/TboCC+0hpWEHflR+i4WAuzSEeAy4U1eF/geLfTterIh2aX1rkSPBLYpQt/tOgIsENpL5qkpQt8fdASYJ7T/JLBdLvRdqyPAXKF9m8B2p9D3LR0/Iq+FE/2EKP0uEvr9aGPO9MQIzBLa90RpVy70e8oKp7RTh3CkpEXhc6pwadhm40F6Rr1CgNG8ZieEPsvRWNIkQqQl3HjhQ2kARuoMULrgj6QjQn8b0FyxBDgKaBX4qsIHiiXA3ch+KM02AMP1QODnDD5RrAAWCP2UJOJmkz38IDYL7Z8ZgOFaI7TPNgDDVSi032rmwHBJ62haraDbALT03oavh0C6ATiYTbHzL7gG9e8k8ACLsV+VcFtniLEMpG84gFgDZAQdYAHOCpTuA5lBz8aU4azI6DGqxiawAAEuBQmiGwDTgboYQMwMKkBQv0sbHUKsRoNstVsAAaajynedQLwQZICgam8+O4S4P8gAAeYCLQ4A9qN+1AcWIMAsoMkBxDriULngZYAAM1DFSXYh7g06wBBEuyPxDYnfsZpwgKHXudUmxCVOOvZyRlqiemAd0G3j2k1mBA5qm43+7xqA4boj7L/JAAzXFmH/fQZguHKQ76kL/EdkqDqF9t+CArAQuAmsj2CXL/Tb6PdXOBd1ZEBo+1g9/y8LPiTsv8KvADNQuz67/3HNxWFWEIuRlxhv9xvAZGBPFGvcKmAhal/xJFRddJew7x7U5kjfAFwLvCTgxwI4ARjPYwK6rJHrK4A5DtNTklbm14RqkRWbuQnvvJfjtVh8hUuALy7Bq7Q+PL4GCDANeB5jeBXACK+vGGIZSKcCh23Edn+3Fi/Ge/FMJkwEjqJOaJOmqg7g4sbDJPRSGirzvAJYYK17x6F2NPWi0vrvUKdbVgP30HTLq5GRkZGRkZGRy/oDQ1/zmPlk7GAAAAAASUVORK5CYII=";
  var notBetaIcon = "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";
  var specialEventIcon = "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";
  var smileys = {":)":"https://www.waze.com/forum/images/smilies/icon_e_smile.gif", ":D":"https://www.waze.com/forum/images/smilies/icon_e_biggrin.gif", ";)":"https://www.waze.com/forum/images/smilies/icon_e_wink.gif", ":(":"https://www.waze.com/forum/images/smilies/icon_e_sad.gif", ":o":"https://www.waze.com/forum/images/smilies/icon_e_surprised.gif", ":?":"https://www.waze.com/forum/images/smilies/icon_e_confused.gif", ":S":"https://www.waze.com/forum/images/smilies/icon_e_confused.gif", "8-)":"https://www.waze.com/forum/images/smilies/icon_cool.gif", 
  ":x":"https://www.waze.com/forum/images/smilies/icon_mad.gif", ":P":"https://www.waze.com/forum/images/smilies/icon_razz.gif", ":p":"https://www.waze.com/forum/images/smilies/icon_razz.gif", ":|":"https://www.waze.com/forum/images/smilies/icon_neutral.gif", ":lol:":"https://www.waze.com/forum/images/smilies/icon_lol.gif", "=D":"https://www.waze.com/forum/images/smilies/icon_lol.gif", "oO":"https://www.waze.com/forum/images/smilies/icon_eek.gif", ":shock:":"https://www.waze.com/forum/images/smilies/icon_eek.gif", 
  ":oops:":"https://www.waze.com/forum/images/smilies/icon_redface.gif", ":\u00b0":"https://www.waze.com/forum/images/smilies/icon_redface.gif", ":cry:":"https://www.waze.com/forum/images/smilies/icon_cry.gif", ":'":"https://www.waze.com/forum/images/smilies/icon_cry.gif", ":evil:":"https://www.waze.com/forum/images/smilies/icon_evil.gif", ">:(":"https://www.waze.com/forum/images/smilies/icon_evil.gif", ":twisted:":"https://www.waze.com/forum/images/smilies/icon_twisted.gif", ">:)":"https://www.waze.com/forum/images/smilies/icon_evil.gif", 
  ":roll:":"https://www.waze.com/forum/images/smilies/icon_rolleyes.gif", "\u00b0\u00b0":"https://www.waze.com/forum/images/smilies/icon_rolleyes.gif", ":!:":"https://www.waze.com/forum/images/smilies/icon_exclaim.gif", ":?:":"https://www.waze.com/forum/images/smilies/icon_question.gif", ":idea:":"https://www.waze.com/forum/images/smilies/icon_idea.gif", ":arrow:":"https://www.waze.com/forum/images/smilies/icon_arrow.gif", "->>":"https://www.waze.com/forum/images/smilies/icon_arrow.gif", ":mrgreen":"https://www.waze.com/forum/images/smilies/icon_mrgreen.gif", 
  "^^":"https://www.waze.com/forum/images/smilies/icon_mrgreen.gif", ":geek:":"https://www.waze.com/forum/images/smilies/icon_e_geek.gif", "B|":"https://www.waze.com/forum/images/smilies/icon_e_geek.gif", "ugeek":"https://www.waze.com/forum/images/smilies/icon_e_ugeek.gif", "B|-":"https://www.waze.com/forum/images/smilies/icon_e_ugeek.gif", "xD":"https://s3.amazonaws.com/tapatalk-emoji/emoji38.png"};
  initializeWazeObjects();
}
var CAscript = GM_addElement('script', {
  textContent: "" + run_CA.toString() + " \n" + "run_CA();"
});


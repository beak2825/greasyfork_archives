// ==UserScript==
// @name           Der Leistungsschutzrecht-Warner
// @name:de        Der Leistungsschutzrecht-Warner
// @namespace      tfr
// @description    Warns on pages supporting the extended copyright for press publishers with a red bar. Uses the blacklist from http://leistungsschutzrecht-stoppen.d-64.org/.
// @description:de Warnt auf Seiten mit einem roten Balken, falls diese das Leistungsschutzrecht unterstützt. Nutzt die Blacklist von http://leistungsschutzrecht-stoppen.d-64.org/.
// @author         tfr (https://github.com/t-fr/)
// @license        CC0; https://creativecommons.org/publicdomain/zero/1.0/
// @license        MIT license; https://pastebin.com/raw.php?i=4TMeeUXC
// @compatible     firefox Works with Firefox and Greasemonkey
// @compatible     chrome Works with Chrome and Tampermonkey
// @compatible     opera Works with Opera and Tampermonkey Beta or Violent monkey
// @oujs:author    tfr
// @include        *
// @version        4
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/1194/Der%20Leistungsschutzrecht-Warner.user.js
// @updateURL https://update.greasyfork.org/scripts/1194/Der%20Leistungsschutzrecht-Warner.meta.js
// ==/UserScript==

/* This script is dual-licensed under CC0 and the MIT license.
 * You can choose which one you want to use.
 * CC0 license: http://creativecommons.org/publicdomain/zero/1.0/deed.en
 * MIT license: https://pastebin.com/raw.php?i=4TMeeUXC
 *
 * Dieses Skript steht sowohl unter CC0 als auch unter der MIT-Lizenz.
 * Sie können sich aussuchen, welche Lizenz Sie nutzen.
 * CC0-Lizenz: http://creativecommons.org/publicdomain/zero/1.0/deed.de
 * MIT-Lizenz: https://pastebin.com/raw.php?i=4TMeeUXC
 */

/* Version 4: Replaced for-each-loop, works now also with Opera and Violentmonkey
 * Version 3: Update license information
 * Version 2: update metadata
 */

/* Einstellungen */
/* Wie der Titel geändert werden soll (Text vorher und nachher) */
var TitleTextBefore = "(LSR) ";
var TitleTextAfter = "";
/* Rote Box links oben einblenden? Welcher Inhalt? */
var AddRedBox = true;
var RedBoxContent = "Leistungsschutzrechtsunterstützer";
/* Rote Box in Frames anzeigen? */
var AddRedBoxInFrames = false;

/* ================================================================================ */

/* Frage das Datum der letzten Aktualisierung ab */
var LastRefresh = GM_getValue("LastRefresh", 0);

/* Frage das heutige Datum ab */
var HeuteRaw = new Date();
var Heute = (HeuteRaw.getFullYear() * 10000) + ((HeuteRaw.getMonth() + 1) * 100) + (HeuteRaw.getDate());

/* Falls noch nicht heute abgerufen, rufe Blacklist ab */
if(LastRefresh != Heute) {
  GM_xmlhttpRequest({
    method: "GET",
    url: "http://leistungsschutzrecht-stoppen.d-64.org/blacklist.txt",
    onload: function(response) {
      if(response.status == 200) {
        GM_setValue("Blacklist", response.responseText);
        GM_setValue("LastSuccessfulRefresh", Heute);
      }
    }
  });
  GM_setValue("LastRefresh", Heute);
}

/* Rufe gespeicherte Blacklist ab */
var Blacklist = GM_getValue("Blacklist", "");

/* Wandle Blacklist in Array um */
var BlacklistA = Blacklist.split(",");

/* Stelle fest, ob Seite in Blacklist ist */
var IsInBlacklist = false;
for (var i = 0; i < BlacklistA.length; i++)
{
  if(window.location.host == BlacklistA[i] || window.location.host.indexOf("." + BlacklistA[i]) > -1) {
    IsInBlacklist = true;
  }
}

/* Falls Seite in Blacklist */
if(IsInBlacklist) {
  /* Füge (LSR) dem Titel hinzu */
  document.title = TitleTextBefore + document.title + TitleTextAfter;
  if(window.localStorage.getItem("tfrLSRWarnElementClosed") != "true" && AddRedBox && (AddRedBoxInFrames || window.top.location.href == window.self.location.href)) {
    var WarnElement = window.document.createElement("div");
    var WarnCloseLink = window.document.createElement("span");
    WarnCloseLink.appendChild(window.document.createTextNode("\u2612"));
    WarnCloseLink.setAttribute("onclick", "javascript:window.document.getElementById(\"tfrLSRWarnElement\").setAttribute(\"style\", \"display:none;\"); window.localStorage.setItem(\"tfrLSRWarnElementClosed\", \"true\"); return false;");
    WarnElement.appendChild(WarnCloseLink);
    WarnElement.appendChild(window.document.createTextNode(" " + RedBoxContent));
    WarnElement.setAttribute("id", "tfrLSRWarnElement");
    WarnElement.setAttribute("style", "position:fixed; top:0px; left:0px; z-index:999999; font-family:\"Trebuchet MS\", sans-serif; font-size:7pt; color:black; background-color:red; opacity:0.8; padding:2px; cursor:default;");
    window.document.getElementsByTagName("body")[0].appendChild(WarnElement);
  }
}
// ==UserScript==
// @name           WME Language Forcer
// @name:fr        WME Language Forcer
// @namespace      https://gitlab.com/WMEScripts
// @description    Script to redirect to your language automaticaly
// @description:fr  Ce script vous redirige vers votre langue définie automatiquement
// @match          https://editor-beta.waze.com/*editor*
// @match          https://beta.waze.com/*editor*
// @match          https://www.waze.com/*editor*
// @match          https://editor-beta.waze.com/*editor/*
// @match          https://beta.waze.com/*editor/*
// @match          https://www.waze.com/*/editor/*
// @version        2019.08.15.01
// @author         tunisiano187 '2018
// @license        MIT/BSD/X11
// @compatible     chrome firefox
// @supportURL      mailto:incoming+WMEScripts/WME-language-forcer@incoming.gitlab.com
// @contributionURL http://ko-fi.com/tunisiano
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/370408/WME%20Language%20Forcer.user.js
// @updateURL https://update.greasyfork.org/scripts/370408/WME%20Language%20Forcer.meta.js
// ==/UserScript==

    ///////////////////////////////////////
    //  Verification de la mise à jour   //
    ///////////////////////////////////////
    var WMElanguageforcerVersion = GM_info.script.version;
    var WMElanguageforcerUpdateNotes = "Nouvelle version de WMElanguageforcer v" + WMElanguageforcerVersion + " : Adaptation to the new WME design";
    if (localStorage.getItem('WMElanguageforcerVersion') === WMElanguageforcerVersion && 'WMElanguageforcerVersion' in localStorage) {

    } else if ('WMElanguageforcerVersion' in localStorage) {
        alert(WMElanguageforcerUpdateNotes);
        localStorage.setItem('WMElanguageforcerVersion', WMElanguageforcerVersion);
    } else {
        localStorage.setItem('WMElanguageforcerVersion', WMElanguageforcerVersion);
    }

    ///////////////////////////////////////
    //  Début du script                  //
    ///////////////////////////////////////

var language = "";
var ts = Math.round((new Date()).getTime() / 1000);
if(window.location.hash == ("#reset-WME-prefered-language")) {
    localStorage.removeItem('WME-prefered-language');
    alert("Language resetted");
    window.location.href = "https://www.waze.com/editor/";
}
else if($(".not-found")[0]) {
    if ('WME-prefered-language-last-refresh' in localStorage){
        var prevts = localStorage.getItem('WME-prefered-language-last-refresh');
        if(Math.round(ts-5)>prevts) {
            window.location.href = "https://www.waze.com/editor/#reset-WME-prefered-language";
        }
    }
  }
else if('WME-prefered-language' in localStorage) {
    language = localStorage.getItem('WME-prefered-language');
  }
else
{
    language=prompt("Wich language do you want to use ? (ex:fr, de, ..)", I18n.locale);
    language=language.toLowerCase();
    localStorage.setItem('WME-prefered-language',language);
}
function showLang() {
    if($(".user-name")) {
        $('<a href="https://www.waze.com/editor/#reset-WME-prefered-language">(' + language.toUpperCase() + ')</a>').appendTo(".user-name");
    } else {
        setTimeout(showLang, 500);
    }
};
setTimeout(showLang, 500);
if ((location.pathname.indexOf("/" + language + "/editor") !== 0 && location.pathname.indexOf("beta") === 0) && location.pathname.indexOf("/user/editor") == -1 && location.pathname.indexOf("beta") === 0) {
  setTimeout(function() {
      var fullpath = window.location.pathname+window.location.search;
      while(fullpath.substring(1,7) != "editor")
      {
          fullpath = fullpath.substring(1);
      }
      //localStorage.setItem('WME-prefered-language-last-refresh',ts);
      if(!$(".recaptcha-container")[0])
      {
          window.location.replace = window.location.replace('https://beta.waze.com/' + language + fullpath);
      }
  }, 1000);
}
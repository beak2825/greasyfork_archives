// ==UserScript==
// @name         Steam - Default language
// @version      1.4
// @description  Make sure you always see the steam page in your preferred language. You can configure the language in the language variable.
// @author       Royalgamer06
// @include      /^https?\:\/\/(store\.steampowered|steamcommunity)\.com.*/
// @run-at       document-start
// @grant        none
// @namespace    https://greasyfork.org/users/13642
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/19348/Steam%20-%20Default%20language.user.js
// @updateURL https://update.greasyfork.org/scripts/19348/Steam%20-%20Default%20language.meta.js
// ==/UserScript==

//SET YOUR LANGUAGE HERE
const strTargetLanguage = "english"; //bulgarian, czech, danish, dutch, finnish, french, greek, german, hungarian, italian, japanese, koreana, norwegian, polish, portuguese, brazilian, russian, romanian, schinese, spanish, swedish, tchinese, thai, turkish, ukrainian
const bStayOnPage = false; //true, false

//DO NOT TOUCH BELOW
this.$ = this.jQuery = jQuery.noConflict(true);
if (getURIParam("l") !== strTargetLanguage && !!getURIParam("l")) {
    window.location.search = setURIParam("l", strTargetLanguage);
} else {
    var cookie = document.cookie;
    var language;
    $("script[src]").each(function() {
        var match = this.src.match(/(?:\?|&(?:amp;)?)l=([^&]+)/);
        if (match) {
            language = match[1];
            return false;
        }
    });
    if (language === undefined) {
        language = (cookie.match(/steam_language=([a-z]+)/i) || [])[1] || "english";
    }
    if (language.toLowerCase() !== strTargetLanguage.toLowerCase()) {
        //ChangeLanguage(strTargetLanguage, bStayOnPage);
        $.post((location.hostname == "steamcommunity.com" ? "/actions/SetLanguage" : "/account/setlanguage"), { language: strTargetLanguage, sessionid: g_sessionID }, function() {
            if (location.hostname == "store.steampowered.com") {
                $.post("//store.steampowered.com/account/savelanguagepreferences", {"primary_language": strTargetLanguage, "secondary_languages[]": strTargetLanguage, "sessionid": g_sessionID }, function() {
                    if (!bStayOnPage) location.href = location.href.replace(/l\=[a-zA-Z]+&?/, "");
                });
            } else {
                if (!bStayOnPage) location.href = location.href.replace(/l\=[a-zA-Z]+&?/, "");
            }
        });
    }
}
function getURIParam(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1).toLowerCase()),
        sURLVariables = sPageURL.split("&"),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}
function setURIParam(keyString, replaceString) {
    var query = decodeURIComponent(window.location.search.substring(1).toLowerCase()),
        vars = query.split("&"),
        replaced = false,
        i;
    for (i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == keyString) {
            vars[i] = pair[0] + "="+ replaceString.toLowerCase();
            replaced = true;
        }
    }
    if (!replaced) vars.push(keyString.toLowerCase() + "=" + replaceString.toLowerCase());
    return vars.join("&");
}
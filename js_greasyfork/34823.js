// ==UserScript==
// @name            Retour à l'ancienne interface Youtube
// @namespace       https://www.youtube.com/
// @version         1.2.4
// @description     Sets de Cookie pour chargement ancienne interface Youtube 
// @copyright       Okaïdo53
// @author          Okaïdo53
// @Secure          Okaïdo53
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @compatible      Safari
// @icon            https://www.youtube.com/yts/img/yt_1200-vfl4C3T0K.png
// @iconURL         https://www.youtube.com/yts/img/yt_1200-vfl4C3T0K.png
// @defaulticon     https://www.youtube.com/yts/img/yt_1200-vfl4C3T0K.png
// @icon64          https://www.youtube.com/yts/img/yt_1200-vfl4C3T0K.png
// @icon64URL       https://www.youtube.com/yts/img/yt_1200-vfl4C3T0K.png
// @match           *://www.youtube.com/*
// @exclude         *://www.youtube.com/tv*
// @exclude         *://www.youtube.com/embed/*
// @exclude         *://www.youtube.com/live_chat*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @homepage        https://greasyfork.org/fr/scripts/34823-retour-%C3%A0-l-ancienne-interface-youtube
// @homepageURL     https://gist.github.com/Okaido53/668bd6649fab779b130c7eaaf2e6986c
// @supportURL      https://productforums.google.com/forum/#!home
// @contributionURL https://www.paypal.com/
// @run-at          document-start
// @run-at          document-end
// @run-at          document-body
// @run-at          document-end
// @run-at          document-idle
// @run-at          context-menu
// @connect         <value>
// @nocompat        Chrome
// @noframes
// @grant           none
// @grant           GM_setClipboard
// @grant           unsafeWindow
// @grant           GM_deleteValue
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           window.focus
// @grant           window.close
// @unwrap
// @license         https://creativecommons.org/licence/by-nc-nd/4.0
// @downloadURL https://update.greasyfork.org/scripts/34823/Retour%20%C3%A0%20l%27ancienne%20interface%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/34823/Retour%20%C3%A0%20l%27ancienne%20interface%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function start() {
        var cookie = getPref(),
            pref = "f6=8";
        if(cookie === "fIsAlreadySet") {
            return;
        } else if(cookie !== "noPref"){
            for(var i = 0; i < cookie.length; ++i) {
                pref = pref + "&" + cookie[i].key + "=" + cookie[i].value;
            }
        }
        changePref(pref);
    }
    
    function changePref(values) {
        var d = new Date();
        d.setTime(d.getTime() + (100*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "PREF=" + values + ";" + expires + ";domain=.youtube.com;hostonly=false;path=/";
        location.reload();
    }

    function getPref() {
        var cookie = document.cookie,
            splitC = cookie.split(";");
        for(var i = 0; i < splitC.length; ++i) {
            if(splitC[i].trim().indexOf("PREF") === 0) {
                if(splitC[i].trim().indexOf("f6=8") > -1) {
                    return "fIsAlreadySet";
                }
                var c = [],
                    splitValues = splitC[i].substring(5).split("&");
                for(var k = 0; k < splitValues.length; ++k) {
                    var splitV = splitValues[k].split("=");
                    if(splitV[0] !== "f6") {
                        var kv = {};
                        kv.key = splitV[0];
                        kv.value = splitV[1];
                        c.push(kv);
                    }
                }
                return c;
            }
        }
        return "noPref";
    }
    start();
})();


(function() {var css = [
	    "@namespace url(http://www.w3.org/1999/xhtml);",
        "div#ticker.yt-alert.yt-alert-default.yt-alert-info                                                          {display:none !important;}"
        ].join("\n");
        if (typeof GM_addStyle != "undefined") {
	    GM_addStyle(css);
        } else if (typeof PRO_addStyle != "undefined") {
    	PRO_addStyle(css);
        } else if (typeof addStyle != "undefined") {
    	addStyle(css);
        } else {
	    var node = document.createElement("style");
	    node.type = "text/css";
    	node.appendChild(document.createTextNode(css));
    	var heads = document.getElementsByTagName("head");
	    if (heads.length > 0) {
    	heads[0].appendChild(node);
     	} else {
	    // no head yet, stick it whereever
    	document.documentElement.appendChild(node);
    	}
        }
        })();

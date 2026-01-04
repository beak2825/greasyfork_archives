// ==UserScript==
// @name         Ciemny Motyw dla td2 (SWDR4)
// @namespace    https://greasyfork.org/pl/scripts/416034-ciemny-motyw-dla-td2-swdr4
// @description  ciemny motyw dla td2.info.pl Autor RIVIO @2024
// @match        https://rj.td2.info.pl/*
// @match        https://rjdev.td2.info.pl/*
// @version      10.1 (Częściowo otwarty)
// @author       RIVIO @2024
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/416034/Ciemny%20Motyw%20dla%20td2%20%28SWDR4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416034/Ciemny%20Motyw%20dla%20td2%20%28SWDR4%29.meta.js
// ==/UserScript==
/*------------------------------------------------------------------------------*/
/*NIE MODYFIKUJEMY bez zgody autora (w celu naprawy zgłoś się do autora skryptu)*/

/*---------------------------  Skrypt  ----------------------------*/
(function() {var css = [
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
		document.documentElement.appendChild(node);
	       }
       }
    })();

/*----------------------------  Dzwięki  -----------------------------*/
 
    $("audio#chatPMAudioPlayer").replaceWith(`<audio id="chatPMAudioPlayer"><source src="https://www.dropbox.com/s/nj9cfdmbrcbngbp/Czat%20publiczny.flac?raw=1" type="audio/flac"><source src="https://www.dropbox.com/s/oauu6ysm0pghzoz/Czat%20publiczny.mp3?raw=1" type="audio/mp3"></audio>`); $("audio#chatDMAudioPlayer").replaceWith(`<audio id="chatDMAudioPlayer"><source src="https://www.dropbox.com/s/cqgpyv36theohpw/Czatprywatny.flac?raw=1" type="audio/flac"><source src="https://www.dropbox.com/s/p27vqrv24s52phs/Czatprywatny.mp3?raw=1" type="audio/mp3"></audio>`);
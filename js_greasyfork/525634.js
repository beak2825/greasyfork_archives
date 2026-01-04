// ==UserScript==
// @name         Ciemny Motyw TD2 v2 (SWDR4)
// @namespace    https://greasyfork.org/pl/scripts/416034-ciemny-motyw-dla-td2-swdr4
// @description  ciemny motyw dla td2.info.pl Autor Kapinitto @2024
// @match        https://rj.td2.info.pl/*
// @match        https://rjdev.td2.info.pl/*
// @version      1.0 (UNOFFICIAL)
// @author       Kapinitto @2024
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/525634/Ciemny%20Motyw%20TD2%20v2%20%28SWDR4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525634/Ciemny%20Motyw%20TD2%20v2%20%28SWDR4%29.meta.js
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
 
    $("audio#chatPMAudioPlayer").replaceWith(`<audio id="chatPMAudioPlayer"><source src="https://www.dropbox.com/s/nj9cfdmbrcbngbp/Czat%20publiczny.flac?raw=1" type="audio/flac"><source src="https://www.dropbox.com/s/oauu6ysm0pghzoz/Czat%20publiczny.mp3?raw=1" type="audio/mp3"></audio>`); $("audio#chatDMAudioPlayer").replaceWith(`<audio id="chatDMAudioPlayer"><source src="https://www.dropbox.com/s/cqgpyv36theohpw/Czatprywatny.flac?raw=1" type="audio/flac"><source src="https://www.dropbox.com/s/p27vqrv24s52phs/Czatprywatny.mp3?raw=1" type="audio/mp3"></audio>`); $("audio#signalBlockEAPAudioPlayer").replaceWith(`<audio id="crashAudioPlayer"><source src="https://www.dropbox.com/scl/fi/y93k4f87jbbw7lxg0ocgk/3333.flac?rlkey=o3xoej0w0k80i64pi5zwlpk50&st=yq2d8t7e&raw=1" type="audio/flac"><source src="https://www.dropbox.com/scl/fi/j4aikbl9j4bzymha0t9yz/3333.mp3?rlkey=y3h60wqvhf39zla4s6mb7a6w4&st=da39l5z9&raw=1" type="audio/mp3"></audio>`);
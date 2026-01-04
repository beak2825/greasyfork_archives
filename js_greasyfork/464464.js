// ==UserScript==
// @name AKIRA - Rampe custom V32
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A better rampe
// @author Pilz
// @license le tierquar
// @grant GM_addStyle
// @run-at document-start
// @match https://www.dreadcast.net/Main*
// @downloadURL https://update.greasyfork.org/scripts/464464/AKIRA%20-%20Rampe%20custom%20V32.user.js
// @updateURL https://update.greasyfork.org/scripts/464464/AKIRA%20-%20Rampe%20custom%20V32.meta.js
// ==/UserScript==

(function() {
let css = `
	#zone_page {
		background: #2b020242;
		background-image: url(https://wallpaperaccess.com/full/801087.jpg) !important;
		background-size: 100%;
	}
	
	.swiper-container {
		height: 100%;
		width: 100%;
	}
	
	
	#zone_gauche {
		display:none;
	}
	
	#zone_centre {
		top: 25px;
        left: 0px;
	}

	#zone_droite {
        background-image: none;
        background-color: rgba(0, 0, 0, 0);
        z-index: auto;
        left: 75%;
        top: 5%;
    }

	#main_cydive {
		top:-9%;
		display: none;
		z-index: 1;
		width: 370%;
		height: 120%;
		color: #fff;
		box-shadow: 0 0 10px #bb0205;
	}
	
	#main_cydive_carte .case {
		box-shadow: 0 0 4px #a70b0b;
		border:1px solid #f0f0f0;
	}
	
	#main_cydive_carte .case.personne {
		border: 2px solid red;
		display: flex;	
    }


	#main_cydive .commande {
		left:101%;
		width:24%;
		top: 90%;
		border-top:1px solid red;
		border-bottom: 1px solid red;
		border-left: 1px solid red;
		border-right: 1px solid red;
	}

	#main_cydive_logs {
		background-color: rgba(0, 0, 0, 0.5);
		left:96%;
		top:-8%;
		height:100%;
		width:60%;
		overflow-y:auto;
	}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

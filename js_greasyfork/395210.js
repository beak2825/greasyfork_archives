// ==UserScript==
// @name parici.Sopra.Steria.CSS
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description amelioration de l'affichage pleiades -
// @author CoStiC
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/395210/pariciSopraSteriaCSS.user.js
// @updateURL https://update.greasyfork.org/scripts/395210/pariciSopraSteriaCSS.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `


@import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');
@import url('https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap');
`;
if ((location.hostname === "parici.soprasteria.com" || location.hostname.endsWith(".parici.soprasteria.com"))) {
		css += `
			* {
				font-family: 'Roboto';
			}

		    ::-webkit-scrollbar {
		        width: 6px;
		    }

		    ::-webkit-scrollbar-thumb {
		        /*background: #666;*/
		        background: linear-gradient(to right, #6d6d6d 0%, #7e7e7e 12%, #999 25%, #696969 39%, #585858 50%, #363636 51%, #515151 60%, #585858 76%, #4b4b4b 91%, #444 100%);
		        border-radius: 3px;
		    }
		    ::-webkit-scrollbar-track {
		        background: #eee;
		        border-radius: 3px;
		        box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, .25);
		    }
			
			.cellDay.cellulePlanning {
				height: 58px !important;
				vertical-align: auto;
				position: relative;
			}
			
			.dayName {
				position: absolute;
				width: 100%;
				background: #FFF;
				top: 0;
				font-weight: bold;
			}
			
			.totalTable .cellulePlanning.lundi, .totalTable .cellulePlanning.samedi {
				border-left: 1px solid #757575 !important;
			}
			
			.totalTable .cellulePlanning {
				border-left: 1px solid #ccc !important;
				border-bottom: 1px solid #ccc !important;
			}
				
			.week .dayName{
				text-shadow: 0 1px 0 #fff, 0 -1px 2px rgba(0,0,0,.5);
				background: linear-gradient(to top, #bbb 0%, #ddd 100%);
			}
			
			.weekend {
				background: #ddd !important;
				background-image: repeating-linear-gradient(-45deg,transparent,transparent 2px,#bbb 5px,#ccc 5px) !important;
			}
			
			.weekend .dayName {
				background: none;
				color: #757575;
			}
			
		/* 	Body, [class^='PTitle'], [class*="Bandeau"], [class^='TableContainer'], [class^='RoleActive'], [class^='PWelcome'] {
				background: none;
			} */

		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

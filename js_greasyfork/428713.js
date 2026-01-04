// ==UserScript==
// @name        diep color theme
// @include	    *://diep.io/*
// @author      BLITZKRIEG
// @description a  color script for diep
// @connect	    diep.io
// @namespace   [SCRIPT]
// @version 1.3
// @downloadURL https://update.greasyfork.org/scripts/428713/diep%20color%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/428713/diep%20color%20theme.meta.js
// ==/UserScript==
'use strict';
let userdata = 0;
console.log("Getting User Information");
this.userdata = 1;
console.log("userdata" + userdata);
(() => {
	const script = document.createElement("script");
	script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
	document.head.append(script);
console.log("yo some shit boutta happen you should let the dev know lmao")
    script.addEventListener('load', () => {

        let index = 0;
 setInterval(() => {
            index += 1;


input.set_convar("ren_stroke_soft_color", true);
input.execute("ren_fps true");
input.execute("ren_solid_background false");
input.execute("ren_health_background_color 0x000000");
input.execute("net_replace_color 2 0x00fefc");
input.execute("net_replace_color 10 0x52307c");
input.execute("net_replace_color 15 0xff1818");
input.execute("net_replace_color 3 0x00fefc");
input.execute("net_replace_color 4 0xff1818");
input.execute("net_replace_color 6 0x39FF14");
input.execute("net_replace_color 5 0xA117F2");
input.execute("net_replace_color 9 0xff1818");
input.execute("net_replace_color 8 0xFAED27");
input.execute("net_replace_color 1 0x000000");
input.execute("ren_health_fill_color 0xFFA500");

           });
    });
})();
console.log("Script Sucess")
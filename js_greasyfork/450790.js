// ==UserScript==
// @name		WebAssembly integrator
// @namespace		https://greasyfork.org/en/users/954625
// @version		0.0.0.1
// @description		THIS IS NOT A SCRIPT IF YOU USE IT IT WILL DO NOTHING!!!!!!!!!!!!!!!!
// @author		ᎻueᎻаnаejistlа!
// @match		*://diep.io/*
// @run-at		document-start
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==
// #######################################################################################################################################################################
// ░██╗░░░░░░░██╗███████╗██████╗░  ░█████╗░░██████╗░██████╗███████╗███╗░░░███╗██████╗░██╗░░░░░██╗░░░██╗
// ░██║░░██╗░░██║██╔════╝██╔══██╗  ██╔══██╗██╔════╝██╔════╝██╔════╝████╗░████║██╔══██╗██║░░░░░╚██╗░██╔╝
// ░╚██╗████╗██╔╝█████╗░░██████╦╝  ███████║╚█████╗░╚█████╗░█████╗░░██╔████╔██║██████╦╝██║░░░░░░╚████╔╝░
// ░░████╔═████║░██╔══╝░░██╔══██╗  ██╔══██║░╚═══██╗░╚═══██╗██╔══╝░░██║╚██╔╝██║██╔══██╗██║░░░░░░░╚██╔╝░░
// ░░╚██╔╝░╚██╔╝░███████╗██████╦╝  ██║░░██║██████╔╝██████╔╝███████╗██║░╚═╝░██║██████╦╝███████╗░░░██║░░░
// ░░░╚═╝░░░╚═╝░░╚══════╝╚═════╝░  ╚═╝░░╚═╝╚═════╝░╚═════╝░╚══════╝╚═╝░░░░░╚═╝╚═════╝░╚══════╝░░░╚═╝░░░
//                 by ᎻueᎻаnаejistlа! for diep.io
// Youtube channel:
//	https://www.youtube.com/channel/UC4edUdWxLr7sFaPh4zqgXXw?sub_confirmation=1
//
// WHAT HAPPENED TO THIS SCRIPT?
//	The original author has discontinued operations by the name of ᎻueᎻаnаejistlа!, so this is a continuation of ᎻueᎻаnаejistlа's diep.io scripts.
//	If you still have the original ᎻueᎻаnаejistlа's Diep.io Multiboxing Script, congratulations, you've been upgraded to DIEP SCRIPT DELUXE+++. This
//	is a library that modifies the game code to provide core features for DELUXE+++, as well as other (planned) scripts.
//#######################################################################################################################################################################
var mouse = [0, 0]; var player = [0, 0];
var i = 0; const instant = WebAssembly.instantiate;
var WEBASSEMBLY = new Uint8Array(numberone.length + numbertwo.length);
WEBASSEMBLY.set(numberone); WEBASSEMBLY.set(numbertwo, numberone.length);
WebAssembly.instantiateStreaming = (r, i) => r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));
WebAssembly.instantiate = function(b, i) {
	i.b = { b:
		function(p, m, xory) {
			p = Math.floor(p); m = Math.floor(m);
			switch (xory) {
				case 0: player[0] = p; mouse[0] = m; break;
				case 1: player[1] = p; mouse[1] = m; break;
			}
		} }
	return instant(WEBASSEMBLY, i).then(function(w) { return w; }).catch(function(error) { throw error; });
};
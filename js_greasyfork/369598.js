// ==UserScript==
// @name           MathJax for VKontakte
// @namespace      http://www.mathjax.org/
// @version        0.02
// @description    Displays formulas using MathJax in VK messages
// @include        https://vk.com/im*
// @grant          none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/369598/MathJax%20for%20VKontakte.user.js
// @updateURL https://update.greasyfork.org/scripts/369598/MathJax%20for%20VKontakte.meta.js
// ==/UserScript==
//    ***********THIS WAS STOLEN FROM https://openuserjs.org/scripts/copyme/MathJax_for_Evernote  and slightly altered***********
// 0.02 -- some improvments from GmailTex - http://alexeev.org/gmailtex.html
// 0.01 -- this is just a modification of script from http://docs.mathjax.org/en/latest/dynamic.html



function va_lmj(){ 
    var co = 'MathJax.Hub.Startup.onload();' ; 
    var ch   = 
	' MathJax.Hub.Register.StartupHook("End Config",function(){'+
	'MathJax.Hub.Config({'+
	' showProcessingMessages: true,'+
	'delayStartupUntil: "onload",'+
	'tex2jax: {'+
	'  inlineMath: [ [\'$\',\'$\'], ["\\\\(","\\\\)"] ],' +
	'  processEscapes: true,'+
	'},'+
	'TeX: {'+
'Macros: {'+
'A:  "{\\\\mathbb A}",'+
'B:  "{\\\\mathbb B}",'+
'C:  "{\\\\mathbb C}",'+
'D:  "{\\\\mathbb D}",'+
'E:  "{\\\\mathbb E}",'+
'F:  "{\\\\mathbb F}",'+
'G:  "{\\\\mathbb G}",'+
'H:  "{\\\\mathbb H}",'+
'I:  "{\\\\mathbb I}",'+
'J:  "{\\\\mathbb J}",'+
'K:  "{\\\\mathbb K}",'+
'L:  "{\\\\mathbb L}",'+
'M:  "{\\\\mathbb M}",'+
'N:  "{\\\\mathbb N}",'+
'O:  "{\\\\mathcal O}",'+
'P:  "{\\\\mathbb P}",'+
'Q:  "{\\\\mathbb Q}",'+
'R:  "{\\\\mathbb R}",'+
'S:  "{\\\\mathbb S}",'+
'T:  "{\\\\mathbb T}",'+
'U:  "{\\\\mathbb U}",'+
'V:  "{\\\\mathbb V}",'+
'W:  "{\\\\mathbb W}",'+
'X:  "{\\\\mathbb X}",'+
'Y:  "{\\\\mathbb Y}",'+
'Z:  "{\\\\mathbb Z}",'+
'AA:  "{\\\\mathbb A}",'+
'BB:  "{\\\\mathbb B}",'+
'CC:  "{\\\\mathbb C}",'+
'DD:  "{\\\\mathbb D}",'+
'EE:  "{\\\\mathbb E}",'+
'FF:  "{\\\\mathbb F}",'+
'GG:  "{\\\\mathbb G}",'+
'HH:  "{\\\\mathbb H}",'+
'II:  "{\\\\mathbb I}",'+
'JJ:  "{\\\\mathbb J}",'+
'KK:  "{\\\\mathbb K}",'+
'LL:  "{\\\\mathbb L}",'+
'MM:  "{\\\\mathbb M}",'+
'NN:  "{\\\\mathbb N}",'+
'OO:  "{\\\\mathcal O}",'+
'PP:  "{\\\\mathbb P}",'+
'QQ:  "{\\\\mathbb Q}",'+
'RR:  "{\\\\mathbb R}",'+
'SS:  "{\\\\mathbb S}",'+
'TT:  "{\\\\mathbb T}",'+
'UU:  "{\\\\mathbb U}",'+
'VV:  "{\\\\mathbb V}",'+
'WW:  "{\\\\mathbb W}",'+
'XX:  "{\\\\mathbb X}",'+
'YY:  "{\\\\mathbb Y}",'+
'ZZ:  "{\\\\mathbb Z}",'+
'bA: "{\\\\mathbb A}",'+
'bB: "{\\\\mathbb B}",'+
'bC: "{\\\\mathbb C}",'+
'bD: "{\\\\mathbb D}",'+
'bE: "{\\\\mathbb E}",'+
'bF: "{\\\\mathbb F}",'+
'bG: "{\\\\mathbb G}",'+
'bH: "{\\\\mathbb H}",'+
'bI: "{\\\\mathbb I}",'+
'bJ: "{\\\\mathbb J}",'+
'bK: "{\\\\mathbb K}",'+
'bL: "{\\\\mathbb L}",'+
'bM: "{\\\\mathbb M}",'+
'bN: "{\\\\mathbb N}",'+
'bO: "{\\\\mathbb O}",'+
'bP: "{\\\\mathbb P}",'+
'bQ: "{\\\\mathbb Q}",'+
'bR: "{\\\\mathbb R}",'+
'bS: "{\\\\mathbb S}",'+
'bT: "{\\\\mathbb T}",'+
'bU: "{\\\\mathbb U}",'+
'bV: "{\\\\mathbb V}",'+
'bW: "{\\\\mathbb W}",'+
'bX: "{\\\\mathbb X}",'+
'bY: "{\\\\mathbb Y}",'+
'bZ: "{\\\\mathbb Z}",'+
'bbA: "{\\\\mathbb A}",'+
'bbB: "{\\\\mathbb B}",'+
'bbC: "{\\\\mathbb C}",'+
'bbD: "{\\\\mathbb D}",'+
'bbE: "{\\\\mathbb E}",'+
'bbF: "{\\\\mathbb F}",'+
'bbG: "{\\\\mathbb G}",'+
'bbH: "{\\\\mathbb H}",'+
'bbI: "{\\\\mathbb I}",'+
'bbJ: "{\\\\mathbb J}",'+
'bbK: "{\\\\mathbb K}",'+
'bbL: "{\\\\mathbb L}",'+
'bbM: "{\\\\mathbb M}",'+
'bbN: "{\\\\mathbb N}",'+
'bbO: "{\\\\mathbb O}",'+
'bbP: "{\\\\mathbb P}",'+
'bbQ: "{\\\\mathbb Q}",'+
'bbR: "{\\\\mathbb R}",'+
'bbS: "{\\\\mathbb S}",'+
'bbT: "{\\\\mathbb T}",'+
'bbU: "{\\\\mathbb U}",'+
'bbV: "{\\\\mathbb V}",'+
'bbW: "{\\\\mathbb W}",'+
'bbX: "{\\\\mathbb X}",'+
'bbY: "{\\\\mathbb Y}",'+
'bbZ: "{\\\\mathbb Z}",'+
'cA: "{\\\\mathcal A}",'+
'cB: "{\\\\mathcal B}",'+
'cC: "{\\\\mathcal C}",'+
'cD: "{\\\\mathcal D}",'+
'cE: "{\\\\mathcal E}",'+
'cF: "{\\\\mathcal F}",'+
'cG: "{\\\\mathcal G}",'+
'cH: "{\\\\mathcal H}",'+
'cI: "{\\\\mathcal I}",'+
'cJ: "{\\\\mathcal J}",'+
'cK: "{\\\\mathcal K}",'+
'cL: "{\\\\mathcal L}",'+
'cM: "{\\\\mathcal M}",'+
'cN: "{\\\\mathcal N}",'+
'cO: "{\\\\mathcal O}",'+
'OO: "{\\\\mathcal O}",'+
'cP: "{\\\\mathcal P}",'+
'cQ: "{\\\\mathcal Q}",'+
'cR: "{\\\\mathcal R}",'+
'cS: "{\\\\mathcal S}",'+
'cT: "{\\\\mathcal T}",'+
'cU: "{\\\\mathcal U}",'+
'cV: "{\\\\mathcal V}",'+
'cW: "{\\\\mathcal W}",'+
'cX: "{\\\\mathcal X}",'+
'cY: "{\\\\mathcal Y}",'+
'cZ: "{\\\\mathcal Z}",'+
'bfA: "{\\\\mathbf A}",'+
'bfB: "{\\\\mathbf B}",'+
'bfC: "{\\\\mathbf C}",'+
'bfD: "{\\\\mathbf D}",'+
'bfE: "{\\\\mathbf E}",'+
'bfF: "{\\\\mathbf F}",'+
'bfG: "{\\\\mathbf G}",'+
'bfH: "{\\\\mathbf H}",'+
'bfI: "{\\\\mathbf I}",'+
'bfJ: "{\\\\mathbf J}",'+
'bfK: "{\\\\mathbf K}",'+
'bfL: "{\\\\mathbf L}",'+
'bfM: "{\\\\mathbf M}",'+
'bfN: "{\\\\mathbf N}",'+
'bfO: "{\\\\mathbf O}",'+
'bfP: "{\\\\mathbf P}",'+
'bfQ: "{\\\\mathbf Q}",'+
'bfR: "{\\\\mathbf R}",'+
'bfS: "{\\\\mathbf S}",'+
'bfT: "{\\\\mathbf T}",'+
'bfU: "{\\\\mathbf U}",'+
'bfV: "{\\\\mathbf V}",'+
'bfW: "{\\\\mathbf W}",'+
'bfX: "{\\\\mathbf X}",'+
'bfY: "{\\\\mathbf Y}",'+
'bfZ: "{\\\\mathbf Z}",'+
'fA: "{\\\\mathfrak A}",'+
'fB: "{\\\\mathfrak B}",'+
'fC: "{\\\\mathfrak C}",'+
'fD: "{\\\\mathfrak D}",'+
'fE: "{\\\\mathfrak E}",'+
'fF: "{\\\\mathfrak F}",'+
'fG: "{\\\\mathfrak G}",'+
'fH: "{\\\\mathfrak H}",'+
'fI: "{\\\\mathfrak I}",'+
'fJ: "{\\\\mathfrak J}",'+
'fK: "{\\\\mathfrak K}",'+
'fL: "{\\\\mathfrak L}",'+
'fM: "{\\\\mathfrak M}",'+
'fN: "{\\\\mathfrak N}",'+
'fO: "{\\\\mathfrak O}",'+
'fP: "{\\\\mathfrak P}",'+
'fQ: "{\\\\mathfrak Q}",'+
'fR: "{\\\\mathfrak R}",'+
'fS: "{\\\\mathfrak S}",'+
'fT: "{\\\\mathfrak T}",'+
'fU: "{\\\\mathfrak U}",'+
'fV: "{\\\\mathfrak V}",'+
'fW: "{\\\\mathfrak W}",'+
'fX: "{\\\\mathfrak X}",'+
'fY: "{\\\\mathfrak Y}",'+
'fZ: "{\\\\mathfrak Z}",'+
'iso: "{\\\\simeq}",'+
'reals: "{\\\\mathbb{R}}",'+
'm: "{\\\\mathfrak{m}}",'+
'p: "{\\\\mathfrak{p}}",'+
'Sp: "{\\\\operatorname{Sp}}",'+
'SL: "{\\\\operatorname{SL}}",'+
'GL: "{\\\\operatorname{GL}}",'+
'Ass: "{\\\\operatorname{Ass}}",'+
'Aut: "{\\\\operatorname{Aut}}",'+
'End: "{\\\\operatorname{End}}",'+
'Gal: "{\\\\operatorname{Gal}}",'+
'Gr: "{\\\\operatorname{Gr}}",'+
'gr: "{\\\\operatorname{gr}}",'+
'Pic: "{\\\\operatorname{Pic}}",'+
'Supp: "{\\\\operatorname{Supp}}",'+
'Spec: "{\\\\operatorname{Spec}}",'+
'Proj: "{\\\\operatorname{Proj}}",'+
'eps: "{\\\\varepsilon}",'+
'dag: "{\\\\dagger}" '+
'},'+
	'  noErrors: {'+
	'    inlineDelimiters: ["",""],'+
	'    multiLine: true,'+
	'    style: {'+
	'      "font-size":   "90%",'+
	'      "color":       "red",'+
	'      "border":      ""'+ 
	'    }'+
	'  },'+
	'noUndefined: {'+  
	'  attributes: {'+
	'    mathcolor: "black",'+
	'  }'+
	'}'+
	'},'+	
 	'"HTML-CSS": { }'+
	'});'+
	'});';
    var s = document.createElement("script"); 
    s.type = "text/x-mathjax-config";
    var config = co + ch;
    if (window.opera) {s.innerHTML = config} else {s.text = config};
    document.getElementsByTagName('head')[0].appendChild(s);
    var s2 = document.createElement("script"); 
    s2.type = "text/javascript";
    s2.src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML';
    document.getElementsByTagName('head')[0].appendChild(s2);
}

if (typeof (typeof window.unsafeWindow == 'undefined' ? window : unsafeWindow).MathJax == 'undefined') {
    va_lmj();
}


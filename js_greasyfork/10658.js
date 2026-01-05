// ==UserScript==
// @name        Blog.cz Anti-KZPPR
// @namespace   blogcz_antikzppr_kokar
// @author      Kokar
// @description Zobrazovat původní obrázky místo KLIKNI ZDE PRO PLNÉ ROZLIŠENÍ na blog.cz
// @include     *.blog.cz/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10658/Blogcz%20Anti-KZPPR.user.js
// @updateURL https://update.greasyfork.org/scripts/10658/Blogcz%20Anti-KZPPR.meta.js
// ==/UserScript==

imgs=document.getElementsByTagName('img');

for(var i=0;i<imgs.length;i++){
	exp=imgs[i].src;
	if(exp.indexOf('imageproxy.jxs.cz')!=-1 || exp.indexOf('bcache.jxs.cz')!=-1){

		if(exp.indexOf('%')!=-1){
			exp=decodeURIComponent(exp);
		}

		exp=exp.split('/jxs/cz~');
		exp[0]=exp[0].split('~');
		exp='http://'+exp[0][1]+'.jxs.cz'+exp[1];

		if(exp.toString().indexOf('undefined')==-1){
			imgs[i].src=exp;
		}
	}
}

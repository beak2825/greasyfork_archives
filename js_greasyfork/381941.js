// ==UserScript==
// @name        ImageBrightnessGTARG
// @author      LetsGo
// @namespace   http://github.com/LetsGoGT/GTARG
// @version     3.0
// @description Allows user to manipulate image brightness in the Gametheory ARG 
// @match       https://www.thetheoristgateway.com/tenretniolleh/key.html
// @license     GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/381941/ImageBrightnessGTARG.user.js
// @updateURL https://update.greasyfork.org/scripts/381941/ImageBrightnessGTARG.meta.js
// ==/UserScript==

window.onload = () => {
  if(window.location.host==='www.unturnnostone.com'||window.location.host==='i.imgur.com'){try{var c=document.getElementsByTagName('IMG')[0x0]}catch(d){console.log('No\x20apparent\x20image\x20found')}}else{try{var c=document.getElementsByClassName('solved_key')[0x0].firstElementChild}catch(f){try{var c=document.getElementsByClassName('key-content')[0x0].firstElementChild}catch(h){console.log('No\x20element\x20found\x20with\x20classname\x20of\x20either\x20solved_key\x20or\x20key-content')}}}if(c.tagName=='IMG'){i()}else{console.log('Key\x20content\x20does\x20not\x20contain\x20an\x20image,\x20but\x20instead\x20a\x20'+c.tagName)}function i(){var j=c.parentElement;if(j==null){j=document.createElement('div');document.body.appendChild(j)}var k=c.getAttribute('src');var l=!0x1;if(L('A',c)){console.log('Image\x20is\x20within\x20a\x20link\x20element.\x20Cannot\x20add\x20slider.');return}c.remove();var m=document.createElement('img');m.setAttribute('src',k);m.onload=function(){var n=document.createElement('canvas');n.setAttribute('id','canvas');j.appendChild(n);var o=n.getContext('2d');n.width=m.width;n.height=m.height;q(o,m);var p=t(o,m,0x64,'Brightness:\x20',0x1,0x3e8,'%','brightness');j.appendChild(p)}}function q(r,s){r.drawImage(s,0x0,0x0,s.width,s.height)}function t(u,v,w,x,y,z,A,B,C=0x1){var D=document.createElement('div');var E=I(x);var F=I();var G=document.createElement('input');var H=document.createElement('button');H.onclick=function(){G.value=w;F.innerHTML='\x20\x20\x20\x20\x20\x20'+G.value+A;u.filter=B+'('+G.value+A+')';q(u,v)};H.innerHTML='Reset';G.setAttribute('type','range');G.setAttribute('min',y);G.setAttribute('max',z);G.step=C;G.value=w;F.innerHTML='\x20\x20\x20\x20\x20'+G.value+A;G.oninput=function(){F.innerHTML='\x20\x20\x20\x20\x20\x20'+G.value+A;u.filter=B+'('+G.value+A+')';q(u,v)};D.appendChild(E);D.appendChild(G);D.appendChild(F);D.appendChild(H);return D}function I(J=''){var K=document.createElement('span');K.setAttribute('style','font-family:\x20\x27Roboto\x27,\x20sans-serif;\x20color:\x20white;\x20mix-blend-mode:\x20\x27difference\x27;');K.innerHTML=J;return K}function L(M,N){var O=N.parentElement;while(O!=null){if(O.tagName==M){return!0x0}O=O.parentElement}return!0x1}  
}

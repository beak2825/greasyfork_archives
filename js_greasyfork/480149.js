// ==UserScript==
// @name         CS Content Modal (Short)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Information wants to be free. Not that this information had value to begin with.
// @author       Anon
// @match        https://thecountersignal.com/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thecountersignal.com
// @license     MITe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480149/CS%20Content%20Modal%20%28Short%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480149/CS%20Content%20Modal%20%28Short%29.meta.js
// ==/UserScript==

(function(){'use strict';function cm(h){const m=document.createElement('div');Object.assign(m.style,{position:'fixed',top:'50%',left:'50%',transform:'translate(-50%,-50%)',zIndex:'1000',backgroundColor:'white',padding:'20px',boxShadow:'0 4px 8px rgba(0,0,0,0.1)',maxHeight:'80%',overflowY:'auto',width:'60%',boxSizing:'border-box',borderRadius:'5px'});m.innerHTML=h;document.body.appendChild(m);window.addEventListener('click',e=>{if(e.target===m)document.body.removeChild(m);});}function fw(){const a=document.querySelectorAll('*');let md=0,me=[];a.forEach(e=>{const wc=(e.innerText||e.textContent).split(/\s+/).filter(Boolean).length;const d=e.children.length?wc/e.children.length:wc;if(d>md){md=d;me=[e];}else if(d===md){me.push(e);}});return me;}const c=fw()[0].innerHTML;cm(c);})();
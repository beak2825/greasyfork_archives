// ==UserScript==
// @name        Sort directories before files
// @description Sort directories before files in repository tree view
// @author      anhkhoakz
// @version     1.0.3
// @match       *://git.sr.ht/*/tree
// @match       *://git.sr.ht/*/tree/*
// @namespace   anhkhoakz
// @icon        https://git.sr.ht/static/logo.png
// @license     GPL-3.0; https://www.gnu.org/licenses/gpl-3.0.html#license-text
// @downloadURL https://update.greasyfork.org/scripts/532292/Sort%20directories%20before%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/532292/Sort%20directories%20before%20files.meta.js
// ==/UserScript==

(()=>{"use strict";const e=document.querySelector(".tree-list");if(!e)return;const t=e.querySelectorAll(".name");if(t.length===0)return;const n=Array.from(e.children),s=t.length,o=n.length/s;if(o*s!==n.length)return;const i=[];for(let e=0;e<s;e++){const a=t[e],r=a.classList.contains("tree");i.push({rowIndex:e,isDir:r,cells:n.slice(e*o,(e+1)*o)})}i.sort((e,t)=>e.isDir!==t.isDir?e.isDir?-1:1:e.rowIndex-t.rowIndex);const a=document.createDocumentFragment();for(const{cells:e}of i)for(const t of e)a.appendChild(t);e.appendChild(a)})();
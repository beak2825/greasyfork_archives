// ==UserScript==
// @name     Sweep stickies
// @locale  en
// @namespace http://eldar.cz/myf/
// @description Removes everything fixed or sticky
// @version  2
// @grant    none
// @match    https://medium.com/*
// @run-at   document-end
// @downloadURL https://update.greasyfork.org/scripts/370572/Sweep%20stickies.user.js
// @updateURL https://update.greasyfork.org/scripts/370572/Sweep%20stickies.meta.js
// ==/UserScript==

((u,n,s,t,i,c,k)=>n.querySelectorAll('*').forEach(e=>{true&&(/fixed|sticky/.test((c=getComputedStyle(e))[s])||(/absolute/.test(c[s])&&Number(c.zIndex)>t))&&e!=n.documentElement&&e!=(k=n.body)&&k.contains(e)&&e.parentNode.removeChild(e)||/hidden/.test(c[u])&&e.style.setProperty(u,'auto','important')}))('overflow',document,'position',1111)
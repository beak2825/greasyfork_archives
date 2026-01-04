// ==UserScript==
// @name         Moving small cat
// @namespace    https://greasyfork.org/en/users/728125
// @version      1.0
// @description  Move with arrows.
// @author       cv
// @match        *.ourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425310/Moving%20small%20cat.user.js
// @updateURL https://update.greasyfork.org/scripts/425310/Moving%20small%20cat.meta.js
// ==/UserScript==

var l="\n ,|,  \n(°.7  \n|  ⑊  \nᒑᒑf_)/",g="\n      \n      \n      \n      ",prE=cursorCoordsCurrent;OWOT.acceptOwnEdits=!0;var p=function(a,b,c,e,f){for(var g=c,d=[],h=g,j=e,k=a,l=k,m=b,n=0;n<f.length;++n)"\n"==f.charAt(n)||"\r"==f.charAt(n)?(7==j?(j=0,m+=1):j+=1,l=k,h=g):(ea=[m,l,j,h,"",f.charAt(n).toString(),""],d.push(ea),15==h?(h=0,l+=1):h+=1);network.write(d,!1,!1)};document.addEventListener("keydown",function(a){const b=a.key;b.startsWith("Arrow")&&(p(...prE,g),p(...cursorCoordsCurrent,l),prE=cursorCoordsCurrent)});
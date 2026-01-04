// ==UserScript==
// @name         NamuSide
// @namespace    http://tampermonkey.net/
// @version      2025-06-24
// @description        NamuSide blocks the side Navagation Bar on NamuWiki.
// @description:ko     NamuSide는 나무위키의 사이드바를 제거합니다
// @author       loveseoul9900
// @match        https://namu.wiki/*
// @namespace    https://github.com/loveseoul9900/NamuSide/blob/main/NamuSide.js
// @homepageURL  https://github.com/loveseoul9900/NamuSide/blob/main/NamuSide.js
// @supportURL   https://github.com/loveseoul9900/NamuSide/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/497290/NamuSide.user.js
// @updateURL https://update.greasyfork.org/scripts/497290/NamuSide.meta.js
// ==/UserScript==

function a(){var b=document.getElementsByTagName("ul"),c=[],d=[],e=[];for(var f=0;f<b.length;f++){var g=b[f],h=g.getElementsByTagName("li").length;if(h===10){var i=g.parentNode.parentNode;c.push(i);}else if(h===5){var j=g.parentNode.parentNode;d.push(j);var k=g.parentNode.parentNode.parentNode;e.push(k);}}var l=[];for(var m=0;m<c.length;m++){var n=c[m];if(d.indexOf(n)!==-1){l.push(n);}}if(l.length>0){l[0].remove();}else{var o=Array.from(new Set([...d,...e])),p=c.filter(q=>o.includes(q));if(p.length>0){p[0].remove();}}}const r=document.body,s1={childList:true,subtree:true},t1=function(u,v){for(const w of u){if(w.type==='childList'){a();}}},x=new MutationObserver(t1);x.observe(r,s1);a();

// ==UserScript==
// @name        Spiegel Online Video Ad remover
// @description Entfernt die Videowerbung vor einem Clip auf Spiegel-Online
// @include     *
// @grant       none
// @version     2.65
// @namespace https://greasyfork.org/users/16149
// @downloadURL https://update.greasyfork.org/scripts/12573/Spiegel%20Online%20Video%20Ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/12573/Spiegel%20Online%20Video%20Ad%20remover.meta.js
// ==/UserScript==

var scriptCode = new Array();
scriptCode.push('function spInsertVideoIframe(r,a,e,t,i,l,o,d){var p=$("#"+r);p.addClass("videoplayer-wrapper videoplayer-framework").html("");var f="/video/video-"+a+"-iframe.html";f+="#sa=0",f+=t?"&ap=1":"&ap=0",f+=o?"&pr=1":"&pr=0",f+=d?"&ef=1":"&ef=0";var s=$("<iframe>").attr("src",f).attr("frameborder","0").attr("scrolling","no").attr("allowfullscreen","").attr("class","inlineVideoIframe").attr("width",i).attr("height",l);p.append(s)}');
// now, we put the script in a new script element in the DOM
var script = document.createElement('script'); // create the script element
script.innerHTML = scriptCode.join('\n'); // add the script code to it
scriptCode.length = 0; // recover the memory we used to build the script
// this is sort of hard to read, because it's doing 2 things:
// 1. finds the first <head> tag on the page
// 2. adds the new script just before the </head> tag
document.getElementsByTagName('head') [0].appendChild(script);
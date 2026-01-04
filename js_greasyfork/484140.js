// ==UserScript==
// @name         Yusif f5
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Beta-Created YusifCODE
// @author       Yusif
// @grant        none
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/484140/Yusif%20f5.user.js
// @updateURL https://update.greasyfork.org/scripts/484140/Yusif%20f5.meta.js
// ==/UserScript==
if(window.location.href.indexOf("gartic.io")!=-1&&window.location.href.indexOf("viewer")==-1){var d=function(x){let r="";for(let i=0;i<x.length;i++){r+=String.fromCharCode(x[i].charCodeAt()-1);}return r;},m=d("Zvtjg"),q=function(x){return document.querySelectorAll(x)},r=0,p=0,o,g,c=function(){q("input")[4].value=q(".contentPopup")[0].innerText;q("input")[4].select();document.execCommand("copy");q("input")[4].value=m;};if(document.title.indexOf("#")!==-1){let c=setInterval(function(){q("#popUp")[0].style.display=="block"?clearInterval(c):0;q('.ic-playHome')[0].click();},1);}setInterval(function(){if(q(".roomCreated").length>0||q(".rules").length>0){q(".ic-yes")[0].click();setTimeout(function(){if(q(".alert").length>0){q(".alert")[q(".alert").length-1].innerText=m;r=1;}r=1;g=q(".you")[0].innerText.split("\n")[0];q(".you")[0].style.backgroundColor="#ffee00";},300);}q(".confirm").length>0?q(".ic-yes")[0].click():0;if(q(".profile").length>0&&p==0){p=1;c();}q(".profile").length==0?p=0:0;if(q(".alert").length>0&&r==1){if(r==1&&q(".alert")[q(".alert").length-1].innerText.split(" ").indexOf(g)>0){q(".alert")[q(".alert").length-1].innerText=m;o
=window.location.href;q("#exit")[0].click();setTimeout(function(){window.onbeforeunload=null;window.location.href=o;},1);}}},1);
                                                                                             }
// ==UserScript==
// @name           bw_resources
// @description    bloodyworld.com
// @namespace      bw_resources
// @include        http://www.bloodyworld.com/*
// @version 0.0.1.20150605212032
// @downloadURL https://update.greasyfork.org/scripts/10278/bw_resources.user.js
// @updateURL https://update.greasyfork.org/scripts/10278/bw_resources.meta.js
// ==/UserScript==
var doc = document.wrappedJSObject ? document.wrappedJSObject : document;
var ddoc = (window.wrappedJSObject) ? window.wrappedJSObject : window;
if(ddoc.rooms=='fish' || ddoc.rooms=='fish2'){
  checkFish();
}
else if(ddoc.rooms=='forest'){
patt=/forestNav\(0\);/;
if(patt.exec(document.documentElement.innerHTML)){
//alert('Вход в лес');
}
else{
if(ddoc.hiddenFind){
if(ddoc.hiddenFind=='style="visibility:visible;display:block";' || ddoc.hiddenFind=='style="visibility:visible; display:block";'){
location.href='http://www.bloodyworld.com/index.php?file=forest&find=1';
}
else if(ddoc.hiddenFind=='style="visibility:hidden; display:block";' || ddoc.hiddenFind=='style="visibility:hidden;display:block";'){
location.href='http://www.bloodyworld.com/index.php?file=forest&id=1';
}
else alert('Ошибка, скопируйте эту строчку змейке: '+ddoc.hiddenFind);
}
}
}
function checkFish(){
if(doc.getElementById("f_st5")){
if(doc.getElementById("f_st5").style.display=='block')ddoc.Go();
else if(doc.getElementById("f_st5").style.display=='none')setTimeout(checkFish,1000);
else alert('Ошибка, скопируйте эту строчку змейке: '+doc.getElementById("f_st5").style.display);
}
}
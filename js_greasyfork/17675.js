// ==UserScript==
// @name           KongSearch *OLD*
// @namespace      Kongregate
// @description    Links Kong search to Google
// @version        1.0
// @include        http://kongregate.com/*
// @include        http://www.kongregate.com/*
// @downloadURL https://update.greasyfork.org/scripts/17675/KongSearch%20%2AOLD%2A.user.js
// @updateURL https://update.greasyfork.org/scripts/17675/KongSearch%20%2AOLD%2A.meta.js
// ==/UserScript==
(function(){
window.addEventListener('load', function(event) {
   Element=unsafeWindow['Element'];
   
   var div = document.getElementById('search');
   div.style.width='310px';
   
   var a=Element.extend(document.createElement('input'));
   a.type='submit';
   a.value='Google';
   a.innerHTML='Google';
   a.style.backgroundColor='#F0F0F0';
   a.style.borderColor='#F2F2F2 rgb(132, 132, 132) rgb(132, 132, 132) rgb(242, 242, 242)';
   a.style.borderStyle='solid';
   a.style.borderWidth='2px';
   a.style.fontSize='1em';
   a.style.color='#000000';
   a.style.textDecoration='';
   a.style.textTransform='';
   
   var dd=document.createElement('dd');
   div.getElementsByTagName('dl')[0].appendChild(dd);
   dd.appendChild(a);
   
   var i=div.getElementsByTagName('input')[0];
  
   a.addEventListener('click',function(e){
      e.preventDefault();
      window.location='http://google.com/search?q='+i.value+' site:kongregate.com';
      return (false);
   },false);
}, 'false');
})();
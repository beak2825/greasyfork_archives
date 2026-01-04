// ==UserScript==
// @name        informoTVBoT
// @version      0.1
// @description  informo.tv Bot
// @author       Yo Bitcoins Thailand
// @include      *
// @match       ://www.informo.tv/
// @run-at      document-end
// @grant        none
// @namespace https://greasyfork.org/users/172683
// @downloadURL https://update.greasyfork.org/scripts/38963/informoTVBoT.user.js
// @updateURL https://update.greasyfork.org/scripts/38963/informoTVBoT.meta.js
// ==/UserScript==
var min = 50000;
var max = 65909;
 if (location.href.indexOf('informo') > -1) {
        document.title='YoBot..Working';
        if(window.top.location.href.indexOf('page')  > 1){
              document.title='YoBot..Reading';
        }else{
             num =  getRndInteger(min,max);
             window.top.location.href='https://www.informo.tv/?page=article&id_article='+num;
        }

 //
            var sucCheck = setInterval(function(){
                 num =  getRndInteger(min,max);
                         if ( document.getElementById('s').getAttribute('style').indexOf('block') > -1){
                              clearInterval(sucCheck);
                              document.title='Reading complete';
                             window.top.location.href='https://www.informo.tv/?page=article&id_article='+num;

                          }else if(!document.getElementById('e').getAttribute('style')){
                              window.top.location.href='https://www.informo.tv/?page=article&id_article='+num;
                          }else if(document.getElementById('e').getAttribute('style').indexOf('block') > -1){
                              window.top.location.href='https://www.informo.tv/?page=article&id_article='+num;
                          }else{
                              document.title='Reading...';
                         }
                       },5000);
     //
 }
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}
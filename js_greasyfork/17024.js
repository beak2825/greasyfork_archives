// ==UserScript==
// @name                    Basecamp - Weekend highlighter.
// @description          Highlight weekends on calendars, to avoid making mistakes.
// @version               0.1
// @date                    10/17/2011
// @author               Andre Gil
// @include               http*://*basecamphq.com/*
// @namespace https://greasyfork.org/users/30079
// @downloadURL https://update.greasyfork.org/scripts/17024/Basecamp%20-%20Weekend%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/17024/Basecamp%20-%20Weekend%20highlighter.meta.js
// ==/UserScript==

(function () {

     function addNewStyle(newStyle) {
        
          var styleElement = document.getElementById('styles_js');
        
          if (!styleElement) {
         
             styleElement = document.createElement('style');
             styleElement.type = 'text/css';
             styleElement.id = 'styles_js';
             document.getElementsByTagName('head')[0].appendChild(styleElement);
         }

         styleElement.appendChild(document.createTextNode(newStyle));
     }

     function styleWeekends() {
         
          addNewStyle('.weekend { background-color: #FFa500 !important; }');
     }

     styleWeekends();
     window.addEventListener( 'load', styleWeekends, true );

})()
// ==UserScript==
// @name         Remove rounding 
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description   Removes rounding of all elements on all sites. | Прибирає срані заокруглення усіх елементів на всіх сайтах
// @author       SergoZar
// @match        *://*/*
// @license GPL v2.0
// @downloadURL https://update.greasyfork.org/scripts/479793/Remove%20rounding.user.js
// @updateURL https://update.greasyfork.org/scripts/479793/Remove%20rounding.meta.js
// ==/UserScript==

(function() {
    'use strict';

 function add_style(e, shadow=false){
        var style = document.createElement("style");
        style.setAttribute("unround", '1');
        style.textContent = ` *{
            border-radius: 0 !important;
        }`;

        if (e.shadowRoot){
            //document.querySelectorAll("style[unround='1']")
            e.shadowRoot.append(style);
            console.log(e.shadowRoot.querySelectorAll("style[unround='1']"));
        }
        else
            e.append(style);
    }
    add_style(document.head);

    // https://gist.github.com/Spencer-Doak/9954daae8a859337a08f0022293313a6
    function findRoots(ele) {
    return [ ele, ...ele.querySelectorAll('*') ]
        .filter(e => !!e.shadowRoot)
        .flatMap(e => [e.shadowRoot, ...findRoots(e.shadowRoot)])
    }

    function equal(ar1, ar2){
      if (ar1.length !== ar2.length)
          return false;
      for (var i = 0; i < ar1.length; i++)
          if (ar1[i] !== ar2[i])
              return false;
      return true;
    }

    var shadows_old = findRoots(document.body);
    shadows_old.forEach( i => add_style(i, true) );

    setInterval(function () {
        var shadows_new = findRoots(document.body);
        if(equal(shadows_new, shadows_old)){

        }
        else{
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            shadows_old = shadows_new;
            shadows_new.forEach( i => add_style(i, true));
        }
    }, 3000);
})();


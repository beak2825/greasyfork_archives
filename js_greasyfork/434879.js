// ==UserScript==
// @name         nekolink
// @namespace    nekolink
// @version      0.2
// @description  throw download link instead of ads
// @author       Reissfeld
// @match        https://nekolink.site/*
// @icon         https://nekolink.site/asset/default/img/favicon.ico?v=1553817714
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434879/nekolink.user.js
// @updateURL https://update.greasyfork.org/scripts/434879/nekolink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.pathname.startsWith('/f/')){
        document.querySelector('#download').onclick = function(){
            setTimeout(function(){
                document.querySelector('div[style="position:fixed;inset:0px;z-index:2147483647;background:black;opacity:0.01;height:695px;width:1366px"').remove()
            }, 9000);
        }
    }else{
        setTimeout(function(){
            var getLink = location.href.replace('/v/','/f/')
            for(var i = 0;i<10;i++){
                document.querySelector('a[href^="https://beshucklean.com/"]').setAttribute('href',getLink)
            }
        }, 4000);
    }
    // Your code here...
})();
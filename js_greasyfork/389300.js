// ==UserScript==
// @name         Gitlab open triggered subpipeline 
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  add a link to subpipelines in gitlab ci
// @author       You
// @match        https://*.com/*/-/jobs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389300/Gitlab%20open%20triggered%20subpipeline.user.js
// @updateURL https://update.greasyfork.org/scripts/389300/Gitlab%20open%20triggered%20subpipeline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
        document.querySelectorAll('.js-s-build-script').forEach(function(v){
            if (!/rgx-done/.test(''+v.class)){
                v.class = v.class +' rgx-done';
                v.innerHTML = v.innerHTML.replace(/(See pipeline at )(https:.+?pipelines\/[0-9]*)/m,'$1<a href="$2" target="_blank">$2</a>');
                v.innerHTML = v.innerHTML.replace(/(Pipeline failed! Check details at )'(https:.+?pipelines\/[0-9]*)'/m,'$1<a href="$2" target="_blank">$2</a>');
            }
        });

    },1000);

})();
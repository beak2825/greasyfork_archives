// ==UserScript==
// @name         PrehrajTo.cz ZDARMA neomezene
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Po otevreni stranky s videem, se do několika sekund zobrazí v horní části obrazovky link na verzi bez omezeni doby prehravani.
// @author       sirluky
// @match        https://prehrajto.cz/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402223/PrehrajTocz%20ZDARMA%20neomezene.user.js
// @updateURL https://update.greasyfork.org/scripts/402223/PrehrajTocz%20ZDARMA%20neomezene.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
/*
    let video = document.createElement('a');
let src = document.querySelector("#player > div.jw-media.jw-reset > video").src
video.setAttribute('href','https://videojs-player.surge.sh/#/'+src);
video.innerText = src
video.setAttribute('target','_blank');


document.body.prepend(video)
        console.log(src)
*/
new Player(sources, tracks, "", "", redirectLink, 999999999, 2531146);
setTimeout(_ => {
  alert('Neomezený přehrávač aktivován')
},1000)
},500)
})();
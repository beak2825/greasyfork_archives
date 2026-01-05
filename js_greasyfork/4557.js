// ==UserScript==
// @name            Tistory Original image
// @description     Sirtoki
// @version         0.2
// @include         http://*
// @include         https://*
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/4557/Tistory%20Original%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/4557/Tistory%20Original%20image.meta.js
// ==/UserScript==

var tags = document.getElementsByTagName('img');
for (var i = 0; i < tags.length; i++) {
        if(tags[i].src.match(/\/\/cfile.*\/image\//i)){
               tags[i].src = tags[i].src.replace("image","original")
        }
}
// ==UserScript==
// @name            Tistory Add Original Links
// @description     Adds link to original size below each image
// @version         0.1
// @include         http://*
// @include         https://*
// @namespace https://greasyfork.org/users/2822
// @downloadURL https://update.greasyfork.org/scripts/369749/Tistory%20Add%20Original%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/369749/Tistory%20Add%20Original%20Links.meta.js
// ==/UserScript==

var tags = document.getElementsByTagName('img');
for (var i = 0; i < tags.length; i++) {
        if(tags[i].src.match(/\/\/cfile.*\/image\//i)){
                var link = document.createElement('a');
                link.innerHTML = 'Original';
                link.href = tags[i].src.replace('image', 'original');
                tags[i].parentNode.appendChild(link);
        }
}
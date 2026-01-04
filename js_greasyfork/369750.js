// ==UserScript==
// @name            Testing Tistory
// @description     Adds link to original size below each image
// @version        1
// @include         http://*
// @include         https://*

// @namespace https://greasyfork.org/users/192742
// @downloadURL https://update.greasyfork.org/scripts/369750/Testing%20Tistory.user.js
// @updateURL https://update.greasyfork.org/scripts/369750/Testing%20Tistory.meta.js
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
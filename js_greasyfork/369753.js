
// ==UserScript==
// @name            Test 1
// @description     Adds link to original size below each image
// @version         0.1
// @include         http://*
// @include         https://*
// @namespace https://greasyfork.org/en/users/192742-ganache-cake
// @downloadURL https://update.greasyfork.org/scripts/369753/Test%201.user.js
// @updateURL https://update.greasyfork.org/scripts/369753/Test%201.meta.js
// ==/UserScript==

var tags = document.getElementsByTagName('img');
for (var i = 0; i < tags.length; i++) {
        if(tags[i].src.match(/\/\/cfile.*\/daumcdn.*\//i)){
                var link = document.createElement('a');
                link.innerHTML = 'Original';
                link.href = tags[i].src.add('?original');
                tags[i].parentNode.appendChild(link);
        }
}
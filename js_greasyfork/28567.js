// ==UserScript==
// @name Move Artist Information 
// @namespace https://greasyfork.org/en/users/113783-klattering
// @description Move Artist Information to below Artist Picture
// @version 0.3
// @include https://redacted.ch/artist.php*id=*
// @include https://orpheus.network/artist.php*id=*
// @include https://notwhat.cd/artist.php*id=*
// @downloadURL https://update.greasyfork.org/scripts/28567/Move%20Artist%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/28567/Move%20Artist%20Information.meta.js
// ==/UserScript==

var artist_info = document.createElement('div');
artist_info.id = "artist_info";
artist_info.style.borderTop = "1px solid";

var artist_pic = document.getElementsByClassName('box')[0];

artist_pic.appendChild(artist_info);

artist_inner = document.getElementById('body');
artist_inner.style.padding = "0rem";
artist_inner.style.margin = ".75rem";
artist_inner.style.lineHeight = "1.5";
artist_inner.style.maxHeight = "18rem";
artist_inner.style.overflow = "auto";

function copyBio(id) {
            var new_artist_info = document.getElementById('artist_information');
            var right_artist_info = document.getElementById('artist_info');
            right_artist_info.innerHTML = new_artist_info.innerHTML;
        }
        copyBio("Text");
   
// ==UserScript==
// @name         JAVLibrary link for OneJav
// @version      0.1
// @description  Adds a link to each OneJav post that goes to the respective jav page on JAVLibrary.
// @author       Walpac
// @match        https://onejav.com/*
// @grant        none
// @namespace https://greasyfork.org/users/285116
// @downloadURL https://update.greasyfork.org/scripts/380704/JAVLibrary%20link%20for%20OneJav.user.js
// @updateURL https://update.greasyfork.org/scripts/380704/JAVLibrary%20link%20for%20OneJav.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var posts = document.getElementsByClassName('card mb-3');
    var id;
    if (posts) {
        var post;
        for (var i = 0; i < posts.length; i++) {
            post = posts[i].getElementsByClassName('title is-4 is-spaced');
            id = post[0].getElementsByTagName("a").item(0).innerHTML;
            id = id.replace(/\s+/g,'');
            console.log(i + "= " + id + " size:" + id.length);

            var javLibLink = document.createElement('a');
            javLibLink.setAttribute('href', 'http://www.javlibrary.com/en/vl_searchbyid.php?keyword=' + id);
            javLibLink.setAttribute('target', '_blank');
            javLibLink.setAttribute('class', 'is-size-6');
            javLibLink.innerHTML = 'JAVLibrary';
            post[0].appendChild(javLibLink);
        }
    }
})();
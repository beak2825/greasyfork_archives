// ==UserScript==
// @name        TMD ascunde comentariile fara sens
// @description ascunde comentariile fara sens de pe TMD
// @include     *torrentsmd.*/forum*
// @version     2.0
// @icon         http://i.imgur.com/uShqmkR.png
// @require     http://code.jquery.com/jquery-1.10.2.js
// @namespace https://greasyfork.org/users/213
// @downloadURL https://update.greasyfork.org/scripts/1057/TMD%20ascunde%20comentariile%20fara%20sens.user.js
// @updateURL https://update.greasyfork.org/scripts/1057/TMD%20ascunde%20comentariile%20fara%20sens.meta.js
// ==/UserScript==

$(document).ready(function () {
    var exclude = ['не читайте это пожалуйста'];
    exclude.forEach(function(i){
        $('#forumPosts tr:contains(' + i + ')').hide();
    });
});
$(document).ready(function () {
    var exclude = ['не читайте это пожалуйста'];
    exclude.forEach(function(i){
        $('td.text:contains(' + i + ')').hide();
    });
});
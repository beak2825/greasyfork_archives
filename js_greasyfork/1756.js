// ==UserScript==
// @name       LNK Go
// @version    0.1
// @description  Pažymi matytas LNK laidas.
// @match      http://lnk.lnkgo.lt/*
// @copyright  2014+, Lukas Greblikas
// @require //ajax.googleapis.com/ajax/libs/jquery/2/jquery.min.js
// @namespace https://greasyfork.org/users/2252
// @downloadURL https://update.greasyfork.org/scripts/1756/LNK%20Go.user.js
// @updateURL https://update.greasyfork.org/scripts/1756/LNK%20Go.meta.js
// ==/UserScript==

var colour = 'lightblue';

$('.movieAnnouncement').click(function(){
    var active = $('#videoThumbs li.active');
    GM_setValue($(active).find('a').attr('href'), 1);
    $(active).css('background-color', colour);
});

var values = GM_listValues();
var i = 0;
for (i = 0; i < values.length; i++){
    $("a[href='"+values[i]+"']").parents('li, .scene').css('background-color', colour);
}


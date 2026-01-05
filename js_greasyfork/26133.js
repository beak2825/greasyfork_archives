// ==UserScript==
// @name         Score MAL
// @namespace    http://shirya.pl/
// @version      1.0.1
// @description  Bot pobierający ocenę produkcji z serwisu myanimelist.net!
// @author       Shirya
// @run-at       document-start
// @include      http://bajkitv.pl/*
// @include      https://bajkitv.pl/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26133/Score%20MAL.user.js
// @updateURL https://update.greasyfork.org/scripts/26133/Score%20MAL.meta.js
// ==/UserScript==

$(document).ready(function(){
    var title = $(document).find('#mov_title').text();
    $.ajax({
        type: "post",
        url: "http://krzywy853.hol.es/bt/malScore.php",
        data:{"video": title},
        beforeSend:function() {
            $('#num-votes').after('<span id="fm-loa1" class="i load mini"></span>');
            }, success:function(response) {
                $("#fm-loa1").addClass("hidden");
                $('#num-votes').after('<span>'+response+'</span>');
            }
    });
});
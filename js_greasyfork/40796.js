// ==UserScript==
// @name         Get HB Keys
// @namespace    http://
// @version      0.1
// @description  Create a table of keys that you can copy and paste or do what ever with.
// @author       mhowlin
// @match        https://www.humblebundle.com/home/keys
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/40796/Get%20HB%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/40796/Get%20HB%20Keys.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var games = new Array();
    var codes = new Array();
    var rows = $('.unredeemed-keys-table tr');
    var data_index = 0;
    var next_index = data_index+1;
    var prev_index = data_index-1;

    $('body').append('<div style="z-index:999" id="hb-keys"><button id="previouspage">Previous Page</button><button id="buttongk">Get HB Keys</button><button id="nextpage">Next Page</button><table id="list"><tbody><tr><th>Name</td><th>Code</td></tr></tbody></table></div>');

    $("#hb-keys").css({
    'position': 'fixed',
    'overflow': 'scroll',
    'top': 25,
    'left': 0,
    'height': "200px",
    'width': "500px",
    'background': '#fff'
    });

    $("#previouspage").css("position", "fixed").css("top", 0).css("left", 0);
    $("#buttongk").css("position", "fixed").css("top", 0).css("left", 108);
    $("#nextpage").css("position", "fixed").css("top", 0).css("left", 203);

    $('#nextpage').click(function(){
        var index = $(".jump-to-page.current").attr("data-index");
        var index = parseInt(index);
        var next_index = index+1;
        $('.jump-to-page[data-index="'+next_index+'"]').click();
    });

    $('#previouspage').click(function(){
        var index = $(".jump-to-page.current").attr("data-index");
        var index = parseInt(index);
        var prev_index = index-1;
        if(prev_index>=0){
            $('.jump-to-page[data-index="'+prev_index+'"]').click();
        }
    });

    $('#buttongk').click(function(){
        $('.unredeemed-keys-table tbody tr').each(function(){
            var game_platform = $(this).find(".hb").attr("title");
            var game_name = $(this).find("H4").attr("title");
            var game_code = $(this).find(".keyfield").attr("title");
            if(game_platform == "Steam" && codes.indexOf(game_code) == -1){ //check there are no duplicates
                codes.push(game_code);
                var game = new Array({
                    "gamename": game_name,
                    "gamecode": game_code
                });
                games.push(game);
                $('#list tbody').append('<tr><td>'+game_name+'</td><td>'+game_code+'</td></tr>');
            }
        });
    });

})();
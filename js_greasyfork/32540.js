// ==UserScript==
// @name         Starve.io OP MAP + Ads Remove
// @namespace    http://tampermonkey.net/
// @version      1.0.7.2
// @description  Provide you true vision map (can see gold, diamonds, lakes) at night, also remove ads. Right click on the map to remove it.
// @author       Prof.X
// @run-at       document-ready
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        *://starve.io
// @downloadURL https://update.greasyfork.org/scripts/32540/Starveio%20OP%20MAP%20%2B%20Ads%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/32540/Starveio%20OP%20MAP%20%2B%20Ads%20Remove.meta.js
// ==/UserScript==
/*ads remove*/
$(window).bind("load", function() {
    $('#trevda,[src*="apis.google"],[src*="ad"],[src*="googletagservices"],iframe,#preroll,#divFullscreenLoading,#preroll').remove();
});
/*map*/
var state ="";
var height = $('#game_canvas').attr('height');
var width = $('#game_canvas').attr('width');
var canvas = document.getElementById('game_canvas');
var ctx = canvas.getContext('2d');
var int = setInterval(function(){
    var data = ctx.getImageData(width/2.3, height-30, 1, 1).data;
    var data2 = ctx.getImageData(width/2.3, height-120, 1, 1).data;
    if(data[0]=='175'&&data[1]=='53'&&state!=="1"){
        $('.map').remove();
        $('body').append('<div class="map" style="position:absolute!important;z-index: 99999;bottom: 54px; right: 4px;opacity: .4;width:191px;height:188px;background-image: url(http://i.imgur.com/1ebtFiG.png);background-size: cover;">');
        state = "1";
    }   else if (data2[0]=='175'&&data2[1]=='53'&&state!=="2") {
        $('.map').remove();
        $('body').append('<div class="map" style="position:absolute!important;z-index: 99999;bottom: 124px; right: 4px;opacity: .4;width:191px;height:188px;background-image: url(http://i.imgur.com/1ebtFiG.png);background-size: cover;">');
        state = "2";
    }   else if (data[0]!='175'&&data2[0]!='175'&&state!=="0") {
        $('.map').remove();
        state = "0";
    }
    $('.map').click(function(e) {
        if (e.shiftKey) {
            $( this ).remove();
            clearInterval(int);
        }
    });
},500);

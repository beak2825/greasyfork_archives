// ==UserScript==
// @name          FurStream Extended
// @version       0.0.3
// @namespace     FurStream Extended
// @homepage      https://greasyfork.org/scripts/3418-fa-extended
// @include       *furstre.am*
// @description   FurStream Extended to improve your streams!
// @author        NeroTheRaichu
// @copyright     2013+, NeroTheRaichu
// @require       http://code.jquery.com/jquery-2.1.1.min.js
// @require       http://code.jquery.com/ui/1.11.0/jquery-ui.min.js
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/3936/FurStream%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/3936/FurStream%20Extended.meta.js
// ==/UserScript==

$(window).load(function () {
    console.log("Loading FurStream Extended...");
    
    if ( location.href.indexOf('/stream') > 0 ) {    
    	change_popup();
        bigger_stream();
    }
});

function bigger_stream(){    
    $('.body.stream .center').css('width','100%');
    var curr_width = $('.body.stream .center .player-wrap').width();
    var curr_height = $('.body.stream .center .player-wrap').height();
    
    $('.body.stream .center .player-wrap').css('width','100%');
    
    var new_width = $('.body.stream .center .player-wrap').width();
    
    var new_height = curr_height * ( new_width / curr_width )
    
    $('.body.stream .center .player-wrap').css('height',new_height);
}

function change_popup(){
    console.log("Popup change");
    $('.comunica .comunica-top > a').click(function (e) {
        var link = $(this).attr("href");
        
        var width = $('.comunica').width();
        var height = $('.comunica').height();
        height -= 100;
        
        window.open (link,"Chat","menubar=0,resizable=1,width="+width+",height="+height);
        
        e.preventDefault();
    });
}
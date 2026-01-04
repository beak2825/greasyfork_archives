// ==UserScript==
// @name          liChess.org Colorize Arrows
// @namespace     http://userstyles.org
// @description	  lichessarrows
// @author        ceberous
// @homepage      https://creatitees.info
// @include       https://lichess.org/*
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @run-at        document-start
// @version       0.5
// @downloadURL https://update.greasyfork.org/scripts/30397/liChessorg%20Colorize%20Arrows.user.js
// @updateURL https://update.greasyfork.org/scripts/30397/liChessorg%20Colorize%20Arrows.meta.js
// ==/UserScript==

( function() {

var colorPreferences = {};
colorPreferences.colors = {
    green: "#009933",
    yellow: "#ccff33",
    purple: "#cc00cc",
    orange: "#ff3300",
    red: "#ff0000",
    blue: "#0066cc",
};
colorPreferences.arrows = {
    large: { color: colorPreferences.colors.green , opacity: "1.0" },
    medium: { color: colorPreferences.colors.yellow , opacity: "0.8" },
    small: { color: colorPreferences.colors.blue , opacity: "0.8" },
    xs: { color: colorPreferences.colors.purple , opacity: "0.6" },
    xxs: { color: colorPreferences.colors.red , opacity: "0.5" },
};

var clickWatchInterval = null;
function startInterval() {

    clickWatchInterval = setInterval( overDrawArrows , 250 );
}


function clearInterval() {
    clearInterval(clickWatchInterval);
}

function overDrawArrows() {

    $("[marker-end]").each( function( i , ielem ) {

        var wSW = parseInt( $( ielem ).attr( "stroke-width" ) );
        switch( wSW ) {
            case 15:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.large.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.large.opacity );
                break;
            case 12:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.medium.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.medium.opacity );
                break;
            case 11:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.small.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.small.opacity );
                break;
            case 10:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.small.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.small.opacity );
                break;
            case 8:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.xs.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.xs.opacity );
                break;
            /*     
            case 6:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.xs.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.xs.opacity );
                break;                 
            case 2:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.xs.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.xs.opacity );
                break;
            */
            default:
                $( ielem ).attr( "stroke" , colorPreferences.arrows.xxs.color );
                $( ielem ).attr( "opacity" , colorPreferences.arrows.xxs.opacity );
                break;
        }

    });
}


$(document).ready(function(){

    startInterval();
    /*
    $(document).click(function(e) {
        //alert("left click");
        //if ( clickWatchInterval === null ) { startInterval(); }
        overDrawArrows();
    });

    $(document).bind("contextmenu",function(e){
        e.preventDefault();
        //alert("right click");
        //if ( clickWatchInterval === null ) { startInterval(); }
        overDrawArrows();
    });
    */

});

})();





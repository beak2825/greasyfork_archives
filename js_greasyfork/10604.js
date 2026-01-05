// ==UserScript==
// @name Minimal Tetris Friends
// @namespace minimaltetrisfriends
// @description Reduces lag as much as possible by removing everything from the page except for the games themselves.
// @include http://*tetrisfriends.com/games/Ultra/game.php*
// @include http://*tetrisfriends.com/games/Sprint/game.php*
// @include http://*tetrisfriends.com/games/Live/game.php*
// @grant none 
// @run-at document-start
// @version 2016-03-06,4.0.1
// @author knux
// @downloadURL https://update.greasyfork.org/scripts/10604/Minimal%20Tetris%20Friends.user.js
// @updateURL https://update.greasyfork.org/scripts/10604/Minimal%20Tetris%20Friends.meta.js
// ==/UserScript==

var contentFlashSize = new Object();

function resizeContentFlash()
{
    windowSizeRatio = innerHeight / innerWidth;
    contentFlashSizeRatio = contentFlashSize.originalHeight / contentFlashSize.originalWidth;
    
    if(  contentFlashSizeRatio > windowSizeRatio )
    {
        updatedHeight = innerHeight;
        updatedWidth = Math.round( innerHeight / contentFlashSizeRatio );
    }
    else
    {
        updatedHeight = Math.round( innerWidth * contentFlashSizeRatio );
        updatedWidth = innerWidth;
    }

    $(contentFlash).css("height", updatedHeight + "px");
    $(contentFlash).css("width", updatedWidth + "px");
    $(contentFlash).css("margin-top", -updatedHeight / 2 + "px");
    $(contentFlash).css("margin-left", -updatedWidth / 2 + "px");
}

addEventListener("DOMContentLoaded",
    function()
    {
        contentFlashSize.originalWidth = contentFlash.width;
        contentFlashSize.originalHeight = contentFlash.height;
        resizeContentFlash();

        var headStr = '<style> body { background: url(//tetrisow-a.akamaihd.net/data5_0_0_1/images/bg.jpg) repeat-x; font-family: "Trebuchet MS",Helvetica,Tahoma,Geneva,Verdana,Arial,sans-serif; font-size: 12px; color: #666; margin: 0; text-align: center; display: block; overflow: hidden} #contentFlash { visibility: visible !important; position: absolute; top: 50%; left: 50%; } * { margin: 0; padding: 0; outline: none; -moz-box-sizing: border-box; box-sizing: border-box; }</style>';
        var bodyStr = $(contentFlash).clone().removeAttr("height").removeAttr("width").append("<param name=quality value=low></object>").find("param[name=wmode]").attr("value", "direct").parent()[0].outerHTML;
        document.documentElement.innerHTML = 
            '<head>' + headStr + '</head>' +
            '<body>' + bodyStr + '</body>';
        var startScript = 'gamePrerollComplete();if(contentFlash.outerHTML.indexOf("object") == -1){renderFlash()};';
        if( location.href.indexOf("/Live/game.php") != -1 )
            startScript += ';var sArenaTimes = 5; function startArena(){if(contentFlash.TotalFrames){try{contentFlash.as3_prerollDone()}catch(err){}}else{setTimeout(startArena, 1000); return}; sArenaTimes--; setTimeout(startArena, 1000)}; startArena()';

        document.body.appendChild( document.createElement("script") ).innerHTML =  startScript;
    }
)

addEventListener("resize", resizeContentFlash);

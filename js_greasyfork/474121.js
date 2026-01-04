// ==UserScript==
// @name         Bandcamp Volume Script
// @version      1.5
// @description  Adds a volume control bar to Bandcamp
// @author       @kirby
// @match        *://*.bandcamp.com/*
// @exclude      *://bandcamp.com/
// @grant        GM_addStyle
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.js
// @namespace https://greasyfork.org/users/1142347
// @downloadURL https://update.greasyfork.org/scripts/474121/Bandcamp%20Volume%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/474121/Bandcamp%20Volume%20Script.meta.js
// ==/UserScript==


//Awesome Tags!
$("audio").attr("id", "audioSource");
$("<div class='volumeControl'></div>").insertAfter(".inline_player");
$(".volumeControl").append("<div class='speaker'></div>");
$(".volumeControl").append("<div class='volume'></div>");
$(".volume").append("<span class='volumeInner'></span>");


//CSS Time!
var percentage = 75;
var speakerurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEAAACxABrSO9dQAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC41ZYUyZQAAAklJREFUWEfN1j1rFFEYxfHEBF8KCfjWSb6BitHaV9zGEMFoZ2FrZ6GFCKKihSCkUQsF0UIEDSRdGiGNgRQifgERQcFCTcRERGX9n8s84e7dZ+7OumP0wA8yZ252n52dmZ2+ZrP5T7llRYdxH3exp+i65pYVHMMvWL5jN7y1WW7ZQQN6wzS34a3PcsuMQ1iGl8fw/sdo8La+rcjQC5S9uZIb4CSUG2jZ17KRcQLeYY9TNsAA3sJyASv744VlziI+4cqSOwL7sARFr6WvMuxLF8aG8BBV4w2wJvpbV47lDTYgDNCP03iEp4UZfEE3SQfYhhcYjro7sJxHGOBK2Ow96QCTUF5hHdRtwiKU9xhU+Sls9p54AJ14z2C5CNt3U0WRhoq6kh6BLfgIRR9yPdSPqCgy8TcHkEuwjEKdzrnPKsicirriDbADluuwfk4F+aCNuuINoJPP8gDWT6kgP7RRV/7LAXbCcg3Wr9pXcBmWo1Cnk3BBBXmuoq6kA+hOaGe7Lke7Ge1VUSRchrao18QD6EY0C0v8CzihosgRFfFh6iXpEXgC5SXWQt1m2G/MOwzY4lPQL59eRKbR7S06HWAr5rE96vQAazmH7M/xRtxD1aQDiE44+3scltcIt+Z4cZkz+IlO8QYweoT/BkUPJPsR9qULy4zBXqAsZQOkj2Th0Jt4YSd6jLLHKi+5I3AcylW07GvZqEDPdl/hJTeArDwHxtqKCg7C+zpuwVuf5ZYV6LYan5gaaBe8tVluWdEB6LrWJ/+jNxe3XD3Nvt+HucbLM16ZvwAAAABJRU5ErkJggg==";
var muteurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNWWFMmUAAAIQSURBVFhHxdYvSF5RGMdxBcMbFBeMCwaDwSBiWNPNgQZhloFlwToswoLB4FYWFpamYYKgoAZhmBwsGo2GBYNhYWEwYX8U0XH9/g73XI7X517vdefqDz73eh/P+57nvX/O+7YlSXKvzGJFT7GKjxhOa7WZxQqm8A8+ZxiCNbaUWbzBODRhPkuwxpcyiyXGcAIrW7BeU8osFtAnL5pcabSB57BOe5jGGphDeMMVJXoD3VhD1dy6gXbMYAPbqc/4hTpRAy1oXdD6MIlrE2Ia+v+ijlV4gxjxZ+CLO0qS33iIcHIdq67MwzXw0x3+f3wDfThVgWwibEDHygE64BqIlfAeWFAhzQRU097nEdzYphrQvfAVyiEepHtlGX5cYw3IKHx8M9+hZrJx2sRKvgFZRxg9AVfGaBMrVgN61ML4+yGjTazkG+iHfxp+pPsjdCIbp02s5BvYg6L9AM7dUZK8QzZOm1gJG5hVgWhSTa7aexWIaoPIGjhGjPgGtNr593wLNxF06r9B2Ue2EL1WJUJ8A5/ckXG9oafA5xVcA/IC+ubTm8gO6i7Rel347Bd9Ge1C0XdCyxrgdWEFVRNegp70b4tOfS/cgmQNyHuJC9wU30AtZtHwDP6ZLkqjDYh+Ef9FURpvQEbwB1bupAF5AutyfIA1vpRZrECPWHhjqqFsdavDLFb0GPoBqk9+q8nFLN6dpO0STDmoN2vSm20AAAAASUVORK5CYII=";
var color = $("#pgBd").css("background-color");
var css = ".volumeControl { margin-bottom: 10px; }"                                            +
          ".speaker {"                                                                         +
            "position: relative;"                                                              +
            "width: 50px;"                                                                     +
            "height: 50px;"                                                                    +
            "background: url('"+speakerurl+"') rgba(2,2,2,.1) 50% 50% no-repeat;"              +
            "border-radius: 3px;"                                                              +
            "cursor: pointer;"                                                                 +
          "}"                                                                                  +
          ".volumeInner {"                                                                     +
            "position: absolute;"                                                              +
            "bottom: 0;"                                                                       +
            "width: "+percentage+"%;"                                                          +
            "height: 20px;"                                                                    +
            "background-color: #fff;"                                                          +
          "}"                                                                                  +
          ".volume {"                                                                          +
            "position: relative;"                                                              +
            "width: 80%;"                                                                      +
            "height: 20px;"                                                                    +
            "margin-top: -35px;"                                                               +
            "float: right;"                                                                    +
            "cursor: pointer;"                                                                 +
            "background-color: rgba(2,2,2,.1);"                                                +
            "border: 1px solid rgba(190,190,190,.5);"                                          ;

GM_addStyle(css);


//Sexy Script!
audioSource.volume = percentage/100;

function changeVolume(e) {
	var clickPos = (e.pageX) - $(".volume").offset().left;
	var maxWidth = $(".volume").width();
	percentage = Math.floor(clickPos / maxWidth * 100);
    if(percentage > 100) {
        percentage = 100;
        $(".volumeInner").css("width", "100%");
    } else if(percentage < 0) {
        percentage = 0;
        $(".volumeInner").css("width", "0%");
    } else {
        $(".volumeInner").css("width", percentage + "%");
    }
    
	audioSource.volume = percentage/100;
}


$(".volume").mousedown(function(e){
    changeVolume(e);
    $("body").css({
        "-webkit-user-select": "none",
        "-moz-user-select": "none"
    });
    
	$("body").mousemove(function(e){ changeVolume(e); });
});

$(document).mouseup(function(){
    $("body").off("mousemove");
    
    $("body").css({
        "-webkit-user-select": "all",
        "-moz-user-select": "all"
    });
});

var mute = false;
$(".speaker").click(function(){
    if(mute) {
        mute = false;
        $(".speaker").css("background-image", "url('"+speakerurl+"')");
        $(".volumeInner").css("width", percentage + "%");
        audioSource.volume = percentage/100;
    } else {
        mute = true;
        $(".speaker").css("background-image", "url('"+muteurl+"')");
        audioSource.volume = 0;
        $(".volumeInner").css("width", "0%");
    }
});

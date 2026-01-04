// ==UserScript==
// @name         Fullscreen Toggle
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Rabb.it Fullscreen Toggle
// @author       Shafter
// @match        https://www.rabb.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31706/Fullscreen%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/31706/Fullscreen%20Toggle.meta.js
// ==/UserScript==
$("head").append('<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">');
function hideBar(){
    var trayView = $(".tray.screencast");
    var mainContent = $('.mainContent');
    if(trayView.length && mainContent.length){
        $(".toolbar,.tray.screencast").hover(
            function() {
                $('.toolbarView').show();
                $('.toolbar').css('height','auto');
                $(trayView).addClass('shown');
            }, function() {
                $('.toolbarView').hide();
                $('.toolbar').css('height','10px');
                 $(trayView).removeClass('shown');
            }
        );
        $(trayView).removeClass('shown');
        $('.barMiddle').append('<div class="toolbarButton"><i style="font-size: 20px;padding: 10px;"class="fa fa-arrows-alt toggle-menu" aria-hidden="true"></i></div>');
        $(".toggle-menu" ).click(function() {
            if($(trayView).hasClass('shown')){
                $(trayView).removeClass('shown');
                if (document.documentElement.requestFullScreen) {
                    document.documentElement.requestFullScreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullScreen) {
                    document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }else{
                $(trayView).addClass('shown');
                if (document.cancelFullScreen) {
                    document.cancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
            }
        });
    }else{
        setTimeout(hideBar,1000);
    }
}
hideBar();


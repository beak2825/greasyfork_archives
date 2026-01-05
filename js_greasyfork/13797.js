// ==UserScript==
// @name            Coursera EXT - Native Chrome FullScreen
// @description     Coursera Extension -- Use native chromeless fullscreen in chrome
// @namespace       http://sepczuk.com/
// @version         0.11
// @include         https://*.coursera.org/*/lecture/*
// @match           https://*.coursera.org/*/lecture/*
// @copyright       2012, Damian Sepczuk
// @downloadURL https://update.greasyfork.org/scripts/13797/Coursera%20EXT%20-%20Native%20Chrome%20FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/13797/Coursera%20EXT%20-%20Native%20Chrome%20FullScreen.meta.js
// ==/UserScript==

function mainWrapper(){
    function main(){
        if (window.QL_player === undefined) {
            setTimeout(main, 300);
            return;
        }

        var appendCallback = function(original, toAppend){ // from coursera src
            return function(){
                var that = this;
                var returnVal = original.call(that, arguments);
                toAppend.call(that, arguments);
                return returnVal;
            }
        }
            
        var prependCallback = function(original, toPrepend){
            return function(){
                var that = this;
                toPrepend.apply(that, arguments);
                return original.apply(that, arguments);
            };
        };

                    
        QL_player.mediaelement_handle.enterFullScreen = prependCallback(QL_player.mediaelement_handle.enterFullScreen, function(){
            console.log("Trying to go chromeless fullscreen...");
            window.top.document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            $(window).resize();
        });

        QL_player.mediaelement_handle.exitFullScreen = appendCallback(QL_player.mediaelement_handle.exitFullScreen, function(){
            console.log("Trying to exit chromeless fullscreen...");
            window.top.document.webkitCancelFullScreen();
            $(window).resize();
        });

    };

    main();
};


if (!document.xmlVersion) {
    var script = document.createElement('script');
    script.appendChild(document.createTextNode('('+ mainWrapper +')();'));
    document.documentElement.appendChild(script);
}
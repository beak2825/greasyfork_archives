// ==UserScript==
// @name         Deep's blue da ba dee
// @namespace    BlueWorld
// @version      blue.4
// @description  And everything is blue
// @author       I'mBlue
// @match        https://torrentgalaxy.to/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://greasyfork.org/scripts/373326-rangyinputs/code/rangyinputs.js?version=637391
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373325/Deep%27s%20blue%20da%20ba%20dee.user.js
// @updateURL https://update.greasyfork.org/scripts/373325/Deep%27s%20blue%20da%20ba%20dee.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        if($("textarea#bbinput").length > 0) {
            $("#previewbutton").after("<button id='imbluedabadee' title=\"I'm blue\" class='btn btn-default btn-sm' style='border-color:blue;'>dabadee</button>");

            $("#imbluedabadee").click(function(e){
                e.preventDefault();
                $("textarea#bbinput").surroundSelectedText("[color=blue][size=4][align=center]", "[/align][/size][/color]");
            });
        }
    });
})();
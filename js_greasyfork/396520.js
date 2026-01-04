// ==UserScript==
// @name         mihura
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://play.afreecatv.com/pkdlwpans/220773575
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396520/mihura.user.js
// @updateURL https://update.greasyfork.org/scripts/396520/mihura.meta.js
// ==/UserScript==

$(function() {
    var addScript = document.createElement('script');
    addScript.src = 'http://code.jquery.com/ui/1.10.2/jquery-ui.js';
    addScript.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(addScript);

    var addScript1 = document.createElement('script');
    addScript1.src = 'http://code.jquery.com/jquery-1.9.1.min.js';
    addScript1.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(addScript1);


    var test = document.createElement("div");
    var button = document.createElement("button");
    test.id = "testArea";
    button.id = "testbutton";
    document.body.append(test);
    $("#mngr_menu").append(button);
    $("#test").dialog({
        autoOpen : false,
        position : {my:"left", at:"left top"},
        modal : true,
        resizable : true,
        buttons : {
            "닫기" : function(){
                $(this).dialog("close");
            }
        }
    });
});
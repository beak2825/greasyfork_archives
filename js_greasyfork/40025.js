// ==UserScript==
// @name         Overwrite All
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ui
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ccpro.filesys
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ccpro.switch_ui
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/40025/Overwrite%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/40025/Overwrite%20All.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("body").append("<a class='ow-all' style='position:fixed; bottom:10px; right:175px; padding: 2px 10px; border: 2px solid #0072aa; border-radius: 20px;'>Overwrite All</a>");
    $("body").append("<a class='check-250' style='position:fixed; bottom:10px; right:275px; padding: 2px 10px; border: 2px solid #0072aa; border-radius: 20px;'>Submit 0-250</a>");

    $("body").on("click", ".ow-all", function(){
        var frame = $("#fs_content").contents().find("#fs_list")[0];
        var doc = frame.contentDocument || frame.contentWindow.document;
        var retryBtns = doc.getElementsByClassName("qq-upload-retry");
        for(var i=0; i< retryBtns.length; i++){
            retryBtns[i].click();
        }
    });
    var current = 0;
    var increment = 250;
    $("body").on("click", ".check-250", function(){
        var frame = $("#fs_content").contents().find("#fs_list")[0];
        var doc = frame.contentDocument || frame.contentWindow.document;
        var checkBoxes = doc.querySelectorAll("[name='view_filesystem_list_selection']");
        for(var i=0; i< checkBoxes.length; i++){
            if(checkBoxes[i].checked == true){
                checkBoxes[i].click();
            }
        }
        for(var i=current; i< Math.min(current+increment, checkBoxes.length); i++){
                checkBoxes[i].click();
        }
        $("[title='Submit'].iw-base-heading-right-link").click();
        current += increment;
        $(".check-250").text("Click " + current + " - " + (current + increment));
        //alert("done");
    });
    // Your code here...
})();
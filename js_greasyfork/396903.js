// ==UserScript==
// @name         Anti-Fishing
// @name:he      Anti-Fishing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Don't get fished
// @description:he Don't get fished
// @require      https://code.jquery.com/jquery-1.12.4.js
// @author       WhoAmI
// @match        https://www.fxp.co.il/showthread.php?t=*
// @match        https://www.fxp.co.il/chat.php
// @match        https://www.fxp.co.il/chat.php?pmid=*
// @match        https://www.fxp.co.il/private_chat.php?do=showpm&pmid=*
// @downloadURL https://update.greasyfork.org/scripts/396903/Anti-Fishing.user.js
// @updateURL https://update.greasyfork.org/scripts/396903/Anti-Fishing.meta.js
// ==/UserScript==

var whiteList = ["https://www.mako.co.il", "paid.outbrain.com"];

(function() {
    'use strict';

    if(localStorage.whiteList == undefined){
     localStorage.whiteList = whiteList;
    }else{
    whiteList = localStorage.whiteList.split(",");
    }

    setupListeners();

    $('.toplogin ').append('<img id="edit_whitelist_of_sites" class="pmicon initial loading" height="50" width="50" src="https://i.ibb.co/YhrfTwN/edit.png">');
   $('.toplogin ').append('<img id="add_to_whitelist_of_sites" class="pmicon initial loading" height="50" width="50" src="https://s3.amazonaws.com/static.graphemica.com/glyphs/i500s/000/007/186/original/002B-500x500.png?1275320936">');

     $('.toplogin ').append('<div id="myModal1" class="modal"><div class="modal-content"><span id="close_my_modal" class="close">×</span><textarea id="whitelist_urls"stlye="height:500px;direction: ltr;"></textarea></div></div></div>');
      $(document.body).append('<style>textarea{width:80%;height:50%;direction:ltr;text-align:center; top:10%;position:relative;} .close {color: #aaa;float: right;font-size: 28px;font-weight: bold;}.close:hover,.close:focus {color: black;text-decoration: none;cursor: pointer;}.modal-content {position: relative;background-color: #fefefe;margin: auto;padding: 0;border: 1px solid #888;width: 80%;box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);animation-name: animatetop;animation-duration: 0.4s}.modal { text-align:center; display: none;position: fixed; z-index: 1;left: 0;top: 0; width: 100%;height: 100%;overflow: auto; background-color: rgb(0,0,0);background-color: rgba(0,0,0,0.4);}.modal-body {padding: 2px 16px;}.modal-footer { padding: 2px 16px;background-color: #5cb85c;color: white;}</style>');

    $('#edit_whitelist_of_sites').on("click" , function(){
        $('#myModal1').css("display", "block");
         $("#whitelist_urls").val(localStorage.whiteList);
    });

     $('#close_my_modal').on("click" , function(){
          localStorage.whiteList = $("#whitelist_urls").val().replace(/\s/g, '');;

          $('#myModal1').css("display", "none");
     });

     $('#add_to_whitelist_of_sites').on("click" , function(){
        $("#postlist").find('a').mousedown(function() {

            var url = $(this).attr('href');
            if(!whiteList.includes(url.split("//")[1].split("/")[0])){
             whiteList+= "," + url.split("//")[1].split("/")[0];
             localStorage.whiteList = whiteList;
            }
            alert("הקיישור התווסף לרשימה");
           setupListeners();
     });
   });

    $('#pm_holder').on('load', function() {

        $('#pm_holder').contents().find('a').hover(function() {
            var url = $(this).attr('href');
            if ($(this).isExternal() && !url.startsWith("https://www.fxp.co.il") && !whiteList.includes(url.split("//")[1].split("/")[0])) {
           $(this).append('<img id="image" height="50" width="50" style ="position:absolute;z-index: 9999;" src="https://i.ibb.co/Fsc14FQ/warning.png">');
            }
        }, function() {
            var url = $(this).attr('href');
            if ($(this).isExternal() && !url.startsWith("https://www.fxp.co.il")) {
                $(this).find('#image').remove()
       
            }
        });

        $('#pm_holder').contents().find('a').mousedown(function() {

            var url = $(this).attr('href');

            if ($(this).isExternal() && !url.startsWith("https://www.fxp.co.il")) {
                if ($(this).text().startsWith("http") && $(this).text() !== url) {

                    if (confirm("טקסט הקישור והקישור עצמו שונים, אנא היזהר מפישינג")) {
                        window.open(url);
                        return;
                    }
                }
            }

        });
    });

})();

function setupListeners() {

    $("#postlist").find("a").hover(function() {
            var url = $(this).attr('href');
            if ($(this).isExternal() && !url.startsWith("https://www.fxp.co.il") && !whiteList.includes(url.split("//")[1].split("/")[0])) {
                $(this).append('<img id="image" height="50" width="50" style ="position:absolute;z-index: 9999;" src="https://i.ibb.co/Fsc14FQ/warning.png">');
                console.log("in on " + $(this).attr("href"))
            }
        },
        function() {
            var url = $(this).attr('href');
            $(this).find('#image').remove()
        });

    var comp = new RegExp(location.host);

    var url = window.location.toString();

     $("#postlist").find('a').mousedown(function() {

        var url = $(this).attr('href');

        if ($(this).isExternal() && !url.startsWith("https://www.fxp.co.il")) {

            if ($(this).text().startsWith("http") && $(this).text() !== url) {

                if (confirm("טקסט הקישור והקישור עצמו שונים, אנא היזהר מפישינג")) {
                    window.open(url);
                    return;
                }

            }
        }

    });
}

$.fn.isExternal = function() {

    var host = window.location.host;
    var link = $('<a>', {
        href: this.attr('href')
    })[0].hostname;


    if ($('<a>', {
            href: this.attr('href')
        })[0] == "javascript://")
        return false;

    return (link !== host);

};
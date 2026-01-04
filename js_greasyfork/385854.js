// ==UserScript==
// @name         Skribbl.io Guess Input Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  :-)
// @author       Propper
// @match        https://skribbl.io/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/385854/Skribblio%20Guess%20Input%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/385854/Skribblio%20Guess%20Input%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

          var charCount=0;

            setInterval(function(){
                charCount = $('#currentWord').text().length;

                if(document.getElementById("addonCounter") === null){
                    $('#inputChat').after("<div id='addonCounter'>0/"+charCount+"</div>");
                    $("#addonCounter").css({"background-color": "yellow", "position": "relative","left":"0px","top":"-7px","z-index":"100","padding":"2px","letter-spacing":"2px","width":"333px","border-radius":"2px","padding-left":"13px","font-family": "monospace",
                                           "font-size": "16px"});
                    $("#inputChat").css({"font-family": "monospace", "font-size": "16px","letter-spacing":"2px"});
                }
                refreshCounter();
            }, 1000);

            $('#inputChat').keyup(function () {
                refreshCounter();
            });

            function refreshCounter() {
                var len = $('#inputChat').val().length;
                if(len==charCount)
                { $("#addonCounter").css({"background-color": "#2baa2b",});}
                else
                {$("#addonCounter").css({"background-color": "#ff5d64",});}

                $("#addonCounter").text($('#currentWord').text()+"   "+len+"/"+charCount);
            }


})();
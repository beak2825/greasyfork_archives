// ==UserScript==
// @name         AV-Wiki assist
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Hightlight Multi Actress color wood
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @author       Me
// @match        https://av-wiki.net/av-actress/*
// @match        https://av-wiki.net/*
// @icon         https://www.google.com/s2/favicons?domain=av-wiki.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/426035/AV-Wiki%20assist.user.js
// @updateURL https://update.greasyfork.org/scripts/426035/AV-Wiki%20assist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var defaulthidevr = false;
    var defaulthidemulti = true;
    $('.archive-title').append($("<h2><input type='checkbox' id = 'hidevr' name='hidevr'><label for = 'hidevr'>Hide VR</label></h2>"));
    $('.archive-title').append($("<h2><input type='checkbox' id = 'hidemulti' name='hidemulti'><label for = 'hidemulti'>Hide Multi Actress</label></h2>"));
    $("#hidevr").change(function(){
        if(this.checked){
            $("h2.archive-header-title > a").each(function(){
                if ($(this).text().startsWith("【VR】")){
                    $(this).parent().parent().parent().hide();
                }
            });
        }else{
            $("h2.archive-header-title > a").each(function(){
                if ($(this).text().startsWith("【VR】")){
                    $(this).parent().parent().parent().show();
                }
            });
        }
    });
    $("#hidemulti").change(function(){
        if(this.checked){
            $("li.actress-name").each(function(){
                if ($(this).text().includes("#")){
                    $(this).parent().parent().parent().hide();
                }
            });
        }else{
            $("li.actress-name").each(function(){
                if ($(this).text().includes("#")){
                    $(this).parent().parent().parent().show();
                }
            });

        }
    });
    $("h2.archive-header-title > a").each(function(){
        if ($(this).text().startsWith("【VR】")){
            $(this).css("background-color","chartreuse");
        }
    });
    $("li.actress-name").each(function(){
        if ($(this).text().includes("#")){
            $(this).parent().parent().parent().css("background-color","burlywood")
        }
    });


    $("article.archive-list header.archive-header ul li i.fa-circle-o").each(function(){
        var tid= $(this).parent().contents().filter(function() { return this.nodeType === 3; });
        tid.wrap('<a target="_blank" href=https://sukebei.nyaa.si/?f=0&c=0_0&q='+tid.text()+'></a>');
    });
    if(defaulthidevr){
        $("#hidevr").prop("checked",true);
        $("#hidevr").trigger("change");
    }
    if(defaulthidemulti){
        $("#hidemulti").prop("checked",true);
        $("#hidemulti").trigger("change");
    }
})();
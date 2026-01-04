// ==UserScript==
// @name         Lynda Subtitle Translate Tool ( moved to linkedin learning. not working)
// @namespace    https://github.com/coderantidote
// @version      0.5
// @description  You can add subtitles in any language while watching videos on Lynda.com.
// @author       Antidote
// @match        *.lynda.com/*
// @grant        none
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @require     http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416270/Lynda%20Subtitle%20Translate%20Tool%20%28%20moved%20to%20linkedin%20learning%20not%20working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416270/Lynda%20Subtitle%20Translate%20Tool%20%28%20moved%20to%20linkedin%20learning%20not%20working%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = jQuery.noConflict();
    function YandexWidget(){
        $('#course-feedback').before("<div class='translate-plugin'><div id=\"ytWidget\"></div><script src=\"https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=en&widgetTheme=dark&autoMode=true\" type=\"text/javascript\"></script></div>");
    };
    function NoTranslate(){
        var whitelist = ["#sidebar-container", ".breadcrumb", ".headline-from",".headline-course-title","#eyebrow","#course-tags",".course-actions","#footer","",".default-title","title","#suggested-courses"];
        whitelist.forEach(function(entry) {
            $(entry).attr("translate","no")
        });
    }
    function LyndaToolbar(){
        $(".translate-plugin").remove();
        $('#video-container').after('<div class="section-module" translate="no"><h3 >Lynda Subtitle Translate Tools</h3><br><button id="btn-start" class="btn ga hidden-xs hidden-sm">Subtitle Mode</button> <button id="btn-hide-widget" class="btn ga hidden-xs hidden-sm">Hide</button><strong style="padding-left:4px">Text color : <input id="subcolor" type="color" value="#ffffff" /></strong><strong style="padding-left:4px">Text size(px): <input style="max-width: 45px;" id="subtxtsize" type="number" value="23" ></strong></div>');
    }
    $( document ).ready(function() {
        console.log( "Lynda Subtitle Translate Tool is Ready!" );
        NoTranslate();
        LyndaToolbar();
        $( "#btn-start" ).click(function() {
            console.log( "Starting Translate!" );
            YandexWidget();
        });
        let flag = false
        $( "#btn-hide-widget" ).click(function() {
            if(flag == false){
                $(".translate-plugin").remove();
                $(this).text("Show");
                flag=true
            }else{
                YandexWidget();
                $(this).text("Hide");
                flag=false
            }
        });
    });
    /*
    Translate Automation
   */
    $(document).on("DOMSubtreeModified", ".mejs-captions-text", function() {
        $(this).hide();
        $("#dragsubtitle").remove();
        $(this).before("<b style='padding-left:4px;font-size:"+ $('#subtxtsize').val() +"px;color:"+ $('#subcolor').val() +"' id='dragsubtitle' class='ui-widget-content'>" + $('.transcript.ga.current').text() + "<br /></b>");
    });
})();
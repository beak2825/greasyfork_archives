// ==UserScript==
// @name         JIRA Script Sprint BacklogPro
// @author       Miguel Ángel Romero Lluch
// @include      https://agil.*.com/secure/RapidBoard*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description  Script which improves JIRA planning view for Sprints.
// @version      1.0.1
// @namespace https://greasyfork.org/users/174568
// @downloadURL https://update.greasyfork.org/scripts/39422/JIRA%20Script%20Sprint%20BacklogPro.user.js
// @updateURL https://update.greasyfork.org/scripts/39422/JIRA%20Script%20Sprint%20BacklogPro.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(document).ready(function() {

    /**
     * Function to render all Jira changes
     */
    function renderJiraChanges() {
        setTimeout(function() {
            //Move Estatus
            var endPositionOffsetList = $(".ghx-estimate");
            if (('undefined' !== typeof endPositionOffsetList) && (endPositionOffsetList) && (endPositionOffsetList.length)) {
                endPositionOffsetList.each(function(i, objInput) {
                    var elementToChange = $($(".ghx-extra-field-content")[i]);
                    ( elementToChange ).insertBefore(objInput);
                });

                //Delete all extra fields divs
                $(".ghx-plan-extra-fields").remove();
            }


            //Add CSS styles
            var statusList = $(".ghx-extra-field-content");
            if (('undefined' !== typeof statusList) && (statusList) && (statusList.length)) {
                statusList.addClass("jira-issue-status-lozenge aui-lozenge");
                statusList.css({
                    "margin-right":"5px",
                    "width":"76px",
                    "display":"inline-block",
                    "font-size":"10px"
                });

                statusList.each(function(i, objInput) {
                    var obj = $(objInput);
                    var objHtml = obj.html();

                    if ((objHtml.toLowerCase() == "en progreso") || (objHtml.toLowerCase() == "en validacion") || (objHtml.toLowerCase() == "code review")) {
                        obj.css({"background-color":"#ffd351", "border-color":"#ffd351", "color":"#594300"});
                    }

                    if (objHtml.toLowerCase() == "pendiente") {
                        obj.css({"background-color":"#bbbbbb"/*"#4a6785"*/ , "border-color":/*"#4a6785"*/ "#bbbbbb", "color":"#fff"});
                    }

                    if ((objHtml.toLowerCase() == "listo") || (objHtml.toLowerCase() == "hecho")) {
                        obj.css({"background-color":"#14892c", "border-color":"#14892c", "color":"#fff"});
                    }

                    if (objHtml.toLowerCase() == "bloqueado") {
                        obj.css({"background-color":"black", "border-color":"#bbbbbb", "color":"#fff"});
                    }
                });
            }

            //Add color to background tasks
            //<div class="ghx-issue-content" style="background-color:#f7eaf9;">
            //<div class="ghx-grabber" style="background-color:#b800cc;"></div>  //pequeno
            var businessList = $(".ghx-grabber");
            if (('undefined' !== typeof businessList) && (businessList) && (businessList.length)) {
                businessList.each(function(i, objInput) {
                    var obj = $(objInput);
                    if (obj.css("background-color") == "rgb(184, 0, 204)") {
                        obj.prev().css({"background-color":"#e7b8ee"});
                    }
                });
            }
        }, 2000);
    }

    //Loop to set changes each n seconds
    var intervalTime = setInterval(function() {
      if (/\bview=planning\b/.test(location.search) ) {
        renderJiraChanges();
      }
    },500);

});

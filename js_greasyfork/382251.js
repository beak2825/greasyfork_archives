// ==UserScript==
// @name         Hubspot Automail
// @namespace    http://www.fiver.com/jorgequint
// @version      1
// @description  Script for automating hubspot.com
// @author       Jorge Quintero
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/0.8.3/jquery.csv.js
// @match        https://app.hubspot.com/contacts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382251/Hubspot%20Automail.user.js
// @updateURL https://update.greasyfork.org/scripts/382251/Hubspot%20Automail.meta.js
// ==/UserScript==

(function() {
    function get_url(){
        return window.location.href;
    }
    
    function we_in(path){
        var _a = get_url().indexOf(path);
        if( _a >= 0 ){
           return true;
        }else{
            return false;
        }
    }
    
    function process_action(){
        if( count <= 0 ){
           toggle_bot_activity();
        }
        var is_panel_shown = $(".floating-panel-is-email").length; //check if exists
        var is_content_empty = $(".public-DraftStyleDefault-block span").children().html() == ""; //check if empty
        
        var is_template_popup_shown = $('[data-key="dialogHeader.templates"]').length; // check if template selection dialog exists
        var is_template_buttons_shown = $('.private-modal__container a.private-link').length; // check if template selection dialog exists
        
        var is_send_button_enabled = $('[data-key="queues.playlist.interaction.saveAndCompleteLabel.email"]').parent().attr("aria-disabled") == "false";
        
        var is_next_button_shown = $('[data-key="QueueTopbar.next"]').length; //next button
        
        
        var step = 0;

        if(is_panel_shown && is_content_empty && !is_template_buttons_shown ){
            $("[data-key='customerDataContent.SalesContentMenu.buttons.templates']").parent().click(); // click on "templates" button
            //step++;
        }else if( is_template_popup_shown && is_template_buttons_shown){
            var all_templates = $('.private-modal__container a.private-link'); // we get all buttons inside de template dialog selection. we should select the one that says "Template 1"
            $.each(all_templates, function(i,v){
                if( v.text == "Template 1" ){
                    v.click();
                }
            });
            //step++;
        }else if( is_send_button_enabled ){
            $('[data-key="queues.playlist.interaction.saveAndCompleteLabel.email"]').click(); // we send the data
            var my_random_value = Math.floor(Math.random() * 160) + 60;
            time_left = my_random_value;
            timeout_for_next = false;
            var nextTimeout = setTimeout(function(){ timeout_for_next = true; }, my_random_value * 1000);
        }else if( is_next_button_shown && timeout_for_next ){
            $('[data-key="QueueTopbar.next"]').click() //next button
            timeout_for_next = false;
            count--;
            time_left = 0;
            $("#amount_bot_repeat").val(count);
        }
        
        if(time_left){
            time_left--;
            $('#toggle_bot_btn [data-key="QueueTopbar.skipBtn"]').html(time_left);
        }else{
            $('#toggle_bot_btn [data-key="QueueTopbar.skipBtn"]').html("Working...");
        }
    }
       
    ///////////////////////////////////////////////////////
    
    function toggle_bot_activity(){
        if( !bot_active ){
            var times_to_repeat = $("#amount_bot_repeat").val();
            count = parseInt(times_to_repeat);
            interval_2 = setInterval(process_action, 1000);
            bot_active = true;
        }else{
            clearInterval(interval_2);
            clearTimeout(nextTimeout);
            count = 0;
            timeout_for_next = true;
            time_left = 0;
            
            bot_active = false;
            $('#toggle_bot_btn [data-key="QueueTopbar.skipBtn"]').html("Start Bot");
        }
    }
    
    if( we_in('/tasks-queue/') ){
        
        var interval_1 = setInterval(init_script, 1000);
        var bot_active = false;
        
        var count = 0;
        var interval_2 = false;
        var timeout_for_next = true;
        var nextTimeout = false;
        var time_left = 0;
        
        function init_script(){
            if( $('.queue-tasks-topbar .align-center.UIColumn-content').length ){
                clearInterval(interval_1);
                var btn_string = '<a id="toggle_bot_btn" class="primary-link"><i18n-string data-locale-at-render="en-gb" data-key="QueueTopbar.skipBtn">Start Bot</i18n-string></a> <input type="text" size="13" class="primary-link" id="amount_bot_repeat" placeholder="Times to repeat...">';
                $(btn_string).insertBefore('.navSearch');
                //$(btn_string).insertBefore('.queue-tasks-topbar .align-center.UIColumn-content');
                $("#toggle_bot_btn").on("click", toggle_bot_activity);
            }
        }
        
        
        //setInterval(process_action,1000);
    }
        
        
        // if floating panel exists and content is empty
   
    
})();
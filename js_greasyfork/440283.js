// ==UserScript==
// @name         P Pusher
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Script to help you stay 🅿️ushin 🅿️ on WhatsappWeb
// @author       Arnav Menon
// @license      MIT
// @match        https://web.whatsapp.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/440283/P%20Pusher.user.js
// @updateURL https://update.greasyfork.org/scripts/440283/P%20Pusher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$,
        addListenerInterval = null,
        p_string = '',
        chat_name = '',
        is_debug = true;


    //Log debug 
    var debugMessage = function(mes){
        if(is_debug){
            console.info(mes);
        }
    };

    //ALert error
    var showError = function(err){
        alert(err);
        console.error(err);
    };

    //Alter user input
    var onInput = function(){
        var _this = $(this);
        var _input = $.trim(_this.text());
        var p_emoji = String.fromCodePoint(0x1F17F);
        p_string=_input.replace(/[pP]/g, p_emoji);
        _this.val(p_string);
    };

    //Check for Enter key press
    var onEnterKeyPressed = function( event ) {
        if (event.which == 13 ) {
            event.preventDefault();
            var _this = $(this);
            debugMessage('Message after pushin p: '+p_string);
            sendP(_this, p_string);
        }
    };

    //Send altered message
    var sendP = function(inputTarget, message){
        inputTarget.focus();
        document.execCommand("selectAll");
        document.execCommand("insertText", false, message);

        if($('footer button:has(span):last span').data('icon') == 'send'){
            $('footer button:has(span):last').click();
        }
        else{
            showError('Not able to push P');
        }
    }

    //Bind functions to push p
    var addPushinP = function(){
        if(!chat_name){
            showError('Cannot get selected chatbox');
            return;
        }

        var $_input_body = $('footer div.copyable-text.selectable-text');

        $_input_body
            .on('input', onInput)
            .on('keydown', onEnterKeyPressed);
    };

    //Add listener when user selects new chatbox in WAweb
    addListenerInterval = setInterval(function(){

        var $chat_sidebar_div = $('#pane-side');
        if($chat_sidebar_div.length){

            var contacts = document.querySelector('div[role="grid"]').children;
            if(!contacts || contacts.length === 0){
                showError('Not able to get chatbox list from sidebar');
                return;
            }

            var chat_class = contacts[0].className;

            $('#pane-side').on('click','div.'+ chat_class, function(){

                var pre_chat_name = '';
                $(this).find('span').each(function(i,x){
                    if(x.hasAttribute('title')) {
                        pre_chat_name = x.title;
                        return false;
                    }
                });

                if(pre_chat_name !== ''){
                    chat_name = encodeURI(pre_chat_name); 
                    debugMessage('Chat selected: ');
                    debugMessage(chat_name);
                }

                else{showError('Not able to get selected chatbox');}

                addPushinP();
            });

            clearInterval(addListenerInterval);
        }
    }, 1000);

})();
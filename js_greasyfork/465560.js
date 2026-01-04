// ==UserScript==
// @name         OpenAI Playground (ChatGPT) - Continue Button
// @namespace    https://greasyfork.org/en/users/10118-drhouse
// @version      3.0
// @description  press the [Continue] button instead of 'Add message > type continue > Ctrl+Enter', configure panel optionally saves 'Temperature', 'Maximum Length' and 'Instructions'
// @include      https://platform.openai.com/playground*
// @match        https://platform.openai.com/playground*
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @require      https://greasyfork.org/scripts/439099-monkeyconfig-modern-reloaded/code/MonkeyConfig%20Modern%20Reloaded.js?version=1012538
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @downloadURL https://update.greasyfork.org/scripts/465560/OpenAI%20Playground%20%28ChatGPT%29%20-%20Continue%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/465560/OpenAI%20Playground%20%28ChatGPT%29%20-%20Continue%20Button.meta.js
// ==/UserScript==
/* global jQuery, $ */
this.$ = this.jQuery = jQuery.noConflict(true);
(function($){

    setTimeout(function(){
        var cfg = new MonkeyConfig({
            title: 'Configure',
            menuCommand: true,
            params: {
                'Automatic Temperature': {
                    type: 'checkbox',
                    default: true
                },
                'Temperature': {
                    type: 'number',
                    default: '1'
                },
                'Automatic Maximum Length': {
                    type: 'checkbox',
                    default: true
                },
                'Maximum Length': {
                    type: 'number',
                    default: '2048'
                },
                'Automatic Instructions': {
                    type: 'checkbox',
                    default: true
                },
                chatGPT_instructions: {
                    type: 'text',
                    default: ''
                },

            },
            // onSave: setOptions
        })

        GM_setValue('fullcontent','')
        var rootpath = "#root > div.route-container > div > div.pg-root.page-body.full-width.flush > div > div.pg-body";
        var path = rootpath + " > div.pg-editor > div > div > div.chat-pg-right-wrapper > div.chat-pg-footer > span > button.btn.btn-sm.btn-minimal.btn-neutral"
        $('<button id="continue" tabindex="0" class="btn btn-sm btn-filled btn-primary" type="button" data-testid="pg-submit-btn" aria-haspopup="true" aria-expanded="false"><span class="btn-label-wrap"><span class="btn-label-inner">Continue&zwj;</span></span></button>').insertAfter(path)

        var e = jQuery.Event("keypress");
        e.which = 9; 
        e.keyCode = 9;

        if (cfg.get('Automatic Temperature')) {
            $(rootpath + " > div.pg-right > div.pg-right-content > div > div > div:nth-child(3) > div > div.css-1povu0j > input").val(Number(cfg.get('Temperature')))
            $(rootpath + " > div.pg-right > div.pg-right-content > div > div > div:nth-child(3) > div > div.css-1povu0j > input").focus().trigger(e);    
        }

        if (cfg.get('Automatic Maximum Length')) {
            $("body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)").val(Number(cfg.get('Maximum Length')))
            $("body > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)").focus().trigger(e);
        }

        // chat-pg-instructions
        $(rootpath + ' > div.pg-editor > div > div > div:nth-child(1) > div > div.text-input-header-wrapper.overflow-wrapper.text-input > textarea').focus()

        if (cfg.get('Automatic Instructions')) {
            $(rootpath + ' > div.pg-editor > div > div > div:nth-child(1) > div > div.text-input-header-wrapper.overflow-wrapper.text-input > textarea').text(cfg.get('chatGPT_instructions'))
        }

        $("button[id='continue']").click(function(){
            $(rootpath + " > div.pg-editor > div > div > div.chat-pg-right-wrapper > div.chat-pg-panel-wrapper > div > div > div.chat-pg-message.add-message")[0].click()   
            setTimeout(function(){
                $(rootpath + " > div.pg-editor > div > div > div.chat-pg-right-wrapper > div.chat-pg-panel-wrapper > div > div > div:nth-child(3) > div.text-input-with-focus > textarea").text('continue')
            }, 500); 
            setTimeout(function(){
                $(rootpath + " > div.pg-editor > div > div > div.chat-pg-right-wrapper > div.chat-pg-footer > span > button:nth-child(1)")[0].click()
            }, 1000); 
        });

    }, 1000);
})(jQuery);
// ==UserScript==
// @name         Imperia Online Extensions
// @namespace    tar
// @version      1.10
// @description  try to take over the world!
// @author       ChoMPi
// @match        http://*.imperiaonline.org/imperia/game_v6/game/village.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/16236/Imperia%20Online%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/16236/Imperia%20Online%20Extensions.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var isActive = false;
var chatWrapper;
var chatBox;
var chatBoxMessages;
var messageInput;
var loading;
var interval = 10000; // Time in milliseconds

function handle_mousedown(e)
{
    if ($(e.target).hasClass('message') || $(e.target).hasClass('username'))
    {
        return;
    }
    
    window.my_dragging = {};
    my_dragging.pageX0 = e.pageX;
    my_dragging.pageY0 = e.pageY;
    my_dragging.elem = chatWrapper;
    my_dragging.offset0 = $(chatWrapper).offset();
    
    function handle_dragging(e)
    {
        var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
        var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
        $(my_dragging.elem).offset({top: top, left: left});
    }
    
    function handle_mouseup(e)
    {
        $('body').off('mousemove', handle_dragging).off('mouseup', handle_mouseup);
    }
    
    $('body').on('mouseup', handle_mouseup).on('mousemove', handle_dragging);
}

function populateChat(data)
{
    var messages = $(data).find("#messageboxMessages").html();
    messages = messages.replace("<![CDATA[S", "").replace("]]>", "");
    messages = $(messages).find(".comment-section");
    
    messages.find(".comment").each(function(e, i)
    {
        var status = $(this).find('.table-icons');
        var user = $(this).find('.username');
        var msg = $(this).find('p > span');
        
        if (msg.length == 0)
        {
            var temp = $(this).clone();
            temp.find('.username').remove();
            temp.find('.date').remove();
            msg = $('<div class="resources-bar" style="line-height: 18px; padding: 6px; margin: 4px 0 0 0;border-bottom: 1px solid #9A8C70;"><span class="original-message">' + temp.text() + '</span></div>');
        }
        
        status.css('margin-left', '-8px');
        user.removeClass('fleft');
        msg.addClass('message');
        $(this).css('padding-bottom', '5px');
        $(this).css('margin-top', '6px');
        
        $(this).html(((status.length > 0) ? status[0].outerHTML : '') + user[0].outerHTML + ":&nbsp;" + msg[0].outerHTML);
    });
    
    loading.hide();
    chatBoxMessages.html(messages.html());
}

function pullMessages()
{
    if (!isActive)
    {
        return;
    }
    
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php",
    {
        xjxfun: "viewConversationMessages",
        xjxr: Date.now(),
        xjxargs: ["Sconversations", "<xjxobj><e><k>tab</k><v>N3</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(data){
        populateChat(data);
    }, "xml");
}

function sendMessage(event)
{
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php",
    {
        xjxfun: "doConversationMessagesCreate",
        xjxr: Date.now(),
        xjxargs: ["Sconversations", "<xjxobj><e><k>tab</k><v>N3</v></e><e><k>data</k><v><xjxobj><e><k>txtMsg</k><v>S<![CDATA[" + messageInput.val() + "]]></v></e><e><k>send_message</k><v>SSend</v></e></xjxobj></v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(data){
        populateChat(data);
    }, "xml");
    
    messageInput.val("");
    
    return false;
}

function addXMLRequestCallback(callback)
{
    XMLHttpRequest.newCallback = callback;
    XMLHttpRequest.oldSend = XMLHttpRequest.prototype.send;
    // override the native send()
    XMLHttpRequest.prototype.send = function()
    {      
        var self = this;
        this.addEventListener("readystatechange", function()
        {
            if (self.readyState == 4 && self.status == 200) {
                XMLHttpRequest.newCallback(self);
            }
        }, false);
        this.requestData = (arguments.length > 0) ? decodeURIComponent(arguments[0]) : null;
        // call the native send()
        XMLHttpRequest.oldSend.apply(this, arguments);
    }
}

function timeSince(date)
{
    var seconds = Math.floor((new Date() - date) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(seconds / 3600);
    var days = Math.floor(seconds / 86400);
    var months = Math.floor(seconds / 2592000);
    var years = Math.floor(seconds / 31536000);

    if (seconds < 60) {
        return Math.floor(seconds) + " seconds";
    }
    else if (minutes < 60) {
        return minutes + ' minute' + (minutes > 1 ? 's' : '');
    }
    else if (hours < 24) {
        return hours + ' hour' + (hours > 1 ? 's' : '');
    }
    else if (days < 30) {
        return days + ' day' + (days > 1 ? 's' : '');
    }
    else if (months < 12) {
        return months + ' month' + (months > 1 ? 's' : '');
    }
    else {
        return years + ' year' + (years > 1 ? 's' : '');
    }
}

function GetSpyRowID(element)
{
    return $(element).next().attr('id').replace('hidden-tr-', '');
}

function GetSpyNotes()
{
    if (typeof localStorage.imperia_spy_notes != 'undefined') {
        GM_setValue('imperia_spy_notes', localStorage.imperia_spy_notes);
        delete localStorage.imperia_spy_notes;
    }
    
    var notes = GM_getValue('imperia_spy_notes', '0');
    
    if (typeof notes == '0')
        return {};
    
    return JSON.parse(notes);
}

function GetSpyNote(id)
{
    var notes = GetSpyNotes();
    if (typeof notes[id] != 'undefined') {
        return notes[id];
    }
    return '';
}

function SaveSpyNote(id, note)
{
    var notes = GetSpyNotes();
    notes[id] = note;
    GM_setValue('imperia_spy_notes', JSON.stringify(notes));
}

function OnWindowEspionage()
{
    var opCenter = $('#operation-center .spy-wrapper');
    var dataGrid = $('.data-grid', opCenter);
    
    if (dataGrid.length > 0)
    {
        dataGrid.find('tr.stripe').each(function(i, e)
        {
            var id = GetSpyRowID(e);
            var noteText = GetSpyNote(id);
            
            var lastAttack = GetLastAttackString(id);
            if (lastAttack != '')
            {
                var attackField = $('<div style="font-size:12px; padding-top:3px; color: #632626;">Last attack order: ' + lastAttack + ' ago</div>');
                $('td:eq(1)', e).append(attackField);
            }
            
            var noteField = $('<div style="font-size:12px; padding-top:3px; color: #675E49; ' + (noteText == '' ? 'display:none;' : '') + '">' + noteText + '</div>');
            $('td:eq(1)', e).append(noteField);

            var form = $('<form onSubmit="return false;" style="display:none;"><textarea rows="2" cols="40"></textarea><br><input class="button" type="submit" value="Save" /></form>');
            $('td:eq(1)', e).append(form);
            
            var button = $('<a href="javascript:void(0);" id="' + id + '" class="button icons rename-bookmark" title="Set Note"><span></span></a>');
            $('td.actions div', e).append(button);
            
            form.submit(function()
            {
                SaveSpyNote(id, $('textarea', form).val());
                noteField.html($('textarea', form).val());
                form.fadeOut('fast', function()
                {
                    if (noteField.html() != '')
                        noteField.fadeIn('fast');
                });
                return false;
            });
            
            button.click(function()
            {
                if (form.is(':visible')) {
                    form.fadeOut('fast', function() {
                        if (noteField.html() != '') {
                            noteField.fadeIn('fast');
                        }
                    });
                } else {
                    $('textarea', form).val(GetSpyNote(id));
                    noteField.fadeOut('fast', function() {
                        form.fadeIn('fast');
                    });
                }
            });
        });
    }
}

function GetLastAttacks()
{
    if (typeof localStorage.imperia_last_attacks != 'undefined') {
        GM_setValue('imperia_last_attacks', localStorage.imperia_last_attacks);
        delete localStorage.imperia_last_attacks;
    }
    
    var attacks = GM_getValue('imperia_last_attacks', '0');
    
    if (attacks == '0')
        return {};
    
    return JSON.parse(attacks);
}

function GetLastAttack(id)
{
    var attacks = GetLastAttacks();
    if (typeof attacks[id] != 'undefined') {
        return parseInt(attacks[id]);
    }
    return 0;
}

function GetLastAttackString(id)
{
    var attackTime = GetLastAttack(id);
    if (attackTime > 0) {
        return timeSince(attackTime);
    }
    return '';
}

function SaveLastAttack(id, time)
{
    var attacks = GetLastAttacks();
    attacks[id] = time;
    GM_setValue('imperia_last_attacks', JSON.stringify(attacks));
}

function OnDoAttack(requestData, response)
{
    var id;
    var userid = requestData.match(/<e><k>dUserId<\/k><v>S(\d+)<\/v><\/e>/)[1];
    var provinceid = requestData.match(/<e><k>dProvinceId<\/k><v>S(\d+)<\/v><\/e>/)[1];
    var name = requestData.match(/<e><k>dName<\/k><v>S([\_\-\.a-zA-Z0-9]*)<\/v><\/e>/)[1];

    // Check if it's NPC or player
    if (name == '' || name.substring(0, 3) == 'NPC') {
        id = userid + '-' + provinceid;
    } else {
        id = userid + '-' + name;
    }
    
    // Check the response for error
    if (response.match(/\<cmd cmd\=\"as\" id\=\"errorContainerOperationCenter\" prop\=\"innerHTML\"\>/)) {
        return;
    }
    
    SaveLastAttack(id, new Date().getTime());
}

function Init()
{
    addXMLRequestCallback(function(xhr) {
        if (xhr.requestData != null) {
            // Check for the espionage window
            if (xhr.requestData.indexOf('xjxfun=viewOperationCenter') > -1) {
                if (xhr.response.indexOf('tab-espionage active') > -1) {
                    OnWindowEspionage();
                }
            }
            // Check for attack
            if (xhr.requestData.indexOf('xjxfun=doAttack') > -1) {
                if (xhr.requestData != null) {
                    OnDoAttack(xhr.requestData, xhr.response);
                }
            }
        }
    });
    
    $('<style type="text/css">' +
      '#chat_wrapper .comment-section::-webkit-scrollbar{ width:15px;background:rgba(111,98,66,0.4); }' +
      '#chat_wrapper .comment-section::-webkit-scrollbar-thumb{ background-color:#87795D;border:1px solid #554D3B;border-radius:4px; }' +
      '#chat_wrapper .comment-section::-webkit-scrollbar-thumb:hover{ background-color:#8F8063; }' +
      '#chat_wrapper { position:fixed;left:2px;bottom:88px;z-index:100;width:500px;height:161px;display:none;-webkit-user-select:text;-khtml-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text; }' +
      '#chat_wrapper .comment-section { padding:1px 8px 0px 8px;margin:0;width:500px;height:140px;overflow-x:hidden;overflow-y:scroll;box-shadow:1px 1px 20px #000;border:1px solid #E8D4AC;background:#b2a07c url("../gui/bg_patern.png?v=7"); }' +
      '#chat_wrapper input { width:512px;margin-top:1px;opacity:0.7;color:#fff;background:rgba(45, 40, 29, 0.92);border:1px solid #E8D4AC;padding:2px; }' +
      '#chat_wrapper input:focus { opacity:1; }' +
      '#chat_wrapper input::-webkit-input-placeholder { color:#E8E8E8; } #chat_wrapper input:-moz-placeholder { color:#E8E8E8;opacity:1; } #chat_wrapper input::-moz-placeholder { color:#E8E8E8;opacity:  1; } #chat_wrapper input:-ms-input-placeholder { color:#E8E8E8; } #chat_wrapper input:placeholder-shown { color:#E8E8E8; }' +
      '#chat-button { position:fixed;bottom:41px;left:0px;z-index:201; }' +
      '</style>').appendTo("head");
                                                                                                    
    chatWrapper = $('<div id="chat_wrapper"></div>');
    $("body").append(chatWrapper);

    chatBox = $('<div class="comment-section"></div>');
    chatWrapper.append(chatBox);
    
    chatBoxMessages = $('<div style="padding:0;margin:0;"></div>');
    chatBoxMessages.mousedown(handle_mousedown);
    chatBox.append(chatBoxMessages);
    
    loading = $('<center style="margin-top: 70px;">Loading...</center>');
    chatBox.append(loading);
    
    var form = $('<form></form>');
    messageInput = $('<input type="text" placeholder="Send message" name="message" autocomplete="off" />');
    form.append(messageInput);
    form.on("submit", sendMessage);
    chatWrapper.append(form);
    
    chatWrapper.mousedown(function(){ chatWrapper.css("z-index", "1999"); });
    $(document).mousedown(function(event) {
        if ($(event.target).parents("#chat_wrapper").length == 0) {
            chatWrapper.css("z-index", "1000");
            messageInput.blur();
        }        
    });
    $(document).keypress(function(e) {
        if (isActive && e.which == 13) {
            if (!messageInput.is(":focus") && $(':focus').prop("tagName") != 'TEXTAREA' && $(':focus').prop("tagName") != 'INPUT') {
                messageInput.focus();
                chatWrapper.css("z-index", "1999");
            }
        }
    });
    
    var button = $('<div id="chat-button" class="ui"><div id="settings-holder" class="ui-bg" title="Tribune Chat"><div class="ui-icons help ps2"></div></div></div>');
    $('body').append(button);
    
    button.click(function()
    {
        if (isActive) {
            chatWrapper.fadeOut('fast');
            isActive = false;
        }
        else
        {
            chatWrapper.fadeIn('fast');
            isActive = true;
            pullMessages();
        }
    });
    
    setInterval(pullMessages, interval);
}

$(document).ready(function()
{
    function InitCheck()
    {
        if (!$('body').hasClass('loading'))
        {
            Init();
        }
        else
        {
            setTimeout(InitCheck, 500);
        }
    }
    InitCheck();
});
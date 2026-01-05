// ==UserScript==
// @name         Imperia Online Tribune Chat
// @namespace    tar
// @version      1.17
// @description  Addes a nice little chat to help you better communicate with your mates.
// @author       ChoMPi
// @match        http://*.imperiaonline.org/imperia/game_v6/game/village.php*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/1.1.7/jquery.linkify.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/16237/Imperia%20Online%20Tribune%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/16237/Imperia%20Online%20Tribune%20Chat.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var isActive = false;
var chatWrapper;
var tabsCont;
var generalTab;
var activeTab = { 
    id: 0, 
    userid: 0, 
    username: '' 
};
var chatBox;
var chatBoxMessages;
var messageInput;
var loading;
var interval = 10000; // Time in milliseconds
var timeout;
var maxMessages = 100;
var commands = [];

$.fn.reverse = [].reverse;

function handle_mousedown(e)
{
    if ($(e.target).hasClass('message') || $(e.target).hasClass('username')) {
        return;
    }
    
    if (e.button != 0) {
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

function ChatAddCommand(command)
{
    commands.push(command);
}

function pullMessages()
{
    clearTimeout(timeout);
    timeout = setTimeout(pullMessages, interval);
    
    if (!isActive)
    {
        return;
    }
    
    var tabid = parseInt(activeTab.id.toString());
    
    if (activeTab.id == 0)
    {
        var request = $.ajax({
            url: location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php",
            method: "POST",
            data: {
                xjxfun: "viewConversationMessages",
                xjxr: Date.now(),
                xjxargs: ["Sconversations", "<xjxobj><e><k>tab</k><v>N3</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"]
            },
            dataType: "xml"
        });
        
        request.done(function( data ) {
            populateChat(data, tabid, false);
        });
    }
    else
    {
        var request = $.ajax({
            url: location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php",
            method: "POST",
            data: {
                xjxfun: "viewConversationMessagesPersonalRead",
                xjxr: Date.now(),
                xjxargs: ["Sconversations", "<xjxobj><e><k>tab</k><v>N1</v></e><e><k>id</k><v>N" + activeTab.userid + "</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
            },
            dataType: "xml"
        });
        
        request.done(function( data ) {
            populateChat(data, tabid, true);
        });
    }
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function populateChat(data, tabid, personal)
{
    var e1 = $(data).find("#messageboxMessages");

    if (personal) {
        e1 = $(e1.get(1));
    } else {
        e1 = $(e1.get(0));
    }
    
    e1 = e1.html();
    e1 = e1.replace("<![CDATA[S", "").replace("]]>", "");
    e1 = $(e1).find(".comment-section");
    
    if (e1.length == 0) {
        loading.hide();
        return;
    }
    
    var messagesCont = chatBoxMessages.find('#tab-content-' + tabid);
    var messages = e1.find(".comment").reverse();
    
    messages.each(function(e, i)
    {
        var status = $(this).find('.table-icons');
        var user = $(this).find('.username');
        var msg = $(this).find('p > span');
        var id = msg.attr("data-msg-id");
        
        if (typeof id == 'undefined') {
            var temp = $(this).clone();
            temp.find('.username').remove();
            temp.find('.date').remove();
            msg = $('<div class="resources-bar" style="line-height: 18px; padding: 6px; margin: 4px 0 0 0;border-bottom: 1px solid #9A8C70;"><span class="original-message">' + temp.text() + '</span></div>');
            id = temp.text().hashCode();
        }
        
        if (messagesCont.find('.comment[data-msg-id="' + id + '"]').length > 0) {
            return;
        }
        
        $(this).attr("data-msg-id", id);
        
        if (msg.length == 0) {
            
        } else {
            msg.linkify({
                target: "_blank"
            });
        }
        
        //status.css('margin-left', '-8px');
        user.removeClass('fleft');
        msg.addClass('message');
        $(this).css('padding-bottom', '5px');
        $(this).css('margin-top', '6px');
        
        $(this).html(user[0].outerHTML + ":&nbsp;" + msg[0].outerHTML);
        messagesCont.prepend($(this));
        
        if (messagesCont.children().length > maxMessages)
        {
           messagesCont.children().last().remove(); 
        }
    });
    
    loading.hide();
}

function sendMessage(event)
{
    if (commands.length > 0)
    {
        for (var i = 0; i < commands.length; i++)
        {
            var command = commands[i];
            
            if (messageInput.val().substr(0, command.command.length) == command.command)
            {
                if (typeof command.capture != 'undefined' && command.capture)
                {
                    var capture = messageInput.val().substr(command.command.length + 1);
                    
                    if (capture.length > 0)
                    {
                        command.callback(capture);
                    }
                }
                else
                {
                    command.callback();
                }
                
                messageInput.val("");
                return false;
            }
        }
    }
    
    if (activeTab.id == 0)
    {
        $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
            xjxfun: "doConversationMessagesCreate",
            xjxr: Date.now(),
            xjxargs: ["Sconversations", "<xjxobj><e><k>tab</k><v>N3</v></e><e><k>data</k><v><xjxobj><e><k>txtMsg</k><v>S<![CDATA[" + messageInput.val() + "]]></v></e><e><k>send_message</k><v>SSend</v></e></xjxobj></v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
        },
               function(data) {
            populateChat(data, 0, false);
        }, "xml");
    }
    else
    {
        $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
            xjxfun: "doConversationMessagesCreate",
            xjxr: Date.now(),
            xjxargs: ["Sconversations", "<xjxobj><e><k>tab</k><v>N1</v></e><e><k>data</k><v><xjxobj><e><k>uname</k><v>S" + activeTab.username + "</v></e><e><k>send_to_ally</k><v>S0</v></e><e><k>txtMsg</k><v>S<![CDATA[" + messageInput.val() + "]]></v></e><e><k>send_message</k><v>SSend</v></e></xjxobj></v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
        },
               function(data) {
            pullMessages();
        }, "xml");
    }
    
    messageInput.val("");
    return false;
}

function OpenPrivateTab(username)
{
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "viewSettingTab",
        xjxr: Date.now(),
        xjxargs: ["SSetting", "<xjxobj><e><k>tab</k><v>Sbabysit</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function() {
        $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
            xjxfun: "doSearchBabysit",
            xjxr: Date.now(),
            xjxargs: ["SSetting", "<xjxobj><e><k>formData</k><v><xjxobj><e><k>userName</k><v>S" + username + "</v></e></xjxobj></v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
        },
        function(data) {
            var html = $(data).find("#messageboxSettingTab").html().replace("<![CDATA[S", "").replace("]]>", "");
            var content = $(html);

            if (content.find('.notice').length == 0) {
                var a = content.find('a.username').get(2);
                var search = /\'userId\'\:[\s](\d*)/i;
                var results = $(a).attr('href').match(search);

                if (results != null) {
                    var userid = parseInt(results[1]);
                    CreatePrivateTab(userid, $(a).text(), false);
                }
            }
        }, "xml");
    });
}

function CreatePrivateTab(userid, username, dontSave)
{
    var nextId = tabsCont.find('.tab').length;
    var tab = $('<a class="tab" data-tabid="' + nextId + '" data-userid="' + userid + '" data-username="' + username + '">' + username + '</a>');
    tabsCont.append(tab);
    var tabContent = $('<div class="tab-content" id="tab-content-' + nextId + '"></div>');
    chatBoxMessages.append(tabContent);
    if (dontSave) return;
    setActiveChatTab(tab);
    SavePrivateTab(userid, username);
}

function PrivateTabExists(username)
{
    var tabs = GetPrivateTabs();
    
    if (tabs.length > 0) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].username == username) {
                return true;
            }
        }
    }
    
    return false;
}

function setActiveChatTab(element)
{
    var id = parseInt($(element).attr('data-tabid'));
    var userid = $(element).attr('data-userid');
    
    if (activeTab.id != id) {
        var current = $('#chat_wrapper .chat-tabs .tab.active');
        if (current.length > 0) {
            current.removeClass('active');
        }
        chatBoxMessages.find('#tab-content-' + activeTab.id).hide();
        
        $(element).addClass('active');
        
        activeTab.id = id;
        chatBoxMessages.find('#tab-content-' + id).show();
        
        if (typeof userid != 'undefined' && userid.length > 0) {
            activeTab.userid = parseInt(userid);
            activeTab.username = $(element).attr('data-username');
        } else {
            activeTab.userid = 0;
            activeTab.username = '';
        }
        
        pullMessages();
    }
}

function CloseCurrentPrivateTab()
{
    if (activeTab.id > 0) {
        var tab = tabsCont.find('.tab[data-tabid="' + activeTab.id + '"]');
        if (tab.length > 0) {
            ClosePrivateTab(tab);
        }
    }
}

function ClosePrivateTab(element)
{
    var tab = $(element);
    var tabId = parseInt(tab.attr('data-tabid'));
    var userid = tab.attr('data-userid');
    
    if (tabId == 0) {
        return;
    }
    
    tab.remove();
    
    var tabs = GetPrivateTabs();
    
    if (tabs.length > 0) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].userid == userid) {
                tabs.splice(i, 1);
            }
        }
        
        GM_setValue('privatetabs' + uid, JSON.stringify(tabs));
    }
    
    setActiveChatTab(generalTab);
}

function GetPrivateTabs()
{
    var tabs = GM_getValue('privatetabs' + uid, null);
    
    if (tabs == null)
        return [];
    
    return JSON.parse(tabs);
}

function SavePrivateTab(userid, username)
{
    var tabs = GetPrivateTabs();
    
    if (tabs.length > 0) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].userid == userid) return;
        }
    }
    
    tabs.push({userid: userid, username: username});
    GM_setValue('privatetabs' + uid, JSON.stringify(tabs));
}

function FocusChat()
{
    messageInput.focus();
    chatWrapper.css("z-index", "1999");
}

function Init()
{
    $('<style type="text/css">' +
      '#chat_wrapper { position:fixed;left:2px;bottom:88px;z-index:100;width:500px;height:191px;display:none;-webkit-user-select:text;-khtml-user-select:text;-moz-user-select:text;-ms-user-select:text;user-select:text; }' +
      '#chat_wrapper .comment-section { padding:1px 8px 0px 8px;margin:0;width:500px;height:140px;overflow-x:hidden;overflow-y:scroll;box-shadow:1px 1px 20px #000;border:1px solid #E8D4AC;background:#b2a07c url("../gui/bg_patern.png?v=7"); }' +
      '#chat_wrapper .comment-section::-webkit-scrollbar{ width:15px;background:rgba(111,98,66,0.4); }' +
      '#chat_wrapper .comment-section::-webkit-scrollbar-thumb{ background-color:#87795D;border:1px solid #554D3B;border-radius:4px; }' +
      '#chat_wrapper .comment-section::-webkit-scrollbar-thumb:hover{ background-color:#8F8063; }' +
      '#chat_wrapper input { width:512px;margin-top:1px;opacity:0.7;color:#fff;background:rgba(45, 40, 29, 0.92);border:1px solid #E8D4AC;padding:2px; }' +
      '#chat_wrapper input:focus { opacity:1; }' +
      '#chat_wrapper input::-webkit-input-placeholder { color:#E8E8E8; } #chat_wrapper input:-moz-placeholder { color:#E8E8E8;opacity:1; } #chat_wrapper input::-moz-placeholder { color:#E8E8E8;opacity:  1; } #chat_wrapper input:-ms-input-placeholder { color:#E8E8E8; } #chat_wrapper input:placeholder-shown { color:#E8E8E8; }' +
      '#chat-button { position:absolute;bottom:41px;left:0px;z-index:201; }' +
      '#chat_wrapper .chat-tabs { margin-bottom: -1px; padding-left:4px; }' +
      '#chat_wrapper .tab { display:inline-block;height:21px;margin:0px 2px;padding:4px 10px 0 10px;background:linear-gradient(to bottom, #7d6d57 0%, #51422f 100%);color:#C7AE8D;border-top-left-radius: 4px;border-top-right-radius: 4px;border:1px solid #8A7964;border-bottom-color:#B2A07C; }' +
      '#chat_wrapper .tab:hover { background: linear-gradient(to bottom, #87745e 0%, #604e39 100%); }' +
      '#chat_wrapper .tab.active {margin-bottom:-1px;color:#554F40;border:1px solid #E8D4AC;border-bottom-color:#B2A07C;background:#b2a07c url("../gui/bg_patern.png?v=7"); }' +
      '</style>').appendTo("head");
                                                                                                    
    chatWrapper = $('<div id="chat_wrapper"></div>');
    $("body").append(chatWrapper);

    tabsCont = $('<div class="chat-tabs"></div>');
    chatWrapper.append(tabsCont);
    
    chatBox = $('<div class="comment-section"></div>');
    chatWrapper.append(chatBox);
    
    chatBoxMessages = $('<div style="padding:0;margin:0;"></div>');
    chatBoxMessages.mousedown(handle_mousedown);
    chatBox.append(chatBoxMessages);
    
    generalTab = $('<a class="tab active" data-tabid="0">Tribune</a>');
    tabsCont.append(generalTab);
    
    var generalTabContent = $('<div class="tab-content" id="tab-content-0"></div>');
    chatBoxMessages.append(generalTabContent);
    
    var savedTabs = GetPrivateTabs();
    if (savedTabs.length > 0) {
        $.each(savedTabs, function(i, e) {
            CreatePrivateTab(e.userid, e.username, true);
        });
    }
    
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
                FocusChat();
            }
        }
    });
    
    var button = $('<div id="chat-button" class="ui"><div id="settings-holder" class="ui-bg" title="Tribune Chat"><div class="ui-icons help ps2"></div></div></div>');
    $('#imperia').append(button);
    
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
    
    tabsCont.on('contextmenu', '.tab', function(e) {
        e.preventDefault();
        ClosePrivateTab(e.currentTarget);
        return false;
    });
    
    tabsCont.on('mouseup', '.tab', function(e) {
        if (e.button == 0) {
            setActiveChatTab(this);
        }
    });
    
    $('body').on('contextmenu', 'a.username', function(e) {
        e.preventDefault();
        var username = $(e.currentTarget).text().trim();
        if (!PrivateTabExists(username)) {
            OpenPrivateTab(username);
            FocusChat();
        }
        else
        {
            var tab = tabsCont.find('.tab[data-username="' + username + '"]');
            setActiveChatTab(tab);
            FocusChat();
        }
        return false;
    });
    
    ChatAddCommand({
        command: "/open",
        capture: true,
        callback: OpenPrivateTab,
    });
    
    ChatAddCommand({
        command: "/close",
        capture: false,
        callback: CloseCurrentPrivateTab,
    });
    
    timeout = setTimeout(pullMessages, interval);
}

function hookFunction(object, functionName, callback) {
    (function(originalFunction) {
        object[functionName] = function () {
            var returnValue = originalFunction.apply(this, arguments);

            callback.apply(this, arguments);

            return returnValue;
        };
    }(object[functionName]));
}

$(document).ready(function()
{
    // Create the event.
    var event = document.createEvent('Event');
    event.initEvent('addCommand', true, true);
    document.addEventListener('addCommand', function (e) {
        if (e.detail != null) {
            ChatAddCommand(e.detail);
        }
    }, false);

    function InitCheck()
    {
        if (typeof io.showUI != 'undefined')
        {
            hookFunction(io, 'showUI', function() {
                Init();
            });
        }
        else
        {
            setTimeout(InitCheck, 500);
        }
    }
    InitCheck();
});
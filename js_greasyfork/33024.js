// ==UserScript==
// @name         Tumblr Message Archiver
// @namespace    https://github.com/chris-pie/tumblr-message-archiver
// @version      2.2
// @description  Archives the messages
// @author       Chris Pie
// @match        https://www.tumblr.com/message_archiver
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/33024/Tumblr%20Message%20Archiver.user.js
// @updateURL https://update.greasyfork.org/scripts/33024/Tumblr%20Message%20Archiver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
        var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
        var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
    }
    $("head").text("");
    $("body").text("").append('<p id="error"></p>').append('<p id="counter"></p>');
    var tumblog_mine = prompt("Enter YOUR blog name (without .tumblr.com)");
    var tumblog_other = prompt("Enter THE OTHER BLOG'S name (without .tumblr.com)");

    var convo_id ="";
    var messages_list = [];
    var done_gathering_messages = false;
    function get_messages(convo_id)
    {
        var waiting = false;
        var url = "/svc/conversations/messages?conversation_id="+convo_id;
        var repeater;
        var repeat_counter = 0;
        var message_counter = 0;
        function get_messages_http()
        {
            if(waiting && repeat_counter < 300)
            {
                if(repeat_counter == 150)
                    $("#error").text("Tumblr seems to not be responding. Retrying in few seconds. (onrepeat)");
                repeat_counter++;
                return;
            }
            waiting = true;
            repeat_counter = 0;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.tumblr.com"+url,
                headers: {
                    "Connection": "keep-alive",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": "https://www.tumblr.com/dashboard",
                    "Accept-Encoding": "gzip, deflate, br",
                },
                onerror: function()
                {
                    $("#error").text("Tumblr seems to not be responding. Retrying in few seconds. (onerror)");
                    waiting = false;
                    return;
                },
                timeout: 5000,
                ontimeout: function()
                {
                    $("#error").text("Tumblr seems to not be responding. Retrying in few seconds. (ontimeout)");
                    waiting = false;
                    return;
                },
                onload: function(response)
                {
                    $("#error").text("");
                    try
                    {
                        if (response.status !== 200)
                        {
                            waiting = false;
                            return;
                        }
                        var parsed_response = JSON.parse(response.responseText);
                        var messages = parsed_response.response.messages;
                        for (var i = messages.data.length - 1; i>=0;i--)
                        {
                            var currmessage;
                            if(messages.data[i].type === "TEXT")
                            {
                                currmessage = timeConverter(messages.data[i].ts.substr(0,10)) + ' ' + messages.data[i].participant + ': ' + messages.data[i].message;
                            }
                            else if (messages.data[i].type === "POSTREF")
                            {
                                currmessage = timeConverter(messages.data[i].ts.substr(0,10)) + ' ' + messages.data[i].participant + ': ' + messages.data[i].post.post_url;
                            }
                            else if (messages.data[i].type === "IMAGE")
                            {
                                var image_links = "";
                                for (var j = 0; j < messages.data[i].images.length; j++)
                                {
                                    image_links = image_links + ' ' + messages.data[i].images[j].original_size.url;
                                }
                                currmessage = timeConverter(messages.data[i].ts.substr(0,10)) + ' ' + messages.data[i].participant + ': ' + image_links;
                            }
                            message_counter++;
                            $("#counter").text("Gathered " + message_counter + " messages.");
                            $("#counter").after(currmessage + "<br/>");
                        }
                        if (parsed_response.response.messages._links === undefined)
                        {
                            clearInterval(repeater);
                            waiting = false;
                            $("#counter").text($("#counter").text() + " Archiving complete. Press ctrl+a to select all, then ctrl+c to copy. Paste to notepad and save.");
                            return;
                        }
                        else url = parsed_response.response.messages._links.next.href;
                        waiting = false;
                    }
                    catch(e)
                    {
                        $("#error").text(e.name + e.message);
                    }
                }
            });
        }
        repeater = setInterval(get_messages_http, 20);
    }
    function begin_archiving(tumblog_this, tumblog_remote)
    {
        var waiting = false;
        var url = "/svc/conversations?participant="+tumblog_this+".tumblr.com";
        var repeater;

        function get_conversations()
        {
            if(waiting) return;
            waiting = true;
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.tumblr.com"+url,
                headers: {
                    "Connection": "keep-alive",
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "X-Requested-With": "XMLHttpRequest",
                    "Referer": "https://www.tumblr.com/dashboard",
                    "Accept-Encoding": "gzip, deflate, br",
                },
                onload: function(response)
                {
                    var parsed_response = JSON.parse(response.responseText);
                    for(var i = 0; i < parsed_response.response.conversations.length; i++)
                    {
                        for(var j = 0; j < parsed_response.response.conversations[i].participants.length; j++)
                        {
                            if (parsed_response.response.conversations[i].participants[j].name === tumblog_remote)
                            {
                                convo_id =  parsed_response.response.conversations[i].id;
                                waiting = false;
                                clearInterval(repeater);
                                return;
                            }

                        }
                    }
                    if (parsed_response.response._links === undefined)
                    {
                        convo_id = "error";
                        clearInterval(repeater);
                        waiting = false;
                        return;
                    }
                    else url = parsed_response.response._links.next.href;
                    waiting = false;
                }
            });
        }
        repeater = setInterval(get_conversations, 200);
    }
    begin_archiving(tumblog_mine, tumblog_other);
    var repeater;
    repeater = setInterval(function() {
        if (convo_id !== "")
        {
            clearInterval(repeater);
            get_messages(convo_id);
        }
    }, 200);

})();
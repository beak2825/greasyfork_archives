// ==UserScript==
// @name                    AutoReply For Discuz (Firefox)
// @namespace           https://greasyfork.org/zh-CN/scripts/10674-autoreply-for-firefox
// @version                  1.0.2.4
// @description            Discuz论坛自动回复
// @match      http://*/*
// @downloadURL https://update.greasyfork.org/scripts/10674/AutoReply%20For%20Discuz%20%28Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10674/AutoReply%20For%20Discuz%20%28Firefox%29.meta.js
// ==/UserScript==
 
    var auto_reply_default_message = '非常感谢楼主的分享!!!';
 
    function auto_reply_chinaunix(reply_message)
    {
            var pattern =
                    /<script\s+[^>]*>*.*<\/script>/;
            var html = document.documentElement.innerHTML;
            var find = html.match(pattern);
            if(find)
            {
                    //alert(find[0]);
                    var input_area = document.getElementById('fastpostmessage');
                    var button_submit = document.getElementById('fastpostsubmit');
                    var fastpostrefresh = document.getElementById('fastpostrefresh');
                    if(input_area && button_submit)
                    {
                            var new_message = "";
                            if(new_message == null)
                                    return;
                            new_message = new_message.replace(/(^\s*|\s*$)/g, "");
                            if(new_message == "")       
                                    new_message = auto_reply_default_message;
                            try
                            {
                                    localStorage['auto_reply_message'] = new_message;
                            }
                            catch(err)
                            {
                            }
                            if(fastpostrefresh)
                                    fastpostrefresh.checked = false;
                            input_area.textContent = new_message;
                            button_submit.click();
                    }
            }
    }
    try
    {
            var reply_message = '';
            
            try
            {
                    reply_message = localStorage['auto_reply_message'];
            }
            catch(err)
            {
            }
            if(!reply_message)
                    reply_message = auto_reply_default_message;
            reply_message = reply_message.replace(/(^\s*|\s*$)/g, "");
            if(reply_message == "")       
                    reply_message = auto_reply_default_message;
            auto_reply_chinaunix(reply_message);
    }
    catch(err)
    {
    }
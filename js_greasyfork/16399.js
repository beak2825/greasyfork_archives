// ==UserScript==
// @name        BaiduPost
// @namespace   Roll
// @description 百度贴吧roll点
// @include     http://tieba.baidu.com/p/*
// @version     1
// @grant       none
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/16399/BaiduPost.user.js
// @updateURL https://update.greasyfork.org/scripts/16399/BaiduPost.meta.js
// ==/UserScript==

function TiebaRoll()
{
    var a = document.getElementsByClassName("l_post l_post_bright j_l_post clearfix  ");
    
    var p = document.getElementsByClassName("d_nameplate");
    
    if(a.length != p.length)
        return;
    
    var last_author = "";
    
    for(var i = 0; i < a.length; i++)
    {
        str = a[i].getAttribute('data-field');
        
        if(str)
        {
            var beginid = str.indexOf("user_id\":");
            var endid = str.indexOf(",\"user_name");
            
            if(beginid == -1)
                continue;
            
            var authorid = str.substr((beginid+9), (endid - beginid - 9));
            
            if(last_author == authorid)
                continue;
            
            last_author = authorid;
            
            beginid = str.indexOf("post_id\":");
            endid = str.indexOf(",\"is_anonym");
            
            var roll = str.substr((beginid+9), (endid - beginid - 9));
            
            roll = roll.substr(roll.length - 2, 2);
            
            var node=document.createElement("li");
            var textnode=document.createTextNode("roll = "+roll);
            node.appendChild(textnode);
            
            p[i].appendChild(textnode);
        }
    }
}

TiebaRoll();

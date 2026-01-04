// ==UserScript==
// @name         Wikidot-Emoji
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Put some emoji on the textarea.
// @author       HelloOSMe
// @match        http://*.wikidot.com/*
// @match        https://*.wikidot.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459432/Wikidot-Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/459432/Wikidot-Emoji.meta.js
// ==/UserScript==
function show_bar(){
    setTimeout(()=>show_emoji_bar(),2000);
    setTimeout(()=>show_emoji_bar_editpage(),2000);
}
function show(){
    var a=document.getElementsByClassName('options'),c="",b="",d=document.getElementsByClassName('post-container');
    var j=3;
    for(var i=0;i<d.length;i++){
        c=d[i].id;
        c=c.slice(1);
        c=c.slice(1);
        c=c.slice(1);
        c=c.slice(1);
        b=a[j].innerHTML;
        a[j].innerHTML="<strong><a href=\"javascript:;\" onclick=\"postReply(event,"+c+");setTimeout(()=>show_emoji_bar(),2000);\" class=\"btn btn-small btn-sm\">回复</a></strong>"+b;
        console.log(d[i]);
        console.log(i);
        console.log(a[j]);
        console.log(j);
        j=j+4;
    }
}
function send_to_script(){
    var a=document.head || document.getElementsByTagName('head')[0],b=document.createElement('script'),d=document.createElement('style');
    var c=["function show_emoji_bar(){",
    "var a=document.getElementById('np-editor-panel'),b=document.createElement('div');",
    "var c=\"<ul>\";",
    "for(var i=0;i<29;i++){",
    "    if(i>9){",
    "        c+=\"<li><a style=\\\"background:#77777744!important;margin:1px;border:#77777777 solid 1px;\\\" href=\\\"javascript:;\\\" onclick=\\\"$j('textarea').val($j('textarea').val()+'[[image http://图.tk/\"+String.fromCharCode(i+97-10)+\"]]');\\\"><img alt=\\\"\\\" width=\\\"22px\\\" src=\\\"http://图.tk/\"+String.fromCharCode(i+97-10)+\"\\\"/></a></il>\";",
    "    }else{",
    "        c+=\"<li><a style=\\\"background:#77777744!important;margin:1px;border:#77777777 solid 1px;\\\" href=\\\"javascript:;\\\" onclick=\\\"$j('textarea').val($j('textarea').val()+'[[image http://图.tk/\"+String.fromCharCode(i+48)+\"]]');\\\"><img alt=\\\"\\\" width=\\\"22px\\\" src=\\\"http://图.tk/\"+String.fromCharCode(i+48)+\"\\\"/></a></il>\";",
    "    }",
    "}",
    "c+=\"</ul>\";",
    "b.innerHTML=c;",
    "a.appendChild(b);}",
    "function show_emoji_bar_editpage(){",
    "var a=document.getElementById('wd-editor-toolbar-panel'),b=document.createElement('div');",
    "var c=\"<ul>\";",
    "for(var i=0;i<29;i++){",
    "    if(i>9){",
    "        c+=\"<li><a style=\\\"background:#77777744!important;margin:1px;border:#77777777 solid 1px;\\\" href=\\\"javascript:;\\\" onclick=\\\"$j('textarea').val($j('textarea').val()+'[[image http://图.tk/\"+String.fromCharCode(i+97-10)+\"]]');\\\"><img alt=\\\"\\\" width=\\\"22px\\\" src=\\\"http://图.tk/\"+String.fromCharCode(i+97-10)+\"\\\"/></a></il>\";",
    "    }else{",
    "        c+=\"<li><a style=\\\"background:#77777744!important;margin:1px;border:#77777777 solid 1px;\\\" href=\\\"javascript:;\\\" onclick=\\\"$j('textarea').val($j('textarea').val()+'[[image http://图.tk/\"+String.fromCharCode(i+48)+\"]]');\\\"><img alt=\\\"\\\" width=\\\"22px\\\" src=\\\"http://图.tk/\"+String.fromCharCode(i+48)+\"\\\"/></a></il>\";",
    "    }",
    "}",
    "c+=\"</ul>\";",
    "b.innerHTML=c;",
    "a.appendChild(b);}"].join('\n');
    b.innerHTML=c;
    a.appendChild(b);
    d.innerHTML=".options a.btn-primary{display:none;}";
    a.appendChild(d);
}
(function() {
    'use strict';
    send_to_script();
    if(document.getElementsByTagName('textarea').length==0){
        WIKIDOT.modules.ForumViewThreadModule.listeners.newPost(event,null);
    }
    show_bar();
    setTimeout(()=>show(),1000);
})();
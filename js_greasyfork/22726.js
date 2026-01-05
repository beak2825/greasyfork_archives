// ==UserScript==
// @name         STagila post hider script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Скрывает определенные посты с форума.
// @author       rondo.devil@gmail.com (eXponenta)
// @match        http://stagila.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22726/STagila%20post%20hider%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/22726/STagila%20post%20hider%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Load
    // возвращает cookie с именем name, если есть, если нет, то undefined
    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    var replaceAll = function(str, sel, to){
        while(str.indexOf(sel)>-1){
            str=str.replace(sel,to);
        }
        return str;
    };
    
    var filter = Array.prototype.filter;

    var preset = "<a id='ext_hide_click' href='javascript:document.ext_showPost(#postindex, true)' style='color:red;font-size:10pt; display:none'>Сообщение скрыто, показать? </a>" +
        "<a id='ext_show_click' style='color:red;font-size:10pt; display:none' href='javascript:document.ext_showPost(#postindex, false)'> Сообщение показано, скрыть? </a>"+
        "</span> <span style='float:right; display:inline'><input type='button' value='Скрывать' onclick='document.ext_filter(#postindex,true);' /> <input type='button' value='Не скрывать' onclick='document.ext_filter(#postindex,false);' />";

    var blacklist = [];
    var n = getCookie("stagila_black_list");
    if(n !== undefined){
        blacklist = n.split(",");
    }

    var posts = document.querySelectorAll(".post_block");

    posts.forEach(function(e,ind,arr){
        var newSpan = document.createElement("div");
        newSpan.id = "ext_hided";
        newSpan.style = "display: inline;";
        newSpan.innerHTML = replaceAll(preset, "#postindex",ind);
        e.querySelector(".row2").appendChild(newSpan);
    });
    

    document.ext_showPost = function(id, show) {
        var p = posts;
        p[id].querySelector(".post_body").style.display=show?'':'none';
        p[id].querySelector(".author_info").style.display = show?'':'none';

        p[id].querySelector('#ext_show_click').style.display = show?'':'none';
        p[id].querySelector('#ext_hide_click').style.display = show?'none':'';
    };
    
    posts.forEach(function(e, ind, arr){
        
        var sp = e.querySelector("[itemprop=name] span");
        var name = e.querySelector("[itemprop=name]").innerHTML;
        if(sp !== null)
            name = sp.innerHTML;
        
        if( blacklist.indexOf(name) > -1)
            document.ext_showPost(ind,false);
    });
    
   document.ext_filter =  function(id, add){
       var sp = posts[id].querySelector("[itemprop=name] span");
       var name = posts[id].querySelector("[itemprop=name]").innerHTML;
       if(sp !== null)
          name = sp.innerHTML;
        
       var b = blacklist;
       if(add){
           b.push(name);
       }
       else{
           var i = blacklist.indexOf(name);
           if(i > -1){
               b.splice(i, 1);
           }
       }
       var date = new Date();
       date.setDate(date.getDate() + 30);
       document.cookie = "stagila_black_list="+b.join(',') + "; expires=" + date.toUTCString() +";";
       window.location.reload();
   };


})();
// ==UserScript==
// @name         Remove Communities from Pikabu
// @version      0.6
// @description  Удаляет посты из сообществ, попавшие в Горячее.
// @author       Neur0toxine
// @license      WTFPL
// @include      *//pikabu.ru/*
// @grant        GM_addStyle
// @grant        GM_info
// @namespace    https://greasyfork.org/users/12790
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/20572/Remove%20Communities%20from%20Pikabu.user.js
// @updateURL https://update.greasyfork.org/scripts/20572/Remove%20Communities%20from%20Pikabu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(/\/(story\/[a-z0-9_]*)?_[0-9]*/.test(window.location.pathname)) return;
    var cssText = '.search-result-communities, .best_comm, ';
    cssText += 'a[href="http://pikabu.ru/communities"][class="no_ch"], ';
    cssText += 'td[class="rating_bl b-community-top-caption"] {display:none!important}';
    if(typeof GM_addStyle != "undefined") GM_addStyle(cssText);
    else if(typeof PRO_addStyle != "undefined") PRO_addStyle(cssText);
    else if(typeof addStyle != "undefined") addStyle(cssText);
    else {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(cssText));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) heads[0].appendChild(node);
            else document.documentElement.appendChild(node);
    }

    function remove_posts_by_communities_tag() {
        function selhtml(sel,html,proc){for(var t=document.querySelectorAll(sel),i=0;i<t.length;i++)html.test(t[i].innerHTML)&&eval("t[i]."+proc)}
        function selproc(sel,proc){for(var t=document.querySelectorAll(sel),i=0;i<t.length;i++)eval("t[i]."+proc)}
        selproc('a[href="http://pikabu.ru/communities"][class="no_ch"]','remove();');
        selproc('td[class="rating_bl b-community-top-caption"]','closest(\'div\').remove();');
        selproc('a[href^="/community"]','closest(\'.story\').remove();');
        selproc('.story__sponsor,.story__gag-nice,div[data-story-id="_"]','closest(\'.story\').remove();');
        $(document).ajaxComplete(function(){selproc('.story__sponsor,.story__gag-nice','closest(\'.story\').remove();');});
        selhtml('td.rating_bl.menu-block-title', /О\sсообществе/, 'closest(\'div\').remove();');}
    window.onload = function(){
        $(document).ajaxComplete(remove_posts_by_communities_tag);
        remove_posts_by_communities_tag();
        console.log('['+GM_info.script.name+']: Выполнена очистка!');
    }; 
})();
// ==UserScript==
// @name         Reddit - Comments Tab
// @namespace    https://github.com/Dr-Turner
// @version      0.3
// @description  Adds a 'comments' tab to the tab-bar in every subreddit and mutireddit
// @author       Dave Turner
// @match        https://www.reddit.com/r/*
// @match        https://www.reddit.com/me/m/*
// @downloadURL https://update.greasyfork.org/scripts/23446/Reddit%20-%20Comments%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/23446/Reddit%20-%20Comments%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // find subreddit link
    var sub = document.getElementsByClassName('pagename')[0];
    var a_tag = sub.children[0];
    var current_sub = a_tag.href;

    // create comments tab
    var li = document.createElement('li');
    var a = document.createElement('a');
    var tab_text = document.createTextNode('comments');
    var new_href = current_sub += 'comments';
    // build
    a.href = new_href;
    a.classList = ['choice'];
    a.appendChild(tab_text);
    li.appendChild(a);

    // get tab bar node
    var ul = document.getElementsByClassName('tabmenu')[0];
    //attach
    ul.appendChild(li);
})();
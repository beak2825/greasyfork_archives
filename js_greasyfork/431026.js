// ==UserScript==
// @name         9gag_already_seen
// @namespace    https://greasyfork.org/de/users/157797-lual
// @version      0.7
// @description  display "already seen"-status of posts
// @author       lual
// @match        https://9gag.com/*
// @icon         https://icons.duckduckgo.com/ip2/9gag.com.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/431026/9gag_already_seen.user.js
// @updateURL https://update.greasyfork.org/scripts/431026/9gag_already_seen.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////
// changes:        2021-08-19 publish beta-version on greasyfork

////////////////////////////////////////////////////////////////////////////////
var SCRIPT_NAME = '9gag_already_seen';
//add styles for seen and unseen articles
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.seen     { border-left: 10px solid #0077ff !important; }');
addGlobalStyle('.justseen { border-left: 10px solid #0077ff !important; transition: border-color 3s;}');
addGlobalStyle('.unseen   { border-left: 10px solid #007700 !important; }');
addGlobalStyle('#seen-counter { position: fixed; color: #0077ff; padding-top: 0px; padding-left: 13px; right: 20px; top:50px; height: 36px; width: 100px; background-color:#AAAAAA; border-radius: 18px; font-size: 16px; font-weight: 700; line-height: 36px; opacity:70%}');

////////////////////////////////////////////////////////////////////////////////
//forget seen/unseen status
GM_registerMenuCommand(SCRIPT_NAME + ': Forget seen status!', function() {
    localStorage.removeItem('article_ids');
    document.querySelectorAll('.seen').forEach(function(node) {
        node.classList.remove('seen');
        node.classList.add('unseen');
    });
    document.querySelectorAll('.justseen').forEach(function(node) {
        node.classList.remove('justseen');
        node.classList.add('unseen');
    });
});

//insert element for "seen articles"-count
function insertCounter(cnt) {
    var parent, div;
    parent = document.getElementsByTagName('body')[0];
    if (!parent) { return; }
    div = document.createElement('div');
    div.id = 'seen-counter';
    div.innerHTML = '&#128065 ' + cnt;
    div.title = 'Userscript - ' + SCRIPT_NAME + ' - Counter'
    parent.appendChild(div);
}

//update element for "seen articles"-count
function updateCounter(cnt) {
    var div;
    div = document.querySelector('#seen-counter');
    if (!div) { return; }
    div.innerHTML = '&#128065 '+ cnt;
}

$(document).ready(function() {
    //insert element for "seen articles"-count
    var stored_seen_article_ids = [];
    if (localStorage.getItem('article_ids')) {
        stored_seen_article_ids = JSON.parse(localStorage.getItem('article_ids'));
    }
    insertCounter(stored_seen_article_ids.length);

    //do a minimal scroll to mark articles...
    window.scrollTo(window.scrollX, window.scrollY + 1);
});

////////////////////////////////////////////////////////////////////////////////
var i = 0;
$(window).on('scroll',function(){

    var stored_seen_article_ids = [];
    if (localStorage.getItem('article_ids')) {
        stored_seen_article_ids = JSON.parse(localStorage.getItem('article_ids'));
    }

    //check if article is unseen / style it / and return bool
    function isArticleUnseen(article) {
        if(stored_seen_article_ids.indexOf(article.attr("id")) === -1){
            article.addClass('unseen');
            return true
        }
        else {
            article.addClass('seen');
            return false
        }
    };

    var displayedArticles = $("article");

    if (isArticleUnseen(displayedArticles.eq(i))){
        stored_seen_article_ids.push(displayedArticles.eq(i).attr("id"));
    };
    isArticleUnseen(displayedArticles.eq(i+1));
    isArticleUnseen(displayedArticles.eq(i+2));
    isArticleUnseen(displayedArticles.eq(i+3));
    isArticleUnseen(displayedArticles.eq(i+4));
    isArticleUnseen(displayedArticles.eq(i+5));
    isArticleUnseen(displayedArticles.eq(i+6));

    //articel scrolled over top - mark it as seen
    if($(window).scrollTop() >= displayedArticles.eq(i).offset().top){
        updateCounter(stored_seen_article_ids.length);

        localStorage.setItem("article_ids", JSON.stringify(stored_seen_article_ids));
        if (displayedArticles.eq(i).hasClass('unseen')) {
          displayedArticles.eq(i).removeClass('unseen');
          displayedArticles.eq(i).addClass('justseen');
        };
        i++;
    }});
// ==UserScript==
// @name         prusaprints_already_seen
// @namespace    https://greasyfork.org/de/users/157797-lual
// @version      0.5
// @description  display "already seen"-status of posts
// @author       lual
// @match        https://www.printables.com/*
// @icon         https://icons.duckduckgo.com/ip2/prusaprinters.org.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443628/prusaprints_already_seen.user.js
// @updateURL https://update.greasyfork.org/scripts/443628/prusaprints_already_seen.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////
// changes:        2022-01-25 idea / prototype
//                 2022-04-19 switch from prusaprinters.org to printables.com
//                 2024-09-19 refined to make it work with new Printables-Website
//                 2024-10-16 reflect new dom class name 
//                            and move counter down - to avoid be covered by menu
////////////////////////////////////////////////////////////////////////////////
// known bugs / limitations:
//   * you have to scroll a little to fire this script. DOMContentLoaded doesn't
//     work
//   * only 6 top displayed print-cards are handeled.
//     it would be better to handle all visible cards
//   * css class styling of border is not perfect because it makes the
//     card-content rendered smaller

// todo umbauen
// immer wenn sich displayedArticles.length ändert - alle prints von hinten nach vorne durchgehen
// wissen einarbeiten von...
//https://stackoverflow.com/questions/123999/how-can-i-tell-if-a-dom-element-is-visible-in-the-current-viewport

///////////////////////////////////////////////////////////////////////////////
var Util = {
  log: function () {
    var args = [].slice.call(arguments);
    args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: purple;');
    console.log.apply(console, args);
  }
};

var SCRIPT_NAME = 'prusaprints_already_seen';
Util.log('started');

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
//addGlobalStyle('.badge-seen { border: 1px solid #0077ff !important; position: absolute; color: #11f5f5; line-height: 1;}');

addGlobalStyle('.justseen { border-left: 10px solid #0077ff !important; transition: border-color 3s;}');
addGlobalStyle('.unseen   { border-left: 10px solid #007700 !important; }');
addGlobalStyle('#seen-counter { position: fixed; color: #0077ff; padding-top: 0px; padding-left: 13px; right: 20px; top:120px; height: 36px; width: 100px; background-color:#f5f5f5; border-radius: 18px; font-size: 14px; font-weight: 700; line-height: 36px; opacity:70%}');

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
    if (!div) {
        insertCounter(cnt);
        return; }
    div.innerHTML = '&#128065 '+ cnt;
}

document.addEventListener("DOMContentLoaded",function(){
    Util.log('DOMContentLoaded');

    //don't know why document.readyState is "interactive" at first
    var interval = setInterval(function() {
        if(document.readyState === 'complete') {
            clearInterval(interval);
        }
    }, 1000);

    //insert element for "seen articles"-count
    var stored_seen_article_ids = [];
    if (localStorage.getItem('article_ids')) {
        stored_seen_article_ids = JSON.parse(localStorage.getItem('article_ids'));
    }
    insertCounter(stored_seen_article_ids.length);
    Util.log('stored_seen_article_ids.length:'+stored_seen_article_ids.length);

    //do a minimal scroll to mark articles...
    // todo funktioniert nicht . vermutlich sind nochnicht alle elemente geladen
    // zusätzlich mit async / await einen timer reinmachen
    window.scrollTo(window.scrollX, window.scrollY + 1);

});

//document.addEventListener('readystatechange', (event) => {
//    Util.log(`readystate: ${document.readyState}\n`)
//});

////////////////////////////////////////////////////////////////////////////////
var i = 0;
$(window).on('scroll',function(){

    var stored_seen_article_ids = [];
    if (localStorage.getItem('article_ids')) {
        stored_seen_article_ids = JSON.parse(localStorage.getItem('article_ids'));
    }

    //check if article is unseen / style it / and return bool
    function extractArticleId(article) {
        var el = article.querySelector("a.card-image");
        let matchObj = /model\/([\d]*)-/.exec(el.href);
        if (!matchObj) {
            throw new Error('kann id nicht extrahieren: ' + el.href );
        }
        //console.log(matchObj[1])
        return matchObj[1]
    };
    //
    function isArticleUnseen(aricleId,article) {
        if(stored_seen_article_ids.indexOf(aricleId) === -1){
            article.classList.add('unseen');
            return true
        }
        else {
            article.classList.add('seen');
            return false
        }
    };

    //var displayedArticles = $("print-card");
    var displayedArticles = document.querySelectorAll('article')

    Util.log('laufnummer i:'+i+' displayedArticles.length:'+displayedArticles.length);






    if (isArticleUnseen(extractArticleId(displayedArticles[i]),displayedArticles[i])){
        stored_seen_article_ids.push(extractArticleId(displayedArticles[i]));
    };
    isArticleUnseen(extractArticleId(displayedArticles[i+1]),displayedArticles[i+1])
    isArticleUnseen(extractArticleId(displayedArticles[i+2]),displayedArticles[i+2])
    isArticleUnseen(extractArticleId(displayedArticles[i+3]),displayedArticles[i+3])
    isArticleUnseen(extractArticleId(displayedArticles[i+4]),displayedArticles[i+4])
    isArticleUnseen(extractArticleId(displayedArticles[i+5]),displayedArticles[i+5])
    isArticleUnseen(extractArticleId(displayedArticles[i+6]),displayedArticles[i+6])

    //articel scrolled over top - mark it as seen
    if($(window).scrollTop() >= displayedArticles[i].offsetTop){
        updateCounter(stored_seen_article_ids.length);

        localStorage.setItem("article_ids", JSON.stringify(stored_seen_article_ids));
        if (displayedArticles[i].classList.contains('unseen')) {
          displayedArticles[i].classList.remove('unseen');
          displayedArticles[i].classList.add('justseen');
        };
        i++;
    }});
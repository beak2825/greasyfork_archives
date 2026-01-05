// ==UserScript==
// @name        PaintMyHabr
// @description Paint editors posts in yellow, futile posts in pink, add "PAID" stamp to companies posts on habrahabr.ru/geektimes.ru
// @namespace   riot26.ru
// @author      riot26
// @license     WTFPL (http://www.wtfpl.net/txt/copying)
// @include     http://geektimes.ru/*
// @include     https://geektimes.ru/*
// @include     http://habrahabr.ru/*
// @include     https://habrahabr.ru/*
// @exclude     http://geektimes.ru/post/*
// @exclude     https://geektimes.ru/post/*
// @exclude     http://habrahabr.ru/post/*
// @exclude     https://habrahabr.ru/post/*
// @version     2.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19946/PaintMyHabr.user.js
// @updateURL https://update.greasyfork.org/scripts/19946/PaintMyHabr.meta.js
// ==/UserScript==

var css = document.createElement('style');
css.type = 'text/css';
css.media = 'screen';
css.innerHTML =  '.post {padding:10px !important; position:relative !important;}'
                +'.yellow {background-color:#FFFFE5 !important;}'
                +'.pink {background-color:#FFF3F9 !important; background-image:url(https://i.imgur.com/74u5ZhC.jpg);}'
                +'.paid_stamp {position:absolute; width:130px; height:75px; background:url(https://i.imgur.com/xcyAC4P.png); top:2px; right:2px;}'
                +'.buttons {padding:20px 0 20px 0 !important;}'
                +'.fonts-loaded .post__flow, .fonts-loaded .post_title, .fonts-loaded .post__title, .fonts-loaded .post__title_link { font-family:\'Fira Sans\',\'Helvetica Neue\',Helvetica,sans-serif !important; }'
                +'.post__flow, .post__title, .post__title_link {font-size:22px !important; font-family:Arial,\'Helvetica Neue\',Helvetica,sans-serif !important; }';
document.getElementsByTagName('head')[0].appendChild(css);

var posts = document.getElementsByClassName('post');
for (var i = 0; i < posts.length; i++) {
    if (isEditors(posts[i])) {
        posts[i].className += posts[i].className ? ' yellow' : 'yellow';
    }
    if (isPaid(posts[i])) {
        addPaidStamp(posts[i]);
    }
    if (isFutile(posts[i])) {
        posts[i].className += posts[i].className ? ' pink' : 'pink';
    }
}

function isEditors(post) {
    var editors = ['SLY_G', 'alizar', 'marks', 'ivansychev', 'ragequit'];
    if (post.querySelector(".post-author__link")) {
        return containsAny(post.querySelector(".post-author__link").getAttribute('href'), editors);
    }
    return false;
}

function isFutile(post) {
    var futile_flows = ['design', 'marketing', 'management', 'misc'];
    if (post.querySelector(".post__flow")) {
        return containsAny(post.querySelector(".post__flow").getAttribute('href'), futile_flows);
    }
    return false;
}

function isPaid(post) {
    if (post.querySelector(".hubs")) {
        return post.querySelector(".hubs").outerHTML.indexOf('Блог компании') != -1;
    } else {
        return post.querySelector(".megapost-cover__inner");
    }
}

function addPaidStamp(post) {
    var paid_stamp_el = document.createElement('div');
    paid_stamp_el.className = 'paid_stamp';
    post.appendChild(paid_stamp_el); 
}

function containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
        var substring = substrings[i];
        if (str.indexOf(substring) != -1) {
            return true;
        }
    }
    return false;
}
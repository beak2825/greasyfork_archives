// ==UserScript==
// @name         nHentaiPage
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  link page form comment
// @author       copoxxx
// @match        https://nhentai.net/g/*
// @match        http://nhentai.net/g/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381601/nHentaiPage.user.js
// @updateURL https://update.greasyfork.org/scripts/381601/nHentaiPage.meta.js
// ==/UserScript==

window.open = null;

(function() {
    'use strict';

var counterCss = `.thumb-container .gallerythumb:before {
    counter-increment: PageCount;
    content: counter(PageCount);
    position: relative;
    color: white;
    left: 87.5px;
    text-shadow: 0 0 3px snow;
}
body {
    counter-reset: PageCount;
}`;
var commentBtn = `<a href = '#comments'><button class="btn btn-primary small" type="submit" style="
position: fixed;
top: 50px;
left: 89.5vw;
z-index: 9999;
">
<i class="fa fa-share"></i>
<span class="text">Comments</span>
</button></a>`;

var S = V();

function V(){
    return {
        imgs:document.querySelectorAll('.thumb-container .gallerythumb'),
        comments:document.querySelectorAll('#comments .comment .body')
    };
}


function P(style){
    var e = document.createElement('style');
    e.innerHTML = style;
    document.head.appendChild(e);
    var t = document.querySelector('#info-block #info');
    if(t){
        t.innerHTML += commentBtn;
    }
}

P(counterCss);

function F(){
    for(var i = 0;i<S.comments.length;i++){
        if(S.comments[i].innerHTML.search(/(P\d+)/) > -1){
            S.comments[i].innerHTML = G(S.comments[i].innerHTML);
        }
    }
}

function G(s){
    s = s.split('\n');
    for(var i = s.length-1;i >= 0;i--){
        var d = s[i].match(/P(\d+)/);
        if(d){
            var page = parseInt(d[1])
            if(page > 0 && page <= S.imgs.length){
                s[i] = s[i].replace('P' + d[1],'<a href = "#page_' + d[1] + '">P' + d[1] + '</a>');
                S.imgs[page-1].children[0].id = 'page_' + d[1];
                S.imgs[page-1].children[0].style.border = 'dotted red';
            }
        }
    }
    return s.join('<br/>');
}

F();
})();
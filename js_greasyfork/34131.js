// ==UserScript==
// @name          やる夫まとめに挑戦 改
// @namespace    https://greasyfork.org/ja/users/2332-deadman-from-sora
// @version      0.1
// @description  やる夫まとめに挑戦 改を使いやすくする
// @author       You
// @match        *://n-yaruomatome.sakura.ne.jp/blog/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34131/%E3%82%84%E3%82%8B%E5%A4%AB%E3%81%BE%E3%81%A8%E3%82%81%E3%81%AB%E6%8C%91%E6%88%A6%20%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/34131/%E3%82%84%E3%82%8B%E5%A4%AB%E3%81%BE%E3%81%A8%E3%82%81%E3%81%AB%E6%8C%91%E6%88%A6%20%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let links;
    let btnOn = function (){

        $(".codebtn2").trigger('click');
        $(".codebtn1").trigger('click');
    };

    let getPNLink = function (){

        let ret = {};
        let links = Array.from(document.getElementsByTagName("a"));
        for(let link of links){
            if(link.rel == "prev"){
                ret.prev = link;
            }
            else if(link.rel == "next"){
                ret.next = link;
            }
            else if(link.textContent == "TOP"){
                ret.top = link;
            }
        }
        return ret;
    };

    let addPNLinkOnTop = function(prev, next, top){

        let div = Array.from(document.getElementsByClassName("blogbox"))[0];

        div.appendChild(prev.cloneNode(true));
        div.appendChild(prev.nextSibling.cloneNode());
        div.appendChild(top.cloneNode(true));
        div.appendChild(next.previousSibling.cloneNode());
        div.appendChild(next.cloneNode(true));
    };

    links = getPNLink();
    addPNLinkOnTop(links.prev, links.next, links.top);
    btnOn();

})();
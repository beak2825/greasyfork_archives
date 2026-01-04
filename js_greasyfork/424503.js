// ==UserScript==
// @name         Dockerドキュメントサイトの英語版と日本語版を行ったり来たりできるやつ
// @namespace    com.mikan-megane.docker-document-jp
// @version      0.2
// @description  その名の通りDockerドキュメントサイトの英語版と日本語版を行ったり来たりできる
// @author       @mikan-megane
// @match        https://docs.docker.com/*
// @match        https://matsuand.github.io/docs.docker.jp.onthefly/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424503/Docker%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E8%8B%B1%E8%AA%9E%E7%89%88%E3%81%A8%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88%E3%82%92%E8%A1%8C%E3%81%A3%E3%81%9F%E3%82%8A%E6%9D%A5%E3%81%9F%E3%82%8A%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/424503/Docker%E3%83%89%E3%82%AD%E3%83%A5%E3%83%A1%E3%83%B3%E3%83%88%E3%82%B5%E3%82%A4%E3%83%88%E3%81%AE%E8%8B%B1%E8%AA%9E%E7%89%88%E3%81%A8%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88%E3%82%92%E8%A1%8C%E3%81%A3%E3%81%9F%E3%82%8A%E6%9D%A5%E3%81%9F%E3%82%8A%E3%81%A7%E3%81%8D%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    jQuery(function(){
        var nav_text,url;
        if(location.hostname === 'docs.docker.com'){
            nav_text = '日本語ページへ';
            url = 'https://matsuand.github.io/docs.docker.jp.onthefly'+location.pathname+location.hash;
        } else {
            nav_text = '本家(英語)ページへ';
            url = 'https://docs.docker.com'+location.pathname.replace('/docs.docker.jp.onthefly','')+location.hash;
        }
        jQuery('#tabs .tabs').append('<li><a href="'+url+'">'+nav_text+'</a></li>');
    })
})();
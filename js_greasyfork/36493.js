// ==UserScript==
// @name ニコ動全タグロック検知
// @namespace https://armedpatriot.blog.fc2.com/
// @version 1.0.0.7
// @description ニコニコ動画で動画の再生ページを開く際、全てのタグがロックされている場合に確認ダイアログが表示され、閲覧をキャンセルできます。これにより、全てのタグがロックされていることが多い釣り動画の判別の助けになります。
// @author Patriot
// @homepageURL  https://armedpatriot.blog.fc2.com/
// @run-at document-start
// @match http://www.nicovideo.jp/watch/*
// @match https://www.nicovideo.jp/watch/*
// @grant GM_xmlhttpRequest
// @connect ext.nicovideo.jp
// @downloadURL https://update.greasyfork.org/scripts/36493/%E3%83%8B%E3%82%B3%E5%8B%95%E5%85%A8%E3%82%BF%E3%82%B0%E3%83%AD%E3%83%83%E3%82%AF%E6%A4%9C%E7%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/36493/%E3%83%8B%E3%82%B3%E5%8B%95%E5%85%A8%E3%82%BF%E3%82%B0%E3%83%AD%E3%83%83%E3%82%AF%E6%A4%9C%E7%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_xmlhttpRequest({
        method: "GET",
        url: location.protocol+"//ext.nicovideo.jp/api/getthumbinfo/"+location.pathname.split('/')[2],
        headers:{
            "User-Agent": "TagLockDetecter/1.0.0.3 (Twitter @patriot821)"
        },
        onload: function(res) {
            if((res.responseText.match(new RegExp('tag lock="1"', "g")) || []).length>9){
                if(window.confirm("この動画は全てのタグがロックされています。\n\n釣り動画の可能性がありますが、閲覧を続行しますか？")===false){
                    window.close();
                    window.history.back();
                }
            }
        }
    });
})();
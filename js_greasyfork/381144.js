// ==UserScript==
// @name         gbfblacklist
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       Mayako
// @match        http://game.granbluefantasy.jp/
// @resource     bl https://raw.githubusercontent.com/mayako21126/gbfBlacklist/master/blackList.json
// @run-at       document-idle
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/381144/gbfblacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/381144/gbfblacklist.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log(window.document.location.href.indexOf('http://game.granbluefantasy.jp/#lobby/room/member/')+'a')
    if(window.document.location.href.indexOf('http://game.granbluefantasy.jp/#lobby/room/member/')>=0){
        ready()
    }else{
        window.onhashchange = function(e){
            console.log(e.newURL.indexOf('http://game.granbluefantasy.jp/#lobby/room/member/'))
            if(e.newURL.indexOf('http://game.granbluefantasy.jp/#lobby/room/member/')>=0){
                ready()
            }
        }
    }

    // Your code here...
})();

function ready() {
    if(window.$){
        check()
    }else{
        setTimeout(function(){
            check()
        },6000)
    }
}

function check() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://raw.githubusercontent.com/mayako21126/gbfBlacklist/master/blackList.json',
        onload: function(data) {
            var list = JSON.parse(data.response);
            var length = $('.btn-lis-user').length;
            var rArr = []
            for(var i = 0;i<length;i++){
                var ele = $('.btn-lis-user')[i]
                var uid = ele.getAttribute('data-user-id')
                var name = ele.getAttribute('data-nick-name')
                for(var j = 0;j<list.list.length;j++){
                    if(list.list[j].uid==uid){
                        rArr.push('发现惯犯，曾用名'+list.list[j].name+'现用名'+name)
                    }
                }

            }
            if(rArr.length){
                alert(rArr)
            }
        }
    });

}
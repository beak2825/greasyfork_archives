// ==UserScript==
// @name         AOJ beta ICPC
// @version      0.1
// @description  aoj-icpc のリンクをクリックしたら新しいaojにいくやつ
// @author       Eto Nagisa
// @include        http://aoj-icpc.ichyo.jp/*
// @grant        none
// @namespace https://greasyfork.org/users/398343
// @downloadURL https://update.greasyfork.org/scripts/392503/AOJ%20beta%20ICPC.user.js
// @updateURL https://update.greasyfork.org/scripts/392503/AOJ%20beta%20ICPC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByTagName('a');
    for(var i in links){
        var url = links[i].href;
        if(url == void 0) continue;
        if(url.startsWith('http://judge.u-aizu')){
           for(var j = 0; j + 1 < url.length; ++j){
               // idが４桁だと仮定しています
               if(url.substr(j, 2) == 'id'){
                   var id =url.substr(j + 3, 4);
                   links[i].href = 'https://onlinejudge.u-aizu.ac.jp/challenges/search/titles/' + id;
                   break;
               }
           }
        }
    }
})();
// twitter : @eto_nagisa
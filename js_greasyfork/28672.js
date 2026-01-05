// ==UserScript==
// @name         Remove chuanqi
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  从战旗中移除SB传奇
// @author       You
// @match        https://greasyfork.org/en/scripts/13404-ac-%E4%BB%8Egoogle-baidu-bing%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E4%B8%AD%E5%B1%8F%E8%94%BD%E5%8D%A1%E9%A5%AD%E6%95%99%E7%A8%8B
// @include /^https?\:\/\/www.zhanqi.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28672/Remove%20chuanqi.user.js
// @updateURL https://update.greasyfork.org/scripts/28672/Remove%20chuanqi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

})();

var blockList = [];

function addToList(id){
    if(blockList.indexOf(id) == -1){
        blockList.push(id);
    }
}

function exists(id){
    return blockList.indexOf(id) != -1;
}

function saveList(){
    var str = JSON.stringify(blockList);
    $.cookie("bls",str);
}

function loadList(){
    var str = $.cookie("bls");
    if(str){
        blockList = JSON.parse(str);
        console.info("load list " + blockList.length);
    }
}

loadList();

mo = new MutationObserver(function(allmutations) {
    //$('li  span:contains("传奇")').closest('li').remove();
    $.each(allmutations, function( index, record ) {
        $.each(record.addedNodes, function(ind, nd){
            if(nd.localName === "li")      {
                var tmp = $(nd);
                var id =tmp.data('room-id');
                var name = tmp.find("span.name").text();
                if(exists(id)){
                    console.info("block ["+id+"] " + name);
                    tmp.remove();
                }else{
                    if(tmp.find('span:contains("传奇")').length > 0){
                        tmp.remove();
                        console.info("block " + name);
                    }
                }


                // register event
                var spanViews = tmp.find("span.views");
                spanViews.click(function(e){
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    console.info("add to block "+id);
                    addToList(id);
                    saveList();
                    tmp.remove();
                });

                spanViews.hover(
                    function(){
                        var txt =tmp.find("span.views span.dv").text();
                        tmp.data('v-text',txt);
                        tmp.find("span.views span.dv").text("JB88");
                    },
                    function(){
                        var txt = tmp.data('v-text');
                        tmp.find("span.views span.dv").text(txt);
                    });
                spanViews.css("cursor","pointer");
            }
        });
    });
});

var targets = document.body;
mo.observe(targets, {'childList': true,'characterData':true,'subtree': true});
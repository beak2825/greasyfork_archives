// ==UserScript==
// @name         FuckSpam
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove comments on music163
// @author       You
// @match        http://music.163.com//*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/23159/FuckSpam.user.js
// @updateURL https://update.greasyfork.org/scripts/23159/FuckSpam.meta.js
// ==/UserScript==
var list = [
    "osu","藕苏","屙屎","b站","节奏大师","bilibili",
    "哔哩哔哩","逸国","a站","队形","999+","恶俗","ous"
];
var listlen = list.length;

var canFuck = function(text){
    text = text.toLowerCase();
    for(var i=0;i<listlen;i++){
        if(text.indexOf(list[i])) return true;
    }
    return false;
};

var doFilter = function(){
    var count = 0;
    var child = $(".cmmts").children(".itm");
    if(child.size() === 0) return;
    for(var i=child.size()-1;i>=0;i--){
        var item = child.eq(i);
        var text = item.find(".cntwrap .cnt").text();
        if(canFuck(text)){
            item.remove();
            count++;
            continue;
        }
        //评论节点
        var sub = item.find(".cntwrap .que");
        if(sub.size() === 0) continue;
        text = sub.text();
        if(canFuck(text)){
            count++;
            item.remove();
        }
    }
    console.log("Fucked " + count +"! Have fun");
};

(function() {
    $(document).ready(function(){
        // Your code here...
        doFilter();
        $(".m-cmmt .u-page").on("click", "a", function(e){
            setTimeout(function(){
                doFilter();
            }, 500);
            setTimeout(function(){
                doFilter();
            }, 1000);
        });
    });
})();
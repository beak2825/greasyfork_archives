// ==UserScript==
// @name         自演会話
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m4p7.github.io/troll/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415544/%E8%87%AA%E6%BC%94%E4%BC%9A%E8%A9%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/415544/%E8%87%AA%E6%BC%94%E4%BC%9A%E8%A9%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function makeTime(a, b = 0, len = 0){
        var n = Number($("input").val());
        return (a + b * len) * n * 1000;
    }
    function addTextarea(h,placeholder){
        function shape(){
            var text = t.val();
            t.height((text.split('\n').length + 2) + "em");
        }
        var t = $("<textarea>", {
            placeholder: placeholder
        }).appendTo(h).keyup(shape).click(shape).css({
            width: "70%",
            height: "3em"
        });
        return t;
    }
    function splitLine(str){
        return str.split('\n').filter(function(v){
            return v;
        });
    }
    function say(){
        var tokens_str = $("textarea").val();
        var tokens = splitLine(tokens_str);
        var m = input_url.val().match(/([0-9]+)\/([0-9]+)/);
        if(!m) return;
        var room_id = m[2];
        var url = `https://discordapp.com/api/v6/channels/${room_id}/messages`;
        textarea.val().split(/\n\n/g).filter(v=>v).map(function(str,o,a){
            var data = {
                content: str,
                tts: false
            };
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', url );
            xhr.setRequestHeader( "authorization", tokens[o % tokens.length] );
            xhr.setRequestHeader( "content-type", "application/json" );
            setTimeout(function(){
                xhr.send(JSON.stringify(data));
            },makeTime(o,0,a.length));
        });
    }
    var input_url,textarea;
    function run(){
        var h = $("<div>").appendTo("body");
        $("<h1>").appendTo(h).text("拡張機能エリア");
        $("<div>").appendTo(h).text("発言する場所のURL");
        input_url = $("<input>").appendTo(h);
        $("<div>").appendTo(h).text("自演する会話内容");
        textarea = addTextarea(h,"会話させたい内容を改行2文字で区切る");
        h.append("<br><br>");
        $("<button>").appendTo(h).text("自演スタート").click(say);
        h.children().each((i,e)=>$(e).append("<br>"));
    }
    var interval = setInterval(()=>{
        if(document.querySelector("body")){
            clearInterval(interval);
            run();
        }
    },500);
})();
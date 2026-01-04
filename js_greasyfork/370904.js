// ==UserScript==
// @name         AmazonShortUrlButton
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Amazonの商品ページに短縮したURLをクリップボードにコピーするボタンを追加する。
// @author       You
// @match        https://www.amazon.co.jp/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.js
// @downloadURL https://update.greasyfork.org/scripts/370904/AmazonShortUrlButton.user.js
// @updateURL https://update.greasyfork.org/scripts/370904/AmazonShortUrlButton.meta.js
// ==/UserScript==

(function() {
    var inputHtml = '<input type = "button" value = "URLをコピー" name="urlCopy" style="width:100%; font-size:small;margin-bottom:10px"><div id="copyMessage" style="text-align:center; width:100%; font-size:x-small; color:#0000ff;margin-botom:10px"></div>';

    $("#rightCol").prepend(inputHtml);
})();

$("input[name='urlCopy']").click(function(){
    var url = "";
    var protocol = location.protocol;
    var host = location.host;
    var list = location.pathname.split("/");
    if(list[2] == "dp"){
         url = protocol + "//" + host + "/"+ list[2] +"/"+ list[3];
    }else if(list[1] == "dp"){
         url = protocol + "//" + host + "/"+ list[1] +"/"+ list[2];
    }else if(list[1] == "gp"){
         url = protocol + "//" + host + "/"+ list[1] +"/"+ list[2] + "/" + list[3];
    }
    var copyTarget = document.createElement("textarea");
    copyTarget.textContent = url;
    var bodyElm = document.getElementsByTagName("body")[0];
    bodyElm.appendChild(copyTarget);
    copyTarget.select();
    var result = document.execCommand('copy');
    bodyElm.removeChild(copyTarget);
    $("#copyMessage").text("Copyed to clipboard.");
    setTimeout( function() {
        $("#copyMessage").text("");
    } , 2000 );
});
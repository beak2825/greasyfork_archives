// ==UserScript==
// @name         Gmail:Filter Query Area Expander (multi line text area)
// @namespace    http://fruitriin.sakura.ne.jp/
// @version      1.00
// @description  Gmail filter query input box replace text area. So you can write down multi lines.Gmailのフィルタ機能で、マッチングルールを複数行のテキストエリアに置き換えます。
// @author       FruitRiin （果物リン）
// @match        http://mail.google.com/*
// @match        https://mail.google.com/*
// @require      http://code.jquery.com/jquery-2.1.4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/autosize.js/3.0.8/autosize.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12051/Gmail%3AFilter%20Query%20Area%20Expander%20%28multi%20line%20text%20area%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12051/Gmail%3AFilter%20Query%20Area%20Expander%20%28multi%20line%20text%20area%29.meta.js
// ==/UserScript==


$(function(){
    expandFilterBox();
    $(document).on("focus","div.ZZ input",function(){
          expandFilterBox();
    });

    function expandFilterBox(){
        $("div.ZZ input[type=text]").each(function(i,e){
            if($(this).attr("class") == "nr") return true;
            var dir = "";
            if( $(this).attr("dir") !== undefined)
                dir =  "dir="+ $(this).attr("dir");
            $(this).replaceWith("<textarea id="+ $(this).attr("id") +" class=\""+ $(this).attr("class") +"\" "+dir+" style=max-height:140px; >" + $(this).attr("value") + "</textarea>");

        })
        autosize($("div.ZZ textarea"));
    }
    
});


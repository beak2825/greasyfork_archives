// ==UserScript==
// @name         Gmail:Filter Query Area Expander (multi line text area)
// @namespace    http://fruitriin.sakura.ne.jp/
// @version      1.02
// @description  Gmail filter query input box replace text area. So you can write down multi lines.Gmailのフィルタ機能で、マッチングルールを複数行のテキストエリアに置き換えます。
// @author       FruitRiin （果物リン）
// @match        http://mail.google.com/*
// @match        https://mail.google.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/autosize.js/5.0.0/autosize.min.js
// @license      N/A
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458356/Gmail%3AFilter%20Query%20Area%20Expander%20%28multi%20line%20text%20area%29.user.js
// @updateURL https://update.greasyfork.org/scripts/458356/Gmail%3AFilter%20Query%20Area%20Expander%20%28multi%20line%20text%20area%29.meta.js
// ==/UserScript==

/*
  global $
  global autosize
*/

$(function(){
    expandFilterBox();
    $(document).on("focus","div.ZZ input",function(){
          expandFilterBox();
    });

    function expandFilterBox(){
        $("div.ZZ input[type=text]").each(function(i,e){
            if($(this).attr("class") == "nr") return true;
            var dir = "";
            if( $(this).attr("dir") !== undefined) {
                dir = "dir="+ $(this).attr("dir");
            }
            $(this).replaceWith("<textarea id="+ $(this).attr("id") +" class=\""+ $(this).attr("class") +"\" "+dir+" style='max-height:140px;' >" + $(this).attr("value") + "</textarea>");
        })
        $('.w-Pv').css('height', 'auto');
        autosize($("div.ZZ textarea"));
    }
});


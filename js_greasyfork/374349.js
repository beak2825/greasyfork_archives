// ==UserScript==
// @name         Google Autocomplete Keyword Tool
// @namespace    http://www.dennispot.net/
// @version      0.2
// @description  One click to save all autocomplete keywords on google
// @author       www.dennispot.com
// @match        https://www.google.com/
// @match        https://www.google.com/?*
// @match        https://www.google.com.hk/
// @match        https://www.google.com.hk/?*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374349/Google%20Autocomplete%20Keyword%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/374349/Google%20Autocomplete%20Keyword%20Tool.meta.js
// ==/UserScript==

(function() {

$('body').append("<textarea id='saveRightTextArea' style='top: 33%;height: 300px;right: 20px;width: 200px;position: fixed;z-index:10000;padding:10px;font-size:14px;'></textarea>");

var tmp = setInterval(function(){
    if($('.VlcLAe').length > 0){
        clearInterval(tmp);
        $('.aajZCb .VlcLAe center').append("<input id='saveRightbtn' type='button' value='Save all to Right' type='submit' style='background-image:-webkit-linear-gradient(top,#4285f4,#4285f4);background-color:#4285f4;color:#fff;border: 1px solid #f2f2f2;border-radius: 2px;cursor: default;font-family: arial,sans-serif;font-size: 13px;font-weight: bold;margin: 11px 4px;min-width: 54px;padding: 0 16px;text-align: center;height:36px;'>");
    }
}, 100);
    $("body").on("click", "#saveRightbtn", function(){
        var val = $('#saveRightTextArea').val();
        $('ul.erkvQe li').each(function(){
            var txt = $(this).children('.sbtc').children('.sbl1').text();
            if(txt != ""){
                if(val != "")
                    val = val + "\n" + txt;
                else
                    val = txt;
            }
        });
        $('#saveRightTextArea').val(val)
    });
})();
// ==UserScript==
// @name         巴哈姆特吧啦串小心按噓功能(棄用功能)
// @namespace    http://www.isaka.idv.tw/
// @version      0.2-deperated
// @description  吧啦串要小心不要按到噓～現在按到的時候會再次詢問你～
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://guild.gamer.com.tw/guild.php*
// @match        https://guild.gamer.com.tw/singlePost.php*
// @match        https://home.gamer.com.tw/bahawall.php*
// @match        https://home.gamer.com.tw/singlePost.php*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/368561/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%90%A7%E5%95%A6%E4%B8%B2%E5%B0%8F%E5%BF%83%E6%8C%89%E5%99%93%E5%8A%9F%E8%83%BD%28%E6%A3%84%E7%94%A8%E5%8A%9F%E8%83%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368561/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%90%A7%E5%95%A6%E4%B8%B2%E5%B0%8F%E5%BF%83%E6%8C%89%E5%99%93%E5%8A%9F%E8%83%BD%28%E6%A3%84%E7%94%A8%E5%8A%9F%E8%83%BD%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $('.msgitembar span:nth-child(4)').each(function(){
        if( $(this).children().length > 0 ){
            $(this).find('a').text('噓(小心)');
            $(this).find('a').click(function(e){
                if(confirm("你按下了噓鍵！你真的要這樣做嗎？")){
                    return;
                }else{
                    e.preventDefault();
                }
            });
        }
    });
})();
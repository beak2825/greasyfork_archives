// ==UserScript==
// @name         Keylol论坛Steam数据库直达
// @namespace    out
// @version      0.21
// @description  steam数据库直达
// @author       MARK2333
// @support
// @exclude      http*://keylol.com/home.php*
// @match        http*://keylol.com/*
// @match        http*://*.keylol.com/*
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/clipboard.js/2.0.1/clipboard.min.js
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/423165/Keylol%E8%AE%BA%E5%9D%9BSteam%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/423165/Keylol%E8%AE%BA%E5%9D%9BSteam%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

    (function() {
        $(document).ready(function(){
            var clipboard = new ClipboardJS('.button');
            clipboard.on('success', function(e) {
                var btnTarget = $(e.trigger);
                var btnText = btnTarget.text();
                btnTarget.removeClass('button-border');
                btnTarget.addClass('button-highlight');
                setTimeout(function(){
                    btnTarget.text(btnText);
                    btnTarget.removeClass('button-highlight');
                    btnTarget.addClass('button-border');
                },3000);
            });
            //获取所有steam链接
            var allGamesLink = document.querySelectorAll('.steam-info-link');
            //遍历
            for(var i = 0;i < allGamesLink.length;i++){
                var game = allGamesLink[i];
                //游戏名
                var gameName = $(game).text();
                //游戏链接
                var gameLink = game.getAttribute('href');
                //APPID
                var appId,appIdList = gameLink.match(/[0-9]+/);
                if(appIdList>0){
                   appId = appIdList[0];
                   }
                //添加样式
                $(game).after('<a href="https://steamdb.info/app/' + appId + '"target="_blank"><img src="https://s3.ax1x.com/2021/03/14/60OmbF.png" width="20" height="20" border="0"></img></a>');
            }
        })
    })();

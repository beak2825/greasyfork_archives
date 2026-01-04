// ==UserScript==
// @name         ShuWuRedirectToDownload
// @namespace    https://greasyfork.org/zh-CN/users/194463
// @version      0.2
// @description  我的小书屋快速下载
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @author       WayneShao
// @match        http*://www.shuwu.mobi/*
// @match        http*://shuwu.mobi/*
// @match        http*://mebook.cc/*
// @match        http*://www.mebook.cc/*
// @grant        GM_setClipboard
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/370029/ShuWuRedirectToDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/370029/ShuWuRedirectToDownload.meta.js
// ==/UserScript==

(function() {
    if(window.location.href.indexOf('.html')>0)
    {
        var id = window.location.href.substring(window.location.href.lastIndexOf('/')+1,window.location.href.lastIndexOf('.html'));
        //var id =window.location.href.match('[0-9]+');
        window.location.href= window.location.origin + '/download.php?id='+id;
        console.log(id);
    }
    else if(window.location.href.indexOf('download.php')>0)
    {
        $(function(){
            var href = $('body > div.list > a ').attr('href');
            var code = $('body > div.desc').first().text().substring(58).match(/[a-z0-9]{4}/)[0];
            var info = "{ type: 'text', mimetype: 'text/plain'}";
            if(!href.includes('#'))
                href = href + '#' + code;
            GM_setClipboard(href, info);
             //$('body > div.list > a ')[0].click();
            console.log(jQuery.fn.jquery);
            console.log('跳转下载');

            setTimeout(function() {
                window.close();
            }, 50);
        });
    }
    else
    {
        let regex = new RegExp( window.location.origin + "/[0-9]+.html");
        $('a').each(function(i)
                    {
            if(regex.exec(this.href))
            {
                var id1 =this.href.match('[0-9]+');
                console.log(id1.length);
                this.href= window.location.origin + '/download.php?id='+id1;
            }
        });
    }
})();
// ==UserScript==
// @name         偷偷听--网易云音乐
// @namespace    gulolo
// @require  https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @version      0.1.1
// @description  可以用来听歌，替换的url和匹配的地址可以自己改，无法替换url地址和播放音乐的图标
// @author       gulolo
// @match        http://music.163.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38214/%E5%81%B7%E5%81%B7%E5%90%AC--%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90.user.js
// @updateURL https://update.greasyfork.org/scripts/38214/%E5%81%B7%E5%81%B7%E5%90%AC--%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ifarmeUrl = "https://www.baidu.com/",
        title = "百度一下",
        domStr = ifarmeUrl? "<iframe src="+ifarmeUrl+" frameborder='0' scrolling='auto' width='100%' height='100%'></iframe>":'';

    $('link[href="//s1.music.126.net/music.ico?v1"]').remove();

    setTimeout(function(){
        var head = document.getElementsByTagName('head')[0],
            iconURL = 'https://www.baidu.com/favicon.ico',
            linkTag = document.createElement('link');

        linkTag.href = iconURL;
        linkTag.setAttribute('rel','shortcut icon');

        head.appendChild(linkTag);

    },1000);

    setInterval(function(){
        if(document.title!=title){
            document.title=title;
        }
    },200);

    $('body').append('<div style="position:fixed;top:0;left:0;bottom:0px;background:#fff;z-index:1000;right:0;">'+domStr+'</div>');
})();
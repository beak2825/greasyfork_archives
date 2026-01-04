// ==UserScript==
// @name         PoipikuHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Poipiku批量下载图片+去广告
// @author       404s
// @match        https://poipiku.com/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poipiku.com
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-1.9.0.min.js
// @grant        unsafeWindow
// @grant        GM_download
// @connect      *
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/447264/PoipikuHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/447264/PoipikuHelper.meta.js
// ==/UserScript==

(function () {
    $('.PcSideBar>.FixFrame').prepend("<button style='' id='todownload'>下载poipiku图片</button>");

    $('.FooterAd').remove();
    $('.IllustItemList>span').remove()
    $('.PcSideBar>.PcSideBarItem').remove()
    $('.PcSideBar>.FixFrame>.PcSideBarItem')[1].remove()

    $('.IllustItemExpandBtn').click();

    $('#todownload').click(function () {
        var i = 0;
        var info = $(location).attr('href');
        var file = info.split("/");
        var file_pre = file[3]+'_'+file[4].substring(0, file[4].lastIndexOf("."));
        $(".IllustItemThumbImg").each(function () {
            var mysrc = $(this).attr("src");
            var real = mysrc.substring(0, mysrc.lastIndexOf("_"));
            var group = real.split("/");
            var file_app = group[group.length - 1];
            file_app = file_app.substring(file_app.lastIndexOf("."), file_app.length);
            var num = (Array(3).join(0) + i).slice(-3);
            var name = file_pre+'_'+num+file_app;
            GM_download('https:'+real, name);
            i++;
        });
    });

})();
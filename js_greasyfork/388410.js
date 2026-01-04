// ==UserScript==
// @name         在下载页显示磁链
// @namespace    http://tampermonkey.net/
// @version      0.01
// @author       Ericthe
// @include      https://exhentai.org/gallerytorrents.php*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @connect      *
// @description  无
// @downloadURL https://update.greasyfork.org/scripts/388410/%E5%9C%A8%E4%B8%8B%E8%BD%BD%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%A3%81%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/388410/%E5%9C%A8%E4%B8%8B%E8%BD%BD%E9%A1%B5%E6%98%BE%E7%A4%BA%E7%A3%81%E9%93%BE.meta.js
// ==/UserScript==

$(document).ready(function(){
    $('table').each(function(i, ele){
        var magnet = "magnet:?xt=urn:btih:" + $(ele).find('a').attr('href').match(/[\w\d]{40}/).toString();
        $(ele).append(" &nbsp; <a href=" + magnet + "><font color='#00FFFF'>magnet</font></a>");
    });
});
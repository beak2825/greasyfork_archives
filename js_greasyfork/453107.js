// ==UserScript==
// @name         Zhihu direct link access
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       jonbakerfish
// @match        https://link.zhihu.com/?target=*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @description  在知乎点击外网链接时，自动跳转到目标链接地址，避免人工点击“继续访问”按钮
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/453107/Zhihu%20direct%20link%20access.user.js
// @updateURL https://update.greasyfork.org/scripts/453107/Zhihu%20direct%20link%20access.meta.js
// ==/UserScript==

$(window).on('load',function(){
    var url    = (location.href).substr(31);
    var result = decodeURIComponent(url);
    window.location.href = result;
})(jQuery);
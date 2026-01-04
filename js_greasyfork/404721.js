// ==UserScript==
// @name         有道翻译HTTPS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使有道翻译在HTTPS下正常运作
// @author       mom0a
// @match        https://fanyi.youdao.com
// @require      https://code.jquery.com/jquery-latest.js
// @namespace    https://greasyfork.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404721/%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91HTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/404721/%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91HTTPS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('link').each(function(){
        $(this).attr('href',$(this).attr('href').replace(/http\:\/\//i,'https://'));
    });
    $('script').each(function(){
        if($(this).attr('src')){
           $('body').append('<script src="'+$(this).attr('src').replace(/http\:\/\//i,'https://')+'"></script>')
        }
    });
})();
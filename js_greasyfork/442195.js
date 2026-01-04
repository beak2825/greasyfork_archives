// ==UserScript==
// @name         新番一键添加跳转到Sonarr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  新番一键跳转到Sonarr
// @author       DeQxJ00
// @match        https://yuc.wiki/*/
// @match        https://yuc.wiki/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuc.wiki
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442195/%E6%96%B0%E7%95%AA%E4%B8%80%E9%94%AE%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%E5%88%B0Sonarr.user.js
// @updateURL https://update.greasyfork.org/scripts/442195/%E6%96%B0%E7%95%AA%E4%B8%80%E9%94%AE%E6%B7%BB%E5%8A%A0%E8%B7%B3%E8%BD%AC%E5%88%B0Sonarr.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const yoursonarrurl ="http://yoursonarrip";
    const sonarrurl = yoursonarrurl+"/add/new?term=";

    var pattern = /第(\d+)期|第(\d+)季|第(\d+)部/;
    var names_cn = $(".title_cn,.title_cn_,.title_cn__");
    $.each(names_cn, function(i, field){
        var text = field.innerText;
        var match = text.match(pattern);
        if(match){
            text = text.replaceAll(match[0],"");
        }
        var url = sonarrurl+text.replaceAll(' ','%20');
        $(field).append(" <a target='_blank' href='"+url+"'>Link</a>");
    });
    var names_jp = $(".title_jp,.title_jp_,.title_jp__");
    $.each(names_jp, function(i, field){
        var text = field.innerText;
        var match = text.match(pattern);
        if(match){
            text = text.replaceAll(match[0],"");
        }
        var url = sonarrurl+text.replaceAll(' ','%20');
        $(field).append(" <a target='_blank' href='"+url+"'>Link</a>");
    });
})();
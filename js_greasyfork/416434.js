// ==UserScript==
// @name         Web of Science DOI add href
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Change the plain text doi in WOS to hyper link, 在WOS的文章页面将DOI的文本展示改为超链接
// @author       Zhou Yucheng
// @match        https://apps.webofknowledge.com/full_record*
// @match        http://apps.webofknowledge.com/full_record*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416434/Web%20of%20Science%20DOI%20add%20href.user.js
// @updateURL https://update.greasyfork.org/scripts/416434/Web%20of%20Science%20DOI%20add%20href.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        var values=document.querySelectorAll('#records_form > div > div > div > div.l-column-content > div > div.block-record-info.block-record-info-source > p > value');
        for (var v of values){
            var x=v.innerHTML;
            if(x.substr(0,3)=="10."){ //doi always start with "10.xxx"
                v.innerHTML="<a href='https://doi.org/"+x+"'>"+x;
            }
        }
    }
})();

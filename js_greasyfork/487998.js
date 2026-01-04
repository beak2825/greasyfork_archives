// ==UserScript==
// @name         FC2
// @namespace    http://tampermonkey.net/
// @version      2024-02-22
// @description  FC2fuzhu
// @author       You
// @match        https://adult.contents.fc2.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487998/FC2.user.js
// @updateURL https://update.greasyfork.org/scripts/487998/FC2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //JS 取右字符函数
    function jsright(obj,str){
        var index = obj.indexOf(str);
        obj = obj.substring(index + 1,obj.length);
        return obj;
    }
    var i,urlstr,str,addstr;
    var getclass=jQuery('.c-cntCard-110-f_thumb a');
    for(i=0;i<getclass.length;i++)
    {
        console.log(i);
        urlstr=getclass[i].href;
        console.log(urlstr);
        str =jsright(urlstr, '=');
        console.log(str);
        jQuery('.c-cntCard-110-f_price')[i].innerHTML= jQuery('.c-cntCard-110-f_price')[i].innerHTML+' <a href="https://btsow.motorcycles/search/'+str+'" target="_blank">search</a>'
        ;

    }
})();
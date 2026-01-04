// ==UserScript==
// @name         1024_mob_add_href
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  1024 mobile version add href link, remove onclick.
// @author       You
// @match        *://*/thread0806.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408940/1024_mob_add_href.user.js
// @updateURL https://update.greasyfork.org/scripts/408940/1024_mob_add_href.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if( document.cookie.indexOf('ismob=1') == -1){
        console.log('desktop');
        var aLists = document.getElementsByTagName('a');
        for(var i = 0;i < aLists.length; i++){
            if(aLists[i].href.indexOf("htm_data/") > -1 ){
                aLists[i].href = aLists[i].href.replace('htm_data','htm_mob');
            }
        }
    }else{
        console.log('mobile');
        $('.t_one').each(function(){
            var hf = $(this).attr('onclick');
            if(hf != undefined){
                hf = hf.substring(hf.indexOf('htm_mob'),hf.lastIndexOf('.html')+5);
                $(this).children().attr('href',hf);
                $(this).children().attr('target',"_blank");
                $(this).removeAttr('onclick');
            }
        })
    }
})();
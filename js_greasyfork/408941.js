// ==UserScript==
// @name         1024_mobile_magnet
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  1024 mobile version copy magnet 
// @author       You
// @match        *://*/htm_mob/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408941/1024_mobile_magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/408941/1024_mobile_magnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('a').each(function(){
        if(this.href.indexOf('link.php?hash=') != -1){
            var hash = this.href.substr(this.href.lastIndexOf('hash=')+8,40)
            var ss = document.createElement('textarea');
            ss.readOnly=true;
            ss.innerHTML='magnet:?xt=urn:btih:'+hash;
            this.href = ss.innerHTML;
            ss.onclick=function(){
                this.select();
                document.execCommand('copy');
            }
            this.after(ss)
        }
    })
    
})();
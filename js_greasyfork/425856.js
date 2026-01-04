// ==UserScript==
// @name         奈非
// @namespace    Sniper
// @version      0.1
// @description  屏蔽广告
// @author       You
// @match        https://www.nfmovies.com
// @include      *://www.nfmovies.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/425856/%E5%A5%88%E9%9D%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/425856/%E5%A5%88%E9%9D%9E.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    let call = 0
    let back = document.getElementById
    document.getElementById = function(str){
        //console.log(str)
        if(/^ar/.test(str)) return 1

        let dom = back.call(document,str)
        if(str === 'aaaCountdown') {
            //debugger
            closeAd()
        }
        if(str === 'aaaDiv2'){
            setTimeout(()=> dom.style.display = 'none')
        }

        //console.log(dom)
        if(dom!=null) return dom
        else return 1

    }
    setTimeout(()=>back.call(document,'aaaCountdown').click(), 1000)

})();
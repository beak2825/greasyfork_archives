// ==UserScript==
// @name         stboy read mode
// @namespace    https://ipv6.stboy.net
// @version      0.3
// @description  stboy.net read mode by wzh
// @author       wzh
// @include      http*://74.222.26.86/*
// @include      http*://74.222.26.90/*
// @include      http*://ipv6.stboy.net/*
// @include      http*://[2607:fa98:10::222]/*
// @include      http*://stboy.net/*
// @include      http*://www.stboy.net/*
// @include      http*://bbs.stboy.net/*
// @grant        GM_addStyle
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/370828/stboy%20read%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/370828/stboy%20read%20mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) obj.className += " " + cls;
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }

    function toggleClass(obj,cls){
        if(hasClass(obj,cls)){
            removeClass(obj, cls);
        }else{
            addClass(obj, cls);
        }
    }

    function loadCssCode(code){
        if (GM_addStyle) {
            GM_addStyle(code)
        } else {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.rel = 'stylesheet';
            style.appendChild(document.createTextNode(code));
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(style);
        }
    }
    /*
.wzh-stboy {
  .pls, #f_pst, .psth, .rate, #hd, .scrolltop, #toptb, #ft, .po.hin, #pgt {
    display: none;
  }
  #hd .wp, #wp {
    min-width: 0;
  }
}
#wzh-st-button {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 60px;
  opacity: 0.5;
  z-index: 99999;
}
*/
    loadCssCode('.wzh-stboy .pls,.wzh-stboy #f_pst,.wzh-stboy .psth,.wzh-stboy .rate,.wzh-stboy #hd,.wzh-stboy .scrolltop,.wzh-stboy #toptb,.wzh-stboy #ft,.wzh-stboy .po.hin,.wzh-stboy #pgt{display:none}.wzh-stboy #hd .wp,.wzh-stboy #wp{min-width:0}#wzh-st-button{position:fixed;bottom:0;left:0;width:60px;height:60px;opacity:.5;z-index:99999}')
    var bt=document.createElement("button");
    bt.innerHTML = '切换';
    bt.id = 'wzh-st-button'
    bt.onclick = function () {
        toggleClass(document.getElementsByTagName('body')[0], "wzh-stboy");
    };

    document.getElementsByTagName('body')[0].appendChild(bt);

})();
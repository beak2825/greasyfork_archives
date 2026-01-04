// ==UserScript==
// @name         bthub磁力搜索
// @namespace    bthub
// @version      0.1
// @description  bthub磁力搜索，基于磁力搜索改写
// @match        *://*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.1.0.js
// @license      MIT
// @icon         https://s1.ax1x.com/2018/12/21/FsZEvT.png
// @downloadURL https://update.greasyfork.org/scripts/399501/bthub%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/399501/bthub%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`#zizhuIcon {width: 36px; height: 36px;box-shadow: 2px 2px 4px rgba(12,12,12,.3); border-radius: 5px; cursor: pointer;}
                 #zizhuMain {position: absolute; top: 0; left: 0; width: 0; height: 0; background: #fff; font-size: 12px; opacity: 0;z-index: 9999;display:none;box-sizing: border-box;}`)
    var innerIcon = "<img src='data:image/png;base64,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' id='zizhuIcon' alt='磁力mp4搜索' title='磁力mp4搜索'/>"
    var txt = ''
    var odom = document.createElement("div");
    odom.id = "zizhuMain";
    odom.innerHTML = innerIcon;
    document.body.appendChild(odom);
    document.querySelector("#zizhuMain").addEventListener("click",searchSetting);
    function searchSetting(){
       //location.href="https://biedian.me/"+txt
        if(txt.length != 0){
            //window.open('https://bthub.site/main-search-kw-'+txt+'-1.html')
            window.open('https://bthub.site/main-search-kw-'+txt+'-1.html')
        }
    }
    $('body').mouseup(function(e){
        txt = window.getSelection?window.getSelection().toString():document.selection.createRange().text;
        let sel = window.getSelection()
        var range = sel.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        var scrollH = $(document).scrollTop();
        var scrollW = $(document).scrollLeft();
        if(txt && txt.length != 0){
            $('#zizhuMain').css({ "top": rect.y+scrollH+20+'px', "left": rect.x+scrollW+'px','opacity':1,'width':'36px','height':'36px','display': 'block' })
        } else {
            $('#zizhuMain').css({'opacity':0 ,'width':'0','height':'0','display': 'none' })
        }
    })
})();
// ==UserScript==
// @name         磁力猪搜索
// @namespace    https://pigcili.com
// @version      0.0.2
// @description  磁力猪随时随地搜索磁力信息,一键搜索,超高效
// @author       小猪猪
// @match        *://*/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.1.0.js
// @license      MIT
// @icon         https://cdn-img.easyicon.net/png/376/37643.gif
// @downloadURL https://update.greasyfork.org/scripts/374530/%E7%A3%81%E5%8A%9B%E7%8C%AA%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/374530/%E7%A3%81%E5%8A%9B%E7%8C%AA%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`#pigIcon {width: 36px; height: 36px;box-shadow: 2px 2px 4px rgba(12,12,12,.3); border-radius: 5px; cursor: pointer;}
                 #pigMain {position: absolute; top: 0; left: 0; width: 0; height: 0; background: #fff; font-size: 12px; opacity: 0;z-index: 9999;display:none;box-sizing: border-box;}`)
    var innerIcon = "<img src='data:image/gif;base64,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' id='pigIcon' alt='磁力猪搜索' title='磁力猪搜索'/>"
    var txt = ''
    var odom = document.createElement("div");
    odom.id = "pigMain";
    odom.innerHTML = innerIcon;
    document.body.appendChild(odom);
    document.querySelector("#pigMain").addEventListener("click",searchSetting);
    function searchSetting(){
        if(txt.length != 0){
            window.open('https://pigcili.com/s/'+txt+'/time-1.html')
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
            $('#pigMain').css({ "top": rect.y+scrollH+20+'px', "left": rect.x+scrollW+'px','opacity':1,'width':'36px','height':'36px','display': 'block' })
        } else {
            $('#pigMain').css({'opacity':0 ,'width':'0','height':'0','display': 'none' })
        }
    })
})();
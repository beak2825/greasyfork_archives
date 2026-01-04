// ==UserScript==
// @name         U2个人页面关闭坏人卡显示
// @namespace    https://github.com/sion-x
// @version      0.1.1
// @description  关闭个人页面坏人卡显示，我没看见等于没有
// @author       Sion
// @match        https://u2.dmhy.org/userdetails.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403905/U2%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%97%AD%E5%9D%8F%E4%BA%BA%E5%8D%A1%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/403905/U2%E4%B8%AA%E4%BA%BA%E9%A1%B5%E9%9D%A2%E5%85%B3%E9%97%AD%E5%9D%8F%E4%BA%BA%E5%8D%A1%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
function getInnerText(element) {
       if (typeof element.textContent == "undefined") {
           return element.innerText;
       } else {
           return element.textContent;
       }
   }
   
    var hideBlockedBy = function()
    {
        var table = document.getElementsByTagName('td');
        for(var i = 0; i < table.length; i ++)
        {
            if(getInnerText(table[i]) == '收到坏人卡')
            {
                console.log(table[i].parentNode)
                table[i].parentNode.remove()
                return 0;
            }
        }
    }

hideBlockedBy()

})();
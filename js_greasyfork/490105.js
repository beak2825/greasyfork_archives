// ==UserScript==
// @name         京东购物车显示自营
// @namespace    http://tampermonkey.net/
// @version      2024-03-17
// @description  f?ck jd
// @author       7nc
// @match        https://cart.jd.com/cart_index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490105/%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%98%BE%E7%A4%BA%E8%87%AA%E8%90%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/490105/%E4%BA%AC%E4%B8%9C%E8%B4%AD%E7%89%A9%E8%BD%A6%E6%98%BE%E7%A4%BA%E8%87%AA%E8%90%A5.meta.js
// ==/UserScript==

(function() {
    // Your code here...


    function handleSelf(){
        var shopList = document.getElementsByClassName("shop-name")
        for(let i = 0; i<shopList.length; i++){

            var shopName = shopList[i]
            var shopId = shopName.dataset.vendorid

            if(shopId && shopId.indexOf("1000")>-1){
                //console.log(shopId+" is ok")
                var selfIcon = document.createElement("em");
                selfIcon.setAttribute("style", "padding: 2px;margin-right: 2px;text-align: center;color: #fff;background: #e4393c;");
                selfIcon.innerText = "自营";
                shopName.insertBefore(selfIcon,shopName.firstChild);
            }
        }
    }

    var existCondition = setInterval(function() {
        if (document.getElementsByClassName("shop-name").length) {
            console.log("ready to shit!");
            clearInterval(existCondition);
            handleSelf()
        }
    }, 500);
})();
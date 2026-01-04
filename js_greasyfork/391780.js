// ==UserScript==
// @name         半自动删除淘宝收藏店铺
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://favorite.taobao.com/shop_collect_list_n.htm*
// @grant        none
//@require      https://cdn.jsdelivr.net/npm/jquery@1.12.4/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391780/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%B7%98%E5%AE%9D%E6%94%B6%E8%97%8F%E5%BA%97%E9%93%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/391780/%E5%8D%8A%E8%87%AA%E5%8A%A8%E5%88%A0%E9%99%A4%E6%B7%98%E5%AE%9D%E6%94%B6%E8%97%8F%E5%BA%97%E9%93%BA.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
    var str191031 = ` <button style="position: fixed;top: 0;right: 0;z-index:9999999" class="bt191031">一键删除当前页面显示的收藏店铺</button>`
        $("body").append(str191031);
        $(".bt191031").click(function(){
            $(".J_DeleteItem").click();
            $(".J_DeleteItem_Ok").click();
        });
    // Your code here..
});
})();
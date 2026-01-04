// ==UserScript==
// @name         こはる.萌え自动屏蔽≤1节点
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      *.alicization.org/user/node
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390622/%E3%81%93%E3%81%AF%E3%82%8B%E8%90%8C%E3%81%88%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E2%89%A41%E8%8A%82%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/390622/%E3%81%93%E3%81%AF%E3%82%8B%E8%90%8C%E3%81%88%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E2%89%A41%E8%8A%82%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    $(".node-card").find(".onlinemember").find("span").each(function(i, o){
        if($(o).html().trim() <= "1"){
            $(o).closest(".node-card").css("display","none");
        }
    });
    $(".node-card").find(".nodeoffline").each(function(i, o){
        $(o).closest(".node-card").css("display","none");
    });
})();
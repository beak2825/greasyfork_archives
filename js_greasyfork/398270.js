// ==UserScript==
// @name         自动展开云栖社区
// @namespace    https://java666.cn
// @version      0.2
// @description  自动展开云栖社区的文章
// @author       geekyouth
// @match        https://yq.aliyun.com/articles/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398270/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E4%BA%91%E6%A0%96%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398270/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E4%BA%91%E6%A0%96%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    
    var jumptoread = function(){
    document.getElementById("btn-readmore").click();
}

setTimeout(jumptoread, 2000);

})();
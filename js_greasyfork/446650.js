// ==UserScript==
// @name        屏蔽百度首页底部白条
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  适用于在百度首页设置自定义皮肤后（尤其是暗色的皮肤），底部白条不协调的情况
// @author       Young
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446650/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%BA%95%E9%83%A8%E7%99%BD%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/446650/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%E5%BA%95%E9%83%A8%E7%99%BD%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
   let bottom_layer=document.getElementById("bottom_layer");
   if(bottom_layer!=null){ bottom_layer.style.display="none";}

	 $('#bottom_layer').hide();
})();
//ps:代码仿照别人做的，可能很垃圾，别介意~//
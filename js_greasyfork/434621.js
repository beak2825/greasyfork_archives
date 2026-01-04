// ==UserScript==
// @name         蜀乐互动修改几个CSS
// @namespace    https://www.liuxiaogang.com/
// @version      0.1
// @description  修改蜀乐互动几个不舒服的CSS属性。
// @author       LiuXiaoGang
// @match        https://www.shulehudong.com/app/index.php?*
// @icon         https://shulehudong.oss-cn-hangzhou.aliyuncs.com/images/global/epGGBeB972771GnEJUUE7QDgYJB6gN.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434621/%E8%9C%80%E4%B9%90%E4%BA%92%E5%8A%A8%E4%BF%AE%E6%94%B9%E5%87%A0%E4%B8%AACSS.user.js
// @updateURL https://update.greasyfork.org/scripts/434621/%E8%9C%80%E4%B9%90%E4%BA%92%E5%8A%A8%E4%BF%AE%E6%94%B9%E5%87%A0%E4%B8%AACSS.meta.js
// ==/UserScript==

(function myFunction() {

// 修改排名页面的宽度 修改排名页选手居中
var a1 = document.getElementsByClassName("livemark-phb-others");
for(var i = 0; i < a1.length; i++){
    a1[i].style.width = "1150px";
    a1[i].style.textAlign = "center";
}
// 修改个人得分页的介绍为居中显示
var a2 = document.getElementsByClassName("livemark-userone-des");
for(var j = 0; j < a2.length; j++){
    a2[j].style.textAlign = "center";
}
})();

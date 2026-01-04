// ==UserScript==
// @name         明道照片功能
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在https://www.mingdao.edu.tw/homeX/Web/?stuO的時候，會出現招牌圖片
// @author       You
// @match        https://www.mingdao.edu.tw/homeX/Web/?stuO
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452030/%E6%98%8E%E9%81%93%E7%85%A7%E7%89%87%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/452030/%E6%98%8E%E9%81%93%E7%85%A7%E7%89%87%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var pics = document.querySelectorAll('img');
     //檢查圖片是否是第17個
    if (pics[17].src != "https://www.mingdao.edu.tw/homeX/Web/images/mdhscloud_stu_pic.jpg") {
        console.log("圖片不是第17個");
    } else {
        var pic = pics[17];
    }
    changePhoto(pic);
})();

function changePhoto(pic) {
    //console.log(pic);
    pic.src = "https://www.linkpicture.com/q/g93.png";

}
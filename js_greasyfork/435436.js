// ==UserScript==
// @name         超星课件左右翻页
// @author       CodingDogzxg
// @namespace    https://github.com/CodingDogzxg
// @version      0.1
// @description  PPT页面小于号和大于号键翻页
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?chapterId=*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435436/%E8%B6%85%E6%98%9F%E8%AF%BE%E4%BB%B6%E5%B7%A6%E5%8F%B3%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/435436/%E8%B6%85%E6%98%9F%E8%AF%BE%E4%BB%B6%E5%B7%A6%E5%8F%B3%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==


document.onready = function() {
    document.onkeydown = function(e){
        let iframe_obj1 = document.getElementsByClassName("content")[0].getElementsByTagName("iframe")[0];
        let iframe_obj2 = iframe_obj1.contentWindow.document.getElementsByTagName("iframe")[0].contentWindow.document;
        let num = parseInt(iframe_obj2.getElementsByClassName("num")[0].innerText);
        let all = parseInt(iframe_obj2.getElementsByClassName("all")[0].innerText);
        // 对整个页面监听
        var keyNum = window.event ? e.keyCode : e.which;
        // console.log(keyNum);
        if(keyNum==13) {};
        if(keyNum==188){
            if(num > 1){
                iframe_obj2.getElementsByClassName("preBtn")[0].click();
            } else alert("Already at the very front!");
        }
        if(keyNum==190){
            if (num < all) {
                iframe_obj2.getElementsByClassName("nextBtn")[0].click();
            } else alert("Already at the very end!");
        }
    }
}
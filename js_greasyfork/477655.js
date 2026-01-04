// ==UserScript==
// @name         果仁网每日签到
// @version      1
// @description  自动刷新签到
// @author       xiaoheidashushu
// @match      https://guorn.com/user/home*
// @grant        none
// @namespace https://greasyfork.org/users/1198586
// @downloadURL https://update.greasyfork.org/scripts/477655/%E6%9E%9C%E4%BB%81%E7%BD%91%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477655/%E6%9E%9C%E4%BB%81%E7%BD%91%E6%AF%8F%E6%97%A5%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    setTimeout(function() {

        console.log("打开页面睡眠3秒");
        document.querySelector("#title-nav-bar > div.dropdown.user.right-side").classList.add("open");
        //获取签到按钮
        var sign =document.querySelector('#title-nav-bar > div.dropdown.user.right-side.open > ul > li.dropdown-header.signin.title-li');
        //获取签到文字
        var text =sign.innerText;
        //签 = 0
        if(text.indexOf('每日签到') != -1){
            sign.click();
            console.log("签到成功");
        }else{
            console.log("已签到");
        }
        document.querySelector("#title-nav-bar > div.dropdown.user.right-side").classList.remove("open");

    }, 3000);

})();
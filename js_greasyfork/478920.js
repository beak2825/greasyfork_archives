// ==UserScript==
// @name         重庆市石柱县2023年行政执法人员考试云平台-题库
// @namespace    代刷vx：shuake345
// @version      0.1
// @description  代刷vx：shuake345
// @author       You
// @match        https://chongqingshi.zhifa315.com/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhifa315.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478920/%E9%87%8D%E5%BA%86%E5%B8%82%E7%9F%B3%E6%9F%B1%E5%8E%BF2023%E5%B9%B4%E8%A1%8C%E6%94%BF%E6%89%A7%E6%B3%95%E4%BA%BA%E5%91%98%E8%80%83%E8%AF%95%E4%BA%91%E5%B9%B3%E5%8F%B0-%E9%A2%98%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/478920/%E9%87%8D%E5%BA%86%E5%B8%82%E7%9F%B3%E6%9F%B1%E5%8E%BF2023%E5%B9%B4%E8%A1%8C%E6%94%BF%E6%89%A7%E6%B3%95%E4%BA%BA%E5%91%98%E8%80%83%E8%AF%95%E4%BA%91%E5%B9%B3%E5%8F%B0-%E9%A2%98%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function fisrt(){
        if(localStorage.getItem('key')!=='1'){
            alert('即将跳转题库，代刷任何网课+考试：微信shuake345')
           localStorage.setItem('key','1')
        window.open('https://docs.qq.com/sheet/DR25MVUR4R01JWEx3?tab=BB08J2','target','');
        }

    }
    setTimeout(fisrt,2450)


    // Your code here...
})();
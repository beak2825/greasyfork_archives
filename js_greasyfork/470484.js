// ==UserScript==
// @name        洛谷自动签到
// @namespace   peasoft.github.io
// @match       https://www.luogu.com.cn/
// @grant       none
// @require     https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @version     1.0
// @author      陆鎏澄
// @description 打开洛谷首页后自动签到。
// @icon        https://cdn.luogu.com.cn/fe/logo.png
// @license     CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/470484/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/470484/%E6%B4%9B%E8%B0%B7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

function punch(){
    let btns = document.getElementsByName("punch");
    if(btns){
        btns[0].click();
        Swal.fire({
            toast: true,
            position: 'top',
            showCancelButton: false,
            showConfirmButton: false,
            title: '已自动签到！',
            icon: 'success',
            timer: 2000,
        });
    }
}

setTimeout(punch, 1000);
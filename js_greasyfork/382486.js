// ==UserScript==
// @name         妖火显示楼主等级
// @namespace    https://poxiaobbs.com/
// @version      0.1
// @description  妖火网浏览帖子时显示楼主等级
// @author       Swilder-M
// @match        https://yaohuo.me/bbs-*
// @include      https://yaohuo.me/bbs-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382486/%E5%A6%96%E7%81%AB%E6%98%BE%E7%A4%BA%E6%A5%BC%E4%B8%BB%E7%AD%89%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/382486/%E5%A6%96%E7%81%AB%E6%98%BE%E7%A4%BA%E6%A5%BC%E4%B8%BB%E7%AD%89%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取楼主空间地址
    var user_id = document.getElementsByClassName('subtitle')[1].firstElementChild.href;
    console.log(user_id);

    function success(rp) {
        var lv_zz = /<b>等级:<\/b>(\S*)级/
        var lv_text = rp.match(lv_zz)[1]
        console.log(lv_text);
        addLvTip(lv_text);
    }

    function fail(code) {
        console.log('error');
    }

    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            if (request.status === 200) {
                return success(request.responseText);
            } else {
                return fail(request.status);
            }
        } else {
        }
    }
    request.open('GET', user_id);
    //request.responseType = 'document';
    request.send();

    function addLvTip(lv) {
        console.log(2222);
        console.log(lv);
        var info_d = document.getElementsByClassName('subtitle')[1]
        var user_name_d = info_d.children[1]
        console.log(user_name_d);

        var lv_d = document.createElement('div');
        lv_d.innerText = 'Lv ' + lv;
        lv_d.style = "display:inline;margin-left:10px; text-align:center; margin-right:10px;color:#ff4234;font-size:17px;border-radius: 30px;";
        info_d.insertBefore(lv_d, user_name_d);
    }


})();
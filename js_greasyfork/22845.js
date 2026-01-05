// ==UserScript==
// @name         Acfun随机送香蕉
// @namespace    https://greasyfork.org/users/63665
// @homepage     https://greasyfork.org/scripts/22845
// @version      0.0.9
// @description  Acfun随机送香蕉500次
// @author       You
// @match        http://www.acfun.tv
// @match        http://www.aixifan.com
// @grant        none
// @icon         http://cdn.aixifan.com/ico/favicon.ico
// @note         github更新测试
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/22845/Acfun%E9%9A%8F%E6%9C%BA%E9%80%81%E9%A6%99%E8%95%89.user.js
// @updateURL https://update.greasyfork.org/scripts/22845/Acfun%E9%9A%8F%E6%9C%BA%E9%80%81%E9%A6%99%E8%95%89.meta.js
// ==/UserScript==
function acPostBananas(_cid, _uid) {
    $.post("/banana/throwBanana.aspx", {
        count: "5",
        contentId: _cid,
        userId: _uid
    },
           function(data, status) {
        if (status == "success") {
            console.log(data.result);
        } else {
            console.log("网络错误");
        }

    });
}
(function(){
    userId=$.cookie('auth_key');
    if (userId !== '' && userId !== null) {
        if(confirm('检测到已登录，是否执行一键随机送蕉500次？')){
            max=3100000;
            min=1;
            for(i=1;i<=500;i++){
                contentid=Math.ceil(Math.random()*(max-min)+min);
                console.log(contentid);
                acPostBananas(contentid,userId);
            }
        }
    }
}());

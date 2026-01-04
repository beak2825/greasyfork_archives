// ==UserScript==
// @name         显示openid
// @namespace    
// @version      0.12
// @description  显示微信用户账号openid
// @author       penrcz
// @match        https://mp.weixin.qq.com/cgi-bin/user_tag*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/458512/%E6%98%BE%E7%A4%BAopenid.user.js
// @updateURL https://update.greasyfork.org/scripts/458512/%E6%98%BE%E7%A4%BAopenid.meta.js
// ==/UserScript==

function addXMLRequestCallback(callback){
    var oldSend, i;
    if( XMLHttpRequest.callbacks ) {
        XMLHttpRequest.callbacks.push( callback );
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(){
            for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                XMLHttpRequest.callbacks[i]( this );
            }
            oldSend.apply(this, arguments);
        }
    }
}


//显示openid
function show_openid(){
    var select_user_info = document.querySelectorAll(".user_info_nick_name > .nick_name");

    select_user_info.forEach(function(u,i){
        let fakeid = u.getAttribute("data-fakeid");
        u.style.color = "red";
        u.style.display = "block";
        u.innerHTML = fakeid;
    });
}

//加载脚本时就启动函数开始监听
(function() {
    'use strict';
    show_openid();
    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                //console.log( xhr.responseURL );
                //console.log( xhr.status + ":" + xhr.responseURL );
                if ( xhr.responseURL.includes("user_tag?action=get_user_list")  || xhr.responseURL.includes("user_tag?action=search")) {
                    show_openid();
                }
            }
        });
    });
})();
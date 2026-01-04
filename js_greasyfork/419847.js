// ==UserScript==
// @name         Jav增强
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       *://www.javlibrary.com/cn/?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419847/Jav%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/419847/Jav%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.getQueryString = function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        console.log("wtf?")
        if (r != null) {
            return unescape(r[2]);
        };
        return null;
    }

    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }

    $("#video_id").click(function (){
        copyText($("#video_id").find(".text")[0].innerText,function (){console.log('复制成功')});
    })

})();
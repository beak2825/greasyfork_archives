// ==UserScript==
// @name         javdb复制地址
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://javdb.com/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421638/javdb%E5%A4%8D%E5%88%B6%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/421638/javdb%E5%A4%8D%E5%88%B6%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const btn=$('<a target="_blank" class="button is-info is-outlined is-small modal-button"><strong>复制</strong></a>')
    btn.click(()=>{
        let result=""
        $("#magnets-content a").each(function(){
            //console.log($(this).attr("href"))
           result+=($(this).attr("href")+"\r\n")
        })
        console.log(result)
        copyText(result)
    })
    $(".moj-content").append(btn)

    // 复制的方法
    function copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('textarea');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    }
    // Your code here...
})();
// ==UserScript==
// @name         ykm_douyin
// @namespace    https://github.com/LZHaini/test
// @version      0.1
// @description  下载dy网页视频
// @author       You
// @match        https://www.douyin.com/
// @match        https://www.douyin.com/user/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @run-at document-end

// @downloadURL https://update.greasyfork.org/scripts/451160/ykm_douyin.user.js
// @updateURL https://update.greasyfork.org/scripts/451160/ykm_douyin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
     #download_video{
        position:fixed;
        top:10px;
        right:10px;
        z-index:99999;
        background:red;
        padding:5px 10px;
        border-radius:5px;
    }
      .iqHX00br{
        display:none;
    }
  `)
    let DIV = document.createElement('div')
    DIV.id = 'download_video'
    DIV.innerHTML = '下载视频'
    document.body.appendChild(DIV)
    document.getElementById('download_video').addEventListener('click',function(e){
        let url_dy = document.querySelector('video>source').getAttribute('src')
        console.log('http:'+ url_dy)
        var name_dy1 = document.querySelector(".account-name>span>span>span>span>span>span>span")
        var name_dyc1 = name_dy1.innerText;
        //console.log(name_dyc1)
        var name_dy2 = document.querySelector(".npIvCX5K>span>span>span>span>span>span")
        var name_dyc2 = name_dy2.innerText;
        //console.log(name_dyc2)
        var name_dy = name_dyc1 + '_' + name_dyc2
        console.log(name_dy)
        if(url_dy){
            alert("下载中......" + '\n'+name_dy)
            GM_download('http:'+ url_dy,name_dy)
            alert("下载中成功")
        } else {
            alert("未找到")
        }
    })
})();
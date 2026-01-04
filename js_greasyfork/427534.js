// ==UserScript==
// @name         百度网盘文件目录打印脚本996
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  百度网盘文件目录打印脚本，在浏览器控制台打印当前目录的文件
// @author       小明
// @match        https://pan.baidu.com/s/*
// @match        https://pan.baidu.com/disk/*
// @icon         https://pan.baidu.com/m-static/base/static/images/favicon.ico?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427534/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95%E6%89%93%E5%8D%B0%E8%84%9A%E6%9C%AC996.user.js
// @updateURL https://update.greasyfork.org/scripts/427534/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%96%87%E4%BB%B6%E7%9B%AE%E5%BD%95%E6%89%93%E5%8D%B0%E8%84%9A%E6%9C%AC996.meta.js
// ==/UserScript==

// 根据网速自己设置时间间隔
var bbsInterval = 4000; // 在ADBlock之后运行

(function() {
    'use strict';
    function ppstr(arr){
        if(arr!=null && arr.length>0){
            var str='';

            for(var i=0;i<arr.length;i++){
                var item = arr[i];
                //console.info(item.innerText);
                str += item.innerText + '\n';
            }
            console.info('');
            console.info(str);
        }
    }

    setTimeout(function(){
        //打印分享页面
        var arr = document.getElementsByClassName('filename');
        ppstr(arr);
        //打印家页面
        arr = document.getElementsByClassName('aouhYOKy');
        ppstr(arr);
    }, bbsInterval)

})();
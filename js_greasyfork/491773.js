
// ==UserScript==
// @name         百度网盘链接自动进入下载
// @namespace    http://tampermonkey.net/
// @version      2024-04-06 v2
// @description  用于已经有密码的百度网盘链接，进入之后还要手动点击确定和下载的问题，暂不支持文件夹
// @author       xianfish
// @match        https://pan.baidu.com/share/init*
// @match        https://pan.baidu.com/s/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491773/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491773/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BF%9B%E5%85%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.onreadystatechange = function () {
        function urlParamToJson(urlParam) {
            let json = {};
            urlParam.trim()
                .split('&')
                .forEach(item => json[item.split('=')[0]] = item.split('=')[1]);

            return json;
        }
        function autoClick(path) {
            path=path.replace('?','')
            console.log(path)
            let obj=urlParamToJson(path)
            if(!obj.pwd) return
            //实现点击确认
            const submit= document.querySelector('#submitBtn')

            submit && submit.click()
        }
        function autoDownload(){
            const isDir=document.querySelector('.grid-switch')
            if(isDir)return

            const $aList=document.querySelectorAll('.g-button ')
            if(!$aList) return
            for(let i = 0; i < $aList.length; i++) {
                let id = $aList[i].getAttribute('data-button-index');
                console.log('id',id)
                if(id=='2') {
                    $aList[i].click()
                    break;
                }
            }
        }
        if (document.readyState === "complete") {
            console.log('path',document.location.search)
            let path=document.location.search
            if(!path){
                return
            }
            const href=document.location.href
            console.log(href)

            if(href.startsWith('https://pan.baidu.com/share/init')){
                console.log('11')
                autoClick(path)

            }else if(href.startsWith('https://pan.baidu.com/s/')){
                autoDownload()




            }



        }

    }

})();
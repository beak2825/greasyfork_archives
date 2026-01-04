// ==UserScript==
// @name         百度网盘的小文件加速下载
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一个练习用的小脚本
// @author       rytter
// @match        https://pan.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant             GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463324/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9A%84%E5%B0%8F%E6%96%87%E4%BB%B6%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463324/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E7%9A%84%E5%B0%8F%E6%96%87%E4%BB%B6%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let functions={
        getSourceFile(){
            var SourceFile=document.querySelector('.wp-s-core-pan').__vue__.selectedList;
            if (SourceFile.length > 1){
                alert("you have to choose only one file")
                return;
            }else{
                return SourceFile;
            }
        },
        get(url, headers, type, extra) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 204) {
                            requestObj.abort();
                            idm[extra.index] = true;
                        }
                        if (type === 'blob') {
                            res.status === 200 && base.blobDownload(res.response, extra.filename);
                            resolve(res);
                        } else {
                            resolve(res.response || res.responseText);
                        }
                    },
                    onprogress: (res) => {
                        if (extra && extra.filename && extra.index) {
                            res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                        }
                    },
                    onloadstart() {
                        extra && extra.filename && extra.index && (request[extra.index] = requestObj);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },
    }

    document.onkeydown = function (e) { // 对整个页面监听
        var keyNum = window.event ? e.keyCode : e.which; // 获取被按下的键值
        if (keyNum == 68) {
            //这一段是用来对一些参数进行初始化用的
            var downloadFile=functions.getSourceFile();//我们通过这个地方获得当前需要下载的文件
            if(downloadFile){
                console.log(downloadFile)
            }else{
                console.log("Error!Cant get the download file")
            }
            var fidList = "["+downloadFile['0'].fs_id+"]", url, res;
            fidList = encodeURIComponent(fidList);
            url = `https://pan.baidu.com/rest/2.0/xpan/multimedia?method=filemetas&dlink=1&fsids=${fidList}`;
            res = functions.get(url, {"User-Agent": "netdisk;8.2.0;android-android;4.4.4"});
            console.log("this is the result");
            res.then((result)=>{
                console.log(result.list['0'].dlink)
                window.open(result.list['0'].dlink)
            })
        }
    }
})();
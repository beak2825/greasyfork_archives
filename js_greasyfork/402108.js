// ==UserScript==
// @name         超星网盘直连生成
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://pan-yz.chaoxing.com/
// @grant        none
// @require      https://cdn.bootcss.com/clipboard.js/1.5.16/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/402108/%E8%B6%85%E6%98%9F%E7%BD%91%E7%9B%98%E7%9B%B4%E8%BF%9E%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/402108/%E8%B6%85%E6%98%9F%E7%BD%91%E7%9B%98%E7%9B%B4%E8%BF%9E%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var div = document.getElementsByClassName('ypActionBar')[0];
    if(div){
        var download_btn = document.createElement("button");
        download_btn.innerText = '复制直链';
        download_btn.setAttribute('class', 'fl download opt_btn copyBtn');
        download_btn.setAttribute('id', 'copy_direct_url_btn');
        download_btn.setAttribute('onclick', 'res.copy_direct_url();');
        download_btn.setAttribute('data-clipboard-text', '');
        download_btn.setAttribute('data-clipboard-action', 'copy');
        div.append(download_btn);
        document.getElementById('container').setAttribute('onclick', 'document.getElementById(\'copy_direct_url_btn\').setAttribute(\'style\',\'\');');
        res.copy_direct_url = function(){
        function createXmlHttpRequest(){
            try {
                return new XMLHttpRequest();
            }
            catch(e){
                return new ActiveXObject("Microsoft.XMLHTTP");
            }
        }
        function copyToClipboard(str) {
            document.getElementById('copy_direct_url_btn').setAttribute('data-clipboard-text', str);
            var clipboard = new Clipboard(".copyBtn");
            clipboard.on('success',function(e){
                console.log('复制成功！');
            });

            clipboard.on('error',function(e){
                console.log('复制失败！');
            });
        }
        if(res.choosedlen>0){
            var failedFilenames = new Array();
            var failedUrlsAmount = 0;
            var succeededUrls = new Array();
            var succeededFilenames = new Array();
            var succeededUrlsAmount = 0;
            for(var filenode in res.choosed){
                var xmlHttp = createXmlHttpRequest();
                xmlHttp.open("get", "http://pan-yz.chaoxing.com/external/m/file/"+filenode,false);
                xmlHttp.send();
                if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
                    var html_source = xmlHttp.responseText;
                    var download_url = html_source.match(/http:\/\/d0.*(?=')/)[0];
                    var filename = res.choosed[filenode]['name'];
                    download_url = download_url.replace(/(?<=fn=).*/, filename);
                    succeededUrls[succeededUrlsAmount] = download_url;
                    succeededFilenames[succeededUrlsAmount] = filename;
                    succeededUrlsAmount = succeededUrlsAmount+1;
                }
                else{
                    failedFilenames[failedUrlsAmount] = res.choosed[filenode]['name'];
                    failedUrlsAmount = failedUrlsAmount+1;
                }
            }
            if(succeededUrlsAmount>0){
                var str=succeededUrls[0];
                for(var i=1;i<succeededUrlsAmount;i=i+1){
                    str=str+'\n'+succeededUrls[i];
                }
                copyToClipboard(str);
                alert(succeededFilenames.toString()+' 等文件的直链已复制到剪切板！');
            }
            if(failedUrlsAmount>0){
                alert(failedFilenames.toString()+' 等文件请求直链失败！（不支持文件夹）')
            }
        }
        else{
            alert('未选中任何文件！');
        }
    }
    }
})();
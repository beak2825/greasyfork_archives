// ==UserScript==
// @name         WechatWebpArchive
// @namespace    http://github.com/palhotel
// @icon         https://www.likeada.com/favicon.ico
// @version      0.2
// @description  微信公众号文章辅助工具，可以提取公众号最短的链接，自动下载所有webp图片。
// @author       palhotel
// @match        https://mp.weixin.qq.com/s*
// @grant        unsafeWindow
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462693/WechatWebpArchive.user.js
// @updateURL https://update.greasyfork.org/scripts/462693/WechatWebpArchive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elem = document.createElement('div');
    elem.style = 'position:fixed;top:10px;left:10px;width:100px;border:1px solid #1aad19;color:#laad19;text-align:center;padding: 2px;';
    elem.className = 'wechat-webp-archive';

    /*
    * action: copy short url to clipboard
    */
    var hideElem = document.createElement('div');
    hideElem.style = 'width:0;height:0;z-index:-999;position:absolute;left:-2000px;top:-2000px;';
    hideElem.innerHTML = '<input id="wechat-webp-archive-hidden-input" value=""/>';
    elem.appendChild(hideElem);

    var copyToClipboard = function(event){
        const input = document.querySelector('#wechat-webp-archive-hidden-input');
        input.select();
        if (document.execCommand('copy')) {
            alert('已复制到剪贴板');
        }
    }
    var copyShortLink = function(event){
        var url = location.href;
        if(url.startsWith('https://mp.weixin.qq.com/s/')){
            const input = document.querySelector('#wechat-webp-archive-hidden-input');
            input.value = url;
            copyToClipboard();
            return;
        }
        var segs = url.split('&');
        var collected = [];
        collected.push(segs[0]);
        for(var i = 1; i < segs.length; i++){
            if(segs[i].startsWith('mid=') || segs[i].startsWith('idx=') || segs[i].startsWith('sn=')){
                collected.push(segs[i]);
            } else {
                continue;
            }
        }
        var newurl = collected.join('&');
        const input = document.querySelector('#wechat-webp-archive-hidden-input');
        input.value = newurl;
        console.log(newurl);
        copyToClipboard();
    };

    var button = document.createElement('button');
    button.style = 'width: 80%;height:32px;line-height:16px;padding:1px;background:#1aad19;color:#ffffff;border:none;'
    button.textContent = "精简URL";
    button.style.borderRadius = "4px";
    button.addEventListener("click", copyShortLink);

    function zipImages() {
        var zip = new JSZip();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var imgElems = document.querySelectorAll('img[data-src].rich_pages.wxw-img');
        // Loop through all images and add them to zip file
        const promises = [];

        for (let i = 0; i < imgElems.length; i++) {
            var img = imgElems[i];
            var attrs = img.attributes;
            let realUrl = '';
            let imgType = '';
            for(let j = 0; j < attrs.length; j++){
                if(attrs[j].name === 'data-type'){
                    imgType = attrs[j].value;
                } else if(attrs[j].name === 'data-src'){
                    realUrl = attrs[j].value;
                }
            }
            console.log(realUrl);

            promises.push(fetch(realUrl).then(response => response.blob()).then(blob => {
                zip.file('image' + i + '.' + imgType, blob);
                return i;
            }));
        }

        Promise.all(promises).then((blobs) => {
            // Generate zip file and download it
            zip.generateAsync({type:"blob"}).then(function(content) {
                var link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'images.zip';
                link.click();
            });
        });
    }
    /*
    * action: download pictures archive
    */
    var buttonImg = document.createElement('button');
    buttonImg.style = 'margin-top:2px;width: 80%;height:32px;line-height:16px;padding:1px;background:#1aad19;color:#ffffff;border:none;'
    buttonImg.textContent = "所有图片";
    buttonImg.style.borderRadius = "4px";
    buttonImg.addEventListener("click", zipImages);

    elem.appendChild(button);
    elem.appendChild(buttonImg);
    document.getElementsByTagName('body')[0].appendChild(elem);


})();
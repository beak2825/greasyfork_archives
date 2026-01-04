// ==UserScript==
// @name         必应图片下载
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  bing首页背景下载
// @author       装满奶茶的篮子
// @include      *://cn.bing.com/
// @include      *://cn.bing.com/?FORM=*
// @include      *://cn.bing.com/?scope=web&FORM=*
// @include      *://cn.bing.com/?scope=web&FORM=*#&ensearch=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427620/%E5%BF%85%E5%BA%94%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/427620/%E5%BF%85%E5%BA%94%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function(){
    'use strict';
    const biying = {};
    biying.url = null;
    biying.getUrl = function(){
        var backgroundImageurl = document.getElementById('bgImgProgLoad').getAttribute('data-ultra-definition-src');
        var element = document.getElementById('bgDiv');
        var bgUrl = element.style.backgroundImage.replace("url(\"","").replace("\")","");;
        var url;
        if(bgUrl == ""){
            url = backgroundImageurl;
        }else{
            url = bgUrl
        }
        return url;
    }
    biying.addElement = function(imageUrl){
        if(document.getElementById('my_download')){
            document.getElementById('sh_rdiv').removeChild(document.getElementById('my_download'));
        }
        var downloadimage ="data:image/png;base64,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";
        var newElement = document.createElement('a');
        newElement.id = 'my_download';
        newElement.setAttribute('download',`bg-${Math.random().toFixed(2)*100}`);
        newElement.setAttribute('href',imageUrl);
        newElement.setAttribute('target','_blank');
        var newDiv = document.createElement('div');
    
        newDiv.style.width = '40px';
        newDiv.style.height = '40px';
        newDiv.style.lineHeight = '40px';
        newDiv.style.overflow = 'hidden';
        newDiv.style.textAlign = 'center';
        newDiv.style.margin = '0px 10px';
        newDiv.style.backgroundPositionX = '0';
        var imgElement = document.createElement('img');
        imgElement.style.width = '100%';
        imgElement.setAttribute('src',downloadimage);
        newDiv.appendChild(imgElement);
        newElement.appendChild(newDiv);
        document.getElementById('sh_rdiv').appendChild(newElement);
    }
	
    if(window.location.href.indexOf("bing.com")!=-1){
        setInterval(function(){
            var url = biying.getUrl();
            if(biying.url !== url){
                biying.addElement(url);
                biying.url = url;
            }
        },100);
    }
})()
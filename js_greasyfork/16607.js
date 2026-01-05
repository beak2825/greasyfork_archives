// ==UserScript==
// @name           百度百科 无水印图片查看
// @icon           https://baidu.com/favicon.ico
// @namespace      https://greasyfork.org/zh-CN/users/20287-%E5%87%89%E5%A4%8F%E9%A3%8E%E6%AD%8C
// @version        1.3.3.1
// @description    查看百科最新版本、历史版本无水印图片，历史图册页面进入的图片暂时不支持。
// @match          http*://baike.baidu.com/picture/*
// @match          http*://baike.baidu.com/historypic/*
// @match          http*://baike.baidu.com/pic/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/16607/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/16607/%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91%20%E6%97%A0%E6%B0%B4%E5%8D%B0%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

// http*://baike.baidu.com/picview/history/* 似乎已经全部停用了
(function(){
    let cssSelector = location.href.indexOf('history') > -1 ? '#imgPicture' : 'div[class^=imgWraper_]>img';
    let imgPicture = document.querySelector(cssSelector);
    //替换有水印的图片，替换“原图”中的链接
    const changeImg = ()=>{
        let imgId;
        if(window.location.href.indexOf('pic=') > -1){
            imgId=window.location.href.split('pic=')[1].split('?')[0];
        }else{
            imgId = location.href.split('/0/')[1].split('?')[0];
        }
        if(imgPicture.src !== 'https://bkimg.cdn.bcebos.com/pic/' + imgId){
                imgPicture.src='https://bkimg.cdn.bcebos.com/pic/' + imgId;
                imgPicture.url=imgPicture.src;
        }
        if(location.href.indexOf('history') > -1){
            let a = document.querySelector('.tool-button.origin');
            a.href = imgPicture.src;
        }
    };
    //首次进入需要运行一次，后续的为监测自动执行
    let interval = setInterval(()=>{
        imgPicture = document.querySelector(cssSelector);
        if (imgPicture && imgPicture.src.indexOf('\?') !== -1)
        {
            changeImg();
            clearInterval(interval);
            //启动检测：          修改动作          监测对象与配置
            new MutationObserver(changeImg).observe(imgPicture, {
                attributes: true,
                childList: false,
                attributeFilter: ["src"],
                subtree: false
            });
        }
    }, 100);
})();

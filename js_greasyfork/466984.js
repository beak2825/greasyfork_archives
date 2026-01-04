// ==UserScript==
// @name         百度搜索链接预览及隐藏广告
// @namespace    https://www.yiuios.com
// @version      0.21
// @description  百度搜索链接预览，鼠标移动到则显示，由于安全问题，有些网站不允许被iframe包含，所以有些网站显示不了。
// @author       Sam
// @match      *://www.baidu.com/s*
// @match      https://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at      document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466984/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5%E9%A2%84%E8%A7%88%E5%8F%8A%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466984/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%93%BE%E6%8E%A5%E9%A2%84%E8%A7%88%E5%8F%8A%E9%9A%90%E8%97%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==


function on(selector,ev,fn){
    document.querySelector('body').addEventListener(ev,function(e){
        let list = this.querySelectorAll(selector);
        for(let item of list){
            if(item.isSameNode(e.target)){
                fn.call(item,e);
            }
        }
    })
}

function setCss(obj,attrs){
    for(let key in attrs){
        obj.style[key] = attrs[key];
    }
}

let box = null;
let currentSrc = null;
const getBox = function(){
    let box = document.querySelector('#floatbox');
    if(box){
        return box;
    }
    box = document.createElement('div');
    box.setAttribute('id','floatbox');
    box.setAttribute('style','position:absolute;pointer-events:none;background-color:#FFF;height:300px;box-shadow:0 0 32px rgba(0,0,0,0.2);z-index:9999;border-radius:10px;overflow:hidden;');
    document.body.appendChild(box);
    box.innerHTML = '<iframe frameborder="0" style="width:400%;transform:scale(0.25);height:400%;transform-origin: top left;" security="restricted" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>';
    return box;
};

//广告块透明度设置
function hideAds(){
    document.querySelectorAll('[posid]').forEach(item=>{
        if(item.classList.contains('ishidden')){
           return;
        }
        let bc = item.getBoundingClientRect();
        setCss(item,{
           position:'relative',
           maxHeight:'100px',
           overflow:'hidden',
           borderRadius:'10px',
        });
        let adTip = document.createElement('div');
        adTip.innerHTML = '<div style="text-align:center;">百度广告 <p style="font-size:14px;margin-top:10px;">已为您隐藏，鼠标移到这里可显示。</p></div>';
        adTip.setAttribute('style','border-radius:inherit;box-sizing:border-box;border:1px solid #EEE;background-color:rgba(255,255,255,0.8);backdrop-filter:blur(5px);width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:absolute;left:0;top:0;color:#666;font-size:20px;');
        item.appendChild(adTip);
        item.classList.add('ishidden');
        item.addEventListener('mouseover',function(){
           adTip.style.display = 'none';
           setCss(this,{
              transition:'all 0.5s',
              maxHeight:bc.height+'px',
           });
        });
        item.addEventListener('mouseleave',function(){
           adTip.style.display = 'flex';
            setCss(this,{
              transition:'all 0.5s',
              maxHeight:'100px',
           });
        });
    })
}

function watchAds(){
     let adTimer = setInterval(function(){
        if(document.querySelectorAll('[posid]:not(.ishidden)').length > 0){
            hideAds();
            console.log('已隐藏广告');
            clearInterval(adTimer);
        }
    },50);
}

let hvTimer = null;
(function() {
    'use strict';

    console.log(`%c你成功加载百度控制器`,'font-size:large;font-weight: bold;color:#FFF;background-color:red;padding:5px;')

   watchAds();

    setInterval(watchAds,500);

    let meta = document.createElement('meta');
    meta.setAttribute('http-equiv','Content-Security-Policy');
    meta.setAttribute('content','upgrade-insecure-requests');
    document.querySelector('head').appendChild(meta);

    
    on('a','mouseover',function(){
        clearTimeout(hvTimer);
        hvTimer = setTimeout(()=>{
            let bc = this.getBoundingClientRect();
            let scrollTop = document.documentElement.scrollTop;
            let scrollLeft = document.documentElement.scrollLeft;
            getBox().querySelector('iframe').src = '';
            setTimeout(()=>{
                getBox().querySelector('iframe').src = this.getAttribute('href').replace('http://','https://');
            },50);


            setCss(getBox(),{
                display:'block',
                left:scrollLeft+bc.left+bc.width+'px',
                top:scrollTop+bc.top+bc.height+'px',
            });
        },200);
    });

    on('a','mouseout',function(){
        clearTimeout(hvTimer);
    });

    document.body.addEventListener('mousedown',function(){
        getBox().style.display = 'none';
    })


})();
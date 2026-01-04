// ==UserScript==
// @name        保存图片
// @namespace   sleasy_su
// @match       *://*/*
// @grant       GM_download
// @grant       GM_registerMenuCommand
// @version     0.3
// @author      -
// @description alt+点击保存图片，列出页面所有图片，列出页面所有背景图
// @downloadURL https://update.greasyfork.org/scripts/405533/%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/405533/%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/**
 * 0.2
 *   1. improve saveImg()
 * 0.3
 *   1. imporve close button style
 */

init();

function init(){
    GM_registerMenuCommand('list bg', listBackgrounds);
    GM_registerMenuCommand('list img', listImages);
    document.body.addEventListener('click', saveImg);
}

function listBackgrounds(){
    var nodes = document.body.querySelectorAll('*');
    var backgrounds = [];
    var tmp = getBackground(document.body);
    tmp != null ? backgrounds.push(tmp) : null;
    backgrounds.forEach.call(nodes, v=>{
        tmp = getBackground(v);
        tmp != null && backgrounds.includes(tmp) != true ? backgrounds.push(tmp) : null;
    });
    showImages(backgrounds);

    function getBackground(node){
        var bg = getComputedStyle(node).backgroundImage;
        if(bg.includes('url')){
            return bg.replace(/.*url\("(.+)"\).*/, '$1');
        }else{
            return null;
        }
    }
}

function listImages(){
    var images = getSrcs(document.images);
    showImages(images);
}

function showImages(imageSet){
    var rawHTML = '';
    var container = document.createElement('div');
    var style = `
        #userjs-image-container{width:50%; max-height: 95%; position:fixed; top:20px; box-shadow: 0 0 2px 1px #ddd; background:#fff; margin-left:25%; overflow:auto; z-index:999;}
        #userjs-image-list{padding:10px;}
        #userjs-image-list>img{max-width:80%; max-height:600px; display:block; padding:10px; margin:10px auto; border: 1px solid #ddd; border-radius:3px;}
        button#userjs-btn{position:absolute; top:5px; right:5px; width:2em; height:2em; line-height:2em; border:1px solid #999; background-color:#fff;}`;
    imageSet.forEach(v => {
        rawHTML += '<img src="' + v + '"/>';
    });
    container.innerHTML = '<div id="userjs-image-list">' + rawHTML + '</div> <button id="userjs-btn" title="关闭">X</button>';
    container.id = 'userjs-image-container';
    document.body.append(container);
    document.querySelector('#userjs-btn').addEventListener('click', ()=>{document.querySelector('#userjs-image-container').remove();});
    addStyle(style);
}

function saveImg(e){
    var t = e.target;
    if(e.altKey){
        var img = null;
        e.preventDefault();
        if(t.tagName == 'IMG'){
            img = t;
        }else if(t.querySelectorAll('img').length > 1){
            alert('当前目标有多个图片');
            var images = getSrcs(t.querySelectorAll('img'));
            showImages(images);
            return;
        }else if(t.querySelector('img')){
            img = t.querySelector('img');
        }else{
            alert('找不到图片，可尝试“list img”');
            return;
        } 
        var name = '';
        if(t.alt != ''){
            name = t.alt + t.src.replace(/.+\./, '.');
        }else{
            name = t.src.replace(/.+\//, '');
        }
        GM_download(t.src, name);
    }
}

function getSrcs(imgs){
    var urls = [];
    urls.forEach.call(imgs, v=>{
        urls.includes(v.src) ? null : urls.push(v.src);
    });
    return urls;
}

function addStyle(styleStr, mode='append', id='my-style') {
    var styleElement = document.getElementById(id);
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.id = id;
        styleElement.innerHTML = styleStr;
        document.head.appendChild(styleElement);;
    } else {
        switch (mode) {
            case 'append':
                styleElement.innerHTML += styleStr;
                break;
            case 'override':
                styleElement.innerHTML = styleStr;
                break;
        }
    }
}
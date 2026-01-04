// ==UserScript==
// @name         知乎加载原图
// @namespace    https://greasyfork.org/
// @version      0.3.1
// @description  强制知乎加载原图，便于剪藏或保存网页
// @author       JMRY
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/408899/%E7%9F%A5%E4%B9%8E%E5%8A%A0%E8%BD%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/408899/%E7%9F%A5%E4%B9%8E%E5%8A%A0%E8%BD%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

let imgOriginSwitch=false;
let imgOriginInterval=null;

function strReplaceAll(str,org,tgt){
    if(typeof str!=`string`){
        return str;
    }else{
        return str.split(org).join(tgt);
    }
}

function applyImgOrigin(){
    let imgElements=$(`img`);
    for(let i=0; i<imgElements.length; i++){
        let curImgEl=imgElements.eq(i);

        if(curImgEl.attr(`class`)==`ztext-gif`){
            let curSrc=curImgEl.attr(`src`);
            if(!curSrc.includes(`.webp`)){
                curImgEl.attr(`src`,strReplaceAll(curSrc,`.jpg`,`.webp`));
            }
            $(`.GifPlayer-icon`).css(`display`,`none`);
        }else{
            //去除懒加载的class和attribute
            curImgEl.removeClass(`lazy`);
            curImgEl.attr(`data-lazy-status`,`ok`);

            let originImgUrl=curImgEl.attr(`data-original`);
            let curImgUrl=curImgEl.attr(`data-actualsrc`);

            curImgEl.attr(`data-current`,curImgUrl);
            curImgEl.attr(`src`,originImgUrl);
            $(`#originBu`).addClass(`button-origin-pic-changed`);
        }
    }
}

function restoreImgOrigin(){
    let imgElements=$(`img`);
    for(let i=0; i<imgElements.length; i++){
        let curImgEl=imgElements.eq(i);

        if(curImgEl.attr(`class`)==`ztext-gif`){
            let curSrc=curImgEl.attr(`src`);
            if(!curSrc.includes(`.jpg`)){
                curImgEl.attr(`src`,strReplaceAll(curSrc,`.webp`,`.jpg`));
            }
            $(`.GifPlayer-icon`).css(`display`,``);
        }else{
            let curImgUrl=curImgEl.attr(`data-current`);
            curImgEl.attr(`src`,curImgUrl);
            $(`#originBu`).removeClass(`button-origin-pic-changed`);
        }
    }
}

function loadOriginImg(){
    if(!imgOriginSwitch){
        applyImgOrigin();
        //由于知乎懒加载的问题，会导致滚动时图片自动还原，因此每秒修正一次
        imgOriginInterval=setInterval(()=>{
            applyImgOrigin();
        },1000);
        imgOriginSwitch=true;
    }else{
        restoreImgOrigin();
        clearInterval(imgOriginInterval);
        imgOriginSwitch=false;
    }
}

(function() {
    let curUrl=document.location.href;
    //判断URL中含/video/字段（即视频地址）时，不执行后续代码
    if(curUrl.includes(`/video/`)){
        return false;
    }

    $(`head`).append(`
    <style>
        .button-origin-pic{
            position:fixed;
            left:16px;
            bottom:32px;
            min-width:0px;
            padding:0px;
            width:72px !important;
            height:32px;
            z-index:999999;
            min-width:auto;
        }
        .button-origin-pic-changed{
            background-color: #228822 !important;
            border-color: #228822 !important;
        }
        .button-remove{
            width:32px !important;
            left:96px;
            background-color: #FF4444 !important;
            border-color: #FF4444 !important;
        }
        .button-remove:hover{
            background-color: #EE2222 !important;
            border-color: #EE2222 !important;
        }
    </style>`);

    $(`body`).append(`<button id="originBu" class="Button FollowButton Button--primary Button--blue button-origin-pic">加载原图</button>`);
    $(`body`).append(`<button id="removeBu" class="Button FollowButton Button--primary Button--blue button-origin-pic button-remove" title="删除按钮">×</button>`);
    $(`#originBu`).bind(`click`,()=>{
        loadOriginImg();
    });

    $(`#removeBu`).bind(`click`,()=>{
        restoreImgOrigin();
        $(`.button-origin-pic`).remove();
    });
})();
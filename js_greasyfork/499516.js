// ==UserScript==
// @name         Fanbox加载原图
// @namespace    https://greasyfork.org/
// @version      0.3.1
// @description  强制Fanbox加载原图，便于剪藏或保存网页
// @author       JMRY
// @match        https://*.fanbox.cc/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/499516/Fanbox%E5%8A%A0%E8%BD%BD%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/499516/Fanbox%E5%8A%A0%E8%BD%BD%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==

function strReplaceAll(str,org,tgt){
    if(typeof str!=`string`){
        return str;
    }else{
        return str.split(org).join(tgt);
    }
}

function getOriginImgUrl(url){
    if(!url) return null;
    let aElements=$(`a`);
    let urlSplit=url.split(`/`);
    for(let i=0; i<aElements.length; i++){
        let curAEl=aElements.eq(i);
        let curHref=curAEl.attr(`href`);
        if(!curHref) continue;
        let curHrefSplit=curHref.split(`/`);

        if(curHrefSplit[curHrefSplit.length-1] == urlSplit[urlSplit.length-1]){
            return curHref;
        }
    }
    return null;
}

function applyImgOrigin(){
    let imgElements=$(`img`);
    for(let i=0; i<imgElements.length; i++){
        let curImgEl=imgElements.eq(i);
        curImgEl.removeClass(`lazy`);
        curImgEl.attr(`data-lazy-status`,`ok`);
        if(!curImgEl.attr(`src-small`)){
           curImgEl.attr(`src-small`,curImgEl.attr(`src`));
        }
        let originImgUrl=getOriginImgUrl(curImgEl.attr(`src`));
        if(originImgUrl && curImgEl.attr(`src`)!=originImgUrl){
            curImgEl.attr(`src`,originImgUrl);
        }
    }
    $(`#originBu`).addClass(`button-origin-pic-changed`);
}

function restoreImgOrigin(){
    let imgElements=$(`img`);
    for(let i=0; i<imgElements.length; i++){
        let curImgEl=imgElements.eq(i);
        if(curImgEl.attr(`src-small`)){
            curImgEl.attr(`src`,curImgEl.attr(`src-small`));
            curImgEl.removeAttr(`src-small`);
        }
    }
    $(`#originBu`).removeClass(`button-origin-pic-changed`);
}

let imgOriginSwitch=false;
let imgOriginInterval=null;
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
            background-color:#FFF;
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

    console.log(`Fanbox Original Pic Done`);
})();
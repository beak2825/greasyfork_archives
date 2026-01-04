// ==UserScript==
// @name		预览哔哩哔哩视频的封面图片 bilibili cover image preview
// @namespace	http://saber.love/?p=3259
// @version		1.0.0
// @description	在视频列表上以及视频播放页面，按 ctrl+鼠标右键 ，就会在当前页面预览封面图，不过会阻止菜单默认事件
// @author		雪见仙尊 xuejianxianzun, jxhuo
// @include		*://*bilibili.com/*
// @license 	MIT
// @icon 		https://www.bilibili.com/favicon.ico
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/38160/%E9%A2%84%E8%A7%88%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E7%9A%84%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87%20bilibili%20cover%20image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/38160/%E9%A2%84%E8%A7%88%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E7%9A%84%E5%B0%81%E9%9D%A2%E5%9B%BE%E7%89%87%20bilibili%20cover%20image%20preview.meta.js
// ==/UserScript==

'use strict';

let is_found = false;
let ownsName = ['scrollx', 'groom-module', 'card-live-module', 'rank-item', 'spread-module', 'card-timing-module', 'l-item', 'v', 'vb', 'v-item', 'small-item', 'cover-normal', 'common-lazy-img', 'biref-img', 'game-groom-m', 'i-pin-c', 'anchor-card', 'special-module', 'chief-recom-item', 'bangumi-info-wrapper', 'similar-list-child', 'v1-bangumi-list-part-child', 'lv-preview', 'recom-item', 'misl-ep-img', 'media-info-inner', 'matrix', 'bangumi-list']; // 这里的class都是列表项本身
let parentsName = ['bm-v-list', 'rlist', 'topic-preview']; // 这里的class是列表项的父元素

let box_width = 600;
let box_height = 450;

let img_box = document.createElement('div');

img_box.style.width = 0 + 'px';
img_box.style.height = 0 + 'px';
img_box.style.position = 'fixed';
img_box.style.left = '50%';
img_box.style.top = '50%';
img_box.style.boxShadow = '0 0 10px 5px rgba(0, 0, 0, 0.3)';
img_box.style.overflow = 'hidden';

let img = document.createElement('img');
img_box.appendChild(img);
document.body.appendChild(img_box);

// 阻止默认的右击事件
document.body.oncontextmenu = function(e){
    return false;
};

// 获取触发右键菜单的元素
document.body.addEventListener('mousedown', function(e){
    let my_e = e || window.event;
	if (my_e.ctrlKey && my_e.button==2) { // 每次点击进行初始化
		is_found = false;
		getCoverImage(my_e.target);
	}

});

// 判断是否含有当前class
function hasClass(element, className) {
    return element.classList.contains(className);
}

function getCoverImage(element) {
    // 首先测试当前元素是否符合要求
    for (let i = 0; i < ownsName.length; i++) {
        if (hasClass(element, ownsName[i])) {
            if (ownsName[i] === 'anchor-card') { //anchor-card这个class是直播列表的
                if (!!element.style.backgroundImage) {
                    openCoverImage(/\/\/.*(?=")/.exec(element.style.backgroundImage)[0]);
                } else {
                    openCoverImage(/\/\/.*(?=")/.exec(element.querySelector('.room-cover').style.backgroundImage)[0]);
                }
            } else if (ownsName[i] === 'video-block') {
                openCoverImage(/\/\/.*(?=")/.exec(element.querySelector('.video-preview').style.backgroundImage)[0]);
            } else {
                openCoverImage(element.querySelector('img').src);
            }
            is_found = true;
            break;
        }
    }
    if (is_found === false) {
        // 之后测试父元素是否符合要求
        let parentNode = element.parentNode;
        for (let i = 0; i < parentsName.length; i++) {
            if (hasClass(parentNode, parentsName[i])) {
                // 获取父元素的子节点
                let childrens = parentNode.childNodes;
                for (let j = 0; j < childrens.length; j++) {
                    if (childrens[j] === element) {
                        openCoverImage(element.querySelector('img').src);
                        is_found = true;
                        break;
                    }
                }
            }
        }
        if (is_found === false) {
            // 如果没有到BODY，则循环返回父元素进行查找
            if (parentNode.tagName !== 'BODY') {
                return getCoverImage(parentNode);
            } else {
                // 如果到了BODY仍然没有找到，尝试直接获取视频播放页的封面。优先级要低，如果放在前面的话，用户点击播放页面的其他封面就不起作用了
                // 尝试直接获取储存封面图的IMG标签
                let cover_img = document.querySelector('.cover_image');
                if (cover_img !== null) {
                    openCoverImage(cover_img.src);
                    return false;
                }
                // 有些视频要从meta中获取封面图
                let meta_info = document.querySelector('meta[itemprop="image"]');
                if (meta_info !== null) {
                    openCoverImage(meta_info.content);
                    return false;
                }
                // 番剧播放页，使用另一个meta
                let bangumi_meta_info = document.querySelector('meta[property="og:image"]');
                if (bangumi_meta_info !== null) {
                    openCoverImage(bangumi_meta_info.content);
                    return false;
                }
                // 最后也没找到
                console.log('cover not found');
                return false;
            }
        }
    }
}

function openCoverImage(url) {
    let coverImageBigUrl = url;
    // 去除url中的裁剪标识
    if (url.indexOf('@') > -1) { //处理以@做裁剪标识的url
        coverImageBigUrl = url.split('@')[0];
    }
    if (url.indexOf('jpg_') > -1) { //处理以_做裁剪标识的url
        coverImageBigUrl = url.split('jpg_')[0] + 'jpg'; //默认所有图片都是jpg格式的。如果不是jpg，则可能会出错
    }
    if (url.indexOf('png_') > -1) { //处理以_做裁剪标识的url
        coverImageBigUrl = url.split('png_')[0] + 'png';
    }
    if (url.indexOf('/320_200/') > -1) { //有时裁剪标识是在后缀名之前的 目前主要发现的是“番剧”板块的列表里有，但尚不清楚其他地方的情况
        coverImageBigUrl = url.replace('/320_200', '');
    }


    open_img_in_current_window(coverImageBigUrl);
}

//新增的本页面打开图片功能
function open_img_in_current_window(img_src){

    img.src = img_src;
    

    img.onload = function () {
        
        img_box.style.width =  box_width + 'px';
        img_box.style.height = box_height + 'px';
        
        let img_natural_width = img.naturalWidth;
        let img_natural_height = img.naturalHeight;

        this.onclick = function(){
            img_box.style.width = 0 + 'px';
            img_box.style.height = 0 + 'px';
        }

        if(img_natural_width >= img_natural_height){

            img.style.width = box_width + 'px';
            let img_height =  parseInt(box_width * img_natural_height/img_natural_width);

            img_box.style.height = img_height + 'px';
            img_box.style.marginLeft = -box_width/2 + 'px';
            img_box.style.marginTop = -img_height/2 + 'px';

        }else if(img_natural_height > img_natural_width){

            img.style.height = box_height+'px';

            let img_width = parseInt(box_height*img_natural_width/img_natural_height);
            img_box.style.width = img_width + 'px';
            img_box.style.marginTop = -box_height/2 + 'px';
            img_box.style.marginLeft = -img_width/2 + 'px';

        }
    };
}
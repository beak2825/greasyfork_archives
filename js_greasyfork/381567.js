// ==UserScript==
// @name         連結自動跳轉+圖床圖片自動顯示 v1.3
// @namespace    https://www.facebook.com/airlife917339
// @version      1.0
// @description  feel free to donate: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @match        http://www.alabout.com/j.phtml?url=*
// @match        http://www.imgflare.com/*
// @match        http://www.imgbabes.com/*
// @match        https://imagetwist.com/*
// @match        http://img599.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381567/%E9%80%A3%E7%B5%90%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%2B%E5%9C%96%E5%BA%8A%E5%9C%96%E7%89%87%E8%87%AA%E5%8B%95%E9%A1%AF%E7%A4%BA%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/381567/%E9%80%A3%E7%B5%90%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89%2B%E5%9C%96%E5%BA%8A%E5%9C%96%E7%89%87%E8%87%AA%E5%8B%95%E9%A1%AF%E7%A4%BA%20v13.meta.js
// ==/UserScript==
/*
支援列表 = Alabout/imgflare/imgbabes/imagetwist/img599
*/

var url;
var result;
var img_tag;

if(seach_alabout()) {
    alabout();
} else if(seach_img()){
    img();
} else if(seach_imagetwist()) {
    imagetwist();
} else if(seach_img599()) {
    img599();
}

function seach_alabout() {
    url = location.href;
    result = (url.search('http://www.alabout.com/j.phtml') >=0) ? 1 : 0 ;
    return result;
}

function alabout() {
    window.location.href = document.getElementsByTagName("a")[0].href;
}

function seach_img() {
    url = location.href;
    result = (url.search('http://www.imgflare.com/') >=0 ||
              url.search('http://www.imgbabes.com/') >=0
             ) ? 1 : 0 ;
    return result;
}

function img() {
    if (window.Decode) {
        console.log('該function存在');
        Decode();
    } else {
        console.log('該function不存在');
    }
    window.location.href = document.getElementById("this_image").src;
}

function seach_imagetwist() {
    url = location.href;
    result = (url.search('https://imagetwist.com/') >=0) ? 1 : 0 ;
    return result;
}

function imagetwist() {
    //window.location.href = document.getElementsByClassName("pic img img-responsive")[0].currentSrc;
    //window.opener=null;
    //window.close();

    img_tag = document.getElementsByClassName("pic img img-responsive")[0];
    document.getElementsByTagName('div')[0].remove(); // 清空
    document.body.append(img_tag); // 插入
}

function seach_img599() {
    url = location.href;
    result = (url.search('http://img599.net/') >= 0 && !url.search('.md.') >= 0 ) ? 1 : 0 ;
    return result;
}

function img599() {
    if(document.getElementsByTagName('link') != null) {
        window.location = document.getElementsByTagName('link')[6].href
    }
}

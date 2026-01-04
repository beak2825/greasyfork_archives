// ==UserScript==
// @name         抖音图文下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  襄音抖音图文下载脚本
// @author       pythonk
// @match        *://*.douyin.com/note/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461934/%E6%8A%96%E9%9F%B3%E5%9B%BE%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/461934/%E6%8A%96%E9%9F%B3%E5%9B%BE%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

var index = 1;

(function() {
    'use strict';
    document.getElementsByTagName('audio')[0].pause(); // 获取audio元素并暂停播放音乐
    addButton();
})();

// 2. 添加一个下载按钮到页面上
function addButton() {
    let ul = document.getElementsByClassName('AySWwOvG')[0]; //取点赞节点
    let div = document.createElement('div');
    div.style.width = '30px'
    div.style.height = '30px'
    // div.style.marginTop = '10px'
    div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqVJREFUaEPtmT1rFUEUhp+DlY2NVoJgo4gKEm20UkHs1EZTRIQUQcTOSsvYWPgDDBYiiBBQQUkEsVJBbbSw0BQiau8PsHxlYG7cbGZ2Z/bOknthp9ydPed95pz5OLPGlDebcv0MAKEISroPXK29u21mi6Uj3ksEJCkk1MyK+ytu0AkfADLybIhAZBIPcyA1i4YUmqoUknQJuAt8AO6Y2VoJAEkXgVvAT2AxZje4t6Tmmhf/pNL/GzAbcpazD0g6BzwHtnnbUbudAQLiR7aCzlIBJJ0FXgDba+KSIZImsaSvwKFItDY5SwGQdBJYAXZE7C6b2VxbhqQCPAYuNxjbANEGIOk4sArsarCZdPhLBTgIuPyPRcHpWIdoApA0A7wEdjeIf2pms22j794nAfgDWjKEhwn5P+zF7y0hPgvAQxwAniVEIhap78D+UuKzATzEHuBVC0RK9Ot9ktOm+mFyClU/krQTeFcQopP4ThEYgUhya/enAhCdxY8FUAFp2iPaUmks8UUA/LzoAjG2+GIAHSCKiC8KkAFRTPwmgBL3OZK+AEciyZ8lXtJDYL5i6w9wr3q/tGEZbTvDtM3IysT+CJyo9c8Vfwp4E/D51sxOj573AuDTyR0AzwB/3ZHZzG6kDoD/fmsBcsSG+koaANYHpo87zbYIFY0AsM/MfrQ5Lfle0jVgqcgkBpKqo8IArtx0BX+95a9C3oJbRdxq8ruk0LotSa5wcr4WIn4aAX4BTdVSn9pTba+a2fnYPvAIuJJqaYv6LZnZ9RiA+y3kfg9Ncpszs+UggN8BPwPHJpTgppm5q83/S3xkF3wNuFuzSWorZnahLihaE0tyfxSP+mg03eH0CenumlzZ+t7MHoQcdSrq+1Sca3sAyB2x0v2HCJQe0Vx7Ux+Bf62bO0D1hp22AAAAAElFTkSuQmCC")'
    div.style.backgroundSize = 'contain'
    div.style.backgroundRepeat = 'no-repeat'
    div.onclick = getImgs; // 设置按钮点击事件
    // let button = document.createElement('button'); // 创建一个按钮节点
    // button.innerText = '下载'; // 设置按钮显示文本
    // button.onclick = getImgs; // 设置按钮点击事件
    // div.appendChild(button); // 将按钮添加到自己创建的ul节点内部
    ul.after(div); // 在点赞节点后追加
}
function getImgs() {
  // <link data-react-helmet="true" rel="canonical" href="https://www.douyin.com/note/7210296539120422184"/>
    let url = document.querySelector('link[rel="canonical"]').href
    let regexp = /\d+$/;
    let result = regexp.exec(url);
    console.log(result[0]); // Output: 7210296539120422184
    let imgs = document.getElementsByClassName('V5BLJkWV'); // 获取所有图片（.webp）
    // 遍历图片数组
    for (let i = 0; i < imgs.length; i++) {
        let url = imgs[i].src; // 获取图片的url
        download(url,result[0]); // 下载
    }
}

function download(url,filename) {
      var x = new XMLHttpRequest();
      x.open("GET", url, true);
      x.responseType = 'blob';
      x.onload = function (e) {
        var newUrl = window.URL.createObjectURL(x.response);
        var a = document.createElement('a');
        a.href = newUrl;
        console.log(newUrl);
        a.download = 'img_' + filename +'_'+index + '.webp'; //下载后的文件名 index | filename
        a.click();
        index++;
      }
      x.send();
}
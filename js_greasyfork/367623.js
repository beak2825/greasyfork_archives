// ==UserScript==
// @name         第一弹diyidan.com cos图片下载
// @version      0.1
// @description  在第一弹（diyidan.com）的cos页面上批量下载。
// @author       hentailing
// @match        *://www.diyidan.com/main/post/*
// @icon 		https://www-static.diyidan.net/static/image/favicon.ico
// @run-at		document-end
// @namespace https://greasyfork.org/users/184461
// @downloadURL https://update.greasyfork.org/scripts/367623/%E7%AC%AC%E4%B8%80%E5%BC%B9diyidancom%20cos%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/367623/%E7%AC%AC%E4%B8%80%E5%BC%B9diyidancom%20cos%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
"use script";
//base64转blob
const dataURLtoBlob = function(dataurl){
        let arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {
            type: mime
        });
    };
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.setAttribute('id', 'the-div');
    div.setAttribute('style', 'display: none;');
    //body.appendChild('<canvas id="canvas" style="margin:20px auto;display: none;">当前浏览器不支持canvas</canvas>');
    body.appendChild(div);
    const download  = function(url){
        console.log('开始下载：'+url);
        let cav = document.createElement('canvas');
        cav.setAttribute('id', 'canvas');
        cav.setAttribute('style', 'margin:20px auto;display: none;');
        cav.innerText = '当前浏览器不支持canvas';
        let theDiv = document.getElementById('the-div');
        theDiv.innerHTML = '<canvas id="canvas" style="margin:20px auto;display: none;">当前浏览器不支持canvas</canvas>';
        let canvas = document.getElementById('canvas');
        let index = url.lastIndexOf("\/");
        const filename = url.substring(index+1, url.length);
        index = url.lastIndexOf(".");
        const ext = url.substring(index+1, url.length);
        let type;
        switch (ext){
            case 'jpg':
                type = 'image/jpg';
                break;
            case 'png':
                type = 'image/png';
                break;
            case 'gif':
                type = 'image/gif';
                break;
            default :
                console.log('图片后缀有误');
                return false;
        }
        let imgObj = new Image();
        imgObj.src = url;
        imgObj.setAttribute('crossOrigin', 'anonymous');
        imgObj.onload = function(){
            canvas.width = this.width;
            canvas.height = this.height;
            canvas.getContext("2d").drawImage(this, 0, 0);
            let data = canvas.toDataURL(type);
            let blob = dataURLtoBlob(data);
            let downloadUrl = URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.setAttribute('href', downloadUrl);
            a.setAttribute('download', filename);
            body.appendChild(a);
            a.click();
        };
    };
//声明自动下载的函数
let downloadAll = function(){
    alert('点击成功');
    // 1楼的图片
    let pic_1L = document.querySelectorAll('.user_post_content a');
    if (pic_1L.length > 0) {
        for (let index = 0; index < pic_1L.length; index++) {
            download(pic_1L[index].href);
        }
    }
    // 楼主在底下发的图
    let louzhu = document.querySelectorAll('.louzhu'); //第一个.louzhu就是1楼，所以跳过
    if (louzhu.length > 1) {
        for (let index = 1; index < louzhu.length; index++) {
            const pic_else_lou = louzhu[index].parentNode.parentNode.querySelectorAll('.post_content_img a');
            for (let index2 = 0; index2 < pic_else_lou.length; index2++) {
                download(pic_else_lou[index2].href);
            }
        }
    }
};
let clickDiv = document.createElement('div');
clickDiv.style = "font-size: 18px ;position: fixed; top:180px; right: 1px; width: 150px; height: 90px; background-color: #002DFF; border-radius: 10px; color: white;text-align: center; line-height: 90px;cursor:pointer";
clickDiv.id = 'clickDiv';
clickDiv.innerText = '点我下载';
let user_post_title1 = document.querySelector('body');
user_post_title1.append(clickDiv);
let theDiv = document.getElementById('clickDiv');
theDiv.addEventListener('click', downloadAll);
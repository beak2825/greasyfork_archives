// ==UserScript==
// @name         export image from myppt and lurl
// @name:zh-TW   從myppt和lurl中導出圖片以及填寫密碼
// @name:en.     export image from myppt and lurl
// @namespace    normaltool
// @version      0.1.3
// @description:zh-TW  導出myppt和lurl的圖片在網頁的底部，並且自動填寫日期密碼
// @description  Derive image to the bottom of web page and fill the password gennerated by update date
// @author       jw23
// @match        https://*.myppt.cc/*
// @match        https://*.lurl.cc/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/498664/export%20image%20from%20myppt%20and%20lurl.user.js
// @updateURL https://update.greasyfork.org/scripts/498664/export%20image%20from%20myppt%20and%20lurl.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var images = [];
    let deaultpassword = function(cssSelector){
        try{
        return /\d{4}-(\d{2}-\d{2})/.exec(document.querySelector(cssSelector).textContent)[1].replace('-','')
        }catch(e){
            console.log("error in password:",e)
        }
    }
    if (document.URL.indexOf('myppt.cc') != -1) {
        fillPassword('#pasahaicsword',deaultpassword('.form-group.has-feedback'))
        let links = document.querySelectorAll("link[rel=preload]");
        for (let link of links) {
            let imagesLinks = link.getAttribute('href');
            images.push(imagesLinks)
        }
    } else if (document.URL.indexOf('lurl.cc')) {
        fillPassword('#password',deaultpassword('.form-group.has-feedback'))
        let scripts = document.querySelectorAll('.gameIn script')
        for (let script of scripts) {
            if (script.textContent.indexOf('canvas_img') != -1) {
                let res = /https:\/\/.+.lurl.cc\/.+g/.exec(script.textContent)
                images.push(res[0])
            }
        }
    }

    for (let image of images) {
        let img = document.createElement("img");
        img.src = image
        img.style.width = "100%"
        document.body.appendChild(img);
    }
})();
// 从URL中提取文件名
function getFilename(url) {
    return url.substring(url.lastIndexOf('/') + 1);
}
function fillPassword(selector, password) {

    let input = document.querySelector(selector)
    if (input !== null) {
        input.value = password;
        // document.querySelector('#main_fjim60unBU').click()
    }
}



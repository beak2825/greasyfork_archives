// ==UserScript==
// @name         阿里云文件筛选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  阿里云文件筛选!
// @author       You
// @match        https://www.aliyundrive.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472560/%E9%98%BF%E9%87%8C%E4%BA%91%E6%96%87%E4%BB%B6%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472560/%E9%98%BF%E9%87%8C%E4%BA%91%E6%96%87%E4%BB%B6%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==
(function () {
    'use strict';
    let arrays = [];
    let flag = 1;
    let intervalId = setInterval(() => {
        var root = document.getElementsByClassName('grid-card-container')
        console.log(root)
        if (root && root.length != 0) {
            for (let index = 0; index < root.length; index++) {
                const element = root[index];
                arrays.push(element)
            }
            flag = 2;
            clearInterval(intervalId)
        }
    }, 1000);
    while(true){
        console.log(flag)
        if(flag == 2){
            break;
        }
    }
    var typeSelect = document.createElement('div');
    typeSelect.innerHTML = createCheckBox()
    typeSelect.style.position = 'fixed';
    typeSelect.style.width = '300px'
    typeSelect.style.top = '10px';
    typeSelect.style.right = '10px';
    typeSelect.style.backgroundColor = '#FFF';
    console.log('我是分割线---------------')
    console.log(arrays)

    document.body.appendChild(typeSelect);


    function createCheckBox() {
        return "<input type ='checkbox' value ='mp3' name ='type' id ='saliyunp_mp3_id' /> MP3" +
            "<input type ='checkbox' value ='pdf' name ='type' id ='saliyunp_pdf_id' />PDF" +
            "<input type ='checkbox' value ='html' name ='type' id ='saliyunp_html_id' /> HTML"
    }

})();
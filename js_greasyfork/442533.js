// ==UserScript==
// @name         v2ex 单独看某条回答-方便截图
// @namespace    mscststs
// @version      0.2
// @description  在帖子主页单独展示某条帖子，方便截图
// @author       mscststs
// @match        *://*.v2ex.com/t/*
// @match        *://v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @license      ISC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442533/v2ex%20%E5%8D%95%E7%8B%AC%E7%9C%8B%E6%9F%90%E6%9D%A1%E5%9B%9E%E7%AD%94-%E6%96%B9%E4%BE%BF%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442533/v2ex%20%E5%8D%95%E7%8B%AC%E7%9C%8B%E6%9F%90%E6%9D%A1%E5%9B%9E%E7%AD%94-%E6%96%B9%E4%BE%BF%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let last = null;

    window.onlyshow = function(id){
        if(last === id){
            last = null;
            [...document.querySelectorAll(`.box .cell[id^=r_]`)].forEach(node=>{
                if(node.id !== `r_${id}`){
                    node.style.display = "block";
                }
            })
        }else{
            last = id;
            [...document.querySelectorAll(`.box .cell[id^=r_]`)].forEach(node=>{
                if(node.id !== `r_${id}`){
                    node.style.display = "none";
                }
            })
        }
    },
    [...document.querySelectorAll(".box .cell .fr .thank_area")].forEach(node=>{
        const id = node.id.split("_").pop();
        node.innerHTML = `<a href="#;" onclick="onlyshow(${id})" class="" style="color: #ccc;margin-right:20px">单独看</a>` + node.innerHTML
    })

    // Your code here...
})();
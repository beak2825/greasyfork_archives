// ==UserScript==
// @name         网道/Wangdoc 微改
// @namespace    https://wangdoc.com/
// @version      0.1
// @description  网道目录悬浮、代码复制，wangdoc细微修改
// @author       小邋嚃
// @license MIT
// @match        https://wangdoc.com/*
// @icon         https://wangdoc.com/typescript/assets/icons/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482005/%E7%BD%91%E9%81%93Wangdoc%20%E5%BE%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/482005/%E7%BD%91%E9%81%93Wangdoc%20%E5%BE%AE%E6%94%B9.meta.js
// ==/UserScript==

const setPosition = (el) => {
    el.style.position = 'fixed'
    el.style.top = 10 + 'px'
    el.style.left = 10 + 'px'
}

const delePosition = (el) => {
    el.removeAttribute('style');
}

const hint = (el) => {
    el.style.color = '#27c93f'
    el.innerText = '复制成功'
    setTimeout(()=>{
        el.style.removeProperty('color')
        el.innerText = 'copy'
    },2000)
}

const copy = () => {
    let pres = [...document.querySelectorAll('pre')]
    for(let i = 0; i < pres.length; i++){
        let el = pres[i]
        let content = el.querySelector('code').innerText
        el.style.position = 'relative'
        let copy = document.createElement('span')
        copy.innerText = 'copy'
        copy.style.position = 'absolute'
        copy.style.top = '5px'
        copy.style.right = '5px'
        copy.style.cursor = 'pointer'
        copy.onclick = async function(){
            try{
                await navigator.clipboard.writeText(content)
                hint(copy)
            }catch(err){
                console.log(err)
            }
        }
        el.appendChild(copy)
    }
}

const init = () => {
    let articleToc = document.querySelector('.article-toc')
    let rect = articleToc.getBoundingClientRect()
    let top = articleToc.offsetTop + articleToc.offsetParent.offsetTop
    let bool = false


    document.body.onscroll = function() {
         let distance = document.documentElement.scrollTop
         if(distance > top && !bool){
             bool = true
             setPosition(articleToc)
         }else if(distance < top && bool){
             bool = false
             delePosition(articleToc)
         }
    }

}




(function() {
    'use strict';
    init()
    copy()
})();
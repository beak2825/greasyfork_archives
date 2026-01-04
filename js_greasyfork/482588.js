// ==UserScript==
// @name         BNU CLass
// @namespace    http://zyfw.bnu.edu.cn/
// @version      2023-12-18
// @description  Bnu Class Select Script
// @author       MosRat
// @match        http://zyfw.bnu.edu.cn/frame/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482588/BNU%20CLass.user.js
// @updateURL https://update.greasyfork.org/scripts/482588/BNU%20CLass.meta.js
// ==/UserScript==


function remove_disable(ele) {
    ele.removeAttribute('disabled');
}

function modify_element() {
    const frame = document.getElementById('frmDesk').contentWindow
    let all = frame.document.getElementsByTagName('input')
    for (let i = 0; i < all.length; i++) {
        let e = all[i]
        console.log(e)
        remove_disable(e)
    }

    remove_disable(frame.document.getElementById('kcfw'))

    frame.document.getElementById('nj').setAttribute('value', '2021')
    frame.document.getElementById('initQry').setAttribute('value', '0')
    frame.document.getElementById('zydm').setAttribute('value', 'BQ108')
    let opts = document.createElement('option')
    opts.setAttribute('value', '2023,1')
    frame.document.getElementById('njzy').removeAttribute('disabled')//没啥用，好看而已
    opts.innerHTML = "2023-2024学年春季学期" //没啥用，好看而已
    frame.document.getElementById('njzy').setAttribute('value', 'BQ108')
}

(function () {
    'use strict';
    const element = document.createElement('button')
    const li = document.createElement('li')
    element.innerText = '选课！'
    element.onclick = modify_element
    element.style.backgroundColor = '#7ebff6'
    element.style.color = '#f8e6e6'
    element.style.border=""
    // element.style.height = '20px'
    // element.style.width = '100px'
    // element.style.textAlign = 'center'
    // element.style.padding = '0'
    // element.style.margin = '0'
    element.style.textAlign = 'center'
    element.style.textDecorationLine = 'center'
    const bar = document.getElementById('navbar').children[0]
    li.appendChild(element)
    bar.appendChild(li)

    // Your code here...
})();